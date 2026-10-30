<?php
/**
 * Cheerplex - Live Fixtures & Prediction Tags Component
 * @var array $fixtures
 */

if (empty($fixtures)) {
    return;
}

$top2 = array_slice($fixtures, 0, 2);
$top2Str = ($top2[0]['homeTeam'] ?? '') . ' vs ' . ($top2[0]['awayTeam'] ?? '');
if (isset($top2[1])) {
    $top2Str .= ', ' . ($top2[1]['homeTeam'] ?? '') . ' vs ' . ($top2[1]['awayTeam'] ?? '');
}

$leaguesList = array_unique(array_filter(array_column($fixtures, 'leagueName')));
$leaguesStr = implode(', ', array_slice($leaguesList, 0, 5));

$predCounts = ['1' => 0, 'X' => 0, '2' => 0];
foreach ($fixtures as $f) {
    $p = trim($f['prediction'] ?? '1');
    if ($p === '1' || strpos($p, 'Home') !== false) $predCounts['1']++;
    elseif ($p === 'X' || strpos($p, 'Draw') !== false) $predCounts['X']++;
    else $predCounts['2']++;
}
$tot = max(1, count($fixtures));
$hPct = round(($predCounts['1'] / $tot) * 100);
$dPct = round(($predCounts['X'] / $tot) * 100);
$aPct = max(0, 100 - $hPct - $dPct);
$predBreakdownStr = "Home Win (1): {$hPct}%, Draw (X): {$dPct}%, Away Win (2): {$aPct}%";
?>
<section aria-label="Prediction Tags" class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left space-y-3">
  
  <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
        #
      </div>
      <h3 class="text-xs sm:text-sm font-black tracking-wider font-mono text-slate-900">
        Today's Fixtures & Prediction Tags
      </h3>
    </div>
    <span class="text-[10px] font-mono text-slate-400 hidden sm:inline-block">Auto-Generated Tags</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono">
    
    <!-- Tag 1: Top 2 Fixtures -->
    <div class="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5 flex flex-col justify-between">
      <div class="space-y-1">
        <span class="text-[9.5px] font-black uppercase text-blue-600 block">Top 2 Fixtures</span>
        <p class="text-[11px] text-slate-700 truncate"><?= e($top2Str) ?></p>
      </div>
      <button 
        type="button" 
        onclick="copyTagText(<?= htmlspecialchars(json_encode($top2Str)) ?>, this)"
        class="self-start text-[10px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
      >
        Copy Tag
      </button>
    </div>

    <!-- Tag 2: Leagues -->
    <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 flex flex-col justify-between">
      <div class="space-y-1">
        <span class="text-[9.5px] font-black uppercase text-slate-700 block">Featured Leagues</span>
        <p class="text-[11px] text-slate-700 truncate"><?= e($leaguesStr) ?></p>
      </div>
      <button 
        type="button" 
        onclick="copyTagText(<?= htmlspecialchars(json_encode($leaguesStr)) ?>, this)"
        class="self-start text-[10px] font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
      >
        Copy Tag
      </button>
    </div>

    <!-- Tag 3: Predictions Breakdown -->
    <div class="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5 flex flex-col justify-between">
      <div class="space-y-1">
        <span class="text-[9.5px] font-black uppercase text-indigo-600 block">Predictions Distribution</span>
        <p class="text-[11px] text-slate-700 truncate"><?= e($predBreakdownStr) ?></p>
      </div>
      <button 
        type="button" 
        onclick="copyTagText(<?= htmlspecialchars(json_encode($predBreakdownStr)) ?>, this)"
        class="self-start text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
      >
        Copy Tag
      </button>
    </div>

  </div>

</section>
