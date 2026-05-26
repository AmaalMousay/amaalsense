/**
 * Explainable Insight Engine
 *
 * Converts context, emotion, dynamics and driver outputs into structured insight
 * objects for different user roles. It does not write the final natural answer.
 */

import type { ContextResult } from './contextClassification';
import type { AffectiveVector, EmotionFusionResult, DynamicsResult } from './emotionEngine';
import type { DriverDetectionResult } from './driverDetection';

export type UserType = 'journalist' | 'researcher' | 'trader' | 'general';

export interface JournalistInsight {
  headline: { en: string; ar: string };
  angle: { en: string; ar: string };
  keyQuotes: string[];
  storyPotential: 'breaking' | 'developing' | 'feature' | 'analysis';
  urgency: 'immediate' | 'today' | 'this_week' | 'evergreen';
  audienceReach: 'local' | 'national' | 'regional' | 'global';
}

export interface ResearcherInsight {
  variables: { name: string; value: number; unit: string }[];
  correlations: { var1: string; var2: string; strength: number }[];
  methodology: string;
  limitations: string[];
  citationSuggestion: string;
  dataQuality: 'high' | 'medium' | 'low';
}

export interface TraderInsight {
  marketSignal: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  actionableInsight: { en: string; ar: string };
  timeHorizon: 'short_term' | 'medium_term' | 'long_term';
  confidenceLevel: number;
  disclaimer: string;
}

export interface GeneralInsight {
  summary: { en: string; ar: string };
  keyTakeaway: { en: string; ar: string };
  emotionalContext: { en: string; ar: string };
  recommendation: { en: string; ar: string };
}

export interface ExplainableInsightResult {
  userType: UserType;
  mainInsight: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
  };
  emotionalSummary: {
    dominantFeeling: { en: string; ar: string };
    intensity: string;
    direction: string;
  };
  journalistInsight?: JournalistInsight;
  researcherInsight?: ResearcherInsight;
  traderInsight?: TraderInsight;
  generalInsight: GeneralInsight;
  confidence: number;
  generatedAt: string;
}

const EMOTION_NAMES: Record<keyof AffectiveVector, { en: string; ar: string }> = {
  joy: { en: 'Joy', ar: 'Joy' },
  fear: { en: 'Fear', ar: 'Fear' },
  anger: { en: 'Anger', ar: 'Anger' },
  sadness: { en: 'Sadness', ar: 'Sadness' },
  hope: { en: 'Hope', ar: 'Hope' },
  curiosity: { en: 'Curiosity', ar: 'Curiosity' },
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function intensityLabel(value: number): string {
  if (value > 70) return 'High';
  if (value > 40) return 'Moderate';
  return 'Low';
}

function generateJournalistInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): JournalistInsight {
  const dominantEmotion = emotions.dominantEmotion;
  const headline = `${context.region}: ${titleCase(String(dominantEmotion))} shapes ${context.domain} narrative`;
  const storyPotential: JournalistInsight['storyPotential'] = dynamics.riskLevel === 'critical' ? 'breaking' : dynamics.riskLevel === 'high' ? 'developing' : emotions.emotionalIntensity > 60 ? 'feature' : 'analysis';
  const urgency: JournalistInsight['urgency'] = storyPotential === 'breaking' ? 'immediate' : storyPotential === 'developing' ? 'today' : storyPotential === 'feature' ? 'this_week' : 'evergreen';
  const audienceReach: JournalistInsight['audienceReach'] = context.region === 'Global' ? 'global' : context.sensitivity === 'critical' ? 'regional' : 'national';
  return {
    headline: { en: headline, ar: headline },
    angle: { en: `Focus on why the public is reacting with ${dominantEmotion}. ${drivers.whyStatement.en}`, ar: `Focus on why the public is reacting with ${dominantEmotion}. ${drivers.whyStatement.en}` },
    keyQuotes: drivers.keyDrivers.slice(0, 3).map(driver => `"${driver.term}" - ${driver.impact}% driver impact`),
    storyPotential,
    urgency,
    audienceReach,
  };
}

function generateResearcherInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): ResearcherInsight {
  const variables = [
    { name: 'Emotional Intensity', value: emotions.emotionalIntensity, unit: '%' },
    { name: 'Valence', value: emotions.valence, unit: '-100 to +100' },
    { name: 'Arousal', value: emotions.arousal, unit: '%' },
    { name: 'Momentum', value: dynamics.momentum.value, unit: '-100 to +100' },
    { name: 'Volatility', value: dynamics.volatility.value, unit: '%' },
    { name: 'Stability', value: dynamics.stabilityIndex, unit: '%' },
  ];
  return {
    variables,
    correlations: [
      { var1: 'Fear', var2: 'Volatility', strength: Math.round(emotions.vector.fear * 0.8) },
      { var1: 'Anger', var2: 'Risk', strength: Math.round(emotions.vector.anger * 0.7) },
      { var1: 'Hope', var2: 'Positive Momentum', strength: Math.round(emotions.vector.hope * 0.9) },
    ],
    methodology: `Context=${context.domain}/${context.eventType}; region=${context.region}; driver count=${drivers.keyDrivers.length}.`,
    limitations: ['Signals may be source-biased.', 'Emotion inference is probabilistic.', 'Sarcasm and local dialects can reduce accuracy.'],
    citationSuggestion: `AmalSense Emotional Field Analysis (${new Date().getFullYear()}). ${context.region} / ${context.domain}.`,
    dataQuality: context.confidence > 80 && emotions.confidence > 70 ? 'high' : context.confidence < 50 || emotions.confidence < 40 ? 'low' : 'medium',
  };
}

function generateTraderInsight(context: ContextResult, emotions: EmotionFusionResult, dynamics: DynamicsResult): TraderInsight {
  const marketSignal: TraderInsight['marketSignal'] = dynamics.volatility.level === 'high' || dynamics.volatility.level === 'extreme'
    ? 'volatile'
    : emotions.valence > 30 && dynamics.momentum.value > 20
      ? 'bullish'
      : emotions.valence < -30 && dynamics.momentum.value < -20
        ? 'bearish'
        : 'neutral';
  const actionableInsight = marketSignal === 'volatile'
    ? 'High emotional volatility detected. Treat this as risk context, not a standalone trade signal.'
    : marketSignal === 'bullish'
      ? 'Positive sentiment momentum is building. Look for market confirmation before acting.'
      : marketSignal === 'bearish'
        ? 'Negative sentiment is intensifying. Defensive positioning may be relevant if price confirms.'
        : 'Sentiment is neutral. Wait for a clearer directional shift.';
  return {
    marketSignal,
    riskLevel: dynamics.riskLevel,
    actionableInsight: { en: actionableInsight, ar: actionableInsight },
    timeHorizon: dynamics.riskLevel === 'critical' || marketSignal === 'volatile' ? 'short_term' : dynamics.trend.direction === 'stable' ? 'long_term' : 'medium_term',
    confidenceLevel: Math.round((context.confidence + emotions.confidence) / 2),
    disclaimer: 'AmalSense provides emotional-field context, not financial advice.',
  };
}

function generateGeneralInsight(context: ContextResult, emotions: EmotionFusionResult, dynamics: DynamicsResult, drivers: DriverDetectionResult): GeneralInsight {
  const emotion = String(emotions.dominantEmotion);
  const summary = `${context.region} ${context.domain} signals currently lean toward ${emotion} with ${intensityLabel(emotions.emotionalIntensity).toLowerCase()} intensity.`;
  const emotionalContext = `Valence=${emotions.valence}, arousal=${emotions.arousal}, volatility=${dynamics.volatility.value}.`;
  const recommendation = dynamics.riskLevel === 'critical'
    ? 'Treat this as a high-priority monitoring case.'
    : dynamics.riskLevel === 'high'
      ? 'Monitor closely and wait for additional confirmation.'
      : 'Continue monitoring for changes in the emotional field.';
  return {
    summary: { en: summary, ar: summary },
    keyTakeaway: { en: drivers.whyStatement.en, ar: drivers.whyStatement.en },
    emotionalContext: { en: emotionalContext, ar: emotionalContext },
    recommendation: { en: recommendation, ar: recommendation },
  };
}

export function generateInsights(
  userType: UserType,
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): ExplainableInsightResult {
  const emotionName = EMOTION_NAMES[emotions.dominantEmotion];
  const title = `${emotionName.en} dominates ${context.region} ${context.domain} analysis`;
  const description = `The emotional field shows ${emotionName.en.toLowerCase()} at ${emotions.emotionalIntensity}% intensity. ${drivers.whyStatement.en}`;
  const generalInsight = generateGeneralInsight(context, emotions, dynamics, drivers);
  const result: ExplainableInsightResult = {
    userType,
    mainInsight: { title: { en: title, ar: title }, description: { en: description, ar: description } },
    emotionalSummary: { dominantFeeling: emotionName, intensity: intensityLabel(emotions.emotionalIntensity), direction: dynamics.trend.direction },
    generalInsight,
    confidence: Math.round((context.confidence + emotions.confidence + drivers.confidence) / 3),
    generatedAt: new Date().toISOString(),
  };
  if (userType === 'journalist') result.journalistInsight = generateJournalistInsight(context, emotions, dynamics, drivers);
  if (userType === 'researcher') result.researcherInsight = generateResearcherInsight(context, emotions, dynamics, drivers);
  if (userType === 'trader') result.traderInsight = generateTraderInsight(context, emotions, dynamics);
  return result;
}

export default { generateInsights };
