import React, { useState, useEffect, useMemo } from 'react';
import { 
  expandTopFixturesParameters, 
  fetchLiveJackpotFixtures, 
  fetchLiveMegaJackpotFixtures, 
  getCachedLiveJackpotFixtures, 
  isDoubleChanceTip,
  resolveJackpotId
} from '../utils/topJackpotFixtures';
import { 
  getCachedLiveTodayFixtures, 
  fetchLiveTodayFixtures 
} from '../utils/todayFixturesTags';
import { Fixture } from '../types';
import { getLinkRel } from '../utils/linkUtils';
import { Crown, Users, Star, ArrowRight, ExternalLink, ChevronDown, ChevronUp, Check, CheckCircle2, XCircle, Lock, Clock, ShieldCheck, Zap, Info, Sparkles, HelpCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';
import JackpotCountdownTimer from './JackpotCountdownTimer';
import VotePoll from './VotePoll';
import { evaluateTipResult } from '../utils/jackpotResultsEvaluator';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  postSlug?: string;
  fixtures?: Fixture[];
  jackpotId?: string;
}

/**
 * Resolves a local or relative image URL within a post to the public /blog-assets/[slug]/ URL
 */
function resolveRelativeImageUrl(url: string, postSlug?: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  const cleanUrl = url.replace(/^\.\//, '');
  return `/${cleanUrl}`;
}

function formatMathLatex(expr: string): string {
  return expr
    .replace(/\\times/g, '×')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\ge(q)?/g, '≥')
    .replace(/\\le(q)?/g, '≤')
    .replace(/\\pm/g, '±')
    .replace(/\^\{17\}/g, '¹⁷')
    .replace(/\^\{(\d+)\}/g, (_, p) => p.split('').map((c: string) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[parseInt(c, 10)] || c).join(''))
    .replace(/\^N/g, 'ᴺ')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\{|\}/g, '')
    .trim();
}

// Parses inline markdown formatting (images: ![alt](url), links: [text](url), bold: **text** or __text__, math: $formula$, italic: *text* or _text_, code: `text`)
function parseInline(text: string, postSlug?: string): React.ReactNode[] {
  if (!text) return [];

  // Match:
  // 1: ![alt](url) -> match[2] = alt, match[3] = url
  // 2: [text](url) -> match[5] = text, match[6] = url
  // 3: **text** or __text__ -> match[7] or match[8]
  // 4: `code` -> match[9]
  // 5: $math$ -> match[10]
  // 6: *text* or _text_ -> match[11] or match[12]
  const regex = /(!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\$([^$]+)\$|\*([^*]+)\*|_([^_]+)_)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    if (match[1] && match[1].startsWith('!')) {
      // Inline Image ![alt](url)
      const altText = match[2] || 'Illustration';
      const rawImgUrl = match[3];
      const imgUrl = resolveRelativeImageUrl(rawImgUrl, postSlug);
      nodes.push(
        <img
          key={`img-${matchStart}`}
          src={imgUrl}
          alt={altText}
          className="inline-block max-w-full h-auto rounded-lg border border-[var(--border)] my-1 align-middle"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      );
    } else if (match[4] && match[5]) {
      // Link [text](url)
      const linkText = match[4];
      const linkUrl = match[5];
      const isExternal = linkUrl.startsWith('http');
      nodes.push(
        <a
          key={`link-${matchStart}`}
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={getLinkRel(linkUrl)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors"
        >
          {linkText}
        </a>
      );
    } else if (match[6] || match[7]) {
      // Bold **text** or __text__
      nodes.push(
        <strong key={`bold-${matchStart}`} className="font-bold text-[var(--text)]">
          {match[6] || match[7]}
        </strong>
      );
    } else if (match[8]) {
      // Inline code `text`
      nodes.push(
        <code key={`code-${matchStart}`} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-[var(--text)]">
          {match[8]}
        </code>
      );
    } else if (match[9]) {
      // Math formula $formula$
      nodes.push(
        <span key={`math-${matchStart}`} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 font-mono text-[12px] font-bold border border-slate-300 dark:border-slate-700 mx-1 tracking-tight align-baseline shadow-3xs">
          {formatMathLatex(match[9])}
        </span>
      );
    } else if (match[10] || match[11]) {
      // Italic *text* or _text_
      nodes.push(
        <em key={`italic-${matchStart}`} className="italic text-[var(--text)]">
          {match[10] || match[11]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

interface CompactJackpotTopConfidenceSectionProps {
  items: Array<{
    matchTeams: string;
    matchTip: string;
    isHighest: boolean;
    highestSuffixText: string;
    explanation: string;
  }>;
  postSlug?: string;
}

function CompactJackpotTopConfidenceSection({ items, postSlug }: CompactJackpotTopConfidenceSectionProps) {
  const [filter, setFilter] = useState<'all' | 'dc'>('all');

  const dcItems = useMemo(() => {
    return items.filter(item => isDoubleChanceTip(item.matchTip));
  }, [items]);

  const displayedItems = filter === 'dc' ? dcItems : items;

  return (
    <div className="my-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
      {/* Compact Top Header Bar with Filter Tags */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold   tracking-wider text-[var(--text)]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Top Confidence Picks</span>
        </div>

        {/* Filter Tags: All vs Double Chance Only */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] bg-slate-100 dark:bg-slate-800'
            }`}
          >
            All Picks ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('dc')}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'dc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-850'
            }`}
          >
            <span>Double Chance</span>
            <span className="text-[9px] opacity-85">({dcItems.length})</span>
          </button>
        </div>
      </div>

      {/* Compact Fixtures List */}
      <div className="divide-y divide-[var(--border)]">
        {displayedItems.length === 0 ? (
          <div className="p-3 text-center text-xs font-mono text-[var(--text-muted)]">
            No double chance fixtures found in this selection.
          </div>
        ) : (
          displayedItems.map((item, idx) => {
            const isDC = isDoubleChanceTip(item.matchTip);
            return (
              <div
                key={`fix-item-${idx}`}
                className={`px-3 py-2 transition-colors ${
                  item.isHighest
                    ? 'bg-blue-50/40 dark:bg-blue-950/20 border-l-2 border-l-blue-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-xs text-[var(--text)] truncate">
                      {item.matchTeams}
                    </span>
                    <span className="text-slate-400 text-xs font-normal shrink-0">—</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-[10px] shrink-0 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                      {item.matchTip}
                    </span>
                    {isDC && (
                      <span className="text-[9px] font-mono font-bold   tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                        DC
                      </span>
                    )}
                  </div>
                  {item.isHighest && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold font-mono   tracking-wider bg-blue-600 text-white shrink-0 shadow-xs">
                      Highest Confidence
                    </span>
                  )}
                </div>
                {item.explanation && (
                  <p className="text-[11px] text-[var(--text-muted)] leading-normal mt-0.5 font-normal">
                    {parseInline(item.explanation, postSlug)}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface CompactAllJackpotFixturesSectionProps {
  items: Array<{
    gameNumber: number;
    matchTeams: string;
    prediction: string;
    isVipLocked: boolean;
    confidence: number | string;
    mostVoted: string;
    explanation: string;
  }>;
  postSlug?: string;
  jackpotId?: string;
  fixtures?: Fixture[];
}

export function parseAllFixtureLine(line: string): {
  gameNumber: number;
  matchTeams: string;
  prediction: string;
  isVipLocked: boolean;
  confidence: number | string;
  mostVoted: string;
} | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Must have ' vs ' and an em-dash/hyphen separator
  if (!/\s+vs\s+/i.test(trimmed) || !/[—–-]/.test(trimmed)) return null;

  // Check for presence of jackpot clues or metadata
  const hasJackpotClues =
    /^(?:###\s+|\*\*)?(?:Game|Match|\d+\.)/i.test(trimmed) ||
    /confidence:/i.test(trimmed) ||
    /cheerplex\s*tip:/i.test(trimmed) ||
    /database\s*tip:/i.test(trimmed) ||
    /community\s*votes/i.test(trimmed) ||
    /user\s*votes/i.test(trimmed) ||
    /user\s*tip/i.test(trimmed) ||
    /most\s*voted/i.test(trimmed);

  if (!hasJackpotClues) return null;

  // Look for metadata part e.g. (Confidence: 85% | Community Votes: 2 (Away)) or (Confidence: 85% | User Votes: 2 (Away))
  const metaIndex = trimmed.lastIndexOf('(Confidence:');
  let mainPart = trimmed;
  let metaPart = '';
  if (metaIndex !== -1) {
    mainPart = trimmed.substring(0, metaIndex).trim();
    metaPart = trimmed.substring(metaIndex).trim().replace(/^\(|\)$/g, '');
  }

  const headerMatch = mainPart.match(
    /^(?:###\s+|\*\*)?(?:(?:Game|Match)\s*(\d+)?:?|(\d+)\.)?\s*(.+?\s+vs\s+.+?)\s*[—–-]\s*(.+?)(?:\*\*)?$/i
  );
  if (!headerMatch) return null;

  const gameNumber = parseInt(headerMatch[1] || headerMatch[2] || '0', 10) || 1;
  const matchTeams = headerMatch[3].trim();
  let rawTip = headerMatch[4].trim();

  // Strip leading "Database Tip:" or "Cheerplex Tip:" if present
  rawTip = rawTip.replace(/^(?:Database|Cheerplex|SokaKing|DB)\s*Tip:\s*/i, '').trim();

  const isVipLocked = /vip/i.test(rawTip) || /join vip/i.test(rawTip);
  const prediction = isVipLocked ? 'Join VIP' : rawTip.replace(/[\[\]]/g, '').trim();

  let confidence = '75%';
  const confMatch = metaPart.match(/Confidence:\s*(\d+%?)/i);
  if (confMatch) confidence = confMatch[1].includes('%') ? confMatch[1] : `${confMatch[1]}%`;

  let mostVoted = '';
  const voteMatch = metaPart.match(/(?:Community\s*Votes|User\s*(?:Votes\/Tip|Votes|Tip)|Most\s*Voted):\s*([^|]+)/i);
  if (voteMatch) {
    let rawVote = voteMatch[1].trim();
    // Normalize legacy formats like "2 - 53%" into "2 (Away)"
    const legacyDashMatch = rawVote.match(/^([1X2]|DC[1X2]+)\s*-\s*\d+%/i);
    if (legacyDashMatch) {
      const voteTip = legacyDashMatch[1].toUpperCase();
      let label = 'Home';
      if (voteTip === '2') label = 'Away';
      else if (voteTip === 'X') label = 'Draw';
      else if (voteTip === '1X' || voteTip === 'DC1X') label = 'Home/Draw';
      else if (voteTip === 'X2' || voteTip === 'DCX2') label = 'Draw/Away';
      else if (voteTip === '12' || voteTip === 'DC12') label = 'Home/Away';
      rawVote = `${voteTip} (${label})`;
    }
    mostVoted = rawVote;
  } else {
    mostVoted = !isVipLocked ? `${prediction} (Away)` : '2 (Away)';
  }

  return {
    gameNumber,
    matchTeams,
    prediction,
    isVipLocked,
    confidence,
    mostVoted
  };
}

function CompactAllJackpotFixturesSection({
  items,
  postSlug,
  jackpotId = 'sportpesa-mega',
  fixtures
}: CompactAllJackpotFixturesSectionProps) {
  const [filter, setFilter] = useState<'all' | 'free' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'game' | 'confidence'>('game');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showPolls, setShowPolls] = useState<boolean>(true);
  const [hiddenPollGames, setHiddenPollGames] = useState<Record<number, boolean>>({});

  const togglePollGame = (gameNumber: number) => {
    setHiddenPollGames(prev => ({
      ...prev,
      [gameNumber]: !prev[gameNumber]
    }));
  };

  const freeItems = useMemo(() => items.filter(i => !i.isVipLocked), [items]);
  const vipItems = useMemo(() => items.filter(i => i.isVipLocked), [items]);

  const displayedItems = useMemo(() => {
    let list = filter === 'free' ? freeItems : filter === 'vip' ? vipItems : items;
    if (sortBy === 'confidence') {
      return [...list].sort((a, b) => {
        const cA = parseInt(String(a.confidence), 10) || 0;
        const cB = parseInt(String(b.confidence), 10) || 0;
        return cB - cA;
      });
    }
    return [...list].sort((a, b) => a.gameNumber - b.gameNumber);
  }, [items, freeItems, vipItems, filter, sortBy]);

  const allPollsVisible = useMemo(() => {
    return showPolls && displayedItems.length > 0 && !displayedItems.some(item => hiddenPollGames[item.gameNumber]);
  }, [displayedItems, showPolls, hiddenPollGames]);

  const toggleAllPolls = () => {
    if (allPollsVisible) {
      setShowPolls(false);
      setHiddenPollGames({});
    } else {
      setShowPolls(true);
      setHiddenPollGames({});
    }
  };

  const titleName = jackpotId.toLowerCase().includes('mega')
    ? 'SportPesa Mega Jackpot'
    : jackpotId.toLowerCase().includes('betika')
    ? 'Betika Midweek Jackpot'
    : jackpotId.toLowerCase().includes('mozzart')
    ? 'Mozzart Grand Jackpot'
    : 'Jackpot';

  const handleOpenMegaJackpotPayment = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('soka-open-payment', {
          detail: {
            packageName: `${titleName} VIP Slip`,
            price: 250,
            packageId: `${jackpotId}-vip`,
            packageSlug: jackpotId,
            packageType: 'jackpot'
          }
        })
      );
    }
    setPaymentModalOpen(true);
  };

  return (
    <div className="my-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center shrink-0">
            <Crown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--text)]">
              <span>{titleName} — All {items.length} Fixtures</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <div className="text-[10.5px] font-mono text-[var(--text-muted)]">
              Showing 2/3 Free Predictions ({freeItems.length}) • 1/3 VIP Slips ({vipItems.length})
            </div>
          </div>
        </div>

        {/* Filter & Voting Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] bg-slate-100 dark:bg-slate-800'
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('free')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              filter === 'free'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60'
            }`}
          >
            Free ({freeItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('vip')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'vip'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-[var(--border)]'
            }`}
          >
            <span>VIP ({vipItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy(s => s === 'game' ? 'confidence' : 'game')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text)] bg-slate-100 dark:bg-slate-800 border border-[var(--border)] cursor-pointer"
            title="Toggle sort order"
          >
            Sort: {sortBy === 'game' ? 'Match #' : 'Conf %'}
          </button>

          <button
            type="button"
            onClick={toggleAllPolls}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              allPollsVisible
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-xs'
                : 'text-[var(--text)] bg-slate-100 dark:bg-slate-800 border-[var(--border)]'
            }`}
            title={allPollsVisible ? "Collapse community voting polls" : "Show community voting polls for all jackpot matches"}
          >
            <Users className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>{allPollsVisible ? 'Hide Polls' : 'Fan Polls'}</span>
          </button>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="divide-y divide-[var(--border)]">
        {displayedItems.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)]">
            No fixtures match the selected filter.
          </div>
        ) : (
          displayedItems.map((item, idx) => {
            const confNum = parseInt(String(item.confidence), 10) || 75;
            const confClass =
              confNum >= 80
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                : confNum >= 75
                ? 'bg-slate-100 dark:bg-slate-800 text-[var(--text)] border-slate-200 dark:border-slate-700'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800';

            const matchLeagueRegex = /^(.+?\s+vs\s+.+?)(?:\s*\(([^)]+)\))?$/i;
            const matchLeagueResult = item.matchTeams.match(matchLeagueRegex);
            const teamsTitle = matchLeagueResult ? matchLeagueResult[1].trim() : item.matchTeams;
            const leagueTitle = matchLeagueResult && matchLeagueResult[2] ? matchLeagueResult[2].trim() : '';

            // Cleanly parse home and away team names
            const cleanTeams = teamsTitle.replace(/\s*\([^)]*\)\s*$/, '').trim();
            const teamParts = cleanTeams.split(/\s+vs\s+/i);
            const extractedHome = teamParts[0]?.trim() || 'Home';
            const extractedAway = teamParts[1]?.trim() || 'Away';

            // Find matching live fixture if present
            const matchedFixture = fixtures?.find(f => {
              if (f.fixtureNumber && f.fixtureNumber === item.gameNumber) return true;
              const h = (f.homeTeam || '').toLowerCase();
              const a = (f.awayTeam || '').toLowerCase();
              return teamsTitle.toLowerCase().includes(h) || teamsTitle.toLowerCase().includes(a);
            });

            const tipEval = evaluateTipResult(
              item.prediction,
              matchedFixture?.homeScore,
              matchedFixture?.awayScore,
              matchedFixture?.status,
              matchedFixture?.result
            );

            const fId = (matchedFixture as any)?.fixtureId || matchedFixture?.id || `jackpot_${jackpotId}_game_${item.gameNumber}`;
            const isPollVisible = showPolls && !hiddenPollGames[item.gameNumber];
            const cleanExplanation = item.explanation
              ? item.explanation.replace(/^\*{0,2}Fixture\s*Tip:\s*[^—–-]+[—–-]\s*\*{0,2}/i, '').trim() || item.explanation
              : '';

            return (
              <div
                key={`all-fix-item-${item.gameNumber}-${idx}`}
                className="p-3.5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-900/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  {/* Left: Game Number + Teams + League Name */}
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-[var(--text)] border border-[var(--border)] shrink-0">
                      {item.gameNumber}
                    </span>
                    <span className="font-semibold text-xs sm:text-[13px] text-[var(--text)]">
                      {teamsTitle}
                    </span>
                    {leagueTitle && (
                      <span className="text-[10px] font-medium text-[var(--text-muted)] bg-slate-100 dark:bg-slate-800 border border-[var(--border)] px-1.5 py-0.5 rounded shrink-0">
                        {leagueTitle}
                      </span>
                    )}
                  </div>

                  {/* Right: Badges with uniform typography and mobile wrapping */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    {/* Confidence score */}
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 min-h-[26px] rounded-lg font-mono border ${confClass}`}
                      title={`Confidence Score: ${item.confidence}`}
                    >
                      <span className="text-[9px]   tracking-wider font-semibold opacity-75">Conf:</span>
                      <strong className="font-bold text-[11px]">{item.confidence.toString().includes('%') ? item.confidence : `${item.confidence}%`}</strong>
                    </div>

                    {/* Community Votes consensus badge + Interactive toggle */}
                    {item.mostVoted ? (
                      <button
                        type="button"
                        onClick={() => togglePollGame(item.gameNumber)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 min-h-[26px] rounded-lg font-mono border text-[10.5px] cursor-pointer transition-all select-none ${
                          isPollVisible
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border-blue-300 dark:border-blue-700 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text)] border-[var(--border)]'
                        }`}
                        title={isPollVisible ? "Hide voting poll" : "Show voting poll"}
                      >
                        <Users className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-[9px]   tracking-wider font-semibold text-[var(--text-muted)]">
                          Fan Pick:
                        </span>
                        <strong className="font-bold">{item.mostVoted}</strong>
                        {isPollVisible ? (
                          <ChevronUp className="w-3 h-3 shrink-0 opacity-70 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3 h-3 shrink-0 opacity-70 ml-0.5" />
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => togglePollGame(item.gameNumber)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 min-h-[26px] rounded-lg font-mono border text-[10.5px] cursor-pointer transition-all select-none ${
                          isPollVisible
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border-blue-300 dark:border-blue-700'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text)] border-[var(--border)]'
                        }`}
                        title={isPollVisible ? "Hide voting poll" : "Show voting poll"}
                      >
                        <Users className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-[9px]   tracking-wider font-semibold">Fan Poll</span>
                        {isPollVisible ? <ChevronUp className="w-3 h-3 shrink-0 opacity-70" /> : <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />}
                      </button>
                    )}

                    {/* Cheerplex Tip (2/3 disclosed) or Join VIP button (remaining 1/3) */}
                    {item.isVipLocked ? (
                      <button
                        type="button"
                        onClick={handleOpenMegaJackpotPayment}
                        className="inline-flex items-center gap-1.5 px-3 py-1 min-h-[26px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-[10.5px] shadow-xs cursor-pointer transition-all shrink-0 border-0"
                        title="Unlock Cheerplex Tip with VIP Slip"
                      >
                        <Star className="w-3 h-3 fill-white shrink-0" />
                        <span>VIP Slip</span>
                      </button>
                    ) : (
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 min-h-[26px] rounded-lg font-mono shrink-0 border bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60"
                        title="Official Cheerplex Tip"
                      >
                        <span className="text-[9px]   tracking-wider font-semibold opacity-75">Pick:</span>
                        <strong className="font-bold text-[11px]">{item.prediction}</strong>
                      </div>
                    )}

                    {/* Single status badge short like FT with tick (win visible, lost faint) */}
                    {(matchedFixture?.status === 'FT' || tipEval.isSettled) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 min-h-[26px] rounded-lg font-mono text-[10.5px] font-bold bg-slate-800 dark:bg-slate-700 text-white shrink-0">
                        <span>FT</span>
                        {tipEval.isWon ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-400/40 dark:text-slate-500/40 stroke-[1.5]" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Community Votes - Directly visible under Community Votes */}
                {isPollVisible && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--text)]">
                        <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="  tracking-wider">Fan Voting Poll</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {matchedFixture?.status === 'FT' || tipEval.isSettled ? (
                          <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                            <span>Match Ended • Voting Closed</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Voting Active</span>
                          </span>
                        )}
                        {item.mostVoted && (
                          <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60 font-medium">
                            Consensus: <strong className="font-bold">{item.mostVoted}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <VotePoll
                      fixtureId={fId}
                      homeTeam={extractedHome}
                      awayTeam={extractedAway}
                      prediction={item.prediction}
                      isEnded={tipEval.isSettled || matchedFixture?.status === 'FT' || matchedFixture?.result === 'won' || matchedFixture?.result === 'lost'}
                      status={matchedFixture?.status}
                      result={matchedFixture?.result}
                      variant="card"
                    />
                  </div>
                )}

                {/* Highlighted Fixture Tips */}
                {!item.isVipLocked ? (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-[var(--border)]">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold   tracking-wider bg-blue-600 text-white shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-white shrink-0" />
                          <span>Pick:</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                          {item.prediction}
                        </span>
                      </div>

                      {cleanExplanation && (
                        <span className="text-xs text-[var(--text)] font-normal leading-normal font-sans">
                          {parseInline(cleanExplanation, postSlug)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-[10.5px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
                      <span className="font-normal opacity-75">Confidence:</span>
                      <strong className="font-bold">
                        {item.confidence.toString().includes('%') ? item.confidence : `${item.confidence}%`}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-2.5 border border-blue-200 dark:border-blue-800/60 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold   tracking-wider bg-blue-600 text-white shadow-xs shrink-0">
                        <Crown className="w-2.5 h-2.5 shrink-0" />
                        <span>VIP Tip:</span>
                      </span>
                      <span className="text-xs font-medium text-[var(--text)] truncate font-sans">
                        VIP Exclusive • High-accuracy prediction with safety double-chance combos
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenMegaJackpotPayment}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-[11px] shadow-xs cursor-pointer transition-all shrink-0 border-0"
                    >
                      <Star className="w-3 h-3 fill-white shrink-0" />
                      <span>Unlock Tip</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Conversion Banner */}
      <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-[var(--text)]">
              Unlock All {items.length} {titleName} Predictions
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-normal leading-tight font-sans">
              Receive full {items.length} VIP tips with 3 double-chance safety slips delivered immediately via SMS and online dashboard.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={handleOpenMegaJackpotPayment}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shrink-0 cursor-pointer transition-all shadow-xs border-0"
            title="Open Mega Jackpot VIP payment modal"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Join VIP (KES 250)</span>
          </button>
          <a
            href="https://cheerplex.co.ke/sportpesa-mjp-prediction"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text)] font-semibold text-xs shrink-0 no-underline transition-all border border-[var(--border)]"
            title="View full SportPesa MJP Prediction analysis"
          >
            <span>Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mega Jackpot Payment Modal */}
      {paymentModalOpen && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          packageName={`${titleName} VIP Slip`}
          price={250}
          packageId={`${jackpotId}-vip`}
          packageSlug={jackpotId}
          packageType="jackpot"
        />
      )}
    </div>
  );
}

export default function MarkdownRenderer({
  content,
  className = '',
  postSlug,
  fixtures,
  jackpotId: explicitJackpotId
}: MarkdownRendererProps) {
  if (!content) return null;

  const jackpotId = resolveJackpotId(explicitJackpotId || postSlug, 'sportpesa-mega');
  const [liveDbFixtures, setLiveDbFixtures] = useState<Fixture[] | null>(() => fixtures || getCachedLiveJackpotFixtures(jackpotId));
  const [, setLiveTodayFixtures] = useState<Fixture[] | null>(() => getCachedLiveTodayFixtures());

  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      setLiveDbFixtures(fixtures);
      return;
    }
    // If not supplied and content contains jackpot fixtures or date/time shortcodes, fetch directly from DB
    if (/TOP_.*FIXTURES|SPORTPESA.*TOP|DOUBLE_CHANCE|LEAGUES|LEAGUE_NAMES|.*SCHEDULE|.*DATE|.*TIME|.*SELECTIONS|.*OUTCOMES|UPSET_ALERT|.*COMBOS|.*JACKPOT|UI_TIMER|TIMER|COUNTDOWN|KICKOFF|CLOSING/i.test(content)) {
      fetchLiveJackpotFixtures(jackpotId).then(fetched => {
        if (fetched && fetched.length > 0) {
          setLiveDbFixtures(fetched);
        }
      }).catch(() => {});
    }
  }, [fixtures, jackpotId, content]);

  // If content contains TODAY_ tags, ensure live today fixtures are loaded and re-render
  useEffect(() => {
    if (/TODAY_/i.test(content)) {
      const cached = getCachedLiveTodayFixtures();
      if (cached && cached.length > 0) {
        setLiveTodayFixtures(cached);
      } else {
        fetchLiveTodayFixtures().then(todayData => {
          if (todayData && todayData.length > 0) {
            setLiveTodayFixtures(todayData);
          }
        }).catch(() => {});
      }
    }
  }, [content]);

  // Expand top jackpot / confidence fixtures parameters using live database fixtures
  const activeFixtures = (fixtures && fixtures.length > 0) ? fixtures : (liveDbFixtures || undefined);
  const expandedContent = expandTopFixturesParameters(content, jackpotId, activeFixtures);

  // 1. Clean out raw markdown marker headings and HTML comments
  const cleanContent = expandedContent
    .replace(/^#{1,4}\s*(INTRO|MIDDLE|MEAT|FAQ|MIDDLE_CONTENT|MEAT_CONTENT|RESPONSIBLE_GAMBLING_START|RESPONSIBLE_GAMBLING_END)\s*$/gim, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  if (!cleanContent) return null;

  // 2. Parse block elements
  const lines = cleanContent.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 00. UI Countdown Timer Tag
    // Matches [[UI_TIMER:sportpesa-mega]], {{UI_TIMER}}, {{JACKPOT_TIMER}}, {{COUNTDOWN_TIMER}}, {{TIMER}}, {{COUNTDOWN}}, etc.
    const timerMatch = trimmed.match(/^(?:\[\[|\[|\{\{|\{\{\s*)?(UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|TIMER|COUNTDOWN|MEGA_JACKPOT_TIMER|SPORTPESA_MEGA_TIMER|BETIKA_MIDWEEK_TIMER|TIMER_ONLY)(?::([a-zA-Z0-9_-]+))?(?:\]\]|\]|\}\}|\s*\}\})?$/i);
    if (timerMatch) {
      const targetJackpotId = timerMatch[2] || jackpotId || 'sportpesa-mega';
      elements.push(
        <div key={`ui-timer-${i}`} className="my-5 w-full">
          <JackpotCountdownTimer
            jackpotId={targetJackpotId}
            fixtures={activeFixtures}
          />
        </div>
      );
      i++;
      continue;
    }

    // 0a. All Jackpot Fixtures Line (Full jackpot list with confidence, votes, and 2/3 partial disclosure + VIP lock)
    // e.g. "Game 1: Rayo Vallecano vs Racing Santander (La Liga) — Cheerplex Tip: DCX2 (Confidence: 85% | User Votes: 2 (Away))"
    // e.g. "Game 12: Genoa vs Bologna (Serie A) — Cheerplex Tip: [⭐ Join VIP](/vip-packages) (Confidence: 74% | User Votes: 1 (Home))"
    const initialParsedAllFixture = parseAllFixtureLine(trimmed);

    if (initialParsedAllFixture) {
      const allFixtureItems: Array<{
        gameNumber: number;
        matchTeams: string;
        prediction: string;
        isVipLocked: boolean;
        confidence: number | string;
        mostVoted: string;
        explanation: string;
      }> = [];

      let curIdx = i;
      while (curIdx < lines.length) {
        const curLine = lines[curIdx].trim();
        if (!curLine) {
          curIdx++;
          continue;
        }

        const parsed = parseAllFixtureLine(curLine);
        if (!parsed) {
          break;
        }

        // Check if next non-empty line is explanation
        let explanation = '';
        let nextIdx = curIdx + 1;
        while (nextIdx < lines.length && !lines[nextIdx].trim()) {
          nextIdx++;
        }
        if (nextIdx < lines.length) {
          const candidateLine = lines[nextIdx].trim();
          if (
            !candidateLine.startsWith('#') &&
            !parseAllFixtureLine(candidateLine) &&
            !candidateLine.match(/^(?:###\s+|\*\*)?.+?\s+vs\s+.+?\s*[—–-]/i)
          ) {
            explanation = candidateLine;
            curIdx = nextIdx;
          }
        }

        allFixtureItems.push({
          ...parsed,
          explanation
        });

        curIdx++;
      }

      i = curIdx;

      elements.push(
        <CompactAllJackpotFixturesSection
          key={`all-fixgroup-${i}`}
          items={allFixtureItems}
          postSlug={postSlug}
          jackpotId={jackpotId}
          fixtures={activeFixtures}
        />
      );
      continue;
    }

    // 0. Top Jackpot Confidence Fixture Line: e.g. "Parma vs Monza — 1", "Everton vs Manchester United — 2 (The game with the highest confidence score)"
    const fixtureMatch = trimmed.match(/^(?:###\s+|\*\*)?(.+?\s+vs\s+.+?)\s*[—–-]\s*([0-9X]|DC1X|DC2X|DCX2|DC12|DC2)(?:\s*(\([^)]*(?:highest|highest)\s+confidence[^)]*\)))?(?:\*\*)?$/i);
    if (fixtureMatch) {
      const fixtureItems: Array<{
        matchTeams: string;
        matchTip: string;
        isHighest: boolean;
        highestSuffixText: string;
        explanation: string;
      }> = [];

      let curIdx = i;
      while (curIdx < lines.length) {
        const curLine = lines[curIdx].trim();
        if (!curLine) {
          curIdx++;
          continue;
        }

        const match = curLine.match(/^(?:###\s+|\*\*)?(.+?\s+vs\s+.+?)\s*[—–-]\s*([0-9X]|DC1X|DC2X|DCX2|DC12|DC2)(?:\s*(\([^)]*(?:highest|highest)\s+confidence[^)]*\)))?(?:\*\*)?$/i);
        if (!match) {
          break;
        }

        const matchTeams = match[1].trim();
        const matchTip = match[2].trim();
        const isHighest = !!match[3];
        const highestSuffixText = match[3] ? match[3].trim() : '(The game with the highest confidence score)';

        // Check if next non-empty line is the prediction explanation text
        let explanation = '';
        let nextIdx = curIdx + 1;
        while (nextIdx < lines.length && !lines[nextIdx].trim()) {
          nextIdx++;
        }
        if (nextIdx < lines.length) {
          const candidateLine = lines[nextIdx].trim();
          if (!candidateLine.startsWith('#') && !candidateLine.match(/^(?:###\s+|\*\*)?.+?\s+vs\s+.+?\s*[—–-]/i)) {
            explanation = candidateLine;
            curIdx = nextIdx; // Advance loop to include the explanation
          }
        }

        fixtureItems.push({
          matchTeams,
          matchTip,
          isHighest,
          highestSuffixText,
          explanation
        });

        curIdx++;
      }

      i = curIdx;

      elements.push(
        <CompactJackpotTopConfidenceSection
          key={`fixgroup-${i}`}
          items={fixtureItems}
          postSlug={postSlug}
        />
      );
      continue;
    }

    // 1. Headings
    if (trimmed.startsWith('# ')) {
      const h1Text = trimmed.substring(2).trim();
      const h1Slug = h1Text.replace(/\*\*|__|#|`/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      elements.push(
        <h2
          id={h1Slug}
          key={`h1-${i}`}
          className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight mb-4 mt-8 font-display scroll-mt-24 border-b border-[var(--border)]/60 pb-2"
        >
          {parseInline(h1Text, postSlug)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const h2Text = trimmed.substring(3).trim();
      const h2Slug = h2Text.replace(/\*\*|__|#|`/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      elements.push(
        <h2
          id={h2Slug}
          key={`h2-${i}`}
          className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text)] tracking-tight mt-8 mb-3.5 scroll-mt-24 pb-2 border-b border-[var(--border)]/50"
        >
          {parseInline(h2Text, postSlug)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const h3Text = trimmed.substring(4).trim();
      const h3Slug = h3Text.replace(/\*\*|__|#|`/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      elements.push(
        <h3
          id={h3Slug}
          key={`h3-${i}`}
          className="text-base sm:text-lg font-extrabold text-[var(--text)] mt-7 mb-2.5 scroll-mt-24"
        >
          {parseInline(h3Text, postSlug)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-4 mb-1.5   font-mono tracking-wider"
        >
          {parseInline(trimmed.substring(5), postSlug)}
        </h4>
      );
      i++;
      continue;
    }

    // 2. Blockquotes & Callouts
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }

      const fullQuoteText = quoteLines.join(' ');
      const isTip = fullQuoteText.includes('[!TIP]') || fullQuoteText.toLowerCase().includes('tip:');
      const isWarning = fullQuoteText.includes('[!WARNING]') || fullQuoteText.toLowerCase().includes('responsible gambling') || fullQuoteText.toLowerCase().includes('warning:');
      const isAlgorithm = fullQuoteText.includes('[!ALGORITHM]') || fullQuoteText.toLowerCase().includes('algorithm') || fullQuoteText.toLowerCase().includes('predictive');
      const isNote = fullQuoteText.includes('[!NOTE]') || fullQuoteText.toLowerCase().includes('note:');

      const cleanedLines = quoteLines.map(line => 
        line.replace(/\[!(NOTE|TIP|WARNING|ALGORITHM)\]/gi, '').trim()
      );

      if (isWarning) {
        elements.push(
          <div key={`callout-warn-${i}`} className="p-4 my-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {cleanedLines.map((ql, qIdx) => (
                <p key={qIdx}>{parseInline(ql, postSlug)}</p>
              ))}
            </div>
          </div>
        );
      } else if (isAlgorithm) {
        elements.push(
          <div key={`callout-algo-${i}`} className="p-4 my-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/80 text-blue-900 dark:text-blue-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {cleanedLines.map((ql, qIdx) => (
                <p key={qIdx}>{parseInline(ql, postSlug)}</p>
              ))}
            </div>
          </div>
        );
      } else if (isTip) {
        elements.push(
          <div key={`callout-tip-${i}`} className="p-4 my-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {cleanedLines.map((ql, qIdx) => (
                <p key={qIdx}>{parseInline(ql, postSlug)}</p>
              ))}
            </div>
          </div>
        );
      } else {
        elements.push(
          <div key={`callout-note-${i}`} className="p-4 my-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-[var(--text)] text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[var(--text-muted)]">
              {cleanedLines.map((ql, qIdx) => (
                <p key={qIdx}>{parseInline(ql, postSlug)}</p>
              ))}
            </div>
          </div>
        );
      }
      continue;
    }

    // 3. Tables (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map(c => c.trim());
        const isSeparator = /^[\s|:-]+$/.test(tableLines[1]);
        const bodyLines = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-5 rounded-2xl border border-[var(--border)] shadow-xs bg-[var(--card)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-[var(--border)] text-[10.5px] font-mono   tracking-wider text-[var(--text)]">
                  {headerCells.map((hc, hIdx) => (
                    <th key={hIdx} className="p-3.5 font-bold">
                      {parseInline(hc, postSlug)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-sans">
                {bodyLines.map((row, rIdx) => {
                  const rowCells = row.split('|').slice(1, -1).map(c => c.trim());
                  return (
                    <tr key={rIdx} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors">
                      {rowCells.map((rc, cIdx) => (
                        <td key={cIdx} className="p-3 text-[var(--text)]">
                          {parseInline(rc, postSlug)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 4. Unordered Lists (* item or - item)
    if (/^(\*|-)\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^(\*|-)\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^(\*|-)\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[var(--text-muted)] mb-3">
          {listItems.map((liText, liIdx) => (
            <li key={liIdx} className="leading-relaxed">
              {parseInline(liText, postSlug)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 5. Ordered Lists (1. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-[var(--text-muted)] mb-3">
          {listItems.map((liText, liIdx) => (
            <li key={liIdx} className="leading-relaxed">
              {parseInline(liText, postSlug)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 6. Block Image: ![alt](url) alone on a line
    const imgBlockMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgBlockMatch) {
      const altText = imgBlockMatch[1] || 'Illustration';
      const rawImgUrl = imgBlockMatch[2];
      const imgUrl = resolveRelativeImageUrl(rawImgUrl, postSlug);
      elements.push(
        <figure key={`img-fig-${i}`} className="my-6 space-y-2">
          <div className="rounded-[var(--radius)] overflow-hidden border border-[var(--border)] bg-slate-900/5 dark:bg-slate-900/40 shadow-xs">
            <img
              src={imgUrl}
              alt={altText}
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          {altText && altText !== 'Illustration' && (
            <figcaption className="text-center text-[11px] font-mono text-[var(--text-muted)] italic">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 7. Regular Paragraphs
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-2.5">
        {parseInline(trimmed, postSlug)}
      </p>
    );
    i++;
  }

  return (
    <div className={`markdown-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3 ${className}`}>
      {elements}
    </div>
  );
}
