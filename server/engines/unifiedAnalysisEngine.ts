/**
 * Unified Analysis Engine
 *
 * Thin view-layer wrappers on top of the central Network Engine.
 * Each function delegates to executeNetworkEngine() and formats the
 * result for a specific UI view (Map, Weather, CountryDetail, SmartAnalysis).
 *
 * This file no longer duplicates collection, vectorization, or DCFT logic.
 */

import { executeNetworkEngine } from './networkEngine';

// ============================================================
// RE-EXPORTED RESULT TYPES
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
  emotions: Record<string, number>;
  dominantEmotion: string;
  polarity: number;
  intensity: number;
  categories: Record<string, number>;
  dominantCategory: string;
  trendingKeywords: string[];
  topHeadlines: Array<{ title: string; source: string; category: string; sentiment: string }>;
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
  emotions: Record<string, number>;
  dominantEmotion: string;
  categories: Record<string, number>;
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
  emotions: Record<string, number>;
  dominantEmotion: string;
  gmi: number;
  cfi: number;
  hri: number;
  categories: Record<string, number>;
  trendingKeywords: string[];
  sourceCount: number;
  totalItems: number;
  topHeadlines: Array<{ title: string; source: string; category: string; sentiment: string }>;
  isRealData: boolean;
}

const NO_ITEMS: { title: string; source: string; category: string; sentiment: string }[] = [];

// ============================================================
// VIEW FORMATTERS (delegate to executeNetworkEngine)
// ============================================================

export async function analyzeForMap(countryCode: string, countryName: string): Promise<MapResult> {
  const ctx = await executeNetworkEngine('system', `Map analysis of ${countryName}`);
  const ev = ctx.collection.eventVector;
  return {
    countryCode,
    countryName,
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    dominantEmotion: ctx.analysis.dominantEmotion,
    isRealData: ev.totalItems > 0,
    confidence: ev.totalItems > 5 ? 85 : ev.totalItems > 0 ? 60 : 30,
  };
}

export async function analyzeForWeather(countryCode: string, countryName: string): Promise<WeatherResult> {
  const ctx = await executeNetworkEngine('system', `Weather and mood in ${countryName}`);
  const ev = ctx.collection.eventVector;
  return {
    countryCode,
    countryName,
    emotions: ctx.analysis.emotions,
    dominantEmotion: ctx.analysis.dominantEmotion,
    polarity: ev.polarity,
    intensity: ev.intensity,
    categories: ev.categories,
    dominantCategory: ev.dominantCategory,
    trendingKeywords: ev.trendingKeywords,
    topHeadlines: ev.topHeadlines ?? NO_ITEMS,
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    sourceCount: Object.keys(ev.sourceBreakdown).length,
    totalItems: ev.totalItems,
    isRealData: ev.totalItems > 0,
  };
}

export async function analyzeForCountryDetail(
  countryCode: string,
  countryName: string,
  _includeAISummary = false,
  language = 'ar',
): Promise<CountryDetailResult> {
  const ctx = await executeNetworkEngine('system', `Detailed analysis of ${countryName}`, language);
  const ev = ctx.collection.eventVector;

  const news: CountryDetailResult['news'] = { political: [], economic: [], social: [], conflict: [] };
  for (const h of ev.topHeadlines ?? []) {
    const cat = h.category as keyof typeof news;
    if (cat in news) {
      news[cat].push({ title: h.title, source: h.source, sentiment: h.sentiment });
    } else {
      news.social.push({ title: h.title, source: h.source, sentiment: h.sentiment });
    }
  }

  return {
    countryCode,
    countryName,
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    emotions: ctx.analysis.emotions,
    dominantEmotion: ctx.analysis.dominantEmotion,
    categories: ev.categories,
    dominantCategory: ev.dominantCategory,
    polarity: ev.polarity,
    intensity: ev.intensity,
    news,
    trendingKeywords: ev.trendingKeywords,
    sourceCount: Object.keys(ev.sourceBreakdown).length,
    totalItems: ev.totalItems,
    isRealData: ev.totalItems > 0,
    aiSummary: undefined,
  };
}

export async function analyzeForSmartAnalysis(query: string, language = 'ar'): Promise<SmartAnalysisResult> {
  const ctx = await executeNetworkEngine('system', query, language);
  const ev = ctx.collection.eventVector;
  return {
    query,
    response: ctx.generation.response,
    confidence: ctx.analysis.confidence,
    emotions: ctx.analysis.emotions,
    dominantEmotion: ctx.analysis.dominantEmotion,
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    categories: ev.categories,
    trendingKeywords: ev.trendingKeywords,
    sourceCount: Object.keys(ev.sourceBreakdown).length,
    totalItems: ev.totalItems,
    topHeadlines: ev.topHeadlines ?? NO_ITEMS,
    isRealData: ev.totalItems > 0,
  };
}

export function getCacheStats() {
  // Cache is now managed by networkEngine / unifiedDataCollector
  return { note: 'Cache is managed by networkEngine; see getEngineStats() instead.' };
}

export function clearCache() {
  return { success: true, note: 'Cache is managed by networkEngine.' };
}
