// Café de Colombia · Vibras Positivas HM
const V = 'cafe-co-v2';
const BASE = ['./', './index.html', './manifest.json', './og.jpg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname.includes('youtube')) return; // videos siempre en línea
  // Páginas: red primero, caché si no hay señal
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; }).catch(() => caches.match('./index.html'))); return; }
  // Fotos, fuentes y archivos: caché primero, luego red
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => hit)));
});
