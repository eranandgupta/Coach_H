'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Edit, CreditCard, Trash2, Calendar, ClipboardList, Loader2, Mail, Check, Target, XCircle, ChevronDown, ChevronUp, Clock, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import AssessmentResultsModal from '@/components/AssessmentResultsModal';
import HabitSummaryView from '@/components/HabitSummaryView';
import TransformationLogModal from '@/components/TransformationLogModal';
import InvoicePreviewModal from '@/components/admin/InvoicePreviewModal';
import { isElitePlan, getTotalSessions, subscriptionDisplayStatus, isSubscriptionCurrentlyActive } from '@/lib/planUtils';

// "2 days ago" style relative time; returns 'Never' for null.
function timeSince(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  workouts: any[];
  diets: any[];
  onEditWorkout: (workout: any) => void;
  onEditDiet: (diet: any) => void;
  onDeleteWorkout: (workoutId: number) => void;
  onDeleteDiet: (dietId: number) => void;
  onEditClient: (client: any) => void;
  onDeleteClient: (clientId: number) => void;
  onAddSubscription: (client: any) => void;
  onRefreshClients?: () => void;
  isTrainer?: boolean;
}

export default function ClientDetailModal({
  isOpen,
  onClose,
  client,
  workouts,
  diets,
  onEditWorkout,
  onEditDiet,
  onDeleteWorkout,
  onDeleteDiet,
  onEditClient,
  onDeleteClient,
  onAddSubscription,
  onRefreshClients,
  isTrainer = false,
}: ClientDetailModalProps) {
  const [assessment, setAssessment] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  // Which assessment the results modal is showing (Partner 1 or, for couples, Partner 2).
  const [assessmentView, setAssessmentView] = useState<{ data: any; label: string } | null>(null);
  const [isSendingCredentials, setIsSendingCredentials] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [expiringSubId, setExpiringSubId] = useState<number | null>(null);
  const [showPreviousSubs, setShowPreviousSubs] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loginTotal, setLoginTotal] = useState(0);
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showAllLogins, setShowAllLogins] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceSub, setInvoiceSub] = useState<any>(null);

  // Open the editable invoice for a given subscription (maps it to the invoice shape).
  const openInvoice = (sub: any) => {
    setInvoiceSub({
      id: sub.id,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      transactionId: sub.transactionId ?? null,
      paymentMode: sub.paymentMode ?? null,
      paidAmount: sub.paidAmount ?? null,
      plan: {
        id: sub.plan?.id,
        name: sub.plan?.name ?? 'Plan',
        price: String(sub.plan?.price ?? ''),
        duration: sub.plan?.duration ?? 0,
      },
      user: { id: client.id, name: client.name ?? null, email: client.email ?? '', phone: client.phone ?? null },
    });
    setInvoiceOpen(true);
  };

  const clientPlanName = client?.subscriptions?.[0]?.plan?.name || '';
  const clientIsElite = isElitePlan(clientPlanName);
  const totalSessions = getTotalSessions(clientPlanName) || 0;
  const subscriptionId = client?.subscriptions?.[0]?.id;

  useEffect(() => {
    if (isOpen && client) {
      fetchAssessment();
      fetchLoginHistory();
      if (clientIsElite && subscriptionId) {
        fetchSessions();
      }
    }
  }, [isOpen, client]);

  const fetchLoginHistory = async () => {
    setLoginLoading(true);
    setShowAllLogins(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/login-history?userId=${client.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLoginHistory(data.events || []);
        setLoginTotal(data.totalCount || 0);
        setLastLoginAt(data.lastLoginAt || null);
      } else {
        setLoginHistory([]);
        setLoginTotal(0);
        setLastLoginAt(null);
      }
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchAssessment = async () => {
    setAssessmentLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/assessment?userId=${client.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAssessment(data.assessment);
      } else {
        setAssessment(null);
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      setAssessment(null);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const fetchSessions = async () => {
    setSessionLoading(true);
    try {
      const res = await fetch(`/api/sessions?subscriptionId=${subscriptionId}`);
      if (res.ok) {
        const data = await res.json();
        setCompletedSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleConfirmSession = async (sessionNumber: number) => {
    const notes = prompt(`Mark Session ${sessionNumber} as complete?\n\nAdd notes (optional):`);
    if (notes === null) return; // cancelled

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscriptionId, sessionNumber, notes: notes || undefined }),
      });

      if (res.ok) {
        fetchSessions();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to confirm session');
      }
    } catch (error) {
      alert('Error confirming session');
    }
  };

  const handleUndoSession = async (session: any) => {
    if (!confirm(`Undo Session ${session.sessionNumber} completion?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/sessions?id=${session.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchSessions();
      }
    } catch (error) {
      alert('Error undoing session');
    }
  };

  const handleMarkExpired = async (subId: number) => {
    if (!confirm('Deactivate this subscription? The client will lose access to this plan and stay deactivated (even Elite 1:1 plans with sessions remaining) until you reactivate it.')) return;

    setExpiringSubId(subId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // 'cancelled', not 'expired': checkSubscription() self-heals an Elite (session-based)
        // plan back to 'active' whenever its status is 'expired' and sessions remain, so an
        // 'expired' deactivation silently reverts. 'cancelled' is never resurrected.
        body: JSON.stringify({ id: subId, status: 'cancelled' }),
      });

      if (res.ok) {
        alert('Subscription deactivated');
        onRefreshClients?.();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error marking subscription expired:', error);
      alert('Error updating subscription');
    } finally {
      setExpiringSubId(null);
    }
  };

  const handleSendCredentials = async () => {
    if (!confirm(`Send new login credentials to ${client.email}?\n\nThis will reset their password and email them new credentials.`)) {
      return;
    }

    setIsSendingCredentials(true);
    setCredentialsSent(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/send-credentials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId: client.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setCredentialsSent(true);
        alert(`Success! New credentials sent to ${client.email}`);

        // Reset success state after 3 seconds
        setTimeout(() => setCredentialsSent(false), 3000);
      } else {
        alert(data.error || 'Failed to send credentials');
      }
    } catch (error) {
      console.error('Error sending credentials:', error);
      alert('An error occurred while sending credentials');
    } finally {
      setIsSendingCredentials(false);
    }
  };

  if (!client) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-gradient-to-br from-brand-navy-light to-black border border-white/10 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-brand-navy/90 border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {client.name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{client.name || 'Client'}</h2>
                    {!isTrainer && <p className="text-gray-400">{client.email}</p>}
                    {!isTrainer && client.phone && (
                      <p className="text-gray-500 text-sm">{client.phone}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Subscription Info */}
              {client.subscriptions && client.subscriptions.length > 0 && (() => {
                const now = new Date();
                const subs = client.subscriptions;
                // Feature the subscription that actually covers today; else the queued
                // (upcoming) renewal; else the newest row. This is what stops a still-valid
                // plan from showing "Expired" the moment an early renewal is added.
                const currentSub =
                  subs.find((s: any) => isSubscriptionCurrentlyActive(s, now)) ||
                  subs.find((s: any) => subscriptionDisplayStatus(s, now) === 'upcoming') ||
                  subs[0];
                const previousSubs = subs.filter((s: any) => s.id !== currentSub.id);

                // Full literal class strings (not interpolated) so Tailwind's scanner keeps them.
                const STATUS_STYLES: Record<string, { label: string; heading: string; card: string; prevCard: string; text: string }> = {
                  active:    { label: 'Active',    heading: 'text-green-400',  card: 'bg-green-500/10 border-green-500/30',   prevCard: 'bg-green-500/5 border-green-500/20',   text: 'text-green-400' },
                  paused:    { label: 'Paused',    heading: 'text-yellow-400', card: 'bg-yellow-500/10 border-yellow-500/30', prevCard: 'bg-yellow-500/5 border-yellow-500/20', text: 'text-yellow-400' },
                  upcoming:  { label: 'Upcoming',  heading: 'text-blue-400',   card: 'bg-blue-500/10 border-blue-500/30',     prevCard: 'bg-blue-500/5 border-blue-500/20',     text: 'text-blue-400' },
                  expired:   { label: 'Expired',   heading: 'text-red-400',    card: 'bg-red-500/10 border-red-500/30',       prevCard: 'bg-red-500/5 border-red-500/20',       text: 'text-red-400' },
                  cancelled: { label: 'Cancelled', heading: 'text-gray-400',   card: 'bg-gray-500/10 border-gray-500/30',     prevCard: 'bg-gray-500/5 border-gray-500/20',     text: 'text-gray-400' },
                };
                const styleFor = (s: any) => STATUS_STYLES[subscriptionDisplayStatus(s, now)] || STATUS_STYLES.expired;
                const cur = styleFor(currentSub);

                return (
                  <div className="mb-6 space-y-3">
                    {/* Current Subscription */}
                    <div className={`p-4 border rounded-xl ${cur.card}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`${cur.heading} font-semibold`}>
                          {cur.label} Subscription
                        </h3>
                        {!isTrainer && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openInvoice(currentSub)}
                              className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-all text-xs font-medium"
                            >
                              <FileText className="w-3 h-3" /> Invoice
                            </button>
                            {(currentSub.status === 'active' || currentSub.status === 'paused') && (
                              <button
                                onClick={() => handleMarkExpired(currentSub.id)}
                                disabled={expiringSubId === currentSub.id}
                                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-xs font-medium disabled:opacity-50"
                              >
                                {expiringSubId === currentSub.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                Deactivate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-white font-medium">{currentSub.plan.name}</p>
                      <p className="text-gray-400 text-sm">
                        Status: <span className={cur.text}>{cur.label}</span>
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(currentSub.startDate).toLocaleDateString()} → {new Date(currentSub.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Previous Subscriptions Toggle */}
                    {previousSubs.length > 0 && (
                      <>
                        <button
                          onClick={() => setShowPreviousSubs(!showPreviousSubs)}
                          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors w-full"
                        >
                          {showPreviousSubs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          Previous Subscriptions ({previousSubs.length})
                        </button>

                        {showPreviousSubs && (
                          <div className="space-y-2 pl-2 border-l-2 border-white/10">
                            {previousSubs.map((sub: any) => {
                              const st = styleFor(sub);
                              return (
                              <div
                                key={sub.id}
                                className={`p-3 border rounded-lg ${st.prevCard}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-white text-sm font-medium">{sub.plan.name}</p>
                                    <p className="text-gray-500 text-xs">
                                      <span className={st.text}>{st.label}</span>
                                      {' · '}{new Date(sub.startDate).toLocaleDateString()} → {new Date(sub.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {!isTrainer && (
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        onClick={() => openInvoice(sub)}
                                        className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-all text-xs font-medium"
                                      >
                                        <FileText className="w-3 h-3" /> Invoice
                                      </button>
                                      {(sub.status === 'active' || sub.status === 'paused') && (
                                        <button
                                          onClick={() => handleMarkExpired(sub.id)}
                                          disabled={expiringSubId === sub.id}
                                          className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-xs font-medium disabled:opacity-50"
                                        >
                                          {expiringSubId === sub.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <XCircle className="w-3 h-3" />
                                          )}
                                          Deactivate
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Pre-Assessment Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-brand-blue" />
                    <h3 className="text-xl font-bold text-white">Pre-Assessment Form</h3>
                  </div>
                </div>

                {assessmentLoading ? (
                  <div className="flex items-center justify-center py-12 bg-white/5 rounded-lg border border-white/5">
                    <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                  </div>
                ) : assessment ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setAssessmentView({ data: assessment, label: client.name || 'Client' })}
                      className="w-full bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-5 hover:bg-brand-blue/20 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-left">
                          <p className="text-brand-blue font-semibold mb-2">
                            {assessment.partner2 ? `${client.name || 'Partner 1'} (Partner 1) — Completed ✓` : 'Assessment Completed ✓'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Submitted: {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {assessment.goalLoseFat && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Lose Fat</span>
                            )}
                            {assessment.goalMuscleGain && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Muscle Gain</span>
                            )}
                            {assessment.goalSportsTraining && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Sports Training</span>
                            )}
                            {assessment.goalRehabilitate && (
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Rehab</span>
                            )}
                          </div>
                          <p className="text-brand-blue text-sm mt-3 font-medium">
                            Click to view full assessment →
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Couple plan: Partner 2's assessment */}
                    {assessment.partner2 && (
                      <button
                        onClick={() => setAssessmentView({ data: { ...assessment.partner2, createdAt: assessment.createdAt }, label: `${client.name || 'Client'} — Partner 2` })}
                        className="w-full bg-pink-500/10 border border-pink-500/30 rounded-lg p-5 hover:bg-pink-500/20 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-left">
                            <p className="text-pink-300 font-semibold mb-2">Partner 2 — Completed ✓</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {assessment.partner2.goalLoseFat && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Lose Fat</span>
                              )}
                              {assessment.partner2.goalMuscleGain && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Muscle Gain</span>
                              )}
                              {assessment.partner2.goalSportsTraining && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Sports Training</span>
                              )}
                              {assessment.partner2.goalRehabilitate && (
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Rehab</span>
                              )}
                            </div>
                            <p className="text-pink-300 text-sm mt-3 font-medium">
                              Click to view Partner 2's full assessment →
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/5">
                    <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No assessment submitted yet</p>
                    <p className="text-gray-600 text-xs mt-1">Client needs to complete the pre-assessment form</p>
                  </div>
                )}
              </div>

              {/* Login Activity */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-blue" />
                    <h3 className="text-xl font-bold text-white">Login Activity</h3>
                  </div>
                  <span className="text-sm text-gray-300">
                    Last active: <span className={`font-semibold ${lastLoginAt ? 'text-white' : 'text-orange-400'}`}>{timeSince(lastLoginAt)}</span>
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  {loginLoading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
                  ) : loginHistory.length === 0 ? (
                    <p className="text-gray-500 text-sm">This client has never logged in yet.</p>
                  ) : (
                    <>
                      <p className="text-gray-400 text-xs mb-2">{loginTotal} total login{loginTotal === 1 ? '' : 's'}</p>
                      <div className="space-y-1.5">
                        {(showAllLogins ? loginHistory : loginHistory.slice(0, 5)).map((ev) => (
                          <div key={ev.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5 last:border-0">
                            <span className="text-gray-200">{formatDateTime(ev.createdAt)}</span>
                            <span className="text-gray-500 text-xs">{timeSince(ev.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                      {loginHistory.length > 5 && (
                        <button
                          onClick={() => setShowAllLogins((v) => !v)}
                          className="mt-2 text-brand-blue text-xs font-medium hover:text-brand-gold transition-colors"
                        >
                          {showAllLogins ? 'Show less' : `Show all ${loginHistory.length} recent logins`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Habit Tracker */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-xl font-bold text-white">Habit Tracker</h3>
                  </div>
                  <button
                    onClick={() => setIsLogbookOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/30 transition-all"
                  >
                    <Target className="w-4 h-4" /> Transformation Logbook
                  </button>
                </div>
                <HabitSummaryView userId={client.id} />
              </div>

              {/* Session Tracker — Elite 1:1 only */}
              {clientIsElite && totalSessions > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-violet-400" />
                      <h3 className="text-xl font-bold text-white">Session Tracker</h3>
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded text-xs font-medium">
                        {completedSessions.length}/{totalSessions}
                      </span>
                    </div>
                  </div>

                  {sessionLoading ? (
                    <div className="flex items-center justify-center py-8 bg-white/5 rounded-lg border border-white/5">
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500"
                            style={{ width: `${(completedSessions.length / totalSessions) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Session grid */}
                      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(totalSessions, 12)}, 1fr)` }}>
                        {Array.from({ length: totalSessions }, (_, i) => i + 1).map((num) => {
                          const session = completedSessions.find((s: any) => s.sessionNumber === num);
                          const isCompleted = !!session;
                          return (
                            <button
                              key={num}
                              onClick={() => isCompleted ? handleUndoSession(session) : handleConfirmSession(num)}
                              title={isCompleted ? `Session ${num} — Completed ${new Date(session.completedAt).toLocaleDateString()}${session.notes ? `\nNotes: ${session.notes}` : ''}\nClick to undo` : `Click to mark Session ${num} as complete`}
                              className={`relative flex items-center justify-center h-9 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                                isCompleted
                                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 hover:border-red-500/30 hover:text-red-400'
                                  : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30'
                              }`}
                            >
                              S{num}
                              {isCompleted && (
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Workouts Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Workout Plans</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                      {workouts.length}
                    </span>
                  </div>
                </div>

                {workouts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 group hover:bg-purple-500/15 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-purple-300 text-sm font-semibold">{clientIsElite ? 'Session' : 'Week'} {workout.weekNumber}</p>
                            <p className="text-white font-medium">{workout.title}</p>
                            {workout.description && (
                              <p className="text-gray-400 text-xs mt-1">{workout.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditWorkout(workout)}
                              className="p-1.5 bg-purple-500/30 text-purple-300 rounded hover:bg-purple-500/40 transition-all"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteWorkout(workout.id)}
                              className="p-1.5 bg-red-500/30 text-red-300 rounded hover:bg-red-500/40 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(workout.startDate).toLocaleDateString()} - {new Date(workout.endDate).toLocaleDateString()}
                        </div>
                        {workout.exercises && workout.exercises.length > 0 && (
                          <p className="text-purple-400 text-xs mt-2">{workout.exercises.length} exercises</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/5">
                    <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No workout plans yet</p>
                  </div>
                )}
              </div>

              {/* Diets Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Diet Plans</h3>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                      {diets.length}
                    </span>
                  </div>
                </div>

                {diets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {diets.map((diet) => (
                      <div
                        key={diet.id}
                        className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 group hover:bg-green-500/15 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-green-300 text-sm font-semibold">{clientIsElite ? 'Session' : 'Week'} {diet.weekNumber}</p>
                            <p className="text-white font-medium">{diet.title}</p>
                            {diet.description && (
                              <p className="text-gray-400 text-xs mt-1">{diet.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditDiet(diet)}
                              className="p-1.5 bg-green-500/30 text-green-300 rounded hover:bg-green-500/40 transition-all"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteDiet(diet.id)}
                              className="p-1.5 bg-red-500/30 text-red-300 rounded hover:bg-red-500/40 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(diet.startDate).toLocaleDateString()} - {new Date(diet.endDate).toLocaleDateString()}
                        </div>
                        {diet.targetCalories && (
                          <p className="text-green-400 text-xs mt-2">{diet.targetCalories} cal/day</p>
                        )}
                        {diet.meals && diet.meals.length > 0 && (
                          <p className="text-green-400 text-xs mt-1">{diet.meals.length} meals</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/5">
                    <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No diet plans yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            {!isTrainer && (
            <div className="flex-shrink-0 bg-brand-navy/90 border-t border-white/10 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => onAddSubscription(client)}
                  className="flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2.5 rounded-lg hover:bg-green-500/30 transition-all font-medium text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscription</span>
                  <span className="sm:hidden">Sub</span>
                </button>
                <button
                  onClick={handleSendCredentials}
                  disabled={isSendingCredentials}
                  className="flex items-center justify-center gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-2.5 rounded-lg hover:bg-cyan-500/30 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingCredentials ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Sending...</span>
                    </>
                  ) : credentialsSent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Sent!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Send Credentials</span>
                      <span className="sm:hidden">Creds</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onEditClient(client)}
                  className="flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2.5 rounded-lg hover:bg-blue-500/30 transition-all font-medium text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDeleteClient(client.id);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2.5 rounded-lg hover:bg-red-500/30 transition-all font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
            )}
          </motion.div>

          {/* Assessment Results Modal — shows Partner 1 or Partner 2 depending on selection */}
          {assessmentView && (
            <AssessmentResultsModal
              isOpen={!!assessmentView}
              onClose={() => setAssessmentView(null)}
              assessment={assessmentView.data}
              clientName={assessmentView.label}
            />
          )}

          {/* Editable invoice — coaches/admins can adjust amounts (discounts, split payments) */}
          <InvoicePreviewModal open={invoiceOpen} onOpenChange={setInvoiceOpen} subscription={invoiceSub} />

          {/* Transformation Logbook — coach/trainer can view & fill Day-30 measurements */}
          {isLogbookOpen && (
            <TransformationLogModal
              isOpen={isLogbookOpen}
              onClose={() => setIsLogbookOpen(false)}
              userId={client.id}
              userName={client.name}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
