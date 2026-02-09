// Service Worker for Resume Builder PWA
const CACHE_NAME = 'resume-builder-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/pwa.js',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE).catch((error) => {
                console.log('Cache addAll error:', error);
                // Don't fail the install if some files can't be cached
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Cache First Strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip API requests (let them go to network)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful API responses
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached version if network fails
                    return caches.match(request);
                })
        );
        return;
    }

    // Cache first for static assets
    event.respondWith(
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(request)
                .then((response) => {
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });

                    return response;
                })
                .catch(() => {
                    // Return offline page or cached response
                    return caches.match(request);
                });
        })
    );
});

// Background Sync for saving resumes when offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-resumes') {
        event.waitUntil(syncResumes());
    }
});

async function syncResumes() {
    try {
        // Get pending resumes from IndexedDB or localStorage
        const resumes = JSON.parse(localStorage.getItem('pending-resumes') || '[]');
        
        for (const resume of resumes) {
            try {
                const response = await fetch('/api/resume/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resume)
                });

                if (response.ok) {
                    // Remove from pending
                    const remaining = resumes.filter(r => r.id !== resume.id);
                    localStorage.setItem('pending-resumes', JSON.stringify(remaining));
                }
            } catch (error) {
                console.error('Error syncing resume:', error);
            }
        }
    } catch (error) {
        console.error('Sync error:', error);
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Resume Builder notification',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23234" width="192" height="192"/><text x="96" y="96" font-size="100" fill="%230fa" text-anchor="middle" dy=".3em" font-weight="bold">RB</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23234" width="192" height="192"/><text x="96" y="96" font-size="100" fill="%230fa" text-anchor="middle" dy=".3em">•</text></svg>',
        tag: 'resume-notification',
        requireInteraction: false
    };

    event.waitUntil(self.registration.showNotification('Resume Builder', options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Check if there's already a window/tab open
            for (let client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
