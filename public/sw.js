// AniStreamBD Service Worker — Auto Update on New Vercel Deploy
const CACHE_NAME = 'anistream-v1';

self.addEventListener('install', (event) => {
  // Immediately activate new SW — skip waiting for tabs to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all open tabs immediately
      self.clients.claim(),
      // Delete old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy — always get fresh content from Vercel
  // Fall back to cache only if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request)
      )
    );
    return;
  }
  // Pass through all other requests
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
