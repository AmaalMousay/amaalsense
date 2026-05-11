/**
 * UNIFIED ANALYSIS ENGINE
 * 
 * The SINGLE entry point for ALL analysis in AmalSense.
 */

import { collectCountryData, collectTopicData, getCacheStats as getCacheStatsFromCollector, clearCache as clearCollectorCache, type CollectedData } from '../services/unifiedDataCollector';
import { createEventVector, eventVectorToPrompt, vectorToMapIndices, type EventVector } from './eventVectorEngine';
import { smartChat, smartJsonChat, type TaskType } from './smartLLM';
import { DCFTEngine } from './dcftEngine';

// ============================================================
// RESULT TYPES
// ============================================================

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
// ENGINES INITIALIZATION
// ============================================================
const dcft = new DCFTEngine();

// ============================================================
// ANALYSIS CACHE
// ============================================================

interface AnalysisCacheEntry {
  vector: EventVector;
  data: CollectedData;
  expiresAt: number;
}

const analysisCache = new Map<string, AnalysisCacheEntry>();
const ANALYSIS_CACHE_TTL = 10 * 60 * 1000;

function getAnalysisCacheKey(type: string, key: string): string {
  return `analysis:${type}:${key.toLowerCase().trim()}`;
}

// ============================================================
// CORE: Collect + Vectorize + DCFT Calculation
// ============================================================

async function collectAndVectorize(
  type: 'country' | 'topic',
  query: string,
  countryCode?: string
): Promise<{ data: CollectedData; vector: EventVector; metrics: any }> {
  const cacheKey = getAnalysisCacheKey(type, countryCode || query);
  const cached = analysisCache.get(cacheKey);
  
  if (cached && cached.expiresAt > Date.now()) {
    const metrics = dcft.calculateMetrics(cached.vector.polarity * 50 + 50, cached.vector.intensity * 100, 50);
    return { data: cached.data, vector: cached.vector, metrics };
  }
  
  let data: CollectedData;
  if (type === 'country' && countryCode) {
    data = await collectCountryData(countryCode, query);
  } else {
    data = await collectTopicData(query);
  }
  
  const vector = createEventVector(data);
  
  // Calculate dynamic metrics using upgraded DCFT Engine
  const metrics = dcft.calculateMetrics(
    vector.polarity * 50 + 50, // Normalize -1..1 to 0..100
    vector.intensity * 100,
    50 // Baseline historical context
  );
  
  analysisCache.set(cacheKey, {
    vector,
    data,
    expiresAt: Date.now() + ANALYSIS_CACHE_TTL,
  });
  
  return { data, vector, metrics };
}

// ============================================================
// VIEW FORMATTERS
// ============================================================

export async function analyzeForMap(countryCode: string, countryName: string): Promise<MapResult> {
  const { vector, metrics } = await collectAndVectorize('country', countryName, countryCode);
  
  return {
    countryCode,
    countryName,
    gmi: metrics.gmi,
    cfi: metrics.cfi,
    hri: metrics.hri,
    dominantEmotion: vector.dominantEmotion,
    isRealData: vector.totalItems > 0,
    confidence: vector.totalItems > 5 ? 85 : vector.totalItems > 0 ? 60 : 30,
  };
}

export async function analyzeForWeather(countryCode: string, countryName: string): Promise<WeatherResult> {
  const { vector, metrics } = await collectAndVectorize('country', countryName, countryCode);
  
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
    gmi: metrics.gmi,
    cfi: metrics.cfi,
    hri: metrics.hri,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    isRealData: vector.totalItems > 0,
  };
}

export async function analyzeForCountryDetail(
  countryCode: string,
  countryName: string,
  includeAISummary: boolean = false,
  language: string = 'ar'
): Promise<CountryDetailResult> {
  const { data, vector, metrics } = await collectAndVectorize('country', countryName, countryCode);
  
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
    gmi: metrics.gmi,
    cfi: metrics.cfi,
    hri: metrics.hri,
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

export async function analyzeForSmartAnalysis(
  query: string,
  language: string = 'ar'
): Promise<SmartAnalysisResult> {
  // Logic to determine if it's a country or topic...
  const result = await collectAndVectorize('topic', query);
  const { vector, metrics } = result;
  
  let response = '';
  try {
    const vectorPrompt = eventVectorToPrompt(vector, language);
    const systemPrompt = `You are "Amal" - an intelligent collective emotion analyzer. Answer the user's question based on the data: ${vectorPrompt}`;
    response = await smartChat(systemPrompt, query, 'smart_analysis');
  } catch (error) {
    response = "I'm sorry, I couldn't process that request right now.";
  }
  
  return {
    query,
    response,
    confidence: 85,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    gmi: metrics.gmi,
    cfi: metrics.cfi,
    hri: metrics.hri,
    categories: vector.categories,
    trendingKeywords: vector.trendingKeywords,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    topHeadlines: vector.topHeadlines,
    isRealData: vector.totalItems > 0,
  };
}

export function getCacheStats() {
  return {
    analysisCache: analysisCache.size,
    dataCache: getCacheStatsFromCollector()
  };
}

export function clearCache() {
  analysisCache.clear();
  clearCollectorCache();
  return { success: true };
}
