/**
 * NewsAPI Service
 *
 * Wrapper around newsapi.org (free tier: 100 requests/day, 50 articles/req).
 * Uses the ENV.newsApiKey from env.ts.
 *
 * This is a secondary source that complements GDELT and RSS.
 */

import { ENV } from '../_core/env';

export interface NewsAPIArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  content: string;
}

const BASE = 'https://newsapi.org/v2';

/**
 * Search for news articles by keyword
 */
export async function searchNewsAPI(query: string, maxItems = 20): Promise<NewsAPIArticle[]> {
  if (!ENV.newsApiKey) {
    console.warn('[NewsAPI] No API key configured');
    return [];
  }

  const url = `${BASE}/everything?q=${encodeURIComponent(query)}&pageSize=${maxItems}&sortBy=publishedAt&language=en&apiKey=${ENV.newsApiKey}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (data?.status !== 'ok' || !data.articles) return [];

    return data.articles.map((a: any) => ({
      title: a.title || '',
      description: a.description || a.content || '',
      source: a.source?.name || 'NewsAPI',
      url: a.url || '',
      publishedAt: a.publishedAt || new Date().toISOString(),
      content: a.content || '',
    })).filter((a: NewsAPIArticle) => a.title);
  } catch (err) {
    console.warn('[NewsAPI] Fetch failed:', (err as Error).message);
    return [];
  }
}

/**
 * Get top headlines by country
 */
export async function getTopHeadlinesByCountry(
  countryCode: string,
  maxItems = 20,
): Promise<NewsAPIArticle[]> {
  if (!ENV.newsApiKey) return [];

  const url = `${BASE}/top-headlines?country=${countryCode.toLowerCase()}&pageSize=${maxItems}&apiKey=${ENV.newsApiKey}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (data?.status !== 'ok' || !data.articles) return [];

    return data.articles.map((a: any) => ({
      title: a.title || '',
      description: a.description || a.content || '',
      source: a.source?.name || 'NewsAPI',
      url: a.url || '',
      publishedAt: a.publishedAt || new Date().toISOString(),
      content: a.content || '',
    })).filter((a: NewsAPIArticle) => a.title);
  } catch (err) {
    console.warn('[NewsAPI] Headlines failed:', (err as Error).message);
    return [];
  }
}