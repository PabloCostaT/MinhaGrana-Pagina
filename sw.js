// MinhaGrana Service Worker
// PWA Service Worker for offline functionality and caching

const CACHE_NAME = 'minhagrana-v1.0.0';
const STATIC_CACHE_NAME = 'minhagrana-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'minhagrana-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/form-handler.js',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/favicon-180x180.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/manifest.json',
  '/screenshots/dashboard.html',
  '/screenshots/ai-assistant.html',
  '/screenshots/shopping-list.html'
];

// Assets to cache on demand
const DYNAMIC_ASSETS = [
  '/api/contact',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic assets
            if (shouldCache(request.url)) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                  console.log('Service Worker: Cached dynamic asset', request.url);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return a generic offline response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'form-submission') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineFormSubmissions()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização do MinhaGrana!',
    icon: '/favicon-192x192.png',
    badge: '/favicon-48x48.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/favicon-48x48.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon-48x48.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MinhaGrana', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions
function shouldCache(url) {
  // Cache API calls, images, and other dynamic content
  return url.includes('/api/') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.jpeg') || 
         url.includes('.gif') || 
         url.includes('.webp') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
}

async function handleOfflineFormSubmissions() {
  try {
    // Get offline form data from IndexedDB
    const offlineData = await getOfflineFormData();
    
    if (offlineData && offlineData.length > 0) {
      console.log('Service Worker: Processing offline form submissions', offlineData.length);
      
      for (const formData of offlineData) {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          
          if (response.ok) {
            console.log('Service Worker: Offline form submitted successfully');
            await removeOfflineFormData(formData.id);
          }
        } catch (error) {
          console.error('Service Worker: Failed to submit offline form', error);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Error handling offline form submissions', error);
  }
}

// IndexedDB helpers for offline form storage
async function getOfflineFormData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MinhaGranaOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['forms'], 'readonly');
      const store = transaction.objectStore('forms');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('forms')) {
        db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function removeOfflineFormData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MinhaGranaOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['forms'], 'readwrite');
      const store = transaction.objectStore('forms');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'update-cache') {
    event.waitUntil(
      updateCache()
    );
  }
});

async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const requests = STATIC_ASSETS.map(url => new Request(url));
    
    const responses = await Promise.allSettled(
      requests.map(request => fetch(request))
    );
    
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled' && response.value.ok) {
        cache.put(requests[index], response.value);
        console.log('Service Worker: Updated cache for', requests[index].url);
      }
    });
  } catch (error) {
    console.error('Service Worker: Failed to update cache', error);
  }
}

console.log('Service Worker: Loaded successfully');
