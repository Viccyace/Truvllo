export function getDaysBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(1, Math.round((e - s) / 86400000));
}

export function getDaysElapsed(start: string): number {
  const s    = new Date(start).getTime();
  const now  = new Date().getTime();
  return Math.max(0, Math.round((now - s) / 86400000));
}

export function getExpectedSpend(total: number, start: string, end: string): number {
  const totalDays   = getDaysBetween(start, end);
  const elapsedDays = Math.min(getDaysElapsed(start), totalDays);
  return Math.round((total / totalDays) * elapsedDays);
}

export function getSafeToSpend(total: number, spent: number, end: string): number {
  const remaining  = Math.max(0, total - spent);
  const today      = new Date().toISOString().split('T')[0];
  const daysLeft   = Math.max(1, getDaysBetween(today, end));
  return Math.round(remaining / daysLeft);
}

export function getPaceStatus(spent: number, expected: number): string {
  if (expected === 0) return 'Ahead of plan';
  const ratio = spent / expected;
  if (ratio <= 0.9)  return 'Ahead of plan';
  if (ratio <= 1.05) return 'On track';
  if (ratio <= 1.2)  return 'Slightly over pace';
  return 'Over budget risk';
}

export function getHabitStreak(
  expenses: { expense_date: string }[],
  startDate: string,
  endDate: string
): { current_streak: number; longest_streak: number; logged_today: boolean; missed_days: string[] } {
  const loggedDays = new Set(expenses.map(e => e.expense_date));
  const today      = new Date().toISOString().split('T')[0];
  const start      = new Date(startDate);
  const end        = new Date(Math.min(new Date(endDate).getTime(), new Date(today).getTime()));

  const allDays: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDays.push(d.toISOString().split('T')[0]);
  }

  const missedDays = allDays.filter(d => d < today && !loggedDays.has(d));

  let currentStreak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    const day = allDays[i];
    if (day > today) continue;
    if (loggedDays.has(day)) currentStreak++;
    else if (day < today)    break;
  }

  let longest = 0, running = 0;
  for (const day of allDays) {
    if (loggedDays.has(day)) { running++; longest = Math.max(longest, running); }
    else                      { running = 0; }
  }

  return { current_streak: currentStreak, longest_streak: longest, logged_today: loggedDays.has(today), missed_days: missedDays };
}
