/**
 * DCFT Engine - Digital Consciousness Field Theory Implementation
 * Based on the research paper by Amaal Radwan
 * "The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind"
 * 
 * This is the main orchestrator that combines all three layers:
 * 1. Perception Layer - Input processing
 * 2. Cognitive Layer - DCF calculations
 * 3. Awareness Layer - Output generation
 * 
 * Core Formulas:
 * D(t) = Σ [Ei × Wi × ΔTi]
 * RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
 */

import { PerceptionLayer, RawDigitalInput, perceptionLayer } from './perceptionLayer';
import { CognitiveLayer, DCFState, cognitiveLayer } from './cognitiveLayer';
import { AwarenessLayer, AwarenessOutput, GlobalIndices, awarenessLayer } from './awarenessLayer';
import { EmotionEvent, AffectiveVector } from './affectiveVector';

/**
 * Complete DCFT analysis result
 */
export interface DCFTAnalysisResult {
  // Global indices
  indices: GlobalIndices;
  
  // Detailed emotions (0-100 scale)
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  
  // Dominant emotion
  dominantEmotion: string;
  
  // Emotional phase (if detected)
  emotionalPhase: {
    type: string;
    intensity: number;
    description: string;
  } | null;
  
  // Visual indicators
  colorCode: string;
  alertLevel: 'normal' | 'elevated' | 'high' | 'critical';
  
  // Metadata
  confidence: number;
  eventCount: number;
  processingTimeMs: number;
  timestamp: Date;
  summary: string;
  
  // DCF-specific metrics
  dcfAmplitude: number;
  resonanceIndices: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
}

/**
 * DCFT Engine class
 * Main entry point for all DCFT analysis
 */
export class DCFTEngine {
  private perceptionLayer: PerceptionLayer;
  private cognitiveLayer: CognitiveLayer;
  private awarenessLayer: AwarenessLayer;

  constructor() {
    this.perceptionLayer = perceptionLayer;
    this.cognitiveLayer = cognitiveLayer;
    this.awarenessLayer = awarenessLayer;
  }

  /**
   * Analyze raw digital inputs using full DCFT pipeline
   * This is the main analysis method
   */
  async analyze(inputs: RawDigitalInput[]): Promise<DCFTAnalysisResult> {
    const startTime = Date.now();

    // Layer 1: Perception - Process raw inputs
    const perceptionOutputs = await this.perceptionLayer.processBatch(inputs);
    const events = perceptionOutputs.map(p => p.event);

    // Layer 2: Cognitive - Calculate DCF state
    const dcfState = this.cognitiveLayer.processToDCFState(events);

    // Layer 3: Awareness - Generate output
    const awarenessOutput = this.awarenessLayer.generateOutput(dcfState);

    const processingTimeMs = Date.now() - startTime;

    return this.formatResult(dcfState, awarenessOutput, events.length, processingTimeMs);
  }

  /**
   * Analyze a single text input
   * Convenience method for quick analysis
   */
  async analyzeText(
    text: string,
    source: string = 'direct',
    metadata?: Partial<RawDigitalInput>
  ): Promise<DCFTAnalysisResult> {
    const input: RawDigitalInput = {
      id: `text-${Date.now()}`,
      content: text,
      source,
      timestamp: new Date(),
      reach: metadata?.reach || 100,
      engagement: metadata?.engagement || 10,
      isVerified: metadata?.isVerified || false,
      ...metadata,
    };

    return this.analyze([input]);
  }

  /**
   * Analyze multiple texts at once
   */
  async analyzeTexts(
    texts: string[],
    source: string = 'batch'
  ): Promise<DCFTAnalysisResult> {
    const inputs: RawDigitalInput[] = texts.map((text, index) => ({
      id: `batch-${Date.now()}-${index}`,
      content: text,
      source,
      timestamp: new Date(),
      reach: 100,
      engagement: 10,
    }));

    return this.analyze(inputs);
  }

  /**
   * Analyze with pre-processed emotion events
   * Used when emotions are already extracted (e.g., from LLM)
   */
  analyzeEvents(events: EmotionEvent[]): DCFTAnalysisResult {
    const startTime = Date.now();

    // Skip perception layer, go directly to cognitive
    const dcfState = this.cognitiveLayer.processToDCFState(events);
    const awarenessOutput = this.awarenessLayer.generateOutput(dcfState);

    const processingTimeMs = Date.now() - startTime;

    return this.formatResult(dcfState, awarenessOutput, events.length, processingTimeMs);
  }

  /**
   * Get historical trend analysis
   */
  getHistoricalTrend(hours: number = 24): DCFTAnalysisResult[] {
    const states = this.cognitiveLayer.getHistoricalTrend(hours);
    
    return states.map(state => {
      const output = this.awarenessLayer.generateOutput(state);
      return this.formatResult(state, output, state.eventCount, 0);
    });
  }

  /**
   * Check if alert should be triggered
   */
  checkAlert(result: DCFTAnalysisResult): {
    shouldAlert: boolean;
    title: string;
    message: string;
    severity: string;
  } | null {
    const awarenessOutput: AwarenessOutput = {
      indices: result.indices,
      emotions: result.emotions,
      dominantEmotion: result.dominantEmotion,
      emotionalPhase: result.emotionalPhase ? {
        type: result.emotionalPhase.type as any,
        intensity: result.emotionalPhase.intensity,
        startTime: new Date(),
        dominantEmotions: [],
        description: result.emotionalPhase.description,
      } : null,
      colorCode: result.colorCode,
      alertLevel: result.alertLevel,
      confidence: result.confidence,
      timestamp: result.timestamp,
      summary: result.summary,
    };

    return this.awarenessLayer.generateAlert(awarenessOutput);
  }

  /**
   * Format the final result
   */
  private formatResult(
    dcfState: DCFState,
    awarenessOutput: AwarenessOutput,
    eventCount: number,
    processingTimeMs: number
  ): DCFTAnalysisResult {
    return {
      indices: awarenessOutput.indices,
      emotions: awarenessOutput.emotions,
      dominantEmotion: awarenessOutput.dominantEmotion,
      emotionalPhase: awarenessOutput.emotionalPhase ? {
        type: awarenessOutput.emotionalPhase.type,
        intensity: awarenessOutput.emotionalPhase.intensity,
        description: awarenessOutput.emotionalPhase.description,
      } : null,
      colorCode: awarenessOutput.colorCode,
      alertLevel: awarenessOutput.alertLevel,
      confidence: awarenessOutput.confidence,
      eventCount,
      processingTimeMs,
      timestamp: awarenessOutput.timestamp,
      summary: awarenessOutput.summary,
      dcfAmplitude: dcfState.amplitude,
      resonanceIndices: dcfState.resonanceIndices,
    };
  }

  /**
   * Clear all history and reset engine
   */
  reset(): void {
    this.cognitiveLayer.clearHistory();
  }
}

/**
 * Create singleton instance
 */
export const dcftEngine = new DCFTEngine();

/**
 * Export convenience functions
 */
export async function analyzeDCFT(inputs: RawDigitalInput[]): Promise<DCFTAnalysisResult> {
  return dcftEngine.analyze(inputs);
}

export async function analyzeTextDCFT(text: string, source?: string): Promise<DCFTAnalysisResult> {
  return dcftEngine.analyzeText(text, source);
}

export async function analyzeTextsDCFT(texts: string[], source?: string): Promise<DCFTAnalysisResult> {
  return dcftEngine.analyzeTexts(texts, source);
}
