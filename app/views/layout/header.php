<?php
/**
 * Cheerplex - Master Header Layout Template
 */
global $SITE_CONTACTS;
$currentPage = $pageId ?? 'home';
$meta = $pageMeta ?? getMetadata($currentPage);
$pageTitle = $meta['title'] ?? 'Cheerplex - Football Prediction and Free Jackpot Tips';
$pageDesc = $meta['description'] ?? 'Cheerplex.co.ke - Premier Kenyan football predictions, 1X2 tips, GG/BTTS, multi-tier sure odds, and jackpot predictions.';
$canonical = BASE_URL . getPageUrl($currentPage);

$topJackpotsMenu = [
    ['id' => 'sportpesa-mega', 'name' => 'SportPesa Mega Jackpot', 'games' => '17 Games', 'prize' => 'Ksh 385M', 'badge' => 'Active', 'url' => getPageUrl('sportpesa-mega')],
    ['id' => 'sportpesa-midweek', 'name' => 'SportPesa Midweek', 'games' => '13 Games', 'prize' => 'Ksh 15M', 'badge' => 'Active', 'url' => getPageUrl('sportpesa-midweek')],
    ['id' => 'betika-midweek', 'name' => 'Betika Midweek JP', 'games' => '15 Games', 'prize' => 'Ksh 15M', 'badge' => 'Midweek', 'url' => getPageUrl('betika-midweek')],
    ['id' => 'mozzart-grand', 'name' => 'Mozzart Grand JP', 'games' => '20 Games', 'prize' => 'Ksh 200M', 'badge' => 'Active', 'url' => getPageUrl('mozzart-grand')],
    ['id' => 'mozzart-super-daily', 'name' => 'Mozzart Super Daily', 'games' => '16 Games', 'prize' => 'Ksh 20M', 'badge' => 'Daily', 'url' => getPageUrl('mozzart-super-daily')],
    ['id' => 'sportybet', 'name' => 'SportyBet 12 Jackpot', 'games' => '12 Games', 'prize' => 'Ksh 5M', 'badge' => 'Weekend', 'url' => getPageUrl('sportybet')],
];

$marketChannelsMenu = [
    ['label' => 'Home Predictions', 'icon' => 'trending-up', 'id' => 'home', 'tag' => 'Live', 'url' => '/'],
    ['label' => "Today's Free Tips", 'icon' => 'flame', 'id' => 'category-today', 'tag' => 'Hot', 'url' => getPageUrl('category-today')],
    ['label' => "Tomorrow's Tips", 'icon' => 'calendar', 'id' => 'category-tomorrow', 'tag' => 'Pre-Match', 'url' => getPageUrl('category-tomorrow')],
    ['label' => "Yesterday's Results", 'icon' => 'history', 'id' => 'category-yesterday', 'tag' => 'Verified', 'url' => getPageUrl('category-yesterday')],
    ['label' => 'All Jackpots Hub', 'icon' => 'trophy', 'id' => 'jackpot-list', 'tag' => 'Pools', 'url' => getPageUrl('jackpot-list')],
    ['label' => 'Decimal Odds Packs', 'icon' => 'percent', 'id' => 'cheerplex-sure-tips-and-odds', 'tag' => '2+ & 5+', 'url' => '/cheerplex-sure-tips-and-odds/'],
    ['label' => 'Cheerplex VIP Club', 'icon' => 'crown', 'id' => 'vip-packages', 'tag' => 'Join VIP', 'url' => getPageUrl('vip-packages')],
];
?>
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="<?= e($pageDesc) ?>">
  <link rel="canonical" href="<?= e($canonical) ?>">
  
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#1d4ed8">

  <!-- OpenGraph Metadata -->
  <meta property="og:title" content="<?= e($pageTitle) ?>">
  <meta property="og:description" content="<?= e($pageDesc) ?>">
  <meta property="og:url" content="<?= e($canonical) ?>">
  <meta property="og:site_name" content="Cheerplex">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_KE">
  <meta property="og:image" content="<?= BASE_URL ?>/favicon.svg">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:image:alt" content="Cheerplex Football Predictions">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@cheerplex">
  <meta name="twitter:title" content="<?= e($pageTitle) ?>">
  <meta name="twitter:description" content="<?= e($pageDesc) ?>">
  <meta name="twitter:image" content="<?= BASE_URL ?>/favicon.svg">

  <!-- Universal Tracking, Tag Management, Search Console & Analytics -->
  <?php if (function_exists('renderHeadTrackingTags')) echo renderHeadTrackingTags(); ?>

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Cheerplex Agentic Context">

  <!-- High-Performance Typography: Preconnect & Preload to prevent FOUT & CLS -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://flagcdn.com" crossorigin>
  <link rel="dns-prefetch" href="https://flagcdn.com">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Unbounded:wght@700;800;900&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Unbounded:wght@700;800;900&display=swap" rel="stylesheet">

  <!-- Schema.org JSON-LD Structured Data for Rich Snippets, SEO & AI Agents -->
  <?php
  // Build breadcrumbs for Schema.org
  $breadcrumbItems = [
      [
          '@type' => 'ListItem',
          'position' => 1,
          'name' => 'Home',
          'item' => 'https://cheerplex.co.ke/'
      ]
  ];
  if ($currentPage !== 'home') {
      $breadcrumbItems[] = [
          '@type' => 'ListItem',
          'position' => 2,
          'name' => $pageTitle,
          'item' => $canonical
      ];
  }

  // Schema graph definition
  $schemaGraph = [
      [
          '@type' => 'WebSite',
          '@id' => 'https://cheerplex.co.ke/#website',
          'url' => 'https://cheerplex.co.ke/',
          'name' => 'Cheerplex',
          'description' => 'Kenya Premier Football Predictions, Sure Decimal Odds & Jackpot Analysis',
          'inLanguage' => 'en-KE',
          'potentialAction' => [
              '@type' => 'SearchAction',
              'target' => 'https://cheerplex.co.ke/football-predictions-today?q={search_term_string}',
              'query-input' => 'required name=search_term_string'
          ]
      ],
      [
          '@type' => 'SportsOrganization',
          '@id' => 'https://cheerplex.co.ke/#organization',
          'name' => 'Cheerplex Sports Lab',
          'url' => 'https://cheerplex.co.ke/',
          'logo' => 'https://cheerplex.co.ke/favicon-512x512.png',
          'sameAs' => [
              'https://facebook.com/cheerplexkenya',
              'https://x.com/cheerplex_ke',
              'https://instagram.com/cheerplex_ke',
              'https://t.me/cheerplex'
          ],
          'contactPoint' => [
              '@type' => 'ContactPoint',
              'telephone' => '+254-740-841-375',
              'contactType' => 'customer service',
              'areaServed' => 'KE',
              'availableLanguage' => ['English', 'Swahili']
          ]
      ],
      [
          '@type' => 'BreadcrumbList',
          '@id' => $canonical . '#breadcrumb',
          'itemListElement' => $breadcrumbItems
      ],
      [
          '@type' => 'WebPage',
          '@id' => $canonical . '#webpage',
          'url' => $canonical,
          'name' => $pageTitle,
          'description' => $pageDesc,
          'isPartOf' => ['@id' => 'https://cheerplex.co.ke/#website'],
          'breadcrumb' => ['@id' => $canonical . '#breadcrumb']
      ]
  ];

  // Dynamically include FAQPage schema if FAQs are defined on this page
  if (!empty($faqItems) && is_array($faqItems)) {
      $mainEntities = [];
      foreach ($faqItems as $f) {
          $q = $f['q'] ?? $f['question'] ?? '';
          $a = $f['a'] ?? $f['answer'] ?? '';
          if (!empty($q) && !empty($a)) {
              $mainEntities[] = [
                  '@type' => 'Question',
                  'name' => strip_tags($q),
                  'acceptedAnswer' => [
                      '@type' => 'Answer',
                      'text' => strip_tags($a)
                  ]
              ];
          }
      }
      if (!empty($mainEntities)) {
          $schemaGraph[] = [
              '@type' => 'FAQPage',
              '@id' => $canonical . '#faq',
              'mainEntity' => $mainEntities
          ];
      }
  }
  ?>
  <script type="application/ld+json">
  <?= json_encode(['@context' => 'https://schema.org', '@graph' => $schemaGraph], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
  </script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
            display: ['Unbounded', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
          },
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#1d4ed8',
              700: '#1e40af',
              800: '#1e3a8a',
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Zero Layout Shift (CLS) Metric Overrides & Font Fallback Dimensions */
    @font-face {
      font-family: 'Plus Jakarta Sans Fallback';
      src: local('Arial'), local('Helvetica Neue'), local('sans-serif');
      ascent-override: 95%;
      descent-override: 25%;
      line-gap-override: 0%;
      size-adjust: 100%;
    }

    @font-face {
      font-family: 'Unbounded Fallback';
      src: local('Arial Black'), local('Impact'), local('sans-serif');
      ascent-override: 90%;
      descent-override: 22%;
      line-gap-override: 0%;
      size-adjust: 98%;
    }

    @font-face {
      font-family: 'JetBrains Mono Fallback';
      src: local('Courier New'), local('monospace');
      ascent-override: 85%;
      descent-override: 22%;
      line-gap-override: 0%;
      size-adjust: 98%;
    }

    :root {
      --background: #f8fafc;
      --text: #090e1a;
      --text-muted: #334155;
      --primary: #1d4ed8;
      --primary-rgb: 29, 78, 216;
      --card: #ffffff;
      --border: #cbd5e1;
      --radius: 14px;
      --font-sans: 'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, -apple-system, sans-serif;
      --font-display: 'Unbounded', 'Unbounded Fallback', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback', ui-monospace, monospace;
      --shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
    }

    body {
      background-color: var(--background);
      color: var(--text);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }

    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }

    /* Crisp sports scrollbars */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: var(--background); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Performance & CLS prevention rules */
    html { scroll-behavior: smooth; }
    
    /* Pre-dimension key structural nodes to prevent reflow during hydration */
    .site-header { min-height: 56px; }
    @media (min-width: 640px) { .site-header { min-height: 64px; } }

    .fixture-card { 
      contain: layout style;
      min-height: 150px;
    }
    .vote-poll-wrapper { 
      contain: layout style;
      min-height: 76px;
    }
    .tabular-nums, 
    .timer-digits-days, .timer-digits-hours, .timer-digits-minutes, .timer-digits-seconds,
    .timer-days, .timer-hours, .timer-minutes, .timer-seconds,
    .opt-pct, .vote-count-display { 
      font-variant-numeric: tabular-nums; 
    }

    /* Below-the-fold content visibility containment for fast mobile scrolling & 0 forced reflows */
    #odds-packs, #faq-section, #vip-packages, #expert-insights, #jackpot-section {
      content-visibility: auto;
      contain-intrinsic-size: 0 450px;
    }

    /* Accessibility focus indicators */
    a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 2px solid #2563eb !important;
      outline-offset: 2px !important;
    }

    /* Mobile touch target safety */
    @media (pointer: coarse) {
      button, a, input, select {
        touch-action: manipulation;
      }
    }
  </style>
</head>
<body class="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased selection:bg-[var(--primary)] selection:text-white transition-colors duration-500 pb-16">
  <?php if (function_exists('renderBodyStartTrackingTags')) echo renderBodyStartTrackingTags(); ?>


  <!-- Accessible Skip to Content Link (WCAG 2.1 AA) -->
  <a 
    href="#main-content" 
    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:font-mono focus:font-bold focus:text-xs focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
  >
    Skip to main content
  </a>

  <!-- Cheerplex Live Sports Intel Top Bar -->
  <aside aria-label="Live sports alerts" class="w-full bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 hidden sm:block">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 overflow-hidden text-[11px] sm:text-xs">
        <span class="inline-flex items-center gap-1.5 font-bold text-blue-400 shrink-0 tracking-wider font-mono">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          Cheerplex Latest Update:
        </span>
        <span class="truncate text-slate-300 font-medium">
          SportPesa Mega Jackpot is now Active 
        </span>
      </div>
      <div class="flex items-center gap-3 shrink-0 text-[11px] font-mono font-medium text-slate-400">
        <span class="flex items-center gap-1.5 text-blue-400">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Check Updated Tips
        </span>
        <span class="text-slate-700">|</span>
        <span class="text-slate-300">Kenya 18+ Responsible Play</span>
      </div>
    </div>
  </aside>

  <!-- MINIMALIST NAVIGATION BAR -->
  <header class="w-full border-b border-[var(--border)] bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
      
      <!-- Left: Clean Brand Logo & Mobile Toggle -->
      <div class="flex items-center gap-3">
        <button 
          id="mobileMenuBtn"
          type="button"
          aria-label="Open menu"
          class="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
        >
          <?= renderIcon('menu', 'w-5 h-5') ?>
        </button>
        
        <a 
          href="/"
          aria-label="Cheerplex Home"
          class="flex items-center gap-2.5 cursor-pointer no-underline text-left text-slate-900 select-none group"
        >
          <?= renderCheerplexLogo('emblem', 34, 'group-hover:scale-105 transition-transform duration-200 shadow-sm') ?>
          <span class="font-black text-lg tracking-tight text-slate-900 font-display">
            CHEER<span class="text-blue-400">PLEX</span>
          </span>
        </a>
      </div>

      <!-- Center: Minimalist Text Navigation -->
      <nav aria-label="Main navigation" class="hidden lg:flex items-center gap-7 text-xs font-medium">
        <a 
          href="/"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= $currentPage === 'home' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Home</span>
          <?php if ($currentPage === 'home'): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('category-today') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= in_array($currentPage, ['category-today', 'today']) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Today Tips</span>
          <?php if (in_array($currentPage, ['category-today', 'today'])): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('category-tomorrow') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= in_array($currentPage, ['category-tomorrow', 'tomorrow']) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Tomorrow</span>
          <?php if (in_array($currentPage, ['category-tomorrow', 'tomorrow'])): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('category-yesterday') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= in_array($currentPage, ['category-yesterday', 'yesterday']) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Yesterday</span>
          <?php if (in_array($currentPage, ['category-yesterday', 'yesterday'])): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('sportpesa-mega') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= $currentPage === 'sportpesa-mega' ? 'text-amber-500 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Mega JP</span>
          <?php if ($currentPage === 'sportpesa-mega'): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('sportpesa-midweek') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= in_array($currentPage, ['sportpesa-midweek', 'betika-midweek']) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Midweek</span>
          <?php if (in_array($currentPage, ['sportpesa-midweek', 'betika-midweek'])): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('jackpot-list') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= $currentPage === 'jackpot-list' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>All Jackpots</span>
          <?php if ($currentPage === 'jackpot-list'): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="<?= getPageUrl('vip-packages') ?>"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= in_array($currentPage, ['vip-packages', 'vip']) ? 'text-amber-500 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>VIP</span>
          <?php if (in_array($currentPage, ['vip-packages', 'vip'])): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          <?php endif; ?>
        </a>

        <a 
          href="/cheerplex-sure-tips-and-odds/"
          class="transition-colors no-underline cursor-pointer relative py-1 <?= ($currentPage === 'cheerplex-sure-tips-and-odds') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
        >
          <span>Odd Packs</span>
          <?php if ($currentPage === 'cheerplex-sure-tips-and-odds'): ?>
            <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
          <?php endif; ?>
        </a>
      </nav>

      <!-- Right: Join VIP -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onclick="openPaymentModal('One Week VIP', 800, 'vip-7day', 'vip')"
          class="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer border-none flex items-center gap-1.5 tracking-tight"
        >
          <?= renderIcon('crown', 'w-3.5 h-3.5 text-amber-300 shrink-0') ?>
          <span>Join VIP</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MOBILE DRAWER NAVIGATION OVERLAY -->
  <div id="mobileDrawerOverlay" class="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-[3px] transition-opacity duration-300 hidden opacity-0"></div>
  <aside id="mobileDrawer" class="fixed top-0 left-0 h-screen w-[320px] max-w-[85vw] flex-shrink-0 z-50 lg:hidden bg-white border-r border-[var(--border)] shadow-2xl flex flex-col justify-between -translate-x-full transition-transform duration-300 ease-in-out">
    <div class="flex flex-col h-full overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-5 text-left">
      <!-- Header & Close Button -->
      <div class="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
        <div class="flex items-center gap-2.5">
          <?= renderCheerplexLogo('emblem', 30, 'shadow-xs') ?>
          <div class="font-black text-base sm:text-lg tracking-tight text-slate-900 font-display">
            CHEERPLEX<span class="text-blue-600 font-mono text-xs font-bold ml-1">.KE</span>
          </div>
        </div>

        <button 
          id="closeMobileDrawerBtn"
          type="button"
          aria-label="Close menu drawer"
          class="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-none bg-transparent cursor-pointer transition-colors"
        >
          <?= renderIcon('x', 'w-5 h-5') ?>
        </button>
      </div>

      <!-- Top Jackpots Quick Links -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono tracking-wider text-slate-600 uppercase font-bold">
            Top Jackpots
          </span>
          <a 
            href="<?= getPageUrl('jackpot-list') ?>"
            aria-label="View all Kenyan jackpot predictions"
            class="text-[10px] font-mono font-bold text-blue-600 hover:underline cursor-pointer no-underline"
          >
            View All
          </a>
        </div>

        <div class="grid grid-cols-1 gap-1.5">
          <?php foreach ($topJackpotsMenu as $jp): ?>
            <a
              href="<?= $jp['url'] ?>"
              class="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-[var(--border)] hover:border-blue-400 transition-all flex items-center justify-between text-left cursor-pointer group no-underline"
            >
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <?= renderIcon('trophy', 'w-3.5 h-3.5') ?>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                    <?= e($jp['name']) ?>
                  </div>
                  <div class="text-[10px] font-mono text-slate-600">
                    <?= e($jp['games']) ?>
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <?= e($jp['prize']) ?>
                </span>
              </div>
            </a>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Navigation & Markets Group -->
      <div class="space-y-2">
        <span class="text-[10px] font-mono tracking-wider text-slate-600 uppercase font-bold block">
          Predictions & Markets
        </span>
        <nav class="space-y-1">
          <?php foreach ($marketChannelsMenu as $item): ?>
            <?php $isActive = $currentPage === $item['id']; ?>
            <a
              href="<?= $item['url'] ?>"
              class="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all no-underline cursor-pointer border <?= $isActive ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'border-transparent text-slate-900 hover:bg-slate-100' ?>"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <?= renderIcon($item['icon'], 'w-4 h-4 shrink-0 ' . ($isActive ? 'text-white' : 'text-blue-600')) ?>
                <span class="truncate"><?= e($item['label']) ?></span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded <?= $isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600' ?>">
                  <?= e($item['tag']) ?>
                </span>
                <?= renderIcon('chevron-right', 'w-3.5 h-3.5 ' . ($isActive ? 'text-white' : 'text-slate-400')) ?>
              </div>
            </a>
          <?php endforeach; ?>
        </nav>
      </div>

      <!-- WhatsApp Support Direct Button -->
      <div class="pt-2">
        <a
          href="https://wa.me/254740841375?text=Hello%20Cheerplex%20Support%2C%20I%20need%20assistance%20with%20predictions"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline transition-colors shadow-xs"
        >
          <?= renderIcon('message-square', 'w-4 h-4 text-white') ?>
          <span>WhatsApp Support (0740841375)</span>
        </a>
      </div>

      <!-- Trust Indicators Section -->
      <div class="border-t border-[var(--border)] pt-3.5 space-y-2">
        <div class="flex items-center gap-2 text-[11px] text-slate-600">
          <?= renderIcon('shield-check', 'w-3.5 h-3.5 text-blue-600 shrink-0') ?>
          <span>Safaricom M-Pesa Instant Verification</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-slate-600">
          <?= renderIcon('alert-triangle', 'w-3.5 h-3.5 text-amber-500 shrink-0') ?>
          <span>Responsible Gaming: Strictly 18+ Only</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- 3. CENTERED INTERACTIVE WORKSPACE (2-COLUMN ARCHITECTURAL GRID) -->
  <div class="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-[85vh] md:min-h-[1000px]">
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      
      <!-- MAIN CENTER DASHBOARD CONTAINER -->
      <main id="main-content" class="flex-1 w-full space-y-8 min-h-[650px] md:min-h-[850px] overflow-hidden">
