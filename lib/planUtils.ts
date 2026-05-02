export function isElitePlan(planName: string): boolean {
  return planName.startsWith('Elite 1:1');
}

export function getTotalSessions(planName: string): number | null {
  const match = planName.match(/\((\d+)\s*Sessions?\)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function getSessionLabel(weekNumber: number, isElite: boolean): string {
  return isElite ? `Session ${weekNumber}` : `Week ${weekNumber}`;
}

export function getSessionLabelShort(index: number, isElite: boolean): string {
  return isElite ? `S${index}` : `W${index}`;
}
