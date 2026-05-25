/**
 * EventVector - Quantum-Inspired Data Model for AmalSense
 *    "   " (DCFT)      .
 */

import { z } from 'zod';
import type { CompressedNews } from '../engines/newsCompressionLayer';

/**
 * QuantumEmotion -    
 *          .
 */
export const QuantumEmotionSchema = z.object({
  amplitude: z.number().min(0).max(1).describe('Intensity/Power of the emotion wave'),
  phase: z.number().min(0).max(2 * Math.PI).describe('Phase angle (0 to 2π) for interference calculation'),
  superposition: z.record(z.string(), z.number()).describe('Probabilities of mixed emotional states'),
});

/**
 * EmotionVector -      
 */
export const EmotionVectorSchema = z.object({
  joy: QuantumEmotionSchema,
  fear: QuantumEmotionSchema,
  anger: QuantumEmotionSchema,
  sadness: QuantumEmotionSchema,
  hope: QuantumEmotionSchema,
  curiosity: QuantumEmotionSchema,
});

export type EmotionVector = z.infer<typeof EmotionVectorSchema>;

/**
 * EventVector -    ""    
 */
export const EventVectorSchema = z.object({
  id: z.string(),
  timestamp: z.number(),

  topic: z.enum(['economy', 'politics', 'conflict', 'society', 'health', 'environment', 'technology', 'culture', 'other']),
  subTopic: z.string().optional(),
  region: z.enum(['global', 'europe', 'mena', 'asia', 'americas', 'africa', 'oceania']),
  country: z.string().optional(),

  //   
  emotions: EmotionVectorSchema,

  //     
  fieldIntensity: z.number().min(0).max(1).describe('Energy density in the DCCF layer'),
  interferencePattern: z.enum(['constructive', 'destructive', 'neutral']).default('neutral'),
  polarity: z.number().min(-1).max(1),
  uncertainty: z.number().min(0).max(1), //   "  "   

  //   (Wi)   
  sourceWeight: z.number().min(0).max(1),
  timeDecay: z.number().describe('Lambda (λ) value for temporal decay (e^-λt)'),
  relevanceWeight: z.number().min(0).max(1),

  sourceType: z.enum(['news', 'social', 'analysis']),
  sourceName: z.string(),
  summary: z.string(),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

/**
 *     RI(e,t)   
 * RI = Σ (AV * W * e^-λΔt)
 */
export function calculateResonanceIndex(events: EventVector[]): number {
  if (events.length === 0) return 0;
  const now = Date.now();

  const totalResonance = events.reduce((acc, ev) => {
    const deltaTime = (now - ev.timestamp) / (1000 * 60 * 60); //  
    //      e^-λt
    const decay = Math.exp(-ev.timeDecay * deltaTime);
    //      
    const wavePower = ev.emotions.hope.amplitude * ev.sourceWeight * ev.relevanceWeight;
    return acc + (wavePower * decay);
  }, 0);

  return Math.min(100, totalResonance * 100);
}

/**
 *  GMI  (Global Mood Index)
 *    (Wave Interference)    
 */
export function calculateGMI(events: EventVector[]): number {
  if (events.length === 0) return 50;

  //       (Cosine) 
  const interferenceSum = events.reduce((sum, ev) => {
    const waveContribution = ev.polarity * ev.fieldIntensity * Math.cos(ev.emotions.joy.phase);
    return sum + waveContribution;
  }, 0);

  //     0-100
  const normalizedGMI = ((interferenceSum / events.length) + 1) * 50;
  return Math.round(normalizedGMI * 100) / 100;
}

/**
 *     (Quantum Event Creator)
 */
export function createQuantumEvent(data: any): EventVector {
  const defaultQuantum = () => ({
    amplitude: Math.random(),
    phase: Math.random() * 2 * Math.PI,
    superposition: { "stable": 0.8, "volatile": 0.2 }
  });

  return {
    id: `q_evt_${Date.now()}`,
    timestamp: Date.now(),
    topic: data.topic,
    region: data.region,
    emotions: {
      joy: data.emotions?.joy || defaultQuantum(),
      fear: data.emotions?.fear || defaultQuantum(),
      anger: data.emotions?.anger || defaultQuantum(),
      sadness: data.emotions?.sadness || defaultQuantum(),
      hope: data.emotions?.hope || defaultQuantum(),
      curiosity: data.emotions?.curiosity || defaultQuantum(),
    },
    fieldIntensity: data.intensity || 0.5,
    interferencePattern: 'neutral',
    polarity: data.polarity || 0,
    uncertainty: data.uncertainty || 0.5,
    sourceWeight: data.sourceWeight || 0.8,
    timeDecay: 0.1, //  λ 
    relevanceWeight: data.relevanceWeight || 0.8,
    sourceType: data.sourceType || 'news',
    sourceName: data.sourceName || 'Unknown',
    summary: data.summary || '',
  };
}
/**
 *  CFI (Collective Feelings Index) -   
 *        
 */
export function calculateCFI(events: EventVector[]): number {
  if (events.length === 0) return 50;

  const cfiSum = events.reduce((acc, ev) => {
    //      (destructive )
    const turbulence = (ev.emotions.fear.amplitude + ev.emotions.anger.amplitude) / 2;
    return acc + (1 - turbulence) * ev.fieldIntensity;
  }, 0);

  return Math.round((cfiSum / events.length) * 100);
}

/**
 *  HRI (Human Resonance Index) -   
 *    ""     ( )
 */
export function calculateHRI(events: EventVector[]): number {
  if (events.length === 0) return 0;

  const hriSum = events.reduce((acc, ev) => {
    const resonance = (ev.emotions.hope.amplitude + ev.emotions.curiosity.amplitude) / 2;
    return acc + (resonance * ev.sourceWeight);
  }, 0);

  return Math.min(100, Math.round((hriSum / events.length) * 100));
}
/**
 * Aggregates all metrics for a group of events (Used by NewFeaturesRouter)
 */
export function calculateAggregatedMetrics(events: EventVector[]) {
  return {
    gmi: calculateGMI(events),
    cfi: calculateCFI(events),
    hri: calculateHRI(events),
    resonance: calculateResonanceIndex(events),
    count: events.length,
    timestamp: Date.now()
  };
}

// =============================================================================
// ENHANCED QUANTUM EVENT HELPERS (merged from enhancedEventVector.ts)
// =============================================================================

/**
 * Enhanced EventVector - Quantum-Inspired Engine V2
 *       (Waveform Vectors)
 *     (Superposition & Interference)
 */

export interface QuantumEventVector {
  id: string;
  createdAt: number;
  sourceId: string;
  sourceType: 'news' | 'social' | 'analysis';
  sourceName: string;

  // Temporal & Quantum Decay
  eventTimestamp: number;
  lambda: number; //     

  // Semantic & Geo
  region: string;
  country: string;
  topic: string;
  mainIdea: string;

  // Waveform Emotions (Amplitudes & Phases)
  emotions: {
    joy: { a: number; p: number };
    fear: { a: number; p: number };
    anger: { a: number; p: number };
    sadness: { a: number; p: number };
    hope: { a: number; p: number };
    curiosity: { a: number; p: number };
  };

  intensity: number;
  polarity: number;

  // Complex Vector (Amplitudes for interference)
  quantumVector: number[];
  phases: number[]; //    

  summary: string;
  cause: string;
  confidence: number;
}

/**
 *       
 */
export function createQuantumEventFromCompressed(
  compressed: CompressedNews,
  sourceId: string,
  sourceName: string = 'news'
): QuantumEventVector {

  //    (Phase)     
  const generatePhase = (emotion: string) => {
    const base = (Date.now() % 1000) / 1000 * Math.PI * 2;
    return (emotion === 'hope' || emotion === 'joy') ? base : base + Math.PI; //     
  };

  const emotions = {
    joy: { a: 0.1, p: generatePhase('joy') },
    fear: { a: 0.1, p: generatePhase('fear') },
    anger: { a: 0.1, p: generatePhase('anger') },
    sadness: { a: 0.1, p: generatePhase('sadness') },
    hope: { a: 0.1, p: generatePhase('hope') },
    curiosity: { a: 0.1, p: generatePhase('curiosity') },
  };

  //   (Amplitude)    
  if (compressed.emotion in emotions) {
    emotions[compressed.emotion].a = Math.min(1, compressed.intensity + 0.2);
  }

  //    ( )
  const quantumVector = Object.values(emotions).map(e => e.a);
  const phases = Object.values(emotions).map(e => e.p);

  return {
    id: `q_ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    sourceId,
    sourceType: 'news',
    sourceName,
    eventTimestamp: Date.now(),
    lambda: 0.1, //  λ   RI  
    region: compressed.region,
    country: 'Global',
    topic: compressed.topic,
    mainIdea: compressed.mainIdea,
    emotions,
    intensity: compressed.intensity,
    polarity: (emotions.joy.a + emotions.hope.a) - (emotions.fear.a + emotions.anger.a),
    quantumVector,
    phases,
    summary: compressed.mainIdea,
    cause: compressed.cause,
    confidence: compressed.confidence,
  };
}

/**
 *    (Quantum Interference Similarity)
 *          (Constructive)  .
 */
export function calculateQuantumInterference(vec1: QuantumEventVector, vec2: QuantumEventVector): number {
  let interferenceScore = 0;

  for (let i = 0; i < vec1.quantumVector.length; i++) {
    const a1 = vec1.quantumVector[i];
    const a2 = vec2.quantumVector[i];
    const p1 = vec1.phases[i];
    const p2 = vec2.phases[i];

    //  : A^2 = a1^2 + a2^2 + 2*a1*a2*cos(p1 - p2)
    const interference = Math.sqrt(Math.pow(a1, 2) + Math.pow(a2, 2) + 2 * a1 * a2 * Math.cos(p1 - p2));
    interferenceScore += interference;
  }

  return interferenceScore / vec1.quantumVector.length;
}

/**
 *   (Super-Aggregation)
 *    " "    
 */
export function superAggregate(vectors: QuantumEventVector[]): QuantumEventVector {
  if (vectors.length === 0) throw new Error('No vectors to aggregate');

  //      RI  
  // RI = Σ (Ai * Wi * e^-λt)
  const now = Date.now();
  const aggregatedAmplitudes = new Array(6).fill(0);

  for (const v of vectors) {
    const dt = (now - v.eventTimestamp) / (1000 * 3600); // Δt 
    const decay = Math.exp(-v.lambda * dt);

    for (let i = 0; i < 6; i++) {
      aggregatedAmplitudes[i] += v.quantumVector[i] * decay;
    }
  }

  //   "" 
  const result = { ...vectors[0] };
  result.id = `super_agg_${now}`;
  result.quantumVector = aggregatedAmplitudes.map(a => Math.min(1, a / vectors.length));
  result.mainIdea = `    ${vectors.length} `;

  return result;
}