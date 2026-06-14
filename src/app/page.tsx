'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { HabitCard } from '@/components/HabitCard';
import { HabitModal } from '@/components/HabitModal';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { Habit, Category, CATEGORIES } from '@/lib/types';

export default function Home() {
  const { habits } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const usedCategories = Array.from(new Set(habits.map(h => h.category)));
  const showFilter = usedCategories.length > 1;

  const filteredHabits =
    activeCategory === 'all'
      ? habits
      : habits.filter(h => h.category === activeCategory);

  const handleAdd = () => {
    setEditingHabit(null);
    setShowModal(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingHabit(null);
  };

  return (
    <main className="max-w-lg mx-auto min-h-screen pb-10">
      <Header onAddHabit={handleAdd} />

      {habits.length === 0 ? (
        <EmptyState onAddHabit={handleAdd} />
      ) : (
        <div className="px-4 mt-4">
          {/* Category filter pills */}
          {showFilter && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4 -mx-1 px-1">
              <CategoryPill
                label="All"
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
              />
              {usedCategories.map(catId => {
                const cat = CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <CategoryPill
                    key={catId}
                    label={cat.label}
                    emoji={cat.emoji}
                    active={activeCategory === catId}
                    onClick={() => setActiveCategory(catId)}
                  />
                );
              })}
            </div>
          )}

          {/* Habits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredHabits.map(habit => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
            ))}
          </div>

          {filteredHabits.length === 0 && activeCategory !== 'all' && (
            <div className="text-center py-12 text-white/30 text-sm">
              No habits in this category yet.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <HabitModal habit={editingHabit} onClose={handleClose} />
      )}
    </main>
  );
}

function CategoryPill({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
      style={{
        background: active ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)',
        color: active ? '#C4B5FD' : 'rgba(255,255,255,0.40)',
        border: `1px solid ${active ? 'rgba(139,92,246,0.45)' : 'transparent'}`,
      }}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}
