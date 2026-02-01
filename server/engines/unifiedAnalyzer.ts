/**
 * Unified Analyzer - Main Entry Point
 * يجمع كل الـ 5 Engines في API واحد
 * 
 * POST /analyze
 * Input: { text, country, userType }
 * Output: { context, emotionalState, dynamics, drivers, insights }
 */

import { classifyContext, ContextResult } from './contextClassification';
import { fuseEmotions, EmotionFusionResult } from './emotionFusion';
import { analyzeEmotionalDynamics, DynamicsResult } from './emotionalDynamics';
import { detectDrivers, DriverDetectionResult } from './driverDetection';
import { generateInsights, ExplainableInsightResult, UserType } from './explainableInsight';

export interface AnalyzeInput {
  text: string;
  country?: string;       // Optional: specific country or 'ALL'
  userType?: UserType;    // Optional: defaults to 'general'
}

export interface AnalyzeOutput {
  // Input echo
  input: {
    text: string;
    country: string;
    userType: UserType;
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
  
  // Meta
  meta: {
    analysisId: string;
    timestamp: string;
    processingTime: number;
    version: string;
    overallConfidence: number;
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
 * Main Unified Analysis Function
 * Orchestrates all 5 engines in sequence
 */
export async function analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
  const startTime = Date.now();
  
  // Normalize inputs
  const text = input.text.trim();
  const country = input.country || 'ALL';
  const userType: UserType = input.userType || 'general';
  
  // Validate input
  if (!text || text.length < 10) {
    throw new Error('Text must be at least 10 characters long');
  }
  
  // Engine 1: Context Classification
  const context = classifyContext(text, country !== 'ALL' ? country : undefined);
  
  // Engine 2: Emotion Fusion
  const emotionalState = fuseEmotions(text, context);
  
  // Engine 3: Emotional Dynamics
  const dynamics = analyzeEmotionalDynamics(emotionalState);
  
  // Engine 4: Driver Detection
  const drivers = detectDrivers(text, context, emotionalState);
  
  // Engine 5: Explainable Insights
  const insights = generateInsights(userType, context, emotionalState, dynamics, drivers);
  
  // Calculate processing time
  const processingTime = Date.now() - startTime;
  
  // Calculate overall confidence
  const overallConfidence = Math.round(
    (context.confidence * 0.25) +
    (emotionalState.confidence * 0.25) +
    (drivers.confidence * 0.25) +
    (insights.confidence * 0.25)
  );
  
  return {
    input: {
      text,
      country,
      userType
    },
    context,
    emotionalState,
    dynamics,
    drivers,
    insights,
    meta: {
      analysisId: generateAnalysisId(),
      timestamp: new Date().toISOString(),
      processingTime,
      version: '2.0.0',
      overallConfidence
    }
  };
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
}> {
  const result = await analyze({ text, country, userType: 'general' });
  
  return {
    dominantEmotion: result.emotionalState.dominantEmotion,
    intensity: result.emotionalState.emotionalIntensity,
    valence: result.emotionalState.valence,
    riskLevel: result.dynamics.riskLevel,
    summary: result.insights.generalInsight.summary.en
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

export default { analyze, analyzeQuick, analyzeBatch };
