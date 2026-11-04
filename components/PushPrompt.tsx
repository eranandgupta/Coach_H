'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/lib/usePushNotifications';

const DISMISS_KEY = 'push-prompt-dismissed';
const DISMISS_DAYS = 7;

/**
 * Asks for notification permission from a button tap. iPhones ignore the request unless it comes
 * from a tap, so asking automatically on page load would never reach them.
 */
export default function PushPrompt() {
  const { isSupported, isSubscribed, permission, loading, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
      setDismissed(Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!isSupported || isSubscribed || permission !== 'default' || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
  };

  return (
    <div
      role="region"
      aria-label="Turn on notifications"
      className="fixed z-40 left-4 right-4 bottom-24 lg:bottom-6 lg:right-auto lg:w-96 flex items-start gap-3 p-4 rounded-2xl bg-brand-navy-light border border-white/[0.08] shadow-lg"
    >
      <span className="shrink-0 w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
        <Bell className="w-5 h-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Get message alerts</p>
        <p className="mt-0.5 text-xs text-gray-400">See new chat messages on your lock screen, even when the app is closed.</p>
        <button
          onClick={() => subscribe()}
          disabled={loading}
          className="mt-2.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-brand-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Turning on...' : 'Turn on'}
        </button>
      </div>
      <button onClick={dismiss} aria-label="Not now" className="shrink-0 p-1 text-gray-500 hover:text-white transition-colors">
        <X className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
