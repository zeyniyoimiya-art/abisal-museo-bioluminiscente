// «/catalogo» — vitrinas de vidrio de los 8 especímenes, barajados con la semilla del día.
// Los filtros por zona son radios nativos + :has() en CSS (cero JS de filtrado).
import { useMemo } from "react";
import { ARTICLES } from "../lib/content";
import { ZONES, dailySeed, seededShuffle } from "../lib/depth";
import Vitrina from "../components/Vitrina";
import Words from "../components/Words";

export default function Catalogo() {
  const seed = dailySeed();
  const list = useMemo(() => seededShuffle(ARTICLES, seed), [seed]);

  return (
    <div className="catalog" data-depth-min="400" data-depth-max="3200">
      <section className="wrap catalog-head">
        <p className="kicker">Catálogo · {ARTICLES.length} especímenes</p>
        <Words as="h1" text="Vitrinas del museo" className="display page-title" />
        <p className="lead">
          El orden se baraja en tu navegador con la fecha de hoy como semilla (<code>{seed}</code>): mañana, otro recorrido. Filtra por zona, o pasa el puntero sobre una vitrina para encender su luz.
        </p>
      </section>

      {/* Filtros: radios nativos; el CSS usa .catalog:has(#f-zona:checked) */}
      <fieldset className="wrap filters">
        <legend className="sr-only">Filtrar por zona</legend>
        <input type="radio" name="zone" id="f-all" defaultChecked />
        <label htmlFor="f-all">Todas</label>
        {ZONES.map((z) => (
          <span key={z.id} style={{ display: "contents" }}>
            <input type="radio" name="zone" id={`f-${z.id}`} />
            <label htmlFor={`f-${z.id}`} data-zone={z.id}>
              {z.name} <small>{ARTICLES.filter((a) => a.zone === z.id).length}</small>
            </label>
          </span>
        ))}
      </fieldset>

      <section className="wrap grid-cat" aria-label="Especímenes">
        {list.map((a, i) => (
          <Vitrina key={a.slug} article={a} index={200 + i} />
        ))}
      </section>
    </div>
  );
}
