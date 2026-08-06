/**
 * Pure calorie/macro/micro math for the calorie calculator. No React, no side effects —
 * so it can be reused server-side (the static "common foods" table) and client-side
 * (the interactive meal builder), and unit-tested directly.
 */
import type { FoodItem, FoodNutrients } from './foods';

const round = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Nutrients for an arbitrary weight of a food (linear scale from its per-100g values). */
export function caloriesFor(food: FoodItem, grams: number): FoodNutrients {
  const factor = grams / 100;
  const p = food.per100g;
  return {
    kcal: round(p.kcal * factor),
    protein: round1(p.protein * factor),
    carbs: round1(p.carbs * factor),
    fat: round1(p.fat * factor),
    fiber: round1(p.fiber * factor),
    sugar: round1(p.sugar * factor),
    sodium: round(p.sodium * factor),
    calcium: round(p.calcium * factor),
    iron: round1(p.iron * factor),
    potassium: round(p.potassium * factor),
    vitaminC: round1(p.vitaminC * factor),
  };
}

/** Gram-weight for `qty` of a named serving. Falls back to 100 g if label not found. */
export function gramsFor(food: FoodItem, servingLabel: string, qty: number): number {
  const serving = food.servings.find((s) => s.label === servingLabel);
  const perServing = serving ? serving.grams : 100;
  return perServing * (qty > 0 ? qty : 0);
}

/** Convenience: nutrients for `qty × serving` of a food. */
export function caloriesForServing(food: FoodItem, servingLabel: string, qty: number): FoodNutrients {
  return caloriesFor(food, gramsFor(food, servingLabel, qty));
}

/** Sum a list of nutrient objects into a single total. */
export function sumMacros(items: FoodNutrients[]): FoodNutrients {
  return items.reduce<FoodNutrients>(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: round1(acc.protein + m.protein),
      carbs: round1(acc.carbs + m.carbs),
      fat: round1(acc.fat + m.fat),
      fiber: round1(acc.fiber + m.fiber),
      sugar: round1(acc.sugar + m.sugar),
      sodium: acc.sodium + m.sodium,
      calcium: acc.calcium + m.calcium,
      iron: round1(acc.iron + m.iron),
      potassium: acc.potassium + m.potassium,
      vitaminC: round1(acc.vitaminC + m.vitaminC),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, calcium: 0, iron: 0, potassium: 0, vitaminC: 0 }
  );
}
