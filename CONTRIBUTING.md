# Contribuir a ABISAL

¡Gracias por querer aportar! ABISAL es un museo web 100 % front-end: sin backend, sin
base de datos, sin APIs. Todo lo que ves (layout, shader, plancton, audio) es código
propio y el contenido vive en Markdown + JSON dentro del build.

## Antes de empezar

- Lee el [Código de conducta](./CODE_OF_CONDUCT.md).
- Para reportar un fallo o proponer una idea usa las
  [plantillas de issue](https://github.com/zeyniyoimiya-art/abisal-museo-bioluminiscente/issues/new/choose).

## Preparar el entorno

Requisitos: **Node.js 20+** y **npm**.

```bash
npm install
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # genera dist/index.html (todo inlinado, archivo único)
npx vitest run     # pruebas unitarias (src/lib/*.test.ts)
```

## Estructura

- `src/content/*.md` — los ocho expedientes (frontmatter JSON + Markdown). Añadir uno
  nuevo es crear un `.md` con el `slug` y el `order` correctos.
- `src/components/` — capas persistentes (atmósfera, plancton, linterna, HUD) y piezas.
- `src/pages/` — Home, Descenso, Expediente, Catálogo, Sonar, 404.
- `src/lib/` — lógica pura y testeable (profundidad, markdown, router, audio, motion).

## Reglas de estilo

- **TypeScript estricto**: nada de `any` ni `@ts-ignore` para esconder errores.
- **Accesibilidad primero**: navegación por teclado, ARIA, contraste y respeto a
  `prefers-reduced-motion` (el *Modo Superficie* no es un extra, es un requisito).
- **Movimiento con sentido**: cada animación debe explicar algo; debe apagarse sola
  cuando el sistema pide movimiento reducido.
- **Sin dependencias nuevas sin justificar**: el objetivo es un build de un solo
  archivo, pequeño y offline-first.

## Flujo de trabajo

1. Haz *fork* o crea una rama: `git checkout -b feat/mi-mejora`.
2. Commitea con mensajes claros (`feat:`, `fix:`, `docs:`, `a11y:`…).
3. Asegúrate de que `npm run build` compila sin errores.
4. Abre un *pull request* describiendo **qué** cambia y **por qué**.

## Contenido y fuentes

Cada expediente incluye ficha técnica, línea de tiempo, imágenes, tabla de datos y
fuentes. Las citas son **resúmenes fieles** de la fuente, no transcripciones literales.
Las fotografías son ilustrativas (Pexels) y se acreditan una a una. Si corriges un dato,
incluye la referencia verificable.