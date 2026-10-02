# Política de seguridad

## Versiones soportadas

ABISAL es un sitio estático de un solo archivo. Solo la rama `main` (y el despliegue
de GitHub Pages) recibe correcciones.

| Versión         | Soportada |
| --------------- | --------- |
| `main` (última) | ✅        |
| Anteriores      | ❌        |

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad, **no abras un issue público**. Repórtalo de
forma privada:

1. Ve a la pestaña **Security** del repositorio →
   **Report a vulnerability** (GitHub Private Vulnerability Reporting).

Incluye, si es posible:

- Descripción del problema y su impacto.
- Pasos para reproducirlo (navegador, versión, URL).
- Cualquier prueba de concepto.

## Alcance

ABISAL no tiene backend, base de datos, autenticación ni APIs propias, por lo que la
superficie de ataque es pequeña. Se consideran dentro del alcance:

- XSS o inyección a través del contenido Markdown/JSON embebido.
- Manipulación del *service worker* (`public/sw.js`) o del manifiesto PWA.
- Dependencias vulnerables en `package.json`.

Fuera del alcance: infraestructura de GitHub Pages, Pexels o Google Fonts (repórtalo a
esos proveedores).

## Tiempos de respuesta

Al ser un proyecto personal, se intentará acusar recibo en unos días y publicar la
corrección en cuanto sea viable. Agradecemos la divulgación responsable.