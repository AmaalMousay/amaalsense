/**
 * Cognitive Loop -   
 * 
 *       :
 * 1. Feedback Loop -   
 * 2. Self-Evaluation -  
 * 3. Meta-Learning -   
 * 
 * "         "
 */

import { 
  addFeedback, 
  getFeedbackStats, 
  analyzeFeedbackPatterns,
  type FeedbackEntry 
} from '../engines/feedbackStore';
import { evaluateAndSave, type SelfEvaluationInput, type SelfEvaluationResult } from './metacognition';
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
 *      
 *         feedback
 */
export async function runCognitiveLoop(context: ResponseContext): Promise<CognitiveLoopResult> {
  console.log('[CognitiveLoop] Running cognitive loop for response...');
  
  // 1.  
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
  
  // 2.       feedback
  //  feedback :
  // -   (40-70) -  
  // -   (<40) -   
  // -  20%    
  let shouldAskForFeedback = false;
  if (selfEvaluation.overallScore < 70) {
    shouldAskForFeedback = true;
  } else if (Math.random() < 0.2) {
    shouldAskForFeedback = true;
  }
  
  // 3.      insights 
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
 *  feedback  
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
 *    (  )
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
 *    (  )
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
 *    
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
  
  //   
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
