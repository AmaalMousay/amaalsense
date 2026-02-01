/**
 * Unified Analyzer - Main Entry Point
 * يجمع كل الـ Engines في API واحد
 * 
 * POST /analyze
 * Input: { text, country, userType, sources }
 * Output: { context, emotionalState, dynamics, drivers, insights, confidence, meta }
 * 
 * التحسينات الجديدة:
 * - Engine 0: Emotional Memory Layer (تخزين التاريخ)
 * - Source Weighting (أوزان المصادر)
 * - Confidence Propagation (توريث الثقة)
 * - Feedback Loop Ready (جاهز للتغذية الراجعة)
 */

import { classifyContext, ContextResult } from './contextClassification';
import { fuseEmotions, EmotionFusionResult, AffectiveVector } from './emotionFusion';
import { analyzeEmotionalDynamics, DynamicsResult } from './emotionalDynamics';
import { detectDrivers, DriverDetectionResult } from './driverDetection';
import { generateInsights, ExplainableInsightResult, UserType } from './explainableInsight';

// New imports for enhancements
import { storeAnalysis, getHistoricalData, calculateHistoricalTrend, HistoricalTrend, HistoricalQuery } from './emotionalMemory';
import { getSourceWeight, calculateAggregateWeight, applySourceWeighting } from './sourceWeighting';
import { 
  calculateContextConfidence, 
  calculateFusionConfidence, 
  calculateDynamicsConfidence,
  calculateDriverConfidence,
  calculateInsightConfidence,
  calculateOverallConfidence,
  OverallConfidence,
  EngineConfidence
} from './confidencePropagation';

// Source input type for API
export interface SourceInput {
  name: string;
  type?: 'news' | 'social' | 'forum' | 'official' | 'academic';
  value?: number;
}

export interface AnalyzeInput {
  text: string;
  country?: string;       // Optional: specific country or 'ALL'
  userType?: UserType;    // Optional: defaults to 'general'
  sources?: SourceInput[]; // Optional: sources for weighting
  topic?: string;         // Optional: topic for memory storage
}

export interface AnalyzeOutput {
  // Input echo
  input: {
    text: string;
    country: string;
    userType: UserType;
    topic?: string;
  };
  
  // Engine 1: Context
  context: ContextResult;
  
  // Engine 2: Emotions
  emotionalState: EmotionFusionResult;
  
  // Engine 3: Dynamics
  dynamics: DynamicsResult;
  
  // Engine 4: Drivers
  drivers: DriverDetectionResult;
  
  // Engine 5: Insights
  insights: ExplainableInsightResult;
  
  // NEW: Historical Trend (from Engine 0)
  historicalTrend?: HistoricalTrend;
  
  // NEW: Confidence Breakdown
  confidence: {
    overall: number;
    breakdown: OverallConfidence;
    grade: string;
    interpretation: string;
  };
  
  // NEW: Source Weighting Info
  sourceWeighting?: {
    applied: boolean;
    aggregateWeight: number;
    sourceCount: number;
    adjustedIntensity: number;
  };
  
  // Meta
  meta: {
    analysisId: string;
    timestamp: string;
    processingTime: number;
    version: string;
    engines: {
      memory: boolean;
      sourceWeighting: boolean;
      confidencePropagation: boolean;
      feedbackReady: boolean;
    };
  };
}

/**
 * Generate unique analysis ID
 */
function generateAnalysisId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `AML-${timestamp}-${random}`.toUpperCase();
}

/**
 * Get confidence grade from score
 */
function getConfidenceGrade(score: number): { grade: string; interpretation: string } {
  if (score >= 90) return { grade: 'A+', interpretation: 'Excellent - Very high confidence in analysis' };
  if (score >= 80) return { grade: 'A', interpretation: 'Very Good - High confidence, reliable analysis' };
  if (score >= 70) return { grade: 'B', interpretation: 'Good - Moderate confidence, generally reliable' };
  if (score >= 60) return { grade: 'C', interpretation: 'Fair - Some uncertainty, use with caution' };
  if (score >= 50) return { grade: 'D', interpretation: 'Low - Significant uncertainty, verify independently' };
  return { grade: 'F', interpretation: 'Very Low - High uncertainty, treat as preliminary' };
}

/**
 * Main Unified Analysis Function
 * Orchestrates all engines in sequence with new enhancements
 */
export async function analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
  const startTime = Date.now();
  const analysisId = generateAnalysisId();
  
  // Normalize inputs
  const text = input.text.trim();
  const country = input.country || 'ALL';
  const userType: UserType = input.userType || 'general';
  const sources = input.sources || [];
  const topic = input.topic || extractTopic(text);
  
  // Validate input
  if (!text || text.length < 10) {
    throw new Error('Text must be at least 10 characters long');
  }
  
  // ============================================
  // Engine 1: Context Classification
  // ============================================
  const context = classifyContext(text, country !== 'ALL' ? country : undefined);
  
  // Calculate context confidence
  const keywordsFound = text.split(/\s+/).length > 20 ? 10 : 5;
  const contextConfidence = calculateContextConfidence(
    text.length,
    keywordsFound,
    true, // language detected
    context.domain !== 'general'
  );
  
  // ============================================
  // Engine 2: Emotion Fusion (with Source Weighting)
  // ============================================
  let emotionalState = fuseEmotions(text, context);
  
  // Calculate fusion confidence
  const fusionConfidence = calculateFusionConfidence(
    sources.length || 1,
    0.7, // source quality estimate
    0.8, // agreement level estimate
    emotionalState.emotionalIntensity / 100
  );
  
  // Apply source weighting if sources provided
  let sourceWeightingInfo: AnalyzeOutput['sourceWeighting'] = undefined;
  if (sources.length > 0) {
    const sourceNames = sources.map(s => s.name);
    const aggregateResult = calculateAggregateWeight(sourceNames);
    
    // Apply weighted adjustment to emotional intensity
    const adjustedIntensity = Math.round(emotionalState.emotionalIntensity * aggregateResult.averageWeight);
    
    // Update emotional state with weighted values
    emotionalState = {
      ...emotionalState,
      emotionalIntensity: adjustedIntensity
    };
    
    sourceWeightingInfo = {
      applied: true,
      aggregateWeight: Math.round(aggregateResult.averageWeight * 100),
      sourceCount: sources.length,
      adjustedIntensity
    };
  }
  
  // ============================================
  // Engine 0: Get Historical Data for Dynamics
  // ============================================
  const historicalQuery: HistoricalQuery = {
    topic,
    countryCode: country !== 'ALL' ? country : undefined,
    limit: 30
  };
  const historicalData = getHistoricalData(historicalQuery);
  
  const historicalTrend = historicalData.length > 0 
    ? calculateHistoricalTrend(historicalQuery)
    : undefined;
  
  // ============================================
  // Engine 3: Emotional Dynamics
  // ============================================
  const dynamics = analyzeEmotionalDynamics(emotionalState);
  
  // Calculate dynamics confidence
  const dynamicsConfidence = calculateDynamicsConfidence(
    historicalData.length,
    24, // time span in hours (estimate)
    0.7 // trend consistency estimate
  );
  
  // ============================================
  // Engine 4: Driver Detection
  // ============================================
  const drivers = detectDrivers(text, context, emotionalState);
  
  // Calculate driver confidence
  const driverConfidence = calculateDriverConfidence(
    drivers.keyDrivers.length,
    drivers.rootCauses.length,
    0.7 // narrative clarity estimate
  );
  
  // ============================================
  // Engine 5: Explainable Insights
  // ============================================
  const insights = generateInsights(userType, context, emotionalState, dynamics, drivers);
  
  // Calculate insight confidence
  const avgInputConfidence = (contextConfidence.confidence + fusionConfidence.confidence + dynamicsConfidence.confidence + driverConfidence.confidence) / 4;
  const insightConfidence = calculateInsightConfidence(
    avgInputConfidence,
    100, // explanation length estimate
    3 // actionable insights count estimate
  );
  
  // ============================================
  // Calculate Overall Confidence
  // ============================================
  const engineConfidences: EngineConfidence[] = [
    contextConfidence,
    fusionConfidence,
    dynamicsConfidence,
    driverConfidence,
    insightConfidence
  ];
  
  const overallConfidence = calculateOverallConfidence(engineConfidences);
  
  const { grade, interpretation } = getConfidenceGrade(overallConfidence.score);
  
  // ============================================
  // Store in Emotional Memory (Engine 0)
  // ============================================
  storeAnalysis({
    topic,
    countryCode: country !== 'ALL' ? country : null,
    countryName: country,
    affectiveVector: emotionalState.vector,
    dominantEmotion: emotionalState.dominantEmotion,
    emotionalIntensity: emotionalState.emotionalIntensity,
    valence: emotionalState.valence,
    gmi: calculateGMI(emotionalState),
    cfi: calculateCFI(emotionalState),
    hri: calculateHRI(emotionalState),
    domain: context.domain,
    eventType: context.eventType,
    sensitivityLevel: context.sensitivity,
    sourceCount: sources.length || 1,
    confidence: overallConfidence.score,
    userType
  });
  
  // Calculate processing time
  const processingTime = Date.now() - startTime;
  
  return {
    input: {
      text,
      country,
      userType,
      topic
    },
    context,
    emotionalState,
    dynamics,
    drivers,
    insights,
    historicalTrend,
    confidence: {
      overall: overallConfidence.score,
      breakdown: overallConfidence,
      grade,
      interpretation
    },
    sourceWeighting: sourceWeightingInfo,
    meta: {
      analysisId,
      timestamp: new Date().toISOString(),
      processingTime,
      version: '3.0.0', // Updated version for new enhancements
      engines: {
        memory: true,
        sourceWeighting: sources.length > 0,
        confidencePropagation: true,
        feedbackReady: true
      }
    }
  };
}

/**
 * Calculate GMI (Global Mood Index) from emotional state
 */
function calculateGMI(state: EmotionFusionResult): number {
  // GMI = weighted average of all emotions normalized to 0-100
  const { vector } = state;
  const positive = vector.joy + vector.hope;
  const negative = vector.fear + vector.anger + vector.sadness;
  const neutral = vector.curiosity;
  
  // Scale: 0 = very negative, 50 = neutral, 100 = very positive
  const total = positive + negative + neutral;
  if (total === 0) return 50;
  
  return Math.round(50 + ((positive - negative) / total) * 50);
}

/**
 * Calculate CFI (Collective Fear Index) from emotional state
 */
function calculateCFI(state: EmotionFusionResult): number {
  const { vector } = state;
  // CFI focuses on fear and related negative emotions
  return Math.min(100, Math.round(vector.fear * 0.6 + vector.anger * 0.25 + vector.sadness * 0.15));
}

/**
 * Calculate HRI (Hope & Resilience Index) from emotional state
 */
function calculateHRI(state: EmotionFusionResult): number {
  const { vector } = state;
  // HRI focuses on hope and positive emotions
  return Math.min(100, Math.round(vector.hope * 0.5 + vector.joy * 0.3 + vector.curiosity * 0.2));
}

/**
 * Extract topic from text (simple implementation)
 */
function extractTopic(text: string): string {
  // Get first 50 chars or first sentence
  const firstSentence = text.split(/[.!?]/)[0];
  if (firstSentence.length <= 50) return firstSentence.trim();
  
  // Otherwise, get first 50 chars and trim at last space
  const truncated = text.substring(0, 50);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 20 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Quick analysis - returns only essential data
 */
export async function analyzeQuick(text: string, country?: string): Promise<{
  dominantEmotion: string;
  intensity: number;
  valence: number;
  riskLevel: string;
  summary: string;
  confidence: number;
}> {
  const result = await analyze({ text, country, userType: 'general' });
  
  return {
    dominantEmotion: result.emotionalState.dominantEmotion,
    intensity: result.emotionalState.emotionalIntensity,
    valence: result.emotionalState.valence,
    riskLevel: result.dynamics.riskLevel,
    summary: result.insights.generalInsight.summary.en,
    confidence: result.confidence.overall
  };
}

/**
 * Batch analysis - analyze multiple texts
 */
export async function analyzeBatch(inputs: AnalyzeInput[]): Promise<AnalyzeOutput[]> {
  const results: AnalyzeOutput[] = [];
  
  for (const input of inputs) {
    try {
      const result = await analyze(input);
      results.push(result);
    } catch (error) {
      console.error(`Error analyzing text: ${input.text.substring(0, 50)}...`, error);
    }
  }
  
  return results;
}

/**
 * Analyze with specific sources (convenience function)
 */
export async function analyzeWithSources(
  text: string, 
  sources: SourceInput[], 
  country?: string, 
  userType?: UserType
): Promise<AnalyzeOutput> {
  return analyze({
    text,
    country,
    userType,
    sources
  });
}

/**
 * Get historical analysis for a topic
 */
export function getTopicHistory(topic: string, country?: string, limit: number = 30) {
  const query: HistoricalQuery = {
    topic,
    countryCode: country,
    limit
  };
  
  return {
    trend: calculateHistoricalTrend(query),
    data: getHistoricalData(query)
  };
}

export default { 
  analyze, 
  analyzeQuick, 
  analyzeBatch, 
  analyzeWithSources,
  getTopicHistory 
};
