package com.tundra.tundraxr

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.tundra.tundraxr.capture.DeviceCropper
import androidx.lifecycle.viewModelScope
import com.tundra.tundraxr.assistant.Command
import com.tundra.tundraxr.assistant.parseCommand
import com.tundra.tundraxr.data.CaptureItem
import com.tundra.tundraxr.data.CaptureKind
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.CloudBrain
import com.tundra.tundraxr.data.DemoBrain
import com.tundra.tundraxr.data.Device
import com.tundra.tundraxr.data.ImageMatch
import com.tundra.tundraxr.data.cropRegion
import com.tundra.tundraxr.data.LocalBrain
import com.tundra.tundraxr.data.Manual
import com.tundra.tundraxr.data.ManualTarget
import com.tundra.tundraxr.data.SyncState
import com.tundra.tundraxr.data.TundraBrain
import kotlinx.coroutines.Job
import kotlinx.coroutines.async
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull
import java.io.File

/** Where speech goes: into the device record, or to the brain as a question. */
enum class VoiceTarget { Note, Ask }

/** What the assistant is busy with, shown in the bar until it's done. */
data class Task(val label: String, val kind: TaskKind)

enum class TaskKind { Camera, Analyze, Manual, Think, Save }

/** One thing the engineer said while recording, kept for the documentation. */
data class Narration(val at: String, val text: String)

/** The one result card that hangs under the bar. */
sealed interface BarCard {
    /** A photo being analysed, then matched to a device in the inventory, then the countdown to recording. */
    data class Photo(
        val file: String?,
        val lines: List<String> = emptyList(),
        val device: Device? = null,
        val countdown: Int? = null,
        /** The on-device crop as fractions (left, top, right, bottom); null = the whole view was kept. */
        val box: List<Float>? = null,
        val cropMs: Long? = null,
        val phase: PhotoPhase = PhotoPhase.Done,
    ) : BarCard
    data class Answer(val messageId: Long) : BarCard
    data class ManualOpened(val title: String, val target: ManualTarget?) : BarCard
    data class Saved(val device: Device, val videoSec: Int, val comments: Int, val photos: Int, val sent: Boolean) : BarCard
    /** Documentation on its way into Tundra: each step as it happens, then the summary. */
    data class Upload(
        val title: String,
        val device: Device,
        val steps: List<UploadStep>,
        val summary: List<String> = emptyList(),
        val transcript: String? = null,
        val done: Boolean = false,
    ) : BarCard
    data class Notice(val text: String) : BarCard
    /** Overview of the device being documented. */
    /** What the image search found in the selected region. */
    data class RegionMatch(val crop: String?, val match: ImageMatch) : BarCard
    data class DeviceInfo(val device: Device, val manualTitle: String?, val captures: Int) : BarCard
}

/**
 * Region capture: a frozen photo of the engineer's view, the box they drew on it (fractions
 * left, top, right, bottom), and what the image search made of that region.
 */
data class RegionState(
    val file: String?,
    val box: List<Float>? = null,
    val crop: String? = null,
    val searching: Boolean = false,
    val matches: List<ImageMatch> = emptyList(),
)

/** How an identification photo is shown: popped up with its crop, flying into the cloud, then searched. */
enum class PhotoPhase { Captured, Sending, Searching, Done }

enum class StepKind { Video, Transcript, Summary, Note }
enum class StepState { Pending, Running, Done, Failed, Skipped }
data class UploadStep(val kind: StepKind, val label: String, val state: StepState = StepState.Pending, val detail: String? = null)

/** What continuous dictation is for: a video's narration, or a spoken note on its own. */
enum class Dictation { Video, Note }

/** Things only the activity can do (it owns the camera). */
sealed interface Effect {
    data object TakePhoto : Effect
    data object StartRecording : Effect
    data object StopRecording : Effect
    /** Listen to everything (no pinch) until [StopDictation]. */
    data object StartDictation : Effect
    data object StopDictation : Effect
}

data class SessionState(
    val device: Device? = null,
    val devices: List<Device> = emptyList(),
    val manual: Manual? = null,
    /** Null until the first contact attempt with the laptop brain. */
    val brainOnline: Boolean? = null,
    val cameraReady: Boolean = false,
    val isRecording: Boolean = false,
    val recordingSec: Int = 0,
    val captures: List<CaptureItem> = emptyList(),
    val listeningFor: VoiceTarget? = null,
    val liveTranscript: String = "",
    /** Shown briefly when voice input fails, so it never fails silently. */
    val voiceError: String? = null,
    val chat: List<ChatMessage> = emptyList(),
    val askDraft: String = "",
    val showAsk: Boolean = true,
    val showManual: Boolean = false,
    val manualTarget: ManualTarget? = null,
    val photoFlash: Long = 0L,
    // ── Hands-free ──
    /** Someone is talking right now. */
    val hearing: Boolean = false,
    val micLevel: Float = 0f,
    /** Live words of the current utterance. */
    val heard: String = "",
    val task: Task? = null,
    val card: BarCard? = null,
    val narration: List<Narration> = emptyList(),
    val region: RegionState? = null,
    /** Continuous dictation in progress, and the note being dictated (for [Dictation.Note]). */
    val dictating: Dictation? = null,
    val noteLines: List<Narration> = emptyList(),
    /** The reply shown in full in the answer panel (charts, tables, long text), by message id. */
    val answerPanel: Long? = null,
) {
    val photoCount get() = captures.count { it.kind == CaptureKind.Photo }
    val syncedCount get() = captures.count { it.sync != SyncState.Sending && it.sync != SyncState.Failed }
}

class SessionViewModel(app: Application) : AndroidViewModel(app) {

    // Crops identification photos to the device on the headset (ExecuTorch) before image search.
    private val cropper = DeviceCropper(app)

    // Demo builds (tundra.demo=true) answer from the scripted brain so the UI can be tested offline.
    // Identification photos are cropped here (so the island can show the crop), not in the brain client.
    // With a Tundra key the headset goes straight to Tundra Cloud; without one, through the laptop.
    private val brain: TundraBrain = when {
        BuildConfig.TUNDRA_DEMO -> DemoBrain()
        BuildConfig.TUNDRA_API_KEY.isNotEmpty() -> CloudBrain(BuildConfig.TUNDRA_API_KEY)
        else -> LocalBrain(BuildConfig.TUNDRA_SERVER_URL)
    }

    private val _state = MutableStateFlow(SessionState())
    val state: StateFlow<SessionState> = _state.asStateFlow()

    private val _effects = Channel<Effect>(Channel.BUFFERED)
    val effects = _effects.receiveAsFlow()

    private val sessionStart = System.currentTimeMillis()
    private val sessionId = "s_$sessionStart"
    private var nextId = 1L
    private var recordingJob: Job? = null
    private var flowJob: Job? = null
    private var cardJob: Job? = null
    /** Set while a photo is being taken to identify the device; null for photos taken while recording. */
    private var identifyPurpose = Purpose.Info
    private var identifyingFor = false
    private var regionPending = false
    private var regionJob: Job? = null
    /** Photos that belong to the documentation being recorded. */
    private var docPhotos = 0

    init {
        // The device is unknown until the engineer takes a photo of it (or names it).
        viewModelScope.launch { _state.update { it.copy(devices = brain.devices()) } }
        viewModelScope.launch { pollBrain() }
        // Loads the ~40 MB crop model once, so the first identification isn't slower.
        viewModelScope.launch { runCatching { cropper.warmUp() } }
    }

    /** Identification is simulated, so the engineer can correct it. */
    fun selectDevice(device: Device) {
        if (device.id == _state.value.device?.id) return
        _state.update { it.copy(device = device, manual = null, manualTarget = null, showManual = false, chat = emptyList()) }
        viewModelScope.launch { loadManual(device) }
    }

    private suspend fun loadManual(device: Device) {
        val manual = brain.manual(device.manualId)
        _state.update { if (it.device?.id == device.id) it.copy(manual = manual) else it }
    }

    fun onCameraReady(ready: Boolean) = _state.update { it.copy(cameraReady = ready) }

    // ── Hands-free voice ───────────────────────────────────────────────────

    fun onSpeechStart() = _state.update { it.copy(hearing = true, heard = "", micLevel = 0f) }

    fun onMicLevel(level: Float) = _state.update { it.copy(micLevel = it.micLevel * 0.4f + level * 0.6f) }

    fun onHeard(text: String) = _state.update { it.copy(hearing = true, heard = text) }

    fun onNothingHeard() = _state.update { it.copy(hearing = false, heard = "", micLevel = 0f) }

    fun onUtterance(text: String) {
        _state.update { it.copy(hearing = false, heard = "", micLevel = 0f) }
        val s = _state.value
        if (s.dictating == Dictation.Note) return onNoteSpoken(text)
        handle(parseCommand(text, s.devices, s.isRecording))
    }

    private fun handle(command: Command) {
        val s = _state.value
        when (command) {
            is Command.Photo -> if (s.isRecording) {
                docPhotos++
                _effects.trySend(Effect.TakePhoto)
            } else {
                identify(Purpose.Document)
            }
            Command.Identify -> identify(Purpose.Info)
            is Command.FindDevice -> findDevice(command.query)
            Command.RegionCapture -> startRegion()
            Command.Dictate -> startNote()
            Command.StartRecording -> {
                val device = s.device ?: return notice("Which device? Say “which device am I looking at”")
                startDocumentation(device)
            }
            Command.Stop -> when {
                s.isRecording -> {
                    _state.update { it.copy(task = Task("Saving documentation", TaskKind.Save)) }
                    _effects.trySend(Effect.StopDictation)
                    _effects.trySend(Effect.StopRecording)
                }
                flowJob?.isActive == true -> cancelFlow()
                else -> dismissCard()
            }
            Command.Cancel -> when {
                s.region != null -> closeRegion()
                s.answerPanel != null -> closeAnswer()
                flowJob?.isActive == true -> cancelFlow()
                else -> dismissCard()
            }
            is Command.OpenManual -> openManualFor(command.query)
            Command.CloseManual -> when {
                s.region != null -> closeRegion()
                s.showManual -> _state.update { it.copy(showManual = false) }
                else -> closeAnswer()
            }
            Command.ShowCited -> {
                val target = s.chat.lastOrNull { !it.fromUser }?.sources?.firstNotNullOfOrNull { it.manualTarget }
                if (target != null) showManualAt(target) else openManualFor(null)
            }
            is Command.SelectDevice -> {
                selectDevice(command.device)
                notice("Now documenting ${command.device.name}")
            }
            Command.AboutDevice -> {
                // Nothing identified yet: look at what's in front of the engineer.
                val device = s.device ?: return identify(Purpose.Info)
                showCard(BarCard.DeviceInfo(device, s.manual?.title?.takeIf { s.manual.pdfUrl != null }, s.captures.size), 20_000)
            }
            // With a device, scoped to it; without one, a general question to the Tundra brain.
            is Command.Question -> ask(command.text)
            is Command.Chatter -> if (s.isRecording) {
                _state.update { it.copy(narration = it.narration + Narration(formatClock(it.recordingSec), command.text)) }
            }
        }
    }

    /** Photo → analysis → match in the inventory → countdown → recording. */
    /** Why the engineer asked to identify the device: just to know, or to document it. */
    private enum class Purpose { Info, Document }

    /** Photo of the view → Tundra's image search → the device from the hospital's records. */
    private fun identify(purpose: Purpose) {
        if (flowJob?.isActive == true) return
        identifyPurpose = purpose
        identifyingFor = true
        _state.update { it.copy(task = Task("Looking", TaskKind.Camera), card = null) }
        cardJob?.cancel()
        _effects.trySend(Effect.TakePhoto)
    }

    private fun continueIdentify(file: File?) {
        val purpose = identifyPurpose
        identifyingFor = false
        flowJob = viewModelScope.launch {
            if (file == null) {
                _state.update { it.copy(task = null) }
                return@launch notice("The camera isn't available")
            }
            // 1. Crop to the device on the headset, and show the photo with that crop.
            _state.update { it.copy(task = Task("Cropping on headset", TaskKind.Analyze), card = BarCard.Photo(file.path, phase = PhotoPhase.Captured)) }
            val crop = if (BuildConfig.TUNDRA_DEMO) null else runCatching { cropper.crop(file) }.getOrNull()
            updatePhotoCard { it.copy(box = crop?.box?.let { b -> fractions(file, b) }, cropMs = crop?.millis) }
            // 2. Search while the photo is on show, so the animation costs no time.
            val search = async { runCatching { brain.identify(sessionId, crop?.file ?: file) } }
            delay(1900)
            _state.update { it.copy(task = Task("Sending to Tundra", TaskKind.Analyze)) }
            updatePhotoCard { it.copy(phase = PhotoPhase.Sending) }
            delay(950)
            _state.update { it.copy(task = Task("Searching Tundra", TaskKind.Analyze)) }
            updatePhotoCard { it.copy(phase = PhotoPhase.Searching) }
            val result = search.await()
            updatePhotoCard { it.copy(phase = PhotoPhase.Done) }
            val matches = result.getOrElse { e ->
                _state.update { it.copy(task = null) }
                return@launch showCard(BarCard.Notice("Couldn't identify: ${e.message?.take(140)}"), 8000)
            }
            for (m in matches.take(3)) {
                updatePhotoCard { it.copy(lines = it.lines + "${m.label} · ${(m.confidence * 100).toInt()}%") }
                delay(220)
            }
            matches.firstOrNull()?.detail?.let { d -> updatePhotoCard { it.copy(lines = it.lines + d) } }
            val device = matches.firstNotNullOfOrNull { it.device }
            _state.update { it.copy(task = null) }
            if (device == null) {
                if (matches.isEmpty()) updatePhotoCard { it.copy(lines = listOf("No match in the hospital's records")) }
                return@launch
            }
            selectDevice(device)
            updatePhotoCard { it.copy(device = device) }
            add(CaptureItem(nextId++, CaptureKind.Photo, stamp(), file = file.path, index = _state.value.photoCount + 1))
            when (purpose) {
                Purpose.Info -> {
                    delay(1600)
                    // Wait briefly for the manual so the overview can name it.
                    withTimeoutOrNull(3000) { while (_state.value.manual == null) delay(100) }
                    showCard(BarCard.DeviceInfo(device, _state.value.manual?.title?.takeIf { _state.value.manual?.pdfUrl != null }, _state.value.captures.size), 25_000)
                }
                Purpose.Document -> {
                    docPhotos = 1
                    delay(1200)
                    for (n in 3 downTo 1) {
                        updatePhotoCard { it.copy(countdown = n) }
                        delay(1000)
                    }
                    startDocumentation(device, keepPhotos = true)
                }
            }
        }
    }

    /** A crop box in photo pixels as fractions of the photo. */
    private fun fractions(file: File, box: android.graphics.Rect): List<Float>? = runCatching {
        val o = android.graphics.BitmapFactory.Options().apply { inJustDecodeBounds = true }
        android.graphics.BitmapFactory.decodeFile(file.path, o)
        val w = o.outWidth.toFloat()
        val h = o.outHeight.toFloat()
        listOf(box.left / w, box.top / h, box.right / w, box.bottom / h).map { it.coerceIn(0f, 1f) }
    }.getOrNull()

    private fun findDevice(query: String) {
        flowJob?.cancel()
        flowJob = viewModelScope.launch {
            _state.update { it.copy(task = Task("Finding “$query”", TaskKind.Analyze)) }
            val found = brain.findDevices(query).firstOrNull()
            _state.update { it.copy(task = null) }
            if (found == null) return@launch notice("No “$query” in the hospital's records")
            selectDevice(found)
            withTimeoutOrNull(3000) { while (_state.value.manual == null) delay(100) }
            showCard(BarCard.DeviceInfo(found, _state.value.manual?.title?.takeIf { _state.value.manual?.pdfUrl != null }, _state.value.captures.size), 20_000)
        }
    }

    private fun startDocumentation(device: Device, keepPhotos: Boolean = false) {
        if (_state.value.isRecording) return
        if (!keepPhotos) docPhotos = 0
        _state.update { it.copy(card = null, task = null, narration = emptyList(), device = it.device ?: device, dictating = Dictation.Video) }
        _effects.trySend(Effect.StartRecording)
        // Everything said while recording is transcribed for the documentation, no pinch needed.
        _effects.trySend(Effect.StartDictation)
    }

    // ── Region capture ─────────────────────────────────────────────────────

    private fun startRegion() {
        regionPending = true
        regionJob?.cancel()
        _state.update { it.copy(task = Task("Capturing your view", TaskKind.Camera), region = null) }
        _effects.trySend(Effect.TakePhoto)
    }

    /** The engineer finished drawing a box: crop it and ask the image search what it is. */
    fun onRegionSelected(box: List<Float>) {
        val region = _state.value.region ?: return
        val path = region.file
        regionJob?.cancel()
        _state.update { it.copy(region = region.copy(box = box, crop = null, searching = true, matches = emptyList()), task = Task("Searching image", TaskKind.Analyze)) }
        regionJob = viewModelScope.launch {
            val crop = path?.let { cropRegion(it, box, File(it).parentFile ?: File(it)) }
            _state.update { s -> s.copy(region = s.region?.copy(crop = crop?.path)) }
            val result = runCatching { brain.identify(sessionId, crop ?: File(path.orEmpty())) }
            val matches = result.getOrDefault(emptyList())
            _state.update { s -> s.copy(task = null, region = s.region?.copy(searching = false, matches = matches)) }
            result.exceptionOrNull()?.let { return@launch notice("Couldn't search: ${it.message?.take(140)}") }
            val top = matches.firstOrNull() ?: return@launch notice("No match for that region")
            top.device?.let(::selectDevice)
            matches.firstNotNullOfOrNull { it.device }?.takeIf { top.device == null }?.let(::selectDevice)
            showCard(BarCard.RegionMatch(crop?.path, top), 15_000)
        }
    }

    fun closeRegion() {
        regionJob?.cancel()
        regionPending = false
        _state.update { it.copy(region = null, task = if (it.task?.kind == TaskKind.Analyze) null else it.task) }
    }

    private fun cancelFlow() {
        flowJob?.cancel()
        identifyingFor = false
        _state.update { it.copy(task = null, card = null) }
    }

    private fun openManualFor(query: String?) {
        val device = _state.value.device ?: return notice("Which device? Say “which device am I looking at”")
        if (query == null) {
            showManualAt(_state.value.manualTarget)
            return
        }
        flowJob?.cancel()
        flowJob = viewModelScope.launch {
            _state.update { it.copy(task = Task("Finding “$query”", TaskKind.Manual)) }
            val answer = runCatching { brain.ask(sessionId, device, query, _state.value.captures) }.getOrNull()
            _state.update { it.copy(task = null) }
            val target = answer?.sources?.firstNotNullOfOrNull { it.manualTarget }
            if (target == null) notice("Couldn't find “$query” in the manual") else showManualAt(target)
        }
    }

    private fun showManualAt(target: ManualTarget?) {
        val manual = _state.value.manual
        if (manual != null && manual.pdfUrl == null && manual.pages.isEmpty()) {
            return notice("Tundra has no manual on file for ${_state.value.device?.name ?: "this device"}")
        }
        val title = manual?.title ?: "Manual"
        _state.update { it.copy(showManual = true, manualTarget = target ?: it.manualTarget) }
        showCard(BarCard.ManualOpened(title, target), 6000)
    }

    private fun notice(text: String) = showCard(BarCard.Notice(text), 4000)

    private fun showCard(card: BarCard, ttlMs: Long?) {
        cardJob?.cancel()
        _state.update { it.copy(card = card) }
        if (ttlMs != null) cardJob = viewModelScope.launch {
            delay(ttlMs)
            _state.update { if (it.card == card) it.copy(card = null) else it }
        }
    }

    fun dismissCard() {
        cardJob?.cancel()
        _state.update { it.copy(card = null) }
    }

    private fun updatePhotoCard(transform: (BarCard.Photo) -> BarCard.Photo) =
        _state.update { s -> (s.card as? BarCard.Photo)?.let { s.copy(card = transform(it)) } ?: s }

    // ── Capture ────────────────────────────────────────────────────────────

    fun onRecordingStarted() {
        _state.update { it.copy(isRecording = true, recordingSec = 0) }
        recordingJob = viewModelScope.launch {
            while (isActive) {
                delay(1000)
                _state.update { it.copy(recordingSec = it.recordingSec + 1) }
            }
        }
    }

    fun onRecordingStopped(file: File?) {
        recordingJob?.cancel()
        val seconds = _state.value.recordingSec.coerceAtLeast(1)
        _state.update { it.copy(isRecording = false, recordingSec = 0) }
        val device = _state.value.device ?: return
        viewModelScope.launch {
            // The last sentence is still being recognised when "stop" arrives: let it land.
            delay(1200)
            val narration = _state.value.narration
            _state.update { it.copy(dictating = null, narration = emptyList()) }
            documentationPipeline(
                title = "Video documentation",
                device = device,
                video = CaptureItem(nextId++, CaptureKind.Video, stamp(), file = file?.path, durationSec = seconds),
                lines = narration,
            )
        }
    }

    // ── Spoken notes ────────────────────────────────────────────────────────

    private var noteSilence: Job? = null

    /** "listen to my documentation": take down everything said until "done" or a long pause. */
    private fun startNote() {
        val device = _state.value.device ?: return notice("Which device? Say “what am I looking at right now”")
        if (_state.value.isRecording || _state.value.dictating != null) return
        _state.update { it.copy(dictating = Dictation.Note, noteLines = emptyList(), card = null, task = null, device = it.device ?: device) }
        _effects.trySend(Effect.StartDictation)
        armNoteSilence()
    }

    private fun onNoteSpoken(text: String) {
        val t = text.trim().lowercase().trimEnd('.', '!')
        when {
            Regex("^(ok(ay)? )?(done|i'?m done|that'?s (it|all)|finished|stop|end( note)?|save( it)?|upload( it)?|send( it)?)$").matches(t) -> finishNote()
            Regex("^(cancel|never ?mind|discard( it)?|delete( it)?)$").matches(t) -> {
                noteSilence?.cancel()
                _effects.trySend(Effect.StopDictation)
                _state.update { it.copy(dictating = null, noteLines = emptyList()) }
                notice("Note discarded")
            }
            else -> {
                val at = formatClock(((System.currentTimeMillis() - sessionStart) / 1000).toInt())
                // "… and that's it" at the end of a sentence also finishes the note.
                val ends = Regex("[,. ]+(and )?(that'?s (it|all)|i'?m done|done)$").find(t)
                val kept = if (ends != null) text.trim().substring(0, ends.range.first).trim() else text.trim()
                if (kept.isNotEmpty()) _state.update { it.copy(noteLines = it.noteLines + Narration(at, kept)) }
                if (ends != null) finishNote() else armNoteSilence()
            }
        }
    }

    /** A note ends by itself after a long pause. */
    private fun armNoteSilence() {
        noteSilence?.cancel()
        noteSilence = viewModelScope.launch {
            delay(12_000)
            if (_state.value.dictating == Dictation.Note) finishNote()
        }
    }

    private fun finishNote() {
        noteSilence?.cancel()
        if (_state.value.dictating != Dictation.Note) return
        _effects.trySend(Effect.StopDictation)
        val device = _state.value.device ?: return
        viewModelScope.launch {
            delay(900)
            val lines = _state.value.noteLines
            _state.update { it.copy(dictating = null, noteLines = emptyList()) }
            if (lines.isEmpty()) return@launch notice("Didn't hear a note")
            documentationPipeline(title = "Spoken note", device = device, video = null, lines = lines)
        }
    }

    // ── Documentation into Tundra ───────────────────────────────────────────

    /**
     * Uploads a piece of documentation and shows each step: the video (if any), the transcript of
     * what was said, and — when it was long — a summary by the Tundra brain, uploaded with it.
     */
    private suspend fun documentationPipeline(title: String, device: Device, video: CaptureItem?, lines: List<Narration>) {
        cardJob?.cancel()
        val transcript = lines.joinToString("\n") { "[${it.at}] ${it.text}" }
        val words = lines.sumOf { it.text.split(Regex("\\s+")).size }
        val summarise = words >= 25
        val steps = buildList {
            if (video != null) add(UploadStep(StepKind.Video, "Video · ${formatClock(video.durationSec)}"))
            if (lines.isNotEmpty()) add(UploadStep(StepKind.Transcript, "Transcript · $words words"))
            if (summarise) add(UploadStep(StepKind.Summary, "Summary by Tundra"))
            if (video == null && lines.isNotEmpty()) add(UploadStep(StepKind.Note, "Note to ${device.assetTag}"))
        }
        var card = BarCard.Upload(title, device, steps, transcript = lines.joinToString(" ") { it.text }.takeIf { it.isNotBlank() })
        fun show() = _state.update { it.copy(card = card, task = Task("Uploading documentation", TaskKind.Save)) }
        fun step(kind: StepKind, state: StepState, detail: String? = null) {
            card = card.copy(steps = card.steps.map { if (it.kind == kind) it.copy(state = state, detail = detail ?: it.detail) else it })
            show()
        }
        show()
        delay(500)

        if (video != null) {
            step(StepKind.Video, StepState.Running)
            val ok = addAndWait(video)
            step(StepKind.Video, if (ok) StepState.Done else StepState.Failed, if (ok) "in Tundra" else "not sent")
        }
        if (lines.isNotEmpty()) {
            step(StepKind.Transcript, StepState.Running)
            delay(700) // it was transcribed live; this is the moment it's put together
            step(StepKind.Transcript, StepState.Done, "${lines.size} part${if (lines.size == 1) "" else "s"}")
        }
        var summary: List<String>? = null
        if (summarise) {
            step(StepKind.Summary, StepState.Running, "dissecting what you said…")
            summary = brain.summarize(device, transcript)
            if (summary != null) {
                card = card.copy(summary = summary)
                step(StepKind.Summary, StepState.Done, "${summary.size} points")
            } else step(StepKind.Summary, StepState.Skipped, "transcript only")
        }
        if (lines.isNotEmpty()) {
            val kind = if (video == null) StepKind.Note else StepKind.Transcript
            if (video == null) step(StepKind.Note, StepState.Running)
            val text = buildString {
                if (video != null) append("Narration of the video documentation (${formatClock(video.durationSec)}).\n\n")
                if (summary != null) append("Summary:\n").append(summary.joinToString("\n") { "- $it" }).append("\n\n")
                append("Transcript:\n").append(transcript)
            }
            val ok = addAndWait(CaptureItem(nextId++, CaptureKind.Note, stamp(), transcript = text))
            if (video == null) step(kind, if (ok) StepState.Done else StepState.Failed, if (ok) "in Tundra" else "not sent")
            else if (!ok) step(StepKind.Transcript, StepState.Failed, "not sent")
        }
        card = card.copy(done = true)
        _state.update { it.copy(card = card, task = null) }
        val shown = card
        cardJob = viewModelScope.launch {
            delay(if (shown.summary.isNotEmpty()) 20_000 else 10_000)
            _state.update { if (it.card == shown) it.copy(card = null) else it }
        }
    }

    /** Adds a capture and waits until the brain has it (or says it can't). */
    private suspend fun addAndWait(item: CaptureItem): Boolean {
        add(item)
        val sync = withTimeoutOrNull(60_000) {
            while (true) {
                val c = _state.value.captures.firstOrNull { it.id == item.id }
                if (c == null || c.sync != SyncState.Sending) break
                delay(150)
            }
            _state.value.captures.firstOrNull { it.id == item.id }?.sync
        }
        return sync != null && sync != SyncState.Failed
    }

    fun onShutter() = _state.update { it.copy(photoFlash = System.currentTimeMillis()) }

    fun onPhotoTaken(file: File?) {
        if (regionPending) {
            regionPending = false
            _state.update { it.copy(task = null, region = RegionState(file?.path)) }
            return showCard(BarCard.Notice("Pinch and drag around the device"), 6000)
        }
        if (identifyingFor) return continueIdentify(file)
        add(CaptureItem(nextId++, CaptureKind.Photo, stamp(), file = file?.path, index = _state.value.photoCount + 1))
    }

    // ── Push-to-talk voice (typed panels) ──────────────────────────────────

    fun onListeningStarted(target: VoiceTarget) =
        _state.update { it.copy(listeningFor = target, liveTranscript = "", voiceError = null) }

    fun onPartialTranscript(text: String) = _state.update { it.copy(liveTranscript = text) }

    fun onFinalTranscript(text: String) {
        val target = _state.value.listeningFor
        _state.update { it.copy(listeningFor = null, liveTranscript = "") }
        if (text.isBlank()) return
        when (target) {
            VoiceTarget.Note -> add(CaptureItem(nextId++, CaptureKind.Note, stamp(), transcript = text.trim()))
            VoiceTarget.Ask -> ask(text)
            null -> Unit
        }
    }

    fun onListeningCancelled() = _state.update { it.copy(listeningFor = null, liveTranscript = "") }

    private var voiceErrorJob: Job? = null

    fun onVoiceError(message: String) {
        _state.update { it.copy(voiceError = message) }
        voiceErrorJob?.cancel()
        voiceErrorJob = viewModelScope.launch {
            delay(4000)
            _state.update { it.copy(voiceError = null) }
        }
    }

    // ── Ask ────────────────────────────────────────────────────────────────

    fun onAskDraftChange(text: String) = _state.update { it.copy(askDraft = text) }

    fun ask(question: String = _state.value.askDraft) {
        val device = _state.value.device
        if (question.isBlank()) return
        val user = ChatMessage(nextId++, fromUser = true, text = question.trim())
        val replyId = nextId++
        _state.update {
            it.copy(
                askDraft = "",
                showAsk = true,
                chat = it.chat + user + ChatMessage(replyId, fromUser = false, text = "", streaming = true),
                task = Task("Thinking", TaskKind.Think),
            )
        }
        showCard(BarCard.Answer(replyId), null)
        viewModelScope.launch {
            val answer = brain.ask(sessionId, device, question, _state.value.captures)
            // Charts, tables or a long answer don't fit the island: show them in full beside it.
            val rich = answer.charts.isNotEmpty() || answer.tables.isNotEmpty() || answer.text.length > 420
            _state.update { it.copy(task = null, answerPanel = if (rich) replyId else it.answerPanel) }
            if (rich) updateMessage(replyId) { it.copy(charts = answer.charts, tables = answer.tables, followUps = answer.followUps) }
            // Stream word by word so the answer reads in as it's "thought".
            val words = answer.text.split(" ")
            for (i in words.indices) {
                val partial = words.take(i + 1).joinToString(" ")
                updateMessage(replyId) { it.copy(text = partial) }
                delay(28)
            }
            updateMessage(replyId) {
                it.copy(streaming = false, sources = answer.sources, charts = answer.charts, tables = answer.tables, followUps = answer.followUps)
            }
            // The answer stays up while it's being read; it never pops the manual open by itself.
            val card = BarCard.Answer(replyId)
            cardJob?.cancel()
            cardJob = viewModelScope.launch {
                delay(25_000)
                _state.update { if (it.card == card) it.copy(card = null) else it }
            }
        }
    }

    // ── Panels ─────────────────────────────────────────────────────────────

    fun openManual(target: ManualTarget? = _state.value.manualTarget) =
        _state.update { it.copy(showManual = true, manualTarget = target) }

    fun closeManual() = _state.update { it.copy(showManual = false) }

    fun closeAnswer() = _state.update { it.copy(answerPanel = null) }

    /** Opens the full answer for a reply (from the island's preview). */
    fun openAnswer(id: Long) = _state.update { it.copy(answerPanel = id) }

    fun toggleManual() = _state.update { it.copy(showManual = !it.showManual) }
    fun toggleAsk() = _state.update { it.copy(showAsk = !it.showAsk) }

    // ── Internals ──────────────────────────────────────────────────────────

    private fun add(item: CaptureItem) {
        val device = _state.value.device ?: return
        _state.update { it.copy(captures = listOf(item) + it.captures) }
        viewModelScope.launch {
            val result = runCatching { brain.ingest(sessionId, device, item) }
            updateCapture(item.id) { c ->
                result.fold(
                    onSuccess = { (remoteId, status) -> c.copy(remoteId = remoteId, sync = status.sync, detail = status.detail) },
                    onFailure = { c.copy(sync = SyncState.Failed, detail = "Not sent · laptop offline") },
                )
            }
            if (result.isFailure) _state.update { it.copy(brainOnline = false) }
        }
    }

    /** Heartbeat + analysis status: TwelveLabs results arrive on the laptop, and their status shows here. */
    private suspend fun pollBrain() {
        while (true) {
            val statuses = brain.statuses(sessionId)
            _state.update { s ->
                s.copy(
                    brainOnline = statuses != null,
                    captures = if (statuses == null) s.captures else s.captures.map { c ->
                        val remote = c.remoteId?.let(statuses::get)
                        if (remote == null || c.sync == SyncState.Sending) c else c.copy(sync = remote.sync, detail = remote.detail)
                    },
                )
            }
            if (_state.value.devices.isEmpty() && statuses != null) _state.update { it.copy(devices = brain.devices()) }
            delay(3000)
        }
    }

    private fun updateCapture(id: Long, transform: (CaptureItem) -> CaptureItem) =
        _state.update { s -> s.copy(captures = s.captures.map { if (it.id == id) transform(it) else it }) }

    private fun updateMessage(id: Long, transform: (ChatMessage) -> ChatMessage) =
        _state.update { s -> s.copy(chat = s.chat.map { if (it.id == id) transform(it) else it }) }

    private fun stamp(): String {
        val sec = ((System.currentTimeMillis() - sessionStart) / 1000).toInt()
        return formatClock(sec)
    }
}

fun formatClock(totalSec: Int): String = "%02d:%02d".format(totalSec / 60, totalSec % 60)
