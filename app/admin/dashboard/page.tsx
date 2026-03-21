'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  Tag,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  RefreshCw,
  Loader2,
  Send,
  Clock,
  CheckCircle,
  Lock,
  FileText,
  Trash2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLoader from '@/components/DashboardLoader';
import CreateClientModal from '@/components/admin/CreateClientModal';
import RenewSubscriptionModal from '@/components/admin/RenewSubscriptionModal';
import CreatePromoCodeModal from '@/components/admin/CreatePromoCodeModal';
import InvoicePreviewModal from '@/components/admin/InvoicePreviewModal';

interface Client {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  subscriptions: Array<{
    id: number;
    status: string;
    startDate: string;
    endDate: string;
    transactionId: string | null;
    paymentMode: string | null;
    plan: { id: number; name: string; price: string; duration: number };
  }>;
}

interface Subscription {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  transactionId: string | null;
  paymentMode: string | null;
  plan: { id: number; name: string; price: string; duration: number };
  user: { id: number; name: string | null; email: string; phone: string | null };
}

interface PromoCode {
  id: number;
  code: string;
  discountType: string;
  discountValue: string;
  maxUses: number | null;
  currentUses: number;
  expiryDate: string | null;
  isActive: boolean;
  description: string | null;
  applicablePlans: string | null;
  targetUser: { id: number; name: string | null; email: string } | null;
  createdAt: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');

  const [clients, setClients] = useState<Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [renewSubOpen, setRenewSubOpen] = useState(false);
  const [renewSubClient, setRenewSubClient] = useState<{ id: number; name: string; email: string } | null>(null);
  const [subMode, setSubMode] = useState<'renew' | 'extend'>('renew');
  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceSub, setInvoiceSub] = useState<Subscription | null>(null);

  const [sendingReminder, setSendingReminder] = useState<number | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const getToken = () => localStorage.getItem('token');

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }), []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchClients(), fetchSubscriptions(), fetchPromoCodes(), fetchPlans()]);
    setLoading(false);
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients', { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/');
        return;
      }
      const data = await res.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/admin/panel/subscriptions', { headers: authHeaders() });
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch('/api/admin/promo-codes', { headers: authHeaders() });
      const data = await res.json();
      setPromoCodes(data.promoCodes || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSendReminder = async (clientId: number) => {
    setSendingReminder(clientId);
    try {
      const res = await fetch('/api/admin/send-reminder', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      alert(data.success ? 'Reminder sent successfully!' : (data.error || 'Failed to send reminder'));
    } catch (error) {
      alert('Failed to send reminder');
    }
    setSendingReminder(null);
  };

  const handleSendAllReminders = async () => {
    setSendingAll(true);
    try {
      const res = await fetch('/api/admin/send-reminder', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
      const data = await res.json();
      alert(data.success ? `Sent ${data.sentCount} reminder(s)` : (data.error || 'Failed to send reminders'));
    } catch (error) {
      alert('Failed to send reminders');
    }
    setSendingAll(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== confirmPassword) { setPasswordMessage('New passwords do not match'); return; }
    if (newPassword.length < 6) { setPasswordMessage('New password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage('Password changed successfully!');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setPasswordMessage(data.error || 'Failed to change password');
      }
    } catch (error) { setPasswordMessage('Failed to change password'); }
    setChangingPassword(false);
  };

  const handleDeletePromo = async (promoId: number) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const res = await fetch(`/api/admin/promo-codes?id=${promoId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        fetchPromoCodes();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete promo code');
      }
    } catch (error) {
      alert('Failed to delete promo code');
    }
  };

  // Computed stats
  const totalClients = clients.length;
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active' && new Date(s.endDate) >= now).length;
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringSoon = subscriptions.filter(
    (s) => s.status === 'active' && new Date(s.endDate) <= sevenDaysFromNow && new Date(s.endDate) >= now
  ).length;
  const totalPromoCodes = promoCodes.length;

  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const expiringSubscriptions = subscriptions.filter(
    (s) => s.status === 'active' && new Date(s.endDate) <= fourteenDaysFromNow && new Date(s.endDate) >= now
  );

  const filteredClients = searchQuery
    ? clients.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
      )
    : clients;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const getSubscriptionStatus = (client: Client) => {
    const activeSub = client.subscriptions?.find((s) => s.status === 'active' && new Date(s.endDate) >= now);
    if (activeSub) return { label: 'Active', color: 'text-green-400 bg-green-500/20 border-green-500/30', plan: activeSub.plan.name };
    const lastSub = client.subscriptions?.[0];
    if (lastSub) return { label: 'Expired', color: 'text-red-400 bg-red-500/20 border-red-500/30', plan: lastSub.plan.name };
    return { label: 'No Plan', color: 'text-gray-400 bg-gray-500/20 border-gray-500/30', plan: '-' };
  };

  if (loading) return <DashboardLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy">
      {/* Fixed Header - matches coach dashboard */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo.png" alt="Coach Himanshu" width={90} height={90} className="object-contain" />
          </Link>
          <div className="flex-1 text-center hidden md:block">
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">Admin Panel</h1>
            <p className="text-gray-300 text-xs lg:text-sm">Manage clients, subscriptions & promo codes</p>
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
          {/* Mobile Title */}
          <div className="md:hidden mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-300">Manage clients, subscriptions & promo codes</p>
          </div>

          {/* Stats Grid - matches coach dashboard style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6">
              <div className="p-3 bg-blue-500/30 rounded-xl w-fit mb-3">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{totalClients}</h3>
              <p className="text-gray-300 text-sm">Total Clients</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
              <div className="p-3 bg-green-500/30 rounded-xl w-fit mb-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{activeSubscriptions}</h3>
              <p className="text-gray-300 text-sm">Active Subs</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6">
              <div className="p-3 bg-orange-500/30 rounded-xl w-fit mb-3">
                <Clock className="w-6 h-6 text-orange-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{expiringSoon}</h3>
              <p className="text-gray-300 text-sm">Expiring (7d)</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
              <div className="p-3 bg-purple-500/30 rounded-xl w-fit mb-3">
                <Tag className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{totalPromoCodes}</h3>
              <p className="text-gray-300 text-sm">Promo Codes</p>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6 p-1 h-auto">
                <TabsTrigger value="clients" className="flex-1 gap-1.5 text-xs sm:text-sm text-gray-400 data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5">
                  <Users className="h-4 w-4" /> <span className="hidden sm:inline">Clients</span>
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="flex-1 gap-1.5 text-xs sm:text-sm text-gray-400 data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5">
                  <CreditCard className="h-4 w-4" /> <span className="hidden sm:inline">Subscriptions</span>
                </TabsTrigger>
                <TabsTrigger value="promos" className="flex-1 gap-1.5 text-xs sm:text-sm text-gray-400 data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5">
                  <Tag className="h-4 w-4" /> <span className="hidden sm:inline">Promos</span>
                </TabsTrigger>
                <TabsTrigger value="reminders" className="flex-1 gap-1.5 text-xs sm:text-sm text-gray-400 data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5">
                  <Bell className="h-4 w-4" /> <span className="hidden sm:inline">Reminders</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 gap-1.5 text-xs sm:text-sm text-gray-400 data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5">
                  <Settings className="h-4 w-4" /> <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* ===== Tab 1: Clients ===== */}
              <TabsContent value="clients">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
                    <div className="relative flex-1 w-full sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" placeholder="Search by name, email, phone..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={fetchClients} className="p-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setCreateClientOpen(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 text-sm">
                        <Plus className="h-4 w-4" /> Create Client
                      </motion.button>
                    </div>
                  </div>

                  {filteredClients.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No clients found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredClients.map((client, idx) => {
                        const subStatus = getSubscriptionStatus(client);
                        return (
                          <motion.div key={client.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-brand-blue/30 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {client.name?.[0]?.toUpperCase() || 'C'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <h3 className="font-semibold text-white truncate">{client.name || 'Unnamed'}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${subStatus.color}`}>{subStatus.label}</span>
                                  </div>
                                  <p className="text-sm text-gray-400">{client.email}</p>
                                  {client.phone && <p className="text-sm text-gray-500">{client.phone}</p>}
                                  <p className="text-xs text-gray-500 mt-1">Plan: {subStatus.plan} | Joined: {formatDate(client.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                                {client.subscriptions?.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setInvoiceSub({
                                        id: sub.id,
                                        status: sub.status,
                                        startDate: sub.startDate,
                                        endDate: sub.endDate,
                                        transactionId: sub.transactionId,
                                        paymentMode: sub.paymentMode,
                                        plan: sub.plan,
                                        user: { id: client.id, name: client.name, email: client.email, phone: client.phone },
                                      });
                                      setInvoiceOpen(true);
                                    }}
                                    title={`Invoice: ${sub.plan.name} (${new Date(sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})`}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 transition-all text-xs">
                                    <FileText className="h-3.5 w-3.5" />
                                    {sub.plan.name.split(' ')[0]} {new Date(sub.startDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                                  </button>
                                ))}
                                {subStatus.label === 'Active' ? (
                                  <button
                                    onClick={() => { setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email }); setSubMode('extend'); setRenewSubOpen(true); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 hover:text-green-300 transition-all text-sm">
                                    <CreditCard className="h-4 w-4" /> Extend Plan
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => { setRenewSubClient({ id: client.id, name: client.name || 'Client', email: client.email }); setSubMode('renew'); setRenewSubOpen(true); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all text-sm">
                                    <CreditCard className="h-4 w-4" /> Renew
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ===== Tab 2: Subscriptions ===== */}
              <TabsContent value="subscriptions">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">All Subscriptions</h2>
                    <button onClick={fetchSubscriptions} className="p-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>

                  {subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No subscriptions found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-left text-gray-400">
                            <th className="pb-3 pr-4">Client</th>
                            <th className="pb-3 pr-4">Plan</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3 pr-4">Start</th>
                            <th className="pb-3 pr-4">End</th>
                            <th className="pb-3 pr-4">Txn ID</th>
                            <th className="pb-3 pr-4">Payment</th>
                            <th className="pb-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.map((sub) => (
                            <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 pr-4">
                                <p className="font-medium text-white">{sub.user.name || 'Unnamed'}</p>
                                <p className="text-xs text-gray-500">{sub.user.email}</p>
                              </td>
                              <td className="py-3 pr-4 text-gray-300">{sub.plan.name}</td>
                              <td className="py-3 pr-4">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${sub.status === 'active' && new Date(sub.endDate) >= now ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-red-400 bg-red-500/20 border-red-500/30'}`}>
                                  {sub.status === 'active' && new Date(sub.endDate) >= now ? 'active' : 'expired'}
                                </span>
                              </td>
                              <td className="py-3 pr-4 text-gray-400">{formatDate(sub.startDate)}</td>
                              <td className="py-3 pr-4 text-gray-400">{formatDate(sub.endDate)}</td>
                              <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{sub.transactionId || '-'}</td>
                              <td className="py-3 pr-4 text-gray-400 capitalize">{sub.paymentMode || '-'}</td>
                              <td className="py-3">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => { setInvoiceSub(sub); setInvoiceOpen(true); }}
                                    className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 text-xs transition-all">
                                    Invoice
                                  </button>
                                  {sub.status === 'active' && new Date(sub.endDate) >= now ? (
                                    <button
                                      onClick={() => { setRenewSubClient({ id: sub.user.id, name: sub.user.name || 'Client', email: sub.user.email }); setSubMode('extend'); setRenewSubOpen(true); }}
                                      className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 text-xs transition-all">
                                      Extend
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => { setRenewSubClient({ id: sub.user.id, name: sub.user.name || 'Client', email: sub.user.email }); setSubMode('renew'); setRenewSubOpen(true); }}
                                      className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 text-xs transition-all">
                                      Renew
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ===== Tab 3: Promo Codes ===== */}
              <TabsContent value="promos">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Promo Codes</h2>
                    <div className="flex gap-2">
                      <button onClick={fetchPromoCodes} className="p-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setCreatePromoOpen(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/30 text-sm">
                        <Plus className="h-4 w-4" /> Generate Code
                      </motion.button>
                    </div>
                  </div>

                  {promoCodes.length === 0 ? (
                    <div className="text-center py-12">
                      <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No promo codes found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {promoCodes.map((promo) => (
                        <div key={promo.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-mono font-bold text-brand-blue text-lg">{promo.code}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${promo.isActive ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-gray-400 bg-gray-500/20 border-gray-500/30'}`}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {promo.targetUser && (
                                  <span className="text-xs px-2 py-0.5 rounded-full border text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                                    Targeted: {promo.targetUser.name || promo.targetUser.email}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">
                                {promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}
                                {promo.description && ` — ${promo.description}`}
                              </p>
                              <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                                <span>Uses: {promo.currentUses}/{promo.maxUses || '∞'}</span>
                                {promo.expiryDate && <span>Expires: {formatDate(promo.expiryDate)}</span>}
                                {promo.applicablePlans && (
                                  <span>Plans: {(() => { try { return JSON.parse(promo.applicablePlans).join(', '); } catch { return promo.applicablePlans; } })()}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all flex-shrink-0"
                              title="Delete promo code"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ===== Tab 4: Reminders ===== */}
              <TabsContent value="reminders">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-white">Renewal Reminders</h2>
                      <p className="text-sm text-gray-400">Clients with subscriptions expiring in the next 14 days</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleSendAllReminders}
                      disabled={sendingAll || expiringSubscriptions.length === 0}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all flex-shrink-0">
                      {sendingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send All
                    </motion.button>
                  </div>

                  <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-300">
                      Auto-reminders are sent via cron job 7 days before expiry. Use this panel to manually send reminders.
                    </p>
                  </div>

                  {expiringSubscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No clients with expiring subscriptions in the next 14 days</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {expiringSubscriptions.map((sub) => {
                        const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={sub.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{sub.user.name || 'Unnamed'}</h3>
                              <p className="text-sm text-gray-400">{sub.user.email}</p>
                              <div className="flex gap-3 mt-1 text-xs">
                                <span className="text-gray-500">Plan: {sub.plan.name}</span>
                                <span className={`font-medium ${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-orange-400' : 'text-yellow-400'}`}>
                                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
                                </span>
                              </div>
                            </div>
                            <button onClick={() => handleSendReminder(sub.user.id)} disabled={sendingReminder === sub.user.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 hover:text-white transition-all text-sm disabled:opacity-50 flex-shrink-0">
                              {sendingReminder === sub.user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Reminder
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ===== Tab 5: Settings ===== */}
              <TabsContent value="settings">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-brand-blue" /> Change Password
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue" />
                    </div>
                    {passwordMessage && (
                      <p className={`text-sm ${passwordMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{passwordMessage}</p>
                    )}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={changingPassword}
                      className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold py-3 rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all disabled:opacity-50">
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </motion.button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <CreateClientModal open={createClientOpen} onOpenChange={setCreateClientOpen}
        onSuccess={() => { fetchClients(); fetchSubscriptions(); }} plans={plans} />
      <RenewSubscriptionModal open={renewSubOpen} onOpenChange={setRenewSubOpen}
        onSuccess={() => { fetchSubscriptions(); fetchClients(); }} client={renewSubClient} plans={plans} mode={subMode} />
      <CreatePromoCodeModal open={createPromoOpen} onOpenChange={setCreatePromoOpen}
        onSuccess={fetchPromoCodes} clients={clients.map((c) => ({ id: c.id, name: c.name || 'Unnamed', email: c.email }))} />
      <InvoicePreviewModal open={invoiceOpen} onOpenChange={setInvoiceOpen} subscription={invoiceSub} />
    </div>
  );
}
