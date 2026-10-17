package com.tundra.tundraxr.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable

@Composable
fun TundraXRTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    // No dynamic color: the brand palette is the point.
    val t = if (darkTheme) DarkTundraColors else LightTundraColors
    val scheme = if (darkTheme) {
        darkColorScheme(
            primary = t.ink, onPrimary = t.inkInverse,
            secondary = t.muted, onSecondary = t.ink,
            background = t.paper, onBackground = t.ink,
            surface = t.paper, onSurface = t.ink,
            surfaceVariant = t.muted, onSurfaceVariant = t.inkMuted,
            surfaceContainer = t.raised, outline = t.border, outlineVariant = t.border,
            error = t.record,
        )
    } else {
        lightColorScheme(
            primary = t.ink, onPrimary = t.inkInverse,
            secondary = t.muted, onSecondary = t.ink,
            background = t.paper, onBackground = t.ink,
            surface = t.paper, onSurface = t.ink,
            surfaceVariant = t.muted, onSurfaceVariant = t.inkMuted,
            surfaceContainer = t.raised, outline = t.border, outlineVariant = t.border,
            error = t.record,
        )
    }
    CompositionLocalProvider(LocalTundraColors provides t) {
        MaterialTheme(colorScheme = scheme, typography = Typography, content = content)
    }
}

object Tundra {
    val colors: TundraColors
        @Composable @ReadOnlyComposable
        get() = LocalTundraColors.current
}
