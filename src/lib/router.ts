// ───────────────────────────────────────────────────────────────
// Router mínimo basado en hash (#/ruta): funciona en cualquier hosting estático
// (Vercel, Netlify, Cloudflare, GitHub Pages) sin reglas de reescritura.
// Las transiciones usan la View Transitions API; la «corriente marina» abre un
// clip-path circular desde el botón que la dispara.
// ───────────────────────────────────────────────────────────────
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { prefersReduced, scrollToTopNow } from "./motion";
import { refreshDepth } from "./depthEngine";

const parse = (hash: string) => {
  const p = hash.replace(/^#/, "") || "/";
  return p.startsWith("/") ? p : `/${p}`;
};

let path = typeof location !== "undefined" ? parse(location.hash) : "/";
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  // Atrás/adelante del navegador y enlaces con href="#/..."
  const sync = () => {
    const next = parse(location.hash);
    if (next !== path) {
      path = next;
      notify();
      scrollToTopNow();
      refreshDepth();
    }
  };
  window.addEventListener("popstate", sync);
  window.addEventListener("hashchange", sync);
}

export const usePath = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => path,
    () => "/"
  );

export const currentPath = () => path;

export interface GoOptions {
  /** Origen del círculo (px de viewport). */
  origin?: { x: number; y: number };
  /** Tipo de transición. */
  mode?: "fade" | "circle" | "none";
}

/** Navega a una ruta con View Transition cuando está disponible. */
export function go(to: string, opts: GoOptions = {}) {
  if (to === path) return;
  const apply = () => {
    history.pushState(null, "", `#${to}`);
    path = to;
    notify();
    scrollToTopNow();
  };
  const mode = opts.mode ?? "fade";
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

  if (!doc.startViewTransition || prefersReduced() || mode === "none") {
    apply();
    refreshDepth();
    return;
  }

  document.documentElement.dataset.vt = mode;
  const t = doc.startViewTransition(() => {
    flushSync(apply);
    refreshDepth();
  });

  t.ready
    .then(() => {
      if (mode !== "circle") return;
      const x = opts.origin?.x ?? window.innerWidth / 2;
      const y = opts.origin?.y ?? window.innerHeight / 2;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 1100, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {});
  t.finished.finally(() => {
    delete document.documentElement.dataset.vt;
  });
}
