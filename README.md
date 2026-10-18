# TundraXR

Hands-free assistant for **Samsung Galaxy XR** (Android XR) by [Tundra Health](https://tundrahealth.ai). A clinical engineer looks at a medical device and talks: the headset identifies the device with Tundra's image search, answers questions from the hospital's data (with charts and tables), opens the device's manual, and documents the work — video, live transcript, spoken notes, summarised by the Tundra brain — straight into Tundra.

```
app/      Android XR app: the island, voice, hand tracking, camera, on-device crop, Tundra Cloud client
server/   Optional laptop server: live dashboard, TwelveLabs video analysis, whisper.cpp voice fallback
tools/    cropper/: export and check the on-device crop model (EfficientSAM-Ti on ExecuTorch)
```

## Using it

A small dark **island** sits at the top of your view and follows your head. Grab it to move or resize it (that pins it; **Auto** puts it back). **Hold thumb and middle finger together** to talk, let go to send. Things to say:

| Say | What happens |
|---|---|
| "What am I looking at right now?" | Photo → cropped to the device on the headset → Tundra image search → the device from the hospital's records |
| "Open the manual" / "show me" | The device's manual from Tundra, beside the island |
| Any question ("which devices are overdue?", "devices per type as a chart") | Answered by the Tundra brain; charts, tables and follow-ups open in an answer panel |
| "Start recording" … "stop" | Video with live transcription; then video, transcript and a Tundra summary are uploaded to the device |
| "Listen to my documentation" … "done" | A spoken note, summarised when long, uploaded to the device |
| "Select a region" | Freeze the view, draw a box around a device, search just that |

## Setup

**1. Tundra Cloud key.** The headset talks to `https://app.tundrahealth.ai/api/external` directly. Create a key on the hospital's gateway (Admin → API & MCP; turn on external connections and text over the cloud *before* creating it, levels records/library/chat ≥ read, library write for uploads, device photos on) and put it in `local.properties` (git-ignored, never commit it):

```properties
tundra.apiKey=tgk_…
```

The key is compiled into the app build, so don't share the APK. Without a key the app goes through the laptop server instead.

**2. Crop model (optional).** `app/src/main/assets/device_cropper.pte` (~41 MB) is built, not committed — see [tools/cropper/README.md](tools/cropper/README.md). Without it photos are searched uncropped.

**3. Run.** Open the project in Android Studio and run `app` on a Galaxy XR (or the Android XR emulator). The app asks for camera, microphone and hand-tracking permission on first launch.

## Laptop server (optional)

Not needed for the headset. It adds a live dashboard of captures, TwelveLabs video analysis and search, and a whisper.cpp fallback for speech. Requires Node 22.18+.

```bash
cd server
npm install
cp .env.example .env          # TWELVELABS_API_KEY, TUNDRA_API_KEY (optional)
npm start                     # http://localhost:8787
```

Builds without `tundra.apiKey` use it at `http://localhost:8787` (kept reachable over USB with `adb reverse`) or `-Ptundra.serverUrl=http://<host>:8787`. Voice fallback: `brew install whisper-cpp` and put `ggml-base.en.bin` in `server/models/`.

**Offline demo.** `-Ptundra.demo=true` builds a version with scripted answers and a sample device, for UI work without any backend.
