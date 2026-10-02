// Organismos bioluminiscentes en SVG. Se colocan dentro de elementos .lux:
// solo la linterna los revela. Cada uno tiene «bloom» pulsante por CSS.
import type { CSSProperties } from "react";

export type Kind = "jelly" | "angler" | "siphon" | "xeno" | "squid";

export function Organism({ kind, className = "", style }: { kind: Kind; className?: string; style?: CSSProperties }) {
  const cls = `organism org-${kind} ${className}`;
  switch (kind) {
    case "jelly":
      return (
        <svg className={cls} style={style} viewBox="0 0 120 170" aria-hidden="true">
          <path d="M8 70C8 14 112 14 112 70 98 62 82 76 60 66 38 76 22 62 8 70Z" fill="rgba(125,249,255,.14)" stroke="#7df9ff" strokeWidth="2" />
          <path d="M30 40c10-12 50-12 60 0" fill="none" stroke="#eaf7ff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          {[24, 40, 60, 80, 96].map((x, i) => (
            <path key={x} className="tent" style={{ animationDelay: `${i * 0.4}s` }} d={`M${x} 70c-8 30 10 46 0 92`} fill="none" stroke="#6ee7a0" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
      );
    case "angler":
      return (
        <svg className={cls} style={style} viewBox="0 0 220 150" aria-hidden="true">
          <path d="M18 84C18 42 92 20 148 50c28 14 46 30 44 52-22 26-96 32-150 8Z" fill="rgba(4,16,24,.9)" stroke="#7df9ff" strokeOpacity=".7" strokeWidth="2" />
          <path d="M44 104l10-12 10 12 10-12 10 12 10-12 10 12 10-12" fill="none" stroke="#eaf7ff" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="132" cy="70" r="7" fill="#eaf7ff" />
          <circle cx="134" cy="70" r="3" fill="#020409" />
          <path d="M96 38C88 6 130 2 142 24" fill="none" stroke="#7df9ff" strokeOpacity=".7" strokeWidth="2" />
          <circle className="lure" cx="142" cy="26" r="8" fill="#7df9ff" />
        </svg>
      );
    case "siphon":
      return (
        <svg className={cls} style={style} viewBox="0 0 260 90" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} className="bead" style={{ animationDelay: `${i * 0.18}s` }} cx={14 + i * 15.5} cy={45 + Math.sin(i * 0.7) * 22} r={5 - (i % 3)} fill="#6ee7a0" />
          ))}
        </svg>
      );
    case "xeno":
      return (
        <svg className={cls} style={style} viewBox="0 0 140 110" aria-hidden="true">
          <path d="M14 70C6 40 40 14 74 20c34 4 62 24 52 54-8 26-48 32-76 28-20-3-32-14-36-32Z" fill="rgba(110,231,160,.1)" stroke="#6ee7a0" strokeWidth="2" strokeDasharray="3 5" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} className="bead" style={{ animationDelay: `${i * 0.3}s` }} cx={34 + ((i * 37) % 80)} cy={36 + ((i * 23) % 44)} r="3.2" fill="#6ee7a0" />
          ))}
        </svg>
      );
    default:
      return (
        <svg className={cls} style={style} viewBox="0 0 90 190" aria-hidden="true">
          <path d="M45 6C70 30 74 62 62 84l-34 0C16 62 20 30 45 6Z" fill="rgba(125,249,255,.1)" stroke="#7df9ff" strokeWidth="2" />
          {[24, 36, 48, 60, 70].map((x, i) => (
            <path key={x} className="tent" style={{ animationDelay: `${i * 0.3}s` }} d={`M${x} 84c-4 28 6 50-2 98`} fill="none" stroke="#7df9ff" strokeOpacity=".8" strokeWidth="2" strokeLinecap="round" />
          ))}
          <circle cx="36" cy="58" r="5" fill="#eaf7ff" />
          <circle cx="54" cy="58" r="5" fill="#eaf7ff" />
        </svg>
      );
  }
}
