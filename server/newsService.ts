/**
 * News Service - Fetches real news from external APIs
 * Supports multiple news sources: NewsAPI, GNews, and RSS feeds
 */

import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: Date;
  country?: string;
  category?: string;
}

export interface NewsSearchParams {
  query?: string;
  country?: string;
  category?: string;
  language?: string;
  pageSize?: number;
}

// Country code to news search mapping
const COUNTRY_NEWS_QUERIES: Record<string, string[]> = {
  SA: ['Saudi Arabia', 'Riyadh', 'Saudi'],
  US: ['United States', 'USA', 'America'],
  GB: ['United Kingdom', 'UK', 'Britain', 'London'],
  AE: ['UAE', 'Dubai', 'Abu Dhabi', 'Emirates'],
  EG: ['Egypt', 'Cairo', 'Egyptian'],
  JP: ['Japan', 'Tokyo', 'Japanese'],
  DE: ['Germany', 'Berlin', 'German'],
  FR: ['France', 'Paris', 'French'],
  CN: ['China', 'Beijing', 'Chinese'],
  IN: ['India', 'Delhi', 'Indian'],
  BR: ['Brazil', 'Brasilia', 'Brazilian'],
  RU: ['Russia', 'Moscow', 'Russian'],
  AU: ['Australia', 'Sydney', 'Australian'],
  CA: ['Canada', 'Ottawa', 'Canadian'],
  IT: ['Italy', 'Rome', 'Italian'],
  ES: ['Spain', 'Madrid', 'Spanish'],
  MX: ['Mexico', 'Mexican'],
  KR: ['South Korea', 'Seoul', 'Korean'],
  TR: ['Turkey', 'Ankara', 'Turkish'],
  ZA: ['South Africa', 'Johannesburg'],
  NG: ['Nigeria', 'Lagos', 'Nigerian'],
  AR: ['Argentina', 'Buenos Aires'],
  PL: ['Poland', 'Warsaw', 'Polish'],
  NL: ['Netherlands', 'Amsterdam', 'Dutch'],
  SE: ['Sweden', 'Stockholm', 'Swedish'],
};

/**
 * Fetch news using GNews API (free tier available)
 */
export async function fetchGNews(params: NewsSearchParams): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  
  if (!apiKey) {
    console.warn('[NewsService] GNews API key not configured, using fallback');
    return [];
  }

  try {
    const query = params.query || 'world news';
    const lang = params.language || 'en';
    const max = params.pageSize || 10;

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: query,
        lang,
        max,
        apikey: apiKey,
      },
      timeout: 10000,
    });

    if (response.data?.articles) {
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description || '',
        source: article.source?.name || 'Unknown',
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        country: params.country,
      }));
    }

    return [];
  } catch (error) {
    console.error('[NewsService] GNews API error:', error);
    return [];
  }
}

/**
 * Fetch news using NewsAPI (requires API key)
 */
export async function fetchNewsAPI(params: NewsSearchParams): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    console.warn('[NewsService] NewsAPI key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: params.query || 'world',
        language: params.language || 'en',
        pageSize: params.pageSize || 10,
        sortBy: 'publishedAt',
      },
      headers: {
        'X-Api-Key': apiKey,
      },
      timeout: 10000,
    });

    if (response.data?.articles) {
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description || '',
        source: article.source?.name || 'Unknown',
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        country: params.country,
      }));
    }

    return [];
  } catch (error) {
    console.error('[NewsService] NewsAPI error:', error);
    return [];
  }
}

/**
 * Fetch news for a specific country
 */
export async function fetchCountryNews(countryCode: string, pageSize: number = 10): Promise<NewsArticle[]> {
  const queries = COUNTRY_NEWS_QUERIES[countryCode];
  
  if (!queries || queries.length === 0) {
    return [];
  }

  // Try primary query first
  const primaryQuery = queries[0];
  let articles = await fetchGNews({
    query: primaryQuery,
    country: countryCode,
    pageSize,
  });

  // If no results, try NewsAPI as fallback
  if (articles.length === 0) {
    articles = await fetchNewsAPI({
      query: primaryQuery,
      country: countryCode,
      pageSize,
    });
  }

  return articles;
}

/**
 * Fetch global trending news
 */
export async function fetchGlobalNews(pageSize: number = 20): Promise<NewsArticle[]> {
  const queries = ['world news', 'breaking news', 'international'];
  
  let allArticles: NewsArticle[] = [];
  
  for (const query of queries) {
    const articles = await fetchGNews({ query, pageSize: Math.ceil(pageSize / queries.length) });
    allArticles = [...allArticles, ...articles];
    
    if (allArticles.length >= pageSize) break;
  }

  return allArticles.slice(0, pageSize);
}

/**
 * Generate mock news for fallback (when APIs are unavailable)
 */
export function generateMockNews(countryCode: string, count: number = 5): NewsArticle[] {
  const countryQueries = COUNTRY_NEWS_QUERIES[countryCode] || ['World'];
  const countryName = countryQueries[0];
  
  const mockHeadlines = [
    `${countryName} announces new economic development plan`,
    `Technology sector grows in ${countryName}`,
    `${countryName} hosts international summit`,
    `New infrastructure projects launched in ${countryName}`,
    `${countryName} celebrates cultural heritage festival`,
    `Education reforms announced in ${countryName}`,
    `${countryName} strengthens international partnerships`,
    `Healthcare improvements in ${countryName}`,
    `${countryName} invests in renewable energy`,
    `Sports achievements celebrated in ${countryName}`,
  ];

  return mockHeadlines.slice(0, count).map((title, index) => ({
    title,
    description: `Latest news and updates from ${countryName}`,
    source: 'AmalSense News',
    url: '#',
    publishedAt: new Date(Date.now() - index * 3600000),
    country: countryCode,
  }));
}

/**
 * Get news with fallback to mock data
 */
export async function getNewsWithFallback(
  countryCode: string,
  pageSize: number = 10
): Promise<{ articles: NewsArticle[]; isReal: boolean }> {
  // Try to fetch real news
  const realArticles = await fetchCountryNews(countryCode, pageSize);
  
  if (realArticles.length > 0) {
    return { articles: realArticles, isReal: true };
  }
  
  // Fallback to mock news
  const mockArticles = generateMockNews(countryCode, pageSize);
  return { articles: mockArticles, isReal: false };
}
