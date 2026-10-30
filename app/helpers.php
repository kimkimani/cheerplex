<?php
/**
 * Cheerplex - Core Helper Functions & Application Utilities
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/data.php';

/**
 * Safe HTML escaping
 */
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Render exact Cheerplex CP Emblem or Full Logo SVG
 */
function renderCheerplexLogo(string $variant = 'emblem', int|string $size = 34, string $className = '', bool $showDomain = true): string {
    $emblem = '<svg viewBox="0 0 512 512" width="' . $size . '" height="' . $size . '" class="shrink-0 select-none ' . e($className) . '" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cheerplex CP Logo">'
        . '<rect width="512" height="512" rx="112" fill="#1d4ed8" />'
        . '<path d="M 199 140 L 242 140 L 242 188 L 199 188 A 68 68 0 1 0 199 324 L 242 324 L 242 372 L 199 372 A 116 116 0 1 1 199 140 Z" fill="#ffffff" />'
        . '<path d="M 269 140 L 361 140 A 68 68 0 0 1 361 276 L 317 276 L 317 372 L 269 372 Z M 317 188 L 361 188 A 20 20 0 0 1 361 228 L 317 228 Z" fill="#ffffff" fill-rule="evenodd" />'
        . '</svg>';

    if ($variant === 'emblem') {
        return $emblem;
    }

    return '<div class="flex items-center gap-2.5 select-none ' . e($className) . '">'
        . $emblem
        . '<div class="flex flex-col text-left">'
        . '<span class="font-black text-lg sm:text-xl tracking-tight text-slate-900 font-display leading-tight flex items-baseline">'
        . 'CHEERPLEX'
        . ($showDomain ? '<span class="text-blue-600 font-mono text-xs font-bold ml-1">.KE</span>' : '')
        . '</span>'
        . '</div>'
        . '</div>';
}

/**
 * Render crisp Lucide SVG Icon
 */
function renderIcon(string $name, string $className = 'w-4 h-4', string $attrs = ''): string {
    $icons = [
        'crown' => '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
        'zap' => '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        'sparkles' => '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
        'trophy' => '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
        'flame' => '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
        'layers' => '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
        'menu' => '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
        'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'clock' => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'check' => '<path d="M20 6 9 17l-5-5"/>',
        'check-circle-2' => '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        'x-circle' => '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
        'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
        'chevron-down' => '<path d="m6 9 6 6 6-6"/>',
        'chevron-up' => '<path d="m18 15-6-6-6 6"/>',
        'users' => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'lock' => '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        'percent' => '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
        'shield-check' => '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
        'message-square' => '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        'send' => '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        'mail' => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'arrow-right' => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'calendar' => '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
        'history' => '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
        'trending-up' => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
        'star' => '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        'calculator' => '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
        'coins' => '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
        'alert-triangle' => '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
        'copy' => '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
        'home' => '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        'arrow-left' => '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
        'smartphone' => '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
        'badge-check' => '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
        'external-link' => '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        'phone-call' => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/>',
        'message-circle' => '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    ];

    $svgContent = $icons[$name] ?? '<circle cx="12" cy="12" r="10"/>';
    return '<svg class="' . e($className) . '" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" ' . $attrs . '>' . $svgContent . '</svg>';
}

/**
 * Get default external links
 */
function getDefaultExternalLinks(): array {
    return [
        ['id' => 1, 'anchorText' => 'Sokapedia Football Predictions', 'url' => 'https://sokapedia.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 2, 'anchorText' => 'Betwinner360 Predictions & Jackpot Tips', 'url' => 'https://betwinner360.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 3, 'anchorText' => 'Forebet Mathematical Football Predictions', 'url' => 'https://www.forebet.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 4, 'anchorText' => 'Cheerplex Soccer Predictions Today', 'url' => 'https://cheerplex.co.ke/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 5, 'anchorText' => 'Sunpel Soccer Predictions & Tips', 'url' => 'https://sunpel.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 6, 'anchorText' => 'Victorspredict Football Betting Tips', 'url' => 'https://victorspredict.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 7, 'anchorText' => 'Windrawwin Football Predictions & Stats', 'url' => 'https://www.windrawwin.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 8, 'anchorText' => 'Statarea Soccer Facts & Predictions', 'url' => 'https://www.statarea.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 9, 'anchorText' => 'Vitibet Free Football Tips & Tables', 'url' => 'https://www.vitibet.com/', 'target' => '_blank', 'rel' => 'noopener'],
        ['id' => 10, 'anchorText' => 'Flashscore Live Football Scores', 'url' => 'https://www.flashscore.com/', 'target' => '_blank', 'rel' => 'noopener'],
    ];
}

/**
 * Route Mapping Dictionary
 */
function getUrlMap(): array {
    return [
        '/'                                                            => 'home',
        '/home'                                                        => 'home',
        '/football-predictions-today'                                 => 'cheerplex-today-prediction',
        '/football-predictions-tomorrow'                              => 'cheerplex-tomorrow-prediction',
        '/football-predictions-yesterday'                             => 'cheerplex-yesterday-prediction',
        '/football-predictions-1x2-home-win'                          => 'cheerplex-1x2-prediction-tips',
        '/football-predictions-btts-gg'                               => 'cheerplex-gg-prediction-tips',
        '/football-predictions-over-1-5-goals'                        => 'category-over15',
        '/football-predictions-over-2-5-goals'                        => 'category-over25',
        '/football-predictions-double-chance'                         => 'category-doublechance',
        'cheerplex-jackpots-predictions-and-tips'                                               => 'jackpot-list',
        '/jackpots'                                                   => 'jackpot-list',
        '/cheerplex-jackpots-predictions-and-tips'                    => 'jackpot-list',
        '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega'     => 'sportpesa-mega',
        '/cheerplex-jackpots-predictions-and-tips/betika-midweek'      => 'betika-midweek',
        '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek'   => 'sportpesa-midweek',
        '/cheerplex-jackpots-predictions-and-tips/mozzart-grand'       => 'mozzart-grand',
        '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily' => 'mozzart-super-daily',
        '/sportybet-jackpot'                                          => 'sportybet',
        '/sportybet'                                                  => 'sportybet',
        '/free-sportpesa-mega-jackpot-prediction'                     => 'sportpesa-mega',
        '/sportpesa-mega-jackpot-prediction'                          => 'sportpesa-mega',
        '/cheerplex-mega-jackpot-prediction'                          => 'sportpesa-mega',
        '/free-sportpesa-midweek-jackpot-predictions-and-analysis'    => 'sportpesa-midweek',
        '/today-sportpesa-midweek-jackpot-prediction-and-tips'        => 'sportpesa-midweek',
        '/free-betika-midweek-jackpot-predictions-and-analysis'       => 'betika-midweek',
        '/free-mozzart-grand-jackpot-predictions-and-analysis'        => 'mozzart-grand',
        '/free-mozzart-super-daily-jackpot-predictions-and-analysis'  => 'mozzart-super-daily',
        '/vip-packages'                                               => 'cheerplex-vip-tips',
        '/vip-tips'                                                   => 'cheerplex-vip-tips',
        '/cheerplex-vip-tips'                                         => 'cheerplex-vip-tips',
        '/contact'                                                    => 'contact',
        '/contact-us'                                                 => 'contact',
        '/responsible-gambling'                                       => 'responsible-gambling',
        '/cheerplex-today-prediction'                    => 'cheerplex-today-prediction',
        '/cheerplex-tomorrow-prediction'                              => 'cheerplex-tomorrow-prediction',
        '/cheerplex-yesterday-prediction'                             => 'cheerplex-yesterday-prediction',
        '/cheerplex-1x2-prediction-tips'                              => 'cheerplex-1x2-prediction-tips',
        '/cheerplex-gg-prediction-tips'                               => 'cheerplex-gg-prediction-tips',
        '/cheerplex-free-predictions-and-tips'                        => 'cheerplex-free-predictions-and-tips',
        '/cheerplex-free-predictions-and-tips'                                     => 'cheerplex-free-predictions-and-tips',
        '/cheerplex-sure-tips-and-odds'                               => 'cheerplex-sure-tips-and-odds',
    ];
}

/**
 * Returns canonical link for a given pageId
 */
function getPageUrl(string $pageId): string {
    $reverseMap = [
        'home'                                          => '/',
        'category-today'                                => '/cheerplex-today-prediction/',
        'category-tomorrow'                             => '/cheerplex-tomorrow-prediction/',
        'category-yesterday'                            => '/cheerplex-yesterday-prediction/',
        'category-homewin'                              => '/cheerplex-1x2-prediction-tips/',
        'category-btts'                                 => '/cheerplex-gg-prediction-tips/',
        'category-over15'                               => '/football-predictions-over-1-5-goals/',
        'category-over25'                               => '/football-predictions-over-2-5-goals/',
        'category-doublechance'                         => '/football-predictions-double-chance/',
        'jackpot-list'                                  => '/cheerplex-jackpots-predictions-and-tips/',
        'cheerplex-jackpots-predictions-and-tips'       => '/cheerplex-jackpots-predictions-and-tips/',
        'sportpesa-mega'                                => '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/',
        'sportpesa-midweek'                             => '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/',
        'betika-midweek'                                => '/cheerplex-jackpots-predictions-and-tips/betika-midweek/',
        'mozzart-grand'                                 => '/cheerplex-jackpots-predictions-and-tips/mozzart-grand/',
        'mozzart-super-daily'                           => '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily/',
        'vip-packages'                                  => '/cheerplex-vip-tips/',
        'vip'                                           => '/cheerplex-vip-tips/',
        'cheerplex-vip-tips'                            => '/cheerplex-vip-tips/',
        'contact'                                       => '/contact-us/',
        'contact-us'                                    => '/contact-us/',
        'responsible-gambling'                          => '/responsible-gambling/',
        'cheerplex-today-prediction'       => '/cheerplex-today-prediction/',
        'cheerplex-tomorrow-prediction'                 => '/cheerplex-tomorrow-prediction/',
        'cheerplex-yesterday-prediction'                => '/cheerplex-yesterday-prediction/',
        'cheerplex-1x2-prediction-tips'                 => '/cheerplex-1x2-prediction-tips/',
        'cheerplex-gg-prediction-tips'                  => '/cheerplex-gg-prediction-tips/',
        'cheerplex-free-predictions-and-tips'           => '/cheerplex-free-predictions-and-tips/',
        'cheerplex-free-predictions-and-tips'                        => '/cheerplex-free-predictions-and-tips/',
        'cheerplex-sure-tips-and-odds'                  => '/cheerplex-sure-tips-and-odds/',
    ];
    if (isset($reverseMap[$pageId])) {
        return $reverseMap[$pageId];
    }

    // Check if markdown file specifies custom link
    if (function_exists('loadMarkdownPage')) {
        $md = loadMarkdownPage($pageId);
        if ($md && !empty($md['frontmatter']['link'])) {
            return '/' . trim($md['frontmatter']['link'], '/');
        }
    }

    return '/' . ltrim($pageId, '/');
}

/**
 * Resolve Request URI to pageId
 */
function resolveRoute(string $uri): string {
    $path = parse_url($uri, PHP_URL_PATH);
    $path = '/' . trim($path, '/');
    if ($path === '//') $path = '/';

    $map = getUrlMap();
    if (isset($map[$path])) {
        return $map[$path];
    }

    $altPath = rtrim($path, '/');
    if (isset($map[$altPath])) {
        return $map[$altPath];
    }

    // Direct check for jackpot IDs
    $raw = ltrim($path, '/');
    if (in_array($raw, ['sportpesa-mega', 'sportpesa-midweek', 'betika-midweek', 'mozzart-grand', 'mozzart-super-daily'])) {
        return $raw;
    }

    // Check markdown file existence directly by slug
    $pagesDir = __DIR__ . '/../src/content/pages';
    if (file_exists($pagesDir . '/' . $raw . '.md')) {
        return $raw;
    }

    // Scan src/content/pages for custom frontmatter link paths
    if (is_dir($pagesDir)) {
        $files = scandir($pagesDir);
        foreach ($files as $file) {
            if (substr($file, -3) === '.md') {
                $baseKey = substr($file, 0, -3);
                $content = file_get_contents($pagesDir . '/' . $file, false, null, 0, 1024);
                if (preg_match('/^(?:link|Link):\s*["\']?(.*?)["\']?$/m', $content, $lm)) {
                    $l = '/' . trim(trim($lm[1]), '/');
                    if ($l === $path || $l === $altPath || ($l . '/') === $path) {
                        return $baseKey;
                    }
                }
            }
        }
    }

    return 'home';
}

/**
 * Normalizes user-specified category inputs to canonical category IDs
 */
function normalizeCategorySlug(string $category): string {
    $norm = strtolower(trim($category));
    $map = [
        'today'                        => 'category-today',
        'tomorrow'                     => 'category-tomorrow',
        'yesterday'                    => 'category-yesterday',
        'over15'                       => 'category-over15',
        'over-1-5'                     => 'category-over15',
        'over-1.5'                     => 'category-over15',
        'over25'                       => 'category-over25',
        'over-2-5'                     => 'category-over25',
        'over-2.5'                     => 'category-over25',
        'btts'                         => 'category-btts',
        'gg'                           => 'category-btts',
        'both-teams-to-score'          => 'category-btts',
        'homewin'                      => 'category-homewin',
        'home-win'                     => 'category-homewin',
        '1x2'                          => 'category-homewin',
        'doublechance'                 => 'category-doublechance',
        'double-chance'                => 'category-doublechance',
        'dc'                           => 'category-doublechance',
    ];
    return $map[$norm] ?? $norm;
}

/**
 * Get Page Metadata
 */
function getMetadata(string $pageId): array {
    global $PAGE_METADATA;
    if (isset($PAGE_METADATA[$pageId])) {
        return $PAGE_METADATA[$pageId];
    }

    $defaultTitle = 'Cheerplex - Football Prediction and Free Jackpot Tips';
    $defaultDesc = 'Cheerplex.co.ke - Premier Kenyan football predictions, 1X2 tips, GG/BTTS, multi-tier sure odds, and jackpot predictions for SportPesa, Betika, Mozzart, Odibets, Betpawa, and SportyBet.';

    // Check if page corresponds to a markdown file
    if (function_exists('loadMarkdownPage')) {
        $md = loadMarkdownPage($pageId);
        if ($md) {
            $fm = $md['frontmatter'] ?? [];
            return [
                'pageKey'      => $pageId,
                'title'        => $fm['title'] ?? $md['title'] ?? $defaultTitle,
                'displayTitle' => $fm['displayTitle'] ?? $fm['title'] ?? $md['displayTitle'] ?? $defaultTitle,
                'description'  => $fm['description'] ?? $md['description'] ?? $defaultDesc,
                'keywords'     => $fm['keywords'] ?? $md['keywords'] ?? 'cheerplex, football predictions, betting tips',
                'link'         => $fm['link'] ?? getPageUrl($pageId),
            ];
        }
    }

    return [
        'pageKey'      => $pageId,
        'title'        => $defaultTitle,
        'displayTitle' => $defaultTitle,
        'description'  => $defaultDesc,
        'link'         => getPageUrl($pageId),
    ];
}

/**
 * Dynamic XML Sitemap Generator
 * Exclusively scans the pages/links represented by the markdown files in src/content/pages/*.md.
 * No phantom URLs, no database/view guesses — strictly markdown-backed canonical pages.
 */
function generatePhpSitemapXml(): string {
    $baseUrl = 'https://cheerplex.co.ke';
    $pagesDir = __DIR__ . '/../src/content/pages';
    if (!is_dir($pagesDir)) {
        $pagesDir = __DIR__ . '/src/content/pages';
    }

    $urls = [];
    $todayIso = (new DateTime('now', new DateTimeZone('Africa/Nairobi')))->format('Y-m-d\TH:i:sP');

    if (is_dir($pagesDir)) {
        $files = scandir($pagesDir);
        foreach ($files as $f) {
            if (substr($f, -3) !== '.md') {
                continue;
            }

            $base = substr($f, 0, -3);
            $fullPath = $pagesDir . '/' . $f;
            $stat = stat($fullPath);
            $mtime = $stat['mtime'] ?? time();
            $mtimeIso = (new DateTime('@' . $mtime))->setTimezone(new DateTimeZone('Africa/Nairobi'))->format('Y-m-d\TH:i:sP');

            $content = file_get_contents($fullPath);

            // 1. Extract link from frontmatter
            $link = null;
            if (preg_match('/^(?:link|Link):\s*["\']?(.*?)["\']?$/m', $content, $lm)) {
                $rawLink = trim($lm[1]);
                if (!empty($rawLink)) {
                    $link = $rawLink;
                }
            }

            // Fallback link if not in frontmatter
            if ($link === null) {
                if ($base === 'home') {
                    $link = '/';
                } else {
                    $link = '/' . $base . '/';
                }
            }

            // Normalize canonical path: root is '/', any other page starts with '/' and ends with '/'
            $link = trim($link);
            if ($link === '' || $link === '/') {
                $path = '/';
                $loc = "{$baseUrl}/";
            } else {
                $trimmedPath = trim($link, '/');
                $path = '/' . $trimmedPath . '/';
                $loc = "{$baseUrl}{$path}";
            }

            // 2. Extract type from frontmatter
            $type = 'category';
            if (preg_match('/^(?:type|Type):\s*["\']?(.*?)["\']?$/m', $content, $tm)) {
                $type = strtolower(trim($tm[1]));
            }

            // 3. Extract lastmod / dateModified if explicitly provided in frontmatter
            $lastmod = $mtimeIso;
            if (preg_match('/^(?:lastmod|dateModified|date):\s*["\']?(.*?)["\']?$/m', $content, $dm)) {
                $rawDate = trim($dm[1]);
                try {
                    $dt = new DateTime($rawDate);
                    $lastmod = $dt->format('Y-m-d\TH:i:sP');
                } catch (\Throwable $e) {}
            }

            // If it is home or today\'s predictions page, use today\'s timestamp to signal fresh tips
            if ($path === '/' || strpos($path, 'today') !== false || strpos($path, 'betting-tips') !== false) {
                $lastmod = $todayIso;
            }

            // 4. Calibrate priority and changefreq based on markdown attributes
            if ($path === '/') {
                $priority = '1.0';
                $changefreq = 'daily';
            } elseif ($type === 'category' || strpos($path, 'today') !== false || strpos($path, 'betting-tips') !== false) {
                $priority = '0.9';
                $changefreq = 'daily';
            } elseif (strpos($path, 'tomorrow') !== false || strpos($path, 'yesterday') !== false) {
                $priority = '0.8';
                $changefreq = 'daily';
            } elseif ($type === 'jackpot-list' || $path === '/cheerplex-jackpots-predictions-and-tips/') {
                $priority = '0.8';
                $changefreq = 'weekly';
            } elseif ($type === 'jackpot' || strpos($path, 'jackpot') !== false) {
                $priority = (strpos($path, 'mega') !== false || strpos($path, 'sportpesa') !== false || strpos($path, 'betika') !== false) ? '0.8' : '0.7';
                $changefreq = 'weekly';
            } elseif ($type === 'odds-hub' || $path === '/cheerplex-sure-tips-and-odds/') {
                $priority = '0.8';
                $changefreq = 'weekly';
            } elseif ($type === 'odds-pack' || strpos($path, 'odds-') !== false) {
                $priority = '0.7';
                $changefreq = 'weekly';
            } elseif ($type === 'vip' || strpos($path, 'vip') !== false) {
                $priority = '0.8';
                $changefreq = 'weekly';
            } elseif (strpos($path, 'contact') !== false) {
                $priority = '0.8';
                $changefreq = 'weekly';
            } elseif (strpos($path, 'responsible-gambling') !== false) {
                $priority = '0.6';
                $changefreq = 'monthly';
            } else {
                $priority = '0.7';
                $changefreq = 'weekly';
            }

            // Deduplicate: if already added (e.g. jackpot-list.md and cheerplex-jackpots-predictions-and-tips.md),
            // keep the entry with higher priority
            if (isset($urls[$path])) {
                if ((float)$priority > (float)$urls[$path]['priority']) {
                    $urls[$path] = [
                        'loc'        => $loc,
                        'lastmod'    => $lastmod,
                        'changefreq' => $changefreq,
                        'priority'   => $priority,
                        'pageKey'    => $base,
                    ];
                }
            } else {
                $urls[$path] = [
                    'loc'        => $loc,
                    'lastmod'    => $lastmod,
                    'changefreq' => $changefreq,
                    'priority'   => $priority,
                    'pageKey'    => $base,
                ];
            }
        }
    }

    // Sort entries: Home first, then alphabetical by path
    uksort($urls, function($a, $b) {
        if ($a === '/') return -1;
        if ($b === '/') return 1;
        return strcmp($a, $b);
    });

    $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    foreach ($urls as $u) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($u['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
        $xml .= "    <lastmod>" . $u['lastmod'] . "</lastmod>\n";
        $xml .= "    <changefreq>" . $u['changefreq'] . "</changefreq>\n";
        $xml .= "    <priority>" . $u['priority'] . "</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= "</urlset>";

    // Mirror to public/sitemap.xml so the static file stays 100% synchronized
    $pubPath = __DIR__ . '/../public/sitemap.xml';
    @file_put_contents($pubPath, $xml);

    return $xml;
}

/**
 * Remote Backend API Fetcher with File-Based Caching, Fast Timeouts, and Circuit Breaker
 * Prevents max execution time errors on local XAMPP and slow network connections.
 */
function fetchRemoteApi(string $endpoint, int $ttl = 60, string $method = 'GET', ?array $postData = null): ?array {
    // If remote API is explicitly disabled (e.g. running on local XAMPP/localhost), return null instantly
    if (defined('ENABLE_REMOTE_API') && !ENABLE_REMOTE_API) {
        return null;
    }

    $cacheDir = sys_get_temp_dir() . '/cheerplex_cache';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }

    $cacheKey = md5($endpoint);
    $cacheFile = $cacheDir . '/' . $cacheKey . '.json';
    $circuitFlagFile = $cacheDir . '/circuit_offline.flag';
    static $circuitTripped = false;

    // Circuit Breaker: If remote API previously timed out or failed in the last 120s, skip outgoing cURL
    if ($circuitTripped || (file_exists($circuitFlagFile) && (time() - filemtime($circuitFlagFile) < 120))) {
        $circuitTripped = true;
        if (file_exists($cacheFile)) {
            $cached = @file_get_contents($cacheFile);
            $data = json_decode($cached, true);
            if (is_array($data)) return $data;
        }
        return null;
    }

    // Check fresh cache first before attempting network
    if ($ttl > 0 && file_exists($cacheFile) && (time() - filemtime($cacheFile) < $ttl)) {
        $cached = @file_get_contents($cacheFile);
        $data = json_decode($cached, true);
        if (is_array($data) && !empty($data)) {
            return $data;
        }
    }

    $baseUrl = defined('BACKEND_API_URL') ? BACKEND_API_URL : 'https://cheerplex.co.ke/soka_king';
    $url = rtrim($baseUrl, '/') . '/' . ltrim($endpoint, '/');

    // For POST requests, execute directly with strict 2-second timeout
    if (strtoupper($method) === 'POST') {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            $payload = json_encode($postData ?? []);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_TIMEOUT        => 2,
                CURLOPT_CONNECTTIMEOUT => 1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_NOSIGNAL       => 1,
                CURLOPT_IPRESOLVE      => defined('CURL_IPRESOLVE_V4') ? CURL_IPRESOLVE_V4 : 1,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'User-Agent: CheerplexPHP/2.0'
                ]
            ]);
            $response = curl_exec($ch);
            $err = curl_errno($ch);
            curl_close($ch);
            if ($err || $response === false) {
                $circuitTripped = true;
                @file_put_contents($circuitFlagFile, (string)time());
                return null;
            }
            if (!empty($response)) {
                $decoded = json_decode($response, true);
                if (is_array($decoded)) return $decoded;
            }
        }
        return null;
    }

    // GET requests with strict 1s connect timeout, 2s execution timeout, and IPv4 resolution
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 2,
            CURLOPT_CONNECTTIMEOUT => 1,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_NOSIGNAL       => 1,
            CURLOPT_IPRESOLVE      => defined('CURL_IPRESOLVE_V4') ? CURL_IPRESOLVE_V4 : 1,
            CURLOPT_HTTPHEADER     => [
                'Accept: application/json',
                'User-Agent: CheerplexPHP/2.0'
            ]
        ]);
        $response = curl_exec($ch);
        $err = curl_errno($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($err || $response === false || $code !== 200 || empty($response)) {
            // Trip circuit breaker immediately so subsequent calls don't hang
            $circuitTripped = true;
            @file_put_contents($circuitFlagFile, (string)time());

            if (file_exists($cacheFile)) {
                $cached = @file_get_contents($cacheFile);
                $data = json_decode($cached, true);
                if (is_array($data)) return $data;
            }
            return null;
        }

        $data = json_decode($response, true);
        if (is_array($data)) {
            if ($ttl > 0) {
                @file_put_contents($cacheFile, $response);
            }
            return $data;
        }
    } else {
        $ctx = stream_context_create([
            'http' => ['timeout' => 2, 'header' => "Accept: application/json\r\nUser-Agent: CheerplexPHP/2.0\r\n"]
        ]);
        $response = @file_get_contents($url, false, $ctx);
        if (!empty($response)) {
            $data = json_decode($response, true);
            if (is_array($data)) {
                if ($ttl > 0) {
                    @file_put_contents($cacheFile, $response);
                }
                return $data;
            }
        } else {
            $circuitTripped = true;
            @file_put_contents($circuitFlagFile, (string)time());
        }
    }

    // Fall back to stale cache if network failed
    if (file_exists($cacheFile)) {
        $cached = @file_get_contents($cacheFile);
        $data = json_decode($cached, true);
        if (is_array($data)) return $data;
    }

    return null;
}

/**
 * Evaluates whether a fixture's prediction won or lost based on actual fulltime scores and status.
 */
function evaluateFixtureResult(array $f): string {
    $homeRaw = $f['homeScore'] ?? $f['fullTimeHome'] ?? $f['full_time_home'] ?? null;
    $awayRaw = $f['awayScore'] ?? $f['fullTimeAway'] ?? $f['full_time_away'] ?? null;
    $status = strtoupper(trim((string)($f['status'] ?? $f['status_short'] ?? '')));
    $existingResult = strtolower(trim((string)($f['result'] ?? '')));

    $hasValidScore = is_numeric($homeRaw) && is_numeric($awayRaw);
    $isFinishedStatus = in_array($status, ['FT', 'AET', 'AP', 'PEN', 'FINISHED'], true);

    if ($hasValidScore && ($isFinishedStatus || $existingResult === 'won' || $existingResult === 'lost')) {
        $h = (int)$homeRaw;
        $a = (int)$awayRaw;
        $total = $h + $a;
        $pred = strtolower(trim((string)($f['prediction'] ?? $f['tip'] ?? '')));

        if (strpos($pred, '1x') !== false || strpos($pred, 'x1') !== false || strpos($pred, 'dc1x') !== false || strpos($pred, 'home or draw') !== false) {
            return $h >= $a ? 'won' : 'lost';
        }
        if (strpos($pred, 'x2') !== false || strpos($pred, '2x') !== false || strpos($pred, 'dcx2') !== false || strpos($pred, 'draw or away') !== false) {
            return $a >= $h ? 'won' : 'lost';
        }
        if (strpos($pred, '12') !== false || strpos($pred, '21') !== false || strpos($pred, 'dc12') !== false || strpos($pred, 'home or away') !== false) {
            return $h !== $a ? 'won' : 'lost';
        }
        if (strpos($pred, 'over 1.5') !== false || strpos($pred, 'ov 1.5') !== false || strpos($pred, 'ov1.5') !== false || strpos($pred, 'o1.5') !== false || strpos($pred, 'o 1.5') !== false || strpos($pred, '2+') !== false) {
            return $total >= 2 ? 'won' : 'lost';
        }
        if (strpos($pred, 'under 1.5') !== false || strpos($pred, 'un 1.5') !== false || strpos($pred, 'u1.5') !== false) {
            return $total < 2 ? 'won' : 'lost';
        }
        if (strpos($pred, 'over 2.5') !== false || strpos($pred, 'ov 2.5') !== false || strpos($pred, 'ov2.5') !== false || strpos($pred, 'o2.5') !== false || strpos($pred, 'o 2.5') !== false || strpos($pred, '3+') !== false) {
            return $total >= 3 ? 'won' : 'lost';
        }
        if (strpos($pred, 'under 2.5') !== false || strpos($pred, 'un 2.5') !== false || strpos($pred, 'un2.5') !== false || strpos($pred, 'u2.5') !== false || strpos($pred, 'u 2.5') !== false) {
            return $total < 3 ? 'won' : 'lost';
        }
        if (strpos($pred, 'over 3.5') !== false || strpos($pred, 'ov 3.5') !== false || strpos($pred, 'o3.5') !== false) {
            return $total >= 4 ? 'won' : 'lost';
        }
        if (strpos($pred, 'under 3.5') !== false || strpos($pred, 'un 3.5') !== false || strpos($pred, 'u3.5') !== false) {
            return $total < 4 ? 'won' : 'lost';
        }
        if (strpos($pred, 'no gg') !== false || strpos($pred, 'ng') !== false || strpos($pred, 'btts - no') !== false || strpos($pred, 'btts no') !== false) {
            return ($h === 0 || $a === 0) ? 'won' : 'lost';
        }
        if (strpos($pred, 'gg') !== false || strpos($pred, 'btts') !== false || strpos($pred, 'both teams') !== false) {
            return ($h > 0 && $a > 0) ? 'won' : 'lost';
        }
        if ($pred === '1' || strpos($pred, '(1)') !== false || strpos($pred, 'home') !== false) {
            return $h > $a ? 'won' : 'lost';
        }
        if ($pred === '2' || strpos($pred, '(2)') !== false || strpos($pred, 'away') !== false) {
            return $a > $h ? 'won' : 'lost';
        }
        if ($pred === 'x' || strpos($pred, '(x)') !== false || strpos($pred, 'draw') !== false) {
            return $h === $a ? 'won' : 'lost';
        }
    }

    if ($existingResult === 'won' || $existingResult === 'lost') {
        return $existingResult;
    }

    if ($isFinishedStatus) {
        return 'lost';
    }

    return 'pending';
}

/**
 * Get All Predictions from Database or Remote API
 * Strictly returns genuine database records with NO local dummy fixtures.
 */
function getAllPredictions(): array {
    global $PREDICTIONS;
    // 1. If DATA_SOURCE is 'database', query MySQL direct connection
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $sql = "SELECT 
                            f.fixture_id AS id,
                            f.fixture_id AS fixtureRef,
                            f.home_team_name AS homeTeam,
                            f.away_team_name AS awayTeam,
                            f.home_team_logo AS homeTeamLogo,
                            f.away_team_logo AS awayTeamLogo,
                            f.league_name AS leagueName,
                            f.league_country AS countryName,
                            f.country_flag AS countryFlag,
                            f.country_flag AS leagueFlag,
                            f.date AS kickoffTime,
                            f.prediction_type AS prediction,
                            f.status_short AS status,
                            f.status_long AS statusLong,
                            f.status_elapsed AS statusElapsed,
                            f.popular_status AS popularStatus,
                            f.ai_analysis AS aiAnalysis,
                            fs.fulltime_home AS homeScore,
                            fs.fulltime_away AS awayScore,
                            pp.percent_pred_home AS homeProbability,
                            pp.percent_pred_draw AS drawProbability,
                            pp.percent_pred_away AS awayProbability
                        FROM fixtures f
                        LEFT JOIN fixture_scores fs ON f.fixture_id = fs.fixture_ref
                        LEFT JOIN prediction_probabilities pp ON f.fixture_id = pp.fixture_ref
                        ORDER BY f.date DESC";
                $stmt = $pdo->query($sql);
                $rows = $stmt ? $stmt->fetchAll() : [];
                if (!empty($rows)) {
                    return array_map(function($r) {
                        $hp = (int)preg_replace('/[^0-9]/', '', $r['homeProbability'] ?? '45');
                        $dp = (int)preg_replace('/[^0-9]/', '', $r['drawProbability'] ?? '28');
                        $ap = (int)preg_replace('/[^0-9]/', '', $r['awayProbability'] ?? '27');
                        $r['confidence'] = max(65, min(95, $hp > 0 ? (int)round(55 + ($hp * 0.35)) : 78));
                        $r['probabilities'] = [
                            'home' => $hp > 0 ? $hp . '%' : '45%',
                            'draw' => $dp > 0 ? $dp . '%' : '28%',
                            'away' => $ap > 0 ? $ap . '%' : '27%',
                        ];
                        $r['result'] = evaluateFixtureResult($r);
                        return $r;
                    }, $rows);
                }
            } catch (\Throwable $e) {}
        }
    }

    // 2. Fetch directly from remote Backend API (cheerplex.co.ke/soka_king/api/predictions)
    $remoteData = fetchRemoteApi('/api/predictions');
    if (!empty($remoteData) && is_array($remoteData)) {
        return array_map(function($r) {
            if (is_array($r)) {
                $r['result'] = evaluateFixtureResult($r);
            }
            return $r;
        }, $remoteData);
    }

    // 3. Fallback to preloaded real predictions pool
    if (!empty($PREDICTIONS) && is_array($PREDICTIONS)) {
        return array_map(function($r) {
            if (is_array($r)) {
                $r['result'] = evaluateFixtureResult($r);
            }
            return $r;
        }, $PREDICTIONS);
    }

    return [];
}

/**
 * Deduplicate fixtures and sort them with the most latest date first,
 * and earliest kickoff time within the same date.
 */
function sortFixturesByLatestDate(array $fixtures): array {
    if (empty($fixtures)) return [];
    $deduped = [];
    $seen = [];
    foreach ($fixtures as $idx => $f) {
        if (!$f) continue;
        $idKey = (string)($f['id'] ?? $f['fixtureRef'] ?? (($f['homeTeam'] ?? '') . '-' . ($f['awayTeam'] ?? '')) ?: ('fix-' . $idx));
        if (!isset($seen[$idKey])) {
            $seen[$idKey] = true;
            $deduped[] = $f;
        }
    }

    usort($deduped, function($a, $b) {
        $koA = $a['kickoffTime'] ?? $a['date'] ?? '';
        $koB = $b['kickoffTime'] ?? $b['date'] ?? '';
        $dateA = substr($koA, 0, 10);
        $dateB = substr($koB, 0, 10);
        if ($dateA !== $dateB) {
            return strcmp($dateB, $dateA); // Most latest date first
        }
        return strcmp($koA, $koB); // Earliest kickoff within the same day
    });

    return $deduped;
}

/**
 * Checks whether a prediction string matches a specific category
 */
function matchesPredictionCategory(string $pred, string $category): bool {
    $p = strtolower(trim($pred));
    $norm = normalizeCategorySlug(strtolower(trim($category)));

    if ($norm === 'category-over25' || $norm === 'cheerplex-free-predictions-and-tips') {
        return (
            strpos($p, 'over 2.5') !== false ||
            strpos($p, 'ov 2.5') !== false ||
            strpos($p, 'over25') !== false ||
            strpos($p, 'ov 25') !== false ||
            strpos($p, 'o2.5') !== false ||
            strpos($p, 'o 2.5') !== false ||
            strpos($p, '2.5 goals') !== false ||
            strpos($p, '3+ goals') !== false ||
            strpos($p, '3+') !== false ||
            $p === 'over 2.5' ||
            $p === 'o25'
        );
    }

    if ($norm === 'category-over15' || $norm === 'cheerplex-sure-tips-and-odds') {
        return (
            strpos($p, 'over 1.5') !== false ||
            strpos($p, 'ov 1.5') !== false ||
            strpos($p, 'over15') !== false ||
            strpos($p, 'ov 15') !== false ||
            strpos($p, 'o1.5') !== false ||
            strpos($p, 'o 1.5') !== false ||
            strpos($p, '1.5 goals') !== false ||
            strpos($p, '2+ goals') !== false ||
            strpos($p, '2+') !== false ||
            $p === 'over 1.5' ||
            $p === 'o15'
        );
    }

    if ($norm === 'category-btts' || $norm === 'cheerplex-gg-prediction-tips') {
        return (
            strpos($p, 'btts') !== false ||
            strpos($p, 'gg') !== false ||
            strpos($p, 'both teams') !== false ||
            strpos($p, 'goal goal') !== false ||
            strpos($p, 'gg/ng') !== false ||
            $p === 'gg' ||
            $p === 'btts (gg)'
        );
    }

    if ($norm === 'category-doublechance' || $norm === 'cheerplex-free-predictions-and-tips') {
        return (
            strpos($p, 'double chance') !== false ||
            strpos($p, '1x') !== false ||
            strpos($p, 'x2') !== false ||
            strpos($p, '12') !== false ||
            strpos($p, 'dc') !== false ||
            strpos($p, 'double') !== false
        );
    }

    if ($norm === 'category-homewin' || $norm === 'cheerplex-1x2-prediction-tips') {
        return (
            strpos($p, 'home win') !== false ||
            strpos($p, 'home') !== false ||
            strpos($p, '1x2') !== false ||
            $p === '1' ||
            strpos($p, '1 (home') !== false ||
            strpos($p, 'draw (x)') !== false ||
            strpos($p, 'away win (2)') !== false ||
            $p === 'x' ||
            $p === '2'
        );
    }

    return true;
}

/**
 * Filter fixtures strictly by Date tab (Today, Tomorrow, Yesterday) in Nairobi EAT Timezone.
 * Returns empty array if no fixtures exist for the requested date. No dummy data.
 */
function getFixturesByDate(string $targetDate = 'today'): array {
    $all = getAllPredictions();
    if (empty($all)) {
        return [];
    }

    $now = new DateTime('now', new DateTimeZone('Africa/Nairobi'));

    if ($targetDate === 'yesterday') {
        $now->modify('-1 day');
    } elseif ($targetDate === 'tomorrow') {
        $now->modify('+1 day');
    }

    $targetDateStr = $now->format('Y-m-d');
    $filtered = [];

    foreach ($all as $f) {
        $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
        if (substr($ko, 0, 10) === $targetDateStr) {
            $filtered[] = $f;
        }
    }

    // For yesterday page: if strict calendar yesterday has no records in DB yet,
    // resolve the latest settled past matchday from the database so Yesterday stats are calculated from real settled matches of that date.
    if ($targetDate === 'yesterday' && empty($filtered)) {
        $todayStr = (new DateTime('now', new DateTimeZone('Africa/Nairobi')))->format('Y-m-d');
        $latestPastDate = '';
        foreach ($all as $f) {
            $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
            $dStr = substr($ko, 0, 10);
            if ($dStr !== '' && $dStr < $todayStr && strcmp($dStr, $latestPastDate) > 0) {
                $latestPastDate = $dStr;
            }
        }
        if ($latestPastDate !== '') {
            foreach ($all as $f) {
                $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
                if (substr($ko, 0, 10) === $latestPastDate) {
                    $filtered[] = $f;
                }
            }
        }
    }

    return sortFixturesByLatestDate($filtered);
}

/**
 * Filter fixtures strictly by Category.
 * For markets like 1x2, over 1.5, over 2.5, btts, double chance:
 * Groups fixtures across available matchdays starting from the latest date.
 */
function getFixturesByCategory(string $category): array {
    $norm = normalizeCategorySlug(strtolower(trim($category)));

    if ($norm === 'category-today' || $norm === 'cheerplex-today-prediction' || $norm === 'today' || $norm === 'chearplex-prediction') {
        return getFixturesByDate('today');
    }
    if ($norm === 'category-tomorrow' || $norm === 'cheerplex-tomorrow-prediction' || $norm === 'tomorrow') {
        return getFixturesByDate('tomorrow');
    }
    if ($norm === 'category-yesterday' || $norm === 'cheerplex-yesterday-prediction' || $norm === 'yesterday') {
        $fixtures = getFixturesByDate('yesterday');
        return sortFixturesByLatestDate($fixtures);
    }

    $all = getAllPredictions();
    if (empty($all)) {
        return [];
    }

    $res = [];
    foreach ($all as $f) {
        $pred = strtolower(trim($f['prediction'] ?? ''));
        if (matchesPredictionCategory($pred, $norm)) {
            $res[] = $f;
        }
    }

    return sortFixturesByLatestDate($res);
}

/**
 * Get Top Banker match of the Day.
 * Strictly selects ONLY from Today's fixtures in Africa/Nairobi timezone,
 * picks the single match with the highest confidence, tie-broken deterministically,
 * and maintains the exact same selection throughout the day without falling back to other days.
 */
function getTopBanker(?array $fixtures = null): ?array {
    static $cachedTodayBanker = null;
    static $cachedTodayResolved = false;

    if ($cachedTodayResolved) {
        return $cachedTodayBanker;
    }

    $todayStr = (new DateTime('now', new DateTimeZone('Africa/Nairobi')))->format('Y-m-d');
    $todayFixtures = getFixturesByDate('today');

    // Filter strictly to ensure the match kickoff belongs to today
    $todayOnly = [];
    foreach ($todayFixtures as $f) {
        $ko = $f['kickoffTime'] ?? $f['date'] ?? '';
        if (substr($ko, 0, 10) === $todayStr) {
            $todayOnly[] = $f;
        }
    }

    if (empty($todayOnly)) {
        $cachedTodayResolved = true;
        $cachedTodayBanker = null;
        return null;
    }

    // Deterministically sort Today's matches by highest confidence, tie-broken by fixture ID/team names
    usort($todayOnly, function($a, $b) {
        $confA = (int)($a['confidence'] ?? 75);
        $confB = (int)($b['confidence'] ?? 75);
        if ($confB !== $confA) {
            return $confB <=> $confA;
        }
        $idA = (string)($a['id'] ?? $a['fixtureRef'] ?? (($a['homeTeam'] ?? '') . '-' . ($a['awayTeam'] ?? '')));
        $idB = (string)($b['id'] ?? $b['fixtureRef'] ?? (($b['homeTeam'] ?? '') . '-' . ($b['awayTeam'] ?? '')));
        return strcmp($idA, $idB);
    });

    $cachedTodayBanker = $todayOnly[0] ?? null;
    $cachedTodayResolved = true;

    return $cachedTodayBanker;
}

/**
 * Get Curated 3-leg Accumulator
 */
function getCuratedAccumulator(array $fixtures): array {
    if (empty($fixtures)) {
        return [];
    }

    $picks = [];
    foreach ($fixtures as $f) {
        $conf = (int)($f['confidence'] ?? 75);
        if ($conf >= 78 && count($picks) < 3) {
            $picks[] = $f;
        }
    }
    if (count($picks) < 3 && count($fixtures) >= 3) {
        $picks = array_slice($fixtures, 0, 3);
    }
    return $picks;
}

/**
 * Local SQLite storage fallback for votes and polling
 */
function getVoteStoragePdo(): ?PDO {
    static $sqlitePdo = null;
    if ($sqlitePdo === null) {
        try {
            $cacheDir = sys_get_temp_dir() . '/cheerplex_cache';
            if (!is_dir($cacheDir)) @mkdir($cacheDir, 0777, true);
            $dbPath = $cacheDir . '/votes.sqlite';
            $sqlitePdo = new PDO('sqlite:' . $dbPath);
            $sqlitePdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
            $sqlitePdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $sqlitePdo->exec("CREATE TABLE IF NOT EXISTS prediction_votes (
                fixture_id TEXT,
                user_id TEXT,
                vote_choice TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(fixture_id, user_id)
            )");
            $sqlitePdo->exec("CREATE TABLE IF NOT EXISTS fixture_vote_counts (
                fixture_id TEXT PRIMARY KEY,
                total_votes INTEGER DEFAULT 0,
                votes_1 INTEGER DEFAULT 0,
                votes_x INTEGER DEFAULT 0,
                votes_2 INTEGER DEFAULT 0
            )");
        } catch (\Throwable $e) {
            $sqlitePdo = null;
        }
    }
    return $sqlitePdo;
}

/**
 * Get Real Database Vote Stats for a Fixture
 * Prioritizes local SQLite and MySQL database for sub-millisecond retrieval,
 * avoiding N+1 remote network requests during page rendering loops.
 */
function getFixtureVoteStats(string|int $fixtureId, string $userId = 'guest', bool $queryRemote = false): array {
    $fId = (string)$fixtureId;

    // 1. Direct MySQL Connection mode (if explicitly configured)
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $stmt = $pdo->prepare("SELECT * FROM fixture_vote_counts WHERE fixture_id = ?");
                $stmt->execute([$fId]);
                $r = $stmt->fetch();

                $stmtUser = $pdo->prepare("SELECT vote_choice FROM prediction_votes WHERE fixture_id = ? AND user_id = ?");
                $stmtUser->execute([$fId, $userId]);
                $userRow = $stmtUser->fetch();
                $userVote = $userRow ? $userRow['vote_choice'] : null;

                if ($r && (int)($r['total_votes'] ?? 0) >= 0) {
                    $total = (int)($r['total_votes'] ?? 0);
                    $v1 = (int)($r['votes_1'] ?? 0);
                    $vX = (int)($r['votes_x'] ?? 0);
                    $v2 = (int)($r['votes_2'] ?? 0);
                    $hPct = $total > 0 ? (int)round(($v1 / $total) * 100) : 0;
                    $dPct = $total > 0 ? (int)round(($vX / $total) * 100) : 0;
                    $aPct = $total > 0 ? max(0, 100 - $hPct - $dPct) : 0;

                    return [
                        'fixtureId'   => $fId,
                        'totalVotes'  => $total,
                        'votes1'      => $v1,
                        'votesX'      => $vX,
                        'votes2'      => $v2,
                        'homePercent' => $hPct,
                        'drawPercent' => $dPct,
                        'awayPercent' => $aPct,
                        'userVote'    => $userVote,
                    ];
                }
            } catch (\Throwable $e) {}
        }
    }

    // 2. Fast local SQLite storage (0ms latency, eliminates N+1 network requests during page render)
    $sPdo = getVoteStoragePdo();
    if ($sPdo) {
        try {
            $stmt = $sPdo->prepare("SELECT * FROM fixture_vote_counts WHERE fixture_id = ?");
            $stmt->execute([$fId]);
            $r = $stmt->fetch();

            $stmtUser = $sPdo->prepare("SELECT vote_choice FROM prediction_votes WHERE fixture_id = ? AND user_id = ?");
            $stmtUser->execute([$fId, $userId]);
            $uVal = $stmtUser->fetchColumn();
            $userVote = $uVal !== false ? $uVal : null;

            if ($r && (int)($r['total_votes'] ?? 0) > 0) {
                $total = (int)$r['total_votes'];
                $v1 = (int)$r['votes_1'];
                $vX = (int)$r['votes_x'];
                $v2 = (int)$r['votes_2'];
                $hPct = $total > 0 ? (int)round(($v1 / $total) * 100) : 0;
                $dPct = $total > 0 ? (int)round(($vX / $total) * 100) : 0;
                $aPct = $total > 0 ? max(0, 100 - $hPct - $dPct) : 0;

                return [
                    'fixtureId'   => $fId,
                    'totalVotes'  => $total,
                    'votes1'      => $v1,
                    'votesX'      => $vX,
                    'votes2'      => $v2,
                    'homePercent' => $hPct,
                    'drawPercent' => $dPct,
                    'awayPercent' => $aPct,
                    'userVote'    => $userVote,
                ];
            }
        } catch (\Throwable $e) {}
    }

    // 3. Remote API Query: ONLY if explicitly requested (e.g. single-fixture AJAX vote lookup) and remote API enabled
    if ($queryRemote && defined('ENABLE_REMOTE_API') && ENABLE_REMOTE_API) {
        $endpoint = '/api/predictions/vote?fixtureId=' . urlencode($fId) . '&userId=' . urlencode($userId);
        $remote = fetchRemoteApi($endpoint, 10);
        if (!empty($remote) && is_array($remote) && isset($remote['totalVotes'])) {
            $total = (int)($remote['totalVotes'] ?? 0);
            $v1 = (int)($remote['votes1'] ?? 0);
            $vX = (int)($remote['votesX'] ?? 0);
            $v2 = (int)($remote['votes2'] ?? 0);

            // Sync to local SQLite
            if ($sPdo) {
                try {
                    $stmtSync = $sPdo->prepare("INSERT INTO fixture_vote_counts (fixture_id, total_votes, votes_1, votes_x, votes_2)
                        VALUES (?, ?, ?, ?, ?)
                        ON CONFLICT(fixture_id) DO UPDATE SET total_votes = excluded.total_votes, votes_1 = excluded.votes_1, votes_x = excluded.votes_x, votes_2 = excluded.votes_2");
                    $stmtSync->execute([$fId, $total, $v1, $vX, $v2]);
                } catch (\Throwable $e) {}
            }

            return [
                'fixtureId'   => $fId,
                'totalVotes'  => $total,
                'votes1'      => $v1,
                'votesX'      => $vX,
                'votes2'      => $v2,
                'homePercent' => (int)($remote['homePercent'] ?? 0),
                'drawPercent' => (int)($remote['drawPercent'] ?? 0),
                'awayPercent' => (int)($remote['awayPercent'] ?? 0),
                'userVote'    => $remote['userVote'] ?? null,
            ];
        }
    }

    return [
        'fixtureId'   => $fId,
        'totalVotes'  => 0,
        'votes1'      => 0,
        'votesX'      => 0,
        'votes2'      => 0,
        'homePercent' => 0,
        'drawPercent' => 0,
        'awayPercent' => 0,
        'userVote'    => null,
    ];
}

/**
 * Record a Real Database Vote
 * Accurately handles new votes and vote switching across backend API, MySQL, and SQLite.
 */
function recordFixtureVote(string|int $fixtureId, string $userId, string $vote): array {
    $fId = (string)$fixtureId;
    $vUpper = strtoupper(trim($vote));

    $c1 = ($vUpper === '1' || $vUpper === '1X' || strpos($vUpper, 'OVER') !== false || $vUpper === 'GG') ? 1 : 0;
    $cX = ($vUpper === 'X' || $vUpper === '12' || $vUpper === 'DRAW') ? 1 : 0;
    $c2 = ($vUpper === '2' || $vUpper === 'X2' || strpos($vUpper, 'UNDER') !== false || $vUpper === 'NG') ? 1 : 0;

    // 1. MySQL direct connection mode
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS `prediction_votes` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `fixture_id` VARCHAR(255) NOT NULL,
                    `user_id` VARCHAR(255) NOT NULL,
                    `vote_choice` VARCHAR(50) NOT NULL,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY `uniq_user_fixture` (`user_id`, `fixture_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

                $pdo->exec("CREATE TABLE IF NOT EXISTS `fixture_vote_counts` (
                    `fixture_id` VARCHAR(255) PRIMARY KEY,
                    `total_votes` INT DEFAULT 0,
                    `votes_1` INT DEFAULT 0,
                    `votes_x` INT DEFAULT 0,
                    `votes_2` INT DEFAULT 0,
                    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

                // Check previous vote
                $stmtPrev = $pdo->prepare("SELECT vote_choice FROM prediction_votes WHERE fixture_id = ? AND user_id = ?");
                $stmtPrev->execute([$fId, $userId]);
                $prevChoice = $stmtPrev->fetchColumn();

                if ($prevChoice === false) {
                    // New user vote: increment total and specific choice
                    $stmt = $pdo->prepare("INSERT INTO prediction_votes (fixture_id, user_id, vote_choice) VALUES (?, ?, ?)");
                    $stmt->execute([$fId, $userId, $vote]);

                    $stmtCount = $pdo->prepare("INSERT INTO fixture_vote_counts (fixture_id, total_votes, votes_1, votes_x, votes_2)
                        VALUES (?, 1, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE total_votes = total_votes + 1, votes_1 = votes_1 + ?, votes_x = votes_x + ?, votes_2 = votes_2 + ?");
                    $stmtCount->execute([$fId, $c1, $cX, $c2, $c1, $cX, $c2]);
                } else if ($prevChoice !== $vote) {
                    // User changed vote: decrement old choice, increment new choice
                    $prevUpper = strtoupper(trim($prevChoice));
                    $old1 = ($prevUpper === '1' || $prevUpper === '1X' || strpos($prevUpper, 'OVER') !== false || $prevUpper === 'GG') ? 1 : 0;
                    $oldX = ($prevUpper === 'X' || $prevUpper === '12' || $prevUpper === 'DRAW') ? 1 : 0;
                    $old2 = ($prevUpper === '2' || $prevUpper === 'X2' || strpos($prevUpper, 'UNDER') !== false || $prevUpper === 'NG') ? 1 : 0;

                    $stmt = $pdo->prepare("UPDATE prediction_votes SET vote_choice = ? WHERE fixture_id = ? AND user_id = ?");
                    $stmt->execute([$vote, $fId, $userId]);

                    $stmtCount = $pdo->prepare("UPDATE fixture_vote_counts SET
                        votes_1 = GREATEST(0, votes_1 - ? + ?),
                        votes_x = GREATEST(0, votes_x - ? + ?),
                        votes_2 = GREATEST(0, votes_2 - ? + ?)
                        WHERE fixture_id = ?");
                    $stmtCount->execute([$old1, $c1, $oldX, $cX, $old2, $c2, $fId]);
                }

                return [
                    'success' => true,
                    'stats'   => getFixtureVoteStats($fId, $userId)
                ];
            } catch (\Throwable $e) {}
        }
    }

    // 2. Remote Backend API (Matches React app)
    $remote = fetchRemoteApi('/api/predictions/vote', 0, 'POST', [
        'fixtureId' => $fId,
        'userId'    => $userId,
        'vote'      => $vote
    ]);

    if (!empty($remote) && is_array($remote)) {
        $stats = $remote['stats'] ?? $remote;
        if (isset($stats['totalVotes'])) {
            // Sync to local SQLite as well
            $sPdo = getVoteStoragePdo();
            if ($sPdo) {
                try {
                    $sPdo->prepare("INSERT INTO prediction_votes (fixture_id, user_id, vote_choice)
                        VALUES (?, ?, ?)
                        ON CONFLICT(fixture_id, user_id) DO UPDATE SET vote_choice = excluded.vote_choice")
                        ->execute([$fId, $userId, $vote]);

                    $sPdo->prepare("INSERT INTO fixture_vote_counts (fixture_id, total_votes, votes_1, votes_x, votes_2)
                        VALUES (?, ?, ?, ?, ?)
                        ON CONFLICT(fixture_id) DO UPDATE SET total_votes = excluded.total_votes, votes_1 = excluded.votes_1, votes_x = excluded.votes_x, votes_2 = excluded.votes_2")
                        ->execute([$fId, (int)$stats['totalVotes'], (int)($stats['votes1'] ?? 0), (int)($stats['votesX'] ?? 0), (int)($stats['votes2'] ?? 0)]);
                } catch (\Throwable $e) {}
            }

            return [
                'success' => true,
                'stats'   => $stats
            ];
        }
    }

    // 3. Local SQLite fallback if remote API is unreachable
    $sPdo = getVoteStoragePdo();
    if ($sPdo) {
        try {
            $stmtUser = $sPdo->prepare("SELECT vote_choice FROM prediction_votes WHERE fixture_id = ? AND user_id = ?");
            $stmtUser->execute([$fId, $userId]);
            $prev = $stmtUser->fetchColumn();

            $stmt = $sPdo->prepare("INSERT INTO prediction_votes (fixture_id, user_id, vote_choice) VALUES (?, ?, ?) ON CONFLICT(fixture_id, user_id) DO UPDATE SET vote_choice = excluded.vote_choice");
            $stmt->execute([$fId, $userId, $vote]);

            if ($prev === false) {
                $stmtCount = $sPdo->prepare("INSERT INTO fixture_vote_counts (fixture_id, total_votes, votes_1, votes_x, votes_2) VALUES (?, 1, ?, ?, ?) ON CONFLICT(fixture_id) DO UPDATE SET total_votes = total_votes + 1, votes_1 = votes_1 + ?, votes_x = votes_x + ?, votes_2 = votes_2 + ?");
                $stmtCount->execute([$fId, $c1, $cX, $c2, $c1, $cX, $c2]);
            } else if ($prev !== $vote) {
                $prevUpper = strtoupper(trim($prev));
                $old1 = ($prevUpper === '1' || $prevUpper === '1X' || strpos($prevUpper, 'OVER') !== false || $prevUpper === 'GG') ? 1 : 0;
                $oldX = ($prevUpper === 'X' || $prevUpper === '12' || $prevUpper === 'DRAW') ? 1 : 0;
                $old2 = ($prevUpper === '2' || $prevUpper === 'X2' || strpos($prevUpper, 'UNDER') !== false || $prevUpper === 'NG') ? 1 : 0;

                $stmtCount = $sPdo->prepare("UPDATE fixture_vote_counts SET
                    votes_1 = MAX(0, votes_1 - ? + ?),
                    votes_x = MAX(0, votes_x - ? + ?),
                    votes_2 = MAX(0, votes_2 - ? + ?)
                    WHERE fixture_id = ?");
                $stmtCount->execute([$old1, $c1, $oldX, $cX, $old2, $c2, $fId]);
            }
        } catch (\Throwable $e) {}
    }

    return [
        'success' => true,
        'stats'   => getFixtureVoteStats($fId, $userId)
    ];
}

/**
 * Save Contact Inquiry Message to Database / API
 */
function saveContactMessage(array $data): array {
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? $data['phone'] ?? '');
    $subject = trim($data['subject'] ?? 'General Support Ticket');
    $message = trim($data['message'] ?? '');

    // 1. MySQL direct connection mode
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS `contact_messages` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `name` VARCHAR(255) NOT NULL,
                    `email` VARCHAR(255) NOT NULL,
                    `subject` VARCHAR(255) DEFAULT '',
                    `message` TEXT NOT NULL,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $subject, $message]);
                return [
                    'success' => true,
                    'message' => 'Message submitted successfully'
                ];
            } catch (\Throwable $e) {}
        }
    }

    // 2. Save locally in SQLite cache for reliable persistence
    try {
        $cacheDir = sys_get_temp_dir() . '/cheerplex_cache';
        if (!is_dir($cacheDir)) @mkdir($cacheDir, 0777, true);
        $sPdo = new PDO('sqlite:' . $cacheDir . '/contacts.sqlite');
        $sPdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
        $sPdo->exec("CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        $stmt = $sPdo->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $subject, $message]);
    } catch (\Throwable $e) {}

    // 3. Forward to remote API
    $remote = fetchRemoteApi('/api/contact', 0, 'POST', [
        'name'    => $name,
        'email'   => $email,
        'subject' => $subject,
        'message' => $message,
    ]);

    if (!empty($remote) && is_array($remote) && !empty($remote['success'])) {
        return $remote;
    }

    return [
        'success' => true,
        'message' => 'Message submitted successfully'
    ];
}

/**
 * Get All Jackpots with calculated dynamic timings
 */
function getAllJackpots(): array {
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $stmt = $pdo->query("SELECT * FROM jackpots ORDER BY id ASC");
                $rows = $stmt ? $stmt->fetchAll() : [];
                if (!empty($rows)) {
                    return $rows;
                }
            } catch (\Throwable $e) {}
        }
    }

    $remoteData = fetchRemoteApi('/api/jackpots');
    if (!empty($remoteData) && is_array($remoteData)) {
        return $remoteData;
    }

    return [];
}

/**
 * Get Jackpot By ID with all its fixtures from SQL or Live API
 */
function getJackpotDetails(string $id): ?array {
    $jackpots = getAllJackpots();
    $found = null;

    foreach ($jackpots as $j) {
        if ($j['id'] === $id || $j['slug'] === $id) {
            $found = $j;
            break;
        }
    }

    if (!$found) return null;

    $tableMap = [
        'sportpesa-mega'     => 'sportpesa_mega_jackpot',
        'sportpesa-midweek'  => 'sportpesa_midweek_jackpot',
        'betika-midweek'     => 'betika_midweek_jackpot',
        'mozzart-grand'      => 'mozzart_bet_grand_jackpot',
        'mozzart-super-daily'=> 'mozzart_super_daily'
    ];

    $fixtures = [];
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && isset($tableMap[$id])) {
            try {
                $tbl = $tableMap[$id];
                $stmt = $pdo->query("SELECT * FROM {$tbl} ORDER BY jackpot_position ASC, id ASC");
                $sqlFixtures = $stmt ? $stmt->fetchAll() : [];
                if (!empty($sqlFixtures)) {
                    $fixtures = array_map(function($g) {
                        $pos = (int)($g['jackpot_position'] ?? $g['position'] ?? 1);
                        $tip = $g['jackpot_tip'] ?? $g['prediction'] ?? 'Home Win (1)';
                        return [
                            'id' => (int)($g['id'] ?? $pos),
                            'fixtureNumber' => $pos,
                            'position' => $pos,
                            'homeTeam' => $g['home_team_name'] ?? 'Home Team',
                            'awayTeam' => $g['away_team_name'] ?? 'Away Team',
                            'homeTeamLogo' => $g['home_team_logo'] ?? '',
                            'awayTeamLogo' => $g['away_team_logo'] ?? '',
                            'leagueName' => $g['league_name'] ?? 'League',
                            'countryName' => $g['country_name'] ?? 'International',
                            'countryFlag' => $g['country_flag'] ?? '',
                            'prediction' => $tip,
                            'tip' => $tip,
                            'confidence' => (int)($g['confidence'] ?? 80),
                            'status' => $g['status_short'] ?? 'NS',
                            'homeScore' => $g['full_time_home'] ?? '-',
                            'awayScore' => $g['full_time_away'] ?? '-',
                            'kickoffTime' => $g['date'] ?? date('Y-m-d H:i:s'),
                            'aiAnalysis' => $g['ai_analysis'] ?? 'Mathematical models indicate high probability for the selected outcome based on form and tactical alignment.'
                        ];
                    }, $sqlFixtures);
                }
            } catch (\Throwable $e) {}
        }
    }

    // Preserve live API fixtures when not in DB mode or when DB query returned empty
    if (empty($fixtures)) {
        if (!empty($found['fixtures']) && is_array($found['fixtures'])) {
            $fixtures = $found['fixtures'];
        } elseif (!empty($found['games']) && is_array($found['games'])) {
            $fixtures = $found['games'];
        }
    }

    $found['fixtures'] = $fixtures;
    return $found;
}

/**
 * Calculate dynamic timing, countdown target, and status for a jackpot
 * Reconciles strictly with React getJackpotDetailedTiming & topJackpotFixtures.
 */
function getJackpotTiming(string $jackpotId, array $fixtures = []): array {
    $now = new DateTime('now', new DateTimeZone('Africa/Nairobi'));
    $nowTs = $now->getTimestamp();

    // If fixtures weren't supplied, attempt to get them from jackpot details
    if (empty($fixtures)) {
        $jackpots = getAllJackpots();
        foreach ($jackpots as $j) {
            if ($j['id'] === $jackpotId || ($j['slug'] ?? '') === $jackpotId) {
                $fixtures = $j['fixtures'] ?? $j['games'] ?? [];
                break;
            }
        }
    }

    $foundEarliestTs = null;
    $foundLatestTs = null;
    $firstFixture = null;
    $lastFixture = null;

    if (!empty($fixtures)) {
        foreach ($fixtures as $idx => $f) {
            $rawTime = $f['kickoffTime'] ?? $f['date'] ?? $f['kickoff_time'] ?? $f['time'] ?? null;
            if (!$rawTime) continue;
            try {
                $d = new DateTime($rawTime, new DateTimeZone('Africa/Nairobi'));
                $ts = $d->getTimestamp();
                if ($foundEarliestTs === null || $ts < $foundEarliestTs) {
                    $foundEarliestTs = $ts;
                    $firstFixture = $f;
                    $firstFixture['position'] = $f['position'] ?? $f['fixtureNumber'] ?? ($idx + 1);
                }
                if ($foundLatestTs === null || $ts > $foundLatestTs) {
                    $foundLatestTs = $ts;
                    $lastFixture = $f;
                    $lastFixture['position'] = $f['position'] ?? $f['fixtureNumber'] ?? ($idx + 1);
                }
            } catch (\Throwable $e) {}
        }
    }

    if ($foundEarliestTs !== null && $foundLatestTs !== null) {
        $earliestTs = $foundEarliestTs;
        $latestTs = $foundLatestTs;
        $conclusionTs = $latestTs + (2 * 3600); // Concluded 2 hours after last kickoff

        $earliestDt = (new DateTime('@' . $earliestTs))->setTimezone(new DateTimeZone('Africa/Nairobi'));
        $latestDt = (new DateTime('@' . $latestTs))->setTimezone(new DateTimeZone('Africa/Nairobi'));

        $formattedEarliest = $earliestDt->format('D, j M H:i') . ' EAT';
        $formattedLatest = $latestDt->format('D, j M H:i') . ' EAT';

        if ($nowTs >= $conclusionTs) {
            $hasEnded = true;
            $hasStarted = false;
            $status = 'ended';
            $startsText = "First Game: {$formattedEarliest} • Final Game: {$formattedLatest}";
            $timerLabel = 'Pool Completed & Closed';
            $targetCountdownTs = 0;
            $badgeText = 'Completed and Closed';
            $badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold';
        } elseif ($nowTs >= $earliestTs) {
            $hasEnded = false;
            $hasStarted = true;
            $status = 'started';
            $startsText = "First Game: {$formattedEarliest} • Final Game: {$formattedLatest}";
            $targetCountdownTs = ($nowTs < $latestTs) ? $latestTs : $conclusionTs;
            $timerLabel = ($nowTs < $latestTs) ? 'Final Match Kicks Off In:' : 'Pool Window Concluding In:';
            $badgeText = 'Live In Progress';
            $badgeClass = 'bg-amber-400 text-slate-950 border border-amber-500 font-black animate-pulse';
        } else {
            $hasEnded = false;
            $hasStarted = false;
            $status = 'upcoming';
            $startsText = "First Game: {$formattedEarliest}";
            $targetCountdownTs = $earliestTs;
            $timerLabel = 'Kickoff Closes In:';
            $badgeText = 'Open • Not started';
            $badgeClass = 'bg-emerald-700 text-white border border-emerald-700 font-bold';
        }

        return [
            'earliestTime'       => $earliestTs,
            'latestTime'         => $latestTs,
            'formattedEarliest'  => $formattedEarliest,
            'formattedLatest'    => $formattedLatest,
            'hasStarted'         => $hasStarted,
            'hasEnded'           => $hasEnded,
            'status'             => $status,
            'startsText'         => $startsText,
            'timerLabel'         => $timerLabel,
            'targetCountdownTs'  => $targetCountdownTs,
            'firstFixture'       => $firstFixture,
            'lastFixture'        => $lastFixture,
            'statusBadge'        => [
                'badgeText'  => $badgeText,
                'badgeClass' => $badgeClass
            ]
        ];
    }

    // Fallback if no fixtures have valid dates
    $currentDay = (int)$now->format('w'); // 0=Sun, 6=Sat
    $targetDay = 6;
    $targetHour = 16;
    $targetMinute = 30;

    $idLower = strtolower($jackpotId);
    if (strpos($idLower, 'sportpesa-mega') !== false) {
        $targetDay = 6; $targetHour = 16; $targetMinute = 30;
    } elseif (strpos($idLower, 'sportpesa-midweek') !== false) {
        $targetDay = 2; $targetHour = 18; $targetMinute = 0;
    } elseif (strpos($idLower, 'betika-midweek') !== false) {
        $targetDay = 3; $targetHour = 17; $targetMinute = 0;
    } elseif (strpos($idLower, 'mozzart-grand') !== false) {
        $targetDay = 6; $targetHour = 13; $targetMinute = 30;
    } elseif (strpos($idLower, 'mozzart-super-daily') !== false || strpos($idLower, 'daily') !== false) {
        $targetDay = $currentDay; $targetHour = 18; $targetMinute = 0;
    }

    $daysAhead = ($targetDay - $currentDay + 7) % 7;
    $currHour = (int)$now->format('H');
    $currMin = (int)$now->format('i');
    if ($daysAhead === 0 && ($currHour > $targetHour || ($currHour === $targetHour && $currMin >= $targetMinute))) {
        $daysAhead = (strpos($idLower, 'daily') !== false) ? 1 : 7;
    }

    $targetDate = clone $now;
    $targetDate->modify("+{$daysAhead} days");
    $targetDate->setTime($targetHour, $targetMinute, 0);

    $earliestTs = $targetDate->getTimestamp();
    $latestTs = $earliestTs + (28 * 3600);

    $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $formattedEarliest = $dayNames[$targetDay] . ', ' . sprintf('%02d:%02d EAT', $targetHour, $targetMinute);
    $formattedLatest = $dayNames[($targetDay + 1) % 7] . ', 22:00 EAT';

    return [
        'earliestTime'       => $earliestTs,
        'latestTime'         => $latestTs,
        'formattedEarliest'  => $formattedEarliest,
        'formattedLatest'    => $formattedLatest,
        'hasStarted'         => false,
        'hasEnded'           => false,
        'status'             => 'upcoming',
        'startsText'         => "First Game: {$formattedEarliest}",
        'timerLabel'         => 'Kickoff Closes In:',
        'targetCountdownTs'  => $earliestTs,
        'firstFixture'       => null,
        'lastFixture'        => null,
        'statusBadge'        => [
            'badgeText'  => 'Open • Not started',
            'badgeClass' => 'bg-emerald-700 text-white border border-emerald-700 font-bold'
        ]
    ];
}

/**
 * Get VIP Packages
 */
function getVipPackages(): array {
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $stmt = $pdo->query("SELECT * FROM vip_packages ORDER BY price ASC");
                $rows = $stmt ? $stmt->fetchAll() : [];
                if (!empty($rows)) {
                    return array_map(function($r) {
                        if (isset($r['features']) && is_string($r['features'])) {
                            $r['features'] = json_decode($r['features'], true);
                        }
                        return $r;
                    }, $rows);
                }
            } catch (\Throwable $e) {}
        }
    }

    $remoteData = fetchRemoteApi('/api/vip-packages');
    if (!empty($remoteData) && is_array($remoteData)) {
        return array_map(function($r) {
            if (isset($r['features']) && is_string($r['features'])) {
                $r['features'] = json_decode($r['features'], true);
            }
            return $r;
        }, $remoteData);
    }

    return [];
}

/**
 * Get Odds Packs
 */
function getOddsPacks(): array {
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $stmt = $pdo->query("SELECT * FROM odds_packs ORDER BY price ASC");
                $rows = $stmt ? $stmt->fetchAll() : [];
                if (!empty($rows)) {
                    return $rows;
                }
            } catch (\Throwable $e) {}
        }
    }

    $remoteData = fetchRemoteApi('/api/odds-packs');
    if (!empty($remoteData) && is_array($remoteData)) {
        return $remoteData;
    }

    global $ODDS_PACKS;
    if (!empty($ODDS_PACKS)) {
        return $ODDS_PACKS;
    }

    return [];
}

/**
 * Get External / Partner Links from Database or API
 * Strictly returns verified links with anchorText and url. No dummy data.
 */
function getExternalLinks(): array {
    if (defined('DATA_SOURCE') && DATA_SOURCE === 'database') {
        $pdo = DB::getConnection();
        if ($pdo && DB::getDriverName() === 'mysql') {
            try {
                $stmt = $pdo->query("SELECT * FROM external_links WHERE is_active = 1 ORDER BY id ASC");
                $rows = $stmt ? $stmt->fetchAll() : [];
                if (!empty($rows)) {
                    $valid = array_values(array_filter($rows, function($r) {
                        $anchor = trim($r['anchorText'] ?? $r['anchor_text'] ?? '');
                        $url = trim($r['url'] ?? '');
                        return !empty($anchor) && !empty($url);
                    }));
                    if (!empty($valid)) return $valid;
                }
            } catch (\Throwable $e) {}
        }
    }

    $remote = fetchRemoteApi('/api/external-links');
    if (!empty($remote) && is_array($remote)) {
        $valid = array_values(array_filter($remote, function($r) {
            $anchor = trim($r['anchorText'] ?? $r['anchor_text'] ?? '');
            $url = trim($r['url'] ?? '');
            return !empty($anchor) && !empty($url);
        }));
        return $valid;
    }

    return [];
}

/**
 * Format Kickoff in Nairobi Time (EAT)
 */
function formatTimeEAT(?string $dateStr): string {
    if (!$dateStr) return '17:00 EAT';
    try {
        $d = new DateTime($dateStr);
        return $d->format('H:i') . ' EAT';
    } catch (\Throwable $e) {
        return '17:00 EAT';
    }
}

/**
 * Get Country Flag CDN URL
 */
function getCountryFlagUrl(?string $countryName, ?string $flag = null): ?string {
    $targetFlag = trim($flag ?? '');
    if ($targetFlag && (
        strpos($targetFlag, 'http://') === 0 ||
        strpos($targetFlag, 'https://') === 0 ||
        strpos($targetFlag, '//') === 0 ||
        strpos($targetFlag, '/') === 0
    )) {
        return $targetFlag;
    }
    $key = strtolower(trim($countryName ?: ($flag ?: '')));
    if (!$key) return null;

    $flagMap = [
        'england' => 'https://flagcdn.com/w40/gb-eng.png',
        'scotland' => 'https://flagcdn.com/w40/gb-sct.png',
        'wales' => 'https://flagcdn.com/w40/gb-wls.png',
        'spain' => 'https://flagcdn.com/w40/es.png',
        'italy' => 'https://flagcdn.com/w40/it.png',
        'france' => 'https://flagcdn.com/w40/fr.png',
        'germany' => 'https://flagcdn.com/w40/de.png',
        'netherlands' => 'https://flagcdn.com/w40/nl.png',
        'portugal' => 'https://flagcdn.com/w40/pt.png',
        'brazil' => 'https://flagcdn.com/w40/br.png',
        'argentina' => 'https://flagcdn.com/w40/ar.png',
        'kenya' => 'https://flagcdn.com/w40/ke.png',
        'turkey' => 'https://flagcdn.com/w40/tr.png',
        'usa' => 'https://flagcdn.com/w40/us.png',
        'sweden' => 'https://flagcdn.com/w40/se.png',
        'denmark' => 'https://flagcdn.com/w40/dk.png',
        'romania' => 'https://flagcdn.com/w40/ro.png',
        'bulgaria' => 'https://flagcdn.com/w40/bg.png',
        'cyprus' => 'https://flagcdn.com/w40/cy.png',
        'ireland' => 'https://flagcdn.com/w40/ie.png',
        'norway' => 'https://flagcdn.com/w40/no.png',
        'belgium' => 'https://flagcdn.com/w40/be.png',
        'poland' => 'https://flagcdn.com/w40/pl.png',
        'europe' => 'https://flagcdn.com/w40/eu.png',
        'world' => 'https://flagcdn.com/w40/un.png',
    ];
    return $flagMap[$key] ?? null;
}

/**
 * Get Country Emoji Fallback
 */
function getCountryEmoji(?string $countryName, ?string $flag = null): string {
    $key = strtolower(trim($countryName ?: ($flag ?: '')));
    $emojiMap = [
        'england' => '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'scotland' => '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'wales' => '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        'spain' => '🇪🇸',
        'italy' => '🇮🇹',
        'france' => '🇫🇷',
        'germany' => '🇩🇪',
        'netherlands' => '🇳🇱',
        'portugal' => '🇵🇹',
        'brazil' => '🇧🇷',
        'argentina' => '🇦🇷',
        'kenya' => '🇰🇪',
        'turkey' => '🇹🇷',
        'usa' => '🇺🇸',
        'sweden' => '🇸🇪',
        'denmark' => '🇩🇰',
        'norway' => '🇳🇴',
        'belgium' => '🇧🇪',
        'poland' => '🇵🇱',
        'europe' => '🇪🇺',
        'world' => '🌐',
    ];
    $flagLen = $flag ? (function_exists('mb_strlen') ? mb_strlen($flag) : strlen($flag)) : 0;
    return $emojiMap[$key] ?? ($flag && $flagLen <= 4 ? $flag : '⚽');
}

/**
 * Resolve Country Name from Fixture
 */
function resolveFixtureCountry(array $fixture): string {
    if (!empty($fixture['countryName'])) return trim($fixture['countryName']);
    if (!empty($fixture['leagueCountry'])) return trim($fixture['leagueCountry']);
    if (!empty($fixture['country'])) return trim($fixture['country']);
    $league = strtolower($fixture['leagueName'] ?? '');
    if (strpos($league, 'premier') !== false || strpos($league, 'championship') !== false || strpos($league, 'fa cup') !== false || strpos($league, 'league one') !== false) return 'England';
    if (strpos($league, 'la liga') !== false || strpos($league, 'copa del rey') !== false || strpos($league, 'segunda') !== false) return 'Spain';
    if (strpos($league, 'serie a') !== false || strpos($league, 'serie b') !== false || strpos($league, 'coppa') !== false) return 'Italy';
    if (strpos($league, 'bundesliga') !== false) return 'Germany';
    if (strpos($league, 'ligue 1') !== false || strpos($league, 'ligue 2') !== false) return 'France';
    if (strpos($league, 'eredivisie') !== false) return 'Netherlands';
    if (strpos($league, 'primeira') !== false) return 'Portugal';
    if (strpos($league, 'scottish') !== false) return 'Scotland';
    if (strpos($league, 'champions league') !== false || strpos($league, 'europa') !== false || strpos($league, 'conference') !== false) return 'Europe';
    return 'Europe';
}

/**
 * Render Flag Image matching React FlagImage exactly
 */
function renderFlagImage(?string $countryName, ?string $flag = null): string {
    $flagUrl = getCountryFlagUrl($countryName, $flag);
    $emoji = getCountryEmoji($countryName, $flag);
    $alt = htmlspecialchars($countryName ?? 'Country flag', ENT_QUOTES, 'UTF-8');
    if ($flagUrl) {
        return '<img src="' . htmlspecialchars($flagUrl, ENT_QUOTES, 'UTF-8') . '" alt="' . $alt . '" width="16" height="12" loading="lazy" decoding="async" class="w-4 h-3 object-cover rounded-2xs inline-block shrink-0 shadow-2xs border border-slate-200/60" onerror="this.outerHTML=\'<span class=\\\'shrink-0 leading-none text-xs\\\'>' . $emoji . '</span>\'">';
    }
    return '<span class="shrink-0 leading-none text-xs">' . $emoji . '</span>';
}

/**
 * Resolve Date Group Info matching React getDateGroupInfo()
 */
function getDateGroupInfo(string $dateKey): array {
    if (!$dateKey || $dateKey === 'unknown') {
        return [
            'label' => 'Scheduled Matches',
            'subLabel' => 'Upcoming tips',
            'badgeText' => 'Fixtures',
        ];
    }
    try {
        $parts = explode('-', $dateKey);
        if (count($parts) < 3) throw new Exception('Invalid date');
        $targetDate = new DateTime("{$parts[0]}-{$parts[1]}-{$parts[2]} 00:00:00", new DateTimeZone('Africa/Nairobi'));
        $today = new DateTime('today 00:00:00', new DateTimeZone('Africa/Nairobi'));
        $diff = (int)$today->diff($targetDate)->format('%r%a');

        $dayName = $targetDate->format('l');
        $dayNum = $targetDate->format('j');
        $monthName = $targetDate->format('F');
        $year = $targetDate->format('Y');

        if ($diff === 0) {
            return [
                'label' => 'Today',
                'subLabel' => "{$dayName}, {$dayNum} {$monthName} {$year}",
                'badgeText' => 'Today',
            ];
        } elseif ($diff === -1) {
            return [
                'label' => 'Yesterday',
                'subLabel' => "{$dayName}, {$dayNum} {$monthName} {$year}",
                'badgeText' => 'Yesterday',
            ];
        } elseif ($diff === 1) {
            return [
                'label' => 'Tomorrow',
                'subLabel' => "{$dayName}, {$dayNum} {$monthName} {$year}",
                'badgeText' => 'Tomorrow',
            ];
        } else {
            return [
                'label' => "{$dayName} {$dayNum} {$monthName} {$year}",
                'subLabel' => "{$dayName}, {$dayNum} " . $targetDate->format('M') . " {$year}",
                'badgeText' => substr($dayName, 0, 3) . " {$dayNum}",
            ];
        }
    } catch (\Throwable $e) {
        return [
            'label' => $dateKey,
            'subLabel' => '',
            'badgeText' => $dateKey,
        ];
    }
}

/**
 * Check if a prediction item is unlocked (guest purchases)
 */
function isItemUnlocked(string $itemId): bool {
    if (isset($_COOKIE['guest_purchased_' . $itemId])) {
        return true;
    }
    return false;
}
