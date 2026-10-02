// «/» — SUPERFICIE: el agua vista desde abajo (shader), título con line-mask reveal,
// manifiesto que se enciende palabra a palabra con GSAP SplitText + ScrollTrigger,
// y la CTA «Sumérgete» (magnética) que inicia el descenso con splash.
import { useLayoutEffect, useMemo, useRef } from "react";
import HeroCaustics from "../components/HeroCaustics";
import Link from "../components/Link";
import Vitrina from "../components/Vitrina";
import { ARTICLES } from "../lib/content";
import { ZONES, dailySeed, fmtMeters, seededShuffle } from "../lib/depth";
import { go } from "../lib/router";
import { audio } from "../lib/audio";
import { useMagnetic } from "../lib/hooks";
import { burst } from "../components/Controls";
import { gsap, SplitText } from "../lib/gsap";
import { prefersReduced } from "../lib/motion";
import { surfaceActive } from "../lib/prefs";

export default function Home() {
  const cta = useMagnetic<HTMLButtonElement>(0.4);
  const manifest = useRef<HTMLParagraphElement>(null);
  const today = useMemo(() => seededShuffle(ARTICLES, dailySeed()).slice(0, 3), []);

  // Manifiesto: las palabras pasan de penumbra a luz según el scroll.
  useLayoutEffect(() => {
    const el = manifest.current;
    if (!el || prefersReduced() || surfaceActive()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const dive = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const o = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    burst(o.x, o.y, true); // splash: burbujas + anillos de sonar
    audio.ping(640);
    window.setTimeout(() => go("/descenso", { mode: "circle", origin: o }), 260);
  };

  return (
    <div className="home" data-depth-min="0" data-depth-max="180">
      {/* ── Superficie ── */}
      <section className="hero" aria-labelledby="hero-title">
        <HeroCaustics />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="kicker rise" style={{ ["--d" as string]: "0.1s" }}>
            Museo bioluminiscente de lo imposible
          </p>
          <h1 id="hero-title" className="display hero-title" aria-label="ABISAL">
            <span className="line" aria-hidden="true">
              <span style={{ ["--d" as string]: "0.2s" }}>ABISAL</span>
            </span>
          </h1>
          <p className="hero-tag">
            <span className="line">
              <span style={{ ["--d" as string]: "0.75s" }}>Donde la luz se rinde,</span>
            </span>
            <span className="line">
              <span style={{ ["--d" as string]: "0.9s" }}>el conocimiento brilla.</span>
            </span>
          </p>
          <div className="rise" style={{ ["--d" as string]: "1.2s" }}>
            <button ref={cta} className="cta" onClick={dive} data-harpoon>
              <span className="cta-lure" aria-hidden="true" />
              Sumérgete
            </button>
          </div>
          <p className="hero-depth rise" style={{ ["--d" as string]: "1.5s" }}>
            0 m · 8 investigaciones · 5 zonas · baja con la rueda <span aria-hidden="true">↓</span>
          </p>
        </div>
        <div className="hero-waterline" aria-hidden="true" />
      </section>

      {/* ── Manifiesto ── */}
      <section className="wrap manifest-sec">
        <p className="kicker">Manifiesto</p>
        <p ref={manifest} className="display manifest">
          Cada expediente de este museo vive a una profundidad. Cuanto más desciendes, menos luz queda, y más brilla lo que importa: lo que sabemos y todo lo que aún no.
        </p>
      </section>

      {/* ── Zonas ── */}
      <section className="wrap zones-preview" aria-labelledby="zp-title">
        <h2 id="zp-title" className="display h2">
          Cinco zonas, once mil metros
        </h2>
        <ol className="zp-list">
          {ZONES.map((z, i) => (
            <li key={z.id} className="zp-item" data-zone={z.id} style={{ ["--i" as string]: i }}>
              <Link to="/descenso" data-harpoon>
                <span className="zp-range">
                  {fmtMeters(z.min)}–{fmtMeters(z.max)} m
                </span>
                <span className="zp-name">
                  {z.name} <em>{z.alias}</em>
                </span>
                <span className="zp-blurb">{z.blurb}</span>
                <span className="zp-bar" aria-hidden="true">
                  <i style={{ width: `${((z.max - z.min) / 11000) * 100 + 8}%` }} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Hoy en el museo ── */}
      <section className="wrap today" aria-labelledby="today-title">
        <div className="today-head">
          <h2 id="today-title" className="display h2">
            Hoy en las vitrinas
          </h2>
          <p>El museo baraja sus especímenes cada día con una semilla distinta: hoy, {dailySeed()}.</p>
        </div>
        <div className="grid-3">
          {today.map((a, i) => (
            <Vitrina key={a.slug} article={a} index={100 + i} />
          ))}
        </div>
        <p className="today-cta">
          <Link to="/catalogo" className="btn-ghost" data-harpoon>
            Ver los 8 especímenes →
          </Link>
        </p>
      </section>
    </div>
  );
}
