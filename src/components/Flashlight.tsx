// CURSOR-LINTERNA 🔦
// · Sigue el puntero (Pointer Events: ratón, lápiz y dedo).
// · Escribe --mx/--my en <html> para el velo de oscuridad y el cursor visual.
// · Para cada elemento .lux calcula coordenadas relativas (--lx/--ly) que usa su
//   mask-image radial: el haz REVELA organismos y marginalia ocultos.
// · Sobre elementos [data-harpoon] el cursor se transforma en arpón.
import { useEffect, useRef } from "react";
import { hasFinePointer } from "../lib/motion";
import { pointer } from "../lib/pointer";

export default function Flashlight() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (hasFinePointer()) root.classList.add("has-cursor");
    let raf = 0;
    let lastX = pointer.x;
    let lastY = pointer.y;

    const update = () => {
      raf = 0;
      root.style.setProperty("--mx", `${pointer.x}px`);
      root.style.setProperty("--my", `${pointer.y}px`);
      // Coordenadas relativas para las máscaras de los elementos .lux
      const els = document.querySelectorAll<HTMLElement>(".lux");
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const r = el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > window.innerHeight + 300) continue; // fuera de pantalla
        el.style.setProperty("--lx", `${pointer.x - r.left}px`);
        el.style.setProperty("--ly", `${pointer.y - r.top}px`);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onMove = (e: PointerEvent) => {
      pointer.speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = pointer.x = e.clientX;
      lastY = pointer.y = e.clientY;
      pointer.moved = true;
      schedule();
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      root.dataset.cursor = t?.closest("[data-harpoon]") ? "harpoon" : "";
    };
    const onDown = () => {
      root.dataset.cursorDown = "1";
    };
    const onUp = () => {
      delete root.dataset.cursorDown;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Los .lux aparecen al cambiar de ruta: recalcular cada medio segundo es barato.
    const iv = window.setInterval(schedule, 500);
    schedule();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef} aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-dot" />
      {/* Arpón: aparece al sobrevolar especímenes clickeables */}
      <svg className="cursor-harpoon" viewBox="0 0 48 48" width="44" height="44">
        <path d="M6 42 L30 18" stroke="#eaf7ff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M30 18 L28 8 L42 6 L40 20 Z" fill="#ffb347" />
        <path d="M30 18 L22 20 M30 18 L32 26" stroke="#eaf7ff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
