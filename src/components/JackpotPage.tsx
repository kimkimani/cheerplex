import { useState, useEffect, useMemo, memo } from 'react';
import { 
  Trophy, 
  Clock, 
  Users, 
  Lock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  BookmarkCheck,
  Smartphone,
  ArrowLeft,
  Home,
  ChevronRight,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { JackpotConfig, jackpotsData } from '../jackpotsData';
import { getPageUrl } from '../utils/navigation';
import { calculateProbabilities, getRefinedConfidence } from '../utils/probability';
import { isDoubleChanceTip } from '../utils/topJackpotFixtures';
import VotePoll from './VotePoll';
import VoteNudgeSnippet from './VoteNudgeSnippet';
import FaqSection from './FaqSection';
import { getMarkdownContent } from '../content/markdownLoader';
import MarkdownRenderer from './MarkdownRenderer';
import { FlagImage, resolveFixtureCountry } from '../utils/flagUtils';
import { AuthorCard } from './AuthorCard';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import { formatTime, formatMatchDateTime, formatJackpotStartTimeString } from '../utils/timeUtils';
import InboundLinksBlock from './InboundLinksBlock';
import JackpotCountdownTimer, { getNextUpcomingKickoff } from './JackpotCountdownTimer';
import { getJackpotDetailedTiming } from '../utils/jackpotDateShifter';
import { evaluateTipResult } from '../utils/jackpotResultsEvaluator';

interface JackpotPageProps {
  jackpot: JackpotConfig;
  hasPaid: boolean;
  onOpenPayment: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  onBackToList?: () => void;
  onSelectPage?: (page: string) => void;
  pageId?: string;
  isLoading?: boolean;
}

export function JackpotShimmerLoader({ count = 10 }: { count?: number }) {
  return (
    <div className="divide-y divide-[var(--border)]">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-3.5 grid grid-cols-12 items-center gap-4 animate-pulse">
          <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0 font-mono text-xs flex items-center justify-center font-bold text-slate-400">
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
              </div>
              <div className="h-2.5 w-24 bg-blue-500/20 rounded" />
              <div className="space-y-1.5">
                <div className="h-7 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl w-full" />
                <div className="h-7 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl w-full" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 grid grid-cols-3 gap-1.5">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>

          <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-2">
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-8 w-8 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JackpotPage({ jackpot, hasPaid, onOpenPayment, onBackToList, onSelectPage, pageId, isLoading = false }: JackpotPageProps) {
  const [expandedFixture, setExpandedFixture] = useState<number | null>(null);
  const pageMd = getMarkdownContent(pageId || jackpot.id);

  // Compute detailed timing and statuses directly from first and last kickoff fixtures
  const detailedTiming = useMemo(() => getJackpotDetailedTiming(jackpot), [jackpot]);
  const earliestTime = detailedTiming.earliestDate ? detailedTiming.earliestDate.getTime() : null;
  const latestTime = detailedTiming.latestDate ? detailedTiming.latestDate.getTime() : null;
  const effectiveKickoffTime = earliestTime || getNextUpcomingKickoff(jackpot.id);
  const hasStarted = detailedTiming.status === 'started' || detailedTiming.status === 'ended';
  const hasEnded = detailedTiming.status === 'ended';

  // Memoize fixtures data with precalculated probabilities
  const processedFixtures = useMemo(() => {
    const rawList = jackpot.fixtures || (jackpot as any).games || [];
    return rawList.map((match: any) => {
      const isDoubleChance = match.prediction?.toLowerCase().includes('double chance') || 
                             match.prediction?.toLowerCase().includes('1x') || 
                             match.prediction?.toLowerCase().includes('x1') || 
                             match.prediction?.toLowerCase().includes('x2') || 
                             match.prediction?.toLowerCase().includes('2x') || 
                             match.prediction?.toLowerCase().includes('12') ||
                             match.prediction?.toLowerCase().includes('21');

      const displayConf = getRefinedConfidence(match);
      const jackpotProbs = calculateProbabilities(
        match.prediction,
        displayConf,
        match.probabilities || match
      );

      const tipEval = evaluateTipResult(
        match.prediction,
        match.homeScore,
        match.awayScore,
        match.status,
        match.result
      );

      return {
        ...match,
        isDoubleChance,
        displayConf,
        jackpotProbs,
        tipEval
      };
    });
  }, [jackpot.fixtures]);

  const [fixtureFilter, setFixtureFilter] = useState<'all' | 'dc'>('all');

  const doubleChanceCount = useMemo(() => {
    return processedFixtures.filter(f => f.isDoubleChance || isDoubleChanceTip(f.prediction)).length;
  }, [processedFixtures]);

  const displayedFixtures = useMemo(() => {
    if (fixtureFilter === 'dc') {
      return processedFixtures.filter(f => f.isDoubleChance || isDoubleChanceTip(f.prediction));
    }
    return processedFixtures;
  }, [processedFixtures, fixtureFilter]);

  const toggleExpand = (id: number) => {
    setExpandedFixture(expandedFixture === id ? null : id);
  };

  const getInitials = (teamName: string) => {
    if (!teamName) return '';
    const cleanName = teamName.replace(/FC|United|City|Town|Hotspur|Albion|Athletic|Real|Deportivo/gi, '').trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  // Slip metrics for unlocked slip view
  const isOptionPicked = (prediction: string, option: '1' | 'X' | '2'): boolean => {
    const norm = prediction.toLowerCase();
    
    // Check for Double Chance patterns
    if (norm.includes('1x') || norm.includes('x1') || norm.includes('(1x)') || norm.includes('(x1)')) {
      return option === '1' || option === 'X';
    }
    if (norm.includes('x2') || norm.includes('2x') || norm.includes('(x2)') || norm.includes('(2x)')) {
      return option === 'X' || option === '2';
    }
    if (norm.includes('12') || norm.includes('21') || norm.includes('(12)') || norm.includes('(21)')) {
      return option === '1' || option === '2';
    }
    
    // Single options
    if (option === '1') {
      return norm.includes('(1)') || norm.includes('home win') || norm === '1';
    }
    if (option === 'X') {
      return norm.includes('(x)') || norm.includes('draw') || norm === 'x';
    }
    if (option === '2') {
      return norm.includes('(2)') || norm.includes('away win') || norm === '2';
    }
    
    return false;
  };

  const getSlipSummary = () => {
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;

    (jackpot.fixtures || (jackpot as any).games || []).forEach((f) => {
      const pred = f.prediction.toLowerCase();
      if (pred.includes('1x') || pred.includes('x1') || pred.includes('(1x)') || pred.includes('(x1)')) {
        homeWins++;
        draws++;
      } else if (pred.includes('x2') || pred.includes('2x') || pred.includes('(x2)') || pred.includes('(2x)')) {
        draws++;
        awayWins++;
      } else if (pred.includes('12') || pred.includes('21') || pred.includes('(12)') || pred.includes('(21)')) {
        homeWins++;
        awayWins++;
      } else if (pred.includes('(1)') || pred.includes('home win') || pred === '1') {
        homeWins++;
      } else if (pred.includes('(x)') || pred.includes('draw') || pred === 'x') {
        draws++;
      } else if (pred.includes('(2)') || pred.includes('away win') || pred === '2') {
        awayWins++;
      }
    });

    return { homeWins, draws, awayWins };
  };

  const slipSummary = getSlipSummary();

  return (
    <div className="space-y-6 text-left">
      {/* Top Breadcrumb and Back Navigation - Hidden on Mobile */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono overflow-x-auto scrollbar-none py-1">
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                if (onSelectPage) onSelectPage('home');
              }
            }}
            className="hover:text-[var(--text)] transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <a
            href="/jackpot-tips"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                if (onBackToList) onBackToList();
                else if (onSelectPage) onSelectPage('jackpot-list');
              }
            }}
            className="hover:text-[var(--text)] transition-colors no-underline cursor-pointer font-semibold"
          >
            Jackpot Predictions
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span className="text-[var(--text)] font-bold truncate max-w-[200px] md:max-w-[320px]" aria-current="page">
            {jackpot.name || pageMd.displayTitle}
          </span>
        </nav>

        {onBackToList && (
          <button 
            onClick={onBackToList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:text-[var(--primary)] bg-slate-100 dark:bg-slate-900 border border-[var(--border)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>All Jackpots</span>
          </button>
        )}
      </div>

      {/* 1. OVERHAULED JACKPOT COMMAND COCKPIT (HERO + TELEMETRY HUD + ACTION + TACTICAL STRATEGY) */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--border)] bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-5 sm:p-7 md:p-8 shadow-[var(--shadow)] space-y-6 text-left">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1.1 TOP TELEMETRY STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Algorithm V4.2 Slip
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[var(--border)]">
              <Trophy className="w-3 h-3 text-amber-500" />
              {jackpot.gamesCount} Matches
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${detailedTiming.statusBadge.badgeClass}`}>
              {detailedTiming.statusBadge.badgeText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant M-Pesa STK Push
            </span>
          </div>
        </div>

        {/* 1.2 MAIN TITLE & ALGORITHMIC SUBTITLE */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text)] tracking-tight uppercase font-display leading-[1.1]">
            {pageMd.displayTitle || pageMd.title || `${jackpot.name} Mathematical Predictions`}
          </h1>
          {pageMd.introParagraph ? (
            <div className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed font-normal">
              <MarkdownRenderer content={pageMd.introParagraph} />
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed font-sans">
              {pageMd.description || `Algorithmically optimized coupon with calibrated 1X2 probabilities, score variance distributions, and multi-tier bonus safety parameters for all ${jackpot.gamesCount} matches.`}
            </p>
          )}
        </div>

        {/* 1.3 4-METRIC TELEMETRY HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 relative z-10 pt-1">
          {/* METRIC 1: ESTIMATED CASH POOL */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-200/80 dark:border-blue-900/60 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400">
              <span>Cash Pool</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-tight mt-1 truncate">
              {jackpot.estimatedPool}
            </p>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Grand Prize Target</span>
          </div>

          {/* METRIC 2: OFFICIAL BOOKIE ENTRY */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-[var(--border)] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400">
              <span>Bookie Entry</span>
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-lg sm:text-xl font-black font-mono text-[var(--text)] tracking-tight mt-1">
              {jackpot.entryFee || 'KES 99'}
            </p>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Standard Stake</span>
          </div>

          {/* METRIC 3: FIRST KICKOFF */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-[var(--border)] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400">
              <span>First Kickoff</span>
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 truncate">
              {detailedTiming.formattedEarliest}
            </p>
            {detailedTiming.firstFixture ? (
              <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
                #{detailedTiming.firstFixture.position} {detailedTiming.firstFixture.homeTeam}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Opening Match</span>
            )}
          </div>

          {/* METRIC 4: FINAL DECIDER */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-[var(--border)] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400">
              <span>Final Leg</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <p className="text-xs sm:text-sm font-black font-mono text-slate-800 dark:text-slate-200 tracking-tight mt-1 truncate">
              {detailedTiming.formattedLatest}
            </p>
            {detailedTiming.lastFixture ? (
              <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
                #{detailedTiming.lastFixture.position} {detailedTiming.lastFixture.homeTeam}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Closing Decider</span>
            )}
          </div>
        </div>

        {/* 1.4 INTEGRATED M-PESA STK SLIP ACTIVATION ENGINE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-transparent border border-blue-300 dark:border-blue-800/80 relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                Instant Access
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--text)]">
                {pageMd.unlockHeading || `Unlock All ${jackpot.gamesCount} Fixture Predictions & Double Chance Slips`}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed font-sans">
              {pageMd.unlockDescription || `Subscribe to get instant access to full 1X2 selections, banker probability rankings, and low-variance double-chance covers for ${jackpot.name}.`}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                100% Calibrated Slips
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Sub-Combo Bonuses
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                SMS Confirmation
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col sm:items-end justify-between items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Ticket Price</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[var(--text)] block leading-none mt-0.5">
                KES {jackpot.price}
              </span>
            </div>
            <button 
              onClick={() => onOpenPayment(jackpot.name, jackpot.price, jackpot.id, jackpot.slug, 'jackpot')}
              className="min-h-[46px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>Get Full Slip • KES {jackpot.price}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMPACT DYNAMIC LIVE TIMER BAR */}
      <JackpotCountdownTimer 
        jackpotId={jackpot.id}
        fixtures={jackpot.fixtures}
        earliestTime={earliestTime}
        latestTime={latestTime}
        hasStarted={hasStarted}
        hasEnded={hasEnded}
        nextGameStartTime={jackpot.nextGameStartTime}
        submissionsFill={jackpot.submissionsFill}
        premiumCount={jackpot.premiumCount}
      />

      {/* 3. SLIP SUMMARY QUICK STATS PANEL (If Unlocked) */}
      {hasPaid && (
        <div 
          className="p-3.5 rounded-[var(--radius)] bg-slate-50 dark:bg-slate-900/20 border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <BookmarkCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-[var(--text)] leading-tight font-display">
                Mathematical Coupon Overview
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">
                Optimized balanced ratio for maximum payout coverage.
              </p>
            </div>
          </div>

          <div className="flex gap-2 text-[10px] font-mono font-bold uppercase">
            <span className="px-2.5 py-1.5 bg-sky-100 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 text-slate-950 dark:text-slate-100 rounded-lg">
              {slipSummary.homeWins} Home Wins
            </span>
            <span className="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-slate-950 dark:text-slate-100 rounded-lg">
              {slipSummary.draws} Draws
            </span>
            <span className="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-slate-950 dark:text-slate-100 rounded-lg">
              {slipSummary.awayWins} Away Wins
            </span>
          </div>
        </div>
      )}

      {/* 4. CHEERPLEX JACKPOT MASTER SLIP MATRIX */}
      <div className="space-y-4">
        {/* Section Header with listTitle & listSubtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-[var(--border)] text-left">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--text)] uppercase font-display tracking-tight">
              {pageMd.listTitle || `${jackpot.name} Fixtures & Selections`}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {pageMd.listSubtitle || `Complete ${processedFixtures.length}-match coupon analysis with calibrated 1X2 win probabilities and double-chance hedges.`}
            </p>
          </div>
        </div>

        {/* Filter Tag Header Bar: All Games vs Double Chance */}
        <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFixtureFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                fixtureFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
              }`}
            >
              All Matches ({processedFixtures.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setFixtureFilter(f => f === 'dc' ? 'all' : 'dc');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                fixtureFilter === 'dc'
                  ? 'bg-blue-600 text-white font-black shadow-xs'
                  : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50'
              }`}
            >
              <span>⚡ Double Chance</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">
                {doubleChanceCount}
              </span>
            </button>
          </div>
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
            Showing {displayedFixtures.length} of {processedFixtures.length} Matches
          </span>
        </div>

        {/* List of Modular Slip Cards */}
        <div className="space-y-3.5">
          {isLoading ? (
            <JackpotShimmerLoader count={jackpot.gamesCount || 10} />
          ) : displayedFixtures.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              {fixtureFilter === 'dc' 
                ? 'No fixtures with double chance predictions found for this jackpot.'
                : 'No jackpot fixtures available for this selection.'}
            </div>
          ) : (
            displayedFixtures.map((match, idx) => {
              const totalGames = processedFixtures.length || jackpot.gamesCount || 17;
              const freeCutoff = Math.round((totalGames * 2) / 3);
              const matchIndex = match.fixtureNumber ? match.fixtureNumber - 1 : idx;
              const isUnlocked = hasPaid || matchIndex < freeCutoff;
              const isExpanded = expandedFixture === match.id;
              const isDoubleChance = match.isDoubleChance;
              const displayConf = match.displayConf;
              const jackpotProbs = match.jackpotProbs;
              const country = resolveFixtureCountry(match);
              const tipEval = match.tipEval;

              const getInitials = (name: string) => {
                if (!name) return 'FC';
                const words = name.replace(/FC|United|City|Town|Hotspur|Albion|Athletic|Real|Deportivo/gi, '').trim().split(/\s+/);
                if (words.length >= 2 && words[0] && words[1]) {
                  return (words[0][0] + words[1][0]).toUpperCase();
                }
                return name.slice(0, 3).toUpperCase();
              };

              return (
                <div 
                  key={`jp-match-${jackpot.id}-${match.id ?? match.gameNumber ?? idx}-${idx}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden text-left bg-[var(--card)] ${
                    isExpanded 
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20' 
                      : 'border-[var(--border)] hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  {/* Top Header Strip */}
                  <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-[var(--border)] flex items-center justify-between gap-3 text-xs flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 ${
                        isUnlocked ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}>
                        #{match.fixtureNumber}
                      </div>
                      <FlagImage countryFlag={match.countryFlag || (match as any).country_flag} flag={match.leagueFlag} countryName={country} />
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {match.leagueName || (match as any).league_name || 'League'}
                        </span>
                        <span className="text-slate-400 text-[10px]">•</span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {country}
                        </span>
                      </div>
                    </div>

                    {/* Kickoff, Status & Tip Outcome */}
                    <div className="flex items-center gap-2 shrink-0 font-mono flex-wrap">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{match.kickoffTime || match.date || match.time}</span>
                      </div>

                      {match.status === 'LIVE' ? (
                        <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" /> LIVE
                        </span>
                      ) : match.status === 'HT' ? (
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[10px]">
                          HT
                        </span>
                      ) : (match.status === 'FT' || tipEval.isSettled) ? (
                        <span className="px-2 py-0.5 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded text-[10px] inline-flex items-center gap-1">
                          <span>FT</span>
                          {tipEval.isWon ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400/40 dark:text-slate-500/40 stroke-[1.5]" />
                          )}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold rounded-full text-[10px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span>Voting Open</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Arena (Home Team vs Away Team) - Clean & Minimalistic */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                      
                      {/* Home Team */}
                      <div className="col-span-5 min-w-0 text-left">
                        <h3 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight truncate leading-snug">
                          {match.homeTeam}
                        </h3>
                        <span className="text-[9.5px] font-mono uppercase text-slate-400 block mt-0.5">
                          Home
                        </span>
                      </div>

                      {/* Scoreboard / VS Node */}
                      <div className="col-span-2 flex flex-col items-center justify-center text-center">
                        {match.status === 'FT' || match.status === 'LIVE' || match.status === 'HT' ? (
                          <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-mono font-black text-sm sm:text-base tracking-wider shadow-xs border border-slate-700">
                            {match.homeScore ?? (match.status === 'NS' ? '-' : '1')} : {match.awayScore ?? (match.status === 'NS' ? '-' : '0')}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                              VS
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="col-span-5 min-w-0 text-right">
                        <h3 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight truncate leading-snug">
                          {match.awayTeam}
                        </h3>
                        <span className="text-[9.5px] font-mono uppercase text-slate-400 block mt-0.5">
                          Away
                        </span>
                      </div>

                    </div>

                    {/* Algorithmic Slip Action Bar */}
                    {isUnlocked ? (
                      <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-[var(--border)] space-y-2.5">
                        <div className="flex items-center justify-between gap-1.5 sm:gap-3 text-xs flex-wrap">
                          {/* Pick Pill */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-xs shrink-0">
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Pick:</span>
                            <span className="tracking-wide uppercase font-black">{match.prediction}</span>
                          </div>

                          {/* Confidence with % value */}
                          <div className="flex items-center gap-1 text-[11px] font-mono shrink-0">
                            <span className="text-slate-400 uppercase text-[10px]">Confidence:</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-xs">
                              {displayConf}%
                            </span>
                          </div>

                          {/* Intel Button */}
                          <button
                            type="button"
                            onClick={() => toggleExpand(match.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border shrink-0 ${
                              isExpanded
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[var(--border)] hover:border-blue-400'
                            }`}
                          >
                            <span>Intel</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Probability gauge */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            <span>1 (Home): {jackpotProbs.home}%</span>
                            <span>X (Draw): {jackpotProbs.draw}%</span>
                            <span>2 (Away): {jackpotProbs.away}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-600" style={{ width: `${jackpotProbs.home}%` }} />
                            <div className="h-full bg-indigo-600" style={{ width: `${jackpotProbs.draw}%` }} />
                            <div className="h-full bg-amber-500" style={{ width: `${jackpotProbs.away}%` }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">
                              VIP Banker Pick Reserved
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] font-sans">
                              Unlock match {match.fixtureNumber} mathematical prediction and safety double-chance hedge.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => onOpenPayment(jackpot.name, jackpot.price, jackpot.id, jackpot.slug, 'jackpot')}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border-none"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock Slip • KES {jackpot.price}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExpand(match.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                              isExpanded 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[var(--border)] hover:border-blue-400'
                            }`}
                          >
                            {isExpanded ? 'Hide' : 'Info'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ADOPTED NEW VOTES UI: Prominent on every Jackpot Fixture */}
                  <div className="border-t border-[var(--border)] bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="hidden md:block px-5 py-3.5">
                      <VotePoll 
                        fixtureId={match.fixtureId || `jackpot_${jackpot.id}_${match.id}`} 
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                        prediction={match.prediction}
                        isEnded={tipEval.isSettled || match.status === 'FT' || match.status === 'FINISHED' || match.result === 'won' || match.result === 'lost'}
                        status={match.status}
                        result={match.result}
                        variant="desktop-row"
                      />
                    </div>
                    <div className="md:hidden px-3.5 py-2.5">
                      <VotePoll 
                        fixtureId={match.fixtureId || `jackpot_${jackpot.id}_${match.id}`} 
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                        prediction={match.prediction}
                        isEnded={tipEval.isSettled || match.status === 'FT' || match.status === 'FINISHED' || match.result === 'won' || match.result === 'lost'}
                        status={match.status}
                        result={match.result}
                        variant="mobile"
                      />
                    </div>
                  </div>

                  {/* Expanded Tactical Intel */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/60 border-t border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Cheerplex Analytical Breakdown</span>
                        </div>
                        <span className="text-[10.5px] font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-[var(--border)]">
                          Confidence Index: {displayConf}/100
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                        {match.aiAnalysis || "Mathematical equations evaluate offensive conversion efficiency and defensive solidity to determine optimum jackpot hedge selections."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. CHEERPLEX EDITORIAL ANALYSIS & QUANTITATIVE STRATEGY */}
      {(pageMd.sectionTitle || pageMd.sectionDescription || pageMd.analysis || pageMd.meat) && (
        <section aria-label="Editorial Analysis" className="p-6 md:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4">
          <div className="space-y-1 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm sm:text-base font-black uppercase text-[var(--text)] tracking-tight font-display">
                {pageMd.sectionTitle || "Cheerplex Jackpot Combinatorics & Modeling"}
              </h2>
            </div>
            {pageMd.sectionDescription && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {pageMd.sectionDescription}
              </p>
            )}
          </div>
          {(pageMd.analysis || pageMd.meat) && (
            <MarkdownRenderer content={pageMd.analysis || pageMd.meat} fixtures={jackpot.fixtures} jackpotId={jackpot.id} />
          )}
        </section>
      )}

      {/* 7. CONTEXTUAL INBOUND LINKS (OTHER KENYAN JACKPOTS) */}
      <InboundLinksBlock 
        pageId={pageId || jackpot.id} 
        rawType={pageMd.type} 
        jackpotId={pageMd.jackpotId || jackpot.id} 
      />

      {/* 8. AUTHOR CARD */}
      {pageMd && (pageMd.author || pageMd.authorName) && (
        <AuthorCard 
          authorId={pageMd.authorId}
          author={pageMd.author}
          name={pageMd.authorName} 
          title={pageMd.authorTitle} 
          description={pageMd.authorDescription} 
          avatar={pageMd.authorAvatar} 
        />
      )}

      {/* 9. RESPONSIBLE GAMBLING NOTICE */}
      <ResponsibleGamblingNotice notice={pageMd?.responsibleGambling} />

      {/* 6. FREQUENTLY ASKED QUESTIONS (MARKDOWN EDITABLE) */}
      <FaqSection pageId={pageId || jackpot.id} />
    </div>
  );
}

