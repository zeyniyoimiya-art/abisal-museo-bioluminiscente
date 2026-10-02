// «/expediente/:slug» — artículo editorial completo con HUD de profundidad propio
// (cada expediente recorre el rango de su zona) y MODO DERIVA: scroll infinito que
// encadena expedientes aleatorios sin volver a la superficie.
import { useEffect, useRef, useState } from "react";
import { ARTICLES, bySlug } from "../lib/content";
import ArticleView from "../components/ArticleView";
import Link from "../components/Link";
import NotFound from "./NotFound";
import { useDrift, toggleDrift } from "../lib/prefs";
import { refreshDepth } from "../lib/depthEngine";
import { mulberry32 } from "../lib/depth";

/** Siguiente slug aleatorio que aún no esté en la cadena (si se agotan, vuelve a empezar). */
function nextRandom(chain: string[]): string {
  const last = chain[chain.length - 1];
  let pool = ARTICLES.map((a) => a.slug).filter((s) => !chain.includes(s));
  if (!pool.length) pool = ARTICLES.map((a) => a.slug).filter((s) => s !== last);
  const rnd = mulberry32(Date.now() % 100000 || 1);
  return pool[Math.floor(rnd() * pool.length)];
}

export default function Expediente({ slug }: { slug: string }) {
  const article = bySlug(slug);
  const drift = useDrift();
  const [chain, setChain] = useState<string[]>([slug]);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (article) document.title = `${article.short} · ABISAL`;
  }, [article]);

  // Deriva: al acercarse al final, añade otro expediente aleatorio.
  useEffect(() => {
    const el = sentinel.current;
    if (!drift || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setChain((c) => (c.length < 24 ? [...c, nextRandom(c)] : c));
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drift, chain.length]);

  useEffect(() => {
    refreshDepth();
  }, [chain.length]);

  if (!article) return <NotFound />;

  const idx = ARTICLES.findIndex((a) => a.slug === slug);
  const prev = ARTICLES[(idx - 1 + ARTICLES.length) % ARTICLES.length];
  const next = ARTICLES[(idx + 1) % ARTICLES.length];
  const shown = drift ? chain : [slug];

  return (
    <div className="expediente">
      {shown.map((s, i) => {
        const a = bySlug(s)!;
        return (
          <div key={`${s}-${i}`}>
            {i > 0 && (
              <div className="current-divider" role="separator" aria-label="Siguiendo la corriente">
                <span>≈ siguiendo la corriente ≈</span>
              </div>
            )}
            <ArticleView article={a} instance={`c${i}`} />
          </div>
        );
      })}

      {drift ? (
        <div ref={sentinel} className="wrap drift-end">
          <p className="kicker">Modo deriva activo</p>
          <p>La corriente te lleva al siguiente expediente… sin volver a la superficie.</p>
          <button className="btn-ghost" onClick={toggleDrift}>
            Detener la deriva
          </button>
        </div>
      ) : (
        <nav className="wrap endcap" aria-label="Siguientes expedientes">
          <p className="kicker">Sigue la corriente</p>
          <div className="endcap-grid">
            <Link to={`/expediente/${prev.slug}`} className="endcap-card" data-harpoon>
              <span>← Anterior</span>
              <b>{prev.short}</b>
            </Link>
            <Link to={`/expediente/${next.slug}`} className="endcap-card" data-harpoon>
              <span>Siguiente →</span>
              <b>{next.short}</b>
            </Link>
          </div>
          <button className="btn-ghost" onClick={toggleDrift}>
            Activar Modo Deriva (scroll infinito)
          </button>
        </nav>
      )}
    </div>
  );
}
