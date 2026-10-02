// Pie: marquee de datos NOAA, firma con sello rojo y créditos.
import Seal from "./Seal";
import Link from "./Link";

// Cifras divulgadas por NOAA (Ocean Service / Ocean Exploration).
const NOAA = [
  "NOAA · más del 80 % del océano sigue sin cartografiar, observar ni explorar",
  "NOAA · el océano cubre ≈ 71 % de la superficie de la Tierra",
  "NOAA · contiene ≈ 97 % del agua del planeta",
  "NOAA · el océano produce más de la mitad del oxígeno que respiramos",
  "NOAA · Challenger Deep ≈ 10,935 m · ≈ 1,086 bares de presión",
];

export default function Footer() {
  const items = [...NOAA, ...NOAA];
  return (
    <footer className="footer">
      <div className="marquee" aria-label="Datos de NOAA sobre el océano">
        <div className="marquee-track">
          {items.map((t, i) => (
            <span key={i} aria-hidden={i >= NOAA.length ? true : undefined}>
              {t}
              <i aria-hidden="true">◆</i>
            </span>
          ))}
        </div>
      </div>
      <div className="footer-body">
        <div>
          <p className="footer-tag">Donde la luz se rinde, el conocimiento brilla.</p>
          <p className="footer-small">
            ABISAL · Museo Bioluminiscente de lo Imposible. Sitio 100 % estático: sin backend, sin base de datos, sin cuentas. Fotografías ilustrativas de{" "}
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
              Pexels
            </a>
            ; datos y fuentes citados al pie de cada expediente.
          </p>
          <nav className="footer-links" aria-label="Pie">
            <Link to="/descenso">Descenso</Link>
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/sonar">Sonar</Link>
          </nav>
        </div>
        <Link to="/sonar" className="footer-seal" aria-label="Firma: Lin Yue 林玥" data-harpoon>
          <Seal size={84} id="seal-foot" />
          <span>Lin Yue 林玥</span>
        </Link>
      </div>
    </footer>
  );
}
