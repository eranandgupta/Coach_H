'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Calendar } from 'lucide-react';
import { useEffect } from 'react';

interface ViewWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: any;
}

export default function ViewWorkoutModal({ isOpen, onClose, workout }: ViewWorkoutModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!workout) return null;

  // Group exercises by day
  const exercisesByDay = workout.exercises?.reduce((acc: any, exercise: any) => {
    if (!acc[exercise.day]) {
      acc[exercise.day] = [];
    }
    acc[exercise.day].push(exercise);
    return acc;
  }, {}) || {};

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const orderedDays = days.filter(day => exercisesByDay[day]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-brand-navy-light to-black border border-brand-navy-light/30 rounded-2xl p-6 md:p-8 relative max-w-5xl w-full my-8 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6 pr-8">
                <div className="p-3 bg-purple-500/20 rounded-xl flex-shrink-0">
                  <Dumbbell className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{workout.title}</h2>
                  <p className="text-gray-400 mb-3">{workout.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Week {workout.weekNumber}</span>
                    </div>
                    <div className="text-gray-400">
                      {new Date(workout.startDate).toLocaleDateString()} - {new Date(workout.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {workout.notes && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-blue-400 font-semibold mb-2">Notes from Coach</h3>
                  <p className="text-gray-300 text-sm">{workout.notes}</p>
                </div>
              )}

              {/* Exercises by Day */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Workout Schedule ({workout.exercises?.length || 0} exercises)
                </h3>

                {orderedDays.length === 0 ? (
                  <div className="text-center py-8">
                    <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No exercises added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderedDays.map((day) => (
                      <div key={day} className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-xl font-bold text-purple-400 mb-4">{day}</h4>
                        <div className="space-y-3">
                          {exercisesByDay[day].map((exercise: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-lg font-semibold text-white">{exercise.name}</h5>
                                <div className="flex gap-3 text-sm">
                                  {exercise.sets && exercise.reps && (
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                      {exercise.sets}×{exercise.reps}
                                    </span>
                                  )}
                                  {exercise.duration && (
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                                      {exercise.duration} min
                                    </span>
                                  )}
                                </div>
                              </div>

                              {exercise.description && (
                                <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>
                              )}

                              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                {exercise.restTime && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-400">Rest:</span>
                                    <span>{exercise.restTime}s</span>
                                  </div>
                                )}
                                {exercise.videoUrl && (
                                  <a
                                    href={exercise.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-blue hover:text-blue-400 underline"
                                  >
                                    Watch Video
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full mt-6 bg-white/5 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
