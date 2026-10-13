'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Dumbbell,
  UtensilsCrossed,
  Search,
  Calendar,
  Award,
  LogOut,
  Edit,
  Play,
  MessageSquare,
  LayoutTemplate,
  ChevronRight,
} from 'lucide-react';
import VideoLibrary from '@/components/VideoLibrary';
import LiveSessionModal from '@/components/LiveSessionModal';
import CreateWorkoutModal from '@/components/forms/CreateWorkoutModal';
import CreateDietModal from '@/components/forms/CreateDietModal';
import ManageTemplatesModal from '@/components/forms/ManageTemplatesModal';
import ClientDetailModal from '@/components/forms/ClientDetailModal';
import DashboardLoader from '@/components/DashboardLoader';
import ChatContainer from '@/components/chat/ChatContainer';
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

export default function TrainerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  usePresenceHeartbeat();
  const [clients, setClients] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTab, setClientTab] = useState<'active' | 'inactive'>('active');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isLiveSessionModalOpen, setIsLiveSessionModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

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
    fetchUnreadChat();
    const chatInterval = setInterval(fetchUnreadChat, 30000);
    return () => clearInterval(chatInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const session = await loadSession();
      if (session.status === 'unauthenticated') { window.location.href = '/'; return; }
      if (session.status === 'error') { setTimeout(fetchDashboardData, 4000); return; }
      const token = session.token as string;
      const userData = { user: session.user };

      if (userData.user?.role !== 'trainer') {
        router.push('/dashboard');
        return;
      }

      setUser(userData.user);
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const handleEditDiet = (diet: any) => {
    setIsClientDetailModalOpen(false);
    setSelectedDiet(diet);
    setIsDietModalOpen(true);
  };

  const now = new Date();
  const isClientActive = (c: any) =>
    !!c.subscriptions?.some((s: any) => isSubscriptionCurrentlyActive(s, now));
  // Assigned clients split into Active / Inactive tabs (default Active), like the coach view.
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (clientTab === 'active' ? isClientActive(client) : !isClientActive(client))
  );

  // Window-aware & consistent with the admin/coach dashboards: active only if a
  // subscription actually covers today (a future "Upcoming" renewal does not count).
  const activeClientsCount = clients.filter((c) =>
    c.subscriptions?.some((s: any) => isSubscriptionCurrentlyActive(s, now))
  ).length;

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
            <h1 className="text-base font-semibold text-white leading-tight">Trainer Dashboard</h1>
            <p className="text-xs text-gray-500 truncate">Manage workouts, diets, and sessions</p>
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
                { label: 'Assigned Clients', value: clients.length, icon: Users },
                { label: 'Active Clients', value: activeClientsCount, icon: Award, progress: clients.length ? activeClientsCount / clients.length : 0 },
                { label: 'Workout Plans', value: workouts.length, icon: Dumbbell },
                { label: 'Diet Plans', value: diets.length, icon: UtensilsCrossed },
              ]}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              <motion.button
                                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedWorkout(null);
                  setIsWorkoutModalOpen(true);
                }}
                className="action-btn is-primary"
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
                onClick={() => setIsLiveSessionModalOpen(true)}
                className="action-btn" data-tone="amber"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm">Live Sessions</span>
              </motion.button>

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
                onClick={() => setIsTemplatesModalOpen(true)}
                className="action-btn" data-tone="violet"
              >
                <LayoutTemplate className="w-5 h-5" />
                <span className="text-sm">Templates</span>
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
              <h2 className="text-2xl font-bold text-white">My Assigned Clients</h2>

              <div role="tablist" aria-label="Client status" className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                {([['active', 'Active', activeClientsCount], ['inactive', 'Inactive', clients.length - activeClientsCount]] as const).map(([key, label, count]) => {
                  const selected = clientTab === key;
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setClientTab(key)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        selected ? 'bg-brand-navy-light text-white shadow-sm ring-1 ring-white/[0.08]' : 'text-gray-400 hover:text-white'
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
                <p className="text-gray-400 mb-2">{clients.length === 0 ? 'No clients assigned' : `No ${clientTab} clients`}</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm ? 'Try a different search term' : 'Ask your coach to assign clients to you'}
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
                          <p className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${lastActiveAt(client) ? 'text-gray-500' : 'text-amber-400/90'}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${lastActiveAt(client) ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {lastActiveLabel(lastActiveAt(client))}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 text-gray-600 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                      </div>

                      {/* Subscription */}
                      {client.subscriptions && client.subscriptions.length > 0 && (() => {
                        const subs = client.subscriptions;
                        const sub =
                          subs.find((s: any) => isSubscriptionCurrentlyActive(s, now)) ||
                          subs.find((s: any) => subscriptionDisplayStatus(s, now) === 'upcoming') ||
                          subs[0];
                        const ds = subscriptionDisplayStatus(sub, now);
                        const isActive = ds === 'active' || ds === 'paused';
                        const pill: Record<string, string> = {
                          active: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
                          paused: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
                          upcoming: 'bg-brand-blue/10 text-blue-400 ring-brand-blue/20',
                        };
                        const pillCls = pill[ds] || 'bg-rose-500/10 text-rose-400 ring-rose-500/20';
                        const dateLabel = ds === 'upcoming' ? 'Starts' : isActive ? 'Expires' : 'Expired';
                        const date = new Date(ds === 'upcoming' ? sub.startDate : sub.endDate);
                        const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / 86400000);
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
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Client: {workout.client?.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(workout.startDate).toLocaleDateString()} -{' '}
                      {new Date(workout.endDate).toLocaleDateString()}
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
                    </div>
                  </div>
                ))}
                {diets.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No diet plans created yet</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right rail — what needs attention today */}
        <div className="mt-6 xl:mt-0">
          <CoachInsightsRail
            clients={clients}
            workouts={workouts}
            diets={diets}
            unreadChatCount={unreadChatCount}
            onOpenClient={handleViewClientDetail}
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
        onDeleteWorkout={() => {}}
        onDeleteDiet={() => {}}
        onEditClient={() => {}}
        onDeleteClient={() => {}}
        onAddSubscription={() => {}}
        isTrainer={true}
      />
      <VideoLibrary
        isOpen={isVideoLibraryOpen}
        onClose={() => setIsVideoLibraryOpen(false)}
        userEmail={user?.email}
        userRole="trainer"
      />
      <LiveSessionModal
        isOpen={isLiveSessionModalOpen}
        onClose={() => setIsLiveSessionModalOpen(false)}
      />

      {/* Chat Panel – Right-Side Slide */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-[54] bg-black/50 lg:hidden"
          onClick={() => { setIsChatOpen(false); fetchUnreadChat(); }}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-[55] h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[420px] lg:w-[780px]`}
        style={{
          background: 'linear-gradient(180deg, rgb(var(--c-navy) / 0.98) 0%, rgb(var(--c-navy-dark) / 0.99) 100%)',
          boxShadow: isChatOpen ? '-8px 0 40px rgba(0,0,0,0.5), -1px 0 0 rgba(99,145,255,0.08)' : 'none',
        }}
      >
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

        {user && (
          <div className="flex-1 overflow-hidden">
            <ChatContainer userId={user.id} userRole={user.role} onUnreadChange={setUnreadChatCount} onClose={() => { setIsChatOpen(false); fetchUnreadChat(); }} />
          </div>
        )}

        <div className="h-[1px] flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,145,255,0.15), transparent)' }} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        role="trainer"
        activeTab={isChatOpen ? 'chat' : undefined}
        badges={{ chat: unreadChatCount }}
        onTabChange={(tab) => {
          if (tab === 'chat') {
            setIsChatOpen(true);
            return;
          }
          if (tab === 'sessions') {
            setIsLiveSessionModalOpen(true);
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
