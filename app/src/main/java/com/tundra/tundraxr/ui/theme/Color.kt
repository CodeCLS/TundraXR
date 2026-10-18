package com.tundra.tundraxr.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Values from the Tundra Health Design System (`Tundra Health Design System/tokens/colors.css`).
// The CSS token each field resolves to is noted beside it. Nothing in Tundra is black: the
// darkest text is stone-800, and filled surfaces stop at stone-600.
@Immutable
data class TundraColors(
    val paper: Color,          // --bg-page (paper-100)
    val raised: Color,         // --surface-card (paper-050)
    val muted: Color,          // --surface-sunken (paper-200)
    val header: Color,         // --surface-header
    val border: Color,         // --border-hairline (line-100): card and row edges
    val borderControl: Color,  // --border-default (line-200): controls
    val borderStrong: Color,   // --border-strong (line-300)
    val ring: Color,           // --ink-400: dots, rules, inactive marks. Decoration only, never text
    val ink: Color,            // --text-body (stone-800)
    val inkMuted: Color,       // --text-secondary (ink-500): the lightest legible text
    val inkInverse: Color,     // --cream-050: text on primary fills
    val primary: Color,        // --surface-primary (stone-600): one filled control per view
    val primaryHover: Color,   // --surface-primary-hover (stone-500)
    val primaryPressed: Color, // --surface-primary-active (stone-700)
    val hover: Color,          // --surface-hover
    val pressed: Color,        // --surface-active
    val accent: Color,         // --text-accent (cobalt-700): everything the agent does
    val accentDot: Color,      // --cobalt-500: focus border, agent status dot
    val accentSurface: Color,  // --surface-accent (cobalt-050)
    val accentBorder: Color,   // --border-accent (cobalt-200)
    val accentInk: Color,      // --cobalt-900: citation text
    val okFg: Color,           // --status-ok-fg (moss-700)
    val okBg: Color,           // --status-ok-bg (moss-050)
    val okDot: Color,          // --moss-500
    val warnFg: Color,         // --status-warn-fg (amber-700)
    val warnBg: Color,         // --status-warn-bg (amber-050)
    val warnDot: Color,        // --amber-500
    val downFg: Color,         // --status-down-fg (rust-700)
    val downBg: Color,         // --status-down-bg (rust-050)
    val downDot: Color,        // --rust-500
    val record: Color,         // --rust-500: recording, offline, failed
    val synced: Color,         // --status-ok-fg (moss-700): stored in the brain
    val highlight: Color,      // --amber-050: manual passage the brain pointed at
    val dot: Color,            // --dot-color-soft: the dotted survey grid
)

val LightTundraColors = TundraColors(
    paper = Color(0xFFF4F2EA),
    raised = Color(0xFFFCFBF7),
    muted = Color(0xFFEBE8DE),
    header = Color(0xFFF7F4EA),
    border = Color(0xFFE8E4D8),
    borderControl = Color(0xFFDBD6C6),
    borderStrong = Color(0xFFC7C1AE),
    ring = Color(0xFF94948C),
    ink = Color(0xFF35342E),
    inkMuted = Color(0xFF696963),
    inkInverse = Color(0xFFFAF7EC),
    primary = Color(0xFF55524A),
    primaryHover = Color(0xFF635F55),
    primaryPressed = Color(0xFF46443D),
    hover = Color(0x0D55524A),
    pressed = Color(0x1655524A),
    accent = Color(0xFF42527C),
    accentDot = Color(0xFF5A6E9E),
    accentSurface = Color(0xFFEDF1F9),
    accentBorder = Color(0xFFC4D0E8),
    accentInk = Color(0xFF2A3452),
    okFg = Color(0xFF37573F),
    okBg = Color(0xFFE9F1EA),
    okDot = Color(0xFF4F7A5C),
    warnFg = Color(0xFF835C1D),
    warnBg = Color(0xFFF9EFD8),
    warnDot = Color(0xFFB07F2E),
    downFg = Color(0xFF7F3B28),
    downBg = Color(0xFFF8E9E2),
    downDot = Color(0xFFA9563E),
    record = Color(0xFFA9563E),
    synced = Color(0xFF37573F),
    highlight = Color(0xFFF9EFD8),
    dot = Color(0x0E0F1113),
)

val LocalTundraColors = staticCompositionLocalOf { LightTundraColors }
