package com.tundra.tundraxr.data

import kotlinx.coroutines.delay
import java.io.File
import java.util.concurrent.ConcurrentHashMap

/** The Tundra brain as seen from the headset. */
interface TundraBrain {
    suspend fun identifyDevice(): Device
    /** Devices the brain knows, for switching when identification picks the wrong one. */
    suspend fun devices(): List<Device>
    suspend fun manual(manualId: String): Manual
    /** Uploads one capture. Returns the brain's id for it (if any) and its status. */
    suspend fun ingest(sessionId: String, device: Device, item: CaptureItem): Pair<String?, RemoteStatus>
    /** [device] scopes the question; null asks the brain in general (fleet, overdue inspections…). */
    suspend fun ask(sessionId: String, device: Device?, question: String, session: List<CaptureItem>): BrainAnswer
    /** Latest status per remote id, or null when the brain can't be reached. */
    suspend fun statuses(sessionId: String): Map<String, RemoteStatus>?
    /** Which device a photo (or a region of one) shows, best match first. */
    suspend fun identify(sessionId: String, image: File): List<ImageMatch>
    /** Devices matching a name, model, asset tag or serial ("this is the Evita"). */
    suspend fun findDevices(query: String): List<Device>
    /**
     * What a long spoken documentation boils down to, as a few bullet points (found / done /
     * follow-up). Null when the brain can't summarise; the transcript is uploaded either way.
     */
    suspend fun summarize(device: Device?, transcript: String): List<String>? = null
}

/**
 * Scripted brain for demos and UI work. Device, history and manual text are sample content.
 * Timings imitate the laptop brain so every island state can be seen: a question "thinks" for
 * about two seconds, photos are analyzed for a few seconds, videos upload and then analyze.
 */
class DemoBrain(private val now: () -> Long = System::currentTimeMillis) : TundraBrain {

    /** Captures handed to the demo, by the id it gave them: kind and when they arrived. */
    private val received = ConcurrentHashMap<String, Pair<CaptureKind, Long>>()

    private val device = Device(
        id = "dev_0412",
        name = "Evita V500",
        manufacturer = "Dräger",
        category = "Ventilator",
        assetTag = "ICU-VNT-0412",
        serial = "ASCD-0219",
        location = "ICU 3 · Bed 7",
        lastPm = "14 Jul 2026",
        openWorkOrders = 1,
        manualId = "evita-v500-tech",
    )

    private val manual = Manual(
        id = "evita-v500-tech",
        title = "Evita V500 · Technical documentation",
        revision = "Rev. 6.2",
        pageCount = 236,
        pdfUrl = null,
        pages = listOf(
            ManualPage(12, "1", "Safety information", listOf(
                "Only trained service personnel may open the device. Disconnect mains power and the internal battery before removing the rear housing.",
                "After any repair, perform the complete device check described in section 4.3 before returning the device to clinical use.",
            )),
            ManualPage(58, "4.3", "Device check before use", listOf(
                "The device check verifies tightness of the breathing system, function of the expiratory valve, and calibration of the flow and O2 sensors.",
                "Connect the test lung. Select System setup › Device check and follow the on-screen instructions. Duration approx. 3 minutes.",
                "If the leakage exceeds 300 mL/min, check the expiratory valve seat and the water trap before repeating the test.",
            )),
            ManualPage(142, "6.2", "Alarm messages · Cause · Remedy", listOf(
                "Fan failure — The cooling fan does not reach nominal speed. Check the fan filter at the rear for dust; replace the fan module if the alarm persists.",
                "O2 cell exhausted — The galvanic O2 sensor has reached end of life (typically 12 months). Replace the O2 sensor and perform O2 calibration (7.4).",
                "Exp. valve defective — The expiratory valve could not be calibrated. Clean and dry the valve membrane; replace if torn (8.3).",
            )),
            ManualPage(171, "7.4", "Calibrating the O2 sensor", listOf(
                "O2 calibration is performed automatically every 24 h and after a sensor replacement. A manual calibration can be started at any time.",
                "Select Sensor parameters › O2 calibration › Start. Ensure 100% O2 supply is connected. Calibration takes approx. 2 minutes.",
                "If calibration fails twice, the O2 sensor must be replaced. Dispose of the used cell as hazardous waste.",
            )),
            ManualPage(198, "8.1", "Preventive maintenance intervals", listOf(
                "Every 12 months: replace O2 sensor, inspect expiratory valve membrane, clean fan filter, perform safety test per IEC 62353.",
                "Every 24 months or 20,000 operating hours: replace internal battery and the turbine filter set (kit 8418xxx).",
            )),
            ManualPage(204, "8.3", "Replacing the expiratory valve", listOf(
                "Push the release button and pull the expiratory valve out of its holder. Remove the membrane and inspect it against light for cracks.",
                "Insert the new membrane with the metal plate facing the device. Push the valve in until it engages audibly, then run the device check.",
            )),
        ),
    )

    override suspend fun identifyDevice(): Device {
        delay(1400) // stands in for on-device asset-tag / label recognition
        return device
    }

    override suspend fun devices(): List<Device> = listOf(device)

    override suspend fun manual(manualId: String): Manual = manual

    override suspend fun ingest(sessionId: String, device: Device, item: CaptureItem): Pair<String?, RemoteStatus> {
        delay(if (item.kind == CaptureKind.Video) 1800 else 900)
        val id = "demo-${item.id}"
        received[id] = item.kind to now()
        return id to statusOf(item.kind, 0)
    }

    override suspend fun statuses(sessionId: String): Map<String, RemoteStatus> =
        received.mapValues { (_, v) -> statusOf(v.first, now() - v.second) }

    /** Where a capture is in the scripted pipeline, [elapsedMs] after it arrived. */
    private fun statusOf(kind: CaptureKind, elapsedMs: Long): RemoteStatus = when (kind) {
        CaptureKind.Note -> RemoteStatus(SyncState.InBrain, null)
        CaptureKind.Photo -> if (elapsedMs < 4_000) RemoteStatus(SyncState.Analyzing, null) else RemoteStatus(SyncState.Analyzed, "2 findings")
        CaptureKind.Video -> when {
            elapsedMs < 3_000 -> RemoteStatus(SyncState.Analyzing, "Uploading")
            elapsedMs < 9_000 -> RemoteStatus(SyncState.Analyzing, null)
            else -> RemoteStatus(SyncState.Analyzed, "3 findings")
        }
    }

    private val imageSearch = DemoImageSearch()

    override suspend fun identify(sessionId: String, image: File): List<ImageMatch> = imageSearch.search(image, listOf(device))

    override suspend fun findDevices(query: String): List<Device> =
        listOf(device).filter { query.lowercase() in it.name.lowercase() || query.lowercase() in it.assetTag.lowercase() }

    override suspend fun ask(sessionId: String, device: Device?, question: String, session: List<CaptureItem>): BrainAnswer {
        val device = device ?: this.device
        delay(1800) // long enough to see the island's thinking state
        val q = question.lowercase()
        return when {
            listOf("alarm", "error", "fault", "fan").any { it in q } -> BrainAnswer(
                "“Fan failure” on the Evita V500 almost always means a clogged rear fan filter. Clean it first; if the alarm returns within a shift, replace the fan module. This unit logged the same alarm twice in August.",
                listOf(
                    Source(SourceKind.Manual, "p.142 · Alarm messages", ManualTarget(142, 0, "Fan failure")),
                    Source(SourceKind.Cmms, "WO-18842 · 21 Aug"),
                ),
            )
            listOf("o2", "oxygen", "calibrat", "sensor").any { it in q } -> BrainAnswer(
                "The O2 cell was last replaced 14 Jul 2026, so it's mid-life. If calibration fails twice in a row, replace the cell — the procedure is in 7.4.",
                listOf(
                    Source(SourceKind.Manual, "p.171 · O2 calibration", ManualTarget(171, 2, "Replace after two failed calibrations")),
                    Source(SourceKind.Cmms, "PM · 14 Jul 2026"),
                ),
            )
            listOf("valve", "leak", "exp").any { it in q } -> BrainAnswer(
                "Leakage above 300 mL/min points at the expiratory valve seat or water trap. Inspect the membrane against light; replacement takes about 5 minutes.",
                listOf(
                    Source(SourceKind.Manual, "p.58 · Device check", ManualTarget(58, 2, "Leakage limit")),
                    Source(SourceKind.Manual, "p.204 · Replace exp. valve", ManualTarget(204, 0, "Membrane inspection")),
                ),
            )
            listOf("similar", "fleet", "other", "how many").any { it in q } -> BrainAnswer(
                "You have 14 Evita V500s. Three logged fan alarms in the last 90 days, all on ICU 3 — worth checking that room's air filtration.",
                listOf(Source(SourceKind.Fleet, "14 units · 3 with fan alarms"), Source(SourceKind.Cmms, "90-day alarm history")),
            )
            listOf("pm", "maintenance", "due", "service", "last").any { it in q } -> BrainAnswer(
                "Last PM was 14 Jul 2026 (passed). Next 12-month PM is due Jul 2027; the 24-month battery and turbine filter swap is due the same visit.",
                listOf(
                    Source(SourceKind.Cmms, "PM · 14 Jul 2026"),
                    Source(SourceKind.Manual, "p.198 · PM intervals", ManualTarget(198, 0, "12-month PM scope")),
                ),
            )
            else -> BrainAnswer(
                "${device.manufacturer} ${device.name}, ${device.assetTag} in ${device.location}. In service since 2021, one open work order, last PM passed. " +
                    if (session.isEmpty()) "Nothing captured yet in this session." else "${session.size} items from this session are already in its record.",
                listOf(Source(SourceKind.Cmms, "Asset ${device.assetTag}"), Source(SourceKind.Session, "This session")),
            )
        }
    }
}
