/**
 * Feedback Loop - Continuous Learning System
 * 
 * نظام التعليم المستمر من خلال تجميع التغذية الراجعة وتحسين الدقة
 */

import { z } from 'zod';

// ============================================================================
// Feedback Types
// ============================================================================

export enum FeedbackType {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  PARTIAL = 'partial',
  UNCLEAR = 'unclear',
  HELPFUL = 'helpful',
  NOT_HELPFUL = 'not_helpful',
}

export enum FeedbackSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Feedback {
  id: string;
  userId: string;
  questionId: string;
  predictionId?: string;
  analysisId?: string;
  
  // Feedback details
  type: FeedbackType;
  severity: FeedbackSeverity;
  rating: number; // 1-5
  comment: string;
  
  // Actual result
  actualResult?: string;
  expectedResult?: string;
  
  // Metadata
  timestamp: number;
  topic: string;
  region?: string;
  language: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  correctCount: number;
  incorrectCount: number;
  partialCount: number;
  averageRating: number;
  accuracyRate: number;
  
  // By topic
  byTopic: Record<string, {
    count: number;
    accuracy: number;
    avgRating: number;
  }>;
  
  // By type
  byType: Record<FeedbackType, number>;
  
  // By severity
  bySeverity: Record<FeedbackSeverity, number>;
}

// ============================================================================
// Feedback Validator
// ============================================================================

export const feedbackSchema = z.object({
  userId: z.string().min(1),
  questionId: z.string().min(1),
  predictionId: z.string().optional(),
  analysisId: z.string().optional(),
  type: z.enum(Object.values(FeedbackType) as [string, ...string[]]),
  severity: z.enum(Object.values(FeedbackSeverity) as [string, ...string[]]),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(500),
  actualResult: z.string().optional(),
  expectedResult: z.string().optional(),
  topic: z.string().min(1),
  region: z.string().optional(),
  language: z.string().default('ar'),
});

// ============================================================================
// Feedback Manager
// ============================================================================

export class FeedbackManager {
  private feedbackList: Feedback[] = [];
  private feedbackMap: Map<string, Feedback> = new Map();
  private stats: FeedbackStats = this.initializeStats();

  /**
   * Initialize stats object
   */
  private initializeStats(): FeedbackStats {
    return {
      totalFeedback: 0,
      correctCount: 0,
      incorrectCount: 0,
      partialCount: 0,
      averageRating: 0,
      accuracyRate: 0,
      byTopic: {},
      byType: {
        correct: 0,
        incorrect: 0,
        partial: 0,
        unclear: 0,
        helpful: 0,
        not_helpful: 0,
      },
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
    };
  }

  /**
   * Add feedback
   */
  addFeedback(data: z.infer<typeof feedbackSchema>): Feedback {
    const feedback: Feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      questionId: data.questionId,
      predictionId: data.predictionId,
      analysisId: data.analysisId,
      type: data.type as FeedbackType,
      severity: data.severity as FeedbackSeverity,
      rating: data.rating,
      comment: data.comment,
      actualResult: data.actualResult,
      expectedResult: data.expectedResult,
      timestamp: Date.now(),
      topic: data.topic,
      region: data.region,
      language: data.language,
    };

    this.feedbackList.push(feedback);
    this.feedbackMap.set(feedback.id, feedback);
    this.updateStats();

    return feedback;
  }

  /**
   * Get feedback by ID
   */
  getFeedback(id: string): Feedback | undefined {
    return this.feedbackMap.get(id);
  }

  /**
   * Get feedback by question
   */
  getFeedbackByQuestion(questionId: string): Feedback[] {
    return this.feedbackList.filter(f => f.questionId === questionId);
  }

  /**
   * Get feedback by user
   */
  getFeedbackByUser(userId: string): Feedback[] {
    return this.feedbackList.filter(f => f.userId === userId);
  }

  /**
   * Get feedback by topic
   */
  getFeedbackByTopic(topic: string): Feedback[] {
    return this.feedbackList.filter(f => f.topic === topic);
  }

  /**
   * Get feedback by type
   */
  getFeedbackByType(type: FeedbackType): Feedback[] {
    return this.feedbackList.filter(f => f.type === type);
  }

  /**
   * Get feedback by severity
   */
  getFeedbackBySeverity(severity: FeedbackSeverity): Feedback[] {
    return this.feedbackList.filter(f => f.severity === severity);
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    const total = this.feedbackList.length;
    if (total === 0) return;

    // Count by type
    this.stats.correctCount = this.feedbackList.filter(
      f => f.type === FeedbackType.CORRECT
    ).length;
    this.stats.incorrectCount = this.feedbackList.filter(
      f => f.type === FeedbackType.INCORRECT
    ).length;
    this.stats.partialCount = this.feedbackList.filter(
      f => f.type === FeedbackType.PARTIAL
    ).length;

    // Calculate accuracy
    this.stats.accuracyRate =
      (this.stats.correctCount / total) * 100;

    // Average rating
    const totalRating = this.feedbackList.reduce(
      (sum, f) => sum + f.rating,
      0
    );
    this.stats.averageRating = totalRating / total;

    // By topic
    const topics = new Set(this.feedbackList.map(f => f.topic));
    const topicsArray = Array.from(topics);
    for (const topic of topicsArray) {
      const topicFeedback = this.feedbackList.filter(f => f.topic === topic);
      const correctInTopic = topicFeedback.filter(
        f => f.type === FeedbackType.CORRECT
      ).length;
      const avgRatingInTopic = topicFeedback.reduce(
        (sum, f) => sum + f.rating,
        0
      ) / topicFeedback.length;

      this.stats.byTopic[topic] = {
        count: topicFeedback.length,
        accuracy: (correctInTopic / topicFeedback.length) * 100,
        avgRating: avgRatingInTopic,
      };
    }

    // By type
    for (const type of Object.values(FeedbackType)) {
      this.stats.byType[type] = this.feedbackList.filter(
        f => f.type === type
      ).length;
    }

    // By severity
    for (const severity of Object.values(FeedbackSeverity)) {
      this.stats.bySeverity[severity] = this.feedbackList.filter(
        f => f.severity === severity
      ).length;
    }

    this.stats.totalFeedback = total;
  }

  /**
   * Get statistics
   */
  getStats(): FeedbackStats {
    return this.stats;
  }

  /**
   * Get improvement areas
   */
  getImprovementAreas(): Array<{
    topic: string;
    accuracy: number;
    errorCount: number;
    priority: 'high' | 'medium' | 'low';
  }> {
    const areas = [];

    for (const [topic, stats] of Object.entries(this.stats.byTopic)) {
      const errorCount = this.feedbackList.filter(
        f => f.topic === topic && f.type === FeedbackType.INCORRECT
      ).length;

      const priority: 'high' | 'medium' | 'low' =
        stats.accuracy < 50
          ? 'high'
          : stats.accuracy < 75
          ? 'medium'
          : 'low';

      areas.push({
        topic,
        accuracy: stats.accuracy,
        errorCount,
        priority,
      });
    }

    return areas.sort((a, b) => b.errorCount - a.errorCount);
  }

  /**
   * Get common errors
   */
  getCommonErrors(limit: number = 10): Array<{
    comment: string;
    topic: string;
    count: number;
    severity: FeedbackSeverity;
  }> {
    const errors = this.feedbackList.filter(
      f => f.type === FeedbackType.INCORRECT
    );

    const errorMap = new Map<string, {
      comment: string;
      topic: string;
      count: number;
      severity: FeedbackSeverity;
    }>();

    for (const error of errors) {
      const key = `${error.topic}:${error.comment}`;
      const existing = errorMap.get(key);

      if (existing) {
        existing.count++;
      } else {
        errorMap.set(key, {
          comment: error.comment,
          topic: error.topic,
          count: 1,
          severity: error.severity,
        });
      }
    }

    return Array.from(errorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get user feedback summary
   */
  getUserSummary(userId: string): {
    totalFeedback: number;
    averageRating: number;
    accuracy: number;
    topContribution: string;
  } {
    const userFeedback = this.getFeedbackByUser(userId);
    if (userFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        accuracy: 0,
        topContribution: 'N/A',
      };
    }

    const avgRating =
      userFeedback.reduce((sum, f) => sum + f.rating, 0) /
      userFeedback.length;
    const correct = userFeedback.filter(
      f => f.type === FeedbackType.CORRECT
    ).length;
    const accuracy = (correct / userFeedback.length) * 100;

    // Find most contributed topic
    const topicMap = new Map<string, number>();
    for (const feedback of userFeedback) {
      topicMap.set(
        feedback.topic,
        (topicMap.get(feedback.topic) || 0) + 1
      );
    }
    const topContribution = Array.from(topicMap.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      totalFeedback: userFeedback.length,
      averageRating: Math.round(avgRating * 100) / 100,
      accuracy: Math.round(accuracy * 100) / 100,
      topContribution,
    };
  }

  /**
   * Get all feedback
   */
  getAllFeedback(): Feedback[] {
    return [...this.feedbackList];
  }

  /**
   * Clear feedback
   */
  clearFeedback(): void {
    this.feedbackList = [];
    this.feedbackMap.clear();
    this.stats = this.initializeStats();
  }

  /**
   * Export feedback to CSV
   */
  exportToCSV(): string {
    if (this.feedbackList.length === 0) {
      return 'No feedback data';
    }

    const headers = [
      'ID',
      'User ID',
      'Question ID',
      'Type',
      'Severity',
      'Rating',
      'Topic',
      'Region',
      'Comment',
      'Timestamp',
    ];

    const rows = this.feedbackList.map(f => [
      f.id,
      f.userId,
      f.questionId,
      f.type,
      f.severity,
      f.rating,
      f.topic,
      f.region || 'N/A',
      `"${f.comment.replace(/"/g, '""')}"`,
      new Date(f.timestamp).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csv;
  }
}

// ============================================================================
// Global Feedback Manager
// ============================================================================

export const feedbackManager = new FeedbackManager();

// ============================================================================
// Export
// ============================================================================

export const feedbackSystem = {
  FeedbackManager,
  FeedbackType,
  FeedbackSeverity,
  feedbackManager,
  feedbackSchema,
};
