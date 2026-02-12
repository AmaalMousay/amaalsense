/**
 * Topic Extraction Engine
 * Accurately identifies the main topic from user input
 * Filters data to only relevant sources
 */

export interface TopicInfo {
  mainTopic: string;
  category: string;
  keywords: string[];
  confidence: number;
  relatedTopics: string[];
  dataFilters: {
    regions?: string[];
    timeRange?: { start: Date; end: Date };
    dataTypes?: string[];
    minRelevance?: number;
  };
}

export interface DataPoint {
  id: string;
  content: string;
  topic: string;
  relevanceScore: number;
  source: string;
  timestamp: Date;
  region?: string;
  dataType: string;
}

// Topic categories and keywords
const TOPIC_CATEGORIES = {
  politics: {
    keywords: ['trump', 'biden', 'election', 'vote', 'congress', 'senate', 'president', 'political', 'government', 'policy'],
    regions: ['USA', 'Global'],
    dataTypes: ['news', 'polls', 'social_media', 'political_statements']
  },
  economy: {
    keywords: ['economy', 'gdp', 'inflation', 'recession', 'stock', 'market', 'business', 'trade', 'tariff', 'unemployment'],
    regions: ['Global', 'USA', 'MENA', 'Europe', 'Asia'],
    dataTypes: ['economic_data', 'news', 'financial_reports', 'business_news']
  },
  social: {
    keywords: ['marriage', 'divorce', 'family', 'youth', 'education', 'social', 'community', 'culture', 'tradition', 'generation'],
    regions: ['MENA', 'Global', 'Middle East'],
    dataTypes: ['social_media', 'surveys', 'news', 'cultural_reports']
  },
  security: {
    keywords: ['war', 'conflict', 'security', 'military', 'terrorism', 'attack', 'defense', 'threat', 'crisis', 'emergency'],
    regions: ['MENA', 'Middle East', 'Global', 'USA'],
    dataTypes: ['news', 'reports', 'statements', 'security_analysis']
  },
  health: {
    keywords: ['health', 'disease', 'pandemic', 'vaccine', 'covid', 'medical', 'hospital', 'doctor', 'treatment', 'mental'],
    regions: ['Global', 'MENA', 'USA', 'Europe'],
    dataTypes: ['health_data', 'medical_news', 'research', 'reports']
  },
  environment: {
    keywords: ['climate', 'environment', 'pollution', 'weather', 'disaster', 'natural', 'green', 'carbon', 'energy', 'renewable'],
    regions: ['Global', 'MENA', 'Europe', 'Asia'],
    dataTypes: ['environmental_data', 'news', 'research', 'reports']
  },
  technology: {
    keywords: ['ai', 'tech', 'technology', 'digital', 'internet', 'software', 'innovation', 'startup', 'cyber', 'data'],
    regions: ['Global', 'USA', 'Europe', 'Asia'],
    dataTypes: ['tech_news', 'research', 'reports', 'social_media']
  }
};

/**
 * Extract main topic from user input
 */
export function extractMainTopic(userInput: string): TopicInfo {
  const lowerInput = userInput.toLowerCase();
  const words = lowerInput.split(/\s+/);

  // Score each category
  const categoryScores: Record<string, number> = {};

  for (const [category, data] of Object.entries(TOPIC_CATEGORIES)) {
    let score = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of data.keywords) {
      if (lowerInput.includes(keyword)) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    }

    categoryScores[category] = score;
  }

  // Find best matching category
  const bestCategory = Object.entries(categoryScores).sort(([, a], [, b]) => b - a)[0];
  const category = bestCategory ? bestCategory[0] : 'general';
  const categoryData = TOPIC_CATEGORIES[category as keyof typeof TOPIC_CATEGORIES];

  // Extract main topic (first meaningful word)
  const mainTopic = words.find(word => word.length > 3 && !['what', 'when', 'where', 'how', 'why', 'the', 'and', 'or', 'is', 'are'].includes(word)) || 'general';

  // Calculate confidence
  const confidence = Math.min(100, (bestCategory ? bestCategory[1] : 0) * 20);

  // Find related topics
  const relatedTopics = Object.entries(categoryScores)
    .filter(([, score]) => score > 0 && score < (bestCategory ? bestCategory[1] : 1))
    .map(([cat]) => cat);

  return {
    mainTopic,
    category,
    keywords: categoryData ? categoryData.keywords.filter(k => lowerInput.includes(k)) : [],
    confidence: Math.round(confidence),
    relatedTopics,
    dataFilters: {
      regions: categoryData ? categoryData.regions : [],
      dataTypes: categoryData ? categoryData.dataTypes : [],
      minRelevance: 0.6
    }
  };
}

/**
 * Calculate relevance score between data point and topic
 */
export function calculateRelevance(dataPoint: DataPoint, topic: TopicInfo): number {
  let score = 0;

  // Check if data type matches
  if (topic.dataFilters.dataTypes?.includes(dataPoint.dataType)) {
    score += 0.3;
  }

  // Check if region matches
  if (topic.dataFilters.regions && dataPoint.region && topic.dataFilters.regions.includes(dataPoint.region)) {
    score += 0.2;
  }

  // Check keyword overlap
  const dataKeywords = dataPoint.content.toLowerCase().split(/\s+/);
  const matchedKeywords = topic.keywords.filter(k => dataKeywords.some(dw => dw.includes(k)));
  const keywordScore = Math.min(0.5, matchedKeywords.length * 0.1);
  score += keywordScore;

  // Check topic match
  if (dataPoint.topic === topic.category || dataPoint.topic === topic.mainTopic) {
    score += 0.3;
  }

  return Math.round(score * 100) / 100;
}

/**
 * Filter data by topic relevance
 */
export function filterDataByTopic(dataPoints: DataPoint[], topic: TopicInfo): DataPoint[] {
  return dataPoints
    .map(dp => ({
      ...dp,
      relevanceScore: calculateRelevance(dp, topic)
    }))
    .filter(dp => dp.relevanceScore >= (topic.dataFilters.minRelevance || 0.6))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Validate data relevance
 */
export function validateDataRelevance(dataPoint: DataPoint, topic: TopicInfo): { valid: boolean; reason?: string } {
  const relevance = calculateRelevance(dataPoint, topic);

  if (relevance < 0.5) {
    return {
      valid: false,
      reason: `Low relevance score: ${Math.round(relevance * 100)}%`
    };
  }

  if (topic.dataFilters.regions && dataPoint.region && !topic.dataFilters.regions.includes(dataPoint.region)) {
    return {
      valid: false,
      reason: `Region mismatch: ${dataPoint.region} not in expected regions`
    };
  }

  if (topic.dataFilters.dataTypes && !topic.dataFilters.dataTypes.includes(dataPoint.dataType)) {
    return {
      valid: false,
      reason: `Data type mismatch: ${dataPoint.dataType} not in expected types`
    };
  }

  return { valid: true };
}

/**
 * Get data quality assessment
 */
export function assessDataQuality(dataPoints: DataPoint[], topic: TopicInfo): {
  totalPoints: number;
  validPoints: number;
  averageRelevance: number;
  qualityScore: number;
  warnings: string[];
} {
  const filtered = filterDataByTopic(dataPoints, topic);
  const validPoints = filtered.filter(dp => validateDataRelevance(dp, topic).valid).length;
  const averageRelevance = filtered.length > 0 ? filtered.reduce((sum, dp) => sum + dp.relevanceScore, 0) / filtered.length : 0;

  const warnings: string[] = [];

  if (filtered.length === 0) {
    warnings.push('No relevant data found for this topic');
  }

  if (averageRelevance < 0.6) {
    warnings.push('Low average relevance score - results may be inaccurate');
  }

  if (validPoints < filtered.length * 0.7) {
    warnings.push('Many data points have low relevance');
  }

  const qualityScore = Math.round((validPoints / Math.max(1, filtered.length)) * 100);

  return {
    totalPoints: dataPoints.length,
    validPoints,
    averageRelevance: Math.round(averageRelevance * 100),
    qualityScore,
    warnings
  };
}

/**
 * Get topic summary
 */
export function getTopicSummary(topic: TopicInfo): string {
  return `Topic: ${topic.mainTopic} (${topic.category}) | Confidence: ${topic.confidence}% | Keywords: ${topic.keywords.join(', ')}`;
}
