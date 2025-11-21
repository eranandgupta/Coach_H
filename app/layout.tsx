import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://coachhimanshu.com'),
  title: {
    default: 'Coach Himanshu | NASM Certified Online Fitness Coach & Personal Trainer India',
    template: '%s | Coach Himanshu',
  },
  description: 'Transform your body with NASM Certified Fitness Coach Himanshu. Get personalized online workout plans, custom meal plans, 24/7 WhatsApp support & expert nutrition guidance. 1000+ transformations. Affordable fitness coaching in India starting at ₹799/month.',
  applicationName: 'Coach Himanshu',
  keywords: [
    'online fitness coach India',
    'personal trainer India',
    'NASM certified coach',
    'online workout plans',
    'custom meal plans India',
    'bodybuilding coach India',
    'fitness transformation India',
    'affordable fitness coaching',
    'online nutrition coach',
    'virtual personal trainer',
    'home workout plans',
    'weight loss coach India',
    'muscle building coach',
    'fitness expert India',
    'certified fitness trainer',
    'online gym trainer',
    'personalized fitness program',
    'diet plan India',
    'fitness consultation online',
    'Coach Himanshu',
  ],
  authors: [{ name: 'Coach Himanshu' }],
  creator: 'Coach Himanshu',
  publisher: 'Coach Himanshu',
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coach Himanshu',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://coachhimanshu.com',
    title: 'Coach Himanshu | NASM Certified Online Fitness Coach India',
    description: 'Transform your fitness journey with NASM Certified Coach. Personalized workout & meal plans, 24/7 support. 1000+ success stories. Start from ₹799/month.',
    siteName: 'Coach Himanshu',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Coach Himanshu - NASM Certified Fitness Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coach Himanshu | NASM Certified Online Fitness Coach',
    description: 'Transform your fitness with personalized coaching. 1000+ transformations. Start at ₹799/month.',
    images: ['/og-image.jpg'],
    creator: '@coach_himanshu_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#175FFF" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Coach Himanshu" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <PWAInstallPrompt />
          <WhatsAppButton />
        </CartProvider>

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
