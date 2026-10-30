<?php
/**
 * Cheerplex - Generic Dynamic Markdown Article Page View
 * Matches React Markdown Page Layout exactly
 * @var string $pageKey
 */

$mdData = loadMarkdownPage($pageKey);
if (!$mdData) {
    echo "<div class='p-8 text-center text-slate-500 font-bold font-mono'>Article not found.</div>";
    return;
}

$frontmatter = $mdData['frontmatter'] ?? [];
$html = $mdData['html'] ?? '';
$title = $frontmatter['displayTitle'] ?? $frontmatter['title'] ?? 'Cheerplex Predictions';
$intro = $frontmatter['intro'] ?? $frontmatter['introParagraph'] ?? '';
$readingTime = $frontmatter['readingTime'] ?? '4 min read';
$author = $mdData['author'] ?? null;
$authorName = is_array($author) ? ($author['name'] ?? 'John K. Mwangi') : ($author ?: 'John K. Mwangi');
$faqItems = $mdData['faqItems'] ?? [];
$faqTitle = $mdData['faqTitle'] ?? '';
$notice = $mdData['responsibleGambling'] ?? null;
?>
<article class="space-y-6 text-left">
  
  <!-- Breadcrumbs -->
  <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
    <a href="/" class="hover:text-blue-600 transition-colors no-underline cursor-pointer flex items-center gap-1 font-semibold text-slate-600">
      <?= renderIcon('home', 'w-3.5 h-3.5') ?>
      <span>Home</span>
    </a>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-500">Analysis & Guides</span>
    <?= renderIcon('chevron-right', 'w-3 h-3 text-slate-400 shrink-0') ?>
    <span class="text-slate-900 font-bold truncate max-w-[280px]" aria-current="page">
      <?= e($title) ?>
    </span>
  </nav>

  <!-- Article Header -->
  <header class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs space-y-3 text-left">
    <div class="flex items-center gap-2 font-mono text-[10px] font-bold text-slate-500">
      <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
        Cheerplex Intelligence
      </span>
      <span>•</span>
      <span><?= e($readingTime) ?></span>
      <span>•</span>
      <span>By <?= e($authorName) ?></span>
    </div>

    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display leading-[1.15] m-0">
      <?= e($title) ?>
    </h1>

    <?php if (!empty($intro)): ?>
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1 m-0">
        <?= e($intro) ?>
      </p>
    <?php endif; ?>
  </header>

  <!-- Article Markdown Content Body -->
  <div class="p-6 md:p-8 rounded-3xl bg-white border border-[var(--border)] shadow-xs space-y-4 text-left">
    <div class="prose max-w-none text-xs text-slate-700 leading-relaxed font-sans">
      <?= $html ?>
    </div>
  </div>

  <!-- Inbound Links Directory -->
  <?php include __DIR__ . '/../components/inbound_links.php'; ?>

  <!-- Verified Editorial Author Profile Card -->
  <?php include __DIR__ . '/../components/author_card.php'; ?>

  <!-- FAQs -->
  <?php include __DIR__ . '/../components/faq_section.php'; ?>

  <!-- Responsible Gambling Notice -->
  <?php include __DIR__ . '/../components/responsible_gambling_notice.php'; ?>

</article>
