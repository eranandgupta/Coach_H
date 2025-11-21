'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Activity, Utensils, Target, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface AssessmentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: any;
  clientName: string;
}

export default function AssessmentResultsModal({
  isOpen,
  onClose,
  assessment,
  clientName,
}: AssessmentResultsModalProps) {
  if (!assessment) return null;

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const BooleanBadge = ({ value }: { value: boolean }) => (
    value ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
        <CheckCircle className="w-3 h-3" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
        <XCircle className="w-3 h-3" />
        No
      </span>
    )
  );

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-medium">{value || 'N/A'}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-gradient-to-br from-brand-navy-light to-black border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-brand-navy/90 backdrop-blur-md border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Pre-Assessment Results</h2>
                  <p className="text-gray-400">{clientName}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Submitted: {formatDate(assessment.createdAt)}
                  </p>
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
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-brand-blue" />
                    <h3 className="text-xl font-bold text-white">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Date of Birth" value={formatDate(assessment.dateOfBirth)} />
                    <InfoRow label="Height" value={assessment.height ? `${assessment.height} cm` : 'N/A'} />
                    <InfoRow label="Weight" value={assessment.weight ? `${assessment.weight} kg` : 'N/A'} />
                    <InfoRow label="Fat Percentage" value={assessment.fatPercentage ? `${assessment.fatPercentage}%` : 'N/A'} />
                    <InfoRow label="Emergency Contact" value={assessment.emergencyContact} />
                  </div>
                  {assessment.address && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-gray-400 text-sm">Address: </span>
                      <span className="text-white">{assessment.address}</span>
                    </div>
                  )}
                </div>

                {/* PAR-Q Health Screening */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Health Screening (PAR-Q)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Heart Condition</span>
                      <BooleanBadge value={assessment.heartCondition} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Chest Pain (Activity)</span>
                      <BooleanBadge value={assessment.chestPainActivity} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Chest Pain (Rest)</span>
                      <BooleanBadge value={assessment.chestPainRest} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Dizziness/Balance Issues</span>
                      <BooleanBadge value={assessment.dizzinessBalance} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Bone/Joint Problems</span>
                      <BooleanBadge value={assessment.boneJointProblem} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Pregnant</span>
                      <BooleanBadge value={assessment.pregnant} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Recent Surgery</span>
                      <BooleanBadge value={assessment.recentSurgery} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Taking Medication</span>
                      <BooleanBadge value={assessment.takingMedication} />
                    </div>
                  </div>
                  {assessment.takingMedication && assessment.medicationDetails && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <p className="text-orange-400 text-sm font-medium mb-1">Medication Details:</p>
                      <p className="text-gray-300 text-sm">{assessment.medicationDetails}</p>
                    </div>
                  )}
                </div>

                {/* Lifestyle */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Lifestyle</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400 text-sm">Smoking</span>
                        <BooleanBadge value={assessment.smoking} />
                      </div>
                      {assessment.smoking && assessment.smokingAmount && (
                        <p className="text-gray-400 text-xs pl-4">Amount: {assessment.smokingAmount}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400 text-sm">Alcohol</span>
                        <BooleanBadge value={assessment.alcohol} />
                      </div>
                      {assessment.alcohol && assessment.alcoholGlassesPerWeek && (
                        <p className="text-gray-400 text-xs pl-4">Glasses/week: {assessment.alcoholGlassesPerWeek}</p>
                      )}
                    </div>
                    <InfoRow label="Sleep Hours" value={assessment.sleepHours ? `${assessment.sleepHours} hours` : 'N/A'} />
                    <InfoRow label="Job Type" value={assessment.jobType ? assessment.jobType.replace('-', ' ').toUpperCase() : 'N/A'} />
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Job Requires Travel</span>
                      <BooleanBadge value={assessment.jobRequiresTravel} />
                    </div>
                    <InfoRow label="Stress Level" value={assessment.stressLevel ? `${assessment.stressLevel}/10` : 'N/A'} />
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Overweight as Child</span>
                      <BooleanBadge value={assessment.overweightAsChild} />
                    </div>
                  </div>
                  {assessment.familyOverweight && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-gray-400 text-sm">Family Overweight: </span>
                      <span className="text-white">
                        {(() => {
                          try {
                            const family = JSON.parse(assessment.familyOverweight);
                            return family.length > 0 ? family.join(', ') : 'None';
                          } catch {
                            return assessment.familyOverweight;
                          }
                        })()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fitness History */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Fitness History</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Best Shape Period: </span>
                      <span className="text-white">{assessment.bestShapePeriod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-navy/50 rounded-lg">
                      <span className="text-gray-300 text-sm">Exercising Consistently (3 months)</span>
                      <BooleanBadge value={assessment.exercisingConsistently} />
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Current Fitness Level: </span>
                      <span className="text-white font-medium">
                        {assessment.currentFitnessLevel ? `${assessment.currentFitnessLevel}/10` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nutrition */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Nutrition</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <InfoRow label="Meals Per Day" value={assessment.mealsPerDay || 'N/A'} />
                    <InfoRow label="Eat Outside Per Week" value={assessment.eatOutsidePerWeek || 'N/A'} />
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Skip Meals</span>
                      <BooleanBadge value={assessment.skipMeals} />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Eat Breakfast</span>
                      <BooleanBadge value={assessment.eatBreakfast} />
                    </div>
                    <InfoRow label="Eat Late Night" value={assessment.eatLateNight?.toUpperCase() || 'N/A'} />
                    <InfoRow label="Meal Location" value={assessment.mealLocation ? assessment.mealLocation.replace('-', ' ').toUpperCase() : 'N/A'} />
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Energy Drops</span>
                      <BooleanBadge value={assessment.energyDrops} />
                    </div>
                    {assessment.energyDrops && assessment.energyDropTime && (
                      <div className="text-xs text-gray-400 pl-4">Time: {assessment.energyDropTime}</div>
                    )}
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Taking Supplements</span>
                      <BooleanBadge value={assessment.takingSupplements} />
                    </div>
                    <InfoRow label="Eat Past Fullness" value={assessment.eatPastFullness?.toUpperCase() || 'N/A'} />
                    <InfoRow label="High Sugar Foods" value={assessment.highSugarFoods?.toUpperCase() || 'N/A'} />
                  </div>
                  {assessment.takingSupplements && assessment.supplementsList && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-gray-400 text-sm mb-1">Supplements:</p>
                      <p className="text-white text-sm">{assessment.supplementsList}</p>
                    </div>
                  )}
                  {assessment.eatingReasons && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-gray-400 text-sm mb-1">Eating Reasons:</p>
                      <p className="text-white text-sm">
                        {(() => {
                          try {
                            const reasons = JSON.parse(assessment.eatingReasons);
                            return reasons.length > 0 ? reasons.join(', ') : 'N/A';
                          } catch {
                            return assessment.eatingReasons;
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Goals */}
                <div className="bg-brand-navy/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-brand-gold" />
                    <h3 className="text-xl font-bold text-white">Fitness Goals</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assessment.goalLoseFat && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-300">Lose Body Fat</span>
                      </div>
                    )}
                    {assessment.goalRehabilitate && (
                      <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-300">Rehabilitate Injury</span>
                      </div>
                    )}
                    {assessment.goalSportsTraining && (
                      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300">Sports Training</span>
                      </div>
                    )}
                    {assessment.goalMuscleGain && (
                      <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300">Muscle Hypertrophy</span>
                      </div>
                    )}
                  </div>
                  {assessment.goalOther && (
                    <div className="mt-3 p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg">
                      <p className="text-brand-gold text-sm font-medium mb-1">Other Goals:</p>
                      <p className="text-gray-300 text-sm">{assessment.goalOther}</p>
                    </div>
                  )}
                  {!assessment.goalLoseFat && !assessment.goalRehabilitate && !assessment.goalSportsTraining && !assessment.goalMuscleGain && (
                    <p className="text-gray-500 text-sm">No specific goals selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 bg-brand-navy/90 backdrop-blur-md border-t border-white/10 p-4">
              <button
                onClick={onClose}
                className="w-full bg-brand-blue text-white font-medium py-3 rounded-lg hover:bg-brand-blue-dark transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
