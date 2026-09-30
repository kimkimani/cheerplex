import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Trophy, 
  Crown, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  TrendingUp, 
  Filter, 
  Home, 
  ChevronRight, 
  Coins, 
  Clock,
  Layers,
  Scale,
  Target,
  Flame,
  Percent
} from 'lucide-react';
import { Fixture } from '../types';
import { PredictionCategory, PREDICTION_CATEGORIES, getCategoryCountText } from '../utils/predictionGenerator';
import { formatTipLabel, setLiveTodayFixturesCache } from '../utils/todayFixturesTags';
import PredictionsList from './PredictionsList';
import { vipPackages, oddsPacks } from '../data';
import { getMarkdownContent } from '../content/markdownLoader';
import MarkdownRenderer from './MarkdownRenderer';
import FaqSection from './FaqSection';
import { AuthorCard } from './AuthorCard';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import CuratedAccumulatorCard from './CuratedAccumulatorCard';
import { getPageUrl } from '../utils/navigation';
import InboundLinksBlock from './InboundLinksBlock';
import { getBankerEstimatedOdds } from '../utils/bankerUtils';
import { getRefinedConfidence } from '../utils/probability';

interface CategoryPredictionsPageProps {
  category: PredictionCategory;
  fixtures: Fixture[];
  onBackToHome: () => void;
  onSelectPage?: (pageId: string) => void;
  onOpenPayment?: (
    pkgName: string, 
    price: number, 
    id: string | number, 
    slug: string, 
    type: 'vip' | 'jackpot' | 'odds'
  ) => void;
  jackpots?: any[];
  pageId?: string;
  isLoading?: boolean;
}

interface MarketTacticalMeta {
  oddsRange: string;
  historicalAccuracy: string;
  riskTier: string;
  tacticalFormula: string;
  keyMetric: string;
  badgeTone: string;
}

export type MarketFilterType = 'all' | 'wins' | 'over_under' | 'btts' | 'double_chance' | 'draws';

export function matchesPredictionMarket(fixture: Fixture, marketType: MarketFilterType): boolean {
  if (marketType === 'all') return true;
  const pred = (fixture.prediction || '').toLowerCase().trim();
  const isDC = Boolean(fixture.isDoubleChance) || pred.includes('1x') || pred.includes('x2') || pred.includes('12') || pred.includes('double');

  if (marketType === 'double_chance') {
    return isDC;
  }
  if (marketType === 'btts') {
    return pred.includes('gg') || pred.includes('btts') || pred.includes('both teams');
  }
  if (marketType === 'over_under') {
    return pred.includes('over') || pred.includes('under') || pred.includes('goals') || pred.includes('2.5') || pred.includes('1.5') || pred.includes('3.5');
  }
  if (marketType === 'draws') {
    return pred === 'x' || pred.includes('draw') || pred === 'x (draw)';
  }
  if (marketType === 'wins') {
    if (isDC) return false;
    return pred.includes('home') || pred.includes('away') || pred === '1' || pred === '2' || pred.includes('(1)') || pred.includes('(2)');
  }
  return true;
}

function getMarketTacticalMeta(categoryId: string): MarketTacticalMeta {
  const norm = categoryId.toLowerCase();
  if (norm.includes('1x2') || norm.includes('1')) {
    return {
      oddsRange: '1.65 – 2.45',
      historicalAccuracy: '84.8%',
      riskTier: 'Balanced Value',
      tacticalFormula: 'Evaluates mathematical goal expectancy distribution for Home Win (1), Draw (X), and Away Win (2) alongside home/away goal scoring differentials.',
      keyMetric: 'Home / Away Supremacy Index',
      badgeTone: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
    };
  }
  if (norm.includes('gg') || norm.includes('btts')) {
    return {
      oddsRange: '1.60 – 2.15',
      historicalAccuracy: '82.5%',
      riskTier: 'Medium Variance',
      tacticalFormula: 'Filters fixtures where both clubs average ≥ 1.35 goals scored per match and clean sheet probability is below 22%.',
      keyMetric: 'Dual Offensive Threat Ratio',
      badgeTone: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
    };
  }
  if (norm.includes('over25')) {
    return {
      oddsRange: '1.75 – 2.50',
      historicalAccuracy: '81.0%',
      riskTier: 'High Value',
      tacticalFormula: 'Pinpoints high-tempo matchups where combined expected goals (xG) exceed 2.75 with aggressive transition tactics.',
      keyMetric: 'Combined xG Expectancy > 2.75',
      badgeTone: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800'
    };
  }
  if (norm.includes('over15')) {
    return {
      oddsRange: '1.22 – 1.48',
      historicalAccuracy: '89.4%',
      riskTier: 'Ultra-Low Risk Banker',
      tacticalFormula: 'High-probability accumulator foundations requiring 2 or more total goals. Ideal for multi-bet bankroll compounding.',
      keyMetric: 'Over 1.5 Goal Frequency Index',
      badgeTone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
    };
  }
  if (norm.includes('doublechance')) {
    return {
      oddsRange: '1.25 – 1.60',
      historicalAccuracy: '88.7%',
      riskTier: 'Conservative Banker',
      tacticalFormula: 'Protective dual-outcome coverage (1X, X2, 12) mitigating draw risk in tight, closely contested derby matchups.',
      keyMetric: 'Draw Variance Cushion',
      badgeTone: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800'
    };
  }
  if (norm.includes('free')) {
    return {
      oddsRange: '1.55 – 2.20',
      historicalAccuracy: '85.2%',
      riskTier: 'Audited Free Value',
      tacticalFormula: 'Daily high-confidence selections from tier-1 and tier-2 European and African leagues evaluated by our sports algorithm.',
      keyMetric: 'Public Confidence Ratio',
      badgeTone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800'
    };
  }
  if (norm.includes('yesterday')) {
    return {
      oddsRange: '1.50 – 2.80',
      historicalAccuracy: 'Verified Ledger',
      riskTier: 'Audited Historical',
      tacticalFormula: 'Transparent post-match verification database recording all winning and lost selections to continuously recalibrate model weights.',
      keyMetric: 'Settled Results Ledger',
      badgeTone: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
    };
  }
  if (norm.includes('tomorrow')) {
    return {
      oddsRange: '1.60 – 2.50',
      historicalAccuracy: '86.0% Projected',
      riskTier: 'Early Market Edge',
      tacticalFormula: 'Early statistical predictions computed 24 to 48 hours in advance before market volume depresses bookmaker odds.',
      keyMetric: 'Early Line Value',
      badgeTone: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
    };
  }
  return {
    oddsRange: '1.50 – 2.30',
    historicalAccuracy: '85.0%',
    riskTier: 'Algorithmic Selection',
    tacticalFormula: 'Cheerplex statistical distribution ratings weighted by team form, injuries, head-to-head records, and home field advantage.',
    keyMetric: 'Comprehensive Statistical Rating',
    badgeTone: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
  };
}

export default function CategoryPredictionsPage({  
  category, 
  fixtures, 
  onBackToHome,
  onSelectPage,
  onOpenPayment,
  jackpots,
  pageId,
  isLoading = false
}: CategoryPredictionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high'>('all');
  const [marketFilter, setMarketFilter] = useState<MarketFilterType>('all');
  const [copied, setCopied] = useState(false);
  const [accaCopied, setAccaCopied] = useState(false);
  const [yesterdayFilter, setYesterdayFilter] = useState<'won' | 'lost' | 'all'>('won');

  // Synchronize today's fixtures cache with current live category data
  useEffect(() => {
    if ((category.id === 'category-today' || category.id === 'today') && fixtures && fixtures.length > 0) {
      setLiveTodayFixturesCache(fixtures);
    }
  }, [category.id, fixtures]);

  const formattedYesterdayDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const formattedTodayDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const formattedTomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const formattedDisplayDate = useMemo(() => {
    if (category.id === 'category-yesterday') return formattedYesterdayDate;
    if (category.id === 'category-tomorrow') return formattedTomorrowDate;
    return formattedTodayDate;
  }, [category.id, formattedYesterdayDate, formattedTomorrowDate, formattedTodayDate]);

  const tacticalMeta = useMemo(() => {
    return getMarketTacticalMeta(category.id);
  }, [category.id]);

  // Yesterday's Performance Statistics (computed over ALL unfiltered yesterday fixtures)
  const yesterdayStats = useMemo(() => {
    if (category.id !== 'category-yesterday') return null;

    const total = fixtures.length;
    const wonCount = fixtures.filter(f => f.result === 'won').length;
    const lostCount = fixtures.filter(f => f.result === 'lost').length;
    
    const winRate = total > 0 ? ((wonCount / total) * 100).toFixed(1) : '0.0';
    const lossRate = total > 0 ? ((lostCount / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      wonCount,
      lostCount,
      winRate,
      lossRate
    };
  }, [fixtures, category.id]);

  // Filter fixtures based on search term, yesterday result filter, confidence filter, and prediction market type
  const filteredFixtures = useMemo(() => {
    let result = fixtures;

    // Filter by won/lost/all for yesterday page
    if (category.id === 'category-yesterday') {
      if (yesterdayFilter === 'won') {
        result = result.filter(f => f.result === 'won');
      } else if (yesterdayFilter === 'lost') {
        result = result.filter(f => f.result === 'lost');
      }
    }

    // Filter by prediction market type (Wins, Over/Under, BTTS/GG, Double Chance, Draws)
    if (marketFilter !== 'all') {
      result = result.filter(f => matchesPredictionMarket(f, marketFilter));
    }

    if (confidenceFilter === 'high') {
      result = result.filter(f => getRefinedConfidence(f) >= 80);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.homeTeam.toLowerCase().includes(q) ||
        f.awayTeam.toLowerCase().includes(q) ||
        f.leagueName.toLowerCase().includes(q) ||
        (f.countryName && f.countryName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [fixtures, searchTerm, category.id, yesterdayFilter, confidenceFilter, marketFilter]);

  // Available prediction market tabs with dynamic match counts
  const marketFilterOptions = useMemo(() => {
    return [
      { id: 'all' as MarketFilterType, label: 'All Matches', count: fixtures.length },
      { id: 'wins' as MarketFilterType, label: 'Wins (1X2)', count: fixtures.filter(f => matchesPredictionMarket(f, 'wins')).length },
      { id: 'over_under' as MarketFilterType, label: 'Over / Under', count: fixtures.filter(f => matchesPredictionMarket(f, 'over_under')).length },
      { id: 'btts' as MarketFilterType, label: 'BTTS / GG', count: fixtures.filter(f => matchesPredictionMarket(f, 'btts')).length },
      { id: 'double_chance' as MarketFilterType, label: 'Double Chance', count: fixtures.filter(f => matchesPredictionMarket(f, 'double_chance')).length },
      { id: 'draws' as MarketFilterType, label: 'Draws (X)', count: fixtures.filter(f => matchesPredictionMarket(f, 'draws')).length },
    ];
  }, [fixtures]);

  // Curated 3-Match Market Accumulator Slip (Exclusive Feature for Category Pages)
  const topThreeAccumulator = useMemo(() => {
    if (!fixtures || fixtures.length === 0 || category.id === 'category-yesterday') return [];
    return [...fixtures]
      .filter(f => f.status !== 'FT')
      .sort((a, b) => getRefinedConfidence(b) - getRefinedConfidence(a))
      .slice(0, 3);
  }, [fixtures, category.id]);

  const accumulatorCombinedOdds = useMemo(() => {
    if (topThreeAccumulator.length === 0) return '0.00';
    const total = topThreeAccumulator.reduce((acc, f) => {
      const oddVal = parseFloat(getBankerEstimatedOdds(f));
      return acc * (isNaN(oddVal) ? 1.55 : oddVal);
    }, 1);
    return total.toFixed(2);
  }, [topThreeAccumulator]);

  // Copy coupon action
  const handleCopyCoupon = () => {
    if (filteredFixtures.length === 0) return;
    
    const textToCopy = filteredFixtures.map((fixture, idx) => 
      `${idx + 1}. ${fixture.homeTeam} vs ${fixture.awayTeam} - Tip: ${formatTipLabel(fixture.prediction)} (Odds: ${getBankerEstimatedOdds(fixture)})`
    ).join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy curated accumulator action
  const handleCopyAccumulator = () => {
    if (topThreeAccumulator.length === 0) return;
    const slipText = [
      `🔥 CHEERPLEX CURATED ${category.label.toUpperCase()} 3-MATCH ACCUMULATOR`,
      `Total Estimated Odds: ${accumulatorCombinedOdds}x`,
      `----------------------------------------`,
      ...topThreeAccumulator.map((f, i) => `${i + 1}. ${f.homeTeam} vs ${f.awayTeam} → Tip: ${formatTipLabel(f.prediction)} (Odds: ${getBankerEstimatedOdds(f)})`),
      `----------------------------------------`,
      `Verified by Cheerplex Mathematical Sports Algorithm • https://cheerplex.co.ke`
    ].join('\n');

    navigator.clipboard.writeText(slipText);
    setAccaCopied(true);
    setTimeout(() => setAccaCopied(false), 2000);
  };

  const pageMd = getMarkdownContent(pageId || category.id);

  // Alternative categories for cross-navigation
  const alternativeCategories = useMemo(() => {
    return PREDICTION_CATEGORIES.filter(c => c.id !== category.id).slice(0, 4);
  }, [category.id]);

  return (
    <div id={`category-page-${category.id}`} className="space-y-6 text-left">
      
      {/* 1. CLEAN BREADCRUMB & BACK ACTION - HIDDEN ON MOBILE */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono overflow-x-auto scrollbar-none py-1">
          <a 
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Cheerplex Home</span>
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Prediction Markets</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-[var(--text)] font-bold truncate max-w-[260px] sm:max-w-[380px]" aria-current="page">
            {pageMd.displayTitle || category.name}
          </span>
        </nav>

        <a 
          href="/"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
              e.preventDefault();
              onBackToHome();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800/80 border border-[var(--border)] transition-all cursor-pointer no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </a>
      </div>

      {/* 2. MARKET ANALYTICAL COCKPIT HEADER */}
      {category.id === 'category-yesterday' && yesterdayStats ? (
        /* Yesterday Dedicated Performance Ledger */
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-blue-600" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[10px] font-black   tracking-wider font-mono">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>Audited Historical Verification</span>
                  </div>
                  
                  <h1 
                    className="text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {pageMd.displayTitle || pageMd.title || "Yesterday's Football Predictions & Winning Results"}
                  </h1>
                  {(pageMd.introParagraph || pageMd.intro || pageMd.description) && (
                    <div className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl font-normal">
                      <MarkdownRenderer content={pageMd.introParagraph || pageMd.intro || pageMd.description || ''} />
                    </div>
                  )}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold border border-slate-800   tracking-wide">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{formattedYesterdayDate}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400   tracking-wider block">Settled Win Ratio</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">{yesterdayStats.winRate}%</span>
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-300">ACCURACY</span>
                  </div>
                  <span className="text-[9px] text-blue-900 dark:text-blue-200 font-bold font-mono   bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                    Statistical Recalibration Active
                  </span>
                </div>
              </div>


              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300   tracking-wider">Total Evaluated Matches</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-[var(--text)]">{yesterdayStats.total}</span>
                    <span className="text-[10px] text-slate-500">Tips</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300   tracking-wider">Settled Won Tips</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-300">{yesterdayStats.wonCount}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Matches Won</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.03]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300   tracking-wider">Settled Lost Tips</span>
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-[var(--text)]">{yesterdayStats.lostCount}</span>
                    <span className="text-[10px] text-slate-500">Matches Lost</span>
                  </div>
                </div>
              </div>

              {/* Visual Accuracy Bar */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold   tracking-wider mb-2">
                  <span className="text-blue-600 dark:text-blue-400">Win Rate ({yesterdayStats.winRate}%)</span>
                  <span className="text-slate-400">Loss Variance ({yesterdayStats.lossRate}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${yesterdayStats.winRate}%` }} />
                  <div className="h-full bg-slate-400 dark:bg-slate-700 transition-all duration-500" style={{ width: `${yesterdayStats.lossRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday Outcome Switcher */}
          <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl shadow-xs text-left flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500   tracking-wider mr-2">Filter Ledger:</span>
            <button
              onClick={() => setYesterdayFilter('won')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                yesterdayFilter === 'won'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Won Matches ({yesterdayStats.wonCount})
            </button>
            <button
              onClick={() => setYesterdayFilter('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                yesterdayFilter === 'lost'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Lost Matches ({yesterdayStats.lostCount})
            </button>
            <button
              onClick={() => setYesterdayFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                yesterdayFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-[var(--text)] border-[var(--border)]'
              }`}
            >
              All Matches ({yesterdayStats.total})
            </button>
          </div>
        </div>
      ) : (
        /* Clean Category Header with Existing Elements */
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs relative text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl shrink-0">{category.icon}</span>
                <span className="text-[10px] font-mono font-bold   tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  {category.label}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {formattedDisplayDate}
                </span>
              </div>

              <h1 
                className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight  "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {pageMd.displayTitle || pageMd.title || category.name}
              </h1>

              {(pageMd.introParagraph || pageMd.intro) ? (
                <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                  <MarkdownRenderer content={pageMd.introParagraph || pageMd.intro || ''} />
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {pageMd.description || category.description}
                </p>
              )}
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-center shrink-0 self-start sm:self-center">
              <span className="text-[10px] font-mono font-bold text-slate-500   block">Available Picks</span>
              <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 block mt-0.5">
                {isLoading ? '...' : `${fixtures.length} Tips`}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* 3. INTERACTIVE SEARCH & CONFIDENCE FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams, clubs or leagues..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[var(--border)] text-xs">
            <button
              onClick={() => setConfidenceFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold font-mono transition-colors cursor-pointer border-none ${
                confidenceFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[var(--text)]'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setConfidenceFilter('high')}
              className={`px-3 py-1 rounded-lg font-bold font-mono transition-colors cursor-pointer border-none flex items-center gap-1 ${
                confidenceFilter === 'high'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[var(--text)]'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>High Conf (≥80%)</span>
            </button>
          </div>

          <button
            onClick={handleCopyCoupon}
            disabled={filteredFixtures.length === 0}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer border-none shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Slip Copied!' : 'Copy Multi-Slip'}</span>
          </button>
        </div>
      </div>

      {/* 3.1 PREDICTION TYPE TABS (All Matches vs Wins / Over-Under / BTTS / Double Chance / Draws) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono font-bold text-slate-400   tracking-wider shrink-0 flex items-center gap-1.5 pl-1 pr-1">
          <Filter className="w-3.5 h-3.5 text-blue-500" /> Market:
        </span>
        {marketFilterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMarketFilter(opt.id)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
              marketFilter === opt.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-[var(--card)] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-[var(--border)]'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
              marketFilter === opt.id 
                ? 'bg-blue-700 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. CURATED 3-MATCH ACCUMULATOR SLIP */}
      {category.id !== 'category-yesterday' && (
        <CuratedAccumulatorCard 
          fixtures={fixtures} 
          categoryLabel={category.label} 
        />
      )}

      {/* 5. PRIMARY MARKET PREDICTIONS LIST */}
      {isLoading ? (
        <PredictionsList 
          fixtures={[]}
          isLoading={true}
          groupByDate={true}
          pageType={pageMd.type}
          title={`${category.name} Selections`}
          subtitle="Calculating predictive metrics..."
        />
      ) : filteredFixtures.length > 0 ? (
        <PredictionsList 
          fixtures={filteredFixtures}
          isLoading={false}
          groupByDate={true}
          pageType={pageMd.type}
          title={
            pageMd.listTitle || (
              category.id === 'category-yesterday'
                ? yesterdayFilter === 'won'
                  ? "Yesterday's Settled Winning Tips"
                  : yesterdayFilter === 'lost'
                    ? "Yesterday's Unsettled Selections"
                    : "Yesterday's Complete Historical Match List"
                : `${category.name} Live Fixtures`
            )
          }
          subtitle={
            pageMd.listSubtitle || (
              category.id === 'category-yesterday'
                ? `Showing ${filteredFixtures.length} match results filtered from ${formattedYesterdayDate}.`
                : `Showing ${filteredFixtures.length} matches analyzed according to standard mathematical probability distribution models.`
            )
          }
        />
      ) : (
        <div className="p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-xs font-black text-[var(--text)]   tracking-tight">No fixtures found matching your criteria</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Try resetting your prediction market filter, search term, or confidence toggle.</p>
          <button
            type="button"
            onClick={() => {
              setMarketFilter('all');
              setConfidenceFilter('all');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-all cursor-pointer border-none shadow-xs"
          >
            Show All Matches
          </button>
        </div>
      )}

      {/* 6. ALTERNATIVE PREDICTION MARKETS NAVIGATOR (CROSS-POLLINATION) */}
      <section aria-label="Alternative Betting Markets" className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold   tracking-wider text-blue-600 dark:text-blue-400">
              Alternative Cheerplex Tips
            </span>
            <h3 className="text-sm font-black text-[var(--text)]  ">
              Our Other Prediction Selections and Tips
            </h3>
          </div>
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer no-underline"
          >
            <span>All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {alternativeCategories.map((altCat) => {
            const url = getPageUrl(altCat.id);
            return (
              <a
                key={altCat.id}
                href={url}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    if (onSelectPage) onSelectPage(altCat.id);
                  }
                }}
                className="p-4 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-left no-underline cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg">{altCat.icon}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {altCat.countText}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[var(--text)] group-hover:text-blue-600 transition-colors   mt-2 font-display">
                    {altCat.label}
                  </h4>
                  <p className="text-[10.5px] text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                    {altCat.description}
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Market</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 8. STREAMLINED PREMIUM VIP / SURE ODDS UPGRADE BANNER */}
      <section aria-label="Premium VIP Upgrade" className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-500/30 shadow-md text-left flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-[10px] font-mono font-bold  ">
            <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Cheerplex Join VIP • Instant Access</span>
          </div>
          <h3 className="text-base sm:text-lg font-black   tracking-tight font-display">
            Want Best Sure 5+ Odds or Weekly VIP Selections?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Get mathematically analyzed and validated 3+ to 9+ daily odds and complete jackpot predictions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              if (onOpenPayment && vipPackages.length > 0) {
                const pkg = vipPackages[0];
                onOpenPayment(pkg.name, pkg.price, pkg.id, pkg.slug, 'vip');
              }
            }}
            className="min-h-[46px] px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black font-mono   tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>Unlock VIP (KES 500)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenPayment && oddsPacks.length > 0) {
                const pack = oddsPacks.find(p => p.slug.includes('5plus')) || oddsPacks[0];
                onOpenPayment(pack.name, pack.price, pack.id, pack.slug, 'odds');
              }
            }}
            className="min-h-[46px] px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono   tracking-wider rounded-xl transition-all cursor-pointer border border-white/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Unlock 5+ Odds</span>
          </button>
        </div>
      </section>

      {/* 8. CHEERPLEX EDITORIAL ANALYSIS & QUANTITATIVE STRATEGY */}
      {(pageMd.sectionTitle || pageMd.sectionDescription || pageMd.analysis || pageMd.meat) && (
        <section aria-label="Editorial Analysis" className="p-6 md:p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4">
          {/* <div className="space-y-1 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">

              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm sm:text-base font-black   text-[var(--text)] tracking-tight font-display">
                {pageMd.sectionTitle || "Cheerplex Quantitative Analysis & Strategy"}
              </h2>
            </div>
            {pageMd.sectionDescription && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {pageMd.sectionDescription}
              </p>
            )}
          </div> */}
          
          {(pageMd.analysis || pageMd.meat) && (
            <MarkdownRenderer 
              content={pageMd.analysis || pageMd.meat} 
              jackpotId={pageMd.jackpotId || pageId} 
              fixtures={fixtures}
            />
          )}
        </section>
      )}

      {/* 9. CONTEXTUAL INBOUND LINKS */}
      <InboundLinksBlock 
        pageId={pageId || category.id} 
        rawType={pageMd.type} 
        jackpotId={pageMd.jackpotId}
        onSelectPage={onSelectPage} 
      />

      {/* 10. AUTHOR CARD */}
      {pageMd && (pageMd.author || pageMd.authorName) && (
        <AuthorCard 
          authorId={pageMd.authorId}
          author={pageMd.author}
          name={pageMd.authorName} 
          title={pageMd.authorTitle} 
          description={pageMd.authorDescription} 
          avatar={pageMd.authorAvatar} 
        />
      )}

      {/* 11. RESPONSIBLE GAMBLING NOTICE */}
      <ResponsibleGamblingNotice notice={pageMd?.responsibleGambling} />

      {/* 13. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection pageId={pageId || category.id} />
    </div>
  );
}
