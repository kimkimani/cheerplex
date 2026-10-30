<?php
/**
 * Cheerplex - VIP Packages Subscriptions Component
 * Matches React VipPackages.tsx exactly
 */

$allVip = getVipPackages();
$displayPackages = array_slice($allVip, 0, 3);
?>
<section 
  id="vip-packages" 
  aria-label="Cheerplex VIP Packages Subscriptions"
  class="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4 sm:space-y-5 relative overflow-hidden w-full"
>
  <!-- 1. COMPACT HEADER -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--border)]">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm ring-2 ring-amber-400/30">
        <?= renderIcon('crown', 'w-5 h-5 text-white') ?>
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-base sm:text-lg md:text-xl font-black tracking-tight uppercase text-slate-900 font-display m-0">
            Cheerplex VIP Packages
          </h2>
          <span class="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            89.4% WIN RATE
          </span>
        </div>
        <p class="text-xs text-slate-500 line-clamp-1 mt-0.5 m-0">
          Algorithmic high-probability football selections and Kenyan jackpot combinations dispatched via Safaricom M-Pesa.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-start sm:self-auto shrink-0 text-[11px] font-mono text-slate-500">
      <span class="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
        <?= renderIcon('zap', 'w-3 h-3 text-amber-500') ?> &lt; 60s SMS Delivery
      </span>
    </div>
  </div>

  <!-- 2. THE THREE VIP PACKAGES IN ONE LINE ONLY -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full items-stretch">
    <?php foreach ($displayPackages as $idx => $pkg): ?>
      <?php
        $days = (int)($pkg['durationDays'] ?? 1);
        $price = (int)($pkg['price'] ?? 200);
        $features = is_array($pkg['features']) ? $pkg['features'] : ['Daily verified banker slips', 'Kenyan jackpot pool combinations', 'SMS & WhatsApp dispatch'];

        if ($days <= 1) {
            $tierName = 'STARTER PASS';
            $badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
            $accentGradient = 'from-blue-600 via-indigo-600 to-blue-700';
            $ringClass = 'border-[var(--border)] hover:border-blue-500/60 shadow-xs hover:shadow-md';
            $recommendedTag = null;
            $savingsText = null;
            $cardBg = 'bg-[var(--card)]';
            $btnBg = 'bg-blue-600 hover:bg-blue-700 text-white';
        } elseif ($days <= 4) {
            $tierName = 'WEEKEND SYNDICATE';
            $badgeColor = 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30';
            $accentGradient = 'from-cyan-500 via-blue-600 to-indigo-600';
            $ringClass = 'border-cyan-500/40 hover:border-cyan-500/80 shadow-xs';
            $recommendedTag = 'WEEKEND VALUE';
            $savingsText = 'Save 44%';
            $cardBg = 'bg-[var(--card)]';
            $btnBg = 'bg-blue-600 hover:bg-blue-700 text-white';
        } else {
            $tierName = 'VIP PRO SYNDICATE';
            $badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-500/40';
            $accentGradient = 'from-amber-400 via-amber-500 to-orange-500';
            $ringClass = 'border-amber-500/80 shadow-md ring-2 ring-amber-500/30 hover:ring-amber-500/60';
            $recommendedTag = '👑 MOST POPULAR';
            $savingsText = 'Best Value';
            $cardBg = 'bg-gradient-to-b from-amber-500/5 via-[var(--card)] to-[var(--card)]';
            $btnBg = 'bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black';
        }
        $dailyRate = round($price / max(1, $days));
      ?>
      <div class="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden text-left h-full <?= $cardBg ?> <?= $ringClass ?>">
        <!-- Accent Stripe -->
        <div class="h-1.5 w-full bg-gradient-to-r <?= $accentGradient ?>"></div>

        <div class="p-4 sm:p-4.5 space-y-3 flex-1 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-1.5">
              <span class="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border <?= $badgeColor ?>">
                <?= $tierName ?>
              </span>

              <?php if ($recommendedTag): ?>
                <span class="text-[9px] font-mono font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <?= renderIcon('star', 'w-2.5 h-2.5 text-amber-500') ?>
                  <?= $recommendedTag ?>
                </span>
              <?php endif; ?>
            </div>

            <div class="flex items-baseline justify-between gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display m-0">
                <?= e($pkg['name']) ?>
              </h3>
              <span class="text-xs font-mono font-bold text-blue-600 flex items-center gap-1 shrink-0">
                <?= renderIcon('clock', 'w-3 h-3') ?>
                <?= $days ?> <?= $days === 1 ? 'Day' : 'Days' ?>
              </span>
            </div>

            <p class="text-[11px] text-slate-600 line-clamp-1 leading-snug m-0">
              <?= e($pkg['description'] ?? 'High-confidence picks') ?>
            </p>
          </div>

          <!-- Price Box -->
          <div class="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-[var(--border)] my-1">
            <div class="flex items-baseline justify-between gap-2">
              <div>
                <span class="text-[9px] font-mono uppercase text-slate-600 block font-bold tracking-wider">
                  Subscription Fee
                </span>
                <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight tabular-nums">
                  KES <?= number_format($price) ?>
                </div>
              </div>
              <?php if ($days > 1): ?>
                <div class="text-right">
                  <span class="text-[9px] font-mono text-slate-600 uppercase block font-semibold">
                    Daily Rate
                  </span>
                  <span class="text-[11px] font-mono font-bold text-emerald-700 tabular-nums">
                    KES <?= $dailyRate ?>/day
                  </span>
                </div>
              <?php elseif ($savingsText): ?>
                <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                  <?= $savingsText ?>
                </span>
              <?php endif; ?>
            </div>
          </div>

          <!-- Features list -->
          <ul class="space-y-1.5 text-xs text-slate-800 py-1 m-0 p-0 list-none">
            <?php foreach (array_slice($features, 0, 3) as $feat): ?>
              <li class="flex items-start gap-1.5 text-[11px] leading-snug">
                <div class="w-3.5 h-3.5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <?= renderIcon('check', 'w-2.5 h-2.5 stroke-[3]') ?>
                </div>
                <span><?= e($feat) ?></span>
              </li>
            <?php endforeach; ?>
          </ul>

          <!-- Unlock button -->
          <button
            type="button"
            onclick="openPaymentModal('<?= e($pkg['name']) ?>', <?= $price ?>, '<?= e($pkg['slug'] ?? $pkg['id']) ?>', 'vip')"
            aria-label="Unlock <?= e($pkg['name']) ?> for KES <?= number_format($price) ?>"
            class="w-full py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border-none mt-2 <?= $btnBg ?>"
          >
            <span>Unlock via M-Pesa</span>
            <?= renderIcon('arrow-right', 'w-3.5 h-3.5') ?>
          </button>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</section>
