<?php
/**
 * Cheerplex - PHP Built-in Server Router Script
 * Usage: php -S 127.0.0.1:8080 router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serve existing public files directly (exclude /sitemap.xml so dynamic generator in index.php runs)
if ($uri !== '/' && $uri !== '/sitemap.xml') {
    // Check root files
    $rootFile = __DIR__ . $uri;
    if (is_file($rootFile)) {
        return false;
    }

    // Check public/ directory
    $cleanUri = preg_replace('#^/public/#', '/', $uri);
    $publicFile = __DIR__ . '/public' . $cleanUri;
    if (is_file($publicFile)) {
        $ext = strtolower(pathinfo($publicFile, PATHINFO_EXTENSION));
        $mimeTypes = [
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'svg'  => 'image/svg+xml',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'ico'  => 'image/x-icon',
            'json' => 'application/json',
            'xml'  => 'application/xml',
            'txt'  => 'text/plain',
            'webp' => 'image/webp',
        ];
        if (isset($mimeTypes[$ext])) {
            header('Content-Type: ' . $mimeTypes[$ext]);
        }
        readfile($publicFile);
        return true;
    }
}

// Route everything else through index.php
require __DIR__ . '/index.php';
