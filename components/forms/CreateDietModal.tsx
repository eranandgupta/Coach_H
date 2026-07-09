'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, UtensilsCrossed, ChevronUp, ChevronDown } from 'lucide-react';
import { isElitePlan } from '@/lib/planUtils';
import { toDateInputValue } from '@/lib/dateUtils';

interface CreateDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  diet?: any; // If provided, we're editing; otherwise, creating
}

interface Meal {
  _id: number;
  name: string;
  description: string;
  mealType: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  ingredients: string;
  instructions: string;
  alternatives: string;
  day: string;
  time: string;
}

export default function CreateDietModal({ isOpen, onClose, onSuccess, diet }: CreateDietModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [weekNumber, setWeekNumber] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetCalories, setTargetCalories] = useState('');
  const [notes, setNotes] = useState('');
  const mealIdCounter = useRef(1);
  const [meals, setMeals] = useState<Meal[]>([
    { _id: 0, name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', alternatives: '', day: 'Monday', time: '' }
  ]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post-Dinner'];
  const selectedClient = clients.find(c => c.id.toString() === clientId);
  const selectedClientIsElite = isElitePlan(selectedClient?.subscriptions?.[0]?.plan?.name || '');

  // Auto-increment week/session number when client is selected (only for new diets)
  useEffect(() => {
    if (!clientId || diet) return;
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
        const res = await fetch('/api/diets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const clientDiets = (data.diets || []).filter((d: any) => d.clientId === parseInt(clientId));
          if (clientDiets.length > 0) {
            const maxWeek = Math.max(...clientDiets.map((d: any) => d.weekNumber || 0));
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
  }, [clientId, diet, clients]);

  useEffect(() => {
    if (isOpen) {
      fetchClients();

      if (diet) {
        // Populate form with existing diet data
        setTitle(diet.title || '');
        setDescription(diet.description || '');
        setClientId(diet.clientId?.toString() || '');
        setWeekNumber(diet.weekNumber?.toString() || '1');
        setStartDate(toDateInputValue(diet.startDate));
        setEndDate(toDateInputValue(diet.endDate));
        setTargetCalories(diet.targetCalories?.toString() || '');
        setNotes(diet.notes || '');

        if (diet.meals && diet.meals.length > 0) {
          const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const mealTypeOrder = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post-Dinner'];
          const sorted = [...diet.meals].sort((a: any, b: any) => {
            const dayDiff = dayOrder.indexOf(a.day || 'Monday') - dayOrder.indexOf(b.day || 'Monday');
            if (dayDiff !== 0) return dayDiff;
            return mealTypeOrder.indexOf(a.mealType || 'Breakfast') - mealTypeOrder.indexOf(b.mealType || 'Breakfast');
          });
          setMeals(sorted.map((meal: any) => ({
            _id: mealIdCounter.current++,
            name: meal.name || '',
            description: meal.description || '',
            mealType: meal.mealType || 'Breakfast',
            calories: meal.calories?.toString() || '',
            protein: meal.protein?.toString() || '',
            carbs: meal.carbs?.toString() || '',
            fats: meal.fats?.toString() || '',
            ingredients: meal.ingredients || '',
            instructions: meal.instructions || '',
            alternatives: meal.alternatives || '',
            day: meal.day || 'Monday',
            time: meal.time || '',
          })));
        }
      } else {
        // Reset form and auto-set dates for current week
        setTitle('');
        setDescription('');
        setClientId('');
        setWeekNumber('1');
        setTargetCalories('');
        setNotes('');
        mealIdCounter.current = 1;
        setMeals([{ _id: 0, name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', alternatives: '', day: 'Monday', time: '' }]);

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        setStartDate(weekStart.toISOString().split('T')[0]);
        setEndDate(weekEnd.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, diet]);

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

  const addMeal = () => {
    setMeals([
      ...meals,
      { _id: mealIdCounter.current++, name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', alternatives: '', day: 'Monday', time: '' }
    ]);
  };

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const moveMeal = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= meals.length) return;
    const updated = [...meals];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setMeals(updated);
  };

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopHoldMove = useCallback(() => {
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    if (holdIntervalRef.current) { clearInterval(holdIntervalRef.current); holdIntervalRef.current = null; }
  }, []);
  const startHoldMove = useCallback((index: number, direction: 'up' | 'down') => {
    stopHoldMove();
    let currentIndex = index;
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        setMeals(prev => {
          const newIdx = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          if (newIdx < 0 || newIdx >= prev.length) { stopHoldMove(); return prev; }
          const updated = [...prev];
          [updated[currentIndex], updated[newIdx]] = [updated[newIdx], updated[currentIndex]];
          currentIndex = newIdx;
          return updated;
        });
      }, 150);
    }, 300);
  }, [stopHoldMove]);
  useEffect(() => () => stopHoldMove(), [stopHoldMove]);

  const updateMeal = (index: number, field: Exclude<keyof Meal, '_id'>, value: string) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const method = diet ? 'PUT' : 'POST';
      const body: any = {
        title,
        description,
        weekNumber: parseInt(weekNumber),
        startDate,
        endDate,
        targetCalories: targetCalories ? parseInt(targetCalories) : null,
        notes,
        meals: meals.filter(meal => meal.name.trim() !== '').map(({ _id, ...rest }) => rest),
      };

      if (diet) {
        body.id = diet.id;
      } else {
        body.clientId = parseInt(clientId);
      }

      const res = await fetch('/api/diets', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Failed to ${diet ? 'update' : 'create'} diet plan`);
        setLoading(false);
        return;
      }

      // Reset form
      setTitle('');
      setDescription('');
      setClientId('');
      setWeekNumber('1');
      setTargetCalories('');
      setNotes('');
      mealIdCounter.current = 1;
      setMeals([{ _id: 0, name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', alternatives: '', day: 'Monday', time: '' }]);

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
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <UtensilsCrossed className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  {diet ? 'Edit Diet Plan' : 'Create Diet Plan'}
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
                      Diet Plan Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g., Week 1 - High Protein Diet"
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
                      disabled={!!diet || clientsLoading}
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
                    {diet && (
                      <p className="text-gray-500 text-xs mt-1">Client cannot be changed when editing</p>
                    )}
                    {!diet && clientsLoading && (
                      <p className="text-gray-400 text-xs mt-1">Loading your clients...</p>
                    )}
                    {!diet && !clientsLoading && clients.length === 0 && (
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
                    placeholder="Brief overview of the diet plan..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      Target Calories
                    </label>
                    <input
                      type="number"
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(e.target.value)}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="2000"
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

                {/* Meals */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Meals</h3>
                    <button
                      type="button"
                      onClick={addMeal}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      <Plus size={18} />
                      Add Meal
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {meals.map((meal, index) => (
                      <div
                        key={meal._id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 font-semibold">Meal {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {meals.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => moveMeal(index, 'up')}
                                  onMouseDown={() => startHoldMove(index, 'up')}
                                  onMouseUp={stopHoldMove}
                                  onMouseLeave={stopHoldMove}
                                  onTouchStart={() => startHoldMove(index, 'up')}
                                  onTouchEnd={stopHoldMove}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                                  title="Hold to move up"
                                >
                                  <ChevronUp size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveMeal(index, 'down')}
                                  onMouseDown={() => startHoldMove(index, 'down')}
                                  onMouseUp={stopHoldMove}
                                  onMouseLeave={stopHoldMove}
                                  onTouchStart={() => startHoldMove(index, 'down')}
                                  onTouchEnd={stopHoldMove}
                                  disabled={index === meals.length - 1}
                                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                                  title="Hold to move down"
                                >
                                  <ChevronDown size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeMeal(index)}
                                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={meal.name}
                            onChange={(e) => updateMeal(index, 'name', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Meal name *"
                            required
                          />

                          <select
                            value={meal.mealType}
                            onChange={(e) => updateMeal(index, 'mealType', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                          >
                            {mealTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>

                          <select
                            value={meal.day}
                            onChange={(e) => updateMeal(index, 'day', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                          >
                            {days.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>

                          <input
                            type="time"
                            value={meal.time}
                            onChange={(e) => updateMeal(index, 'time', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                          />

                          <input
                            type="number"
                            value={meal.calories}
                            onChange={(e) => updateMeal(index, 'calories', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Calories"
                          />

                          <input
                            type="number"
                            step="0.1"
                            value={meal.protein}
                            onChange={(e) => updateMeal(index, 'protein', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Protein (g)"
                          />

                          <input
                            type="number"
                            step="0.1"
                            value={meal.carbs}
                            onChange={(e) => updateMeal(index, 'carbs', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Carbs (g)"
                          />

                          <input
                            type="number"
                            step="0.1"
                            value={meal.fats}
                            onChange={(e) => updateMeal(index, 'fats', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Fats (g)"
                          />

                          <textarea
                            value={meal.ingredients}
                            onChange={(e) => updateMeal(index, 'ingredients', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            rows={2}
                            placeholder="Ingredients list..."
                          />

                          <textarea
                            value={meal.instructions}
                            onChange={(e) => updateMeal(index, 'instructions', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            rows={2}
                            placeholder="Preparation instructions..."
                          />

                          <textarea
                            value={meal.alternatives}
                            onChange={(e) => updateMeal(index, 'alternatives', e.target.value)}
                            className="bg-brand-navy/50 border border-yellow-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500 md:col-span-2"
                            rows={2}
                            placeholder="Alternative food choices (e.g., swap chicken for paneer, rice for quinoa...)"
                          />

                          <textarea
                            value={meal.description}
                            onChange={(e) => updateMeal(index, 'description', e.target.value)}
                            className="bg-brand-navy/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue md:col-span-2"
                            rows={2}
                            placeholder="Additional notes..."
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                  >
                    {loading ? (diet ? 'Updating...' : 'Creating...') : (diet ? 'Update Diet Plan' : 'Create Diet Plan')}
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
