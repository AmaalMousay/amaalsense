/**
 * Decision Compressor Tests
 * اختبارات طبقة ضغط القرارات
 */

import { describe, it, expect } from 'vitest';
import { 
  extractJudgment, 
  extractDecisionSignal, 
  generateReasoning,
  generateTimeframe,
  generateClosingQuestion,
  compressResponse,
  restructureAIResponse
} from './decisionCompressor';

describe('Decision Compressor', () => {
  describe('extractJudgment', () => {
    it('should extract crisis judgment for high fear low hope', () => {
      const judgment = extractJudgment({
        topic: 'الاقتصاد الليبي',
        gmi: -30,
        cfi: 75,
        hri: 25,
        dominantEmotion: 'fear',
        confidence: 70
      });
      
      expect(judgment).toContain('أزمة نفسية جماعية');
      expect(judgment).toContain('خوف مرتفع');
    });

    it('should extract tension with anticipation for high fear high hope', () => {
      const judgment = extractJudgment({
        topic: 'الوضع الاقتصادي',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(judgment).toContain('توتر مرتفع');
      expect(judgment).toContain('ترقب');
    });

    it('should extract positive judgment for good mood low fear', () => {
      const judgment = extractJudgment({
        topic: 'السوق',
        gmi: 50,
        cfi: 25,
        hri: 70,
        dominantEmotion: 'hope',
        confidence: 80
      });
      
      expect(judgment).toContain('إيجابي');
    });
  });

  describe('extractDecisionSignal', () => {
    it('should return warning signal for very high fear', () => {
      const signal = extractDecisionSignal({
        topic: 'test',
        gmi: 0,
        cfi: 75,
        hri: 50,
        dominantEmotion: 'fear',
        confidence: 70
      });
      
      expect(signal).toContain('⚠️');
      expect(signal).toContain('تحذير');
    });

    it('should return wait signal for high fear high hope', () => {
      const signal = extractDecisionSignal({
        topic: 'test',
        gmi: 0,
        cfi: 65,
        hri: 65,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(signal).toContain('⏳');
      expect(signal).toContain('انتظار');
    });

    it('should return positive signal for good conditions', () => {
      const signal = extractDecisionSignal({
        topic: 'test',
        gmi: 40,
        cfi: 30,
        hri: 60,
        dominantEmotion: 'hope',
        confidence: 80
      });
      
      expect(signal).toContain('✅');
      expect(signal).toContain('إيجابية');
    });
  });

  describe('generateReasoning', () => {
    it('should include all three indicators', () => {
      const reasoning = generateReasoning({
        topic: 'test',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(reasoning).toContain('GMI');
      expect(reasoning).toContain('CFI');
      expect(reasoning).toContain('HRI');
    });

    it('should describe high fear correctly', () => {
      const reasoning = generateReasoning({
        topic: 'test',
        gmi: 0,
        cfi: 70,
        hri: 50,
        dominantEmotion: 'fear',
        confidence: 70
      });
      
      expect(reasoning).toContain('مرتفع');
      expect(reasoning).toContain('قلق');
    });

    it('should describe high hope correctly', () => {
      const reasoning = generateReasoning({
        topic: 'test',
        gmi: 0,
        cfi: 50,
        hri: 70,
        dominantEmotion: 'hope',
        confidence: 70
      });
      
      expect(reasoning).toContain('قوي');
      expect(reasoning).toContain('تكيف');
    });
  });

  describe('generateTimeframe', () => {
    it('should predict rapid change for extreme conditions', () => {
      const timeframe = generateTimeframe({
        topic: 'test',
        gmi: -60,
        cfi: 80,
        hri: 30,
        dominantEmotion: 'fear',
        confidence: 70
      });
      
      expect(timeframe).toContain('24-48 ساعة');
    });

    it('should predict continued anticipation for balanced tension', () => {
      const timeframe = generateTimeframe({
        topic: 'test',
        gmi: 0,
        cfi: 60,
        hri: 60,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(timeframe).toContain('الأسبوع');
    });
  });

  describe('generateClosingQuestion', () => {
    it('should generate relevant question for high fear', () => {
      const question = generateClosingQuestion({
        topic: 'الاقتصاد',
        gmi: 0,
        cfi: 70,
        hri: 50,
        dominantEmotion: 'fear',
        confidence: 70
      });
      
      expect(question).toContain('هل');
      expect(question).toContain('الخوف');
    });

    it('should generate relevant question for high hope', () => {
      const question = generateClosingQuestion({
        topic: 'السوق',
        gmi: 20,
        cfi: 40,
        hri: 75,
        dominantEmotion: 'hope',
        confidence: 70
      });
      
      expect(question).toContain('هل');
      expect(question).toContain('الأمل');
    });
  });

  describe('compressResponse', () => {
    it('should return all required fields', () => {
      const compressed = compressResponse('raw response text', {
        topic: 'الاقتصاد الليبي',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(compressed.judgment).toBeTruthy();
      expect(compressed.decisionSignal).toBeTruthy();
      expect(compressed.reasoning).toBeTruthy();
      expect(compressed.timeframe).toBeTruthy();
      expect(compressed.closingQuestion).toBeTruthy();
      expect(compressed.fullResponse).toBeTruthy();
    });

    it('should structure fullResponse correctly', () => {
      const compressed = compressResponse('raw response', {
        topic: 'test',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      // Should start with judgment (bold)
      expect(compressed.fullResponse.startsWith('**')).toBe(true);
      // Should contain decision signal
      expect(compressed.fullResponse).toContain('إشارة القرار');
      // Should contain reasoning
      expect(compressed.fullResponse).toContain('لماذا');
      // Should end with question
      expect(compressed.fullResponse).toContain('هل');
    });
  });

  describe('restructureAIResponse', () => {
    it('should remove robotic introductions', () => {
      const rawResponse = 'بناءً على تحليلات محركات AmalSense، الوضع يميل للتوتر...';
      const restructured = restructureAIResponse(rawResponse, {
        topic: 'test',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(restructured).not.toContain('بناءً على تحليلات محركات');
    });

    it('should add judgment at the beginning', () => {
      const rawResponse = 'الوضع يميل للتوتر مع وجود أمل...';
      const restructured = restructureAIResponse(rawResponse, {
        topic: 'الاقتصاد',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      // Should start with bold judgment
      expect(restructured.startsWith('**')).toBe(true);
    });

    it('should add closing question if missing', () => {
      const rawResponse = 'تحليل بسيط بدون سؤال ختامي.';
      const restructured = restructureAIResponse(rawResponse, {
        topic: 'test',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(restructured).toContain('هل');
    });

    it('should add decision signal', () => {
      const rawResponse = 'تحليل بدون إشارة قرار.';
      const restructured = restructureAIResponse(rawResponse, {
        topic: 'test',
        gmi: 0,
        cfi: 67,
        hri: 67,
        dominantEmotion: 'curiosity',
        confidence: 70
      });
      
      expect(restructured).toContain('إشارة القرار');
    });
  });
});
