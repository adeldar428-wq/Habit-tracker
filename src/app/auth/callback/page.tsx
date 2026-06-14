'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        subscription.unsubscribe();
        router.replace('/');
      } else if (event === 'INITIAL_SESSION') {
        subscription.unsubscribe();
        router.replace('/');
      }
    });

    const timeout = setTimeout(() => router.replace('/'), 4000);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D1A' }}>
      <div className="flex flex-col items-center gap-4">
        <span className="text-4xl">🌿</span>
        <div className="w-7 h-7 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-white/30 text-xs">Signing you in...</p>
      </div>
    </div>
  );
}
