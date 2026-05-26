/**
 * Cognitive Layer (Layer 2) - Processing
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This layer aggregates emotional vectors across geography and time,
 * applying the mathematical model of the Digital Consciousness Field (DCF).
 * 
 * Core Formulas:
 * D(t) = Σ [Ei × Wi × ΔTi]
 * RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
 */

import { 
  AffectiveVector, 
  EmotionEvent, 
  aggregateAVs, 
  calculateAVMagnitude,
  calculateEmotionalPolarity,
  calculateEmotionalIntensity,
  getDominantEmotion 
} from './affectiveVector';
import { 
  calculateDecayFactor, 
  calculateEmotionDecay, 
  DECAY_RATES,
  calculateTemporalPersistence 
} from './temporalDecay';
import { 
  calculateInfluenceWeight, 
  normalizeWeights 
} from './influenceWeight';

/**
 * Digital Consciousness Field state at time t
 */
export interface DCFState {
  timestamp: Date;
  amplitude: number;           // D(t) - consciousness amplitude
  resonanceIndices: {          // RI(e,t) for each emotion
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  aggregatedAV: AffectiveVector;
  dominantEmotion: string;
  emotionalPhase: EmotionalPhase | null;
  eventCount: number;
  confidence: number;
}

/**
 * Collective Emotional Phase
 * Detected when resonance crosses a threshold
 */
export interface EmotionalPhase {
  type: 'calm' | 'tension' | 'crisis' | 'euphoria' | 'mourning' | 'anticipation';
  intensity: number;           // 0-1
  startTime: Date;
  dominantEmotions: string[];
  description: string;
}

/**
 * Phase detection thresholds
 */
const PHASE_THRESHOLDS = {
  crisis: { fear: 0.6, anger: 0.5 },
  euphoria: { joy: 0.6, hope: 0.5 },
  mourning: { sadness: 0.6 },
  tension: { anger: 0.4, fear: 0.3 },
  anticipation: { curiosity: 0.5, hope: 0.4 },
  calm: { threshold: 0.3 }, // All emotions below this
};

/**
 * Cognitive Layer class
 * Processes emotional data using DCFT mathematical models
 */
export class CognitiveLayer {
  private eventHistory: EmotionEvent[] = [];
  private maxHistorySize: number = 10000;

  /**
   * Calculate Digital Consciousness Field amplitude
   * Formula: D(t) = Σ [Ei × Wi × ΔTi]
   * 
   * @param events - Array of emotion events
   * @param currentTime - Current timestamp
   * @returns D(t) value
   */
  calculateDCFAmplitude(events: EmotionEvent[], currentTime: Date = new Date()): number {
    if (events.length === 0) return 0;

    let amplitude = 0;

    for (const event of events) {
      // Ei = Emotional intensity (magnitude of AV)
      const Ei = calculateAVMagnitude(event.affectiveVector);
      
      // Wi = Influence weight
      const Wi = calculateInfluenceWeight(
        event.source,
        event.reach,
        event.engagement,
        event.confidence
      );
      
      // ΔTi = Temporal persistence (decay factor)
      const deltaHours = (currentTime.getTime() - event.timestamp.getTime()) / (1000 * 60 * 60);
      const deltaTi = calculateDecayFactor(deltaHours);
      
      // D(t) += Ei × Wi × ΔTi
      amplitude += Ei * Wi * deltaTi;
    }

    return amplitude;
  }

  /**
   * Calculate Resonance Index for a specific emotion
   * Formula: RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
   * 
   * @param emotion - The emotion to calculate RI for
   * @param events - Array of emotion events
   * @param currentTime - Current timestamp
   * @returns RI(e,t) value
   */
  calculateResonanceIndex(
    emotion: keyof AffectiveVector,
    events: EmotionEvent[],
    currentTime: Date = new Date()
  ): number {
    if (events.length === 0) return 0;

    let resonance = 0;
    const lambda = DECAY_RATES[emotion] || 0.07;

    for (const event of events) {
      // AVi = Affective Vector component for this emotion
      const AVi = event.affectiveVector[emotion];
      
      // Wi = Influence weight
      const Wi = calculateInfluenceWeight(
        event.source,
        event.reach,
        event.engagement,
        event.confidence
      );
      
      // e^(-λΔt) = Temporal decay
      const deltaHours = (currentTime.getTime() - event.timestamp.getTime()) / (1000 * 60 * 60);
      const decay = Math.exp(-lambda * deltaHours);
      
      // RI(e,t) += AVi × Wi × e^(-λΔt)
      resonance += AVi * Wi * decay;
    }

    // Normalize to -1 to +1 range
    return Math.tanh(resonance / Math.max(1, events.length));
  }

  /**
   * Calculate all Resonance Indices
   */
  calculateAllResonanceIndices(
    events: EmotionEvent[],
    currentTime: Date = new Date()
  ): DCFState['resonanceIndices'] {
    return {
      joy: this.calculateResonanceIndex('joy', events, currentTime),
      fear: this.calculateResonanceIndex('fear', events, currentTime),
      anger: this.calculateResonanceIndex('anger', events, currentTime),
      sadness: this.calculateResonanceIndex('sadness', events, currentTime),
      hope: this.calculateResonanceIndex('hope', events, currentTime),
      curiosity: this.calculateResonanceIndex('curiosity', events, currentTime),
    };
  }

  /**
   * Detect collective emotional phase
   */
  detectEmotionalPhase(resonanceIndices: DCFState['resonanceIndices']): EmotionalPhase | null {
    const { joy, fear, anger, sadness, hope, curiosity } = resonanceIndices;

    // Check for crisis phase
    if (fear > PHASE_THRESHOLDS.crisis.fear && anger > PHASE_THRESHOLDS.crisis.anger) {
      return {
        type: 'crisis',
        intensity: (fear + anger) / 2,
        startTime: new Date(),
        dominantEmotions: ['fear', 'anger'],
        description: 'High collective fear and anger detected - potential crisis state',
      };
    }

    // Check for euphoria phase
    if (joy > PHASE_THRESHOLDS.euphoria.joy && hope > PHASE_THRESHOLDS.euphoria.hope) {
      return {
        type: 'euphoria',
        intensity: (joy + hope) / 2,
        startTime: new Date(),
        dominantEmotions: ['joy', 'hope'],
        description: 'High collective joy and hope - euphoric state',
      };
    }

    // Check for mourning phase
    if (sadness > PHASE_THRESHOLDS.mourning.sadness) {
      return {
        type: 'mourning',
        intensity: sadness,
        startTime: new Date(),
        dominantEmotions: ['sadness'],
        description: 'High collective sadness - mourning state',
      };
    }

    // Check for tension phase
    if (anger > PHASE_THRESHOLDS.tension.anger || fear > PHASE_THRESHOLDS.tension.fear) {
      return {
        type: 'tension',
        intensity: Math.max(anger, fear),
        startTime: new Date(),
        dominantEmotions: anger > fear ? ['anger'] : ['fear'],
        description: 'Elevated tension detected in collective mood',
      };
    }

    // Check for anticipation phase
    if (curiosity > PHASE_THRESHOLDS.anticipation.curiosity && hope > PHASE_THRESHOLDS.anticipation.hope) {
      return {
        type: 'anticipation',
        intensity: (curiosity + hope) / 2,
        startTime: new Date(),
        dominantEmotions: ['curiosity', 'hope'],
        description: 'Collective anticipation and curiosity',
      };
    }

    // Check for calm phase
    const maxIntensity = Math.max(
      Math.abs(joy), Math.abs(fear), Math.abs(anger),
      Math.abs(sadness), Math.abs(hope), Math.abs(curiosity)
    );
    if (maxIntensity < PHASE_THRESHOLDS.calm.threshold) {
      return {
        type: 'calm',
        intensity: 1 - maxIntensity,
        startTime: new Date(),
        dominantEmotions: [],
        description: 'Collective emotional state is calm and balanced',
      };
    }

    return null;
  }

  /**
   * Process events and generate DCF state
   */
  processToDCFState(events: EmotionEvent[], currentTime: Date = new Date()): DCFState {
    // Add to history
    this.addToHistory(events);

    // Calculate D(t)
    const amplitude = this.calculateDCFAmplitude(events, currentTime);

    // Calculate all RI(e,t)
    const resonanceIndices = this.calculateAllResonanceIndices(events, currentTime);

    // Aggregate Affective Vectors
    const weightedVectors = events.map(event => ({
      av: event.affectiveVector,
      weight: calculateInfluenceWeight(
        event.source,
        event.reach,
        event.engagement,
        event.confidence
      ) * calculateDecayFactor(
        (currentTime.getTime() - event.timestamp.getTime()) / (1000 * 60 * 60)
      ),
    }));
    const aggregatedAV = aggregateAVs(weightedVectors);

    // Get dominant emotion
    const dominant = getDominantEmotion(aggregatedAV);

    // Detect emotional phase
    const emotionalPhase = this.detectEmotionalPhase(resonanceIndices);

    // Calculate average confidence
    const confidence = events.length > 0
      ? events.reduce((sum, e) => sum + e.confidence, 0) / events.length
      : 0;

    return {
      timestamp: currentTime,
      amplitude,
      resonanceIndices,
      aggregatedAV,
      dominantEmotion: dominant.emotion,
      emotionalPhase,
      eventCount: events.length,
      confidence,
    };
  }

  /**
   * Add events to history (for temporal analysis)
   */
  private addToHistory(events: EmotionEvent[]): void {
    this.eventHistory.push(...events);
    
    // Trim history if too large
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get historical DCF states for trend analysis
   */
  getHistoricalTrend(
    hours: number = 24,
    intervalMinutes: number = 60
  ): DCFState[] {
    const states: DCFState[] = [];
    const now = new Date();
    const intervals = Math.floor((hours * 60) / intervalMinutes);

    for (let i = intervals; i >= 0; i--) {
      const targetTime = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
      const relevantEvents = this.eventHistory.filter(e => {
        const eventTime = e.timestamp.getTime();
        const windowStart = targetTime.getTime() - intervalMinutes * 60 * 1000;
        return eventTime >= windowStart && eventTime <= targetTime.getTime();
      });

      if (relevantEvents.length > 0) {
        states.push(this.processToDCFState(relevantEvents, targetTime));
      }
    }

    return states;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
}

/**
 * Create singleton instance
 */
export const cognitiveLayer = new CognitiveLayer();
