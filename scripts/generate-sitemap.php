<?php
/**
 * CLI Script to Generate Sitemap from Markdown Files Only
 * Usage: php scripts/generate-sitemap.php
 */

require_once __DIR__ . '/../app/helpers.php';

echo "Generating sitemap from markdown files...\n";
$xml = generatePhpSitemapXml();

$pubPath = __DIR__ . '/../public/sitemap.xml';
file_put_contents($pubPath, $xml);
echo "Successfully wrote sitemap to {$pubPath}\n";
echo "Total size: " . strlen($xml) . " bytes\n";

// Count URLs in generated XML
preg_match_all('/<loc>(.*?)<\/loc>/', $xml, $matches);
echo "Total URLs included: " . count($matches[1]) . "\n";
foreach ($matches[1] as $url) {
    echo " - " . $url . "\n";
}
