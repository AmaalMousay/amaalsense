/**
 * Parallel Signal Graph
 *
 * This module is the parallel signal processor. It is not the central
 * orchestrator and it does not fetch data. It accepts text, runs independent
 * signal engines in parallel, then fuses the partial signals into a compact
 * EventVector. The central runtime can call this graph when it needs a fast
 * parallel interpretation of a question, headline, or event summary.
 */

import { z } from 'zod';
import { analyzeTopics, analyzeEmotions, analyzeRegions, analyzeSeverity, analyzeImpact } from '../engines/emotionEngine';
import { composeNaturalAnswer } from '../engines/responseBuilder';

export const PartialEventVectorSchema = z.object({
  topic: z.string().optional(),
  topicConfidence: z.number().optional(),
  emotions: z.record(z.string(), z.number()).optional(),
  dominantEmotion: z.string().optional(),
  region: z.string().optional(),
  regionConfidence: z.number().optional(),
  impactScore: z.number().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export type PartialEventVector = z.infer<typeof PartialEventVectorSchema>;

export const EventVectorSchema = z.object({
  topic: z.string(),
  topicConfidence: z.number(),
  emotions: z.record(z.string(), z.number()),
  dominantEmotion: z.string(),
  region: z.string(),
  regionConfidence: z.number(),
  impactScore: z.number(),
  severity: z.enum(['low', 'medium', 'high']),
  timestamp: z.date(),
  sourceId: z.string(),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizeEmotionScale(value: number): number {
  return value > 1 ? clamp01(value / 100) : clamp01(value);
}

export async function topicEngine(input: string): Promise<PartialEventVector> {
  const topics = analyzeTopics(input);
  const [topic, score] = Object.entries(topics).sort((a, b) => b[1] - a[1])[0] || ['general', 1];
  const total = Object.values(topics).reduce((sum, value) => sum + value, 0) || 1;
  return { topic, topicConfidence: clamp01(score / total) || 0.5 };
}

export async function emotionEngine(input: string): Promise<PartialEventVector> {
  const raw = analyzeEmotions(input);
  const emotions = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, normalizeEmotionScale(value)]));
  const [dominantEmotion] = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0] || ['neutral', 1];
  return { emotions, dominantEmotion };
}

export async function regionEngine(input: string): Promise<PartialEventVector> {
  const regions = analyzeRegions(input, 'Global');
  const best = regions[0];
  return {
    region: best?.name || 'Global',
    regionConfidence: best ? clamp01(Math.abs(Number(best.sentiment || 50)) / 100 || 0.5) : 0.5,
  };
}

export async function impactEngine(input: string): Promise<PartialEventVector> {
  const impactScore = clamp01(analyzeImpact(input));
  const severity = impactScore > 0.66 ? 'high' : impactScore < 0.33 ? 'low' : 'medium';
  return { impactScore, severity };
}

export async function fusionEngine(input: string, partialResults: PartialEventVector[]): Promise<EventVector> {
  const emotionBuckets = new Map<string, number[]>();
  for (const partial of partialResults) {
    for (const [emotion, value] of Object.entries(partial.emotions || {})) {
      const values = emotionBuckets.get(emotion) || [];
      values.push(normalizeEmotionScale(Number(value)));
      emotionBuckets.set(emotion, values);
    }
  }

  const emotions: Record<string, number> = {};
  for (const [emotion, values] of emotionBuckets.entries()) {
    emotions[emotion] = clamp01(values.reduce((sum, value) => sum + value, 0) / values.length);
  }
  if (Object.keys(emotions).length === 0) emotions.neutral = 1;

  const dominantEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  const topicCandidate = partialResults
    .filter(partial => partial.topic)
    .sort((a, b) => (b.topicConfidence || 0) - (a.topicConfidence || 0))[0];
  const regionCandidate = partialResults
    .filter(partial => partial.region)
    .sort((a, b) => (b.regionConfidence || 0) - (a.regionConfidence || 0))[0];
  const impactValues = partialResults.map(partial => partial.impactScore).filter((value): value is number => typeof value === 'number');
  const impactScore = impactValues.length ? clamp01(impactValues.reduce((sum, value) => sum + value, 0) / impactValues.length) : 0.5;
  const severity = impactScore > 0.66 ? 'high' : impactScore < 0.33 ? 'low' : 'medium';

  return {
    topic: topicCandidate?.topic || input.slice(0, 60) || 'general',
    topicConfidence: topicCandidate?.topicConfidence || 0.5,
    emotions,
    dominantEmotion,
    region: regionCandidate?.region || 'Global',
    regionConfidence: regionCandidate?.regionConfidence || 0.5,
    impactScore,
    severity,
    timestamp: new Date(),
    sourceId: `parallel-event-${Date.now()}`,
  };
}

export async function graphPipeline(input: string): Promise<EventVector> {
  try {
    const partialResults = await Promise.all([
      topicEngine(input),
      emotionEngine(input),
      regionEngine(input),
      impactEngine(input),
    ]);
    return fusionEngine(input, partialResults);
  } catch (error) {
    console.error('[ParallelSignalGraph] Failed:', error);
    return {
      topic: 'general',
      topicConfidence: 0,
      emotions: { neutral: 1 },
      dominantEmotion: 'neutral',
      region: 'Global',
      regionConfidence: 0,
      impactScore: 0.5,
      severity: 'medium',
      timestamp: new Date(),
      sourceId: `parallel-event-error-${Date.now()}`,
    };
  }
}

export async function reasoningEngine(eventVector: EventVector, originalInput?: string): Promise<string> {
  return composeNaturalAnswer({
    question: originalInput || eventVector.topic,
    route: 'analysis',
    intent: 'parallel_signal_interpretation',
    eventVector,
    emotions: eventVector.emotions,
    confidence: Math.round((eventVector.topicConfidence + eventVector.regionConfidence) * 50),
    limitations: ['This is a parallel signal interpretation, not a full live-source analysis.'],
  });
}

export async function completePipeline(input: string): Promise<{ eventVector: EventVector; analysis: string }> {
  const eventVector = await graphPipeline(input);
  const analysis = await reasoningEngine(eventVector, input);
  return { eventVector, analysis };
}

const emotionToIndex: Record<string, number> = {
  joy: 0,
  hope: 1,
  curiosity: 2,
  calm: 3,
  neutral: 4,
  sadness: 5,
  fear: 6,
  anger: 7,
  disgust: 8,
};

const regionToIndex: Record<string, number> = {
  'North Africa': 0,
  'Middle East': 1,
  'Sub-Saharan Africa': 2,
  Europe: 3,
  Asia: 4,
  Americas: 5,
  Oceania: 6,
  Global: 7,
};

const severityToValue: Record<string, number> = { low: 0.33, medium: 0.66, high: 1 };

export function eventVectorToNumericalVector(vector: EventVector): number[] {
  const numericalVector: number[] = [];
  const topicHash = vector.topic.substring(0, 3).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) / 100;
  numericalVector.push(topicHash, vector.topicConfidence);

  const emotionVector = new Array(10).fill(0);
  for (const [emotion, value] of Object.entries(vector.emotions)) {
    const index = emotionToIndex[emotion] ?? 4;
    emotionVector[index] = normalizeEmotionScale(Number(value));
  }
  numericalVector.push(...emotionVector, emotionToIndex[vector.dominantEmotion] ?? 4);

  const regionVector = new Array(8).fill(0);
  for (const region of vector.region.split(',').map(item => item.trim())) {
    const index = regionToIndex[region] ?? 7;
    regionVector[index] = 1;
  }
  numericalVector.push(...regionVector, vector.regionConfidence, vector.impactScore, severityToValue[vector.severity] ?? 0.66);

  const startOfDay = new Date(vector.timestamp.getFullYear(), vector.timestamp.getMonth(), vector.timestamp.getDate());
  numericalVector.push(clamp01((vector.timestamp.getTime() - startOfDay.getTime()) / (24 * 60 * 60 * 1000)));
  return numericalVector;
}

export function formatVectorForASI(vector: EventVector): string {
  return JSON.stringify({ topic: vector.topic, dominantEmotion: vector.dominantEmotion, impactScore: vector.impactScore, vector: eventVectorToNumericalVector(vector) });
}

export function createVectorPromptInLanguage(vector: EventVector, _language: string = 'en'): string {
  return `Analyze this EventVector for ${vector.topic}: [${eventVectorToNumericalVector(vector).map(value => value.toFixed(3)).join(', ')}]`;
}

export function verifyVectorIntegrity(vector: number[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (vector.length < 24) errors.push('Vector dimension error');
  return { valid: errors.length === 0, errors };
}

export async function analyzeEventVectorWithUniversalModel(vector: EventVector, language: string = 'en'): Promise<string> {
  return composeNaturalAnswer({
    question: `Interpret EventVector for ${vector.topic}`,
    language,
    route: 'analysis',
    eventVector: vector,
    emotions: vector.emotions,
    confidence: Math.round((vector.topicConfidence + vector.regionConfidence) * 50),
  });
}

export async function completeVectorAnalysis(vector: EventVector, language: string = 'en'): Promise<{ originalData: EventVector; vector: number[]; reasoning: string }> {
  return { originalData: vector, vector: eventVectorToNumericalVector(vector), reasoning: await analyzeEventVectorWithUniversalModel(vector, language) };
}

export function formatQuantumResult(result: any): string {
  return JSON.stringify(result, null, 2);
}
