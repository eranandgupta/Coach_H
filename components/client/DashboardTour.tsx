'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type TourStep = {
  /** Matches a `data-tour` attribute. Steps whose target isn't on screen for this client are skipped. */
  target: string;
  title: string;
  body: string;
};

const GAP = 12;
const EDGE = 12;
const CARD_HEIGHT_ESTIMATE = 220;
const CARD_WIDTH = 340;

function findVisible(target: string): HTMLElement | null {
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? el : null;
}

/** Step-by-step guide: dims the page, highlights one section at a time and explains it. */
export default function DashboardTour({ steps, onClose }: { steps: TourStep[]; onClose: () => void }) {
  // Fixed when the tour opens, so the step count can't shift underneath the client mid-tour.
  const [available] = useState(() => steps.filter((s) => findVisible(s.target)));
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [cardHeight, setCardHeight] = useState(CARD_HEIGHT_ESTIMATE);
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const step = available[index];
  const isLast = index === available.length - 1;

  const measure = useCallback(() => {
    if (step) setRect(findVisible(step.target)?.getBoundingClientRect() ?? null);
  }, [step]);

  useLayoutEffect(() => {
    if (!step) return;
    const el = findVisible(step.target);
    if (!el) return;
    const fixed = getComputedStyle(el).position === 'fixed' || !!el.closest('header');
    const tall = el.getBoundingClientRect().height > window.innerHeight * 0.6;
    if (!fixed) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: tall ? 'start' : 'center' });
    measure();
    nextRef.current?.focus({ preventScroll: true });
  }, [step, measure]);

  // Text length differs per step and per screen width, so position from the card's real height.
  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
  }, [index, rect]);

  useEffect(() => {
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const go = useCallback(
    (to: number) => {
      if (to >= available.length) onClose();
      else if (to >= 0) setIndex(to);
    },
    [available.length, onClose]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'Tab') {
        // Keep keyboard focus inside the guide while the page behind it is dimmed.
        const buttons = cardRef.current?.querySelectorAll('button');
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, onClose]);

  useEffect(() => {
    if (available.length === 0) onClose();
  }, [available.length, onClose]);

  if (!step) return null;

  const vh = typeof window === 'undefined' ? 0 : window.innerHeight;
  const vw = typeof window === 'undefined' ? 0 : window.innerWidth;
  const width = Math.min(CARD_WIDTH, vw - EDGE * 2);

  // Below the section if it fits, else above it, else pinned to the bottom of the screen over it.
  let top = vh - cardHeight - EDGE;
  let left = (vw - width) / 2;
  if (rect) {
    if (rect.bottom + GAP + cardHeight <= vh - EDGE) top = rect.bottom + GAP;
    else if (rect.top - GAP - cardHeight >= EDGE) top = rect.top - GAP - cardHeight;
    left = Math.max(EDGE, Math.min(rect.left, vw - width - EDGE));
  }

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Dashboard guide">
      {/* Blocks clicks on the page behind. The highlight's shadow provides the dimming. */}
      <div className="absolute inset-0" />
      {rect && (
        <div
          aria-hidden
          className="absolute rounded-2xl ring-2 ring-brand-blue pointer-events-none"
          style={{
            top: Math.max(0, rect.top - 6),
            left: Math.max(0, rect.left - 6),
            width: Math.min(rect.width + 12, vw),
            height: Math.min(rect.height + 12, vh),
            boxShadow: '0 0 0 9999px rgba(3, 7, 18, 0.72)',
          }}
        />
      )}
      <div
        ref={cardRef}
        className="absolute rounded-2xl bg-brand-navy-light border border-white/[0.1] shadow-2xl p-4"
        style={{ top, left, width }}
      >
        <p className="text-xs font-medium text-gray-500" aria-live="polite">
          Step {index + 1} of {available.length}
        </p>
        <h2 className="mt-1 text-base font-bold text-white">{step.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-300">{step.body}</p>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={onClose} className="min-h-[44px] pr-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Skip
          </button>
          <div className="ml-auto flex items-center gap-2">
            {index > 0 && (
              <button onClick={() => go(index - 1)} className="min-h-[44px] px-4 rounded-xl text-sm font-semibold text-gray-300 bg-white/[0.06] hover:bg-white/10 transition-colors">
                Back
              </button>
            )}
            <button ref={nextRef} onClick={() => go(index + 1)} className="min-h-[44px] px-5 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-blue-600 transition-colors">
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
