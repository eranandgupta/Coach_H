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
  SunMoon,
  Bell,
  Key,
  MessageSquare,
  Play,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Edit3,
  User,
  Mail,
  Phone,
  Shield,
  ClipboardList,
  Pause,
  PlayCircle, Hand, HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ViewWorkoutModal from '@/components/modals/ViewWorkoutModal';
import ViewDietModal from '@/components/modals/ViewDietModal';
import EditAssessmentModal from '@/components/modals/EditAssessmentModal';
import NotificationPanel from '@/components/NotificationPanel';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import DashboardLoader from '@/components/DashboardLoader';
import VideoLibrary from '@/components/VideoLibrary';
import HabitTracker from '@/components/HabitTracker';
import TransformationLogModal from '@/components/TransformationLogModal';
import RenewModal from '@/components/RenewModal';
import FunFactWidget from '@/components/FunFactWidget';
import LiveSessionWidget from '@/components/LiveSessionWidget';
import PushPrompt from '@/components/PushPrompt';
import ArticlesRow from '@/components/client/ArticlesRow';
import CurrentPlanCard, { type LoadStatus } from '@/components/client/CurrentPlanCard';
import DashboardTour, { type TourStep } from '@/components/client/DashboardTour';
import InfoTip from '@/components/client/InfoTip';
import QuickActions, { type QuickAction } from '@/components/client/QuickActions';
import { useChatDeepLink } from '@/lib/useChatDeepLink';
import { flushChatOutbox } from '@/lib/chatOutbox';
import { isStaffRole } from '@/lib/trainerPermissions';
import { usePresenceHeartbeat } from '@/lib/usePresence';
import { toast } from 'sonner';
import { isElitePlan, getEffectiveTotalSessions, getMaxPauseDays } from '@/lib/planUtils';
import MobileBottomNav from '@/components/MobileBottomNav';
import { loadSession, logout } from '@/lib/session';
import ThemeToggle from '@/components/theme/ThemeToggle';
import DashboardHero from '@/components/coach/DashboardHero';
import dynamic from 'next/dynamic';
const CalorieCalculator = dynamic(() => import('@/components/CalorieCalculator'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />,
});
import ChatContainer from '@/components/chat/ChatContainer';

const TOUR_SEEN_KEY = 'ch_client_tour_seen';
const RENEW_REMINDER_DAYS = 14;

const TOUR_STEPS: TourStep[] = [
  { target: 'status', title: 'Your plan at a glance', body: 'See your plan, how many days are left and how far along you are. Each box in the row below is one week or session. You can pause your plan here too, if your plan allows it.' },
  { target: 'live', title: 'Your live sessions', body: 'Join your live training sessions from here. The link appears once your coach has scheduled one.' },
  { target: 'stats', title: 'Your numbers', body: 'A quick count of your active workouts and diet plans, plus the week or session you are on.' },
  { target: 'quick-actions', title: 'Your tools', body: 'Message your coach, watch exercise videos, track daily habits, log your transformation, count calories or update your assessment.' },
  { target: 'workout', title: 'Your workout', body: 'Today\'s exercises appear first. Tap a day to see another one, or open the full workout for all the details and videos.' },
  { target: 'diet', title: 'Your diet', body: 'Today\'s meals appear first, with the total calories for the day. Open the full plan to see everything your coach has written.' },
  { target: 'header-actions', title: 'Always within reach', body: 'Notifications, chat, light or dark mode and your password are up here. Hover over any icon to see what it does.' },
  { target: 'bottom-nav', title: 'Getting around', body: 'Jump to your workout, diet or chat from here. More holds your other tools, your profile and this guide.' },
];

// Stable references: CurrentPlanCard memoises on these.
const exercisesOf = (workout: any) => workout?.exercises || [];
const mealsOf = (diet: any) => diet?.meals || [];

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [workoutsStatus, setWorkoutsStatus] = useState<LoadStatus>('loading');
  const [dietsStatus, setDietsStatus] = useState<LoadStatus>('loading');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const blogLoadedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);
  const [selectedDietIndex, setSelectedDietIndex] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'chat' | 'calories'>('dashboard');
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

  usePresenceHeartbeat();
  // Tapping a chat notification opens that chat.
  const [chatTarget, setChatTarget] = useState<{ id: number } | null>(null);
  useChatDeepLink((id) => {
    setChatTarget({ id });
    setActiveView('chat');
  });

  // Active-subscription perks; inactive clients get a renew prompt.
  const openMemberFeature = (label: string, description: string, open: () => void) => {
    if (isSubscriptionActive) {
      open();
    } else {
      toast.error(`Renew your subscription to unlock the ${label}`, {
        description,
        action: { label: 'Renew', onClick: () => setIsRenewOpen(true) },
      });
    }
  };
  const openVideoLibrary = () =>
    openMemberFeature('Video Library', 'The exercise video library is available to active members only.', () => setIsVideoLibraryOpen(true));
  const openHabitTracker = () => {
    dismissFeatureHint();
    openMemberFeature('Habit Tracker', 'The habit tracker is available to active members only.', () => setIsHabitTrackerOpen(true));
  };
  const openLogbook = () => {
    dismissFeatureHint();
    openMemberFeature('Logbook', 'The transformation logbook is available to active members only.', () => setIsLogbookOpen(true));
  };

  const openCalories = () => {
    setActiveView('calories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
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

  // A failed refresh keeps what's already on screen: only a first load can land in the error state,
  // and never as "no plan yet", which would wrongly tell the client they have nothing assigned.
  const loadWorkouts = () => {
    const token = localStorage.getItem('token');
    return fetch('/api/workouts/my-workouts', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        setWorkouts(data.currentWorkouts || []);
        setWorkoutsStatus('ready');
      })
      .catch(() => setWorkoutsStatus((s) => (s === 'ready' ? s : 'error')));
  };

  const loadDiets = () => {
    const token = localStorage.getItem('token');
    return fetch('/api/diets/my-diets', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        setDiets(data.currentDiets || []);
        setDietsStatus('ready');
      })
      .catch(() => setDietsStatus((s) => (s === 'ready' ? s : 'error')));
  };

  const fetchDashboardData = async () => {
    try {
      // Essential: /api/auth/me determines the user and any redirect, so the loader waits on THIS
      // request only and everything else loads in parallel behind it. It restores from the session
      // cookie if localStorage was wiped; only a real 401 sends the user home.
      const session = await loadSession();
      if (session.status === 'unauthenticated') { window.location.href = '/'; return; }
      if (session.status === 'error') {
        // Stay on the loader: without a session, the page would falsely show "Subscription Expired".
        toast.error('Connection problem — retrying…');
        setTimeout(fetchDashboardData, 4000);
        return;
      }
      const userData = { user: session.user, subscription: session.subscription };

      // Check if client has completed assessment (coaches and admins skip this check)
      if (!isStaffRole(userData.user.role) && !userData.user.assessmentCompleted) {
        router.push('/assessment');
        return;
      }

      setUser(userData.user);
      setSubscription(userData.subscription);
      setLoading(false); // dashboard shell can render now; rest streams in

      loadWorkouts();
      loadDiets();

      // Articles don't change minute to minute: load once, not on every background refresh.
      if (!blogLoadedRef.current) {
        blogLoadedRef.current = true;
        fetch('/api/blog')
          .then(res => (res.ok ? res.json() : null))
          .then(data => { if (data) setBlogPosts(data.slice(0, 6)); }) // latest 6
          .catch(() => { blogLoadedRef.current = false; });
      }

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
      toast.error('Something went wrong loading your dashboard — retrying…');
      setTimeout(fetchDashboardData, 4000);
    }
  };

  // Send any chat message left unconfirmed last time, even if the client doesn't reopen the chat.
  useEffect(() => {
    if (user?.id) flushChatOutbox(user.id);
  }, [user?.id]);

  // First visit: offer the guide once the sections below have their data, so it highlights real
  // content and not loading placeholders.
  const plansSettled = workoutsStatus !== 'loading' && dietsStatus !== 'loading';
  useEffect(() => {
    if (loading || !plansSettled || activeView !== 'dashboard') return;
    let seen = true;
    try { seen = !!localStorage.getItem(TOUR_SEEN_KEY); } catch {}
    if (seen) return;
    const timer = setTimeout(() => setIsTourOpen(true), 600);
    return () => clearTimeout(timer);
  }, [loading, plansSettled, activeView]);

  const closeTour = () => {
    setIsTourOpen(false);
    try { localStorage.setItem(TOUR_SEEN_KEY, String(Date.now())); } catch {}
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const startTour = () => {
    setActiveView('dashboard');
    setIsTourOpen(true);
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
        toast.success('Plan paused. Resume whenever you are ready.');
        fetchDashboardData();
      } else {
        toast.error(data.error || 'Failed to pause subscription');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
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
        toast.success(data.message || 'Welcome back! Your plan is running again.');
        fetchDashboardData();
      } else {
        toast.error(data.error || 'Failed to resume subscription');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
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
  // Don't advertise the Habit Tracker + Logbook to clients who can't open them.
  const showHint = showFeatureHint && !!isSubscriptionActive && !isTourOpen;
  const currentWorkout = workouts[selectedWorkoutIndex] || workouts[0];
  const currentDiet = diets[selectedDietIndex] || diets[0];
  const planName = subscription?.subscription?.plan?.name || '';
  const isLiveSessionPlan = planName === 'She Strong Program' || planName === 'Active Parents Program';
  const isEliteOneOnOnePlan = planName.startsWith('Elite 1:1');
  const planDuration = subscription?.subscription?.plan?.duration || 0;
  const maxPauseDays = getMaxPauseDays(planDuration, planName);
  const isPaused = subscription?.subscription?.status === 'paused';
  const hasUsedPause = (subscription?.subscription?.pauseDaysUsed || 0) > 0;
  const canPause = isSubscriptionActive && maxPauseDays > 0 && !isPaused && !hasUsedPause;
  const isOverlayOpen =
    isWorkoutModalOpen || isDietModalOpen || isEditAssessmentOpen || isVideoLibraryOpen || isHabitTrackerOpen ||
    isLogbookOpen || isRenewOpen || isChangePasswordOpen || isNotificationPanelOpen;
  const daysLeft = subscription?.subscription ? getDaysRemaining(subscription.subscription.endDate) : 0;
  const showRenewReminder =
    !!isSubscriptionActive && !isPaused && !subscription?.hasQueuedPlan && daysLeft <= RENEW_REMINDER_DAYS;
  const showPlans = !isLiveSessionPlan || isEliteOneOnOnePlan;
  const quickActions: QuickAction[] = [
    { id: 'chat', label: 'Chat with coach', hint: 'Ask anything, anytime', icon: MessageSquare, onSelect: () => setActiveView('chat'), badge: unreadChatCount },
    ...(!isLiveSessionPlan ? [{ id: 'video', label: 'Video Library', hint: 'See how each exercise is done', icon: Play, onSelect: openVideoLibrary, locked: !isSubscriptionActive }] : []),
    { id: 'habits', label: 'Habit Tracker', hint: 'Tick off your daily habits', icon: ClipboardList, onSelect: openHabitTracker, locked: !isSubscriptionActive },
    { id: 'logbook', label: 'Logbook', hint: 'Log your 30-day transformation', icon: TrendingUp, onSelect: openLogbook, locked: !isSubscriptionActive },
    { id: 'calories', label: 'Calorie Calculator', hint: 'Count calories in 850+ Indian foods', icon: Calculator, onSelect: openCalories },
    ...(user?.assessmentCompleted ? [{ id: 'assessment', label: 'My Assessment', hint: 'View or update your details', icon: Edit3, onSelect: () => setIsEditAssessmentOpen(true) }] : []),
  ];
  // Renewing is the next step for an expired client; waiting on the coach isn't.
  const renewAction = !isSubscriptionActive ? { label: 'Renew plan', onClick: () => setIsRenewOpen(true) } : undefined;

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 navbar-glass">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={() => { setActiveView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center flex-shrink-0"
            aria-label="Dashboard home"
            title="Dashboard home"
          >
            <Image
              src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
              alt="Coach Himanshu"
              width={90}
              height={90}
              className="theme-logo object-contain w-[60px] md:w-[90px]"
            />
          </button>

          <span aria-hidden className="hidden md:block h-8 w-px bg-white/10" />
          <div className="hidden md:block min-w-0">
            <h1 className="text-base font-semibold text-white leading-tight truncate">
              Welcome, {user?.name?.split(' ')[0] || 'Champion'}
            </h1>
            <p className="text-xs text-gray-500 truncate">Let&apos;s crush your fitness goals today</p>
          </div>

          <div data-tour="header-actions" className="ml-auto hdr-group relative">
            {/* Video Library is an active-subscription perk. Inactive clients see it
               disabled and get a "please renew" prompt with renewal plan options. */}
            {!isLiveSessionPlan && <button
              onClick={openVideoLibrary}
              className="hdr-btn hidden sm:inline-flex"
              aria-disabled={!isSubscriptionActive}
              title={isSubscriptionActive ? 'Video Library' : 'Video Library — renew to unlock'}
              aria-label="Video Library"
            >
              <Play />
            </button>}
            {/* Group the two "NEW" icons so the callout anchors under them, not the row's edge */}
            <div ref={newIconsRef} className="relative hidden sm:flex items-center gap-0.5">
            <button
              onClick={openHabitTracker}
              className="hdr-btn"
              aria-disabled={!isSubscriptionActive}
              title={isSubscriptionActive ? 'Habit Tracker' : 'Habit Tracker — renew to unlock'}
              aria-label="Habit Tracker"
            >
              <ClipboardList />
              {showHint && (
                <>
                  <span className="absolute inset-0 rounded-[10px] ring-2 ring-amber-400/70 animate-pulse pointer-events-none" />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-ink text-[8px] font-extrabold leading-none px-1 py-0.5 rounded-full shadow">NEW</span>
                </>
              )}
            </button>
            <button
              onClick={openLogbook}
              className="hdr-btn"
              aria-disabled={!isSubscriptionActive}
              title={isSubscriptionActive ? 'Transformation Logbook' : 'Transformation Logbook — renew to unlock'}
              aria-label="Transformation Logbook"
            >
              <TrendingUp />
              {showHint && (
                <>
                  <span className="absolute inset-0 rounded-[10px] ring-2 ring-amber-400/70 animate-pulse pointer-events-none" />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-ink text-[8px] font-extrabold leading-none px-1 py-0.5 rounded-full shadow">NEW</span>
                </>
              )}
            </button>

            {/* Friendly "hey, check this out" callout.
               Phones: a fixed, full-width banner just under the header (never clips off-screen).
               sm+: an icon-anchored speech bubble under the two glowing icons. */}
            {showHint && (
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
                    <Hand className="w-4 h-4 text-amber-400" aria-hidden /> New here!
                  </p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Track your daily habits and log your 30-day transformation — tap the glowing icons above. You can also download & print them.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={openHabitTracker}
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
              onClick={openCalories}
              className="hdr-btn hidden sm:inline-flex"
              title="Calorie Calculator"
              aria-label="Calorie Calculator"
            >
              <Calculator />
            </button>
            <span aria-hidden className="hidden sm:block hdr-sep" />
            <ThemeToggle size="sm" className="mx-1" />
            <span aria-hidden className="hidden sm:block hdr-sep" />
            <button
              onClick={() => setIsNotificationPanelOpen(true)}
              className="hdr-btn hidden sm:inline-flex"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell />
              {notificationCount > 0 && <span className="hdr-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>}
            </button>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="hdr-btn hidden sm:inline-flex"
              title="Change Password"
              aria-label="Change Password"
            >
              <Key />
            </button>
            <button
              onClick={() => setActiveView('chat')}
              className="hdr-btn hidden sm:inline-flex"
              aria-label="Chat"
              title="Chat with your coach"
            >
              <MessageSquare />
              {unreadChatCount > 0 && <span className="hdr-badge">{unreadChatCount > 9 ? '9+' : unreadChatCount}</span>}
            </button>
            <button
              onClick={startTour}
              className="hdr-btn hidden sm:inline-flex"
              title="Dashboard guide"
              aria-label="Dashboard guide"
            >
              <HelpCircle />
            </button>
            <button
              onClick={handleLogout}
              className="hdr-btn is-danger hidden sm:inline-flex"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeView === 'dashboard' && (
      <div className="pt-24 md:pt-32 pb-28 lg:pb-20 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Welcome (shown only on small screens) */}
          <div className="md:hidden mb-4">
            <h1 className="text-xl font-bold text-white leading-tight">
              Hi {user?.name?.split(' ')[0] || 'Champion'}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">Welcome back! Let&apos;s crush it today</p>
          </div>

        {/* Subscription Status Card - Compact & Aesthetic */}
        <div id="section-home" className="scroll-mt-24" />
        <motion.div
          data-tour="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-5 md:mb-8 p-3.5 md:p-5 rounded-2xl border overflow-hidden glass-card ${
            isPaused
              ? 'border-yellow-500/15'
              : isSubscriptionActive
              ? 'border-green-500/15'
              : 'border-red-500/15'
          }`}
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isPaused ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              ) : isSubscriptionActive ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] sm:text-lg font-bold text-white leading-snug mb-0.5 sm:mb-1.5">
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
                          ? `${(getEffectiveTotalSessions(planName, subscription?.subscription?.bonusSessions) || 0) - completedSessions.length} sessions · ${getDaysRemaining(subscription.subscription.endDate)} days left`
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

            <div className="flex items-center gap-2 flex-shrink-0 pl-8 sm:pl-0 empty:hidden">
              {/* Renew Button (if expired) */}
              {!isSubscriptionActive && (
                <button
                  onClick={() => setIsRenewOpen(true)}
                  className="bg-brand-blue text-white px-4 min-h-[44px] rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  Renew
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Renew before the plan runs out */}
          {showRenewReminder && (
            <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-300">
                <span className="font-semibold text-white">
                  {daysLeft <= 0 ? 'Your plan ends today.' : `Your plan ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`}
                </span>{' '}
                Renew now to keep going without a break. You won&apos;t lose any days you have left.
              </p>
              <button
                onClick={() => setIsRenewOpen(true)}
                className="shrink-0 min-h-[44px] px-4 rounded-lg text-sm font-semibold text-white bg-brand-blue hover:bg-blue-600 transition-colors"
              >
                Renew early
              </button>
            </div>
          )}

          {/* Pause/Resume Section */}
          {isPaused && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  className="flex items-center justify-center gap-1.5 px-4 min-h-[44px] bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex-shrink-0 disabled:opacity-50"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  {pauseLoading ? 'Resuming...' : 'Resume'}
                </button>
              </div>
            </div>
          )}

          {canPause && !showPauseConfirm && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <span>You can pause for up to {maxPauseDays} days (one-time)</span>
                <InfoTip label="pausing">
                  Going on holiday or feeling unwell? Pause your plan and the days you miss are added back to your end date when you resume. You can use this once per plan.
                </InfoTip>
              </p>
              <button
                onClick={() => setShowPauseConfirm(true)}
                className="flex items-center gap-1.5 px-3.5 min-h-[44px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/20 transition-all flex-shrink-0"
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
                  className="flex items-center gap-1.5 px-4 min-h-[44px] bg-yellow-500 text-black rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all disabled:opacity-50"
                >
                  <Pause className="w-3 h-3" />
                  {pauseLoading ? 'Pausing...' : 'Yes, Pause'}
                </button>
                <button
                  onClick={() => setShowPauseConfirm(false)}
                  className="px-3 min-h-[44px] text-gray-400 text-sm font-medium hover:text-white transition-colors"
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
                    {new Date(subscription.subscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                    {new Date(subscription.subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                </div>
              </div>

              {/* Week/Session Milestones - Responsive Grid */}
              <div className="relative">
                <p className="flex items-center gap-0.5 px-1 mb-1.5 text-xs font-medium text-gray-400">
                  {isEliteOneOnOnePlan ? 'Your sessions' : 'Your progress'}
                  <InfoTip label="this tracker">
                    {isEliteOneOnOnePlan
                      ? 'Each box is one session (S1, S2...). It turns green once your coach confirms it. Your plan ends when your sessions or your days run out, whichever comes first.'
                      : 'Each box is one week or month of your plan (W1, M1...). Green is finished and blue is where you are now.'}
                  </InfoTip>
                </p>
                {(() => {
                  const milestones = getWeekMilestones();
                  return (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1.5 md:gap-2 px-0.5 md:px-1 pb-2 pt-1 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                        >
                          <div
                            className={`relative flex flex-col items-center justify-center w-full h-10 md:h-11 rounded-xl transition-all duration-300 ${
                              milestone.isCurrent
                                ? 'bg-gradient-to-br from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/40 ring-2 ring-brand-blue/30'
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
                                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-navy shadow-lg"
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

        {/* Live sessions: Elite 1:1 and the live-session programmes */}
        {(isEliteOneOnOnePlan || isLiveSessionPlan) && isSubscriptionActive && (
          <div data-tour="live" className="mb-5 md:mb-8">
            <LiveSessionWidget planName={planName} />
          </div>
        )}

        {/* Regular Plans — stats, workouts, diets (also shown for Elite 1:1) */}
        {showPlans && (
          <div data-tour="stats">
        {/* Stats band */}
        <DashboardHero
          id="section-stats"
          stats={[
            { label: 'Active Workouts', short: 'Workouts', value: workoutsStatus === 'ready' ? workouts.length : '–', icon: Dumbbell },
            { label: 'Diet Plans', short: 'Diets', value: dietsStatus === 'ready' ? diets.length : '–', icon: UtensilsCrossed },
            isEliteOneOnOnePlan
              ? { label: 'Sessions Done', short: 'Sessions', value: completedSessions.length, icon: Calendar }
              : {
                  label: 'Current Week',
                  short: 'Week',
                  value: currentWorkout?.weekNumber
                    ? `Week ${currentWorkout.weekNumber}`
                    : subscription?.subscription?.startDate
                      ? `Week ${Math.max(1, Math.ceil((new Date().getTime() - new Date(subscription.subscription.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)))}`
                      : '–',
                  icon: Calendar,
                },
          ]}
        />

          </div>
        )}

        <QuickActions actions={quickActions} />

        {showPlans && (
          <div id="section-workout" className={`scroll-mt-24 grid grid-cols-1 ${isEliteOneOnOnePlan ? '' : 'lg:grid-cols-2'} gap-4 md:gap-6 mb-5 md:mb-8 items-start`}>
            {/* Elite 1:1 clients train in live sessions, so they have no workout card. */}
            {!isEliteOneOnOnePlan && (
              <CurrentPlanCard
                tourId="workout"
                title="Current Workout"
                icon={Dumbbell}
                tip="The workout your coach has set for this week. Tap a day to see its exercises. In the list, 3x12 means 3 sets of 12 reps, SS is a superset and DS is a dropset."
                status={workoutsStatus}
                onRetry={() => { setWorkoutsStatus('loading'); loadWorkouts(); }}
                plans={workouts}
                selectedIndex={selectedWorkoutIndex}
                onSelectPlan={setSelectedWorkoutIndex}
                itemsOf={exercisesOf}
                itemNoun="Exercises"
                meta={(w: any) => `Week ${w.weekNumber} · ${getDaysRemaining(w.endDate)} days left`}
                renderItem={(exercise: any) => (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="text-white font-medium break-words">{exercise.name}</p>
                        <p className="text-gray-400 text-xs">{exercise.day}</p>
                      </div>
                      {exercise.exerciseType === 'superset' && (
                        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded text-[10px] font-semibold">SS</span>
                      )}
                      {exercise.exerciseType === 'dropset' && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-semibold">DS</span>
                      )}
                    </div>
                    <div className="shrink-0 text-gray-300 text-sm">
                      {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                      {exercise.duration && exercise.sets && !exercise.reps && `${exercise.duration} min × ${exercise.sets} sets`}
                      {exercise.duration && !exercise.sets && `${exercise.duration} min`}
                    </div>
                  </>
                )}
                viewAllLabel="View Full Workout"
                onViewAll={() => setIsWorkoutModalOpen(true)}
                empty={{
                  title: 'No active workout plan',
                  body: isSubscriptionActive ? 'Your coach will assign one soon.' : 'Renew your plan to get new workouts from your coach.',
                  action: renewAction,
                }}
              />
            )}

            <CurrentPlanCard
              id="section-diet"
              tourId="diet"
              title="Current Diet"
              icon={UtensilsCrossed}
              tip="The meals your coach has planned for you. Tap a day to see its meals and the day's total calories."
              status={dietsStatus}
              onRetry={() => { setDietsStatus('loading'); loadDiets(); }}
              plans={diets}
              selectedIndex={selectedDietIndex}
              onSelectPlan={setSelectedDietIndex}
              itemsOf={mealsOf}
              itemNoun="Meals"
              meta={(d: any) => `${isEliteOneOnOnePlan ? `Session ${d.weekNumber}` : `Week ${d.weekNumber}`}${d.targetCalories ? ` · ${d.targetCalories} cal/day` : ''}`}
              renderItem={(meal: any) => (
                <>
                  <div className="min-w-0">
                    <p className="text-white font-medium break-words">{meal.name}</p>
                    <p className="text-gray-400 text-xs">{meal.mealType} • {meal.day}</p>
                  </div>
                  {meal.calories && <div className="shrink-0 text-gray-300 text-sm">{meal.calories} cal</div>}
                </>
              )}
              viewAllLabel="View Full Diet Plan"
              onViewAll={() => setIsDietModalOpen(true)}
              empty={{
                title: 'No active diet plan',
                body: isSubscriptionActive ? 'Your coach will create one soon.' : 'Renew your plan to get new diet plans from your coach.',
                action: renewAction,
              }}
            />
          </div>
        )}

        <FunFactWidget />

        <div id="section-blog" className="scroll-mt-24" />
        <ArticlesRow posts={blogPosts} />

        </div>
      </div>
      )}

      {/* Calorie Calculator View — in-dashboard, no redirect to the public page */}
      {activeView === 'calories' && (
      <div className="pt-24 md:pt-32 pb-28 lg:pb-20 px-3 md:px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to dashboard
          </button>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Calorie Calculator</h1>
              <p className="text-xs md:text-sm text-gray-500">Search Indian foods, pick a serving, see calories &amp; macros instantly.</p>
            </div>
          </div>
          <div className="mt-5">
            <CalorieCalculator />
          </div>
        </div>
      </div>
      )}

      {/* Profile View */}
      {activeView === 'profile' && (
      <div className="pt-24 md:pt-32 pb-28 lg:pb-20 px-3 md:px-4">
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
                      <p className="text-gray-500 text-xs mb-0.5">{isEliteOneOnOnePlan ? 'Sessions & Days Remaining' : 'Days Remaining'}</p>
                      <p className="text-white font-semibold">{isEliteOneOnOnePlan ? `${(getEffectiveTotalSessions(planName, subscription?.subscription?.bonusSessions) || 0) - completedSessions.length} sessions · ${getDaysRemaining(subscription.subscription.endDate)} days` : `${getDaysRemaining(subscription.subscription.endDate)} days`}</p>
                      {isEliteOneOnOnePlan && <p className="mt-1 text-xs text-gray-500">Your plan ends when either runs out, whichever comes first.</p>}
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
                  onClick={startTour}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-brand-blue/30 transition-all group"
                  style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.06) 0%, rgba(23,95,255,0.02) 100%)' }}
                >
                  <div className="p-2 rounded-lg bg-brand-blue/15">
                    <HelpCircle className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Dashboard guide</p>
                    <p className="text-gray-500 text-xs">See how everything works, step by step</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-brand-blue transition-colors" />
                </button>
                <div
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08]"
                  style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.06) 0%, rgba(23,95,255,0.02) 100%)' }}
                >
                  <div className="p-2 rounded-lg bg-brand-blue/15">
                    <SunMoon className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Appearance</p>
                    <p className="text-gray-500 text-xs">Switch between dark and light</p>
                  </div>
                  <ThemeToggle size="sm" className="ml-auto" />
                </div>
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
        isOpen={isHabitTrackerOpen && !!isSubscriptionActive}
        onClose={() => setIsHabitTrackerOpen(false)}
      />

      {user && (
        <TransformationLogModal
          isOpen={isLogbookOpen && !!isSubscriptionActive}
          onClose={() => setIsLogbookOpen(false)}
          userId={user.id}
          userName={user.name}
        />
      )}

      <VideoLibrary
        isOpen={isVideoLibraryOpen && !!isSubscriptionActive}
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
            style={{ background: 'linear-gradient(180deg, rgb(var(--c-navy) / 0.98) 0%, rgb(var(--c-navy) / 0.9) 100%)' }}>
            <h2 className="text-white font-bold text-lg">Chat with Coach</h2>
            <button
              onClick={() => { setActiveView('dashboard'); fetchUnreadChat(); }}
              className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/[0.08] rounded-lg hover:bg-white/5 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatContainer userId={user.id} userRole={user.role} openConversation={chatTarget} onUnreadChange={setUnreadChatCount} onClose={() => { setActiveView('dashboard'); fetchUnreadChat(); }} />
          </div>
        </div>
      )}

      {isTourOpen && activeView === 'dashboard' && <DashboardTour steps={TOUR_STEPS} onClose={closeTour} />}

      <PushPrompt />

      {/* Mobile Bottom Navigation. Hidden behind a popup, where it would cover the popup's own buttons. */}
      {!isOverlayOpen && (
      <MobileBottomNav
        role="client"
        activeTab={activeView === 'profile' || activeView === 'calories' ? 'more' : activeView === 'chat' ? 'chat' : undefined}
        badges={{ chat: unreadChatCount }}
        moreItems={[
          ...(!isLiveSessionPlan ? [{ id: 'video', label: 'Video Library', icon: Play, onSelect: openVideoLibrary, disabled: !isSubscriptionActive }] : []),
          { id: 'habits', label: 'Habit Tracker', icon: ClipboardList, isNew: showHint, onSelect: openHabitTracker, disabled: !isSubscriptionActive },
          { id: 'logbook', label: 'Logbook', icon: TrendingUp, isNew: showHint, onSelect: openLogbook, disabled: !isSubscriptionActive },
          { id: 'calories', label: 'Calorie Calculator', icon: Calculator, onSelect: openCalories },
          { id: 'alerts', label: 'Notifications', icon: Bell, badge: notificationCount, onSelect: () => setIsNotificationPanelOpen(true) },
          { id: 'guide', label: 'Guide', icon: HelpCircle, onSelect: startTour },
          { id: 'profile', label: 'Profile', icon: User, onSelect: () => { setActiveView('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { id: 'logout', label: 'Logout', icon: LogOut, danger: true, onSelect: handleLogout },
        ]}
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
          const scrollToSection = () => {
            const el = document.getElementById(`section-${tab}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else toast('Your programme runs on live sessions, so it has no separate workout or diet plan here.');
          };
          if (activeView !== 'dashboard') {
            setActiveView('dashboard');
            setTimeout(() => { if (tab !== 'home') scrollToSection(); }, 100);
            return;
          }
          scrollToSection();
        }}
      />
      )}
    </div>
  );
}
