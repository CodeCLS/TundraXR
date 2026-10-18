package com.tundra.tundraxr.ui.manual

import android.content.Context
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.RepeatMode
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.calculateZoom
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.PointerInputScope
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.DpSize
import com.tundra.tundraxr.ui.components.AdaptivePanel
import com.tundra.tundraxr.ui.components.PanelSize
import kotlin.math.ceil
import kotlin.math.roundToInt
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.data.Manual
import com.tundra.tundraxr.data.ManualPage
import com.tundra.tundraxr.data.ManualTarget
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.ControlShape
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.MonoText
import com.tundra.tundraxr.ui.components.PanelShape
import com.tundra.tundraxr.ui.theme.Tundra
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.io.File
import java.net.URL
import java.net.HttpURLConnection

private val ZoomSteps = listOf(1f, 1.25f, 1.5f, 2f, 2.5f, 3f, 4f)

@Composable
fun ManualPanel(
    manual: Manual?,
    target: ManualTarget?,
    onClose: (() -> Unit)?,
    modifier: Modifier = Modifier,
) {
    val c = Tundra.colors
    val context = LocalContext.current
    // Download once per manual (cached in app storage), then open with PdfRenderer.
    val pdf by produceState<PdfDocument?>(null, manual?.id) {
        value = null
        val url = manual?.pdfUrl ?: return@produceState
        value = withContext(Dispatchers.IO) { openPdf(context, manual.id, url) }
    }
    val doc = pdf
    DisposableEffect(doc) { onDispose { doc?.close() } }
    val listState = rememberLazyListState()
    var zoom by remember(manual?.id) { mutableFloatStateOf(1f) }

    // Index in the list (structured pages, or PDF page index) the brain wants shown.
    val targetIndex = when {
        manual == null || target == null -> null
        doc != null -> (target.page - 1).coerceIn(0, doc.pageCount - 1)
        else -> manual.pages.indexOfFirst { it.number == target.page }.takeIf { it >= 0 }
    }
    LaunchedEffect(target, targetIndex) {
        if (targetIndex == null) return@LaunchedEffect
        // Animating across dozens of pages would render every page in between; jump instead.
        if (kotlin.math.abs(listState.firstVisibleItemIndex - targetIndex) > 3) listState.scrollToItem(targetIndex)
        else listState.animateScrollToItem(targetIndex)
    }

    AdaptivePanel(DpSize(640.dp, 760.dp), modifier.fillMaxSize().background(c.paper)) { size ->
        Column(Modifier.fillMaxSize()) {
            Header(manual, doc, listState, onClose, size, zoom.takeIf { doc != null }, target) { zoom = it }
            // Short panels fold the pointer into the header instead of spending a row on it.
            AnimatedVisibility(target != null && !size.compactHeight) {
                target?.let { Pointer(it, size) }
            }
            Box(Modifier.weight(1f).fillMaxWidth().background(c.muted)) {
                when {
                    manual == null -> Unit
                    doc != null -> PdfPages(doc, listState, targetIndex, target, zoom, size) { zoom = it }
                    manual.pdfUrl != null -> MonoLabel("Opening manual…", Modifier.align(Alignment.Center))
                    else -> StructuredPages(manual.pages, listState, target)
                }
            }
        }
    }
}

@Composable
private fun Header(
    manual: Manual?,
    pdf: PdfDocument?,
    listState: LazyListState,
    onClose: (() -> Unit)?,
    size: PanelSize,
    zoom: Float?,
    target: ManualTarget?,
    onZoom: (Float) -> Unit,
) {
    val c = Tundra.colors
    val currentPage by remember(manual, pdf) {
        derivedStateOf {
            val i = listState.firstVisibleItemIndex
            if (pdf != null) i + 1 else manual?.pages?.getOrNull(i)?.number ?: 0
        }
    }
    val compact = size.compactWidth || size.compactHeight
    Row(
        Modifier.fillMaxWidth().padding(
            start = if (compact) 16.dp else 28.dp, end = if (compact) 8.dp else 16.dp,
            top = if (size.compactHeight) 8.dp else 20.dp, bottom = if (size.compactHeight) 8.dp else 16.dp,
        ),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (!size.compactWidth) Icon(painterResource(R.drawable.ic_manual), null, Modifier.padding(end = 12.dp).size(20.dp), tint = c.ink)
        Column(Modifier.weight(1f)) {
            Text(manual?.title ?: "Manual", style = MaterialTheme.typography.titleMedium, color = c.ink, maxLines = 1, overflow = TextOverflow.Ellipsis)
            val pages = "p. $currentPage / ${pdf?.pageCount ?: manual?.pageCount ?: 0}"
            val pointer = target?.takeIf { size.compactHeight }?.let { "→ ${it.reason}" }
            MonoLabel(
                listOfNotNull(manual?.revision?.takeIf { !compact }, pages, pointer).joinToString(" · "),
                small = true,
                color = if (pointer != null) c.ink else c.inkMuted,
            )
        }
        if (zoom != null) ZoomControls(zoom, onZoom, small = compact)
        if (onClose != null) IconCircle(R.drawable.ic_close, "Close manual", onClose, size = if (compact) 40.dp else 44.dp)
    }
}

/** − 100% + : steps through zoom levels; tapping the percentage fits the page to the panel again. */
@Composable
private fun ZoomControls(zoom: Float, onZoom: (Float) -> Unit, small: Boolean) {
    val c = Tundra.colors
    val button = if (small) 40.dp else 44.dp
    Row(
        Modifier.padding(horizontal = 6.dp).clip(ControlShape).border(1.dp, c.borderControl, ControlShape),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconCircle(R.drawable.ic_minus, "Zoom out", { onZoom(ZoomSteps.lastOrNull { it < zoom - 0.01f } ?: 1f) }, size = button)
        Text(
            "${(zoom * 100).roundToInt()}%",
            style = MaterialTheme.typography.labelMedium,
            color = c.ink,
            textAlign = TextAlign.Center,
            modifier = Modifier.width(if (small) 44.dp else 52.dp).clip(CircleShape).clickable { onZoom(1f) }.padding(vertical = 10.dp),
        )
        IconCircle(R.drawable.ic_plus, "Zoom in", { onZoom(ZoomSteps.firstOrNull { it > zoom + 0.01f } ?: ZoomSteps.last()) }, size = button)
    }
}

/** "Tundra pointed you here" strip above the document. */
@Composable
private fun Pointer(target: ManualTarget, size: PanelSize) {
    val c = Tundra.colors
    Row(
        Modifier.fillMaxWidth().background(c.accentSurface).padding(horizontal = if (size.compactWidth) 16.dp else 28.dp, vertical = if (size.compactHeight) 8.dp else 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(painterResource(R.drawable.ic_sparkle), null, Modifier.size(18.dp), tint = c.accent)
        MonoText("p.${target.page}", Modifier.padding(start = 10.dp), color = c.accent, small = true)
        Text(
            target.reason,
            style = MaterialTheme.typography.bodyMedium,
            color = c.ink,
            modifier = Modifier.padding(start = 12.dp),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

// ── Structured pages (no PDF bundled) ──────────────────────────────────────

@Composable
private fun StructuredPages(pages: List<ManualPage>, listState: LazyListState, target: ManualTarget?) {
    LazyColumn(
        Modifier.fillMaxSize(),
        state = listState,
        contentPadding = PaddingValues(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        itemsIndexed(pages, key = { _, p -> p.number }) { _, page ->
            Paper(page, highlighted = target?.takeIf { it.page == page.number }?.passage)
        }
    }
}

@Composable
private fun Paper(page: ManualPage, highlighted: Int?) {
    val c = Tundra.colors
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(4.dp)).background(c.raised).border(1.dp, c.border, RoundedCornerShape(4.dp)).padding(horizontal = 36.dp, vertical = 32.dp),
    ) {
        Row {
            MonoLabel("Section ${page.section}", small = true)
            Spacer(Modifier.weight(1f))
            MonoLabel("${page.number}", small = true)
        }
        Text(
            page.title,
            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
            color = c.ink,
            modifier = Modifier.padding(top = 14.dp, bottom = 10.dp),
        )
        page.passages.forEachIndexed { i, text -> Passage(text, i == highlighted) }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun Passage(text: String, highlighted: Boolean) {
    val c = Tundra.colors
    val bg by animateColorAsState(if (highlighted) c.highlight else Color.Transparent, tween(700), label = "hl")
    Row(Modifier.fillMaxWidth().height(IntrinsicSize.Min).padding(vertical = 4.dp).clip(RoundedCornerShape(4.dp)).background(bg)) {
        Box(Modifier.width(3.dp).fillMaxHeight().background(if (highlighted) c.accentDot else Color.Transparent))
        Text(text, style = MaterialTheme.typography.bodyLarge, color = c.ink, modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp))
    }
}

// ── OEM PDF ────────────────────────────────────────────────────────────────

@Composable
private fun PdfPages(
    pdf: PdfDocument,
    listState: LazyListState,
    targetIndex: Int?,
    target: ManualTarget?,
    zoom: Float,
    size: PanelSize,
    onZoom: (Float) -> Unit,
) {
    val c = Tundra.colors
    val density = LocalDensity.current
    val zoomState = rememberUpdatedState(zoom)
    val pad = if (size.compactWidth) 12.dp else 24.dp
    BoxWithConstraints(
        Modifier
            .fillMaxSize()
            .pointerInput(Unit) { detectTapGestures(onDoubleTap = { onZoom(if (zoomState.value > 1.01f) 1f else 2f) }) }
            .pointerInput(Unit) { detectPinchZoom { factor -> onZoom((zoomState.value * factor).coerceIn(1f, 4f)) } },
    ) {
        // At 100% a page fits the panel (capped so very wide panels don't make it huge); zoom grows it.
        val fit = (maxWidth - pad * 2).coerceAtMost(980.dp)
        val pageWidth = fit * zoom
        val contentWidth = maxOf(maxWidth, pageWidth + pad * 2)
        val hScroll = rememberScrollState()
        // Re-render sharper as the page gets bigger, in coarse steps so zooming doesn't thrash.
        val renderPx = with(density) { pageWidth.toPx() }.let { (ceil(it / 400f) * 400).toInt().coerceIn(800, 2000) }

        // When zoomed in, bring the highlighted passage into view horizontally too.
        LaunchedEffect(target, zoom) {
            val box = target?.box ?: return@LaunchedEffect
            if (zoom <= 1.01f) return@LaunchedEffect
            val x = with(density) { (pad + pageWidth * box[0]).toPx() - 24.dp.toPx() }
            hScroll.animateScrollTo(x.toInt().coerceAtLeast(0))
        }

        Box(Modifier.fillMaxSize().horizontalScroll(hScroll, enabled = zoom > 1.01f)) {
            LazyColumn(
                Modifier.width(contentWidth).fillMaxHeight(),
                state = listState,
                contentPadding = PaddingValues(pad),
                verticalArrangement = Arrangement.spacedBy(if (size.compactHeight) 12.dp else 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                items(pdf.pageCount, key = { it }) { index ->
                    // Keep the last bitmap on screen while a sharper one renders.
                    var bitmap by remember(index) { mutableStateOf<Bitmap?>(null) }
                    LaunchedEffect(index, renderPx) { bitmap = pdf.render(index, renderPx) }
                    val isTarget = index == targetIndex
                    BoxWithConstraints(
                        Modifier.width(pageWidth).aspectRatio(pdf.aspect(index)).clip(RoundedCornerShape(4.dp)).background(Color.White)
                            .border(if (isTarget) 2.dp else 1.dp, if (isTarget) c.accentDot else c.borderControl, RoundedCornerShape(4.dp)),
                    ) {
                        bitmap?.let { Image(it.asImageBitmap(), "Page ${index + 1}", Modifier.fillMaxSize()) }
                        // The passage the brain cited, outlined on the page itself.
                        val box = target?.box
                        if (isTarget && box != null && box.size == 4) {
                            val alpha by rememberInfiniteTransition(label = "hl").animateFloat(
                                0.28f, 0.5f, infiniteRepeatable(tween(900), RepeatMode.Reverse), label = "a",
                            )
                            Box(
                                Modifier
                                    .offset(x = maxWidth * box[0], y = maxHeight * box[1])
                                    .size(width = maxWidth * (box[2] - box[0]), height = maxHeight * (box[3] - box[1]))
                                    .background(c.highlight.copy(alpha = alpha), RoundedCornerShape(3.dp))
                                    .border(2.dp, c.accentDot, RoundedCornerShape(3.dp)),
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Two-pointer pinch (two hands, or two fingers) zooms. Single-pointer drags are left alone so
 * the pages still scroll normally.
 */
private suspend fun PointerInputScope.detectPinchZoom(onZoom: (Float) -> Unit) {
    awaitEachGesture {
        awaitFirstDown(requireUnconsumed = false)
        do {
            val event = awaitPointerEvent(PointerEventPass.Initial)
            if (event.changes.count { it.pressed } >= 2) {
                val factor = event.calculateZoom()
                if (factor != 1f) {
                    onZoom(factor)
                    event.changes.forEach { it.consume() }
                }
            }
        } while (event.changes.any { it.pressed })
    }
}

private class PdfDocument(private val renderer: PdfRenderer, private val fd: ParcelFileDescriptor) {
    private val lock = Mutex() // PdfRenderer allows one open page at a time
    private val aspects = HashMap<Int, Float>()
    /** Guarded by `synchronized(renderer)`: a page may still be rendering when the panel goes away. */
    private var closed = false
    val pageCount = renderer.pageCount

    fun aspect(index: Int): Float = synchronized(renderer) {
        if (closed) return 0.77f
        aspects.getOrPut(index) { renderer.openPage(index).use { it.width.toFloat() / it.height } }
    }

    /** Null once the document has been closed. */
    suspend fun render(index: Int, widthPx: Int): Bitmap? = withContext(Dispatchers.IO) {
        lock.withLock {
            synchronized(renderer) {
                if (closed) return@withContext null
                renderer.openPage(index).use { page ->
                    val bmp = Bitmap.createBitmap(widthPx, widthPx * page.height / page.width, Bitmap.Config.ARGB_8888)
                    bmp.eraseColor(android.graphics.Color.WHITE)
                    page.render(bmp, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                    bmp
                }
            }
        }
    }

    fun close() = synchronized(renderer) {
        if (closed) return
        closed = true
        renderer.close()
        fd.close()
    }
}

/** Downloads the manual from the brain once, then opens the cached copy. Null if unreachable. */
private fun openPdf(context: Context, id: String, url: String): PdfDocument? = runCatching {
    val dir = File(context.filesDir, "manuals").apply { mkdirs() }
    val file = File(dir, "$id.pdf")
    if (!file.exists() || file.length() == 0L) {
        val tmp = File(dir, "$id.part")
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 5_000
            readTimeout = 60_000
            setRequestProperty("user-agent", "TundraXR/1.0")
        }
        try {
            check(conn.responseCode == 200) { "manual download ${conn.responseCode}" }
            conn.inputStream.use { input -> tmp.outputStream().use { input.copyTo(it) } }
        } finally {
            conn.disconnect()
        }
        tmp.renameTo(file)
    }
    val fd = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
    PdfDocument(PdfRenderer(fd), fd)
}.getOrNull()
