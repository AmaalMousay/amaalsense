/**
 * UNIFIED ANALYSIS ENGINE
 * 
 * The SINGLE entry point for ALL analysis in AmalSense.
 * 
 * Architecture:
 *   User Request → Unified Engine → Data Collector → Event Vector → LLM → Formatted Result
 * 
 * All pages (Map, EmotionalWeather, SmartAnalysis, CountryResults) 
 * call THIS engine, which returns results formatted for each view.
 */

import { collectCountryData, collectTopicData, getCacheStats as getCacheStatsFromCollector, clearCache as clearCollectorCache, type CollectedData } from './unifiedDataCollector';
import { createEventVector, eventVectorToPrompt, vectorToMapIndices, type EventVector } from './eventVectorEngine';
import { smartChat, smartJsonChat, type TaskType } from './smartLLM';

// ============================================================
// RESULT TYPES
// ============================================================

/** Map view result - colors and indices for each country */
export interface MapResult {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  isRealData: boolean;
  confidence: number;
}

/** Emotional Weather result - detailed emotion breakdown */
export interface WeatherResult {
  countryCode: string;
  countryName: string;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  polarity: number;
  intensity: number;
  categories: EventVector['categories'];
  dominantCategory: string;
  trendingKeywords: string[];
  topHeadlines: EventVector['topHeadlines'];
  gmi: number;
  cfi: number;
  hri: number;
  sourceCount: number;
  totalItems: number;
  isRealData: boolean;
}

/** Country detail result - full analysis with news */
export interface CountryDetailResult {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  categories: EventVector['categories'];
  dominantCategory: string;
  polarity: number;
  intensity: number;
  news: {
    political: Array<{ title: string; source: string; sentiment: string }>;
    economic: Array<{ title: string; source: string; sentiment: string }>;
    social: Array<{ title: string; source: string; sentiment: string }>;
    conflict: Array<{ title: string; source: string; sentiment: string }>;
  };
  trendingKeywords: string[];
  sourceCount: number;
  totalItems: number;
  isRealData: boolean;
  aiSummary?: string;
}

/** Smart Analysis result - AI-powered Q&A */
export interface SmartAnalysisResult {
  query: string;
  response: string;
  confidence: number;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  gmi: number;
  cfi: number;
  hri: number;
  categories: EventVector['categories'];
  trendingKeywords: string[];
  sourceCount: number;
  totalItems: number;
  topHeadlines: EventVector['topHeadlines'];
  isRealData: boolean;
}

// ============================================================
// ANALYSIS CACHE (results cache, separate from data cache)
// ============================================================

interface AnalysisCacheEntry {
  vector: EventVector;
  data: CollectedData;
  expiresAt: number;
}

const analysisCache = new Map<string, AnalysisCacheEntry>();
const ANALYSIS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getAnalysisCacheKey(type: string, key: string): string {
  return `analysis:${type}:${key.toLowerCase().trim()}`;
}

// ============================================================
// CORE: Collect + Vectorize (shared step for all views)
// ============================================================

async function collectAndVectorize(
  type: 'country' | 'topic',
  query: string,
  countryCode?: string
): Promise<{ data: CollectedData; vector: EventVector }> {
  const cacheKey = getAnalysisCacheKey(type, countryCode || query);
  const cached = analysisCache.get(cacheKey);
  
  if (cached && cached.expiresAt > Date.now()) {
    return { data: cached.data, vector: cached.vector };
  }
  
  // Step 1: Collect raw data from ALL sources
  let data: CollectedData;
  if (type === 'country' && countryCode) {
    data = await collectCountryData(countryCode, query);
  } else {
    data = await collectTopicData(query);
  }
  
  // Step 2: Compress into EventVector
  const vector = createEventVector(data);
  
  // Cache the result
  analysisCache.set(cacheKey, {
    vector,
    data,
    expiresAt: Date.now() + ANALYSIS_CACHE_TTL,
  });
  
  return { data, vector };
}

// ============================================================
// VIEW FORMATTERS
// ============================================================

/**
 * FORMAT FOR MAP: Returns indices and dominant emotion for map coloring
 */
export async function analyzeForMap(countryCode: string, countryName: string): Promise<MapResult> {
  const { vector } = await collectAndVectorize('country', countryName, countryCode);
  const indices = vectorToMapIndices(vector);
  
  return {
    countryCode,
    countryName,
    gmi: indices.gmi,
    cfi: indices.cfi,
    hri: indices.hri,
    dominantEmotion: indices.dominantEmotion,
    isRealData: indices.isRealData,
    confidence: vector.totalItems > 5 ? 85 : vector.totalItems > 0 ? 60 : 30,
  };
}

/**
 * FORMAT FOR EMOTIONAL WEATHER: Returns detailed emotion breakdown
 */
export async function analyzeForWeather(countryCode: string, countryName: string): Promise<WeatherResult> {
  const { vector } = await collectAndVectorize('country', countryName, countryCode);
  const indices = vectorToMapIndices(vector);
  
  return {
    countryCode,
    countryName,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    polarity: vector.polarity,
    intensity: vector.intensity,
    categories: vector.categories,
    dominantCategory: vector.dominantCategory,
    trendingKeywords: vector.trendingKeywords,
    topHeadlines: vector.topHeadlines,
    gmi: indices.gmi,
    cfi: indices.cfi,
    hri: indices.hri,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    isRealData: vector.totalItems > 0,
  };
}

/**
 * FORMAT FOR COUNTRY DETAIL: Full analysis with categorized news
 */
export async function analyzeForCountryDetail(
  countryCode: string,
  countryName: string,
  includeAISummary: boolean = false,
  language: string = 'ar'
): Promise<CountryDetailResult> {
  const { data, vector } = await collectAndVectorize('country', countryName, countryCode);
  const indices = vectorToMapIndices(vector);
  
  // Categorize news items
  const news: CountryDetailResult['news'] = {
    political: [],
    economic: [],
    social: [],
    conflict: [],
  };
  
  for (const headline of vector.topHeadlines) {
    const category = headline.category as keyof typeof news;
    if (category in news) {
      news[category].push({
        title: headline.title,
        source: headline.source,
        sentiment: headline.sentiment,
      });
    } else {
      news.social.push({
        title: headline.title,
        source: headline.source,
        sentiment: headline.sentiment,
      });
    }
  }
  
  // Optional AI summary
  let aiSummary: string | undefined;
  if (includeAISummary && vector.totalItems > 0) {
    try {
      const vectorPrompt = eventVectorToPrompt(vector, language);
      const systemPrompt = language === 'ar'
        ? `أنت محلل مشاعر جماعية. قدم ملخصاً موجزاً (3-4 جمل) عن الحالة العاطفية في ${countryName} بناءً على البيانات التالية. كن محدداً واذكر أسباب حقيقية من العناوين.`
        : `You are a collective emotion analyst. Provide a brief summary (3-4 sentences) about the emotional state in ${countryName} based on the following data. Be specific and cite real reasons from the headlines.`;
      
      aiSummary = await smartChat(systemPrompt, vectorPrompt, 'emotion_analysis');
    } catch (error) {
      console.warn('[UnifiedEngine] AI summary failed:', (error as Error).message);
    }
  }
  
  return {
    countryCode,
    countryName,
    gmi: indices.gmi,
    cfi: indices.cfi,
    hri: indices.hri,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    categories: vector.categories,
    dominantCategory: vector.dominantCategory,
    polarity: vector.polarity,
    intensity: vector.intensity,
    news,
    trendingKeywords: vector.trendingKeywords,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    isRealData: vector.totalItems > 0,
    aiSummary,
  };
}

/**
 * FORMAT FOR SMART ANALYSIS: AI-powered Q&A with emotion context
 */
export async function analyzeForSmartAnalysis(
  query: string,
  language: string = 'ar'
): Promise<SmartAnalysisResult> {
  // Detect if query is about a specific country
  const countryMatch = detectCountryInQuery(query);
  
  let data: CollectedData;
  let vector: EventVector;
  
  if (countryMatch) {
    const result = await collectAndVectorize('country', countryMatch.name, countryMatch.code);
    data = result.data;
    vector = result.vector;
  } else {
    const result = await collectAndVectorize('topic', query);
    data = result.data;
    vector = result.vector;
  }
  
  const indices = vectorToMapIndices(vector);
  
  // Generate AI response using compressed EventVector (NOT raw data)
  let response = '';
  try {
    const vectorPrompt = eventVectorToPrompt(vector, language);
    
    const systemPrompt = language === 'ar'
      ? `أنت "أمل" - محلل مشاعر جماعية ذكي. أجب عن سؤال المستخدم بناءً على البيانات المضغوطة التالية.

قواعد الإجابة:
1. أجب باللغة العربية
2. كن محدداً واذكر أسباب من العناوين الحقيقية
3. اذكر المؤشرات (GMI/CFI/HRI) عند الحاجة
4. قدم تحليلاً عميقاً وليس سطحياً
5. اذكر المصادر المتاحة
6. لا تكرر نفس الجمل

البيانات المضغوطة:
${vectorPrompt}`
      : `You are "Amal" - an intelligent collective emotion analyzer. Answer the user's question based on the following compressed data.

Rules:
1. Answer in English
2. Be specific and cite real reasons from headlines
3. Mention indices (GMI/CFI/HRI) when relevant
4. Provide deep analysis, not surface-level
5. Mention available sources
6. Don't repeat the same phrases

Compressed Data:
${vectorPrompt}`;
    
    response = await smartChat(systemPrompt, query, 'response_generation');
  } catch (error) {
    console.warn('[UnifiedEngine] Smart analysis LLM failed:', (error as Error).message);
    response = language === 'ar'
      ? `تم تحليل ${vector.totalItems} عنصر من ${Object.keys(vector.sourceBreakdown).length} مصدر. العاطفة السائدة: ${vector.dominantEmotion}. القطبية: ${vector.polarity > 0 ? 'إيجابية' : 'سلبية'} (${(Math.abs(vector.polarity) * 100).toFixed(0)}%). الكلمات الرائجة: ${vector.trendingKeywords.join('، ')}.`
      : `Analyzed ${vector.totalItems} items from ${Object.keys(vector.sourceBreakdown).length} sources. Dominant emotion: ${vector.dominantEmotion}. Polarity: ${vector.polarity > 0 ? 'positive' : 'negative'} (${(Math.abs(vector.polarity) * 100).toFixed(0)}%). Trending: ${vector.trendingKeywords.join(', ')}.`;
  }
  
  return {
    query,
    response,
    confidence: vector.totalItems > 5 ? 89 : vector.totalItems > 0 ? 65 : 30,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    gmi: indices.gmi,
    cfi: indices.cfi,
    hri: indices.hri,
    categories: vector.categories,
    trendingKeywords: vector.trendingKeywords,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    topHeadlines: vector.topHeadlines,
    isRealData: vector.totalItems > 0,
  };
}

// ============================================================
// BATCH: Analyze multiple countries (for map initial load)
// ============================================================

/**
 * Analyze multiple countries in parallel batches
 * Used for initial map rendering
 */
export async function analyzeCountriesBatch(
  countries: Array<{ code: string; name: string }>,
  batchSize: number = 4
): Promise<MapResult[]> {
  const results: MapResult[] = [];
  
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(c => analyzeForMap(c.code, c.name))
    );
    
    for (let j = 0; j < batch.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // Return default for failed countries
        results.push({
          countryCode: batch[j].code,
          countryName: batch[j].name,
          gmi: 0,
          cfi: 50,
          hri: 50,
          dominantEmotion: 'neutral',
          isRealData: false,
          confidence: 0,
        });
      }
    }
  }
  
  return results;
}

// ============================================================
// GLOBAL MOOD (for dashboard indices)
// ============================================================

/**
 * Calculate global mood from top news sources
 */
export async function getGlobalMood(): Promise<{
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
  sourceCount: number;
}> {
  const { vector } = await collectAndVectorize('topic', 'world news today');
  const indices = vectorToMapIndices(vector);
  
  return {
    gmi: indices.gmi,
    cfi: indices.cfi,
    hri: indices.hri,
    dominantEmotion: vector.dominantEmotion,
    confidence: vector.totalItems > 5 ? 85 : vector.totalItems > 0 ? 60 : 30,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
  };
}

// ============================================================
// COUNTRY DETECTION IN QUERIES
// ============================================================

const COUNTRY_PATTERNS: Array<{ pattern: RegExp; code: string; name: string }> = [
  { pattern: /\b(libya|ليبيا)\b/i, code: 'LY', name: 'Libya' },
  { pattern: /\b(egypt|مصر)\b/i, code: 'EG', name: 'Egypt' },
  { pattern: /\b(saudi|السعودية)\b/i, code: 'SA', name: 'Saudi Arabia' },
  { pattern: /\b(uae|الإمارات)\b/i, code: 'AE', name: 'UAE' },
  { pattern: /\b(usa|america|أمريكا|الولايات المتحدة)\b/i, code: 'US', name: 'United States' },
  { pattern: /\b(uk|britain|بريطانيا)\b/i, code: 'GB', name: 'United Kingdom' },
  { pattern: /\b(palestine|فلسطين)\b/i, code: 'PS', name: 'Palestine' },
  { pattern: /\b(syria|سوريا)\b/i, code: 'SY', name: 'Syria' },
  { pattern: /\b(iraq|العراق)\b/i, code: 'IQ', name: 'Iraq' },
  { pattern: /\b(sudan|السودان)\b/i, code: 'SD', name: 'Sudan' },
  { pattern: /\b(yemen|اليمن)\b/i, code: 'YE', name: 'Yemen' },
  { pattern: /\b(lebanon|لبنان)\b/i, code: 'LB', name: 'Lebanon' },
  { pattern: /\b(turkey|تركيا)\b/i, code: 'TR', name: 'Turkey' },
  { pattern: /\b(russia|روسيا)\b/i, code: 'RU', name: 'Russia' },
  { pattern: /\b(china|الصين)\b/i, code: 'CN', name: 'China' },
  { pattern: /\b(japan|اليابان)\b/i, code: 'JP', name: 'Japan' },
  { pattern: /\b(france|فرنسا)\b/i, code: 'FR', name: 'France' },
  { pattern: /\b(germany|ألمانيا)\b/i, code: 'DE', name: 'Germany' },
  { pattern: /\b(india|الهند)\b/i, code: 'IN', name: 'India' },
  { pattern: /\b(brazil|البرازيل)\b/i, code: 'BR', name: 'Brazil' },
  { pattern: /\b(morocco|المغرب)\b/i, code: 'MA', name: 'Morocco' },
  { pattern: /\b(tunisia|تونس)\b/i, code: 'TN', name: 'Tunisia' },
  { pattern: /\b(algeria|الجزائر)\b/i, code: 'DZ', name: 'Algeria' },
  { pattern: /\b(jordan|الأردن)\b/i, code: 'JO', name: 'Jordan' },
  { pattern: /\b(kuwait|الكويت)\b/i, code: 'KW', name: 'Kuwait' },
  { pattern: /\b(qatar|قطر)\b/i, code: 'QA', name: 'Qatar' },
  { pattern: /\b(bahrain|البحرين)\b/i, code: 'BH', name: 'Bahrain' },
  { pattern: /\b(oman|عمان)\b/i, code: 'OM', name: 'Oman' },
];

function detectCountryInQuery(query: string): { code: string; name: string } | null {
  for (const { pattern, code, name } of COUNTRY_PATTERNS) {
    if (pattern.test(query)) {
      return { code, name };
    }
  }
  return null;
}

// ============================================================
// ENGINE STATS
// ============================================================

export function getEngineStats(): {
  analysisCacheSize: number;
  dataCacheStats: { entries: number; oldestAge: number };
} {
  return {
    analysisCacheSize: analysisCache.size,
    dataCacheStats: getCacheStatsFromCollector(),
  };
}

export function clearAllCaches(): void {
  analysisCache.clear();
  clearCollectorCache();
}
