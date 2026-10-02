// Estado global del puntero (compartido por linterna, plancton y cursor).
// Se muta fuera de React para no provocar renders en cada pointermove.
export const pointer = {
  x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  /** ¿Se ha movido alguna vez? (si no, la linterna descansa en el centro) */
  moved: false,
  /** Velocidad aproximada (px/frame) para que el plancton «sienta» el movimiento. */
  speed: 0,
};
