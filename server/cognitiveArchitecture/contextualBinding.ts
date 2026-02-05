/**
 * Layer 7: Contextual Binding
 * 
 * Integration of cultural, temporal, and situational factors
 * Components:
 * - Cultural context mapper (regional norms)
 * - Temporal context tracker (historical events)
 * - Situational context analyzer (current events)
 * - Binding Algorithm: Weighted context fusion
 */

export interface CulturalContext {
  region: string;
  norms: string[];
  sensitivities: string[];
  communicationStyle: 'direct' | 'indirect' | 'formal' | 'informal';
  emotionalExpression: 'restrained' | 'moderate' | 'expressive';
}

export interface TemporalContext {
  timestamp: number;
  historicalEvents: Array<{
    event: string;
    date: number;
    impact: 'high' | 'medium' | 'low';
  }>;
  seasonality?: 'holiday' | 'election' | 'crisis' | 'normal';
}

export interface SituationalContext {
  currentEvents: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  scope: 'local' | 'regional' | 'national' | 'international';
  affectedGroups: string[];
}

export interface BoundContext {
  cultural: CulturalContext;
  temporal: TemporalContext;
  situational: SituationalContext;
  weights: {
    cultural: number;
    temporal: number;
    situational: number;
  };
  confidence: number;
}

/**
 * Cultural context database (simplified)
 */
const CULTURAL_CONTEXTS: Record<string, CulturalContext> = {
  'libya': {
    region: 'North Africa / Middle East',
    norms: ['family-oriented', 'tribal-structure', 'religious-values'],
    sensitivities: ['political-stability', 'foreign-intervention', 'resource-distribution'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  'egypt': {
    region: 'North Africa / Middle East',
    norms: ['hierarchical', 'religious-values', 'respect-for-authority'],
    sensitivities: ['economic-stability', 'political-change', 'regional-influence'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  'tunisia': {
    region: 'North Africa',
    norms: ['progressive', 'secular-leaning', 'education-focused'],
    sensitivities: ['democratic-process', 'economic-opportunity', 'youth-unemployment'],
    communicationStyle: 'direct',
    emotionalExpression: 'expressive',
  },
  'syria': {
    region: 'Middle East',
    norms: ['family-oriented', 'religious-diversity', 'historical-pride'],
    sensitivities: ['conflict-resolution', 'humanitarian-crisis', 'reconstruction'],
    communicationStyle: 'indirect',
    emotionalExpression: 'restrained',
  },
  'iraq': {
    region: 'Middle East',
    norms: ['tribal-structure', 'religious-diversity', 'resilience'],
    sensitivities: ['sectarian-tensions', 'foreign-influence', 'security'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  'yemen': {
    region: 'Middle East',
    norms: ['tribal-structure', 'traditional-values', 'oral-tradition'],
    sensitivities: ['humanitarian-crisis', 'conflict-resolution', 'basic-services'],
    communicationStyle: 'indirect',
    emotionalExpression: 'restrained',
  },
  'palestine': {
    region: 'Middle East',
    norms: ['resilience', 'community-solidarity', 'historical-memory'],
    sensitivities: ['occupation', 'human-rights', 'self-determination'],
    communicationStyle: 'direct',
    emotionalExpression: 'expressive',
  },
  'lebanon': {
    region: 'Middle East',
    norms: ['religious-diversity', 'entrepreneurial', 'cosmopolitan'],
    sensitivities: ['sectarian-balance', 'economic-crisis', 'regional-stability'],
    communicationStyle: 'direct',
    emotionalExpression: 'expressive',
  },
  'jordan': {
    region: 'Middle East',
    norms: ['moderate', 'hospitable', 'stability-focused'],
    sensitivities: ['refugee-burden', 'economic-challenges', 'regional-peace'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  'default': {
    region: 'Global',
    norms: ['diverse', 'context-dependent'],
    sensitivities: ['general'],
    communicationStyle: 'formal',
    emotionalExpression: 'moderate',
  },
};

/**
 * Get cultural context for a country
 */
export function getCulturalContext(country: string): CulturalContext {
  const countryLower = country.toLowerCase();
  return CULTURAL_CONTEXTS[countryLower] || CULTURAL_CONTEXTS['default'];
}

/**
 * Get temporal context
 */
export function getTemporalContext(
  timestamp: number,
  historicalEvents: Array<{ event: string; date: number; impact: 'high' | 'medium' | 'low' }> = []
): TemporalContext {
  // Determine seasonality based on current events
  let seasonality: 'holiday' | 'election' | 'crisis' | 'normal' = 'normal';
  
  // Check for recent high-impact events
  const recentHighImpact = historicalEvents.filter(e => 
    e.impact === 'high' && (timestamp - e.date) < 30 * 24 * 60 * 60 * 1000 // Last 30 days
  );
  
  if (recentHighImpact.length > 0) {
    seasonality = 'crisis';
  }
  
  return {
    timestamp,
    historicalEvents,
    seasonality,
  };
}

/**
 * Analyze situational context
 */
export function analyzeSituationalContext(
  currentEvents: string[],
  emotionalIntensity: number
): SituationalContext {
  // Determine urgency based on emotional intensity
  let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
  if (emotionalIntensity > 80) {
    urgency = 'critical';
  } else if (emotionalIntensity > 60) {
    urgency = 'high';
  } else if (emotionalIntensity > 40) {
    urgency = 'medium';
  }
  
  // Determine scope based on keywords
  let scope: 'local' | 'regional' | 'national' | 'international' = 'national';
  const eventsText = currentEvents.join(' ').toLowerCase();
  
  if (eventsText.includes('global') || eventsText.includes('international') || eventsText.includes('world')) {
    scope = 'international';
  } else if (eventsText.includes('regional') || eventsText.includes('arab') || eventsText.includes('middle east')) {
    scope = 'regional';
  } else if (eventsText.includes('local') || eventsText.includes('city') || eventsText.includes('town')) {
    scope = 'local';
  }
  
  // Extract affected groups
  const affectedGroups: string[] = [];
  if (eventsText.includes('youth') || eventsText.includes('young')) {
    affectedGroups.push('الشباب');
  }
  if (eventsText.includes('women') || eventsText.includes('female')) {
    affectedGroups.push('النساء');
  }
  if (eventsText.includes('children')) {
    affectedGroups.push('الأطفال');
  }
  if (eventsText.includes('elderly') || eventsText.includes('old')) {
    affectedGroups.push('كبار السن');
  }
  if (eventsText.includes('workers') || eventsText.includes('employees')) {
    affectedGroups.push('العمال');
  }
  if (eventsText.includes('families')) {
    affectedGroups.push('الأسر');
  }
  
  // Default to general population if no specific groups identified
  if (affectedGroups.length === 0) {
    affectedGroups.push('المواطنون');
  }
  
  return {
    currentEvents,
    urgency,
    scope,
    affectedGroups,
  };
}

/**
 * Bind contexts together with weighted fusion
 */
export function bindContexts(
  country: string,
  timestamp: number,
  currentEvents: string[],
  emotionalIntensity: number,
  historicalEvents: Array<{ event: string; date: number; impact: 'high' | 'medium' | 'low' }> = []
): BoundContext {
  const cultural = getCulturalContext(country);
  const temporal = getTemporalContext(timestamp, historicalEvents);
  const situational = analyzeSituationalContext(currentEvents, emotionalIntensity);
  
  // Calculate weights based on urgency and impact
  let weights = {
    cultural: 0.3,
    temporal: 0.2,
    situational: 0.5,
  };
  
  // Adjust weights based on urgency
  if (situational.urgency === 'critical') {
    weights = {
      cultural: 0.2,
      temporal: 0.1,
      situational: 0.7,
    };
  } else if (situational.urgency === 'low') {
    weights = {
      cultural: 0.4,
      temporal: 0.3,
      situational: 0.3,
    };
  }
  
  // Calculate confidence based on available information
  let confidence = 0.5;
  if (cultural.region !== 'Global') {
    confidence += 0.2;
  }
  if (historicalEvents.length > 0) {
    confidence += 0.1;
  }
  if (currentEvents.length > 0) {
    confidence += 0.2;
  }
  
  return {
    cultural,
    temporal,
    situational,
    weights,
    confidence: Math.min(confidence, 1.0),
  };
}

/**
 * Apply contextual modulation to emotional response
 */
export function applyContextualModulation(
  emotionalVector: {
    fear: number;
    hope: number;
    anger: number;
    mood: number;
  },
  boundContext: BoundContext
): {
  modulated: {
    fear: number;
    hope: number;
    anger: number;
    mood: number;
  };
  explanation: string;
} {
  const { cultural, situational, weights } = boundContext;
  
  // Cultural modulation factors
  let culturalFactor = 1.0;
  if (cultural.emotionalExpression === 'restrained') {
    culturalFactor = 0.8; // Reduce intensity for restrained cultures
  } else if (cultural.emotionalExpression === 'expressive') {
    culturalFactor = 1.2; // Increase intensity for expressive cultures
  }
  
  // Situational modulation factors
  let situationalFactor = 1.0;
  if (situational.urgency === 'critical') {
    situationalFactor = 1.3; // Amplify emotions in critical situations
  } else if (situational.urgency === 'low') {
    situationalFactor = 0.7; // Dampen emotions in low urgency
  }
  
  // Combined modulation
  const combinedFactor = 
    culturalFactor * weights.cultural +
    situationalFactor * weights.situational +
    1.0 * weights.temporal;
  
  // Apply modulation
  const modulated = {
    fear: Math.max(-100, Math.min(100, emotionalVector.fear * combinedFactor)),
    hope: Math.max(-100, Math.min(100, emotionalVector.hope * combinedFactor)),
    anger: Math.max(-100, Math.min(100, emotionalVector.anger * combinedFactor)),
    mood: Math.max(-100, Math.min(100, emotionalVector.mood * combinedFactor)),
  };
  
  // Generate explanation
  let explanation = `تم تعديل المشاعر بناءً على السياق: `;
  if (culturalFactor !== 1.0) {
    explanation += `الثقافة ${cultural.region} (${cultural.emotionalExpression}), `;
  }
  if (situationalFactor !== 1.0) {
    explanation += `الحالة ${situational.urgency}, `;
  }
  explanation += `المجموعات المتأثرة: ${situational.affectedGroups.join(', ')}.`;
  
  return {
    modulated,
    explanation,
  };
}

/**
 * Get context-aware recommendations
 */
export function getContextualRecommendations(
  boundContext: BoundContext
): string[] {
  const { cultural, situational } = boundContext;
  const recommendations: string[] = [];
  
  // Cultural recommendations
  if (cultural.sensitivities.includes('political-stability')) {
    recommendations.push('تعزيز الحوار السياسي والمصالحة الوطنية');
  }
  if (cultural.sensitivities.includes('economic-stability')) {
    recommendations.push('تحسين الخدمات الأساسية والفرص الاقتصادية');
  }
  
  // Situational recommendations
  if (situational.urgency === 'critical') {
    recommendations.push('تدخل عاجل من السلطات المعنية');
    recommendations.push('تفعيل آليات الاستجابة السريعة');
  }
  
  if (situational.scope === 'international') {
    recommendations.push('تنسيق مع المجتمع الدولي');
  }
  
  // Group-specific recommendations
  if (situational.affectedGroups.includes('الشباب')) {
    recommendations.push('توفير فرص عمل وتعليم للشباب');
  }
  if (situational.affectedGroups.includes('الأسر')) {
    recommendations.push('دعم الأسر المتضررة بمساعدات مباشرة');
  }
  
  return recommendations;
}
