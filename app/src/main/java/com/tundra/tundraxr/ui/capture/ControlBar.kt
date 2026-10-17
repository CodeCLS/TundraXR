package com.tundra.tundraxr.ui.capture

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.R
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.VoiceTarget
import com.tundra.tundraxr.formatClock
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.PillButton
import com.tundra.tundraxr.ui.components.PillIcon
import com.tundra.tundraxr.ui.components.PillText
import com.tundra.tundraxr.ui.components.VerticalHairline
import com.tundra.tundraxr.ui.theme.Tundra

/** Floats under the capture panel as an orbiter in Full Space; sits inline in Home Space. */
@Composable
fun ControlBar(
    state: SessionState,
    onRecord: () -> Unit,
    onPhoto: () -> Unit,
    onNote: () -> Unit,
    onAsk: () -> Unit,
    onManual: () -> Unit,
    modifier: Modifier = Modifier,
    /** Narrow or short windows: icon-only record button and smaller targets. */
    compact: Boolean = false,
    /** Very short windows: slimmest bar that still has comfortable targets. */
    tiny: Boolean = false,
) {
    val button = when {
        tiny -> 44.dp
        compact -> 48.dp
        else -> 56.dp
    }
    val c = Tundra.colors
    val ready = state.device != null
    Row(
        modifier
            .clip(CircleShape)
            .background(c.raised)
            .border(1.dp, c.border, CircleShape)
            .padding(if (tiny) 4.dp else 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        PillButton(
            onClick = { if (ready) onRecord() },
            modifier = Modifier.widthIn(min = if (compact || tiny) 0.dp else 168.dp),
            minHeight = button,
            filled = !state.isRecording,
            container = if (state.isRecording) c.record else null,
        ) { fg ->
            if (state.isRecording) {
                PillIcon(R.drawable.ic_stop, fg)
                PillText(formatClock(state.recordingSec), fg)
            } else {
                PillIcon(R.drawable.ic_videocam, fg)
                if (!compact && !tiny) PillText("Record", fg)
            }
        }
        IconCircle(R.drawable.ic_camera, "Take photo", { if (ready) onPhoto() }, size = button)
        IconCircle(
            R.drawable.ic_mic,
            if (state.listeningFor == VoiceTarget.Note) "Stop voice note" else "Voice note",
            { if (ready) onNote() },
            selected = state.listeningFor == VoiceTarget.Note,
            size = button,
        )
        VerticalHairline(Modifier.padding(horizontal = if (compact) 2.dp else 6.dp))
        IconCircle(R.drawable.ic_sparkle, "Ask Tundra", onAsk, selected = state.showAsk, size = button)
        IconCircle(R.drawable.ic_manual, "Manual", onManual, selected = state.showManual, size = button)
    }
}
