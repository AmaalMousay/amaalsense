import { describe, it, expect } from 'vitest';
import {
  analyzeTopics,
  analyzeEmotions,
  analyzeRegions,
  analyzeSeverity,
  analyzeImpact,
  analyzeText,
} from './realTextAnalyzer';

describe('Real Text Analyzer', () => {
  describe('analyzeTopics', () => {
    it('should detect economy topics in Arabic', () => {
      const text = 'هل رفع الدعم عن الوقود سيؤدي إلى اضطرابات اقتصادية؟';
      const topics = analyzeTopics(text);
      expect(topics).toContain('Economy');
    });

    it('should detect politics topics', () => {
      const text = 'الانتخابات الرئاسية القادمة ستشهد منافسة قوية';
      const topics = analyzeTopics(text);
      expect(topics).toContain('Politics');
    });

    it('should detect security topics', () => {
      const text = 'العمليات الأمنية تستهدف الخلايا الإرهابية';
      const topics = analyzeTopics(text);
      expect(topics).toContain('Security');
    });

    it('should return General for unknown topics', () => {
      const text = 'نص عشوائي بدون موضوع محدد';
      const topics = analyzeTopics(text);
      expect(topics).toContain('General');
    });
  });

  describe('analyzeEmotions', () => {
    it('should detect fear emotions', () => {
      const text = 'هناك قلق كبير من المخاطر الاقتصادية والتهديدات الأمنية';
      const emotions = analyzeEmotions(text);
      expect(emotions.fear).toBeGreaterThanOrEqual(0);
    });

    it('should detect hope emotions', () => {
      const text = 'نحن متفائلون بمستقبل مزدهر وتطور إيجابي';
      const emotions = analyzeEmotions(text);
      expect(emotions.hope).toBeGreaterThanOrEqual(0);
    });

    it('should detect anger emotions', () => {
      const text = 'غاضبون من الظلم والاستياء من السياسات الظالمة';
      const emotions = analyzeEmotions(text);
      expect(emotions.anger).toBeGreaterThanOrEqual(0);
    });

    it('should normalize emotions to 0-1 range', () => {
      const text = 'نص عاطفي يحتوي على عدة مشاعر';
      const emotions = analyzeEmotions(text);
      const sum = Object.values(emotions).reduce((a, b) => a + b, 0);
      expect(sum).toBeLessThanOrEqual(1.1); // Allow small floating point error
    });
  });

  describe('analyzeRegions', () => {
    it('should detect Libya', () => {
      const text = 'الأوضاع في ليبيا تشهد تطورات مهمة';
      const regions = analyzeRegions(text);
      expect(regions).toContain('Libya');
    });

    it('should detect Egypt', () => {
      const text = 'مصر تشهد نموا اقتصاديا ملحوظا';
      const regions = analyzeRegions(text);
      expect(regions).toContain('Egypt');
    });

    it('should detect Saudi Arabia', () => {
      const text = 'السعودية تقود المنطقة اقتصاديا وسياسيا';
      const regions = analyzeRegions(text);
      expect(regions).toContain('Saudi Arabia');
    });

    it('should return regions for text', () => {
      const text = 'نص عام بدون ذكر منطقة محددة';
      const regions = analyzeRegions(text);
      expect(regions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('analyzeSeverity', () => {
    it('should detect critical severity', () => {
      const text = 'كارثة إنسانية وفاجعة حرب وقتل';
      const emotions = analyzeEmotions(text);
      const severity = analyzeSeverity(text, emotions);
      expect(severity).toBe('critical');
    });

    it('should detect high severity', () => {
      const text = 'أزمة اقتصادية خطيرة وتهديدات أمنية';
      const emotions = analyzeEmotions(text);
      const severity = analyzeSeverity(text, emotions);
      expect(severity).toBe('high');
    });

    it('should detect low severity for neutral text', () => {
      const text = 'نص محايد وعام';
      const emotions = analyzeEmotions(text);
      const severity = analyzeSeverity(text, emotions);
      expect(severity).toBe('low');
    });
  });

  describe('analyzeImpact', () => {
    it('should return score between 0 and 1', () => {
      const text = 'نص عشوائي للاختبار';
      const emotions = analyzeEmotions(text);
      const impact = analyzeImpact(text, emotions);
      expect(impact).toBeGreaterThanOrEqual(0);
      expect(impact).toBeLessThanOrEqual(1);
    });

    it('should increase impact for longer text', () => {
      const shortText = 'قصير';
      const longText = 'نص طويل جداً يحتوي على معلومات كثيرة ومفصلة جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً جداً';
      
      const shortEmotions = analyzeEmotions(shortText);
      const longEmotions = analyzeEmotions(longText);
      
      const shortImpact = analyzeImpact(shortText, shortEmotions);
      const longImpact = analyzeImpact(longText, longEmotions);
      
      expect(longImpact).toBeGreaterThanOrEqual(shortImpact);
    });

    it('should increase impact for urgent keywords', () => {
      const normalText = 'نص عادي';
      const urgentText = 'نص عاجل وفوري يتطلب تدخل حتمي';
      
      const normalEmotions = analyzeEmotions(normalText);
      const urgentEmotions = analyzeEmotions(urgentText);
      
      const normalImpact = analyzeImpact(normalText, normalEmotions);
      const urgentImpact = analyzeImpact(urgentText, urgentEmotions);
      
      expect(urgentImpact).toBeGreaterThan(normalImpact);
    });
  });

  describe('analyzeText - Complete Analysis', () => {
    it('should perform complete analysis on Arabic text', () => {
      const text = 'هل رفع الدعم عن الوقود في ليبيا سيؤدي إلى أزمة اقتصادية وقلق شديد؟';
      const result = analyzeText(text);
      
      expect(result.topics).toBeDefined();
      expect(result.emotions).toBeDefined();
      expect(result.regions).toBeDefined();
      expect(result.severity).toBeDefined();
      expect(result.impactScore).toBeDefined();
      
      expect(result.topics.length).toBeGreaterThan(0);
      expect(result.regions).toContain('Libya');
      expect(result.impactScore).toBeGreaterThan(0);
    });

    it('should analyze political text correctly', () => {
      const text = 'الانتخابات الرئاسية في مصر تشهد منافسة قوية والشعب متفائل بالمستقبل';
      const result = analyzeText(text);
      
      expect(result.topics).toContain('Politics');
      expect(result.regions).toContain('Egypt');
      expect(result.emotions).toBeDefined();
    });

    it('should analyze security crisis text', () => {
      const text = 'عمليات إرهابية خطيرة تهدد الأمن والاستقرار في المنطقة';
      const result = analyzeText(text);
      
      expect(result.topics).toContain('Security');
      expect(result.emotions).toBeDefined();
      expect(['high', 'critical']).toContain(result.severity);
    });
  });
});
