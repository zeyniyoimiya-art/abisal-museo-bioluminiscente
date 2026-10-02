// Controles flotantes persistentes:
//  🌀 CORRIENTE MARINA (ruleta) · ♒ MODO DERIVA · 🔊 sonido · ☀ MODO SUPERFICIE
import { useEffect, useState } from "react";
import { ARTICLES } from "../lib/content";
import { currentPath, go, usePath } from "../lib/router";
import { audio } from "../lib/audio";
import { toggleDrift, toggleSurface, useDrift, useSurface } from "../lib/prefs";
import { useMagnetic } from "../lib/hooks";

/** Dispara el efecto visual de burbujas + anillos de sonar en un punto. */
export function burst(x: number, y: number, big = true) {
  window.dispatchEvent(new CustomEvent("abisal:burst", { detail: { x, y, big } }));
}

/** Elige un expediente aleatorio distinto del actual y viaja hacia él. */
export function currentFlow(origin?: { x: number; y: number }) {
  const m = currentPath().match(/^\/expediente\/(.+)$/);
  const pool = ARTICLES.filter((a) => a.slug !== m?.[1]);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const o = origin ?? { x: window.innerWidth - 60, y: window.innerHeight - 60 };
  burst(o.x, o.y, true);
  audio.ping(900 + Math.random() * 500);
  go(`/expediente/${pick.slug}`, { mode: "circle", origin: o });
}

export default function Controls() {
  const drift = useDrift();
  const surface = useSurface();
  const path = usePath();
  const [sound, setSound] = useState(audio.enabled);
  const magnet = useMagnetic<HTMLButtonElement>(0.3);

  useEffect(() => audio.subscribe(() => setSound(audio.enabled)), []);

  return (
    <>
      <div className="dock" role="group" aria-label="Opciones de inmersión">
        <button
          id="drift-toggle"
          className="dock-btn"
          aria-pressed={drift}
          onClick={() => {
            toggleDrift();
            audio.bubble();
          }}
          title="Modo deriva: encadena expedientes aleatorios sin volver a la superficie"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M2 9c3-3 5 3 8 0s5-3 8 0 4 0 4 0M2 15c3-3 5 3 8 0s5-3 8 0 4 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Deriva {drift ? "ON" : "OFF"}</span>
        </button>
        <button
          className="dock-btn"
          aria-pressed={sound}
          onClick={() => audio.toggle()}
          title="Drone submarino, sonar y burbujas sintetizados"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            {sound ? (
              <path d="M16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
          <span>{sound ? "Sonido" : "Mudo"}</span>
        </button>
        <button
          className="dock-btn"
          aria-pressed={surface}
          onClick={toggleSurface}
          title="Modo superficie: luces encendidas, sin linterna ni movimiento"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>Superficie</span>
        </button>
      </div>

      <button
        ref={magnet}
        className="roulette"
        aria-label="Corriente marina: llévame a una investigación aleatoria"
        data-here={path}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          currentFlow({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
      >
        <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true" className="roulette-icon">
          <path d="M32 6c14 0 24 10 24 22 0 9-7 15-15 15-6 0-10-4-10-9 0-4 3-7 7-7 3 0 5 2 5 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M32 58C18 58 8 48 8 36c0-9 7-15 15-15 6 0 10 4 10 9 0 4-3 7-7 7-3 0-5-2-5-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
        <span>Corriente marina</span>
      </button>
    </>
  );
}
