'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Edit, CreditCard, Trash2, Calendar, ClipboardList, Loader2, Mail, Check, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import AssessmentResultsModal from '@/components/AssessmentResultsModal';
import { isElitePlan, getTotalSessions } from '@/lib/planUtils';

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
  isTrainer = false,
}: ClientDetailModalProps) {
  const [assessment, setAssessment] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSendingCredentials, setIsSendingCredentials] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);

  const clientPlanName = client?.subscriptions?.[0]?.plan?.name || '';
  const clientIsElite = isElitePlan(clientPlanName);
  const totalSessions = getTotalSessions(clientPlanName) || 0;
  const subscriptionId = client?.subscriptions?.[0]?.id;

  useEffect(() => {
    if (isOpen && client) {
      fetchAssessment();
      if (clientIsElite && subscriptionId) {
        fetchSessions();
      }
    }
  }, [isOpen, client]);

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
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm flex items-center justify-center p-4"
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
            <div className="flex-shrink-0 bg-brand-navy/90 backdrop-blur-md border-b border-white/10 p-6">
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
                const sub = client.subscriptions[0];
                const isPaused = sub.status === 'paused';
                const statusColor = isPaused ? 'yellow' : sub.status === 'active' ? 'green' : 'red';
                const statusLabel = isPaused ? 'Paused' : sub.status === 'active' ? 'Active' : 'Expired';
                return (
                  <div className={`mb-6 p-4 bg-${statusColor}-500/10 border border-${statusColor}-500/30 rounded-xl`}>
                    <h3 className={`text-${statusColor}-400 font-semibold mb-2`}>{isPaused ? 'Paused Subscription' : sub.status === 'active' ? 'Active Subscription' : 'Expired Subscription'}</h3>
                    <p className="text-white font-medium">{sub.plan.name}</p>
                    <p className="text-gray-400 text-sm">
                      Status: <span className={`text-${statusColor}-400`}>{statusLabel}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Expires: {new Date(sub.endDate).toLocaleDateString()}
                    </p>
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
                  <button
                    onClick={() => setIsAssessmentModalOpen(true)}
                    className="w-full bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-5 hover:bg-brand-blue/20 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left">
                        <p className="text-brand-blue font-semibold mb-2">Assessment Completed ✓</p>
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
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/5">
                    <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No assessment submitted yet</p>
                    <p className="text-gray-600 text-xs mt-1">Client needs to complete the pre-assessment form</p>
                  </div>
                )}
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
            <div className="flex-shrink-0 bg-brand-navy/90 backdrop-blur-md border-t border-white/10 p-4">
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

          {/* Assessment Results Modal */}
          {assessment && (
            <AssessmentResultsModal
              isOpen={isAssessmentModalOpen}
              onClose={() => setIsAssessmentModalOpen(false)}
              assessment={assessment}
              clientName={client.name || 'Client'}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
