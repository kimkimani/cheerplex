<?php
/**
 * Cheerplex - Home Page View
 * Replicated exactly from React App.tsx Home layout
 */

$todayFixtures = getFixturesByDate('today');
$fixtures = $todayFixtures;
$topBanker = getTopBanker();
$jackpots = getAllJackpots();
$oddsPacks = getOddsPacks();
$vipPackages = getVipPackages();

// Load home markdown
$homeMd = loadMarkdownPage('home');
$editorialHtml = $homeMd['html'] ?? '';
$frontmatter = $homeMd['frontmatter'] ?? [];
$faqItems = $homeMd['faqItems'] ?? [];
$faqTitle = $homeMd['faqTitle'] ?? '';
$author = $homeMd['author'] ?? null;
$notice = $homeMd['responsibleGambling'] ?? null;

$displayTitle = $frontmatter['displayTitle'] ?? $frontmatter['title'] ?? "Mathematical Football Predictions & Sure Daily Bankers";
$introText = $frontmatter['introParagraph'] ?? $frontmatter['description'] ?? "Access mathematically validated football predictions, high-confidence single bankers, and Kenyan jackpot combination codes audited by Cheerplex algorithms.";
?>
<div class="space-y-8 text-left">
  
  <!-- 1. HERO BANNER (12-COLUMN GRID) -->
  <section id="hero" class="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-white to-blue-50/20 shadow-xs relative overflow-hidden text-left p-5 sm:p-7 md:p-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      
      <!-- Left: Headline & Intro -->
      <div class="<?= $topBanker ? 'lg:col-span-7' : 'lg:col-span-12' ?> space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold tracking-wider">
          <?= renderIcon('sparkles', 'w-3.5 h-3.5 text-blue-600') ?>
          <span>Welcome to Cheerplex.</span>
        </div>

        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.15] text-slate-900 font-display m-0">
          <?= e($displayTitle) ?>
        </h1>

        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-normal">
          <p class="m-0 line-clamp-3 sm:line-clamp-none">
            <?= e($introText) ?>
          </p>
        </div>

        <!-- Top Quick Action Buttons: Only Today Tips and Mega JP -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="<?= getPageUrl('category-today') ?>"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer border-none no-underline"
          >
            <?= renderIcon('zap', 'w-4 h-4 text-amber-300') ?>
            <span>Today Tips</span>
          </a>
          <a
            href="<?= getPageUrl('sportpesa-mega') ?>"
            class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center gap-2 no-underline"
          >
            <?= renderIcon('trophy', 'w-4 h-4 text-slate-950') ?>
            <span>Mega JP</span>
          </a>
        </div>
      </div>

      <!-- Right: Featured Banker Spotlight Showcase Card (Strictly Today's Highest Confidence Match) -->
      <?php if ($topBanker): ?>
        <div class="lg:col-span-5">
          <?php 
            $banker = $topBanker;
            $bankerVariant = 'hero';
            include __DIR__ . '/../components/top_banker.php';
          ?>
        </div>
      <?php endif; ?>

    </div>
  </section>

  <!-- 2. AUTHORITATIVE QUANTITATIVE STRATEGY & PRIMARY FIXTURES -->
  <?php if (!empty($frontmatter['sectionTitle'])): ?>
    <section class="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50 border border-blue-200/70 shadow-xs text-left space-y-1.5">
      <!-- <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">✦</span>
        <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display m-0">
          <?= e($frontmatter['sectionTitle']) ?>
        </h2>
      </div> -->
      <?php if (!empty($frontmatter['sectionDescription'])): ?>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans m-0 pl-8">
          <?= e($frontmatter['sectionDescription']) ?>
        </p>
      <?php endif; ?>
    </section>
  <?php endif; ?>

  
  <?php 
    $title = $frontmatter['listTitle'] ?? "Cheerplex Verified Daily Predictions";
    $subtitle = $frontmatter['listSubtitle'] ?? "Mathematical probabilities and double-chance safety locks updated daily across 20+ leagues worldwide.";
    include __DIR__ . '/../components/predictions_list.php';
  ?>

  <!-- 3. KENYAN BOOKMAKER JACKPOTS COMMAND DESK -->
  <section id="jackpot-section" class="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs relative overflow-hidden text-left space-y-5">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
      <div class="space-y-1 max-w-xl">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono font-bold">
          <?= renderIcon('trophy', 'w-3 h-3 text-amber-500') ?>
          <span>Kenyan Jackpot Analytics Engine</span>
        </div>
        <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display m-0">
          Cheerplex Premium Kenyan Jackpots
        </h2>
        <p class="text-xs text-slate-500 leading-relaxed m-0">
          Mathematically calibrated prediction codes for SportPesa Mega (17), SportPesa Midweek (13), Betika Midweek (15), Mozzart Grand (20), and Mozzart Super Daily (16).
        </p>
      </div>

      <a
        href="<?= getPageUrl('jackpot-list') ?>"
        class="px-5 py-2.5 shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono rounded-xl shadow-xs transition-all no-underline cursor-pointer flex items-center gap-2 border-none"
      >
        <span>ALL 5 JACKPOTS</span>
        <?= renderIcon('chevron-right', 'w-4 h-4 text-white') ?>
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <?php foreach (array_slice($jackpots, 0, 4) as $item): ?>
        <div class="p-4 rounded-2xl border border-[var(--border)] bg-slate-50/70 hover:border-blue-500/40 transition-all flex flex-col justify-between gap-3 shadow-xs">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <?= (int)($item['gamesCount'] ?? 17) ?> GAMES
              </span>
              <span class="text-[9px] font-mono font-bold text-emerald-600">
                ACTIVE
              </span>
            </div>
            <h3 class="text-xs sm:text-sm font-black text-slate-900 font-display m-0">
              <?= e($item['name']) ?>
            </h3>
            <div class="p-2 rounded-xl bg-white border border-[var(--border)] flex items-baseline justify-between">
              <span class="text-[9px] font-mono text-slate-500">Pool Prize</span>
              <span class="text-xs font-black font-mono text-emerald-600">
                <?= e($item['estimatedPool'] ?? 'KES 15M+') ?>
              </span>
            </div>
          </div>

          <a
            href="<?= getPageUrl($item['id'] ?? $item['slug']) ?>"
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black font-mono rounded-xl transition-all no-underline cursor-pointer flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Analyze Combination</span>
            <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
          </a>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 4. VIP SUBSCRIPTION MODULE -->
  <div id="vip-showcase">
    <?php include __DIR__ . '/../components/vip_packages.php'; ?>
  </div>

  <!-- 5. PREMIUM ODDS PACKS MODULE -->
  <div id="odds-packs">
    <?php include __DIR__ . '/../components/odds_packs.php'; ?>
  </div>

  <!-- 6. EXPERT INSIGHTS & EDITORIAL MARKDOWN -->
  <div class="space-y-6">
    <section id="expert-insights" class="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4">
      <!-- <div class="space-y-1 border-b border-[var(--border)] pb-3">
        <div class="flex items-center gap-2">
          <?= renderIcon('sparkles', 'w-4 h-4 text-blue-600') ?>
          <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display m-0">
            <?= e($frontmatter['sectionTitle'] ?? "Cheerplex Quantitative Analysis & Strategy") ?>
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed m-0">
          <?= e($frontmatter['sectionDescription'] ?? "Our mathematical models evaluate rolling expected goals, head-to-head performance metrics, and defensive efficiency.") ?>
        </p>
      </div> -->

      <?php if (!empty($editorialHtml)): ?>
        <div class="prose max-w-none text-xs text-slate-700 leading-relaxed font-sans">
          <?= $editorialHtml ?>
        </div>
      <?php endif; ?>
    </section>

    <!-- Inbound internal keyword links -->
    <?php include __DIR__ . '/../components/inbound_links.php'; ?>

    <!-- Author Profile Card -->
    <?php include __DIR__ . '/../components/author_card.php'; ?>

    <!-- FAQ Accordion -->
    <?php include __DIR__ . '/../components/faq_section.php'; ?>

    <!-- Responsible Gambling Advisory Notice -->
    <?php include __DIR__ . '/../components/responsible_gambling_notice.php'; ?>
  </div>

</div>
