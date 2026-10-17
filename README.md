# TundraXR

Vision feature for **Samsung Galaxy XR** (Android XR) by [Tundra Health](https://tundrahealth.ai). Clinical engineers document a medical device hands-free — record video, take photos, talk — and every capture goes straight to the Tundra brain. They can ask the brain about the device and pull up the OEM manual scrolled to (and highlighting) the right passage.

```
app/      Android XR app (Jetpack Compose for XR, CameraX, SpeechRecognizer)
server/   Local "brain" on the laptop: captures, manual search, TwelveLabs video analysis, whisper.cpp voice fallback, live dashboard
```

## Run the brain (laptop)

Requires Node 22.18+ (runs TypeScript directly).

```bash
cd server
npm install
cp .env.example .env          # optional: add TWELVELABS_API_KEY for video/photo analysis + search
npm start                     # http://localhost:8787  (live dashboard)
```

**Manuals.** The OEM PDFs aren't in the repo (they're Medtronic's). Download them from [manuals.medtronic.com](https://manuals.medtronic.com) (United States → English → search by document number) and save them in `server/manuals/` under these names:

| Device | Document | Save as |
|---|---|---|
| Puritan Bennett 980 operator's manual | PT00169219 | `pb980-operators-manual.pdf` |
| Nellcor PM100N service manual | PT00156333 | `pm100n-service-manual.pdf` |
| Valleylab FT10 v5.x service manual | PT00208001 | `ft10-service-manual.pdf` |

Devices whose PDF is missing are skipped. Add your own in `server/manuals/catalog.json`.

**Voice fallback (optional).** If the headset's speech recognizer fails, the app sends audio to the laptop:

```bash
brew install whisper-cpp
mkdir -p server/models
curl -L -o server/models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
```

## Run the app (headset or XR emulator)

Open the project in Android Studio and run `app` on a Galaxy XR over USB or on the Android XR emulator. The app talks to `http://localhost:8787`; the server keeps `adb reverse tcp:8787 tcp:8787` up automatically for connected devices. To point it elsewhere: `./gradlew installDebug -Ptundra.serverUrl=http://<host>:8787`.

Without the server, the app falls back to a built-in demo device.
