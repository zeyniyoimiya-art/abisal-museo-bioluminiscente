// Capas atmosféricas globales: grano vivo, cáusticas, velo de oscuridad (linterna)
// y definiciones de filtros SVG (distorsión de «agua» en hovers).

export default function Atmosphere() {
  return (
    <>
      {/* Filtros SVG reutilizados por CSS (url(#water)) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="water" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="4" result="n">
              <animate attributeName="baseFrequency" dur="6s" values="0.012 0.03;0.02 0.045;0.012 0.03" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Cáusticas: luz que baila; se apagan con la profundidad (--light) */}
      <div className="caustics" aria-hidden="true" />
      {/* Velo de oscuridad con agujero siguiendo la linterna */}
      <div className="veil" aria-hidden="true" />
      {/* Grano orgánico sobre toda la interfaz */}
      <div className="grain" aria-hidden="true" />
    </>
  );
}
