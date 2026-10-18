package com.tundra.tundraxr.capture

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.graphics.PointF
import android.graphics.Rect
import android.media.ExifInterface
import android.os.SystemClock
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.pytorch.executorch.EValue
import org.pytorch.executorch.Module
import org.pytorch.executorch.Tensor
import java.io.File

private const val TAG = "TundraCropper"
private const val ASSET = "device_cropper.pte"

/** The program's input side (tools/cropper/export.py); its masks are a quarter of that. */
private const val SIZE = 512

/** A mask counts when the model trusts it and it is neither a speck nor the whole view. */
private const val MIN_IOU = 0.7f
private const val MIN_AREA = 0.01f
private const val MAX_AREA = 0.85f
private const val MARGIN = 0.12f

/**
 * Crops a photo to the object the engineer is looking at, on the headset, before it is sent to
 * image search. EfficientSAM-Ti runs through ExecuTorch (XNNPACK, CPU): the photo and one point,
 * the centre of view unless told otherwise, give three masks (subpart, part, whole object); the
 * largest confident one becomes a box with a margin. When no mask qualifies the photo goes as taken,
 * so the crop can only narrow what is sent, never lose a search.
 */
class DeviceCropper(private val context: Context) {

    /** [box] is in the photo's pixels, null when the photo was kept whole. */
    data class Crop(val file: File, val box: Rect?, val millis: Long)

    private val lock = Mutex()
    private var module: Module? = null
    private var unavailable = false

    /** Loads the model ahead of the first photo (~40 MB). */
    suspend fun warmUp() = withContext(Dispatchers.Default) { lock.withLock { load() } }

    /** [point] is where the engineer looks, in the photo's pixels; the centre when null. */
    suspend fun crop(photo: File, point: PointF? = null): Crop = withContext(Dispatchers.Default) {
        lock.withLock {
            val start = SystemClock.elapsedRealtime()
            val result = runCatching { cropLocked(photo, point) }
                .onFailure { Log.w(TAG, "Crop failed, sending the whole photo", it) }
                .getOrNull()
            val millis = SystemClock.elapsedRealtime() - start
            Log.i(TAG, "crop ${photo.name}: box=${result?.second} in ${millis} ms")
            Crop(result?.first ?: photo, result?.second, millis)
        }
    }

    private fun cropLocked(photo: File, point: PointF?): Pair<File, Rect>? {
        val model = load() ?: return null
        val bitmap = decodeUpright(photo) ?: return null
        val w = bitmap.width
        val h = bitmap.height
        val p = point ?: PointF(w / 2f, h / 2f)

        val input = Bitmap.createScaledBitmap(bitmap, SIZE, SIZE, true)
        val pixels = IntArray(SIZE * SIZE).also { input.getPixels(it, 0, SIZE, 0, 0, SIZE, SIZE) }
        input.recycle()
        val plane = SIZE * SIZE
        val chw = FloatArray(3 * plane)
        for (i in 0 until plane) {
            val c = pixels[i]
            chw[i] = (c shr 16 and 0xFF) / 255f
            chw[plane + i] = (c shr 8 and 0xFF) / 255f
            chw[2 * plane + i] = (c and 0xFF) / 255f
        }

        val t = SystemClock.elapsedRealtime()
        val out = model.forward(
            EValue.from(Tensor.fromBlob(chw, longArrayOf(1, 3, SIZE.toLong(), SIZE.toLong()))),
            EValue.from(Tensor.fromBlob(floatArrayOf(p.x / w * SIZE, p.y / h * SIZE), longArrayOf(1, 2))),
        )
        val maskTensor = out[0].toTensor()
        val masks = maskTensor.dataAsFloatArray
        val iou = out[1].toTensor().dataAsFloatArray
        Log.i(TAG, "model ${SystemClock.elapsedRealtime() - t} ms, iou=${iou.joinToString { "%.2f".format(it) }}")

        val box = chooseBox(masks, maskTensor.shape().last().toInt(), iou, w, h)
        if (box == null) {
            bitmap.recycle()
            return null
        }
        val cropped = Bitmap.createBitmap(bitmap, box.left, box.top, box.width(), box.height())
        val file = File(photo.parentFile, photo.nameWithoutExtension + "_crop.jpg")
        file.outputStream().use { cropped.compress(Bitmap.CompressFormat.JPEG, 92, it) }
        cropped.recycle()
        bitmap.recycle()
        return file to box
    }

    private fun load(): Module? {
        module?.let { return it }
        if (unavailable) return null
        return runCatching {
            val file = File(context.filesDir, "models/$ASSET")
            val size = context.assets.openFd(ASSET).use { it.length }
            if (!file.exists() || file.length() != size) {
                file.parentFile?.mkdirs()
                context.assets.open(ASSET).use { src -> file.outputStream().use { src.copyTo(it) } }
            }
            val t = SystemClock.elapsedRealtime()
            Module.load(file.absolutePath).also {
                it.loadMethod("forward")
                Log.i(TAG, "Loaded ${file.length() / 1_000_000} MB model in ${SystemClock.elapsedRealtime() - t} ms")
            }
        }.onFailure {
            unavailable = true
            Log.w(TAG, "No on-device cropper (run tools/cropper/export.py to build $ASSET)", it)
        }.getOrNull().also { module = it }
    }
}

/**
 * The largest confident mask that is neither a speck nor the whole view, as a box in a [w]×[h]
 * photo with [MARGIN] around it; null when none qualifies. [masks] is 3 × [side] × [side] logits.
 */
internal fun chooseBox(masks: FloatArray, side: Int, iou: FloatArray, w: Int, h: Int): Rect? {
    val plane = side * side
    var best = -1
    var bestArea = 0f
    for (m in 0 until 3) {
        var on = 0
        for (i in 0 until plane) if (masks[m * plane + i] > 0f) on++
        val area = on.toFloat() / plane
        if (iou[m] >= MIN_IOU && area in MIN_AREA..MAX_AREA && area > bestArea) {
            best = m
            bestArea = area
        }
    }
    if (best < 0) return null

    var x0 = side; var y0 = side; var x1 = -1; var y1 = -1
    for (y in 0 until side) for (x in 0 until side) {
        if (masks[best * plane + y * side + x] > 0f) {
            if (x < x0) x0 = x
            if (x > x1) x1 = x
            if (y < y0) y0 = y
            if (y > y1) y1 = y
        }
    }
    val left = x0.toFloat() / side * w
    val right = (x1 + 1).toFloat() / side * w
    val top = y0.toFloat() / side * h
    val bottom = (y1 + 1).toFloat() / side * h
    val mx = (right - left) * MARGIN
    val my = (bottom - top) * MARGIN
    return Rect(
        (left - mx).toInt().coerceAtLeast(0),
        (top - my).toInt().coerceAtLeast(0),
        (right + mx).toInt().coerceAtMost(w),
        (bottom + my).toInt().coerceAtMost(h),
    )
}

/** The photo as the engineer saw it: EXIF rotation applied. */
private fun decodeUpright(file: File): Bitmap? {
    val bitmap = BitmapFactory.decodeFile(file.absolutePath) ?: return null
    val degrees = when (ExifInterface(file.absolutePath).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
        ExifInterface.ORIENTATION_ROTATE_90 -> 90f
        ExifInterface.ORIENTATION_ROTATE_180 -> 180f
        ExifInterface.ORIENTATION_ROTATE_270 -> 270f
        else -> 0f
    }
    if (degrees == 0f) return bitmap
    return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, Matrix().apply { postRotate(degrees) }, true)
        .also { if (it !== bitmap) bitmap.recycle() }
}
