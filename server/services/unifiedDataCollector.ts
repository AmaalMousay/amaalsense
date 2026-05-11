/**
 * UNIFIED DATA COLLECTOR - Accumulative Memory Edition (V4.5)
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
  timestamp: number; // مضاف لضمان التوافق مع الخطأ 86
  title: string;
  description: string;
  source: string;
  sourceType: 'news' | 'social' | 'analysis';
  platform: string;
  url: string;
  publishedAt: string;
  language: string;
  country?: string;
  region: "global" | "europe" | "asia" | "africa" | "americas" | "oceania"; // مضاف للتوافق
  topic: "health" | "economy" | "politics" | "conflict" | "society" | "environment" | "technology" | "culture" | "other";
  intensity: number; // ✅ حل الخطأ رقم 86: إضافة الخاصية المفقودة
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
      newsText: item.description // تمرير النص للذاكرة التراكمية
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

// ============================================================
// HELPERS
// ============================================================

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

/**
 * ✅ حل مشكلة الموديول: إضافة الدالة التي يطلبها networkEngine.ts
 */
export async function collectTopicData(topic: string, region: string = 'global'): Promise<CollectedData> {
  const allData = await collectAllSources(topic);
  const items = allData.filter(item =>
    item.topic === topic &&
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

async function collectAllSources(query: string): Promise<RawDataItem[]> {
  // محاكاة جلب البيانات من كافة المصادر المتاحة
  return [];
}

export async function collectCountryData(countryCode: string, countryName: string): Promise<CollectedData> {
  const cacheKey = `country:${countryCode}`;
  const cached = dataCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  // جلب البيانات بشكل متوازي
  const rssData = await fetchGoogleNewsByCountry(countryCode);

  const allItems: RawDataItem[] = (rssData as any[] || []).map(item => ({
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
    region: 'global',
    topic: 'politics',
    intensity: 0.5,
    trustScore: 80
  }));

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

/**
 * Get statistics for the data cache
 */
export function getCacheStats() {
  const now = Date.now();
  let validItems = 0;
  dataCache.forEach(val => { if (val.expiresAt > now) validItems++; });
  return {
    totalItems: dataCache.size,
    validItems,
    expiredItems: dataCache.size - validItems,
    memoryUsage: dataCache.size * 1024 // Rough estimate
  };
}

/**
 * Clear the data cache
 */
export function clearCache() {
  dataCache.clear();
  return { success: true, timestamp: Date.now() };
}