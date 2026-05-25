/**
 * Layer 6: Knowledge Base
 *
 * Compact domain knowledge and factual memory access for AmalSense. This layer
 * provides causal rules, expert rules, historical patterns and a factual-answer
 * bridge to the cumulative learning store.
 */

import { invokeLLM } from '../_core/llm';
import { getCumulativeInsight } from '../engines/learningStore';
import { buildRAGContext, formatRAGForPrompt } from './ragSystem';
import { searchKnowledgeCore } from './vectorStore';

export interface CausalRelation {
  cause: string;
  effect: string;
  strength: number;
  direction: 'positive' | 'negative' | 'complex';
  timelag: 'immediate' | 'short' | 'medium' | 'long';
  confidence: number;
  context?: string;
  source?: string;
}

export interface ExpertRule {
  id: string;
  name: string;
  condition: string;
  conclusion: string;
  confidence: number;
  appliesTo: string[];
}

export interface HistoricalPattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  typicalOutcome: string;
  duration: string;
  confidence: number;
  examples: string[];
}

export interface EntityKnowledge {
  name: string;
  type: 'commodity' | 'currency' | 'institution' | 'index' | 'concept';
  description: string;
  drivers: string[];
  risks: string[];
  relatedEntities: string[];
}

export interface FactualQuery {
  question: string;
  context?: string;
  domain?: string;
  topic?: string;
}

export interface FactualResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sources?: string[];
  admitsIgnorance: boolean;
  cumulativeContext?: unknown;
}

export const ECONOMIC_CAUSAL_RELATIONS: CausalRelation[] = [
  { cause: 'interest rate increase', effect: 'gold pressure', strength: 0.8, direction: 'negative', timelag: 'short', confidence: 0.75, context: 'macro and dollar-sensitive markets' },
  { cause: 'oil supply disruption', effect: 'energy price risk', strength: 0.85, direction: 'positive', timelag: 'immediate', confidence: 0.8, context: 'energy markets and geopolitics' },
  { cause: 'political instability', effect: 'collective fear increase', strength: 0.78, direction: 'positive', timelag: 'short', confidence: 0.72, context: 'public mood and risk perception' },
  { cause: 'positive policy clarity', effect: 'uncertainty reduction', strength: 0.65, direction: 'negative', timelag: 'medium', confidence: 0.68, context: 'decision-maker communication' },
  { cause: 'media amplification', effect: 'fear acceleration', strength: 0.7, direction: 'positive', timelag: 'immediate', confidence: 0.66, context: 'headline-driven attention' },
];

export const EXPERT_RULES: ExpertRule[] = [
  { id: 'risk-off-gold', name: 'Risk-off gold support', condition: 'fear rises while uncertainty remains high', conclusion: 'gold and safe-haven attention may increase', confidence: 0.7, appliesTo: ['gold', 'forex', 'macro'] },
  { id: 'hope-recovery', name: 'Recovery bias', condition: 'hope rises and fear stabilizes', conclusion: 'risk appetite may improve if confirmed by sources', confidence: 0.66, appliesTo: ['market', 'society', 'policy'] },
  { id: 'media-amplification', name: 'Narrative amplification', condition: 'same event repeats across many headlines', conclusion: 'attention and emotional intensity can exceed factual novelty', confidence: 0.7, appliesTo: ['journalism', 'public mood'] },
];

export const HISTORICAL_PATTERNS: HistoricalPattern[] = [
  { id: 'crisis-fear-spike', name: 'Fear spike after crisis news', description: 'Fear rises rapidly after repeated crisis framing.', triggers: ['crisis', 'emergency', 'conflict'], typicalOutcome: 'short-term risk aversion', duration: 'hours to days', confidence: 0.7, examples: ['geopolitical escalation', 'banking stress'] },
  { id: 'policy-clarity-stabilization', name: 'Stabilization after clear policy signal', description: 'Uncertainty decreases when decision makers provide credible clarity.', triggers: ['policy clarity', 'agreement', 'official statement'], typicalOutcome: 'lower volatility', duration: 'days', confidence: 0.62, examples: ['central bank guidance', 'ceasefire statement'] },
];

export const ENTITY_KNOWLEDGE: Record<string, EntityKnowledge> = {
  gold: { name: 'gold', type: 'commodity', description: 'Safe-haven commodity sensitive to fear, rates, dollar strength and geopolitical uncertainty.', drivers: ['fear', 'real rates', 'dollar', 'geopolitics'], risks: ['false safe-haven signal', 'rate shock'], relatedEntities: ['usd', 'oil', 'inflation'] },
  oil: { name: 'oil', type: 'commodity', description: 'Energy commodity sensitive to supply risk, demand expectations and geopolitical disruption.', drivers: ['supply', 'demand', 'geopolitics'], risks: ['demand shock', 'policy intervention'], relatedEntities: ['inflation', 'energy', 'usd'] },
  usd: { name: 'usd', type: 'currency', description: 'Reserve currency affected by rates, risk appetite and global liquidity.', drivers: ['rates', 'risk appetite', 'liquidity'], risks: ['policy surprise', 'liquidity stress'], relatedEntities: ['gold', 'oil', 'treasuries'] },
  cfi: { name: 'CFI', type: 'index', description: 'Collective Fear Index, used to estimate fear pressure in the emotional field.', drivers: ['risk language', 'negative events', 'uncertainty'], risks: ['overreaction', 'media amplification'], relatedEntities: ['gmi', 'hri'] },
  gmi: { name: 'GMI', type: 'index', description: 'Global Mood Index, a broad reading of collective emotional polarity.', drivers: ['positive events', 'negative events', 'confidence'], risks: ['low source diversity'], relatedEntities: ['cfi', 'hri'] },
  hri: { name: 'HRI', type: 'index', description: 'Hope and Resilience Index, used to estimate recovery and constructive expectation.', drivers: ['solutions', 'stability', 'cooperation'], risks: ['unsupported optimism'], relatedEntities: ['gmi', 'cfi'] },
};

function normalize(text: string): string {
  return text.toLowerCase();
}

export function findCausalRelations(topic: string): CausalRelation[] {
  const query = normalize(topic);
  return ECONOMIC_CAUSAL_RELATIONS.filter(relation => normalize(`${relation.cause} ${relation.effect} ${relation.context || ''}`).includes(query));
}

export function findCausesFor(effect: string): CausalRelation[] {
  const query = normalize(effect);
  return ECONOMIC_CAUSAL_RELATIONS.filter(relation => normalize(relation.effect).includes(query) || query.includes(normalize(relation.effect)));
}

export function findEffectsOf(cause: string): CausalRelation[] {
  const query = normalize(cause);
  return ECONOMIC_CAUSAL_RELATIONS.filter(relation => normalize(relation.cause).includes(query) || query.includes(normalize(relation.cause)));
}

export function getApplicableRules(context: { topic?: string; domain?: string; emotion?: string }): ExpertRule[] {
  const query = normalize(`${context.topic || ''} ${context.domain || ''} ${context.emotion || ''}`);
  return EXPERT_RULES.filter(rule => rule.appliesTo.some(item => query.includes(item)) || normalize(rule.condition).split(' ').some(token => query.includes(token)));
}

export function getRelevantPatterns(context: { topic?: string; triggers?: string[] }): HistoricalPattern[] {
  const triggers = new Set([...(context.triggers || []), ...(context.topic ? normalize(context.topic).split(/\s+/) : [])]);
  return HISTORICAL_PATTERNS.filter(pattern => pattern.triggers.some(trigger => triggers.has(trigger) || normalize(context.topic || '').includes(trigger)));
}

export function getEntityKnowledge(entity: string): EntityKnowledge | null {
  return ENTITY_KNOWLEDGE[normalize(entity)] || null;
}

export function buildExplanationChain(phenomenon: string, maxDepth: number = 3): { chain: CausalRelation[]; explanation: string } {
  const chain: CausalRelation[] = [];
  const visited = new Set<string>();
  function visit(effect: string, depth: number) {
    if (depth >= maxDepth || visited.has(effect)) return;
    visited.add(effect);
    for (const relation of findCausesFor(effect).slice(0, 2)) {
      chain.push(relation);
      visit(relation.cause, depth + 1);
    }
  }
  visit(phenomenon, 0);
  const explanation = chain.length ? chain.map(relation => `${relation.cause} -> ${relation.effect}`).join('\n') : '';
  return { chain, explanation };
}

export function getTopicKnowledge(topic: string): {
  entity: EntityKnowledge | null;
  causes: CausalRelation[];
  effects: CausalRelation[];
  rules: ExpertRule[];
  patterns: HistoricalPattern[];
} {
  return {
    entity: getEntityKnowledge(topic),
    causes: findCausesFor(topic),
    effects: findEffectsOf(topic),
    rules: getApplicableRules({ topic }),
    patterns: getRelevantPatterns({ topic }),
  };
}


export interface LiveKnowledgeContext {
  staticKnowledge: ReturnType<typeof getTopicKnowledge>;
  ragContext: ReturnType<typeof buildRAGContext>;
  similarMemory: ReturnType<typeof searchKnowledgeCore>;
  promptContext: string;
}

export function getLiveKnowledge(topic: string, options: { country?: string; maxResults?: number } = {}): LiveKnowledgeContext {
  const staticKnowledge = getTopicKnowledge(topic);
  const ragContext = buildRAGContext(topic, {
    country: options.country,
    maxResults: options.maxResults ?? 5,
    includeAnalyses: true,
    includeConversations: true,
    includeKnowledge: true,
  });
  const similarMemory = searchKnowledgeCore(topic, {
    country: options.country,
    topK: options.maxResults ?? 5,
    minSimilarity: 0.2,
  });
  return {
    staticKnowledge,
    ragContext,
    similarMemory,
    promptContext: formatRAGForPrompt(ragContext),
  };
}

class KnowledgeEngineClass {
  async answerFactualQuestion(query: FactualQuery): Promise<FactualResponse> {
    const memoryInsight = query.topic ? getCumulativeInsight(query.topic) : null;
    const liveKnowledge = getLiveKnowledge(query.topic || query.question);
    const entity = query.topic ? getEntityKnowledge(query.topic) : null;
    const prompt = [
      `Question: ${query.question}`,
      query.context ? `Context: ${query.context}` : '',
      query.domain ? `Domain: ${query.domain}` : '',
      entity ? `Entity: ${entity.description}` : '',
      memoryInsight ? `Memory: ${JSON.stringify(memoryInsight).slice(0, 1200)}` : '',
      liveKnowledge.promptContext ? `Knowledge Core Context:
${liveKnowledge.promptContext}` : '',
    ].filter(Boolean).join('\n');

    try {
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'Answer factually and concisely. If evidence is insufficient, say so clearly.' },
          { role: 'user', content: prompt },
        ],
      });
      const content = response.choices?.[0]?.message?.content;
      const answer = typeof content === 'string' ? content : '';
      return { answer: answer || 'Insufficient verified knowledge is available.', confidence: answer ? 'medium' : 'unknown', admitsIgnorance: !answer, cumulativeContext: memoryInsight };
    } catch {
      return { answer: 'The factual knowledge engine is temporarily unavailable.', confidence: 'unknown', admitsIgnorance: true, cumulativeContext: memoryInsight };
    }
  }

  isSuitableForKnowledgeEngine(question: string): boolean {
    return /\b(what is|who is|when|where|define|explain|tell me about)\b/i.test(question.trim());
  }
}

export const KnowledgeEngine = new KnowledgeEngineClass();
