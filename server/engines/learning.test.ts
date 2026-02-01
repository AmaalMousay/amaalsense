/**
 * Tests for AI Learning System
 * Smart Storage + Feedback + Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Learning Store
import {
  storeAnalysisRecord,
  getAnalysisRecord,
  getRecentAnalyses,
  searchAnalyses,
  submitAccuracyFeedback,
  submitOutcomeFeedback,
  submitCorrectionFeedback,
  getFeedbackForAnalysis,
  getLearningState,
  clearLearningData,
} from './learningStore';

// Learning Loop
import {
  runLearningCycle,
  getEngineWeights,
  getEmotionBiases,
  applyEmotionBias,
  evaluatePrediction,
  getLearningSummary,
  resetLearning,
  predictEmotionTrend,
} from './learningLoop';

// ============================================
// Learning Store Tests
// ============================================
describe('Learning Store - Smart Storage', () => {
  beforeEach(() => {
    clearLearningData();
  });

  it('should store analysis record with question, context, and result', () => {
    const record = storeAnalysisRecord(
      // Question
      {
        topic: 'Climate Change',
        countryCode: 'US',
        countryName: 'United States',
        userType: 'researcher',
        language: 'en',
        originalQuery: 'What is the emotional response to climate change in the US?',
      },
      // Context
      {
        domain: 'environment',
        eventType: 'crisis',
        sensitivityLevel: 'high',
        timeRange: 'week',
        sourcesUsed: ['reuters', 'bbc', 'twitter'],
        sourceCount: 3,
        dataQuality: 75,
      },
      // Result
      {
        gmi: 35,
        cfi: 65,
        hri: 40,
        dominantEmotion: 'fear',
        emotionalIntensity: 72,
        valence: -25,
        affectiveVector: { joy: 15, fear: 72, anger: 45, sadness: 55, hope: 30, curiosity: 25 },
        confidence: 78,
        insights: ['High concern about climate impacts', 'Growing activism'],
        drivers: ['Extreme weather events', 'Scientific reports'],
      },
      // Engine Contributions
      {
        contextClassification: 85,
        emotionFusion: 78,
        emotionalDynamics: 72,
        driverDetection: 80,
        explainableInsight: 75,
      }
    );

    expect(record.id).toBeDefined();
    expect(record.id).toMatch(/^AML-/);
    expect(record.question.topic).toBe('Climate Change');
    expect(record.context.domain).toBe('environment');
    expect(record.result.gmi).toBe(35);
    expect(record.learningMeta.wasCorrect).toBeNull();
  });

  it('should retrieve analysis by ID', () => {
    const stored = storeAnalysisRecord(
      { topic: 'Test', countryCode: 'LY', countryName: 'Libya', userType: 'general', language: 'ar', originalQuery: 'test' },
      { domain: 'general', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 0, dataQuality: 50 },
      { gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'curiosity', emotionalIntensity: 50, valence: 0, affectiveVector: {}, confidence: 60, insights: [], drivers: [] },
      { contextClassification: 70, emotionFusion: 70, emotionalDynamics: 70, driverDetection: 70, explainableInsight: 70 }
    );

    const retrieved = getAnalysisRecord(stored.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(stored.id);
  });

  it('should search analyses by topic', () => {
    storeAnalysisRecord(
      { topic: 'Economy', countryCode: 'EG', countryName: 'Egypt', userType: 'trader', language: 'ar', originalQuery: 'economy analysis' },
      { domain: 'economy', eventType: 'general', sensitivityLevel: 'medium', timeRange: 'week', sourcesUsed: [], sourceCount: 5, dataQuality: 70 },
      { gmi: 45, cfi: 40, hri: 55, dominantEmotion: 'hope', emotionalIntensity: 55, valence: 15, affectiveVector: {}, confidence: 72, insights: [], drivers: [] },
      { contextClassification: 75, emotionFusion: 72, emotionalDynamics: 70, driverDetection: 68, explainableInsight: 74 }
    );

    storeAnalysisRecord(
      { topic: 'Sports', countryCode: 'EG', countryName: 'Egypt', userType: 'general', language: 'ar', originalQuery: 'sports news' },
      { domain: 'sports', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 3, dataQuality: 65 },
      { gmi: 70, cfi: 20, hri: 75, dominantEmotion: 'joy', emotionalIntensity: 75, valence: 50, affectiveVector: {}, confidence: 80, insights: [], drivers: [] },
      { contextClassification: 80, emotionFusion: 78, emotionalDynamics: 75, driverDetection: 72, explainableInsight: 77 }
    );

    const economyResults = searchAnalyses({ topic: 'Economy' });
    expect(economyResults.length).toBe(1);
    expect(economyResults[0].question.topic).toBe('Economy');

    const egyptResults = searchAnalyses({ countryCode: 'EG' });
    expect(egyptResults.length).toBe(2);
  });
});

describe('Learning Store - Feedback System', () => {
  beforeEach(() => {
    clearLearningData();
  });

  it('should submit accuracy feedback', () => {
    const record = storeAnalysisRecord(
      { topic: 'Test', countryCode: null, countryName: null, userType: 'general', language: 'en', originalQuery: 'test' },
      { domain: 'general', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 0, dataQuality: 50 },
      { gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'curiosity', emotionalIntensity: 50, valence: 0, affectiveVector: {}, confidence: 60, insights: [], drivers: [] },
      { contextClassification: 70, emotionFusion: 70, emotionalDynamics: 70, driverDetection: 70, explainableInsight: 70 }
    );

    const feedback = submitAccuracyFeedback(record.id, 5, 'Very accurate!');
    
    expect(feedback.feedbackType).toBe('accuracy');
    expect(feedback.userRating).toBe(5);
    
    const updatedRecord = getAnalysisRecord(record.id);
    expect(updatedRecord?.learningMeta.feedbackReceived).toBe(true);
    expect(updatedRecord?.learningMeta.wasCorrect).toBe(true);
  });

  it('should submit outcome feedback (هل تحقق التوقع؟)', () => {
    const record = storeAnalysisRecord(
      { topic: 'Election', countryCode: 'US', countryName: 'USA', userType: 'journalist', language: 'en', originalQuery: 'election outcome' },
      { domain: 'politics', eventType: 'election', sensitivityLevel: 'high', timeRange: 'week', sourcesUsed: [], sourceCount: 10, dataQuality: 80 },
      { gmi: 30, cfi: 60, hri: 45, dominantEmotion: 'fear', emotionalIntensity: 65, valence: -20, affectiveVector: {}, confidence: 75, insights: [], drivers: [] },
      { contextClassification: 80, emotionFusion: 75, emotionalDynamics: 78, driverDetection: 72, explainableInsight: 76 }
    );

    const feedback = submitOutcomeFeedback(
      record.id,
      'fear', // predicted
      'hope', // actual - different!
      'The election results brought hope instead of fear'
    );

    expect(feedback.feedbackType).toBe('outcome');
    expect(feedback.outcomeMatch).toBe(false);
    
    const updatedRecord = getAnalysisRecord(record.id);
    expect(updatedRecord?.learningMeta.wasCorrect).toBe(false);
    expect(updatedRecord?.learningMeta.actualOutcome).toBe('hope');
  });

  it('should submit correction feedback', () => {
    const record = storeAnalysisRecord(
      { topic: 'Test', countryCode: null, countryName: null, userType: 'general', language: 'en', originalQuery: 'test' },
      { domain: 'general', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 0, dataQuality: 50 },
      { gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'fear', emotionalIntensity: 50, valence: 0, affectiveVector: {}, confidence: 60, insights: [], drivers: [] },
      { contextClassification: 70, emotionFusion: 70, emotionalDynamics: 70, driverDetection: 70, explainableInsight: 70 }
    );

    const feedback = submitCorrectionFeedback(
      record.id,
      'fear',
      'curiosity',
      'The tone was curious, not fearful'
    );

    expect(feedback.feedbackType).toBe('correction');
    expect(feedback.originalValue).toBe('fear');
    expect(feedback.correctedValue).toBe('curiosity');
    
    const updatedRecord = getAnalysisRecord(record.id);
    expect(updatedRecord?.learningMeta.correctionApplied).toBe(true);
  });

  it('should track learning state', () => {
    // Create some analyses with feedback
    for (let i = 0; i < 5; i++) {
      const record = storeAnalysisRecord(
        { topic: `Topic ${i}`, countryCode: null, countryName: null, userType: 'general', language: 'en', originalQuery: `query ${i}` },
        { domain: 'general', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 0, dataQuality: 50 },
        { gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'curiosity', emotionalIntensity: 50, valence: 0, affectiveVector: {}, confidence: 60, insights: [], drivers: [] },
        { contextClassification: 70, emotionFusion: 70, emotionalDynamics: 70, driverDetection: 70, explainableInsight: 70 }
      );
      
      // Give positive feedback to some, negative to others
      submitAccuracyFeedback(record.id, i < 3 ? 5 : 2);
    }

    const state = getLearningState();
    expect(state.totalAnalyses).toBe(5);
    expect(state.verifiedAnalyses).toBe(5);
    expect(state.correctPredictions).toBe(3);
    expect(state.incorrectPredictions).toBe(2);
    expect(state.accuracyRate).toBe(60);
  });
});

// ============================================
// Learning Loop Tests
// ============================================
describe('Learning Loop', () => {
  beforeEach(() => {
    clearLearningData();
    resetLearning();
  });

  it('should have default engine weights', () => {
    const weights = getEngineWeights();
    
    expect(weights.contextClassification).toBe(0.20);
    expect(weights.emotionFusion).toBe(0.25);
    expect(weights.emotionalDynamics).toBe(0.20);
    expect(weights.driverDetection).toBe(0.15);
    expect(weights.explainableInsight).toBe(0.20);
  });

  it('should have zero emotion biases initially', () => {
    const biases = getEmotionBiases();
    
    expect(biases.joy).toBe(0);
    expect(biases.fear).toBe(0);
    expect(biases.anger).toBe(0);
    expect(biases.sadness).toBe(0);
    expect(biases.hope).toBe(0);
    expect(biases.curiosity).toBe(0);
  });

  it('should apply emotion biases correctly', () => {
    const emotions = { joy: 50, fear: 50, anger: 50 };
    const adjusted = applyEmotionBias(emotions);
    
    // With zero biases, should be unchanged
    expect(adjusted.joy).toBe(50);
    expect(adjusted.fear).toBe(50);
    expect(adjusted.anger).toBe(50);
  });

  it('should evaluate prediction accuracy', () => {
    const result = evaluatePrediction(
      'test-id',
      { dominantEmotion: 'fear', gmi: 35, trend: 'down' },
      { dominantEmotion: 'fear', gmi: 38, trend: 'down' }
    );

    expect(result.emotionMatch).toBe(true);
    expect(result.trendMatch).toBe(true);
    expect(result.gmiError).toBe(3);
    expect(result.overallScore).toBeGreaterThan(80);
    expect(result.feedback).toContain('دقيق');
  });

  it('should detect wrong predictions', () => {
    const result = evaluatePrediction(
      'test-id',
      { dominantEmotion: 'fear', gmi: 35, trend: 'down' },
      { dominantEmotion: 'hope', gmi: 65, trend: 'up' }
    );

    expect(result.emotionMatch).toBe(false);
    expect(result.trendMatch).toBe(false);
    expect(result.gmiError).toBe(30);
    expect(result.overallScore).toBeLessThan(40);
    expect(result.feedback).toContain('غلط');
  });

  it('should run learning cycle', () => {
    // Add some feedback first
    for (let i = 0; i < 5; i++) {
      const record = storeAnalysisRecord(
        { topic: `Topic ${i}`, countryCode: null, countryName: null, userType: 'general', language: 'en', originalQuery: `query ${i}` },
        { domain: 'general', eventType: 'general', sensitivityLevel: 'low', timeRange: 'day', sourcesUsed: [], sourceCount: 0, dataQuality: 50 },
        { gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'fear', emotionalIntensity: 50, valence: 0, affectiveVector: {}, confidence: 60, insights: [], drivers: [] },
        { contextClassification: 70, emotionFusion: 70, emotionalDynamics: 70, driverDetection: 70, explainableInsight: 70 }
      );
      
      // Submit corrections to create patterns
      if (i < 3) {
        submitCorrectionFeedback(record.id, 'fear', 'hope', 'Was actually hopeful');
      }
    }

    const cycle = runLearningCycle();
    
    expect(cycle.id).toMatch(/^CYCLE-/);
    expect(cycle.analysesReviewed).toBe(3); // Only verified ones
    expect(cycle.patternsFound).toBeGreaterThanOrEqual(0);
  });

  it('should predict emotion trend', () => {
    const history = [
      { emotion: 'fear', intensity: 60, timestamp: new Date(Date.now() - 3600000 * 4) },
      { emotion: 'fear', intensity: 55, timestamp: new Date(Date.now() - 3600000 * 3) },
      { emotion: 'fear', intensity: 50, timestamp: new Date(Date.now() - 3600000 * 2) },
      { emotion: 'fear', intensity: 45, timestamp: new Date(Date.now() - 3600000) },
    ];

    const prediction = predictEmotionTrend('fear', 40, history);
    
    expect(prediction.predictedIntensity).toBeLessThan(45); // Should predict decrease
    expect(prediction.confidence).toBeGreaterThan(0);
    expect(prediction.reasoning).toBeDefined();
  });

  it('should get learning summary', () => {
    const summary = getLearningSummary();
    
    expect(summary.totalCycles).toBe(0);
    expect(summary.currentWeights).toBeDefined();
    expect(summary.emotionBiases).toBeDefined();
    expect(summary.currentWeights.emotionFusion).toBe(0.25);
  });
});
