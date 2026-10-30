<?php
/**
 * Cheerplex - Category Predictions Page View
 * Matches React CategoryPredictionsPage.tsx exactly
 * @var string $categoryId
 */

$meta = getMetadata($categoryId);
$fixtures = getFixturesByCategory($categoryId);
$isYesterday = ($categoryId === 'category-yesterday' || $categoryId === 'cheerplex-yesterday-prediction' || normalizeCategorySlug($categoryId) === 'category-yesterday');

// Category tactical definitions
$tacticalProfiles = [
    'category-today' => [
        'oddsRange' => '1.50 – 2.30',
        'accuracy'  => '85.4%',
        'risk'      => 'Algorithmic Selection',
        'metric'    => 'Comprehensive Statistical Rating',
        'desc'      => "Daily verified football predictions, high-confidence single bankers, and accumulator slips audited across 20+ top European and African leagues."
    ],
    'category-tomorrow' => [
        'oddsRange' => '1.60 – 2.50',
        'accuracy'  => '86.0% Projected',
        'risk'      => 'Early Market Edge',
        'metric'    => 'Early Line Value',
        'desc'      => "Early statistical predictions computed 24 to 48 hours in advance before market volume depresses bookmaker odds."
    ],
    'category-yesterday' => [
        'oddsRange' => '1.50 – 2.80',
        'accuracy'  => 'Verified Ledger',
        'risk'      => 'Audited Historical',
        'metric'    => 'Settled Results Ledger',
        'desc'      => "Transparent post-match verification database recording all winning and lost selections to continuously recalibrate model weights."
    ],
    'category-homewin' => [
        'oddsRange' => '1.65 – 2.45',
        'accuracy'  => '84.8%',
        'risk'      => 'Balanced Value',
        'metric'    => 'Home / Away Supremacy Index',
        'desc'      => "Evaluates mathematical goal expectancy distribution for Home Win (1), Draw (X), and Away Win (2) alongside home/away goal scoring differentials."
    ],
    'category-btts' => [
        'oddsRange' => '1.60 – 2.15',
        'accuracy'  => '82.5%',
        'risk'      => 'Medium Variance',
        'metric'    => 'Dual Offensive Threat Ratio',
        'desc'      => "Filters fixtures where both clubs average ≥ 1.35 goals scored per match and clean sheet probability is below 22%."
    ],
    'category-over15' => [
        'oddsRange' => '1.22 – 1.48',
        'accuracy'  => '89.4%',
        'risk'      => 'Ultra-Low Risk Banker',
        'metric'    => 'Over 1.5 Goal Frequency Index',
        'desc'      => "High-probability accumulator foundations requiring 2 or more total goals. Ideal for multi-bet bankroll compounding."
    ],
    'category-over25' => [
        'oddsRange' => '1.75 – 2.50',
        'accuracy'  => '81.0%',
        'risk'      => 'High Value',
        'metric'    => 'Combined xG Expectancy > 2.75',
        'desc'      => "Pinpoints high-tempo matchups where combined expected goals (xG) exceed 2.75 with aggressive transition tactics."
    ],
    'category-doublechance' => [
        'oddsRange' => '1.25 – 1.60',
        'accuracy'  => '88.7%',
        'risk'      => 'Conservative Banker',
        'metric'    => 'Draw Variance Cushion',
        'desc'      => "Protective dual-outcome coverage (1X, X2, 12) mitigating draw risk in tight, closely contested derby matchups."
    ],
];

$profile = $tacticalProfiles[$categoryId] ?? $tacticalProfiles['category-today'];
$title = $meta['displayTitle'] ?? $meta['title'] ?? 'Football Predictions';

// Markdown loader
$mdKeyMap = [
    'category-today'        => 'cheerplex-today-prediction',
    'category-tomorrow'     => 'cheerplex-tomorrow-prediction',
    'category-yesterday'    => 'cheerplex-yesterday-prediction',
    'category-homewin'      => 'cheerplex-1x2-prediction-tips',
    'category-btts'         => 'cheerplex-gg-prediction-tips',
    'category-over15'       => 'cheerplex-sure-tips-and-odds',
    'category-over25'       => 'cheerplex-free-predictions-and-tips',
    'category-doublechance' => 'cheerplex-free-predictions-and-tips',
];
$mdKey = $pageKey ?? ($mdKeyMap[$categoryId] ?? $categoryId);
$mdData = loadMarkdownPage($mdKey);
$editorialHtml = $mdData['html'] ?? '';
$frontmatter = $mdData['frontmatter'] ?? [];
$faqItems = $mdData['faqItems'] ?? [];
$faqTitle = $mdData['faqTitle'] ?? '';
$author = $mdData['author'] ?? null;
$notice = $mdData['responsibleGambling'] ?? null;

// Deduplicate & sort fixtures: latest date first, earliest kickoff within date
$dedupedFixtures = [];
$seenIds = [];
foreach ($fixtures as $idx => $f) {
    $fId = (string)($f['id'] ?? $f['fixtureRef'] ?? (($f['homeTeam'] ?? '') . '-' . ($f['awayTeam'] ?? '')));
    if (!isset($seenIds[$fId])) {
        $seenIds[$fId] = true;
        $f['result'] = evaluateFixtureResult($f);
        $dedupedFixtures[] = $f;
    }
}

usort($dedupedFixtures, function($a, $b) {
    $dateA = substr($a['kickoffTime'] ?? $a['date'] ?? '', 0, 10);
    $dateB = substr($b['kickoffTime'] ?? $b['date'] ?? '', 0, 10);
    if ($dateA !== $dateB) {
        return strcmp($dateB, $dateA); // Latest date first
    }
    return strcmp($a['kickoffTime'] ?? $a['date'] ?? '', $b['kickoffTime'] ?? $b['date'] ?? '');
});

// For yesterday page: strictly isolate matches belonging to calendar yesterday in Africa/Nairobi timezone
$tzNairobi = new DateTimeZone('Africa/Nairobi');
$nowNairobi = new DateTime('now', $tzNairobi);
$yesterdayObj = clone $nowNairobi;
$yesterdayObj->modify('-1 day');
$yesterdayDateKey = $yesterdayObj->format('Y-m-d');
$yesterdayDateLabel = $yesterdayObj->format('l, j F Y');

if ($isYesterday) {
    $dedupedFixtures = array_values(array_filter($dedupedFixtures, function($f) use ($yesterdayDateKey, $tzNairobi) {
        $raw = $f['kickoffTime'] ?? $f['date'] ?? '';
        if (empty($raw)) return false;
        try {
            $dt = new DateTime($raw);
            $dt->setTimezone($tzNairobi);
            return $dt->format('Y-m-d') === $yesterdayDateKey;
        } catch (\Throwable $e) {
            return substr($raw, 0, 10) === $yesterdayDateKey;
        }
    }));
}

// Calculate Yesterday Settled Win Ratio strictly based on that date's won, lost, and all matches that were there
$wonCount = 0;
$lostCount = 0;
if ($isYesterday) {
    foreach ($dedupedFixtures as &$f) {
        $res = evaluateFixtureResult($f);
        if ($res === 'won') {
            $f['result'] = 'won';
            $wonCount++;
        } else {
            $f['result'] = 'lost';
            $lostCount++;
        }
    }
    unset($f);
    $totalEvaluated = $wonCount + $lostCount;
    $winRate = $totalEvaluated > 0 ? round(($wonCount / $totalEvaluated) * 100, 1) : 0;
    $lossRate = $totalEvaluated > 0 ? round(100 - $winRate, 1) : 0;
} else {
    $totalEvaluated = count($dedupedFixtures);
    foreach ($dedupedFixtures as $f) {
        if (($f['result'] ?? '') === 'won') {
            $wonCount++;
        } else {
            $lostCount++;
        }
    }
    $winRate = $totalEvaluated > 0 ? round(($wonCount / $totalEvaluated) * 100, 1) : 0;
    $lossRate = $totalEvaluated > 0 ? round(100 - $winRate, 1) : 0;
}

// Group fixtures strictly by date starting from the latest
$dateGroups = [];
foreach ($dedupedFixtures as $f) {
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
if (!$isYesterday && count($dateGroups) > 5) {
    $dateGroups = array_slice($dateGroups, 0, 5, true);
    $allowedDates = array_keys($dateGroups);
    $dedupedFixtures = array_values(array_filter($dedupedFixtures, function($f) use ($allowedDates) {
        $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
        $dateKey = !empty($ko) ? substr($ko, 0, 10) : 'unknown';
        return in_array($dateKey, $allowedDates, true);
    }));
}

// Compute Market Counts
$counts = [
    'all'           => count($dedupedFixtures),
    'wins'          => 0,
    'over_under'    => 0,
    'btts'          => 0,
    'double_chance' => 0,
    'draws'         => 0,
];

foreach ($dedupedFixtures as $f) {
    $p = strtolower(trim($f['prediction'] ?? ''));
    $isDc = (strpos($p, '1x') !== false || strpos($p, 'x2') !== false || strpos($p, '12') !== false || strpos($p, 'double') !== false);
    if ($isDc) {
        $counts['double_chance']++;
    } elseif (strpos($p, 'gg') !== false || strpos($p, 'btts') !== false) {
        $counts['btts']++;
    } elseif (strpos($p, 'over') !== false || strpos($p, 'under') !== false || strpos($p, '2.5') !== false || strpos($p, '1.5') !== false) {
        $counts['over_under']++;
    } elseif ($p === 'x' || strpos($p, 'draw') !== false) {
        $counts['draws']++;
    } else {
        $counts['wins']++;
    }
}
?>
<div class="space-y-6 text-left">
  
  <!-- Breadcrumbs -->
  <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
    <a href="/" class="hover:text-blue-600 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600">
      <?= renderIcon('home', 'w-3.5 h-3.5') ?>
      <span>Home</span>
    </a>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-500">Football Predictions</span>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-900 font-bold truncate max-w-[280px]" aria-current="page">
      <?= e($title) ?>
    </span>
  </nav>

  <?php if ($isYesterday): ?>
    <!-- ========================================================================= -->
    <!-- YESTERDAY RESULTS & ACCURACY DASHBOARD BANNER                             -->
    <!-- ========================================================================= -->
    <section class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs text-left space-y-6 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-[4px] bg-blue-600"></div>
      <div class="relative z-10 space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black tracking-wider font-mono">
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Audited Historical Verification</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-display m-0">
              <?= e($frontmatter['displayTitle'] ?? $frontmatter['title'] ?? $title) ?>
            </h1>
            <?php if (!empty($frontmatter['introParagraph'])): ?>
              <div class="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
                <?= formatInlineMarkdown($frontmatter['introParagraph']) ?>
              </div>
            <?php else: ?>
              <p class="text-xs text-slate-500 max-w-2xl leading-relaxed font-normal m-0">
                Audited historical performance log with transparent win rates, settled scores, and mathematical recalibration.
              </p>
            <?php endif; ?>
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold border border-slate-800 tracking-wide">
                <?= renderIcon('calendar', 'w-3.5 h-3.5 text-blue-400 shrink-0') ?>
                <span><?= e($yesterdayDateLabel) ?></span>
              </span>
            </div>
          </div>

          <div class="flex flex-col items-start md:items-end gap-1 shrink-0 font-mono">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Settled Win Ratio</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-blue-600"><?= $winRate ?>%</span>
              <span class="text-xs font-bold text-blue-800">ACCURACY</span>
            </div>
            <span class="text-[9px] text-blue-900 font-bold font-mono bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              Statistical Recalibration Active
            </span>
          </div>
        </div>

        <!-- Quick Stats Bento Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-left">
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Total Evaluated Matches</span>
              <?= renderIcon('trending-up', 'w-4 h-4 text-blue-500') ?>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-slate-900"><?= $totalEvaluated ?></span>
              <span class="text-[10px] text-slate-500">Tips</span>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Settled Won Tips</span>
              <?= renderIcon('check-circle-2', 'w-4 h-4 text-emerald-600') ?>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-emerald-800"><?= $wonCount ?></span>
              <span class="text-[10px] text-emerald-700 font-bold">Matches Won</span>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.03]">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Settled Lost Tips</span>
              <?= renderIcon('x-circle', 'w-4 h-4 text-rose-500') ?>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-slate-900"><?= $lostCount ?></span>
              <span class="text-[10px] text-slate-500">Matches Lost</span>
            </div>
          </div>
        </div>

        <!-- Visual Accuracy Bar -->
        <div class="pt-2">
          <div class="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider mb-2">
            <span class="text-blue-600">Win Rate (<?= $winRate ?>%)</span>
            <span class="text-slate-400">Loss Variance (<?= $lossRate ?>%)</span>
          </div>
          <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div class="h-full bg-blue-600 transition-all duration-500" style="width: <?= $winRate ?>%"></div>
            <div class="h-full bg-slate-400 transition-all duration-500" style="width: <?= $lossRate ?>%"></div>
          </div>
        </div>
      </div>
    </section>

  <?php else: ?>
    <!-- ========================================================================= -->
    <!-- STANDARD CATEGORY COMMAND COCKPIT                                         -->
    <!-- ========================================================================= -->
    <section class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs text-left space-y-6">
      <!-- Status chips -->
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold uppercase tracking-wider">
            <?= renderIcon('sparkles', 'w-3 h-3 text-blue-600') ?>
            <span>Cheerplex Sports Lab • <?= e($meta['displayTitle'] ?? 'Category') ?></span>
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Matchday
          </span>
        </div>
        <span class="text-[11px] font-mono text-slate-500">
          Kenya EAT (UTC+3)
        </span>
      </div>

      <!-- Title & Description -->
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display m-0 leading-tight">
          <?= e($frontmatter['displayTitle'] ?? $frontmatter['title'] ?? $title) ?>
        </h1>
        <?php if (!empty($frontmatter['introParagraph'])): ?>
          <div class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-normal">
            <?= formatInlineMarkdown($frontmatter['introParagraph']) ?>
          </div>
        <?php else: ?>
          <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-sans m-0">
            <?= e($profile['desc']) ?>
          </p>
        <?php endif; ?>
      </div>

      <!-- Authoritative Quantitative Strategy Section (sectionTitle & sectionDescription) -->
      <?php if (!empty($frontmatter['sectionTitle'])): ?>
        <div class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-200/70 shadow-2xs text-left space-y-1">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-xs shadow-2xs">✦</span>
            <h2 class="text-xs sm:text-sm font-black text-slate-900 tracking-tight font-display m-0">
              <?= e($frontmatter['sectionTitle']) ?>
            </h2>
          </div>
          <?php if (!empty($frontmatter['sectionDescription'])): ?>
            <p class="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed font-sans m-0 pl-7">
              <?= e($frontmatter['sectionDescription']) ?>
            </p>
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <!-- Minimalistic Top 1 Game Accumulator / Banker of the Day (Strictly Today's highest confidence match only) -->
      <?php 
        $bankerVariant = 'minimal';
        $banker = getTopBanker();
        if ($banker) {
          include __DIR__ . '/../components/top_banker.php';
        }
      ?>
    </section>
  <?php endif; ?>

  <!-- ========================================================================= -->
  <!-- PREDICTION MARKET FILTER TABS & SEARCH CONTROLS                           -->
  <!-- ========================================================================= -->
  <div class="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-xs space-y-3 text-left">
    <?php if ($isYesterday): ?>
      <!-- Filter for Yesterday: Won / Lost / All -->
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button" 
            onclick="filterYesterdayResult('all', this)" 
            class="yst-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none"
          >
            All Results (<?= $totalEvaluated ?>)
          </button>
          <button 
            type="button" 
            onclick="filterYesterdayResult('won', this)" 
            class="yst-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-slate-100 text-slate-700 border border-[var(--border)]"
          >
            Settled Won Tips (<?= $wonCount ?>)
          </button>
          <button 
            type="button" 
            onclick="filterYesterdayResult('lost', this)" 
            class="yst-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-slate-100 text-slate-700 border border-[var(--border)]"
          >
            Settled Lost Tips (<?= $lostCount ?>)
          </button>
        </div>
        <span class="text-xs font-mono text-slate-500 font-bold" id="catMatchCount">
          Showing <?= $totalEvaluated ?> of <?= $totalEvaluated ?> Settled Matches
        </span>
      </div>

      <!-- Search & Confidence Filters Row for Yesterday -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div class="relative flex-1 max-w-md">
          <input 
            type="text" 
            id="catSearchInput" 
            oninput="searchCategoryFixtures(this.value)" 
            placeholder="Search teams, leagues, countries..." 
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-[var(--border)] text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
          />
          <div class="absolute left-3 top-2.5 text-slate-400">
            <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            id="confToggleBtn"
            onclick="toggleHighConfidence(this)"
            class="px-3 py-2 rounded-xl text-xs font-mono font-bold border border-[var(--border)] bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shrink-0"
          >
            Bankers Only (80%+)
          </button>
          <button
            type="button"
            onclick="copyCategoryCoupon(this)"
            class="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 border-none shrink-0"
          >
            <?= renderIcon('copy', 'w-3.5 h-3.5') ?>
            <span>Copy Ledger</span>
          </button>
        </div>
      </div>
    <?php else: ?>
      <!-- Market Tabs: All, Wins, Over/Under, BTTS, Double Chance, Draws -->
      <div class="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button type="button" onclick="filterMarketType('all', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-blue-600 text-white shadow-xs border-none cursor-pointer">
            All Matches (<?= $counts['all'] ?>)
          </button>
          <button type="button" onclick="filterMarketType('wins', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer">
            Wins (1X2) (<?= $counts['wins'] ?>)
          </button>
          <button type="button" onclick="filterMarketType('over_under', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer">
            Over / Under (<?= $counts['over_under'] ?>)
          </button>
          <button type="button" onclick="filterMarketType('btts', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer">
            BTTS / GG (<?= $counts['btts'] ?>)
          </button>
          <button type="button" onclick="filterMarketType('double_chance', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer">
            Double Chance (<?= $counts['double_chance'] ?>)
          </button>
          <button type="button" onclick="filterMarketType('draws', this)" class="mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer">
            Draws (X) (<?= $counts['draws'] ?>)
          </button>
        </div>
        <span class="text-xs font-mono text-slate-500 font-bold" id="catMatchCount">
          Showing <?= $counts['all'] ?> Matches
        </span>
      </div>

      <!-- Search & Confidence Filters Row -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div class="relative flex-1 max-w-md">
          <input 
            type="text" 
            id="catSearchInput" 
            oninput="searchCategoryFixtures(this.value)" 
            placeholder="Search teams, leagues, countries..." 
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-[var(--border)] text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
          />
          <div class="absolute left-3 top-2.5 text-slate-400">
            <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            id="confToggleBtn"
            onclick="toggleHighConfidence(this)"
            class="px-3 py-2 rounded-xl text-xs font-mono font-bold border border-[var(--border)] bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shrink-0"
          >
            Bankers Only (80%+)
          </button>
          <button
            type="button"
            onclick="copyCategoryCoupon(this)"
            class="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 border-none shrink-0"
          >
            <?= renderIcon('copy', 'w-3.5 h-3.5') ?>
            <span>Copy Coupon</span>
          </button>
        </div>
      </div>
    <?php endif; ?>
  </div>

  <!-- ========================================================================= -->
  <!-- MATCH FIXTURES LIST STREAM (GROUPED BY DATES STARTING FROM THE LATEST)   -->
  <!-- ========================================================================= -->
  <div class="space-y-4 text-left" id="categoryFixturesStream">

      <!-- Section Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-display tracking-tight m-0">
          <?= e($frontmatter['listTitle'] ?? (' Fixtures & Selections')) ?>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">
          <?= e($frontmatter['listSubtitle'] ?? ("-match coupon analysis with calibrated 1X2 win probabilities and double-chance hedges.")) ?>
        </p>
      </div>
    </div>

    <?php if (empty($dedupedFixtures)): ?>
      <div id="catEmptyState" class="p-8 md:p-12 text-center rounded-2xl bg-white border border-[var(--border)] shadow-xs flex flex-col items-center justify-center space-y-3 font-mono">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <?= renderIcon('calendar', 'w-6 h-6 text-slate-400 shrink-0') ?>
        </div>
        <div class="max-w-md space-y-1">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
            <?= $isYesterday ? "No Match Results Recorded for Yesterday" : "No Fixtures Scheduled" ?>
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0 font-sans">
            <?= $isYesterday 
              ? "There are currently no recorded settled predictions for yesterday. Please check back shortly or explore today's and upcoming fixtures." 
              : "There are currently no active predictions available for this category. Please check back shortly or explore our jackpot and VIP selections." ?>
          </p>
        </div>
      </div>
    <?php else: ?>
      <!-- Filtered Empty State Notification (shown dynamically when query matches 0) -->
      <div id="catFilteredEmptyState" class="hidden p-8 md:p-12 text-center rounded-2xl bg-white border border-[var(--border)] shadow-xs flex flex-col items-center justify-center space-y-3 font-mono">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <?= renderIcon('alert-triangle', 'w-6 h-6 text-slate-400 shrink-0') ?>
        </div>
        <div class="max-w-md space-y-1">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
            No Fixtures Found Matching Criteria
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0 font-sans">
            No matches found for your active search or filter selection. Try switching prediction markets or resetting your filters.
          </p>
        </div>
      </div>

      <?php foreach ($dateGroups as $group): ?>
        <div class="date-group-section space-y-3" id="date-group-section-<?= e($group['dateKey']) ?>" data-date-key="<?= e($group['dateKey']) ?>">
          <!-- Date Group Header Divider -->
          <div 
            id="date-group-<?= e($group['dateKey']) ?>"
            class="date-group-header px-4 py-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs select-none"
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
              <span class="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full group-match-count">
                <?= count($group['fixtures']) ?> <?= count($group['fixtures']) === 1 ? 'Match' : 'Matches' ?>
              </span>
            </div>
          </div>

          <!-- Cards for this Date -->
          <div class="space-y-3">
            <?php foreach ($group['fixtures'] as $idx => $fix): 
              $fixture = $fix;
              $index = $idx;
              $pred = strtolower(trim($fix['prediction'] ?? ''));
              $isDcMatch = (strpos($pred, '1x') !== false || strpos($pred, 'x2') !== false || strpos($pred, '12') !== false || strpos($pred, 'double') !== false);
              $mType = 'wins';
              if ($isDcMatch) $mType = 'double_chance';
              elseif (strpos($pred, 'gg') !== false || strpos($pred, 'btts') !== false) $mType = 'btts';
              elseif (strpos($pred, 'over') !== false || strpos($pred, 'under') !== false || strpos($pred, '2.5') !== false || strpos($pred, '1.5') !== false) $mType = 'over_under';
              elseif ($pred === 'x' || strpos($pred, 'draw') !== false) $mType = 'draws';

              $isWon = (($fix['result'] ?? '') === 'won');
              $conf = (int)($fix['confidence'] ?? 75);
            ?>
              <div 
                class="cat-fixture-wrapper"
                data-mtype="<?= $mType ?>"
                data-result="<?= $isWon ? 'won' : 'lost' ?>"
                data-conf="<?= $conf ?>"
                data-query="<?= strtolower(e(($fix['homeTeam'] ?? '') . ' ' . ($fix['awayTeam'] ?? '') . ' ' . ($fix['leagueName'] ?? ''))) ?>"
              >
                <?php 
                  $currentCategory = $categoryId;
                  include __DIR__ . '/../components/fixture_row.php'; 
                ?>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>

  <!-- ========================================================================= -->
  <!-- EDITORIAL STRATEGY & MARKDOWN ARTICLE                                     -->
  <!-- ========================================================================= -->
  <?php if (!empty($editorialHtml)): ?>
    <article class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs text-left space-y-4">
      <!-- <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
          ✦
        </div>
        <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display m-0">
          <?= e($frontmatter['displayTitle'] ?? $frontmatter['title'] ?? 'Cheerplex Algorithmic Strategy') ?>
        </h2>
      </div> -->

      <div class="prose max-w-none text-xs text-slate-700 leading-relaxed font-sans">
        <?= $editorialHtml ?>
      </div>
    </article>
  <?php endif; ?>

  <!-- Inbound Keyword Directory Links -->
  <?php include __DIR__ . '/../components/inbound_links.php'; ?>

  <!-- Verified Editorial Author Profile -->
  <?php include __DIR__ . '/../components/author_card.php'; ?>

  <!-- FAQs -->
  <?php include __DIR__ . '/../components/faq_section.php'; ?>

  <!-- Responsible Gambling Notice -->
  <?php include __DIR__ . '/../components/responsible_gambling_notice.php'; ?>

</div>

<script>
let currentMkt = 'all';
let currentYst = 'all';
let currentConf = 'all';
let currentQuery = '';

function filterMarketType(type, btn) {
  currentMkt = type;
  document.querySelectorAll('.mkt-btn').forEach(b => {
    b.className = 'mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-[var(--border)] cursor-pointer';
  });
  btn.className = 'mkt-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-blue-600 text-white shadow-xs border-none cursor-pointer';
  applyCategoryFilters();
}

function filterYesterdayResult(res, btn) {
  currentYst = res;
  document.querySelectorAll('.yst-btn').forEach(b => {
    b.className = 'yst-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-slate-100 text-slate-700 border border-[var(--border)]';
  });
  btn.className = 'yst-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none';
  applyCategoryFilters();
}

function searchCategoryFixtures(q) {
  currentQuery = q.toLowerCase().trim();
  applyCategoryFilters();
}

function toggleHighConfidence(btn) {
  if (currentConf === 'all') {
    currentConf = 'high';
    btn.className = 'px-3 py-2 rounded-xl text-xs font-mono font-bold border border-blue-500 bg-blue-50 text-blue-700 shadow-2xs transition-all cursor-pointer shrink-0';
    btn.textContent = 'Showing Bankers (80%+)';
  } else {
    currentConf = 'all';
    btn.className = 'px-3 py-2 rounded-xl text-xs font-mono font-bold border border-[var(--border)] bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shrink-0';
    btn.textContent = 'Bankers Only (80%+)';
  }
  applyCategoryFilters();
}

function applyCategoryFilters() {
  const sections = document.querySelectorAll('.date-group-section');
  let totalVisible = 0;
  const allWrappers = document.querySelectorAll('.cat-fixture-wrapper');

  sections.forEach(sec => {
    const wrappers = sec.querySelectorAll('.cat-fixture-wrapper');
    let groupVisible = 0;

    wrappers.forEach(w => {
      let show = true;
      
      // Yesterday check
      <?php if ($isYesterday): ?>
        const res = w.getAttribute('data-result');
        if (currentYst === 'won' && res !== 'won') show = false;
        if (currentYst === 'lost' && res !== 'lost') show = false;
      <?php else: ?>
        // Market type check
        const mtype = w.getAttribute('data-mtype');
        if (currentMkt !== 'all' && mtype !== currentMkt) show = false;
      <?php endif; ?>

      // Confidence
      if (currentConf === 'high') {
        const c = parseInt(w.getAttribute('data-conf') || '0', 10);
        if (c < 80) show = false;
      }

      // Query
      if (currentQuery) {
        const txt = w.getAttribute('data-query') || '';
        if (!txt.includes(currentQuery)) show = false;
      }

      if (show) {
        w.style.display = '';
        groupVisible++;
      } else {
        w.style.display = 'none';
      }
    });

    if (groupVisible > 0) {
      sec.style.display = '';
      const badge = sec.querySelector('.group-match-count');
      if (badge) badge.textContent = `${groupVisible} ${groupVisible === 1 ? 'Match' : 'Matches'}`;
      totalVisible += groupVisible;
    } else {
      sec.style.display = 'none';
    }
  });

  const countEl = document.getElementById('catMatchCount');
  if (countEl) {
    countEl.textContent = `Showing ${totalVisible} of ${allWrappers.length} Matches`;
  }

  const emptyFilterEl = document.getElementById('catFilteredEmptyState');
  if (emptyFilterEl) {
    if (totalVisible === 0 && allWrappers.length > 0) {
      emptyFilterEl.classList.remove('hidden');
    } else {
      emptyFilterEl.classList.add('hidden');
    }
  }
}

function copyCategoryCoupon(btn) {
  const cards = document.querySelectorAll('.cat-fixture-wrapper');
  const lines = [];
  cards.forEach(c => {
    if (c.style.display !== 'none') {
      const text = c.innerText.replace(/\n+/g, ' ').trim();
      if (text) lines.push(text);
    }
  });
  if (lines.length > 0) {
    navigator.clipboard.writeText(lines.join('\n'));
    const oldText = btn.innerHTML;
    btn.innerHTML = '<span>Copied!</span>';
    setTimeout(() => { btn.innerHTML = oldText; }, 2000);
  }
}
</script>
