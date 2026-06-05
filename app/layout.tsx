import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileAppNav from '@/components/MobileAppNav';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://coachhimanshu.com'),
  title: {
    default: 'Coach Himanshu | NASM Certified Online Fitness Coach & Personal Trainer India',
    template: '%s | Coach Himanshu',
  },
  description: 'Transform your body with NASM Certified Fitness Coach Himanshu. Get personalized online workout plans, custom meal plans, WhatsApp support & expert nutrition guidance. 1000+ transformations. Affordable fitness coaching in India starting at ₹799/month.',
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
    description: 'Transform your fitness journey with NASM Certified Coach. Personalized workout & meal plans, dedicated support. 1000+ success stories. Start from ₹799/month.',
    siteName: 'Coach Himanshu',
    images: [
      {
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
  alternates: {
    canonical: 'https://coachhimanshu.com',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Replace with code from Google Search Console
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE', // Replace with code from Bing Webmaster Tools
    },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          <MobileAppNav />
          <PWAInstallPrompt />
          <WhatsAppButton />
        </CartProvider>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Service Worker Registration with Auto-Update */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('SW registered, scope:', registration.scope);

                    // Check for updates immediately and every 5 minutes (not 60s to save resources)
                    registration.update();
                    var swInterval = setInterval(function() { registration.update(); }, 5 * 60 * 1000);

                    // Clean up interval when page is hidden/unloaded to prevent memory leak
                    document.addEventListener('visibilitychange', function() {
                      if (document.hidden) {
                        clearInterval(swInterval);
                      } else {
                        registration.update();
                        swInterval = setInterval(function() { registration.update(); }, 5 * 60 * 1000);
                      }
                    });

                    // When a new SW is found and installed, reload to get fresh content
                    registration.addEventListener('updatefound', function() {
                      var newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                            console.log('New SW activated, reloading for fresh content');
                            window.location.reload();
                          }
                        });
                      }
                    });
                  },
                  function(err) {
                    console.log('SW registration failed:', err);
                  }
                );

                // Also reload if a new SW takes control (skipWaiting + clientsClaim)
                var refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  if (!refreshing) {
                    refreshing = true;
                    console.log('New SW controller, reloading');
                    window.location.reload();
                  }
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
