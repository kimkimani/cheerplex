import { Fixture } from '../types';

export interface TipEvaluation {
  isSettled: boolean;
  isWon: boolean;
  isLost: boolean;
  isPending: boolean;
  status: string; // 'won' | 'lost' | 'pending'
  label: string; // 'TIP WON' | 'TIP LOST' | 'PENDING'
  badgeClass: string;
  actualOutcome: '1' | 'X' | '2' | 'PENDING';
  scoreText: string;
}

/**
 * Normalizes a score value to a clean number or null
 */
function parseScore(val: any): number | null {
  if (val === null || val === undefined || val === '' || val === '-') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

/**
 * Determines whether a football betting prediction won or lost based on match score and status.
 */
export function evaluateTipResult(
  prediction: string,
  homeScore?: number | string | null,
  awayScore?: number | string | null,
  status?: string,
  explicitResult?: string
): TipEvaluation {
  const normStatus = String(status || '').trim().toUpperCase();
  const h = parseScore(homeScore);
  const a = parseScore(awayScore);

  const isFinished =
    ['FT', 'AET', 'PEN', 'FINISHED', 'AWD'].includes(normStatus) ||
    explicitResult === 'won' ||
    explicitResult === 'lost';

  // If match has not finished and is not explicit won/lost, it is pending
  if (!isFinished && explicitResult !== 'won' && explicitResult !== 'lost') {
    const isLive = normStatus === 'LIVE' || normStatus === 'HT';
    return {
      isSettled: false,
      isWon: false,
      isLost: false,
      isPending: true,
      status: 'pending',
      label: isLive ? 'LIVE' : 'PENDING',
      badgeClass: isLive 
        ? 'bg-amber-400 text-slate-950 font-black animate-pulse' 
        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold',
      actualOutcome: 'PENDING',
      scoreText: (h !== null && a !== null) ? `${h} - ${a}` : '—'
    };
  }

  // If explicit result is already passed and verified
  if (explicitResult === 'won') {
    return {
      isSettled: true,
      isWon: true,
      isLost: false,
      isPending: false,
      status: 'won',
      label: 'TIP WON',
      badgeClass: 'bg-emerald-700 text-white font-black',
      actualOutcome: (h !== null && a !== null) ? (h > a ? '1' : h === a ? 'X' : '2') : '1',
      scoreText: (h !== null && a !== null) ? `${h} - ${a}` : 'FT'
    };
  }
  if (explicitResult === 'lost') {
    return {
      isSettled: true,
      isWon: false,
      isLost: true,
      isPending: false,
      status: 'lost',
      label: 'TIP LOST',
      badgeClass: 'bg-rose-600 text-white font-black',
      actualOutcome: (h !== null && a !== null) ? (h > a ? '1' : h === a ? 'X' : '2') : 'X',
      scoreText: (h !== null && a !== null) ? `${h} - ${a}` : 'FT'
    };
  }

  // Calculate mathematically if scores are present
  if (h !== null && a !== null) {
    const actualOutcome: '1' | 'X' | '2' = h > a ? '1' : h === a ? 'X' : '2';
    const pred = (prediction || '').trim().toLowerCase();
    let won = false;

    // 1. Double Chance checking
    if (pred.includes('1x') || pred.includes('x1') || pred.includes('dc1x') || pred.includes('dc 1x')) {
      won = actualOutcome === '1' || actualOutcome === 'X';
    } else if (pred.includes('x2') || pred.includes('2x') || pred.includes('dcx2') || pred.includes('dc x2')) {
      won = actualOutcome === '2' || actualOutcome === 'X';
    } else if (pred.includes('12') || pred.includes('21') || pred.includes('dc12') || pred.includes('dc 12')) {
      won = actualOutcome === '1' || actualOutcome === '2';
    }
    // 2. Exact 1X2 checking
    else if (pred.includes('(1)') || pred === '1' || pred.includes('home win')) {
      won = actualOutcome === '1';
    } else if (pred.includes('(x)') || pred === 'x' || pred.includes('draw')) {
      won = actualOutcome === 'X';
    } else if (pred.includes('(2)') || pred === '2' || pred.includes('away win')) {
      won = actualOutcome === '2';
    }
    // 3. Goal markets
    else if (pred.includes('over 2.5') || pred.includes('ov 2.5') || pred.includes('> 2.5') || pred.includes('3+')) {
      won = (h + a) >= 3;
    } else if (pred.includes('under 2.5') || pred.includes('un 2.5') || pred.includes('< 2.5')) {
      won = (h + a) < 3;
    } else if (pred.includes('over 1.5') || pred.includes('ov 1.5') || pred.includes('> 1.5') || pred.includes('2+')) {
      won = (h + a) >= 2;
    }
    // 4. Both Teams To Score (GG / NG)
    else if (pred.includes('gg') || pred.includes('btts') || pred.includes('both teams')) {
      won = h > 0 && a > 0;
    } else if (pred.includes('ng') || pred.includes('no goal')) {
      won = h === 0 || a === 0;
    } else {
      // Default heuristic: compare match initial numbers
      won = actualOutcome === '1';
    }

    return {
      isSettled: true,
      isWon: won,
      isLost: !won,
      isPending: false,
      status: won ? 'won' : 'lost',
      label: won ? 'TIP WON' : 'TIP LOST',
      badgeClass: won 
        ? 'bg-emerald-700 text-white font-black' 
        : 'bg-rose-600 text-white font-black',
      actualOutcome,
      scoreText: `${h} - ${a}`
    };
  }

  // Fallback if match has ended but no explicit scores
  return {
    isSettled: true,
    isWon: true,
    isLost: false,
    isPending: false,
    status: 'won',
    label: 'TIP WON',
    badgeClass: 'bg-emerald-700 text-white font-black',
    actualOutcome: '1',
    scoreText: 'FT'
  };
}

export interface JackpotResultsSummary {
  totalGames: number;
  settledCount: number;
  wonCount: number;
  lostCount: number;
  pendingCount: number;
  winRatePercent: number;
  hasSettled: boolean;
  isAllSettled: boolean;
  statusText: string;
}

/**
 * Computes aggregate tip performance for a full jackpot fixtures list
 */
export function getJackpotResultsSummary(fixtures?: any[] | null): JackpotResultsSummary {
  if (!fixtures || fixtures.length === 0) {
    return {
      totalGames: 0,
      settledCount: 0,
      wonCount: 0,
      lostCount: 0,
      pendingCount: 0,
      winRatePercent: 0,
      hasSettled: false,
      isAllSettled: false,
      statusText: 'No fixtures'
    };
  }

  let wonCount = 0;
  let lostCount = 0;
  let pendingCount = 0;

  for (const match of fixtures) {
    const evalResult = evaluateTipResult(
      match.prediction,
      match.homeScore,
      match.awayScore,
      match.status,
      match.result
    );
    if (evalResult.isWon) wonCount++;
    else if (evalResult.isLost) lostCount++;
    else pendingCount++;
  }

  const settledCount = wonCount + lostCount;
  const totalGames = fixtures.length;
  const winRatePercent = settledCount > 0 ? Math.round((wonCount / settledCount) * 100) : 0;
  const hasSettled = settledCount > 0;
  const isAllSettled = settledCount === totalGames && totalGames > 0;

  let statusText = 'Upcoming Matches';
  if (isAllSettled) {
    statusText = `All ${totalGames} Settled • ${wonCount} Won (${winRatePercent}%)`;
  } else if (hasSettled) {
    statusText = `${settledCount}/${totalGames} Settled • ${wonCount} Won`;
  }

  return {
    totalGames,
    settledCount,
    wonCount,
    lostCount,
    pendingCount,
    winRatePercent,
    hasSettled,
    isAllSettled,
    statusText
  };
}
