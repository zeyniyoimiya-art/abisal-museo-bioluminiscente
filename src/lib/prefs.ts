// Preferencias persistentes (localStorage): modo deriva y modo superficie manual.
import { useSyncExternalStore } from "react";
import { prefersReduced } from "./motion";

interface Prefs {
  drift: boolean;
  surface: boolean;
}

const KEY = "abisal:prefs";
const read = (): Prefs => {
  try {
    return { drift: false, surface: false, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { drift: false, surface: false };
  }
};

let prefs: Prefs = typeof localStorage !== "undefined" ? read() : { drift: false, surface: false };
const subs = new Set<() => void>();

function set(next: Partial<Prefs>) {
  prefs = { ...prefs, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* modo privado: ignoramos */
  }
  applySurface();
  subs.forEach((f) => f());
}

/** MODO SUPERFICIE efectivo = preferencia manual o prefers-reduced-motion. */
export const surfaceActive = () => prefs.surface || prefersReduced();

export function applySurface() {
  const el = document.documentElement;
  if (surfaceActive()) el.dataset.surface = "on";
  else delete el.dataset.surface;
}

const subscribe = (cb: () => void) => {
  subs.add(cb);
  return () => subs.delete(cb);
};

export const useDrift = () => useSyncExternalStore(subscribe, () => prefs.drift, () => false);
export const useSurface = () => useSyncExternalStore(subscribe, () => surfaceActive(), () => false);
export const getDrift = () => prefs.drift;
export const toggleDrift = () => set({ drift: !prefs.drift });
export const toggleSurface = () => set({ surface: !prefs.surface });
