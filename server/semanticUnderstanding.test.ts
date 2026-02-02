/**
 * Tests for Semantic Understanding Layer
 * Testing Intent Classification, Semantic Parsing, and Context Building
 */

import { describe, it, expect } from 'vitest';
import {
  classifyIntent,
  parseQuestion,
  buildContext,
} from './semanticUnderstanding';

describe('Semantic Understanding Layer', () => {
  
  describe('Intent Classifier', () => {
    
    it('should classify decision support questions correctly', () => {
      const questions = [
        'هل انخفاض أسعار الفضة فرصة أم خطر؟',
        'Should I buy gold now?',
        'هل أستثمر في البيتكوين؟',
        'Is this a good time to invest?'
      ];
      
      for (const q of questions) {
        const result = classifyIntent(q);
        expect(result.intent).toBe('decision_support');
        expect(result.confidence).toBeGreaterThan(30);
      }
    });
    
    it('should classify prediction questions correctly', () => {
      // Using keywords from INTENT_KEYWORDS.prediction
      const questions = [
        'ماذا تتوقع للذهب غداً؟', // تتوقع + غداً
        'What will happen tomorrow?', // tomorrow + will happen
        'ما التوقعات للمستقبل؟' // التوقعات + المستقبل
      ];
      
      for (const q of questions) {
        const result = classifyIntent(q);
        expect(result.intent).toBe('prediction');
        expect(result.confidence).toBeGreaterThan(30);
      }
    });
    
    it('should classify explanation questions correctly', () => {
      const questions = [
        'لماذا انخفض سعر الفضة؟',
        'Why did the market crash?',
        'ما السبب وراء هذا الهبوط؟'
      ];
      
      for (const q of questions) {
        const result = classifyIntent(q);
        expect(result.intent).toBe('explanation');
        expect(result.confidence).toBeGreaterThan(30);
      }
    });
    
    it('should classify scenario questions correctly', () => {
      const questions = [
        'ماذا لو استمر الانخفاض؟',
        'What if the price drops further?'
      ];
      
      for (const q of questions) {
        const result = classifyIntent(q);
        expect(result.intent).toBe('scenario');
        expect(result.confidence).toBeGreaterThan(30);
      }
    });
    
    it('should return general intent for vague questions', () => {
      const result = classifyIntent('hello');
      expect(result.intent).toBe('general');
    });
    
  });
  
  describe('Semantic Parser', () => {
    
    it('should parse question and extract semantic frame', () => {
      const question = 'هل انخفاض أسعار الفضة فرصة أم خطر؟';
      const frame = parseQuestion(question);
      
      expect(frame).toBeDefined();
      expect(frame.intent).toBe('decision_support');
      expect(frame.entity).toBe('silver');
      expect(frame.domain).toBe('commodities');
      expect(frame.direction).toBe('down');
      expect(frame.originalQuestion).toBe(question);
    });
    
    it('should detect entity type correctly', () => {
      const goldQuestion = parseQuestion('What about gold prices?');
      expect(goldQuestion.entity).toBe('gold');
      expect(goldQuestion.entityType).toBe('asset');
      
      const libyaQuestion = parseQuestion('ما الوضع في ليبيا؟');
      expect(libyaQuestion.entity).toBe('libya');
      expect(libyaQuestion.entityType).toBe('country');
    });
    
    it('should detect domain correctly', () => {
      const cryptoQuestion = parseQuestion('Bitcoin price prediction');
      expect(cryptoQuestion.domain).toBe('crypto');
      
      const commoditiesQuestion = parseQuestion('Gold price analysis');
      expect(commoditiesQuestion.domain).toBe('commodities');
    });
    
    it('should extract keywords', () => {
      const frame = parseQuestion('Silver price decline opportunity');
      expect(frame.keywords.length).toBeGreaterThan(0);
      expect(frame.keywords).toContain('silver');
    });
    
    it('should determine expected response type based on intent', () => {
      const decisionFrame = parseQuestion('Should I buy gold?');
      expect(decisionFrame.expectedResponseType).toBe('verdict');
      
      const explanationFrame = parseQuestion('Why did the price drop?');
      expect(explanationFrame.expectedResponseType).toBe('explanation');
    });
    
    it('should detect sentiment in question', () => {
      const positiveFrame = parseQuestion('Is this a good opportunity?');
      expect(positiveFrame.sentiment).toBe('positive');
      
      const negativeFrame = parseQuestion('Is this a dangerous risk?');
      expect(negativeFrame.sentiment).toBe('negative');
      
      const mixedFrame = parseQuestion('Is this an opportunity or risk?');
      expect(mixedFrame.sentiment).toBe('mixed');
    });
    
  });
  
  describe('Context Builder', () => {
    
    const mockIndicators = {
      gmi: 15,
      cfi: 67,
      hri: 55,
      dominantEmotion: 'fear',
      confidence: 80
    };
    
    it('should build context with current indicators', () => {
      const frame = parseQuestion('Is silver a good buy?');
      const context = buildContext(frame, mockIndicators);
      
      expect(context.currentIndicators).toEqual(mockIndicators);
    });
    
    it('should determine trend direction', () => {
      // High fear, low hope = declining
      const decliningContext = buildContext(
        parseQuestion('test'),
        { gmi: -40, cfi: 80, hri: 30, dominantEmotion: 'fear', confidence: 80 }
      );
      expect(decliningContext.trend.direction).toBe('declining');
      
      // High hope, low fear = improving
      const improvingContext = buildContext(
        parseQuestion('test'),
        { gmi: 40, cfi: 30, hri: 70, dominantEmotion: 'hope', confidence: 80 }
      );
      expect(improvingContext.trend.direction).toBe('improving');
    });
    
    it('should generate reasoning rules', () => {
      const frame = parseQuestion('Should I invest?');
      const context = buildContext(frame, mockIndicators);
      
      expect(context.reasoningRules).toBeDefined();
      expect(context.reasoningRules.length).toBeGreaterThan(0);
    });
    
    it('should generate preliminary recommendation for decision questions', () => {
      const frame = parseQuestion('Is this a good opportunity?');
      const context = buildContext(frame, mockIndicators);
      
      expect(context.preliminaryRecommendation).toBeDefined();
      expect(context.preliminaryRecommendation.length).toBeGreaterThan(0);
    });
    
    it('should include historical context', () => {
      const frame = parseQuestion('test');
      const context = buildContext(frame, mockIndicators);
      
      expect(context.historicalContext).toBeDefined();
      expect(context.historicalContext.yesterday).toBeDefined();
      expect(context.historicalContext.lastWeek).toBeDefined();
    });
    
    it('should calculate momentum and volatility', () => {
      const frame = parseQuestion('test');
      const context = buildContext(frame, mockIndicators);
      
      expect(context.trend.momentum).toBeDefined();
      expect(typeof context.trend.momentum).toBe('number');
      expect(context.trend.volatility).toBeDefined();
      expect(typeof context.trend.volatility).toBe('number');
    });
    
  });
  
  describe('Integration', () => {
    
    it('should process a complete question through all layers', () => {
      const question = 'هل انخفاض أسعار الفضة فرصة للشراء أم خطر؟';
      
      // Layer 1: Intent Classification
      const { intent, confidence } = classifyIntent(question);
      expect(intent).toBe('decision_support');
      expect(confidence).toBeGreaterThan(50);
      
      // Layer 2: Semantic Parsing
      const frame = parseQuestion(question);
      expect(frame.intent).toBe('decision_support');
      expect(frame.entity).toBe('silver');
      expect(frame.userNeed).toContain('قرار');
      
      // Layer 3: Context Building
      const context = buildContext(frame, {
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'fear',
        confidence: 80
      });
      
      expect(context.reasoningRules.length).toBeGreaterThan(0);
      expect(context.preliminaryRecommendation).toBeDefined();
    });
    
    it('should handle Arabic and English questions equally', () => {
      const arabicFrame = parseQuestion('هل الذهب فرصة جيدة؟');
      const englishFrame = parseQuestion('Is gold a good opportunity?');
      
      expect(arabicFrame.intent).toBe(englishFrame.intent);
      expect(arabicFrame.entity).toBe(englishFrame.entity);
    });
    
  });
  
});
