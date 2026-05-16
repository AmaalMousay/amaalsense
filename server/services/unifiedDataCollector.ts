/**
 * UNIFIED DATA COLLECTOR - Accumulative Memory Edition (V4.5)
 * يجمع من المصادر، يحول البيانات لمتجهات فيزيائية، ويخزنها في الذاكرة التراكمية فوراً.
 */

import { fetchGoogleNewsByCountry, fetchGoogleNewsByTopic } from './googleRssService';
import { fetchCountryNews } from './newsService';
import { searchGNews } from './gnewsService';
import { fetchRedditPosts, fetchMastodonPosts, fetchBlueskyPosts } from './socialMediaService';
import { storeAnalysisRecord } from '../engines/learningStore';
import { createQuantumEvent } from '../utils/eventVectorModel';
import { WebScraperService } from './webScraperService';

// ============================================================
// TYPES & INTERFACES
// ============================================================

export type TopicType = "health" | "economy" | "politics" | "conflict" | "society" | "environment" | "technology" | "culture" | "other";

export interface RawDataItem {
  id: string;
  timestamp: number; 
  title: string;
  description: string;
  source: string;
  sourceType: 'news' | 'social' | 'analysis';
  platform: string;
  url: string;
  publishedAt: string;
  language: string;
  country?: string;
  region: "global" | "europe" | "asia" | "africa" | "americas" | "oceania"; 
  topic: TopicType;
  intensity: number; 
  trustScore: number;
}

export interface CollectedData {
  items: RawDataItem[];
  sources: string[];
  sourceCount: number;
  fetchedAt: number;
  query: string;
  queryType: 'country' | 'topic' | 'question';
  countryCode?: string;
}

// ============================================================
// SERVICES INITIALIZATION
// ============================================================
const scraper = new WebScraperService();

// ============================================================
// CACHE SYSTEM
// ============================================================
const dataCache = new Map<string, { data: CollectedData; expiresAt: number }>();
const CACHE_TTL = 15 * 60 * 1000;

// ============================================================
// HELPERS
// ============================================================

/**
 * Detect topic from text
 */
function detectTopic(text: string): TopicType {
  const lowerText = text.toLowerCase();
  if (/health|virus|doctor|medical|hospital|صحة|طبيب|فيروس/i.test(lowerText)) return "health";
  if (/economy|market|finance|trading|stock|اقتصاد|سوق|مالية|تداول/i.test(lowerText)) return "economy";
  if (/politics|election|government|parliament|سياسة|انتخابات|حكومة/i.test(lowerText)) return "politics";
  if (/conflict|war|army|attack|clash|صراع|حرب|جيش|هجوم/i.test(lowerText)) return "conflict";
  if (/environment|climate|green|nature|بيئة|مناخ|طبيعة/i.test(lowerText)) return "environment";
  if (/technology|software|ai|digital|تقنية|برمجيات|رقمي/i.test(lowerText)) return "technology";
  if (/culture|art|music|movie|heritage|ثقافة|فن|موسيقى|تراث/i.test(lowerText)) return "culture";
  if (/society|people|community|social|مجتمع|ناس|اجتماعي/i.test(lowerText)) return "society";
  return "other";
}

/**
 * Detect region from text or country code
 */
function detectRegion(countryCode?: string): RawDataItem['region'] {
  if (!countryCode) return "global";
  // Simple mapping for demo
  const regions: Record<string, RawDataItem['region']> = {
    'US': 'americas', 'CA': 'americas', 'BR': 'americas',
    'GB': 'europe', 'FR': 'europe', 'DE': 'europe',
    'EG': 'africa', 'ZA': 'africa', 'NG': 'africa',
    'CN': 'asia', 'JP': 'asia', 'IN': 'asia',
    'AU': 'oceania'
  };
  return regions[countryCode] || "global";
}

// ============================================================
// AUTONOMOUS LEARNING LOGIC
// ============================================================

function learnFromRawData(item: RawDataItem) {
  const intensity = item.trustScore / 100;
  const polarity = item.sourceType === 'news' ? 0.2 : -0.1;

  const quantumEvent = createQuantumEvent({
    topic: item.topic,
    region: item.country || 'global',
    intensity: intensity,
    polarity: polarity,
    summary: item.title,
    emotions: {
      curiosity: { amplitude: intensity, phase: Math.PI / 3, superposition: { stable: 0.5, volatile: 0.5 } }
    }
  });

  storeAnalysisRecord(
    {
      topic: quantumEvent.topic,
      countryCode: item.country || 'XX',
      countryName: item.country || 'Global',
      userType: 'autonomous_collector',
      language: item.language,
      originalQuery: item.title,
      newsText: item.description 
    },
    {
      domain: quantumEvent.topic,
      eventType: 'automated_ingestion',
      sensitivityLevel: 'normal',
      timeRange: 'realtime',
      sourcesUsed: [item.platform],
      sourceCount: 1,
      dataQuality: item.trustScore
    },
    {
      emotionalIntensity: (quantumEvent as any).intensity || 50,
      valence: (quantumEvent as any).polarity || 0,
      affectiveVector: { curiosity: intensity },
      confidence: intensity,
      insights: [item.description || item.title],
      drivers: [`Platform: ${item.platform}`]
    },
    { contextClassification: 1, emotionFusion: 1, emotionalDynamics: 1, driverDetection: 1, explainableInsight: 1 }
  );
}

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Set();
  return items.filter(item => {
    const key = (item.title + item.platform).toLowerCase();
    const duplicate = seen.has(key);
    seen.add(key);
    return !duplicate;
  });
}

// ============================================================
// MAIN COLLECTION FUNCTIONS
// ============================================================

export async function collectTopicData(topic: string, region: string = 'global'): Promise<CollectedData> {
  const allData = await collectAllSources(topic);
  
  // No longer filtering strictly by topic if it's dynamic
  const items = allData.filter(item =>
    (region === 'global' || item.region === region)
  );
  
  const sources = [...new Set(items.map(item => item.platform))];
  return {
    items,
    sources,
    sourceCount: sources.length,
    fetchedAt: Date.now(),
    query: topic,
    queryType: 'topic'
  };
}

async function collectAllSources(query: string, countryCode?: string): Promise<RawDataItem[]> {
  // Try to scrape real data first
  try {
    const scraped = await scraper.scrapeNews(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`);
    return scraped.map(item => {
      const topic = detectTopic(item.title + " " + item.content);
      return {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        title: item.title,
        description: item.content,
        source: item.source,
        sourceType: 'news',
        platform: 'WebScraper',
        url: item.url,
        publishedAt: item.timestamp,
        language: 'en',
        region: detectRegion(countryCode),
        topic: topic,
        intensity: 0.6,
        trustScore: 85
      };
    });
  } catch (error) {
    console.error('Scraping failed, falling back to empty sources:', error);
    return [];
  }
}

export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = `country:${countryCode}`;
  const cached = dataCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  // Combine RSS and Scraper
  const rssData = await fetchGoogleNewsByCountry(countryCode);
  const scrapedData = await collectAllSources(countryName, countryCode);

  const rssItems: RawDataItem[] = (rssData as any[] || []).map(item => {
    const topic = detectTopic(item.title + " " + (item.content || ""));
    return {
      id: Math.random().toString(36),
      timestamp: Date.now(),
      title: item.title,
      description: item.content || item.title,
      source: item.source || 'Google RSS',
      sourceType: 'news',
      platform: 'RSS',
      url: item.link,
      publishedAt: new Date().toISOString(),
      language: 'en',
      country: countryCode,
      region: detectRegion(countryCode),
      topic: topic,
      intensity: 0.5,
      trustScore: 80
    };
  });

  const allItems = [...rssItems, ...scrapedData];
  const deduped = deduplicateItems(allItems);
  deduped.forEach(item => learnFromRawData(item));

  const sources = [...new Set(deduped.map(item => item.platform))];
  const result: CollectedData = {
    items: deduped,
    sources,
    sourceCount: sources.length,
    fetchedAt: Date.now(),
    query: countryName,
    queryType: 'country',
    countryCode
  };

  dataCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL });
  return result;
}

export function getCacheStats() {
  const now = Date.now();
  let validItems = 0;
  dataCache.forEach(val => { if (val.expiresAt > now) validItems++; });
  return {
    totalItems: dataCache.size,
    validItems,
    expiredItems: dataCache.size - validItems,
    memoryUsage: dataCache.size * 1024 
  };
}

export function clearCache() {
  dataCache.clear();
  return { success: true, timestamp: Date.now() };
}
