import React, { useState, useMemo } from 'react';
import { PREDICTION_CATEGORIES } from '../utils/predictionGenerator';
import { getPageUrl } from '../utils/navigation';
import { 
  Flame,
  Calendar,
  History,
  TrendingUp,
  Trophy,
  Crown,
  Zap,
  Copy,
  Check,
  Percent,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Fixture } from '../types';
import { getRefinedConfidence } from '../utils/probability';

interface PredictionsSidebarProps {
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  fixtures?: Fixture[];
  onOpenPayment?: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  onSelectPage?: (pageId: string) => void;
  jackpots?: any[];
}

export default function PredictionsSidebar({ 
  activeCategoryId, 
  onSelectCategory,
  fixtures = [],
  onOpenPayment,
  onSelectPage,
}: PredictionsSidebarProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [targetMultiplier, setTargetMultiplier] = useState<'2x' | '3x' | '5x'>('2x');

  // Smart 3-Match Banker Acca Builder based on live predictive confidence
  const generatedAcca = useMemo(() => {
    const seen = new Set<string>();
    const validMatches = (fixtures || []).filter(f => {
      if (!f || f.status === 'FT' || !f.prediction) return false;
      const key = String(f.id ?? f.fixtureRef ?? `${f.homeTeam}-${f.awayTeam}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Sort by confidence descending
    const sorted = [...validMatches].sort((a, b) => getRefinedConfidence(b) - getRefinedConfidence(a));
    
    let picksCount = 2;
    if (targetMultiplier === '3x') picksCount = 3;
    if (targetMultiplier === '5x') picksCount = 4;

    const selectedPicks = sorted.slice(0, picksCount);
    
    // Calculate combined odds
    let combinedOdds = 1.0;
    selectedPicks.forEach(p => {
      const conf = getRefinedConfidence(p);
      const odd = Math.max(1.22, +(100 / Math.max(30, conf)).toFixed(2));
      combinedOdds *= odd;
    });

    return {
      picks: selectedPicks,
      totalOdds: combinedOdds.toFixed(2),
      winProbability: Math.min(94, Math.max(76, Math.round(96 - (picksCount * 5.5)))),
      bookingCode: `CPX-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }, [fixtures, targetMultiplier]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedAcca.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const defaultJackpots = [
    { id: 'sportpesa-mega', name: 'SportPesa Mega JP', games: '17 Games', prize: 'Ksh 385M', badge: 'Active' },
    { id: 'sportpesa-midweek', name: 'SportPesa Midweek', games: '13 Games', prize: 'Ksh 15M', badge: 'Active' },
    { id: 'betika-midweek', name: 'Betika Midweek JP', games: '15 Games', prize: 'Ksh 15M', badge: 'Midweek' },
    { id: 'mozzart-grand', name: 'Mozzart Grand JP', games: '20 Games', prize: 'Ksh 200M', badge: 'Active' },
    { id: 'mozzart-super-daily', name: 'Mozzart Super Daily', games: '16 Games', prize: 'Ksh 20M', badge: 'Daily' },
  ];

  const marketShortcuts = [
    { id: 'category-today', label: "Today's Free Tips", icon: Flame, tag: "Hot" },
    { id: 'category-tomorrow', label: "Tomorrow's Predictions", icon: Calendar, tag: "Upcoming" },
    { id: 'category-yesterday', label: "Yesterday's Results", icon: History, tag: "Archive" },
    { id: 'odds-packs', label: "Daily Decimal Packs", icon: Percent, tag: "2+ & 5+" },
    { id: 'jackpot-list', label: "All Jackpots Hub", icon: Trophy, tag: "Pools" },
    { id: 'vip-packages', label: "Cheerplex VIP Club", icon: Crown, tag: "VIP" },
  ];

  return (
    <aside aria-label="Predictions Intelligence Sidebar" className="space-y-4 text-left">
      {/* 1. INTERACTIVE ACCA BUILDER (BRAND NEW CHEERPLEX FEATURE) */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-[var(--text)] tracking-tight font-mono">
                Smart Acca Builder
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">
                Algorithmic 3-Match Banker
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60">
            Predictive AI
          </span>
        </div>

        {/* Multiplier selector pills */}
        <div className="pt-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Target Multiplier:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Total Odds: {generatedAcca.totalOdds}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            {(['2x', '3x', '5x'] as const).map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setTargetMultiplier(tier)}
                className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none ${
                  targetMultiplier === tier
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-[var(--text)]'
                }`}
              >
                {tier} Slip
              </button>
            ))}
          </div>

          {/* Generated Matches Mini List */}
          <div className="space-y-1.5 pt-1">
            {generatedAcca.picks.length > 0 ? (
              generatedAcca.picks.map((pick, i) => (
                <div 
                  key={`acca-pick-${pick.id ?? pick.fixtureRef ?? i}-${i}`}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex items-center justify-between text-[11px]"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-[var(--text)] truncate">{pick.homeTeam} vs {pick.awayTeam}</div>
                    <div className="text-[9.5px] text-blue-600 dark:text-blue-400 font-mono font-semibold">Tip: {pick.prediction || '1X'}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/60 shrink-0">
                    {getRefinedConfidence(pick)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-[var(--text-muted)]">
                Selecting high-probability banker slips...
              </div>
            )}
          </div>

          {/* Booking Code & Copy */}
          <div className="pt-2 flex items-center gap-2">
            <div className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-[var(--border)] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Code:</span>
              <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">{generatedAcca.bookingCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy booking code"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-xs border-none flex items-center justify-center"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP JACKPOTS RADAR */}
      <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
        <div className="p-3.5 border-b border-[var(--border)] bg-slate-50/80 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-[var(--text)] tracking-wider font-mono">
                Top Jackpots
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-medium">
                Live Kenyan Prize Pools
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectPage && onSelectPage('jackpot-list')}
            className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            View All
          </button>
        </div>

        <div className="p-2 space-y-1">
          {defaultJackpots.map((jp) => {
            const isActive = activeCategoryId === jp.id;
            return (
              <button
                key={jp.id}
                type="button"
                onClick={() => {
                  if (onSelectPage) onSelectPage(jp.id);
                  else onSelectCategory(jp.id);
                }}
                className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer group ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 shadow-xs' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {jp.name}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">
                    {jp.games}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                    {jp.prize}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MARKET PREDICTIONS NAVIGATION */}
      <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-2">
        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">
          Market Intelligence
        </span>
        <nav className="space-y-1">
          {marketShortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategoryId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'odds-packs') {
                    if (onSelectPage) onSelectPage('home');
                    requestAnimationFrame(() => {
                      const el = document.getElementById('odds-packs');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    });
                  } else if (onSelectPage) {
                    onSelectPage(item.id);
                  } else {
                    onSelectCategory(item.id);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'border-transparent text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {item.tag}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. TRUST BADGE */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text)]">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Quantitative Predictive Rigor</span>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Zero bias matchday models verified against 100,000+ historical league fixtures across CAF, UEFA, EPL, La Liga, and Serie A.
        </p>
      </div>
    </aside>
  );
}
