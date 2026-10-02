// ───────────────────────────────────────────────────────────────
// Lógica pura de profundidades: zonas, presión, temperatura, luz,
// gradiente de fondo y barajado con semilla. Sin DOM → testeable.
// ───────────────────────────────────────────────────────────────

export type ZoneId = "epipelagica" | "twilight" | "medianoche" | "abisal" | "hadal";

export interface Zone {
  id: ZoneId;
  name: string; // nombre científico
  alias: string; // apodo poético
  min: number; // metros
  max: number; // metros
  color: string; // color representativo (hex)
  blurb: string;
}

export const MAX_DEPTH = 11000;

export const ZONES: Zone[] = [
  {
    id: "epipelagica",
    name: "Epipelágica",
    alias: "Zona de luz",
    min: 0,
    max: 200,
    color: "#0a3d4d",
    blurb: "Aquí llega la luz del Sol y ocurre casi toda la fotosíntesis marina.",
  },
  {
    id: "twilight",
    name: "Mesopelágica",
    alias: "Twilight",
    min: 200,
    max: 1000,
    color: "#2b1b4d",
    blurb: "Un crepúsculo eterno: la luz solar se apaga hasta ser imperceptible hacia los 1,000 m.",
  },
  {
    id: "medianoche",
    name: "Batipelágica",
    alias: "Medianoche",
    min: 1000,
    max: 4000,
    color: "#041018",
    blurb: "Oscuridad total. La única luz es la que fabrican los propios animales.",
  },
  {
    id: "abisal",
    name: "Abisopelágica",
    alias: "Abismo",
    min: 4000,
    max: 6000,
    color: "#020409",
    blurb: "Llanuras de sedimento a unos pocos grados sobre cero, bajo toneladas de agua.",
  },
  {
    id: "hadal",
    name: "Hadal",
    alias: "La Fosa",
    min: 6000,
    max: 11000,
    color: "#000000",
    blurb: "Las fosas oceánicas, nombradas por Hades. El punto más profundo conocido: ≈ 10,935 m.",
  },
];

export const ZONE_BY_ID: Record<ZoneId, Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Zona que corresponde a una profundidad en metros. */
export function zoneAt(depth: number): Zone {
  const d = clamp(depth, 0, MAX_DEPTH);
  return ZONES.find((z) => d >= z.min && d < z.max) ?? ZONES[ZONES.length - 1];
}

/** Presión absoluta en atmósferas (≈ 1 atm cada 10.2 m de agua de mar + 1 atm de aire). */
export function pressureAtm(depth: number): number {
  return 1 + clamp(depth, 0, MAX_DEPTH) / 10.2;
}

/** Temperatura aproximada (°C) interpolando un perfil oceánico típico. */
const TEMP_PROFILE: Array<[number, number]> = [
  [0, 19],
  [100, 16],
  [200, 12],
  [600, 7],
  [1000, 4.5],
  [2000, 2.6],
  [4000, 1.8],
  [6000, 1.5],
  [11000, 2.0],
];
export function temperatureC(depth: number): number {
  const d = clamp(depth, 0, MAX_DEPTH);
  for (let i = 0; i < TEMP_PROFILE.length - 1; i++) {
    const [d0, t0] = TEMP_PROFILE[i];
    const [d1, t1] = TEMP_PROFILE[i + 1];
    if (d >= d0 && d <= d1) return lerp(t0, t1, (d - d0) / (d1 - d0));
  }
  return TEMP_PROFILE[TEMP_PROFILE.length - 1][1];
}

/** Luz restante (%): decaimiento exponencial, ≈ 1 % a 200 m (límite de la zona fótica). */
export function lightPercent(depth: number): number {
  return 100 * Math.exp(-clamp(depth, 0, MAX_DEPTH) / 43.4);
}

/** Paradas del gradiente de fondo (profundidad → color). */
export const BG_STOPS: Array<[number, string]> = [
  [0, "#0a3d4d"],
  [150, "#0a3d4d"],
  [600, "#2b1b4d"],
  [2500, "#041018"],
  [5000, "#020409"],
  [8000, "#000000"],
];

/** Devuelve dos colores y el factor t (0–100) para `color-mix(in oklch, a, b t%)`. */
export function bgFor(depth: number): { a: string; b: string; t: number } {
  const d = clamp(depth, 0, MAX_DEPTH);
  for (let i = 0; i < BG_STOPS.length - 1; i++) {
    const [d0, c0] = BG_STOPS[i];
    const [d1, c1] = BG_STOPS[i + 1];
    if (d >= d0 && d <= d1) return { a: c0, b: c1, t: ((d - d0) / (d1 - d0)) * 100 };
  }
  const last = BG_STOPS[BG_STOPS.length - 1][1];
  return { a: last, b: last, t: 0 };
}

/** Presión tipográfica normalizada 0–1. */
export const pressNorm = (depth: number) => clamp(depth / MAX_DEPTH);

// ── Barajado con semilla (mismo orden durante todo el día) ──────

/** PRNG pequeño y rápido (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates determinista: misma semilla → mismo orden. No muta el original. */
export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice();
  const rnd = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Semilla = fecha local AAAAMMDD. */
export function dailySeed(date: Date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

/** Formatea metros con separador de miles. */
export const fmtMeters = (d: number) => Math.round(d).toLocaleString("en-US");
