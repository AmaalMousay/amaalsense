/**
 * Causal Explainability Utilities
 *
 * Converts news evidence and emotional indicators into concise causal factors.
 * This file provides structured evidence for the natural response composer; it
 * does not produce fixed user-facing response templates.
 */

import { invokeLLMProvider, type LLMMessage } from '../_core/llm';

export interface NewsItem {
  title: string;
  description?: string;
  source?: string;
  url?: string;
  publishedAt?: Date | string;
}

export interface CausalAnalysis {
  primaryCauses: string[];
  economicFactors: string[];
  mediaFactors: string[];
  politicalFactors: string[];
  socialFactors: string[];
  keywordsDetected: string[];
  confidenceLevel: number;
  rawEvidence: string[];
}

const KEYWORD_CATEGORIES: Record<string, string[]> = {
  economic: ['dollar', 'price', 'inflation', 'economy', 'salary', 'bank', 'oil', 'budget', 'unemployment', 'trade', 'investment', 'debt', 'revenue', 'market', 'currency'],
  media: ['news', 'media', 'statement', 'report', 'press', 'leak', 'scandal', 'headline', 'coverage'],
  political: ['politics', 'government', 'parliament', 'election', 'minister', 'president', 'law', 'agreement', 'negotiation', 'security'],
  social: ['society', 'protest', 'strike', 'citizen', 'services', 'electricity', 'water', 'health', 'education', 'crime', 'community'],
  security: ['security', 'military', 'army', 'militia', 'weapon', 'clash', 'terrorism', 'bombing', 'war', 'casualties'],
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function extractKeywords(text: string): { category: string; keywords: string[] }[] {
  const lower = text.toLowerCase();
  return Object.entries(KEYWORD_CATEGORIES)
    .map(([category, words]) => ({ category, keywords: words.filter(word => lower.includes(word)) }))
    .filter(result => result.keywords.length > 0);
}

function factorsFromCategory(category: string, keywords: string[], gmi: number, cfi: number, hri: number): string[] {
  const pressure = cfi > 60 || gmi < -20;
  switch (category) {
    case 'economic':
      return pressure
        ? [`Economic stress is visible through ${keywords.slice(0, 3).join(', ')}.`, 'Market or cost-of-living pressure may be contributing to fear.']
        : [`Economic signals are present through ${keywords.slice(0, 3).join(', ')}.`];
    case 'media':
      return [`Media framing is visible through ${keywords.slice(0, 3).join(', ')}.`, 'Repeated coverage can amplify perceived risk.'];
    case 'political':
      return [`Political context is visible through ${keywords.slice(0, 3).join(', ')}.`, 'Policy uncertainty can affect trust and confidence.'];
    case 'social':
      return [`Social pressure is visible through ${keywords.slice(0, 3).join(', ')}.`, 'Public-service and community signals may shape collective mood.'];
    case 'security':
      return [`Security pressure is visible through ${keywords.slice(0, 3).join(', ')}.`, 'Security-related language can increase risk perception.'];
    default:
      return [`Context signal detected: ${keywords.slice(0, 3).join(', ')}.`];
  }
}

export function analyzeNewsForCauses(news: NewsItem[], gmi: number, cfi: number, hri: number): CausalAnalysis {
  const text = news.map(item => `${item.title} ${item.description || ''}`).join(' ');
  const keywordGroups = extractKeywords(text);
  const analysis: CausalAnalysis = {
    primaryCauses: [],
    economicFactors: [],
    mediaFactors: [],
    politicalFactors: [],
    socialFactors: [],
    keywordsDetected: unique(keywordGroups.flatMap(group => group.keywords)),
    confidenceLevel: 0,
    rawEvidence: news.slice(0, 8).map(item => item.title),
  };

  for (const group of keywordGroups) {
    const factors = factorsFromCategory(group.category, group.keywords, gmi, cfi, hri);
    if (group.category === 'economic') analysis.economicFactors.push(...factors);
    else if (group.category === 'media') analysis.mediaFactors.push(...factors);
    else if (group.category === 'political' || group.category === 'security') analysis.politicalFactors.push(...factors);
    else analysis.socialFactors.push(...factors);
  }

  analysis.primaryCauses = unique([
    ...analysis.economicFactors.slice(0, 2),
    ...analysis.politicalFactors.slice(0, 2),
    ...analysis.mediaFactors.slice(0, 1),
    ...analysis.socialFactors.slice(0, 1),
  ]).slice(0, 5);

  const evidenceScore = Math.min(50, news.length * 5);
  const keywordScore = Math.min(35, analysis.keywordsDetected.length * 4);
  const signalScore = Math.min(15, Math.abs(gmi) / 10 + cfi / 20 + hri / 30);
  analysis.confidenceLevel = Math.round(evidenceScore + keywordScore + signalScore);

  return analysis;
}

export async function extractCausesWithLLM(news: NewsItem[], question: string): Promise<string[]> {
  const compactEvidence = news.slice(0, 8).map(item => `- ${item.title} (${item.source || 'unknown source'})`).join('\n');
  try {
    const messages: LLMMessage[] = [
      { role: 'system', content: 'Extract concise factual causal factors from the evidence. Do not invent facts. Return a short bullet list.' },
      { role: 'user', content: `Question: ${question}\nEvidence:\n${compactEvidence}` },
    ];
    const response = await invokeLLMProvider({ messages, temperature: 0.2, max_tokens: 300 });
    return response.content.split('\n').map(line => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean).slice(0, 6);
  } catch {
    return [];
  }
}

export function buildWhySection(analysis: CausalAnalysis): string {
  const parts = [
    ...analysis.primaryCauses,
    ...analysis.economicFactors,
    ...analysis.politicalFactors,
    ...analysis.mediaFactors,
    ...analysis.socialFactors,
  ];
  return unique(parts).slice(0, 8).join('\n');
}

export default { extractKeywords, analyzeNewsForCauses, extractCausesWithLLM, buildWhySection };
