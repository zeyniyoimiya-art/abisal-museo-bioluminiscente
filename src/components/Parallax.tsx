// Parallax de 4 capas por zona. El movimiento es CSS puro (animation-timeline: view()),
// así que no cuesta nada al hilo principal. Sin soporte → capas estáticas.
export default function Parallax({ zone }: { zone: string }) {
  return (
    <div className={`px-stack px-${zone}`} aria-hidden="true">
      <div className="px px-1" style={{ ["--spd" as string]: "140px" }} />
      <div className="px px-2" style={{ ["--spd" as string]: "90px" }} />
      <div className="px px-3" style={{ ["--spd" as string]: "40px" }} />
      <div className="px px-4" style={{ ["--spd" as string]: "-70px" }} />
    </div>
  );
}
