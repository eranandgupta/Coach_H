/**
 * Which check-ins the client dashboard popup should ask for, and when.
 *
 * Each tracker has its own natural rhythm, so each prompt has its own cadence:
 *   Daily   Habit Tracker (end of day), Progress Diary workout (training days) and food.
 *   Weekly  Progress Diary weigh-in (body check-in).
 *   Cycle   Transformation Logbook: Day 1 at the start of a 30-day cycle, Day 30 at the end.
 *
 * Pure function: the server says what's logged (/api/progress/reminders), the browser supplies
 * the local hour, and `lastShown` (localStorage) stops a prompt repeating before its cooldown.
 */
import type { DiaryTab } from '@/components/progress/OverviewTab';

export interface RemindersData {
  date: string;
  habits: { today: boolean; yesterday: boolean; daysLast14: number };
  workout: { planned: number; logged: number };
  food: { today: number };
  weighIn: { lastDate: string | null };
  logbook: {
    count: number;
    latest: { id: number; title: string | null; startDate: string | null; endDate: string | null; hasDay1: boolean; hasDay30: boolean } | null;
  };
}

export type CheckInAction = { kind: 'habits' } | { kind: 'diary'; tab: DiaryTab } | { kind: 'logbook' };
export type Cadence = 'Daily' | 'Weekly' | '30-day cycle';

export interface CheckIn {
  id: string;
  cadence: Cadence;
  title: string;
  body: string;
  cta: string;
  action: CheckInAction;
  /** Days before this prompt may show again after it was shown (1 = once a day). */
  cooldownDays: number;
}

/** Whole days from `a` to `b` (YYYY-MM-DD). */
export const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

const fmt = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** Hours (local) from which the end-of-day prompts make sense — nobody can log sleep at 9 am. */
export const HOURS = { workout: 17, habits: 19, food: 20, yesterdayUntil: 12 };

export function dueCheckIns(d: RemindersData, hour: number): CheckIn[] {
  const out: CheckIn[] = [];
  const today = d.date;

  // --- Logbook (30-day cycle) — the most time-sensitive, so listed first.
  const lb = d.logbook.latest;
  if (!lb) {
    out.push({
      id: 'logbook-start',
      cadence: '30-day cycle',
      title: 'Start your 30-day Transformation Logbook',
      body: 'Record your Day 1 fitness tests, measurements and weight now, so you can see exactly what changed on Day 30.',
      cta: 'Start Day 1',
      action: { kind: 'logbook' },
      cooldownDays: 7,
    });
  } else if (lb.endDate) {
    const toEnd = daysBetween(today, lb.endDate);
    const started = !lb.startDate || daysBetween(lb.startDate, today) >= 0;
    const name = lb.title || 'your logbook';
    if (!lb.hasDay30 && toEnd <= 1 && toEnd >= -10) {
      out.push({
        id: `logbook-day30-${lb.id}`,
        cadence: '30-day cycle',
        title: toEnd >= 0 ? 'Day 30 check-in is due' : 'Day 30 check-in is overdue',
        body: `${name} ${toEnd >= 0 ? 'ends' : 'ended'} on ${fmt(lb.endDate)}. Repeat your Day 1 tests and measurements and fill in the Day 30 column to see your results.`,
        cta: 'Fill Day 30',
        action: { kind: 'logbook' },
        cooldownDays: 1,
      });
    } else if (toEnd < 0 && (lb.hasDay30 || toEnd < -10)) {
      out.push({
        id: `logbook-next-${lb.id}`,
        cadence: '30-day cycle',
        title: `Start cycle ${d.logbook.count + 1} of your logbook`,
        body: `${name} finished on ${fmt(lb.endDate)}. Start the next 30-day cycle with fresh Day 1 numbers to keep tracking your progress.`,
        cta: 'Start next cycle',
        action: { kind: 'logbook' },
        cooldownDays: 7,
      });
    } else if (started && !lb.hasDay1) {
      out.push({
        id: `logbook-day1-${lb.id}`,
        cadence: '30-day cycle',
        title: 'Fill in Day 1 of your logbook',
        body: `${name} has started but the Day 1 column is still empty. Your starting numbers are what Day 30 is compared against.`,
        cta: 'Fill Day 1',
        action: { kind: 'logbook' },
        cooldownDays: 2,
      });
    }
  }

  // --- Daily: today's planned workout (Progress Diary).
  if (d.workout.planned > 0 && d.workout.logged === 0 && hour >= HOURS.workout) {
    out.push({
      id: 'diary-workout',
      cadence: 'Daily',
      title: "Log today's workout",
      body: `Your coach planned ${d.workout.planned} exercise${d.workout.planned === 1 ? '' : 's'} for today. Log your sets and weights so your coach can see your progress.`,
      cta: 'Log workout',
      action: { kind: 'diary', tab: 'workout' },
      cooldownDays: 1,
    });
  }

  // --- Daily: habits. Evening for today; next morning for a missed yesterday (regular users only).
  if (!d.habits.today && hour >= HOURS.habits) {
    out.push({
      id: 'habits-today',
      cadence: 'Daily',
      title: "Fill in today's habits",
      body: 'Protein, water, workout, steps and sleep take under a minute to log, and your coach checks them.',
      cta: 'Open habit tracker',
      action: { kind: 'habits' },
      cooldownDays: 1,
    });
  } else if (!d.habits.yesterday && hour < HOURS.yesterdayUntil && d.habits.daysLast14 > 0) {
    out.push({
      id: 'habits-yesterday',
      cadence: 'Daily',
      title: "Yesterday's habits are missing",
      body: "You didn't log yesterday. Open the habit tracker and pick yesterday's date in the calendar to fill it in.",
      cta: 'Open habit tracker',
      action: { kind: 'habits' },
      cooldownDays: 1,
    });
  }

  // --- Daily: food (Progress Diary).
  if (d.food.today === 0 && hour >= HOURS.food) {
    out.push({
      id: 'diary-food',
      cadence: 'Daily',
      title: "Log today's meals",
      body: "Add what you ate today so your calories and protein show against your diet plan's targets.",
      cta: 'Log meals',
      action: { kind: 'diary', tab: 'diet' },
      cooldownDays: 1,
    });
  }

  // --- Weekly: weigh-in (Progress Diary body check-in).
  const sinceWeighIn = d.weighIn.lastDate ? daysBetween(d.weighIn.lastDate, today) : null;
  if (sinceWeighIn === null || sinceWeighIn >= 7) {
    out.push({
      id: 'diary-weigh-in',
      cadence: 'Weekly',
      title: 'Weekly weigh-in',
      body:
        sinceWeighIn === null
          ? 'Log your weight once a week. Weigh at the same time each week, ideally in the morning before breakfast, so the numbers are comparable.'
          : `Your last weigh-in was ${sinceWeighIn} days ago (${fmt(d.weighIn.lastDate!)}). Weigh at the same time each week, ideally in the morning before breakfast.`,
      cta: 'Log weight',
      action: { kind: 'diary', tab: 'body' },
      cooldownDays: 2,
    });
  }

  return out;
}

/** localStorage map of check-in id -> local day it was last shown. */
export type ShownLog = Record<string, string>;

/** Due check-ins that are past their cooldown. */
export function checkInsToShow(due: CheckIn[], shown: ShownLog, today: string): CheckIn[] {
  return due.filter((c) => {
    const last = shown[c.id];
    return !last || daysBetween(last, today) >= c.cooldownDays;
  });
}
