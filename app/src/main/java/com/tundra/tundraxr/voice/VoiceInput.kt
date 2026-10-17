package com.tundra.tundraxr.voice

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import com.tundra.tundraxr.VoiceTarget
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.sqrt

private const val TAG = "TundraVoice"
private const val SAMPLE_RATE = 16_000

interface VoiceCallbacks {
    fun onStarted(target: VoiceTarget)
    fun onPartial(text: String)
    fun onFinal(text: String)
    fun onCancelled()
    /** Something the engineer should see, e.g. "Microphone permission is off". */
    fun onError(message: String)
}

/**
 * Speech input with two real paths, never a scripted fallback:
 * 1. the headset's system recognizer (live partial results);
 * 2. if that fails or doesn't exist, record audio here and transcribe it on the laptop brain
 *    (whisper.cpp behind POST /api/transcribe).
 */
class VoiceInput internal constructor(
    private val context: Context,
    private val scope: CoroutineScope,
    private val brainUrl: String,
    private val callbacks: () -> VoiceCallbacks,
    private val requestPermission: () -> Unit,
) {
    private var recognizer: SpeechRecognizer? = null
    private var recording: Job? = null
    private var stopRecording = false
    private var target: VoiceTarget? = null
    private var lastPartial = ""
    /** Once the system recognizer has failed hard, go straight to the laptop next time. */
    private var systemBroken = false
    internal var pendingTarget: VoiceTarget? = null

    private val hasMic get() =
        ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

    fun toggle(t: VoiceTarget) = if (target != null) stop() else start(t)

    fun start(t: VoiceTarget) {
        if (target != null) return
        if (!hasMic) {
            pendingTarget = t
            requestPermission()
            return
        }
        target = t
        lastPartial = ""
        callbacks().onStarted(t)
        val available = SpeechRecognizer.isRecognitionAvailable(context)
        Log.i(TAG, "start target=$t systemAvailable=$available systemBroken=$systemBroken")
        if (available && !systemBroken) startSystem() else startLaptop()
    }

    /** Ends listening; whatever was heard so far is committed. */
    fun stop() {
        Log.i(TAG, "stop requested")
        if (recording != null) stopRecording = true else recognizer?.stopListening()
    }

    internal fun onPermissionResult(granted: Boolean) {
        val t = pendingTarget ?: return
        pendingTarget = null
        if (granted) start(t) else callbacks().onError("Microphone permission is off")
    }

    internal fun release() {
        recording?.cancel()
        recognizer?.destroy()
        recognizer = null
    }

    private fun finish(text: String) {
        Log.i(TAG, "final \"$text\"")
        target = null
        callbacks().onFinal(text)
    }

    private fun fail(message: String) {
        Log.w(TAG, "failed: $message")
        target = null
        callbacks().onCancelled()
        callbacks().onError(message)
    }

    // ── 1. System recognizer ──────────────────────────────────────────────────

    private fun startSystem() {
        val r = recognizer ?: SpeechRecognizer.createSpeechRecognizer(context).also { recognizer = it }
        r.setRecognitionListener(listener)
        r.startListening(
            Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
                .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                .putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, context.packageName)
                .putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2500L),
        )
    }

    private val listener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) { Log.i(TAG, "system: ready") }
        override fun onBeginningOfSpeech() { Log.i(TAG, "system: speech began") }

        override fun onPartialResults(partialResults: Bundle) {
            partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
                ?.takeIf { it.isNotBlank() }
                ?.let { lastPartial = it; callbacks().onPartial(it) }
        }

        override fun onResults(results: Bundle) {
            val text = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
            finish(text?.takeIf { it.isNotBlank() } ?: lastPartial)
        }

        override fun onError(error: Int) {
            Log.w(TAG, "system: error $error (${errorName(error)}) partial=\"$lastPartial\"")
            when {
                lastPartial.isNotBlank() -> finish(lastPartial)
                // Heard nothing usable: that's the engineer's silence, not a broken recognizer.
                error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> fail("Didn't catch that. Try again")
                error == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> fail("Microphone permission is off")
                else -> {
                    // Recognizer unusable here (no language pack, no network, busy…): use the laptop.
                    systemBroken = true
                    startLaptop()
                }
            }
        }

        override fun onRmsChanged(rmsdB: Float) = Unit
        override fun onBufferReceived(buffer: ByteArray?) = Unit
        override fun onEndOfSpeech() { Log.i(TAG, "system: speech ended") }
        override fun onEvent(eventType: Int, params: Bundle?) = Unit
    }

    // ── 2. Record here, transcribe on the laptop ──────────────────────────────

    @SuppressLint("MissingPermission") // checked in start()
    private fun startLaptop() {
        Log.i(TAG, "laptop: recording")
        callbacks().onPartial("Listening · transcribed on laptop")
        stopRecording = false
        recording = scope.launch {
            val pcm = withContext(Dispatchers.IO) { record() }
            recording = null
            if (pcm == null) return@launch fail("Microphone unavailable")
            if (pcm.size < SAMPLE_RATE / 2) return@launch fail("Didn't catch that. Try again") // < 0.25 s
            callbacks().onPartial("Transcribing…")
            val text = runCatching { withContext(Dispatchers.IO) { transcribe(wav(pcm)) } }
                .onFailure { Log.w(TAG, "laptop: transcribe failed", it) }
                .getOrNull()
            when {
                text == null -> fail("Laptop brain couldn't transcribe")
                text.isBlank() -> fail("Didn't catch that. Try again")
                else -> finish(text)
            }
        }
    }

    /** Records until stopped, 1.6 s of silence after speech, or 20 s. Returns 16-bit PCM. */
    @SuppressLint("MissingPermission")
    private suspend fun record(): ByteArray? = withContext(Dispatchers.IO) {
        val min = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        val rec = runCatching {
            AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, min * 4)
        }.getOrNull()?.takeIf { it.state == AudioRecord.STATE_INITIALIZED } ?: return@withContext null
        val out = ByteArrayOutputStream()
        val buf = ShortArray(SAMPLE_RATE / 10) // 100 ms
        var heardSpeech = false
        var quietMs = 0
        var totalMs = 0
        try {
            rec.startRecording()
            while (isActive && !stopRecording && totalMs < 20_000) {
                val n = rec.read(buf, 0, buf.size)
                if (n <= 0) break
                val bytes = ByteBuffer.allocate(n * 2).order(ByteOrder.LITTLE_ENDIAN)
                var sum = 0.0
                for (i in 0 until n) { bytes.putShort(buf[i]); sum += buf[i] * buf[i].toDouble() }
                out.write(bytes.array())
                val rms = sqrt(sum / n)
                if (rms > 900) { heardSpeech = true; quietMs = 0 } else quietMs += 100
                totalMs += 100
                if (heardSpeech && quietMs >= 1600) break
                if (!heardSpeech && totalMs >= 6_000) break // nobody spoke
            }
        } finally {
            runCatching { rec.stop() }
            rec.release()
        }
        Log.i(TAG, "laptop: recorded ${totalMs} ms heardSpeech=$heardSpeech")
        if (heardSpeech) out.toByteArray() else ByteArray(0)
    }

    private fun wav(pcm: ByteArray): ByteArray {
        val header = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN).apply {
            put("RIFF".toByteArray()); putInt(36 + pcm.size); put("WAVE".toByteArray())
            put("fmt ".toByteArray()); putInt(16); putShort(1); putShort(1)
            putInt(SAMPLE_RATE); putInt(SAMPLE_RATE * 2); putShort(2); putShort(16)
            put("data".toByteArray()); putInt(pcm.size)
        }
        return header.array() + pcm
    }

    private fun transcribe(wav: ByteArray): String {
        val conn = (URL("$brainUrl/api/transcribe").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            doOutput = true
            connectTimeout = 3_000
            readTimeout = 60_000
            setRequestProperty("content-type", "audio/wav")
            setRequestProperty("user-agent", "TundraXR/1.0")
            setFixedLengthStreamingMode(wav.size)
        }
        try {
            conn.outputStream.use { it.write(wav) }
            val body = (if (conn.responseCode in 200..299) conn.inputStream else conn.errorStream)?.bufferedReader()?.use { it.readText() }.orEmpty()
            check(conn.responseCode in 200..299) { "transcribe ${conn.responseCode}: $body" }
            return JSONObject(body).optString("text").trim()
        } finally {
            conn.disconnect()
        }
    }

    private fun errorName(e: Int) = when (e) {
        SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "network timeout"
        SpeechRecognizer.ERROR_NETWORK -> "network"
        SpeechRecognizer.ERROR_AUDIO -> "audio"
        SpeechRecognizer.ERROR_SERVER -> "server"
        SpeechRecognizer.ERROR_CLIENT -> "client"
        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "speech timeout"
        SpeechRecognizer.ERROR_NO_MATCH -> "no match"
        SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "busy"
        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "permissions"
        SpeechRecognizer.ERROR_TOO_MANY_REQUESTS -> "too many requests"
        SpeechRecognizer.ERROR_SERVER_DISCONNECTED -> "server disconnected"
        SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED -> "language not supported"
        SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE -> "language unavailable"
        else -> "unknown"
    }
}

@Composable
fun rememberVoiceInput(brainUrl: String, callbacks: VoiceCallbacks): VoiceInput {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val latest = rememberUpdatedState(callbacks)
    lateinit var input: VoiceInput
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        input.onPermissionResult(granted)
    }
    input = remember {
        VoiceInput(context, scope, brainUrl, { latest.value }) { launcher.launch(Manifest.permission.RECORD_AUDIO) }
    }
    DisposableEffect(input) { onDispose { input.release() } }
    return input
}
