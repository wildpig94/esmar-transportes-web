/* Transportes Esmar - Service Worker (offline shell) - rutas relativas para GitHub Pages */
const CACHE = 'esmar-v3';
const ASSETS = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'manifest.webmanifest',
  'assets/logo/logo-mark.svg',
  'assets/logo/logo-badge.svg',
  'icons/favicon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'assets/img/hero-interior.jpg',
  'assets/img/fleet-front.jpg',
  'assets/img/fleet-white.jpg',
  'assets/img/interior-starry.jpg',
  'assets/img/interior-seats.jpg',
  'assets/img/interior-forward.jpg'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return; // deja pasar fuentes/mapas externos
  e.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=> caches.match('index.html')))
  );
});
