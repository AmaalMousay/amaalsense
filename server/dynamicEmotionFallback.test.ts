/**
 * Tests for Dynamic Emotion Fallback System
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateDynamicEmotionFallback, 
  convertToSystemFormat,
  DynamicEmotionFallback 
} from './dynamicEmotionFallback';

describe('Dynamic Emotion Fallback System', () => {
  
  describe('Death-related questions', () => {
    it('should detect death keywords and increase sadness', () => {
      const result = calculateDynamicEmotionFallback(
        'مااسباب موت سيف الاسلام القدافي',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.5);
      expect(result.fear).toBeGreaterThan(0.3);
      expect(result.joy).toBeLessThan(0.2);
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it('should handle English death keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'death of the president',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.3);
      expect(result.fear).toBeGreaterThan(0.2);
    });

    it('should handle assassination keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'مااسباب اغتيال سيف الاسلام القدافي',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.4);
      expect(result.anger).toBeGreaterThanOrEqual(0.05);
    });
  });

  describe('Crisis/disaster questions', () => {
    it('should detect crisis keywords and increase fear', () => {
      const result = calculateDynamicEmotionFallback(
        'ما تأثير الأزمة الاقتصادية على المجتمع؟',
        'emotional_analysis'
      );
      
      expect(result.fear).toBeGreaterThan(0.3);
      expect(result.sadness).toBeGreaterThan(0.15);
    });

    it('should handle war-related keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'What will happen if there is a war?',
        'prediction'
      );
      
      expect(result.fear).toBeGreaterThan(0.4);
    });
  });

  describe('Hope/positive questions', () => {
    it('should detect hope keywords and increase hope', () => {
      const result = calculateDynamicEmotionFallback(
        'هل هناك أمل في تحسن الوضع الاقتصادي؟',
        'emotional_analysis'
      );
      
      expect(result.hope).toBeGreaterThan(0.5);
      expect(result.joy).toBeGreaterThan(0.2);
    });

    it('should handle success-related keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'What are the opportunities for success?',
        'factual'
      );
      
      expect(result.hope).toBeGreaterThan(0.4);
    });
  });

  describe('Anger/conflict questions', () => {
    it('should detect anger keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'كيف يشعر الناس بالظلم من هذا النظام؟',
        'emotional_analysis'
      );
      
      expect(result.anger).toBeGreaterThanOrEqual(0.1);
      expect(result.sadness).toBeGreaterThanOrEqual(0.1);
    });

    it('should handle violence-related keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'What about the violence in the region?',
        'emotional_analysis'
      );
      
      expect(result.anger).toBeGreaterThan(0.2);
    });
  });

  describe('Curiosity/factual questions', () => {
    it('should detect question keywords', () => {
      const result = calculateDynamicEmotionFallback(
        'لماذا يحدث هذا؟',
        'factual'
      );
      
      expect(result.curiosity).toBeGreaterThan(0.4);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('should handle how/what questions', () => {
      const result = calculateDynamicEmotionFallback(
        'How does this affect society?',
        'factual'
      );
      
      expect(result.curiosity).toBeGreaterThan(0.3);
    });
  });

  describe('Question type defaults', () => {
    it('should use emotional_analysis defaults when no keywords match', () => {
      const result = calculateDynamicEmotionFallback(
        'random text without keywords',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.2);
      expect(result.hope).toBeGreaterThan(0.1);
    });

    it('should use prediction defaults', () => {
      const result = calculateDynamicEmotionFallback(
        'random text',
        'prediction'
      );
      
      expect(result.hope).toBeGreaterThan(0.2);
      expect(result.fear).toBeGreaterThan(0.1);
    });

    it('should use factual defaults', () => {
      const result = calculateDynamicEmotionFallback(
        'random text',
        'factual'
      );
      
      expect(result.curiosity).toBeGreaterThan(0.3);
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it('should use general defaults for unknown types', () => {
      const result = calculateDynamicEmotionFallback(
        'random text',
        'unknown_type'
      );
      
      expect(result.joy).toBeGreaterThan(0.1);
      expect(result.hope).toBeGreaterThan(0.1);
    });
  });

  describe('Emotion normalization', () => {
    it('should ensure all emotions are between 0 and 1', () => {
      const result = calculateDynamicEmotionFallback(
        'موت وأزمة وحرب وظلم',
        'emotional_analysis'
      );
      
      expect(result.joy).toBeGreaterThanOrEqual(0);
      expect(result.joy).toBeLessThanOrEqual(1);
      expect(result.hope).toBeGreaterThanOrEqual(0);
      expect(result.hope).toBeLessThanOrEqual(1);
      expect(result.sadness).toBeGreaterThanOrEqual(0);
      expect(result.sadness).toBeLessThanOrEqual(1);
      expect(result.anger).toBeGreaterThanOrEqual(0);
      expect(result.anger).toBeLessThanOrEqual(1);
      expect(result.fear).toBeGreaterThanOrEqual(0);
      expect(result.fear).toBeLessThanOrEqual(1);
      expect(result.curiosity).toBeGreaterThanOrEqual(0);
      expect(result.curiosity).toBeLessThanOrEqual(1);
    });

    it('should ensure confidence is between 0 and 1', () => {
      const result = calculateDynamicEmotionFallback(
        'any question',
        'emotional_analysis'
      );
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should ensure minimum values for all emotions', () => {
      const result = calculateDynamicEmotionFallback(
        'random text without keywords',
        'general'
      );
      
      expect(result.joy).toBeGreaterThanOrEqual(0.05);
      expect(result.hope).toBeGreaterThanOrEqual(0.05);
      expect(result.sadness).toBeGreaterThanOrEqual(0.05);
      expect(result.anger).toBeGreaterThanOrEqual(0.05);
      expect(result.fear).toBeGreaterThanOrEqual(0.05);
      expect(result.curiosity).toBeGreaterThanOrEqual(0.05);
    });
  });

  describe('System format conversion', () => {
    it('should convert to 0-100 scale', () => {
      const fallback: DynamicEmotionFallback = {
        joy: 0.5,
        hope: 0.7,
        sadness: 0.3,
        anger: 0.2,
        fear: 0.4,
        curiosity: 0.6,
        confidence: 0.8,
      };
      
      const systemFormat = convertToSystemFormat(fallback);
      
      expect(systemFormat.joy).toBe(50);
      expect(systemFormat.hope).toBe(70);
      expect(systemFormat.sadness).toBe(30);
      expect(systemFormat.anger).toBe(20);
      expect(systemFormat.fear).toBe(40);
      expect(systemFormat.curiosity).toBe(60);
    });

    it('should round values correctly', () => {
      const fallback: DynamicEmotionFallback = {
        joy: 0.555,
        hope: 0.444,
        sadness: 0.666,
        anger: 0.333,
        fear: 0.777,
        curiosity: 0.888,
        confidence: 0.999,
      };
      
      const systemFormat = convertToSystemFormat(fallback);
      
      expect(systemFormat.joy).toBe(56);
      expect(systemFormat.hope).toBe(44);
      expect(systemFormat.sadness).toBe(67);
      expect(systemFormat.anger).toBe(33);
      expect(systemFormat.fear).toBe(78);
      expect(systemFormat.curiosity).toBe(89);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle complex Arabic question about death and impact', () => {
      const result = calculateDynamicEmotionFallback(
        'ما هي أسباب موت الشاب وما تأثير ذلك على المجتمع؟',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.5);
      expect(result.fear).toBeGreaterThan(0.3);
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it('should handle mixed emotions question', () => {
      const result = calculateDynamicEmotionFallback(
        'رغم الأزمة الاقتصادية، هل هناك أمل في المستقبل؟',
        'prediction'
      );
      
      expect(result.fear).toBeGreaterThan(0.2);
      expect(result.hope).toBeGreaterThan(0.3);
    });

    it('should handle English question about violence and injustice', () => {
      const result = calculateDynamicEmotionFallback(
        'Why is there so much violence and injustice in the world?',
        'emotional_analysis'
      );
      
      expect(result.anger).toBeGreaterThanOrEqual(0.15);
      expect(result.sadness).toBeGreaterThanOrEqual(0.15);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const result = calculateDynamicEmotionFallback('', 'general');
      
      expect(result.joy).toBeGreaterThanOrEqual(0.05);
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should handle very long text', () => {
      const longText = 'موت '.repeat(100) + 'أزمة '.repeat(100);
      const result = calculateDynamicEmotionFallback(longText, 'emotional_analysis');
      
      expect(result.sadness).toBeGreaterThan(0.5);
      expect(result.fear).toBeGreaterThan(0.3);
    });

    it('should handle mixed case Arabic and English', () => {
      const result = calculateDynamicEmotionFallback(
        'موت Death أزمة Crisis',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.5);
      expect(result.fear).toBeGreaterThan(0.3);
    });

    it('should handle special characters', () => {
      const result = calculateDynamicEmotionFallback(
        'موت!!! @أزمة# $%^',
        'emotional_analysis'
      );
      
      expect(result.sadness).toBeGreaterThan(0.5);
      expect(result.fear).toBeGreaterThan(0.3);
    });
  });
});
