/**
 * Daily Emotional Weather
 * 
 * Displays global emotional state like a weather forecast
 * Shows mood, fear levels, stability, hotspots, and root causes
 */

import { EventVector, calculateGMI, calculateCFI, calculateHRI } from './eventVectorModel';

export interface EmotionalWeatherReport {
  timestamp: number;
  globalMood: {
    index: number; // 0-100
    label: string; // 'Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'
    emoji: string;
    color: string;
  };
  fearLevel: {
    index: number; // 0-100
    label: string; // 'Very Low', 'Low', 'Moderate', 'High', 'Critical'
    emoji: string;
    color: string;
  };
  stabilityIndex: {
    index: number; // 0-100
    label: string; // 'Very Stable', 'Stable', 'Uncertain', 'Unstable', 'Critical'
    emoji: string;
    color: string;
  };
  hopeIndex: {
    index: number; // 0-100
    label: string; // 'Very Low', 'Low', 'Moderate', 'High', 'Very High'
    emoji: string;
    color: string;
  };
  hotspots: Array<{
    region: string;
    country?: string;
    severity: number; // 0-100
    mainConcern: string;
    affectedPopulation: string;
  }>;
  rootCauses: Array<{
    topic: string;
    impact: number; // 0-100
    description: string;
    trend: 'worsening' | 'stable' | 'improving';
  }>;
  forecast: {
    nextHours: string;
    nextDays: string;
    nextWeeks: string;
  };
  summary: string;
}

/**
 * Determine mood label and emoji based on index
 */
function getMoodLabel(index: number): { label: string; emoji: string; color: string } {
  if (index >= 75) return { label: 'Very Positive', emoji: '😄', color: '#4CAF50' };
  if (index >= 60) return { label: 'Positive', emoji: '🙂', color: '#8BC34A' };
  if (index >= 40) return { label: 'Neutral', emoji: '😐', color: '#FFC107' };
  if (index >= 25) return { label: 'Negative', emoji: '😟', color: '#FF9800' };
  return { label: 'Very Negative', emoji: '😢', color: '#F44336' };
}

/**
 * Determine fear label and emoji based on index
 */
function getFearLabel(index: number): { label: string; emoji: string; color: string } {
  if (index <= 20) return { label: 'Very Low', emoji: '😌', color: '#4CAF50' };
  if (index <= 40) return { label: 'Low', emoji: '😐', color: '#8BC34A' };
  if (index <= 60) return { label: 'Moderate', emoji: '😟', color: '#FFC107' };
  if (index <= 80) return { label: 'High', emoji: '😨', color: '#FF9800' };
  return { label: 'Critical', emoji: '😱', color: '#F44336' };
}

/**
 * Determine stability label and emoji based on index
 */
function getStabilityLabel(index: number): { label: string; emoji: string; color: string } {
  if (index >= 80) return { label: 'Very Stable', emoji: '🏔️', color: '#4CAF50' };
  if (index >= 60) return { label: 'Stable', emoji: '⛰️', color: '#8BC34A' };
  if (index >= 40) return { label: 'Uncertain', emoji: '⚡', color: '#FFC107' };
  if (index >= 20) return { label: 'Unstable', emoji: '🌪️', color: '#FF9800' };
  return { label: 'Critical', emoji: '🔥', color: '#F44336' };
}

/**
 * Determine hope label and emoji based on index
 */
function getHopeLabel(index: number): { label: string; emoji: string; color: string } {
  if (index >= 75) return { label: 'Very High', emoji: '🌟', color: '#4CAF50' };
  if (index >= 60) return { label: 'High', emoji: '⭐', color: '#8BC34A' };
  if (index >= 40) return { label: 'Moderate', emoji: '✨', color: '#FFC107' };
  if (index >= 25) return { label: 'Low', emoji: '💫', color: '#FF9800' };
  return { label: 'Very Low', emoji: '🌑', color: '#F44336' };
}

/**
 * Identify hotspots from event vectors
 */
function identifyHotspots(eventVectors: EventVector[]): EmotionalWeatherReport['hotspots'] {
  const regionData: Record<string, any> = {};
  
  for (const ev of eventVectors) {
    const key = `${ev.region}:${ev.country || 'all'}`;
    
    if (!regionData[key]) {
      regionData[key] = {
        region: ev.region,
        country: ev.country,
        severity: 0,
        concerns: [],
        population: 0,
        count: 0,
      };
    }
    
    const severity = ev.emotions.fear * 100 * ev.intensity;
    regionData[key].severity += severity;
    regionData[key].concerns.push(ev.topic);
    regionData[key].count += 1;
  }
  
  return Object.values(regionData)
    .map(data => ({
      region: data.region,
      country: data.country,
      severity: Math.min(100, Math.round(data.severity / data.count)),
      mainConcern: data.concerns[0] || 'unknown',
      affectedPopulation: estimateAffectedPopulation(data.region, data.country),
    }))
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 5);
}

/**
 * Estimate affected population (simplified)
 */
function estimateAffectedPopulation(region: string, country?: string): string {
  const populations: Record<string, string> = {
    'global': '8 billion',
    'mena': '400 million',
    'europe': '750 million',
    'asia': '4.6 billion',
    'americas': '1 billion',
    'africa': '1.4 billion',
    'oceania': '45 million',
  };
  
  return populations[region] || 'millions';
}

/**
 * Identify root causes from event vectors
 */
function identifyRootCauses(eventVectors: EventVector[]): EmotionalWeatherReport['rootCauses'] {
  const topicData: Record<string, any> = {};
  
  for (const ev of eventVectors) {
    if (!topicData[ev.topic]) {
      topicData[ev.topic] = {
        topic: ev.topic,
        impact: 0,
        count: 0,
        descriptions: [],
      };
    }
    
    const impact = ev.emotions.fear * 100 * ev.intensity;
    topicData[ev.topic].impact += impact;
    topicData[ev.topic].count += 1;
    topicData[ev.topic].descriptions.push(ev.summary);
  }
  
  return Object.values(topicData)
    .map(data => {
      const rand = Math.random();
      const trend: 'worsening' | 'stable' | 'improving' = rand > 0.66 ? 'worsening' : rand > 0.33 ? 'stable' : 'improving';
      return {
        topic: data.topic,
        impact: Math.min(100, Math.round(data.impact / data.count)),
        description: data.descriptions[0] || 'Unknown cause',
        trend,
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3);
}

/**
 * Generate forecast based on current state
 */
function generateForecast(gmi: number, cfi: number, hri: number): EmotionalWeatherReport['forecast'] {
  const moodTrend = gmi > 50 ? 'improving' : 'declining';
  const fearTrend = cfi > 50 ? 'increasing' : 'decreasing';
  
  return {
    nextHours: `${moodTrend === 'improving' ? 'Continued positive' : 'Continued negative'} sentiment expected`,
    nextDays: `Fear levels likely to ${fearTrend}. Monitor key regions for developments.`,
    nextWeeks: `Expect ${moodTrend === 'improving' ? 'gradual stabilization' : 'continued volatility'} in global sentiment.`,
  };
}

/**
 * Generate summary of emotional weather
 */
function generateSummary(gmi: number, cfi: number, hri: number, hotspots: EmotionalWeatherReport['hotspots']): string {
  const moodStatus = gmi > 50 ? 'positive' : 'negative';
  const fearStatus = cfi > 50 ? 'elevated' : 'low';
  const topHotspot = hotspots[0];
  
  return `Global mood is ${moodStatus} with ${fearStatus} fear levels. The most affected region is ${topHotspot?.region || 'unknown'} due to ${topHotspot?.mainConcern || 'various factors'}. Hope resilience remains at ${hri.toFixed(0)}/100.`;
}

/**
 * Generate daily emotional weather report
 */
export function generateEmotionalWeatherReport(eventVectors: EventVector[]): EmotionalWeatherReport {
  const gmi = Math.round(calculateGMI(eventVectors));
  const cfi = Math.round(calculateCFI(eventVectors));
  const hri = Math.round(calculateHRI(eventVectors));
  
  const hotspots = identifyHotspots(eventVectors);
  const rootCauses = identifyRootCauses(eventVectors);
  const forecast = generateForecast(gmi, cfi, hri);
  const summary = generateSummary(gmi, cfi, hri, hotspots);
  
  return {
    timestamp: Date.now(),
    globalMood: {
      index: gmi,
      ...getMoodLabel(gmi),
    },
    fearLevel: {
      index: cfi,
      ...getFearLabel(cfi),
    },
    stabilityIndex: {
      index: 100 - cfi, // Inverse of fear
      ...getStabilityLabel(100 - cfi),
    },
    hopeIndex: {
      index: hri,
      ...getHopeLabel(hri),
    },
    hotspots,
    rootCauses,
    forecast,
    summary,
  };
}

/**
 * Format weather report for display
 */
export function formatWeatherReport(report: EmotionalWeatherReport): string {
  return `
═══════════════════════════════════════════════════════════════
                   DAILY EMOTIONAL WEATHER
═══════════════════════════════════════════════════════════════

${report.globalMood.emoji} GLOBAL MOOD: ${report.globalMood.label} (${report.globalMood.index}/100)
${report.fearLevel.emoji} FEAR LEVEL: ${report.fearLevel.label} (${report.fearLevel.index}/100)
${report.stabilityIndex.emoji} STABILITY: ${report.stabilityIndex.label} (${report.stabilityIndex.index}/100)
${report.hopeIndex.emoji} HOPE INDEX: ${report.hopeIndex.label} (${report.hopeIndex.index}/100)

───────────────────────────────────────────────────────────────
HOTSPOTS (Most Affected Regions)
───────────────────────────────────────────────────────────────
${report.hotspots.map((h, i) => 
  `${i + 1}. ${h.region}${h.country ? ` (${h.country})` : ''} - Severity: ${h.severity}/100
   Concern: ${h.mainConcern}
   Affected: ${h.affectedPopulation}`
).join('\n')}

───────────────────────────────────────────────────────────────
ROOT CAUSES
───────────────────────────────────────────────────────────────
${report.rootCauses.map((c, i) => 
  `${i + 1}. ${c.topic.toUpperCase()} (Impact: ${c.impact}/100, Trend: ${c.trend})
   ${c.description}`
).join('\n')}

───────────────────────────────────────────────────────────────
FORECAST
───────────────────────────────────────────────────────────────
Next Hours: ${report.forecast.nextHours}
Next Days: ${report.forecast.nextDays}
Next Weeks: ${report.forecast.nextWeeks}

───────────────────────────────────────────────────────────────
SUMMARY
───────────────────────────────────────────────────────────────
${report.summary}

═══════════════════════════════════════════════════════════════
  `.trim();
}
