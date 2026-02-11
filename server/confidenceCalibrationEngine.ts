/**
 * Confidence Calibration Engine - Fix Bug #4: Confidence Calculation Precision Issues
 * 
 * Fixes precision issues like 44.99999999 and ensures proper confidence propagation
 * from multiple engines (VADER, LLM, Temporal, etc.)
 */

export interface EngineConfidenceScore {
  engineName: string;
  score: number; // 0-100
  weight: number; // 0-1
  factors: {
    dataQuality: number; // 0-100
    sourceReliability: number; // 0-100
    sampleSize: number; // 0-100
    consistency: number; // 0-100
  };
  timestamp: number;
}

export interface ConfidenceCalibration {
  overallConfidence: number; // 0-100, rounded
  engineScores: EngineConfidenceScore[];
  calibrationFactors: {
    dataQualityMultiplier: number;
    sourceWeightingFactor: number;
    temporalDecay: number;
    consistencyBonus: number;
  };
  precision: number; // Number of decimal places
  rawValue: number; // Before rounding
  qualityAssessment: string; // 'high', 'medium', 'low'
}

/**
 * Configuration for confidence calculation
 */
const CONFIDENCE_CONFIG = {
  PRECISION_DECIMAL_PLACES: 2,
  MIN_CONFIDENCE: 0,
  MAX_CONFIDENCE: 100,
  ENGINE_WEIGHTS: {
    vader: 0.25,
    llm: 0.30,
    temporal: 0.20,
    source: 0.15,
    consistency: 0.10,
  },
  DATA_QUALITY_THRESHOLDS: {
    HIGH: 80,
    MEDIUM: 50,
    LOW: 0,
  },
  SOURCE_RELIABILITY_SCORES: {
    'news_api': 0.95,
    'gnews': 0.90,
    'reddit': 0.60,
    'twitter': 0.50,
    'mastodon': 0.65,
    'youtube': 0.70,
    'telegram': 0.55,
    'simulation': 0.30,
  },
};

/**
 * Round a number to specified decimal places
 */
function roundToPrecision(value: number, decimalPlaces: number): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate data quality score (0-100)
 */
export function calculateDataQuality(
  sampleSize: number,
  sourceCount: number,
  dataRecency: number // milliseconds
): number {
  let score = 50; // Base score

  // Sample size factor (0-30 points)
  if (sampleSize >= 100) score += 30;
  else if (sampleSize >= 50) score += 20;
  else if (sampleSize >= 20) score += 10;
  else if (sampleSize >= 5) score += 5;

  // Source diversity factor (0-30 points)
  if (sourceCount >= 5) score += 30;
  else if (sourceCount >= 3) score += 20;
  else if (sourceCount >= 2) score += 10;
  else if (sourceCount >= 1) score += 5;

  // Recency factor (0-40 points)
  const hoursOld = dataRecency / (1000 * 60 * 60);
  if (hoursOld <= 1) score += 40;
  else if (hoursOld <= 6) score += 30;
  else if (hoursOld <= 24) score += 20;
  else if (hoursOld <= 72) score += 10;
  else if (hoursOld <= 168) score += 5;

  return clamp(score, 0, 100);
}

/**
 * Calculate source reliability score (0-100)
 */
export function calculateSourceReliability(sources: string[]): number {
  if (sources.length === 0) return 30; // Default for no sources

  let totalReliability = 0;

  for (const source of sources) {
    const reliability = CONFIDENCE_CONFIG.SOURCE_RELIABILITY_SCORES[source as keyof typeof CONFIDENCE_CONFIG.SOURCE_RELIABILITY_SCORES] || 0.50;
    totalReliability += reliability * 100;
  }

  const averageReliability = totalReliability / sources.length;
  return clamp(averageReliability, 0, 100);
}

/**
 * Calculate consistency score (0-100)
 */
export function calculateConsistency(
  scores: number[],
  threshold: number = 10 // Maximum acceptable deviation
): number {
  if (scores.length <= 1) return 100;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Convert standard deviation to consistency score
  // Higher std dev = lower consistency
  const consistency = Math.max(0, 100 - (stdDev / threshold) * 100);
  return clamp(consistency, 0, 100);
}

/**
 * Create an engine confidence score
 */
export function createEngineScore(
  engineName: string,
  baseScore: number,
  dataQuality: number,
  sourceReliability: number,
  sampleSize: number,
  consistency: number,
  weight: number
): EngineConfidenceScore {
  return {
    engineName,
    score: clamp(baseScore, 0, 100),
    weight: clamp(weight, 0, 1),
    factors: {
      dataQuality: clamp(dataQuality, 0, 100),
      sourceReliability: clamp(sourceReliability, 0, 100),
      sampleSize: clamp(sampleSize, 0, 100),
      consistency: clamp(consistency, 0, 100),
    },
    timestamp: Date.now(),
  };
}

/**
 * Calculate temporal decay factor (confidence decreases over time)
 */
export function calculateTemporalDecay(
  analysisAge: number, // milliseconds
  halfLife: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
): number {
  const decayFactor = Math.pow(0.5, analysisAge / halfLife);
  return clamp(decayFactor, 0, 1);
}

/**
 * Calibrate overall confidence from multiple engine scores
 */
export function calibrateConfidence(
  engineScores: EngineConfidenceScore[],
  analysisAge?: number,
  calibrationMultiplier: number = 1.0
): ConfidenceCalibration {
  if (engineScores.length === 0) {
    return {
      overallConfidence: 0,
      engineScores: [],
      calibrationFactors: {
        dataQualityMultiplier: 1.0,
        sourceWeightingFactor: 1.0,
        temporalDecay: 1.0,
        consistencyBonus: 0,
      },
      precision: CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES,
      rawValue: 0,
      qualityAssessment: 'low',
    };
  }

  // Calculate weighted average
  let weightedSum = 0;
  let totalWeight = 0;

  for (const engineScore of engineScores) {
    // Apply factor multipliers
    const factorAverage =
      (engineScore.factors.dataQuality +
        engineScore.factors.sourceReliability +
        engineScore.factors.sampleSize +
        engineScore.factors.consistency) /
      4;

    // Adjust engine score based on factors
    const adjustedScore = engineScore.score * (factorAverage / 100);

    weightedSum += adjustedScore * engineScore.weight;
    totalWeight += engineScore.weight;
  }

  // Calculate base confidence
  let overallConfidence = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // Apply temporal decay if provided
  let temporalDecay = 1.0;
  if (analysisAge !== undefined) {
    temporalDecay = calculateTemporalDecay(analysisAge);
    overallConfidence *= temporalDecay;
  }

  // Calculate consistency bonus
  const engineConfidences = engineScores.map(s => s.score);
  const consistencyScore = calculateConsistency(engineConfidences);
  const consistencyBonus = (consistencyScore / 100) * 5; // Max 5 points bonus

  // Calculate data quality multiplier
  const avgDataQuality = engineScores.reduce((sum, s) => sum + s.factors.dataQuality, 0) / engineScores.length;
  const dataQualityMultiplier = avgDataQuality / 100;

  // Apply calibration multiplier
  overallConfidence = overallConfidence * calibrationMultiplier;

  // Apply consistency bonus
  overallConfidence += consistencyBonus;

  // Clamp to valid range
  const rawValue = overallConfidence;
  overallConfidence = clamp(overallConfidence, CONFIDENCE_CONFIG.MIN_CONFIDENCE, CONFIDENCE_CONFIG.MAX_CONFIDENCE);

  // Round to precision
  overallConfidence = roundToPrecision(overallConfidence, CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES);

  // Assess quality
  let qualityAssessment: 'high' | 'medium' | 'low' = 'low';
  if (overallConfidence >= CONFIDENCE_CONFIG.DATA_QUALITY_THRESHOLDS.HIGH) {
    qualityAssessment = 'high';
  } else if (overallConfidence >= CONFIDENCE_CONFIG.DATA_QUALITY_THRESHOLDS.MEDIUM) {
    qualityAssessment = 'medium';
  }

  return {
    overallConfidence,
    engineScores,
    calibrationFactors: {
      dataQualityMultiplier,
      sourceWeightingFactor: totalWeight,
      temporalDecay,
      consistencyBonus,
    },
    precision: CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES,
    rawValue,
    qualityAssessment,
  };
}

/**
 * Validate confidence score for precision issues
 */
export function validateConfidenceScore(score: number): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for floating point precision issues
  const decimalPlaces = (score.toString().split('.')[1] || '').length;
  if (decimalPlaces > CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES + 2) {
    issues.push(`Too many decimal places: ${decimalPlaces} (max: ${CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES})`);
  }

  // Check for NaN or Infinity
  if (!isFinite(score)) {
    issues.push(`Invalid value: ${score}`);
  }

  // Check range
  if (score < CONFIDENCE_CONFIG.MIN_CONFIDENCE || score > CONFIDENCE_CONFIG.MAX_CONFIDENCE) {
    issues.push(`Out of range: ${score} (valid: 0-100)`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Format confidence score for display
 */
export function formatConfidenceScore(calibration: ConfidenceCalibration): string {
  const { overallConfidence, qualityAssessment } = calibration;

  const qualityEmoji: Record<string, string> = {
    high: '✅',
    medium: '⚠️',
    low: '❌',
  };

  const emoji = qualityEmoji[qualityAssessment] || '❓';
  return `${emoji} ${overallConfidence.toFixed(CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES)}% (${qualityAssessment})`;
}

/**
 * Generate confidence report
 */
export function generateConfidenceReport(calibration: ConfidenceCalibration): string {
  let report = `# Confidence Calibration Report\n\n`;

  report += `**Overall Confidence:** ${calibration.overallConfidence.toFixed(CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES)}%\n`;
  report += `**Quality Assessment:** ${calibration.qualityAssessment.toUpperCase()}\n\n`;

  report += `## Engine Scores\n`;
  for (const engineScore of calibration.engineScores) {
    report += `\n### ${engineScore.engineName}\n`;
    report += `- **Score:** ${engineScore.score.toFixed(1)}%\n`;
    report += `- **Weight:** ${(engineScore.weight * 100).toFixed(1)}%\n`;
    report += `- **Data Quality:** ${engineScore.factors.dataQuality.toFixed(1)}%\n`;
    report += `- **Source Reliability:** ${engineScore.factors.sourceReliability.toFixed(1)}%\n`;
    report += `- **Sample Size:** ${engineScore.factors.sampleSize.toFixed(1)}%\n`;
    report += `- **Consistency:** ${engineScore.factors.consistency.toFixed(1)}%\n`;
  }

  report += `\n## Calibration Factors\n`;
  report += `- **Data Quality Multiplier:** ${calibration.calibrationFactors.dataQualityMultiplier.toFixed(3)}\n`;
  report += `- **Source Weighting Factor:** ${calibration.calibrationFactors.sourceWeightingFactor.toFixed(3)}\n`;
  report += `- **Temporal Decay:** ${calibration.calibrationFactors.temporalDecay.toFixed(3)}\n`;
  report += `- **Consistency Bonus:** ${calibration.calibrationFactors.consistencyBonus.toFixed(2)} points\n`;

  report += `\n## Raw vs Rounded\n`;
  report += `- **Raw Value:** ${calibration.rawValue.toFixed(10)}\n`;
  report += `- **Rounded Value:** ${calibration.overallConfidence.toFixed(CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES)}%\n`;
  report += `- **Precision:** ${CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES} decimal places\n`;

  return report;
}

/**
 * Compare two confidence scores
 */
export function compareConfidenceScores(
  calibration1: ConfidenceCalibration,
  calibration2: ConfidenceCalibration
): { difference: number; improvement: string } {
  const difference = calibration2.overallConfidence - calibration1.overallConfidence;
  const improvement = difference > 0 ? 'improved' : difference < 0 ? 'degraded' : 'unchanged';

  return {
    difference: roundToPrecision(difference, CONFIDENCE_CONFIG.PRECISION_DECIMAL_PLACES),
    improvement,
  };
}
