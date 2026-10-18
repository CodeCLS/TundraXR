package com.tundra.tundraxr.capture

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.UseCase
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FallbackStrategy
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.suspendCancellableCoroutine
import java.io.File
import kotlin.coroutines.resume

private const val TAG = "TundraCamera"

/**
 * The headset's world-facing camera. Passthrough is the viewfinder, so there is no preview:
 * the engineer just looks at the device. Photos and video land in app storage, ready to upload.
 */
class DeviceCamera(private val context: Context) {

    private var provider: ProcessCameraProvider? = null
    private var owner: LifecycleOwner? = null
    private var selector = CameraSelector.DEFAULT_BACK_CAMERA
    private val imageCapture = ImageCapture.Builder().setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY).build()
    private val videoCapture = VideoCapture.withOutput(
        Recorder.Builder()
            .setQualitySelector(QualitySelector.from(Quality.FHD, FallbackStrategy.lowerQualityOrHigherThan(Quality.SD)))
            .build(),
    )
    /** False when the camera can't run photo and video at once; we then rebind per action. */
    private var concurrent = true
    private var recording: Recording? = null
    private var recordingDone: CompletableDeferred<File?>? = null

    var available = false
        private set

    private val mediaDir get() = File(context.filesDir, "captures").apply { mkdirs() }

    fun hasPermission() =
        ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED

    suspend fun bind(lifecycleOwner: LifecycleOwner): Boolean {
        if (!hasPermission()) return false
        owner = lifecycleOwner
        val p: ProcessCameraProvider = runCatching { cameraProvider() }.getOrElse {
            Log.w(TAG, "No camera provider", it); return false
        }
        provider = p
        selector = listOf(CameraSelector.DEFAULT_BACK_CAMERA, CameraSelector.DEFAULT_FRONT_CAMERA)
            .firstOrNull { runCatching { p.hasCamera(it) }.getOrDefault(false) } ?: return false
        concurrent = bindUseCases(imageCapture, videoCapture)
        available = concurrent || bindUseCases(imageCapture)
        Log.i(TAG, "Camera ready=$available concurrent=$concurrent")
        return available
    }

    suspend fun takePhoto(): File? {
        if (!available) return null
        if (!concurrent && recording == null) bindUseCases(imageCapture)
        val file = File(mediaDir, "photo_${System.currentTimeMillis()}.jpg")
        return suspendCancellableCoroutine { cont ->
            imageCapture.takePicture(
                ImageCapture.OutputFileOptions.Builder(file).build(),
                ContextCompat.getMainExecutor(context),
                object : ImageCapture.OnImageSavedCallback {
                    override fun onImageSaved(output: ImageCapture.OutputFileResults) = cont.resume(file)
                    override fun onError(e: ImageCaptureException) {
                        Log.w(TAG, "Photo failed", e)
                        cont.resume(null)
                    }
                },
            )
        }
    }

    @SuppressLint("MissingPermission") // audio is only enabled after checking RECORD_AUDIO
    /**
     * [withAudio] is off while the hands-free listener has the mic: Android gives a shared mic to
     * only one recorder, and the engineer's narration is transcribed into the record instead.
     */
    fun startRecording(withAudio: Boolean = true): Boolean {
        if (!available || recording != null) return false
        if (!concurrent && !bindUseCases(videoCapture)) return false
        val file = File(mediaDir, "video_${System.currentTimeMillis()}.mp4")
        val done = CompletableDeferred<File?>()
        recordingDone = done
        val hasMic = ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        recording = videoCapture.output
            .prepareRecording(context, FileOutputOptions.Builder(file).build())
            .apply { if (hasMic && withAudio) withAudioEnabled() }
            .start(ContextCompat.getMainExecutor(context)) { event ->
                if (event is VideoRecordEvent.Finalize) {
                    if (event.hasError()) Log.w(TAG, "Recording finalized with error ${event.error}", event.cause)
                    // ERROR_SOURCE_INACTIVE etc. can still leave a playable file; keep it if it has data.
                    done.complete(file.takeIf { it.exists() && it.length() > 0 })
                }
            }
        return true
    }

    suspend fun stopRecording(): File? {
        val r = recording ?: return null
        recording = null
        r.stop()
        return recordingDone?.await().also { recordingDone = null }
    }

    private suspend fun cameraProvider(): ProcessCameraProvider = suspendCancellableCoroutine { cont ->
        val future = ProcessCameraProvider.getInstance(context)
        future.addListener(
            { runCatching { future.get() }.fold(cont::resume) { cont.resumeWith(Result.failure(it)) } },
            ContextCompat.getMainExecutor(context),
        )
    }

    private fun bindUseCases(vararg useCases: UseCase): Boolean {
        val p = provider ?: return false
        val o = owner ?: return false
        return runCatching {
            p.unbindAll()
            p.bindToLifecycle(o, selector, *useCases)
        }.onFailure { Log.w(TAG, "Bind ${useCases.joinToString { it.javaClass.simpleName }} failed", it) }.isSuccess
    }
}
