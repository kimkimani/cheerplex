<?php
/**
 * Cheerplex - Curated 3-Match Market Accumulator Component
 * Matches React CuratedAccumulatorCard.tsx exactly
 */

$accaFixtures = $fixtures ?? getFixturesByDate('today');
$accaCategoryLabel = $categoryLabel ?? 'Free Tips';
$accaTitle = $title ?? "Curated 3-Match {$accaCategoryLabel} Accumulator";

// Filter 3 highest confidence non-FT matches
$topThree = [];
$seenTeams = [];
foreach ($accaFixtures as $f) {
    if (($f['status'] ?? '') === 'FT') continue;
    $key = ($f['homeTeam'] ?? '') . '-' . ($f['awayTeam'] ?? '');
    if (isset($seenTeams[$key])) continue;
    $seenTeams[$key] = true;
    $topThree[] = $f;
    if (count($topThree) >= 3) break;
}

if (count($topThree) >= 3):
    $combinedOdds = 1.0;
    foreach ($topThree as $f) {
        $c = (int)($f['confidence'] ?? 75);
        $odd = max(1.25, round(100 / max(35, $c), 2));
        $combinedOdds *= $odd;
    }
    $combinedOddsFormatted = number_format($combinedOdds, 2);
?>
<section 
  aria-label="Curated Market Accumulator" 
  class="p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left transition-all relative shadow-xs"
  id="curatedAccaCard"
>
  <!-- Header Strip -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
    <div class="space-y-0.5">
      <div class="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
        <?= renderIcon('flame', 'w-3.5 h-3.5 text-amber-500 shrink-0') ?>
        <span class="font-semibold uppercase tracking-wider text-[11px]">Daily Banker Slip</span>
        <span>·</span>
        <span>3 Selections</span>
      </div>
      <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-display m-0">
        <?= e($accaTitle) ?>
      </h3>
    </div>

    <div class="flex items-center gap-3 self-end sm:self-center">
      <div class="text-right">
        <span class="text-[10px] font-mono text-slate-500 block uppercase">Total Odds</span>
        <span class="text-base sm:text-lg font-black font-mono text-blue-600 tabular-nums">
          <?= $combinedOddsFormatted ?>x
        </span>
      </div>
      <button
        type="button"
        onclick="copyAccaSlip(this)"
        class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-2xs active:scale-95 shrink-0"
      >
        <?= renderIcon('copy', 'w-3.5 h-3.5') ?>
        <span>Copy Slip</span>
      </button>
    </div>
  </div>

  <!-- 3 Match Items -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3">
    <?php foreach ($topThree as $idx => $fix): 
      $c = (int)($fix['confidence'] ?? 75);
      $odd = number_format(max(1.25, round(100 / max(35, $c), 2)), 2);
      $league = $fix['leagueName'] ?? 'League';
      $home = $fix['homeTeam'] ?? 'Home';
      $away = $fix['awayTeam'] ?? 'Away';
      $pred = $fix['prediction'] ?? 'Home Win';
    ?>
      <div class="p-3 rounded-xl bg-slate-50 border border-[var(--border)] flex flex-col justify-between gap-2 text-left">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[10px] font-mono text-slate-500 truncate block">
              <?= e($league) ?>
            </span>
            <span class="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              @<?= $odd ?>
            </span>
          </div>
          <div class="text-xs font-semibold text-slate-900 leading-snug">
            <div class="truncate"><?= e($home) ?></div>
            <div class="truncate text-slate-500"><?= e($away) ?></div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] font-mono">
          <span class="text-slate-400 text-[10px] uppercase">Pick:</span>
          <span class="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate max-w-[140px]">
            <?= e($pred) ?>
          </span>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>
