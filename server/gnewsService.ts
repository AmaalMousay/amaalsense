/**
 * GNews API Service
 * Fetches news from GNews.io API
 * Free tier: 100 requests/day
 */

import axios from 'axios';
import { ENV } from './_core/env';

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

interface NewsItem {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  source: string;
  language: string;
}

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

/**
 * Fetch top headlines from GNews
 */
export async function fetchGNewsHeadlines(options: {
  country?: string;
  language?: string;
  category?: string;
  max?: number;
} = {}): Promise<NewsItem[]> {
  const apiKey = ENV.gnewsApiKey;
  
  if (!apiKey) {
    console.log('[GNews] No API key available');
    return [];
  }
  
  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      max: String(options.max || 10),
      lang: options.language || 'ar',
    });
    
    if (options.country) {
      params.append('country', options.country.toLowerCase());
    }
    
    if (options.category) {
      params.append('category', options.category);
    }
    
    const url = `${GNEWS_BASE_URL}/top-headlines?${params.toString()}`;
    console.log(`[GNews] Fetching headlines...`);
    
    const response = await axios.get<GNewsResponse>(url, { timeout: 10000 });
    
    if (response.data.articles && response.data.articles.length > 0) {
      console.log(`[GNews] Fetched ${response.data.articles.length} articles`);
      
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source?.name || 'GNews',
        language: options.language || 'ar'
      }));
    }
    
    return [];
  } catch (error: any) {
    console.error('[GNews] API error:', error.message);
    return [];
  }
}

/**
 * Search news by keyword from GNews
 */
export async function searchGNews(options: {
  query: string;
  language?: string;
  country?: string;
  max?: number;
  from?: string;
  to?: string;
}): Promise<NewsItem[]> {
  const apiKey = ENV.gnewsApiKey;
  
  if (!apiKey) {
    console.log('[GNews] No API key available');
    return [];
  }
  
  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      q: options.query,
      max: String(options.max || 10),
      lang: options.language || 'ar',
    });
    
    if (options.country) {
      params.append('country', options.country.toLowerCase());
    }
    
    if (options.from) {
      params.append('from', options.from);
    }
    
    if (options.to) {
      params.append('to', options.to);
    }
    
    const url = `${GNEWS_BASE_URL}/search?${params.toString()}`;
    console.log(`[GNews] Searching for: ${options.query}`);
    
    const response = await axios.get<GNewsResponse>(url, { timeout: 10000 });
    
    if (response.data.articles && response.data.articles.length > 0) {
      console.log(`[GNews] Found ${response.data.articles.length} articles for "${options.query}"`);
      
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source?.name || 'GNews',
        language: options.language || 'ar'
      }));
    }
    
    return [];
  } catch (error: any) {
    console.error('[GNews] Search error:', error.message);
    return [];
  }
}

/**
 * Fetch news in both Arabic and English
 */
export async function fetchGNewsMultilingual(options: {
  query?: string;
  country?: string;
  max?: number;
} = {}): Promise<NewsItem[]> {
  const maxPerLang = Math.ceil((options.max || 10) / 2);
  
  try {
    let arabicNews: NewsItem[] = [];
    let englishNews: NewsItem[] = [];
    
    if (options.query) {
      // Search mode
      [arabicNews, englishNews] = await Promise.all([
        searchGNews({ query: options.query, country: options.country, language: 'ar', max: maxPerLang }),
        searchGNews({ query: options.query, country: options.country, language: 'en', max: maxPerLang })
      ]);
    } else {
      // Headlines mode
      [arabicNews, englishNews] = await Promise.all([
        fetchGNewsHeadlines({ ...options, language: 'ar', max: maxPerLang }),
        fetchGNewsHeadlines({ ...options, language: 'en', max: maxPerLang })
      ]);
    }
    
    // Combine and sort by date
    const allNews = [...arabicNews, ...englishNews]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    console.log(`[GNews] Total: ${arabicNews.length} Arabic + ${englishNews.length} English = ${allNews.length} articles`);
    
    return allNews;
  } catch (error) {
    console.error('[GNews] Multilingual fetch error:', error);
    return [];
  }
}

/**
 * Convert GNews items to unified data format
 */
export function convertToUnifiedFormat(news: NewsItem[]): Array<{
  text: string;
  source: string;
  timestamp: Date;
  language: string;
  url?: string;
}> {
  return news.map(item => ({
    text: `${item.title}. ${item.description}`,
    source: `GNews (${item.source})`,
    timestamp: new Date(item.publishedAt),
    language: item.language,
    url: item.url
  }));
}

/**
 * Test GNews API connection
 */
export async function testGNewsConnection(): Promise<{ success: boolean; message: string }> {
  const apiKey = ENV.gnewsApiKey;
  
  if (!apiKey) {
    return { success: false, message: 'No GNews API key configured' };
  }
  
  try {
    const news = await fetchGNewsHeadlines({ max: 1 });
    
    if (news.length > 0) {
      return { success: true, message: `GNews API connected. Sample: "${news[0].title.substring(0, 50)}..."` };
    }
    
    return { success: false, message: 'GNews API returned no articles' };
  } catch (error: any) {
    return { success: false, message: `GNews API error: ${error.message}` };
  }
}

export default {
  fetchGNewsHeadlines,
  searchGNews,
  fetchGNewsMultilingual,
  convertToUnifiedFormat,
  testGNewsConnection
};
