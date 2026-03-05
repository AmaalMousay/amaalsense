/**
 * Cultural Customization Engine - Fix Bug #5: Lack of Customization and Cultural Depth
 * 
 * Provides culturally-aware emotional interpretation and customization
 * for different regions, languages, and contexts
 */

export interface CulturalProfile {
  region: string; // e.g., 'MENA', 'Europe', 'Asia', 'Americas'
  language: string; // e.g., 'ar', 'en', 'fr', 'zh'
  emotionalContext: Record<string, number>; // Emotional baseline multipliers
  culturalValues: string[]; // e.g., 'family', 'honor', 'community', 'individualism'
  historicalContext: string; // Recent historical events that affect interpretation
  interpretationBias: Record<string, number>; // How to interpret certain emotions
}

export interface CulturalInterpretation {
  originalEmotion: string;
  culturalAdjustment: number; // -100 to +100
  culturalInterpretation: string;
  contextualMeaning: string;
  culturalSignificance: string;
  recommendations: string[];
}

export interface CustomizedAnalysis {
  baseAnalysis: any;
  culturalProfile: CulturalProfile;
  interpretations: CulturalInterpretation[];
  culturalDepth: number; // 0-100
  contextualRelevance: number; // 0-100
}

/**
 * Cultural profiles for different regions
 */
const CULTURAL_PROFILES: Record<string, CulturalProfile> = {
  // Middle East & North Africa
  MENA: {
    region: 'MENA',
    language: 'ar',
    emotionalContext: {
      joy: 1.2, // Celebrations are more expressive
      anger: 1.3, // Political/social issues are more sensitive
      hope: 1.4, // Religious/spiritual hope is significant
      fear: 1.1, // Security concerns are prominent
      sadness: 1.0,
      curiosity: 0.9,
    },
    culturalValues: ['family', 'honor', 'community', 'faith', 'hospitality'],
    historicalContext: 'Post-Arab Spring, ongoing regional conflicts, economic challenges',
    interpretationBias: {
      'family_issues': 1.5,
      'political_stability': 1.4,
      'economic_opportunity': 1.3,
      'religious_freedom': 1.2,
      'social_justice': 1.3,
    },
  },

  // Europe
  Europe: {
    region: 'Europe',
    language: 'en',
    emotionalContext: {
      joy: 1.0,
      anger: 0.9,
      hope: 1.1,
      fear: 0.8,
      sadness: 0.9,
      curiosity: 1.2,
    },
    culturalValues: ['individualism', 'democracy', 'innovation', 'sustainability', 'work-life balance'],
    historicalContext: 'Post-pandemic recovery, climate change concerns, political polarization',
    interpretationBias: {
      'environmental_issues': 1.4,
      'political_stability': 1.1,
      'economic_growth': 1.0,
      'social_equality': 1.3,
      'innovation': 1.2,
    },
  },

  // Asia
  Asia: {
    region: 'Asia',
    language: 'zh',
    emotionalContext: {
      joy: 1.1,
      anger: 0.8,
      hope: 1.3,
      fear: 0.9,
      sadness: 0.8,
      curiosity: 1.3,
    },
    culturalValues: ['harmony', 'family', 'education', 'respect', 'collective_good'],
    historicalContext: 'Rapid economic growth, technological advancement, generational shifts',
    interpretationBias: {
      'economic_opportunity': 1.5,
      'education': 1.4,
      'technology': 1.3,
      'family_values': 1.2,
      'social_harmony': 1.2,
    },
  },

  // Americas
  Americas: {
    region: 'Americas',
    language: 'en',
    emotionalContext: {
      joy: 1.1,
      anger: 1.0,
      hope: 1.2,
      fear: 0.9,
      sadness: 0.8,
      curiosity: 1.1,
    },
    culturalValues: ['freedom', 'opportunity', 'diversity', 'entrepreneurship', 'progress'],
    historicalContext: 'Economic inequality, immigration debates, political divisions',
    interpretationBias: {
      'economic_opportunity': 1.3,
      'political_freedom': 1.2,
      'social_justice': 1.2,
      'innovation': 1.1,
      'immigration': 1.3,
    },
  },
};

/**
 * Emotional interpretation mappings by culture
 */
const EMOTIONAL_INTERPRETATIONS: Record<string, Record<string, string>> = {
  MENA: {
    anger: 'Righteous indignation, call for justice',
    hope: 'Faith in divine intervention, community resilience',
    fear: 'Concern for family security, national stability',
    joy: 'Celebration of achievements, family gatherings',
    sadness: 'Collective mourning, empathy for suffering',
    curiosity: 'Desire for knowledge, seeking understanding',
  },
  Europe: {
    anger: 'Democratic protest, demand for accountability',
    hope: 'Optimism about innovation and progress',
    fear: 'Concern about climate change, political extremism',
    joy: 'Appreciation for quality of life, cultural experiences',
    sadness: 'Empathy for global suffering, environmental loss',
    curiosity: 'Intellectual exploration, scientific inquiry',
  },
  Asia: {
    anger: 'Collective frustration, call for harmony restoration',
    hope: 'Confidence in future prosperity, generational progress',
    fear: 'Concern for social stability, economic security',
    joy: 'Family pride, achievement celebration',
    sadness: 'Shared grief, collective responsibility',
    curiosity: 'Pursuit of excellence, mastery seeking',
  },
  Americas: {
    anger: 'Individual empowerment, demand for change',
    hope: 'Belief in opportunity and self-determination',
    fear: 'Concern for personal freedom and security',
    joy: 'Celebration of success and achievement',
    sadness: 'Individual loss, personal struggle',
    curiosity: 'Entrepreneurial spirit, exploration mindset',
  },
};

/**
 * Get cultural profile for a region
 */
export function getCulturalProfile(region: string): CulturalProfile | null {
  return CULTURAL_PROFILES[region] || null;
}

/**
 * Adjust emotion score based on cultural context
 */
export function adjustEmotionByCulture(
  emotion: string,
  score: number,
  culturalProfile: CulturalProfile
): number {
  const multiplier = culturalProfile.emotionalContext[emotion] || 1.0;
  return score * multiplier;
}

/**
 * Get cultural interpretation of an emotion
 */
export function getEmotionalInterpretation(
  emotion: string,
  region: string
): string {
  const interpretations = EMOTIONAL_INTERPRETATIONS[region];
  if (!interpretations) return emotion;
  
  return interpretations[emotion] || emotion;
}

/**
 * Calculate cultural significance of a topic
 */
export function calculateCulturalSignificance(
  topic: string,
  culturalProfile: CulturalProfile
): number {
  let significance = 50; // Base significance

  // Check if topic matches cultural values
  const topicLower = topic.toLowerCase();
  for (const value of culturalProfile.culturalValues) {
    if (topicLower.includes(value)) {
      significance += 15;
    }
  }

  // Check interpretation bias
  for (const [key, bias] of Object.entries(culturalProfile.interpretationBias)) {
    if (topicLower.includes(key)) {
      significance += (bias - 1.0) * 20;
    }
  }

  return Math.min(100, Math.max(0, significance));
}

/**
 * Interpret analysis through cultural lens
 */
export function interpretThroughCulturalLens(
  emotion: string,
  score: number,
  topic: string,
  culturalProfile: CulturalProfile
): CulturalInterpretation {
  // Adjust score
  const adjustedScore = adjustEmotionByCulture(emotion, score, culturalProfile);
  const adjustment = adjustedScore - score;

  // Get interpretation
  const interpretation = getEmotionalInterpretation(emotion, culturalProfile.region);

  // Calculate cultural significance
  const significance = calculateCulturalSignificance(topic, culturalProfile);

  // Generate contextual meaning
  let contextualMeaning = `In ${culturalProfile.region} context, ${interpretation.toLowerCase()}.`;
  if (culturalProfile.historicalContext) {
    contextualMeaning += ` Given recent history (${culturalProfile.historicalContext}), this is particularly relevant.`;
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (significance > 75) {
    recommendations.push(`This topic is highly significant in ${culturalProfile.region} culture`);
  }
  if (adjustment > 10) {
    recommendations.push(`The emotional intensity is amplified in this cultural context`);
  }
  if (adjustment < -10) {
    recommendations.push(`The emotional intensity is moderated in this cultural context`);
  }

  return {
    originalEmotion: emotion,
    culturalAdjustment: adjustment,
    culturalInterpretation: interpretation,
    contextualMeaning,
    culturalSignificance: `${significance.toFixed(0)}%`,
    recommendations,
  };
}

/**
 * Customize analysis for cultural context
 */
export function customizeAnalysisForCulture(
  baseAnalysis: any,
  region: string,
  topic: string
): CustomizedAnalysis {
  const culturalProfile = getCulturalProfile(region);
  if (!culturalProfile) {
    return {
      baseAnalysis,
      culturalProfile: CULTURAL_PROFILES['MENA'], // Default to MENA
      interpretations: [],
      culturalDepth: 0,
      contextualRelevance: 0,
    };
  }

  // Interpret each emotion
  const interpretations: CulturalInterpretation[] = [];
  const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

  for (const emotion of emotions) {
    if (baseAnalysis[emotion] !== undefined) {
      const interpretation = interpretThroughCulturalLens(
        emotion,
        baseAnalysis[emotion],
        topic,
        culturalProfile
      );
      interpretations.push(interpretation);
    }
  }

  // Calculate cultural depth
  const culturalDepth = Math.min(100, interpretations.length * 15 + calculateCulturalSignificance(topic, culturalProfile) * 0.3);

  // Calculate contextual relevance
  const contextualRelevance = calculateCulturalSignificance(topic, culturalProfile);

  return {
    baseAnalysis,
    culturalProfile,
    interpretations,
    culturalDepth: Math.round(culturalDepth),
    contextualRelevance: Math.round(contextualRelevance),
  };
}

/**
 * Generate culturally-aware summary
 */
export function generateCulturalSummary(customizedAnalysis: CustomizedAnalysis): string {
  const { baseAnalysis, culturalProfile, interpretations, culturalDepth, contextualRelevance } = customizedAnalysis;

  let summary = `# Cultural Analysis Summary\n\n`;
  summary += `**Region:** ${culturalProfile.region}\n`;
  summary += `**Cultural Depth:** ${culturalDepth}%\n`;
  summary += `**Contextual Relevance:** ${contextualRelevance}%\n\n`;

  summary += `## Emotional Interpretations\n`;
  for (const interpretation of interpretations) {
    summary += `\n### ${interpretation.originalEmotion.toUpperCase()}\n`;
    summary += `- **Base Score:** ${baseAnalysis[interpretation.originalEmotion]?.toFixed(1) || 'N/A'}%\n`;
    summary += `- **Cultural Adjustment:** ${interpretation.culturalAdjustment > 0 ? '+' : ''}${interpretation.culturalAdjustment.toFixed(1)}\n`;
    summary += `- **Interpretation:** ${interpretation.culturalInterpretation}\n`;
    summary += `- **Meaning:** ${interpretation.contextualMeaning}\n`;
    
    if (interpretation.recommendations.length > 0) {
      summary += `- **Recommendations:**\n`;
      for (const rec of interpretation.recommendations) {
        summary += `  - ${rec}\n`;
      }
    }
  }

  summary += `\n## Cultural Values at Play\n`;
  for (const value of culturalProfile.culturalValues) {
    summary += `- ${value}\n`;
  }

  return summary;
}

/**
 * Compare cultural interpretations across regions
 */
export function compareCulturalInterpretations(
  emotion: string,
  score: number,
  topic: string,
  regions: string[]
): Record<string, CulturalInterpretation> {
  const comparisons: Record<string, CulturalInterpretation> = {};

  for (const region of regions) {
    const profile = getCulturalProfile(region);
    if (profile) {
      comparisons[region] = interpretThroughCulturalLens(emotion, score, topic, profile);
    }
  }

  return comparisons;
}

/**
 * Get culturally-appropriate recommendations
 */
export function getCulturalRecommendations(
  analysis: CustomizedAnalysis,
  actionType: 'communication' | 'policy' | 'business'
): string[] {
  const recommendations: string[] = [];
  const { culturalProfile, interpretations } = analysis;

  for (const interpretation of interpretations) {
    if (actionType === 'communication') {
      recommendations.push(`Frame ${interpretation.originalEmotion} messaging around ${culturalProfile.culturalValues.join(', ')}`);
    } else if (actionType === 'policy') {
      recommendations.push(`Consider ${interpretation.contextualMeaning} when developing policies`);
    } else if (actionType === 'business') {
      recommendations.push(`Align business strategy with ${interpretation.culturalInterpretation}`);
    }
  }

  return recommendations;
}

/**
 * Validate cultural profile
 */
export function validateCulturalProfile(profile: CulturalProfile): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!profile.region) issues.push('Region is required');
  if (!profile.language) issues.push('Language is required');
  if (!profile.emotionalContext || Object.keys(profile.emotionalContext).length === 0) {
    issues.push('Emotional context is required');
  }
  if (!profile.culturalValues || profile.culturalValues.length === 0) {
    issues.push('Cultural values are required');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
