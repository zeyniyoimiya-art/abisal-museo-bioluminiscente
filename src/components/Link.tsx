// Enlace interno: href="#/ruta" (funciona sin JS) + navegación con View Transition.
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { go } from "../lib/router";
import { audio } from "../lib/audio";

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  mode?: "fade" | "circle" | "none";
}

export default function Link({ to, mode = "fade", onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    audio.bubble();
    go(to, { mode, origin: { x: e.clientX, y: e.clientY } });
  };
  return (
    <a href={`#${to}`} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
