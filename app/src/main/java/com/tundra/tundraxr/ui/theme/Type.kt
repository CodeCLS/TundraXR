package com.tundra.tundraxr.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.tundra.tundraxr.R

val Lato = FontFamily(
    Font(R.font.lato_light, FontWeight.Light),
    Font(R.font.lato_regular, FontWeight.Normal),
    Font(R.font.lato_bold, FontWeight.Bold),
)

val GeistMono = FontFamily(Font(R.font.geist_mono, FontWeight.Normal))

// XR panels are read at arm's length, so the scale sits a step above phone defaults.
val Typography = Typography(
    displaySmall = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Light, fontSize = 40.sp, lineHeight = 46.sp, letterSpacing = (-0.025).em),
    headlineMedium = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Light, fontSize = 30.sp, lineHeight = 36.sp, letterSpacing = (-0.02).em),
    headlineSmall = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Normal, fontSize = 24.sp, lineHeight = 30.sp),
    titleMedium = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Bold, fontSize = 18.sp, lineHeight = 24.sp),
    bodyLarge = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Normal, fontSize = 18.sp, lineHeight = 28.sp),
    bodyMedium = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp),
    labelLarge = TextStyle(fontFamily = Lato, fontWeight = FontWeight.Bold, fontSize = 16.sp, lineHeight = 20.sp),
    // Geist Mono, uppercase in use: the site's "CMMS · PROCUREMENT · FINANCE" labels.
    labelMedium = TextStyle(fontFamily = GeistMono, fontSize = 13.sp, lineHeight = 16.sp, letterSpacing = 0.08.em),
    labelSmall = TextStyle(fontFamily = GeistMono, fontSize = 11.sp, lineHeight = 14.sp, letterSpacing = 0.08.em),
)
