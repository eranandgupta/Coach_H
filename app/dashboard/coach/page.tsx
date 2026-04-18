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
  CalendarCog,
  Lightbulb,
} from 'lucide-react';
import VideoLibrary from '@/components/VideoLibrary';
import FunFactModal from '@/components/FunFactModal';
import CreateWorkoutModal from '@/components/forms/CreateWorkoutModal';
import CreateDietModal from '@/components/forms/CreateDietModal';
import ClientManagementModal from '@/components/forms/ClientManagementModal';
import SubscriptionManagementModal from '@/components/forms/SubscriptionManagementModal';
import RenewSubscriptionModal from '@/components/admin/RenewSubscriptionModal';
import AdjustDaysModal from '@/components/admin/AdjustDaysModal';
import ClientDetailModal from '@/components/forms/ClientDetailModal';
import CreateBlogModal from '@/components/CreateBlogModal';
import NotificationModal from '@/components/NotificationModal';
import DashboardLoader from '@/components/DashboardLoader';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CoachDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isFunFactModalOpen, setIsFunFactModalOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  useEffect(() => {
    fetchDashboardData();
    fetchEnrollments();
    fetchPlans();
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

      // Fetch blogs
      const blogRes = await fetch('/api/blog', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogs(blogData);
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

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const now = new Date();
  const activeClientsCount = clients.filter(
    (c) => c.subscriptions?.[0] && new Date(c.subscriptions[0].endDate) >= now
  ).length;
  const inactiveClientsCount = clients.length - activeClientsCount;

  const getClientWorkouts = (clientId: number) => {
    return workouts.filter((w) => w.clientId === clientId);
  };

  const getClientDiets = (clientId: number) => {
    return diets.filter((d) => d.clientId === clientId);
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

            {/* Action Buttons - Premium Horizontal Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateNewClient}
                className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm">Create Client</span>
              </motion.button>

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
                onClick={() => {
                  setSelectedBlog(null);
                  setIsBlogModalOpen(true);
                }}
                className="relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">Create Blog</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsNotificationModalOpen(true)}
                className="relative bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm">Notify Clients</span>
              </motion.button>

              <Link href="/dashboard/coach/feedbacks" className="block">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-200 flex items-center justify-center gap-2 h-full"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Feedbacks</span>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsVideoLibraryOpen(true)}
                className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm">Video Library</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsFunFactModalOpen(true)}
                className="relative bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="text-sm">Fun Facts</span>
              </motion.button>
            </div>
          </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Clients */}
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
            <p className="text-gray-300 text-sm">Total Clients</p>
          </motion.div>

          {/* Active Clients */}
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

          {/* Inactive Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-5"
          >
            <div className="p-2.5 bg-red-500/30 rounded-xl w-fit mb-3">
              <Users className="w-5 h-5 text-red-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{inactiveClientsCount}</h3>
            <p className="text-gray-300 text-sm">Inactive Clients</p>
          </motion.div>

          {/* Workout Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-5"
          >
            <div className="p-2.5 bg-purple-500/30 rounded-xl w-fit mb-3">
              <Dumbbell className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{workouts.length}</h3>
            <p className="text-gray-300 text-sm">Workout Plans</p>
          </motion.div>

          {/* Diet Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-5"
          >
            <div className="p-2.5 bg-emerald-500/30 rounded-xl w-fit mb-3">
              <UtensilsCrossed className="w-5 h-5 text-emerald-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{diets.length}</h3>
            <p className="text-gray-300 text-sm">Diet Plans</p>
          </motion.div>

          {/* Total Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl p-5"
          >
            <div className="p-2.5 bg-orange-500/30 rounded-xl w-fit mb-3">
              <Calendar className="w-5 h-5 text-orange-300" />
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
                    {client.subscriptions && client.subscriptions.length > 0 && (() => {
                      const sub = client.subscriptions[0];
                      const isActive = new Date(sub.endDate) >= now;
                      return (
                      <div className={`mb-3 p-2 rounded border ${isActive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs font-medium ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                              {sub.plan.name} - {isActive ? 'active' : 'expired'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Expires: {new Date(sub.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {isActive ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email });
                                  setSubMode('extend');
                                  setRenewSubOpen(true);
                                }}
                                className="px-2 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-all flex items-center gap-1"
                                title="Extend Plan"
                              >
                                <CreditCard className="w-3 h-3" /> Extend
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email });
                                  setSubMode('renew');
                                  setRenewSubOpen(true);
                                }}
                                className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all flex items-center gap-1"
                                title="Renew Subscription"
                              >
                                <RefreshCw className="w-3 h-3" /> Renew
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
                              className="px-2 py-1 text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded hover:bg-violet-500/30 transition-all flex items-center gap-1"
                              title="Adjust Days"
                            >
                              <CalendarCog className="w-3 h-3" /> Adjust
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendReminder(client);
                              }}
                              className="p-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/30 transition-all"
                              title="Send Reminder"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
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

        {/* New Enrollments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mt-6"
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
              {enrollments.map((enr, idx) => {
                const isActive = enr.status === 'active' && new Date(enr.endDate) >= now;
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
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${isActive ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-red-400 bg-red-500/20 border-red-500/30'}`}>
                              {isActive ? 'Active' : 'Expired'}
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
            </div>
          )}
        </motion.div>

        {/* Manage Blogs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mt-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            Manage Blog Posts
          </h2>
          <div className="space-y-3">
            {blogs.map((blog) => (
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
                  {blog.views > 0 && (
                    <span className="ml-2">{blog.views} views</span>
                  )}
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <p className="text-gray-500 text-center py-8">No blog posts created yet</p>
            )}
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
    </div>
  );
}
