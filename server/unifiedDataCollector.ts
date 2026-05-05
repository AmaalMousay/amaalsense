/**
 * UNIFIED DATA COLLECTOR - Accumulative Memory Edition
 * يجمع من المصادر، يحول البيانات لمتجهات فيزيائية، ويخزنها في الذاكرة التراكمية فوراً.
 */

import { fetchGoogleNewsByCountry, fetchGoogleNewsByTopic } from './googleRssService';
import { fetchCountryNews } from './newsService';
import { searchGNews } from './gnewsService';
import { fetchRedditPosts, fetchMastodonPosts, fetchBlueskyPosts } from './socialMediaService';
import { storeAnalysisRecord } from './engines/learningStore';
import { createQuantumEvent } from './eventVectorModel';

// ============================================================
// TYPES & INTERFACES
// ============================================================

export interface RawDataItem {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceType: 'news' | 'social' | 'analysis';
  platform: string;
  url: string;
  publishedAt: string;
  language: string;
  country?: string;
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
// CACHE SYSTEM
// ============================================================

const dataCache = new Map<string, { data: CollectedData; expiresAt: number }>();
const CACHE_TTL = 15 * 60 * 1000;

// ============================================================
// AUTONOMOUS LEARNING LOGIC
// ============================================================

function learnFromRawData(item: RawDataItem) {
  const intensity = item.trustScore / 100;
  const polarity = item.sourceType === 'news' ? 0.2 : -0.1;

  const quantumEvent = createQuantumEvent({
    topic: item.sourceType === 'news' ? 'politics' : 'society',
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
      originalQuery: item.title
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
      emotionalIntensity: quantumEvent.intensity,
      valence: quantumEvent.polarity,
      affectiveVector: { curiosity: intensity },
      confidence: intensity,
      insights: [item.description || item.title],
      drivers: [`Platform: ${item.platform}`]
    },
    { contextClassification: 1, emotionFusion: 1, emotionalDynamics: 1, driverDetection: 1, explainableInsight: 1 }
  );
}

// ============================================================
// HELPERS
// ============================================================

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Set();
  return items.filter(item => {
    const duplicate = seen.has(item.title.toLowerCase());
    seen.add(item.title.toLowerCase());
    return !duplicate;
  });
}

// ============================================================
// MAIN COLLECTION FUNCTIONS
// ============================================================

export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = `country:${countryCode}`;
  const cached = dataCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  // Fetch from ALL sources in parallel
  const [rss, news, gnews, social] = await Promise.allSettled([
    fetchFromGoogleRSS(countryName, countryCode), // تأكدي أن هذه الدوال موجودة في الأسفل أو مستوردة
    fetchFromNewsAPI(countryName, countryCode),
    fetchFromGNews(countryName),
    fetchFromSocialMedia(countryName)
  ]);

  const allItems: RawDataItem[] = [];
  [rss, news, gnews, social].forEach(res => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) allItems.push(...res.value);
  });

  const deduped = deduplicateItems(allItems);

  // التغذية الراجعة للذاكرة التراكمية
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

// أضيفي دوال الـ Fetch المساعدة هنا إذا لم تكن مستوردة...
async function fetchFromGoogleRSS(q: string, c?: string) { return []; }
async function fetchFromNewsAPI(q: string, c?: string) { return []; }
async function fetchFromGNews(q: string) { return []; }
async function fetchFromSocialMedia(q: string) { return []; }