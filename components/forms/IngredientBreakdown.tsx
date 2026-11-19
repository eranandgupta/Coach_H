'use client';

import { RefreshCw } from 'lucide-react';
import { ingredientTotals } from '@/lib/ingredientMacros';

/**
 * Under a meal's ingredients box: which food each item was matched to, its weight and calories,
 * and which items couldn't be counted, so the coach can check the auto-filled macros.
 */
export default function IngredientBreakdown({ text, onRecalculate }: { text: string; onRecalculate: () => void }) {
  if (!text.trim()) return null;
  const t = ingredientTotals(text);
  const missed = t.lines.filter((l) => l.issue);

  return (
    <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs">
      <ul className="space-y-1">
        {t.lines.map((l, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-gray-400" title={l.text}>
              {l.food ? (
                <>
                  <span className="text-gray-200">{l.food.name}</span>
                  {l.grams ? <span className="text-gray-500"> · {l.grams} g</span> : null}
                </>
              ) : (
                <span className="text-gray-300">{l.text}</span>
              )}
            </span>
            {l.issue ? (
              <span className="flex-shrink-0 text-amber-400">
                {l.issue === 'no-food' ? 'Food not found' : 'Add an amount, e.g. 100 g'}
              </span>
            ) : (
              <span className="flex-shrink-0 tabular-nums text-gray-400">
                {l.kcal} kcal · P {l.protein} · C {l.carbs} · F {l.fat}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
        <span className="font-semibold text-gray-200 tabular-nums">
          Total {t.kcal} kcal · P {t.protein} g · C {t.carbs} g · F {t.fat} g
        </span>
        <button
          type="button"
          onClick={onRecalculate}
          disabled={t.counted === 0}
          className="inline-flex items-center gap-1 text-brand-blue hover:text-white disabled:opacity-40 transition-colors"
          title="Fill calories and macros from these ingredients"
        >
          <RefreshCw className="w-3 h-3" aria-hidden /> Fill from ingredients
        </button>
      </div>
      {missed.length > 0 && (
        <p className="mt-1 text-gray-500">
          {missed.length === 1 ? 'One item isn’t' : `${missed.length} items aren’t`} counted in the total. Adjust the macros by hand if needed.
        </p>
      )}
    </div>
  );
}
