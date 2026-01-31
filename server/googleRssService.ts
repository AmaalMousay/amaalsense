/**
 * Google RSS News Service
 * Fetches global news from Google News RSS feeds in Arabic and English
 */

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  language: 'ar' | 'en';
}

interface RssItem {
  title?: string[];
  description?: string[];
  link?: string[];
  pubDate?: string[];
  source?: Array<{ _: string }>;
}

interface RssChannel {
  item?: RssItem[];
}

interface RssResponse {
  rss?: {
    channel?: RssChannel[];
  };
}

// Google News RSS feeds
const GOOGLE_RSS_FEEDS = {
  news_ar: 'https://news.google.com/rss?hl=ar',
  news_en: 'https://news.google.com/rss?hl=en'
};

/**
 * Parse RSS XML to news items
 */
async function parseRssFeed(xml: string, language: 'ar' | 'en'): Promise<NewsItem[]> {
  try {
    const result = await parseStringPromise(xml) as RssResponse;
    const items = result?.rss?.channel?.[0]?.item || [];
    
    return items.map((item: RssItem) => ({
      title: item.title?.[0] || '',
      description: item.description?.[0] || '',
      link: item.link?.[0] || '',
      pubDate: item.pubDate?.[0] || new Date().toISOString(),
      source: item.source?.[0]?._ || 'Google News',
      language
    })).filter((item: NewsItem) => item.title);
  } catch (error) {
    console.error(`[GoogleRSS] Error parsing RSS feed:`, error);
    return [];
  }
}

/**
 * Fetch news from Google RSS feed
 */
async function fetchGoogleRss(feedUrl: string, language: 'ar' | 'en'): Promise<NewsItem[]> {
  try {
    const response = await axios.get(feedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Amaalsense/1.0 (News Aggregator)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });
    
    return await parseRssFeed(response.data, language);
  } catch (error) {
    console.error(`[GoogleRSS] Error fetching ${language} feed:`, error);
    return [];
  }
}

/**
 * Fetch all Google News (Arabic + English)
 */
export async function fetchGoogleNews(limit: number = 20): Promise<NewsItem[]> {
  console.log('[GoogleRSS] Fetching news from Google RSS feeds...');
  
  try {
    const [arabicNews, englishNews] = await Promise.all([
      fetchGoogleRss(GOOGLE_RSS_FEEDS.news_ar, 'ar'),
      fetchGoogleRss(GOOGLE_RSS_FEEDS.news_en, 'en')
    ]);
    
    // Combine and sort by date
    const allNews = [...arabicNews, ...englishNews]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[GoogleRSS] Fetched ${arabicNews.length} Arabic + ${englishNews.length} English = ${allNews.length} total news items`);
    
    return allNews;
  } catch (error) {
    console.error('[GoogleRSS] Error fetching Google News:', error);
    return [];
  }
}

/**
 * Fetch Google News by topic/keyword
 */
export async function fetchGoogleNewsByTopic(topic: string, limit: number = 20): Promise<NewsItem[]> {
  console.log(`[GoogleRSS] Fetching news for topic: ${topic}`);
  
  const encodedTopic = encodeURIComponent(topic);
  const topicFeeds = {
    ar: `https://news.google.com/rss/search?q=${encodedTopic}&hl=ar`,
    en: `https://news.google.com/rss/search?q=${encodedTopic}&hl=en`
  };
  
  try {
    const [arabicNews, englishNews] = await Promise.all([
      fetchGoogleRss(topicFeeds.ar, 'ar'),
      fetchGoogleRss(topicFeeds.en, 'en')
    ]);
    
    const allNews = [...arabicNews, ...englishNews]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[GoogleRSS] Fetched ${allNews.length} news items for topic: ${topic}`);
    
    return allNews;
  } catch (error) {
    console.error(`[GoogleRSS] Error fetching news for topic ${topic}:`, error);
    return [];
  }
}

/**
 * Fetch Google News by country
 */
export async function fetchGoogleNewsByCountry(countryCode: string, limit: number = 20): Promise<NewsItem[]> {
  console.log(`[GoogleRSS] Fetching news for country: ${countryCode}`);
  
  // Map country codes to Google News geo codes
  const countryGeoMap: Record<string, string> = {
    'LY': 'LY', // Libya
    'EG': 'EG', // Egypt
    'SA': 'SA', // Saudi Arabia
    'AE': 'AE', // UAE
    'US': 'US', // United States
    'GB': 'GB', // United Kingdom
    'FR': 'FR', // France
    'DE': 'DE', // Germany
    'TR': 'TR', // Turkey
    'MA': 'MA', // Morocco
    'TN': 'TN', // Tunisia
    'DZ': 'DZ', // Algeria
    'IQ': 'IQ', // Iraq
    'JO': 'JO', // Jordan
    'KW': 'KW', // Kuwait
    'QA': 'QA', // Qatar
    'BH': 'BH', // Bahrain
    'OM': 'OM', // Oman
    'LB': 'LB', // Lebanon
    'SY': 'SY', // Syria
    'PS': 'PS', // Palestine
    'YE': 'YE', // Yemen
    'SD': 'SD'  // Sudan
  };
  
  const geoCode = countryGeoMap[countryCode] || countryCode;
  
  const countryFeeds = {
    ar: `https://news.google.com/rss?hl=ar&gl=${geoCode}&ceid=${geoCode}:ar`,
    en: `https://news.google.com/rss?hl=en&gl=${geoCode}&ceid=${geoCode}:en`
  };
  
  try {
    const [arabicNews, englishNews] = await Promise.all([
      fetchGoogleRss(countryFeeds.ar, 'ar'),
      fetchGoogleRss(countryFeeds.en, 'en')
    ]);
    
    const allNews = [...arabicNews, ...englishNews]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[GoogleRSS] Fetched ${allNews.length} news items for country: ${countryCode}`);
    
    return allNews;
  } catch (error) {
    console.error(`[GoogleRSS] Error fetching news for country ${countryCode}:`, error);
    return [];
  }
}

/**
 * Convert Google RSS news to unified data format
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
    source: `Google News (${item.source})`,
    timestamp: new Date(item.pubDate),
    language: item.language,
    url: item.link
  }));
}

export default {
  fetchGoogleNews,
  fetchGoogleNewsByTopic,
  fetchGoogleNewsByCountry,
  convertToUnifiedFormat
};
