/**
 * Self-Evaluation Layer - Enable Disabled Layer #2
 * 
 * Enables the system to evaluate its own analyses for accuracy and reliability
 * Implements self-assessment mechanisms for continuous improvement
 */

export interface SelfEvaluationMetrics {
  analysisId: string;
  timestamp: number;
  selfScore: number; // 0-100
  confidenceInSelfScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  comparisonWithHistorical: {
    similarAnalyses: number;
    averageAccuracy: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}

export interface AnalysisQualityMetrics {
  dataQuality: number; // 0-100
  sourceReliability: number; // 0-100
  methodologicalSoundness: number; // 0-100
  contextualRelevance: number; // 0-100
  overallQuality: number; // 0-100
}

/**
 * Evaluate analysis quality
 */
export function evaluateAnalysisQuality(analysis: {
  sourceCount: number;
  dataPoints: number;
  timeSpan: number;
  culturalContext: boolean;
  temporalAnalysis: boolean;
  sourceCredibility: number;
}): AnalysisQualityMetrics {
  // Data Quality: based on number of data points and time span
  const dataQuality = Math.min(100, (analysis.dataPoints / 100) * 50 + (Math.min(analysis.timeSpan, 30) / 30) * 50);

  // Source Reliability: based on source count and credibility
  const sourceReliability = Math.min(100, (analysis.sourceCount / 10) * 50 + analysis.sourceCredibility);

  // Methodological Soundness: based on temporal and cultural analysis
  let methodologicalSoundness = 50;
  if (analysis.temporalAnalysis) methodologicalSoundness += 25;
  if (analysis.culturalContext) methodologicalSoundness += 25;

  // Contextual Relevance: based on cultural context
  const contextualRelevance = analysis.culturalContext ? 85 : 60;

  // Overall Quality: weighted average
  const overallQuality =
    dataQuality * 0.25 + sourceReliability * 0.35 + methodologicalSoundness * 0.25 + contextualRelevance * 0.15;

  return {
    dataQuality: Math.round(dataQuality),
    sourceReliability: Math.round(sourceReliability),
    methodologicalSoundness: Math.round(methodologicalSoundness),
    contextualRelevance: Math.round(contextualRelevance),
    overallQuality: Math.round(overallQuality),
  };
}

/**
 * Self-evaluate an analysis
 */
export function selfEvaluateAnalysis(
  analysis: {
    id: string;
    gmi: number;
    cfi: number;
    hri: number;
    confidence: number;
    sourceCount: number;
    dataPoints: number;
    timeSpan: number;
    culturalContext: boolean;
    temporalAnalysis: boolean;
    sourceCredibility: number;
  },
  historicalData?: { accuracy: number; count: number }[]
): SelfEvaluationMetrics {
  const qualityMetrics = evaluateAnalysisQuality({
    sourceCount: analysis.sourceCount,
    dataPoints: analysis.dataPoints,
    timeSpan: analysis.timeSpan,
    culturalContext: analysis.culturalContext,
    temporalAnalysis: analysis.temporalAnalysis,
    sourceCredibility: analysis.sourceCredibility,
  });

  // Self Score: combination of confidence and quality
  const selfScore = (analysis.confidence * 0.4 + qualityMetrics.overallQuality * 0.6);

  // Confidence in self score
  const confidenceInSelfScore = Math.min(100, qualityMetrics.overallQuality * 0.8 + 20);

  // Identify strengths
  const strengths: string[] = [];
  if (qualityMetrics.sourceReliability > 75) {
    strengths.push('High source reliability');
  }
  if (qualityMetrics.dataQuality > 75) {
    strengths.push('Sufficient data quality');
  }
  if (analysis.temporalAnalysis) {
    strengths.push('Temporal analysis included');
  }
  if (analysis.culturalContext) {
    strengths.push('Cultural context considered');
  }

  // Identify weaknesses
  const weaknesses: string[] = [];
  if (qualityMetrics.sourceReliability < 50) {
    weaknesses.push('Limited source reliability');
  }
  if (qualityMetrics.dataQuality < 50) {
    weaknesses.push('Insufficient data quality');
  }
  if (!analysis.temporalAnalysis) {
    weaknesses.push('No temporal analysis');
  }
  if (!analysis.culturalContext) {
    weaknesses.push('Cultural context not considered');
  }
  if (analysis.sourceCount < 3) {
    weaknesses.push('Limited number of sources');
  }

  // Recommendations
  const recommendations: string[] = [];
  if (qualityMetrics.sourceReliability < 70) {
    recommendations.push('Consider using more reliable sources');
  }
  if (qualityMetrics.dataQuality < 70) {
    recommendations.push('Collect more data points for better accuracy');
  }
  if (!analysis.temporalAnalysis) {
    recommendations.push('Include temporal analysis for trend detection');
  }
  if (!analysis.culturalContext) {
    recommendations.push('Consider cultural context in analysis');
  }

  // Comparison with historical data
  let comparisonWithHistorical: { similarAnalyses: number; averageAccuracy: number; trend: 'improving' | 'declining' | 'stable' } = {
    similarAnalyses: 0,
    averageAccuracy: 0,
    trend: 'stable',
  };

  if (historicalData && historicalData.length > 0) {
    comparisonWithHistorical.similarAnalyses = historicalData.length;
    comparisonWithHistorical.averageAccuracy =
      historicalData.reduce((sum, d) => sum + d.accuracy, 0) / historicalData.length;

    // Determine trend
    if (historicalData.length > 1) {
      const recent = historicalData.slice(-5).reduce((sum, d) => sum + d.accuracy, 0) / Math.min(5, historicalData.length);
      const older = historicalData.slice(0, -5).reduce((sum, d) => sum + d.accuracy, 0) / Math.min(5, historicalData.length);

      if (recent > older + 5) {
        comparisonWithHistorical.trend = 'improving';
      } else if (recent < older - 5) {
        comparisonWithHistorical.trend = 'declining'
      }
    }
  }

  return {
    analysisId: analysis.id,
    timestamp: Date.now(),
    selfScore: Math.round(selfScore),
    confidenceInSelfScore: Math.round(confidenceInSelfScore),
    strengths,
    weaknesses,
    recommendations,
    comparisonWithHistorical,
  };
}

/**
 * Generate self-evaluation report
 */
export function generateSelfEvaluationReport(evaluation: SelfEvaluationMetrics): string {
  let report = `# Self-Evaluation Report\n\n`;

  report += `**Analysis ID:** ${evaluation.analysisId}\n`;
  report += `**Timestamp:** ${new Date(evaluation.timestamp).toISOString()}\n\n`;

  report += `## Self-Assessment Score\n`;
  report += `- **Overall Score:** ${evaluation.selfScore}/100\n`;
  report += `- **Confidence in Score:** ${evaluation.confidenceInSelfScore}%\n\n`;

  report += `## Strengths\n`;
  for (const strength of evaluation.strengths) {
    report += `- ✅ ${strength}\n`;
  }
  report += '\n';

  report += `## Weaknesses\n`;
  for (const weakness of evaluation.weaknesses) {
    report += `- ⚠️ ${weakness}\n`;
  }
  report += '\n';

  report += `## Recommendations for Improvement\n`;
  for (const rec of evaluation.recommendations) {
    report += `- 💡 ${rec}\n`;
  }
  report += '\n';

  report += `## Historical Comparison\n`;
  report += `- **Similar Analyses:** ${evaluation.comparisonWithHistorical.similarAnalyses}\n`;
  report += `- **Average Historical Accuracy:** ${evaluation.comparisonWithHistorical.averageAccuracy.toFixed(1)}%\n`;
  report += `- **Trend:** ${evaluation.comparisonWithHistorical.trend}\n`;

  return report;
}

/**
 * Determine if analysis needs review
 */
export function shouldReviewAnalysis(evaluation: SelfEvaluationMetrics): boolean {
  // Review if self score is below 60 or confidence is low
  if (evaluation.selfScore < 60 || evaluation.confidenceInSelfScore < 50) {
    return true;
  }

  // Review if too many weaknesses
  if (evaluation.weaknesses.length > 3) {
    return true;
  }

  // Review if declining trend
  if (evaluation.comparisonWithHistorical.trend === 'declining') {
    return true;
  }

  return false;
}

/**
 * Calculate self-evaluation score for batch analyses
 */
export function calculateBatchSelfEvaluationScore(evaluations: SelfEvaluationMetrics[]): {
  averageScore: number;
  averageConfidence: number;
  needsReview: number;
  improvingCount: number;
  decliningCount: number;
} {
  if (evaluations.length === 0) {
    return {
      averageScore: 0,
      averageConfidence: 0,
      needsReview: 0,
      improvingCount: 0,
      decliningCount: 0,
    };
  }

  const averageScore = evaluations.reduce((sum, e) => sum + e.selfScore, 0) / evaluations.length;
  const averageConfidence = evaluations.reduce((sum, e) => sum + e.confidenceInSelfScore, 0) / evaluations.length;
  const needsReview = evaluations.filter(e => shouldReviewAnalysis(e)).length;
  const improvingCount = evaluations.filter(e => e.comparisonWithHistorical.trend === 'improving').length;
  const decliningCount = evaluations.filter(e => e.comparisonWithHistorical.trend === 'declining').length;

  return {
    averageScore: Math.round(averageScore),
    averageConfidence: Math.round(averageConfidence),
    needsReview,
    improvingCount,
    decliningCount,
  };
}

/**
 * Validate self-evaluation
 */
export function validateSelfEvaluation(evaluation: SelfEvaluationMetrics): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!evaluation.analysisId) {
    issues.push('Analysis ID is required');
  }

  if (evaluation.selfScore < 0 || evaluation.selfScore > 100) {
    issues.push('Self score must be between 0 and 100');
  }

  if (evaluation.confidenceInSelfScore < 0 || evaluation.confidenceInSelfScore > 100) {
    issues.push('Confidence in self score must be between 0 and 100');
  }

  if (!Array.isArray(evaluation.strengths) || !Array.isArray(evaluation.weaknesses)) {
    issues.push('Strengths and weaknesses must be arrays');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
