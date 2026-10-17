package com.tundra.tundraxr.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Tokens taken from tundrahealth.ai (background #f2f1e8, ink #2b2b2b, ...).
@Immutable
data class TundraColors(
    val paper: Color,      // panel background
    val raised: Color,     // cards, manual pages
    val muted: Color,      // chips, secondary fills
    val border: Color,
    val ring: Color,       // dot pattern, focus
    val ink: Color,
    val inkMuted: Color,
    val inkInverse: Color,
    val record: Color,
    val synced: Color,
    val highlight: Color,  // manual passage the brain pointed at
)

val LightTundraColors = TundraColors(
    paper = Color(0xFFF2F1E8),
    raised = Color(0xFFFAF9F4),
    muted = Color(0xFFE9E7DB),
    border = Color(0xFFDCD9CB),
    ring = Color(0xFFB8B5A6),
    ink = Color(0xFF2B2B2B),
    inkMuted = Color(0xFF6B6A60),
    inkInverse = Color(0xFFF2F1E8),
    record = Color(0xFFE40014),
    synced = Color(0xFF3F7A4E),
    highlight = Color(0xFFF1E3B0),
)

val DarkTundraColors = TundraColors(
    paper = Color(0xFF1D1D1B),
    raised = Color(0xFF262624),
    muted = Color(0xFF302F2C),
    border = Color(0xFF3B3A36),
    ring = Color(0xFF55534C),
    ink = Color(0xFFEDEBE2),
    inkMuted = Color(0xFF9D9B90),
    inkInverse = Color(0xFF1D1D1B),
    record = Color(0xFFFF4A4A),
    synced = Color(0xFF7BC18C),
    highlight = Color(0xFF4A4128),
)

val LocalTundraColors = staticCompositionLocalOf { LightTundraColors }
