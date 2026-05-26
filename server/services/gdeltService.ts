/**
 * GDELT Project API Service
 *
 * GDELT (Global Database of Events, Language, and Tone) is the most
 * comprehensive free source of global news events. It monitors news
 * from nearly every country in over 100 languages.
 *
 * Two APIs used:
 *   1. GDELT 2.0 API → real-time article search (last 24-48 hours)
 *   2. GDELT GEO → geographic news by country
 *
 * Docs: https://blog.gdeltproject.org/gdelt-2-0-our-global-reach-in-real-time/
 */

export interface GDELTArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  tone: number;          // -100 (very negative) to +100 (very positive)
  score: number;         // relevance score
  countryCode?: string;
}

const GDELT_BASE = 'https://api.gdeltproject.org/api/v2';

/**
 * Search GDELT for articles matching a query
 */
export async function searchGDELT(
  query: string,
  maxItems = 25,
  language: string = 'en',
): Promise<GDELTArticle[]> {
  const url = `${GDELT_BASE}/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=${maxItems}&format=json&timespan=24h&sort=datedesc&trans=${language}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AmalSense/1.0 (Research Project)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.articles || !Array.isArray(data.articles)) return [];

    return data.articles.map((a: any) => ({
      title: a.title || '',
      description: a.seeding || a.summary || '',
      source: a.domain || a.sourcecountry || 'GDELT',
      url: a.url || '',
      publishedAt: a.date || new Date().toISOString(),
      tone: a.tone ? parseFloat(a.tone) : 0,
      score: a.score ? parseFloat(a.score) : 0.5,
      countryCode: a.sourcecountry || undefined,
    })).filter((a: GDELTArticle) => a.title);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      console.warn('[GDELT] Request timed out');
    } else {
      console.warn('[GDELT] Fetch failed:', (err as Error).message);
    }
    return [];
  }
}

/**
 * Get GDELT articles by country code
 */
export async function searchGDELTByCountry(
  countryCode: string,
  countryName: string,
  maxItems = 25,
): Promise<GDELTArticle[]> {
  // GDELT uses sourcecountry filter
  const url = `${GDELT_BASE}/doc/doc?query=sourcecountry:${countryCode}&mode=artlist&maxrecords=${maxItems}&format=json&timespan=48h&sort=datedesc`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AmalSense/1.0 (Research Project)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      // Fallback: search by country name
      return searchGDELT(countryName, maxItems);
    }

    const data = await res.json();
    if (!data?.articles || !Array.isArray(data.articles)) {
      return searchGDELT(countryName, maxItems);
    }

    return data.articles.map((a: any) => ({
      title: a.title || '',
      description: a.seeding || a.summary || '',
      source: a.domain || 'GDELT',
      url: a.url || '',
      publishedAt: a.date || new Date().toISOString(),
      tone: a.tone ? parseFloat(a.tone) : 0,
      score: a.score ? parseFloat(a.score) : 0.5,
      countryCode,
    })).filter((a: GDELTArticle) => a.title);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      console.warn('[GDELT] Timeout for', countryName, '- falling back to name search');
    }
    return searchGDELT(countryName, maxItems);
  }
}
