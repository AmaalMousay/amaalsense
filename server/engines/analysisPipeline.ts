/**
 * Analysis Pipeline
 *
 * Pre-processing + parallel analysis branches + post-analysis interpretation.
 * This is the single orchestrator for all analysis logic that runs AFTER
 * data collection but BEFORE response generation.
 *
 * Pipeline flow:
 *   rawData
 *   → smartQueryBuilder (enhance search terms)
 *   → deduplicationEngine (remove duplicates)
 *   → layer2_attention (filter by priority)
 *   → layer3_encoding (encode text structure)
 *   → layer5_workingMemory (update session state)
 *   → parallel analysis branches (emotion, DCFT, RAG, graph, prediction)
 *   → causalInference (build cause-effect chains)
 */

import type { CollectedData, RawDataItem } from '../services/unifiedDataCollector';

import type { EventVector as ParallelSignalVector } from '../utils/graphPipeline';
import type { PredictionReport, EmotionalDataPoint } from './predictionEngine';
import type { DCFTAnalysisResult, RawDigitalInput } from '../dcft/dcftEngine';
import { buildCausalChain } from '../cognitiveArchitecture/causalInference';
import type { CausalChain } from '../cognitiveArchitecture/causalInference';

import { buildSmartQuery } from '../cognitiveArchitecture/smartQueryBuilder';
import { checkForDuplicates, registerAnalysis } from './deduplicationEngine';
import { filterSignals, getTopSignals } from '../cognitiveArchitecture/layer2_attention';
import { encode, quickEncode } from '../cognitiveArchitecture/layer3_encoding';
import { getWorkingMemory, addTurn } from '../cognitiveArchitecture/layer5_workingMemory';

import { graphPipeline } from '../utils/graphPipeline';
import { analyzeTextWithAI } from './emotionEngine';
import { dcftEngine } from '../dcft/dcftEngine';
import { buildRAGContext, formatRAGForPrompt } from '../knowledge/ragSystem';
import { generatePredictionReport } from './predictionEngine';
import { getCumulativeInsight } from './learningStore';
import { getCountryHistoricalIndices, getEmotionIndicesHistory } from '../_core/db';


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PreProcessedData {
  query: string;
  smartQuery: any;
  rawData: CollectedData;
  itemCount: number;
  topSignals: any[];
  encoded: any;
}

export interface AnalysisBranchesResult {
  emotions: { vector: Record<string, number>; dominantEmotion: string };
  dcftResult: DCFTAnalysisResult | null;
  ragContext: any;
  parallelSignalVector: ParallelSignalVector | undefined;
  predictionReport: PredictionReport | null;
  resonanceInsight: any;
  knowledgeContext: string;
  causalChains: CausalChain[];
  workingMemory: any;
}

// ---------------------------------------------------------------------------
// Stage 1: Pre-processing
// ---------------------------------------------------------------------------

/**
 * Enhance the raw data collection with smart queries, deduplication,
 * attention filtering, and text encoding.
 */
export async function preProcessData(
  rawData: CollectedData,
  effectiveQuestion: string,
  conversationId: string,
  topicKey: string,
  countryCode: string,
): Promise<PreProcessedData> {
  // 1. Build smart query for better search
  const smartQuery = await buildSmartQuery(effectiveQuestion);

  // 2. Deduplicate items
  const deduped = deduplicateItems(rawData.items);

  // 3. Convert to raw signals for attention layer
  const signals: import('../cognitiveArchitecture/layer2_attention').RawSignal[] = deduped.map((item, i) => ({
    id: `sig_${i}`,
    content: `${item.title} ${item.description || ''}`.trim(),
    source: item.source,
    timestamp: item.publishedAt || new Date(),
    credibility: item.trustScore ?? 50,
    reach: item.intensity ?? 50,
    engagement: 50,
    metadata: { platform: item.platform, url: item.url, topic: item.topic },
  }));

  // 4. Filter by attention layer
  const filteredSignals = filterSignals(signals, { minScore: 0.3, limit: 50 });
  const topSignals = getTopSignals(filteredSignals, 20);

  // 5. Encode a summary of the data
  const combinedText = topSignals.map((s) => s.content).join(' ');
  const encoded = quickEncode(combinedText);

  // 6. Update working memory
  const memory = getWorkingMemory(conversationId);
  addTurn(conversationId, 'user', effectiveQuestion);

  return { query: effectiveQuestion, smartQuery, rawData: { ...rawData, items: deduped }, itemCount: deduped.length, topSignals, encoded };
}

function deduplicateItems(items: RawDataItem[]): RawDataItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title}|${item.source}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Stage 2: Parallel Analysis
// ---------------------------------------------------------------------------

function isPredictionQuestion(question: string): boolean {
  return /\b(predict|prediction|forecast|future|next|will|scenario|outlook)\b/i.test(question);
}

async function buildPredictionContext(
  question: string,
  detectedCountry: { code: string; name: string },
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
      .filter((p) => Number.isFinite(p.timestamp));
    if (points.length < 3) return null;
    return generatePredictionReport(detectedCountry.code, detectedCountry.name, points, false);
  } catch (error) {
    console.warn('[AnalysisPipeline] Prediction branch failed:', error);
    return null;
  }
}

async function analyzeEmotionsFromData(data: CollectedData) {
  const text = data.items.map((item) => item.title).join(' ');
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

// ---------------------------------------------------------------------------
// Stage 3: Post-analysis interpretation (causal inference)
// ---------------------------------------------------------------------------

function buildCausalInterpretation(
  dcftResult: DCFTAnalysisResult | null,
  rawData: CollectedData,
  topicKey: string,
): CausalChain[] {
  try {
    const events = rawData.items.slice(0, 15).map((item) => ({
      id: item.id || `evt_${Date.now()}`,
      event: item.title,
      description: item.description,
      timestamp: new Date(item.publishedAt || Date.now()).getTime(),
      source: item.source,
      domain: item.topic || 'general',
      polarity: 0,
      intensity: item.intensity ?? 0.5,
    }));
    if (events.length < 2) return [];
    const chain = buildCausalChain(events, topicKey);
    return chain ? [chain] : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export async function runAnalysisBranches(
  rawData: CollectedData,
  effectiveQuestion: string,
  graphInput: string,
  topicKey: string,
  detectedCountry: { code: string; name: string },
  conversationId = 'system',
): Promise<AnalysisBranchesResult> {
  // Pre-process
  const pre = await preProcessData(rawData, effectiveQuestion, conversationId, topicKey, detectedCountry.code);
  const resonanceInsight = getCumulativeInsight(topicKey);

  // Parallel analysis
  const [emotions, dcftResult, ragContext, parallelSignalVector, predictionReport] = await Promise.all([
    analyzeEmotionsFromData(pre.rawData),
    executeDCFTProcess(pre.rawData),
    buildRAGContext(effectiveQuestion),
    graphPipeline(graphInput),
    buildPredictionContext(effectiveQuestion, detectedCountry),
  ]);

  // Register deduplication for this analysis
  if (dcftResult?.indices) {
    registerAnalysis(topicKey, detectedCountry.code, {
      gmi: dcftResult.indices.gmi,
      cfi: dcftResult.indices.cfi,
      hri: dcftResult.indices.hri,
      aci: 50,
      sdi: 50,
    });
  }

  // Causal inference
  const causalChains = buildCausalInterpretation(dcftResult, pre.rawData, topicKey);

  const knowledgeContext = formatRAGForPrompt(ragContext);

  // Get working memory
  const memory = getWorkingMemory(conversationId);

  return {
    emotions,
    dcftResult,
    ragContext,
    parallelSignalVector,
    predictionReport,
    resonanceInsight,
    knowledgeContext,
    causalChains,
    workingMemory: memory,
  };
}