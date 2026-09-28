import { useState } from 'react';
import { Sparkles, Trophy, Layers, Copy, Check, Tag } from 'lucide-react';
import { Fixture } from '../types';
import { getTodayTags } from '../utils/todayFixturesTags';

interface TodayFixturesTagsProps {
  fixtures?: Fixture[];
  className?: string;
  showHeading?: boolean;
}

export default function TodayFixturesTags({
  fixtures,
  className = '',
  showHeading = true
}: TodayFixturesTagsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const tags = getTodayTags(fixtures);

  // If no fixtures are present at all
  if (!tags.topTwoFixtures && !tags.leagues && !tags.predictionsSummary) {
    return null;
  }

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div 
      id="today-fixtures-tags-container"
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs relative overflow-hidden text-left space-y-3 ${className}`}
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-blue-600" />

      {showHeading && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider font-mono text-[var(--text)]">
              Today's Fixtures & Prediction Tags
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase hidden sm:inline-block">
            Auto-Generated Live Tags
          </span>
        </div>
      )}

      {/* Tags List */}
      <div className="space-y-2.5">
        {/* Tag 1: Top Two Today Fixtures */}
        <div 
          id="tag-top-two-fixtures"
          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono bg-blue-600 text-white shrink-0">
              <Sparkles className="w-3 h-3 text-blue-200" />
              Top 2 Fixtures
            </span>
            <span className="text-xs font-bold text-[var(--text)] leading-snug break-words">
              {tags.topTwoFixtures}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('topTwo', tags.topTwoFixtures)}
            title="Copy top two fixtures tag"
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-[var(--border)] text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
          >
            {copiedKey === 'topTwo' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-black">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Copy Tag</span>
              </>
            )}
          </button>
        </div>

        {/* Tag 2: Today Fixtures League Names */}
        <div 
          id="tag-today-leagues"
          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono bg-slate-800 dark:bg-slate-700 text-white shrink-0">
              <Trophy className="w-3 h-3 text-blue-300" />
              Leagues
            </span>
            <span className="text-xs font-bold text-[var(--text)] leading-snug break-words">
              {tags.leagues}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('leagues', tags.leagues)}
            title="Copy leagues tag"
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-[var(--border)] text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
          >
            {copiedKey === 'leagues' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-black">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Copy Tag</span>
              </>
            )}
          </button>
        </div>

        {/* Tag 3: Today Prediction Summary */}
        <div 
          id="tag-today-predictions"
          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono bg-indigo-600 text-white shrink-0">
              <Layers className="w-3 h-3 text-indigo-200" />
              Predictions
            </span>
            <span className="text-xs font-bold text-[var(--text)] leading-snug break-words">
              {tags.predictionsSummary}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('predictions', tags.predictionsSummary)}
            title="Copy predictions breakdown tag"
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-[var(--border)] text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
          >
            {copiedKey === 'predictions' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-black">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Copy Tag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
