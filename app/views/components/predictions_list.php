<?php
/**
 * Cheerplex - Verified Predictions List Component
 * Matches React PredictionsList.tsx exactly
 */

$fixturesList = $fixtures ?? getFixturesByDate('today');
$listTitle = $title ?? 'Cheerplex Verified Daily Predictions';
$listSubtitle = $subtitle ?? 'Mathematical probabilities and double-chance safety locks updated daily across 20+ leagues worldwide.';
$groupByDate = $groupByDate ?? true;

// Deduplicate & Sort fixtures: latest date first, and within date earliest kickoff first
$fixturesList = sortFixturesByLatestDate($fixturesList);

// Group fixtures by kickoff date key (YYYY-MM-DD)
$dateGroups = [];
if ($groupByDate && !empty($fixturesList)) {
    foreach ($fixturesList as $f) {
        $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
        $dateKey = !empty($ko) ? substr($ko, 0, 10) : 'unknown';
        if (!isset($dateGroups[$dateKey])) {
            $info = getDateGroupInfo($dateKey);
            $dateGroups[$dateKey] = [
                'dateKey'   => $dateKey,
                'label'     => $info['label'],
                'subLabel'  => $info['subLabel'],
                'badgeText' => $info['badgeText'],
                'fixtures'  => []
            ];
        }
        $dateGroups[$dateKey]['fixtures'][] = $f;
    }

    // Only show fixtures of only the last five days for pages showing fixtures grouped on dates
    if (count($dateGroups) > 5) {
        $dateGroups = array_slice($dateGroups, 0, 5, true);
        $allowedDates = array_keys($dateGroups);
        $fixturesList = array_values(array_filter($fixturesList, function($f) use ($allowedDates) {
            $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
            $dateKey = !empty($ko) ? substr($ko, 0, 10) : 'unknown';
            return in_array($dateKey, $allowedDates, true);
        }));
    }
}
?>
<section id="predictions" class="space-y-4 text-left">
  
  <!-- 1. CHEERPLEX MATCH HUB HEADER -->
  <div class="p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
        <?= renderIcon('trending-up', 'w-5 h-5 text-white') ?>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase font-display m-0">
            <?= e($listTitle) ?>
          </h2>
        </div>
        <p class="text-xs text-slate-500 font-medium mt-0.5 m-0">
          <?= e($listSubtitle) ?>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <span class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 border border-[var(--border)] text-slate-800">
        <?= count($fixturesList) ?> Verified Picks
      </span>
    </div>
  </div>

  <!-- 2. FIXTURES CARDS STREAM -->
  <div class="space-y-4">
    <?php if (empty($fixturesList)): ?>
      <div class="p-8 md:p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex flex-col items-center justify-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <?= renderIcon('calendar', 'w-6 h-6 text-slate-400 shrink-0') ?>
        </div>
        <div class="max-w-md space-y-1">
          <h3 class="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider m-0">
            No Fixtures Scheduled
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0">
            There are currently no active predictions available for this category. Please check back shortly or explore our jackpot and VIP selections.
          </p>
        </div>
      </div>
    <?php elseif ($groupByDate && !empty($dateGroups)): ?>
      <?php foreach ($dateGroups as $group): ?>
        <div class="space-y-3" id="date-group-section-<?= $group['dateKey'] ?>">
          <!-- Date Group Header Divider -->
          <div 
            id="date-group-<?= $group['dateKey'] ?>"
            class="px-4 py-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs select-none"
          >
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                <?= renderIcon('calendar', 'w-3.5 h-3.5 text-white') ?>
              </div>
              <div class="flex flex-wrap items-center gap-2 min-w-0">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <?= e($group['badgeText']) ?>
                </span>
                <span class="text-xs sm:text-sm font-bold text-white tracking-tight">
                  <?= e($group['label']) ?>
                </span>
                <?php if (!empty($group['subLabel']) && $group['subLabel'] !== $group['label']): ?>
                  <span class="hidden sm:inline-block text-[11px] font-medium text-slate-400">
                    • <?= e($group['subLabel']) ?>
                  </span>
                <?php endif; ?>
              </div>
            </div>

            <div class="shrink-0 flex items-center">
              <span class="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                <?= count($group['fixtures']) ?> <?= count($group['fixtures']) === 1 ? 'Match' : 'Matches' ?>
              </span>
            </div>
          </div>

          <!-- Cards for this Date -->
          <div class="space-y-3">
            <?php foreach ($group['fixtures'] as $idx => $fix): ?>
              <?php 
                $fixture = $fix;
                $index = $idx;
                include __DIR__ . '/fixture_row.php';
              ?>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <div class="space-y-3">
        <?php foreach ($fixturesList as $idx => $fix): ?>
          <?php 
            $fixture = $fix;
            $index = $idx;
            include __DIR__ . '/fixture_row.php';
          ?>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

</section>
