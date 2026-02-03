/**
 * Layer 2: Signal Filtering Engine (Attention)
 * 
 * In Human Brain: Selects what's important from sensory input
 * In AmalSense: Filters noise, identifies trends, prioritizes relevance
 * 
 * This is the "filter of consciousness" - decides what deserves attention
 */

// Input signal from data sources
export interface RawSignal {
  id: string;
  source: 'news' | 'social' | 'market' | 'user';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Filtered signal with attention score
export interface AttentionSignal {
  original: RawSignal;
  attentionScore: number;      // 0-1: how important is this?
  relevanceScore: number;      // 0-1: how relevant to current context?
  noveltyScore: number;        // 0-1: how new/unique is this?
  emotionalWeight: number;     // 0-1: emotional significance
  category: SignalCategory;
  keywords: string[];
  isNoise: boolean;
}

export type SignalCategory = 
  | 'economic'
  | 'political'
  | 'social'
  | 'media'
  | 'market'
  | 'personal'
  | 'general';

// Attention filter configuration
interface AttentionConfig {
  noiseThreshold: number;      // Below this = noise
  relevanceBoost: number;      // Boost for relevant signals
  recencyWeight: number;       // How much recency matters
  emotionalWeight: number;     // How much emotion matters
}

const DEFAULT_CONFIG: AttentionConfig = {
  noiseThreshold: 0.3,
  relevanceBoost: 1.5,
  recencyWeight: 0.3,
  emotionalWeight: 0.4
};

/**
 * Main attention filter - decides what deserves focus
 */
export function filterSignals(
  signals: RawSignal[],
  currentContext?: string,
  config: AttentionConfig = DEFAULT_CONFIG
): AttentionSignal[] {
  const filtered: AttentionSignal[] = [];
  const seenContent = new Set<string>();
  
  for (const signal of signals) {
    // Skip duplicates
    const contentHash = hashContent(signal.content);
    if (seenContent.has(contentHash)) continue;
    seenContent.add(contentHash);
    
    // Calculate attention scores
    const attentionSignal = calculateAttention(signal, currentContext, config);
    
    // Filter noise
    if (!attentionSignal.isNoise) {
      filtered.push(attentionSignal);
    }
  }
  
  // Sort by attention score (most important first)
  return filtered.sort((a, b) => b.attentionScore - a.attentionScore);
}

/**
 * Calculate attention scores for a signal
 */
function calculateAttention(
  signal: RawSignal,
  currentContext?: string,
  config: AttentionConfig = DEFAULT_CONFIG
): AttentionSignal {
  const content = signal.content.toLowerCase();
  
  // Extract keywords
  const keywords = extractKeywords(content);
  
  // Detect category
  const category = detectCategory(content, keywords);
  
  // Calculate relevance to current context
  const relevanceScore = currentContext 
    ? calculateRelevance(content, currentContext)
    : 0.5;
  
  // Calculate novelty (how unique/new)
  const noveltyScore = calculateNovelty(content, keywords);
  
  // Calculate emotional weight
  const emotionalWeight = calculateEmotionalWeight(content);
  
  // Calculate recency score
  const recencyScore = calculateRecency(signal.timestamp);
  
  // Combined attention score
  const attentionScore = (
    relevanceScore * config.relevanceBoost * 0.3 +
    noveltyScore * 0.2 +
    emotionalWeight * config.emotionalWeight +
    recencyScore * config.recencyWeight
  );
  
  // Is this noise?
  const isNoise = attentionScore < config.noiseThreshold || isNoiseContent(content);
  
  return {
    original: signal,
    attentionScore: Math.min(1, attentionScore),
    relevanceScore,
    noveltyScore,
    emotionalWeight,
    category,
    keywords,
    isNoise
  };
}

/**
 * Extract keywords from content
 */
function extractKeywords(content: string): string[] {
  const keywords: string[] = [];
  
  // Economic keywords
  const economicWords = ['دولار', 'ذهب', 'فضة', 'نفط', 'سوق', 'بورصة', 'أسهم', 'فائدة', 'تضخم', 'ركود'];
  // Political keywords
  const politicalWords = ['حكومة', 'رئيس', 'انتخابات', 'برلمان', 'سياسة', 'حرب', 'صراع', 'اتفاق'];
  // Social keywords
  const socialWords = ['مجتمع', 'شباب', 'تعليم', 'صحة', 'بطالة', 'فقر', 'هجرة'];
  // Media keywords
  const mediaWords = ['إعلام', 'أخبار', 'صحافة', 'تلفزيون', 'سوشيال', 'فيسبوك', 'تويتر'];
  // Emotional keywords
  const emotionalWords = ['خوف', 'أمل', 'قلق', 'تفاؤل', 'غضب', 'حزن', 'فرح', 'صدمة'];
  
  const allKeywords = [
    ...economicWords, ...politicalWords, ...socialWords, 
    ...mediaWords, ...emotionalWords
  ];
  
  for (const word of allKeywords) {
    if (content.includes(word)) {
      keywords.push(word);
    }
  }
  
  return keywords;
}

/**
 * Detect signal category
 */
function detectCategory(content: string, keywords: string[]): SignalCategory {
  const categoryScores: Record<SignalCategory, number> = {
    economic: 0,
    political: 0,
    social: 0,
    media: 0,
    market: 0,
    personal: 0,
    general: 0
  };
  
  // Economic indicators
  if (['دولار', 'ذهب', 'فضة', 'نفط', 'فائدة', 'تضخم'].some(w => content.includes(w))) {
    categoryScores.economic += 2;
  }
  if (['سوق', 'بورصة', 'أسهم', 'تداول'].some(w => content.includes(w))) {
    categoryScores.market += 2;
  }
  
  // Political indicators
  if (['حكومة', 'رئيس', 'انتخابات', 'سياسة', 'حرب'].some(w => content.includes(w))) {
    categoryScores.political += 2;
  }
  
  // Social indicators
  if (['مجتمع', 'شباب', 'تعليم', 'صحة', 'بطالة'].some(w => content.includes(w))) {
    categoryScores.social += 2;
  }
  
  // Media indicators
  if (['إعلام', 'أخبار', 'صحافة', 'سوشيال'].some(w => content.includes(w))) {
    categoryScores.media += 2;
  }
  
  // Find highest category
  let maxCategory: SignalCategory = 'general';
  let maxScore = 0;
  
  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = cat as SignalCategory;
    }
  }
  
  return maxCategory;
}

/**
 * Calculate relevance to current context
 */
function calculateRelevance(content: string, context: string): number {
  const contentWords = new Set(content.split(/\s+/));
  const contextWords = context.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word of contextWords) {
    if (contentWords.has(word) && word.length > 2) {
      matches++;
    }
  }
  
  return Math.min(1, matches / Math.max(1, contextWords.length) * 2);
}

/**
 * Calculate novelty score
 */
function calculateNovelty(content: string, keywords: string[]): number {
  // More keywords = more specific = more novel
  const keywordScore = Math.min(1, keywords.length / 5);
  
  // Longer content = potentially more novel
  const lengthScore = Math.min(1, content.length / 500);
  
  return (keywordScore * 0.6 + lengthScore * 0.4);
}

/**
 * Calculate emotional weight of content
 */
function calculateEmotionalWeight(content: string): number {
  let weight = 0;
  
  // Strong negative emotions
  if (['خوف', 'قلق', 'ذعر', 'انهيار', 'كارثة', 'أزمة'].some(w => content.includes(w))) {
    weight += 0.4;
  }
  
  // Strong positive emotions
  if (['أمل', 'تفاؤل', 'انتعاش', 'نمو', 'ارتفاع'].some(w => content.includes(w))) {
    weight += 0.3;
  }
  
  // Uncertainty emotions
  if (['حيرة', 'تردد', 'غموض', 'عدم يقين'].some(w => content.includes(w))) {
    weight += 0.2;
  }
  
  // Urgency markers
  if (['عاجل', 'الآن', 'فوراً', 'خطير', 'تحذير'].some(w => content.includes(w))) {
    weight += 0.3;
  }
  
  return Math.min(1, weight);
}

/**
 * Calculate recency score
 */
function calculateRecency(timestamp: Date): number {
  const now = new Date();
  const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff < 1) return 1;
  if (hoursDiff < 6) return 0.9;
  if (hoursDiff < 24) return 0.7;
  if (hoursDiff < 72) return 0.5;
  if (hoursDiff < 168) return 0.3;
  return 0.1;
}

/**
 * Check if content is noise
 */
function isNoiseContent(content: string): boolean {
  // Too short
  if (content.length < 10) return true;
  
  // Spam patterns
  const spamPatterns = [
    /^https?:\/\//,
    /اضغط هنا/,
    /تابعنا/,
    /اشترك/,
    /رابط/
  ];
  
  return spamPatterns.some(p => p.test(content));
}

/**
 * Simple content hash for duplicate detection
 */
function hashContent(content: string): string {
  // Simple hash based on first 100 chars normalized
  const normalized = content.toLowerCase().replace(/\s+/g, ' ').slice(0, 100);
  return normalized;
}

/**
 * Get top N signals by attention
 */
export function getTopSignals(
  signals: AttentionSignal[],
  n: number = 10
): AttentionSignal[] {
  return signals.slice(0, n);
}

/**
 * Get signals by category
 */
export function getSignalsByCategory(
  signals: AttentionSignal[],
  category: SignalCategory
): AttentionSignal[] {
  return signals.filter(s => s.category === category);
}

/**
 * Summarize attention distribution
 */
export function summarizeAttention(signals: AttentionSignal[]): {
  totalSignals: number;
  noiseFiltered: number;
  categoryDistribution: Record<SignalCategory, number>;
  averageAttention: number;
  topKeywords: string[];
} {
  const categoryDistribution: Record<SignalCategory, number> = {
    economic: 0,
    political: 0,
    social: 0,
    media: 0,
    market: 0,
    personal: 0,
    general: 0
  };
  
  const allKeywords: string[] = [];
  let totalAttention = 0;
  
  for (const signal of signals) {
    categoryDistribution[signal.category]++;
    allKeywords.push(...signal.keywords);
    totalAttention += signal.attentionScore;
  }
  
  // Count keyword frequency
  const keywordCounts = new Map<string, number>();
  for (const kw of allKeywords) {
    keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
  }
  
  // Get top keywords
  const topKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);
  
  return {
    totalSignals: signals.length,
    noiseFiltered: 0, // Would need original count
    categoryDistribution,
    averageAttention: signals.length > 0 ? totalAttention / signals.length : 0,
    topKeywords
  };
}
