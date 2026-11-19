// Options for the newer pre-assessment questions, shared by the form and the coach's results view.

export type CurrentDietMeal = 'breakfast' | 'brunch' | 'lunch' | 'snack' | 'dinner';

export const CURRENT_DIET_MEALS: { key: CurrentDietMeal; label: string; placeholder: string }[] = [
  { key: 'breakfast', label: 'Breakfast', placeholder: 'e.g., 2 parathas with curd, tea with sugar' },
  { key: 'brunch', label: 'Brunch / mid-morning', placeholder: 'e.g., fruit, biscuits, nothing' },
  { key: 'lunch', label: 'Lunch', placeholder: 'e.g., 3 rotis, dal, sabzi, rice' },
  { key: 'snack', label: 'Evening snack', placeholder: 'e.g., tea with namkeen, samosa' },
  { key: 'dinner', label: 'Dinner', placeholder: 'e.g., 2 rotis, paneer sabzi, salad' },
];

export const WATER_OPTIONS = [
  { value: 'under-1', label: 'Less than 1 L' },
  { value: '1-2', label: '1–2 L' },
  { value: '2-3', label: '2–3 L' },
  { value: '3-4', label: '3–4 L' },
  { value: 'over-4', label: 'More than 4 L' },
];

export const STEPS_OPTIONS = [
  { value: 'under-3000', label: 'Under 3,000' },
  { value: '3000-5000', label: '3,000–5,000' },
  { value: '5000-8000', label: '5,000–8,000' },
  { value: '8000-10000', label: '8,000–10,000' },
  { value: 'over-10000', label: '10,000+' },
  { value: 'unknown', label: "Don't know" },
];

/** Label for a stored option value; falls back to the raw value. */
export function optionLabel(options: { value: string; label: string }[], value?: string | null): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? value;
}
