/**
 * Self-Evaluation - الوعي الذاتي
 * 
 * الحلقة الثانية في نظام التطور الذاتي
 * النظام يسأل نفسه بعد كل رد: هل كنت جيداً؟
 * 
 * "النظام يتطور لأنه يشك في نفسه"
 */

import { getDb } from '../db';
import { selfEvaluations } from '../../drizzle/schema';
import { desc, avg, sql } from 'drizzle-orm';
import crypto from 'crypto';

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
