/**
 * EVENT VECTOR ENGINE
 * 
 * Converts raw collected data into compressed EventVector format.
 * This dramatically reduces token usage when sending to LLM:
 * - Raw data: ~15,000-50,000 tokens
 * - EventVector: ~300-500 tokens
 * 
 * Flow: CollectedData → EventVector → LLM (efficient)
 */

import type { CollectedData, RawDataItem } from './unifiedDataCollector';

// ============================================================
// EVENT VECTOR TYPE (simplified, practical version)
// ============================================================

export interface EventVector {
  // Context
  query: string;
  queryType: 'country' | 'topic' | 'question';
  countryCode?: string;
  timestamp: number;
  
  // Data summary (compressed)
  totalItems: number;
  sourceBreakdown: Record<string, number>; // platform → count
  
  // Emotion scores (0-1)
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  
  // Indices
  polarity: number;      // -1 (very negative) to +1 (very positive)
  intensity: number;      // 0-1 how strong the emotions are
  uncertainty: number;    // 0-1 how uncertain/mixed the signals are
  
  // Categories
  categories: {
    political: number;
    economic: number;
    social: number;
    conflict: number;
    health: number;
    technology: number;
    environment: number;
  };
  dominantCategory: string;
  
  // Compressed headlines (top 8 most important, title only)
  topHeadlines: Array<{
    title: string;
    source: string;
    category: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }>;
  
  // Trending keywords extracted from titles
  trendingKeywords: string[];
}

// ============================================================
// KEYWORD-BASED ANALYSIS (no LLM needed)
// ============================================================

// Category keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  political: [
    'election', 'president', 'government', 'parliament', 'minister', 'political', 'vote', 'democracy',
    'opposition', 'party', 'law', 'legislation', 'congress', 'senate', 'diplomat', 'embassy',
    'انتخاب', 'رئيس', 'حكومة', 'برلمان', 'وزير', 'سياس', 'تصويت', 'ديمقراط', 'حزب', 'قانون',
  ],
  economic: [
    'economy', 'economic', 'market', 'stock', 'trade', 'inflation', 'gdp', 'bank', 'finance',
    'investment', 'currency', 'oil', 'price', 'business', 'tax', 'debt', 'growth',
    'اقتصاد', 'سوق', 'تجار', 'تضخم', 'بنك', 'مال', 'استثمار', 'عملة', 'نفط', 'سعر', 'ضريب',
  ],
  conflict: [
    'war', 'attack', 'military', 'bomb', 'conflict', 'violence', 'terror', 'army', 'weapon',
    'missile', 'strike', 'battle', 'killed', 'death', 'ceasefire', 'troops',
    'حرب', 'هجوم', 'عسكر', 'قصف', 'صراع', 'عنف', 'إرهاب', 'جيش', 'سلاح', 'صاروخ', 'قتل', 'وقف إطلاق',
  ],
  social: [
    'social', 'community', 'protest', 'rights', 'education', 'health', 'culture', 'women',
    'youth', 'migration', 'refugee', 'poverty', 'housing', 'employment',
    'اجتماع', 'مجتمع', 'احتجاج', 'حقوق', 'تعليم', 'صحة', 'ثقاف', 'نساء', 'شباب', 'هجرة', 'لاجئ', 'فقر',
  ],
  health: [
    'health', 'hospital', 'disease', 'vaccine', 'covid', 'pandemic', 'medical', 'doctor',
    'صح', 'مستشفى', 'مرض', 'لقاح', 'وباء', 'طب', 'طبيب',
  ],
  technology: [
    'technology', 'tech', 'ai', 'digital', 'internet', 'software', 'cyber', 'innovation',
    'تكنولوج', 'تقن', 'ذكاء اصطناعي', 'رقم', 'إنترنت', 'ابتكار',
  ],
  environment: [
    'climate', 'environment', 'pollution', 'energy', 'renewable', 'carbon', 'flood', 'drought',
    'مناخ', 'بيئة', 'تلوث', 'طاقة', 'متجدد', 'كربون', 'فيضان', 'جفاف',
  ],
};

// Sentiment keywords
const SENTIMENT_KEYWORDS = {
  positive: [
    'success', 'growth', 'peace', 'agreement', 'improve', 'progress', 'hope', 'win', 'achieve',
    'celebrate', 'positive', 'boost', 'recovery', 'breakthrough', 'support',
    'نجاح', 'نمو', 'سلام', 'اتفاق', 'تحسن', 'تقدم', 'أمل', 'فوز', 'إنجاز', 'دعم', 'تعاف',
  ],
  negative: [
    'crisis', 'fail', 'attack', 'death', 'kill', 'war', 'conflict', 'threat', 'danger',
    'collapse', 'disaster', 'fear', 'violence', 'corruption', 'decline', 'suffer',
    'أزمة', 'فشل', 'هجوم', 'موت', 'قتل', 'حرب', 'صراع', 'تهديد', 'خطر', 'انهيار', 'كارثة', 'عنف', 'فساد',
  ],
};

function categorizeItem(item: RawDataItem): string {
  const text = `${item.title} ${item.description}`.toLowerCase();
  let bestCategory = 'social';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  
  for (const word of SENTIMENT_KEYWORDS.positive) {
    if (lower.includes(word)) positiveScore++;
  }
  for (const word of SENTIMENT_KEYWORDS.negative) {
    if (lower.includes(word)) negativeScore++;
  }
  
  if (positiveScore > negativeScore + 1) return 'positive';
  if (negativeScore > positiveScore + 1) return 'negative';
  return 'neutral';
}

function extractKeywords(items: RawDataItem[]): string[] {
  const wordFreq = new Map<string, number>();
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are',
    'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its',
    'and', 'or', 'but', 'not', 'no', 'so', 'if', 'then', 'than', 'as', 'up', 'out', 'about',
    'after', 'before', 'new', 'says', 'said', 'also', 'more', 'over', 'into', 'how', 'what',
    'when', 'where', 'who', 'which', 'why', 'all', 'each', 'every', 'both', 'few', 'most',
    'other', 'some', 'such', 'only', 'own', 'same', 'just', 'now', 'very', 'here', 'there',
    'من', 'في', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي', 'التي',
    'أن', 'لا', 'ما', 'هو', 'هي', 'كان', 'كانت', 'قد', 'بعد', 'قبل', 'بين', 'حتى', 'أو',
  ]);
  
  for (const item of items) {
    const words = item.title.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, '').split(/\s+/);
    for (const word of words) {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }
  }
  
  return Array.from(wordFreq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// ============================================================
// MAIN: Convert CollectedData → EventVector
// ============================================================

/**
 * Convert raw collected data into a compressed EventVector
 * This is pure computation - NO LLM calls needed
 */
export function createEventVector(data: CollectedData): EventVector {
  const items = data.items;
  
  // 1. Categorize each item
  const categorizedItems = items.map(item => ({
    ...item,
    category: categorizeItem(item),
    sentiment: analyzeSentiment(`${item.title} ${item.description}`),
  }));
  
  // 2. Count categories
  const categories = {
    political: 0, economic: 0, social: 0, conflict: 0,
    health: 0, technology: 0, environment: 0,
  };
  for (const item of categorizedItems) {
    if (item.category in categories) {
      categories[item.category as keyof typeof categories]++;
    }
  }
  
  // Normalize categories to 0-1
  const totalItems = Math.max(items.length, 1);
  const normalizedCategories = Object.fromEntries(
    Object.entries(categories).map(([k, v]) => [k, v / totalItems])
  ) as typeof categories;
  
  // 3. Find dominant category
  const dominantCategory = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'social';
  
  // 4. Calculate sentiment distribution
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  for (const item of categorizedItems) {
    if (item.sentiment === 'positive') positiveCount++;
    else if (item.sentiment === 'negative') negativeCount++;
    else neutralCount++;
  }
  
  // 5. Calculate emotion scores from sentiment + categories
  const negativeRatio = negativeCount / totalItems;
  const positiveRatio = positiveCount / totalItems;
  const conflictRatio = categories.conflict / totalItems;
  const economicRatio = categories.economic / totalItems;
  
  const emotions = {
    joy: Math.min(1, positiveRatio * 1.5),
    fear: Math.min(1, negativeRatio * 0.8 + conflictRatio * 0.5),
    anger: Math.min(1, conflictRatio * 1.2 + negativeRatio * 0.3),
    sadness: Math.min(1, negativeRatio * 0.6 + conflictRatio * 0.3),
    hope: Math.min(1, positiveRatio * 1.2 + economicRatio * 0.2),
    curiosity: Math.min(1, 0.3 + (categories.technology / totalItems) * 0.5),
  };
  
  // 6. Find dominant emotion
  const dominantEmotion = Object.entries(emotions)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'curiosity';
  
  // 7. Calculate indices
  const polarity = (positiveCount - negativeCount) / totalItems; // -1 to +1
  const intensity = Math.min(1, (positiveCount + negativeCount) / totalItems); // 0-1
  const uncertainty = neutralCount / totalItems; // 0-1
  
  // 8. Select top headlines (most representative)
  const topHeadlines = categorizedItems
    .sort((a, b) => {
      // Prioritize: news > social, longer descriptions first
      const typeScore = (a.sourceType === 'news' ? 1 : 0) - (b.sourceType === 'news' ? 1 : 0);
      if (typeScore !== 0) return -typeScore;
      return (b.description?.length || 0) - (a.description?.length || 0);
    })
    .slice(0, 8)
    .map(item => ({
      title: item.title.slice(0, 120),
      source: item.source,
      category: item.category,
      sentiment: item.sentiment,
    }));
  
  // 9. Extract trending keywords
  const trendingKeywords = extractKeywords(items);
  
  // 10. Source breakdown
  const sourceBreakdown: Record<string, number> = {};
  for (const item of items) {
    sourceBreakdown[item.platform] = (sourceBreakdown[item.platform] || 0) + 1;
  }
  
  return {
    query: data.query,
    queryType: data.queryType,
    countryCode: data.countryCode,
    timestamp: data.fetchedAt,
    totalItems: items.length,
    sourceBreakdown,
    emotions,
    dominantEmotion,
    polarity,
    intensity,
    uncertainty,
    categories: normalizedCategories,
    dominantCategory,
    topHeadlines,
    trendingKeywords,
  };
}

// ============================================================
// EVENT VECTOR → LLM PROMPT (compressed format)
// ============================================================

/**
 * Convert EventVector to a compact text format for LLM (~300-500 tokens)
 */
export function eventVectorToPrompt(vector: EventVector, language: string = 'ar'): string {
  const emotionsList = Object.entries(vector.emotions)
    .filter(([, v]) => v > 0.1)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
    .join(', ');
  
  const categoryList = Object.entries(vector.categories)
    .filter(([, v]) => v > 0.05)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
    .join(', ');
  
  const headlines = vector.topHeadlines
    .map((h, i) => `${i + 1}. [${h.sentiment}/${h.category}] ${h.title}`)
    .join('\n');
  
  const keywords = vector.trendingKeywords.join(', ');
  
  if (language === 'ar') {
    return `بيانات تحليل المشاعر المضغوطة:
الاستعلام: ${vector.query} (${vector.queryType})
المصادر: ${vector.totalItems} عنصر من ${Object.keys(vector.sourceBreakdown).length} منصة
القطبية: ${vector.polarity > 0 ? 'إيجابي' : vector.polarity < -0.2 ? 'سلبي' : 'محايد'} (${(vector.polarity * 100).toFixed(0)}%)
الشدة: ${(vector.intensity * 100).toFixed(0)}%
العاطفة السائدة: ${vector.dominantEmotion}
المشاعر: ${emotionsList}
التصنيف السائد: ${vector.dominantCategory}
التصنيفات: ${categoryList}
الكلمات الرائجة: ${keywords}

أهم العناوين:
${headlines}`;
  }
  
  return `Compressed Sentiment Analysis Data:
Query: ${vector.query} (${vector.queryType})
Sources: ${vector.totalItems} items from ${Object.keys(vector.sourceBreakdown).length} platforms
Polarity: ${vector.polarity > 0 ? 'Positive' : vector.polarity < -0.2 ? 'Negative' : 'Neutral'} (${(vector.polarity * 100).toFixed(0)}%)
Intensity: ${(vector.intensity * 100).toFixed(0)}%
Dominant Emotion: ${vector.dominantEmotion}
Emotions: ${emotionsList}
Dominant Category: ${vector.dominantCategory}
Categories: ${categoryList}
Trending Keywords: ${keywords}

Top Headlines:
${headlines}`;
}

/**
 * Estimate token count for an EventVector prompt
 */
export function estimateTokens(vector: EventVector): number {
  const prompt = eventVectorToPrompt(vector);
  return Math.ceil(prompt.length / 4); // ~4 chars per token
}

// ============================================================
// UTILITY: Convert EventVector to map indices (GMI/CFI/HRI)
// ============================================================

/**
 * Convert EventVector to map-compatible indices
 * GMI: General Mood Index (-100 to +100)
 * CFI: Conflict/Fear Index (0-100)
 * HRI: Hope/Recovery Index (0-100)
 */
export function vectorToMapIndices(vector: EventVector): {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  isRealData: boolean;
} {
  const gmi = Math.round(vector.polarity * 100);
  const cfi = Math.round((vector.emotions.fear + vector.emotions.anger) / 2 * 100);
  const hri = Math.round((vector.emotions.hope + vector.emotions.joy) / 2 * 100);
  
  return {
    gmi,
    cfi,
    hri,
    dominantEmotion: vector.dominantEmotion,
    isRealData: vector.totalItems > 0,
  };
}
