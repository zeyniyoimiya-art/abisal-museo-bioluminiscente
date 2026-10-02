// Superficie vista desde abajo: shader de cáusticas + god-rays en WebGL (WebGL2 si existe).
// Fragment shader propio (cáusticas procedurales tipo «Tileable Water Caustic» + rayos
// volumétricos falsos + luz del puntero). Renderiza a media resolución y se pausa fuera de pantalla.
// Fallback: degradado CSS si no hay WebGL.
import { useEffect, useRef, useState } from "react";
import { prefersReduced } from "../lib/motion";
import { pointer } from "../lib/pointer";
import { surfaceActive } from "../lib/prefs";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;
#define TAU 6.28318530718
#define ITER 5
// Cáustica procedural: capas de interferencia de ondas
float caustic(vec2 uv, float t){
  vec2 p = mod(uv*TAU, TAU) - 250.0;
  vec2 i = p; float c = 1.0; float inten = .005;
  for (int n = 0; n < ITER; n++){
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= float(ITER); c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  vec3 deep = vec3(0.01, 0.10, 0.14);
  vec3 shallow = vec3(0.06, 0.42, 0.50);
  float g = pow(uv.y, 1.5);
  vec3 col = mix(deep, shallow, g);
  vec2 warp = 0.025 * vec2(sin(uTime * .3 + q.y * 5.0), cos(uTime * .25 + q.x * 5.0));
  float c = caustic(q * 0.5 + warp, uTime * 0.4 + 23.0);
  col += vec3(0.45, 0.92, 1.0) * c * (0.2 + 0.9 * g);
  float ang = (uv.x - 0.5 + (1.0 - uv.y) * 0.4);
  float r1 = sin(ang * 34.0 + uTime * 0.30) * 0.5 + 0.5;
  float r2 = sin(ang * 15.0 - uTime * 0.18) * 0.5 + 0.5;
  float rays = pow(r1 * r2, 3.0) * pow(uv.y, 1.6);
  col += vec3(0.5, 0.95, 1.0) * rays * 0.42;
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(q, m);
  col += vec3(0.35, 0.9, 1.0) * exp(-d * d * 16.0) * 0.16;
  col += vec3(0.75, 1.0, 1.0) * smoothstep(0.88, 1.0, uv.y) * 0.4;
  col *= 1.0 - 0.6 * pow(distance(uv, vec2(0.5, 0.42)) * 1.15, 2.0);
  gl_FragColor = vec4(col, 1.0);
}`;

export default function HeroCaustics() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setFailed(true);
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const scale = 0.55; // media resolución: ahorra GPU, el aspecto líquido lo agradece
    const resize = () => {
      const w = Math.max(2, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(2, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let visible = true;
    const still = prefersReduced() || surfaceActive();
    const t0 = performance.now();
    let mx = 0.5;
    let my = 0.6;
    const draw = (now: number) => {
      mx += (pointer.x / window.innerWidth - mx) * 0.06;
      my += (1 - pointer.y / window.innerHeight - my) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 4 : (now - t0) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still && visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !still) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={failed ? "hero-gl hero-gl-off" : "hero-gl"} aria-hidden="true" />;
}
