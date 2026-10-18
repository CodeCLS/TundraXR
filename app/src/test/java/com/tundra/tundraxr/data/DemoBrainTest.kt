package com.tundra.tundraxr.data

import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class DemoBrainTest {

    private var clock = 0L
    private val brain = DemoBrain(now = { clock })
    private val device = runBlocking { brain.devices().first() }

    private fun capture(id: Long, kind: CaptureKind) = CaptureItem(id, kind, "00:01", index = 1)

    @Test fun photoIsAnalyzedAfterAFewSeconds() = runBlocking {
        val (id, first) = brain.ingest("s", device, capture(1, CaptureKind.Photo))
        assertEquals(SyncState.Analyzing, first.sync)
        clock += 4_000
        assertEquals(RemoteStatus(SyncState.Analyzed, "2 findings"), brain.statuses("s")[id])
    }

    @Test fun videoUploadsThenAnalyzes() = runBlocking {
        val (id, first) = brain.ingest("s", device, capture(2, CaptureKind.Video))
        assertEquals(RemoteStatus(SyncState.Analyzing, "Uploading"), first)
        clock += 5_000
        assertEquals(RemoteStatus(SyncState.Analyzing, null), brain.statuses("s")[id])
        clock += 5_000
        assertEquals(RemoteStatus(SyncState.Analyzed, "3 findings"), brain.statuses("s")[id])
    }

    @Test fun notesAreStoredOnly() = runBlocking {
        val (_, status) = brain.ingest("s", device, capture(3, CaptureKind.Note))
        assertEquals(SyncState.InBrain, status.sync)
    }

    @Test fun answersCiteTheManual() = runBlocking {
        val answer = brain.ask("s", device, "What does the fan failure alarm mean?", emptyList())
        assertTrue(answer.sources.any { it.manualTarget?.page == 142 })
    }
}
