<?php
/**
 * Cheerplex - VIP Packages & Odds Packs Page View
 */

$vipPackages = getVipPackages();
$oddsPacks = getOddsPacks();
$jackpots = getAllJackpots();

$mdData = loadMarkdownPage('cheerplex-vip-tips');
$editorialHtml = $mdData['html'] ?? '';
$frontmatter = $mdData['frontmatter'] ?? [];
?>

<!-- 1. VIP HERO & METRICS -->
<section class="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-6">
  <div class="space-y-3 max-w-3xl">
    <div class="flex items-center gap-2 font-mono text-xs">
      <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        Cheerplex VIP Club
      </span>
      <span class="text-slate-400">•</span>
      <span class="text-slate-500 font-semibold">Instant Safaricom M-Pesa Activation</span>
    </div>

    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display">
      VIP PACKAGES, <span class="text-blue-600">DAILY ODDS PACKS</span> &amp; JACKPOT SLIPS
    </h1>
    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
      Gain exclusive access to actuarially calibrated sports selections, multi-bet accumulators, and comprehensive 15-to-17 match Kenyan jackpot double-chance tickets.
    </p>
  </div>

  <!-- 4 Highlights Bento Bar -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100 font-mono text-left">
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <span class="text-[10px] text-slate-400 font-bold block">VIP Accuracy</span>
      <p class="text-sm font-black text-emerald-600 mt-0.5">89.4% Banker Rate</p>
    </div>
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <span class="text-[10px] text-slate-400 font-bold block">Odds Delivery</span>
      <p class="text-sm font-black text-blue-600 mt-0.5">Instant via SMS</p>
    </div>
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <span class="text-[10px] text-slate-400 font-bold block">Jackpots Tracked</span>
      <p class="text-sm font-black text-slate-900 mt-0.5">5 Major Pools</p>
    </div>
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <span class="text-[10px] text-slate-400 font-bold block">M-Pesa Verification</span>
      <p class="text-sm font-black text-amber-500 mt-0.5">Automated 24/7</p>
    </div>
  </div>
</section>

<!-- 2. VIP BUNDLES -->
<?php include __DIR__ . '/../components/vip_packages.php'; ?>

<!-- 3. DAILY ODDS PACKS -->
<?php include __DIR__ . '/../components/odds_packs.php'; ?>

<!-- 4. KENYAN JACKPOT POOLS GRID (HIGH-FIDELITY BENTO LAYOUT) -->
<section class="space-y-4 text-left">
  <!-- Section Header -->
  <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-xs">
        <?= renderIcon('trophy', 'w-5 h-5 text-slate-950') ?>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase font-display m-0">
            Kenyan Major Jackpot Prediction Slips
          </h2>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            VIP Curated
          </span>
        </div>
        <p class="text-xs text-slate-500 font-medium mt-0.5 m-0">
          Calibrated 1X2 win probabilities, double-chance safety locks, and live kickoff schedules for SportPesa, Betika & Mozzart pools.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <span class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-800">
        <?= count($jackpots) ?> Active Pools
      </span>
      <a 
        href="cheerplex-jackpots-predictions-and-tips" 
        class="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors no-underline cursor-pointer flex items-center gap-1.5"
      >
        <span>View Hub</span>
        <?= renderIcon('arrow-right', 'w-3.5 h-3.5 text-blue-600') ?>
      </a>
    </div>
  </div>

  <!-- Bento 2-Column Responsive Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
    <?php foreach ($jackpots as $jp): ?>
      <?php 
        $jackpot = $jp;
        include __DIR__ . '/../components/jackpot_card.php'; 
      ?>
    <?php endforeach; ?>
  </div>
</section>

<!-- 5. EDITORIAL STRATEGY GUIDE -->
<?php if (!empty($editorialHtml)): ?>
  <article class="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
    <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
      <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
        ✦
      </div>
      <h2 class="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display">
        Cheerplex VIP Comprehensive Strategy Guide
      </h2>
    </div>

    <div class="prose max-w-none text-xs text-slate-700 leading-relaxed font-sans">
      <?= $editorialHtml ?>
    </div>
  </article>
<?php endif; ?>

<!-- 6. FAQS -->
<?php include __DIR__ . '/../components/faq_section.php'; ?>
