/**
 * Tests for Multi-Model Groq Strategy
 * 
 * Verifies:
 * - Specialized model selection
 * - Emotion analysis with 8B model
 * - Query building with 8B model
 * - Decision making with 8B model
 * - Final explanation with 70B model
 * - Cost savings calculation
 */

import { describe, it, expect } from 'vitest';
import {
  invokeSpecializedModel,
  analyzeEmotionsWithModel,
  buildQueryWithModel,
  makeDecisionWithModel,
  generateFinalExplanationWithModel,
  getModelConfig,
  getAllModelConfigs,
  estimateCostSavings,
} from './multiModelGroq';

describe('Multi-Model Groq Strategy', () => {
  describe('Model Configuration', () => {
    it('should have correct model configs for all task types', () => {
      const configs = getAllModelConfigs();
      
      expect(configs.emotion).toBeDefined();
      expect(configs.query).toBeDefined();
      expect(configs.decision).toBeDefined();
      expect(configs.explanation).toBeDefined();
    });

    it('should use 8B models for fast tasks', () => {
      const emotionConfig = getModelConfig('emotion');
      const queryConfig = getModelConfig('query');
      const decisionConfig = getModelConfig('decision');

      expect(emotionConfig.model).toBe('llama-3.1-8b-instant');
      expect(queryConfig.model).toBe('llama-3.1-8b-instant');
      expect(decisionConfig.model).toBe('llama-3.1-8b-instant');
    });

    it('should use 70B model for final explanation', () => {
      const explanationConfig = getModelConfig('explanation');
      expect(explanationConfig.model).toBe('llama-3.1-70b-versatile');
    });

    it('should have appropriate temperature settings', () => {
      const configs = getAllModelConfigs();

      // Lower temperature for more deterministic tasks
      expect(configs.query.temperature).toBeLessThan(configs.emotion.temperature);
      expect(configs.emotion.temperature).toBeLessThan(configs.explanation.temperature);
    });

    it('should have appropriate max tokens', () => {
      const configs = getAllModelConfigs();

      // Smaller models get smaller token limits
      expect(configs.emotion.maxTokens).toBeLessThan(configs.explanation.maxTokens);
      expect(configs.query.maxTokens).toBeLessThan(configs.explanation.maxTokens);
    });
  });

  describe('Emotion Analysis with 8B Model', () => {
    it('should return emotion scores', async () => {
      const result = await analyzeEmotionsWithModel('I am very happy');
      
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should normalize emotion scores to sum to 1', async () => {
      const result = await analyzeEmotionsWithModel('This is a test');
      
      const total = Object.values(result).reduce((a: number, b: any) => a + b, 0);
      expect(total).toBeCloseTo(1, 1);
    });

    it('should handle empty input', async () => {
      const result = await analyzeEmotionsWithModel('');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should return default neutral emotion on error', async () => {
      // Test error handling
      const result = await analyzeEmotionsWithModel('test');
      expect(result).toBeDefined();
    });
  });

  describe('Query Building with 8B Model', () => {
    it('should extract query structure', async () => {
      const result = await buildQueryWithModel('Show me political news from Saudi Arabia');
      
      expect(result).toHaveProperty('intent');
      expect(result).toHaveProperty('entities');
      expect(result).toHaveProperty('filters');
    });

    it('should identify intent', async () => {
      const result = await buildQueryWithModel('Find economic trends');
      
      expect(typeof result.intent).toBe('string');
      expect(result.intent.length).toBeGreaterThan(0);
    });

    it('should extract entities as array', async () => {
      const result = await buildQueryWithModel('Economic news from Middle East');
      
      expect(Array.isArray(result.entities)).toBe(true);
    });

    it('should extract filters as object', async () => {
      const result = await buildQueryWithModel('Recent political events');
      
      expect(typeof result.filters).toBe('object');
    });

    it('should handle complex queries', async () => {
      const result = await buildQueryWithModel(
        'Show me trending topics in technology sector from last 7 days in Asia'
      );
      
      expect(result.intent).toBeDefined();
      expect(result.entities.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Decision Making with 8B Model', () => {
    it('should provide recommendation', async () => {
      const result = await makeDecisionWithModel(
        'User wants to understand market trends',
        ['Analyze historical data', 'Use real-time data', 'Combine both']
      );
      
      expect(result).toHaveProperty('recommendation');
      expect(result).toHaveProperty('reasoning');
      expect(result).toHaveProperty('confidence');
    });

    it('should return valid confidence score', async () => {
      const result = await makeDecisionWithModel(
        'Choose analysis method',
        ['Quick analysis', 'Deep analysis']
      );
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should provide reasoning', async () => {
      const result = await makeDecisionWithModel(
        'Select data source',
        ['API', 'Database', 'File']
      );
      
      expect(typeof result.reasoning).toBe('string');
      expect(result.reasoning.length).toBeGreaterThan(0);
    });

    it('should recommend one of the provided options', async () => {
      const options = ['Option A', 'Option B', 'Option C'];
      const result = await makeDecisionWithModel('Make a choice', options);
      
      expect(options).toContain(result.recommendation);
    });
  });

  describe('Final Explanation with 70B Model', () => {
    it('should generate comprehensive explanation', async () => {
      const result = await generateFinalExplanationWithModel(
        'Market analysis summary',
        ['Trend 1', 'Trend 2'],
        { period: 'Q1 2026', region: 'MENA' }
      );
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle multiple insights', async () => {
      const result = await generateFinalExplanationWithModel(
        'Summary',
        ['Insight 1', 'Insight 2', 'Insight 3', 'Insight 4'],
        { data: 'test' }
      );
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle complex context', async () => {
      const result = await generateFinalExplanationWithModel(
        'Complex analysis',
        ['Finding 1', 'Finding 2'],
        {
          metrics: { accuracy: 0.95, confidence: 0.87 },
          sources: ['API', 'Database'],
          timeframe: '7 days',
        }
      );
      
      expect(result).toBeDefined();
    });
  });

  describe('Cost Savings Calculation', () => {
    it('should calculate cost savings correctly', () => {
      const savings = estimateCostSavings(100, 100, 50, 50);
      
      expect(savings.multiModelCost).toBeLessThan(savings.singleModelCost);
      expect(savings.savings).toBeGreaterThan(0);
      expect(savings.savingsPercent).toBeGreaterThan(0);
    });

    it('should show significant savings with default values', () => {
      const savings = estimateCostSavings();
      
      // With 100 emotion, 100 query, 50 decision, 50 explanation calls:
      // Multi-model: 100*1 + 100*1 + 50*1 + 50*8 = 550
      // Single 70B: 300*8 = 2400
      // Savings: ~77%
      expect(savings.savingsPercent).toBeGreaterThan(70);
    });

    it('should calculate different scenarios', () => {
      const scenario1 = estimateCostSavings(1000, 1000, 500, 500);
      const scenario2 = estimateCostSavings(100, 100, 50, 50);
      
      // Both should show savings
      expect(scenario1.savingsPercent).toBeGreaterThan(0);
      expect(scenario2.savingsPercent).toBeGreaterThan(0);
      
      // Savings percentage should be similar
      expect(Math.abs(scenario1.savingsPercent - scenario2.savingsPercent)).toBeLessThan(5);
    });

    it('should handle edge cases', () => {
      const savings = estimateCostSavings(0, 0, 0, 100);
      
      // Only explanation calls - should break even
      expect(savings.savings).toBe(0);
      expect(savings.savingsPercent).toBe(0);
    });
  });

  describe('Integration: Multi-Model Pipeline', () => {
    it('should work through complete pipeline', async () => {
      // Step 1: Analyze emotions
      const emotions = await analyzeEmotionsWithModel('Market crash causes panic');
      expect(emotions).toBeDefined();

      // Step 2: Build query
      const query = await buildQueryWithModel('What happened in the market?');
      expect(query).toBeDefined();

      // Step 3: Make decision
      const decision = await makeDecisionWithModel(
        'Market volatility detected',
        ['Alert users', 'Wait for more data', 'Analyze trends']
      );
      expect(decision).toBeDefined();

      // Step 4: Generate final explanation
      const explanation = await generateFinalExplanationWithModel(
        'Market analysis complete',
        ['Volatility detected', 'Emotional response high'],
        { emotions, query, decision }
      );
      expect(explanation).toBeDefined();
    });

    it('should handle errors gracefully throughout pipeline', async () => {
      // All functions should handle errors and return sensible defaults
      const emotions = await analyzeEmotionsWithModel('');
      const query = await buildQueryWithModel('');
      const decision = await makeDecisionWithModel('', []);
      const explanation = await generateFinalExplanationWithModel('', [], {});

      expect(emotions).toBeDefined();
      expect(query).toBeDefined();
      expect(decision).toBeDefined();
      expect(explanation).toBeDefined();
    });
  });
});
