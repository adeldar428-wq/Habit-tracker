'use client';

import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  onAddHabit: () => void;
}

export function Header({ onAddHabit }: HeaderProps) {
  const { habits, todayCompletionCount } = useStore();
  const total = habits.length;
  const pct = total > 0 ? Math.round((todayCompletionCount / total) * 100) : 0;
  const allDone = total > 0 && todayCompletionCount === total;

  return (
    <header className="px-4 pt-10 pb-2">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-white font-extrabold text-xl tracking-tight">Habitly</span>
          </div>
          <p className="text-white/35 text-xs mt-0.5 ml-0.5">{formatDate(new Date())}</p>
        </div>

        <button
          onClick={onAddHabit}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Habit
        </button>
      </div>

      {/* Progress card */}
      {total > 0 && (
        <div
          className="rounded-2xl p-4 mb-2 transition-all duration-500"
          style={{
            background: allDone
              ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.10))'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${allDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                {allDone ? '🎉 All done!' : "Today's Progress"}
              </p>
              <p className="text-white font-bold text-xl mt-0.5">
                {todayCompletionCount}
                <span className="text-white/30 font-normal text-base">/{total}</span>
                <span className="text-white/40 text-sm font-normal ml-1.5">habits</span>
              </p>
            </div>
            <span
              className="text-3xl font-extrabold tabular-nums transition-colors duration-500"
              style={{ color: allDone ? '#10B981' : pct > 50 ? '#8B5CF6' : 'rgba(255,255,255,0.5)' }}
            >
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: allDone
                  ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                  : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
