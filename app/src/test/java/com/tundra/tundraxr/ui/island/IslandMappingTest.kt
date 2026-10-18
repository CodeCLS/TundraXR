package com.tundra.tundraxr.ui.island

import androidx.compose.runtime.saveable.SaverScope
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.VoiceTarget
import com.tundra.tundraxr.data.CaptureItem
import com.tundra.tundraxr.data.CaptureKind
import com.tundra.tundraxr.data.ChatMessage
import com.tundra.tundraxr.data.Device
import com.tundra.tundraxr.data.ManualTarget
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.data.SourceKind
import com.tundra.tundraxr.data.SyncState
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class IslandMappingTest {

    private val device = Device("pb980", "Puritan Bennett 980", "Medtronic", "Ventilator", "ICU-VNT-0412", "35B1800412", "ICU 3 · Bed 7", "14 Jul 2026", 1, "pb980-om")
    private val base = SessionState(device = device, devices = listOf(device), brainOnline = true)
    private val target = ManualTarget(142, 0, "Short Self Test")

    private fun question(id: Long) = ChatMessage(id, fromUser = true, text = "How do I run SST?")
    private fun answer(id: Long, streaming: Boolean = false, text: String = "Run SST from the service menu.") =
        ChatMessage(id, fromUser = false, text = text, sources = listOf(Source(SourceKind.Manual, "p.142 · Short Self Test", target)), streaming = streaming)
    private fun photo(id: Long, sync: SyncState = SyncState.InBrain) = CaptureItem(id, CaptureKind.Photo, "00:10", sync = sync, index = 1)

    // ── AI state ───────────────────────────────────────────────────────────

    @Test fun idleByDefault() = assertEquals(AiState.Idle, base.aiState())

    @Test fun listeningOnlyForQuestions() {
        assertEquals(AiState.Listening, base.copy(listeningFor = VoiceTarget.Ask).aiState())
        // A voice note goes into the record, not to the agent.
        assertEquals(AiState.Idle, base.copy(listeningFor = VoiceTarget.Note).aiState())
    }

    @Test fun thinkingUntilTheFirstWordThenSpeaking() {
        assertEquals(AiState.Thinking, base.copy(chat = listOf(question(1), answer(2, streaming = true, text = ""))).aiState())
        assertEquals(AiState.Speaking, base.copy(chat = listOf(question(1), answer(2, streaming = true, text = "Run"))).aiState())
        assertEquals(AiState.Idle, base.copy(chat = listOf(question(1), answer(2))).aiState())
    }

    @Test fun voiceErrorIsAnError() = assertEquals(AiState.Error, base.copy(voiceError = "Didn't catch that").aiState())

    // ── Compact status line ────────────────────────────────────────────────

    @Test fun recordingOutranksEverything() {
        val line = base.copy(isRecording = true, recordingSec = 42, brainOnline = false, voiceError = "x").toIslandModel().statusLine()
        assertEquals("Recording", line.text)
        assertEquals("00:42", line.figure)
        assertEquals(StatusTone.Alert, line.tone)
    }

    @Test fun offlineIsShown() = assertEquals("Laptop offline", base.copy(brainOnline = false).toIslandModel().statusLine().text)

    @Test fun restingShowsTheDevice() {
        val line = base.toIslandModel().statusLine()
        assertEquals("Puritan Bennett 980", line.text)
        assertEquals("ICU-VNT-0412", line.figure)
    }

    @Test fun beforeIdentification() = assertEquals("Identifying device", SessionState().toIslandModel().statusLine().text)

    @Test fun uploadShowsProgressAgainstTheSession() {
        val line = base.copy(captures = listOf(photo(2, SyncState.Sending), photo(1))).toIslandModel().statusLine()
        assertEquals("Uploading", line.text)
        assertEquals("1/2", line.figure)
    }

    // ── The one card under the latest answer ───────────────────────────────

    @Test fun suggestionsBeforeTheFirstQuestion() = assertTrue(base.toIslandModel().card() is IslandCard.Suggest)

    @Test fun requestsInFlightComeFirst() {
        val m = base.copy(chat = listOf(question(1), answer(2)), captures = listOf(photo(3, SyncState.Sending))).toIslandModel()
        assertTrue(m.card() is IslandCard.Progress)
    }

    @Test fun newerAnswerShowsItsManualPage() {
        val m = base.copy(captures = listOf(photo(1)), chat = listOf(question(2), answer(3))).toIslandModel()
        val card = m.card() as IslandCard.Guide
        assertEquals(142, card.guidance.page)
        // The answer already quotes the passage; the card must not repeat it.
        assertNull(card.guidance.excerpt)
        assertNull(m.image)
    }

    @Test fun newerPhotoShowsThePhoto() {
        val m = base.copy(chat = listOf(question(1), answer(2)), captures = listOf(photo(3))).toIslandModel()
        assertTrue(m.card() is IslandCard.Image)
        assertNull(m.guidance)
    }

    @Test fun noGuidanceWhileTheAnswerIsStillArriving() {
        val m = base.copy(chat = listOf(question(1), answer(2, streaming = true))).toIslandModel()
        assertNull(m.guidance)
    }

    // ── Captures as requests ───────────────────────────────────────────────

    @Test fun capturesMapToTheirRealEndpoints() {
        val video = CaptureItem(4, CaptureKind.Video, "00:30", sync = SyncState.Analyzing, durationSec = 42, detail = null)
        val failed = photo(5, SyncState.Failed)
        val calls = base.copy(captures = listOf(failed, video)).toIslandModel().progress
        assertEquals(CallProgress("GET /api/captures", "video 00:42", CallStatus.Running, "Analyzing on the laptop"), calls[0])
        assertEquals("POST /api/captures", calls[1].endpoint)
        assertEquals(CallStatus.Failed, calls[1].status)
    }

    @Test fun aQuestionInFlightIsAnAskCall() {
        val calls = base.copy(chat = listOf(question(1), answer(2, streaming = true, text = ""))).toIslandModel().progress
        assertEquals("POST /api/ask", calls.single().endpoint)
    }

    // ── Focused panel state survives being saved ───────────────────────────

    @Test fun focusedContentRoundTrips() {
        val scope = object : SaverScope { override fun canBeSaved(value: Any) = true }
        listOf(null, FocusedContent.Chat, FocusedContent.Manual, FocusedContent.Session, FocusedContent.Picture("/data/photo_1.jpg", "Photo 1"), FocusedContent.Picture(null, "Photo 2"))
            .forEach { content ->
                val saved = with(FocusedContent.Saver) { scope.save(content) }!!
                assertEquals(content, FocusedContent.Saver.restore(saved))
            }
    }
}
