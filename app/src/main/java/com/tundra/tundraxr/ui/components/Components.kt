package com.tundra.tundraxr.ui.components

import androidx.annotation.DrawableRes
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.ui.theme.Tundra
import kotlin.math.PI
import kotlin.math.sin

val PanelShape = RoundedCornerShape(10.dp)

/** The dot grid from tundrahealth.ai, drawn behind panel content. */
@Composable
fun DotPattern(modifier: Modifier = Modifier, spacing: Dp = 22.dp, color: Color = Tundra.colors.ring.copy(alpha = 0.35f)) {
    Canvas(modifier.fillMaxSize()) {
        val step = spacing.toPx()
        val r = 1.1.dp.toPx()
        var y = step / 2
        while (y < size.height) {
            var x = step / 2
            while (x < size.width) {
                drawCircle(color, r, Offset(x, y))
                x += step
            }
            y += step
        }
    }
}

@Composable
fun MonoLabel(text: String, modifier: Modifier = Modifier, color: Color = Tundra.colors.inkMuted, small: Boolean = false) {
    Text(
        text.uppercase(),
        modifier = modifier,
        style = if (small) MaterialTheme.typography.labelSmall else MaterialTheme.typography.labelMedium,
        color = color,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun Wordmark(modifier: Modifier = Modifier, compact: Boolean = false) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        Text(
            "Tundra",
            style = (if (compact) MaterialTheme.typography.titleMedium else MaterialTheme.typography.headlineSmall).copy(fontWeight = FontWeight.Normal),
            color = Tundra.colors.ink,
        )
        if (!compact) {
            Box(Modifier.padding(start = 10.dp).size(4.dp).background(Tundra.colors.ink, CircleShape))
            MonoLabel("Brain", Modifier.padding(start = 10.dp))
        }
    }
}

@Composable
fun StatusDot(color: Color, pulsing: Boolean = false, modifier: Modifier = Modifier) {
    val alpha = if (pulsing) {
        val t = rememberInfiniteTransition(label = "dot")
        val a by t.animateFloat(1f, 0.25f, infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "a")
        a
    } else 1f
    Box(modifier.size(8.dp).background(color.copy(alpha = alpha), CircleShape))
}

/** Hairline-bordered chip with a mono label, used for sources and facts. */
@Composable
fun Chip(
    text: String,
    modifier: Modifier = Modifier,
    prefix: String? = null,
    onClick: (() -> Unit)? = null,
) {
    val c = Tundra.colors
    Row(
        modifier
            .clip(CircleShape)
            .background(c.raised)
            .border(1.dp, c.border, CircleShape)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 14.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (prefix != null) MonoLabel(prefix, small = true)
        Text(text, style = MaterialTheme.typography.bodyMedium, color = c.ink, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

/**
 * Pill button sized for gaze + pinch (56dp target, per Android XR guidance).
 * [filled] uses the ink color like the site's primary "Book a call" button.
 */
@Composable
fun PillButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    minHeight: Dp = 56.dp,
    filled: Boolean = false,
    container: Color? = null,
    content: @Composable RowScope.(Color) -> Unit,
) {
    val c = Tundra.colors
    val bg = container ?: if (filled) c.ink else Color.Transparent
    val fg = if (filled || container != null) c.inkInverse else c.ink
    Row(
        modifier
            .heightIn(min = minHeight)
            .clip(CircleShape)
            .background(bg)
            .clickable(onClick = onClick)
            .padding(horizontal = 22.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp, Alignment.CenterHorizontally),
    ) { content(fg) }
}

@Composable
fun IconCircle(
    @DrawableRes icon: Int,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    size: Dp = 56.dp,
) {
    val c = Tundra.colors
    Box(
        modifier
            .size(size)
            .clip(CircleShape)
            .background(if (selected) c.ink else Color.Transparent)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Icon(painterResource(icon), contentDescription, Modifier.size(24.dp), tint = if (selected) c.inkInverse else c.ink)
    }
}

@Composable
fun PillIcon(@DrawableRes icon: Int, tint: Color) {
    Icon(painterResource(icon), null, Modifier.size(22.dp), tint = tint)
}

@Composable
fun PillText(text: String, color: Color) {
    Text(text, style = MaterialTheme.typography.labelLarge, color = color)
}

/** Live voice level indicator. Purely decorative; the recognizer drives the transcript. */
@Composable
fun Waveform(modifier: Modifier = Modifier, color: Color = Tundra.colors.ink, bars: Int = 5) {
    val t = rememberInfiniteTransition(label = "wave")
    val phase by t.animateFloat(0f, (2 * PI).toFloat(), infiniteRepeatable(tween(900)), label = "phase")
    Canvas(modifier.width((bars * 7).dp).height(22.dp)) {
        val w = 3.dp.toPx()
        val gap = (size.width - bars * w) / (bars - 1)
        for (i in 0 until bars) {
            val h = size.height * (0.3f + 0.7f * ((sin(phase + i * 1.3f) + 1f) / 2f))
            val x = i * (w + gap) + w / 2
            drawLine(color, Offset(x, (size.height - h) / 2), Offset(x, (size.height + h) / 2), w, StrokeCap.Round)
        }
    }
}

@Composable
fun Hairline(modifier: Modifier = Modifier) {
    Box(modifier.height(1.dp).background(Tundra.colors.border))
}

@Composable
fun VerticalHairline(modifier: Modifier = Modifier) {
    Box(modifier.width(1.dp).height(28.dp).background(Tundra.colors.border))
}
