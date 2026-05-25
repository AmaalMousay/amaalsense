import { t } from "../_core/i18n";
/**
 * Feedback Loop -   
 * 
 *      
 *          
 * 
 * "         "
 */

import { getDb } from '../_core/db';
import { responseFeedback } from '../drizzle/schema';
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
 *  feedback  
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
 *   feedbacks
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
 *  feedbacks   (  )
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
 *  feedbacks   (  )
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
 *    feedback
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

    //   feedback  
    const basicStats = await db
      .select({
        total: count(),
        avgRating: avg(responseFeedback.rating),
      })
      .from(responseFeedback);

    const total = basicStats[0]?.total || 0;
    const avgRating = Number(basicStats[0]?.avgRating) || 0;

    //  
    const helpfulCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasHelpful, 'yes'));

    //  
    const accurateCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasAccurate, 'yes'));

    //  
    const understandableCount = await db
      .select({ count: count() })
      .from(responseFeedback)
      .where(eq(responseFeedback.wasUnderstandable, 'yes'));

    //    
    const negativeComments = await db
      .select({ comment: responseFeedback.comment })
      .from(responseFeedback)
      .where(sql`${responseFeedback.rating} <= 2 AND ${responseFeedback.comment} IS NOT NULL`)
      .limit(10);

    //   
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
 *   feedback    
 */
export async function analyzeFeedback(): Promise<FeedbackAnalysis> {
  const stats = await getFeedbackStats();

  //    
  let overallSatisfaction: FeedbackAnalysis['overallSatisfaction'];
  if (stats.averageRating >= 4.5) overallSatisfaction = 'excellent';
  else if (stats.averageRating >= 3.5) overallSatisfaction = 'good';
  else if (stats.averageRating >= 2.5) overallSatisfaction = 'average';
  else if (stats.averageRating >= 1.5) overallSatisfaction = 'poor';
  else overallSatisfaction = 'critical';

  //   
  const strengths: string[] = [];
  if (stats.helpfulPercentage >= 70) strengths.push(t('auto.cognitiveArchitecture_feedbackLoop.12.f8a62bdb', 'ar'));
  if (stats.accuratePercentage >= 70) strengths.push(t('auto.cognitiveArchitecture_feedbackLoop.11.8305cb2f', 'ar'));
  if (stats.understandablePercentage >= 70) strengths.push(t('auto.cognitiveArchitecture_feedbackLoop.10.759469c8', 'ar'));
  if (stats.averageRating >= 4) strengths.push(t('auto.cognitiveArchitecture_feedbackLoop.9.a7e5cb06', 'ar'));

  //   
  const weaknesses: string[] = [];
  if (stats.helpfulPercentage < 50) weaknesses.push(t('auto.cognitiveArchitecture_feedbackLoop.8.2a0dd52c', 'ar'));
  if (stats.accuratePercentage < 50) weaknesses.push(t('auto.cognitiveArchitecture_feedbackLoop.7.86904410', 'ar'));
  if (stats.understandablePercentage < 50) weaknesses.push(t('auto.cognitiveArchitecture_feedbackLoop.6.7afd5c8b', 'ar'));
  if (stats.averageRating < 3) weaknesses.push(t('auto.cognitiveArchitecture_feedbackLoop.5.9c70c0b4', 'ar'));

  //  
  const recommendations: string[] = [];
  if (stats.helpfulPercentage < 70) recommendations.push(t('auto.cognitiveArchitecture_feedbackLoop.4.0569e9d8', 'ar'));
  if (stats.accuratePercentage < 70) recommendations.push(t('auto.cognitiveArchitecture_feedbackLoop.3.95c57c79', 'ar'));
  if (stats.understandablePercentage < 70) recommendations.push(t('auto.cognitiveArchitecture_feedbackLoop.2.830fa966', 'ar'));
  if (stats.topIssues.length > 0) recommendations.push(t('auto.cognitiveArchitecture_feedbackLoop.1.a2f23a1c', 'ar'));

  return {
    overallSatisfaction,
    strengths,
    weaknesses,
    recommendations,
  };
}

/**
 *  feedback  
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
 *  feedback   
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
