'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed, Calendar, Flame } from 'lucide-react';
import { useEffect } from 'react';

interface ViewDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  diet: any;
}

export default function ViewDietModal({ isOpen, onClose, diet }: ViewDietModalProps) {
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

  if (!diet) return null;

  // Group meals by day
  const mealsByDay = diet.meals?.reduce((acc: any, meal: any) => {
    if (!acc[meal.day]) {
      acc[meal.day] = [];
    }
    acc[meal.day].push(meal);
    return acc;
  }, {}) || {};

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const orderedDays = days.filter(day => mealsByDay[day]);

  // Sort meals by meal type order
  const mealTypeOrder = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post-Dinner'];
  orderedDays.forEach(day => {
    mealsByDay[day].sort((a: any, b: any) => {
      return mealTypeOrder.indexOf(a.mealType) - mealTypeOrder.indexOf(b.mealType);
    });
  });

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
                <div className="p-3 bg-green-500/20 rounded-xl flex-shrink-0">
                  <UtensilsCrossed className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{diet.title}</h2>
                  <p className="text-gray-400 mb-3">{diet.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Week {diet.weekNumber}</span>
                    </div>
                    {diet.targetCalories && (
                      <div className="flex items-center gap-2 text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span>{diet.targetCalories} cal/day target</span>
                      </div>
                    )}
                    <div className="text-gray-400">
                      {new Date(diet.startDate).toLocaleDateString()} - {new Date(diet.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {diet.notes && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-green-400 font-semibold mb-2">Notes from Coach</h3>
                  <p className="text-gray-300 text-sm">{diet.notes}</p>
                </div>
              )}

              {/* Meals by Day */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Meal Plan ({diet.meals?.length || 0} meals)
                </h3>

                {orderedDays.length === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No meals added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderedDays.map((day) => (
                      <div key={day} className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-xl font-bold text-green-400 mb-4">{day}</h4>
                        <div className="space-y-3">
                          {mealsByDay[day].map((meal: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="text-lg font-semibold text-white">{meal.name}</h5>
                                  <p className="text-gray-400 text-sm">{meal.mealType}</p>
                                </div>
                                <div className="flex gap-2 text-sm">
                                  {meal.calories && (
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full flex items-center gap-1">
                                      <Flame className="w-3 h-3" />
                                      {meal.calories} cal
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Macros */}
                              {(meal.protein || meal.carbs || meal.fats) && (
                                <div className="flex gap-3 mb-3 text-xs">
                                  {meal.protein && (
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                                      P: {meal.protein}g
                                    </span>
                                  )}
                                  {meal.carbs && (
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                                      C: {meal.carbs}g
                                    </span>
                                  )}
                                  {meal.fats && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                                      F: {meal.fats}g
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Ingredients */}
                              {meal.ingredients && (
                                <div className="mb-3">
                                  <h6 className="text-gray-300 text-sm font-semibold mb-1">Ingredients:</h6>
                                  <p className="text-gray-400 text-sm">{meal.ingredients}</p>
                                </div>
                              )}

                              {/* Instructions */}
                              {meal.instructions && (
                                <div className="mb-2">
                                  <h6 className="text-gray-300 text-sm font-semibold mb-1">Instructions:</h6>
                                  <p className="text-gray-400 text-sm">{meal.instructions}</p>
                                </div>
                              )}

                              {/* Time */}
                              {meal.time && (
                                <div className="text-xs text-gray-500">
                                  <span className="text-gray-400">Time:</span> {meal.time}
                                </div>
                              )}
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
