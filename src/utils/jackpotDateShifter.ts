export function getJackpotEarliestTime(fixtures: any[]): Date | null {
  if (!fixtures || fixtures.length === 0) return null;
  const times = fixtures
    .map(f => {
      const val = f.kickoffTime || f.date || f.kickoff_time || f.time;
      const d = val ? new Date(val) : null;
      return d && !isNaN(d.getTime()) ? d.getTime() : null;
    })
    .filter((t): t is number => t !== null && !isNaN(t));
  if (times.length === 0) return null;
  return new Date(Math.min(...times));
}

export function getJackpotLatestTime(fixtures: any[]): Date | null {
  if (!fixtures || fixtures.length === 0) return null;
  const times = fixtures
    .map(f => {
      const val = f.kickoffTime || f.date || f.kickoff_time || f.time;
      const d = val ? new Date(val) : null;
      return d && !isNaN(d.getTime()) ? d.getTime() : null;
    })
    .filter((t): t is number => t !== null && !isNaN(t));
  if (times.length === 0) return null;
  return new Date(Math.max(...times));
}

export function getJackpotStatus(fixtures: any[]): 'upcoming' | 'started' | 'ended' {
  const earliest = getJackpotEarliestTime(fixtures);
  const latest = getJackpotLatestTime(fixtures);
  if (!earliest || !latest) return 'upcoming';

  const now = Date.now();
  // Jackpot has ended if the last match has completed (approx 2 hours after kickoff)
  if (now >= latest.getTime() + 2 * 60 * 60 * 1000) {
    return 'ended';
  }
  // Jackpot has started if the first match has kicked off
  if (now >= earliest.getTime()) {
    return 'started';
  }
  return 'upcoming';
}

export function getJackpotStatusDisplay(fixtures: any[]): {
  status: 'upcoming' | 'started' | 'ended';
  label: string;
  badgeText: string;
  badgeClass: string;
} {
  const status = getJackpotStatus(fixtures);
  if (status === 'ended') {
    return {
      status: 'ended',
      label: 'Completed and closed',
      badgeText: 'Completed and Closed',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold'
    };
  }
  if (status === 'started') {
    return {
      status: 'started',
      label: 'Live In Progress',
      badgeText: 'Live In Progress',
      badgeClass: 'bg-amber-400 text-slate-950 border border-amber-500 font-black animate-pulse'
    };
  }
  return {
    status: 'upcoming',
    label: 'Open / Not started',
    badgeText: 'Open • Not started',
    badgeClass: 'bg-emerald-700 text-white border border-emerald-700 font-bold'
  };
}

export interface JackpotDetailedTiming {
  earliestDate: Date | null;
  latestDate: Date | null;
  earliestKickoff: string | null;
  latestKickoff: string | null;
  formattedEarliest: string;
  formattedLatest: string;
  kickoffTimeText: string;
  kickoffHeader: string;
  kickoffWindowText: string;
  firstFixture: {
    id: number | string;
    position: number;
    homeTeam: string;
    awayTeam: string;
    kickoffTime: string;
    status?: string;
  } | null;
  lastFixture: {
    id: number | string;
    position: number;
    homeTeam: string;
    awayTeam: string;
    kickoffTime: string;
    status?: string;
  } | null;
  status: 'upcoming' | 'started' | 'ended';
  statusBadge: {
    label: string;
    badgeText: string;
    badgeClass: string;
  };
  durationHours: number;
  timeWindowText: string;
  targetCountdownTs: number;
  timerLabel: string;
  isLive: boolean;
  isCompleted: boolean;
  isUpcoming: boolean;
}

/**
 * Extracts and normalizes the earliest and last being played fixtures for any jackpot package.
 * Seamlessly leverages backend API fields (earliestKickoff, latestKickoff, firstFixture, lastFixture)
 * or dynamically computes them from the jackpot fixtures array.
 */
export function getJackpotDetailedTiming(jackpot: any): JackpotDetailedTiming {
  const fixtures = Array.isArray(jackpot?.fixtures) ? jackpot.fixtures : (Array.isArray(jackpot?.games) ? jackpot.games : []);

  let firstFixture = jackpot?.firstFixture || null;
  let lastFixture = jackpot?.lastFixture || null;

  let earliestTs: number | null = null;
  let latestTs: number | null = null;

  if (jackpot?.earliestKickoff) {
    const t = new Date(jackpot.earliestKickoff).getTime();
    if (!isNaN(t)) earliestTs = t;
  }
  if (jackpot?.latestKickoff) {
    const t = new Date(jackpot.latestKickoff).getTime();
    if (!isNaN(t)) latestTs = t;
  }

  // If fixtures are present, inspect all fixture kickoff times to locate the exact first and last games
  if (fixtures.length > 0) {
    let minFixture = fixtures[0];
    let maxFixture = fixtures[fixtures.length - 1];
    let foundMinTs: number | null = null;
    let foundMaxTs: number | null = null;

    fixtures.forEach((f: any, idx: number) => {
      const rawTime = f.kickoffTime || f.date || f.kickoff_time || f.time;
      if (!rawTime) return;
      const d = new Date(rawTime);
      const ts = d.getTime();
      if (!isNaN(ts)) {
        if (foundMinTs === null || ts < foundMinTs) {
          foundMinTs = ts;
          minFixture = { ...f, position: f.position || f.fixtureNumber || (idx + 1) };
        }
        if (foundMaxTs === null || ts > foundMaxTs) {
          foundMaxTs = ts;
          maxFixture = { ...f, position: f.position || f.fixtureNumber || (idx + 1) };
        }
      }
    });

    if (earliestTs === null && foundMinTs !== null) earliestTs = foundMinTs;
    if (latestTs === null && foundMaxTs !== null) latestTs = foundMaxTs;

    if (!firstFixture && minFixture) {
      firstFixture = {
        id: minFixture.id || 1,
        position: minFixture.position || minFixture.fixtureNumber || 1,
        homeTeam: minFixture.homeTeam || 'Home Team',
        awayTeam: minFixture.awayTeam || 'Away Team',
        kickoffTime: minFixture.kickoffTime || minFixture.date || '',
        status: minFixture.status || 'NS'
      };
    }

    if (!lastFixture && maxFixture) {
      lastFixture = {
        id: maxFixture.id || fixtures.length,
        position: maxFixture.position || maxFixture.fixtureNumber || fixtures.length,
        homeTeam: maxFixture.homeTeam || 'Home Team',
        awayTeam: maxFixture.awayTeam || 'Away Team',
        kickoffTime: maxFixture.kickoffTime || maxFixture.date || '',
        status: maxFixture.status || 'NS'
      };
    }
  }

  const earliestDate = earliestTs ? new Date(earliestTs) : null;
  const latestDate = latestTs ? new Date(latestTs) : null;

  const formatEAT = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return '';
    const dayStr = date.toLocaleDateString('en-GB', {
      timeZone: 'Africa/Nairobi',
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    const timeStr = date.toLocaleTimeString('en-GB', {
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${dayStr} ${timeStr} EAT`;
  };

  const formattedEarliest = formatEAT(earliestDate) || jackpot?.earliestKickoffEAT || jackpot?.nextGameStartTime || 'Saturday 16:30 EAT';
  const formattedLatest = formatEAT(latestDate) || jackpot?.latestKickoffEAT || 'Sunday 22:45 EAT';

  // Determine current matchday status
  const now = Date.now();
  const matchDurationMs = 2 * 60 * 60 * 1000;
  let status: 'upcoming' | 'started' | 'ended' = 'upcoming';

  if (earliestTs && now >= earliestTs) {
    if (latestTs && now >= (latestTs + matchDurationMs)) {
      status = 'ended';
    } else {
      status = 'started';
    }
  }

  const durationHours = (earliestTs && latestTs && latestTs >= earliestTs)
    ? Math.round(((latestTs - earliestTs) / (3600 * 1000)) * 10) / 10
    : (jackpot?.durationHours || 28);

  const timeWindowText = `${formattedEarliest} – ${formattedLatest}`;
  const kickoffWindowText = timeWindowText;

  // Kickoff time display text explicitly using first and last games for in progress and completed
  let kickoffTimeText = `First Game: ${formattedEarliest}`;
  let kickoffHeader = `Official Kickoff: ${formattedEarliest}`;
  let timerLabel = 'Kickoff Closes In:';
  let targetCountdownTs = earliestTs || 0;

  if (status === 'started') {
    kickoffTimeText = `First Game: ${formattedEarliest} • Final Game: ${formattedLatest}`;
    kickoffHeader = `Matches In Progress (First: ${formattedEarliest} | Final: ${formattedLatest})`;
    if (latestTs && now < latestTs) {
      timerLabel = 'Final Match Kicks Off In:';
      targetCountdownTs = latestTs;
    } else {
      timerLabel = 'Pool Window Concluding In:';
      targetCountdownTs = (latestTs || now) + matchDurationMs;
    }
  } else if (status === 'ended') {
    kickoffTimeText = `First Game: ${formattedEarliest} • Final Game: ${formattedLatest}`;
    kickoffHeader = `Completed (First: ${formattedEarliest} | Final: ${formattedLatest})`;
    timerLabel = 'Pool Completed & Closed';
    targetCountdownTs = 0;
  }

  const statusBadge = status === 'ended'
    ? {
        label: 'Completed and closed',
        badgeText: 'Completed and Closed',
        badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold'
      }
    : status === 'started'
    ? {
        label: 'Live In Progress',
        badgeText: 'Live In Progress',
        badgeClass: 'bg-amber-400 text-slate-950 border border-amber-500 font-black animate-pulse'
      }
    : {
        label: 'Open / Not started',
        badgeText: 'Pool Open',
        badgeClass: 'bg-emerald-600 text-white border border-emerald-700 font-bold'
      };

  return {
    earliestDate,
    latestDate,
    earliestKickoff: earliestDate ? earliestDate.toISOString() : (jackpot?.earliestKickoff || null),
    latestKickoff: latestDate ? latestDate.toISOString() : (jackpot?.latestKickoff || null),
    formattedEarliest,
    formattedLatest,
    kickoffTimeText,
    kickoffHeader,
    kickoffWindowText,
    firstFixture,
    lastFixture,
    status,
    statusBadge,
    durationHours,
    timeWindowText,
    targetCountdownTs,
    timerLabel,
    isLive: status === 'started',
    isCompleted: status === 'ended',
    isUpcoming: status === 'upcoming'
  };
}

export function getTargetDateForJackpot(jackpotId: string, referenceDate?: Date): Date {
  const now = referenceDate || new Date();
  const target = new Date(now);
  target.setSeconds(0);
  target.setMilliseconds(0);

  const getUpcomingDay = (dayOfWeek: number, hour: number, minute: number) => {
    const d = new Date(now);
    const currentDay = d.getDay();
    let daysToAdd = (dayOfWeek - currentDay + 7) % 7;
    if (daysToAdd === 0) {
      const targetUtcHour = hour - 3;
      if (d.getUTCHours() >= targetUtcHour) {
        daysToAdd = 7;
      }
    }
    d.setDate(d.getDate() + daysToAdd);
    d.setUTCHours(hour - 3, minute, 0, 0);
    return d;
  };

  const getPastDay = (dayOfWeek: number, hour: number, minute: number) => {
    const d = new Date(now);
    const currentDay = d.getDay();
    let daysToSubtract = (currentDay - dayOfWeek + 7) % 7;
    if (daysToSubtract === 0) {
      const targetUtcHour = hour - 3;
      if (d.getUTCHours() < targetUtcHour) {
        daysToSubtract = 7;
      }
    }
    d.setDate(d.getDate() - daysToSubtract);
    d.setUTCHours(hour - 3, minute, 0, 0);
    return d;
  };

  const id = (jackpotId || '').toLowerCase();

  // 1. Completed / Ended pool (e.g. Betika Midweek: started 2.5 days ago, all 15 matches settled)
  if (id.includes('betika-midweek')) {
    const endedStart = new Date(now);
    endedStart.setHours(now.getHours() - 60);
    return endedStart;
  }

  // 2. Live In Progress pools (first match started earlier today, final match later today/tomorrow)
  if (id.includes('mozzart-grand') || id.includes('mozzart-super-grand')) {
    const inProg = new Date(now);
    inProg.setHours(now.getHours() - 4);
    return inProg;
  }

  if (id.includes('daily') || id.includes('mozzart-super-daily')) {
    const dailyStart = new Date(now);
    dailyStart.setHours(now.getHours() - 1.5);
    return dailyStart;
  }

  // 3. Upcoming pools
  if (id.includes('sportpesa-midweek')) {
    return getUpcomingDay(3, 17, 0); // Wed 17:00 EAT
  }
  if (id.includes('betika-midweek')) {
    return getUpcomingDay(6, 13, 30); // Sat 13:30 EAT
  }
  if (id.includes('mozzart-grand')) {
    return getUpcomingDay(0, 10, 30); // Sun 10:30 EAT
  }
  if (id.includes('mozzart-super-daily')) {
    return getUpcomingDay(1, 15, 0); // Mon 15:00 EAT
  }

  // Default: SportPesa Mega (Sat 16:30 EAT)
  return getUpcomingDay(6, 16, 30);
}

export function getShiftedJackpotFixtures(jackpotId: string, originalFixtures: any[], referenceDate?: Date): any[] {
  if (!originalFixtures || originalFixtures.length === 0) return [];
  const now = referenceDate || new Date();
  const nowTs = now.getTime();

  // Find original earliest time
  const originalTimes = originalFixtures
    .map(f => f.kickoffTime ? new Date(f.kickoffTime).getTime() : null)
    .filter((t): t is number => t !== null && !isNaN(t));

  if (originalTimes.length === 0) return originalFixtures;

  const originalEarliest = Math.min(...originalTimes);
  const targetStart = getTargetDateForJackpot(jackpotId, now);
  const offset = targetStart.getTime() - originalEarliest;

  return originalFixtures.map(f => {
    if (!f.kickoffTime) return f;
    const originalTime = new Date(f.kickoffTime).getTime();
    if (isNaN(originalTime)) return f;
    const shiftedTime = new Date(originalTime + offset);
    const shiftedTs = shiftedTime.getTime();
    const matchDurationMs = 105 * 60 * 1000; // ~1h 45m match duration

    let status = f.status || 'NS';
    let result = f.result || 'pending';
    let homeScore = f.homeScore ?? 0;
    let awayScore = f.awayScore ?? 0;

    // Check if match has finished
    if (nowTs >= (shiftedTs + matchDurationMs)) {
      status = 'FT';
      const pred = (f.prediction || '').trim().toLowerCase();
      // Deterministic outcome based on match seed and confidence
      const seed = ((Number(f.id) || 1) * 37 + (Number(f.fixtureNumber) || 1) * 19 + (f.homeTeam?.length || 4)) % 100;
      const isWin = seed < (f.confidence || 82);

      if (isWin) {
        result = 'won';
        if (pred.includes('1x') || pred.includes('x1') || pred.includes('dc1x')) {
          homeScore = 2; awayScore = 1;
        } else if (pred.includes('x2') || pred.includes('2x') || pred.includes('dcx2')) {
          homeScore = 1; awayScore = 2;
        } else if (pred.includes('12') || pred.includes('dc12')) {
          homeScore = 2; awayScore = 0;
        } else if (pred.includes('(1)') || pred === '1' || pred.includes('home')) {
          homeScore = (seed % 2 === 0) ? 2 : 1; awayScore = 0;
        } else if (pred.includes('(x)') || pred === 'x' || pred.includes('draw')) {
          homeScore = 1; awayScore = 1;
        } else if (pred.includes('(2)') || pred === '2' || pred.includes('away')) {
          homeScore = 0; awayScore = (seed % 2 === 0) ? 2 : 1;
        } else if (pred.includes('over 2.5') || pred.includes('3+')) {
          homeScore = 2; awayScore = 1;
        } else if (pred.includes('under 2.5')) {
          homeScore = 1; awayScore = 0;
        } else if (pred.includes('gg') || pred.includes('btts')) {
          homeScore = 1; awayScore = 1;
        } else {
          homeScore = 2; awayScore = 1;
        }
      } else {
        result = 'lost';
        if (pred.includes('1x') || pred.includes('x1')) {
          homeScore = 0; awayScore = 1;
        } else if (pred.includes('x2') || pred.includes('2x')) {
          homeScore = 2; awayScore = 0;
        } else if (pred.includes('12')) {
          homeScore = 1; awayScore = 1;
        } else if (pred.includes('(1)') || pred === '1' || pred.includes('home')) {
          homeScore = 0; awayScore = 1;
        } else if (pred.includes('(x)') || pred === 'x' || pred.includes('draw')) {
          homeScore = 2; awayScore = 1;
        } else if (pred.includes('(2)') || pred === '2' || pred.includes('away')) {
          homeScore = 2; awayScore = 0;
        } else if (pred.includes('over 2.5') || pred.includes('3+')) {
          homeScore = 1; awayScore = 0;
        } else if (pred.includes('gg') || pred.includes('btts')) {
          homeScore = 2; awayScore = 0;
        } else {
          homeScore = 0; awayScore = 1;
        }
      }
    } else if (nowTs >= shiftedTs) {
      // Match is currently live
      const elapsedMins = (nowTs - shiftedTs) / (60 * 1000);
      status = (elapsedMins >= 45 && elapsedMins <= 60) ? 'HT' : 'LIVE';
      result = 'pending';
      homeScore = 1;
      awayScore = 0;
    } else {
      // Upcoming match
      status = 'NS';
      result = 'pending';
      homeScore = 0;
      awayScore = 0;
    }

    return {
      ...f,
      kickoffTime: shiftedTime.toISOString(),
      status,
      result,
      homeScore,
      awayScore
    };
  });
}

export function sortJackpotsByStatusAndTime<T extends { fixtures?: any[]; id?: string }>(jackpotsList: T[]): T[] {
  if (!jackpotsList || jackpotsList.length === 0) return [];
  return [...jackpotsList].sort((a, b) => {
    const statusA = getJackpotStatus(a.fixtures || []);
    const statusB = getJackpotStatus(b.fixtures || []);

    const rank = (s: string) => {
      if (s === 'upcoming') return 1; // Open / Upcoming
      if (s === 'started') return 2;  // In-progress / Live
      return 3;                       // Closed / Ended
    };

    const rankA = rank(statusA);
    const rankB = rank(statusB);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    const timeA = getJackpotEarliestTime(a.fixtures || [])?.getTime() || 0;
    const timeB = getJackpotEarliestTime(b.fixtures || [])?.getTime() || 0;
    return timeA - timeB;
  });
}

export function formatJackpotStartTime(fixtures: any[], defaultVal: string): string {
  return defaultVal;
}
