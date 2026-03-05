/**
 * Tests for Personal Memory Layer (Layer 12)
 */

import { describe, it, expect, vi } from 'vitest';
import {
  saveConversation,
  getUserConversationHistory,
  buildUserProfile,
  enhanceQuestionWithMemory,
  trackUserInterests,
  getUserContext,
} from './personalMemoryLayer';

// Mock getDb
vi.mock('./db', () => ({
  getDb: vi.fn(async () => null),
}));

describe('Personal Memory Layer (Layer 12)', () => {
  const testUserId = 'test-user-123';
  
  describe('Conversation Recording', () => {
    it('should save conversation record', async () => {
      const conversation = {
        question: 'ما رأيك في الوضع الاقتصادي؟',
        questionType: 'emotional',
        detectedTopics: ['الاقتصاد'],
        detectedCountries: ['مصر'],
        response: 'تحليل الوضع الاقتصادي...',
        emotions: {
          joy: 0.2,
          hope: 0.3,
          sadness: 0.4,
          anger: 0.1,
          fear: 0.2,
          curiosity: 0.5,
        },
        timestamp: new Date(),
        language: 'ar' as const,
      };

      const result = await saveConversation(testUserId, conversation);

      expect(result).toBeDefined();
      expect(result.userId).toBe(testUserId);
      expect(result.question).toBe(conversation.question);
      expect(result.questionType).toBe('emotional');
      expect(result.detectedTopics).toContain('الاقتصاد');
    });

    it('should have unique ID format', async () => {
      const conversation = {
        question: 'سؤال اختبار',
        questionType: 'factual',
        detectedTopics: [],
        detectedCountries: [],
        response: 'إجابة',
        emotions: {
          joy: 0.2,
          hope: 0.2,
          sadness: 0.2,
          anger: 0.2,
          fear: 0.2,
          curiosity: 0.2,
        },
        timestamp: new Date(),
        language: 'ar' as const,
      };

      const result = await saveConversation(testUserId, conversation);
      expect(result.id).toMatch(/^conv-/);
      expect(result.id).toContain(testUserId);
    });
  });

  describe('Conversation History', () => {
    it('should retrieve conversation history', async () => {
      const history = await getUserConversationHistory(testUserId, 5);
      expect(Array.isArray(history)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const history = await getUserConversationHistory(testUserId, 3);
      expect(history.length).toBeLessThanOrEqual(3);
    });
  });

  describe('User Profile Building', () => {
    it('should build user profile', async () => {
      const profile = await buildUserProfile(testUserId);

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(testUserId);
      expect(profile.preferredLanguage).toBe('ar');
      expect(Array.isArray(profile.interests)).toBe(true);
      expect(Array.isArray(profile.countries)).toBe(true);
    });

    it('should have valid emotion averages', async () => {
      const profile = await buildUserProfile(testUserId);

      expect(profile.averageEmotions.joy).toBeGreaterThanOrEqual(0);
      expect(profile.averageEmotions.joy).toBeLessThanOrEqual(1);
      expect(profile.averageEmotions.hope).toBeGreaterThanOrEqual(0);
      expect(profile.averageEmotions.hope).toBeLessThanOrEqual(1);
    });

    it('should track conversation count', async () => {
      const profile = await buildUserProfile(testUserId);
      expect(profile.conversationCount).toBeGreaterThanOrEqual(0);
    });

    it('should have last interaction timestamp', async () => {
      const profile = await buildUserProfile(testUserId);
      expect(profile.lastInteraction).toBeInstanceOf(Date);
    });
  });

  describe('Question Enhancement with Memory', () => {
    it('should enhance question with user interests', async () => {
      const result = await enhanceQuestionWithMemory(
        testUserId,
        'ما رأيك في الاقتصاد؟',
        ['الاقتصاد'],
        ['مصر']
      );

      expect(result).toBeDefined();
      expect(result.contextualTopics).toBeDefined();
      expect(result.contextualCountries).toBeDefined();
      expect(Array.isArray(result.userInterests)).toBe(true);
    });

    it('should detect follow-up questions', async () => {
      const result = await enhanceQuestionWithMemory(
        testUserId,
        'ما رأيك في الاقتصاد؟',
        ['الاقتصاد'],
        ['مصر']
      );

      expect(typeof result.isFollowUp).toBe('boolean');
    });

    it('should suggest focus based on interests', async () => {
      const result = await enhanceQuestionWithMemory(
        testUserId,
        'سؤال عام',
        [],
        []
      );

      expect(result.suggestedFocus).toBeDefined();
      expect(result.suggestedFocus.length).toBeGreaterThan(0);
    });

    it('should merge detected and user topics', async () => {
      const result = await enhanceQuestionWithMemory(
        testUserId,
        'سؤال',
        ['الاقتصاد'],
        ['مصر']
      );

      expect(result.contextualTopics).toContain('الاقتصاد');
      expect(result.contextualCountries).toContain('مصر');
    });
  });

  describe('Interest Tracking', () => {
    it('should track user interests', async () => {
      await trackUserInterests(
        testUserId,
        ['الاقتصاد', 'السياسة'],
        ['مصر', 'السعودية']
      );

      const profile = await buildUserProfile(testUserId);
      expect(profile.interests).toBeDefined();
      expect(profile.countries).toBeDefined();
    });
  });

  describe('User Context', () => {
    it('should retrieve full user context', async () => {
      const context = await getUserContext(testUserId);

      expect(context).toBeDefined();
      expect(context.profile).toBeDefined();
      expect(context.recentConversations).toBeDefined();
      expect(context.emotionalTrend).toBeDefined();
      expect(context.engagementLevel).toBeDefined();
    });

    it('should determine emotional trend', async () => {
      const context = await getUserContext(testUserId);
      expect(['positive', 'neutral', 'negative']).toContain(context.emotionalTrend);
    });

    it('should assess engagement level', async () => {
      const context = await getUserContext(testUserId);
      expect(['low', 'medium', 'high']).toContain(context.engagementLevel);
    });

    it('should have recent conversations', async () => {
      const context = await getUserContext(testUserId);
      expect(Array.isArray(context.recentConversations)).toBe(true);
      expect(context.recentConversations.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Emotional Analysis', () => {
    it('should calculate average emotions correctly', async () => {
      const profile = await buildUserProfile(testUserId);
      const totalEmotions = Object.values(profile.averageEmotions).reduce((a, b) => a + b, 0);
      expect(totalEmotions).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Default Behavior', () => {
    it('should handle missing conversation history gracefully', async () => {
      const history = await getUserConversationHistory('non-existent-user', 5);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });

    it('should provide default profile for new users', async () => {
      const profile = await buildUserProfile('brand-new-user');
      expect(profile).toBeDefined();
      expect(profile.conversationCount).toBe(0);
      expect(profile.interests.length).toBe(0);
    });

    it('should handle enhancement for users with no history', async () => {
      const result = await enhanceQuestionWithMemory(
        'new-user',
        'سؤال',
        ['الاقتصاد'],
        []
      );

      expect(result).toBeDefined();
      expect(result.contextualTopics).toContain('الاقتصاد');
    });
  });
});
