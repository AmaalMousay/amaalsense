/**
 * News Compression Layer
 * 
 * Compresses news articles from full text to structured summaries
 * Reduces data size by ~80% while preserving semantic meaning
 */

export interface CompressedNews {
  originalLength: number;
  compressedLength: number;
  compressionRatio: number;
  mainIdea: string;
  cause: string;
  emotion: string;
  topic: string;
  region: string;
  intensity: number;
  confidence: number;
}

export interface NewsCompressionResult {
  success: boolean;
  compressed: CompressedNews;
  originalText: string;
  error?: string;
}

/**
 * Extract main idea from news text
 */
function extractMainIdea(text: string): string {
  // Take first 2-3 sentences as main idea
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(' ').trim();
}

/**
 * Identify cause/reason from text
 */
function identifyCause(text: string): string {
  const causePatterns = [
    /(?:because|due to|caused by|as a result of|owing to)\s+([^.!?]+)/gi,
    /(?:reason|cause|factor)\s*(?:is|are|was|were)\s+([^.!?]+)/gi,
    /(?:due|caused)\s+by\s+([^.!?]+)/gi,
  ];
  
  for (const pattern of causePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1]?.trim() || 'Unknown cause';
    }
  }
  
  return 'Unknown cause';
}

/**
 * Detect dominant emotion from text
 */
function detectEmotion(text: string): string {
  const emotionKeywords = {
    joy: ['happy', 'joy', 'celebrate', 'success', 'positive', 'improvement', 'growth'],
    fear: ['fear', 'worry', 'concern', 'threat', 'danger', 'crisis', 'risk'],
    anger: ['anger', 'angry', 'furious', 'outrage', 'protest', 'conflict'],
    sadness: ['sad', 'grief', 'loss', 'decline', 'suffering', 'tragedy'],
    hope: ['hope', 'optimism', 'recovery', 'improvement', 'potential'],
    curiosity: ['question', 'investigation', 'research', 'discovery', 'explore'],
  };
  
  const lowerText = text.toLowerCase();
  const emotionScores: Record<string, number> = {};
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    emotionScores[emotion] = keywords.filter(kw => lowerText.includes(kw)).length;
  }
  
  const dominantEmotion = Object.entries(emotionScores).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];
  
  return dominantEmotion || 'neutral';
}

/**
 * Classify topic from text
 */
function classifyTopic(text: string): string {
  const topicKeywords = {
    economy: ['economy', 'market', 'trade', 'inflation', 'gdp', 'business', 'price', 'currency'],
    politics: ['government', 'election', 'political', 'parliament', 'minister', 'policy'],
    conflict: ['war', 'conflict', 'violence', 'attack', 'military', 'armed'],
    society: ['social', 'community', 'people', 'culture', 'society', 'protest'],
    health: ['health', 'disease', 'pandemic', 'medical', 'hospital', 'virus'],
    environment: ['climate', 'environment', 'pollution', 'green', 'carbon', 'nature'],
    technology: ['technology', 'digital', 'ai', 'software', 'innovation', 'tech'],
    culture: ['culture', 'art', 'music', 'film', 'literature', 'entertainment'],
  };
  
  const lowerText = text.toLowerCase();
  const topicScores: Record<string, number> = {};
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    topicScores[topic] = keywords.filter(kw => lowerText.includes(kw)).length;
  }
  
  const dominantTopic = Object.entries(topicScores).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];
  
  return dominantTopic || 'other';
}

/**
 * Identify region from text
 */
function identifyRegion(text: string): string {
  const regionKeywords = {
    mena: ['middle east', 'north africa', 'arab', 'gulf', 'saudi', 'egypt', 'libya', 'uae', 'iran', 'iraq', 'syria', 'yemen'],
    europe: ['europe', 'european', 'uk', 'france', 'germany', 'italy', 'spain', 'russia', 'ukraine'],
    asia: ['asia', 'china', 'japan', 'india', 'korea', 'thailand', 'vietnam', 'singapore'],
    americas: ['america', 'usa', 'canada', 'mexico', 'brazil', 'argentina'],
    africa: ['africa', 'african', 'south africa', 'nigeria', 'kenya', 'ethiopia'],
    oceania: ['australia', 'new zealand', 'oceania'],
  };
  
  const lowerText = text.toLowerCase();
  const regionScores: Record<string, number> = {};
  
  for (const [region, keywords] of Object.entries(regionKeywords)) {
    regionScores[region] = keywords.filter(kw => lowerText.includes(kw)).length;
  }
  
  const dominantRegion = Object.entries(regionScores).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];
  
  return dominantRegion || 'global';
}

/**
 * Calculate intensity (0-1) from text
 */
function calculateIntensity(text: string): number {
  // Count intensity keywords
  const intensityKeywords = {
    critical: ['critical', 'severe', 'catastrophic', 'devastating', 'extreme'],
    high: ['significant', 'major', 'serious', 'important', 'urgent'],
    medium: ['notable', 'considerable', 'substantial', 'marked'],
    low: ['minor', 'slight', 'modest', 'small'],
  };
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  for (const keyword of intensityKeywords.critical) {
    if (lowerText.includes(keyword)) score += 0.25;
  }
  for (const keyword of intensityKeywords.high) {
    if (lowerText.includes(keyword)) score += 0.15;
  }
  for (const keyword of intensityKeywords.medium) {
    if (lowerText.includes(keyword)) score += 0.1;
  }
  
  return Math.min(1, score);
}

/**
 * Compress news article
 */
export function compressNews(newsText: string): NewsCompressionResult {
  try {
    if (!newsText || newsText.length === 0) {
      return {
        success: false,
        error: 'Empty news text',
        originalText: newsText,
        compressed: {} as CompressedNews,
      };
    }
    
    const mainIdea = extractMainIdea(newsText);
    const cause = identifyCause(newsText);
    const emotion = detectEmotion(newsText);
    const topic = classifyTopic(newsText);
    const region = identifyRegion(newsText);
    const intensity = calculateIntensity(newsText);
    
    // Confidence is based on how much we could extract
    const confidence = Math.min(1, (
      (mainIdea.length > 0 ? 0.2 : 0) +
      (cause !== 'Unknown cause' ? 0.2 : 0) +
      (emotion !== 'neutral' ? 0.2 : 0) +
      (topic !== 'other' ? 0.2 : 0) +
      (region !== 'global' ? 0.2 : 0)
    ));
    
    const compressed: CompressedNews = {
      originalLength: newsText.length,
      compressedLength: (mainIdea + cause + emotion + topic + region).length,
      compressionRatio: (mainIdea + cause + emotion + topic + region).length / newsText.length,
      mainIdea,
      cause,
      emotion,
      topic,
      region,
      intensity,
      confidence,
    };
    
    return {
      success: true,
      compressed,
      originalText: newsText,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      originalText: newsText,
      compressed: {} as CompressedNews,
    };
  }
}

/**
 * Batch compress multiple news articles
 */
export function compressNewsBatch(newsArticles: string[]): NewsCompressionResult[] {
  return newsArticles.map(article => compressNews(article));
}

/**
 * Get compression statistics
 */
export function getCompressionStats(results: NewsCompressionResult[]): {
  totalArticles: number;
  successfulCompressions: number;
  averageCompressionRatio: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageConfidence: number;
} {
  const successful = results.filter(r => r.success);
  
  const totalOriginalSize = successful.reduce((sum, r) => sum + r.compressed.originalLength, 0);
  const totalCompressedSize = successful.reduce((sum, r) => sum + r.compressed.compressedLength, 0);
  const averageCompressionRatio = successful.length > 0 
    ? successful.reduce((sum, r) => sum + r.compressed.compressionRatio, 0) / successful.length
    : 0;
  const averageConfidence = successful.length > 0
    ? successful.reduce((sum, r) => sum + r.compressed.confidence, 0) / successful.length
    : 0;
  
  return {
    totalArticles: results.length,
    successfulCompressions: successful.length,
    averageCompressionRatio,
    totalOriginalSize,
    totalCompressedSize,
    averageConfidence,
  };
}

/**
 * Format compressed news for display
 */
export function formatCompressedNews(compressed: CompressedNews): string {
  return `
═══════════════════════════════════════════════════════════════
                    COMPRESSED NEWS
═══════════════════════════════════════════════════════════════

Main Idea:
${compressed.mainIdea}

Cause:
${compressed.cause}

Emotion: ${compressed.emotion.toUpperCase()}
Topic: ${compressed.topic.toUpperCase()}
Region: ${compressed.region.toUpperCase()}

Intensity: ${(compressed.intensity * 100).toFixed(0)}%
Confidence: ${(compressed.confidence * 100).toFixed(0)}%

Compression Ratio: ${(compressed.compressionRatio * 100).toFixed(1)}%
Original: ${compressed.originalLength} chars → Compressed: ${compressed.compressedLength} chars

═══════════════════════════════════════════════════════════════
  `.trim();
}
