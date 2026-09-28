import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Star, 
  Home, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  CheckCircle2,
  Coins,
  Flame,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { jackpotsData, JackpotConfig } from '../jackpotsData';
import { getJackpotDetailedTiming } from '../utils/jackpotDateShifter';
import FaqSection from './FaqSection';
import { getMarkdownContent } from '../content/markdownLoader';
import MarkdownRenderer from './MarkdownRenderer';
import { AuthorCard } from './AuthorCard';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import { FlagImage } from '../utils/flagUtils';
import { sortJackpotsByStatusAndTime } from '../utils/jackpotDateShifter';
import { formatJackpotStartTimeString } from '../utils/timeUtils';
import { getPageUrl } from '../utils/navigation';
import InboundLinksBlock from './InboundLinksBlock';
import JackpotCountdownTimer, { getNextUpcomingKickoff } from './JackpotCountdownTimer';
import { Fixture } from '../types';

interface JackpotListPageProps {
  onSelectJackpot: (jackpotId: string) => void;
  unlockedJackpots: string[];
  hasPaidJackpot: boolean;
  jackpots?: JackpotConfig[];
  fixtures?: Fixture[];
}

export default function JackpotListPage({ 
  onSelectJackpot, 
  unlockedJackpots, 
  hasPaidJackpot,
  jackpots,
  fixtures
}: JackpotListPageProps) {
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'sportpesa' | 'betika' | 'mozzart'>('all');
  
  const listData = sortJackpotsByStatusAndTime(jackpots && jackpots.length > 0 ? jackpots : jackpotsData);
  const pageMd = getMarkdownContent('jackpot-list');

  const filteredJackpots = listData.filter(jp => {
    if (selectedBrand === 'sportpesa') return jp.id.includes('sportpesa');
    if (selectedBrand === 'betika') return jp.id.includes('betika');
    if (selectedBrand === 'mozzart') return jp.id.includes('mozzart');
    return true;
  });

  const getBrandMeta = (id: string) => {
    if (id.includes('sportpesa')) {
      return {
        brand: 'SportPesa',
        badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        accentColor: 'text-blue-600 dark:text-blue-400'
      };
    }
    if (id.includes('betika')) {
      return {
        brand: 'Betika',
        badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        accentColor: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    if (id.includes('mozzart')) {
      return {
        brand: 'Mozzart',
        badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        accentColor: 'text-amber-600 dark:text-amber-400'
      };
    }
    return {
      brand: 'Kenyan Pool',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      accentColor: 'text-blue-600 dark:text-blue-400'
    };
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Breadcrumbs - Hidden on Mobile */}
      <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
        <a
          href="/"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
              e.preventDefault();
              onSelectJackpot('home');
            }
          }}
          className="hover:text-blue-600 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </a>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="text-[var(--text)] font-bold" aria-current="page">
          Jackpot Command Hub
        </span>
      </nav>

      {/* 1. HERO COMMAND HUB BANNER */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Top 5 Kenyan Jackpots
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Live Prize Pools Over KES 600M
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-[var(--text)] tracking-tight uppercase font-display">
              {pageMd.displayTitle || "Cheerplex Verified Kenyan Jackpot Predictions"}
            </h1>
            {pageMd.introParagraph ? (
              <div className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                <MarkdownRenderer content={pageMd.introParagraph} />
              </div>
            ) : (
              <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                {pageMd.description || "Mathematically optimized combinations and double-chance safety locks designed by sports quantitative models. We provide coverage for SportPesa Mega (17), SportPesa Midweek (13), Betika Midweek (15), Mozzart Grand (20), and Mozzart Super Daily (16)."}
              </p>
            )}
          </div>

          {/* Quick Metrics Bento Box */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-[var(--border)] shrink-0 font-mono">
            <div>
              <span className="text-[9.5px] uppercase font-bold text-[var(--text-muted)] block">Bonus Strike Rate</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">84.2%</div>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-[var(--text-muted)] block">Avg Permutations</span>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">3-4 Doubles</div>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-[var(--text-muted)] block">M-Pesa STK</span>
              <div className="text-xs font-bold text-[var(--text)] mt-1">Instant SMS</div>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-[var(--text-muted)] block">Active Pools</span>
              <div className="text-xs font-bold text-[var(--text)] mt-1">{listData.length} Pools Ready</div>
            </div>
          </div>
        </div>

        {/* Brand Filter Buttons */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[var(--border)] font-mono text-xs font-bold">
            {(['all', 'sportpesa', 'betika', 'mozzart'] as const).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize ${
                  selectedBrand === b
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[var(--text)]'
                }`}
              >
                {b === 'all' ? 'All Bookmakers' : b}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
            <span>Showing {filteredJackpots.length} Pools</span>
          </div>
        </div>
      </div>

      {/* 2. POOLS LIST SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-[var(--border)] text-left">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[var(--text)] uppercase font-display tracking-tight">
            {pageMd.listTitle || "Active Kenyan Bookmaker Jackpot Pools"}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {pageMd.listSubtitle || "Calibrated 1X2 win probabilities, double-chance safety locks, and live kickoff schedules."}
          </p>
        </div>
      </div>

      {/* 2. COMPLETELY NEW BENTO JACKPOT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJackpots.map((jackpot) => {
          const brandMeta = getBrandMeta(jackpot.id);
          const isUnlocked = unlockedJackpots.includes(jackpot.id) || hasPaidJackpot;
          const targetUrl = getPageUrl(jackpot.id);
          const timing = getJackpotDetailedTiming(jackpot);

          return (
            <div
              key={jackpot.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--card)] border-2 border-[var(--border)] hover:border-blue-500/80 transition-all duration-300 shadow-md hover:shadow-xl text-left relative group"
            >
              <div className="space-y-4">
                {/* Top Row: Operator Badge, Country, Games, Price */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-[9px] font-black uppercase tracking-wider border ${brandMeta.badge}`}>
                      {brandMeta.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9.5px] font-mono font-bold text-[var(--text-muted)] border border-[var(--border)]">
                      {jackpot.gamesCount} Matches
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-wider ${timing.statusBadge.badgeClass}`}>
                      {timing.statusBadge.badgeText}
                    </span>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shadow-xs">
                    KES {jackpot.price}
                  </div>
                </div>

                {/* Title and Prize Pool Banner */}
                <div>
                  <h3 className="text-lg font-black text-[var(--text)] tracking-tight uppercase font-display group-hover:text-blue-600 transition-colors">
                    {jackpot.name}
                  </h3>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                      Estimated Jackpot Pool:
                    </span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                      {jackpot.estimatedPool}
                    </span>
                  </div>
                </div>

                {/* Live Countdown & Kickoff Schedule */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className={`w-3.5 h-3.5 ${timing.status === 'started' ? 'text-amber-500' : timing.status === 'ended' ? 'text-slate-400' : 'text-blue-500'}`} />
                      {timing.status === 'started' ? 'Matches In Progress:' : timing.status === 'ended' ? 'Pool Concluded:' : 'Kickoff Closes In:'}
                    </span>
                    <JackpotCountdownTimer 
                      jackpotId={jackpot.id}
                      fixtures={jackpot.fixtures}
                      earliestTime={timing.earliestDate?.getTime()}
                      latestTime={timing.latestDate?.getTime()}
                      hasStarted={timing.status === 'started' || timing.status === 'ended'}
                      hasEnded={timing.status === 'ended'}
                      nextGameStartTime={timing.formattedEarliest}
                      digitsOnly={true}
                    />
                  </div>

                  {/* Schedule Window: Earliest & Last Fixtures */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                    {/* Earliest Kickoff / First Match */}
                    <div className="flex items-start justify-between gap-2 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[10px] uppercase text-[var(--text-muted)]">First Match:</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">
                          {timing.formattedEarliest}
                        </span>
                        {timing.firstFixture && (
                          <span className="text-[10px] text-[var(--text-muted)] block truncate max-w-[220px]">
                            #{timing.firstFixture.position} {timing.firstFixture.homeTeam} vs {timing.firstFixture.awayTeam}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last Kickoff / Final Match */}
                    <div className="flex items-start justify-between gap-2 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-[10px] uppercase text-[var(--text-muted)]">Final Match:</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block text-[11px]">
                          {timing.formattedLatest}
                        </span>
                        {timing.lastFixture && (
                          <span className="text-[10px] text-[var(--text-muted)] block truncate max-w-[220px]">
                            #{timing.lastFixture.position} {timing.lastFixture.homeTeam} vs {timing.lastFixture.awayTeam}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] font-mono pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Window Duration:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ~{timing.durationHours}h ({jackpot.gamesCount} Matches)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Links to Jackpot Page */}
              <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center gap-3">
                <a
                  href={targetUrl}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      onSelectJackpot(jackpot.id);
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md no-underline transition-all active:scale-98 border-none"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>View Permutations & Predictions</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial & Strategy Analysis */}
      {(pageMd.sectionTitle || pageMd.sectionDescription || pageMd.middle || pageMd.meat) && (
        <section className="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-md text-left space-y-4">
          <div className="space-y-1 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-black uppercase text-[var(--text)] tracking-tight font-display">
                {pageMd.sectionTitle || "Cheerplex Jackpot Combinatorics & Strategy"}
              </h2>
            </div>
            {pageMd.sectionDescription && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {pageMd.sectionDescription}
              </p>
            )}
          </div>
          {pageMd.middle && (
            <div className="text-xs leading-relaxed text-[var(--text-muted)] pb-3 border-b border-[var(--border)]">
              <MarkdownRenderer content={pageMd.middle} />
            </div>
          )}
          {pageMd.meat && (
            <div className="text-xs leading-relaxed text-[var(--text)]">
              <MarkdownRenderer content={pageMd.meat} />
            </div>
          )}
        </section>
      )}

      {/* Inbound & Related Internal Navigation */}
      <InboundLinksBlock pageId="jackpot-list" onSelectPage={onSelectJackpot} />

      {/* Author Card & Responsible Gambling */}
      {pageMd.authorId && (
        <AuthorCard authorId={pageMd.authorId} author={pageMd.author} name={pageMd.authorName} />
      )}
      <ResponsibleGamblingNotice />
    </div>
  );
}
