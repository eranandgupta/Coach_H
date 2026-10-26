'use client';

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
let sdkPromise: Promise<void> | null = null;

/** Load the Cashfree JS SDK once per page. */
export function loadCashfreeSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).Cashfree) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error('Could not load the payment window. Please check your connection and try again.'));
      };
      document.body.appendChild(script);
    });
  }
  return sdkPromise;
}

export interface CashfreeCheckoutResult {
  error?: { message?: string };
  redirect?: boolean;
  paymentDetails?: { paymentMessage?: string };
}

/**
 * Open Cashfree's popup checkout. Resolves when the popup closes — whether the client paid,
 * failed or just closed it — so the caller must always ask the server (/api/payment/verify).
 */
export async function openCashfreeCheckout(
  paymentSessionId: string,
  mode: 'production' | 'sandbox'
): Promise<CashfreeCheckoutResult> {
  await loadCashfreeSdk();
  const cashfree = (window as any).Cashfree({ mode });
  return cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' });
}
