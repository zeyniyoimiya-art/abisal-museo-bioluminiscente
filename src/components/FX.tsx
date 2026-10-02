// Efectos transitorios globales:
//  · burbujas ascendentes al hacer click y en transiciones (con blip de audio),
//  · anillos de sonar SVG en la corriente marina,
//  · aviso de cambio de zona con god-rays + ping.
import { useEffect, useState } from "react";
import { subscribeDepth } from "../lib/depthEngine";
import { type Zone } from "../lib/depth";
import { audio } from "../lib/audio";
import { prefersReduced } from "../lib/motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  s: number;
  dx: number;
  d: number;
  dur: number;
}
interface Ring {
  id: number;
  x: number;
  y: number;
}

let uid = 0;

export default function FX() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [rings, setRings] = useState<Ring[]>([]);
  const [zone, setZone] = useState<{ z: Zone; k: number } | null>(null);

  useEffect(() => {
    const spawn = (x: number, y: number, n: number, spread: number) => {
      if (prefersReduced() || document.documentElement.dataset.surface) return;
      const list: Bubble[] = Array.from({ length: n }, () => ({
        id: ++uid,
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * 30,
        s: 6 + Math.random() * 22,
        dx: (Math.random() - 0.5) * 80,
        d: Math.random() * 0.4,
        dur: 1.6 + Math.random() * 1.8,
      }));
      setBubbles((b) => [...b.slice(-60), ...list]);
      window.setTimeout(() => setBubbles((b) => b.filter((q) => !list.includes(q))), 4200);
      list.slice(0, 3).forEach((_, i) => window.setTimeout(() => audio.bubble(), i * 70));
    };

    const onBurst = (e: Event) => {
      const { x, y, big } = (e as CustomEvent).detail as { x: number; y: number; big: boolean };
      spawn(x, y, big ? 38 : 5, big ? window.innerWidth * 0.5 : 40);
      if (big && !prefersReduced()) {
        const r = { id: ++uid, x, y };
        setRings((q) => [...q, r]);
        window.setTimeout(() => setRings((q) => q.filter((i) => i.id !== r.id)), 2600);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest("input,textarea,select")) return;
      spawn(e.clientX, e.clientY, 4, 30);
    };
    window.addEventListener("abisal:burst", onBurst);
    window.addEventListener("pointerdown", onDown);

    // Cambio de zona → aviso con god-rays
    let last: string | null = null;
    let timer = 0;
    const unsub = subscribeDepth(({ zone: z }) => {
      if (last !== null && z.id !== last) {
        setZone({ z, k: ++uid });
        audio.ping(760);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setZone(null), 3200);
      }
      last = z.id;
    });
    return () => {
      window.removeEventListener("abisal:burst", onBurst);
      window.removeEventListener("pointerdown", onDown);
      window.clearTimeout(timer);
      unsub();
    };
  }, []);

  return (
    <div className="fx-layer" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.d}s`,
            ["--dx" as string]: `${b.dx}px`,
          }}
        />
      ))}
      {rings.map((r) => (
        <svg key={r.id} className="sonar-ring" style={{ left: r.x, top: r.y }} viewBox="-100 -100 200 200" width="200" height="200">
          {[0, 1, 2].map((i) => (
            <circle key={i} r="20" fill="none" stroke="#7df9ff" strokeWidth="1.5" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </svg>
      ))}
      {zone && (
        <div key={zone.k} className="zone-toast" data-zone={zone.z.id}>
          <div className="godrays" />
          <p>
            <small>ENTRANDO EN LA ZONA</small>
            <strong>{zone.z.name}</strong>
            <em>{zone.z.alias}</em>
          </p>
        </div>
      )}
    </div>
  );
}
