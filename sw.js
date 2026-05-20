/* 5차원 영어 · BASIC DRILL — 서비스워커 (오프라인 캐시) */
const CACHE = 'fivedim-v6';
const ASSETS = [
  '.',
  'index.html',
  'styles.css?v=6',
  'data.js?v=6',
  'patterns.js?v=6',
  'app.js?v=6',
  'manifest.webmanifest',
  'icon.svg',
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
