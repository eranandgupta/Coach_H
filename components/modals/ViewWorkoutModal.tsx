'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Calendar, Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProtectedContent from '@/components/ProtectedContent';

interface ViewWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: any;
  userEmail?: string;
  isElitePlan?: boolean;
}

export default function ViewWorkoutModal({ isOpen, onClose, workout, userEmail, isElitePlan = false }: ViewWorkoutModalProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [loadingIframeId, setLoadingIframeId] = useState<string | null>(null);

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
            className="fixed inset-0 bg-black/80 z-50"
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

              <ProtectedContent userEmail={userEmail} className="w-full">
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
                      <span>{isElitePlan ? `Session ${workout.weekNumber}` : `Week ${workout.weekNumber}`}</span>
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
                    {orderedDays.map((day) => {
                      // Group exercises: supersets together, others individually
                      const dayExercises = exercisesByDay[day];
                      const groups: any[] = [];
                      const usedIndices = new Set<number>();

                      dayExercises.forEach((exercise: any, idx: number) => {
                        if (usedIndices.has(idx)) return;
                        if (exercise.exerciseType === 'superset' && exercise.supersetGroup) {
                          const supersetExercises = dayExercises.filter((ex: any, i: number) => {
                            if (usedIndices.has(i)) return false;
                            return ex.exerciseType === 'superset' && ex.supersetGroup === exercise.supersetGroup;
                          });
                          supersetExercises.forEach((_: any, i: number) => {
                            const originalIdx = dayExercises.findIndex((ex: any, fi: number) => !usedIndices.has(fi) && ex === supersetExercises[i]);
                            if (originalIdx !== -1) usedIndices.add(originalIdx);
                          });
                          groups.push({ type: 'superset', exercises: supersetExercises });
                        } else {
                          usedIndices.add(idx);
                          groups.push({ type: exercise.exerciseType || 'normal', exercises: [exercise] });
                        }
                      });

                      return (
                      <div key={day} className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-xl font-bold text-purple-400 mb-4">{day}</h4>
                        <div className="space-y-3">
                          {groups.map((group: any, gIdx: number) => (
                            <div key={gIdx}>
                              {group.type === 'superset' && group.exercises.length > 1 && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="h-px flex-1 bg-orange-500/30"></div>
                                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">SUPERSET</span>
                                  <div className="h-px flex-1 bg-orange-500/30"></div>
                                </div>
                              )}
                              <div className={group.type === 'superset' && group.exercises.length > 1 ? 'border-l-2 border-orange-500/40 pl-3 space-y-2' : 'space-y-3'}>
                                {group.exercises.map((exercise: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <h5 className="text-lg font-semibold text-white">{exercise.name}</h5>
                                        {exercise.exerciseType === 'dropset' && (
                                          <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-semibold">DROP SET</span>
                                        )}
                                      </div>
                                      <div className="flex gap-3 text-sm">
                                        {exercise.sets && exercise.reps && (
                                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                            {exercise.sets}×{exercise.reps}
                                          </span>
                                        )}
                                        {exercise.duration && exercise.sets && !exercise.reps && (
                                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                                            {exercise.duration} min × {exercise.sets} sets
                                          </span>
                                        )}
                                        {exercise.duration && !exercise.sets && (
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
                                        <button
                                          onClick={() => {
                                            const newId = playingVideoId === exercise.id ? null : exercise.id;
                                            setPlayingVideoId(newId);
                                            if (newId) setLoadingIframeId(newId);
                                          }}
                                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all font-medium ${
                                            playingVideoId === exercise.id
                                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                              : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/30'
                                          }`}
                                        >
                                          {playingVideoId === exercise.id ? (
                                            <>
                                              <X className="w-3 h-3" />
                                              Close Video
                                            </>
                                          ) : (
                                            <>
                                              <Play className="w-3 h-3" fill="currentColor" />
                                              Play Video
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>

                                    {/* Inline Video Player */}
                                    {exercise.videoUrl && playingVideoId === exercise.id && (
                                      <div className="mt-3 rounded-lg overflow-hidden border border-white/10 bg-black relative">
                                        {loadingIframeId === exercise.id && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                                          </div>
                                        )}
                                        <div className="aspect-video w-full">
                                          <iframe
                                            src={`${exercise.videoUrl}?autoplay=1`}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen"
                                            allowFullScreen
                                            title={exercise.name}
                                            onLoad={() => setLoadingIframeId(null)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      );
                    })}
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
              </ProtectedContent>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
