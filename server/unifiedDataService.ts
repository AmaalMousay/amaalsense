/**
 * Unified Data Service
 * 
 * This service aggregates data from all sources (News, Social Media)
 * and feeds it through the Hybrid DCFT Engine for analysis.
 * 
 * Data Flow:
 * Sources (News API, Social Media) → Unified Service → Hybrid Engine → Results
 */

import { analyzeHybrid, HybridAnalysisResult } from './hybridAnalyzer';

// Types
export interface DataSource {
  type: 'news' | 'twitter' | 'reddit' | 'youtube' | 'telegram';
  name: string;
  weight: number; // Influence weight for DCFT
}

export interface RawDataItem {
  id: string;
  text: string;
  source: DataSource;
  timestamp: Date;
  country?: string;
  topic?: string;
  engagement?: number; // likes, shares, etc.
  url?: string;
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
  lastUpdated: Date;
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
  
  // High fear index
  if (cfi > 70) {
    return toResult(MOOD_LABELS.fearful);
  }
  // High anger (negative GMI + high CFI)
  if (gmi < -30 && cfi > 50) {
    return toResult(MOOD_LABELS.angry);
  }
  // Very positive
  if (gmi > 50 && hri > 60) {
    return toResult(MOOD_LABELS.veryPositive);
  }
  // Positive
  if (gmi > 20 && hri > 40) {
    return toResult(MOOD_LABELS.positive);
  }
  // Anxious
  if (cfi > 50 && gmi < 0) {
    return toResult(MOOD_LABELS.anxious);
  }
  // Concerned
  if (cfi > 40 || gmi < -10) {
    return toResult(MOOD_LABELS.concerned);
  }
  // Sad (low HRI, negative GMI)
  if (hri < 30 && gmi < 0) {
    return toResult(MOOD_LABELS.sad);
  }
  // Calm
  if (cfi < 30 && Math.abs(gmi) < 20) {
    return toResult(MOOD_LABELS.calm);
  }
  // Default neutral
  return toResult(MOOD_LABELS.neutral);
}

// News API integration
async function fetchNewsData(country?: string, topic?: string, limit: number = 20): Promise<RawDataItem[]> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  
  if (!NEWS_API_KEY) {
    console.log('[UnifiedData] No NEWS_API_KEY, using simulation');
    return generateSimulatedNews(country, topic, limit);
  }

  try {
    let url = 'https://newsapi.org/v2/top-headlines?';
    const params: string[] = [];
    
    if (country) {
      // Map country codes
      const countryMap: Record<string, string> = {
        'LY': 'ly', 'EG': 'eg', 'SA': 'sa', 'AE': 'ae', 'US': 'us',
        'GB': 'gb', 'FR': 'fr', 'DE': 'de', 'TR': 'tr', 'MA': 'ma'
      };
      const newsCountry = countryMap[country] || country.toLowerCase();
      params.push(`country=${newsCountry}`);
    }
    
    if (topic) {
      params.push(`q=${encodeURIComponent(topic)}`);
    }
    
    params.push(`pageSize=${limit}`);
    params.push(`apiKey=${NEWS_API_KEY}`);
    
    url += params.join('&');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ok' && data.articles) {
      return data.articles.map((article: any, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        text: `${article.title || ''} ${article.description || ''}`.trim(),
        source: {
          type: 'news' as const,
          name: article.source?.name || 'News',
          weight: 0.8 // News has high weight
        },
        timestamp: new Date(article.publishedAt || Date.now()),
        country: country,
        topic: topic,
        url: article.url
      }));
    }
  } catch (error) {
    console.error('[UnifiedData] News API error:', error);
  }
  
  return generateSimulatedNews(country, topic, limit);
}

// Simulated news data
function generateSimulatedNews(country?: string, topic?: string, limit: number = 20): RawDataItem[] {
  const headlines = [
    { text: 'Economic growth shows positive signs amid global uncertainty', sentiment: 0.6 },
    { text: 'New infrastructure projects announced to boost development', sentiment: 0.7 },
    { text: 'Citizens express concerns over rising living costs', sentiment: -0.4 },
    { text: 'Government launches new initiative for youth employment', sentiment: 0.5 },
    { text: 'Security forces successfully maintain stability in the region', sentiment: 0.3 },
    { text: 'Healthcare system improvements receive public approval', sentiment: 0.6 },
    { text: 'Environmental challenges require urgent attention', sentiment: -0.3 },
    { text: 'Cultural festival brings communities together', sentiment: 0.8 },
    { text: 'Technology sector shows promising growth', sentiment: 0.7 },
    { text: 'Education reforms aim to improve quality', sentiment: 0.5 },
    { text: 'Local businesses struggle with economic pressures', sentiment: -0.5 },
    { text: 'International cooperation strengthens regional ties', sentiment: 0.6 },
    { text: 'Public transportation improvements underway', sentiment: 0.4 },
    { text: 'Housing crisis affects many families', sentiment: -0.6 },
    { text: 'Sports achievements bring national pride', sentiment: 0.9 },
  ];

  const arabicHeadlines = [
    { text: 'نمو اقتصادي إيجابي رغم التحديات العالمية', sentiment: 0.6 },
    { text: 'إطلاق مشاريع بنية تحتية جديدة لتعزيز التنمية', sentiment: 0.7 },
    { text: 'المواطنون يعبرون عن قلقهم من ارتفاع تكاليف المعيشة', sentiment: -0.4 },
    { text: 'الحكومة تطلق مبادرة جديدة لتوظيف الشباب', sentiment: 0.5 },
    { text: 'قوات الأمن تحافظ على الاستقرار في المنطقة', sentiment: 0.3 },
    { text: 'تحسينات النظام الصحي تحظى بموافقة الجمهور', sentiment: 0.6 },
    { text: 'التحديات البيئية تتطلب اهتماماً عاجلاً', sentiment: -0.3 },
    { text: 'مهرجان ثقافي يجمع المجتمعات معاً', sentiment: 0.8 },
    { text: 'قطاع التكنولوجيا يظهر نمواً واعداً', sentiment: 0.7 },
    { text: 'إصلاحات التعليم تهدف لتحسين الجودة', sentiment: 0.5 },
  ];

  const useArabic = country && ['LY', 'EG', 'SA', 'AE', 'MA', 'TN', 'DZ', 'IQ', 'JO', 'KW', 'QA', 'BH', 'OM', 'LB', 'SY', 'PS', 'YE', 'SD'].includes(country);
  const sourceHeadlines = useArabic ? arabicHeadlines : headlines;

  return sourceHeadlines.slice(0, limit).map((h, index) => ({
    id: `sim-news-${Date.now()}-${index}`,
    text: topic ? `${topic}: ${h.text}` : h.text,
    source: {
      type: 'news' as const,
      name: 'Simulated News',
      weight: 0.7
    },
    timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
    country: country,
    topic: topic,
    engagement: Math.floor(Math.random() * 1000)
  }));
}

// Social media data simulation
function generateSimulatedSocialMedia(country?: string, topic?: string, limit: number = 30): RawDataItem[] {
  const posts = [
    { text: 'Finally some good news! Things are looking up 🎉', sentiment: 0.8 },
    { text: 'Worried about the current situation...', sentiment: -0.5 },
    { text: 'Great progress being made! Keep it up!', sentiment: 0.7 },
    { text: 'This is unacceptable! We need change now!', sentiment: -0.7 },
    { text: 'Feeling hopeful about the future', sentiment: 0.6 },
    { text: 'The situation is getting worse every day', sentiment: -0.6 },
    { text: 'Amazing achievement! So proud!', sentiment: 0.9 },
    { text: 'Not sure what to think anymore...', sentiment: 0 },
    { text: 'This gives me hope for better days', sentiment: 0.5 },
    { text: 'Disappointed with the lack of progress', sentiment: -0.4 },
  ];

  const arabicPosts = [
    { text: 'أخيراً أخبار جيدة! الأمور تتحسن 🎉', sentiment: 0.8 },
    { text: 'قلق من الوضع الحالي...', sentiment: -0.5 },
    { text: 'تقدم رائع! استمروا!', sentiment: 0.7 },
    { text: 'هذا غير مقبول! نحتاج للتغيير الآن!', sentiment: -0.7 },
    { text: 'متفائل بالمستقبل', sentiment: 0.6 },
    { text: 'الوضع يزداد سوءاً كل يوم', sentiment: -0.6 },
    { text: 'إنجاز مذهل! فخور جداً!', sentiment: 0.9 },
    { text: 'لا أعرف ماذا أفكر بعد الآن...', sentiment: 0 },
    { text: 'هذا يعطيني أملاً بأيام أفضل', sentiment: 0.5 },
    { text: 'محبط من عدم التقدم', sentiment: -0.4 },
  ];

  const useArabic = country && ['LY', 'EG', 'SA', 'AE', 'MA', 'TN', 'DZ', 'IQ', 'JO', 'KW', 'QA', 'BH', 'OM', 'LB', 'SY', 'PS', 'YE', 'SD'].includes(country);
  const sourcePosts = useArabic ? arabicPosts : posts;
  
  const sources: DataSource[] = [
    { type: 'twitter', name: 'Twitter/X', weight: 0.6 },
    { type: 'reddit', name: 'Reddit', weight: 0.5 },
    { type: 'youtube', name: 'YouTube', weight: 0.4 },
    { type: 'telegram', name: 'Telegram', weight: 0.5 },
  ];

  const results: RawDataItem[] = [];
  
  for (let i = 0; i < limit; i++) {
    const post = sourcePosts[i % sourcePosts.length];
    const source = sources[i % sources.length];
    
    results.push({
      id: `sim-social-${Date.now()}-${i}`,
      text: topic ? `${topic}: ${post.text}` : post.text,
      source: source,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      country: country,
      topic: topic,
      engagement: Math.floor(Math.random() * 5000)
    });
  }
  
  return results;
}

// Main unified analysis function
export async function analyzeUnified(request: UnifiedAnalysisRequest): Promise<MoodResult> {
  const { scope, country, topic, timeRange = 'day', limit = 50 } = request;
  
  console.log(`[UnifiedData] Analyzing: scope=${scope}, country=${country}, topic=${topic}`);
  
  // Fetch data from all sources
  const newsData = await fetchNewsData(country, topic, Math.floor(limit / 2));
  const socialData = generateSimulatedSocialMedia(country, topic, Math.floor(limit / 2));
  
  const allData = [...newsData, ...socialData];
  
  if (allData.length === 0) {
    // Return neutral mood if no data
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
      lastUpdated: new Date()
    };
  }
  
  // Combine all texts for analysis
  const combinedText = allData.map(d => d.text).join('\n');
  
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
    lastUpdated: new Date(),
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
  
  // Process in parallel for speed
  await Promise.all(
    countries.map(async (code) => {
      results[code] = await getCountryMood(code);
    })
  );
  
  return results;
}
