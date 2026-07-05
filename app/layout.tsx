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
    languages: {
      'en-IN': 'https://coachhimanshu.com',
      'x-default': 'https://coachhimanshu.com',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#175FFF" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
              "name": "Coach Himanshu",
              "alternateName": "Coach H",
              "url": "https://coachhimanshu.com",
              "logo": "https://coachhimanshu.com/favicon.png",
              "description": "NASM Certified Online Fitness Coach providing personalized workout plans, custom Indian meal plans, and expert nutrition guidance. 1000+ client transformations across India and internationally.",
              "foundingDate": "2020",
              "founder": {
                "@type": "Person",
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
              "areaServed": [
                { "@type": "Country", "name": "India" },
                { "@type": "Country", "name": "United States" },
                { "@type": "Country", "name": "United Kingdom" },
                { "@type": "Country", "name": "Canada" },
                { "@type": "Country", "name": "Australia" },
                { "@type": "Country", "name": "United Arab Emirates" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Online Fitness Coaching Plans",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Home Workout Plan" },
                    "price": "799",
                    "priceCurrency": "INR",
                    "priceValidUntil": "2027-12-31"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Gym Kickstart Plan" },
                    "price": "1099",
                    "priceCurrency": "INR",
                    "priceValidUntil": "2027-12-31"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Rehabilitation Plan" },
                    "price": "1499",
                    "priceCurrency": "INR",
                    "priceValidUntil": "2027-12-31"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Live 1-on-1 Training (12 Sessions)" },
                    "price": "5999",
                    "priceCurrency": "INR",
                    "priceValidUntil": "2027-12-31"
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000",
                "bestRating": "5",
                "worstRating": "1"
              }
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
                "@type": "Organization",
                "name": "Coach Himanshu",
                "url": "https://coachhimanshu.com"
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
                "@type": "Organization",
                "name": "Coach Himanshu",
                "url": "https://coachhimanshu.com"
              },
              "serviceType": "Online Personal Training & Nutrition Coaching",
              "description": "Personalized online fitness coaching including custom workout plans, Indian meal plans, supplement guidance, 24/7 WhatsApp support, and weekly consultations by NASM Certified Coach.",
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "20.5937",
                  "longitude": "78.9629"
                },
                "geoRadius": "10000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Coaching Plans",
                "itemListElement": [
                  { "@type": "Offer", "name": "Home Workout Plan", "price": "799", "priceCurrency": "INR" },
                  { "@type": "Offer", "name": "Gym Kickstart Plan", "price": "1099", "priceCurrency": "INR" },
                  { "@type": "Offer", "name": "Rehabilitation Plan", "price": "1499", "priceCurrency": "INR" },
                  { "@type": "Offer", "name": "Live 1-on-1 Training", "price": "5999", "priceCurrency": "INR" }
                ]
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Fitness enthusiasts, beginners, athletes, rehabilitation clients"
              },
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://coachhimanshu.com/assessment",
                "serviceSmsNumber": "+91",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />

        {/* ProfessionalService Schema - Google Business Profile */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Coach Himanshu - Online Fitness Coaching",
              "image": "https://coachhimanshu.com/opengraph-image",
              "url": "https://coachhimanshu.com",
              "telephone": "",
              "priceRange": "₹799 - ₹29,999",
              "description": "NASM Certified online fitness coach providing personalized workout plans, custom Indian meal plans, 24/7 WhatsApp support, and weekly consultations. Serving clients across India and internationally.",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "20.5937",
                "longitude": "78.9629"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceArea": [
                { "@type": "City", "name": "Mumbai" },
                { "@type": "City", "name": "Delhi" },
                { "@type": "City", "name": "Bangalore" },
                { "@type": "City", "name": "Hyderabad" },
                { "@type": "City", "name": "Chennai" },
                { "@type": "City", "name": "Pune" },
                { "@type": "City", "name": "Kolkata" },
                { "@type": "City", "name": "Ahmedabad" }
              ],
              "knowsLanguage": ["English", "Hindi"],
              "paymentAccepted": ["UPI", "Credit Card", "Debit Card", "Net Banking"],
              "currenciesAccepted": "INR",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "sameAs": [
                "https://www.instagram.com/coach_himanshu_/",
                "https://www.youtube.com/@CoachHimanshu"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Fitness Coaching Plans",
                "itemListElement": [
                  { "@type": "Offer", "name": "Home Workout Plan", "price": "799", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                  { "@type": "Offer", "name": "Gym Kickstart Plan", "price": "1099", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                  { "@type": "Offer", "name": "Rehabilitation Plan", "price": "1499", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                  { "@type": "Offer", "name": "Live 1-on-1 Training", "price": "5999", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }
                ]
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
