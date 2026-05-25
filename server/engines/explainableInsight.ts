import { t } from "../_core/i18n";
/**
 * Engine 5: Explainable Insight Engine
 *     
 *    :
 * - journalist:    
 * - researcher:   
 * - trader:    
 * - general:   
 */

import { ContextResult } from './contextClassification';
import { EmotionFusionResult, AffectiveVector } from './emotionEngine';
import { DynamicsResult } from './emotionEngine';
import { DriverDetectionResult } from './driverDetection';

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

// Emotion translations
const EMOTION_NAMES: Record<keyof AffectiveVector, { en: string; ar: string }> = {
  joy: { en: 'Joy', ar: t('auto.engines_explainableInsight.49.81fd7301', 'ar') },
  fear: { en: 'Fear', ar: t('auto.engines_explainableInsight.48.b4cbc50d', 'ar') },
  anger: { en: 'Anger', ar: t('auto.engines_explainableInsight.47.0a67288b', 'ar') },
  sadness: { en: 'Sadness', ar: t('auto.engines_explainableInsight.46.2c024033', 'ar') },
  hope: { en: 'Hope', ar: t('auto.engines_explainableInsight.45.05554470', 'ar') },
  curiosity: { en: 'Curiosity', ar: t('auto.engines_explainableInsight.44.f1f8172b', 'ar') }
};

/**
 * Generate journalist-specific insights
 */
function generateJournalistInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): JournalistInsight {
  const dominantEmotion = emotions.dominantEmotion;
  const emotionName = EMOTION_NAMES[dominantEmotion];
  
  // Generate headline based on context and emotion
  let headlineEn = '';
  let headlineAr = '';
  
  if (dynamics.riskLevel === 'critical') {
    headlineEn = `Breaking: ${context.region} faces ${context.eventType} amid rising ${dominantEmotion}`;
    headlineAr = `: ${context.region}  ${translateEventType(context.eventType)}   ${emotionName.ar}`;
  } else if (emotions.emotionalIntensity > 70) {
    headlineEn = `Strong ${dominantEmotion} sweeps ${context.region} over ${context.domain} developments`;
    headlineAr = ` ${emotionName.ar}   ${context.region}   ${translateDomain(context.domain)}`;
  } else {
    headlineEn = `${context.region}: Public sentiment shifts toward ${dominantEmotion} on ${context.domain}`;
    headlineAr = `${context.region}:     ${emotionName.ar}  ${translateDomain(context.domain)}`;
  }
  
  // Generate story angle
  const angleEn = `Focus on the human impact: Why are people feeling ${dominantEmotion}? ${drivers.whyStatement.en}`;
  const angleAr = `   :    ${emotionName.ar} ${drivers.whyStatement.ar}`;
  
  // Determine story potential
  let storyPotential: JournalistInsight['storyPotential'] = 'analysis';
  if (dynamics.riskLevel === 'critical') storyPotential = 'breaking';
  else if (dynamics.riskLevel === 'high') storyPotential = 'developing';
  else if (emotions.emotionalIntensity > 60) storyPotential = 'feature';
  
  // Determine urgency
  let urgency: JournalistInsight['urgency'] = 'this_week';
  if (storyPotential === 'breaking') urgency = 'immediate';
  else if (storyPotential === 'developing') urgency = 'today';
  else if (storyPotential === 'analysis') urgency = 'evergreen';
  
  // Determine audience reach
  let audienceReach: JournalistInsight['audienceReach'] = 'national';
  if (context.region === 'Global') audienceReach = 'global';
  else if (context.sensitivity === 'critical') audienceReach = 'regional';
  
  return {
    headline: { en: headlineEn, ar: headlineAr },
    angle: { en: angleEn, ar: angleAr },
    keyQuotes: drivers.keyDrivers.slice(0, 3).map(d => `"${d.term}" - Key driver with ${d.impact}% impact`),
    storyPotential,
    urgency,
    audienceReach
  };
}

/**
 * Generate researcher-specific insights
 */
function generateResearcherInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): ResearcherInsight {
  // Define research variables
  const variables = [
    { name: 'Emotional Intensity (EI)', value: emotions.emotionalIntensity, unit: '%' },
    { name: 'Valence Score (VS)', value: emotions.valence, unit: 'scale -100 to +100' },
    { name: 'Arousal Level (AL)', value: emotions.arousal, unit: '%' },
    { name: 'Sentiment Momentum (SM)', value: dynamics.momentum.value, unit: 'scale -100 to +100' },
    { name: 'Emotional Volatility (EV)', value: dynamics.volatility.value, unit: '%' },
    { name: 'Stability Index (SI)', value: dynamics.stabilityIndex, unit: '%' }
  ];
  
  // Define correlations
  const correlations = [
    { var1: 'Fear', var2: 'Volatility', strength: Math.round(emotions.vector.fear * 0.8) },
    { var1: 'Anger', var2: 'Risk Level', strength: Math.round(emotions.vector.anger * 0.7) },
    { var1: 'Hope', var2: 'Positive Momentum', strength: Math.round(emotions.vector.hope * 0.9) }
  ];
  
  // Methodology description
  const methodology = `Multi-modal sentiment analysis combining rule-based lexicon matching (30%) and DCFT contextual modeling (70%). Context classification achieved ${context.confidence}% confidence. Sample includes ${context.domain} domain content from ${context.region}.`;
  
  // Limitations
  const limitations = [
    'Cross-cultural emotion expression variations may affect accuracy',
    'Real-time data subject to sampling bias',
    'Sarcasm and irony detection limited in current model'
  ];
  
  // Citation suggestion
  const citationSuggestion = `AmalSense Emotional Intelligence Platform. (${new Date().getFullYear()}). Collective Emotion Analysis: ${context.region} - ${context.domain}. Retrieved from AmalSense API.`;
  
  // Data quality assessment
  let dataQuality: ResearcherInsight['dataQuality'] = 'medium';
  if (context.confidence > 80 && emotions.confidence > 70) dataQuality = 'high';
  else if (context.confidence < 50 || emotions.confidence < 40) dataQuality = 'low';
  
  return {
    variables,
    correlations,
    methodology,
    limitations,
    citationSuggestion,
    dataQuality
  };
}

/**
 * Generate trader-specific insights
 */
function generateTraderInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult
): TraderInsight {
  // Determine market signal
  let marketSignal: TraderInsight['marketSignal'] = 'neutral';
  
  if (dynamics.volatility.level === 'extreme' || dynamics.volatility.level === 'high') {
    marketSignal = 'volatile';
  } else if (emotions.valence > 30 && dynamics.momentum.value > 20) {
    marketSignal = 'bullish';
  } else if (emotions.valence < -30 && dynamics.momentum.value < -20) {
    marketSignal = 'bearish';
  }
  
  // Map risk level
  const riskLevel = dynamics.riskLevel;
  
  // Generate actionable insight
  let actionableEn = '';
  let actionableAr = '';
  
  if (marketSignal === 'volatile') {
    actionableEn = 'High emotional volatility detected. Consider reducing exposure or implementing hedging strategies.';
    actionableAr = t('auto.engines_explainableInsight.43.e0236638', 'ar');
  } else if (marketSignal === 'bullish') {
    actionableEn = 'Positive sentiment momentum building. Market psychology favors risk-on positioning.';
    actionableAr = t('auto.engines_explainableInsight.42.93043e3b', 'ar');
  } else if (marketSignal === 'bearish') {
    actionableEn = 'Negative sentiment intensifying. Consider defensive positioning or safe-haven assets.';
    actionableAr = t('auto.engines_explainableInsight.41.009a2e66', 'ar');
  } else {
    actionableEn = 'Neutral sentiment environment. Monitor for directional shifts before major positioning.';
    actionableAr = t('auto.engines_explainableInsight.40.857a8e33', 'ar');
  }
  
  // Determine time horizon
  let timeHorizon: TraderInsight['timeHorizon'] = 'medium_term';
  if (dynamics.riskLevel === 'critical' || marketSignal === 'volatile') {
    timeHorizon = 'short_term';
  } else if (dynamics.trend.direction === 'stable') {
    timeHorizon = 'long_term';
  }
  
  return {
    marketSignal,
    riskLevel,
    actionableInsight: { en: actionableEn, ar: actionableAr },
    timeHorizon,
    confidenceLevel: Math.round((context.confidence + emotions.confidence) / 2),
    disclaimer: 'AmalSense provides emotional indicators, not financial advice. Past emotional patterns do not guarantee future market movements.'
  };
}

/**
 * Generate general insights for all users
 */
function generateGeneralInsight(
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): GeneralInsight {
  const dominantEmotion = emotions.dominantEmotion;
  const emotionName = EMOTION_NAMES[dominantEmotion];
  
  // Summary
  const summaryEn = `Analysis of ${context.domain} content from ${context.region} reveals ${emotionName.en.toLowerCase()} as the dominant collective emotion (${emotions.vector[dominantEmotion]}% intensity). The emotional climate is ${dynamics.volatility.level} volatility with ${dynamics.trend.direction} trend.`;
  const summaryAr = `  ${translateDomain(context.domain)}  ${context.region}   ${emotionName.ar}     ( ${emotions.vector[dominantEmotion]}%).     ${translateVolatility(dynamics.volatility.level)}  ${translateTrend(dynamics.trend.direction)}.`;
  
  // Key takeaway
  const keyTakeawayEn = drivers.whyStatement.en;
  const keyTakeawayAr = drivers.whyStatement.ar;
  
  // Emotional context
  const emotionalContextEn = `The overall sentiment is ${emotions.valence > 0 ? 'positive' : emotions.valence < 0 ? 'negative' : 'neutral'} (valence: ${emotions.valence}) with ${emotions.arousal > 60 ? 'high' : emotions.arousal > 40 ? 'moderate' : 'low'} emotional activation.`;
  const emotionalContextAr = `  ${emotions.valence > 0 ? t('auto.engines_explainableInsight.39.1a18bc03', 'ar') : emotions.valence < 0 ? t('auto.engines_explainableInsight.38.3f7f3992', 'ar') : t('auto.engines_explainableInsight.37.32a697e1', 'ar')} (: ${emotions.valence})  ${emotions.arousal > 60 ? t('auto.engines_explainableInsight.36.6707994b', 'ar') : emotions.arousal > 40 ? t('auto.engines_explainableInsight.35.274489c8', 'ar') : t('auto.engines_explainableInsight.34.dfb673df', 'ar')}.`;
  
  // Recommendation
  let recommendationEn = '';
  let recommendationAr = '';
  
  if (dynamics.riskLevel === 'critical') {
    recommendationEn = 'This situation requires immediate attention. Monitor closely for rapid developments.';
    recommendationAr = t('auto.engines_explainableInsight.33.b5c08745', 'ar');
  } else if (dynamics.riskLevel === 'high') {
    recommendationEn = 'Elevated emotional intensity suggests potential for significant developments.';
    recommendationAr = t('auto.engines_explainableInsight.32.2d055afd', 'ar');
  } else {
    recommendationEn = 'Situation is relatively stable. Continue monitoring for changes in emotional patterns.';
    recommendationAr = t('auto.engines_explainableInsight.31.4428bd65', 'ar');
  }
  
  return {
    summary: { en: summaryEn, ar: summaryAr },
    keyTakeaway: { en: keyTakeawayEn, ar: keyTakeawayAr },
    emotionalContext: { en: emotionalContextEn, ar: emotionalContextAr },
    recommendation: { en: recommendationEn, ar: recommendationAr }
  };
}

// Helper translation functions
function translateDomain(domain: string): string {
  const translations: Record<string, string> = {
    politics: t('auto.engines_explainableInsight.30.d2c95863', 'ar'), economy: t('auto.engines_explainableInsight.29.a43da44f', 'ar'), health: t('auto.engines_explainableInsight.28.005e9108', 'ar'),
    war: t('auto.engines_explainableInsight.27.63068650', 'ar'), sports: t('auto.engines_explainableInsight.26.0132e618', 'ar'), entertainment: t('auto.engines_explainableInsight.25.bec8bc5b', 'ar'),
    technology: t('auto.engines_explainableInsight.24.0abcff3b', 'ar'), environment: t('auto.engines_explainableInsight.23.c7fca11d', 'ar'), society: t('auto.engines_explainableInsight.22.a38221d3', 'ar'),
    education: t('auto.engines_explainableInsight.21.f18ce12b', 'ar'), general: t('auto.engines_explainableInsight.20.17859487', 'ar')
  };
  return translations[domain] || domain;
}

function translateEventType(eventType: string): string {
  const translations: Record<string, string> = {
    crisis: t('auto.engines_explainableInsight.19.38a8a76e', 'ar'), death: t('auto.engines_explainableInsight.18.158c325c', 'ar'), celebration: t('auto.engines_explainableInsight.17.3460cbc6', 'ar'),
    conflict: t('auto.engines_explainableInsight.16.393955e1', 'ar'), announcement: t('auto.engines_explainableInsight.15.81581363', 'ar'), discovery: t('auto.engines_explainableInsight.14.7811e2fe', 'ar'),
    election: t('auto.engines_explainableInsight.13.d9b242e6', 'ar'), disaster: t('auto.engines_explainableInsight.12.676d2f53', 'ar'), achievement: t('auto.engines_explainableInsight.11.c24d8d6c', 'ar'),
    controversy: t('auto.engines_explainableInsight.10.ab2e01fd', 'ar'), neutral: t('auto.engines_explainableInsight.9.22518f4c', 'ar')
  };
  return translations[eventType] || eventType;
}

function translateVolatility(level: string): string {
  const translations: Record<string, string> = {
    low: t('auto.engines_explainableInsight.8.15b8dd47', 'ar'), medium: t('auto.engines_explainableInsight.7.91fa23bd', 'ar'), high: t('auto.engines_explainableInsight.6.034d871b', 'ar'), extreme: t('auto.engines_explainableInsight.5.440f12ab', 'ar')
  };
  return translations[level] || level;
}

function translateTrend(direction: string): string {
  const translations: Record<string, string> = {
    rising: t('auto.engines_explainableInsight.4.c8324380', 'ar'), falling: t('auto.engines_explainableInsight.3.ff284f1b', 'ar'), stable: t('auto.engines_explainableInsight.2.646ecd76', 'ar'), volatile: t('auto.engines_explainableInsight.1.9ab60a86', 'ar')
  };
  return translations[direction] || direction;
}

/**
 * Main Explainable Insight Function
 */
export function generateInsights(
  userType: UserType,
  context: ContextResult,
  emotions: EmotionFusionResult,
  dynamics: DynamicsResult,
  drivers: DriverDetectionResult
): ExplainableInsightResult {
  const dominantEmotion = emotions.dominantEmotion;
  const emotionName = EMOTION_NAMES[dominantEmotion];
  
  // Main insight title and description
  const mainInsight = {
    title: {
      en: `${emotionName.en} Dominates: ${context.region} ${context.domain.charAt(0).toUpperCase() + context.domain.slice(1)} Analysis`,
      ar: `${emotionName.ar} :  ${translateDomain(context.domain)}  ${context.region}`
    },
    description: {
      en: `Collective emotional analysis reveals ${emotionName.en.toLowerCase()} as the primary emotion with ${emotions.emotionalIntensity}% intensity. ${drivers.whyStatement.en}`,
      ar: `     ${emotionName.ar}     ${emotions.emotionalIntensity}%. ${drivers.whyStatement.ar}`
    }
  };
  
  // Emotional summary
  const emotionalSummary = {
    dominantFeeling: emotionName,
    intensity: emotions.emotionalIntensity > 70 ? 'High' : emotions.emotionalIntensity > 40 ? 'Moderate' : 'Low',
    direction: dynamics.trend.direction
  };
  
  // Generate user-specific insights
  const generalInsight = generateGeneralInsight(context, emotions, dynamics, drivers);
  
  const result: ExplainableInsightResult = {
    userType,
    mainInsight,
    emotionalSummary,
    generalInsight,
    confidence: Math.round((context.confidence + emotions.confidence + drivers.confidence) / 3),
    generatedAt: new Date().toISOString()
  };
  
  // Add user-specific insights
  if (userType === 'journalist') {
    result.journalistInsight = generateJournalistInsight(context, emotions, dynamics, drivers);
  } else if (userType === 'researcher') {
    result.researcherInsight = generateResearcherInsight(context, emotions, dynamics, drivers);
  } else if (userType === 'trader') {
    result.traderInsight = generateTraderInsight(context, emotions, dynamics);
  }
  
  return result;
}

export default { generateInsights };
