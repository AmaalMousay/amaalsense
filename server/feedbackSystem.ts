import { db } from './db';
import { feedbacks } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';

export interface FeedbackInput {
  conversationId: number;
  rating: number; // 1-5
  comment: string;
  category: 'accuracy' | 'clarity' | 'helpfulness' | 'tone' | 'other';
  isPositive: boolean;
}

export interface FeedbackResponse {
  id: number;
  conversationId: number;
  rating: number;
  comment: string;
  category: string;
  isPositive: boolean;
  createdAt: Date;
}

/**
 * Submit feedback for a conversation
 */
export async function submitFeedback(feedback: FeedbackInput): Promise<FeedbackResponse> {
  try {
    const result = await db
      .insert(feedbacks)
      .values({
        conversationId: feedback.conversationId,
        rating: feedback.rating,
        comment: feedback.comment,
        category: feedback.category,
        isPositive: feedback.isPositive,
        createdAt: new Date(),
      })
      .returning();

    return result[0] as FeedbackResponse;
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw new Error('Failed to submit feedback');
  }
}

/**
 * Get feedback for a conversation
 */
export async function getConversationFeedback(conversationId: number): Promise<FeedbackResponse[]> {
  try {
    const result = await db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.conversationId, conversationId))
      .orderBy(desc(feedbacks.createdAt));

    return result as FeedbackResponse[];
  } catch (error) {
    console.error('Failed to get feedback:', error);
    return [];
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats() {
  try {
    const allFeedbacks = await db.select().from(feedbacks);

    const totalFeedbacks = allFeedbacks.length;
    const averageRating = 
      totalFeedbacks > 0 
        ? allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks 
        : 0;

    const positiveFeedbacks = allFeedbacks.filter(f => f.isPositive).length;
    const negativeFeedbacks = totalFeedbacks - positiveFeedbacks;

    const categoryBreakdown = allFeedbacks.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFeedbacks,
      averageRating: Math.round(averageRating * 100) / 100,
      positiveFeedbacks,
      negativeFeedbacks,
      sentimentRatio: totalFeedbacks > 0 ? (positiveFeedbacks / totalFeedbacks * 100).toFixed(1) + '%' : '0%',
      categoryBreakdown,
    };
  } catch (error) {
    console.error('Failed to get feedback stats:', error);
    return null;
  }
}

/**
 * Delete feedback
 */
export async function deleteFeedback(feedbackId: number): Promise<boolean> {
  try {
    await db.delete(feedbacks).where(eq(feedbacks.id, feedbackId));
    return true;
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    return false;
  }
}
