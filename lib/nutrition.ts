/**
 * Pure calorie/macro math for the calorie calculator. No React, no side effects —
 * so it can be reused server-side (the static "common foods" table) and client-side
 * (the interactive meal builder), and unit-tested directly.
 */
import type { FoodItem, FoodMacros } from './foods';

const round = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Macros for an arbitrary weight of a food (linear scale from its per-100g values). */
export function caloriesFor(food: FoodItem, grams: number): FoodMacros {
  const factor = grams / 100;
  return {
    kcal: round(food.per100g.kcal * factor),
    protein: round1(food.per100g.protein * factor),
    carbs: round1(food.per100g.carbs * factor),
    fat: round1(food.per100g.fat * factor),
  };
}

/** Gram-weight for `qty` of a named serving. Falls back to 100 g if label not found. */
export function gramsFor(food: FoodItem, servingLabel: string, qty: number): number {
  const serving = food.servings.find((s) => s.label === servingLabel);
  const perServing = serving ? serving.grams : 100;
  return perServing * (qty > 0 ? qty : 0);
}

/** Convenience: macros for `qty × serving` of a food. */
export function caloriesForServing(food: FoodItem, servingLabel: string, qty: number): FoodMacros {
  return caloriesFor(food, gramsFor(food, servingLabel, qty));
}

/** Sum a list of macro objects into a single total. */
export function sumMacros(items: FoodMacros[]): FoodMacros {
  return items.reduce<FoodMacros>(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: round1(acc.protein + m.protein),
      carbs: round1(acc.carbs + m.carbs),
      fat: round1(acc.fat + m.fat),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
