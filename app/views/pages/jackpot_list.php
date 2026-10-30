<?php
/**
 * Cheerplex - Jackpots Listing Page View
 * Exact 1:1 Parity with React JackpotListPage.tsx
 */

$allJackpots = getAllJackpots();
$mdData = loadMarkdownPage('jackpot-list');
$editorialHtml = $mdData['html'] ?? '';
$frontmatter = $mdData['frontmatter'] ?? [];

function getBrandMeta(string $id): array {
    $id = strtolower($id);
    if (strpos($id, 'sportpesa') !== false) {
        return [
            'brand'       => 'SportPesa',
            'badge'       => 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
            'accentColor' => 'text-blue-600 dark:text-blue-400'
        ];
    }
    if (strpos($id, 'betika') !== false) {
        return [
            'brand'       => 'Betika',
            'badge'       => 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
            'accentColor' => 'text-emerald-600 dark:text-emerald-400'
        ];
    }
    if (strpos($id, 'mozzart') !== false) {
        return [
            'brand'       => 'Mozzart',
            'badge'       => 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
            'accentColor' => 'text-amber-600 dark:text-amber-400'
        ];
    }
    return [
        'brand'       => 'Kenyan Pool',
        'badge'       => 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
        'accentColor' => 'text-blue-600 dark:text-blue-400'
    ];
}
?>
<div class="space-y-6 text-left">
  
  <!-- Top Breadcrumbs - Hidden on Mobile -->
  <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
    <a href="/" class="hover:text-blue-600 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
      <?= renderIcon('home', 'w-3.5 h-3.5') ?>
      <span>Home</span>
    </a>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-900 dark:text-slate-100 font-bold" aria-current="page">
      Jackpot Command Hub
    </span>
  </nav>

  <!-- 1. HERO COMMAND HUB BANNER -->
  <div class="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 text-left">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-3 max-w-2xl text-left">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <?= renderIcon('trophy', 'w-3.5 h-3.5 text-blue-600 dark:text-blue-400') ?> Top 5 Kenyan Jackpots
          </span>
          <span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Live Prize Pools Over KES 600M
          </span>
        </div>

        <h1 class="text-xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-display m-0">
          <?= e($frontmatter['displayTitle'] ?? 'Cheerplex Verified Kenyan Jackpot Predictions') ?>
        </h1>
        <?php if (!empty($frontmatter['introParagraph'])): ?>
          <div class="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            <?= formatInlineMarkdown($frontmatter['introParagraph']) ?>
          </div>
        <?php else: ?>
          <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal m-0">
            <?= e($frontmatter['description'] ?? 'Mathematically optimized combinations and double-chance safety locks designed by sports quantitative models. We provide coverage for SportPesa Mega (17), SportPesa Midweek (13), Betika Midweek (15), Mozzart Grand (20), and Mozzart Super Daily (16).') ?>
          </p>
        <?php endif; ?>
      </div>

      <!-- Quick Metrics Bento Box -->
      <div class="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 font-mono text-left">
        <div>
          <span class="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Bonus Strike Rate</span>
          <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">84.2%</div>
        </div>
        <div>
          <span class="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Avg Permutations</span>
          <div class="text-lg font-black text-blue-600 dark:text-blue-400">3-4 Doubles</div>
        </div>
        <div>
          <span class="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 block">M-Pesa STK</span>
          <div class="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Instant SMS</div>
        </div>
        <div>
          <span class="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Active Pools</span>
          <div class="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1"><?= count($allJackpots) ?> Pools Ready</div>
        </div>
      </div>
    </div>

    <!-- Brand Filter Buttons -->
    <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-left">
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold">
        <button
          type="button"
          onclick="filterJackpotBrand('all', this)"
          class="jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none"
          data-brand="all"
        >
          All Bookmakers
        </button>
        <button
          type="button"
          onclick="filterJackpotBrand('sportpesa', this)"
          class="jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-none bg-transparent"
          data-brand="sportpesa"
        >
          SportPesa
        </button>
        <button
          type="button"
          onclick="filterJackpotBrand('betika', this)"
          class="jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-none bg-transparent"
          data-brand="betika"
        >
          Betika
        </button>
        <button
          type="button"
          onclick="filterJackpotBrand('mozzart', this)"
          class="jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-none bg-transparent"
          data-brand="mozzart"
        >
          Mozzart
        </button>
      </div>

      <div class="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <?= renderIcon('chevron-right', 'w-3.5 h-3.5 text-blue-500') ?>
        <span id="brandPoolCount">Showing <?= count($allJackpots) ?> Pools</span>
      </div>
    </div>
  </div>

  <!-- 2. POOLS LIST SECTION HEADER -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200 dark:border-slate-800 text-left">
    <div>
      <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-display tracking-tight m-0">
        <?= e($frontmatter['listTitle'] ?? "Active Kenyan Bookmaker Jackpot Pools") ?>
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">
        <?= e($frontmatter['listSubtitle'] ?? "Calibrated 1X2 win probabilities, double-chance safety locks, and live kickoff schedules.") ?>
      </p>
    </div>
  </div>

  <!-- 3. BENTO JACKPOT CARDS GRID -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left" id="jackpotCardsGrid">
    <?php foreach ($allJackpots as $jackpot): 
      $jId = $jackpot['id'] ?? $jackpot['slug'] ?? 'sportpesa-mega';
      $jDetails = getJackpotDetails($jId) ?? $jackpot;
      $fixtures = $jDetails['fixtures'] ?? [];
      $brandMeta = getBrandMeta($jId);
      $timing = getJackpotTiming($jId, $fixtures);
      $url = getPageUrl($jId);
      $submissionsFill = $jackpot['submissions_fill'] ?? $jackpot['submissionsFill'] ?? '94%';
      $price = (int)($jackpot['price'] ?? 1);
      $firstMatch = $fixtures[0] ?? null;
      $lastMatch = !empty($fixtures) ? $fixtures[count($fixtures) - 1] : null;
    ?>
      <div 
        class="jp-list-card flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/80 transition-all duration-300 shadow-md hover:shadow-xl text-left relative group"
        data-jid="<?= e($jId) ?>"
      >
        <div class="space-y-4">
          <!-- Top Row: Operator Badge, Country, Games, Price -->
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md font-mono text-[9px] font-black tracking-wider border <?= $brandMeta['badge'] ?>">
                <?= $brandMeta['brand'] ?>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9.5px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <?= $jackpot['games_count'] ?? $jackpot['gamesCount'] ?? count($fixtures) ?> Matches
              </span>
              <span class="px-2 py-0.5 rounded-md text-[9px] font-mono font-black tracking-wider <?= $timing['statusBadge']['badgeClass'] ?>">
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
              <span class="text-[10px] font-mono font-bold uppercase text-slate-400">
                Estimated Jackpot Pool:
              </span>
              <span class="text-lg font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                <?= e($jackpot['estimated_pool'] ?? $jackpot['estimatedPool'] ?? 'KES 385,400,000') ?>
              </span>
            </div>
          </div>

          <!-- Live Countdown & Kickoff Schedule Box -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-xs">
            <div class="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1.5 font-bold">
                <?= renderIcon('clock', 'w-3.5 h-3.5 ' . ($timing['hasStarted'] ? 'text-amber-500' : ($timing['hasEnded'] ? 'text-slate-400' : 'text-blue-500'))) ?>
                <span><?= $timing['hasStarted'] ? 'Matches In Progress:' : ($timing['hasEnded'] ? 'Pool Concluded:' : 'Kickoff Closes In:') ?></span>
              </span>
              <?php 
                $jackpotId = $jId;
                $digitsOnly = true;
                include __DIR__ . '/../components/jackpot_countdown_timer.php';
                $digitsOnly = false;
              ?>
            </div>

            <!-- Schedule Window -->
            <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span class="text-[10px] uppercase text-slate-400">First Match:</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">
                    <?= e($timing['formattedEarliest']) ?>
                  </span>
                  <?php 
                    $fFix = $timing['firstFixture'] ?? $firstMatch;
                    if ($fFix): 
                  ?>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[220px]">
                      #<?= $fFix['position'] ?? 1 ?> <?= e(($fFix['homeTeam'] ?? '') . ' vs ' . ($fFix['awayTeam'] ?? '')) ?>
                    </span>
                  <?php endif; ?>
                </div>
              </div>

              <div class="flex items-start justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                  <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span class="text-[10px] uppercase text-slate-400">Final Leg:</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    <?= e($timing['formattedLatest']) ?>
                  </span>
                  <?php 
                    $lFix = $timing['lastFixture'] ?? $lastMatch;
                    if ($lFix): 
                  ?>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[220px]">
                      #<?= $lFix['position'] ?? count($fixtures) ?> <?= e(($lFix['homeTeam'] ?? '') . ' vs ' . ($lFix['awayTeam'] ?? '')) ?>
                    </span>
                  <?php endif; ?>
                </div>
              </div>
            </div>

            <!-- Allocation Fill Bar -->
            <div class="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div class="flex items-center justify-between text-[10px] text-slate-400">
                <span class="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
                  <?= renderIcon('flame', 'w-3 h-3 text-amber-500') ?> Syndicate Submissions Fill
                </span>
                <span class="font-bold text-amber-600 dark:text-amber-400"><?= e($submissionsFill) ?></span>
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
    <?php endforeach; ?>
  </div>

  <!-- 4. STRATEGY MARKDOWN ARTICLE -->
  <?php if (!empty($editorialHtml)): ?>
    <article class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-4">
      <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
          ✦
        </div>
        <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight font-display m-0">
          <?= e($frontmatter['displayTitle'] ?? 'Kenyan Jackpot Strategy & Mathematical Permutations') ?>
        </h2>
      </div>

      <div class="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
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
function filterJackpotBrand(brand, btn) {
  const cards = document.querySelectorAll('.jp-list-card');
  let visible = 0;
  cards.forEach(c => {
    const jid = c.getAttribute('data-jid') || '';
    if (brand === 'all' || jid.includes(brand)) {
      c.style.display = '';
      visible++;
    } else {
      c.style.display = 'none';
    }
  });

  document.querySelectorAll('.jp-brand-btn').forEach(b => {
    b.className = 'jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-none bg-transparent';
  });
  btn.className = 'jp-brand-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-blue-600 text-white shadow-xs border-none';

  const countEl = document.getElementById('brandPoolCount');
  if (countEl) {
    countEl.textContent = `Showing ${visible} Pools`;
  }
}
</script>
