import fs from "node:fs";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface CatalogDevice {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  assetTag: string;
  serial: string;
  location: string;
  lastPm: string;
  openWorkOrders: number;
  manual: { id: string; file: string; title: string; docNumber: string; kind: string };
}

/** A paragraph-ish block of text on one page with its box in page fractions (top-left origin). */
export interface Passage {
  page: number;
  text: string;
  section: string;
  box: [number, number, number, number];
}

interface ManualIndex {
  id: string;
  pages: number;
  passages: Passage[];
  mtimeMs: number;
  version: number;
}

/** Bump when passage extraction changes so cached indexes are rebuilt. */
const INDEX_VERSION = 3;

export interface Hit extends Passage {
  score: number;
}

// ── Indexing ──────────────────────────────────────────────────────────────────

type Item = { str: string; transform: number[]; width: number; height: number; hasEOL?: boolean };
type Line = { text: string; x0: number; x1: number; top: number; bottom: number; size: number };

async function indexPdf(id: string, file: string): Promise<ManualIndex> {
  const task = getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 });
  const doc = await task.promise;
  const passages: Passage[] = [];
  let section = "";
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const lines = toLines(content.items as Item[]);
    if (!lines.length) continue;
    const body = median(lines.map((l) => l.size));
    for (const block of toBlocks(lines)) {
      const text = block.map((l) => l.text).join(" ").replace(/(\w)- (\w)/g, "$1$2").replace(/\s+/g, " ").trim();
      if (text.length < 3) continue;
      section = headingOf(text, block, body) ?? section;
      const [ax, ay] = vp.convertToViewportPoint(Math.min(...block.map((l) => l.x0)), Math.max(...block.map((l) => l.top)));
      const [bx, by] = vp.convertToViewportPoint(Math.max(...block.map((l) => l.x1)), Math.min(...block.map((l) => l.bottom)));
      const pad = 4;
      passages.push({
        page: p,
        text,
        section,
        box: [
          clamp((Math.min(ax, bx) - pad) / vp.width),
          clamp((Math.min(ay, by) - pad) / vp.height),
          clamp((Math.max(ax, bx) + pad) / vp.width),
          clamp((Math.max(ay, by) + pad) / vp.height),
        ],
      });
    }
    page.cleanup();
  }
  const pages = doc.numPages;
  await task.destroy();
  return { id, pages, passages, mtimeMs: fs.statSync(file).mtimeMs, version: INDEX_VERSION };
}

function toLines(items: Item[]): Line[] {
  const lines: Line[] = [];
  let cur: Line | null = null;
  let breakNext = false;
  for (const it of items) {
    const size = Math.abs(it.transform[3]) || it.height || 10;
    const x = it.transform[4];
    const y = it.transform[5];
    if (it.str.trim() === "") {
      if (it.hasEOL) breakNext = true;
      if (cur && it.str.length) cur.text += " ";
      continue;
    }
    const sameLine = cur && !breakNext && Math.abs(y - (cur.bottom + cur.size * 0.22)) < size * 0.6;
    if (!sameLine) {
      cur = { text: "", x0: x, x1: x, top: y + size * 0.8, bottom: y - size * 0.22, size };
      lines.push(cur);
    }
    cur!.text += it.str;
    cur!.x0 = Math.min(cur!.x0, x);
    cur!.x1 = Math.max(cur!.x1, x + it.width);
    cur!.top = Math.max(cur!.top, y + size * 0.8);
    cur!.bottom = Math.min(cur!.bottom, y - size * 0.22);
    cur!.size = Math.max(cur!.size, size);
    breakNext = Boolean(it.hasEOL);
  }
  return lines.filter((l) => l.text.trim());
}

/** Groups consecutive lines into blocks, splitting on paragraph gaps, font changes and column jumps. */
function toBlocks(lines: Line[]): Line[][] {
  const blocks: Line[][] = [];
  let cur: Line[] = [];
  let chars = 0;
  for (const l of lines) {
    const prev = cur.at(-1);
    const gap = prev ? prev.bottom - l.top : 0;
    const split = !prev
      || gap > prev.size * 0.9
      || gap < -prev.size * 2 // jumped back up: new column or out-of-order item
      || Math.abs(l.size - prev.size) > prev.size * 0.15
      || chars > 700;
    if (split && cur.length) {
      blocks.push(cur);
      cur = [];
      chars = 0;
    }
    cur.push(l);
    chars += l.text.length;
  }
  if (cur.length) blocks.push(cur);
  return blocks;
}

/**
 * Section title for a block, if it starts one: numbered headings ("6.4.2 Replacing the Battery",
 * "D.8.1 Short Self Test") or short larger-than-body lines ("5 Troubleshooting").
 * Figure/table captions and table-of-contents lines are not sections.
 */
function headingOf(text: string, block: Line[], body: number): string | undefined {
  if (/^(Figure|Table)\b/i.test(text) || /\.{4,}|(\s\.){4,}/.test(text)) return undefined;
  const numbered = text.match(/^((?:\d{1,2}|[A-Z])(?:\.\d{1,2}){1,3})\s+([A-Z][^.:]{2,60}?)(?=\s+(?:\d{1,2}|[A-Z])(?:\.\d{1,2})+\s|\s+(?:Warning|Caution|Note|WARNING|CAUTION|NOTE)\b|\s*[.:]|\s+\d+\.\s|$)/);
  if (numbered) return `${numbered[1]} ${numbered[2].trim()}`;
  if (block.length <= 2 && block[0].size >= body * 1.15 && text.length < 70 && !/^\d+$/.test(text)) return text;
  return undefined;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 10;

// ── Search ────────────────────────────────────────────────────────────────────

const STOP = new Set("a an and are as at be by can do does for from how i if in is it its me my of on or should the this to was what when where which who why with you your there their then than that these those into about after before during".split(" "));

// Engineers ask in shop-floor terms; manuals use formal ones.
const SYNONYMS: Record<string, string[]> = {
  pm: ["preventive", "maintenance"],
  maintenance: ["preventive", "service"],
  error: ["code", "alarm", "fault"],
  alarm: ["alarm", "message"],
  fault: ["error", "failure"],
  calibrate: ["calibration"],
  test: ["verification", "check"],
  check: ["test", "verification"],
  safety: ["electrical", "leakage"],
  replace: ["replacement", "removal", "install"],
  battery: ["battery", "batteries"],
  clean: ["cleaning", "disinfect"],
  spo2: ["oxygen", "saturation"],
};

/** Light suffix stripping so replace / replacing / replaced / replacement all meet. */
function stem(w: string): string {
  if (w.length > 7 && w.endsWith("ment")) w = w.slice(0, -4);
  else if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith("es")) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

const tokens = (s: string) => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOP.has(w)).map(stem);

export class Manuals {
  readonly devices: CatalogDevice[];
  private dir: string;
  private cacheDir: string;
  private indexes = new Map<string, Promise<ManualIndex>>();

  constructor(dir: string, cacheDir: string) {
    this.dir = dir;
    this.cacheDir = cacheDir;
    fs.mkdirSync(cacheDir, { recursive: true });
    const catalog = path.join(dir, "catalog.json");
    const listed: CatalogDevice[] = fs.existsSync(catalog) ? JSON.parse(fs.readFileSync(catalog, "utf8")).devices : [];
    // The OEM PDFs aren't in git; skip any device whose manual hasn't been downloaded yet.
    this.devices = listed.filter((d) => {
      const ok = fs.existsSync(path.join(dir, d.manual.file));
      if (!ok) console.warn(`[manuals] missing ${d.manual.file} (${d.manual.docNumber}); see README to download it`);
      return ok;
    });
    for (const d of this.devices) this.index(d.manual.id);
  }

  device(id: string) { return this.devices.find((d) => d.id === id); }

  file(manualId: string): string | undefined {
    const m = this.devices.find((d) => d.manual.id === manualId)?.manual;
    return m ? path.join(this.dir, m.file) : undefined;
  }

  async pages(manualId: string) { return (await this.index(manualId)).pages; }

  /** Parses once, then reuses a JSON cache until the PDF changes. */
  index(manualId: string): Promise<ManualIndex> {
    let p = this.indexes.get(manualId);
    if (!p) {
      p = (async () => {
        const file = this.file(manualId)!;
        const cache = path.join(this.cacheDir, `${manualId}.json`);
        const mtimeMs = fs.statSync(file).mtimeMs;
        if (fs.existsSync(cache)) {
          const cached = JSON.parse(fs.readFileSync(cache, "utf8")) as ManualIndex;
          if (cached.mtimeMs === mtimeMs && cached.version === INDEX_VERSION) return cached;
        }
        const t0 = Date.now();
        const idx = await indexPdf(manualId, file);
        fs.writeFileSync(cache, JSON.stringify(idx));
        console.log(`[manuals] indexed ${manualId}: ${idx.pages} pages, ${idx.passages.length} passages in ${Date.now() - t0} ms`);
        return idx;
      })();
      this.indexes.set(manualId, p);
    }
    return p;
  }

  /**
   * BM25 over each passage's own text. The section title only boosts a passage that already
   * matches, so short table cells inside a matching section don't outrank the procedure itself.
   * Table-of-contents lines and number-heavy fragments are pushed down.
   */
  async search(manualId: string, query: string, limit = 5): Promise<Hit[]> {
    const idx = await this.index(manualId);
    const q = [...new Set(tokens(query).flatMap((t) => [t, ...(SYNONYMS[t] ?? []).map(stem)]))];
    if (!q.length) return [];
    const docs = idx.passages.map((p) => tokens(p.text));
    const avg = docs.reduce((n, d) => n + d.length, 0) / Math.max(1, docs.length);
    const df = new Map<string, number>();
    for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
    const N = docs.length;
    const original = new Set(tokens(query));
    const hits: Hit[] = [];
    idx.passages.forEach((p, i) => {
      const d = docs[i];
      if (!d.length) return;
      const tf = new Map<string, number>();
      for (const t of d) tf.set(t, (tf.get(t) ?? 0) + 1);
      let score = 0;
      let matched = 0;
      for (const t of q) {
        const f = tf.get(t);
        if (!f) continue;
        const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        // Words the engineer actually said count more than expansions.
        const weight = original.has(t) ? 1 : 0.4;
        score += weight * idf * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * d.length / avg));
        if (original.has(t)) matched++;
      }
      if (!score) return;
      score *= 1 + 0.35 * (matched - 1); // reward covering more of the question
      const sectionTerms = new Set(tokens(p.section));
      const inSection = [...original].filter((t) => sectionTerms.has(t)).length / original.size;
      score *= 1 + 0.6 * inSection;
      if (/\.{4,}|(\s\.){4,}/.test(p.text)) score *= 0.15; // table of contents / index
      const words = p.text.split(/\s+/);
      const wordy = words.filter((w) => /^[A-Za-z][a-z]{2,}/.test(w)).length / words.length;
      if (wordy < 0.5) score *= 0.4; // table cells, part numbers
      if (p.text.length < 80) score *= 0.6;
      hits.push({ ...p, score });
    });
    hits.sort((a, b) => b.score - a.score);
    // One hit per page keeps the list useful.
    const seen = new Set<number>();
    return hits.filter((h) => !seen.has(h.page) && seen.add(h.page)).slice(0, limit);
  }
}
