package com.tundra.tundraxr.ui.island

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.ManualTarget
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.data.SourceKind
import com.tundra.tundraxr.data.SyncState
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.TundraXRTheme

/** Sample island states. Device and manual content are demo values, not records. */
object IslandSamples {
    private val sstTarget = ManualTarget(142, 0, "Short Self Test")

    val idle = IslandModel(
        ai = AiState.Idle,
        online = true,
        deviceName = "Puritan Bennett 980",
        assetTag = "ICU-VNT-0412",
        suggestions = listOf("How do I run SST?", "Preventive maintenance intervals?", "What does a high circuit pressure alarm mean?"),
    )

    val recording = idle.copy(recordingSec = 42)

    val listening = idle.copy(ai = AiState.Listening, listeningForAsk = true, liveTranscript = "How do I run the short self")

    val thinking = idle.copy(
        ai = AiState.Thinking,
        latest = ChatMessage(2, fromUser = false, text = "", streaming = true),
        progress = listOf(CallProgress("POST /api/ask", "SST", CallStatus.Running, "Searching PB980 manual")),
    )

    val uploading = idle.copy(
        progress = listOf(
            CallProgress("POST /api/captures", "photo 2", CallStatus.Ok, "In brain"),
            CallProgress("POST /api/captures", "video 1", CallStatus.Running, "Uploading"),
            CallProgress("POST /api/captures", "photo 3", CallStatus.Queued),
        ),
    )

    val answered = idle.copy(
        latest = ChatMessage(
            4,
            fromUser = false,
            text = "PB980 Operator's Manual, p. 142 · Short Self Test: Disconnect the patient, attach the test circuit and select SST from the service menu. The test takes about 3 minutes and checks circuit leak and compliance.",
            sources = listOf(
                Source(SourceKind.Manual, "p.142 · Short Self Test", sstTarget),
                Source(SourceKind.Video, "00:12–00:18 · on laptop"),
            ),
        ),
        guidance = Guidance(
            142,
            "Short Self Test (SST)",
            "Disconnect the patient. Attach the test circuit and select SST from the service menu. The test checks circuit leak, compliance and filter resistance.",
            sstTarget,
        ),
    )

    val photo = idle.copy(image = ImageItem("Photo 3", null, SyncState.Analyzing, null))

    val offline = idle.copy(online = false)

    val error = idle.copy(ai = AiState.Error, voiceError = "Didn't catch that. Try again")
}

@Composable
private fun Stage(content: @Composable () -> Unit) {
    TundraXRTheme {
        // A mid-grey stage stands in for passthrough, so the translucent surface is judged fairly.
        Box(Modifier.background(Tundra.colors.borderStrong).padding(24.dp)) { content() }
    }
}

@Preview(name = "Compact · idle") @Composable private fun CompactIdle() = Stage { RepairDynamicIsland(IslandSamples.idle, PanelMode.Compact, IslandActions()) }
@Preview(name = "Compact · recording") @Composable private fun CompactRecording() = Stage { RepairDynamicIsland(IslandSamples.recording, PanelMode.Compact, IslandActions()) }
@Preview(name = "Compact · listening") @Composable private fun CompactListening() = Stage { RepairDynamicIsland(IslandSamples.listening, PanelMode.Compact, IslandActions()) }
@Preview(name = "Compact · uploading") @Composable private fun CompactUploading() = Stage { RepairDynamicIsland(IslandSamples.uploading, PanelMode.Compact, IslandActions()) }
@Preview(name = "Compact · offline") @Composable private fun CompactOffline() = Stage { RepairDynamicIsland(IslandSamples.offline, PanelMode.Compact, IslandActions()) }
@Preview(name = "Expanded · first use") @Composable private fun ExpandedIdle() = Stage { RepairDynamicIsland(IslandSamples.idle, PanelMode.Expanded, IslandActions()) }
@Preview(name = "Expanded · answered") @Composable private fun ExpandedAnswered() = Stage { RepairDynamicIsland(IslandSamples.answered, PanelMode.Expanded, IslandActions()) }
@Preview(name = "Expanded · uploading") @Composable private fun ExpandedUploading() = Stage { RepairDynamicIsland(IslandSamples.uploading, PanelMode.Expanded, IslandActions()) }
@Preview(name = "Expanded · photo") @Composable private fun ExpandedPhoto() = Stage { RepairDynamicIsland(IslandSamples.photo, PanelMode.Expanded, IslandActions()) }
