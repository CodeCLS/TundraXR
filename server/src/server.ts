import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { Store, type Capture, type DeviceInfo, type ManualHit } from "./store.ts";
import { Manuals, type Hit } from "./manuals.ts";
import { VideoBrain } from "./twelvelabs.ts";
import { TundraCloud, parseCloudId, type CloudDevice } from "./cloud.ts";

const PORT = Number(process.env.PORT ?? 8787);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = process.env.DATA_DIR ?? path.join(root, "data");
const store = new Store(dataDir);
const manuals = new Manuals(path.join(root, "manuals"), path.join(dataDir, "manual-index"));
const clients = new Set<http.ServerResponse>();
let headsetSeenAt = 0;

function broadcast(event: string, data: unknown) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) res.write(msg);
}

const cloud = new TundraCloud(process.env.TUNDRA_API_KEY, dataDir);

const brain = new VideoBrain(process.env.TWELVELABS_API_KEY, store, (c) => broadcast("capture", c));

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "video/mp4": "mp4", "audio/mp4": "m4a" };
const MIME: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", png: "image/png", mp4: "video/mp4", m4a: "audio/mp4", html: "text/html; charset=utf-8" };

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "content-type": "application/json", "access-control-allow-origin": "*" });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage, limit = 500 * 1024 * 1024): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error("payload too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function status() {
  return {
    twelveLabs: brain.enabled,
    tundraCloud: cloud.enabled,
    indexId: store.indexId ?? null,
    headsetSeenAt,
    addresses: Object.values(os.networkInterfaces()).flat().filter((a) => a && a.family === "IPv4" && !a.internal).map((a) => a!.address),
  };
}

/** Serves media with Range support so the dashboard can seek videos to a finding. */
function serveFile(req: http.IncomingMessage, res: http.ServerResponse, file: string) {
  if (!fs.existsSync(file)) return json(res, 404, { error: "not found" });
  const size = fs.statSync(file).size;
  const type = MIME[path.extname(file).slice(1)] ?? "application/octet-stream";
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { "content-type": type, "content-length": end - start + 1, "content-range": `bytes ${start}-${end}/${size}`, "accept-ranges": "bytes" });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "content-type": type, "content-length": size, "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  }
}

/**
 * POST /api/captures
 * Body: raw media bytes (photo/video) or empty (note/question).
 * Header x-tundra-meta: URI-encoded JSON { sessionId, kind, at, device, text?, durationSec? }.
 */
async function createCapture(req: http.IncomingMessage, res: http.ServerResponse) {
  const meta = JSON.parse(decodeURIComponent(String(req.headers["x-tundra-meta"] ?? "{}"))) as {
    sessionId: string; kind: Capture["kind"]; at: string; device: DeviceInfo; text?: string; durationSec?: number;
  };
  if (!meta.sessionId || !meta.kind || !meta.device) return json(res, 400, { error: "missing meta" });
  const body = await readBody(req);
  const id = crypto.randomUUID().slice(0, 8);
  const c: Capture = {
    id,
    sessionId: meta.sessionId,
    kind: meta.kind,
    at: meta.at,
    createdAt: new Date().toISOString(),
    device: meta.device,
    text: meta.text,
    durationSec: meta.durationSec,
    tl: { upload: "skipped", analysis: "skipped", index: "skipped" },
    qa: [],
  };
  if (body.length > 0) {
    const mime = String(req.headers["content-type"] ?? "application/octet-stream").split(";")[0];
    c.file = `${id}.${EXT[mime] ?? "bin"}`;
    c.mime = mime;
    c.bytes = body.length;
    fs.writeFileSync(path.join(store.mediaDir, c.file), body);
  }
  if (brain.enabled && c.file && c.kind === "video") c.tl = { upload: "pending", analysis: "pending", index: "pending" };
  if (brain.enabled && c.file && c.kind === "photo") c.tl = { upload: "skipped", analysis: "pending", index: "skipped" };

  // A question from the headset: also look for matching moments in recorded video.
  if (c.kind === "question" && c.text && brain.enabled) {
    c.moments = await brain.search(c.text, 3).catch(() => []);
  }
  store.add(c);
  broadcast("capture", c);
  brain.process(c);
  sendToCloud(c);
  console.log(`[capture] ${c.kind} ${c.id} ${c.device.assetTag} ${c.bytes ? `${(c.bytes / 1e6).toFixed(1)} MB` : c.text ?? ""}`);
  json(res, 201, c);
}

/**
 * Captures of a hospital device also go to Tundra Cloud, attached to that device: photos as
 * images, notes and narration as protocols, and a video as a protocol describing it (the
 * cloud takes images and text, not video).
 */
function sendToCloud(c: Capture) {
  const ref = parseCloudId(c.device.id);
  if (!cloud.enabled || !ref) return;
  const stamp = new Date(c.createdAt).toISOString().slice(0, 16).replace("T", " ");
  const job = (async () => {
    if (c.kind === "photo" && c.file) {
      const bytes = fs.readFileSync(path.join(store.mediaDir, c.file));
      // Already in Tundra from the image search: attach that copy to the device instead.
      const known = searchedPhotos.get(sha(bytes));
      if (known) {
        await cloud.attachDocument(known, ref).catch((e) => console.warn(`[cloud] attach ${known}: ${e.message}`));
        return known;
      }
      return cloud.uploadImage(ref, bytes, c.mime ?? "image/jpeg", `TundraXR ${stamp} ${c.device.assetTag}.jpg`);
    }
    if (c.kind === "note" && c.text) {
      return cloud.uploadNote(ref, `TundraXR Notiz ${stamp}`, c.text);
    }
    if (c.kind === "video") {
      const mins = Math.floor((c.durationSec ?? 0) / 60);
      const secs = String((c.durationSec ?? 0) % 60).padStart(2, "0");
      return cloud.uploadNote(ref, `TundraXR Video ${stamp}`, `Video documentation recorded with TundraXR (${mins}:${secs}) for ${c.device.name} (${c.device.assetTag}). Stored on the engineer's laptop as ${c.file ?? "—"}.`);
    }
    return null;
  })();
  job.then((documentId) => {
    if (documentId === null) return;
    const updated = store.update(c.id, (x) => { x.cloud = { status: "sent", documentId }; });
    if (updated) broadcast("capture", updated);
    console.log(`[cloud] ${c.kind} ${c.id} → ${documentId}`);
  }).catch((e) => {
    const updated = store.update(c.id, (x) => { x.cloud = { status: "failed", error: e.message }; });
    if (updated) broadcast("capture", updated);
    console.warn(`[cloud] ${c.kind} ${c.id} failed: ${e.message}`);
  });
}

/** Shortens a passage to whole sentences for reading in the headset. */
function excerpt(text: string, max = 360): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > max * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "")) + " …";
}

/**
 * POST /api/ask { sessionId, device, question }
 * Answers from the device's real manual (the best-matching passage, quoted) plus
 * matching moments from recorded video. Logged in the session like any capture.
 */
async function ask(req: http.IncomingMessage, res: http.ServerResponse) {
  const { sessionId, device, question } = JSON.parse((await readBody(req)).toString() || "{}") as {
    sessionId: string; device?: DeviceInfo; question: string;
  };
  if (!sessionId || !question) return json(res, 400, { error: "sessionId and question are required" });
  // Hospital devices, and general questions (fleet, inspections…), go to the Tundra brain.
  if (cloud.enabled && (!device || parseCloudId(device.id))) return askCloud(res, sessionId, device ?? null, question);
  if (!device) return json(res, 200, { answer: "Tundra Cloud is off on this laptop, so only questions about a device can be answered.", manualHits: [], moments: [] });
  const entry = manuals.device(device.id);
  const hits: Hit[] = entry ? await manuals.search(entry.manual.id, question, 3) : [];
  const manualHits: ManualHit[] = hits.map((h) => ({
    manualId: entry!.manual.id, title: entry!.manual.title, page: h.page, section: h.section, text: excerpt(h.text), box: h.box,
  }));
  // Only moments recorded on this same device; footage of other equipment isn't an answer.
  const moments = brain.enabled
    ? (await brain.search(question, 6).catch(() => [])).filter((m) => store.get(m.captureId)?.device.id === device.id).slice(0, 3)
    : [];

  let answer: string;
  if (manualHits.length) {
    const [top, ...rest] = manualHits;
    answer = `${top.title}, p. ${top.page}${top.section ? ` · ${top.section}` : ""}:\n“${top.text}”`;
    if (rest.length) answer += `\n\nAlso see ${rest.map((h) => `p. ${h.page}${h.section ? ` (${h.section})` : ""}`).join(", ")}.`;
  } else {
    answer = entry ? `Nothing in the ${entry.manual.title} matches that. Try other words.` : "No manual on file for this device yet.";
  }
  if (moments.length) answer += `\n\n${moments.length} matching moment${moments.length === 1 ? "" : "s"} in recorded video, open on the laptop.`;

  const c: Capture = {
    id: crypto.randomUUID().slice(0, 8), sessionId, kind: "question", at: "", createdAt: new Date().toISOString(),
    device, text: question, answer, manualHits, moments, tl: { upload: "skipped", analysis: "skipped", index: "skipped" }, qa: [],
  };
  store.add(c);
  broadcast("capture", c);
  json(res, 200, { answer, manualHits, moments });
}

/** A question about a hospital device goes to the Tundra brain; its cited pages open in the manual. */
async function askCloud(res: http.ServerResponse, sessionId: string, device: DeviceInfo | null, question: string) {
  const t0 = Date.now();
  const ref = device ? parseCloudId(device.id) : null;
  const d = device ? await cloud.findDevice(device.id) : null;
  let r;
  try {
    r = await cloud.ask(sessionId, question, ref);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[cloud] ask failed: ${msg}`);
    return json(res, 200, { answer: `The Tundra brain couldn't answer: ${cloudReason(msg)}`, manualHits: [], moments: [] });
  }
  const manualDoc = d?.manual.documentId;
  // Pages in the device's own manual first: that's the document the headset has open.
  const sources = [...r.sources].sort((a, b) => Number(b.documentId === manualDoc) - Number(a.documentId === manualDoc));
  const manualHits: ManualHit[] = sources.filter((s) => s.pages.length && s.documentId === manualDoc).map((s) => ({
    manualId: s.documentId, title: s.title, page: s.pages[0], section: s.title, text: "",
  }));
  const answer = r.answer.replace(/\s*\[\d+\]/g, "").trim() || "The Tundra brain had no answer for that.";
  console.log(`[cloud] ask "${question.slice(0, 60)}" → ${answer.length} chars, ${r.sources.length} sources in ${Date.now() - t0} ms`);
  const c: Capture = {
    id: crypto.randomUUID().slice(0, 8), sessionId, kind: "question", at: "", createdAt: new Date().toISOString(),
    device: device ?? GENERAL, text: question, answer, manualHits, moments: [], tl: { upload: "skipped", analysis: "skipped", index: "skipped" }, qa: [],
  };
  store.add(c);
  broadcast("capture", c);
  json(res, 200, {
    answer, manualHits, moments: [], sources: r.sources, conversationId: r.conversationId,
    charts: r.charts, tables: r.tables, followUps: r.followUps, notices: r.notices,
  });
}

/** Questions that aren't about one device are logged against the hospital as a whole. */
const GENERAL: DeviceInfo = { id: "hospital", name: "Hospital", manufacturer: "", category: "General", assetTag: "—", serial: "", location: "" } as DeviceInfo;

/** The cloud's error codes, as something an engineer can act on. */
function cloudReason(msg: string): string {
  if (msg.includes("feature_not_allowed")) return "this key isn't allowed to use that feature (gateway → Admin → API & MCP).";
  if (msg.includes("cloud_text_off")) return "text over the cloud is off on the gateway.";
  if (msg.includes("budget_exhausted")) return "the hospital's AI budget is used up.";
  if (msg.includes("image_search")) return "Tundra's image search is unavailable right now.";
  if (msg.includes("images_off")) return "device photos are off on the gateway.";
  if (msg.includes("invalid_key")) return "the API key isn't valid.";
  if (msg.includes("not_found") || msg.includes("404")) return "not found in the hospital's records.";
  return msg.slice(0, 160);
}

/**
 * POST /api/transcribe  (body: 16 kHz mono WAV)
 * Speech-to-text on the laptop with whisper.cpp, for when the headset's own recognizer fails.
 */
const WHISPER = process.env.WHISPER_CLI ?? "whisper-cli";
const WHISPER_MODEL = process.env.WHISPER_MODEL ?? path.join(root, "models", "ggml-base.en.bin");
async function transcribe(req: http.IncomingMessage, res: http.ServerResponse) {
  const wav = await readBody(req, 50 * 1024 * 1024);
  if (!fs.existsSync(WHISPER_MODEL)) return json(res, 501, { error: "No whisper model at server/models/ggml-base.en.bin" });
  const tmp = path.join(os.tmpdir(), `tundra-${crypto.randomUUID()}.wav`);
  fs.writeFileSync(tmp, wav);
  const t0 = Date.now();
  execFile(WHISPER, ["-m", WHISPER_MODEL, "-f", tmp, "-l", "en", "-nt", "-np"], { timeout: 60_000 }, (err, stdout) => {
    fs.rmSync(tmp, { force: true });
    if (err) return json(res, 500, { error: `whisper failed: ${err.message}` });
    const text = stdout.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
    console.log(`[voice] transcribed ${(wav.length / 32000).toFixed(1)} s in ${Date.now() - t0} ms: "${text.slice(0, 80)}"`);
    json(res, 200, { text });
  });
}

/** The first whisper run compiles GPU shaders (~15 s); do it at startup, not on the first question. */
function warmUpWhisper() {
  if (!fs.existsSync(WHISPER_MODEL)) return;
  const tmp = path.join(os.tmpdir(), "tundra-warmup.wav");
  const pcm = Buffer.alloc(16000 * 2); // 1 s of silence
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8);
  header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(tmp, Buffer.concat([header, pcm]));
  const t0 = Date.now();
  execFile(WHISPER, ["-m", WHISPER_MODEL, "-f", tmp, "-nt", "-np"], { timeout: 120_000 }, (err) => {
    fs.rmSync(tmp, { force: true });
    console.log(err ? `[voice] whisper unavailable: ${err.message}` : `[voice] whisper ready (${Date.now() - t0} ms warm-up)`);
  });
}
warmUpWhisper();

async function devices() {
  // With Tundra Cloud on, the inventory is the hospital's real records only; the local OEM
  // catalog (server/manuals) is the offline demo and only used without a key.
  if (cloud.enabled) {
    const remote = await cloud.devices().catch((e) => { console.warn(`[cloud] devices: ${e.message}`); return [] as CloudDevice[]; });
    return Promise.all(remote.map(toHeadsetDevice));
  }
  return Promise.all(manuals.devices.map(async (d) => ({ ...d, manual: { ...d.manual, pages: await manuals.pages(d.manual.id), url: `/manuals/${d.manual.id}.pdf` } })));
}

async function toHeadsetDevice(d: CloudDevice) {
  const doc = d.manual.documentId;
  // PDFs open in the page viewer; text manuals (the hospital's markdown copies) as sections.
  const sections = doc && !d.manual.isPdf ? await cloud.documentSections(doc).catch(() => []) : [];
  return {
    id: d.id, name: d.name, manufacturer: d.manufacturer, category: d.model || "Medical device",
    assetTag: d.assetTag, serial: d.serial, location: d.location, lastPm: d.lastPm, openWorkOrders: d.openWorkOrders,
    manual: {
      id: doc ?? `none-${d.ref.key}`,
      title: doc ? d.manual.title : "No manual on file",
      docNumber: d.manual.revision,
      pages: 0,
      url: doc && d.manual.isPdf ? `/cloud/documents/${encodeURIComponent(doc)}.pdf` : null,
      sections,
    },
  };
}

/** Photos Tundra already holds from an image search, by content hash, so they aren't uploaded twice. */
const searchedPhotos = new Map<string, string>();
const sha = (b: Buffer) => crypto.createHash("sha1").update(b).digest("hex");

/**
 * POST /api/identify  (body: JPEG; header x-tundra-meta { sessionId })
 * "Which device am I looking at": Tundra's image search, then each match's record.
 */
async function identify(req: http.IncomingMessage, res: http.ServerResponse) {
  const image = await readBody(req, 20 * 1024 * 1024);
  if (!cloud.enabled) return json(res, 503, { error: "Tundra Cloud is off on this laptop (no TUNDRA_API_KEY)." });
  if (image.length < 100) return json(res, 400, { error: "no image" });
  const t0 = Date.now();
  let out;
  try {
    out = await cloud.imageSearch(image, String(req.headers["content-type"] ?? "image/jpeg").split(";")[0]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[cloud] image search failed: ${msg}`);
    return json(res, 502, { error: cloudReason(msg) });
  }
  if (out.documentId) searchedPhotos.set(sha(image), out.documentId);
  const devices = await Promise.all(out.picks.slice(0, 3).map((p) => cloud.device(p.ref).then(toHeadsetDevice).catch(() => null)));
  const matches = out.picks.slice(0, 3).map((p, i) => ({
    label: devices[i] ? `${devices[i]!.name || devices[i]!.category} · ${devices[i]!.assetTag}` : p.label.replace(/<PSN-[^>]+>\s*·?\s*/g, ""),
    score: p.score,
    detail: i === 0 && out.read ? `Read: ${out.read}${p.on.startsWith("search") ? "" : ` · matched on ${p.on}`}` : null,
    device: devices[i],
  }));
  if (!matches.length && out.read) matches.push({ label: out.read, score: 0, detail: out.identified?.is_device === false ? "Not a medical device · not in the hospital's records" : "Not in the hospital's records", device: null });
  console.log(`[cloud] identify: read "${out.read}" → ${out.picks.length} matches in ${Date.now() - t0} ms`);
  json(res, 200, { matches, documentId: out.documentId });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const p = url.pathname;
  if (req.headers["user-agent"]?.includes("TundraXR")) {
    headsetSeenAt = Date.now();
  }
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST" });
      return res.end();
    }
    if (req.method === "GET" && (p === "/" || p === "/index.html")) return serveFile(req, res, path.join(root, "public", "index.html"));
    if (req.method === "GET" && p === "/api/devices") return json(res, 200, await devices());
    if (req.method === "GET" && p === "/api/devices/search") {
      const q = url.searchParams.get("q") ?? "";
      if (!cloud.enabled || q.length < 2) return json(res, 200, []);
      const hits = await cloud.search(q).catch((e) => { console.warn(`[cloud] search: ${e.message}`); return []; });
      const found = await Promise.all(hits.slice(0, 5).map((h) => cloud.device(h.ref).catch(() => null)));
      return json(res, 200, await Promise.all(found.filter((d): d is CloudDevice => !!d).map(toHeadsetDevice)));
    }
    const pdf = p.match(/^\/manuals\/([\w-]+)\.pdf$/);
    if (req.method === "GET" && pdf) {
      const file = manuals.file(pdf[1]);
      return file ? serveFile(req, res, file) : json(res, 404, { error: "unknown manual" });
    }
    const cloudDoc = p.match(/^\/cloud\/documents\/(.+)\.pdf$/);
    if (req.method === "GET" && cloudDoc) {
      if (!cloud.enabled) return json(res, 404, { error: "Tundra Cloud is off" });
      return serveFile(req, res, await cloud.documentFile(decodeURIComponent(cloudDoc[1])));
    }
    if (req.method === "POST" && p === "/api/ask") return await ask(req, res);
    if (req.method === "POST" && p === "/api/identify") return await identify(req, res);
    if (req.method === "POST" && p === "/api/transcribe") return await transcribe(req, res);
    if (req.method === "GET" && p.startsWith("/media/")) return serveFile(req, res, path.join(store.mediaDir, path.basename(p)));
    if (req.method === "GET" && p === "/api/state") return json(res, 200, { ...status(), captures: store.all() });
    if (req.method === "GET" && p === "/api/captures") {
      const sid = url.searchParams.get("sessionId");
      return json(res, 200, store.all().filter((c) => !sid || c.sessionId === sid));
    }
    if (req.method === "GET" && p === "/api/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
      res.write(`event: status\ndata: ${JSON.stringify(status())}\n\n`);
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (req.method === "POST" && p === "/api/captures") return await createCapture(req, res);
    if (req.method === "POST" && p === "/api/search") {
      const { query } = JSON.parse((await readBody(req)).toString() || "{}");
      if (!brain.enabled) return json(res, 400, { error: "Set TWELVELABS_API_KEY in server/.env to search videos." });
      return json(res, 200, await brain.searchAll(String(query ?? "")));
    }
    const videoAsk = p.match(/^\/api\/captures\/([\w-]+)\/ask$/);
    if (req.method === "POST" && videoAsk) {
      const c = store.get(videoAsk[1]);
      if (!c) return json(res, 404, { error: "not found" });
      const { question } = JSON.parse((await readBody(req)).toString() || "{}");
      const answer = await brain.askVideo(c, String(question));
      const updated = store.update(c.id, (x) => x.qa.push({ question: String(question), answer, at: new Date().toISOString() }))!;
      broadcast("capture", updated);
      return json(res, 200, updated);
    }
    json(res, 404, { error: "not found" });
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e instanceof Error ? e.message : String(e) });
  }
});

// Media that arrived while TwelveLabs was off (no key yet) gets analyzed once it's on.
if (brain.enabled) {
  for (const c of store.all()) {
    if (!c.file || c.tl.analysis !== "skipped" || (c.kind !== "photo" && c.kind !== "video")) continue;
    store.update(c.id, (x) => {
      x.tl = c.kind === "video" ? { upload: "pending", analysis: "pending", index: "pending" } : { upload: "skipped", analysis: "pending", index: "skipped" };
    });
    brain.process(c);
    console.log(`[twelvelabs] queued earlier ${c.kind} ${c.id}`);
  }
}

// USB headsets reach the brain through `adb reverse`, which is dropped whenever the headset
// reconnects or sleeps. Re-apply it to every connected device so the tunnel heals itself.
const ADB = process.env.ADB ?? path.join(os.homedir(), "Library/Android/sdk/platform-tools/adb");
const tunneled = new Set<string>();
function keepTunnels() {
  execFile(ADB, ["devices"], (err, out) => {
    if (err) return; // no adb on this machine: Wi-Fi only
    const serials = out.split("\n").slice(1).map((l) => l.split("\t")).filter(([, st]) => st?.trim() === "device").map(([sn]) => sn);
    for (const sn of serials) {
      execFile(ADB, ["-s", sn, "reverse", `tcp:${PORT}`, `tcp:${PORT}`], (e) => {
        if (!e && !tunneled.has(sn)) console.log(`[adb] tunnel up for ${sn}`);
        if (e) tunneled.delete(sn); else tunneled.add(sn);
      });
    }
  });
}
keepTunnels();
setInterval(keepTunnels, 4000);

// Lets the dashboard show "headset connected" without the headset polling for it.
setInterval(() => broadcast("status", status()), 5000);

server.listen(PORT, "0.0.0.0", () => {
  const s = status();
  console.log(`\n  Tundra brain (local) · http://localhost:${PORT}`);
  for (const a of s.addresses) console.log(`  On Wi-Fi the headset can reach it at http://${a}:${PORT}`);
  console.log(`  TwelveLabs: ${brain.enabled ? "enabled" : "disabled — add TWELVELABS_API_KEY to server/.env"}`);
  console.log(`  Tundra Cloud: ${cloud.enabled ? "enabled" : "disabled — add TUNDRA_API_KEY (tgk_…) to server/.env"}\n`);
  if (cloud.enabled) {
    cloud.whoami().then((w) => console.log(`[cloud] key ok · text ${w.cloud_text ? "allowed" : "OFF (chat/search/devices/uploads need it)"} · levels ${JSON.stringify(w.access ?? w.levels ?? {})}`))
      .catch((e) => console.warn(`[cloud] ${e.message}`));
    cloud.devices().then((d) => console.log(`[cloud] ${d.length} devices in the inventory`)).catch((e) => console.warn(`[cloud] devices: ${e.message}`));
  }
});
