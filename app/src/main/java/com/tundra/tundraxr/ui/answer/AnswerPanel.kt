package com.tundra.tundraxr.ui.answer

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.data.Chart
import com.tundra.tundraxr.data.ChartType
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.DataTable
import com.tundra.tundraxr.ui.theme.GeistMono
import com.tundra.tundraxr.ui.theme.MonoSmallStyle
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sin

// The island's dark palette, so the full answer reads as part of the assistant.
private val Surface = Color(0xF22A2925)
private val Card = Color(0xFF34332E)
private val Edge = Color(0x33FAF7EC)
private val Ink = Color(0xFFFAF7EC)
private val Muted = Color(0xFFB4B0A4)
private val Faint = Color(0xFF8C887D)
private val Grid = Color(0x1FFAF7EC)
private val Agent = Color(0xFFA9B9E0)
private val Warn = Color(0xFFE2BC76)

/** Series colours: the design system's cobalt, moss, amber, rust, teal and stone, lifted for dark. */
private val SeriesColors = listOf(
    Color(0xFF8FA4D6), Color(0xFF8FC29C), Color(0xFFE2BC76), Color(0xFFE4876A), Color(0xFF7FB8BF), Color(0xFFC7C1AE),
)

/**
 * The whole answer, as the Tundra website shows it: the formatted text, its charts and tables,
 * where it came from, and what to ask next. Opens beside the island for answers too big for it.
 */
@Composable
fun AnswerPanel(
    question: String?,
    reply: ChatMessage,
    onAsk: (String) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier.fillMaxSize().clip(RoundedCornerShape(28.dp)).background(Surface).border(1.dp, Edge, RoundedCornerShape(28.dp))) {
        Row(Modifier.padding(start = 24.dp, end = 12.dp, top = 16.dp, bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(R.drawable.ic_sparkle), null, Modifier.size(22.dp), tint = Agent)
            Text(
                question ?: "Answer",
                style = MaterialTheme.typography.titleMedium,
                color = Ink,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f).padding(start = 12.dp),
            )
            Box(Modifier.size(48.dp).clip(CircleShape).clickable(onClick = onClose), contentAlignment = Alignment.Center) {
                Icon(painterResource(R.drawable.ic_close), "Close", Modifier.size(22.dp), tint = Muted)
            }
        }
        Box(Modifier.fillMaxWidth().height(1.dp).background(Grid))
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(24.dp)) {
            // Like the website: charts first (the text refers to "the chart above"), then the text.
            reply.charts.forEach { ChartCard(it); Spacer(Modifier.height(18.dp)) }
            if (reply.text.isEmpty() && reply.streaming) {
                Text("Thinking…", style = MaterialTheme.typography.bodyLarge, color = Agent)
            } else {
                Markdown(reply.text)
            }
            reply.tables.forEach { Spacer(Modifier.height(18.dp)); TableCard(it) }
            val sources = reply.sources.filter { it.label.isNotBlank() }
            if (sources.isNotEmpty()) {
                Spacer(Modifier.height(20.dp))
                Label("Sources")
                sources.forEach { Text("· ${it.label}", style = MaterialTheme.typography.bodySmall, color = Muted, modifier = Modifier.padding(top = 4.dp)) }
            }
            if (reply.followUps.isNotEmpty()) {
                Spacer(Modifier.height(20.dp))
                Label("Ask next")
                FollowUps(reply.followUps, onAsk)
            }
        }
    }
}

@Composable
private fun Label(text: String, color: Color = Faint) {
    Text(text.uppercase(), style = MaterialTheme.typography.labelSmall, color = color)
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FollowUps(questions: List<String>, onAsk: (String) -> Unit) {
    FlowRow(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        questions.forEach { q ->
            Text(
                q,
                style = MaterialTheme.typography.bodyMedium,
                color = Agent,
                modifier = Modifier.clip(RoundedCornerShape(14.dp)).background(Color(0x26A9B9E0)).clickable { onAsk(q) }
                    .padding(horizontal = 14.dp, vertical = 10.dp),
            )
        }
    }
}

// ── Markdown ────────────────────────────────────────────────────────────────

/** The subset of Markdown the Tundra brain writes: headings, lists, bold/italic/code, tables. */
@Composable
fun Markdown(text: String) {
    val lines = text.lines()
    var i = 0
    Column {
        while (i < lines.size) {
            val raw = lines[i]
            val line = raw.trimEnd()
            when {
                line.isBlank() -> Spacer(Modifier.height(8.dp))
                line.trimStart().startsWith("|") -> {
                    val block = mutableListOf<String>()
                    while (i < lines.size && lines[i].trimStart().startsWith("|")) block += lines[i++].trim()
                    i--
                    val rows = block.filterNot { it.replace(Regex("[|:\\-\\s]"), "").isEmpty() }
                        .map { r -> r.trim('|').split("|").map { it.trim() } }
                    if (rows.isNotEmpty()) TableCard(DataTable("", rows.first(), rows.drop(1), rows.size - 1, false), markdown = true)
                }
                line.startsWith("### ") -> Text(inline(line.drop(4)), style = MaterialTheme.typography.titleMedium, color = Ink, modifier = Modifier.padding(top = 10.dp, bottom = 4.dp))
                line.startsWith("## ") -> Text(inline(line.drop(3)), style = MaterialTheme.typography.titleMedium.copy(fontSize = 21.sp), color = Ink, modifier = Modifier.padding(top = 12.dp, bottom = 4.dp))
                line.startsWith("# ") -> Text(inline(line.drop(2)), style = MaterialTheme.typography.headlineSmall, color = Ink, modifier = Modifier.padding(top = 4.dp, bottom = 6.dp))
                Regex("^\\s*([-*•])\\s+").containsMatchIn(line) -> {
                    val indent = line.takeWhile { it == ' ' }.length / 2
                    Row(Modifier.padding(start = (indent * 18).dp, top = 3.dp)) {
                        Text("•", style = MaterialTheme.typography.bodyLarge, color = Agent, modifier = Modifier.width(18.dp))
                        Text(inline(line.trimStart().drop(1).trimStart()), style = MaterialTheme.typography.bodyLarge, color = Ink)
                    }
                }
                Regex("^\\s*\\d+[.)]\\s+").containsMatchIn(line) -> {
                    val n = Regex("^\\s*(\\d+)").find(line)!!.groupValues[1]
                    Row(Modifier.padding(top = 3.dp)) {
                        Text("$n.", style = MaterialTheme.typography.bodyLarge.copy(fontFamily = GeistMono), color = Agent, modifier = Modifier.width(30.dp))
                        Text(inline(line.replace(Regex("^\\s*\\d+[.)]\\s+"), "")), style = MaterialTheme.typography.bodyLarge, color = Ink)
                    }
                }
                line.startsWith("> ") -> Text(inline(line.drop(2)), style = MaterialTheme.typography.bodyLarge.copy(fontStyle = FontStyle.Italic), color = Muted)
                else -> Text(inline(line), style = MaterialTheme.typography.bodyLarge, color = Ink)
            }
            i++
        }
    }
}

/** **bold**, *italic*, `code`. */
private fun inline(s: String): AnnotatedString = buildAnnotatedString {
    val re = Regex("\\*\\*(.+?)\\*\\*|\\*(.+?)\\*|`(.+?)`")
    var last = 0
    for (m in re.findAll(s)) {
        append(s.substring(last, m.range.first))
        when {
            m.groupValues[1].isNotEmpty() -> withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(m.groupValues[1]) }
            m.groupValues[2].isNotEmpty() -> withStyle(SpanStyle(fontStyle = FontStyle.Italic)) { append(m.groupValues[2]) }
            else -> withStyle(SpanStyle(fontFamily = GeistMono, background = Color(0x1FFAF7EC))) { append(m.groupValues[3]) }
        }
        last = m.range.last + 1
    }
    append(s.substring(last))
}

// ── Tables ──────────────────────────────────────────────────────────────────

@Composable
private fun TableCard(t: DataTable, markdown: Boolean = false) {
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(Card).padding(vertical = 8.dp)) {
        Box(Modifier.horizontalScroll(rememberScrollState())) {
            Column {
                Row(Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                    t.columns.forEach { Text(it, style = MaterialTheme.typography.labelMedium, color = Faint, modifier = Modifier.widthIn(min = 90.dp, max = 220.dp).padding(end = 16.dp), maxLines = 1, overflow = TextOverflow.Ellipsis) }
                }
                t.rows.take(30).forEach { row ->
                    Box(Modifier.fillMaxWidth().height(1.dp).background(Grid))
                    Row(Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                        row.forEach { cell ->
                            val numeric = cell.toDoubleOrNull() != null
                            Text(
                                if (markdown) inline(cell) else AnnotatedString(cell),
                                style = if (numeric) MonoSmallStyle else MaterialTheme.typography.bodyMedium,
                                color = Ink,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.widthIn(min = 90.dp, max = 220.dp).padding(end = 16.dp),
                            )
                        }
                    }
                }
            }
        }
        if (t.rows.size > 30 || t.truncated) {
            Text("${t.rowCount} rows${if (t.truncated) " (truncated)" else ""}", style = MaterialTheme.typography.bodySmall, color = Faint, modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp))
        }
    }
}

// ── Charts ──────────────────────────────────────────────────────────────────

@Composable
fun ChartCard(chart: Chart) {
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Card).padding(18.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(chart.title, style = MaterialTheme.typography.titleMedium, color = Ink, modifier = Modifier.weight(1f))
            if (chart.illustrative) Label("Example data", Warn)
        }
        if (chart.series.size > 1 || chart.type == ChartType.Pie) Legend(chart)
        Spacer(Modifier.height(12.dp))
        when (chart.type) {
            ChartType.Pie -> PieChart(chart)
            else -> XYChart(chart)
        }
        if (chart.caption.isNotBlank()) {
            Text(chart.caption, style = MaterialTheme.typography.bodySmall, color = Muted, modifier = Modifier.padding(top = 12.dp))
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Legend(chart: Chart) {
    val items = if (chart.type == ChartType.Pie) chart.points.map { it.x } else chart.series
    FlowRow(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
        items.forEachIndexed { i, label ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(10.dp).clip(RoundedCornerShape(3.dp)).background(SeriesColors[i % SeriesColors.size]))
                Text(label, style = MaterialTheme.typography.bodySmall, color = Muted, modifier = Modifier.padding(start = 6.dp))
            }
        }
    }
}

/** Bar, line, area and scatter on shared axes, with gridlines and readable ticks. */
@Composable
private fun XYChart(chart: Chart) {
    val measurer = rememberTextMeasurer()
    val tick = TextStyle(fontFamily = GeistMono, fontSize = 12.sp, color = Faint)
    val valueStyle = TextStyle(fontFamily = GeistMono, fontSize = 11.sp, color = Muted)
    val pts = chart.points
    val nSeries = chart.series.size.coerceAtLeast(1)
    val stackedTotals = pts.map { p -> p.values.sumOf { (it ?: 0f).toDouble() }.toFloat() }
    val maxV = (if (chart.stacked && chart.type == ChartType.Bar) stackedTotals.maxOrNull() else pts.flatMap { it.values }.filterNotNull().maxOrNull()) ?: 1f
    val minV = min(0f, pts.flatMap { it.values }.filterNotNull().minOrNull() ?: 0f)
    val (lo, hi, step) = niceScale(minV, max(maxV, minV + 1e-6f))
    Canvas(Modifier.fillMaxWidth().height(260.dp)) {
        val left = 56.dp.toPx()
        val bottom = 34.dp.toPx()
        val top = 8.dp.toPx()
        val w = size.width - left - 8.dp.toPx()
        val h = size.height - bottom - top
        fun y(v: Float) = top + h * (1f - (v - lo) / (hi - lo))
        // Gridlines and y ticks.
        var t = lo
        while (t <= hi + step / 2) {
            val yy = y(t)
            drawLine(Grid, Offset(left, yy), Offset(left + w, yy), 1.dp.toPx())
            val label = measurer.measure(fmt(t), tick)
            drawText(label, topLeft = Offset(left - label.size.width - 8.dp.toPx(), yy - label.size.height / 2))
            t += step
        }
        if (pts.isEmpty()) return@Canvas
        val slot = w / pts.size
        // X labels, thinned so they never overlap.
        val every = max(1, ceil(pts.size / (w / 64.dp.toPx())).toInt())
        pts.forEachIndexed { i, p ->
            if (i % every != 0) return@forEachIndexed
            val label = measurer.measure(p.x.take(10), tick)
            drawText(label, topLeft = Offset(left + slot * (i + 0.5f) - label.size.width / 2, top + h + 8.dp.toPx()))
        }
        when (chart.type) {
            ChartType.Bar -> {
                val groupW = slot * 0.72f
                pts.forEachIndexed { i, p ->
                    val x0 = left + slot * i + (slot - groupW) / 2
                    if (chart.stacked) {
                        var acc = 0f
                        p.values.forEachIndexed { s, v ->
                            val value = v ?: return@forEachIndexed
                            drawRect(SeriesColors[s % SeriesColors.size], Offset(x0, y(acc + value)), Size(groupW, y(acc) - y(acc + value)))
                            acc += value
                        }
                    } else {
                        val bw = groupW / nSeries
                        p.values.forEachIndexed { s, v ->
                            val value = v ?: return@forEachIndexed
                            val yTop = y(max(value, 0f))
                            val yBase = y(min(value, 0f).coerceAtLeast(lo).let { if (value >= 0) max(0f, lo) else it })
                            drawRoundRect(
                                SeriesColors[s % SeriesColors.size], Offset(x0 + bw * s + 1.dp.toPx(), yTop),
                                Size(bw - 2.dp.toPx(), (yBase - yTop).coerceAtLeast(1f)),
                                cornerRadius = androidx.compose.ui.geometry.CornerRadius(3.dp.toPx()),
                            )
                            // Values on the bars when there's room.
                            if (pts.size * nSeries <= 16) {
                                val label = measurer.measure(fmt(value), valueStyle)
                                drawText(label, topLeft = Offset(x0 + bw * s + bw / 2 - label.size.width / 2, yTop - label.size.height - 2.dp.toPx()))
                            }
                        }
                    }
                }
            }
            ChartType.Line, ChartType.Area, ChartType.Scatter -> {
                for (s in 0 until nSeries) {
                    val color = SeriesColors[s % SeriesColors.size]
                    val coords = pts.mapIndexedNotNull { i, p -> p.values.getOrNull(s)?.let { Offset(left + slot * (i + 0.5f), y(it)) } }
                    if (chart.type == ChartType.Scatter) {
                        coords.forEach { drawCircle(color, 4.5.dp.toPx(), it) }
                        continue
                    }
                    if (coords.size >= 2) {
                        val path = Path().apply { moveTo(coords[0].x, coords[0].y); coords.drop(1).forEach { lineTo(it.x, it.y) } }
                        if (chart.type == ChartType.Area) {
                            val fill = Path().apply { addPath(path); lineTo(coords.last().x, y(max(0f, lo))); lineTo(coords.first().x, y(max(0f, lo))); close() }
                            drawPath(fill, color.copy(alpha = 0.22f))
                        }
                        drawPath(path, color, style = Stroke(2.5.dp.toPx(), cap = StrokeCap.Round))
                    }
                    coords.forEach { drawCircle(color, 3.dp.toPx(), it) }
                }
            }
            ChartType.Pie -> Unit
        }
    }
    Row(Modifier.fillMaxWidth().padding(top = 4.dp)) {
        Text(chart.yLabel + if (chart.unit.isNotEmpty() && chart.unit != "count") " (${chart.unit})" else "", style = MaterialTheme.typography.bodySmall, color = Faint, modifier = Modifier.weight(1f))
        Text(chart.xLabel, style = MaterialTheme.typography.bodySmall, color = Faint)
    }
}

/** First series as shares of the whole, with the biggest slice starting at twelve o'clock. */
@Composable
private fun PieChart(chart: Chart) {
    val values = chart.points.map { (it.values.firstOrNull() ?: 0f).coerceAtLeast(0f) }
    val total = values.sum().takeIf { it > 0f } ?: 1f
    val measurer = rememberTextMeasurer()
    val pct = TextStyle(fontFamily = GeistMono, fontSize = 12.sp, color = Ink)
    Canvas(Modifier.fillMaxWidth().height(240.dp)) {
        val d = min(size.width, size.height) * 0.9f
        val topLeft = Offset((size.width - d) / 2, (size.height - d) / 2)
        var start = -90f
        values.forEachIndexed { i, v ->
            val sweep = 360f * v / total
            drawArc(SeriesColors[i % SeriesColors.size], start, sweep, useCenter = false, topLeft = topLeft + Offset(d * 0.14f, d * 0.14f), size = Size(d * 0.72f, d * 0.72f), style = Stroke(d * 0.2f))
            if (sweep > 18f) {
                val mid = Math.toRadians((start + sweep / 2).toDouble())
                val r = d * 0.36f
                val c = Offset(size.width / 2 + (r * cos(mid)).toFloat(), size.height / 2 + (r * sin(mid)).toFloat())
                val label = measurer.measure("${(100 * v / total).toInt()}%", pct)
                drawText(label, topLeft = c - Offset(label.size.width / 2f, label.size.height / 2f))
            }
            start += sweep
        }
    }
}

private fun fmt(v: Float): String = when {
    abs(v) >= 1_000_000 -> "%.1fM".format(v / 1_000_000)
    abs(v) >= 10_000 -> "%.0fk".format(v / 1_000)
    abs(v) >= 1_000 -> "%,.0f".format(v)
    v == floor(v) -> v.toInt().toString()
    else -> "%.1f".format(v)
}

/** Round axis bounds and a tick step (1, 2, 5 × 10ⁿ) with about five ticks. */
private fun niceScale(min: Float, max: Float): Triple<Float, Float, Float> {
    val range = (max - min).coerceAtLeast(1e-6f)
    val raw = range / 5f
    val mag = 10.0.pow(floor(log10(raw.toDouble()))).toFloat()
    val step = listOf(1f, 2f, 5f, 10f).map { it * mag }.first { it >= raw }
    return Triple(floor(min / step) * step, ceil(max / step) * step, step)
}

