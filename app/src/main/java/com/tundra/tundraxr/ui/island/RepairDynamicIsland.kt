package com.tundra.tundraxr.ui.island

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.SizeTransform
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.ui.capture.PhotoFlash
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens

/**
 * The island: one translucent surface that morphs between the compact capsule and the open
 * panel. Focused mode keeps it open; the focused panel itself is a separate surface.
 *
 * Motion is the design system's: the size change takes --dur-slow on --ease-out (no spring,
 * no overshoot), and the content cross-fades on --dur-fast once the surface is mostly there.
 */
@Composable
fun RepairDynamicIsland(
    model: IslandModel,
    mode: PanelMode,
    actions: IslandActions,
    modifier: Modifier = Modifier,
    /** Changes on every shutter press; flashes the surface as feedback. */
    photoFlash: Long = 0L,
) {
    val c = Tundra.colors
    val compact = mode == PanelMode.Compact
    // Half the capsule's height reads as a pill; the open panel takes --radius-xl at XR scale.
    val radius by animateDpAsState(
        if (compact) (XrTokens.TargetMin + 16.dp) / 2 else XrTokens.IslandRadiusExpanded,
        tween(XrTokens.MorphDuration, easing = Motion.EaseOut),
        label = "radius",
    )
    val shape = RoundedCornerShape(radius)
    Box(
        modifier
            .clip(shape)
            .background(c.raised.copy(alpha = XrTokens.IslandSurfaceAlpha))
            .border(1.dp, c.borderControl, shape),
    ) {
        AnimatedContent(
            compact,
            transitionSpec = {
                val inDelay = XrTokens.MorphDuration / 2
                (fadeIn(tween(Motion.Fast, delayMillis = inDelay, easing = Motion.EaseStandard)) togetherWith
                    fadeOut(tween(Motion.Instant))) using
                    SizeTransform(clip = true) { _, _ -> tween(XrTokens.MorphDuration, easing = Motion.EaseOut) }
            },
            label = "island",
        ) { isCompact ->
            if (isCompact) {
                val source = remember { MutableInteractionSource() }
                CompactIsland(model, actions, Modifier.clickable(source, indication = null, onClick = actions.expand))
            } else {
                ExpandedIsland(model, actions)
            }
        }
        PhotoFlash(photoFlash, Modifier.matchParentSize())
    }
}
