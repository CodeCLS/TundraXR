package com.tundra.tundraxr.data

import com.tundra.tundraxr.formatClock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/**
 * Talks to the local Tundra brain (server/) on the engineer's laptop: devices, real OEM
 * manuals, captures and questions. Falls back to [demo] when the laptop can't be reached.
 */
class LocalBrain(private val baseUrl: String, private val demo: DemoBrain = DemoBrain()) : TundraBrain {

    private var catalog: Map<String, Pair<Device, Manual>>? = null

    /** Identification is still simulated: the first catalog device, after a short "look". */
    override suspend fun identifyDevice(): Device {
        val devices = devices()
        delay(1200)
        return devices.firstOrNull() ?: demo.identifyDevice()
    }

    override suspend fun devices(): List<Device> =
        loadCatalog()?.values?.map { it.first } ?: demo.devices()

    override suspend fun manual(manualId: String): Manual =
        loadCatalog()?.values?.firstOrNull { it.second.id == manualId }?.second ?: demo.manual(manualId)

    private suspend fun loadCatalog(): Map<String, Pair<Device, Manual>>? {
        catalog?.let { return it }
        val arr = runCatching { JSONArray(get("/api/devices")) }.getOrNull() ?: return null
        return (0 until arr.length()).associate { i ->
            val d = arr.getJSONObject(i)
            val m = d.getJSONObject("manual")
            val manual = Manual(
                id = m.getString("id"),
                title = m.getString("title"),
                revision = m.getString("docNumber"),
                pageCount = m.optInt("pages"),
                pdfUrl = baseUrl + m.getString("url"),
                pages = emptyList(),
            )
            val device = Device(
                id = d.getString("id"),
                name = d.getString("name"),
                manufacturer = d.getString("manufacturer"),
                category = d.getString("category"),
                assetTag = d.getString("assetTag"),
                serial = d.getString("serial"),
                location = d.getString("location"),
                lastPm = d.optString("lastPm"),
                openWorkOrders = d.optInt("openWorkOrders"),
                manualId = manual.id,
            )
            device.id to (device to manual)
        }.also { catalog = it }
    }

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

    override suspend fun ask(sessionId: String, device: Device, question: String, session: List<CaptureItem>): BrainAnswer {
        val body = JSONObject()
            .put("sessionId", sessionId)
            .put("question", question)
            .put("device", meta(sessionId, device, "question", "").getJSONObject("device"))
        val res = runCatching { JSONObject(postJson("/api/ask", body)) }.getOrElse {
            return demo.ask(sessionId, device, question, session)
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
        return BrainAnswer(res.getString("answer"), manualSources + videoSources)
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
        .put(
            "device",
            JSONObject()
                .put("id", device.id).put("name", device.name).put("manufacturer", device.manufacturer)
                .put("category", device.category).put("assetTag", device.assetTag)
                .put("serial", device.serial).put("location", device.location),
        )

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
        val conn = open(path, readTimeoutMs = 30_000)
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
