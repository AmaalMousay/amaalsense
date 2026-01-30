/**
 * Hybrid DCFT-AI Analyzer
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module implements a hybrid analysis approach that combines:
 * - DCFT (Digital Consciousness Field Theory) as the PRIMARY analyzer (70%)
 * - AI/LLM as the ENHANCEMENT layer (30%)
 * 
 * The hybrid formula:
 * D_hybrid(t) = α × D_DCFT(t) + β × D_AI(t)
 * where α = 0.7 (DCFT weight) and β = 0.3 (AI weight)
 * 
 * This ensures that:
 * 1. DCFT theory remains the scientific foundation
 * 2. AI enhances accuracy for complex cases (sarcasm, context)
 * 3. The platform identity is "Built on DCFT Theory"
 */

import { AffectiveVector } from './dcft/affectiveVector';
import { dcftEngine, DCFTAnalysisResult } from './dcft';
import { analyzeTextsWithAI, SentimentAnalysisResult, BatchAnalysisResult } from './aiSentimentAnalyzer';

/**
 * Hybrid analysis configuration
 */
export const HYBRID_CONFIG = {
  // DCFT is the primary analyzer
  dcftWeight: 0.7,
  
  // AI is the enhancement layer
  aiWeight: 0.3,
  
  // Minimum confidence to use AI enhancement
  minConfidenceForAI: 0.5,
  
  // If AI fails, use DCFT only
  fallbackToDCFT: true,
  
  // Enable/disable AI enhancement
  enableAI: true,
};

/**
 * Hybrid analysis result
 */
export interface HybridAnalysisResult {
  // Final fused emotions
  emotions: AffectiveVector;
  
  // Global indices from DCFT
  indices: {
    gmi: number;  // Global Mood Index
    cfi: number;  // Collective Fear Index
    hri: number;  // Hope & Resilience Index
  };
  
  // DCFT specific results
  dcft: {
    amplitude: number;           // D(t) value
    resonanceIndices: Record<keyof AffectiveVector, number>;
    emotionalPhase: string;
    alertLevel: string;
    weight: number;              // Applied weight (0.7)
  };
  
  // AI specific results (if used)
  ai?: {
    emotions: AffectiveVector;
    confidence: number;
    weight: number;              // Applied weight (0.3)
    wasUsed: boolean;
  };
  
  // Fusion metadata
  fusion: {
    method: 'hybrid' | 'dcft_only' | 'ai_fallback';
    dcftContribution: number;    // Percentage
    aiContribution: number;      // Percentage
    confidence: number;
  };
  
  // Analysis metadata
  analyzedAt: Date;
  processingTimeMs: number;
}

/**
 * Normalize AI result to AffectiveVector format
 */
function normalizeAIToAV(aiResult: SentimentAnalysisResult): AffectiveVector {
  const av: AffectiveVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  // Map AI emotions to AffectiveVector
  if (aiResult.emotions) {
    // Direct mapping for matching emotions
    if ('joy' in aiResult.emotions) av.joy = aiResult.emotions.joy || 0;
    if ('fear' in aiResult.emotions) av.fear = aiResult.emotions.fear || 0;
    if ('anger' in aiResult.emotions) av.anger = aiResult.emotions.anger || 0;
    if ('sadness' in aiResult.emotions) av.sadness = aiResult.emotions.sadness || 0;
    if ('hope' in aiResult.emotions) av.hope = aiResult.emotions.hope || 0;
    if ('curiosity' in aiResult.emotions) av.curiosity = aiResult.emotions.curiosity || 0;
    
    // Map alternative names
    if ('happiness' in aiResult.emotions) av.joy = Math.max(av.joy, (aiResult.emotions as any).happiness || 0);
    if ('anxiety' in aiResult.emotions) av.fear = Math.max(av.fear, (aiResult.emotions as any).anxiety || 0);
    if ('frustration' in aiResult.emotions) av.anger = Math.max(av.anger, (aiResult.emotions as any).frustration || 0);
    if ('grief' in aiResult.emotions) av.sadness = Math.max(av.sadness, (aiResult.emotions as any).grief || 0);
    if ('optimism' in aiResult.emotions) av.hope = Math.max(av.hope, (aiResult.emotions as any).optimism || 0);
    if ('interest' in aiResult.emotions) av.curiosity = Math.max(av.curiosity, (aiResult.emotions as any).interest || 0);
  }

  // Normalize to -1 to +1 range
  const maxVal = Math.max(...Object.values(av).map(Math.abs), 0.01);
  (Object.keys(av) as (keyof AffectiveVector)[]).forEach(emotion => {
    av[emotion] = av[emotion] / maxVal;
  });

  return av;
}

/**
 * Fuse DCFT and AI results using weighted combination
 * D_hybrid = α × D_DCFT + β × D_AI
 */
function fuseEmotions(
  dcftEmotions: AffectiveVector,
  aiEmotions: AffectiveVector | null,
  dcftWeight: number,
  aiWeight: number
): AffectiveVector {
  const fused: AffectiveVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

  emotions.forEach(emotion => {
    if (aiEmotions) {
      // Hybrid fusion: D_hybrid = α × D_DCFT + β × D_AI
      fused[emotion] = (dcftWeight * dcftEmotions[emotion]) + (aiWeight * aiEmotions[emotion]);
    } else {
      // DCFT only
      fused[emotion] = dcftEmotions[emotion];
    }
  });

  // Normalize to ensure values stay in -1 to +1 range
  const maxVal = Math.max(...Object.values(fused).map(Math.abs), 0.01);
  if (maxVal > 1) {
    emotions.forEach(emotion => {
      fused[emotion] = fused[emotion] / maxVal;
    });
  }

  return fused;
}

/**
 * Main hybrid analysis function
 * Analyzes text using DCFT as primary (70%) and AI as enhancement (30%)
 */
export async function analyzeHybrid(
  text: string,
  source: 'news' | 'social' | 'user' = 'user',
  options: Partial<typeof HYBRID_CONFIG> = {}
): Promise<HybridAnalysisResult> {
  const startTime = Date.now();
  const config = { ...HYBRID_CONFIG, ...options };

  // Step 1: DCFT Analysis (PRIMARY - always runs)
  const dcftResult = await dcftEngine.analyzeText(text, source);

  // Convert DCFT emotions to AffectiveVector format
  const dcftAV: AffectiveVector = {
    joy: (dcftResult.emotions.joy / 50) - 1,
    fear: (dcftResult.emotions.fear / 50) - 1,
    anger: (dcftResult.emotions.anger / 50) - 1,
    sadness: (dcftResult.emotions.sadness / 50) - 1,
    hope: (dcftResult.emotions.hope / 50) - 1,
    curiosity: (dcftResult.emotions.curiosity / 50) - 1,
  };

  // Step 2: AI Analysis (ENHANCEMENT - optional)
  let aiEmotions: AffectiveVector | null = null;
  let aiConfidence = 0;
  let aiWasUsed = false;

  if (config.enableAI) {
    try {
      const aiResults = await analyzeTextsWithAI([text]);
      if (aiResults.isAIAnalyzed && aiResults.results.length > 0) {
        const aiResult = aiResults.results[0];
        aiEmotions = normalizeAIToAV(aiResult);
        aiConfidence = aiResult.confidence || 0.7;
        aiWasUsed = true;
      }
    } catch (error) {
      console.warn('[HybridAnalyzer] AI analysis failed, using DCFT only:', error);
      // Fallback to DCFT only
    }
  }

  // Step 3: Fusion
  // D_hybrid(t) = α × D_DCFT(t) + β × D_AI(t)
  const actualDcftWeight = aiWasUsed ? config.dcftWeight : 1.0;
  const actualAiWeight = aiWasUsed ? config.aiWeight : 0.0;

  const fusedEmotions = fuseEmotions(
    dcftAV,
    aiEmotions,
    actualDcftWeight,
    actualAiWeight
  );

  // Step 4: Calculate final indices using DCFT formulas
  // The indices are primarily from DCFT, enhanced by fused emotions
  const indices = {
    gmi: dcftResult.indices.gmi,
    cfi: dcftResult.indices.cfi,
    hri: dcftResult.indices.hri,
  };

  // Adjust indices based on fused emotions
  if (aiWasUsed) {
    // Slight adjustment based on AI contribution
    const positiveEmotions = fusedEmotions.joy + fusedEmotions.hope + fusedEmotions.curiosity;
    const negativeEmotions = fusedEmotions.fear + fusedEmotions.anger + fusedEmotions.sadness;
    
    // GMI adjustment
    indices.gmi = indices.gmi * config.dcftWeight + 
                  ((positiveEmotions - negativeEmotions) * 50 + 50) * config.aiWeight;
    
    // CFI adjustment (fear-based)
    indices.cfi = indices.cfi * config.dcftWeight + 
                  ((fusedEmotions.fear + fusedEmotions.anger * 0.5) * 100) * config.aiWeight;
    
    // HRI adjustment (hope-based)
    indices.hri = indices.hri * config.dcftWeight + 
                  ((fusedEmotions.hope + fusedEmotions.joy * 0.5) * 100) * config.aiWeight;

    // Clamp values
    indices.gmi = Math.max(-100, Math.min(100, indices.gmi));
    indices.cfi = Math.max(0, Math.min(100, indices.cfi));
    indices.hri = Math.max(0, Math.min(100, indices.hri));
  }

  const processingTimeMs = Date.now() - startTime;

  return {
    emotions: fusedEmotions,
    indices,
    dcft: {
      amplitude: dcftResult.dcfAmplitude,
      resonanceIndices: dcftResult.resonanceIndices,
      emotionalPhase: dcftResult.emotionalPhase?.type || 'neutral',
      alertLevel: dcftResult.alertLevel,
      weight: actualDcftWeight,
    },
    ai: aiWasUsed ? {
      emotions: aiEmotions!,
      confidence: aiConfidence,
      weight: actualAiWeight,
      wasUsed: true,
    } : undefined,
    fusion: {
      method: aiWasUsed ? 'hybrid' : 'dcft_only',
      dcftContribution: actualDcftWeight * 100,
      aiContribution: actualAiWeight * 100,
      confidence: aiWasUsed 
        ? (dcftResult.confidence * actualDcftWeight + aiConfidence * actualAiWeight)
        : dcftResult.confidence,
    },
    analyzedAt: new Date(),
    processingTimeMs,
  };
}

/**
 * Analyze multiple texts with hybrid approach
 */
export async function analyzeTextsHybrid(
  texts: string[],
  source: 'news' | 'social' | 'user' = 'user',
  options: Partial<typeof HYBRID_CONFIG> = {}
): Promise<{
  results: HybridAnalysisResult[];
  aggregated: HybridAnalysisResult;
}> {
  const results = await Promise.all(
    texts.map(text => analyzeHybrid(text, source, options))
  );

  // Aggregate results
  const aggregatedEmotions: AffectiveVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  const aggregatedIndices = { gmi: 0, cfi: 0, hri: 0 };
  let totalDcftContribution = 0;
  let totalAiContribution = 0;

  results.forEach(result => {
    (Object.keys(aggregatedEmotions) as (keyof AffectiveVector)[]).forEach(emotion => {
      aggregatedEmotions[emotion] += result.emotions[emotion];
    });
    aggregatedIndices.gmi += result.indices.gmi;
    aggregatedIndices.cfi += result.indices.cfi;
    aggregatedIndices.hri += result.indices.hri;
    totalDcftContribution += result.fusion.dcftContribution;
    totalAiContribution += result.fusion.aiContribution;
  });

  const count = results.length || 1;
  (Object.keys(aggregatedEmotions) as (keyof AffectiveVector)[]).forEach(emotion => {
    aggregatedEmotions[emotion] /= count;
  });
  aggregatedIndices.gmi /= count;
  aggregatedIndices.cfi /= count;
  aggregatedIndices.hri /= count;

  const aggregated: HybridAnalysisResult = {
    emotions: aggregatedEmotions,
    indices: aggregatedIndices,
    dcft: {
      amplitude: results.reduce((sum, r) => sum + r.dcft.amplitude, 0) / count,
      resonanceIndices: results[0]?.dcft.resonanceIndices || {} as any,
      emotionalPhase: results[0]?.dcft.emotionalPhase || 'neutral' as string,
      alertLevel: results[0]?.dcft.alertLevel || 'normal',
      weight: HYBRID_CONFIG.dcftWeight,
    },
    fusion: {
      method: 'hybrid',
      dcftContribution: totalDcftContribution / count,
      aiContribution: totalAiContribution / count,
      confidence: results.reduce((sum, r) => sum + r.fusion.confidence, 0) / count,
    },
    analyzedAt: new Date(),
    processingTimeMs: results.reduce((sum, r) => sum + r.processingTimeMs, 0),
  };

  return { results, aggregated };
}

/**
 * Quick analysis using DCFT only (faster, no AI)
 */
export async function analyzeQuick(
  text: string,
  source: 'news' | 'social' | 'user' = 'user'
): Promise<HybridAnalysisResult> {
  return analyzeHybrid(text, source, { enableAI: false });
}

/**
 * Get current hybrid configuration
 */
export function getHybridConfig(): typeof HYBRID_CONFIG {
  return { ...HYBRID_CONFIG };
}

/**
 * Update hybrid configuration
 */
export function updateHybridConfig(updates: Partial<typeof HYBRID_CONFIG>): void {
  Object.assign(HYBRID_CONFIG, updates);
}
