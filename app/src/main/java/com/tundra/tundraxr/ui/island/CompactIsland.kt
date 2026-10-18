package com.tundra.tundraxr.ui.island

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.MonoText
import com.tundra.tundraxr.ui.components.StatusDot
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens

/** Width of the resting capsule: room for the glyph, one status line and two targets. */
val CompactIslandWidth = 400.dp

/**
 * State 1. The resting capsule: the agent's state, the one thing that matters right now, the
 * mic for a spoken question, and the way in. Tapping anywhere else on it also expands it
 * (handled by [RepairDynamicIsland]).
 */
@Composable
fun CompactIsland(model: IslandModel, actions: IslandActions, modifier: Modifier = Modifier) {
    val c = Tundra.colors
    Row(
        modifier.width(CompactIslandWidth).height(XrTokens.TargetMin + 16.dp).padding(start = 12.dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AIStatusIndicator(model.ai)
        val line = model.statusLine()
        AnimatedContent(
            line,
            transitionSpec = { fadeIn(tween(Motion.Fast, easing = Motion.EaseStandard)) togetherWith fadeOut(tween(Motion.Fast)) },
            contentKey = { it.text to it.tone },
            label = "status",
            modifier = Modifier.weight(1f).padding(horizontal = 12.dp),
        ) { l ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (model.recordingSec != null) StatusDot(c.record, pulsing = true, modifier = Modifier.padding(end = 8.dp))
                Text(
                    l.text,
                    style = MaterialTheme.typography.bodyMedium,
                    color = when (l.tone) {
                        StatusTone.Normal -> c.ink
                        StatusTone.Agent -> c.accent
                        StatusTone.Alert -> c.downFg
                    },
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false),
                )
                if (l.figure != null) MonoText(l.figure, Modifier.padding(start = 8.dp), color = c.inkMuted, small = true)
            }
        }
        IconCircle(
            R.drawable.ic_mic,
            if (model.listeningForAsk) "Stop listening" else "Ask by voice",
            actions.askVoice,
            selected = model.listeningForAsk,
            size = XrTokens.TargetMin,
            accent = true,
        )
        IconCircle(R.drawable.ic_chevron_down, "Expand", actions.expand, size = XrTokens.TargetMin)
    }
}
