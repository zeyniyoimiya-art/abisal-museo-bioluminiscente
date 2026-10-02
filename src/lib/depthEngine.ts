// ───────────────────────────────────────────────────────────────
// Motor de profundidad: convierte la posición de scroll en metros.
// Cualquier elemento con data-depth-min / data-depth-max (en metros) actúa
// como «tramo» de la columna de agua. El motor busca el tramo bajo el centro
// del viewport, interpola la profundidad y publica:
//   · variables CSS globales (--za, --zb, --zt, --press, --light) → fondo OKLCH,
//     tipografía bajo presión y oscuridad ambiental;
//   · un estado suscribible para el HUD y los efectos de zona.
// El HUD también usa scroll-timeline CSS nativo cuando está disponible (ver index.css).
// ───────────────────────────────────────────────────────────────
import { bgFor, clamp, lerp, lightPercent, pressNorm, zoneAt, type Zone } from "./depth";
import { prefersReduced } from "./motion";

export interface DepthState {
  depth: number;
  zone: Zone;
}

type Listener = (s: DepthState) => void;

const listeners = new Set<Listener>();
let target = 0;
let current = 0;
let raf = 0;
let started = false;
let state: DepthState = { depth: 0, zone: zoneAt(0) };

/** Busca el tramo [data-depth-min] más cercano al centro del viewport. */
function measure() {
  const els = document.querySelectorAll<HTMLElement>("[data-depth-min]");
  if (!els.length) {
    target = 0;
    return;
  }
  const mid = window.innerHeight * 0.5;
  let best = Infinity;
  let bestDepth = 0;
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    const min = Number(el.dataset.depthMin);
    const max = Number(el.dataset.depthMax ?? min);
    const p = r.height > 0 ? (mid - r.top) / r.height : 0;
    const dist = p < 0 ? -p * r.height : p > 1 ? (p - 1) * r.height : 0;
    if (dist < best) {
      best = dist;
      bestDepth = lerp(min, max, clamp(p));
    }
  });
  target = bestDepth;
}

/** Escribe las variables CSS y notifica a los suscriptores. */
function apply() {
  const root = document.documentElement.style;
  const { a, b, t } = bgFor(current);
  root.setProperty("--za", a);
  root.setProperty("--zb", b);
  root.setProperty("--zt", `${t.toFixed(2)}%`);
  root.setProperty("--press", pressNorm(current).toFixed(4));
  root.setProperty("--light", (lightPercent(current) / 100).toFixed(4));
  state = { depth: current, zone: zoneAt(current) };
  listeners.forEach((l) => l(state));
}

function tick() {
  const diff = target - current;
  // Con reduced-motion no hay inercia: salto directo (MODO SUPERFICIE).
  if (prefersReduced() || Math.abs(diff) < 0.5) current = target;
  else current += diff * 0.12;
  apply();
  raf = current === target ? 0 : requestAnimationFrame(tick);
}

function kick() {
  measure();
  if (!raf) raf = requestAnimationFrame(tick);
}

export function startDepthEngine() {
  if (started) return;
  started = true;
  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", kick);
  // Las imágenes y fuentes mueven el layout: re-medimos con baja frecuencia.
  window.setInterval(kick, 700);
  kick();
}

/** Llamar tras cambiar de ruta o de contenido. */
export function refreshDepth() {
  requestAnimationFrame(kick);
}

export function subscribeDepth(fn: Listener): () => void {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}

export const getDepthState = () => state;
