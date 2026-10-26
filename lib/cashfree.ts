import crypto from 'crypto';

/**
 * Cashfree Payment Gateway (PG) REST helpers.
 *
 * Env:
 *   CASHFREE_APP_ID      — "App ID" / x-client-id from Cashfree Dashboard → Developers → API Keys
 *   CASHFREE_SECRET_KEY  — "Secret Key" / x-client-secret (also signs webhooks)
 *   CASHFREE_ENV         — "production" or "sandbox" (default: sandbox, so a missing var never charges)
 */

const API_VERSION = '2023-08-01';

export const cashfreeMode: 'production' | 'sandbox' =
  process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';

const BASE_URL =
  cashfreeMode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

export class CashfreeError extends Error {
  constructor(message: string, public status: number, public body: any) {
    super(message);
  }
}

async function cfFetch<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secret) throw new Error('CASHFREE_APP_ID / CASHFREE_SECRET_KEY not configured');

  const res = await fetch(`${BASE_URL}${path}`, {
    method: init.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': API_VERSION,
      'x-client-id': appId,
      'x-client-secret': secret,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new CashfreeError(data?.message || `Cashfree ${res.status}`, res.status, data);
  }
  return data as T;
}

export interface CashfreeOrder {
  cf_order_id: string | number;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | 'TERMINATION_REQUESTED';
  payment_session_id: string;
  order_tags: Record<string, string> | null;
  customer_details?: {
    customer_id?: string;
    customer_name?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
  };
}

export interface CashfreePayment {
  cf_payment_id: string | number;
  order_id: string;
  payment_amount: number;
  payment_currency?: string;
  payment_status: 'SUCCESS' | 'NOT_ATTEMPTED' | 'FAILED' | 'USER_DROPPED' | 'VOID' | 'CANCELLED' | 'PENDING';
  payment_message?: string;
}

export function createCashfreeOrder(body: Record<string, unknown>) {
  return cfFetch<CashfreeOrder>('/orders', { method: 'POST', body });
}

export function getCashfreeOrder(orderId: string) {
  return cfFetch<CashfreeOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

export function getCashfreeOrderPayments(orderId: string) {
  return cfFetch<CashfreePayment[]>(`/orders/${encodeURIComponent(orderId)}/payments`);
}

/**
 * Cashfree signs webhooks as base64(HMAC-SHA256(timestamp + rawBody, secretKey)).
 * Their docs also show a "timestamp.rawBody" variant, so both are accepted.
 */
export function verifyCashfreeWebhook(rawBody: string, timestamp: string, signature: string): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret || !timestamp || !signature) return false;
  const given = Buffer.from(signature);
  return [`${timestamp}${rawBody}`, `${timestamp}.${rawBody}`].some((payload) => {
    const expected = Buffer.from(crypto.createHmac('sha256', secret).update(payload).digest('base64'));
    return expected.length === given.length && crypto.timingSafeEqual(expected, given);
  });
}

/** Cashfree wants a phone number; renewals from old accounts may have none. */
export function cashfreePhone(raw: string | null | undefined): string {
  const digits = (raw || '').replace(/[^\d+]/g, '');
  const plain = digits.replace(/\+/g, '');
  if (plain.length < 10) return '9999999999';
  // Indian numbers go as 10 digits; anything else keeps its country code with a leading +.
  if (plain.length === 10) return plain;
  if (plain.length === 12 && plain.startsWith('91')) return plain.slice(2);
  return `+${plain}`;
}
