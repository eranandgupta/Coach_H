'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

// Browser chrome / PWA status bar colour per theme (matches the navbar surface).
const THEME_COLOR = { dark: '#0A0F1F', light: '#FFFFFF' } as const;

function ThemeChromeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const theme = resolvedTheme === 'light' ? 'light' : 'dark';
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute('content', THEME_COLOR[theme]));
  }, [resolvedTheme]);

  return null;
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-center" richColors theme={resolvedTheme === 'light' ? 'light' : 'dark'} />;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      themes={['dark', 'light']}
      enableSystem={false}
      storageKey="ch-theme"
    >
      <ThemeChromeSync />
      {children}
      <ThemedToaster />
      {/* iOS standalone PWA uses a translucent status bar with white glyphs —
          keep a navy band behind it so the clock stays legible in light mode. */}
      <div aria-hidden className="ios-status-scrim" />
    </NextThemesProvider>
  );
}
