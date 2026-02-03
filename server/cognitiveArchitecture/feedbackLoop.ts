/**
 * Feedback Loop - حلقة التغذية الراجعة
 * 
 * الحلقة الأولى في نظام التطور الذاتي
 * تجمع رأي المستخدم بعد كل رد وتخزنه كذاكرة نقدية للنظام
 * 
 * "النظام لا يتطور لأنه ذكي، بل لأنه يشك في نفسه"
 */

import { getDb } from '../db';
import { responseFeedback } from '../../drizzle/schema';
import { eq, desc, avg, count, sql } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface FeedbackInput {
  userId?: number;
  question: string;
  response: string;
  rating: number; // 1-5
  wasHelpful?: 'yes' | 'no' | 'partial';
  wasAccurate?: 'yes' | 'no' | 'unsure';
  wasUnderstandable?: 'yes' | 'no' | 'partial';
  comment?: string;
  topic?: string;
  cognitivePattern?: string;
  dominantEmotion?: string;
  responseConfidence?: number;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  helpfulPercentage: number;
  accuratePercentage: number;
  understandablePercentage: number;
  topIssues: string[];
  topPraises: string[];
}

export interface FeedbackAnalysis {
  overallSatisfaction: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// ============================================================================
// FEEDBACK COLLECTION
// ============================================================================

/**
 * حفظ feedback من المستخدم
 */
export async function saveFeedback(input: FeedbackInput): Promise<{ success: boolean; id?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };
    
    const result = await db.insert(responseFeedback).values({
      userId: input.userId,
      question: input.question,
      response: input.response,
      rating: input.rating,
      wasHelpful: input.wasHelpful,
      wasAccurate: input.wasAccurate,
      wasUnderstandable: input.wasUnderstandable,
      comment: input.comment,
      topic: input.topic,
      cognitivePattern: input.cognitivePattern,
      dominantEmotion: input.dominantEmotion,
      responseConfidence: input.responseConfidence,
    });
    
    return { success: true, id: Number((result as any).insertId) };
  } catch (error) {
    console.error('[FeedbackLoop] Error saving feedback:', error);
    return { success: false };
  }
}

/**
 * جلب آخر feedbacks
 */
export async function getRecentFeedback(limit: number = 50): Promise<typeof responseFeedback.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(responseFeedback)
      .orderBy(desc(responseFeedback.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[FeedbackLoop] Error getting recent feedback:', error);
    return [];
  }
}

/**
 * جلب feedbacks بتقييم منخفض (للتعلم من الأخطاء)
 */
export async function getLowRatedFeedback(limit: number = 20): Promise<typeof responseFeedback.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(responseFeedback)
      .where(sql`${responseFeedback.rating} <= 2`)
      .orderBy(desc(responseFeedback.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[FeedbackLoop] Error getting low-rated feedback:', error);
    return [];
  }
}

/**
 * جلب feedbacks بتقييم عالي (للتعلم من النجاحات)
 */
export async function getHighRatedFeedback(limit: number = 20): Promise<typeof responseFeedback.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(responseFeedback)
      .where(sql`${responseFeedback.rating} >= 4`)
      .orderBy(desc(responseFeedback.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[FeedbackLoop] Error getting high-rated feedback:', error);
    return [];
  }
}

// ============================================================================
// FEEDBACK ANALYSIS
// ============================================================================

/**
 * تحليل إحصائيات الـ feedback
 */
export async function getFeedbackStats(): Promise<FeedbackStats> {
  try {
    const db = await getDb();
    if (!db) return {
      totalFeedback: 0,
      averageRating: 0,
      helpfulPercentage: 0,
      accuratePercentage: 0,
      understandablePercentage: 0,
      topIssues: [],
      topPraises: [],
    };
    
    // إجمالي الـ feedback ومتوسط التقييم
    const basicStats = await db
      .select({
        total: count(),
        avgRating: avg(responseFeedback.rating),
      })
      .from(responseFeedback);
    
    const total = basicStats[0]?.total || 0;
    const avgRating = Number(basicStats[0]?.avgRating) || 0;
    
    // نسبة المفيد
    const helpfulCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasHelpful, 'yes'));
    
    // نسبة الدقيق
    const accurateCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasAccurate, 'yes'));
    
    // نسبة المفهوم
    const understandableCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasUnderstandable, 'yes'));
    
    // جلب التعليقات السلبية للتحليل
    const negativeComments = await db
      .select({ comment: responseFeedback.comment })
      .from(responseFeedback)
      .where(sql`${responseFeedback.rating} <= 2 AND ${responseFeedback.comment} IS NOT NULL`)
      .limit(10);
    
    // جلب التعليقات الإيجابية
    const positiveComments = await db
      .select({ comment: responseFeedback.comment })
      .from(responseFeedback)
      .where(sql`${responseFeedback.rating} >= 4 AND ${responseFeedback.comment} IS NOT NULL`)
      .limit(10);
    
    return {
      totalFeedback: total,
      averageRating: Math.round(avgRating * 10) / 10,
      helpfulPercentage: total > 0 ? Math.round((helpfulCount[0]?.count || 0) / total * 100) : 0,
      accuratePercentage: total > 0 ? Math.round((accurateCount[0]?.count || 0) / total * 100) : 0,
      understandablePercentage: total > 0 ? Math.round((understandableCount[0]?.count || 0) / total * 100) : 0,
      topIssues: negativeComments.map((c: { comment: string | null }) => c.comment || '').filter(Boolean),
      topPraises: positiveComments.map((c: { comment: string | null }) => c.comment || '').filter(Boolean),
    };
  } catch (error) {
    console.error('[FeedbackLoop] Error getting feedback stats:', error);
    return {
      totalFeedback: 0,
      averageRating: 0,
      helpfulPercentage: 0,
      accuratePercentage: 0,
      understandablePercentage: 0,
      topIssues: [],
      topPraises: [],
    };
  }
}

/**
 * تحليل الـ feedback لاستخراج نقاط القوة والضعف
 */
export async function analyzeFeedback(): Promise<FeedbackAnalysis> {
  const stats = await getFeedbackStats();
  
  // تحديد مستوى الرضا العام
  let overallSatisfaction: FeedbackAnalysis['overallSatisfaction'];
  if (stats.averageRating >= 4.5) overallSatisfaction = 'excellent';
  else if (stats.averageRating >= 3.5) overallSatisfaction = 'good';
  else if (stats.averageRating >= 2.5) overallSatisfaction = 'average';
  else if (stats.averageRating >= 1.5) overallSatisfaction = 'poor';
  else overallSatisfaction = 'critical';
  
  // استخراج نقاط القوة
  const strengths: string[] = [];
  if (stats.helpfulPercentage >= 70) strengths.push('الردود مفيدة للمستخدمين');
  if (stats.accuratePercentage >= 70) strengths.push('التحليلات دقيقة');
  if (stats.understandablePercentage >= 70) strengths.push('الردود واضحة ومفهومة');
  if (stats.averageRating >= 4) strengths.push('رضا عام مرتفع');
  
  // استخراج نقاط الضعف
  const weaknesses: string[] = [];
  if (stats.helpfulPercentage < 50) weaknesses.push('الردود ليست مفيدة بما فيه الكفاية');
  if (stats.accuratePercentage < 50) weaknesses.push('مشاكل في دقة التحليل');
  if (stats.understandablePercentage < 50) weaknesses.push('الردود غير واضحة');
  if (stats.averageRating < 3) weaknesses.push('رضا عام منخفض');
  
  // توصيات للتحسين
  const recommendations: string[] = [];
  if (stats.helpfulPercentage < 70) recommendations.push('تحسين جودة الأسباب والتفسيرات');
  if (stats.accuratePercentage < 70) recommendations.push('تحسين دقة جلب البيانات');
  if (stats.understandablePercentage < 70) recommendations.push('تبسيط اللغة والهيكل');
  if (stats.topIssues.length > 0) recommendations.push('معالجة الشكاوى المتكررة');
  
  return {
    overallSatisfaction,
    strengths,
    weaknesses,
    recommendations,
  };
}

/**
 * جلب feedback حسب الموضوع
 */
export async function getFeedbackByTopic(topic: string): Promise<typeof responseFeedback.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(responseFeedback)
      .where(eq(responseFeedback.topic, topic))
      .orderBy(desc(responseFeedback.createdAt))
      .limit(50);
  } catch (error) {
    console.error('[FeedbackLoop] Error getting feedback by topic:', error);
    return [];
  }
}

/**
 * جلب feedback حسب النمط المعرفي
 */
export async function getFeedbackByCognitivePattern(pattern: string): Promise<typeof responseFeedback.$inferSelect[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(responseFeedback)
      .where(eq(responseFeedback.cognitivePattern, pattern))
      .orderBy(desc(responseFeedback.createdAt))
      .limit(50);
  } catch (error) {
    console.error('[FeedbackLoop] Error getting feedback by cognitive pattern:', error);
    return [];
  }
}
