<?php
/**
 * Cheerplex - Kenyan Jackpot Intelligence & Mathematical Master Slip View
 * Exact 1:1 Parity with React JackpotPage.tsx
 */

$jackpotId = $jackpotId ?? $pageId ?? 'sportpesa-mega';
$jackpot = getJackpotDetails($jackpotId);

if (!$jackpot) {
    echo "<div class='p-8 text-center text-red-600 font-bold font-mono'>Jackpot not found.</div>";
    return;
}

$fixtures = $jackpot['fixtures'] ?? [];
$price = (int)($jackpot['price'] ?? 1);
$pool = $jackpot['estimated_pool'] ?? $jackpot['estimatedPool'] ?? 'KES 385,400,000';
$entry = $jackpot['entry_fee'] ?? $jackpot['entryFee'] ?? 'KES 99';
$gamesCount = (int)($jackpot['games_count'] ?? $jackpot['gamesCount'] ?? count($fixtures));
$isUnlocked = isItemUnlocked($jackpotId);

// Compute Timing
$timing = getJackpotTiming($jackpotId, $fixtures);
$hasStarted = $timing['hasStarted'];
$hasEnded = $timing['hasEnded'];

// Markdown loader
$mdKeyMap = [
    'sportpesa-mega'        => 'sportpesa-mega',
    'sportpesa-midweek'     => 'sportpesa-midweek',
    'betika-midweek'        => 'betika-midweek',
    'mozzart-grand'         => 'mozzart-grand',
    'mozzart-super-daily'   => 'mozzart-super-daily',
];
$mdKey = $mdKeyMap[$jackpotId] ?? $jackpotId;
$mdData = loadMarkdownPage($mdKey, $jackpotId);
$editorialHtml = $mdData['html'] ?? '';
$frontmatter = $mdData['frontmatter'] ?? [];
$faqItems = $mdData['faqItems'] ?? [];
$faqTitle = $mdData['faqTitle'] ?? '';
$author = $mdData['author'] ?? null;
$notice = $mdData['responsibleGambling'] ?? null;

// Calculate Double Chance and 1X2 distribution
$doubleChanceCount = 0;
$highConfCount = 0;
$hWins = 0; $draws = 0; $aWins = 0;
foreach ($fixtures as $f) {
    $pred = strtolower(trim($f['prediction'] ?? ''));
    $conf = (int)($f['confidence'] ?? 80);
    if ($conf >= 80) $highConfCount++;

    $isDc = (strpos($pred, '1x') !== false || strpos($pred, 'x2') !== false || strpos($pred, '12') !== false || strpos($pred, 'double') !== false);
    if ($isDc) $doubleChanceCount++;

    if (strpos($pred, '1x') !== false || strpos($pred, 'x1') !== false) {
        $hWins++; $draws++;
    } elseif (strpos($pred, 'x2') !== false || strpos($pred, '2x') !== false) {
        $draws++; $aWins++;
    } elseif (strpos($pred, '12') !== false || strpos($pred, '21') !== false) {
        $hWins++; $aWins++;
    } elseif (strpos($pred, '1') !== false || strpos($pred, 'home') !== false) {
        $hWins++;
    } elseif (strpos($pred, 'x') !== false || strpos($pred, 'draw') !== false) {
        $draws++;
    } elseif (strpos($pred, '2') !== false || strpos($pred, 'away') !== false) {
        $aWins++;
    }
}
$freeCutoff = (int)round(($gamesCount * 2) / 3);
?>
<div class="space-y-6 text-left">
  
  <!-- Top Breadcrumb and Back Navigation - Hidden on Mobile -->
  <div class="hidden sm:flex flex-wrap items-center justify-between gap-3 text-xs">
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono overflow-x-auto scrollbar-none py-1">
      <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
        <?= renderIcon('home', 'w-3.5 h-3.5') ?>
        <span>Cheerplex Home</span>
      </a>
      <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0') ?>
      <a href="cheerplex-jackpots-predictions-and-tips" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline cursor-pointer font-semibold text-slate-600 dark:text-slate-400">
        Kenyan Jackpot Command Hub
      </a>
      <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0') ?>
      <span class="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[200px] md:max-w-[320px]" aria-current="page">
        <?= e($jackpot['name']) ?>
      </span>
    </nav>

    <a 
      href="cheerplex-jackpots-predictions-and-tips"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer no-underline"
    >
      <?= renderIcon('arrow-left', 'w-3.5 h-3.5') ?>
      <span>Back to All Jackpots</span>
    </a>
  </div>

  <!-- 1. OVERHAULED JACKPOT COMMAND COCKPIT -->
  <div class="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 md:p-8 shadow-md space-y-6 text-left">
    <!-- Subtle Ambient Radial Glow -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <!-- 1.1 TOP TELEMETRY STATUS BAR -->
    <div class="flex flex-wrap items-center justify-between gap-2.5 relative z-10">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-blue-600 text-white shadow-2xs">
          <?= renderIcon('sparkles', 'w-3 h-3 text-amber-300') ?>
          <?= e($jackpot['id']) ?>
        </span> 
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <?= renderIcon('trophy', 'w-3 h-3 text-amber-500') ?>
          <?= $gamesCount ?> Matches
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider <?= $timing['statusBadge']['badgeClass'] ?>">
          <?= $timing['statusBadge']['badgeText'] ?>
        </span>
      </div>

      <div class="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          <?= renderIcon('shield-check', 'w-3.5 h-3.5 text-emerald-600') ?> Instant M-Pesa STK Push
        </span>
      </div>
    </div>

    <!-- 1.2 MAIN TITLE & ALGORITHMIC SUBTITLE -->
    <div class="space-y-2 relative z-10">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-display leading-[1.1] m-0">
        <?= e($frontmatter['displayTitle'] ?? $frontmatter['title'] ?? ($jackpot['name'] . ' Mathematical Predictions')) ?>
      </h1>
      <?php if (!empty($frontmatter['introParagraph'])): ?>
        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-normal">
          <?= formatInlineMarkdown($frontmatter['introParagraph']) ?>
        </div>
      <?php else: ?>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-sans m-0">
          Algorithmically optimized coupon with calibrated 1X2 probabilities, score variance distributions, and multi-tier bonus safety parameters for all <?= $gamesCount ?> matches.
        </p>
      <?php endif; ?>
    </div>

    <!-- 1.3 4-METRIC TELEMETRY HUD -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 relative z-10 pt-1 text-left">
      <!-- METRIC 1: ESTIMATED CASH POOL -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div class="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
          <span>Cash Pool</span>
          <?= renderIcon('trophy', 'w-3.5 h-3.5 text-amber-500') ?>
        </div>
        <p class="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-tight mt-1 truncate m-0">
          <?= e($pool) ?>
        </p>
        <span class="text-[10px] font-mono text-slate-500 block mt-0.5">Grand Prize Target</span>
      </div>

      <!-- METRIC 2: OFFICIAL BOOKIE ENTRY -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div class="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
          <span>Bookie Entry</span>
          <?= renderIcon('zap', 'w-3.5 h-3.5 text-blue-500') ?>
        </div>
        <p class="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight mt-1 m-0">
          <?= e($entry) ?>
        </p>
        <span class="text-[10px] font-mono text-slate-500 block mt-0.5">Standard Stake</span>
      </div>

      <!-- METRIC 3: FIRST KICKOFF -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div class="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
          <span>First Kickoff</span>
          <?= renderIcon('clock', 'w-3.5 h-3.5 text-emerald-500') ?>
        </div>
        <p class="text-xs sm:text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 truncate m-0">
          <?= e($timing['formattedEarliest']) ?>
        </p>
        <?php if (!empty($timing['firstFixture'])): ?>
          <span class="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
            #<?= $timing['firstFixture']['position'] ?? 1 ?> <?= e($timing['firstFixture']['homeTeam'] ?? '') ?>
          </span>
        <?php else: ?>
          <span class="text-[10px] font-mono text-slate-500 block mt-0.5">Opening Match</span>
        <?php endif; ?>
      </div>

      <!-- METRIC 4: FINAL DECIDER -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div class="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
          <span>Final Leg</span>
          <?= renderIcon('trending-up', 'w-3.5 h-3.5 text-purple-500') ?>
        </div>
        <p class="text-xs sm:text-sm font-black font-mono text-slate-800 dark:text-slate-200 tracking-tight mt-1 truncate m-0">
          <?= e($timing['formattedLatest']) ?>
        </p>
        <?php if (!empty($timing['lastFixture'])): ?>
          <span class="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
            #<?= $timing['lastFixture']['position'] ?? count($fixtures) ?> <?= e($timing['lastFixture']['homeTeam'] ?? '') ?>
          </span>
        <?php else: ?>
          <span class="text-[10px] font-mono text-slate-500 block mt-0.5">Closing Decider</span>
        <?php endif; ?>
      </div>
    </div>

    <!-- 1.4 INTEGRATED M-PESA STK SLIP ACTIVATION ENGINE -->
    <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-transparent border border-blue-300 dark:border-blue-800 relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div class="space-y-1.5 min-w-0 text-left">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-mono font-black tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded">
            Instant Access
          </span>
          <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            Unlock All <?= $gamesCount ?> Fixture Predictions & Double Chance Slips
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-sans m-0">
          Subscribe to get instant access to full 1X2 selections, banker probability rankings, and low-variance double-chance covers for <?= e($jackpot['name']) ?>.
        </p>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
          <span class="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <?= renderIcon('check-circle-2', 'w-3.5 h-3.5 text-emerald-500 shrink-0') ?> 100% Calibrated Slips
          </span>
          <span class="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <?= renderIcon('check-circle-2', 'w-3.5 h-3.5 text-emerald-500 shrink-0') ?> Sub-Combo Bonuses
          </span>
          <span class="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <?= renderIcon('check-circle-2', 'w-3.5 h-3.5 text-emerald-500 shrink-0') ?> SMS Confirmation
          </span>
        </div>
      </div>

      <div class="flex flex-row md:flex-col sm:items-end justify-between items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
        <div class="text-left md:text-right font-mono">
          <span class="text-[10px] text-slate-400 font-bold block">Ticket Price</span>
          <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 block leading-none mt-0.5">
            KES <?= $price ?>
          </span>
        </div>
        <button 
          type="button"
          onclick="openPaymentModal(<?= htmlspecialchars(json_encode($jackpot['name'] . ' Full Slip')) ?>, <?= $price ?>, <?= htmlspecialchars(json_encode($jackpotId)) ?>, 'jackpot')"
          class="min-h-[46px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none active:scale-[0.98]"
        >
          <?= renderIcon('zap', 'w-4 h-4 text-amber-300') ?>
          <span>Get Full Slip • KES <?= $price ?></span>
        </button>
      </div>
    </div>

  </div>

  <!-- 2. HIGH-TECH HUD JACKPOT COUNTDOWN TIMER COMPONENT -->
  <?php include __DIR__ . '/../components/jackpot_countdown_timer.php'; ?>

  <!-- 3. SLIP SUMMARY QUICK STATS PANEL -->
  <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-left">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
        <?= renderIcon('check-circle-2', 'w-4 h-4 text-emerald-600 dark:text-emerald-400') ?>
      </div>
      <div>
        <h4 class="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight font-display m-0">
          Mathematical Coupon Overview
        </h4>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium m-0">
          Optimized balanced ratio for maximum payout coverage.
        </p>
      </div>
    </div>

    <div class="flex gap-2 text-[10px] font-mono font-bold">
      <span class="px-2.5 py-1.5 bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-slate-950 dark:text-slate-100 rounded-lg">
        <?= $hWins ?> Home Wins
      </span>
      <span class="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-slate-950 dark:text-slate-100 rounded-lg">
        <?= $draws ?> Draws
      </span>
      <span class="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-slate-950 dark:text-slate-100 rounded-lg">
        <?= $aWins ?> Away Wins
      </span>
    </div>
  </div>

  <!-- 4. CHEERPLEX JACKPOT MASTER SLIP MATRIX -->
  <div class="space-y-4 text-left">
    <!-- Section Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-display tracking-tight m-0">
          <?= e($frontmatter['listTitle'] ?? ($jackpot['name'] . ' Fixtures & Selections')) ?>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">
          <?= e($frontmatter['listSubtitle'] ?? ("Complete " . count($fixtures) . "-match coupon analysis with calibrated 1X2 win probabilities and double-chance hedges.")) ?>
        </p>
      </div>
    </div>

    <!-- Filter Tag Header Bar: All Games vs Double Chance -->
    <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onclick="filterJackpotFixtures('all', this)"
          class="jp-filter-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none"
          data-filter="all"
        >
          All Matches (<?= count($fixtures) ?>)
        </button>

        <button
          type="button"
          onclick="filterJackpotFixtures('dc', this)"
          class="jp-filter-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50"
          data-filter="dc"
        >
          <span>⚡ Double Chance</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">
            <?= $doubleChanceCount ?>
          </span>
        </button>
      </div>

      <span class="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold" id="jpMatchCount">
        Showing <?= count($fixtures) ?> of <?= count($fixtures) ?> Matches
      </span>
    </div>

    <!-- List of Modular Slip Cards -->
    <div class="space-y-3.5" id="jackpotFixturesList">
      <?php if (empty($fixtures)): ?>
        <div class="p-8 md:p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-3 font-mono">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <?= renderIcon('calendar', 'w-6 h-6 text-slate-400 shrink-0') ?>
          </div>
          <div class="max-w-md space-y-1">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider m-0">
              No Jackpot Fixtures Available
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed m-0 font-sans">
              There are currently no active fixtures listed for this jackpot pool. Please check back shortly or explore our other daily and weekend jackpots.
            </p>
          </div>
        </div>
      <?php else: ?>
      <?php 
        $jpPreloadIds = [];
        foreach ($fixtures as $idx => $m) {
          $mPos = (int)($m['fixtureNumber'] ?? ($idx + 1));
          $jpPreloadIds[] = "jackpot_{$jackpotId}_{$mPos}";
        }
        if (!empty($jpPreloadIds)) {
          getBatchFixtureVoteStats($jpPreloadIds);
        }
      ?>
      <?php foreach ($fixtures as $idx => $match): 
        $pos = (int)($match['fixtureNumber'] ?? ($idx + 1));
        $mHome = $match['homeTeam'] ?? 'Home Team';
        $mAway = $match['awayTeam'] ?? 'Away Team';
        $mPred = $match['prediction'] ?? 'Home Win (1)';
        $mConf = (int)($match['confidence'] ?? 80);
        $mLeague = $match['leagueName'] ?? 'League';
        $mCountry = $match['countryName'] ?? 'International';
        $mFlag = $match['countryFlag'] ?? '';
        $mStatus = $match['status'] ?? 'NS';
        $mKo = formatTimeEAT($match['kickoffTime'] ?? null);
        $mAnalysis = $match['aiAnalysis'] ?? 'Statistical models indicate strong goal probability and tactical advantage for the selected outcome.';
        $isVipLocked = ($pos > $freeCutoff && !$isUnlocked);
        
        $pLower = strtolower($mPred);
        $isDcMatch = (strpos($pLower, '1x') !== false || strpos($pLower, 'x2') !== false || strpos($pLower, '12') !== false || strpos($pLower, 'double') !== false);
        $jpFixtureId = $match['fixtureId'] ?? "jackpot_{$jackpotId}_{$pos}";
        
        // Probability estimations
        $hp = min(80, max(20, (int)round($mConf * 0.6)));
        $dp = min(35, max(15, (int)round((100 - $hp) * 0.55)));
        $ap = max(10, 100 - $hp - $dp);
      ?>
        <div 
          class="jp-fixture-card rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-xs transition-all duration-200 overflow-hidden text-left bg-white dark:bg-slate-900"
          data-dc="<?= $isDcMatch ? 'true' : 'false' ?>"
          data-conf="<?= $mConf ?>"
          data-query="<?= strtolower(e($mHome . ' ' . $mAway . ' ' . $mLeague . ' ' . $mCountry)) ?>"
          data-fid="<?= e($jpFixtureId) ?>"
        >
          <!-- Top Header Strip -->
          <div class="px-3.5 sm:px-4 py-2 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2 min-w-0">
              <div class="px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold shrink-0 <?= !$isVipLocked ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' ?>">
                #<?= $pos ?>
              </div>
              
              <div class="flex items-center gap-1.5 truncate min-w-0">
                <?= renderFlagImage($mCountry, $mFlag) ?>
                <span class="font-bold text-slate-800 dark:text-slate-200 truncate"><?= e($mLeague) ?></span>
                <span class="text-slate-400 text-[10px] hidden sm:inline">•</span>
                <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate hidden sm:inline"><?= e($mCountry) ?></span>
              </div>
            </div>

            <!-- Kickoff & Status -->
            <div class="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
              <div class="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-[10.5px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                <?= renderIcon('clock', 'w-3 h-3 text-blue-600 shrink-0') ?>
                <span><?= e($mKo) ?></span>
              </div>

              <?php if ($mStatus === 'LIVE' || $mStatus === 'HT' || $mStatus === '1H' || $mStatus === '2H'): ?>
                <span class="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 whitespace-nowrap">
                  <span class="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span> <?= e($mStatus) ?>
                </span>
              <?php elseif ($mStatus === 'FT' || $mStatus === 'AET' || $mStatus === 'AP'): ?>
                <span class="px-2 py-0.5 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-full text-[10px] inline-flex items-center gap-1 whitespace-nowrap">
                  <span>FT</span>
                  <?= renderIcon('check', 'w-3 h-3 text-emerald-400') ?>
                </span>
              <?php else: ?>
                <span class="hidden xs:inline-flex px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold rounded-full text-[10px] items-center gap-1 whitespace-nowrap">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>Open</span>
                </span>
              <?php endif; ?>
            </div>
          </div>

          <!-- Match Arena (Home Team vs Horizontal Scoreboard vs Away Team) -->
          <?php
            $rawHScore = $match['homeScore'] ?? $match['fullTimeHome'] ?? $match['full_time_home'] ?? null;
            $rawAScore = $match['awayScore'] ?? $match['fullTimeAway'] ?? $match['full_time_away'] ?? null;
            $hasValidScore = (is_numeric($rawHScore) && is_numeric($rawAScore)) || in_array($mStatus, ['FT', 'LIVE', 'HT', '1H', '2H', 'AET', 'AP'], true);
            $hScoreDisplay = is_numeric($rawHScore) ? $rawHScore : '0';
            $aScoreDisplay = is_numeric($rawAScore) ? $rawAScore : '0';
          ?>
          <div class="p-3 sm:p-4 space-y-2.5">
            <div class="flex flex-row items-center justify-between gap-1.5 sm:gap-4 w-full">
              <!-- Home Team -->
              <div class="flex-1 min-w-0 text-left">
                <h3 class="text-xs sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate leading-tight m-0" title="<?= e($mHome) ?>">
                  <?= e($mHome) ?>
                </h3>
                <span class="text-[9px] sm:text-[9.5px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wide">Home</span>
              </div>

              <!-- Strictly Horizontal Score / VS Center Capsule on Mobile & Desktop -->
              <div class="shrink-0 flex items-center justify-center px-1 sm:px-2">
                <?php if ($hasValidScore): ?>
                  <div class="inline-flex flex-row items-center justify-center px-2 sm:px-3 py-1 rounded-xl bg-slate-950 text-white font-mono font-black text-xs sm:text-base tracking-wider shadow-2xs border border-slate-700 tabular-nums whitespace-nowrap shrink-0">
                    <span class="text-white tabular-nums"><?= e((string)$hScoreDisplay) ?></span>
                    <span class="mx-1 sm:mx-1.5 text-amber-400 font-extrabold">:</span>
                    <span class="text-white tabular-nums"><?= e((string)$aScoreDisplay) ?></span>
                  </div>
                <?php else: ?>
                  <div class="inline-flex flex-row items-center justify-center px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono font-black text-[11px] sm:text-xs uppercase border border-slate-200 dark:border-slate-700 tracking-wider whitespace-nowrap shrink-0">
                    VS
                  </div>
                <?php endif; ?>
              </div>

              <!-- Away Team -->
              <div class="flex-1 min-w-0 text-right">
                <h3 class="text-xs sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate leading-tight m-0" title="<?= e($mAway) ?>">
                  <?= e($mAway) ?>
                </h3>
                <span class="text-[9px] sm:text-[9.5px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wide">Away</span>
              </div>
            </div>

            <!-- Algorithmic Slip Action Bar -->
            <?php if (!$isVipLocked): ?>
              <div class="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div class="flex flex-row items-center justify-between gap-1.5 text-xs">
                  <!-- Pick Pill -->
                  <div class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-[11px] sm:text-xs font-bold shadow-2xs shrink-0 whitespace-nowrap">
                    <?= renderIcon('zap', 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0') ?>
                    <span>Pick:</span>
                    <span class="tracking-wide uppercase font-black"><?= e($mPred) ?></span>
                  </div>

                  <!-- Confidence with % value -->
                  <div class="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-mono shrink-0 whitespace-nowrap">
                    <span class="text-slate-400 uppercase text-[9.5px] sm:text-[10px] hidden xs:inline">Confidence:</span>
                    <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs tabular-nums">
                      <?= $mConf ?>%
                    </span>
                  </div>
                </div>

                <!-- Probability gauge -->
                <div class="space-y-0.5 pt-0.5">
                  <div class="flex justify-between items-center text-[9.5px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>1: <?= $hp ?>%</span>
                    <span>X: <?= $dp ?>%</span>
                    <span>2: <?= $ap ?>%</span>
                  </div>
                  <div class="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div class="h-full bg-blue-600" style="width: <?= $hp ?>%"></div>
                    <div class="h-full bg-indigo-600" style="width: <?= $dp ?>%"></div>
                    <div class="h-full bg-amber-500" style="width: <?= $ap ?>%"></div>
                  </div>
                </div>
              </div>
            <?php else: ?>
              <!-- Locked VIP Banker Card -->
              <div class="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <?= renderIcon('lock', 'w-4 h-4') ?>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">
                      VIP Banker Pick Reserved
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans m-0">
                      Unlock match <?= $pos ?> mathematical prediction and safety double-chance hedge.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onclick="openPaymentModal(<?= htmlspecialchars(json_encode($jackpot['name'] . ' Full Slip')) ?>, <?= $price ?>, <?= htmlspecialchars(json_encode($jackpotId)) ?>, 'jackpot')"
                    class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border-none"
                  >
                    <?= renderIcon('lock', 'w-3.5 h-3.5') ?>
                    <span>Unlock Slip • KES <?= $price ?></span>
                  </button>
                </div>
              </div>
            <?php endif; ?>
          </div>

          <!-- VOTING POLL FOR EVERY JACKPOT FIXTURE -->
          <div class="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
            <div class="hidden md:block px-5 py-3.5">
              <?php 
                $fixture = [
                    'id' => $jpFixtureId,
                    'homeTeam' => $mHome,
                    'awayTeam' => $mAway,
                    'prediction' => $mPred,
                    'confidence' => $mConf,
                    'status' => $mStatus,
                    'result' => $match['result'] ?? null
                ];
                $voteVariant = 'desktop-row';
                include __DIR__ . '/../components/vote_poll.php';
              ?>
            </div>
            <div class="md:hidden px-3.5 py-2.5">
              <?php 
                $voteVariant = 'mobile';
                include __DIR__ . '/../components/vote_poll.php';
              ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
      <?php endif; ?>
    </div>

  </div>

  <!-- 5. STRATEGY MARKDOWN ARTICLE -->
  <?php if (!empty($editorialHtml)): ?>
    <article class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-4">
      <div class="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            ✦
          </div>
          <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            Combinatorial Permutation Strategy
          </span>
        </div>
        <h2 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-display m-0 pt-1">
          <?= e($frontmatter['sectionTitle'] ?? $frontmatter['analysisTitle'] ?? 'Cheerplex Jackpot Combinatorics & Modeling') ?>
        </h2>
        <?php if (!empty($frontmatter['sectionDescription']) || !empty($frontmatter['analysisDescription'])): ?>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans m-0 pt-0.5">
            <?= e($frontmatter['sectionDescription'] ?? $frontmatter['analysisDescription']) ?>
          </p>
        <?php endif; ?>
      </div>

      <div class="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        <?= $editorialHtml ?>
      </div>
    </article>
  <?php endif; ?>

  <!-- 6. INBOUND KEYWORD DIRECTORY LINKS -->
  <?php include __DIR__ . '/../components/inbound_links.php'; ?>

  <!-- 7. VERIFIED AUTHOR PROFILE -->
  <?php include __DIR__ . '/../components/author_card.php'; ?>

  <!-- 8. FAQS -->
  <?php include __DIR__ . '/../components/faq_section.php'; ?>

  <!-- 9. RESPONSIBLE GAMBLING NOTICE -->
  <?php include __DIR__ . '/../components/responsible_gambling_notice.php'; ?>

</div>

<script>
let currentJpFilter = 'all';
let currentJpQuery = '';

function filterJackpotFixtures(filter, btn) {
  currentJpFilter = filter;
  document.querySelectorAll('.jp-filter-btn').forEach(b => {
    b.className = 'jp-filter-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700';
  });
  btn.className = 'jp-filter-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none';
  applyJpFilters();
}

function searchJackpotFixtures(q) {
  currentJpQuery = q.toLowerCase().trim();
  applyJpFilters();
}

function applyJpFilters() {
  const cards = document.querySelectorAll('.jp-fixture-card');
  let visible = 0;
  cards.forEach(card => {
    let show = true;
    if (currentJpFilter === 'dc' && card.getAttribute('data-dc') !== 'true') {
      show = false;
    }
    if (currentJpFilter === 'high') {
      const conf = parseInt(card.getAttribute('data-conf') || '0', 10);
      if (conf < 80) show = false;
    }
    if (currentJpQuery) {
      const q = card.getAttribute('data-query') || '';
      if (!q.includes(currentJpQuery)) show = false;
    }

    if (show) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });
}

function copyJackpotCoupon(btn) {
  const cards = document.querySelectorAll('.jp-fixture-card');
  const lines = ['🔥 CHEERPLEX <?= strtoupper(addslashes($jackpot['name'])) ?> MASTER SLIP'];
  cards.forEach(card => {
    if (card.style.display !== 'none') {
      const text = card.innerText.replace(/\n+/g, ' ').trim();
      if (text) lines.push(text);
    }
  });
  if (lines.length > 1) {
    navigator.clipboard.writeText(lines.join('\n'));
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<span>Copied!</span>';
    setTimeout(() => { btn.innerHTML = oldHtml; }, 2000);
  }
}
</script>
