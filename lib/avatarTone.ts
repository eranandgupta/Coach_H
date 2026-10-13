// One consistent avatar tint — colour on the dashboards is reserved for meaning
// (status, category), so avatars stay quiet.
export function avatarTone(_seed?: string | number | null): string {
  return 'bg-brand-blue/10 text-brand-blue ring-brand-blue/20';
}
