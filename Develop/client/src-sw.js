const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Precache application shell and other assets specified in webpack
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for HTML pages
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], // Cache successful responses and opaque responses (CORS)
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
    }),
  ],
});

// Pre-cache important routes
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register navigation route for HTML pages
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Caching strategy for CSS and JavaScript files
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Same as above
      }),
    ],
  }),
);

// Caching strategy for images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60, // Limit number of images cached
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
        purgeOnQuotaError: true, // Automatically purge outdated assets if quota is exceeded
      }),
    ],
  })
);

// add offline fallback for images or pages
offlineFallback({
  pageFallback: '/offline.html',
  imageFallback: '/images/offline.png'
});

