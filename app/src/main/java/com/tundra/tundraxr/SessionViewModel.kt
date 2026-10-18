package com.tundra.tundraxr

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tundra.tundraxr.assistant.Command
import com.tundra.tundraxr.assistant.parseCommand
import com.tundra.tundraxr.data.CaptureItem
import com.tundra.tundraxr.data.CaptureKind
import com.tundra.tundraxr.data.ChatMessage
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
    ) : BarCard
    data class Answer(val messageId: Long) : BarCard
    data class ManualOpened(val title: String, val target: ManualTarget?) : BarCard
    data class Saved(val device: Device, val videoSec: Int, val comments: Int, val photos: Int, val sent: Boolean) : BarCard
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

/** Things only the activity can do (it owns the camera). */
sealed interface Effect {
    data object TakePhoto : Effect
    data object StartRecording : Effect
    data object StopRecording : Effect
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
    /** The reply shown in full in the answer panel (charts, tables, long text), by message id. */
    val answerPanel: Long? = null,
) {
    val photoCount get() = captures.count { it.kind == CaptureKind.Photo }
    val syncedCount get() = captures.count { it.sync != SyncState.Sending && it.sync != SyncState.Failed }
}

class SessionViewModel(
    // Demo builds (tundra.demo=true) answer from the scripted brain so the UI can be tested offline.
    private val brain: TundraBrain = if (BuildConfig.TUNDRA_DEMO) DemoBrain() else LocalBrain(BuildConfig.TUNDRA_SERVER_URL),
) : ViewModel() {

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
            Command.StartRecording -> {
                val device = s.device ?: return notice("Which device? Say “which device am I looking at”")
                startDocumentation(device)
            }
            Command.Stop -> when {
                s.isRecording -> {
                    _state.update { it.copy(task = Task("Saving documentation", TaskKind.Save)) }
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
            _state.update { it.copy(task = Task("Identifying with Tundra", TaskKind.Analyze), card = BarCard.Photo(file.path)) }
            val result = runCatching { brain.identify(sessionId, file) }
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
        _state.update { it.copy(card = null, task = null, narration = emptyList(), device = it.device ?: device) }
        _effects.trySend(Effect.StartRecording)
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
        val narration = _state.value.narration
        _state.update { it.copy(isRecording = false, recordingSec = 0) }
        val video = CaptureItem(nextId++, CaptureKind.Video, stamp(), file = file?.path, durationSec = seconds)
        add(video)
        if (narration.isNotEmpty()) {
            val text = narration.joinToString("\n") { "[${it.at}] ${it.text}" }
            add(CaptureItem(nextId++, CaptureKind.Note, stamp(), transcript = text))
        }
        val device = _state.value.device ?: return
        viewModelScope.launch {
            _state.update { it.copy(task = Task("Saving documentation", TaskKind.Save)) }
            // Wait until the brain has the video, so "saved" means saved.
            val synced = withTimeoutOrNull(20_000) {
                while (true) {
                    val c = _state.value.captures.firstOrNull { it.id == video.id }
                    if (c == null || c.sync != SyncState.Sending) break
                    delay(200)
                }
                _state.value.captures.firstOrNull { it.id == video.id }?.sync
            }
            val sent = synced != null && synced != SyncState.Failed
            _state.update { it.copy(task = null, narration = emptyList()) }
            showCard(BarCard.Saved(device, seconds, narration.size, docPhotos, sent), 12_000)
        }
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
