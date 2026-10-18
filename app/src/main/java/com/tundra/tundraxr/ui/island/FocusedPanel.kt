package com.tundra.tundraxr.ui.island

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.saveable.Saver
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.Actions
import com.tundra.tundraxr.R
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.ui.ask.AskPanel
import com.tundra.tundraxr.ui.capture.CapturePanel
import com.tundra.tundraxr.ui.components.CardShape
import com.tundra.tundraxr.ui.components.DotPattern
import com.tundra.tundraxr.ui.components.IconCircle
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.components.decodeThumb
import com.tundra.tundraxr.ui.manual.ManualPanel
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/** What the focused panel shows: the content that doesn't fit in the island. */
sealed interface FocusedContent {
    data object Chat : FocusedContent
    data object Manual : FocusedContent
    data object Session : FocusedContent
    data class Picture(val file: String?, val label: String) : FocusedContent

    companion object {
        /** Survives rotation and process death as a plain string. */
        val Saver = Saver<FocusedContent?, String>(
            save = {
                when (it) {
                    null -> ""
                    Chat -> "chat"
                    Manual -> "manual"
                    Session -> "session"
                    is Picture -> "picture|${it.label}|${it.file.orEmpty()}"
                }
            },
            restore = { s ->
                when {
                    s == "chat" -> Chat
                    s == "manual" -> Manual
                    s == "session" -> Session
                    s.startsWith("picture|") -> s.split("|", limit = 3).let { Picture(it[2].ifEmpty { null }, it[1]) }
                    else -> null
                }
            },
        )
    }
}

/**
 * State 3. The existing full panels, shown one at a time beside the island; closing returns to
 * the island, never to the old fixed layout.
 */
@Composable
fun FocusedPanel(content: FocusedContent, state: SessionState, actions: Actions, onClose: () -> Unit, modifier: Modifier = Modifier) {
    when (content) {
        FocusedContent.Chat -> AskPanel(state, actions.draft, actions.send, actions.ask, actions.askVoice, actions.openSource, onClose = onClose, modifier = modifier)
        FocusedContent.Manual -> ManualPanel(state.manual, state.manualTarget, onClose = onClose, modifier = modifier)
        FocusedContent.Session -> Box(modifier) {
            CapturePanel(state, actions.selectDevice, Modifier.fillMaxSize())
            CloseButton(onClose, Modifier.align(Alignment.TopEnd))
        }
        is FocusedContent.Picture -> Picture(content, onClose, modifier)
    }
}

@Composable
private fun CloseButton(onClose: () -> Unit, modifier: Modifier = Modifier) {
    IconCircle(R.drawable.ic_close, "Close", onClose, modifier.padding(12.dp), size = XrTokens.TargetMin)
}

/** One capture, as large as the panel allows. */
@Composable
private fun Picture(content: FocusedContent.Picture, onClose: () -> Unit, modifier: Modifier) {
    val c = Tundra.colors
    val bitmap by produceState<ImageBitmap?>(null, content.file) {
        val f = content.file
        if (f != null) value = withContext(Dispatchers.IO) { decodeThumb(f, targetPx = 2048) }
    }
    Column(modifier.fillMaxSize().background(c.paper).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                MonoLabel("Capture", small = true)
                Text(content.label, style = MaterialTheme.typography.headlineSmall, color = c.ink)
            }
            IconCircle(R.drawable.ic_close, "Close", onClose, size = XrTokens.TargetMin)
        }
        Box(
            Modifier.padding(top = 16.dp).fillMaxWidth().weight(1f).clip(CardShape).background(c.muted).border(1.dp, c.borderControl, CardShape),
            contentAlignment = Alignment.Center,
        ) {
            val bmp = bitmap
            if (bmp != null) {
                Image(bmp, content.label, Modifier.fillMaxSize(), contentScale = ContentScale.Fit)
            } else {
                DotPattern()
                Icon(painterResource(R.drawable.ic_camera), null, Modifier.size(32.dp), tint = c.inkMuted)
            }
        }
    }
}
