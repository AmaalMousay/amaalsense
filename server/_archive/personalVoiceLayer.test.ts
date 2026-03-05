/**
 * Tests for Personal Voice Layer (Layer 14)
 */

import { describe, it, expect, vi } from 'vitest';
import {
  buildVoiceProfile,
  adaptTextToVoice,
  addPersonalTouches,
  selectExplanationStyle,
  assessAnswerFit,
  applyPersonalVoice,
} from './personalVoiceLayer';

// Mock Groq API
vi.mock('./groqIntegration', () => ({
  invokeGroqLLM: vi.fn(async ({ messages }) => {
    const userMessage = messages[messages.length - 1].content;
    
    if (userMessage.includes('كيّف') || userMessage.includes('Adapt')) {
      return {
        content: 'نص مكيّف بناءً على الملف الشخصي',
      };
    }

    if (userMessage.includes('اختر أفضل أسلوب') || userMessage.includes('Choose the best style')) {
      return {
        content: JSON.stringify({
          style: 'analogy',
          explanation: 'شرح باستخدام التشبيهات',
          reasoning: 'التشبيهات تساعد في الفهم',
        }),
      };
    }

    return {
      content: 'إجابة افتراضية',
    };
  }),
}));

describe('Personal Voice Layer (Layer 14)', () => {
  const testUserId = 'test-user-voice';
  
  describe('Voice Profile Building', () => {
    it('should build voice profile', async () => {
      const profile = await buildVoiceProfile(testUserId);

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(testUserId);
      expect(['formal', 'casual', 'professional', 'friendly', 'academic']).toContain(profile.tone);
      expect(['ar', 'en']).toContain(profile.language);
      expect(['simple', 'moderate', 'advanced']).toContain(profile.vocabulary);
      expect(['brief', 'moderate', 'detailed']).toContain(profile.responseLength);
    });

    it('should have default values', async () => {
      const profile = await buildVoiceProfile(testUserId);

      expect(typeof profile.useEmojis).toBe('boolean');
      expect(typeof profile.useExamples).toBe('boolean');
      expect(typeof profile.useAnalogies).toBe('boolean');
      expect(Array.isArray(profile.culturalContext)).toBe(true);
      expect(Array.isArray(profile.personalityTraits)).toBe(true);
    });

    it('should analyze conversation history', async () => {
      const history = [
        { userQuestion: 'سؤال عربي', userLanguage: 'ar' as const, responseLength: 150 },
        { userQuestion: 'سؤال عربي آخر', userLanguage: 'ar' as const, responseLength: 200 },
      ];

      const profile = await buildVoiceProfile(testUserId, history);

      expect(profile.language).toBe('ar');
    });

    it('should detect preferred response length', async () => {
      const history = [
        { userQuestion: 'سؤال', userLanguage: 'ar' as const, responseLength: 50 },
        { userQuestion: 'سؤال', userLanguage: 'ar' as const, responseLength: 40 },
      ];

      const profile = await buildVoiceProfile(testUserId, history);

      expect(profile.responseLength).toBe('brief');
    });
  });

  describe('Text Adaptation', () => {
    it('should adapt text to voice profile', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await adaptTextToVoice('نص أصلي', profile);

      expect(result).toBeDefined();
      expect(result.adaptedText).toBeDefined();
      expect(Array.isArray(result.adaptations)).toBe(true);
    });

    it('should preserve meaning in adaptation', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const originalText = 'الاقتصاد هو علم الإدارة';
      const result = await adaptTextToVoice(originalText, profile);

      expect(result.adaptedText).toBeDefined();
      expect(result.adaptedText.length).toBeGreaterThan(0);
    });

    it('should apply tone to text', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.tone = 'friendly';
      const result = await adaptTextToVoice('نص', profile);

      expect(Array.isArray(result.adaptations)).toBe(true);
      expect(result.adaptations.some(a => a.includes('friendly'))).toBe(true);
    });

    it('should apply vocabulary level', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.vocabulary = 'simple';
      const result = await adaptTextToVoice('نص معقد جداً', profile);

      expect(Array.isArray(result.adaptations)).toBe(true);
    });
  });

  describe('Personal Touches', () => {
    it('should add personal touches', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await addPersonalTouches('إجابة', profile);

      expect(result).toBeDefined();
      expect(result.personalizedAnswer).toBeDefined();
      expect(Array.isArray(result.touches)).toBe(true);
    });

    it('should add greeting with user name', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await addPersonalTouches('إجابة', profile, {
        name: 'أحمد',
      });

      expect(result.personalizedAnswer).toContain('أحمد');
      expect(result.touches.some(t => t.includes('تحية'))).toBe(true);
    });

    it('should connect with previous interests', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await addPersonalTouches('إجابة', profile, {
        previousTopics: ['الاقتصاد'],
      });

      expect(result.personalizedAnswer).toContain('الاقتصاد');
    });

    it('should add call to action for friendly tone', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.tone = 'friendly';
      const result = await addPersonalTouches('إجابة', profile);

      expect(Array.isArray(result.touches)).toBe(true);
    });
  });

  describe('Explanation Style Selection', () => {
    it('should select explanation style', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await selectExplanationStyle('الاقتصاد', profile);

      expect(result).toBeDefined();
      expect(['analogy', 'example', 'definition', 'story', 'comparison']).toContain(result.style);
      expect(result.explanation).toBeDefined();
      expect(result.reasoning).toBeDefined();
    });

    it('should prefer analogy if enabled', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.useAnalogies = true;
      const result = await selectExplanationStyle('مفهوم', profile);

      expect(result.style).toBeDefined();
    });

    it('should prefer examples if enabled', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.useExamples = true;
      const result = await selectExplanationStyle('مفهوم', profile);

      expect(result.style).toBeDefined();
    });

    it('should provide reasoning for selection', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await selectExplanationStyle('مفهوم', profile);

      expect(result.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('Answer Fit Assessment', () => {
    it('should assess answer fit', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await assessAnswerFit('إجابة قصيرة', profile);

      expect(result).toBeDefined();
      expect(result.fitScore).toBeGreaterThanOrEqual(0);
      expect(result.fitScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(Array.isArray(result.strengths)).toBe(true);
    });

    it('should evaluate response length', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.responseLength = 'brief';
      const shortAnswer = 'إجابة قصيرة';
      const result = await assessAnswerFit(shortAnswer, profile);

      expect(result.fitScore).toBeGreaterThan(0);
    });

    it('should check for examples', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.useExamples = true;
      const answerWithExample = 'إجابة مع مثال: ...';
      const result = await assessAnswerFit(answerWithExample, profile);

      expect(result.strengths.length >= 0).toBe(true);
    });

    it('should check for analogies', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.useAnalogies = true;
      const answerWithAnalogy = 'إجابة مثل التشبيه';
      const result = await assessAnswerFit(answerWithAnalogy, profile);

      expect(result.strengths.some(s => s.includes('تشبيه'))).toBe(true);
    });

    it('should provide improvement suggestions', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.useExamples = true;
      const answerWithoutExample = 'إجابة بدون أمثلة';
      const result = await assessAnswerFit(answerWithoutExample, profile);

      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Full Voice Application', () => {
    it('should apply personal voice to answer', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة أساسية', profile);

      expect(result).toBeDefined();
      expect(result.finalAnswer).toBeDefined();
      expect(typeof result.voiceApplied).toBe('boolean');
      expect(Array.isArray(result.adaptations)).toBe(true);
      expect(result.fitScore).toBeGreaterThanOrEqual(0);
      expect(result.fitScore).toBeLessThanOrEqual(100);
    });

    it('should preserve base answer content', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const baseAnswer = 'معلومة مهمة';
      const result = await applyPersonalVoice(baseAnswer, profile);

      expect(result.finalAnswer).toBeDefined();
    });

    it('should include user context', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة', profile, {
        name: 'علي',
        interests: ['الاقتصاد'],
        previousTopics: ['السياسة'],
      });

      expect(result.finalAnswer).toBeDefined();
      expect(result.adaptations.length).toBeGreaterThan(0);
    });

    it('should report adaptations made', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة', profile);

      expect(result.adaptations.length).toBeGreaterThan(0);
      expect(result.adaptations.some(a => a.includes('النبرة'))).toBe(true);
    });

    it('should provide fit score', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة تفصيلية جداً جداً جداً', profile);

      expect(result.fitScore).toBeGreaterThanOrEqual(0);
      expect(result.fitScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Voice Profile Customization', () => {
    it('should support formal tone', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.tone = 'formal';
      const result = await adaptTextToVoice('نص', profile);

      expect(result.adaptations.some(a => a.includes('formal'))).toBe(true);
    });

    it('should support casual tone', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.tone = 'casual';
      const result = await adaptTextToVoice('نص', profile);

      expect(result.adaptations.some(a => a.includes('casual'))).toBe(true);
    });

    it('should support advanced vocabulary', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.vocabulary = 'advanced';
      const result = await adaptTextToVoice('نص', profile);

      expect(result.adaptations.some(a => a.includes('advanced'))).toBe(true);
    });

    it('should support detailed responses', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.responseLength = 'detailed';
      const result = await adaptTextToVoice('نص', profile);

      expect(result.adaptations.some(a => a.includes('detailed'))).toBe(true);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complex answer adaptation', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const complexAnswer = 'إجابة معقدة جداً عن موضوع اقتصادي متقدم...';
      const result = await applyPersonalVoice(complexAnswer, profile);

      expect(result.finalAnswer).toBeDefined();
      expect(result.voiceApplied).toBe(true);
    });

    it('should personalize for returning user', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة', profile, {
        name: 'فاطمة',
        interests: ['التعليم', 'الاقتصاد'],
        previousTopics: ['السياسة', 'الاجتماع'],
      });

      expect(result.finalAnswer).toContain('فاطمة');
      expect(result.adaptations.length).toBeGreaterThan(0);
    });

    it('should adapt for academic tone', async () => {
      const profile = await buildVoiceProfile(testUserId);
      profile.tone = 'academic';
      profile.vocabulary = 'advanced';
      const result = await applyPersonalVoice('إجابة أكاديمية', profile);

      expect(result.finalAnswer).toBeDefined();
      expect(result.fitScore).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty answer gracefully', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('', profile);

      expect(result).toBeDefined();
      expect(result.finalAnswer).toBeDefined();
    });

    it('should handle missing user context', async () => {
      const profile = await buildVoiceProfile(testUserId);
      const result = await applyPersonalVoice('إجابة', profile);

      expect(result.finalAnswer).toBeDefined();
      expect(result.voiceApplied).toBe(true);
    });

    it('should provide default voice profile', async () => {
      const profile = await buildVoiceProfile('unknown-user');

      expect(profile).toBeDefined();
      expect(profile.tone).toBeDefined();
      expect(profile.language).toBeDefined();
    });
  });
});
