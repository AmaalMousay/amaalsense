/**
 * Temporal Decay Module
 * Based on DCFT Theory by Amaal Radwan
 * 
 * Implements the temporal persistence factor (ΔTi) and decay function (e^(-λΔt))
 * Emotions decay over time - recent events have more impact than older ones
 */

/**
 * Decay rate constants for different emotion types
 * λ (lambda) controls how fast emotions fade
 * Higher λ = faster decay
 */
export const DECAY_RATES = {
  // Fast-decaying emotions (hours)
  anger: 0.15,      // Anger fades relatively quickly
  curiosity: 0.12,  // Curiosity is fleeting
  
  // Medium-decaying emotions (days)
  joy: 0.08,        // Joy persists moderately
  fear: 0.06,       // Fear lingers longer
  
  // Slow-decaying emotions (weeks)
  sadness: 0.04,    // Sadness persists longer
  hope: 0.03,       // Hope is most persistent
};

/**
 * Default decay rate for general calculations
 */
export const DEFAULT_DECAY_RATE = 0.07;

/**
 * Calculate temporal decay factor
 * Formula: e^(-λΔt)
 * 
 * @param deltaTime - Time difference in hours
 * @param lambda - Decay rate (default: 0.07)
 * @returns Decay factor between 0 and 1
 */
export function calculateDecayFactor(
  deltaTime: number,
  lambda: number = DEFAULT_DECAY_RATE
): number {
  return Math.exp(-lambda * deltaTime);
}

/**
 * Calculate emotion-specific decay factor
 * Different emotions decay at different rates
 * 
 * @param emotion - The emotion type
 * @param deltaTimeHours - Time difference in hours
 * @returns Decay factor between 0 and 1
 */
export function calculateEmotionDecay(
  emotion: keyof typeof DECAY_RATES,
  deltaTimeHours: number
): number {
  const lambda = DECAY_RATES[emotion] || DEFAULT_DECAY_RATE;
  return calculateDecayFactor(deltaTimeHours, lambda);
}

/**
 * Calculate temporal persistence (ΔTi)
 * How long an emotion persists across users
 * 
 * @param startTime - When the emotion was first detected
 * @param endTime - When the emotion was last detected
 * @param currentTime - Current time
 * @returns Persistence factor
 */
export function calculateTemporalPersistence(
  startTime: Date,
  endTime: Date,
  currentTime: Date = new Date()
): number {
  const duration = endTime.getTime() - startTime.getTime();
  const age = currentTime.getTime() - endTime.getTime();
  
  // Duration in hours
  const durationHours = duration / (1000 * 60 * 60);
  const ageHours = age / (1000 * 60 * 60);
  
  // Persistence increases with duration, decreases with age
  const persistence = Math.log1p(durationHours) * calculateDecayFactor(ageHours);
  
  return Math.max(0, Math.min(1, persistence));
}

/**
 * Calculate time-weighted value
 * Applies decay to a value based on its age
 * 
 * @param value - The original value
 * @param timestamp - When the value was recorded
 * @param currentTime - Current time (default: now)
 * @param lambda - Decay rate
 * @returns Time-weighted value
 */
export function applyTimeDecay(
  value: number,
  timestamp: Date,
  currentTime: Date = new Date(),
  lambda: number = DEFAULT_DECAY_RATE
): number {
  const deltaTimeHours = (currentTime.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
  const decayFactor = calculateDecayFactor(deltaTimeHours, lambda);
  return value * decayFactor;
}

/**
 * Calculate half-life of an emotion
 * Time it takes for emotion intensity to reduce by half
 * 
 * @param lambda - Decay rate
 * @returns Half-life in hours
 */
export function calculateHalfLife(lambda: number): number {
  return Math.LN2 / lambda;
}

/**
 * Get emotion half-lives for reference
 */
export function getEmotionHalfLives(): Record<string, number> {
  return {
    anger: calculateHalfLife(DECAY_RATES.anger),      // ~4.6 hours
    curiosity: calculateHalfLife(DECAY_RATES.curiosity), // ~5.8 hours
    joy: calculateHalfLife(DECAY_RATES.joy),          // ~8.7 hours
    fear: calculateHalfLife(DECAY_RATES.fear),        // ~11.6 hours
    sadness: calculateHalfLife(DECAY_RATES.sadness),  // ~17.3 hours
    hope: calculateHalfLife(DECAY_RATES.hope),        // ~23.1 hours
  };
}

/**
 * Calculate cumulative decay for a time series
 * Used for aggregating historical emotional data
 * 
 * @param values - Array of {value, timestamp} pairs
 * @param currentTime - Current time
 * @param lambda - Decay rate
 * @returns Cumulative decayed value
 */
export function calculateCumulativeDecay(
  values: { value: number; timestamp: Date }[],
  currentTime: Date = new Date(),
  lambda: number = DEFAULT_DECAY_RATE
): number {
  return values.reduce((sum, { value, timestamp }) => {
    return sum + applyTimeDecay(value, timestamp, currentTime, lambda);
  }, 0);
}
