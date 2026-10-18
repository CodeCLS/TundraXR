package com.tundra.tundraxr.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.tundra.tundraxr.R

// geist.ttf is the variable font; each weight picks its point on the wght axis.
@OptIn(ExperimentalTextApi::class)
private fun geist(weight: FontWeight) =
    Font(R.font.geist, weight, variationSettings = FontVariation.Settings(FontVariation.weight(weight.weight)))

/** Geist for everything (`tokens/typography.css` --font-sans). */
val Geist = FontFamily(geist(FontWeight.Normal), geist(FontWeight.Medium), geist(FontWeight.SemiBold))

/** Geist Mono for anything countable (--font-mono). */
val GeistMono = FontFamily(Font(R.font.geist_mono, FontWeight.Normal))

// The design system's web scale (`tokens/typography.css`) × XrTokens.Scale (1.2), because XR
// panels are read at arm's length. Headings are medium, never bold; display sizes are
// negatively tracked. The CSS token each style comes from is noted beside it.
val Typography = Typography(
    displaySmall = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 38.sp, lineHeight = 43.sp, letterSpacing = (-0.024).em),   // --text-title-1 32
    headlineMedium = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 29.sp, lineHeight = 35.sp, letterSpacing = (-0.018).em), // --text-title-2 24
    headlineSmall = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 23.sp, lineHeight = 30.sp, letterSpacing = (-0.012).em),  // --text-title-3 19
    titleMedium = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 20.sp, lineHeight = 26.sp, letterSpacing = (-0.008).em),    // --text-body-lg 17, medium
    bodyLarge = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Normal, fontSize = 18.sp, lineHeight = 29.sp, letterSpacing = (-0.006).em),      // --text-size-body 15
    bodyMedium = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 25.sp, letterSpacing = (-0.003).em),     // --text-body-sm 13.5
    bodySmall = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Normal, fontSize = 14.5.sp, lineHeight = 20.sp),                                 // --text-caption 12
    labelLarge = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 17.sp, lineHeight = 20.sp, letterSpacing = (-0.008).em),     // Button md 14
    // Uppercase micro-labels: sans medium with wide tracking, in --text-secondary.
    labelMedium = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 13.sp, lineHeight = 16.sp, letterSpacing = 0.09.em),        // --text-label 11
    labelSmall = TextStyle(fontFamily = Geist, fontWeight = FontWeight.Medium, fontSize = 12.5.sp, lineHeight = 15.sp, letterSpacing = 0.085.em),      // micro-label 10.5
)

/** Numbers, ids and provenance lines (--text-mono 13). */
val MonoStyle = TextStyle(fontFamily = GeistMono, fontSize = 15.5.sp, lineHeight = 23.sp, letterSpacing = (-0.01).em)

/** Small numbers, citations and timestamps (--text-mono-sm 11.5). */
val MonoSmallStyle = TextStyle(fontFamily = GeistMono, fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.005.em)
