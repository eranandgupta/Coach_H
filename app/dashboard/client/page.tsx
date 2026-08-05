'use client';

import { useEffect, useRef, useState } from 'react';
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
  MessageSquare,
  Play,
  FileText,
  Clock,
  ChevronRight,
  Edit3,
  User,
  Mail,
  Phone,
  Shield,
  ClipboardList,
  Pause,
  PlayCircle,
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
import HabitTracker from '@/components/HabitTracker';
import TransformationLogModal from '@/components/TransformationLogModal';
import RenewModal from '@/components/RenewModal';
import FunFactWidget from '@/components/FunFactWidget';
import LiveSessionWidget from '@/components/LiveSessionWidget';
import { usePushNotifications } from '@/lib/usePushNotifications';
import { usePresenceHeartbeat } from '@/lib/usePresence';
import { isElitePlan, getEffectiveTotalSessions, getMaxPauseDays } from '@/lib/planUtils';
import MobileBottomNav from '@/components/MobileBottomNav';
import ChatContainer from '@/components/chat/ChatContainer';

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
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'chat'>('dashboard');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isHabitTrackerOpen, setIsHabitTrackerOpen] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [isEditAssessmentOpen, setIsEditAssessmentOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  // "New feature" spotlight for the Habit Tracker + Transformation Logbook buttons.
  // Shows a friendly callout + pulsing badges on EVERY visit for one week after the
  // client first sees it, then stops for good.
  const [showFeatureHint, setShowFeatureHint] = useState(false);
  useEffect(() => {
    try {
      const KEY = 'ch_hint_habits_logbook_first_seen';
      const WEEK = 7 * 24 * 60 * 60 * 1000;
      let firstSeen = Number(localStorage.getItem(KEY));
      if (!firstSeen) { firstSeen = Date.now(); localStorage.setItem(KEY, String(firstSeen)); }
      if (Date.now() - firstSeen < WEEK) setShowFeatureHint(true);
    } catch {
      /* localStorage unavailable — skip the hint */
    }
  }, []);
  // On phones the callout is a full-width banner, so its little arrow must be
  // positioned by measurement to sit exactly under the two glowing NEW icons
  // (not the row's far edge). We track the icon group's centre and offset the
  // arrow from the banner's left inset (left-3 = 12px).
  const newIconsRef = useRef<HTMLDivElement | null>(null);
  const [hintArrowLeft, setHintArrowLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!showFeatureHint) return;
    const measure = () => {
      const el = newIconsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const BANNER_INSET = 12; // matches the banner's left-3
      const ARROW_HALF = 6;    // half of the 12px (w-3) arrow
      const center = rect.left + rect.width / 2;
      // Clamp so the arrow never pokes past the rounded banner corners.
      const left = Math.max(16, center - BANNER_INSET - ARROW_HALF);
      setHintArrowLeft(left);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [showFeatureHint]);
  // Hides the callout for this visit only; it reappears on the next visit within the week.
  const dismissFeatureHint = () => setShowFeatureHint(false);

  // Push notifications
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();
  usePresenceHeartbeat();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const fetchUnreadChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/chat/unread', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (typeof data.unreadCount === 'number') setUnreadChatCount(data.unreadCount);
    } catch {}
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNotificationCount();
    fetchUnreadChat();

    let notificationInterval: ReturnType<typeof setInterval>;
    let dashboardInterval: ReturnType<typeof setInterval>;
    let chatInterval: ReturnType<typeof setInterval>;

    // Only poll when the page is visible to prevent request stacking on mobile
    const startPolling = () => {
      notificationInterval = setInterval(() => {
        fetchNotificationCount();
      }, 30000);
      dashboardInterval = setInterval(() => {
        fetchDashboardData();
      }, 120000);
      chatInterval = setInterval(() => {
        fetchUnreadChat();
      }, 30000);
    };

    const stopPolling = () => {
      clearInterval(notificationInterval);
      clearInterval(dashboardInterval);
      clearInterval(chatInterval);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchNotificationCount();
        fetchUnreadChat();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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

      // Essential: /api/auth/me determines the user and any redirect. Block the
      // loader on THIS request only. Previously all 5 calls below ran
      // sequentially before the loader cleared, so the "Loading Dashboard"
      // screen stayed up for the sum of every request's latency — 15-25s on a
      // cold start / slow connection (worst in Safari). Everything else now
      // loads in parallel in the background so the dashboard appears at once.
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
      setLoading(false); // dashboard shell can render now; rest streams in

      // Secondary data — fetched in parallel, never blocks the loader. Each
      // section already renders an empty/placeholder state until its data lands.
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      fetch('/api/workouts/my-workouts', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setWorkouts(data.currentWorkouts); })
        .catch(() => {});

      fetch('/api/diets/my-diets', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setDiets(data.currentDiets); })
        .catch(() => {});

      fetch('/api/blog')
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setBlogPosts(data.slice(0, 6)); }) // latest 6
        .catch(() => {});

      // Completed sessions for Elite 1:1 plans
      const subPlanName = userData.subscription?.subscription?.plan?.name || '';
      if (isElitePlan(subPlanName) && userData.subscription?.subscription?.id) {
        fetch(`/api/sessions?subscriptionId=${userData.subscription.subscription.id}`)
          .then(res => (res.ok ? res.json() : null))
          .then(data => { if (data) setCompletedSessions(data.sessions.map((s: any) => s.sessionNumber)); })
          .catch(() => {});
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

  const handlePauseSubscription = async () => {
    setPauseLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscriptions/pause', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setShowPauseConfirm(false);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to pause subscription');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setPauseLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setPauseLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscriptions/pause', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to resume subscription');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setPauseLoading(false);
    }
  };

  const getPauseDaysElapsed = () => {
    if (!subscription?.subscription?.pausedAt) return 0;
    const pausedAt = new Date(subscription.subscription.pausedAt);
    const now = new Date();
    return Math.ceil((now.getTime() - pausedAt.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getSubscriptionProgress = () => {
    if (!subscription?.subscription) return 0;
    const pName = subscription.subscription.plan?.name || '';
    if (isElitePlan(pName)) {
      const total = getEffectiveTotalSessions(pName, subscription.subscription.bonusSessions) || 1;
      return Math.min((completedSessions.length / total) * 100, 100);
    }
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
      const total = getEffectiveTotalSessions(pName, subscription.subscription.bonusSessions) || 24;
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
  const planDuration = subscription?.subscription?.plan?.duration || 0;
  const maxPauseDays = getMaxPauseDays(planDuration, planName);
  const isPaused = subscription?.subscription?.status === 'paused';
  const hasUsedPause = (subscription?.subscription?.pauseDaysUsed || 0) > 0;
  const canPause = isSubscriptionActive && maxPauseDays > 0 && !isPaused && !hasUsedPause;

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 navbar-glass">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
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

          <div className="flex items-center gap-1.5 md:gap-3 relative">
            {!isLiveSessionPlan && <button
              onClick={() => setIsVideoLibraryOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.03) 100%)' }}
              title="Video Library"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            </button>}
            {/* Group the two "NEW" icons so the callout anchors under them, not the row's edge */}
            <div ref={newIconsRef} className="relative flex items-center gap-1.5 md:gap-3">
            <button
              onClick={() => { dismissFeatureHint(); setIsHabitTrackerOpen(true); }}
              className={`relative flex items-center justify-center p-2 rounded-xl border transition-all ${showFeatureHint ? 'border-amber-400/60' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 100%)' }}
              title="Habit Tracker"
            >
              <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              {showFeatureHint && (
                <>
                  <span className="absolute -inset-0.5 rounded-xl ring-2 ring-amber-400/70 animate-pulse pointer-events-none" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[8px] md:text-[9px] font-extrabold leading-none px-1 py-0.5 rounded-full shadow">NEW</span>
                </>
              )}
            </button>
            <button
              onClick={() => { dismissFeatureHint(); setIsLogbookOpen(true); }}
              className={`relative flex items-center justify-center p-2 rounded-xl border transition-all ${showFeatureHint ? 'border-amber-400/60' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.1) 0%, rgba(23,95,255,0.03) 100%)' }}
              title="Transformation Logbook"
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-brand-blue" />
              {showFeatureHint && (
                <>
                  <span className="absolute -inset-0.5 rounded-xl ring-2 ring-amber-400/70 animate-pulse pointer-events-none" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[8px] md:text-[9px] font-extrabold leading-none px-1 py-0.5 rounded-full shadow">NEW</span>
                </>
              )}
            </button>

            {/* Friendly "hey, check this out" callout.
               Phones: a fixed, full-width banner just under the header (never clips off-screen).
               sm+: an icon-anchored speech bubble under the two glowing icons. */}
            {showFeatureHint && (
              <div className="fixed left-3 right-3 top-[72px] z-50 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[17rem] sm:max-w-[80vw]">
                {/* Phones: arrow measured to point at the two NEW icons. */}
                <div
                  className="absolute -top-1.5 w-3 h-3 rotate-45 bg-[#0b1224] border-l border-t border-amber-400/40 sm:hidden"
                  style={{ left: hintArrowLeft ?? undefined, opacity: hintArrowLeft == null ? 0 : 1 }}
                />
                {/* sm+: bubble is anchored under the icons, so a fixed arrow lines up. */}
                <div className="absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-[#0b1224] border-l border-t border-amber-400/40 hidden sm:block" />
                <div className="relative rounded-xl border border-amber-400/40 bg-[#0b1224] p-3.5 shadow-2xl">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>👋</span> New here!
                  </p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Track your daily habits and log your 30-day transformation — tap the glowing icons above. You can also download & print them.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => { dismissFeatureHint(); setIsHabitTrackerOpen(true); }}
                      className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 transition-all"
                    >
                      Show me
                    </button>
                    <button
                      onClick={dismissFeatureHint}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-all"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
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
              onClick={() => setActiveView('chat')}
              className="relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border border-white/[0.08] hover:border-brand-blue/30 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.1) 0%, rgba(23,95,255,0.03) 100%)' }}
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-brand-blue" />
              <span className="hidden lg:inline text-brand-blue text-sm font-medium">Chat</span>
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-[10px] font-bold text-white">{unreadChatCount > 9 ? '9+' : unreadChatCount}</span>
                </span>
              )}
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
      {activeView === 'dashboard' && (
      <div className="pt-24 md:pt-28 pb-28 lg:pb-20 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Welcome (shown only on small screens) */}
          <div className="md:hidden mb-5">
            <h1 className="text-2xl font-bold text-white mb-1">
              Hi {user?.name?.split(' ')[0] || 'Champion'},
            </h1>
            <p className="text-gray-400 text-sm">Welcome back! Let's crush it today</p>
          </div>

        {/* Subscription Status Card - Compact & Aesthetic */}
        <div id="section-home" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-6 md:mb-8 p-4 md:p-5 rounded-2xl border overflow-hidden glass-card ${
            isPaused
              ? 'border-yellow-500/15'
              : isSubscriptionActive
              ? 'border-green-500/15'
              : 'border-red-500/15'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isPaused ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              ) : isSubscriptionActive ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  {isPaused ? 'Subscription Paused' : isSubscriptionActive ? 'Active Subscription' : 'Subscription Expired'}
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  {isSubscriptionActive
                    ? subscription?.subscription?.plan?.name
                    : subscription?.message || 'Please renew to continue'}
                </p>
                {/* Info Row - Days Left & Progress */}
                {isSubscriptionActive && subscription?.subscription && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span className="text-xs text-gray-300 font-medium">
                        {isEliteOneOnOnePlan
                          ? `${(getEffectiveTotalSessions(planName, subscription?.subscription?.bonusSessions) || 0) - completedSessions.length} sessions left`
                          : `${getDaysRemaining(subscription.subscription.endDate)} days left`}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50"></div>
                      <span className="text-xs font-medium text-green-400">
                        {Math.round(getSubscriptionProgress())}% Complete
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Assessment Badge with Edit Button */}
              {user?.assessmentCompleted && (
                <button
                  onClick={() => setIsEditAssessmentOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-blue/20 border border-brand-blue/30 rounded-lg hover:bg-brand-blue/30 transition-all group"
                  title="Click to edit your assessment"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span className="text-white text-[10px] sm:text-xs font-medium whitespace-nowrap">Assessment ✓</span>
                  <Edit3 className="w-3 h-3 text-white" />
                </button>
              )}

              {/* Renew Button (if expired) */}
              {!isSubscriptionActive && (
                <button
                  onClick={() => setIsRenewOpen(true)}
                  className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  Renew
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pause/Resume Section */}
          {isPaused && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Pause className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-yellow-400 text-sm font-semibold">Subscription Paused</p>
                    <p className="text-yellow-400/70 text-xs">
                      Day {Math.min(getPauseDaysElapsed(), maxPauseDays)} of {maxPauseDays} — your end date will be extended when you resume
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResumeSubscription}
                  disabled={pauseLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-all flex-shrink-0 disabled:opacity-50"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  {pauseLoading ? 'Resuming...' : 'Resume'}
                </button>
              </div>
            </div>
          )}

          {canPause && !showPauseConfirm && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-gray-500 text-xs">
                You can pause your subscription for up to {maxPauseDays} days (one-time)
              </p>
              <button
                onClick={() => setShowPauseConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/20 transition-all flex-shrink-0"
              >
                <Pause className="w-3 h-3" />
                Pause
              </button>
            </div>
          )}

          {showPauseConfirm && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-400 text-sm font-semibold mb-1">Confirm Pause</p>
              <p className="text-gray-400 text-xs mb-3">
                Your subscription will be paused for up to {maxPauseDays} days. You can resume anytime and your end date will be extended by the paused duration. This can only be used once.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePauseSubscription}
                  disabled={pauseLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-xs font-semibold hover:bg-yellow-400 transition-all disabled:opacity-50"
                >
                  <Pause className="w-3 h-3" />
                  {pauseLoading ? 'Pausing...' : 'Yes, Pause'}
                </button>
                <button
                  onClick={() => setShowPauseConfirm(false)}
                  className="px-3 py-1.5 text-gray-400 text-xs font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
                  {/* Shimmer Effect - runs 3 times then stops to save mobile resources */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getSubscriptionProgress()}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
                  >
                    <motion.div
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2.5, repeat: 3, ease: 'linear', delay: 1.5 }}
                      className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Week/Session Milestones - Responsive Grid */}
              <div className="relative">
                {(() => {
                  const milestones = getWeekMilestones();
                  const cols = milestones.length <= 12 ? milestones.length : 12;
                  return (
                    <div
                      className="grid gap-1.5 md:gap-2 px-0 md:px-1 pb-2 pt-1 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    >
                      {milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
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
                              <div
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
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
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
        <div id="section-blog" />
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
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
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
        <div id="section-workout" className={`grid grid-cols-1 ${isEliteOneOnOnePlan ? '' : 'lg:grid-cols-2'} gap-4 md:gap-6`}>
          {/* Current Workout — hidden for 1:1 Elite plans */}
          {!isEliteOneOnOnePlan && (
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
          )}

          {/* Current Diet */}
          <div id="section-diet" />
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
      )}

      {/* Profile View */}
      {activeView === 'profile' && (
      <div className="pt-24 md:pt-28 pb-28 lg:pb-20 px-3 md:px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center mb-3 border-2 border-white/10">
                <span className="text-3xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            {/* User Info */}
            <div className="glass-card p-5 mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Name</p>
                    <p className="text-white text-sm font-medium truncate">{user?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Email</p>
                    <p className="text-white text-sm font-medium truncate">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Phone</p>
                      <p className="text-white text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Plan</p>
                    <p className="text-white text-sm font-medium truncate">{planName || 'No active plan'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            {subscription?.subscription && (
              <div className="glass-card p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Subscription
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isPaused ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : isSubscriptionActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {isPaused ? 'Paused' : isSubscriptionActive ? 'Active' : 'Expired'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-gray-500 text-xs mb-0.5">Start Date</p>
                    <p className="text-gray-300">{new Date(subscription.subscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-gray-500 text-xs mb-0.5">End Date</p>
                    <p className="text-gray-300">{new Date(subscription.subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {isSubscriptionActive && (
                    <div className="col-span-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-gray-500 text-xs mb-0.5">{isEliteOneOnOnePlan ? 'Sessions Remaining' : 'Days Remaining'}</p>
                      <p className="text-white font-semibold">{isEliteOneOnOnePlan ? `${(getEffectiveTotalSessions(planName, subscription?.subscription?.bonusSessions) || 0) - completedSessions.length} sessions` : `${getDaysRemaining(subscription.subscription.endDate)} days`}</p>
                    </div>
                  )}
                </div>
                {!isSubscriptionActive && (
                  <button
                    onClick={() => setIsRenewOpen(true)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-blue text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all"
                  >
                    Renew Subscription <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {user?.assessmentCompleted && (
                  <button
                    onClick={() => setIsEditAssessmentOpen(true)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-brand-blue/30 transition-all group"
                    style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.06) 0%, rgba(23,95,255,0.02) 100%)' }}
                  >
                    <div className="p-2 rounded-lg bg-brand-blue/15">
                      <ClipboardList className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">Assessment Form</p>
                      <p className="text-gray-500 text-xs">View & edit your assessment</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-brand-blue transition-colors" />
                  </button>
                )}
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-yellow-500/30 transition-all group"
                  style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.06) 0%, rgba(234,179,8,0.02) 100%)' }}
                >
                  <div className="p-2 rounded-lg bg-yellow-500/15">
                    <Key className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Change Password</p>
                    <p className="text-gray-500 text-xs">Update your password</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-yellow-400 transition-colors" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-red-500/30 transition-all group"
                  style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 100%)' }}
                >
                  <div className="p-2 rounded-lg bg-red-500/15">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Logout</p>
                    <p className="text-gray-500 text-xs">Sign out of your account</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      )}

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
      <HabitTracker
        isOpen={isHabitTrackerOpen}
        onClose={() => setIsHabitTrackerOpen(false)}
      />

      {user && (
        <TransformationLogModal
          isOpen={isLogbookOpen}
          onClose={() => setIsLogbookOpen(false)}
          userId={user.id}
          userName={user.name}
        />
      )}

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

      {/* Renew subscription (expired clients reactivate in-place) */}
      <RenewModal
        isOpen={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
        user={user}
        onRenewed={fetchDashboardData}
      />

      {/* Chat View */}
      {activeView === 'chat' && user && (
        <div className="fixed inset-0 z-[55] bg-brand-navy flex flex-col">
          {/* Desktop close bar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-white/[0.06] flex-shrink-0"
            style={{ background: 'linear-gradient(180deg, rgba(10,15,31,0.98) 0%, rgba(10,15,31,0.9) 100%)' }}>
            <h2 className="text-white font-bold text-lg">Chat with Coach</h2>
            <button
              onClick={() => { setActiveView('dashboard'); fetchUnreadChat(); }}
              className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/[0.08] rounded-lg hover:bg-white/5 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatContainer userId={user.id} userRole={user.role} onUnreadChange={setUnreadChatCount} onClose={() => { setActiveView('dashboard'); fetchUnreadChat(); }} />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        role="client"
        activeTab={activeView === 'profile' ? 'profile' : activeView === 'chat' ? 'chat' : undefined}
        badges={{ chat: unreadChatCount }}
        onTabChange={(tab) => {
          if (tab === 'chat') {
            setActiveView('chat');
            return;
          }
          if (tab === 'profile') {
            setActiveView('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (activeView !== 'dashboard') {
            setActiveView('dashboard');
            setTimeout(() => {
              if (tab !== 'home') {
                const el = document.getElementById(`section-${tab}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
            return;
          }
          const el = document.getElementById(`section-${tab}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}
