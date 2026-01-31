/**
 * Unified Data Service
 * 
 * This service aggregates data from all REAL sources (News, Social Media)
 * and feeds it through the Hybrid DCFT Engine for analysis.
 * 
 * Data Flow:
 * Real Sources (News API, Reddit, Bluesky, Mastodon, YouTube, Telegram) 
 *   → Unified Service → Hybrid Engine → Results
 */

import { analyzeHybrid } from './hybridAnalyzer';
import { fetchAllSocialMedia, fetchCountrySocialMedia, SocialPost, getAPIStatus } from './socialMediaService';
import { fetchGoogleNews, fetchGoogleNewsByTopic, fetchGoogleNewsByCountry, convertToUnifiedFormat } from './googleRssService';

// Types
export interface DataSource {
  type: 'news' | 'reddit' | 'mastodon' | 'bluesky' | 'youtube' | 'telegram' | 'google_rss';
  name: string;
  weight: number; // Influence weight for DCFT
  isReal: boolean;
}

export interface RawDataItem {
  id: string;
  text: string;
  source: DataSource;
  timestamp: Date;
  country?: string;
  topic?: string;
  engagement?: number;
  url?: string;
  isReal: boolean;
}

export interface UnifiedAnalysisRequest {
  scope: 'global' | 'country' | 'topic';
  country?: string;
  topic?: string;
  timeRange?: 'hour' | 'day' | 'week' | 'month';
  limit?: number;
}

export interface MoodResult {
  mood: string;
  moodAr: string;
  moodColor: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
  dataPoints: number;
  realDataPoints: number;
  lastUpdated: Date;
  sources: {
    news: { count: number; isReal: boolean };
    google_rss: { count: number; isReal: boolean };
    reddit: { count: number; isReal: boolean };
    mastodon: { count: number; isReal: boolean };
    bluesky: { count: number; isReal: boolean };
    youtube: { count: number; isReal: boolean };
    telegram: { count: number; isReal: boolean };
  };
  breakdown?: {
    bySource: Record<string, { count: number; sentiment: number }>;
    byRegion?: Record<string, { sentiment: number; support: number; opposition: number }>;
    byDemographic?: Record<string, { sentiment: number; support: number; opposition: number }>;
  };
}

// Mood labels based on indices
const MOOD_LABELS = {
  veryPositive: { en: 'Optimistic', ar: 'متفائل', color: '#2A9D8F' },
  positive: { en: 'Hopeful', ar: 'مفعم بالأمل', color: '#4CAF50' },
  neutral: { en: 'Balanced', ar: 'متوازن', color: '#6C757D' },
  concerned: { en: 'Concerned', ar: 'قلق', color: '#E9C46A' },
  anxious: { en: 'Anxious', ar: 'متوتر', color: '#F4A261' },
  fearful: { en: 'Fearful', ar: 'خائف', color: '#FF9800' },
  angry: { en: 'Angry', ar: 'غاضب', color: '#E63946' },
  sad: { en: 'Sad', ar: 'حزين', color: '#8D5CF6' },
  calm: { en: 'Calm', ar: 'هادئ', color: '#457B9D' },
};

// Determine mood from indices
function determineMood(gmi: number, cfi: number, hri: number): { mood: string; moodAr: string; moodColor: string } {
  const toResult = (label: { en: string; ar: string; color: string }) => ({
    mood: label.en,
    moodAr: label.ar,
    moodColor: label.color
  });
  
  if (cfi > 70) return toResult(MOOD_LABELS.fearful);
  if (gmi < -30 && cfi > 50) return toResult(MOOD_LABELS.angry);
  if (gmi > 50 && hri > 60) return toResult(MOOD_LABELS.veryPositive);
  if (gmi > 20 && hri > 40) return toResult(MOOD_LABELS.positive);
  if (cfi > 50 && gmi < 0) return toResult(MOOD_LABELS.anxious);
  if (cfi > 40 || gmi < -10) return toResult(MOOD_LABELS.concerned);
  if (hri < 30 && gmi < 0) return toResult(MOOD_LABELS.sad);
  if (cfi < 30 && Math.abs(gmi) < 20) return toResult(MOOD_LABELS.calm);
  return toResult(MOOD_LABELS.neutral);
}

// Source weights for DCFT calculation
const SOURCE_WEIGHTS: Record<string, number> = {
  news: 0.85,        // News has highest weight (most reliable)
  google_rss: 0.90,  // Google RSS aggregates top news sources
  reddit: 0.65,      // Reddit has good discussions
  bluesky: 0.60,     // Bluesky is growing
  mastodon: 0.55,    // Mastodon federated
  youtube: 0.50,     // YouTube comments can be noisy
  telegram: 0.60,    // Telegram news channels
};

// News API integration
async function fetchNewsData(country?: string, topic?: string, limit: number = 20): Promise<RawDataItem[]> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  
  if (!NEWS_API_KEY) {
    console.log('[UnifiedData] No NEWS_API_KEY available');
    return [];
  }

  try {
    let url: string;
    const params: string[] = [];
    
    // Use everything endpoint for topic search, headlines for country
    if (topic && !country) {
      url = 'https://newsapi.org/v2/everything?';
      params.push(`q=${encodeURIComponent(topic)}`);
      params.push('sortBy=publishedAt');
      params.push('language=en');
    } else {
      url = 'https://newsapi.org/v2/top-headlines?';
      
      if (country) {
        const countryMap: Record<string, string> = {
          'LY': 'ly', 'EG': 'eg', 'SA': 'sa', 'AE': 'ae', 'US': 'us',
          'GB': 'gb', 'FR': 'fr', 'DE': 'de', 'TR': 'tr', 'MA': 'ma',
          'AU': 'au', 'CA': 'ca', 'JP': 'jp', 'IN': 'in', 'BR': 'br',
          'RU': 'ru', 'CN': 'cn', 'IT': 'it', 'ES': 'es', 'MX': 'mx'
        };
        const newsCountry = countryMap[country] || country.toLowerCase();
        params.push(`country=${newsCountry}`);
      }
      
      if (topic) {
        params.push(`q=${encodeURIComponent(topic)}`);
      }
    }
    
    params.push(`pageSize=${limit}`);
    params.push(`apiKey=${NEWS_API_KEY}`);
    
    url += params.join('&');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ok' && data.articles && data.articles.length > 0) {
      console.log(`[News API] Fetched ${data.articles.length} real articles`);
      
      return data.articles.map((article: any, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        text: `${article.title || ''} ${article.description || ''}`.trim(),
        source: {
          type: 'news' as const,
          name: article.source?.name || 'News',
          weight: SOURCE_WEIGHTS.news,
          isReal: true
        },
        timestamp: new Date(article.publishedAt || Date.now()),
        country: country,
        topic: topic,
        url: article.url,
        isReal: true
      }));
    } else {
      console.warn('[News API] No articles returned:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('[UnifiedData] News API error:', error);
  }
  
  return [];
}

// Convert social posts to raw data items
function convertSocialPostsToRawData(posts: SocialPost[], country?: string, topic?: string): RawDataItem[] {
  return posts.map(post => ({
    id: post.id,
    text: post.text,
    source: {
      type: post.platform as any,
      name: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
      weight: SOURCE_WEIGHTS[post.platform] || 0.5,
      isReal: post.isReal
    },
    timestamp: post.publishedAt,
    country: country,
    topic: topic,
    engagement: post.engagement.likes + post.engagement.comments + post.engagement.shares,
    url: post.url,
    isReal: post.isReal
  }));
}

// Main unified analysis function
export async function analyzeUnified(request: UnifiedAnalysisRequest): Promise<MoodResult> {
  const { scope, country, topic, limit = 50 } = request;
  
  console.log(`[UnifiedData] Analyzing: scope=${scope}, country=${country}, topic=${topic}`);
  
  const allData: RawDataItem[] = [];
  const sourceCounts = {
    news: { count: 0, isReal: false },
    google_rss: { count: 0, isReal: false },
    reddit: { count: 0, isReal: false },
    mastodon: { count: 0, isReal: false },
    bluesky: { count: 0, isReal: false },
    youtube: { count: 0, isReal: false },
    telegram: { count: 0, isReal: false },
  };
  
  // Fetch news data from News API
  const newsLimit = Math.ceil(limit * 0.3); // 30% from News API
  const newsData = await fetchNewsData(country, topic, newsLimit);
  allData.push(...newsData);
  sourceCounts.news = { count: newsData.length, isReal: newsData.length > 0 };
  
  // Fetch news from Google RSS (Arabic + English)
  const googleRssLimit = Math.ceil(limit * 0.2); // 20% from Google RSS
  try {
    let googleNews;
    if (topic) {
      googleNews = await fetchGoogleNewsByTopic(topic, googleRssLimit);
    } else if (country) {
      googleNews = await fetchGoogleNewsByCountry(country, googleRssLimit);
    } else {
      googleNews = await fetchGoogleNews(googleRssLimit);
    }
    
    const googleRssData = convertToUnifiedFormat(googleNews).map((item, index) => ({
      id: `google-rss-${Date.now()}-${index}`,
      text: item.text,
      source: {
        type: 'google_rss' as const,
        name: `Google News (${item.language === 'ar' ? 'Arabic' : 'English'})`,
        weight: SOURCE_WEIGHTS.google_rss,
        isReal: true
      },
      timestamp: item.timestamp,
      country: country,
      topic: topic,
      url: item.url,
      isReal: true
    }));
    
    allData.push(...googleRssData);
    sourceCounts.google_rss = { count: googleRssData.length, isReal: googleRssData.length > 0 };
    console.log(`[UnifiedData] Google RSS: ${googleRssData.length} items`);
  } catch (error) {
    console.error('[UnifiedData] Google RSS error:', error);
  }
  
  // Fetch social media data
  const socialLimit = Math.ceil(limit * 0.6); // 60% from social media
  const query = topic || (country ? `${country} news` : 'world news');
  
  let socialResult;
  if (country) {
    socialResult = await fetchCountrySocialMedia(country, socialLimit);
  } else {
    socialResult = await fetchAllSocialMedia({ query, limit: socialLimit, country });
  }
  
  // Convert and add social posts
  const socialData = convertSocialPostsToRawData(socialResult.posts, country, topic);
  allData.push(...socialData);
  
  // Update source counts
  sourceCounts.reddit = { count: socialResult.sources.reddit.count, isReal: socialResult.sources.reddit.isReal };
  sourceCounts.mastodon = { count: socialResult.sources.mastodon.count, isReal: socialResult.sources.mastodon.isReal };
  sourceCounts.bluesky = { count: socialResult.sources.bluesky.count, isReal: socialResult.sources.bluesky.isReal };
  sourceCounts.youtube = { count: socialResult.sources.youtube.count, isReal: socialResult.sources.youtube.isReal };
  sourceCounts.telegram = { count: socialResult.sources.telegram.count, isReal: socialResult.sources.telegram.isReal };
  
  const realDataCount = allData.filter(d => d.isReal).length;
  
  console.log(`[UnifiedData] Total: ${allData.length} items (${realDataCount} real)`);
  
  if (allData.length === 0) {
    return {
      mood: 'Neutral',
      moodAr: 'محايد',
      moodColor: '#6C757D',
      gmi: 0,
      cfi: 50,
      hri: 50,
      dominantEmotion: 'calm',
      confidence: 0,
      dataPoints: 0,
      realDataPoints: 0,
      lastUpdated: new Date(),
      sources: sourceCounts
    };
  }
  
  // Combine all texts for analysis (weighted by source)
  const weightedTexts = allData.map(d => {
    const weight = d.source.weight;
    // Repeat text based on weight for weighted analysis
    const repeatCount = Math.max(1, Math.round(weight * 2));
    return Array(repeatCount).fill(d.text).join(' ');
  });
  
  const combinedText = weightedTexts.join('\n');
  
  // Analyze through Hybrid Engine
  const sourceType = scope === 'global' ? 'news' : 'social';
  const hybridResult = await analyzeHybrid(combinedText, sourceType as 'news' | 'social');
  
  // Calculate source breakdown
  const bySource: Record<string, { count: number; sentiment: number }> = {};
  allData.forEach(item => {
    const sourceName = item.source.name;
    if (!bySource[sourceName]) {
      bySource[sourceName] = { count: 0, sentiment: 0 };
    }
    bySource[sourceName].count++;
  });
  
  // Determine mood from indices
  const { mood, moodAr, moodColor } = determineMood(
    hybridResult.indices.gmi,
    hybridResult.indices.cfi,
    hybridResult.indices.hri
  );
  
  return {
    mood,
    moodAr,
    moodColor,
    gmi: hybridResult.indices.gmi,
    cfi: hybridResult.indices.cfi,
    hri: hybridResult.indices.hri,
    dominantEmotion: hybridResult.dcft.emotionalPhase,
    confidence: hybridResult.fusion.confidence,
    dataPoints: allData.length,
    realDataPoints: realDataCount,
    lastUpdated: new Date(),
    sources: sourceCounts,
    breakdown: {
      bySource
    }
  };
}

// Get global mood
export async function getGlobalMood(): Promise<MoodResult> {
  return analyzeUnified({ scope: 'global', limit: 100 });
}

// Get country mood
export async function getCountryMood(countryCode: string): Promise<MoodResult> {
  return analyzeUnified({ scope: 'country', country: countryCode, limit: 50 });
}

// Get topic mood in country
export async function getTopicMood(topic: string, countryCode?: string): Promise<MoodResult> {
  return analyzeUnified({ 
    scope: 'topic', 
    country: countryCode, 
    topic: topic, 
    limit: 50 
  });
}

// Get all countries mood (for map)
export async function getAllCountriesMood(): Promise<Record<string, MoodResult>> {
  const countries = ['LY', 'EG', 'SA', 'AE', 'US', 'GB', 'FR', 'DE', 'TR', 'MA', 'TN', 'DZ', 'IQ', 'JO'];
  const results: Record<string, MoodResult> = {};
  
  // Process in parallel for speed (but limit concurrency)
  const batchSize = 5;
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (code) => {
        results[code] = await getCountryMood(code);
      })
    );
  }
  
  return results;
}

// Get API status for all data sources
export async function getDataSourcesStatus(): Promise<Record<string, { available: boolean; message: string }>> {
  const socialStatus = await getAPIStatus();
  
  return {
    newsApi: { 
      available: !!process.env.NEWS_API_KEY, 
      message: process.env.NEWS_API_KEY ? 'API key configured' : 'No API key' 
    },
    ...socialStatus
  };
}

// Export for testing
export { fetchNewsData, convertSocialPostsToRawData };
