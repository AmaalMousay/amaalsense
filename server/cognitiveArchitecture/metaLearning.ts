/**
 * Meta-Learning - التعلم من الأنماط
 * 
 * الحلقة الثالثة في نظام التطور الذاتي
 * النظام يتعلم من أخطائه ونجاحاته ويعدّل قواعده
 * 
 * "النظام يتطور لأنه يشك في نفسه"
 */

import { getDb } from '../db';
import { cognitiveLearningInsights, reasoningRules, weeklySelfReports } from '../../drizzle/schema';
import { desc, eq, sql, and, gte, lte } from 'drizzle-orm';
import { getFeedbackStats, getLowRatedFeedback, getHighRatedFeedback } from './feedbackLoop';
import { getSelfEvaluationSummary, getLowScoringEvaluations } from './selfEvaluation';

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
 * تحليل الأنماط من الـ feedback والتقييم الذاتي
 * يكتشف نقاط الضعف والقوة المتكررة
 */
export async function detectPatterns(): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];
  
  // جلب بيانات التحليل
  const feedbackStats = await getFeedbackStats();
  const selfEvalSummary = await getSelfEvaluationSummary();
  const lowRatedFeedback = await getLowRatedFeedback(20);
  const highRatedFeedback = await getHighRatedFeedback(20);
  const lowScoringEvals = await getLowScoringEvaluations(20);
  
  // 1. اكتشاف نقاط الضعف من الـ feedback
  if (feedbackStats.helpfulPercentage < 50) {
    insights.push({
      patternType: 'weakness',
      description: 'الردود ليست مفيدة بما فيه الكفاية للمستخدمين',
      evidenceCount: feedbackStats.totalFeedback,
      confidence: 80,
      suggestedAction: 'تحسين جودة الأسباب والتفسيرات في الردود',
    });
  }
  
  if (feedbackStats.accuratePercentage < 50) {
    insights.push({
      patternType: 'weakness',
      description: 'مشاكل في دقة التحليل',
      evidenceCount: feedbackStats.totalFeedback,
      confidence: 80,
      suggestedAction: 'تحسين Query Builder لجلب بيانات أكثر صلة',
    });
  }
  
  // 2. اكتشاف نقاط الضعف من التقييم الذاتي
  for (const weakness of selfEvalSummary.commonWeaknesses) {
    insights.push({
      patternType: 'weakness',
      description: weakness,
      evidenceCount: 10, // تقدير
      confidence: 70,
      suggestedAction: getActionForWeakness(weakness),
    });
  }
  
  // 3. اكتشاف نقاط القوة
  for (const strength of selfEvalSummary.commonStrengths) {
    insights.push({
      patternType: 'strength',
      description: strength,
      evidenceCount: 10,
      confidence: 70,
    });
  }
  
  // 4. تحليل المواضيع الضعيفة من التقييمات المنخفضة
  const topicWeaknesses: Record<string, number> = {};
  for (const feedback of lowRatedFeedback) {
    if (feedback.topic) {
      topicWeaknesses[feedback.topic] = (topicWeaknesses[feedback.topic] || 0) + 1;
    }
  }
  
  for (const [topic, count] of Object.entries(topicWeaknesses)) {
    if (count >= 3) {
      insights.push({
        patternType: 'weakness',
        topic,
        description: `أداء ضعيف في موضوع: ${topic}`,
        evidenceCount: count,
        confidence: Math.min(90, 50 + count * 10),
        suggestedAction: `تحسين جلب البيانات والتحليل لموضوع ${topic}`,
      });
    }
  }
  
  return insights;
}

/**
 * الحصول على إجراء مقترح لنقطة ضعف
 */
function getActionForWeakness(weakness: string): string {
  const actionMap: Record<string, string> = {
    'الأسباب من قوالب ثابتة وليس من البيانات': 'ربط Why Layer بالبيانات الحقيقية',
    'سرد بدون قرار واضح': 'تحسين Decision Engine ليحسم ويرجح',
    'مصادر قليلة للبيانات': 'توسيع نطاق البحث ليشمل مصادر أكثر',
    'عناوين قليلة متعلقة بالموضوع': 'تحسين Query Builder',
    'ثقة منخفضة في التحليل': 'جمع المزيد من البيانات قبل الإجابة',
  };
  
  return actionMap[weakness] || 'مراجعة وتحسين هذا الجانب';
}

// ============================================================================
// LEARNING INSIGHTS STORAGE
// ============================================================================

/**
 * حفظ insight جديد
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
 * جلب الـ insights النشطة
 */
export async function getActiveInsights(): Promise<typeof cognitiveLearningInsights.$inferSelect[]> {
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
 * تفعيل insight
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
 * إضافة قاعدة استدلال جديدة
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
 * جلب القواعد النشطة
 */
export async function getActiveRules(): Promise<typeof reasoningRules.$inferSelect[]> {
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
 * تحديث وزن قاعدة بناءً على نجاحها
 */
export async function updateRuleWeight(ruleName: string, success: boolean): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    
    // جلب القاعدة الحالية
    const rules = await db
      .select()
      .from(reasoningRules)
      .where(eq(reasoningRules.ruleName, ruleName))
      .limit(1);
    
    if (rules.length === 0) return;
    
    const rule = rules[0];
    const newTimesApplied = rule.timesApplied + 1;
    const currentSuccessRate = rule.successRate || 50;
    
    // حساب معدل النجاح الجديد
    const newSuccessRate = Math.round(
      (currentSuccessRate * rule.timesApplied + (success ? 100 : 0)) / newTimesApplied
    );
    
    // تعديل الوزن بناءً على معدل النجاح
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
 * توليد تقرير أسبوعي للتأمل الذاتي
 * Machine Introspection: الآلة تتأمل نفسها
 */
export async function generateWeeklyReport(): Promise<WeeklyReport> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // جلب البيانات
  const feedbackStats = await getFeedbackStats();
  const selfEvalSummary = await getSelfEvaluationSummary();
  const patterns = await detectPatterns();
  
  // تصنيف الأنماط
  const weaknesses = patterns.filter(p => p.patternType === 'weakness');
  const strengths = patterns.filter(p => p.patternType === 'strength');
  
  // استخراج المواضيع الضعيفة
  const dataGapTopics = weaknesses
    .filter(w => w.topic && w.description.includes('بيانات'))
    .map(w => w.topic!)
    .filter((v, i, a) => a.indexOf(v) === i);
  
  const weakInterpretationTopics = weaknesses
    .filter(w => w.topic && w.description.includes('تحليل'))
    .map(w => w.topic!)
    .filter((v, i, a) => a.indexOf(v) === i);
  
  // توليد التوصيات
  const recommendedAdjustments: string[] = [];
  
  if (selfEvalSummary.averageDataSufficiency < 50) {
    recommendedAdjustments.push('تحسين Query Builder لجلب بيانات أكثر');
  }
  if (selfEvalSummary.averageCausesFromData < 50) {
    recommendedAdjustments.push('ربط Why Layer بالبيانات الحقيقية');
  }
  if (selfEvalSummary.averageAnalysisVsNarration < 50) {
    recommendedAdjustments.push('تحسين Decision Engine ليحسم ويرجح');
  }
  if (feedbackStats.helpfulPercentage < 50) {
    recommendedAdjustments.push('تحسين جودة الردود لتكون أكثر فائدة');
  }
  
  const report: WeeklyReport = {
    periodStart: weekAgo,
    periodEnd: now,
    totalResponses: feedbackStats.totalFeedback,
    averageRating: feedbackStats.averageRating,
    averageSelfScore: selfEvalSummary.averageOverall,
    topFailures: weaknesses.slice(0, 10).map(w => w.description),
    topSuccesses: strengths.slice(0, 10).map(s => s.description),
    confusingQuestionTypes: [], // يمكن إضافة تحليل أعمق لاحقاً
    dataGapTopics,
    weakInterpretationTopics,
    keyInsights: [
      `متوسط الثقة: ${selfEvalSummary.averageConfidence}%`,
      `متوسط كفاية البيانات: ${selfEvalSummary.averageDataSufficiency}%`,
      `متوسط الأسباب من البيانات: ${selfEvalSummary.averageCausesFromData}%`,
      `نسبة الردود المفيدة: ${feedbackStats.helpfulPercentage}%`,
    ],
    recommendedAdjustments,
  };
  
  // حفظ التقرير
  await saveWeeklyReport(report);
  
  return report;
}

/**
 * حفظ التقرير الأسبوعي
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
 * جلب آخر تقرير أسبوعي
 */
export async function getLatestWeeklyReport(): Promise<typeof weeklySelfReports.$inferSelect | null> {
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
 * تشغيل حلقة التعلم الكاملة
 * 1. اكتشاف الأنماط
 * 2. حفظ الـ insights
 * 3. اقتراح تعديلات على القواعد
 */
export async function runLearningLoop(): Promise<{
  patternsDetected: number;
  insightsSaved: number;
  rulesAdjusted: number;
}> {
  console.log('[MetaLearning] Starting learning loop...');
  
  // 1. اكتشاف الأنماط
  const patterns = await detectPatterns();
  console.log(`[MetaLearning] Detected ${patterns.length} patterns`);
  
  // 2. حفظ الـ insights الجديدة
  let insightsSaved = 0;
  for (const pattern of patterns) {
    const result = await saveLearningInsight(pattern);
    if (result.success) insightsSaved++;
  }
  console.log(`[MetaLearning] Saved ${insightsSaved} insights`);
  
  // 3. اقتراح تعديلات على القواعد (يمكن توسيعها لاحقاً)
  const rulesAdjusted = 0;
  
  console.log('[MetaLearning] Learning loop completed');
  
  return {
    patternsDetected: patterns.length,
    insightsSaved,
    rulesAdjusted,
  };
}
