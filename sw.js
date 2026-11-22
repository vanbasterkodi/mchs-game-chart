// Keeps a copy of the Game Chart on the iPad so it opens without Wi-Fi.
// The page itself is always fetched fresh when online (so updates show up right away);
// the saved copy is used only when there's no connection.
var CACHE = 'mchs-chart-v3';
var FILES = ['./', './index.html', './jspdf.umd.min.js', './jspdf.plugin.autotable.min.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
function isPage(req) { return req.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(req.url).pathname); }
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (isPage(req)) {
    // network first, fall back to the saved copy after 4 seconds or when offline
    e.respondWith(new Promise(function (resolve) {
      var done = false;
      var fallback = function () { if (done) return; done = true; caches.match('./index.html').then(function (r) { resolve(r || fetch(req)); }); };
      var t = setTimeout(fallback, 4000);
      fetch(req, { cache: 'no-store' }).then(function (r) {
        if (r && r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); }); }
        if (!done) { done = true; clearTimeout(t); resolve(r); }
      }).catch(function () { clearTimeout(t); fallback(); });
    }));
    return;
  }
  // libraries: saved copy first
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).then(function (r) { if (r && r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); } return r; });
  }));
});
