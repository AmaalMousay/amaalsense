/**
 * DCFT-Based Calculation Engine
 * 
 * Dynamic Contextual Fusion Transform (DCFT) - Real Mathematical Implementation
 * 
 * This engine calculates emotional indices using proper DCFT methodology:
 * - Contextual weighting based on cultural, temporal, and social factors
 * - Dynamic fusion of multiple emotion signals
 * - Temporal decay for older data
 * - Cross-emotion relationships and reinforcement
 */

export interface EmotionVector {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
  trust: number;
  surprise: number;
}

export interface DCFTInput {
  emotionVectors: EmotionVector[];
  timestamps: Date[];
  credibilityScores: number[];
  culturalContext: string;
  topic: string;
  region: string;
}

export interface DCFTOutput {
  gmi: number; // Global Mood Index
  cfi: number; // Collective Fear Index
  hri: number; // Hope & Resilience Index
  aci: number; // Anger & Crisis Index
  sdi: number; // Sadness & Despair Index
  confidence: number;
  breakdown: {
    positiveEnergy: number;
    negativeEnergy: number;
    neutralEnergy: number;
    emotionalIntensity: number;
  };
}

/**
 * Calculate temporal decay weight
 * Recent data has higher weight, older data decays exponentially
 */
function calculateTemporalWeight(timestamp: Date, currentTime: Date = new Date()): number {
  const ageInDays = (currentTime.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
  const decayFactor = Math.exp(-ageInDays / 30); // 30-day half-life
  return Math.max(0.1, decayFactor); // Minimum 10% weight for very old data
}

/**
 * Calculate cultural context multiplier
 * Different regions have different emotional baselines
 */
function getCulturalContextMultiplier(context: string): { fear: number; hope: number; anger: number } {
  const multipliers: Record<string, { fear: number; hope: number; anger: number }> = {
    'MENA': { fear: 1.2, hope: 0.9, anger: 1.1 },
    'Africa': { fear: 1.1, hope: 1.0, anger: 1.0 },
    'Europe': { fear: 0.8, hope: 1.1, anger: 0.9 },
    'Asia': { fear: 0.9, hope: 1.0, anger: 1.0 },
    'Americas': { fear: 0.9, hope: 1.1, anger: 1.0 },
    'default': { fear: 1.0, hope: 1.0, anger: 1.0 },
  };
  
  return multipliers[context] || multipliers['default'];
}

/**
 * Calculate cross-emotion reinforcement
 * Emotions influence each other (e.g., fear + anger = crisis)
 */
function calculateEmotionReinforcement(emotions: EmotionVector): EmotionVector {
  const reinforced = { ...emotions };
  
  // Fear + Anger = Crisis amplification
  const crisisAmplification = (emotions.fear + emotions.anger) * 0.1;
  reinforced.fear += crisisAmplification * 0.6;
  reinforced.anger += crisisAmplification * 0.4;
  
  // Hope + Curiosity = Positive momentum
  const positiveAmplification = (emotions.hope + emotions.curiosity) * 0.1;
  reinforced.hope += positiveAmplification * 0.6;
  reinforced.curiosity += positiveAmplification * 0.4;
  
  // Sadness + Anger = Frustration
  const frustration = (emotions.sadness + emotions.anger) * 0.05;
  reinforced.sadness += frustration * 0.5;
  reinforced.anger += frustration * 0.5;
  
  return reinforced;
}

/**
 * Normalize emotion vector to 0-1 range
 */
function normalizeEmotions(emotions: EmotionVector): EmotionVector {
  const values = Object.values(emotions);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  
  const normalized: any = {};
  for (const [key, value] of Object.entries(emotions)) {
    normalized[key] = (value - min) / range;
  }
  
  return normalized;
}

/**
 * Calculate Global Mood Index (GMI) using DCFT
 * 
 * Formula:
 * GMI = Σ(w_t * c_t * (P_t - N_t)) / Σ(w_t * c_t)
 * 
 * Where:
 * - w_t = temporal weight
 * - c_t = credibility score
 * - P_t = positive emotions (joy + hope + curiosity + trust)
 * - N_t = negative emotions (fear + anger + sadness)
 */
export function calculateGMI(input: DCFTInput): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  const culturalMultiplier = getCulturalContextMultiplier(input.culturalContext);
  
  for (let i = 0; i < input.emotionVectors.length; i++) {
    const emotions = input.emotionVectors[i];
    const timestamp = input.timestamps[i];
    const credibility = input.credibilityScores[i];
    
    // Apply reinforcement
    const reinforced = calculateEmotionReinforcement(emotions);
    const normalized = normalizeEmotions(reinforced);
    
    // Calculate temporal weight
    const temporalWeight = calculateTemporalWeight(timestamp);
    
    // Positive emotions
    const positive = (normalized.joy + normalized.hope + normalized.curiosity + normalized.trust) / 4;
    
    // Negative emotions
    const negative = (normalized.fear + normalized.anger + normalized.sadness) / 3;
    
    // Apply cultural context to negative emotions (fear is higher in MENA region)
    const adjustedNegative = negative * culturalMultiplier.fear;
    
    // Calculate mood for this data point
    const mood = (positive - adjustedNegative) / (positive + adjustedNegative + 0.1);
    
    // Apply weights
    const weight = temporalWeight * credibility;
    weightedSum += mood * weight;
    totalWeight += weight;
  }
  
  // Normalize to -100 to +100 range
  const gmi = (weightedSum / totalWeight) * 100;
  
  return Math.max(-100, Math.min(100, Math.round(gmi)));
}

/**
 * Calculate Collective Fear Index (CFI) using DCFT
 * 
 * Formula:
 * CFI = Σ(w_t * c_t * F_t * m_cultural) / Σ(w_t * c_t)
 * 
 * Where:
 * - F_t = fear emotion intensity
 * - m_cultural = cultural context multiplier for fear
 */
export function calculateCFI(input: DCFTInput): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  const culturalMultiplier = getCulturalContextMultiplier(input.culturalContext);
  
  for (let i = 0; i < input.emotionVectors.length; i++) {
    const emotions = input.emotionVectors[i];
    const timestamp = input.timestamps[i];
    const credibility = input.credibilityScores[i];
    
    // Apply reinforcement
    const reinforced = calculateEmotionReinforcement(emotions);
    
    // Fear + Anger component (crisis indicator)
    const fear = reinforced.fear;
    const anger = reinforced.anger;
    const crisisComponent = (fear * 0.7 + anger * 0.3);
    
    // Apply cultural multiplier
    const adjustedFear = crisisComponent * culturalMultiplier.fear;
    
    // Calculate temporal weight
    const temporalWeight = calculateTemporalWeight(timestamp);
    
    // Apply weights
    const weight = temporalWeight * credibility;
    weightedSum += adjustedFear * weight;
    totalWeight += weight;
  }
  
  // Normalize to 0-100 range
  const cfi = (weightedSum / totalWeight) * 100;
  
  return Math.max(0, Math.min(100, Math.round(cfi)));
}

/**
 * Calculate Hope & Resilience Index (HRI) using DCFT
 * 
 * Formula:
 * HRI = Σ(w_t * c_t * (H_t + C_t) * m_cultural) / Σ(w_t * c_t)
 * 
 * Where:
 * - H_t = hope emotion intensity
 * - C_t = curiosity emotion intensity
 * - m_cultural = cultural context multiplier for hope
 */
export function calculateHRI(input: DCFTInput): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  const culturalMultiplier = getCulturalContextMultiplier(input.culturalContext);
  
  for (let i = 0; i < input.emotionVectors.length; i++) {
    const emotions = input.emotionVectors[i];
    const timestamp = input.timestamps[i];
    const credibility = input.credibilityScores[i];
    
    // Apply reinforcement
    const reinforced = calculateEmotionReinforcement(emotions);
    
    // Hope + Curiosity + Trust (resilience indicators)
    const hope = reinforced.hope;
    const curiosity = reinforced.curiosity;
    const trust = reinforced.trust;
    const resilience = (hope * 0.5 + curiosity * 0.3 + trust * 0.2);
    
    // Apply cultural multiplier
    const adjustedResilience = resilience * culturalMultiplier.hope;
    
    // Calculate temporal weight
    const temporalWeight = calculateTemporalWeight(timestamp);
    
    // Apply weights
    const weight = temporalWeight * credibility;
    weightedSum += adjustedResilience * weight;
    totalWeight += weight;
  }
  
  // Normalize to 0-100 range
  const hri = (weightedSum / totalWeight) * 100;
  
  return Math.max(0, Math.min(100, Math.round(hri)));
}

/**
 * Calculate Anger & Crisis Index (ACI)
 */
export function calculateACI(input: DCFTInput): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < input.emotionVectors.length; i++) {
    const emotions = input.emotionVectors[i];
    const timestamp = input.timestamps[i];
    const credibility = input.credibilityScores[i];
    
    const reinforced = calculateEmotionReinforcement(emotions);
    const anger = reinforced.anger;
    
    const temporalWeight = calculateTemporalWeight(timestamp);
    const weight = temporalWeight * credibility;
    
    weightedSum += anger * weight;
    totalWeight += weight;
  }
  
  const aci = (weightedSum / totalWeight) * 100;
  return Math.max(0, Math.min(100, Math.round(aci)));
}

/**
 * Calculate Sadness & Despair Index (SDI)
 */
export function calculateSDI(input: DCFTInput): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < input.emotionVectors.length; i++) {
    const emotions = input.emotionVectors[i];
    const timestamp = input.timestamps[i];
    const credibility = input.credibilityScores[i];
    
    const reinforced = calculateEmotionReinforcement(emotions);
    const sadness = reinforced.sadness;
    
    const temporalWeight = calculateTemporalWeight(timestamp);
    const weight = temporalWeight * credibility;
    
    weightedSum += sadness * weight;
    totalWeight += weight;
  }
  
  const sdi = (weightedSum / totalWeight) * 100;
  return Math.max(0, Math.min(100, Math.round(sdi)));
}

/**
 * Calculate overall confidence based on data quality and quantity
 */
export function calculateDCFTConfidence(input: DCFTInput): number {
  // Base confidence from data quantity
  const quantityConfidence = Math.min(1, input.emotionVectors.length / 20);
  
  // Credibility confidence
  const avgCredibility = input.credibilityScores.reduce((a, b) => a + b, 0) / input.credibilityScores.length;
  
  // Temporal diversity (data spread across time)
  const timeRange = Math.max(...input.timestamps.map(t => t.getTime())) - 
                    Math.min(...input.timestamps.map(t => t.getTime()));
  const temporalConfidence = Math.min(1, timeRange / (30 * 24 * 60 * 60 * 1000)); // 30 days
  
  // Combined confidence
  const confidence = (quantityConfidence * 0.4 + avgCredibility * 0.4 + temporalConfidence * 0.2);
  
  return Math.round(confidence * 100) / 100;
}

/**
 * Calculate all DCFT indices
 */
export function calculateDCFTIndices(input: DCFTInput): DCFTOutput {
  if (input.emotionVectors.length === 0) {
    return {
      gmi: 0,
      cfi: 50,
      hri: 50,
      aci: 0,
      sdi: 0,
      confidence: 0,
      breakdown: {
        positiveEnergy: 0,
        negativeEnergy: 0,
        neutralEnergy: 100,
        emotionalIntensity: 0,
      },
    };
  }

  const gmi = calculateGMI(input);
  const cfi = calculateCFI(input);
  const hri = calculateHRI(input);
  const aci = calculateACI(input);
  const sdi = calculateSDI(input);
  const confidence = calculateDCFTConfidence(input);

  // Calculate energy breakdown
  const positiveEnergy = (hri + Math.max(0, gmi)) / 2;
  const negativeEnergy = (cfi + aci + sdi) / 3;
  const neutralEnergy = 100 - positiveEnergy - negativeEnergy;
  
  // Calculate emotional intensity
  const avgIntensity = (Math.abs(gmi) + cfi + hri + aci + sdi) / 5;

  return {
    gmi,
    cfi,
    hri,
    aci,
    sdi,
    confidence,
    breakdown: {
      positiveEnergy: Math.round(positiveEnergy),
      negativeEnergy: Math.round(negativeEnergy),
      neutralEnergy: Math.round(Math.max(0, neutralEnergy)),
      emotionalIntensity: Math.round(avgIntensity),
    },
  };
}
