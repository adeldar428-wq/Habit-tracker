'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Habit, HabitLog } from './types';
import { getTodayString } from './utils';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface StoreContextType {
  habits: Habit[];
  logs: HabitLog[];
  user: User | null;
  loading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  isCompletedToday: (habitId: string) => boolean;
  todayCompletionCount: number;
  signOut: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (userId: string) => {
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('habit_logs').select('*').eq('user_id', userId),
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
      setLogs(logsRes.data.map(l => ({
        habitId: l.habit_id,
        date: l.date,
      })));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          await loadData(session.user.id);
        } catch {
          // ignore load errors
        }
      } else {
        setHabits([]);
        setLogs([]);
      }
      setLoading(false);
    });

    // Trigger initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase.from('habits').insert({
      user_id: user.id,
      name: habit.name,
      emoji: habit.emoji,
      color: habit.color,
      category: habit.category,
    }).select().single();

    if (data) {
      setHabits(prev => [...prev, {
        id: data.id,
        name: data.name,
        emoji: data.emoji,
        color: data.color,
        category: data.category,
        createdAt: data.created_at,
      }]);
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    await supabase.from('habits').update({
      name: updates.name,
      emoji: updates.emoji,
      color: updates.color,
      category: updates.category,
    }).eq('id', id);
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  };

  const toggleHabit = async (habitId: string) => {
    if (!user) return;
    const today = getTodayString();
    const exists = logs.some(l => l.habitId === habitId && l.date === today);

    if (exists) {
      await supabase.from('habit_logs').delete()
        .eq('habit_id', habitId)
        .eq('date', today)
        .eq('user_id', user.id);
      setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date === today)));
    } else {
      await supabase.from('habit_logs').insert({
        habit_id: habitId,
        user_id: user.id,
        date: today,
      });
      setLogs(prev => [...prev, { habitId, date: today }]);
    }
  };

  const isCompletedToday = (habitId: string) => {
    const today = getTodayString();
    return logs.some(l => l.habitId === habitId && l.date === today);
  };

  const todayCompletionCount = habits.filter(h => isCompletedToday(h.id)).length;

  const signOut = async () => {
    await supabase.auth.signOut();
    setHabits([]);
    setLogs([]);
  };

  return (
    <StoreContext.Provider value={{
      habits, logs, user, loading,
      addHabit, updateHabit, deleteHabit, toggleHabit,
      isCompletedToday, todayCompletionCount, signOut,
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
