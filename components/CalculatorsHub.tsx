'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Calculator, ChevronLeft } from 'lucide-react';
import type { ToolSlug } from '@/lib/fitnessTools';

// Every calculator in one place: the food calorie counter plus the /tools calculators.
// Used by the client, coach and trainer dashboards. The maths only loads when this opens.
const FitnessToolWidget = dynamic(() => import('@/components/FitnessToolWidget'), { ssr: false });
const CalorieCalculator = dynamic(() => import('@/components/CalorieCalculator'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />,
});

export type CalcSlug = ToolSlug | 'calories';

export const CALCULATORS: { slug: CalcSlug; label: string; hint: string }[] = [
  { slug: 'calories', label: 'Calorie Counter', hint: 'Search 1,300+ Indian foods, pick a serving, see calories & macros.' },
  { slug: 'tdee-calculator', label: 'TDEE', hint: 'Maintenance calories for an activity level.' },
  { slug: 'bmr-calculator', label: 'BMR', hint: 'Calories burned at complete rest.' },
  { slug: 'calorie-deficit-calculator', label: 'Calorie Deficit', hint: 'Daily calories to lose weight at a safe pace.' },
  { slug: 'protein-calculator', label: 'Protein', hint: 'Daily protein target by weight and goal.' },
  { slug: 'macro-calculator', label: 'Macros', hint: 'Protein, carbs and fat targets for a goal.' },
  { slug: 'bmi-calculator', label: 'BMI', hint: 'BMI against Indian and WHO cut-offs.' },
  { slug: 'ideal-weight-calculator', label: 'Ideal Weight', hint: 'Healthy weight range for a height.' },
  { slug: 'body-fat-calculator', label: 'Body Fat', hint: 'Estimate body-fat % with a tape measure.' },
];

interface CalculatorsHubProps {
  slug: CalcSlug;
  onSlugChange: (slug: CalcSlug) => void;
  onBack: () => void;
  /** Shown under the calculator; e.g. a reminder that the coach sets the real targets. */
  footnote?: string;
}

export default function CalculatorsHub({ slug, onSlugChange, onBack, footnote }: CalculatorsHubProps) {
  return (
    <div className={`${slug === 'calories' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto`}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to dashboard
      </button>
      <div className="flex items-center gap-3 mb-1">
        <span className="w-10 h-10 rounded-xl bg-brand-blue/10 ring-1 ring-brand-blue/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-brand-blue" />
        </span>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Calculators</h1>
          <p className="text-xs md:text-sm text-gray-500">{CALCULATORS.find((t) => t.slug === slug)?.hint}</p>
        </div>
      </div>
      <div role="tablist" aria-label="Calculator" className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CALCULATORS.map((t) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={slug === t.slug}
            onClick={() => onSlugChange(t.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              slug === t.slug ? 'bg-brand-blue text-white border-brand-blue' : 'border-white/10 text-gray-300 hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {slug === 'calories' ? <CalorieCalculator /> : <FitnessToolWidget key={slug} slug={slug} />}
      </div>
      {footnote && <p className="mt-4 text-xs text-gray-500">{footnote}</p>}
    </div>
  );
}

/**
 * Full-screen Calculators panel with its own header button, for the coach and trainer dashboards
 * (single-page layouts with no view switching). Closes with the back button or Escape.
 */
export function CalculatorsButton() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState<CalcSlug>('calories');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="hdr-btn" aria-label="Calculators" title="Calculators (food calories, TDEE, BMR, protein, macros, BMI)">
        <Calculator />
      </button>
      {/* Portalled: the header's backdrop blur would otherwise trap a fixed panel inside it. */}
      {open && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Calculators" className="fixed inset-0 z-[60] overflow-y-auto bg-brand-navy px-3 md:px-4 pt-6 md:pt-10 pb-16">
          <CalculatorsHub slug={slug} onSlugChange={setSlug} onBack={() => setOpen(false)} />
        </div>,
        document.body
      )}
    </>
  );
}
