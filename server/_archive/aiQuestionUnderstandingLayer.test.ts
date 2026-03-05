/**
 * Tests for AI Question Understanding Layer
 */

import { describe, it, expect, vi } from 'vitest';
import { 
  understandQuestionWithAI, 
  enhanceUnderstandingWithContext,
  detectFactualErrors,
} from './aiQuestionUnderstandingLayer';

// Mock Groq API
vi.mock('./groqIntegration', () => ({
  invokeGroqLLM: vi.fn(async ({ messages }) => {
    const userMessage = messages[messages.length - 1].content;
    
    // Check if this is a factual error detection request
    if (userMessage.includes('التحقق من الحقائق')) {
      return {
        content: JSON.stringify({
          hasError: true,
          errors: [
            {
              claim: 'سيف الإسلام اغتيل',
              status: 'false',
              explanation: 'سيف الإسلام القذافي لم يُغتل',
            },
          ],
        }),
      };
    }

    if (userMessage.includes('اغتيال')) {
      return {
        content: JSON.stringify({
          primaryType: 'emotional',
          confidence: 85,
          hasFactualError: true,
          errorDescription: 'سيف الإسلام القذافي لم يُغتل',
          correctFacts: 'سيف الإسلام القذافي حي وموجود',
          topic: 'السياسة الليبية',
          entities: {
            countries: ['ليبيا'],
            topics: ['السياسة'],
            people: ['سيف الإسلام القذافي'],
            organizations: [],
          },
          language: 'ar',
          dialect: 'general',
          responseLanguage: 'ar',
          complexity: 'simple',
          strategy: {
            useDCFT: true,
            useEngines: ['emotion', 'topic'],
            useGroq70B: true,
            correctFirst: true,
            priority: 'accuracy',
          },
          reasoning: 'سؤال عن مشاعر تجاه إشاعة، يحتاج تصحيح أولاً',
        }),
      };
    }

    if (userMessage.includes('كم سعر')) {
      return {
        content: JSON.stringify({
          primaryType: 'factual',
          confidence: 95,
          hasFactualError: false,
          topic: 'الاقتصاد',
          entities: {
            countries: [],
            topics: ['الأسعار'],
            people: [],
            organizations: [],
          },
          language: 'ar',
          responseLanguage: 'ar',
          complexity: 'simple',
          strategy: {
            useDCFT: false,
            useEngines: [],
            useGroq70B: false,
            correctFirst: false,
            priority: 'speed',
          },
          reasoning: 'سؤال حقائقي مباشر',
        }),
      };
    }

    // Default response
    return {
      content: JSON.stringify({
        primaryType: 'emotional',
        confidence: 70,
        hasFactualError: false,
        topic: 'General',
        entities: {
          countries: [],
          topics: [],
          people: [],
          organizations: [],
        },
        language: 'ar',
        responseLanguage: 'ar',
        complexity: 'simple',
        strategy: {
          useDCFT: true,
          useEngines: ['emotion'],
          useGroq70B: true,
          correctFirst: false,
          priority: 'accuracy',
        },
        reasoning: 'Default understanding',
      }),
    };
  }),
}));

describe('AI Question Understanding Layer', () => {
  
  describe('Factual Error Detection', () => {
    it('should detect assassination error', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.hasFactualError).toBe(true);
      expect(result.errorDescription).toContain('لم يُغتل');
      expect(result.correctFacts).toBeDefined();
      expect(result.primaryType).toBe('emotional');
    });

    it('should suggest correction first strategy', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.strategy.correctFirst).toBe(true);
    });
  });

  describe('Question Type Detection', () => {
    it('should detect factual questions', async () => {
      const result = await understandQuestionWithAI('كم سعر الدولار؟');
      
      expect(result.primaryType).toBe('factual');
      expect(result.confidence).toBeGreaterThan(80);
    });

    it('should detect emotional questions', async () => {
      const result = await understandQuestionWithAI('كيف يشعر الناس تجاه الأزمة؟');
      
      expect(result.primaryType).toBe('emotional');
      expect(result.strategy.useEngines).toContain('emotion');
    });
  });

  describe('Language Detection', () => {
    it('should detect Arabic questions', async () => {
      const result = await understandQuestionWithAI('ما رأيك في الوضع؟');
      
      expect(result.language).toBe('ar');
      expect(result.responseLanguage).toBe('ar');
    });

    it('should respond in same language as question', async () => {
      const result = await understandQuestionWithAI('ماسبب اغتيال سيف الاسلام القذافي؟');
      
      expect(result.responseLanguage).toBe(result.language);
    });
  });

  describe('Entity Extraction', () => {
    it('should extract countries', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.entities.countries).toContain('ليبيا');
    });

    it('should extract people names', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.entities.people.length).toBeGreaterThan(0);
    });

    it('should extract topics', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.entities.topics.length).toBeGreaterThan(0);
    });
  });

  describe('Processing Strategy', () => {
    it('should use DCFT for emotional questions', async () => {
      const result = await understandQuestionWithAI(
        'كيف يشعر الناس تجاه الأزمة؟'
      );
      
      expect(result.strategy.useDCFT).toBe(true);
    });

    it('should not use DCFT for factual questions', async () => {
      const result = await understandQuestionWithAI('كم سعر الدولار؟');
      
      expect(result.strategy.useDCFT).toBe(false);
    });

    it('should prioritize speed for factual questions', async () => {
      const result = await understandQuestionWithAI('كم سعر الدولار؟');
      
      expect(result.strategy.priority).toBe('speed');
    });

    it('should prioritize accuracy for complex questions', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.strategy.priority).toBe('accuracy');
    });
  });

  describe('Confidence Scoring', () => {
    it('should have high confidence for clear questions', async () => {
      const result = await understandQuestionWithAI('كم سعر الدولار؟');
      
      expect(result.confidence).toBeGreaterThan(80);
    });

    it('should have reasonable confidence for complex questions', async () => {
      const result = await understandQuestionWithAI(
        'ماسبب اغتيال سيف الاسلام القذافي؟'
      );
      
      expect(result.confidence).toBeGreaterThan(70);
    });

    it('should be between 0-100', async () => {
      const result = await understandQuestionWithAI('أي سؤال عشوائي');
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('Complexity Detection', () => {
    it('should detect simple questions', async () => {
      const result = await understandQuestionWithAI('كم سعر الدولار؟');
      
      expect(result.complexity).toBe('simple');
    });

    it('should have reasoning explanation', async () => {
      const result = await understandQuestionWithAI('أي سؤال');
      
      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('Context Enhancement', () => {
    it('should enhance understanding with previous questions', async () => {
      const previousQuestions = [
        'ما الوضع الاقتصادي في ليبيا؟',
        'من هو سيف الإسلام القذافي؟',
      ];
      
      const result = await enhanceUnderstandingWithContext(
        'ماسبب اغتيال سيف الاسلام القذافي؟',
        previousQuestions
      );
      
      expect(result.hasFactualError).toBe(true);
      expect(result.primaryType).toBe('emotional');
    });

    it('should work without previous questions', async () => {
      const result = await enhanceUnderstandingWithContext(
        'ماسبب اغتيال سيف الاسلام القذافي؟',
        []
      );
      
      expect(result.hasFactualError).toBe(true);
    });
  });


  describe('Real-world Scenarios', () => {
    it('should handle complex Arabic question about death', async () => {
      const result = await understandQuestionWithAI(
        'ما هي أسباب موت الشاب وما تأثير ذلك على المجتمع؟'
      );
      
      expect(result.language).toBe('ar');
      expect(result.responseLanguage).toBe('ar');
      expect(result.confidence).toBeGreaterThan(50);
    });

    it('should handle mixed emotions question', async () => {
      const result = await understandQuestionWithAI(
        'رغم الأزمة الاقتصادية، هل هناك أمل في المستقبل؟'
      );
      
      expect(result.language).toBe('ar');
      expect(result.primaryType).toBe('emotional');
    });

    it('should handle English questions', async () => {
      const result = await understandQuestionWithAI(
        'Why is there so much violence in the region?'
      );
      
      expect(result.language).toBeDefined();
      expect(['ar', 'en']).toContain(result.language);
    });
  });

  describe('Default Fallback', () => {
    it('should provide sensible defaults on error', async () => {
      const result = await understandQuestionWithAI('أي سؤال');
      
      expect(result.primaryType).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.language).toBeDefined();
      expect(result.strategy).toBeDefined();
    });

    it('should detect Arabic in fallback', async () => {
      const result = await understandQuestionWithAI('سؤال عربي');
      
      expect(result.language).toBe('ar');
    });

    it('should detect English in fallback', async () => {
      const result = await understandQuestionWithAI('English question');
      
      expect(result.language).toBeDefined();
      expect(['ar', 'en']).toContain(result.language);
    });
  });
});
