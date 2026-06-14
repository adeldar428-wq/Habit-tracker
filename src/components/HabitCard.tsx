'use client';

import { useState } from 'react';
import { Habit } from '@/lib/types';
import { useStore } from '@/lib/store';
import { calculateStreak } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { logs, toggleHabit, isCompletedToday, deleteHabit } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [pressing, setPressing] = useState(false);

  const completed = isCompletedToday(habit.id);
  const streak = calculateStreak(habit.id, logs);

  return (
    <div
      className="relative rounded-2xl p-4 transition-all duration-300 group"
      style={{
        background: completed
          ? `linear-gradient(135deg, ${habit.color}18 0%, ${habit.color}08 100%)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${completed ? habit.color + '50' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: completed ? `0 0 20px ${habit.color}15` : 'none',
      }}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ backgroundColor: habit.color }}
      />

      <div className="pl-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl leading-none flex-shrink-0">{habit.emoji}</span>
            <div className="min-w-0">
              <h3
                className="font-semibold text-[15px] leading-snug truncate transition-colors"
                style={{ color: completed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.85)' }}
              >
                {habit.name}
              </h3>
              <span className="text-xs capitalize mt-0.5 block" style={{ color: habit.color + 'bb' }}>
                {habit.category}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10"
              aria-label="Options"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-[#1c1c35] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[130px]">
                  <button
                    onClick={() => { onEdit(habit); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>✏️</span> Edit
                  </button>
                  <div className="h-px bg-white/10 mx-3" />
                  <button
                    onClick={() => { deleteHabit(habit.id); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            {streak > 0 ? (
              <>
                <span className="text-sm">🔥</span>
                <span className="text-xs font-bold" style={{ color: habit.color }}>
                  {streak} day{streak !== 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <span className="text-xs text-white/25">Start your streak</span>
            )}
          </div>

          {/* Check button */}
          <button
            onClick={() => toggleHabit(habit.id)}
            onMouseDown={() => setPressing(true)}
            onMouseUp={() => setPressing(false)}
            onMouseLeave={() => setPressing(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              backgroundColor: completed ? habit.color : 'transparent',
              border: `2px solid ${completed ? habit.color : 'rgba(255,255,255,0.18)'}`,
              transform: pressing ? 'scale(0.88)' : 'scale(1)',
              boxShadow: completed ? `0 0 12px ${habit.color}60` : 'none',
            }}
            aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {completed && (
              <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
