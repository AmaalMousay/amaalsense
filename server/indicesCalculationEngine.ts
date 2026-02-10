/**
 * Indices Calculation Engine
 * 
 * Calculates GMI (Global Mood Index), CFI (Collective Fear Index), and HRI (Hope & Resilience Index)
 * from REAL DATA collected from multiple sources, NOT from hardcoded multipliers.
 * 
 * Formula:
 * GMI = (Positive Emotions - Negative Emotions) / Total Emotions
 * CFI = Fear Sentiment / Total Sentiment
 * HRI = Hope Sentiment / Total Sentiment
 * 
 * Data sources:
 * - News articles (weighted by credibility)
 * - Social media sentiment
 * - Historical trends
 * - Cultural context
 */

export interface NewsArticle {
  title: string;
  content: string;
  source: string;
  date: Date;
  credibilityScore: number; // 0-1
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
}

export interface SocialMediaData {
  platform: string;
  sentiment: number; // -1 to +1
  emotionScores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  volume: number; // number of posts
  engagement: number; // likes, shares, etc.
}

export interface CalculationInput {
  newsArticles: NewsArticle[];
  socialMediaData?: SocialMediaData[];
  topic: string;
  country: string;
  timeframe?: 'today' | 'week' | 'month';
}

export interface CalculationOutput {
  gmi: number; // -100 to +100
  cfi: number; // 0 to 100
  hri: number; // 0 to 100
  confidence: number; // 0 to 1
  sources: {
    newsCount: number;
    socialMediaCount: number;
    averageCredibility: number;
  };
  breakdown: {
    positiveEmotions: number;
    negativeEmotions: number;
    fearSentiment: number;
    hopeSentiment: number;
  };
}

/**
 * Calculate GMI (Global Mood Index) from news articles
 * 
 * Formula: GMI = (Positive Emotions - Negative Emotions) / Total Emotions * 100
 * Range: -100 (very negative) to +100 (very positive)
 */
export function calculateGMI(articles: NewsArticle[]): number {
  if (articles.length === 0) return 0;

  let totalPositive = 0;
  let totalNegative = 0;
  let totalWeight = 0;

  for (const article of articles) {
    // Weight by credibility score
    const weight = article.credibilityScore;
    
    // Positive emotions
    const positive = (article.emotions.joy + article.emotions.hope + article.emotions.curiosity) / 3;
    totalPositive += positive * weight;
    
    // Negative emotions
    const negative = (article.emotions.fear + article.emotions.anger + article.emotions.sadness) / 3;
    totalNegative += negative * weight;
    
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  const avgPositive = totalPositive / totalWeight;
  const avgNegative = totalNegative / totalWeight;
  
  // Normalize to -100 to +100 range
  // Scale from 0-1 range to -100 to +100
  const gmi = ((avgPositive - avgNegative) / 1) * 100;
  
  return Math.max(-100, Math.min(100, Math.round(gmi)));
}

/**
 * Calculate CFI (Collective Fear Index) from news articles
 * 
 * Formula: CFI = (Fear Mentions / Total Emotional Mentions) * 100
 * Range: 0 (no fear) to 100 (extreme fear)
 */
export function calculateCFI(articles: NewsArticle[]): number {
  if (articles.length === 0) return 50; // neutral

  let totalFear = 0;
  let totalEmotions = 0;
  let totalWeight = 0;

  for (const article of articles) {
    const weight = article.credibilityScore;
    
    // Fear component
    totalFear += article.emotions.fear * weight;
    
    // All emotions
    const allEmotions = (
      article.emotions.joy +
      article.emotions.fear +
      article.emotions.anger +
      article.emotions.sadness +
      article.emotions.hope +
      article.emotions.curiosity
    ) / 6;
    
    totalEmotions += allEmotions * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0 || totalEmotions === 0) return 50;

  const avgFear = totalFear / totalWeight;
  const avgEmotions = totalEmotions / totalWeight;
  
  // Calculate fear ratio
  const fearRatio = avgFear / (avgEmotions || 1);
  
  // Normalize to 0-100 range
  const cfi = fearRatio * 100;
  
  return Math.max(0, Math.min(100, Math.round(cfi)));
}

/**
 * Calculate HRI (Hope & Resilience Index) from news articles
 * 
 * Formula: HRI = (Hope + Curiosity Mentions / Total Emotional Mentions) * 100
 * Range: 0 (no hope) to 100 (extreme hope)
 */
export function calculateHRI(articles: NewsArticle[]): number {
  if (articles.length === 0) return 50; // neutral

  let totalHope = 0;
  let totalEmotions = 0;
  let totalWeight = 0;

  for (const article of articles) {
    const weight = article.credibilityScore;
    
    // Hope + Curiosity (resilience indicators)
    totalHope += (article.emotions.hope + article.emotions.curiosity) / 2 * weight;
    
    // All emotions
    const allEmotions = (
      article.emotions.joy +
      article.emotions.fear +
      article.emotions.anger +
      article.emotions.sadness +
      article.emotions.hope +
      article.emotions.curiosity
    ) / 6;
    
    totalEmotions += allEmotions * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0 || totalEmotions === 0) return 50;

  const avgHope = totalHope / totalWeight;
  const avgEmotions = totalEmotions / totalWeight;
  
  // Calculate hope ratio
  const hopeRatio = avgHope / (avgEmotions || 1);
  
  // Normalize to 0-100 range
  const hri = hopeRatio * 100;
  
  return Math.max(0, Math.min(100, Math.round(hri)));
}

/**
 * Calculate confidence score based on data quality and quantity
 */
export function calculateConfidence(
  newsCount: number,
  avgCredibility: number,
  socialMediaCount?: number
): number {
  // Base confidence from news articles
  let confidence = Math.min(1, newsCount / 10) * avgCredibility;
  
  // Boost confidence if we have social media data
  if (socialMediaCount && socialMediaCount > 0) {
    const socialConfidence = Math.min(1, socialMediaCount / 100) * 0.5;
    confidence = (confidence * 0.7) + (socialConfidence * 0.3);
  }
  
  return Math.round(confidence * 100) / 100;
}

/**
 * Calculate all indices from collected data
 */
export function calculateIndices(input: CalculationInput): CalculationOutput {
  if (input.newsArticles.length === 0) {
    return {
      gmi: 0,
      cfi: 50,
      hri: 50,
      confidence: 0,
      sources: {
        newsCount: 0,
        socialMediaCount: 0,
        averageCredibility: 0,
      },
      breakdown: {
        positiveEmotions: 0,
        negativeEmotions: 0,
        fearSentiment: 0,
        hopeSentiment: 0,
      },
    };
  }

  // Calculate from news
  const gmi = calculateGMI(input.newsArticles);
  const cfi = calculateCFI(input.newsArticles);
  const hri = calculateHRI(input.newsArticles);
  
  // Calculate average credibility
  const avgCredibility = input.newsArticles.reduce((sum, a) => sum + a.credibilityScore, 0) / input.newsArticles.length;
  
  // Calculate confidence
  const confidence = calculateConfidence(
    input.newsArticles.length,
    avgCredibility,
    input.socialMediaData?.length
  );

  // Calculate breakdown for transparency
  let totalPositive = 0;
  let totalNegative = 0;
  let totalFear = 0;
  let totalHope = 0;
  let totalWeight = 0;

  for (const article of input.newsArticles) {
    const weight = article.credibilityScore;
    totalPositive += (article.emotions.joy + article.emotions.hope + article.emotions.curiosity) / 3 * weight;
    totalNegative += (article.emotions.fear + article.emotions.anger + article.emotions.sadness) / 3 * weight;
    totalFear += article.emotions.fear * weight;
    totalHope += article.emotions.hope * weight;
    totalWeight += weight;
  }

  return {
    gmi,
    cfi,
    hri,
    confidence,
    sources: {
      newsCount: input.newsArticles.length,
      socialMediaCount: input.socialMediaData?.length || 0,
      averageCredibility: Math.round(avgCredibility * 100) / 100,
    },
    breakdown: {
      positiveEmotions: Math.round((totalPositive / totalWeight) * 100) / 100,
      negativeEmotions: Math.round((totalNegative / totalWeight) * 100) / 100,
      fearSentiment: Math.round((totalFear / totalWeight) * 100) / 100,
      hopeSentiment: Math.round((totalHope / totalWeight) * 100) / 100,
    },
  };
}

/**
 * Validate calculation results
 */
export function validateCalculation(output: CalculationOutput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (output.gmi < -100 || output.gmi > 100) {
    errors.push(`GMI out of range: ${output.gmi}`);
  }

  if (output.cfi < 0 || output.cfi > 100) {
    errors.push(`CFI out of range: ${output.cfi}`);
  }

  if (output.hri < 0 || output.hri > 100) {
    errors.push(`HRI out of range: ${output.hri}`);
  }

  if (output.confidence < 0 || output.confidence > 1) {
    errors.push(`Confidence out of range: ${output.confidence}`);
  }

  if (output.sources.newsCount === 0 && output.confidence > 0.5) {
    errors.push(`No news sources but high confidence: ${output.confidence}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
