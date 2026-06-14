'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  onAddHabit: () => void;
}

export function Header({ onAddHabit }: HeaderProps) {
  const { habits, todayCompletionCount, syncKey, importSyncKey } = useStore();
  const [showSync, setShowSync] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [copied, setCopied] = useState(false);

  const total = habits.length;
  const pct = total > 0 ? Math.round((todayCompletionCount / total) * 100) : 0;
  const allDone = total > 0 && todayCompletionCount === total;

  const shortKey = syncKey ? syncKey.slice(0, 8).toUpperCase() : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(syncKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (inputKey.trim()) {
      importSyncKey(inputKey.trim());
      setInputKey('');
      setShowSync(false);
    }
  };

  return (
    <header className="px-4 pt-10 pb-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-white font-extrabold text-xl tracking-tight">Habitly</span>
          </div>
          <p className="text-white/35 text-xs mt-0.5 ml-0.5">{formatDate(new Date())}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync button */}
          <button
            onClick={() => setShowSync(!showSync)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            title="Sync across devices"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={onAddHabit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
        </div>
      </div>

      {/* Sync panel */}
      {showSync && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white font-semibold text-sm mb-3">🔄 Sync Across Devices</p>

          {/* Current key */}
          <p className="text-white/40 text-xs mb-1.5">Your Sync Key (copy it to other devices):</p>
          <div className="flex gap-2 mb-4">
            <code className="flex-1 bg-black/30 rounded-xl px-3 py-2.5 text-violet-300 text-xs font-mono truncate">
              {syncKey}
            </code>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl text-xs font-medium text-white transition-all"
              style={{ background: copied ? '#10B981' : 'rgba(139,92,246,0.4)' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Import key */}
          <p className="text-white/40 text-xs mb-1.5">Enter Sync Key from another device:</p>
          <div className="flex gap-2">
            <input
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              placeholder="Paste sync key here..."
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
            />
            <button
              onClick={handleImport}
              disabled={!inputKey.trim()}
              className="px-3 py-2 rounded-xl text-xs font-medium text-white disabled:opacity-40 transition-all"
              style={{ background: 'rgba(139,92,246,0.4)' }}
            >
              Sync
            </button>
          </div>
        </div>
      )}

      {/* Progress card */}
      {total > 0 && (
        <div className="rounded-2xl p-4 mb-2 transition-all duration-500"
          style={{
            background: allDone ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.10))' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${allDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
          }}>
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
            <span className="text-3xl font-extrabold tabular-nums transition-colors duration-500"
              style={{ color: allDone ? '#10B981' : pct > 50 ? '#8B5CF6' : 'rgba(255,255,255,0.5)' }}>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: allDone ? 'linear-gradient(90deg, #10B981, #06B6D4)' : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
              }} />
          </div>
        </div>
      )}
    </header>
  );
}
