/**
 * Analysis Pipeline
 *
 * Runs the independent analysis branches in parallel after data collection.
 * Extracted from networkEngine.ts to separate the parallel-execution concern.
 */

import type { CollectedData } from '../services/unifiedDataCollector';
import type { QuantumEventVector } from './eventVectorEngine';
import type { EventVector as ParallelSignalVector } from '../utils/graphPipeline';
import type { PredictionReport, EmotionalDataPoint } from './predictionEngine';
import type { DCFTAnalysisResult, RawDigitalInput } from '../dcft/dcftEngine';

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

export interface AnalysisBranchesResult {
  emotions: { vector: Record<string, number>; dominantEmotion: string };
  dcftResult: DCFTAnalysisResult | null;
  ragContext: any;
  parallelSignalVector: ParallelSignalVector | undefined;
  predictionReport: PredictionReport | null;
  resonanceInsight: any;
  knowledgeContext: string;
}

// ---------------------------------------------------------------------------
// Helpers
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
// Main entry
// ---------------------------------------------------------------------------

export async function runAnalysisBranches(
  rawData: CollectedData,
  effectiveQuestion: string,
  graphInput: string,
  topicKey: string,
  detectedCountry: { code: string; name: string },
): Promise<AnalysisBranchesResult> {
  const resonanceInsight = getCumulativeInsight(topicKey);

  const [emotions, dcftResult, ragContext, parallelSignalVector, predictionReport] = await Promise.all([
    analyzeEmotionsFromData(rawData),
    executeDCFTProcess(rawData),
    buildRAGContext(effectiveQuestion),
    graphPipeline(graphInput),
    buildPredictionContext(effectiveQuestion, detectedCountry),
  ]);

  const knowledgeContext = formatRAGForPrompt(ragContext);

  return { emotions, dcftResult, ragContext, parallelSignalVector, predictionReport, resonanceInsight, knowledgeContext };
}