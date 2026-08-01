const CACHE_NAME = 'kkn-wungurejo-v20';

// File-file utama yang di-cache saat install (offline-first untuk halaman utama)
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './lang.js',
    './manifest.json',
    './assets/logo/LogoKKNBaru.png',
    './assets/vendor/fontawesome/css/all.min.css',
    './assets/vendor/aos/aos.css',
    './assets/vendor/leaflet/leaflet.css',
    './assets/vendor/googlefonts/plus-jakarta-sans.css',
    './assets/vendor/chartjs/chart.min.js',
    './assets/vendor/jspdf/jspdf.umd.min.js'
];

// Install event: cache file utama agar bisa dibuka offline
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[PWA] Pre-caching aset utama...');
            return cache.addAll(CORE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate event: hapus cache lama agar tidak memakan storage
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[PWA] Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: Network First untuk HTML & JS (selalu cek update),
// Cache First untuk aset statis (gambar, font, CSS) agar cepat
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;

    const url = new URL(event.request.url);
    const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|ico)$/i.test(url.pathname);

    if (isStaticAsset) {
        // Cache First: gambar & font dari cache, update di background
        event.respondWith(
            caches.match(event.request).then((cached) => {
                const fetchPromise = fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                });
                return cached || fetchPromise;
            })
        );
    } else {
        // Network First: HTML, JS, CSS — selalu coba ambil terbaru
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    console.log('[PWA] Offline mode aktif untuk:', event.request.url);
                    return caches.match(event.request) || caches.match('./index.html');
                })
        );
    }
});


