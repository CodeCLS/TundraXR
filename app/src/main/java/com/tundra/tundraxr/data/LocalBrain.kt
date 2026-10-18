package com.tundra.tundraxr.data

import com.tundra.tundraxr.formatClock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/**
 * Talks to the Tundra brain server on the engineer's laptop, which reaches Tundra Cloud with the
 * hospital's key: devices, manuals, identification, captures and questions. Nothing is scripted:
 * when the laptop or the cloud can't answer, the error says so.
 */
class LocalBrain(private val baseUrl: String) : TundraBrain {

    /** Devices seen so far (inventory, identified, searched), with their manuals. */
    private val known = java.util.concurrent.ConcurrentHashMap<String, Pair<Device, Manual>>()
    private var inventoryLoaded = false

    override suspend fun identifyDevice(): Device = devices().firstOrNull() ?: error("No devices from the Tundra brain")

    override suspend fun devices(): List<Device> {
        if (!inventoryLoaded) {
            val arr = runCatching { JSONArray(get("/api/devices")) }.getOrNull() ?: return emptyList()
            for (i in 0 until arr.length()) remember(arr.getJSONObject(i))
            inventoryLoaded = true
        }
        return known.values.map { it.first }
    }

    override suspend fun manual(manualId: String): Manual =
        known.values.firstOrNull { it.second.id == manualId }?.second
            ?: Manual(manualId, "No manual on file", "", 0, null, emptyList())

    /** Parses a device as the server sends it (with its manual) and keeps it for later lookups. */
    private fun remember(d: JSONObject): Device {
        val m = d.optJSONObject("manual") ?: JSONObject()
        val manual = Manual(
            id = m.optString("id").ifEmpty { "none-${d.getString("id")}" },
            title = m.optString("title").ifEmpty { "Manual" },
            revision = m.optString("docNumber"),
            pageCount = m.optInt("pages"),
            // Devices without a manual of their own (only a manufacturer portal link) have no PDF.
            pdfUrl = if (m.isNull("url") || m.optString("url").isEmpty()) null else baseUrl + m.getString("url"),
            // Text manuals (no PDF) arrive as sections and show as pages.
            pages = m.optJSONArray("sections")?.let { arr ->
                (0 until arr.length()).map { i ->
                    val sec = arr.getJSONObject(i)
                    ManualPage(i + 1, "", sec.optString("title"), sec.optString("text").split(Regex("\n\\s*\n")).map { it.trim() }.filter { it.isNotEmpty() })
                }
            } ?: emptyList(),
        )
        val device = Device(
            id = d.getString("id"),
            name = d.optString("name"),
            manufacturer = d.optString("manufacturer"),
            category = d.optString("category"),
            assetTag = d.optString("assetTag"),
            serial = d.optString("serial"),
            location = d.optString("location"),
            lastPm = d.optString("lastPm"),
            openWorkOrders = d.optInt("openWorkOrders"),
            manualId = manual.id,
        )
        known[device.id] = device to manual
        return device
    }

    override suspend fun identify(sessionId: String, image: File): List<ImageMatch> {
        // Full camera frames are several MB; Tundra reads a type plate fine at 2048 px.
        val small = withContext(Dispatchers.IO) { shrink(image) } ?: image
        val res = JSONObject(post("/api/identify", JSONObject().put("sessionId", sessionId), small, "image/jpeg"))
        val arr = res.optJSONArray("matches") ?: JSONArray()
        return (0 until arr.length()).map { i ->
            val m = arr.getJSONObject(i)
            ImageMatch(
                label = m.optString("label"),
                device = m.optJSONObject("device")?.let(::remember),
                confidence = m.optDouble("score", 0.0).toFloat(),
                detail = m.optString("detail").ifEmpty { null },
            )
        }
    }

    private fun shrink(file: File, maxPx: Int = 2048): File? = runCatching {
        val bounds = android.graphics.BitmapFactory.Options().apply { inJustDecodeBounds = true }
        android.graphics.BitmapFactory.decodeFile(file.path, bounds)
        if (maxOf(bounds.outWidth, bounds.outHeight) <= maxPx && file.length() < 1_500_000) return@runCatching file
        var sample = 1
        while (maxOf(bounds.outWidth, bounds.outHeight) / (sample * 2) >= maxPx) sample *= 2
        val bmp = android.graphics.BitmapFactory.decodeFile(file.path, android.graphics.BitmapFactory.Options().apply { inSampleSize = sample }) ?: return@runCatching null
        val out = File(file.parentFile, "search_${file.name}")
        out.outputStream().use { bmp.compress(android.graphics.Bitmap.CompressFormat.JPEG, 85, it) }
        out
    }.getOrNull()

    override suspend fun findDevices(query: String): List<Device> = runCatching {
        val arr = JSONArray(get("/api/devices/search?q=${URLEncoder.encode(query, "UTF-8")}"))
        (0 until arr.length()).map { remember(arr.getJSONObject(it)) }
    }.getOrDefault(emptyList())

    override suspend fun ingest(sessionId: String, device: Device, item: CaptureItem): Pair<String?, RemoteStatus> {
        val kind = when (item.kind) {
            CaptureKind.Photo -> "photo"
            CaptureKind.Video -> "video"
            CaptureKind.Note -> "note"
        }
        val meta = meta(sessionId, device, kind, item.at)
            .put("durationSec", item.durationSec)
            .apply { if (item.transcript.isNotEmpty()) put("text", item.transcript) }
        val file = item.file?.let(::File)?.takeIf { it.exists() }
        val type = when (item.kind) {
            CaptureKind.Photo -> "image/jpeg"
            CaptureKind.Video -> "video/mp4"
            CaptureKind.Note -> null
        }
        val created = JSONObject(post("/api/captures", meta, file, type))
        return created.getString("id") to created.toStatus()
    }

    override suspend fun ask(sessionId: String, device: Device?, question: String, session: List<CaptureItem>): BrainAnswer {
        val body = JSONObject()
            .put("sessionId", sessionId)
            .put("question", question)
            .apply { if (device != null) put("device", deviceJson(device)) }
        val res = runCatching { JSONObject(postJson("/api/ask", body)) }.getOrElse {
            return BrainAnswer("Couldn't reach the Tundra brain: ${it.message?.take(160)}", emptyList())
        }
        val hits = res.optJSONArray("manualHits") ?: JSONArray()
        val manualSources = (0 until hits.length()).map { i ->
            val h = hits.getJSONObject(i)
            val box = h.optJSONArray("box")?.let { b -> (0 until b.length()).map { b.getDouble(it).toFloat() } }
            val section = h.optString("section")
            Source(
                SourceKind.Manual,
                "p.${h.getInt("page")}" + if (section.isNotEmpty()) " · ${section.take(40)}" else "",
                ManualTarget(h.getInt("page"), 0, section.ifEmpty { h.getString("title") }, box),
            )
        }
        val moments = res.optJSONArray("moments") ?: JSONArray()
        val videoSources = (0 until moments.length()).map { i ->
            val m = moments.getJSONObject(i)
            Source(SourceKind.Video, "${formatClock(m.optDouble("start").toInt())}–${formatClock(m.optDouble("end").toInt())} · on laptop")
        }
        return BrainAnswer(
            res.getString("answer"),
            manualSources + videoSources,
            charts = res.optJSONArray("charts")?.let { a -> (0 until a.length()).mapNotNull { parseChart(a.getJSONObject(it)) } } ?: emptyList(),
            tables = res.optJSONArray("tables")?.let { a -> (0 until a.length()).map { parseTable(a.getJSONObject(it)) } } ?: emptyList(),
            followUps = res.optJSONArray("followUps")?.let { a -> (0 until a.length()).map { a.getString(it) } } ?: emptyList(),
        )
    }

    private fun parseChart(c: JSONObject): Chart? = runCatching {
        val spec = c.getJSONObject("spec")
        val series = spec.getJSONArray("series")
        val points = c.getJSONArray("points")
        Chart(
            id = c.optString("id"),
            type = when (spec.optString("type")) {
                "line" -> ChartType.Line
                "area" -> ChartType.Area
                "pie" -> ChartType.Pie
                "scatter" -> ChartType.Scatter
                else -> ChartType.Bar
            },
            title = spec.optString("title"),
            caption = spec.optString("caption"),
            xLabel = spec.optJSONObject("x")?.optString("label").orEmpty(),
            yLabel = spec.optJSONObject("y")?.optString("label").orEmpty(),
            unit = spec.optJSONObject("y")?.optString("unit").orEmpty().takeIf { it != "none" }.orEmpty(),
            series = (0 until series.length()).map { series.getJSONObject(it).optString("label") },
            stacked = spec.optBoolean("stacked"),
            points = (0 until points.length()).map { i ->
                val p = points.getJSONObject(i)
                val v = p.getJSONArray("values")
                ChartPoint(p.get("x").toString(), (0 until v.length()).map { if (v.isNull(it)) null else v.getDouble(it).toFloat() })
            },
            illustrative = spec.optBoolean("illustrative"),
        )
    }.getOrNull()

    private fun parseTable(t: JSONObject): DataTable {
        val cols = t.getJSONArray("columns")
        val rows = t.getJSONArray("rows")
        return DataTable(
            name = t.optString("dataset"),
            columns = (0 until cols.length()).map { cols.get(it).let { c -> (c as? JSONObject)?.optString("label") ?: c.toString() } },
            rows = (0 until rows.length()).map { r -> rows.getJSONArray(r).let { row -> (0 until row.length()).map { if (row.isNull(it)) "" else row.get(it).toString() } } },
            rowCount = t.optInt("row_count", rows.length()),
            truncated = t.optBoolean("truncated"),
        )
    }

    override suspend fun statuses(sessionId: String): Map<String, RemoteStatus>? = runCatching {
        val arr = JSONArray(get("/api/captures?sessionId=${URLEncoder.encode(sessionId, "UTF-8")}"))
        (0 until arr.length()).associate { i -> arr.getJSONObject(i).let { it.getString("id") to it.toStatus() } }
    }.getOrNull()

    // ── HTTP ──────────────────────────────────────────────────────────────────

    private fun meta(sessionId: String, device: Device, kind: String, at: String) = JSONObject()
        .put("sessionId", sessionId)
        .put("kind", kind)
        .put("at", at)
        .put("device", deviceJson(device))

    private fun deviceJson(device: Device) = JSONObject()
        .put("id", device.id).put("name", device.name).put("manufacturer", device.manufacturer)
        .put("category", device.category).put("assetTag", device.assetTag)
        .put("serial", device.serial).put("location", device.location)

    private suspend fun post(path: String, meta: JSONObject, file: File?, contentType: String?): String = withContext(Dispatchers.IO) {
        val conn = open(path, readTimeoutMs = 120_000)
        conn.requestMethod = "POST"
        conn.doOutput = true
        // Metadata travels in a header so the body can be the raw media file.
        conn.setRequestProperty("x-tundra-meta", URLEncoder.encode(meta.toString(), "UTF-8").replace("+", "%20"))
        if (contentType != null) conn.setRequestProperty("content-type", contentType)
        conn.setFixedLengthStreamingMode(file?.length() ?: 0L)
        conn.outputStream.use { out -> file?.inputStream()?.use { it.copyTo(out) } }
        conn.readResponse()
    }

    private suspend fun postJson(path: String, body: JSONObject): String = withContext(Dispatchers.IO) {
        val bytes = body.toString().toByteArray()
        // Cloud answers can take a while (the brain may continue in a background job).
        val conn = open(path, readTimeoutMs = 120_000)
        conn.requestMethod = "POST"
        conn.doOutput = true
        conn.setRequestProperty("content-type", "application/json")
        conn.setFixedLengthStreamingMode(bytes.size)
        conn.outputStream.use { it.write(bytes) }
        conn.readResponse()
    }

    private suspend fun get(path: String): String = withContext(Dispatchers.IO) { open(path, 5_000).readResponse() }

    private fun open(path: String, readTimeoutMs: Int) = (URL(baseUrl + path).openConnection() as HttpURLConnection).apply {
        connectTimeout = 3_000
        readTimeout = readTimeoutMs
        setRequestProperty("user-agent", "TundraXR/1.0")
    }

    private fun HttpURLConnection.readResponse(): String {
        try {
            val code = responseCode
            val body = (if (code in 200..299) inputStream else errorStream)?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (code !in 200..299) error("Brain returned $code: $body")
            return body
        } finally {
            disconnect()
        }
    }
}

private fun JSONObject.toStatus(): RemoteStatus {
    val tl = getJSONObject("tl")
    return when (tl.optString("analysis")) {
        "pending", "running" -> RemoteStatus(SyncState.Analyzing, if (tl.optString("upload") == "running") "Uploading" else null)
        "done" -> {
            val n = optJSONObject("analysis")?.optJSONArray("findings")?.length() ?: 0
            RemoteStatus(SyncState.Analyzed, if (n == 0) "No findings" else "$n finding${if (n == 1) "" else "s"}")
        }
        "failed" -> RemoteStatus(SyncState.Failed, "Analysis failed")
        else -> RemoteStatus(SyncState.InBrain, null)
    }
}
