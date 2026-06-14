import { HabitLog } from './types';

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateStreak(habitId: string, logs: HabitLog[]): number {
  const completedDates = logs
    .filter(l => l.habitId === habitId)
    .map(l => l.date);

  if (completedDates.length === 0) return 0;

  const completedSet = new Set(completedDates);
  const today = getTodayString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (!completedSet.has(today) && !completedSet.has(yesterdayStr)) return 0;

  let streak = 0;
  const current = new Date();
  if (!completedSet.has(today)) {
    current.setDate(current.getDate() - 1);
  }

  while (true) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    if (completedSet.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
