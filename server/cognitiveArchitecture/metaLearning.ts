/**
 * Meta-Learning -   
 * 
 *      
 *       
 * 
 * "     "
 */

import { getDb } from '../_core/db';
import { cognitiveLearningInsights, reasoningRules, weeklySelfReports } from '../drizzle/schema';
import { desc, eq, sql, and, gte, lte } from 'drizzle-orm';
import { 
  getHighRatedFeedback, 
  getLowRatedFeedback, 
  getFeedbackStats,
  type FeedbackEntry
} from '../engines/feedbackStore';
import { getSelfEvaluationSummary, getLowScoringEvaluations } from './metacognition';

// ============================================================================
// TYPES
// ============================================================================

export interface LearningInsight {
  patternType: 'weakness' | 'strength' | 'rule_adjustment';
  topic?: string;
  questionType?: string;
  description: string;
  evidenceCount: number;
  confidence: number;
  suggestedAction?: string;
}

export interface ReasoningRule {
  ruleName: string;
  category: 'decision' | 'interpretation' | 'response' | 'query';
  description: string;
  weight: number;
  parameters?: Record<string, any>;
  isActive: boolean;
}

export interface WeeklyReport {
  periodStart: Date;
  periodEnd: Date;
  totalResponses: number;
  averageRating: number;
  averageSelfScore: number;
  topFailures: string[];
  topSuccesses: string[];
  confusingQuestionTypes: string[];
  dataGapTopics: string[];
  weakInterpretationTopics: string[];
  keyInsights: string[];
  recommendedAdjustments: string[];
}

// ============================================================================
// PATTERN DETECTION
// ============================================================================

/**
 *     feedback  
 *     
 */
export async function detectPatterns(): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  //   
  const stats = getFeedbackStats();
  const selfEvalSummary = await getSelfEvaluationSummary();
  const lowFeedback = getLowRatedFeedback();
  // const highRatedFeedback = getHighRatedFeedback(); // Not used currently
  // const lowScoringEvals = await getLowScoringEvaluations(20); // Not used currently

  // 1.      feedback
  // Note: helpfulPercentage is not in stats currently, we might need to calculate it or mock it
  const helpfulCount = stats.recentFeedback.filter(f => f.sentiment === 'positive').length;
  const helpfulPercentage = stats.totalFeedback > 0 ? (helpfulCount / stats.totalFeedback) * 100 : 100;

  if (helpfulPercentage < 50) {
    insights.push({
      patternType: 'weakness',
      description: `الردود ليست مفيدة بما فيه الكفاية للمستخدمين`,
      evidenceCount: stats.totalFeedback,
      confidence: 80,
      suggestedAction: `تحسين جودة الأسباب والتفسيرات في الردود`,
    });
  }

  // Assuming accuracy is related to rating
  if (stats.averageRating < 3.0) {
    insights.push({
      patternType: 'weakness',
      description: `مشاكل في دقة التحليل`,
      evidenceCount: stats.totalFeedback,
      confidence: 80,
      suggestedAction: `تحسين Query Builder لجلب بيانات أكثر صلة`,
    });
  }

  // 2.      
  for (const weakness of selfEvalSummary.commonWeaknesses) {
    insights.push({
      patternType: 'weakness',
      description: weakness,
      evidenceCount: 10, // 
      confidence: 70,
      suggestedAction: getActionForWeakness(weakness),
    });
  }

  // 3.   
  for (const strength of selfEvalSummary.commonStrengths) {
    insights.push({
      patternType: 'strength',
      description: strength,
      evidenceCount: 10,
      confidence: 70,
    });
  }

  // 4.      
  const topicWeaknesses: Record<string, number> = {};
  for (const feedback of lowFeedback) {
    if (feedback.topic) {
      topicWeaknesses[feedback.topic] = (topicWeaknesses[feedback.topic] || 0) + 1;
    }
  }

  for (const [topic, count] of Object.entries(topicWeaknesses)) {
    if (count >= 3) {
      insights.push({
        patternType: 'weakness',
        topic,
        description: `   : ${topic}`,
        evidenceCount: count,
        confidence: Math.min(90, 50 + count * 10),
        suggestedAction: `     ${topic}`,
      });
    }
  }

  return insights;
}

/**
 *      
 */
function getActionForWeakness(weakness: string): string {
  const actionMap: Record<string, string> = {
    low_confidence: 'Increase confidence calibration and require stronger evidence.',
    insufficient_data: 'Collect more source data before answering.',
    weak_causality: 'Strengthen causal grounding and evidence links.',
    unclear_language: 'Improve response clarity and remove ambiguous phrasing.',
    missing_context: 'Add contextual binding before final response generation.',
  };
  return actionMap[weakness] || `مراجعة وتحسين هذا الجانب`;
}

// ============================================================================
// LEARNING INSIGHTS STORAGE
// ============================================================================

/**
 *  insight 
 */
export async function saveLearningInsight(insight: LearningInsight): Promise<{ success: boolean }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };

    await db.insert(cognitiveLearningInsights).values({
      patternType: insight.patternType,
      topic: insight.topic,
      questionType: insight.questionType,
      description: insight.description,
      evidenceCount: insight.evidenceCount,
      patternConfidence: insight.confidence,
      suggestedAction: insight.suggestedAction,
      isActive: 'no',
    });

    return { success: true };
  } catch (error) {
    console.error('[MetaLearning] Error saving insight:', error);
    return { success: false };
  }
}

/**
 *   insights 
 */
export async function getActiveInsights(): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(cognitiveLearningInsights)
      .where(eq(cognitiveLearningInsights.isActive, 'yes'))
      .orderBy(desc(cognitiveLearningInsights.patternConfidence));
  } catch (error) {
    console.error('[MetaLearning] Error getting active insights:', error);
    return [];
  }
}

/**
 *  insight
 */
export async function activateInsight(id: number): Promise<{ success: boolean }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };

    await db
      .update(cognitiveLearningInsights)
      .set({ isActive: 'yes', lastValidated: new Date() })
      .where(eq(cognitiveLearningInsights.id, id));

    return { success: true };
  } catch (error) {
    console.error('[MetaLearning] Error activating insight:', error);
    return { success: false };
  }
}

// ============================================================================
// REASONING RULES
// ============================================================================

/**
 *    
 */
export async function addReasoningRule(rule: ReasoningRule): Promise<{ success: boolean }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };

    await db.insert(reasoningRules).values({
      ruleName: rule.ruleName,
      category: rule.category,
      description: rule.description,
      weight: rule.weight,
      parameters: rule.parameters ? JSON.stringify(rule.parameters) : null,
      isActive: rule.isActive ? 'yes' : 'no',
    });

    return { success: true };
  } catch (error) {
    console.error('[MetaLearning] Error adding reasoning rule:', error);
    return { success: false };
  }
}

/**
 *   
 */
export async function getActiveRules(): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(reasoningRules)
      .where(eq(reasoningRules.isActive, 'yes'))
      .orderBy(desc(reasoningRules.weight));
  } catch (error) {
    console.error('[MetaLearning] Error getting active rules:', error);
    return [];
  }
}

/**
 *      
 */
export async function updateRuleWeight(ruleName: string, success: boolean): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    //   
    const rules = await db
      .select()
      .from(reasoningRules)
      .where(eq(reasoningRules.ruleName, ruleName))
      .limit(1);

    if (rules.length === 0) return;

    const rule = rules[0] as any;
    const newTimesApplied = (rule.timesApplied || 0) + 1;
    const currentSuccessRate = rule.successRate || 50;

    //    
    const newSuccessRate = Math.round(
      (currentSuccessRate * (rule.timesApplied || 0) + (success ? 100 : 0)) / newTimesApplied
    );

    //      
    let newWeight = rule.weight;
    if (newSuccessRate > 70) {
      newWeight = Math.min(100, rule.weight + 5);
    } else if (newSuccessRate < 30) {
      newWeight = Math.max(0, rule.weight - 5);
    }

    await db
      .update(reasoningRules)
      .set({
        timesApplied: newTimesApplied,
        successRate: newSuccessRate,
        weight: newWeight,
      })
      .where(eq(reasoningRules.ruleName, ruleName));
  } catch (error) {
    console.error('[MetaLearning] Error updating rule weight:', error);
  }
}

// ============================================================================
// WEEKLY SELF-REPORT
// ============================================================================

/**
 *     
 * Machine Introspection:   
 */
export async function generateWeeklyReport(): Promise<WeeklyReport> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  //  
  const stats = getFeedbackStats();
  const selfEvalSummary = await getSelfEvaluationSummary();
  const patterns = await detectPatterns();

  //  
  const weaknesses = patterns.filter(p => p.patternType === 'weakness');
  const strengths = patterns.filter(p => p.patternType === 'strength');

  //   
  const dataGapTopics = weaknesses
    .filter(w => w.topic && w.description.includes(`بيانات`))
    .map(w => w.topic!)
    .filter((v, i, a) => a.indexOf(v) === i);

  const weakInterpretationTopics = weaknesses
    .filter(w => w.topic && w.description.includes(`تحليل`))
    .map(w => w.topic!)
    .filter((v, i, a) => a.indexOf(v) === i);

  //  
  const recommendedAdjustments: string[] = [];

  if (selfEvalSummary.averageDataSufficiency < 50) {
    recommendedAdjustments.push(`تحسين Query Builder لجلب بيانات أكثر`);
  }
  if (selfEvalSummary.averageCausesFromData < 50) {
    recommendedAdjustments.push(`ربط Why Layer بالبيانات الحقيقية`);
  }
  if (selfEvalSummary.averageAnalysisVsNarration < 50) {
    recommendedAdjustments.push(`تحسين Decision Engine ليحسم ويرجح`);
  }
  if (stats.averageRating < 3.5) {
    recommendedAdjustments.push(`تحسين جودة الردود لتكون أكثر فائدة`);
  }

  const helpfulCount = stats.recentFeedback.filter(f => f.sentiment === 'positive').length;
  const helpfulPercentage = stats.totalFeedback > 0 ? (helpfulCount / stats.totalFeedback) * 100 : 100;

  const report: WeeklyReport = {
    periodStart: weekAgo,
    periodEnd: now,
    totalResponses: stats.totalFeedback,
    averageRating: stats.averageRating,
    averageSelfScore: selfEvalSummary.averageOverall,
    topFailures: weaknesses.slice(0, 10).map(w => w.description),
    topSuccesses: strengths.slice(0, 10).map(s => s.description),
    confusingQuestionTypes: [], //     
    dataGapTopics,
    weakInterpretationTopics,
    keyInsights: [
      ` : ${selfEvalSummary.averageConfidence}%`,
      `  : ${selfEvalSummary.averageDataSufficiency}%`,
      `   : ${selfEvalSummary.averageCausesFromData}%`,
      `  : ${helpfulPercentage}%`,
    ],
    recommendedAdjustments,
  };

  //  
  await saveWeeklyReport(report);

  return report;
}

/**
 *   
 */
async function saveWeeklyReport(report: WeeklyReport): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    await db.insert(weeklySelfReports).values({
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      totalResponses: report.totalResponses,
      averageRating: Math.round(report.averageRating),
      averageSelfScore: report.averageSelfScore,
      topFailures: JSON.stringify(report.topFailures),
      topSuccesses: JSON.stringify(report.topSuccesses),
      confusingQuestionTypes: JSON.stringify(report.confusingQuestionTypes),
      dataGapTopics: JSON.stringify(report.dataGapTopics),
      weakInterpretationTopics: JSON.stringify(report.weakInterpretationTopics),
      keyInsights: JSON.stringify(report.keyInsights),
      recommendedAdjustments: JSON.stringify(report.recommendedAdjustments),
    });
  } catch (error) {
    console.error('[MetaLearning] Error saving weekly report:', error);
  }
}

/**
 *    
 */
export async function getLatestWeeklyReport(): Promise<any | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const reports = await db
      .select()
      .from(weeklySelfReports)
      .orderBy(desc(weeklySelfReports.createdAt))
      .limit(1);

    return reports[0] || null;
  } catch (error) {
    console.error('[MetaLearning] Error getting latest weekly report:', error);
    return null;
  }
}

// ============================================================================
// LEARNING LOOP
// ============================================================================

/**
 *    
 * 1.  
 * 2.   insights
 * 3.    
 */
export async function runLearningLoop(): Promise<{
  patternsDetected: number;
  insightsSaved: number;
  rulesAdjusted: number;
}> {
  console.log('[MetaLearning] Starting learning loop...');

  // 1.  
  const patterns = await detectPatterns();
  console.log(`[MetaLearning] Detected ${patterns.length} patterns`);

  // 2.   insights 
  let insightsSaved = 0;
  for (const pattern of patterns) {
    const result = await saveLearningInsight(pattern);
    if (result.success) insightsSaved++;
  }
  console.log(`[MetaLearning] Saved ${insightsSaved} insights`);

  // 3.     (  )
  const rulesAdjusted = 0;

  console.log('[MetaLearning] Learning loop completed');

  return {
    patternsDetected: patterns.length,
    insightsSaved,
    rulesAdjusted,
  };
}
