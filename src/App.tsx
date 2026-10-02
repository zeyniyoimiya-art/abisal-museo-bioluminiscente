// ABISAL · Museo Bioluminiscente de lo Imposible — raíz de la aplicación.
// Capas persistentes (atmósfera, plancton, linterna, HUD, controles) + enrutado por hash.
import { useEffect } from "react";
import Lenis from "lenis";
import Atmosphere from "./components/Atmosphere";
import Plankton from "./components/Plankton";
import Flashlight from "./components/Flashlight";
import HUD from "./components/HUD";
import Controls from "./components/Controls";
import FX from "./components/FX";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Descenso from "./pages/Descenso";
import Expediente from "./pages/Expediente";
import Catalogo from "./pages/Catalogo";
import Sonar from "./pages/Sonar";
import NotFound from "./pages/NotFound";
import { usePath } from "./lib/router";
import { startDepthEngine, refreshDepth } from "./lib/depthEngine";
import { gsap, ScrollTrigger } from "./lib/gsap";
import { setLenis, prefersReduced } from "./lib/motion";
import { applySurface, useSurface } from "./lib/prefs";

const TITLES: Record<string, string> = {
  "/": "ABISAL · Museo Bioluminiscente de lo Imposible",
  "/descenso": "Descenso · ABISAL",
  "/catalogo": "Catálogo · ABISAL",
  "/sonar": "Sonar · Lin Yue 林玥 · ABISAL",
};

function route(path: string) {
  if (path === "/") return <Home />;
  if (path === "/descenso") return <Descenso />;
  if (path === "/catalogo") return <Catalogo />;
  if (path === "/sonar") return <Sonar />;
  const m = path.match(/^\/expediente\/([a-z0-9-]+)\/?$/);
  if (m) return <Expediente slug={m[1]} />;
  return <NotFound />;
}

export default function App() {
  const path = usePath();
  const surface = useSurface();

  // MODO SUPERFICIE: aplica data-surface al <html> y reacciona a prefers-reduced-motion
  useEffect(() => {
    applySurface();
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    q.addEventListener("change", applySurface);
    startDepthEngine();
    return () => q.removeEventListener("change", applySurface);
  }, []);

  // Scroll inercial (Lenis) sincronizado con GSAP; desactivado en modo superficie
  useEffect(() => {
    if (surface || prefersReduced()) {
      setLenis(null);
      return;
    }
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [surface]);

  // Título del documento y re-medición de profundidad al cambiar de ruta
  useEffect(() => {
    if (!path.startsWith("/expediente/")) document.title = TITLES[path] ?? "ZONA MUERTA · ABISAL";
    refreshDepth();
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(t);
  }, [path]);

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Saltar al contenido
      </a>
      <Atmosphere />
      <Plankton />
      <Nav />
      <HUD />
      <Controls />
      <FX />
      <main id="main" tabIndex={-1} key={path}>
        {route(path)}
      </main>
      <Footer />
      <Flashlight />
    </>
  );
}
