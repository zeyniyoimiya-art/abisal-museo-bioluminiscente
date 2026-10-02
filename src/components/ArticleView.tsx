// EXPEDIENTE editorial completo: portada con Ken Burns, ficha técnica de laboratorio (subgrid),
// capitular animada, shape-outside, timeline, tabla de datos, cita de fuente primaria,
// «Bioluminiscencia del dato», galería con scroll-snap y fuentes al pie.
import { Fragment, type ReactNode } from "react";
import type { Article } from "../lib/content";
import { photoUrl, photoPage } from "../content/photos";
import { ZONE_BY_ID, fmtMeters } from "../lib/depth";
import Words from "./Words";
import Waveform from "./Waveform";
import { scrollToY } from "../lib/motion";

/** Renderiza **negrita**, *cursiva* y [texto](url). */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m)
      return (
        <a key={i} href={m[2]} target="_blank" rel="noreferrer">
          {m[1]}
        </a>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ArticleView({ article: a, instance = "a" }: { article: Article; instance?: string }) {
  const zone = ZONE_BY_ID[a.zone];
  const hero = a.photos[0];
  const headings = a.blocks.filter((b) => b.type === "h2") as Array<{ type: "h2"; text: string }>;
  const idFor = (t: string) => `${instance}-${a.slug}-${slugify(t)}`;
  let firstP = true;

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 110);
  };

  return (
    <article className="dossier" data-zone={a.zone} data-depth-min={zone.min} data-depth-max={zone.max} data-slug={a.slug}>
      {/* ── Portada ── */}
      <header className="dossier-hero">
        <div className="kb">
          <img src={photoUrl(hero, 1600, 900)} alt={hero.alt} width={1600} height={900} fetchPriority="high" decoding="async" />
        </div>
        <div className="dossier-hero-shade" />
        <div className="wrap dossier-hero-text">
          <p className="kicker">
            EXP-{String(a.order).padStart(2, "0")} · {a.kicker}
          </p>
          <Words as="h1" text={a.title} className="display dossier-title" />
          <p className="dossier-sub">{a.subtitle}</p>
          <ul className="meta-row">
            <li>
              <span>Zona</span>
              <b>{zone.name}</b>
            </li>
            <li>
              <span>Ancla</span>
              <b>{fmtMeters(a.depthM)} m</b>
            </li>
            <li>
              <span>Lectura</span>
              <b>{a.minutes} min</b>
            </li>
            <li>
              <span>Palabras</span>
              <b>{a.words.toLocaleString("es")}</b>
            </li>
          </ul>
        </div>
      </header>

      <div className="dossier-grid">
        {/* ── Texto ── */}
        <div className="dossier-main prose">
          {a.blocks.map((b, i) => {
            switch (b.type) {
              case "h2":
                return <Words key={i} as="h2" id={idFor(b.text)} text={b.text} className="display h2" />;
              case "p": {
                const cls = firstP ? "dropcap" : undefined;
                firstP = false;
                return (
                  <p key={i} className={cls}>
                    {inline(b.text)}
                  </p>
                );
              }
              case "blockquote":
                return <blockquote key={i}>{inline(b.text)}</blockquote>;
              case "bio":
                return (
                  <aside key={i} className="bio">
                    <span className="bio-tag">
                      <i aria-hidden="true" /> {b.title}
                    </span>
                    <p>{inline(b.text)}</p>
                  </aside>
                );
              case "img": {
                const p = a.photos[b.index];
                if (!p) return null;
                return (
                  <figure key={i} className={b.float ? "fig fig-float" : "fig"}>
                    <img src={photoUrl(p, b.float ? 640 : 1100, b.float ? 640 : 620)} alt={p.alt} width={b.float ? 640 : 1100} height={b.float ? 640 : 620} loading="lazy" decoding="async" />
                    <figcaption>
                      {p.cap}{" "}
                      <span>
                        Foto: <a href={p.byUrl} target="_blank" rel="noreferrer">{p.by}</a> · <a href={photoPage(p)} target="_blank" rel="noreferrer">Pexels</a>
                      </span>
                    </figcaption>
                  </figure>
                );
              }
              case "table":
                return (
                  <figure key={i} className="datatable">
                    <figcaption>
                      <span className="sonar-dot" aria-hidden="true" /> Tabla de datos · {a.table.caption}
                    </figcaption>
                    <div className="table-scroll" tabIndex={0} role="region" aria-label={a.table.caption}>
                      <table>
                        <thead>
                          <tr>
                            {a.table.head.map((h) => (
                              <th key={h} scope="col">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {a.table.rows.map((r, ri) => (
                            <tr key={ri}>
                              {r.map((c, ci) => (ci === 0 ? <th key={ci} scope="row">{c}</th> : <td key={ci}>{c}</td>))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </figure>
                );
              case "quote":
                return (
                  <blockquote key={i} className="source-quote">
                    <span className="kicker">Fuente primaria</span>
                    <p>{a.quote.text}</p>
                    <footer>
                      <a href={a.quote.url} target="_blank" rel="noreferrer">
                        {a.quote.who} ↗
                      </a>
                    </footer>
                  </blockquote>
                );
              case "timeline":
                return (
                  <section key={i} className="timeline-wrap" aria-label="Línea de tiempo">
                    <h2 className="display h2 tl-title">Línea de tiempo</h2>
                    <ol className="timeline">
                      {a.timeline.map((t, ti) => (
                        <li key={ti} style={{ ["--i" as string]: ti }}>
                          <time>{t.y}</time>
                          <p>{t.t}</p>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* ── Ficha técnica (sticky, subgrid) ── */}
        <aside className="dossier-aside" aria-label="Ficha técnica">
          <section className="ficha-card">
            <h2>
              Ficha técnica <small>EXP-{String(a.order).padStart(2, "0")}</small>
            </h2>
            <dl className="ficha">
              {a.ficha.map(([k, v]) => (
                <div className="ficha-row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <Waveform seed={a.order} />
            <p className="ficha-foot">Señal de ecosonda · zona {zone.alias.toLowerCase()}</p>
          </section>
          <nav className="toc" aria-label="En este expediente">
            <h2>Índice</h2>
            <ol>
              {headings.map((h) => (
                <li key={h.text}>
                  <button type="button" onClick={() => goTo(idFor(h.text))}>
                    {h.text}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>

      {/* ── Galería horizontal con scroll-snap ── */}
      <section className="gallery-wrap" aria-label="Galería">
        <div className="wrap">
          <p className="kicker">Galería · {a.photos.length} imágenes ilustrativas</p>
        </div>
        <ul className="gallery" tabIndex={0} aria-label="Galería de imágenes, desplazable" data-lenis-prevent-wheel>
          {a.photos.map((p, i) => (
            <li key={i}>
              <figure>
                <img src={photoUrl(p, 900, 600)} alt={p.alt} width={900} height={600} loading="lazy" decoding="async" />
                <figcaption>
                  {p.cap}
                  <span>
                    Foto: <a href={p.byUrl} target="_blank" rel="noreferrer">{p.by}</a> · Pexels
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Fuentes ── */}
      <section className="wrap sources" aria-label="Fuentes">
        <h2 className="display h2">Fuentes</h2>
        <ol>
          {a.sources.map((s) => (
            <li key={s.u}>
              <a href={s.u} target="_blank" rel="noreferrer">
                {s.t} ↗
              </a>
            </li>
          ))}
        </ol>
        <p className="sources-note">
          Las citas se presentan como resúmenes fieles de la fuente, salvo cuando figuran entre comillas. Las fotografías son ilustrativas y no documentan el objeto exacto descrito.
        </p>
      </section>
    </article>
  );
}
