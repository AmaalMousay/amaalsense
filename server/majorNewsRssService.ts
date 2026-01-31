/**
 * Major News RSS Service
 * Fetches news from BBC, Reuters, Al Jazeera, and CNN RSS feeds
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
  'media:description'?: string[];
  'content:encoded'?: string[];
}

interface AtomEntry {
  title?: string[];
  summary?: string[];
  link?: Array<{ $?: { href?: string } }>;
  updated?: string[];
  published?: string[];
}

interface RssChannel {
  item?: RssItem[];
}

interface RssResponse {
  rss?: {
    channel?: RssChannel[];
  };
  feed?: {
    entry?: AtomEntry[];
  };
}

// Major News RSS Feeds
const RSS_FEEDS = {
  // BBC Feeds
  bbc_world: {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    source: 'BBC World',
    language: 'en' as const
  },
  bbc_arabic: {
    url: 'https://feeds.bbci.co.uk/arabic/rss.xml',
    source: 'BBC Arabic',
    language: 'ar' as const
  },
  bbc_middle_east: {
    url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
    source: 'BBC Middle East',
    language: 'en' as const
  },
  
  // Reuters Feeds (using Google News RSS for Reuters content)
  reuters_world: {
    url: 'https://news.google.com/rss/search?q=site:reuters.com&hl=en',
    source: 'Reuters',
    language: 'en' as const
  },
  reuters_top: {
    url: 'https://news.google.com/rss/search?q=site:reuters.com+world&hl=en',
    source: 'Reuters World',
    language: 'en' as const
  },
  
  // Al Jazeera Feeds
  aljazeera_english: {
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    source: 'Al Jazeera English',
    language: 'en' as const
  },
  aljazeera_arabic: {
    url: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4571-a6a2-c651eb1a0a1c/73d0e1b4-532f-45ef-b135-bfdff8b8cab9',
    source: 'Al Jazeera Arabic',
    language: 'ar' as const
  },
  
  // CNN Feeds
  cnn_world: {
    url: 'http://rss.cnn.com/rss/edition_world.rss',
    source: 'CNN World',
    language: 'en' as const
  },
  cnn_middle_east: {
    url: 'http://rss.cnn.com/rss/edition_meast.rss',
    source: 'CNN Middle East',
    language: 'en' as const
  },
  cnn_top: {
    url: 'http://rss.cnn.com/rss/edition.rss',
    source: 'CNN Top Stories',
    language: 'en' as const
  }
};

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse RSS XML to news items
 */
async function parseRssFeed(xml: string, source: string, language: 'ar' | 'en'): Promise<NewsItem[]> {
  try {
    const result = await parseStringPromise(xml, { explicitArray: true }) as RssResponse;
    
    // Handle standard RSS format
    if (result?.rss?.channel?.[0]?.item) {
      const items = result.rss.channel[0].item;
      return items.map((item: RssItem) => {
        const description = item.description?.[0] || 
                           item['media:description']?.[0] || 
                           item['content:encoded']?.[0] || '';
        return {
          title: stripHtml(item.title?.[0] || ''),
          description: stripHtml(description),
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || new Date().toISOString(),
          source,
          language
        };
      }).filter((item: NewsItem) => item.title);
    }
    
    // Handle Atom format
    if (result?.feed?.entry) {
      const entries = result.feed.entry;
      return entries.map((entry: AtomEntry) => ({
        title: stripHtml(entry.title?.[0] || ''),
        description: stripHtml(entry.summary?.[0] || ''),
        link: entry.link?.[0]?.$?.href || '',
        pubDate: entry.updated?.[0] || entry.published?.[0] || new Date().toISOString(),
        source,
        language
      })).filter((item: NewsItem) => item.title);
    }
    
    return [];
  } catch (error) {
    console.error(`[MajorNewsRSS] Error parsing RSS feed from ${source}:`, error);
    return [];
  }
}

/**
 * Fetch news from a single RSS feed
 */
async function fetchRssFeed(feedConfig: { url: string; source: string; language: 'ar' | 'en' }): Promise<NewsItem[]> {
  try {
    const response = await axios.get(feedConfig.url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Amaalsense/1.0 (News Aggregator)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml'
      }
    });
    
    const items = await parseRssFeed(response.data, feedConfig.source, feedConfig.language);
    console.log(`[MajorNewsRSS] Fetched ${items.length} items from ${feedConfig.source}`);
    return items;
  } catch (error) {
    console.error(`[MajorNewsRSS] Error fetching ${feedConfig.source}:`, error);
    return [];
  }
}

/**
 * Fetch BBC News
 */
export async function fetchBBCNews(limit: number = 20): Promise<NewsItem[]> {
  console.log('[MajorNewsRSS] Fetching BBC News...');
  
  try {
    const [world, arabic, middleEast] = await Promise.all([
      fetchRssFeed(RSS_FEEDS.bbc_world),
      fetchRssFeed(RSS_FEEDS.bbc_arabic),
      fetchRssFeed(RSS_FEEDS.bbc_middle_east)
    ]);
    
    const allNews = [...world, ...arabic, ...middleEast]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[MajorNewsRSS] BBC Total: ${allNews.length} items`);
    return allNews;
  } catch (error) {
    console.error('[MajorNewsRSS] Error fetching BBC News:', error);
    return [];
  }
}

/**
 * Fetch Reuters News
 */
export async function fetchReutersNews(limit: number = 20): Promise<NewsItem[]> {
  console.log('[MajorNewsRSS] Fetching Reuters News...');
  
  try {
    const [world, top] = await Promise.all([
      fetchRssFeed(RSS_FEEDS.reuters_world),
      fetchRssFeed(RSS_FEEDS.reuters_top)
    ]);
    
    const allNews = [...world, ...top]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[MajorNewsRSS] Reuters Total: ${allNews.length} items`);
    return allNews;
  } catch (error) {
    console.error('[MajorNewsRSS] Error fetching Reuters News:', error);
    return [];
  }
}

/**
 * Fetch Al Jazeera News
 */
export async function fetchAlJazeeraNews(limit: number = 20): Promise<NewsItem[]> {
  console.log('[MajorNewsRSS] Fetching Al Jazeera News...');
  
  try {
    const [english, arabic] = await Promise.all([
      fetchRssFeed(RSS_FEEDS.aljazeera_english),
      fetchRssFeed(RSS_FEEDS.aljazeera_arabic)
    ]);
    
    const allNews = [...english, ...arabic]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[MajorNewsRSS] Al Jazeera Total: ${allNews.length} items`);
    return allNews;
  } catch (error) {
    console.error('[MajorNewsRSS] Error fetching Al Jazeera News:', error);
    return [];
  }
}

/**
 * Fetch CNN News
 */
export async function fetchCNNNews(limit: number = 20): Promise<NewsItem[]> {
  console.log('[MajorNewsRSS] Fetching CNN News...');
  
  try {
    const [world, middleEast, top] = await Promise.all([
      fetchRssFeed(RSS_FEEDS.cnn_world),
      fetchRssFeed(RSS_FEEDS.cnn_middle_east),
      fetchRssFeed(RSS_FEEDS.cnn_top)
    ]);
    
    const allNews = [...world, ...middleEast, ...top]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[MajorNewsRSS] CNN Total: ${allNews.length} items`);
    return allNews;
  } catch (error) {
    console.error('[MajorNewsRSS] Error fetching CNN News:', error);
    return [];
  }
}

/**
 * Fetch all major news sources
 */
export async function fetchAllMajorNews(limit: number = 50): Promise<NewsItem[]> {
  console.log('[MajorNewsRSS] Fetching from all major news sources...');
  
  try {
    const [bbc, reuters, aljazeera, cnn] = await Promise.all([
      fetchBBCNews(15),
      fetchReutersNews(10),
      fetchAlJazeeraNews(15),
      fetchCNNNews(10)
    ]);
    
    const allNews = [...bbc, ...reuters, ...aljazeera, ...cnn]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);
    
    console.log(`[MajorNewsRSS] All Sources Total: BBC(${bbc.length}) + Reuters(${reuters.length}) + AlJazeera(${aljazeera.length}) + CNN(${cnn.length}) = ${allNews.length} items`);
    
    return allNews;
  } catch (error) {
    console.error('[MajorNewsRSS] Error fetching all major news:', error);
    return [];
  }
}

/**
 * Convert to unified data format for DCFT analysis
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
    source: item.source,
    timestamp: new Date(item.pubDate),
    language: item.language,
    url: item.link
  }));
}

/**
 * Get statistics about fetched news
 */
export function getNewsStats(news: NewsItem[]): {
  total: number;
  bySource: Record<string, number>;
  byLanguage: Record<string, number>;
} {
  const bySource: Record<string, number> = {};
  const byLanguage: Record<string, number> = { ar: 0, en: 0 };
  
  news.forEach(item => {
    bySource[item.source] = (bySource[item.source] || 0) + 1;
    byLanguage[item.language]++;
  });
  
  return {
    total: news.length,
    bySource,
    byLanguage
  };
}

export default {
  fetchBBCNews,
  fetchReutersNews,
  fetchAlJazeeraNews,
  fetchCNNNews,
  fetchAllMajorNews,
  convertToUnifiedFormat,
  getNewsStats
};
