/**
 * Engine 3: Emotional Dynamics Engine
 * يحسب:
 * - Sentiment Momentum (اتجاه المشاعر)
 * - Emotional Volatility (تقلب المشاعر)
 * - Trend (الاتجاه العام)
 * - Spikes (القفزات المفاجئة)
 * 
 * Time series analysis for emotional data
 */

import { AffectiveVector, EmotionFusionResult } from './emotionFusion';

export type TrendDirection = 'rising' | 'falling' | 'stable' | 'volatile';
export type MomentumLevel = 'strong_positive' | 'positive' | 'neutral' | 'negative' | 'strong_negative';

export interface EmotionalSpike {
  emotion: keyof AffectiveVector;
  magnitude: number;      // 0-100
  direction: 'up' | 'down';
  significance: 'minor' | 'moderate' | 'major' | 'critical';
}

export interface DynamicsResult {
  momentum: {
    value: number;           // -100 to +100
    level: MomentumLevel;
    description: string;
    descriptionAr: string;
  };
  volatility: {
    value: number;           // 0-100
    level: 'low' | 'medium' | 'high' | 'extreme';
    description: string;
    descriptionAr: string;
  };
  trend: {
    direction: TrendDirection;
    strength: number;        // 0-100
    predictedChange: number; // -50 to +50 (expected change in next period)
    description: string;
    descriptionAr: string;
  };
  spikes: EmotionalSpike[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  stabilityIndex: number;    // 0-100 (100 = very stable)
}

/**
 * Calculate sentiment momentum based on emotion vector
 * Momentum = rate of change in emotional state
 */
function calculateMomentum(emotions: EmotionFusionResult): { value: number; level: MomentumLevel; description: string; descriptionAr: string } {
  // Calculate momentum based on valence and arousal
  const { valence, arousal, emotionalIntensity } = emotions;
  
  // Momentum combines valence direction with intensity
  // Positive valence + high arousal = strong positive momentum
  // Negative valence + high arousal = strong negative momentum
  const rawMomentum = (valence * 0.6) + ((arousal - 50) * 0.4);
  const momentumValue = Math.max(-100, Math.min(100, Math.round(rawMomentum)));
  
  // Determine momentum level
  let level: MomentumLevel;
  let description: string;
  let descriptionAr: string;
  
  if (momentumValue >= 50) {
    level = 'strong_positive';
    description = 'Strong positive momentum - emotions are highly positive and energetic';
    descriptionAr = 'زخم إيجابي قوي - المشاعر إيجابية ونشطة للغاية';
  } else if (momentumValue >= 20) {
    level = 'positive';
    description = 'Positive momentum - generally optimistic emotional state';
    descriptionAr = 'زخم إيجابي - حالة عاطفية متفائلة بشكل عام';
  } else if (momentumValue >= -20) {
    level = 'neutral';
    description = 'Neutral momentum - balanced emotional state';
    descriptionAr = 'زخم محايد - حالة عاطفية متوازنة';
  } else if (momentumValue >= -50) {
    level = 'negative';
    description = 'Negative momentum - concerning emotional trends';
    descriptionAr = 'زخم سلبي - اتجاهات عاطفية مقلقة';
  } else {
    level = 'strong_negative';
    description = 'Strong negative momentum - highly negative and intense emotions';
    descriptionAr = 'زخم سلبي قوي - مشاعر سلبية وحادة للغاية';
  }
  
  return { value: momentumValue, level, description, descriptionAr };
}

/**
 * Calculate emotional volatility
 * High volatility = emotions are spread across multiple categories
 * Low volatility = emotions are concentrated
 */
function calculateVolatility(vector: AffectiveVector): { value: number; level: 'low' | 'medium' | 'high' | 'extreme'; description: string; descriptionAr: string } {
  const values = Object.values(vector);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalize volatility to 0-100
  const volatilityValue = Math.min(100, Math.round(stdDev * 2.5));
  
  // Determine volatility level
  let level: 'low' | 'medium' | 'high' | 'extreme';
  let description: string;
  let descriptionAr: string;
  
  if (volatilityValue <= 20) {
    level = 'low';
    description = 'Low volatility - stable and consistent emotional response';
    descriptionAr = 'تقلب منخفض - استجابة عاطفية مستقرة ومتسقة';
  } else if (volatilityValue <= 45) {
    level = 'medium';
    description = 'Medium volatility - mixed but manageable emotions';
    descriptionAr = 'تقلب متوسط - مشاعر متنوعة لكن يمكن التحكم بها';
  } else if (volatilityValue <= 70) {
    level = 'high';
    description = 'High volatility - significant emotional fluctuations';
    descriptionAr = 'تقلب عالي - تقلبات عاطفية كبيرة';
  } else {
    level = 'extreme';
    description = 'Extreme volatility - chaotic emotional state, potential crisis';
    descriptionAr = 'تقلب شديد - حالة عاطفية فوضوية، احتمال أزمة';
  }
  
  return { value: volatilityValue, level, description, descriptionAr };
}

/**
 * Determine emotional trend
 */
function determineTrend(emotions: EmotionFusionResult, volatility: number): { direction: TrendDirection; strength: number; predictedChange: number; description: string; descriptionAr: string } {
  const { valence, arousal, emotionalIntensity } = emotions;
  
  // Determine trend direction
  let direction: TrendDirection;
  let description: string;
  let descriptionAr: string;
  
  if (volatility > 60) {
    direction = 'volatile';
    description = 'Volatile trend - unpredictable emotional shifts';
    descriptionAr = 'اتجاه متقلب - تحولات عاطفية غير متوقعة';
  } else if (valence > 20 && arousal > 40) {
    direction = 'rising';
    description = 'Rising trend - positive emotions gaining strength';
    descriptionAr = 'اتجاه صاعد - المشاعر الإيجابية تكتسب قوة';
  } else if (valence < -20 && arousal > 40) {
    direction = 'falling';
    description = 'Falling trend - negative emotions intensifying';
    descriptionAr = 'اتجاه هابط - المشاعر السلبية تتصاعد';
  } else {
    direction = 'stable';
    description = 'Stable trend - emotions are relatively consistent';
    descriptionAr = 'اتجاه مستقر - المشاعر ثابتة نسبياً';
  }
  
  // Calculate trend strength
  const strength = Math.min(100, Math.round(Math.abs(valence) * 0.5 + emotionalIntensity * 0.5));
  
  // Predict change based on momentum and volatility
  const predictedChange = Math.round((valence * 0.3) + ((arousal - 50) * 0.2) - (volatility * 0.1));
  
  return { direction, strength, predictedChange: Math.max(-50, Math.min(50, predictedChange)), description, descriptionAr };
}

/**
 * Detect emotional spikes
 */
function detectSpikes(vector: AffectiveVector): EmotionalSpike[] {
  const spikes: EmotionalSpike[] = [];
  const avg = Object.values(vector).reduce((a, b) => a + b, 0) / 6;
  
  for (const [emotion, value] of Object.entries(vector)) {
    const deviation = value - avg;
    
    // Detect significant deviations
    if (Math.abs(deviation) > 15) {
      let significance: 'minor' | 'moderate' | 'major' | 'critical';
      
      if (Math.abs(deviation) > 50) {
        significance = 'critical';
      } else if (Math.abs(deviation) > 35) {
        significance = 'major';
      } else if (Math.abs(deviation) > 25) {
        significance = 'moderate';
      } else {
        significance = 'minor';
      }
      
      spikes.push({
        emotion: emotion as keyof AffectiveVector,
        magnitude: Math.abs(deviation),
        direction: deviation > 0 ? 'up' : 'down',
        significance
      });
    }
  }
  
  // Sort by magnitude (highest first)
  return spikes.sort((a, b) => b.magnitude - a.magnitude);
}

/**
 * Calculate risk level based on emotional state
 */
function calculateRiskLevel(emotions: EmotionFusionResult, volatility: number, spikes: EmotionalSpike[]): 'low' | 'medium' | 'high' | 'critical' {
  const { vector, valence } = emotions;
  
  // Risk factors
  let riskScore = 0;
  
  // High negative emotions increase risk
  if (vector.fear > 60) riskScore += 25;
  if (vector.anger > 60) riskScore += 30;
  if (vector.sadness > 60) riskScore += 15;
  
  // Low positive emotions increase risk
  if (vector.hope < 20) riskScore += 15;
  if (vector.joy < 10) riskScore += 10;
  
  // High volatility increases risk
  if (volatility > 60) riskScore += 20;
  
  // Critical spikes increase risk
  const criticalSpikes = spikes.filter(s => s.significance === 'critical');
  riskScore += criticalSpikes.length * 15;
  
  // Negative valence increases risk
  if (valence < -50) riskScore += 20;
  
  // Determine risk level
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 25) return 'medium';
  return 'low';
}

/**
 * Calculate stability index
 */
function calculateStabilityIndex(volatility: number, spikes: EmotionalSpike[]): number {
  // Start with inverse of volatility
  let stability = 100 - volatility;
  
  // Reduce for each spike
  for (const spike of spikes) {
    if (spike.significance === 'critical') stability -= 20;
    else if (spike.significance === 'major') stability -= 10;
    else if (spike.significance === 'moderate') stability -= 5;
  }
  
  return Math.max(0, Math.min(100, Math.round(stability)));
}

/**
 * Main Emotional Dynamics Function
 */
export function analyzeEmotionalDynamics(emotions: EmotionFusionResult): DynamicsResult {
  const momentum = calculateMomentum(emotions);
  const volatility = calculateVolatility(emotions.vector);
  const trend = determineTrend(emotions, volatility.value);
  const spikes = detectSpikes(emotions.vector);
  const riskLevel = calculateRiskLevel(emotions, volatility.value, spikes);
  const stabilityIndex = calculateStabilityIndex(volatility.value, spikes);
  
  return {
    momentum,
    volatility,
    trend,
    spikes,
    riskLevel,
    stabilityIndex
  };
}

export default { analyzeEmotionalDynamics };
