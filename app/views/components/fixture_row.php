<?php
/**
 * Cheerplex - Match Fixture Card Component
 * Matches React FixtureRow.tsx exactly
 */

$fid = $fixture['id'] ?? $fixture['fixtureRef'] ?? $index ?? 1;
$homeTeam = $fixture['homeTeam'] ?? 'Home Team';
$awayTeam = $fixture['awayTeam'] ?? 'Away Team';
$league = $fixture['leagueName'] ?? $fixture['league_name'] ?? 'League';
$country = resolveFixtureCountry($fixture);
$flag = $fixture['leagueFlag'] ?? $fixture['countryFlag'] ?? null;
$prediction = $fixture['prediction'] ?? 'Home Win (1)';
$confidence = (int)($fixture['confidence'] ?? 78);
$status = strtoupper($fixture['status'] ?? 'NS');
$isLive = ($status === 'LIVE' || $status === 'HT' || $status === '1H' || $status === '2H' || $status === 'IN PLAY');
$isCompleted = ($status === 'FT' || $status === 'AET' || $status === 'AP' || $status === 'PEN');
$homeScore = $fixture['homeScore'] ?? '-';
$awayScore = $fixture['awayScore'] ?? '-';
$result = $fixture['result'] ?? null;
$kickoffFormatted = formatTimeEAT($fixture['kickoffTime'] ?? $fixture['date'] ?? null);

$pLower = strtolower($prediction);
$isDc = (strpos($pLower, 'double chance') !== false || strpos($pLower, '1x') !== false || strpos($pLower, 'x2') !== false || strpos($pLower, '12') !== false || strpos($pLower, '2x') !== false);

// Estimated odds derived from confidence
$homeProb = $fixture['probabilities']['home'] ?? ($confidence > 60 ? $confidence : 48);
$awayProb = $fixture['probabilities']['away'] ?? max(15, 100 - (int)$homeProb - 25);
$homeOdds = number_format(max(1.18, round(100 / max(18, (int)$homeProb), 2)), 2);
$awayOdds = number_format(max(1.25, round(100 / max(15, (int)$awayProb), 2)), 2);

$aiAnalysis = $fixture['aiAnalysis'] ?? "Mathematical regression calculations indicate an asymmetrical expected goal distribution favoring the selected outcome. Key factors include attacking efficiency over the past 5 matches, defensive stability against high-press setups, and recent head-to-head consistency.";
?>
<article 
  class="fixture-card rounded-2xl border border-[var(--border)] hover:border-blue-400 hover:shadow-2xs transition-all duration-200 overflow-hidden text-left bg-[var(--card)]"
  data-fid="<?= $fid ?>"
  data-teams="<?= strtolower(e($homeTeam . ' ' . $awayTeam . ' ' . $league . ' ' . $country)) ?>"
>
  <!-- ========================================================================= -->
  <!-- 1. DESKTOP VIEW (hidden md:block): 3 DISTINCT CLEAN ROWS                  -->
  <!-- ========================================================================= -->
  <div class="hidden md:block">
    <!-- ROW 1: League & country info on the start, time & short status on the end -->
    <div class="px-4 py-2 bg-slate-50/90 border-b border-[var(--border)] flex items-center justify-between gap-3 text-xs">
      <!-- Start: League & Country Info -->
      <div class="flex items-center gap-2 min-w-0">
        <?= renderFlagImage($country, $flag) ?>
        <span class="font-bold text-slate-800 truncate">
          <?= e($league) ?>
        </span>
        <span class="text-slate-400 text-[10px]">•</span>
        <span class="text-[11px] font-medium text-slate-500 truncate">
          <?= e($country) ?>
        </span>
      </div>

      <!-- End: Time & Short Status -->
      <div class="flex items-center gap-2 font-mono text-[11px] shrink-0">
        <div class="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-[var(--border)]">
          <?= renderIcon('clock', 'w-3.5 h-3.5 text-blue-600 shrink-0') ?>
          <span><?= e($kickoffFormatted) ?></span>
        </div>

        <?php if ($isLive): ?>
          <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            <?= e($status) ?>
          </span>
        <?php elseif ($isCompleted): ?>
          <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold uppercase">
            FT
          </span>
        <?php else: ?>
          <span class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-500">
            Upcoming
          </span>
        <?php endif; ?>

        <?php if ($result === 'won'): ?>
          <span class="inline-flex items-center gap-1 text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md font-mono shadow-2xs">
            <?= renderIcon('check-circle-2', 'w-3.5 h-3.5 text-white shrink-0') ?>
          </span>
        <?php elseif ($result === 'lost'): ?>
          <span class="inline-flex items-center gap-1 text-[10px] bg-slate-600 text-white font-black px-2 py-0.5 rounded-md font-mono">
            <?= renderIcon('x-circle', 'w-3.5 h-3.5 text-white shrink-0') ?>
          </span>
        <?php endif; ?>
      </div>
    </div>

    <!-- ROW 2: Home Team @odds VS / Score @odds Away Team and Pick & Intel -->
    <div class="px-5 py-4 flex items-center justify-between gap-6">
      <!-- Match Arena (Home Team, @odds, VS / Score, @odds, Away Team) -->
      <div class="flex-1 flex items-center justify-between gap-3 min-w-0 max-w-2xl">
        <!-- Home Team -->
        <div class="flex-1 min-w-0 flex items-center justify-end gap-2.5 text-right">
          <span class="text-sm sm:text-base font-bold text-slate-900 truncate" title="<?= e($homeTeam) ?>">
            <?= e($homeTeam) ?>
          </span>
          <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0 shadow-2xs">
            @<?= $homeOdds ?>
          </span>
        </div>

        <!-- Score / VS Center -->
        <div class="shrink-0 px-2">
          <?php if (is_numeric($homeScore) && is_numeric($awayScore)): ?>
            <div class="inline-flex items-center justify-center px-3.5 py-1 rounded-xl bg-slate-950 text-white font-mono font-black text-sm sm:text-base tracking-wider border border-slate-700 shadow-xs tabular-nums whitespace-nowrap">
              <span class="text-white"><?= e($homeScore) ?></span>
              <span class="mx-1.5 text-amber-400 font-extrabold">:</span>
              <span class="text-white"><?= e($awayScore) ?></span>
            </div>
          <?php else: ?>
            <div class="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 font-mono font-black text-xs uppercase border border-[var(--border)] tracking-wider">
              VS
            </div>
          <?php endif; ?>
        </div>

        <!-- Away Team -->
        <div class="flex-1 min-w-0 flex items-center justify-start gap-2.5 text-left">
          <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0 shadow-2xs">
            @<?= $awayOdds ?>
          </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 truncate" title="<?= e($awayTeam) ?>">
            <?= e($awayTeam) ?>
          </span>
        </div>
      </div>

      <!-- Right: Cheerplex Pick & Confidence -->
      <div class="flex items-center gap-3 shrink-0 pl-5 border-l border-[var(--border)]">
        <div class="flex flex-col items-end">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-black shadow-xs">
            <?= renderIcon('zap', 'w-3.5 h-3.5 text-amber-300') ?>
            <span>PICK:</span>
            <span class="tracking-wide uppercase"><?= e($prediction) ?></span>
          </div>
          <div class="flex items-center gap-1 text-[11px] font-mono text-slate-500 mt-1">
            <?php if ($isDc): ?>
              <span class="text-[9.5px] font-bold text-blue-600 mr-1">DC</span>
            <?php endif; ?>
            <span>Confidence:</span>
            <span class="font-bold text-slate-900 tabular-nums"><?= $confidence ?>%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: Community Fan Consensus Poll -->
    <div class="px-5 py-3.5 bg-slate-50/70 border-t border-[var(--border)] rounded-b-2xl">
      <?php 
        $voteVariant = 'desktop-row';
        $currentCategory = $currentCategory ?? ($categoryId ?? null);
        include __DIR__ . '/vote_poll.php';
      ?>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 2. MOBILE VIEW (md:hidden): PRESERVED EXACTLY AS IS                       -->
  <!-- ========================================================================= -->
  <div class="md:hidden">
    <!-- 1. TOP METADATA STRIP -->
    <div class="px-3.5 sm:px-4 py-2 bg-slate-50/80 border-b border-[var(--border)] flex items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-2 min-w-0">
        <?= renderFlagImage($country, $flag) ?>
        <div class="flex items-center gap-1.5 truncate">
          <span class="font-bold text-slate-800 truncate"><?= e($league) ?></span>
          <span class="text-slate-400 text-[10px] hidden xs:inline">•</span>
          <span class="text-[11px] font-medium text-slate-500 truncate hidden xs:inline"><?= e($country) ?></span>
        </div>
      </div>

      <!-- Kickoff / Status Badges -->
      <div class="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10.5px] font-semibold text-slate-600">
          <?= renderIcon('clock', 'w-3 h-3 text-blue-600 shrink-0') ?>
          <span><?= e($kickoffFormatted) ?></span>
        </div>

        <?php if ($isLive): ?>
          <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            <?= e($status) ?>
          </span>
        <?php elseif ($isCompleted): ?>
          <span class="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9.5px] font-bold uppercase">
            FT
          </span>
        <?php endif; ?>

        <?php if ($result === 'won'): ?>
          <span class="inline-flex items-center gap-1 text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md font-mono shadow-2xs">
            <?= renderIcon('check-circle-2', 'w-3 h-3 text-white shrink-0') ?>
          </span>
        <?php elseif ($result === 'lost'): ?>
          <span class="inline-flex items-center gap-1 text-[10px] bg-slate-600 text-white font-black px-2 py-0.5 rounded-md font-mono">
            <?= renderIcon('x-circle', 'w-3 h-3 text-white shrink-0') ?>
          </span>
        <?php endif; ?>
      </div>
    </div>

    <!-- 2. MATCH ARENA (TEAMS + LIVE SCOREBOARD - HOLOOTAOL STYLE 2 : 2) -->
    <div class="p-3.5 sm:p-4 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <!-- HOME TEAM -->
        <div class="flex-1 min-w-0 text-left">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate leading-snug m-0">
            <?= e($homeTeam) ?>
          </h3>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-[9.5px] font-mono text-slate-600 uppercase font-semibold">Home</span>
            <span class="text-[10px] font-mono font-bold text-blue-600 tabular-nums">@<?= $homeOdds ?></span>
          </div>
        </div>

        <!-- SCOREBOARD / VS CENTER NODE -->
        <div class="shrink-0 flex items-center justify-center px-1">
          <?php if (is_numeric($homeScore) && is_numeric($awayScore)): ?>
            <div class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl bg-slate-950 text-white font-mono font-black text-sm sm:text-base tracking-wider shadow-2xs border border-slate-700 tabular-nums whitespace-nowrap">
              <span class="text-white"><?= e($homeScore) ?></span>
              <span class="mx-1 text-amber-400 font-extrabold">:</span>
              <span class="text-white"><?= e($awayScore) ?></span>
            </div>
          <?php else: ?>
            <div class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-mono font-black text-xs uppercase border border-[var(--border)] tracking-wider">
              VS
            </div>
          <?php endif; ?>
        </div>

        <!-- AWAY TEAM -->
        <div class="flex-1 min-w-0 text-right">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate leading-snug m-0">
            <?= e($awayTeam) ?>
          </h3>
          <div class="flex items-center justify-end gap-1.5 mt-0.5">
            <span class="text-[10px] font-mono font-bold text-blue-600 tabular-nums">@<?= $awayOdds ?></span>
            <span class="text-[9.5px] font-mono text-slate-600 uppercase font-semibold">Away</span>
          </div>
        </div>
      </div>

      <!-- 3. CHEERPLEX PREDICTION STRIP (SINGLE LINE: Pick | Confidence) -->
      <div class="flex items-center justify-between gap-1.5 pt-2 border-t border-[var(--border)] text-xs">
        <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-2xs shrink-0">
          <?= renderIcon('zap', 'w-3 h-3 text-amber-300') ?>
          <span>Pick:</span>
          <span class="tracking-wide uppercase font-black"><?= e($prediction) ?></span>
        </div>

        <div class="flex items-center gap-1 text-[11px] font-mono shrink-0">
          <span class="text-slate-600 uppercase text-[10px] font-semibold">Confidence:</span>
          <span class="font-bold text-slate-900 tabular-nums px-2 py-0.5 rounded-md bg-slate-100 border border-[var(--border)]">
            <?= $confidence ?>%
          </span>
        </div>
      </div>

      <!-- 4. ON-THE-GO VOTING BAR (Mobile 3-Tier Layout) -->
      <div class="pt-2 border-t border-[var(--border)]">
        <?php 
          $voteVariant = 'mobile';
          $currentCategory = $currentCategory ?? ($categoryId ?? null);
          include __DIR__ . '/vote_poll.php';
        ?>
      </div>
    </div>
  </div>
</article>
