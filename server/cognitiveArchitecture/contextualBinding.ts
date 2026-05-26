/**
 * Contextual Binding Layer (Layer 7)
 *
 * Binds cultural, temporal and situational context to emotional signals.
 * This is an internal modulation layer and does not produce final user-facing
 * answers.
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
  historicalEvents: Array<{ event: string; date: number; impact: 'high' | 'medium' | 'low' }>;
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
  weights: { cultural: number; temporal: number; situational: number };
  confidence: number;
}

const CULTURAL_CONTEXTS: Record<string, CulturalContext> = {
  libya: {
    region: 'North Africa / Middle East',
    norms: ['family-oriented', 'tribal-structure', 'religious-values'],
    sensitivities: ['political-stability', 'foreign-intervention', 'resource-distribution'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  egypt: {
    region: 'North Africa / Middle East',
    norms: ['hierarchical', 'religious-values', 'respect-for-authority'],
    sensitivities: ['economic-stability', 'political-change', 'regional-influence'],
    communicationStyle: 'indirect',
    emotionalExpression: 'moderate',
  },
  palestine: {
    region: 'Middle East',
    norms: ['resilience', 'community-solidarity', 'historical-memory'],
    sensitivities: ['occupation', 'human-rights', 'self-determination'],
    communicationStyle: 'direct',
    emotionalExpression: 'expressive',
  },
  default: {
    region: 'Global',
    norms: ['diverse', 'context-dependent'],
    sensitivities: ['general'],
    communicationStyle: 'formal',
    emotionalExpression: 'moderate',
  },
};

export function getCulturalContext(country: string): CulturalContext {
  return CULTURAL_CONTEXTS[country.toLowerCase()] || CULTURAL_CONTEXTS.default;
}

export function getTemporalContext(
  timestamp: number,
  historicalEvents: Array<{ event: string; date: number; impact: 'high' | 'medium' | 'low' }> = [],
): TemporalContext {
  const recentHighImpact = historicalEvents.filter(
    (e) => e.impact === 'high' && timestamp - e.date < 30 * 24 * 60 * 60 * 1000,
  );
  return {
    timestamp,
    historicalEvents,
    seasonality: recentHighImpact.length > 0 ? 'crisis' : 'normal',
  };
}

export function analyzeSituationalContext(
  currentEvents: string[],
  emotionalIntensity: number,
): SituationalContext {
  let urgency: SituationalContext['urgency'] = 'low';
  if (emotionalIntensity > 80) urgency = 'critical';
  else if (emotionalIntensity > 60) urgency = 'high';
  else if (emotionalIntensity > 40) urgency = 'medium';

  const eventsText = currentEvents.join(' ').toLowerCase();
  let scope: SituationalContext['scope'] = 'national';
  if (/global|international|world/.test(eventsText)) scope = 'international';
  else if (/regional|middle east|north africa/.test(eventsText)) scope = 'regional';
  else if (/local|city|town/.test(eventsText)) scope = 'local';

  const affectedGroups: string[] = [];
  if (/youth|young/.test(eventsText)) affectedGroups.push('youth');
  if (/women|female/.test(eventsText)) affectedGroups.push('women');
  if (/children/.test(eventsText)) affectedGroups.push('children');
  if (/workers|employees/.test(eventsText)) affectedGroups.push('workers');
  if (/families/.test(eventsText)) affectedGroups.push('families');
  if (affectedGroups.length === 0) affectedGroups.push('general population');

  return { currentEvents, urgency, scope, affectedGroups };
}

export function bindContexts(
  country: string,
  timestamp: number,
  currentEvents: string[],
  emotionalIntensity: number,
  historicalEvents: Array<{ event: string; date: number; impact: 'high' | 'medium' | 'low' }> = [],
): BoundContext {
  const cultural = getCulturalContext(country);
  const temporal = getTemporalContext(timestamp, historicalEvents);
  const situational = analyzeSituationalContext(currentEvents, emotionalIntensity);

  const weights =
    situational.urgency === 'critical'
      ? { cultural: 0.2, temporal: 0.1, situational: 0.7 }
      : situational.urgency === 'low'
        ? { cultural: 0.4, temporal: 0.3, situational: 0.3 }
        : { cultural: 0.3, temporal: 0.2, situational: 0.5 };

  const confidence = Math.min(
    1,
    0.4 +
      (cultural.region !== 'Global' ? 0.2 : 0) +
      (historicalEvents.length > 0 ? 0.1 : 0) +
      (currentEvents.length > 0 ? 0.3 : 0),
  );

  return { cultural, temporal, situational, weights, confidence };
}

export function applyContextualModulation(
  emotionalVector: { fear: number; hope: number; anger: number; mood: number },
  boundContext: BoundContext,
): { modulated: { fear: number; hope: number; anger: number; mood: number }; explanation: string } {
  const expressionFactor =
    boundContext.cultural.emotionalExpression === 'restrained'
      ? 0.85
      : boundContext.cultural.emotionalExpression === 'expressive'
        ? 1.15
        : 1;

  const urgencyFactor =
    boundContext.situational.urgency === 'critical'
      ? 1.25
      : boundContext.situational.urgency === 'low'
        ? 0.8
        : 1;

  const factor =
    expressionFactor * boundContext.weights.cultural +
    urgencyFactor * boundContext.weights.situational +
    boundContext.weights.temporal;

  const clamp = (value: number) => Math.max(-100, Math.min(100, value));

  return {
    modulated: {
      fear: clamp(emotionalVector.fear * factor),
      hope: clamp(emotionalVector.hope * factor),
      anger: clamp(emotionalVector.anger * factor),
      mood: clamp(emotionalVector.mood * factor),
    },
    explanation: `Context modulation applied using ${boundContext.cultural.region}, urgency=${boundContext.situational.urgency}, scope=${boundContext.situational.scope}.`,
  };
}

export function getContextualRecommendations(boundContext: BoundContext): string[] {
  const recommendations: string[] = [];
  if (boundContext.situational.urgency === 'critical')
    recommendations.push('Prioritize real-time monitoring and avoid overconfident conclusions.');
  if (boundContext.situational.scope === 'international')
    recommendations.push('Check cross-border sources before interpreting the signal.');
  if (boundContext.cultural.sensitivities.includes('political-stability'))
    recommendations.push('Handle political-stability signals with extra caution.');
  if (boundContext.situational.affectedGroups.includes('families'))
    recommendations.push('Consider household-level impact when interpreting public mood.');
  return recommendations;
}