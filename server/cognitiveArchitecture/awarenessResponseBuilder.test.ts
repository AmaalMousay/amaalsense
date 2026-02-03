/**
 * Tests for Awareness Response Builder
 * 
 * يختبر فلسفة What → Why → So what
 */

import { describe, it, expect } from 'vitest';
import { 
  buildAwarenessResponse, 
  formatAwarenessResponse,
  TOPIC_CAUSES_DATABASE
} from './awarenessResponseBuilder';

describe('AwarenessResponseBuilder', () => {
  
  describe('Topic Domain Detection', () => {
    it('should detect gold topic correctly', () => {
      const response = buildAwarenessResponse(
        'لماذا انخفض سعر الذهب؟',
        'انخفاض سعر الذهب',
        { fear: 65, hope: 45, mood: -10 },
        'understand_cause'
      );
      
      // Should have gold-specific causes
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/فائدة|دولار|فيدرالي|معادن/);
    });
    
    it('should detect education topic correctly', () => {
      const response = buildAwarenessResponse(
        'ما هو شعور الناس تجاه التعليم؟',
        'التعليم',
        { fear: 55, hope: 50, mood: 5 },
        'general'
      );
      
      // Should have education-specific causes
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/تعليم|مناهج|مدارس|جامع|طلاب/);
    });
    
    it('should detect Libya topic correctly', () => {
      const response = buildAwarenessResponse(
        'كيف يشعر الليبيون؟',
        'ليبيا',
        { fear: 60, hope: 55, mood: 0 },
        'general'
      );
      
      // Should have Libya-specific causes
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/ليبيا|انقسام|مصالحة|نفط|سيولة/);
    });
    
    it('should detect media topic correctly', () => {
      const response = buildAwarenessResponse(
        'هل الإعلام يضخم المشاعر؟',
        'الإعلام',
        { fear: 50, hope: 50, mood: 0 },
        'general'
      );
      
      // Should have media-specific causes
      const causesText = response.why.causes.join(' ');
      expect(causesText).toMatch(/إعلام|أخبار|مصادر|تغطية/);
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
      expect(response.soWhat.meaning).toMatch(/خوف|قلق/);
    });
    
    it('should detect high hope state', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 35, hope: 75, mood: 20 },
        'general'
      );
      
      expect(response.what.summary).toMatch(/تفاؤل|أمل/);
      expect(response.soWhat.meaning).toMatch(/تفاؤل|أمل/);
    });
    
    it('should detect mixed state', () => {
      const response = buildAwarenessResponse(
        'ما الوضع الحالي؟',
        'الاقتصاد',
        { fear: 55, hope: 55, mood: 0 },
        'general'
      );
      
      expect(response.what.summary).toMatch(/متذبذب|ترقب/);
    });
  });
  
  describe('Response Structure', () => {
    it('should have all three parts: What, Why, So What', () => {
      const response = buildAwarenessResponse(
        'لماذا انخفض الذهب؟',
        'انخفاض الذهب',
        { fear: 60, hope: 45, mood: -5 },
        'understand_cause'
      );
      
      // What
      expect(response.what).toBeDefined();
      expect(response.what.summary).toBeTruthy();
      expect(response.what.indicators).toBeDefined();
      
      // Why
      expect(response.why).toBeDefined();
      expect(response.why.causes.length).toBeGreaterThan(0);
      expect(response.why.context).toBeTruthy();
      
      // So What
      expect(response.soWhat).toBeDefined();
      expect(response.soWhat.meaning).toBeTruthy();
      expect(response.soWhat.implications.length).toBeGreaterThan(0);
      expect(response.soWhat.recommendation).toBeTruthy();
      
      // Closing Question
      expect(response.closingQuestion).toBeTruthy();
    });
    
    it('should format response correctly', () => {
      const response = buildAwarenessResponse(
        'لماذا انخفض الذهب؟',
        'انخفاض الذهب',
        { fear: 60, hope: 45, mood: -5 },
        'understand_cause'
      );
      
      const formatted = formatAwarenessResponse(response);
      
      // Check structure
      expect(formatted).toContain('**الخلاصة:**');
      expect(formatted).toContain('**لماذا هذا المزاج؟**');
      expect(formatted).toContain('**الأسباب الرئيسية:**');
      expect(formatted).toContain('**ماذا يعني هذا للمجتمع؟**');
      expect(formatted).toContain('**التداعيات المحتملة:**');
      expect(formatted).toContain('**التوصية:**');
    });
  });
  
  describe('Topic-Specific Causes', () => {
    it('should NOT give generic causes for gold questions', () => {
      const response = buildAwarenessResponse(
        'لماذا انخفض سعر الذهب والفضة؟',
        'انخفاض الذهب والفضة',
        { fear: 65, hope: 40, mood: -15 },
        'understand_cause'
      );
      
      const causesText = response.why.causes.join(' ');
      
      // Should NOT have generic "market confusion" causes
      expect(causesText).not.toMatch(/السوق في حالة حيرة/);
      
      // Should have specific gold/silver causes
      expect(causesText).toMatch(/فائدة|دولار|فيدرالي|صناعي/);
    });
    
    it('should NOT give economic causes for education questions', () => {
      const response = buildAwarenessResponse(
        'ما شعور الناس تجاه جودة التعليم؟',
        'جودة التعليم',
        { fear: 55, hope: 50, mood: 0 },
        'general'
      );
      
      const causesText = response.why.causes.join(' ');
      
      // Should NOT have economic causes
      expect(causesText).not.toMatch(/سعر الصرف|تذبذب|دولار/);
      
      // Should have education causes
      expect(causesText).toMatch(/تعليم|مناهج|مدارس|جامع|طلاب|تدريس/);
    });
  });
  
  describe('Social Meaning', () => {
    it('should explain what high fear means for society', () => {
      const response = buildAwarenessResponse(
        'ما الوضع؟',
        'الاقتصاد',
        { fear: 75, hope: 30, mood: -25 },
        'general'
      );
      
      // Should explain social implications
      expect(response.soWhat.meaning).toBeTruthy();
      expect(response.soWhat.meaning.length).toBeGreaterThan(20);
      
      // Should have implications
      expect(response.soWhat.implications.length).toBeGreaterThan(0);
    });
    
    it('should provide actionable recommendation', () => {
      const response = buildAwarenessResponse(
        'هل أشتري الذهب الآن؟',
        'شراء الذهب',
        { fear: 65, hope: 45, mood: -10 },
        'make_decision'
      );
      
      // Should have recommendation
      expect(response.soWhat.recommendation).toBeTruthy();
      expect(response.soWhat.recommendation.length).toBeGreaterThan(20);
    });
  });
  
  describe('Closing Questions', () => {
    it('should generate topic-relevant closing question', () => {
      const goldResponse = buildAwarenessResponse(
        'لماذا انخفض الذهب؟',
        'انخفاض الذهب',
        { fear: 60, hope: 45, mood: -5 },
        'understand_cause'
      );
      
      expect(goldResponse.closingQuestion).toMatch(/ذهب|فضة|فائدة|فيدرالي|تحليل/);
      
      const educationResponse = buildAwarenessResponse(
        'ما شعور الناس تجاه التعليم؟',
        'التعليم',
        { fear: 50, hope: 55, mood: 5 },
        'general'
      );
      
      expect(educationResponse.closingQuestion).toMatch(/تعليم|منطقة|سوق العمل|مقارنة|توقعات|تحليل/);
    });
  });
  
  describe('Topic Causes Database', () => {
    it('should have all required domains', () => {
      const domains = TOPIC_CAUSES_DATABASE.map(d => d.domain);
      
      expect(domains).toContain('gold_metals');
      expect(domains).toContain('currency');
      expect(domains).toContain('education');
      expect(domains).toContain('media');
      expect(domains).toContain('politics');
      expect(domains).toContain('economy');
      expect(domains).toContain('libya');
    });
    
    it('should have causes for all emotional states', () => {
      for (const domain of TOPIC_CAUSES_DATABASE) {
        expect(domain.causes.fear.length).toBeGreaterThan(0);
        expect(domain.causes.hope.length).toBeGreaterThan(0);
        expect(domain.socialMeaning.highFear).toBeTruthy();
        expect(domain.socialMeaning.highHope).toBeTruthy();
        expect(domain.socialMeaning.mixed).toBeTruthy();
        expect(domain.socialMeaning.tense).toBeTruthy();
      }
    });
  });
});
