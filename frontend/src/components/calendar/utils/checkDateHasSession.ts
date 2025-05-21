// lib/utils/checkDateHasSession.ts
export function hasSessionOnDate(
  sessions: { date: string }[],
  targetDate: Date
): boolean {
  const targetKey = targetDate.toISOString().split("T")[0];
  return sessions.some((session) => session.date.startsWith(targetKey));
}
