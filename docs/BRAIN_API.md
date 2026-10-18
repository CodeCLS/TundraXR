# TundraXR ↔ Brain 连接说明

## 1. 分层结构

```
┌───────────────────────── 头显 App (app/) ─────────────────────────┐
│  UI 层  ui/**, MainActivity.kt                                     │
│    只读 SessionState，只调用 Actions                               │
│                       ▲ StateFlow<SessionState>   │ Actions        │
│  状态层 SessionViewModel.kt                                        │
│    持有所有状态、轮询、流式输出答案                                │
│                       ▲ suspend 调用                               │
│  数据层 data/TundraBrain.kt (接口)                                 │
│    ├─ LocalBrain  → HTTP 请求笔记本上的 brain                      │
│    └─ DemoBrain   → 内置示例数据（连不上时自动回退）               │
│  外设  capture/DeviceCamera.kt (CameraX)                           │
│        voice/VoiceInput.kt (SpeechRecognizer → 失败时 /api/transcribe)│
└────────────────────────────────┬──────────────────────────────────┘
                                 │ HTTP  http://localhost:8787
                                 │ (USB 时由 server 自动 adb reverse)
┌────────────────────────────────▼──────────────────────────────────┐
│  Brain (server/)  Node 22, 纯 node:http，无框架                    │
│    server.ts   路由                                                │
│    manuals.ts  PDF 手册解析与检索 (pdfjs-dist)                     │
│    twelvelabs.ts 视频/照片分析、视频检索 (twelvelabs-js + REST)    │
│    store.ts    data/db.json + data/media/                          │
│    public/index.html 笔记本上的实时 dashboard（SSE）               │
└───────────────────────────────────────────────────────────────────┘
```

**关键点：UI 层从不直接碰网络。** 头显和 brain 的所有通信都在 [LocalBrain.kt](../app/src/main/java/com/tundra/tundraxr/data/LocalBrain.kt)（外加 [VoiceInput.kt](../app/src/main/java/com/tundra/tundraxr/voice/VoiceInput.kt) 里的语音兜底），UI 只依赖 `SessionState` 和 `Actions`。

## 2. 用到的外部 API / 库

| 位置 | API / 库 | 用途 |
|---|---|---|
| App | Jetpack Compose for XR (`androidx.xr.compose`, `Subspace`, `SpatialCurvedRow`) | Full Space 三面板 / Home Space 布局 |
| App | CameraX (`androidx.camera`) | 拍照、录像 |
| App | `android.speech.SpeechRecognizer` | 设备端语音识别 |
| App | `AudioRecord` + `HttpURLConnection` | 识别失败时录 16 kHz WAV 发到 `/api/transcribe` |
| App | `org.json` + `HttpURLConnection` | 调 brain 的 REST 接口（没用 Retrofit/OkHttp） |
| Server | TwelveLabs（`twelvelabs-js` 1.3.5 + analyze REST） | `assets.create` 上传视频 → analyze 生成结构化发现 → `indexes.indexedAssets.create` 建索引 → `search.query` 检索片段 |
| Server | `pdfjs-dist` | 解析 OEM PDF，按段落建索引，返回页码 + 高亮框 |
| Server | whisper.cpp (`whisper-cli`) | 语音兜底转写 |
| Server | `adb reverse` | 自动维持 USB 隧道 |

## 3. Brain HTTP 接口

所有 JSON 响应都带 `access-control-allow-origin: *`。错误统一为 `{ "error": "..." }`。

### 头显 App 使用的接口

| 方法 | 路径 | 调用方 | 说明 |
|---|---|---|---|
| GET | `/api/devices` | `LocalBrain.loadCatalog()` | 设备 + 手册目录（App 只拉一次并缓存） |
| GET | `/manuals/{manualId}.pdf` | ManualPanel 渲染 PDF | 支持 Range |
| POST | `/api/captures` | `LocalBrain.ingest()` | 上传照片/视频/语音笔记 |
| GET | `/api/captures?sessionId=` | `LocalBrain.statuses()`，每 3 秒 | 心跳 + 分析状态 |
| POST | `/api/ask` | `LocalBrain.ask()` | 提问 |
| POST | `/api/transcribe` | `VoiceInput` | WAV → 文字 |

### 仅 dashboard 使用的接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | dashboard 页面 |
| GET | `/api/state` | `{ twelveLabs, indexId, headsetSeenAt, addresses, captures[] }` |
| GET | `/api/events` | SSE：`event: status` / `event: capture`（新增或更新的 Capture） |
| GET | `/media/{file}` | 照片/视频文件，支持 Range |
| POST | `/api/search` | `{ query }` → 视频片段检索（需 TwelveLabs key） |
| POST | `/api/captures/{id}/ask` | `{ question }` → 针对某段视频提问，返回更新后的 Capture |

### 3.1 `GET /api/devices`

```jsonc
[
  {
    "id": "pb980", "name": "...", "manufacturer": "...", "category": "...",
    "assetTag": "...", "serial": "...", "location": "...",
    "lastPm": "...", "openWorkOrders": 0,          // 可选
    "manual": {
      "id": "pb980-operators-manual",
      "title": "...", "docNumber": "PT00169219",
      "pages": 412,
      "url": "/manuals/pb980-operators-manual.pdf"  // App 会拼成 baseUrl + url
    }
  }
]
```

App 映射：`docNumber → Manual.revision`，`pages → Manual.pageCount`，`Manual.pages` 为空（PDF 手册不走结构化渲染）。

### 3.2 `POST /api/captures`

元数据走请求头，body 是原始媒体字节（笔记则为空）：

```
content-type: image/jpeg | video/mp4        // 笔记不带
x-tundra-meta: <encodeURIComponent(JSON)>
```

```jsonc
// x-tundra-meta 解码后
{
  "sessionId": "s_1760000000000",
  "kind": "photo" | "video" | "note",
  "at": "02:14",                 // 会话内偏移
  "durationSec": 12,
  "text": "语音笔记内容",          // 仅 note
  "device": { "id", "name", "manufacturer", "category", "assetTag", "serial", "location" }
}
```

响应 `201`：完整的 `Capture`（见 [store.ts](../server/src/store.ts)），App 只读 `id` 和 `tl` / `analysis`。

### 3.3 `GET /api/captures?sessionId=...`

返回该会话的 `Capture[]`。App 用它做两件事：
- 请求成功 → `brainOnline = true`；失败 → `false`
- 按 `id` 更新每条采集的状态，映射规则（`toStatus()`）：

| `tl.analysis` | App `SyncState` | 显示的 detail |
|---|---|---|
| `pending` / `running` | `Analyzing` | `tl.upload == "running"` 时显示 "Uploading" |
| `done` | `Analyzed` | `"N findings"`（`analysis.findings.length`） |
| `failed` | `Failed` | "Analysis failed" |
| `skipped`（无 key / 笔记） | `InBrain` | — |

### 3.4 `POST /api/ask`

```jsonc
// 请求
{ "sessionId": "...", "question": "fan alarm?", "device": { ...同上 DeviceInfo } }

// 响应
{
  "answer": "PB980 manual, p. 142 · Alarms:\n“...”",
  "manualHits": [
    { "manualId", "title", "page": 142, "section": "Alarms", "text": "...",
      "box": [left, top, right, bottom] }      // 页面比例 0–1，用于高亮
  ],
  "moments": [ { "captureId", "start": 12.5, "end": 18.0, "rank", "thumbnailUrl" } ]
}
```

App 映射：每个 `manualHit` → `Source(Manual, "p.142 · Alarms", ManualTarget(page, 0, section, box))`；每个 `moment` → `Source(Video, "00:12–00:18 · on laptop")`。ViewModel 把 `answer` 逐词"流式"显示，并自动打开第一个带 `manualTarget` 的来源。

请求失败时 `LocalBrain` 回退到 `DemoBrain.ask()`。

### 3.5 `POST /api/transcribe`

body：16 kHz 单声道 WAV。响应 `{ "text": "..." }`；没有模型时 `501`。

## 4. App 内部契约（改前端时要守住的边界）

UI 只能看到下面两样东西：

**`SessionState`**（[SessionViewModel.kt](../app/src/main/java/com/tundra/tundraxr/SessionViewModel.kt)）—— 只读快照

| 字段 | 含义 |
|---|---|
| `device` / `devices` | 当前设备 / 可切换的设备 |
| `manual`, `manualTarget`, `showManual` | 手册、要跳到的位置、是否显示 |
| `brainOnline` | `null` 未知，`true/false` 在线状态 |
| `cameraReady`, `isRecording`, `recordingSec`, `photoFlash` | 相机 |
| `captures` | 时间线（新的在前），每条有 `sync` 和 `detail` |
| `listeningFor`, `liveTranscript`, `voiceError` | 语音 |
| `chat`, `askDraft`, `showAsk` | 问答 |
| `photoCount`, `syncedCount` | 派生值 |

**`Actions`**（[MainActivity.kt](../app/src/main/java/com/tundra/tundraxr/MainActivity.kt)）—— 用户能做的所有事

`record`, `photo`, `note`, `askVoice`, `ask(text)`, `send`, `draft(text)`, `toggleAsk`, `toggleManual`, `openSource(source)`, `selectDevice(device)`

## 5. 简化前端时怎么保证不乱

1. **只改 `ui/**` 和 `MainActivity.kt` 里的布局 composable。** 不动 `data/`、`SessionViewModel.kt`、`voice/`、`capture/`。这些是和 brain、相机、麦克风的连接，UI 简化不需要碰。
2. **组件签名只收 `SessionState`（或其中的字段）和 `Actions`（或其中的 lambda）。** 不要在 composable 里 `new LocalBrain`、发请求、启动轮询。
3. **删按钮 ≠ 删功能。** 如果简化后某个入口不要了（比如设备切换、手动打开手册），只是不在 UI 上调用对应 action；`Actions` 和 ViewModel 保留。之后想加回来只改 UI。
4. **两种空间模式都要检查。** `SpatialWorkspace`（Full Space 三面板）和 `HomeSpaceWorkspace`（单窗口 tab）是两套布局，共用同一组面板组件。改了面板，两种模式都要看。
5. **用 DemoBrain 做 UI 开发。** 不开 server 时 App 自动回退到 DemoBrain，数据稳定、可以把所有状态（分析中、失败、引用手册）都触发出来。需要强制使用可在 ViewModel 构造里换成 `DemoBrain()`，但不要提交。
6. **这些状态必须仍然可见**（简化时最容易被删掉）：
   - `brainOnline == false`（笔记本断开）
   - `sync == Failed` 的采集（"Not sent · laptop offline"）
   - `voiceError`（语音失败不能静默）
   - `isRecording` + `recordingSec`
   - 答案的 `sources`，点 Manual 来源要能跳到手册对应页并高亮
7. **改完的自测清单**（server 开着 + 关着各跑一遍）：
   - [ ] 拍照 / 录像 / 语音笔记出现在时间线，状态从 Sending → In brain / Analyzing → Analyzed
   - [ ] dashboard（http://localhost:8787）实时出现同一条采集
   - [ ] 文字提问、语音提问都有回答，手册自动打开到引用页
   - [ ] 关掉 server：顶部显示离线，新采集显示失败，提问回退到 demo 回答
   - [ ] Full Space 和 Home Space 都能用

## 6. 如果要改接口

改接口时三个地方必须一起改，否则头显或 dashboard 会静默拿不到字段：

1. `server/src/server.ts`（路由 / 响应结构）和 `server/src/store.ts`（`Capture` 类型）
2. `app/.../data/LocalBrain.kt`（JSON 解析，`optX` 读不到字段不会报错，只会是空值）
3. `server/public/index.html`（dashboard 直接读 `Capture` 字段）

`TundraBrain` 接口和 `Models.kt` 尽量不变，这样 UI 不受影响。
