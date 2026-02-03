/**
 * Tests for Awareness Response Builder
 * 
 * يختبر فلسفة What → Why → So what
 * 
 * المجالات الأساسية (9 مجالات):
 * 1. politics - السياسة
 * 2. economy - الاقتصاد
 * 3. health - الصحة
 * 4. education - التعليم
 * 5. technology - التكنولوجيا
 * 6. society - المجتمع
 * 7. security - الأمن والصراعات
 * 8. environment - البيئة والمناخ
 * 9. law - القانون والعدالة
 */

import { describe, it, expect } from 'vitest';
import { 
  buildAwarenessResponse, 
  formatAwarenessResponse,
  TOPIC_CAUSES_DATABASE
} from './awarenessResponseBuilder';

describe('AwarenessResponseBuilder', () => {
  
  describe('Topic Domain Detection - 9 Core Domains', () => {
    it('should detect politics topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه الحكومة؟',
        'السياسة',
        { fear: 65, hope: 45, mood: -10 },
        'understand_cause'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/سياس|حكوم|انتخاب|استقرار/);
    });
    
    it('should detect economy topic correctly', () => {
      const response = buildAwarenessResponse(
        'كيف يشعر الناس تجاه الأسعار؟',
        'الاقتصاد',
        { fear: 70, hope: 40, mood: -15 },
        'understand_cause'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/أسعار|اقتصاد|بطالة|معيشة|دخل/);
    });
    
    it('should detect health topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه الصحة؟',
        'الصحة',
        { fear: 60, hope: 50, mood: 0 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/صح|مستشف|علاج|طب|دواء/);
    });
    
    it('should detect education topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما هو شعور الناس تجاه التعليم؟',
        'التعليم',
        { fear: 55, hope: 50, mood: 5 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/تعليم|مناهج|مدرس|جامع|طلاب/);
    });
    
    it('should detect technology topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه الذكاء الاصطناعي؟',
        'التكنولوجيا',
        { fear: 50, hope: 60, mood: 5 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/تكنولوج|ذكاء|رقم|إنترنت/);
    });
    
    it('should detect society topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه الزواج؟',
        'المجتمع',
        { fear: 55, hope: 55, mood: 0 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/مجتمع|زواج|طلاق|عائل|شباب/);
    });
    
    it('should detect security topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه الأمن؟',
        'الأمن',
        { fear: 70, hope: 40, mood: -10 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/أمن|صراع|حرب|سلام|استقرار/);
    });
    
    it('should detect environment topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه التلوث؟',
        'البيئة',
        { fear: 60, hope: 50, mood: 0 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/بيئ|مناخ|تلوث|طاقة|مياه/);
    });
    
    it('should detect law topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه العدالة؟',
        'القانون',
        { fear: 55, hope: 50, mood: 0 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/قانون|عدالة|محكم|حقوق|قضا/);
    });
  });
  
  describe('Emotional State Detection', () => {
    it('should detect high fear state', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 75, hope: 35, mood: -20 },
        'general'
      );
      
      expect(response.what.summary).toMatch(/قلق|حذر/);
      expect(response.soWhat.meaning).toMatch(/خوف|قلق|ضغط/);
    });
    
    it('should detect high hope state', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 35, hope: 75, mood: 20 },
        'general'
      );
      
      expect(response.what.summary).toMatch(/تفاؤل|أمل/);
      expect(response.soWhat.meaning).toMatch(/تفاؤل|أمل|إيجاب/);
    });
    
    it('should detect mixed state', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 55, hope: 55, mood: 0 },
        'general'
      );
      
      expect(response.what.summary).toMatch(/متذبذب|خوف|أمل/);
    });
  });
  
  describe('Response Structure', () => {
    it('should have all three parts: What, Why, So What', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 60, hope: 50, mood: -5 },
        'general'
      );
      
      // What
      expect(response.what).toBeDefined();
      expect(response.what.summary).toBeDefined();
      expect(response.what.indicators).toBeDefined();
      
      // Why
      expect(response.why).toBeDefined();
      expect(response.why.causes).toBeDefined();
      expect(response.why.causes.length).toBeGreaterThan(0);
      expect(response.why.context).toBeDefined();
      
      // So What
      expect(response.soWhat).toBeDefined();
      expect(response.soWhat.meaning).toBeDefined();
      expect(response.soWhat.implications).toBeDefined();
      expect(response.soWhat.recommendation).toBeDefined();
      
      // Closing question
      expect(response.closingQuestion).toBeDefined();
    });
    
    it('should format response correctly', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 60, hope: 50, mood: -5 },
        'general'
      );
      
      const formatted = formatAwarenessResponse(response);
      
      expect(formatted).toContain('**الخلاصة:**');
      expect(formatted).toContain('**لماذا هذا المزاج؟**');
      expect(formatted).toContain('**الأسباب الرئيسية:**');
      expect(formatted).toContain('**ماذا يعني هذا للمجتمع؟**');
      expect(formatted).toContain('**التوصية:**');
    });
  });
  
  describe('Topic-Specific Causes', () => {
    it('should NOT give generic causes for economy questions', () => {
      const response = buildAwarenessResponse(
        'لماذا ارتفعت الأسعار؟',
        'ارتفاع الأسعار',
        { fear: 65, hope: 45, mood: -10 },
        'understand_cause'
      );
      
      const causesText = response.why.causes.join(' ');
      
      // Should have specific economy causes
      expect(causesText).toMatch(/أسعار|دخل|بطالة|اقتصاد|تضخم|معيشة/);
    });
    
    it('should NOT give economic causes for education questions', () => {
      const response = buildAwarenessResponse(
        'ما مشاكل التعليم؟',
        'التعليم',
        { fear: 55, hope: 50, mood: 5 },
        'understand_cause'
      );
      
      const causesText = response.why.causes.join(' ');
      
      // Should have education-specific causes
      expect(causesText).toMatch(/تعليم|مناهج|مدرس|جامع|طلاب|تدريس/);
    });
  });
  
  describe('Social Meaning', () => {
    it('should explain what high fear means for society', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 75, hope: 35, mood: -20 },
        'general'
      );
      
      expect(response.soWhat.meaning).toBeDefined();
      expect(response.soWhat.meaning.length).toBeGreaterThan(20);
    });
    
    it('should provide actionable recommendation', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 60, hope: 50, mood: -5 },
        'make_decision'
      );
      
      expect(response.soWhat.recommendation).toBeDefined();
      expect(response.soWhat.recommendation.length).toBeGreaterThan(10);
    });
  });
  
  describe('Closing Questions', () => {
    it('should generate topic-relevant closing question', () => {
      const economyResponse = buildAwarenessResponse(
        'ما الوضع الاقتصادي؟',
        'الاقتصاد',
        { fear: 60, hope: 45, mood: -5 },
        'understand_cause'
      );
      
      expect(economyResponse.closingQuestion).toMatch(/تحليل|توقعات|قطاع|فئة|تأثير/);
      
      const educationResponse = buildAwarenessResponse(
        'ما شعور الناس تجاه التعليم؟',
        'التعليم',
        { fear: 50, hope: 55, mood: 5 },
        'general'
      );
      
      expect(educationResponse.closingQuestion).toMatch(/تعليم|منطقة|سوق العمل|مقارنة|تحليل|فئة|قطاع/);
    });
  });
  
  describe('Topic Causes Database', () => {
    it('should have all 9 required domains', () => {
      const domains = TOPIC_CAUSES_DATABASE.map(d => d.domain);
      
      expect(domains).toContain('politics');
      expect(domains).toContain('economy');
      expect(domains).toContain('health');
      expect(domains).toContain('education');
      expect(domains).toContain('technology');
      expect(domains).toContain('society');
      expect(domains).toContain('security');
      expect(domains).toContain('environment');
      expect(domains).toContain('law');
      
      expect(domains.length).toBe(9);
    });
    
    it('should have causes for all emotional states', () => {
      for (const domain of TOPIC_CAUSES_DATABASE) {
        expect(domain.causes.fear.length).toBeGreaterThan(0);
        expect(domain.causes.hope.length).toBeGreaterThan(0);
        expect(domain.socialMeaning.highFear).toBeDefined();
        expect(domain.socialMeaning.highHope).toBeDefined();
        expect(domain.socialMeaning.mixed).toBeDefined();
        expect(domain.socialMeaning.tense).toBeDefined();
      }
    });
  });
});
