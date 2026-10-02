// ───────────────────────────────────────────────────────────────
// Carga del contenido: todos los expedientes .md se empaquetan en el
// build con import.meta.glob (sin red, sin backend) y se parsean al inicio.
// ───────────────────────────────────────────────────────────────
import { parseDoc, type Block } from "./markdown";
import { PHOTOS, type Photo } from "../content/photos";
import type { ZoneId } from "./depth";

export interface Article {
  slug: string;
  order: number;
  title: string;
  short: string;
  subtitle: string;
  zone: ZoneId;
  depthM: number;
  kicker: string;
  summary: string;
  photos: Array<Photo & { cap: string }>;
  ficha: Array<[string, string]>;
  timeline: Array<{ y: string; t: string }>;
  table: { caption: string; head: string[]; rows: string[][] };
  quote: { text: string; who: string; url: string };
  sources: Array<{ t: string; u: string }>;
  blocks: Block[];
  words: number;
  minutes: number;
}

interface RawMeta {
  slug: string;
  order: number;
  title: string;
  short: string;
  subtitle: string;
  zone: ZoneId;
  depthM: number;
  kicker: string;
  summary: string;
  photos: Array<{ id: number; cap: string }>;
  ficha: Array<[string, string]>;
  timeline: Array<{ y: string; t: string }>;
  table: { caption: string; head: string[]; rows: string[][] };
  quote: { text: string; who: string; url: string };
  sources: Array<{ t: string; u: string }>;
}

// Vite sustituye esta llamada por imports estáticos en el build.
const files = import.meta.glob("../content/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const ARTICLES: Article[] = Object.entries(files)
  .flatMap(([path, raw]) => {
    // Un expediente corrupto no debe tumbar el museo entero: se descarta y se avisa en consola.
    try {
      const { meta, blocks, words } = parseDoc<RawMeta>(raw);
      return [
        {
          ...meta,
          photos: meta.photos.map((p) => ({ ...PHOTOS[p.id], cap: p.cap })),
          blocks,
          words,
          minutes: Math.max(1, Math.round(words / 210)),
        } as Article,
      ];
    } catch (err) {
      console.error(`[ABISAL] No se pudo leer ${path}`, err);
      return [];
    }
  })
  .sort((a, b) => a.order - b.order);

export const bySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
