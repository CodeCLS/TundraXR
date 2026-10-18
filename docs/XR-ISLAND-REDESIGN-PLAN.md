# TundraXR · XR Dynamic Island 重构方案

> 状态：**方案待确认，尚未修改任何代码。**
> 范围：只改头显 App 的 UI 层（`app/.../ui/**`、`MainActivity.kt`、`ui/theme/*`）。不改 `server/`、API 合约、`data/`、`voice/`、`capture/` 的业务逻辑。

---

## 0. 先要你拍板的一件事：现在有两套“现有风格”

扫描后发现，项目里有两个互相不一致的风格来源：

| | A. App 当前的 Compose 主题 | B. `Tundra Health Design System/` 文件夹 |
|---|---|---|
| 来源 | `ui/theme/Color.kt` 注释：“Tokens taken from tundrahealth.ai” | `readme.md`、`tokens/*.css`、`components/*` |
| 字体 | Lato（正文/标题）+ Geist Mono（标签） | **Geist**（全部）+ Geist Mono（所有数字、编号） |
| 页面底色 | `#F2F1E8` | `--paper-100 #F4F2EA`，卡片 `--paper-050 #FCFBF7` |
| 正文颜色 | `#2B2B2B` | `--stone-800 #35342E`，规定“Nothing in Tundra is black” |
| 主按钮 | 墨色实心胶囊（`PillButton filled`） | `--stone-600 #55524A` 实心，8px 圆角，每屏只有一个 |
| AI 强调色 | 无（AI 也用墨色） | `--cobalt-500/700`，专门给 AI/agent 用 |
| 状态色 | 录制红 `#E40014`、同步绿 `#3F7A4E` | moss / amber / rust，偏土色，“never neon” |
| 图标 | Material 实心图标（`ic_sparkle` = Material auto_awesome） | Lucide，1.5px 线条 |
| 深色模式 | 有（`DarkTundraColors`） | 未定义 |

你说“风格都放在 design system 文件夹里，请按这个来设计”，所以本方案**以 B 为唯一标准**。A 里的 token 名字和组件结构保留，只把它们的**值**改成 B 的 token，这样现有页面会跟着一起变，不需要两套主题并存。

需要你确认：
1. **以 B 为准，把 A 的值迁移到 B**（推荐）。这会改变现有页面的颜色和字体，属于“把 App 对齐到设计系统”，不是我自己发明的新风格。
2. **深色模式怎么处理。** B 没有定义深色。推荐：XR 里只用浅色；`DarkTundraColors` 先保留不动，后面单独处理。
3. **Geist 字体文件。** `res/font/` 里目前只有 `geist_mono.ttf`。需要加入 Geist Sans（OFL 协议，来自 Google Fonts，与 B 的 `tokens/fonts.css` 同源）。

注意：B 的 `readme.md` 写明它是在“没有代码库”的情况下按品牌简报原创的，组件是 React/JSX，**不能直接在 Compose 里用**。所以这里复用的是它的 token 和组件规格，在 Compose 里用最小的代码移植过来，不引入任何新的 UI 库。

---

## 1. Design System Audit

`B` = `Tundra Health Design System/`，`A` = `app/src/main/java/com/tundra/tundraxr/ui/`。

### 1.1 颜色：主色、辅色、强调色

| 角色 | Token（B） | 值 | 来源 | A 中对应 |
|---|---|---|---|---|
| 品牌色（只用于 logo） | `--cream-100` | `#F8F2DC` | `tokens/colors.css` | 无 |
| 主操作填充色 | `--surface-primary` = `--stone-600` | `#55524A` | `tokens/colors.css`；`components/core/Button.jsx` primary | `ink #2B2B2B`（`theme/Color.kt`） |
| 主按钮按下 / 悬停 | `--surface-primary-active` / `-hover` | `#46443D` / `#635F55` | `tokens/colors.css` | 无 |
| AI 强调色 | `--cobalt-500` / `--cobalt-700` / `--text-accent` | `#5A6E9E` / `#42527C` | `tokens/colors.css`；readme“everything the agent does” | 无 |
| AI 浅色底 | `--surface-accent` = `--cobalt-050` | `#EDF1F9` | `tokens/colors.css`；`Button.jsx` accent | 无 |
| 引用标签 | `--cobalt-050` 底 + `--cobalt-200` 边 + `--cobalt-900` 字 | | `components/agent/DeviceMessage.jsx` | `Chip`（`components/Components.kt`） |

### 1.2 背景与表面

| 角色 | Token | 值 | 来源 | A 中对应 |
|---|---|---|---|---|
| 页面底色 | `--bg-page` = `--paper-100` | `#F4F2EA` | `tokens/colors.css` | `paper #F2F1E8` |
| 卡片 | `--surface-card` = `--paper-050` | `#FCFBF7` | 同上 | `raised #FAF9F4` |
| 凹陷 / 次级填充 | `--surface-sunken` = `--paper-200` | `#EBE8DE` | 同上 | `muted #E9E7DB` |
| 卡片头 / 表头 | `--surface-header` | `#F7F4EA` | 同上 | 无 |
| 悬停 / 按下 | `--surface-hover` / `--surface-active` | 5% / 8.5% `stone-600` | 同上 | 无（只有 `clickable` 默认涟漪） |
| 选中 | `--surface-selected` = `--cobalt-050` | | 同上 | `IconCircle selected` 用墨色实心 |
| 发丝线 | `--line-100` / `--line-200` / `--line-300` | `#E8E4D8` / `#DBD6C6` / `#C7C1AE` | 同上 | `border #DCD9CB` |
| 文字 | `--text-body` `#35342E`，`--text-secondary` `#696963`（这是可读性下限） | | `tokens/colors.css`；readme 对比度表 | `ink #2B2B2B`、`inkMuted #6B6A60` |
| 反色文字 | `--text-inverse` = `--cream-100`；按钮上用 `--cream-050` | | `colors.css`、`Button.jsx` | `inkInverse` |
| 手册高亮 | B 无定义 → 用 `--amber-050 #F9EFD8`（与 A 的 `highlight #F1E3B0` 最接近） | | 从 status 色推导 | `highlight` |

### 1.3 状态色

| 状态 | 前景 / 背景 / 圆点 | 来源 | A 中对应 |
|---|---|---|---|
| OK / 已同步 | `--moss-700` / `--moss-050` / `--moss-500` | `colors.css`、`components/core/Badge.jsx` | `synced #3F7A4E` |
| 警告 / 分析中 | `--amber-700` / `--amber-050` / `--amber-500` | 同上 | 无 |
| 错误 / 离线 / 录制中 | `--rust-700` / `--rust-050` / `--rust-500` | 同上 | `record #E40014` |
| 信息 / AI 运行中 | `--cobalt-700` / `--cobalt-050` / `--cobalt-500` | `Badge.jsx` info、`ToolCall.jsx` running | 无 |

录制中的红点：B 规定状态色“never neon”，所以 `#E40014` 要换成 `--rust-500 #A9563E`。这会让录制指示比现在柔和，需要你确认（见第 6 节）。

### 1.4 字体层级

B 的数值是网页 px。A 已经把字号整体放大了大约 1.2 倍以适应 XR 的阅读距离（`theme/Type.kt` 注释：“XR panels are read at arm's length”，例如 `bodyMedium` 16sp 对应 B 的 13.5px）。下面的 XR 列沿用这个 1.2 倍。

| B 角色 | B token | px | XR (sp) | 字重 / 字距 | 来源 |
|---|---|---|---|---|---|
| 标题 3 | `--text-title-3` | 19 | 23 | 500 / −.012em | `tokens/typography.css` |
| 大正文 | `--text-body-lg` | 17 | 20 | 400 / −.008em | 同上 |
| 正文 | `--text-size-body` | 15 | 18 | 400 / −.006em | 同上 |
| 紧凑正文 / UI 默认 | `--text-body-sm` | 13.5 | 16 | 400 / −.003em | 同上 |
| 控件文字 | Button md | 14 | 17 | 500 / −.008em | `components/core/Button.jsx` |
| 说明文字 | `--text-caption` | 12 | 14.5 | 400 | `typography.css` |
| 小标签（大写） | readme 规定 | 10.5 | 13 | 500 / .085em，`--text-secondary` | readme“Casing” |
| 等宽 | `--text-mono` / `--text-mono-sm` | 13 / 11.5 | 15.5 / 14 | Geist Mono | `typography.css` |
| 数字 | `--text-stat-sm` | 26 | 31 | **400**，−.03em，等宽数字 | `typography.css`、readme |

规则：数字和编号（资产号、页码、时长、`02:14`）一律用 Geist Mono。B 的小标签用 **Geist Sans 中等字重大写**，不是 A 现在用的 Geist Mono（`MonoLabel`）。

### 1.5 圆角

| Token | px | 用途（B 规定） | 来源 | A 现状 |
|---|---|---|---|---|
| `--radius-xs` | 4 | 复选框、引用标签 | `tokens/radius.css`、`DeviceMessage.jsx` | 手册页 4dp |
| `--radius-sm` | 6 | | | |
| `--radius-md` | 8 | **所有控件** | readme“Radii” | 按钮全是胶囊 `CircleShape` |
| `--radius-lg` | 12 | 卡片、消息气泡 | | `PanelShape` 10dp，气泡 18dp |
| `--radius-xl` | 16 | 弹窗、浮动面板 | | |
| `--radius-2xl` | 24 | 大块品牌区 | | 空间面板 32dp |
| `--radius-pill` | 999 | 徽章、标签、开关 | | Chip、PillButton |

### 1.6 间距

`tokens/spacing.css`：4px 基础单位，常用档位 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48；控件高度 32 / 36 / 40px（`--control-height-sm/md/lg`）。A 现在用了 6、10、14、18、22、28 等值，不在 4 的倍数上。

### 1.7 阴影、模糊、透明度

| 项目 | B 规定 | 来源 |
|---|---|---|
| 阴影 | 卡片和静止控件用 `--shadow-xs`；Toast 用 `--shadow-md`；**只有弹窗和浮动面板用 `--shadow-lg`** | `tokens/elevation.css`、readme |
| 结构 | 靠发丝线和底色的明暗差，不靠阴影 | readme“Cards” |
| 透明 | **只有两处**：吸顶头部 `rgba(250,249,245,.82)` + 10px 模糊；弹窗遮罩 `rgba(15,17,19,.28)` + 2px 模糊 | readme“Transparency & blur” |
| 点阵底纹 | 1px 圆点，22px 间距，`--dot-color-soft` | `tokens/texture.css`；A 的 `DotPattern` 已实现 |

### 1.8 图标

B：Lucide 0.446.0，**1.5px 线条**；尺寸 14 / 16 / 20 / 24；默认 `currentColor`，AI 相关图标用 `--cobalt-700`；不用 emoji 和图标字体（`components/core/Icon.prompt.md`、`lucide-glyphs.js`、readme“Iconography”）。B 已收录：`sparkles`、`send`、`upload`、`file-text`、`message-square`、`x`、`loader`、`check`、`triangle-alert`、`maximize-2`、`chevron-down`、`wrench`。

A：`res/drawable/ic_*.xml` 全是 Material 实心图标（`fillColor="#FF000000"`），风格不一致。

需要补进 `lucide-glyphs.js` 的图标（B 的规则是“新增图标就加到这个文件”）：`camera`、`mic`、`video`、`square`（停止）、`scan`（截图）、`image-up`（上传图片）、`book-open`（手册）、`volume-2`（朗读）、`minimize-2`（收起）。全部来自 Lucide 0.446.0，转换成 1.5px 线条的 VectorDrawable。

### 1.9 按钮与卡片

| B 组件 | 规格 | 来源 | A 对应 |
|---|---|---|---|
| Button | 变体 primary / secondary / ghost / **accent（AI 专用）** / danger；高度 sm 32 · md 36 · lg 40；8px 圆角；扁平，发丝线 + `--shadow-xs` | `components/core/Button.jsx`、`.prompt.md` | `PillButton` |
| IconButton | 方形，默认 ghost；30 / 36 / 40；8px 圆角；**必须有 label** | `IconButton.jsx` | `IconCircle` |
| Badge | 胶囊，高 21，11.5px 中等字重，**句首大写，不全大写**；`dot` 表示实时状态 | `Badge.jsx` | `SyncBadge`（CapturePanel） |
| Card | `--paper-050` 底，`--line-100` 发丝线，12px 圆角，几乎无阴影 | `Card.jsx`、readme | `DeviceCard`、`Message` |
| DeviceMessage | AI 回答：**必须带引用**；引用 = 等宽小标签，cobalt 底 | `components/agent/DeviceMessage.jsx` | `Message`（AskPanel） |
| ToolCall | 一行等宽字，展示一次真实调用：状态图标 + 名字 + 参数 + 结果 | `components/agent/ToolCall.jsx` | 无 |
| ProgressBar | 单一比例条 | `components/charts/ProgressBar.jsx` | 无 |
| Input | 标准文本框；`mono` 用于资产号等编号 | `components/forms/Input.jsx` | `InputBar`（AskPanel） |

### 1.10 动画

| 项目 | B 规定 | 来源 | A 现状 |
|---|---|---|---|
| 时长 | `--dur-fast` 140ms，`--dur-base` 200ms，`--dur-slow` 340ms | `tokens/motion.css` | 400ms 渐变（CapturePanel）、700ms 高亮 |
| 缓动 | `--ease-standard` `cubic-bezier(.2,0,0,1)`；`--ease-out` `(.16,1,.3,1)` | 同上 | Compose 默认 |
| 允许的动效 | 淡入淡出、1–4px 位移、颜色变化；弹窗 `.97 → 1` 缩放进入 | readme“Animation”、`tokens/base.css` | |
| 禁止 | **不要回弹、不要 spring、按下时不缩放不位移** | readme“Press” | |
| 减少动效 | 系统开启时关闭动画 | `base.css` | 无 |

### 1.11 视觉层级

- 浅色暖纸做底，墨色文字；整屏几乎是单色。
- 唯一的彩色是 cobalt，只给 AI 用；每屏只有一个实心主按钮。
- 每屏最多两种背景色。
- 小标签全大写、字距放宽，是最明显的品牌特征。
- 数字用细字重的等宽字体，不加粗。
- 每条 AI 信息都要标来源（`Manual p.142`），这是品牌的核心承诺。

---

## 2. XR 专用 Token 扩展（与原设计系统分开）

只有当 B 的规则在 XR 里会影响可读性或可操作性时才扩展。放在新文件 `ui/theme/XrTokens.kt`，不改 B 原有 token 的含义。

| 扩展 token | 值 | 为什么需要 |
|---|---|---|
| `xr.scale` | 1.2 | B 按桌面网页设计，XR 在约一臂距离阅读。A 已经在用约 1.2 倍（见 1.4），这里只是把它写成一个明确的值 |
| `xr.target.min` | 48dp（主要操作 56dp） | B 的控件是 32–40px，适合鼠标；在 XR 里用眼神加捏合操作太小。A 现在用 56dp（`PillButton` 注释“per Android XR guidance”） |
| `xr.surface.island` | `--paper-050`，透明度 **0.94** | B 只允许头部用 0.82 透明度加 10px 模糊。头显上面板背后是真实环境（passthrough），Compose for XR 没有可靠的背景模糊，没有模糊时 0.82 会让文字压在复杂背景上。0.94 保留“轻微透出”的感觉，同时让 `--text-secondary` 仍然清楚可读 |
| `xr.surface.island.edge` | `--line-200`，1dp | 半透明面板放在真实环境前需要明确的边缘；B 的发丝线规则本来就是靠线条区分层级 |
| `xr.depth` | 用空间 Z 偏移代替 `--shadow-lg` | 投影在空间面板上显示不出来；B 规定浮动面板要“抬起来”，在 XR 里用前后距离表达 |
| `xr.motion.morph` | `--dur-slow` 340ms + `--ease-out` | 胶囊展开时面积变化大，140–200ms 会显得突兀。用 B 已有的最慢档位和已有缓动，**不用 spring，不回弹** |
| `xr.radius.island` | 胶囊用 `--radius-pill`；展开面板用 `--radius-xl` × 1.2 ≈ 20dp；Focused 面板用 `--radius-2xl` × 1.2 ≈ 28dp | B 已有这些圆角，只按 `xr.scale` 放大 |

不扩展的部分：颜色、字体、状态色、图标风格都直接用 B。

---

## 3. 状态模型：界面状态和 AI 状态分开

```
PanelMode (UI)          AiState (从 SessionState 推导，不单独存储)
──────────────          ─────────────────────────────────────────
Compact                 Idle       ── 没有进行中的任务
Expanded                Listening  ── listeningFor != null
Focused(content)        Thinking   ── 最后一条回复 streaming 且还没有文字
  content =             Speaking   ── 回答正在逐词显示（或之后的 TTS 朗读）
    Chat / Image /      Error      ── voiceError != null，或最近一次上传失败
    Manual / Session
                        ConnectionState: brainOnline (null / true / false)，单独显示
```

- `PanelMode` 放在单独的 `IslandUiState` 里，不放进 `SessionState`，这样 AI 状态的推导只依赖业务数据。
- 所有 AI 请求已经在 `viewModelScope` 里运行（`SessionViewModel.ask()`、`add()`），和界面无关。**收起胶囊不会中断请求**，这一点现在就成立，不需要改逻辑。
- `AiState` 写成 `SessionState` 上的一个计算属性（和现有的 `photoCount` 一样），不改变任何存储的字段。

---

## 4. 三种界面状态

### State 1 · Compact Island（默认）

```
╭──────────────────────────────────────────────╮
│ ✦  Analyzing · 2 of 3 synced     🎙   ⌄     │   约 380 × 64dp，胶囊
╰──────────────────────────────────────────────╯
  AI 图标 状态文字                  麦克风 展开
```

- 位置：Full Space 里是一个独立的小 `SpatialPanel`，放在视线略上方，可移动。具体高度和距离做成可调常量，在真机上校准。
- 内容只有 4 项：AI 状态图标（`AIStatusIndicator`）、一行状态文字、麦克风、展开按钮。
- 状态文字的优先级：正在录像（`REC 00:42`，等宽）> 正在听 > 正在思考 / 回答 > 上传或分析进度 > 当前设备资产号。
- 麦克风 = **语音提问**（最常用）。语音笔记放在展开后的 Voice 操作里。
- 点任意空白处展开。

### State 2 · Expanded Island

```
╭──────────────────────────────────────────────╮
│ ✦ AI Repair Copilot          ● Online    ⌃  │ 头部：标题、状态、收起
│ PB980 · ICU-VNT-0412 ▾                       │ 设备（可切换）
├──────────────────────────────────────────────┤
│ [Camera][Screenshot][Upload][Chat][Voice][Manual] │ IslandActionBar
├──────────────────────────────────────────────┤
│ ┃ "Short Self Test… run SST before…"         │ 最新 AI 消息（最多 4 行）
│ ┃ [Manual p.142]  [00:12–00:18]        ⤢    │ 引用 + 打开 Focused
│ ┌──────────────────────────────────────┐     │
│ │ 一个上下文卡片（按优先级只显示一个）  │     │
│ └──────────────────────────────────────┘     │
├──────────────────────────────────────────────┤
│ [ Ask about this device…          ] 🎙  ↑   │ 输入框、麦克风、发送
╰──────────────────────────────────────────────╯
   约 520dp 宽，高度随内容变化，上限约 600dp
```

内容区一次最多显示 **最新消息 + 一张上下文卡片**，避免变回大型 Dashboard。上下文卡片按以下优先级只选一个：

1. **API 请求进度**：有正在进行的上传、分析或提问时显示。用 `ToolCall` 的样式，名字写真实接口（`POST /api/captures`、`POST /api/ask`），不编造工具名。
2. **维修指引卡片**（`RepairGuidanceCard`）：最近一次回答引用了手册时，显示章节、摘录和“打开 p.142”。
3. **图片预览**（`ImagePreview`）：刚拍的照片或刚上传的图片，附带同步状态。
4. **建议问题**：对话为空时显示 2–3 个（来自现有 `suggestionsFor()`）。

### State 3 · Focused Panel

从 Expanded 里的 `⤢` 或某个操作打开，是一个独立的空间面板（Full Space）或整个窗口（Home Space）。内容有四种：

| 内容 | 复用 |
|---|---|
| 完整对话 | `AskPanel` 的消息列表和输入框 |
| 大图 | 新的 `ImagePreview` 全尺寸模式 |
| PDF 手册 | `ManualPanel` 原样复用（只换 token） |
| 本次会话全部采集 | `CapturePanel` 的 `Timeline` |

关闭 Focused 面板后回到 Expanded，不回到旧的大型固定页面。旧的三面板布局（`SpatialWorkspace`）会被替换。

### 状态切换动画（全部用 B 已有的值）

| 切换 | 动画 |
|---|---|
| Compact → Expanded | 尺寸变化 340ms `--ease-out`；内容在尺寸变化后半段淡入，140ms |
| Expanded → Compact | 内容先淡出 140ms，再缩小 340ms |
| 打开 Focused | 淡入 + `.97 → 1` 缩放，200ms（B 的 `tundra-scale-in`） |
| 按下按钮 | 只变颜色（`--surface-active`），不缩放 |
| 系统开启减少动效 | 直接切换，没有动画 |

---

## 5. 旧 UI → 新 UI 组件对照

| 旧组件（文件） | 新位置 | 处理方式 |
|---|---|---|
| `SpatialWorkspace`（`MainActivity.kt`） | `RepairDynamicIsland`（Full Space） | 替换：一个胶囊面板 + 按需打开的 Focused 面板 |
| `HomeSpaceWorkspace`（`MainActivity.kt`） | `RepairDynamicIsland`（Home Space） | 替换：窗口顶部居中放胶囊，展开后在下方显示面板，Focused 占满窗口 |
| `ControlBar`（`capture/ControlBar.kt`） | `IslandActionBar` + Compact 上的麦克风 | 拆分；按钮改为 B 的 IconButton 样式 |
| Record 按钮 | Camera 操作里：点按拍照，切换到 Video 后点按录像 | 保留功能，见第 6 节第 2 条 |
| `CapturePanel.Header` / `DeviceCard` / `DevicePicker` | Expanded 头部的设备行 | 复用 `DevicePicker` 逻辑，换成 B 的 Badge/Select 样式 |
| `CapturePanel.Timeline` / `CaptureRow` / `Thumb` | Focused · 会话；最新一条进 `ImagePreview` | 复用 |
| `SyncBadge` | B 的 Badge（ok / warn / down / info + dot） | 小范围改样式 |
| `PhotoFlash` | 不变 | 复用 |
| `AskPanel` 头部 | Expanded 头部 | 合并 |
| `AskPanel.Message` | 最新消息卡片（DeviceMessage 样式）；完整列表进 Focused · 对话 | 复用，改样式 |
| `AskPanel.InputBar` | Expanded 底部 + Focused · 对话 底部 | 复用，改成 B 的 Input 样式 |
| `AskPanel.Suggestions` | 上下文卡片第 4 优先级 | 复用 |
| `ManualPanel` + `Pointer` | Focused · 手册 | 原样复用，只换 token |
| `Chip` | B 的引用标签（cobalt 底、等宽字）和 Badge | 小范围改样式 |
| `PillButton` / `IconCircle` | B 的 Button / IconButton（XR 尺寸） | 小范围改样式，保留函数名以减少改动 |
| `StatusDot` / `Waveform` | `AIStatusIndicator` 内部 | 复用 |
| `MonoLabel` | 小标签：Geist Sans 中等字重大写 | 小范围改样式 |
| `DotPattern` | B 的点阵底纹（`--dot-color-soft`，22dp） | 复用，改颜色 |
| `AdaptivePanel` / `Scaled` | Focused 面板继续使用 | 不变 |

新增文件（建议）：

```
ui/theme/XrTokens.kt                 XR 扩展 token（第 2 节）
ui/island/RepairDynamicIsland.kt      PanelMode 切换、空间位置
ui/island/CompactIsland.kt
ui/island/ExpandedIsland.kt
ui/island/IslandActionBar.kt
ui/island/AIStatusIndicator.kt
ui/island/RepairGuidanceCard.kt
ui/island/ImagePreview.kt
ui/island/FocusedPanel.kt            只是外壳，内部放 AskPanel / ManualPanel / Timeline
ui/island/IslandUiState.kt           PanelMode
res/drawable/lucide_*.xml            Lucide 1.5px 图标
res/font/geist_*.ttf                 Geist Sans
```

---

## 6. 需要你决定的功能问题

这些会影响到“不改 API、不重写已有功能”的边界：

1. **Screenshot 截什么。** 普通 App 拿不到“真实环境 + 虚拟面板”合成后的画面；只截真实环境又和 Camera 拍照重复。推荐：截取当前正在看的手册页（或 Focused 面板内容），作为照片走现有的 `POST /api/captures`（`kind: "photo"`），不改 API。
2. **录像放哪里。** 你列的 6 个快捷操作里没有录像，但录像是现有功能，不能丢。推荐：Camera 操作里带一个 Photo / Video 切换。
3. **Upload Image。** 用系统照片选择器选图，走现有的 `POST /api/captures`（`kind: "photo"`），不改 API。需要加 Photo Picker（Android 系统自带，不是新的 UI 库）。
4. **“语音播放状态 / Speaking”。** 现在 App 没有朗读功能，brain 也不返回音频。可选：(a) 用 Android 自带的 TextToSpeech 在设备上朗读答案（新功能，不改后端）；(b) 先不做朗读，Speaking 只表示“答案正在逐词显示”。推荐先选 (b)。
5. **维修步骤卡片。** brain 的 `/api/ask` 返回的是手册段落，不是分步骤的指引。在不改后端的前提下，卡片显示“引用的手册章节 + 摘录 + 打开该页”。真正的多步骤指引需要后端返回步骤，属于以后的工作。（视频分析结果里有 `steps_performed`，可以在 Focused · 会话 里显示，不改合约。）
6. **手册自动弹出。** 现在 brain 引用手册时会自动打开手册面板。在胶囊模式下，自动弹出一个大面板违背“不占视野”。推荐：改为在维修指引卡片上显示“打开 p.142”，由用户决定是否打开 Focused · 手册。
7. **录制指示颜色。** `#E40014` 鲜红改为 B 的 `--rust-500 #A9563E`，会更柔和，但在明亮环境下不那么显眼。推荐按 B 改，并用 `REC` 文字加计时作为第二个提示。

---

## 7. 实施步骤（确认后逐步进行，每步结束后你检查）

| 步骤 | 内容 | 改动的文件 |
|---|---|---|
| 1 | Token 迁移：`Color.kt` / `Type.kt` 的值改成 B；新增 `XrTokens.kt`；加入 Geist 字体；Lucide 图标 | `ui/theme/*`、`res/font`、`res/drawable` |
| 2 | 基础组件对齐 B：Button、IconButton、Badge、引用标签、小标签 | `ui/components/Components.kt` |
| 3 | Compact 和 Expanded 的纯 UI，用 Preview 和假数据，不接逻辑 | `ui/island/*` |
| 4 | 接入现有逻辑：`SessionState`、`Actions`、语音、提问、采集；加 `AiState` 计算属性 | `ui/island/*`、`SessionViewModel.kt`（只加计算属性）、`MainActivity.kt` |
| 5 | Focused 面板：对话、手册、会话、大图 | `ui/island/FocusedPanel.kt` |
| 6 | 新入口：Screenshot、Upload Image | `ui/island/*`、`MainActivity.kt`（Photo Picker） |
| 7 | 验证 | 见下 |

不会改动：`server/**`、`data/LocalBrain.kt`、`data/Models.kt`、`voice/VoiceInput.kt` 的识别逻辑、`capture/DeviceCamera.kt`、所有 HTTP 接口。

### 验证清单（server 开着和关着各跑一遍）

- [ ] 拍照、录像、语音笔记都出现在会话里，状态 Sending → InBrain / Analyzing → Analyzed
- [ ] 文字提问、语音提问、建议问题都能得到回答，引用可以点开手册对应页并高亮
- [ ] 回答进行中收起胶囊，回答仍然完成；重新展开后能看到
- [ ] 关掉 server：显示离线，上传标记失败，提问回退到 Demo 回答
- [ ] 切换设备后对话清空，手册和建议问题随之变化
- [ ] Full Space 和 Home Space 都能用；空间模式切换按钮仍然存在
- [ ] 笔记本 dashboard 实时收到同样的采集
- [ ] 系统开启“减少动效”时没有动画
- [ ] 所有可点目标 ≥ 48dp；`--text-secondary` 文字在半透明胶囊上清晰可读（真机检查）

### 技术风险

- **空间面板尺寸动画。** 让 `SpatialPanel` 平滑改变大小在 Compose for XR（`1.0.0-alpha16`）里可能卡顿。第 3 步会先做一个小试验：方案 A 动画改变面板尺寸；方案 B 面板固定为展开尺寸、内容在里面变化（需要确认透明区域不会挡住手势）。根据真机结果选一种。
- **半透明可读性。** 0.94 是推算值，需要在真机的不同光线下检查后再定。
