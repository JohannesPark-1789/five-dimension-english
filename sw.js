/* 5차원 영어 · BASIC DRILL — 서비스워커 (오프라인 캐시) */
const CACHE = 'fivedim-v17';
const ASSETS = [
  '.',
  'index.html',
  'styles.css?v=11',
  'data.js?v=15',
  'patterns.js?v=15',
  'roots.js?v=15',
  'app.js?v=15',
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

/* 음성 파일은 앱 셸과 함께 미리 받지 않는다 — 9,900개를 설치할 때 받을 수는
   없다. 대신 들은 것을 그때그때 캐시에 넣는다. 한 번 들은 문장은 오프라인에서
   그대로 나오고, 처음 듣는 문장은 인터넷이 없으면 기기 음성으로 내려간다.
   manifest.json 도 같은 방식이다 — 변환 전에는 아직 없는 파일이라
   ASSETS 에 넣으면 서비스워커 설치 자체가 실패한다.                        */
const RUNTIME = /voice\/(audio\/|manifest\.json)/;

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (RUNTIME.test(new URL(e.request.url).pathname)) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
