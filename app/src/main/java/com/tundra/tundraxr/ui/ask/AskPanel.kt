package com.tundra.tundraxr.ui.ask

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.ui.unit.DpSize
import com.tundra.tundraxr.ui.components.AdaptivePanel
import com.tundra.tundraxr.ui.components.PanelSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.VoiceTarget
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.ui.components.Chip
import com.tundra.tundraxr.ui.components.DotPattern
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.PanelShape
import com.tundra.tundraxr.ui.components.Waveform
import com.tundra.tundraxr.ui.theme.Tundra

/** Starter questions per device; answers come from that device's OEM manual. */
private fun suggestionsFor(deviceId: String?) = when (deviceId) {
    "pb980" -> listOf("How do I run SST?", "Preventive maintenance intervals?", "What does a high circuit pressure alarm mean?", "How do I run EST?")
    "pm100n" -> listOf("How do I replace the battery?", "Performance verification with the SRC-MAX", "What does an error code mean?", "Spare parts list")
    "ft10" -> listOf("Electrical safety leakage current test", "How do I calibrate the generator?", "Troubleshooting error codes", "Preventive maintenance")
    else -> listOf("What does the fan failure alarm mean?", "When was the last PM?", "How do I calibrate the O2 sensor?", "Similar issues across the fleet?")
}

@Composable
fun AskPanel(
    state: SessionState,
    onDraftChange: (String) -> Unit,
    onSend: () -> Unit,
    onAsk: (String) -> Unit,
    onMic: () -> Unit,
    onSource: (Source) -> Unit,
    onClose: (() -> Unit)?,
    modifier: Modifier = Modifier,
) {
    val c = Tundra.colors
    AdaptivePanel(DpSize(560.dp, 760.dp), modifier.fillMaxSize().background(c.paper)) { size ->
        DotPattern()
        // Wide panels keep a readable line length instead of stretching chat across the room.
        Column(
            Modifier.fillMaxHeight().widthIn(max = 760.dp).fillMaxWidth().align(Alignment.TopCenter)
                .padding(horizontal = if (size.compactWidth) 16.dp else 28.dp, vertical = if (size.compactHeight) 12.dp else 28.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(painterResource(R.drawable.ic_sparkle), null, Modifier.size(20.dp), tint = c.ink)
                Text(
                    "Ask Tundra",
                    style = if (size.compactWidth || size.compactHeight) MaterialTheme.typography.titleMedium else MaterialTheme.typography.headlineSmall,
                    color = c.ink,
                    modifier = Modifier.padding(start = 10.dp),
                )
                Spacer(Modifier.weight(1f))
                if (onClose != null) IconCircle(R.drawable.ic_close, "Close", onClose, size = if (size.compactHeight) 36.dp else 44.dp)
            }
            if (!size.compactHeight) {
                MonoLabel(
                    state.device?.let { "Context · ${it.assetTag} · CMMS · Manual · Fleet" } ?: "Context · waiting for device",
                    Modifier.padding(top = 4.dp),
                    small = true,
                )
            }
            Spacer(Modifier.height(if (size.compactHeight) 8.dp else 20.dp))

            val listState = rememberLazyListState()
            LaunchedEffect(state.chat.size, state.chat.lastOrNull()?.text?.length) {
                if (state.chat.isNotEmpty()) listState.animateScrollToItem(state.chat.lastIndex)
            }
            if (state.chat.isEmpty()) {
                Suggestions(suggestionsFor(state.device?.id), onAsk, size, Modifier.weight(1f))
            } else {
                LazyColumn(
                    Modifier.weight(1f).fillMaxWidth(),
                    state = listState,
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    items(state.chat, key = { it.id }) { Message(it, onSource, size) }
                }
            }
            Spacer(Modifier.height(if (size.compactHeight) 8.dp else 16.dp))
            InputBar(state, onDraftChange, onSend, onMic)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Suggestions(suggestions: List<String>, onAsk: (String) -> Unit, size: PanelSize, modifier: Modifier) {
    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.Bottom) {
        if (size.compactHeight) {
            // Short panel: one swipeable row of suggestions.
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(suggestions) { Chip(it, onClick = { onAsk(it) }) }
            }
            return@Column
        }
        Text(
            "Ask anything about this device. Answers come from your CMMS history, the OEM manual and the rest of your fleet.",
            style = if (size.compactWidth) MaterialTheme.typography.bodyMedium else MaterialTheme.typography.bodyLarge,
            color = Tundra.colors.inkMuted,
        )
        Spacer(Modifier.height(18.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            suggestions.forEach { Chip(it, onClick = { onAsk(it) }) }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Message(m: ChatMessage, onSource: (Source) -> Unit, size: PanelSize) {
    val c = Tundra.colors
    if (m.fromUser) {
        Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
            Text(
                m.text,
                style = MaterialTheme.typography.bodyLarge,
                color = c.inkInverse,
                modifier = Modifier.widthIn(max = (size.width * 0.8f).coerceAtMost(520.dp)).clip(RoundedCornerShape(18.dp, 18.dp, 4.dp, 18.dp)).background(c.ink).padding(horizontal = 18.dp, vertical = 12.dp),
            )
        }
    } else {
        Column(
            Modifier.fillMaxWidth().clip(PanelShape).background(c.raised).border(1.dp, c.border, PanelShape)
                .padding(if (size.compactWidth) 14.dp else 20.dp).animateContentSize(),
        ) {
            MonoLabel(if (m.streaming) "Tundra · thinking" else "Tundra", small = true)
            if (m.text.isEmpty()) {
                Waveform(Modifier.padding(top = 10.dp), color = c.inkMuted)
            } else {
                Text(m.text, style = MaterialTheme.typography.bodyLarge, color = c.ink, modifier = Modifier.padding(top = 6.dp))
            }
            if (m.sources.isNotEmpty()) {
                Spacer(Modifier.height(14.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    m.sources.forEach { s ->
                        Chip(
                            s.label,
                            prefix = s.kind.label,
                            onClick = s.manualTarget?.let { { onSource(s) } },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InputBar(state: SessionState, onDraftChange: (String) -> Unit, onSend: () -> Unit, onMic: () -> Unit) {
    val c = Tundra.colors
    val listening = state.listeningFor == VoiceTarget.Ask
    Row(
        Modifier.fillMaxWidth().heightIn(min = 64.dp).clip(CircleShape).background(c.raised).border(1.dp, if (listening) c.ink else c.border, CircleShape).padding(start = 24.dp, end = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.weight(1f).padding(vertical = 14.dp)) {
            if (listening) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Waveform()
                    Text(
                        state.liveTranscript.ifEmpty { "Listening…" },
                        style = MaterialTheme.typography.bodyLarge,
                        color = c.ink,
                        modifier = Modifier.padding(start = 14.dp),
                        maxLines = 2,
                    )
                }
            } else {
                if (state.askDraft.isEmpty()) {
                    val error = state.voiceError
                    Text(
                        error ?: "Ask about this device",
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (error != null) c.record else c.inkMuted,
                        maxLines = 1,
                    )
                }
                BasicTextField(
                    value = state.askDraft,
                    onValueChange = onDraftChange,
                    textStyle = MaterialTheme.typography.bodyLarge.copy(color = c.ink),
                    cursorBrush = SolidColor(c.ink),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { onSend() }),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
        IconCircle(R.drawable.ic_mic, if (listening) "Stop listening" else "Ask by voice", onMic, selected = listening, size = 52.dp)
        if (state.askDraft.isNotBlank() && !listening) {
            Box(
                Modifier.padding(start = 4.dp).size(52.dp).clip(CircleShape).background(c.ink).clickable(onClick = onSend),
                contentAlignment = Alignment.Center,
            ) {
                Icon(painterResource(R.drawable.ic_arrow_up), "Send", Modifier.size(22.dp), tint = c.inkInverse)
            }
        }
    }
}
