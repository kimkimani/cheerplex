<?php
/**
 * Cheerplex - Dedicated Sure Tips & Curated Decimal Odds Page
 * Route: /cheerplex-sure-tips-and-odds/
 * Arranged strictly as:
 * 1. Dedicated Multi-Tier Odds Packs (2+, 3+, 5+, 7+, 9+/10+)
 * 2. Today's Matches & Predictions with Interactive Voting Polls
 * 3. Kenyan Jackpots Command Hub
 * 4. Structured Content, Editorial Author, FAQs, and Responsible Gambling Notice
 */

// 1. Fetch baseline data
$allOdds = getOddsPacks();
$todayFixtures = getFixturesByCategory('category-today');
$jackpots = getAllJackpots();

// 2. Load markdown content and metadata
$mdData = loadMarkdownPage('cheerplex-sure-tips-and-odds');
$frontmatter = $mdData['frontmatter'] ?? [];
$html = $mdData['html'] ?? '';

$pageTitle = $frontmatter['displayTitle'] ?? $frontmatter['title'] ?? 'Cheerplex Sure Tips & Curated Decimal Odds';
$introParagraph = $frontmatter['introParagraph'] ?? 'Access mathematically validated daily odds packs featuring 2+, 3+, 5+, 7+, and 10+ multiplier slips. Cheerplex combines high-probability banker selections with instant bookmaker booking codes and automated M-Pesa dispatch.';

$author = $mdData['author'] ?? getAuthor('john-mwangi');
$faqItems = $mdData['faqItems'] ?? [];
$faqTitle = $mdData['faqTitle'] ?? 'Frequently Asked Questions - Sure Tips & Odds';
$notice = $mdData['responsibleGambling'] ?? null;
?>
<div class="space-y-8 text-left">
  
  <!-- Breadcrumbs -->
  <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
    <a href="/" class="hover:text-blue-600 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600">
      <?= renderIcon('home', 'w-3.5 h-3.5') ?>
      <span>Home</span>
    </a>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-500">Sure Tips &amp; Odds</span>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-900 font-bold truncate max-w-[280px]" aria-current="page">
      <?= e($pageTitle) ?>
    </span>
  </nav>

  <!-- ========================================================================= -->
  <!-- HERO HEADER: CHEERPLEX SURE TIPS & DECIMAL ODDS                           -->
  <!-- ========================================================================= -->
  <section class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs text-left space-y-6 relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black tracking-wider font-mono">
          <?= renderIcon('zap', 'w-3 h-3 text-amber-500 fill-amber-400') ?>
          <span>CHEERPLEX ODD PACKS</span>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display m-0 leading-tight">
          <?= e($pageTitle) ?>
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-normal m-0">
          <?= e($introParagraph) ?>
        </p>
      </div>

      <div class="flex flex-col items-start md:items-end gap-1.5 shrink-0 font-mono text-xs">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Today's Odds Active</span>
        </span>
        <span class="text-[11px] text-slate-500">
          Automated M-Pesa STK &amp; SMS
        </span>
      </div>
    </div>

    <!-- Quick Bento Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-left">
      <div class="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <span class="text-[9px] uppercase font-bold text-slate-400 block">Verified Packs</span>
        <span class="text-xl sm:text-2xl font-black text-slate-900">4 Multipliers</span>
        <span class="text-[10px] text-blue-600 font-semibold block mt-0.5">2+ to 10+ Odds</span>
      </div>
      <div class="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <span class="text-[9px] uppercase font-bold text-slate-400 block">Historical Strike Rate</span>
        <span class="text-xl sm:text-2xl font-black text-emerald-600">84% - 91%</span>
        <span class="text-[10px] text-emerald-700 font-semibold block mt-0.5">Audited Slips</span>
      </div>
      <div class="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <span class="text-[9px] uppercase font-bold text-slate-400 block">Dispatch Channel</span>
        <span class="text-xl sm:text-2xl font-black text-slate-900">SMS &amp; Web</span>
        <span class="text-[10px] text-slate-500 font-semibold block mt-0.5">&lt; 60 Sec Delivery</span>
      </div>
      <div class="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <span class="text-[9px] uppercase font-bold text-slate-400 block">Supported Bookies</span>
        <span class="text-xl sm:text-2xl font-black text-blue-600">Top 3</span>
        <span class="text-[10px] text-slate-500 font-semibold block mt-0.5">SportPesa • Betika • Mozzart</span>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 1: ALL DEDICATED ODDS PACKS CARDS                                 -->
  <!-- ========================================================================= -->
  <section id="odds-packs-catalog" class="space-y-4 text-left">
    <div class="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display m-0">
          Curated Daily Odds Packs &amp; Multipliers
        </h2>
        <p class="text-xs text-slate-500 m-0 mt-0.5">
          Choose your risk profile. Instant Safaricom Daraja STK Push activation with complete match slips.
        </p>
      </div>
      <span class="text-[11px] font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold hidden sm:inline-flex items-center gap-1.5">
        <?= renderIcon('shield-check', 'w-3.5 h-3.5 text-blue-600') ?> Instant Delivery
      </span>
    </div>

    <!-- Odds Packs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      <?php foreach ($allOdds as $idx => $pack): 
        $price = (int)($pack['price'] ?? 150);
        $oddsMin = $pack['oddsMinDecimal'] ?? '3.00';
        $mult = (float)preg_replace('/[^0-9.]/', '', $oddsMin) ?: 3.0;

        if ($mult < 4.0) {
            $gradient = 'from-emerald-500 via-teal-500 to-emerald-600';
            $badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
            $ringClass = 'border-emerald-300 hover:border-emerald-500';
            $tagText = 'SAFE BANKER';
            $winRate = '91%';
            $riskText = 'Low Variance';
            $isFeatured = false;
        } elseif ($mult < 6.5) {
            $gradient = 'from-blue-600 via-indigo-600 to-cyan-500';
            $badgeBg = 'bg-blue-50 text-blue-800 border-blue-300';
            $ringClass = 'border-blue-500 ring-2 ring-blue-500/20 shadow-md';
            $tagText = 'BEST VALUE';
            $winRate = '84%';
            $riskText = 'Balanced Risk';
            $isFeatured = true;
        } elseif ($mult < 8.5) {
            $gradient = 'from-purple-600 via-indigo-600 to-blue-600';
            $badgeBg = 'bg-purple-50 text-purple-800 border-purple-300';
            $ringClass = 'border-purple-300 hover:border-purple-500';
            $tagText = 'PRO SELECTION';
            $winRate = '78%';
            $riskText = 'High Return';
            $isFeatured = false;
        } else {
            $gradient = 'from-amber-500 via-orange-500 to-amber-600';
            $badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
            $ringClass = 'border-amber-300 hover:border-amber-500';
            $tagText = 'MAX MULTIPLIER';
            $winRate = '72%';
            $riskText = 'High Yield';
            $isFeatured = false;
        }

        $potentialReturn = number_format(round(500 * $mult));
      ?>
        <div class="flex flex-col justify-between rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md text-left <?= $ringClass ?>">
          <!-- Gradient Top Stripe -->
          <div class="h-2 w-full bg-gradient-to-r <?= $gradient ?>"></div>

          <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-1.5">
                <span class="text-[9.5px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border <?= $badgeBg ?>">
                  <?= $tagText ?>
                </span>
                <?php if ($isFeatured): ?>
                  <span class="text-[9px] font-mono font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <?= renderIcon('star', 'w-2.5 h-2.5 text-amber-600 fill-amber-500') ?>
                    POPULAR
                  </span>
                <?php endif; ?>
              </div>

              <div class="flex items-baseline justify-between gap-2 pt-1">
                <h3 class="text-lg font-black text-slate-900 tracking-tight font-display m-0">
                  <?= e($pack['name']) ?>
                </h3>
                <span class="text-base font-black font-mono text-blue-600">
                  <?= e($oddsMin) ?>+
                </span>
              </div>

              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed m-0">
                <?= e($pack['description'] ?? 'Target multiplier accumulator slip') ?>
              </p>
            </div>

            <!-- Pricing & Simulation Card -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 font-mono">
              <div class="flex items-baseline justify-between">
                <div>
                  <span class="text-[9px] uppercase text-slate-400 block font-bold">Pack Price</span>
                  <span class="text-2xl font-black text-slate-900">KES <?= number_format($price) ?></span>
                </div>
                <div class="text-right">
                  <span class="text-[9px] uppercase text-slate-400 block font-bold">Historical Win</span>
                  <span class="text-xs font-black text-emerald-600"><?= $winRate ?></span>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span class="text-slate-500">KES 500 Stake Return:</span>
                <strong class="text-blue-700 font-bold">KES <?= $potentialReturn ?></strong>
              </div>
            </div>

            <!-- Features Checklist -->
            <ul class="space-y-1.5 text-xs text-slate-600 font-sans list-none p-0 m-0">
              <li class="flex items-center gap-2">
                <?= renderIcon('check', 'w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]') ?>
                <span><strong><?= e($pack['picksPerDay'] ?? 3) ?></strong> Curated match selections</span>
              </li>
              <li class="flex items-center gap-2">
                <?= renderIcon('check', 'w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]') ?>
                <span>SportPesa, Betika &amp; Mozzart codes</span>
              </li>
              <li class="flex items-center gap-2">
                <?= renderIcon('check', 'w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]') ?>
                <span>Direct SMS &amp; WhatsApp instant dispatch</span>
              </li>
            </ul>

            <!-- Unlock CTA Button -->
            <div class="pt-2">
              <button
                type="button"
                onclick="openPaymentModal('<?= e($pack['name']) ?>', <?= $price ?>, '<?= e($pack['slug'] ?? 'odds-pack') ?>', 'odds')"
                class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 border-none active:scale-[0.98]"
              >
                <?= renderIcon('zap', 'w-3.5 h-3.5 text-amber-300') ?>
                <span>Unlock Pack • KES <?= number_format($price) ?></span>
              </button>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 2: TODAY'S MATCH PREDICTIONS WITH FAN VOTING                      -->
  <!-- ========================================================================= -->
  <section class="space-y-4 text-left">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
          <span>Active Matchday</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display m-0 mt-1">
          Today's Featured Match Predictions &amp; Value Picks
        </h2>
        <p class="text-xs text-slate-500 m-0 mt-0.5">
          High-confidence fixtures feeding into our daily sure odds calculations. Cast your community vote or analyze the match intelligence.
        </p>
      </div>

      <a 
        href="/cheerplex-today-prediction" 
        class="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 hover:text-blue-700 no-underline self-start sm:self-auto"
      >
        <span>View All Today Fixtures</span>
        <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
      </a>
    </div>

    <!-- Match List Stream -->
    <div class="space-y-3.5">
      <?php 
        $displayFixtures = array_slice($todayFixtures, 0, 10);
        foreach ($displayFixtures as $idx => $fixture): 
          $home = $fixture['homeTeam'] ?? 'Home Team';
          $away = $fixture['awayTeam'] ?? 'Away Team';
          $league = $fixture['leagueName'] ?? 'League';
          $pred = $fixture['prediction'] ?? '1';
          $conf = (int)($fixture['confidence'] ?? 80);
          $ko = $fixture['kickoffTime'] ?? $fixture['date'] ?? '';
          $koFormatted = !empty($ko) ? date('H:i EAT', strtotime($ko)) : '17:00 EAT';
          $fid = $fixture['id'] ?? ($idx + 1);
      ?>
        <article class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-3">
          <!-- Top Row: League & Kickoff -->
          <div class="flex items-center justify-between text-xs font-mono text-slate-500">
            <span class="font-bold text-slate-700"><?= e($league) ?></span>
            <span class="flex items-center gap-1">
              <?= renderIcon('clock', 'w-3.5 h-3.5 text-slate-400') ?>
              <span><?= e($koFormatted) ?></span>
            </span>
          </div>

          <!-- Teams Row & Pick Badge -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div class="space-y-1">
              <div class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display">
                <span><?= e($home) ?></span>
                <span class="text-slate-400 mx-2 font-mono text-sm font-normal">vs</span>
                <span><?= e($away) ?></span>
              </div>
            </div>

            <!-- Official Tip & Confidence -->
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
                <span class="text-[10px] text-blue-500 uppercase">Tip:</span>
                <strong class="text-sm font-black"><?= e($pred) ?></strong>
              </div>
              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                <span><?= $conf ?>%</span>
                <span class="text-[10px] text-emerald-600 font-normal">Conf.</span>
              </div>
            </div>
          </div>

          <!-- Interactive Voting Poll -->
          <div class="pt-2 border-t border-slate-100">
            <?php 
              $variant = 'desktop-row';
              include __DIR__ . '/../components/vote_poll.php';
            ?>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 3: KENYAN JACKPOTS COMMAND HUB                                    -->
  <!-- ========================================================================= -->
  <section class="space-y-4 text-left">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
          <span>Million Shilling Pools</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display m-0 mt-1">
          Kenyan Jackpots Command Hub
        </h2>
        <p class="text-xs text-slate-500 m-0 mt-0.5">
          Compare this week's SportPesa Mega, Midweek, Betika, and Mozzart grand jackpots.
        </p>
      </div>

      <a 
        href="cheerplex-jackpots-predictions-and-tips" 
        class="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 hover:text-blue-700 no-underline self-start sm:self-auto"
      >
        <span>View All Jackpots</span>
        <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
      </a>
    </div>

    <!-- Bento Jackpot Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <?php foreach ($jackpots as $jackpot): ?>
        <?php include __DIR__ . '/../components/jackpot_card.php'; ?>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 4: EDITORIAL CONTENT & METHODOLOGY                                -->
  <!-- ========================================================================= -->
  <?php if (!empty($html)): ?>
    <section class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs space-y-4 text-left">
      <div class="prose max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
        <?= $html ?>
      </div>
    </section>
  <?php endif; ?>

  <!-- Inbound Links Directory -->
  <?php include __DIR__ . '/../components/inbound_links.php'; ?>

  <!-- Verified Editorial Author Profile Card -->
  <?php include __DIR__ . '/../components/author_card.php'; ?>

  <!-- FAQs Section -->
  <?php include __DIR__ . '/../components/faq_section.php'; ?>

  <!-- Responsible Gambling Notice -->
  <?php include __DIR__ . '/../components/responsible_gambling_notice.php'; ?>

</div>
