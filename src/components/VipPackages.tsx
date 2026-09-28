import React from 'react';
import { 
  Crown, 
  Check, 
  ArrowRight, 
  Star, 
  Smartphone, 
  ShieldCheck, 
  Clock,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { VipPackage } from '../types';

interface VipPackagesProps {
  packages: VipPackage[];
  onOpenPayment: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  userPurchasedItemIds?: string[];
  title?: string;
  subtitle?: string;
}

export default function VipPackages({
  packages,
  onOpenPayment,
  userPurchasedItemIds = [],
  title,
  subtitle
}: VipPackagesProps) {
  // Always display the 3 core packages in one single line as requested
  const displayPackages = packages.slice(0, 3);

  // Baseline daily rate from 1-day pass (default 200 KES)
  const singleDayPass = packages.find(p => p.durationDays === 1);
  const baselineDailyPrice = singleDayPass ? (singleDayPass.price <= 1 ? 200 : singleDayPass.price) : 200;

  const getTierMeta = (pkg: VipPackage, idx: number) => {
    const days = pkg.durationDays;
    if (days <= 1) {
      return {
        tierName: 'STARTER PASS',
        badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        accentGradient: 'from-blue-600 via-indigo-600 to-blue-700',
        ringClass: 'border-[var(--border)] hover:border-blue-500/60 shadow-xs hover:shadow-md',
        isFeatured: false,
        recommendedTag: null,
        savingsText: null,
        cardBg: 'bg-[var(--card)]',
        btnBg: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }
    if (days <= 4) {
      const dailyRate = Math.round(pkg.price / days);
      const savings = Math.max(0, Math.round(((baselineDailyPrice * days - pkg.price) / (baselineDailyPrice * days)) * 100));
      return {
        tierName: 'WEEKEND SYNDICATE',
        badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
        accentGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
        ringClass: 'border-cyan-500/40 hover:border-cyan-500/80 shadow-xs hover:shadow-cyan-500/5',
        isFeatured: false,
        recommendedTag: 'WEEKEND VALUE',
        savingsText: savings > 0 ? `Save ${savings}%` : 'High Value',
        cardBg: 'bg-[var(--card)]',
        btnBg: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }
    // 7 Days / Most Popular
    const dailyRate = Math.round(pkg.price / days);
    const savings = Math.max(0, Math.round(((baselineDailyPrice * days - pkg.price) / (baselineDailyPrice * days)) * 100));
    return {
      tierName: 'VIP PRO SYNDICATE',
      badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40',
      accentGradient: 'from-amber-400 via-amber-500 to-orange-500',
      ringClass: 'border-amber-500/80 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/30 hover:ring-amber-500/60',
      isFeatured: true,
      recommendedTag: '👑 MOST POPULAR',
      savingsText: savings > 0 ? `Save ${savings}%` : 'Best Value',
      cardBg: 'bg-gradient-to-b from-amber-500/5 via-[var(--card)] to-[var(--card)]',
      btnBg: 'bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black shadow-amber-500/20'
    };
  };

  return (
    <section 
      id="vip-packages" 
      aria-label="Cheerplex VIP Packages Subscriptions"
      className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4 sm:space-y-5 relative overflow-hidden w-full"
    >
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm ring-2 ring-amber-400/30">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight uppercase text-[var(--text)] font-display">
                {title || "Cheerplex VIP Packages"}
              </h2>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                89.4% WIN RATE
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
              {subtitle || "Algorithmic high-probability football selections and Kenyan jackpot combinations dispatched via Safaricom M-Pesa."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3 h-3 text-amber-500" /> &lt; 60s SMS Delivery
          </span>
        </div>
      </div>

      {/* 2. THE THREE VIP PACKAGES IN ONE LINE ONLY (COMPACT & FULL WIDTH) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full items-stretch">
        {displayPackages.map((pkg, idx) => {
          const isPurchased = userPurchasedItemIds.includes(String(pkg.id)) || userPurchasedItemIds.includes(pkg.slug);
          const meta = getTierMeta(pkg, idx);
          const dailyRate = Math.round(pkg.price / Math.max(1, pkg.durationDays));

          return (
            <div
              key={pkg.id || idx}
              className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden text-left h-full ${meta.cardBg} ${meta.ringClass}`}
            >
              {/* Top Colored Accent Stripe */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${meta.accentGradient}`} />

              <div className="p-4 sm:p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Information: Tier Name & Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${meta.badgeColor}`}>
                      {meta.tierName}
                    </span>

                    {meta.recommendedTag && (
                      <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        {meta.recommendedTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[var(--text)] tracking-tight font-display">
                      {pkg.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {pkg.durationDays} {pkg.durationDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-snug">
                    {pkg.description}
                  </p>
                </div>

                {/* Compact Price Display Box */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-[var(--border)] my-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold tracking-wider">
                        Subscription Fee
                      </span>
                      <div className="text-xl sm:text-2xl font-black font-mono text-[var(--text)] tracking-tight tabular-nums">
                        KES {pkg.price.toLocaleString()}
                      </div>
                    </div>
                    {pkg.durationDays > 1 ? (
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">
                          Daily Rate
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          KES {dailyRate}/day
                        </span>
                      </div>
                    ) : (
                      meta.savingsText && (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {meta.savingsText}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Compact Feature Bullet Points (Top 3) */}
                <ul className="space-y-1.5 text-xs text-[var(--text)] py-1">
                  {pkg.features.slice(0, 3).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 sm:p-4.5 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenPayment(pkg.name, pkg.price, pkg.id, pkg.slug, 'vip')}
                  className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-[0.98] border-none shadow-xs ${
                    isPurchased
                      ? 'bg-emerald-600 text-white cursor-default'
                      : meta.btnBg
                  }`}
                >
                  {isPurchased ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Pass Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Unlock • KES {pkg.price.toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. COMPACT REPLACEMENT GUARANTEE */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)] uppercase font-mono">Cheerplex Guarantee:</strong> Automatic 24-hr extension if daily tips miss 80% accuracy threshold.
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>Automated 24/7 Safaricom Paybill</span>
        </div>
      </div>
    </section>
  );
}
