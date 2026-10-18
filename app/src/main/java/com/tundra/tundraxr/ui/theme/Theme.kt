package com.tundra.tundraxr.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable

/** Light only: the Tundra design system defines no dark theme. */
@Composable
fun TundraXRTheme(content: @Composable () -> Unit) {
    // No dynamic color: the brand palette is the point.
    val t = LightTundraColors
    val scheme = lightColorScheme(
        primary = t.primary, onPrimary = t.inkInverse,
        secondary = t.muted, onSecondary = t.ink,
        tertiary = t.accent, onTertiary = t.raised,
        background = t.paper, onBackground = t.ink,
        surface = t.paper, onSurface = t.ink,
        surfaceVariant = t.muted, onSurfaceVariant = t.inkMuted,
        surfaceContainer = t.raised, outline = t.borderControl, outlineVariant = t.border,
        error = t.downDot, onError = t.inkInverse,
    )
    CompositionLocalProvider(LocalTundraColors provides t) {
        MaterialTheme(colorScheme = scheme, typography = Typography, content = content)
    }
}

object Tundra {
    val colors: TundraColors
        @Composable @ReadOnlyComposable
        get() = LocalTundraColors.current
}
