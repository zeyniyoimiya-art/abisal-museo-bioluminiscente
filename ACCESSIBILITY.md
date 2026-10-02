# Declaración de accesibilidad

ABISAL se diseñó con la accesibilidad como requisito, no como añadido. El museo es
oscuro «por naturaleza» (la luz se apaga al descender), así que la accesibilidad se
resolvió con un **Modo Superficie** explícito.

## Compromiso

Nos comprometemos a que el contenido sea perceptible, operable, comprensible y robusto
(WCAG 2.1 nivel AA como objetivo) en los navegadores actuales.

## Cómo se implementa

- **Modo Superficie**: se activa con `prefers-reduced-motion: reduce` o con el botón
  **Superficie**. Desactiva la linterna obligatoria, el velo, las animaciones y el
  scroll inercial; muestra organismos y notas; deja el texto legible y estático.
- **Contraste**: el velo de la linterna está limitado a un 42 % de opacidad, de modo que
  el texto espuma (`#eaf7ff`) mantiene un contraste muy superior a 4.5:1 sobre cualquier
  fondo de la paleta.
- **Teclado**: enlace «Saltar al contenido», foco visible y tablas accesibles con región
  enfocable. El descenso también funciona sin la rueda del ratón.
- **Semántica y ARIA**: estructura de encabezados coherente, textos alternativos en
  todas las imágenes y `aria-label` en los controles.
- **Preferencias del sistema**: se respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## Entornos soportados

Navegadores basados en Chromium, Firefox y Safari de escritorio y móviles recientes.
La app funciona sin conexión (service worker) tras la primera visita.

## Limitaciones conocidas

- Algunos efectos (shader de cáusticas, plancton en canvas, View Transitions) dependen de
  capacidades del navegador; sin ellas se ofrece un equivalente estático.
- El contenido fotográfico es ilustrativo (Pexels) y no documenta los objetos exactos.

## Cómo reportar un problema

Si encuentras una barrera de accesibilidad, abre un
[issue](https://github.com/zeyniyoimiya-art/abisal-museo-bioluminiscente/issues/new/choose)
describiendo el problema, tu navegador y la página afectada. Se agradece especialmente el
feedback de personas usuarias de lectores de pantalla y de teclado.