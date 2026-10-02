// ───────────────────────────────────────────────────────────────
// Utilidades de movimiento: reduced-motion, Lenis compartido y helpers.
// ───────────────────────────────────────────────────────────────
import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

const query = () => (typeof matchMedia !== "undefined" ? matchMedia("(prefers-reduced-motion: reduce)") : null);

/** ¿El usuario pidió reducir el movimiento? → MODO SUPERFICIE. */
export const prefersReduced = () => query()?.matches ?? false;

/** Hook reactivo para reduced-motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const q = query();
      q?.addEventListener("change", cb);
      return () => q?.removeEventListener("change", cb);
    },
    () => prefersReduced(),
    () => false
  );
}

/** ¿Hay un puntero fino con hover (ratón)? Si no, la linterna se maneja con el dedo. */
export const hasFinePointer = () => typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

// Instancia compartida de Lenis (scroll inercial)
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Vuelve arriba sin animación (al cambiar de ruta). */
export function scrollToTopNow() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

/** Desplaza suavemente a un elemento o posición. */
export function scrollToY(y: number) {
  if (lenis && !prefersReduced()) lenis.scrollTo(y, { duration: 2.4 });
  else window.scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
}
