package com.tundra.tundraxr.ui.components

import androidx.compose.animation.animateContentSize
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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.ui.theme.Tundra

/**
 * One turn of the conversation, after the design system's `DeviceMessage`: the person's
 * question on the page tone, the agent's answer on a card with its citations underneath.
 * [maxLines] truncates the answer where only a glance fits (the island).
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ChatBubble(
    m: ChatMessage,
    onSource: (Source) -> Unit,
    modifier: Modifier = Modifier,
    maxWidth: Dp = 520.dp,
    compact: Boolean = false,
    maxLines: Int = Int.MAX_VALUE,
) {
    val c = Tundra.colors
    if (m.fromUser) {
        Box(modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
            Text(
                m.text,
                style = MaterialTheme.typography.bodyLarge,
                color = c.ink,
                maxLines = maxLines,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.widthIn(max = maxWidth).clip(CardShape).background(c.paper)
                    .border(1.dp, c.borderControl, CardShape).padding(horizontal = 16.dp, vertical = 12.dp),
            )
        }
    } else {
        Column(
            modifier.fillMaxWidth().clip(CardShape).background(c.raised).border(1.dp, c.border, CardShape)
                .padding(if (compact) 14.dp else 20.dp).animateContentSize(),
        ) {
            MonoLabel(if (m.streaming) "Tundra · thinking" else "Tundra", color = if (m.streaming) c.accent else c.inkMuted, small = true)
            if (m.text.isEmpty()) {
                Waveform(Modifier.padding(top = 10.dp), color = c.accentDot)
            } else {
                Text(
                    m.text,
                    style = MaterialTheme.typography.bodyLarge,
                    color = c.ink,
                    maxLines = maxLines,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(top = 6.dp),
                )
            }
            if (m.sources.isNotEmpty()) {
                Spacer(Modifier.height(if (compact) 8.dp else 14.dp))
                // Every agent answer carries its citations (the design system's DeviceMessage).
                FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    m.sources.forEach { s ->
                        CitationChip("${s.kind.label} · ${s.label}", onClick = s.manualTarget?.let { { onSource(s) } })
                    }
                }
            }
        }
    }
}

/**
 * The question field, after the design system's `Input`: control radius, card fill, and a
 * cobalt edge while the agent listens. Mic always; send once there is something to send.
 */
@Composable
fun AskInput(
    draft: String,
    listening: Boolean,
    liveTranscript: String,
    voiceError: String?,
    onDraftChange: (String) -> Unit,
    onSend: () -> Unit,
    onMic: () -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Ask about this device",
) {
    val c = Tundra.colors
    Row(
        modifier.fillMaxWidth().heightIn(min = 64.dp).clip(ControlShape).background(c.raised)
            .border(1.dp, if (listening) c.accentDot else c.borderControl, ControlShape).padding(start = 20.dp, end = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.weight(1f).padding(vertical = 14.dp)) {
            if (listening) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Waveform(color = c.accentDot)
                    Text(
                        liveTranscript.ifEmpty { "Listening…" },
                        style = MaterialTheme.typography.bodyLarge,
                        color = c.ink,
                        modifier = Modifier.padding(start = 14.dp),
                        maxLines = 2,
                    )
                }
            } else {
                if (draft.isEmpty()) {
                    Text(
                        voiceError ?: placeholder,
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (voiceError != null) c.downFg else c.inkMuted,
                        maxLines = 1,
                    )
                }
                BasicTextField(
                    value = draft,
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
        IconCircle(R.drawable.ic_mic, if (listening) "Stop listening" else "Ask by voice", onMic, selected = listening, size = 56.dp, accent = true)
        if (draft.isNotBlank() && !listening) {
            Box(
                Modifier.padding(start = 4.dp).size(56.dp).clip(ControlShape).background(c.primary).clickable(onClick = onSend),
                contentAlignment = Alignment.Center,
            ) {
                Icon(painterResource(R.drawable.ic_arrow_up), "Send", Modifier.size(22.dp), tint = c.inkInverse)
            }
        }
    }
}
