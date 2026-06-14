'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Habit, HabitLog } from './types';
import { generateId, getTodayString } from './utils';

interface StoreContextType {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string) => void;
  isCompletedToday: (habitId: string) => boolean;
  todayCompletionCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'habitly-v1';

const DEMO_HABITS: Habit[] = [
  {
    id: 'demo-1',
    name: 'Morning Walk',
    emoji: '🌅',
    color: '#10B981',
    category: 'fitness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Read 30 Minutes',
    emoji: '📚',
    color: '#8B5CF6',
    category: 'learning',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Drink 8 Glasses of Water',
    emoji: '💧',
    color: '#06B6D4',
    category: 'health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    name: 'Meditate',
    emoji: '🧘',
    color: '#EC4899',
    category: 'mindfulness',
    createdAt: new Date().toISOString(),
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setHabits(data.habits || []);
        setLogs(data.logs || []);
      } else {
        setHabits(DEMO_HABITS);
        setLogs([]);
      }
    } catch {
      setHabits(DEMO_HABITS);
      setLogs([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, logs }));
  }, [habits, logs, loaded]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    setHabits(prev => [
      ...prev,
      { ...habit, id: generateId(), createdAt: new Date().toISOString() },
    ]);
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  };

  const toggleHabit = (habitId: string) => {
    const today = getTodayString();
    const exists = logs.some(l => l.habitId === habitId && l.date === today);
    if (exists) {
      setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date === today)));
    } else {
      setLogs(prev => [...prev, { habitId, date: today }]);
    }
  };

  const isCompletedToday = (habitId: string) => {
    const today = getTodayString();
    return logs.some(l => l.habitId === habitId && l.date === today);
  };

  const todayCompletionCount = habits.filter(h => isCompletedToday(h.id)).length;

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        habits,
        logs,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        isCompletedToday,
        todayCompletionCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
