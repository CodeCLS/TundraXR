package com.tundra.tundraxr.assistant

import com.tundra.tundraxr.data.Device
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class CommandsTest {
    private val devices = listOf(
        Device("pb980", "Puritan Bennett 980", "Medtronic", "Ventilator", "ICU-VNT-0412", "s", "ICU", "x", 1, "pb980-om"),
        Device("ft10", "Valleylab FT10", "Medtronic", "Electrosurgical generator", "OR-ESU-0087", "s", "OR 6", "x", 2, "ft10-sm"),
    )
    private fun p(t: String, rec: Boolean = false) = parseCommand(t, devices, rec)

    @Test fun headsetSentences() {
        assertEquals(Command.AboutDevice, p("So tell me about this device I want to know what's going on"))
        assertEquals(Command.AboutDevice, p("So tell me about this device is switch devices is it"))
        assertTrue(p("Tell me about the database") is Command.Question)
        assertTrue(p("tell me about our maintenance contracts") is Command.Question)
        assertTrue(p("what's going on in the ICU") is Command.Question)
        assertEquals(Command.AboutDevice, p("tell me about this machine"))
        assertEquals(Command.AboutDevice, p("status"))
        assertTrue(p("Take a photo of this device") is Command.Photo)
        assertEquals(devices[1], (p("take a picture of the FT10") as Command.Photo).hint)
        assertEquals(Command.Stop, p("stop", rec = true))
        assertEquals(Command.Stop, p("okay I'm done", rec = true))
        assertTrue(p("replacing the filter now", rec = true) is Command.Chatter)
        assertEquals(Command.OpenManual("battery replacement"), p("open the manual for battery replacement"))
        assertEquals(Command.OpenManual(null), p("open the manual"))
        assertEquals(Command.CloseManual, p("close the manual"))
        assertEquals(Command.ShowCited, p("show me"))
        assertTrue(p("How do I run the short self test") is Command.Question)
        assertTrue(p("so the alarm keeps going off") is Command.Question)
        assertEquals(Command.SelectDevice(devices[1]), p("this is the FT10"))
        assertEquals(Command.StartRecording, p("start recording"))
        assertEquals(Command.RegionCapture, p("select a region"))
        assertEquals(Command.RegionCapture, p("okay scan an area"))
        assertEquals(Command.RegionCapture, p("region search"))
        assertEquals(Command.RegionCapture, p("let me draw a box around it"))
        assertEquals(Command.Cancel, p("cancel"))
        assertEquals(Command.Dictate, p("listen to my documentation"))
        assertEquals(Command.Dictate, p("upload my comment"))
        assertEquals(Command.Dictate, p("take a note"))
        assertEquals(Command.Dictate, p("I want to add a comment"))
        assertEquals(Command.StartRecording, p("start recording"))
        assertEquals(Command.StartRecording, p("start a video"))
        assertEquals(Command.Identify, p("which medical device am I looking at"))
        assertEquals(Command.Identify, p("what device is this"))
        assertEquals(Command.Identify, p("so what am I looking at"))
        assertEquals(Command.Identify, p("identify this"))
        // The engineer's real sentences from the headset log.
        assertEquals(Command.Identify, p("What medical device am I looking at right now"))
        assertEquals(Command.Identify, p("What kind of laptop am I looking at right now"))
        assertEquals(Command.Identify, p("What device am I looking at right now"))
        assertEquals(Command.Identify, p("Device am I looking at right now"))
        assertEquals(Command.Identify, p("Please take a photo of the medical device in front of me and tell me which it is"))
        assertEquals(Command.Identify, p("what's that thing over there"))
        assertTrue(p("take a photo of this device") is Command.Photo)
        assertTrue(p("Give me an interesting graph regarding the medical devices in the database") is Command.Question)
        assertTrue(p("How many devices do we have in a database") is Command.Question)
        assertEquals(Command.FindDevice("evita v500"), p("this is the Evita V500"))
        assertTrue(p("which devices are overdue for inspection") is Command.Question)
        assertTrue(p("how many ventilators do we have") is Command.Question)
    }
}
