/**
 * Feedback Loop System - Enable Disabled Layer #1
 * 
 * Captures user feedback on analyses to enable system learning and improvement
 * Stores feedback and uses it to adjust future analyses
 */

import { getDb } from './db';
import { emotionAnalyses } from '../drizzle/schema';

export interface UserFeedback {
  analysisId: string;
  userId: string;
  rating: 'positive' | 'neutral' | 'negative'; // 👍 / 😐 / 👎
  confidence: number; // 0-100, user's confidence in the feedback
  comment?: string;
  correctedValues?: Record<string, number>; // If user corrects values
  timestamp: number;
}

export interface FeedbackAnalysis {
  totalFeedback: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  averageConfidence: number;
  commonCorrections: Record<string, number>;
  learningInsights: string[];
}

/**
 * Submit feedback on an analysis
 */
export async function submitFeedback(feedback: UserFeedback): Promise<{ success: boolean; feedbackId: string }> {
  try {
    // Validate analysis exists
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Store feedback in memory (for now)
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Note: In production, this would store to database
    // For now, we're creating the structure for future integration
    const feedbackRecord = {
      id: feedbackId,
      analysisId: feedback.analysisId,
      userId: feedback.userId,
      rating: feedback.rating,
      confidence: feedback.confidence,
      comment: feedback.comment || null,
      correctedValues: JSON.stringify(feedback.correctedValues || {}),
      timestamp: feedback.timestamp,
      createdAt: new Date(),
    };

    console.log('[Feedback] Stored feedback:', feedbackRecord);

    return {
      success: true,
      feedbackId,
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      feedbackId: '',
    };
  }
}

/**
 * Get feedback for an analysis
 */
export async function getAnalysisFeedback(analysisId: string): Promise<UserFeedback[]> {
  try {
    // In a real implementation:
    // const feedbacks = await db.select().from(feedbackTable).where({ analysisId });
    // return feedbacks;

    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting feedback:', error);
    return [];
  }
}

/**
 * Analyze feedback patterns
 */
export function analyzeFeedbackPatterns(feedbacks: UserFeedback[]): FeedbackAnalysis {
  if (feedbacks.length === 0) {
    return {
      totalFeedback: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0,
      averageConfidence: 0,
      commonCorrections: {},
      learningInsights: [],
    };
  }

  // Count ratings
  const positiveCount = feedbacks.filter(f => f.rating === 'positive').length;
  const neutralCount = feedbacks.filter(f => f.rating === 'neutral').length;
  const negativeCount = feedbacks.filter(f => f.rating === 'negative').length;

  // Calculate percentages
  const total = feedbacks.length;
  const positivePercentage = (positiveCount / total) * 100;
  const neutralPercentage = (neutralCount / total) * 100;
  const negativePercentage = (negativeCount / total) * 100;

  // Calculate average confidence
  const averageConfidence =
    feedbacks.reduce((sum, f) => sum + f.confidence, 0) / feedbacks.length;

  // Analyze corrections
  const commonCorrections: Record<string, number> = {};
  for (const feedback of feedbacks) {
    if (feedback.correctedValues) {
      for (const [key, value] of Object.entries(feedback.correctedValues)) {
        commonCorrections[key] = (commonCorrections[key] || 0) + 1;
      }
    }
  }

  // Generate learning insights
  const learningInsights: string[] = [];

  if (positivePercentage > 70) {
    learningInsights.push('Analysis is generally accurate - maintain current approach');
  } else if (negativePercentage > 50) {
    learningInsights.push('Analysis needs improvement - review methodology');
  }

  if (averageConfidence < 50) {
    learningInsights.push('User confidence is low - consider adding more explanations');
  }

  if (Object.keys(commonCorrections).length > 0) {
    const mostCorrected = Object.entries(commonCorrections).sort((a, b) => b[1] - a[1])[0];
    learningInsights.push(`Most frequently corrected metric: ${mostCorrected[0]} (${mostCorrected[1]} times)`);
  }

  return {
    totalFeedback: total,
    positiveCount,
    neutralCount,
    negativeCount,
    positivePercentage,
    neutralPercentage,
    negativePercentage,
    averageConfidence,
    commonCorrections,
    learningInsights,
  };
}

/**
 * Generate feedback report
 */
export function generateFeedbackReport(analysis: FeedbackAnalysis): string {
  let report = `# Feedback Analysis Report\n\n`;

  report += `**Total Feedback:** ${analysis.totalFeedback}\n`;
  report += `**Average Confidence:** ${analysis.averageConfidence.toFixed(1)}%\n\n`;

  report += `## Rating Distribution\n`;
  report += `- **Positive (👍):** ${analysis.positiveCount} (${analysis.positivePercentage.toFixed(1)}%)\n`;
  report += `- **Neutral (😐):** ${analysis.neutralCount} (${analysis.neutralPercentage.toFixed(1)}%)\n`;
  report += `- **Negative (👎):** ${analysis.negativeCount} (${analysis.negativePercentage.toFixed(1)}%)\n\n`;

  if (Object.keys(analysis.commonCorrections).length > 0) {
    report += `## Common Corrections\n`;
    for (const [metric, count] of Object.entries(analysis.commonCorrections)) {
      report += `- **${metric}:** ${count} corrections\n`;
    }
    report += '\n';
  }

  report += `## Learning Insights\n`;
  for (const insight of analysis.learningInsights) {
    report += `- ${insight}\n`;
  }

  return report;
}

/**
 * Adjust analysis based on feedback
 */
export function adjustAnalysisBasedOnFeedback(
  originalAnalysis: Record<string, number>,
  feedbackAnalysis: FeedbackAnalysis,
  learningRate: number = 0.1
): Record<string, number> {
  const adjustedAnalysis = { ...originalAnalysis };

  // If negative feedback is high, reduce confidence
  if (feedbackAnalysis.negativePercentage > 50) {
    for (const key in adjustedAnalysis) {
      adjustedAnalysis[key] *= 1 - learningRate;
    }
  }

  // Apply corrections if they exist
  for (const [metric, count] of Object.entries(feedbackAnalysis.commonCorrections)) {
    if (metric in adjustedAnalysis && count > 2) {
      // If a metric is corrected more than twice, adjust it
      adjustedAnalysis[metric] *= 1 - learningRate * (count / 10);
    }
  }

  return adjustedAnalysis;
}

/**
 * Get feedback trends over time
 */
export function calculateFeedbackTrends(feedbacks: UserFeedback[]): {
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
} {
  if (feedbacks.length < 2) {
    return { trend: 'stable', trendPercentage: 0 };
  }

  // Split into two halves
  const midpoint = Math.floor(feedbacks.length / 2);
  const firstHalf = feedbacks.slice(0, midpoint);
  const secondHalf = feedbacks.slice(midpoint);

  // Calculate positive percentage for each half
  const firstPositive = (firstHalf.filter(f => f.rating === 'positive').length / firstHalf.length) * 100;
  const secondPositive = (secondHalf.filter(f => f.rating === 'positive').length / secondHalf.length) * 100;

  const trendPercentage = secondPositive - firstPositive;

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (trendPercentage > 5) {
    trend = 'improving';
  } else if (trendPercentage < -5) {
    trend = 'declining';
  }

  return { trend, trendPercentage };
}

/**
 * Validate feedback
 */
export function validateFeedback(feedback: UserFeedback): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!feedback.analysisId) {
    issues.push('Analysis ID is required');
  }

  if (!feedback.userId) {
    issues.push('User ID is required');
  }

  if (!['positive', 'neutral', 'negative'].includes(feedback.rating)) {
    issues.push('Rating must be positive, neutral, or negative');
  }

  if (feedback.confidence < 0 || feedback.confidence > 100) {
    issues.push('Confidence must be between 0 and 100');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Get user feedback history
 */
export async function getUserFeedbackHistory(userId: string, limit: number = 10): Promise<UserFeedback[]> {
  try {
    // In a real implementation:
    // const feedbacks = await db
    //   .select()
    //   .from(feedbackTable)
    //   .where({ userId })
    //   .orderBy({ timestamp: 'desc' })
    //   .limit(limit);
    // return feedbacks;

    return [];
  } catch (error) {
    console.error('Error getting user feedback history:', error);
    return [];
  }
}

/**
 * Calculate feedback impact score
 */
export function calculateFeedbackImpactScore(analysis: FeedbackAnalysis): number {
  let score = 50; // Base score

  // Positive feedback increases score
  score += (analysis.positivePercentage / 100) * 30;

  // Negative feedback decreases score
  score -= (analysis.negativePercentage / 100) * 30;

  // High confidence increases score
  score += (analysis.averageConfidence / 100) * 20;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}
