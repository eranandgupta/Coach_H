'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Target,
  TrendingUp,
  Award,
  Users,
  ShoppingBag,
  Sparkles,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Apple,
  Activity,
  HeartPulse,
  Trophy,
  GraduationCap,
  Home as HomeIcon,
  Flame,
  Clock,
  Leaf,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import PlanCard from '@/components/PlanCard';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/contexts/CartContext';

const CheckoutDrawer = dynamic(() => import('@/components/CheckoutDrawer'), { ssr: false });
const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Home() {
  const { addToCart } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [dbPlanIds, setDbPlanIds] = useState<Record<string, number>>({});
  const [activePlanTab, setActivePlanTab] = useState<'gym' | 'home' | 'rehab' | 'live'>('gym');
  const [saleSlide, setSaleSlide] = useState(0);

  // Determine which sale is active based on current date
  const activeSale = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed, June = 5
    const day = now.getDate();
    if (month !== 5) return null; // Only June

    const commonOffers = [
      { label: '3M Gym Plan', off: '10% OFF' },
      { label: '3M Home Plan', off: '10% OFF' },
      { label: '3M Rehab Plan', off: '10% OFF' },
      { label: '6M Gym Plan', off: '12% OFF' },
      { label: '12M Gym Plan', off: '15% OFF' },
      { label: '12 Sessions', off: '10% OFF' },
      { label: '24 Sessions', off: '10% OFF' },
      { label: '36 Sessions', off: '20% OFF' },
      { label: '72 Sessions', off: '20% OFF' },
    ];

    if (day >= 1 && day <= 7) {
      return {
        theme: 'environment' as const,
        title: 'WORLD ENVIRONMENT DAY SALE 🌿',
        subtitle: 'Valid June 1 - 7 Only',
        endDate: 'June 7, 2026',
        offers: commonOffers,
        specials: null,
      };
    }
    if (day >= 21 && day <= 30) {
      const isJune21 = day === 21;
      return {
        theme: 'yoga' as const,
        title: 'WORLD YOGA DAY & FATHER\'S DAY SALE 🧘',
        subtitle: 'Valid June 21 - 30 Only',
        endDate: 'June 30, 2026',
        offers: commonOffers,
        specials: null,
      };
    }
    return null;
  }, []);

  // Returns the sale discount percentage for a plan, or 0 if no sale applies
  const getSalePercent = (plan: { duration: string; dbName: string; homeWorkout?: boolean; rehabilitation?: boolean; liveOneOnOne?: boolean }) => {
    if (!activeSale) return 0;
    const d = plan.duration.toLowerCase();
    const name = plan.dbName.toLowerCase();
    // Elite 1:1 sessions
    if (plan.liveOneOnOne || name.includes('elite')) {
      if (name.includes('12 sessions')) return 10;
      if (name.includes('24 sessions')) return 10;
      if (name.includes('36 sessions')) return 20;
      if (name.includes('72 sessions')) return 20;
      return 0;
    }
    // 3-month gym, home & rehab plans (including couple variants)
    if (d === '3 months' && !name.includes('elite')) return 10;
    // 6-month gym plans (including couple)
    if (d === '6 months') return 12;
    // 12-month gym plans (including couple)
    if (d === '12 months') return 15;
    return 0;
  };

  const totalSaleSlides = activeSale?.specials ? 3 : activeSale ? 2 : 0;

  useEffect(() => {
    if (totalSaleSlides === 0) return;
    const timer = setInterval(() => {
      setSaleSlide((prev) => (prev + 1) % totalSaleSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSaleSlides]);

  // Fetch real plan IDs from DB so payments always use the correct ID
  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, number> = {};
        data.plans?.forEach((p: { id: number; name: string }) => {
          map[p.name] = p.id;
        });
        setDbPlanIds(map);
      })
      .catch(() => {}); // fallback to hardcoded ids if fetch fails
  }, []);

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://coachhimanshu.com/#coach',
        name: 'Coach Himanshu',
        url: 'https://coachhimanshu.com',
        image: {
          '@type': 'ImageObject',
          url: 'https://coachhimanshu.com/coach-himanshu.jpg',
          width: 800,
          height: 800,
        },
        jobTitle: 'NASM Certified Fitness Coach',
        description: 'NASM Certified Bodybuilding Coach with 6+ professional diplomas in fitness science, nutrition, and specialized training',
        knowsAbout: [
          'Personal Training',
          'Nutrition Planning',
          'Bodybuilding',
          'Weight Loss',
          'Muscle Building',
          'Sports Nutrition',
          'TRX Training',
        ],
        sameAs: [
          'https://www.instagram.com/coach_himanshu_',
          'https://www.youtube.com/@coachhimanshu',
        ],
        alumniOf: {
          '@type': 'Organization',
          name: 'National Academy of Sports Medicine (NASM)',
          url: 'https://www.nasm.org',
        },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certification',
            name: 'NASM Certified Bodybuilding Coach',
            recognizedBy: {
              '@type': 'Organization',
              name: 'National Academy of Sports Medicine',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Diploma',
            name: 'Diploma in Personal Training',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Diploma',
            name: 'Diploma in Sports Nutrition',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certification',
            name: 'Corrective Exercise Specialist (CES)',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certification',
            name: 'Sports Nutrition Specialist',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certification',
            name: 'TRX Suspension Training Certified',
          },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://coachhimanshu.com/#service',
        name: 'Coach Himanshu Fitness Coaching',
        image: 'https://coachhimanshu.com/logo.png',
        url: 'https://coachhimanshu.com',
        telephone: '+91-7303484648',
        priceRange: '₹999-₹29999',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
          addressLocality: 'India',
        },
        geo: {
          '@type': 'GeoCoordinates',
          addressCountry: 'IN',
        },
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        availableLanguage: ['English', 'Hindi'],
        description: 'Online fitness coaching services providing personalized workout plans, nutrition guidance, and dedicated support',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: '999',
          highPrice: '29999',
          offerCount: '7',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1000',
          bestRating: '5',
          worstRating: '1',
        },
        serviceType: [
          'Online Personal Training',
          'Nutrition Coaching',
          'Fitness Consultation',
          'Workout Planning',
          'Diet Planning',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://coachhimanshu.com/#website',
        url: 'https://coachhimanshu.com',
        name: 'Coach Himanshu',
        description: 'NASM Certified Online Fitness Coach & Personal Trainer India',
        publisher: {
          '@id': 'https://coachhimanshu.com/#coach',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://coachhimanshu.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://coachhimanshu.com/#plans',
        itemListElement: [
          {
            '@type': 'Offer',
            position: 1,
            name: 'Kickstart Plan',
            description: 'Monthly fitness coaching plan with personalized workout and meal plans',
            price: '1099',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 2,
            name: 'Consistency Plan',
            description: '3 months fitness coaching with comprehensive support',
            price: '2499',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 3,
            name: 'Strength Plan',
            description: '6 months intensive fitness transformation program with FREE RhynoGrip fitness gear',
            price: '4299',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 4,
            name: 'Mastery Plan',
            description: '12 months comprehensive fitness mastery program with FREE RhynoGrip fitness gear',
            price: '8999',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 5,
            name: 'Rehabilitation Plan',
            description: '3 months rehabilitation and injury recovery program with personalized exercises',
            price: '2999',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 6,
            name: 'Home Workout Plan',
            description: '3 months home workout plan — no gym or equipment needed',
            price: '2199',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
        ],
      },
    ],
  };

  // FAQ Schema for rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does online fitness coaching with Coach Himanshu work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once you subscribe to a plan, you receive a customised workout plan and personalised diet plan on WhatsApp. You get weekly one-on-one consultations, video tutorials for exercises, supplement guidance, and 24/7 WhatsApp support from Coach Himanshu.',
        },
      },
      {
        '@type': 'Question',
        name: 'What certifications does Coach Himanshu have?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coach Himanshu is a NASM Certified Bodybuilding Coach with 6+ professional diplomas including Diploma in Personal Training, Diploma in Sports Nutrition, and certifications in TRX training and rehabilitation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the cost of online fitness coaching in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coach Himanshu offers affordable plans starting at just ₹1,099/month for the Kickstart Plan. The Consistency Plan is ₹2,499 for 3 months, the Strength Plan is ₹4,299 for 6 months, and the Mastery Plan is ₹8,999 for 12 months. Home workout and rehabilitation plans are also available.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a gym to follow Coach Himanshu\'s workout plans?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No! Coach Himanshu offers dedicated Home Workout Plans that require no gym or equipment. You can train from home with bodyweight exercises and minimal equipment. Gym plans are also available for those who prefer working out at a gym.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get a personalised diet plan for Indian food?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all diet plans are personalised based on your goals, preferences, and Indian food habits. Whether you are vegetarian, non-vegetarian, or vegan, Coach Himanshu creates meal plans using Indian foods you actually enjoy eating.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many clients has Coach Himanshu trained?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coach Himanshu has successfully helped 1000+ clients achieve their fitness transformations. From fat loss and muscle building to rehabilitation and sports performance, clients across India have benefited from his personalised coaching approach.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who is the best online fitness coach in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coach Himanshu is one of India\'s top-rated online fitness coaches with NASM certification, 6+ professional diplomas, and 1000+ successful client transformations. He offers personalised workout and nutrition plans starting at just ₹799/month with dedicated WhatsApp support.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does online personal training cost in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Online personal training in India typically ranges from ₹2,000 to ₹30,000 per month. Coach Himanshu offers affordable plans starting at ₹799/month for home workouts and ₹1,099/month for gym plans, making professional coaching accessible to everyone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I build muscle at home without gym equipment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can build muscle at home without gym equipment. Coach Himanshu\'s Home Workout Plans use bodyweight exercises, resistance band routines, and progressive overload techniques to help you gain strength and muscle from home. Many clients have achieved significant transformations with home-only training.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is online coaching effective compared to a gym trainer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Online coaching can be more effective than a traditional gym trainer because you get a fully personalised plan, daily support via WhatsApp, weekly consultations, and expert nutrition guidance — all at a fraction of the cost. Coach Himanshu\'s 1000+ transformations prove that online coaching delivers real, measurable results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What results can I expect in 3 months of online coaching?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'With consistent effort and Coach Himanshu\'s guidance, clients typically lose 8-15 kg of fat or gain 3-5 kg of lean muscle in 3 months. Results vary based on your starting point, consistency, and adherence to the workout and nutrition plan. Weekly check-ins ensure your plan is adjusted for continuous progress.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Coach Himanshu provide vegetarian meal plans?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Coach Himanshu creates fully customised vegetarian, vegan, and eggetarian meal plans using Indian foods. Plans are designed around locally available ingredients you enjoy eating, ensuring high protein intake and proper nutrition without compromising on taste or cultural preferences.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens after I subscribe to a plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'After subscribing, you receive a detailed fitness assessment form. Based on your goals, body type, and preferences, Coach Himanshu creates your personalised workout plan and meal plan within 24 hours. You get added to WhatsApp for daily support, receive video tutorials for all exercises, and have weekly one-on-one consultations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Coach Himanshu offer a refund policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Coach Himanshu offers a transparent refund policy. If you are unsatisfied with the coaching within the initial period, you can request a refund. Full details are available on the refund policy page at coachhimanshu.com/refund-policy.',
        },
      },
    ],
  };

  // Review Schema for testimonials (AEO - rich review snippets)
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Coach Himanshu Fitness Coaching',
    url: 'https://coachhimanshu.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        datePublished: '2025-01-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Lost 22kg in 6 months with Coach Himanshu\'s personalised plan! The WhatsApp support and weekly consultations kept me motivated throughout. Best investment in my health ever!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Amit Kumar' },
        datePublished: '2025-02-20',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'As a software engineer with a sedentary lifestyle, Coach Himanshu designed a perfect plan that fits my schedule. Gained 8kg lean muscle in 4 months. Highly recommend!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Kavita Patel' },
        datePublished: '2025-03-10',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Being a Gujarati foodie, I thought I could never lose weight. Coach Himanshu incorporated my favorite foods into the plan. Lost 14kg without feeling deprived. Amazing!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rohan Deshmukh' },
        datePublished: '2025-04-05',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Online coaching done right! Despite being in different cities, Coach Himanshu\'s guidance felt personal. Video calls and constant support made all the difference. Lost 16kg in 5 months!',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Divya Sharma' },
        datePublished: '2025-05-12',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Lost 15kg and my PCOS symptoms improved significantly. The weekly consultations are so valuable! He adjusts my plan based on progress. Thank you Coach for changing my life!',
      },
    ],
  };

  // HowTo Schema - How online coaching works (AEO - step-by-step rich snippets)
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Start Online Fitness Coaching with Coach Himanshu',
    description: 'A step-by-step guide to starting your fitness transformation with Coach Himanshu\'s personalised online coaching program.',
    totalTime: 'P1D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '1099',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Take the Free Fitness Assessment',
        text: 'Fill out the free fitness assessment form at coachhimanshu.com/assessment. Share your current fitness level, goals, medical history, dietary preferences, and available equipment.',
        url: 'https://coachhimanshu.com/assessment',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose Your Plan',
        text: 'Select a coaching plan that fits your goals and budget — Gym Plans (₹1,099-₹8,999), Home Workout Plans (₹799-₹3,499), Rehabilitation Plans, or Live 1-on-1 Session packages.',
        url: 'https://coachhimanshu.com/#plans',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Receive Your Personalised Plan',
        text: 'Within 24 hours of subscribing, receive your fully customised workout plan and meal plan on WhatsApp. Includes exercise video tutorials, macro calculations, and meal timing guidance.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Start Training with Daily Support',
        text: 'Begin your training with 24/7 WhatsApp support from Coach Himanshu. Get form checks via video, ask questions anytime, and receive weekly one-on-one consultations to track progress.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Track Progress and Adjust',
        text: 'Your plan is adjusted weekly based on your progress, feedback, and results. Coach Himanshu monitors your transformation and modifies workouts and nutrition to ensure continuous improvement.',
      },
    ],
  };

  // VideoObject Schema (AEO - video rich results)
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Coach Himanshu - Online Fitness Coaching Introduction',
    description: 'Meet Coach Himanshu — NASM Certified fitness coach offering personalised online workout plans, custom meal plans, and dedicated support for your fitness transformation.',
    thumbnailUrl: 'https://coachhimanshu.com/opengraph-image',
    uploadDate: '2024-01-01',
    contentUrl: 'https://coachhimanshu.com/intro2.mp4',
    embedUrl: 'https://coachhimanshu.com',
    publisher: {
      '@type': 'Organization',
      name: 'Coach Himanshu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://coachhimanshu.com/favicon.png',
      },
    },
  };

  // Speakable Schema (AEO - voice assistant optimization)
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Coach Himanshu - Online Fitness Coach India',
    url: 'https://coachhimanshu.com',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        'h1',
        '[aria-label="Hero section"] p',
        '[aria-label="Frequently asked questions"] summary',
      ],
    },
    mainEntity: {
      '@id': 'https://coachhimanshu.com/#coach',
    },
  };

  // Course Schema (AEO - coaching plans as educational programs)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Coach Himanshu Fitness Programs',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Course',
          name: 'Kickstart Fitness Program',
          description: '1-month personalised gym workout plan with custom meal plan, exercise video tutorials, and 24/7 WhatsApp support from a NASM Certified Coach.',
          provider: { '@type': 'Organization', name: 'Coach Himanshu', url: 'https://coachhimanshu.com' },
          offers: { '@type': 'Offer', price: '1099', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: 'P1M', instructor: { '@type': 'Person', name: 'Coach Himanshu' } },
          educationalLevel: 'Beginner',
          inLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Course',
          name: 'Consistency Fitness Program',
          description: '3-month comprehensive fitness coaching program with personalised workouts, nutrition planning, weekly consultations, and dedicated WhatsApp support.',
          provider: { '@type': 'Organization', name: 'Coach Himanshu', url: 'https://coachhimanshu.com' },
          offers: { '@type': 'Offer', price: '2499', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: 'P3M', instructor: { '@type': 'Person', name: 'Coach Himanshu' } },
          educationalLevel: 'Beginner',
          inLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Course',
          name: 'Mastery Fitness Program',
          description: '12-month comprehensive fitness mastery program with periodised training, advanced nutrition, supplement guidance, and FREE RhynoGrip fitness gear.',
          provider: { '@type': 'Organization', name: 'Coach Himanshu', url: 'https://coachhimanshu.com' },
          offers: { '@type': 'Offer', price: '8999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: 'P12M', instructor: { '@type': 'Person', name: 'Coach Himanshu' } },
          educationalLevel: 'Intermediate',
          inLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Course',
          name: 'Home Workout Program',
          description: 'Complete home workout program requiring no gym or equipment. Bodyweight exercises, resistance band routines, and progressive overload training with personalised nutrition.',
          provider: { '@type': 'Organization', name: 'Coach Himanshu', url: 'https://coachhimanshu.com' },
          offers: { '@type': 'Offer', price: '799', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: 'P1M', instructor: { '@type': 'Person', name: 'Coach Himanshu' } },
          educationalLevel: 'Beginner',
          inLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Course',
          name: 'Rehabilitation & Corrective Exercise Program',
          description: 'Specialised rehabilitation program based on NASM Corrective Exercise Continuum for injury recovery, posture correction, and pain management.',
          provider: { '@type': 'Organization', name: 'Coach Himanshu', url: 'https://coachhimanshu.com' },
          offers: { '@type': 'Offer', price: '1499', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: 'P1M', instructor: { '@type': 'Person', name: 'Coach Himanshu' } },
          educationalLevel: 'Beginner',
          inLanguage: ['en', 'hi'],
        },
      },
    ],
  };

  // DefinedTermSet Schema (GEO - fitness glossary for AI knowledge)
  const glossarySchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Fitness Coaching Terminology',
    description: 'Key fitness and coaching terms explained by NASM Certified Coach Himanshu',
    url: 'https://coachhimanshu.com',
    hasDefinedTerm: [
      {
        '@type': 'DefinedTerm',
        name: 'Progressive Overload',
        description: 'The gradual increase of stress placed on the body during exercise training. This is achieved by increasing weight, reps, sets, or decreasing rest periods over time to continually challenge muscles and drive adaptation.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'NASM OPT Model',
        description: 'The Optimum Performance Training model developed by NASM. A systematic, progressive training program consisting of 5 phases: Stabilization Endurance, Strength Endurance, Muscular Development, Maximal Strength, and Power.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Macronutrients',
        description: 'The three main nutrients the body needs in large quantities: protein (for muscle repair), carbohydrates (for energy), and fats (for hormones and cell function). A balanced macro split is essential for fitness goals.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Body Recomposition',
        description: 'The process of simultaneously losing fat and gaining muscle. Achieved through a combination of resistance training, adequate protein intake, and a slight caloric deficit or maintenance calories.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Corrective Exercise',
        description: 'A systematic process of identifying and addressing muscle imbalances, postural deviations, and movement compensations through specific exercises. Based on NASM\'s Corrective Exercise Continuum: Inhibit, Lengthen, Activate, Integrate.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'NEAT',
        description: 'Non-Exercise Activity Thermogenesis. Calories burned through daily activities that are not structured exercise — walking, cleaning, cooking, fidgeting. NEAT accounts for 15-30% of daily calorie burn and is a powerful weight management tool.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Caloric Deficit',
        description: 'Consuming fewer calories than your body burns, causing it to use stored fat for energy. A safe deficit of 400-500 calories per day leads to sustainable fat loss of 0.5-1 kg per week without muscle loss.',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Periodisation',
        description: 'The systematic planning of training into phases to optimize performance and prevent overtraining. Includes macrocycles (yearly), mesocycles (monthly), and microcycles (weekly) with varying intensity and volume.',
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://coachhimanshu.com',
      },
    ],
  };

  const plans = [
    {
      id: 8,
      dbName: 'Kickstart Plan',
      title: 'Kickstart Plan',
      duration: 'Month',
      price: '₹1,099',
      priceValue: 1099,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Gym workout video tutorial',
        'One on one consultation weekly (4/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
      ],
    },
    {
      id: 9,
      dbName: 'Consistency Plan',
      title: 'Consistency Plan',
      duration: '3 Months',
      price: '₹2,499',
      priceValue: 2499,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Gym workout video tutorial',
        'One on one consultation weekly (4/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
      ],
      popular: true,
    },
    {
      id: 10,
      dbName: 'Strength Plan',
      title: 'Strength Plan',
      duration: '6 Months',
      price: '₹4,299',
      priceValue: 4299,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Gym workout video tutorial',
        'One on one consultation weekly (6/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '⏸️ Pause option (7 days)',
        '📋 Free Habit Tracker',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
    },
    {
      id: 11,
      dbName: 'Mastery Plan',
      title: 'Mastery Plan',
      duration: '12 Months',
      price: '₹8,999',
      priceValue: 8999,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Full video library (gym, home, rehab)',
        'One on one consultation weekly (6/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '⏸️ Pause option (15 days)',
        '📋 Free Habit Tracker',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
    },
    {
      id: 15,
      dbName: 'Rehabilitation Plan',
      title: 'Rehabilitation',
      duration: '3 Months',
      price: '₹2,999',
      priceValue: 2999,
      description: 'Recovery & Healing',
      features: [
        'Customised rehabilitation workout',
        'Rehabilitation workout video tutorial',
        'One-on-one consultation twice a month',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
      ],
      rehabilitation: true,
    },
    {
      id: 19,
      dbName: 'Couple Rehabilitation Plan',
      title: 'Couple Rehabilitation',
      duration: '3 Months',
      price: '₹5,299',
      priceValue: 5299,
      description: 'For 2 People',
      features: [
        'Customised rehabilitation workouts for both',
        'Rehabilitation workout video tutorial',
        'One-on-one consultation twice a month',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
        '💑 Recover Together, Grow Together',
      ],
      rehabilitation: true,
      couple: true,
    },
    {
      id: 14,
      dbName: 'Home Workout',
      title: 'Home Workout',
      duration: '3 Months',
      price: '₹2,199',
      priceValue: 2199,
      description: 'Home Workout',
      features: [
        'Customised home workout plan',
        'Personalised diet plan',
        'Home workout video tutorial',
        'One on one consultation twice a month',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
      ],
      homeWorkout: true,
    },
    {
      id: 18,
      dbName: 'Couple Home Workout Plan',
      title: 'Couple Home Workout',
      duration: '3 Months',
      price: '₹3,799',
      priceValue: 3799,
      description: 'For 2 People',
      features: [
        'Customised home workout plans for both',
        'Personalised diet plans for both',
        'Home workout video tutorial',
        'One on one consultation twice a month',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle guidance',
        '📋 Free Habit Tracker',
        '💑 Train Together, Grow Together',
      ],
      homeWorkout: true,
      couple: true,
    },
    {
      id: 12,
      dbName: 'Couple Strength',
      title: 'Couple Strength',
      duration: '6 Months',
      price: '₹7,999',
      priceValue: 7999,
      description: 'For 2 People',
      features: [
        'Personalized workout plans for both',
        'Customized meal plans for both',
        'Gym workout video tutorial',
        'One on one consultation weekly (6/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
        '⏸️ Pause option (7 days)',
        '📋 Free Habit Tracker',
        '💑 Train Together, Grow Together',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      couple: true,
    },
    {
      id: 13,
      dbName: 'Couple Mastery',
      title: 'Couple Mastery',
      duration: '12 Months',
      price: '₹15,999',
      priceValue: 15999,
      description: 'For 2 People',
      features: [
        'Personalized workout plans for both',
        'Customized meal plans for both',
        'Full video library (gym, home, rehab)',
        'One on one consultation weekly (6/month)',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
        '⏸️ Pause option (15 days)',
        '📋 Free Habit Tracker',
        '💑 Train Together, Grow Together',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      couple: true,
    },
    {
      id: 16,
      dbName: 'She Strong Program',
      title: 'SHE STRONG PROGRAM',
      duration: 'Month',
      price: '₹999',
      priceValue: 999,
      description: 'For Housewives Below 50 · Just ₹124/session',
      features: [
        'Monday & Wednesday classes',
        '60 min per session',
        'WhatsApp support',
        'HIIT & Bodyweight training',
        'Focus: fat loss, endurance, heart & lungs health',
        'No equipment needed',
        'Max 10 members per group',
      ],
      liveGroup: true,
    },
    {
      id: 17,
      dbName: 'Active Parents Program',
      title: 'ACTIVE PARENTS PROGRAM',
      duration: 'Month',
      price: '₹999',
      priceValue: 999,
      description: 'For Adults 50+ (Men & Women) · Just ₹124/session',
      features: [
        'Tuesday & Thursday classes',
        '60 min per session',
        'WhatsApp support',
        'Bodyweight training',
        'Focus: Joints & muscle strengthening, balancing & coordination',
        'No equipment needed',
        'Max 10 members per group',
      ],
      liveGroup: true,
    },
    {
      id: 18,
      dbName: 'Elite 1:1 - 1 Month (24 Sessions)',
      title: 'ONE-ON-ONE ELITE COACHING',
      duration: 'Month',
      price: '₹11,999',
      priceValue: 11999,
      description: '24 Sessions · Just ₹499/session',
      features: [
        'Live 1:1 personal training',
        'Personalised diet plan',
        '60 min per session',
        'Supplement guidance',
        'Lifestyle guidance',
        'WhatsApp support',
        'Full video library access',
        '📋 Free Habit Tracker',
      ],
      liveGroup: true,
      liveOneOnOne: true,
    },
    {
      id: 19,
      dbName: 'Elite 1:1 - 1 Month (12 Sessions)',
      title: 'ONE-ON-ONE ELITE COACHING',
      duration: 'Month',
      price: '₹7,499',
      priceValue: 7499,
      description: '12 Sessions · Just ₹624/session',
      features: [
        'Live 1:1 personal training',
        'Personalised diet plan',
        '60 min per session',
        'Supplement guidance',
        'Lifestyle guidance',
        'WhatsApp support',
        'Full video library access',
        '📋 Free Habit Tracker',
      ],
      liveGroup: true,
      liveOneOnOne: true,
    },
    {
      id: 20,
      dbName: 'Elite 1:1 - 3 Months (72 Sessions)',
      title: 'ONE-ON-ONE ELITE COACHING',
      duration: '3 Months',
      price: '₹29,999',
      priceValue: 29999,
      description: '72 Sessions · Just ₹416/session',
      features: [
        'Live 1:1 personal training',
        'Personalised diet plan',
        '60 min per session',
        'Supplement guidance',
        'Lifestyle guidance',
        'WhatsApp support',
        'Full video library access',
        '⏸️ Pause option (7 days)',
        '📋 Free Habit Tracker',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      liveGroup: true,
      liveOneOnOne: true,
      popular: true,
    },
    {
      id: 21,
      dbName: 'Elite 1:1 - 3 Months (36 Sessions)',
      title: 'ONE-ON-ONE ELITE COACHING',
      duration: '3 Months',
      price: '₹18,999',
      priceValue: 18999,
      description: '36 Sessions · Just ₹527/session',
      features: [
        'Live 1:1 personal training',
        'Personalised diet plan',
        '60 min per session',
        'Supplement guidance',
        'Lifestyle guidance',
        'WhatsApp support',
        'Full video library access',
        '⏸️ Pause option (7 days)',
        '📋 Free Habit Tracker',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      liveGroup: true,
      liveOneOnOne: true,
    },
  ];

  const stats = [
    { value: '1000+', label: 'Clients Transformed', icon: Users },
    { value: '6+', label: 'Years Experience', icon: Award },
    { value: '95%', label: 'Commitment to Results', icon: TrendingUp },
  ];

  const features = [
    {
      icon: Award,
      title: 'Certified Expertise',
      description: 'NASM Certified with 6+ professional diplomas in fitness science, nutrition, and specialized training',
      image: 'https://ik.imagekit.io/oeagl0l4x/public/CH11.jpeg?tr=w-600,h-400,q-80,f-auto',
      imagePosition: 'object-top',
    },
    {
      icon: Target,
      title: 'Science-Backed Approach',
      description: 'Evidence-based training methods focused on sustainable results, not shortcuts',
      image: 'https://ik.imagekit.io/oeagl0l4x/public/CH2.jpeg?tr=w-600,h-400,q-80,f-auto',
      imagePosition: 'object-[center_20%]',
    },
    {
      icon: Users,
      title: 'Proven Track Record',
      description: 'Former fitness educator and lecturer with hundreds of successful client transformations',
      image: 'https://ik.imagekit.io/oeagl0l4x/public/CH4.jpeg?tr=w-600,h-400,q-80,f-auto',
      imagePosition: 'object-top',
    },
  ];

  const testimonials = [
    // Delhi clients (15)
    {
      name: 'Rahul Sharma',
      location: 'Dwarka, Delhi',
      rating: 5,
      review: 'Coach Himanshu transformed my life! Lost 18kg in 5 months with his personalized diet and workout plans. His 24/7 WhatsApp support kept me motivated throughout. Best investment in my health!',
      transformation: 'Lost 18kg in 5 months',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Priya Verma',
      location: 'Rohini, Delhi',
      rating: 5,
      review: 'As a working woman, I struggled to find time for fitness. Coach Himanshu designed home workouts that fit my schedule perfectly. Down from 72kg to 58kg in 6 months! His nutrition guidance is top-notch.',
      transformation: 'Lost 14kg in 6 months',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Amit Kumar',
      location: 'Janakpuri, Delhi',
      rating: 5,
      review: 'The NASM certification really shows in his approach. Scientific, evidence-based training with no shortcuts. Gained 8kg lean muscle and my strength has doubled. Highly recommend!',
      transformation: 'Gained 8kg muscle',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Sneha Gupta',
      location: 'Pitampura, Delhi',
      rating: 5,
      review: 'After my pregnancy, I thought I\'d never get back in shape. Coach Himanshu\'s special population training expertise helped me safely lose 22kg. He\'s patient, knowledgeable, and genuinely cares!',
      transformation: 'Lost 22kg postpartum',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Vikram Singh',
      location: 'Saket, Delhi',
      rating: 5,
      review: 'Been training with Coach Himanshu for over a year. His meal plans are flexible and sustainable - no crash diets! From 95kg to 78kg and maintaining it easily. Worth every rupee!',
      transformation: 'Lost 17kg and maintaining',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Anjali Kapoor',
      location: 'Laxmi Nagar, Delhi',
      rating: 5,
      review: 'The affordable pricing makes professional coaching accessible. Got competition-ready for my first bodybuilding show under his guidance. His expertise in nutrition and training is unmatched!',
      transformation: 'Competition ready physique',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Rajesh Mehra',
      location: 'Vasant Kunj, Delhi',
      rating: 5,
      review: 'At 45, I thought I was too old to build muscle. Coach Himanshu proved me wrong! His customized senior-friendly program helped me gain strength and lose fat simultaneously. Feel 10 years younger!',
      transformation: 'Recomposition at 45',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Neha Malhotra',
      location: 'Connaught Place, Delhi',
      rating: 5,
      review: 'His TRX training expertise is amazing! The home workout variations kept things interesting. Lost 12kg and gained so much energy. The video library is super helpful for proper form.',
      transformation: 'Lost 12kg, gained energy',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Karan Bhardwaj',
      location: 'Greater Kailash, Delhi',
      rating: 5,
      review: 'Tried multiple coaches before, but Coach Himanshu\'s science-backed approach is different. No bro-science, just facts. Went from 25% to 12% body fat in 8 months. Incredible knowledge!',
      transformation: '13% body fat reduction',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Divya Sharma',
      location: 'Mayur Vihar, Delhi',
      rating: 5,
      review: 'The weekly consultations are so valuable! He adjusts my plan based on progress. Lost 15kg and my PCOS symptoms improved significantly. Thank you Coach for changing my life!',
      transformation: 'Lost 15kg, improved PCOS',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Siddharth Jain',
      location: 'Punjabi Bagh, Delhi',
      rating: 5,
      review: 'Bulking phase done right! Gained 10kg with minimal fat gain under Coach Himanshu\'s guidance. His meal timing and macro calculations are spot on. True professional!',
      transformation: 'Clean bulk 10kg',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Ritu Agarwal',
      location: 'Karol Bagh, Delhi',
      rating: 5,
      review: 'As a vegetarian, I struggled with protein intake. Coach Himanshu created amazing veg meal plans. Lost 20kg in 7 months while maintaining muscle. His knowledge of sports nutrition is exceptional!',
      transformation: 'Lost 20kg on veg diet',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Arjun Reddy',
      location: 'Nehru Place, Delhi',
      rating: 5,
      review: 'The 24/7 support is a game-changer! Whenever I had doubts, Coach responded quickly. His motivation kept me going during plateaus. From skinny to strong in 10 months!',
      transformation: 'Gained 12kg muscle',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Pooja Nair',
      location: 'South Extension, Delhi',
      rating: 5,
      review: 'Wedding transformation done! Lost 18kg in 4 months with Coach Himanshu. The customized plans fit my hectic schedule. Everyone was shocked at my wedding. Forever grateful!',
      transformation: 'Wedding transformation 18kg',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Manish Tiwari',
      location: 'Paschim Vihar, Delhi',
      rating: 5,
      review: 'Coach Himanshu\'s approach to lifestyle coaching is holistic. Not just workouts and diet, but sleep, stress management too. Down 25kg and my diabetes is under control. Life-changing!',
      transformation: 'Lost 25kg, controlled diabetes',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },

    // Other Indian states (5)
    {
      name: 'Rohan Deshmukh',
      location: 'Pune, Maharashtra',
      rating: 5,
      review: 'Online coaching done right! Despite being in different cities, Coach Himanshu\'s guidance felt personal. Video calls and constant support made all the difference. Lost 16kg in 5 months!',
      transformation: 'Lost 16kg remotely',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Kavita Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      review: 'Being a Gujarati foodie, I thought I could never lose weight. Coach Himanshu incorporated my favorite foods into the plan. Lost 14kg without feeling deprived. Amazing!',
      transformation: 'Lost 14kg sustainably',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Aditya Menon',
      location: 'Bangalore, Karnataka',
      rating: 5,
      review: 'Tech professional with erratic hours - Coach Himanshu understood my challenges. Flexible meal timing and efficient workouts. Gained serious muscle and energy. Highly recommend for IT folks!',
      transformation: 'Gained 9kg lean muscle',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Shreya Mukherjee',
      location: 'Kolkata, West Bengal',
      rating: 5,
      review: 'After thyroid diagnosis, weight loss seemed impossible. Coach Himanshu\'s expertise in special population training helped me lose 13kg safely. His patience and knowledge are remarkable!',
      transformation: 'Lost 13kg with thyroid',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Vishal Reddy',
      location: 'Hyderabad, Telangana',
      rating: 5,
      review: 'From dad bod to fit dad! Coach Himanshu motivated me to prioritize health. Lost 20kg in 8 months. My kids now see a healthy role model. Best decision ever!',
      transformation: 'Lost 20kg dad transformation',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },

    // International clients (2)
    {
      name: 'David Thompson',
      location: 'London, United Kingdom',
      rating: 5,
      review: 'Found Coach Himanshu through Instagram. Despite the time difference, his support has been incredible. The scientific approach and affordability compared to UK coaches is amazing. Down 15kg!',
      transformation: 'Lost 15kg internationally',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
    {
      name: 'Sarah Martinez',
      location: 'Dubai, UAE',
      rating: 5,
      review: 'Expat life made fitness difficult. Coach Himanshu\'s online coaching is perfect! Customized plans that work with Dubai\'s lifestyle. Professional, knowledgeable, and results-driven. Highly recommend!',
      transformation: 'Lost 11kg in Dubai',
      profilePhoto: undefined,
      beforePhoto: undefined,
      afterPhoto: undefined,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [allTestimonials, setAllTestimonials] = useState(testimonials);

  // Fetch approved feedbacks from database and merge with hardcoded testimonials
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('/api/feedback');
        const data = await response.json();

        if (data.success && data.feedbacks.length > 0) {
          // Transform database feedbacks to match testimonial format
          const dbFeedbacks = data.feedbacks.map((feedback: any) => ({
            name: feedback.name,
            location: feedback.location,
            rating: feedback.rating,
            review: feedback.review,
            transformation: feedback.transformation || '',
            profilePhoto: feedback.profilePhoto,
            beforePhoto: feedback.beforePhoto,
            afterPhoto: feedback.afterPhoto,
          }));

          // Merge database feedbacks first (latest first) then hardcoded testimonials
          setAllTestimonials([...dbFeedbacks, ...testimonials]);
        }
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
        // Keep using hardcoded testimonials if fetch fails
      }
    };

    fetchFeedbacks();
  }, []);

  const TESTIMONIALS_PER_PAGE = 3;
  const totalPages = Math.ceil(allTestimonials.length / TESTIMONIALS_PER_PAGE);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + TESTIMONIALS_PER_PAGE) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => {
      const newIndex = prev - TESTIMONIALS_PER_PAGE;
      return newIndex < 0 ? Math.floor((allTestimonials.length - 1) / TESTIMONIALS_PER_PAGE) * TESTIMONIALS_PER_PAGE : newIndex;
    });
  };

  const getCurrentPageTestimonials = () => {
    return allTestimonials.slice(currentTestimonial, currentTestimonial + TESTIMONIALS_PER_PAGE);
  };

  const currentPage = Math.floor(currentTestimonial / TESTIMONIALS_PER_PAGE);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
      />

      <div className="min-h-screen bg-brand-navy">
        <AnnouncementBar />
        <Navbar />

      <section className="relative pb-0 overflow-hidden h-dvh flex flex-col" aria-label="Hero section">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-brand-navy">
          {/* Mobile: video background with strong overlay to let text breathe */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover object-center [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
              autoPlay loop muted playsInline preload="none"
              disablePictureInPicture disableRemotePlayback
              style={{ pointerEvents: 'none', minWidth: '100%', minHeight: '100%' }}
            >
              <source src="/intro2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/50 to-brand-navy/90" />
            <div className="absolute inset-0 bg-brand-navy/30" />
          </div>

          {/* Desktop: subtle radial glows */}
          <div className="absolute inset-0 hidden lg:block" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(23,95,255,0.06) 0%, transparent 60%)' }} />
          <div className="absolute inset-0 hidden lg:block" style={{ background: 'radial-gradient(ellipse at 80% 80%, rgba(23,95,255,0.04) 0%, transparent 50%)' }} />
        </div>

        {/* Atmospheric glow orbs */}
        <div className="absolute top-[15%] left-[5%] w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] rounded-full blur-[120px] lg:blur-[160px] pointer-events-none animate-glow-pulse" style={{ background: 'rgba(23,95,255,0.06)' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[200px] lg:w-[350px] h-[200px] lg:h-[350px] rounded-full blur-[100px] lg:blur-[140px] pointer-events-none animate-glow-pulse" style={{ background: 'rgba(23,95,255,0.04)', animationDelay: '2s' }} />

        {/* Desktop fitness background elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.03] hidden lg:block">
          <svg className="absolute -top-20 -right-20 w-[600px] h-[600px] text-brand-blue animate-drift" viewBox="0 0 400 400" fill="none">
            {[...Array(5)].map((_, row) =>
              [...Array(4)].map((_, col) => (
                <polygon key={`${row}-${col}`} points="30,0 60,17 60,52 30,69 0,52 0,17" transform={`translate(${col * 70 + (row % 2) * 35}, ${row * 62})`} stroke="currentColor" strokeWidth="1" fill="none" />
              ))
            )}
          </svg>
          <svg className="absolute top-[30%] -left-8 w-[280px] h-[280px] text-white/80 rotate-[25deg]" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="10" y="45" width="12" height="30" rx="3" /><rect x="22" y="50" width="8" height="20" rx="2" /><rect x="90" y="50" width="8" height="20" rx="2" /><rect x="98" y="45" width="12" height="30" rx="3" /><line x1="30" y1="60" x2="90" y2="60" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <svg className="absolute bottom-[18%] left-0 w-full h-24 text-brand-blue" viewBox="0 0 1200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polyline points="0,40 200,40 250,15 270,65 290,25 310,55 330,40 500,40 550,12 570,68 590,20 610,58 630,40 900,40 950,18 970,62 990,28 1010,52 1030,40 1200,40" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="absolute top-[55%] right-[8%] w-[180px] h-[180px] text-white/60 -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M35,35 Q35,15 50,15 Q65,15 65,35" strokeLinecap="round" /><circle cx="50" cy="58" r="25" /><circle cx="50" cy="58" r="18" strokeDasharray="4 3" />
          </svg>
        </div>

        {/* ========= MOBILE HERO (lg:hidden) ========= */}
        <div className="relative z-10 flex-1 flex flex-col lg:hidden pt-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col justify-center px-5"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] backdrop-blur-xl shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.12) 0%, rgba(23,95,255,0.04) 100%)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                </span>
                <span className="text-blue-300 text-[11px] font-medium tracking-wider uppercase">NASM Certified Fitness Expert</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={itemVariants} className="mb-4">
              <span className="block text-4xl font-extrabold text-white leading-[1.08] tracking-tight">
                Transform Your
              </span>
              <span className="block text-4xl font-extrabold leading-[1.08] tracking-tight mt-1">
                <span className="bg-gradient-to-r from-brand-blue via-blue-400 to-brand-gold bg-clip-text text-transparent">
                  Fitness
                </span>
                <span className="text-white"> Journey</span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-sm text-gray-300/80 mb-5 leading-relaxed max-w-sm">
              Personalized training & nutrition — built for <span className="text-white font-semibold">real results</span>.
              Start your transformation with <span className="text-brand-gold font-semibold">Coach Himanshu</span> today.
            </motion.p>

            {/* Social proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-brand-navy/80 bg-gradient-to-br from-brand-blue/50 to-brand-gold/50 flex items-center justify-center text-[10px] text-white/80 font-bold">
                    {['R','P','A','S'][i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <span className="text-gray-300 font-medium">1000+</span>
                <span className="text-gray-500 text-xs">transformed</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              <a href="#plans" className="w-full">
                <button className="group relative w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-500 blur-xl opacity-40" />
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight size={18} className="relative z-10" />
                </button>
              </a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-white/90 text-base border border-white/[0.12] backdrop-blur-xl transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)' }}
              >
                View Dashboard
              </button>
            </motion.div>
          </motion.div>

          {/* Stats bar at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto"
          >
            <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06] backdrop-blur-2xl" style={{ background: 'linear-gradient(180deg, rgba(10,15,31,0.5) 0%, rgba(10,15,31,0.85) 100%)' }}>
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center py-4 px-2">
                  <stat.icon size={16} className="text-brand-blue/70 mb-1.5" />
                  <div className="text-base font-bold text-white leading-none">{stat.value}</div>
                  <div className="text-gray-500 text-[10px] mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========= DESKTOP HERO (hidden lg:flex) ========= */}
        <div className="relative z-10 hidden lg:flex flex-1 flex-col justify-center pt-32 pb-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-8 lg:px-12 max-w-7xl mx-auto w-full"
          >
            <div className="flex items-center gap-12 xl:gap-16">
              {/* LEFT — Text */}
              <div className="flex-1 min-w-0">
                <motion.div variants={itemVariants} className="mb-5">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.1) 0%, rgba(23,95,255,0.03) 100%)' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-blue"></span>
                    </span>
                    <span className="text-blue-300/90 text-xs font-medium tracking-widest uppercase">NASM Certified Coach</span>
                  </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="mb-5">
                  <span className="block text-6xl xl:text-7xl font-extrabold text-white leading-[1.02] tracking-tight">Transform Your</span>
                  <span className="block text-6xl xl:text-7xl font-extrabold leading-[1.02] tracking-tight">
                    <span className="bg-gradient-to-r from-brand-blue via-blue-400 to-cyan-300 bg-clip-text text-transparent">Fitness</span>
                    <span className="text-white"> Journey</span>
                  </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
                  Personalized training & nutrition — built for <span className="text-white font-medium">real results</span>.
                  Start your transformation with <span className="text-brand-blue font-medium">Coach Himanshu</span> today.
                </motion.p>

                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
                  <a href="#plans">
                    <button className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-blue/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-500" />
                      <span className="relative z-10">Start Your Journey</span>
                      <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </a>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-white/80 text-base border border-white/[0.1] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.2] hover:text-white"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
                  >
                    View Dashboard
                  </button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/[0.06] backdrop-blur-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-brand-navy/80 bg-gradient-to-br from-brand-blue/40 to-blue-400/40 flex items-center justify-center text-[9px] text-white/70 font-medium">
                        {['R','P','A','S'][i]}
                      </div>
                    ))}
                  </div>
                  <div className="h-5 w-px bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="text-brand-gold/70 fill-brand-gold/70" />
                      ))}
                    </div>
                    <span className="text-white/60 text-xs font-medium">1000+ transformed</span>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — Video card */}
              <motion.div variants={itemVariants} className="w-[38%] flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-40" style={{ background: 'radial-gradient(ellipse, rgba(23,95,255,0.15) 0%, transparent 70%)' }} />
                  <div className="relative rounded-3xl overflow-hidden border border-white/[0.08]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <div className="p-1.5">
                      <div className="relative rounded-[1.25rem] overflow-hidden aspect-[4/5]">
                        <video
                          className="absolute inset-0 w-full h-full object-cover object-center [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                          autoPlay loop muted playsInline preload="none"
                          disablePictureInPicture disableRemotePlayback
                          style={{ pointerEvents: 'none', minWidth: '100%', minHeight: '100%' }}
                        >
                          <source src="/intro2.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="backdrop-blur-xl rounded-2xl border border-white/[0.1] px-5 py-4" style={{ background: 'linear-gradient(135deg, rgba(10,15,31,0.7) 0%, rgba(10,15,31,0.5) 100%)' }}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white/50 text-[10px] font-medium tracking-wider uppercase mb-1">Certified Coach</p>
                                <p className="text-white font-bold text-lg leading-tight">Coach Himanshu</p>
                                <p className="text-blue-300/70 text-xs mt-0.5">6+ Professional Diplomas</p>
                              </div>
                              <div className="w-12 h-12 rounded-xl border border-white/[0.08] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.15) 0%, rgba(23,95,255,0.05) 100%)' }}>
                                <Award size={22} className="text-brand-blue" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="backdrop-blur-xl rounded-xl border border-white/[0.1] px-3 py-2" style={{ background: 'linear-gradient(135deg, rgba(10,15,31,0.6) 0%, rgba(10,15,31,0.4) 100%)' }}>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-white/80 text-[10px] font-semibold tracking-wide uppercase">Live</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Desktop stats bar */}
        <div className="relative z-10 w-full hidden lg:block">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-3 border-t border-white/[0.06] backdrop-blur-2xl" style={{ background: 'linear-gradient(180deg, rgba(10,15,31,0.6) 0%, rgba(10,15,31,0.9) 100%)' }}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center justify-center gap-3 py-7 px-8 transition-colors duration-300 group ${index < 2 ? 'border-r border-white/[0.06]' : ''}`}
                >
                  <div className="w-11 h-11 rounded-xl border border-white/[0.06] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.08) 0%, rgba(23,95,255,0.02) 100%)' }}>
                    <stat.icon size={18} className="text-brand-blue/80" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-white/90 leading-none">{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-0.5 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ========= DATE-AWARE SALE BANNER ========= */}
      {activeSale && (
        <section className="relative py-10 md:py-16 px-4 md:px-6 overflow-hidden" aria-label={activeSale.title} style={{ background: 'linear-gradient(180deg, rgba(10,15,31,1) 0%, rgba(15,20,40,1) 50%, rgba(10,15,31,1) 100%)' }}>
          {/* Animated background effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${activeSale.theme === 'environment' ? 'bg-green-500/[0.04]' : 'bg-purple-500/[0.04]'} rounded-full blur-[150px] animate-glow-pulse`} />
            <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] ${activeSale.theme === 'environment' ? 'bg-emerald-500/[0.05]' : 'bg-violet-500/[0.05]'} rounded-full blur-[130px] animate-glow-pulse`} style={{ animationDelay: '2s' }} />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Sale Header */}
            <div className="text-center mb-6 md:mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${activeSale.theme === 'environment' ? 'border-green-500/20' : 'border-purple-500/20'} backdrop-blur-md mb-4`}
                style={{ background: activeSale.theme === 'environment' ? 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.08) 100%)' : 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(168,85,247,0.08) 100%)' }}
              >
                {activeSale.theme === 'environment' ? (
                  <Leaf size={14} className="text-green-400 animate-pulse" />
                ) : (
                  <Flame size={14} className="text-purple-400 animate-pulse" />
                )}
                <span className={`${activeSale.theme === 'environment' ? 'text-green-300' : 'text-purple-300'} text-xs font-bold tracking-wider uppercase`}>Limited Time Offer</span>
                {activeSale.theme === 'environment' ? (
                  <Leaf size={14} className="text-green-400 animate-pulse" />
                ) : (
                  <Flame size={14} className="text-purple-400 animate-pulse" />
                )}
              </motion.div>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              <div className="rounded-3xl border border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(26,37,64,0.5) 0%, rgba(10,15,31,0.8) 100%)', boxShadow: '0 25px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <div className="relative min-h-[420px] md:min-h-[400px]">
                  {/* Slide 0: Main Headline */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: saleSlide === 0 ? 1 : 0, x: saleSlide === 0 ? 0 : -40 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={`absolute inset-0 p-6 md:p-10 ${saleSlide === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <div className="text-center h-full flex flex-col justify-center">
                      <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-2">{activeSale.title}</h3>
                      <p className={`${activeSale.theme === 'environment' ? 'text-green-400' : 'text-purple-400'} font-bold text-base md:text-lg mb-3`}>⏳ {activeSale.subtitle}</p>
                      <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-5 leading-relaxed">
                        Start your fitness journey this June with exclusive discounts on all plans. Transform yourself physically and mentally — the best time to begin is now.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {['Gym Workout Plans', 'Home Workout Plans', 'Rehabilitation Programs', '1:1 Elite Training', 'Diet & Nutrition', 'Beginner Friendly'].map((h, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-green-300 border border-green-500/20" style={{ background: 'rgba(34,197,94,0.08)' }}>
                            ✅ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Slide 1: Discount Grid */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: saleSlide === 1 ? 1 : 0, x: saleSlide === 1 ? 0 : 40 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={`absolute inset-0 p-6 md:p-10 ${saleSlide === 1 ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <div className="h-full flex flex-col justify-center">
                      <h3 className="text-xl md:text-3xl font-extrabold text-white text-center mb-6">📋 DISCOUNTS ON ALL PLANS</h3>
                      <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
                        {activeSale.offers.map((offer, i) => (
                          <div key={i} className="relative rounded-2xl border border-white/[0.08] p-3 md:p-4 text-center transition-all duration-300 hover:border-brand-gold/30 hover:scale-[1.02]" style={{ background: 'linear-gradient(180deg, rgba(26,37,64,0.6) 0%, rgba(10,15,31,0.9) 100%)' }}>
                            <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white`} style={{ background: activeSale.theme === 'environment' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>{offer.off}</span>
                            <p className="text-gray-400 text-xs font-medium mt-2">{offer.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Slide 2: June 21 Specials (only shown on June 21) */}
                  {activeSale.specials && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: saleSlide === 2 ? 1 : 0, x: saleSlide === 2 ? 0 : 40 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className={`absolute inset-0 p-6 md:p-10 ${saleSlide === 2 ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
                      <div className="text-center h-full flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">🎉 JUNE 21 SPECIALS</h3>
                        <p className="text-purple-400 font-bold text-base mb-6">World Yoga Day + Father&apos;s Day</p>
                        <div className="space-y-3 max-w-lg mx-auto mb-6">
                          {activeSale.specials.map((special, i) => (
                            <div key={i} className="rounded-xl border border-white/[0.08] p-4 text-left" style={{ background: 'rgba(26,37,64,0.4)' }}>
                              <p className="text-white font-medium text-sm md:text-base">{special}</p>
                            </div>
                          ))}
                        </div>
                        <a href="#plans" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base mx-auto overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/20" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                          Grab The Offer Now
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center justify-center gap-2 mt-5">
                {Array.from({ length: totalSaleSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSaleSlide(index)}
                    className={`transition-all duration-300 rounded-full ${saleSlide === index ? `w-8 h-2.5 ${activeSale.theme === 'environment' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-purple-500 to-violet-400'}` : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>

              {/* Timer badge */}
              <div className="flex justify-center mt-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${activeSale.theme === 'environment' ? 'border-green-500/20' : 'border-purple-500/20'} backdrop-blur-md`} style={{ background: activeSale.theme === 'environment' ? 'rgba(34,197,94,0.08)' : 'rgba(139,92,246,0.08)' }}>
                  <Clock size={14} className={activeSale.theme === 'environment' ? 'text-green-400' : 'text-purple-400'} />
                  <span className={`${activeSale.theme === 'environment' ? 'text-green-300' : 'text-purple-300'} text-xs font-medium`}>Sale ends {activeSale.endDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-24 px-4 md:px-6 relative overflow-hidden section-glass" aria-label="Why choose Coach Himanshu">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-blue/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/[0.03] rounded-full blur-[130px] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-md mb-4 md:mb-6" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
              <Award size={14} className="text-brand-blue" />
              <span className="text-blue-300/80 text-xs font-medium tracking-wider uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-5 text-white">
              Why Choose Coach Himanshu?
            </h2>
            <p className="text-sm md:text-lg text-gray-400/80 max-w-3xl mx-auto leading-relaxed px-2">
              NASM Certified Bodybuilding Coach with <span className="text-white font-medium">6+ professional diplomas</span>. Experience science-backed training that's <span className="text-white font-medium">affordable</span>, <span className="text-white font-medium">accessible</span>, and designed for real transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 cursor-pointer"
                style={{ background: 'linear-gradient(180deg, rgba(26,37,64,0.4) 0%, rgba(10,15,31,0.8) 100%)' }}
              >
                {/* Premium Image Background */}
                <div className="relative h-56 md:h-72 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={`${feature.title} - Coach Himanshu Professional Fitness Expertise`}
                    className={`w-full h-full object-cover ${feature.imagePosition} transition-transform duration-700 group-hover:scale-105 brightness-[0.7] group-hover:brightness-[0.85]`}
                    loading="lazy"
                  />

                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent"></div>

                  {/* Subtle blue glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Section with glass overlay */}
                <div className="relative p-4 md:p-7 -mt-6">
                  <div className="glass-card-subtle p-4 md:p-5">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400/80 text-sm leading-relaxed group-hover:text-gray-300/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative bottom line */}
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Qualifications Marquee */}
      <section className="py-5 border-y border-white/[0.04] overflow-hidden relative" style={{ background: 'linear-gradient(180deg, rgba(10,15,31,0.95) 0%, rgba(26,37,64,0.15) 50%, rgba(10,15,31,0.95) 100%)' }}>
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-brand-navy to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-brand-navy to-transparent z-10"></div>

          <div className="animate-marquee whitespace-nowrap" style={{ display: 'inline-flex', minWidth: '200%' }}>
            {/* First set of qualifications */}
            {[
              { icon: Trophy, text: 'NASM Certified Bodybuilding Coach' },
              { icon: Dumbbell, text: 'Diploma in Personal Training' },
              { icon: GraduationCap, text: 'Diploma in Master Training' },
              { icon: Apple, text: 'Diploma in Sports Nutrition' },
              { icon: Activity, text: 'Diploma in TRX Suspension Training' },
              { icon: HeartPulse, text: 'Diploma in Special Population Training' },
            ].map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 mx-2 md:mx-3 px-3 md:px-4 py-2 md:py-2.5 border border-white/[0.06] rounded-xl backdrop-blur-md flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-brand-blue/80 to-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-gray-300 font-medium text-[11px] md:text-xs">{item.text}</span>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {[
              { icon: Trophy, text: 'NASM Certified Bodybuilding Coach' },
              { icon: Dumbbell, text: 'Diploma in Personal Training' },
              { icon: GraduationCap, text: 'Diploma in Master Training' },
              { icon: Apple, text: 'Diploma in Sports Nutrition' },
              { icon: Activity, text: 'Diploma in TRX Suspension Training' },
              { icon: HeartPulse, text: 'Diploma in Special Population Training' },
            ].map((item, index) => (
              <div
                key={`dup-${index}`}
                className="inline-flex items-center gap-2 mx-2 md:mx-3 px-3 md:px-4 py-2 md:py-2.5 border border-white/[0.06] rounded-xl backdrop-blur-md flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-brand-blue/80 to-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-gray-300 font-medium text-[11px] md:text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="py-16 md:py-20 px-4 md:px-6 relative overflow-hidden" aria-label="Fitness coaching plans">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-10 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-3 text-white">
              Choose Your Plan
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
              Select the perfect package for your fitness goals. All plans
              include personalized guidance and dedicated support.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8 md:mb-10 px-4">
            <div className="grid grid-cols-4 gap-1.5 sm:inline-flex sm:gap-2 w-full sm:w-auto p-1.5 sm:p-2 rounded-2xl border border-white/[0.06] backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
              {[
                { key: 'gym' as const, label: 'Gym', labelFull: 'Gym Workout', icon: Dumbbell },
                { key: 'home' as const, label: 'Home', labelFull: 'Home Workout', icon: HomeIcon },
                { key: 'rehab' as const, label: 'Rehab', labelFull: 'Rehabilitation', icon: Activity },
                { key: 'live' as const, label: 'Live', labelFull: 'Live Training', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePlanTab(tab.key)}
                  className={`relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-300 ${
                    activePlanTab === tab.key
                      ? `bg-gradient-to-r ${
                          tab.key === 'gym' ? 'from-brand-gold/20 to-yellow-400/10 text-brand-gold border border-brand-gold/30 shadow-lg shadow-brand-gold/10'
                          : tab.key === 'home' ? 'from-emerald-500/20 to-green-400/10 text-emerald-400 border border-emerald-400/30 shadow-lg shadow-emerald-500/10'
                          : tab.key === 'rehab' ? 'from-cyan-500/20 to-blue-400/10 text-cyan-400 border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                          : 'from-violet-500/20 to-purple-400/10 text-violet-400 border border-violet-400/30 shadow-lg shadow-violet-500/10'
                        }`
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.labelFull}</span>
                  <span className="sm:hidden">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Gym Workout Plans */}
          {activePlanTab === 'gym' && (
            <motion.div
              key="gym"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Individual Plans */}
              <motion.p variants={itemVariants} className="text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-brand-gold/20 max-w-[80px]"></span>
                <span className="text-brand-gold font-semibold uppercase tracking-wider text-xs">Individual Plans</span>
                <span className="flex-1 h-px bg-brand-gold/20 max-w-[80px]"></span>
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
                {plans.filter(p => !p.couple && !p.homeWorkout && !p.rehabilitation && !p.liveGroup).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>

              {/* Couple Plans */}
              <div className="mt-6 md:mt-8">
                <motion.p variants={itemVariants} className="text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-pink-500/20 max-w-[80px]"></span>
                  <span className="text-pink-400 font-semibold uppercase tracking-wider text-xs">Couple Plans</span>
                  <span className="flex-1 h-px bg-pink-500/20 max-w-[80px]"></span>
                </motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-stretch max-w-2xl mx-auto">
                  {plans.filter(p => p.couple && !p.homeWorkout && !p.rehabilitation).map((plan) => (
                    <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                      <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Home Workout Plans */}
          {activePlanTab === 'home' && (
            <motion.div
              key="home"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Desktop: side-by-side labels */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-4 mb-4 max-w-3xl mx-auto">
                <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-emerald-500/20"></span>
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Individual Plan</span>
                  <span className="flex-1 h-px bg-emerald-500/20"></span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-pink-500/20"></span>
                  <span className="text-pink-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Couple Plan</span>
                  <span className="flex-1 h-px bg-pink-500/20"></span>
                </motion.div>
              </div>
              {/* Mobile: stacked label */}
              <motion.p variants={itemVariants} className="sm:hidden text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-emerald-500/20 max-w-[60px]"></span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-xs">Individual & Couple</span>
                <span className="flex-1 h-px bg-emerald-500/20 max-w-[60px]"></span>
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-stretch max-w-3xl mx-auto">
                {plans.filter(p => p.homeWorkout && !p.couple).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
                {plans.filter(p => p.homeWorkout && p.couple).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} homeWorkout={false} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rehabilitation Plans */}
          {activePlanTab === 'rehab' && (
            <motion.div
              key="rehab"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Desktop: side-by-side labels */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-4 mb-4 max-w-3xl mx-auto">
                <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-cyan-500/20"></span>
                  <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Individual Plan</span>
                  <span className="flex-1 h-px bg-cyan-500/20"></span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-pink-500/20"></span>
                  <span className="text-pink-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Couple Plan</span>
                  <span className="flex-1 h-px bg-pink-500/20"></span>
                </motion.div>
              </div>
              {/* Mobile: stacked label */}
              <motion.p variants={itemVariants} className="sm:hidden text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-cyan-500/20 max-w-[60px]"></span>
                <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">Individual & Couple</span>
                <span className="flex-1 h-px bg-cyan-500/20 max-w-[60px]"></span>
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-stretch max-w-3xl mx-auto">
                {plans.filter(p => p.rehabilitation && !p.couple).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
                {plans.filter(p => p.rehabilitation && p.couple).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} rehabilitation={false} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Live Plans */}
          {activePlanTab === 'live' && (
            <motion.div
              key="live"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* One-on-One Elite Coaching Section */}
              <motion.div variants={itemVariants} className="mb-6 md:mb-8">
                <div className="text-center mb-4 px-4">
                  <p className="flex items-center justify-center gap-2 mb-2">
                    <span className="flex-1 h-px bg-violet-500/20 max-w-[80px]"></span>
                    <span className="text-violet-400 font-semibold uppercase tracking-wider text-xs">One-on-One Elite Coaching</span>
                    <span className="flex-1 h-px bg-violet-500/20 max-w-[80px]"></span>
                  </p>
                  <p className="text-gray-400 text-xs italic">Not for everyone — only for serious individuals</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
                  {plans.filter(p => p.liveOneOnOne).map((plan) => (
                    <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                      <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </div>
                {/* Terms & Conditions */}
                <motion.div variants={itemVariants} className="mt-4 max-w-3xl mx-auto">
                  <details className="group">
                    <summary className="flex items-center justify-center gap-2 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors text-xs">
                      <span className="font-medium">Terms & Conditions</span>
                      <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="mt-3 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-gray-400 text-xs space-y-1.5">
                      <p>• A total of 24 sessions are scheduled per month (30 days). All sessions must be completed within 30 days of enrollment — sessions do not carry forward and will expire after 30 days, no exceptions.</p>
                      <p>• It is the sole responsibility of the client to complete all sessions within the given timeframe. No extensions will be granted under any circumstance.</p>
                      <p>• Extensions will only be provided if a session is missed due to trainer unavailability or any issue caused by Coach Himanshu Platform — strictly equal to sessions missed from our side only.</p>
                      <p>• Any change in your fixed session time must be communicated at least 24 hours in advance. Last-minute reschedule requests will not be entertained.</p>
                      <p>• If a client joins the session late, the session will end at the originally scheduled time. No extra time will be given.</p>
                      <p>• Each session is of 60 minutes duration.</p>
                      <p>• Once purchased, the 1:1 training plan is completely non-refundable under any circumstance — no exceptions.</p>
                    </div>
                  </details>
                </motion.div>
              </motion.div>

              {/* Live Group Sessions Section */}
              <motion.p variants={itemVariants} className="text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-violet-500/20 max-w-[80px]"></span>
                <span className="text-violet-400 font-semibold uppercase tracking-wider text-xs">Live Group Sessions</span>
                <span className="flex-1 h-px bg-violet-500/20 max-w-[80px]"></span>
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-stretch max-w-3xl mx-auto">
                {plans.filter(p => p.liveGroup && !p.liveOneOnOne).map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                    <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} salePercent={getSalePercent(plan)} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Rhynogrip Fitness Gear Partner Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 relative overflow-hidden section-glass border-y border-white/[0.04]" aria-label="Fitness gear partner Rhynogrip">
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/[0.04] rounded-full blur-[150px] animate-glow-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/[0.03] rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-md mb-4" style={{ background: 'linear-gradient(135deg, rgba(201,166,70,0.08) 0%, rgba(201,166,70,0.02) 100%)' }}>
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-brand-gold/80 text-xs font-medium tracking-wider uppercase">Premium Partner</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Fitness Gear Partner
            </h2>

            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="https://ik.imagekit.io/oeagl0l4x/public/Rhynogrip.png?tr=w-400,q-80,f-auto"
                alt="Rhynogrip Premium Gym Gear Logo - Professional Fitness Equipment Partner"
                className="h-10 md:h-12 object-contain"
                loading="lazy"
              />
            </div>

            <p className="text-lg md:text-xl text-gray-300 font-medium mb-1">
              Rhynogrip Premium Gym Gear
            </p>
            <p className="text-base md:text-lg bg-gradient-to-r from-brand-gold to-yellow-400 bg-clip-text text-transparent font-semibold">
              Built for strength. Engineered For Performance.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Product Video */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-brand-blue/[0.06] rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative p-5 rounded-2xl border border-white/[0.08] backdrop-blur-xl overflow-hidden h-full flex items-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                <video
                  className="w-full h-auto rounded-2xl [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label="Rhynogrip Premium Gym Gear Products Showcase"
                  title="Professional Fitness Equipment by Rhynogrip - 10% OFF with Code COACHHIMANSHU"
                  style={{ pointerEvents: 'none' }}
                >
                  <source src="/RHYNOGRIP_VIDEO.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>

            {/* Offer Details */}
            <motion.div variants={itemVariants} className="flex">
              <div className="glass-card-strong p-6 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Exclusive Offer
                    </h3>
                  </div>

                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                    Shop premium gears and elevate your training experience with Rhynogrip's professional-grade equipment.
                  </p>

                  {/* Coupon Code Box */}
                  <div className="rounded-xl p-4 mb-3 border border-brand-gold/20 backdrop-blur-md" style={{ background: 'linear-gradient(135deg, rgba(201,166,70,0.08) 0%, rgba(201,166,70,0.02) 100%)' }}>
                    <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">Use Coupon Code</p>
                    <div className="flex items-center justify-between rounded-lg p-3 border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(10,15,31,0.6) 0%, rgba(10,15,31,0.4) 100%)' }}>
                      <code className="text-lg font-bold text-brand-gold tracking-wider">
                        COACHHIMANSHU
                      </code>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-brand-gold to-yellow-400 bg-clip-text text-transparent">
                        10% OFF
                      </span>
                      <p className="text-gray-400 text-xs mt-0.5">on all products</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-blue/20" style={{ background: 'rgba(23,95,255,0.08)' }}>
                        <div className="w-1.5 h-1.5 bg-brand-blue/60 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-300">Premium quality gym accessories</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-blue/20" style={{ background: 'rgba(23,95,255,0.08)' }}>
                        <div className="w-1.5 h-1.5 bg-brand-blue/60 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-300">Engineered for professional athletes</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-blue/20" style={{ background: 'rgba(23,95,255,0.08)' }}>
                        <div className="w-1.5 h-1.5 bg-brand-blue/60 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-300">Trusted by Coach Himanshu's clients</p>
                    </div>
                  </div>
                </div>

                {/* Shop Now Button */}
                <a
                  href="https://rhynogrip.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="primary" className="w-full gap-2 justify-center">
                    <ShoppingBag size={18} />
                    <span>Shop Now</span>
                    <ArrowRight size={18} />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative overflow-hidden section-glass border-y border-white/[0.04]" aria-label="Client testimonials">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-md mb-6" style={{ background: 'linear-gradient(135deg, rgba(201,166,70,0.06) 0%, rgba(201,166,70,0.02) 100%)' }}>
              <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span className="text-brand-gold/80 text-xs font-medium tracking-wider uppercase">Client Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-5 text-white">
              What Our Clients Say
            </h2>
            <p className="text-sm md:text-lg text-gray-400/80 max-w-3xl mx-auto leading-relaxed px-2">
              Real transformations, real results. Join <span className="text-white font-medium">1000+ satisfied clients</span> who achieved their fitness goals with Coach Himanshu.
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            {/* Grid of 3 Testimonial Cards */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {getCurrentPageTestimonials().map((testimonial, index) => (
                <div
                  key={currentTestimonial + index}
                  className="glass-card-strong p-6 relative overflow-hidden hover:border-white/[0.15] transition-all duration-300 flex flex-col"
                >
                  {/* Decorative Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote size={50} className="text-brand-gold" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 relative z-10 flex-grow">
                    "{testimonial.review}"
                  </p>

                  {/* Transformation Badge */}
                  {testimonial.transformation && (
                    <div className="inline-block px-3 py-1.5 rounded-full border border-brand-blue/20 mb-4" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.08) 0%, rgba(23,95,255,0.02) 100%)' }}>
                      <span className="text-blue-300/80 font-medium text-xs">
                        {testimonial.transformation}
                      </span>
                    </div>
                  )}

                  {/* Before/After Photos */}
                  {(testimonial.beforePhoto || testimonial.afterPhoto) && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {testimonial.beforePhoto && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Before</p>
                          <img
                            src={testimonial.beforePhoto}
                            alt="Before transformation"
                            className="w-full h-32 object-cover rounded-lg border border-brand-gold/30"
                          />
                        </div>
                      )}
                      {testimonial.afterPhoto && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">After</p>
                          <img
                            src={testimonial.afterPhoto}
                            alt="After transformation"
                            className="w-full h-32 object-cover rounded-lg border border-brand-gold/30"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Client Info */}
                  <div className="flex items-center gap-3 mt-auto">
                    {testimonial.profilePhoto ? (
                      <img
                        src={testimonial.profilePhoto}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold/50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Navigation Buttons - hidden on mobile */}
            <div className="hidden md:flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group backdrop-blur-md"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="text-gray-500 group-hover:text-white transition-colors" size={22} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group backdrop-blur-md"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" size={22} />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mt-6 md:mt-4">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentTestimonial(pageIndex * TESTIMONIALS_PER_PAGE)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    pageIndex === currentPage
                      ? 'w-6 bg-brand-blue'
                      : 'w-1.5 bg-white/15 hover:bg-white/30'
                  }`}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action - Share Your Story */}
          <motion.div variants={itemVariants} className="text-center mt-10 md:mt-16">
            <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-lg">
              Want to share your transformation story?
            </p>
            <a href="/feedback">
              <Button variant="outline" className="gap-2">
                <Star size={18} />
                <span>Share Your Feedback</span>
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-6 relative overflow-hidden border-t border-white/[0.04]" aria-label="Get started with transformation">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center"
          >
            Ready to Start Your Transformation?
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Video */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative rounded-2xl overflow-hidden glass-card-strong p-1">
                <video
                  className="w-full h-auto [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label="Train Today - Fitness Motivation Video by Coach Himanshu"
                  title="Start Your Fitness Journey Today with Coach Himanshu"
                  style={{ pointerEvents: 'none' }}
                >
                  <source src="/train_today.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>

            {/* Right Section - Get Started Today */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
                Get Started Today
              </h3>
              <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8 leading-relaxed">
                Join hundreds of satisfied clients who have achieved their fitness
                goals with expert coaching and personalized support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#plans">
                  <Button variant="primary" className="gap-2 w-full sm:w-auto">
                    <span>Get Started Today</span>
                    <ArrowRight size={20} />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-brand-navy" aria-label="Frequently asked questions">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 md:px-6 py-4 text-white font-medium text-sm md:text-lg hover:bg-white/5 transition-colors">
                  <span className="pr-2">{faq.name}</span>
                  <ChevronRight className="w-5 h-5 text-brand-blue transition-transform group-open:rotate-90 flex-shrink-0" />
                </summary>
                <div className="px-4 md:px-6 pb-4 text-gray-300 text-sm md:text-base leading-relaxed">
                  {faq.acceptedAnswer.text}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Checkout Drawer */}
      <CheckoutDrawer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </>
  );
}
