const filesToCache = [
    '/',
    'styles.css',
    'index.html',
    'about.html',
    'myth.html',
    'prevention.html',
    'output.css',
    'manifest.json',
    'images/7.png',
    'images/24.png',
    'images/26.png',
    'images/28.png',
    'images/52.png',
    'images/COVID-19.svg',
    'images/mb---uv-light-edited.png',
    'images/mb-alcohol.jpg',
    'images/mb-breathing-exercice.jpg',
    'images/mb-cold-snow.png',
    'images/mb-hot-bath.png',
    'images/mb-mosquito-bite.png',
    'images/mb-recovery.jpg',
    'images/mb-sun-exposure.png',
    'images/mythbuster-4.png',
    'images/mythbuster1.png',
    'images/mythbuster2.png',
    'images/mythbuster3.png',
    'images/mythbuster5.png',
    'images/mythbusters-25.png',
    'images/mythbusters-27.png',
    'images/mythbusting15.png',
    'images/world.png'

];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)

                    .then(response => {
                        // TODO 5 - Respond with custom 404 page
                        return caches.open(staticCacheName).then(cache => {
                            cache.put(event.request.url, response.clone());
                            return response;
                        });
                    });

            }).catch(error => {

                // TODO 6 - Respond with custom offline page

            })
    );
});