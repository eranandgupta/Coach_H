'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * In-app replacements for window.confirm / window.alert. Browsers let a user "suppress dialogues"
 * for a site (iOS Chrome offers it right on the popup); after that confirm() silently returns
 * false, so Delete buttons did nothing and errors never showed. These can't be suppressed.
 *
 *   if (!(await appConfirm('Delete this diet plan?'))) return;
 *   appAlert('Failed to delete diet');
 *
 * <AppDialogHost /> is mounted once in the root layout.
 */

interface DialogRequest {
  kind: 'confirm' | 'alert';
  message: string;
  resolve: (ok: boolean) => void;
}

let enqueue: ((req: DialogRequest) => void) | null = null;

function request(kind: DialogRequest['kind'], message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (enqueue) enqueue({ kind, message, resolve });
    // Host not mounted (shouldn't happen): fall back to the browser's own dialog.
    else resolve(kind === 'confirm' ? window.confirm(message) : (window.alert(message), true));
  });
}

export const appConfirm = (message: string) => request('confirm', message);
export const appAlert = (message: string) => request('alert', message).then(() => undefined);

export function AppDialogHost() {
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    enqueue = (req) => setQueue((q) => [...q, req]);
    return () => {
      enqueue = null;
    };
  }, []);

  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!mounted || !current) return null;

  function close(ok: boolean) {
    current.resolve(current.kind === 'alert' ? true : ok);
    setQueue((q) => q.slice(1));
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4" onClick={() => close(false)}>
      <div
        role={current.kind === 'confirm' ? 'alertdialog' : 'alert'}
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-navy-light p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-white">{current.message}</p>
        <div className="mt-5 flex justify-end gap-2">
          {current.kind === 'confirm' && (
            <button
              type="button"
              onClick={() => close(false)}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            autoFocus
            onClick={() => close(true)}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
