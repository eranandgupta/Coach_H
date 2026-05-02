'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  UtensilsCrossed,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Crown,
  ArrowRight,
  LogOut,
  Bell,
  Key,
  Play,
  FileText,
  Clock,
  ChevronRight,
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ViewWorkoutModal from '@/components/modals/ViewWorkoutModal';
import ViewDietModal from '@/components/modals/ViewDietModal';
import EditAssessmentModal from '@/components/modals/EditAssessmentModal';
import LatestBlogWidget from '@/components/LatestBlogWidget';
import NotificationPanel from '@/components/NotificationPanel';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import DashboardLoader from '@/components/DashboardLoader';
import VideoLibrary from '@/components/VideoLibrary';
import FunFactWidget from '@/components/FunFactWidget';
import LiveSessionWidget from '@/components/LiveSessionWidget';
import { usePushNotifications } from '@/lib/usePushNotifications';
import { isElitePlan, getTotalSessions } from '@/lib/planUtils';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [selectedDietIndex, setSelectedDietIndex] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isEditAssessmentOpen, setIsEditAssessmentOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);

  // Push notifications
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNotificationCount();

    // Auto-refresh notifications every 30 seconds
    const notificationInterval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);

    // Auto-refresh dashboard data every 2 minutes
    const dashboardInterval = setInterval(() => {
      fetchDashboardData();
    }, 120000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(dashboardInterval);
    };
  }, []);

  // Auto-subscribe to push notifications if supported and not already subscribed
  useEffect(() => {
    if (isSupported && !isSubscribed && user) {
      // Wait a bit before requesting permission (better UX)
      const timer = setTimeout(() => {
        subscribe();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed, user, subscribe]);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        // Get viewed notifications from localStorage
        const viewedNotifications = JSON.parse(
          localStorage.getItem('viewedNotifications') || '[]'
        );

        // Count only unviewed notifications
        const unviewedCount = data.filter(
          (notif: any) => !viewedNotifications.includes(notif.id)
        ).length;

        setNotificationCount(unviewedCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // In production, get token from localStorage or cookies
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      // Fetch user and subscription data
      const userRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      // Check if client has completed assessment (coaches and admins skip this check)
      if (userData.user.role !== 'coach' && userData.user.role !== 'admin' && !userData.user.assessmentCompleted) {
        router.push('/assessment');
        return;
      }

      setUser(userData.user);
      setSubscription(userData.subscription);

      // Fetch workouts
      const workoutRes = await fetch('/api/workouts/my-workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (workoutRes.ok) {
        const workoutData = await workoutRes.json();
        setWorkouts(workoutData.currentWorkouts);
      }

      // Fetch diets
      const dietRes = await fetch('/api/diets/my-diets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (dietRes.ok) {
        const dietData = await dietRes.json();
        setDiets(dietData.currentDiets);
      }

      // Fetch blog posts
      const blogRes = await fetch('/api/blog');
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogPosts(blogData.slice(0, 6)); // Get latest 6 posts
      }

      // Fetch completed sessions for Elite 1:1 plans
      const subPlanName = userData.subscription?.subscription?.plan?.name || '';
      if (isElitePlan(subPlanName) && userData.subscription?.subscription?.id) {
        const sessRes = await fetch(`/api/sessions?subscriptionId=${userData.subscription.subscription.id}`);
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          setCompletedSessions(sessData.sessions.map((s: any) => s.sessionNumber));
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getSubscriptionProgress = () => {
    if (!subscription?.subscription) return 0;
    const start = new Date(subscription.subscription.startDate).getTime();
    const end = new Date(subscription.subscription.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;
    // Clamp between 0-100, show minimum 1% if subscription has started
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    return clampedProgress > 0 && clampedProgress < 1 ? 1 : clampedProgress;
  };

  const getWeekMilestones = () => {
    if (!subscription?.subscription) return [];
    const pName = subscription.subscription.plan?.name || '';

    // Elite 1:1 plans: session-based milestones (confirmed by coach)
    if (isElitePlan(pName)) {
      const total = getTotalSessions(pName) || 24;
      const milestones = [];
      for (let i = 1; i <= total; i++) {
        milestones.push({
          id: i,
          label: `S${i}`,
          progress: ((i - 1) / Math.max(total - 1, 1)) * 100,
          isPassed: completedSessions.includes(i),
          isCurrent: false,
        });
      }
      return milestones;
    }

    const start = new Date(subscription.subscription.startDate);
    const end = new Date(subscription.subscription.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const now = new Date();
    const currentDay = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const milestones = [];
    const totalMonths = Math.round(totalDays / 30);

    // Plans <= 3 months: show weeks (W1, W2, ...)
    // Plans > 3 months: show months (M1, M2, ...)
    if (totalMonths <= 3) {
      const totalWeeks = Math.ceil(totalDays / 7);
      const currentWeek = Math.min(Math.ceil(currentDay / 7), totalWeeks);
      for (let i = 1; i <= totalWeeks; i++) {
        milestones.push({
          id: i,
          label: `W${i}`,
          progress: ((i - 1) / Math.max(totalWeeks - 1, 1)) * 100,
          isPassed: i <= currentWeek,
          isCurrent: i === currentWeek,
        });
      }
    } else {
      const currentMonth = Math.min(Math.ceil(currentDay / 30), totalMonths);
      for (let i = 1; i <= totalMonths; i++) {
        milestones.push({
          id: i,
          label: `M${i}`,
          progress: ((i - 1) / Math.max(totalMonths - 1, 1)) * 100,
          isPassed: i <= currentMonth,
          isCurrent: i === currentMonth,
        });
      }
    }
    return milestones;
  };

  if (loading) {
    return <DashboardLoader />;
  }

  const isSubscriptionActive = subscription?.isActive;
  const currentWorkout = workouts[0];
  const currentDiet = diets[selectedDietIndex] || diets[0];
  const planName = subscription?.subscription?.plan?.name || '';
  const isLiveSessionPlan = planName === 'She Strong Program' || planName === 'Active Parents Program';
  const isEliteOneOnOnePlan = planName.startsWith('Elite 1:1');

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 navbar-glass">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Coach Himanshu"
              width={90}
              height={90}
              className="object-contain w-[60px] md:w-[90px]"
            />
          </Link>

          <div className="flex-1 text-center hidden md:block">
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              Welcome, {user?.name || 'Champion'}! 💪
            </h1>
            <p className="text-gray-300 text-xs lg:text-sm">Let's crush your fitness goals today</p>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            {!isLiveSessionPlan && <button
              onClick={() => setIsVideoLibraryOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.03) 100%)' }}
              title="Video Library"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            </button>}
            <button
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative flex items-center justify-center p-2 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.1) 0%, rgba(23,95,255,0.03) 100%)' }}
            >
              <Bell className={`w-4 h-4 md:w-5 md:h-5 text-brand-blue ${notificationCount > 0 ? 'animate-pulse' : ''}`} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all hidden sm:flex"
              style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(234,179,8,0.03) 100%)' }}
              title="Change Password"
            >
              <Key className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border border-white/[0.08] hover:border-red-500/20 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.03) 100%)' }}
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              <span className="hidden lg:inline text-red-400 text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 md:pt-28 pb-20 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Welcome (shown only on small screens) */}
          <div className="md:hidden mb-5">
            <h1 className="text-2xl font-bold text-white mb-1">
              Hi {user?.name?.split(' ')[0] || 'Champion'},
            </h1>
            <p className="text-gray-400 text-sm">Welcome back! Let's crush it today</p>
          </div>

        {/* Subscription Status Card - Compact & Aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-6 md:mb-8 p-4 md:p-5 rounded-2xl backdrop-blur-xl border overflow-hidden glass-card ${
            isSubscriptionActive
              ? 'border-green-500/15'
              : 'border-red-500/15'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isSubscriptionActive ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  {isSubscriptionActive ? 'Active Subscription' : 'Subscription Expired'}
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  {isSubscriptionActive
                    ? subscription?.subscription?.plan?.name
                    : subscription?.message || 'Please renew to continue'}
                </p>
                {/* Info Row - Days Left & Progress */}
                {isSubscriptionActive && subscription?.subscription && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-500/10 border border-gray-500/20 rounded-lg backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span className="text-xs text-gray-300 font-medium">
                        {getDaysRemaining(subscription.subscription.endDate)} days left
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50"></div>
                      <span className="text-xs font-medium text-green-400">
                        {Math.round(getSubscriptionProgress())}% Complete
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Assessment Badge with Edit Button */}
            {user?.assessmentCompleted && (
              <button
                onClick={() => setIsEditAssessmentOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-blue/20 border border-brand-blue/30 rounded-lg backdrop-blur-sm flex-shrink-0 hover:bg-brand-blue/30 transition-all group"
                title="Click to edit your assessment"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-xs font-medium whitespace-nowrap">Assessment ✓</span>
                <Edit3 className="w-3 h-3 text-white" />
              </button>
            )}

            {/* Renew Button (if expired) */}
            {!isSubscriptionActive && (
              <Link
                href="/#plans"
                className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                Renew
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Timeline Section */}
          {isSubscriptionActive && subscription?.subscription && (
            <div className="space-y-3 mt-4 pt-4 border-t border-white/5 pb-1">
              {/* Dates Row */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                    {new Date(subscription.subscription.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                    {new Date(subscription.subscription.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative px-1 mb-4">
                <div className="relative h-2 bg-gradient-to-r from-white/5 to-white/10 rounded-full overflow-hidden shadow-inner border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getSubscriptionProgress()}%` }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/30"
                  />
                  {/* Shimmer Effect */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getSubscriptionProgress()}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
                  >
                    <motion.div
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                      className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Week Milestones - Responsive */}
              <div className="relative">
                <div className="grid gap-1.5 md:gap-2 px-0 md:px-1 pb-2 pt-1" style={{ gridTemplateColumns: `repeat(${getWeekMilestones().length}, 1fr)` }}>
                  {getWeekMilestones().map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.4 + index * 0.03
                      }}
                    >
                      <div
                        className={`relative flex flex-col items-center justify-center w-full h-10 md:h-11 rounded-xl transition-all duration-300 ${
                          milestone.isCurrent
                            ? 'bg-gradient-to-br from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/40 ring-2 ring-brand-blue/30 scale-105'
                            : milestone.isPassed
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                            : 'bg-white/5 text-gray-500 border border-white/10'
                        }`}
                      >
                        <span className={`text-[11px] font-bold ${milestone.isCurrent ? 'text-white' : ''}`}>
                          {milestone.label}
                        </span>
                        {milestone.isCurrent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: 'spring' }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f1628] shadow-lg"
                          />
                        )}
                        {milestone.isPassed && !milestone.isCurrent && (
                          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Fun Fact Widget — shown for all plans */}
        <FunFactWidget />

        {/* Elite 1:1 Plans — show live session widget alongside regular dashboard */}
        {isEliteOneOnOnePlan && isSubscriptionActive && (
          <LiveSessionWidget planName={planName} />
        )}

        {/* Live Session Plans — show different dashboard */}
        {isLiveSessionPlan && !isEliteOneOnOnePlan && isSubscriptionActive && (
          <>
          <LiveSessionWidget planName={planName} />

          {/* Blog Posts for Live Session Users */}
          {blogPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 rounded-xl border border-brand-blue/20">
                    <FileText className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Latest Articles</h2>
                    <p className="text-gray-500 text-xs">Fitness tips & insights</p>
                  </div>
                </div>
                <Link href="/blog">
                  <button className="flex items-center gap-1 text-brand-blue hover:text-brand-gold text-sm font-medium transition-colors">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Carousel Container */}
              <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none lg:hidden" />

                {/* Scrollable container */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-0 pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
                  {blogPosts.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex-shrink-0 w-72 lg:w-auto">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="group glass-card overflow-hidden hover:border-white/[0.12] transition-all duration-300 h-full"
                      >
                        {/* Cover Image */}
                        <div className="relative h-36 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-12 h-12 text-white/20" />
                            </div>
                          )}
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Read time badge */}
                          {post.readTime && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                              <Clock className="w-3 h-3 text-gray-300" />
                              <span className="text-[10px] text-gray-300 font-medium">{post.readTime} min</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'Draft'}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-white font-semibold line-clamp-2 group-hover:text-brand-blue transition-colors mb-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Read more */}
                          <div className="flex items-center gap-1 text-brand-blue text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                            <span>Read Article</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          </>
        )}

        {/* Regular Plans — stats, workouts, diets (also shown for Elite 1:1) */}
        {(!isLiveSessionPlan || isEliteOneOnOnePlan) && (
        <>
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-3 md:p-6 hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.03) 100%)' }}>
                <Dumbbell className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
              </div>
              <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400/60" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-0.5">{workouts.length}</h3>
            <p className="text-gray-500 text-[11px] md:text-sm">Active Workouts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-3 md:p-6 hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 100%)' }}>
                <UtensilsCrossed className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-400/60" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-0.5">{diets.length}</h3>
            <p className="text-gray-500 text-[11px] md:text-sm">Diet Plans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-3 md:p-6 hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.03) 100%)' }}>
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-0.5">
              {isEliteOneOnOnePlan ? (
                <><span className="hidden md:inline">Session </span><span className="md:hidden">S</span>{completedSessions.length}</>
              ) : (
                <><span className="hidden md:inline">Week </span><span className="md:hidden">W</span>{currentWorkout?.weekNumber || (subscription?.subscription?.startDate ? Math.max(1, Math.ceil((new Date().getTime() - new Date(subscription.subscription.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))) : 1)}</>
              )}
            </h3>
            <p className="text-gray-500 text-[11px] md:text-sm">{isEliteOneOnOnePlan ? 'Sessions Done' : 'Current Week'}</p>
          </motion.div>
        </div>

        {/* Blog Posts Carousel */}
        {blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 rounded-xl border border-brand-blue/20">
                  <FileText className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Latest Articles</h2>
                  <p className="text-gray-500 text-xs">Fitness tips & insights</p>
                </div>
              </div>
              <Link href="/blog">
                <button className="flex items-center gap-1 text-brand-blue hover:text-brand-gold text-sm font-medium transition-colors">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Carousel Container */}
            <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none lg:hidden" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none lg:hidden" />

              {/* Scrollable container */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-0 pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
                {blogPosts.map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="flex-shrink-0 w-72 lg:w-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="group glass-card overflow-hidden hover:border-white/[0.12] transition-all duration-300 h-full"
                    >
                      {/* Cover Image */}
                      <div className="relative h-36 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20 overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-white/20" />
                          </div>
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Read time badge */}
                        {post.readTime && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                            <Clock className="w-3 h-3 text-gray-300" />
                            <span className="text-[10px] text-gray-300 font-medium">{post.readTime} min</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Draft'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-semibold line-clamp-2 group-hover:text-brand-blue transition-colors mb-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-400 text-xs line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Read more */}
                        <div className="flex items-center gap-1 text-brand-blue text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                          <span>Read Article</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Plans Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Current Workout */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.03) 100%)' }}>
                  <Dumbbell className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Current Workout</h2>
              </div>
            </div>

            {currentWorkout ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentWorkout.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {currentWorkout.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{isEliteOneOnOnePlan ? `Session ${currentWorkout.weekNumber}` : `Week ${currentWorkout.weekNumber}`}</span>
                  </div>
                  <div className="text-gray-400">
                    {getDaysRemaining(currentWorkout.endDate)} days left
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Exercises ({currentWorkout.exercises?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {currentWorkout.exercises?.slice(0, 5).map((exercise: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-white font-medium">{exercise.name}</p>
                            <p className="text-gray-400 text-xs">{exercise.day}</p>
                          </div>
                          {exercise.exerciseType === 'superset' && (
                            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded text-[10px] font-semibold">SS</span>
                          )}
                          {exercise.exerciseType === 'dropset' && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-semibold">DS</span>
                          )}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                          {exercise.duration && exercise.sets && !exercise.reps && `${exercise.duration} min × ${exercise.sets} sets`}
                          {exercise.duration && !exercise.sets && `${exercise.duration} min`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsWorkoutModalOpen(true)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  View Full Workout
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No active workout plan</p>
                <p className="text-gray-500 text-sm">
                  Your coach will assign a workout plan soon
                </p>
              </div>
            )}
          </motion.div>

          {/* Current Diet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 100%)' }}>
                  <UtensilsCrossed className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Current Diet</h2>
              </div>
            </div>

            {diets.length > 1 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {diets.map((diet: any, idx: number) => (
                  <button
                    key={diet.id}
                    onClick={() => setSelectedDietIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedDietIndex === idx
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {diet.title || `Plan ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {currentDiet ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentDiet.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {currentDiet.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{isEliteOneOnOnePlan ? `Session ${currentDiet.weekNumber}` : `Week ${currentDiet.weekNumber}`}</span>
                  </div>
                  {currentDiet.targetCalories && (
                    <div className="text-gray-400">
                      {currentDiet.targetCalories} cal/day
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Meals ({currentDiet.meals?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {currentDiet.meals?.slice(0, 5).map((meal: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">{meal.name}</p>
                          <p className="text-gray-400 text-xs">
                            {meal.mealType} • {meal.day}
                          </p>
                        </div>
                        {meal.calories && (
                          <div className="text-gray-300 text-sm">
                            {meal.calories} cal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsDietModalOpen(true)}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  View Full Diet Plan
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No active diet plan</p>
                <p className="text-gray-500 text-sm">
                  Your coach will create a diet plan soon
                </p>
              </div>
            )}
          </motion.div>
        </div>
        </>
        )}
        </div>
      </div>

      {/* Modals */}
      <ViewWorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        workout={currentWorkout}
        userEmail={user?.email}
        isElitePlan={isEliteOneOnOnePlan}
      />
      <ViewDietModal
        isOpen={isDietModalOpen}
        onClose={() => setIsDietModalOpen(false)}
        diet={currentDiet}
        userEmail={user?.email}
        isElitePlan={isEliteOneOnOnePlan}
      />

      {/* Latest Blog Widget */}
      <LatestBlogWidget />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => {
          setIsNotificationPanelOpen(false);
          fetchNotificationCount();
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Video Library Modal */}
      <VideoLibrary
        isOpen={isVideoLibraryOpen}
        onClose={() => setIsVideoLibraryOpen(false)}
        userEmail={user?.email}
        userPlan={subscription?.subscription?.plan?.name}
      />

      {/* Edit Assessment Modal */}
      {user?.id && (
        <EditAssessmentModal
          isOpen={isEditAssessmentOpen}
          onClose={() => setIsEditAssessmentOpen(false)}
          userId={user.id}
          planName={planName}
        />
      )}
    </div>
  );
}
