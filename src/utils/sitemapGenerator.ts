import fs from 'fs';
import path from 'path';
import { getAllMarkdownPages, getMarkdownContent } from '../content/markdownLoader';
import { getPageIdFromUrl } from './navigation';
import { getPageDateModified } from './cycleDateModified';

export const BASE_URL = 'https://cheerplex.co.ke';

export function getMarkdownRoutesSet(): Set<string> {
  const mdRoutes = new Set<string>();

  // 1. Scan markdownLoader (includes markdownData.ts and parsed pages)
  try {
    const allMd = getAllMarkdownPages();
    for (const { pageKey, page } of allMd) {
      if (page.link) {
        let normLink = page.link.toLowerCase().trim();
        if (!normLink.startsWith('/')) normLink = '/' + normLink;
        if (normLink.endsWith('/') && normLink !== '/') normLink = normLink.slice(0, -1);
        mdRoutes.add(normLink);
      } else {
        mdRoutes.add(`/${pageKey}`);
      }
    }
  } catch (err) {
    console.error('Error getting markdown pages for sitemap:', err);
  }

  // 2. Automatically scan all physical markdown files in src/content/pages/
  try {
    const pagesDir = path.join(process.cwd(), 'src/content/pages');
    if (fs.existsSync(pagesDir)) {
      const files = fs.readdirSync(pagesDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
          const linkMatch = content.match(/^(?:link|Link):\s*"?(.*?)"?$/m);
          if (linkMatch && linkMatch[1]) {
            let normLink = linkMatch[1].trim();
            if (!normLink.startsWith('/')) normLink = '/' + normLink;
            if (normLink.endsWith('/') && normLink !== '/') normLink = normLink.slice(0, -1);
            mdRoutes.add(normLink);
          } else {
            const pageSlug = file.replace(/\.md$/, '').toLowerCase();
            mdRoutes.add(`/${pageSlug}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error reading markdown directory for sitemap:', err);
  }

  return mdRoutes;
}

export function isLowerPriorityRoute(p: string): boolean {
  const norm = p.toLowerCase().trim();
  const lowerRoutes = new Set([
    '/contact',
    '/contact-us',
    '/contact-support',
    '/support',
    '/jackpot-list',
    '/jackpot-tips',
    '/jackpots',
    '/premium-jackpots',
    '/vip-packages',
    '/vip',
    '/vip-subscription',
    '/vip-tips',
    '/odds-packs',
    '/odds-slips',
    '/odds-pack',
    '/odds',
    '/responsible-gambling',
  ]);

  if (lowerRoutes.has(norm)) return true;

  return (
    norm.includes('contact') ||
    norm.includes('responsible-gambling') ||
    norm === '/jackpot-list' ||
    norm === '/jackpot-tips' ||
    norm === '/vip-packages' ||
    norm.includes('odds-pack') ||
    norm.includes('odds-slip')
  );
}

export const CHEERPLEX_CANONICAL_SITEMAP = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/contact/', changefreq: 'weekly', priority: '0.9' },
  { path: '/cheerplex-1x2-prediction-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-free-predictions-and-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-gg-prediction-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-jackpots-predictions-and-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-sure-tips-and-odds/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-today-prediction-betting-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-tomorrow-prediction/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-vip-tips/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-betting-tips/', changefreq: 'daily', priority: '0.9' },
  { path: '/cheerplex-mega-jackpot-prediction/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-sportpesa-jackpot-prediction/', changefreq: 'weekly', priority: '0.8' },
  { path: '/chearplex-prediction/', changefreq: 'weekly', priority: '0.8' },
  { path: '/cheerplex-jackpots-predictions-and-tips/betika-midweek/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-jackpots-predictions-and-tips/mozzart-grand/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-sure-tips-and-odds/odds-9plus/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-sure-tips-and-odds/odds-5plus/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-sure-tips-and-odds/odds-3plus/', changefreq: 'monthly', priority: '0.7' },
  { path: '/cheerplex-sure-tips-and-odds/odds-7plus/', changefreq: 'monthly', priority: '0.7' },
];

export function getAllSitemapRoutes(): string[] {
  return CHEERPLEX_CANONICAL_SITEMAP.map(item => item.path);
}

export function generateSitemapXml(): string {
  const urlEntries = CHEERPLEX_CANONICAL_SITEMAP.map((item) => {
    const fullUrl = item.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${item.path}`;
    const pageId = getPageIdFromUrl(item.path);
    let pageLastMod = '';
    try {
      const pageMd = getMarkdownContent(pageId);
      pageLastMod = getPageDateModified(pageId, pageMd);
    } catch {
      pageLastMod = '2026-09-26T11:00:00+03:00';
    }

    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${pageLastMod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}
