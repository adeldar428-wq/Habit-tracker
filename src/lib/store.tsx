'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Habit, HabitLog } from './types';
import { getTodayString } from './utils';
import { supabase } from './supabase';

const SYNC_KEY_STORAGE = 'habitly-sync-key';

function getSyncKey(): string {
  let key = localStorage.getItem(SYNC_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(SYNC_KEY_STORAGE, key);
  }
  return key;
}

interface StoreContextType {
  habits: Habit[];
  logs: HabitLog[];
  loading: boolean;
  syncKey: string;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  isCompletedToday: (habitId: string) => boolean;
  todayCompletionCount: number;
  importSyncKey: (key: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncKey, setSyncKey] = useState('');

  const loadData = useCallback(async (key: string) => {
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('sync_key', key).order('created_at'),
      supabase.from('habit_logs').select('*').eq('sync_key', key),
    ]);
    if (habitsRes.data) {
      setHabits(habitsRes.data.map(h => ({
        id: h.id,
        name: h.name,
        emoji: h.emoji,
        color: h.color,
        category: h.category,
        createdAt: h.created_at,
      })));
    }
    if (logsRes.data) {
      setLogs(logsRes.data.map(l => ({ habitId: l.habit_id, date: l.date })));
    }
  }, []);

  useEffect(() => {
    const key = getSyncKey();
    setSyncKey(key);
    loadData(key).finally(() => setLoading(false));
  }, [loadData]);

  const importSyncKey = (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem(SYNC_KEY_STORAGE, trimmed);
    setSyncKey(trimmed);
    setLoading(true);
    loadData(trimmed).finally(() => setLoading(false));
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const { data } = await supabase.from('habits').insert({
      sync_key: syncKey,
      name: habit.name,
      emoji: habit.emoji,
      color: habit.color,
      category: habit.category,
    }).select().single();
    if (data) {
      setHabits(prev => [...prev, {
        id: data.id, name: data.name, emoji: data.emoji,
        color: data.color, category: data.category, createdAt: data.created_at,
      }]);
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    await supabase.from('habits').update(updates).eq('id', id);
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  };

  const toggleHabit = async (habitId: string) => {
    const today = getTodayString();
    const exists = logs.some(l => l.habitId === habitId && l.date === today);
    if (exists) {
      await supabase.from('habit_logs').delete()
        .eq('habit_id', habitId).eq('date', today).eq('sync_key', syncKey);
      setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date === today)));
    } else {
      await supabase.from('habit_logs').insert({ habit_id: habitId, sync_key: syncKey, date: today });
      setLogs(prev => [...prev, { habitId, date: today }]);
    }
  };

  const isCompletedToday = (habitId: string) => {
    const today = getTodayString();
    return logs.some(l => l.habitId === habitId && l.date === today);
  };

  const todayCompletionCount = habits.filter(h => isCompletedToday(h.id)).length;

  return (
    <StoreContext.Provider value={{
      habits, logs, loading, syncKey,
      addHabit, updateHabit, deleteHabit, toggleHabit,
      isCompletedToday, todayCompletionCount, importSyncKey,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
