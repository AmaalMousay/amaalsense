/**
 * UNIFIED DATA COLLECTOR — Multi-Source Edition (V5)
 *
 * Coordinates 5 parallel data sources for maximum coverage:
 *
 *   News Sources:
 *     1. GDELT Project    — strongest, millions of articles, global
 *     2. NewsAPI          — structured news aggregator
 *     3. Google RSS       — quick topic/country RSS feed
 *     4. Web Scraper      — fallback when APIs fail
 *
 *   Social Sources:
 *     5. Reddit           — public sentiment / discussions
 *
 * Every source normalises to RawDataItem[], then deduplicated and cached.
 */

import { fetchGoogleNewsByCountry, fetchGoogleNewsByTopic } from './googleRssService';
import { WebScraperService } from './webScraperService';
import { fetchRedditPosts } from './socialMediaService';
import { fetchAllMajorNews } from './majorNewsRssService';
import { fetchMastodonPosts, fetchBlueskyPosts, fetchYouTubeComments, fetchTelegramPosts } from './socialMediaService';
import { fetchGlobalTrends, fetchCountryTrends, trendToRawDataItem } from './googleTrendsService';
import { fetchTopPageViews, wikiToRawDataItems } from './wikipediaService';
import { fetchAllMajorNews } from './majorNewsRssService';
import { fetchMastodonPosts, fetchBlueskyPosts, fetchYouTubeComments, fetchTelegramPosts } from './socialMediaService';
import { searchGDELT, searchGDELTByCountry } from './gdeltService';
import { searchNewsAPI, getTopHeadlinesByCountry } from './newsApiService';

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

const dataCache = new Map<string, { data: CollectedData; expiresAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function detectTopic(text: string): TopicType {
  const t = text.toLowerCase();
  if (/health|virus|doctor|medical|hospital|medicine|covid|patient/i.test(t)) return 'health';
  if (/economy|market|finance|trading|stock|inflation|currency|gdp|bank/i.test(t)) return 'economy';
  if (/politics|election|government|parliament|minister|president|vote/i.test(t)) return 'politics';
  if (/conflict|war|army|attack|clash|security|military|violence|protest/i.test(t)) return 'conflict';
  if (/environment|climate|green|nature|pollution|emission/i.test(t)) return 'environment';
  if (/technology|software|ai|digital|cyber|tech|startup/i.test(t)) return 'technology';
  if (/culture|art|music|movie|heritage|tradition|film/i.test(t)) return 'culture';
  if (/society|people|community|social|education|housing/i.test(t)) return 'society';
  return 'other';
}

const REGION_MAP: Record<string, RawDataItem['region']> = {
  US: 'americas', CA: 'americas', BR: 'americas', MX: 'americas',
  GB: 'europe', FR: 'europe', DE: 'europe', IT: 'europe',
  ES: 'europe', RU: 'europe', NL: 'europe',
  EG: 'africa', ZA: 'africa', NG: 'africa', LY: 'africa', DZ: 'africa',
  CN: 'asia', JP: 'asia', IN: 'asia', KR: 'asia', SG: 'asia',
  AU: 'oceania',
};

function detectRegion(countryCode?: string): RawDataItem['region'] {
  return (countryCode && REGION_MAP[countryCode]) || 'global';
}

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title.slice(0, 80)}|${item.platform}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================================
// SOURCE COLLECTORS — each returns RawDataItem[]
// ============================================================

async function collectFromGDELT(query: string, countryCode?: string): Promise<RawDataItem[]> {
  try {
    const articles = countryCode
      ? await searchGDELTByCountry(countryCode, query, 20)
      : await searchGDELT(query, 20);
    return articles.map((a) => ({
      id: genId(),
      timestamp: Date.now(),
      title: a.title,
      description: a.description,
      source: a.source,
      sourceType: 'news' as const,
      platform: 'GDELT',
      url: a.url,
      publishedAt: a.publishedAt,
      language: 'en',
      country: a.countryCode || countryCode,
      region: detectRegion(a.countryCode || countryCode),
      topic: detectTopic(a.title + ' ' + a.description),
      intensity: Math.min(1, Math.abs(a.tone) / 100 + 0.3),
      trustScore: Math.max(50, Math.min(100, 60 + Math.abs(a.tone) / 5)),
    }));
  } catch { return []; }
}

async function collectFromNewsAPI(query: string, countryCode?: string): Promise<RawDataItem[]> {
  try {
    const articles = countryCode
      ? await getTopHeadlinesByCountry(countryCode, 15)
      : await searchNewsAPI(query, 15);
    return articles.map((a) => ({
      id: genId(),
      timestamp: Date.now(),
      title: a.title,
      description: a.description,
      source: a.source,
      sourceType: 'news' as const,
      platform: 'NewsAPI',
      url: a.url,
      publishedAt: a.publishedAt,
      language: 'en',
      country: countryCode,
      region: detectRegion(countryCode),
      topic: detectTopic(a.title + ' ' + a.description),
      intensity: 0.5,
      trustScore: 70,
    }));
  } catch { return []; }
}

async function collectFromGoogleRSS(query: string, countryCode?: string): Promise<RawDataItem[]> {
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
  } catch { return []; }
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
  } catch { return []; }
}



async function collectFromTrends(query: string, countryCode?: string): Promise<RawDataItem[]> {
  try {
    const trends = countryCode
      ? await fetchCountryTrends(countryCode)
      : await fetchGlobalTrends();
    return trends.map(t => trendToRawDataItem(t, countryCode)).filter(Boolean) as RawDataItem[];
  } catch { return []; }
}

async function collectFromWikipedia(countryCode?: string): Promise<RawDataItem[]> {
  try {
    const views = await fetchTopPageViews(countryCode || 'en', 15);
    return wikiToRawDataItems(views);
  } catch { return []; }
}

async function collectFromTwitter(query: string): Promise<RawDataItem[]> {
  try {
    const { searchTwitterPosts } = await import('./twitterService');
    const tweets = await searchTwitterPosts({ query, limit: 15 });
    return tweets.map((t) => ({
      id: `tw_${t.id}`,
      timestamp: t.publishedAt.getTime(),
      title: t.text.slice(0, 200),
      description: t.text,
      source: `@${t.author}`,
      sourceType: 'social' as const,
      platform: 'Twitter',
      url: t.url,
      publishedAt: t.publishedAt.toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic(t.text),
      intensity: Math.min(1, (t.engagement.likes + t.engagement.shares) / 5000),
      trustScore: t.isReal ? 80 : 30,
    }));
  } catch { return []; }
}

async function collectFromMajorRSS(_query: string): Promise<RawDataItem[]> {
  try {
    const items = await fetchAllMajorNews(20);
    return items.map((item) => ({
      id: genId(),
      timestamp: new Date(item.pubDate || Date.now()).getTime(),
      title: item.title,
      description: item.description,
      source: item.source,
      sourceType: 'news' as const,
      platform: item.source,
      url: item.link,
      publishedAt: item.pubDate || new Date().toISOString(),
      language: item.language || 'en',
      country: undefined,
      region: 'global' as const,
      topic: detectTopic(item.title + ' ' + item.description),
      intensity: 0.55,
      trustScore: 85,
    }));
  } catch { return []; }
}


async function collectFromMastodon(query: string): Promise<RawDataItem[]> {
  try {
    const posts = await fetchMastodonPosts({ query, limit: 10 });
    return posts.map((p) => ({
      id: p.id || `masto_${Date.now()}`,
      timestamp: p.publishedAt?.getTime() || Date.now(),
      title: p.text?.slice(0, 200) || '',
      description: p.text || '',
      source: p.author || 'mastodon.social',
      sourceType: 'social' as const,
      platform: 'Mastodon',
      url: p.url || '',
      publishedAt: (p.publishedAt || new Date()).toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic(p.text || ''),
      intensity: Math.min(1, (p.engagement?.likes || 0) / 500),
      trustScore: p.isReal ? 70 : 30,
    }));
  } catch { return []; }
}

async function collectFromBluesky(query: string): Promise<RawDataItem[]> {
  try {
    const posts = await fetchBlueskyPosts({ query, limit: 10 });
    return posts.map((p) => ({
      id: p.id || `bsky_${Date.now()}`,
      timestamp: p.publishedAt?.getTime() || Date.now(),
      title: p.text?.slice(0, 200) || '',
      description: p.text || '',
      source: p.author || 'bsky.social',
      sourceType: 'social' as const,
      platform: 'Bluesky',
      url: p.url || '',
      publishedAt: (p.publishedAt || new Date()).toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic(p.text || ''),
      intensity: Math.min(1, (p.engagement?.likes || 0) / 1000),
      trustScore: p.isReal ? 70 : 30,
    }));
  } catch { return []; }
}

async function collectFromYouTube(query: string): Promise<RawDataItem[]> {
  try {
    const comments = await fetchYouTubeComments({ query, limit: 15 });
    return comments.map((p) => ({
      id: p.id || `yt_${Date.now()}`,
      timestamp: p.publishedAt?.getTime() || Date.now(),
      title: p.text?.slice(0, 200) || '',
      description: p.text || '',
      source: p.author || 'YouTube',
      sourceType: 'social' as const,
      platform: 'YouTube',
      url: p.url || '',
      publishedAt: (p.publishedAt || new Date()).toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic(p.text || ''),
      intensity: Math.min(1, (p.engagement?.likes || 0) / 5000),
      trustScore: p.isReal ? 75 : 30,
    }));
  } catch { return []; }
}

async function collectFromTelegram(query: string): Promise<RawDataItem[]> {
  try {
    const posts = await fetchTelegramPosts({ query, limit: 15 });
    return posts.map((p) => ({
      id: p.id || `tg_${Date.now()}`,
      timestamp: p.publishedAt?.getTime() || Date.now(),
      title: p.text?.slice(0, 200) || '',
      description: p.text || '',
      source: p.author || 'Telegram',
      sourceType: 'social' as const,
      platform: 'Telegram',
      url: p.url || '',
      publishedAt: (p.publishedAt || new Date()).toISOString(),
      language: 'en',
      region: 'global' as const,
      topic: detectTopic(p.text || ''),
      intensity: Math.min(1, (p.engagement?.likes || 0) / 2000),
      trustScore: p.isReal ? 70 : 30,
    }));
  } catch { return []; }
}

async function collectFromReddit(query: string): Promise<RawDataItem[]> {
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
      intensity: Math.min(1, (p.score || 0) / 1000),
      trustScore: Math.min(100, (p.upvote_ratio || 0.5) * 100),
    }));
  } catch { return []; }
}

// ============================================================
// ALL SOURCES (parallel)
// ============================================================

async function collectAllSources(query: string, countryCode?: string): Promise<RawDataItem[]> {
  const results = await Promise.allSettled([
    collectFromGDELT(query, countryCode),
    collectFromNewsAPI(query, countryCode),
    collectFromMajorRSS(query),
    collectFromGoogleRSS(query, countryCode),
    collectFromScraper(query, countryCode),
    collectFromReddit(query),
    collectFromTrends(query, countryCode),
    collectFromWikipedia(countryCode),
    collectFromTwitter(query),
  ]);

  const items: RawDataItem[] = [];
  const sourcesUsed: string[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      items.push(...result.value);
      sourcesUsed.push(result.value[0].platform);
    }
  }

  console.log(`[DataCollector] Fetched ${items.length} items from ${sourcesUsed.length} sources: ${sourcesUsed.join(', ')}`);
  return items;
}

// ============================================================
// PUBLIC API
// ============================================================

export async function collectTopicData(topic: string, _region: string = 'global'): Promise<CollectedData> {
  const all = await collectAllSources(topic);
  const deduped = deduplicateItems(all);
  const sources = [...new Set(deduped.map((i) => i.platform))];
  return { items: deduped, sources, sourceCount: sources.length, fetchedAt: Date.now(), query: topic, queryType: 'topic' };
}

export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = `country:${countryCode}`;
  const cached = dataCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const all = await collectAllSources(countryName, countryCode);
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