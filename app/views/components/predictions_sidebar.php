<?php
/**
 * Cheerplex - Predictions Intelligence Sidebar Component
 * Matches React PredictionsSidebar.tsx exactly
 */

$allFixtures = getAllPredictions();
$todayFixtures = getFixturesByDate('today');
$activePageId = $pageId ?? 'home';

// Pick 3 high-confidence fixtures for Smart Acca Builder
$sortedForAcca = $todayFixtures;
usort($sortedForAcca, function($a, $b) {
    return ($b['confidence'] ?? 75) <=> ($a['confidence'] ?? 75);
});
$accaPicks = array_slice($sortedForAcca, 0, 3);
$totalAccaOdds = 1.0;
foreach ($accaPicks as $p) {
    $c = $p['confidence'] ?? 75;
    $odd = max(1.22, round(100 / max(30, $c), 2));
    $totalAccaOdds *= $odd;
}
$bookingCode = 'CPX-' . rand(100000, 999999);

$sidebarJackpots = [
    ['id' => 'sportpesa-mega', 'name' => 'SportPesa Mega JP', 'games' => '17 Games', 'prize' => 'Ksh 385M', 'url' => getPageUrl('sportpesa-mega')],
    ['id' => 'sportpesa-midweek', 'name' => 'SportPesa Midweek', 'games' => '13 Games', 'prize' => 'Ksh 15M', 'url' => getPageUrl('sportpesa-midweek')],
    ['id' => 'betika-midweek', 'name' => 'Betika Midweek JP', 'games' => '15 Games', 'prize' => 'Ksh 15M', 'url' => getPageUrl('betika-midweek')],
    ['id' => 'mozzart-grand', 'name' => 'Mozzart Grand JP', 'games' => '20 Games', 'prize' => 'Ksh 200M', 'url' => getPageUrl('mozzart-grand')],
    ['id' => 'mozzart-super-daily', 'name' => 'Mozzart Super Daily', 'games' => '16 Games', 'prize' => 'Ksh 20M', 'url' => getPageUrl('mozzart-super-daily')],
];

$marketShortcuts = [
    ['id' => 'category-today', 'label' => "Today's Free Tips", 'icon' => 'flame', 'tag' => 'Hot', 'url' => getPageUrl('category-today')],
    ['id' => 'category-tomorrow', 'label' => "Tomorrow's Predictions", 'icon' => 'calendar', 'tag' => 'Upcoming', 'url' => getPageUrl('category-tomorrow')],
    ['id' => 'category-yesterday', 'label' => "Yesterday's Results", 'icon' => 'history', 'tag' => 'Archive', 'url' => getPageUrl('category-yesterday')],
    ['id' => 'cheerplex-sure-tips-and-odds', 'label' => "Daily Decimal Packs", 'icon' => 'percent', 'tag' => '2+ & 5+', 'url' => '/cheerplex-sure-tips-and-odds/'],
    ['id' => 'jackpot-list', 'label' => "All Jackpots Hub", 'icon' => 'trophy', 'tag' => 'Pools', 'url' => getPageUrl('jackpot-list')],
    ['id' => 'vip-packages', 'label' => "Cheerplex VIP Club", 'icon' => 'crown', 'tag' => 'VIP', 'url' => getPageUrl('vip-packages')],
];
?>
<aside aria-label="Predictions Intelligence Sidebar" class="space-y-4 text-left">
  
  <!-- 1. DAILY BANKER SLIP (3 SELECTIONS) IN SIDEBAR -->
  <div class="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] relative overflow-hidden">
    <div class="flex items-center justify-between pb-3 border-b border-[var(--border)]">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <?= renderIcon('zap', 'w-4 h-4 text-white') ?>
        </div>
        <div>
          <h3 class="text-xs font-black uppercase text-slate-900 tracking-tight font-mono m-0">
            Daily Banker Slip
          </h3>
          <p class="text-[10px] text-slate-600 m-0">
            3 Selections • Free Daily Tips
          </p>
        </div>
      </div>
      <span class="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
        3 Selections
      </span>
    </div>

    <!-- Multiplier selector pills -->
    <div class="pt-3 space-y-2">
      <div class="flex items-center justify-between text-[10px] font-mono text-slate-600">
        <span>Target Multiplier:</span>
        <span class="font-bold text-blue-600 font-mono">Total Odds: <span id="accaTotalOddsText" class="tabular-nums"><?= number_format($totalAccaOdds, 2) ?></span></span>
      </div>

      <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onclick="setAccaTier('2x')"
          id="btnAcca2x"
          aria-label="Select 2x multiplier slip"
          class="acca-tab-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-blue-600 text-white shadow-xs"
        >
          2x Slip
        </button>
        <button
          type="button"
          onclick="setAccaTier('3x')"
          id="btnAcca3x"
          aria-label="Select 3x multiplier slip"
          class="acca-tab-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-transparent text-slate-700 hover:text-slate-900"
        >
          3x Slip
        </button>
        <button
          type="button"
          onclick="setAccaTier('5x')"
          id="btnAcca5x"
          aria-label="Select 5x multiplier slip"
          class="acca-tab-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-transparent text-slate-700 hover:text-slate-900"
        >
          5x Slip
        </button>
      </div>

      <!-- Generated Matches Mini List -->
      <div id="accaPicksContainer" class="space-y-1.5 pt-1">
        <?php if (empty($accaPicks)): ?>
          <p class="text-[11px] text-slate-600 font-mono py-2 text-center m-0">
            No matches scheduled for today in the database yet.
          </p>
        <?php else: ?>
          <?php foreach ($accaPicks as $i => $pick): ?>
            <div 
              class="acca-pick-item p-2 rounded-xl bg-slate-50 border border-[var(--border)] flex items-center justify-between text-[11px]"
              data-index="<?= $i ?>"
            >
              <div class="min-w-0 pr-2">
                <div class="font-bold text-slate-900 truncate"><?= e($pick['homeTeam']) ?> vs <?= e($pick['awayTeam']) ?></div>
                <div class="text-[9.5px] text-blue-600 font-mono font-semibold">Tip: <?= e($pick['prediction'] ?? '1X') ?></div>
              </div>
              <span class="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 shrink-0 tabular-nums">
                <?= (int)($pick['confidence'] ?? 80) ?>%
              </span>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Booking Code & Copy -->
      <div class="pt-2 flex items-center gap-2">
        <div class="flex-1 p-2 rounded-xl bg-slate-100 border border-[var(--border)] flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-600 uppercase">Code:</span>
          <span id="accaBookingCodeText" class="text-xs font-mono font-black text-blue-600 tabular-nums"><?= $bookingCode ?></span>
        </div>
        <button
          type="button"
          onclick="copyAccaBookingCode()"
          id="btnCopyAccaCode"
          aria-label="Copy booking code"
          class="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-xs border-none flex items-center justify-center active:scale-95"
        >
          <?= renderIcon('copy', 'w-4 h-4') ?>
        </button>
      </div>
    </div>
  </div>

  <!-- 2. TOP JACKPOTS RADAR -->
  <div class="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
    <div class="p-3.5 border-b border-[var(--border)] bg-slate-50/80 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <?= renderIcon('trophy', 'w-4 h-4') ?>
        </div>
        <div>
          <div class="text-xs font-black uppercase text-slate-900 tracking-wider font-mono">
            Top Jackpots
          </div>
          <div class="text-[10px] text-slate-500 font-medium">
            Live Kenyan Prize Pools
          </div>
        </div>
      </div>
      <a
        href="<?= getPageUrl('jackpot-list') ?>"
        class="text-[10px] font-mono font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 no-underline"
      >
        View All
      </a>
    </div>

    <div class="p-2 space-y-1">
      <?php foreach ($sidebarJackpots as $jp): ?>
        <?php $isActive = $activePageId === $jp['id']; ?>
        <a
          href="<?= $jp['url'] ?>"
          class="w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer group no-underline <?= $isActive ? 'bg-blue-50 border-blue-600 shadow-xs' : 'bg-transparent border-transparent hover:bg-slate-50' ?>"
        >
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
              <?= e($jp['name']) ?>
            </div>
            <div class="text-[10px] font-mono text-slate-500">
              <?= e($jp['games']) ?>
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

  <!-- 3. MARKET INTELLIGENCE NAVIGATION -->
  <div class="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] space-y-2">
    <span class="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">
      Market Intelligence
    </span>
    <nav class="space-y-1">
      <?php foreach ($marketShortcuts as $item): ?>
        <?php $isActive = $activePageId === $item['id']; ?>
        <a
          href="<?= $item['url'] ?>"
          class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all no-underline cursor-pointer border <?= $isActive ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'border-transparent text-slate-900 hover:bg-slate-100' ?>"
        >
          <div class="flex items-center gap-2 min-w-0">
            <?= renderIcon($item['icon'], 'w-4 h-4 shrink-0 ' . ($isActive ? 'text-white' : 'text-blue-600')) ?>
            <span class="truncate"><?= e($item['label']) ?></span>
          </div>
          <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded <?= $isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600' ?>">
            <?= e($item['tag']) ?>
          </span>
        </a>
      <?php endforeach; ?>
    </nav>
  </div>

  <!-- 4. TRUST BADGE -->
  <div class="p-3 rounded-xl bg-slate-50 border border-[var(--border)] space-y-1.5">
    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
      <?= renderIcon('shield-check', 'w-4 h-4 text-blue-600') ?>
      <span>Quantitative Predictive Rigor</span>
    </div>
    <p class="text-[10px] text-slate-500 leading-relaxed m-0">
      Zero bias matchday models verified against 100,000+ historical league fixtures across CAF, UEFA, EPL, La Liga, and Serie A.
    </p>
  </div>

</aside>
