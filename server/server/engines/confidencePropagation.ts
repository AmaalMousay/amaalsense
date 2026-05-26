/**
 * Confidence Propagation
 *
 * Computes confidence values for individual engines and combines them into an
 * overall confidence score. This layer provides internal calibration metadata;
 * it does not produce final responses.
 */

export interface ConfidenceFactor {
  name: string;
  value: number;
  weight: number;
  description: string;
}

export interface EngineConfidence {
  engineName: string;
  confidence: number;
  factors: ConfidenceFactor[];
}

export interface OverallConfidence {
  score: number;
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  engineConfidences: EngineConfidence[];
  explanation: string;
}

export const engineWeights: Record<string, number> = {
  contextClassification: 0.15,
  emotionFusion: 0.25,
  emotionalDynamics: 0.2,
  driverDetection: 0.15,
  explainableInsight: 0.15,
  sourceWeighting: 0.1,
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function weighted(factors: ConfidenceFactor[]): number {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight === 0) return 0;
  return Math.round((factors.reduce((sum, factor) => sum + clamp01(factor.value) * factor.weight, 0) / totalWeight) * 100);
}

export function calculateContextConfidence(textLength: number, keywordsFound: number, languageDetected: boolean, domainDetected: boolean): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    { name: 'text_length', value: Math.min(1, textLength / 500), weight: 0.25, description: 'Input text length.' },
    { name: 'keywords', value: Math.min(1, keywordsFound / 8), weight: 0.3, description: 'Context keywords found.' },
    { name: 'language', value: languageDetected ? 1 : 0.3, weight: 0.2, description: 'Language detection confidence.' },
    { name: 'domain', value: domainDetected ? 1 : 0.4, weight: 0.25, description: 'Domain classification confidence.' },
  ];
  return { engineName: 'contextClassification', confidence: weighted(factors), factors };
}

export function calculateFusionConfidence(sourceCount: number, sourceQuality: number, agreementLevel: number, emotionalIntensity: number): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    { name: 'source_count', value: Math.min(1, sourceCount / 8), weight: 0.25, description: 'Number of sources.' },
    { name: 'source_quality', value: sourceQuality, weight: 0.3, description: 'Average source quality.' },
    { name: 'agreement', value: agreementLevel, weight: 0.3, description: 'Agreement between signals.' },
    { name: 'intensity', value: emotionalIntensity, weight: 0.15, description: 'Strength of emotional signal.' },
  ];
  return { engineName: 'emotionFusion', confidence: weighted(factors), factors };
}

export function calculateDynamicsConfidence(dataPoints: number, volatility: number, trendStrength: number): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    { name: 'data_points', value: Math.min(1, dataPoints / 20), weight: 0.45, description: 'Historical data available.' },
    { name: 'volatility', value: 1 - clamp01(volatility / 100), weight: 0.25, description: 'Lower volatility improves confidence.' },
    { name: 'trend_strength', value: clamp01(trendStrength / 100), weight: 0.3, description: 'Trend clarity.' },
  ];
  return { engineName: 'emotionalDynamics', confidence: weighted(factors), factors };
}

export function calculateDriverConfidence(driverCount: number, evidenceCount: number, contextConfidence: number): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    { name: 'drivers', value: Math.min(1, driverCount / 6), weight: 0.35, description: 'Number of detected drivers.' },
    { name: 'evidence', value: Math.min(1, evidenceCount / 8), weight: 0.35, description: 'Evidence support.' },
    { name: 'context', value: clamp01(contextConfidence / 100), weight: 0.3, description: 'Context confidence.' },
  ];
  return { engineName: 'driverDetection', confidence: weighted(factors), factors };
}

export function calculateInsightConfidence(contextConfidence: number, emotionConfidence: number, driverConfidence: number): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    { name: 'context', value: clamp01(contextConfidence / 100), weight: 0.33, description: 'Context confidence.' },
    { name: 'emotion', value: clamp01(emotionConfidence / 100), weight: 0.34, description: 'Emotion confidence.' },
    { name: 'drivers', value: clamp01(driverConfidence / 100), weight: 0.33, description: 'Driver confidence.' },
  ];
  return { engineName: 'explainableInsight', confidence: weighted(factors), factors };
}

function levelFor(score: number): OverallConfidence['level'] {
  if (score >= 85) return 'very_high';
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  if (score >= 30) return 'low';
  return 'very_low';
}

export function calculateOverallConfidence(engineConfidences: EngineConfidence[]): OverallConfidence {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const confidence of engineConfidences) {
    const weight = engineWeights[confidence.engineName] ?? 0.1;
    weightedSum += confidence.confidence * weight;
    totalWeight += weight;
  }
  const score = totalWeight ? Math.round(weightedSum / totalWeight) : 0;
  const level = levelFor(score);
  const weakest = engineConfidences.reduce((min, item) => item.confidence < min.confidence ? item : min, engineConfidences[0] || { engineName: 'none', confidence: 0, factors: [] });
  const strongest = engineConfidences.reduce((max, item) => item.confidence > max.confidence ? item : max, engineConfidences[0] || { engineName: 'none', confidence: 0, factors: [] });
  return { score, level, engineConfidences, explanation: `Overall confidence is ${level}; strongest=${strongest.engineName}, weakest=${weakest.engineName}.` };
}

export function quickConfidenceScore(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
