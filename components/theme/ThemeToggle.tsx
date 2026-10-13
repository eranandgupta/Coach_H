'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

type Props = {
  size?: 'sm' | 'md';
  className?: string;
};

// Track/thumb geometry per size. Thumb position is driven by the `html.light`
// class in CSS (not React state), so the first paint is already correct and
// there's no hydration flicker before next-themes mounts.
const SIZES = {
  sm: { track: 'w-[52px] h-[28px]', thumb: 'w-[22px] h-[22px] [html.light_&]:translate-x-[24px]', icon: 13, side: 11 },
  md: { track: 'w-[60px] h-[32px]', thumb: 'w-[26px] h-[26px] [html.light_&]:translate-x-[28px]', icon: 15, side: 12 },
};

export default function ThemeToggle({ size = 'md', className = '' }: Props) {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (forcedTheme) return null;

  const isLight = mounted && resolvedTheme === 'light';
  const s = SIZES[size];

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isLight ? 'dark' : 'light';
    const root = document.documentElement;

    try { navigator.vibrate?.(8); } catch {}

    const apply = () => {
      // Swap the class synchronously so the transition snapshot is accurate;
      // next-themes re-applies the same value from its effect.
      root.classList.remove('dark', 'light');
      root.classList.add(next);
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // Circular reveal expanding from the switch itself.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    doc.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
      onClick={toggle}
      className={`group relative inline-flex shrink-0 items-center rounded-full p-[3px] touch-manipulation select-none
        transition-[background,box-shadow,border-color] duration-300
        border border-white/[0.10] bg-gradient-to-b from-[#0d1530] to-[#121c3b]
        shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_0_1px_rgba(23,95,255,0.06)]
        [html.light_&]:from-[#eef3ff] [html.light_&]:to-[#dfe8ff] [html.light_&]:border-brand-blue/20
        [html.light_&]:shadow-[inset_0_1px_3px_rgba(23,60,160,0.18),0_1px_0_#fff]
        hover:border-brand-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60
        focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy
        before:absolute before:-inset-[8px] before:content-[''] ${s.track} ${className}`}
    >
      {/* Idle-side glyphs */}
      <Sun
        aria-hidden
        size={s.side}
        className="absolute right-[8px] text-amber-300/60 transition-opacity duration-300 [html.light_&]:opacity-0"
      />
      <Moon
        aria-hidden
        size={s.side}
        className="absolute left-[8px] opacity-0 text-brand-blue/50 transition-opacity duration-300 [html.light_&]:opacity-100"
      />

      {/* Thumb */}
      <span
        aria-hidden
        className={`relative z-[1] flex items-center justify-center rounded-full text-snow
          bg-gradient-to-br from-[#3d7bff] to-[#1240CC]
          shadow-[0_2px_8px_rgba(23,95,255,0.55),inset_0_1px_0_rgba(255,255,255,0.35)]
          transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
          group-active:scale-90 ${s.thumb}`}
      >
        <Moon size={s.icon} strokeWidth={2.25} className="absolute transition-all duration-500 [html.light_&]:-rotate-90 [html.light_&]:scale-0 [html.light_&]:opacity-0" />
        <Sun size={s.icon} strokeWidth={2.25} className="absolute rotate-90 scale-0 opacity-0 transition-all duration-500 [html.light_&]:rotate-0 [html.light_&]:scale-100 [html.light_&]:opacity-100" />
      </span>
    </button>
  );
}
