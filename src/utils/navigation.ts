import { getDynamicUrlMaps } from '../content/markdownLoader';

export const BASE_URL_TO_PAGE_MAP: Record<string, string> = {
  '/': 'home',
  '/contact': 'contact',
  '/contact/': 'contact',
  '/contact-us': 'contact',
  
  // Cheerplex Primary Sitemap URLs
  '/cheerplex-1x2-prediction-tips': 'cheerplex-1x2-prediction-tips',
  '/cheerplex-1x2-prediction-tips/': 'cheerplex-1x2-prediction-tips',
  '/cheerplex-free-predictions-and-tips': 'cheerplex-free-predictions-and-tips',
  '/cheerplex-free-predictions-and-tips/': 'cheerplex-free-predictions-and-tips',
  '/cheerplex-gg-prediction-tips': 'cheerplex-gg-prediction-tips',
  '/cheerplex-gg-prediction-tips/': 'cheerplex-gg-prediction-tips',
  
  // Cheerplex Betting Tips & Brand Aliases
  '/cheerplex-betting-tips': 'cheerplex-betting-tips',
  '/cheerplex-betting-tips/': 'cheerplex-betting-tips',
  '/chearplex-prediction': 'chearplex-prediction',
  '/chearplex-prediction/': 'chearplex-prediction',

  // Cheerplex Dedicated Jackpot Prediction Pages
  '/cheerplex-mega-jackpot-prediction': 'cheerplex-mega-jackpot-prediction',
  '/cheerplex-mega-jackpot-prediction/': 'cheerplex-mega-jackpot-prediction',
  '/cheerplex-sportpesa-jackpot-prediction': 'cheerplex-sportpesa-jackpot-prediction',
  '/cheerplex-sportpesa-jackpot-prediction/': 'cheerplex-sportpesa-jackpot-prediction',

  // Jackpots Hub & Individual Jackpots (Full and Direct Slugs)
  '/cheerplex-jackpots-predictions-and-tips': 'jackpot-list',
  '/cheerplex-jackpots-predictions-and-tips/': 'jackpot-list',
  '/jackpot-list': 'jackpot-list',
  '/jackpot-list/': 'jackpot-list',
  '/jackpots': 'jackpot-list',
  '/jackpots/': 'jackpot-list',
  '/jackpot-tips': 'jackpot-list',
  '/jackpot-tips/': 'jackpot-list',

  '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega': 'sportpesa-mega',
  '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/': 'sportpesa-mega',
  '/sportpesa-mega': 'sportpesa-mega',
  '/sportpesa-mega/': 'sportpesa-mega',
  '/sportpesa-mega-jackpot-prediction': 'sportpesa-mega',
  '/sportpesa-mega-jackpot-prediction/': 'sportpesa-mega',

  '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek': 'sportpesa-midweek',
  '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/': 'sportpesa-midweek',
  '/sportpesa-midweek': 'sportpesa-midweek',
  '/sportpesa-midweek/': 'sportpesa-midweek',
  '/today-sportpesa-midweek-jackpot-prediction-and-tips': 'sportpesa-midweek',

  '/cheerplex-jackpots-predictions-and-tips/betika-midweek': 'betika-midweek',
  '/cheerplex-jackpots-predictions-and-tips/betika-midweek/': 'betika-midweek',
  '/betika-midweek': 'betika-midweek',
  '/betika-midweek/': 'betika-midweek',
  '/free-betika-midweek-jackpot-predictions-and-analysis': 'betika-midweek',

  '/cheerplex-jackpots-predictions-and-tips/mozzart-grand': 'mozzart-grand',
  '/cheerplex-jackpots-predictions-and-tips/mozzart-grand/': 'mozzart-grand',
  '/mozzart-grand': 'mozzart-grand',
  '/mozzart-grand/': 'mozzart-grand',
  '/free-mozzart-grand-jackpot-predictions-and-analysis': 'mozzart-grand',

  '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily': 'mozzart-super-daily',
  '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily/': 'mozzart-super-daily',
  '/mozzart-super-daily': 'mozzart-super-daily',
  '/mozzart-super-daily/': 'mozzart-super-daily',
  '/free-mozzart-super-daily-jackpot-predictions-and-analysis': 'mozzart-super-daily',

  // Sure Tips & Odds Hub and Packs
  '/cheerplex-sure-tips-and-odds': 'cheerplex-sure-tips-and-odds',
  '/cheerplex-sure-tips-and-odds/': 'cheerplex-sure-tips-and-odds',
  '/cheerplex-sure-tips-and-odds/odds-9plus': 'odds-9plus',
  '/cheerplex-sure-tips-and-odds/odds-9plus/': 'odds-9plus',
  '/cheerplex-sure-tips-and-odds/odds-5plus': 'odds-5plus',
  '/cheerplex-sure-tips-and-odds/odds-5plus/': 'odds-5plus',
  '/cheerplex-sure-tips-and-odds/odds-3plus': 'odds-3plus',
  '/cheerplex-sure-tips-and-odds/odds-3plus/': 'odds-3plus',
  '/cheerplex-sure-tips-and-odds/odds-7plus': 'odds-7plus',
  '/cheerplex-sure-tips-and-odds/odds-7plus/': 'odds-7plus',

  // Today, Tomorrow, Yesterday & VIP Tips
  '/cheerplex-today-prediction-betting-tips': 'cheerplex-today-prediction-betting-tips',
  '/cheerplex-today-prediction-betting-tips/': 'cheerplex-today-prediction-betting-tips',
  '/cheerplex-tomorrow-prediction': 'cheerplex-tomorrow-prediction',
  '/cheerplex-tomorrow-prediction/': 'cheerplex-tomorrow-prediction',
  '/cheerplex-yesterday-prediction': 'cheerplex-yesterday-prediction',
  '/cheerplex-yesterday-prediction/': 'cheerplex-yesterday-prediction',
  '/cheerplex-vip-tips': 'cheerplex-vip-tips',
  '/cheerplex-vip-tips/': 'cheerplex-vip-tips',

  // Backward compatibility aliases
  '/football-predictions-today': 'cheerplex-today-prediction-betting-tips',
  '/football-predictions-yesterday': 'cheerplex-yesterday-prediction',
  '/football-predictions-tomorrow': 'cheerplex-tomorrow-prediction',
  '/today': 'cheerplex-today-prediction-betting-tips',
  '/tomorrow': 'cheerplex-tomorrow-prediction',
  '/yesterday': 'cheerplex-yesterday-prediction',
  '/football-predictions-over-1-5-goals': 'category-over15',
  '/football-predictions-btts-gg': 'cheerplex-gg-prediction-tips',
  '/football-predictions-1x2-home-win': 'cheerplex-1x2-prediction-tips',
  '/football-predictions-over-2-5-goals': 'category-over25',
  '/football-predictions-double-chance': 'category-doublechance',
  '/responsible-gambling': 'responsible-gambling',
  '/vip-packages': 'vip-packages',
  '/vip-tips': 'vip-packages',
  '/vip': 'vip-packages',
  '/odds': 'cheerplex-sure-tips-and-odds'
};

export const BASE_PAGE_TO_URL_MAP: Record<string, string> = {
  'home': '/',
  'contact': '/contact/',
  'cheerplex-1x2-prediction-tips': '/cheerplex-1x2-prediction-tips/',
  'cheerplex-free-predictions-and-tips': '/cheerplex-free-predictions-and-tips/',
  'cheerplex-gg-prediction-tips': '/cheerplex-gg-prediction-tips/',
  'category-btts': '/cheerplex-gg-prediction-tips/',
  'category-homewin': '/cheerplex-1x2-prediction-tips/',
  
  // Jackpots
  'jackpot-list': '/cheerplex-jackpots-predictions-and-tips/',
  'cheerplex-jackpots-predictions-and-tips': '/cheerplex-jackpots-predictions-and-tips/',
  'betika-midweek': '/cheerplex-jackpots-predictions-and-tips/betika-midweek/',
  'sportpesa-midweek': '/cheerplex-jackpots-predictions-and-tips/sportpesa-midweek/',
  'mozzart-grand': '/cheerplex-jackpots-predictions-and-tips/mozzart-grand/',
  'sportpesa-mega': '/cheerplex-jackpots-predictions-and-tips/sportpesa-mega/',
  'mozzart-super-daily': '/cheerplex-jackpots-predictions-and-tips/mozzart-super-daily/',
  'cheerplex-mega-jackpot-prediction': '/cheerplex-mega-jackpot-prediction/',
  'cheerplex-sportpesa-jackpot-prediction': '/cheerplex-sportpesa-jackpot-prediction/',

  // Betting Tips & Aliases
  'cheerplex-betting-tips': '/cheerplex-betting-tips/',
  'chearplex-prediction': '/chearplex-prediction/',

  // Sure Tips & Odds
  'cheerplex-sure-tips-and-odds': '/cheerplex-sure-tips-and-odds/',
  'odds-packs': '/cheerplex-sure-tips-and-odds/',
  'odds-9plus': '/cheerplex-sure-tips-and-odds/odds-9plus/',
  'odds-5plus': '/cheerplex-sure-tips-and-odds/odds-5plus/',
  'odds-3plus': '/cheerplex-sure-tips-and-odds/odds-3plus/',
  'odds-7plus': '/cheerplex-sure-tips-and-odds/odds-7plus/',

  // Today, Tomorrow, Yesterday & VIP
  'today': '/cheerplex-today-prediction-betting-tips/',
  'category-today': '/cheerplex-today-prediction-betting-tips/',
  'cheerplex-today-prediction-betting-tips': '/cheerplex-today-prediction-betting-tips/',
  'tomorrow': '/cheerplex-tomorrow-prediction/',
  'category-tomorrow': '/cheerplex-tomorrow-prediction/',
  'cheerplex-tomorrow-prediction': '/cheerplex-tomorrow-prediction/',
  'yesterday': '/cheerplex-yesterday-prediction/',
  'category-yesterday': '/cheerplex-yesterday-prediction/',
  'cheerplex-yesterday-prediction': '/cheerplex-yesterday-prediction/',
  'vip-packages': '/cheerplex-vip-tips/',
  'vip': '/cheerplex-vip-tips/',
  'cheerplex-vip-tips': '/cheerplex-vip-tips/',

  // Supplementary
  'category-over15': '/football-predictions-over-1-5-goals',
  'category-over25': '/football-predictions-over-2-5-goals',
  'category-doublechance': '/football-predictions-double-chance',
  'responsible-gambling': '/responsible-gambling'
};

export const { 
  urlToPageMap: URL_TO_PAGE_MAP, 
  pageToUrlMap: PAGE_TO_URL_MAP,
  dynamicCategoryPages: DYNAMIC_CATEGORY_PAGES,
  dynamicJackpotPages: DYNAMIC_JACKPOT_PAGES,
  dynamicJackpotIds: DYNAMIC_JACKPOT_IDS
} = getDynamicUrlMaps(BASE_URL_TO_PAGE_MAP, BASE_PAGE_TO_URL_MAP);

export const ALL_JACKPOT_IDS = Array.from(new Set([
  'sportpesa-mega', 
  'sportpesa-midweek', 
  'betika-midweek', 
  'mozzart-grand', 
  'mozzart-super-daily',
  'cheerplex-mega-jackpot-prediction',
  'cheerplex-sportpesa-jackpot-prediction',
  ...DYNAMIC_JACKPOT_IDS
]));

export function getNormalizedPath(path: string): string {
  let p = path.toLowerCase().trim();
  if (p.endsWith('/') && p !== '/') {
    p = p.slice(0, -1);
  }
  return p || '/';
}

export function getPageUrl(pageId: string): string {
  if (!pageId || pageId === 'home' || pageId === 'not-found' || pageId === '404') return '/';
  if (pageId === 'today' || pageId === 'category-today') return '/cheerplex-today-prediction-betting-tips/';
  if (pageId === 'tomorrow' || pageId === 'category-tomorrow') return '/cheerplex-tomorrow-prediction/';
  if (pageId === 'yesterday' || pageId === 'category-yesterday') return '/cheerplex-yesterday-prediction/';
  if (PAGE_TO_URL_MAP[pageId]) return PAGE_TO_URL_MAP[pageId];
  if (pageId.startsWith('/')) return pageId;
  return `/${pageId}`;
}

export function getPageIdFromUrl(pathname: string): string {
  if (!pathname) return 'home';
  const clean = pathname.trim();
  const norm = getNormalizedPath(clean);
  if (norm === '/' || norm === '' || norm === '/404' || norm === '/not-found') return 'home';

  // 1. Direct match with exact path or normalized path
  if (BASE_URL_TO_PAGE_MAP[clean]) return BASE_URL_TO_PAGE_MAP[clean];
  if (BASE_URL_TO_PAGE_MAP[norm]) return BASE_URL_TO_PAGE_MAP[norm];
  if (URL_TO_PAGE_MAP[clean]) return URL_TO_PAGE_MAP[clean];
  if (URL_TO_PAGE_MAP[norm]) return URL_TO_PAGE_MAP[norm];

  const rawSlug = norm.replace(/^\//, '');
  if (BASE_URL_TO_PAGE_MAP[`/${rawSlug}`]) return BASE_URL_TO_PAGE_MAP[`/${rawSlug}`];
  if (URL_TO_PAGE_MAP[`/${rawSlug}`]) return URL_TO_PAGE_MAP[`/${rawSlug}`];
  if (PAGE_TO_URL_MAP[rawSlug]) return rawSlug;
  if (ALL_JACKPOT_IDS.includes(rawSlug)) return rawSlug;

  return 'home';
}
