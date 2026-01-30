/**
 * Meta-Learning System Tests
 * Tests for the adaptive learning capabilities of DCFT
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MetaLearningEngine, FeedbackEntry } from './metaLearning';
import { VocabularyAdapter } from './vocabularyAdapter';
import { FeedbackLoopManager } from './feedbackLoop';

describe('Meta-Learning System', () => {
  describe('MetaLearningEngine', () => {
    let engine: MetaLearningEngine;

    beforeEach(() => {
      engine = new MetaLearningEngine();
    });

    it('should initialize with base vocabulary', () => {
      const stats = engine.getStats();
      expect(stats.vocabularySize).toBeGreaterThan(0);
    });

    it('should get word weight for known words', () => {
      const weight = engine.getWordWeight('happy', 'joy');
      expect(weight).toBeGreaterThan(0);
    });

    it('should return 0 for unknown words', () => {
      const weight = engine.getWordWeight('xyzabc123', 'joy');
      expect(weight).toBe(0);
    });

    it('should get vocabulary for an emotion', () => {
      const joyVocab = engine.getEmotionVocabulary('joy');
      expect(joyVocab.length).toBeGreaterThan(0);
      expect(joyVocab[0].emotion).toBe('joy');
    });

    it('should process feedback and update stats', () => {
      const feedback: FeedbackEntry = {
        id: 'test-1',
        text: 'This is a happy celebration',
        predictedEmotion: 'joy',
        actualEmotion: 'joy',
        predictedConfidence: 0.8,
        wasCorrect: true,
        timestamp: new Date(),
      };

      engine.processFeedback(feedback);
      const stats = engine.getStats();
      expect(stats.totalFeedback).toBe(1);
      expect(stats.correctPredictions).toBe(1);
    });

    it('should calculate accuracy correctly', () => {
      // Submit 3 correct and 1 incorrect feedback
      for (let i = 0; i < 3; i++) {
        engine.processFeedback({
          id: `correct-${i}`,
          text: 'happy celebration',
          predictedEmotion: 'joy',
          actualEmotion: 'joy',
          predictedConfidence: 0.8,
          wasCorrect: true,
          timestamp: new Date(),
        });
      }
      engine.processFeedback({
        id: 'incorrect-1',
        text: 'sad news',
        predictedEmotion: 'joy',
        actualEmotion: 'sadness',
        predictedConfidence: 0.6,
        wasCorrect: false,
        timestamp: new Date(),
      });

      const stats = engine.getStats();
      expect(stats.accuracy).toBe(0.75); // 3/4 = 75%
    });

    it('should add user vocabulary', () => {
      const initialSize = engine.getStats().vocabularySize;
      engine.addUserVocabulary('newword', 'hope', 0.8);
      expect(engine.getStats().vocabularySize).toBe(initialSize + 1);
      expect(engine.getWordWeight('newword', 'hope')).toBeGreaterThan(0);
    });

    it('should analyze text with learned vocabulary', () => {
      const result = engine.analyzeWithLearnedVocabulary('happy celebration victory');
      expect(result.joy).toBeGreaterThan(0);
    });

    it('should apply regional boost', () => {
      const weightWithoutRegion = engine.getWordWeight('فرح', 'joy');
      const weightWithRegion = engine.getWordWeight('فرح', 'joy', 'AR');
      expect(weightWithRegion).toBeGreaterThanOrEqual(weightWithoutRegion);
    });

    it('should export and import vocabulary', () => {
      const exported = engine.exportVocabulary();
      expect(exported.length).toBeGreaterThan(0);

      const newEngine = new MetaLearningEngine();
      newEngine.importVocabulary(exported);
      expect(newEngine.getStats().vocabularySize).toBe(exported.length);
    });

    it('should run learning cycle', () => {
      // Add some feedback first
      for (let i = 0; i < 5; i++) {
        engine.processFeedback({
          id: `feedback-${i}`,
          text: 'test text',
          predictedEmotion: 'joy',
          actualEmotion: 'joy',
          predictedConfidence: 0.8,
          wasCorrect: true,
          timestamp: new Date(),
        });
      }

      engine.runLearningCycle();
      const stats = engine.getStats();
      expect(stats.lastLearningCycle).toBeDefined();
    });
  });

  describe('VocabularyAdapter', () => {
    let adapter: VocabularyAdapter;

    beforeEach(() => {
      adapter = new VocabularyAdapter();
    });

    it('should detect context from text', () => {
      const contexts = adapter.detectContext('The stock market crashed today after investor panic');
      expect(contexts).toContain('finance');
    });

    it('should detect multiple contexts', () => {
      const contexts = adapter.detectContext('The government announced new health policy for hospitals');
      expect(contexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should return general for unknown context', () => {
      const contexts = adapter.detectContext('random text without specific context');
      expect(contexts).toContain('general');
    });

    it('should get regional variations', () => {
      const variations = adapter.getRegionalVariations('سعيد', 'AR');
      expect(variations.length).toBeGreaterThan(1);
    });

    it('should track emerging expressions', () => {
      adapter.trackEmergingExpression('newslang', { joy: 0.8 }, 'US');
      const stats = adapter.getEmergingStats();
      expect(stats.total).toBeGreaterThan(0);
    });

    it('should analyze with adaptation', () => {
      const result = adapter.analyzeWithAdaptation('The market crashed today', 'US');
      expect(result.contexts).toBeDefined();
      expect(result.emotions).toBeDefined();
      expect(result.adaptations).toBeDefined();
    });

    it('should export emerging expressions', () => {
      adapter.trackEmergingExpression('test1', { joy: 0.5 });
      adapter.trackEmergingExpression('test2', { fear: 0.7 });
      const expressions = adapter.exportEmergingExpressions();
      expect(expressions.length).toBe(2);
    });
  });

  describe('FeedbackLoopManager', () => {
    let manager: FeedbackLoopManager;

    beforeEach(() => {
      manager = new FeedbackLoopManager();
    });

    it('should log predictions', () => {
      manager.logPrediction('analysis-1', 'test text', 'joy', 0.8);
      // No direct way to verify, but should not throw
      expect(true).toBe(true);
    });

    it('should submit feedback successfully', () => {
      manager.logPrediction('analysis-1', 'happy news', 'joy', 0.8);
      
      const result = manager.submitFeedback({
        analysisId: 'analysis-1',
        text: 'happy news',
        predictedEmotion: 'joy',
        predictedConfidence: 0.8,
        rating: 5,
      });

      expect(result.success).toBe(true);
    });

    it('should handle user corrections', () => {
      const result = manager.submitFeedback({
        analysisId: 'analysis-2',
        text: 'sad news',
        predictedEmotion: 'joy',
        predictedConfidence: 0.6,
        userCorrection: 'sadness',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('correction');
    });

    it('should get feedback stats', () => {
      const stats = manager.getFeedbackStats();
      expect(stats).toHaveProperty('totalFeedback');
      expect(stats).toHaveProperty('pendingFeedback');
      expect(stats).toHaveProperty('averageRating');
      expect(stats).toHaveProperty('correctionRate');
    });

    it('should get accuracy history', () => {
      const history = manager.getAccuracyHistory(30);
      expect(Array.isArray(history)).toBe(true);
    });

    it('should start A/B test', () => {
      const test = manager.startABTest(
        'Test vocabulary change',
        'Testing new word weights',
        [{ word: 'excellent', emotion: 'joy', weight: 0.9 }]
      );

      expect(test.id).toBeDefined();
      expect(test.isActive).toBe(true);
      expect(test.variantB.vocabularyChanges.length).toBe(1);
    });

    it('should get active A/B tests', () => {
      manager.startABTest('Test 1', 'Description', []);
      const activeTests = manager.getActiveABTests();
      expect(activeTests.length).toBeGreaterThan(0);
    });

    it('should export feedback data', () => {
      const data = manager.exportFeedbackData();
      expect(data).toHaveProperty('feedback');
      expect(data).toHaveProperty('accuracy');
      expect(data).toHaveProperty('abTests');
    });
  });

  describe('Integration Tests', () => {
    it('should integrate meta-learning with vocabulary adapter', () => {
      const engine = new MetaLearningEngine();
      const adapter = new VocabularyAdapter();

      // Add custom vocabulary
      engine.addUserVocabulary('bullish', 'hope', 0.85);

      // Analyze text that includes the new word
      const result = adapter.analyzeWithAdaptation('The market outlook is bullish');
      
      // The analysis should work without errors
      expect(result.emotions).toBeDefined();
    });

    it('should integrate feedback loop with meta-learning', () => {
      const manager = new FeedbackLoopManager();

      // Submit multiple feedback entries
      for (let i = 0; i < 5; i++) {
        manager.submitFeedback({
          analysisId: `test-${i}`,
          text: 'happy celebration',
          predictedEmotion: 'joy',
          predictedConfidence: 0.8,
          rating: 5,
        });
      }

      // Check that feedback stats are updated
      const stats = manager.getFeedbackStats();
      expect(stats.totalFeedback).toBeGreaterThan(0);
    });

    it('should handle Arabic text in meta-learning', () => {
      const engine = new MetaLearningEngine();
      
      // Analyze Arabic text
      const result = engine.analyzeWithLearnedVocabulary('فرح وسعادة كبيرة', 'AR');
      
      // Should detect joy-related emotions
      expect(result.joy).toBeGreaterThan(0);
    });

    it('should handle context-aware analysis', () => {
      const adapter = new VocabularyAdapter();
      
      // Financial context
      const financeResult = adapter.analyzeWithAdaptation(
        'The stock market crashed after investor panic'
      );
      expect(financeResult.contexts).toContain('finance');
      
      // Health context
      const healthResult = adapter.analyzeWithAdaptation(
        'The hospital reported new treatment success'
      );
      expect(healthResult.contexts).toContain('health');
    });
  });
});
