// Plancton bioluminiscente: partículas en canvas que HUYEN del cursor-linterna y
// se encienden al ser perturbadas. (Simulación en CPU con sprite aditivo;
// la versión WebGPU/compute del brief se documenta en el README como siguiente paso.)
// Se inicializa de forma perezosa en el primer scroll/movimiento → no afecta al LCP.
import { useEffect, useRef } from "react";
import { prefersReduced } from "../lib/motion";
import { pointer } from "../lib/pointer";
import { getDepthState } from "../lib/depthEngine";
import { surfaceActive } from "../lib/prefs";
import { lightPercent } from "../lib/depth";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ph: number;
  s: number;
  glow: number;
}

export default function Plankton() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const surface = prefersReduced() || surfaceActive();

    let started = false;
    let raf = 0;
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let visible = true;

    // Sprite de brillo pre-renderizado (evita gradientes por partícula)
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(180,255,210,1)");
    g.addColorStop(0.25, "rgba(110,231,160,0.55)");
    g.addColorStop(1, "rgba(110,231,160,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(surface ? 60 : 650, Math.floor((w * h) / 2600));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.18 - 0.03,
        ph: Math.random() * Math.PI * 2,
        s: 4 + Math.random() * 9,
        glow: 0,
      }));
    };

    const R = 190; // radio de huida
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const light = lightPercent(getDepthState().depth) / 100;
      // En la superficie: nieve marina tenue; abajo: plancton vivo.
      const base = 0.16 + (1 - light) * 0.5;
      for (const p of parts) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (!surface && d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) ** 2;
          p.vx += (dx / d) * f * 1.4;
          p.vy += (dy / d) * f * 1.4;
          p.glow = Math.min(1, p.glow + f * 0.5 + pointer.speed * 0.004);
        }
        // Deriva suave + corriente sinusoidal
        p.vx += Math.sin(t * 0.0004 + p.ph) * 0.004;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 - 0.002;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) p.y = h + 20;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        p.glow *= 0.965;
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.002 + p.ph);
        ctx.globalAlpha = Math.min(1, (base * pulse + p.glow) * 0.9);
        const s = p.s * (1 + p.glow * 1.6);
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const start = () => {
      if (started) return;
      started = true;
      resize();
      if (surface) {
        frame(0);
        cancelAnimationFrame(raf); // un solo fotograma estático
      } else raf = requestAnimationFrame(frame);
    };

    // Lazy-init: primer scroll, primer movimiento o 1.5 s de inactividad
    const kick = () => start();
    window.addEventListener("scroll", kick, { once: true, passive: true });
    window.addEventListener("pointermove", kick, { once: true, passive: true });
    const idle = window.setTimeout(start, 1500);
    window.addEventListener("resize", () => started && resize());
    const vis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", vis);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", kick);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return <canvas ref={ref} className="plankton" aria-hidden="true" />;
}
