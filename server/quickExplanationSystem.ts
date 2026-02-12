/**
 * Quick Explanation System
 * 
 * Provides quick 3-sentence explanations of what's happening in the world
 * Answers: "What is the world experiencing right now?"
 */

import { EventVector } from './eventVectorModel';

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
      // Sort by intensity * relevance * recency
      const scoreA = a.intensity * a.relevanceWeight * a.timeWeight;
      const scoreB = b.intensity * b.relevanceWeight * b.timeWeight;
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
    topicCounts[ev.topic] = (topicCounts[ev.topic] || 0) + 1;
  }
  
  const dominantTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'global';
  
  const themes: Record<string, { theme: string; themeArabic: string }> = {
    economy: { theme: 'Economic Instability', themeArabic: 'عدم الاستقرار الاقتصادي' },
    politics: { theme: 'Political Tensions', themeArabic: 'التوترات السياسية' },
    conflict: { theme: 'Global Conflicts', themeArabic: 'الصراعات العالمية' },
    society: { theme: 'Social Unrest', themeArabic: 'الاضطرابات الاجتماعية' },
    health: { theme: 'Health Crisis', themeArabic: 'أزمة صحية' },
    environment: { theme: 'Environmental Crisis', themeArabic: 'أزمة بيئية' },
    technology: { theme: 'Tech Disruption', themeArabic: 'الاضطراب التكنولوجي' },
    culture: { theme: 'Cultural Shifts', themeArabic: 'التحولات الثقافية' },
    global: { theme: 'Global Developments', themeArabic: 'التطورات العالمية' },
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
        sentence1: 'يشهد العالم استقرارًا نسبيًا.',
        sentence2: 'لا توجد أزمات كبرى تهيمن على الاهتمام العالمي حاليًا.',
        sentence3: 'تبقى الظروف مواتية للاستمرار في التطور.',
      },
    };
  }
  
  // Get top 3 events
  const top3 = topEvents.slice(0, 3);
  
  // Sentence 1: What is happening
  const event1 = top3[0];
  const sentence1 = `The world is experiencing significant ${event1.topic} challenges, particularly in ${event1.region}.`;
  const sentence1Arabic = `يشهد العالم تحديات كبيرة في ${event1.topic}، خاصة في ${event1.region}.`;
  
  // Sentence 2: Why it matters
  const affectedCount = top3.length;
  const avgIntensity = top3.reduce((sum, ev) => sum + ev.intensity, 0) / top3.length;
  const sentence2 = `${affectedCount} major events are unfolding with ${avgIntensity > 0.7 ? 'high' : 'moderate'} intensity, affecting millions globally.`;
  const sentence2Arabic = `${affectedCount} أحداث رئيسية تتكشف بـ ${avgIntensity > 0.7 ? 'شدة عالية' : 'شدة معتدلة'}، مما يؤثر على ملايين الأشخاص عالميًا.`;
  
  // Sentence 3: What comes next
  const avgPolarity = top3.reduce((sum, ev) => sum + ev.polarity, 0) / top3.length;
  const sentence3 = avgPolarity > 0 
    ? 'However, there are signs of recovery and positive developments emerging.'
    : 'The situation requires immediate attention and coordinated global response.';
  const sentence3Arabic = avgPolarity > 0
    ? 'ومع ذلك، هناك علامات على التعافي والتطورات الإيجابية الناشئة.'
    : 'يتطلب الوضع اهتمامًا فوريًا واستجابة عالمية منسقة.';
  
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
    if (!regionGroups[ev.region]) regionGroups[ev.region] = [];
    regionGroups[ev.region].push(ev);
  }
  
  // Create connections for events in same region
  for (const [region, events] of Object.entries(regionGroups)) {
    if (events.length >= 2) {
      const ev1 = events[0];
      const ev2 = events[1];
      connections.push({
        event1: ev1.summary,
        event2: ev2.summary,
        connection: `Both events are occurring in ${region} and may be interconnected.`,
        connectionArabic: `كلا الحدثين يحدثان في ${region} وقد يكونان مترابطين.`,
      });
    }
  }
  
  // Find events with same topic
  const topicGroups: Record<string, EventVector[]> = {};
  for (const ev of topEvents) {
    if (!topicGroups[ev.topic]) topicGroups[ev.topic] = [];
    topicGroups[ev.topic].push(ev);
  }
  
  for (const [topic, events] of Object.entries(topicGroups)) {
    if (events.length >= 2) {
      const ev1 = events[0];
      const ev2 = events[1];
      connections.push({
        event1: ev1.summary,
        event2: ev2.summary,
        connection: `Both events relate to ${topic} and may have cascading effects.`,
        connectionArabic: `كلا الحدثين يتعلقان بـ ${topic} وقد يكون لهما تأثيرات متسلسلة.`,
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
      nextStepArabic: 'استمر في مراقبة أي تطورات مهمة.',
      timeframe: 'Next 24-48 hours',
    };
  }
  
  const topEvent = topEvents[0];
  const avgIntensity = topEvents.reduce((sum, ev) => sum + ev.intensity, 0) / topEvents.length;
  
  let nextStep = '';
  let nextStepArabic = '';
  
  if (avgIntensity > 0.7) {
    nextStep = 'Expect rapid developments and potential escalation in affected regions.';
    nextStepArabic = 'توقع تطورات سريعة وتصعيدًا محتملاً في المناطق المتأثرة.';
  } else if (avgIntensity > 0.4) {
    nextStep = 'Monitor situation closely as developments may unfold over the coming days.';
    nextStepArabic = 'راقب الوضع عن كثب حيث قد تتطور الأحداث خلال الأيام القادمة.';
  } else {
    nextStep = 'Situation is manageable; continue normal operations with awareness.';
    nextStepArabic = 'الوضع قابل للإدارة؛ استمر في العمليات العادية مع الوعي.';
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
      event: ev.summary,
      eventArabic: `${ev.topic} في ${ev.region}`, // Simplified Arabic
      topic: ev.topic as string,
      region: ev.region as string,
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
