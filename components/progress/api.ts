'use client';

/** Small fetch wrapper for /api/progress/* — adds the bearer token and surfaces API errors. */
export async function progressApi<T = any>(path: string, opts: { method?: string; body?: unknown; userId?: number | null; query?: Record<string, string | number | undefined | null> } = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const params = new URLSearchParams();
  const method = opts.method ?? 'GET';
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  // Staff viewing a client: GET/DELETE carry userId in the query, writes in the body.
  if (opts.userId && (method === 'GET' || method === 'DELETE')) params.set('userId', String(opts.userId));
  const qs = params.toString();
  const body = opts.body !== undefined ? { ...(opts.body as object), ...(opts.userId ? { userId: opts.userId } : {}) } : undefined;
  const res = await fetch(`/api/progress/${path}${qs ? `?${qs}` : ''}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`) as Error & { status?: number; subscriptionExpired?: boolean };
    err.status = res.status;
    err.subscriptionExpired = !!data?.subscriptionExpired;
    throw err;
  }
  return data as T;
}

// Response shapes (mirror lib/progress.ts serialisers)
export interface SetRow { id?: number; exercise: string; exerciseNote?: string | null; setNumber?: number; reps: number; weightKg: number }
export interface WorkoutRow { id: number; date: string; title: string | null; durationMin: number | null; notes: string | null; sets: SetRow[] }
export interface CardioRow { id: number; date: string; activity: string; distanceKm: number | null; durationSec: number | null; inclinePct: number | null; calories: number | null; notes: string | null }
export interface FoodRow { id: number; date: string; mealType: string; foodName: string; foodSlug: string | null; quantity: string | null; calories: number | null; protein: number | null; carbs: number | null; fats: number | null }
export interface BodyRow { id: number; date: string; weightKg: number | null; bodyFatPct: number | null; chestCm: number | null; waistCm: number | null; hipsCm: number | null; armsCm: number | null; thighsCm: number | null; neckCm: number | null; photoFront: string | null; photoSide: string | null; photoBack: string | null; notes: string | null }
export interface TargetsRow { calories: number | null; protein: number | null; carbs: number | null; fats: number | null; waterL: number | null; workoutsPerWeek: number | null; source: 'coach' | 'diet-plan' | 'none' }
export interface DayBundle {
  date: string; workouts: WorkoutRow[]; cardio: CardioRow[]; food: FoodRow[]; waterL: number | null;
  body: BodyRow | null; latestBody: BodyRow | null; targets: TargetsRow;
  planned: { title: string; exercises: { name: string; sets: number | null; reps: string | null; exerciseType: string }[] } | null;
}
export interface NewPR { exercise: string; kind: 'weight' | 'reps' | '1rm'; value: number; previous: number; detail: string }
