// Split por palabras con stagger: cada palabra sube desde una máscara de línea.
import { Fragment } from "react";
import { useInView } from "../lib/hooks";

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  step?: number; // ms entre palabras
  id?: string;
}

export default function Words({ text, as: Tag = "h2", className = "", step = 55, id }: Props) {
  const { ref, inView } = useInView<HTMLElement>(true);
  const words = text.split(" ");
  const Any = Tag as "h2";
  return (
    <Any id={id} ref={ref as React.RefObject<HTMLHeadingElement>} className={`words ${inView ? "in" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ animationDelay: `${i * step}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Any>
  );
}
