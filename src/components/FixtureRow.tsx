import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  Zap
} from 'lucide-react';
import { Fixture } from '../types';
import VotePoll from './VotePoll';
import { FlagImage, resolveFixtureCountry } from '../utils/flagUtils';
import { formatTime } from '../utils/timeUtils';

export interface FixtureRowProps {
  fixture: any;
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
  getStatusColor: (status: any) => string;
  getResultBadge: (fixture: any, showScore?: boolean) => React.ReactNode;
}

export default function FixtureRow({
  fixture,
  isExpanded,
  toggleExpand,
  getStatusColor,
  getResultBadge,
}: FixtureRowProps) {
  const { isCompleted, displayConf, probs } = fixture;
  const country = resolveFixtureCountry(fixture);
  const isLive = fixture.status === 'LIVE' || fixture.status === 'HT' || fixture.status === '1H' || fixture.status === '2H';

  // Determine prediction market and odds
  const homeProb = probs?.home || 45;
  const drawProb = probs?.draw || 28;
  const awayProb = probs?.away || 27;

  const homeOdds = (100 / Math.max(10, homeProb)).toFixed(2);
  const awayOdds = (100 / Math.max(10, awayProb)).toFixed(2);

  return (
    <article 
      className={`rounded-2xl border transition-all duration-200 overflow-hidden text-left bg-[var(--card)] ${
        isExpanded 
          ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20' 
          : 'border-[var(--border)] hover:border-blue-400 hover:shadow-2xs'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (hidden md:block): 3 DISTINCT CLEAN ROWS                  */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        {/* ROW 1: League & country info on the start, time & short status on the end */}
        <div className="px-4 py-2 bg-slate-50/90 dark:bg-slate-900/60 border-b border-[var(--border)] flex items-center justify-between gap-3 text-xs">
          {/* Start: League & Country Info */}
          <div className="flex items-center gap-2 min-w-0">
            <FlagImage 
              countryFlag={fixture.countryFlag || fixture.country_flag} 
              flag={fixture.leagueFlag} 
              countryName={country} 
            />
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {fixture.leagueName || fixture.league_name || 'League'}
            </span>
            <span className="text-slate-400 text-[10px]">•</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {country}
            </span>
          </div>

          {/* End: Time & Short Status */}
          <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-[var(--border)]">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{formatTime(fixture.kickoffTime)}</span>
            </div>

            {isLive ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {fixture.status}
              </span>
            ) : fixture.status === 'FT' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase">
                FT
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Upcoming
              </span>
            )}

            {fixture.result && getResultBadge(fixture, false)}
          </div>
        </div>

        {/* ROW 2: Hamilton Academical @2.63 VS @3.13 Cowdenbeath and confidence as well */}
        <div className="px-5 py-4 flex items-center justify-between gap-6">
          {/* Match Arena (Home Team, @odds, VS / Score, @odds, Away Team) */}
          <div className="flex-1 flex items-center justify-between gap-3 min-w-0 max-w-2xl">
            {/* Home Team */}
            <div className="flex-1 min-w-0 flex items-center justify-end gap-2.5 text-right">
              <span className="text-sm sm:text-base font-bold text-[var(--text)] truncate" title={fixture.homeTeam}>
                {fixture.homeTeam}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 shrink-0 shadow-2xs">
                @{homeOdds}
              </span>
            </div>

            {/* Score / VS Center (VS changes to have score after fulltime or when live) */}
            <div className="shrink-0 px-2">
              {fixture.status === 'FT' || fixture.status === 'LIVE' || fixture.status === 'HT' || isCompleted || (fixture.homeScore !== undefined && fixture.homeScore !== null) ? (
                <div className="px-3.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-black text-sm sm:text-base tracking-wider border border-slate-700 shadow-xs">
                  {fixture.homeScore ?? 0} : {fixture.awayScore ?? 0}
                </div>
              ) : (
                <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono font-black text-xs uppercase border border-[var(--border)] tracking-wider">
                  VS
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 min-w-0 flex items-center justify-start gap-2.5 text-left">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 shrink-0 shadow-2xs">
                @{awayOdds}
              </span>
              <span className="text-sm sm:text-base font-bold text-[var(--text)] truncate" title={fixture.awayTeam}>
                {fixture.awayTeam}
              </span>
            </div>
          </div>

          {/* Right: Cheerplex Pick, Confidence & Intel Button */}
          <div className="flex items-center gap-3.5 shrink-0 pl-5 border-l border-[var(--border)]">
            <div className="flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-black shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>PICK:</span>
                <span className="tracking-wide uppercase">{fixture.prediction}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] mt-1">
                {fixture.isDoubleChance && (
                  <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 mr-1">DC</span>
                )}
                <span>Confidence:</span>
                <span className="font-bold text-[var(--text)] tabular-nums">{displayConf}%</span>
              </div>
            </div>

            {/* Intel Drawer Button */}
            <button
              type="button"
              onClick={() => toggleExpand(fixture.id)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isExpanded
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-[var(--border)]'
              }`}
              title="Toggle Match Analysis & Intel"
            >
              <span>Intel</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ROW 3: Votes Community Details */}
        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/50 border-t border-[var(--border)] rounded-b-2xl">
          <VotePoll 
            fixtureId={fixture.id} 
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
            prediction={fixture.prediction}
            isEnded={isCompleted} 
            status={fixture.status} 
            result={fixture.result} 
            initialTotalVotes={typeof (fixture as any).totalVotes === 'number' ? (fixture as any).totalVotes : (typeof (fixture as any).total_votes === 'number' ? (fixture as any).total_votes : undefined)}
            initialVotes1={typeof (fixture as any).votes1 === 'number' ? (fixture as any).votes1 : (typeof (fixture as any).votes_1 === 'number' ? (fixture as any).votes_1 : undefined)}
            initialVotesX={typeof (fixture as any).votesX === 'number' ? (fixture as any).votesX : (typeof (fixture as any).votes_x === 'number' ? (fixture as any).votes_x : undefined)}
            initialVotes2={typeof (fixture as any).votes2 === 'number' ? (fixture as any).votes2 : (typeof (fixture as any).votes_2 === 'number' ? (fixture as any).votes_2 : undefined)}
            variant="desktop-row"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW (md:hidden): PRESERVED EXACTLY AS IS                       */}
      {/* ========================================================================= */}
      <div className="md:hidden">
        {/* 1. TOP METADATA STRIP */}
        <div className="px-3.5 sm:px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-[var(--border)] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FlagImage 
              countryFlag={fixture.countryFlag || fixture.country_flag} 
              flag={fixture.leagueFlag} 
              countryName={country} 
            />
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {fixture.leagueName || fixture.league_name || 'League'}
              </span>
              <span className="text-slate-400 text-[10px] hidden xs:inline">•</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate hidden xs:inline">
                {country}
              </span>
            </div>
          </div>

          {/* Kickoff / Status Badges */}
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
              <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{formatTime(fixture.kickoffTime)}</span>
            </div>

            {isLive ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {fixture.status}
              </span>
            ) : fixture.status === 'FT' ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-[9.5px] font-bold uppercase">
                FT
              </span>
            ) : null}

            {fixture.result && getResultBadge(fixture, false)}
          </div>
        </div>

        {/* 2. MATCH ARENA (TEAMS + LIVE SCOREBOARD) - NO ABBREVIATION BOXES */}
        <div className="p-3.5 sm:p-4 space-y-3">
          <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
            
            {/* HOME TEAM */}
            <div className="col-span-5 min-w-0 text-left">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight truncate leading-snug">
                {fixture.homeTeam}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase">Home</span>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  @{homeOdds}
                </span>
              </div>
            </div>

            {/* SCOREBOARD / VS CENTER NODE */}
            <div className="col-span-2 flex flex-col items-center justify-center text-center">
              {fixture.status === 'FT' || fixture.status === 'LIVE' || fixture.status === 'HT' ? (
                <div className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-sm sm:text-base tracking-wider shadow-2xs border border-slate-700">
                  {fixture.homeScore ?? 0} : {fixture.awayScore ?? 0}
                </div>
              ) : (
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  VS
                </span>
              )}
            </div>

            {/* AWAY TEAM */}
            <div className="col-span-5 min-w-0 text-right">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight truncate leading-snug">
                {fixture.awayTeam}
              </h3>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  @{awayOdds}
                </span>
                <span className="text-[9.5px] font-mono text-slate-400 uppercase">Away</span>
              </div>
            </div>

          </div>

          {/* 3. CHEERPLEX PREDICTION STRIP (SINGLE LINE: Pick | Confidence | Intel) */}
          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[var(--border)] text-xs">
            {/* Pick & Tip */}
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-2xs shrink-0">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Pick:</span>
              <span className="tracking-wide uppercase font-black">{fixture.prediction}</span>
            </div>

            {/* Confidence with % value */}
            <div className="flex items-center gap-1 text-[11px] font-mono shrink-0">
              <span className="text-slate-400 uppercase text-[10px]">Confidence:</span>
              <span className="font-bold text-[var(--text)] tabular-nums px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[var(--border)]">
                {displayConf}%
              </span>
            </div>

            {/* Intel Accordion Button */}
            <button
              type="button"
              onClick={() => toggleExpand(fixture.id)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer border shrink-0 ${
                isExpanded
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-[var(--border)]'
              }`}
            >
              <span>Intel</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* 4. ON-THE-GO VOTING BAR (Mobile 3-Tier Layout) */}
          <div className="pt-2 border-t border-[var(--border)]">
            <VotePoll 
              fixtureId={fixture.id} 
              homeTeam={fixture.homeTeam}
              awayTeam={fixture.awayTeam}
              prediction={fixture.prediction}
              isEnded={isCompleted} 
              status={fixture.status} 
              result={fixture.result} 
              initialTotalVotes={typeof (fixture as any).totalVotes === 'number' ? (fixture as any).totalVotes : (typeof (fixture as any).total_votes === 'number' ? (fixture as any).total_votes : undefined)}
              initialVotes1={typeof (fixture as any).votes1 === 'number' ? (fixture as any).votes1 : (typeof (fixture as any).votes_1 === 'number' ? (fixture as any).votes_1 : undefined)}
              initialVotesX={typeof (fixture as any).votesX === 'number' ? (fixture as any).votesX : (typeof (fixture as any).votes_x === 'number' ? (fixture as any).votes_x : undefined)}
              initialVotes2={typeof (fixture as any).votes2 === 'number' ? (fixture as any).votes2 : (typeof (fixture as any).votes_2 === 'number' ? (fixture as any).votes_2 : undefined)}
              variant="mobile"
            />
          </div>
        </div>
      </div>

      {/* 5. EXPANDED TACTICAL INTEL DRAWER */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/60 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Cheerplex Match Analytics & Key Metrics</span>
            </div>
            <span className="text-[10.5px] font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-[var(--border)]">
              Confidence Index: {displayConf}/100
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
            {fixture.aiAnalysis || 
              "Mathematical regression calculations indicate an asymmetrical expected goal distribution favoring the selected outcome. Key factors include attacking efficiency over the past 5 matches, defensive stability against high-press setups, and recent head-to-head consistency."
            }
          </p>
        </div>
      )}
    </article>
  );
}
