// HUD DE INMERSIÓN: profundidad, presión, temperatura, luz y zona en vivo.
// Se actualiza por refs (sin re-render) desde el motor de profundidad.
// Al cambiar de zona, los números hacen «scramble» durante 700 ms.
import { useEffect, useRef } from "react";
import { subscribeDepth } from "../lib/depthEngine";
import { lightPercent, MAX_DEPTH, pressureAtm, temperatureC, type ZoneId } from "../lib/depth";
import { noiseDigits, scrambleText } from "../lib/scramble";
import { audio } from "../lib/audio";

export default function HUD() {
  const depth = useRef<HTMLElement>(null);
  const press = useRef<HTMLElement>(null);
  const temp = useRef<HTMLElement>(null);
  const light = useRef<HTMLElement>(null);
  const zone = useRef<HTMLElement>(null);
  const alias = useRef<HTMLElement>(null);
  const gauge = useRef<HTMLElement>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastZone: ZoneId | null = null;
    let scrambleUntil = 0;
    let lastAudio = 0;
    const unsub = subscribeDepth(({ depth: d, zone: z }) => {
      const now = performance.now();
      if (z.id !== lastZone) {
        if (lastZone !== null) {
          scrambleUntil = now + 700;
          if (zone.current) scrambleText(zone.current, z.name.toUpperCase(), 800);
          if (alias.current) scrambleText(alias.current, z.alias, 800);
        } else {
          if (zone.current) zone.current.textContent = z.name.toUpperCase();
          if (alias.current) alias.current.textContent = z.alias;
        }
        lastZone = z.id;
        root.current?.setAttribute("data-zone", z.id);
      }
      const l = lightPercent(d);
      const vals = {
        depth: Math.round(d).toLocaleString("en-US"),
        press: Math.round(pressureAtm(d)).toLocaleString("en-US"),
        temp: temperatureC(d).toFixed(1),
        light: l < 0.05 ? "0.0" : l < 10 ? l.toFixed(1) : l.toFixed(0),
      };
      const scrambling = now < scrambleUntil;
      const show = (s: string) => (scrambling ? noiseDigits(s) : s);
      if (depth.current) depth.current.textContent = show(vals.depth);
      if (press.current) press.current.textContent = show(vals.press);
      if (temp.current) temp.current.textContent = show(vals.temp);
      if (light.current) light.current.textContent = show(vals.light);
      if (gauge.current) gauge.current.style.transform = `scaleY(${(d / MAX_DEPTH).toFixed(4)})`;
      if (now - lastAudio > 400) {
        audio.setDepth(d);
        lastAudio = now;
      }
    });
    return unsub;
  }, []);

  return (
    <aside className="hud" ref={root} aria-label="Instrumentos de inmersión">
      <div className="hud-zone">
        <b ref={zone} />
        <small ref={alias} />
      </div>
      <dl className="hud-grid">
        <div>
          <dt>PROF</dt>
          <dd>
            <b ref={depth}>0</b> <i>m</i>
          </dd>
        </div>
        <div>
          <dt>PRES</dt>
          <dd>
            <b ref={press}>1</b> <i>atm</i>
          </dd>
        </div>
        <div>
          <dt>TEMP</dt>
          <dd>
            <b ref={temp}>19.0</b> <i>°C</i>
          </dd>
        </div>
        <div>
          <dt>LUZ</dt>
          <dd>
            <b ref={light}>100</b> <i>%</i>
          </dd>
        </div>
      </dl>
      <div className="hud-gauge" aria-hidden="true">
        <i ref={gauge} />
      </div>
    </aside>
  );
}
