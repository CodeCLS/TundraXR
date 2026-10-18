package com.tundra.tundraxr.ui.island

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.ui.components.ControlShape
import com.tundra.tundraxr.ui.components.Waveform
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.Tundra

/**
 * The agent's state as one glyph. Cobalt is the agent's colour in the design system; rust is
 * reserved for errors. Changes are fades only, per the system's motion rules.
 */
@Composable
fun AIStatusIndicator(state: AiState, modifier: Modifier = Modifier, size: Dp = 40.dp) {
    val c = Tundra.colors
    val (fill, edge) = when (state) {
        AiState.Idle -> Color.Transparent to null
        AiState.Listening, AiState.Thinking, AiState.Speaking -> c.accentSurface to c.accentBorder
        AiState.Error -> c.downBg to c.downDot.copy(alpha = 0.24f)
    }
    Box(
        modifier
            .size(size)
            .clip(ControlShape)
            .background(fill)
            .then(if (edge != null) Modifier.border(1.dp, edge, ControlShape) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        AnimatedContent(
            state,
            transitionSpec = { fadeIn(tween(Motion.Fast, easing = Motion.EaseStandard)) togetherWith fadeOut(tween(Motion.Fast)) },
            label = "ai",
        ) { s ->
            when (s) {
                AiState.Listening -> Waveform(color = c.accentDot, bars = 4)
                AiState.Thinking -> {
                    val t = rememberInfiniteTransition(label = "think")
                    val a by t.animateFloat(1f, 0.35f, infiniteRepeatable(tween(700, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "a")
                    Icon(painterResource(R.drawable.ic_sparkle), null, Modifier.size(22.dp).alpha(a), tint = c.accent)
                }
                AiState.Error -> Icon(painterResource(R.drawable.ic_alert), null, Modifier.size(22.dp), tint = c.downFg)
                AiState.Idle, AiState.Speaking -> Icon(painterResource(R.drawable.ic_sparkle), null, Modifier.size(22.dp), tint = c.accent)
            }
        }
    }
}
