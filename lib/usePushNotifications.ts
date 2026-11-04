import { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Tell the server this device belongs to the logged-in user.
async function saveSubscription(sub: PushSubscription) {
  const { endpoint, keys } = sub.toJSON();
  const token = localStorage.getItem('token');
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ endpoint, keys }),
  });
  if (!res.ok) throw new Error(`Saving push subscription failed: ${res.status}`);
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      let sub = await registration.pushManager.getSubscription();
      // Permission already given needs no prompt, so re-link this device on every visit. That
      // covers logging back in, a browser that rotated its endpoint, and a row the server dropped.
      if (Notification.permission === 'granted' && VAPID_PUBLIC_KEY) {
        sub = sub || await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        await saveSubscription(sub);
      }
      setSubscription(sub);
      setIsSubscribed(!!sub);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const subscribe = async () => {
    if (!isSupported || !VAPID_PUBLIC_KEY) {
      console.error('Push notifications not supported or VAPID key missing');
      return false;
    }

    setLoading(true);

    try {
      // Request notification permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        console.log('Notification permission denied');
        setLoading(false);
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await saveSubscription(sub);

      setSubscription(sub);
      setIsSubscribed(true);

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setLoading(false);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return false;

    setLoading(true);

    try {
      await subscription.unsubscribe();

      // Remove subscription from server
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setSubscription(null);
      setIsSubscribed(false);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setLoading(false);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    subscription,
    loading,
    subscribe,
    unsubscribe,
  };
}
