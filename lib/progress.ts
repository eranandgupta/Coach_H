/**
 * Server helpers for the Daily Progress Diary: who may read/write whose diary, the targets a
 * client is measured against, and the report builder behind the daily / weekly / monthly
 * reports, the dashboard snapshot and the coach's client card.
 */
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import type { AuthUser } from './middleware';
import {
  addDays, computePRs, dateToDay, dayAdherent, dayKey, dayToDate, daysBetween, foodTotals, isDayKey,
  paceMinPerKm, pct, round1, weekdayOf, workoutTotals, MEASUREMENTS, type ExercisePR, type Targets,
} from './progressCalc';

export const STAFF_ROLES = ['coach', 'admin', 'trainer'];
export const isStaff = (role: string) => STAFF_ROLES.includes(role);

/**
 * The client whose diary this request is about. Clients always get themselves; staff may
 * pass ?userId= (or body.userId) for any client — same rule as the habit tracker.
 */
export function resolveTargetUser(user: AuthUser, requested: unknown): { userId: number } | { error: string; status: number } {
  const n = requested === undefined || requested === null || requested === '' ? null : Number(requested);
  if (n === null || n === user.userId) return { userId: user.userId };
  if (!Number.isInteger(n) || n <= 0) return { error: 'Invalid userId', status: 400 };
  if (!isStaff(user.role)) return { error: 'Forbidden', status: 403 };
  return { userId: n };
}

export const json = (data: unknown, status = 200) => Response.json(data, { status });
export const fail = (error: string, status = 400) => Response.json({ error }, { status });

/** Today in India (the business runs on IST), as YYYY-MM-DD. */
export function todayKey(): string {
  const ist = new Date(Date.now() + 330 * 60000);
  return ist.toISOString().slice(0, 10);
}

export function queryDay(request: NextRequest, name = 'date'): string {
  const v = new URL(request.url).searchParams.get(name);
  return isDayKey(v) ? v : todayKey();
}

// --- number parsing for request bodies --------------------------------------
export const num = (v: unknown, max = 1e6): number | null => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : null;
};
export const int = (v: unknown, max = 1e6): number | null => {
  const n = num(v, max);
  return n === null ? null : Math.round(n);
};
export const str = (v: unknown, max = 2000): string | null => {
  const s = (v ?? '').toString().trim();
  return s ? s.slice(0, max) : null;
};
const dec = (v: unknown) => (v == null ? null : Number(v));

/** Owner check before an edit/delete: the row must belong to `userId`. */
export async function ownsRow(model: 'workoutLog' | 'cardioLog' | 'foodLog' | 'bodyMetric', id: number, userId: number) {
  const row = await (prisma[model] as any).findUnique({ where: { id }, select: { userId: true } });
  return !!row && row.userId === userId;
}

// --- targets ----------------------------------------------------------------
/**
 * The coach's explicit targets win. Otherwise fall back to the diet plan covering `day`:
 * its targetCalories, plus macros summed from that weekday's meals.
 */
export async function getTargets(userId: number, day: string = todayKey()): Promise<Targets> {
  const t = await prisma.progressTarget.findUnique({ where: { userId } });
  const base: Targets = {
    calories: t?.calories ?? null, protein: t?.protein ?? null, carbs: t?.carbs ?? null, fats: t?.fats ?? null,
    waterL: dec(t?.waterL), workoutsPerWeek: t?.workoutsPerWeek ?? null, source: t ? 'coach' : 'none',
  };
  if (base.calories && base.protein) return base;

  const date = dayToDate(day);
  const plan = await prisma.dietPlan.findFirst({
    where: { clientId: userId, startDate: { lte: date }, endDate: { gte: date } },
    orderBy: { startDate: 'desc' },
    include: { meals: { where: { day: weekdayOf(day) } } },
  });
  if (!plan) return base;
  const fromMeals = foodTotals(plan.meals.map((m) => ({ calories: m.calories, protein: dec(m.protein), carbs: dec(m.carbs), fats: dec(m.fats) })));
  const filled: Targets = {
    ...base,
    calories: base.calories ?? plan.targetCalories ?? (fromMeals.calories || null),
    protein: base.protein ?? (fromMeals.protein || null),
    carbs: base.carbs ?? (fromMeals.carbs || null),
    fats: base.fats ?? (fromMeals.fats || null),
  };
  if (base.source === 'none') filled.source = 'diet-plan';
  return filled;
}

/** Latest logged body weight, else the assessment weight. Used for calorie estimates. */
export async function latestBodyWeight(userId: number): Promise<number | null> {
  const m = await prisma.bodyMetric.findFirst({ where: { userId, weightKg: { not: null } }, orderBy: { date: 'desc' }, select: { weightKg: true } });
  if (m?.weightKg) return Number(m.weightKg);
  const a = await prisma.clientAssessment.findUnique({ where: { userId }, select: { weight: true } });
  return a?.weight ? Number(a.weight) : null;
}

// --- personal records -------------------------------------------------------
export async function loadPRs(userId: number, excludeLogId?: number): Promise<ExercisePR[]> {
  const sets = await prisma.workoutSetLog.findMany({
    where: { userId, ...(excludeLogId ? { workoutLogId: { not: excludeLogId } } : {}) },
    select: { exercise: true, reps: true, weightKg: true, workoutLogId: true, workoutLog: { select: { date: true } } },
  });
  return computePRs(sets.map((s) => ({ exercise: s.exercise, reps: s.reps, weightKg: Number(s.weightKg), date: dateToDay(s.workoutLog.date), logId: s.workoutLogId })));
}

// --- serialisers (Decimal -> number, Date -> YYYY-MM-DD) ----------------------
export const serWorkout = (w: any) => ({
  id: w.id, date: dateToDay(w.date), title: w.title, durationMin: w.durationMin, notes: w.notes,
  sets: (w.sets ?? []).map((s: any) => ({ id: s.id, exercise: s.exercise, exerciseNote: s.exerciseNote, setNumber: s.setNumber, reps: s.reps, weightKg: Number(s.weightKg) })),
});
export const serCardio = (c: any) => ({
  id: c.id, date: dateToDay(c.date), activity: c.activity, distanceKm: dec(c.distanceKm), durationSec: c.durationSec,
  inclinePct: dec(c.inclinePct), calories: c.calories, notes: c.notes,
});
export const serFood = (f: any) => ({
  id: f.id, date: dateToDay(f.date), mealType: f.mealType, foodName: f.foodName, foodSlug: f.foodSlug, quantity: f.quantity,
  calories: f.calories, protein: dec(f.protein), carbs: dec(f.carbs), fats: dec(f.fats),
});
export const serBody = (b: any) => b && ({
  id: b.id, date: dateToDay(b.date), weightKg: dec(b.weightKg), bodyFatPct: dec(b.bodyFatPct),
  chestCm: dec(b.chestCm), waistCm: dec(b.waistCm), hipsCm: dec(b.hipsCm), armsCm: dec(b.armsCm), thighsCm: dec(b.thighsCm), neckCm: dec(b.neckCm),
  photoFront: b.photoFront, photoSide: b.photoSide, photoBack: b.photoBack, notes: b.notes,
});

// --- report -----------------------------------------------------------------
async function loadRange(userId: number, from: string, to: string) {
  const where = { userId, date: { gte: dayToDate(from), lte: dayToDate(to) } };
  const [workouts, cardio, food, body, habits] = await Promise.all([
    prisma.workoutLog.findMany({ where, include: { sets: { orderBy: [{ id: 'asc' }] } }, orderBy: { date: 'asc' } }),
    prisma.cardioLog.findMany({ where, orderBy: { date: 'asc' } }),
    prisma.foodLog.findMany({ where, orderBy: { date: 'asc' } }),
    prisma.bodyMetric.findMany({ where, orderBy: { date: 'asc' } }),
    prisma.habitEntry.findMany({ where, select: { date: true, water: true } }),
  ]);
  return {
    workouts: workouts.map(serWorkout), cardio: cardio.map(serCardio), food: food.map(serFood), body: body.map(serBody),
    water: habits.filter((h) => h.water != null).map((h) => ({ date: dateToDay(h.date), waterL: Number(h.water) })),
  };
}
type Raw = Awaited<ReturnType<typeof loadRange>>;

const inRange = (d: string, from: string, to: string) => d >= from && d <= to;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** Pure summary of the raw rows that fall in [from, to]. */
function summarise(raw: Raw, from: string, to: string, targets: Targets) {
  const days = daysBetween(from, to) + 1;
  const W = raw.workouts.filter((w) => inRange(w.date, from, to));
  const C = raw.cardio.filter((c) => inRange(c.date, from, to));
  const F = raw.food.filter((f) => inRange(f.date, from, to));
  const B = raw.body.filter((b: any) => inRange(b.date, from, to));
  const H = raw.water.filter((h) => inRange(h.date, from, to));

  // Workout
  const allSets = W.flatMap((w) => w.sets);
  const wt = workoutTotals(allSets);
  const workoutDays = new Set([...W.map((w) => w.date), ...C.map((c) => c.date)]);
  const weeks = Math.max(1, days / 7);
  const plannedSessions = (targets.workoutsPerWeek ?? 4) * weeks;
  const byExercise = new Map<string, { exercise: string; sets: number; reps: number; volume: number; bestWeight: number }>();
  for (const s of allSets) {
    const k = s.exercise.toLowerCase().replace(/\s+/g, ' ').trim();
    const e = byExercise.get(k) ?? { exercise: s.exercise, sets: 0, reps: 0, volume: 0, bestWeight: 0 };
    e.sets += 1; e.reps += s.reps; e.volume += s.reps * s.weightKg; e.bestWeight = Math.max(e.bestWeight, s.weightKg);
    byExercise.set(k, e);
  }

  // Cardio
  const dist = C.reduce((a, c) => a + (c.distanceKm ?? 0), 0);
  const dur = C.reduce((a, c) => a + (c.durationSec ?? 0), 0);
  const paces = C.map((c) => paceMinPerKm(c.distanceKm, c.durationSec)).filter((p): p is number => p != null);
  const distForPace = C.filter((c) => c.distanceKm && c.durationSec);

  // Diet (per day)
  const foodByDay = new Map<string, typeof F>();
  for (const f of F) foodByDay.set(f.date, [...(foodByDay.get(f.date) ?? []), f]);
  const dietDays = Array.from(foodByDay.entries()).map(([date, items]) => {
    const t = foodTotals(items);
    return { date, ...t, adherent: dayAdherent(t, targets) };
  });
  const judged = dietDays.filter((d) => d.adherent !== null);

  // Body
  const withWeight = B.filter((b: any) => b.weightKg != null);
  const first = B[0] ?? null;
  const last = B[B.length - 1] ?? null;
  const change: Record<string, number | null> = {};
  for (const k of ['weightKg', 'bodyFatPct', ...MEASUREMENTS.map((m) => m.key)]) {
    const vals = B.map((b: any) => b[k]).filter((v: any) => v != null) as number[];
    change[k] = vals.length >= 2 ? round1(vals[vals.length - 1] - vals[0]) : null;
  }

  // Logging consistency: a day counts if anything was logged.
  const loggedDays = new Set<string>([...W.map((w) => w.date), ...C.map((c) => c.date), ...F.map((f) => f.date), ...B.map((b: any) => b.date), ...H.map((h) => h.date)]);

  // Daily series for charts
  const series = Array.from({ length: days }, (_, i) => {
    const d = addDays(from, i);
    const sets = W.filter((w) => w.date === d).flatMap((w) => w.sets);
    const ft = foodTotals(foodByDay.get(d) ?? []);
    const bw = B.find((b: any) => b.date === d && b.weightKg != null) as any;
    return {
      date: d,
      volume: workoutTotals(sets).volume,
      sets: sets.length,
      km: round1(C.filter((c) => c.date === d).reduce((a, c) => a + (c.distanceKm ?? 0), 0)),
      calories: ft.calories,
      protein: ft.protein,
      waterL: H.find((h) => h.date === d)?.waterL ?? null,
      weightKg: bw?.weightKg ?? null,
      logged: loggedDays.has(d),
    };
  });

  const workoutConsistency = Math.min(100, pct(workoutDays.size, plannedSessions));
  const loggingConsistency = pct(loggedDays.size, days);
  const dietAdherence = judged.length ? pct(judged.filter((d) => d.adherent).length, judged.length) : null;
  const scoreParts = [workoutConsistency, loggingConsistency, ...(dietAdherence !== null ? [dietAdherence] : [])];

  return {
    range: { from, to, days },
    score: Math.round(scoreParts.reduce((a, b) => a + b, 0) / scoreParts.length),
    logging: { daysLogged: loggedDays.size, consistencyPct: loggingConsistency },
    workout: {
      sessions: W.length, activeDays: workoutDays.size, plannedSessions: Math.round(plannedSessions),
      consistencyPct: workoutConsistency, totalSets: wt.sets, totalReps: wt.reps, totalVolume: wt.volume,
      totalMinutes: W.reduce((a, w) => a + (w.durationMin ?? 0), 0),
      byExercise: Array.from(byExercise.values()).map((e) => ({ ...e, volume: round1(e.volume) })).sort((a, b) => b.volume - a.volume),
    },
    cardio: {
      sessions: C.length, distanceKm: round1(dist), durationSec: dur,
      calories: C.reduce((a, c) => a + (c.calories ?? 0), 0),
      avgPace: distForPace.length ? paceMinPerKm(distForPace.reduce((a, c) => a + c.distanceKm!, 0), distForPace.reduce((a, c) => a + c.durationSec!, 0)) : null,
      bestPace: paces.length ? Math.min(...paces) : null,
      longestKm: C.length ? Math.max(...C.map((c) => c.distanceKm ?? 0)) : 0,
    },
    diet: {
      daysLogged: dietDays.length,
      avgCalories: avg(dietDays.map((d) => d.calories)),
      avgProtein: avg(dietDays.map((d) => d.protein)),
      avgCarbs: avg(dietDays.map((d) => d.carbs)),
      avgFats: avg(dietDays.map((d) => d.fats)),
      adherentDays: judged.filter((d) => d.adherent).length,
      judgedDays: judged.length,
      adherencePct: dietAdherence,
      avgWaterL: avg(H.map((h) => h.waterL)),
    },
    body: { first, last, change, latestWeight: withWeight.length ? (withWeight[withWeight.length - 1] as any).weightKg : null },
    series,
  };
}

export type Report = ReturnType<typeof summarise> & {
  targets: Targets;
  previous: { workoutVolume: number; workoutSessions: number; cardioKm: number; cardioAvgPace: number | null; avgCalories: number | null; avgProtein: number | null; score: number };
  prs: ExercisePR[];
  prsInRange: { exercise: string; kind: string; detail: string; date: string }[];
};

/** Report for [from, to] plus the same-length period just before it, for "vs last period". */
export async function buildReport(userId: number, from: string, to: string): Promise<Report> {
  const days = daysBetween(from, to) + 1;
  const prevFrom = addDays(from, -days);
  const prevTo = addDays(from, -1);
  const [raw, targets, prs] = await Promise.all([loadRange(userId, prevFrom, to), getTargets(userId, to), loadPRs(userId)]);
  const cur = summarise(raw, from, to, targets);
  const prev = summarise(raw, prevFrom, prevTo, targets);
  const prsInRange: Report['prsInRange'] = [];
  for (const p of prs) {
    if (p.sessions < 2) continue; // a one-off attempt is a baseline, not a record
    if (inRange(p.maxWeightDate, from, to) && p.maxWeight > 0) prsInRange.push({ exercise: p.exercise, kind: 'weight', detail: `${p.maxWeight} kg x ${p.maxWeightReps}`, date: p.maxWeightDate });
    if (inRange(p.maxRepsDate, from, to)) prsInRange.push({ exercise: p.exercise, kind: 'reps', detail: `${p.maxReps} reps${p.maxRepsWeight ? ` @ ${p.maxRepsWeight} kg` : ''}`, date: p.maxRepsDate });
  }
  return {
    ...cur,
    targets,
    previous: {
      workoutVolume: prev.workout.totalVolume, workoutSessions: prev.workout.sessions,
      cardioKm: prev.cardio.distanceKm, cardioAvgPace: prev.cardio.avgPace,
      avgCalories: prev.diet.avgCalories, avgProtein: prev.diet.avgProtein, score: prev.score,
    },
    prs,
    prsInRange: prsInRange.sort((a, b) => b.date.localeCompare(a.date)),
  };
}

/** Most recent day each user logged anything in the diary (or water in the habit tracker). */
export async function lastLogDates(userIds: number[]): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  if (!userIds.length) return out;
  const where = { userId: { in: userIds } };
  const groups = await Promise.all([
    prisma.workoutLog.groupBy({ by: ['userId'], where, _max: { date: true } }),
    prisma.cardioLog.groupBy({ by: ['userId'], where, _max: { date: true } }),
    prisma.foodLog.groupBy({ by: ['userId'], where, _max: { date: true } }),
    prisma.bodyMetric.groupBy({ by: ['userId'], where, _max: { date: true } }),
    prisma.habitEntry.groupBy({ by: ['userId'], where, _max: { date: true } }),
  ]);
  for (const g of groups) {
    for (const row of g as any[]) {
      const d = row._max.date ? dateToDay(row._max.date) : null;
      if (d && (!out.has(row.userId) || d > out.get(row.userId)!)) out.set(row.userId, d);
    }
  }
  return out;
}

export { dayKey };
