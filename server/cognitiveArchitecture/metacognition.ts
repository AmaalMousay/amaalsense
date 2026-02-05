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
