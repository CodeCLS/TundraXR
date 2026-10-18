package com.tundra.tundraxr.ui.components

import androidx.annotation.DrawableRes
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
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
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.tundra.tundraxr.ui.theme.MonoSmallStyle
import com.tundra.tundraxr.ui.theme.MonoStyle
import com.tundra.tundraxr.ui.theme.Motion
import com.tundra.tundraxr.ui.theme.Radius
import com.tundra.tundraxr.ui.theme.Space
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens
import com.tundra.tundraxr.ui.theme.xr
import kotlin.math.PI
import kotlin.math.sin

// Shapes from the design system's radius scale, at XR size.
/** --radius-md: every control. */
val ControlShape = RoundedCornerShape(Radius.md.xr())
/** --radius-lg: cards and message bubbles. */
val CardShape = RoundedCornerShape(Radius.lg.xr())
/** Cards inside panels (kept under its old name so existing layouts keep compiling). */
val PanelShape = CardShape

/**
 * Hover and press as the design system specifies them: a colour step only. Nothing scales,
 * shifts or ripples. Returns the fill to draw for the current interaction state.
 */
@Composable
private fun interactiveFill(source: MutableInteractionSource, rest: Color, hover: Color, pressed: Color): Color {
    val isPressed by source.collectIsPressedAsState()
    val isHovered by source.collectIsHoveredAsState()
    val target = when {
        isPressed -> pressed
        isHovered -> hover
        else -> rest
    }
    return animateColorAsState(target, tween(Motion.Fast, easing = Motion.EaseStandard), label = "fill").value
}

/** The dotted survey grid (`tokens/texture.css`), drawn behind panel content. */
@Composable
fun DotPattern(modifier: Modifier = Modifier, spacing: Dp = 22.dp, color: Color = Tundra.colors.dot) {
    Canvas(modifier.fillMaxSize()) {
        val step = spacing.toPx()
        val r = 1.2.dp.toPx()
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

/**
 * Uppercase micro-label: sans medium, wide tracking, --text-secondary. The design system's
 * column heads, stat labels and definition terms. (Kept under its old name.)
 */
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

/** Anything countable or an identifier — asset tags, times, page numbers — in Geist Mono. */
@Composable
fun MonoText(text: String, modifier: Modifier = Modifier, color: Color = Tundra.colors.ink, small: Boolean = false) {
    Text(
        text,
        modifier = modifier,
        style = if (small) MonoSmallStyle else MonoStyle,
        color = color,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

/** The `Logo` component's word: "Tundra" in Geist Medium at −.03em. */
@Composable
fun Wordmark(modifier: Modifier = Modifier, compact: Boolean = false) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        Text(
            "Tundra",
            style = (if (compact) MaterialTheme.typography.titleMedium else MaterialTheme.typography.headlineSmall)
                .copy(fontWeight = FontWeight.Medium, letterSpacing = (-0.03).em),
            color = Tundra.colors.ink,
        )
        if (!compact) {
            Box(Modifier.padding(start = Space.s3).size(4.dp).background(Tundra.colors.ring, CircleShape))
            MonoLabel("Brain", Modifier.padding(start = Space.s3))
        }
    }
}

/** Live-state dot, as on the design system's `Badge` (6px × XR scale). */
@Composable
fun StatusDot(color: Color, pulsing: Boolean = false, modifier: Modifier = Modifier) {
    val alpha = if (pulsing) {
        val t = rememberInfiniteTransition(label = "dot")
        val a by t.animateFloat(1f, 0.3f, infiniteRepeatable(tween(700, easing = Motion.EaseStandard), RepeatMode.Reverse), label = "a")
        a
    } else 1f
    Box(modifier.size(7.dp).background(color.copy(alpha = alpha), CircleShape))
}

enum class BadgeTone { Neutral, Ok, Warn, Down, Info }

/** The design system's `Badge`: a pill with a hairline; sentence case, never uppercase. */
@Composable
fun Badge(text: String, modifier: Modifier = Modifier, tone: BadgeTone = BadgeTone.Neutral, dot: Boolean = false) {
    val c = Tundra.colors
    val (bg, fg, mark) = when (tone) {
        BadgeTone.Neutral -> Triple(c.paper, c.inkMuted, c.ring)
        BadgeTone.Ok -> Triple(c.okBg, c.okFg, c.okDot)
        BadgeTone.Warn -> Triple(c.warnBg, c.warnFg, c.warnDot)
        BadgeTone.Down -> Triple(c.downBg, c.downFg, c.downDot)
        BadgeTone.Info -> Triple(c.accentSurface, c.accent, c.accentDot)
    }
    val edge = if (tone == BadgeTone.Neutral) c.borderControl else mark.copy(alpha = 0.24f)
    Row(
        modifier
            .heightIn(min = 25.dp)
            .clip(CircleShape)
            .background(bg)
            .border(1.dp, edge, CircleShape)
            .padding(horizontal = 11.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(7.dp),
    ) {
        if (dot) Box(Modifier.size(7.dp).background(mark, CircleShape))
        Text(
            text,
            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium, fontSize = 14.sp),
            color = fg,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

/**
 * The design system's `Tag`: a hairline pill on the card colour. Used for suggestions and
 * small choices; becomes a target of at least 48dp when it is tappable.
 */
@Composable
fun Chip(
    text: String,
    modifier: Modifier = Modifier,
    prefix: String? = null,
    onClick: (() -> Unit)? = null,
) {
    val c = Tundra.colors
    val source = remember { MutableInteractionSource() }
    val fill = if (onClick != null) interactiveFill(source, c.raised, c.hover.compositeOver(c.raised), c.pressed.compositeOver(c.raised)) else c.raised
    Row(
        modifier
            .then(if (onClick != null) Modifier.heightIn(min = XrTokens.TargetMin) else Modifier)
            .clip(CircleShape)
            .background(fill)
            .border(1.dp, c.borderControl, CircleShape)
            .then(if (onClick != null) Modifier.clickable(source, indication = null, onClick = onClick) else Modifier)
            .padding(horizontal = Space.s4, vertical = Space.s2),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(Space.s2),
    ) {
        if (prefix != null) MonoLabel(prefix, small = true)
        Text(text, style = MaterialTheme.typography.bodyMedium, color = c.ink, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

/**
 * A citation on an agent answer, as on the design system's `DeviceMessage`: mono text on the
 * cobalt tint. The chip stays small; its tap target is padded out to 48dp.
 */
@Composable
fun CitationChip(text: String, modifier: Modifier = Modifier, onClick: (() -> Unit)? = null) {
    val c = Tundra.colors
    val shape = RoundedCornerShape(Radius.xs.xr())
    val source = remember { MutableInteractionSource() }
    val fill = if (onClick != null) interactiveFill(source, c.accentSurface, c.accentBorder.copy(alpha = 0.45f).compositeOver(c.accentSurface), c.accentBorder) else c.accentSurface
    Box(
        modifier
            .then(if (onClick != null) Modifier.minimumInteractiveComponentSize().clickable(source, indication = null, onClick = onClick) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text,
            style = MonoSmallStyle,
            color = c.accentInk,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.clip(shape).background(fill).border(1.dp, c.accentBorder, shape).padding(horizontal = 9.dp, vertical = 4.dp),
        )
    }
}

/**
 * The design system's `Button`, at XR size (56dp target). [filled] is the one graphite primary
 * per view; [accent] is the cobalt tint reserved for agent actions; otherwise the secondary
 * style (card fill + hairline). [container] overrides the fill for a state colour, e.g. recording.
 */
@Composable
fun PillButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    minHeight: Dp = XrTokens.TargetPrimary,
    filled: Boolean = false,
    container: Color? = null,
    accent: Boolean = false,
    content: @Composable RowScope.(Color) -> Unit,
) {
    val c = Tundra.colors
    val source = remember { MutableInteractionSource() }
    val fill = when {
        container != null -> interactiveFill(source, container, c.hover.compositeOver(container), c.pressed.compositeOver(container))
        filled -> interactiveFill(source, c.primary, c.primaryHover, c.primaryPressed)
        accent -> interactiveFill(source, c.accentSurface, c.accentBorder.copy(alpha = 0.45f).compositeOver(c.accentSurface), c.accentBorder)
        else -> interactiveFill(source, c.raised, c.paper, c.muted)
    }
    val fg = when {
        filled || container != null -> c.inkInverse
        accent -> c.accent
        else -> c.ink
    }
    val edge = when {
        filled || container != null -> null
        accent -> c.accentBorder
        else -> c.borderControl
    }
    Row(
        modifier
            .heightIn(min = minHeight.coerceAtLeast(XrTokens.TargetMin))
            .clip(ControlShape)
            .background(fill)
            .then(if (edge != null) Modifier.border(1.dp, edge, ControlShape) else Modifier)
            .clickable(source, indication = null, onClick = onClick)
            .padding(horizontal = Space.s6),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(Space.s2, Alignment.CenterHorizontally),
    ) { content(fg) }
}

/**
 * The design system's `IconButton`: square, label-less, ghost by default, 48dp minimum in XR.
 * [selected] is its `active` state (a 6% ink wash). [accent] marks a control of the agent's —
 * Ask, voice questions — whose active state takes the cobalt tint instead. [alert] is the rust
 * tint for a control that stops something live, such as recording. Disabled is 42% opacity.
 */
@Composable
fun IconCircle(
    @DrawableRes icon: Int,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    size: Dp = XrTokens.TargetPrimary,
    accent: Boolean = false,
    alert: Boolean = false,
    enabled: Boolean = true,
) {
    val c = Tundra.colors
    val source = remember { MutableInteractionSource() }
    val isHovered by source.collectIsHoveredAsState()
    val (rest, edge) = when {
        alert -> c.downBg to c.downDot.copy(alpha = 0.24f)
        selected && accent -> c.accentSurface to c.accentBorder
        selected -> c.pressed to null
        else -> Color.Transparent to null
    }
    val pressed = when {
        alert -> c.downDot.copy(alpha = 0.24f).compositeOver(c.downBg)
        accent && selected -> c.accentBorder
        else -> c.pressed
    }
    val fill = interactiveFill(source, rest, if (selected || alert) rest else c.hover, pressed)
    val tint = when {
        alert -> c.downFg
        selected && accent -> c.accent
        (selected || isHovered) && enabled -> c.ink
        else -> c.inkMuted
    }
    Box(
        modifier
            .size(size.coerceAtLeast(XrTokens.TargetMin))
            .alpha(if (enabled) 1f else 0.42f)
            .clip(ControlShape)
            .background(fill)
            .then(if (edge != null) Modifier.border(1.dp, edge, ControlShape) else Modifier)
            .clickable(source, indication = null, enabled = enabled, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Icon(painterResource(icon), contentDescription, Modifier.size(24.dp), tint = tint)
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
