/**
 * AmalSense Natural Response Composer
 *
 * This module is the single response entry point. It does not own fixed answer
 * templates. AmalSense engines provide data, evidence, vectors, memory and
 * limitations; the hosted/free LLM writes the final natural-language response.
 */

import { invokeLLMProvider, type LLMMessage } from '../_core/llm';
import { t } from '../_core/i18n';
import type { EconomicData } from '../services/economicDataService';

export interface AnalysisData {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
  detectedCountry?: string;
  newsHeadlines?: string[];
  keywords?: string[];
  sources?: string[];
  turnCount?: number;
  previousTopics?: string[];
  questionsAsked?: string[];
  userQuestion?: string;
  userProfile?: unknown;
  economicData?: EconomicData;
}

export interface CausalFactors {
  economic: string[];
  media: string[];
  political: string[];
  social: string[];
}

export interface StructuredResponse {
  executiveSummary: string;
  decisionSignal: string;
  decisionSignalIcon: string;
  causalFactors: CausalFactors;
  timeforecast: string;
  psychologicalInsight: string;
  closingQuestion: string;
  fullResponse: string;
}

export interface NaturalAnswerInput {
  question: string;
  language?: string;
  intent?: string;
  route?: 'direct' | 'analysis' | 'prediction' | 'comparison' | 'clarification';
  eventVector?: unknown;
  indices?: { gmi?: number; cfi?: number; hri?: number };
  emotions?: Record<string, number>;
  evidence?: Array<{ title: string; source?: string; url?: string }>;
  memory?: unknown;
  knowledgeContext?: string;
  confidence?: number;
  limitations?: string[];
}

function detectLanguage(text: string): string {
  return /[^\x00-\x7F]/.test(text) ? 'ar' : 'en';
}

function compactForPrompt(value: unknown, maxLength: number = 3500): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function buildNaturalSystemInstruction(language: string): string {
  const ArabicInstruction = `You are AmalSense. Reply in Arabic when the user uses Arabic, but do not use fixed templates. Write naturally like a helpful expert. Do not force headings such as summary, recommendation, decision signal, or closing questions unless the user explicitly asks. Answer only the user question. If live analysis is not needed, answer directly. If data is available, weave it naturally into the answer. Do not invent sources, numbers, or certainty. If evidence is limited, say so briefly. Do not end with a marketing-style question.`;

  const EnglishInstruction = `You are AmalSense. Write a natural free-form answer like an intelligent assistant. Do not use fixed templates, mandatory headings, boilerplate sections, or sales-style closing questions unless explicitly requested. Answer only the user's question. If no analysis is needed, answer directly. If data, indices, evidence, memory or EventVectors are provided, weave them naturally into the answer. Do not invent sources, numbers or certainty. If data is limited, say so briefly.`;

  return language === 'ar' ? ArabicInstruction : EnglishInstruction;
}

export async function composeNaturalAnswer(input: NaturalAnswerInput): Promise<string> {
  const language = input.language || detectLanguage(input.question);
  const context = {
    question: input.question,
    route: input.route || 'direct',
    intent: input.intent,
    indices: input.indices,
    emotions: input.emotions,
    confidence: input.confidence,
    limitations: input.limitations || [],
    evidence: input.evidence?.slice(0, 6) || [],
    eventVector: input.eventVector,
    memory: input.memory,
    knowledgeContext: input.knowledgeContext,
  };

  const response = await invokeLLMProvider({
    messages: [
      { role: 'system', content: buildNaturalSystemInstruction(language) },
      { role: 'user', content: compactForPrompt(context) },
    ],
    temperature: 0.45,
    max_tokens: 900,
  });

  return response.content?.trim() || t('naturalAnswerUnavailable', language);
}

/**
 * Compatibility helper. New code should call composeNaturalAnswer().
 */
export function extractCleanTopic(question: string): string {
  return question.replace(/[?]/g, '').trim() || question;
}

/**
 * Compatibility helper. It returns a compact data sentence, not a fixed answer template.
 */
export function generateExecutiveSummary(data: AnalysisData): string {
  return `Topic ${data.topic}: GMI ${data.gmi}, CFI ${data.cfi}, HRI ${data.hri}, dominant emotion ${data.dominantEmotion}.`;
}

export function determineDecisionSignal(data: AnalysisData): { type: string; text: string; icon: string } {
  const risk = data.cfi > 70 ? 'high_risk' : data.gmi > 25 && data.hri > data.cfi ? 'opportunity' : 'watch';
  return { type: risk, text: risk, icon: '' };
}

export function extractContextualCauses(_question: string): CausalFactors {
  return { economic: [], media: [], political: [], social: [] };
}

export function extractCausalFactors(data: AnalysisData): CausalFactors {
  return {
    economic: data.keywords?.filter(k => /econom|market|price|inflation|oil|currency/i.test(k)).slice(0, 5) || [],
    media: data.sources?.slice(0, 5) || [],
    political: data.keywords?.filter(k => /politic|government|election|conflict|security/i.test(k)).slice(0, 5) || [],
    social: data.keywords?.filter(k => /society|public|community|protest/i.test(k)).slice(0, 5) || [],
  };
}

export function generateTimeforecast(data: AnalysisData): string {
  return data.cfi > data.hri ? 'risk-biased short-term outlook' : 'stable or improving short-term outlook';
}

export function generatePsychologicalInsight(data: AnalysisData): string {
  return `Dominant emotion: ${data.dominantEmotion}; confidence: ${data.confidence}.`;
}

export function generateClosingQuestion(_data: AnalysisData): string {
  return '';
}

export function buildStructuredResponse(data: AnalysisData): StructuredResponse {
  const decision = determineDecisionSignal(data);
  const causalFactors = extractCausalFactors(data);
  const executiveSummary = generateExecutiveSummary(data);
  const timeforecast = generateTimeforecast(data);
  const psychologicalInsight = generatePsychologicalInsight(data);
  return {
    executiveSummary,
    decisionSignal: decision.text,
    decisionSignalIcon: decision.icon,
    causalFactors,
    timeforecast,
    psychologicalInsight,
    closingQuestion: '',
    fullResponse: [executiveSummary, psychologicalInsight].filter(Boolean).join('\n'),
  };
}

export async function enhanceWithLLM(structuredResponse: StructuredResponse, data: AnalysisData): Promise<string> {
  return composeNaturalAnswer({
    question: data.userQuestion || data.topic,
    route: 'analysis',
    intent: 'analysis',
    indices: { gmi: data.gmi, cfi: data.cfi, hri: data.hri },
    emotions: { [data.dominantEmotion]: 1 },
    confidence: data.confidence,
    evidence: data.newsHeadlines?.map(title => ({ title })) || [],
    knowledgeContext: structuredResponse.fullResponse,
  });
}

export default {
  generateExecutiveSummary,
  determineDecisionSignal,
  extractCausalFactors,
  generateTimeforecast,
  generatePsychologicalInsight,
  generateClosingQuestion,
  buildStructuredResponse,
  enhanceWithLLM,
  composeNaturalAnswer,
};
