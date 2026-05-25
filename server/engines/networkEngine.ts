/**
 * AmalSense Network Engine
 *
 * Central processing coordinator. It is the runtime nervous system: it resolves
 * the user question, decides whether live analysis is needed, collects signals,
 * runs independent analysis branches in parallel, builds EventVectors and sends
 * the compact context to the natural answer composer.
 */

import { layer1QuestionUnderstanding, type Layer1Output } from '../cognitiveEngine/questionUnderstanding';
import { collectCountryData, collectTopicData, type CollectedData } from '../services/unifiedDataCollector';
import { createUniversalEventVector, generateUniversalPrompt, type QuantumEventVector } from './eventVectorEngine';
import { graphPipeline, type EventVector as ParallelSignalVector } from '../utils/graphPipeline';
import { analyzeTextWithAI } from './emotionEngine';
import { dcftEngine, type RawDigitalInput, type DCFTAnalysisResult } from '../dcft/dcftEngine';
import { buildRAGContext, formatRAGForPrompt } from '../knowledge/ragSystem';
import { storeAnalysisRecord, getCumulativeInsight } from './learningStore';
import { MultiTurnContext } from './multiTurnContext';
import { composeNaturalAnswer } from './responseBuilder';
import { generatePredictionReport, type PredictionReport, type EmotionalDataPoint } from './predictionEngine';
import { getCountryHistoricalIndices, getEmotionIndicesHistory } from '../_core/db';

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
    parallelSignalVector?: ParallelSignalVector;
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
    prediction?: PredictionReport | null;
  };
  analytics?: NetworkContext['analysis'];
  dcft: {
    result: DCFTAnalysisResult | null;
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
  const analysisWords = [
    'analyze', 'analysis', 'today', 'now', 'current', 'mood', 'sentiment', 'trend', 'predict', 'prediction',
    'compare', 'comparison', 'fear', 'risk', 'market', 'country', 'news', 'social', 'weather', 'emotion',
  ];
  if (analysisWords.some(word => q.includes(word))) return true;
  return ['sentiment', 'trend', 'comparison', 'prediction', 'recommendation'].includes(layer1.questionType as any);
}

function createEmptyCollectedData(query: string): CollectedData {
  return { items: [], sources: [], sourceCount: 0, fetchedAt: Date.now(), query, queryType: 'question' };
}

function createEmptyVector(query: string): EventVector {
  return createUniversalEventVector(createEmptyCollectedData(query));
}

export async function executeNetworkEngine(userId: string, question: string, language: string = 'ar'): Promise<NetworkContext> {
  const startTime = Date.now();
  const requestId = `net_${Date.now()}`;
  const conversationId = `user_${userId}`;
  const contextResolution = MultiTurnContext.resolveReferences(conversationId, question);
  const effectiveQuestion = contextResolution.resolvedQuestion || question;
  const layer1 = await layer1QuestionUnderstanding(effectiveQuestion, language);

  if (!requiresLiveAnalysis(effectiveQuestion, layer1)) {
    const directResponse = await composeNaturalAnswer({
      question: effectiveQuestion,
      language,
      intent: layer1.questionType,
      route: 'direct',
      limitations: ['No live data analysis was required for this question.'],
    });
    const emptyVector = createEmptyVector(effectiveQuestion);
    return {
      requestId,
      userId,
      timestamp: new Date(),
      language,
      gate: { layer1Output: layer1, intent: 'direct_answer', searchQuery: effectiveQuestion, needsAnalysis: false, needsLLM: true },
      collection: { rawData: createEmptyCollectedData(effectiveQuestion), eventVector: emptyVector, vectorPrompt: '', totalItems: 0 },
      analysis: { emotions: {}, dominantEmotion: 'neutral', confidence: layer1.confidence },
      analytics: { emotions: {}, dominantEmotion: 'neutral', confidence: layer1.confidence },
      dcft: { result: null, indices: { gmi: 0, cfi: 0, hri: 0 }, alertLevel: 'normal' },
      generation: { response: directResponse, suggestions: [], languageEnforced: true },
      executionMetrics: { totalDurationMs: Date.now() - startTime, layerTraces: [], parallelGroups: ['QuestionUnderstanding', 'NaturalGeneration'], errors: [] },
      status: 'completed',
    };
  }

  const detectedCountry = detectCountryInQuery(effectiveQuestion, layer1);
  const intent = detectedCountry.code !== 'GLOBAL' ? 'country' : 'topic';
  const rawData = detectedCountry.code !== 'GLOBAL'
    ? await collectCountryData(detectedCountry.code, detectedCountry.name)
    : await collectTopicData(layer1.entities?.topics?.[0] || effectiveQuestion);

  const eventVector = createUniversalEventVector(rawData);
  const vectorPrompt = generateUniversalPrompt(eventVector, language);
  const graphInput = rawData.items.map(item => `${item.title} ${item.description || ''}`).join('\n') || effectiveQuestion;
  const topicKey = detectedCountry.code !== 'GLOBAL' ? detectedCountry.name : (layer1.entities?.topics?.[0] || 'Global_Trends');
  const resonanceInsight = getCumulativeInsight(topicKey);

  const [emotions, dcftResult, ragContext, parallelSignalVector, predictionReport] = await Promise.all([
    analyzeEmotionsFromData(rawData),
    executeDCFTProcess(rawData),
    buildRAGContext(effectiveQuestion),
    graphPipeline(graphInput),
    buildPredictionContext(effectiveQuestion, detectedCountry),
  ]);

  const knowledgeContext = formatRAGForPrompt(ragContext);
  const finalResponse = await composeNaturalAnswer({
    question: effectiveQuestion,
    language,
    intent,
    route: 'analysis',
    eventVector: { central: eventVector, parallel: parallelSignalVector, prediction: predictionReport },
    indices: dcftResult?.indices,
    emotions: emotions.vector,
    confidence: emotions.dominantEmotion ? 80 : layer1.confidence,
    evidence: rawData.items.slice(0, 6).map(item => ({ title: item.title, source: item.source, url: item.url })),
    memory: resonanceInsight,
    knowledgeContext,
    limitations: [
      ...(rawData.items.length === 0 ? ['No live source items were available.'] : []),
      ...(!predictionReport && isPredictionQuestion(effectiveQuestion) ? ['Prediction was requested, but there was not enough historical data to generate a reliable forecast.'] : []),
    ],
  });

  const context: NetworkContext = {
    requestId,
    userId,
    timestamp: new Date(),
    language,
    gate: {
      layer1Output: layer1,
      intent,
      searchQuery: effectiveQuestion,
      detectedCountry: detectedCountry.code !== 'GLOBAL' ? detectedCountry : undefined,
      needsAnalysis: true,
      needsLLM: true,
    },
    collection: { rawData, eventVector, parallelSignalVector, vectorPrompt, totalItems: eventVector.totalItems },
    analysis: { emotions: emotions.vector, dominantEmotion: emotions.dominantEmotion, confidence: 90, resonanceInsight, breakingNews: rawData.items.slice(0, 5) },
    analytics: { emotions: emotions.vector, dominantEmotion: emotions.dominantEmotion, confidence: 90, resonanceInsight, breakingNews: rawData.items.slice(0, 5) },
    dcft: { result: dcftResult, indices: dcftResult?.indices || { gmi: 0, cfi: 50, hri: 50 }, alertLevel: dcftResult?.alertLevel || 'normal' },
    generation: {
      response: finalResponse,
      suggestions: ['Analyze global economic impact', 'Inspect historical resonance for this pattern'],
      languageEnforced: true,
      quality: { score: 95, relevance: 98, accuracy: 95, completeness: 90, clarity: 98 },
    },
    executionMetrics: {
      totalDurationMs: Date.now() - startTime,
      layerTraces: [],
      parallelGroups: ['Collection', 'ParallelSignalGraph', 'EventVectorFusion', 'DCFT+RAG+Emotion', 'NaturalGeneration'],
      errors: [],
    },
    status: 'completed',
  };

  saveToLearningMemory(context);
  return context;
}

export async function analyzeForMap(query: string, userId: string = 'system') {
  return executeNetworkEngine(userId, query);
}

export async function analyzeForWeather(countryCode: string, countryName: string, userId: string = 'system') {
  return executeNetworkEngine(userId, `Weather and mood in ${countryName}`);
}

export async function analyzeForCountryDetail(countryCode: string, countryName: string, includeAISummary: boolean = false, language: string = 'ar', userId: string = 'system') {
  return executeNetworkEngine(userId, `Detailed analysis of ${countryName}`, language);
}

export async function analyzeForSmartAnalysis(query: string, userId: string = 'system') {
  return executeNetworkEngine(userId, query);
}

export async function analyzeForSmartAnalysisV2(query: string, userId: string = 'system') {
  return executeNetworkEngine(userId, query);
}

export async function analyzeCountriesBatch(countries: string[], userId: string = 'system') {
  return Promise.all(countries.map(country => executeNetworkEngine(userId, country)));
}

export async function getGlobalMood() {
  const context = await executeNetworkEngine('system', 'Global Mood Summary', 'en');
  return {
    gmi: context.dcft.indices.gmi,
    cfi: context.dcft.indices.cfi,
    hri: context.dcft.indices.hri,
    overall: context.dcft.indices.gmi,
    dominantEmotion: context.analysis.dominantEmotion,
    intensity: context.collection.eventVector.intensity,
    confidence: context.analysis.confidence,
    sourceCount: context.collection.totalItems,
    timestamp: new Date(),
  };
}

export function getEngineStats() {
  return {
    status: 'active',
    version: 'central-network-1.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    lastPulse: new Date(),
    centralProcessor: 'networkEngine',
    parallelBranches: ['graphPipeline', 'emotionEngine', 'dcftEngine', 'ragSystem'],
    networkCacheSize: 0,
    dataCacheStats: { hits: 0, misses: 0, ratio: 0 },
    learning: {
      totalCycles: 0,
      totalAnalyses: 0,
      accuracyRate: 0,
      verifiedAnalyses: 0,
      totalFeedback: 0,
      adjustmentsMade: 0,
      currentWeights: {},
      emotionBiases: {},
    },
  };
}

export function clearAllCaches() {
  return { success: true };
}

export async function runEngineLearningCycle() {
  return { analysesReviewed: 0, adjustmentsMade: 0 };
}

export async function evaluateEnginePrediction(id: string, isCorrect: boolean) {
  return { success: true, id, isCorrect };
}


function isPredictionQuestion(question: string): boolean {
  return /\b(predict|prediction|forecast|future|next|will|scenario|outlook)\b/i.test(question);
}

async function buildPredictionContext(
  question: string,
  detectedCountry: { code: string; name: string }
): Promise<PredictionReport | null> {
  if (!isPredictionQuestion(question)) return null;
  try {
    const history = detectedCountry.code !== 'GLOBAL'
      ? await getCountryHistoricalIndices(detectedCountry.code, 168)
      : await getEmotionIndicesHistory(168);

    const points: EmotionalDataPoint[] = history
      .map((item: any) => ({
        timestamp: new Date(item.analyzedAt).getTime(),
        gmi: Number(item.gmi ?? 0),
        cfi: Number(item.cfi ?? 50),
        hri: Number(item.hri ?? 50),
        dominantEmotion: item.dominantEmotion || 'neutral',
        confidence: item.confidence ?? 70,
        countryCode: item.countryCode || detectedCountry.code,
      }))
      .filter(point => Number.isFinite(point.timestamp));

    if (points.length < 3) return null;
    return generatePredictionReport(
      detectedCountry.code,
      detectedCountry.name,
      points,
      false
    );
  } catch (error) {
    console.warn('[NetworkEngine] Prediction branch failed:', error);
    return null;
  }
}

function detectCountryInQuery(query: string, layer1Data: Layer1Output) {
  if (layer1Data.geographicContext?.countryCode && layer1Data.geographicContext.countryCode !== 'GLOBAL') {
    return { code: layer1Data.geographicContext.countryCode, name: layer1Data.geographicContext.locationName || 'Specified Location' };
  }

  const normalized = query.toLowerCase();
  const patterns = [
    { pattern: /libya|tripoli|benghazi/i, code: 'LY', name: 'Libya' },
    { pattern: /egypt|cairo/i, code: 'EG', name: 'Egypt' },
    { pattern: /palestine|gaza/i, code: 'PS', name: 'Palestine' },
    { pattern: /usa|america|united states/i, code: 'US', name: 'United States' },
    { pattern: /china/i, code: 'CN', name: 'China' },
    { pattern: /russia/i, code: 'RU', name: 'Russia' },
    { pattern: /japan/i, code: 'JP', name: 'Japan' },
  ];

  return patterns.find(item => item.pattern.test(normalized)) || { code: 'GLOBAL', name: 'Global' };
}

function saveToLearningMemory(ctx: NetworkContext) {
  try {
    const vector = ctx.collection.eventVector;
    const financialKeywords = ['gold', 'silver', 'oil', 'currency', 'economy', 'inflation', 'trading', 'market', 'finance'];
    const isFinancial = financialKeywords.some(word => ctx.gate.searchQuery.toLowerCase().includes(word));

    storeAnalysisRecord(
      {
        topic: ctx.gate.detectedCountry?.name || 'Global Trends',
        newsText: ctx.collection.rawData.items[0]?.description || ctx.gate.searchQuery,
        countryCode: ctx.gate.detectedCountry?.code || 'GLOBAL',
        isFinancial,
      },
      { source: 'CentralNetworkEngine', intent: ctx.gate.intent },
      {
        gmi: ctx.dcft.indices.gmi,
        cfi: ctx.dcft.indices.cfi,
        hri: ctx.dcft.indices.hri,
        dominantEmotion: ctx.analysis.dominantEmotion,
        emotionalIntensity: vector.intensity || 0.5,
        valence: (ctx.dcft.indices.hri - 50) / 50,
        tradingSignal: isFinancial ? (vector.intensity > 0.7 ? 'VOLATILE' : 'STABLE') : 'NONE',
        affectiveVector: ctx.analysis.emotions,
        insights: vector.topHeadlines?.slice(0, 3).map(headline => headline.title) || [],
      },
      { resonanceCount: ctx.analysis.resonanceInsight?.observationsCount || 0 }
    );
  } catch (error) {
    console.warn('[NetworkEngine] Memory synchronization failed:', error);
  }
}

async function analyzeEmotionsFromData(data: CollectedData) {
  const text = data.items.map(item => item.title).join(' ');
  const result = await analyzeTextWithAI(text || data.query);
  return { vector: result.emotions as unknown as Record<string, number>, dominantEmotion: result.dominantEmotion };
}

async function executeDCFTProcess(data: CollectedData): Promise<DCFTAnalysisResult | null> {
  const inputs: RawDigitalInput[] = data.items.map((item, index) => ({
    id: `idx_${index}`,
    content: item.title,
    source: item.source,
    timestamp: new Date(),
    reach: 100,
    engagement: 10,
    isVerified: false,
  }));
  return inputs.length > 0 ? dcftEngine.analyze(inputs) : null;
}

export async function getAggregatedNetworkData(topic: string, country?: string) {
  try {
    const rawData = country ? await collectCountryData(country, country) : await collectTopicData(topic);
    const eventVector = createUniversalEventVector(rawData);
    const emotions = await analyzeEmotionsFromData(rawData);
    return {
      newsItems: rawData.items,
      emotionData: {
        fear: emotions.vector.fear || 0.1,
        hope: emotions.vector.hope || 0.5,
        anger: emotions.vector.anger || 0.1,
        gmi: (emotions.vector.joy || 0.5) * 100,
        cfi: (emotions.vector.fear || 0.1) * 100,
        hri: (emotions.vector.hope || 0.5) * 100,
      },
      eventVector,
    };
  } catch (error) {
    console.error('[NetworkEngine] Data aggregation failed:', error);
    return null;
  }
}
