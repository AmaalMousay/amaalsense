/**
 * DCFT Module - Digital Consciousness Field Theory
 * Complete implementation based on Amaal Radwan's research
 * 
 * This module provides:
 * - Three-layer architecture (Perception, Cognitive, Awareness)
 * - Core formulas: D(t) and RI(e,t)
 * - Affective Vector calculations
 * - Temporal decay functions
 * - Influence weighting
 * - Global indices (GMI, CFI, HRI)
 * - Emotional phase detection
 * - Early warning system
 */

// Main engine
export { 
  DCFTEngine, 
  dcftEngine, 
  analyzeDCFT, 
  analyzeTextDCFT, 
  analyzeTextsDCFT,
  type DCFTAnalysisResult 
} from './dcftEngine';

// Layer 1: Perception
export { 
  PerceptionLayer, 
  perceptionLayer,
  type RawDigitalInput,
  type PerceptionOutput 
} from './perceptionLayer';

// Layer 2: Cognitive
export { 
  CognitiveLayer, 
  cognitiveLayer,
  type DCFState,
  type EmotionalPhase 
} from './cognitiveLayer';

// Layer 3: Awareness
export { 
  AwarenessLayer, 
  awarenessLayer,
  type GlobalIndices,
  type AwarenessOutput,
  type AlertLevel 
} from './awarenessLayer';

// Affective Vector
export {
  type AffectiveVector,
  type EmotionEvent,
  normalizeToAV,
  avToDisplayScale,
  calculateAVMagnitude,
  getDominantEmotion,
  aggregateAVs,
  calculateEmotionalPolarity,
  calculateEmotionalIntensity
} from './affectiveVector';

// Temporal Decay
export {
  DECAY_RATES,
  DEFAULT_DECAY_RATE,
  calculateDecayFactor,
  calculateEmotionDecay,
  calculateTemporalPersistence,
  applyTimeDecay,
  calculateHalfLife,
  getEmotionHalfLives,
  calculateCumulativeDecay
} from './temporalDecay';

// Influence Weighting
export {
  SOURCE_WEIGHTS,
  calculateInfluenceWeight,
  calculateViralityScore,
  calculateGeographicInfluence,
  calculateCredibility,
  normalizeWeights
} from './influenceWeight';

// Meta-Learning System
export {
  MetaLearningEngine,
  metaLearningEngine,
  type LearnedVocabulary,
  type FeedbackEntry,
  type DiscoveredPattern,
  type LearningStats
} from './metaLearning';

// Vocabulary Adapter
export {
  VocabularyAdapter,
  vocabularyAdapter,
  type RegionalConfig,
  type ContextualVocabulary,
  type EmergingExpression
} from './vocabularyAdapter';

// Feedback Loop
export {
  FeedbackLoopManager,
  feedbackLoopManager,
  type UserFeedback,
  type AccuracyRecord,
  type ABTest
} from './feedbackLoop';
