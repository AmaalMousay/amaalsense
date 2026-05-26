/**
 * Country News Analyzer
 *
 * Provides quick country-specific analysis for the map UI.
 * When a user clicks on a country in the map, this module returns
 * a structured analysis with GMI/CFI/HRI, categorized news, and summary.
 *
 * Delegates all data fetching and emotion computation to networkEngine.ts
 * so there is no code duplication.
 */

import { executeNetworkEngine, getGlobalMood } from './networkEngine';

export interface CountryNewsItem {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'political' | 'economic' | 'social' | 'security' | 'cultural' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface CountryAnalysis {
  countryCode: string;
  countryName: string;
  countryNameAr: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionIntensity: number;
  news: {
    political: CountryNewsItem[];
    economic: CountryNewsItem[];
    social: CountryNewsItem[];
  };
  summary: string;
  summaryAr: string;
  trendingTopics: string[];
  totalSources: number;
  isRealData: boolean;
  lastUpdated: string;
}

// ================================================================
// Country Metadata
// ================================================================

interface CountryMeta {
  nameEn: string;
  nameAr: string;
  searchTerms: string[];
}

const COUNTRY_META: Record<string, CountryMeta> = {
  LY: { nameEn: 'Libya', nameAr: 'ليبيا', searchTerms: ['Libya', 'Tripoli', 'Benghazi'] },
  EG: { nameEn: 'Egypt', nameAr: 'مصر', searchTerms: ['Egypt', 'Cairo'] },
  PS: { nameEn: 'Palestine', nameAr: 'فلسطين', searchTerms: ['Palestine', 'Gaza'] },
  SA: { nameEn: 'Saudi Arabia', nameAr: 'السعودية', searchTerms: ['Saudi Arabia', 'Riyadh'] },
  AE: { nameEn: 'UAE', nameAr: 'الإمارات', searchTerms: ['UAE', 'Dubai'] },
  IQ: { nameEn: 'Iraq', nameAr: 'العراق', searchTerms: ['Iraq', 'Baghdad'] },
  SY: { nameEn: 'Syria', nameAr: 'سوريا', searchTerms: ['Syria', 'Damascus'] },
  YE: { nameEn: 'Yemen', nameAr: 'اليمن', searchTerms: ['Yemen', 'Sanaa'] },
  TN: { nameEn: 'Tunisia', nameAr: 'تونس', searchTerms: ['Tunisia', 'Tunis'] },
  DZ: { nameEn: 'Algeria', nameAr: 'الجزائر', searchTerms: ['Algeria', 'Algiers'] },
  MA: { nameEn: 'Morocco', nameAr: 'المغرب', searchTerms: ['Morocco', 'Rabat'] },
  JO: { nameEn: 'Jordan', nameAr: 'الأردن', searchTerms: ['Jordan', 'Amman'] },
  LB: { nameEn: 'Lebanon', nameAr: 'لبنان', searchTerms: ['Lebanon', 'Beirut'] },
  SD: { nameEn: 'Sudan', nameAr: 'السودان', searchTerms: ['Sudan', 'Khartoum'] },
  US: { nameEn: 'United States', nameAr: 'الولايات المتحدة', searchTerms: ['USA', 'America'] },
  GB: { nameEn: 'United Kingdom', nameAr: 'بريطانيا', searchTerms: ['UK', 'London'] },
  FR: { nameEn: 'France', nameAr: 'فرنسا', searchTerms: ['France', 'Paris'] },
  DE: { nameEn: 'Germany', nameAr: 'ألمانيا', searchTerms: ['Germany', 'Berlin'] },
  CN: { nameEn: 'China', nameAr: 'الصين', searchTerms: ['China', 'Beijing'] },
  RU: { nameEn: 'Russia', nameAr: 'روسيا', searchTerms: ['Russia', 'Moscow'] },
  JP: { nameEn: 'Japan', nameAr: 'اليابان', searchTerms: ['Japan', 'Tokyo'] },
  IN: { nameEn: 'India', nameAr: 'الهند', searchTerms: ['India', 'New Delhi'] },
  BR: { nameEn: 'Brazil', nameAr: 'البرازيل', searchTerms: ['Brazil', 'Brasilia'] },
  ZA: { nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', searchTerms: ['South Africa', 'Pretoria'] },
};

export function getCountryMeta(code: string): CountryMeta | undefined {
  return COUNTRY_META[code];
}

export function getAllCountryCodes(): string[] {
  return Object.keys(COUNTRY_META);
}

// ================================================================
// Analysis Cache
// ================================================================

interface CachedAnalysis {
  data: CountryAnalysis;
  timestamp: number;
}

const analysisCache = new Map<string, CachedAnalysis>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// ================================================================
// Main Analysis — delegates to networkEngine
// ================================================================

export async function analyzeCountry(countryCode: string): Promise<CountryAnalysis> {
  const cached = analysisCache.get(countryCode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const meta = COUNTRY_META[countryCode];
  if (!meta) throw new Error(`Unknown country code: ${countryCode}`);

  // Delegate to central network engine
  const ctx = await executeNetworkEngine('system', `Detailed analysis of ${meta.nameEn}`, 'en');

  // Also get global mood for context
  const global = await getGlobalMood();
  const ev = ctx.collection.eventVector;
  const items = ctx.collection.rawData.items || [];

  // Categorize headlines
  const political: CountryNewsItem[] = [];
  const economic: CountryNewsItem[] = [];
  const social: CountryNewsItem[] = [];

  for (const item of items.slice(0, 30)) {
    const cat = item.topic as string;
    const n: CountryNewsItem = {
      title: item.title,
      description: item.description || '',
      source: item.source,
      url: item.url,
      publishedAt: item.publishedAt || new Date().toISOString(),
      category: cat === 'politics' || cat === 'conflict' ? 'political' :
               cat === 'economy' ? 'economic' : 'social',
      sentiment: ev.polarity > 0 ? 'positive' : ev.polarity < 0 ? 'negative' : 'neutral',
    };
    if (n.category === 'political') political.push(n);
    else if (n.category === 'economic') economic.push(n);
    else social.push(n);
  }

  const result: CountryAnalysis = {
    countryCode,
    countryName: meta.nameEn,
    countryNameAr: meta.nameAr,
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    dominantEmotion: ctx.analysis.dominantEmotion,
    emotionIntensity: Math.round((ev.intensity || 0.5) * 100),
    news: { political, economic, social },
    summary: ctx.generation.response.slice(0, 500),
    summaryAr: ctx.generation.response.slice(0, 500),
    trendingTopics: ev.trendingKeywords || [],
    totalSources: items.length,
    isRealData: items.length > 0,
    lastUpdated: new Date().toISOString(),
  };

  analysisCache.set(countryCode, { data: result, timestamp: Date.now() });
  return result;
}

/**
 * Quick analysis for map coloring — uses cache or returns a lightweight result.
 */
export async function quickCountryAnalysis(countryCode: string): Promise<{
  gmi: number; cfi: number; hri: number;
  dominantEmotion: string; isRealData: boolean;
}> {
  const cached = analysisCache.get(countryCode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    const d = cached.data;
    return { gmi: d.gmi, cfi: d.cfi, hri: d.hri, dominantEmotion: d.dominantEmotion, isRealData: d.isRealData };
  }

  const meta = COUNTRY_META[countryCode];
  if (!meta) return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', isRealData: false };

  const ctx = await executeNetworkEngine('system', `Map analysis of ${meta.nameEn}`, 'en');
  return {
    gmi: ctx.dcft.indices.gmi,
    cfi: ctx.dcft.indices.cfi,
    hri: ctx.dcft.indices.hri,
    dominantEmotion: ctx.analysis.dominantEmotion,
    isRealData: ctx.collection.totalItems > 0,
  };
}

export function getCacheStats() {
  return { totalEntries: analysisCache.size, keys: [...analysisCache.keys()] };
}

export function clearCache() {
  analysisCache.clear();
  return { success: true };
}