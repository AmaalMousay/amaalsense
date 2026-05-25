/**
 * AmalSense EventVector Engine
 *
 * This module fuses collected signals into a compact event vector. It does not
 * fetch data and it does not write final answers. It is the vector layer between
 * the parallel signal network and DCFT / Knowledge Core.
 */

import type { CollectedData } from '../services/unifiedDataCollector';

export type KnowledgeDomain = 'political' | 'economic' | 'social' | 'scientific' | 'legal' | 'medical' | 'engineering';

export interface QuantumEventVector {
  query: string;
  queryType: 'country' | 'topic' | 'question';
  countryCode?: string;
  timestamp: number;
  totalItems: number;
  sourceBreakdown: Record<string, number>;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  polarity: number;
  intensity: number;
  uncertainty: number;
  categories: Record<KnowledgeDomain, number>;
  dominantCategory: KnowledgeDomain;
  trendingKeywords: string[];
  topHeadlines: Array<{
    title: string;
    source: string;
    category: string;
    sentiment: string;
  }>;
}

const KNOWLEDGE_DOMAINS: Record<KnowledgeDomain, string[]> = {
  scientific: ['physics', 'chemistry', 'quantum', 'atom', 'molecule', 'energy', 'reaction', 'waves', 'laboratory', 'research', 'study'],
  legal: ['law', 'court', 'legislation', 'treaty', 'justice', 'constitution', 'legal', 'rights', 'violation', 'judicial'],
  medical: ['medical', 'health', 'medicine', 'virus', 'therapy', 'surgery', 'clinical', 'hospital', 'disease', 'vaccine', 'pandemic'],
  engineering: ['engineering', 'math', 'calculus', 'algorithm', 'structural', 'circuit', 'software', 'geometry', 'infrastructure', 'statistics'],
  economic: ['market', 'inflation', 'gdp', 'trade', 'finance', 'oil', 'investment', 'currency', 'debt', 'stock', 'price', 'economy'],
  political: ['government', 'election', 'minister', 'diplomacy', 'protest', 'state', 'policy', 'security', 'parliament', 'conflict'],
  social: ['society', 'community', 'public', 'people', 'services', 'education', 'migration', 'housing', 'living'],
};

const POSITIVE_TERMS = ['success', 'breakthrough', 'hope', 'recovery', 'peace', 'growth', 'agreement', 'solution', 'stability', 'improvement'];
const NEGATIVE_TERMS = ['crisis', 'failure', 'danger', 'death', 'risk', 'war', 'attack', 'collapse', 'shortage', 'conflict', 'fear'];
const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'about', 'into', 'after', 'before', 'over', 'under']);

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9_]+/g) || []).filter(token => token.length > 2 && !STOPWORDS.has(token));
}

function createEmptyCategories(): Record<KnowledgeDomain, number> {
  return { political: 0, economic: 0, social: 0, scientific: 0, legal: 0, medical: 0, engineering: 0 };
}

function normalizeCounts<T extends string>(counts: Record<T, number>, total: number): Record<T, number> {
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(value) / total])) as Record<T, number>;
}

function extractTrendingKeywords(texts: string[], limit = 12): string[] {
  const counts = new Map<string, number>();
  for (const token of texts.flatMap(tokenize)) counts.set(token, (counts.get(token) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([token]) => token);
}

export function createUniversalEventVector(data: CollectedData): QuantumEventVector {
  const items = data.items || [];
  const totalItems = Math.max(items.length, 1);
  const categories = createEmptyCategories();
  const sourceBreakdown: Record<string, number> = {};
  const texts = items.map(item => `${item.title || ''} ${item.description || ''}`);

  let positiveScore = 0;
  let negativeScore = 0;
  let trustSum = 0;

  for (const item of items) {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    sourceBreakdown[item.platform || item.source || 'unknown'] = (sourceBreakdown[item.platform || item.source || 'unknown'] || 0) + 1;
    trustSum += Number(item.trustScore ?? 50) / 100;

    for (const [domain, keywords] of Object.entries(KNOWLEDGE_DOMAINS) as Array<[KnowledgeDomain, string[]]>) {
      if (keywords.some(keyword => text.includes(keyword))) categories[domain] += 1;
    }
    if (POSITIVE_TERMS.some(term => text.includes(term))) positiveScore += 1;
    if (NEGATIVE_TERMS.some(term => text.includes(term))) negativeScore += 1;
  }

  const normalizedCategories = normalizeCounts(categories, totalItems);
  const polarity = (positiveScore - negativeScore) / totalItems;
  const intensity = clamp01((positiveScore + negativeScore) / totalItems || (trustSum / totalItems) * 0.35);
  const uncertainty = clamp01(1 - Math.abs(polarity));
  const emotions = {
    joy: clamp01(positiveScore / totalItems),
    fear: clamp01(negativeScore / totalItems + normalizedCategories.scientific * 0.08),
    anger: clamp01(normalizedCategories.political * 0.45 + negativeScore / totalItems * 0.45),
    sadness: clamp01(negativeScore / totalItems * 0.75),
    hope: clamp01(positiveScore / totalItems * 1.1 + normalizedCategories.engineering * 0.15),
    curiosity: clamp01(normalizedCategories.scientific + normalizedCategories.medical + normalizedCategories.engineering),
  };

  const dominantEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'curiosity';
  const dominantCategory = (Object.entries(normalizedCategories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'social') as KnowledgeDomain;
  const trendingKeywords = extractTrendingKeywords(texts);

  return {
    query: data.query,
    queryType: data.queryType,
    countryCode: data.countryCode,
    timestamp: data.fetchedAt || Date.now(),
    totalItems,
    sourceBreakdown,
    emotions,
    dominantEmotion,
    polarity,
    intensity,
    uncertainty,
    categories: normalizedCategories,
    dominantCategory,
    trendingKeywords,
    topHeadlines: items.slice(0, 8).map(item => ({
      title: item.title,
      source: item.source,
      category: dominantCategory,
      sentiment: polarity > 0 ? 'positive' : polarity < 0 ? 'negative' : 'neutral',
    })),
  };
}

export function generateUniversalPrompt(vector: QuantumEventVector, language: string = 'en'): string {
  return JSON.stringify({
    role: 'AmalSense event-vector context',
    query: vector.query,
    language,
    field: {
      polarity: vector.polarity,
      intensity: vector.intensity,
      uncertainty: vector.uncertainty,
      dominantEmotion: vector.dominantEmotion,
      dominantCategory: vector.dominantCategory,
    },
    categories: vector.categories,
    sourceBreakdown: vector.sourceBreakdown,
    topHeadlines: vector.topHeadlines,
    instruction: 'Use this compact event-vector context only as evidence. Do not invent facts. Write naturally if asked to explain it.',
  }, null, 2);
}

export const createEventVector = createUniversalEventVector;
export const eventVectorToPrompt = generateUniversalPrompt;
export const vectorToMapIndices = (vector: QuantumEventVector) => ({
  gmi: Math.round(vector.polarity * 100),
  cfi: Math.round((vector.emotions.fear + vector.emotions.anger) / 2 * 100),
  hri: Math.round((vector.emotions.hope + vector.emotions.joy) / 2 * 100),
  dominantEmotion: vector.dominantEmotion,
  isRealData: vector.totalItems > 0,
});

export type EventVector = QuantumEventVector;
