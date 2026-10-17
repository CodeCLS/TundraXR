import fs from "node:fs";
import path from "node:path";

export type Step = "pending" | "running" | "done" | "failed" | "skipped";

export interface DeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  assetTag: string;
  serial: string;
  location: string;
}

export interface QA {
  question: string;
  answer: string;
  at: string;
}

export interface Capture {
  id: string;
  sessionId: string;
  kind: "photo" | "video" | "note" | "question";
  /** Offset into the headset session, e.g. "02:14". */
  at: string;
  createdAt: string;
  device: DeviceInfo;
  file?: string;
  mime?: string;
  bytes?: number;
  durationSec?: number;
  /** Voice-note transcript or the question asked. */
  text?: string;
  /** Video moments returned for a question. */
  moments?: Moment[];
  /** Manual passages returned for a question. */
  manualHits?: ManualHit[];
  /** Answer given to the headset for a question. */
  answer?: string;
  tl: {
    upload: Step;
    analysis: Step;
    index: Step;
    assetId?: string;
    indexedAssetId?: string;
    error?: string;
  };
  analysis?: Record<string, unknown>;
  qa: QA[];
}

export interface ManualHit {
  manualId: string;
  title: string;
  page: number;
  section: string;
  text: string;
  box: [number, number, number, number];
}

export interface Moment {
  captureId: string;
  start: number;
  end: number;
  rank?: number;
  thumbnailUrl?: string;
}

interface Db {
  indexId?: string;
  captures: Capture[];
}

export class Store {
  private db: Db;
  private file: string;
  private saveTimer: NodeJS.Timeout | null = null;
  readonly mediaDir: string;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, "db.json");
    this.mediaDir = path.join(dataDir, "media");
    fs.mkdirSync(this.mediaDir, { recursive: true });
    this.db = fs.existsSync(this.file)
      ? JSON.parse(fs.readFileSync(this.file, "utf8"))
      : { captures: [] };
  }

  get indexId() { return this.db.indexId; }
  set indexId(id: string | undefined) { this.db.indexId = id; this.save(); }

  all(): Capture[] { return this.db.captures; }

  get(id: string): Capture | undefined { return this.db.captures.find((c) => c.id === id); }

  byIndexedVideo(videoId: string): Capture | undefined {
    return this.db.captures.find((c) => c.tl.indexedAssetId === videoId || c.tl.assetId === videoId);
  }

  add(c: Capture) { this.db.captures.push(c); this.save(); }

  update(id: string, fn: (c: Capture) => void): Capture | undefined {
    const c = this.get(id);
    if (!c) return undefined;
    fn(c);
    this.save();
    return c;
  }

  /** Debounced write so bursts of status updates don't thrash the disk. */
  private save() {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      fs.writeFileSync(this.file, JSON.stringify(this.db, null, 2));
    }, 200);
  }
}
