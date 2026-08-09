'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Check, Gift, Loader2 } from 'lucide-react';

/**
 * Azaadi (Independence Day) "Spin & Win" wheel.
 *
 * Tricolour wheel (saffron / white / green). The winning prize is decided
 * SERVER-SIDE by /api/spin (weighted 10/20/25/30% — never 50, never >30); this
 * component just animates the wheel to land on whatever the server returns and
 * reveals the one-time coupon code. One spin per device (localStorage + a stable
 * deviceId sent to the server). Contact (email/phone) is captured before spinning.
 */

type Segment = { value: number; color: string; text: string };

// 6 segments, colours cycling saffron → white → green (three colours total).
// NOTE: the 50% wedge is a DECOY — it's shown to entice, but the server (/api/spin)
// only ever awards 10/20/25/30, so landOnPrize() can never target the 50% segment.
const SEGMENTS: Segment[] = [
  { value: 10, color: '#FF9933', text: '#4A2500' },
  { value: 20, color: '#FFFFFF', text: '#0A1F44' },
  { value: 50, color: '#138808', text: '#FFFFFF' },
  { value: 25, color: '#FF9933', text: '#4A2500' },
  { value: 30, color: '#FFFFFF', text: '#0A1F44' },
  { value: 20, color: '#138808', text: '#FFFFFF' },
];

const SEG_ANGLE = 360 / SEGMENTS.length;
const STORAGE_KEY = 'azaadi_spin_result';
const DEVICE_KEY = 'azaadi_device_id';

// Point on a circle, measuring the angle CLOCKWISE from the top (12 o'clock).
function pt(angleDeg: number, r: number, cx = 100, cy = 100) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

function segPath(i: number, r = 100) {
  const start = i * SEG_ANGLE;
  const end = start + SEG_ANGLE;
  const p1 = pt(start, r);
  const p2 = pt(end, r);
  return `M100 100 L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
}

function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return 'dev_' + Math.random().toString(36).slice(2);
  }
}

export default function AzaadiSpinWheel() {
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'done'>('idle');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ code: string; prize: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // Restore a previously won prize (one spin per device).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.code && saved?.prize) {
          setResult({ code: saved.code, prize: saved.prize });
          // Park the wheel on the won segment.
          const idx = SEGMENTS.findIndex((s) => s.value === saved.prize);
          if (idx >= 0) setRotation(-(idx * SEG_ANGLE + SEG_ANGLE / 2));
          setPhase('done');
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const paths = useMemo(() => SEGMENTS.map((_, i) => segPath(i)), []);

  const landOnPrize = (prize: number) => {
    const idx = Math.max(0, SEGMENTS.findIndex((s) => s.value === prize));
    const jitter = (Math.random() - 0.5) * (SEG_ANGLE * 0.5); // stay well inside the wedge
    const target = 360 * 6 - (idx * SEG_ANGLE + SEG_ANGLE / 2) - jitter;
    setRotation(target);
  };

  const handleSpin = async () => {
    setError('');
    const v = contact.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const digits = v.replace(/\D/g, '');
    const phoneOk = /^[0-9+\-\s]{7,20}$/.test(v) && digits.length >= 7 && digits.length <= 15;
    if (!emailOk && !phoneOk) {
      setError('Enter a valid email or phone number to spin.');
      return;
    }

    setPhase('spinning');
    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: getDeviceId(), contact: v }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.');
        setPhase('idle');
        return;
      }

      landOnPrize(data.prize);
      const won = { code: data.code, prize: data.prize };
      // Reveal after the wheel finishes decelerating.
      window.setTimeout(() => {
        setResult(won);
        setPhase('done');
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(won));
        } catch {
          /* ignore */
        }
      }, 4300);
    } catch {
      setError('Network error. Please try again.');
      setPhase('idle');
    }
  };

  const copyCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is shown for manual copy */
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-2">
      <div className="text-center">
        <h3 className="text-xl md:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span aria-hidden>🎡</span> Spin &amp; Win up to 50% OFF
        </h3>
        <p className="text-orange-200/80 text-xs md:text-sm mt-1 font-medium">
          One free spin per device · One-time coupon
        </p>
      </div>

      {/* Wheel */}
      <div className="relative" style={{ width: 224, height: 224 }}>
        {/* Pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ top: -6 }}
          aria-hidden
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '11px solid transparent',
              borderRight: '11px solid transparent',
              borderTop: '18px solid #FFD700',
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))',
            }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 6px rgba(255,255,255,0.06)',
            transform: `rotate(${rotation}deg)`,
            transition:
              phase === 'spinning'
                ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)'
                : 'none',
          }}
        >
          <svg viewBox="0 0 200 200" width="224" height="224" role="img" aria-label="Prize wheel">
            <circle cx="100" cy="100" r="100" fill="#0A1F44" />
            {SEGMENTS.map((seg, i) => {
              const mid = i * SEG_ANGLE + SEG_ANGLE / 2;
              const lp = pt(mid, 64);
              return (
                <g key={i}>
                  <path d={paths[i]} fill={seg.color} stroke="rgba(10,31,68,0.85)" strokeWidth={1.5} />
                  <text
                    x={lp.x}
                    y={lp.y}
                    fill={seg.text}
                    fontSize="17"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${mid}, ${lp.x}, ${lp.y})`}
                  >
                    {seg.value}%
                  </text>
                </g>
              );
            })}
            {/* Hub */}
            <circle cx="100" cy="100" r="20" fill="#0A1F44" stroke="#FFD700" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="8" fill="#FFD700" />
          </svg>
        </div>
      </div>

      {/* Controls */}
      {phase !== 'done' && (
        <div className="w-full max-w-xs flex flex-col items-center gap-2">
          <input
            type="text"
            inputMode="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={phase === 'spinning'}
            placeholder="Email or phone to claim your prize"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-400/60 disabled:opacity-60"
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            onClick={handleSpin}
            disabled={phase === 'spinning'}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #FF9933, #138808)' }}
          >
            {phase === 'spinning' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Spinning…
              </>
            ) : (
              <>
                <Gift size={16} /> SPIN TO WIN
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-500 text-center leading-snug">
            Use your spin coupon <span className="text-gray-400">or</span> a sale discount — not both.
          </p>
        </div>
      )}

      {/* Result */}
      {phase === 'done' && result && (
        <div className="w-full max-w-xs flex flex-col items-center gap-2 text-center">
          <p className="text-white text-lg font-extrabold">
            🎉 You won <span className="text-orange-300">{result.prize}% OFF!</span>
          </p>
          <button
            onClick={copyCode}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base tracking-wider border border-orange-400/40 bg-orange-400/10 text-orange-200 hover:bg-orange-400/20 transition-colors"
          >
            {result.code}
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <p className="text-[11px] text-gray-400 leading-snug">
            {copied ? 'Copied! ' : ''}Apply <span className="font-semibold text-gray-300">{result.code}</span> at
            checkout. One-time use · valid till Aug 20.
          </p>
        </div>
      )}
    </div>
  );
}
