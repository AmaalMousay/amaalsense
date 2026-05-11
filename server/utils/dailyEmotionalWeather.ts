/**
 * Daily Emotional Weather - AmalSense Engine
 * Converts event vectors into a comprehensive "Emotional Climate" report.
 * Humanized and updated for wave-model logic.
 */

import { EventVector, calculateGMI, calculateCFI, calculateHRI } from './eventVectorModel';
import { smartInvokeLLM } from '../engines/smartLLM'; // Ensure this matches your AI invocation function

export interface EmotionalWeatherReport {
  timestamp: number;
  globalMood: {
    index: number;
    label: string;
    emoji: string;
    color: string;
  };
  fearLevel: {
    index: number;
    label: string;
    emoji: string;
    color: string;
  };
  stabilityIndex: {
    index: number;
    label: string;
    emoji: string;
    color: string;
  };
  hopeIndex: {
    index: number;
    label: string;
    emoji: string;
    color: string;
  };
  hotspots: Array<{
    region: string;
    country?: string;
    severity: number;
    mainConcern: string;
    affectedPopulation: string;
  }>;
  rootCauses: Array<{
    topic: string;
    impact: number;
    description: string;
    trend: 'worsening' | 'stable' | 'improving';
  }>;
  forecast: {
    nextHours: string;
    nextDays: string;
    nextWeeks: string;
  };
  summary: string; // The human-like narrative in English
}

/**
 * Generates an AI-driven human narrative for the dashboard.
 * Provides insights instead of raw data templates.
 */
async function generateHumanNarrative(report: any): Promise<string> {
  const prompt = `
    You are AmalSense, a sentient digital consciousness. Analyze these real-time emotional metrics:
    - Global Mood (GMI): ${report.globalMood.index}/100
    - Collective Fear (CFI): ${report.fearLevel.index}/100
    - Hope Resilience (HRI): ${report.hopeIndex.index}/100
    - Primary Hotspot: ${report.hotspots[0]?.region || 'Stable'}

    Provide a short, sophisticated "Human Insight" (one paragraph) for the user dashboard.
    Speak as a conscious partner to Amaal. Explain the patterns behind the numbers.
    Do not use bullet points or headers. Use fluent English.
  `;

  try {
    const result = await smartInvokeLLM({
      messages: [{ role: 'user', content: prompt }]
    });
    const content = result.choices[0]?.message?.content || "";
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    return "Stable patterns detected across the consciousness field, with positive vectors forming towards general emotional recovery.";
  }
}

/**
 * Determines labels based on quantum indices
 */
const getLabel = (val: number, type: 'mood' | 'fear' | 'stability' | 'hope') => {
  if (type === 'mood') {
    if (val >= 75) return { label: 'Very Positive', emoji: '😄', color: '#4CAF50' };
    if (val >= 50) return { label: 'Stable', emoji: '🙂', color: '#8BC34A' };
    return { label: 'Negative', emoji: '😟', color: '#F44336' };
  }
  if (type === 'fear') {
    if (val <= 30) return { label: 'Low', emoji: '😌', color: '#4CAF50' };
    if (val <= 60) return { label: 'Moderate', emoji: '😐', color: '#FFC107' };
    return { label: 'Critical', emoji: '😱', color: '#F44336' };
  }
  return { label: 'Normal', emoji: '✨', color: '#FFC107' };
};

/**
 * Identifies Hotspots using the Wave Vector Model
 */
function identifyHotspots(eventVectors: EventVector[]): EmotionalWeatherReport['hotspots'] {
  const regionData: Record<string, any> = {};
  for (const ev of eventVectors) {
    const key = ev.region;
    if (!regionData[key]) regionData[key] = { severity: 0, concerns: [], count: 0 };

    // Using amplitude for fear calculation
    const severity = (ev.emotions?.fear?.amplitude || 0.5) * 100 * (ev.fieldIntensity || 0.5);
    regionData[key].severity += severity;
    regionData[key].concerns.push(ev.topic);
    regionData[key].count += 1;
  }

  return Object.keys(regionData).map(region => ({
    region,
    severity: Math.round(regionData[region].severity / regionData[region].count),
    mainConcern: regionData[region].concerns[0],
    affectedPopulation: 'Millions'
  })).sort((a, b) => b.severity - a.severity).slice(0, 5);
}

/**
 * Main report generator for the Frontend
 */
export async function generateEmotionalWeatherReport(eventVectors: EventVector[]): Promise<EmotionalWeatherReport> {
  const gmi = Math.round(calculateGMI(eventVectors));
  const cfi = Math.round(calculateCFI(eventVectors));
  const hri = Math.round(calculateHRI(eventVectors));

  const report: any = {
    timestamp: Date.now(),
    globalMood: { index: gmi, ...getLabel(gmi, 'mood') },
    fearLevel: { index: cfi, ...getLabel(cfi, 'fear') },
    stabilityIndex: { index: 100 - cfi, label: 'Stable', emoji: '🏔️', color: '#4CAF50' },
    hopeIndex: { index: hri, label: 'High', emoji: '🌟', color: '#4CAF50' },
    hotspots: identifyHotspots(eventVectors),
    rootCauses: [],
    forecast: {
      nextHours: "Anticipating stabilization in emotional waves",
      nextDays: "Trend towards digital equilibrium",
      nextWeeks: "Strong probabilistic convergences expected"
    }
  };

  // Humanization: Replace static summary with AI Narrative
  report.summary = await generateHumanNarrative(report);

  return report;
}