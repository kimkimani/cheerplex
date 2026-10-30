<?php
/**
 * Cheerplex - Frequently Asked Questions Dynamic Accordion Component
 * Loads page-specific FAQ items from markdown files, with robust fallback.
 * @var array|null $faqItems
 * @var string|null $faqTitle
 */

$defaultFaqs = [
    [
        'q' => 'How accurate are Cheerplex mathematical football predictions?',
        'a' => 'Our predictive algorithms utilize Poisson distribution, expected goals (xG), head-to-head metrics, and real-time team momentum regressions. Over verified historical testing, our top-tier banker predictions consistently maintain an 84% to 89% strike rate across major European and African leagues.'
    ],
    [
        'q' => 'How are VIP odds packages and jackpot slips delivered after payment?',
        'a' => 'Delivery is fully automated. Upon successful confirmation of your Safaricom M-Pesa STK payment to Paybill / Pochi, your selected slips are instantly unlocked directly on the screen, and dispatched straight to your phone via SMS and WhatsApp.'
    ],
    [
        'q' => 'Which Kenyan Jackpots do you cover?',
        'a' => 'We provide calibrated predictions and permutations for all five major Kenyan bookmaker pools: the SportPesa Mega Jackpot (17 games), SportPesa Midweek (13 games), Betika Midweek (15 games), Mozzart Super Grand (20 games), and Mozzart Super Daily (16 games).'
    ],
    [
        'q' => 'How does the interactive community voting poll work?',
        'a' => 'Every match includes a real-time community poll. Punters can vote for Home (1), Draw (X), or Away (2) to register consensus. The system updates live percentage weights, providing a valuable crowd-wisdom benchmark against our computer models.'
    ],
    [
        'q' => 'What is your customer support contact for billing questions?',
        'a' => 'Our dedicated Kenyan sports desk is available via WhatsApp and hotline at +254 740 841 375, and via email at support@cheerplex.co.ke from 09:00 to 18:00 EAT Monday through Saturday.'
    ]
];

// Determine effective items and heading
$displayFaqs = (!empty($faqItems) && is_array($faqItems)) ? $faqItems : $defaultFaqs;
$heading = !empty($faqTitle) ? $faqTitle : 'Frequently Asked Questions';
?>
<section id="faq-section" aria-label="Frequently Asked Questions" class="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
  
  <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
    <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
      ?
    </div>
    <div>
      <h2 class="text-base sm:text-lg font-black text-slate-900 font-display">
        <?= e($heading) ?>
      </h2>
    </div>
  </div>

  <div class="space-y-2.5">
    <?php foreach ($displayFaqs as $idx => $faq): 
      $qText = is_array($faq) ? ($faq['q'] ?? $faq['question'] ?? '') : '';
      $aText = is_array($faq) ? ($faq['a'] ?? $faq['answer'] ?? '') : '';
      $aHtml = is_array($faq) ? ($faq['aHtml'] ?? null) : null;
      if (empty($qText)) continue;
    ?>
      <div class="border border-slate-200 rounded-2xl overflow-hidden transition-colors">
        <button 
          type="button" 
          onclick="toggleFaq('faq-<?= $idx ?>')"
          class="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span><?= e($qText) ?></span>
          <svg id="faq-icon-<?= $idx ?>" class="w-4 h-4 text-slate-400 shrink-0 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div id="faq-<?= $idx ?>" class="hidden p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
          <?php if (!empty($aHtml)): ?>
            <?= $aHtml ?>
          <?php else: ?>
            <?= nl2br(e($aText)) ?>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

</section>

<script>
if (typeof toggleFaq !== 'function') {
  function toggleFaq(id) {
    const el = document.getElementById(id);
    const icon = document.getElementById('faq-icon-' + id.replace('faq-', ''));
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    el.classList.toggle('hidden', !isHidden);
    if (icon) {
      icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }
}
</script>
