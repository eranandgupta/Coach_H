'use client';

import { useEffect, useRef } from 'react';

interface ProtectedContentProps {
  children: React.ReactNode;
  userEmail?: string;
  className?: string;
}

export default function ProtectedContent({ children, userEmail, className = '' }: ProtectedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Block keyboard shortcuts used for screenshots / print-to-PDF
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen (Windows)
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText('').catch(() => {});
      }
      // Block Ctrl+P / Cmd+P (print / print-to-PDF)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }
      // Block Ctrl+S / Cmd+S (save page)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const watermarkLabel = userEmail
    ? `${userEmail} • Coach Himanshu • Confidential`
    : 'Coach Himanshu • Confidential • Do Not Share';

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Actual content — always visible */}
      {children}

      {/* Diagonal tiling watermark — always on top, pointer-events-none */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        aria-hidden="true"
        style={{ zIndex: 1 }}
      >
        {Array.from({ length: 60 }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          return (
            <span
              key={i}
              className="absolute text-white/[0.045] font-semibold text-xs whitespace-nowrap select-none"
              style={{
                top: `${row * 80 + (col % 2) * 40}px`,
                left: `${col * 200 - 40}px`,
                transform: 'rotate(-30deg)',
                transformOrigin: 'left center',
                fontSize: '11px',
                letterSpacing: '0.05em',
              }}
            >
              {watermarkLabel}
            </span>
          );
        })}
      </div>
    </div>
  );
}
