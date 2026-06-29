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
} from 'lucide-react';
import VideoLibrary from '@/components/VideoLibrary';
import LiveSessionModal from '@/components/LiveSessionModal';
import CreateWorkoutModal from '@/components/forms/CreateWorkoutModal';
import CreateDietModal from '@/components/forms/CreateDietModal';
import ClientDetailModal from '@/components/forms/ClientDetailModal';
import DashboardLoader from '@/components/DashboardLoader';
import ChatContainer from '@/components/chat/ChatContainer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isElitePlan } from '@/lib/planUtils';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function TrainerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isLiveSessionModalOpen, setIsLiveSessionModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

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
    fetchUnreadChat();
    const chatInterval = setInterval(fetchUnreadChat, 30000);
    return () => clearInterval(chatInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      // Fetch user data
      const userRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      if (userData.user?.role !== 'trainer') {
        router.push('/dashboard');
        return;
      }

      setUser(userData.user);

      // Fetch assigned clients only
      const clientRes = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (clientRes.ok) {
        const clientData = await clientRes.json();
        setClients(clientData.clients);
      }

      // Fetch workouts
      const workoutRes = await fetch('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (workoutRes.ok) {
        const workoutData = await workoutRes.json();
        setWorkouts(workoutData.workouts);
      }

      // Fetch diets
      const dietRes = await fetch('/api/diets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (dietRes.ok) {
        const dietData = await dietRes.json();
        setDiets(dietData.diets);
      }
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

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const now = new Date();
  const activeClientsCount = clients.filter((c) => {
    const sub = c.subscriptions?.[0];
    if (!sub) return false;
    if (new Date(sub.endDate) >= now) return true;
    if (isElitePlan(sub.plan?.name || '') && sub.status === 'active') return true;
    return false;
  }).length;

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
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
              alt="Coach Himanshu"
              width={90}
              height={90}
              className="object-contain"
            />
          </Link>

          <div className="flex-1 text-center hidden md:block">
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              Trainer Dashboard
            </h1>
            <p className="text-gray-300 text-xs lg:text-sm">Manage workouts, diets, and sessions</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Chat Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 rounded-lg hover:bg-brand-blue/30 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden lg:inline">Chat</span>
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-[9px] font-bold text-white">{unreadChatCount > 9 ? '9+' : unreadChatCount}</span>
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-28 pb-28 lg:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Dashboard Header & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Mobile Title */}
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Trainer Dashboard
              </h1>
              <p className="text-gray-300">Manage workouts, diets, and sessions</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedWorkout(null);
                  setIsWorkoutModalOpen(true);
                }}
                className="relative bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-5 h-5" />
                <span className="text-sm">Create Workout</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedDiet(null);
                  setIsDietModalOpen(true);
                }}
                className="relative bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-sm">Create Diet</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsLiveSessionModalOpen(true)}
                className="relative bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm">Live Sessions</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsVideoLibraryOpen(true)}
                className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm">Video Library</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div id="section-home" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-5"
            >
              <div className="p-2.5 bg-blue-500/30 rounded-xl w-fit mb-3">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{clients.length}</h3>
              <p className="text-gray-300 text-sm">Assigned Clients</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-5"
            >
              <div className="p-2.5 bg-green-500/30 rounded-xl w-fit mb-3">
                <Award className="w-5 h-5 text-green-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{activeClientsCount}</h3>
              <p className="text-gray-300 text-sm">Active Clients</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-5"
            >
              <div className="p-2.5 bg-purple-500/30 rounded-xl w-fit mb-3">
                <Dumbbell className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{workouts.length}</h3>
              <p className="text-gray-300 text-sm">Workout Plans</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-5"
            >
              <div className="p-2.5 bg-emerald-500/30 rounded-xl w-fit mb-3">
                <UtensilsCrossed className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{diets.length}</h3>
              <p className="text-gray-300 text-sm">Diet Plans</p>
            </motion.div>
          </div>

          {/* Clients Section */}
          <motion.div
            id="section-clients"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">My Assigned Clients</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue w-full md:w-64"
                />
              </div>
            </div>

            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No clients assigned</p>
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
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleViewClientDetail(client)}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-brand-blue/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {client.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-brand-blue transition-colors">
                              {client.name || 'Client'}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Info */}
                      {client.subscriptions && client.subscriptions.length > 0 && (() => {
                        const sub = client.subscriptions[0];
                        const isActive = new Date(sub.endDate) >= now || (isElitePlan(sub.plan?.name || '') && sub.status === 'active');
                        const isPaused = sub.status === 'paused';
                        return (
                        <div className={`mb-3 p-2 rounded border ${isPaused ? 'bg-yellow-500/10 border-yellow-500/30' : isActive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                          <p className={`text-xs font-medium ${isPaused ? 'text-yellow-400' : isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {sub.plan.name} - {isPaused ? 'paused' : isActive ? 'active' : 'expired'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Expires: {new Date(sub.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        );
                      })()}

                      {/* Plan Counts */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-purple-500/20 rounded">
                            <Dumbbell className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-gray-300">{clientWorkouts.length} Workouts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-green-500/20 rounded">
                            <UtensilsCrossed className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="text-gray-300">{clientDiets.length} Diets</span>
                        </div>
                      </div>

                      {/* Active Status */}
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {activeWorkout && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                                Active Workout
                              </span>
                            )}
                            {activeDiet && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                                Active Diet
                              </span>
                            )}
                            {!activeWorkout && !activeDiet && (
                              <span className="text-gray-500">No active workout/diet</span>
                            )}
                          </div>
                          <p className="text-xs text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view details
                          </p>
                        </div>
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
            <div id="section-workouts" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
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
            <div id="section-diets" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
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
          className="fixed inset-0 z-[54] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => { setIsChatOpen(false); fetchUnreadChat(); }}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-[55] h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[420px] lg:w-[780px]`}
        style={{
          background: 'linear-gradient(180deg, rgba(10,15,31,0.98) 0%, rgba(7,10,21,0.99) 100%)',
          boxShadow: isChatOpen ? '-8px 0 40px rgba(0,0,0,0.5), -1px 0 0 rgba(99,145,255,0.08)' : 'none',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 flex-shrink-0 border-b border-white/[0.06]"
          style={{
            background: 'linear-gradient(135deg, rgba(99,145,255,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(10,15,31,0.95) 100%)',
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
            <ChatContainer userId={user.id} userRole={user.role} onClose={() => { setIsChatOpen(false); fetchUnreadChat(); }} />
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
