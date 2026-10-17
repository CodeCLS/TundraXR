package com.tundra.tundraxr.ui.capture

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.DpSize
import com.tundra.tundraxr.ui.components.AdaptivePanel
import com.tundra.tundraxr.ui.components.PanelSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.VoiceTarget
import com.tundra.tundraxr.data.CaptureItem
import com.tundra.tundraxr.data.CaptureKind
import com.tundra.tundraxr.data.Device
import com.tundra.tundraxr.data.SyncState
import com.tundra.tundraxr.formatClock
import com.tundra.tundraxr.ui.components.Chip
import com.tundra.tundraxr.ui.components.DotPattern
import com.tundra.tundraxr.ui.components.Hairline
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.PanelShape
import com.tundra.tundraxr.ui.components.StatusDot
import com.tundra.tundraxr.ui.components.Waveform
import com.tundra.tundraxr.ui.components.Wordmark
import com.tundra.tundraxr.ui.theme.Tundra
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Composable
fun CapturePanel(state: SessionState, onSelectDevice: (Device) -> Unit, modifier: Modifier = Modifier, onScale: ((Float) -> Unit)? = null) {
    val c = Tundra.colors
    AdaptivePanel(DpSize(880.dp, 760.dp), modifier.fillMaxSize().background(c.paper), onScale) { size ->
        DotPattern()
        val padH = if (size.compactWidth) 20.dp else 40.dp
        val padV = if (size.compactHeight) 14.dp else 32.dp
        val gap = if (size.compactHeight) 14.dp else 28.dp
        val device: @Composable () -> Unit = {
            AnimatedContent(
                targetState = state.device,
                transitionSpec = { fadeIn(tween(400)) togetherWith fadeOut(tween(200)) },
                label = "device",
            ) { d ->
                when {
                    d == null -> Identifying(size)
                    size.compactHeight && !size.wide -> DeviceStrip(d, state.devices, onSelectDevice)
                    else -> DeviceCard(d, state.devices, onSelectDevice, size)
                }
            }
        }
        if (size.wide) {
            // Landscape strip: device on the left, the session's documentation on the right.
            Row(Modifier.fillMaxSize().padding(horizontal = padH, vertical = padV), horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(Modifier.weight(0.42f).fillMaxHeight().verticalScroll(rememberScrollState())) {
                    Header(state, size)
                    Spacer(Modifier.height(gap))
                    device()
                }
                Column(Modifier.weight(0.58f).fillMaxHeight()) {
                    DocumentationHeader(state)
                    Spacer(Modifier.height(12.dp))
                    Timeline(state, size, Modifier.weight(1f))
                }
            }
        } else {
            Column(Modifier.fillMaxSize().padding(horizontal = padH, vertical = padV)) {
                Header(state, size)
                Spacer(Modifier.height(gap))
                device()
                Spacer(Modifier.height(gap))
                DocumentationHeader(state)
                Spacer(Modifier.height(if (size.compactHeight) 8.dp else 12.dp))
                Timeline(state, size, Modifier.weight(1f))
            }
        }
        PhotoFlash(state.photoFlash)
    }
}

@Composable
private fun Header(state: SessionState, size: PanelSize) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Wordmark(compact = size.compactWidth)
        Spacer(Modifier.weight(1f))
        if (state.isRecording) {
            StatusDot(Tundra.colors.record, pulsing = true)
            MonoLabel("Rec ${formatClock(state.recordingSec)}", Modifier.padding(start = 8.dp), color = Tundra.colors.record)
        } else {
            val (color, text) = when (state.brainOnline) {
                true -> Tundra.colors.synced to if (size.compactWidth) "Brain" else "Laptop brain"
                false -> Tundra.colors.record to "Offline"
                null -> Tundra.colors.ring to "Connecting"
            }
            StatusDot(color)
            MonoLabel(text, Modifier.padding(start = 8.dp))
        }
    }
}

@Composable
private fun DocumentationHeader(state: SessionState) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        MonoLabel("Documentation")
        Spacer(Modifier.weight(1f))
        val error = state.voiceError
        if (error != null) {
            MonoLabel(error, color = Tundra.colors.record, small = true)
        } else if (state.captures.isNotEmpty()) {
            MonoLabel("${state.syncedCount}/${state.captures.size} in brain", small = true)
        }
    }
}

@Composable
private fun Identifying(size: PanelSize) {
    Row(
        Modifier.fillMaxWidth().clip(PanelShape).background(Tundra.colors.raised).border(1.dp, Tundra.colors.border, PanelShape)
            .padding(if (size.compactHeight || size.compactWidth) 16.dp else 28.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CircularProgressIndicator(Modifier.size(22.dp), color = Tundra.colors.ink, strokeWidth = 2.dp)
        Column(Modifier.padding(start = 16.dp)) {
            MonoLabel("Identifying device")
            Text("Look at the asset tag or the device label", style = MaterialTheme.typography.bodyLarge, color = Tundra.colors.ink)
        }
    }
}

/** Device switcher; identification is simulated, so the engineer can correct it. */
@Composable
private fun DevicePicker(devices: List<Device>, onSelect: (Device) -> Unit, label: String) {
    if (devices.size <= 1) return
    val c = Tundra.colors
    var picking by remember { mutableStateOf(false) }
    Box {
        Chip(label, onClick = { picking = true })
        DropdownMenu(
            expanded = picking,
            onDismissRequest = { picking = false },
            modifier = Modifier.widthIn(min = 300.dp),
            containerColor = c.raised,
        ) {
            devices.forEach { d ->
                DropdownMenuItem(
                    text = {
                        Column(Modifier.padding(vertical = 6.dp)) {
                            Text(d.name, style = MaterialTheme.typography.bodyLarge, color = c.ink)
                            MonoLabel("${d.category} · ${d.assetTag}", small = true)
                        }
                    },
                    onClick = { picking = false; onSelect(d) },
                )
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun DeviceCard(device: Device, devices: List<Device>, onSelect: (Device) -> Unit, size: PanelSize) {
    val c = Tundra.colors
    val compact = size.compactWidth
    Column(Modifier.fillMaxWidth().clip(PanelShape).background(c.raised).border(1.dp, c.border, PanelShape).padding(if (compact) 18.dp else 28.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            MonoLabel("${device.manufacturer} · ${device.category}", Modifier.weight(1f))
            DevicePicker(devices, onSelect, if (compact) "Change" else "Not this device?")
        }
        Text(
            device.name,
            style = if (compact) MaterialTheme.typography.headlineMedium else MaterialTheme.typography.displaySmall,
            color = c.ink,
            modifier = Modifier.padding(top = 6.dp),
        )
        Spacer(Modifier.height(if (compact) 14.dp else 20.dp))
        Hairline(Modifier.fillMaxWidth())
        Spacer(Modifier.height(if (compact) 12.dp else 18.dp))
        // Facts wrap onto more lines as the panel narrows.
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(if (compact) 20.dp else 36.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Fact("Asset", device.assetTag)
            Fact("Location", device.location)
            Fact("Serial", device.serial)
            Fact("Last PM", device.lastPm)
            Fact("Open WO", device.openWorkOrders.toString())
        }
    }
}

/** One-line device card for short panels, so the timeline keeps its room. */
@Composable
private fun DeviceStrip(device: Device, devices: List<Device>, onSelect: (Device) -> Unit) {
    val c = Tundra.colors
    Row(
        Modifier.fillMaxWidth().clip(PanelShape).background(c.raised).border(1.dp, c.border, PanelShape).padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(device.name, style = MaterialTheme.typography.titleMedium, color = c.ink, maxLines = 1, overflow = TextOverflow.Ellipsis)
            MonoLabel("${device.assetTag} · ${device.location}", small = true)
        }
        DevicePicker(devices, onSelect, "Change")
    }
}

@Composable
private fun Fact(label: String, value: String) {
    Column {
        MonoLabel(label, small = true)
        Text(value, style = MaterialTheme.typography.bodyLarge, color = Tundra.colors.ink, modifier = Modifier.padding(top = 4.dp))
    }
}

@Composable
private fun Timeline(state: SessionState, size: PanelSize, modifier: Modifier) {
    val live = state.listeningFor == VoiceTarget.Note
    if (state.captures.isEmpty() && !live) {
        Box(modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    "Record, take photos, or just talk.",
                    style = when {
                        size.compactHeight -> MaterialTheme.typography.titleMedium
                        size.compactWidth -> MaterialTheme.typography.headlineSmall
                        else -> MaterialTheme.typography.headlineMedium
                    },
                    color = Tundra.colors.ink,
                    textAlign = TextAlign.Center,
                )
                if (!size.compactHeight) {
                    Text(
                        "Everything goes straight into this device's record in the brain.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = Tundra.colors.inkMuted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }
            }
        }
        return
    }
    val listState = rememberLazyListState()
    LazyColumn(modifier.fillMaxWidth(), state = listState, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        if (live) item(key = "live") { LiveNote(state.liveTranscript) }
        items(state.captures, key = { it.id }) { CaptureRow(it, size.compactWidth, Modifier.animateItem()) }
    }
}

@Composable
private fun LiveNote(transcript: String) {
    val c = Tundra.colors
    Row(
        Modifier.fillMaxWidth().clip(PanelShape).background(c.raised).border(1.dp, c.ink, PanelShape).padding(16.dp).animateContentSize(),
        verticalAlignment = Alignment.Top,
    ) {
        Box(Modifier.size(40.dp), contentAlignment = Alignment.Center) { Waveform() }
        Column(Modifier.padding(start = 14.dp).weight(1f)) {
            MonoLabel("Listening · streams to brain", color = c.ink)
            Text(
                transcript.ifEmpty { "…" },
                style = MaterialTheme.typography.bodyLarge,
                color = c.ink,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

@Composable
private fun CaptureRow(item: CaptureItem, compact: Boolean, modifier: Modifier = Modifier) {
    val c = Tundra.colors
    val (kind, title) = when (item.kind) {
        CaptureKind.Photo -> "Photo" to "Photo ${item.index}"
        CaptureKind.Video -> "Video" to "Walkthrough · ${formatClock(item.durationSec)}"
        CaptureKind.Note -> "Voice note" to item.transcript
    }
    Row(
        modifier.fillMaxWidth().clip(PanelShape).background(c.raised).border(1.dp, c.border, PanelShape).padding(if (compact) 12.dp else 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Thumb(item, if (compact) DpSize(52.dp, 42.dp) else DpSize(72.dp, 56.dp))
        Column(Modifier.padding(horizontal = if (compact) 12.dp else 18.dp).weight(1f)) {
            MonoLabel("$kind · ${item.at}", small = true)
            Text(title, style = MaterialTheme.typography.bodyLarge, color = c.ink, maxLines = 3, modifier = Modifier.padding(top = 2.dp))
            // Narrow rows: status goes under the title instead of fighting it for width.
            if (compact) Box(Modifier.padding(top = 6.dp)) { SyncBadge(item.sync, item.detail) }
        }
        if (!compact) SyncBadge(item.sync, item.detail)
    }
}

@Composable
private fun Thumb(item: CaptureItem, size: DpSize) {
    val c = Tundra.colors
    val icon = when (item.kind) {
        CaptureKind.Photo -> R.drawable.ic_camera
        CaptureKind.Video -> R.drawable.ic_videocam
        CaptureKind.Note -> R.drawable.ic_mic
    }
    val photo by produceState<ImageBitmap?>(null, item.file) {
        if (item.kind == CaptureKind.Photo && item.file != null) value = withContext(Dispatchers.IO) { decodeThumb(item.file) }
    }
    Box(
        Modifier.size(size).clip(RoundedCornerShape(8.dp)).background(c.muted),
        contentAlignment = Alignment.Center,
    ) {
        val bmp = photo
        if (bmp != null) {
            Image(bmp, null, Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
        } else {
            DotPattern(spacing = 10.dp)
            Icon(painterResource(icon), null, Modifier.size(22.dp), tint = c.ink)
        }
    }
}

private fun decodeThumb(path: String): ImageBitmap? = runCatching {
    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    BitmapFactory.decodeFile(path, bounds)
    var sample = 1
    while (bounds.outWidth / (sample * 2) >= 160) sample *= 2
    BitmapFactory.decodeFile(path, BitmapFactory.Options().apply { inSampleSize = sample })?.asImageBitmap()
}.getOrNull()

@Composable
private fun SyncBadge(sync: SyncState, detail: String?) {
    val c = Tundra.colors
    AnimatedContent(sync to detail, label = "sync") { (s, d) ->
        Row(verticalAlignment = Alignment.CenterVertically) {
            when (s) {
                SyncState.Sending, SyncState.Analyzing -> {
                    CircularProgressIndicator(Modifier.size(14.dp), color = c.inkMuted, strokeWidth = 1.5.dp)
                    MonoLabel(d ?: if (s == SyncState.Sending) "Sending" else "Analyzing", Modifier.padding(start = 8.dp), small = true)
                }
                SyncState.InBrain, SyncState.Analyzed -> {
                    Icon(painterResource(if (s == SyncState.Analyzed) R.drawable.ic_sparkle else R.drawable.ic_check), null, Modifier.size(16.dp), tint = c.synced)
                    MonoLabel(d ?: "In brain", Modifier.padding(start = 6.dp), color = c.synced, small = true)
                }
                SyncState.Failed -> {
                    StatusDot(c.record)
                    MonoLabel(d ?: "Failed", Modifier.padding(start = 8.dp), color = c.record, small = true)
                }
            }
        }
    }
}

/** Brief white flash over the panel as shutter feedback. */
@Composable
private fun PhotoFlash(trigger: Long) {
    val alpha = remember { Animatable(0f) }
    LaunchedEffect(trigger) {
        if (trigger == 0L) return@LaunchedEffect
        alpha.snapTo(0.55f)
        alpha.animateTo(0f, tween(450))
    }
    Box(Modifier.fillMaxSize().graphicsLayer { this.alpha = alpha.value }.background(Color.White))
}
