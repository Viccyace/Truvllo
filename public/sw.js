const CACHE = 'truvllo-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo-dark.svg',
  '/logo-light.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.url.includes('googleapis.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      });
      return cached || network;
    })
  );
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data?.json() ?? {};
  const title   = data.title   ?? 'Truvllo';
  const body    = data.body    ?? 'Don't forget to log your expenses today!';
  const icon    = data.icon    ?? '/icons/icon-192.png';
  const badge   = data.badge   ?? '/icons/icon-192.png';
  const url     = data.url     ?? '/dashboard';

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag:    'truvllo-reminder',
      renotify: true,
      data: { url },
      actions: [
        { action: 'log', title: 'Log now' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const url = e.notification.data?.url ?? '/dashboard';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      const existing = clientList.find(c => c.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});