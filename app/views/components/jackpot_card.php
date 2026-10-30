<?php
/**
 * Cheerplex - Bento Jackpot Card Component
 * Exact parity with React JackpotListPage.tsx Bento Jackpot Card
 * @var array $jackpot
 */

$jId = $jackpot['id'] ?? $jackpot['slug'] ?? 'sportpesa-mega';
$jDetails = getJackpotDetails($jId) ?? $jackpot;
$fixtures = $jDetails['fixtures'] ?? ($jackpot['fixtures'] ?? []);
$gamesCount = $jackpot['games_count'] ?? $jackpot['gamesCount'] ?? count($fixtures);
$pool = $jackpot['estimated_pool'] ?? $jackpot['estimatedPool'] ?? 'KES 385,400,000';
$price = (int)($jackpot['price'] ?? 1);
$submissionsFill = $jackpot['submissions_fill'] ?? $jackpot['submissionsFill'] ?? '94%';
$url = getPageUrl($jId);

$timing = getJackpotTiming($jId, $fixtures);
$firstMatch = $timing['firstFixture'] ?? ($fixtures[0] ?? null);
$lastMatch = $timing['lastFixture'] ?? (!empty($fixtures) ? $fixtures[count($fixtures) - 1] : null);

// Brand Badge
$idLower = strtolower($jId);
if (strpos($idLower, 'sportpesa') !== false) {
    $brandName = 'SportPesa';
    $brandBadge = 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
} elseif (strpos($idLower, 'betika') !== false) {
    $brandName = 'Betika';
    $brandBadge = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
} elseif (strpos($idLower, 'mozzart') !== false) {
    $brandName = 'Mozzart';
    $brandBadge = 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
} else {
    $brandName = 'Kenyan Pool';
    $brandBadge = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
}
?>
<div 
  class="jp-list-card flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/80 transition-all duration-300 shadow-md hover:shadow-xl text-left relative group"
  data-jid="<?= e($jId) ?>"
>
  <div class="space-y-4">
    <!-- Top Row: Operator Badge, Country, Games, Price -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-md font-mono text-[9px] font-black tracking-wider border <?= $brandBadge ?>">
          <?= $brandName ?>
        </span>
        <span class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9.5px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <?= $gamesCount ?> Matches
        </span>
        <span class="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-black tracking-wider <?= $timing['statusBadge']['badgeClass'] ?>">
          <?= $timing['statusBadge']['badgeText'] ?>
        </span>
      </div>

      <div class="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shadow-xs">
        KES <?= $price ?>
      </div>
    </div>

    <!-- Title and Prize Pool Banner -->
    <div>
      <h3 class="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight font-display group-hover:text-blue-600 transition-colors m-0">
        <a href="<?= e($url) ?>" class="text-inherit no-underline hover:text-blue-600">
          <?= e($jackpot['name']) ?>
        </a>
      </h3>
      <div class="mt-1.5 flex items-baseline gap-2">
        <span class="text-[10px] font-mono font-bold uppercase text-slate-600">
          Estimated Jackpot Pool:
        </span>
        <span class="text-lg font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight tabular-nums">
          <?= e($pool) ?>
        </span>
      </div>
    </div>

    <!-- Live Countdown & Kickoff Schedule Box -->
    <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-xs">
      <div class="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
        <span class="flex items-center gap-1.5 font-bold">
          <?= renderIcon('clock', 'w-3.5 h-3.5 ' . ($timing['hasStarted'] ? 'text-amber-500' : ($timing['hasEnded'] ? 'text-slate-400' : 'text-blue-500'))) ?>
          <span><?= $timing['hasStarted'] ? 'Matches In Progress:' : ($timing['hasEnded'] ? 'Pool Concluded:' : 'Kickoff Closes In:') ?></span>
        </span>
        <?php 
          $jackpotId = $jId;
          $digitsOnly = true;
          include __DIR__ . '/jackpot_countdown_timer.php';
          $digitsOnly = false;
        ?>
      </div>

      <!-- Schedule Window -->
      <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="text-[10px] uppercase text-slate-600 font-semibold">First Match:</span>
          </div>
          <div class="text-right">
            <span class="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">
              <?= e($timing['formattedEarliest']) ?>
            </span>
            <?php if ($firstMatch): ?>
              <span class="text-[10px] text-slate-600 dark:text-slate-400 block truncate max-w-[220px]">
                #<?= $firstMatch['position'] ?? 1 ?> <?= e(($firstMatch['homeTeam'] ?? '') . ' vs ' . ($firstMatch['awayTeam'] ?? '')) ?>
              </span>
            <?php endif; ?>
          </div>
        </div>

        <div class="flex items-start justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
            <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span class="text-[10px] uppercase text-slate-600 font-semibold">Final Leg:</span>
          </div>
          <div class="text-right">
            <span class="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
              <?= e($timing['formattedLatest']) ?>
            </span>
            <?php if ($lastMatch): ?>
              <span class="text-[10px] text-slate-600 dark:text-slate-400 block truncate max-w-[220px]">
                #<?= $lastMatch['position'] ?? count($fixtures) ?> <?= e(($lastMatch['homeTeam'] ?? '') . ' vs ' . ($lastMatch['awayTeam'] ?? '')) ?>
              </span>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- Allocation Fill Bar -->
      <div class="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <div class="flex items-center justify-between text-[10px] text-slate-600">
          <span class="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <?= renderIcon('flame', 'w-3 h-3 text-amber-500') ?> Syndicate Submissions Fill
          </span>
          <span class="font-bold text-amber-700 dark:text-amber-400 tabular-nums"><?= e($submissionsFill) ?></span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div class="h-full bg-blue-600 rounded-full" style="width: <?= e($submissionsFill) ?>"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Card Footer Actions -->
  <div class="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
    <a
      href="<?= e($url) ?>"
      class="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md no-underline transition-all active:scale-98 border-none"
    >
      <?= renderIcon('trophy', 'w-4 h-4 text-amber-300') ?>
      <span>View Jackpot Predictions</span>
      <?= renderIcon('arrow-right', 'w-4 h-4 text-white') ?>
    </a>
  </div>
</div>
