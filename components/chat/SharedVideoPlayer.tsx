'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import ProtectedContent from '@/components/ProtectedContent';

/** Plays a video shared in chat without leaving the app, with the Video Library's watermark. */
export default function SharedVideoPlayer({
  videoId,
  title,
  userEmail,
  onClose,
}: {
  videoId: string;
  title: string;
  userEmail?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="theme-dark fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h2 className="flex-1 min-w-0 truncate text-white font-semibold">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close video"
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <ProtectedContent userEmail={userEmail} className="w-full max-w-5xl">
          <div className="relative aspect-video w-full bg-black" onContextMenu={(e) => e.preventDefault()}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading video">
                <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
              </div>
            )}
            {/* No `sandbox` and no `encrypted-media`: together they crash Safari (see VideoLibrary). */}
            <iframe
              src={`https://go.screenpal.com/player/${videoId}?autoplay=1`}
              className="relative w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={title}
              onLoad={() => setLoading(false)}
            />
          </div>
        </ProtectedContent>
      </div>
    </div>
  );
}
