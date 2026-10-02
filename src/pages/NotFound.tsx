// «/404» — ZONA MUERTA: sin oxígeno, con una medusa varada y ascenso de emergencia.
import Link from "../components/Link";
import { useMagnetic } from "../lib/hooks";
import { go } from "../lib/router";
import { burst } from "../components/Controls";

export default function NotFound() {
  const magnet = useMagnetic<HTMLButtonElement>(0.35);
  return (
    <div className="deadzone" data-depth-min="11000" data-depth-max="11000">
      <div className="wrap deadzone-grid">
        <div>
          <p className="kicker alarm">Alerta · señal perdida</p>
          <h1 className="display dead-title">ZONA MUERTA</h1>
          <p className="lead">
            Esta ruta no existe, o el oxígeno se acabó antes de llegar. Aquí abajo ya no hay luz, ni señal, ni página.
          </p>
          <ul className="dead-readout" aria-label="Estado del sistema">
            <li>
              <span>O₂</span>
              <b>0 %</b>
            </li>
            <li>
              <span>LUZ</span>
              <b>0.0 %</b>
            </li>
            <li>
              <span>SEÑAL</span>
              <b>—</b>
            </li>
          </ul>
          <button
            ref={magnet}
            className="cta"
            data-harpoon
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const o = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
              burst(o.x, o.y, true);
              go("/", { mode: "circle", origin: o });
            }}
          >
            <span className="cta-lure" aria-hidden="true" />
            Ascenso de emergencia ↑
          </button>
          <p className="dead-links">
            o intenta con el <Link to="/catalogo">catálogo</Link>.
          </p>
        </div>

        {/* Medusa varada sobre el sedimento */}
        <svg className="stranded" viewBox="0 0 420 260" role="img" aria-label="Una medusa varada sin brillo sobre el fondo marino">
          <ellipse cx="210" cy="228" rx="190" ry="14" fill="#000" opacity=".6" />
          <path d="M20 232c60-10 120-14 190-14s130 4 190 14" stroke="#2a3a40" strokeWidth="3" fill="none" />
          <g transform="rotate(-8 210 180)">
            <path d="M80 200C80 120 340 120 340 200 310 190 280 208 210 194 140 208 110 190 80 200Z" fill="#12222a" stroke="#4a5f68" strokeWidth="2" />
            <path d="M120 170c30-22 150-22 180 0" fill="none" stroke="#4a5f68" strokeOpacity=".6" strokeWidth="2" />
            {[110, 150, 190, 230, 270, 310].map((x, i) => (
              <path key={x} d={`M${x} 200c${i % 2 ? 24 : -24} 14 ${i % 2 ? 50 : -50} 4 ${i % 2 ? 80 : -80} 18`} fill="none" stroke="#35505a" strokeWidth="2.5" strokeLinecap="round" />
            ))}
          </g>
          <circle className="dead-spark" cx="206" cy="150" r="3" fill="#7df9ff" />
        </svg>
      </div>
    </div>
  );
}
