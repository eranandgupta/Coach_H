// Custom service-worker code. next-pwa bundles this into public/worker-*.js and
// importScripts() it from the generated sw.js, so it survives every build
// (public/sw.js itself is regenerated and must never be hand-edited).
//
// Payload shape: PushNotificationPayload in lib/push.ts.

// Asks each visible app window whether this chat is open on screen. Answered by ChatView.
async function isChatOnScreen(conversationId) {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const visible = windows.filter((c) => c.visibilityState === 'visible');
  const answers = await Promise.all(
    visible.map(
      (client) =>
        new Promise((resolve) => {
          const channel = new MessageChannel();
          const timer = setTimeout(() => resolve(false), 300);
          channel.port1.onmessage = (e) => {
            clearTimeout(timer);
            resolve(!!e.data);
          };
          client.postMessage({ type: 'is-viewing-chat', conversationId }, [channel.port2]);
        })
    )
  );
  return answers.some(Boolean);
}

async function handlePush(data) {
  const onScreen = data.conversationId ? await isChatOnScreen(data.conversationId) : false;

  await self.registration.showNotification(data.title || 'Coach Himanshu', {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-96x96.png',
    tag: data.tag,
    // Without this a second message on the same tag updates silently: no sound or lock-screen wake.
    renotify: !!(data.tag && data.renotify),
    data: { url: data.url || '/dashboard', conversationId: data.conversationId },
  });

  // Reading this chat already: dismiss straight away, as a messaging app stays quiet here.
  if (onScreen && data.tag) {
    const shown = await self.registration.getNotifications({ tag: data.tag });
    shown.forEach((n) => n.close());
  }
}

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  // Every push MUST show a notification, even one closed immediately. Safari/WebKit treats a
  // push that shows nothing as a silent push and revokes the subscription; Chrome only papers
  // over it with a generic "site updated in the background" notice.
  event.waitUntil(handlePush(data));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { url, conversationId } = event.notification.data || {};
  const target = new URL(url || '/dashboard', self.location.origin);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clients) => {
      const existing = clients.find((c) => new URL(c.url).pathname === target.pathname);
      if (!existing) return self.clients.openWindow(target.href);
      await existing.focus();
      // Already on the right dashboard: it opens the chat itself, without a reload (useChatDeepLink).
      if (conversationId) existing.postMessage({ type: 'open-chat', conversationId });
    })
  );
});
