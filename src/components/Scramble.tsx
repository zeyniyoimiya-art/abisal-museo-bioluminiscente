// Título con scramble-decode al entrar en pantalla.
import { useEffect } from "react";
import { useInView } from "../lib/hooks";
import { scrambleText } from "../lib/scramble";

interface Props {
  text: string;
  as?: "span" | "h2" | "h3" | "p";
  className?: string;
}

export default function Scramble({ text, as: Tag = "span", className }: Props) {
  const { ref, inView } = useInView<HTMLElement>(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!inView) {
      // En MODO SUPERFICIE el texto es legible desde el primer momento (sin pre-cifrado).
      el.textContent = document.documentElement.dataset.surface ? text : text.replace(/[^\s]/g, "·");
      return;
    }
    return scrambleText(el, text, 1100);
  }, [inView, text, ref]);
  // El texto real vive en aria-label para lectores de pantalla.
  const Any = Tag as "span";
  return <Any ref={ref as React.RefObject<HTMLSpanElement>} className={className} aria-label={text} />;
}
