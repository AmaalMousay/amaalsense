/**
 * Meta-Learning Layer - Enable Disabled Layer #6
 * 
 * Enables the system to learn from its mistakes and improve over time
 */

export interface LearningRecord {
  recordId: string;
  timestamp: number;
  analysisId: string;
  prediction: {
    gmi: number;
    cfi: number;
    hri: number;
  };
  actual: {
    gmi: number;
    cfi: number;
    hri: number;
  };
  error: {
    gmiError: number;
    cfiError: number;
    hriError: number;
    totalError: number;
  };
  feedback: string;
  correctionFactor: number;
}

export interface LearningPattern {
  patternId: string;
  topic: string;
  country: string;
  errorPattern: string;
  frequency: number;
  averageError: number;
  correctionStrategy: string;
  effectiveness: number; // 0-100
}

export interface SystemWeights {
  dataSourceWeight: number;
  temporalWeight: number;
  culturalWeight: number;
  sentimentWeight: number;
  confidenceWeight: number;
  lastUpdated: number;
}

/**
 * Record learning from analysis
 */
export function recordLearning(
  analysisId: string,
  prediction: { gmi: number; cfi: number; hri: number },
  actual: { gmi: number; cfi: number; hri: number },
  feedback?: string
): LearningRecord {
  const gmiError = Math.abs(prediction.gmi - actual.gmi);
  const cfiError = Math.abs(prediction.cfi - actual.cfi);
  const hriError = Math.abs(prediction.hri - actual.hri);
  const totalError = (gmiError + cfiError + hriError) / 3;

  // Calculate correction factor
  const correctionFactor = totalError > 0 ? 1 - totalError / 100 : 1;

  return {
    recordId: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    analysisId,
    prediction,
    actual,
    error: {
      gmiError,
      cfiError,
      hriError,
      totalError,
    },
    feedback: feedback || '',
    correctionFactor,
  };
}

/**
 * Identify learning patterns
 */
export function identifyLearningPatterns(
  learningRecords: LearningRecord[],
  topic: string,
  country: string
): LearningPattern[] {
  const patterns: LearningPattern[] = [];

  // Filter records for this topic and country
  const relevantRecords = learningRecords.filter(
    r => r.feedback?.includes(topic) && r.feedback?.includes(country)
  );

  if (relevantRecords.length === 0) {
    return patterns;
  }

  // Identify error patterns
  const errorPatterns: Record<string, LearningRecord[]> = {};

  for (const record of relevantRecords) {
    let patternType = 'unknown';

    if (record.error.gmiError > 15) {
      patternType = 'GMI_OVERESTIMATION';
    } else if (record.error.cfiError > 15) {
      patternType = 'CFI_UNDERESTIMATION';
    } else if (record.error.hriError > 15) {
      patternType = 'HRI_VOLATILITY';
    }

    if (!errorPatterns[patternType]) {
      errorPatterns[patternType] = [];
    }
    errorPatterns[patternType].push(record);
  }

  // Create patterns
  for (const [patternType, records] of Object.entries(errorPatterns)) {
    const avgError = records.reduce((sum, r) => sum + r.error.totalError, 0) / records.length;
    const avgCorrection = records.reduce((sum, r) => sum + r.correctionFactor, 0) / records.length;

    let correctionStrategy = 'increase_data_sources';
    if (patternType === 'GMI_OVERESTIMATION') {
      correctionStrategy = 'reduce_sentiment_weight';
    } else if (patternType === 'CFI_UNDERESTIMATION') {
      correctionStrategy = 'increase_fear_indicators';
    } else if (patternType === 'HRI_VOLATILITY') {
      correctionStrategy = 'smooth_temporal_analysis';
    }

    patterns.push({
      patternId: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      topic,
      country,
      errorPattern: patternType,
      frequency: records.length,
      averageError: avgError,
      correctionStrategy,
      effectiveness: avgCorrection * 100,
    });
  }

  return patterns;
}

/**
 * Update system weights based on learning
 */
export function updateSystemWeights(
  currentWeights: SystemWeights,
  learningPatterns: LearningPattern[]
): SystemWeights {
  const updatedWeights = { ...currentWeights };

  for (const pattern of learningPatterns) {
    if (pattern.effectiveness > 70) {
      // Apply correction strategy
      switch (pattern.correctionStrategy) {
        case 'increase_data_sources':
          updatedWeights.dataSourceWeight = Math.min(1, updatedWeights.dataSourceWeight + 0.05);
          break;
        case 'reduce_sentiment_weight':
          updatedWeights.sentimentWeight = Math.max(0, updatedWeights.sentimentWeight - 0.05);
          break;
        case 'increase_fear_indicators':
          updatedWeights.confidenceWeight = Math.min(1, updatedWeights.confidenceWeight + 0.05);
          break;
        case 'smooth_temporal_analysis':
          updatedWeights.temporalWeight = Math.min(1, updatedWeights.temporalWeight + 0.05);
          break;
      }
    }
  }

  // Normalize weights to sum to 1
  const sum =
    updatedWeights.dataSourceWeight +
    updatedWeights.temporalWeight +
    updatedWeights.culturalWeight +
    updatedWeights.sentimentWeight +
    updatedWeights.confidenceWeight;

  if (sum > 0) {
    updatedWeights.dataSourceWeight /= sum;
    updatedWeights.temporalWeight /= sum;
    updatedWeights.culturalWeight /= sum;
    updatedWeights.sentimentWeight /= sum;
    updatedWeights.confidenceWeight /= sum;
  }

  updatedWeights.lastUpdated = Date.now();

  return updatedWeights;
}

/**
 * Calculate learning progress
 */
export function calculateLearningProgress(learningRecords: LearningRecord[]): {
  totalRecords: number;
  averageError: number;
  errorTrend: 'improving' | 'declining' | 'stable';
  improvementRate: number;
} {
  if (learningRecords.length === 0) {
    return {
      totalRecords: 0,
      averageError: 0,
      errorTrend: 'stable',
      improvementRate: 0,
    };
  }

  const totalRecords = learningRecords.length;
  const averageError = learningRecords.reduce((sum, r) => sum + r.error.totalError, 0) / totalRecords;

  // Calculate trend
  let errorTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (totalRecords > 10) {
    const recentRecords = learningRecords.slice(-5);
    const olderRecords = learningRecords.slice(0, 5);

    const recentAvgError = recentRecords.reduce((sum, r) => sum + r.error.totalError, 0) / recentRecords.length;
    const olderAvgError = olderRecords.reduce((sum, r) => sum + r.error.totalError, 0) / olderRecords.length;

    if (recentAvgError < olderAvgError - 2) {
      errorTrend = 'improving';
    } else if (recentAvgError > olderAvgError + 2) {
      errorTrend = 'declining';
    }
  }

  // Calculate improvement rate
  const improvementRate = totalRecords > 0 ? (1 - averageError / 100) * 100 : 0;

  return {
    totalRecords,
    averageError,
    errorTrend,
    improvementRate,
  };
}

/**
 * Generate meta-learning report
 */
export function generateMetaLearningReport(
  learningRecords: LearningRecord[],
  learningPatterns: LearningPattern[],
  systemWeights: SystemWeights
): string {
  const progress = calculateLearningProgress(learningRecords);

  let report = `# Meta-Learning Report\n\n`;

  report += `## Learning Progress\n`;
  report += `- **Total Learning Records:** ${progress.totalRecords}\n`;
  report += `- **Average Error:** ${progress.averageError.toFixed(2)}\n`;
  report += `- **Error Trend:** ${progress.errorTrend}\n`;
  report += `- **Improvement Rate:** ${progress.improvementRate.toFixed(1)}%\n\n`;

  report += `## Identified Patterns\n`;
  for (const pattern of learningPatterns) {
    report += `### ${pattern.errorPattern}\n`;
    report += `- **Topic:** ${pattern.topic}\n`;
    report += `- **Country:** ${pattern.country}\n`;
    report += `- **Frequency:** ${pattern.frequency}\n`;
    report += `- **Average Error:** ${pattern.averageError.toFixed(2)}\n`;
    report += `- **Correction Strategy:** ${pattern.correctionStrategy}\n`;
    report += `- **Effectiveness:** ${pattern.effectiveness.toFixed(1)}%\n\n`;
  }

  report += `## System Weights\n`;
  report += `- **Data Source Weight:** ${systemWeights.dataSourceWeight.toFixed(3)}\n`;
  report += `- **Temporal Weight:** ${systemWeights.temporalWeight.toFixed(3)}\n`;
  report += `- **Cultural Weight:** ${systemWeights.culturalWeight.toFixed(3)}\n`;
  report += `- **Sentiment Weight:** ${systemWeights.sentimentWeight.toFixed(3)}\n`;
  report += `- **Confidence Weight:** ${systemWeights.confidenceWeight.toFixed(3)}\n`;
  report += `- **Last Updated:** ${new Date(systemWeights.lastUpdated).toISOString()}\n`;

  return report;
}

/**
 * Apply meta-learning to improve analysis
 */
export function applyMetaLearningToAnalysis(
  analysis: {
    gmi: number;
    cfi: number;
    hri: number;
  },
  systemWeights: SystemWeights,
  learningPatterns: LearningPattern[]
): {
  improvedGmi: number;
    improvedCfi: number;
    improvedHri: number;
    adjustmentFactors: { gmi: number; cfi: number; hri: number };
  } {
  let gmiAdjustment = 1;
  let cfiAdjustment = 1;
  let hriAdjustment = 1;

  // Apply pattern-based adjustments
  for (const pattern of learningPatterns) {
    if (pattern.effectiveness > 70) {
      switch (pattern.correctionStrategy) {
        case 'reduce_sentiment_weight':
          gmiAdjustment *= 0.95;
          break;
        case 'increase_fear_indicators':
          cfiAdjustment *= 1.05;
          break;
        case 'smooth_temporal_analysis':
          hriAdjustment *= 0.98;
          break;
      }
    }
  }

  return {
    improvedGmi: analysis.gmi * gmiAdjustment,
    improvedCfi: analysis.cfi * cfiAdjustment,
    improvedHri: analysis.hri * hriAdjustment,
    adjustmentFactors: {
      gmi: gmiAdjustment,
      cfi: cfiAdjustment,
      hri: hriAdjustment,
    },
  };
}

/**
 * Validate learning record
 */
export function validateLearningRecord(record: LearningRecord): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!record.recordId) {
    issues.push('Record ID is required');
  }

  if (!record.analysisId) {
    issues.push('Analysis ID is required');
  }

  if (record.error.totalError < 0 || record.error.totalError > 100) {
    issues.push('Total error must be between 0 and 100');
  }

  if (record.correctionFactor < 0 || record.correctionFactor > 1) {
    issues.push('Correction factor must be between 0 and 1');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
