<?php
/**
 * Cheerplex - Top Banker Showcase Card Component
 * Matches React TopBankerCard.tsx exactly
 */

$banker = getTopBanker();

if (!$banker) return;

$variant = $bankerVariant ?? $variant ?? 'hero';

$confidence = (int)($banker['confidence'] ?? 85);
$homeProb = $confidence;
$odds = max(1.25, round(100 / max(30, $confidence), 2));
$kickoffFormatted = formatTimeEAT($banker['kickoffTime'] ?? null);
$tipText = $banker['prediction'] ?? 'Home Win (1)';

if ($variant === 'hero'):
?>
<div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-500/30 shadow-xl relative overflow-hidden transition-all hover:border-blue-400/50 text-left">
  <!-- Ambient subtle glow -->
  <div class="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

  <!-- Top Header Tag -->
  <div class="flex items-center justify-between gap-2 pb-3.5 border-b border-blue-800/60">
    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10.5px] font-mono font-black uppercase tracking-wider border border-amber-400/30">
      <?= renderIcon('flame', 'w-3.5 h-3.5 text-amber-400 fill-amber-400') ?>
      <span>TOP GAME OF THE DAY</span>
    </div>

    <div class="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
      <?= renderIcon('clock', 'w-3 h-3 text-blue-400') ?>
      <span><?= e($kickoffFormatted) ?></span>
    </div>
  </div>

  <!-- Match Breakdown -->
  <div class="py-4 sm:py-5 space-y-4">
    <div class="flex items-center justify-between text-xs text-blue-200/80 font-mono">
      <span class="truncate max-w-[60%]"><?= e($banker['leagueName'] ?? 'Premier League') ?></span>
      <span class="flex items-center gap-1">
        <?= renderIcon('clock', 'w-3 h-3 text-blue-400') ?>
        <span>Kickoff <?= e($kickoffFormatted) ?></span>
      </span>
    </div>

    <div class="flex items-center justify-between gap-2 sm:gap-4">
      <div class="flex-1 text-left min-w-0">
        <div class="font-black text-base sm:text-lg text-white tracking-tight truncate">
          <?= e($banker['homeTeam']) ?>
        </div>
        <span class="text-[10.5px] text-blue-300/80 font-mono block mt-0.5">
          Home Form
        </span>
      </div>

      <div class="px-2.5 py-1 rounded-lg bg-blue-900/60 border border-blue-700/60 font-mono font-black text-xs text-blue-200 shrink-0">
        VS
      </div>

      <div class="flex-1 text-right min-w-0">
        <div class="font-black text-base sm:text-lg text-white tracking-tight truncate">
          <?= e($banker['awayTeam']) ?>
        </div>
        <span class="text-[10.5px] text-blue-300/80 font-mono block mt-0.5">
          Away Form
        </span>
      </div>
    </div>

    <!-- Calibrated Model Output Box -->
    <div class="p-3 sm:p-3.5 rounded-xl bg-slate-950/70 border border-blue-900/80 flex items-center justify-between gap-3">
      <div>
        <span class="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">
          Pick
        </span>
        <div class="flex items-center gap-1.5 mt-0.5">
          <strong class="text-sm sm:text-base font-black text-white font-mono">
            <?= e($tipText) ?>
          </strong>
          <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
            @<?= number_format($odds, 2) ?>
          </span>
        </div>
      </div>

      <div class="text-right">
        <span class="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">
          Confidence
        </span>
        <div class="flex items-center justify-end gap-1.5 mt-0.5">
          <div class="w-16 bg-slate-800 rounded-full h-2 overflow-hidden hidden sm:block">
            <div class="bg-emerald-400 h-full rounded-full" style="width: <?= $confidence ?>%"></div>
          </div>
          <strong class="text-sm sm:text-base font-black text-emerald-400 font-mono tabular-nums">
            <?= $confidence ?>%
          </strong>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom CTA Action Bar -->
  <div class="pt-2 border-t border-blue-900/60 flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-[11px] text-blue-200/90 font-mono">
      <?= renderIcon('shield-check', 'w-3.5 h-3.5 text-blue-400') ?>
      <span>For more Tip</span>
    </div>

    <a 
      href="<?= getPageUrl('category-today') ?>"
      class="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 font-mono no-underline transition-colors"
    >
      <span>Explore Today's Predictions</span>
      <?= renderIcon('arrow-right', 'w-3.5 h-3.5') ?>
    </a>
  </div>
</div>
<?php elseif ($variant === 'minimal'): ?>
<!-- MINIMAL TOP 1 GAME ACCUMULATOR OF THE DAY -->
<div class="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white border border-blue-900/60 shadow-xs relative overflow-hidden text-left space-y-3">
  <!-- Ambient subtle glow -->
  <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

  <!-- Header strip -->
  <div class="flex items-center justify-between gap-2 border-b border-blue-900/50 pb-2.5">
    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black uppercase tracking-wider border border-amber-400/30">
      <?= renderIcon('flame', 'w-3 h-3 text-amber-400 fill-amber-400') ?>
      <span>TOP GAME OF THE DAY</span>
    </div>

    <div class="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
      <?= renderIcon('clock', 'w-3 h-3 text-blue-400') ?>
      <span><?= e($kickoffFormatted) ?></span>
    </div>
  </div>

  <!-- Core Match & Model Output Arena -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <!-- Match Info -->
    <div class="min-w-0 space-y-1">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm sm:text-base font-bold text-white tracking-tight">
          <?= e($banker['homeTeam']) ?>
        </span>
        <span class="text-xs font-mono font-bold text-blue-400">vs</span>
        <span class="text-sm sm:text-base font-bold text-white tracking-tight">
          <?= e($banker['awayTeam']) ?>
        </span>
      </div>
      <div class="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
        <span><?= e($banker['leagueName'] ?? 'Premier League') ?></span>
        <span>•</span>
        <span class="text-emerald-400 font-semibold">Cheerplex Verified</span>
      </div>
    </div>

    <!-- Right: Pick & Confidence Badges -->
    <div class="flex items-center gap-2.5 shrink-0">
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-black shadow-xs">
        <?= renderIcon('zap', 'w-3.5 h-3.5 text-amber-300') ?>
        <span>PICK:</span>
        <span class="tracking-wide uppercase"><?= e($tipText) ?></span>
        <span class="text-amber-300 ml-0.5">@<?= number_format($odds, 2) ?></span>
      </div>

      <div class="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-700">
        <span class="text-slate-400 text-[10px]">Conf:</span>
        <span class="font-bold text-emerald-400 tabular-nums"><?= $confidence ?>%</span>
      </div>
    </div>
  </div>
</div>
<?php else: ?>
<!-- SIDEBAR COMPACT VARIANT -->
<div class="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] text-left relative overflow-hidden">
  <div class="flex items-center justify-between pb-2.5 border-b border-[var(--border)]">
    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono font-black uppercase">
      <?= renderIcon('flame', 'w-3 h-3 text-amber-500 fill-amber-500') ?>
      <span>Banker of the Day</span>
    </div>
    <span class="text-[10px] font-mono font-bold text-slate-400"><?= e($kickoffFormatted) ?></span>
  </div>

  <div class="py-3 space-y-2">
    <div class="text-[10px] font-mono text-slate-400 truncate"><?= e($banker['leagueName'] ?? 'Premier League') ?></div>
    <div class="font-bold text-xs text-slate-900 leading-tight">
      <?= e($banker['homeTeam']) ?> vs <?= e($banker['awayTeam']) ?>
    </div>
    
    <div class="p-2 rounded-xl bg-slate-50 border border-[var(--border)] flex items-center justify-between text-xs font-mono">
      <div>
        <span class="text-[9px] text-slate-400 uppercase block">Tip:</span>
        <strong class="text-blue-600 font-bold"><?= e($tipText) ?></strong>
      </div>
      <div class="text-right">
        <span class="text-[9px] text-slate-400 uppercase block">Confidence:</span>
        <strong class="text-emerald-600 font-black"><?= $confidence ?>%</strong>
      </div>
    </div>
  </div>

  <a 
    href="<?= getPageUrl('category-today') ?>"
    class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 no-underline shadow-xs"
  >
    <span>View All Predictions</span>
    <?= renderIcon('chevron-right', 'w-3.5 h-3.5') ?>
  </a>
</div>
<?php endif; ?>
