/**
 * Cognitive Router
 *
 * This module decides which internal reasoning engines should be activated for a
 * question. It does not fetch external sources and it does not format the final
 * response. Final wording belongs to the natural response composer.
 */

import type { DeepQuestion } from './questionUnderstanding';

export type CognitiveEngine =
  | 'emotion_engine'
  | 'trend_engine'
  | 'economic_engine'
  | 'media_bias_engine'
  | 'social_pattern_engine'
  | 'decision_engine'
  | 'comparison_engine'
  | 'scenario_engine'
  | 'explanation_engine';

export interface EngineOutput {
  engine: CognitiveEngine;
  insights: string[];
  confidence: number;
  reasoning: string;
  data?: Record<string, any>;
}

export interface RouterDecision {
  primaryEngine: CognitiveEngine;
  supportingEngines: CognitiveEngine[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export interface EmotionIndicators {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionBreakdown?: Record<string, number>;
  trend?: 'rising' | 'falling' | 'stable';
  confidence?: number;
}

export interface CognitiveOutput {
  decision: RouterDecision;
  outputs: EngineOutput[];
  combinedInsights: string[];
  emotionIndicators: EmotionIndicators;
}

type TopicDomain = 'economic' | 'media' | 'political' | 'social' | 'technology' | 'health' | 'general';

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function detectTopicDomain(topic: string): TopicDomain {
  const text = normalize(topic);
  if (/\b(economy|market|inflation|currency|oil|gold|silver|stock|finance|trade|debt|price)\b/.test(text)) return 'economic';
  if (/\b(news|media|press|journalism|headline|coverage|rumor)\b/.test(text)) return 'media';
  if (/\b(government|policy|election|parliament|minister|diplomacy|politics|security|conflict)\b/.test(text)) return 'political';
  if (/\b(society|public|community|people|protest|services|living)\b/.test(text)) return 'social';
  if (/\b(ai|technology|software|digital|platform|data)\b/.test(text)) return 'technology';
  if (/\b(health|medicine|hospital|disease|virus|public health)\b/.test(text)) return 'health';
  return 'general';
}

function extractEntities(topic: string): string[] {
  const cleaned = topic.trim();
  const separator = cleaned.match(/(.+?)\s+(?:vs|versus|compared to|and)\s+(.+)/i);
  if (separator) return [separator[1].trim(), separator[2].trim()].filter(Boolean);
  return cleaned ? [cleaned] : [];
}

export function routeQuestion(question: DeepQuestion): RouterDecision {
  const primaryEngine = selectPrimaryEngine(question.deep.realIntent, question.surface.questionType);
  const topicDomain = detectTopicDomain(question.surface.topic);
  const supportingEngines = selectSupportingEngines(primaryEngine, topicDomain, question.deep.urgency);
  const priority = question.deep.urgency === 'immediate' ? 'high' : question.deep.urgency === 'planning' ? 'medium' : 'low';

  return {
    primaryEngine,
    supportingEngines,
    reasoning: `Primary engine ${primaryEngine} selected for intent ${question.deep.realIntent}.`,
    priority,
  };
}

function selectPrimaryEngine(realIntent: string, questionType: string): CognitiveEngine {
  const intentToEngine: Record<string, CognitiveEngine> = {
    make_decision: 'decision_engine',
    understand_cause: 'explanation_engine',
    predict_future: 'scenario_engine',
    compare_options: 'comparison_engine',
    assess_risk: 'decision_engine',
    find_opportunity: 'decision_engine',
    validate_belief: 'explanation_engine',
    learn_concept: 'explanation_engine',
    get_reassurance: 'emotion_engine',
    socialize: 'emotion_engine',
    explore_scenario: 'scenario_engine',
  };

  const typeToEngine: Record<string, CognitiveEngine> = {
    should: 'decision_engine',
    why: 'explanation_engine',
    what_if: 'scenario_engine',
    compare: 'comparison_engine',
    how: 'explanation_engine',
    when: 'trend_engine',
    will: 'scenario_engine',
    what: 'explanation_engine',
    greeting: 'emotion_engine',
  };

  return intentToEngine[realIntent] || typeToEngine[questionType] || 'emotion_engine';
}

function selectSupportingEngines(primaryEngine: CognitiveEngine, topicDomain: TopicDomain, urgency: string): CognitiveEngine[] {
  const supporting = new Set<CognitiveEngine>();
  if (primaryEngine !== 'emotion_engine') supporting.add('emotion_engine');
  if (topicDomain === 'economic') {
    supporting.add('economic_engine');
    supporting.add('trend_engine');
  }
  if (topicDomain === 'media') supporting.add('media_bias_engine');
  if (topicDomain === 'social') supporting.add('social_pattern_engine');
  if (primaryEngine === 'decision_engine') supporting.add('scenario_engine');
  if (urgency === 'immediate') supporting.add('trend_engine');
  supporting.delete(primaryEngine);
  return [...supporting];
}

export async function activateEngines(
  decision: RouterDecision,
  question: DeepQuestion,
  indicators?: EmotionIndicators
): Promise<CognitiveOutput> {
  const emotionIndicators: EmotionIndicators = indicators || {
    gmi: 0,
    cfi: 50,
    hri: 50,
    dominantEmotion: 'neutral',
    confidence: 0.5,
  };

  const engines = [decision.primaryEngine, ...decision.supportingEngines];
  const outputs = engines.map(engine => runEngine(engine, question, emotionIndicators));
  const combinedInsights = outputs.flatMap(output => output.insights);

  return { decision, outputs, combinedInsights, emotionIndicators };
}

function runEngine(engine: CognitiveEngine, question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  switch (engine) {
    case 'emotion_engine': return runEmotionEngine(question, indicators);
    case 'trend_engine': return runTrendEngine(question, indicators);
    case 'economic_engine': return runEconomicEngine(question, indicators);
    case 'media_bias_engine': return runMediaBiasEngine(indicators);
    case 'social_pattern_engine': return runSocialPatternEngine(indicators);
    case 'decision_engine': return runDecisionEngine(indicators);
    case 'comparison_engine': return runComparisonEngine(question, indicators);
    case 'scenario_engine': return runScenarioEngine(indicators);
    case 'explanation_engine': return runExplanationEngine(question, indicators);
  }
}

function runEmotionEngine(question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  const insights = [
    `Dominant emotional state: ${indicators.dominantEmotion}.`,
    `GMI=${indicators.gmi}, CFI=${indicators.cfi}, HRI=${indicators.hri}.`,
  ];
  return { engine: 'emotion_engine', insights, confidence: indicators.confidence ?? 0.7, reasoning: 'Current emotional indicators were interpreted.' };
}

function runTrendEngine(_question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  const trend = indicators.trend || (indicators.hri > indicators.cfi ? 'rising' : indicators.cfi > indicators.hri ? 'falling' : 'stable');
  return {
    engine: 'trend_engine',
    insights: [`Estimated trend: ${trend}.`],
    confidence: indicators.confidence ?? 0.6,
    reasoning: 'Trend was inferred from hope/fear balance and optional trend metadata.',
    data: { trend },
  };
}

function runEconomicEngine(question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  const domain = detectTopicDomain(question.surface.topic);
  const riskBias = indicators.cfi > 60 ? 'risk-sensitive' : 'neutral';
  return {
    engine: 'economic_engine',
    insights: [`Economic relevance: ${domain === 'economic' ? 'high' : 'contextual'}.`, `Market reading is ${riskBias}.`],
    confidence: domain === 'economic' ? 0.8 : 0.5,
    reasoning: 'Economic context was evaluated from topic domain and fear index.',
    data: { domain, riskBias },
  };
}

function runMediaBiasEngine(indicators: EmotionIndicators): EngineOutput {
  return {
    engine: 'media_bias_engine',
    insights: [`Media amplification risk is ${indicators.cfi > 60 ? 'elevated' : 'normal'}.`],
    confidence: 0.65,
    reasoning: 'Media effect was estimated from collective fear intensity.',
  };
}

function runSocialPatternEngine(indicators: EmotionIndicators): EngineOutput {
  const pattern = indicators.cfi > 60 && indicators.hri < 40 ? 'defensive stress' : indicators.hri > 60 ? 'constructive optimism' : 'mixed attention';
  return {
    engine: 'social_pattern_engine',
    insights: [`Likely collective behavior pattern: ${pattern}.`],
    confidence: 0.65,
    reasoning: 'Social pattern was inferred from fear/hope/mood balance.',
    data: { pattern },
  };
}

function runDecisionEngine(indicators: EmotionIndicators): EngineOutput {
  const signal = indicators.cfi > 70 ? 'avoid impulsive action' : indicators.hri > 60 && indicators.cfi < 50 ? 'conditions are improving' : 'monitor before acting';
  return {
    engine: 'decision_engine',
    insights: [`Decision signal: ${signal}.`],
    confidence: 0.7,
    reasoning: 'Decision signal was derived from risk and resilience balance.',
    data: { signal: indicators.cfi > 70 ? 'negative' : indicators.hri > 60 && indicators.cfi < 50 ? 'positive' : 'neutral', recommendation: signal },
  };
}

function runComparisonEngine(question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  const entities = extractEntities(question.surface.topic);
  return {
    engine: 'comparison_engine',
    insights: entities.length > 1 ? [`Comparison targets: ${entities.join(' vs ')}.`] : ['Comparison target was not explicit.'],
    confidence: entities.length > 1 ? 0.75 : 0.45,
    reasoning: 'Comparison engine extracted entities from the topic string.',
    data: { entities, indicators },
  };
}

function runScenarioEngine(indicators: EmotionIndicators): EngineOutput {
  const likely = indicators.cfi > indicators.hri ? 'pressure remains unless positive signals appear' : 'stability improves if hope remains stronger than fear';
  return {
    engine: 'scenario_engine',
    insights: [`Likely scenario: ${likely}.`],
    confidence: 0.6,
    reasoning: 'Scenario was inferred from current CFI/HRI balance.',
    data: { likely },
  };
}

function runExplanationEngine(question: DeepQuestion, indicators: EmotionIndicators): EngineOutput {
  const domain = detectTopicDomain(question.surface.topic);
  const drivers = [domain, indicators.cfi > 60 ? 'fear pressure' : 'moderate fear', indicators.hri > 60 ? 'resilience support' : 'limited resilience'];
  return {
    engine: 'explanation_engine',
    insights: [`Main explanatory drivers: ${drivers.join(', ')}.`],
    confidence: 0.65,
    reasoning: 'Explanation engine combined topic domain with emotional indicators.',
    data: { domain, drivers },
  };
}
