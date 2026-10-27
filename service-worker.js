const CACHE_NAME = "russian-oral-offline-v2026-10-27-1";
const MANIFEST_URL = new URL("precache-manifest.json", self.registration.scope);
const OFFLINE_FALLBACK = new URL("index.html", self.registration.scope).href;

async function cacheWithRetry(cache, url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) {
        await cache.put(url, response);
        return true;
      }
    } catch {
      // Retry below.
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 250));
  }
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const response = await fetch(MANIFEST_URL, { cache: "no-store" });
      const paths = await response.json();
      const cache = await caches.open(CACHE_NAME);
      const urls = paths.map((path) => new URL(path, self.registration.scope).href);
      for (let index = 0; index < urls.length; index += 8) {
        await Promise.all(
          urls
            .slice(index, index + 8)
            .map((url) => cacheWithRetry(cache, url)),
        );
      }
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

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => Response.error());
    }),
  );
});
