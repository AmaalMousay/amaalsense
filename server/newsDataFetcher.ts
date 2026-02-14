import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  source: string;
  publishedAt: Date;
  url: string;
  country?: string;
}

export interface NewsQuery {
  query: string;
  country?: string;
  language?: string;
  limit?: number;
}

/**
 * Fetch real news articles from NewsAPI
 * Uses NEWS_API_KEY from environment
 */
export async function fetchNewsArticles(query: NewsQuery): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn('NEWS_API_KEY not configured, returning empty results');
      return [];
    }

    const searchQuery = buildSearchQuery(query);
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchQuery,
        language: query.language || 'ar',
        sortBy: 'publishedAt',
        pageSize: query.limit || 10,
        apiKey: apiKey,
      },
      timeout: 5000,
    });

    if (response.data.status !== 'ok') {
      console.error('NewsAPI error:', response.data.message);
      return [];
    }

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      url: article.url,
      country: query.country,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

/**
 * Build search query with regional context
 */
function buildSearchQuery(query: NewsQuery): string {
  let q = query.query;

  // Add regional context
  if (query.country) {
    const countryKeywords: Record<string, string> = {
      'LY': 'Libya ليبيا',
      'EG': 'Egypt مصر',
      'SA': 'Saudi Arabia السعودية',
      'AE': 'UAE الإمارات',
      'MA': 'Morocco المغرب',
      'TN': 'Tunisia تونس',
      'DZ': 'Algeria الجزائر',
    };
    const keywords = countryKeywords[query.country];
    if (keywords) {
      q = `${q} ${keywords}`;
    }
  }

  return q;
}

/**
 * Fetch trending topics by region
 */
export async function fetchTrendingTopics(country: string): Promise<string[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return [];

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: country.toLowerCase(),
        pageSize: 20,
        apiKey: apiKey,
      },
      timeout: 5000,
    });

    if (response.data.status !== 'ok') return [];

    // Extract unique topics from headlines
    const topics = new Set<string>();
    response.data.articles.forEach((article: any) => {
      const words = article.title.split(' ');
      words.slice(0, 5).forEach((word: string) => {
        if (word.length > 4) topics.add(word);
      });
    });

    return Array.from(topics).slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

/**
 * Cache for news articles (simple in-memory cache)
 */
const newsCache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

export async function getCachedNews(query: NewsQuery): Promise<NewsArticle[]> {
  const cacheKey = `${query.query}:${query.country}:${query.language}`;
  const cached = newsCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const articles = await fetchNewsArticles(query);
  newsCache.set(cacheKey, { data: articles, timestamp: Date.now() });

  return articles;
}

/**
 * Clear old cache entries
 */
export function clearOldCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  newsCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL * 2) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => newsCache.delete(key));
}
