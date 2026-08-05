'use client';

import { useEffect } from 'react';

// Pings /api/presence periodically while the tab is visible, so the logged-in
// user's lastSeenAt stays fresh — this is what powers real "Online" / "last seen"
// status in chat. Cheap: one tiny POST every 60s, skipped when the tab is hidden.
export function usePresenceHeartbeat() {
  useEffect(() => {
    let stopped = false;
    const ping = () => {
      if (stopped || (typeof document !== 'undefined' && document.hidden)) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('/api/presence', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    };
    ping(); // immediate on mount
    const id = setInterval(ping, 60000);
    const onVisible = () => { if (!document.hidden) ping(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
}
