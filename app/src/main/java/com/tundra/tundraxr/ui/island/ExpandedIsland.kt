package com.tundra.tundraxr.ui.island

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.ui.components.AskInput
import com.tundra.tundraxr.ui.components.ChatBubble
import com.tundra.tundraxr.ui.components.ControlShape
import com.tundra.tundraxr.ui.components.Hairline
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.MonoText
import com.tundra.tundraxr.ui.components.StatusDot
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens

/** Width of the open island. Wide enough for six labelled actions, narrow enough to stay a panel. */
val ExpandedIslandWidth = 520.dp

/**
 * State 2. A floating control panel, not a dashboard: header, quick actions, the latest answer
 * and ONE card chosen by [card], then the question field. Anything longer opens in the focused
 * panel.
 */
@Composable
fun ExpandedIsland(model: IslandModel, actions: IslandActions, modifier: Modifier = Modifier) {
    Column(modifier.width(ExpandedIslandWidth).padding(20.dp)) {
        Header(model, actions)
        DeviceRow(model, actions)
        Spacer(Modifier.height(12.dp))
        Hairline(Modifier.fillMaxWidth())
        IslandActionBar(model, actions, Modifier.padding(vertical = 12.dp))
        Hairline(Modifier.fillMaxWidth())

        val latest = model.latest
        val card = model.card()
        if (latest != null) {
            Row(Modifier.padding(top = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                MonoLabel("Latest", Modifier.weight(1f), small = true)
                IconCircle(R.drawable.ic_open, "Open conversation", actions.openChat, size = XrTokens.TargetMin)
            }
            // A card underneath usually expands on the answer (the brain quotes the manual), so the
            // answer gives up room to it; the whole answer is one tap away in the conversation.
            ChatBubble(latest, actions.source, compact = true, maxLines = if (card != null) 2 else 4)
        }
        if (card != null) {
            Spacer(Modifier.height(12.dp))
            AnimatedContent(
                card,
                transitionSpec = { fadeIn(tween(Motion.Base, easing = Motion.EaseStandard)) togetherWith fadeOut(tween(Motion.Fast)) },
                contentKey = { it::class },
                label = "card",
            ) { k ->
                when (k) {
                    is IslandCard.Progress -> ProgressCard(k.calls, onOpen = actions.openSession)
                    is IslandCard.Guide -> RepairGuidanceCard(k.guidance, onOpen = { actions.openGuidance(k.guidance) })
                    is IslandCard.Image -> ImagePreview(k.image, onOpen = { actions.openImage(k.image) })
                    is IslandCard.Suggest -> SuggestionsCard(k.suggestions, actions.ask)
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        AskInput(
            draft = model.draft,
            listening = model.listeningForAsk,
            liveTranscript = model.liveTranscript,
            voiceError = model.voiceError,
            onDraftChange = actions.draft,
            onSend = actions.send,
            onMic = actions.askVoice,
        )
    }
}

@Composable
private fun Header(model: IslandModel, actions: IslandActions) {
    val c = Tundra.colors
    Row(verticalAlignment = Alignment.CenterVertically) {
        AIStatusIndicator(model.ai)
        Column(Modifier.weight(1f).padding(start = 12.dp)) {
            Text("AI Repair Copilot", style = MaterialTheme.typography.titleMedium, color = c.ink)
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                val (dot, text) = when (model.online) {
                    true -> c.okDot to "Laptop brain"
                    false -> c.downDot to "Offline"
                    null -> c.ring to "Connecting"
                }
                StatusDot(dot)
                MonoLabel(text, Modifier.padding(start = 6.dp), small = true)
                MonoLabel(" · ", small = true)
                MonoLabel(
                    model.ai.label,
                    color = when (model.ai) {
                        AiState.Idle -> c.inkMuted
                        AiState.Error -> c.downFg
                        else -> c.accent
                    },
                    small = true,
                )
            }
        }
        val switch = actions.switchSpace
        if (switch != null) {
            IconCircle(
                if (actions.switchToFull) R.drawable.ic_full_space_switch else R.drawable.ic_home_space_switch,
                if (actions.switchToFull) "Switch to Full Space" else "Switch to Home Space",
                switch,
                size = XrTokens.TargetMin,
            )
        }
        IconCircle(R.drawable.ic_chevron_up, "Collapse", actions.collapse, size = XrTokens.TargetMin)
    }
}

/**
 * The device this session documents. Identification is simulated, so tapping it lets the
 * engineer correct it; the capture count opens the whole session.
 */
@Composable
private fun DeviceRow(model: IslandModel, actions: IslandActions) {
    val c = Tundra.colors
    var picking by remember { mutableStateOf(false) }
    val canPick = model.devices.size > 1
    Row(Modifier.padding(top = 10.dp).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.weight(1f)) {
            Row(
                Modifier.heightIn(min = XrTokens.TargetMin).clip(ControlShape)
                    .then(if (canPick) Modifier.clickable { picking = true } else Modifier)
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    model.deviceName ?: "Identifying device…",
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (model.deviceName != null) c.ink else c.inkMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false),
                )
                if (model.assetTag != null) MonoText(model.assetTag, Modifier.padding(start = 10.dp), color = c.inkMuted, small = true)
                if (canPick) Icon(painterResource(R.drawable.ic_chevron_down), "Change device", Modifier.padding(start = 6.dp).size(20.dp), tint = c.inkMuted)
            }
            DropdownMenu(picking, onDismissRequest = { picking = false }, containerColor = c.raised, modifier = Modifier.widthIn(min = 300.dp)) {
                model.devices.forEach { d ->
                    DropdownMenuItem(
                        text = {
                            Column(Modifier.padding(vertical = 6.dp)) {
                                Text(d.name, style = MaterialTheme.typography.bodyLarge, color = c.ink)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    MonoLabel(d.category, small = true)
                                    MonoText(d.assetTag, Modifier.padding(start = 8.dp), color = c.inkMuted, small = true)
                                }
                            }
                        },
                        onClick = { picking = false; if (d.id != model.deviceId) actions.selectDevice(d) },
                    )
                }
            }
        }
        if (model.captureCount > 0) {
            Row(
                Modifier.heightIn(min = XrTokens.TargetMin).clip(ControlShape).clickable(onClick = actions.openSession).padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                MonoText(model.captureCount.toString(), color = c.ink, small = true)
                MonoLabel(if (model.captureCount == 1) "capture" else "captures", Modifier.padding(start = 6.dp), small = true)
            }
        }
    }
}
