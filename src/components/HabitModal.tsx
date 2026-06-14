'use client';

import { useState, useEffect } from 'react';
import { Habit, Category, CATEGORIES, HABIT_COLORS, EMOJI_OPTIONS } from '@/lib/types';
import { useStore } from '@/lib/store';

interface HabitModalProps {
  habit?: Habit | null;
  onClose: () => void;
}

export function HabitModal({ habit, onClose }: HabitModalProps) {
  const { addHabit, updateHabit } = useStore();
  const [name, setName] = useState(habit?.name ?? '');
  const [emoji, setEmoji] = useState(habit?.emoji ?? '⭐');
  const [color, setColor] = useState(habit?.color ?? '#8B5CF6');
  const [category, setCategory] = useState<Category>(habit?.category ?? 'other');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (habit) {
      updateHabit(habit.id, { name: name.trim(), emoji, color, category });
    } else {
      addHabit({ name: name.trim(), emoji, color, category });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full max-w-md bg-[#12122a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Colored top strip */}
        <div className="h-1 w-full transition-colors duration-200" style={{ backgroundColor: color }} />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              {habit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Emoji */}
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">Icon</p>
              <div className="grid grid-cols-8 gap-1.5">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] transition-all duration-150"
                    style={{
                      background: emoji === e ? color + '28' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${emoji === e ? color + '80' : 'transparent'}`,
                      transform: emoji === e ? 'scale(1.12)' : 'scale(1)',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">Name</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Morning Run"
                maxLength={40}
                autoFocus
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none transition-colors text-sm"
                style={{
                  borderColor: name ? color + '50' : 'rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Color */}
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">Color</p>
              <div className="flex gap-2.5 flex-wrap">
                {HABIT_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className="w-8 h-8 rounded-full transition-all duration-150 flex-shrink-0"
                    title={c.label}
                    style={{
                      backgroundColor: c.value,
                      transform: color === c.value ? 'scale(1.25)' : 'scale(1)',
                      boxShadow:
                        color === c.value
                          ? `0 0 0 2px #12122a, 0 0 0 4px ${c.value}`
                          : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">Category</p>
              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-medium transition-all"
                    style={{
                      background:
                        category === cat.id ? color + '20' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${category === cat.id ? color + '60' : 'transparent'}`,
                      color: category === cat.id ? 'white' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{
                background: name.trim()
                  ? `linear-gradient(135deg, ${color}, ${color}cc)`
                  : 'rgba(255,255,255,0.08)',
                boxShadow: name.trim() ? `0 4px 20px ${color}40` : 'none',
              }}
            >
              {habit ? 'Save Changes' : 'Add Habit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
