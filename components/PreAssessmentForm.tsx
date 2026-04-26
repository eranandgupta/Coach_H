'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Heart,
  Activity,
  Utensils,
  Target,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssessmentData {
  dateOfBirth?: string;
  height?: string | number;
  weight?: string | number;
  fatPercentage?: string | number;
  address?: string;
  emergencyContact?: string;
  heartCondition?: boolean;
  chestPainActivity?: boolean;
  chestPainRest?: boolean;
  dizzinessBalance?: boolean;
  boneJointProblem?: boolean;
  pregnant?: boolean;
  recentSurgery?: boolean;
  takingMedication?: boolean;
  medicationDetails?: string;
  smoking?: boolean;
  smokingAmount?: string;
  alcohol?: boolean;
  alcoholGlassesPerWeek?: string | number;
  sleepHours?: string | number;
  jobType?: string;
  jobDescription?: string;
  jobRequiresTravel?: boolean;
  stressLevel?: string | number;
  familyOverweight?: string | string[];
  overweightAsChild?: boolean;
  overweightAges?: string;
  bestShapePeriod?: string;
  exercisingConsistently?: boolean;
  currentFitnessLevel?: string | number;
  mealsPerDay?: string | number;
  skipMeals?: boolean;
  eatBreakfast?: boolean;
  eatLateNight?: string;
  energyDrops?: boolean;
  energyDropTime?: string;
  takingSupplements?: boolean;
  supplementsList?: string;
  mealLocation?: string;
  eatOutsidePerWeek?: string | number;
  eatingReasons?: string | string[];
  eatPastFullness?: string;
  highSugarFoods?: string;
  dietPreference?: string;
  nonVegRestrictedDays?: string;
  goalLoseFat?: boolean;
  goalRehabilitate?: boolean;
  goalSportsTraining?: boolean;
  goalMuscleGain?: boolean;
  goalOther?: string;
  specialConditions?: string;
}

interface PreAssessmentFormProps {
  userId: number;
  initialData?: AssessmentData | null;
  isEditMode?: boolean;
  planName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Step = 'personal' | 'parq' | 'lifestyle' | 'fitness' | 'nutrition' | 'goals';

export default function PreAssessmentForm({ userId, initialData, isEditMode = false, planName = '', onSuccess, onCancel }: PreAssessmentFormProps) {
  const isLiveSessionPlan = planName === 'She Strong Program' || planName === 'Active Parents Program';
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Helper to parse JSON arrays from initial data
  const parseArrayField = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper to format date for input
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: formatDateForInput(initialData?.dateOfBirth),
    height: initialData?.height?.toString() || '',
    weight: initialData?.weight?.toString() || '',
    fatPercentage: initialData?.fatPercentage?.toString() || '',
    address: initialData?.address || '',
    emergencyContact: initialData?.emergencyContact || '',

    // PAR-Q Form
    heartCondition: initialData?.heartCondition || false,
    chestPainActivity: initialData?.chestPainActivity || false,
    chestPainRest: initialData?.chestPainRest || false,
    dizzinessBalance: initialData?.dizzinessBalance || false,
    boneJointProblem: initialData?.boneJointProblem || false,
    pregnant: initialData?.pregnant || false,
    recentSurgery: initialData?.recentSurgery || false,
    takingMedication: initialData?.takingMedication || false,
    medicationDetails: initialData?.medicationDetails || '',

    // Lifestyle
    smoking: initialData?.smoking || false,
    smokingAmount: initialData?.smokingAmount || '',
    alcohol: initialData?.alcohol || false,
    alcoholGlassesPerWeek: initialData?.alcoholGlassesPerWeek?.toString() || '',
    sleepHours: initialData?.sleepHours?.toString() || '',
    jobType: initialData?.jobType || '',
    jobDescription: initialData?.jobDescription || '',
    jobRequiresTravel: initialData?.jobRequiresTravel || false,
    stressLevel: initialData?.stressLevel?.toString() || '',
    familyOverweight: parseArrayField(initialData?.familyOverweight) as string[],
    overweightAsChild: initialData?.overweightAsChild || false,
    overweightAges: initialData?.overweightAges || '',

    // Fitness History
    bestShapePeriod: initialData?.bestShapePeriod || '',
    exercisingConsistently: initialData?.exercisingConsistently || false,
    currentFitnessLevel: initialData?.currentFitnessLevel?.toString() || '',

    // Nutrition
    mealsPerDay: initialData?.mealsPerDay?.toString() || '',
    skipMeals: initialData?.skipMeals || false,
    eatBreakfast: initialData?.eatBreakfast ?? true,
    eatLateNight: initialData?.eatLateNight || '',
    energyDrops: initialData?.energyDrops || false,
    energyDropTime: initialData?.energyDropTime || '',
    takingSupplements: initialData?.takingSupplements || false,
    supplementsList: initialData?.supplementsList || '',
    mealLocation: initialData?.mealLocation || '',
    eatOutsidePerWeek: initialData?.eatOutsidePerWeek?.toString() || '',
    eatingReasons: parseArrayField(initialData?.eatingReasons) as string[],
    eatPastFullness: initialData?.eatPastFullness || '',
    highSugarFoods: initialData?.highSugarFoods || '',
    dietPreference: initialData?.dietPreference || '',
    nonVegRestrictedDays: initialData?.nonVegRestrictedDays || '',

    // Goals
    goalLoseFat: initialData?.goalLoseFat || false,
    goalRehabilitate: initialData?.goalRehabilitate || false,
    goalSportsTraining: initialData?.goalSportsTraining || false,
    goalMuscleGain: initialData?.goalMuscleGain || false,
    goalOther: initialData?.goalOther || '',
    specialConditions: initialData?.specialConditions || '',
  });

  const allSteps: { id: Step; title: string; icon: any }[] = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'parq', title: 'Health Check', icon: Heart },
    { id: 'lifestyle', title: 'Lifestyle', icon: Activity },
    { id: 'fitness', title: 'Fitness History', icon: Activity },
    { id: 'nutrition', title: 'Nutrition', icon: Utensils },
    { id: 'goals', title: 'Your Goals', icon: Target },
  ];
  const steps = isLiveSessionPlan ? allSteps.filter(s => s.id !== 'goals') : allSteps;

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          familyOverweight: JSON.stringify(formData.familyOverweight),
          eatingReasons: JSON.stringify(formData.eatingReasons),
          alcoholGlassesPerWeek: formData.alcoholGlassesPerWeek ? parseInt(formData.alcoholGlassesPerWeek) : null,
          sleepHours: formData.sleepHours ? parseInt(formData.sleepHours) : null,
          stressLevel: formData.stressLevel ? parseInt(formData.stressLevel) : null,
          currentFitnessLevel: formData.currentFitnessLevel ? parseInt(formData.currentFitnessLevel) : null,
          mealsPerDay: formData.mealsPerDay ? parseInt(formData.mealsPerDay) : null,
          eatOutsidePerWeek: formData.eatOutsidePerWeek ? parseInt(formData.eatOutsidePerWeek) : null,
        }),
      });

      if (response.ok) {
        if (isEditMode && onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        alert('Failed to submit assessment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (field: 'familyOverweight' | 'eatingReasons', value: string) => {
    setFormData((prev) => {
      // If selecting "None", clear other selections
      if (value === 'None') {
        return { ...prev, [field]: prev[field].includes('None') ? [] : ['None'] };
      }
      // If selecting other option, remove "None" if present
      const newArray = prev[field].filter((v) => v !== 'None');
      if (newArray.includes(value)) {
        return { ...prev, [field]: newArray.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...newArray, value] };
    });
  };

  // Validation functions for each step
  const validatePersonalStep = (): string[] => {
    const stepErrors: string[] = [];
    if (!formData.dateOfBirth) stepErrors.push('Date of Birth is required');
    if (!formData.height) stepErrors.push('Height is required');
    if (!formData.weight) stepErrors.push('Weight is required');
    if (!formData.address) stepErrors.push('Address is required');
    if (!formData.emergencyContact) stepErrors.push('Emergency Contact is required');
    return stepErrors;
  };

  const validateParqStep = (): string[] => {
    const stepErrors: string[] = [];
    if (formData.takingMedication && !formData.medicationDetails) {
      stepErrors.push('Please describe your medications');
    }
    return stepErrors;
  };

  const validateLifestyleStep = (): string[] => {
    const stepErrors: string[] = [];
    if (formData.smoking && !formData.smokingAmount) stepErrors.push('Please specify how many cigarettes per day');
    if (formData.alcohol && !formData.alcoholGlassesPerWeek) stepErrors.push('Please specify alcohol glasses per week');
    if (!formData.sleepHours) stepErrors.push('Sleep hours is required');
    if (!isLiveSessionPlan && !formData.jobType) stepErrors.push('Job type is required');
    if (!formData.stressLevel) stepErrors.push('Stress level is required');
    if (formData.familyOverweight.length === 0) stepErrors.push('Please select family members who are overweight or select "None"');
    if (formData.overweightAsChild && !formData.overweightAges) stepErrors.push('Please specify at what age(s) you were overweight');
    return stepErrors;
  };

  const validateFitnessStep = (): string[] => {
    const stepErrors: string[] = [];
    if (!formData.bestShapePeriod) stepErrors.push('Please describe when you were in best shape');
    if (!formData.currentFitnessLevel) stepErrors.push('Current fitness level is required');
    return stepErrors;
  };

  const validateNutritionStep = (): string[] => {
    const stepErrors: string[] = [];
    if (!formData.mealsPerDay) stepErrors.push('Meals per day is required');
    if (!formData.eatLateNight) stepErrors.push('Please select late night eating frequency');
    if (formData.energyDrops && !formData.energyDropTime) stepErrors.push('Please specify when you feel energy drops');
    if (formData.takingSupplements && !formData.supplementsList) stepErrors.push('Please list your supplements');
    if (!isLiveSessionPlan && !formData.mealLocation) stepErrors.push('Please select where you usually eat meals');
    if (!isLiveSessionPlan && !formData.eatOutsidePerWeek && formData.eatOutsidePerWeek !== '0') stepErrors.push('Please specify how often you eat outside');
    if (formData.eatingReasons.length === 0) stepErrors.push('Please select eating reasons or select "Hunger Only"');
    if (!formData.eatPastFullness) stepErrors.push('Please select how often you eat past fullness');
    if (!formData.highSugarFoods) stepErrors.push('Please select sugar consumption frequency');
    if (!formData.dietPreference) stepErrors.push('Please select your diet preference');
    if (formData.dietPreference === 'non-veg-restricted' && !formData.nonVegRestrictedDays) stepErrors.push('Please specify which days you cannot eat non-veg');
    return stepErrors;
  };

  const validateGoalsStep = (): string[] => {
    const stepErrors: string[] = [];
    const hasGoal = formData.goalLoseFat || formData.goalRehabilitate || formData.goalSportsTraining || formData.goalMuscleGain || formData.goalOther;
    if (!hasGoal) stepErrors.push('Please select at least one fitness goal');
    return stepErrors;
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: string[] = [];
    switch (currentStep) {
      case 'personal': stepErrors = validatePersonalStep(); break;
      case 'parq': stepErrors = validateParqStep(); break;
      case 'lifestyle': stepErrors = validateLifestyleStep(); break;
      case 'fitness': stepErrors = validateFitnessStep(); break;
      case 'nutrition': stepErrors = validateNutritionStep(); break;
      case 'goals': stepErrors = validateGoalsStep(); break;
    }
    setErrors(stepErrors);
    return stepErrors.length === 0;
  };

  const handleNextWithValidation = () => {
    if (validateCurrentStep()) {
      setErrors([]);
      handleNext();
    }
  };

  const handleSubmitWithValidation = async () => {
    if (validateCurrentStep()) {
      setErrors([]);
      await handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isEditMode ? 'Edit Assessment' : 'Pre-Assessment Form'}
          </h1>
          <p className="text-gray-400">
            {isEditMode
              ? 'Update your information to keep your fitness plan accurate'
              : 'Help us understand you better to create a personalized fitness plan'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max px-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? 'bg-brand-blue border-brand-blue text-white'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-brand-navy-light border-gray-600 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle size={24} /> : <Icon size={20} />}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive ? 'text-brand-blue' : isCompleted ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-brand-navy-light border border-white/10 rounded-2xl p-6 md:p-8 mb-6"
        >
          {/* Personal Information */}
          {currentStep === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Date of Birth <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Height (cm) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="170"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Weight (kg) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Fat Percentage <span className="text-gray-500">(optional)</span></label>
                  <input
                    type="number"
                    value={formData.fatPercentage}
                    onChange={(e) => setFormData({ ...formData, fatPercentage: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Address <span className="text-red-400">*</span></label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  rows={2}
                  placeholder="Your address"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Emergency Contact <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  placeholder="Emergency contact name and number"
                  required
                />
              </div>
            </div>
          )}

          {/* PAR-Q Form */}
          {currentStep === 'parq' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-2">Health Screening (PAR-Q)</h2>
              <p className="text-gray-400 text-sm mb-6">
                Please answer the following questions honestly. This information helps us create a safe program for you.
              </p>

              <div className="space-y-4">
                {[
                  { key: 'heartCondition', label: 'Has your doctor ever said that you have a heart condition?' },
                  { key: 'chestPainActivity', label: 'Do you frequently have pains in your chest when you perform physical activity?' },
                  { key: 'chestPainRest', label: 'Have you had chest pain when you were not doing physical activity?' },
                  { key: 'dizzinessBalance', label: 'Do you lose your balance due to dizziness or do you ever lose consciousness?' },
                  { key: 'boneJointProblem', label: 'Do you have a bone, joint or any other health problem that causes you pain or limitations?' },
                  { key: 'pregnant', label: 'Are you pregnant now or have given birth within the last 6 months?' },
                  { key: 'recentSurgery', label: 'Have you had a recent surgery?' },
                  { key: 'takingMedication', label: 'Do you take any medications, either prescription or non-prescription, on a regular basis?' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-4 p-4 bg-brand-navy/50 rounded-lg border border-white/5">
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.label}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, [item.key]: true })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData[item.key as keyof typeof formData]
                            ? 'bg-red-500 text-white'
                            : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, [item.key]: false })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          !formData[item.key as keyof typeof formData]
                            ? 'bg-green-500 text-white'
                            : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {formData.takingMedication && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">What is the medication for?</label>
                  <textarea
                    value={formData.medicationDetails}
                    onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    rows={3}
                    placeholder="Please describe your medications and what they're for"
                  />
                </div>
              )}
            </div>
          )}

          {/* Lifestyle Questions */}
          {currentStep === 'lifestyle' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Lifestyle Questions</h2>

              <div className="space-y-4">
                {/* Smoking */}
                <div className="p-4 bg-brand-navy/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white">Do you smoke?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, smoking: true })}
                        className={`px-4 py-2 rounded-lg ${
                          formData.smoking ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, smoking: false, smokingAmount: '' })}
                        className={`px-4 py-2 rounded-lg ${
                          !formData.smoking ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  {formData.smoking && (
                    <input
                      type="text"
                      value={formData.smokingAmount}
                      onChange={(e) => setFormData({ ...formData, smokingAmount: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue mt-2"
                      placeholder="How many per day?"
                    />
                  )}
                </div>

                {/* Alcohol */}
                <div className="p-4 bg-brand-navy/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white">Do you drink alcohol?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, alcohol: true })}
                        className={`px-4 py-2 rounded-lg ${
                          formData.alcohol ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, alcohol: false, alcoholGlassesPerWeek: '' })}
                        className={`px-4 py-2 rounded-lg ${
                          !formData.alcohol ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  {formData.alcohol && (
                    <input
                      type="number"
                      value={formData.alcoholGlassesPerWeek}
                      onChange={(e) => setFormData({ ...formData, alcoholGlassesPerWeek: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue mt-2"
                      placeholder="How many glasses per week?"
                    />
                  )}
                </div>

                {/* Sleep Hours */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">How many hours do you regularly sleep at night? <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="7"
                    min="1"
                    max="24"
                    required
                  />
                </div>

                {/* Job Type, Job Description, Job Travel - hidden for live session plans */}
                {!isLiveSessionPlan && (
                  <>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">What type of job do you have? <span className="text-red-400">*</span></label>
                      <div className="grid grid-cols-3 gap-2">
                        {['sedentary', 'active', 'physically-demanding'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, jobType: type })}
                            className={`px-4 py-3 rounded-lg capitalize ${
                              formData.jobType === type
                                ? 'bg-brand-blue text-white'
                                : 'bg-brand-navy border border-white/10 text-gray-400'
                            }`}
                          >
                            {type.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Describe your job</label>
                      <textarea
                        value={formData.jobDescription || ''}
                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                        className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue resize-none"
                        placeholder="e.g. I work as a software engineer, sitting at a desk for 8-9 hours daily..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-brand-navy/50 rounded-lg">
                      <label className="text-white">Does your job require travel?</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, jobRequiresTravel: true })}
                          className={`px-4 py-2 rounded-lg ${
                            formData.jobRequiresTravel ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, jobRequiresTravel: false })}
                          className={`px-4 py-2 rounded-lg ${
                            !formData.jobRequiresTravel ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Stress Level */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Stress Level (1=very low, 10=very high): {formData.stressLevel || 'Not set'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressLevel || 5}
                    onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                </div>

                {/* Family Overweight */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Is anyone in your family overweight? <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {['None', 'Mother', 'Father', 'Sibling', 'Grandparent'].map((member) => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => toggleArrayValue('familyOverweight', member)}
                        className={`px-4 py-2 rounded-lg ${
                          formData.familyOverweight.includes(member)
                            ? member === 'None' ? 'bg-green-500 text-white' : 'bg-brand-blue text-white'
                            : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overweight as Child */}
                <div className="p-4 bg-brand-navy/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white">Were you overweight as a child?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, overweightAsChild: true })}
                        className={`px-4 py-2 rounded-lg ${
                          formData.overweightAsChild ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, overweightAsChild: false, overweightAges: '' })}
                        className={`px-4 py-2 rounded-lg ${
                          !formData.overweightAsChild ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  {formData.overweightAsChild && (
                    <input
                      type="text"
                      value={formData.overweightAges}
                      onChange={(e) => setFormData({ ...formData, overweightAges: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue mt-2"
                      placeholder="At what age(s)?"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fitness History */}
          {currentStep === 'fitness' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Fitness History</h2>

              <div>
                <label className="block text-gray-300 text-sm mb-2">When were you in the best shape of your life? <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.bestShapePeriod}
                  onChange={(e) => setFormData({ ...formData, bestShapePeriod: e.target.value })}
                  className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  placeholder="e.g., 2 years ago, in college, never..."
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-navy/50 rounded-lg">
                <label className="text-white">Have you been exercising consistently for the past 3 months? <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, exercisingConsistently: true })}
                    className={`px-4 py-2 rounded-lg ${
                      formData.exercisingConsistently ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, exercisingConsistently: false })}
                    className={`px-4 py-2 rounded-lg ${
                      !formData.exercisingConsistently ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Current Fitness Level (1=Worst, 10=Best): {formData.currentFitnessLevel || 'Not set'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.currentFitnessLevel || 5}
                  onChange={(e) => setFormData({ ...formData, currentFitnessLevel: e.target.value })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Worst</span>
                  <span>Best</span>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Questions */}
          {currentStep === 'nutrition' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Nutrition Questions</h2>

              <div>
                <label className="block text-gray-300 text-sm mb-2">How many times a day do you usually eat (including snacks)? <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  value={formData.mealsPerDay}
                  onChange={(e) => setFormData({ ...formData, mealsPerDay: e.target.value })}
                  className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  placeholder="3"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-brand-navy/50 rounded-lg">
                  <label className="text-white">Do you skip meals?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, skipMeals: true })}
                      className={`px-4 py-2 rounded-lg ${
                        formData.skipMeals ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, skipMeals: false })}
                      className={`px-4 py-2 rounded-lg ${
                        !formData.skipMeals ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-brand-navy/50 rounded-lg">
                  <label className="text-white">Do you eat breakfast?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eatBreakfast: true })}
                      className={`px-4 py-2 rounded-lg ${
                        formData.eatBreakfast ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eatBreakfast: false })}
                      className={`px-4 py-2 rounded-lg ${
                        !formData.eatBreakfast ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Do you eat late at night? <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['sometimes', 'often', 'never'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData({ ...formData, eatLateNight: freq })}
                      className={`px-4 py-3 rounded-lg capitalize ${
                        formData.eatLateNight === freq
                          ? 'bg-brand-blue text-white'
                          : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-brand-navy/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white">Do you feel drops in your energy levels throughout the day?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, energyDrops: true })}
                      className={`px-4 py-2 rounded-lg ${
                        formData.energyDrops ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, energyDrops: false, energyDropTime: '' })}
                      className={`px-4 py-2 rounded-lg ${
                        !formData.energyDrops ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                {formData.energyDrops && (
                  <input
                    type="text"
                    value={formData.energyDropTime}
                    onChange={(e) => setFormData({ ...formData, energyDropTime: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue mt-2"
                    placeholder="When do you feel energy drops?"
                  />
                )}
              </div>

              <div className="p-4 bg-brand-navy/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white">Are you taking any food supplements?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, takingSupplements: true })}
                      className={`px-4 py-2 rounded-lg ${
                        formData.takingSupplements ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, takingSupplements: false, supplementsList: '' })}
                      className={`px-4 py-2 rounded-lg ${
                        !formData.takingSupplements ? 'bg-brand-blue text-white' : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                {formData.takingSupplements && (
                  <textarea
                    value={formData.supplementsList}
                    onChange={(e) => setFormData({ ...formData, supplementsList: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue mt-2"
                    rows={2}
                    placeholder="Please list the supplements"
                  />
                )}
              </div>

              {!isLiveSessionPlan && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">At work or school, do you usually: <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'eat-outside', label: 'Eat Outside' },
                      { value: 'bring-food', label: 'Bring Food' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mealLocation: option.value })}
                        className={`px-4 py-3 rounded-lg ${
                          formData.mealLocation === option.value
                            ? 'bg-brand-blue text-white'
                            : 'bg-brand-navy border border-white/10 text-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLiveSessionPlan && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">How many times per week do you eat outside? <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.eatOutsidePerWeek}
                    onChange={(e) => setFormData({ ...formData, eatOutsidePerWeek: e.target.value })}
                    className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="3"
                    min="0"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">Besides hunger, what other reason(s) do you eat? <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Hunger Only', 'Boredom', 'Social', 'Stressed', 'Tired', 'Depressed', 'Happy', 'Nervous'].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => toggleArrayValue('eatingReasons', reason === 'Hunger Only' ? 'None' : reason)}
                      className={`px-4 py-2 rounded-lg ${
                        (reason === 'Hunger Only' && formData.eatingReasons.includes('None')) || (reason !== 'Hunger Only' && formData.eatingReasons.includes(reason))
                          ? reason === 'Hunger Only' ? 'bg-green-500 text-white' : 'bg-brand-blue text-white'
                          : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Do you eat past the point of fullness? <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['often', 'sometimes', 'never'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData({ ...formData, eatPastFullness: freq })}
                      className={`px-4 py-3 rounded-lg capitalize ${
                        formData.eatPastFullness === freq
                          ? 'bg-brand-blue text-white'
                          : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Do you eat foods high in sugar? <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['often', 'sometimes', 'never'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData({ ...formData, highSugarFoods: freq })}
                      className={`px-4 py-3 rounded-lg capitalize ${
                        formData.highSugarFoods === freq
                          ? 'bg-brand-blue text-white'
                          : 'bg-brand-navy border border-white/10 text-gray-400'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Preference */}
              <div className="p-4 bg-brand-navy/50 rounded-lg border border-white/10">
                <label className="block text-gray-300 text-sm mb-3">What is your diet preference? <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'pure-veg', label: 'Pure Vegetarian', icon: '🥬', desc: 'No meat, fish, or eggs' },
                    { value: 'eggetarian', label: 'Eggetarian', icon: '🥚', desc: 'Vegetarian + Eggs' },
                    { value: 'non-veg', label: 'Non-Vegetarian', icon: '🍗', desc: 'All foods including meat' },
                    { value: 'non-veg-restricted', label: 'Non-Veg (Restricted Days)', icon: '📅', desc: 'Non-veg but not on specific days' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietPreference: option.value, nonVegRestrictedDays: option.value !== 'non-veg-restricted' ? '' : formData.nonVegRestrictedDays })}
                      className={`p-4 rounded-lg text-left transition-all flex items-start gap-3 ${
                        formData.dietPreference === option.value
                          ? 'bg-brand-blue border-2 border-brand-blue'
                          : 'bg-brand-navy border-2 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <p className="text-white font-medium">{option.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{option.desc}</p>
                      </div>
                      {formData.dietPreference === option.value && (
                        <CheckCircle className="ml-auto text-white flex-shrink-0" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Restricted Days Input - Only shown when non-veg-restricted is selected */}
                {formData.dietPreference === 'non-veg-restricted' && (
                  <div className="mt-4">
                    <label className="block text-gray-300 text-sm mb-2">
                      Which days can you not eat non-veg? <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nonVegRestrictedDays}
                      onChange={(e) => setFormData({ ...formData, nonVegRestrictedDays: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g., Tuesday, Thursday, Saturday or religious days"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals */}
          {currentStep === 'goals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Fitness Goals</h2>
              <p className="text-gray-400 mb-6">Select at least one goal. <span className="text-red-400">*</span></p>

              <div className="space-y-3">
                {[
                  { key: 'goalLoseFat', label: 'Lose Body Fat', icon: '🔥' },
                  { key: 'goalRehabilitate', label: 'Rehabilitate an Injury', icon: '🏥' },
                  { key: 'goalSportsTraining', label: 'Sports Specific Training', icon: '⚽' },
                  { key: 'goalMuscleGain', label: 'Muscle Hypertrophy (Build Muscle)', icon: '💪' },
                ].map((goal) => (
                  <button
                    key={goal.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, [goal.key]: !formData[goal.key as keyof typeof formData] })}
                    className={`w-full p-4 rounded-lg text-left transition-all flex items-center gap-3 ${
                      formData[goal.key as keyof typeof formData]
                        ? 'bg-brand-blue border-2 border-brand-blue'
                        : 'bg-brand-navy/50 border-2 border-white/10'
                    }`}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-white font-medium">{goal.label}</span>
                    {formData[goal.key as keyof typeof formData] && (
                      <CheckCircle className="ml-auto text-white" size={24} />
                    )}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Other goals or notes (Optional)</label>
                <textarea
                  value={formData.goalOther}
                  onChange={(e) => setFormData({ ...formData, goalOther: e.target.value })}
                  className="w-full bg-brand-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  rows={3}
                  placeholder="Any other specific goals or information you'd like to share..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Any special condition for workout & diet that your coach must know? (Optional)</label>
                <textarea
                  value={formData.specialConditions || ''}
                  onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
                  className="w-full bg-brand-navy border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  rows={4}
                  placeholder="e.g., knee injury, back pain, food allergies, lactose intolerant, fasting days, any medical condition..."
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isEditMode && onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
              >
                <X size={20} />
                Cancel
              </button>
            )}
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStepIndex === 0
                  ? 'opacity-50 cursor-not-allowed bg-brand-navy-light text-gray-500'
                  : 'bg-brand-navy-light text-white hover:bg-brand-navy-light/80'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
          </div>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNextWithValidation}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmitWithValidation}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isEditMode ? 'Saving...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {isEditMode ? 'Save Changes' : 'Submit Assessment'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
