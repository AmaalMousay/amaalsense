/**
 * Google Trends Service
 *
 * Fetches real-time search interest data from Google Trends.
 * This is a key "attention signal" for AmalSense — it tells us what
 * people are actually searching for and how interest changes over time.
 *
 * Uses the unofficial google-trends-api approach via RSS feed.
 * No API key required.
 */

export interface TrendItem {
  query: string;
  score: number;          // 0-100 relative popularity
  breakout: number;       // 0 or 1 — sudden increase
  timestamp: number;
}

const TRENDS_BASE = 'https://trends.google.com/trending/rss';

/**
 * Get daily trending searches globally
 */
export async function fetchGlobalTrends(): Promise<TrendItem[]> {
  try {
    const res = await fetch(`${TRENDS_BASE}?geo=GLOBAL`, {
      headers: { 'User-Agent': 'AmalSense/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const text = await res.text();
    return parseTrendRSS(text);
  } catch {
    return [];
  }
}

/**
 * Get trending searches for a specific country
 */
export async function fetchCountryTrends(countryCode: string): Promise<TrendItem[]> {
  try {
    const res = await fetch(`${TRENDS_BASE}?geo=${countryCode}`, {
      headers: { 'User-Agent': 'AmalSense/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const text = await res.text();
    return parseTrendRSS(text);
  } catch {
    return [];
  }
}

/**
 * Search interest over time for a specific query (0-100)
 */
export async function getSearchInterest(query: string): Promise<number> {
  // Google Trends Daily RSS doesn't support historical directly
  // This returns a proxy score based on trending data
  try {
    const trends = await fetchGlobalTrends();
    const match = trends.find(
      (t) => t.query.toLowerCase().includes(query.toLowerCase())
    );
    return match?.score ?? 0;
  } catch {
    return 0;
  }
}

function parseTrendRSS(xml: string): TrendItem[] {
  const items: TrendItem[] = [];
  const channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/);
  if (!channelMatch) return [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(channelMatch[1])) !== null) {
    const item = match[1];
    const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const approx = item.match(/<approx_traffic>(.*?)<\/approx_traffic>/)?.[1] || '';
    const newsItem = item.match(/<news_item_title>(.*?)<\/news_item_title>/) ? true : false;

    // Skip news items, keep pure searches
    if (!title) continue;

    const score = approx ? parseInt(approx.replace(/[+,]/g, '')) || 50 : 30;
    const breakout = approx.includes('+') ? 1 : 0;

    items.push({
      query: decodeXml(title),
      score: Math.min(100, Math.max(0, score)),
      breakout,
      timestamp: Date.now(),
    });
  }

  return items.slice(0, 30);
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Convert trends to RawDataItem format for the unified collector
 */
export function trendToRawDataItem(trend: TrendItem, countryCode?: string): import('./unifiedDataCollector').RawDataItem | null {
  if (!trend.query) return null;
  return {
    id: `trend_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    title: trend.query,
    description: `Search interest: ${trend.score}/100${trend.breakout ? ' (BREAKOUT!)' : ''}`,
    source: 'Google Trends',
    sourceType: 'analysis',
    platform: 'GoogleTrends',
    url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.query)}`,
    publishedAt: new Date().toISOString(),
    language: 'en',
    country: countryCode,
    region: 'global',
    topic: 'other',
    intensity: trend.score / 100,
    trustScore: Math.max(50, trend.score),
  };
}
