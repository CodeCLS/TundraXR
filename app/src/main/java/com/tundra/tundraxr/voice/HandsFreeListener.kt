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
import androidx.core.content.ContextCompat
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
import kotlin.math.log10
import kotlin.math.sqrt

private const val TAG = "TundraVoice"
private const val SAMPLE_RATE = 16_000

/** What the hold-to-talk listener reports. All calls arrive on the main thread. */
interface HandsFreeCallbacks {
    /** The engineer started holding: open the bar. */
    fun onSpeechStart()
    /** Mic level, 0..1, while holding. */
    fun onLevel(level: Float)
    fun onPartial(text: String)
    /** What was said while holding. */
    fun onUtterance(text: String)
    /** Released without anything recognisable: close the bar again. */
    fun onNothingHeard()
    fun onError(message: String)
}

/**
 * Hold to talk: the mic is open only while the engineer pinches and holds the bar, so nothing
 * restarts (or chimes) in the background. Letting go ends the sentence. Two engines:
 * 1. the headset's system recognizer (live words);
 * 2. if that fails, record here and transcribe on the laptop brain (whisper.cpp,
 *    POST /api/transcribe), with live words every ~1.2 s.
 */
class HandsFreeListener(
    private val context: Context,
    private val scope: CoroutineScope,
    private val brainUrl: String,
    private val callbacks: () -> HandsFreeCallbacks,
) {
    private var recognizer: SpeechRecognizer? = null
    private var laptopJob: Job? = null
    private var useLaptop = false
    private var failures = 0
    /** The engineer is holding. */
    private var held = false
    /** Waiting for the recognizer's final result after letting go. */
    private var finishing = false
    /** Text from earlier recognizer sessions within the same hold (it can end on a pause). */
    private var committed = ""
    private var lastPartial = ""

    private val hasMic get() =
        ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED

    /** Pinch went down: start listening. */
    fun begin() {
        if (held) return
        if (!hasMic) return callbacks().onError("Microphone permission is off")
        held = true
        finishing = false
        committed = ""
        lastPartial = ""
        if (!useLaptop && !SpeechRecognizer.isRecognitionAvailable(context)) useLaptop = true
        Log.i(TAG, "hold: begin (${if (useLaptop) "laptop" else "system"})")
        callbacks().onSpeechStart()
        if (useLaptop) startLaptop() else startSystem()
    }

    /** Pinch released: finish the sentence. */
    fun end() {
        if (!held) return
        held = false
        Log.i(TAG, "hold: end")
        if (useLaptop) return // the recording loop sees [held] go false and transcribes
        finishing = true
        recognizer?.stopListening()
    }

    /** Stop without acting on anything (app went to the background). */
    fun cancel() {
        held = false
        finishing = false
        laptopJob?.cancel()
        recognizer?.cancel()
    }

    fun release() {
        cancel()
        recognizer?.destroy()
        recognizer = null
    }

    private fun spoken() = listOf(committed, lastPartial).filter { it.isNotBlank() }.joinToString(" ")

    private fun deliver() {
        finishing = false
        val text = spoken().trim()
        Log.i(TAG, "said: \"$text\"")
        if (text.isBlank()) callbacks().onNothingHeard() else callbacks().onUtterance(text)
    }

    // ── 1. System recognizer ─────────────────────────────────────────────────

    private fun startSystem() {
        val r = recognizer ?: SpeechRecognizer.createSpeechRecognizer(context).also {
            it.setRecognitionListener(listener)
            recognizer = it
        }
        r.startListening(
            Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
                .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                .putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
                .putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, context.packageName)
                // Letting go ends the sentence, so pauses while holding shouldn't.
                .putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 8000L)
                .putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 8000L)
                .putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 15000L),
        )
    }

    /** The recognizer ended on its own while still held: keep what it heard and listen on. */
    private fun continueOrDeliver(finalText: String?) {
        if (!finalText.isNullOrBlank()) lastPartial = finalText
        if (held) {
            committed = spoken()
            lastPartial = ""
            startSystem()
        } else {
            deliver()
        }
    }

    private val listener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) = Unit
        override fun onBeginningOfSpeech() = Unit

        override fun onRmsChanged(rmsdB: Float) {
            if (held) callbacks().onLevel(((rmsdB + 2f) / 12f).coerceIn(0f, 1f))
        }

        override fun onPartialResults(partialResults: Bundle) {
            val text = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
            if (text.isNullOrBlank()) return
            lastPartial = text
            callbacks().onPartial(spoken())
        }

        override fun onResults(results: Bundle) {
            failures = 0
            continueOrDeliver(results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull())
        }

        override fun onError(error: Int) {
            if (!held && !finishing) return // cancelled
            when (error) {
                SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> continueOrDeliver(null)
                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> {
                    held = false
                    callbacks().onError("Microphone permission is off")
                    callbacks().onNothingHeard()
                }
                SpeechRecognizer.ERROR_RECOGNIZER_BUSY, SpeechRecognizer.ERROR_CLIENT -> {
                    Log.w(TAG, "system: ${errorName(error)}")
                    recognizer?.destroy()
                    recognizer = null
                    if (held) startSystem() else deliver()
                }
                else -> {
                    Log.w(TAG, "system: error $error (${errorName(error)})")
                    if (++failures >= 2 || spoken().isBlank()) {
                        // Unusable here (no language pack, no network…): use the laptop from now on.
                        Log.w(TAG, "system recognizer unusable; switching to laptop transcription")
                        useLaptop = true
                        recognizer?.destroy()
                        recognizer = null
                        if (held) startLaptop() else deliver()
                    } else {
                        continueOrDeliver(null)
                    }
                }
            }
        }

        override fun onBufferReceived(buffer: ByteArray?) = Unit
        override fun onEndOfSpeech() = Unit
        override fun onEvent(eventType: Int, params: Bundle?) = Unit
    }

    // ── 2. Record while held, transcribe on the laptop ───────────────────────

    @SuppressLint("MissingPermission") // checked in begin()
    private fun startLaptop() {
        laptopJob?.cancel()
        laptopJob = scope.launch(Dispatchers.IO) {
            val min = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
            val rec = runCatching {
                AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, min * 4)
            }.getOrNull()?.takeIf { it.state == AudioRecord.STATE_INITIALIZED }
            if (rec == null) {
                withContext(Dispatchers.Main) {
                    callbacks().onError("Microphone unavailable")
                    callbacks().onNothingHeard()
                }
                return@launch
            }
            val frame = ShortArray(SAMPLE_RATE / 20) // 50 ms
            val speech = ByteArrayOutputStream()
            var ms = 0
            var lastInterimAt = 0
            var interim: Job? = null
            try {
                rec.startRecording()
                while (isActive && held && ms < 30_000) {
                    val n = rec.read(frame, 0, frame.size)
                    if (n <= 0) break
                    val bytes = ByteBuffer.allocate(n * 2).order(ByteOrder.LITTLE_ENDIAN)
                    var sum = 0.0
                    for (i in 0 until n) { bytes.putShort(frame[i]); sum += frame[i] * frame[i].toDouble() }
                    speech.write(bytes.array())
                    ms += 50
                    val level = (log10(sqrt(sum / n) / 700 + 1) * 1.6).toFloat().coerceIn(0f, 1f)
                    withContext(Dispatchers.Main) { callbacks().onLevel(level) }
                    if (ms - lastInterimAt >= 1200 && interim?.isActive != true) {
                        lastInterimAt = ms
                        val soFar = speech.toByteArray()
                        interim = scope.launch(Dispatchers.IO) {
                            val text = runCatching { transcribe(wav(soFar)) }.getOrNull()
                            if (!text.isNullOrBlank() && !text.isNoise()) withContext(Dispatchers.Main) { if (held) callbacks().onPartial(text) }
                        }
                    }
                }
            } finally {
                runCatching { rec.stop() }
                rec.release()
            }
            interim?.cancel()
            if (!isActive) return@launch
            val text = if (ms < 400) "" else runCatching { transcribe(wav(speech.toByteArray())) }
                .onFailure { Log.w(TAG, "laptop: transcribe failed", it) }
                .getOrNull().orEmpty()
            Log.i(TAG, "laptop: \"$text\" ($ms ms)")
            withContext(Dispatchers.Main) {
                if (text.isBlank() || text.isNoise()) callbacks().onNothingHeard() else callbacks().onUtterance(text)
            }
        }
    }

    /** whisper.cpp writes these for coughs, music and room noise. */
    private fun String.isNoise() = trim().let { it.startsWith("[") || it.startsWith("(") || it.length < 2 }

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
            readTimeout = 30_000
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
        SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "busy"
        SpeechRecognizer.ERROR_TOO_MANY_REQUESTS -> "too many requests"
        SpeechRecognizer.ERROR_SERVER_DISCONNECTED -> "server disconnected"
        SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED -> "language not supported"
        SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE -> "language unavailable"
        else -> "unknown"
    }
}
