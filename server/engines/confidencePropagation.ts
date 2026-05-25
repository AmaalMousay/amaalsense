import { t } from "../_core/i18n";

/**
 * Confidence Propagation System
 * 
 * :
 * -  Engine  engineConfidence: 0-100
 * -  overallConfidence  
 * -     Engines
 */

//  
export interface EngineConfidence {
  engineName: string;
  confidence: number; // 0-100
  factors: ConfidenceFactor[];
}

export interface ConfidenceFactor {
  name: string;
  value: number; // 0-1
  weight: number; // 0-1
  description: string;
}

export interface OverallConfidence {
  score: number; // 0-100
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  engineConfidences: EngineConfidence[];
  explanation: string;
}

//   Engines    
export const engineWeights: Record<string, number> = {
  contextClassification: 0.15,
  emotionFusion: 0.30,
  emotionalDynamics: 0.20,
  driverDetection: 0.15,
  explainableInsight: 0.20,
};

/**
 *   Engine  
 */
export function calculateContextConfidence(
  textLength: number,
  keywordsFound: number,
  languageDetected: boolean,
  domainClear: boolean
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'textLength',
      value: Math.min(textLength / 500, 1), //    
      weight: 0.2,
      description: t('auto.engines_confidencePropagation.22.bed44000', 'ar')
    },
    {
      name: 'keywordsFound',
      value: Math.min(keywordsFound / 10, 1),
      weight: 0.3,
      description: t('auto.engines_confidencePropagation.21.bb14f8e3', 'ar')
    },
    {
      name: 'languageDetected',
      value: languageDetected ? 1 : 0.3,
      weight: 0.2,
      description: t('auto.engines_confidencePropagation.20.60ef4ab5', 'ar')
    },
    {
      name: 'domainClear',
      value: domainClear ? 1 : 0.5,
      weight: 0.3,
      description: t('auto.engines_confidencePropagation.19.e9339a46', 'ar')
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'contextClassification',
    confidence,
    factors
  };
}

/**
 *   Engine  
 */
export function calculateFusionConfidence(
  sourceCount: number,
  sourceQuality: number, // 0-1
  agreementLevel: number, // 0-1 (  )
  emotionClarity: number // 0-1 ( )
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'sourceCount',
      value: Math.min(sourceCount / 20, 1),
      weight: 0.25,
      description: t('auto.engines_confidencePropagation.18.e511ab94', 'ar')
    },
    {
      name: 'sourceQuality',
      value: sourceQuality,
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.17.a0db9bbd', 'ar')
    },
    {
      name: 'agreementLevel',
      value: agreementLevel,
      weight: 0.25,
      description: t('auto.engines_confidencePropagation.16.f7bdf057', 'ar')
    },
    {
      name: 'emotionClarity',
      value: emotionClarity,
      weight: 0.20,
      description: t('auto.engines_confidencePropagation.15.80c25269', 'ar')
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'emotionFusion',
    confidence,
    factors
  };
}

/**
 *   Engine 
 */
export function calculateDynamicsConfidence(
  historicalDataPoints: number,
  timeSpan: number, // 
  trendConsistency: number // 0-1
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'historicalDataPoints',
      value: Math.min(historicalDataPoints / 50, 1),
      weight: 0.40,
      description: t('auto.engines_confidencePropagation.14.ffdfcb23', 'ar')
    },
    {
      name: 'timeSpan',
      value: Math.min(timeSpan / 168, 1), //   = 1
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.13.0ce074be', 'ar')
    },
    {
      name: 'trendConsistency',
      value: trendConsistency,
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.12.231561be', 'ar')
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'emotionalDynamics',
    confidence,
    factors
  };
}

/**
 *   Engine  
 */
export function calculateDriverConfidence(
  keywordsExtracted: number,
  causesIdentified: number,
  narrativeClarity: number // 0-1
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'keywordsExtracted',
      value: Math.min(keywordsExtracted / 15, 1),
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.11.a5749bc3', 'ar')
    },
    {
      name: 'causesIdentified',
      value: Math.min(causesIdentified / 5, 1),
      weight: 0.35,
      description: t('auto.engines_confidencePropagation.10.c2d86183', 'ar')
    },
    {
      name: 'narrativeClarity',
      value: narrativeClarity,
      weight: 0.35,
      description: t('auto.engines_confidencePropagation.9.89b6ee8a', 'ar')
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'driverDetection',
    confidence,
    factors
  };
}

/**
 *   Engine 
 */
export function calculateInsightConfidence(
  inputConfidence: number, //   Engines 
  explanationLength: number,
  actionableInsights: number
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'inputConfidence',
      value: inputConfidence / 100,
      weight: 0.40,
      description: t('auto.engines_confidencePropagation.8.fe4bfc2a', 'ar')
    },
    {
      name: 'explanationLength',
      value: Math.min(explanationLength / 200, 1),
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.7.4fb9fac6', 'ar')
    },
    {
      name: 'actionableInsights',
      value: Math.min(actionableInsights / 5, 1),
      weight: 0.30,
      description: t('auto.engines_confidencePropagation.6.98b92031', 'ar')
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'explainableInsight',
    confidence,
    factors
  };
}

/**
 *     
 */
function calculateWeightedConfidence(factors: ConfidenceFactor[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const factor of factors) {
    weightedSum += factor.value * factor.weight;
    totalWeight += factor.weight;
  }
  
  const confidence = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  return Math.round(confidence);
}

/**
 *       Engines
 */
export function calculateOverallConfidence(
  engineConfidences: EngineConfidence[]
): OverallConfidence {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const ec of engineConfidences) {
    const weight = engineWeights[ec.engineName] || 0.1;
    weightedSum += ec.confidence * weight;
    totalWeight += weight;
  }
  
  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  
  //  
  let level: OverallConfidence['level'];
  if (score >= 80) level = 'very_high';
  else if (score >= 65) level = 'high';
  else if (score >= 50) level = 'medium';
  else if (score >= 35) level = 'low';
  else level = 'very_low';
  
  //  
  const explanation = generateConfidenceExplanation(score, level, engineConfidences);
  
  return {
    score,
    level,
    engineConfidences,
    explanation
  };
}

/**
 *   
 */
function generateConfidenceExplanation(
  score: number,
  level: OverallConfidence['level'],
  engineConfidences: EngineConfidence[]
): string {
  const levelDescriptions: Record<OverallConfidence['level'], string> = {
    very_high: t('auto.engines_confidencePropagation.5.0d97e7c0', 'ar'),
    high: t('auto.engines_confidencePropagation.4.3e135998', 'ar'),
    medium: t('auto.engines_confidencePropagation.3.f7b7d15c', 'ar'),
    low: t('auto.engines_confidencePropagation.2.adca3246', 'ar'),
    very_low: t('auto.engines_confidencePropagation.1.4966a431', 'ar')
  };
  
  //   Engine
  const weakest = engineConfidences.reduce((min, ec) => 
    ec.confidence < min.confidence ? ec : min
  , engineConfidences[0]);
  
  //   Engine
  const strongest = engineConfidences.reduce((max, ec) => 
    ec.confidence > max.confidence ? ec : max
  , engineConfidences[0]);
  
  let explanation = `${levelDescriptions[level]} (${score}%). `;
  
  if (weakest && weakest.confidence < 50) {
    explanation += ` : ${weakest.engineName} (${weakest.confidence}%). `;
  }
  
  if (strongest && strongest.confidence > 70) {
    explanation += ` : ${strongest.engineName} (${strongest.confidence}%).`;
  }
  
  return explanation;
}

/**
 *    ( )
 */
export function quickConfidenceScore(
  sourceCount: number,
  textLength: number,
  historicalData: boolean
): number {
  let score = 50; //  
  
  // 
  score += Math.min(sourceCount * 3, 20);
  
  //  
  score += Math.min(textLength / 50, 15);
  
  //  
  if (historicalData) score += 15;
  
  return Math.min(Math.round(score), 100);
}
