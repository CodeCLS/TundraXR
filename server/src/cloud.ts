import fs from "node:fs";
import path from "node:path";

/**
 * Client for the Tundra Cloud external API (https://app.tundrahealth.ai/api/external).
 * The hospital's key stays on this laptop; the headset only ever talks to this server.
 */

export interface CloudRef { dataset: string; key: string }

/** A device from the hospital's records, flattened to what the headset shows. */
export interface CloudDevice {
  id: string; // "cloud:" + dataset + "\u0000" + key, opaque to the headset
  ref: CloudRef;
  name: string;
  manufacturer: string;
  model: string;
  assetTag: string;
  serial: string;
  location: string;
  lastPm: string;
  openWorkOrders: number;
  manual: { documentId: string | null; title: string; revision: string; portalUrl: string | null; isPdf: boolean };
}

export interface ImageSearchOutcome {
  /** The photo, as Tundra stored it in the Library. */
  documentId: string | null;
  identified: any;
  /** What Tundra read off the device, e.g. "Nespresso · Kaffeemaschine". */
  read: string;
  picks: { ref: CloudRef; label: string; score: number; on: string }[];
}

export interface CloudSource { n: number; documentId: string; title: string; pages: number[] }
export interface CloudAnswer {
  answer: string;
  sources: CloudSource[];
  conversationId?: string;
  status: string;
  /** Charts as the website draws them: spec plus points already resolved by the server. */
  charts: any[];
  /** The query results behind the answer (`data` events): { dataset, columns, rows, row_count, truncated }. */
  tables: any[];
  followUps: string[];
  notices: string[];
}

const BASE = process.env.TUNDRA_API_BASE ?? "https://app.tundrahealth.ai/api/external";
const enc = encodeURIComponent;

export function cloudId(ref: CloudRef) { return `cloud:${ref.dataset}\u0000${ref.key}`; }
export function parseCloudId(id: string): CloudRef | null {
  if (!id.startsWith("cloud:")) return null;
  const [dataset, key] = id.slice(6).split("\u0000");
  return dataset && key ? { dataset, key } : null;
}

export class TundraCloud {
  readonly key: string | undefined;
  readonly docsDir: string;
  private devicesCache: { at: number; devices: CloudDevice[] } | null = null;
  /** Conversation per headset session, so follow-up questions keep their context. */
  private conversations = new Map<string, string>();

  constructor(key: string | undefined, dataDir: string) {
    this.key = key?.trim() || undefined;
    this.docsDir = path.join(dataDir, "cloud-docs");
    fs.mkdirSync(this.docsDir, { recursive: true });
  }

  get enabled() { return !!this.key; }

  private async call(method: string, p: string, body?: unknown, accept = "application/json"): Promise<Response> {
    const res = await fetch(BASE + p, {
      method,
      headers: {
        authorization: `Bearer ${this.key}`,
        accept,
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(35_000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let code = "";
      try { code = JSON.parse(text).error ?? ""; } catch { /* not JSON */ }
      throw new Error(`Tundra Cloud ${method} ${p} → ${res.status}${code ? ` ${code}` : ""}: ${text.slice(0, 200)}`);
    }
    return res;
  }

  private async get<T>(p: string): Promise<T> { return (await this.call("GET", p)).json() as Promise<T>; }
  private async post<T>(p: string, body: unknown): Promise<T> { return (await this.call("POST", p, body)).json() as Promise<T>; }

  /** What this key is and can reach. */
  async whoami(): Promise<any> { return this.get("/"); }

  /** Device rows matching q. The same device can come from several datasets; the connector's wins. */
  async search(q: string, schemas = ["device"]): Promise<{ ref: CloudRef; label: string }[]> {
    const r = await this.post<any>("/records/search", { q, schemas });
    const groups = [...(r.groups ?? [])].sort((a: any, b: any) => Number(String(b.dataset_id).startsWith("connector")) - Number(String(a.dataset_id).startsWith("connector")));
    const out: { ref: CloudRef; label: string }[] = [];
    for (const g of groups) for (const h of g.hits ?? []) {
      if (!out.some((o) => o.ref.key === String(h.key))) out.push({ ref: { dataset: g.dataset_id, key: String(h.key) }, label: String(h.label ?? h.key) });
    }
    return out;
  }

  async device(ref: CloudRef): Promise<CloudDevice> {
    const r = await this.get<any>(`/devices/${enc(ref.dataset)}/${enc(ref.key)}`);
    const d = r.device ?? {};
    const k = r.kpis ?? {};
    const m = r.manual ?? null;
    const model = clean(d.model);
    const type = clean(d.name); // the device type, e.g. "Beatmungsgerät"
    const manufacturer = clean(d.manufacturer);
    // The manual: the model's own (hospital copy), else a document of kind "manual" on the device.
    const documentId: string | null = m?.document_id ?? (r.documents ?? []).find((x: any) => x.kind === "manual")?.document_id ?? null;
    const meta = documentId ? await this.documentMeta(documentId).catch(() => null) : null;
    return {
      id: cloudId(ref),
      ref,
      name: [manufacturer, model].filter(Boolean).join(" ") || type || String(d.label ?? ref.key),
      manufacturer,
      model: type || model,
      assetTag: String(d.inventory_number ?? ref.key),
      serial: String(d.serial_number ?? ""),
      location: String(d.location ?? ""),
      lastPm: fmtDate(k.last_inspection_at) + (k.inspection_overdue ? " · overdue" : ""),
      openWorkOrders: Number(k.open_work_orders ?? 0),
      manual: {
        documentId: meta ? documentId : null,
        // File names can be masked (<PSN-…>.pdf); then name it after the device.
        title: clean(meta?.title).replace(/\.pdf$/i, "") || (m?.doc_number ? `Manual ${m.doc_number}` : `${type || model || "Device"} · Manual`),
        revision: String(m?.revision ?? m?.doc_number ?? ""),
        portalUrl: m?.portal_url ?? null,
        isPdf: meta?.contentType?.includes("pdf") ?? false,
      },
    };
  }

  private docMeta = new Map<string, { title: string; contentType: string }>();

  /** A document's title and type (from its download info), cached. */
  async documentMeta(documentId: string): Promise<{ title: string; contentType: string }> {
    const hit = this.docMeta.get(documentId);
    if (hit) return hit;
    const r = await this.get<any>(`/documents/${enc(documentId)}/download`);
    const meta = { title: String(r.title ?? "Manual"), contentType: String(r.content_type ?? "") };
    this.docMeta.set(documentId, meta);
    return meta;
  }

  /** A manual that isn't a PDF (e.g. the hospital's markdown copies): its text, as sections. */
  async documentSections(documentId: string): Promise<{ title: string; text: string }[]> {
    const r = await this.call("GET", `/documents/${enc(documentId)}/text`);
    const type = r.headers.get("content-type") ?? "";
    const text = type.includes("json") ? String(((await r.json()) as any).text ?? "") : await r.text();
    const sections: { title: string; text: string }[] = [];
    let current = { title: "", text: "" };
    for (const line of text.split("\n")) {
      const h = line.match(/^#{1,3}\s+(.*)/);
      if (h) {
        if (current.title || current.text.trim()) sections.push(current);
        current = { title: h[1].trim(), text: "" };
      } else current.text += line + "\n";
    }
    if (current.title || current.text.trim()) sections.push(current);
    return sections.map((x) => ({ title: x.title, text: x.text.trim() })).filter((x) => x.title || x.text);
  }

  /**
   * Which device a photo shows. Tundra reads the type plate and matches serial, inventory number
   * or model against the records. When that finds nothing (e.g. the model is masked in the
   * records), fall back to searching the records for what it recognised.
   */
  async imageSearch(image: Buffer, mediaType: string): Promise<ImageSearchOutcome> {
    const r = await this.post<any>("/image-search", { image: image.toString("base64"), media_type: mediaType });
    const id = r.identified ?? {};
    const seen = new Set<string>();
    const picks: { ref: CloudRef; label: string; score: number; on: string }[] = [];
    for (const [i, m] of (r.matches ?? []).entries()) {
      const k = `${m.key}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const base = m.matched_on === "serial" ? 0.98 : m.matched_on === "inventory" ? 0.96 : id.confidence === "high" ? 0.86 : id.confidence === "medium" ? 0.7 : 0.5;
      picks.push({ ref: { dataset: m.dataset, key: k }, label: String(m.label ?? k), score: Math.max(0.2, base - i * 0.04), on: m.matched_on ?? "model" });
    }
    if (!picks.length) {
      // "Kaffeemaschine (kein Medizingerät)" → "Kaffeemaschine"; masked or empty values are skipped.
      const plain = (v: unknown) => clean(v).replace(/\s*\(.*?\)\s*/g, " ").trim();
      const queries = [...new Set([plain(id.serial_number), plain(id.inventory_number), plain(id.device_type), plain(id.model), plain(id.manufacturer)].filter((q) => q.length >= 2))];
      // All at once: the records search is slow enough that one after another adds up.
      const results = await Promise.all(queries.map((q) => this.search(q).then((hits) => ({ q, hits })).catch(() => ({ q, hits: [] as { ref: CloudRef; label: string }[] }))));
      for (const { q, hits } of results) {
        for (const h of hits) {
          if (seen.has(h.ref.key) || picks.length >= 5) continue;
          seen.add(h.ref.key);
          picks.push({ ref: h.ref, label: h.label, score: Math.max(0.2, 0.62 - picks.length * 0.06), on: `search “${q}”` });
        }
      }
    }
    const read = [clean(id.manufacturer), clean(id.model), clean(id.device_type)].filter(Boolean).join(" · ");
    return { documentId: r.document_id ?? null, identified: id, read, picks: picks.slice(0, 5) };
  }

  async attachDocument(documentId: string, ref: CloudRef) {
    await this.post(`/documents/${enc(documentId)}/device`, { device: ref });
  }

  /**
   * The headset's inventory: devices of the models in service (a few per model), each with
   * its manual. Cached for a few minutes; the records don't change while someone's wearing it.
   */
  async devices(limit = 12): Promise<CloudDevice[]> {
    if (this.devicesCache && Date.now() - this.devicesCache.at < 5 * 60_000) return this.devicesCache.devices;
    const { models = [] } = await this.get<{ models: { model_key: string; manufacturer: string; model: string }[] }>("/models");
    const refs: CloudRef[] = [];
    for (const m of models) {
      if (refs.length >= limit) break;
      if (m.model.includes("<PSN-")) continue; // masked in the records: can't be searched by name
      const hits = await this.search(m.model).catch(() => []);
      for (const h of hits.slice(0, 2)) if (refs.length < limit && !refs.some((r) => r.key === h.ref.key)) refs.push(h.ref);
    }
    const devices = (await Promise.all(refs.map((r) => this.device(r).catch((e) => { console.warn(`[cloud] device ${r.key}: ${e.message}`); return null; }))))
      .filter((d): d is CloudDevice => !!d);
    // Devices with their own manual first: those are the ones the headset can open.
    devices.sort((a, b) => Number(!!b.manual.documentId) - Number(!!a.manual.documentId));
    this.devicesCache = { at: Date.now(), devices };
    return devices;
  }

  async findDevice(id: string): Promise<CloudDevice | null> {
    const ref = parseCloudId(id);
    if (!ref) return null;
    return (await this.devices()).find((d) => d.id === id) ?? this.device(ref).catch(() => null);
  }

  /** Downloads a document's PDF once (the download link is short-lived) and returns the local path. */
  async documentFile(documentId: string): Promise<string> {
    const file = path.join(this.docsDir, `${documentId.replace(/[^\w-]/g, "_")}.pdf`);
    if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
    const link = await this.get<any>(`/documents/${enc(documentId)}/download`);
    const url = typeof link === "string" ? link : link.download_url ?? link.url;
    if (!url) throw new Error(`no download link for ${documentId}`);
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) throw new Error(`download ${documentId} → ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    return file;
  }

  /**
   * Asks the brain, scoped to the device. Reads the SSE stream; if the answer moves to a
   * background job, polls the thread until that turn is finished.
   */
  async ask(sessionId: string, question: string, ref: CloudRef | null, language = "en"): Promise<CloudAnswer> {
    const body: any = { question, language };
    if (ref) body.device = ref;
    const conversation = this.conversations.get(sessionId);
    if (conversation) body.conversation_id = conversation;
    const res = await this.call("POST", "/chat", body, "text/event-stream");
    let answer = "";
    let sources: CloudSource[] = [];
    const charts = new Map<string, any>();
    const tables = new Map<string, any>();
    let followUps: string[] = [];
    const notices: string[] = [];
    const take = (event: string, data: any) => {
      if (event === "chart" && data?.id) charts.set(data.id, data);
      else if (event === "data" && data?.dataset) tables.set(data.dataset, data);
      else if (event === "follow_ups") followUps = data?.questions ?? [];
      else if (event === "notice" && data?.text) notices.push(data.text);
    };
    let conversationId: string | undefined;
    let seq: number | undefined;
    let job = false;
    let error: string | undefined;
    for await (const { event, data } of sse(res)) {
      if (event === "conversation") { conversationId = data.conversation_id; seq = data.seq; }
      else if (event === "token") answer += data.text ?? "";
      else if (event === "sources") sources = toSources(data.passages);
      else if (event === "job") job = true;
      else if (event === "error") error = data.message ?? data.error ?? "error";
      else take(event, data);
    }
    if (conversationId) this.conversations.set(sessionId, conversationId);
    if (error && !answer) throw new Error(`Tundra Cloud chat: ${error}`);
    if (job && conversationId) {
      const deadline = Date.now() + 90_000;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 1500));
        const t = await this.get<any>(`/chat/threads/${enc(conversationId)}`);
        const turns = t.turns ?? [];
        const turn = turns.find((x: any) => x.seq === seq && x.role === "assistant") ?? turns.filter((x: any) => x.role === "assistant").at(-1);
        if (turn && turn.status !== "running") {
          answer = String(turn.content ?? answer);
          for (const e of turn.events ?? []) {
            const name = e.name ?? e.event ?? e.type;
            if (name === "sources") sources = toSources((e.data ?? e).passages);
            else take(name, e.data ?? e);
          }
          break;
        }
      }
    }
    // Charts the answer names but whose dataset is also shown as a chart don't need the raw table too.
    const charted = new Set([...charts.values()].map((c) => c.spec?.dataset).filter(Boolean));
    return {
      answer: answer.trim(), sources, conversationId, status: job ? "job" : "done",
      charts: [...charts.values()], tables: [...tables.values()].filter((t) => !charted.has(t.dataset)), followUps, notices,
    };
  }

  async uploadImage(ref: CloudRef, image: Buffer, mediaType: string, filename: string): Promise<string> {
    const r = await this.post<any>("/library/images", { image: image.toString("base64"), media_type: mediaType, filename, device: ref });
    return String(r.document_id ?? "");
  }

  async uploadNote(ref: CloudRef, filename: string, text: string, kind = "protocol"): Promise<string> {
    const r = await this.post<any>("/library/files", { filename, text, kind, device: ref });
    return String(r.document_id ?? "");
  }
}

function toSources(passages: any[] | undefined): CloudSource[] {
  return (passages ?? []).map((p: any) => ({ n: Number(p.n), documentId: String(p.document_id), title: String(p.title ?? ""), pages: (p.pages ?? []).map(Number) }));
}

/** Masked values (<PSN-…>) aren't worth showing. */
function clean(v: unknown): string {
  const s = String(v ?? "").trim();
  return s.includes("<PSN-") ? "" : s;
}

function fmtDate(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Parses a text/event-stream body into { event, data } frames. */
async function* sse(res: Response): AsyncGenerator<{ event: string; data: any }> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const frame = buf.slice(0, i);
      buf = buf.slice(i + 2);
      let event = "message";
      const data: string[] = [];
      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
      }
      if (!data.length) continue;
      let parsed: any = data.join("\n");
      try { parsed = JSON.parse(parsed); } catch { /* plain text */ }
      yield { event, data: parsed };
    }
  }
}
