const CACHE_NAME = "russian-oral-offline-v2026-10-27-2";
const OFFLINE_FALLBACK = new URL("index.html", self.registration.scope).href;
const UPDATE_FIRST_PATTERN = /\.(?:js|css|webmanifest)$/;
const CORE_PATHS = [
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "glossary.js",
  "word-audio.js",
  "manifest.webmanifest",
  "precache-manifest.json",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/apple-touch-icon.png",
  "assets/fonts/PTSerif-Regular.ttf",
  "assets/fonts/PTSerif-Bold.ttf",
  "assets/fonts/SourceSansPro-Regular.ttf",
  "assets/fonts/SourceSansPro-SemiBold.ttf",
];

async function cacheWithRetry(cache, url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { cache: "reload", signal: controller.signal });
      if (response.ok) {
        await cache.put(url, response);
        return true;
      }
    } catch {
      // Retry below.
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 250));
  }
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        CORE_PATHS.map((path) =>
          cacheWithRetry(cache, new URL(path, self.registration.scope).href),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            (await caches.match(OFFLINE_FALLBACK)) ||
            Response.error()
          );
        }),
    );
    return;
  }

  const updateFirst = UPDATE_FIRST_PATTERN.test(url.pathname);
  event.respondWith(
    (updateFirst
      ? fetch(request)
          .then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => caches.match(request))
      : caches.match(request).then((cached) => cached || fetch(request))
    )
      .catch(() => Response.error())
      .then(async (response) => {
      if (!response) return Response.error();
      if (!updateFirst && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
      }),
  );
});
