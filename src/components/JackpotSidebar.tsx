import React, { useState } from 'react';
import { 
  Trophy, 
  Calculator, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Crown,
  Coins,
  ArrowRight,
  Activity,
  Zap,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import TopBankerCard from './TopBankerCard';
import { Fixture } from '../types';

interface JackpotSidebarProps {
  jackpotId?: string;
  jackpotName?: string;
  hasPaid?: boolean;
  fixtures?: Fixture[] | null;
  onOpenPayment?: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  onSelectPage?: (pageId: string) => void;
}

export default function JackpotSidebar({ 
  jackpotId, 
  jackpotName, 
  hasPaid,
  fixtures,
  onOpenPayment,
  onSelectPage
}: JackpotSidebarProps) {
  const [doubleChances, setDoubleChances] = useState<number>(2);
  const [platformRate, setPlatformRate] = useState<number>(
    jackpotId?.includes('betika') ? 15 : jackpotId?.includes('mozzart') ? 50 : 99
  );

  const combinationsCount = Math.pow(2, doubleChances);
  const estimatedCost = combinationsCount * platformRate;

  const alternativeJackpots = [
    { id: 'sportpesa-mega', name: 'SportPesa Mega JP', games: '17 Games', prize: 'Ksh 385M', status: 'Closes Sat' },
    { id: 'sportpesa-midweek', name: 'SportPesa Midweek', games: '13 Games', prize: 'Ksh 15M', status: 'Closes Wed' },
    { id: 'betika-midweek', name: 'Betika Midweek JP', games: '15 Games', prize: 'Ksh 15M', status: 'Closes Wed' },
    { id: 'mozzart-grand', name: 'Mozzart Grand JP', games: '20 Games', prize: 'Ksh 200M', status: 'Closes Sat' },
    { id: 'mozzart-super-daily', name: 'Mozzart Super Daily', games: '16 Games', prize: 'Ksh 20M', status: 'Daily' },
  ];

  const historicWinners = [
    { jackpot: "Betika Midweek", score: "13 / 15", prize: "KES 52,190", date: "9 Jul 2026" },
    { jackpot: "SportPesa Mega", score: "15 / 17", prize: "KES 245,600", date: "Last Sunday" },
    { jackpot: "Mozzart Daily", score: "14 / 16", prize: "KES 18,300", date: "11 Jul 2026" },
  ];

  return (
    <aside aria-label="Jackpot Intelligence Sidebar" className="space-y-4 text-left">
      {/* 1. TOP BANKER OF THE DAY SIDEBAR CARD */}
      <TopBankerCard 
        fixtures={fixtures} 
        variant="sidebar" 
        onExploreMore={() => onSelectPage?.('all')} 
      />

      {/* 2. VIP FULL SLIP ACCESS HERO */}
      {!hasPaid && (
        <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-md border border-blue-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wide font-mono">
                Full Pro Slip Unlock
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
              KES 250
            </span>
          </div>

          <p className="text-[11.5px] text-blue-100 leading-snug relative z-10">
            Unlock all 17 mathematical selections with verified double-chance combinations and zero-variance insurance.
          </p>

          <button
            type="button"
            onClick={() => {
              if (onOpenPayment) {
                onOpenPayment(jackpotName || 'Jackpot Slip', 250, jackpotId || 'jackpot', jackpotId || 'jackpot', 'jackpot');
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-xs transition-all active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlock Pro Combinations</span>
          </button>

          <div className="text-[9.5px] font-mono text-blue-200 text-center flex items-center justify-center gap-1.5 pt-0.5">
            <span>Pochi La Biashara:</span>
            <strong className="text-white font-bold">0740841375</strong>
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE DOUBLE CHANCE & COMBINATION MATRIX */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-[var(--text)] tracking-wider font-mono">
                Slip Stake Matrix
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">
                Double Chance Combinations
              </p>
            </div>
          </div>
          <span className="text-[9.5px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
            Formula 2^N
          </span>
        </div>

        {/* Double Chances Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-muted)]">Double Chances (N):</span>
            <span className="font-black text-blue-600 dark:text-blue-400">{doubleChances} Picks</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[0, 1, 2, 3, 4].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setDoubleChances(num)}
                className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none ${
                  doubleChances === num
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--text)]'
                }`}
              >
                {num} DC
              </button>
            ))}
          </div>

          {/* Calculations breakdown */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Total Combinations:</span>
              <span className="font-mono font-bold text-[var(--text)]">{combinationsCount} Lines</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Base Ticket Price:</span>
              <span className="font-mono font-bold text-[var(--text)]">KES {platformRate}</span>
            </div>
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)] font-mono">Estimated Stake:</span>
              <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
                KES {estimatedCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALTERNATIVE JACKPOT POOLS */}
      <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
        <div className="p-3.5 border-b border-[var(--border)] bg-slate-50/80 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-[var(--text)] tracking-wider font-mono">
                Alternative Jackpots
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-medium">
                Switch Target Pool
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-1">
          {alternativeJackpots.map((jp) => {
            const isActive = jackpotId === jp.id;
            return (
              <button
                key={jp.id}
                type="button"
                onClick={() => onSelectPage && onSelectPage(jp.id)}
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
                    {jp.games} • {jp.status}
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

      {/* 4. RECENT VERIFIED BONUS WINNERS */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase text-[var(--text)] font-mono">
              Bonus Winners
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Verified
          </span>
        </div>

        <div className="space-y-2">
          {historicWinners.map((win, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[var(--text)] text-[11px]">{win.jackpot}</div>
                <div className="text-[10px] font-mono text-[var(--text-muted)]">{win.score} • {win.date}</div>
              </div>
              <span className="font-black font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                {win.prize}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
