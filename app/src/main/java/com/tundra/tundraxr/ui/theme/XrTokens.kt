package com.tundra.tundraxr.ui.theme

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * XR-specific extension to the Tundra design system. Kept apart from it on purpose: each
 * value exists only where the web system's rule would hurt legibility or reach in a headset.
 * Colours, type families, status colours and icon style are NOT extended; they come from
 * the design system unchanged.
 */
object XrTokens {
    /**
     * The design system is specified for a desktop browser; XR panels are read at arm's
     * length. Type, radii and spacing are the web values × this factor (the app already
     * read its scale about one step up, e.g. 16sp body for the system's 13.5px).
     */
    const val Scale = 1.2f

    /**
     * Gaze-and-pinch targets. The system's 32–40px controls suit a mouse; Android XR needs
     * at least 48dp, and 56dp for the primary actions.
     */
    val TargetMin = 48.dp
    val TargetPrimary = 56.dp

    /**
     * Island surface opacity over passthrough. The system allows translucency only for its
     * sticky header (82% plus a 10px blur). Compose for XR has no dependable backdrop blur, so
     * without it 82% puts text over a busy real-world background; 94% keeps a hint of
     * see-through while --text-secondary stays legible. Check on device in varied light.
     */
    const val IslandSurfaceAlpha = 0.94f

    /**
     * The island changes area far more than any web control, so it uses the system's slowest
     * duration (--dur-slow 340ms) with its --ease-out curve. Still no spring and no overshoot.
     */
    const val MorphDuration = Motion.Slow

    /** Capsule radius for the compact island (the system's pill radius). */
    val IslandRadiusCompact: Dp = 999.dp

    /** --radius-xl (floating panels) × Scale. */
    val IslandRadiusExpanded: Dp = 20.dp

    /** --radius-2xl × Scale, for the focused panel. */
    val FocusedPanelRadius: Dp = 28.dp

    /**
     * How far the island sits above eye level in Full Space (positive y is up). 280dp put the
     * small capsule above the field of view on the Galaxy XR, leaving only the environment in
     * front, so it starts at eye level; raise it on the headset once it's confirmed in view.
     */
    val IslandLift: Dp = 0.dp

    /** Shadows don't read on spatial panels; floating layers sit forward in depth instead. */
    val FloatingDepth: Dp = 24.dp
}

/** A design system dimension at XR size. */
fun Dp.xr(): Dp = this * XrTokens.Scale
