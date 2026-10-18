package com.tundra.tundraxr.ui.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.ui.unit.dp

// Non-colour tokens from the Tundra design system, at their web values (1px = 1dp).
// Layouts in XR multiply them by XrTokens.Scale; see XrTokens.kt.

/** `tokens/radius.css` */
object Radius {
    val xs = 4.dp      // checkboxes, citation chips
    val sm = 6.dp
    val md = 8.dp      // all controls
    val lg = 12.dp     // cards, message bubbles
    val xl = 16.dp     // modals, floating panels
    val xxl = 24.dp    // large brand blocks
}

/** `tokens/spacing.css`: 4dp base. */
object Space {
    val s1 = 4.dp
    val s2 = 8.dp
    val s3 = 12.dp
    val s4 = 16.dp
    val s5 = 20.dp
    val s6 = 24.dp
    val s8 = 32.dp
    val s10 = 40.dp
    val s12 = 48.dp
}

/** `tokens/motion.css`: fades, 1–4px slides and colour changes. No bounce, no spring. */
object Motion {
    const val Instant = 80
    const val Fast = 140
    const val Base = 200
    const val Slow = 340
    val EaseStandard = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    val EaseOut = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
    val EaseIn = CubicBezierEasing(0.4f, 0f, 1f, 1f)
}
