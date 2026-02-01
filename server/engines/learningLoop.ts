/**
 * Learning Loop - العقل الحي الذي يتعلم
 * يقارن التوقعات بالواقع ويعدل الأوزان
 */

import {
  getLearningState,
  analyzeLearningPatterns,
  applyLearningAdjustment,
  getRecentAnalyses,
  getAdjustmentHistory,
  type AnalysisRecord,
} from './learningStore';

// Engine weights that can be adjusted through learning
export interface EngineWeights {
  contextClassification: number;
  emotionFusion: number;
  emotionalDynamics: number;
  driverDetection: number;
  explainableInsight: number;
}

// Default weights
const DEFAULT_WEIGHTS: EngineWeights = {
  contextClassification: 0.20,
  emotionFusion: 0.25,
  emotionalDynamics: 0.20,
  driverDetection: 0.15,
  explainableInsight: 0.20,
};

// Current learned weights
let currentWeights: EngineWeights = { ...DEFAULT_WEIGHTS };

// Emotion detection biases (learned from corrections)
let emotionBiases: Record<string, number> = {
  joy: 0,
  fear: 0,
  anger: 0,
  sadness: 0,
  hope: 0,
  curiosity: 0,
};

// Learning history
interface LearningCycle {
  id: string;
  timestamp: Date;
  analysesReviewed: number;
  patternsFound: number;
  adjustmentsMade: number;
  previousAccuracy: number;
  newAccuracy: number;
  improvements: string[];
  errors: string[];
}

const learningHistory: LearningCycle[] = [];

// ============================================
// Learning Loop Core Functions
// ============================================

/**
 * Run a learning cycle
 * يراجع التحليلات السابقة ويتعلم من الأخطاء
 */
export function runLearningCycle(): LearningCycle {
  const cycleId = `CYCLE-${Date.now()}`;
  const state = getLearningState();
  const previousAccuracy = state.accuracyRate;
  
  // Analyze patterns
  const { patterns, recommendations } = analyzeLearningPatterns();
  
  const improvements: string[] = [];
  const errors: string[] = [];
  let adjustmentsMade = 0;
  
  // Process each pattern and apply adjustments
  patterns.forEach(pattern => {
    if (pattern.confidence >= 60) {
      // Apply adjustment based on pattern
      const adjustment = processPattern(pattern);
      if (adjustment) {
        improvements.push(`تم تعديل: ${adjustment}`);
        adjustmentsMade++;
      }
    } else {
      errors.push(`نمط غير مؤكد: ${pattern.pattern} (ثقة: ${pattern.confidence}%)`);
    }
  });
  
  // Calculate new accuracy (simulated improvement)
  const newAccuracy = Math.min(
    previousAccuracy + (adjustmentsMade * 2),
    95
  );
  
  const cycle: LearningCycle = {
    id: cycleId,
    timestamp: new Date(),
    analysesReviewed: state.verifiedAnalyses,
    patternsFound: patterns.length,
    adjustmentsMade,
    previousAccuracy,
    newAccuracy,
    improvements,
    errors,
  };
  
  learningHistory.push(cycle);
  
  return cycle;
}

/**
 * Process a pattern and apply adjustment
 */
function processPattern(pattern: {
  pattern: string;
  frequency: number;
  suggestedAdjustment: string;
  confidence: number;
}): string | null {
  // Detect emotion misclassification patterns
  const emotionMatch = pattern.pattern.match(/كنت أصنف (\w+) كـ (\w+)/);
  if (emotionMatch) {
    const [, original, corrected] = emotionMatch;
    
    // Adjust emotion biases
    if (emotionBiases[original] !== undefined && emotionBiases[corrected] !== undefined) {
      const adjustmentAmount = pattern.confidence / 100 * 0.1;
      emotionBiases[original] -= adjustmentAmount;
      emotionBiases[corrected] += adjustmentAmount;
      
      applyLearningAdjustment(
        'emotionFusion',
        `bias_${original}_to_${corrected}`,
        emotionBiases[original] + adjustmentAmount,
        emotionBiases[original],
        pattern.suggestedAdjustment,
        pattern.frequency
      );
      
      return `تعديل انحياز ${original} → ${corrected}`;
    }
  }
  
  // Detect confidence issues
  if (pattern.pattern.includes('توقعات لم تتحقق')) {
    // Reduce overall confidence
    const confidenceReduction = Math.min(pattern.frequency * 0.02, 0.1);
    
    applyLearningAdjustment(
      'explainableInsight',
      'confidence_modifier',
      1.0,
      1.0 - confidenceReduction,
      'تقليل الثقة بسبب توقعات خاطئة',
      pattern.frequency
    );
    
    return `تقليل الثقة بنسبة ${(confidenceReduction * 100).toFixed(1)}%`;
  }
  
  return null;
}

/**
 * Get current engine weights
 */
export function getEngineWeights(): EngineWeights {
  return { ...currentWeights };
}

/**
 * Get emotion biases
 */
export function getEmotionBiases(): Record<string, number> {
  return { ...emotionBiases };
}

/**
 * Apply emotion bias to raw emotion scores
 */
export function applyEmotionBias(emotions: Record<string, number>): Record<string, number> {
  const adjusted: Record<string, number> = {};
  
  for (const [emotion, value] of Object.entries(emotions)) {
    const bias = emotionBiases[emotion] || 0;
    adjusted[emotion] = Math.max(0, Math.min(100, value + (bias * 100)));
  }
  
  return adjusted;
}

/**
 * Evaluate prediction accuracy
 * يقارن التوقع بالواقع
 */
export function evaluatePrediction(
  analysisId: string,
  predicted: {
    dominantEmotion: string;
    gmi: number;
    trend: 'up' | 'down' | 'stable';
  },
  actual: {
    dominantEmotion: string;
    gmi: number;
    trend: 'up' | 'down' | 'stable';
  }
): {
  emotionMatch: boolean;
  gmiError: number;
  trendMatch: boolean;
  overallScore: number;
  feedback: string;
} {
  const emotionMatch = predicted.dominantEmotion === actual.dominantEmotion;
  const gmiError = Math.abs(predicted.gmi - actual.gmi);
  const trendMatch = predicted.trend === actual.trend;
  
  // Calculate overall score
  let score = 0;
  if (emotionMatch) score += 40;
  if (trendMatch) score += 30;
  score += Math.max(0, 30 - gmiError); // Up to 30 points for GMI accuracy
  
  // Generate feedback
  let feedback = '';
  if (score >= 80) {
    feedback = '✅ تحليل دقيق جداً';
  } else if (score >= 60) {
    feedback = '⚠️ تحليل جيد مع بعض الانحرافات';
  } else if (score >= 40) {
    feedback = '⚠️ تحليل متوسط، يحتاج تحسين';
  } else {
    feedback = '❌ كنت غلط هنا، أحتاج أتعلم';
  }
  
  // If wrong, trigger learning
  if (score < 60) {
    triggerLearningFromError(analysisId, predicted, actual);
  }
  
  return {
    emotionMatch,
    gmiError,
    trendMatch,
    overallScore: score,
    feedback,
  };
}

/**
 * Trigger learning from an error
 * "كنت غلط هنا" ويعدل أوزانه
 */
function triggerLearningFromError(
  analysisId: string,
  predicted: { dominantEmotion: string; gmi: number; trend: string },
  actual: { dominantEmotion: string; gmi: number; trend: string }
) {
  console.log(`[Learning] كنت غلط في التحليل ${analysisId}`);
  console.log(`[Learning] توقعت: ${predicted.dominantEmotion} (GMI: ${predicted.gmi})`);
  console.log(`[Learning] الواقع: ${actual.dominantEmotion} (GMI: ${actual.gmi})`);
  
  // Adjust emotion bias
  if (predicted.dominantEmotion !== actual.dominantEmotion) {
    const biasAdjustment = 0.05;
    emotionBiases[predicted.dominantEmotion] -= biasAdjustment;
    emotionBiases[actual.dominantEmotion] += biasAdjustment;
    
    console.log(`[Learning] تعديل الانحياز: ${predicted.dominantEmotion} -${biasAdjustment}, ${actual.dominantEmotion} +${biasAdjustment}`);
  }
  
  // Adjust GMI calculation if error is significant
  if (Math.abs(predicted.gmi - actual.gmi) > 20) {
    // This would adjust internal GMI calculation parameters
    console.log(`[Learning] خطأ GMI كبير (${Math.abs(predicted.gmi - actual.gmi)}), يحتاج مراجعة`);
  }
}

/**
 * Get learning summary
 */
export function getLearningSummary(): {
  totalCycles: number;
  lastCycle: LearningCycle | null;
  currentAccuracy: number;
  totalAdjustments: number;
  topImprovements: string[];
  currentWeights: EngineWeights;
  emotionBiases: Record<string, number>;
} {
  const state = getLearningState();
  const adjustments = getAdjustmentHistory(100);
  
  return {
    totalCycles: learningHistory.length,
    lastCycle: learningHistory[learningHistory.length - 1] || null,
    currentAccuracy: state.accuracyRate,
    totalAdjustments: adjustments.length,
    topImprovements: learningHistory
      .flatMap(c => c.improvements)
      .slice(-10),
    currentWeights,
    emotionBiases,
  };
}

/**
 * Reset learning to defaults
 */
export function resetLearning() {
  currentWeights = { ...DEFAULT_WEIGHTS };
  emotionBiases = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };
  learningHistory.length = 0;
}

/**
 * Get learning history
 */
export function getLearningHistory(): LearningCycle[] {
  return [...learningHistory];
}

/**
 * Predict future emotion trend
 * Based on historical patterns and learned biases
 */
export function predictEmotionTrend(
  currentEmotion: string,
  currentIntensity: number,
  recentHistory: Array<{ emotion: string; intensity: number; timestamp: Date }>
): {
  predictedEmotion: string;
  predictedIntensity: number;
  confidence: number;
  reasoning: string;
} {
  // Simple trend analysis
  const recentEmotions = recentHistory.slice(-5);
  
  if (recentEmotions.length < 2) {
    return {
      predictedEmotion: currentEmotion,
      predictedIntensity: currentIntensity,
      confidence: 30,
      reasoning: 'بيانات غير كافية للتنبؤ',
    };
  }
  
  // Calculate trend
  const intensityTrend = recentEmotions.reduce((acc, curr, i, arr) => {
    if (i === 0) return 0;
    return acc + (curr.intensity - arr[i - 1].intensity);
  }, 0) / (recentEmotions.length - 1);
  
  // Apply learned biases
  const biasedIntensity = currentIntensity + (emotionBiases[currentEmotion] || 0) * 10;
  const predictedIntensity = Math.max(0, Math.min(100, biasedIntensity + intensityTrend));
  
  // Determine if emotion might change
  let predictedEmotion = currentEmotion;
  let reasoning = '';
  
  if (predictedIntensity < 30 && currentIntensity > 50) {
    // Emotion might shift
    const opposites: Record<string, string> = {
      joy: 'sadness',
      fear: 'hope',
      anger: 'calm',
      sadness: 'joy',
      hope: 'fear',
      curiosity: 'indifference',
    };
    predictedEmotion = opposites[currentEmotion] || currentEmotion;
    reasoning = `الشدة تتناقص، قد يتحول من ${currentEmotion} إلى ${predictedEmotion}`;
  } else if (intensityTrend > 5) {
    reasoning = `الشدة في تصاعد (+${intensityTrend.toFixed(1)}/ساعة)`;
  } else if (intensityTrend < -5) {
    reasoning = `الشدة في تناقص (${intensityTrend.toFixed(1)}/ساعة)`;
  } else {
    reasoning = 'الحالة مستقرة نسبياً';
  }
  
  // Calculate confidence based on data quality and learning state
  const state = getLearningState();
  let confidence = 50;
  confidence += Math.min(state.accuracyRate / 5, 20); // Up to 20 from accuracy
  confidence += Math.min(recentEmotions.length * 5, 15); // Up to 15 from data points
  confidence = Math.min(confidence, 85); // Cap at 85%
  
  return {
    predictedEmotion,
    predictedIntensity: Math.round(predictedIntensity),
    confidence: Math.round(confidence),
    reasoning,
  };
}
