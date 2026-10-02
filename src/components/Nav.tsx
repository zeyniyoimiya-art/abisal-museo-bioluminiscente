// Barra superior flotante + barra de progreso nativa (CSS scroll-timeline).
import Link from "./Link";
import { usePath } from "../lib/router";

const LINKS = [
  { to: "/descenso", label: "Descenso" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/sonar", label: "Sonar" },
];

export default function Nav() {
  const path = usePath();
  return (
    <header className="nav">
      <Link to="/" className="brand" aria-label="ABISAL — inicio" data-harpoon>
        <span className="brand-mark" aria-hidden="true" />
        ABISAL
      </Link>
      <nav aria-label="Principal">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} data-harpoon aria-current={path.startsWith(l.to) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      {/* Progreso de scroll 100 % CSS: animation-timeline: scroll(root) */}
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
