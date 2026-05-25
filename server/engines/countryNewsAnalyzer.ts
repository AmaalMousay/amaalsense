import { t } from "../_core/i18n";
/**
 * Country News Analyzer - Real Data Engine
 * 
 * Fetches REAL news for each country from multiple sources (Google RSS, NewsAPI)
 * Then analyzes sentiment using Groq LLM to produce real GMI/CFI/HRI indices
 * 
 * NO mock data. NO hardcoded values. Everything is derived from actual news.
 */
import { fetchGoogleNewsByTopic, fetchGoogleNewsByCountry, type NewsItem } from '../services/googleRssService';
import { fetchCountryNews, type NewsArticle } from '../services/newsService';
import { smartJsonChat } from '../_core/llm';

// Country metadata for search queries
const COUNTRY_META: Record<string, { nameEn: string; nameAr: string; searchTerms: string[] }> = {
  LY: { nameEn: 'Libya', nameAr: t('auto.engines_countryNewsAnalyzer.118.251aff72', 'ar'), searchTerms: ['Libya', t('auto.engines_countryNewsAnalyzer.117.251aff72', 'ar'), 'Tripoli'] },
  EG: { nameEn: 'Egypt', nameAr: t('auto.engines_countryNewsAnalyzer.116.9f5f187b', 'ar'), searchTerms: ['Egypt', t('auto.engines_countryNewsAnalyzer.115.9f5f187b', 'ar'), 'Cairo'] },
  SA: { nameEn: 'Saudi Arabia', nameAr: t('auto.engines_countryNewsAnalyzer.114.cd8d189f', 'ar'), searchTerms: ['Saudi Arabia', t('auto.engines_countryNewsAnalyzer.113.cd8d189f', 'ar'), 'Riyadh'] },
  AE: { nameEn: 'UAE', nameAr: t('auto.engines_countryNewsAnalyzer.112.9bc10b8c', 'ar'), searchTerms: ['UAE', t('auto.engines_countryNewsAnalyzer.111.9bc10b8c', 'ar'), 'Dubai'] },
  US: { nameEn: 'United States', nameAr: t('auto.engines_countryNewsAnalyzer.110.a9eb5a2b', 'ar'), searchTerms: ['United States', 'USA', 'America'] },
  GB: { nameEn: 'United Kingdom', nameAr: t('auto.engines_countryNewsAnalyzer.109.029342e2', 'ar'), searchTerms: ['United Kingdom', 'UK', 'Britain'] },
  DE: { nameEn: 'Germany', nameAr: t('auto.engines_countryNewsAnalyzer.108.b47da9fb', 'ar'), searchTerms: ['Germany', 'Deutschland'] },
  FR: { nameEn: 'France', nameAr: t('auto.engines_countryNewsAnalyzer.107.36a1dc72', 'ar'), searchTerms: ['France', 'Paris'] },
  JP: { nameEn: 'Japan', nameAr: t('auto.engines_countryNewsAnalyzer.106.622a5ab0', 'ar'), searchTerms: ['Japan', 'Tokyo'] },
  CN: { nameEn: 'China', nameAr: t('auto.engines_countryNewsAnalyzer.105.b1664a7c', 'ar'), searchTerms: ['China', 'Beijing'] },
  IN: { nameEn: 'India', nameAr: t('auto.engines_countryNewsAnalyzer.104.1d85704e', 'ar'), searchTerms: ['India', 'Delhi'] },
  BR: { nameEn: 'Brazil', nameAr: t('auto.engines_countryNewsAnalyzer.103.57bcc508', 'ar'), searchTerms: ['Brazil', 'Brasilia'] },
  CA: { nameEn: 'Canada', nameAr: t('auto.engines_countryNewsAnalyzer.102.e5636dc6', 'ar'), searchTerms: ['Canada', 'Ottawa'] },
  AU: { nameEn: 'Australia', nameAr: t('auto.engines_countryNewsAnalyzer.101.f62c5d9c', 'ar'), searchTerms: ['Australia', 'Sydney'] },
  KR: { nameEn: 'South Korea', nameAr: t('auto.engines_countryNewsAnalyzer.100.958e4746', 'ar'), searchTerms: ['South Korea', 'Seoul'] },
  MX: { nameEn: 'Mexico', nameAr: t('auto.engines_countryNewsAnalyzer.99.bc09b260', 'ar'), searchTerms: ['Mexico'] },
  RU: { nameEn: 'Russia', nameAr: t('auto.engines_countryNewsAnalyzer.98.613c149d', 'ar'), searchTerms: ['Russia', 'Moscow'] },
  IT: { nameEn: 'Italy', nameAr: t('auto.engines_countryNewsAnalyzer.97.fd068e92', 'ar'), searchTerms: ['Italy', 'Rome'] },
  ES: { nameEn: 'Spain', nameAr: t('auto.engines_countryNewsAnalyzer.96.70535d0a', 'ar'), searchTerms: ['Spain', 'Madrid'] },
  NL: { nameEn: 'Netherlands', nameAr: t('auto.engines_countryNewsAnalyzer.95.abc22018', 'ar'), searchTerms: ['Netherlands', 'Amsterdam'] },
  SE: { nameEn: 'Sweden', nameAr: t('auto.engines_countryNewsAnalyzer.94.71f5d679', 'ar'), searchTerms: ['Sweden', 'Stockholm'] },
  CH: { nameEn: 'Switzerland', nameAr: t('auto.engines_countryNewsAnalyzer.93.068df957', 'ar'), searchTerms: ['Switzerland', 'Zurich'] },
  SG: { nameEn: 'Singapore', nameAr: t('auto.engines_countryNewsAnalyzer.92.c80c754b', 'ar'), searchTerms: ['Singapore'] },
  ID: { nameEn: 'Indonesia', nameAr: t('auto.engines_countryNewsAnalyzer.91.bc06cf13', 'ar'), searchTerms: ['Indonesia', 'Jakarta'] },
  TH: { nameEn: 'Thailand', nameAr: t('auto.engines_countryNewsAnalyzer.90.52c0e7d3', 'ar'), searchTerms: ['Thailand', 'Bangkok'] },
  MY: { nameEn: 'Malaysia', nameAr: t('auto.engines_countryNewsAnalyzer.89.2ac536fc', 'ar'), searchTerms: ['Malaysia', 'Kuala Lumpur'] },
  TR: { nameEn: 'Turkey', nameAr: t('auto.engines_countryNewsAnalyzer.88.dfac1e74', 'ar'), searchTerms: ['Turkey', 'Ankara'] },
  PS: { nameEn: 'Palestine', nameAr: t('auto.engines_countryNewsAnalyzer.87.1b5fbac6', 'ar'), searchTerms: ['Palestine', 'Gaza', t('auto.engines_countryNewsAnalyzer.86.1b5fbac6', 'ar')] },
  IQ: { nameEn: 'Iraq', nameAr: t('auto.engines_countryNewsAnalyzer.85.4b74973d', 'ar'), searchTerms: ['Iraq', 'Baghdad', t('auto.engines_countryNewsAnalyzer.84.4b74973d', 'ar')] },
  SY: { nameEn: 'Syria', nameAr: t('auto.engines_countryNewsAnalyzer.83.1166d28b', 'ar'), searchTerms: ['Syria', 'Damascus', t('auto.engines_countryNewsAnalyzer.82.1166d28b', 'ar')] },
  JO: { nameEn: 'Jordan', nameAr: t('auto.engines_countryNewsAnalyzer.81.bdd0aaf6', 'ar'), searchTerms: ['Jordan', 'Amman'] },
  LB: { nameEn: 'Lebanon', nameAr: t('auto.engines_countryNewsAnalyzer.80.aec612ef', 'ar'), searchTerms: ['Lebanon', 'Beirut', t('auto.engines_countryNewsAnalyzer.79.aec612ef', 'ar')] },
  MA: { nameEn: 'Morocco', nameAr: t('auto.engines_countryNewsAnalyzer.78.94b11d17', 'ar'), searchTerms: ['Morocco', 'Rabat'] },
  DZ: { nameEn: 'Algeria', nameAr: t('auto.engines_countryNewsAnalyzer.77.cd77976e', 'ar'), searchTerms: ['Algeria', 'Algiers'] },
  TN: { nameEn: 'Tunisia', nameAr: t('auto.engines_countryNewsAnalyzer.76.ba84e974', 'ar'), searchTerms: ['Tunisia', 'Tunis'] },
  SD: { nameEn: 'Sudan', nameAr: t('auto.engines_countryNewsAnalyzer.75.5becaf4c', 'ar'), searchTerms: ['Sudan', 'Khartoum', t('auto.engines_countryNewsAnalyzer.74.5becaf4c', 'ar')] },
  QA: { nameEn: 'Qatar', nameAr: t('auto.engines_countryNewsAnalyzer.73.76394460', 'ar'), searchTerms: ['Qatar', 'Doha'] },
  KW: { nameEn: 'Kuwait', nameAr: t('auto.engines_countryNewsAnalyzer.72.827e1566', 'ar'), searchTerms: ['Kuwait'] },
  BH: { nameEn: 'Bahrain', nameAr: t('auto.engines_countryNewsAnalyzer.71.2a0041a3', 'ar'), searchTerms: ['Bahrain', 'Manama'] },
  OM: { nameEn: 'Oman', nameAr: t('auto.engines_countryNewsAnalyzer.70.b7a2b1d1', 'ar'), searchTerms: ['Oman', 'Muscat'] },
  YE: { nameEn: 'Yemen', nameAr: t('auto.engines_countryNewsAnalyzer.69.0cdfe5e0', 'ar'), searchTerms: ['Yemen', 'Sanaa', t('auto.engines_countryNewsAnalyzer.68.0cdfe5e0', 'ar')] },
  ZA: { nameEn: 'South Africa', nameAr: t('auto.engines_countryNewsAnalyzer.67.f70dfc84', 'ar'), searchTerms: ['South Africa', 'Johannesburg'] },
  NG: { nameEn: 'Nigeria', nameAr: t('auto.engines_countryNewsAnalyzer.66.59c7a323', 'ar'), searchTerms: ['Nigeria', 'Lagos'] },
  KE: { nameEn: 'Kenya', nameAr: t('auto.engines_countryNewsAnalyzer.65.c55b6282', 'ar'), searchTerms: ['Kenya', 'Nairobi'] },
  PK: { nameEn: 'Pakistan', nameAr: t('auto.engines_countryNewsAnalyzer.64.8fc675b9', 'ar'), searchTerms: ['Pakistan', 'Islamabad'] },
  AR: { nameEn: 'Argentina', nameAr: t('auto.engines_countryNewsAnalyzer.63.22aa85e2', 'ar'), searchTerms: ['Argentina', 'Buenos Aires'] },
  CO: { nameEn: 'Colombia', nameAr: t('auto.engines_countryNewsAnalyzer.62.8ec01fa6', 'ar'), searchTerms: ['Colombia', 'Bogota'] },
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
  t('auto.engines_countryNewsAnalyzer.61.0f7f9f4a', 'ar'), t('auto.engines_countryNewsAnalyzer.60.5ef70e19', 'ar'), t('auto.engines_countryNewsAnalyzer.59.52d79bae', 'ar'), t('auto.engines_countryNewsAnalyzer.58.b80d3d91', 'ar'), t('auto.engines_countryNewsAnalyzer.57.854382ce', 'ar'), t('auto.engines_countryNewsAnalyzer.56.45c4dec3', 'ar'), t('auto.engines_countryNewsAnalyzer.55.12a171f3', 'ar'), t('auto.engines_countryNewsAnalyzer.54.d1ec9be1', 'ar'), t('auto.engines_countryNewsAnalyzer.53.43d891e1', 'ar'), t('auto.engines_countryNewsAnalyzer.52.6f820943', 'ar'), t('auto.engines_countryNewsAnalyzer.51.dfc15884', 'ar'), t('auto.engines_countryNewsAnalyzer.50.b2155e1c', 'ar'), t('auto.engines_countryNewsAnalyzer.49.393955e1', 'ar'),
];

const ECONOMIC_KEYWORDS = [
  'economy', 'economic', 'gdp', 'inflation', 'market', 'stock', 'trade', 'export', 'import', 'oil', 'gas', 'energy',
  'price', 'currency', 'dollar', 'bank', 'investment', 'debt', 'budget', 'tax', 'revenue', 'growth', 'recession',
  'business', 'company', 'industry', 'manufacturing', 'employment', 'unemployment', 'wage', 'cost',
  t('auto.engines_countryNewsAnalyzer.48.6d38c2ea', 'ar'), t('auto.engines_countryNewsAnalyzer.47.02782624', 'ar'), t('auto.engines_countryNewsAnalyzer.46.5fcef4c6', 'ar'), t('auto.engines_countryNewsAnalyzer.45.16c73be6', 'ar'), t('auto.engines_countryNewsAnalyzer.44.cb4d62bf', 'ar'), t('auto.engines_countryNewsAnalyzer.43.2efcd729', 'ar'), t('auto.engines_countryNewsAnalyzer.42.f879f70c', 'ar'), t('auto.engines_countryNewsAnalyzer.41.db2f097a', 'ar'), t('auto.engines_countryNewsAnalyzer.40.23163ab2', 'ar'), t('auto.engines_countryNewsAnalyzer.39.a09cec5c', 'ar'), t('auto.engines_countryNewsAnalyzer.38.8b8e7c7f', 'ar'), t('auto.engines_countryNewsAnalyzer.37.8cef45bf', 'ar'),
];

const SOCIAL_KEYWORDS = [
  'health', 'education', 'school', 'university', 'hospital', 'covid', 'vaccine', 'social', 'culture', 'festival',
  'sport', 'football', 'technology', 'internet', 'ai', 'climate', 'environment', 'water', 'food', 'housing',
  'women', 'youth', 'children', 'human rights', 'refugee', 'migration', 'community', 'religion',
  t('auto.engines_countryNewsAnalyzer.36.72c707a2', 'ar'), t('auto.engines_countryNewsAnalyzer.35.a0eee03f', 'ar'), t('auto.engines_countryNewsAnalyzer.34.44ee4b4e', 'ar'), t('auto.engines_countryNewsAnalyzer.33.7601e075', 'ar'), t('auto.engines_countryNewsAnalyzer.32.dc7cff7f', 'ar'), t('auto.engines_countryNewsAnalyzer.31.789f22ec', 'ar'), t('auto.engines_countryNewsAnalyzer.30.febaa7ea', 'ar'), t('auto.engines_countryNewsAnalyzer.29.8af22f7f', 'ar'), t('auto.engines_countryNewsAnalyzer.28.e204e82f', 'ar'), t('auto.engines_countryNewsAnalyzer.27.6d54e22b', 'ar'), t('auto.engines_countryNewsAnalyzer.26.3aa1ddb3', 'ar'),
];

const NEGATIVE_KEYWORDS = [
  'war', 'crisis', 'attack', 'kill', 'bomb', 'conflict', 'death', 'terror', 'threat', 'violence', 'crash',
  'collapse', 'disaster', 'emergency', 'strike', 'protest', 'riot', 'sanction', 'arrest', 'corruption',
  'recession', 'inflation', 'poverty', 'famine', 'drought', 'flood', 'earthquake', 'fire', 'explosion',
  t('auto.engines_countryNewsAnalyzer.25.b2155e1c', 'ar'), t('auto.engines_countryNewsAnalyzer.24.38a8a76e', 'ar'), t('auto.engines_countryNewsAnalyzer.23.56ea9530', 'ar'), t('auto.engines_countryNewsAnalyzer.22.bd80ed20', 'ar'), t('auto.engines_countryNewsAnalyzer.21.393955e1', 'ar'), t('auto.engines_countryNewsAnalyzer.20.ba42d7b3', 'ar'), t('auto.engines_countryNewsAnalyzer.19.dcdf69b3', 'ar'), t('auto.engines_countryNewsAnalyzer.18.e5f07bb2', 'ar'), t('auto.engines_countryNewsAnalyzer.17.417cc6aa', 'ar'), t('auto.engines_countryNewsAnalyzer.16.676d2f53', 'ar'), t('auto.engines_countryNewsAnalyzer.15.83b729ee', 'ar'), t('auto.engines_countryNewsAnalyzer.14.53db87c1', 'ar'), t('auto.engines_countryNewsAnalyzer.13.23a08748', 'ar'),
];

const POSITIVE_KEYWORDS = [
  'peace', 'growth', 'agreement', 'success', 'development', 'progress', 'reform', 'cooperation', 'partnership',
  'achievement', 'innovation', 'recovery', 'improve', 'boost', 'win', 'celebrate', 'launch', 'invest', 'build',
  t('auto.engines_countryNewsAnalyzer.12.fa65ac78', 'ar'), t('auto.engines_countryNewsAnalyzer.11.25e94d3e', 'ar'), t('auto.engines_countryNewsAnalyzer.10.48d894f8', 'ar'), t('auto.engines_countryNewsAnalyzer.9.2eb748dc', 'ar'), t('auto.engines_countryNewsAnalyzer.8.f71e38ed', 'ar'), t('auto.engines_countryNewsAnalyzer.7.b5d1b567', 'ar'), t('auto.engines_countryNewsAnalyzer.6.9070c794', 'ar'), t('auto.engines_countryNewsAnalyzer.5.6518d363', 'ar'), t('auto.engines_countryNewsAnalyzer.4.b518b9b3', 'ar'), t('auto.engines_countryNewsAnalyzer.3.c24d8d6c', 'ar'), t('auto.engines_countryNewsAnalyzer.2.24748545', 'ar'), t('auto.engines_countryNewsAnalyzer.1.ab4c7e3d', 'ar'),
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
      summaryAr: result.summaryAr || `   ${meta?.nameAr || countryCode}   ${news.length} .`,
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
    summaryAr: ` ${news.length}   ${meta?.nameAr || countryCode}. ${positiveCount}  ${negativeCount}  ${total - positiveCount - negativeCount} .`,
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
      summaryAr: `     ${meta.nameAr}.`,
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
