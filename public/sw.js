/* ABISAL · Service Worker — «expedición sin señal».
   · Precachea el museo completo (la app es un único index.html con el contenido embebido).
   · Imágenes (Pexels) y tipografías: stale-while-revalidate en caché de ejecución.
   Sin librerías externas (equivalente ligero a un precache de Workbox). */
const VERSION = "abisal-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Navegación: red primero, caché como respaldo offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Recursos propios + imágenes y fuentes externas: stale-while-revalidate
  const external = ["images.pexels.com", "fonts.googleapis.com", "fonts.gstatic.com"].includes(url.hostname);
  if (url.origin === location.origin || external) {
    event.respondWith(
      caches.open(VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          const net = fetch(req)
            .then((res) => {
              if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || net;
        })
      )
    );
  }
});
