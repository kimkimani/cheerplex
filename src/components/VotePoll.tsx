import { useEffect, useState } from 'react';
import { Users, CheckCircle2, Lock } from 'lucide-react';
import { getApiBaseUrl } from '../lib/getApiBaseUrl';

export interface VoteStats {
  fixtureId: string;
  totalVotes: number;
  votes1: number;
  votesX: number;
  votes2: number;
  homePercent: number;
  drawPercent: number;
  awayPercent: number;
  userVote: string | null;
}

export interface VotePollProps {
  fixtureId: string | number;
  homeTeam?: string;
  awayTeam?: string;
  isEnded?: boolean;
  status?: string;
  result?: string;
  prediction?: string;
  initialTotalVotes?: number;
  initialVotes1?: number;
  initialVotesX?: number;
  initialVotes2?: number;
  initialUserVote?: string | null;
  variant?: 'full' | 'card' | 'compact' | 'inline' | 'mobile' | 'desktop-row';
  onExpand?: () => void;
  className?: string;
}

export interface PollOption {
  key: string;
  label: string;       // Primary display name e.g. 'Arsenal', 'Over 2.5', '1X (Home/Draw)'
  shortLabel: string;  // Concise label e.g. '1X', 'Over 2.5'
  sublabel?: string;   // Contextual helper
  dbKey: '1' | 'X' | '2';
  accentColor: string;
}

/**
 * Dedicated color shades for each option's progress bar and interactive states.
 */
export function getOptionShades(accentColor: string, isVoted: boolean) {
  switch (accentColor) {
    case 'emerald':
      return {
        cardClass: isVoted
          ? 'border-2 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100 ring-2 ring-emerald-500/20 shadow-2xs font-semibold'
          : 'border border-[var(--border)] bg-white dark:bg-slate-800/90 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 text-slate-900 dark:text-slate-100 shadow-2xs',
        progressFill: isVoted 
          ? 'bg-emerald-500/20 dark:bg-emerald-500/30 border-r-2 border-emerald-500/50' 
          : 'bg-emerald-500/10 dark:bg-emerald-500/15 border-r border-emerald-500/30',
        solidBarFill: 'bg-emerald-500',
        trackBg: 'bg-slate-200 dark:bg-slate-700/80',
        percentText: 'text-emerald-600 dark:text-emerald-400 font-bold',
        subText: 'text-slate-500 dark:text-slate-400',
        labelColor: 'text-slate-900 dark:text-slate-100 font-bold',
        checkColor: 'text-emerald-600 dark:text-emerald-400',
        pillBg: isVoted 
          ? 'bg-emerald-600 text-white border-emerald-600 font-bold' 
          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      };
    case 'blue':
      return {
        cardClass: isVoted
          ? 'border-2 border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-slate-100 ring-2 ring-blue-500/20 shadow-2xs font-semibold'
          : 'border border-[var(--border)] bg-white dark:bg-slate-800/90 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-slate-900 dark:text-slate-100 shadow-2xs',
        progressFill: isVoted 
          ? 'bg-blue-500/20 dark:bg-blue-500/30 border-r-2 border-blue-500/50' 
          : 'bg-blue-500/10 dark:bg-blue-500/15 border-r border-blue-500/30',
        solidBarFill: 'bg-blue-600',
        trackBg: 'bg-slate-200 dark:bg-slate-700/80',
        percentText: 'text-blue-600 dark:text-blue-400 font-bold',
        subText: 'text-slate-500 dark:text-slate-400',
        labelColor: 'text-slate-900 dark:text-slate-100 font-bold',
        checkColor: 'text-blue-600 dark:text-blue-400',
        pillBg: isVoted 
          ? 'bg-blue-600 text-white border-blue-600 font-bold' 
          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      };
    case 'purple':
    case 'indigo':
      return {
        cardClass: isVoted
          ? 'border-2 border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/20 shadow-2xs font-semibold'
          : 'border border-[var(--border)] bg-white dark:bg-slate-800/90 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 text-slate-900 dark:text-slate-100 shadow-2xs',
        progressFill: isVoted 
          ? 'bg-indigo-500/20 dark:bg-indigo-500/30 border-r-2 border-indigo-500/50' 
          : 'bg-indigo-500/10 dark:bg-indigo-500/15 border-r border-indigo-500/30',
        solidBarFill: 'bg-indigo-500',
        trackBg: 'bg-slate-200 dark:bg-slate-700/80',
        percentText: 'text-indigo-600 dark:text-indigo-400 font-bold',
        subText: 'text-slate-500 dark:text-slate-400',
        labelColor: 'text-slate-900 dark:text-slate-100 font-bold',
        checkColor: 'text-indigo-600 dark:text-indigo-400',
        pillBg: isVoted 
          ? 'bg-indigo-600 text-white border-indigo-600 font-bold' 
          : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      };
    case 'amber':
    default:
      return {
        cardClass: isVoted
          ? 'border-2 border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-slate-900 dark:text-slate-100 ring-2 ring-amber-500/20 shadow-2xs font-semibold'
          : 'border border-[var(--border)] bg-white dark:bg-slate-800/90 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 text-slate-900 dark:text-slate-100 shadow-2xs',
        progressFill: isVoted 
          ? 'bg-amber-500/20 dark:bg-amber-500/30 border-r-2 border-amber-500/50' 
          : 'bg-amber-500/10 dark:bg-amber-500/15 border-r border-amber-500/30',
        solidBarFill: 'bg-amber-500',
        trackBg: 'bg-slate-200 dark:bg-slate-700/80',
        percentText: 'text-amber-600 dark:text-amber-400 font-bold',
        subText: 'text-slate-500 dark:text-slate-400',
        labelColor: 'text-slate-900 dark:text-slate-100 font-bold',
        checkColor: 'text-amber-600 dark:text-amber-400',
        pillBg: isVoted 
          ? 'bg-amber-500 text-slate-950 border-amber-500 font-black' 
          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      };
  }
}

/**
 * Detect market type and format human labels
 */
export function detectMarketType(
  prediction?: string,
  homeTeam?: string,
  awayTeam?: string
): {
  type: '1X2' | 'DC' | 'OU' | 'BTTS';
  question: string;
  options: PollOption[];
} {
  const pred = String(prediction || '').toUpperCase().trim();
  const home = homeTeam || 'Home';
  const away = awayTeam || 'Away';

  // Over/Under Goal Markets
  if (pred.includes('OVER') || pred.includes('UNDER') || pred.includes('OV') || pred.includes('UN')) {
    let line = '2.5';
    if (pred.includes('1.5')) line = '1.5';
    else if (pred.includes('3.5')) line = '3.5';

    return {
      type: 'OU',
      question: `Over/Under ${line} Goals?`,
      options: [
        {
          key: `OVER_${line}`,
          label: `Over ${line}`,
          shortLabel: `Over ${line}`,
          sublabel: `+${line} Goals`,
          dbKey: '1',
          accentColor: 'emerald',
        },
        {
          key: `UNDER_${line}`,
          label: `Under ${line}`,
          shortLabel: `Under ${line}`,
          sublabel: `-${line} Goals`,
          dbKey: '2',
          accentColor: 'amber',
        },
      ],
    };
  }

  // Both Teams To Score (GG/NG)
  if (pred.includes('GG') || pred.includes('NG') || pred.includes('BTTS')) {
    return {
      type: 'BTTS',
      question: 'Both Teams To Score?',
      options: [
        {
          key: 'GG',
          label: 'Yes (GG)',
          shortLabel: 'GG (Yes)',
          sublabel: 'Both to score',
          dbKey: '1',
          accentColor: 'emerald',
        },
        {
          key: 'NG',
          label: 'No (NG)',
          shortLabel: 'NG (No)',
          sublabel: 'Clean sheet',
          dbKey: '2',
          accentColor: 'amber',
        },
      ],
    };
  }

  // Double Chance Markets
  if (pred.includes('1X') || pred.includes('X2') || pred.includes('12') || pred.includes('DC')) {
    return {
      type: 'DC',
      question: 'Double Chance Outcome?',
      options: [
        {
          key: '1X',
          label: `${home} or Draw`,
          shortLabel: '1X (Home/Draw)',
          sublabel: '1X Double Chance',
          dbKey: '1',
          accentColor: 'emerald',
        },
        {
          key: '12',
          label: `${home} or ${away}`,
          shortLabel: '12 (Any Win)',
          sublabel: 'No Draw',
          dbKey: 'X',
          accentColor: 'amber',
        },
        {
          key: 'X2',
          label: `Draw or ${away}`,
          shortLabel: 'X2 (Draw/Away)',
          sublabel: 'X2 Double Chance',
          dbKey: '2',
          accentColor: 'blue',
        },
      ],
    };
  }

  // Standard 1X2 Full-Time Result
  return {
    type: '1X2',
    question: `Who will win: ${home} vs ${away}?`,
    options: [
      {
        key: '1',
        label: home,
        shortLabel: '1 (Home)',
        sublabel: 'Home Win',
        dbKey: '1',
        accentColor: 'emerald',
      },
      {
        key: 'X',
        label: 'Draw',
        shortLabel: 'X (Draw)',
        sublabel: 'Tie Game',
        dbKey: 'X',
        accentColor: 'amber',
      },
      {
        key: '2',
        label: away,
        shortLabel: '2 (Away)',
        sublabel: 'Away Win',
        dbKey: '2',
        accentColor: 'blue',
      },
    ],
  };
}

/**
 * Accurately compute percentages from raw database vote counts ensuring sum is 100%
 */
export function calculateExactPercentages(
  options: PollOption[],
  votes1: number,
  votesX: number,
  votes2: number
): { pcts: Record<string, number>; total: number } {
  const isTwoOption = options.length === 2;
  const pcts: Record<string, number> = {};

  if (isTwoOption) {
    const v1 = Math.max(0, votes1);
    const v2 = Math.max(0, votes2);
    const total = v1 + v2;

    if (total <= 0) {
      pcts[options[0].key] = 0;
      pcts[options[1].key] = 0;
      return { pcts, total: 0 };
    }

    const p1 = Math.round((v1 / total) * 100);
    const p2 = 100 - p1;

    pcts[options[0].key] = p1;
    pcts[options[1].key] = p2;
    return { pcts, total };
  }

  // 3-Option Market (1X2 or Double Chance)
  const v1 = Math.max(0, votes1);
  const vX = Math.max(0, votesX);
  const v2 = Math.max(0, votes2);
  const total = v1 + vX + v2;

  if (total <= 0) {
    pcts[options[0].key] = 0;
    pcts[options[1].key] = 0;
    pcts[options[2].key] = 0;
    return { pcts, total: 0 };
  }

  const p1 = Math.round((v1 / total) * 100);
  let pX = Math.round((vX / total) * 100);
  let p2 = 100 - p1 - pX;

  if (p1 + pX > 100) {
    pX = Math.max(0, 100 - p1);
    p2 = 0;
  } else if (p2 < 0) {
    p2 = 0;
  }

  pcts[options[0].key] = p1;
  pcts[options[1].key] = pX;
  pcts[options[2].key] = p2;

  return { pcts, total };
}

/**
 * Initial state builder strictly reflecting database values
 */
export function createInitialVoteStats(
  fixtureId: string | number,
  savedVote: string | null = null,
  initialTotalVotes?: number,
  initialVotes1?: number,
  initialVotesX?: number,
  initialVotes2?: number
): VoteStats {
  const fId = String(fixtureId);
  const hasInitial = typeof initialTotalVotes === 'number';
  const total = hasInitial ? Math.max(0, initialTotalVotes) : 0;
  const v1 = hasInitial ? Math.max(0, initialVotes1 || 0) : 0;
  const vX = hasInitial ? Math.max(0, initialVotesX || 0) : 0;
  const v2 = hasInitial ? Math.max(0, initialVotes2 || 0) : 0;

  const hPct = total > 0 ? Math.round((v1 / total) * 100) : 0;
  const dPct = total > 0 ? Math.round((vX / total) * 100) : 0;
  const aPct = total > 0 ? Math.max(0, 100 - hPct - dPct) : 0;

  return {
    fixtureId: fId,
    totalVotes: total,
    votes1: v1,
    votesX: vX,
    votes2: v2,
    homePercent: hPct,
    drawPercent: dPct,
    awayPercent: aPct,
    userVote: savedVote || null,
  };
}

// Global cache of VERIFIED vote results returned from the database
const verifiedDbVoteCache = new Map<string, VoteStats>();
const inFlightVoteRequests = new Map<string, Promise<VoteStats | null>>();

/**
 * Fetches real database votes from the backend endpoint
 */
export async function fetchDbVoteData(
  fixtureId: string | number,
  visitorId: string,
  savedVote: string | null
): Promise<VoteStats | null> {
  const fId = String(fixtureId);

  // Reuse in-flight fetch to prevent duplicate simultaneous queries
  if (inFlightVoteRequests.has(fId)) {
    return inFlightVoteRequests.get(fId)!;
  }

  const p = (async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/api/predictions/vote?fixtureId=${encodeURIComponent(fId)}&userId=${encodeURIComponent(visitorId)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          const v1 = Math.max(0, Number(data.votes1 || 0));
          const vX = Math.max(0, Number(data.votesX || 0));
          const v2 = Math.max(0, Number(data.votes2 || 0));
          const total = Math.max(
            0,
            Number(data.totalVotes !== undefined ? data.totalVotes : (v1 + vX + v2))
          );

          const hPct = total > 0 ? Math.round((v1 / total) * 100) : 0;
          const dPct = total > 0 ? Math.round((vX / total) * 100) : 0;
          const aPct = total > 0 ? Math.max(0, 100 - hPct - dPct) : 0;

          const serverUserVote = data.userVote || savedVote || null;

          const freshStats: VoteStats = {
            fixtureId: fId,
            totalVotes: total,
            votes1: v1,
            votesX: vX,
            votes2: v2,
            homePercent: hPct,
            drawPercent: dPct,
            awayPercent: aPct,
            userVote: serverUserVote,
          };

          verifiedDbVoteCache.set(fId, freshStats);
          return freshStats;
        }
      }
    } catch (err) {
      console.warn(`[VotePoll] Failed to fetch vote data for fixture ${fId}:`, err);
    } finally {
      inFlightVoteRequests.delete(fId);
    }
    return null;
  })();

  inFlightVoteRequests.set(fId, p);
  return p;
}

export default function VotePoll({ 
  fixtureId, 
  homeTeam, 
  awayTeam, 
  isEnded, 
  status, 
  result, 
  prediction,
  initialTotalVotes,
  initialVotes1,
  initialVotesX,
  initialVotes2,
  initialUserVote,
  variant = 'full',
  onExpand,
  className = ''
}: VotePollProps) {
  const fId = String(fixtureId);

  // Initialize stats strictly from verified database cache or initial props, defaulting to 0
  const [stats, setStats] = useState<VoteStats>(() => {
    if (verifiedDbVoteCache.has(fId)) {
      return verifiedDbVoteCache.get(fId)!;
    }

    let savedVote: string | null = initialUserVote || null;
    if (!savedVote && typeof window !== 'undefined') {
      try {
        savedVote = localStorage.getItem(`vote_${fId}`);
      } catch {}
    }

    return createInitialVoteStats(
      fId,
      savedVote,
      initialTotalVotes,
      initialVotes1,
      initialVotesX,
      initialVotes2
    );
  });

  const [voting, setVoting] = useState<string | null>(null);

  const market = detectMarketType(prediction, homeTeam, awayTeam);

  const isMatchFinished =
    Boolean(isEnded) ||
    ['FT', 'AET', 'PEN', 'FINISHED', 'AWD', 'CANCELLED', 'POSTPONED'].includes(
      String(status || '').trim().toUpperCase()
    ) ||
    result === 'won' ||
    result === 'lost';

  const [visitorId] = useState(() => {
    if (typeof window === 'undefined') return 'anonymous';
    let id = localStorage.getItem('aistudio_visitor_id');
    if (!id) {
      id = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('aistudio_visitor_id', id);
    }
    return id;
  });

  // Query live database votes on mount
  useEffect(() => {
    let active = true;
    let savedVote: string | null = null;

    if (typeof window !== 'undefined') {
      try {
        savedVote = localStorage.getItem(`vote_${fId}`);
      } catch {}
    }

    fetchDbVoteData(fId, visitorId, savedVote).then((fresh) => {
      if (active && fresh) {
        setStats(fresh);
        if (fresh.userVote && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`vote_${fId}`, fresh.userVote);
          } catch {}
        }
      }
    });

    // Synchronize across components if user votes on another instance of the same fixture
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent).detail as VoteStats;
      if (active && detail && detail.fixtureId === fId) {
        setStats(detail);
      }
    };
    window.addEventListener('cheerplex_vote_sync', handleSync);

    return () => {
      active = false;
      window.removeEventListener('cheerplex_vote_sync', handleSync);
    };
  }, [fId, visitorId]);

  const castVote = async (opt: PollOption) => {
    if (isMatchFinished || voting) return;
    setVoting(opt.key);

    const newVoteKey = opt.key;

    // Optimistic calculation with exact sum to 100%
    setStats((prev) => {
      let v1 = prev.votes1;
      let vX = prev.votesX;
      let v2 = prev.votes2;

      // If switching vote
      if (prev.userVote) {
        if (prev.userVote === '1' || prev.userVote === '1X' || prev.userVote === 'GG' || prev.userVote.startsWith('OVER')) {
          v1 = Math.max(0, v1 - 1);
        } else if (prev.userVote === 'X' || prev.userVote === '12') {
          vX = Math.max(0, vX - 1);
        } else if (prev.userVote === '2' || prev.userVote === '2X' || prev.userVote === 'NG' || prev.userVote.startsWith('UNDER')) {
          v2 = Math.max(0, v2 - 1);
        }
      }

      if (opt.dbKey === '1') v1 += 1;
      else if (opt.dbKey === 'X') vX += 1;
      else if (opt.dbKey === '2') v2 += 1;

      const total = v1 + vX + v2;
      const hPct = total > 0 ? Math.round((v1 / total) * 100) : 0;
      const dPct = total > 0 ? Math.round((vX / total) * 100) : 0;
      const aPct = total > 0 ? Math.max(0, 100 - hPct - dPct) : 0;

      const updatedStats: VoteStats = {
        fixtureId: fId,
        totalVotes: total,
        votes1: v1,
        votesX: vX,
        votes2: v2,
        homePercent: hPct,
        drawPercent: dPct,
        awayPercent: aPct,
        userVote: newVoteKey,
      };

      verifiedDbVoteCache.set(fId, updatedStats);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`vote_${fId}`, newVoteKey);
          window.dispatchEvent(new CustomEvent('cheerplex_vote_sync', { detail: updatedStats }));
        } catch {}
      }

      return updatedStats;
    });

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/predictions/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fixtureId: fId,
          userId: visitorId,
          vote: opt.dbKey,
          isEnded: isMatchFinished,
          status,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.stats) {
          const s = data.stats;
          const v1 = Math.max(0, Number(s.votes1 || 0));
          const vX = Math.max(0, Number(s.votesX || 0));
          const v2 = Math.max(0, Number(s.votes2 || 0));
          const total = Math.max(
            0,
            Number(s.totalVotes !== undefined ? s.totalVotes : (v1 + vX + v2))
          );

          const hPct = total > 0 ? Math.round((v1 / total) * 100) : 0;
          const dPct = total > 0 ? Math.round((vX / total) * 100) : 0;
          const aPct = total > 0 ? Math.max(0, 100 - hPct - dPct) : 0;

          const authoritativeStats: VoteStats = {
            fixtureId: fId,
            totalVotes: total,
            votes1: v1,
            votesX: vX,
            votes2: v2,
            homePercent: hPct,
            drawPercent: dPct,
            awayPercent: aPct,
            userVote: s.userVote || newVoteKey,
          };

          verifiedDbVoteCache.set(fId, authoritativeStats);
          setStats(authoritativeStats);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cheerplex_vote_sync', { detail: authoritativeStats }));
          }
        }
      }
    } catch (err) {
      console.warn('API vote sync warning:', err);
    } finally {
      setVoting(null);
    }
  };

  const exactCalculations = calculateExactPercentages(
    market.options,
    stats?.votes1 ?? 0,
    stats?.votesX ?? 0,
    stats?.votes2 ?? 0
  );

  const isUserSelected = (opt: PollOption) => {
    if (!stats?.userVote) return false;
    return (
      stats.userVote === opt.key ||
      stats.userVote === opt.dbKey ||
      (opt.dbKey === '1' && (stats.userVote === '1X' || stats.userVote === 'GG' || stats.userVote.startsWith('OVER'))) ||
      (opt.dbKey === '2' && (stats.userVote === '2X' || stats.userVote === 'NG' || stats.userVote.startsWith('UNDER')))
    );
  };

  const hasVoted = Boolean(stats?.userVote);

  // Accurate singular/plural labels
  const totalVotesCount = Math.max(0, Number(stats?.totalVotes || 0));
  const voteCountText = totalVotesCount === 1 ? '1 vote' : `${totalVotesCount.toLocaleString()} votes`;
  const totalVotesText = totalVotesCount === 1 ? '1 total vote' : `${totalVotesCount.toLocaleString()} total votes`;

  // 1a. COMPACT PILL VARIANT
  if (variant === 'compact') {
    let topP = -1;
    let topOpt = market.options[0];
    for (const opt of market.options) {
      const p = exactCalculations.pcts[opt.key] ?? 0;
      if (p > topP) {
        topP = p;
        topOpt = opt;
      }
    }
    const userOpt = stats.userVote ? market.options.find(o => isUserSelected(o)) : null;
    const activeOpt = userOpt || topOpt;
    const activeShade = getOptionShades(activeOpt.accentColor, hasVoted);

    if (totalVotesCount === 0 && !hasVoted) {
      return (
        <button 
          type="button"
          className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-left transition-all duration-150 group select-none cursor-pointer mt-0.5 max-w-full truncate bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100 shadow-2xs ${className}`}
          onClick={(e) => {
            if (onExpand) {
              e.stopPropagation();
              onExpand();
            }
          }}
          title="0 votes • Be the first to vote!"
        >
          <Users className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono leading-none">
            <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
              <span>0 votes</span>
              <span className="text-amber-400 dark:text-amber-600">•</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 animate-pulse">Be the first to vote!</span>
            </span>
          </div>
        </button>
      );
    }

    return (
      <button 
        type="button"
        className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-left transition-all duration-150 group select-none cursor-pointer mt-0.5 max-w-full truncate shadow-2xs ${
          hasVoted
            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-700/60'
        } ${className}`}
        onClick={(e) => {
          if (onExpand) {
            e.stopPropagation();
            onExpand();
          }
        }}
        title={hasVoted ? `You voted ${stats.userVote} (${totalVotesText})` : `${voteCountText} (${topP}% ${topOpt.shortLabel})`}
      >
        <Users className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105 ${
          hasVoted ? 'text-white' : 'text-blue-600 dark:text-blue-400'
        }`} />

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono leading-none">
          <span className="flex items-center gap-1 font-bold">
            <span className={hasVoted ? 'text-white font-black' : 'text-blue-600 dark:text-blue-400'}>{topP}%</span>
            <span className={hasVoted ? 'text-white font-bold' : 'text-slate-900 dark:text-slate-100 font-bold'}>{topOpt.shortLabel}</span>
          </span>

          <span className={`text-[9.5px] font-mono ${hasVoted ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
            ({totalVotesCount})
          </span>
        </div>

        {hasVoted && (
          <span className="inline-flex items-center shrink-0 ml-0.5 text-white" title={`You voted ${stats.userVote}`}>
            <CheckCircle2 className="w-3.5 h-3.5 font-bold" />
          </span>
        )}
      </button>
    );
  }

  // 1b. MOBILE 3-TIER VARIANT
  if (variant === 'mobile') {
    return (
      <div 
        className={`w-full space-y-1.5 text-left select-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Row 1: Question */}
        <div className="text-xs font-bold text-[var(--text)] tracking-tight">
          {market.question}
        </div>

        {/* Row 2: Voting Status & Community votes */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Fan Poll</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isMatchFinished ? (
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1 shadow-2xs">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                <span>Match Ended • Closed</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Voting Open</span>
              </span>
            )}
            <span className="tabular-nums font-bold text-slate-600 dark:text-slate-400 text-[10px]">
              ({totalVotesCount} {totalVotesCount === 1 ? 'vote' : 'votes'})
            </span>
          </div>
        </div>

        {/* Row 3: Voting Options Grid with Dedicated Option Shades */}
        <div className={`grid ${market.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 pt-0.5`}>
          {market.options.map((opt) => {
            const percentVal = exactCalculations.pcts[opt.key] ?? 0;
            const isVoted = isUserSelected(opt);
            const shades = getOptionShades(opt.accentColor, isVoted);

            return (
              <button
                key={opt.key}
                type="button"
                disabled={Boolean(isMatchFinished || voting)}
                onClick={(e) => {
                  e.stopPropagation();
                  castVote(opt);
                }}
                className={`relative overflow-hidden py-2 px-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[46px] font-mono text-xs active:scale-[0.97] touch-manipulation group ${shades.cardClass}`}
                title={isMatchFinished ? `Match concluded • Final: ${opt.label} (${percentVal}%)` : `Vote ${opt.label} (${percentVal}%) - Total: ${totalVotesText}`}
              >
                {/* Background progress fill */}
                {percentVal > 0 && (
                  <div 
                    className={`absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-500 ${shades.progressFill}`} 
                    style={{ width: `${percentVal}%` }} 
                  />
                )}

                {/* Option Choice text and Percentage */}
                <div className="relative z-10 flex items-center justify-between gap-1 w-full">
                  <span className={`font-bold truncate text-xs ${shades.labelColor}`}>
                    {opt.shortLabel}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[11px] tabular-nums ${shades.percentText}`}>
                      {percentVal}%
                    </span>
                    {isVoted && (
                      <CheckCircle2 className={`w-3 h-3 shrink-0 font-bold ${shades.checkColor}`} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status helper for mobile */}
        {isMatchFinished ? (
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" /> Match has ended (FT) — voting is closed. Final votes recorded.
          </div>
        ) : (
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" /> You can vote now! Tap your selection before kickoff.
          </div>
        )}
      </div>
    );
  }

  // 1c. DESKTOP ROW VARIANT
  if (variant === 'desktop-row') {
    return (
      <div 
        className={`w-full space-y-2.5 text-left select-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Question on start, Voting Status on the end */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight truncate">
              {market.question}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isMatchFinished ? (
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Match Ended • Voting Closed</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>VOTING OPEN • Tap to Vote</span>
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              ({totalVotesCount} {totalVotesCount === 1 ? 'vote' : 'votes'})
            </span>
          </div>
        </div>

        {/* 2 or 3 Voting Cards Grid with Dedicated Option Shades */}
        <div className={`grid ${market.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2.5 sm:gap-3`}>
          {market.options.map((opt) => {
            const percentVal = exactCalculations.pcts[opt.key] ?? 0;
            const isVoted = isUserSelected(opt);
            const shades = getOptionShades(opt.accentColor, isVoted);

            return (
              <button
                key={opt.key}
                type="button"
                disabled={Boolean(isMatchFinished || voting)}
                onClick={(e) => {
                  e.stopPropagation();
                  castVote(opt);
                }}
                className={`py-3 px-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[76px] active:scale-[0.98] group relative overflow-hidden ${
                  isMatchFinished ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:shadow-xs'
                } ${shades.cardClass}`}
                title={isMatchFinished ? `Match concluded • Final: ${opt.label} (${percentVal}%)` : `Vote ${opt.label} (${percentVal}%) - Total: ${totalVotesText}`}
              >
                {/* Background progress fill */}
                {percentVal > 0 && (
                  <div 
                    className={`absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-500 ${shades.progressFill}`} 
                    style={{ width: `${percentVal}%` }} 
                  />
                )}

                {/* Team / Choice Label on left, % on right */}
                <div className="relative z-10 w-full flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-xs sm:text-sm truncate tracking-tight font-bold ${shades.labelColor}`}>
                      {opt.label}
                    </span>
                    {isVoted && (
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 font-bold ${shades.checkColor}`} />
                    )}
                  </div>
                  <span className={`text-sm sm:text-base font-mono tabular-nums leading-none ${shades.percentText}`}>
                    {percentVal}%
                  </span>
                </div>

                {/* Sub-label helper if present */}
                {opt.sublabel && (
                  <span className={`relative z-10 text-[10px] sm:text-[10.5px] truncate max-w-full leading-none my-0.5 ${shades.subText}`}>
                    {opt.sublabel}
                  </span>
                )}

                {!isVoted && !isMatchFinished ? (
                  <div className="relative z-10 w-full text-right mt-1">
                    <span className="text-[9.5px] font-mono text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                      {totalVotesCount === 0 ? '• Vote first' : '• Tap to vote'}
                    </span>
                  </div>
                ) : isMatchFinished ? (
                  <div className="relative z-10 w-full text-right mt-1">
                    <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500">
                      • Final result
                    </span>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        {isMatchFinished ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 pt-0.5">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" /> Match has ended (FT) — voting is closed. Final community votes recorded.
            </span>
            <span className="text-[10px] text-slate-400">
              Total: {totalVotesCount.toLocaleString()} votes
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 px-1 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              You can vote as the match has not ended • Voting is live until kickoff
            </span>
            <span className="text-[10px] text-slate-400">
              Total: {totalVotesCount.toLocaleString()} votes
            </span>
          </div>
        )}
      </div>
    );
  }

  // 1d. INLINE VARIANT
  if (variant === 'inline') {
    return (
      <div 
        className={`w-full flex items-center justify-between gap-2 text-xs select-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-medium shrink-0">
          <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Votes:</span>
          {totalVotesCount === 0 ? (
            <span className="text-amber-600 dark:text-amber-400 font-mono text-[10.5px] font-bold flex items-center gap-1">
              (0 votes • Be the first to vote!)
            </span>
          ) : (
            <span className="opacity-80 font-mono text-[10.5px] tabular-nums font-semibold">
              ({voteCountText})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-end max-w-sm">
          {market.options.map((opt) => {
            const percentVal = exactCalculations.pcts[opt.key] ?? 0;
            const isVoted = isUserSelected(opt);
            const shades = getOptionShades(opt.accentColor, isVoted);

            return (
              <button
                key={opt.key}
                type="button"
                disabled={Boolean(isMatchFinished || voting)}
                onClick={(e) => {
                  e.stopPropagation();
                  castVote(opt);
                }}
                className={`relative overflow-hidden flex-1 py-1 px-2.5 rounded-lg border text-center transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 min-h-[32px] font-mono text-xs active:scale-[0.97] touch-manipulation group ${shades.cardClass}`}
                title={`Vote ${opt.label} (${percentVal}%) - Total: ${totalVotesText}`}
              >
                {/* Progress bar fill */}
                {percentVal > 0 && (
                  <div 
                    className={`absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-500 ${shades.progressFill}`} 
                    style={{ width: `${percentVal}%` }} 
                  />
                )}
                <span className={`relative z-10 font-bold tracking-tight ${shades.labelColor}`}>{opt.shortLabel}</span>
                <div className="relative z-10 flex items-center gap-1 shrink-0">
                  <span className={`text-[10px] tabular-nums ${shades.percentText}`}>
                    {percentVal}%
                  </span>
                  {isVoted && (
                    <CheckCircle2 className={`w-3 h-3 shrink-0 ${shades.checkColor}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. CARD VARIANT (Match card voting module)
  if (variant === 'card') {
    return (
      <div 
        className={`w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-left space-y-2 select-none ${className}`}
        onClick={(e) => {
          if (onExpand) {
            e.stopPropagation();
            onExpand();
          }
        }}
      >
        {/* Header with vote count */}
        <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
          <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{market.question}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isMatchFinished ? (
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                <span>Match Ended • Closed</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Voting Open</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
              ({totalVotesCount} {totalVotesCount === 1 ? 'vote' : 'votes'})
            </span>
          </div>
        </div>

        {/* Clean Boxes with percentages */}
        <div className={`grid gap-1.5 ${market.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {market.options.map((opt) => {
            const percentVal = exactCalculations.pcts[opt.key] ?? 0;
            const isVoted = isUserSelected(opt);
            const shades = getOptionShades(opt.accentColor, isVoted);

            return (
              <button
                key={opt.key}
                disabled={Boolean(isMatchFinished || voting)}
                onClick={(e) => {
                  e.stopPropagation();
                  castVote(opt);
                }}
                className={`relative overflow-hidden py-2 px-2 rounded-lg border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between min-h-[50px] group ${shades.cardClass}`}
                title={`Vote ${opt.label} (${percentVal}%) - Total: ${totalVotesText}`}
              >
                {/* Visual Progress Fill */}
                {percentVal > 0 && (
                  <div 
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-500 pointer-events-none ${shades.progressFill}`} 
                    style={{ width: `${percentVal}%` }} 
                  />
                )}

                {/* Team / Choice Label */}
                <div className="relative z-10 w-full flex items-center justify-center gap-1">
                  <span className={`text-[11px] truncate tracking-tight font-bold ${shades.labelColor}`}>
                    {opt.label}
                  </span>
                  {isVoted && (
                    <CheckCircle2 className={`w-3 h-3 shrink-0 font-bold ${shades.checkColor}`} />
                  )}
                </div>

                {/* Percentage */}
                <span className={`relative z-10 text-[11.5px] font-mono mt-0.5 leading-none ${shades.percentText}`}>
                  {percentVal}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Status helper for card */}
        {isMatchFinished ? (
          <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" /> Match has ended (FT) — voting is closed. Final votes recorded.
          </div>
        ) : (
          <div className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" /> You can vote now! Tap your selection above before kickoff.
          </div>
        )}
      </div>
    );
  }

  // 3. FULL DETAILED VARIANT
  return (
    <div className={`p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-[var(--border)] space-y-3 text-left shadow-xs ${className}`}>
      {/* Clean Top Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold text-[var(--text)] text-xs sm:text-sm">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{market.question}</span>
        </div>

        <div className="flex items-center gap-2">
          {isMatchFinished ? (
            <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-2xs">
              <Lock className="w-3 h-3 text-slate-500" /> Match Ended • Voting Closed
            </span>
          ) : (
            <span className="text-[10.5px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Voting Open • Tap to Vote
            </span>
          )}
          <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
            ({totalVotesCount} {totalVotesCount === 1 ? 'vote' : 'votes'})
          </span>
        </div>
      </div>

      {/* Clean Selection Boxes with Smooth Progress Box Fills */}
      <div className={`grid gap-2.5 ${market.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {market.options.map((opt) => {
          const pct = exactCalculations.pcts[opt.key] ?? 0;
          const selected = isUserSelected(opt);
          const shades = getOptionShades(opt.accentColor, selected);

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => castVote(opt)}
              disabled={Boolean(isMatchFinished || voting)}
              className={`relative overflow-hidden p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-between min-h-[66px] sm:min-h-[74px] active:scale-[0.98] group ${
                isMatchFinished ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:shadow-xs'
              } ${shades.cardClass}`}
            >
              {/* Progress Fill */}
              {pct > 0 && (
                <div
                  className={`absolute left-0 bottom-0 top-0 transition-all duration-500 pointer-events-none ${shades.progressFill}`}
                  style={{ width: `${pct}%` }}
                />
              )}

              {/* Top Option Label */}
              <div className="relative z-10 flex items-center justify-center gap-1.5 w-full px-1">
                <span className={`text-xs sm:text-sm tracking-tight truncate font-bold ${shades.labelColor}`}>
                  {opt.label}
                </span>
                {selected && (
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 font-bold ${shades.checkColor}`} />
                )}
              </div>

              {/* Sub-label helper if present */}
              {opt.sublabel && (
                <span className={`relative z-10 text-[9.5px] sm:text-[10.5px] truncate max-w-full px-0.5 leading-none my-0.5 ${shades.subText}`}>
                  {opt.sublabel}
                </span>
              )}

              {/* Percentage */}
              <div className="relative z-10 flex items-center gap-1.5 mt-1">
                <span className={`text-sm sm:text-base font-mono leading-none ${shades.percentText}`}>
                  {pct}%
                </span>
                {!selected && !isMatchFinished && (
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 opacity-80 group-hover:opacity-100">
                    {totalVotesCount === 0 ? '• Vote first' : '• Vote'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Full variant footer helper */}
      {isMatchFinished ? (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 pt-1 border-t border-[var(--border)]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Match has ended (FT) — voting is closed. Final community consensus recorded.
          </span>
          <span className="text-[10px] text-slate-400">
            Total: {totalVotesCount.toLocaleString()} votes
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 px-1 pt-1 border-t border-[var(--border)]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            You can vote as the match has not ended • Voting is live until kickoff
          </span>
          <span className="text-[10px] text-slate-400">
            Total: {totalVotesCount.toLocaleString()} votes
          </span>
        </div>
      )}
    </div>
  );
}
