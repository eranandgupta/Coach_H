/**
 * Pure calculations for the Daily Progress Diary — shared by the API (lib/progress.ts)
 * and the client UI (components/progress). No Prisma, no React: safe to import anywhere.
 */

export const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'pre_workout', label: 'Pre-workout' },
  { key: 'post_workout', label: 'Post-workout' },
  { key: 'dinner', label: 'Dinner' },
] as const;
export type MealType = (typeof MEAL_TYPES)[number]['key'];
export const MEAL_KEYS: string[] = MEAL_TYPES.map((m) => m.key);
export const mealLabel = (key: string) => MEAL_TYPES.find((m) => m.key === key)?.label ?? key;

export const CARDIO_ACTIVITIES = [
  { key: 'run', label: 'Outdoor run' },
  { key: 'treadmill', label: 'Treadmill' },
  { key: 'walk', label: 'Walk' },
  { key: 'cycle', label: 'Cycling' },
  { key: 'other', label: 'Other cardio' },
] as const;
export const CARDIO_KEYS: string[] = CARDIO_ACTIVITIES.map((a) => a.key);
export const activityLabel = (key: string) => CARDIO_ACTIVITIES.find((a) => a.key === key)?.label ?? key;

export const MEASUREMENTS = [
  { key: 'chestCm', label: 'Chest' },
  { key: 'waistCm', label: 'Waist' },
  { key: 'hipsCm', label: 'Hips' },
  { key: 'armsCm', label: 'Arms' },
  { key: 'thighsCm', label: 'Thighs' },
  { key: 'neckCm', label: 'Neck' },
] as const;
export type MeasurementKey = (typeof MEASUREMENTS)[number]['key'];

// ---------------------------------------------------------------------------
// Dates — the diary stores calendar days as UTC midnight (same as HabitEntry).
// ---------------------------------------------------------------------------
const pad = (n: number) => String(n).padStart(2, '0');
/** Local calendar day as YYYY-MM-DD. */
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const isDayKey = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
/** YYYY-MM-DD -> Date at UTC midnight (the @db.Date value). */
export const dayToDate = (key: string) => new Date(`${key}T00:00:00.000Z`);
/** A stored @db.Date value -> YYYY-MM-DD. */
export const dateToDay = (d: Date | string) => (typeof d === 'string' ? d.slice(0, 10) : d.toISOString().slice(0, 10));
export function addDays(key: string, n: number): string {
  const d = dayToDate(key);
  d.setUTCDate(d.getUTCDate() + n);
  return dateToDay(d);
}
export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((dayToDate(toKey).getTime() - dayToDate(fromKey).getTime()) / 86400000);
}
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const weekdayOf = (key: string) => WEEKDAYS[dayToDate(key).getUTCDay()];

// ---------------------------------------------------------------------------
// Strength
// ---------------------------------------------------------------------------
export interface SetLike { exercise: string; reps: number; weightKg: number }

export const exerciseKey = (name: string) => name.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 120);

/** Epley estimated one-rep max. Single reps return the weight itself. */
export function estimate1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function workoutTotals(sets: SetLike[]) {
  let reps = 0;
  let volume = 0;
  const exercises = new Set<string>();
  for (const s of sets) {
    reps += s.reps;
    volume += s.reps * s.weightKg;
    exercises.add(exerciseKey(s.exercise));
  }
  return { sets: sets.length, reps, volume: Math.round(volume * 10) / 10, exercises: exercises.size };
}

export interface ExercisePR {
  exerciseKey: string;
  exercise: string;
  maxWeight: number;        // heaviest single set
  maxWeightReps: number;    // reps done at that weight
  maxWeightDate: string;
  maxReps: number;          // most reps in one set
  maxRepsWeight: number;
  maxRepsDate: string;
  best1RM: number;          // best estimated 1RM ("best performance")
  best1RMDate: string;
  sessions: number;
}

/** Fold dated sets into per-exercise personal records. */
export function computePRs(sets: (SetLike & { date: string; logId?: number })[]): ExercisePR[] {
  const map = new Map<string, ExercisePR & { _logs: Set<string> }>();
  // Oldest first, so ties keep the date the record was first reached.
  const ordered = [...sets].sort((a, b) => a.date.localeCompare(b.date));
  for (const s of ordered) {
    const key = exerciseKey(s.exercise);
    let pr = map.get(key);
    if (!pr) {
      pr = {
        exerciseKey: key, exercise: s.exercise,
        maxWeight: 0, maxWeightReps: 0, maxWeightDate: s.date,
        maxReps: 0, maxRepsWeight: 0, maxRepsDate: s.date,
        best1RM: 0, best1RMDate: s.date, sessions: 0, _logs: new Set(),
      };
      map.set(key, pr);
    }
    pr.exercise = s.exercise.replace(/\s+/g, ' ').trim(); // latest spelling, tidied
    pr._logs.add(String(s.logId ?? s.date));
    if (s.weightKg > pr.maxWeight || (s.weightKg === pr.maxWeight && s.reps > pr.maxWeightReps)) {
      pr.maxWeight = s.weightKg; pr.maxWeightReps = s.reps; pr.maxWeightDate = s.date;
    }
    if (s.reps > pr.maxReps || (s.reps === pr.maxReps && s.weightKg > pr.maxRepsWeight)) {
      pr.maxReps = s.reps; pr.maxRepsWeight = s.weightKg; pr.maxRepsDate = s.date;
    }
    const e = estimate1RM(s.weightKg, s.reps);
    if (e > pr.best1RM) { pr.best1RM = Math.round(e * 10) / 10; pr.best1RMDate = s.date; }
  }
  return Array.from(map.values())
    .map(({ _logs, ...pr }) => ({ ...pr, sessions: _logs.size }))
    .sort((a, b) => a.exercise.localeCompare(b.exercise));
}

export interface NewPR { exercise: string; kind: 'weight' | 'reps' | '1rm'; value: number; previous: number; detail: string }

/**
 * Records a new session beat. Only exercises the client has done before count — a first
 * attempt sets the baseline, it isn't announced as a PR.
 */
export function detectNewPRs(previous: ExercisePR[], sessionSets: SetLike[]): NewPR[] {
  const prev = new Map(previous.map((p) => [p.exerciseKey, p]));
  const session = computePRs(sessionSets.map((s) => ({ ...s, date: '9999-12-31' })));
  const out: NewPR[] = [];
  for (const cur of session) {
    const p = prev.get(cur.exerciseKey);
    if (!p) continue;
    if (cur.maxWeight > p.maxWeight && cur.maxWeight > 0) {
      out.push({ exercise: cur.exercise, kind: 'weight', value: cur.maxWeight, previous: p.maxWeight, detail: `${fmtKg(cur.maxWeight)} x ${cur.maxWeightReps}` });
    }
    if (cur.maxReps > p.maxReps) {
      out.push({ exercise: cur.exercise, kind: 'reps', value: cur.maxReps, previous: p.maxReps, detail: `${cur.maxReps} reps${cur.maxRepsWeight ? ` @ ${fmtKg(cur.maxRepsWeight)}` : ''}` });
    }
    if (cur.best1RM > p.best1RM && cur.maxWeight > 0 && !(cur.maxWeight > p.maxWeight)) {
      out.push({ exercise: cur.exercise, kind: '1rm', value: cur.best1RM, previous: p.best1RM, detail: `est. 1RM ${fmtKg(cur.best1RM)}` });
    }
  }
  return out;
}

export const fmtKg = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} kg`;

// ---------------------------------------------------------------------------
// Cardio
// ---------------------------------------------------------------------------
/** km/h, or null when distance/time is missing. */
export function speedKmh(distanceKm: number | null | undefined, durationSec: number | null | undefined): number | null {
  if (!distanceKm || !durationSec || distanceKm <= 0 || durationSec <= 0) return null;
  return distanceKm / (durationSec / 3600);
}
/** Minutes per km, or null. */
export function paceMinPerKm(distanceKm: number | null | undefined, durationSec: number | null | undefined): number | null {
  if (!distanceKm || !durationSec || distanceKm <= 0 || durationSec <= 0) return null;
  return durationSec / 60 / distanceKm;
}
/** 5.25 -> "5:15 /km" */
export function fmtPace(minPerKm: number | null): string {
  if (minPerKm == null || !Number.isFinite(minPerKm)) return '—';
  let m = Math.floor(minPerKm);
  let s = Math.round((minPerKm - m) * 60);
  if (s === 60) { m += 1; s = 0; }
  return `${m}:${pad(s)} /km`;
}
/** seconds -> "45:12" or "1:05:12" */
export function fmtDuration(sec: number | null | undefined): string {
  if (!sec || sec <= 0) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
/** "45", "45:30", "1:05:30" -> seconds. Plain numbers are minutes. */
export function parseDuration(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  const parts = t.split(':').map((p) => Number(p));
  if (parts.some((p) => !Number.isFinite(p) || p < 0)) return null;
  let sec = 0;
  if (parts.length === 1) sec = parts[0] * 60;
  else if (parts.length === 2) sec = parts[0] * 60 + parts[1];
  else if (parts.length === 3) sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
  else return null;
  return sec > 0 ? Math.round(sec) : null;
}

/**
 * Estimated kcal for a cardio session. Running/walking use the ACSM metabolic equations
 * (they account for treadmill incline); cycling and "other" use standard MET values.
 */
export function estimateCardioCalories(opts: {
  activity: string; distanceKm?: number | null; durationSec?: number | null; inclinePct?: number | null; bodyWeightKg?: number | null;
}): number | null {
  const mins = opts.durationSec ? opts.durationSec / 60 : 0;
  if (mins <= 0) return null;
  const kg = opts.bodyWeightKg && opts.bodyWeightKg > 20 ? opts.bodyWeightKg : 70;
  const grade = Math.max(0, Math.min(40, opts.inclinePct ?? 0)) / 100;
  const kmh = speedKmh(opts.distanceKm, opts.durationSec);
  let vo2: number; // ml/kg/min
  if ((opts.activity === 'run' || opts.activity === 'treadmill' || opts.activity === 'walk') && kmh) {
    const mPerMin = (kmh * 1000) / 60;
    const walking = opts.activity === 'walk' || kmh < 6.5;
    vo2 = walking ? 3.5 + 0.1 * mPerMin + 1.8 * mPerMin * grade : 3.5 + 0.2 * mPerMin + 0.9 * mPerMin * grade;
  } else {
    const met = opts.activity === 'cycle' ? 7.5 : opts.activity === 'walk' ? 3.5 : opts.activity === 'run' || opts.activity === 'treadmill' ? 9 : 6;
    vo2 = met * 3.5;
  }
  return Math.round(((vo2 * kg) / 200) * mins);
}

// ---------------------------------------------------------------------------
// Diet
// ---------------------------------------------------------------------------
export interface FoodLike { calories?: number | null; protein?: number | null; carbs?: number | null; fats?: number | null }
export function foodTotals(items: FoodLike[]) {
  const t = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  for (const f of items) {
    t.calories += Number(f.calories) || 0;
    t.protein += Number(f.protein) || 0;
    t.carbs += Number(f.carbs) || 0;
    t.fats += Number(f.fats) || 0;
  }
  return { calories: Math.round(t.calories), protein: round1(t.protein), carbs: round1(t.carbs), fats: round1(t.fats) };
}

export interface Targets { calories: number | null; protein: number | null; carbs: number | null; fats: number | null; waterL: number | null; workoutsPerWeek: number | null; source: 'coach' | 'diet-plan' | 'none' }

/**
 * A day counts as "on target" when calories land within ±10% of the target and protein
 * reaches 90% of its target. Missing targets are skipped; no targets at all -> null.
 */
export function dayAdherent(totals: { calories: number; protein: number }, targets: Targets): boolean | null {
  const checks: boolean[] = [];
  if (targets.calories) checks.push(Math.abs(totals.calories - targets.calories) <= targets.calories * 0.1);
  if (targets.protein) checks.push(totals.protein >= targets.protein * 0.9);
  if (!checks.length) return null;
  return checks.every(Boolean);
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
export const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
