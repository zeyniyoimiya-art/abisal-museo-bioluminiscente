// Waveform SVG de «ecosonda»: el trazo se dibuja con stroke-dashoffset al entrar en pantalla.
import { useMemo } from "react";
import { mulberry32 } from "../lib/depth";
import { useInView } from "../lib/hooks";

export default function Waveform({ seed = 1, className = "" }: { seed?: number; className?: string }) {
  const { ref, inView } = useInView<SVGSVGElement>(true);
  const d = useMemo(() => {
    const rnd = mulberry32(seed * 977);
    const pts: string[] = [];
    const n = 120;
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * 300;
      const env = Math.sin((i / n) * Math.PI);
      const y = 24 + Math.sin(i * 0.55 + seed) * 10 * env + (rnd() - 0.5) * 18 * env;
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [seed]);

  return (
    <svg ref={ref} className={`waveform ${inView ? "draw" : ""} ${className}`} viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="24" x2="300" y2="24" stroke="#7df9ff" strokeOpacity=".18" strokeDasharray="2 4" />
      <path d={d} pathLength={1} fill="none" stroke="#7df9ff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
