// Service Worker for DigLearners PWA
const CACHE_NAME = 'diglearners-cache-v3'
const STATIC_CACHE = 'diglearners-static-v3'
const DYNAMIC_CACHE = 'diglearners-dynamic-v3'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles.css',
  '/src/main.jsx',
  '/src/App.jsx'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch(err => console.log('Cache install failed:', err))
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement offline-first strategy
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - try network first, fallback to cache
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith('/src/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(request))
  } else {
    // HTML pages - network first, fallback to cache
    event.respondWith(handlePageRequest(request))
  }
})

async function handleApiRequest(request) {
  try {
    // Try network first for API calls
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Return offline response for API calls
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'This data will sync when you\'re back online' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleStaticRequest(request) {
  // Cache first for static assets
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Asset not available offline', { status: 404 })
  }
}

async function handlePageRequest(request) {
  try {
    // Network first for pages
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Fallback to index.html for SPA routing
    return caches.match('/index.html')
  }
}

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline progress data when back online
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/progress')) {
        try {
          await fetch(request)
          await cache.delete(request)
        } catch (error) {
          console.log('Sync failed for:', request.url)
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}