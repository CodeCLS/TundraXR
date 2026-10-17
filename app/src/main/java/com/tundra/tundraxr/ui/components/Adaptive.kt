package com.tundra.tundraxr.ui.components

import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import kotlin.math.min

/** The space a panel actually has, after scaling. Layouts branch on these, not on the device. */
@Immutable
data class PanelSize(val width: Dp, val height: Dp) {
    val compactWidth get() = width < 520.dp
    val compactHeight get() = height < 480.dp
    /** Landscape strip: worth laying content out side by side. */
    val wide get() = width >= 960.dp && width > height * 1.45f
    val tall get() = height > width * 1.6f
}

val LocalPanelSize = staticCompositionLocalOf { PanelSize(880.dp, 760.dp) }

/** Renders [content] at [scale]× its normal size (used to keep orbiters in step with their panel). */
@Composable
fun Scaled(scale: Float, content: @Composable () -> Unit) {
    val density = LocalDensity.current
    CompositionLocalProvider(LocalDensity provides Density(density.density * scale, density.fontScale), content = content)
}

/**
 * Measures the panel and adapts it to its size. Panels in XR are freely resizable, so:
 * - bigger than [reference] in both directions → everything scales up (up to 2.4×, the largest
 *   panel we allow), so a big panel reads like a bigger screen instead of an emptier one;
 * - much smaller → a slight scale-down (to 0.85×, unless [allowShrink] is off), and the layouts
 *   switch to compact forms;
 * - in between → 1×, and [content] reflows using [PanelSize].
 */
@Composable
fun AdaptivePanel(
    reference: DpSize,
    modifier: Modifier = Modifier,
    /** Reports the scale, so things outside the panel (e.g. its orbiter) can match it. */
    onScale: ((Float) -> Unit)? = null,
    allowShrink: Boolean = true,
    content: @Composable BoxScope.(PanelSize) -> Unit,
) {
    BoxWithConstraints(modifier) {
        val ratio = min(maxWidth / reference.width, maxHeight / reference.height)
        val scale = when {
            ratio > 1f -> ratio.coerceAtMost(2.4f)
            ratio < 0.6f && allowShrink -> (ratio / 0.6f).coerceIn(0.85f, 1f)
            else -> 1f
        }
        if (onScale != null) SideEffect { onScale(scale) }
        val density = LocalDensity.current
        CompositionLocalProvider(LocalDensity provides Density(density.density * scale, density.fontScale)) {
            val size = PanelSize(maxWidth / scale, maxHeight / scale)
            CompositionLocalProvider(LocalPanelSize provides size) { content(size) }
        }
    }
}
