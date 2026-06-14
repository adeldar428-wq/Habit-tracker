'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-5">📬</div>
        <h2 className="text-white font-bold text-xl mb-2">Check your email!</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
          We sent a magic link to{' '}
          <span className="text-white/70 font-medium">{email}</span>.
          <br />Click it to sign in — no password needed.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <span className="text-5xl mb-3">🌿</span>
        <h1 className="text-white font-extrabold text-3xl tracking-tight">Habitly</h1>
        <p className="text-white/35 text-sm mt-1.5">Build better habits every day</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="text-white font-bold text-lg mb-1">Sign in</h2>
        <p className="text-white/40 text-sm mb-5">
          Enter your email and we'll send you a magic link — no password needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
            }}
          >
            {loading ? 'Sending...' : '✨ Send Magic Link'}
          </button>
        </form>
      </div>

      <p className="text-white/20 text-xs mt-8 text-center max-w-xs">
        Your habits sync across all your devices when you sign in with the same email.
      </p>
    </div>
  );
}
