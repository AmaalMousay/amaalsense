/**
 * Influence Weighting Module
 * Based on DCFT Theory by Amaal Radwan
 * 
 * Wi = Influence weighting based on reach or virality
 * Different sources and content have different levels of influence
 */

/**
 * Source influence multipliers
 * Based on typical reach and credibility
 */
export const SOURCE_WEIGHTS = {
  // High influence sources
  news: 1.5,           // News articles have high credibility
  government: 2.0,     // Government sources have highest weight
  academic: 1.8,       // Academic sources are highly credible
  
  // Medium influence sources
  youtube: 1.2,        // YouTube has wide reach
  reddit: 1.0,         // Reddit represents community sentiment
  telegram: 0.9,       // Telegram channels vary in influence
  
  // Lower influence sources (but still valuable)
  mastodon: 0.7,       // Smaller but engaged community
  bluesky: 0.8,        // Growing platform
  twitter: 1.1,        // Wide reach but mixed credibility
};

/**
 * Engagement thresholds for virality calculation
 */
const VIRALITY_THRESHOLDS = {
  low: 100,
  medium: 1000,
  high: 10000,
  viral: 100000,
};

/**
 * Calculate influence weight for a single event
 * Formula: Wi = sourceWeight × reachFactor × engagementFactor × credibilityFactor
 * 
 * @param source - Source platform
 * @param reach - Number of people reached
 * @param engagement - Total engagement (likes, shares, comments)
 * @param credibility - Source credibility score (0-1)
 * @returns Influence weight (typically 0-10)
 */
export function calculateInfluenceWeight(
  source: keyof typeof SOURCE_WEIGHTS | string,
  reach: number,
  engagement: number,
  credibility: number = 0.8
): number {
  // Get source base weight
  const sourceWeight = SOURCE_WEIGHTS[source as keyof typeof SOURCE_WEIGHTS] || 1.0;
  
  // Calculate reach factor (logarithmic scale)
  const reachFactor = Math.log10(Math.max(1, reach) + 1) / 4; // Normalized to ~0-2
  
  // Calculate engagement factor
  const engagementFactor = calculateEngagementFactor(engagement);
  
  // Combine factors
  const weight = sourceWeight * (1 + reachFactor) * engagementFactor * credibility;
  
  return Math.max(0.1, Math.min(10, weight)); // Clamp between 0.1 and 10
}

/**
 * Calculate engagement factor based on interaction count
 */
function calculateEngagementFactor(engagement: number): number {
  if (engagement >= VIRALITY_THRESHOLDS.viral) {
    return 2.0; // Viral content
  } else if (engagement >= VIRALITY_THRESHOLDS.high) {
    return 1.5; // High engagement
  } else if (engagement >= VIRALITY_THRESHOLDS.medium) {
    return 1.2; // Medium engagement
  } else if (engagement >= VIRALITY_THRESHOLDS.low) {
    return 1.0; // Low engagement
  }
  return 0.8; // Minimal engagement
}

/**
 * Calculate virality score
 * Based on engagement rate and spread velocity
 * 
 * @param engagement - Total engagement
 * @param reach - Total reach
 * @param hoursActive - Hours since first appearance
 * @returns Virality score (0-1)
 */
export function calculateViralityScore(
  engagement: number,
  reach: number,
  hoursActive: number
): number {
  if (reach === 0 || hoursActive === 0) return 0;
  
  // Engagement rate
  const engagementRate = engagement / reach;
  
  // Spread velocity (engagement per hour)
  const velocity = engagement / hoursActive;
  
  // Normalize velocity (assuming 1000 engagements/hour is very viral)
  const normalizedVelocity = Math.min(1, velocity / 1000);
  
  // Combine factors
  const virality = (engagementRate * 0.4 + normalizedVelocity * 0.6);
  
  return Math.min(1, virality);
}

/**
 * Calculate geographic influence factor
 * Events in larger populations have more weight
 * 
 * @param population - Population of the affected region
 * @param penetration - Percentage of population reached (0-1)
 * @returns Geographic influence factor
 */
export function calculateGeographicInfluence(
  population: number,
  penetration: number
): number {
  // Log scale for population (billions → ~3, millions → ~2, thousands → ~1)
  const populationFactor = Math.log10(Math.max(1, population)) / 9;
  
  // Penetration amplifies the effect
  const penetrationFactor = 1 + (penetration * 2);
  
  return populationFactor * penetrationFactor;
}

/**
 * Calculate author/source credibility
 * Based on historical accuracy and reputation
 * 
 * @param verifiedSource - Is the source verified?
 * @param historicalAccuracy - Past accuracy rate (0-1)
 * @param followerCount - Number of followers
 * @param accountAge - Account age in days
 * @returns Credibility score (0-1)
 */
export function calculateCredibility(
  verifiedSource: boolean,
  historicalAccuracy: number = 0.7,
  followerCount: number = 0,
  accountAge: number = 365
): number {
  let credibility = 0.5; // Base credibility
  
  // Verified sources get a boost
  if (verifiedSource) {
    credibility += 0.2;
  }
  
  // Historical accuracy is important
  credibility += historicalAccuracy * 0.2;
  
  // Follower count (logarithmic, capped)
  const followerFactor = Math.min(0.1, Math.log10(Math.max(1, followerCount)) / 70);
  credibility += followerFactor;
  
  // Account age (older accounts are more credible)
  const ageFactor = Math.min(0.1, accountAge / 3650); // Max at 10 years
  credibility += ageFactor;
  
  return Math.min(1, Math.max(0, credibility));
}

/**
 * Normalize weights for a collection of events
 * Ensures weights sum to 1 for proper aggregation
 * 
 * @param weights - Array of raw weights
 * @returns Normalized weights
 */
export function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map(w => w / sum);
}
