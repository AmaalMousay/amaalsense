/**
 * Wikipedia Page View Service
 *
 * Wikipedia page views are a strong proxy for "collective curiosity" —
 * people search Wikipedia when they want to understand something.
 * This feeds directly into AmalSense's curiosity metric.
 *
 * API: https://wikimedia.org/api/rest_v1/metrics/pageviews/
 * Free, no API key required.
 */

export interface WikipediaPageView {
  article: string;
  views: number;
  rank: number;
  timestamp: number;
}

const WIKI_BASE = 'https://wikimedia.org/api/rest_v1/metrics/pageviews';

/**
 * Get the most viewed Wikipedia articles for a given country
 */
export async function fetchTopPageViews(
  countryCode: string = 'en',
  limit: number = 20,
): Promise<WikipediaPageView[]> {
  try {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const dateStr = twoDaysAgo.toISOString().slice(0, 10).replace(/-/g, '/');

    const url = `${WIKI_BASE}/top/${countryCode}.wikipedia.org/all-access/${dateStr}`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'AmalSense/1.0 (Research Project)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.items?.[0]?.articles) return [];

    return data.items[0].articles.slice(0, limit).map((a: any, i: number) => ({
      article: a.article.replace(/_/g, ' '),
      views: a.views || 0,
      rank: i + 1,
      timestamp: Date.now(),
    }));
  } catch {
    return [];
  }
}

/**
 * Convert Wikipedia page views to RawDataItem format
 */
export function wikiToRawDataItems(
  views: WikipediaPageView[],
): import('./unifiedDataCollector').RawDataItem[] {
  return views.map((v) => ({
    id: `wiki_${v.article}_${Date.now()}`,
    timestamp: Date.now(),
    title: v.article,
    description: `${v.views.toLocaleString()} page views in the last 48 hours`,
    source: 'Wikipedia',
    sourceType: 'analysis' as const,
    platform: 'Wikipedia',
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(v.article.replace(/ /g, '_'))}`,
    publishedAt: new Date().toISOString(),
    language: 'en',
    region: 'global' as const,
    topic: 'other' as const,
    intensity: Math.min(1, v.views / 100000),
    trustScore: 90,
  }));
}
