/**
 * UNIFIED DATA COLLECTOR
 * 
 * Single source of truth for all data fetching in AmalSense.
 * Collects from ALL sources once, caches the result, and provides it to all consumers.
 * 
 * Flow: Sources → Raw Data → Shared Cache → All Engines
 */

import { fetchGoogleNewsByCountry, fetchGoogleNewsByTopic, type NewsItem } from './googleRssService';
import { fetchCountryNews, type NewsArticle } from './newsService';
import { searchGNews } from './gnewsService';
import { fetchRedditPosts, fetchMastodonPosts, fetchBlueskyPosts, type SocialPost, type SocialSearchParams } from './socialMediaService';

// ============================================================
// TYPES
// ============================================================

export interface RawDataItem {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceType: 'news' | 'social' | 'analysis';
  platform: string; // 'google_rss' | 'newsapi' | 'gnews' | 'reddit' | 'mastodon' | 'bluesky'
  url: string;
  publishedAt: string;
  language: string;
  country?: string;
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
// CACHE - Shared across all engines
// ============================================================

interface CacheEntry {
  data: CollectedData;
  expiresAt: number;
}

const dataCache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCacheKey(queryType: string, query: string): string {
  return `${queryType}:${query.toLowerCase().trim()}`;
}

function getCached(key: string): CollectedData | null {
  const entry = dataCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  if (entry) dataCache.delete(key);
  return null;
}

function setCache(key: string, data: CollectedData): void {
  dataCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ============================================================
// DATA FETCHERS
// ============================================================

async function fetchFromGoogleRSS(query: string, countryCode?: string): Promise<RawDataItem[]> {
  const items: RawDataItem[] = [];
  try {
    // Country-specific news
    if (countryCode) {
      const rssNews = await fetchGoogleNewsByCountry(countryCode, 8);
      for (const article of rssNews) {
        items.push({
          id: `rss_${Date.now()}_${items.length}`,
          title: article.title,
          description: article.description || article.title,
          source: article.source || 'Google News',
          sourceType: 'news',
          platform: 'google_rss',
          url: article.link || '',
          publishedAt: article.pubDate || new Date().toISOString(),
          language: 'auto',
          country: countryCode,
        });
      }
    }
    // Topic-based news
    const topicNews = await fetchGoogleNewsByTopic(query, 5);
    for (const article of topicNews) {
      items.push({
        id: `rss_topic_${Date.now()}_${items.length}`,
        title: article.title,
        description: article.description || article.title,
        source: article.source || 'Google News',
        sourceType: 'news',
        platform: 'google_rss',
        url: article.link || '',
        publishedAt: article.pubDate || new Date().toISOString(),
        language: 'auto',
        country: countryCode,
      });
    }
  } catch (error) {
    console.log('[DataCollector] Google RSS fetch failed:', (error as Error).message);
  }
  return items;
}

async function fetchFromNewsAPI(query: string, countryCode?: string): Promise<RawDataItem[]> {
  const items: RawDataItem[] = [];
  try {
    if (countryCode) {
      const articles = await fetchCountryNews(countryCode, 5);
      for (const article of articles) {
        items.push({
          id: `newsapi_${Date.now()}_${items.length}`,
          title: article.title,
          description: article.description || article.title,
          source: article.source || 'NewsAPI',
          sourceType: 'news',
          platform: 'newsapi',
          url: article.url || '',
          publishedAt: article.publishedAt instanceof Date ? article.publishedAt.toISOString() : new Date().toISOString(),
          language: 'en',
          country: countryCode,
        });
      }
    }
  } catch (error) {
    console.log('[DataCollector] NewsAPI fetch failed:', (error as Error).message);
  }
  return items;
}

async function fetchFromGNews(query: string, language: string = 'en'): Promise<RawDataItem[]> {
  const items: RawDataItem[] = [];
  try {
    const articles = await searchGNews({ query, language: language === 'ar' ? 'ar' : 'en', max: 5 });
    for (const article of articles) {
      items.push({
        id: `gnews_${Date.now()}_${items.length}`,
        title: article.title,
        description: article.description || article.title,
        source: (article as any).source || 'GNews',
        sourceType: 'news',
        platform: 'gnews',
        url: article.url || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
        language,
      });
    }
  } catch (error) {
    console.log('[DataCollector] GNews fetch failed:', (error as Error).message);
  }
  return items;
}

async function fetchFromSocialMedia(query: string): Promise<RawDataItem[]> {
  const items: RawDataItem[] = [];
  const params: SocialSearchParams = { query, limit: 5 };
  
  // Reddit
  try {
    const posts = await fetchRedditPosts(params);
    for (const post of posts) {
      items.push({
        id: `reddit_${Date.now()}_${items.length}`,
        title: (post.text || query).slice(0, 200),
        description: post.text || '',
        source: `Reddit (${post.author})`,
        sourceType: 'social',
        platform: 'reddit',
        url: post.url || '',
        publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date().toISOString(),
        language: 'en',
      });
    }
  } catch (error) {
    console.log('[DataCollector] Reddit fetch failed:', (error as Error).message);
  }

  // Mastodon
  try {
    const mastodonParams: SocialSearchParams = { query, limit: 3 };
    const posts = await fetchMastodonPosts(mastodonParams);
    for (const post of posts) {
      items.push({
        id: `mastodon_${Date.now()}_${items.length}`,
        title: (post.text || '').slice(0, 100),
        description: post.text || '',
        source: 'Mastodon',
        sourceType: 'social',
        platform: 'mastodon',
        url: post.url || '',
        publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date().toISOString(),
        language: 'en',
      });
    }
  } catch (error) {
    console.log('[DataCollector] Mastodon fetch failed:', (error as Error).message);
  }

  // Bluesky
  try {
    const blueskyParams: SocialSearchParams = { query, limit: 3 };
    const posts = await fetchBlueskyPosts(blueskyParams);
    for (const post of posts) {
      items.push({
        id: `bluesky_${Date.now()}_${items.length}`,
        title: (post.text || '').slice(0, 100),
        description: post.text || '',
        source: 'Bluesky',
        sourceType: 'social',
        platform: 'bluesky',
        url: post.url || '',
        publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date().toISOString(),
        language: 'en',
      });
    }
  } catch (error) {
    console.log('[DataCollector] Bluesky fetch failed:', (error as Error).message);
  }

  return items;
}

// ============================================================
// MAIN COLLECTION FUNCTIONS
// ============================================================

/**
 * Collect ALL data for a country from ALL sources
 * This is the SINGLE entry point for country data
 */
export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = getCacheKey('country', countryCode);
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[DataCollector] Cache hit for country ${countryCode}`);
    return cached;
  }

  console.log(`[DataCollector] Collecting data for country ${countryCode} (${countryName})`);
  
  // Fetch from ALL sources in parallel
  const [rssItems, newsApiItems, gnewsItems, socialItems] = await Promise.allSettled([
    fetchFromGoogleRSS(countryName, countryCode),
    fetchFromNewsAPI(countryName, countryCode),
    fetchFromGNews(countryName),
    fetchFromSocialMedia(countryName),
  ]);

  const allItems: RawDataItem[] = [];
  if (rssItems.status === 'fulfilled') allItems.push(...rssItems.value);
  if (newsApiItems.status === 'fulfilled') allItems.push(...newsApiItems.value);
  if (gnewsItems.status === 'fulfilled') allItems.push(...gnewsItems.value);
  if (socialItems.status === 'fulfilled') allItems.push(...socialItems.value);

  // Deduplicate by title similarity
  const deduped = deduplicateItems(allItems);
  
  const sources = [...new Set(deduped.map(item => item.platform))];
  
  const result: CollectedData = {
    items: deduped,
    sources,
    sourceCount: sources.length,
    fetchedAt: Date.now(),
    query: countryName,
    queryType: 'country',
    countryCode,
  };

  setCache(cacheKey, result);
  console.log(`[DataCollector] Collected ${deduped.length} items from ${sources.length} sources for ${countryCode}`);
  return result;
}

/**
 * Collect ALL data for a topic/question from ALL sources
 * This is the SINGLE entry point for topic/question data
 */
export async function collectTopicData(query: string, language: string = 'en'): Promise<CollectedData> {
  const cacheKey = getCacheKey('topic', query);
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[DataCollector] Cache hit for topic "${query}"`);
    return cached;
  }

  console.log(`[DataCollector] Collecting data for topic "${query}"`);
  
  // Fetch from ALL sources in parallel
  const [rssItems, gnewsItems, socialItems] = await Promise.allSettled([
    fetchFromGoogleRSS(query),
    fetchFromGNews(query, language),
    fetchFromSocialMedia(query),
  ]);

  const allItems: RawDataItem[] = [];
  if (rssItems.status === 'fulfilled') allItems.push(...rssItems.value);
  if (gnewsItems.status === 'fulfilled') allItems.push(...gnewsItems.value);
  if (socialItems.status === 'fulfilled') allItems.push(...socialItems.value);

  // Deduplicate
  const deduped = deduplicateItems(allItems);
  
  const sources = [...new Set(deduped.map(item => item.platform))];
  
  const result: CollectedData = {
    items: deduped,
    sources,
    sourceCount: sources.length,
    fetchedAt: Date.now(),
    query,
    queryType: 'topic',
  };

  setCache(cacheKey, result);
  console.log(`[DataCollector] Collected ${deduped.length} items from ${sources.length} sources for "${query}"`);
  return result;
}

// ============================================================
// DEDUPLICATION
// ============================================================

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Map<string, RawDataItem>();
  
  for (const item of items) {
    // Normalize title for comparison
    const normalizedTitle = item.title.toLowerCase().trim().replace(/[^\w\s]/g, '').slice(0, 60);
    
    if (!seen.has(normalizedTitle)) {
      seen.set(normalizedTitle, item);
    } else {
      // Keep the one with more description
      const existing = seen.get(normalizedTitle)!;
      if ((item.description?.length || 0) > (existing.description?.length || 0)) {
        seen.set(normalizedTitle, item);
      }
    }
  }
  
  return Array.from(seen.values());
}

// ============================================================
// CACHE MANAGEMENT
// ============================================================

export function getCacheStats(): { entries: number; oldestAge: number } {
  let oldestAge = 0;
  const now = Date.now();
  for (const [, entry] of dataCache) {
    const age = now - entry.data.fetchedAt;
    if (age > oldestAge) oldestAge = age;
  }
  return { entries: dataCache.size, oldestAge };
}

export function clearCache(): void {
  dataCache.clear();
}
