<?php
/**
 * Cheerplex - Responsible Gambling Advisory Page View
 */
?>
<section class="p-6 md:p-8 rounded-3xl bg-white border border-rose-200/80 shadow-xs text-left space-y-4">
  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold">
    <span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
    <span>Safety &amp; Player Protection</span>
  </div>
  <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
    Responsible Gambling &amp; Player Protection
  </h1>
  <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
    Cheerplex is an educational and mathematical sports analytics platform headquartered in Nairobi, Kenya. We promote responsible sports entertainment and strictly condemn problem gambling.
  </p>
</section>

<!-- Principles Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
  
  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
    <div class="flex items-center gap-2 font-mono text-xs font-bold text-rose-600">
      <span class="w-2 h-2 rounded-full bg-rose-600"></span>
      <h4>1. Strict Entertainment Budget</h4>
    </div>
    <p class="text-xs text-slate-600 leading-relaxed">
      Never wager funds designated for essential expenses such as rent, food, medical care, or education. Only participate with discretionary funds that you can afford to lose.
    </p>
  </div>

  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
    <div class="flex items-center gap-2 font-mono text-xs font-bold text-rose-600">
      <span class="w-2 h-2 rounded-full bg-rose-600"></span>
      <h4>2. Never Chase Losses</h4>
    </div>
    <p class="text-xs text-slate-600 leading-relaxed">
      Attempting to recoup lost stakes by increasing bet sizes is the primary indicator of problem gambling. Maintain emotional discipline and step back if variance runs against you.
    </p>
  </div>

  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
    <div class="flex items-center gap-2 font-mono text-xs font-bold text-rose-600">
      <span class="w-2 h-2 rounded-full bg-rose-600"></span>
      <h4>3. Acknowledge Probability Chaos</h4>
    </div>
    <p class="text-xs text-slate-600 leading-relaxed">
      Even the most advanced actuarial algorithms, Poisson models, or head-to-head records cannot guarantee a 100% correct result. Football outcomes carry inherent variance.
    </p>
  </div>

  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
    <div class="flex items-center gap-2 font-mono text-xs font-bold text-rose-600">
      <span class="w-2 h-2 rounded-full bg-rose-600"></span>
      <h4>4. Strictly 18+ Verification</h4>
    </div>
    <p class="text-xs text-slate-600 leading-relaxed">
      Underage betting is illegal in the Republic of Kenya under the Betting, Lotteries and Gaming Act (Cap 131). Cheerplex is restricted exclusively to individuals aged 18 and older.
    </p>
  </div>

</div>

<!-- Helplines & Self Exclusion Card -->
<section class="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md text-left space-y-4">
  <h3 class="text-lg font-black font-display text-white">
    Need Support or Self-Exclusion Assistance?
  </h3>
  <p class="text-xs text-slate-300 leading-relaxed">
    If sports betting is negatively impacting your personal, emotional, or financial wellbeing, confidential support is available:
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
      <span class="text-slate-400 text-[10px] uppercase block">Kenya National Helpline</span>
      <strong class="text-lg font-black text-amber-400 block">Call 1199 (Toll Free)</strong>
    </div>

    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
      <span class="text-slate-400 text-[10px] uppercase block">BCLB Official Regulatory Body</span>
      <span class="text-xs text-slate-300 block">Betting Control &amp; Licensing Board Kenya</span>
    </div>
  </div>
</section>

<?php
$rgMd = loadMarkdownPage('responsible-gambling');
$faqItems = $rgMd['faqItems'] ?? [];
$faqTitle = $rgMd['faqTitle'] ?? 'Frequently Asked Questions - Responsible Gambling';
if (!empty($faqItems)) {
    include __DIR__ . '/../components/faq_section.php';
}
?>
