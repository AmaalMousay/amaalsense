/**
 * AmalSense Network Engine — Central Orchestrator
 *
 * Coordinates the end-to-end analysis pipeline by delegating to specialised
 * sub-pipelines. This file is deliberately kept thin; the heavy lifting lives
 * in analysisPipeline.ts and responsePipeline.ts.
 */

import { layer1QuestionUnderstanding, type Layer1Output } from '../cognitiveEngine/questionUnderstanding';
import { collectCountryData, collectTopicData, type CollectedData } from '../services/unifiedDataCollector';
import { createUniversalEventVector, generateUniversalPrompt, type QuantumEventVector } from './eventVectorEngine';
import { composeNaturalAnswer } from './responseBuilder';
import { runAnalysisBranches } from './analysisPipeline';
import { runResponseQualityCheck } from './responsePipeline';
import { storeAnalysisRecord } from './learningStore';
import { MultiTurnContext } from './multiTurnContext';
import { CognitiveAnswerGate } from '../cognitiveArchitecture/cognitiveAnswerGate';
import { ContextLockLayer } from '../cognitiveArchitecture/contextLockLayer';

export type EventVector = QuantumEventVector;

export interface NetworkContext {
  requestId: string;
  userId: string;
  timestamp: Date;
  language: string;
  gate: {
    layer1Output: Layer1Output;
    intent: string;
    searchQuery: string;
    detectedCountry?: { code: string; name: string };
    needsAnalysis?: boolean;
    needsLLM?: boolean;
  };
  collection: {
    rawData: CollectedData;
    eventVector: EventVector;
    parallelSignalVector?: any;
    vectorPrompt: string;
    totalItems: number;
  };
  analysis: {
    emotions: Record<string, number>;
    dominantEmotion: string;
    sentiment?: string;
    confidence: number;
    resonanceInsight?: any;
    breakingNews?: any[];
    prediction?: any;
  };
  analytics?: NetworkContext['analysis'];
  dcft: {
    result: any;
    indices: { gmi: number; cfi: number; hri: number };
    alertLevel: string;
  };
  generation: {
    response: string;
    suggestions: string[];
    languageEnforced?: boolean;
    quality?: { score: number; relevance: number; accuracy: number; completeness: number; clarity: number };
  };
  executionMetrics: {
    totalDurationMs: number;
    layerTraces: any[];
    parallelGroups: string[];
    errors: string[];
  };
  status: 'completed' | 'error';
}

function requiresLiveAnalysis(question: string, layer1: Layer1Output): boolean {
  const q = question.toLowerCase();
  const words = ['analyze','analysis','today','now','current','mood','sentiment','trend','predict','prediction',
    'compare','comparison','fear','risk','market','country','news','social','weather','emotion'];
  if (words.some((w) => q.includes(w))) return true;
  return ['sentiment','trend','comparison','prediction','recommendation'].includes(layer1.questionType as any);
}

function createEmptyCollectedData(query: string): CollectedData {
  return { items: [], sources: [], sourceCount: 0, fetchedAt: Date.now(), query, queryType: 'question' };
}

function createEmptyVector(query: string): EventVector {
  return createUniversalEventVector(createEmptyCollectedData(query));
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function executeNetworkEngine(
  userId: string, question: string, language = 'ar',
): Promise<NetworkContext> {
  const startTime = Date.now();
  const requestId = `net_${Date.now()}`;
  const conversationId = `user_${userId}`;
  const contextResolution = MultiTurnContext.resolveReferences(conversationId, question);
  const effectiveQuestion = contextResolution.resolvedQuestion || question;

  const layer1 = await layer1QuestionUnderstanding(effectiveQuestion, language);

  // --- Context Lock Layer ---
  const contextLock = ContextLockLayer.getLock(conversationId);
  if (contextLock) {
    const country = layer1.geographicContext?.countryCode || 'global';
    const validation = ContextLockLayer.validateContext(conversationId, effectiveQuestion, country);
    if (!validation.isValid) {
      const emptyV = createEmptyVector(effectiveQuestion);
      return earlyResponse(requestId, userId, effectiveQuestion, language, layer1, startTime,
        `I notice you changed topic. ${validation.suggestion}`, ['ContextLock'], [validation.reason || 'Context drift'],
      );
    }
  }

  // --- Cognitive Answer Gate ---
  const gateDecision = CognitiveAnswerGate.makeDecision({
    question: effectiveQuestion,
    availableData: { hasNews: false, hasSocialMedia: false, hasHistoricalData: false, dataQuality: 'medium' as const, dataRecency: 'none' as const },
    questionComplexity: (layer1.questionType === 'explanation' || layer1.questionType === 'prediction' ? 'complex' : 'moderate') as any,
    domainKnowledge: 'medium' as const,
  });

  if (gateDecision.decision === 'clarify_question' || gateDecision.decision === 'admit_ignorance') {
    return earlyResponse(requestId, userId, effectiveQuestion, language, layer1, startTime,
      CognitiveAnswerGate.generateGateResponse(gateDecision), ['AnswerGate'], [gateDecision.reasoning],
    );
  }

  // --- Direct answer (no live analysis) ---
  if (!requiresLiveAnalysis(effectiveQuestion, layer1) && gateDecision.decision !== 'search_more_data') {
    const directResponse = await composeNaturalAnswer({
      question: effectiveQuestion, language, intent: layer1.questionType, route: 'direct',
      limitations: ['No live analysis was required.'],
    });
    ContextLockLayer.createLock(conversationId, layer1.entities?.topics?.[0] || effectiveQuestion, 'global', 'general');
    return earlyResponse(requestId, userId, effectiveQuestion, language, layer1, startTime,
      directResponse, ['NaturalGeneration'], [], { needsLLM: true },
    );
  }

  // --- Live analysis path ---
  const detectedCountry = detectCountryInQuery(effectiveQuestion, layer1);
  const intent = detectedCountry.code !== 'GLOBAL' ? 'country' : 'topic';
  const rawData = detectedCountry.code !== 'GLOBAL'
    ? await collectCountryData(detectedCountry.code, detectedCountry.name)
    : await collectTopicData(layer1.entities?.topics?.[0] || effectiveQuestion);

  const eventVector = createUniversalEventVector(rawData);
  const graphInput = rawData.items.map((i) => `${i.title} ${i.description || ''}`).join('\n') || effectiveQuestion;
  const topicKey = detectedCountry.code !== 'GLOBAL' ? detectedCountry.name : (layer1.entities?.topics?.[0] || 'Global_Trends');

  // Parallel analysis branches — delegated to analysisPipeline
  const branches = await runAnalysisBranches(rawData, effectiveQuestion, graphInput, topicKey, detectedCountry);

  // Response generation
  const finalResponse = await composeNaturalAnswer({
    question: effectiveQuestion, language, intent, route: 'analysis',
    eventVector: { central: eventVector, parallel: branches.parallelSignalVector, prediction: branches.predictionReport },
    indices: branches.dcftResult?.indices,
    emotions: branches.emotions.vector,
    confidence: branches.emotions.dominantEmotion ? 80 : layer1.confidence,
    evidence: rawData.items.slice(0, 6).map((i) => ({ title: i.title, source: i.source, url: i.url })),
    memory: branches.resonanceInsight,
    knowledgeContext: branches.knowledgeContext,
    limitations: [
      ...(rawData.items.length === 0 ? ['No live sources.'] : []),
      ...(!branches.predictionReport && isPredictionQuestion(effectiveQuestion)
        ? ['Not enough historical data for prediction.'] : []),
    ],
  });

  // Post-generation quality checks — delegated to responsePipeline
  const quality = await runResponseQualityCheck(
    conversationId, finalResponse, effectiveQuestion, detectedCountry.name,
    rawData.items.map((i) => i.title), branches.dcftResult?.indices?.cfi ?? 50,
    Object.keys(eventVector.sourceBreakdown).length, eventVector.totalItems,
    (branches.dcftResult?.indices?.gmi ?? 0) !== 0, rawData.items.length > 0,
    branches.emotions.vector, branches.emotions.dominantEmotion,
    branches.dcftResult?.indices?.gmi, branches.dcftResult?.indices?.hri,
  );

  // Build final context
  const context: NetworkContext = {
    requestId, userId, timestamp: new Date(), language,
    gate: { layer1Output: layer1, intent, searchQuery: effectiveQuestion, detectedCountry: detectedCountry.code !== 'GLOBAL' ? detectedCountry : undefined, needsAnalysis: true, needsLLM: true },
    collection: { rawData, eventVector, parallelSignalVector: branches.parallelSignalVector, vectorPrompt: generateUniversalPrompt(eventVector, language), totalItems: eventVector.totalItems },
    analysis: { emotions: branches.emotions.vector, dominantEmotion: branches.emotions.dominantEmotion, confidence: 90, resonanceInsight: branches.resonanceInsight, breakingNews: rawData.items.slice(0, 5) },
    analytics: { emotions: branches.emotions.vector, dominantEmotion: branches.emotions.dominantEmotion, confidence: 90, resonanceInsight: branches.resonanceInsight, breakingNews: rawData.items.slice(0, 5) },
    dcft: { result: branches.dcftResult, indices: branches.dcftResult?.indices || { gmi: 0, cfi: 50, hri: 50 }, alertLevel: branches.dcftResult?.alertLevel || 'normal' },
    generation: { response: finalResponse, suggestions: ['Analyze global economic impact', 'Inspect historical resonance for this pattern'], languageEnforced: true, quality: quality.qualityScores },
    executionMetrics: {
      totalDurationMs: Date.now() - startTime,
      layerTraces: [
        { layer: 'ContextLockLayer', status: contextLock ? 'checked' : 'no_lock' },
        { layer: 'AnswerGate', decision: gateDecision.decision },
        { layer: 'ContextualBinding', confidence: quality.boundContext.confidence, region: quality.boundContext.cultural.region },
        { layer: 'ConsistencyCheck', isConsistent: quality.consistencyResult.isConsistent, score: quality.consistencyResult.confidenceScore },
        { layer: 'Metacognition', overallConfidence: quality.metacognitiveAssessment.overallConfidence },
      ],
      parallelGroups: ['Collection','ParallelBranches','Generation','Consistency+Metacognition'],
      errors: quality.errors,
    },
    status: 'completed',
  };

  ContextLockLayer.createLock(conversationId, topicKey, detectedCountry.code, intent);
  saveToLearningMemory(context);
  return context;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function earlyResponse(
  requestId: string, userId: string, question: string, language: string,
  layer1: Layer1Output, startTime: number, response: string,
  groups: string[], errors: string[],
  extra?: { needsLLM?: boolean },
): NetworkContext {
  const emptyV = createEmptyVector(question);
  return {
    requestId, userId, timestamp: new Date(), language,
    gate: { layer1Output: layer1, intent: 'direct_answer', searchQuery: question, needsAnalysis: false, needsLLM: extra?.needsLLM ?? false },
    collection: { rawData: createEmptyCollectedData(question), eventVector: emptyV, vectorPrompt: '', totalItems: 0 },
    analysis: { emotions: {}, dominantEmotion: 'neutral', confidence: 90 },
    analytics: { emotions: {}, dominantEmotion: 'neutral', confidence: 90 },
    dcft: { result: null, indices: { gmi: 0, cfi: 0, hri: 0 }, alertLevel: 'normal' },
    generation: { response, suggestions: [], languageEnforced: true },
    executionMetrics: { totalDurationMs: Date.now() - startTime, layerTraces: [], parallelGroups: groups, errors },
    status: 'completed',
  };
}

function isPredictionQuestion(question: string): boolean {
  return /\b(predict|prediction|forecast|future|next|will|scenario|outlook)\b/i.test(question);
}

function detectCountryInQuery(query: string, layer1Data: Layer1Output) {
  if (layer1Data.geographicContext?.countryCode && layer1Data.geographicContext.countryCode !== 'GLOBAL') {
    return { code: layer1Data.geographicContext.countryCode, name: layer1Data.geographicContext.locationName || 'Specified Location' };
  }
  const q = query.toLowerCase();
  const patterns: Array<{ pattern: RegExp; code: string; name: string }> = [
    /libya|tripoli|benghazi/i, /egypt|cairo/i, /palestine|gaza/i,
    /usa|america|united states/i, /china/i, /russia/i, /japan/i,
  ].map((p, i) => ({ pattern: p, code: ['LY','EG','PS','US','CN','RU','JP'][i], name: ['Libya','Egypt','Palestine','United States','China','Russia','Japan'][i] }));
  return patterns.find((p) => p.pattern.test(q)) || { code: 'GLOBAL', name: 'Global' };
}

function saveToLearningMemory(ctx: NetworkContext) {
  try {
    const v = ctx.collection.eventVector;
    const finance = ['gold','silver','oil','currency','economy','inflation','trading','market','finance'];
    const isFinancial = finance.some((w) => ctx.gate.searchQuery.toLowerCase().includes(w));
    storeAnalysisRecord(
      { topic: ctx.gate.detectedCountry?.name || 'Global Trends', newsText: ctx.collection.rawData.items[0]?.description || ctx.gate.searchQuery, countryCode: ctx.gate.detectedCountry?.code || 'GLOBAL', isFinancial },
      { source: 'CentralNetworkEngine', intent: ctx.gate.intent },
      {
        gmi: ctx.dcft.indices.gmi, cfi: ctx.dcft.indices.cfi, hri: ctx.dcft.indices.hri,
        dominantEmotion: ctx.analysis.dominantEmotion, emotionalIntensity: v.intensity || 0.5,
        valence: (ctx.dcft.indices.hri - 50) / 50,
        tradingSignal: isFinancial ? (v.intensity > 0.7 ? 'VOLATILE' : 'STABLE') : 'NONE',
        affectiveVector: ctx.analysis.emotions, insights: v.topHeadlines?.slice(0, 3).map((h) => h.title) || [],
      },
      { resonanceCount: ctx.analysis.resonanceInsight?.observationsCount || 0 },
    );
  } catch (e) {
    console.warn('[NetworkEngine] Memory sync failed:', e);
  }
}

// ---------------------------------------------------------------------------
// Public view helpers (delegate to executeNetworkEngine)
// ---------------------------------------------------------------------------

export async function analyzeForMap(query: string, userId = 'system') { return executeNetworkEngine(userId, query); }
export async function analyzeForWeather(code: string, name: string, userId = 'system') { return executeNetworkEngine(userId, `Weather and mood in ${name}`, 'en'); }
export async function analyzeForCountryDetail(code: string, name: string, _ai = false, lang = 'ar', userId = 'system') { return executeNetworkEngine(userId, `Detailed analysis of ${name}`, lang); }
export async function analyzeForSmartAnalysis(query: string, userId = 'system') { return executeNetworkEngine(userId, query); }
export async function analyzeForSmartAnalysisV2(query: string, userId = 'system') { return executeNetworkEngine(userId, query); }
export async function analyzeCountriesBatch(countries: string[], userId = 'system') { return Promise.all(countries.map((c) => executeNetworkEngine(userId, c))); }

export async function getGlobalMood() {
  const ctx = await executeNetworkEngine('system', 'Global Mood Summary', 'en');
  return { gmi: ctx.dcft.indices.gmi, cfi: ctx.dcft.indices.cfi, hri: ctx.dcft.indices.hri, overall: ctx.dcft.indices.gmi, dominantEmotion: ctx.analysis.dominantEmotion, intensity: ctx.collection.eventVector.intensity, confidence: ctx.analysis.confidence, sourceCount: ctx.collection.totalItems, timestamp: new Date() };
}

export function getEngineStats() {
  return { status: 'active', version: 'central-network-2.0', uptime: process.uptime(), memory: process.memoryUsage(), lastPulse: new Date(), centralProcessor: 'networkEngine', parallelBranches: ['graphPipeline','emotionEngine','dcftEngine','ragSystem'], layers: ['ContextLockLayer','CognitiveAnswerGate','ContextualBinding','CognitiveConsistencyCheck','Metacognition'], networkCacheSize: 0, dataCacheStats: { hits: 0, misses: 0, ratio: 0 }, learning: { totalCycles: 0, totalAnalyses: 0, accuracyRate: 0, verifiedAnalyses: 0, totalFeedback: 0, adjustmentsMade: 0, currentWeights: {}, emotionBiases: {} } };
}

export function clearAllCaches() { return { success: true }; }
export async function runEngineLearningCycle() { return { analysesReviewed: 0, adjustmentsMade: 0 }; }
export async function evaluateEnginePrediction(id: string, correct: boolean) { return { success: true, id, correct }; }

export async function getAggregatedNetworkData(topic: string, country?: string) {
  try {
    const { createUniversalEventVector } = await import('./eventVectorEngine');
    const { analyzeTextWithAI } = await import('./emotionEngine');
    const raw = country ? await collectCountryData(country, country) : await collectTopicData(topic);
    const v = createUniversalEventVector(raw);
    const em = await analyzeTextWithAI(raw.items.map((i) => i.title).join(' '));
    return { newsItems: raw.items, emotionData: { fear: em.emotions.fear || 0.1, hope: em.emotions.hope || 0.5, anger: em.emotions.anger || 0.1, gmi: (em.emotions.joy || 0.5) * 100, cfi: (em.emotions.fear || 0.1) * 100, hri: (em.emotions.hope || 0.5) * 100 }, eventVector: v };
  } catch { return null; }
}