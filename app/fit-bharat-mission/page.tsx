'use client';

import { motion } from 'framer-motion';
import {
  Dumbbell,
  Apple,
  Target,
  AlertTriangle,
  Youtube,
  ArrowRight,
  Heart,
  CheckCircle2,
  Flame,
  Salad,
  Beef,
  Leaf,
  Clock,
  Sparkles,
  Flag
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import Button from '@/components/Button';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const workoutPlans = [
  {
    id: 1,
    title: 'General Mix Workout',
    subtitle: 'Full Body - 5 Days/Week',
    icon: Dumbbell,
    days: [
      {
        name: 'Day 1 - Full Body A',
        exercises: [
          'Squats - 3x12',
          'Push-ups - 3x10',
          'Lat Pulldown / Pull-ups - 3x10',
          'Shoulder Press - 3x12',
          'Plank - 3x30 sec'
        ]
      },
      {
        name: 'Day 2 - Full Body B',
        exercises: [
          'Leg Press - 3x12',
          'Chest Press - 3x10',
          'Seated Row - 3x12',
          'Lateral Raises - 3x15',
          'Crunches - 3x15'
        ]
      },
      {
        name: 'Day 3',
        exercises: ['Rest / Active Recovery']
      },
      {
        name: 'Day 4',
        exercises: ['Full Body A (Repeat)']
      },
      {
        name: 'Day 5',
        exercises: ['Full Body B (Repeat)']
      }
    ],
    note: 'Rest: 60-90 sec | Progressive overload weekly'
  },
  {
    id: 2,
    title: 'Single Muscle Split',
    subtitle: '6 Days Training',
    icon: Target,
    days: [
      {
        name: 'Day 1 - Chest',
        exercises: [
          'Bench Press - 4x8',
          'Incline DB Press - 3x10',
          'Chest Fly - 3x12',
          'Push-ups - 2 sets failure'
        ]
      },
      {
        name: 'Day 2 - Back',
        exercises: [
          'Lat Pulldown - 4x10',
          'Barbell Row - 3x8',
          'Seated Cable Row - 3x12',
          'Shrugs - 3x15'
        ]
      },
      {
        name: 'Day 3 - Shoulders',
        exercises: [
          'Shoulder Press - 4x8',
          'Lateral Raises - 4x12',
          'Rear Delt Fly - 3x15',
          'Front Raises - 3x12'
        ]
      },
      {
        name: 'Day 4 - Arms',
        exercises: [
          'Barbell Curl - 3x10',
          'Tricep Pushdown - 3x12',
          'Hammer Curl - 3x12',
          'Overhead Extension - 3x12'
        ]
      },
      {
        name: 'Day 5 - Legs',
        exercises: [
          'Squats - 4x8',
          'Leg Press - 3x12',
          'Leg Curl - 3x12',
          'Calf Raises - 4x15'
        ]
      },
      {
        name: 'Day 6 - Core + Cardio',
        exercises: [
          'Plank - 3x40 sec',
          'Hanging Leg Raises - 3x10',
          '20-30 min cardio'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Push Workout',
    subtitle: 'Chest + Shoulders + Triceps',
    icon: Flame,
    days: [
      {
        name: 'Push Day',
        exercises: [
          'Bench Press - 4x8',
          'Incline DB Press - 3x10',
          'Shoulder Press - 3x10',
          'Lateral Raises - 3x15',
          'Tricep Pushdown - 3x12',
          'Overhead Extension - 3x12'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Pull Workout',
    subtitle: 'Back + Biceps',
    icon: Target,
    days: [
      {
        name: 'Pull Day',
        exercises: [
          'Pull-ups / Lat Pulldown - 4x10',
          'Barbell Row - 3x8',
          'Seated Row - 3x12',
          'Face Pull - 3x15',
          'Barbell Curl - 3x10',
          'Hammer Curl - 3x12'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Leg Workout',
    subtitle: 'Complete Lower Body',
    icon: Dumbbell,
    days: [
      {
        name: 'Leg Day',
        exercises: [
          'Squats - 4x8',
          'Leg Press - 3x12',
          'Romanian Deadlift - 3x10',
          'Leg Curl - 3x12',
          'Leg Extension - 3x12',
          'Standing Calf Raise - 4x15'
        ]
      }
    ]
  }
];

const dietPlans = [
  {
    id: 1,
    title: 'Fat Loss - Vegetarian',
    subtitle: 'Under 1800 kcal',
    icon: Leaf,
    badge: 'VEG',
    badgeColor: 'text-green-400 border-green-400/30 bg-green-400/10',
    meals: [
      { time: 'Morning', items: ['Warm water + lemon', '5 soaked almonds'] },
      { time: 'Breakfast', items: ['Oats (40g) + skim milk', '1 fruit'] },
      { time: 'Lunch', items: ['2 multigrain roti', 'Paneer/Tofu (100g)', 'Mixed veg sabzi', 'Salad'] },
      { time: 'Snack', items: ['Roasted chana / fruit', 'Green tea'] },
      { time: 'Dinner', items: ['Dal or curd', 'Veg sabzi', '1 roti'] }
    ]
  },
  {
    id: 2,
    title: 'Fat Loss - Non-Vegetarian',
    subtitle: 'Under 1800 kcal',
    icon: Beef,
    badge: 'NON-VEG',
    badgeColor: 'text-red-400 border-red-400/30 bg-red-400/10',
    meals: [
      { time: 'Breakfast', items: ['3 egg whites + 1 whole egg', '1 slice brown bread'] },
      { time: 'Lunch', items: ['Grilled chicken/fish (120g)', 'Rice (100g cooked)', 'Veg salad'] },
      { time: 'Snack', items: ['Fruit or peanuts (20g)'] },
      { time: 'Dinner', items: ['Omelette / chicken curry', 'Veg sabzi'] }
    ]
  },
  {
    id: 3,
    title: 'Muscle Gain - Vegetarian',
    subtitle: 'Under 2500 kcal',
    icon: Salad,
    badge: 'VEG',
    badgeColor: 'text-green-400 border-green-400/30 bg-green-400/10',
    meals: [
      { time: 'Breakfast', items: ['Oats + milk + peanut butter'] },
      { time: 'Mid-Meal', items: ['Fruit + nuts'] },
      { time: 'Lunch', items: ['Rice / roti', 'Paneer (150g)', 'Dal + veg'] },
      { time: 'Workout Snack', items: ['Banana / black coffee'] },
      { time: 'Post Workout', items: ['Whey protein / curd'] },
      { time: 'Dinner', items: ['Roti', 'Tofu / paneer', 'Veg sabzi'] }
    ]
  },
  {
    id: 4,
    title: 'Muscle Gain - Non-Vegetarian',
    subtitle: 'Under 2500 kcal',
    icon: Beef,
    badge: 'NON-VEG',
    badgeColor: 'text-red-400 border-red-400/30 bg-red-400/10',
    meals: [
      { time: 'Breakfast', items: ['4 eggs + oats'] },
      { time: 'Mid-Meal', items: ['Fruit + peanuts'] },
      { time: 'Lunch', items: ['Rice', 'Chicken (150-180g)', 'Veg'] },
      { time: 'Pre Workout', items: ['Banana'] },
      { time: 'Post Workout', items: ['Whey protein'] },
      { time: 'Dinner', items: ['Chicken/fish', 'Roti + veg'] }
    ]
  }
];

const disclaimerPoints = [
  'Your age',
  'Height, weight, body fat',
  'Medical conditions',
  'Lifestyle & job',
  'Strength level & experience'
];

const platformFeatures = [
  'Personalised Workout Plan',
  'Personalised Diet Plan',
  'Exercise Tutorial Videos',
  'Weekly 1-on-1 Video Call Assessment',
  'Routine updates every week'
];

export default function FitBharatMissionPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-navy-light to-brand-navy">

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Indian Flag Colors Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Republic Day Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 border border-orange-500/30 rounded-full"
              >
                <Flag className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold text-sm tracking-wide">
                  26 January 2026 - Republic Day Special
                </span>
                <Flag className="w-5 h-5 text-green-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                  Fit Bharat Mission
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
              >
                FREE General Workout & Diet Plans for Everyone
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-base md:text-lg text-brand-gold mb-8 max-w-2xl mx-auto"
              >
                Science-based, practical, and beginner-friendly plans to help you start your fitness journey the right way
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <a href="#workout-plans">
                  <Button variant="primary" className="gap-2">
                    <Dumbbell size={18} />
                    View Workout Plans
                  </Button>
                </a>
                <a href="#diet-plans">
                  <Button variant="outline" className="gap-2">
                    <Apple size={18} />
                    View Diet Plans
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* About Fit Bharat Mission */}
        <section className="py-16 md:py-20 relative">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 border border-white/20 rounded-full mb-4">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-white text-sm font-semibold">ABOUT THE INITIATIVE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What is Fit Bharat Mission?
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 mx-auto"></div>
            </motion.div>

            <motion.div {...fadeInUp} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-white font-medium text-center mb-8 leading-relaxed">
                  A <span className="text-brand-gold">free public health initiative</span> by Coach Himanshu, created with one simple goal:
                </p>

                <div className="bg-gradient-to-r from-orange-500/20 via-brand-navy to-green-500/20 border border-brand-gold/30 rounded-2xl p-6 md:p-8 mb-8">
                  <p className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                    To make India healthier, stronger, and more fitness-aware.
                  </p>
                </div>

                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    In today's time, lifestyle diseases like <span className="text-red-400 font-semibold">obesity, diabetes, blood pressure, heart problems, joint pain, and mental stress</span> are rising rapidly — mainly due to wrong food habits, sedentary lifestyle, misinformation, and lack of scientific guidance.
                  </p>

                  <div className="bg-brand-navy/50 border border-white/10 rounded-xl p-6">
                    <p className="text-white font-medium">
                      <span className="text-brand-gold font-bold">Fit Bharat Mission</span> was launched to:
                    </p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <span>Break myths and spread <span className="text-white font-semibold">real fitness education</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <span>Provide <span className="text-white font-semibold">free, practical workout & diet plans</span> that any Indian can follow safely</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <span>Make <span className="text-white font-semibold">scientific fitness guidance accessible</span> to everyone</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Important Note Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <motion.div
              {...fadeInUp}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-2 border-yellow-500/50 rounded-3xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-3">
                    Important Note (Please Read)
                  </h3>
                  <p className="text-gray-300 text-lg mb-4">
                    These are <span className="text-white font-semibold">GENERAL PLANS</span> made for the public.
                  </p>
                  <p className="text-gray-300">
                    For best, faster & safer results, a <span className="text-brand-gold font-semibold">customised plan</span> according to your body, lifestyle, medical history & goals is always recommended.
                  </p>
                  <div className="mt-6 p-4 bg-brand-navy/50 rounded-xl border border-brand-gold/30">
                    <p className="text-gray-300">
                      If you want a <span className="text-white font-semibold">personalised workout + diet + weekly 1-on-1 video call assessment</span>, you can join Coach Himanshu Platform at a very affordable price.
                    </p>
                    <a href="/#plans" className="inline-block mt-4">
                      <Button variant="primary" className="gap-2">
                        <ArrowRight size={18} />
                        View Subscription Plans
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Workout Plans Section */}
        <section id="workout-plans" className="py-16 md:py-24 bg-gradient-to-b from-transparent to-brand-navy-light/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div {...fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
                <Dumbbell className="w-4 h-4 text-brand-gold" />
                <span className="text-brand-gold text-sm font-semibold">FREE WORKOUT PLANS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                General Workout Plans
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto"></div>
            </motion.div>

            <div className="space-y-6">
              {workoutPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all duration-300 group"
                >
                  {/* Plan Header */}
                  <div className="p-6 md:p-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-brand-gold/30 transition-colors">
                        <plan.icon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{plan.title}</h3>
                        <p className="text-gray-400">{plan.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plan Content */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.days.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="bg-white/[0.03] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <h4 className="text-white font-medium mb-3 text-sm">{day.name}</h4>
                          <ul className="space-y-2">
                            {day.exercises.map((exercise, exIndex) => (
                              <li key={exIndex} className="text-gray-400 text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-brand-gold/60 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {plan.note && (
                      <div className="mt-6 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-gold/70" />
                          {plan.note}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Diet Plans Section */}
        <section id="diet-plans" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div {...fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
                <Apple className="w-4 h-4 text-brand-gold" />
                <span className="text-brand-gold text-sm font-semibold">FREE DIET PLANS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                General Diet Plans
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all duration-300 group"
                >
                  {/* Plan Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-brand-gold/30 transition-colors">
                          <plan.icon className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                          <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    </div>
                  </div>

                  {/* Plan Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {plan.meals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="flex gap-4"
                        >
                          <div className="w-28 flex-shrink-0">
                            <span className="text-white/70 font-medium text-sm">{meal.time}</span>
                          </div>
                          <div className="flex-1">
                            <ul className="space-y-1.5">
                              {meal.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-400 text-sm flex items-start gap-2">
                                  <div className="w-1 h-1 bg-brand-gold/60 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <motion.div
              {...fadeInUp}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border-2 border-red-500/50 rounded-3xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-2">
                  Very Important Disclaimer
                </h3>
                <p className="text-xl text-white">
                  These are GENERAL PLANS
                </p>
              </div>

              <div className="mb-8">
                <p className="text-gray-300 text-center mb-6">They do not consider:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {disclaimerPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-brand-navy/50 rounded-xl p-4 text-center border border-white/10"
                    >
                      <p className="text-white font-medium text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-brand-gold/20 to-orange-500/20 border border-brand-gold/50 rounded-2xl p-6 text-center">
                <p className="text-white text-lg mb-2">
                  For best results, injury-free progress & faster transformation
                </p>
                <p className="text-brand-gold font-bold text-xl">
                  A customised plan is essential
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-brand-navy-light/30 to-transparent">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <motion.div
              {...fadeInUp}
              className="relative overflow-hidden rounded-3xl"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 via-brand-navy to-brand-gold/30"></div>

              {/* Animated Orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

              <div className="relative z-10 p-8 md:p-16">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/20 border border-brand-gold/30 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-gold text-sm font-semibold">PREMIUM COACHING</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Coach Himanshu Platform
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Subscription Plans for Personalised Guidance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                  {platformFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {['1 Month', '3 Months', '6 Months', '1 Year (Best Value)'].map((plan, index) => (
                    <div
                      key={index}
                      className={`px-6 py-3 rounded-full border ${
                        index === 3
                          ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                          : 'bg-white/5 border-white/20 text-gray-300'
                      }`}
                    >
                      {plan}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-brand-gold text-lg mb-6">
                    Affordable pricing - because fitness should be accessible to everyone
                  </p>
                  <a href="/#plans">
                    <Button variant="primary" className="gap-2 text-lg px-8 py-4">
                      <ArrowRight size={20} />
                      View Subscription Plans
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final Message Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <motion.div
              {...fadeInUp}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Final Message from Coach Himanshu
              </h2>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Start with these free plans, learn <span className="text-brand-gold font-semibold">consistency</span>, <span className="text-brand-gold font-semibold">discipline</span> & <span className="text-brand-gold font-semibold">correct basics</span>.
                </p>
                <p>
                  When you're ready for next-level results, I'll personally guide you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <a href="/#plans">
                  <Button variant="primary" className="gap-2">
                    <Target size={18} />
                    Join Coach Himanshu Platform
                  </Button>
                </a>
                <a
                  href="https://www.youtube.com/@CoachHimanshuKataria"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    <Youtube size={18} />
                    Learn Free on YouTube
                  </Button>
                </a>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-orange-500/10 via-white/5 to-green-500/10 border border-white/10 rounded-2xl">
                <p className="text-white text-xl font-bold mb-2">
                  Train smart. Eat right. Stay consistent.
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                  Jai Bharat
                </p>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
