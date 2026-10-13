// Latest real activity: password login OR the in-app presence heartbeat (lastSeenAt).
// lastLoginAt alone only moves on a fresh login — the token lasts 7 days, so an active
// client could read "1d ago" for days.
export function lastActiveAt(client: { lastLoginAt?: string | null; lastSeenAt?: string | null }): string | null {
  const times = [client.lastLoginAt, client.lastSeenAt].filter(Boolean) as string[];
  if (!times.length) return null;
  return times.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
}

// Short "last active" label for client cards (e.g. "2d ago").
export function lastActiveLabel(dateStr: string | null): string {
  if (!dateStr) return 'Never logged in';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Active now';
  if (mins < 60) return `Active ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Active ${days}d ago`;
  const months = Math.floor(days / 30);
  return `Active ${months}mo ago`;
}
