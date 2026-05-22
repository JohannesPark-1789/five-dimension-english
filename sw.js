/* 5차원 영어 · BASIC DRILL — 서비스워커 (오프라인 캐시) */
const CACHE = 'fivedim-v10';
const ASSETS = [
  '.',
  'index.html',
  'styles.css?v=9',
  'data.js?v=9',
  'patterns.js?v=9',
  'roots.js?v=9',
  'app.js?v=9',
  'manifest.webmanifest',
  'icon.png?v=9',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
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
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
