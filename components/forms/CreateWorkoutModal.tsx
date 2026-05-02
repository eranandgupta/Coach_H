'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Dumbbell, Calendar, User } from 'lucide-react';
import { isElitePlan } from '@/lib/planUtils';

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workout?: any; // If provided, we're editing; otherwise, creating
}

interface Exercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  duration: string;
  restTime: string;
  videoUrl: string;
  day: string;
  exerciseType: string;
  supersetGroup: string;
}

export default function CreateWorkoutModal({ isOpen, onClose, onSuccess, workout }: CreateWorkoutModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [weekNumber, setWeekNumber] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }
  ]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const selectedClient = clients.find(c => c.id.toString() === clientId);
  const selectedClientIsElite = isElitePlan(selectedClient?.subscriptions?.[0]?.plan?.name || '');

  useEffect(() => {
    if (isOpen) {
      fetchClients();

      if (workout) {
        // Populate form with existing workout data
        setTitle(workout.title || '');
        setDescription(workout.description || '');
        setClientId(workout.clientId?.toString() || '');
        setWeekNumber(workout.weekNumber?.toString() || '1');
        setStartDate(workout.startDate ? new Date(workout.startDate).toISOString().split('T')[0] : '');
        setEndDate(workout.endDate ? new Date(workout.endDate).toISOString().split('T')[0] : '');
        setNotes(workout.notes || '');

        if (workout.exercises && workout.exercises.length > 0) {
          const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const sorted = [...workout.exercises].sort((a: any, b: any) => {
            const dayDiff = dayOrder.indexOf(a.day || 'Monday') - dayOrder.indexOf(b.day || 'Monday');
            return dayDiff !== 0 ? dayDiff : (a.order || 0) - (b.order || 0);
          });
          setExercises(sorted.map((ex: any) => ({
            name: ex.name || '',
            description: ex.description || '',
            sets: ex.sets?.toString() || '',
            reps: ex.reps || '',
            duration: ex.duration?.toString() || '',
            restTime: ex.restTime?.toString() || '',
            videoUrl: ex.videoUrl || '',
            day: ex.day || 'Monday',
            exerciseType: ex.exerciseType || 'normal',
            supersetGroup: ex.supersetGroup?.toString() || '',
          })));
        }
      } else {
        // Reset form and auto-set dates for current week
        setTitle('');
        setDescription('');
        setClientId('');
        setWeekNumber('1');
        setNotes('');
        setExercises([{ name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }]);

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday

        setStartDate(weekStart.toISOString().split('T')[0]);
        setEndDate(weekEnd.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, workout]);

  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      } else {
        console.error('Failed to fetch clients');
        setClients([]);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const method = workout ? 'PUT' : 'POST';
      const body: any = {
        title,
        description,
        weekNumber: parseInt(weekNumber),
        startDate,
        endDate,
        notes,
        exercises: exercises.filter(ex => ex.name.trim() !== ''),
      };

      if (workout) {
        body.id = workout.id;
      } else {
        body.clientId = parseInt(clientId);
      }

      const res = await fetch('/api/workouts', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Failed to ${workout ? 'update' : 'create'} workout plan`);
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              className="bg-gradient-to-br from-brand-navy-light to-black border border-brand-navy-light/30 rounded-2xl p-8 relative max-w-4xl w-full my-8 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  {workout ? 'Edit Workout Plan' : 'Create Workout Plan'}
                </h2>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Workout Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g., Week 1 - Strength Training"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select Client *
                    </label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue disabled:opacity-50"
                      required
                      disabled={!!workout || clientsLoading}
                    >
                      <option value="">
                        {clientsLoading ? 'Loading clients...' : 'Choose a client'}
                      </option>
                      {!clientsLoading && clients.length > 0 && clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name || client.email}
                        </option>
                      ))}
                      {!clientsLoading && clients.length === 0 && (
                        <option value="" disabled>No clients available</option>
                      )}
                    </select>
                    {workout && (
                      <p className="text-gray-500 text-xs mt-1">Client cannot be changed when editing</p>
                    )}
                    {!workout && clientsLoading && (
                      <p className="text-gray-400 text-xs mt-1">Loading your clients...</p>
                    )}
                    {!workout && !clientsLoading && clients.length === 0 && (
                      <p className="text-orange-400 text-xs mt-1">No clients found. Please add clients first.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    rows={3}
                    placeholder="Brief overview of the workout plan..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      {selectedClientIsElite ? 'Session Number' : 'Week Number'} *
                    </label>
                    <input
                      type="number"
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>
                </div>

                {/* Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Exercises</h3>
                    <button
                      type="button"
                      onClick={addExercise}
                      className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-all"
                    >
                      <Plus size={18} />
                      Add Exercise
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-semibold">Exercise {index + 1}</span>
                            {exercise.exerciseType === 'superset' && (
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs font-medium">Superset</span>
                            )}
                            {exercise.exerciseType === 'dropset' && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-medium">Drop Set</span>
                            )}
                          </div>
                          {exercises.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExercise(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        {/* Exercise Type */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-400 text-xs">Type:</span>
                          {['normal', 'superset', 'dropset'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                const updated = [...exercises];
                                updated[index].exerciseType = type;
                                if (type !== 'superset') updated[index].supersetGroup = '';
                                setExercises(updated);
                              }}
                              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                exercise.exerciseType === type
                                  ? type === 'superset' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                                  : type === 'dropset' ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                  : 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              {type === 'normal' ? 'Normal' : type === 'superset' ? 'Superset' : 'Drop Set'}
                            </button>
                          ))}
                          {exercise.exerciseType === 'superset' && (
                            <input
                              type="number"
                              value={exercise.supersetGroup}
                              onChange={(e) => updateExercise(index, 'supersetGroup', e.target.value)}
                              className="w-20 bg-brand-navy/50 border border-orange-500/30 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-orange-500"
                              placeholder="Group #"
                              min="1"
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Exercise name *"
                            required
                          />

                          <select
                            value={exercise.day}
                            onChange={(e) => updateExercise(index, 'day', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                          >
                            {days.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>

                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Sets (e.g., 3)"
                          />

                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Reps (e.g., 10-12)"
                          />

                          <input
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => updateExercise(index, 'duration', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Duration (min) e.g. planks"
                          />

                          <input
                            type="number"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(index, 'restTime', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Rest time (seconds)"
                          />

                          <input
                            type="url"
                            value={exercise.videoUrl}
                            onChange={(e) => updateExercise(index, 'videoUrl', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            placeholder="Video URL (optional)"
                          />

                          <textarea
                            value={exercise.description}
                            onChange={(e) => updateExercise(index, 'description', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            rows={2}
                            placeholder="Exercise description/instructions"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    rows={2}
                    placeholder="Additional notes for the client..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-white/5 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    {loading ? (workout ? 'Updating...' : 'Creating...') : (workout ? 'Update Workout Plan' : 'Create Workout Plan')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
