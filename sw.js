// ============================================================
// sw.js – Service Worker
// Strategie:
//   index.html  → Network-First (immer aktuellste Version)
//   Andere       → Stale-While-Revalidate (sofort + Hintergrund-Update)
//   Supabase/CDN → nie cachen, immer direkt
// ============================================================

const CACHE = 'buergerreise-v202605130601';

const PRECACHE = ['./index.html', './manifest.json'];

const BYPASS = [
  'supabase.co', 'fonts.gstatic.com', 'fonts.googleapis.com',
  'cdn.jsdelivr.net', 'open-meteo.com',
];

// ── Install ────────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ───────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Alle offenen Tabs über Update informieren
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })))
  );
});

// ── Fetch ──────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (BYPASS.some(d => url.includes(d))) return;

  // index.html und Root → Network-First
  if (url.endsWith('/') || url.includes('index.html')) {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // Alles andere → Stale-While-Revalidate
  e.respondWith(staleWhileRevalidate(e.request));
});

// Netzwerk zuerst, Cache als Fallback
async function networkFirst(request) {
  try {
    const res = await fetch(request.clone());
    if (res && res.ok) {
      (await caches.open(CACHE)).put(request, res.clone());
    }
    return res;
  } catch {
    return (await caches.match(request)) || caches.match('./index.html');
  }
}

// Cache sofort, Netzwerk im Hintergrund
async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE);
  const cached = await cache.match(request);
  const update = fetch(request.clone()).then(res => {
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => null);
  return cached || update;
}
