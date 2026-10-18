package com.tundra.tundraxr

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.ui.components.MonoLabel
import com.tundra.tundraxr.ui.island.IslandActions
import com.tundra.tundraxr.ui.island.IslandSamples
import com.tundra.tundraxr.ui.island.PanelMode
import com.tundra.tundraxr.ui.island.RepairDynamicIsland
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.TundraXRTheme

/**
 * Debug-only gallery of island states. `adb shell am start -n com.tundra.tundraxr/.IslandGalleryActivity
 * --es sample answered --es mode expanded` shows one state; with no extras it lists the compact ones
 * above an interactive island.
 */
class IslandGalleryActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sample = intent.getStringExtra("sample")
        val startMode = if (intent.getStringExtra("mode") == "expanded") PanelMode.Expanded else PanelMode.Compact
        val samples = mapOf(
            "idle" to IslandSamples.idle, "recording" to IslandSamples.recording, "listening" to IslandSamples.listening,
            "thinking" to IslandSamples.thinking, "uploading" to IslandSamples.uploading, "answered" to IslandSamples.answered,
            "photo" to IslandSamples.photo, "offline" to IslandSamples.offline, "error" to IslandSamples.error,
        )
        setContent {
            TundraXRTheme {
                Column(
                    Modifier.fillMaxSize().background(Tundra.colors.borderStrong).safeDrawingPadding().verticalScroll(rememberScrollState()).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    if (sample != null) {
                        var mode by remember { mutableStateOf(startMode) }
                        RepairDynamicIsland(
                            samples.getValue(sample), mode,
                            IslandActions(expand = { mode = PanelMode.Expanded }, collapse = { mode = PanelMode.Compact }),
                        )
                    } else {
                        listOf("idle", "recording", "listening", "thinking", "uploading", "offline", "error").forEach { name ->
                            MonoLabel(name, color = Tundra.colors.ink, small = true)
                            RepairDynamicIsland(samples.getValue(name), PanelMode.Compact, IslandActions())
                        }
                    }
                }
            }
        }
    }
}
