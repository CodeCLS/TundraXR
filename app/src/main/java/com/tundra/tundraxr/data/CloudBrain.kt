package com.tundra.tundraxr.data

import android.util.Base64
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.concurrent.ConcurrentHashMap

private const val TAG = "TundraCloud"

/**
 * The headset talking to Tundra Cloud directly (https://app.tundrahealth.ai/api/external) with
 * the hospital's API key: no laptop needed. Inventory, image search, chat (with charts and
 * tables), manuals, and photos and notes attached to the device.
 */
class CloudBrain(private val apiKey: String, private val base: String = "https://app.tundrahealth.ai/api/external") : TundraBrain {

    private data class Ref(val dataset: String, val key: String)

    /** Everything known about a device: where it is in the records, and its manual. */
    private data class Entry(val ref: Ref, val device: Device, val manual: Manual, val manualDoc: String?, val manualIsPdf: Boolean)

    private val entries = ConcurrentHashMap<String, Entry>()
    private var inventory: List<Device>? = null
    /** Conversation per headset session, so follow-up questions keep their context. */
    private val conversations = ConcurrentHashMap<String, String>()
    /** Photos Tundra already holds from an image search (by local path), so they aren't uploaded twice. */
    private val searched = ConcurrentHashMap<String, String>()
    private var lastPing = 0L
    private var online: Boolean? = null

    // ── Devices ──────────────────────────────────────────────────────────────

    override suspend fun identifyDevice(): Device = devices().firstOrNull() ?: error("No devices from Tundra")

    /** A few devices per model in service, for "this is the …" and the device list. */
    override suspend fun devices(): List<Device> {
        inventory?.let { return it }
        val list = runCatching {
            val models = JSONObject(get("/models")).optJSONArray("models") ?: JSONArray()
            val refs = mutableListOf<Ref>()
            for (i in 0 until models.length()) {
                if (refs.size >= 12) break
                val model = models.getJSONObject(i).optString("model")
                if (model.contains("<PSN-")) continue // masked in the records: can't be searched by name
                search(model).take(2).forEach { r -> if (refs.size < 12 && refs.none { it.key == r.first.key }) refs += r.first }
            }
            coroutineScope { refs.map { async { runCatching { entry(it) }.getOrNull() } }.awaitAll() }.filterNotNull().map { it.device }
        }.onFailure { Log.w(TAG, "devices: ${it.message}") }.getOrNull() ?: return emptyList()
        Log.i(TAG, "inventory: ${list.size} devices from Tundra Cloud")
        inventory = list
        return list
    }

    override suspend fun manual(manualId: String): Manual {
        val e = entries.values.firstOrNull { it.manual.id == manualId } ?: return Manual(manualId, "No manual on file", "", 0, null, emptyList())
        // PDF download links are short-lived: fetch a fresh one when the manual is opened.
        if (e.manualIsPdf && e.manualDoc != null) {
            val url = runCatching { JSONObject(get("/documents/${enc(e.manualDoc)}/download")).optString("download_url") }.getOrNull()
            if (!url.isNullOrEmpty()) return e.manual.copy(pdfUrl = url)
        }
        return e.manual
    }

    override suspend fun findDevices(query: String): List<Device> = runCatching {
        coroutineScope { search(query).take(5).map { async { runCatching { entry(it.first).device }.getOrNull() } }.awaitAll() }.filterNotNull()
    }.getOrDefault(emptyList())

    /** Device rows matching q; the same device can come from several datasets, the connector's wins. */
    private suspend fun search(q: String): List<Pair<Ref, String>> {
        val r = JSONObject(post("/records/search", JSONObject().put("q", q.take(200)).put("schemas", JSONArray().put("device"))))
        val groups = r.optJSONArray("groups") ?: return emptyList()
        val sorted = (0 until groups.length()).map { groups.getJSONObject(it) }.sortedByDescending { it.optString("dataset_id").startsWith("connector") }
        val out = mutableListOf<Pair<Ref, String>>()
        for (g in sorted) {
            val hits = g.optJSONArray("hits") ?: continue
            for (i in 0 until hits.length()) {
                val h = hits.getJSONObject(i)
                val key = h.optString("key")
                if (out.none { it.first.key == key }) out += Ref(g.optString("dataset_id"), key) to h.optString("label", key)
            }
        }
        return out
    }

    /** One device from the records, with its manual (the model's, or a document of kind manual). */
    private suspend fun entry(ref: Ref): Entry {
        val id = "cloud:${ref.dataset}\u0000${ref.key}"
        entries[id]?.let { return it }
        val r = JSONObject(get("/devices/${enc(ref.dataset)}/${enc(ref.key)}"))
        val d = r.optJSONObject("device") ?: JSONObject()
        val k = r.optJSONObject("kpis") ?: JSONObject()
        val m = r.optJSONObject("manual")
        val type = clean(d.optString("name"))
        val model = clean(d.optString("model"))
        val manufacturer = clean(d.optString("manufacturer"))
        val docs = r.optJSONArray("documents") ?: JSONArray()
        val manualDoc = m?.optString("document_id")?.takeIf { it.isNotEmpty() && it != "null" }
            ?: (0 until docs.length()).map { docs.getJSONObject(it) }.firstOrNull { it.optString("kind") == "manual" }?.optString("document_id")
        var title = "No manual on file"
        var isPdf = false
        var pages = emptyList<ManualPage>()
        if (manualDoc != null) {
            val dl = runCatching { JSONObject(get("/documents/${enc(manualDoc)}/download")) }.getOrNull()
            isPdf = dl?.optString("content_type")?.contains("pdf") == true
            val docNumber = m?.optString("doc_number")?.takeIf { it.isNotEmpty() && it != "null" }
            title = clean(dl?.optString("title").orEmpty()).removeSuffix(".pdf").ifEmpty { docNumber?.let { "Manual $it" } ?: "${type.ifEmpty { model }} · Manual" }
            if (!isPdf) pages = runCatching { sections(manualDoc) }.getOrDefault(emptyList())
        }
        val manual = Manual(
            id = manualDoc ?: "none-${ref.key}",
            title = title,
            revision = m?.optString("doc_number").orEmpty().takeIf { it != "null" }.orEmpty(),
            pageCount = 0,
            pdfUrl = null, // resolved in manual(), the link is short-lived
            pages = pages,
        )
        val device = Device(
            id = id,
            name = listOf(manufacturer, model).filter { it.isNotEmpty() }.joinToString(" ").ifEmpty { type.ifEmpty { ref.key } },
            manufacturer = manufacturer,
            category = type.ifEmpty { model.ifEmpty { "Medical device" } },
            assetTag = d.optString("inventory_number").ifEmpty { ref.key },
            serial = d.optString("serial_number"),
            location = d.optString("location"),
            lastPm = date(k.optString("last_inspection_at")) + if (k.optBoolean("inspection_overdue")) " · overdue" else "",
            openWorkOrders = k.optInt("open_work_orders"),
            manualId = manual.id,
        )
        return Entry(ref, device, manual, manualDoc, isPdf && manualDoc != null).also { entries[id] = it }
    }

    /** A text manual (no PDF) as pages, one per heading. */
    private suspend fun sections(documentId: String): List<ManualPage> {
        val raw = get("/documents/${enc(documentId)}/text")
        val text = runCatching { JSONObject(raw).optString("text") }.getOrNull() ?: raw
        val out = mutableListOf<ManualPage>()
        var title = ""
        val body = StringBuilder()
        fun flush() {
            val paras = body.split(Regex("\n\\s*\n")).map { it.trim() }.filter { it.isNotEmpty() }
            if (title.isNotEmpty() || paras.isNotEmpty()) out += ManualPage(out.size + 1, "", title, paras)
            body.clear()
        }
        for (line in text.lines()) {
            val h = Regex("^#{1,3}\\s+(.*)").find(line)
            if (h != null) { flush(); title = h.groupValues[1].trim() } else body.append(line).append('\n')
        }
        flush()
        return out
    }

    // ── Image search ────────────────────────────────────────────────────────

    /**
     * Which device a photo shows: Tundra reads the type plate and matches serial, inventory number
     * or model. When that finds nothing (e.g. the model is masked in the records), search the
     * records for what it recognised.
     */
    override suspend fun identify(sessionId: String, image: File): List<ImageMatch> = coroutineScope {
        val small = withContext(Dispatchers.IO) { shrinkPhoto(image) } ?: image
        val body = JSONObject()
            .put("image", Base64.encodeToString(small.readBytes(), Base64.NO_WRAP))
            .put("media_type", "image/jpeg")
        val r = JSONObject(post("/image-search", body, readTimeoutMs = 60_000))
        r.optString("document_id").takeIf { it.isNotEmpty() }?.let { searched[image.path] = it }
        val id = r.optJSONObject("identified") ?: JSONObject()
        val confidence = id.optString("confidence")
        data class Pick(val ref: Ref, val label: String, val score: Float, val on: String)
        val picks = mutableListOf<Pick>()
        val matches = r.optJSONArray("matches") ?: JSONArray()
        for (i in 0 until matches.length()) {
            val mm = matches.getJSONObject(i)
            val key = mm.optString("key")
            if (picks.any { it.ref.key == key }) continue
            val on = mm.optString("matched_on", "model")
            val base = when { on == "serial" -> 0.98f; on == "inventory" -> 0.96f; confidence == "high" -> 0.86f; confidence == "medium" -> 0.7f; else -> 0.5f }
            picks += Pick(Ref(mm.optString("dataset"), key), mm.optString("label", key), (base - picks.size * 0.04f).coerceAtLeast(0.2f), on)
        }
        if (picks.isEmpty()) {
            fun plain(k: String) = clean(id.optString(k)).replace(Regex("\\s*\\(.*?\\)\\s*"), " ").trim()
            val queries = listOf("serial_number", "inventory_number", "device_type", "model", "manufacturer").map(::plain).filter { it.length >= 2 && it != "null" }.distinct()
            val results = queries.map { q -> async { q to runCatching { search(q) }.getOrDefault(emptyList()) } }.awaitAll()
            for ((q, hits) in results) for ((ref, label) in hits) {
                if (picks.size >= 5 || picks.any { it.ref.key == ref.key }) continue
                picks += Pick(ref, label, (0.62f - picks.size * 0.06f).coerceAtLeast(0.2f), "search “$q”")
            }
        }
        val read = listOf("manufacturer", "model", "device_type").map { clean(id.optString(it)) }.filter { it.isNotEmpty() && it != "null" }.joinToString(" · ")
        val top = picks.take(3)
        val devices = top.map { p -> async { runCatching { entry(p.ref).device }.getOrNull() } }.awaitAll()
        val out = top.mapIndexed { i, p ->
            val d = devices[i]
            ImageMatch(
                label = d?.let { "${it.name.ifEmpty { it.category }} · ${it.assetTag}" } ?: p.label.replace(Regex("<PSN-[^>]+>\\s*·?\\s*"), ""),
                device = d,
                confidence = p.score,
                detail = if (i == 0 && read.isNotEmpty()) "Read: $read" + if (p.on.startsWith("search")) "" else " · matched on ${p.on}" else null,
            )
        }
        Log.i(TAG, "identify: read \"$read\" → ${picks.size} matches")
        if (out.isEmpty() && read.isNotEmpty()) {
            listOf(ImageMatch(read, null, 0f, if (id.optBoolean("is_device", true)) "Not in the hospital's records" else "Not a medical device · not in the hospital's records"))
        } else out
    }

    // ── Chat ────────────────────────────────────────────────────────────────

    override suspend fun ask(sessionId: String, device: Device?, question: String, session: List<CaptureItem>): BrainAnswer {
        val entry = device?.let { entries[it.id] }
        val body = JSONObject().put("question", question + briefing(question)).put("language", "en")
        if (entry != null) body.put("device", JSONObject().put("dataset", entry.ref.dataset).put("key", entry.ref.key))
        conversations[sessionId]?.let { body.put("conversation_id", it) }
        return runCatching { chat(sessionId, body, entry) }.getOrElse {
            Log.w(TAG, "ask failed", it)
            BrainAnswer("The Tundra brain couldn't answer: ${reason(it.message.orEmpty())}", emptyList())
        }
    }

    private suspend fun chat(sessionId: String, body: JSONObject, entry: Entry?): BrainAnswer = withContext(Dispatchers.IO) {
        val answer = StringBuilder()
        var sources = JSONArray()
        val charts = LinkedHashMap<String, JSONObject>()
        val tables = LinkedHashMap<String, JSONObject>()
        var followUps = JSONArray()
        var conversation: String? = null
        var seq = -1
        var job = false
        fun take(event: String, data: JSONObject) {
            when (event) {
                "conversation" -> { conversation = data.optString("conversation_id"); seq = data.optInt("seq") }
                "token" -> answer.append(data.optString("text"))
                "sources" -> sources = data.optJSONArray("passages") ?: JSONArray()
                "chart" -> charts[data.optString("id")] = data
                "data" -> tables[data.optString("dataset")] = data
                "follow_ups" -> followUps = data.optJSONArray("questions") ?: JSONArray()
                "job" -> job = true
            }
        }
        val conn = open("/chat", "POST", readTimeoutMs = 60_000).apply { setRequestProperty("accept", "text/event-stream") }
        send(conn, body)
        check(conn.responseCode in 200..299) { "chat ${conn.responseCode}: ${conn.errorStream?.bufferedReader()?.readText()}" }
        // The ingress cuts long streams (~29 s); a `job` event means the answer carries on and is polled below.
        runCatching {
            conn.inputStream.bufferedReader().use { reader ->
                var event = "message"
                val data = StringBuilder()
                reader.lineSequence().forEach { line ->
                    when {
                        line.startsWith("event:") -> event = line.substring(6).trim()
                        line.startsWith("data:") -> data.append(line.substring(5).trimStart())
                        line.isEmpty() && data.isNotEmpty() -> {
                            runCatching { take(event, JSONObject(data.toString())) }
                            data.clear()
                            event = "message"
                        }
                    }
                }
            }
        }
        conn.disconnect()
        conversation?.let { conversations[sessionId] = it }
        if (job && conversation != null) {
            val deadline = System.currentTimeMillis() + 120_000
            while (System.currentTimeMillis() < deadline) {
                delay(1500)
                val t = JSONObject(get("/chat/threads/${enc(conversation!!)}"))
                val turns = t.optJSONArray("turns") ?: JSONArray()
                val list = (0 until turns.length()).map { turns.getJSONObject(it) }.filter { it.optString("role") == "assistant" }
                val turn = list.firstOrNull { it.optInt("seq") == seq } ?: list.lastOrNull() ?: continue
                if (turn.optString("status") == "running") continue
                answer.clear().append(turn.optString("content"))
                val events = turn.optJSONArray("events") ?: JSONArray()
                for (i in 0 until events.length()) {
                    val e = events.getJSONObject(i)
                    val d = e.optJSONObject("data") ?: continue
                    if (e.optString("name") != "token") take(e.optString("name"), d)
                }
                break
            }
        }
        // Pages cited in the device's own manual become "show me" targets.
        val manualSources = (0 until sources.length()).map { sources.getJSONObject(it) }
            .filter { entry?.manualDoc != null && it.optString("document_id") == entry.manualDoc }
            .mapNotNull { s ->
                val page = s.optJSONArray("pages")?.optInt(0) ?: return@mapNotNull null
                if (page <= 0) return@mapNotNull null
                Source(SourceKind.Manual, "p.$page · ${s.optString("title").take(40)}", ManualTarget(page, 0, entry!!.manual.title))
            }
        val charted = charts.values.mapNotNull { it.optJSONObject("spec")?.optString("dataset") }.toSet()
        BrainAnswer(
            text = answer.toString().replace(Regex("\\s*\\[\\d+]"), "").trim().ifEmpty { "The Tundra brain had no answer for that." },
            sources = manualSources,
            charts = charts.values.mapNotNull(::parseChart),
            tables = tables.values.filter { it.optString("dataset") !in charted }.map(::parseTable),
            followUps = (0 until followUps.length()).map { followUps.getString(it) },
        )
    }

    /** Headset answers are read while working, so ask for short ones (they also come back faster). */
    private fun briefing(question: String): String {
        val q = question.lowercase()
        if (Regex("\\b(in detail|detailed|explain fully|full report|step by step|ausführlich|im detail)\\b").containsMatchIn(q)) return ""
        val visual = Regex("\\b(chart|graph|plot|diagram|diagramm|table|tabelle|visuali[sz]e)").containsMatchIn(q)
        return if (visual) "\n\n(Answer for a headset display: show the chart or table, plus at most two short sentences. No headings.)"
        else "\n\n(Answer for a headset display: short, at most 3 sentences or 3 bullet points, no headings, no tables or charts unless asked.)"
    }

    // ── Captures ────────────────────────────────────────────────────────────

    override suspend fun ingest(sessionId: String, device: Device, item: CaptureItem): Pair<String?, RemoteStatus> {
        val entry = entries[device.id] ?: error("Not a device from Tundra")
        val ref = JSONObject().put("dataset", entry.ref.dataset).put("key", entry.ref.key)
        val stamp = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.ROOT).format(java.util.Date())
        val docId = when (item.kind) {
            CaptureKind.Photo -> {
                val file = item.file?.let(::File)?.takeIf { it.exists() } ?: error("No photo file")
                val known = searched[file.path]
                if (known != null) {
                    // Already in Tundra from the image search: attach that copy to the device.
                    post("/documents/${enc(known)}/device", JSONObject().put("device", ref))
                    known
                } else {
                    val small = withContext(Dispatchers.IO) { shrinkPhoto(file) } ?: file
                    JSONObject(post("/library/images", JSONObject()
                        .put("image", Base64.encodeToString(small.readBytes(), Base64.NO_WRAP))
                        .put("media_type", "image/jpeg")
                        .put("filename", "TundraXR $stamp ${device.assetTag}.jpg")
                        .put("device", ref), readTimeoutMs = 60_000)).optString("document_id")
                }
            }
            CaptureKind.Note -> JSONObject(post("/library/files", JSONObject()
                .put("filename", "TundraXR Notiz $stamp").put("text", item.transcript).put("kind", "protocol").put("device", ref))).optString("document_id")
            // The cloud takes images and text, not video: log the recording as a protocol entry.
            CaptureKind.Video -> JSONObject(post("/library/files", JSONObject()
                .put("filename", "TundraXR Video $stamp")
                .put("text", "Video documentation recorded with TundraXR (${item.durationSec / 60}:${"%02d".format(item.durationSec % 60)}) for ${device.name} (${device.assetTag}). Stored on the headset.")
                .put("kind", "protocol").put("device", ref))).optString("document_id")
        }
        Log.i(TAG, "${item.kind} → $docId")
        return docId to RemoteStatus(SyncState.InBrain, "In Tundra")
    }

    /** Captures are final once Tundra has them; this doubles as the "is the cloud reachable" check. */
    override suspend fun statuses(sessionId: String): Map<String, RemoteStatus>? {
        if (System.currentTimeMillis() - lastPing > 30_000) {
            lastPing = System.currentTimeMillis()
            online = runCatching { get("/") }.onFailure { Log.w(TAG, "cloud unreachable: ${it.message}") }.isSuccess
            Log.i(TAG, "cloud reachable: $online")
        }
        return if (online == false) null else emptyMap()
    }

    // ── HTTP ────────────────────────────────────────────────────────────────

    private fun open(path: String, method: String, readTimeoutMs: Int = 35_000) = (URL(base + path).openConnection() as HttpURLConnection).apply {
        requestMethod = method
        connectTimeout = 8_000
        readTimeout = readTimeoutMs
        setRequestProperty("authorization", "Bearer $apiKey")
        setRequestProperty("user-agent", "TundraXR/1.0")
    }

    private fun send(conn: HttpURLConnection, body: JSONObject) {
        val bytes = body.toString().toByteArray()
        conn.doOutput = true
        conn.setRequestProperty("content-type", "application/json")
        conn.setFixedLengthStreamingMode(bytes.size)
        conn.outputStream.use { it.write(bytes) }
    }

    private suspend fun get(path: String): String = withContext(Dispatchers.IO) { open(path, "GET").read() }

    private suspend fun post(path: String, body: JSONObject, readTimeoutMs: Int = 35_000): String = withContext(Dispatchers.IO) {
        open(path, "POST", readTimeoutMs).also { send(it, body) }.read()
    }

    private fun HttpURLConnection.read(): String {
        try {
            val code = responseCode
            val text = (if (code in 200..299) inputStream else errorStream)?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (code !in 200..299) {
                val err = runCatching { JSONObject(text).optString("error") }.getOrNull().orEmpty()
                error("Tundra $code $err: ${text.take(200)}")
            }
            return text
        } finally {
            disconnect()
        }
    }

    private fun enc(s: String) = URLEncoder.encode(s, "UTF-8").replace("+", "%20")

    /** Masked values (<PSN-…>) aren't worth showing. */
    private fun clean(s: String) = s.trim().takeUnless { it.contains("<PSN-") || it == "null" }.orEmpty()

    private fun date(v: String): String = runCatching {
        if (v.isEmpty() || v == "null") return@runCatching ""
        val d = java.time.LocalDate.parse(v.take(10))
        d.format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy", java.util.Locale.ENGLISH))
    }.getOrDefault(v)

    /** The cloud's error codes, as something an engineer can act on. */
    private fun reason(msg: String) = when {
        "feature_not_allowed" in msg -> "this key isn't allowed to use that feature (gateway → Admin → API & MCP)."
        "cloud_text_off" in msg -> "text over the cloud is off on the gateway."
        "images_off" in msg -> "device photos are off on the gateway."
        "invalid_key" in msg -> "the API key isn't valid."
        "budget_exhausted" in msg -> "the hospital's AI budget is used up."
        "Unable to resolve host" in msg || "timeout" in msg.lowercase() -> "the headset can't reach the internet."
        else -> msg.take(160)
    }
}
