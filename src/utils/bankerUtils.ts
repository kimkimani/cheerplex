import { Fixture } from '../types';
import { getRefinedConfidence } from './probability';
import { isSameDay } from './predictionGenerator';
import { getApiBaseUrl } from '../lib/getApiBaseUrl';

// Global storage for database fixtures
let databaseTodayFixtures: Fixture[] = [];
let cachedDateKey = '';
let cachedBankerFixture: Fixture | null = null;
let isCachedFromDatabase = false;
let isFetchingDatabase = false;

// Listeners for live database banker updates
const bankerListeners = new Set<(banker: Fixture | null) => void>();

export function subscribeToBanker(listener: (banker: Fixture | null) => void): () => void {
  bankerListeners.add(listener);
  return () => {
    bankerListeners.delete(listener);
  };
}

function notifyBankerListeners(banker: Fixture | null) {
  bankerListeners.forEach((fn) => {
    try {
      fn(banker);
    } catch (e) {
      console.error('[BankerUtils] Listener error:', e);
    }
  });
}

function getTodayDateKey(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function isRealDatabaseFixture(f: Fixture): boolean {
  if (!f) return false;
  const idStr = String(f.id);
  // Exclude legacy mock fixtures
  if (idStr === '201' || idStr === '101' || idStr === '301' || idStr === '202' || idStr === '203') return false;
  if (f.homeTeam === 'Arsenal' && f.awayTeam === 'Aston Villa') return false;
  return true;
}

/**
 * Checks whether a fixture has popular status 1 (popular: 1, '1', true).
 */
export function isPopularFixture(f: Fixture): boolean {
  if (!f || !isRealDatabaseFixture(f)) return false;
  const pop = (f as any).popular ?? (f as any).is_popular ?? (f as any).isPopular;
  return pop === 1 || pop === '1' || pop === true || pop === 'true';
}

/**
 * STRICT SELECTION RULE:
 * 1. Must come from Today's tips.
 * 2. Just ONE fixture selected for the whole app.
 * 3. Priority A: One fixture with popular status = 1.
 * 4. Priority B: If no fixture with popular status = 1, the single fixture with highest confidence.
 */
export function selectSingleBankerFromTodayTips(todayTips: Fixture[]): Fixture | null {
  if (!Array.isArray(todayTips) || todayTips.length === 0) {
    return null;
  }

  // Filter out any mock fixtures
  const validTips = todayTips.filter(isRealDatabaseFixture);
  if (validTips.length === 0) return null;

  // 1. Check for fixture with popular status = 1
  const popularFixtures = validTips.filter(isPopularFixture);
  if (popularFixtures.length > 0) {
    const sortedPopular = [...popularFixtures].sort((a, b) => {
      const confA = Number(a.confidence) || getRefinedConfidence(a);
      const confB = Number(b.confidence) || getRefinedConfidence(b);
      const diff = confB - confA;
      if (diff !== 0) return diff;
      return String(a.id).localeCompare(String(b.id));
    });
    return sortedPopular[0];
  }

  // 2. If none with popular = 1, select the single one with the highest confidence
  const sortedByConfidence = [...validTips].sort((a, b) => {
    const confA = Number(a.confidence) || getRefinedConfidence(a);
    const confB = Number(b.confidence) || getRefinedConfidence(b);
    const diff = confB - confA;
    if (diff !== 0) return diff;
    return String(a.id).localeCompare(String(b.id));
  });

  return sortedByConfidence[0] || null;
}

/**
 * Filters any list of fixtures to those matching Today's calendar date
 */
function extractTodayFixtures(fixtures: Fixture[]): Fixture[] {
  if (!Array.isArray(fixtures) || fixtures.length === 0) return [];
  const valid = fixtures.filter(isRealDatabaseFixture);
  if (valid.length === 0) return [];

  const today = new Date();
  
  // If items already have explicit date/kickoff for today
  const matches = valid.filter((f) => {
    if (!f) return false;
    const time = f.kickoffTime || f.date;
    if (!time) return true; // If category=today already returned it
    return isSameDay(time, today);
  });

  // If none strictly matched isSameDay, but fixtures were passed from a today endpoint
  if (matches.length === 0 && valid.length <= 15) {
    return valid;
  }

  return matches.length > 0 ? matches : valid;
}

/**
 * Ingests incoming fixtures and updates the database-backed banker if applicable
 */
export function registerBankerFixtures(fixtures: Fixture[]): void {
  if (!Array.isArray(fixtures) || fixtures.length === 0) return;

  const todayMatches = extractTodayFixtures(fixtures);
  if (todayMatches.length > 0) {
    const existingIds = new Set(databaseTodayFixtures.map((f) => String(f.id)));
    for (const f of todayMatches) {
      if (!existingIds.has(String(f.id))) {
        databaseTodayFixtures.push(f);
        existingIds.add(String(f.id));
      }
    }

    const todayKey = getTodayDateKey();
    const newBanker = selectSingleBankerFromTodayTips(databaseTodayFixtures);
    if (newBanker) {
      cachedDateKey = todayKey;
      cachedBankerFixture = newBanker;
      isCachedFromDatabase = true;
      notifyBankerListeners(newBanker);
    }
  }
}

/**
 * Directly queries the database API for today's predictions
 * to ensure the TOP BANKER OF THE DAY comes directly from the database.
 */
export async function fetchLiveDatabaseBanker(): Promise<Fixture | null> {
  const todayKey = getTodayDateKey();
  if (cachedDateKey === todayKey && cachedBankerFixture && isCachedFromDatabase) {
    return cachedBankerFixture;
  }

  if (isFetchingDatabase) {
    return cachedBankerFixture;
  }

  try {
    isFetchingDatabase = true;
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/predictions?category=today`, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        registerBankerFixtures(data);
        const resolved = selectSingleBankerFromTodayTips(data);
        if (resolved) {
          cachedDateKey = todayKey;
          cachedBankerFixture = resolved;
          isCachedFromDatabase = true;
          notifyBankerListeners(resolved);
          return resolved;
        }
      }
    }
  } catch (err) {
    console.error('[BankerUtils] Failed to fetch live database banker:', err);
  } finally {
    isFetchingDatabase = false;
  }

  return cachedBankerFixture;
}

// Auto-trigger background fetch in browser environments
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchLiveDatabaseBanker().catch(() => {});
  }, 100);
}

/**
 * Resolves the STRICTLY SINGLE "TOP BANKER OF THE DAY" for the whole application.
 * 
 * Rules:
 * 1. Must come from the database today's tips.
 * 2. Just ONE fixture selected on the entire app.
 * 3. Popular status = 1 first; if none with popular=1, the single highest confidence fixture.
 */
export function getTopBankerOfTheDay(fixtures?: Fixture[] | null): Fixture | null {
  const todayKey = getTodayDateKey();

  // Ingest incoming fixtures if provided
  if (fixtures && Array.isArray(fixtures) && fixtures.length > 0) {
    registerBankerFixtures(fixtures);
  }

  // If already have cached database banker for today, return it
  if (cachedDateKey === todayKey && cachedBankerFixture && isCachedFromDatabase) {
    return cachedBankerFixture;
  }

  // Choose from database pool if populated
  if (databaseTodayFixtures.length > 0) {
    const selected = selectSingleBankerFromTodayTips(databaseTodayFixtures);
    if (selected) {
      cachedDateKey = todayKey;
      cachedBankerFixture = selected;
      isCachedFromDatabase = true;
      return selected;
    }
  }

  // Trigger background fetch if in browser and not cached from database
  if (typeof window !== 'undefined' && !isFetchingDatabase) {
    fetchLiveDatabaseBanker().catch(() => {});
  }

  return cachedBankerFixture;
}

/**
 * Calculates a sensible decimal odds representation for the banker fixture.
 */
export function getBankerEstimatedOdds(fixture: Fixture): string {
  const conf = Number(fixture.confidence) || getRefinedConfidence(fixture);
  if (conf >= 90) return '1.55';
  if (conf >= 85) return '1.68';
  if (conf >= 80) return '1.75';
  if (conf >= 75) return '1.86';
  return '1.92';
}
