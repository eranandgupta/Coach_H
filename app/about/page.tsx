'use client';

import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Target, TrendingUp, Youtube, Dumbbell, GraduationCap, Heart, Sparkles, Quote, ArrowRight, Apple, Activity, HeartPulse, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const journeyMilestones = [
  {
    year: '2012',
    title: 'The Beginning',
    description: 'Started my fitness journey through karate, eventually winning 2 international medals and numerous national honors.',
    icon: Dumbbell
  },
  {
    year: '2015-2017',
    title: 'Resilience',
    description: 'Overcame a major injury and learned to balance passion with academic responsibilities during Class 12th and college admissions.',
    icon: Heart
  },
  {
    year: '2018',
    title: 'True Calling',
    description: 'Discovered strength training and the gym. What started as casual workouts evolved into a lifelong passion.',
    icon: TrendingUp
  },
  {
    year: '2021',
    title: 'Deep Dive',
    description: 'Shifted focus from training to studying fitness science, pursuing multiple professional diplomas and certifications.',
    icon: BookOpen
  },
  {
    year: '2022',
    title: 'Professional Journey',
    description: 'Began personal training while lecturing at fitness institutions and launched Coach Himanshu YouTube channel.',
    icon: Users
  },
  {
    year: '2024',
    title: 'Full Commitment',
    description: 'Left my lecturer role to focus entirely on personal training and creating evidence-based content.',
    icon: Youtube
  },
  {
    year: '2025',
    title: 'CoachHimanshu Platform',
    description: 'Founded the platform with a mission to make fitness guidance affordable, accessible, and science-backed for everyone.',
    icon: Sparkles
  }
];

const qualifications = [
  { title: 'Diploma in Personal Training', icon: Dumbbell },
  { title: 'Diploma in Master Training', icon: GraduationCap },
  { title: 'Diploma in Sports Nutrition', icon: Apple },
  { title: 'Diploma in TRX Suspension Training', icon: Activity },
  { title: 'Diploma in Special Population Training', icon: HeartPulse },
  { title: 'NASM Certified Bodybuilding Preparation Coach (USA)', icon: Trophy }
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-navy-light to-brand-navy">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 bg-gradient-to-r from-brand-blue/20 to-brand-gold/20 border border-brand-blue/30 rounded-full text-brand-gold font-semibold text-sm tracking-wide">
                THE JOURNEY BEHIND THE VISION
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-brand-blue to-brand-gold bg-clip-text text-transparent leading-tight"
            >
              Himanshu Kataria
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Certified Fitness Expert, Educator & Founder of CoachHimanshu Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-gold" />
                <span>NASM Certified</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-blue" />
                <span>6+ Professional Diplomas</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-gold" />
                <span>Fitness Educator</span>
              </div>
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

      {/* Story Section */}
      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Story
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image Section */}
            <motion.div
              {...fadeInUp}
              className="relative overflow-hidden rounded-3xl group order-2 lg:order-1"
            >
              <div className="relative h-[400px] lg:h-[600px]">
                <img
                  src="/CH3.jpeg"
                  alt="Coach Himanshu - Fitness Journey"
                  className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Decorative Elements */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <p className="text-white font-bold text-lg mb-1">From Karate Champion</p>
                    <p className="text-gray-300 text-sm">To Certified Fitness Expert</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Section */}
            <motion.div
              {...fadeInUp}
              className="order-1 lg:order-2"
            >
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  My fitness journey began in <span className="text-brand-gold font-semibold">2012</span>, when I entered the world of karate. Over the years, I represented at multiple levels, winning <span className="text-brand-gold font-semibold">two international medals</span> along with several national, state, and district honors.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  In 2015, an injury forced me to step away from karate for nearly two years. I returned in 2017, but with academics (Class 12th boards and college admissions) taking priority, I couldn't fully commit. That phase, however, taught me <span className="text-brand-blue font-semibold">resilience and balance</span> between passion and responsibility.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  In <span className="text-brand-gold font-semibold">2018</span>, after joining college, I discovered my true calling—<span className="text-brand-blue font-semibold">strength training and the gym</span>. What started as casual workouts soon grew into a passion. By 2021, I shifted focus from just training to studying fitness science in depth.
                </p>
                <div className="bg-gradient-to-r from-brand-blue/10 to-brand-gold/10 border border-brand-gold/30 rounded-2xl p-6">
                  <p className="text-white text-lg leading-relaxed font-medium">
                    Today, my journey reflects one belief: <span className="text-brand-gold font-bold">fitness is not about shortcuts, but about knowledge, discipline, and consistency</span>. And through CoachHimanshu Platform, I want to empower as many people as possible to build healthier, stronger lives.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-transparent to-brand-navy-light/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Journey
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From a karate champion to a certified fitness expert—every step shaped the mission
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-gold to-brand-blue opacity-30"></div>

            <div className="space-y-12">
              {journeyMilestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={milestone.year}
                    variants={fadeInUp}
                    className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Desktop: Left/Right Content */}
                    <div className={`hidden md:block md:w-1/2 ${isEven ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-block"
                      >
                        <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${isEven ? 'ml-auto' : 'mr-auto'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            {isEven && (
                              <>
                                <h3 className="text-2xl font-bold text-white">{milestone.title}</h3>
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                              </>
                            )}
                            {!isEven && (
                              <>
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{milestone.title}</h3>
                              </>
                            )}
                          </div>
                          <p className="text-gray-400 leading-relaxed">{milestone.description}</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center border-4 border-brand-navy shadow-lg shadow-brand-blue/50"
                      >
                        <span className="text-white font-bold text-xs text-center leading-tight">{milestone.year}</span>
                      </motion.div>
                    </div>

                    {/* Desktop: Empty space on other side */}
                    <div className="hidden md:block md:w-1/2"></div>

                    {/* Mobile: Content */}
                    <div className="md:hidden ml-20 w-full pr-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Professional Qualifications
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-blue to-brand-gold mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">
              Backed by science, driven by passion
            </p>
          </motion.div>

          {/* Image and Qualifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Professional Image */}
            <motion.div
              {...fadeInUp}
              className="relative overflow-hidden rounded-3xl group h-[400px] lg:h-auto"
            >
              <div className="absolute inset-0">
                <img
                  src="/CH7.jpeg"
                  alt="Coach Himanshu - Professional Qualifications"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  6+ Professional Certifications
                </h3>
                <p className="text-gray-300 text-lg">
                  Continuously evolving through education
                </p>
              </div>
            </motion.div>

            {/* Qualifications List */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-4"
            >
              {qualifications.map((qual, index) => {
                const QualIcon = qual.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-brand-gold/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-gold rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-brand-gold/50 transition-all">
                        <QualIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg leading-snug">{qual.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            {...fadeInUp}
            className="mt-12 bg-gradient-to-r from-brand-blue/20 to-brand-gold/20 border border-brand-gold/30 rounded-2xl p-8 text-center"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              After completing my initial diplomas, I began <span className="text-brand-gold font-semibold">lecturing in fitness institutions</span>, teaching and mentoring aspiring trainers while continuing my own growth. Alongside, I launched my YouTube channel – <span className="text-brand-blue font-semibold">Coach Himanshu</span>, dedicated to spreading evidence-based knowledge in exercise science and nutrition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-transparent to-brand-navy-light/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            {...fadeInUp}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-navy to-gray-900 opacity-95"></div>

            {/* Animated Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="relative z-10 p-8 md:p-16 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-white/20">
                  <Target className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                The Mission
              </h2>

              <div className="w-20 h-1 bg-white/30 mx-auto mb-8"></div>

              <p className="text-white/90 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-8">
                In 2025, I founded <span className="font-bold text-brand-gold">CoachHimanshu Platform</span> with a clear mission:
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto"
              >
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                  To make fitness guidance <span className="text-brand-gold">affordable</span>, <span className="text-brand-gold">accessible</span>, and <span className="text-brand-gold">science-backed</span> so that money is never an excuse for anyone to stay unfit.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-lg mt-8 max-w-3xl mx-auto"
              >
                While YouTube continues to educate people with the fundamentals of exercise and nutrition science, <span className="font-semibold">CoachHimanshu Platform</span> is designed for those who seek <span className="text-brand-gold font-semibold">personalized training and real transformation</span>.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Channel Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-brand-navy-light/30 to-transparent">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            {...fadeInUp}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-brand-navy to-red-800/20"></div>

            {/* Animated YouTube Orbs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="relative z-10 p-8 md:p-12">
              {/* Header with Icon */}
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/50">
                    <Youtube className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                  Free Fitness Knowledge on YouTube
                </h2>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Video Embed */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-600/20 border border-red-600/30"
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/MWhlDIAtQMc?si=cnLQfVXwMRJvN9X9"
                      title="Coach Himanshu YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>

                {/* Right: Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center lg:text-left"
                >
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    Subscribe to <span className="text-red-400 font-semibold">Coach Himanshu Kataria</span> on YouTube for free, evidence-based fitness and nutrition content. Learn the fundamentals of exercise science and start your journey today!
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Want personalized training and real transformation? Check out our subscription plans below.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <motion.a
                      href="https://www.youtube.com/@CoachHimanshuKataria"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
                    >
                      <Youtube className="w-5 h-5" />
                      Subscribe on YouTube
                    </motion.a>
                    <motion.a
                      href="/#plans"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-gold text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.5)] transition-all duration-300"
                    >
                      <Target className="w-5 h-5" />
                      View Subscription Plans
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
      <Footer />
    </>
  );
}
