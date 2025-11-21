'use client';

import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface WorkoutCardProps {
  day: string;
  exercises: Exercise[];
  completed?: boolean;
}

export default function WorkoutCard({
  day,
  exercises,
  completed = false,
}: WorkoutCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-[#1A1A1A] rounded-xl p-5 border ${
        completed ? 'border-[#E50914]' : 'border-[#2A2A2A]'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Dumbbell className="text-[#E50914]" size={20} />
          <h3 className="text-white font-bold text-lg">{day}</h3>
        </div>
        {completed && (
          <span className="bg-[#E50914] text-white text-xs px-3 py-1 rounded-full">
            Completed
          </span>
        )}
      </div>

      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-[#0D0D0D] rounded-lg p-3 border border-[#2A2A2A]"
          >
            <p className="text-white font-semibold text-sm mb-1">
              {exercise.name}
            </p>
            <p className="text-[#B3B3B3] text-xs">
              {exercise.sets} × {exercise.reps}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
