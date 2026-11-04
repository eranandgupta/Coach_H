// Messages are written here BEFORE they're sent and removed only once the server confirms them.
// So a failed request, a closed app or a dead phone battery can't lose what someone typed: it stays
// on their phone and is sent the next time the app can.

export type OutboxItem = { tempId: number; content: string; attemptedAt: number };
export type SendResult = { ok: true; message: any } | { ok: false; permanent: boolean };

const PREFIX = 'ch_chat_outbox';
const TIMEOUT_MS = 20000;
/** Fetch only allows a keepalive body up to 64KB in total. */
const KEEPALIVE_MAX_CHARS = 20000;
/** Leave a just-started send alone: it may still be finishing after the app was closed. */
export const SETTLE_MS = 10000;

// Module-level, so it outlives the chat screen: leaving and reopening a chat can't double-send.
const inFlight = new Set<number>();

const keyFor = (userId: number, conversationId: number) => `${PREFIX}_${userId}_${conversationId}`;

export function readOutbox(userId: number, conversationId: number): OutboxItem[] {
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId, conversationId)) || '[]');
  } catch {
    return [];
  }
}

function writeOutbox(userId: number, conversationId: number, items: OutboxItem[]) {
  try {
    const key = keyFor(userId, conversationId);
    if (items.length) localStorage.setItem(key, JSON.stringify(items));
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked: the message still sends, it just can't survive the app closing.
  }
}

export function addToOutbox(userId: number, conversationId: number, item: OutboxItem) {
  writeOutbox(userId, conversationId, [...readOutbox(userId, conversationId), item]);
}

export function removeFromOutbox(userId: number, conversationId: number, tempId: number) {
  writeOutbox(userId, conversationId, readOutbox(userId, conversationId).filter((i) => i.tempId !== tempId));
}

export const isSending = (tempId: number) => inFlight.has(tempId);

/**
 * Sends one message. Only a confirmed save removes it from the outbox. `retry` tells the server this
 * may already have been saved (the earlier reply could have been lost), so it won't store it twice.
 * Returns null if this message is already being sent.
 */
export async function deliverOutboxItem(
  userId: number,
  conversationId: number,
  item: OutboxItem,
  retry: boolean
): Promise<SendResult | null> {
  if (inFlight.has(item.tempId)) return null;
  inFlight.add(item.tempId);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        content: item.content,
        ...(retry ? { retryAgeMs: Math.max(0, Date.now() - item.attemptedAt) } : {}),
      }),
      // Lets the request finish even if the app is closed straight after tapping send.
      keepalive: item.content.length <= KEEPALIVE_MAX_CHARS,
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.message) {
        removeFromOutbox(userId, conversationId, item.tempId);
        return { ok: true, message: data.message };
      }
      return { ok: false, permanent: false };
    }
    // 4xx means retrying won't help (no access, invalid), except "too many" and "timed out".
    return { ok: false, permanent: res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429 };
  } catch {
    return { ok: false, permanent: false };
  } finally {
    clearTimeout(timer);
    inFlight.delete(item.tempId);
  }
}

/** On app open: send anything left over from last time, without waiting for that chat to be opened. */
export function flushChatOutbox(userId: number) {
  try {
    const prefix = `${PREFIX}_${userId}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;
      const conversationId = Number(key.slice(prefix.length));
      readOutbox(userId, conversationId)
        .filter((item) => Date.now() - item.attemptedAt >= SETTLE_MS)
        .forEach((item) => { void deliverOutboxItem(userId, conversationId, item, true); });
    }
  } catch {
    // Storage blocked: nothing could have been saved to resend.
  }
}
