'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Edit, CreditCard, Trash2, Calendar, ClipboardList, Loader2, Mail, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import AssessmentResultsModal from '@/components/AssessmentResultsModal';

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
}: ClientDetailModalProps) {
  const [assessment, setAssessment] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSendingCredentials, setIsSendingCredentials] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      fetchAssessment();
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
                    <p className="text-gray-400">{client.email}</p>
                    {client.phone && (
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
              {client.subscriptions && client.subscriptions.length > 0 && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <h3 className="text-green-400 font-semibold mb-2">Active Subscription</h3>
                  <p className="text-white font-medium">{client.subscriptions[0].plan.name}</p>
                  <p className="text-gray-400 text-sm">
                    Status: <span className="text-green-400">{client.subscriptions[0].status}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Expires: {new Date(client.subscriptions[0].endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

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
                            <p className="text-purple-300 text-sm font-semibold">Week {workout.weekNumber}</p>
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
                            <p className="text-green-300 text-sm font-semibold">Week {diet.weekNumber}</p>
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
