package com.tundra.tundraxr.assistant

import com.tundra.tundraxr.data.Device

/** What a spoken sentence asks for. Parsed locally so the bar reacts instantly. */
sealed interface Command {
    /** "take a photo", "what device is this". [hint] is a device named in the same sentence. */
    data class Photo(val hint: Device?) : Command
    /** "select a region": freeze a photo and draw a box around the device to search for it. */
    data object RegionCapture : Command
    data object StartRecording : Command
    /** "stop", "done", "save it". */
    data object Stop : Command
    /** "open the manual" ([query] null) or "open the manual at battery replacement". */
    data class OpenManual(val query: String?) : Command
    data object CloseManual : Command
    /** "show me" after an answer: open the page it cited. */
    data object ShowCited : Command
    data class SelectDevice(val device: Device) : Command
    data object Cancel : Command
    /** "which medical device am I looking at": identify it with Tundra's image search. */
    data object Identify : Command
    /** "this is the Evita V500" when it isn't in the loaded inventory: look it up in the records. */
    data class FindDevice(val query: String) : Command
    /** "tell me about this device", "what's going on", "status". */
    data object AboutDevice : Command
    data class Question(val text: String) : Command
    /** Talk that isn't for the assistant (or narration while recording). */
    data class Chatter(val text: String) : Command
}

private val PHOTO = Regex("""\b(take|snap|grab|capture)\b.*\b(photo|picture|pic|image|shot)\b|\b(photo|picture) (of|this)\b|\bdocument (this|it|the) ?(device|machine)?\b""")
private val IDENTIFY = Regex("""\b(which|what) (medical )?(device|machine|equipment|system|unit)\b.*\b(looking at|in front of me|is (this|that|it)|am i|this is)\b|\bwhat am i looking at\b|\bwhat is (this|that)( (device|machine|thing))?$|\bwhat'?s (this|that)( (device|machine|thing))?$|\bidentify (this|it|that|the (device|machine))\b|\bscan (this|the) (device|machine|label)\b|\brecogni[sz]e (this|it|the device)\b""")
private val FIND_PREFIX = Regex("""^(this is|it'?s|switch to|change to|select|use|find|look up|search for|i'?m working on|working on) (the |a |an |our )?""")
private val REGION = Regex("""\b(select|pick|mark|crop|choose|draw)\b.*\b(region|area|box)\b|\bregion (capture|search|scan|select)\b|\b(search|scan) (a |an |this |the )?(region|area)\b|\bimage search\b""")
private val RECORD = Regex("""\b(start|begin)\b.*\b(record|recording|video|documenting|documentation)\b|\brecord (a )?video\b|\bdocument this\b|\bstart documenting\b""")
private val STOP = Regex("""^(ok(ay)? )?(stop|done|finish|finished|end|save)( (it|that|recording|the recording|the video|video|documentation|now))?( please)?$|\b(stop|end|finish) (the )?(recording|video)\b|\bsave (the )?(documentation|recording|video)\b|\bthat'?s (it|all)\b|\bi'?m done\b""")
private val CLOSE_MANUAL = Regex("""\b(close|hide|dismiss)\b.*\b(manual|pdf|document)\b|^(close|hide) (it|that)$""")
private val MANUAL = Regex("""\b(open|show|bring up|pull up|get|find|display)\b.*\b(manual|pdf|documentation for)\b|\b(manual|pdf)\b.*\b(for|on|at|about|to)\b|\bin the manual\b""")
private val SHOW_CITED = Regex("""^(show me|open it|show it|open (the|that) page|go there|take me there|show me (the|that) page)( please)?$""")
private val CANCEL = Regex("""^(cancel|never ?mind|forget it|no thanks?)$""")
private val SELECT = Regex("""\b(this is|it'?s|switch to|change to|use|select|working on)\b""")
private val FILLER = Regex("""^((so|ok|okay|um|uh|hmm|and|well|right|alright|hey|please|yeah|now)\s+)+""")
// Only about the device in front of the engineer; "tell me about the database" is a question.
private val ABOUT = Regex("""\btell me about (this|that|the|our) (device|machine|unit|one|equipment)\b|\btell me about (it|this|that)$|\babout this (device|machine|unit|one)\b|\bwhat'?s going on with (this|it|the (device|machine))\b|\bwhat is going on with (this|it|the (device|machine))\b|^(device )?(status|overview|summary)$|\b(status|overview|summary|details|info) (of|on|about|for) (this|the|that) (device|machine|unit)\b""")
private val QUESTION_HOW = Regex("""^(how|where|when|why|which)\b""")
private val QUESTION_START = Regex("""^(how|what|where|when|why|which|who|is|are|can|could|does|do|did|should|would|will|tell|explain|show|find|list|give|walk|help|what's|where's|how's)\b""")

private val MANUAL_QUERY_PREFIX = Regex("""^.*?\b(manual|pdf)\b\s*(for|on|at|about|to|of|and)?\s*(the\s+)?(page\s+)?(on|about|for|at|with|showing)?\s*""")
private val HOW_TO = Regex("""^(show me|find|where is|where's|look up)\s+(how to|how do i|the section (on|about)|the part (on|about))?\s*""")

/**
 * Turns one utterance into a [Command]. While [recording], anything that isn't a command is the
 * engineer narrating the work, so it's kept as [Command.Chatter] for the documentation.
 */
fun parseCommand(raw: String, devices: List<Device>, recording: Boolean): Command {
    val text = raw.lowercase().replace(Regex("""[^\w\s']"""), " ").replace(Regex("""\s+"""), " ").trim()
        .removePrefix("hey tundra ").removePrefix("tundra ").removePrefix("ok tundra ")
        .replace(FILLER, "")
    if (text.isEmpty()) return Command.Chatter(raw)
    val named = deviceNamed(text, devices)

    if (STOP.containsMatchIn(text) && (recording || text.length < 24)) return Command.Stop
    if (CANCEL.matches(text)) return Command.Cancel
    if (REGION.containsMatchIn(text)) return Command.RegionCapture
    if (!recording && IDENTIFY.containsMatchIn(text)) return Command.Identify
    if (PHOTO.containsMatchIn(text)) return Command.Photo(named)
    if (CLOSE_MANUAL.containsMatchIn(text)) return Command.CloseManual
    if (SHOW_CITED.matches(text)) return Command.ShowCited
    if (MANUAL.containsMatchIn(text)) {
        val query = text.replace(MANUAL_QUERY_PREFIX, "").let { q ->
            // "open the manual" / "show me the PB980 manual" → no topic, just open it.
            val stripped = devices.fold(q) { acc, d -> acc.replace(d.name.lowercase(), "") }.trim()
            stripped.takeIf { it.split(" ").count { w -> w.length > 2 } >= 1 }
        }
        return Command.OpenManual(query)
    }
    if (!recording && RECORD.containsMatchIn(text)) return Command.StartRecording
    if (recording) return Command.Chatter(raw.trim())
    if (named != null && SELECT.containsMatchIn(text) && text.split(" ").size <= 8) return Command.SelectDevice(named)
    if (FIND_PREFIX.containsMatchIn(text) && text.split(" ").size <= 8) {
        val q = text.replace(FIND_PREFIX, "").trim()
        if (q.length >= 2) return Command.FindDevice(q)
    }
    if (HOW_TO.containsMatchIn(text) && text.startsWith("show me how")) return Command.OpenManual(text.replace(HOW_TO, ""))
    if (ABOUT.containsMatchIn(text) && !QUESTION_HOW.containsMatchIn(text)) return Command.AboutDevice
    // Demo: everything else is a question for the brain, so nothing said is ever dropped.
    return Command.Question(raw.trim())
}

/** A device from the inventory mentioned by model ("980", "FT10"), name or category. */
fun deviceNamed(text: String, devices: List<Device>): Device? {
    val t = " ${text.lowercase().replace(" ", "")} "
    return devices.firstOrNull { d ->
        val model = d.name.lowercase().split(" ").last() // "980", "pm100n", "ft10"
        val words = d.name.lowercase().split(" ")
        t.contains(model) || words.dropLast(1).any { it.length > 4 && t.contains(it) } ||
            text.lowercase().contains(d.category.lowercase().split(" ").first())
    }
}
