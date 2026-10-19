import { useId } from 'react';

// Clay diya (oil lamp) with a flickering flame. Pure SVG + CSS (`.diya-flame` in
// app/globals.css animates transform/opacity only), so it costs nothing to scroll past.

interface DiyaProps {
  size?: number;
  /** Stagger the flicker so a row of diyas doesn't pulse in unison. */
  delay?: number;
  className?: string;
}

export default function Diya({ size = 44, delay = 0, className = '' }: DiyaProps) {
  // Unique gradient ids per instance; colons from useId break url(#…) references in Safari.
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className={`overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`diya-glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`diya-flame-fill-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="55%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FFF7E0" />
        </linearGradient>
        <linearGradient id={`diya-clay-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx="32" cy="26" r="20" fill={`url(#diya-glow-${uid})`} className="diya-flame" style={{ animationDelay: `${delay}s` }} />

      {/* Flame */}
      <g className="diya-flame" style={{ animationDelay: `${delay}s` }}>
        <path d="M32 10 C 36 18, 38 24, 32 32 C 26 24, 28 18, 32 10 Z" fill={`url(#diya-flame-fill-${uid})`} />
        <path d="M32 20 C 34 24, 34 27, 32 31 C 30 27, 30 24, 32 20 Z" fill="#FFF7E0" opacity="0.9" />
      </g>

      {/* Lamp bowl */}
      <path d="M8 34 C 14 50, 50 50, 56 34 Z" fill={`url(#diya-clay-${uid})`} />
      <path d="M8 34 H 56" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* Painted dots */}
      <circle cx="22" cy="41" r="1.6" fill="#FCD34D" />
      <circle cx="32" cy="43" r="1.6" fill="#FCD34D" />
      <circle cx="42" cy="41" r="1.6" fill="#FCD34D" />
    </svg>
  );
}
