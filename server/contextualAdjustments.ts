/**
 * Contextual Adjustments Module
 * 
 * Applies topic-specific, country-specific, and cultural adjustments to indices
 * to ensure different topics and countries get different emotional readings
 * 
 * Problem: Same indices for different topics (GMI: 0, CFI: 67, HRI: 67)
 * Solution: Apply contextual multipliers based on:
 * 1. Topic/subject matter
 * 2. Country/region
 * 3. Cultural context
 */

export interface ContextualFactors {
  topic?: string;
  country?: string;
  culturalRegion?: string;
  eventType?: string;
}

/**
 * Topic-specific multipliers
 * Different topics naturally have different emotional profiles
 */
const TOPIC_MULTIPLIERS: Record<string, { gmi: number; cfi: number; hri: number }> = {
  // Political topics - higher fear, lower hope
  'politics': { gmi: 0.6, cfi: 1.4, hri: 0.7 },
  'election': { gmi: 0.5, cfi: 1.5, hri: 0.6 },
  'government': { gmi: 0.65, cfi: 1.3, hri: 0.75 },
  'conflict': { gmi: 0.4, cfi: 1.8, hri: 0.4 },
  'war': { gmi: 0.2, cfi: 2.0, hri: 0.3 },
  'assassination': { gmi: 0.1, cfi: 1.9, hri: 0.2 },
  
  // Economic topics - mixed emotions
  'economy': { gmi: 0.7, cfi: 1.1, hri: 0.9 },
  'business': { gmi: 0.8, cfi: 0.9, hri: 1.0 },
  'investment': { gmi: 0.75, cfi: 1.0, hri: 1.1 },
  'inflation': { gmi: 0.5, cfi: 1.4, hri: 0.6 },
  'unemployment': { gmi: 0.4, cfi: 1.5, hri: 0.5 },
  
  // Social topics - higher hope
  'society': { gmi: 0.9, cfi: 0.8, hri: 1.2 },
  'culture': { gmi: 1.0, cfi: 0.7, hri: 1.3 },
  'education': { gmi: 0.95, cfi: 0.7, hri: 1.4 },
  'health': { gmi: 0.8, cfi: 1.0, hri: 1.1 },
  'environment': { gmi: 0.6, cfi: 1.2, hri: 0.8 },
  
  // Security topics - very high fear
  'security': { gmi: 0.3, cfi: 1.7, hri: 0.4 },
  'terrorism': { gmi: 0.1, cfi: 2.0, hri: 0.2 },
  'crime': { gmi: 0.4, cfi: 1.6, hri: 0.5 },
  
  // Sports/Entertainment - higher hope
  'sports': { gmi: 1.1, cfi: 0.6, hri: 1.5 },
  'entertainment': { gmi: 1.2, cfi: 0.5, hri: 1.6 },
  'technology': { gmi: 1.0, cfi: 0.8, hri: 1.3 },
};

/**
 * Country/region-specific multipliers
 * Different regions have different baseline emotional responses
 */
const COUNTRY_MULTIPLIERS: Record<string, { gmi: number; cfi: number; hri: number }> = {
  // Middle East & North Africa
  'LY': { gmi: 0.5, cfi: 1.4, hri: 0.7 }, // Libya - conflict-affected
  'SY': { gmi: 0.3, cfi: 1.8, hri: 0.4 }, // Syria - ongoing crisis
  'IQ': { gmi: 0.4, cfi: 1.6, hri: 0.5 }, // Iraq - post-conflict
  'PS': { gmi: 0.4, cfi: 1.7, hri: 0.5 }, // Palestine - ongoing conflict
  'YE': { gmi: 0.2, cfi: 1.9, hri: 0.3 }, // Yemen - humanitarian crisis
  'SA': { gmi: 0.8, cfi: 0.9, hri: 1.1 }, // Saudi Arabia - stable economy
  'AE': { gmi: 0.9, cfi: 0.7, hri: 1.3 }, // UAE - prosperous
  'EG': { gmi: 0.6, cfi: 1.2, hri: 0.8 }, // Egypt - mixed situation
  'JO': { gmi: 0.7, cfi: 1.0, hri: 1.0 }, // Jordan - relatively stable
  'LB': { gmi: 0.4, cfi: 1.5, hri: 0.6 }, // Lebanon - economic crisis
  
  // Europe
  'DE': { gmi: 0.95, cfi: 0.6, hri: 1.2 }, // Germany - stable
  'FR': { gmi: 0.9, cfi: 0.7, hri: 1.1 }, // France - stable
  'GB': { gmi: 0.85, cfi: 0.8, hri: 1.0 }, // UK - stable
  'IT': { gmi: 0.8, cfi: 0.9, hri: 1.0 }, // Italy - mixed
  'ES': { gmi: 0.85, cfi: 0.8, hri: 1.0 }, // Spain - stable
  'RU': { gmi: 0.5, cfi: 1.3, hri: 0.7 }, // Russia - geopolitical tensions
  'UA': { gmi: 0.2, cfi: 1.9, hri: 0.3 }, // Ukraine - conflict
  
  // Americas
  'US': { gmi: 0.8, cfi: 0.9, hri: 1.1 }, // USA - mixed
  'CA': { gmi: 0.9, cfi: 0.7, hri: 1.2 }, // Canada - stable
  'MX': { gmi: 0.6, cfi: 1.2, hri: 0.8 }, // Mexico - security issues
  'BR': { gmi: 0.7, cfi: 1.0, hri: 0.9 }, // Brazil - mixed
  
  // Asia
  'CN': { gmi: 0.8, cfi: 0.8, hri: 1.0 }, // China - stable
  'IN': { gmi: 0.75, cfi: 0.9, hri: 1.0 }, // India - mixed
  'JP': { gmi: 0.85, cfi: 0.8, hri: 1.1 }, // Japan - stable
  'KR': { gmi: 0.8, cfi: 0.9, hri: 1.0 }, // South Korea - stable
  'TH': { gmi: 0.7, cfi: 1.0, hri: 0.9 }, // Thailand - mixed
  'PH': { gmi: 0.7, cfi: 1.0, hri: 0.9 }, // Philippines - mixed
  
  // Africa
  'NG': { gmi: 0.6, cfi: 1.2, hri: 0.8 }, // Nigeria - security issues
  'KE': { gmi: 0.65, cfi: 1.1, hri: 0.85 }, // Kenya - mixed
  'ZA': { gmi: 0.7, cfi: 1.0, hri: 0.9 }, // South Africa - mixed
  'ET': { gmi: 0.6, cfi: 1.2, hri: 0.8 }, // Ethiopia - conflict
};

/**
 * Cultural region multipliers
 * Broader cultural zones with similar emotional baselines
 */
const CULTURAL_REGION_MULTIPLIERS: Record<string, { gmi: number; cfi: number; hri: number }> = {
  'middle_east': { gmi: 0.5, cfi: 1.4, hri: 0.7 },
  'north_africa': { gmi: 0.55, cfi: 1.3, hri: 0.75 },
  'sub_saharan_africa': { gmi: 0.65, cfi: 1.1, hri: 0.85 },
  'europe': { gmi: 0.9, cfi: 0.7, hri: 1.1 },
  'americas': { gmi: 0.8, cfi: 0.9, hri: 1.0 },
  'east_asia': { gmi: 0.85, cfi: 0.8, hri: 1.1 },
  'south_asia': { gmi: 0.7, cfi: 1.0, hri: 0.9 },
  'southeast_asia': { gmi: 0.7, cfi: 1.0, hri: 0.9 },
};

/**
 * Get topic multiplier
 */
export function getTopicMultiplier(topic?: string): { gmi: number; cfi: number; hri: number } {
  if (!topic) return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
  
  const normalized = topic.toLowerCase();
  
  // Direct match
  if (TOPIC_MULTIPLIERS[normalized]) {
    return TOPIC_MULTIPLIERS[normalized];
  }
  
  // Keyword matching
  for (const [key, multiplier] of Object.entries(TOPIC_MULTIPLIERS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return multiplier;
    }
  }
  
  return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
}

/**
 * Get country multiplier
 */
export function getCountryMultiplier(country?: string): { gmi: number; cfi: number; hri: number } {
  if (!country) return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
  
  const normalized = country.toUpperCase();
  
  if (COUNTRY_MULTIPLIERS[normalized]) {
    return COUNTRY_MULTIPLIERS[normalized];
  }
  
  return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
}

/**
 * Get cultural region multiplier
 */
export function getCulturalRegionMultiplier(region?: string): { gmi: number; cfi: number; hri: number } {
  if (!region) return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
  
  const normalized = region.toLowerCase().replace(/\s+/g, '_');
  
  if (CULTURAL_REGION_MULTIPLIERS[normalized]) {
    return CULTURAL_REGION_MULTIPLIERS[normalized];
  }
  
  return { gmi: 1.0, cfi: 1.0, hri: 1.0 };
}

/**
 * Apply all contextual adjustments
 */
export function applyContextualAdjustments(
  baseIndices: { gmi: number; cfi: number; hri: number },
  factors: ContextualFactors
): { gmi: number; cfi: number; hri: number } {
  let adjusted = { ...baseIndices };
  
  // Apply topic multiplier
  const topicMult = getTopicMultiplier(factors.topic);
  adjusted.gmi *= topicMult.gmi;
  adjusted.cfi *= topicMult.cfi;
  adjusted.hri *= topicMult.hri;
  
  // Apply country multiplier
  const countryMult = getCountryMultiplier(factors.country);
  adjusted.gmi *= countryMult.gmi;
  adjusted.cfi *= countryMult.cfi;
  adjusted.hri *= countryMult.hri;
  
  // Apply cultural region multiplier (weighted less than country)
  const culturalMult = getCulturalRegionMultiplier(factors.culturalRegion);
  adjusted.gmi = adjusted.gmi * 0.9 + (adjusted.gmi * culturalMult.gmi) * 0.1;
  adjusted.cfi = adjusted.cfi * 0.9 + (adjusted.cfi * culturalMult.cfi) * 0.1;
  adjusted.hri = adjusted.hri * 0.9 + (adjusted.hri * culturalMult.hri) * 0.1;
  
  // Clamp to valid ranges
  adjusted.gmi = Math.max(-100, Math.min(100, Math.round(adjusted.gmi)));
  adjusted.cfi = Math.max(0, Math.min(100, Math.round(adjusted.cfi)));
  adjusted.hri = Math.max(0, Math.min(100, Math.round(adjusted.hri)));
  
  return adjusted;
}
