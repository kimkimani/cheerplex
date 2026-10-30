<?php
/**
 * Cheerplex - High-Tech HUD Jackpot Matchday Countdown Timer Component
 * Matches React JackpotCountdownTimer.tsx exactly
 */

$jId = $jackpotId ?? 'sportpesa-mega';
$jConfig = getJackpotDetails($jId);
$jFixtures = $fixtures ?? ($jConfig['fixtures'] ?? []);

$timing = getJackpotTiming($jId, $jFixtures);
$startsText = $timing['startsText'];
$earliestTime = $timing['earliestTime'];
$latestTime = $timing['latestTime'];
$hasStarted = $timing['hasStarted'];
$hasEnded = $timing['hasEnded'];
$digitsOnly = $digitsOnly ?? false;
$className = $className ?? '';

// Accurate Target timestamp & Status calculation
$nowTs = time();
$conclusionTs = $latestTime ? ($latestTime + (2 * 3600)) : ($earliestTime ? ($earliestTime + 100800) : null);

if ($conclusionTs && $nowTs >= $conclusionTs) {
    $hasEnded = true;
    $hasStarted = false;
    $status = 'ended';
    $targetTs = 0;
    $diff = 0;
} elseif ($earliestTime && $nowTs >= $earliestTime) {
    $hasEnded = false;
    $hasStarted = true;
    $status = 'started';
    $targetTs = ($latestTime && $nowTs < $latestTime) ? $latestTime : $conclusionTs;
    $diff = max(0, $targetTs - $nowTs);
} else {
    $hasEnded = false;
    $hasStarted = false;
    $status = 'upcoming';
    $targetTs = $earliestTime ?: 0;
    $diff = max(0, $targetTs - $nowTs);
}

$days = $hasEnded ? 0 : floor($diff / 86400);
$hours = $hasEnded ? 0 : floor(($diff % 86400) / 3600);
$minutes = $hasEnded ? 0 : floor(($diff % 3600) / 60);
$seconds = $hasEnded ? 0 : ($diff % 60);

$submissionsFill = $jConfig['submissionsFill'] ?? '94%';
$premiumCount = $jConfig['premiumCount'] ?? '12,450';
$gamesCount = $jConfig['gamesCount'] ?? count($jFixtures);

if ($digitsOnly):
    if ($hasEnded): ?>
        <div 
          class="jackpot-digits-timer inline-flex items-center gap-1.5 font-mono select-none <?= e($className) ?>"
          data-earliest-ts="<?= (int)$earliestTime ?>"
          data-latest-ts="<?= (int)$latestTime ?>"
          data-conclusion-ts="<?= (int)$conclusionTs ?>"
          data-status="ended"
        >
          <span class="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold border border-slate-700 flex items-center gap-1">
            <?= renderIcon('check-circle-2', 'w-3 h-3 text-slate-400') ?>
            COMPLETED
          </span>
        </div>
    <?php elseif ($hasStarted): ?>
        <div 
          class="jackpot-digits-timer inline-flex items-center gap-1.5 font-mono select-none <?= e($className) ?>"
          data-earliest-ts="<?= (int)$earliestTime ?>"
          data-latest-ts="<?= (int)$latestTime ?>"
          data-conclusion-ts="<?= (int)$conclusionTs ?>"
          data-status="started"
        >
          <span class="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            LIVE
          </span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-amber-500/60 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner timer-digits-hours">
              <?= sprintf('%02d', $hours + ($days * 24)) ?>
            </div>
            <span class="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">H</span>
          </div>
          <span class="text-amber-400 font-black text-xs -mt-2.5">:</span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-amber-500/60 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner timer-digits-minutes">
              <?= sprintf('%02d', $minutes) ?>
            </div>
            <span class="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">M</span>
          </div>
          <span class="text-amber-400 font-black text-xs -mt-2.5">:</span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-amber-500 rounded-lg text-xs sm:text-sm font-black text-amber-300 shadow-inner animate-pulse timer-digits-seconds">
              <?= sprintf('%02d', $seconds) ?>
            </div>
            <span class="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">S</span>
          </div>
        </div>
    <?php else: ?>
        <div 
          class="jackpot-digits-timer inline-flex items-center gap-1.5 font-mono select-none <?= e($className) ?>"
          data-earliest-ts="<?= (int)$earliestTime ?>"
          data-latest-ts="<?= (int)$latestTime ?>"
          data-conclusion-ts="<?= (int)$conclusionTs ?>"
          data-status="upcoming"
        >
          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner timer-digits-days">
              <?= sprintf('%02d', $days) ?>
            </div>
            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">D</span>
          </div>
          <span class="text-blue-400 font-black text-xs -mt-2.5">:</span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner timer-digits-hours">
              <?= sprintf('%02d', $hours) ?>
            </div>
            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">H</span>
          </div>
          <span class="text-blue-400 font-black text-xs -mt-2.5">:</span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-black text-white shadow-inner timer-digits-minutes">
              <?= sprintf('%02d', $minutes) ?>
            </div>
            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">M</span>
          </div>
          <span class="text-blue-400 font-black text-xs -mt-2.5">:</span>

          <div class="flex flex-col items-center">
            <div class="px-2 py-1 bg-slate-900 border border-blue-500 rounded-lg text-xs sm:text-sm font-black text-blue-400 shadow-inner animate-pulse timer-digits-seconds">
              <?= sprintf('%02d', $seconds) ?>
            </div>
            <span class="text-[8px] font-bold text-blue-400 uppercase tracking-tighter mt-0.5">S</span>
          </div>
        </div>
    <?php endif;
    return;
endif;
?>
<div 
  class="jackpot-hud-timer rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl p-4 sm:p-5 relative overflow-hidden space-y-4 <?= e($className) ?>"
  data-earliest-ts="<?= (int)$earliestTime ?>"
  data-latest-ts="<?= (int)$latestTime ?>"
  data-conclusion-ts="<?= (int)$conclusionTs ?>"
  data-target-ts="<?= (int)$targetTs ?>"
  data-has-started="<?= $hasStarted ? 'true' : 'false' ?>"
  data-has-ended="<?= $hasEnded ? 'true' : 'false' ?>"
  data-status="<?= e($status) ?>"
>
  <!-- Background cyber grid pattern -->
  <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

  <!-- 1. TOP TELEMETRY STATUS BAR -->
  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 relative z-10">
    <div class="flex items-center gap-2 text-[10.5px] font-mono">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 <?= $hasEnded ? 'bg-slate-500' : ($hasStarted ? 'bg-amber-400' : 'bg-blue-400') ?>"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 <?= $hasEnded ? 'bg-slate-500' : ($hasStarted ? 'bg-amber-500' : 'bg-blue-500') ?>"></span>
      </span>
      <span class="text-slate-300 font-bold uppercase tracking-wider">
        <?php if ($hasEnded): ?>
          POOL CLOSED • SETTLED & VERIFIED
        <?php elseif ($hasStarted): ?>
          MATCHES IN PROGRESS • LIVE TRACKING
        <?php else: ?>
          ANALYTICAL FEED ACTIVE • POOL OPEN
        <?php endif; ?>
      </span>
      <span class="text-slate-700 hidden sm:inline">•</span>
      <span class="text-slate-400 hidden sm:inline">KENYA EAT (UTC+3)</span>
    </div>

    <div class="flex items-center gap-1.5">
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border <?= $hasEnded ? 'bg-slate-800 text-slate-300 border-slate-700' : ($hasStarted ? 'bg-amber-950/80 text-amber-300 border-amber-800/60 animate-pulse' : 'bg-blue-950/80 text-blue-300 border-blue-800/60') ?>">
        <?= renderIcon('sparkles', 'w-2.5 h-2.5') ?>
        <?= $hasEnded ? 'COMPLETED' : ($hasStarted ? 'LIVE IN PROGRESS' : 'ENTRY OPEN') ?>
      </span>
    </div>
  </div>

  <!-- 2. MAIN COUNTDOWN CLOCK & KICKOFF META -->
  <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative z-10">
    <!-- Left Kickoff Description -->
    <div class="space-y-1.5 text-left flex-1 min-w-0">
      <div class="flex items-center gap-2 text-xs font-mono font-semibold <?= $hasStarted ? 'text-amber-400' : ($hasEnded ? 'text-slate-400' : 'text-blue-400') ?>">
        <?= renderIcon('clock', 'w-3.5 h-3.5 shrink-0') ?>
        <span class="uppercase tracking-wider">
          <?= $hasEnded ? 'Official Matchday Record (Settled)' : ($hasStarted ? 'Official Matchday In Progress' : 'Official Matchday Kickoff') ?>
        </span>
      </div>
      <div class="text-sm sm:text-base font-bold text-white tracking-tight font-display break-words">
        <?= e($startsText) ?>
      </div>
      <div class="text-[11px] text-slate-400 leading-relaxed font-sans">
        <?php if ($hasEnded): ?>
          All <?= $gamesCount ?> matches completed. First match started <?= e($timing['formattedEarliest']) ?> and final game concluded <?= e($timing['formattedLatest']) ?>.
        <?php elseif ($hasStarted): ?>
          Matches underway. First match started <?= e($timing['formattedEarliest']) ?> • Final decider kicks off at <?= e($timing['formattedLatest']) ?>.
        <?php else: ?>
          Algorithmic combinations lock 10 minutes prior to first whistle (<?= e($timing['formattedEarliest']) ?>). Final match: <?= e($timing['formattedLatest']) ?>.
        <?php endif; ?>
      </div>
    </div>

    <!-- Center/Right LED Split Countdown Cells -->
    <div class="flex flex-col items-center gap-1.5 self-center lg:self-auto shrink-0 py-1">
      <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
        <?= $hasEnded ? 'Jackpot Concluded' : ($hasStarted ? 'Final Match Kicks Off In:' : 'Kickoff Closes In:') ?>
      </div>

      <div class="flex items-center justify-center gap-2 sm:gap-2.5 font-mono select-none" id="led-timer-<?= e($jId) ?>">
        <!-- Days Cell -->
        <div class="flex flex-col items-center">
          <div class="w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border <?= $hasEnded ? 'border-slate-800 text-slate-500' : ($hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white') ?> rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden timer-days">
            <div class="absolute inset-x-0 top-1/2 h-px bg-slate-800/80"></div>
            <span class="relative z-10"><?= sprintf('%02d', $days) ?></span>
          </div>
          <span class="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Days</span>
        </div>

        <span class="text-slate-600 font-black text-lg sm:text-xl -mt-5">:</span>

        <!-- Hours Cell -->
        <div class="flex flex-col items-center">
          <div class="w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border <?= $hasEnded ? 'border-slate-800 text-slate-500' : ($hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white') ?> rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden timer-hours">
            <div class="absolute inset-x-0 top-1/2 h-px bg-slate-800/80"></div>
            <span class="relative z-10"><?= sprintf('%02d', $hours) ?></span>
          </div>
          <span class="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Hours</span>
        </div>

        <span class="text-slate-600 font-black text-lg sm:text-xl -mt-5">:</span>

        <!-- Mins Cell -->
        <div class="flex flex-col items-center">
          <div class="w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border <?= $hasEnded ? 'border-slate-800 text-slate-500' : ($hasStarted ? 'border-amber-700/60 text-amber-200' : 'border-slate-700/70 text-white') ?> rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden timer-minutes">
            <div class="absolute inset-x-0 top-1/2 h-px bg-slate-800/80"></div>
            <span class="relative z-10"><?= sprintf('%02d', $minutes) ?></span>
          </div>
          <span class="text-[9px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Mins</span>
        </div>

        <span class="font-black text-lg sm:text-xl -mt-5 <?= $hasStarted ? 'text-amber-500' : ($hasEnded ? 'text-slate-700' : 'text-blue-500') ?>">:</span>

        <!-- Secs Cell -->
        <div class="flex flex-col items-center">
          <div class="w-13 sm:w-15 h-13 sm:h-15 bg-gradient-to-b from-slate-900 to-slate-950 border-2 rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-lg relative overflow-hidden <?= $hasEnded ? 'border-slate-800 text-slate-500 shadow-none' : ($hasStarted ? 'border-amber-500 text-amber-300 shadow-amber-950/40 animate-pulse' : 'border-blue-500/80 text-blue-400 shadow-blue-950/40') ?> timer-seconds">
            <div class="absolute inset-x-0 top-1/2 h-px bg-blue-900/60"></div>
            <span class="relative z-10"><?= sprintf('%02d', $seconds) ?></span>
          </div>
          <span class="text-[9px] font-mono font-bold mt-1.5 uppercase tracking-wider <?= $hasStarted ? 'text-amber-400' : ($hasEnded ? 'text-slate-500' : 'text-blue-400') ?>">Secs</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. ACTIVE SLIP LOGS -->
  <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
    <div class="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
      <?= renderIcon('users', 'w-3.5 h-3.5 text-blue-400 shrink-0') ?>
      <span>Verified Combinations Active</span>
    </div>

    <div class="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
      <span class="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700">
        <?= e($premiumCount) ?> High-Probability Slips In Circulation
      </span>
    </div>
  </div>
</div>

