/**
 * Cognitive Loop - حلقة الوعي المغلقة
 * 
 * يدمج الحلقات الثلاث في نظام واحد متكامل:
 * 1. Feedback Loop - جمع رأي المستخدم
 * 2. Self-Evaluation - تقييم ذاتي
 * 3. Meta-Learning - التعلم من الأنماط
 * 
 * "النظام لا يتطور لأنه ذكي، بل لأنه يشك في نفسه"
 */

import { 
  addFeedback, 
  getFeedbackStats, 
  analyzeFeedbackPatterns,
  type FeedbackEntry 
} from '../engines/feedbackStore';
import { evaluateAndSave, type SelfEvaluationInput, type SelfEvaluationResult } from './selfEvaluation';
import { runLearningLoop, generateWeeklyReport, getActiveInsights, getActiveRules } from './metaLearning';

// ============================================================================
// TYPES
// ============================================================================

export interface ResponseContext {
  question: string;
  response: string;
  topic?: string;
  cognitivePattern?: string;
  dominantEmotion?: string;
  newsSourcesCount: number;
  relevantHeadlinesCount: number;
  causesFromData: boolean;
  hasSpecificExamples: boolean;
  madeDecision: boolean;
  confidenceLevel: number;
}

export interface CognitiveLoopResult {
  selfEvaluation: SelfEvaluationResult;
  shouldAskForFeedback: boolean;
  improvementHints: string[];
}

// ============================================================================
// MAIN COGNITIVE LOOP
// ============================================================================

/**
 * تشغيل حلقة الوعي بعد كل رد
 * يقيّم النظام نفسه ويقرر ما إذا كان يحتاج feedback
 */
export async function runCognitiveLoop(context: ResponseContext): Promise<CognitiveLoopResult> {
  console.log('[CognitiveLoop] Running cognitive loop for response...');
  
  // 1. التقييم الذاتي
  const selfEvalInput: SelfEvaluationInput = {
    question: context.question,
    response: context.response,
    newsSourcesCount: context.newsSourcesCount,
    relevantHeadlinesCount: context.relevantHeadlinesCount,
    causesFromData: context.causesFromData,
    hasSpecificExamples: context.hasSpecificExamples,
    madeDecision: context.madeDecision,
    confidenceLevel: context.confidenceLevel,
  };
  
  const selfEvaluation = await evaluateAndSave(selfEvalInput);
  console.log(`[CognitiveLoop] Self-evaluation score: ${selfEvaluation.overallScore}`);
  
  // 2. تحديد ما إذا كان يجب طلب feedback
  // نطلب feedback عندما:
  // - النتيجة متوسطة (40-70) - نحتاج تأكيد
  // - النتيجة منخفضة (<40) - نحتاج معرفة المشكلة
  // - عشوائياً 20% من الوقت للردود الجيدة
  let shouldAskForFeedback = false;
  if (selfEvaluation.overallScore < 70) {
    shouldAskForFeedback = true;
  } else if (Math.random() < 0.2) {
    shouldAskForFeedback = true;
  }
  
  // 3. جلب تلميحات التحسين من الـ insights النشطة
  const activeInsights = await getActiveInsights();
  const improvementHints = activeInsights
    .filter(i => i.patternType === 'weakness')
    .map(i => i.suggestedAction || i.description)
    .slice(0, 3);
  
  return {
    selfEvaluation,
    shouldAskForFeedback,
    improvementHints,
  };
}

/**
 * معالجة feedback من المستخدم
 */
export async function processFeedback(
  context: ResponseContext,
  rating: number,
  options?: {
    wasHelpful?: 'yes' | 'no' | 'partial';
    wasAccurate?: 'yes' | 'no' | 'unsure';
    wasUnderstandable?: 'yes' | 'no' | 'partial';
    comment?: string;
  }
): Promise<{ success: boolean }> {
  const feedbackInput: any = {
    analysisId: 'cognitive-loop-' + Date.now(), // Generate a temporary ID
    userType: 'general',
    topic: context.topic || 'general',
    sentiment: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
    rating,
    comment: options?.comment,
    originalValue: context.confidenceLevel,
    type: 'accuracy_rating'
  };
  
  addFeedback(feedbackInput);
  return { success: true };
}

// ============================================================================
// SCHEDULED TASKS
// ============================================================================

/**
 * تشغيل حلقة التعلم (يُنصح بتشغيلها يومياً)
 */
export async function runDailyLearning(): Promise<void> {
  console.log('[CognitiveLoop] Running daily learning...');
  
  const result = await runLearningLoop();
  
  console.log(`[CognitiveLoop] Daily learning completed:`);
  console.log(`  - Patterns detected: ${result.patternsDetected}`);
  console.log(`  - Insights saved: ${result.insightsSaved}`);
  console.log(`  - Rules adjusted: ${result.rulesAdjusted}`);
}

/**
 * توليد التقرير الأسبوعي (يُنصح بتشغيله أسبوعياً)
 */
export async function runWeeklyIntrospection(): Promise<void> {
  console.log('[CognitiveLoop] Running weekly introspection...');
  
  const report = await generateWeeklyReport();
  
  console.log('[CognitiveLoop] Weekly report generated:');
  console.log(`  - Total responses: ${report.totalResponses}`);
  console.log(`  - Average rating: ${report.averageRating}`);
  console.log(`  - Average self-score: ${report.averageSelfScore}`);
  console.log(`  - Top failures: ${report.topFailures.length}`);
  console.log(`  - Recommendations: ${report.recommendedAdjustments.length}`);
}

// ============================================================================
// SYSTEM STATUS
// ============================================================================

/**
 * جلب حالة النظام المعرفي
 */
export async function getCognitiveSystemStatus(): Promise<{
  activeInsightsCount: number;
  activeRulesCount: number;
  feedbackAnalysis: any;
  systemHealth: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
}> {
  const activeInsights = await getActiveInsights();
  const activeRules = await getActiveRules();
  const feedbackAnalysis = getFeedbackStats();
  
  // تحديد صحة النظام
  let systemHealth: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  const averageRating = feedbackAnalysis.averageRating;
  
  if (averageRating >= 4.5) systemHealth = 'excellent';
  else if (averageRating >= 3.8) systemHealth = 'good';
  else if (averageRating >= 3.0) systemHealth = 'average';
  else if (averageRating >= 2.0) systemHealth = 'poor';
  else systemHealth = 'critical';
  
  return {
    activeInsightsCount: activeInsights.length,
    activeRulesCount: activeRules.length,
    feedbackAnalysis,
    systemHealth,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Feedback Store functions
  addFeedback as saveFeedback,
  getFeedbackStats as analyzeFeedback,
  // Self-Evaluation
  evaluateAndSave,
  // Meta-Learning
  runLearningLoop,
  generateWeeklyReport,
  getActiveInsights,
  getActiveRules,
};
