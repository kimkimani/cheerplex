import React, { useState, useMemo } from 'react';
import { Flame, Check, Copy } from 'lucide-react';
import { Fixture } from '../types';
import { getBankerEstimatedOdds } from '../utils/bankerUtils';
import { getRefinedConfidence } from '../utils/probability';
import { formatTipLabel } from '../utils/todayFixturesTags';

export interface CuratedAccumulatorProps {
  fixtures: Fixture[];
  title?: string;
  categoryLabel?: string;
  className?: string;
}

export const CuratedAccumulatorCard: React.FC<CuratedAccumulatorProps> = ({
  fixtures,
  title,
  categoryLabel = 'Free Tips',
  className = ''
}) => {
  const [accaCopied, setAccaCopied] = useState(false);

  const topThreeAccumulator = useMemo(() => {
    if (!fixtures || fixtures.length === 0) return [];
    const seen = new Set<string>();
    const unique = fixtures.filter(f => {
      if (!f || f.status === 'FT' || !f.prediction) return false;
      const key = String(f.id ?? f.fixtureRef ?? `${f.homeTeam}-${f.awayTeam}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique
      .sort((a, b) => getRefinedConfidence(b) - getRefinedConfidence(a))
      .slice(0, 3);
  }, [fixtures]);

  const accumulatorCombinedOdds = useMemo(() => {
    if (topThreeAccumulator.length === 0) return '0.00';
    const total = topThreeAccumulator.reduce((acc, f) => {
      const oddVal = parseFloat(getBankerEstimatedOdds(f));
      return acc * (isNaN(oddVal) ? 1.55 : oddVal);
    }, 1);
    return total.toFixed(2);
  }, [topThreeAccumulator]);

  if (topThreeAccumulator.length < 3) {
    return null;
  }

  const handleCopyAccumulator = () => {
    const lines = topThreeAccumulator.map((f, idx) => {
      const odds = getBankerEstimatedOdds(f);
      const tip = formatTipLabel(f.prediction);
      return `${idx + 1}. ${f.homeTeam} vs ${f.awayTeam} — Pick: ${tip} (@${odds})`;
    });

    const slipText = `CHEERPLEX CURATED 3-MATCH ACCUMULATOR\nTotal Odds: ${accumulatorCombinedOdds}x\n\n${lines.join('\n')}\n\nVia Cheerplex.co.ke`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(slipText);
    }
    setAccaCopied(true);
    setTimeout(() => setAccaCopied(false), 2000);
  };

  const displayTitle = title || `Curated 3-Match ${categoryLabel} Accumulator`;

  return (
    <section 
      aria-label="Curated Market Accumulator" 
      className={`p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left transition-all relative ${className}`}
    >
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Daily Banker Slip</span>
            <span>·</span>
            <span>3 Selections</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight font-display">
            {displayTitle}
          </h3>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Total Odds</span>
            <span className="text-base sm:text-lg font-black font-mono text-blue-600 dark:text-blue-400 tabular-nums">
              {accumulatorCombinedOdds}x
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyAccumulator}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-2xs active:scale-95 shrink-0"
          >
            {accaCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{accaCopied ? 'Copied!' : 'Copy Slip'}</span>
          </button>
        </div>
      </div>

      {/* 3 Match Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3">
        {topThreeAccumulator.map((fix, idx) => {
          const odds = getBankerEstimatedOdds(fix);
          const tip = formatTipLabel(fix.prediction);
          return (
            <div 
              key={`curated-acca-${fix.id ?? fix.fixtureRef ?? idx}-${idx}`} 
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] truncate block">
                    {fix.leagueName || 'League'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/40">
                    @{odds}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)] leading-snug">
                  <div className="truncate">{fix.homeTeam}</div>
                  <div className="truncate text-[var(--text-muted)]">{fix.awayTeam}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] font-mono">
                <span className="text-[var(--text-muted)] text-[10px] uppercase">Pick:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/50">
                  {tip}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedAccumulatorCard;
