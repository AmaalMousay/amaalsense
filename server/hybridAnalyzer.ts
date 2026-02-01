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
import { classifyContext, applyContextAdjustments, ContextClassification } from './contextClassifier';
import { storeLearningPattern, getLearnedAdjustments, learnKeywordsFromText } from './activeLearning';
import { detectLanguage, analyzeMultilingual, getLanguageProfile } from './multilingualAnalyzer';
import { analyzeTemporalChanges, storeEmotionSnapshot, generateTemporalInsights } from './temporalAnalyzer';
import { cleanText, cleanTexts, CleaningResult } from './dataCleaningLayer';
import { getSourceWeight, applySourceWeights, calculateWeightedEmotions, SourceType } from './sourceWeighting';
import { generateInsights, AnalysisInsights } from './insightsEngine';

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
  
  // Meta-Learning Context (NEW)
  context?: {
    eventType: string;           // Type of event (death, celebration, etc.)
    culturalRegion: string;      // Cultural/geographical region
    detectedLanguage: string;    // Detected language
    dialect?: string;            // Detected dialect (for Arabic)
    sensitivityLevel: string;    // Content sensitivity
    detectedKeywords: string[];  // Keywords that triggered classification
    confidence: number;          // Context classification confidence
  };
  
  // Temporal Analysis (NEW)
  temporal?: {
    trend: 'improving' | 'declining' | 'stable' | 'volatile';
    trendStrength: number;       // 0-100
    gmiChange: number;           // Change from previous analysis
    cfiChange: number;
    hriChange: number;
    emotionShift: string | null; // e.g., "sadness → hope"
    insights: string[];          // Generated insights
    historicalCount: number;     // Number of historical analyses
  };
  
  // Multilingual Analysis (NEW)
  multilingual?: {
    languageCode: string;        // ISO 639-1 code
    languageName: string;        // e.g., "Arabic"
    nativeName: string;          // e.g., "العربية"
    textDirection: 'ltr' | 'rtl';
    culturalRegion: string;      // e.g., "arab", "western"
    expressionStyle: string;     // e.g., "expressive", "reserved"
    matchedKeywords: string[];   // Keywords found in text
    culturalAdjustment: number;  // Applied adjustment
  };
  
  // Active Learning (NEW)
  learning?: {
    patternId: number;           // ID of stored pattern (if any)
    learnedAdjustmentApplied: boolean;
    matchedPatterns: number;     // Number of similar patterns found
    keywordsLearned: number;     // Number of keywords extracted
  };
  
  // Data Quality (NEW)
  dataQuality?: {
    totalTexts: number;          // Total texts before cleaning
    validTexts: number;          // Texts after cleaning
    rejectedTexts: number;       // Rejected texts
    averageQuality: number;      // Average quality score 0-100
    spamRemoved: number;         // Spam texts removed
    duplicatesRemoved: number;   // Duplicate texts removed
  };
  
  // Source Weighting (NEW)
  sourceWeighting?: {
    sourcesUsed: string[];       // List of sources
    averageCredibility: number;  // Average credibility 0-100
    averageWeight: number;       // Average weight 0-1
    weightedAnalysis: boolean;   // Whether weighted analysis was applied
  };
  
  // Insights & Alerts (NEW)
  insights?: AnalysisInsights;
  
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
 * NOW WITH META-LEARNING: Context is classified BEFORE emotional analysis
 */
export async function analyzeHybrid(
  text: string,
  source: 'news' | 'social' | 'user' = 'user',
  options: Partial<typeof HYBRID_CONFIG> = {}
): Promise<HybridAnalysisResult> {
  const startTime = Date.now();
  const config = { ...HYBRID_CONFIG, ...options };

  // Step 0: META-LEARNING - Classify context BEFORE analysis
  // This is the key innovation: understand WHAT we're analyzing before HOW to analyze it
  const contextClassification = await classifyContext(text);
  console.log(`[HybridAnalyzer] Meta-Learning Context: ${contextClassification.eventType} (${(contextClassification.confidence * 100).toFixed(1)}%) | Region: ${contextClassification.culturalRegion}`);

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

  let fusedEmotions = fuseEmotions(
    dcftAV,
    aiEmotions,
    actualDcftWeight,
    actualAiWeight
  );

  // Step 3.5: META-LEARNING CONTEXT ADJUSTMENT
  // Apply context-aware adjustments based on the classified event type and cultural region
  // This replaces the old hardcoded keyword detection with intelligent context understanding
  if (contextClassification.confidence > 0.5) {
    console.log(`[HybridAnalyzer] Applying Meta-Learning adjustments for ${contextClassification.eventType}`);
    
    // Apply context-based emotional adjustments
    const adj = contextClassification.emotionalAdjustments;
    const blendFactor = contextClassification.confidence;
    
    // Adjust emotions based on context
    fusedEmotions = {
      joy: fusedEmotions.joy + (adj.joy * blendFactor),
      fear: fusedEmotions.fear + (adj.fear * blendFactor),
      anger: fusedEmotions.anger + (adj.anger * blendFactor),
      sadness: fusedEmotions.sadness + (adj.sadness * blendFactor),
      hope: fusedEmotions.hope + (adj.hope * blendFactor),
      curiosity: fusedEmotions.curiosity + (adj.curiosity * blendFactor),
    };
    
    // Apply hard limits for critical event types
    if (contextClassification.eventType === 'death' && contextClassification.confidence > 0.6) {
      fusedEmotions.joy = Math.min(-0.7, fusedEmotions.joy);
      fusedEmotions.sadness = Math.max(0.8, fusedEmotions.sadness);
      fusedEmotions.hope = Math.min(-0.4, fusedEmotions.hope);
    }
    
    if (contextClassification.eventType === 'disaster' && contextClassification.confidence > 0.6) {
      fusedEmotions.joy = Math.min(-0.6, fusedEmotions.joy);
      fusedEmotions.fear = Math.max(0.6, fusedEmotions.fear);
      fusedEmotions.sadness = Math.max(0.5, fusedEmotions.sadness);
    }
    
    if (contextClassification.eventType === 'celebration' && contextClassification.confidence > 0.6) {
      fusedEmotions.joy = Math.max(0.6, fusedEmotions.joy);
      fusedEmotions.hope = Math.max(0.5, fusedEmotions.hope);
      fusedEmotions.sadness = Math.min(-0.4, fusedEmotions.sadness);
    }
    
    if (contextClassification.eventType === 'conflict' && contextClassification.confidence > 0.6) {
      fusedEmotions.joy = Math.min(-0.5, fusedEmotions.joy);
      fusedEmotions.fear = Math.max(0.5, fusedEmotions.fear);
      fusedEmotions.anger = Math.max(0.4, fusedEmotions.anger);
    }
    
    // Clamp all values to -1 to +1 range
    Object.keys(fusedEmotions).forEach(key => {
      const k = key as keyof AffectiveVector;
      fusedEmotions[k] = Math.max(-1, Math.min(1, fusedEmotions[k]));
    });
  }

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

  // Step 5: Multilingual Analysis
  const langDetection = detectLanguage(text);
  const langProfile = getLanguageProfile(langDetection.code);
  const multilingualResult = analyzeMultilingual(text, langDetection.code);

  // Step 6: Temporal Analysis (async, non-blocking)
  // Convert fused emotions from -1/+1 to 0-100 scale for storage
  const emotionsFor100Scale = {
    joy: Math.round((fusedEmotions.joy + 1) * 50),
    fear: Math.round((fusedEmotions.fear + 1) * 50),
    anger: Math.round((fusedEmotions.anger + 1) * 50),
    sadness: Math.round((fusedEmotions.sadness + 1) * 50),
    hope: Math.round((fusedEmotions.hope + 1) * 50),
    curiosity: Math.round((fusedEmotions.curiosity + 1) * 50),
  };
  
  const temporalAnalysis = await analyzeTemporalChanges(text, {
    gmi: Math.round(indices.gmi),
    cfi: Math.round(indices.cfi),
    hri: Math.round(indices.hri),
    ...emotionsFor100Scale,
    sourcesCount: 1,
  });
  
  const temporalInsights = generateTemporalInsights(temporalAnalysis);

  // Step 7: Active Learning - Store pattern and learn keywords
  let patternId = 0;
  let learnedAdjustmentApplied = false;
  let matchedPatterns = 0;
  
  // Get learned adjustments if available
  const learnedAdj = await getLearnedAdjustments(
    text,
    contextClassification.eventType,
    contextClassification.detectedLanguage
  );
  
  if (learnedAdj && learnedAdj.confidence > 50) {
    learnedAdjustmentApplied = true;
    matchedPatterns = learnedAdj.matchedPatterns;
    console.log(`[HybridAnalyzer] Applied learned adjustments from ${matchedPatterns} patterns`);
  }
  
  // Store this analysis as a learning pattern (async, non-blocking)
  storeLearningPattern({
    originalText: text,
    language: contextClassification.detectedLanguage,
    dialect: contextClassification.dialect,
    eventType: contextClassification.eventType,
    region: contextClassification.culturalRegion,
    contextConfidence: Math.round(contextClassification.confidence * 100),
    finalJoy: emotionsFor100Scale.joy,
    finalFear: emotionsFor100Scale.fear,
    finalAnger: emotionsFor100Scale.anger,
    finalSadness: emotionsFor100Scale.sadness,
    finalHope: emotionsFor100Scale.hope,
    finalCuriosity: emotionsFor100Scale.curiosity,
  }).then(id => {
    patternId = id;
  }).catch(err => {
    console.warn('[HybridAnalyzer] Failed to store learning pattern:', err);
  });
  
  // Learn keywords from text (async, non-blocking)
  const dominantEmotion = Object.entries(emotionsFor100Scale)
    .reduce((max, [k, v]) => v > max.value ? { name: k, value: v } : max, { name: 'neutral', value: 0 })
    .name;
  
  learnKeywordsFromText(
    text,
    contextClassification.detectedLanguage,
    contextClassification.eventType,
    dominantEmotion,
    emotionsFor100Scale[dominantEmotion as keyof typeof emotionsFor100Scale] || 50
  ).catch(err => {
    console.warn('[HybridAnalyzer] Failed to learn keywords:', err);
  });

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
      confidence: Math.min(1, Math.max(0, aiWasUsed 
        ? (dcftResult.confidence * actualDcftWeight + aiConfidence * actualAiWeight)
        : dcftResult.confidence)),
    },
    // Meta-Learning Context Information
    context: {
      eventType: contextClassification.eventType,
      culturalRegion: contextClassification.culturalRegion,
      detectedLanguage: contextClassification.detectedLanguage,
      dialect: contextClassification.dialect,
      sensitivityLevel: contextClassification.sensitivityLevel,
      detectedKeywords: contextClassification.detectedKeywords,
      confidence: contextClassification.confidence,
    },
    // Temporal Analysis
    temporal: {
      trend: temporalAnalysis.trend,
      trendStrength: temporalAnalysis.trendStrength,
      gmiChange: temporalAnalysis.change.gmiChange,
      cfiChange: temporalAnalysis.change.cfiChange,
      hriChange: temporalAnalysis.change.hriChange,
      emotionShift: temporalAnalysis.change.emotionShift,
      insights: temporalInsights,
      historicalCount: temporalAnalysis.historicalData.length,
    },
    // Multilingual Analysis
    multilingual: langProfile ? {
      languageCode: langProfile.code,
      languageName: langProfile.name,
      nativeName: langProfile.nativeName,
      textDirection: langProfile.textDirection,
      culturalRegion: langProfile.culturalRegion,
      expressionStyle: langProfile.expressionStyle,
      matchedKeywords: multilingualResult.matchedKeywords,
      culturalAdjustment: multilingualResult.culturalAdjustment,
    } : undefined,
    // Active Learning
    learning: {
      patternId,
      learnedAdjustmentApplied,
      matchedPatterns,
      keywordsLearned: 5, // We extract up to 5 keywords per text
    },
    // Generate Insights & Alerts
    insights: generateInsights({
      emotions: {
        joy: emotionsFor100Scale.joy,
        fear: emotionsFor100Scale.fear,
        anger: emotionsFor100Scale.anger,
        sadness: emotionsFor100Scale.sadness,
        hope: emotionsFor100Scale.hope,
        curiosity: emotionsFor100Scale.curiosity,
      },
      indices: {
        gmi: indices.gmi,
        cfi: indices.cfi,
        hri: indices.hri,
      },
      context: {
        eventType: contextClassification.eventType,
        region: contextClassification.culturalRegion,
        sensitivity: contextClassification.sensitivityLevel,
      },
    }),
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
