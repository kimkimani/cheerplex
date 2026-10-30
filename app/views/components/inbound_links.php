<?php
/**
 * Cheerplex - Inbound Links & SEO Category Hub Component
 */
$categories = [
    ['url' => '/cheerplex-today-prediction/', 'title' => "Today's Predictions", 'desc' => 'High-confidence picks for today'],
    ['url' => '/cheerplex-tomorrow-prediction/', 'title' => "Tomorrow's Predictions", 'desc' => 'Early value and line movements'],
    ['url' => '/cheerplex-yesterday-prediction/', 'title' => "Yesterday's Results", 'desc' => 'Settled win rates and accuracy ledger'],
    ['url' => '/cheerplex-1x2-prediction-tips/', 'title' => '1X2 Home Win Tips', 'desc' => 'Strongest home favorites'],
    ['url' => '/cheerplex-gg-prediction-tips/', 'title' => 'Both Teams to Score (GG)', 'desc' => 'High attacking probability'],
    ['url' => '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/', 'title' => 'SportPesa Mega Jackpot', 'desc' => '17-game mathematical slip'],
    ['url' => '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/', 'title' => 'SportPesa Midweek', 'desc' => '13-game bonus targets'],
    ['url' => '/cheerplex-jackpots-predictions-and-tips/betika-midweek/', 'title' => 'Betika Midweek Jackpot', 'desc' => '15 games for KES 15'],
    ['url' => '/cheerplex-jackpots-predictions-and-tips/mozzart-grand/', 'title' => 'Mozzart Super Grand', 'desc' => '20-match mega slip'],
    ['url' => '/cheerplex-sure-tips-and-odds/', 'title' => 'Sure Tips & Curated Decimal Odds', 'desc' => 'Daily 2+ to 10+ multiplier packs'],
    ['url' => '/cheerplex-vip-tips/', 'title' => 'Cheerplex VIP Packages', 'desc' => 'Premium multibet odds slips'],
];
?>
<section aria-label="Explore Football Betting Portals" class="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
  
  <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
    <div>
      <h3 class="text-sm sm:text-base font-black text-slate-900 font-display">
        Other Top Cheerplex Preds
      </h3>
    </div>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
    <?php foreach ($categories as $cat): ?>
      <a 
        href="<?= e($cat['url']) ?>" 
        class="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all no-underline block group"
      >
        <h4 class="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          <?= e($cat['title']) ?>
        </h4>
        <p class="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
          <?= e($cat['desc']) ?>
        </p>
      </a>
    <?php endforeach; ?>
  </div>

</section>
