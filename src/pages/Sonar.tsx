// «/sonar» — About: Lin Yue 林玥. Un sonar interactivo en canvas: cada ping revela un dato
// sobre la autora. Al descifrarlos todos, el sello rojo se estampa.
// Accesible: los datos viven en una lista; el botón «Emitir ping» sustituye al click; en MODO SUPERFICIE todo se muestra.
import { useCallback, useEffect, useRef, useState } from "react";
import Seal from "../components/Seal";
import Words from "../components/Words";
import { audio } from "../lib/audio";
import { prefersReduced } from "../lib/motion";
import { useSurface } from "../lib/prefs";

interface Fact {
  tag: string;
  text: string;
  a: number; // ángulo (rad)
  r: number; // radio normalizado
}

const FACTS: Fact[] = [
  { tag: "Alias", text: "Lin Yue 林玥 es un alias artístico.", a: -0.6, r: 0.38 },
  { tag: "Formación", text: "Estudiante de Sistemas Informáticos.", a: 0.5, r: 0.6 },
  { tag: "林 · lín", text: "Significa «bosque». Un guiño al micelio del expediente 06: bajo cada bosque hay una red.", a: 1.9, r: 0.46 },
  { tag: "玥 · yuè", text: "Una perla mítica. Aquí, la que brilla en el fondo del mar.", a: 2.7, r: 0.7 },
  { tag: "Este museo", text: "Ocho investigaciones, un descenso, cero backend: todo viaja empaquetado en el build y se despliega como sitio estático.", a: 3.8, r: 0.55 },
  { tag: "Método", text: "Cada dato lleva su fuente al pie; las fotografías son ilustrativas y se acreditan una a una.", a: 4.6, r: 0.8 },
  { tag: "Firma", text: "El sello rojo se estampa cuando el sonar ha dicho todo lo que tenía que decir.", a: 5.5, r: 0.3 },
];

interface Ping {
  x: number;
  y: number;
  t0: number;
  max: number;
  limit: number; // cuántos datos puede revelar este ping
  hits: number;
}

export default function Sonar() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const revRef = useRef<number[]>([]);
  const pings = useRef<Ping[]>([]);
  const size = useRef(560);
  const surface = useSurface();
  const [msg, setMsg] = useState("Haz click en el sonar para lanzar un ping.");

  const reveal = useCallback((i: number) => {
    if (revRef.current.includes(i)) return;
    revRef.current = [...revRef.current, i];
    setRevealed(revRef.current);
    audio.ping(1000 + i * 140);
    setMsg(`Eco recibido: ${FACTS[i].tag}.`);
  }, []);

  // ── Bucle de dibujo ──
  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d")!;
    let raf = 0;
    let visible = true;
    const still = prefersReduced();

    const resize = () => {
      const s = Math.min(box.clientWidth, 620);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = s;
      cv.width = s * dpr;
      cv.height = s * dpr;
      cv.style.width = cv.style.height = `${s}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const s = size.current;
      const c = s / 2;
      const R = c - 6;
      ctx.clearRect(0, 0, s, s);
      // Fondo circular
      const bg = ctx.createRadialGradient(c, c, 0, c, c, R);
      bg.addColorStop(0, "rgba(4,30,36,.95)");
      bg.addColorStop(1, "rgba(1,8,12,.98)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();
      // Anillos de rango y retícula
      ctx.strokeStyle = "rgba(125,249,255,.2)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(c, c, (R * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(c - R, c);
      ctx.lineTo(c + R, c);
      ctx.moveTo(c, c - R);
      ctx.lineTo(c, c + R);
      ctx.stroke();

      // Barrido
      const ang = still ? 0.8 : (now / 3800) * Math.PI * 2;
      for (let k = 0; k < 36; k++) {
        const a0 = ang - k * 0.028;
        ctx.strokeStyle = `rgba(125,249,255,${0.32 * (1 - k / 36)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a0) * R, c + Math.sin(a0) * R);
        ctx.stroke();
      }

      // Blips
      FACTS.forEach((f, i) => {
        const bx = c + Math.cos(f.a) * f.r * R;
        const by = c + Math.sin(f.a) * f.r * R;
        const on = revRef.current.includes(i);
        // destello tenue cuando el barrido pasa cerca (pista)
        const diff = Math.abs(((ang % (Math.PI * 2)) - ((f.a + Math.PI * 2) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
        const hint = still ? 0 : Math.max(0, 1 - diff / 0.35) * 0.35;
        if (on || hint > 0.01) {
          ctx.fillStyle = on ? "#6ee7a0" : `rgba(125,249,255,${hint})`;
          ctx.shadowColor = on ? "#6ee7a0" : "#7df9ff";
          ctx.shadowBlur = on ? 16 : 8;
          ctx.beginPath();
          ctx.arc(bx, by, on ? 5.5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          if (on) {
            ctx.fillStyle = "#eaf7ff";
            ctx.font = "12px 'JetBrains Mono', monospace";
            ctx.fillText(String(i + 1), bx + 9, by + 4);
          }
        }
      });

      // Pings en expansión
      const speed = R * 0.5; // px por segundo
      pings.current = pings.current.filter((p) => (now - p.t0) / 1000 * speed < p.max + 40);
      for (const p of pings.current) {
        const r = ((now - p.t0) / 1000) * speed;
        ctx.strokeStyle = `rgba(125,249,255,${Math.max(0, 0.9 - r / (p.max + 40))})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        FACTS.forEach((f, i) => {
          if (p.hits >= p.limit || revRef.current.includes(i)) return;
          const bx = c + Math.cos(f.a) * f.r * R;
          const by = c + Math.sin(f.a) * f.r * R;
          const d = Math.hypot(bx - p.x, by - p.y);
          if (d <= r && d <= p.max) {
            p.hits++;
            reveal(i);
          }
        });
      }

      if (!still && visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    if (still) {
      // En modo reducido repintamos cuando cambia algo (pings y datos)
      const iv = window.setInterval(() => requestAnimationFrame(draw), 120);
      return () => {
        window.clearInterval(iv);
        window.removeEventListener("resize", resize);
      };
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reveal]);

  const fire = (x: number, y: number, max: number, limit: number) => {
    pings.current.push({ x, y, t0: performance.now(), max, limit, hits: 0 });
    audio.ping(1200);
    if (limit < 99) setMsg("Ping enviado… escuchando.");
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = size.current;
    fire(e.clientX - r.left, e.clientY - r.top, s * 0.42, 2);
  };

  // Botón accesible: ping desde el centro que revela el siguiente dato pendiente
  const pingNext = () => {
    const s = size.current;
    fire(s / 2, s / 2, s, 1);
  };

  const all = surface || revealed.length === FACTS.length;
  const shown = (i: number) => surface || revealed.includes(i);

  return (
    <div className="sonar-page" data-depth-min="2500" data-depth-max="5500">
      <section className="wrap sonar-hero">
        <p className="kicker">/sonar · Acerca de la autora</p>
        <Words as="h1" text="Lin Yue 林玥" className="display page-title" />
        <p className="lead">
          Alias artístico. Esta persona construye museos en el fondo del mar con código. Lanza un ping y escucha: cada eco es un dato.
        </p>
      </section>

      <section className="wrap sonar-grid">
        <div className="sonar-box" ref={wrap}>
          <canvas ref={canvas} onClick={onClick} className="sonar-canvas" data-harpoon aria-label="Sonar interactivo: haz click para lanzar un ping" role="img" />
          <div className="sonar-actions">
            <button className="cta" onClick={pingNext} data-harpoon>
              <span className="cta-lure" aria-hidden="true" />
              Emitir ping
            </button>
            <p className="sonar-msg" role="status" aria-live="polite">
              {msg}
            </p>
          </div>
        </div>

        <div>
          <ol className="facts" aria-label="Datos de la autora">
            {FACTS.map((f, i) => (
              <li key={f.tag} className={shown(i) ? "on" : ""}>
                <span className="fact-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{shown(i) ? f.tag : "· · · eco sin descifrar"}</b>
                  <p>{shown(i) ? f.text : "Lanza pings cerca de los ecos del sonar, o usa el botón."}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="facts-count">
            {surface ? FACTS.length : revealed.length} / {FACTS.length} ecos descifrados
          </p>
        </div>
      </section>

      {/* Sello rojo caligráfico sumergido */}
      <section className="wrap seal-sec" aria-label="Firma">
        <div className={`seal-holder ${all ? "on" : ""}`}>
          <Seal size={190} stamp={all && !surface} id="seal-big" />
        </div>
        <p className="seal-caption">{all ? "Sellado. — Lin Yue 林玥" : "El sello espera bajo el sedimento…"}</p>
        <p className="seal-sub">林玥 — alias artístico, estudiante de Sistemas Informáticos.</p>
      </section>
    </div>
  );
}
