// VITRINA de espécimen: tarjeta de «vidrio sumergido» con borde cáustico animado,
// tilt 3D, refracción sutil, tooltip con CSS anchor positioning y :has() para encender el conjunto.
import Link from "./Link";
import { useTilt } from "../lib/hooks";
import { type Article } from "../lib/content";
import { photoUrl } from "../content/photos";
import { ZONE_BY_ID, fmtMeters } from "../lib/depth";

interface Props {
  article: Article;
  index: number;
  className?: string;
}

export default function Vitrina({ article: a, index, className = "" }: Props) {
  const ref = useTilt<HTMLElement>(6);
  const zone = ZONE_BY_ID[a.zone];
  const anchor = `--a${index}`;
  const hero = a.photos[0];
  return (
    <article ref={ref} className={`vitrina ${className}`} data-zone={a.zone}>
      <span className="vitrina-edge" aria-hidden="true" />
      <Link to={`/expediente/${a.slug}`} className="vitrina-link" data-harpoon aria-label={`Abrir expediente: ${a.title}`}>
        <div className="vitrina-media">
          <img src={photoUrl(hero, 900, 560)} alt={hero.alt} width={900} height={560} loading="lazy" decoding="async" />
          <span className="vitrina-no">EXP-{String(a.order).padStart(2, "0")}</span>
        </div>
        <div className="vitrina-body">
          <p className="kicker">{a.kicker}</p>
          <h3>{a.title}</h3>
          <p className="vitrina-sum">{a.summary}</p>
          <ul className="mini-ficha">
            {a.ficha.slice(0, 3).map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </li>
            ))}
          </ul>
          <span className="vitrina-cta">
            Abrir expediente <i aria-hidden="true">→</i>
          </span>
        </div>
      </Link>
      {/* Tooltip anclado al botón (CSS anchor positioning; fallback absoluto) */}
      <button
        className="tip-btn"
        type="button"
        aria-describedby={`tip-${a.slug}`}
        aria-label={`Datos de ${a.short}`}
        style={{ ["anchorName" as string]: anchor }}
      >
        i
      </button>
      <div id={`tip-${a.slug}`} role="tooltip" className="tip" style={{ ["positionAnchor" as string]: anchor }}>
        <b>{zone.name}</b> · ancla a {fmtMeters(a.depthM)} m<br />
        {a.words.toLocaleString("es")} palabras · {a.minutes} min · {a.photos.length} imágenes
      </div>
    </article>
  );
}
