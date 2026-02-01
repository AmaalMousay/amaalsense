/**
 * Feedback Loop Structure
 * 
 * وظيفته:
 * - تخزين تصحيحات المستخدم
 * - جاهز للـ Learning System لاحقاً
 * - يساعد في تحسين دقة التحليل
 */

// أنواع التغذية الراجعة
export type FeedbackType = 
  | 'emotion_correction'    // تصحيح المشاعر
  | 'context_correction'    // تصحيح السياق
  | 'accuracy_rating'       // تقييم الدقة
  | 'relevance_rating'      // تقييم الصلة
  | 'general_comment';      // تعليق عام

export type FeedbackSentiment = 'positive' | 'negative' | 'neutral';

// هيكل التغذية الراجعة
export interface FeedbackEntry {
  id: string;
  analysisId: string;
  userId?: string;
  userType: string;
  timestamp: Date;
  
  // نوع التغذية الراجعة
  type: FeedbackType;
  sentiment: FeedbackSentiment;
  
  // التفاصيل
  originalValue?: string | number;
  correctedValue?: string | number;
  rating?: number; // 1-5
  comment?: string;
  
  // السياق
  topic: string;
  countryCode?: string;
  
  // الحالة
  processed: boolean;
  processedAt?: Date;
}

// إحصائيات التغذية الراجعة
export interface FeedbackStats {
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  bySentiment: Record<FeedbackSentiment, number>;
  averageRating: number;
  recentFeedback: FeedbackEntry[];
}

// مخزن التغذية الراجعة (في الذاكرة - يمكن استبداله بقاعدة بيانات)
const feedbackStore: FeedbackEntry[] = [];

/**
 * إضافة تغذية راجعة جديدة
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
  
  // الحفاظ على حجم معقول (آخر 5000 تغذية راجعة)
  if (feedbackStore.length > 5000) {
    feedbackStore.shift();
  }
  
  return newFeedback;
}

/**
 * تصحيح المشاعر
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
    sentiment: 'negative', // تصحيح يعني عدم رضا
    originalValue: originalEmotion,
    correctedValue: correctedEmotion,
    comment,
    topic
  });
}

/**
 * تقييم الدقة
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
 * تقييم الصلة
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
 * تعليق عام
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
 * الحصول على التغذية الراجعة لتحليل معين
 */
export function getFeedbackForAnalysis(analysisId: string): FeedbackEntry[] {
  return feedbackStore.filter(f => f.analysisId === analysisId);
}

/**
 * الحصول على التغذية الراجعة لموضوع معين
 */
export function getFeedbackForTopic(topic: string): FeedbackEntry[] {
  return feedbackStore.filter(f => 
    f.topic.toLowerCase().includes(topic.toLowerCase())
  );
}

/**
 * الحصول على التغذية الراجعة غير المعالجة
 */
export function getUnprocessedFeedback(): FeedbackEntry[] {
  return feedbackStore.filter(f => !f.processed);
}

/**
 * تحديد التغذية الراجعة كمعالجة
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
 * الحصول على إحصائيات التغذية الراجعة
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
  
  return {
    totalFeedback: feedbackStore.length,
    byType,
    bySentiment,
    averageRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0,
    recentFeedback: feedbackStore.slice(-10).reverse()
  };
}

/**
 * تحليل أنماط التغذية الراجعة (للتعلم المستقبلي)
 */
export function analyzeFeedbackPatterns(): {
  commonCorrections: { original: string; corrected: string; count: number }[];
  lowRatedTopics: { topic: string; avgRating: number }[];
  improvementAreas: string[];
} {
  // تجميع التصحيحات الشائعة
  const corrections: Map<string, number> = new Map();
  const topicRatings: Map<string, { total: number; count: number }> = new Map();
  
  for (const feedback of feedbackStore) {
    // التصحيحات
    if (feedback.type === 'emotion_correction' && feedback.originalValue && feedback.correctedValue) {
      const key = `${feedback.originalValue}->${feedback.correctedValue}`;
      corrections.set(key, (corrections.get(key) || 0) + 1);
    }
    
    // تقييمات المواضيع
    if (feedback.rating) {
      const current = topicRatings.get(feedback.topic) || { total: 0, count: 0 };
      current.total += feedback.rating;
      current.count++;
      topicRatings.set(feedback.topic, current);
    }
  }
  
  // التصحيحات الأكثر شيوعاً
  const commonCorrections = Array.from(corrections.entries())
    .map(([key, count]) => {
      const [original, corrected] = key.split('->');
      return { original, corrected, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // المواضيع ذات التقييم المنخفض
  const lowRatedTopics = Array.from(topicRatings.entries())
    .map(([topic, data]) => ({
      topic,
      avgRating: Math.round((data.total / data.count) * 10) / 10
    }))
    .filter(t => t.avgRating < 3)
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 10);
  
  // مجالات التحسين
  const improvementAreas: string[] = [];
  const stats = getFeedbackStats();
  
  if (stats.byType.emotion_correction > stats.totalFeedback * 0.2) {
    improvementAreas.push('تحسين دقة اكتشاف المشاعر');
  }
  if (stats.bySentiment.negative > stats.bySentiment.positive) {
    improvementAreas.push('تحسين جودة التحليل العامة');
  }
  if (stats.averageRating < 3.5) {
    improvementAreas.push('رفع مستوى رضا المستخدمين');
  }
  
  return {
    commonCorrections,
    lowRatedTopics,
    improvementAreas
  };
}

/**
 * مسح التغذية الراجعة (للاختبار)
 */
export function clearFeedback(): void {
  feedbackStore.length = 0;
}

/**
 * توليد معرف فريد
 */
function generateFeedbackId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Export the store for direct access if needed
export { feedbackStore };
