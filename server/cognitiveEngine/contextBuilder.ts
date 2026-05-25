import { t } from "../_core/i18n";
/**
 * Context Builder
 * 
 * This layer takes raw data from sources and builds a "knowledge packet"
 * that the Intelligent Narrator can use to construct a response.
 * 
 * Philosophy:
 * - Raw data is noise, context is signal
 * - Connect dots between different data points
 * - Build causal chains: "Because X happened, Y is the result"
 * - Filter irrelevant information
 */

import { type DeepQuestion } from './questionUnderstanding';
import { type CognitiveOutput, type EmotionIndicators, type EngineOutput } from './cognitiveRouter';

// Legacy types for backward compatibility
interface NewsPacket {
  headlines: Array<{ title: string; relevance: number; sentiment: string }>;
}

interface ExpertKnowledgePacket {
  insights: Array<{ insight: string; source: string; confidence: number }>;
  riskFactors: string[];
  opportunities: string[];
}

// Source data can come from either old system or new Cognitive Router
interface SourceData {
  emotionIndicators?: EmotionIndicators;
  news?: NewsPacket;
  expertKnowledge?: ExpertKnowledgePacket;
  economicData?: any;
  scenarioModels?: any;
  comparisonData?: any;
}

// The knowledge packet that will be used to generate the response
export interface KnowledgePacket {
  // Core understanding
  core: {
    topic: string;
    questionType: string;
    realIntent: string;
    emotionalNeed: string;
  };
  
  // The current state
  currentState: {
    summary: string;           // One sentence summary
    moodDescription: string;   // Human description of mood
    trend: string;             // What's happening
    confidence: number;        // How confident we are
  };
  
  // Causal analysis
  causes: {
    primary: CausalChain[];    // Main causes
    secondary: CausalChain[];  // Contributing factors
    summary: string;           // "This is happening because..."
  };
  
  // Implications
  implications: {
    shortTerm: string[];       // What this means now
    longTerm: string[];        // What this might mean later
    forUser: string;           // What this means for the user specifically
  };
  
  // Decision support
  decision: {
    signal: 'positive' | 'negative' | 'neutral' | 'caution';
    recommendation: string;
    reasoning: string;
    risks: string[];
    opportunities: string[];
  };
  
  // Scenarios (if applicable)
  scenarios?: {
    best: ScenarioSummary;
    worst: ScenarioSummary;
    likely: ScenarioSummary;
  };
  
  // Comparison (if applicable)
  comparison?: {
    items: string[];
    winner?: string;
    reasoning: string;
  };
  
  // Follow-up
  followUp: {
    implicitAnswers: string[];  // Answers to unasked questions
    suggestedQuestions: string[]; // Smart follow-up questions
  };
}

interface CausalChain {
  cause: string;           // What happened
  effect: string;          // What it caused
  explanation: string;     // Why this connection exists
  confidence: number;      // How confident we are
}

interface ScenarioSummary {
  name: string;
  probability: number;
  description: string;
  triggers: string[];
}

/**
 * Build knowledge packet from question understanding and source data
 */
export function buildKnowledgePacket(
  question: DeepQuestion,
  sourceData: SourceData
): KnowledgePacket {
  const { surface, deep } = question;
  
  // Build core understanding
  const core = {
    topic: surface.topic,
    questionType: surface.questionType,
    realIntent: deep.realIntent,
    emotionalNeed: deep.emotionalNeed
  };
  
  // Build current state description
  const currentState = buildCurrentState(surface.topic, sourceData.emotionIndicators);
  
  // Build causal analysis
  const causes = buildCausalAnalysis(surface.topic, sourceData, deep.realIntent);
  
  // Build implications
  const implications = buildImplications(surface.topic, currentState, causes, deep.realIntent);
  
  // Build decision support
  const decision = buildDecisionSupport(
    sourceData.emotionIndicators,
    sourceData.expertKnowledge,
    deep.realIntent
  );
  
  // Build scenarios if needed
  const scenarios = sourceData.scenarioModels ? buildScenarioSummary(sourceData.scenarioModels) : undefined;
  
  // Build comparison if needed
  const comparison = sourceData.comparisonData?.items.length 
    ? buildComparisonSummary(sourceData.comparisonData)
    : undefined;
  
  // Build follow-up
  const followUp = buildFollowUp(deep.implicitQuestions, surface.topic, currentState);
  
  return {
    core,
    currentState,
    causes,
    implications,
    decision,
    scenarios,
    comparison,
    followUp
  };
}

/**
 * Build current state description
 */
function buildCurrentState(
  topic: string,
  indicators?: EmotionIndicators
): KnowledgePacket['currentState'] {
  const gmi = indicators?.gmi || 50;
  const cfi = indicators?.cfi || 50;
  const hri = indicators?.hri || 50;
  
  // Generate mood description
  let moodDescription: string;
  let summary: string;
  let trend: string;
  
  if (cfi > 65) {
    moodDescription = t('auto.cognitiveEngine_contextBuilder.101.7d970391', 'ar');
    summary = `   ${topic}      `;
    trend = t('auto.cognitiveEngine_contextBuilder.100.b2831ce7', 'ar');
  } else if (hri > 65) {
    moodDescription = t('auto.cognitiveEngine_contextBuilder.99.7a1104e7', 'ar');
    summary = `   ${topic}     `;
    trend = t('auto.cognitiveEngine_contextBuilder.98.8c350ffe', 'ar');
  } else if (cfi > 55 && hri > 55) {
    moodDescription = t('auto.cognitiveEngine_contextBuilder.97.6eb85439', 'ar');
    summary = `   ${topic}  -     `;
    trend = t('auto.cognitiveEngine_contextBuilder.96.b03d84bc', 'ar');
  } else {
    moodDescription = t('auto.cognitiveEngine_contextBuilder.95.d05785eb', 'ar');
    summary = `   ${topic}  `;
    trend = t('auto.cognitiveEngine_contextBuilder.94.bd9f6833', 'ar');
  }
  
  return {
    summary,
    moodDescription,
    trend,
    confidence: indicators?.confidence || 0.7
  };
}

/**
 * Build causal analysis - connect causes to effects
 */
function buildCausalAnalysis(
  topic: string,
  sourceData: SourceData,
  realIntent: string
): KnowledgePacket['causes'] {
  const primary: CausalChain[] = [];
  const secondary: CausalChain[] = [];
  
  // Extract causes from news
  if (sourceData.news) {
    for (const headline of sourceData.news.headlines) {
      if (headline.relevance > 0.8) {
        primary.push({
          cause: headline.title,
          effect: headline.sentiment === 'negative' ? t('auto.cognitiveEngine_contextBuilder.93.a4da4181', 'ar') : 
                  headline.sentiment === 'positive' ? t('auto.cognitiveEngine_contextBuilder.92.d9f2f98a', 'ar') : t('auto.cognitiveEngine_contextBuilder.91.04f46c07', 'ar'),
          explanation: `    ${topic}     `,
          confidence: headline.relevance
        });
      } else {
        secondary.push({
          cause: headline.title,
          effect: t('auto.cognitiveEngine_contextBuilder.90.ad6d005f', 'ar'),
          explanation: t('auto.cognitiveEngine_contextBuilder.89.1290bb8b', 'ar'),
          confidence: headline.relevance
        });
      }
    }
  }
  
  // Add expert knowledge causes
  if (sourceData.expertKnowledge) {
    for (const insight of sourceData.expertKnowledge.insights) {
      if (insight.confidence > 0.8) {
        primary.push({
          cause: insight.insight,
          effect: t('auto.cognitiveEngine_contextBuilder.88.6cb6d248', 'ar'),
          explanation: ` : ${insight.source}`,
          confidence: insight.confidence
        });
      }
    }
  }
  
  // Add economic causes if relevant
  if (sourceData.economicData) {
    const commodities = sourceData.economicData.commodities;
    for (const commodity of commodities) {
      if (Math.abs(commodity.change) > 1) {
        secondary.push({
          cause: `${commodity.name} ${commodity.change > 0 ? t('auto.cognitiveEngine_contextBuilder.87.294c459c', 'ar') : t('auto.cognitiveEngine_contextBuilder.86.9bfee223', 'ar')}  ${Math.abs(commodity.change).toFixed(1)}%`,
          effect: commodity.change > 0 ? t('auto.cognitiveEngine_contextBuilder.85.029763e6', 'ar') : t('auto.cognitiveEngine_contextBuilder.84.c668d441', 'ar'),
          explanation: t('auto.cognitiveEngine_contextBuilder.83.da4941a4', 'ar'),
          confidence: 0.85
        });
      }
    }
  }
  
  // Build summary
  const summary = primary.length > 0
    ? `     : ${primary.slice(0, 2).map(c => c.cause).join(t('auto.cognitiveEngine_contextBuilder.82.8715d7bc', 'ar'))}`
    : t('auto.cognitiveEngine_contextBuilder.81.695df5bc', 'ar');
  
  return { primary, secondary, summary };
}

/**
 * Build implications - what does this mean?
 */
function buildImplications(
  topic: string,
  currentState: KnowledgePacket['currentState'],
  causes: KnowledgePacket['causes'],
  realIntent: string
): KnowledgePacket['implications'] {
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  let forUser: string;
  
  // Short term implications
  if (currentState.moodDescription.includes(t('auto.cognitiveEngine_contextBuilder.80.a24a5460', 'ar'))) {
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.79.9689d958', 'ar'));
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.78.72a55af4', 'ar'));
  } else if (currentState.moodDescription.includes(t('auto.cognitiveEngine_contextBuilder.77.e01009da', 'ar'))) {
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.76.2f76d27d', 'ar'));
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.75.40762a5e', 'ar'));
  } else {
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.74.15ff21b7', 'ar'));
    shortTerm.push(t('auto.cognitiveEngine_contextBuilder.73.27b06a2d', 'ar'));
  }
  
  // Long term implications
  longTerm.push(t('auto.cognitiveEngine_contextBuilder.72.278ce03e', 'ar'));
  longTerm.push(t('auto.cognitiveEngine_contextBuilder.71.d931c2ee', 'ar'));
  
  // For user specifically
  switch (realIntent) {
    case 'make_decision':
      forUser = t('auto.cognitiveEngine_contextBuilder.70.0721b662', 'ar');
      break;
    case 'understand_cause':
      forUser = t('auto.cognitiveEngine_contextBuilder.69.fe9daa71', 'ar');
      break;
    case 'predict_future':
      forUser = t('auto.cognitiveEngine_contextBuilder.68.a56a9650', 'ar');
      break;
    case 'assess_risk':
      forUser = t('auto.cognitiveEngine_contextBuilder.67.b86e3b43', 'ar');
      break;
    default:
      forUser = t('auto.cognitiveEngine_contextBuilder.66.bbacccf2', 'ar');
  }
  
  return { shortTerm, longTerm, forUser };
}

/**
 * Build decision support
 */
function buildDecisionSupport(
  indicators?: EmotionIndicators,
  expertKnowledge?: ExpertKnowledgePacket,
  realIntent?: string
): KnowledgePacket['decision'] {
  const cfi = indicators?.cfi || 50;
  const hri = indicators?.hri || 50;
  
  // Determine signal
  let signal: KnowledgePacket['decision']['signal'];
  let recommendation: string;
  let reasoning: string;
  
  if (cfi > 70) {
    signal = 'caution';
    recommendation = t('auto.cognitiveEngine_contextBuilder.65.a2c54ccf', 'ar');
    reasoning = t('auto.cognitiveEngine_contextBuilder.64.5322fe72', 'ar');
  } else if (cfi > 60 && hri > 60) {
    signal = 'neutral';
    recommendation = t('auto.cognitiveEngine_contextBuilder.63.21b3a222', 'ar');
    reasoning = t('auto.cognitiveEngine_contextBuilder.62.5c56cb79', 'ar');
  } else if (hri > 65) {
    signal = 'positive';
    recommendation = t('auto.cognitiveEngine_contextBuilder.61.75c7071e', 'ar');
    reasoning = t('auto.cognitiveEngine_contextBuilder.60.ae8a9927', 'ar');
  } else if (cfi > 55) {
    signal = 'caution';
    recommendation = t('auto.cognitiveEngine_contextBuilder.59.1feed0e6', 'ar');
    reasoning = t('auto.cognitiveEngine_contextBuilder.58.05bc66bb', 'ar');
  } else {
    signal = 'neutral';
    recommendation = t('auto.cognitiveEngine_contextBuilder.57.0b7fce4a', 'ar');
    reasoning = t('auto.cognitiveEngine_contextBuilder.56.2fe8ebcd', 'ar');
  }
  
  // Get risks and opportunities from expert knowledge
  const risks = expertKnowledge?.riskFactors || [t('auto.cognitiveEngine_contextBuilder.55.28ca4696', 'ar')];
  const opportunities = expertKnowledge?.opportunities || [t('auto.cognitiveEngine_contextBuilder.54.67e67d3a', 'ar')];
  
  return {
    signal,
    recommendation,
    reasoning,
    risks,
    opportunities
  };
}

/**
 * Build scenario summary
 */
function buildScenarioSummary(scenarioModels: any): KnowledgePacket['scenarios'] {
  const scenarios = scenarioModels.scenarios || [];
  
  const best = scenarios.find((s: any) => s.impact === 'positive') || {
    name: t('auto.cognitiveEngine_contextBuilder.53.c8cd1da4', 'ar'),
    probability: 0.25,
    description: t('auto.cognitiveEngine_contextBuilder.52.8ad028c1', 'ar'),
    triggers: [t('auto.cognitiveEngine_contextBuilder.51.f9a20d52', 'ar')]
  };
  
  const worst = scenarios.find((s: any) => s.impact === 'negative') || {
    name: t('auto.cognitiveEngine_contextBuilder.50.debdc2bd', 'ar'),
    probability: 0.25,
    description: t('auto.cognitiveEngine_contextBuilder.49.613d5538', 'ar'),
    triggers: [t('auto.cognitiveEngine_contextBuilder.48.3bbb4e94', 'ar')]
  };
  
  const likely = scenarios.find((s: any) => s.impact === 'neutral') || {
    name: t('auto.cognitiveEngine_contextBuilder.47.9bd780ed', 'ar'),
    probability: 0.5,
    description: t('auto.cognitiveEngine_contextBuilder.46.a5ebb7ec', 'ar'),
    triggers: [t('auto.cognitiveEngine_contextBuilder.45.f107fdcd', 'ar')]
  };
  
  return {
    best: { name: best.name, probability: best.probability, description: best.description, triggers: best.triggers },
    worst: { name: worst.name, probability: worst.probability, description: worst.description, triggers: worst.triggers },
    likely: { name: likely.name, probability: likely.probability, description: likely.description, triggers: likely.triggers }
  };
}

/**
 * Build comparison summary
 */
function buildComparisonSummary(comparisonData: any): KnowledgePacket['comparison'] {
  return {
    items: comparisonData.items.map((i: any) => i.name),
    winner: comparisonData.winner,
    reasoning: `  : ${comparisonData.criteria?.join(t('auto.cognitiveEngine_contextBuilder.44.8715d7bc', 'ar')) || t('auto.cognitiveEngine_contextBuilder.43.392e6fbb', 'ar')}`
  };
}

/**
 * Build follow-up suggestions
 */
function buildFollowUp(
  implicitQuestions: string[],
  topic: string,
  currentState: KnowledgePacket['currentState']
): KnowledgePacket['followUp'] {
  // Generate answers to implicit questions
  const implicitAnswers: string[] = [];
  for (const q of implicitQuestions.slice(0, 2)) {
    if (q.includes(t('auto.cognitiveEngine_contextBuilder.42.7d9903ba', 'ar'))) {
      implicitAnswers.push(t('auto.cognitiveEngine_contextBuilder.41.d3b790fc', 'ar'));
    } else if (q.includes(t('auto.cognitiveEngine_contextBuilder.40.93f055fa', 'ar'))) {
      implicitAnswers.push(t('auto.cognitiveEngine_contextBuilder.39.bbb7ffed', 'ar'));
    }
  }
  
  // Generate smart follow-up questions
  const suggestedQuestions = [
    `  ${topic}  `,
    t('auto.cognitiveEngine_contextBuilder.38.ac9264cb', 'ar'),
    t('auto.cognitiveEngine_contextBuilder.37.72237892', 'ar')
  ];
  
  return {
    implicitAnswers,
    suggestedQuestions
  };
}

/**
 * Build knowledge packet from Cognitive Router output (NEW WAY)
 * This is the preferred method - uses internal engines instead of external sources
 */
function buildKnowledgeFromCognitive(
  question: DeepQuestion,
  cognitiveOutput: CognitiveOutput
): KnowledgePacket {
  const { surface, deep } = question;
  const { outputs, combinedInsights, emotionIndicators } = cognitiveOutput;
  
  // Build core understanding
  const core = {
    topic: surface.topic,
    questionType: surface.questionType,
    realIntent: deep.realIntent,
    emotionalNeed: deep.emotionalNeed
  };
  
  // Build current state from emotion indicators
  const currentState = buildCurrentState(surface.topic, emotionIndicators);
  
  // Build causes from engine insights
  const causes = buildCausesFromEngines(outputs, surface.topic);
  
  // Build implications
  const implications = buildImplications(surface.topic, currentState, causes, deep.realIntent);
  
  // Build decision from decision engine output
  const decisionOutput = outputs.find(o => o.engine === 'decision_engine');
  const decision = buildDecisionFromEngine(decisionOutput, emotionIndicators);
  
  // Build scenarios from scenario engine
  const scenarioOutput = outputs.find(o => o.engine === 'scenario_engine');
  const scenarios = scenarioOutput ? buildScenariosFromEngine(scenarioOutput) : undefined;
  
  // Build comparison from comparison engine
  const comparisonOutput = outputs.find(o => o.engine === 'comparison_engine');
  const comparison = comparisonOutput ? buildComparisonFromEngine(comparisonOutput) : undefined;
  
  // Build follow-up with smart questions
  const followUp = buildSmartFollowUp(deep.implicitQuestions, surface.topic, currentState, cognitiveOutput);
  
  return {
    core,
    currentState,
    causes,
    implications,
    decision,
    scenarios,
    comparison,
    followUp
  };
}

/**
 * Build causes from cognitive engine outputs
 */
function buildCausesFromEngines(
  outputs: EngineOutput[],
  topic: string
): KnowledgePacket['causes'] {
  const primary: CausalChain[] = [];
  const secondary: CausalChain[] = [];
  
  // Get insights from explanation engine first
  const explanationOutput = outputs.find(o => o.engine === 'explanation_engine');
  if (explanationOutput) {
    for (const insight of explanationOutput.insights) {
      primary.push({
        cause: insight,
        effect: t('auto.cognitiveEngine_contextBuilder.36.e3441505', 'ar'),
        explanation: t('auto.cognitiveEngine_contextBuilder.35.108790d9', 'ar'),
        confidence: explanationOutput.confidence
      });
    }
  }
  
  // Get insights from economic engine
  const economicOutput = outputs.find(o => o.engine === 'economic_engine');
  if (economicOutput) {
    for (const insight of economicOutput.insights) {
      secondary.push({
        cause: insight,
        effect: t('auto.cognitiveEngine_contextBuilder.34.55db9eb5', 'ar'),
        explanation: t('auto.cognitiveEngine_contextBuilder.33.f1087d81', 'ar'),
        confidence: economicOutput.confidence
      });
    }
  }
  
  // Get insights from media bias engine
  const mediaOutput = outputs.find(o => o.engine === 'media_bias_engine');
  if (mediaOutput) {
    for (const insight of mediaOutput.insights) {
      secondary.push({
        cause: insight,
        effect: t('auto.cognitiveEngine_contextBuilder.32.c032ca43', 'ar'),
        explanation: t('auto.cognitiveEngine_contextBuilder.31.44a82f3d', 'ar'),
        confidence: mediaOutput.confidence
      });
    }
  }
  
  // Build summary
  const summary = primary.length > 0
    ? `     : ${primary.slice(0, 2).map(c => c.cause).join(t('auto.cognitiveEngine_contextBuilder.30.8715d7bc', 'ar'))}`
    : t('auto.cognitiveEngine_contextBuilder.29.695df5bc', 'ar');
  
  return { primary, secondary, summary };
}

/**
 * Build decision from decision engine output
 */
function buildDecisionFromEngine(
  decisionOutput: EngineOutput | undefined,
  indicators: EmotionIndicators
): KnowledgePacket['decision'] {
  if (decisionOutput?.data) {
    const { recommendation, signal } = decisionOutput.data;
    return {
      signal: signal || 'neutral',
      recommendation: recommendation || t('auto.cognitiveEngine_contextBuilder.28.476afc0c', 'ar'),
      reasoning: decisionOutput.reasoning,
      risks: decisionOutput.insights.filter(i => i.includes(t('auto.cognitiveEngine_contextBuilder.27.93f055fa', 'ar')) || i.includes(t('auto.cognitiveEngine_contextBuilder.26.5349080f', 'ar'))),
      opportunities: decisionOutput.insights.filter(i => i.includes(t('auto.cognitiveEngine_contextBuilder.25.e87473b0', 'ar')) || i.includes(t('auto.cognitiveEngine_contextBuilder.24.60cd6c3d', 'ar')))
    };
  }
  
  // Fallback to indicator-based decision
  return buildDecisionSupport(indicators, undefined, undefined);
}

/**
 * Build scenarios from scenario engine output
 */
function buildScenariosFromEngine(
  scenarioOutput: EngineOutput
): KnowledgePacket['scenarios'] {
  const insights = scenarioOutput.insights;
  
  return {
    best: {
      name: t('auto.cognitiveEngine_contextBuilder.23.46860915', 'ar'),
      probability: 0.25,
      description: insights.find(i => i.includes(t('auto.cognitiveEngine_contextBuilder.22.0d6ac700', 'ar'))) || t('auto.cognitiveEngine_contextBuilder.21.8ad028c1', 'ar'),
      triggers: [t('auto.cognitiveEngine_contextBuilder.20.f9a20d52', 'ar')]
    },
    worst: {
      name: t('auto.cognitiveEngine_contextBuilder.19.e424e979', 'ar'),
      probability: 0.25,
      description: insights.find(i => i.includes(t('auto.cognitiveEngine_contextBuilder.18.96d145bc', 'ar'))) || t('auto.cognitiveEngine_contextBuilder.17.613d5538', 'ar'),
      triggers: [t('auto.cognitiveEngine_contextBuilder.16.3bbb4e94', 'ar')]
    },
    likely: {
      name: t('auto.cognitiveEngine_contextBuilder.15.263b1af1', 'ar'),
      probability: 0.5,
      description: insights.find(i => i.includes(t('auto.cognitiveEngine_contextBuilder.14.621262f2', 'ar'))) || t('auto.cognitiveEngine_contextBuilder.13.e8be6a2e', 'ar'),
      triggers: [t('auto.cognitiveEngine_contextBuilder.12.f107fdcd', 'ar')]
    }
  };
}

/**
 * Build comparison from comparison engine output
 */
function buildComparisonFromEngine(
  comparisonOutput: EngineOutput
): KnowledgePacket['comparison'] {
  return {
    items: comparisonOutput.insights.filter(i => i.includes(t('auto.cognitiveEngine_contextBuilder.11.cb8ef2dd', 'ar'))),
    reasoning: comparisonOutput.reasoning
  };
}

/**
 * Build smart follow-up questions based on cognitive output
 */
function buildSmartFollowUp(
  implicitQuestions: string[],
  topic: string,
  currentState: KnowledgePacket['currentState'],
  cognitiveOutput: CognitiveOutput
): KnowledgePacket['followUp'] {
  const implicitAnswers: string[] = [];
  
  // Answer implicit questions from combined insights
  for (const q of implicitQuestions.slice(0, 2)) {
    const relevantInsight = cognitiveOutput.combinedInsights.find(i => 
      i.toLowerCase().includes(q.split(' ')[0].toLowerCase())
    );
    if (relevantInsight) {
      implicitAnswers.push(relevantInsight);
    }
  }
  
  // Generate smart follow-up questions based on engines activated
  const suggestedQuestions: string[] = [];
  const { decision } = cognitiveOutput;
  
  // Based on primary engine
  switch (decision.primaryEngine) {
    case 'decision_engine':
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.10.7e0cb070', 'ar'));
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.9.b6cd0e16', 'ar'));
      break;
    case 'explanation_engine':
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.8.d3fb5683', 'ar'));
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.7.87abfadb', 'ar'));
      break;
    case 'scenario_engine':
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.6.ab0df830', 'ar'));
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.5.6aadf116', 'ar'));
      break;
    case 'economic_engine':
      suggestedQuestions.push(`    ${topic} `);
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.4.099514ff', 'ar'));
      break;
    case 'media_bias_engine':
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.3.df84f75a', 'ar'));
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.2.29824838', 'ar'));
      break;
    default:
      suggestedQuestions.push(`  ${topic}  `);
      suggestedQuestions.push(t('auto.cognitiveEngine_contextBuilder.1.ac9264cb', 'ar'));
  }
  
  return {
    implicitAnswers,
    suggestedQuestions: suggestedQuestions.slice(0, 2)
  };
}

export {
  buildCurrentState,
  buildCausalAnalysis,
  buildImplications,
  buildDecisionSupport,
  buildKnowledgeFromCognitive
};
