<?php
/**
 * Cheerplex - Kenyan Jackpot Intelligence Sidebar Component
 * Matches React JackpotSidebar.tsx exactly
 */

$allFixtures = getAllPredictions();
$todayFixtures = getFixturesByDate('today');
$currentJackpotId = $jackpotId ?? $pageId ?? 'sportpesa-mega';
$currentJackpotName = $jackpot['name'] ?? 'SportPesa Mega Jackpot';

$platformRate = (strpos($currentJackpotId, 'betika') !== false) ? 15 : ((strpos($currentJackpotId, 'mozzart') !== false) ? 50 : 99);

$altJackpots = [
    ['id' => 'sportpesa-mega', 'name' => 'SportPesa Mega JP', 'games' => '17 Games', 'prize' => 'Ksh 385M', 'status' => 'Closes Sat', 'url' => getPageUrl('sportpesa-mega')],
    ['id' => 'sportpesa-midweek', 'name' => 'SportPesa Midweek', 'games' => '13 Games', 'prize' => 'Ksh 15M', 'status' => 'Closes Wed', 'url' => getPageUrl('sportpesa-midweek')],
    ['id' => 'betika-midweek', 'name' => 'Betika Midweek JP', 'games' => '15 Games', 'prize' => 'Ksh 15M', 'status' => 'Closes Wed', 'url' => getPageUrl('betika-midweek')],
    ['id' => 'mozzart-grand', 'name' => 'Mozzart Grand JP', 'games' => '20 Games', 'prize' => 'Ksh 200M', 'status' => 'Closes Sat', 'url' => getPageUrl('mozzart-grand')],
    ['id' => 'mozzart-super-daily', 'name' => 'Mozzart Super Daily', 'games' => '16 Games', 'prize' => 'Ksh 20M', 'status' => 'Daily', 'url' => getPageUrl('mozzart-super-daily')],
];

$historicWinners = [
    ['jackpot' => 'Betika Midweek', 'score' => '13 / 15', 'prize' => 'KES 52,190', 'date' => '9 Jul 2026'],
    ['jackpot' => 'SportPesa Mega', 'score' => '15 / 17', 'prize' => 'KES 245,600', 'date' => 'Last Sunday'],
    ['jackpot' => 'Mozzart Daily', 'score' => '14 / 16', 'prize' => 'KES 18,300', 'date' => '11 Jul 2026'],
];
?>
<aside aria-label="Jackpot Intelligence Sidebar" class="space-y-4 text-left">
  
  <!-- 1. TOP BANKER OF THE DAY SIDEBAR CARD -->
  <?php 
    $banker = getTopBanker();
    $bankerVariant = 'sidebar';
    include __DIR__ . '/top_banker.php';
  ?>

  <!-- 2. VIP FULL SLIP ACCESS HERO -->
  <div class="p-4 rounded-2xl bg-blue-600 text-white shadow-md border border-blue-500/40 space-y-3 relative overflow-hidden">
    <div class="flex items-center justify-between gap-2 relative z-10">
      <div class="flex items-center gap-1.5">
        <?= renderIcon('crown', 'w-4 h-4 text-amber-300 shrink-0') ?>
        <span class="text-xs font-black uppercase tracking-wide font-mono">
          Full Pro Slip Unlock
        </span>
      </div>
      <span class="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
        KES 250
      </span>
    </div>

    <p class="text-[11.5px] text-blue-100 leading-snug relative z-10 m-0">
      Unlock all mathematical selections with verified double-chance combinations and zero-variance insurance.
    </p>

    <button
      type="button"
      onclick="openPaymentModal('<?= e($currentJackpotName) ?> VIP Slip', 250, '<?= e($currentJackpotId) ?>', 'jackpot')"
      class="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-xs transition-all active:scale-95"
    >
      <?= renderIcon('coins', 'w-3.5 h-3.5 text-amber-300') ?>
      <span>Unlock Pro Combinations</span>
    </button>

    <div class="text-[9.5px] font-mono text-blue-200 text-center flex items-center justify-center gap-1.5 pt-0.5">
      <span>Pochi La Biashara:</span>
      <strong class="text-white font-bold">0740841375</strong>
    </div>
  </div>

  <!-- 3. INTERACTIVE DOUBLE CHANCE & COMBINATION MATRIX -->
  <div class="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-3">
    <div class="flex items-center justify-between pb-2 border-b border-[var(--border)]">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <?= renderIcon('calculator', 'w-4 h-4') ?>
        </div>
        <div>
          <h3 class="text-xs font-black uppercase text-slate-900 tracking-wider font-mono m-0">
            Slip Stake Matrix
          </h3>
          <p class="text-[10px] text-slate-500 m-0">
            Double Chance Combinations
          </p>
        </div>
      </div>
      <span class="text-[9.5px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
        Formula 2^N
      </span>
    </div>

    <!-- Double Chances Selector -->
    <div class="space-y-2 pt-1">
      <div class="flex items-center justify-between text-xs font-mono">
        <span class="text-slate-600">Double Chances (N):</span>
        <span id="matrixDcText" class="font-black text-blue-600">2 Picks</span>
      </div>

      <div class="grid grid-cols-5 gap-1.5">
        <?php foreach ([0, 1, 2, 3, 4] as $dc): ?>
          <button
            type="button"
            onclick="setStakeMatrixDc(<?= $dc ?>, <?= $platformRate ?>)"
            aria-label="Calculate stake for <?= $dc ?> double chances"
            class="dc-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none <?= $dc === 2 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:text-slate-900' ?>"
            id="dcBtn-<?= $dc ?>"
          >
            <?= $dc ?> DC
          </button>
        <?php endforeach; ?>
      </div>

      <!-- Calculations breakdown -->
      <div class="p-3 rounded-xl bg-slate-50 border border-[var(--border)] space-y-2 mt-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-600 font-mono text-[11px]">Total Combinations:</span>
          <span id="matrixCombinationsText" class="font-mono font-bold text-slate-900 tabular-nums">4 Lines</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-600 font-mono text-[11px]">Base Ticket Price:</span>
          <span class="font-mono font-bold text-slate-900 tabular-nums">KES <?= $platformRate ?></span>
        </div>
        <div class="pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <span class="text-xs font-bold text-slate-900 font-mono">Estimated Stake:</span>
          <span id="matrixEstimatedStakeText" class="text-sm font-black font-mono text-blue-600 tabular-nums">
            KES <?= number_format(4 * $platformRate) ?>
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. ALTERNATIVE JACKPOT POOLS -->
  <div class="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
    <div class="p-3.5 border-b border-[var(--border)] bg-slate-50/80 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <?= renderIcon('trophy', 'w-4 h-4') ?>
        </div>
        <div>
          <div class="text-xs font-black uppercase text-slate-900 tracking-wider font-mono">
            Alternative Jackpots
          </div>
          <div class="text-[10px] text-slate-500 font-medium">
            Switch Target Pool
          </div>
        </div>
      </div>
    </div>

    <div class="p-2 space-y-1">
      <?php foreach ($altJackpots as $jp): ?>
        <?php $isActive = $currentJackpotId === $jp['id']; ?>
        <a
          href="<?= $jp['url'] ?>"
          class="w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer group no-underline <?= $isActive ? 'bg-blue-50 border-blue-600 shadow-xs' : 'bg-transparent border-transparent hover:bg-slate-50' ?>"
        >
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
              <?= e($jp['name']) ?>
            </div>
            <div class="text-[10px] font-mono text-slate-500">
              <?= e($jp['games']) ?> • <?= e($jp['status']) ?>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              <?= e($jp['prize']) ?>
            </span>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- 5. RECENT VERIFIED BONUS WINNERS -->
  <div class="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-3">
    <div class="flex items-center justify-between pb-2 border-b border-[var(--border)]">
      <div class="flex items-center gap-1.5">
        <span class="text-amber-500 font-black text-sm">✦</span>
        <span class="text-xs font-black uppercase text-slate-900 font-mono">
          Bonus Winners
        </span>
      </div>
      <span class="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
        Verified
      </span>
    </div>

    <div class="space-y-2">
      <?php foreach ($historicWinners as $win): ?>
        <div class="p-2.5 rounded-xl bg-slate-50 border border-[var(--border)] flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-slate-900 text-[11px]"><?= e($win['jackpot']) ?></div>
            <div class="text-[10px] font-mono text-slate-500"><?= e($win['score']) ?> • <?= e($win['date']) ?></div>
          </div>
          <span class="font-black font-mono text-emerald-600 text-xs">
            <?= e($win['prize']) ?>
          </span>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

</aside>
