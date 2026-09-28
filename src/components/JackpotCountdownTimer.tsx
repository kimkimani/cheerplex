import React, { useState, useEffect, useMemo, memo } from 'react';
import { Clock, Sparkles, Users, Zap, ShieldAlert, Radio, Flame, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Fixture } from '../types';
import { getCachedLiveJackpotFixtures, fetchLiveJackpotFixtures, resolveJackpotId } from '../utils/topJackpotFixtures';
import { jackpotsData } from '../jackpotsData';
import { formatTime, formatMatchDateTime, formatJackpotStartTimeString } from '../utils/timeUtils';
import { getJackpotDetailedTiming } from '../utils/jackpotDateShifter';

export interface JackpotCountdownTimerProps {
  earliestTime?: number | null;
  latestTime?: number | null;
  hasStarted?: boolean;
  hasEnded?: boolean;
  jackpotId?: string;
  fixtures?: Fixture[];
  nextGameStartTime?: string;
  submissionsFill?: string;
  premiumCount?: string;
  className?: string;
  digitsOnly?: boolean;
}

/**
 * Calculates the next upcoming kickoff timestamp (in ms) for a given jackpot ID
 * consistently across the entire site (Jackpot Page, Jackpot List, Sidebars, Cards).
 */
export function getNextUpcomingKickoff(jackpotId: string): number {
  const resolved = resolveJackpotId(jackpotId, 'sportpesa-mega').toLowerCase();
  const now = new Date();

  // Convert now to EAT (UTC+3)
  const eatNowTime = now.getTime() + (3 * 3600 * 1000);
  const eatNow = new Date(eatNowTime);
  const currentDay = eatNow.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  let targetDay = 6; // Saturday by default (SportPesa Mega, Cheerplex 17)
  let targetHour = 16; // 16:30 EAT
  let targetMinute = 30;

  if (resolved.includes('betika-grand')) {
    targetDay = 0; // Sunday
    targetHour = 10;
    targetMinute = 30;
  } else if (resolved.includes('cheerplex-15')) {
    targetDay = 0; // Sunday
    targetHour = 15;
    targetMinute = 0;
  } else if (resolved.includes('mozzart-grand')) {
    targetDay = 6; // Saturday
    targetHour = 13;
    targetMinute = 30;
  } else if (resolved.includes('sportpesa-midweek')) {
    targetDay = 2; // Tuesday
    targetHour = 18;
    targetMinute = 0;
  } else if (resolved.includes('betika-midweek') || resolved.includes('midweek')) {
    targetDay = 3; // Wednesday
    targetHour = 17;
    targetMinute = 0;
  } else if (resolved.includes('daily')) {
    targetDay = currentDay;
    targetHour = 18;
    targetMinute = 0;
  } else if (resolved.includes('sportpesa-mega')) {
    targetDay = 6; // Saturday
    targetHour = 16;
    targetMinute = 30;
  }

  let daysAhead = (targetDay - currentDay + 7) % 7;
  const currentHour = eatNow.getUTCHours();
  const currentMinute = eatNow.getUTCMinutes();
  if (daysAhead === 0 && (currentHour > targetHour || (currentHour === targetHour && currentMinute >= targetMinute))) {
    daysAhead = resolved.includes('daily') ? 1 : 7;
  }

  const targetDate = new Date(eatNow);
  targetDate.setUTCDate(targetDate.getUTCDate() + daysAhead);
  targetDate.setUTCHours(targetHour, targetMinute, 0, 0);

  return targetDate.getTime() - (3 * 3600 * 1000);
}

/**
 * Standalone high-tech HUD matchday countdown timer component.
 * Uses first game and last kickoff game to accurately determine kickoff window, in-progress, and completed states.
 */
const JackpotCountdownTimer = memo(function JackpotCountdownTimer({
  earliestTime: propEarliestTime,
  latestTime: propLatestTime,
  hasStarted: propHasStarted,
  hasEnded: propHasEnded,
  jackpotId = 'sportpesa-mega',
  fixtures: propFixtures,
  nextGameStartTime: propNextGameStartTime,
  submissionsFill: propSubmissionsFill,
  premiumCount: propPremiumCount,
  className = '',
  digitsOnly = false
}: JackpotCountdownTimerProps) {
  const resolvedJackpotId = resolveJackpotId(jackpotId, 'sportpesa-mega');
  const [liveDbFixtures, setLiveDbFixtures] = useState<Fixture[] | null>(() => propFixtures || getCachedLiveJackpotFixtures(resolvedJackpotId));

  const jackpotConfig = useMemo(() => {
    return jackpotsData.find(j => j.id === resolvedJackpotId || j.slug === resolvedJackpotId) || jackpotsData[0];
  }, [resolvedJackpotId]);

  const effectiveSubmissionsFill = propSubmissionsFill || jackpotConfig?.submissionsFill || '84%';
  const effectivePremiumCount = propPremiumCount || jackpotConfig?.premiumCount || '3';

  // If fixtures weren't supplied as props and aren't cached, load from live API
  useEffect(() => {
    if (propEarliestTime != null || (propFixtures && propFixtures.length > 0)) {
      return;
    }
    fetchLiveJackpotFixtures(resolvedJackpotId).then(fetched => {
      if (fetched && fetched.length > 0) {
        setLiveDbFixtures(fetched);
      }
    });
  }, [resolvedJackpotId, propEarliestTime, propFixtures]);

  const fixturesPool = propFixtures || liveDbFixtures || jackpotConfig?.fixtures || [];

  // Compute timing details from first game and last game
  const detailedTiming = useMemo(() => {
    return getJackpotDetailedTiming({
      id: resolvedJackpotId,
      fixtures: fixturesPool,
      earliestKickoff: propEarliestTime ? new Date(propEarliestTime).toISOString() : undefined,
      latestKickoff: propLatestTime ? new Date(propLatestTime).toISOString() : undefined,
      nextGameStartTime: propNextGameStartTime
    });
  }, [resolvedJackpotId, fixturesPool, propEarliestTime, propLatestTime, propNextGameStartTime]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const earliestTs = detailedTiming.earliestDate?.getTime() || propEarliestTime || null;
  const latestTs = detailedTiming.latestDate?.getTime() || propLatestTime || null;
  const matchDurationMs = 2 * 60 * 60 * 1000; // 2 hours
  const conclusionTs = latestTs ? (latestTs + matchDurationMs) : (earliestTs ? earliestTs + (28 * 3600 * 1000) : null);

  // Status determined strictly by first game, last game, or explicit prop overrides
  const status: 'upcoming' | 'started' | 'ended' = useMemo(() => {
    if (propHasEnded === true) return 'ended';
    if (conclusionTs && now >= conclusionTs) return 'ended';
    if (propHasStarted === true) return 'started';
    if (earliestTs && now >= earliestTs) return 'started';
    return 'upcoming';
  }, [propHasEnded, propHasStarted, conclusionTs, earliestTs, now]);

  const hasEnded = status === 'ended';
  const hasStarted = status === 'started';

  // Target countdown calculation:
  // - If completed: 0
  // - If in progress: counts down to last game kickoff (or match conclusion if past last kickoff)
  // - If upcoming: counts down to first game kickoff
  const { targetTimestamp, timeDifference } = useMemo(() => {
    if (hasEnded) {
      return { targetTimestamp: 0, timeDifference: 0 };
    }
    if (hasStarted) {
      if (latestTs && now < latestTs) {
        return { targetTimestamp: latestTs, timeDifference: latestTs - now };
      }
      if (conclusionTs && now < conclusionTs) {
        return { targetTimestamp: conclusionTs, timeDifference: conclusionTs - now };
      }
      return { targetTimestamp: 0, timeDifference: 0 };
    }
    const target = earliestTs || getNextUpcomingKickoff(resolvedJackpotId);
    return { targetTimestamp: target, timeDifference: Math.max(0, target - now) };
  }, [hasEnded, hasStarted, latestTs, conclusionTs, earliestTs, resolvedJackpotId, now]);

  const timeLeft = useMemo(() => {
    if (timeDifference <= 0 || hasEnded) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [timeDifference, hasEnded]);

  // Kickoff time string: uses first game and last game kickoff time when in progress or completed
  const startsText = useMemo(() => {
    if (hasEnded || hasStarted) {
      return detailedTiming.kickoffTimeText;
    }
    return propNextGameStartTime || detailedTiming.formattedEarliest;
  }, [hasEnded, hasStarted, detailedTiming, propNextGameStartTime]);

  // Digits Only Compact Mode
  if (digitsOnly) {
    if (hasEnded) {
      return (
        <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold border border-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-slate-400" />
            COMPLETED
          </span>
        </div>
      );
    }

    if (hasStarted) {
      return (
        <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            LIVE
          </span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-slate-900 border border-amber-500/60 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner">
              {String(timeLeft.hours + (timeLeft.days * 24)).padStart(2, '0')}
            </div>
            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">H</span>
          </div>
          <span className="text-amber-400 font-black text-xs -mt-2.5">:</span>

          {/* Mins */}
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-slate-900 border border-amber-500/60 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">M</span>
          </div>
          <span className="text-amber-400 font-black text-xs -mt-2.5">:</span>

          {/* Secs */}
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-slate-900 border border-amber-500 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">S</span>
          </div>
        </div>
      );
    }

    // Default Upcoming Digits
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">D</span>
        </div>
        <span className="text-blue-400 font-black text-xs -mt-2.5">:</span>
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">H</span>
        </div>
        <span className="text-blue-400 font-black text-xs -mt-2.5">:</span>
        {/* Mins */}
        <div className="flex flex-col items-center">
          <div className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">M</span>
        </div>
        <span className="text-blue-400 font-black text-xs -mt-2.5">:</span>
        {/* Secs */}
        <div className="flex flex-col items-center">
          <div className="px-2 py-1 bg-slate-900 border border-blue-500 rounded-lg text-xs sm:text-sm font-black text-blue-400 shadow-inner animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter mt-0.5">S</span>
        </div>
      </div>
    );
  }

  // Stadium Telemetry HUD for Cheerplex
  return (
    <div 
      className={`rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl p-4 sm:p-5 relative overflow-hidden space-y-4 ${className}`}
    >
      {/* Background cyber grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* 1. TOP TELEMETRY STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 relative z-10">
        <div className="flex items-center gap-2 text-[10.5px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              hasEnded ? 'bg-slate-500' : hasStarted ? 'bg-amber-400' : 'bg-blue-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              hasEnded ? 'bg-slate-500' : hasStarted ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
          </span>
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            {hasEnded 
              ? 'POOL CLOSED • SETTLED & VERIFIED' 
              : hasStarted 
                ? 'MATCHES IN PROGRESS • LIVE TRACKING' 
                : 'ANALYTICAL FEED ACTIVE • POOL OPEN'}
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            KENYA EAT (UTC+3)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
            hasEnded 
              ? 'bg-slate-800 text-slate-300 border-slate-700' 
              : hasStarted 
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/60 animate-pulse' 
                : 'bg-blue-950/80 text-blue-300 border-blue-800/60'
          }`}>
            <Sparkles className="w-2.5 h-2.5" />
            {hasEnded ? 'COMPLETED' : hasStarted ? 'LIVE IN PROGRESS' : 'ENTRY OPEN'}
          </span>
        </div>
      </div>

      {/* 2. MAIN COUNTDOWN CLOCK & KICKOFF META */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative z-10">
        {/* Left Kickoff Description */}
        <div className="space-y-1.5 text-left flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
            <Clock className={`w-3.5 h-3.5 shrink-0 ${hasStarted ? 'text-amber-400' : hasEnded ? 'text-slate-400' : 'text-blue-400'}`} />
            <span className="uppercase tracking-wider">
              {hasEnded ? 'Official Matchday Record (Settled)' : hasStarted ? 'Official Matchday In Progress' : 'Official Matchday Kickoff'}
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white tracking-tight font-display break-words">
            {startsText}
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            {hasEnded
              ? `All ${jackpotConfig.gamesCount || 17} matches completed. First match started ${detailedTiming.formattedEarliest} and final game concluded ${detailedTiming.formattedLatest}.`
              : hasStarted
                ? `Matches underway. First match started ${detailedTiming.formattedEarliest} • Final decider kicks off at ${detailedTiming.formattedLatest}.`
                : `Algorithmic combinations lock 10 minutes prior to first whistle (${detailedTiming.formattedEarliest}). Final match: ${detailedTiming.formattedLatest}.`
            }
          </div>
        </div>

        {/* Center/Right LED Split Countdown Cells */}
        <div className="flex flex-col items-center gap-1.5 self-center lg:self-auto shrink-0 py-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            {hasEnded
              ? 'Jackpot Concluded'
              : hasStarted
                ? (latestTs && now < latestTs ? 'Final Match Kicks Off In:' : 'Window Concluding In:')
                : 'Kickoff Closes In:'}
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5 font-mono select-none">
            {/* Days Cell */}
            <div className="flex flex-col items-center">
              <div className={`w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden ${
                hasEnded ? 'border-slate-800 text-slate-500' : hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white'
              }`}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80" />
                <span className="relative z-10">{String(timeLeft.days).padStart(2, '0')}</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Days</span>
            </div>

            <span className="text-slate-600 font-black text-lg sm:text-xl -mt-5">:</span>

            {/* Hours Cell */}
            <div className="flex flex-col items-center">
              <div className={`w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden ${
                hasEnded ? 'border-slate-800 text-slate-500' : hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white'
              }`}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80" />
                <span className="relative z-10">{String(timeLeft.hours).padStart(2, '0')}</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Hours</span>
            </div>

            <span className="text-slate-600 font-black text-lg sm:text-xl -mt-5">:</span>

            {/* Mins Cell */}
            <div className="flex flex-col items-center">
              <div className={`w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden ${
                hasEnded ? 'border-slate-800 text-slate-500' : hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white'
              }`}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80" />
                <span className="relative z-10">{String(timeLeft.minutes).padStart(2, '0')}</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Mins</span>
            </div>

            <span className={`font-black text-lg sm:text-xl -mt-5 ${hasStarted ? 'text-amber-500' : hasEnded ? 'text-slate-700' : 'text-blue-500'}`}>:</span>

            {/* Secs Cell */}
            <div className="flex flex-col items-center">
              <div className={`w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border-2 rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden ${
                hasEnded 
                  ? 'border-slate-800 text-slate-500 shadow-none' 
                  : hasStarted 
                    ? 'border-amber-500 text-amber-300 shadow-amber-950/40 animate-pulse' 
                    : 'border-blue-500/80 text-blue-400 shadow-blue-950/40'
              }`}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-blue-900/60" />
                <span className="relative z-10">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              <span className={`text-[9px] font-mono font-bold mt-1.5 uppercase tracking-wider ${hasStarted ? 'text-amber-400' : hasEnded ? 'text-slate-500' : 'text-blue-400'}`}>Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE SLIP LOGS */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
          <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Verified Combinations Active</span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700">
            {effectivePremiumCount} High-Probability Slips In Circulation
          </span>
        </div>
      </div>
    </div>
  );
});

export default JackpotCountdownTimer;
