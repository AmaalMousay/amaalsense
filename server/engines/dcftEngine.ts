/**
 * Digital Consciousness Field Theory (DCFT) Engine
 * 
 * Implements the mathematical models from the scientific paper:
 * "The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind"
 * by Amaal Radwan (2025)
 */

// Affective Vector type - 6 emotional dimensions
export interface AffectiveVector {
  joy: number;      // -1 to +1
  fear: number;     // -1 to +1
  anger: number;    // -1 to +1
  sadness: number;  // -1 to +1
  hope: number;     // -1 to +1
  curiosity: number; // -1 to +1
}

// Digital event with emotional data
export interface DigitalEvent {
  id: string;
  timestamp: number;
  affectiveVector: AffectiveVector;
  influence: number;      // Wi - weighting based on reach/virality (0-1)
  source: string;
  country?: string;
  text?: string;
}

// Resonance Index for each emotion
export interface ResonanceIndex {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
  timestamp: number;
}

// Collective Emotional Phase
export interface CollectiveEmotionalPhase {
  dominantEmotion: keyof AffectiveVector;
  intensity: number;
  coherence: number;  // How synchronized the emotions are (0-1)
  description: string;
}

// DCFT Configuration
const DCFT_CONFIG = {
  // Lambda (λ) - decay rate for temporal persistence
  // Higher values = faster decay
  decayRate: 0.1,
  
  // Threshold for detecting collective emotional phases
  phaseThreshold: 0.6,
  
  // Coherence threshold for wave detection
  coherenceThreshold: 0.5,
  
  // Time window for calculations (in milliseconds)
  timeWindow: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Calculate D(t) - Digital Consciousness Field amplitude
 * D(t) = Σ [Ei × Wi × ΔTi]
 * 
 * @param events - Array of digital events
 * @param currentTime - Current timestamp
 * @returns The consciousness amplitude value
 */
export function calculateDigitalConsciousnessField(
  events: DigitalEvent[],
  currentTime: number = Date.now()
): number {
  if (events.length === 0) return 0;

  let totalAmplitude = 0;

  for (const event of events) {
    // Ei - Emotional intensity (magnitude of affective vector)
    const Ei = calculateEmotionalIntensity(event.affectiveVector);
    
    // Wi - Influence weighting
    const Wi = event.influence;
    
    // ΔTi - Temporal persistence factor (decays over time)
    const timeDelta = (currentTime - event.timestamp) / 1000; // Convert to seconds
    const deltaTi = Math.exp(-DCFT_CONFIG.decayRate * timeDelta / 3600); // Decay per hour
    
    // D(t) contribution from this event
    totalAmplitude += Ei * Wi * deltaTi;
  }

  // Normalize to -100 to +100 range
  return Math.max(-100, Math.min(100, totalAmplitude * 10));
}

/**
 * Calculate emotional intensity (magnitude of affective vector)
 */
export function calculateEmotionalIntensity(av: AffectiveVector): number {
  const values = Object.values(av);
  const sumOfSquares = values.reduce((sum, v) => sum + v * v, 0);
  return Math.sqrt(sumOfSquares / values.length);
}

/**
 * Calculate Resonance Index for each emotion
 * RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
 * 
 * @param events - Array of digital events
 * @param currentTime - Current timestamp
 * @returns Resonance indices for all emotions
 */
export function calculateResonanceIndex(
  events: DigitalEvent[],
  currentTime: number = Date.now()
): ResonanceIndex {
  const resonance: ResonanceIndex = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
    timestamp: currentTime,
  };

  if (events.length === 0) return resonance;

  const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

  for (const emotion of emotions) {
    let totalResonance = 0;

    for (const event of events) {
      // AVi - Affective vector value for this emotion
      const AVi = event.affectiveVector[emotion];
      
      // Wi - Influence weighting
      const Wi = event.influence;
      
      // e^(-λΔt) - Exponential decay
      const timeDelta = (currentTime - event.timestamp) / 1000;
      const decay = Math.exp(-DCFT_CONFIG.decayRate * timeDelta / 3600);
      
      // RI contribution
      totalResonance += AVi * Wi * decay;
    }

    // Normalize to -1 to +1 range
    resonance[emotion] = Math.max(-1, Math.min(1, totalResonance / Math.max(events.length, 1)));
  }

  return resonance;
}

/**
 * Detect coherent emotional waves
 * When large populations express similar emotions simultaneously
 */
export function detectEmotionalWaves(
  events: DigitalEvent[],
  currentTime: number = Date.now()
): { detected: boolean; emotion: keyof AffectiveVector | null; coherence: number } {
  if (events.length < 10) {
    return { detected: false, emotion: null, coherence: 0 };
  }

  const resonance = calculateResonanceIndex(events, currentTime);
  const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

  // Find the dominant emotion
  let maxResonance = 0;
  let dominantEmotion: keyof AffectiveVector | null = null;

  for (const emotion of emotions) {
    const absResonance = Math.abs(resonance[emotion]);
    if (absResonance > maxResonance) {
      maxResonance = absResonance;
      dominantEmotion = emotion;
    }
  }

  // Calculate coherence - how synchronized the emotions are
  const coherence = calculateCoherence(events, dominantEmotion);

  return {
    detected: coherence >= DCFT_CONFIG.coherenceThreshold && maxResonance >= 0.3,
    emotion: dominantEmotion,
    coherence,
  };
}

/**
 * Calculate emotional coherence across events
 */
function calculateCoherence(events: DigitalEvent[], emotion: keyof AffectiveVector | null): number {
  if (!emotion || events.length < 2) return 0;

  const values = events.map(e => e.affectiveVector[emotion]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Calculate variance
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  
  // Low variance = high coherence
  // Transform variance to coherence score (0-1)
  const coherence = Math.exp(-variance * 2);
  
  return coherence;
}

/**
 * Identify collective emotional phase
 */
export function identifyCollectivePhase(
  events: DigitalEvent[],
  currentTime: number = Date.now()
): CollectiveEmotionalPhase {
  const resonance = calculateResonanceIndex(events, currentTime);
  const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

  // Find dominant emotion
  let maxResonance = 0;
  let dominantEmotion: keyof AffectiveVector = 'joy';

  for (const emotion of emotions) {
    const absResonance = Math.abs(resonance[emotion]);
    if (absResonance > maxResonance) {
      maxResonance = absResonance;
      dominantEmotion = emotion;
    }
  }

  const coherence = calculateCoherence(events, dominantEmotion);
  const intensity = maxResonance;

  // Generate description based on phase
  const description = generatePhaseDescription(dominantEmotion, intensity, coherence);

  return {
    dominantEmotion,
    intensity,
    coherence,
    description,
  };
}

/**
 * Generate human-readable phase description
 */
function generatePhaseDescription(
  emotion: keyof AffectiveVector,
  intensity: number,
  coherence: number
): string {
  const intensityLevel = intensity > 0.7 ? 'strong' : intensity > 0.4 ? 'moderate' : 'mild';
  const coherenceLevel = coherence > 0.7 ? 'highly synchronized' : coherence > 0.4 ? 'moderately aligned' : 'dispersed';

  const emotionDescriptions: Record<keyof AffectiveVector, string> = {
    joy: 'collective optimism and celebration',
    fear: 'widespread anxiety and uncertainty',
    anger: 'collective frustration and activism',
    sadness: 'shared grief and melancholy',
    hope: 'emerging resilience and anticipation',
    curiosity: 'collective exploration and inquiry',
  };

  return `A ${intensityLevel} wave of ${emotionDescriptions[emotion]} is detected, with ${coherenceLevel} emotional patterns across the digital field.`;
}

/**
 * Calculate the three main indices from DCFT
 */
export function calculateDCFTIndices(
  events: DigitalEvent[],
  currentTime: number = Date.now()
): { GMI: number; CFI: number; HRI: number } {
  const resonance = calculateResonanceIndex(events, currentTime);
  const dcf = calculateDigitalConsciousnessField(events, currentTime);

  // GMI (Global Mood Index) - general optimism or pessimism
  // Combines joy, hope vs sadness, fear, anger
  const positiveSum = resonance.joy + resonance.hope + resonance.curiosity;
  const negativeSum = resonance.sadness + resonance.fear + resonance.anger;
  const GMI = Math.max(-100, Math.min(100, (positiveSum - negativeSum) * 33.33));

  // CFI (Collective Fear Index) - probability of crisis
  // Weighted combination of fear and anger with decay
  const CFI = Math.max(0, Math.min(100, 
    (Math.abs(resonance.fear) * 60 + Math.abs(resonance.anger) * 30 + Math.abs(resonance.sadness) * 10)
  ));

  // HRI (Hope Resonance Index) - potential for recovery
  // Combines hope, joy, and curiosity
  const HRI = Math.max(0, Math.min(100,
    ((resonance.hope + 1) * 40 + (resonance.joy + 1) * 35 + (resonance.curiosity + 1) * 25) / 2
  ));

  return { GMI, CFI, HRI };
}

/**
 * Get color based on emotional state (from paper)
 * Blue = calm/reflection
 * Red = anger/activism
 * Yellow = optimism/creativity
 * Green = balance/collective harmony
 */
export function getEmotionalColor(resonance: ResonanceIndex): {
  primary: string;
  secondary: string;
  description: string;
} {
  const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];
  
  // Find dominant emotion
  let maxVal = 0;
  let dominant: keyof AffectiveVector = 'joy';
  
  for (const emotion of emotions) {
    if (Math.abs(resonance[emotion]) > maxVal) {
      maxVal = Math.abs(resonance[emotion]);
      dominant = emotion;
    }
  }

  // Calculate balance score
  const balance = 1 - (maxVal / 1);

  // Color mapping based on paper
  const colorMap: Record<keyof AffectiveVector, { primary: string; secondary: string; description: string }> = {
    joy: { primary: '#FFD700', secondary: '#FFA500', description: 'Optimism & Creativity' },
    fear: { primary: '#4169E1', secondary: '#1E90FF', description: 'Calm & Reflection' },
    anger: { primary: '#DC143C', secondary: '#FF4500', description: 'Anger & Activism' },
    sadness: { primary: '#4682B4', secondary: '#5F9EA0', description: 'Melancholy & Introspection' },
    hope: { primary: '#32CD32', secondary: '#90EE90', description: 'Balance & Harmony' },
    curiosity: { primary: '#9370DB', secondary: '#BA55D3', description: 'Exploration & Discovery' },
  };

  // If balanced, return green
  if (balance > 0.7) {
    return { primary: '#228B22', secondary: '#32CD32', description: 'Collective Harmony' };
  }

  return colorMap[dominant];
}

/**
 * Generate emotional forecast (Emotional Weather System)
 */
export function generateEmotionalForecast(
  historicalData: { timestamp: number; indices: { GMI: number; CFI: number; HRI: number } }[],
  hoursAhead: number = 24
): {
  predictedGMI: number;
  predictedCFI: number;
  predictedHRI: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  forecast: string;
} {
  if (historicalData.length < 3) {
    return {
      predictedGMI: 0,
      predictedCFI: 50,
      predictedHRI: 50,
      trend: 'stable',
      confidence: 0.3,
      forecast: 'Insufficient data for accurate forecast. Emotional climate appears stable.',
    };
  }

  // Sort by timestamp
  const sorted = [...historicalData].sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate trends using linear regression
  const gmiTrend = calculateTrend(sorted.map(d => d.indices.GMI));
  const cfiTrend = calculateTrend(sorted.map(d => d.indices.CFI));
  const hriTrend = calculateTrend(sorted.map(d => d.indices.HRI));

  // Get latest values
  const latest = sorted[sorted.length - 1].indices;

  // Project future values
  const predictedGMI = Math.max(-100, Math.min(100, latest.GMI + gmiTrend * hoursAhead));
  const predictedCFI = Math.max(0, Math.min(100, latest.CFI + cfiTrend * hoursAhead));
  const predictedHRI = Math.max(0, Math.min(100, latest.HRI + hriTrend * hoursAhead));

  // Determine overall trend
  const overallTrend = gmiTrend + hriTrend - cfiTrend;
  const trend: 'improving' | 'stable' | 'declining' = 
    overallTrend > 0.5 ? 'improving' : 
    overallTrend < -0.5 ? 'declining' : 'stable';

  // Calculate confidence based on data consistency
  const confidence = Math.min(0.9, 0.3 + (sorted.length / 100) * 0.6);

  // Generate forecast text
  const forecast = generateForecastText(predictedGMI, predictedCFI, predictedHRI, trend, hoursAhead);

  return {
    predictedGMI,
    predictedCFI,
    predictedHRI,
    trend,
    confidence,
    forecast,
  };
}

/**
 * Calculate trend using simple linear regression
 */
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return isNaN(slope) ? 0 : slope;
}

/**
 * Generate human-readable forecast text
 */
function generateForecastText(
  gmi: number,
  cfi: number,
  hri: number,
  trend: string,
  hours: number
): string {
  const timeframe = hours <= 6 ? 'the next few hours' : 
                    hours <= 24 ? 'the next day' : 
                    hours <= 168 ? 'the coming week' : 'the foreseeable future';

  let forecast = `Emotional Weather Forecast for ${timeframe}: `;

  if (trend === 'improving') {
    forecast += `The collective emotional climate is expected to improve. `;
    if (hri > 60) {
      forecast += `Strong hope resonance suggests growing optimism and resilience. `;
    }
    if (cfi < 40) {
      forecast += `Fear levels are expected to remain low. `;
    }
  } else if (trend === 'declining') {
    forecast += `The emotional atmosphere may face some challenges. `;
    if (cfi > 60) {
      forecast += `Elevated collective fear index suggests increased anxiety. `;
    }
    if (gmi < 0) {
      forecast += `Overall mood may trend toward pessimism. `;
    }
  } else {
    forecast += `The emotional climate is expected to remain relatively stable. `;
  }

  // Add specific recommendations
  if (cfi > 70) {
    forecast += `⚠️ High fear alert: Consider monitoring for potential crisis indicators.`;
  } else if (hri > 70 && gmi > 30) {
    forecast += `✨ Positive outlook: Favorable conditions for collective initiatives.`;
  }

  return forecast;
}

/**
 * Check for alert conditions (Early Warning System)
 */
export function checkAlertConditions(
  currentIndices: { GMI: number; CFI: number; HRI: number },
  previousIndices: { GMI: number; CFI: number; HRI: number } | null
): {
  hasAlert: boolean;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  alerts: string[];
} {
  const alerts: string[] = [];
  let alertLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // Check absolute thresholds
  if (currentIndices.CFI > 80) {
    alerts.push('🚨 CRITICAL: Collective Fear Index exceeds critical threshold (80)');
    alertLevel = 'critical';
  } else if (currentIndices.CFI > 65) {
    alerts.push('⚠️ HIGH: Collective Fear Index is elevated (>65)');
    alertLevel = 'high';
  }

  if (currentIndices.HRI < 20) {
    alerts.push('🚨 CRITICAL: Hope Resonance Index critically low (<20)');
    alertLevel = 'critical';
  } else if (currentIndices.HRI < 35) {
    alerts.push('⚠️ WARNING: Hope Resonance Index is declining (<35)');
    if (alertLevel === 'low') alertLevel = 'medium';
  }

  if (currentIndices.GMI < -50) {
    alerts.push('⚠️ WARNING: Global Mood Index indicates widespread pessimism');
    if (alertLevel === 'low') alertLevel = 'medium';
  }

  // Check rate of change if we have previous data
  if (previousIndices) {
    const cfiChange = currentIndices.CFI - previousIndices.CFI;
    const hriChange = currentIndices.HRI - previousIndices.HRI;
    const gmiChange = currentIndices.GMI - previousIndices.GMI;

    if (cfiChange > 20) {
      alerts.push(`📈 RAPID CHANGE: CFI increased by ${cfiChange.toFixed(1)} points`);
      if (alertLevel === 'low') alertLevel = 'medium';
    }

    if (hriChange < -20) {
      alerts.push(`📉 RAPID CHANGE: HRI decreased by ${Math.abs(hriChange).toFixed(1)} points`);
      if (alertLevel === 'low') alertLevel = 'medium';
    }

    if (Math.abs(gmiChange) > 30) {
      alerts.push(`🔄 SIGNIFICANT SHIFT: GMI changed by ${gmiChange.toFixed(1)} points`);
    }
  }

  return {
    hasAlert: alerts.length > 0,
    alertLevel,
    alerts,
  };
}

export default {
  calculateDigitalConsciousnessField,
  calculateResonanceIndex,
  detectEmotionalWaves,
  identifyCollectivePhase,
  calculateDCFTIndices,
  getEmotionalColor,
  generateEmotionalForecast,
  checkAlertConditions,
};
