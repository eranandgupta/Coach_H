'use client';

import { useRef, useEffect, useState } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  title?: string;
}

export default function LazyVideo({ src, className, style, ariaLabel, title }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Reveal when scrolled near the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Safari/WebKit does NOT reliably start playback for a <source> injected after mount,
  // nor for autoPlay toggled post-mount. Set the src on the element directly and explicitly
  // load() + play() once visible. play() may reject (e.g. iOS Low Power Mode) — ignore it.
  useEffect(() => {
    const el = ref.current;
    if (!el || !isVisible) return;
    if (el.getAttribute('src') !== src) {
      el.setAttribute('src', src);
      el.load();
    }
    const tryPlay = () => {
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();
    // Retry once metadata is ready (covers Safari's delayed readiness).
    el.addEventListener('loadedmetadata', tryPlay, { once: true });
    return () => el.removeEventListener('loadedmetadata', tryPlay);
  }, [isVisible, src]);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      loop
      muted
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-label={ariaLabel}
      title={title}
    />
  );
}
