/**
 * AMALSENSE NETWORK ENGINE
 * 
 * The SINGLE unified engine for ALL analysis in AmalSense.
 * Replaces the old sequential 24-layer pipeline with a NETWORK topology
 * where layers execute in parallel groups.
 * 
 * Architecture (Network, NOT sequential):
 * 
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │                    GATE NETWORK (Layer 1)                          │
 *  │  Question Understanding → Intent Classification → Route Decision  │
 *  └──────────────────────────┬──────────────────────────────────────────┘
 *                             │
 *  ┌──────────────────────────▼──────────────────────────────────────────┐
 *  │              COLLECTION NETWORK (Layers 2-4) [PARALLEL]            │
 *  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐            │
 *  │  │ News Fetch   │  │ Social Fetch │  │ RSS Fetch      │            │
 *  │  │ (GNews+News) │  │ (Reddit+etc) │  │ (Google RSS)   │            │
 *  │  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘            │
 *  │         └─────────────────┼──────────────────┘                     │
 *  │                    ┌──────▼──────┐                                  │
 *  │                    │ Event Vector │ ← Compress ~15K → ~500 tokens  │
 *  │                    │ Engine       │                                  │
 *  │                    └──────┬──────┘                                  │
 *  └───────────────────────────┼─────────────────────────────────────────┘
 *                              │
 *  ┌───────────────────────────▼─────────────────────────────────────────┐
 *  │              ANALYSIS NETWORK (Layers 5-10) [PARALLEL]             │
 *  │  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐          │
 *  │  │ Emotion      │  │ Breaking News │  │ Confidence     │          │
 *  │  │ Analysis     │  │ Detection     │  │ Scoring        │          │
 *  │  └──────┬───────┘  └───────┬───────┘  └───────┬────────┘          │
 *  │         └──────────────────┼──────────────────┘                    │
 *  │                     ┌──────▼──────┐                                 │
 *  │                     │ Merge Node  │                                 │
 *  │                     └──────┬──────┘                                 │
 *  └────────────────────────────┼────────────────────────────────────────┘
 *                               │
 *  ┌────────────────────────────▼────────────────────────────────────────┐
 *  │            GENERATION NETWORK (Layers 11-18) [NETWORK]             │
 *  │  ┌──────────────────┐                                               │
 *  │  │ Response Gen (LLM)│──┐                                           │
 *  │  └──────────────────┘  │  ┌──────────────┐  ┌───────────────┐      │
 *  │                        ├──│ Personal Voice│──│ Language Check │      │
 *  │                        │  └──────────────┘  └───────┬───────┘      │
 *  │                        │                            │               │
 *  │  ┌──────────────────┐  │  ┌──────────────┐  ┌──────▼────────┐      │
 *  │  │ Suggestions Gen  │──┘  │ Quality Score │──│ Final Output  │      │
 *  │  └──────────────────┘     └──────────────┘  └───────────────┘      │
 *  └─────────────────────────────────────────────────────────────────────┘
 * 
 * KEY IMPROVEMENTS over old pipeline:
 * 1. PARALLEL execution: Layers in same group run simultaneously
 * 2. EVENT VECTOR: Raw data compressed before LLM (saves ~97% tokens)
 * 3. UNIFIED: One engine for ALL views (Map, Weather, Country, Smart)
 * 4. NETWORK: Layers connect as a graph, not a line
 * 5. SMART ROUTING: Gate decides which layers to activate per request
 */

import { layer1QuestionUnderstanding, type Layer1Output, type AnalysisType } from './layer1QuestionUnderstanding';
import { collectCountryData, collectTopicData, getCacheStats as getCollectorCacheStats, clearCache as clearCollectorCache, type CollectedData } from './unifiedDataCollector';
import { createEventVector, eventVectorToPrompt, vectorToMapIndices, type EventVector } from './eventVectorEngine';
import { smartChat, smartJsonChat, smartInvokeLLM, type TaskType } from './smartLLM';
import { analyzeEmotions, analyzeTopics as analyzeTextTopics } from './realTextAnalyzer';
import { calculateConfidenceScore, type ConfidenceScore } from './confidenceScorer';
import { applyEmotionBias, getEngineWeights, getLearningSummary, runLearningCycle, evaluatePrediction } from './engines/learningLoop';
import { storeAnalysisRecord, type AnalysisRecord } from './engines/learningStore';

// ============================================================
// TYPES
// ============================================================

/** Execution trace for a single layer */
interface LayerTrace {
  name: string;
  group: 'gate' | 'collection' | 'analysis' | 'generation';
  startTime: number;
  endTime: number;
  durationMs: number;
  status: 'success' | 'skipped' | 'error';
  error?: string;
}

/** Full network execution context */
export interface NetworkContext {
  // Request metadata
  requestId: string;
  userId: string;
  timestamp: Date;
  language: string;

  // Gate Network output
  gate: {
    layer1Output: Layer1Output;
    intent: 'sentiment' | 'factual' | 'country' | 'topic' | 'comparison' | 'prediction' | 'direct';
    needsAnalysis: boolean;
    needsLLM: boolean;
    detectedCountry?: { code: string; name: string } | undefined;
    searchQuery: string;
  };

  // Collection Network output
  collection: {
    rawData: CollectedData;
    eventVector: EventVector;
    vectorPrompt: string;
    sourceCount: number;
    totalItems: number;
  };

  // Analysis Network output
  analysis: {
    emotions: Record<string, number>;
    dominantEmotion: string;
    breakingNews: Array<{ headline: string; source: string; impactScore: number }>;
    confidence: ConfidenceScore;
    textTopics: string[];
  };

  // Generation Network output
  generation: {
    response: string;
    personalVoice: {
      tone: string;
      adaptedResponse: string;
    };
    languageEnforced: {
      finalResponse: string;
      translated: boolean;
    };
    suggestions: string[];
    quality: {
      score: number;
      relevance: number;
      accuracy: number;
      completeness: number;
      clarity: number;
    };
  };

  // Analytics
  analytics: {
    totalDurationMs: number;
    layerTraces: LayerTrace[];
    parallelGroups: number;
    errors: string[];
  };

  status: 'completed' | 'error';
}

// ============================================================
// RESULT TYPES (for view formatting)
// ============================================================

export interface MapResult {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  isRealData: boolean;
  confidence: number;
}

export interface WeatherResult {
  countryCode: string;
  countryName: string;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  polarity: number;
  intensity: number;
  categories: EventVector['categories'];
  dominantCategory: string;
  trendingKeywords: string[];
  topHeadlines: EventVector['topHeadlines'];
  gmi: number;
  cfi: number;
  hri: number;
  sourceCount: number;
  totalItems: number;
  isRealData: boolean;
}

export interface CountryDetailResult {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  categories: EventVector['categories'];
  dominantCategory: string;
  polarity: number;
  intensity: number;
  news: {
    political: Array<{ title: string; source: string; sentiment: string }>;
    economic: Array<{ title: string; source: string; sentiment: string }>;
    social: Array<{ title: string; source: string; sentiment: string }>;
    conflict: Array<{ title: string; source: string; sentiment: string }>;
  };
  trendingKeywords: string[];
  sourceCount: number;
  totalItems: number;
  isRealData: boolean;
  aiSummary?: string;
  breakingNews: Array<{ headline: string; source: string; impactScore: number }>;
  confidence: number;
  suggestions: string[];
}

export interface SmartAnalysisResult {
  query: string;
  response: string;
  confidence: number;
  emotions: EventVector['emotions'];
  dominantEmotion: string;
  gmi: number;
  cfi: number;
  hri: number;
  categories: EventVector['categories'];
  trendingKeywords: string[];
  sourceCount: number;
  totalItems: number;
  topHeadlines: EventVector['topHeadlines'];
  isRealData: boolean;
  suggestions: string[];
  breakingNews: Array<{ headline: string; source: string; impactScore: number }>;
  quality: { score: number; relevance: number; accuracy: number; completeness: number; clarity: number };
  layerTraces: LayerTrace[];
}

// ============================================================
// NETWORK CACHE
// ============================================================

interface NetworkCacheEntry {
  context: NetworkContext;
  expiresAt: number;
}

const networkCache = new Map<string, NetworkCacheEntry>();
const NETWORK_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCacheKey(type: string, key: string): string {
  return `net:${type}:${key.toLowerCase().trim()}`;
}

// ============================================================
// LAYER EXECUTION HELPERS
// ============================================================

function traceLayer(name: string, group: LayerTrace['group'], startTime: number, status: LayerTrace['status'], error?: string): LayerTrace {
  const endTime = Date.now();
  return {
    name,
    group,
    startTime,
    endTime,
    durationMs: endTime - startTime,
    status,
    error,
  };
}

/**
 * Run multiple async functions in parallel, collecting results and traces
 */
async function runParallel<T>(
  tasks: Array<{ name: string; group: LayerTrace['group']; fn: () => Promise<T> }>,
): Promise<{ results: (T | null)[]; traces: LayerTrace[] }> {
  const startTimes = tasks.map(() => Date.now());
  const settled = await Promise.allSettled(tasks.map(t => t.fn()));
  
  const results: (T | null)[] = [];
  const traces: LayerTrace[] = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const result = settled[i];
    if (result.status === 'fulfilled') {
      results.push(result.value);
      traces.push(traceLayer(tasks[i].name, tasks[i].group, startTimes[i], 'success'));
    } else {
      results.push(null);
      const errMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      traces.push(traceLayer(tasks[i].name, tasks[i].group, startTimes[i], 'error', errMsg));
    }
  }
  
  return { results, traces };
}

// ============================================================
// GATE NETWORK (Layer 1)
// ============================================================

async function executeGateNetwork(
  question: string,
  language: string,
): Promise<{ gate: NetworkContext['gate']; traces: LayerTrace[] }> {
  const start = Date.now();
  const traces: LayerTrace[] = [];
  
  // Layer 1: Question Understanding (uses LLM)
  let layer1Output: Layer1Output;
  try {
    layer1Output = await layer1QuestionUnderstanding(question, language);
    traces.push(traceLayer('L1: Question Understanding', 'gate', start, 'success'));
  } catch (error) {
    traces.push(traceLayer('L1: Question Understanding', 'gate', start, 'error', (error as Error).message));
    // Fallback: basic parsing
    layer1Output = {
      originalQuestion: question,
      language,
      questionType: 'sentiment',
      entities: { topics: [question], people: [], locations: [], organizations: [] },
      hasFactualError: false,
      clarificationNeeded: false,
      confidence: 50,
      isComparative: false,
      isOpinionBased: false,
      readyForAnalysis: true,
    };
  }
  
  // Determine intent from Layer 1 output
  const intent = classifyIntent(layer1Output);
  const detectedCountry = detectCountryInQuery(question) || undefined;
  const searchQuery = layer1Output.entities?.topics?.join(' ') || question;
  
  // Smart routing: determine what networks to activate
  const needsAnalysis = ['sentiment', 'country', 'topic', 'comparison', 'prediction'].includes(intent);
  const needsLLM = layer1Output.suggestedAnalysisType !== 'direct_answer';
  
  return {
    gate: {
      layer1Output,
      intent,
      needsAnalysis,
      needsLLM,
      detectedCountry,
      searchQuery,
    },
    traces,
  };
}

function classifyIntent(layer1: Layer1Output): NetworkContext['gate']['intent'] {
  if (layer1.geographicContext || layer1.entities?.locations?.length > 0) return 'country';
  if (layer1.questionType === 'sentiment') return 'sentiment';
  if (layer1.questionType === 'comparison') return 'comparison';
  if (layer1.questionType === 'prediction') return 'prediction';
  if (layer1.questionType === 'factual') return 'factual';
  if (layer1.questionType === 'trend') return 'topic';
  return 'topic';
}

// ============================================================
// COLLECTION NETWORK (Layers 2-4) - PARALLEL
// ============================================================

async function executeCollectionNetwork(
  query: string,
  countryCode?: string,
  countryName?: string,
): Promise<{ collection: NetworkContext['collection']; traces: LayerTrace[] }> {
  const start = Date.now();
  
  // Single unified data collection (already handles parallelism internally)
  let rawData: CollectedData;
  if (countryCode && countryName) {
    rawData = await collectCountryData(countryCode, countryName);
  } else {
    rawData = await collectTopicData(query);
  }
  
  const collectionTrace = traceLayer('L2-4: Unified Data Collection', 'collection', start, 'success');
  
  // Event Vector compression
  const evStart = Date.now();
  const eventVector = createEventVector(rawData);
  const vectorPrompt = eventVectorToPrompt(eventVector, 'en');
  const evTrace = traceLayer('L5: Event Vector Compression', 'collection', evStart, 'success');
  
  return {
    collection: {
      rawData,
      eventVector,
      vectorPrompt,
      sourceCount: Object.keys(eventVector.sourceBreakdown).length,
      totalItems: eventVector.totalItems,
    },
    traces: [collectionTrace, evTrace],
  };
}

// ============================================================
// ANALYSIS NETWORK (Layers 6-10) - PARALLEL
// ============================================================

async function executeAnalysisNetwork(
  collection: NetworkContext['collection'],
  gate: NetworkContext['gate'],
): Promise<{ analysis: NetworkContext['analysis']; traces: LayerTrace[] }> {
  
  // Run 3 analysis layers IN PARALLEL
  // Run analysis layers in parallel
  const emotionStart = Date.now();
  const breakingStart = Date.now();
  const confStart = Date.now();
  
  const [emotionResult, breakingResult, confidenceResult] = await Promise.all([
    // L6: Emotion Analysis
    (async () => {
      const allText = collection.rawData.items
        .map(item => item.title + ' ' + (item.description || ''))
        .join(' ');
      if (allText.trim().length === 0) {
        return { emotions: { neutral: 0.5 } as Record<string, number>, dominantEmotion: 'neutral', topics: [] as string[] };
      }
      const emotions = analyzeEmotions(allText);
      const topics = analyzeTextTopics(allText);
      const dominantEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
      return { emotions, dominantEmotion, topics };
    })().catch(() => ({ emotions: { neutral: 0.5 } as Record<string, number>, dominantEmotion: 'neutral', topics: [] as string[] })),
    
    // L7: Breaking News Detection
    (async () => {
      return collection.eventVector.topHeadlines
        .filter(h => h.category === 'political' || h.category === 'conflict')
        .slice(0, 5)
        .map(h => ({
          headline: h.title,
          source: h.source,
          impactScore: h.sentiment === 'negative' ? 0.8 : h.sentiment === 'positive' ? 0.4 : 0.6,
        }));
    })().catch(() => [] as Array<{ headline: string; source: string; impactScore: number }>),
    
    // L8: Confidence Scoring
    (async () => {
      const dataQuality = Math.min(100, collection.totalItems * 5);
      const modelCertainty = gate.layer1Output.confidence || 70;
      const sourceReliability = collection.sourceCount > 3 ? 85 : collection.sourceCount > 1 ? 70 : 50;
      return calculateConfidenceScore(dataQuality, modelCertainty, sourceReliability, 80);
    })().catch(() => calculateConfidenceScore(50, 50, 50, 50)),
  ]);
  
  const traces: LayerTrace[] = [
    traceLayer('L6: Emotion Analysis', 'analysis', emotionStart, 'success'),
    traceLayer('L7: Breaking News Detection', 'analysis', breakingStart, 'success'),
    traceLayer('L8: Confidence Scoring', 'analysis', confStart, 'success'),
  ];
  
  return {
    analysis: {
      emotions: emotionResult.emotions,
      dominantEmotion: emotionResult.dominantEmotion,
      breakingNews: breakingResult,
      confidence: confidenceResult,
      textTopics: emotionResult.topics,
    },
    traces,
  };
}

// ============================================================
// GENERATION NETWORK (Layers 11-18) - NETWORK TOPOLOGY
// ============================================================

async function executeGenerationNetwork(
  question: string,
  language: string,
  collection: NetworkContext['collection'],
  analysis: NetworkContext['analysis'],
  gate: NetworkContext['gate'],
): Promise<{ generation: NetworkContext['generation']; traces: LayerTrace[] }> {
  const traces: LayerTrace[] = [];
  
  // ---- STAGE 1: Response Generation + Suggestions (PARALLEL) ----
  const responseStart = Date.now();
  const suggestStart = Date.now();
  
  const [responseResult, suggestionsResult] = await Promise.all([
    // L11: Response Generation (LLM)
    (async (): Promise<string> => {
      if (!gate.needsLLM) {
        return 'Direct answer mode - no LLM needed';
      }
      
      const systemPrompt = language === 'ar'
        ? `أنت "أمل" - محلل مشاعر جماعية ذكي. أجب عن سؤال المستخدم بناءً على البيانات المضغوطة.

قواعد:
1. أجب بالعربية
2. كن محدداً واذكر أسباب من العناوين الحقيقية
3. اذكر المؤشرات (GMI/CFI/HRI) عند الحاجة
4. قدم تحليلاً عميقاً
5. لا تكرر نفس الجمل

البيانات المضغوطة:
${collection.vectorPrompt}`
        : `You are "Amal" - an intelligent collective emotion analyzer. Answer based on compressed data.

Rules:
1. Answer in English
2. Be specific, cite real headlines
3. Mention indices (GMI/CFI/HRI) when relevant
4. Provide deep analysis
5. Don't repeat phrases

Compressed Data:
${collection.vectorPrompt}`;
      
      return await smartChat(systemPrompt, question, 'response_generation');
    })().catch(() => ''),
    
    // L12: Suggestion Generation
    (async (): Promise<string[]> => {
      try {
        const suggestionsPrompt = language === 'ar'
          ? `بناءً على السؤال "${question}" والعاطفة السائدة "${analysis.dominantEmotion}"، اقترح 3 أسئلة متابعة ذكية بالعربية. أجب بـ JSON array فقط.`
          : `Based on the question "${question}" and dominant emotion "${analysis.dominantEmotion}", suggest 3 smart follow-up questions. Reply with JSON array only.`;
        
        const result = await smartChat(
          'You generate follow-up question suggestions. Reply with a JSON array of 3 strings only.',
          suggestionsPrompt,
          'suggestions'
        );
        
        try {
          const parsed = JSON.parse(result);
          return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
        } catch {
          return [];
        }
      } catch {
        return [];
      }
    })(),
  ]);
  
  traces.push(
    traceLayer('L11: Response Generation', 'generation', responseStart, responseResult ? 'success' : 'error'),
    traceLayer('L12: Suggestion Generation', 'generation', suggestStart, 'success'),
  );
  
  const rawResponse = responseResult || '';
  const suggestions = suggestionsResult || [];
  
  // ---- STAGE 2: Personal Voice + Language Enforcement (PARALLEL, depends on Stage 1) ----
  const stage2Start = Date.now();
  
  // Personal Voice adaptation (no LLM needed - rule-based)
  const emotionDetected = analysis.dominantEmotion;
  const tone = emotionDetected === 'sadness' ? 'empathetic' 
    : emotionDetected === 'anger' ? 'calm'
    : emotionDetected === 'fear' ? 'reassuring'
    : emotionDetected === 'joy' ? 'enthusiastic'
    : 'professional';
  const adaptedResponse = rawResponse; // Voice adaptation is tone-based, response stays same
  traces.push(traceLayer('L13: Personal Voice', 'generation', stage2Start, 'success'));
  
  // Language enforcement
  const langStart = Date.now();
  let finalResponse = adaptedResponse;
  let translated = false;
  
  const isResponseArabic = /[\u0600-\u06FF]/.test(adaptedResponse);
  const shouldTranslate = (language === 'ar' && !isResponseArabic) || (language === 'en' && isResponseArabic);
  
  if (shouldTranslate && adaptedResponse.length > 0) {
    try {
      const translationResult = await smartInvokeLLM({
        messages: [
          { role: 'system', content: `Translate to ${language === 'ar' ? 'Arabic' : 'English'}. Keep meaning and tone.` },
          { role: 'user', content: adaptedResponse },
        ],
      }, 'translation');
      const content = translationResult.choices[0].message.content;
      finalResponse = typeof content === 'string' ? content : adaptedResponse;
      translated = true;
    } catch {
      finalResponse = adaptedResponse;
    }
  }
  traces.push(traceLayer('L14: Language Enforcement', 'generation', langStart, translated ? 'success' : 'skipped'));
  
  // ---- STAGE 3: Quality Assessment (depends on final response) ----
  const qualStart = Date.now();
  const responseLength = finalResponse.length;
  const hasSources = collection.totalItems > 0;
  const hasEmotionContext = Object.keys(analysis.emotions).length > 1;
  
  const quality = {
    score: Math.min(100, Math.round(
      (responseLength > 200 ? 25 : responseLength > 50 ? 15 : 5) +
      (hasSources ? 25 : 0) +
      (hasEmotionContext ? 20 : 0) +
      (analysis.confidence.overall > 60 ? 20 : 10) +
      (suggestions.length > 0 ? 10 : 0)
    )),
    relevance: Math.min(100, Math.round(analysis.confidence.factors?.contextClarity || 70)),
    accuracy: Math.min(100, Math.round(analysis.confidence.factors?.dataQuality || 60)),
    completeness: Math.min(100, Math.round(
      (responseLength > 300 ? 40 : 20) + (hasSources ? 30 : 0) + (suggestions.length > 0 ? 30 : 0)
    )),
    clarity: Math.min(100, Math.round(
      (responseLength > 50 && responseLength < 2000 ? 40 : 20) + 
      (translated ? 30 : 40) + // Non-translated = already in right language
      20
    )),
  };
  traces.push(traceLayer('L15: Quality Assessment', 'generation', qualStart, 'success'));
  
  return {
    generation: {
      response: rawResponse,
      personalVoice: { tone, adaptedResponse },
      languageEnforced: { finalResponse, translated },
      suggestions,
      quality,
    },
    traces,
  };
}

// ============================================================
// MAIN ENGINE: Execute full network
// ============================================================

/**
 * Execute the full network engine for a question/topic
 */
export async function executeNetworkEngine(
  userId: string,
  question: string,
  language: string = 'ar',
): Promise<NetworkContext> {
  const startTime = Date.now();
  const requestId = `net_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const context: NetworkContext = {
    requestId,
    userId,
    timestamp: new Date(),
    language,
    gate: {} as NetworkContext['gate'],
    collection: {} as NetworkContext['collection'],
    analysis: {} as NetworkContext['analysis'],
    generation: {} as NetworkContext['generation'],
    analytics: { totalDurationMs: 0, layerTraces: [], parallelGroups: 4, errors: [] },
    status: 'completed',
  };
  
  try {
    // ====== GATE NETWORK (sequential - must run first) ======
    const gateResult = await executeGateNetwork(question, language);
    context.gate = gateResult.gate;
    context.analytics.layerTraces.push(...gateResult.traces);
    
    // ====== COLLECTION NETWORK (parallel internally) ======
    const collectionResult = await executeCollectionNetwork(
      context.gate.searchQuery,
      context.gate.detectedCountry?.code,
      context.gate.detectedCountry?.name,
    );
    context.collection = collectionResult.collection;
    context.analytics.layerTraces.push(...collectionResult.traces);
    
    // ====== ANALYSIS NETWORK (parallel layers) ======
    const analysisResult = await executeAnalysisNetwork(context.collection, context.gate);
    context.analysis = analysisResult.analysis;
    context.analytics.layerTraces.push(...analysisResult.traces);
    
    // ====== GENERATION NETWORK (network topology) ======
    if (context.gate.needsLLM) {
      const genResult = await executeGenerationNetwork(
        question, language, context.collection, context.analysis, context.gate,
      );
      context.generation = genResult.generation;
      context.analytics.layerTraces.push(...genResult.traces);
    } else {
      // Skip generation for simple queries
      context.generation = {
        response: '',
        personalVoice: { tone: 'professional', adaptedResponse: '' },
        languageEnforced: { finalResponse: '', translated: false },
        suggestions: [],
        quality: { score: 0, relevance: 0, accuracy: 0, completeness: 0, clarity: 0 },
      };
    }
    
    context.analytics.totalDurationMs = Date.now() - startTime;
    context.status = 'completed';
    
    // ====== LEARNING INTEGRATION: Record this analysis ======
    try {
      const vector = context.collection.eventVector;
      if (vector && vector.totalItems > 0) {
        const indices = vectorToMapIndices(vector);
        storeAnalysisRecord(
          // question
          {
            topic: context.gate.searchQuery || question,
            countryCode: context.gate.detectedCountry?.code || null,
            countryName: context.gate.detectedCountry?.name || null,
            userType: 'general',
            language,
            originalQuery: question,
          },
          // context
          {
            domain: context.gate.intent || 'general',
            eventType: vector.categories[0] || 'general',
            sensitivityLevel: 'normal',
            timeRange: 'current',
            sourcesUsed: Object.keys(vector.sourceBreakdown),
            sourceCount: vector.totalItems,
            dataQuality: Math.min(100, vector.totalItems * 10),
          },
          // result
          {
            gmi: indices.gmi,
            cfi: indices.cfi,
            hri: indices.hri,
            dominantEmotion: vector.dominantEmotion,
            emotionalIntensity: vector.emotions[vector.dominantEmotion] || 50,
            valence: (indices.hri - 50) / 50,
            affectiveVector: vector.emotions,
            confidence: context.analysis.confidence.overall,
            insights: vector.topHeadlines.slice(0, 3).map((h: any) => typeof h === 'string' ? h : h.title || String(h)),
            drivers: vector.trendingKeywords.slice(0, 5),
          },
          // engineContributions (weight values 0-1)
          {
            contextClassification: 0.20,
            emotionFusion: 0.25,
            emotionalDynamics: 0.20,
            driverDetection: 0.15,
            explainableInsight: 0.20,
          },
        );
      }
    } catch (learnErr) {
      // Learning is non-critical, don't fail the analysis
      console.warn('[NetworkEngine] Learning record failed:', (learnErr as Error).message);
    }
    
  } catch (error) {
    context.status = 'error';
    context.analytics.errors.push((error as Error).message);
    context.analytics.totalDurationMs = Date.now() - startTime;
  }
  
  return context;
}

// ============================================================
// VIEW FORMATTERS (same interface as before, now powered by NetworkEngine)
// ============================================================

/**
 * FORMAT FOR MAP: Returns indices and dominant emotion for map coloring
 */
export async function analyzeForMap(countryCode: string, countryName: string): Promise<MapResult> {
  const cacheKey = getCacheKey('map', countryCode);
  const cached = networkCache.get(cacheKey);
  
  if (cached && cached.expiresAt > Date.now()) {
    const v = cached.context.collection.eventVector;
    const indices = vectorToMapIndices(v);
    return {
      countryCode, countryName,
      gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
      dominantEmotion: indices.dominantEmotion,
      isRealData: indices.isRealData,
      confidence: v.totalItems > 5 ? 85 : v.totalItems > 0 ? 60 : 30,
    };
  }
  
  // Light execution: only Gate + Collection (no LLM needed for map)
  const rawData = await collectCountryData(countryCode, countryName);
  const vector = createEventVector(rawData);
  const indices = vectorToMapIndices(vector);
  
  return {
    countryCode, countryName,
    gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
    dominantEmotion: indices.dominantEmotion,
    isRealData: indices.isRealData,
    confidence: vector.totalItems > 5 ? 85 : vector.totalItems > 0 ? 60 : 30,
  };
}

/**
 * FORMAT FOR WEATHER: Returns detailed emotion breakdown
 */
export async function analyzeForWeather(countryCode: string, countryName: string): Promise<WeatherResult> {
  const rawData = await collectCountryData(countryCode, countryName);
  const vector = createEventVector(rawData);
  const indices = vectorToMapIndices(vector);
  
  return {
    countryCode, countryName,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    polarity: vector.polarity,
    intensity: vector.intensity,
    categories: vector.categories,
    dominantCategory: vector.dominantCategory,
    trendingKeywords: vector.trendingKeywords,
    topHeadlines: vector.topHeadlines,
    gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    isRealData: vector.totalItems > 0,
  };
}

/**
 * FORMAT FOR COUNTRY DETAIL: Full analysis with categorized news + AI summary
 */
export async function analyzeForCountryDetail(
  countryCode: string,
  countryName: string,
  includeAISummary: boolean = false,
  language: string = 'ar',
): Promise<CountryDetailResult> {
  // Full network execution for country detail
  const ctx = await executeNetworkEngine('system', `${countryName} news emotions`, language);
  const vector = ctx.collection.eventVector;
  const indices = vectorToMapIndices(vector);
  
  // Categorize news items
  const news: CountryDetailResult['news'] = { political: [], economic: [], social: [], conflict: [] };
  for (const headline of vector.topHeadlines) {
    const category = headline.category as keyof typeof news;
    if (category in news) {
      news[category].push({ title: headline.title, source: headline.source, sentiment: headline.sentiment });
    } else {
      news.social.push({ title: headline.title, source: headline.source, sentiment: headline.sentiment });
    }
  }
  
  // AI summary
  let aiSummary: string | undefined;
  if (includeAISummary && vector.totalItems > 0) {
    try {
      const vectorPrompt = eventVectorToPrompt(vector, language);
      const systemPrompt = language === 'ar'
        ? `أنت محلل مشاعر جماعية. قدم ملخصاً موجزاً (3-4 جمل) عن الحالة العاطفية في ${countryName} بناءً على البيانات. كن محدداً واذكر أسباب حقيقية.`
        : `You are a collective emotion analyst. Provide a brief summary (3-4 sentences) about the emotional state in ${countryName}. Be specific and cite real reasons.`;
      aiSummary = await smartChat(systemPrompt, vectorPrompt, 'emotion_analysis');
    } catch (error) {
      console.warn('[NetworkEngine] AI summary failed:', (error as Error).message);
    }
  }
  
  return {
    countryCode, countryName,
    gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    categories: vector.categories,
    dominantCategory: vector.dominantCategory,
    polarity: vector.polarity,
    intensity: vector.intensity,
    news,
    trendingKeywords: vector.trendingKeywords,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    isRealData: vector.totalItems > 0,
    aiSummary,
    breakingNews: ctx.analysis.breakingNews,
    confidence: ctx.analysis.confidence.overall,
    suggestions: ctx.generation.suggestions,
  };
}

/**
 * FORMAT FOR SMART ANALYSIS: Full AI-powered Q&A
 */
export async function analyzeForSmartAnalysis(
  query: string,
  language: string = 'ar',
): Promise<SmartAnalysisResult> {
  // Full network execution
  const ctx = await executeNetworkEngine('system', query, language);
  const vector = ctx.collection.eventVector;
  const indices = vectorToMapIndices(vector);
  
  return {
    query,
    response: ctx.generation.languageEnforced.finalResponse || ctx.generation.response,
    confidence: ctx.analysis.confidence.overall,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
    categories: vector.categories,
    trendingKeywords: vector.trendingKeywords,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
    totalItems: vector.totalItems,
    topHeadlines: vector.topHeadlines,
    isRealData: vector.totalItems > 0,
    suggestions: ctx.generation.suggestions,
    breakingNews: ctx.analysis.breakingNews,
    quality: ctx.generation.quality,
    layerTraces: ctx.analytics.layerTraces,
  };
}

/**
 * BATCH: Analyze multiple countries in parallel
 */
export async function analyzeCountriesBatch(
  countries: Array<{ code: string; name: string }>,
  batchSize: number = 4,
): Promise<MapResult[]> {
  const results: MapResult[] = [];
  
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(c => analyzeForMap(c.code, c.name))
    );
    
    for (let j = 0; j < batch.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          countryCode: batch[j].code, countryName: batch[j].name,
          gmi: 0, cfi: 50, hri: 50,
          dominantEmotion: 'neutral', isRealData: false, confidence: 0,
        });
      }
    }
  }
  
  return results;
}

/**
 * GLOBAL MOOD: Calculate from top world news
 */
export async function getGlobalMood(): Promise<{
  gmi: number; cfi: number; hri: number;
  dominantEmotion: string; confidence: number; sourceCount: number;
}> {
  const rawData = await collectTopicData('world news today');
  const vector = createEventVector(rawData);
  const indices = vectorToMapIndices(vector);
  
  return {
    gmi: indices.gmi, cfi: indices.cfi, hri: indices.hri,
    dominantEmotion: vector.dominantEmotion,
    confidence: vector.totalItems > 5 ? 85 : vector.totalItems > 0 ? 60 : 30,
    sourceCount: Object.keys(vector.sourceBreakdown).length,
  };
}

// ============================================================
// COUNTRY DETECTION
// ============================================================

const COUNTRY_PATTERNS: Array<{ pattern: RegExp; code: string; name: string }> = [
  { pattern: /\b(libya|ليبيا)\b/i, code: 'LY', name: 'Libya' },
  { pattern: /\b(egypt|مصر)\b/i, code: 'EG', name: 'Egypt' },
  { pattern: /\b(saudi|السعودية)\b/i, code: 'SA', name: 'Saudi Arabia' },
  { pattern: /\b(uae|الإمارات)\b/i, code: 'AE', name: 'UAE' },
  { pattern: /\b(usa|america|أمريكا|الولايات المتحدة)\b/i, code: 'US', name: 'United States' },
  { pattern: /\b(uk|britain|بريطانيا)\b/i, code: 'GB', name: 'United Kingdom' },
  { pattern: /\b(palestine|فلسطين)\b/i, code: 'PS', name: 'Palestine' },
  { pattern: /\b(syria|سوريا)\b/i, code: 'SY', name: 'Syria' },
  { pattern: /\b(iraq|العراق)\b/i, code: 'IQ', name: 'Iraq' },
  { pattern: /\b(sudan|السودان)\b/i, code: 'SD', name: 'Sudan' },
  { pattern: /\b(yemen|اليمن)\b/i, code: 'YE', name: 'Yemen' },
  { pattern: /\b(lebanon|لبنان)\b/i, code: 'LB', name: 'Lebanon' },
  { pattern: /\b(turkey|تركيا)\b/i, code: 'TR', name: 'Turkey' },
  { pattern: /\b(russia|روسيا)\b/i, code: 'RU', name: 'Russia' },
  { pattern: /\b(china|الصين)\b/i, code: 'CN', name: 'China' },
  { pattern: /\b(japan|اليابان)\b/i, code: 'JP', name: 'Japan' },
  { pattern: /\b(france|فرنسا)\b/i, code: 'FR', name: 'France' },
  { pattern: /\b(germany|ألمانيا)\b/i, code: 'DE', name: 'Germany' },
  { pattern: /\b(india|الهند)\b/i, code: 'IN', name: 'India' },
  { pattern: /\b(brazil|البرازيل)\b/i, code: 'BR', name: 'Brazil' },
  { pattern: /\b(morocco|المغرب)\b/i, code: 'MA', name: 'Morocco' },
  { pattern: /\b(tunisia|تونس)\b/i, code: 'TN', name: 'Tunisia' },
  { pattern: /\b(algeria|الجزائر)\b/i, code: 'DZ', name: 'Algeria' },
  { pattern: /\b(jordan|الأردن)\b/i, code: 'JO', name: 'Jordan' },
  { pattern: /\b(kuwait|الكويت)\b/i, code: 'KW', name: 'Kuwait' },
  { pattern: /\b(qatar|قطر)\b/i, code: 'QA', name: 'Qatar' },
  { pattern: /\b(bahrain|البحرين)\b/i, code: 'BH', name: 'Bahrain' },
  { pattern: /\b(oman|عمان)\b/i, code: 'OM', name: 'Oman' },
];

function detectCountryInQuery(query: string): { code: string; name: string } | null {
  for (const { pattern, code, name } of COUNTRY_PATTERNS) {
    if (pattern.test(query)) return { code, name };
  }
  return null;
}

// ============================================================
// ENGINE STATS & CACHE MANAGEMENT
// ============================================================

export function getEngineStats() {
  return {
    networkCacheSize: networkCache.size,
    dataCacheStats: getCollectorCacheStats(),
    learning: getLearningSummary(),
  };
}

/**
 * LEARNING: Run a learning cycle to improve future analyses
 */
export function runEngineLearningCycle() {
  return runLearningCycle();
}

/**
 * LEARNING: Evaluate a past prediction against actual outcome
 */
export function evaluateEnginePrediction(
  analysisId: string,
  predicted: { dominantEmotion: string; gmi: number; trend: 'up' | 'down' | 'stable' },
  actual: { dominantEmotion: string; gmi: number; trend: 'up' | 'down' | 'stable' },
) {
  return evaluatePrediction(analysisId, predicted, actual);
}

export function clearAllCaches() {
  networkCache.clear();
  clearCollectorCache();
}
