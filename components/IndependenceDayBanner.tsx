'use client';

import { useEffect, useState } from 'react';

// Indian flag colours.
const SAFFRON = '#FF9933';
const GREEN = '#138808';
const CHAKRA = '#000080';

// Festive window: 1–20 August. Client-side (real browser date) so the banner
// appears in the lead-up to 15 August and cleanly disappears afterwards — no stale
// "Independence Day" banner lingering in September, and no rebuild needed.
function isIndependenceSeason(d: Date): boolean {
  return d.getMonth() === 7 && d.getDate() >= 1 && d.getDate() <= 20; // month 7 = August
}

function AshokaChakra({ size = 72 }: { size?: number }) {
  const spokes = Array.from({ length: 24 });
  return (
    // White disc so the navy chakra reads correctly on the dark page.
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-lg"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size - 8}
        height={size - 8}
        role="img"
        aria-label="Ashoka Chakra"
        className="motion-safe:animate-spin"
        style={{ animationDuration: '14s' }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke={CHAKRA} strokeWidth="3" />
        <circle cx="50" cy="50" r="5" fill={CHAKRA} />
        {spokes.map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="7"
            stroke={CHAKRA}
            strokeWidth="1.4"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
      </svg>
    </span>
  );
}

export default function IndependenceDayBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isIndependenceSeason(new Date()));
  }, []);

  if (!show) return null;

  return (
    <section aria-label="Independence Day message" className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Tricolour top bar */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1" style={{ background: SAFFRON }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: GREEN }} />
        </div>

        {/* Soft tricolour glow over the dark card */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 0% 0%, rgba(255,153,51,0.16) 0%, transparent 55%), radial-gradient(120% 90% at 100% 100%, rgba(19,136,8,0.16) 0%, transparent 55%)',
          }}
        />

        <div className="relative flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:p-7 sm:text-left">
          <AshokaChakra size={78} />

          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SAFFRON }}>
              🇮🇳 15 August · Happy Independence Day
            </p>

            <h2 className="mt-1.5 text-2xl font-extrabold leading-tight md:text-3xl">
              <span style={{ color: SAFFRON }}>Our Independence Day </span>
              <span className="text-white">gift to </span>
              <span style={{ color: GREEN }}>India</span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-200 md:text-base">
              This free calorie calculator — with full macros and{' '}
              <span className="font-semibold text-white">600+ Indian foods</span> — is our gift to the
              nation this Independence Day. So every Indian can eat wisely, track their food, and get
              fit. <span className="font-semibold text-white">Free for everyone, forever</span> — our
              first step toward a healthier, fitter India.
            </p>

            <p className="mt-3 text-sm font-bold tracking-wide">
              <span style={{ color: SAFFRON }}>Jai</span> <span className="text-white">Hind</span>{' '}
              <span style={{ color: GREEN }}>· #FitIndia</span> 🧡🤍💚
            </p>
          </div>
        </div>

        {/* Tricolour bottom bar */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1" style={{ background: SAFFRON }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: GREEN }} />
        </div>
      </div>
    </section>
  );
}
