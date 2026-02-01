/**
 * AmalSense Emotional Intelligence Engine
 * 
 * Core Engines:
 * 0. Emotional Memory - يخزن التحليلات عبر الزمن
 * 1. Context Classification - يفهم السياق قبل التحليل
 * 2. Emotion Fusion - يدمج التحليل العاطفي من مصادر متعددة
 * 3. Emotional Dynamics - يحسب الزخم والتقلب والاتجاه
 * 4. Driver Detection - يكتشف أسباب المشاعر
 * 5. Explainable Insight - يولد تفسيرات بشرية
 * 
 * Support Systems:
 * - Source Weighting - أوزان المصادر
 * - Confidence Propagation - توريث الثقة
 * - Feedback Store - تخزين التغذية الراجعة
 * 
 * Unified API: analyze({ text, country, userType })
 */

// Engine 1: Context Classification
export { 
  classifyContext,
  type ContextResult,
  type ContentDomain,
  type EventType,
  type SensitivityLevel
} from './contextClassification';

// Engine 2: Emotion Fusion
export {
  fuseEmotions,
  type AffectiveVector,
  type EmotionFusionResult
} from './emotionFusion';

// Engine 3: Emotional Dynamics
export {
  analyzeEmotionalDynamics,
  type DynamicsResult,
  type TrendDirection,
  type MomentumLevel,
  type EmotionalSpike
} from './emotionalDynamics';

// Engine 4: Driver Detection
export {
  detectDrivers,
  type DriverDetectionResult,
  type KeyDriver,
  type RootCause,
  type Narrative,
  type RelatedEvent
} from './driverDetection';

// Engine 5: Explainable Insight
export {
  generateInsights,
  type ExplainableInsightResult,
  type UserType,
  type JournalistInsight,
  type ResearcherInsight,
  type TraderInsight,
  type GeneralInsight
} from './explainableInsight';

// Unified Analyzer
export {
  analyze,
  analyzeQuick,
  analyzeBatch,
  type AnalyzeInput,
  type AnalyzeOutput
} from './unifiedAnalyzer';

// Engine 0: Emotional Memory Layer
export {
  storeAnalysis,
  getHistoricalData,
  calculateHistoricalTrend,
  getLastAnalysis,
  getMemoryStats,
  type EmotionalMemoryEntry,
  type HistoricalQuery,
  type HistoricalTrend
} from './emotionalMemory';

// Source Weighting System
export {
  getSourceWeight,
  getSourceInfo,
  calculateCompositeWeight,
  calculateAggregateWeight,
  applySourceWeighting,
  knownSources,
  defaultWeightsByType,
  type Source,
  type SourceType
} from './sourceWeighting';

// Confidence Propagation System
export {
  calculateContextConfidence,
  calculateFusionConfidence,
  calculateDynamicsConfidence,
  calculateDriverConfidence,
  calculateInsightConfidence,
  calculateOverallConfidence,
  quickConfidenceScore,
  type EngineConfidence,
  type ConfidenceFactor,
  type OverallConfidence
} from './confidencePropagation';

// Feedback Store
export {
  addFeedback,
  submitEmotionCorrection,
  submitAccuracyRating,
  submitRelevanceRating,
  submitGeneralComment,
  getFeedbackForAnalysis,
  getFeedbackForTopic,
  getFeedbackStats,
  analyzeFeedbackPatterns,
  type FeedbackEntry,
  type FeedbackType,
  type FeedbackSentiment,
  type FeedbackStats
} from './feedbackStore';
