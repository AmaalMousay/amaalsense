/**
 * Feedback Loop System for DCFT Meta-Learning
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module implements the feedback collection and processing system:
 * 1. User feedback collection (corrections, ratings)
 * 2. Automatic accuracy tracking
 * 3. Continuous improvement through feedback integration
 * 4. A/B testing for vocabulary changes
 */

import { AffectiveVector } from './affectiveVector';
import { metaLearningEngine, FeedbackEntry } from './metaLearning';
import { vocabularyAdapter } from './vocabularyAdapter';

/**
 * User feedback submission
 */
export interface UserFeedback {
  analysisId: string;
  text: string;
  predictedEmotion: keyof AffectiveVector;
  predictedConfidence: number;
  userCorrection?: keyof AffectiveVector;
  rating?: 1 | 2 | 3 | 4 | 5;  // 1-5 star rating
  comment?: string;
  userId?: string;
  region?: string;
  timestamp?: Date;
}

/**
 * Accuracy tracking entry
 */
export interface AccuracyRecord {
  timestamp: Date;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  byEmotion: Record<keyof AffectiveVector, { correct: number; total: number }>;
}

/**
 * A/B test configuration
 */
export interface ABTest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  variantA: {
    description: string;
    predictions: number;
    correct: number;
  };
  variantB: {
    description: string;
    vocabularyChanges: { word: string; emotion: keyof AffectiveVector; weight: number }[];
    predictions: number;
    correct: number;
  };
  winner?: 'A' | 'B' | 'inconclusive';
}

/**
 * Feedback Loop configuration
 */
const FEEDBACK_CONFIG = {
  // Minimum feedback count before triggering learning
  minFeedbackForLearning: 10,
  
  // Accuracy threshold for triggering vocabulary review
  accuracyAlertThreshold: 0.6,
  
  // A/B test minimum sample size
  abTestMinSamples: 100,
  
  // Confidence threshold for A/B test conclusion
  abTestConfidenceThreshold: 0.95,
};

/**
 * Feedback Loop Manager
 */
export class FeedbackLoopManager {
  private pendingFeedback: UserFeedback[] = [];
  private accuracyHistory: AccuracyRecord[] = [];
  private activeABTests: ABTest[] = [];
  private predictionLog: Map<string, {
    text: string;
    prediction: keyof AffectiveVector;
    confidence: number;
    timestamp: Date;
  }> = new Map();

  /**
   * Log a prediction for later feedback matching
   */
  logPrediction(
    analysisId: string,
    text: string,
    prediction: keyof AffectiveVector,
    confidence: number
  ): void {
    this.predictionLog.set(analysisId, {
      text,
      prediction,
      confidence,
      timestamp: new Date(),
    });

    // Clean old predictions (keep last 1000)
    if (this.predictionLog.size > 1000) {
      const entries = Array.from(this.predictionLog.entries());
      entries.slice(0, entries.length - 1000).forEach(([id]) => {
        this.predictionLog.delete(id);
      });
    }
  }

  /**
   * Submit user feedback
   */
  submitFeedback(feedback: UserFeedback): {
    success: boolean;
    message: string;
    learningTriggered: boolean;
  } {
    // Get original prediction
    const originalPrediction = this.predictionLog.get(feedback.analysisId);
    
    // Determine if prediction was correct
    const wasCorrect = feedback.userCorrection 
      ? feedback.predictedEmotion === feedback.userCorrection
      : (feedback.rating && feedback.rating >= 4);

    // Create feedback entry for meta-learning
    const feedbackEntry: FeedbackEntry = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: feedback.text,
      predictedEmotion: feedback.predictedEmotion,
      actualEmotion: feedback.userCorrection || feedback.predictedEmotion,
      predictedConfidence: feedback.predictedConfidence,
      wasCorrect: wasCorrect || false,
      timestamp: feedback.timestamp || new Date(),
      userId: feedback.userId,
      region: feedback.region,
    };

    // Add to pending feedback
    this.pendingFeedback.push(feedback);

    // Process through meta-learning
    metaLearningEngine.processFeedback(feedbackEntry);

    // Track emerging expressions if user provided correction
    if (feedback.userCorrection && feedback.userCorrection !== feedback.predictedEmotion) {
      vocabularyAdapter.trackEmergingExpression(
        feedback.text,
        { [feedback.userCorrection]: 1 },
        feedback.region
      );
    }

    // Check if learning should be triggered
    const learningTriggered = this.pendingFeedback.length >= FEEDBACK_CONFIG.minFeedbackForLearning;
    
    if (learningTriggered) {
      this.triggerLearningCycle();
    }

    // Update A/B tests if active
    this.updateABTests(feedbackEntry);

    return {
      success: true,
      message: wasCorrect 
        ? 'Thank you for confirming the analysis!' 
        : 'Thank you for the correction. We will learn from this.',
      learningTriggered,
    };
  }

  /**
   * Trigger a learning cycle
   */
  private triggerLearningCycle(): void {
    // Run meta-learning cycle
    metaLearningEngine.runLearningCycle();

    // Record accuracy
    const stats = metaLearningEngine.getStats();
    const accuracyRecord: AccuracyRecord = {
      timestamp: new Date(),
      totalPredictions: stats.totalFeedback,
      correctPredictions: stats.correctPredictions,
      accuracy: stats.accuracy,
      byEmotion: this.calculateEmotionAccuracy(),
    };
    this.accuracyHistory.push(accuracyRecord);

    // Check for accuracy alerts
    if (stats.accuracy < FEEDBACK_CONFIG.accuracyAlertThreshold) {
      this.triggerAccuracyAlert(stats.accuracy);
    }

    // Clear pending feedback
    this.pendingFeedback = [];
  }

  /**
   * Calculate accuracy by emotion
   */
  private calculateEmotionAccuracy(): Record<keyof AffectiveVector, { correct: number; total: number }> {
    const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];
    const result: Record<keyof AffectiveVector, { correct: number; total: number }> = {} as any;

    emotions.forEach(emotion => {
      const emotionFeedback = this.pendingFeedback.filter(
        f => f.predictedEmotion === emotion
      );
      const correct = emotionFeedback.filter(
        f => !f.userCorrection || f.userCorrection === f.predictedEmotion
      ).length;

      result[emotion] = {
        correct,
        total: emotionFeedback.length,
      };
    });

    return result;
  }

  /**
   * Trigger accuracy alert
   */
  private triggerAccuracyAlert(accuracy: number): void {
    console.warn(`[DCFT Meta-Learning] Accuracy alert: ${(accuracy * 100).toFixed(1)}% is below threshold`);
    // In production, this could trigger notifications or automatic vocabulary review
  }

  /**
   * Start an A/B test
   */
  startABTest(
    name: string,
    description: string,
    vocabularyChanges: { word: string; emotion: keyof AffectiveVector; weight: number }[]
  ): ABTest {
    const test: ABTest = {
      id: `abtest-${Date.now()}`,
      name,
      description,
      startDate: new Date(),
      isActive: true,
      variantA: {
        description: 'Current vocabulary',
        predictions: 0,
        correct: 0,
      },
      variantB: {
        description: 'Modified vocabulary',
        vocabularyChanges,
        predictions: 0,
        correct: 0,
      },
    };

    this.activeABTests.push(test);
    return test;
  }

  /**
   * Update A/B tests with new feedback
   */
  private updateABTests(feedback: FeedbackEntry): void {
    this.activeABTests
      .filter(test => test.isActive)
      .forEach(test => {
        // Randomly assign to variant (50/50)
        const isVariantB = Math.random() < 0.5;

        if (isVariantB) {
          test.variantB.predictions++;
          if (feedback.wasCorrect) test.variantB.correct++;
        } else {
          test.variantA.predictions++;
          if (feedback.wasCorrect) test.variantA.correct++;
        }

        // Check if test can be concluded
        this.checkABTestConclusion(test);
      });
  }

  /**
   * Check if A/B test can be concluded
   */
  private checkABTestConclusion(test: ABTest): void {
    const { abTestMinSamples, abTestConfidenceThreshold } = FEEDBACK_CONFIG;

    // Need minimum samples in both variants
    if (test.variantA.predictions < abTestMinSamples || 
        test.variantB.predictions < abTestMinSamples) {
      return;
    }

    const accuracyA = test.variantA.correct / test.variantA.predictions;
    const accuracyB = test.variantB.correct / test.variantB.predictions;

    // Simple statistical significance check
    const difference = Math.abs(accuracyA - accuracyB);
    const pooledVariance = Math.sqrt(
      (accuracyA * (1 - accuracyA) / test.variantA.predictions) +
      (accuracyB * (1 - accuracyB) / test.variantB.predictions)
    );
    const zScore = difference / pooledVariance;
    const confidence = this.zScoreToConfidence(zScore);

    if (confidence >= abTestConfidenceThreshold) {
      test.isActive = false;
      test.endDate = new Date();
      test.winner = accuracyA > accuracyB ? 'A' : 'B';

      // If variant B wins, apply vocabulary changes
      if (test.winner === 'B') {
        test.variantB.vocabularyChanges.forEach(change => {
          metaLearningEngine.addUserVocabulary(change.word, change.emotion, change.weight);
        });
      }
    } else if (test.variantA.predictions + test.variantB.predictions > abTestMinSamples * 4) {
      // If we have 4x the minimum samples and still no conclusion, mark as inconclusive
      test.isActive = false;
      test.endDate = new Date();
      test.winner = 'inconclusive';
    }
  }

  /**
   * Convert z-score to confidence level
   */
  private zScoreToConfidence(zScore: number): number {
    // Approximation of normal CDF
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = zScore < 0 ? -1 : 1;
    const z = Math.abs(zScore) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  /**
   * Get accuracy history
   */
  getAccuracyHistory(days: number = 30): AccuracyRecord[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.accuracyHistory.filter(r => r.timestamp >= cutoff);
  }

  /**
   * Get active A/B tests
   */
  getActiveABTests(): ABTest[] {
    return this.activeABTests.filter(t => t.isActive);
  }

  /**
   * Get all A/B tests
   */
  getAllABTests(): ABTest[] {
    return [...this.activeABTests];
  }

  /**
   * Get feedback statistics
   */
  getFeedbackStats(): {
    totalFeedback: number;
    pendingFeedback: number;
    averageRating: number;
    correctionRate: number;
  } {
    const withRating = this.pendingFeedback.filter(f => f.rating);
    const withCorrection = this.pendingFeedback.filter(f => f.userCorrection);

    return {
      totalFeedback: metaLearningEngine.getStats().totalFeedback,
      pendingFeedback: this.pendingFeedback.length,
      averageRating: withRating.length > 0
        ? withRating.reduce((sum, f) => sum + (f.rating || 0), 0) / withRating.length
        : 0,
      correctionRate: this.pendingFeedback.length > 0
        ? withCorrection.length / this.pendingFeedback.length
        : 0,
    };
  }

  /**
   * Export feedback data for analysis
   */
  exportFeedbackData(): {
    feedback: UserFeedback[];
    accuracy: AccuracyRecord[];
    abTests: ABTest[];
  } {
    return {
      feedback: [...this.pendingFeedback],
      accuracy: [...this.accuracyHistory],
      abTests: [...this.activeABTests],
    };
  }
}

/**
 * Create singleton instance
 */
export const feedbackLoopManager = new FeedbackLoopManager();
