const CACHE = 'mfj-v1';
const ASSETS = ['/', '/index.html', '/static/js/main.chunk.js', '/static/css/main.chunk.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Gestione Share Target: reindirizza alla home con parametro URL
  const url = new URL(e.request.url);
  if (url.pathname === '/share') {
    const sharedUrl = url.searchParams.get('url') || url.searchParams.get('text') || '';
    e.respondWith(
      Response.redirect('/?shared=' + encodeURIComponent(sharedUrl), 302)
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/')))
  );
});
