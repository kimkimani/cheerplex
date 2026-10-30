<?php
/**
 * Cheerplex - Verified Editorial Author Profile Card
 * Matches React AuthorCard.tsx exactly
 * @var array|null $author
 * @var string|null $authorId
 */

if (empty($author) && !empty($authorId)) {
    $author = loadAuthor($authorId);
}

$authorName = $author['name'] ?? $authorName ?? $frontmatter['authorName'] ?? 'John K. Mwangi';
$authorRole = $author['role'] ?? $authorRole ?? $frontmatter['authorTitle'] ?? 'Lead Football Analyst & Algorithmic Modeler';
$authorBio = $author['shortBio'] ?? $author['description'] ?? $authorBio ?? $frontmatter['authorDescription'] ?? 'Senior predictive modeler specializing in expected goals (xG) regressions, African sports market variances, and Kenyan jackpot analytics.';
$authorAvatar = $author['avatar'] ?? $authorAvatar ?? $frontmatter['authorAvatar'] ?? '';
$authorExp = $author['experience'] ?? '7+ Years';
$authorCreds = $author['credentials'] ?? 'B.Sc. Actuarial Science • Applied Statistics';

$initials = 'JM';
$parts = explode(' ', trim($authorName));
if (count($parts) >= 2) {
    $initials = strtoupper(substr($parts[0], 0, 1) . substr($parts[count($parts) - 1], 0, 1));
} elseif (count($parts) === 1 && !empty($parts[0])) {
    $initials = strtoupper(substr($parts[0], 0, 2));
}
?>
<aside aria-label="Editorial profile: <?= e($authorName) ?>" class="my-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 shadow-xs transition-colors text-left">
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
    <!-- Avatar or Minimal Monogram -->
    <div class="relative shrink-0">
      <?php if (!empty($authorAvatar) && file_exists(__DIR__ . '/../../../public' . $authorAvatar)): ?>
        <img 
          src="<?= e($authorAvatar) ?>" 
          alt="<?= e($authorName) ?>"
          width="52"
          height="52"
          loading="lazy"
          decoding="async" 
          class="w-12 h-12 sm:w-13 sm:h-13 rounded-xl object-cover border border-[var(--border)]"
        />
      <?php else: ?>
        <div class="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-mono font-black text-sm">
          <?= $initials ?>
        </div>
      <?php endif; ?>
      <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
        <?= renderIcon('check', 'w-2.5 h-2.5') ?>
      </div>
    </div>

    <!-- Core Author Details -->
    <div class="flex-1 min-w-0 space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <h4 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight m-0">
          <?= e($authorName) ?>
        </h4>
        <span class="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <?= renderIcon('shield-check', 'w-3 h-3') ?>
          Verified Analyst
        </span>
        <span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          <?= e($authorExp) ?>
        </span>
      </div>

      <div class="text-xs font-medium text-blue-600 font-mono">
        <?= e($authorRole) ?>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed font-normal m-0 line-clamp-2">
        <?= e($authorBio) ?>
      </p>

      <div class="pt-1 flex items-center gap-3 text-[10px] font-mono text-slate-400">
        <span>Credentials: <?= e($authorCreds) ?></span>
        <span>•</span>
        <span>Nairobi, Kenya</span>
      </div>
    </div>
  </div>
</aside>
