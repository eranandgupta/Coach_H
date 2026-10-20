// What a trainer account may do. Stored per trainer in User.trainerPermissions (JSON).
// Trainers always see the clients assigned to them; these switch on the tools on top.
// Safe to import from client components (no server dependencies).

export const TRAINER_PERMISSIONS = [
  { key: 'workouts', label: 'Workout plans', description: 'Create and edit workout plans and workout templates' },
  { key: 'diets', label: 'Diet plans', description: 'Create and edit diet plans and diet templates' },
  { key: 'chat', label: 'Chat with clients', description: 'Message assigned clients' },
  { key: 'liveSessions', label: 'Live sessions', description: 'Schedule and run live sessions' },
  { key: 'clientActivity', label: 'Client login activity', description: 'See when assigned clients last logged in' },
] as const;

export type TrainerPermission = (typeof TRAINER_PERMISSIONS)[number]['key'];
export type TrainerPermissions = Record<TrainerPermission, boolean>;

export const ALL_TRAINER_PERMISSIONS: TrainerPermissions = Object.fromEntries(
  TRAINER_PERMISSIONS.map((p) => [p.key, true])
) as TrainerPermissions;

/**
 * Stored value -> full permission map. `null` (trainers created before access options existed)
 * means everything is allowed, so existing trainers keep working exactly as before.
 * Keys missing from a stored map are off.
 */
export function resolveTrainerPermissions(stored: unknown): TrainerPermissions {
  if (stored == null || typeof stored !== 'object') return { ...ALL_TRAINER_PERMISSIONS };
  const map = stored as Record<string, unknown>;
  return Object.fromEntries(
    TRAINER_PERMISSIONS.map((p) => [p.key, map[p.key] === true])
  ) as TrainerPermissions;
}

/** Keeps only known keys with boolean values; anything else is dropped. */
export function sanitizeTrainerPermissions(input: unknown): TrainerPermissions {
  const map = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  return Object.fromEntries(
    TRAINER_PERMISSIONS.map((p) => [p.key, map[p.key] === true])
  ) as TrainerPermissions;
}

export function trainerPermissionLabel(key: TrainerPermission): string {
  return TRAINER_PERMISSIONS.find((p) => p.key === key)?.label ?? key;
}

/** Staff accounts (coach, admin, trainer) never fill in the client pre-assessment. */
export function isStaffRole(role: string | null | undefined): boolean {
  return role === 'coach' || role === 'admin' || role === 'trainer';
}
