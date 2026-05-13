// ============================================================
// sw.js – Service Worker
// Cache-First für App-Shell, Network-First für Supabase-Calls
// ============================================================

const CACHE = 'buergerreise-v202605130555';
const SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Externe Dienste nie cachen – immer direkt durchleiten
  const url = e.request.url;
  if (url.includes('supabase.co') ||
      url.includes('fonts.gstatic.com') ||
      url.includes('fonts.googleapis.com') ||
      url.includes('cdn.jsdelivr.net')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Netzwerk-Request mit korrektem Clone-Handling
      const networkFetch = fetch(e.request.clone()).then(response => {
        // Nur gültige Responses cachen
        if (!response || !response.ok || response.type === 'opaque') {
          return response;
        }
        // Response klonen BEVOR sie gelesen wird
        const toCache = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, toCache));
        return response;
      }).catch(() => {
        // Offline: Cache oder Fallback
        return cached || caches.match('./index.html');
      });

      // Cache vorhanden: sofort zurückgeben, Netzwerk im Hintergrund aktualisieren
      return cached || networkFetch;
    })
  );
});
