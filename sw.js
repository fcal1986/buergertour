// ============================================================
// Service Worker – Bürgertour App
// Caches alle App-Dateien für Offline-Nutzung
// ============================================================

const CACHE_NAME = 'buergerreise-v1';

// Dateien, die offline verfügbar sein sollen
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Installation: Dateien in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Dateien werden gecacht');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivierung: alten Cache löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Alter Cache wird gelöscht:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch: Cache-First-Strategie (offline-first)
self.addEventListener('fetch', (event) => {
  // Nur GET-Anfragen cachen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Aus Cache liefern
      }
      // Netzwerk-Fallback mit Caching der Antwort
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline-Fallback: index.html zurückliefern
        return caches.match('./index.html');
      });
    })
  );
});
