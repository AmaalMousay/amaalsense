/**
 * AmalSense Emotional Intelligence Engine
 * 
 * 5 Core Engines:
 * 1. Context Classification - يفهم السياق قبل التحليل
 * 2. Emotion Fusion - يدمج التحليل العاطفي من مصادر متعددة
 * 3. Emotional Dynamics - يحسب الزخم والتقلب والاتجاه
 * 4. Driver Detection - يكتشف أسباب المشاعر
 * 5. Explainable Insight - يولد تفسيرات بشرية
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
