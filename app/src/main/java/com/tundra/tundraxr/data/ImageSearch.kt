package com.tundra.tundraxr.data

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.io.File

/**
 * One answer from Tundra's image search: a hospital device (when the match is a specific one in
 * the records) or just what it looks like, how sure it is, and what else it said about it.
 */
data class ImageMatch(val label: String, val device: Device?, val confidence: Float, val detail: String? = null)

/** Scripted results for the offline demo build only (tundra.demo=true). */
class DemoImageSearch {
    private var calls = 0

    suspend fun search(region: File, inventory: List<Device>): List<ImageMatch> {
        delay(1800)
        if (inventory.isEmpty()) return listOf(ImageMatch("Unknown device", null, 0.31f))
        val start = calls++ % inventory.size
        val ordered = inventory.indices.map { inventory[(start + it) % inventory.size] }
        val scores = listOf(0.94f, 0.41f, 0.12f)
        return ordered.take(3).mapIndexed { i, d -> ImageMatch(d.name, d, scores.getOrElse(i) { 0.05f }) }
    }
}

/** Crops [box] (fractions left, top, right, bottom) out of the photo at [path] into a new JPEG. */
suspend fun cropRegion(path: String, box: List<Float>, outDir: File): File? = withContext(Dispatchers.IO) {
    runCatching {
        val full = BitmapFactory.decodeFile(path) ?: return@runCatching null
        val l = (box[0] * full.width).toInt().coerceIn(0, full.width - 1)
        val t = (box[1] * full.height).toInt().coerceIn(0, full.height - 1)
        val r = (box[2] * full.width).toInt().coerceIn(l + 1, full.width)
        val b = (box[3] * full.height).toInt().coerceIn(t + 1, full.height)
        val crop = Bitmap.createBitmap(full, l, t, r - l, b - t)
        val out = File(outDir.apply { mkdirs() }, "region_${System.currentTimeMillis()}.jpg")
        out.outputStream().use { crop.compress(Bitmap.CompressFormat.JPEG, 90, it) }
        out
    }.getOrNull()
}
