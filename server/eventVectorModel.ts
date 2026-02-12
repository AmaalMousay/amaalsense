/**
 * EventVector - Complete Data Model for AmalSense
 * 
 * Represents a complete emotional and contextual snapshot of a global event
 * Used as the foundation for all emotional analysis and metrics calculation
 */

import { z } from 'zod';

/**
 * EmotionVector - 6-dimensional emotional representation
 * Each emotion is normalized to 0-1 range
 */
export const EmotionVectorSchema = z.object({
  joy: z.number().min(0).max(1).describe('Positive sentiment, happiness, optimism'),
  fear: z.number().min(0).max(1).describe('Anxiety, dread, uncertainty'),
  anger: z.number().min(0).max(1).describe('Frustration, outrage, resentment'),
  sadness: z.number().min(0).max(1).describe('Grief, despair, loss'),
  hope: z.number().min(0).max(1).describe('Optimism, belief in positive future'),
  curiosity: z.number().min(0).max(1).describe('Interest, desire to understand'),
});

export type EmotionVector = z.infer<typeof EmotionVectorSchema>;

/**
 * EventVector - Complete event representation
 * Contains all data needed for comprehensive emotional analysis
 */
export const EventVectorSchema = z.object({
  // === IDENTIFICATION ===
  id: z.string().describe('Unique event identifier (evt_001, evt_002, etc.)'),
  timestamp: z.number().describe('Unix timestamp of event'),
  
  // === CLASSIFICATION ===
  topic: z.enum([
    'economy',
    'politics',
    'conflict',
    'society',
    'health',
    'environment',
    'technology',
    'culture',
    'other'
  ]).describe('Main topic category'),
  
  subTopic: z.string().optional().describe('Specific subtopic (inflation, migration, elections, etc.)'),
  
  region: z.enum([
    'global',
    'europe',
    'mena',
    'asia',
    'americas',
    'africa',
    'oceania'
  ]).describe('Geographic region'),
  
  country: z.string().optional().describe('Specific country code (ISO 3166-1 alpha-2)'),
  
  // === EMOTIONAL DATA ===
  emotions: EmotionVectorSchema.describe('6-dimensional emotional vector'),
  
  // === EVENT CHARACTERISTICS ===
  intensity: z.number().min(0).max(1).describe('How strong/significant the event is'),
  polarity: z.number().min(-1).max(1).describe('Negative (-1) to Positive (+1)'),
  uncertainty: z.number().min(0).max(1).describe('How uncertain/ambiguous the event is'),
  
  // === WEIGHTING FACTORS ===
  sourceWeight: z.number().min(0).max(1).describe('Credibility of source (0-1)'),
  timeWeight: z.number().min(0).max(1).describe('Recency weight (newer = higher)'),
  relevanceWeight: z.number().min(0).max(1).describe('Relevance to topic (0-1)'),
  
  // === SOURCE INFORMATION ===
  sourceType: z.enum(['news', 'social', 'analysis']).describe('Type of source'),
  sourceName: z.string().describe('Name of news source or platform'),
  summary: z.string().describe('Brief description of the event (1-2 sentences)'),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

/**
 * Aggregated metrics calculated from EventVectors
 */
export const AggregatedMetricsSchema = z.object({
  // === GLOBAL INDICES ===
  gmi: z.number().min(0).max(100).describe('Global Mood Index (0-100)'),
  cfi: z.number().min(0).max(100).describe('Collective Fear Index (0-100)'),
  hri: z.number().min(0).max(100).describe('Hope Resilience Index (0-100)'),
  
  // === AGGREGATED EMOTIONS ===
  avgFear: z.number().min(0).max(1),
  avgHope: z.number().min(0).max(1),
  trend: z.enum(['improving', 'declining', 'stable']),
  dominantTopic: z.string(),
  weightedEmotion: z.number().min(-1).max(1),
});

export type AggregatedMetrics = z.infer<typeof AggregatedMetricsSchema>;

/**
 * Calculate GMI (Global Mood Index)
 * Formula: average polarity weighted by intensity
 */
export function calculateGMI(eventVectors: EventVector[]): number {
  if (eventVectors.length === 0) return 50;
  
  const weightedSum = eventVectors.reduce((sum, ev) => {
    const moodValue = (ev.polarity + 1) / 2 * 100; // Convert -1..1 to 0..100
    return sum + moodValue * ev.intensity;
  }, 0);
  
  const totalWeight = eventVectors.reduce((sum, ev) => sum + ev.intensity, 0);
  
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Calculate CFI (Collective Fear Index)
 * Formula: average fear weighted by intensity and relevance
 */
export function calculateCFI(eventVectors: EventVector[]): number {
  if (eventVectors.length === 0) return 30;
  
  const weightedSum = eventVectors.reduce((sum, ev) => {
    const fearValue = ev.emotions.fear * 100; // Convert 0..1 to 0..100
    const weight = ev.intensity * ev.relevanceWeight;
    return sum + fearValue * weight;
  }, 0);
  
  const totalWeight = eventVectors.reduce((sum, ev) => {
    return sum + ev.intensity * ev.relevanceWeight;
  }, 0);
  
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Calculate HRI (Hope Resilience Index)
 * Formula: average hope weighted by time and relevance
 */
export function calculateHRI(eventVectors: EventVector[]): number {
  if (eventVectors.length === 0) return 50;
  
  const weightedSum = eventVectors.reduce((sum, ev) => {
    const hopeValue = ev.emotions.hope * 100; // Convert 0..1 to 0..100
    const weight = ev.timeWeight * ev.relevanceWeight;
    return sum + hopeValue * weight;
  }, 0);
  
  const totalWeight = eventVectors.reduce((sum, ev) => {
    return sum + ev.timeWeight * ev.relevanceWeight;
  }, 0);
  
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Calculate aggregated metrics from EventVectors
 */
export function calculateAggregatedMetrics(eventVectors: EventVector[]): AggregatedMetrics {
  const gmi = calculateGMI(eventVectors);
  const cfi = calculateCFI(eventVectors);
  const hri = calculateHRI(eventVectors);
  
  // Calculate average emotions
  const avgFear = eventVectors.reduce((sum, ev) => sum + ev.emotions.fear, 0) / (eventVectors.length || 1);
  const avgHope = eventVectors.reduce((sum, ev) => sum + ev.emotions.hope, 0) / (eventVectors.length || 1);
  
  // Determine trend
  const recentEvents = eventVectors.slice(-5);
  const recentGMI = calculateGMI(recentEvents);
  const olderEvents = eventVectors.slice(0, Math.max(5, eventVectors.length - 5));
  const olderGMI = calculateGMI(olderEvents);
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentGMI > olderGMI + 5) trend = 'improving';
  else if (recentGMI < olderGMI - 5) trend = 'declining';
  
  // Find dominant topic
  const topicCounts = eventVectors.reduce((acc, ev) => {
    acc[ev.topic] = (acc[ev.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
  
  // Calculate weighted emotion
  const weightedEmotion = eventVectors.reduce((sum, ev) => {
    const emotion = ev.polarity * ev.intensity;
    return sum + emotion;
  }, 0) / (eventVectors.length || 1);
  
  return {
    gmi,
    cfi,
    hri,
    avgFear,
    avgHope,
    trend,
    dominantTopic,
    weightedEmotion,
  };
}

/**
 * Create an EventVector from raw event data
 */
export function createEventVector(data: {
  topic: string;
  subTopic?: string;
  region: string;
  country?: string;
  emotions: EmotionVector;
  intensity: number;
  polarity: number;
  uncertainty: number;
  sourceType: 'news' | 'social' | 'analysis';
  sourceName: string;
  summary: string;
  sourceWeight?: number;
  timeWeight?: number;
  relevanceWeight?: number;
}): EventVector {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    topic: data.topic as any,
    subTopic: data.subTopic,
    region: data.region as any,
    country: data.country,
    emotions: data.emotions,
    intensity: Math.max(0, Math.min(1, data.intensity)),
    polarity: Math.max(-1, Math.min(1, data.polarity)),
    uncertainty: Math.max(0, Math.min(1, data.uncertainty)),
    sourceWeight: data.sourceWeight ?? 0.8,
    timeWeight: data.timeWeight ?? 0.9,
    relevanceWeight: data.relevanceWeight ?? 0.8,
    sourceType: data.sourceType,
    sourceName: data.sourceName,
    summary: data.summary,
  };
}

/**
 * Validate EventVector
 */
export function validateEventVector(data: unknown): { valid: boolean; errors: string[] } {
  try {
    EventVectorSchema.parse(data);
    return { valid: true, errors: [] };
  } catch (error: any) {
    const errors = error.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`) || ['Unknown error'];
    return { valid: false, errors };
  }
}

/**
 * Format EventVector for display
 */
export function formatEventVector(ev: EventVector): string {
  return `
Event: ${ev.summary}
Topic: ${ev.topic}${ev.subTopic ? ` > ${ev.subTopic}` : ''}
Region: ${ev.region}${ev.country ? ` (${ev.country})` : ''}
Source: ${ev.sourceName} (${ev.sourceType})

Emotions:
  Joy: ${(ev.emotions.joy * 100).toFixed(0)}%
  Fear: ${(ev.emotions.fear * 100).toFixed(0)}%
  Anger: ${(ev.emotions.anger * 100).toFixed(0)}%
  Sadness: ${(ev.emotions.sadness * 100).toFixed(0)}%
  Hope: ${(ev.emotions.hope * 100).toFixed(0)}%
  Curiosity: ${(ev.emotions.curiosity * 100).toFixed(0)}%

Characteristics:
  Intensity: ${(ev.intensity * 100).toFixed(0)}%
  Polarity: ${ev.polarity > 0 ? '+' : ''}${(ev.polarity * 100).toFixed(0)}%
  Uncertainty: ${(ev.uncertainty * 100).toFixed(0)}%

Weights:
  Source: ${(ev.sourceWeight * 100).toFixed(0)}%
  Time: ${(ev.timeWeight * 100).toFixed(0)}%
  Relevance: ${(ev.relevanceWeight * 100).toFixed(0)}%
  `.trim();
}
