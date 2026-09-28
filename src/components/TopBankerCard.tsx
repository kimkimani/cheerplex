import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Flame, 
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Fixture } from '../types';
import { 
  getTopBankerOfTheDay, 
  getBankerEstimatedOdds,
  subscribeToBanker,
  fetchLiveDatabaseBanker,
  isPopularFixture
} from '../utils/bankerUtils';
import { getRefinedConfidence } from '../utils/probability';
import { formatTipLabel } from '../utils/todayFixturesTags';

export interface TopBankerCardProps {
  fixtures?: Fixture[] | null;
  variant?: 'hero' | 'banner' | 'sidebar' | 'minimal';
  onSelectFixture?: (fixture: Fixture) => void;
  onExploreMore?: () => void;
  className?: string;
}

export const TopBankerCard: React.FC<TopBankerCardProps> = ({
  fixtures,
  variant = 'hero',
  onSelectFixture,
  onExploreMore,
  className = ''
}) => {
  const [banker, setBanker] = useState<Fixture | null>(() => getTopBankerOfTheDay(fixtures));

  useEffect(() => {
    // Re-resolve when fixtures prop changes
    const resolved = getTopBankerOfTheDay(fixtures);
    if (resolved) {
      setBanker(resolved);
    }
  }, [fixtures]);

  useEffect(() => {
    // Subscribe to live database updates
    const unsubscribe = subscribeToBanker((updatedBanker) => {
      if (updatedBanker) {
        setBanker(updatedBanker);
      }
    });

    // Proactively fetch live database banker if currently missing
    fetchLiveDatabaseBanker().then((b) => {
      if (b) setBanker(b);
    }).catch(() => {});

    return unsubscribe;
  }, []);

  if (!banker) {
    return null;
  }

  const isPopular = isPopularFixture(banker);
  const confidence = Number(banker.confidence) || getRefinedConfidence(banker);
  const odds = getBankerEstimatedOdds(banker);
  const tipText = formatTipLabel(banker.prediction);
  const kickoffFormatted = (() => {
    if (!banker.kickoffTime) return '17:30';
    try {
      const timeStr = banker.kickoffTime.includes('T') ? banker.kickoffTime : banker.kickoffTime.replace(' ', 'T');
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return banker.kickoffTime;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '17:30';
    }
  })();

  // 1. HERO SHOWCASE VARIANT (Used on Homepage Hero)
  if (variant === 'hero') {
    return (
      <div 
        className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-500/30 shadow-xl relative overflow-hidden transition-all hover:border-blue-400/50 ${className}`}
      >
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Tag */}
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-blue-800/60">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10.5px] font-mono font-black uppercase tracking-wider border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>TOP BANKER OF THE DAY</span>
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{kickoffFormatted}</span>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="py-4 sm:py-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-blue-200/80 font-mono">
            <span className="truncate max-w-[60%]">{banker.leagueName || (banker.leagueCountry ? `${banker.leagueCountry} League` : 'Football Match')}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Kickoff {kickoffFormatted}</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 text-left min-w-0">
              <div className="font-black text-base sm:text-lg text-white tracking-tight truncate">
                {banker.homeTeam}
              </div>
              <span className="text-[10.5px] text-blue-300/80 font-mono block mt-0.5">
                Home Form
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-blue-900/60 border border-blue-700/60 font-mono font-black text-xs text-blue-200 shrink-0">
              VS
            </div>

            <div className="flex-1 text-right min-w-0">
              <div className="font-black text-base sm:text-lg text-white tracking-tight truncate">
                {banker.awayTeam}
              </div>
              <span className="text-[10.5px] text-blue-300/80 font-mono block mt-0.5">
                Away Form
              </span>
            </div>
          </div>

          {/* Calibrated Model Output Box */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/70 border border-blue-900/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">
                Pick
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <strong className="text-sm sm:text-base font-black text-white font-mono">
                  {tipText}
                </strong>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  @ {odds}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-wider block">
                Confidence
              </span>
              <strong className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                {confidence}%
              </strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onExploreMore && (
          <button
            type="button"
            onClick={onExploreMore}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-md"
          >
            <span>View All Today's Verified Selections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // 2. BANNER VARIANT (Used on Category and Odds Pages)
  if (variant === 'banner') {
    return (
      <div 
        className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-950/90 to-slate-900 border border-blue-500/30 text-white shadow-lg relative overflow-hidden ${className}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
                  TOP BANKER OF THE DAY
                </span>
                <span className="text-[9.5px] font-mono text-slate-400">•</span>
                <span className="text-[10px] font-mono text-slate-300">
                  {banker.leagueName}
                </span>
                <span className="text-[9.5px] font-mono text-slate-400">•</span>
                <span className="text-[10px] font-mono text-blue-300">
                  {kickoffFormatted}
                </span>
              </div>

              <div className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5 truncate">
                {banker.homeTeam} vs {banker.awayTeam}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-blue-800/40">
            <div className="text-left md:text-right">
              <span className="text-[9.5px] font-mono text-slate-300 uppercase block">
                Pick & Odds
              </span>
              <div className="flex items-center gap-1.5">
                <strong className="text-sm font-black font-mono text-white">
                  {tipText}
                </strong>
                <span className="text-xs font-mono font-bold text-amber-400">
                  @ {odds}
                </span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 font-mono font-bold text-xs text-right">
              <span className="text-[9px] uppercase tracking-wider block text-emerald-300">Confidence</span>
              <span className="font-black text-sm">{confidence}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SIDEBAR VARIANT (Used in LiveUpdates or PredictionsSidebar)
  if (variant === 'sidebar') {
    return (
      <div 
        className={`p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border border-blue-500/30 text-white shadow-md relative overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between gap-1 pb-2.5 mb-2.5 border-b border-blue-800/50">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase text-amber-400">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>TOP BANKER OF THE DAY</span>
          </div>
          <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
            {confidence}% Conf
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-mono text-blue-200/70 flex items-center justify-between">
            <span className="truncate max-w-[65%]">{banker.leagueName}</span>
            <span>{kickoffFormatted}</span>
          </div>

          <div className="font-black text-xs sm:text-sm text-white truncate">
            {banker.homeTeam} vs {banker.awayTeam}
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-blue-900/60 flex items-center justify-between text-xs mt-2">
            <div>
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Pick</span>
              <strong className="text-white font-mono font-bold text-[11px]">{tipText}</strong>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-amber-400 block uppercase">Price</span>
              <strong className="text-amber-300 font-mono font-bold text-[11px]">@ {odds}</strong>
            </div>
          </div>
        </div>

        {onExploreMore && (
          <button
            type="button"
            onClick={onExploreMore}
            className="w-full mt-3 py-1.5 px-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white text-[10px] font-mono font-bold uppercase flex items-center justify-between transition-colors border-none cursor-pointer"
          >
            <span>View Today's Slips</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // 4. MINIMAL INLINE VARIANT
  return (
    <div 
      className={`px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-800/50 text-white flex items-center justify-between gap-2 text-xs font-mono ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-amber-400 font-bold uppercase text-[10px] shrink-0">
          ★ TOP BANKER:
        </span>
        <span className="font-bold truncate text-slate-200">
          {banker.homeTeam} vs {banker.awayTeam}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-blue-300 font-bold">{tipText}</span>
        <span className="text-emerald-400 font-bold">({confidence}%)</span>
      </div>
    </div>
  );
};

export default TopBankerCard;
