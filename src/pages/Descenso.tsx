// «/descenso» — LA EXPERIENCIA COMPLETA: 5 zonas con puertas pinneadas (GSAP ScrollTrigger),
// parallax CSS de 4 capas, organismos revelados por la linterna y las 8 investigaciones
// anidadas a su profundidad como vitrinas apiladas (sticky stack).
import { useLayoutEffect, useRef } from "react";
import { ARTICLES } from "../lib/content";
import { ZONES, fmtMeters, type Zone } from "../lib/depth";
import Vitrina from "../components/Vitrina";
import Scramble from "../components/Scramble";
import Parallax from "../components/Parallax";
import { Organism, type Kind } from "../components/Organisms";
import Link from "../components/Link";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prefersReduced } from "../lib/motion";
import { surfaceActive } from "../lib/prefs";
import { currentFlow } from "../components/Controls";
import { useMagnetic } from "../lib/hooks";

interface Spot {
  kind: Kind;
  x: string;
  y: string;
  w: number;
  r?: number;
}

// Organismos escondidos por zona (posiciones en % de la sección)
const SPOTS: Record<string, Spot[]> = {
  epipelagica: [
    { kind: "siphon", x: "8%", y: "18%", w: 200 },
    { kind: "jelly", x: "78%", y: "62%", w: 90 },
  ],
  twilight: [
    { kind: "squid", x: "10%", y: "30%", w: 80 },
    { kind: "jelly", x: "82%", y: "12%", w: 110, r: 8 },
    { kind: "siphon", x: "55%", y: "78%", w: 230 },
  ],
  medianoche: [
    { kind: "angler", x: "6%", y: "55%", w: 240 },
    { kind: "jelly", x: "80%", y: "20%", w: 120, r: -8 },
    { kind: "siphon", x: "30%", y: "8%", w: 220 },
  ],
  abisal: [
    { kind: "xeno", x: "12%", y: "20%", w: 150 },
    { kind: "squid", x: "86%", y: "52%", w: 70 },
    { kind: "angler", x: "58%", y: "86%", w: 200, r: 6 },
  ],
  hadal: [
    { kind: "xeno", x: "70%", y: "14%", w: 170 },
    { kind: "jelly", x: "5%", y: "48%", w: 90 },
    { kind: "siphon", x: "40%", y: "88%", w: 240 },
  ],
};

// «Marginalia»: notas de campo visibles solo con la linterna (y siempre presentes para lectores de pantalla)
const NOTES: Record<string, string> = {
  epipelagica: "Nota de campo · A 200 m llega ≈ 1 % de la luz de la superficie.",
  twilight: "Nota de campo · Cada noche, muchos animales migran hacia arriba para alimentarse: la mayor migración diaria del planeta.",
  medianoche: "Nota de campo · ≈ 76 % de los animales observados entre 0 y 4,000 m producen su propia luz (Martini & Haddock, 2017).",
  abisal: "Nota de campo · Aquí la presión supera las 400 atmósferas y el agua ronda los 2 °C.",
  hadal: "Nota de campo · En el Challenger Deep la presión ronda los 1,086 bares.",
};

/** Puerta pinneada entre zonas: un anillo de sonar crece mientras «cruzas» la frontera. */
function Gate({ zone }: { zone: Zone }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || surfaceActive()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=65%", pin: true, scrub: 0.6 },
      });
      tl.fromTo(".gate-ring", { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, stagger: 0.18, ease: "power1.out" }, 0)
        .fromTo(".gate-depth", { scale: 0.88, opacity: 0.2, letterSpacing: "0.3em" }, { scale: 1, opacity: 1, letterSpacing: "0.02em", ease: "power2.out" }, 0)
        .to(".gate-label", { opacity: 1, y: 0 }, 0.25);
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="gate" aria-hidden="true">
      <div className="gate-inner">
        {[0, 1, 2].map((i) => (
          <span key={i} className="gate-ring" />
        ))}
        <p className="gate-depth display">{fmtMeters(zone.min)} m</p>
        <p className="gate-label">Cruzando hacia {zone.name} · {zone.alias}</p>
      </div>
    </div>
  );
}

export default function Descenso() {
  const magnet = useMagnetic<HTMLButtonElement>(0.35);

  // Refresca ScrollTrigger cuando cargan imágenes (cambian las alturas)
  useLayoutEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="descent">
      {ZONES.map((z, zi) => {
        const items = ARTICLES.filter((a) => a.zone === z.id);
        return (
          <div key={z.id}>
            {zi > 0 && <Gate zone={z} />}
            <section className={`zone zone-${z.id}`} data-zone={z.id} data-depth-min={z.min} data-depth-max={z.max} aria-labelledby={`z-${z.id}`}>
              <Parallax zone={z.id} />
              {/* Capa de organismos: solo la linterna los revela */}
              <div className="zone-lux" aria-hidden="true">
                {SPOTS[z.id].map((s, i) => (
                  <div key={i} className="lux" style={{ left: s.x, top: s.y, width: s.w, transform: `rotate(${s.r ?? 0}deg)` }}>
                    <Organism kind={s.kind} />
                  </div>
                ))}
              </div>

              <div className="wrap zone-grid">
                <div className="zone-head">
                  <p className="kicker">
                    Zona {zi + 1} / 5 · {fmtMeters(z.min)}–{fmtMeters(z.max)} m
                  </p>
                  <h2 id={`z-${z.id}`} className="display zone-title">
                    <Scramble text={z.name.toUpperCase()} />
                  </h2>
                  <p className="zone-alias">{z.alias}</p>
                  <p className="zone-blurb">{z.blurb}</p>
                  {zi === 0 && (
                    <p className="zone-hint">
                      <span aria-hidden="true">🔦</span> Mueve el puntero (o tu dedo): en la oscuridad, tu linterna revela lo que se esconde.
                    </p>
                  )}
                  <p className="lux marginalia">{NOTES[z.id]}</p>
                </div>
                <div className="zone-specimens">
                  {items.map((a, i) => (
                    <Vitrina key={a.slug} article={a} index={zi * 10 + i} className="stack" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      })}

      {/* ── Final del descenso ── */}
      <section className="wrap descent-end" aria-labelledby="end-title">
        <p className="kicker">Fondo del museo · 10,935 m</p>
        <h2 id="end-title" className="display h2 big">
          Has llegado al fondo. Ahora, déjate llevar.
        </h2>
        <p>La corriente marina te arrastra a una investigación al azar; el catálogo las muestra todas, barajadas con la semilla de hoy.</p>
        <div className="end-actions">
          <button
            ref={magnet}
            className="cta"
            data-harpoon
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              currentFlow({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
          >
            <span className="cta-lure" aria-hidden="true" />
            Corriente marina
          </button>
          <Link to="/catalogo" className="btn-ghost" data-harpoon>
            Abrir catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}
