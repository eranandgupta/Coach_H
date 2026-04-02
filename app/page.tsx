'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Award,
  Users,
  Flame,
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
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import PlanCard from '@/components/PlanCard';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import LoginModal from '@/components/LoginModal';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/contexts/CartContext';

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
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certification',
            name: 'NASM Certified Bodybuilding Coach',
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
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://coachhimanshu.com/#service',
        name: 'Coach Himanshu Fitness Coaching',
        image: 'https://coachhimanshu.com/logo.png',
        url: 'https://coachhimanshu.com',
        telephone: '+91-XXXXXXXXXX',
        priceRange: '₹799-₹10998',
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
          lowPrice: '799',
          highPrice: '10998',
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
            price: '799',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 2,
            name: 'Consistency Plan',
            description: '3 months fitness coaching with comprehensive support',
            price: '1799',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 3,
            name: 'Strength Plan',
            description: '6 months intensive fitness transformation program with FREE RhynoGrip fitness gear',
            price: '2999',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 4,
            name: 'Mastery Plan',
            description: '12 months comprehensive fitness mastery program with FREE RhynoGrip fitness gear',
            price: '5499',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 5,
            name: 'Rehabilitation Plan',
            description: '3 months rehabilitation and injury recovery program with personalized exercises',
            price: '1799',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
          {
            '@type': 'Offer',
            position: 6,
            name: 'Home Workout Plan',
            description: '3 months home workout plan — no gym or equipment needed',
            price: '1500',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://coachhimanshu.com/#plans',
          },
        ],
      },
    ],
  };

  const plans = [
    {
      id: 1,
      dbName: 'Kickstart Plan',
      title: 'Kickstart Plan',
      duration: 'Month',
      price: '₹999',
      priceValue: 999,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Exercise video tutorial',
        'WhatsApp support',
        'Supplement guidance',
        'Lifestyle guidance',
        'One on one consultation weekly',
      ],
    },
    {
      id: 2,
      dbName: 'Consistency Plan',
      title: 'Consistency Plan',
      duration: '3 Months',
      price: '₹2,099',
      priceValue: 2099,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Exercise video tutorial',
        'WhatsApp support',
        'Supplement guidance',
        'Lifestyle guidance',
        'One on one consultation weekly',
      ],
      popular: true,
    },
    {
      id: 3,
      dbName: 'Strength Plan',
      title: 'Strength Plan',
      duration: '6 Months',
      price: '₹3,599',
      priceValue: 3599,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Exercise video tutorial',
        'WhatsApp support',
        'Supplement guidance',
        'Lifestyle guidance',
        'One on one consultation weekly',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
    },
    {
      id: 4,
      dbName: 'Mastery Plan',
      title: 'Mastery Plan',
      duration: '12 Months',
      price: '₹7,499',
      priceValue: 7499,
      description: 'All Inclusive',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Exercise video tutorial',
        'WhatsApp support',
        'Supplement guidance',
        'Lifestyle guidance',
        'One on one consultation weekly',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
    },
    {
      id: 8,
      dbName: 'Rehabilitation Plan',
      title: 'Rehabilitation',
      duration: '3 Months',
      price: '₹2,299',
      priceValue: 2299,
      description: 'Recovery & Healing',
      features: [
        'Customised rehabilitation workout',
        'Specially designed for knee, spine, elbow, shoulder, ankle joints',
        'No equipment needed',
        'WhatsApp support',
        'Exercise video tutorials',
        'Supplement guidance',
        'Lifestyle guidance',
        'One-on-one consultation twice a month',
      ],
      rehabilitation: true,
    },
    {
      id: 5,
      dbName: 'Home Workout Plan',
      title: 'Home Workout',
      duration: '3 Months',
      price: '₹1,799',
      priceValue: 1799,
      description: 'Home Workout',
      features: [
        'Customised home workout plan',
        'Personalised diet plan',
        'Exercise video tutorial',
        'WhatsApp support',
        'Supplement guidance',
        'Lifestyle guidance',
        'Resistance band & TRX band based workout (no gym equipment needed)',
        'One on one consultation twice a month',
      ],
      homeWorkout: true,
    },
    {
      id: 6,
      dbName: 'Couple Strength Plan',
      title: 'Couple Strength',
      duration: '6 Months',
      price: '₹6,999',
      priceValue: 6999,
      description: 'For 2 People',
      features: [
        'Personalized workout plans for both',
        'Customized meal plans for both',
        'Daily progress tracking',
        'WhatsApp support',
        'Full video library access',
        'Weekly one-on-one consultations',
        'Supplement guidance',
        'Lifestyle coaching',
        '💑 Train Together, Grow Together',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      couple: true,
    },
    {
      id: 7,
      dbName: 'Couple Mastery Plan',
      title: 'Couple Mastery',
      duration: '12 Months',
      price: '₹13,899',
      priceValue: 13899,
      description: 'For 2 People',
      features: [
        'Personalized workout plans for both',
        'Customized meal plans for both',
        'Daily progress tracking',
        'WhatsApp support',
        'Full video library access',
        'Weekly one-on-one consultations',
        'Supplement guidance',
        'Lifestyle coaching',
        '💑 Train Together, Grow Together',
        '🎁 FREE RhynoGrip Fitness Gear',
      ],
      couple: true,
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
      image: '/CH11.jpeg',
      imagePosition: 'object-top',
    },
    {
      icon: Target,
      title: 'Science-Backed Approach',
      description: 'Evidence-based training methods focused on sustainable results, not shortcuts',
      image: '/CH2.jpeg',
      imagePosition: 'object-[center_20%]',
    },
    {
      icon: Users,
      title: 'Proven Track Record',
      description: 'Former fitness educator and lecturer with hundreds of successful client transformations',
      image: '/CH4.jpeg',
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

      <div className="min-h-screen bg-brand-navy">
        <AnnouncementBar />
        <Navbar />

      <section className="relative pt-28 md:pt-32 pb-0 overflow-hidden min-h-screen flex flex-col justify-center" aria-label="Hero section">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <video
            className="absolute w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-label="Coach Himanshu fitness transformation background video"
            title="NASM Certified Fitness Coach - Transformation Journey"
            style={{ pointerEvents: 'none' }}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              video.play().catch(() => {});
            }}
          >
            <source src="/intro2.mp4" type="video/mp4" />
          </video>
          {/* Layered dark overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/50 to-brand-navy/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/70 via-transparent to-brand-navy/40" />
        </div>

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Floating accent dots */}
        <div className="absolute top-40 right-16 w-2 h-2 bg-brand-gold/60 rounded-full animate-pulse hidden lg:block" />
        <div className="absolute top-60 right-32 w-1 h-1 bg-brand-blue/80 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-brand-gold/50 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '2s' }} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center justify-center px-4 md:px-6 pt-8 pb-16 md:pb-24"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/40 bg-brand-blue/10 backdrop-blur-sm shadow-lg shadow-brand-blue/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              <span className="text-brand-blue text-xs md:text-sm font-semibold tracking-wide">NASM Certified Fitness Expert</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-center max-w-4xl px-2 mb-6 md:mb-8"
          >
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              Transform Your
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mt-1">
              <span className="bg-gradient-to-r from-brand-blue via-blue-400 to-brand-gold bg-clip-text text-transparent">
                Fitness
              </span>
              <span className="text-white"> Journey</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-xl md:max-w-2xl mx-auto mb-3 leading-relaxed text-center px-4"
          >
            Personalized training & nutrition — built for <span className="text-white font-semibold">real results</span>.
            Start your transformation with <span className="text-brand-gold font-semibold">Coach Himanshu</span> today.
          </motion.p>

          {/* Social proof micro-text */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-8 md:mb-10">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-brand-navy bg-gradient-to-br from-brand-blue/60 to-brand-gold/60 flex items-center justify-center text-[10px] text-white font-bold">
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
              <span>clients transformed</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-sm sm:max-w-none px-4"
          >
            <a href="#plans" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-blue/40">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-brand-blue" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-500 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <span className="relative">Start Your Journey</span>
                <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </a>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-base border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
            >
              View Dashboard
            </button>
          </motion.div>
        </motion.div>

        {/* Stats bar — flush to bottom of hero */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full"
        >
          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/30 backdrop-blur-md">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-5 sm:py-6 px-3 sm:px-8 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-gold/30 transition-colors duration-200">
                  <stat.icon size={20} className="text-brand-gold" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-brand-gold to-yellow-300 bg-clip-text text-transparent leading-none">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-0.5">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-brand-navy-light/30 border-y border-brand-navy-light/20" aria-label="Why choose Coach Himanshu">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">
              Why Choose Coach Himanshu?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NASM Certified Bodybuilding Coach with <span className="text-brand-gold font-semibold">6+ professional diplomas</span>. Experience science-backed training that's <span className="text-brand-gold font-semibold">affordable</span>, <span className="text-brand-gold font-semibold">accessible</span>, and designed for real transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden bg-brand-navy-light border border-brand-navy-light/50 rounded-2xl hover:border-brand-gold/50 transition-all duration-500 cursor-pointer"
              >
                {/* Premium Image Background */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={`${feature.title} - Coach Himanshu Professional Fitness Expertise`}
                    className={`w-full h-full object-cover ${feature.imagePosition} transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100`}
                    loading="lazy"
                  />

                  {/* Lighter Gradient Overlay - only at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent"></div>

                  {/* Animated glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Section */}
                <div className="relative p-8 bg-gradient-to-b from-brand-navy to-brand-navy-light">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Decorative bottom line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Qualifications Marquee */}
      <section className="py-4 bg-gradient-to-r from-brand-navy-light/50 via-brand-navy-light/30 to-brand-navy-light/50 border-y border-brand-gold/10 overflow-hidden">
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-navy to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-navy to-transparent z-10"></div>

          <div className="flex animate-marquee whitespace-nowrap">
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
                className="inline-flex items-center gap-2 mx-4 px-4 py-2 bg-gradient-to-br from-brand-blue/10 to-brand-gold/5 border border-brand-gold/20 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-gold rounded-md flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 font-medium text-xs">{item.text}</span>
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
                className="inline-flex items-center gap-2 mx-4 px-4 py-2 bg-gradient-to-br from-brand-blue/10 to-brand-gold/5 border border-brand-gold/20 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-gold rounded-md flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 font-medium text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="py-12 md:py-16 px-4 md:px-6" aria-label="Fitness coaching plans">
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

          {/* Row 1 — Individual Plans */}
          <motion.p variants={itemVariants} className="text-center text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
            <span className="flex-1 h-px bg-brand-gold/20 max-w-[80px]"></span>
            <span className="text-brand-gold font-semibold uppercase tracking-wider text-xs">Individual Plans</span>
            <span className="flex-1 h-px bg-brand-gold/20 max-w-[80px]"></span>
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
            {plans.filter(p => !p.couple && !p.homeWorkout && !p.rehabilitation).map((plan) => (
              <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} onAddToCart={addToCart} />
              </motion.div>
            ))}
          </div>

          {/* Row 2 — Specialty + Couple Plans (same 4-col grid = same card size) */}
          <div className="mt-6 md:mt-8">
            {/* Mobile/tablet: single combined label */}
            <motion.div variants={itemVariants} className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <span className="flex-1 h-px bg-white/10"></span>
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Specialty &amp; Couple Plans</span>
              <span className="flex-1 h-px bg-white/10"></span>
            </motion.div>
            {/* Desktop: two labels aligned over their 2 columns each */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-4">
              <motion.div variants={itemVariants} className="col-span-2 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-cyan-500/20"></span>
                <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Specialty Plans</span>
                <span className="flex-1 h-px bg-cyan-500/20"></span>
              </motion.div>
              <motion.div variants={itemVariants} className="col-span-2 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-pink-500/20"></span>
                <span className="text-pink-400 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Couple Plans</span>
                <span className="flex-1 h-px bg-pink-500/20"></span>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
              {plans.filter(p => p.rehabilitation || p.homeWorkout || p.couple).map((plan) => (
                <motion.div key={plan.id} variants={itemVariants} viewport={{ once: true }} className="h-full">
                  <PlanCard {...plan} id={dbPlanIds[plan.dbName] ?? plan.id} onAddToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Rhynogrip Fitness Gear Partner Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-brand-navy-light/40 via-brand-navy to-brand-navy-light/40 border-y border-brand-gold/20 relative overflow-hidden" aria-label="Fitness gear partner Rhynogrip">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-brand-gold text-xs font-semibold">Premium Partner</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Fitness Gear Partner
            </h2>

            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/Rhynogrip.png"
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
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-brand-navy-light/80 to-brand-navy/80 p-6 rounded-3xl border border-brand-gold/30 backdrop-blur-sm overflow-hidden h-full flex items-center">
                <video
                  className="w-full h-auto rounded-2xl [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label="Rhynogrip Premium Gym Gear Products Showcase"
                  title="Professional Fitness Equipment by Rhynogrip - 10% OFF with Code COACHHIMANSHU"
                  style={{
                    pointerEvents: 'none',
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.play().catch(() => {
                      // Silently handle autoplay failures
                    });
                  }}
                >
                  <source src="/RHYNOGRIP_VIDEO.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>

            {/* Offer Details */}
            <motion.div variants={itemVariants} className="flex">
              <div className="bg-gradient-to-br from-brand-navy-light/60 to-brand-navy-light/30 p-5 rounded-2xl border border-brand-gold/30 backdrop-blur-sm flex flex-col justify-between w-full">
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
                  <div className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/10 border-2 border-brand-gold/50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-300 mb-1.5">Use Coupon Code</p>
                    <div className="flex items-center justify-between bg-brand-navy/60 rounded-lg p-2.5 border border-brand-gold/30">
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
                      <div className="w-4 h-4 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-300">Premium quality gym accessories</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-300">Engineered for professional athletes</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
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
      <section className="py-20 px-6 bg-brand-navy-light/50 border-y border-brand-navy-light/20" aria-label="Client testimonials">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
              <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
              <span className="text-brand-gold text-sm font-semibold">Client Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Real transformations, real results. Join <span className="text-brand-gold font-semibold">1000+ satisfied clients</span> who achieved their fitness goals with Coach Himanshu.
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
                  className="bg-gradient-to-br from-brand-navy-light to-brand-navy p-6 rounded-2xl border border-brand-gold/30 shadow-xl relative overflow-hidden hover:border-brand-gold/50 transition-all duration-300 flex flex-col"
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
                    <div className="inline-block px-3 py-1.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
                      <span className="text-brand-gold font-semibold text-xs">
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

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-brand-navy-light border border-brand-navy-light/50 rounded-full flex items-center justify-center hover:border-brand-gold/50 hover:bg-brand-navy-light/80 transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="text-gray-400 group-hover:text-brand-gold transition-colors" size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-brand-navy-light border border-brand-navy-light/50 rounded-full flex items-center justify-center hover:border-brand-gold/50 hover:bg-brand-navy-light/80 transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="text-gray-400 group-hover:text-brand-gold transition-colors" size={24} />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentTestimonial(pageIndex * TESTIMONIALS_PER_PAGE)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    pageIndex === currentPage
                      ? 'w-8 bg-brand-gold'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action - Share Your Story */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <p className="text-gray-400 mb-6 text-lg">
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

      <section className="py-20 px-6 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border-t border-brand-navy-light/20" aria-label="Get started with transformation">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-12 text-white text-center"
          >
            Ready to Start Your Transformation?
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Video */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-auto [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label="Train Today - Fitness Motivation Video by Coach Himanshu"
                  title="Start Your Fitness Journey Today with Coach Himanshu"
                  style={{
                    pointerEvents: 'none',
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.play().catch(() => {
                      // Silently handle autoplay failures
                    });
                  }}
                >
                  <source src="/train today.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>

            {/* Right Section - Get Started Today */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Get Started Today
              </h3>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
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

      <Footer />

      {/* Checkout Drawer */}
      <CheckoutDrawer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </>
  );
}
