package com.tundra.tundraxr.data

data class Device(
    val id: String,
    val name: String,
    val manufacturer: String,
    val category: String,
    val assetTag: String,
    val serial: String,
    val location: String,
    val lastPm: String,
    val openWorkOrders: Int,
    val manualId: String,
)

enum class SyncState {
    Sending,
    /** Stored by the brain; nothing further will happen to it. */
    InBrain,
    /** Stored, and TwelveLabs is analyzing it. */
    Analyzing,
    Analyzed,
    Failed,
}

enum class CaptureKind { Photo, Video, Note }

data class CaptureItem(
    val id: Long,
    val kind: CaptureKind,
    /** Offset into the session, e.g. "02:14". */
    val at: String,
    val sync: SyncState = SyncState.Sending,
    /** Local media file (photo/video). Null when the camera wasn't available. */
    val file: String? = null,
    val durationSec: Int = 0,
    val transcript: String = "",
    val index: Int = 0,
    /** Id assigned by the brain once uploaded. */
    val remoteId: String? = null,
    /** Short result shown in the timeline, e.g. "3 findings". */
    val detail: String? = null,
) {
    /** No more status changes expected from the brain. */
    val settled get() = sync == SyncState.InBrain || sync == SyncState.Analyzed || sync == SyncState.Failed
}

data class RemoteStatus(val sync: SyncState, val detail: String?)

enum class SourceKind(val label: String) { Manual("MANUAL"), Cmms("CMMS"), Fleet("FLEET"), Session("SESSION"), Video("VIDEO") }

data class Source(
    val kind: SourceKind,
    val label: String,
    /** Set when tapping the source should open the manual at this spot. */
    val manualTarget: ManualTarget? = null,
)

data class ChatMessage(
    val id: Long,
    val fromUser: Boolean,
    val text: String,
    val sources: List<Source> = emptyList(),
    val streaming: Boolean = false,
)

data class BrainAnswer(val text: String, val sources: List<Source>)

data class ManualTarget(
    /** 1-based page in the PDF (or the printed page for structured manuals). */
    val page: Int,
    /** Index of the passage on that page to highlight (structured manuals). */
    val passage: Int,
    val reason: String,
    /** Passage box as page fractions [left, top, right, bottom] (PDF manuals). */
    val box: List<Float>? = null,
)

data class ManualPage(val number: Int, val section: String, val title: String, val passages: List<String>)

data class Manual(
    val id: String,
    val title: String,
    val revision: String,
    val pageCount: Int,
    /** OEM PDF, served by the brain; when null the structured pages are rendered instead. */
    val pdfUrl: String?,
    val pages: List<ManualPage>,
)
