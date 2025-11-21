'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, UtensilsCrossed } from 'lucide-react';

interface CreateDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  diet?: any; // If provided, we're editing; otherwise, creating
}

interface Meal {
  name: string;
  description: string;
  mealType: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  ingredients: string;
  instructions: string;
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
  const [meals, setMeals] = useState<Meal[]>([
    { name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', day: 'Monday', time: '' }
  ]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post-Dinner'];

  useEffect(() => {
    if (isOpen) {
      fetchClients();

      if (diet) {
        // Populate form with existing diet data
        setTitle(diet.title || '');
        setDescription(diet.description || '');
        setClientId(diet.clientId?.toString() || '');
        setWeekNumber(diet.weekNumber?.toString() || '1');
        setStartDate(diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '');
        setEndDate(diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '');
        setTargetCalories(diet.targetCalories?.toString() || '');
        setNotes(diet.notes || '');

        if (diet.meals && diet.meals.length > 0) {
          setMeals(diet.meals.map((meal: any) => ({
            name: meal.name || '',
            description: meal.description || '',
            mealType: meal.mealType || 'Breakfast',
            calories: meal.calories?.toString() || '',
            protein: meal.protein?.toString() || '',
            carbs: meal.carbs?.toString() || '',
            fats: meal.fats?.toString() || '',
            ingredients: meal.ingredients || '',
            instructions: meal.instructions || '',
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
        setMeals([{ name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', day: 'Monday', time: '' }]);

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
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const addMeal = () => {
    setMeals([
      ...meals,
      { name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', day: 'Monday', time: '' }
    ]);
  };

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const updateMeal = (index: number, field: keyof Meal, value: string) => {
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
        meals: meals.filter(meal => meal.name.trim() !== ''),
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
      setMeals([{ name: '', description: '', mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', ingredients: '', instructions: '', day: 'Monday', time: '' }]);

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
                      disabled={!!diet}
                    >
                      <option value="">Choose a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name || client.email}
                        </option>
                      ))}
                    </select>
                    {diet && (
                      <p className="text-gray-500 text-xs mt-1">Client cannot be changed when editing</p>
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
                      Week Number *
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
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-green-400 font-semibold">Meal {index + 1}</span>
                          {meals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMeal(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
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
