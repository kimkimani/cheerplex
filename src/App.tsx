'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Menu, 
  Home,
  Zap, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Trophy, 
  Crown,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Star,
  Mail,
  X,
  Flame,
  Layers,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Percent,
  ShieldCheck
} from 'lucide-react';

import { designIterations, vipPackages, oddsPacks, fixturesData, defaultExternalLinks } from './data';
import { jackpotsData } from './jackpotsData';
import { DesignIteration, Fixture, VipPackage, OddsPack, ExternalLink } from './types';
import { getMarkdownContent, getDynamicUrlMaps, buildCanonicalUrl, hasMarkdownFile } from './content/markdownLoader';
import { getRefinedConfidence } from './utils/probability';

import { apiFetch } from './utils/api.ts';
import { getApiBaseUrl } from './lib/getApiBaseUrl';
import { fetchExternalLinks } from './lib/dataStore';
import { PredictionCategory, getCategoryCountText, PREDICTION_CATEGORIES, getCategoryFixtures, isSameDay } from './utils/predictionGenerator';
import { setLiveTodayFixturesCache } from './utils/todayFixturesTags';
import { registerBankerFixtures } from './utils/bankerUtils';

// Import essential initial UI components
import Sidebar from './components/Sidebar';
import PredictionsList from './components/PredictionsList';
import VipPackages from './components/VipPackages';
import OddsPacks from './components/OddsPacks';
import PredictionsSidebar from './components/PredictionsSidebar';
import LiveUpdates from './components/LiveUpdates';
import JackpotSidebar from './components/JackpotSidebar';
import { AuthorCard } from './components/AuthorCard';
import TopBankerCard from './components/TopBankerCard';
import CuratedAccumulatorCard from './components/CuratedAccumulatorCard';
import { ResponsibleGamblingNotice } from './components/ResponsibleGamblingNotice';
import InboundLinksBlock from './components/InboundLinksBlock';
import CategoryPredictionsPage from './components/CategoryPredictionsPage';
import FaqSection from './components/FaqSection';
import CheerplexLogo from './components/CheerplexLogo';
import MarkdownRenderer from './components/MarkdownRenderer';
import { setLiveJackpotFixturesCache } from './utils/topJackpotFixtures';

// Code-split heavy non-primary routes and overlay modals to reduce initial mobile JS bundle
const JackpotPage = lazy(() => import('./components/JackpotPage'));
const JackpotListPage = lazy(() => import('./components/JackpotListPage'));
const VipPackagesPage = lazy(() => import('./components/VipPackagesPage'));
const StaticPages = lazy(() => import('./components/StaticPages'));
const PaymentModal = lazy(() => import('./components/PaymentModal'));

import { 
  URL_TO_PAGE_MAP, 
  PAGE_TO_URL_MAP, 
  DYNAMIC_CATEGORY_PAGES, 
  DYNAMIC_JACKPOT_PAGES, 
  DYNAMIC_JACKPOT_IDS,
  ALL_JACKPOT_IDS,
  getNormalizedPath,
  getPageUrl,
  getPageIdFromUrl
} from './utils/navigation';

const getInitialPage = () => {
  if (typeof window === 'undefined') return 'home';
  return getPageIdFromUrl(window.location.pathname);
};

const getInitialJackpot = (initialPage: string) => {
  if (ALL_JACKPOT_IDS.includes(initialPage)) {
    return initialPage;
  }
  return 'sportpesa-mega';
};
export function deduplicateFixtures<T extends { id?: any; fixtureRef?: any; homeTeam?: string; awayTeam?: string }>(list: T[]): T[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of list) {
    if (!item) continue;
    const key = String(item.id ?? item.fixtureRef ?? (item.homeTeam && item.awayTeam ? `${item.homeTeam}-${item.awayTeam}` : ''));
    if (!key) {
      result.push(item);
      continue;
    }
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export interface AppProps {
  initialPage?: string;
  initialJackpotId?: string;
  initialPredictions?: Fixture[];
  initialJackpots?: any[];
}

export default function App({ initialPage, initialJackpotId, initialPredictions, initialJackpots }: AppProps = {}) {
  const [currentIteration, setCurrentIteration] = useState<DesignIteration>(designIterations[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // DB Driven states initialized with baseline fallback data to prevent CLS layout shift
  const [dbJackpots, setDbJackpots] = useState<any[]>(() => (Array.isArray(initialJackpots) && initialJackpots.length > 0 ? initialJackpots : jackpotsData));
  const [dbVipPackages, setDbVipPackages] = useState<VipPackage[]>(() => vipPackages);
  const [dbOddsPacks, setDbOddsPacks] = useState<OddsPack[]>(() => oddsPacks);
  const [dbExternalLinks, setDbExternalLinks] = useState<ExternalLink[]>(() => defaultExternalLinks);
  const [dbPredictions, setDbPredictions] = useState<Record<string, Fixture[]>>(() => {
    const hasInitial = Array.isArray(initialPredictions) && initialPredictions.length > 0;
    const defaultSeedPool = deduplicateFixtures([
      ...(fixturesData.today || []),
      ...(fixturesData.yesterday || []),
      ...(fixturesData.tomorrow || [])
    ]);
    const initialPool = hasInitial ? deduplicateFixtures(initialPredictions) : defaultSeedPool;
    const clientToday = new Date();
    const clientYesterday = new Date();
    clientYesterday.setDate(clientToday.getDate() - 1);
    const clientTomorrow = new Date();
    clientTomorrow.setDate(clientToday.getDate() + 1);

    const todayPreds = deduplicateFixtures(initialPool.filter((f: any) => isSameDay(f.kickoffTime, clientToday)));
    const yesterdayPreds = deduplicateFixtures(initialPool.filter((f: any) => isSameDay(f.kickoffTime, clientYesterday)));
    const tomorrowPreds = deduplicateFixtures(initialPool.filter((f: any) => isSameDay(f.kickoffTime, clientTomorrow)));

    const initialMap: Record<string, Fixture[]> = {
      'all': initialPool,
      'category-today': todayPreds.length > 0 ? todayPreds : deduplicateFixtures(fixturesData.today || []),
      'category-yesterday': yesterdayPreds.length > 0 ? yesterdayPreds : deduplicateFixtures(fixturesData.yesterday || []),
      'category-tomorrow': tomorrowPreds.length > 0 ? tomorrowPreds : deduplicateFixtures(fixturesData.tomorrow || []),
    };

    return initialMap;
  });
  const [userPurchasedItemIds, setUserPurchasedItemIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guest_purchased_item_ids');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return [];
  });
  const [loadingDb, setLoadingDb] = useState<boolean>(true);
  const [loadingCategory, setLoadingCategory] = useState<boolean>(false);
  const [siteContacts, setSiteContacts] = useState<{
    email: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube?: string;
  }>({
    email: 'support@cheerplex.co.ke',
    phone: '+254740841375',
    whatsapp: '+254740841375',
    telegram: 'https://t.me/cheerplex',
    facebook: 'https://facebook.com/cheerplexkenya',
    twitter: 'https://x.com/cheerplex_ke',
    instagram: 'https://instagram.com/cheerplex_ke',
    youtube: 'https://youtube.com/@cheerplex'
  });

  // Portal active views state
  const defaultPage = initialPage || getInitialPage();
  const defaultJackpot = initialJackpotId || getInitialJackpot(defaultPage);
  const [activePage, setActivePage] = useState<string>(defaultPage);
  const [unlockedJackpots, setUnlockedJackpots] = useState<string[]>([]);

  // Keep unlocked jackpots in sync with purchases
  useEffect(() => {
    const jackpots = userPurchasedItemIds.filter((id: string) => ALL_JACKPOT_IDS.includes(id));
    setUnlockedJackpots(jackpots);
  }, [userPurchasedItemIds]);

  // Section active states
  const [activeJackpotId, setActiveJackpotId] = useState<string>(defaultJackpot);

  // Listen to popstate event for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const pageId = getPageIdFromUrl(window.location.pathname);
      setActivePage(pageId);
      if (ALL_JACKPOT_IDS.includes(pageId)) {
        setActiveJackpotId(pageId);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Client-side update driven by markdown frontmatter and Schema.org
  useEffect(() => {
    let canonicalPath: string;
    let fullCanonicalUrl: string;
    let pageTitle: string;
    let pageDesc: string;
    let pageKeywords: string;
    let pageOgType = 'website';
    let pageOgImage = 'https://cheerplex.co.ke/icon.png';

    const pageMd = getMarkdownContent(activePage);
    const fallbackUrl = PAGE_TO_URL_MAP[activePage] || `/${activePage}`;
    canonicalPath = pageMd.link || fallbackUrl;
    fullCanonicalUrl = buildCanonicalUrl(canonicalPath, activePage);
    pageTitle = pageMd.title;
    pageDesc = pageMd.description;
    pageKeywords = pageMd.keywords;
    pageOgType = (activePage === 'vip-packages' || activePage === 'cheerplex-vip-tips') ? 'product' : 'website';
    
    if (pageTitle) {
      document.title = pageTitle;
    }

    const updateMetaTag = (name: string, value: string, attrName = 'name') => {
      let element = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    if (pageDesc) {
      updateMetaTag('description', pageDesc);
      updateMetaTag('og:description', pageDesc, 'property');
      updateMetaTag('twitter:description', pageDesc);
    }

    if (pageTitle) {
      updateMetaTag('og:title', pageTitle, 'property');
      updateMetaTag('twitter:title', pageTitle);
    }

    if (pageKeywords) {
      updateMetaTag('keywords', pageKeywords);
    }

    updateMetaTag('og:url', fullCanonicalUrl, 'property');
    updateMetaTag('og:type', pageOgType, 'property');
    updateMetaTag('og:site_name', 'Cheerplex', 'property');
    updateMetaTag('og:image', pageOgImage, 'property');
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:image', pageOgImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullCanonicalUrl);
  }, [activePage, dbJackpots]);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch Database-driven data
  const loadDatabaseData = async () => {
    try {
      setLoadingDb(true);
      const baseUrl = getApiBaseUrl();
      const [jackpotsRes, vipRes, oddsRes, allPredictionsRes, settingsRes, externalLinksRes] = await Promise.all([
        fetch(`${baseUrl}/api/jackpots`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/vip-packages`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/odds-packs`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/predictions`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/site-settings`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${baseUrl}/api/external-links`).then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      if (Array.isArray(externalLinksRes) && externalLinksRes.length > 0) {
        setDbExternalLinks(externalLinksRes);
      }

      if (settingsRes) {
        setSiteContacts(prev => ({
          ...prev,
          ...settingsRes
        }));
      }

      // Filter dynamically based on client/user date timezone
      const clientToday = new Date();
      const clientYesterday = new Date();
      clientYesterday.setDate(clientToday.getDate() - 1);
      const clientTomorrow = new Date();
      clientTomorrow.setDate(clientToday.getDate() + 1);

      if (Array.isArray(jackpotsRes) && jackpotsRes.length > 0) {
        setDbJackpots(jackpotsRes);
        for (const j of jackpotsRes) {
          if (j && Array.isArray(j.fixtures) && j.fixtures.length > 0) {
            setLiveJackpotFixturesCache(j.fixtures, j.id || j.slug);
          }
        }
      }
      if (Array.isArray(vipRes) && vipRes.length > 0) {
        setDbVipPackages(vipRes);
      }
      if (Array.isArray(oddsRes) && oddsRes.length > 0) {
        setDbOddsPacks(oddsRes);
      }

      const predictionsList = deduplicateFixtures(Array.isArray(allPredictionsRes) ? allPredictionsRes : []);
      const yesterdayPreds = deduplicateFixtures(predictionsList.filter((f: any) => isSameDay(f.kickoffTime, clientYesterday)));
      let todayPreds = deduplicateFixtures(predictionsList.filter((f: any) => isSameDay(f.kickoffTime, clientToday)));
      const tomorrowPreds = deduplicateFixtures(predictionsList.filter((f: any) => isSameDay(f.kickoffTime, clientTomorrow)));

      if (todayPreds.length === 0) {
        try {
          const directToday = await fetch(`${baseUrl}/api/predictions?category=today`).then(r => r.ok ? r.json() : []);
          if (Array.isArray(directToday) && directToday.length > 0) {
            todayPreds = deduplicateFixtures(directToday);
          }
        } catch {}
      }

      if (todayPreds.length > 0) {
        setLiveTodayFixturesCache(todayPreds);
        registerBankerFixtures(todayPreds);
      }

      setDbPredictions(prev => ({
        ...prev,
        'all': predictionsList,
        'category-today': todayPreds,
        'category-yesterday': yesterdayPreds,
        'category-tomorrow': tomorrowPreds,
      }));
    } catch (err) {
      console.error('Failed to load database content:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Handle predictions loading for specific category on activePage change
  useEffect(() => {
    if (activePage.startsWith('category-') && 
        activePage !== 'category-today' && 
        activePage !== 'category-yesterday' && 
        activePage !== 'category-tomorrow' && 
        !dbPredictions[activePage]) {
      const fetchCategoryPredictions = async () => {
        try {
          setLoadingCategory(true);
          const baseUrl = getApiBaseUrl();
          const preds = await fetch(`${baseUrl}/api/predictions?category=${activePage}`)
            .then(r => r.ok ? r.json() : [])
            .catch(() => []);
          setDbPredictions(prev => ({
            ...prev,
            [activePage]: deduplicateFixtures(Array.isArray(preds) ? preds : []),
          }));
        } catch (err) {
          console.error(`Failed to load predictions for category: ${activePage}`, err);
          setDbPredictions(prev => ({
            ...prev,
            [activePage]: [],
          }));
        } finally {
          setLoadingCategory(false);
        }
      };
      fetchCategoryPredictions();
    }
  }, [activePage, dbPredictions]);

  // Attach active design iteration to document body
  useEffect(() => {
    const body = document.body;
    designIterations.forEach((iter) => {
      body.classList.remove(iter.themeClass);
    });
    body.classList.add(currentIteration.themeClass);
  }, [currentIteration]);

  // Dynamic SEO title handler
  useEffect(() => {
    const pageMd = getMarkdownContent(activePage);
    if (pageMd && pageMd.title) {
      document.title = pageMd.title;
    }
  }, [activePage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleScrollTo = (sectionId: string) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  };

  const handleSelectPage = (pageId: string) => {
    let resolvedPageId = pageId;
    if (pageId === 'today') resolvedPageId = 'category-today';
    if (pageId === 'yesterday') resolvedPageId = 'category-yesterday';
    if (pageId === 'tomorrow') resolvedPageId = 'category-tomorrow';

    // Handle VIP scroll or redirect (VIP packages are on the home page)
    if (resolvedPageId === 'vip') {
      const isCurrentlyOnHomePage = activePage.startsWith('category-');
      if (isCurrentlyOnHomePage) {
        handleScrollTo('vip-showcase');
      } else {
        setActivePage('category-today');
        const url = PAGE_TO_URL_MAP['category-today'];
        if (url && typeof window !== 'undefined') {
          window.history.pushState(null, '', url);
        }
        setTimeout(() => handleScrollTo('vip-showcase'), 150);
      }
      return;
    }

    // Handle Odds scroll or redirect (Odds Packs are on the home page)
    if (resolvedPageId === 'odds') {
      const isCurrentlyOnHomePage = activePage.startsWith('category-');
      if (isCurrentlyOnHomePage) {
        handleScrollTo('odds-packs');
      } else {
        setActivePage('category-today');
        const url = PAGE_TO_URL_MAP['category-today'];
        if (url && typeof window !== 'undefined') {
          window.history.pushState(null, '', url);
        }
        setTimeout(() => handleScrollTo('odds-packs'), 150);
      }
      return;
    }

    // Regular page selections
    setActivePage(resolvedPageId);
    if (ALL_JACKPOT_IDS.includes(resolvedPageId) || DYNAMIC_JACKPOT_PAGES[resolvedPageId]) {
      setActiveJackpotId(resolvedPageId);
    }

    // Push URL state for normal subpages
    const url = getPageUrl(resolvedPageId);
    if (url && typeof window !== 'undefined') {
      window.history.pushState(null, '', url);
    }

    // Handle scrolling
    if (resolvedPageId.startsWith('category-') || 
        resolvedPageId === 'jackpot-list' || 
        ALL_JACKPOT_IDS.includes(resolvedPageId) ||
        ['responsible-gambling', 'contact'].includes(resolvedPageId)) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  };

  // Intercept internal and cheerplex.co.ke links for smooth client-side SPA routing
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target.getAttribute('target') === '_blank') return;

      let targetPath = '';
      if (href.startsWith('/') && !href.startsWith('//')) {
        targetPath = href;
      } else if (href.startsWith('https://cheerplex.co.ke') || href.startsWith('http://cheerplex.co.ke')) {
        try {
          const urlObj = new URL(href);
          targetPath = urlObj.pathname;
        } catch {}
      }

      if (targetPath) {
        const pageId = getPageIdFromUrl(targetPath);
        if (pageId && pageId !== '404') {
          e.preventDefault();
          handleSelectPage(pageId);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Payment states
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payPackageName, setPayPackageName] = useState('');
  const [payPrice, setPayPrice] = useState(500);
  const [payId, setPayId] = useState<string | number>('');
  const [paySlug, setPaySlug] = useState('');
  const [payType, setPayType] = useState<'vip' | 'jackpot' | 'odds'>('vip');
  
  const handleOpenPayment = (
    pkgName: string, 
    price: number, 
    id: string | number, 
    slug: string, 
    type: 'vip' | 'jackpot' | 'odds'
  ) => {
    setPayPackageName(pkgName);
    setPayPrice(price);
    setPayId(id);
    setPaySlug(slug);
    setPayType(type);
    setPaymentOpen(true);
  };

  // Allow any nested Markdown or dynamic components to trigger the payment modal seamlessly
  useEffect(() => {
    const handleGlobalOpenPayment = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail || {};
      handleOpenPayment(
        detail.packageName || 'SportPesa Mega Jackpot VIP Slip',
        detail.price || 250,
        detail.packageId || 'sportpesa-mega-vip',
        detail.packageSlug || 'sportpesa-mega',
        detail.packageType || 'jackpot'
      );
    };

    window.addEventListener('cheerplex-open-payment', handleGlobalOpenPayment);
    window.addEventListener('soka-open-payment', handleGlobalOpenPayment);
    return () => {
      window.removeEventListener('cheerplex-open-payment', handleGlobalOpenPayment);
      window.removeEventListener('soka-open-payment', handleGlobalOpenPayment);
    };
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      let guestIds: string[] = [];
      const storedGuestPurchases = localStorage.getItem('guest_purchased_item_ids');
      if (storedGuestPurchases) {
        try {
          guestIds = JSON.parse(storedGuestPurchases);
        } catch {}
      }
      if (!guestIds.includes(String(payId))) {
        guestIds.push(String(payId));
      }
      localStorage.setItem('guest_purchased_item_ids', JSON.stringify(guestIds));
      setUserPurchasedItemIds(guestIds);

      if (payType === 'jackpot') {
        showToast(`🎉 ${payPackageName} Selections Unlocked!`);
      } else {
        showToast(`🎉 Premium ${payPackageName} activated! Checked out on Safaricom.`);
      }
    } catch (err) {
      console.error('Failed to sync purchase record:', err);
      showToast('❌ Payment processed.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased selection:bg-[var(--primary)] selection:text-white transition-colors duration-500 pb-16">
      
      {/* Skip to Content Link for Screen Readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-md font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Cheerplex Live Sports Intel Top Bar */}
      <aside aria-label="Live sports alerts" className="w-full bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-blue-400 shrink-0   tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Cheerplex Latest Update:
            </span>
            <span className="truncate text-slate-300 font-medium">
              SportPesa Mega Jackpot is now Active 
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono font-medium text-slate-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Check Updated Tips
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">Kenya 18+ Responsible Play</span>
          </div>
        </div>
      </aside>

      {/* MINIMALIST NAVIGATION BAR */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Left: Clean Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <a 
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('home');
                }
              }}
              aria-label="Cheerplex Home"
              className="flex items-center gap-2.5 cursor-pointer no-underline text-left text-[var(--text)] select-none group"
            >
              <CheerplexLogo variant="emblem" size={34} className="group-hover:scale-105 transition-transform duration-200 shadow-sm" />
              <span 
                className="font-black text-lg tracking-tight text-[var(--text)] font-display"
              >
                Cheer<span className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold ml-1">Plex</span>
              </span>
            </a>
          </div>

          {/* Center: Minimalist Text Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7 text-xs font-medium">
            <a 
              href={getPageUrl('home')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('home');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'home' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Home</span>
              {activePage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('category-today')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('category-today');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'category-today' || activePage === 'today' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Today Tips</span>
              {(activePage === 'category-today' || activePage === 'today') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('category-tomorrow')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('category-tomorrow');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'category-tomorrow' || activePage === 'tomorrow' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Tomorrow</span>
              {(activePage === 'category-tomorrow' || activePage === 'tomorrow') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('category-yesterday')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('category-yesterday');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'category-yesterday' || activePage === 'yesterday' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Yesterday</span>
              {(activePage === 'category-yesterday' || activePage === 'yesterday') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('sportpesa-mega')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('sportpesa-mega');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'sportpesa-mega'
                  ? 'text-amber-500 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Mega JP</span>
              {activePage === 'sportpesa-mega' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('sportpesa-midweek')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('sportpesa-midweek');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'sportpesa-midweek' || activePage === 'betika-midweek'
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Midweek</span>
              {(activePage === 'sportpesa-midweek' || activePage === 'betika-midweek') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('jackpot-list')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('jackpot-list');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'jackpot-list'
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>All Jackpots</span>
              {activePage === 'jackpot-list' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>

            <a 
              href={getPageUrl('vip-packages')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleSelectPage('vip-packages');
                }
              }}
              className={`transition-colors no-underline cursor-pointer relative py-1 ${
                activePage === 'vip-packages' || activePage === 'vip'
                  ? 'text-amber-500 font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>VIP</span>
              {(activePage === 'vip-packages' || activePage === 'vip') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </a>

            <a 
              href="/#odds-packs"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  if (activePage.startsWith('category-') || activePage === 'home') {
                    handleScrollTo('odds-packs');
                  } else {
                    handleSelectPage('home');
                    setTimeout(() => handleScrollTo('odds-packs'), 100);
                  }
                }
              }}
              className="transition-colors no-underline cursor-pointer py-1 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <span>Odd Packs</span>
            </a>
          </nav>

          {/* Right: Restyled & Respaced Header Join VIP */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                if (dbVipPackages.length > 0) {
                  const firstPkg = dbVipPackages[0];
                  handleOpenPayment(firstPkg.name, firstPkg.price, firstPkg.id, firstPkg.slug, 'vip');
                } else {
                  handleSelectPage('vip-packages');
                }
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer border-none flex items-center gap-1.5 tracking-tight"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Join VIP</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION OVERLAY */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        firstVipPackage={(dbVipPackages[0] || { id: 'jackpot-vip', name: 'SportPesa Mega VIP', price: 500 }) as any}
        onOpenPayment={handleOpenPayment}
        activePage={activePage}
        onSelectPage={handleSelectPage}
      />

        {/* 3. CENTERED INTERACTIVE WORKSPACE */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-[85vh] md:min-h-[1000px]">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* MAIN CENTER DASHBOARD CONTAINER */}
            <main id="main-content" className="flex-1 w-full space-y-8 min-h-[650px] md:min-h-[850px] overflow-hidden">
              <Suspense fallback={
                <div className="min-h-[400px] flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
                    <span className="text-xs text-[var(--text-muted)] font-mono">Loading content...</span>
                  </div>
                </div>
              }>
              {(() => {
                const category = PREDICTION_CATEGORIES.find(c => 
                  c.id === activePage
                ) || DYNAMIC_CATEGORY_PAGES[activePage];

                if (category) {
                  const pageMd = getMarkdownContent(activePage);
                  const categoryFixtures = getCategoryFixtures(
                    category.id, 
                    dbPredictions.all && dbPredictions.all.length > 0 ? dbPredictions.all : dbPredictions,
                    pageMd.type
                  );
                  return (
                    <CategoryPredictionsPage 
                      category={category}
                      fixtures={categoryFixtures}
                      isLoading={loadingDb || loadingCategory}
                      onBackToHome={() => handleSelectPage('home')}
                      onSelectPage={handleSelectPage}
                      onOpenPayment={handleOpenPayment}
                      jackpots={dbJackpots}
                      pageId={activePage}
                    />
                  );
                }

                if (activePage === 'jackpot-list') {
                  return (
                    <JackpotListPage 
                      onSelectJackpot={(id) => handleSelectPage(id)}
                      unlockedJackpots={unlockedJackpots}
                      hasPaidJackpot={unlockedJackpots.length > 0}
                      jackpots={dbJackpots}
                      fixtures={dbPredictions['category-today'] && dbPredictions['category-today'].length > 0 ? dbPredictions['category-today'] : (dbPredictions.all && dbPredictions.all.length > 0 ? dbPredictions.all : fixturesData.today)}
                    />
                  );
                }

                if (ALL_JACKPOT_IDS.includes(activePage) || DYNAMIC_JACKPOT_PAGES[activePage]) {
                  const dynamicJpInfo = DYNAMIC_JACKPOT_PAGES[activePage];
                  const targetJackpotId = dynamicJpInfo ? dynamicJpInfo.jackpotId : activePage;

                  let activeJackpot = dbJackpots.find(j => j.id === targetJackpotId || j.slug === targetJackpotId || j.id === activePage || j.slug === activePage);
                  if (!activeJackpot) {
                    activeJackpot = jackpotsData.find(j => j.id === targetJackpotId || j.slug === targetJackpotId || j.id === activePage || j.slug === activePage);
                  }
                  if (!activeJackpot) {
                    const baseFallback = jackpotsData.find(j => j.id === 'sportpesa-mega') || jackpotsData[0];
                    const pageMd = getMarkdownContent(activePage);
                    activeJackpot = {
                      ...baseFallback,
                      id: activePage,
                      name: pageMd.displayTitle || pageMd.title || activePage,
                      slug: activePage
                    };
                  }

                  const rawFixtures = (activeJackpot.fixtures && activeJackpot.fixtures.length > 0)
                    ? activeJackpot.fixtures
                    : ((activeJackpot as any).games && (activeJackpot as any).games.length > 0)
                      ? (activeJackpot as any).games
                      : (jackpotsData.find(j => j.id === activeJackpot!.id || j.slug === activeJackpot!.slug)?.fixtures || []);

                  const formattedJackpot = {
                    ...activeJackpot,
                    fixtures: rawFixtures.map((f: any, idx: number) => ({
                      ...f,
                      id: f.id || idx + 1,
                      fixtureNumber: f.fixtureNumber || f.position || idx + 1,
                      prediction: f.prediction || f.tip || 'Home Win (1)',
                      homeTeam: f.homeTeam || f.home_team_name || 'Home Team',
                      awayTeam: f.awayTeam || f.away_team_name || 'Away Team',
                      homeScore: f.homeScore !== undefined ? f.homeScore : f.fullTimeHome !== undefined ? f.fullTimeHome : '-',
                      awayScore: f.awayScore !== undefined ? f.awayScore : f.fullTimeAway !== undefined ? f.fullTimeAway : '-',
                      kickoffTime: f.kickoffTime || f.date || f.time || new Date().toISOString(),
                      confidence: getRefinedConfidence(f),
                      aiAnalysis: f.aiAnalysis || f.ai_analysis || 'AI mathematical model favors this outcome based on form and tactical alignment.'
                    }))
                  };

                  const isJackpotUnlocked = unlockedJackpots.includes(formattedJackpot.id) || unlockedJackpots.includes(targetJackpotId);

                  return (
                    <JackpotPage 
                      jackpot={formattedJackpot}
                      hasPaid={isJackpotUnlocked}
                      isLoading={loadingDb}
                      onOpenPayment={handleOpenPayment}
                      onBackToList={() => handleSelectPage('jackpot-list')}
                      onSelectPage={handleSelectPage}
                      pageId={activePage}
                    />
                  );
                }

                if (['vip-packages', 'vip', 'odds', 'cheerplex-vip-tips'].includes(activePage)) {
                  return (
                    <VipPackagesPage 
                      vipPackages={dbVipPackages}
                      oddsPacks={dbOddsPacks}
                      jackpots={dbJackpots}
                      unlockedJackpots={unlockedJackpots}
                      userPurchasedItemIds={userPurchasedItemIds}
                      onOpenPayment={handleOpenPayment}
                      onSelectJackpot={(id) => handleSelectPage(id)}
                      onBackToHome={() => handleSelectPage('home')}
                    />
                  );
                }

                if (['responsible-gambling', 'contact'].includes(activePage)) {
                  return (
                    <StaticPages 
                      pageId={activePage}
                      onBackToHome={() => handleSelectPage('home')}
                    />
                  );
                }

                // DYNAMIC MARKDOWN PAGE (For newly created or existing .md files: Competitors, custom SEO Jackpot pages, etc.)
                if (activePage !== 'home' && hasMarkdownFile(activePage)) {
                  const pageMd = getMarkdownContent(activePage);

                  // 1. Is it a jackpot page (has jackpotId or type === 'jackpot')?
                  if (pageMd.jackpotId || pageMd.type === 'jackpot') {
                    const targetJackpotId = pageMd.jackpotId || activePage;
                    const activeJackpot = dbJackpots.find(j => j.id === targetJackpotId || j.slug === targetJackpotId) || dbJackpots[0];
                    if (activeJackpot) {
                      const isJackpotUnlocked = unlockedJackpots.includes(activeJackpot.id);
                      return (
                        <JackpotPage 
                          jackpot={activeJackpot}
                          hasPaid={isJackpotUnlocked}
                          isLoading={loadingDb}
                          onOpenPayment={handleOpenPayment}
                          onBackToList={() => handleSelectPage('jackpot-list')}
                          pageId={activePage}
                        />
                      );
                    }
                  }

                  // 2. Is it a competitor, category, or custom markdown landing page?
                  if (pageMd.type === 'competitor' || pageMd.type === 'category' || pageMd.type === 'custom' || pageMd.title) {
                    const dynamicCategory: PredictionCategory = {
                      id: activePage,
                      name: pageMd.displayTitle || pageMd.title || activePage,
                      label: pageMd.displayTitle || pageMd.title || activePage,
                      countText: getCategoryCountText(activePage),
                      description: pageMd.description,
                      icon: pageMd.icon || "⚽",
                      badgeColor: pageMd.badgeColor || "bg-indigo-100 dark:bg-indigo-950/40 text-slate-950 dark:text-slate-100 border-indigo-300 dark:border-indigo-700"
                    };

                    const categoryFixtures = getCategoryFixtures(
                      pageMd.fixturesCategory || activePage, 
                      dbPredictions.all && dbPredictions.all.length > 0 ? dbPredictions.all : dbPredictions, 
                      pageMd.type
                    );

                    return (
                      <CategoryPredictionsPage 
                        category={dynamicCategory}
                        fixtures={categoryFixtures}
                        isLoading={loadingDb || loadingCategory}
                        onBackToHome={() => handleSelectPage('home')}
                        onSelectPage={handleSelectPage}
                        onOpenPayment={handleOpenPayment}
                        jackpots={dbJackpots}
                        pageId={activePage}
                      />
                    );
                  }
                }

                // DEFAULT: Home Layout
                const homeMd = getMarkdownContent('home');
                const todayFixtures = getCategoryFixtures('category-today', dbPredictions.all && dbPredictions.all.length > 0 ? dbPredictions.all : dbPredictions);

                return (
                  <div className="space-y-8 text-left">
                    {/* 1. HERO BANNER */}
                    <section id="hero" className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-blue-50/20 dark:to-blue-950/10 shadow-xs relative overflow-hidden text-left p-5 sm:p-7 md:p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        
                        {/* Left: Headline & Intro */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[10px] font-mono font-bold   tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Welcome to Cheerplex.</span>
                          </div>

                          <h1 
                            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.15] text-[var(--text)]   font-display"
                          >
                            {homeMd.displayTitle || homeMd.title || "Mathematical Football Predictions & Sure Daily Bankers"}
                          </h1>

                          {homeMd.introParagraph ? (
                            <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xl font-normal">
                              <MarkdownRenderer content={homeMd.introParagraph} />
                            </div>
                          ) : (
                            <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                              <p className="line-clamp-3 sm:line-clamp-none">
                                {homeMd.description || "Access mathematically validated football predictions, high-confidence single bankers, and Kenyan jackpot combination codes audited by Cheerplex algorithms."}
                              </p>
                            </div>
                          )}

                          {/* Top Quick Action Buttons: Only Today Tips and Mega JP */}
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                              onClick={() => handleSelectPage('category-today')}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer border-none"
                            >
                              <Zap className="w-4 h-4 text-amber-300" />
                              <span>Today Tips</span>
                            </button>
                            <button
                              onClick={() => handleSelectPage('sportpesa-mega')}
                              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center gap-2"
                            >
                              <Trophy className="w-4 h-4 text-slate-950" />
                              <span>Mega JP</span>
                            </button>
                          </div>
                        </div>

                        {/* Right: Featured Banker Spotlight Showcase Card */}
                        <div className="lg:col-span-5">
                          <TopBankerCard 
                            fixtures={dbPredictions['category-today'] && dbPredictions['category-today'].length > 0 
                              ? dbPredictions['category-today'] 
                              : (dbPredictions.all && dbPredictions.all.length > 0 ? dbPredictions.all : fixturesData.today)}
                            variant="hero"
                            onExploreMore={() => handleSelectPage('category-today')}
                          />
                        </div>

                      </div>
                    </section>

                    {/* 2. TODAY'S PRIMARY FIXTURES */}
                    <section id="predictions" className="space-y-4">
                      <PredictionsList 
                        isLoading={loadingDb}
                        fixtures={todayFixtures}
                        title={homeMd.listTitle || "Cheerplex Verified Daily Predictions"}
                        subtitle={homeMd.listSubtitle || "Mathematical probabilities and double-chance safety locks updated daily across 20+ leagues worldwide."}
                      />
                    </section>

                    {/* 5. KENYAN BOOKMAKER JACKPOTS COMMAND DESK */}
                    <section id="jackpot-section" className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs relative overflow-hidden text-left space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                        <div className="space-y-1 max-w-xl">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-mono font-bold  ">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>Kenyan Jackpot Analytics Engine</span>
                          </div>
                          <h2 className="text-base sm:text-xl font-black text-[var(--text)] tracking-tight   font-display">
                            Cheerplex Premium Kenyan Jackpots
                          </h2>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            Mathematically calibrated prediction codes for SportPesa Mega (17), SportPesa Midweek (13), Betika Midweek (15), Mozzart Grand (20), and Mozzart Super Daily (16).
                          </p>
                        </div>

                        <a
                          href={getPageUrl('jackpot-list')}
                          onClick={(e) => {
                            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                              e.preventDefault();
                              handleSelectPage('jackpot-list');
                            }
                          }}
                          className="px-5 py-2.5 shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono rounded-xl shadow-xs transition-all no-underline cursor-pointer flex items-center gap-2 border-none"
                        >
                          <span>ALL 5 JACKPOTS</span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {dbJackpots.slice(0, 4).map((item, idx) => (
                          <div
                            key={`home-jp-${item.id || idx}-${idx}`}
                            className="p-4 rounded-2xl border border-[var(--border)] bg-slate-50/70 dark:bg-slate-900/40 hover:border-blue-500/40 transition-all flex flex-col justify-between gap-3 shadow-xs"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                                  {item.gamesCount} GAMES
                                </span>
                                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  ACTIVE
                                </span>
                              </div>
                              <h3 className="text-xs sm:text-sm font-black text-[var(--text)]   font-display">
                                {item.name}
                              </h3>
                              <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-[var(--border)] flex items-baseline justify-between">
                                <span className="text-[9px] font-mono   text-slate-500">Pool Prize</span>
                                <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                                  {item.estimatedPool}
                                </span>
                              </div>
                            </div>

                            <a
                              href={getPageUrl(item.id)}
                              onClick={(e) => {
                                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSelectPage(item.id);
                                }
                              }}
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black font-mono   rounded-xl transition-all no-underline cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                            >
                              <span>Analyze Combination</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 6. VIP SUBSCRIPTION MODULE */}
                    <div id="vip-showcase">
                      <VipPackages 
                        packages={dbVipPackages}
                        onOpenPayment={handleOpenPayment}
                        userPurchasedItemIds={userPurchasedItemIds}
                      />
                    </div>

                    {/* 7. PREMIUM ODDS PACKS MODULE */}
                    <div id="odds-packs">
                      <OddsPacks 
                        packs={dbOddsPacks}
                        onOpenPayment={handleOpenPayment}
                        userPurchasedItemIds={userPurchasedItemIds}
                        title="Cheerplex VIP Odds"
                        subtitle="Access verified low-variance algorithmic accumulators and Kenyan jackpot pool combinations via M-Pesa."
                      />
                    </div>

                    {/* 8. EXPERT INSIGHTS & EDITORIAL MARKDOWN */}
                    <div className="space-y-6">
                      {(homeMd.sectionTitle || homeMd.sectionDescription || homeMd.overview || homeMd.analysis || homeMd.meat) && (
                        <section id="expert-insights" className="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4">
                          <div className="space-y-1 border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <h2 className="text-base sm:text-lg font-black   text-[var(--text)] tracking-tight font-display">
                                {homeMd.sectionTitle || "Cheerplex Quantitative Analysis & Strategy"}
                              </h2>
                            </div>
                            {homeMd.sectionDescription && (
                              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                                {homeMd.sectionDescription}
                              </p>
                            )}
                          </div>
                          {homeMd.overview && (
                            <div className="text-sm text-[var(--text-muted)] leading-relaxed pb-3 border-b border-[var(--border)]">
                              <MarkdownRenderer content={homeMd.overview} />
                            </div>
                          )}
                          {(homeMd.analysis || homeMd.meat) && (
                            <MarkdownRenderer content={homeMd.analysis || homeMd.meat} />
                          )}
                        </section>
                      )}

                      <InboundLinksBlock 
                        pageId="home" 
                        onSelectPage={handleSelectPage} 
                      />

                      {(homeMd.author || homeMd.authorName) && (
                        <AuthorCard 
                          authorId={homeMd.authorId}
                          author={homeMd.author}
                          name={homeMd.authorName} 
                          title={homeMd.authorTitle} 
                          description={homeMd.authorDescription} 
                          avatar={homeMd.authorAvatar} 
                        />
                      )}

                      <FaqSection pageId="home" />

                      <ResponsibleGamblingNotice notice={homeMd?.responsibleGambling} />
                    </div>
                  </div>
                );
              })()}
              </Suspense>
            </main>

            {/* RIGHT SIDEBAR PANEL */}
            <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
              {['jackpot-list', ...ALL_JACKPOT_IDS].includes(activePage) ? (
                <JackpotSidebar 
                  jackpotId={activePage} 
                  jackpotName={dbJackpots.find(j => j.id === activePage || j.slug === activePage)?.name}
                  hasPaid={unlockedJackpots.includes(activePage)}
                  fixtures={Array.isArray(dbPredictions) ? dbPredictions : (dbPredictions.all || [])}
                  onOpenPayment={handleOpenPayment}
                  onSelectPage={handleSelectPage}
                />
              ) : (
                <>
                  <PredictionsSidebar 
                    activeCategoryId={activePage}
                    onSelectCategory={(id) => handleSelectPage(id)}
                    fixtures={Array.isArray(dbPredictions) ? dbPredictions : (dbPredictions.all || [])}
                    onOpenPayment={handleOpenPayment}
                    onSelectPage={handleSelectPage}
                    jackpots={dbJackpots}
                  />
                  <LiveUpdates 
                    onScrollTo={handleScrollTo} 
                    fixtures={Array.isArray(dbPredictions) ? dbPredictions : (dbPredictions.all || [])} 
                    onSelectPage={handleSelectPage}
                  />
                </>
              )}
            </aside>

          </div>
      </div>

      {/* 4. MODAL FOR INTEGRATED SECURE PAYMENTS */}
      {paymentOpen && (
        <Suspense fallback={null}>
          <PaymentModal 
            isOpen={paymentOpen}
            onClose={() => setPaymentOpen(false)}
            packageName={payPackageName}
            price={payPrice}
            packageId={payId}
            packageSlug={paySlug}
            packageType={payType}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Suspense>
      )}

      {/* 5. INTERACTIVE FLOOR TOAST ALERTS */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white shadow-xl text-xs flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 6. FLOATING WHATSAPP BUTTON */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
        <a 
          href={`https://wa.me/${(siteContacts.whatsapp || siteContacts.phone || '+254740841375').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Cheerplex Support, I need today tips')}`} 
          target="_blank" 
          rel="nofollow noopener noreferrer"
          aria-label="Chat with Cheerplex support on WhatsApp"
          title="Contact WhatsApp Support"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0012.012 2zm0 2c2.133 0 4.14.83 5.648 2.338a7.935 7.935 0 012.338 5.646c-.001 4.41-3.587 7.996-7.996 7.996h-.003a7.936 7.936 0 01-3.801-.973l-.272-.162-2.825.668.683-2.756-.178-.283a7.938 7.938 0 01-1.213-4.184c0-4.409 3.586-7.994 7.995-7.994zm-3.084 4.5c-.171 0-.447.064-.681.318-.233.255-.892.871-.892 2.124 0 1.253.913 2.463 1.04 2.633.128.17 1.796 2.742 4.352 3.846 2.124.918 2.557.735 3.024.693.467-.043 1.508-.616 1.72-1.21.212-.595.212-1.105.148-1.211-.063-.106-.233-.17-.488-.297-.255-.127-1.508-.743-1.741-.828-.233-.085-.403-.127-.573.128-.17.254-.658.828-.807 1.002-.149.173-.297.191-.552.064-.255-.128-1.077-.397-2.052-1.266-.759-.677-1.272-1.513-1.421-1.768-.149-.255-.016-.393.111-.52.115-.114.255-.297.382-.446.128-.149.17-.255.255-.425.085-.17.043-.318-.021-.446-.064-.127-.573-1.381-.786-1.89-.207-.496-.418-.429-.573-.437-.149-.008-.318-.008-.488-.008z" />
          </svg>
        </a>
      </div>

      {/* 8. CHEERPLEX FOOTER */}
      <footer className="mt-20 border-t border-[var(--border)] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-300 py-14 pb-28 md:pb-14 text-xs transition-colors duration-300 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
          
          {/* Main 4-Column Directory Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-left">
            
            {/* Column 1: Cheerplex Sports Intelligence Core */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheerplexLogo variant="emblem" size={42} className="shadow-md" />
                <div className="flex flex-col">
                  <span className="font-black text-lg text-white tracking-tight flex items-center gap-1.5 font-display">
                    CHEER<span className="text-blue-400">PLEX</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-blue-950 text-blue-300 font-mono border border-blue-800/60">
                      .CO.KE
                    </span>
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono   tracking-wider">
                    Your Best Sports Lab • Nairobi
                  </span>
                </div>
              </div>

              <p className="leading-relaxed text-slate-400 text-xs">
                Providing accurate betting predictions and tips for major jackpots and matches worldwide. Trust our experts for your betting success.              </p>

              {/* Direct Support & Hotline Badges */}
              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-mono   tracking-wider text-slate-400 font-bold block">
                  Verified Dispatch Channels:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {siteContacts.whatsapp && (
                    <a 
                      href={`https://wa.me/${siteContacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Cheerplex Support, I need today tips')}`} 
                      target="_blank" 
                      rel="nofollow noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] font-bold hover:bg-emerald-900 transition-all no-underline" 
                      title="WhatsApp VIP Hotline"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp 24/7</span>
                    </a>
                  )}
                  {siteContacts.telegram && (
                    <a 
                      href={siteContacts.telegram} 
                      target="_blank" 
                      rel="nofollow noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800/60 font-mono text-[11px] font-bold hover:bg-sky-900 transition-all no-underline" 
                      title="Telegram VIP Channel"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-400" />
                      <span>Telegram</span>
                    </a>
                  )}
                  <a 
                    href={getPageUrl('contact')}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        handleSelectPage('contact');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700 font-mono text-[11px] font-bold hover:bg-slate-700 transition-all no-underline cursor-pointer" 
                    title="Contact Support Desk"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    <span>Support</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Mathematical Markets Directory */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-black   tracking-wider font-mono border-b border-slate-800 pb-2">
                Mathematical Predictions
              </strong>
              <div className="flex flex-col gap-1.5 font-medium text-xs">
                <a 
                  href={getPageUrl('category-today')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('category-today'); 
                      handleScrollTo('predictions');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Today's Banker Predictions</span>
                  <span className="text-[10px] font-mono text-emerald-400">Live</span>
                </a>
                <a 
                  href={getPageUrl('category-tomorrow')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('category-tomorrow'); 
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Tomorrow's Early Lines</span>
                  <span className="text-[10px] font-mono text-slate-500">Early</span>
                </a>
                <a 
                  href={getPageUrl('category-yesterday')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('category-yesterday'); 
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Yesterday's Verified Archive</span>
                  <span className="text-[10px] font-mono text-slate-500">Results</span>
                </a>
                <a 
                  href="/#odds-packs"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      if (activePage === 'home') {
                        handleScrollTo('odds-packs');
                      } else {
                        handleSelectPage('home');
                        setTimeout(() => handleScrollTo('odds-packs'), 100);
                      }
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Target Decimal Odds Slips</span>
                  <span className="text-[10px] font-mono text-amber-400">2x - 10x</span>
                </a>
                <a 
                  href={getPageUrl('cheerplex-betting-tips')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('cheerplex-betting-tips');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Cheerplex Betting Tips</span>
                  <span className="text-[10px] font-mono text-cyan-400">Picks</span>
                </a>
                <a 
                  href={getPageUrl('chearplex-prediction')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('chearplex-prediction');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Chearplex Prediction</span>
                  <span className="text-[10px] font-mono text-purple-400">Tips</span>
                </a>
                <a 
                  href={getPageUrl('vip-packages')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('vip-packages');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Cheerplex VIP Packages</span>
                  <span className="text-[10px] font-mono text-amber-300">Join VIP</span>
                </a>
              </div>
            </div>

            {/* Column 3: Kenyan Jackpot Pools Directory */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-black   tracking-wider font-mono border-b border-slate-800 pb-2">
                Kenyan Jackpot Pools
              </strong>
              <div className="flex flex-col gap-1.5 font-medium text-xs">
                <a 
                  href={getPageUrl('sportpesa-mega')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('sportpesa-mega');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>SportPesa Mega (17 Games)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Ksh 385M</span>
                </a>
                <a 
                  href={getPageUrl('sportpesa-midweek')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('sportpesa-midweek');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>SportPesa Midweek (13 Games)</span>
                  <span className="text-[10px] font-mono text-blue-400">Ksh 15M</span>
                </a>
                <a 
                  href={getPageUrl('betika-midweek')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('betika-midweek');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Betika Midweek (15 Games)</span>
                  <span className="text-[10px] font-mono text-blue-400">Ksh 15M</span>
                </a>
                <a 
                  href={getPageUrl('mozzart-grand')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('mozzart-grand');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Mozzart Grand (20 Games)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Ksh 200M</span>
                </a>
                <a 
                  href={getPageUrl('mozzart-super-daily')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('mozzart-super-daily');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Mozzart Super Daily (16 Games)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Ksh 20M</span>
                </a>
                <a 
                  href={getPageUrl('cheerplex-mega-jackpot-prediction')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('cheerplex-mega-jackpot-prediction');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>Cheerplex Mega Jackpot</span>
                  <span className="text-[10px] font-mono text-amber-400">Tips</span>
                </a>
                <a 
                  href={getPageUrl('cheerplex-sportpesa-jackpot-prediction')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('cheerplex-sportpesa-jackpot-prediction');
                    }
                  }}
                  className="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>SportPesa Jackpot Prediction</span>
                  <span className="text-[10px] font-mono text-emerald-400">17 & 13</span>
                </a>
                <a 
                  href={getPageUrl('jackpot-list')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('jackpot-list');
                    }
                  }}
                  className="py-1 text-blue-400 font-bold hover:underline transition-colors no-underline cursor-pointer flex items-center justify-between"
                >
                  <span>View All 5 Jackpot Pools →</span>
                </a>
              </div>
            </div>

            {/* Column 4: Compliance, Security & Player Protection */}
            <div className="space-y-3">
              <strong className="text-white block text-xs font-black   tracking-wider font-mono border-b border-slate-800 pb-2">
                Integrity & Compliance
              </strong>
              <p className="leading-relaxed text-[11px] text-slate-400">
                Betting involves risk. Please gamble responsibly and only bet what you can afford to lose. Our predictions are not guaranteed success. Must be 18+ to participate in betting.              
                </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[10.5px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gambling Helpline:</span>
                  <strong className="text-rose-400">0800 720 000</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>M-Pesa Pochi:</span>
                  <strong className="text-emerald-400">0740841375</strong>
                </div>
              </div>

              <div className="pt-1">
                <a 
                  href={getPageUrl('responsible-gambling')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSelectPage('responsible-gambling');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10.5px] font-mono font-bold   tracking-wider border border-rose-800/80 transition-all no-underline cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Responsible Play Advisory</span>
                </a>
              </div>
            </div>

          </div>

          {/* External Links Bar */}
          <div id="footer-external-links" className="pt-8 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3.5 gap-y-2 text-xs">
              {dbExternalLinks.map((item, idx) => {
                const isDofollow = item.isDofollow || item.rel === 'dofollow';
                const relAttr = isDofollow ? 'noopener' : 'nofollow noopener noreferrer';
                return (
                  <span key={`footer-link-${item.id}`} className="inline-flex items-center gap-3.5">
                    <a
                      id={`footer-link-${item.id}`}
                      href={item.url}
                      target={item.target || '_blank'}
                      rel={relAttr}
                      className="font-medium text-slate-400 hover:text-blue-400 transition-colors no-underline hover:underline"
                    >
                      {item.anchorText}
                    </a>
                    {idx < dbExternalLinks.length - 1 && (
                      <span className="text-slate-700 select-none">•</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Bottom Legal Copyright & Links Row */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="font-mono text-[11px] text-center md:text-left">
              © 2026 CHEERPLEX SPORTS . All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono font-bold text-[11px]">
              <a 
                href={getPageUrl('contact')}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    handleSelectPage('contact');
                  }
                }}
                className="hover:text-blue-400 text-slate-400 no-underline cursor-pointer"
              >
                Contact
              </a>
              <span className="text-slate-700 select-none">•</span>
              <a 
                href={getPageUrl('responsible-gambling')}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    handleSelectPage('responsible-gambling');
                  }
                }}
                className="hover:text-blue-400 text-slate-400 no-underline cursor-pointer"
              >
                Responsible Gambling
              </a>
              <span className="text-slate-700 select-none">•</span>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400 text-slate-400 no-underline"
              >
                XML Sitemap
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* MINIMALIST MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] lg:hidden px-3 py-1.5 shadow-lg transition-colors"
      >
        <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
          {/* 1. Mega JP */}
          <button
            type="button"
            onClick={() => handleSelectPage('sportpesa-mega')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 transition-colors cursor-pointer bg-transparent border-none ${
              activePage === 'sportpesa-mega' 
                ? 'text-amber-500 font-bold' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Mega JP</span>
          </button>

          {/* 2. Midweek */}
          <button
            type="button"
            onClick={() => handleSelectPage('sportpesa-midweek')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 transition-colors cursor-pointer bg-transparent border-none ${
              activePage === 'sportpesa-midweek' || activePage === 'betika-midweek'
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-5 h-5 text-rose-500" />
            <span className="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Midweek</span>
          </button>

          {/* 3. VIP (Opens VIP page) */}
          <button
            type="button"
            onClick={() => handleSelectPage('vip-packages')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 transition-colors cursor-pointer bg-transparent border-none ${
              activePage === 'vip-packages' || activePage === 'vip'
                ? 'text-amber-500 dark:text-amber-400 font-bold' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] mt-0.5 tracking-tight font-mono font-bold">VIP</span>
          </button>

          {/* 4. Odd Packs */}
          <button
            type="button"
            onClick={() => {
              if (activePage === 'home') {
                handleScrollTo('odds-packs');
              } else {
                handleSelectPage('home');
                setTimeout(() => handleScrollTo('odds-packs'), 150);
              }
            }}
            className="flex flex-col items-center justify-center py-1.5 px-1 transition-colors cursor-pointer bg-transparent border-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Odd Packs</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
