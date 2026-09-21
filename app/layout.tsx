import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'sonner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://coachhimanshu.com'),
  title: {
    default: 'Coach Himanshu | NASM Certified Online Fitness Coach & Personal Trainer India',
    template: '%s | Coach Himanshu',
  },
  description: 'Transform your body with NASM Certified Fitness Coach Himanshu. Get personalized online workout plans, custom meal plans, WhatsApp support & expert nutrition guidance — delivered online to clients in India and worldwide. 1000+ transformations. Affordable coaching starting at ₹1,299/month.',
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
    alternateLocale: ['en_US', 'en_GB', 'en_CA', 'en_AU', 'en_AE', 'en_SG'],
    url: 'https://coachhimanshu.com',
    title: 'Coach Himanshu | NASM Certified Online Fitness Coach — India & Worldwide',
    description: 'Transform your fitness journey with NASM Certified Coach. Personalized workout & meal plans, dedicated support, delivered online anywhere in the world. 1000+ success stories. Start from ₹1,299/month.',
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
    description: 'Transform your fitness with personalized coaching. 1000+ transformations. Start at ₹1,299/month.',
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
    languages: {
      'en': 'https://coachhimanshu.com',
      'en-IN': 'https://coachhimanshu.com',
      'x-default': 'https://coachhimanshu.com',
    },
  },
  // Renders <meta name="google-site-verification"> only once the code is set in
  // the deploy env. Get it from Search Console → Settings → Ownership → HTML tag.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#175FFF" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Exercise video host — warm the connection early so the ScreenPal
            player iframe loads faster (notably in Safari). */}
        <link rel="dns-prefetch" href="https://go.screenpal.com" />
        <link rel="preconnect" href="https://go.screenpal.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Coach Himanshu" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <meta name="language" content="English" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="3 days" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="classification" content="Health & Fitness" />
        <link rel="alternate" type="application/rss+xml" title="Coach Himanshu Blog" href="/feed.xml" />

        {/* Organization Schema - Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://coachhimanshu.com/#organization",
              "name": "Coach Himanshu",
              "alternateName": "Coach H",
              "url": "https://coachhimanshu.com",
              "logo": "https://coachhimanshu.com/favicon.png",
              "description": "NASM Certified Online Fitness Coach providing personalized workout plans, custom meal plans, and expert nutrition guidance to clients worldwide. 1000+ transformations across India and around the world — coaching delivered online to any country.",
              "foundingDate": "2020",
              "founder": {
                "@type": "Person",
                "@id": "https://coachhimanshu.com/#coach",
                "name": "Coach Himanshu",
                "jobTitle": "NASM Certified Fitness Coach",
                "url": "https://coachhimanshu.com/about"
              },
              "sameAs": [
                "https://www.instagram.com/coach_himanshu_/",
                "https://www.youtube.com/@CoachHimanshu"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"],
                "url": "https://coachhimanshu.com/contact"
              },
              "areaServed": {
                "@type": "Place",
                "name": "Worldwide"
              },
              "knowsAbout": [
                "Online Personal Training",
                "Nutrition Coaching",
                "Weight Loss",
                "Muscle Building",
                "Home Workouts",
                "Rehabilitation"
              ]
            })
          }}
        />

        {/* WebSite Schema - Google Sitelinks Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Coach Himanshu",
              "alternateName": "Coach H Fitness",
              "url": "https://coachhimanshu.com",
              "description": "NASM Certified Online Fitness Coach - Personalized Workout Plans, Custom Meal Plans, Expert Nutrition Guidance",
              "inLanguage": ["en-IN", "en"],
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://coachhimanshu.com/blog?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@id": "https://coachhimanshu.com/#organization"
              }
            })
          }}
        />

        {/* Service Schema - Core Business Offering */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Online Fitness Coaching",
              "provider": {
                "@id": "https://coachhimanshu.com/#organization"
              },
              "serviceType": "Online Personal Training & Nutrition Coaching",
              "description": "Personalized online fitness coaching including custom workout plans, meal plans, supplement guidance, 24/7 WhatsApp support, and weekly consultations by an NASM Certified Coach. Delivered 100% online to clients in any country, with sessions scheduled across all time zones.",
              "areaServed": {
                "@type": "Place",
                "name": "Worldwide"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Fitness enthusiasts, beginners, athletes, rehabilitation clients worldwide"
              },
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://coachhimanshu.com/assessment",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />

      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <PWAInstallPrompt />
          <WhatsAppButton />
        </CartProvider>
        <Toaster position="top-center" richColors theme="dark" />

        {/* Google Analytics 4 — loaded after page is fully interactive */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
              `}
            </Script>
          </>
        )}

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
                    var swInterval = setInterval(function() { registration.update(); }, 15 * 60 * 1000);

                    // Clean up interval when page is hidden/unloaded to prevent memory leak
                    document.addEventListener('visibilitychange', function() {
                      if (document.hidden) {
                        clearInterval(swInterval);
                      } else {
                        registration.update();
                        swInterval = setInterval(function() { registration.update(); }, 15 * 60 * 1000);
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
