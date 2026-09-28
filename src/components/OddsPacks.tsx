import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Smartphone, 
  CheckCircle2, 
  Ticket, 
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { OddsPack } from '../types';

interface OddsPacksProps {
  packs: OddsPack[];
  onOpenPayment: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  userPurchasedItemIds?: string[];
  title?: string;
  subtitle?: string;
}

export default function OddsPacks({
  packs,
  onOpenPayment,
  userPurchasedItemIds = [],
  title,
  subtitle
}: OddsPacksProps) {
  // Always display the 3 core packs in one single line as requested
  const displayPacks = packs.slice(0, 3);

  // Quick stake state for interactive simulator (defaults to 500 KES)
  const [stakes, setStakes] = useState<Record<string, number>>({});

  const handleSelectStake = (packId: string | number, amount: number) => {
    setStakes(prev => ({
      ...prev,
      [String(packId)]: amount
    }));
  };

  const getPackVisuals = (pack: OddsPack) => {
    const slug = pack.slug || '';
    const mult = parseFloat(pack.oddsMinDecimal.replace(/[^0-9.]/g, '')) || 3.0;

    if (mult < 4.0 || slug.includes('3plus') || pack.riskLevel === 'Conservative') {
      return {
        accentGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
        badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        glowRing: 'border-emerald-500/30 hover:border-emerald-500/70 hover:shadow-xs',
        barColor: 'bg-emerald-500',
        tagText: 'SAFE BANKER',
        winRate: 91,
        riskColor: 'text-emerald-600 dark:text-emerald-400',
        isBestValue: false
      };
    }
    if (mult < 6.5 || slug.includes('5plus') || pack.riskLevel === 'Balanced') {
      return {
        accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
        badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
        glowRing: 'border-blue-500/50 hover:border-blue-500/80 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/5',
        barColor: 'bg-blue-600',
        tagText: 'BEST VALUE',
        winRate: 84,
        riskColor: 'text-blue-600 dark:text-blue-400',
        isBestValue: true
      };
    }
    return {
      accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      glowRing: 'border-amber-500/30 hover:border-amber-500/70 hover:shadow-xs',
      barColor: 'bg-amber-500',
      tagText: 'HIGH YIELD',
      winRate: 76,
      riskColor: 'text-amber-600 dark:text-amber-400',
      isBestValue: false
    };
  };

  return (
    <section 
      id="odds-packs" 
      aria-label="Cheerplex Daily Odds Packs"
      className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4 sm:space-y-5 relative overflow-hidden w-full"
    >
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm ring-2 ring-blue-400/30">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight uppercase text-[var(--text)] font-display">
                {title || "Cheerplex Odds Packs"}
              </h2>
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                STATISTICALLY CALIBRATED
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
              {subtitle || "Get multi-bet for best target odds."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 self-start sm:self-auto shrink-0">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[var(--border)] font-bold">SportPesa</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[var(--border)] font-bold">Betika</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[var(--border)] font-bold">Mozzart</span>
        </div>
      </div>

      {/* 2. THE THREE ODDS PACKS IN ONE LINE ONLY (COMPACT & FULL WIDTH) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full items-stretch">
        {displayPacks.map((pack) => {
          const isPurchased = userPurchasedItemIds.includes(String(pack.id)) || userPurchasedItemIds.includes(pack.slug);
          const visuals = getPackVisuals(pack);
          const currentStake = stakes[String(pack.id)] || 500;
          const multiplierNum = parseFloat(pack.oddsMinDecimal.replace(/[^0-9.]/g, '')) || 3.0;
          const estimatedPayout = Math.round(currentStake * multiplierNum);

          return (
            <div 
              key={pack.id}
              className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border bg-[var(--card)] transition-all duration-200 overflow-hidden text-left h-full ${visuals.glowRing}`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${visuals.accentGradient}`} />

              <div className="p-4 sm:p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Tag & Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${visuals.badgeBg}`}>
                      {pack.tag || visuals.tagText}
                    </span>
                    {visuals.isBestValue && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                        HOT PICK
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[var(--text)] tracking-tight font-display">
                    {pack.name}
                  </h3>
                </div>

                {/* Target Multiplier Showcase */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-[var(--border)] flex items-center justify-between gap-2 my-1">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold tracking-wider">
                      Target Multiplier
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text)] tabular-nums">
                        {pack.oddsMinDecimal}x
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">Odds</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold tracking-wider">
                      Confidence
                    </span>
                    <span className={`text-xs font-mono font-bold ${visuals.riskColor}`}>
                      {visuals.winRate}% Verified
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      {pack.picksPerDay} Curated Legs
                    </span>
                  </div>
                </div>

                {/* Compact Interactive Payout Simulator */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500 text-[10px]">Stake:</span>
                    <div className="flex items-center gap-1">
                      {[200, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectStake(pack.id, amt)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            currentStake === amt
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-[var(--border)] hover:text-[var(--text)]'
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] font-mono text-xs">
                    <span className="text-slate-400 text-[10px]">Est. Return:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      KES {estimatedPayout.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button Footer */}
              <div className="p-4 sm:p-4.5 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenPayment(pack.name, pack.price, pack.id, pack.slug, 'odds')}
                  className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-[0.98] border-none shadow-xs ${
                    isPurchased
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isPurchased ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Slip Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Get Odds Slip • KES {pack.price}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  )}
                </button>
                <div className="text-center mt-1.5">
                  <span className="text-[9.5px] font-mono text-slate-400">
                    Dispatched via SMS in &lt; 60 seconds
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. COMPACT DISPATCH PROTOCOL */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[var(--text-muted)]">
            Every Odds Pack SMS includes direct SportPesa, Betika, and Mozzart Bet slip booking codes.
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-blue-600 dark:text-blue-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Automated Daily Dispatch</span>
        </div>
      </div>
    </section>
  );
}
