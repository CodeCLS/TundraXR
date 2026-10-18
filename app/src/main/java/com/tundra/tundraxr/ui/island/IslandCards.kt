package com.tundra.tundraxr.ui.island

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.ui.capture.SyncBadge
import com.tundra.tundraxr.ui.components.CardShape
import com.tundra.tundraxr.ui.components.Chip
import com.tundra.tundraxr.ui.components.ControlShape
import com.tundra.tundraxr.ui.components.DotPattern
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.MonoText
import com.tundra.tundraxr.ui.components.PillButton
import com.tundra.tundraxr.ui.components.PillText
import com.tundra.tundraxr.ui.components.decodeThumb
import com.tundra.tundraxr.ui.theme.MonoSmallStyle
import com.tundra.tundraxr.ui.theme.Radius
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.xr
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/** The design system's `Card`: card fill, --border-default edge, 12px radius, no shadow. */
@Composable
private fun IslandCardFrame(modifier: Modifier = Modifier, onClick: (() -> Unit)? = null, content: @Composable () -> Unit) {
    val c = Tundra.colors
    Column(
        modifier.fillMaxWidth().clip(CardShape).background(c.raised).border(1.dp, c.borderControl, CardShape)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(16.dp),
    ) { content() }
}

/** Requests in flight, as the design system's `ToolCall` rows: status, endpoint, what it carries, result. */
@Composable
fun ProgressCard(calls: List<CallProgress>, modifier: Modifier = Modifier, onOpen: (() -> Unit)? = null) {
    IslandCardFrame(modifier, onClick = onOpen) {
        MonoLabel("In progress", small = true)
        Spacer(Modifier.height(10.dp))
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            calls.forEach { ToolCallRow(it) }
        }
    }
}

@Composable
private fun ToolCallRow(call: CallProgress) {
    val c = Tundra.colors
    val tile = RoundedCornerShape(Radius.xs.xr())
    Row(verticalAlignment = Alignment.Top) {
        val (bg, fg) = when (call.status) {
            CallStatus.Ok -> c.okBg to c.okFg
            CallStatus.Running -> c.accentSurface to c.accent
            CallStatus.Failed -> c.downBg to c.downFg
            CallStatus.Queued -> c.paper to c.inkMuted
        }
        Box(Modifier.padding(top = 2.dp).size(22.dp).clip(tile).background(bg), contentAlignment = Alignment.Center) {
            when (call.status) {
                CallStatus.Running -> CircularProgressIndicator(Modifier.size(12.dp), color = fg, strokeWidth = 1.5.dp)
                CallStatus.Ok -> Icon(painterResource(R.drawable.ic_check), null, Modifier.size(14.dp), tint = fg)
                CallStatus.Failed -> Icon(painterResource(R.drawable.ic_close), null, Modifier.size(14.dp), tint = fg)
                CallStatus.Queued -> Icon(painterResource(R.drawable.ic_clock), null, Modifier.size(14.dp), tint = fg)
            }
        }
        Column(Modifier.padding(start = 10.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Endpoint names are an API surface: shown whole, never shortened.
                Text(call.endpoint, style = MonoSmallStyle, color = c.ink)
                Text(
                    call.subject,
                    style = MonoSmallStyle,
                    color = c.inkMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(start = 8.dp).clip(tile).background(c.paper).border(1.dp, c.borderControl, tile).padding(horizontal = 6.dp, vertical = 1.dp),
                )
            }
            if (call.result != null) {
                Text("→ ${call.result}", style = MonoSmallStyle, color = c.inkMuted, modifier = Modifier.padding(top = 2.dp))
            }
        }
    }
}

/**
 * The manual passage behind the latest answer. Until the brain returns step-by-step guidance
 * this is the cited section and its excerpt, with a way into the page itself.
 */
@Composable
fun RepairGuidanceCard(guidance: Guidance, onOpen: () -> Unit, modifier: Modifier = Modifier) {
    val c = Tundra.colors
    IslandCardFrame(modifier) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(R.drawable.ic_manual), null, Modifier.size(18.dp), tint = c.inkMuted)
            MonoLabel("From the manual", Modifier.padding(start = 8.dp), small = true)
            Spacer(Modifier.weight(1f))
            MonoText("p.${guidance.page}", color = c.inkMuted, small = true)
        }
        Text(
            guidance.section,
            style = MaterialTheme.typography.titleMedium,
            color = c.ink,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(top = 8.dp),
        )
        if (guidance.excerpt != null) {
            Text(
                guidance.excerpt,
                style = MaterialTheme.typography.bodyMedium,
                color = c.ink,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
        Spacer(Modifier.height(12.dp))
        // Opening the manual is something the agent pointed at, so the accent variant.
        PillButton(onOpen, accent = true, minHeight = 48.dp) { fg ->
            Icon(painterResource(R.drawable.ic_open), null, Modifier.size(18.dp), tint = fg)
            PillText("Open p.${guidance.page}", fg)
        }
    }
}

/** The latest photo with its sync state; tapping opens it large in the focused panel. */
@Composable
fun ImagePreview(image: ImageItem, onOpen: () -> Unit, modifier: Modifier = Modifier) {
    val c = Tundra.colors
    val bitmap by produceState<ImageBitmap?>(null, image.file) {
        val f = image.file
        if (f != null) value = withContext(Dispatchers.IO) { decodeThumb(f, targetPx = 640) }
    }
    IslandCardFrame(modifier, onClick = onOpen) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.width(132.dp).aspectRatio(4f / 3f).clip(ControlShape).background(c.muted),
                contentAlignment = Alignment.Center,
            ) {
                val bmp = bitmap
                if (bmp != null) {
                    Image(bmp, image.label, Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
                } else {
                    DotPattern(spacing = 10.dp)
                    Icon(painterResource(R.drawable.ic_camera), null, Modifier.size(24.dp), tint = c.inkMuted)
                }
            }
            Column(Modifier.padding(start = 14.dp).weight(1f)) {
                MonoLabel("Latest capture", small = true)
                Text(image.label, style = MaterialTheme.typography.titleMedium, color = c.ink, modifier = Modifier.padding(top = 2.dp, bottom = 8.dp))
                SyncBadge(image.sync, image.detail)
            }
            Icon(painterResource(R.drawable.ic_open), "Open large", Modifier.size(20.dp), tint = c.inkMuted)
        }
    }
}

/** Starter questions, shown only before the first one is asked. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SuggestionsCard(suggestions: List<String>, onAsk: (String) -> Unit, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth()) {
        MonoLabel("Try asking", small = true)
        Spacer(Modifier.height(8.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            suggestions.forEach { Chip(it, onClick = { onAsk(it) }) }
        }
    }
}
