/* Transportes Esmar - Service Worker
   Estrategia RED PRIMERO: siempre intenta bajar el contenido más nuevo online.
   Solo usa la caché como respaldo si la red falla (offline). */
const CACHE = 'esmar-v5';
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
  'assets/img/hero-interior.webp',
  'assets/img/fleet-front.webp',
  'assets/img/fleet-white.webp',
  'assets/img/interior-starry.webp',
  'assets/img/interior-seats.webp',
  'assets/img/interior-forward.webp'
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

// RED PRIMERO: online siempre lo más nuevo; offline usa la caché.
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return; // deja pasar fuentes/mapas externos
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=> caches.match(req).then(hit=> hit || caches.match('index.html')))
  );
});
