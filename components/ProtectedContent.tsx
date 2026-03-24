'use client';

import { useEffect, useState, useRef } from 'react';
import { ShieldOff } from 'lucide-react';

interface ProtectedContentProps {
  children: React.ReactNode;
  userEmail?: string;
  className?: string;
}

export default function ProtectedContent({ children, userEmail, className = '' }: ProtectedContentProps) {
  const [isHidden, setIsHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Blur content when tab/window loses focus (deters screen recording)
  useEffect(() => {
    const handleVisibility = () => {
      setIsHidden(document.visibilityState === 'hidden');
    };
    const handleBlur = () => setIsHidden(true);
    const handleFocus = () => setIsHidden(false);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Block keyboard shortcuts for screenshots on Windows/Mac
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText('').catch(() => {});
      }
      // Block Ctrl+P (print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
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
      {/* Content — blurred when tab hidden */}
      <div
        className="transition-all duration-300"
        style={{ filter: isHidden ? 'blur(20px)' : 'none' }}
      >
        {children}
      </div>

      {/* Diagonal tiling watermark — always visible, pointer-events-none */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        aria-hidden="true"
        style={{ zIndex: 1 }}
      >
        {/* Generate a grid of watermark labels */}
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

      {/* Lock overlay when tab is hidden */}
      {isHidden && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
          style={{ zIndex: 10, background: 'rgba(5,10,20,0.92)', backdropFilter: 'blur(20px)' }}
        >
          <ShieldOff className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-white font-bold text-lg">Content Protected</p>
          <p className="text-gray-400 text-sm mt-1 text-center px-4">
            Return to this tab to view your plan
          </p>
        </div>
      )}
    </div>
  );
}
