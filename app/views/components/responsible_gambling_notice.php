<?php
/**
 * Cheerplex - Responsible Gambling Notice Component
 * Matches React ResponsibleGamblingNotice.tsx exactly
 */

$noticeText = $notice ?? "Sports betting and jackpot syndicates involve financial risk and may become addictive. Cheerplex provides statistical algorithms, expected goals simulations, and actuarial probabilities for entertainment and analytical decision support only. Strictly 18+ only. If betting is impacting your personal finances, call the National Responsible Gaming Helpline at 0800 720 000.";
?>
<div class="p-4 md:p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-left my-6 relative overflow-hidden shadow-xs">
  <div class="flex items-start gap-3">
    <div class="p-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 shrink-0 mt-0.5">
      <?= renderIcon('alert-triangle', 'w-5 h-5 text-amber-700') ?>
    </div>

    <div class="space-y-1 min-w-0 flex-1">
      <div class="flex items-center gap-2 flex-wrap mb-1.5">
        <span class="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1">
          <?= renderIcon('alert-triangle', 'w-3.5 h-3.5 text-amber-700') ?>
          Responsible Gambling Notice
        </span>
        <span class="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-amber-100 text-slate-900 border border-amber-300">
          STRICTLY 18+ ONLY
        </span>
      </div>

      <div class="text-xs text-slate-800 leading-relaxed font-medium">
        <p class="m-0"><?= e($noticeText) ?></p>
      </div>

      <div class="pt-2 flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-700 font-bold">
        <span>Helpline: <strong class="text-rose-600">0800 720 000</strong></span>
        <span>•</span>
        <span>BCLB Kenya Compliant</span>
      </div>
    </div>
  </div>
</div>
