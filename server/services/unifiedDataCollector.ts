/**
 * UNIFIED DATA COLLECTOR
 *
 * Central data ingestion point for AmalSense. Coordinates multiple sources:
 *
 * News Layer:
 *   - Google RSS (by country / topic)
 *   - GNews API
 *   - News Service (RSS feeds)
 *   - Web Scraper (Google News scrape fallback)
 *
 * Social Layer:
 *   - Reddit (via socialMediaService)
 *
 * The collector normalises every source into a standard RawDataItem,
 * deduplicates, caches, and optionally feeds the knowledge core.
 */

import { fetchGoogleNewsByCountry, fetchGoogleNewsByTopic } from './googleRssService';
import { fetchCountryNews } from './newsService';
import { searchGNews } from './gnewsService';
import { fetchRedditPosts } from './socialMediaService';
import { WebScraperService } from './webScraperService';

// ============================================================
// TYPES
// ============================================================

export type TopicType =
  | 'health' | 'economy' | 'politics' | 'conflict' | 'society'
  | 'environment' | 'technology' | 'culture' | 'other';

export interface RawDataItem {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  source: string;
  sourceType: 'news' | 'social' | 'analysis';
  platform: string;
  url: string;
  publishedAt: string;
  language: string;
  country?: string;
  region: 'global' | 'europe' | 'asia' | 'africa' | 'americas' | 'oceania';
  topic: TopicType;
  intensity: number;
  trustScore: number;
}

export interface CollectedData {
  items: RawDataItem[];
  sources: string[];
  sourceCount: number;
  fetchedAt: number;
  query: string;
  queryType: 'country' | 'topic' | 'question';
  countryCode?: string;
}

// ============================================================
// SETUP
// ============================================================

const scraper = new WebScraperService();

// ============================================================
// CACHE
// ============================================================

const dataCache = new Map<string, { data: CollectedData; expiresAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ============================================================
// HELPERS
// ============================================================

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function detectTopic(text: string): TopicType {
  const t = text.toLowerCase();
  if (/health|virus|doctor|medical|hospital|medicine/i.test(t)) return 'health';
  if (/economy|market|finance|trading|stock|inflation|currency/i.test(t)) return 'economy';
  if (/politics|election|government|parliament|minister/i.test(t)) return 'politics';
  if (/conflict|war|army|attack|clash|security|military/i.test(t)) return 'conflict';
  if (/environment|climate|green|nature|pollution/i.test(t)) return 'environment';
  if (/technology|software|ai|digital|cyber/i.test(t)) return 'technology';
  if (/culture|art|music|movie|heritage|tradition/i.test(t)) return 'culture';
  if (/society|people|community|social|protest|public/i.test(t)) return 'society';
  return 'other';
}

const REGION_MAP: Record<string, RawDataItem['region']> = {
  US: 'americas', CA: 'americas', BR: 'americas',
  GB: 'europe', FR: 'europe', DE: 'europe', IT: 'europe', ES: 'europe',
  EG: 'africa', ZA: 'africa', NG: 'africa', LY: 'africa',
  CN: 'asia', JP: 'asia', IN: 'asia', KR: 'asia',
  AU: 'oceania',
};

function detectRegion(countryCode?: string): RawDataItem['region'] {
  return (countryCode && REGION_MAP[countryCode]) || 'global';
}

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title}|${item.platform}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================================
// SOURCE COLLECTORS
// ============================================================

async function collectFromRSS(query: string, countryCode?: string): Promise<RawDataItem[]> {
  try {
    const items = countryCode
      ? await fetchGoogleNewsByCountry(countryCode)
      : await fetchGoogleNewsByTopic(query);
    return ((items as any[]) || []).map((item) => ({
      id: genId(),
      timestamp: Date.now(),
      title: item.title || '',
      description: item.content || item.title || '',
      source: item.source || 'Google RSS',
      sourceType: 'news' as const,
      platform: 'Google RSS',
      url: item.link || '',
      publishedAt: new Date().toISOString(),
      language: 'en',
      country: countryCode,
      region: detectRegion(countryCode),
      topic: detectTopic((item.title || '') + ' ' + (item.content || '')),
      intensity: 0.5,
      trustScore: 75,
    }));
  } catch {
    return [];
  }
}

async function collectFromScraper(query: string, countryCode?: string): Promise<RawDataItem[]> {
  try {
    const scraped = await scraper.scrapeNews(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`,
    );
    return scraped.map((item) => ({
      id: genId(),
      timestamp: Date.now(),
      title: item.title,
      description: item.content,
      source: item.source,
      sourceType: 'news' as const,
      platform: 'WebScraper',
      url: item.url,
      publishedAt: item.timestamp || new Date().toISOString(),
      language: 'en',
      region: detectRegion(countryCode),
      topic: detectTopic(item.title + ' ' + item.content),
      intensity: 0.6,
      trustScore: 85,
    }));
  } catch {
    return [];
  }
}

async function collectFromSocial(query: string): Promise<RawDataItem[]> {
  try {
    const posts = await fetchRedditPosts(query);
    return (posts || []).map((p: any) => ({
      id: genId(),
      timestamp: new Date(p.created_utc || Date.now()).getTime(),
      title: p.title || '',
      description: p.selftext || '',
      source: 'reddit.com',
      sourceType: 'social' as const,
      platform: 'Reddit',
      url: p.url || `https://reddit.com${p.permalink || ''}`,
      publishedAt: new Date(p.created_utc || Date.now()).toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic((p.title || '') + ' ' + (p.selftext || '')),
      intensity: Math.min(1, (p.score || 0) / 100),
      trustScore: Math.min(100, (p.upvote_ratio || 0.5) * 100),
    }));
  } catch {
    return [];
  }
}

// ============================================================
// ALL SOURCES
// ============================================================

async function collectAllSources(query: string, countryCode?: string): Promise<RawDataItem[]> {
  const [rss, scraped, social] = await Promise.all([
    collectFromRSS(query, countryCode),
    collectFromScraper(query, countryCode),
    collectFromSocial(query),
  ]);
  return [...rss, ...scraped, ...social];
}

// ============================================================
// PUBLIC API — used by networkEngine.ts
// ============================================================

export async function collectTopicData(topic: string, region: string = 'global'): Promise<CollectedData> {
  const all = await collectAllSources(topic);
  const filtered = region === 'global' ? all : all.filter((i) => i.region === region);
  const deduped = deduplicateItems(filtered);
  const sources = [...new Set(deduped.map((i) => i.platform))];
  return { items: deduped, sources, sourceCount: sources.length, fetchedAt: Date.now(), query: topic, queryType: 'topic' };
}

export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = `country:${countryCode}`;
  const cached = dataCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const [rssItems, scrapedData] = await Promise.all([
    collectFromRSS(countryName, countryCode),
    collectFromScraper(countryName, countryCode),
  ]);

  const all = [...rssItems, ...scrapedData];
  const deduped = deduplicateItems(all);
  const sources = [...new Set(deduped.map((i) => i.platform))];
  const result: CollectedData = { items: deduped, sources, sourceCount: sources.length, fetchedAt: Date.now(), query: countryName, queryType: 'country', countryCode };

  dataCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

export function getCacheStats() {
  const now = Date.now();
  let valid = 0;
  dataCache.forEach((v) => { if (v.expiresAt > now) valid++; });
  return { totalEntries: dataCache.size, validEntries: valid, expiredEntries: dataCache.size - valid };
}

export function clearCache() {
  dataCache.clear();
  return { success: true };
}
