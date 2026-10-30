<?php
/**
 * Cheerplex - Universal Tracking & Tag Management Renderer
 *
 * Injects Google Tag Manager (GTM), Google Analytics (GA4), Google Search Console,
 * Bing Webmaster Tools, Meta Pixel, AdSense, and Custom Head/Body scripts into pages.
 */

/**
 * Render all configured tags, verification meta, analytics, and consent defaults into <head>
 */
function renderHeadTrackingTags(): string {
    global $TRACKING_CONFIG;
    $cfg = $TRACKING_CONFIG ?? [];

    $html = "\n  <!-- ========================================== -->\n";
    $html .= "  <!-- Universal Tracking, SEO & Tag Management  -->\n";
    $html .= "  <!-- ========================================== -->\n";

    // 1. Google Site Verification (Search Console)
    $gVerify = $cfg['google_site_verification'] ?? '';
    if (!empty($gVerify)) {
        $html .= '  <meta name="google-site-verification" content="' . htmlspecialchars($gVerify, ENT_QUOTES, 'UTF-8') . "\">\n";
    }

    // 2. Bing Webmaster Tools Verification
    $bVerify = $cfg['bing_site_verification'] ?? '';
    if (!empty($bVerify)) {
        $html .= '  <meta name="msvalidate.01" content="' . htmlspecialchars($bVerify, ENT_QUOTES, 'UTF-8') . "\">\n";
    }

    // 3. Google AdSense Publisher Auto-Ads tag
    $adsenseId = $cfg['adsense_client_id'] ?? '';
    if (!empty($adsenseId)) {
        $html .= '  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . htmlspecialchars($adsenseId, ENT_QUOTES, 'UTF-8') . '" crossorigin="anonymous"></script>' . "\n";
    }

    // 4. Google Tag Manager (GTM) Head Script
    $gtmId = trim($cfg['gtm_id'] ?? '');
    if (!empty($gtmId)) {
        $html .= "  <!-- Google Tag Manager -->\n";
        $html .= "  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n";
        $html .= "  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n";
        $html .= "  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n";
        $html .= "  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n";
        $html .= "  })(window,document,'script','dataLayer','" . htmlspecialchars($gtmId, ENT_QUOTES, 'UTF-8') . "');</script>\n";
        $html .= "  <!-- End Google Tag Manager -->\n";
    }

    // 6. Google Analytics 4 (gtag.js) Direct Integration (if GTM is not used or alongside)
    $ga4Id = trim($cfg['ga4_id'] ?? '');
    if (!empty($ga4Id) && empty($gtmId)) {
        $html .= "  <!-- Google Analytics 4 (GA4) -->\n";
        $html .= '  <script async src="https://www.googletagmanager.com/gtag/js?id=' . htmlspecialchars($ga4Id, ENT_QUOTES, 'UTF-8') . "\"></script>\n";
        $html .= "  <script>\n";
        $html .= "    window.dataLayer = window.dataLayer || [];\n";
        $html .= "    function gtag(){dataLayer.push(arguments);}\n";
        $html .= "    gtag('js', new Date());\n";
        $html .= "    gtag('config', '" . htmlspecialchars($ga4Id, ENT_QUOTES, 'UTF-8') . "', { 'anonymize_ip': true });\n";
        $html .= "  </script>\n";
    }

    // 7. Meta / Facebook Pixel
    $pixelId = trim($cfg['meta_pixel_id'] ?? '');
    if (!empty($pixelId)) {
        $html .= "  <!-- Meta Pixel Code -->\n";
        $html .= "  <script>\n";
        $html .= "  !function(f,b,e,v,n,t,s)\n";
        $html .= "  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n";
        $html .= "  n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n";
        $html .= "  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n";
        $html .= "  n.queue=[];t=b.createElement(e);t.async=!0;\n";
        $html .= "  t.src=v;s=b.getElementsByTagName(e)[0];\n";
        $html .= "  s.parentNode.insertBefore(t,s)}(window, document,'script',\n";
        $html .= "  'https://connect.facebook.net/en_US/fbevents.js');\n";
        $html .= "  fbq('init', '" . htmlspecialchars($pixelId, ENT_QUOTES, 'UTF-8') . "');\n";
        $html .= "  fbq('track', 'PageView');\n";
        $html .= "  </script>\n";
        $html .= "  <!-- End Meta Pixel Code -->\n";
    }

    // 8. Custom Head Tags (Arbitrary scripts/HTML provided in environment or admin)
    $customHead = $cfg['custom_head_tags'] ?? '';
    if (!empty($customHead)) {
        $html .= "  <!-- Custom Injected Head Tags -->\n";
        $html .= "  " . trim($customHead) . "\n";
    }

    return $html;
}

/**
 * Render custom body tags immediately after <body> opening tag (e.g. GTM <noscript> iframe)
 */
function renderBodyStartTrackingTags(): string {
    global $TRACKING_CONFIG;
    $cfg = $TRACKING_CONFIG ?? [];
    $gtmId = trim($cfg['gtm_id'] ?? '');
    $customBody = trim($cfg['custom_body_tags'] ?? '');

    $html = '';

    if (!empty($gtmId)) {
        $html .= "  <!-- Google Tag Manager (noscript) -->\n";
        $html .= '  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=' . htmlspecialchars($gtmId, ENT_QUOTES, 'UTF-8') . "\"\n";
        $html .= "  height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\n";
        $html .= "  <!-- End Google Tag Manager (noscript) -->\n";
    }

    if (!empty($customBody)) {
        $html .= "  " . $customBody . "\n";
    }

    return $html;
}
