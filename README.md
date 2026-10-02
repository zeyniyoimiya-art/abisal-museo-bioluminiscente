# ABISAL · Museo Bioluminiscente de lo Imposible

> *Donde la luz se rinde, el conocimiento brilla.*  — Lin Yue 林玥

<p align="center">
  <a href="https://zeyniyoimiya-art.github.io/abisal-museo-bioluminiscente/"><strong>🌊 Ver el museo en vivo</strong></a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite 7" src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black" />
  <img alt="WebGL" src="https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white" />
</p>

<p align="center">
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
  <img alt="PWA offline" src="https://img.shields.io/badge/PWA_offline-5A0FC8?style=flat-square" />
  <img alt="GitHub Pages" src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" />
  <img alt="Accesibilidad" src="https://img.shields.io/badge/accesibilidad-WCAG_2.1_AA-2ea44f?style=flat-square" />
  <img alt="Licencia MIT" src="https://img.shields.io/badge/licencia-MIT-2ea44f?style=flat-square" />
</p>

Museo web inmersivo: **hacer scroll = descender** de 0 a 11,000 m por las cinco zonas oceánicas. Ocho investigaciones completas (900+ palabras cada una) viven ancladas a su profundidad temática. **100 % front-end**: sin backend, sin base de datos, sin auth, sin APIs; el contenido (Markdown + JSON) se empaqueta en el build.

## ⚠️ Nota sobre el stack (desviación del brief)

El brief pedía SvelteKit + `adapter-static`. **Este entorno de build es React 19 + Vite 7 + Tailwind v4** (con `vite-plugin-singlefile`), así que ABISAL se construyó con esa base. Para publicarlo en GitHub Pages el único ajuste fue `base: "./"` en `vite.config.ts` (rutas relativas para servirlo bajo un subdirectorio); nada funcional más. Equivalencias:

| Brief | Implementación aquí |
|---|---|
| SvelteKit + adapter-static (SSG) | React + Vite → un único `dist/index.html` estático, router por hash (`#/ruta`) que funciona en cualquier hosting sin reescrituras |
| `vite-plugin-glob` + MD/JSON | `import.meta.glob('/src/content/*.md', { query: '?raw' })` + parser propio (`src/lib/markdown.ts`) con frontmatter JSON |
| Threlte / three / `postprocessing` / WebGPU + TypeGPU | **No implementados.** Hero con shader GLSL propio en WebGL/WebGL2 (cáusticas + god-rays) y plancton en canvas 2D que huye del cursor. WebGPU/compute queda como siguiente paso |
| svelte-motion, Rive, Barba.js | **No usados.** Micro-transiciones con CSS + GSAP; transiciones de página con View Transitions API nativa (con fallback sin transición) |
| Workbox | Service worker propio (`public/sw.js`): precache + stale-while-revalidate |
| `@sveltejs/enhanced-img` (AVIF/WebP) | Imágenes remotas de Pexels con `loading="lazy"`, `decoding="async"` y dimensiones explícitas (CLS) |
| Playwright / regresión visual | **No hechos** |
| Spectral variable | Google Fonts sirve Spectral en pesos estáticos (no variable). Fraunces sí es variable (opsz, wght, SOFT, WONK) |
| Eje `wdth` en Fraunces | Fraunces **no tiene** eje `wdth`: la «compresión» se logra con `wght ↑`, `SOFT ↓` y *letter-spacing* negativo ligados a `--press` |

## Setup

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera dist/index.html (todo inlinado)
npx vitest run     # pruebas unitarias (src/lib/*.test.ts)
```

Deploy: sube `dist/` a Vercel / Netlify / Cloudflare Pages / GitHub Pages.

### Publicación automática (GitHub Pages)

El repo incluye un flujo de **GitHub Actions** (`.github/workflows/deploy.yml`) que, en
cada push a `main`, instala dependencias, compila (`npm run build`) y publica `dist/`.

- 🌊 Sitio en vivo: <https://zeyniyoimiya-art.github.io/abisal-museo-bioluminiscente/>
- El build es un **único `dist/index.html`** con todo inlinado, servido bajo un
  subdirectorio (de ahí `base: "./"`).

## Comunidad y proyecto

- [Código de conducta](./CODE_OF_CONDUCT.md) · [Cómo contribuir](./CONTRIBUTING.md)
- [Política de seguridad](./SECURITY.md) · [Declaración de accesibilidad](./ACCESSIBILITY.md)
- Licencia: [MIT](./LICENSE) · Autor: [Lin Yue 林玥](./AUTHOR.md)

## Mapa de profundidades

| Zona | Metros | Color de fondo (OKLCH mix) | Expedientes |
|---|---|---|---|
| Epipelágica · Zona de luz | 0–200 | `#0a3d4d` | 04 Cigarras y primos · 07 Auroras |
| Mesopelágica · Twilight | 200–1,000 | `#2b1b4d` | 02 Anticitera |
| Batipelágica · Medianoche | 1,000–4,000 | `#041018` | 01 Bioluminiscencia |
| Abisopelágica · Abismo | 4,000–6,000 | `#020409` | 03 Voynich · 06 Micelio |
| Hadal · La Fosa | 6,000–11,000 | `#000000` | 05 Disco de Oro Voyager · 08 Fosa de las Marianas |

Cualquier elemento con `data-depth-min` / `data-depth-max` es un tramo de la columna de agua. `src/lib/depthEngine.ts` busca el tramo bajo el centro del viewport, interpola metros y publica `--za/--zb/--zt` (fondo), `--press` (tipografía), `--light` (oscuridad) y el estado del HUD.

Fórmulas (aproximaciones didácticas): presión ≈ 1 + prof/10.2 atm · luz = 100·e^(−prof/43.4) % (≈ 1 % a 200 m) · temperatura por interpolación de un perfil oceánico típico.

## Rutas

`#/` Superficie · `#/descenso` · `#/expediente/:slug` · `#/catalogo` · `#/sonar` · cualquier otra → **Zona muerta** (404).

## Micro-interacciones (28) y dónde viven

| # | Interacción | Dónde |
|---|---|---|
| 1 | Scramble-decode en títulos de zona | `/descenso` (`Scramble.tsx`) |
| 2 | Line-mask reveal | `/` título y tagline |
| 3 | Split por palabras con stagger | títulos de `/expediente`, `/catalogo`, `/sonar` (`Words.tsx`) |
| 4 | Manifiesto que se enciende con scrub (GSAP SplitText + ScrollTrigger) | `/` |
| 5 | Ken Burns en portada de expediente | `/expediente/*` |
| 6 | Marquee de datos NOAA | pie de todas las páginas |
| 7 | Vitrinas apiladas (sticky stack) | `/descenso` |
| 8 | Ficha técnica sticky de dos columnas (subgrid) | `/expediente/*` |
| 9 | Parallax de 4 capas por zona (CSS `animation-timeline: view()`) | `/descenso` |
| 10 | Galería horizontal con `scroll-snap` | `/expediente/*` |
| 11 | CTA magnético | `/` «Sumérgete», `/descenso`, ruleta, `/404` |
| 12 | Tilt 3D en vitrinas | `/`, `/descenso`, `/catalogo` |
| 13 | **Cursor-linterna** (revela organismos y notas de campo) | `/descenso` |
| 14 | Plancton que huye del puntero y se enciende | global (canvas) |
| 15 | Bloom pulsante en organismos | `/descenso` |
| 16 | God-rays + aviso al cambiar de zona (+ ping) | global |
| 17 | Burbujas ascendentes (click y transiciones) | global |
| 18 | Ping de sonar con anillos SVG | ruleta, «Sumérgete», `/sonar` |
| 19 | Scramble en los números del HUD | HUD (700 ms tras cambiar de zona) |
| 20 | Tipografía bajo presión (ejes de Fraunces ligados a profundidad) | todos los `.display` |
| 21 | Capitular animada (`initial-letter`) | `/expediente/*` |
| 22 | Texto fluyendo con `shape-outside` | `/expediente/*` |
| 23 | Tooltips con CSS anchor positioning | vitrinas (botón «i») |
| 24 | `:has()` — la vitrina entera se enciende; los filtros del catálogo no usan JS; la linterna se ensancha al sobrevolar un CTA | `/catalogo`, `/descenso`, global |
| 25 | Grano vivo + cáusticas globales | global |
| 26 | Cursor morph linterna → arpón sobre especímenes | global (`[data-harpoon]`) |
| 27 | Waveform SVG que se dibuja (`stroke-dashoffset`) | ficha técnica |
| 28 | Puertas pinneadas con anillos de sonar (GSAP pin + scrub) · Sello que se estampa | `/descenso` · `/sonar` |

Más: **Corriente marina** (ruleta con View Transitions + clip-path circular), **Modo deriva** (scroll infinito de expedientes aleatorios), **audio sintetizado** (drone + sonar + burbujas, Web Audio, sin archivos), distorsión SVG de «agua» en hovers, barra de progreso con `scroll()` timeline, catálogo barajado con semilla = fecha del día.

## Accesibilidad — MODO SUPERFICIE

`prefers-reduced-motion` (o el botón **Superficie**) activa `html[data-surface]`: sin linterna obligatoria, sin velo, sin animaciones, sin scroll inercial; organismos y notas visibles; texto legible estático. El velo de linterna está limitado a 42 % de opacidad, de modo que el texto espuma (`#eaf7ff`) sobre cualquier fondo de la paleta mantiene un contraste muy superior a 4.5:1. Hay enlace «Saltar al contenido», foco visible y tablas con región enfocable.

## Contenido y fuentes

Cada expediente (`src/content/*.md`): ficha técnica, línea de tiempo, 5 imágenes, tabla de datos, cita de fuente primaria, bloque «Bioluminiscencia del dato» y fuentes. **Las citas son resúmenes fieles de la fuente, no transcripciones literales** (salvo el mensaje de Carter del Disco de Oro), para no atribuir palabras inexactas. Las fotografías son **ilustrativas** (Pexels), no documentan el objeto exacto, y se acreditan una a una. Conviene verificar cifras y enlaces antes de publicar: se redactaron de memoria de fuentes públicas (NOAA, NASA/JPL, Nature, Britannica…) sin acceso a verificación en vivo.

## Estado de verificación (honesto)

- ✅ `npm run build` compila.
- ✍️ Pruebas Vitest escritas (`depth.test.ts`, `markdown.test.ts`) pero **no ejecutadas** en este entorno.
- ❌ Lighthouse y Core Web Vitals **no medidos**. Riesgos conocidos: HTML de ~550 kB (todo inlinado por `singlefile`), fuentes de Google y fotos remotas. Decisiones pro-CWV: canvas de plancton lazy-init al primer scroll, shader a media resolución y pausado fuera de pantalla, imágenes con dimensiones, animaciones por CSS/compositor.
- ❌ Playwright y regresión visual no implementados.
