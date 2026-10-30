<?php
/**
 * Cheerplex - Core Application Configuration
 *
 * DATA_SOURCE CONFIGURATION:
 * Switch between 'api' (fetch real database records from Backend REST API)
 * or 'database' (direct MySQL connection for local XAMPP / production cPanel).
 *
 * To switch on your local computer, either:
 * 1. Change DATA_SOURCE below from 'api' to 'database'
 * 2. Or set environment variable: DATA_SOURCE=database
 */

// Set Default Timezone to East Africa Time (EAT / Africa/Nairobi, UTC+3)
date_default_timezone_set('Africa/Nairobi');

// Application Environment
define('APP_NAME', 'Cheerplex');
define('APP_TAGLINE', 'Your Best Sports Lab • Nairobi');
define('APP_URL', getenv('APP_URL') ?: 'https://cheerplex.co.ke');
define('BASE_URL', rtrim(APP_URL, '/'));

// Data Source Mode: 'api' (default for live data & cloud preview) OR 'database' (direct MySQL)
define('DATA_SOURCE', getenv('DATA_SOURCE') ?: 'api');

// Standalone Remote Backend API Base URL
define('BACKEND_API_URL', getenv('BACKEND_API_URL') ?: (getenv('API_BASE_URL') ?: 'https://cheerplex.co.ke/soka_king'));

// Direct Database Configuration (Local MySQL / XAMPP / cPanel / Remote)
define('DB_HOST', getenv('MYSQL_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('MYSQL_PORT') ?: '3306');
define('DB_USER', getenv('MYSQL_USER') ?: 'root');
define('DB_PASS', getenv('MYSQL_PASSWORD') ?: '');
define('DB_NAME', getenv('MYSQL_DB_NAME') ?: 'soka_king');

// Safaricom M-Pesa Daraja API Settings
define('MPESA_ENV', getenv('MPESA_ENV') ?: 'sandbox');
define('MPESA_SHORTCODE', getenv('MPESA_SHORTCODE') ?: '174379');
define('MPESA_PASSKEY', getenv('MPESA_PASSKEY') ?: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919');
define('MPESA_CONSUMER_KEY', getenv('MPESA_CONSUMER_KEY') ?: '');
define('MPESA_CONSUMER_SECRET', getenv('MPESA_CONSUMER_SECRET') ?: '');

// Official Site Contacts & Social Profiles
$SITE_CONTACTS = [
    'email'     => 'support@cheerplex.co.ke',
    'phone'     => '+254740841375',
    'whatsapp'  => '+254740841375',
    'telegram'  => 'https://t.me/cheerplex',
    'facebook'  => 'https://facebook.com/cheerplexkenya',
    'twitter'   => 'https://x.com/cheerplex_ke',
    'instagram' => 'https://instagram.com/cheerplex_ke',
    'youtube'   => 'https://youtube.com/@cheerplex',
];

// Universal Tracking & Tag Management Configuration (Google Analytics, GTM, Search Console, Bing, Ads)
// Easily configured here or overridden via environment variables
$TRACKING_CONFIG = [
    // Google Tag Manager Container ID (e.g. 'GTM-XXXXXXX')
    'gtm_id'                  => getenv('GTM_ID') ?: '',

    // Google Analytics 4 Measurement ID (e.g. 'G-XXXXXXXXXX')
    'ga4_id'                  => getenv('GA4_ID') ?: getenv('GOOGLE_ANALYTICS_ID') ?: '',

    // Google Search Console Site Verification Token (HTML Tag content)
    'google_site_verification'=> getenv('GOOGLE_SITE_VERIFICATION') ?: 'ptOWeTPZchVnLBWNCReuXG6sxRJDaweP28E4-K8sYP4',

    // Bing Webmaster Tools Site Verification Token
    'bing_site_verification'  => getenv('BING_SITE_VERIFICATION') ?: '1A600774982D9BE0D208D29D6B27C7FC',

    // Google AdSense Publisher ID (e.g. 'ca-pub-XXXXXXXXXXXXXXXX')
    'adsense_client_id'       => getenv('ADSENSE_CLIENT_ID') ?: '',

    // Meta / Facebook Pixel ID (e.g. 'XXXXXXXXXXXXXXXX')
    'meta_pixel_id'           => getenv('META_PIXEL_ID') ?: '',

    // Raw Custom Header Scripts / Tags (injected cleanly right before </head>)
    'custom_head_tags'        => getenv('CUSTOM_HEAD_TAGS') ?: '',

    // Raw Custom Body Start Scripts (e.g. GTM <noscript> iframe right after <body>)
    'custom_body_tags'        => getenv('CUSTOM_BODY_TAGS') ?: '',
];

