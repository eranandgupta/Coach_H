'use client';

// Client-side session bootstrap shared by every dashboard.
//  - Sends the localStorage token if present; the server falls back to the httpOnly
//    cookie, so a wiped localStorage (Safari ITP) silently restores the session.
//  - Stores any refreshed token /api/auth/me hands back (sliding 1-year session).
//  - Only a real 401 ends the session. Network blips / 5xx (e.g. a cold database)
//    are retried and never log the user out.

export type SessionResult =
  | { status: 'ok'; user: any; subscription: any; token: string | null }
  | { status: 'unauthenticated' }
  | { status: 'error' };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function getToken(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}

/** Cheap check (no request): is there any sign of a session on this device? */
export function hasSessionHint(): boolean {
  if (getToken()) return true;
  return typeof document !== 'undefined' && /(?:^|;\s*)ch_auth=1/.test(document.cookie);
}

export async function loadSession(retries = 2): Promise<SessionResult> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const token = getToken();
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (res.status === 401) {
        try { localStorage.removeItem('token'); } catch {}
        return { status: 'unauthenticated' };
      }
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          try { localStorage.setItem('token', data.token); } catch {}
        }
        return { status: 'ok', user: data.user, subscription: data.subscription, token: data.token || token };
      }
    } catch {
      // network error — fall through to retry
    }
    if (attempt < retries) await sleep(800 * (attempt + 1));
  }
  return { status: 'error' };
}

// Stop this device receiving the user's chat notifications once they log out. Must run while
// still authenticated. Bounded, so a slow network can never hold up logging out.
async function removeDevicePushSubscription(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    const sub = await registration?.pushManager.getSubscription();
    if (!sub) return;
    const token = getToken();
    await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(sub.endpoint)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'same-origin',
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // best effort
  }
}

export async function logout(): Promise<void> {
  await removeDevicePushSubscription();
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {}
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
}
