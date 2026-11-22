// Keeps a copy of the Game Chart on the iPad so it opens without Wi-Fi.
var CACHE = 'mchs-chart-v2';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', './index.html', './jspdf.umd.min.js', './jspdf.plugin.autotable.min.js']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var sameOrigin = new URL(e.request.url).origin === self.location.origin;
  if (!sameOrigin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; })
        .catch(function () { return hit || c.match('./index.html'); });
      return hit || net;
    });
  }));
});
