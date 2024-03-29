let cacheName = 'media-cache-v1';
let filesToCache = ['/media/'];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    if (/\.jpg$|.png$|.svg$/.test(event.request.url)) {
        event.respondWith(
            caches.open(cacheName)
                .then(function(cache) {
                    return cache.match(event.request)
                        .then(function(response) {
                            return response || fetch(event.request)
                                .then(function(response) {
                                    cache.put(event.request, response.clone());
                                    return response;
                                });
                        });
                })
        );
    }
});