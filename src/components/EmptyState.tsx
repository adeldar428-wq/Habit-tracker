interface EmptyStateProps {
  onAddHabit: () => void;
}

export function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="text-6xl mb-5 animate-bounce">🌱</div>
      <h2 className="text-white font-bold text-xl mb-2">Start your journey</h2>
      <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-[220px]">
        Add your first habit and start building better daily routines.
      </p>
      <button
        onClick={onAddHabit}
        className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
        }}
      >
        Add First Habit
      </button>
    </div>
  );
}
