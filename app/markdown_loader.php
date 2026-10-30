<?php
/**
 * Cheerplex - Advanced Markdown Content & Author Loader
 * Ensures all sections of markdown files are accurately parsed, structured, and loaded.
 */

require_once __DIR__ . '/config.php';

/**
 * Normalizes page keys to match physical markdown file names in src/content/pages/
 */
function normalizeMarkdownKey(string $key): string {
    $raw = strtolower(trim(preg_replace('/\.md$/i', '', ltrim($key, '/'))));
    $aliasMap = [
        'home'                                                        => 'home',
        'category-today'                                              => 'cheerplex-today-prediction',
        'football-predictions-today'                                  => 'cheerplex-today-prediction',
        'today'                                                       => 'cheerplex-today-prediction',
        'category-tomorrow'                                           => 'cheerplex-tomorrow-prediction',
        'football-predictions-tomorrow'                               => 'cheerplex-tomorrow-prediction',
        'tomorrow'                                                    => 'cheerplex-tomorrow-prediction',
        'category-yesterday'                                          => 'cheerplex-yesterday-prediction',
        'football-predictions-yesterday'                              => 'cheerplex-yesterday-prediction',
        'yesterday'                                                   => 'cheerplex-yesterday-prediction',
        'category-homewin'                                            => 'cheerplex-1x2-prediction-tips',
        'football-predictions-1x2-home-win'                           => 'cheerplex-1x2-prediction-tips',
        '1x2'                                                         => 'cheerplex-1x2-prediction-tips',
        'category-btts'                                               => 'cheerplex-gg-prediction-tips',
        'football-predictions-btts-gg'                                => 'cheerplex-gg-prediction-tips',
        'gg'                                                          => 'cheerplex-gg-prediction-tips',
        'cheerplex-jackpots-predictions-and-tips'                     => 'cheerplex-jackpots-predictions-and-tips',
        'free-sportpesa-mega-jackpot-prediction'                      => 'sportpesa-mega',
        'sportpesa-mega-jackpot-prediction'                           => 'sportpesa-mega',
        'free-sportpesa-midweek-jackpot-predictions-and-analysis'     => 'sportpesa-midweek',
        'today-sportpesa-midweek-jackpot-prediction-and-tips'         => 'sportpesa-midweek',
        'free-betika-midweek-jackpot-predictions-and-analysis'        => 'betika-midweek',
        'free-mozzart-grand-jackpot-predictions-and-analysis'         => 'mozzart-grand',
        'free-mozzart-super-daily-jackpot-predictions-and-analysis'   => 'mozzart-super-daily',
        'vip-packages'                                                => 'cheerplex-vip-tips',
        'vip'                                                         => 'cheerplex-vip-tips',
        'contact-us'                                                  => 'contact',
    ];

    return $aliasMap[$raw] ?? $raw;
}

/**
 * Loads and parses an Author Markdown Profile from src/content/authors/
 */
function loadAuthor(string $authorId): array {
    $cleanId = strtolower(trim(preg_replace('/\.md$/i', '', ltrim($authorId, '/'))));
    $dir = __DIR__ . '/../src/content/authors/';
    
    // Normalize aliases
    if (strpos($cleanId, 'mwangi') !== false || strpos($cleanId, 'john') !== false) {
        $cleanId = 'john-mwangi';
    } elseif (strpos($cleanId, 'bett') !== false || strpos($cleanId, 'victor') !== false) {
        $cleanId = 'kipchumba-rotich';
    } elseif (strpos($cleanId, 'safety') !== false) {
        $cleanId = 'cheerplex-safety-board';
    } elseif (strpos($cleanId, 'ochieng') !== false || strpos($cleanId, 'david') !== false) {
        $cleanId = 'david-ochieng';
    } elseif (strpos($cleanId, 'omondi') !== false) {
        $cleanId = 'dr-samuel-omondi';
    }

    $defaultAuthor = [
        'id'             => 'john-mwangi',
        'name'           => 'John K. Mwangi',
        'role'           => 'Lead Football Analyst and Statistical Model Expert',
        'avatar'         => '',
        'experience'     => '7 Years',
        'credentials'    => 'B.Sc. Actuarial Science and Applied Statistics (University of Nairobi)',
        'specialization' => 'Statistical Goal Distributions, xG Calibration and Jackpot Permutations',
        'reviewerName'   => 'David Ochieng',
        'reviewerTitle'  => 'Senior Tactical and Statistical Verifier',
        'shortBio'       => '7 years experience in statistical sports modeling and actuarial probability and leads quantitative analysis at Cheerplex.',
        'badges'         => [
            ['text' => 'Verified Sports Analyst', 'type' => 'verified'],
            ['text' => '7 Yrs Experience', 'type' => 'experience']
        ],
        'social'         => [
            'twitter' => 'https://x.com/cheerplex_ke',
            'email'   => 'john.mwangi@cheerplex.co.ke'
        ]
    ];

    $filePath = $dir . $cleanId . '.md';
    if (!file_exists($filePath)) {
        return $defaultAuthor;
    }

    $raw = file_get_contents($filePath);
    $frontmatter = [];
    if (preg_match('/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/', $raw, $m)) {
        $lines = explode("\n", $m[1]);
        $currentArrayKey = null;
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (empty($trimmed) || $trimmed[0] === '#') continue;

            if (preg_match('/^([a-zA-Z0-9_]+):\s*(.*)$/', $trimmed, $kv)) {
                $k = $kv[1];
                $v = trim($kv[2], " \"'");
                if ($v === '' || $v === null) {
                    $currentArrayKey = $k;
                    $frontmatter[$k] = [];
                } else {
                    $currentArrayKey = null;
                    $frontmatter[$k] = $v;
                }
            } elseif ($currentArrayKey && strpos($trimmed, '-') === 0) {
                $itemVal = trim(ltrim($trimmed, '- '));
                if (preg_match('/^text:\s*"?(.*?)"?,\s*type:\s*"?(.*?)"?$/', $itemVal, $bm)) {
                    $frontmatter[$currentArrayKey][] = ['text' => $bm[1], 'type' => $bm[2]];
                } else {
                    $frontmatter[$currentArrayKey][] = trim($itemVal, " \"'");
                }
            }
        }
    }

    return array_merge($defaultAuthor, array_filter($frontmatter));
}

/**
 * Loads a Markdown Page from src/content/pages/ and parses all its constituent sections:
 * - Frontmatter metadata
 * - Intro / Overview section (prose before first ## heading)
 * - Analysis / Meat body (between first ## heading and FAQ)
 * - FAQ title & FAQ question/answer items
 * - Responsible gambling custom block
 * - Verified author profile
 */
function loadMarkdownPage(string $pageKey, ?string $jackpotId = null): ?array {
    $dir = __DIR__ . '/../src/content/pages/';
    $normKey = normalizeMarkdownKey($pageKey);
    $filePath = $dir . $normKey . '.md';

    if (!file_exists($filePath)) {
        $cleanRaw = ltrim($pageKey, '/');
        $altPath = $dir . $cleanRaw . '.md';
        if (file_exists($altPath)) {
            $filePath = $altPath;
            $normKey = $cleanRaw;
        } else {
            return null;
        }
    }

    $raw = file_get_contents($filePath);
    return parseMarkdownContent($raw, $normKey, $jackpotId);
}

/**
 * Parses raw markdown content into structured sections
 */
function parseMarkdownContent(string $raw, string $pageKey, ?string $jackpotId = null): array {
    $frontmatter = [];
    $body = $raw;

    // 1. Extract YAML Frontmatter
    if (preg_match('/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/', $raw, $matches)) {
        $lines = explode("\n", $matches[1]);
        $currentArrayKey = null;
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (empty($trimmed) || $trimmed[0] === '#') continue;

            if (preg_match('/^([a-zA-Z0-9_]+):\s*(.*)$/', $trimmed, $kv)) {
                $k = $kv[1];
                $v = trim($kv[2]);
                if (preg_match('/^\[(.*)\]$/', $v, $arrM)) {
                    $currentArrayKey = null;
                    $items = array_map(function($item) {
                        return trim($item, " \"'");
                    }, explode(',', $arrM[1]));
                    $frontmatter[$k] = array_filter($items);
                } elseif ($v === '' || $v === null) {
                    $currentArrayKey = $k;
                    $frontmatter[$k] = [];
                } else {
                    $currentArrayKey = null;
                    $frontmatter[$k] = trim($v, " \"'");
                }
            } elseif ($currentArrayKey && strpos($trimmed, '-') === 0) {
                $frontmatter[$currentArrayKey][] = trim(ltrim($trimmed, '- "'), " \"'");
            }
        }
        $body = $matches[2];
    }

    $effectiveJackpotId = $jackpotId ?? $frontmatter['jackpotId'] ?? $pageKey;

    // 2. Extract Responsible Gambling Block
    $responsibleGambling = $frontmatter['responsibleGambling'] ?? '';
    if (preg_match('/<!--\s*RESPONSIBLE_GAMBLING_START\s*-->([\s\S]*?)<!--\s*RESPONSIBLE_GAMBLING_END\s*-->/i', $body, $rgM)) {
        $responsibleGambling = trim($rgM[1]);
        $body = str_replace($rgM[0], '', $body);
    }

    // 3. Extract FAQ Section (from <!-- FAQ --> or ## FAQ / Frequently Asked Questions)
    $faqItems = [];
    $faqTitle = $frontmatter['faqTitle'] ?? $frontmatter['faqHeading'] ?? '';
    $analysisBody = $body;
    $rawFaqBody = '';

    $faqRegex = '/(?:<!--\s*(?:FAQ_START|FAQ)\s*-->|^##\s+.*(?:FAQ|Frequently Asked Questions).*$)/im';
    if (preg_match($faqRegex, $body, $faqMatch, PREG_OFFSET_CAPTURE)) {
        $faqOffset = $faqMatch[0][1];
        $analysisBody = trim(substr($body, 0, $faqOffset));
        $rawFaqBody = trim(substr($body, $faqOffset));

        // If the match was a heading line, extract the FAQ title
        if (preg_match('/^##\s+([^\r\n]+)/m', $rawFaqBody, $h2M)) {
            if (empty($faqTitle)) {
                $faqTitle = trim($h2M[1]);
            }
            $rawFaqBody = preg_replace('/^##\s+[^\r\n]+(?:\r?\n)*/m', '', $rawFaqBody);
        } else {
            $rawFaqBody = preg_replace('/^<!--\s*(?:FAQ_START|FAQ)\s*-->/i', '', $rawFaqBody);
            $rawFaqBody = preg_replace('/<!--\s*FAQ_END\s*-->/i', '', $rawFaqBody);
            if (preg_match('/^##\s+([^\r\n]+)/m', $rawFaqBody, $h2M2)) {
                if (empty($faqTitle)) {
                    $faqTitle = trim($h2M2[1]);
                }
                $rawFaqBody = preg_replace('/^##\s+[^\r\n]+(?:\r?\n)*/m', '', $rawFaqBody);
            }
        }

        // Parse individual FAQ items: ### Question ... Answer ...
        if (preg_match_all('/###\s+([^\r\n]+)[\r\n]+([\s\S]*?)(?=(?:###\s+[^\r\n]+|$))/m', $rawFaqBody, $qas, PREG_SET_ORDER)) {
            foreach ($qas as $qa) {
                $q = trim($qa[1]);
                $a = trim($qa[2]);
                // Strip markdown formatting from question title, clean answer
                $qClean = trim(strip_tags($q));
                $aClean = trim($a);
                if (!empty($qClean) && !empty($aClean)) {
                    $qExpanded = replaceShortcodes($qClean, $effectiveJackpotId);
                    $aExpanded = replaceShortcodes($aClean, $effectiveJackpotId);
                    $faqItems[] = [
                        'q' => $qExpanded,
                        'a' => $aExpanded,
                        'aHtml' => parseMarkdownToHtml($aExpanded, $pageKey, $effectiveJackpotId)
                    ];
                }
            }
        }
    }

    if (empty($faqTitle)) {
        $faqTitle = 'Frequently Asked Questions - ' . ($frontmatter['title'] ?? 'Cheerplex Predictions');
    }

    // 4. Strip top H1 heading (`# ...`) so it does not produce duplicate title
    $analysisBody = preg_replace('/^#\s+[^\r\n]+$/m', '', $analysisBody);

    // 5. Separate Overview (prose before first ## heading) and Analysis (from first ## onwards)
    $overview = '';
    $analysis = $analysisBody;

    if (preg_match('/^(##\s+[^\r\n]+)/m', $analysisBody, $firstH2, PREG_OFFSET_CAPTURE)) {
        $firstH2Offset = $firstH2[0][1];
        $overview = trim(substr($analysisBody, 0, $firstH2Offset));
        $analysis = trim(substr($analysisBody, $firstH2Offset));
    }

    // If explicit intro is in frontmatter, prioritize that
    $introText = $frontmatter['introParagraph'] ?? $frontmatter['intro'] ?? $frontmatter['miniIntro'] ?? $overview;

    // 6. Expand Dynamic Shortcodes in Analysis, Overview, Intro, and Metadata
    $analysis = replaceShortcodes($analysis, $effectiveJackpotId);
    $overview = replaceShortcodes($overview, $effectiveJackpotId);
    if (!empty($introText)) {
        $introText = replaceShortcodes($introText, $effectiveJackpotId);
    }

    $rawDisplayTitle = $frontmatter['displayTitle'] ?? $frontmatter['title'] ?? 'Cheerplex Football Predictions';
    $rawTitle = $frontmatter['title'] ?? $rawDisplayTitle;
    $rawDesc = $frontmatter['description'] ?? '';
    $rawKeywords = $frontmatter['keywords'] ?? '';

    $displayTitle = replaceShortcodes($rawDisplayTitle, $effectiveJackpotId);
    $title = replaceShortcodes($rawTitle, $effectiveJackpotId);
    $description = replaceShortcodes($rawDesc, $effectiveJackpotId);
    $keywords = replaceShortcodes($rawKeywords, $effectiveJackpotId);
    $faqTitle = replaceShortcodes($faqTitle, $effectiveJackpotId);

    // 7. Render Clean HTML for each section
    $analysisHtml = parseMarkdownToHtml($analysis, $pageKey, $effectiveJackpotId);
    $overviewHtml = !empty($overview) ? parseMarkdownToHtml($overview, $pageKey, $effectiveJackpotId) : '';
    $introHtml = !empty($introText) ? parseMarkdownToHtml($introText, $pageKey, $effectiveJackpotId) : '';

    // 8. Load Author Profile
    $authorId = $frontmatter['authorId'] ?? 'john-mwangi';
    $author = loadAuthor($authorId);
    if (!empty($frontmatter['authorName'])) $author['name'] = $frontmatter['authorName'];
    if (!empty($frontmatter['authorTitle'])) $author['role'] = $frontmatter['authorTitle'];
    if (!empty($frontmatter['authorDescription'])) $author['shortBio'] = $frontmatter['authorDescription'];
    if (!empty($frontmatter['authorAvatar'])) $author['avatar'] = $frontmatter['authorAvatar'];

    return [
        'pageKey'             => $pageKey,
        'frontmatter'         => $frontmatter,
        'title'               => $title,
        'displayTitle'        => $displayTitle,
        'description'         => $description,
        'keywords'            => $keywords,
        'link'                => $frontmatter['link'] ?? '/' . $pageKey,
        'type'                => $frontmatter['type'] ?? 'article',
        'jackpotId'           => $effectiveJackpotId,
        'intro'               => $introText,
        'introHtml'           => $introHtml,
        'overview'            => $overview,
        'overviewHtml'        => $overviewHtml,
        'analysis'            => $analysis,
        'analysisHtml'        => $analysisHtml,
        'html'                => $analysisHtml, // Alias for drop-in compatibility
        'faqTitle'            => $faqTitle,
        'faqItems'            => $faqItems,
        'author'              => $author,
        'responsibleGambling' => $responsibleGambling,
        'rawBody'             => $body,
    ];
}

/**
 * Normalizes any jackpot fixture prediction string into standard betting tip symbols (1, X, 2, DC1X, DC2X, DCX2, DC2).
 */
function normalizeTipSymbol(string $prediction): string {
    $clean = trim($prediction);
    if (preg_match('/^dcx2$/i', $clean) || preg_match('/^dc12$/i', $clean) || $clean === '12') return 'DCX2';
    if (preg_match('/^dc2x$/i', $clean) || preg_match('/^x2$/i', $clean) || $clean === '2X') return 'DC2X';
    if (preg_match('/^dc1x$/i', $clean) || preg_match('/^1x$/i', $clean) || $clean === 'X1') return 'DC1X';
    if (preg_match('/^dc2$/i', $clean)) return 'DC2';
    if (preg_match('/^dc1$/i', $clean)) return '1';
    if (stripos($clean, 'double chance') !== false || stripos($clean, 'dc') !== false) {
        if (stripos($clean, '1x') !== false || stripos($clean, 'x1') !== false) return 'DC1X';
        if (stripos($clean, 'x2') !== false || stripos($clean, '2x') !== false) return 'DC2X';
        if (stripos($clean, '12') !== false) return 'DCX2';
        return 'DC1X';
    }
    if (stripos($clean, 'home win') !== false || stripos($clean, '(1)') !== false || $clean === '1') return '1';
    if (stripos($clean, 'away win') !== false || stripos($clean, '(2)') !== false || $clean === '2') return '2';
    if (stripos($clean, 'draw') !== false || stripos($clean, '(x)') !== false || strcasecmp($clean, 'x') === 0) return 'X';
    return $clean ?: '1';
}

/**
 * Checks whether a given tip or prediction string represents a double chance selection.
 */
function isDoubleChanceTip(string $tip): bool {
    if (empty($tip)) return false;
    $clean = strtoupper(trim($tip));
    return (
        strpos($clean, 'DC') === 0 ||
        $clean === '1X' || $clean === 'X2' || $clean === '2X' || $clean === '12' || $clean === 'X1' ||
        strpos($clean, '/') !== false || strpos($clean, '&') !== false ||
        stripos($clean, 'double chance') !== false
    );
}

/**
 * Cleans and formats team names for natural casing (e.g., "ST Johnstone" -> "St Johnstone").
 */
function cleanTeamName(string $name): string {
    $c = trim($name);
    if (preg_match('/^st\s+/i', $c)) {
        return 'St ' . trim(substr($c, 3));
    }
    return $c;
}

/**
 * Formats an individual league name according to standard editorial conventions (e.g. adding 'the' where appropriate).
 */
function formatLeagueName(string $name): string {
    $trimmed = trim($name);
    $lower = strtolower($trimmed);
    if ($lower === 'premier league' || $lower === 'english premier league' || $lower === 'epl') return 'the Premier League';
    if ($lower === 'championship' || $lower === 'english championship') return 'the Championship';
    if ($lower === 'premiership' || $lower === 'scottish premiership') return 'the Scottish Premiership';
    if ($lower === 'super lig' || $lower === 'süper lig' || $lower === 'turkey super lig') return 'Süper Lig';
    if ($lower === 'primeira liga' || $lower === 'portugal primeira liga') return 'Primeira Liga';
    if ($lower === 'jupiler pro league' || $lower === 'belgian pro league') return 'Jupiler Pro League';
    if ($lower === 'la liga' || $lower === 'laliga' || $lower === 'primera division') return 'La Liga';
    if ($lower === 'serie a') return 'Serie A';
    if ($lower === 'serie b') return 'Serie B';
    if ($lower === 'ligue 1') return 'Ligue 1';
    if ($lower === 'ligue 2') return 'Ligue 2';
    if ($lower === 'bundesliga') return 'the Bundesliga';
    if ($lower === 'eredivisie') return 'the Eredivisie';
    if ($lower === 'superliga' || $lower === 'danish superliga') return 'Superliga';
    if ($lower === 'eliteserien' || $lower === 'norwegian eliteserien') return 'Eliteserien';
    if ($lower === 'allsvenskan') return 'Allsvenskan';
    if ($lower === 'ekstraklasa') return 'Ekstraklasa';
    if ($lower === 'czech liga' || $lower === 'czech first league') return 'the Czech First League';
    if (stripos($trimmed, 'the ') === 0) return $trimmed;
    return $trimmed;
}

/**
 * Resolves jackpot ID to canonical string
 */
function resolveJackpotId(?string $raw, string $defaultJackpotId = 'sportpesa-mega'): string {
    if (empty($raw)) return $defaultJackpotId;
    $s = strtolower(str_replace('_', '-', trim($raw)));
    if (strpos($s, 'sporty') !== false) return 'sportybet';
    if (strpos($s, 'betpawa') !== false || strpos($s, 'pick17') !== false || strpos($s, 'pick-17') !== false) return 'betpawa-pick';
    if (strpos($s, 'odibet') !== false || strpos($s, 'laki-tatu') !== false || strpos($s, 'laki_tatu') !== false) return 'odibet-laki-tatu';
    if ($s === 'betika-midweek' || strpos($s, 'betika') !== false) return 'betika-midweek';
    if (strpos($s, 'mozzart-super') !== false || strpos($s, 'super-daily') !== false || strpos($s, 'mozzart-daily') !== false) return 'mozzart-super-daily';
    if (strpos($s, 'mozzart') !== false) return 'mozzart-grand';
    if (strpos($s, 'sportpesa-midweek') !== false || strpos($s, 'sp-midweek') !== false || (strpos($s, 'midweek') !== false && strpos($s, 'betika') === false)) return 'sportpesa-midweek';
    if (strpos($s, 'mega') !== false || strpos($s, 'sportpesa') !== false) return 'sportpesa-mega';
    return $defaultJackpotId;
}

/**
 * Generates natural human-readable explanatory text for a fixture based on its tip and confidence.
 */
function getPredictionExplanation(array $fixture, string $tipSymbol, bool $isHighest = false): string {
    $home = cleanTeamName($fixture['homeTeam'] ?? 'Home');
    $away = cleanTeamName($fixture['awayTeam'] ?? 'Away');

    if ($isHighest) {
        $prefix = "This is the most current interesting game on this sportpesa meja jackpot prediction. ";
        switch ($tipSymbol) {
            case '1': return $prefix . "Home team to Win";
            case '2':
            case 'DC2': return $prefix . "Away team to Win";
            case 'X': return $prefix . "Match to end as a Draw";
            case 'DC1X': return $prefix . "{$home} Home team to win or match to end as a Draw";
            case 'DC2X': return $prefix . "away ({$away}) to win or match to end draw";
            case 'DCX2':
            case 'DC12': return $prefix . "Any team to win. The match will is predicted to end as a double chance with Home or away Win";
            default: return $prefix . "Away team to Win";
        }
    }

    switch ($tipSymbol) {
        case '1': return "{$home} Home to grab a win";
        case '2':
        case 'DC2': return "{$away} Away team to get a win";
        case 'X': return "Match to end as a draw. No Win here, just a plain Draw";
        case 'DC1X': return "{$home} Home team to win or match to end as a Draw";
        case 'DC2X': return "away ({$away}) to win or match to end draw";
        case 'DCX2':
        case 'DC12': return "Any team to win. The match will is predicted to end as a double chance with Home or away Win";
        default: return "{$home} Home to grab a win";
    }
}

/**
 * Structured date and time calculation for jackpot coupons
 */
function getJackpotDates(string $jackpotId, array $fixtures = []): array {
    if (empty($fixtures) && function_exists('getJackpotDetails')) {
        $jp = getJackpotDetails($jackpotId);
        if (!empty($jp['fixtures'])) {
            $fixtures = $jp['fixtures'];
        }
    }

    $configs = [
        'sportpesa-mega' => [
            'defaultSchedule' => 'Saturday, 18 September, from 16:00, and the last fixture to be played on Sunday, 19 September at 22:45 EAT',
            'defaultStartDate' => 'Saturday, 18 September',
            'defaultEndDate' => 'Sunday, 19 September',
            'defaultStartTime' => '16:00',
            'defaultEndTime' => '22:45',
        ],
        'betika-midweek' => [
            'defaultSchedule' => 'Saturday, 27 September, from 16:30, with the remaining fixtures continuing throughout Sunday, 28 September at 22:00 EAT',
            'defaultStartDate' => 'Saturday, 27 September',
            'defaultEndDate' => 'Sunday, 28 September',
            'defaultStartTime' => '16:30',
            'defaultEndTime' => '22:00',
        ],
        'mozzart-grand' => [
            'defaultSchedule' => 'Saturday, 20 September, from 18:00, with the remaining fixtures continuing throughout Sunday, 21 September at 23:00 EAT',
            'defaultStartDate' => 'Saturday, 20 September',
            'defaultEndDate' => 'Sunday, 21 September',
            'defaultStartTime' => '18:00',
            'defaultEndTime' => '23:00',
        ],
        'sportpesa-midweek' => [
            'defaultSchedule' => 'Friday, 19 September, from 20:00, and the last fixture to be played on Saturday, 20 September at 23:00 EAT',
            'defaultStartDate' => 'Friday, 19 September',
            'defaultEndDate' => 'Saturday, 20 September',
            'defaultStartTime' => '20:00',
            'defaultEndTime' => '23:00',
        ],
        'mozzart-super-daily' => [
            'defaultSchedule' => 'Monday, 22 September, from 18:00, with the remaining fixtures continuing throughout Tuesday, 23 September at 23:00 EAT',
            'defaultStartDate' => 'Monday, 22 September',
            'defaultEndDate' => 'Tuesday, 23 September',
            'defaultStartTime' => '18:00',
            'defaultEndTime' => '23:00',
        ],
        'sportybet' => [
            'defaultSchedule' => 'Saturday, 20 September, from 17:00, with fixtures running through Sunday, 21 September at 22:30 EAT',
            'defaultStartDate' => 'Saturday, 20 September',
            'defaultEndDate' => 'Sunday, 21 September',
            'defaultStartTime' => '17:00',
            'defaultEndTime' => '22:30',
        ],
        'betpawa-pick' => [
            'defaultSchedule' => 'Saturday, 27 September, from 16:00, continuing through Sunday, 28 September at 23:00 EAT',
            'defaultStartDate' => 'Saturday, 27 September',
            'defaultEndDate' => 'Sunday, 28 September',
            'defaultStartTime' => '16:00',
            'defaultEndTime' => '23:00',
        ],
        'odibet-laki-tatu' => [
            'defaultSchedule' => 'Daily from 18:00, running through 23:00 EAT',
            'defaultStartDate' => 'Daily',
            'defaultEndDate' => 'Daily',
            'defaultStartTime' => '18:00',
            'defaultEndTime' => '23:00',
        ],
    ];

    $cfg = $configs[$jackpotId] ?? $configs['sportpesa-mega'];

    if (!empty($fixtures)) {
        $foundEarliestTs = null;
        $foundLatestTs = null;

        foreach ($fixtures as $f) {
            $rawTime = $f['kickoffTime'] ?? $f['date'] ?? $f['kickoff_time'] ?? $f['time'] ?? null;
            if (!$rawTime) continue;
            try {
                $ts = strtotime($rawTime);
                if ($ts !== false && $ts > 0) {
                    if ($foundEarliestTs === null || $ts < $foundEarliestTs) {
                        $foundEarliestTs = $ts;
                    }
                    if ($foundLatestTs === null || $ts > $foundLatestTs) {
                        $foundLatestTs = $ts;
                    }
                }
            } catch (\Throwable $e) {}
        }

        if ($foundEarliestTs !== null && $foundLatestTs !== null) {
            $firstTs = $foundEarliestTs;
            $lastTs = $foundLatestTs;

            $startDay = date('l', $firstTs);
            $startDate = date('l, j F', $firstTs);
            $startTime = date('H:i', $firstTs);
            $startTimeEat = "{$startTime} EAT";
            $startDateTime = "{$startDate} at {$startTimeEat}";

            $endDay = date('l', $lastTs);
            $endDate = date('l, j F', $lastTs);
            $endTime = date('H:i', $lastTs);
            $endTimeEat = "{$endTime} EAT";
            $endDateTime = "{$endDate} at {$endTimeEat}";

            if ($startDate !== $endDate) {
                $scheduleText = "{$startDate}, from {$startTime}, and the last fixture to be played on {$endDate} at {$endTimeEat}";
            } else {
                $scheduleText = "{$startDate}, from {$startTime} to {$endTimeEat}";
            }

            return [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'startTime' => $startTime,
                'endTime' => $endTime,
                'startTimeEat' => $startTimeEat,
                'endTimeEat' => $endTimeEat,
                'startDateTime' => $startDateTime,
                'endDateTime' => $endDateTime,
                'scheduleText' => $scheduleText,
            ];
        }
    }

    $rawSchedule = $cfg['defaultSchedule'];
    $rawStartDate = $cfg['defaultStartDate'];
    $rawEndDate = $cfg['defaultEndDate'];
    $startTime = $cfg['defaultStartTime'];
    $endTime = $cfg['defaultEndTime'];
    $startTimeEat = "{$startTime} EAT";
    $endTimeEat = "{$endTime} EAT";

    return [
        'startDate' => $rawStartDate,
        'endDate' => $rawEndDate,
        'startTime' => $startTime,
        'endTime' => $endTime,
        'startTimeEat' => $startTimeEat,
        'endTimeEat' => $endTimeEat,
        'startDateTime' => "{$rawStartDate} at {$startTimeEat}",
        'endDateTime' => "{$rawEndDate} at {$endTimeEat}",
        'scheduleText' => $rawSchedule,
    ];
}

/**
 * Calculates prediction outcome distribution for any jackpot
 */
function generateJackpotSelectionsText(string $jackpotId, array $fixtures, bool $includePrefix = false): string {
    if (!empty($fixtures)) {
        $homeWins = 0;
        $draws = 0;
        $awayWins = 0;
        $doubleChances = 0;

        foreach ($fixtures as $f) {
            $rawP = $f['tip'] ?? $f['prediction'] ?? '';
            $tip = normalizeTipSymbol($rawP);
            $isDc = isDoubleChanceTip($rawP) || isDoubleChanceTip($tip);
            if ($isDc) {
                $doubleChances++;
            } elseif ($tip === '1') {
                $homeWins++;
            } elseif ($tip === 'X') {
                $draws++;
            } else {
                $awayWins++;
            }
        }

        $parts = [
            "{$homeWins} home win" . ($homeWins === 1 ? '' : 's'),
            "{$draws} draw" . ($draws === 1 ? '' : 's'),
            "{$awayWins} away win" . ($awayWins === 1 ? '' : 's'),
        ];
        if ($doubleChances > 0) {
            $parts[] = "{$doubleChances} double chance" . ($doubleChances === 1 ? '' : 's');
        }

        if (count($parts) === 1) {
            $body = $parts[0];
        } elseif (count($parts) === 2) {
            $body = "{$parts[0]} and {$parts[1]}";
        } else {
            $last = array_pop($parts);
            $body = implode(', ', $parts) . " and {$last}";
        }
        return $includePrefix ? "selections include {$body}" : $body;
    }

    $body = ($jackpotId === 'betika-midweek') ? '1 home win, 1 draw, 8 away wins and 5 double chances' : '6 home wins, 2 draws, 5 away wins and 4 double chances';
    return $includePrefix ? "selections include {$body}" : $body;
}

/**
 * Generates unique formatted league names collection
 */
function generateJackpotLeaguesText(string $jackpotId, array $fixtures = []): string {
    if (empty($fixtures) && function_exists('getJackpotDetails')) {
        $jp = getJackpotDetails($jackpotId);
        if (!empty($jp['fixtures'])) {
            $fixtures = $jp['fixtures'];
        }
    }

    $leagues = [];
    if (!empty($fixtures)) {
        $seen = [];
        foreach ($fixtures as $f) {
            $lg = trim($f['leagueName'] ?? $f['league'] ?? '');
            if (strlen($lg) > 1) {
                $formatted = formatLeagueName($lg);
                $lower = strtolower($formatted);
                if (!isset($seen[$lower])) {
                    $seen[$lower] = true;
                    $leagues[] = $formatted;
                }
            }
        }
    }
    if (empty($leagues)) {
        $defaultLeaguesByJp = [
            'betika-midweek'      => ['the Bundesliga', 'the Premier League', 'Serie A', 'Ligue 1'],
            'mozzart-grand'       => ['Serie A', 'La Liga', 'the Premier League', 'Ligue 1', 'the Bundesliga', 'the Eredivisie'],
            'sportpesa-midweek'   => ['the Premier League', 'the Championship', 'Serie A', 'La Liga', 'Ligue 1'],
            'mozzart-super-daily' => ['the Premier League', 'La Liga', 'Serie A', 'the Bundesliga', 'Süper Lig'],
            'sportybet'           => ['the Premier League', 'La Liga', 'Serie A', 'the Bundesliga'],
            'betpawa-pick'        => ['the Premier League', 'Serie A', 'La Liga', 'Ligue 1', 'the Championship'],
            'odibet-laki-tatu'    => ['the Premier League', 'La Liga', 'Serie A'],
            'sportpesa-mega'      => ['Serie A', 'Ligue 1', 'Serie B', 'La Liga', 'the Premier League', 'Jupiler Pro League', 'Primeira Liga', 'Süper Lig', 'Superliga', 'Eliteserien'],
        ];
        $leagues = $defaultLeaguesByJp[$jackpotId] ?? $defaultLeaguesByJp['sportpesa-mega'];
    }

    if (count($leagues) === 0) return '';
    if (count($leagues) === 1) return $leagues[0];
    if (count($leagues) === 2) return "{$leagues[0]} and {$leagues[1]}";
    $last = array_pop($leagues);
    return implode(', ', $leagues) . " and {$last}";
}

/**
 * Generates upset alerts text for coupons
 */
function generateJackpotUpsetAlertText(string $jackpotId, array $fixtures = [], string $mode = 'auto', string $format = '', string $context = 'standalone'): string {
    if (empty($fixtures) && function_exists('getJackpotDetails')) {
        $jp = getJackpotDetails($jackpotId);
        if (!empty($jp['fixtures'])) {
            $fixtures = $jp['fixtures'];
        }
    }

    $cleanLeagueInParens = function(string $rawLeague): string {
        $clean = trim($rawLeague);
        $stripped = preg_replace('/^the\s+/i', '', $clean);
        return $stripped ?: $clean;
    };

    if (!empty($fixtures) && count($fixtures) >= 2 && $mode !== 'curated') {
        $sorted = $fixtures;
        usort($sorted, function($a, $b) {
            $tipA = normalizeTipSymbol($a['prediction'] ?? $a['tip'] ?? '');
            $tipB = normalizeTipSymbol($b['prediction'] ?? $b['tip'] ?? '');
            $isDrawA = ($tipA === 'X') ? 1 : 0;
            $isDrawB = ($tipB === 'X') ? 1 : 0;
            if ($isDrawA !== $isDrawB) return $isDrawB - $isDrawA;

            $isDcA = isDoubleChanceTip($tipA) ? 1 : 0;
            $isDcB = isDoubleChanceTip($tipB) ? 1 : 0;
            if ($isDcA !== $isDcB) return $isDcB - $isDcA;

            $confA = (int)($a['confidence'] ?? 75);
            $confB = (int)($b['confidence'] ?? 75);
            if ($confA !== $confB) return $confA - $confB;

            $posA = (int)($a['fixtureNumber'] ?? $a['position'] ?? 0);
            $posB = (int)($b['fixtureNumber'] ?? $b['position'] ?? 0);
            return $posA - $posB;
        });

        $top2 = array_slice($sorted, 0, 2);
        usort($top2, function($a, $b) {
            $posA = (int)($a['fixtureNumber'] ?? $a['position'] ?? 0);
            $posB = (int)($b['fixtureNumber'] ?? $b['position'] ?? 0);
            return $posA - $posB;
        });

        $f1 = $top2[0];
        $f2 = $top2[1] ?? $top2[0];

        $rawL1 = formatLeagueName($f1['leagueName'] ?? $f1['league'] ?? '');
        $rawL2 = formatLeagueName($f2['leagueName'] ?? $f2['league'] ?? '');
        $l1 = $cleanLeagueInParens($rawL1);
        $l2 = $cleanLeagueInParens($rawL2);

        $t1Home = cleanTeamName($f1['homeTeam'] ?? '');
        $t1Away = cleanTeamName($f1['awayTeam'] ?? '');
        $t2Home = cleanTeamName($f2['homeTeam'] ?? '');
        $t2Away = cleanTeamName($f2['awayTeam'] ?? '');

        $m1 = !empty($l1) ? "{$t1Home} vs {$t1Away} ({$l1})" : "{$t1Home} vs {$t1Away}";
        $m2 = !empty($l2) ? "{$t2Home} vs {$t2Away} ({$l2})" : "{$t2Home} vs {$t2Away}";
    } else {
        if ($jackpotId === 'betika-midweek') {
            $m1 = "Sassuolo vs Udinese (Serie A)";
            $m2 = "1. FC Heidenheim vs FC Augsburg (the Bundesliga)";
        } elseif ($jackpotId === 'mozzart-grand') {
            $m1 = "Empoli vs Monza (Serie A)";
            $m2 = "Celta Vigo vs Getafe (La Liga)";
        } elseif ($jackpotId === 'sportpesa-midweek') {
            $m1 = "Preston North End vs Blackburn Rovers (Championship)";
            $m2 = "Reims vs Montpellier (Ligue 1)";
        } elseif ($jackpotId === 'mozzart-super-daily') {
            $m1 = "Lecce vs Cagliari (Serie A)";
            $m2 = "Heerenveen vs Groningen (Eredivisie)";
        } elseif ($jackpotId === 'sportybet') {
            $m1 = "FC St. Pauli vs Mainz 05 (the Bundesliga)";
            $m2 = "Alaves vs Real Valladolid (La Liga)";
        } elseif ($jackpotId === 'betpawa-pick') {
            $m1 = "Brest vs Strasbourg (Ligue 1)";
            $m2 = "Charleroi vs Kortrijk (Jupiler Pro League)";
        } elseif ($jackpotId === 'odibet-laki-tatu') {
            $m1 = "Getafe vs Mallorca (La Liga)";
            $m2 = "Verona vs Torino (Serie A)";
        } else {
            $m1 = "St Johnstone vs Hibernian (Scottish Premiership)";
            $m2 = "Espanyol vs Sevilla (La Liga)";
        }
    }

    if ($format === 'sentence' || $format === 'full' || $format === 'analysis') {
        return "{$m1} and {$m2} represent this round's primary upset alerts, where narrow head-to-head margins and unpredictable away form make double chance coverage (1X or X2) highly advisable.";
    }
    return "{$m1} and {$m2}";
}

/**
 * Generates Sub-Jackpots & Bonus Tiers markdown or text
 */
function generateJackpotSubCombosText(string $jackpotId, string $format = 'paragraph'): string {
    $data = [
        'sportpesa-mega' => [
            'paragraph' => 'SportPesa Mega Jackpot Pro offers five distinct combination tiers from the same 17-game coupon at KSh 99 per line: the full 17-match jackpot, the 16-game sub-jackpot (matches 2–17), the 15-game sub-jackpot (matches 3–17), the 14-game sub-jackpot (matches 4–17), and the 13-game sub-jackpot (matches 5–17), each featuring standalone guaranteed jackpots and cash bonuses.',
            'list' => "- **17-Game Mega Jackpot**: Matches 1–17 (Full Mega Jackpot + 12–16 bonus tiers)\n- **16-Game Sub-Jackpot**: Matches 2–17 (Standalone jackpot & bonuses)\n- **15-Game Sub-Jackpot**: Matches 3–17 (Standalone jackpot & bonuses)\n- **14-Game Sub-Jackpot**: Matches 4–17 (Standalone jackpot & bonuses)\n- **13-Game Sub-Jackpot**: Matches 5–17 (Standalone jackpot & bonuses)",
            'short' => 'the 17-match main jackpot, the 16-game combo (matches 2–17), the 15-game combo (matches 3–17), the 14-game combo (matches 4–17), and the 13-game combo (matches 5–17)'
        ],
        'betika-midweek' => [
            'paragraph' => 'The Betika Midweek Jackpot features a 15-game football coupon with an entry stake of KSh 15, offering a grand prize of KSh 15 Million along with guaranteed cash bonus payouts for 12, 13, and 14 correct predictions.',
            'list' => "- **15/15 Grand Prize**: KSh 15,000,000 top jackpot prize\n- **14/15 Bonus Tier**: High-tier cash consolation bonus\n- **13/15 Bonus Tier**: Mid-tier cash consolation bonus\n- **12/15 Bonus Tier**: Entry consolation prize tier",
            'short' => 'the 15/15 Grand Prize (KSh 15M) and bonus payout tiers for 14, 13, and 12 correct match picks'
        ],
        'mozzart-grand' => [
            'paragraph' => 'The Mozzart Super Grand Jackpot spans 20 pre-selected matches with a standard stake of KSh 50, featuring a fixed top prize of KSh 200 Million alongside cash bonus payouts for 17, 18, and 19 correct predictions, plus a unique consolation prize for correctly calling 0 matches.',
            'list' => "- **20/20 Grand Prize**: KSh 200,000,000 fixed cash jackpot\n- **19/20 Bonus Tier**: Significant cash payout bonus\n- **18/20 Bonus Tier**: Substantial consolation bonus\n- **17/20 Bonus Tier**: Entry-level cash bonus tier\n- **0/20 Unique Prize**: Consolation reward for getting zero predictions correct",
            'short' => 'the 20/20 Grand Prize (KSh 200M), bonus payouts for 19, 18, and 17 correct picks, and the unique 0/20 consolation prize'
        ],
        'sportpesa-midweek' => [
            'paragraph' => 'The SportPesa Midweek Jackpot challenges bettors to predict 13 competitive games for a stake of KSh 99, featuring a progressive multi-million shilling jackpot starting from KSh 10 Million and guaranteed cash bonuses for 10, 11, and 12 correct predictions.',
            'list' => "- **13/13 Midweek Jackpot**: Progressive multi-million top cash prize\n- **12/13 Bonus Tier**: Top consolation cash payout\n- **11/13 Bonus Tier**: Medium consolation bonus\n- **10/13 Bonus Tier**: Entry consolation prize tier",
            'short' => 'the 13/13 main progressive jackpot, with cash bonus payout tiers for 12, 11, and 10 correct match outcomes'
        ],
        'mozzart-super-daily' => [
            'paragraph' => 'The Mozzart Super Daily Jackpot is an intensive 16-game daily coupon with a KSh 20 stake, delivering a daily jackpot prize of KSh 200,000 for 16/16 correct calls and tiered consolation prizes.',
            'list' => "- **16/16 Super Daily Prize**: KSh 200,000 daily top prize\n- **Consolation Tiers**: Consolation cash payouts for near-miss tickets",
            'short' => 'the 16/16 daily jackpot (KSh 200,000) and consolation bonus tiers'
        ],
        'sportybet' => [
            'paragraph' => 'SportyBet 12 Jackpot features 12 competitive weekend matches with a grand prize of KSh 5,000,000 and cash bonuses for 10 and 11 correct predictions.',
            'list' => "- **12/12 Grand Prize**: KSh 5,000,000 top jackpot\n- **11/12 Bonus Tier**: High consolation cash payout\n- **10/12 Bonus Tier**: Entry consolation prize tier",
            'short' => 'the 12/12 grand prize (KSh 5M) and bonus payouts for 11 and 10 correct match outcomes'
        ],
        'betpawa-pick' => [
            'paragraph' => 'The betPawa Pick17 Jackpot delivers a massive KSh 20,000,000 top prize with just a KSh 10 stake, alongside lucrative bonus payouts for 13, 14, 15, and 16 correct predictions.',
            'list' => "- **17/17 Grand Prize**: KSh 20,000,000 top cash jackpot\n- **16/17 Bonus Tier**: Generous cash consolation\n- **15/17 Bonus Tier**: High cash bonus tier\n- **14/17 Bonus Tier**: Mid-tier consolation reward\n- **13/17 Bonus Tier**: Entry bonus payout",
            'short' => 'the 17/17 grand prize (KSh 20M) and bonus tiers for 16, 15, 14, and 13 correct predictions'
        ],
        'odibet-laki-tatu' => [
            'paragraph' => 'The Odibets Laki Tatu Daily Jackpot offers a daily KSh 300,000 cash prize for 10/10 correct match picks with a low KSh 15 stake, plus consolation bonuses.',
            'list' => "- **10/10 Grand Prize**: KSh 300,000 daily cash prize\n- **9/10 Bonus Tier**: Cash consolation payout\n- **8/10 Bonus Tier**: Entry consolation prize",
            'short' => 'the 10/10 daily cash prize (KSh 300,000) and consolation bonus payouts'
        ],
    ];

    $cfg = $data[$jackpotId] ?? $data['sportpesa-mega'];
    if ($format === 'list') return $cfg['list'];
    if ($format === 'short') return $cfg['short'];
    return $cfg['paragraph'];
}

/**
 * Generates Double Chance fixtures markdown
 */
function generateDoubleChanceFixturesMarkdown(string $jackpotId, array $fixtures, ?int $count = null): string {
    $targetCount = $count ?? 4;
    $dcFixtures = [];

    foreach ($fixtures as $f) {
        $rawTip = $f['tip'] ?? $f['prediction'] ?? '';
        $tipSymbol = normalizeTipSymbol($rawTip);
        if (isDoubleChanceTip($tipSymbol) || isDoubleChanceTip($rawTip)) {
            $home = cleanTeamName($f['homeTeam'] ?? 'Home');
            $away = cleanTeamName($f['awayTeam'] ?? 'Away');
            $header = "{$home} vs {$away} — {$tipSymbol}";
            $desc = getPredictionExplanation($f, $tipSymbol, false);
            $dcFixtures[] = "{$header}\n\n{$desc}";
        }
    }

    if (empty($dcFixtures)) {
        $sorted = $fixtures;
        usort($sorted, function($a, $b) {
            $confA = (int)($a['confidence'] ?? 50);
            $confB = (int)($b['confidence'] ?? 50);
            return abs($confA - 50) - abs($confB - 50);
        });
        $chosen = array_slice($sorted, 0, min($targetCount, count($sorted)));
        foreach ($chosen as $idx => $f) {
            $rawTip = $f['tip'] ?? $f['prediction'] ?? '1';
            $tipSymbol = 'DC1X';
            if ($rawTip === '2') $tipSymbol = 'DC2X';
            elseif ($rawTip === 'X' || $idx % 2 === 1) $tipSymbol = 'DC1X';
            else $tipSymbol = 'DCX2';

            $home = cleanTeamName($f['homeTeam'] ?? 'Home');
            $away = cleanTeamName($f['awayTeam'] ?? 'Away');
            $header = "{$home} vs {$away} — {$tipSymbol}";
            $desc = getPredictionExplanation($f, $tipSymbol, false);
            $dcFixtures[] = "{$header}\n\n{$desc}";
        }
    }

    if ($count && $count > 0) {
        $dcFixtures = array_slice($dcFixtures, 0, $count);
    }
    return implode("\n\n\n", $dcFixtures);
}

/**
 * Generates Top Confidence fixtures markdown
 */
function generateTopConfidenceFixturesMarkdown(string $jackpotId, array $fixtures, int $count = 7): string {
    if (empty($fixtures)) return '';
    $sorted = $fixtures;
    usort($sorted, function($a, $b) {
        return ((int)($b['confidence'] ?? 0)) - ((int)($a['confidence'] ?? 0));
    });
    $topSlice = array_slice($sorted, 0, min($count, count($sorted)));
    if (empty($topSlice)) return '';

    $maxConf = 0;
    foreach ($topSlice as $f) {
        $c = (int)($f['confidence'] ?? 0);
        if ($c > $maxConf) $maxConf = $c;
    }

    $highestIndex = 0;
    foreach ($topSlice as $idx => $f) {
        if ((int)($f['confidence'] ?? 0) === $maxConf) {
            $highestIndex = $idx;
            break;
        }
    }
    $highestFixture = $topSlice[$highestIndex];
    unset($topSlice[$highestIndex]);
    $otherFixtures = array_values($topSlice);

    $items = [];
    foreach ($otherFixtures as $f) {
        $tipSymbol = normalizeTipSymbol($f['tip'] ?? $f['prediction'] ?? '1');
        $home = cleanTeamName($f['homeTeam'] ?? 'Home');
        $away = cleanTeamName($f['awayTeam'] ?? 'Away');
        $header = "{$home} vs {$away} — {$tipSymbol}";
        $desc = getPredictionExplanation($f, $tipSymbol, false);
        $items[] = "{$header}\n\n{$desc}";
    }

    $hTip = normalizeTipSymbol($highestFixture['tip'] ?? $highestFixture['prediction'] ?? '1');
    $hHome = cleanTeamName($highestFixture['homeTeam'] ?? 'Home');
    $hAway = cleanTeamName($highestFixture['awayTeam'] ?? 'Away');
    $hHeader = "{$hHome} vs {$hAway} — {$hTip} (The game with the highest confidence score)";
    $hDesc = getPredictionExplanation($highestFixture, $hTip, true);
    $items[] = "{$hHeader}\n\n{$hDesc}";

    return implode("\n\n\n", $items);
}

/**
 * Generates All Jackpot Fixtures table/list markdown
 */
function generateAllJackpotFixturesMarkdown(string $jackpotId, array $fixtures): string {
    if (empty($fixtures)) return '';
    $total = count($fixtures);
    $disclosedCount = (int)round(($total * 2) / 3);

    $items = [];
    foreach ($fixtures as $idx => $f) {
        $pos = $f['fixtureNumber'] ?? $f['position'] ?? ($idx + 1);
        $home = cleanTeamName($f['homeTeam'] ?? 'Home');
        $away = cleanTeamName($f['awayTeam'] ?? 'Away');
        $lg = trim($f['leagueName'] ?? '');
        $lgSuffix = !empty($lg) ? " ({$lg})" : '';
        $conf = min(99, max(50, (int)($f['confidence'] ?? 75)));
        $isDisclosed = ($idx < $disclosedCount);
        $rawTip = normalizeTipSymbol($f['tip'] ?? $f['prediction'] ?? '1');

        $tipDisplay = $isDisclosed ? $rawTip : '[⭐ Join VIP](/vip-packages)';
        $confDisplay = $isDisclosed ? "{$conf}%" : '🔒 VIP';

        $matchHeader = "Game {$pos}: {$home} vs {$away}{$lgSuffix} — Cheerplex Tip: {$tipDisplay} (Confidence: {$confDisplay})";
        $description = $isDisclosed
            ? "**Fixture Tip: {$rawTip}** — " . getPredictionExplanation($f, $rawTip, false)
            : "**Fixture Tip: [⭐ Join VIP](/vip-packages)** — **Confidence: 🔒 VIP** — Unlock this confidential fixture prediction, VIP analysis, and 3 double-chance combo slips on Cheerplex.";

        $items[] = "{$matchHeader}\n\n{$description}";
    }

    return implode("\n\n\n", $items);
}

/**
 * Replaces dynamic shortcodes with live database and category data
 * Fully supports all {{TODAY_*}}, {{JACKPOT_*}}, and coupon tags across all three syntaxes (Mustache, HTML comments, brackets).
 */
function replaceShortcodes(string $text, string $defaultJackpotId): string {
    $resolvedDefaultId = resolveJackpotId($defaultJackpotId);

    // 1. Fetch live today's fixtures to populate TODAY_ tags dynamically
    $todayFixtures = function_exists('getFixturesByCategory') ? getFixturesByCategory('today') : [];
    if (empty($todayFixtures) && function_exists('getAllPredictions')) {
        $todayFixtures = getAllPredictions();
    }

    // Top Two Marquee Fixtures string: "Arsenal vs Chelsea (1X) in English Premier League and Real Madrid vs Barcelona (1) in Spanish La Liga"
    $topTwoTodayStr = 'No today fixtures available';
    if (!empty($todayFixtures)) {
        $sortedToday = $todayFixtures;
        usort($sortedToday, function($a, $b) {
            $confA = (int)($a['confidence'] ?? 75);
            $confB = (int)($b['confidence'] ?? 75);
            return $confB - $confA;
        });
        $topTwoArr = array_slice($sortedToday, 0, 2);
        $formattedTopTwo = [];
        foreach ($topTwoArr as $f) {
            $h = $f['homeTeam'] ?? 'Home';
            $a = $f['awayTeam'] ?? 'Away';
            $rawP = $f['prediction'] ?? '1';
            $lg = trim($f['leagueName'] ?? '');
            $lgStr = !empty($lg) ? (stripos($lg, 'in ') === 0 ? " {$lg}" : " in {$lg}") : '';
            $formattedTopTwo[] = "{$h} vs {$a} ({$rawP}){$lgStr}";
        }
        if (count($formattedTopTwo) === 1) {
            $topTwoTodayStr = $formattedTopTwo[0];
        } elseif (count($formattedTopTwo) > 1) {
            $topTwoTodayStr = implode(' and ', $formattedTopTwo);
        }
    }

    // Today Leagues string: "English Premier League, Spanish La Liga and Italian Serie A"
    $todayLeaguesStr = 'All Major Leagues';
    if (!empty($todayFixtures)) {
        $uniqueLeagues = array_values(array_unique(array_filter(array_map(function($f) {
            return trim($f['leagueName'] ?? '');
        }, $todayFixtures))));
        if (!empty($uniqueLeagues)) {
            if (count($uniqueLeagues) === 1) {
                $todayLeaguesStr = $uniqueLeagues[0];
            } elseif (count($uniqueLeagues) === 2) {
                $todayLeaguesStr = "{$uniqueLeagues[0]} and {$uniqueLeagues[1]}";
            } else {
                $lastLg = array_pop($uniqueLeagues);
                $todayLeaguesStr = implode(', ', $uniqueLeagues) . " and {$lastLg}";
            }
        }
    }

    // Today Predictions Count
    $todayCountStr = (string)count($todayFixtures);

    // Today Market Predictions Distribution / Summary: e.g. "3 ov 2.5, 1 double chance and 1 home win"
    $categoryCounts = [];
    foreach ($todayFixtures as $f) {
        $p = strtolower(trim($f['prediction'] ?? ''));
        if (strpos($p, '1x') !== false || strpos($p, 'x2') !== false || strpos($p, '12') !== false || strpos($p, 'dc') !== false || strpos($p, 'double chance') !== false) {
            $cat = 'double chance';
        } elseif (strpos($p, 'ov 2.5') !== false || strpos($p, 'over 2.5') !== false || strpos($p, '3+') !== false) {
            $cat = 'ov 2.5';
        } elseif (strpos($p, 'ov 1.5') !== false || strpos($p, 'over 1.5') !== false || strpos($p, '2+') !== false) {
            $cat = 'ov 1.5';
        } elseif (strpos($p, 'un 2.5') !== false || strpos($p, 'under 2.5') !== false) {
            $cat = 'un 2.5';
        } elseif (strpos($p, 'btts') !== false || strpos($p, 'gg') !== false) {
            $cat = 'BTTS';
        } elseif ($p === '1' || strpos($p, 'home') !== false) {
            $cat = 'home win';
        } elseif ($p === '2' || strpos($p, 'away') !== false) {
            $cat = 'away win';
        } elseif ($p === 'x' || strpos($p, 'draw') !== false) {
            $cat = 'draw';
        } else {
            $cat = 'home win';
        }
        $categoryCounts[$cat] = ($categoryCounts[$cat] ?? 0) + 1;
    }
    $catParts = [];
    foreach ($categoryCounts as $cName => $cCount) {
        $catParts[] = "{$cCount} {$cName}";
    }
    if (empty($catParts)) {
        $todayPredSummaryStr = 'Balanced distribution across 1X2, BTTS and goals markets';
    } elseif (count($catParts) === 1) {
        $todayPredSummaryStr = $catParts[0];
    } elseif (count($catParts) === 2) {
        $todayPredSummaryStr = "{$catParts[0]} and {$catParts[1]}";
    } else {
        $lastCat = array_pop($catParts);
        $todayPredSummaryStr = implode(', ', $catParts) . " and {$lastCat}";
    }

    // Direct UI Timer patterns: {{UI_TIMER}}, {{JACKPOT_TIMER}}, {{COUNTDOWN}}, etc.
    $directTimerCallback = function($m) use ($resolvedDefaultId) {
        $tag = strtoupper($m[1]);
        $targetJp = $resolvedDefaultId;
        if (strpos($tag, 'BETIKA') !== false) $targetJp = 'betika-midweek';
        elseif (strpos($tag, 'MOZZART') !== false) $targetJp = 'mozzart-grand';
        elseif (strpos($tag, 'MEGA') !== false || strpos($tag, 'SPORTPESA') !== false) $targetJp = 'sportpesa-mega';
        
        $attrs = $m[2] ?? '';
        if (preg_match('/(?:jackpot|id)\s*=\s*["\']?([a-zA-Z0-9_-]+)["\']?/i', $attrs, $jm)) {
            $targetJp = resolveJackpotId($jm[1], $targetJp);
        }
        return "\n\n[[UI_TIMER:{$targetJp}]]\n\n";
    };

    $text = preg_replace_callback('/\{\{\s*(UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|TIMER|COUNTDOWN|MEGA_JACKPOT_TIMER|SPORTPESA_MEGA_TIMER|BETIKA_MIDWEEK_TIMER|TIMER_ONLY)([\s:][^}]*)?\}\}/i', $directTimerCallback, $text);
    $text = preg_replace_callback('/<!--\s*(UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|TIMER|COUNTDOWN|MEGA_JACKPOT_TIMER|SPORTPESA_MEGA_TIMER|BETIKA_MIDWEEK_TIMER|TIMER_ONLY)([\s:][^-]*)?-->/i', $directTimerCallback, $text);
    $text = preg_replace_callback('/(?<!\[)\[(?!\[)\s*(UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|TIMER|COUNTDOWN|MEGA_JACKPOT_TIMER|SPORTPESA_MEGA_TIMER|BETIKA_MIDWEEK_TIMER|TIMER_ONLY)([\s:][^\]]*)?\](?!\])/i', $directTimerCallback, $text);

    // Universal Tag Dispatcher
    $dispatcher = function($full, $prefixRaw, $suffixRaw, $attrsRaw) use ($resolvedDefaultId) {
        $prefix = strtoupper($prefixRaw ?? '');
        $suffix = strtoupper($suffixRaw);
        $attrs = trim($attrsRaw ?? '');

        // Determine target jackpot ID
        $targetJp = $resolvedDefaultId;
        if (!empty($prefix)) {
            $targetJp = resolveJackpotId($prefix, $resolvedDefaultId);
        }
        if (preg_match('/(?:jackpot|id)\s*=\s*["\']?([a-zA-Z0-9_-]+)["\']?/i', $attrs, $jm)) {
            $targetJp = resolveJackpotId($jm[1], $targetJp);
        }

        // Count attribute
        $count = null;
        if (preg_match('/^:(\d+)/', $attrs, $cm)) {
            $count = (int)$cm[1];
        } elseif (preg_match('/count\s*=\s*["\']?(\d+)["\']?/i', $attrs, $cm2)) {
            $count = (int)$cm2[1];
        }

        // Format attribute
        $format = 'paragraph';
        if (stripos($attrs, 'list') !== false) $format = 'list';
        elseif (stripos($attrs, 'short') !== false) $format = 'short';
        elseif (stripos($attrs, 'time') !== false) $format = 'time';
        elseif (stripos($attrs, 'day') !== false) $format = 'day';

        // Load jackpot details & fixtures
        $jpDetails = function_exists('getJackpotDetails') ? getJackpotDetails($targetJp) : null;
        $fixtures = $jpDetails['fixtures'] ?? [];

        switch ($suffix) {
            case 'START_DATE':
            case 'START_DATES':
            case 'STARTING_DATE':
            case 'STARTDATE':
            case 'STARTDATES':
            case 'FIRST_DATE':
            case 'FIRST_MATCH_DATE':
            case 'OPENING_DATE':
            case 'KICKOFF_DATE':
                $d = getJackpotDates($targetJp, $fixtures);
                return $d['startDate'];

            case 'START_TIME':
            case 'STARTTIME':
            case 'KICKOFF_TIME':
            case 'FIRST_TIME':
            case 'OPENING_TIME':
            case 'TIME':
            case 'TIMES':
                $d = getJackpotDates($targetJp, $fixtures);
                return ($format === 'time' || stripos($attrs, 'raw') !== false) ? $d['startTime'] : $d['startTimeEat'];

            case 'START_DATETIME':
            case 'STARTDATETIME':
            case 'KICKOFF_DATETIME':
            case 'OPENING_DATETIME':
            case 'DATETIME':
            case 'DATE_TIME':
            case 'DATES_TIME':
                $d = getJackpotDates($targetJp, $fixtures);
                return $d['startDateTime'];

            case 'START_DAY':
            case 'STARTDAY':
                $d = getJackpotDates($targetJp, $fixtures);
                return date('l', strtotime($d['startDate']));

            case 'END_DATE':
            case 'END_DATES':
            case 'ENDING_DATE':
            case 'ENDDATE':
            case 'ENDDATES':
            case 'LAST_DATE':
            case 'LAST_MATCH_DATE':
            case 'CLOSING_DATE':
            case 'FINISH_DATE':
                $d = getJackpotDates($targetJp, $fixtures);
                return $d['endDate'];

            case 'END_TIME':
            case 'ENDTIME':
            case 'CLOSING_TIME':
            case 'LAST_TIME':
            case 'FINISH_TIME':
                $d = getJackpotDates($targetJp, $fixtures);
                return ($format === 'time' || stripos($attrs, 'raw') !== false) ? $d['endTime'] : $d['endTimeEat'];

            case 'END_DATETIME':
            case 'ENDDATETIME':
            case 'CLOSING_DATETIME':
            case 'FINISH_DATETIME':
                $d = getJackpotDates($targetJp, $fixtures);
                return $d['endDateTime'];

            case 'END_DAY':
            case 'ENDDAY':
                $d = getJackpotDates($targetJp, $fixtures);
                return date('l', strtotime($d['endDate']));

            case 'DATES':
            case 'DATE':
            case 'SCHEDULE':
                $d = getJackpotDates($targetJp, $fixtures);
                return $d['scheduleText'];

            case 'SELECTIONS_INCLUDE':
            case 'SELECTION_INCLUDE':
                return generateJackpotSelectionsText($targetJp, $fixtures, true);

            case 'SELECTIONS':
            case 'SELECTION':
            case 'OUTCOMES':
            case 'OUTCOME':
            case 'DISTRIBUTION':
                return generateJackpotSelectionsText($targetJp, $fixtures, false);

            case 'DOUBLE_CHANCE_COUNT':
            case 'DOUBLE_CHANCES_COUNT':
            case 'DC_COUNT':
                $dcCount = 0;
                foreach ($fixtures as $f) {
                    $rawP = $f['tip'] ?? $f['prediction'] ?? '';
                    if (isDoubleChanceTip($rawP) || isDoubleChanceTip(normalizeTipSymbol($rawP))) $dcCount++;
                }
                return ($format === 'short') ? (string)$dcCount : "{$dcCount} double chance" . ($dcCount === 1 ? '' : 's');

            case 'UPSET':
            case 'UPSETS':
            case 'UPSET_ALERT':
            case 'UPSET_ALERTS':
            case 'UPSET_FIXTURES':
            case 'UPSET_MATCHES':
                return generateJackpotUpsetAlertText($targetJp, $fixtures, 'auto', $format, 'standalone');

            case 'SUB_COMBOS':
            case 'SUB_COMBO':
            case 'SUB_JACKPOTS':
            case 'SUB_JACKPOT':
            case 'COMBOS':
            case 'COMBO':
            case 'BONUSES':
            case 'BONUS':
            case 'BONUS_TIERS':
            case 'TIERS':
            case 'TIER':
                return generateJackpotSubCombosText($targetJp, $format);

            case 'LEAGUES':
            case 'LEAGUE':
            case 'LEAGUE_NAMES':
            case 'LEAGUENAMES':
            case 'LEAGUES_NAMES':
            case 'FEATURED_LEAGUES':
                return generateJackpotLeaguesText($targetJp, $fixtures);

            case 'DOUBLE_CHANCE_FIXTURES':
            case 'DOUBLE_CHANCES':
            case 'DOUBLE_CHANCE':
                return generateDoubleChanceFixturesMarkdown($targetJp, $fixtures, $count ?: 4);

            case 'TOP_FIXTURES':
            case 'TOP_CONFIDENCE_FIXTURES':
            case 'TOP_CONFIDENCE':
            case 'TOP_CONFIDENCE_MATCHES':
                return generateTopConfidenceFixturesMarkdown($targetJp, $fixtures, $count ?: 7);

            case 'ALL_FIXTURES':
            case 'ALL_MEGA_JACKPOT_FIXTURES':
            case 'ALL_JACKPOT_FIXTURES':
            case 'MEGA_JACKPOT_ALL_FIXTURES':
            case 'ALL_GAMES':
            case 'ALL_PREDICTIONS':
            case 'ALL_MATCHES':
            case 'MEGA_JACKPOT_PREDICTIONS':
            case 'ALL_MEGA_FIXTURES':
            case 'MEGA_FIXTURES':
                return generateAllJackpotFixturesMarkdown($targetJp, $fixtures);

            case 'UI_TIMER':
            case 'JACKPOT_TIMER':
            case 'COUNTDOWN_TIMER':
            case 'COUNTDOWN':
            case 'TIMER':
            case 'TIMER_ONLY':
                return "\n\n[[UI_TIMER:{$targetJp}]]\n\n";

            default:
                return $full;
        }
    };

    // Prefixes pattern
    $prefPat = '(?:MEGA_JACKPOT|SPORTPESA_MEGA|SPORTPESA_MEGA_JACKPOT|MEGA|SPORTPESA_17|SP_MEGA|BETIKA_MIDWEEK|BETIKA_MIDWEEK_JACKPOT|BETIKA|BETIKA_15|BETIKA_JACKPOT|MOZZART_GRAND|MOZZART_GRAND_JACKPOT|MOZZART|MOZZART_20|MOZZART_JACKPOT|SPORTPESA_MIDWEEK|SPORTPESA_MIDWEEK_JACKPOT|SP_MIDWEEK|MIDWEEK|SPORTPESA_13|SP_13|MOZZART_SUPER_DAILY|MOZZART_SUPER_DAILY_JACKPOT|SUPER_DAILY|SUPER_DAILY_JACKPOT|MOZZART_DAILY|MOZZART_DAILY_JACKPOT|MOZZART_16|SPORTYBET_JACKPOT|SPORTYBET_12|SPORTYBET|SPORTY|BETPAWA_PICK_JACKPOT|BETPAWA_PICK17|BETPAWA_PICK_17|BETPAWA_PICK|BETPAWA|PICK17|PICK_17|ODIBET_LAKI_TATU|ODIBET_LAKI_TATU_JACKPOT|ODIBETS_LAKI_TATU|ODIBET|ODIBETS|ODIBETS_JACKPOT|LAKI_TATU|BETIKA_SABABISHA|SABABISHA|JACKPOT)';
    // Suffixes pattern
    $suffPat = '(?:START_DATE|START_DATES|STARTING_DATE|STARTDATE|STARTDATES|FIRST_DATE|FIRST_MATCH_DATE|OPENING_DATE|KICKOFF_DATE|START_TIME|STARTTIME|FIRST_TIME|OPENING_TIME|KICKOFF_TIME|TIME|TIMES|START_DATETIME|STARTDATETIME|KICKOFF_DATETIME|OPENING_DATETIME|DATETIME|DATE_TIME|DATES_TIME|START_DAY|STARTDAY|END_DATE|END_DATES|ENDING_DATE|ENDDATE|ENDDATES|CLOSING_DATE|LAST_DATE|LAST_MATCH_DATE|FINISH_DATE|END_TIME|ENDTIME|CLOSING_TIME|LAST_TIME|FINISH_TIME|END_DATETIME|ENDDATETIME|CLOSING_DATETIME|FINISH_DATETIME|END_DAY|ENDDAY|DATES|DATE|SCHEDULE|SELECTIONS_INCLUDE|SELECTION_INCLUDE|SELECTIONS|SELECTION|OUTCOMES|OUTCOME|DISTRIBUTION|UPSET_ALERT|UPSET_ALERTS|UPSET_FIXTURES|UPSET_MATCHES|UPSET|UPSETS|SUB_COMBOS|SUB_COMBO|SUB_JACKPOTS|SUB_JACKPOT|COMBOS|COMBO|BONUSES|BONUS|BONUS_TIERS|TIERS|TIER|LEAGUES_NAMES|LEAGUE_NAMES|LEAGUENAMES|FEATURED_LEAGUES|LEAGUES|LEAGUE|DOUBLE_CHANCE_FIXTURES|DOUBLE_CHANCES_COUNT|DOUBLE_CHANCE_COUNT|DC_COUNT|DOUBLE_CHANCES|DOUBLE_CHANCE|TOP_FIXTURES|TOP_CONFIDENCE_FIXTURES|TOP_CONFIDENCE|TOP_CONFIDENCE_MATCHES|ALL_FIXTURES|ALL_MEGA_JACKPOT_FIXTURES|ALL_JACKPOT_FIXTURES|MEGA_JACKPOT_ALL_FIXTURES|ALL_GAMES|ALL_PREDICTIONS|ALL_MATCHES|MEGA_JACKPOT_PREDICTIONS|ALL_MEGA_FIXTURES|MEGA_FIXTURES|UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|COUNTDOWN|TIMER|TIMER_ONLY)';

    // 1. Mustache: {{PREFIX_SUFFIX:attrs}} or {{SUFFIX:attrs}}
    $text = preg_replace_callback('/\{\{\s*(?:(' . $prefPat . ')_)?(' . $suffPat . ')([\s:][^}]*)?\}\}/i', function($m) use ($dispatcher) {
        return $dispatcher($m[0], $m[1] ?? '', $m[2], $m[3] ?? '');
    }, $text);

    // 2. HTML comments: <!-- PREFIX_SUFFIX:attrs -->
    $text = preg_replace_callback('/<!--\s*(?:(' . $prefPat . ')_)?(' . $suffPat . ')([\s:][^-]*)?-->/i', function($m) use ($dispatcher) {
        return $dispatcher($m[0], $m[1] ?? '', $m[2], $m[3] ?? '');
    }, $text);

    // 3. Brackets: [PREFIX_SUFFIX:attrs]
    $text = preg_replace_callback('/(?<!\[)\[(?!\[)\s*(?:(' . $prefPat . ')_)?(' . $suffPat . ')([\s:][^\]]*)?\](?!\])/i', function($m) use ($dispatcher) {
        return $dispatcher($m[0], $m[1] ?? '', $m[2], $m[3] ?? '');
    }, $text);

    // Specific Shorthand: {{ALL_..._FIXTURES}} and {{TOP_..._FIXTURES}}
    $text = preg_replace_callback('/\{\{\s*ALL_(' . $prefPat . ')_FIXTURES([\s:][^}]*)?\}\}/i', function($m) use ($dispatcher) {
        return $dispatcher($m[0], $m[1], 'ALL_FIXTURES', $m[2] ?? '');
    }, $text);
    $text = preg_replace_callback('/\{\{\s*TOP_(' . $prefPat . ')_FIXTURES([\s:][^}]*)?\}\}/i', function($m) use ($dispatcher) {
        return $dispatcher($m[0], $m[1], 'TOP_FIXTURES', $m[2] ?? '');
    }, $text);

    // Today Fixtures Direct Mappings
    $todayMap = [
        'TODAY_TOP_FIXTURES'                 => $topTwoTodayStr,
        'TODAY_TOP_TWO_FIXTURES'             => $topTwoTodayStr,
        'TOP_TWO_TODAY_FIXTURES'             => $topTwoTodayStr,
        'TOP_TODAY_FIXTURES'                 => $topTwoTodayStr,
        'TODAY_TOP_2_FIXTURES'               => $topTwoTodayStr,
        'TOP_2_TODAY_FIXTURES'               => $topTwoTodayStr,
        'TOP_TWO_FIXTURES'                   => $topTwoTodayStr,

        'TODAY_LEAGUES'                      => $todayLeaguesStr,
        'TODAY_LEAGUE_NAMES'                 => $todayLeaguesStr,
        'TODAY_FIXTURES_LEAGUES'             => $todayLeaguesStr,
        'TODAY_FIXTURES_LEAGUE_NAMES'        => $todayLeaguesStr,
        'LEAGUES_TODAY'                      => $todayLeaguesStr,

        'TODAY_PREDICTIONS_COUNT'            => $todayCountStr,
        'TODAY_PREDICTION_COUNT'             => $todayCountStr,
        'TODAY_COUNT'                        => $todayCountStr,
        'TODAY_FIXTURES_COUNT'               => $todayCountStr,

        'TODAY_PREDICTIONS'                  => $todayPredSummaryStr,
        'TODAY_PREDICTIONS_SUMMARY'          => $todayPredSummaryStr,
        'TODAY_PREDICTION_SUMMARY'           => $todayPredSummaryStr,
        'TODAY_PREDICTIONS_DISTRIBUTION'     => $todayPredSummaryStr,
        'PREDICTIONS_SUMMARY'                => $todayPredSummaryStr,
        'DATE'                               => date('F j, Y'),
        'YEAR'                               => date('Y'),
    ];

    foreach ($todayMap as $k => $val) {
        $escapedK = preg_quote($k, '/');
        $text = preg_replace('/\{\{\s*' . $escapedK . '\s*\}\}/i', $val, $text);
        $text = preg_replace('/<!--\s*' . $escapedK . '\s*-->/i', $val, $text);
        $text = preg_replace('/(?<!\[)\[(?!\[)\s*' . $escapedK . '\s*\](?!\])/i', $val, $text);
    }

    // Clean out raw markdown marker headings and HTML comments
    $text = preg_replace('/^#{1,4}\s*(INTRO|MIDDLE|MEAT|FAQ|MIDDLE_CONTENT|MEAT_CONTENT|RESPONSIBLE_GAMBLING_START|RESPONSIBLE_GAMBLING_END)\s*$/im', '', $text);
    $text = preg_replace('/<!--\s*(?:INTRO|MIDDLE|MEAT|RESPONSIBLE_GAMBLING_START|RESPONSIBLE_GAMBLING_END|INTRO_START|INTRO_END)\s*-->/i', '', $text);

    return $text;
}

/**
 * Parses markdown body text into semantic, high-readability HTML matching the React MarkdownRenderer
 */
function parseMarkdownToHtml(string $md, string $postSlug = '', string $jackpotId = ''): string {
    $lines = explode("\n", $md);
    $html = '';
    $inList = false;
    $listType = 'ul';
    $inTable = false;
    $tableRows = [];

    $i = 0;
    $count = count($lines);

    while ($i < $count) {
        $rawLine = $lines[$i];
        $trim = trim($rawLine);

        // Blank line
        if ($trim === '') {
            if ($inList) {
                $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n");
                $inList = false;
            }
            if ($inTable) {
                $html .= renderTableHtml($tableRows);
                $inTable = false;
                $tableRows = [];
            }
            $i++;
            continue;
        }

        // UI Countdown Timer Tag
        if (preg_match('/^(?:\[\[|\[|\{\{|\{\{\s*)?(UI_TIMER|JACKPOT_TIMER|COUNTDOWN_TIMER|TIMER|COUNTDOWN|MEGA_JACKPOT_TIMER|SPORTPESA_MEGA_TIMER|BETIKA_MIDWEEK_TIMER|TIMER_ONLY)(?::([a-zA-Z0-9_-]+))?(?:\]\]|\]|\}\}|\s*\}\})?$/i', $trim, $tm)) {
            if ($inList) { $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n"); $inList = false; }
            if ($inTable) { $html .= renderTableHtml($tableRows); $inTable = false; $tableRows = []; }
            
            $targetJackpotId = !empty($tm[2]) ? $tm[2] : ($jackpotId ?: 'sportpesa-mega');
            ob_start();
            $jId = $targetJackpotId;
            include __DIR__ . '/views/components/jackpot_countdown_timer.php';
            $timerHtml = ob_get_clean();

            $html .= "<div class=\"my-5 w-full\">{$timerHtml}</div>\n";
            $i++;
            continue;
        }

        // Table row
        if (strpos($trim, '|') === 0 || substr($trim, -1) === '|') {
            if (preg_match('/^\|[\s\-:|]+\|$/', $trim)) {
                $i++;
                continue;
            }
            $inTable = true;
            $tableRows[] = $trim;
            $i++;
            continue;
        } elseif ($inTable) {
            $html .= renderTableHtml($tableRows);
            $inTable = false;
            $tableRows = [];
        }

        // Display Math $$ formula $$
        if (preg_match('/^\$\$([^\$]+)\$\$$/', $trim, $mathM)) {
            if ($inList) { $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n"); $inList = false; }
            $formattedMath = formatMathLatex($mathM[1]);
            $html .= "<div class=\"p-3.5 my-3 rounded-2xl bg-slate-900 text-white font-mono text-xs font-bold text-center border border-slate-700 shadow-xs tracking-wide\">{$formattedMath}</div>\n";
            $i++;
            continue;
        }

        // Headings
        if (preg_match('/^(#{1,4})\s+(.*)$/', $trim, $m)) {
            if ($inList) { $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n"); $inList = false; }
            $level = strlen($m[1]);
            $titleRaw = $m[2];
            $titleSlug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', strip_tags($titleRaw)), '-'));
            $titleHtml = formatInlineMarkdown($titleRaw, $postSlug);

            if ($level === 1) {
                $html .= "<h2 id=\"{$titleSlug}\" class=\"text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4 mt-8 font-display scroll-mt-24 border-b border-slate-200 pb-2\">{$titleHtml}</h2>\n";
            } elseif ($level === 2) {
                $html .= "<h2 id=\"{$titleSlug}\" class=\"text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-3.5 scroll-mt-24 pb-2 border-b border-slate-200/80\">{$titleHtml}</h2>\n";
            } elseif ($level === 3) {
                $html .= "<h3 id=\"{$titleSlug}\" class=\"text-base sm:text-lg font-extrabold text-slate-900 mt-7 mb-2.5 scroll-mt-24\">{$titleHtml}</h3>\n";
            } else {
                $html .= "<h4 class=\"text-xs sm:text-sm font-bold text-blue-600 mt-4 mb-1.5 font-mono tracking-wider\">{$titleHtml}</h4>\n";
            }
            $i++;
            continue;
        }

        // Callouts & Blockquotes
        if (strpos($trim, '>') === 0) {
            if ($inList) { $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n"); $inList = false; }
            $rawBq = trim(substr($trim, 1));

            // GitHub-style callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
            if (preg_match('/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*(.*)$/i', $rawBq, $calloutM)) {
                $type = strtoupper($calloutM[1]);
                $calloutText = formatInlineMarkdown($calloutM[2], $postSlug);

                if ($type === 'TIP') {
                    $html .= "<div class=\"p-4 my-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/70 text-xs text-emerald-950 flex items-start gap-3 shadow-xs\"><span class=\"text-emerald-600 font-bold shrink-0\">💡 TIP:</span><div class=\"leading-relaxed\">{$calloutText}</div></div>\n";
                } elseif ($type === 'WARNING') {
                    $html .= "<div class=\"p-4 my-3.5 rounded-2xl border border-amber-300 bg-amber-50/70 text-xs text-amber-950 flex items-start gap-3 shadow-xs\"><span class=\"text-amber-600 font-bold shrink-0\">⚠️ WARNING:</span><div class=\"leading-relaxed\">{$calloutText}</div></div>\n";
                } elseif ($type === 'IMPORTANT') {
                    $html .= "<div class=\"p-4 my-3.5 rounded-2xl border border-indigo-300 bg-indigo-50/70 text-xs text-indigo-950 flex items-start gap-3 shadow-xs\"><span class=\"text-indigo-600 font-bold shrink-0\">📌 IMPORTANT:</span><div class=\"leading-relaxed\">{$calloutText}</div></div>\n";
                } else {
                    $html .= "<div class=\"p-4 my-3.5 rounded-2xl border border-blue-300 bg-blue-50/70 text-xs text-blue-950 flex items-start gap-3 shadow-xs\"><span class=\"text-blue-600 font-bold shrink-0\">ℹ️ NOTE:</span><div class=\"leading-relaxed\">{$calloutText}</div></div>\n";
                }
            } else {
                $bqText = formatInlineMarkdown($rawBq, $postSlug);
                $html .= "<blockquote class=\"p-3.5 my-3 border-l-4 border-blue-600 bg-blue-50/50 text-xs text-slate-700 rounded-r-xl leading-relaxed\">{$bqText}</blockquote>\n";
            }
            $i++;
            continue;
        }

        // Bullet lists
        if (preg_match('/^[-*+]\s+(.*)$/', $trim, $m)) {
            if (!$inList || $listType !== 'ul') {
                if ($inList) $html .= "</ol>\n";
                $html .= "<ul class=\"space-y-1.5 my-3 text-xs leading-relaxed text-slate-700 list-disc pl-5\">\n";
                $inList = true;
                $listType = 'ul';
            }
            $itemText = formatInlineMarkdown($m[1], $postSlug);
            $html .= "  <li>{$itemText}</li>\n";
            $i++;
            continue;
        }

        // Numbered lists
        if (preg_match('/^\d+\.\s+(.*)$/', $trim, $m)) {
            if (!$inList || $listType !== 'ol') {
                if ($inList) $html .= "</ul>\n";
                $html .= "<ol class=\"space-y-1.5 my-3 text-xs leading-relaxed text-slate-700 list-decimal pl-5\">\n";
                $inList = true;
                $listType = 'ol';
            }
            $itemText = formatInlineMarkdown($m[1], $postSlug);
            $html .= "  <li>{$itemText}</li>\n";
            $i++;
            continue;
        }

        if ($inList) {
            $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n");
            $inList = false;
        }

        // Standard Paragraph
        $pText = formatInlineMarkdown($trim, $postSlug);
        $html .= "<p class=\"text-xs leading-relaxed text-slate-700 my-2.5 font-sans\">{$pText}</p>\n";
        $i++;
    }

    if ($inList) $html .= ($listType === 'ul' ? "</ul>\n" : "</ol>\n");
    if ($inTable) $html .= renderTableHtml($tableRows);

    return $html;
}

function renderTableHtml(array $rows): string {
    if (empty($rows)) return '';
    $out = "<div class=\"overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-2xs bg-white text-left\">\n";
    $out .= "<table class=\"w-full text-left text-xs border-collapse\">\n";

    $isHeader = true;
    foreach ($rows as $r) {
        $cells = array_map('trim', explode('|', trim($r, '|')));
        if ($isHeader) {
            $out .= "<thead><tr class=\"bg-slate-100 border-b border-slate-200 text-[11px] font-mono text-slate-900\">\n";
            foreach ($cells as $c) {
                $out .= "<th class=\"p-3 font-bold\">" . formatInlineMarkdown($c, '') . "</th>\n";
            }
            $out .= "</tr></thead><tbody>\n";
            $isHeader = false;
        } else {
            $out .= "<tr class=\"border-b border-slate-200 hover:bg-slate-50 transition-colors\">\n";
            foreach ($cells as $c) {
                $out .= "<td class=\"p-3\">" . formatInlineMarkdown($c, '') . "</td>\n";
            }
            $out .= "</tr>\n";
        }
    }

    $out .= "</tbody></table></div>\n";
    return $out;
}

function formatMathLatex(string $expr): string {
    $map = [
        '\\times' => '×',
        '\\lambda' => 'λ',
        '\\cdot' => '·',
        '\\approx' => '≈',
        '\\geq' => '≥',
        '\\ge' => '≥',
        '\\leq' => '≤',
        '\\le' => '≤',
        '\\pm' => '±',
        '^{17}' => '¹⁷',
        '^2' => '²',
        '^3' => '³',
        '^N' => 'ᴺ',
        '{' => '',
        '}' => '',
    ];
    $expr = preg_replace('/\\\\text\{([^}]+)\}/', '$1', $expr);
    $expr = str_replace(array_keys($map), array_values($map), $expr);
    return trim($expr);
}

function formatInlineMarkdown(string $text, string $postSlug = ''): string {
    // Images: ![alt](url)
    $text = preg_replace_callback('/!\[(.*?)\]\((.*?)\)/', function($m) {
        $alt = htmlspecialchars($m[1], ENT_QUOTES);
        $url = htmlspecialchars($m[2], ENT_QUOTES);
        return "<img src=\"{$url}\" alt=\"{$alt}\" class=\"inline-block max-w-full h-auto rounded-xl border border-slate-200 my-2 align-middle\" loading=\"lazy\" />";
    }, $text);

    // Inline Math: $formula$
    $text = preg_replace_callback('/\$([^\$]+)\$/', function($m) {
        $formatted = formatMathLatex($m[1]);
        return "<span class=\"inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-950 font-mono text-[12px] font-bold border border-slate-300 mx-1 align-baseline shadow-3xs\">{$formatted}</span>";
    }, $text);

    // Checklists: [x] or [ ]
    $text = preg_replace('/\[x\]/i', '<span class="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-500 text-white text-[10px] font-bold mr-1.5">✓</span>', $text);
    $text = preg_replace('/\[\s*\]/', '<span class="inline-flex items-center justify-center w-4 h-4 rounded border border-slate-400 bg-white mr-1.5"></span>', $text);

    // Bold **text** or __text__
    $text = preg_replace('/\*\*(.*?)\*\*/', '<strong class="font-bold text-slate-900">$1</strong>', $text);
    $text = preg_replace('/__(.*?)__/', '<strong class="font-bold text-slate-900">$1</strong>', $text);

    // Italic *text* or _text_
    $text = preg_replace('/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/', '<em>$1</em>', $text);
    $text = preg_replace('/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/', '<em>$1</em>', $text);

    // Links [text](url)
    $text = preg_replace_callback('/\[(.*?)\]\((.*?)\)/', function($m) {
        $label = $m[1];
        $url = $m[2];
        $isExt = (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0);
        $attr = $isExt ? ' target="_blank" rel="nofollow noopener noreferrer"' : '';
        return "<a href=\"{$url}\"{$attr} class=\"text-blue-600 underline font-bold hover:text-blue-800 transition-colors\">{$label}</a>";
    }, $text);

    // Code `text`
    $text = preg_replace('/`(.*?)`/', '<code class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] text-blue-600">$1</code>', $text);

    return $text;
}
