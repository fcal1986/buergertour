// ============================================================
// sw.js – Service Worker
// Cache-First für App-Shell, Network-First für Supabase-Calls
// ============================================================

const CACHE = 'buergerreise-v3';
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
  // Supabase + Google Fonts: nicht cachen, immer frisch
  if (e.request.url.includes('supabase.co') ||
      e.request.url.includes('fonts.gstatic.com') ||
      e.request.url.includes('fonts.googleapis.com') ||
      e.request.url.includes('cdn.jsdelivr.net')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fromNet = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || fromNet;
    })
  );
});
