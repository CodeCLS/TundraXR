package com.tundra.tundraxr.ui.bar

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.SizeTransform
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.BarCard
import com.tundra.tundraxr.PhotoPhase
import com.tundra.tundraxr.R
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.TaskKind
import com.tundra.tundraxr.formatClock
import com.tundra.tundraxr.ui.capture.PhotoFlash
import com.tundra.tundraxr.ui.components.decodeThumb
import com.tundra.tundraxr.ui.theme.MonoSmallStyle
import com.tundra.tundraxr.ui.theme.MonoStyle
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.XrTokens
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.math.abs
import kotlin.math.sin

/**
 * The island's own palette: a dark stone surface (the design system's darkest ink, never pure
 * black) with cream text, so it reads over any passthrough like a status island. Accents are the
 * system's cobalt, moss and rust, lifted for a dark ground.
 */
private object Island {
    val surface = Color(0xF22A2925)
    val edge = Color(0x33FAF7EC)
    val text = Color(0xFFFAF7EC)
    val muted = Color(0xFFB4B0A4)
    val faint = Color(0xFF8C887D)
    val divider = Color(0x1FFAF7EC)
    val agent = Color(0xFFA9B9E0)
    val record = Color(0xFFE4876A)
    val ok = Color(0xFF9CCBA6)
    val okBg = Color(0x2E9CCBA6)
    val warn = Color(0xFFE2BC76)
    val chip = Color(0x26A9B9E0)
}

/** The widest the island gets; the panel around it is sized from this. */
val IslandMaxWidth = 540.dp
private val RestWidth = 260.dp
private val ActiveWidth = 460.dp
private val LineHeight = 48.dp
/** How long a pinch on the island has to last before it counts as hold-to-talk rather than a tap. */
private const val HoldDelayMs = 220L

/**
 * The hands-free assistant, at the top of the view like a status island. At rest it's a small
 * pill; when the engineer talks it widens to show their words with a live voice wave; when there's
 * something to show it grows into a larger rounded panel with the information, then shrinks back.
 * Talking is pinch-and-hold (anywhere, via hand tracking, or on the island); a quick pinch on it
 * opens the full controls.
 */
@Composable
fun VoiceBar(
    state: SessionState,
    onTap: () -> Unit,
    onCitation: () -> Unit,
    modifier: Modifier = Modifier,
    onHoldStart: () -> Unit = {},
    onHoldEnd: () -> Unit = {},
) {
    val mode = barMode(state)
    val card = state.card
    val expanded = card != null
    val width by animateDpAsState(
        when {
            expanded -> IslandMaxWidth
            mode == BarMode.Rest -> RestWidth
            else -> ActiveWidth
        },
        tween(XrTokens.MorphDuration, easing = Motion.EaseOut),
        label = "width",
    )
    val radius by animateDpAsState(if (expanded) 34.dp else LineHeight / 2, tween(XrTokens.MorphDuration, easing = Motion.EaseOut), label = "radius")
    val shape = RoundedCornerShape(radius)
    val holdStart by rememberUpdatedState(onHoldStart)
    val holdEnd by rememberUpdatedState(onHoldEnd)
    val tap by rememberUpdatedState(onTap)
    val scope = rememberCoroutineScope()
    Box(modifier.width(IslandMaxWidth), contentAlignment = Alignment.TopCenter) {
        Box(
            Modifier
                .width(width)
                .clip(shape)
                .background(Island.surface)
                .border(1.dp, if (mode == BarMode.Recording) Island.record.copy(alpha = 0.45f) else Island.edge, shape)
                .pointerInput(Unit) {
                    awaitEachGesture {
                        awaitFirstDown(requireUnconsumed = false)
                        var holding = false
                        val hold = scope.launch {
                            delay(HoldDelayMs)
                            holding = true
                            holdStart()
                        }
                        waitForUpOrCancellation()
                        hold.cancel()
                        if (holding) holdEnd() else tap()
                    }
                },
        ) {
            Column {
                AnimatedContent(
                    mode,
                    transitionSpec = {
                        fadeIn(tween(Motion.Base, delayMillis = 80, easing = Motion.EaseStandard)) togetherWith fadeOut(tween(Motion.Fast)) using
                            SizeTransform(clip = false)
                    },
                    label = "line",
                ) { m ->
                    Row(
                        Modifier.fillMaxWidth().height(LineHeight).padding(start = 18.dp, end = 18.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        when (m) {
                            BarMode.Rest -> Rest(state)
                            BarMode.Hearing -> Hearing(state)
                            BarMode.Working -> Working(state)
                            BarMode.Recording -> Recording(state)
                        }
                    }
                }
                AnimatedVisibility(
                    expanded,
                    enter = fadeIn(tween(Motion.Base, delayMillis = 120, easing = Motion.EaseStandard)) +
                        expandVertically(tween(XrTokens.MorphDuration, easing = Motion.EaseOut), expandFrom = Alignment.Top),
                    exit = fadeOut(tween(Motion.Fast)) +
                        shrinkVertically(tween(XrTokens.MorphDuration, easing = Motion.EaseOut), shrinkTowards = Alignment.Top),
                ) {
                    Column(Modifier.padding(start = 22.dp, end = 22.dp, bottom = 22.dp)) {
                        Box(Modifier.fillMaxWidth().height(1.dp).background(Island.divider))
                        Spacer(Modifier.height(16.dp))
                        if (card != null) {
                            AnimatedContent(
                                card,
                                transitionSpec = { fadeIn(tween(Motion.Base)) togetherWith fadeOut(tween(Motion.Fast)) },
                                contentKey = { it::class },
                                label = "card",
                            ) { k -> Card(k, state, onCitation) }
                        }
                    }
                }
            }
            PhotoFlash(state.photoFlash, Modifier.matchParentSize())
        }
    }
}

private enum class BarMode { Rest, Hearing, Working, Recording }

private fun barMode(s: SessionState) = when {
    s.isRecording -> BarMode.Recording
    s.hearing -> BarMode.Hearing
    s.task != null -> BarMode.Working
    else -> BarMode.Rest
}

// ── The line at the top of the island ───────────────────────────────────────

@Composable
private fun RowScope.Rest(state: SessionState) {
    BreathingDot(if (state.brainOnline == false) Island.record else Island.agent)
    Text("Tundra", style = MaterialTheme.typography.labelLarge, color = Island.text, modifier = Modifier.padding(start = 12.dp))
    Text(
        state.device?.name?.split(" ")?.last() ?: "thumb + middle to talk",
        style = MaterialTheme.typography.bodyMedium,
        color = Island.muted,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
        modifier = Modifier.weight(1f).padding(start = 10.dp),
    )
    Icon(painterResource(R.drawable.ic_mic), null, Modifier.size(18.dp), tint = Island.faint)
}

@Composable
private fun RowScope.Hearing(state: SessionState) {
    VoiceWave(state.micLevel, Island.agent)
    LiveWords(
        state.heard.ifEmpty { "Listening…" },
        if (state.heard.isEmpty()) Island.muted else Island.text,
        Modifier.weight(1f).padding(start = 14.dp),
    )
}

@Composable
private fun RowScope.Working(state: SessionState) {
    val task = state.task ?: return
    Pulse {
        Icon(
            painterResource(
                when (task.kind) {
                    TaskKind.Camera -> R.drawable.ic_camera
                    TaskKind.Analyze -> R.drawable.ic_scan
                    TaskKind.Manual -> R.drawable.ic_manual
                    TaskKind.Think -> R.drawable.ic_sparkle
                    TaskKind.Save -> R.drawable.ic_check
                },
            ),
            null,
            Modifier.size(22.dp),
            tint = Island.agent,
        )
    }
    Text(
        task.label + "…",
        style = MaterialTheme.typography.bodyLarge,
        color = Island.text,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
        modifier = Modifier.weight(1f).padding(start = 14.dp),
    )
}

@Composable
private fun RowScope.Recording(state: SessionState) {
    BreathingDot(Island.record, fast = true)
    Text(formatClock(state.recordingSec), style = MonoStyle, color = Island.record, modifier = Modifier.padding(start = 10.dp))
    val words = when {
        state.hearing && state.heard.isNotEmpty() -> state.heard
        state.narration.isNotEmpty() -> state.narration.last().text
        else -> null
    }
    if (state.hearing) VoiceWave(state.micLevel, Island.record, Modifier.padding(start = 14.dp))
    LiveWords(
        words ?: "Thumb + middle finger to comment",
        if (words == null) Island.muted else Island.text,
        Modifier.weight(1f).padding(start = 12.dp),
    )
    if (!state.hearing) Text("say stop", style = MonoSmallStyle, color = Island.faint, modifier = Modifier.padding(start = 10.dp))
}

/** The tail of what's being said: new words push old ones out to the left. */
@Composable
private fun LiveWords(text: String, color: Color, modifier: Modifier) {
    Text(
        text.takeLast(80),
        style = MaterialTheme.typography.bodyLarge,
        color = color,
        maxLines = 1,
        overflow = TextOverflow.StartEllipsis,
        modifier = modifier,
    )
}

// ── What the island grows to show ───────────────────────────────────────────

@Composable
private fun Card(card: BarCard, state: SessionState, onCitation: () -> Unit) {
    when (card) {
        is BarCard.Photo -> PhotoCard(card)
        is BarCard.Answer -> AnswerCard(card, state, onCitation)
        is BarCard.ManualOpened -> ManualCard(card)
        is BarCard.Saved -> SavedCard(card)
        is BarCard.Notice -> Text(card.text, style = MaterialTheme.typography.bodyMedium, color = Island.muted)
        is BarCard.DeviceInfo -> DeviceCard(card)
        is BarCard.RegionMatch -> RegionCard(card)
    }
}

@Composable
private fun RegionCard(card: BarCard.RegionMatch) {
    val m = card.match
    Row(verticalAlignment = Alignment.CenterVertically) {
        Thumb(card.crop, 96.dp, 72.dp, scanning = false)
        Column(Modifier.padding(start = 16.dp).weight(1f)) {
            Label("Region match", Island.agent)
            Text(m.label, style = MaterialTheme.typography.titleMedium, color = Island.text, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 2.dp))
            m.device?.let {
                Text("${it.assetTag} · ${it.location}", style = MaterialTheme.typography.bodySmall, color = Island.muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
        }
        Text("${(m.confidence * 100).toInt()}%", style = MonoStyle, color = Island.ok)
    }
}

@Composable
private fun DeviceCard(card: BarCard.DeviceInfo) {
    val d = card.device
    Column {
        Label("${d.category} · ${d.manufacturer}", Island.agent)
        Text(d.name, style = MaterialTheme.typography.headlineSmall, color = Island.text, modifier = Modifier.padding(top = 4.dp))
        Row(Modifier.padding(top = 14.dp).fillMaxWidth()) {
            Column(Modifier.weight(1f)) {
                Fact("Asset", d.assetTag, mono = true)
                Fact("Location", d.location)
            }
            Column(Modifier.weight(1f)) {
                Fact("Last PM", d.lastPm)
                Fact("Open work orders", d.openWorkOrders.toString(), mono = true, alert = d.openWorkOrders > 0)
            }
        }
        if (card.manualTitle != null) {
            Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(painterResource(R.drawable.ic_manual), null, Modifier.size(18.dp), tint = Island.agent)
                Text(card.manualTitle, style = MaterialTheme.typography.bodySmall, color = Island.muted, modifier = Modifier.padding(start = 8.dp).weight(1f), maxLines = 1, overflow = TextOverflow.Ellipsis)
                Label("say open the manual")
            }
        }
        Label("say “take a photo” to document it", modifier = Modifier.padding(top = 10.dp))
    }
}

@Composable
private fun Fact(label: String, value: String, mono: Boolean = false, alert: Boolean = false) {
    Column(Modifier.padding(bottom = 10.dp)) {
        Label(label)
        Text(
            value,
            style = if (mono) MonoSmallStyle else MaterialTheme.typography.bodyMedium,
            color = if (alert) Island.warn else Island.text,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(top = 2.dp),
        )
    }
}

@Composable
private fun Label(text: String, color: Color = Island.faint, modifier: Modifier = Modifier) {
    Text(text.uppercase(), style = MaterialTheme.typography.labelSmall, color = color, maxLines = 1, modifier = modifier)
}

@Composable
private fun PhotoCard(card: BarCard.Photo) {
    // First the photo pops up with its crop, then flies into the cloud; then the compact result.
    if (card.phase == PhotoPhase.Captured || card.phase == PhotoPhase.Sending) return PhotoPop(card)
    Column {
        Row {
            Box {
                Thumb(card.file, 132.dp, 99.dp, scanning = false, box = card.box)
                if (card.phase == PhotoPhase.Searching) SearchingCloud(Modifier.align(Alignment.Center))
            }
            Column(Modifier.padding(start = 16.dp).weight(1f)) {
                Label(
                    when {
                        card.phase == PhotoPhase.Searching -> "Searching Tundra…"
                        card.device == null && card.lines.isEmpty() -> "Identifying"
                        else -> "Tundra image search"
                    },
                    Island.agent,
                )
                Spacer(Modifier.height(6.dp))
                card.lines.forEach { line ->
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 2.dp)) {
                        Box(Modifier.size(5.dp).background(Island.agent, CircleShape))
                        Text(line, style = MaterialTheme.typography.bodyMedium, color = Island.text, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(start = 10.dp))
                    }
                }
            }
        }
        val device = card.device
        AnimatedVisibility(device != null, enter = fadeIn(tween(Motion.Base)) + expandVertically(tween(Motion.Base))) {
            if (device != null) Column(Modifier.padding(top = 16.dp)) {
                Box(Modifier.fillMaxWidth().height(1.dp).background(Island.divider))
                Row(Modifier.padding(top = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(30.dp).clip(CircleShape).background(Island.okBg), contentAlignment = Alignment.Center) {
                        Icon(painterResource(R.drawable.ic_check), null, Modifier.size(16.dp), tint = Island.ok)
                    }
                    Column(Modifier.padding(start = 12.dp).weight(1f)) {
                        Text(device.name, style = MaterialTheme.typography.titleMedium, color = Island.text, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(device.assetTag, style = MonoSmallStyle, color = Island.muted)
                            Text(" · ${device.location}", style = MaterialTheme.typography.bodySmall, color = Island.muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                    }
                    Label("In inventory", Island.ok)
                }
                val n = card.countdown
                if (n != null) {
                    Row(Modifier.padding(top = 16.dp).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        BreathingDot(Island.record, fast = true)
                        Text("Video starts in $n", style = MaterialTheme.typography.bodyMedium, color = Island.text, modifier = Modifier.padding(start = 10.dp).weight(1f))
                        Label("say cancel")
                    }
                }
            }
        }
    }
}

@Composable
private fun AnswerCard(card: BarCard.Answer, state: SessionState, onCitation: () -> Unit) {
    val question = state.chat.lastOrNull { it.fromUser && it.id < card.messageId }?.text
    val reply = state.chat.firstOrNull { it.id == card.messageId }
    Column {
        if (question != null) {
            Text("“$question”", style = MaterialTheme.typography.bodySmall.copy(fontStyle = FontStyle.Italic), color = Island.muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.height(8.dp))
        }
        val text = reply?.text.orEmpty()
        if (text.isEmpty()) {
            Label("Searching the manual…", Island.agent)
        } else {
            // Markdown symbols read as noise in a preview.
            val plain = text.lines().filter { it.isNotBlank() && !it.trimStart().startsWith("|") }
                .joinToString(" ") { it.trimStart('#', ' ', '-', '*', '•').replace("**", "") }
            Text(plain, style = MaterialTheme.typography.bodyMedium, color = Island.text, maxLines = 5, overflow = TextOverflow.Ellipsis)
        }
        if (reply != null && !reply.streaming && (reply.charts.isNotEmpty() || reply.tables.isNotEmpty() || text.length > 420)) {
            val what = listOfNotNull(
                reply.charts.size.takeIf { it > 0 }?.let { if (it == 1) "chart" else "$it charts" },
                reply.tables.size.takeIf { it > 0 }?.let { if (it == 1) "table" else "$it tables" },
            ).joinToString(" and ").ifEmpty { "full answer" }
            Label("$what open on the left", Island.agent, Modifier.padding(top = 10.dp))
        }
        val target = reply?.sources?.firstNotNullOfOrNull { it.manualTarget }
        if (target != null && !reply.streaming) {
            Row(Modifier.padding(top = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "p. ${target.page} · ${target.reason}".take(46),
                    style = MonoSmallStyle,
                    color = Island.agent,
                    maxLines = 1,
                    modifier = Modifier.clip(RoundedCornerShape(6.dp)).background(Island.chip)
                        .pointerInput(Unit) { awaitEachGesture { awaitFirstDown(); if (waitForUpOrCancellation() != null) onCitation() } }
                        .padding(horizontal = 10.dp, vertical = 5.dp),
                )
                Label("say “show me”", modifier = Modifier.padding(start = 12.dp))
            }
        }
    }
}

@Composable
private fun ManualCard(card: BarCard.ManualOpened) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(painterResource(R.drawable.ic_manual), null, Modifier.size(22.dp), tint = Island.agent)
        Column(Modifier.padding(start = 14.dp).weight(1f)) {
            Text(card.title, style = MaterialTheme.typography.bodyMedium, color = Island.text, maxLines = 1, overflow = TextOverflow.Ellipsis)
            val t = card.target
            if (t != null) Text("p. ${t.page} · ${t.reason}", style = MaterialTheme.typography.bodySmall, color = Island.muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        Label("say close manual")
    }
}

@Composable
private fun SavedCard(card: BarCard.Saved) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier.size(38.dp).clip(CircleShape).background(if (card.sent) Island.okBg else Island.warn.copy(alpha = 0.18f)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(painterResource(if (card.sent) R.drawable.ic_check else R.drawable.ic_alert), null, Modifier.size(20.dp), tint = if (card.sent) Island.ok else Island.warn)
        }
        Column(Modifier.padding(start = 14.dp).weight(1f)) {
            Text(
                if (card.sent) "Documentation saved" else "Saved on headset · laptop offline",
                style = MaterialTheme.typography.titleMedium,
                color = Island.text,
            )
            Text(card.device.name + " · " + card.device.assetTag, style = MaterialTheme.typography.bodySmall, color = Island.muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Stat(formatClock(card.videoSec), "video")
                Stat(card.comments.toString(), if (card.comments == 1) "comment" else "comments")
                Stat(card.photos.toString(), if (card.photos == 1) "photo" else "photos")
            }
        }
    }
}

@Composable
private fun Stat(value: String, label: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(value, style = MonoSmallStyle, color = Island.text)
        Text(" $label", style = MaterialTheme.typography.bodySmall, color = Island.muted)
    }
}

@Composable
private fun Thumb(file: String?, w: Dp, h: Dp, scanning: Boolean, box: List<Float>? = null) {
    val bitmap by produceState<ImageBitmap?>(null, file) {
        if (file != null) value = withContext(Dispatchers.IO) { decodeThumb(file, targetPx = 480) }
    }
    val shape = RoundedCornerShape(14.dp)
    Box(Modifier.size(w, h).clip(shape).background(Color(0xFF3A3833)), contentAlignment = Alignment.Center) {
        val bmp = bitmap
        if (bmp != null) Image(bmp, "Photo", Modifier.matchParentSize(), contentScale = ContentScale.Crop)
        else Icon(painterResource(R.drawable.ic_camera), null, Modifier.size(24.dp), tint = Island.muted)
        // A scan line sweeps the photo while it's being analysed.
        if (scanning) ScanSweep(Modifier.matchParentSize())
        if (box != null && bmp != null) CropOverlay(box, Modifier.matchParentSize(), corners = 8.dp)
    }
}

/**
 * The identification photo, large for a moment so the engineer sees what was captured and what the
 * headset cropped it to; then it shrinks and flies up into the cloud: it's on its way to Tundra.
 */
@Composable
private fun PhotoPop(card: BarCard.Photo) {
    val bitmap by produceState<ImageBitmap?>(null, card.file) {
        val f = card.file
        if (f != null) value = withContext(Dispatchers.IO) { decodeThumb(f, targetPx = 1000) }
    }
    val sending = card.phase == PhotoPhase.Sending
    val fly by animateFloatAsState(if (sending) 1f else 0f, tween(850, easing = Motion.EaseIn), label = "fly")
    val pop by animateFloatAsState(if (bitmap != null) 1f else 0.92f, tween(Motion.Slow, easing = Motion.EaseOut), label = "pop")
    Box(Modifier.fillMaxWidth().height(330.dp)) {
        // The cloud waits at the top; the photo flies into it.
        Column(
            Modifier.align(Alignment.TopCenter).alpha((fly * 1.6f).coerceAtMost(1f)),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(painterResource(R.drawable.ic_cloud), null, Modifier.size(44.dp).graphicsLayer { scaleX = 1f + 0.12f * fly; scaleY = 1f + 0.12f * fly }, tint = Island.agent)
            Text("Sending to Tundra", style = MaterialTheme.typography.labelLarge, color = Island.agent, modifier = Modifier.padding(top = 2.dp))
        }
        Column(
            Modifier.align(Alignment.BottomCenter).graphicsLayer {
                val s = pop * (1f - 0.86f * fly)
                scaleX = s
                scaleY = s
                translationY = -size.height * 0.62f * fly
                alpha = 1f - fly * fly
            },
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            val bmp = bitmap
            val shape = RoundedCornerShape(16.dp)
            val ratio = bmp?.let { it.width.toFloat() / it.height } ?: (4f / 3f)
            Box(Modifier.height(250.dp).width((250 * ratio).coerceAtMost(496f).dp).clip(shape).background(Color(0xFF3A3833))) {
                if (bmp != null) {
                    Image(bmp, "Photo", Modifier.matchParentSize(), contentScale = ContentScale.Crop)
                    card.box?.let { CropOverlay(it, Modifier.matchParentSize(), corners = 18.dp) }
                }
            }
            Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(painterResource(R.drawable.ic_scan), null, Modifier.size(16.dp), tint = Island.muted)
                Text(
                    when {
                        card.cropMs == null -> "Cropping on headset…"
                        card.box != null -> "Cropped on headset · ${card.cropMs} ms"
                        else -> "Whole view · no device outline found (${card.cropMs} ms)"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = Island.muted,
                    modifier = Modifier.padding(start = 8.dp),
                )
            }
        }
    }
}

/** Dims everything outside the crop and marks its corners, like a viewfinder. */
@Composable
private fun CropOverlay(box: List<Float>, modifier: Modifier, corners: Dp) {
    val t = rememberInfiniteTransition(label = "crop")
    val glow by t.animateFloat(0.55f, 1f, infiniteRepeatable(tween(900, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "glow")
    Canvas(modifier) {
        val r = androidx.compose.ui.geometry.Rect(box[0] * size.width, box[1] * size.height, box[2] * size.width, box[3] * size.height)
        val hole = androidx.compose.ui.graphics.Path().apply { addRect(r) }
        clipPath(hole, androidx.compose.ui.graphics.ClipOp.Difference) { drawRect(Color(0x8C000000)) }
        drawRect(Island.agent.copy(alpha = glow), r.topLeft, r.size, style = androidx.compose.ui.graphics.drawscope.Stroke(2.dp.toPx()))
        val c = corners.toPx()
        val w = 3.5.dp.toPx()
        listOf(
            r.topLeft to Offset(1f, 1f), Offset(r.right, r.top) to Offset(-1f, 1f),
            Offset(r.left, r.bottom) to Offset(1f, -1f), r.bottomRight to Offset(-1f, -1f),
        ).forEach { (p, d) ->
            drawLine(Island.text, p, p + Offset(c * d.x, 0f), w, StrokeCap.Round)
            drawLine(Island.text, p, p + Offset(0f, c * d.y), w, StrokeCap.Round)
        }
    }
}

/** A pulsing cloud over the thumbnail while Tundra searches. */
@Composable
private fun SearchingCloud(modifier: Modifier) {
    val t = rememberInfiniteTransition(label = "cloud")
    val a by t.animateFloat(0.45f, 1f, infiniteRepeatable(tween(700, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "a")
    Box(modifier.size(52.dp).clip(CircleShape).background(Island.surface.copy(alpha = 0.85f)), contentAlignment = Alignment.Center) {
        Icon(painterResource(R.drawable.ic_cloud), null, Modifier.size(30.dp).alpha(a), tint = Island.agent)
    }
}

// ── Small pieces ────────────────────────────────────────────────────────────

@Composable
private fun BreathingDot(color: Color, fast: Boolean = false) {
    val t = rememberInfiniteTransition(label = "breathe")
    val a by t.animateFloat(1f, 0.3f, infiniteRepeatable(tween(if (fast) 700 else 1600, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "a")
    Box(Modifier.size(10.dp).alpha(a).background(color, CircleShape))
}

@Composable
private fun Pulse(content: @Composable () -> Unit) {
    val t = rememberInfiniteTransition(label = "pulse")
    val a by t.animateFloat(1f, 0.4f, infiniteRepeatable(tween(650, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "a")
    Box(Modifier.alpha(a)) { content() }
}

/**
 * The voice, drawn next to the words: rounded bars that follow the real mic level, each with its
 * own rhythm so it reads as speech, and a gentle idle motion so it's visibly listening in silence.
 */
@Composable
private fun VoiceWave(level: Float, color: Color, modifier: Modifier = Modifier, bars: Int = 7) {
    val l by animateFloatAsState(level, tween(80), label = "level")
    val t = rememberInfiniteTransition(label = "voice")
    val phase by t.animateFloat(0f, (2 * Math.PI).toFloat(), infiniteRepeatable(tween(900)), label = "phase")
    Canvas(modifier.width((bars * 7).dp).height(30.dp)) {
        val w = 3.5.dp.toPx()
        val gap = (size.width - bars * w) / (bars - 1)
        val mid = (bars - 1) / 2f
        for (i in 0 until bars) {
            val rhythm = (sin(phase * (1f + i * 0.17f) + i * 1.9f) + 1f) / 2f // 0..1, each bar its own pace
            val envelope = 1f - abs(i - mid) / (mid + 1f) * 0.55f            // taller in the middle
            val idle = 0.14f + 0.12f * rhythm
            val voiced = l * envelope * (0.45f + 0.55f * rhythm)
            val h = size.height * (idle + voiced).coerceIn(0.12f, 1f)
            val x = i * (w + gap) + w / 2
            drawLine(color.copy(alpha = 0.55f + 0.45f * envelope), Offset(x, (size.height - h) / 2), Offset(x, (size.height + h) / 2), w, StrokeCap.Round)
        }
    }
}

@Composable
private fun ScanSweep(modifier: Modifier) {
    val t = rememberInfiniteTransition(label = "scan")
    val y by t.animateFloat(0f, 1f, infiniteRepeatable(tween(1400, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "y")
    Canvas(modifier) {
        val yy = size.height * y
        drawLine(Island.agent, Offset(0f, yy), Offset(size.width, yy), 2.dp.toPx())
    }
}
