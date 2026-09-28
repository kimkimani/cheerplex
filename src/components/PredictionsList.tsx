import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp,
  Award,
  BookOpen,
  Check,
  X,
  Calendar
} from 'lucide-react';
import { Fixture } from '../types';
import { calculateProbabilities, getRefinedConfidence } from '../utils/probability';
import VotePoll from './VotePoll';
import VoteNudgeSnippet from './VoteNudgeSnippet';
import { FlagImage } from '../utils/flagUtils';
import { formatTime } from '../utils/timeUtils';
import { getFixtureDateKey } from '../utils/predictionGenerator';
import FixtureRow from './FixtureRow';

interface PredictionsListProps {
  fixtures: Fixture[];
  title: string;
  subtitle: string;
  isLoading?: boolean;
  showTodayTags?: boolean;
  groupByDate?: boolean;
  pageType?: string;
}

export function MinimalShimmerLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden space-y-4 animate-pulse"
        >
          {/* Top league shimmer */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
          </div>

          {/* Teams matchup shimmer */}
          <div className="grid grid-cols-12 gap-3 items-center py-2">
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
            </div>
            <div className="col-span-2 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="col-span-5 flex items-center justify-end gap-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            </div>
          </div>

          {/* 3-way odds shimmer */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function isSameDay(dateStr?: string, targetDate?: Date) {
  if (!dateStr || !targetDate) return false;
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T'));
  if (isNaN(d.getTime())) return true;
  return d.toDateString() === targetDate.toDateString();
}

export function getDateGroupInfo(dateKey: string, refDate: Date = new Date()): {
  label: string;
  subLabel: string;
  badgeText: string;
  badgeStyle: string;
} {
  if (!dateKey || dateKey === 'unknown') {
    return {
      label: 'Scheduled Matches',
      subLabel: 'Upcoming tips',
      badgeText: 'Fixtures',
      badgeStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    };
  }

  const [yStr, mStr, dStr] = dateKey.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);
  const d = new Date(year, month, day);

  if (isNaN(d.getTime())) {
    return {
      label: dateKey,
      subLabel: '',
      badgeText: dateKey,
      badgeStyle: 'bg-slate-100 text-black border-slate-300',
    };
  }

  const todayMidnight = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  const targetMidnight = new Date(year, month, day);
  const diffDays = Math.round((targetMidnight.getTime() - todayMidnight.getTime()) / (24 * 60 * 60 * 1000));

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = daysOfWeek[d.getDay()];
  const monthName = months[d.getMonth()];
  const shortMonthName = shortMonths[d.getMonth()];

  if (diffDays === 1) {
    return {
      label: 'Tomorrow',
      subLabel: `${dayName}, ${day} ${monthName} ${year}`,
      badgeText: 'Tomorrow',
      badgeStyle: 'bg-slate-100 text-black border-slate-300',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Today',
      subLabel: `${dayName}, ${day} ${monthName} ${year}`,
      badgeText: 'Today',
      badgeStyle: 'bg-slate-100 text-black border-slate-300',
    };
  }

  if (diffDays === -1) {
    return {
      label: 'Yesterday',
      subLabel: `${dayName}, ${day} ${monthName} ${year}`,
      badgeText: 'Yesterday',
      badgeStyle: 'bg-slate-100 text-black border-slate-300',
    };
  }

  return {
    label: `${dayName} ${day} ${monthName} ${year}`,
    subLabel: `${dayName}, ${day} ${shortMonthName} ${year}`,
    badgeText: `${dayName.slice(0, 3)} ${day}`,
    badgeStyle: 'bg-slate-100 text-black border-slate-300',
  };
}

export default function PredictionsList({
  fixtures,
  title,
  subtitle,
  isLoading = false,
  showTodayTags,
  groupByDate = true,
  pageType
}: PredictionsListProps) {
  const [expandedFixture, setExpandedFixture] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'yesterday' | 'today' | 'tomorrow'>('all');

  // Deduplicate & Sort fixtures: latest date first, and within date earliest kickoff first
  const sortedFixtures = useMemo(() => {
    const map = new Map<string, Fixture>();
    (fixtures || []).forEach((f, idx) => {
      if (f) {
        const idKey = String(f.id ?? f.fixtureRef ?? (f.homeTeam && f.awayTeam ? `${f.homeTeam}-${f.awayTeam}` : `fix-${idx}`));
        if (!map.has(idKey)) {
          map.set(idKey, f);
        }
      }
    });
    const list = Array.from(map.values());
    return list.sort((a, b) => {
      const dayA = a.kickoffTime ? getFixtureDateKey(a.kickoffTime) : '';
      const dayB = b.kickoffTime ? getFixtureDateKey(b.kickoffTime) : '';
      if (dayA !== dayB) {
        return dayB.localeCompare(dayA); // Most latest date first
      }
      const timeA = a.kickoffTime ? new Date(a.kickoffTime.includes('T') ? a.kickoffTime : a.kickoffTime.replace(' ', 'T')).getTime() || 0 : 0;
      const timeB = b.kickoffTime ? new Date(b.kickoffTime.includes('T') ? b.kickoffTime : b.kickoffTime.replace(' ', 'T')).getTime() || 0 : 0;
      return timeA - timeB; // Earliest kickoff within the same day
    });
  }, [fixtures]);

  const displayedFixtures = useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let list = sortedFixtures;
    if (dateFilter === 'yesterday') {
      list = sortedFixtures.filter(f => isSameDay(f.kickoffTime, yesterday));
    } else if (dateFilter === 'today') {
      list = sortedFixtures.filter(f => isSameDay(f.kickoffTime, now));
    } else if (dateFilter === 'tomorrow') {
      list = sortedFixtures.filter(f => isSameDay(f.kickoffTime, tomorrow));
    }

    return list.map(fixture => {
      const isCompleted = fixture.status === 'FT';
      const isWon = fixture.result === 'won';
      const isLost = fixture.result === 'lost';
      
      const pLower = (fixture.prediction || '').toLowerCase();
      const isDoubleChance = pLower.includes('double chance') || 
                             pLower.includes('1x') || 
                             pLower.includes('x1') || 
                             pLower.includes('x2') || 
                             pLower.includes('2x') || 
                             pLower.includes('12') ||
                             pLower.includes('21');

      const is3PlusGoals = pLower.includes('over 2.5') || 
                           pLower.includes('ov 2.5') || 
                           pLower.includes('o2.5') || 
                           pLower.includes('over25') || 
                           pLower.includes('ov 25') || 
                           pLower.includes('> 2.5') || 
                           pLower.includes('>2.5') ||
                           pLower.includes('3+ goals') ||
                           pLower.includes('3+') ||
                           pLower === '2.5 goals';

      const is2PlusGoals = !is3PlusGoals && (
                           pLower.includes('over 1.5') || 
                           pLower.includes('ov 1.5') || 
                           pLower.includes('o1.5') || 
                           pLower.includes('over15') || 
                           pLower.includes('ov 15') || 
                           pLower.includes('> 1.5') || 
                           pLower.includes('>1.5') ||
                           pLower.includes('2+ goals') ||
                           pLower.includes('2+') ||
                           pLower === '1.5 goals');

      const displayConf = getRefinedConfidence(fixture);
      const probs = calculateProbabilities(
        fixture.prediction,
        displayConf,
        fixture.probabilities || fixture
      );

      let desktopRowStyle = "";
      if (isCompleted) {
        if (isWon) {
          desktopRowStyle = "bg-blue-500/[0.015] hover:bg-blue-500/[0.03] dark:bg-blue-500/[0.02]";
        } else if (isLost) {
          desktopRowStyle = "bg-slate-500/[0.005] hover:bg-slate-500/[0.015] opacity-90";
        }
      } else if (fixture.status === 'LIVE' || fixture.status === 'HT') {
        desktopRowStyle = "bg-rose-500/[0.02]";
      }

      return {
        ...fixture,
        isCompleted,
        isWon,
        isLost,
        isDoubleChance,
        is3PlusGoals,
        is2PlusGoals,
        displayConf,
        probs,
        desktopRowStyle
      };
    });
  }, [sortedFixtures, dateFilter]);

  const dateGroups = useMemo(() => {
    if (!groupByDate) return null;
    const groupsMap = new Map<string, typeof displayedFixtures>();

    displayedFixtures.forEach(fixture => {
      const dateKey = getFixtureDateKey(fixture.kickoffTime) || 'unknown';
      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, []);
      }
      groupsMap.get(dateKey)!.push(fixture);
    });

    const groups: Array<{
      dateKey: string;
      label: string;
      subLabel: string;
      badgeText: string;
      badgeStyle: string;
      fixtures: typeof displayedFixtures;
    }> = [];

    const today = new Date();
    groupsMap.forEach((groupFixtures, dateKey) => {
      const info = getDateGroupInfo(dateKey, today);
      groups.push({
        dateKey,
        label: info.label,
        subLabel: info.subLabel,
        badgeText: info.badgeText,
        badgeStyle: info.badgeStyle,
        fixtures: groupFixtures
      });
    });

    return groups;
  }, [displayedFixtures, groupByDate]);

  const toggleExpand = (id: number) => {
    setExpandedFixture(expandedFixture === id ? null : id);
  };

  const isLiveMatch = (status?: string) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return ['LIVE', '1H', '2H', 'HT', 'ET', 'P', 'PEN', 'BT', 'IN PLAY'].includes(s) || s.includes('LIVE');
  };

  const getStatusColor = (status: Fixture['status']) => {
    const s = (status || '').toUpperCase();
    if (isLiveMatch(s)) {
      if (s === 'HT') return 'bg-amber-500 text-slate-950 font-black animate-pulse';
      return 'bg-rose-600 text-white font-black animate-pulse shadow-xs';
    }
    if (s === 'FT' || s === 'AET' || s === 'AP') return 'bg-slate-800 dark:bg-slate-700 text-white font-bold';
    if (s === 'NS') return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold';
    return 'bg-slate-700 text-white font-bold';
  };

  const getResultBadge = (fixture: Fixture, showScore = true) => {
    const { result, homeScore, awayScore, status } = fixture;
    const scoreText = (status === 'FT' || status === 'LIVE' || status === 'HT') ? `${homeScore} - ${awayScore}` : '—';
    
    if (result === 'won') {
      return (
        <span className="flex items-center gap-1 text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md font-mono shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" /> {showScore ? scoreText : null}
        </span>
      );
    }
    if (result === 'lost') {
      return (
        <span className="flex items-center gap-1 text-[10px] bg-slate-600 text-white font-black px-2 py-0.5 rounded-md font-mono">
          <XCircle className="w-3.5 h-3.5 text-white shrink-0" /> {showScore ? scoreText : null}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md border border-[var(--border)] font-mono">
        <Clock className="w-3 h-3 text-slate-400 shrink-0" /> {showScore ? 'PENDING' : null}
      </span>
    );
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

  return (
    <div className="space-y-5 text-left">
      {/* 1. CHEERPLEX MATCH HUB HEADER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text)] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-[var(--border)] text-slate-800 dark:text-slate-200">
            {displayedFixtures.length} Verified Picks
          </span>
        </div>
      </div>

      {/* 2. CHEERPLEX MATCH CARDS STREAM */}
      <div className="space-y-4">
        {isLoading ? (
          <MinimalShimmerLoader count={3} />
        ) : displayedFixtures.length === 0 ? (
          <div className="p-8 md:p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Calendar className="w-6 h-6 text-slate-400 shrink-0" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-sm font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                No Fixtures Scheduled
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                There are currently no active predictions available for this category. Please check back shortly or explore our jackpot and VIP selections.
              </p>
            </div>
          </div>
        ) : dateGroups && dateGroups.length > 0 ? (
          dateGroups.map((group) => (
            <div key={`group-${group.dateKey}`} className="space-y-3">
              {/* Date Group Header Divider */}
              <div 
                id={`date-group-${group.dateKey}`}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs select-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {group.badgeText}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {group.label}
                    </span>
                    {group.subLabel && group.subLabel !== group.label && (
                      <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">
                        • {group.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                    {group.fixtures.length} {group.fixtures.length === 1 ? 'Match' : 'Matches'}
                  </span>
                </div>
              </div>

              {/* Cards for this Date */}
              <div className="space-y-3">
                {group.fixtures.map((fixture, idx) => (
                  <FixtureRow
                    key={`fixture-grp-${group.dateKey}-${fixture.id ?? fixture.fixtureRef ?? idx}-${idx}`}
                    fixture={fixture}
                    isExpanded={expandedFixture === fixture.id}
                    toggleExpand={toggleExpand}
                    getStatusColor={getStatusColor}
                    getResultBadge={getResultBadge}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {displayedFixtures.map((fixture, idx) => (
              <FixtureRow
                key={`fixture-flat-${fixture.id ?? fixture.fixtureRef ?? idx}-${idx}`}
                fixture={fixture}
                isExpanded={expandedFixture === fixture.id}
                toggleExpand={toggleExpand}
                getStatusColor={getStatusColor}
                getResultBadge={getResultBadge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
