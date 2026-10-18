package com.tundra.tundraxr.ui.region

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.ClipOp
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.RegionState
import com.tundra.tundraxr.data.ImageMatch
import com.tundra.tundraxr.ui.components.decodeThumb
import com.tundra.tundraxr.ui.theme.MonoSmallStyle
import com.tundra.tundraxr.ui.theme.Motion
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.max
import kotlin.math.min

// Same dark island palette, so region capture reads as part of the assistant.
private val Surface = Color(0xF22A2925)
private val Edge = Color(0x33FAF7EC)
private val TextC = Color(0xFFFAF7EC)
private val Muted = Color(0xFFB4B0A4)
private val Faint = Color(0xFF8C887D)
private val Agent = Color(0xFFA9B9E0)
private val Ok = Color(0xFF9CCBA6)
private val Divider = Color(0x1FFAF7EC)

/**
 * Region capture: the frozen view, with a box the engineer draws by pinching and dragging. The
 * box stays drawn (the rest of the frame dims), a scan line runs inside it while the image search
 * works, and the matches appear beside it. Drawing again searches the new region.
 */
@Composable
fun RegionPanel(region: RegionState, onSelect: (List<Float>) -> Unit, onClose: () -> Unit, modifier: Modifier = Modifier) {
    val bitmap by produceState<ImageBitmap?>(null, region.file) {
        val f = region.file
        if (f != null) value = withContext(Dispatchers.IO) { decodeThumb(f, targetPx = 1600) }
    }
    Column(modifier.fillMaxSize().clip(RoundedCornerShape(28.dp)).background(Surface).border(1.dp, Edge, RoundedCornerShape(28.dp)).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(R.drawable.ic_scan), null, Modifier.size(22.dp), tint = Agent)
            Column(Modifier.padding(start = 12.dp).weight(1f)) {
                Text("Region search", style = MaterialTheme.typography.titleMedium, color = TextC)
                Text(
                    when {
                        region.box == null -> "Pinch and drag around the device"
                        region.searching -> "Searching for this device…"
                        else -> "Drag again to search another region"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = Muted,
                )
            }
            Box(
                Modifier.size(44.dp).clip(CircleShape).clickable(onClick = onClose),
                contentAlignment = Alignment.Center,
            ) { Icon(painterResource(R.drawable.ic_close), "Close", Modifier.size(22.dp), tint = Muted) }
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth().weight(1f)) {
            Box(Modifier.weight(1f).fillMaxHeight(), contentAlignment = Alignment.Center) {
                val bmp = bitmap
                if (bmp == null) {
                    Text("Capturing…", style = MaterialTheme.typography.bodyMedium, color = Muted)
                } else {
                    Selectable(bmp, region, onSelect)
                }
            }
            if (region.box != null) {
                Results(region, Modifier.padding(start = 20.dp).width(300.dp).fillMaxHeight())
            }
        }
    }
}

/** The photo at its own aspect ratio, so touch positions map straight to image fractions. */
@Composable
private fun Selectable(bitmap: ImageBitmap, region: RegionState, onSelect: (List<Float>) -> Unit) {
    val select by rememberUpdatedState(onSelect)
    var dragStart by remember { mutableStateOf<Offset?>(null) }
    var dragEnd by remember { mutableStateOf<Offset?>(null) }
    val t = rememberInfiniteTransition(label = "scan")
    val sweep by t.animateFloat(0f, 1f, infiniteRepeatable(tween(1100, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "sweep")
    val ratio = bitmap.width.toFloat() / bitmap.height
    BoxWithConstraints(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        val fitWidth = min(maxWidth.value, maxHeight.value * ratio)
        Box(
            Modifier.width(fitWidth.dp).aspectRatio(ratio).clip(RoundedCornerShape(16.dp))
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { dragStart = it; dragEnd = it },
                        onDrag = { change, _ -> dragEnd = change.position },
                        onDragEnd = {
                            val a = dragStart
                            val b = dragEnd
                            dragStart = null
                            dragEnd = null
                            if (a != null && b != null) {
                                val w = size.width.toFloat()
                                val h = size.height.toFloat()
                                val box = listOf(
                                    (min(a.x, b.x) / w).coerceIn(0f, 1f), (min(a.y, b.y) / h).coerceIn(0f, 1f),
                                    (max(a.x, b.x) / w).coerceIn(0f, 1f), (max(a.y, b.y) / h).coerceIn(0f, 1f),
                                )
                                // Ignore stray taps: the box has to be a real area.
                                if (box[2] - box[0] > 0.04f && box[3] - box[1] > 0.04f) select(box)
                            }
                        },
                        onDragCancel = { dragStart = null; dragEnd = null },
                    )
                },
        ) {
            Image(bitmap, "Your view", Modifier.fillMaxSize(), contentScale = ContentScale.FillBounds)
            Canvas(Modifier.fillMaxSize()) {
                val live = dragStart?.let { a -> dragEnd?.let { b -> Rect(Offset(min(a.x, b.x), min(a.y, b.y)), Offset(max(a.x, b.x), max(a.y, b.y))) } }
                val rect = live ?: region.box?.let { Rect(it[0] * size.width, it[1] * size.height, it[2] * size.width, it[3] * size.height) }
                if (rect == null) return@Canvas
                // Dim everything outside the selection.
                val hole = Path().apply { addRoundRect(androidx.compose.ui.geometry.RoundRect(rect, CornerRadius(12.dp.toPx()))) }
                clipPath(hole, ClipOp.Difference) { drawRect(Color(0x99000000)) }
                drawRoundRect(Agent, rect.topLeft, rect.size, CornerRadius(12.dp.toPx()), style = Stroke(2.5.dp.toPx()))
                // Corner marks, like a viewfinder.
                val c = 22.dp.toPx()
                val w = 5.dp.toPx()
                listOf(
                    rect.topLeft to Offset(1f, 1f), Offset(rect.right, rect.top) to Offset(-1f, 1f),
                    Offset(rect.left, rect.bottom) to Offset(1f, -1f), rect.bottomRight to Offset(-1f, -1f),
                ).forEach { (p, d) ->
                    drawLine(TextC, p, p + Offset(c * d.x, 0f), w, StrokeCap.Round)
                    drawLine(TextC, p, p + Offset(0f, c * d.y), w, StrokeCap.Round)
                }
                if (live == null && region.searching) {
                    val y = rect.top + rect.height * sweep
                    drawLine(Agent, Offset(rect.left + 6.dp.toPx(), y), Offset(rect.right - 6.dp.toPx(), y), 2.dp.toPx())
                }
            }
        }
    }
}

@Composable
private fun Results(region: RegionState, modifier: Modifier) {
    Column(modifier) {
        Text("SELECTED REGION", style = MaterialTheme.typography.labelSmall, color = Faint)
        Spacer(Modifier.height(8.dp))
        val crop by produceState<ImageBitmap?>(null, region.crop) {
            val f = region.crop
            value = if (f != null) withContext(Dispatchers.IO) { decodeThumb(f, targetPx = 600) } else null
        }
        Box(Modifier.fillMaxWidth().height(170.dp).clip(RoundedCornerShape(14.dp)).background(Color(0xFF3A3833)), contentAlignment = Alignment.Center) {
            crop?.let { Image(it, "Selected region", Modifier.fillMaxSize(), contentScale = ContentScale.Fit) }
        }
        Spacer(Modifier.height(18.dp))
        Text(if (region.searching) "SEARCHING" else "MATCHES", style = MaterialTheme.typography.labelSmall, color = if (region.searching) Agent else Faint)
        Spacer(Modifier.height(8.dp))
        if (region.searching) {
            repeat(3) { Placeholder() }
        } else {
            region.matches.forEachIndexed { i, m -> MatchRow(m, top = i == 0) }
        }
    }
}

@Composable
private fun MatchRow(m: ImageMatch, top: Boolean) {
    Column(Modifier.padding(vertical = 6.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                m.label,
                style = if (top) MaterialTheme.typography.titleMedium else MaterialTheme.typography.bodyMedium,
                color = if (top) TextC else Muted,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f),
            )
            Text("${(m.confidence * 100).toInt()}%", style = MonoSmallStyle, color = if (top) Ok else Faint)
        }
        m.device?.let {
            Text("${it.category} · ${it.assetTag}", style = MaterialTheme.typography.bodySmall, color = Faint, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        Box(Modifier.padding(top = 6.dp).fillMaxWidth().height(3.dp).clip(CircleShape).background(Divider)) {
            Box(Modifier.fillMaxWidth(m.confidence).height(3.dp).background(if (top) Ok else Faint))
        }
    }
}

@Composable
private fun Placeholder() {
    val t = rememberInfiniteTransition(label = "ph")
    val a by t.animateFloat(0.25f, 0.6f, infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "a")
    Box(Modifier.padding(vertical = 8.dp).fillMaxWidth().height(34.dp).clip(RoundedCornerShape(8.dp)).background(Divider.copy(alpha = a)))
}
