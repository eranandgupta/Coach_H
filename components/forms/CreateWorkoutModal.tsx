'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Trash2, Dumbbell, Calendar, User, Film, Play, Check, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { isElitePlan } from '@/lib/planUtils';
import VideoPickerModal from '@/components/modals/VideoPickerModal';
import { VIDEO_CATEGORIES, ScreenPalVideo } from '@/lib/screenpal';

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workout?: any; // If provided, we're editing; otherwise, creating
}

interface Exercise {
  _id: number;
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
  const exerciseIdCounter = useRef(1);
  const [exercises, setExercises] = useState<Exercise[]>([
    { _id: 0, name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }
  ]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoPickerIndex, setVideoPickerIndex] = useState<number | null>(null);

  // Flatten all videos from library for auto-matching
  const allLibraryVideos = useMemo(() => {
    const videos: { title: string; embedUrl: string }[] = [];
    const collectVideos = (cats: typeof VIDEO_CATEGORIES) => {
      for (const cat of cats) {
        videos.push(...cat.videos);
        if (cat.subCategories) collectVideos(cat.subCategories);
      }
    };
    collectVideos(VIDEO_CATEGORIES);
    return videos;
  }, []);

  // Find matching videos for a given exercise name (returns multiple)
  const findMatchingVideos = (name: string) => {
    if (!name || name.trim().length < 3) return [];
    const lower = name.trim().toLowerCase();
    const words = lower.split(/\s+/).filter(w => w.length >= 2);

    return allLibraryVideos
      .map(v => {
        const titleLower = v.title.toLowerCase();
        // Score: exact match = 100, contains full name = 50, contains name = 30, word matches
        let score = 0;
        if (titleLower === lower) score = 100;
        else if (titleLower.includes(lower)) score = 50;
        else if (lower.includes(titleLower)) score = 30;
        else {
          // Count how many words from the exercise name appear in the video title
          const matchedWords = words.filter(w => titleLower.includes(w));
          score = matchedWords.length * 10;
        }
        return { ...v, score };
      })
      .filter(v => v.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const selectedClient = clients.find(c => c.id.toString() === clientId);
  const selectedClientIsElite = isElitePlan(selectedClient?.subscriptions?.[0]?.plan?.name || '');

  // Auto-increment week/session number when client is selected (only for new workouts)
  useEffect(() => {
    if (!clientId || workout) return;
    const client = clients.find(c => c.id.toString() === clientId);
    const isElite = isElitePlan(client?.subscriptions?.[0]?.plan?.name || '');

    const fetchNextNumber = async () => {
      try {
        const token = localStorage.getItem('token');

        if (isElite && client?.subscriptions?.[0]?.id) {
          // For Elite clients: next session = completed sessions + 1
          const res = await fetch(`/api/sessions?subscriptionId=${client.subscriptions[0].id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const completedCount = (data.sessions || []).length;
            setWeekNumber((completedCount + 1).toString());
            return;
          }
        }

        // For regular clients: next week = max week + 1
        const res = await fetch('/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const clientWorkouts = (data.workouts || []).filter((w: any) => w.clientId === parseInt(clientId));
          if (clientWorkouts.length > 0) {
            const maxWeek = Math.max(...clientWorkouts.map((w: any) => w.weekNumber || 0));
            setWeekNumber((maxWeek + 1).toString());
          } else {
            setWeekNumber('1');
          }
        }
      } catch {
        // silent - keep default
      }
    };
    fetchNextNumber();
  }, [clientId, workout, clients]);

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
            _id: exerciseIdCounter.current++,
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
        exerciseIdCounter.current = 1;
        setExercises([{ _id: 0, name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }]);

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
      { _id: exerciseIdCounter.current++, name: '', description: '', sets: '', reps: '', duration: '', restTime: '', videoUrl: '', day: 'Monday', exerciseType: 'normal', supersetGroup: '' }
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;
    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExercises(updated);
  };

  const updateExercise = (index: number, field: Exclude<keyof Exercise, '_id'>, value: string) => {
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
        exercises: exercises.filter(ex => ex.name.trim() !== '').map(({ _id, ...rest }) => rest),
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
    <>
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

                  <Reorder.Group axis="y" values={exercises} onReorder={setExercises} className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {exercises.map((exercise, index) => (
                      <Reorder.Item
                        key={exercise._id}
                        value={exercise}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 select-none"
                        style={{ WebkitUserSelect: 'none' }}
                        whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 50, cursor: 'grabbing' }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                            <div className="text-gray-500 hover:text-gray-300 transition-colors touch-none p-1 -m-1" title="Drag to reorder">
                              <GripVertical size={18} />
                            </div>
                            <span className="text-purple-400 font-semibold">Exercise {index + 1}</span>
                            {exercise.exerciseType === 'superset' && (
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs font-medium">Superset</span>
                            )}
                            {exercise.exerciseType === 'dropset' && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-medium">Drop Set</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {exercises.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => moveExercise(index, 'up')}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                                  title="Move up"
                                >
                                  <ChevronUp size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveExercise(index, 'down')}
                                  disabled={index === exercises.length - 1}
                                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                                  title="Move down"
                                >
                                  <ChevronDown size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeExercise(index)}
                                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
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
                          <div>
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, 'name', e.target.value)}
                              className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                              placeholder="Exercise name *"
                              required
                            />
                            {/* Auto-suggestions dropdown when exercise name matches videos */}
                            {exercise.name.trim().length >= 3 && !exercise.videoUrl && (() => {
                              const matches = findMatchingVideos(exercise.name);
                              if (matches.length === 0) return null;
                              return (
                                <div className="mt-1.5 border border-green-500/30 rounded-lg overflow-hidden bg-brand-navy/80">
                                  <div className="px-2.5 py-1.5 bg-green-500/10 border-b border-green-500/20">
                                    <span className="text-green-300 text-xs font-medium">{matches.length} video{matches.length > 1 ? 's' : ''} found</span>
                                  </div>
                                  <div className="max-h-36 overflow-y-auto">
                                    {matches.map((match) => (
                                      <button
                                        key={match.embedUrl}
                                        type="button"
                                        onClick={() => updateExercise(index, 'videoUrl', match.embedUrl)}
                                        className="flex items-center gap-2 w-full px-2.5 py-2 text-left hover:bg-green-500/15 transition-all group border-b border-white/5 last:border-b-0"
                                      >
                                        <Play className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="currentColor" />
                                        <span className="text-gray-200 text-xs truncate flex-1">{match.title}</span>
                                        <span className="text-green-400 text-[10px] font-medium flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">Attach</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                            {exercise.videoUrl && (() => {
                              const match = allLibraryVideos.find(v => v.embedUrl === exercise.videoUrl);
                              if (!match) return null;
                              return (
                                <div className="mt-1.5 flex items-center gap-2 px-2.5 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-lg">
                                  <Check className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                                  <span className="text-brand-blue text-xs truncate">{match.title}</span>
                                </div>
                              );
                            })()}
                          </div>

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

                          <div className="md:col-span-2 flex gap-2">
                            <input
                              type="url"
                              value={exercise.videoUrl}
                              onChange={(e) => updateExercise(index, 'videoUrl', e.target.value)}
                              className="flex-1 bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                              placeholder="Video URL (optional)"
                            />
                            <button
                              type="button"
                              onClick={() => setVideoPickerIndex(index)}
                              className="flex items-center gap-1.5 bg-brand-blue/20 text-brand-blue px-3 py-2 rounded-lg hover:bg-brand-blue/30 transition-all text-sm font-medium whitespace-nowrap border border-brand-blue/30"
                            >
                              <Film size={16} />
                              Browse
                            </button>
                          </div>

                          <textarea
                            value={exercise.description}
                            onChange={(e) => updateExercise(index, 'description', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            rows={2}
                            placeholder="Exercise description/instructions"
                          />
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
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

    {/* Video Picker Modal */}
    <VideoPickerModal
      isOpen={videoPickerIndex !== null}
      onClose={() => setVideoPickerIndex(null)}
      onSelect={(videoUrl) => {
        if (videoPickerIndex !== null) {
          updateExercise(videoPickerIndex, 'videoUrl', videoUrl);
        }
      }}
      currentVideoUrl={videoPickerIndex !== null ? exercises[videoPickerIndex]?.videoUrl : undefined}
      exerciseName={videoPickerIndex !== null ? exercises[videoPickerIndex]?.name : undefined}
    />
    </>
  );
}
