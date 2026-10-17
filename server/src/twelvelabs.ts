import fs from "node:fs";
import path from "node:path";
import { TwelveLabs } from "twelvelabs-js";
import type { Capture, Moment, Store } from "./store.ts";

const API = "https://api.twelvelabs.io/v1.3";
const INDEX_NAME = "tundra-clinical-engineering";
const ANALYSIS_MODEL = "pegasus1.6";
const SEARCH_MODEL = "marengo3.0";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Prompts & schemas ─────────────────────────────────────────────────────────

function context(c: Capture, notes: string[]): string {
  const d = c.device;
  return [
    "You are documenting work for a hospital clinical engineering (HTM / biomedical engineering) department.",
    `The footage is first-person, recorded on a mixed-reality headset by a technician working on: ${d.manufacturer} ${d.name} (${d.category}), asset tag ${d.assetTag}, serial ${d.serial}, location ${d.location}.`,
    "The technician may narrate while working. Treat narration as primary evidence and the visuals as confirmation.",
    notes.length ? `Voice notes from the same session: ${notes.map((n) => `"${n}"`).join(" ")}` : "",
    "Be specific and factual. Only report what is visible or said; never invent part numbers, readings or results.",
  ].filter(Boolean).join("\n");
}

const finding = {
  type: "object",
  properties: {
    title: { type: "string" },
    severity: { type: "string", enum: ["info", "minor", "major", "critical"] },
    detail: { type: "string" },
    start_time: { type: "number" },
    end_time: { type: "number" },
  },
  required: ["title", "severity", "detail"],
};

const VIDEO_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    work_type: {
      type: "string",
      enum: ["preventive_maintenance", "corrective_repair", "inspection", "calibration", "incoming_inspection", "troubleshooting", "other"],
    },
    device_identification: { type: "string" },
    findings: { type: "array", items: finding },
    steps_performed: {
      type: "array",
      items: {
        type: "object",
        properties: { step: { type: "string" }, start_time: { type: "number" } },
        required: ["step"],
      },
    },
    parts_and_consumables: { type: "array", items: { type: "string" } },
    tools_and_test_equipment: { type: "array", items: { type: "string" } },
    safety_concerns: { type: "array", items: { type: "string" } },
    recommended_follow_up: { type: "array", items: { type: "string" } },
    device_status_after: { type: "string", enum: ["in_service", "out_of_service", "needs_follow_up", "unknown"] },
    documentation_gaps: { type: "array", items: { type: "string" } },
  },
  required: [
    "summary", "work_type", "device_identification", "findings", "steps_performed", "parts_and_consumables",
    "tools_and_test_equipment", "safety_concerns", "recommended_follow_up", "device_status_after", "documentation_gaps",
  ],
};

const VIDEO_PROMPT = `Produce the maintenance record for this work.
- summary: 2-3 sentences a clinical engineering manager can read in 10 seconds.
- device_identification: what labels, model, serial, asset tags or calibration stickers are visible and what they read.
- findings: every defect, wear, alarm, error message, damage, contamination or out-of-tolerance reading, with start_time/end_time in seconds.
- steps_performed: what the technician actually did, in order, with start_time in seconds.
- parts_and_consumables, tools_and_test_equipment: as seen or named.
- safety_concerns: anything relevant to patient or staff safety (electrical, infection control, damaged cables, missing guards, expired stickers).
- recommended_follow_up: concrete next actions.
- device_status_after: whether the device appears ready to return to clinical use.
- documentation_gaps: what an auditor (e.g. Joint Commission / CMS) would expect in this record that the footage does not show, e.g. no electrical safety test result visible.`;

const PHOTO_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    visible_labels: {
      type: "array",
      items: {
        type: "object",
        properties: { kind: { type: "string" }, text: { type: "string" } },
        required: ["kind", "text"],
      },
    },
    findings: { type: "array", items: finding },
    safety_concerns: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "visible_labels", "findings", "safety_concerns", "tags"],
};

const PHOTO_PROMPT = `Describe this photo for the device's maintenance record.
- summary: one sentence on what the photo shows (which part of the device, what state).
- visible_labels: transcribe every readable label: kind is one of model, serial, asset_tag, calibration_sticker, inspection_sticker, warning, display_message, other.
- findings: visible damage, wear, contamination, error messages or alarms on screen. Use severity info/minor/major/critical.
- safety_concerns: anything affecting patient or staff safety.
- tags: 3-6 short keywords for search.`;

// ── Pipeline ──────────────────────────────────────────────────────────────────

export class VideoBrain {
  readonly enabled: boolean;
  private client: TwelveLabs | null;
  private queue: Promise<void> = Promise.resolve();
  private apiKey: string | undefined;
  private store: Store;
  private emit: (c: Capture) => void;

  constructor(apiKey: string | undefined, store: Store, emit: (c: Capture) => void) {
    this.apiKey = apiKey;
    this.store = store;
    this.emit = emit;
    this.enabled = Boolean(apiKey);
    this.client = apiKey ? new TwelveLabs({ apiKey }) : null;
  }

  /** Captures are processed one at a time to stay well inside rate limits. */
  process(c: Capture) {
    if (!this.enabled) return;
    this.queue = this.queue.then(() => this.run(c.id)).catch(() => {});
  }

  private set(id: string, fn: (c: Capture) => void) {
    const c = this.store.update(id, fn);
    if (c) this.emit(c);
  }

  private async run(id: string) {
    const c = this.store.get(id);
    if (!c?.file) return;
    try {
      if (c.kind === "photo") await this.analyzePhoto(c);
      if (c.kind === "video") await this.processVideo(c);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[twelvelabs] ${c.kind} ${c.id}: ${msg}`);
      this.set(id, (x) => {
        x.tl.error = msg.slice(0, 400);
        for (const k of ["upload", "analysis", "index"] as const) if (x.tl[k] === "running" || x.tl[k] === "pending") x.tl[k] = "failed";
      });
    }
  }

  private sessionNotes(c: Capture): string[] {
    return this.store.all().filter((x) => x.sessionId === c.sessionId && x.kind === "note" && x.text).map((x) => x.text!);
  }

  private async analyzePhoto(c: Capture) {
    this.set(c.id, (x) => { x.tl.analysis = "running"; });
    const b64 = fs.readFileSync(path.join(this.store.mediaDir, c.file!)).toString("base64");
    const data = await this.analyze({
      image: [{ name: "photo", base64_string: b64 }],
      prompt: `${context(c, this.sessionNotes(c))}\n\n${PHOTO_PROMPT}`,
      response_format: { type: "json_schema", json_schema: PHOTO_SCHEMA },
    });
    this.set(c.id, (x) => { x.analysis = JSON.parse(data); x.tl.analysis = "done"; });
  }

  private async processVideo(c: Capture) {
    const client = this.client!;
    this.set(c.id, (x) => { x.tl.upload = "running"; });
    const asset = await client.assets.create({
      method: "direct",
      file: fs.createReadStream(path.join(this.store.mediaDir, c.file!)),
      filename: c.file,
    });
    await this.waitFor(() => client.assets.retrieve(asset.id!).then((a) => a.status as string));
    this.set(c.id, (x) => { x.tl.assetId = asset.id; x.tl.upload = "done"; x.tl.analysis = "running"; });

    // Analysis first: it's what the engineer wants to see. Indexing for search follows.
    const data = await this.analyze({
      video: { type: "asset_id", asset_id: asset.id },
      prompt: `${context(c, this.sessionNotes(c))}\n\n${VIDEO_PROMPT}`,
      response_format: { type: "json_schema", json_schema: VIDEO_SCHEMA },
      max_tokens: 4096,
    });
    this.set(c.id, (x) => { x.analysis = JSON.parse(data); x.tl.analysis = "done"; x.tl.index = "running"; });

    const indexId = await this.ensureIndex();
    const indexed = await client.indexes.indexedAssets.create(indexId, { assetId: asset.id! });
    this.set(c.id, (x) => { x.tl.indexedAssetId = indexed.id; });
    await this.waitFor(() => client.indexes.indexedAssets.retrieve(indexId, indexed.id!).then((a) => a.status as string), 15 * 60_000);
    this.set(c.id, (x) => { x.tl.index = "done"; });
  }

  /** Free-form question about one video, answered by Pegasus. */
  async askVideo(c: Capture, question: string): Promise<string> {
    if (!c.tl.assetId) throw new Error("Video is not uploaded to TwelveLabs yet");
    return this.analyze({
      video: { type: "asset_id", asset_id: c.tl.assetId },
      prompt: `${context(c, this.sessionNotes(c))}\n\nAnswer the clinical engineer's question about this footage concisely. Cite timestamps (mm:ss) for what you reference.\n\nQuestion: ${question}`,
    });
  }

  /** Natural-language search across every indexed video. */
  async search(query: string, limit = 8): Promise<Moment[]> {
    const indexId = this.store.indexId;
    if (!this.client || !indexId) return [];
    const page = await this.client.search.query({ indexId, queryText: query, searchOptions: ["visual", "audio"], pageLimit: limit });
    const moments: Moment[] = [];
    for await (const item of page) {
      const c = item.videoId ? this.store.byIndexedVideo(item.videoId) : undefined;
      if (c) moments.push({ captureId: c.id, start: item.start ?? 0, end: item.end ?? 0, rank: item.rank, thumbnailUrl: item.thumbnailUrl });
      if (moments.length >= limit) break;
    }
    return moments;
  }

  /**
   * Search driven by the query itself: Marengo finds candidate clips, then Pegasus looks at
   * each clip (and every photo) and answers the query, so results say what matched — or that
   * nothing did — instead of echoing a capture's maintenance summary.
   */
  async searchAll(query: string) {
    const candidates = await this.search(query, 4);
    const moments = await Promise.all(candidates.map(async (m) => {
      const c = this.store.get(m.captureId);
      const verdict = c?.tl.assetId ? await this.judgeClip(c.tl.assetId, m.start, m.end, query).catch((e) => {
        console.error(`[twelvelabs] clip check: ${e.message}`);
        return null;
      }) : null;
      return { ...m, match: verdict?.match ?? false, description: verdict?.description ?? "Couldn't check this clip." };
    }));

    // One request per photo: Pegasus renames images in multi-image answers, which breaks mapping.
    const photoCaps = this.store.all().filter((c) => c.kind === "photo" && c.file).slice(-12);
    const photos = await Promise.all(photoCaps.map(async (c) => {
      const verdict = await this.judge({
        image: [{ name: "photo", base64_string: fs.readFileSync(path.join(this.store.mediaDir, c.file!)).toString("base64") }],
        prompt: `Search query: "${query}". Does this image show what the query asks for? Describe in one short sentence what in the image matches the query (or what it shows instead, if it doesn't match).`,
      }).catch((e) => {
        console.error(`[twelvelabs] photo check: ${e.message}`);
        return null;
      });
      return { captureId: c.id, match: verdict?.match ?? false, description: verdict?.description ?? "Couldn't check this photo." };
    }));

    // Matches first, keeping Marengo's order within each group.
    moments.sort((a, b) => Number(b.match) - Number(a.match));
    photos.sort((a, b) => Number(b.match) - Number(a.match));
    return { moments, photos };
  }

  /** Video durations learned from the API, so clip windows never run past the end. */
  private durations = new Map<string, number>();

  private async judgeClip(assetId: string, start: number, end: number, query: string) {
    const prompt = `Search query: "${query}". Look only at this clip. Does it show what the query asks for? Describe in one short sentence what in the clip matches the query (or what the clip shows instead, if it doesn't match).`;
    const run = (to: number) => this.judge({ video: { type: "asset_id", asset_id: assetId }, start_time: start, end_time: to, prompt });
    const known = this.durations.get(assetId);
    const to = Math.max(start + 1, known ? Math.min(end, known) : end);
    try {
      return await run(to);
    } catch (e) {
      // Search segments can end a few ms past the real duration; the error tells us the real one.
      const d = String(e instanceof Error ? e.message : e).match(/video duration \(([\d.]+) seconds\)/);
      if (!d) throw e;
      this.durations.set(assetId, Number(d[1]));
      return run(Math.min(end, Number(d[1])));
    }
  }

  private async judge(body: Record<string, unknown>): Promise<{ match: boolean; description: string }> {
    const data = await this.analyze({
      ...body,
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: { match: { type: "boolean" }, description: { type: "string" } },
          required: ["match", "description"],
        },
      },
    });
    return JSON.parse(data);
  }

  private async ensureIndex(): Promise<string> {
    if (this.store.indexId) return this.store.indexId;
    const client = this.client!;
    for await (const idx of await client.indexes.list()) {
      if (idx.indexName === INDEX_NAME && idx.id) return (this.store.indexId = idx.id);
    }
    const created = await client.indexes.create({
      indexName: INDEX_NAME,
      models: [{ modelName: SEARCH_MODEL, modelOptions: ["visual", "audio"] }],
    });
    return (this.store.indexId = created.id!);
  }

  private async waitFor(status: () => Promise<string>, timeoutMs = 10 * 60_000) {
    const until = Date.now() + timeoutMs;
    while (Date.now() < until) {
      const s = await status();
      if (s === "ready") return;
      if (s === "failed") throw new Error("TwelveLabs processing failed");
      await sleep(3000);
    }
    throw new Error("TwelveLabs processing timed out");
  }

  /** POST /analyze over REST: the pinned SDK predates image input. */
  private async analyze(body: Record<string, unknown>): Promise<string> {
    const res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "x-api-key": this.apiKey!, "content-type": "application/json" },
      body: JSON.stringify({ model_name: ANALYSIS_MODEL, stream: false, ...body }),
    });
    const json = (await res.json()) as { data?: string; finish_reason?: string; message?: string };
    if (!res.ok) throw new Error(`analyze ${res.status}: ${json.message ?? JSON.stringify(json)}`);
    if (json.finish_reason === "length" && body.response_format) throw new Error("analysis truncated (finish_reason=length)");
    return json.data ?? "";
  }
}
