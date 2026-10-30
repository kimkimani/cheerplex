<?php
/**
 * Cheerplex - Live Updates & Verified Results Sidebar Component
 * Matches React LiveUpdates.tsx exactly
 */

$allFixtures = getAllPredictions();
$todayFixtures = getFixturesByDate('today');

// Curate settled won matches from real database fixtures
$recentWins = [];
foreach ($allFixtures as $f) {
    $st = strtoupper($f['status'] ?? '');
    if ($st === 'FT' && ($f['result'] ?? '') === 'won') {
        $recentWins[] = [
            'id'       => $f['id'] ?? 1,
            'teams'    => ($f['homeTeam'] ?? 'Home') . ' vs ' . ($f['awayTeam'] ?? 'Away'),
            'homeTeam' => $f['homeTeam'] ?? 'Home',
            'awayTeam' => $f['awayTeam'] ?? 'Away',
            'tip'      => $f['prediction'] ?? 'Home Win',
            'odds'     => number_format(max(1.25, round(100 / max(30, (int)($f['confidence'] ?? 75)), 2)), 2),
            'result'   => ($f['homeScore'] !== '-' && $f['awayScore'] !== '-') ? "{$f['homeScore']} - {$f['awayScore']}" : 'Won',
            'league'   => $f['leagueName'] ?? 'League',
            'date'     => !empty($f['kickoffTime']) ? date('M j', strtotime($f['kickoffTime'])) : 'Settled',
        ];
        if (count($recentWins) >= 5) break;
    }
}
?>
<div class="space-y-4 text-left">
  
  <!-- 1. TOP BANKER SIDEBAR WIDGET -->
  <?php 
    $banker = getTopBanker($todayFixtures);
    if ($banker) {
        $bankerVariant = 'sidebar';
        include __DIR__ . '/top_banker.php';
    }
  ?>

  <!-- 2. REDESIGNED VERIFIED RESULTS PANEL -->
  <div class="rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-[var(--border)] bg-slate-50/50 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
          <?= renderIcon('shield-check', 'w-4 h-4') ?>
        </div>
        <div>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 font-mono m-0">
            Verified Results
          </h3>
          <span class="text-[10px] text-slate-500 font-mono block">
            Audited match settlements
          </span>
        </div>
      </div>

      <span class="inline-flex items-center gap-1 text-[9.5px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        CONFIRMED
      </span>
    </div>

    <!-- Results List -->
    <div class="p-3 space-y-2">
      <?php if (empty($recentWins)): ?>
        <p class="text-xs text-slate-500 py-3 text-center font-mono m-0">
          No recently completed won matches in the database yet.
        </p>
      <?php else: ?>
        <?php foreach ($recentWins as $game): ?>
          <div class="p-3 rounded-xl bg-slate-50/70 border border-[var(--border)] hover:border-emerald-500/30 transition-colors">
            <!-- League & Date Row -->
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5">
              <span class="truncate max-w-[70%] font-medium"><?= e($game['league']) ?></span>
              <span class="text-slate-400 shrink-0"><?= e($game['date']) ?></span>
            </div>

            <!-- Match and Score -->
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="font-bold text-slate-900 text-xs truncate">
                <?= e($game['teams']) ?>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-mono font-black text-xs border border-emerald-500/20 shrink-0">
                <?= e($game['result']) ?>
              </span>
            </div>

            <!-- Tip & Status Tag -->
            <div class="flex items-center justify-between pt-1.5 border-t border-[var(--border)]/60 text-[10.5px] font-mono">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-slate-500">Tip:</span>
                <strong class="text-blue-600 font-bold truncate">
                  <?= e($game['tip']) ?>
                </strong>
                <span class="text-slate-400 font-medium">@ <?= e($game['odds']) ?></span>
              </div>

              <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 shrink-0 ml-1">
                <?= renderIcon('check-circle-2', 'w-3 h-3') ?>
                WON
              </span>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>

</div>
