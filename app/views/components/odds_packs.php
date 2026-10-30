<?php
/**
 * Cheerplex - Daily Odds Packs Component
 * Matches React OddsPacks.tsx exactly
 */

$allOdds = getOddsPacks();
$displayPacks = array_slice($allOdds, 0, 3);
?>
<section 
  id="odds-packs" 
  aria-label="Cheerplex Daily Odds Packs"
  class="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4 sm:space-y-5 relative overflow-hidden w-full"
>
  <!-- 1. COMPACT HEADER -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--border)]">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm ring-2 ring-blue-400/30">
        <?= renderIcon('zap', 'w-5 h-5 text-amber-300') ?>
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-base sm:text-lg md:text-xl font-black tracking-tight uppercase text-slate-900 font-display m-0">
            Cheerplex VIP Odds
          </h2>
          <span class="text-[10px] font-mono font-bold text-blue-600 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-300">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Daily Verified Slips
          </span>
        </div>
        <p class="text-xs text-slate-500 line-clamp-1 mt-0.5 m-0">
          Access verified low-variance algorithmic accumulators and Kenyan jackpot pool combinations via M-Pesa.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-start sm:self-auto shrink-0 text-[11px] font-mono text-slate-500">
      <span class="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
        <?= renderIcon('shield-check', 'w-3 h-3 text-blue-600') ?> Instant Delivery
      </span>
    </div>
  </div>

  <!-- 2. THE THREE ODDS PACKS -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full items-stretch">
    <?php foreach ($displayPacks as $idx => $pack): ?>
      <?php
        $price = (int)($pack['price'] ?? 200);
        $oddsMin = $pack['oddsMinDecimal'] ?? '3.00';
        $mult = (float)preg_replace('/[^0-9.]/', '', $oddsMin) ?: 3.0;

        if ($mult < 4.0) {
            $accentGradient = 'from-emerald-500 via-teal-500 to-emerald-600';
            $badgeBg = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
            $glowRing = 'border-emerald-500/30 hover:border-emerald-500/70';
            $tagText = 'SAFE BANKER';
            $winRate = 91;
            $riskColor = 'text-emerald-600';
            $isBestValue = false;
        } elseif ($mult < 6.5) {
            $accentGradient = 'from-blue-600 via-indigo-600 to-cyan-500';
            $badgeBg = 'bg-blue-500/10 text-blue-700 border-blue-500/30';
            $glowRing = 'border-blue-500/50 hover:border-blue-500/80 ring-2 ring-blue-500/20 shadow-md';
            $tagText = 'BEST VALUE';
            $winRate = 84;
            $riskColor = 'text-blue-600';
            $isBestValue = true;
        } else {
            $accentGradient = 'from-amber-500 via-orange-500 to-amber-600';
            $badgeBg = 'bg-amber-500/10 text-amber-700 border-amber-500/30';
            $glowRing = 'border-amber-500/30 hover:border-amber-500/70';
            $tagText = 'HIGH YIELD';
            $winRate = 76;
            $riskColor = 'text-amber-600';
            $isBestValue = false;
        }
      ?>
      <div class="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden text-left h-full bg-[var(--card)] <?= $glowRing ?>">
        <!-- Accent Stripe -->
        <div class="h-1.5 w-full bg-gradient-to-r <?= $accentGradient ?>"></div>

        <div class="p-4 sm:p-4.5 space-y-3 flex-1 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-1.5">
              <span class="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border <?= $badgeBg ?>">
                <?= $tagText ?>
              </span>

              <?php if ($isBestValue): ?>
                <span class="text-[9px] font-mono font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <?= renderIcon('star', 'w-2.5 h-2.5 text-amber-500') ?>
                  RECOMMENDED
                </span>
              <?php endif; ?>
            </div>

            <div class="flex items-baseline justify-between gap-2">
              <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display m-0">
                <?= e($pack['name']) ?>
              </h3>
              <span class="text-sm font-black font-mono text-blue-600">
                <?= e($oddsMin) ?>+
              </span>
            </div>

            <p class="text-[11px] text-slate-600 line-clamp-1 leading-snug m-0">
              <?= e($pack['description'] ?? 'Target multiplier accumulator slip') ?>
            </p>
          </div>

          <!-- Price & Target Return Simulator -->
          <div class="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-[var(--border)] my-1 space-y-2">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-[9px] font-mono uppercase text-slate-600 block font-bold">Pack Price</span>
                <span class="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">KES <?= number_format($price) ?></span>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-mono uppercase text-slate-600 block font-bold">Historical Win</span>
                <span class="text-xs font-mono font-black <?= $riskColor ?> tabular-nums"><?= $winRate ?>%</span>
              </div>
            </div>

            <!-- Return estimation preview -->
            <div class="pt-1.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono">
              <span class="text-slate-600">KES 500 Bet returns:</span>
              <strong class="text-emerald-700 font-black tabular-nums">KES <?= number_format(500 * $mult) ?></strong>
            </div>
          </div>

          <!-- Checkout Button -->
          <button
            type="button"
            onclick="openPaymentModal('<?= e($pack['name']) ?>', <?= $price ?>, '<?= e($pack['slug'] ?? $pack['id']) ?>', 'odds')"
            aria-label="Unlock <?= e($pack['name']) ?> for KES <?= number_format($price) ?>"
            class="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border-none mt-2"
          >
            <span>Unlock Odds Slip</span>
            <?= renderIcon('arrow-right', 'w-3.5 h-3.5') ?>
          </button>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="pt-1 text-center">
    <a 
      href="/cheerplex-sure-tips-and-odds/" 
      class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 hover:text-blue-700 no-underline py-1.5 px-3 rounded-xl hover:bg-blue-50 transition-colors"
    >
      <span>Explore All Cheerplex Decimal Odds Packs &amp; Multipliers</span>
      <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
    </a>
  </div>
</section>
