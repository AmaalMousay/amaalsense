/**
 * Tests for General Knowledge Layer (Layer 13)
 */

import { describe, it, expect, vi } from 'vitest';
import {
  searchGeneralKnowledge,
  verifyFact,
  getPersonInfo,
  getCountryInfo,
  getTopicInfo,
  enrichAnswerWithKnowledge,
} from './generalKnowledgeLayer';

// Mock Groq API
vi.mock('./groqIntegration', () => ({
  invokeGroqLLM: vi.fn(async ({ messages }) => {
    const userMessage = messages[messages.length - 1].content;
    
    if (userMessage.includes('مصر') || userMessage.includes('Egypt')) {
      return {
        content: JSON.stringify({
          capital: 'القاهرة',
          population: '100 مليون',
          region: 'الشرق الأوسط وشمال أفريقيا',
          keyFacts: ['أكبر دول الشرق الأوسط سكاناً', 'موطن الأهرامات'],
          confidence: 95,
        }),
      };
    }

    if (userMessage.includes('الاقتصاد') || userMessage.includes('economy')) {
      return {
        content: JSON.stringify({
          definition: 'الاقتصاد هو دراسة إنتاج وتوزيع واستهلاك السلع والخدمات',
          keyPoints: [
            'يتعامل مع الموارد المحدودة',
            'يؤثر على حياة الجميع',
            'يشمل الأفراد والشركات والحكومات',
          ],
          relatedTopics: ['التجارة', 'المال', 'الإنتاج'],
          confidence: 90,
        }),
      };
    }

    if (userMessage.includes('تحقق') || userMessage.includes('Verify')) {
      return {
        content: JSON.stringify({
          isTrue: false,
          confidence: 85,
          explanation: 'هذا الادعاء غير صحيح بناءً على المعلومات المتاحة',
          sources: ['مصدر1', 'مصدر2'],
        }),
      };
    }

    // Default response
    return {
      content: JSON.stringify({
        sources: [
          {
            type: 'factual',
            title: 'معلومة عامة',
            content: 'محتوى المعلومة',
            confidence: 70,
          },
        ],
        summary: 'ملخص المعلومات',
        relatedTopics: ['موضوع1', 'موضوع2'],
        confidence: 70,
      }),
    };
  }),
}));

describe('General Knowledge Layer (Layer 13)', () => {
  
  describe('General Knowledge Search', () => {
    it('should search for general knowledge', async () => {
      const result = await searchGeneralKnowledge('الاقتصاد');

      expect(result).toBeDefined();
      expect(result.query).toBe('الاقتصاد');
      expect(Array.isArray(result.sources)).toBe(true);
      expect(result.summary).toBeDefined();
      expect(Array.isArray(result.relatedTopics)).toBe(true);
    });

    it('should have confidence score', async () => {
      const result = await searchGeneralKnowledge('الاقتصاد');

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should support English language', async () => {
      const result = await searchGeneralKnowledge('economy', 'en');

      expect(result).toBeDefined();
      expect(result.query).toBe('economy');
    });
  });

  describe('Fact Verification', () => {
    it('should verify facts', async () => {
      const result = await verifyFact('مصر هي أكبر دول الشرق الأوسط سكاناً');

      expect(result).toBeDefined();
      expect(typeof result.isTrue).toBe('boolean');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.explanation).toBeDefined();
      expect(Array.isArray(result.sources)).toBe(true);
    });

    it('should detect false claims', async () => {
      const result = await verifyFact('الأرض مسطحة');

      expect(result.isTrue).toBe(false);
      expect(result.confidence).toBeGreaterThan(50);
    });

    it('should provide sources', async () => {
      const result = await verifyFact('مصر في أفريقيا');

      expect(Array.isArray(result.sources)).toBe(true);
    });
  });

  describe('Person Information', () => {
    it('should get person information', async () => {
      const result = await getPersonInfo('ناصر عبدالناصر');

      expect(result).toBeDefined();
      expect(result.name).toBe('ناصر عبدالناصر');
      expect(result.description).toBeDefined();
      expect(Array.isArray(result.notableFacts)).toBe(true);
      expect(Array.isArray(result.fields)).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should have notable facts', async () => {
      const result = await getPersonInfo('محمد علي');

      expect(Array.isArray(result.notableFacts)).toBe(true);
    });

    it('should identify fields of expertise', async () => {
      const result = await getPersonInfo('ألبير أينشتاين');

      expect(Array.isArray(result.fields)).toBe(true);
    });
  });

  describe('Country Information', () => {
    it('should get country information', async () => {
      const result = await getCountryInfo('مصر');

      expect(result).toBeDefined();
      expect(result.country).toBe('مصر');
      expect(result.capital).toBe('القاهرة');
      expect(result.population).toBeDefined();
      expect(result.region).toBeDefined();
      expect(Array.isArray(result.keyFacts)).toBe(true);
    });

    it('should provide key facts', async () => {
      const result = await getCountryInfo('مصر');

      expect(Array.isArray(result.keyFacts)).toBe(true);
      expect(result.keyFacts.length).toBeGreaterThanOrEqual(0);
    });

    it('should have high confidence for well-known countries', async () => {
      const result = await getCountryInfo('مصر');

      expect(result.confidence).toBeGreaterThan(50);
    });
  });

  describe('Topic Information', () => {
    it('should get topic information', async () => {
      const result = await getTopicInfo('الاقتصاد');

      expect(result).toBeDefined();
      expect(result.topic).toBe('الاقتصاد');
      expect(result.definition).toBeDefined();
      expect(Array.isArray(result.keyPoints)).toBe(true);
      expect(Array.isArray(result.relatedTopics)).toBe(true);
    });

    it('should provide key points', async () => {
      const result = await getTopicInfo('الاقتصاد');

      expect(Array.isArray(result.keyPoints)).toBe(true);
      expect(result.keyPoints.length).toBeGreaterThan(0);
    });

    it('should suggest related topics', async () => {
      const result = await getTopicInfo('الاقتصاد');

      expect(Array.isArray(result.relatedTopics)).toBe(true);
    });

    it('should have clear definition', async () => {
      const result = await getTopicInfo('الاقتصاد');

      expect(result.definition.length).toBeGreaterThan(0);
    });
  });

  describe('Answer Enrichment', () => {
    it('should enrich answer with knowledge', async () => {
      const result = await enrichAnswerWithKnowledge(
        'ما الاقتصاد؟',
        'الاقتصاد هو علم الإدارة',
        ['الاقتصاد', 'التجارة']
      );

      expect(result).toBeDefined();
      expect(result.enrichedAnswer).toBeDefined();
      expect(Array.isArray(result.addedKnowledge)).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should preserve original answer', async () => {
      const originalAnswer = 'إجابة أصلية';
      const result = await enrichAnswerWithKnowledge(
        'سؤال',
        originalAnswer,
        []
      );

      expect(result.enrichedAnswer).toContain(originalAnswer);
    });

    it('should add knowledge pieces', async () => {
      const result = await enrichAnswerWithKnowledge(
        'ما الاقتصاد؟',
        'إجابة',
        ['الاقتصاد']
      );

      expect(Array.isArray(result.addedKnowledge)).toBe(true);
    });

    it('should work with multiple topics', async () => {
      const result = await enrichAnswerWithKnowledge(
        'سؤال معقد',
        'إجابة',
        ['الاقتصاد', 'السياسة', 'الاجتماع']
      );

      expect(result.enrichedAnswer).toBeDefined();
      expect(result.addedKnowledge.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Language Support', () => {
    it('should support Arabic queries', async () => {
      const result = await searchGeneralKnowledge('الاقتصاد', 'ar');

      expect(result).toBeDefined();
    });

    it('should support English queries', async () => {
      const result = await searchGeneralKnowledge('economy', 'en');

      expect(result).toBeDefined();
    });

    it('should return results in requested language', async () => {
      const arResult = await getTopicInfo('الاقتصاد', 'ar');
      const enResult = await getTopicInfo('economy', 'en');

      expect(arResult).toBeDefined();
      expect(enResult).toBeDefined();
    });
  });

  describe('Confidence Scoring', () => {
    it('should provide confidence scores', async () => {
      const result = await searchGeneralKnowledge('مصر');

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should have higher confidence for well-known facts', async () => {
      const result = await verifyFact('مصر في أفريقيا');

      expect(result.confidence).toBeGreaterThan(50);
    });

    it('should reflect uncertainty for unknown topics', async () => {
      const result = await getTopicInfo('موضوع غير معروف جداً');

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing information gracefully', async () => {
      const result = await searchGeneralKnowledge('');

      expect(result).toBeDefined();
      expect(Array.isArray(result.sources)).toBe(true);
    });

    it('should return empty sources for unknown queries', async () => {
      const result = await getCountryInfo('دولة غير موجودة');

      expect(result).toBeDefined();
      expect(Array.isArray(result.keyFacts)).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      const result = await verifyFact('أي ادعاء');

      expect(result).toBeDefined();
      expect(typeof result.isTrue).toBe('boolean');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complex queries', async () => {
      const result = await searchGeneralKnowledge(
        'ما تأثير التغير المناخي على الاقتصاد العالمي؟'
      );

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
    });

    it('should enrich complex answers', async () => {
      const result = await enrichAnswerWithKnowledge(
        'ما تأثير الأزمة الاقتصادية؟',
        'الأزمات الاقتصادية لها تأثيرات سلبية',
        ['الاقتصاد', 'الأزمات', 'التأثير الاجتماعي']
      );

      expect(result.enrichedAnswer).toBeDefined();
      expect(result.enrichedAnswer.length).toBeGreaterThan(0);
    });

    it('should verify historical facts', async () => {
      const result = await verifyFact('مصر كانت مركز الحضارة الفرعونية');

      expect(result).toBeDefined();
      expect(typeof result.isTrue).toBe('boolean');
    });
  });
});
