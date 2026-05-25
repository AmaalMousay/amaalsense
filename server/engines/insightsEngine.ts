import { t } from "../_core/i18n";

/**
 * Insights Engine -   
 * 
 *   :
 * -    (Actionable Insights)
 * -   (Smart Alerts)
 * -  (Recommendations)
 * -  (Predictions)
 */

export type AlertLevel = 'critical' | 'warning' | 'info' | 'positive';
export type InsightCategory = 'crisis' | 'opportunity' | 'trend' | 'stability' | 'volatility';

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number; // 0-100
  timeframe?: string;
  actionable: boolean;
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: Date;
  expiresAt?: Date;
  actionRequired: boolean;
  suggestedActions?: string[];
  suggestedActionsAr?: string[];
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetAudience: string[];
  expectedImpact: string;
  expectedImpactAr: string;
}

export interface Prediction {
  id: string;
  type: 'crisis' | 'recovery' | 'escalation' | 'stabilization';
  probability: number; // 0-100
  timeframe: string;
  description: string;
  descriptionAr: string;
  basedOn: string[];
  confidence: number;
}

export interface AnalysisInsights {
  insights: Insight[];
  alerts: Alert[];
  recommendations: Recommendation[];
  predictions: Prediction[];
  summary: {
    overallSentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
    overallSentimentAr: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
    riskLevelAr: string;
    opportunityLevel: 'high' | 'medium' | 'low' | 'none';
    opportunityLevelAr: string;
    keyMessage: string;
    keyMessageAr: string;
  };
}

interface AnalysisData {
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity?: number;
    calm?: number;
  };
  indices: {
    gmi: number;  //   
    cfi: number;  //   
    hri: number;  //   
    spi?: number; //  
    evi?: number; //  
  };
  context?: {
    eventType: string;
    region: string;
    sensitivity: string;
  };
}

/**
 *     
 */
export function generateInsights(data: AnalysisData): AnalysisInsights {
  const insights: Insight[] = [];
  const alerts: Alert[] = [];
  const recommendations: Recommendation[] = [];
  const predictions: Prediction[] = [];
  
  const { emotions, indices, context } = data;
  
  // ===     ===
  
  // 1.   
  if (emotions.fear > 70) {
    insights.push({
      id: 'high_fear',
      category: 'crisis',
      title: 'Elevated Fear Levels Detected',
      titleAr: t('auto.engines_insightsEngine.62.3fdb292e', 'ar'),
      description: `Fear levels at ${emotions.fear.toFixed(0)}% indicate significant public anxiety about this topic.`,
      descriptionAr: `   ${emotions.fear.toFixed(0)}%        .`,
      confidence: 85,
      actionable: true,
    });
    
    alerts.push({
      id: 'fear_alert',
      level: emotions.fear > 85 ? 'critical' : 'warning',
      title: 'High Fear Alert',
      titleAr: t('auto.engines_insightsEngine.61.b6a6f4d4', 'ar'),
      message: `Public fear is at ${emotions.fear.toFixed(0)}%. Consider crisis communication strategies.`,
      messageAr: `   ${emotions.fear.toFixed(0)}%.      .`,
      timestamp: new Date(),
      actionRequired: true,
      suggestedActions: [
        'Issue calming public statements',
        'Provide factual information',
        'Address rumors proactively',
      ],
      suggestedActionsAr: [
        t('auto.engines_insightsEngine.60.24eb3a2b', 'ar'),
        t('auto.engines_insightsEngine.59.62475bef', 'ar'),
        t('auto.engines_insightsEngine.58.a2ef3c50', 'ar'),
      ],
    });
  }
  
  // 2.   
  if (emotions.anger > 65) {
    insights.push({
      id: 'high_anger',
      category: 'crisis',
      title: 'Public Anger Rising',
      titleAr: t('auto.engines_insightsEngine.57.882c9aca', 'ar'),
      description: `Anger at ${emotions.anger.toFixed(0)}% suggests growing frustration that may lead to protests or backlash.`,
      descriptionAr: `  ${emotions.anger.toFixed(0)}%            .`,
      confidence: 80,
      actionable: true,
    });
    
    predictions.push({
      id: 'anger_prediction',
      type: 'escalation',
      probability: Math.min(95, emotions.anger + 10),
      timeframe: '24-72 hours',
      description: 'Risk of public demonstrations or social media backlash',
      descriptionAr: t('auto.engines_insightsEngine.56.869d9165', 'ar'),
      basedOn: ['High anger levels', 'Historical patterns'],
      confidence: 75,
    });
  }
  
  // 3.   
  if (emotions.sadness > 70) {
    insights.push({
      id: 'high_sadness',
      category: 'crisis',
      title: 'Collective Grief Detected',
      titleAr: t('auto.engines_insightsEngine.55.48dad38f', 'ar'),
      description: `Sadness at ${emotions.sadness.toFixed(0)}% indicates a period of collective mourning or disappointment.`,
      descriptionAr: `  ${emotions.sadness.toFixed(0)}%        .`,
      confidence: 85,
      actionable: false,
    });
    
    recommendations.push({
      id: 'sadness_rec',
      priority: 'high',
      title: 'Empathetic Communication',
      titleAr: t('auto.engines_insightsEngine.54.c718191f', 'ar'),
      description: 'Focus on empathetic messaging and support resources.',
      descriptionAr: t('auto.engines_insightsEngine.53.44e55003', 'ar'),
      targetAudience: ['PR Teams', 'Community Managers'],
      expectedImpact: 'Improved public perception and trust',
      expectedImpactAr: t('auto.engines_insightsEngine.52.9fb7346f', 'ar'),
    });
  }
  
  // 4.    
  if (emotions.joy > 60 && emotions.hope > 60) {
    insights.push({
      id: 'positive_sentiment',
      category: 'opportunity',
      title: 'Positive Public Sentiment',
      titleAr: t('auto.engines_insightsEngine.51.418e0776', 'ar'),
      description: `Joy (${emotions.joy.toFixed(0)}%) and Hope (${emotions.hope.toFixed(0)}%) indicate favorable conditions for engagement.`,
      descriptionAr: ` (${emotions.joy.toFixed(0)}%)  (${emotions.hope.toFixed(0)}%)     .`,
      confidence: 90,
      actionable: true,
    });
    
    recommendations.push({
      id: 'opportunity_rec',
      priority: 'high',
      title: 'Capitalize on Positive Momentum',
      titleAr: t('auto.engines_insightsEngine.50.9e3906cd', 'ar'),
      description: 'Ideal time for announcements, launches, or community engagement.',
      descriptionAr: t('auto.engines_insightsEngine.49.4c4adf9e', 'ar'),
      targetAudience: ['Marketing Teams', 'Leadership'],
      expectedImpact: 'Higher engagement and positive reception',
      expectedImpactAr: t('auto.engines_insightsEngine.48.df2311a6', 'ar'),
    });
  }
  
  // ===   ===
  
  // 5.    (CFI)
  if (indices.cfi > 70) {
    alerts.push({
      id: 'cfi_critical',
      level: 'critical',
      title: 'Collective Fear Index Critical',
      titleAr: t('auto.engines_insightsEngine.47.fd6455d2', 'ar'),
      message: `CFI at ${indices.cfi.toFixed(1)}/100 - Potential social crisis within 72 hours`,
      messageAr: `   ${indices.cfi.toFixed(1)}/100 -     72 `,
      timestamp: new Date(),
      actionRequired: true,
      suggestedActions: [
        'Activate crisis management team',
        'Prepare official statements',
        'Monitor social media closely',
      ],
      suggestedActionsAr: [
        t('auto.engines_insightsEngine.46.aa3effa1', 'ar'),
        t('auto.engines_insightsEngine.45.b8eab239', 'ar'),
        t('auto.engines_insightsEngine.44.bff4754a', 'ar'),
      ],
    });
    
    predictions.push({
      id: 'crisis_prediction',
      type: 'crisis',
      probability: Math.min(95, indices.cfi + 5),
      timeframe: '24-72 hours',
      description: 'High probability of social unrest or crisis escalation',
      descriptionAr: t('auto.engines_insightsEngine.43.519796a2', 'ar'),
      basedOn: ['CFI > 70', 'Fear + Anger combination'],
      confidence: 80,
    });
  }
  
  // 6.    (HRI)
  if (indices.hri > 60) {
    insights.push({
      id: 'high_resilience',
      category: 'stability',
      title: 'Strong Community Resilience',
      titleAr: t('auto.engines_insightsEngine.42.3be4f17c', 'ar'),
      description: `HRI at ${indices.hri.toFixed(1)}/100 indicates the community is coping well and maintaining hope.`,
      descriptionAr: `   ${indices.hri.toFixed(1)}/100       .`,
      confidence: 85,
      actionable: false,
    });
    
    predictions.push({
      id: 'recovery_prediction',
      type: 'recovery',
      probability: indices.hri,
      timeframe: '1-2 weeks',
      description: 'Community likely to recover and stabilize',
      descriptionAr: t('auto.engines_insightsEngine.41.0709f707', 'ar'),
      basedOn: ['High HRI', 'Hope levels'],
      confidence: 75,
    });
  }
  
  // 7.    (GMI)
  if (indices.gmi < -30) {
    insights.push({
      id: 'negative_mood',
      category: 'crisis',
      title: 'Severely Negative Public Mood',
      titleAr: t('auto.engines_insightsEngine.40.0881a29e', 'ar'),
      description: `GMI at ${indices.gmi.toFixed(1)}/100 indicates widespread negativity requiring immediate attention.`,
      descriptionAr: `   ${indices.gmi.toFixed(1)}/100       .`,
      confidence: 90,
      actionable: true,
    });
  } else if (indices.gmi > 30) {
    insights.push({
      id: 'positive_mood',
      category: 'opportunity',
      title: 'Positive Public Mood',
      titleAr: t('auto.engines_insightsEngine.39.27a358da', 'ar'),
      description: `GMI at ${indices.gmi.toFixed(1)}/100 indicates favorable public sentiment.`,
      descriptionAr: `   ${indices.gmi.toFixed(1)}/100     .`,
      confidence: 85,
      actionable: true,
    });
  }
  
  // ===   ===
  const summary = generateSummary(data, insights, alerts);
  
  return {
    insights,
    alerts,
    recommendations,
    predictions,
    summary,
  };
}

/**
 *   
 */
function generateSummary(
  data: AnalysisData,
  insights: Insight[],
  alerts: Alert[]
): AnalysisInsights['summary'] {
  const { emotions, indices } = data;
  
  //   
  let overallSentiment: AnalysisInsights['summary']['overallSentiment'] = 'neutral';
  let overallSentimentAr = t('auto.engines_insightsEngine.38.7e22af2d', 'ar');
  
  if (indices.gmi < -50) {
    overallSentiment = 'very_negative';
    overallSentimentAr = t('auto.engines_insightsEngine.37.553f17f0', 'ar');
  } else if (indices.gmi < -20) {
    overallSentiment = 'negative';
    overallSentimentAr = t('auto.engines_insightsEngine.36.a5ed0453', 'ar');
  } else if (indices.gmi > 50) {
    overallSentiment = 'very_positive';
    overallSentimentAr = t('auto.engines_insightsEngine.35.88e2c083', 'ar');
  } else if (indices.gmi > 20) {
    overallSentiment = 'positive';
    overallSentimentAr = t('auto.engines_insightsEngine.34.3c9380a2', 'ar');
  }
  
  //   
  let riskLevel: AnalysisInsights['summary']['riskLevel'] = 'low';
  let riskLevelAr = t('auto.engines_insightsEngine.33.15b8dd47', 'ar');
  
  const criticalAlerts = alerts.filter(a => a.level === 'critical').length;
  const warningAlerts = alerts.filter(a => a.level === 'warning').length;
  
  if (criticalAlerts > 0 || indices.cfi > 80) {
    riskLevel = 'critical';
    riskLevelAr = t('auto.engines_insightsEngine.32.578fc664', 'ar');
  } else if (warningAlerts > 0 || indices.cfi > 60) {
    riskLevel = 'high';
    riskLevelAr = t('auto.engines_insightsEngine.31.76d89630', 'ar');
  } else if (indices.cfi > 40) {
    riskLevel = 'medium';
    riskLevelAr = t('auto.engines_insightsEngine.30.91fa23bd', 'ar');
  } else if (indices.cfi < 20) {
    riskLevel = 'minimal';
    riskLevelAr = t('auto.engines_insightsEngine.29.12941710', 'ar');
  }
  
  //   
  let opportunityLevel: AnalysisInsights['summary']['opportunityLevel'] = 'none';
  let opportunityLevelAr = t('auto.engines_insightsEngine.28.87e8e1d5', 'ar');
  
  if (emotions.joy > 70 && emotions.hope > 70) {
    opportunityLevel = 'high';
    opportunityLevelAr = t('auto.engines_insightsEngine.27.76d89630', 'ar');
  } else if (emotions.joy > 50 || emotions.hope > 50) {
    opportunityLevel = 'medium';
    opportunityLevelAr = t('auto.engines_insightsEngine.26.91fa23bd', 'ar');
  } else if (emotions.joy > 30 || emotions.hope > 30) {
    opportunityLevel = 'low';
    opportunityLevelAr = t('auto.engines_insightsEngine.25.15b8dd47', 'ar');
  }
  
  //   
  let keyMessage = '';
  let keyMessageAr = '';
  
  if (riskLevel === 'critical') {
    keyMessage = `⚠️ CRITICAL: Community in crisis state. Immediate intervention recommended. ${criticalAlerts} critical alert(s) active.`;
    keyMessageAr = `⚠️ :    .   . ${criticalAlerts} ()  .`;
  } else if (riskLevel === 'high') {
    keyMessage = `⚡ WARNING: Elevated risk levels detected. Monitor closely and prepare response strategies.`;
    keyMessageAr = t('auto.engines_insightsEngine.24.786e1af2', 'ar');
  } else if (opportunityLevel === 'high') {
    keyMessage = `✨ OPPORTUNITY: Highly positive sentiment detected. Ideal conditions for engagement and announcements.`;
    keyMessageAr = t('auto.engines_insightsEngine.23.f8de8f59', 'ar');
  } else if (overallSentiment === 'neutral') {
    keyMessage = `📊 STABLE: Community sentiment is balanced. Continue monitoring for changes.`;
    keyMessageAr = t('auto.engines_insightsEngine.22.a88a4df5', 'ar');
  } else {
    keyMessage = `📈 ${overallSentiment.toUpperCase()}: Current sentiment is ${overallSentiment}. ${insights.length} insight(s) generated.`;
    keyMessageAr = `📈 ${overallSentimentAr}:   ${overallSentimentAr}.   ${insights.length} .`;
  }
  
  return {
    overallSentiment,
    overallSentimentAr,
    riskLevel,
    riskLevelAr,
    opportunityLevel,
    opportunityLevelAr,
    keyMessage,
    keyMessageAr,
  };
}

/**
 *   
 */
export function formatAlert(alert: Alert, language: 'en' | 'ar' = 'ar'): string {
  const levelEmoji = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
    positive: '✅',
  };
  
  if (language === 'ar') {
    return `${levelEmoji[alert.level]} ${alert.titleAr}\n${alert.messageAr}`;
  }
  return `${levelEmoji[alert.level]} ${alert.title}\n${alert.message}`;
}

/**
 *   
 */
export function formatPrediction(prediction: Prediction, language: 'en' | 'ar' = 'ar'): string {
  const typeEmoji = {
    crisis: '🔴',
    recovery: '🟢',
    escalation: '🟠',
    stabilization: '🟡',
  };
  
  if (language === 'ar') {
    return `${typeEmoji[prediction.type]} ${prediction.descriptionAr}\n📊 : ${prediction.probability}% | ⏱️  : ${prediction.timeframe}`;
  }
  return `${typeEmoji[prediction.type]} ${prediction.description}\n📊 Probability: ${prediction.probability}% | ⏱️ Timeframe: ${prediction.timeframe}`;
}
/**
 * Quick Explanation System
 * 
 * Provides quick 3-sentence explanations of what's happening in the world
 * Answers: "What is the world experiencing right now?"
 */

import { type EventVector } from './eventVectorEngine';

export interface QuickExplanation {
  timestamp: number;
  mainTheme: string;
  mainThemeArabic: string;
  recentEvents: Array<{
    event: string;
    eventArabic: string;
    topic: string;
    region: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;
  explanation: {
    sentence1: string;
    sentence2: string;
    sentence3: string;
  };
  explanationArabic: {
    sentence1: string;
    sentence2: string;
    sentence3: string;
  };
  connections: Array<{
    event1: string;
    event2: string;
    connection: string;
    connectionArabic: string;
  }>;
  forecast: {
    nextStep: string;
    nextStepArabic: string;
    timeframe: string;
  };
}

/**
 * Get top events from EventVectors
 */
function getTopEvents(eventVectors: EventVector[], limit: number = 5): EventVector[] {
  return eventVectors
    .sort((a, b) => {
      // Sort by intensity and data volume
      const scoreA = a.intensity * (a.totalItems / 100);
      const scoreB = b.intensity * (b.totalItems / 100);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Determine main theme from events
 */
function determineMainTheme(topEvents: EventVector[]): { theme: string; themeArabic: string } {
  const topicCounts: Record<string, number> = {};
  
  for (const ev of topEvents) {
    topicCounts[ev.dominantCategory] = (topicCounts[ev.dominantCategory] || 0) + 1;
  }
  
  const dominantTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'global';
  
  const themes: Record<string, { theme: string; themeArabic: string }> = {
    economy: { theme: 'Economic Instability', themeArabic: t('auto.engines_insightsEngine.21.39a9fe84', 'ar') },
    politics: { theme: 'Political Tensions', themeArabic: t('auto.engines_insightsEngine.20.bebcea27', 'ar') },
    conflict: { theme: 'Global Conflicts', themeArabic: t('auto.engines_insightsEngine.19.a8170e71', 'ar') },
    society: { theme: 'Social Unrest', themeArabic: t('auto.engines_insightsEngine.18.3d21d670', 'ar') },
    health: { theme: 'Health Crisis', themeArabic: t('auto.engines_insightsEngine.17.ef7f3f70', 'ar') },
    environment: { theme: 'Environmental Crisis', themeArabic: t('auto.engines_insightsEngine.16.3a6615e8', 'ar') },
    technology: { theme: 'Tech Disruption', themeArabic: t('auto.engines_insightsEngine.15.023f57a7', 'ar') },
    culture: { theme: 'Cultural Shifts', themeArabic: t('auto.engines_insightsEngine.14.f8bfd98c', 'ar') },
    global: { theme: 'Global Developments', themeArabic: t('auto.engines_insightsEngine.13.125bdea8', 'ar') },
  };
  
  return themes[dominantTopic] || themes.global;
}

/**
 * Generate quick explanation from events
 */
function generateExplanation(topEvents: EventVector[]): { explanation: QuickExplanation['explanation']; explanationArabic: QuickExplanation['explanationArabic'] } {
  if (topEvents.length === 0) {
    return {
      explanation: {
        sentence1: 'The world is experiencing relative stability.',
        sentence2: 'No major crises are currently dominating global attention.',
        sentence3: 'Conditions remain favorable for continued development.',
      },
      explanationArabic: {
        sentence1: t('auto.engines_insightsEngine.12.199aec41', 'ar'),
        sentence2: t('auto.engines_insightsEngine.11.c243ae3a', 'ar'),
        sentence3: t('auto.engines_insightsEngine.10.526a4103', 'ar'),
      },
    };
  }
  
  // Get top 3 events
  const top3 = topEvents.slice(0, 3);
  
  // Sentence 1: What is happening
  const event1 = top3[0];
  const regionName = event1.countryCode || 'the global stage';
  const sentence1 = `The world is experiencing significant ${event1.dominantCategory} challenges, particularly in ${regionName}.`;
  const sentence1Arabic = `     ${event1.dominantCategory}   ${regionName}.`;
  
  // Sentence 2: Why it matters
  const affectedCount = top3.length;
  const avgIntensity = top3.reduce((sum, ev) => sum + ev.intensity, 0) / top3.length;
  const sentence2 = `${affectedCount} major events are unfolding with ${avgIntensity > 0.7 ? 'high' : 'moderate'} intensity, affecting millions globally.`;
  const sentence2Arabic = `${affectedCount}     ${avgIntensity > 0.7 ? t('auto.engines_insightsEngine.9.4cf9782b', 'ar') : t('auto.engines_insightsEngine.8.9e00c45c', 'ar')}      .`;
  
  // Sentence 3: What comes next
  const avgPolarity = top3.reduce((sum, ev) => sum + ev.polarity, 0) / top3.length;
  const sentence3 = avgPolarity > 0 
    ? 'However, there are signs of recovery and positive developments emerging.'
    : 'The situation requires immediate attention and coordinated global response.';
  const sentence3Arabic = avgPolarity > 0
    ? t('auto.engines_insightsEngine.7.89c5c2ca', 'ar')
    : t('auto.engines_insightsEngine.6.85f79c13', 'ar');
  
  return {
    explanation: {
      sentence1,
      sentence2,
      sentence3,
    },
    explanationArabic: {
      sentence1: sentence1Arabic,
      sentence2: sentence2Arabic,
      sentence3: sentence3Arabic,
    },
  };
}

/**
 * Identify connections between events
 */
function identifyConnections(topEvents: EventVector[]): QuickExplanation['connections'] {
  const connections: QuickExplanation['connections'] = [];
  
  // Find events in same region
  const regionGroups: Record<string, EventVector[]> = {};
  for (const ev of topEvents) {
    const region = ev.countryCode || 'global';
    if (!regionGroups[region]) regionGroups[region] = [];
    regionGroups[region].push(ev);
  }
  
  // Create connections for events in same region
  for (const [region, events] of Object.entries(regionGroups)) {
    if (events.length >= 2) {
      const ev1 = events[0];
      const ev2 = events[1];
      const regionName = ev1.countryCode || 'global';
      connections.push({
        event1: ev1.query,
        event2: ev2.query,
        connection: `Both events are occurring in ${regionName} and may be interconnected.`,
        connectionArabic: `    ${regionName}   .`,
      });
    }
  }
  
  // Find events with same topic
  const topicGroups: Record<string, EventVector[]> = {};
  for (const ev of topEvents) {
    if (!topicGroups[ev.dominantCategory]) topicGroups[ev.dominantCategory] = [];
    topicGroups[ev.dominantCategory].push(ev);
  }
  
  for (const [topic, events] of Object.entries(topicGroups)) {
    if (events.length >= 2) {
      const ev1 = events[0];
      const ev2 = events[1];
      connections.push({
        event1: ev1.query,
        event2: ev2.query,
        connection: `Both events relate to ${topic} and may have cascading effects.`,
        connectionArabic: `    ${topic}     .`,
      });
    }
  }
  
  return connections.slice(0, 3);
}

/**
 * Generate forecast
 */
function generateForecast(topEvents: EventVector[]): QuickExplanation['forecast'] {
  if (topEvents.length === 0) {
    return {
      nextStep: 'Continue monitoring for any significant developments.',
      nextStepArabic: t('auto.engines_insightsEngine.5.bc898dc7', 'ar'),
      timeframe: 'Next 24-48 hours',
    };
  }
  
  const topEvent = topEvents[0];
  const avgIntensity = topEvents.reduce((sum, ev) => sum + ev.intensity, 0) / topEvents.length;
  
  let nextStep = '';
  let nextStepArabic = '';
  
  if (avgIntensity > 0.7) {
    nextStep = 'Expect rapid developments and potential escalation in affected regions.';
    nextStepArabic = t('auto.engines_insightsEngine.4.3807e80a', 'ar');
  } else if (avgIntensity > 0.4) {
    nextStep = 'Monitor situation closely as developments may unfold over the coming days.';
    nextStepArabic = t('auto.engines_insightsEngine.3.bee5e588', 'ar');
  } else {
    nextStep = 'Situation is manageable; continue normal operations with awareness.';
    nextStepArabic = t('auto.engines_insightsEngine.2.71a14b28', 'ar');
  }
  
  return {
    nextStep,
    nextStepArabic,
    timeframe: 'Next 24-48 hours',
  };
}

/**
 * Generate quick explanation
 */
export function generateQuickExplanation(eventVectors: EventVector[]): QuickExplanation {
  const topEvents = getTopEvents(eventVectors, 5);
  const { theme, themeArabic } = determineMainTheme(topEvents);
  const { explanation, explanationArabic } = generateExplanation(topEvents);
  const connections = identifyConnections(topEvents);
  const forecast = generateForecast(topEvents);
  
  const recentEvents = topEvents.map(ev => {
    const impact: 'low' | 'medium' | 'high' | 'critical' = ev.intensity > 0.7 ? 'critical' : ev.intensity > 0.5 ? 'high' : ev.intensity > 0.3 ? 'medium' : 'low';
    return {
      event: ev.query,
      eventArabic: `${ev.dominantCategory}  ${ev.countryCode || t('auto.engines_insightsEngine.1.b4d34f40', 'ar')}`, // Simplified Arabic
      topic: ev.dominantCategory,
      region: ev.countryCode || 'global',
      impact,
    };
  });
  
  return {
    timestamp: Date.now(),
    mainTheme: theme,
    mainThemeArabic: themeArabic,
    recentEvents,
    explanation,
    explanationArabic,
    connections,
    forecast,
  };
}

/**
 * Format quick explanation for display
 */
export function formatQuickExplanation(explanation: QuickExplanation): string {
  return `
═══════════════════════════════════════════════════════════════
                    WHAT'S HAPPENING NOW?
═══════════════════════════════════════════════════════════════

MAIN THEME: ${explanation.mainTheme}
(${explanation.mainThemeArabic})

───────────────────────────────────────────────────────────────
RECENT EVENTS
───────────────────────────────────────────────────────────────
${explanation.recentEvents.map((ev, i) => 
  `${i + 1}. ${ev.event}
   Topic: ${ev.topic} | Region: ${ev.region} | Impact: ${ev.impact.toUpperCase()}`
).join('\n')}

───────────────────────────────────────────────────────────────
QUICK EXPLANATION (3 SENTENCES)
───────────────────────────────────────────────────────────────

${explanation.explanation.sentence1}
${explanation.explanation.sentence2}
${explanation.explanation.sentence3}

Arabic:
${explanation.explanationArabic.sentence1}
${explanation.explanationArabic.sentence2}
${explanation.explanationArabic.sentence3}

───────────────────────────────────────────────────────────────
CONNECTIONS
───────────────────────────────────────────────────────────────
${explanation.connections.map((c, i) => 
  `${i + 1}. ${c.connection}
   Arabic: ${c.connectionArabic}`
).join('\n')}

───────────────────────────────────────────────────────────────
WHAT COMES NEXT?
───────────────────────────────────────────────────────────────
${explanation.forecast.nextStep}
(${explanation.forecast.nextStepArabic})

Timeframe: ${explanation.forecast.timeframe}

═══════════════════════════════════════════════════════════════
  `.trim();
}
// MERGED FROM quickExplanationSystem.ts
