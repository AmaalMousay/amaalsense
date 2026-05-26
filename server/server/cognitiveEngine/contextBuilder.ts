/**
 * Cognitive Context Builder
 *
 * Converts cognitive-router outputs into a compact knowledge packet. This module
 * does not write the final answer; it only organizes current state, causes,
 * implications, decisions, scenarios and follow-up needs for downstream use.
 */

import type { DeepQuestion } from './questionUnderstanding';
import type { CognitiveOutput, EmotionIndicators, EngineOutput } from './cognitiveRouter';

interface NewsPacket {
  headlines: Array<{ title: string; relevance: number; sentiment: string }>;
}

interface ExpertKnowledgePacket {
  insights: Array<{ insight: string; source: string; confidence: number }>;
  riskFactors: string[];
  opportunities: string[];
}

interface SourceData {
  emotionIndicators?: EmotionIndicators;
  news?: NewsPacket;
  expertKnowledge?: ExpertKnowledgePacket;
  economicData?: any;
  scenarioModels?: any;
  comparisonData?: any;
}

interface CausalChain {
  cause: string;
  effect: string;
  explanation: string;
  confidence: number;
}

interface ScenarioSummary {
  name: string;
  probability: number;
  description: string;
  triggers: string[];
}

export interface KnowledgePacket {
  core: {
    topic: string;
    questionType: string;
    realIntent: string;
    emotionalNeed: string;
  };
  currentState: {
    summary: string;
    moodDescription: string;
    trend: string;
    confidence: number;
  };
  causes: {
    primary: CausalChain[];
    secondary: CausalChain[];
    summary: string;
  };
  implications: {
    shortTerm: string[];
    longTerm: string[];
    forUser: string;
  };
  decision: {
    signal: 'positive' | 'negative' | 'neutral' | 'caution';
    recommendation: string;
    reasoning: string;
    risks: string[];
    opportunities: string[];
  };
  scenarios?: {
    best: ScenarioSummary;
    worst: ScenarioSummary;
    likely: ScenarioSummary;
  };
  comparison?: {
    items: string[];
    winner?: string;
    reasoning: string;
  };
  followUp: {
    implicitAnswers: string[];
    suggestedQuestions: string[];
  };
}

function defaultIndicators(): EmotionIndicators {
  return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', confidence: 0.5 };
}

function describeMood(indicators: EmotionIndicators): string {
  if (indicators.cfi > 70) return 'high fear pressure';
  if (indicators.hri > 65 && indicators.cfi < 50) return 'constructive resilience';
  if (indicators.gmi > 25) return 'positive mood bias';
  if (indicators.gmi < -25) return 'negative mood pressure';
  return 'mixed or neutral emotional field';
}

function inferTrend(indicators: EmotionIndicators): string {
  if (indicators.trend) return indicators.trend;
  if (indicators.hri > indicators.cfi) return 'improving';
  if (indicators.cfi > indicators.hri) return 'defensive';
  return 'stable';
}

function buildCurrentState(indicators: EmotionIndicators): KnowledgePacket['currentState'] {
  return {
    summary: `GMI=${indicators.gmi}, CFI=${indicators.cfi}, HRI=${indicators.hri}, dominant=${indicators.dominantEmotion}.`,
    moodDescription: describeMood(indicators),
    trend: inferTrend(indicators),
    confidence: indicators.confidence ?? 0.6,
  };
}

function engineByName(outputs: EngineOutput[], name: string): EngineOutput | undefined {
  return outputs.find(output => output.engine === name);
}

function buildCauses(outputs: EngineOutput[]): KnowledgePacket['causes'] {
  const explanation = engineByName(outputs, 'explanation_engine');
  const primary = (explanation?.insights || []).slice(0, 3).map((insight, index) => ({
    cause: insight,
    effect: 'emotional field movement',
    explanation: explanation?.reasoning || 'Derived from explanation engine output.',
    confidence: Math.max(0.4, (explanation?.confidence || 0.6) - index * 0.05),
  }));
  return {
    primary,
    secondary: outputs.filter(output => output.engine !== 'explanation_engine').flatMap(output => output.insights.slice(0, 1)).map(insight => ({ cause: insight, effect: 'contextual pressure', explanation: 'Supporting engine signal.', confidence: 0.5 })),
    summary: primary.length ? `Primary drivers: ${primary.map(item => item.cause).join('; ')}` : 'No strong causal driver was isolated.',
  };
}

function buildImplications(indicators: EmotionIndicators): KnowledgePacket['implications'] {
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  if (indicators.cfi > 65) shortTerm.push('Risk aversion may remain elevated.');
  if (indicators.hri > 60) shortTerm.push('Constructive recovery signals are present.');
  if (indicators.gmi < -25) longTerm.push('Persistent negative mood may weaken confidence if not offset by new evidence.');
  if (indicators.gmi > 25) longTerm.push('Positive mood can support gradual confidence if source credibility remains strong.');
  return { shortTerm, longTerm, forUser: 'Use this as context, not as a standalone decision signal.' };
}

function buildDecision(outputs: EngineOutput[], indicators: EmotionIndicators): KnowledgePacket['decision'] {
  const decision = engineByName(outputs, 'decision_engine');
  const signal = (decision?.data?.signal as KnowledgePacket['decision']['signal']) || (indicators.cfi > 70 ? 'negative' : indicators.hri > 60 ? 'positive' : 'neutral');
  const risks = outputs.flatMap(output => output.insights).filter(insight => /risk|fear|pressure|volatile/i.test(insight));
  const opportunities = outputs.flatMap(output => output.insights).filter(insight => /hope|recovery|positive|opportunity/i.test(insight));
  return {
    signal,
    recommendation: String(decision?.data?.recommendation || 'Monitor the field and wait for confirmation before acting.'),
    reasoning: decision?.reasoning || 'Decision support is based on current emotional-field balance.',
    risks,
    opportunities,
  };
}

function buildScenarios(outputs: EngineOutput[]): KnowledgePacket['scenarios'] | undefined {
  const scenario = engineByName(outputs, 'scenario_engine');
  if (!scenario) return undefined;
  return {
    best: { name: 'Constructive scenario', probability: 0.3, description: 'Fear stabilizes while resilience improves.', triggers: ['lower CFI', 'higher HRI'] },
    worst: { name: 'Stress scenario', probability: 0.25, description: 'Fear accelerates and mood deteriorates.', triggers: ['higher CFI', 'lower GMI'] },
    likely: { name: 'Base scenario', probability: 0.45, description: scenario.insights[0] || 'Gradual transition remains most likely.', triggers: ['current trend persistence'] },
  };
}

function buildComparison(outputs: EngineOutput[]): KnowledgePacket['comparison'] | undefined {
  const comparison = engineByName(outputs, 'comparison_engine');
  if (!comparison) return undefined;
  const entities = (comparison.data?.entities as string[]) || [];
  return { items: entities, reasoning: comparison.reasoning };
}

function buildFollowUp(question: DeepQuestion, outputs: EngineOutput[]): KnowledgePacket['followUp'] {
  const implicitAnswers = question.deep.implicitQuestions || [];
  const needs = new Set<string>();
  if (outputs.some(output => output.engine === 'scenario_engine')) needs.add('Ask for scenario assumptions if you want a narrower forecast.');
  if (outputs.some(output => output.engine === 'comparison_engine')) needs.add('Specify the assets, countries, or time window for a sharper comparison.');
  if (outputs.some(output => output.engine === 'economic_engine')) needs.add('Add the market instrument or asset if this is for trading context.');
  return { implicitAnswers, suggestedQuestions: [...needs] };
}

export function buildKnowledgePacket(question: DeepQuestion, sourceData: SourceData): KnowledgePacket {
  const indicators = sourceData.emotionIndicators || defaultIndicators();
  const currentState = buildCurrentState(indicators);
  const syntheticOutputs: EngineOutput[] = [];
  return {
    core: { topic: question.surface.topic, questionType: question.surface.questionType, realIntent: question.deep.realIntent, emotionalNeed: question.deep.emotionalNeed },
    currentState,
    causes: { primary: [], secondary: [], summary: 'No engine-level causal output was provided.' },
    implications: buildImplications(indicators),
    decision: buildDecision(syntheticOutputs, indicators),
    followUp: buildFollowUp(question, syntheticOutputs),
  };
}

function buildKnowledgeFromCognitive(question: DeepQuestion, cognitiveOutput: CognitiveOutput): KnowledgePacket {
  const indicators = cognitiveOutput.emotionIndicators || defaultIndicators();
  const outputs = cognitiveOutput.outputs || [];
  const currentState = buildCurrentState(indicators);
  return {
    core: { topic: question.surface.topic, questionType: question.surface.questionType, realIntent: question.deep.realIntent, emotionalNeed: question.deep.emotionalNeed },
    currentState,
    causes: buildCauses(outputs),
    implications: buildImplications(indicators),
    decision: buildDecision(outputs, indicators),
    scenarios: buildScenarios(outputs),
    comparison: buildComparison(outputs),
    followUp: buildFollowUp(question, outputs),
  };
}

export { buildKnowledgeFromCognitive };
