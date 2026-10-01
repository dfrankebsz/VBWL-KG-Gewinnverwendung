const CACHE = 'kg-course-v1';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/course-data.js', '/icon.svg', '/manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/.netlify/')) return;
  event.respondWith(fetch(event.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return r;
  }).catch(() => caches.match(event.request)));
});
