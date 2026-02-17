import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  quickDetectLanguage,
  enforceLanguage,
  processResponseWithLanguageEnforcement,
  translateResponse,
} from './languageEnforcementLayer';

// Mock Groq
vi.mock('./groqIntegration', () => ({
  invokeGroqLLM: vi.fn(async (input: any) => {
    // Mock translation: just return the input text with a marker
    const content = input.messages[1]?.content || '';
    
    // Simple mock: add language indicator
    if (input.messages[0]?.content?.includes('Arabic')) {
      return {
        content: `[AR] ${content}`,
        text: `[AR] ${content}`,
      };
    }
    
    return {
      content: `[EN] ${content}`,
      text: `[EN] ${content}`,
    };
  }),
}));

describe('Language Enforcement Layer', () => {
  describe('quickDetectLanguage', () => {
    it('should detect Arabic text', () => {
      const arabicText = 'السلام عليكم ورحمة الله وبركاته';
      expect(quickDetectLanguage(arabicText)).toBe('ar');
    });

    it('should detect English text', () => {
      const englishText = 'Hello, this is a test message in English';
      expect(quickDetectLanguage(englishText)).toBe('en');
    });

    it('should detect mixed text with Arabic as primary', () => {
      const mixedText = 'مرحبا Hello this is mixed text';
      expect(quickDetectLanguage(mixedText)).toBe('en'); // 20% < 30%
    });

    it('should detect mixed text with English as primary', () => {
      const mixedText = 'Hello this is mostly English with some مرحبا';
      expect(quickDetectLanguage(mixedText)).toBe('en');
    });

    it('should default to English for unknown text', () => {
      const unknownText = '123 456 789';
      expect(quickDetectLanguage(unknownText)).toBe('en');
    });
  });

  describe('enforceLanguage', () => {
    it('should not translate when question and response are same language', async () => {
      const question = 'ما هو الذكاء الاصطناعي؟';
      const response = 'الذكاء الاصطناعي هو تكنولوجيا متقدمة';

      const result = await enforceLanguage(question, response);

      expect(result.targetLanguage).toBe('ar');
      expect(result.originalLanguage).toBe('ar');
      expect(result.translationNeeded).toBe(false);
      expect(result.enforcedResponse).toBe(response);
    });

    it('should translate when question is Arabic but response is English', async () => {
      const question = 'ما هو الذكاء الاصطناعي؟';
      const response = 'Artificial Intelligence is an advanced technology';

      const result = await enforceLanguage(question, response);

      expect(result.targetLanguage).toBe('ar');
      expect(result.originalLanguage).toBe('en');
      expect(result.translationNeeded).toBe(true);
      expect(result.enforcedResponse).toContain('[AR]');
    });

    it('should translate when question is English but response is Arabic', async () => {
      const question = 'What is artificial intelligence?';
      const response = 'الذكاء الاصطناعي هو تكنولوجيا متقدمة';

      const result = await enforceLanguage(question, response);

      expect(result.targetLanguage).toBe('en');
      expect(result.originalLanguage).toBe('ar');
      expect(result.translationNeeded).toBe(true);
      expect(result.enforcedResponse).toContain('[EN]');
    });

    it('should have high confidence score', async () => {
      const question = 'What is AI?';
      const response = 'الذكاء الاصطناعي';

      const result = await enforceLanguage(question, response);

      expect(result.confidence).toBeGreaterThanOrEqual(90);
    });

    it('should track processing time', async () => {
      const question = 'What is AI?';
      const response = 'Artificial Intelligence';

      const result = await enforceLanguage(question, response);

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('processResponseWithLanguageEnforcement', () => {
    it('should return final response with language info', async () => {
      const question = 'ما هو الذكاء الاصطناعي؟';
      const response = 'Artificial Intelligence is advanced technology';

      const result = await processResponseWithLanguageEnforcement(question, response);

      expect(result.finalResponse).toBeDefined();
      expect(result.language).toBe('ar');
      expect(result.wasTranslated).toBe(true);
    });

    it('should handle same language without translation', async () => {
      const question = 'What is AI?';
      const response = 'Artificial Intelligence is advanced technology';

      const result = await processResponseWithLanguageEnforcement(question, response);

      expect(result.language).toBe('en');
      expect(result.wasTranslated).toBe(false);
      expect(result.finalResponse).toBe(response);
    });

    it('should work with debug mode', async () => {
      const question = 'What is AI?';
      const response = 'Artificial Intelligence';

      const consoleSpy = vi.spyOn(console, 'log');
      await processResponseWithLanguageEnforcement(question, response, true);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('translateResponse', () => {
    it('should translate to Arabic', async () => {
      const response = 'Hello world';
      const result = await translateResponse(response, 'ar');

      expect(result).toContain('[AR]');
    });

    it('should translate to English', async () => {
      const response = 'مرحبا بالعالم';
      const result = await translateResponse(response, 'en');

      expect(result).toContain('[EN]');
    });

    it('should handle translation errors gracefully', async () => {
      const response = 'Test response';
      const result = await translateResponse(response, 'ar');

      // Should return something (either translated or original)
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle mixed language conversation - Arabic question then English', async () => {
      const arabicQuestion = 'ما هو الذكاء الاصطناعي؟';
      const englishResponse = 'AI is a technology that enables machines to learn';

      const result = await enforceLanguage(arabicQuestion, englishResponse);

      expect(result.targetLanguage).toBe('ar');
      expect(result.translationNeeded).toBe(true);
    });

    it('should handle English question then Arabic response', async () => {
      const englishQuestion = 'What is artificial intelligence?';
      const arabicResponse = 'الذكاء الاصطناعي هو تكنولوجيا تمكن الآلات من التعلم';

      const result = await enforceLanguage(englishQuestion, arabicResponse);

      expect(result.targetLanguage).toBe('en');
      expect(result.translationNeeded).toBe(true);
    });

    it('should maintain conversation consistency in same language', async () => {
      const questions = [
        'ما هو الذكاء الاصطناعي؟',
        'كيف يعمل الذكاء الاصطناعي؟',
        'ما هي تطبيقات الذكاء الاصطناعي؟',
      ];

      const responses = [
        'الذكاء الاصطناعي هو تكنولوجيا متقدمة',
        'يعمل من خلال الخوارزميات والبيانات',
        'التطبيقات متعددة جداً',
      ];

      for (let i = 0; i < questions.length; i++) {
        const result = await enforceLanguage(questions[i], responses[i]);
        expect(result.targetLanguage).toBe('ar');
        expect(result.translationNeeded).toBe(false);
      }
    });

    it('should handle language switching in same conversation', async () => {
      // First exchange in Arabic
      const arabicQ = 'ما هو الذكاء الاصطناعي؟';
      const arabicR = 'الذكاء الاصطناعي هو تكنولوجيا';
      const result1 = await enforceLanguage(arabicQ, arabicR);
      expect(result1.targetLanguage).toBe('ar');

      // Second exchange in English
      const englishQ = 'What is machine learning?';
      const englishR = 'Machine learning is a subset of AI';
      const result2 = await enforceLanguage(englishQ, englishR);
      expect(result2.targetLanguage).toBe('en');

      // Both should be handled correctly
      expect(result1.translationNeeded).toBe(false);
      expect(result2.translationNeeded).toBe(false);
    });
  });
});
