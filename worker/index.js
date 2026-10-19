// Custom service-worker code. next-pwa bundles this into public/worker-*.js and
// importScripts() it from the generated sw.js, so it survives every build
// (public/sw.js itself is regenerated and must never be hand-edited).
//
// Payload shape: PushNotificationPayload in lib/push.ts.

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  // Every push MUST show a notification. Safari/WebKit treats a push that shows
  // nothing as a silent push and revokes the subscription; Chrome only papers
  // over it with a generic "site updated in the background" notice.
  event.waitUntil(
    self.registration.showNotification(data.title || 'Coach Himanshu', {
      body: data.body || '',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-72x72.png',
      tag: data.tag,
      data: { url: data.url || '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/dashboard', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url === target);
      if (existing) return existing.focus();
      return self.clients.openWindow(target);
    })
  );
});
