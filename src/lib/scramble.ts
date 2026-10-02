// Efecto «scramble-decode»: el texto se descifra letra a letra desde glifos aleatorios.
import { prefersReduced } from "./motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/=§¿";

/** Anima el texto de un elemento. Devuelve una función para cancelar. */
export function scrambleText(el: HTMLElement, final: string, duration = 900): () => void {
  if (prefersReduced() || document.documentElement.dataset.surface) {
    el.textContent = final;
    return () => {};
  }
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const reveal = Math.floor(p * final.length);
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      out += ch === " " || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = final;
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** Dígitos aleatorios con la misma longitud (para el HUD en transición de zona). */
export function noiseDigits(sample: string): string {
  return sample.replace(/\d/g, () => String((Math.random() * 10) | 0));
}
