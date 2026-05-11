/**
 * Country News Analyzer - Real Data Engine
 * 
 * Fetches REAL news for each country from multiple sources (Google RSS, NewsAPI)
 * Then analyzes sentiment using Groq LLM to produce real GMI/CFI/HRI indices
 * 
 * NO mock data. NO hardcoded values. Everything is derived from actual news.
 */
import { fetchGoogleNewsByTopic, fetchGoogleNewsByCountry, type NewsItem } from './googleRssService';
import { fetchCountryNews, type NewsArticle } from './newsService';
import { smartJsonChat } from './smartLLM';

// Country metadata for search queries
const COUNTRY_META: Record<string, { nameEn: string; nameAr: string; searchTerms: string[] }> = {
  LY: { nameEn: 'Libya', nameAr: 'ليبيا', searchTerms: ['Libya', 'ليبيا', 'Tripoli'] },
  EG: { nameEn: 'Egypt', nameAr: 'مصر', searchTerms: ['Egypt', 'مصر', 'Cairo'] },
  SA: { nameEn: 'Saudi Arabia', nameAr: 'السعودية', searchTerms: ['Saudi Arabia', 'السعودية', 'Riyadh'] },
  AE: { nameEn: 'UAE', nameAr: 'الإمارات', searchTerms: ['UAE', 'الإمارات', 'Dubai'] },
  US: { nameEn: 'United States', nameAr: 'الولايات المتحدة', searchTerms: ['United States', 'USA', 'America'] },
  GB: { nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', searchTerms: ['United Kingdom', 'UK', 'Britain'] },
  DE: { nameEn: 'Germany', nameAr: 'ألمانيا', searchTerms: ['Germany', 'Deutschland'] },
  FR: { nameEn: 'France', nameAr: 'فرنسا', searchTerms: ['France', 'Paris'] },
  JP: { nameEn: 'Japan', nameAr: 'اليابان', searchTerms: ['Japan', 'Tokyo'] },
  CN: { nameEn: 'China', nameAr: 'الصين', searchTerms: ['China', 'Beijing'] },
  IN: { nameEn: 'India', nameAr: 'الهند', searchTerms: ['India', 'Delhi'] },
  BR: { nameEn: 'Brazil', nameAr: 'البرازيل', searchTerms: ['Brazil', 'Brasilia'] },
  CA: { nameEn: 'Canada', nameAr: 'كندا', searchTerms: ['Canada', 'Ottawa'] },
  AU: { nameEn: 'Australia', nameAr: 'أستراليا', searchTerms: ['Australia', 'Sydney'] },
  KR: { nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', searchTerms: ['South Korea', 'Seoul'] },
  MX: { nameEn: 'Mexico', nameAr: 'المكسيك', searchTerms: ['Mexico'] },
  RU: { nameEn: 'Russia', nameAr: 'روسيا', searchTerms: ['Russia', 'Moscow'] },
  IT: { nameEn: 'Italy', nameAr: 'إيطاليا', searchTerms: ['Italy', 'Rome'] },
  ES: { nameEn: 'Spain', nameAr: 'إسبانيا', searchTerms: ['Spain', 'Madrid'] },
  NL: { nameEn: 'Netherlands', nameAr: 'هولندا', searchTerms: ['Netherlands', 'Amsterdam'] },
  SE: { nameEn: 'Sweden', nameAr: 'السويد', searchTerms: ['Sweden', 'Stockholm'] },
  CH: { nameEn: 'Switzerland', nameAr: 'سويسرا', searchTerms: ['Switzerland', 'Zurich'] },
  SG: { nameEn: 'Singapore', nameAr: 'سنغافورة', searchTerms: ['Singapore'] },
  ID: { nameEn: 'Indonesia', nameAr: 'إندونيسيا', searchTerms: ['Indonesia', 'Jakarta'] },
  TH: { nameEn: 'Thailand', nameAr: 'تايلاند', searchTerms: ['Thailand', 'Bangkok'] },
  MY: { nameEn: 'Malaysia', nameAr: 'ماليزيا', searchTerms: ['Malaysia', 'Kuala Lumpur'] },
  TR: { nameEn: 'Turkey', nameAr: 'تركيا', searchTerms: ['Turkey', 'Ankara'] },
  PS: { nameEn: 'Palestine', nameAr: 'فلسطين', searchTerms: ['Palestine', 'Gaza', 'فلسطين'] },
  IQ: { nameEn: 'Iraq', nameAr: 'العراق', searchTerms: ['Iraq', 'Baghdad', 'العراق'] },
  SY: { nameEn: 'Syria', nameAr: 'سوريا', searchTerms: ['Syria', 'Damascus', 'سوريا'] },
  JO: { nameEn: 'Jordan', nameAr: 'الأردن', searchTerms: ['Jordan', 'Amman'] },
  LB: { nameEn: 'Lebanon', nameAr: 'لبنان', searchTerms: ['Lebanon', 'Beirut', 'لبنان'] },
  MA: { nameEn: 'Morocco', nameAr: 'المغرب', searchTerms: ['Morocco', 'Rabat'] },
  DZ: { nameEn: 'Algeria', nameAr: 'الجزائر', searchTerms: ['Algeria', 'Algiers'] },
  TN: { nameEn: 'Tunisia', nameAr: 'تونس', searchTerms: ['Tunisia', 'Tunis'] },
  SD: { nameEn: 'Sudan', nameAr: 'السودان', searchTerms: ['Sudan', 'Khartoum', 'السودان'] },
  QA: { nameEn: 'Qatar', nameAr: 'قطر', searchTerms: ['Qatar', 'Doha'] },
  KW: { nameEn: 'Kuwait', nameAr: 'الكويت', searchTerms: ['Kuwait'] },
  BH: { nameEn: 'Bahrain', nameAr: 'البحرين', searchTerms: ['Bahrain', 'Manama'] },
  OM: { nameEn: 'Oman', nameAr: 'عُمان', searchTerms: ['Oman', 'Muscat'] },
  YE: { nameEn: 'Yemen', nameAr: 'اليمن', searchTerms: ['Yemen', 'Sanaa', 'اليمن'] },
  ZA: { nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', searchTerms: ['South Africa', 'Johannesburg'] },
  NG: { nameEn: 'Nigeria', nameAr: 'نيجيريا', searchTerms: ['Nigeria', 'Lagos'] },
  KE: { nameEn: 'Kenya', nameAr: 'كينيا', searchTerms: ['Kenya', 'Nairobi'] },
  PK: { nameEn: 'Pakistan', nameAr: 'باكستان', searchTerms: ['Pakistan', 'Islamabad'] },
  AR: { nameEn: 'Argentina', nameAr: 'الأرجنتين', searchTerms: ['Argentina', 'Buenos Aires'] },
  CO: { nameEn: 'Colombia', nameAr: 'كولومبيا', searchTerms: ['Colombia', 'Bogota'] },
};

export function getCountryMeta(code: string) {
  return COUNTRY_META[code];
}

export function getAllCountryCodes(): string[] {
  return Object.keys(COUNTRY_META);
}

// Cache for country analysis results (TTL: 15 minutes)
interface CachedAnalysis {
  data: CountryAnalysis;
  timestamp: number;
}
const analysisCache = new Map<string, CachedAnalysis>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// News item for display
export interface CountryNewsItem {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'political' | 'economic' | 'social' | 'security' | 'cultural' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
}

// Full country analysis result
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
  trendingTopics: Array<{
    topic: string;
    topicAr: string;
    category: string;
    heat: number;
    sentiment: string;
  }>;
  totalSources: number;
  isRealData: boolean;
  lastUpdated: string;
}

/**
 * Fetch real news for a country from multiple sources
 */
async function fetchRealCountryNews(countryCode: string): Promise<Array<{ title: string; description: string; source: string; url: string; publishedAt: string }>> {
  const meta = COUNTRY_META[countryCode];
  if (!meta) return [];

  const allNews: Array<{ title: string; description: string; source: string; url: string; publishedAt: string }> = [];

  // 1. Google RSS by country
  try {
    const rssNews = await fetchGoogleNewsByCountry(countryCode, 8);
    rssNews.forEach((n: NewsItem) => {
      allNews.push({
        title: n.title,
        description: n.description || '',
        source: n.source || 'Google News',
        url: n.link,
        publishedAt: n.pubDate,
      });
    });
  } catch (e) {
    console.warn(`[CountryNews] Google RSS failed for ${countryCode}:`, (e as Error).message);
  }

  // 2. Google RSS by topic search (country name)
  try {
    const topicNews = await fetchGoogleNewsByTopic(meta.nameEn, 5);
    topicNews.forEach((n: NewsItem) => {
      if (!allNews.some(existing => existing.title === n.title)) {
        allNews.push({
          title: n.title,
          description: n.description || '',
          source: n.source || 'Google News',
          url: n.link,
          publishedAt: n.pubDate,
        });
      }
    });
  } catch (e) {
    console.warn(`[CountryNews] Google RSS topic search failed for ${countryCode}:`, (e as Error).message);
  }

  // 3. NewsAPI
  try {
    const apiNews = await fetchCountryNews(countryCode, 5);
    apiNews.forEach((n: NewsArticle) => {
      if (!allNews.some(existing => existing.title === n.title)) {
        allNews.push({
          title: n.title,
          description: n.description || '',
          source: n.source,
          url: n.url,
          publishedAt: n.publishedAt.toISOString(),
        });
      }
    });
  } catch (e) {
    console.warn(`[CountryNews] NewsAPI failed for ${countryCode}:`, (e as Error).message);
  }

  console.log(`[CountryNews] Fetched ${allNews.length} total news items for ${meta.nameEn}`);
  return allNews.slice(0, 12); // Max 12 news items
}

// =============================================
// KEYWORD-BASED CATEGORIZATION (used by both LLM and fallback)
// =============================================

const POLITICAL_KEYWORDS = [
  'election', 'president', 'government', 'parliament', 'minister', 'political', 'vote', 'law', 'policy', 'diplomacy',
  'diplomat', 'embassy', 'sanctions', 'treaty', 'summit', 'congress', 'senate', 'opposition', 'coalition', 'referendum',
  'military', 'army', 'defense', 'nato', 'war', 'conflict', 'ceasefire', 'peace talks', 'coup', 'protest',
  'انتخاب', 'رئيس', 'حكومة', 'برلمان', 'وزير', 'سياس', 'تصويت', 'قانون', 'دبلوماس', 'عسكري', 'جيش', 'حرب', 'صراع',
];

const ECONOMIC_KEYWORDS = [
  'economy', 'economic', 'gdp', 'inflation', 'market', 'stock', 'trade', 'export', 'import', 'oil', 'gas', 'energy',
  'price', 'currency', 'dollar', 'bank', 'investment', 'debt', 'budget', 'tax', 'revenue', 'growth', 'recession',
  'business', 'company', 'industry', 'manufacturing', 'employment', 'unemployment', 'wage', 'cost',
  'اقتصاد', 'نفط', 'غاز', 'سوق', 'تجارة', 'استثمار', 'بنك', 'عملة', 'دولار', 'أسعار', 'تضخم', 'ميزانية',
];

const SOCIAL_KEYWORDS = [
  'health', 'education', 'school', 'university', 'hospital', 'covid', 'vaccine', 'social', 'culture', 'festival',
  'sport', 'football', 'technology', 'internet', 'ai', 'climate', 'environment', 'water', 'food', 'housing',
  'women', 'youth', 'children', 'human rights', 'refugee', 'migration', 'community', 'religion',
  'صحة', 'تعليم', 'مدرسة', 'جامعة', 'مستشفى', 'اجتماع', 'ثقافة', 'رياضة', 'تكنولوجيا', 'بيئة', 'مناخ',
];

const NEGATIVE_KEYWORDS = [
  'war', 'crisis', 'attack', 'kill', 'bomb', 'conflict', 'death', 'terror', 'threat', 'violence', 'crash',
  'collapse', 'disaster', 'emergency', 'strike', 'protest', 'riot', 'sanction', 'arrest', 'corruption',
  'recession', 'inflation', 'poverty', 'famine', 'drought', 'flood', 'earthquake', 'fire', 'explosion',
  'حرب', 'أزمة', 'هجوم', 'قتل', 'صراع', 'موت', 'تهديد', 'عنف', 'انهيار', 'كارثة', 'فقر', 'مجاعة', 'فساد',
];

const POSITIVE_KEYWORDS = [
  'peace', 'growth', 'agreement', 'success', 'development', 'progress', 'reform', 'cooperation', 'partnership',
  'achievement', 'innovation', 'recovery', 'improve', 'boost', 'win', 'celebrate', 'launch', 'invest', 'build',
  'سلام', 'نمو', 'اتفاق', 'نجاح', 'تنمية', 'تقدم', 'إصلاح', 'تعاون', 'شراكة', 'إنجاز', 'ابتكار', 'تحسن',
];

function categorizeByKeywords(title: string, description: string): { category: CountryNewsItem['category']; sentiment: CountryNewsItem['sentiment'] } {
  const text = (title + ' ' + description).toLowerCase();
  
  // Categorize
  const politicalScore = POLITICAL_KEYWORDS.filter(k => text.includes(k)).length;
  const economicScore = ECONOMIC_KEYWORDS.filter(k => text.includes(k)).length;
  const socialScore = SOCIAL_KEYWORDS.filter(k => text.includes(k)).length;
  
  let category: CountryNewsItem['category'] = 'general';
  const maxScore = Math.max(politicalScore, economicScore, socialScore);
  if (maxScore > 0) {
    if (politicalScore === maxScore) category = 'political';
    else if (economicScore === maxScore) category = 'economic';
    else category = 'social';
  }
  
  // Sentiment
  const negScore = NEGATIVE_KEYWORDS.filter(k => text.includes(k)).length;
  const posScore = POSITIVE_KEYWORDS.filter(k => text.includes(k)).length;
  
  let sentiment: CountryNewsItem['sentiment'] = 'neutral';
  if (negScore > posScore) sentiment = 'negative';
  else if (posScore > negScore) sentiment = 'positive';
  
  return { category, sentiment };
}

/**
 * Extract trending topics from news using keyword frequency analysis
 */
function extractTrendingTopics(
  news: Array<{ title: string; description: string }>,
  countryCode: string
): Array<{ topic: string; topicAr: string; category: string; heat: number; sentiment: string }> {
  const meta = COUNTRY_META[countryCode];
  
  // Extract significant 2-3 word phrases from titles
  const phraseCount = new Map<string, { count: number; sentiment: string; category: string }>();
  
  // Common stop words to filter out
  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall',
    'with', 'from', 'by', 'as', 'this', 'that', 'it', 'its', 'not', 'but', 'if', 'so', 'no', 'up', 'out', 'about',
    'after', 'over', 'new', 'says', 'said', 'how', 'what', 'when', 'where', 'who', 'why', 'all', 'more', 'some',
    // Filter out the country name itself
    ...(meta?.nameEn.toLowerCase().split(' ') || []),
  ]);
  
  for (const item of news) {
    const words = item.title.split(/[\s\-–—:,;|]+/).filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));
    const { category, sentiment } = categorizeByKeywords(item.title, item.description);
    
    // Single significant words
    for (const word of words) {
      const key = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      if (key.length < 3) continue;
      const existing = phraseCount.get(key);
      if (existing) {
        existing.count++;
      } else {
        phraseCount.set(key, { count: 1, sentiment, category });
      }
    }
    
    // Two-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      if (stopWords.has(words[i].toLowerCase()) || stopWords.has(words[i + 1].toLowerCase())) continue;
      const phrase = words[i] + ' ' + words[i + 1];
      const existing = phraseCount.get(phrase);
      if (existing) {
        existing.count++;
      } else {
        phraseCount.set(phrase, { count: 1, sentiment, category });
      }
    }
  }
  
  // Sort by frequency and take top topics
  const sorted = Array.from(phraseCount.entries())
    .filter(([_, v]) => v.count >= 2 || _.split(' ').length >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  
  return sorted.map(([topic, data], i) => ({
    topic,
    topicAr: topic, // Keep English for now - LLM can translate if available
    category: data.category === 'political' ? 'Politics' : data.category === 'economic' ? 'Economy' : data.category === 'social' ? 'Social' : 'General',
    heat: Math.min(100, 50 + data.count * 15 + (sorted.length - i) * 5),
    sentiment: data.sentiment,
  }));
}

/**
 * Analyze news sentiment and extract indices using Groq LLM
 * IMPORTANT: Only sends titles (not descriptions) to stay within token limits
 */
async function analyzeNewsSentiment(
  countryCode: string,
  news: Array<{ title: string; description: string; source: string; url: string; publishedAt: string }>
): Promise<{
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionIntensity: number;
  summary: string;
  summaryAr: string;
  categorizedNews: CountryNewsItem[];
  trendingTopics: Array<{ topic: string; topicAr: string; category: string; heat: number; sentiment: string }>;
}> {
  const meta = COUNTRY_META[countryCode];
  
  // ONLY send titles to stay within token limits (6000 TPM for Groq free tier)
  const titlesOnly = news.map((n, i) => `${i + 1}. ${n.title}`).join('\n');

  const systemPrompt = `You are a geopolitical sentiment analyst. Analyze these news headlines about ${meta?.nameEn || countryCode}.

Respond in JSON:
{
  "gmi": <-100 to 100, mood index>,
  "cfi": <0-100, crisis fear>,
  "hri": <0-100, hope index>,
  "dominantEmotion": <"hope"|"fear"|"anger"|"sadness"|"joy"|"curiosity"|"neutral">,
  "emotionIntensity": <0-100>,
  "summary": <1-2 sentence English summary>,
  "summaryAr": <1-2 sentence Arabic summary>,
  "categories": [{"i":<1-based index>,"c":<"p"|"e"|"s"|"g">,"s":<"pos"|"neg"|"neu">}],
  "topics": [{"t":<English topic>,"tAr":<Arabic topic>,"cat":<category>,"heat":<0-100>,"s":<"positive"|"negative"|"neutral">}]
}
Categories: p=political, e=economic, s=social, g=general. Max 5 topics.`;

  const userMessage = `Headlines for ${meta?.nameEn || countryCode}:\n${titlesOnly}`;

  try {
    const result = await smartJsonChat(systemPrompt, userMessage, 'response_generation');

    const gmi = Math.max(-100, Math.min(100, Number(result.gmi) || 0));
    const cfi = Math.max(0, Math.min(100, Number(result.cfi) || 50));
    const hri = Math.max(0, Math.min(100, Number(result.hri) || 50));

    // Map categories from LLM response
    const catMap: Record<string, CountryNewsItem['category']> = { p: 'political', e: 'economic', s: 'social', g: 'general' };
    const sentMap: Record<string, CountryNewsItem['sentiment']> = { pos: 'positive', neg: 'negative', neu: 'neutral' };
    
    const categorizedNews: CountryNewsItem[] = news.map((n, i) => {
      const cat = (result.categories || []).find((c: any) => c.i === i + 1);
      // Use LLM category if available, otherwise fall back to keyword-based
      const keywordResult = categorizeByKeywords(n.title, n.description);
      
      return {
        title: n.title,
        description: n.description,
        source: n.source,
        url: n.url,
        publishedAt: n.publishedAt,
        category: cat ? (catMap[cat.c] || keywordResult.category) : keywordResult.category,
        sentiment: cat ? (sentMap[cat.s] || keywordResult.sentiment) : keywordResult.sentiment,
      };
    });

    // Map trending topics
    const trendingTopics = (result.topics || []).slice(0, 5).map((t: any) => ({
      topic: t.t || t.topic || '',
      topicAr: t.tAr || t.topicAr || t.t || '',
      category: t.cat || t.category || 'General',
      heat: Math.max(0, Math.min(100, Number(t.heat) || 50)),
      sentiment: t.s || t.sentiment || 'neutral',
    }));

    return {
      gmi,
      cfi,
      hri,
      dominantEmotion: result.dominantEmotion || 'neutral',
      emotionIntensity: Math.max(0, Math.min(100, Number(result.emotionIntensity) || 50)),
      summary: result.summary || `Emotional climate in ${meta?.nameEn || countryCode} based on ${news.length} sources.`,
      summaryAr: result.summaryAr || `المناخ العاطفي في ${meta?.nameAr || countryCode} بناءً على ${news.length} مصدر.`,
      categorizedNews,
      trendingTopics,
    };
  } catch (error) {
    console.error(`[CountryNews] LLM analysis failed for ${countryCode}:`, error);
    return createBasicAnalysis(countryCode, news);
  }
}

/**
 * Basic sentiment analysis without LLM (fallback)
 * Uses comprehensive keyword-based categorization and trending topic extraction
 */
function createBasicAnalysis(
  countryCode: string,
  news: Array<{ title: string; description: string; source: string; url: string; publishedAt: string }>
) {
  const meta = COUNTRY_META[countryCode];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  const categorizedNews: CountryNewsItem[] = news.map(n => {
    const { category, sentiment } = categorizeByKeywords(n.title, n.description);
    if (sentiment === 'positive') positiveCount++;
    if (sentiment === 'negative') negativeCount++;
    
    return {
      title: n.title,
      description: n.description,
      source: n.source,
      url: n.url,
      publishedAt: n.publishedAt,
      category,
      sentiment,
    };
  });
  
  const total = news.length || 1;
  const sentimentRatio = (positiveCount - negativeCount) / total;
  
  // Extract trending topics from news titles
  const trendingTopics = extractTrendingTopics(news, countryCode);
  
  return {
    gmi: Math.round(sentimentRatio * 60),
    cfi: Math.round(Math.max(0, Math.min(100, (negativeCount / total) * 80 + 10))),
    hri: Math.round(Math.max(0, Math.min(100, (positiveCount / total) * 80 + 10))),
    dominantEmotion: sentimentRatio > 0.2 ? 'hope' : sentimentRatio < -0.2 ? 'fear' : 'neutral',
    emotionIntensity: Math.round(Math.abs(sentimentRatio) * 70 + 30),
    summary: `Analysis of ${news.length} news sources for ${meta?.nameEn || countryCode}. ${positiveCount} positive, ${negativeCount} negative, ${total - positiveCount - negativeCount} neutral.`,
    summaryAr: `تحليل ${news.length} مصدر إخباري لـ${meta?.nameAr || countryCode}. ${positiveCount} إيجابي، ${negativeCount} سلبي، ${total - positiveCount - negativeCount} محايد.`,
    categorizedNews,
    trendingTopics,
  };
}

/**
 * Main function: Get full country analysis with real data
 */
export async function analyzeCountry(countryCode: string): Promise<CountryAnalysis> {
  // Check cache first
  const cached = analysisCache.get(countryCode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[CountryNews] Returning cached analysis for ${countryCode}`);
    return cached.data;
  }

  const meta = COUNTRY_META[countryCode];
  if (!meta) {
    throw new Error(`Unknown country code: ${countryCode}`);
  }

  console.log(`[CountryNews] Starting real analysis for ${meta.nameEn} (${countryCode})`);

  // Step 1: Fetch real news
  const rawNews = await fetchRealCountryNews(countryCode);

  if (rawNews.length === 0) {
    const result: CountryAnalysis = {
      countryCode,
      countryName: meta.nameEn,
      countryNameAr: meta.nameAr,
      gmi: 0,
      cfi: 50,
      hri: 50,
      dominantEmotion: 'neutral',
      emotionIntensity: 30,
      news: { political: [], economic: [], social: [] },
      summary: `No recent news available for ${meta.nameEn}.`,
      summaryAr: `لا توجد أخبار حديثة متاحة لـ${meta.nameAr}.`,
      trendingTopics: [],
      totalSources: 0,
      isRealData: false,
      lastUpdated: new Date().toISOString(),
    };
    return result;
  }

  // Step 2: Analyze sentiment (LLM with keyword fallback)
  const analysis = await analyzeNewsSentiment(countryCode, rawNews);

  // Step 3: Categorize news into groups
  const political = analysis.categorizedNews.filter(n => n.category === 'political' || n.category === 'security');
  const economic = analysis.categorizedNews.filter(n => n.category === 'economic');
  const social = analysis.categorizedNews.filter(n => n.category === 'social' || n.category === 'cultural' || n.category === 'general');

  const result: CountryAnalysis = {
    countryCode,
    countryName: meta.nameEn,
    countryNameAr: meta.nameAr,
    gmi: analysis.gmi,
    cfi: analysis.cfi,
    hri: analysis.hri,
    dominantEmotion: analysis.dominantEmotion,
    emotionIntensity: analysis.emotionIntensity,
    news: { political, economic, social },
    summary: analysis.summary,
    summaryAr: analysis.summaryAr,
    trendingTopics: analysis.trendingTopics,
    totalSources: rawNews.length,
    isRealData: true,
    lastUpdated: new Date().toISOString(),
  };

  // Cache the result
  analysisCache.set(countryCode, { data: result, timestamp: Date.now() });

  console.log(`[CountryNews] Analysis complete for ${meta.nameEn}: GMI=${result.gmi}, CFI=${result.cfi}, HRI=${result.hri}, Sources=${result.totalSources}, Topics=${result.trendingTopics.length}`);
  return result;
}

/**
 * Quick analysis for map overview - uses cache or keyword-only analysis (no LLM)
 * This is faster and doesn't consume LLM tokens
 */
export async function quickCountryAnalysis(countryCode: string): Promise<{ gmi: number; cfi: number; hri: number; dominantEmotion: string; isRealData: boolean }> {
  // Check cache first
  const cached = analysisCache.get(countryCode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      gmi: cached.data.gmi,
      cfi: cached.data.cfi,
      hri: cached.data.hri,
      dominantEmotion: cached.data.dominantEmotion,
      isRealData: cached.data.isRealData,
    };
  }

  const meta = COUNTRY_META[countryCode];
  if (!meta) return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', isRealData: false };

  // Fetch news but only do keyword analysis (no LLM)
  try {
    const rawNews = await fetchRealCountryNews(countryCode);
    if (rawNews.length === 0) return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', isRealData: false };
    
    const basic = createBasicAnalysis(countryCode, rawNews);
    return {
      gmi: basic.gmi,
      cfi: basic.cfi,
      hri: basic.hri,
      dominantEmotion: basic.dominantEmotion,
      isRealData: true,
    };
  } catch {
    return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', isRealData: false };
  }
}
