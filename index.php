<?php
/**
 * Cheerplex - Main Front Controller & Application Router
 * Pure PHP Full-Stack Entry Point
 */

require_once __DIR__ . '/app/config.php';
require_once __DIR__ . '/app/db.php';
require_once __DIR__ . '/app/helpers.php';
require_once __DIR__ . '/app/markdown_loader.php';
if (file_exists(__DIR__ . '/app/tracking.php')) {
    require_once __DIR__ . '/app/tracking.php';
}

$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = parse_url($rawUri, PHP_URL_PATH);

// Canonical Trailing Slash Enforcement (Except root '/', API routes, and static assets with extensions)
if ($uri !== '/' && strpos($uri, '/api/') !== 0 && !preg_match('/\.[a-zA-Z0-9]+$/', $uri) && !str_ends_with($uri, '/')) {
    $q = parse_url($rawUri, PHP_URL_QUERY);
    $dest = $uri . '/' . ($q ? '?' . $q : '');
    header("Location: " . $dest, true, 301);
    exit;
}

// 1. Handle API Endpoints
if (strpos($uri, '/api/') === 0) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Database Table Scanner Endpoint
    if (strpos($uri, '/api/database/scan') === 0 || strpos($uri, '/api/database/tables') === 0 || strpos($uri, '/api/scan-tables') === 0) {
        echo json_encode(DB::scanDatabase(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Vote handling endpoint (GET to fetch stats / batch stats, POST to record vote)
    if (strpos($uri, '/api/predictions/vote') === 0 || strpos($uri, '/api/vote') === 0) {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $userId = $input['userId'] ?? $_GET['userId'] ?? 'guest';
        $choice = $input['vote'] ?? $input['choice'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($choice)) {
            $fId = $input['fixtureId'] ?? $_GET['fixtureId'] ?? '1';
            $prediction = $input['prediction'] ?? $_GET['prediction'] ?? null;
            $result = recordFixtureVote($fId, $userId, $choice, $prediction);
            echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            exit;
        } else {
            $batchParam = $_GET['fixtures'] ?? $_GET['fixtureIds'] ?? $input['fixtures'] ?? $input['fixtureIds'] ?? null;
            if (!empty($batchParam)) {
                $ids = is_array($batchParam) ? $batchParam : array_filter(array_map('trim', explode(',', (string)$batchParam)));
                $statsMap = getBatchFixtureVoteStats($ids, $userId);
                echo json_encode(['success' => true, 'votes' => $statsMap], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                exit;
            } else {
                $fId = $input['fixtureId'] ?? $_GET['fixtureId'] ?? '1';
                $stats = getFixtureVoteStats($fId, $userId, true);
                echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                exit;
            }
        }
    }

    if (strpos($uri, '/api/predictions') === 0) {
        $category = $_GET['category'] ?? null;
        if (!empty($category)) {
            $data = getFixturesByCategory($category);
        } else {
            $data = getAllPredictions();
        }
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/jackpots') === 0) {
        echo json_encode(getAllJackpots(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/vip-packages') === 0) {
        echo json_encode(getVipPackages(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/odds-packs') === 0) {
        echo json_encode(getOddsPacks(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/external-links') === 0) {
        echo json_encode(getExternalLinks(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/partners') === 0) {
        $partners = fetchRemoteApi('/api/partners');
        echo json_encode($partners ?: [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/site-settings') === 0) {
        $settings = fetchRemoteApi('/api/site-settings');
        echo json_encode($settings ?: $SITE_CONTACTS, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (strpos($uri, '/api/mpesa/stkpush') === 0) {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $phone = $input['phoneNumber'] ?? '0740841375';
        $amount = (int)($input['amount'] ?? 150);
        $checkoutId = 'ws_CO_' . date('dmYHis') . '_' . rand(1000, 9999);

        echo json_encode([
            'success'           => true,
            'ResponseCode'      => '0',
            'ResponseDescription' => 'Success. Request accepted for processing',
            'MerchantRequestID' => 'MR_' . rand(10000, 99999),
            'CheckoutRequestID' => $checkoutId,
            'CustomerMessage'   => 'Success. Enter M-Pesa PIN on your phone to complete payment.',
        ]);
        exit;
    }

    if (strpos($uri, '/api/mpesa/status') === 0) {
        echo json_encode([
            'success'    => true,
            'status'     => 'completed',
            'ResultCode' => 0,
            'ResultDesc' => 'The service request is processed successfully.',
        ]);
        exit;
    }

    if (strpos($uri, '/api/vip-packages') === 0) {
        echo json_encode([
            'success' => true,
            'data'    => getVipPackages(),
        ]);
        exit;
    }

    if (strpos($uri, '/api/odds-packs') === 0) {
        echo json_encode([
            'success' => true,
            'data'    => getOddsPacks(),
        ]);
        exit;
    }

    echo json_encode(['error' => 'API endpoint not found'], 404);
    exit;
}

// 2. Handle Sitemap XML
if ($uri === '/sitemap.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    if (function_exists('generatePhpSitemapXml')) {
        echo generatePhpSitemapXml();
        exit;
    } elseif (file_exists(__DIR__ . '/public/sitemap.xml')) {
        readfile(__DIR__ . '/public/sitemap.xml');
        exit;
    }
}

// 3. Handle Robots TXT
if ($uri === '/robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    if (file_exists(__DIR__ . '/public/robots.txt')) {
        readfile(__DIR__ . '/public/robots.txt');
        exit;
    }
}

// 4. Resolve Route to View Page
$pageId = resolveRoute($uri);
$pageMeta = getMetadata($pageId);

// Start Output Buffering
ob_start();

// Include Header
include __DIR__ . '/app/views/layout/header.php';

// Route View Rendering
$isCategoryPage = (
    strpos($pageId, 'category-') === 0 ||
    in_array($pageId, [
        'cheerplex-today-prediction-betting-tips',
        'cheerplex-tomorrow-prediction',
        'cheerplex-yesterday-prediction',
        'cheerplex-1x2-prediction-tips',
        'cheerplex-gg-prediction-tips',
        'cheerplex-free-predictions-and-tips',
        'cheerplex-sure-tips-and-odds',
        'cheerplex-betting-tips',
        'chearplex-prediction'
    ])
);

$isJackpotDetailPage = in_array($pageId, [
    'sportpesa-mega', 
    'sportpesa-midweek', 
    'betika-midweek', 
    'mozzart-grand', 
    'mozzart-super-daily',
    'cheerplex-mega-jackpot-prediction',
    'cheerplex-sportpesa-jackpot-prediction'
]);

if ($pageId === 'home') {
    include __DIR__ . '/app/views/pages/home.php';
} elseif ($isCategoryPage) {
    $categoryId = $pageId;
    include __DIR__ . '/app/views/pages/category.php';
} elseif ($pageId === 'jackpot-list' || $pageId === 'cheerplex-jackpots-predictions-and-tips') {
    include __DIR__ . '/app/views/pages/jackpot_list.php';
} elseif ($isJackpotDetailPage) {
    $jackpotId = $pageId;
    if ($jackpotId === 'cheerplex-mega-jackpot-prediction') $jackpotId = 'sportpesa-mega';
    if ($jackpotId === 'cheerplex-sportpesa-jackpot-prediction') $jackpotId = 'sportpesa-midweek';
    include __DIR__ . '/app/views/pages/jackpot_detail.php';
} elseif ($pageId === 'vip-packages' || $pageId === 'cheerplex-vip-tips') {
    include __DIR__ . '/app/views/pages/vip_packages.php';
} elseif ($pageId === 'contact' || $pageId === 'contact-us') {
    include __DIR__ . '/app/views/pages/contact.php';
} elseif ($pageId === 'responsible-gambling') {
    include __DIR__ . '/app/views/pages/responsible_gambling.php';
} elseif (file_exists(__DIR__ . '/src/content/pages/' . $pageId . '.md')) {
    $pageKey = $pageId;
    $mdData = loadMarkdownPage($pageKey);
    $frontmatter = $mdData['frontmatter'] ?? [];
    $type = strtolower(trim($frontmatter['type'] ?? ''));
    $categoryChoice = $frontmatter['fixturesCategory'] ?? $frontmatter['category'] ?? '';

    if ($type === 'jackpot' || !empty($frontmatter['jackpotId'])) {
        $jackpotId = $frontmatter['jackpotId'] ?? $pageId;
        include __DIR__ . '/app/views/pages/jackpot_detail.php';
    } elseif ($type === 'category' || !empty($categoryChoice) || $type === 'competitor') {
        $categoryId = !empty($categoryChoice) ? normalizeCategorySlug($categoryChoice) : 'category-today';
        include __DIR__ . '/app/views/pages/category.php';
    } else {
        include __DIR__ . '/app/views/pages/markdown_page.php';
    }
} else {
    include __DIR__ . '/app/views/pages/home.php';
}

// Include Footer
include __DIR__ . '/app/views/layout/footer.php';

// Flush Output
ob_end_flush();
