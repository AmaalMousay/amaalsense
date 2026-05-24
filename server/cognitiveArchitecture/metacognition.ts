import { getDb } from '../_core/db';
import { selfEvaluations } from '../drizzle/schema';
import { desc, avg, sql } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Layer 11: Metacognition
 * 
 * Self-awareness and system monitoring
 * Components:
 * - Performance tracking
 * - Confidence calibration
 * - Error detection and correction
 * - Learning rate optimization
 * Output: System health reports and improvement suggestions
 */

export interface PerformanceMetrics {
  predictionAccuracy: number; // 0-1
  responseCoherence: number; // 0-1
  userSatisfaction: number; // 0-1
  processingTime: number; // milliseconds
  memoryUsage: number; // percentage
}

export interface ConfidenceCalibration {
  predictedConfidence: number; // What the system thinks
  actualAccuracy: number; // What actually happened
  calibrationError: number; // Difference
  needsAdjustment: boolean;
}

export interface ErrorReport {
  errorType: 'prediction' | 'coherence' | 'context' | 'timing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedFix: string;
  timestamp: number;
}

export interface LearningRateConfig {
  currentRate: number;
  optimalRate: number;
  adjustmentNeeded: boolean;
  reason: string;
}

export interface SystemHealthReport {
  timestamp: number;
  overallHealth: number; // 0-100
  performance: PerformanceMetrics;
  confidence: ConfidenceCalibration;
  errors: ErrorReport[];
  learningRate: LearningRateConfig;
  recommendations: string[];
}

export interface MetacognitionState {
  performanceHistory: PerformanceMetrics[];
  confidenceHistory: ConfidenceCalibration[];
  errorHistory: ErrorReport[];
  learningRateHistory: number[];
  maxHistorySize: number;
}

/**
 * Initialize metacognition state
 */
export function initMetacognition(): MetacognitionState {
  return {
    performanceHistory: [],
    confidenceHistory: [],
    errorHistory: [],
    learningRateHistory: [0.01], // Start with default learning rate
    maxHistorySize: 1000,
  };
}

/**
 * Track performance metrics
 */
export function trackPerformance(
  state: MetacognitionState,
  metrics: PerformanceMetrics
): MetacognitionState {
  const updatedHistory = [...state.performanceHistory, metrics];
  
  // Keep only maxHistorySize recent entries
  const trimmedHistory = updatedHistory.slice(-state.maxHistorySize);
  
  return {
    ...state,
    performanceHistory: trimmedHistory,
  };
}

/**
 * Calibrate confidence
 */
export function calibrateConfidence(
  state: MetacognitionState,
  predictedConfidence: number,
  actualAccuracy: number
): {
  state: MetacognitionState;
  calibration: ConfidenceCalibration;
} {
  const calibrationError = Math.abs(predictedConfidence - actualAccuracy);
  const needsAdjustment = calibrationError > 0.2; // Threshold for adjustment
  
  const calibration: ConfidenceCalibration = {
    predictedConfidence,
    actualAccuracy,
    calibrationError,
    needsAdjustment,
  };
  
  const updatedHistory = [...state.confidenceHistory, calibration];
  const trimmedHistory = updatedHistory.slice(-state.maxHistorySize);
  
  return {
    state: {
      ...state,
      confidenceHistory: trimmedHistory,
    },
    calibration,
  };
}

/**
 * Detect and report errors
 */
export function detectError(
  state: MetacognitionState,
  errorType: ErrorReport['errorType'],
  severity: ErrorReport['severity'],
  description: string,
  suggestedFix: string
): MetacognitionState {
  const error: ErrorReport = {
    errorType,
    severity,
    description,
    suggestedFix,
    timestamp: Date.now(),
  };
  
  const updatedHistory = [...state.errorHistory, error];
  const trimmedHistory = updatedHistory.slice(-state.maxHistorySize);
  
  return {
    ...state,
    errorHistory: trimmedHistory,
  };
}

/**
 * Optimize learning rate
 */
export function optimizeLearningRate(
  state: MetacognitionState
): {
  state: MetacognitionState;
  config: LearningRateConfig;
} {
  // Get recent performance metrics
  const recentMetrics = state.performanceHistory.slice(-10);
  
  if (recentMetrics.length < 5) {
    // Not enough data yet
    return {
      state,
      config: {
        currentRate: state.learningRateHistory[state.learningRateHistory.length - 1],
        optimalRate: state.learningRateHistory[state.learningRateHistory.length - 1],
        adjustmentNeeded: false,
        reason: 'Not enough data for optimization',
      },
    };
  }
  
  // Calculate average accuracy
  const avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.predictionAccuracy, 0) / recentMetrics.length;
  
  // Calculate trend (improving or declining)
  const firstHalf = recentMetrics.slice(0, Math.floor(recentMetrics.length / 2));
  const secondHalf = recentMetrics.slice(Math.floor(recentMetrics.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, m) => sum + m.predictionAccuracy, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, m) => sum + m.predictionAccuracy, 0) / secondHalf.length;
  
  const trend = secondAvg - firstAvg;
  
  // Current learning rate
  const currentRate = state.learningRateHistory[state.learningRateHistory.length - 1];
  
  // Determine optimal learning rate
  let optimalRate = currentRate;
  let adjustmentNeeded = false;
  let reason = 'Learning rate is optimal';
  
  if (avgAccuracy < 0.6) {
    // Low accuracy - increase learning rate
    optimalRate = Math.min(currentRate * 1.5, 0.1);
    adjustmentNeeded = true;
    reason = 'Low accuracy detected - increasing learning rate';
  } else if (avgAccuracy > 0.9 && trend > 0) {
    // High accuracy and improving - decrease learning rate for fine-tuning
    optimalRate = Math.max(currentRate * 0.8, 0.001);
    adjustmentNeeded = true;
    reason = 'High accuracy achieved - decreasing learning rate for fine-tuning';
  } else if (trend < -0.1) {
    // Declining performance - adjust learning rate
    optimalRate = currentRate * 0.7;
    adjustmentNeeded = true;
    reason = 'Performance declining - reducing learning rate';
  }
  
  // Update state
  const updatedHistory = [...state.learningRateHistory, optimalRate];
  const trimmedHistory = updatedHistory.slice(-state.maxHistorySize);
  
  return {
    state: {
      ...state,
      learningRateHistory: trimmedHistory,
    },
    config: {
      currentRate,
      optimalRate,
      adjustmentNeeded,
      reason,
    },
  };
}

/**
 * Generate system health report
 */
export function generateHealthReport(
  state: MetacognitionState
): SystemHealthReport {
  // Calculate overall health
  const recentPerformance = state.performanceHistory.slice(-10);
  const recentErrors = state.errorHistory.filter(e => 
    Date.now() - e.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
  );
  
  let overallHealth = 100;
  
  // Deduct for low performance
  if (recentPerformance.length > 0) {
    const avgAccuracy = recentPerformance.reduce((sum, m) => sum + m.predictionAccuracy, 0) / recentPerformance.length;
    if (avgAccuracy < 0.6) {
      overallHealth -= 30;
    } else if (avgAccuracy < 0.8) {
      overallHealth -= 15;
    }
  }
  
  // Deduct for errors
  const criticalErrors = recentErrors.filter(e => e.severity === 'critical').length;
  const highErrors = recentErrors.filter(e => e.severity === 'high').length;
  overallHealth -= criticalErrors * 20;
  overallHealth -= highErrors * 10;
  
  // Ensure health is between 0 and 100
  overallHealth = Math.max(0, Math.min(100, overallHealth));
  
  // Get latest metrics
  const latestPerformance = recentPerformance[recentPerformance.length - 1] || {
    predictionAccuracy: 0,
    responseCoherence: 0,
    userSatisfaction: 0,
    processingTime: 0,
    memoryUsage: 0,
  };
  
  // Get latest confidence calibration
  const latestConfidence = state.confidenceHistory[state.confidenceHistory.length - 1] || {
    predictedConfidence: 0,
    actualAccuracy: 0,
    calibrationError: 0,
    needsAdjustment: false,
  };
  
  // Get learning rate config
  const { config: learningRate } = optimizeLearningRate(state);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (overallHealth < 70) {
    recommendations.push('⚠️ صحة النظام منخفضة - يُنصح بإجراء صيانة');
  }
  
  if (latestPerformance.predictionAccuracy < 0.7) {
    recommendations.push('📉 دقة التنبؤ منخفضة - يُنصح بإعادة التدريب');
  }
  
  if (latestConfidence.needsAdjustment) {
    recommendations.push('🎯 معايرة الثقة مطلوبة - الفرق بين التنبؤ والواقع كبير');
  }
  
  if (criticalErrors > 0) {
    recommendations.push(`🚨 ${criticalErrors} أخطاء حرجة تحتاج معالجة فورية`);
  }
  
  if (learningRate.adjustmentNeeded) {
    recommendations.push(`📚 ${learningRate.reason}`);
  }
  
  if (latestPerformance.processingTime > 5000) {
    recommendations.push('⏱️ وقت المعالجة طويل - يُنصح بتحسين الأداء');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ النظام يعمل بشكل مثالي');
  }
  
  return {
    timestamp: Date.now(),
    overallHealth,
    performance: latestPerformance,
    confidence: latestConfidence,
    errors: recentErrors,
    learningRate,
    recommendations,
  };
}

/**
 * Analyze performance trends
 */
export function analyzePerformanceTrends(
  state: MetacognitionState,
  windowSize: number = 20
): {
  trend: 'improving' | 'stable' | 'declining';
  changeRate: number;
  confidence: number;
} {
  const recentMetrics = state.performanceHistory.slice(-windowSize);
  
  if (recentMetrics.length < 5) {
    return {
      trend: 'stable',
      changeRate: 0,
      confidence: 0,
    };
  }
  
  // Calculate linear regression
  const n = recentMetrics.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = recentMetrics.map(m => m.predictionAccuracy);
  
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Determine trend
  let trend: 'improving' | 'stable' | 'declining';
  if (slope > 0.01) {
    trend = 'improving';
  } else if (slope < -0.01) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }
  
  // Calculate confidence (R-squared)
  const meanY = sumY / n;
  const ssTotal = y.reduce((sum, val) => sum + (val - meanY) ** 2, 0);
  const ssResidual = y.reduce((sum, val, i) => {
    const predicted = slope * x[i] + (sumY - slope * sumX) / n;
    return sum + (val - predicted) ** 2;
  }, 0);
  
  const rSquared = 1 - (ssResidual / ssTotal);
  const confidence = Math.max(0, Math.min(1, rSquared));
  
  return {
    trend,
    changeRate: slope,
    confidence,
  };
}

/**
 * Get error statistics
 */
export function getErrorStatistics(
  state: MetacognitionState,
  timeWindow: number = 7 * 24 * 60 * 60 * 1000 // 7 days
): {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  mostCommonError: string | null;
} {
  const now = Date.now();
  const recentErrors = state.errorHistory.filter(e => 
    now - e.timestamp < timeWindow
  );
  
  const errorsByType: Record<string, number> = {};
  const errorsBySeverity: Record<string, number> = {};
  
  for (const error of recentErrors) {
    errorsByType[error.errorType] = (errorsByType[error.errorType] || 0) + 1;
    errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
  }
  
  // Find most common error type
  let mostCommonError: string | null = null;
  let maxCount = 0;
  
  for (const [type, count] of Object.entries(errorsByType)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonError = type;
    }
  }
  
  return {
    totalErrors: recentErrors.length,
    errorsByType,
    errorsBySeverity,
    mostCommonError,
  };
}


// =============================================================================
// ANALYSIS CONFIDENCE ASSESSMENT (merged from layer11_metacognition.ts)
// =============================================================================

/**
 * Layer 11: Metacognition (Self-Awareness)
 * 
 * In Human Brain: Thinking about thinking, self-evaluation, confidence assessment
 * In AmalSense: Evaluates quality of analysis, confidence levels, identifies biases
 * 
 * This is the "consciousness" layer - the system that watches the system
 */

// ============================================
// TYPES
// ============================================

export interface MetacognitiveAssessment {
  // Overall confidence in the response
  overallConfidence: number;  // 0-1
  confidenceLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  
  // Data quality assessment
  dataQuality: DataQualityAssessment;
  
  // Reasoning quality assessment
  reasoningQuality: ReasoningQualityAssessment;
  
  // Potential biases detected
  biases: DetectedBias[];
  
  // Limitations of this analysis
  limitations: string[];
  
  // Suggestions for improvement
  suggestions: string[];
  
  // Should we ask for more information?
  needsMoreInfo: boolean;
  infoNeeded?: string[];
  
  // Self-critique
  selfCritique: string;
}

export interface DataQualityAssessment {
  score: number;  // 0-1
  factors: {
    recency: number;      // How recent is the data?
    completeness: number; // Do we have all needed data?
    reliability: number;  // How reliable are the sources?
    relevance: number;    // How relevant to the question?
  };
  issues: string[];
}

export interface ReasoningQualityAssessment {
  score: number;  // 0-1
  factors: {
    logicalCoherence: number;   // Is the reasoning logical?
    evidenceSupport: number;    // Is it supported by evidence?
    alternativesConsidered: number; // Did we consider alternatives?
    uncertaintyAcknowledged: number; // Did we acknowledge uncertainty?
  };
  issues: string[];
}

export interface DetectedBias {
  type: BiasType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export type BiasType = 
  | 'recency_bias'           // Over-weighting recent events
  | 'confirmation_bias'      // Seeking confirming evidence
  | 'availability_bias'      // Over-weighting easily recalled info
  | 'anchoring_bias'         // Over-relying on first piece of info
  | 'optimism_bias'          // Underestimating risks
  | 'pessimism_bias'         // Overestimating risks
  | 'herd_mentality'         // Following the crowd
  | 'authority_bias'         // Over-trusting authority sources
  | 'data_insufficiency'     // Not enough data to conclude
  | 'oversimplification';    // Making complex things too simple

// ============================================
// MAIN METACOGNITION FUNCTION
// ============================================

/**
 * Perform metacognitive assessment of an analysis
 */
export function assessAnalysis(context: {
  question: string;
  topic: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
  enginesActivated: string[];
  causalChainsUsed: number;
  knowledgeItemsUsed: number;
  responseLength: number;
  hasDecisionSignal: boolean;
  hasRecommendation: boolean;
}): MetacognitiveAssessment {
  
  // Assess data quality
  const dataQuality = assessDataQuality(context);
  
  // Assess reasoning quality
  const reasoningQuality = assessReasoningQuality(context);
  
  // Detect biases
  const biases = detectBiases(context);
  
  // Identify limitations
  const limitations = identifyLimitations(context);
  
  // Generate suggestions
  const suggestions = generateSuggestions(context, dataQuality, reasoningQuality);
  
  // Calculate overall confidence
  const overallConfidence = calculateOverallConfidence(
    dataQuality.score,
    reasoningQuality.score,
    biases.length
  );
  
  // Determine confidence level
  const confidenceLevel = getConfidenceLevel(overallConfidence);
  
  // Check if more info needed
  const { needsMoreInfo, infoNeeded } = checkInfoNeeds(context, dataQuality);
  
  // Generate self-critique
  const selfCritique = generateSelfCritique(
    overallConfidence,
    biases,
    limitations,
    context
  );
  
  return {
    overallConfidence,
    confidenceLevel,
    dataQuality,
    reasoningQuality,
    biases,
    limitations,
    suggestions,
    needsMoreInfo,
    infoNeeded,
    selfCritique
  };
}

// ============================================
// ASSESSMENT FUNCTIONS
// ============================================

function assessDataQuality(context: {
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
  knowledgeItemsUsed: number;
}): DataQualityAssessment {
  const issues: string[] = [];
  
  // Recency - do we have current data?
  let recency = 0.7; // Default assumption
  if (context.indicators.gmi !== undefined) {
    recency = 0.9; // We have live indicators
  }
  
  // Completeness - do we have all indicators?
  let completeness = 0;
  if (context.indicators.gmi !== undefined) completeness += 0.33;
  if (context.indicators.cfi !== undefined) completeness += 0.33;
  if (context.indicators.hri !== undefined) completeness += 0.34;
  
  if (completeness < 0.5) {
    issues.push('بعض المؤشرات الأساسية غير متوفرة');
  }
  
  // Reliability - based on sources
  let reliability = 0.6; // Base reliability
  if (context.sourcesUsed.length > 0) {
    reliability = Math.min(0.9, 0.6 + context.sourcesUsed.length * 0.1);
  }
  
  // Relevance - based on knowledge items used
  let relevance = Math.min(1, context.knowledgeItemsUsed / 5);
  if (context.knowledgeItemsUsed === 0) {
    issues.push('لم يتم استخدام معرفة محددة للموضوع');
    relevance = 0.3;
  }
  
  const score = (recency + completeness + reliability + relevance) / 4;
  
  return {
    score,
    factors: { recency, completeness, reliability, relevance },
    issues
  };
}

function assessReasoningQuality(context: {
  enginesActivated: string[];
  causalChainsUsed: number;
  hasDecisionSignal: boolean;
  hasRecommendation: boolean;
  responseLength: number;
}): ReasoningQualityAssessment {
  const issues: string[] = [];
  
  // Logical coherence - based on engines used
  let logicalCoherence = Math.min(1, context.enginesActivated.length / 4);
  if (context.enginesActivated.length < 2) {
    issues.push('تحليل سطحي - محركات قليلة مفعّلة');
  }
  
  // Evidence support - based on causal chains
  let evidenceSupport = Math.min(1, context.causalChainsUsed / 3);
  if (context.causalChainsUsed === 0) {
    issues.push('لا توجد سلاسل سببية تدعم الاستنتاج');
    evidenceSupport = 0.2;
  }
  
  // Alternatives considered - check for scenario engine
  let alternativesConsidered = 0.5;
  if (context.enginesActivated.includes('scenario_engine')) {
    alternativesConsidered = 0.9;
  }
  
  // Uncertainty acknowledged - based on response completeness
  let uncertaintyAcknowledged = 0.5;
  if (context.hasDecisionSignal && context.hasRecommendation) {
    uncertaintyAcknowledged = 0.8;
  }
  
  const score = (logicalCoherence + evidenceSupport + alternativesConsidered + uncertaintyAcknowledged) / 4;
  
  return {
    score,
    factors: { logicalCoherence, evidenceSupport, alternativesConsidered, uncertaintyAcknowledged },
    issues
  };
}

function detectBiases(context: {
  question: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
}): DetectedBias[] {
  const biases: DetectedBias[] = [];
  
  // Check for data insufficiency
  if (context.sourcesUsed.length < 2) {
    biases.push({
      type: 'data_insufficiency',
      description: 'الاعتماد على مصادر محدودة قد يؤدي لرؤية غير مكتملة',
      severity: 'medium',
      mitigation: 'البحث عن مصادر إضافية للتحقق'
    });
  }
  
  // Check for recency bias
  if (context.question.includes('الآن') || context.question.includes('اليوم')) {
    biases.push({
      type: 'recency_bias',
      description: 'التركيز على الأحداث الأخيرة قد يتجاهل الأنماط طويلة المدى',
      severity: 'low',
      mitigation: 'مراجعة السياق التاريخي'
    });
  }
  
  // Check for extreme indicators (might indicate herd mentality in data)
  if (context.indicators.cfi && context.indicators.cfi > 80) {
    biases.push({
      type: 'herd_mentality',
      description: 'مؤشر الخوف مرتفع جداً - قد يعكس ذعر جماعي مبالغ فيه',
      severity: 'medium',
      mitigation: 'التحقق من الأسباب الحقيقية وراء الخوف'
    });
  }
  
  if (context.indicators.hri && context.indicators.hri > 80) {
    biases.push({
      type: 'optimism_bias',
      description: 'مؤشر الأمل مرتفع جداً - قد يعكس تفاؤل مفرط',
      severity: 'medium',
      mitigation: 'مراجعة المخاطر المحتملة'
    });
  }
  
  return biases;
}

function identifyLimitations(context: {
  topic: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  knowledgeItemsUsed: number;
}): string[] {
  const limitations: string[] = [];
  
  // General limitations
  limitations.push('التحليل يعتمد على البيانات المتاحة وقت الاستعلام');
  
  // Missing indicators
  if (context.indicators.gmi === undefined) {
    limitations.push('مؤشر المزاج العام غير متوفر');
  }
  if (context.indicators.cfi === undefined) {
    limitations.push('مؤشر الخوف الجماعي غير متوفر');
  }
  if (context.indicators.hri === undefined) {
    limitations.push('مؤشر الأمل غير متوفر');
  }
  
  // Knowledge limitations
  if (context.knowledgeItemsUsed < 3) {
    limitations.push('المعرفة المتوفرة عن هذا الموضوع محدودة');
  }
  
  // Prediction limitations
  limitations.push('التوقعات المستقبلية تحمل درجة من عدم اليقين');
  
  return limitations;
}

function generateSuggestions(
  context: { question: string; topic: string },
  dataQuality: DataQualityAssessment,
  reasoningQuality: ReasoningQualityAssessment
): string[] {
  const suggestions: string[] = [];
  
  if (dataQuality.score < 0.6) {
    suggestions.push('يُنصح بالبحث عن مصادر إضافية للتحقق');
  }
  
  if (reasoningQuality.score < 0.6) {
    suggestions.push('يُنصح بتحليل أعمق للعوامل المؤثرة');
  }
  
  if (dataQuality.factors.recency < 0.7) {
    suggestions.push('التحقق من أحدث التطورات قبل اتخاذ قرار');
  }
  
  return suggestions;
}

function calculateOverallConfidence(
  dataQuality: number,
  reasoningQuality: number,
  biasCount: number
): number {
  // Base confidence from data and reasoning
  let confidence = (dataQuality * 0.4 + reasoningQuality * 0.4);
  
  // Penalty for biases
  const biasPenalty = Math.min(0.3, biasCount * 0.1);
  confidence -= biasPenalty;
  
  // Add base confidence
  confidence += 0.2;
  
  return Math.max(0.1, Math.min(1, confidence));
}

function getConfidenceLevel(confidence: number): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  if (confidence < 0.3) return 'very_low';
  if (confidence < 0.5) return 'low';
  if (confidence < 0.7) return 'medium';
  if (confidence < 0.85) return 'high';
  return 'very_high';
}

function checkInfoNeeds(
  context: { question: string; topic: string },
  dataQuality: DataQualityAssessment
): { needsMoreInfo: boolean; infoNeeded?: string[] } {
  const infoNeeded: string[] = [];
  
  if (dataQuality.factors.completeness < 0.5) {
    infoNeeded.push('مؤشرات إضافية عن الموضوع');
  }
  
  if (dataQuality.factors.relevance < 0.5) {
    infoNeeded.push('معلومات أكثر تحديداً عن السياق');
  }
  
  // Check if question is too vague
  if (context.question.length < 20) {
    infoNeeded.push('تفاصيل أكثر عن السؤال');
  }
  
  return {
    needsMoreInfo: infoNeeded.length > 0,
    infoNeeded: infoNeeded.length > 0 ? infoNeeded : undefined
  };
}

function generateSelfCritique(
  confidence: number,
  biases: DetectedBias[],
  limitations: string[],
  context: { question: string; topic: string }
): string {
  const parts: string[] = [];
  
  // Confidence statement
  if (confidence < 0.5) {
    parts.push('هذا التحليل يحمل درجة عالية من عدم اليقين');
  } else if (confidence < 0.7) {
    parts.push('هذا التحليل معقول لكنه يحتاج تحقق إضافي');
  } else {
    parts.push('هذا التحليل مدعوم بشكل جيد بالبيانات المتاحة');
  }
  
  // Bias acknowledgment
  if (biases.length > 0) {
    const highSeverity = biases.filter(b => b.severity === 'high');
    if (highSeverity.length > 0) {
      parts.push(`تحذير: ${highSeverity[0].description}`);
    }
  }
  
  // Key limitation
  if (limitations.length > 2) {
    parts.push('ملاحظة: هناك عدة قيود على هذا التحليل');
  }
  
  return parts.join('. ');
}

// ============================================
// CONFIDENCE DISPLAY HELPERS
// ============================================

/**
 * Get confidence indicator for display
 */
export function getConfidenceIndicator(assessment: MetacognitiveAssessment): {
  emoji: string;
  label: string;
  color: string;
} {
  switch (assessment.confidenceLevel) {
    case 'very_high':
      return { emoji: '🟢', label: 'ثقة عالية جداً', color: 'green' };
    case 'high':
      return { emoji: '🟢', label: 'ثقة عالية', color: 'green' };
    case 'medium':
      return { emoji: '🟡', label: 'ثقة متوسطة', color: 'yellow' };
    case 'low':
      return { emoji: '🟠', label: 'ثقة منخفضة', color: 'orange' };
    case 'very_low':
      return { emoji: '🔴', label: 'ثقة منخفضة جداً', color: 'red' };
  }
}

/**
 * Format assessment for display
 */
export function formatAssessmentForDisplay(assessment: MetacognitiveAssessment): string {
  const indicator = getConfidenceIndicator(assessment);
  const parts: string[] = [];
  
  parts.push(`${indicator.emoji} ${indicator.label} (${Math.round(assessment.overallConfidence * 100)}%)`);
  
  if (assessment.biases.length > 0) {
    parts.push(`\n⚠️ تنبيهات: ${assessment.biases.map(b => b.description).join('، ')}`);
  }
  
  if (assessment.selfCritique) {
    parts.push(`\n💭 ${assessment.selfCritique}`);
  }
  
  return parts.join('');
}

/**
 * Should we show confidence to user?
 */
export function shouldShowConfidence(assessment: MetacognitiveAssessment): boolean {
  // Always show if confidence is low or there are significant biases
  if (assessment.confidenceLevel === 'low' || assessment.confidenceLevel === 'very_low') {
    return true;
  }
  
  if (assessment.biases.some(b => b.severity === 'high')) {
    return true;
  }
  
  // Show for medium confidence
  if (assessment.confidenceLevel === 'medium') {
    return true;
  }
  
  return false;
}


// =============================================================================
// SELF-EVALUATION (merged from selfEvaluation.ts)
// =============================================================================

/**
 * Self-Evaluation - الوعي الذاتي
 * 
 * الحلقة الثانية في نظام التطور الذاتي
 * النظام يسأل نفسه بعد كل رد: هل كنت جيداً؟
 * 
 * "النظام يتطور لأنه يشك في نفسه"
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SelfEvaluationInput {
  question: string;
  response: string;
  newsSourcesCount: number;
  relevantHeadlinesCount: number;
  causesFromData: boolean;
  hasSpecificExamples: boolean;
  madeDecision: boolean;
  confidenceLevel: number; // 0-100
}

export interface SelfEvaluationResult {
  questionHash: string;
  confidenceScore: number;
  dataSufficiencyScore: number;
  causesFromDataScore: number;
  analysisVsNarrationScore: number;
  overallScore: number;
  identifiedWeaknesses: string[];
  identifiedStrengths: string[];
  improvementSuggestions: string[];
}

export interface SelfEvaluationSummary {
  averageConfidence: number;
  averageDataSufficiency: number;
  averageCausesFromData: number;
  averageAnalysisVsNarration: number;
  averageOverall: number;
  commonWeaknesses: string[];
  commonStrengths: string[];
}

// ============================================================================
// SELF-EVALUATION LOGIC
// ============================================================================

/**
 * تقييم ذاتي للرد
 * النظام يسأل نفسه: هل كنت جيداً في هذا الرد؟
 */
export function evaluateSelf(input: SelfEvaluationInput): SelfEvaluationResult {
  const weaknesses: string[] = [];
  const strengths: string[] = [];
  const suggestions: string[] = [];

  // 1. تقييم الثقة
  const confidenceScore = input.confidenceLevel;
  if (confidenceScore >= 70) {
    strengths.push('ثقة عالية في التحليل');
  } else if (confidenceScore < 40) {
    weaknesses.push('ثقة منخفضة في التحليل');
    suggestions.push('جمع المزيد من البيانات قبل الإجابة');
  }

  // 2. تقييم كفاية البيانات
  let dataSufficiencyScore = 0;
  if (input.newsSourcesCount >= 3) {
    dataSufficiencyScore = 100;
    strengths.push('مصادر متعددة للبيانات');
  } else if (input.newsSourcesCount >= 2) {
    dataSufficiencyScore = 70;
  } else if (input.newsSourcesCount >= 1) {
    dataSufficiencyScore = 40;
    weaknesses.push('مصادر قليلة للبيانات');
    suggestions.push('توسيع نطاق البحث ليشمل مصادر أكثر');
  } else {
    dataSufficiencyScore = 10;
    weaknesses.push('لا توجد مصادر بيانات');
    suggestions.push('التأكد من عمل خدمات جلب الأخبار');
  }

  // تعديل بناءً على عدد العناوين المتعلقة
  if (input.relevantHeadlinesCount >= 5) {
    dataSufficiencyScore = Math.min(100, dataSufficiencyScore + 20);
    strengths.push('عناوين متعددة متعلقة بالموضوع');
  } else if (input.relevantHeadlinesCount < 2) {
    dataSufficiencyScore = Math.max(0, dataSufficiencyScore - 20);
    weaknesses.push('عناوين قليلة متعلقة بالموضوع');
    suggestions.push('تحسين Query Builder لجلب أخبار أكثر صلة');
  }

  // 3. تقييم: هل الأسباب جاءت من البيانات؟
  let causesFromDataScore = 0;
  if (input.causesFromData) {
    causesFromDataScore = 100;
    strengths.push('الأسباب مستخرجة من البيانات الحقيقية');
  } else {
    causesFromDataScore = 20;
    weaknesses.push('الأسباب من قوالب ثابتة وليس من البيانات');
    suggestions.push('ربط Why Layer بالبيانات الحقيقية');
  }

  // 4. تقييم: تحليل أم سرد؟
  let analysisVsNarrationScore = 0;
  if (input.madeDecision && input.hasSpecificExamples) {
    analysisVsNarrationScore = 100;
    strengths.push('تحليل عميق مع قرار واضح');
  } else if (input.madeDecision) {
    analysisVsNarrationScore = 70;
    strengths.push('قرار واضح');
    weaknesses.push('نقص في الأمثلة المحددة');
    suggestions.push('إضافة أمثلة من الأخبار الحقيقية');
  } else if (input.hasSpecificExamples) {
    analysisVsNarrationScore = 50;
    weaknesses.push('سرد بدون قرار واضح');
    suggestions.push('تحسين Decision Engine ليحسم ويرجح');
  } else {
    analysisVsNarrationScore = 20;
    weaknesses.push('سرد عام بدون تحليل أو قرار');
    suggestions.push('إعادة هيكلة الرد ليكون تحليلياً');
  }

  // حساب النتيجة الإجمالية
  const overallScore = Math.round(
    (confidenceScore * 0.2) +
    (dataSufficiencyScore * 0.3) +
    (causesFromDataScore * 0.3) +
    (analysisVsNarrationScore * 0.2)
  );

  // إضافة تقييم عام
  if (overallScore >= 80) {
    strengths.push('أداء ممتاز بشكل عام');
  } else if (overallScore >= 60) {
    strengths.push('أداء جيد مع مجال للتحسين');
  } else if (overallScore >= 40) {
    weaknesses.push('أداء متوسط يحتاج تحسين');
  } else {
    weaknesses.push('أداء ضعيف يحتاج إصلاح جذري');
  }

  return {
    questionHash: crypto.createHash('sha256').update(input.question).digest('hex').substring(0, 64),
    confidenceScore,
    dataSufficiencyScore,
    causesFromDataScore,
    analysisVsNarrationScore,
    overallScore,
    identifiedWeaknesses: weaknesses,
    identifiedStrengths: strengths,
    improvementSuggestions: suggestions,
  };
}

/**
 * حفظ التقييم الذاتي في قاعدة البيانات
 */
export async function saveSelfEvaluation(
  input: SelfEvaluationInput,
  evaluation: SelfEvaluationResult
): Promise<{ success: boolean; id?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };

    const result = await db.insert(selfEvaluations).values({
      questionHash: evaluation.questionHash,
      question: input.question,
      confidenceScore: evaluation.confidenceScore,
      dataSufficiencyScore: evaluation.dataSufficiencyScore,
      causesFromDataScore: evaluation.causesFromDataScore,
      analysisVsNarrationScore: evaluation.analysisVsNarrationScore,
      overallScore: evaluation.overallScore,
      identifiedWeaknesses: JSON.stringify(evaluation.identifiedWeaknesses),
      identifiedStrengths: JSON.stringify(evaluation.identifiedStrengths),
      improvementSuggestions: JSON.stringify(evaluation.improvementSuggestions),
      newsSourcesCount: input.newsSourcesCount,
      relevantHeadlinesCount: input.relevantHeadlinesCount,
    });

    return { success: true, id: Number((result as any).insertId) };
  } catch (error) {
    console.error('[SelfEvaluation] Error saving evaluation:', error);
    return { success: false };
  }
}

/**
 * تقييم وحفظ في خطوة واحدة
 */
export async function evaluateAndSave(input: SelfEvaluationInput): Promise<SelfEvaluationResult> {
  const evaluation = evaluateSelf(input);
  await saveSelfEvaluation(input, evaluation);
  return evaluation;
}

// ============================================================================
// ANALYSIS & REPORTING
// ============================================================================

/**
 * جلب ملخص التقييمات الذاتية
 */
export async function getSelfEvaluationSummary(): Promise<SelfEvaluationSummary> {
  try {
    const db = await getDb();
    if (!db) return {
      averageConfidence: 0,
      averageDataSufficiency: 0,
      averageCausesFromData: 0,
      averageAnalysisVsNarration: 0,
      averageOverall: 0,
      commonWeaknesses: [],
      commonStrengths: [],
    };

    // حساب المتوسطات
    const averages = await db
      .select({
        avgConfidence: avg(selfEvaluations.confidenceScore),
        avgDataSufficiency: avg(selfEvaluations.dataSufficiencyScore),
        avgCausesFromData: avg(selfEvaluations.causesFromDataScore),
        avgAnalysisVsNarration: avg(selfEvaluations.analysisVsNarrationScore),
        avgOverall: avg(selfEvaluations.overallScore),
      })
      .from(selfEvaluations);

    // جلب آخر 50 تقييم لتحليل نقاط القوة والضعف
    const recentEvaluations = await db
      .select({
        weaknesses: selfEvaluations.identifiedWeaknesses,
        strengths: selfEvaluations.identifiedStrengths,
      })
      .from(selfEvaluations)
      .orderBy(desc(selfEvaluations.createdAt))
      .limit(50);

    // تجميع نقاط الضعف الشائعة
    const weaknessCount: Record<string, number> = {};
    const strengthCount: Record<string, number> = {};

    for (const eval_ of recentEvaluations) {
      try {
        const weaknesses = JSON.parse(eval_.weaknesses || '[]');
        const strengths = JSON.parse(eval_.strengths || '[]');

        for (const w of weaknesses) {
          weaknessCount[w] = (weaknessCount[w] || 0) + 1;
        }
        for (const s of strengths) {
          strengthCount[s] = (strengthCount[s] || 0) + 1;
        }
      } catch {
        // تجاهل الأخطاء في parsing
      }
    }

    // ترتيب حسب التكرار
    const commonWeaknesses = Object.entries(weaknessCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([weakness]) => weakness);

    const commonStrengths = Object.entries(strengthCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([strength]) => strength);

    return {
      averageConfidence: Math.round(Number(averages[0]?.avgConfidence) || 0),
      averageDataSufficiency: Math.round(Number(averages[0]?.avgDataSufficiency) || 0),
      averageCausesFromData: Math.round(Number(averages[0]?.avgCausesFromData) || 0),
      averageAnalysisVsNarration: Math.round(Number(averages[0]?.avgAnalysisVsNarration) || 0),
      averageOverall: Math.round(Number(averages[0]?.avgOverall) || 0),
      commonWeaknesses,
      commonStrengths,
    };
  } catch (error) {
    console.error('[SelfEvaluation] Error getting summary:', error);
    return {
      averageConfidence: 0,
      averageDataSufficiency: 0,
      averageCausesFromData: 0,
      averageAnalysisVsNarration: 0,
      averageOverall: 0,
      commonWeaknesses: [],
      commonStrengths: [],
    };
  }
}

/**
 * جلب التقييمات الضعيفة للتعلم منها
 */
export async function getLowScoringEvaluations(limit: number = 20): Promise<typeof selfEvaluations.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(selfEvaluations)
      .where(sql`${selfEvaluations.overallScore} < 50`)
      .orderBy(desc(selfEvaluations.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[SelfEvaluation] Error getting low-scoring evaluations:', error);
    return [];
  }
}
