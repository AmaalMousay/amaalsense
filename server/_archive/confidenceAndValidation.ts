/**
 * Confidence Scoring & Data Validation System
 * Ensures all analysis includes clear confidence metrics and data quality warnings
 */

export interface ConfidenceMetrics {
  dataQuality: number;        // 0-100: How complete/accurate is the data?
  topicRelevance: number;     // 0-100: How relevant is the data to the topic?
  historicalContext: number;  // 0-100: How much historical context do we have?
  dataRecency: number;        // 0-100: How recent is the data?
  sourceCredibility: number;  // 0-100: How credible are the sources?
  overall: number;            // 0-100: Overall confidence
}

export interface ValidationResult {
  isValid: boolean;
  confidence: ConfidenceMetrics;
  warnings: string[];
  recommendations: string[];
  dataQualityReport: {
    missingData: string[];
    inconsistencies: string[];
    outliers: string[];
  };
}

/**
 * Calculate data quality score
 */
export function calculateDataQuality(
  totalDataPoints: number,
  validDataPoints: number,
  averageRelevance: number
): number {
  if (totalDataPoints === 0) return 0;

  const completeness = (validDataPoints / totalDataPoints) * 100;
  const relevance = averageRelevance * 100;

  // Weighted average
  return Math.round(completeness * 0.6 + relevance * 0.4);
}

/**
 * Calculate topic relevance score
 */
export function calculateTopicRelevance(
  matchedKeywords: number,
  totalKeywords: number,
  categoryMatch: boolean
): number {
  const keywordScore = (matchedKeywords / Math.max(1, totalKeywords)) * 100;
  const categoryBonus = categoryMatch ? 20 : 0;

  return Math.round(Math.min(100, keywordScore + categoryBonus));
}

/**
 * Calculate historical context score
 */
export function calculateHistoricalContext(
  similarEventsFound: number,
  timeSpanCovered: number // in years
): number {
  const eventScore = Math.min(50, similarEventsFound * 10);
  const timeScore = Math.min(50, (timeSpanCovered / 50) * 50); // 50 years = max score

  return Math.round(eventScore + timeScore);
}

/**
 * Calculate data recency score
 */
export function calculateDataRecency(dataPoints: Array<{ timestamp: Date }>): number {
  if (dataPoints.length === 0) return 0;

  const now = new Date();
  const scores = dataPoints.map(dp => {
    const ageInDays = (now.getTime() - dp.timestamp.getTime()) / (1000 * 60 * 60 * 24);

    if (ageInDays <= 7) return 100;      // Very recent
    if (ageInDays <= 30) return 80;      // Recent
    if (ageInDays <= 90) return 60;      // Somewhat recent
    if (ageInDays <= 365) return 40;     // Old
    return 20;                            // Very old
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Calculate source credibility score
 */
export function calculateSourceCredibility(sources: Array<{ name: string; credibility: number }>): number {
  if (sources.length === 0) return 50;

  const totalCredibility = sources.reduce((sum, s) => sum + s.credibility, 0);
  return Math.round(totalCredibility / sources.length);
}

/**
 * Calculate overall confidence
 */
export function calculateOverallConfidence(metrics: Omit<ConfidenceMetrics, 'overall'>): number {
  const weights = {
    dataQuality: 0.25,
    topicRelevance: 0.25,
    historicalContext: 0.20,
    dataRecency: 0.20,
    sourceCredibility: 0.10
  };

  const weighted =
    metrics.dataQuality * weights.dataQuality +
    metrics.topicRelevance * weights.topicRelevance +
    metrics.historicalContext * weights.historicalContext +
    metrics.dataRecency * weights.dataRecency +
    metrics.sourceCredibility * weights.sourceCredibility;

  return Math.round(weighted);
}

/**
 * Generate warnings based on confidence metrics
 */
export function generateWarnings(metrics: ConfidenceMetrics): string[] {
  const warnings: string[] = [];

  if (metrics.dataQuality < 50) {
    warnings.push('⚠️ Data quality is low - results may be inaccurate');
  }

  if (metrics.topicRelevance < 60) {
    warnings.push('⚠️ Topic relevance is moderate - some data may be off-topic');
  }

  if (metrics.historicalContext < 40) {
    warnings.push('⚠️ Limited historical context - cannot compare with past events');
  }

  if (metrics.dataRecency < 50) {
    warnings.push('⚠️ Data is not very recent - situation may have changed');
  }

  if (metrics.sourceCredibility < 60) {
    warnings.push('⚠️ Source credibility is moderate - verify important claims');
  }

  if (metrics.overall < 50) {
    warnings.push('❌ Overall confidence is low - use these results with caution');
  }

  return warnings;
}

/**
 * Generate recommendations based on confidence metrics
 */
export function generateRecommendations(metrics: ConfidenceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.dataQuality < 70) {
    recommendations.push('✓ Collect more data to improve analysis accuracy');
  }

  if (metrics.topicRelevance < 75) {
    recommendations.push('✓ Refine search terms to find more relevant data');
  }

  if (metrics.historicalContext < 60) {
    recommendations.push('✓ Look for similar historical events for comparison');
  }

  if (metrics.dataRecency < 70) {
    recommendations.push('✓ Update data with more recent information');
  }

  if (metrics.sourceCredibility < 75) {
    recommendations.push('✓ Use more credible sources for verification');
  }

  return recommendations;
}

/**
 * Validate analysis and generate comprehensive report
 */
export function validateAnalysis(
  dataQuality: number,
  topicRelevance: number,
  historicalContext: number,
  dataRecency: number,
  sourceCredibility: number,
  missingData: string[] = [],
  inconsistencies: string[] = [],
  outliers: string[] = []
): ValidationResult {
  const metrics: Omit<ConfidenceMetrics, 'overall'> = {
    dataQuality,
    topicRelevance,
    historicalContext,
    dataRecency,
    sourceCredibility
  };

  const overall = calculateOverallConfidence(metrics);
  const fullMetrics: ConfidenceMetrics = { ...metrics, overall };

  const warnings = generateWarnings(fullMetrics);
  const recommendations = generateRecommendations(fullMetrics);

  return {
    isValid: overall >= 50,
    confidence: fullMetrics,
    warnings,
    recommendations,
    dataQualityReport: {
      missingData,
      inconsistencies,
      outliers
    }
  };
}

/**
 * Format confidence for display
 */
export function formatConfidenceDisplay(confidence: number): string {
  if (confidence >= 90) return '🟢 Very High';
  if (confidence >= 75) return '🟢 High';
  if (confidence >= 60) return '🟡 Moderate';
  if (confidence >= 40) return '🟠 Low';
  return '🔴 Very Low';
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return '#10b981'; // Green
  if (confidence >= 75) return '#3b82f6'; // Blue
  if (confidence >= 60) return '#f59e0b'; // Amber
  if (confidence >= 40) return '#ef4444'; // Red
  return '#991b1b'; // Dark Red
}

/**
 * Create confidence badge
 */
export function createConfidenceBadge(confidence: number): {
  text: string;
  color: string;
  level: string;
} {
  return {
    text: `${Math.round(confidence)}%`,
    color: getConfidenceColor(confidence),
    level: formatConfidenceDisplay(confidence)
  };
}
