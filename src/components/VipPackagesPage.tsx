import React from 'react';
import { Crown, Zap, Trophy, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { VipPackage, OddsPack } from '../types';
import { JackpotConfig, jackpotsData } from '../jackpotsData';
import VipPackages from './VipPackages';
import OddsPacks from './OddsPacks';
import FaqSection from './FaqSection';
import { getMarkdownContent } from '../content/markdownLoader';
import MarkdownRenderer from './MarkdownRenderer';
import { AuthorCard } from './AuthorCard';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import { sortJackpotsByStatusAndTime, getJackpotDetailedTiming } from '../utils/jackpotDateShifter';
import { getPageUrl } from '../utils/navigation';

interface VipPackagesPageProps {
  vipPackages: VipPackage[];
  oddsPacks: OddsPack[];
  jackpots?: JackpotConfig[];
  unlockedJackpots?: string[];
  userPurchasedItemIds?: string[];
  onOpenPayment: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  onSelectJackpot: (jackpotId: string) => void;
  onBackToHome?: () => void;
}

export default function VipPackagesPage({
  vipPackages,
  oddsPacks,
  jackpots = [],
  unlockedJackpots = [],
  userPurchasedItemIds = [],
  onOpenPayment,
  onSelectJackpot,
  onBackToHome
}: VipPackagesPageProps) {
  // Load the SINGLE dedicated markdown file for the VIP page
  const pageMd = getMarkdownContent('cheerplex-vip-tips');
  const activeJackpots = sortJackpotsByStatusAndTime(jackpots.length > 0 ? jackpots : jackpotsData);

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* 1. HERO BANNER HEADER */}
      <div className="relative overflow-hidden p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold   tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" /> Cheerplex VIP Packages
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold   tracking-wider">
              Instant Safaricom M-Pesa Activation
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight   font-display">
            {pageMd.displayTitle || pageMd.title || <>VIP PACKAGES, <span className="text-blue-600 dark:text-blue-400">DAILY ODDS PACKS</span> &amp; JACKPOT SLIPS</>}
          </h1>

          {pageMd.introParagraph ? (
            <div className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl font-normal">
              <MarkdownRenderer content={pageMd.introParagraph} />
            </div>
          ) : (
            <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl font-sans">
              {pageMd.description || "Upgrade your strategy with algorithmic precision. Choose from daily/weekly VIP subscription bundles, targeted 2+ to 10+ decimal odds shortlists, or complete 17 and 15 match jackpot prediction slips."}
            </p>
          )}

          {/* Quick jump anchor buttons */}
          <div className="flex flex-wrap gap-2 pt-1.5">
            <a 
              href="#vip-bundles-section" 
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-mono font-bold   transition-all no-underline flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" /> VIP Packages
            </a>
            <a 
              href="#odds-packs-section" 
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text)] hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--border)] text-xs font-mono font-bold   transition-all no-underline flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-blue-500" /> Daily Odds Packs
            </a>
            <a 
              href="#jackpot-listing-section" 
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text)] hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--border)] text-xs font-mono font-bold   transition-all no-underline flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Kenyan Jackpots
            </a>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-4 sm:pt-5 mt-5 sm:mt-6 border-t border-[var(--border)] relative z-10">
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)]">
            <span className="text-[10px] text-slate-400   font-bold font-mono block">VIP Accuracy</span>
            <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">89.4% Banker Rate</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)]">
            <span className="text-[10px] text-slate-400   font-bold font-mono block">Odds Delivery</span>
            <p className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">Instant via SMS</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)]">
            <span className="text-[10px] text-slate-400   font-bold font-mono block">Jackpots Tracked</span>
            <p className="text-xs sm:text-sm font-black text-[var(--text)] font-mono mt-0.5">{activeJackpots.length} Major Pools</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)]">
            <span className="text-[10px] text-slate-400   font-bold font-mono block">M-Pesa Verification</span>
            <p className="text-xs sm:text-sm font-black text-amber-500 font-mono mt-0.5">Automated 24/7</p>
          </div>
        </div>
      </div>

      {/* 2. VIP PACKAGES SECTION */}
      <section id="vip-bundles-section" className="space-y-4 scroll-mt-20">
        <VipPackages 
          packages={vipPackages}
          onOpenPayment={onOpenPayment}
          userPurchasedItemIds={userPurchasedItemIds}
          title={pageMd.listTitle}
          subtitle={pageMd.listSubtitle}
        />
      </section>

      {/* 3. ODDS PACKS SECTION */}
      <section id="odds-packs-section" className="space-y-4 scroll-mt-20">
        <OddsPacks 
          packs={oddsPacks}
          onOpenPayment={onOpenPayment}
          userPurchasedItemIds={userPurchasedItemIds}
        />
      </section>

      {/* 4. KENYAN JACKPOT QUICK-ACCESS SECTION (Renders direct cards, does NOT load jackpot-list markdown) */}
      <section id="jackpot-listing-section" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[var(--text)] tracking-tight   font-display">
                Kenyan Major Jackpot Prediction Slips
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Select any jackpot pool below to view calibrated 15 to 17-match double-chance prediction slips.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-center">
            {activeJackpots.length} Pools Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {activeJackpots.slice(0, 6).map((jackpot) => {
            const isUnlocked = unlockedJackpots.includes(jackpot.id);
            const timing = getJackpotDetailedTiming(jackpot);
            const targetUrl = getPageUrl(jackpot.id);

            return (
              <div 
                key={jackpot.id}
                className="group p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9.5px] font-mono font-black   tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                      {jackpot.gamesCount} Matches
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {timing.formattedEarliest.split(',')[0] || 'Active Pool'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-[var(--text)] tracking-tight font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {jackpot.name}
                  </h3>

                  <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {jackpot.estimatedPool}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <a
                    href={targetUrl}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        onSelectJackpot(jackpot.id);
                      }
                    }}
                    className="min-h-[40px] flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold   tracking-wider flex items-center justify-center gap-1.5 cursor-pointer no-underline transition-all active:scale-95 border-none shadow-xs"
                  >
                    <span>{isUnlocked ? 'View Slips' : 'View Predictions'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. THE ONE WHOLE SPECIFIC MARKDOWN FOR VIP PAGE */}
      {pageMd && (pageMd.sectionTitle || pageMd.sectionDescription || pageMd.analysis || pageMd.meat || pageMd.fullContent) && (
        <section aria-label="Cheerplex VIP Comprehensive Strategy Guide" className="space-y-4">
          <div className="p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] text-left space-y-4">
            <div className="space-y-1 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-black   text-[var(--text)] tracking-tight font-display">
                  {pageMd.sectionTitle || "Cheerplex VIP Comprehensive Strategy Guide"}
                </h2>
              </div>
              {pageMd.sectionDescription && (
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {pageMd.sectionDescription}
                </p>
              )}
            </div>
            {(pageMd.analysis || pageMd.meat || pageMd.fullContent) && (
              <div className="text-xs sm:text-sm leading-relaxed text-[var(--text)]">
                <MarkdownRenderer content={pageMd.analysis || pageMd.meat || pageMd.fullContent} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Author Card */}
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

      {/* Responsible Gambling Notice */}
      <ResponsibleGamblingNotice notice={pageMd.responsibleGambling} />

      {/* 6. VIP FREQUENTLY ASKED QUESTIONS */}
      <FaqSection pageId="cheerplex-vip-tips" />
    </div>
  );
}
