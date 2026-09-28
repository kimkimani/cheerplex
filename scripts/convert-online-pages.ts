import fs from 'fs';
import path from 'path';

function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove comment markers
  md = md.replace(/<!--[\s\S]*?-->/g, '');

  // Strip scripts and styles if any
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // Links
  md = md.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Bold & Italics
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_match, p1) => {
    return '\n' + p1.trim().split('\n').map((l: string) => '> ' + l.trim()).join('\n') + '\n';
  });

  // Pre / Code
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
  md = md.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, p1) => {
    const items = [...p1.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => '- ' + m[1].replace(/<[^>]+>/g, '').trim());
    return '\n' + items.join('\n') + '\n';
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_match, p1) => {
    let idx = 1;
    const items = [...p1.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => `${idx++}. ` + m[1].replace(/<[^>]+>/g, '').trim());
    return '\n' + items.join('\n') + '\n';
  });

  // Paragraphs & breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n');
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Tables
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_match, tableHtml) => {
    const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    let tableMd = '\n';
    let isHeader = true;
    for (const r of rows) {
      const cells = [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c => c[1].replace(/<[^>]+>/g, '').trim());
      if (cells.length > 0) {
        tableMd += '| ' + cells.join(' | ') + ' |\n';
        if (isHeader) {
          tableMd += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
          isHeader = false;
        }
      }
    }
    return tableMd + '\n';
  });

  // Remove any remaining tags
  md = md.replace(/<[^>]+>/g, '');

  // HTML entities decoding
  md = md.replace(/&amp;/g, '&')
         .replace(/&quot;/g, '"')
         .replace(/&#039;/g, "'")
         .replace(/&apos;/g, "'")
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&nbsp;/g, ' ');

  // Clean extra blank lines
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

const pages = [
  { slug: 'home', file: 'home.md', url: '/', type: 'home' },
  { slug: 'cheerplex-1x2-prediction-tips', file: 'cheerplex-1x2-prediction-tips.md', url: '/cheerplex-1x2-prediction-tips/', type: 'category' },
  { slug: 'cheerplex-tomorrow-prediction', file: 'cheerplex-tomorrow-prediction.md', url: '/cheerplex-tomorrow-prediction/', type: 'category' },
  { slug: 'mozzart-super-daily', file: 'mozzart-super-daily.md', url: '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily/', type: 'jackpot' },
  { slug: 'cheerplex-free-predictions-and-tips', file: 'cheerplex-free-predictions-and-tips.md', url: '/cheerplex-free-predictions-and-tips/', type: 'category' },
  { slug: 'betika-midweek', file: 'betika-midweek.md', url: '/cheerplex-jackpots-predictions-and-tips/betika-midweek/', type: 'jackpot' },
  { slug: 'sportpesa-midweek', file: 'sportpesa-midweek.md', url: '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/', type: 'jackpot' },
  { slug: 'cheerplex-sure-tips-and-odds', file: 'cheerplex-sure-tips-and-odds.md', url: '/cheerplex-sure-tips-and-odds/', type: 'category' },
  { slug: 'cheerplex-gg-prediction-tips', file: 'cheerplex-gg-prediction-tips.md', url: '/cheerplex-gg-prediction-tips/', type: 'category' },
  { slug: 'sportpesa-mega', file: 'sportpesa-mega.md', url: '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/', type: 'jackpot' },
  { slug: 'contact', file: 'contact.md', url: '/contact/', type: 'static' }
];

function extractPageContent(slug: string, rawHtml: string): string {
  if (slug === 'contact') {
    // Extract main text from contact
    const mainMatch = rawHtml.match(/<main[\s\S]*?<\/main>/i);
    if (mainMatch) {
      return mainMatch[0];
    }
  }

  // 1. Check for md-content container
  const mdMatch = rawHtml.match(/id=["']md-content["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (mdMatch) {
    return mdMatch[1];
  }

  // 2. Check for seo-content container
  const seoArticleMatch = rawHtml.match(/<article[^>]*id=["']seo-content["'][^>]*>([\s\S]*?)<\/article>/i);
  if (seoArticleMatch) {
    return seoArticleMatch[1];
  }

  const seoSectionMatch = rawHtml.match(/<section[^>]*class=["'][^"']*seo-content[^"']*["'][^>]*>([\s\S]*?)<\/section>/i);
  if (seoSectionMatch) {
    return seoSectionMatch[1];
  }

  const seoDivMatch = rawHtml.match(/<div[^>]*id=["']seo-content["'][^>]*>([\s\S]*?)<\/div>/i);
  if (seoDivMatch) {
    return seoDivMatch[1];
  }

  return '';
}

for (const p of pages) {
  const htmlFile = `/tmp/${p.slug}.html`;
  if (!fs.existsSync(htmlFile)) continue;
  const rawHtml = fs.readFileSync(htmlFile, 'utf8');

  // Title
  let title = rawHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || '';
  title = title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

  let desc = (rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
              rawHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i))?.[1]?.trim() || '';
  desc = desc.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

  let keywords = (rawHtml.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
                  rawHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i))?.[1]?.trim() || '';
  keywords = keywords.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

  const contentHtml = extractPageContent(p.slug, rawHtml);
  const markdownBody = htmlToMarkdown(contentHtml);

  console.log(`\n================== ${p.slug} ==================`);
  console.log('Title:', title);
  console.log('Desc:', desc);
  console.log('Body length:', markdownBody.length);
  console.log('Preview:\n', markdownBody.slice(0, 300));
}
