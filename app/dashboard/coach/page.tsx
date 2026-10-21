'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Dumbbell,
  UtensilsCrossed,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  Target,
  Award,
  LogOut,
  Edit,
  Trash2,
  CreditCard,
  UserPlus,
  FileText,
  Bell,
  MessageSquare,
  Mail,
  RefreshCw,
  Play,
  Video,
  Power,
  CalendarCog,
  Lightbulb,
  Settings,
  LayoutTemplate,
  ChevronRight,
  Loader2,
  UserX,
} from 'lucide-react';
import VideoLibrary from '@/components/VideoLibrary';
import FunFactModal from '@/components/FunFactModal';
import LiveSessionModal from '@/components/LiveSessionModal';
import CreateWorkoutModal from '@/components/forms/CreateWorkoutModal';
import CreateDietModal from '@/components/forms/CreateDietModal';
import ClientManagementModal from '@/components/forms/ClientManagementModal';
import SubscriptionManagementModal from '@/components/forms/SubscriptionManagementModal';
import RenewSubscriptionModal from '@/components/admin/RenewSubscriptionModal';
import AdjustDaysModal from '@/components/admin/AdjustDaysModal';
import ActivateSubscriptionModal from '@/components/admin/ActivateSubscriptionModal';
import ClientDetailModal from '@/components/forms/ClientDetailModal';
import CreateBlogModal from '@/components/CreateBlogModal';
import NotificationModal from '@/components/NotificationModal';
import DashboardLoader from '@/components/DashboardLoader';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isElitePlan, isSubscriptionCurrentlyActive, subscriptionDisplayStatus } from '@/lib/planUtils';
import MobileBottomNav from '@/components/MobileBottomNav';
import { loadSession, logout } from '@/lib/session';
import ThemeToggle from '@/components/theme/ThemeToggle';
import CoachInsightsRail from '@/components/coach/CoachInsightsRail';
import DashboardHero from '@/components/coach/DashboardHero';
import { avatarTone } from '@/lib/avatarTone';
import { lastActiveAt, lastActiveLabel } from '@/lib/lastActive';
import { usePresenceHeartbeat } from '@/lib/usePresence';
import ChatContainer from '@/components/chat/ChatContainer';
import TrainerAssignmentModal from '@/components/forms/TrainerAssignmentModal';
import TrainerManagementModal from '@/components/forms/TrainerManagementModal';
import ManageTemplatesModal from '@/components/forms/ManageTemplatesModal';

// Simple prev/next pager for long lists.
function Pager({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (p: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <span className="text-gray-400 text-sm">Page {page} of {pageCount}</span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pageCount}
        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}


export default function CoachDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  usePresenceHeartbeat();
  const [clients, setClients] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTab, setClientTab] = useState<'active' | 'inactive'>('active');
  const [enrollPage, setEnrollPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isFunFactModalOpen, setIsFunFactModalOpen] = useState(false);
  const [isLiveSessionModalOpen, setIsLiveSessionModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [plans, setPlans] = useState<{ id: number; name: string; price: number; duration: number }[]>([]);
  const [renewSubOpen, setRenewSubOpen] = useState(false);
  const [renewSubClient, setRenewSubClient] = useState<{ id: number; name: string; email: string } | null>(null);
  const [subMode, setSubMode] = useState<'renew' | 'extend'>('renew');
  const [adjustDaysOpen, setAdjustDaysOpen] = useState(false);
  const [adjustDaysClient, setAdjustDaysClient] = useState<any>(null);
  const [activateSubOpen, setActivateSubOpen] = useState(false);
  const [activateSubData, setActivateSubData] = useState<any>(null);
  const [deletingSubId, setDeletingSubId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isTrainerAssignmentOpen, setIsTrainerAssignmentOpen] = useState(false);
  const [isTrainerManagementOpen, setIsTrainerManagementOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/new-enrollments', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/subscriptions/plans');
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
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
    fetchEnrollments();
    fetchPlans();
    fetchUnreadChat();
    const chatInterval = setInterval(fetchUnreadChat, 30000);

    // Refresh the client grid when the coach comes back to the tab, so "Active Xm ago"
    // and subscription badges aren't stuck at whatever they were on first load.
    const onVisible = () => {
      if (document.hidden) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('/api/clients', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setClients(data.clients); })
        .catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(chatInterval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const session = await loadSession();
      if (session.status === 'unauthenticated') { window.location.href = '/'; return; }
      if (session.status === 'error') { setTimeout(fetchDashboardData, 4000); return; }
      const token = session.token as string;
      setUser(session.user);
      setLoading(false); // dashboard shell can render now; rest streams in

      // Secondary data — fetched in parallel, never blocks the loader. Each
      // section renders an empty state until its data lands. (Previously these
      // ran sequentially before the loader cleared, stacking their latencies.)
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      fetch('/api/clients', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setClients(data.clients); })
        .catch(() => {});

      fetch('/api/workouts', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setWorkouts(data.workouts); })
        .catch(() => {});

      fetch('/api/diets', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setDiets(data.diets); })
        .catch(() => {});

      fetch('/api/blog', authHeader)
        .then(res => (res.ok ? res.json() : null))
        .then(data => { if (data) setBlogs(data); })
        .catch(() => {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: any) => {
    setIsClientDetailModalOpen(false);
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleDeleteClient = async (clientId: number) => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all their workouts and diets.')) {
      return;
    }

    // Prompt for password confirmation
    const password = prompt('Please enter your password to confirm deletion:');

    if (!password) {
      alert('Password is required to delete a client');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/clients?id=${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        alert('Client deleted successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('An error occurred while deleting the client');
    }
  };

  const handleAddSubscription = (client: any) => {
    setIsClientDetailModalOpen(false);
    setSelectedClient(client);
    setIsSubscriptionModalOpen(true);
  };

  const handleCreateNewClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };

  const handleViewClientDetail = (client: any) => {
    setSelectedClient(client);
    setIsClientDetailModalOpen(true);
  };

  const handleEditWorkout = (workout: any) => {
    setIsClientDetailModalOpen(false);
    setSelectedWorkout(workout);
    setIsWorkoutModalOpen(true);
  };

  const handleDeleteWorkout = async (workoutId: number) => {
    if (!confirm('Are you sure you want to delete this workout plan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/workouts?id=${workoutId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('An error occurred while deleting the workout');
    }
  };

  const handleEditDiet = (diet: any) => {
    setIsClientDetailModalOpen(false);
    setSelectedDiet(diet);
    setIsDietModalOpen(true);
  };

  const handleDeleteDiet = async (dietId: number) => {
    if (!confirm('Are you sure you want to delete this diet plan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/diets?id=${dietId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete diet');
      }
    } catch (error) {
      console.error('Error deleting diet:', error);
      alert('An error occurred while deleting the diet');
    }
  };

  const handleEditBlog = (blog: any) => {
    setSelectedBlog(blog);
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlog = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blog?id=${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDashboardData();
        alert('Blog post deleted successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('An error occurred while deleting the blog post');
    }
  };

  const handleSendReminder = async (client: any) => {
    if (!client.subscriptions || client.subscriptions.length === 0) {
      alert('This client has no active subscription');
      return;
    }

    const subscription = client.subscriptions[0];
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (!confirm(`Send subscription reminder to ${client.name}?\n\nPlan: ${subscription.plan.name}\nExpires: ${endDate.toLocaleDateString()}\nDays Remaining: ${daysRemaining}`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/clients/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clientId: client.id }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Reminder sent successfully to ${client.email}!\nDays remaining: ${data.daysRemaining}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('An error occurred while sending the reminder');
    }
  };

  const handleDeleteSubscription = async (subId: number) => {
    if (!confirm('Delete this subscription permanently? This cannot be undone.')) return;
    setDeletingSubId(subId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/subscriptions?id=${subId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete subscription');
        return;
      }
      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('An error occurred while deleting the subscription.');
    } finally {
      setDeletingSubId(null);
    }
  };

  const now = new Date();
  // Window-aware & matches the admin panel: a client is active only if some subscription
  // actually covers today (started, not ended, or an Elite session plan). A future-dated
  // "Upcoming" renewal does NOT count as currently active.
  const isClientActive = (c: any) =>
    !!c.subscriptions?.some((s: any) => isSubscriptionCurrentlyActive(s, now));
  const activeClientsCount = clients.filter(isClientActive).length;
  const inactiveClientsCount = clients.length - activeClientsCount;

  const searchedClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // My Clients is split into Active / Inactive tabs (default Active).
  const filteredClients = searchedClients.filter((c) =>
    clientTab === 'active' ? isClientActive(c) : !isClientActive(c)
  );

  // Pagination for New Enrollments and Manage Blog Posts.
  const PAGE_SIZE = 6;
  const enrollPageCount = Math.max(1, Math.ceil(enrollments.length / PAGE_SIZE));
  const safeEnrollPage = Math.min(enrollPage, enrollPageCount);
  const pagedEnrollments = enrollments.slice((safeEnrollPage - 1) * PAGE_SIZE, safeEnrollPage * PAGE_SIZE);
  const blogPageCount = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const safeBlogPage = Math.min(blogPage, blogPageCount);
  const pagedBlogs = blogs.slice((safeBlogPage - 1) * PAGE_SIZE, safeBlogPage * PAGE_SIZE);

  const getClientWorkouts = (clientId: number) => {
    return workouts.filter((w) => w.clientId === clientId);
  };

  const getClientDiets = (clientId: number) => {
    return diets.filter((d) => d.clientId === clientId);
  };

  const isClientElite = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return isElitePlan(client?.subscriptions?.[0]?.plan?.name || '');
  };

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 navbar-glass">
        <div className="max-w-[1680px] mx-auto px-4 py-2.5 flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center flex-shrink-0"
            aria-label="Dashboard home"
            title="Dashboard home"
          >
            <Image
              src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
              alt="Coach Himanshu"
              width={90}
              height={90}
              className="theme-logo object-contain"
            />
          </button>

          <span aria-hidden className="hidden md:block h-8 w-px bg-white/10" />
          <div className="hidden md:block min-w-0">
            <h1 className="text-base font-semibold text-white leading-tight">Coach Dashboard</h1>
            <p className="text-xs text-gray-500 truncate">Manage your clients and create personalized plans</p>
          </div>

          <div className="ml-auto hdr-group">
            <button onClick={() => setIsChatOpen(true)} className="hdr-btn" aria-label="Chat">
              <MessageSquare />
              <span className="hidden lg:inline">Chat</span>
              {unreadChatCount > 0 && <span className="hdr-badge">{unreadChatCount > 9 ? '9+' : unreadChatCount}</span>}
            </button>
            <span aria-hidden className="hdr-sep" />
            <ThemeToggle size="sm" className="mx-1" />
            <span aria-hidden className="hdr-sep" />
            <button onClick={handleLogout} className="hdr-btn is-danger" aria-label="Logout" title="Logout">
              <LogOut />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-28 pb-28 lg:pb-20 px-4">
        <div className="max-w-[1680px] mx-auto xl:grid xl:grid-cols-[minmax(0,1fr)_290px] 2xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6 xl:items-start">
        <div className="min-w-0">
          {/* Mobile Dashboard Header & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <DashboardHero
              stats={[
                { label: 'Total Clients', value: clients.length, icon: Users },
                { label: 'Active Clients', value: activeClientsCount, icon: Award, progress: clients.length ? activeClientsCount / clients.length : 0 },
                { label: 'Inactive Clients', value: inactiveClientsCount, icon: UserX },
                { label: 'Workout Plans', value: workouts.length, icon: Dumbbell },
                { label: 'Diet Plans', value: diets.length, icon: UtensilsCrossed },
                { label: 'Total Plans', value: workouts.length + diets.length, icon: Calendar },
              ]}
            />

            {/* Action Buttons - Premium Horizontal Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 2xl:grid-cols-12 gap-2.5">
              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={handleCreateNewClient}
                className="action-btn is-primary"
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm">Create Client</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedWorkout(null);
                  setIsWorkoutModalOpen(true);
                }}
                className="action-btn" data-tone="violet"
              >
                <Dumbbell className="w-5 h-5" />
                <span className="text-sm">Create Workout</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDiet(null);
                  setIsDietModalOpen(true);
                }}
                className="action-btn" data-tone="violet"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-sm">Create Diet</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsTemplatesModalOpen(true)}
                className="action-btn" data-tone="violet"
              >
                <LayoutTemplate className="w-5 h-5" />
                <span className="text-sm">Templates</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedBlog(null);
                  setIsBlogModalOpen(true);
                }}
                className="action-btn" data-tone="amber"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">Create Blog</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsNotificationModalOpen(true)}
                className="action-btn" data-tone="emerald"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm">Notify Clients</span>
              </motion.button>

              <Link href="/dashboard/coach/feedbacks" className="block">
                <motion.div
                                    whileTap={{ scale: 0.98 }}
                  className="action-btn h-full" data-tone="emerald"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Feedbacks</span>
                </motion.div>
              </Link>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVideoLibraryOpen(true)}
                className="action-btn" data-tone="amber"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm">Video Library</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFunFactModalOpen(true)}
                className="action-btn" data-tone="amber"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="text-sm">Fun Facts</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsLiveSessionModalOpen(true)}
                className="action-btn" data-tone="amber"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">Live Sessions</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsTrainerAssignmentOpen(true)}
                className="action-btn" data-tone="slate"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Assign Trainer</span>
              </motion.button>

              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => setIsTrainerManagementOpen(true)}
                className="action-btn" data-tone="slate"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm">Manage Trainer</span>
              </motion.button>
            </div>
          </motion.div>

        {/* Clients Section */}
        <motion.div
          id="section-clients"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-6">
            <h2 className="text-2xl font-bold text-white">My Clients</h2>

            {/* Active / Inactive segmented control (default Active) */}
            <div role="tablist" aria-label="Client status" className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {([['active', 'Active', activeClientsCount], ['inactive', 'Inactive', inactiveClientsCount]] as const).map(([key, label, count]) => {
                const selected = clientTab === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setClientTab(key)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      selected
                        ? 'bg-brand-navy-light text-white shadow-sm ring-1 ring-white/[0.08]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${key === 'active' ? 'bg-emerald-400' : 'bg-rose-400'} ${selected ? '' : 'opacity-50'}`} />
                    {label}
                    <span className={`min-w-[22px] px-1.5 py-0.5 rounded-md text-[11px] leading-none tabular-nums ${selected ? 'bg-white/[0.08] text-gray-300' : 'bg-white/[0.04] text-gray-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64 sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/15 w-full transition-colors"
              />
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No clients found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try a different search term' : 'Start by creating workout plans for your clients'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client, idx) => {
                const clientWorkouts = getClientWorkouts(client.id);
                const clientDiets = getClientDiets(client.id);
                const activeWorkout = clientWorkouts.find(
                  (w) => new Date(w.endDate) >= new Date()
                );
                const activeDiet = clientDiets.find(
                  (d) => new Date(d.endDate) >= new Date()
                );

                return (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx, 12) * 0.03 }}
                    onClick={() => handleViewClientDetail(client)}
                    className="group flex flex-col bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 shadow-sm hover:border-brand-blue/35 hover:shadow-[0_12px_32px_-16px_rgba(23,95,255,0.45)] transition-all cursor-pointer"
                  >
                    {/* Identity */}
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 shrink-0 rounded-full ring-1 flex items-center justify-center font-bold ${avatarTone(client.id)}`}>
                        {client.name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold truncate group-hover:text-brand-blue transition-colors">
                          {client.name || 'Client'}
                        </h3>
                        <p className="text-gray-400 text-xs truncate">{client.email}</p>
                        <p className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${lastActiveAt(client) ? 'text-gray-500' : 'text-amber-400/90'}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${lastActiveAt(client) ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {lastActiveLabel(lastActiveAt(client))}
                          {client.phone && <span className="text-gray-600">· {client.phone}</span>}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 text-gray-600 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Subscription */}
                    {client.subscriptions && client.subscriptions.length > 0 && (() => {
                      // Feature the plan covering today; else the queued (upcoming) one; else newest.
                      const subs = client.subscriptions;
                      const sub =
                        subs.find((s: any) => isSubscriptionCurrentlyActive(s, now)) ||
                        subs.find((s: any) => subscriptionDisplayStatus(s, now) === 'upcoming') ||
                        subs[0];
                      const ds = subscriptionDisplayStatus(sub, now);
                      const isActive = ds === 'active' || ds === 'paused';
                      const hasCoverage = isActive || ds === 'upcoming';
                      const pill: Record<string, string> = {
                        active: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
                        paused: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
                        upcoming: 'bg-brand-blue/10 text-blue-400 ring-brand-blue/20',
                      };
                      const pillCls = pill[ds] || 'bg-rose-500/10 text-rose-400 ring-rose-500/20';
                      const dateLabel = ds === 'upcoming' ? 'Starts' : isActive ? 'Expires' : 'Expired';
                      const date = new Date(ds === 'upcoming' ? sub.startDate : sub.endDate);
                      const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / 86400000);
                      const ghost = 'inline-flex items-center justify-center gap-1.5 min-w-0 [&>svg]:shrink-0 px-2 py-1.5 text-xs font-medium rounded-lg text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.14] transition-colors';
                      const iconBtn = 'inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 bg-white/[0.04] border border-white/[0.08] transition-colors';
                      return (
                      <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white leading-snug line-clamp-2">{sub.plan.name}</p>
                          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ring-1 ${pillCls}`}>
                            <span className="w-1 h-1 rounded-full bg-current" />
                            {ds}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {dateLabel} {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {isActive && daysLeft > 0 && (
                            <span className={daysLeft <= 7 ? 'text-amber-400' : 'text-gray-500'}>· {daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
                          )}
                        </p>
                        {isActive && (() => {
                          const start = new Date(sub.startDate).getTime();
                          const end = new Date(sub.endDate).getTime();
                          const pct = end > start ? Math.min(100, Math.max(0, ((now.getTime() - start) / (end - start)) * 100)) : 0;
                          return (
                            <div className="mt-2.5 h-1 rounded-full bg-white/[0.06] overflow-hidden" title={`${Math.round(pct)}% of plan completed`}>
                              <div className={`h-full rounded-full ${daysLeft <= 7 ? 'bg-amber-400' : 'bg-gradient-to-r from-brand-blue to-blue-400'}`} style={{ width: `${pct}%` }} />
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] items-center gap-1 mt-3">
                          {hasCoverage ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email });
                                setSubMode('extend');
                                setRenewSubOpen(true);
                              }}
                              className="inline-flex items-center justify-center gap-1.5 min-w-0 [&>svg]:shrink-0 px-2 py-1.5 text-xs font-semibold rounded-lg text-brand-blue bg-brand-blue/10 border border-brand-blue/25 hover:bg-brand-blue hover:text-snow hover:border-brand-blue transition-colors"
                              title="Extend Plan"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Extend
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email });
                                setSubMode('renew');
                                setRenewSubOpen(true);
                              }}
                              className="inline-flex items-center justify-center gap-1.5 min-w-0 [&>svg]:shrink-0 px-2 py-1.5 text-xs font-semibold rounded-lg text-brand-blue bg-brand-blue/10 border border-brand-blue/25 hover:bg-brand-blue hover:text-snow hover:border-brand-blue transition-colors"
                              title="Renew Subscription"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Renew
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAdjustDaysClient({
                                id: sub.id,
                                endDate: sub.endDate,
                                startDate: sub.startDate,
                                plan: sub.plan,
                                user: { id: client.id, name: client.name || 'Client', email: client.email },
                              });
                              setAdjustDaysOpen(true);
                            }}
                            className={ghost}
                            title="Adjust Days"
                          >
                            <CalendarCog className="w-3.5 h-3.5" /> Adjust
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivateSubData({
                                id: sub.id,
                                endDate: sub.endDate,
                                startDate: sub.startDate,
                                plan: sub.plan,
                                user: { id: client.id, name: client.name || 'Client', email: client.email },
                              });
                              setActivateSubOpen(true);
                            }}
                            className={ghost}
                            title="Activate / Deactivate"
                          >
                            <Power className="w-3.5 h-3.5" /> Activate
                          </button>
                          <div className="contents">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendReminder(client);
                              }}
                              className={`${iconBtn} hover:text-brand-blue hover:border-brand-blue/30`}
                              title="Send Reminder"
                              aria-label="Send reminder"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubscription(sub.id);
                              }}
                              disabled={deletingSubId === sub.id}
                              className={`${iconBtn} hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 disabled:opacity-50`}
                              title="Delete Subscription"
                              aria-label="Delete subscription"
                            >
                              {deletingSubId === sub.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      );
                    })()}

                    {/* Plans footer */}
                    <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1.5" title={activeWorkout ? 'Workout plan active' : 'No active workout'}>
                        <Dumbbell className="w-3.5 h-3.5 text-gray-500" />
                        {clientWorkouts.length} workout{clientWorkouts.length === 1 ? '' : 's'}
                        <span className={`w-1.5 h-1.5 rounded-full ${activeWorkout ? 'bg-emerald-400' : 'bg-white/15'}`} />
                      </span>
                      <span className="inline-flex items-center gap-1.5" title={activeDiet ? 'Diet plan active' : 'No active diet'}>
                        <UtensilsCrossed className="w-3.5 h-3.5 text-gray-500" />
                        {clientDiets.length} diet{clientDiets.length === 1 ? '' : 's'}
                        <span className={`w-1.5 h-1.5 rounded-full ${activeDiet ? 'bg-emerald-400' : 'bg-white/15'}`} />
                      </span>
                      <span className="ml-auto text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity font-medium">View details</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Workouts */}
          <div id="section-workouts" className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-purple-400" />
              Recent Workouts
            </h2>
            <div className="space-y-3">
              {workouts.slice(0, 5).map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{workout.title}</h3>
                      <span className="text-xs text-gray-400">{isClientElite(workout.clientId) ? 'Session' : 'Week'} {workout.weekNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditWorkout(workout)}
                        className="p-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="p-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Client: {workout.client?.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(workout.startDate).toLocaleDateString()} -{' '}
                    {new Date(workout.endDate).toLocaleDateString()}
                    {workout.coach && workout.coach.id !== user?.id && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-semibold ml-auto">
                        By {workout.coach.name || 'Trainer'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <p className="text-gray-500 text-center py-8">No workouts created yet</p>
              )}
            </div>
          </div>

          {/* Recent Diets */}
          <div id="section-diets" className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-green-400" />
              Recent Diets
            </h2>
            <div className="space-y-3">
              {diets.slice(0, 5).map((diet) => (
                <div
                  key={diet.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{diet.title}</h3>
                      <span className="text-xs text-gray-400">{isClientElite(diet.clientId) ? 'Session' : 'Week'} {diet.weekNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditDiet(diet)}
                        className="p-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteDiet(diet.id)}
                        className="p-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Client: {diet.client?.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(diet.startDate).toLocaleDateString()}
                    </div>
                    {diet.targetCalories && (
                      <div>{diet.targetCalories} cal/day</div>
                    )}
                    {diet.coach && diet.coach.id !== user?.id && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-semibold ml-auto">
                        By {diet.coach.name || 'Trainer'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {diets.length === 0 && (
                <p className="text-gray-500 text-center py-8">No diet plans created yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* New Enrollments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-green-400" />
                New Enrollments
              </h2>
              <p className="text-gray-400 text-sm mt-1">Clients who enrolled via online payment</p>
            </div>
            <button onClick={fetchEnrollments} className="p-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {enrollments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No online enrollments yet</p>
          ) : (
            <div className="space-y-3">
              {pagedEnrollments.map((enr, idx) => {
                const isActive = isSubscriptionCurrentlyActive(enr, now);
                return (
                  <motion.div key={enr.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {enr.user?.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-white">{enr.user?.name || 'Unnamed'}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${enr.status === 'paused' ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : isActive ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-red-400 bg-red-500/20 border-red-500/30'}`}>
                              {enr.status === 'paused' ? 'Paused' : isActive ? 'Active' : 'Expired'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{enr.user?.email}</p>
                          {enr.user?.phone && <p className="text-xs text-gray-500">{enr.user.phone}</p>}
                          {enr.customerGoal && (
                            <p className="text-xs text-brand-blue capitalize">{enr.customerGoal.replace(/-/g, ' ')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 text-sm">
                        <span className="text-white font-semibold">{enr.plan?.name}</span>
                        <span className="text-green-400 font-bold">₹{Number(enr.paidAmount).toLocaleString('en-IN')}</span>
                        <span className="text-gray-500 text-xs">{new Date(enr.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className="text-gray-600 font-mono text-xs truncate max-w-[180px]">{enr.razorpayPaymentId}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <Pager page={safeEnrollPage} pageCount={enrollPageCount} onPage={setEnrollPage} />
            </div>
          )}
        </motion.div>

        {/* Manage Blogs Section */}
        <motion.div
          id="section-blogs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            Manage Blog Posts
          </h2>
          <div className="space-y-3">
            {pagedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{blog.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      {blog.readTime && (
                        <span className="text-xs text-gray-500">{blog.readTime} min read</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="p-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{blog.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                  <span className="ml-2">{blog.views ?? 0} views</span>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <p className="text-gray-500 text-center py-8">No blog posts created yet</p>
            )}
            <Pager page={safeBlogPage} pageCount={blogPageCount} onPage={setBlogPage} />
          </div>
        </motion.div>
        </div>

        {/* Right rail — what needs attention today */}
        <div className="mt-6 xl:mt-0">
          <CoachInsightsRail
            clients={clients}
            workouts={workouts}
            diets={diets}
            enrollments={enrollments}
            unreadChatCount={unreadChatCount}
            onOpenClient={handleViewClientDetail}
            onRemind={handleSendReminder}
            onExtend={(client) => {
              setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email });
              setSubMode('extend');
              setRenewSubOpen(true);
            }}
            onOpenChat={() => setIsChatOpen(true)}
          />
        </div>
        </div>
      </div>

      {/* Modals */}
      <CreateWorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => {
          setIsWorkoutModalOpen(false);
          setSelectedWorkout(null);
        }}
        onSuccess={fetchDashboardData}
        workout={selectedWorkout}
      />
      <CreateDietModal
        isOpen={isDietModalOpen}
        onClose={() => {
          setIsDietModalOpen(false);
          setSelectedDiet(null);
        }}
        onSuccess={fetchDashboardData}
        diet={selectedDiet}
      />
      <ManageTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        currentUserId={user?.id}
      />
      <ClientManagementModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSuccess={fetchDashboardData}
        client={selectedClient}
      />
      <SubscriptionManagementModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false);
          setSelectedClient(null);
        }}
        onSuccess={fetchDashboardData}
        client={selectedClient}
      />
      <RenewSubscriptionModal
        open={renewSubOpen}
        onOpenChange={setRenewSubOpen}
        onSuccess={fetchDashboardData}
        client={renewSubClient}
        plans={plans}
        mode={subMode}
        apiUrl="/api/admin/subscriptions"
      />
      <AdjustDaysModal
        open={adjustDaysOpen}
        onOpenChange={setAdjustDaysOpen}
        onSuccess={fetchDashboardData}
        subscription={adjustDaysClient}
      />
      <ActivateSubscriptionModal
        open={activateSubOpen}
        onOpenChange={setActivateSubOpen}
        onSuccess={fetchDashboardData}
        subscription={activateSubData}
      />
      <ClientDetailModal
        isOpen={isClientDetailModalOpen}
        onClose={() => {
          setIsClientDetailModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        workouts={selectedClient ? getClientWorkouts(selectedClient.id) : []}
        diets={selectedClient ? getClientDiets(selectedClient.id) : []}
        onEditWorkout={handleEditWorkout}
        onEditDiet={handleEditDiet}
        onDeleteWorkout={handleDeleteWorkout}
        onDeleteDiet={handleDeleteDiet}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onAddSubscription={handleAddSubscription}
        onRefreshClients={fetchDashboardData}
      />
      <CreateBlogModal
        isOpen={isBlogModalOpen}
        onClose={() => {
          setIsBlogModalOpen(false);
          setSelectedBlog(null);
        }}
        onSuccess={fetchDashboardData}
        blog={selectedBlog}
      />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <VideoLibrary
        isOpen={isVideoLibraryOpen}
        onClose={() => setIsVideoLibraryOpen(false)}
        userEmail={user?.email}
        userRole="coach"
      />
      <FunFactModal
        isOpen={isFunFactModalOpen}
        onClose={() => setIsFunFactModalOpen(false)}
      />
      <LiveSessionModal
        isOpen={isLiveSessionModalOpen}
        onClose={() => setIsLiveSessionModalOpen(false)}
      />

      <TrainerAssignmentModal
        isOpen={isTrainerAssignmentOpen}
        onClose={() => setIsTrainerAssignmentOpen(false)}
      />

      <TrainerManagementModal
        isOpen={isTrainerManagementOpen}
        onClose={() => setIsTrainerManagementOpen(false)}
      />

      {/* Chat Panel – Premium Right-Side Slide */}
      {/* Backdrop overlay for mobile */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-[54] bg-black/50 lg:hidden"
          onClick={() => { setIsChatOpen(false); fetchUnreadChat(); }}
        />
      )}
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-[55] h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[420px] lg:w-[780px]`}
        style={{
          background: 'linear-gradient(180deg, rgb(var(--c-navy) / 0.98) 0%, rgb(var(--c-navy-dark) / 0.99) 100%)',
          boxShadow: isChatOpen ? '-8px 0 40px rgba(0,0,0,0.5), -1px 0 0 rgba(99,145,255,0.08)' : 'none',
        }}
      >
        {/* Premium Glass Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 flex-shrink-0 border-b border-white/[0.06]"
          style={{
            background: 'linear-gradient(135deg, rgba(99,145,255,0.06) 0%, rgba(139,92,246,0.04) 50%, rgb(var(--c-navy) / 0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide">Messages</h2>
              {unreadChatCount > 0 && (
                <p className="text-brand-blue text-[10px] font-medium">{unreadChatCount} unread</p>
              )}
            </div>
          </div>
          <button
            onClick={() => { setIsChatOpen(false); fetchUnreadChat(); }}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white border border-white/[0.08] rounded-lg hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="M13 17l5-5-5-5"/><path d="M6 17l5-5-5-5"/></svg>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Chat Content */}
        {user && (
          <div className="flex-1 overflow-hidden">
            <ChatContainer userId={user.id} userRole={user.role} onUnreadChange={setUnreadChatCount} onClose={() => { setIsChatOpen(false); fetchUnreadChat(); }} />
          </div>
        )}

        {/* Bottom accent line */}
        <div className="h-[1px] flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,145,255,0.15), transparent)' }} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        role="coach"
        activeTab={isChatOpen ? 'chat' : undefined}
        badges={{ chat: unreadChatCount }}
        onTabChange={(tab) => {
          if (tab === 'chat') {
            setIsChatOpen(true);
            return;
          }
          if (isChatOpen) {
            setIsChatOpen(false);
            fetchUnreadChat();
          }
          setTimeout(() => {
            const el = document.getElementById(`section-${tab}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }}
      />
    </div>
  );
}
