package com.tundra.tundraxr.capture

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.util.Log
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

/**
 * Runs the ExecuTorch cropper on the device itself. A drawn "device" (a dark housing with a lit
 * screen) stands on a plain bench; the crop must find the housing, not the screen or the bench.
 */
@RunWith(AndroidJUnit4::class)
class DeviceCropperTest {

    private val context = InstrumentationRegistry.getInstrumentation().targetContext

    @Test
    fun cropsToTheObjectInView() = runBlocking {
        val dir = File(context.cacheDir, "cropper-test").apply { mkdirs() }
        val photo = File(dir, "bench.jpg")
        val housing = RectF(700f, 380f, 1220f, 1060f)
        Bitmap.createBitmap(1920, 1440, Bitmap.Config.ARGB_8888).apply {
            val canvas = Canvas(this)
            canvas.drawColor(Color.rgb(214, 208, 196))
            canvas.drawRoundRect(housing, 40f, 40f, Paint().apply { color = Color.rgb(48, 52, 60) })
            canvas.drawRect(RectF(780f, 440f, 1140f, 640f), Paint().apply { color = Color.rgb(90, 170, 230) })
            photo.outputStream().use { compress(Bitmap.CompressFormat.JPEG, 92, it) }
        }

        val cropper = DeviceCropper(context)
        cropper.warmUp()
        val first = cropper.crop(photo)
        val crop = cropper.crop(photo)
        Log.i("TundraCropperTest", "box=${crop.box} in ${crop.millis} ms (first ${first.millis} ms)")

        assertNotNull("no confident mask", crop.box)
        val box = crop.box!!
        assertTrue("box $box misses the housing", box.left <= housing.left && box.right >= housing.right &&
            box.top <= housing.top && box.bottom >= housing.bottom)
        assertTrue("box $box is the whole bench", box.width() < 1920 * 0.6f)
        assertTrue(crop.file.exists() && crop.file != photo)
    }

    /** The newest photo the app took, if any: timing and a box on a real capture, for the log. */
    @Test
    fun cropsTheLatestCapture() = runBlocking {
        val latest = File(context.filesDir, "captures").listFiles { f -> f.name.endsWith(".jpg") && !f.name.endsWith("_crop.jpg") }
            ?.maxByOrNull { it.lastModified() } ?: return@runBlocking
        val crop = DeviceCropper(context).run { warmUp(); crop(latest) }
        Log.i("TundraCropperTest", "${latest.name}: box=${crop.box} in ${crop.millis} ms")
    }
}
