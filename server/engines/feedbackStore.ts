import { t } from "../_core/i18n";

/**
 * Feedback Loop Structure
 * 
 * :
 * -   
 * -   Learning System 
 * -     
 */

//   
export type FeedbackType = 
  | 'emotion_correction'    //  
  | 'context_correction'    //  
  | 'accuracy_rating'       //  
  | 'relevance_rating'      //  
  | 'general_comment';      //  

export type FeedbackSentiment = 'positive' | 'negative' | 'neutral';

//   
export interface FeedbackEntry {
  id: string;
  analysisId: string;
  userId?: string;
  userType: string;
  timestamp: Date;
  
  //   
  type: FeedbackType;
  sentiment: FeedbackSentiment;
  
  // 
  originalValue?: string | number;
  correctedValue?: string | number;
  rating?: number; // 1-5
  comment?: string;
  
  // 
  topic: string;
  countryCode?: string;
  
  // 
  processed: boolean;
  processedAt?: Date;
}

//   
export interface FeedbackStats {
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  bySentiment: Record<FeedbackSentiment, number>;
  averageRating: number;
  accuracyRate: number;
  correctCount: number;
  recentFeedback: FeedbackEntry[];
}

//    (  -    )
const feedbackStore: FeedbackEntry[] = [];

/**
 *    
 */
export function addFeedback(
  feedback: Omit<FeedbackEntry, 'id' | 'timestamp' | 'processed'>
): FeedbackEntry {
  const newFeedback: FeedbackEntry = {
    ...feedback,
    id: generateFeedbackId(),
    timestamp: new Date(),
    processed: false
  };
  
  feedbackStore.push(newFeedback);
  
  //     ( 5000  )
  if (feedbackStore.length > 5000) {
    feedbackStore.shift();
  }
  
  return newFeedback;
}

/**
 *  
 */
export function submitEmotionCorrection(
  analysisId: string,
  userId: string | undefined,
  userType: string,
  topic: string,
  originalEmotion: string,
  correctedEmotion: string,
  comment?: string
): FeedbackEntry {
  return addFeedback({
    analysisId,
    userId,
    userType,
    type: 'emotion_correction',
    sentiment: 'negative', //    
    originalValue: originalEmotion,
    correctedValue: correctedEmotion,
    comment,
    topic
  });
}

/**
 *  
 */
export function submitAccuracyRating(
  analysisId: string,
  userId: string | undefined,
  userType: string,
  topic: string,
  rating: number, // 1-5
  comment?: string
): FeedbackEntry {
  const sentiment: FeedbackSentiment = 
    rating >= 4 ? 'positive' : 
    rating <= 2 ? 'negative' : 'neutral';
  
  return addFeedback({
    analysisId,
    userId,
    userType,
    type: 'accuracy_rating',
    sentiment,
    rating,
    comment,
    topic
  });
}

/**
 *  
 */
export function submitRelevanceRating(
  analysisId: string,
  userId: string | undefined,
  userType: string,
  topic: string,
  rating: number, // 1-5
  comment?: string
): FeedbackEntry {
  const sentiment: FeedbackSentiment = 
    rating >= 4 ? 'positive' : 
    rating <= 2 ? 'negative' : 'neutral';
  
  return addFeedback({
    analysisId,
    userId,
    userType,
    type: 'relevance_rating',
    sentiment,
    rating,
    comment,
    topic
  });
}

/**
 *  
 */
export function submitGeneralComment(
  analysisId: string,
  userId: string | undefined,
  userType: string,
  topic: string,
  comment: string,
  sentiment: FeedbackSentiment = 'neutral'
): FeedbackEntry {
  return addFeedback({
    analysisId,
    userId,
    userType,
    type: 'general_comment',
    sentiment,
    comment,
    topic
  });
}

/**
 *      
 */
export function getFeedbackForAnalysis(analysisId: string): FeedbackEntry[] {
  return feedbackStore.filter(f => f.analysisId === analysisId);
}

/**
 *      
 */
export function getFeedbackForTopic(topic: string): FeedbackEntry[] {
  return feedbackStore.filter(f => 
    f.topic.toLowerCase().includes(topic.toLowerCase())
  );
}

/**
 *      
 */
export function getUnprocessedFeedback(): FeedbackEntry[] {
  return feedbackStore.filter(f => !f.processed);
}

/**
 *    
 */
export function markAsProcessed(feedbackId: string): boolean {
  const feedback = feedbackStore.find(f => f.id === feedbackId);
  if (feedback) {
    feedback.processed = true;
    feedback.processedAt = new Date();
    return true;
  }
  return false;
}

/**
 *     
 */
export function getFeedbackStats(): FeedbackStats {
  const byType: Record<FeedbackType, number> = {
    emotion_correction: 0,
    context_correction: 0,
    accuracy_rating: 0,
    relevance_rating: 0,
    general_comment: 0
  };
  
  const bySentiment: Record<FeedbackSentiment, number> = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  let totalRating = 0;
  let ratingCount = 0;
  
  for (const feedback of feedbackStore) {
    byType[feedback.type]++;
    bySentiment[feedback.sentiment]++;
    
    if (feedback.rating) {
      totalRating += feedback.rating;
      ratingCount++;
    }
  }
  
  const positiveCount = bySentiment.positive;
  
  return {
    totalFeedback: feedbackStore.length,
    byType,
    bySentiment,
    averageRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0,
    accuracyRate: feedbackStore.length > 0 ? Math.round((positiveCount / feedbackStore.length) * 100) : 0,
    correctCount: positiveCount,
    recentFeedback: feedbackStore.slice(-10).reverse()
  };
}

/**
 *     ( )
 */
export function analyzeFeedbackPatterns(): {
  commonCorrections: { original: string; corrected: string; count: number }[];
  lowRatedTopics: { topic: string; avgRating: number }[];
  improvementAreas: string[];
} {
  //   
  const corrections: Map<string, number> = new Map();
  const topicRatings: Map<string, { total: number; count: number }> = new Map();
  
  for (const feedback of feedbackStore) {
    // 
    if (feedback.type === 'emotion_correction' && feedback.originalValue && feedback.correctedValue) {
      const key = `${feedback.originalValue}->${feedback.correctedValue}`;
      corrections.set(key, (corrections.get(key) || 0) + 1);
    }
    
    //  
    if (feedback.rating) {
      const current = topicRatings.get(feedback.topic) || { total: 0, count: 0 };
      current.total += feedback.rating;
      current.count++;
      topicRatings.set(feedback.topic, current);
    }
  }
  
  //   
  const commonCorrections = Array.from(corrections.entries())
    .map(([key, count]) => {
      const [original, corrected] = key.split('->');
      return { original, corrected, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  //    
  const lowRatedTopics = Array.from(topicRatings.entries())
    .map(([topic, data]) => ({
      topic,
      avgRating: Math.round((data.total / data.count) * 10) / 10
    }))
    .filter(t => t.avgRating < 3)
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 10);
  
  //  
  const improvementAreas: string[] = [];
  const stats = getFeedbackStats();
  
  if (stats.byType.emotion_correction > stats.totalFeedback * 0.2) {
    improvementAreas.push(t('auto.engines_feedbackStore.3.105e1bb9', 'ar'));
  }
  if (stats.bySentiment.negative > stats.bySentiment.positive) {
    improvementAreas.push(t('auto.engines_feedbackStore.2.25ca2344', 'ar'));
  }
  if (stats.averageRating < 3.5) {
    improvementAreas.push(t('auto.engines_feedbackStore.1.0b436039', 'ar'));
  }
  
  return {
    commonCorrections,
    lowRatedTopics,
    improvementAreas
  };
}

/**
 *    ()
 */
export function clearFeedback(): void {
  feedbackStore.length = 0;
}

/**
 *   
 */
function generateFeedbackId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Export the store for direct access if needed
export { feedbackStore };


/**
 * Get low rated feedback for meta learning
 */
export function getLowRatedFeedback(): FeedbackEntry[] {
  return feedbackStore.filter(f => f.rating !== undefined && f.rating < 3);
}

/**
 * Get high rated feedback for meta learning
 */
export function getHighRatedFeedback(): FeedbackEntry[] {
  return feedbackStore.filter(f => f.rating !== undefined && f.rating >= 4);
}

/**
 * Get improvement areas
 */
export function getImprovementAreas(): Array<{ topic: string; priority: string }> {
  return []; // Mock implementation based on new structure
}
