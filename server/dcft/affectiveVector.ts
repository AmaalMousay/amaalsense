/**
 * Affective Vector (AV) Module
 * Based on DCFT Theory by Amaal Radwan
 * 
 * AV = [Joy, Fear, Anger, Sadness, Hope, Curiosity]
 * Each component ranges from -1 to +1, expressing both polarity and intensity
 */

export interface AffectiveVector {
  joy: number;      // -1 to +1
  fear: number;     // -1 to +1
  anger: number;    // -1 to +1
  sadness: number;  // -1 to +1
  hope: number;     // -1 to +1
  curiosity: number; // -1 to +1
}

export interface EmotionEvent {
  id: string;
  content: string;
  source: string;
  timestamp: Date;
  reach: number;        // Number of people reached (for Wi calculation)
  engagement: number;   // Likes, shares, comments (for Wi calculation)
  affectiveVector: AffectiveVector;
  confidence: number;   // 0-1
}

/**
 * Normalize emotion values from 0-100 scale to -1 to +1 scale
 */
export function normalizeToAV(emotions: {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
}): AffectiveVector {
  return {
    joy: (emotions.joy / 50) - 1,        // 0-100 → -1 to +1
    fear: (emotions.fear / 50) - 1,
    anger: (emotions.anger / 50) - 1,
    sadness: (emotions.sadness / 50) - 1,
    hope: (emotions.hope / 50) - 1,
    curiosity: (emotions.curiosity / 50) - 1,
  };
}

/**
 * Convert AV back to 0-100 scale for display
 */
export function avToDisplayScale(av: AffectiveVector): {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
} {
  return {
    joy: Math.round((av.joy + 1) * 50),
    fear: Math.round((av.fear + 1) * 50),
    anger: Math.round((av.anger + 1) * 50),
    sadness: Math.round((av.sadness + 1) * 50),
    hope: Math.round((av.hope + 1) * 50),
    curiosity: Math.round((av.curiosity + 1) * 50),
  };
}

/**
 * Calculate the magnitude (intensity) of an Affective Vector
 */
export function calculateAVMagnitude(av: AffectiveVector): number {
  return Math.sqrt(
    av.joy ** 2 +
    av.fear ** 2 +
    av.anger ** 2 +
    av.sadness ** 2 +
    av.hope ** 2 +
    av.curiosity ** 2
  );
}

/**
 * Calculate the dominant emotion from an Affective Vector
 */
export function getDominantEmotion(av: AffectiveVector): {
  emotion: keyof AffectiveVector;
  value: number;
  polarity: 'positive' | 'negative' | 'neutral';
} {
  const emotions = Object.entries(av) as [keyof AffectiveVector, number][];
  const sorted = emotions.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const [emotion, value] = sorted[0];
  
  return {
    emotion,
    value,
    polarity: value > 0.1 ? 'positive' : value < -0.1 ? 'negative' : 'neutral',
  };
}

/**
 * Aggregate multiple Affective Vectors into one
 * Uses weighted average based on confidence
 */
export function aggregateAVs(
  vectors: { av: AffectiveVector; weight: number }[]
): AffectiveVector {
  if (vectors.length === 0) {
    return { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 };
  }

  const totalWeight = vectors.reduce((sum, v) => sum + v.weight, 0);
  
  if (totalWeight === 0) {
    return { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 };
  }

  const aggregated: AffectiveVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  for (const { av, weight } of vectors) {
    const normalizedWeight = weight / totalWeight;
    aggregated.joy += av.joy * normalizedWeight;
    aggregated.fear += av.fear * normalizedWeight;
    aggregated.anger += av.anger * normalizedWeight;
    aggregated.sadness += av.sadness * normalizedWeight;
    aggregated.hope += av.hope * normalizedWeight;
    aggregated.curiosity += av.curiosity * normalizedWeight;
  }

  return aggregated;
}

/**
 * Calculate emotional polarity (positive vs negative balance)
 */
export function calculateEmotionalPolarity(av: AffectiveVector): number {
  const positive = av.joy + av.hope + av.curiosity;
  const negative = av.fear + av.anger + av.sadness;
  return (positive - negative) / 6; // Normalized to -1 to +1
}

/**
 * Calculate emotional intensity (overall activation level)
 */
export function calculateEmotionalIntensity(av: AffectiveVector): number {
  return (
    Math.abs(av.joy) +
    Math.abs(av.fear) +
    Math.abs(av.anger) +
    Math.abs(av.sadness) +
    Math.abs(av.hope) +
    Math.abs(av.curiosity)
  ) / 6;
}
