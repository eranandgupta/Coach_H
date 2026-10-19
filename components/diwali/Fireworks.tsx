'use client';

import { useEffect, useRef, useState } from 'react';

// Warm Diwali palette only — gold, amber, marigold and soft white (no rainbow bursts).
const DARK_COLORS = ['#FCD34D', '#FBBF24', '#F59E0B', '#FB923C', '#FFF4D6'];
const LIGHT_COLORS = ['#D97706', '#EA580C', '#F59E0B', '#B45309', '#FBBF24'];

const MAX_PARTICLES = 900;
const BURST_SESSION_KEY = 'ch-diwali-burst';

type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Flash = { x: number; y: number; life: number; color: string };
type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; decay: number; color: string; size: number };

interface FireworksProps {
  /**
   * `burst`   — one celebratory volley over the whole viewport, once per browser session.
   * `ambient` — occasional fireworks inside the parent (needs a positioned parent); runs only
   *             while the parent is on screen and the tab is visible.
   */
  mode: 'burst' | 'ambient';
  className?: string;
}

export default function Fireworks({ mode, className = '' }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide on the client: skip for reduced motion, and play the burst only once per session.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (mode === 'burst') {
      try {
        if (sessionStorage.getItem(BURST_SESSION_KEY)) return;
        sessionStorage.setItem(BURST_SESSION_KEY, '1');
      } catch {}
    }
    setEnabled(true);
  }, [mode]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const colors = document.documentElement.classList.contains('light') ? LIGHT_COLORS : DARK_COLORS;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const flashes: Flash[] = [];
    const pick = () => colors[(Math.random() * colors.length) | 0];

    const launch = () => {
      let x = w * (0.12 + Math.random() * 0.76);
      let targetY = h * (0.12 + Math.random() * 0.3);
      if (mode === 'ambient') {
        // The sale card covers the middle of the section — burst in the open margins beside
        // it on wide screens, and above it on narrow ones.
        if (w > 900) {
          const side = Math.random() < 0.5 ? 0.02 : 0.84;
          x = w * (side + Math.random() * 0.14);
          targetY = h * (0.1 + Math.random() * 0.4);
        } else {
          targetY = h * (0.04 + Math.random() * 0.1);
        }
      }
      rockets.push({ x, y: h, vy: -Math.sqrt(2 * 0.12 * (h - targetY)) * 1.15, targetY, color: pick() });
    };

    const explode = (x: number, y: number, color: string) => {
      flashes.push({ x, y, life: 1, color });
      const count = Math.min(mode === 'burst' ? 120 : 90, MAX_PARTICLES - sparks.length);
      const speed = Math.max(3, Math.min(w, h) / 110);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const v = speed * (0.45 + Math.random() * 0.75);
        sparks.push({
          x, y, px: x, py: y,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          life: 1,
          decay: 0.009 + Math.random() * 0.01,
          // Mostly the rocket's colour, with a few white-gold glitter sparks.
          color: Math.random() < 0.25 ? colors[colors.length - 1] : color,
          size: 1.8 + Math.random() * 1.8,
        });
      }
    };

    let raf = 0;
    let running = false;
    let launching = mode === 'burst';
    let launchTimer: ReturnType<typeof setTimeout> | undefined;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.12; // gravity: the rocket slows to its apex
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x - 1.5, r.y, 3, 10);
        if (r.y <= r.targetY || r.vy > -0.5) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Brief glow where each shell bursts.
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= 0.06;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const r = 70 * (1.2 - f.life);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, f.color);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = f.life * 0.5;
        ctx.fillStyle = g;
        ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.px = s.x;
        s.py = s.y;
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + 0.045; // drag + gravity
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // Idle: stop the loop entirely once nothing is in flight and no more launches are due.
      if (!launching && rockets.length === 0 && sparks.length === 0 && flashes.length === 0) {
        running = false;
        ctx.clearRect(0, 0, w, h);
        if (mode === 'burst') setEnabled(false); // unmount the overlay canvas
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const scheduleAmbient = () => {
      launchTimer = setTimeout(() => {
        if (!launching) return;
        launch();
        if (Math.random() < 0.35) setTimeout(launch, 250);
        start();
        scheduleAmbient();
      }, 1100 + Math.random() * 900);
    };

    let observer: IntersectionObserver | undefined;
    let inView = false;
    const resumeAmbient = () => {
      clearTimeout(launchTimer);
      launching = inView && !document.hidden;
      if (launching) {
        resize();
        launch();
        start();
        scheduleAmbient();
      }
    };
    const onVisibility = () => {
      if (mode === 'ambient') resumeAmbient();
    };

    if (mode === 'burst') {
      // Let the page settle (hero, video) before the volley, then ~3s of rockets.
      const volley = [0, 250, 500, 900, 1200, 1600, 1900, 2300, 2700];
      launchTimer = setTimeout(() => {
        volley.forEach((t) => setTimeout(launch, t));
        setTimeout(() => { launching = false; }, volley[volley.length - 1] + 50);
        start();
      }, 1200);
    } else {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        resumeAmbient();
      }, { threshold: 0.15 });
      observer.observe(canvas);
      document.addEventListener('visibilitychange', onVisibility);
    }

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(launchTimer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, mode]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        mode === 'burst'
          ? `pointer-events-none fixed inset-0 z-[60] h-full w-full ${className}`
          : `pointer-events-none absolute inset-0 h-full w-full ${className}`
      }
    />
  );
}
