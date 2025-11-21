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
  Bell
} from 'lucide-react';
import CreateWorkoutModal from '@/components/forms/CreateWorkoutModal';
import CreateDietModal from '@/components/forms/CreateDietModal';
import ClientManagementModal from '@/components/forms/ClientManagementModal';
import SubscriptionManagementModal from '@/components/forms/SubscriptionManagementModal';
import ClientDetailModal from '@/components/forms/ClientDetailModal';
import CreateBlogModal from '@/components/CreateBlogModal';
import NotificationModal from '@/components/NotificationModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CoachDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    fetchDashboardData();
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
      setUser(userData.user);

      // Fetch clients
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

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientWorkouts = (clientId: number) => {
    return workouts.filter((w) => w.clientId === clientId);
  };

  const getClientDiets = (clientId: number) => {
    return diets.filter((d) => d.clientId === clientId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Coach Himanshu"
              width={90}
              height={90}
              className="object-contain"
            />
          </Link>

          <div className="flex-1 text-center hidden md:block">
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              Coach Dashboard 🏋️
            </h1>
            <p className="text-gray-300 text-xs lg:text-sm">Manage your clients and create personalized plans</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex-shrink-0"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Dashboard Header & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Mobile Title (shown only on small screens) */}
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Coach Dashboard 🏋️
              </h1>
              <p className="text-gray-300">Manage your clients and create personalized plans</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <button
                onClick={handleCreateNewClient}
                className="bg-transparent border-2 border-blue-500 text-blue-400 px-6 py-3 rounded-xl font-semibold hover:bg-blue-500/10 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Client
              </button>
              <button
                onClick={() => {
                  setSelectedWorkout(null);
                  setIsWorkoutModalOpen(true);
                }}
                className="bg-transparent border-2 border-purple-500 text-purple-400 px-6 py-3 rounded-xl font-semibold hover:bg-purple-500/10 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Workout
              </button>
              <button
                onClick={() => {
                  setSelectedDiet(null);
                  setIsDietModalOpen(true);
                }}
                className="bg-transparent border-2 border-green-500 text-green-400 px-6 py-3 rounded-xl font-semibold hover:bg-green-500/10 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Diet
              </button>
              <button
                onClick={() => setIsBlogModalOpen(true)}
                className="bg-transparent border-2 border-orange-500 text-orange-400 px-6 py-3 rounded-xl font-semibold hover:bg-orange-500/10 transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Create Blog Post
              </button>
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="bg-transparent border-2 border-red-500 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Notify Clients
              </button>
            </div>
          </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{clients.length}</h3>
            <p className="text-gray-300 text-sm">Active Clients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-xl">
                <Dumbbell className="w-6 h-6 text-purple-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{workouts.length}</h3>
            <p className="text-gray-300 text-sm">Workout Plans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/30 rounded-xl">
                <UtensilsCrossed className="w-6 h-6 text-green-300" />
              </div>
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{diets.length}</h3>
            <p className="text-gray-300 text-sm">Diet Plans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/30 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {workouts.length + diets.length}
            </h3>
            <p className="text-gray-300 text-sm">Total Plans</p>
          </motion.div>
        </div>

        {/* Clients Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">My Clients</h2>
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
                          <p className="text-gray-400 text-sm">{client.email}</p>
                          {client.phone && (
                            <p className="text-gray-500 text-xs">{client.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    {client.subscriptions && client.subscriptions.length > 0 && (
                      <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                        <p className="text-green-400 text-xs font-medium">
                          {client.subscriptions[0].plan.name} - {client.subscriptions[0].status}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Expires: {new Date(client.subscriptions[0].endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

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
                            <span className="text-gray-500">No active plans</span>
                          )}
                        </div>
                        <p className="text-xs text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view details →
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
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
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
                      <span className="text-xs text-gray-400">Week {workout.weekNumber}</span>
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
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <p className="text-gray-500 text-center py-8">No workouts created yet</p>
              )}
            </div>
          </div>

          {/* Recent Diets */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
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
                      <span className="text-xs text-gray-400">Week {diet.weekNumber}</span>
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
      />
      <CreateBlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
