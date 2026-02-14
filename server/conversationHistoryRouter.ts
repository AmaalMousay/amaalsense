import { z } from 'zod';

/**
 * Conversation History Router
 * Stores and retrieves conversation analyses with EventVector results
 * Simplified implementation for production use
 */

export interface Conversation {
  id: string;
  userId: string;
  inputText: string;
  language: string;
  topic: string;
  dominantEmotion: string;
  emotions: Record<string, number>;
  region: string;
  impactScore: number;
  severity: 'low' | 'medium' | 'high';
  groqResponse: string;
  eventVectorJson: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for demo (replace with database in production)
const conversationStore = new Map<string, Conversation>();

/**
 * Conversation History Helpers
 */
export const conversationHistoryHelpers = {
  /**
   * Save conversation with EventVector
   */
  async saveConversation(data: {
    userId: string;
    inputText: string;
    language: string;
    topic: string;
    dominantEmotion: string;
    emotions: Record<string, number>;
    region: string;
    impactScore: number;
    severity: 'low' | 'medium' | 'high';
    groqResponse: string;
    eventVector: any;
  }): Promise<Conversation> {
    const id = Math.random().toString(36).substr(2, 9);
    const conversation: Conversation = {
      id,
      userId: data.userId,
      inputText: data.inputText,
      language: data.language,
      topic: data.topic,
      dominantEmotion: data.dominantEmotion,
      emotions: data.emotions,
      region: data.region,
      impactScore: data.impactScore,
      severity: data.severity,
      groqResponse: data.groqResponse,
      eventVectorJson: JSON.stringify(data.eventVector),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    conversationStore.set(id, conversation);
    return conversation;
  },

  /**
   * Get conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | null> {
    return conversationStore.get(id) || null;
  },

  /**
   * Get user's conversation history
   */
  async getUserConversations(userId: string, limit: number = 50): Promise<Conversation[]> {
    const userConversations = Array.from(conversationStore.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return userConversations;
  },

  /**
   * Search conversations by topic
   */
  async searchConversationsByTopic(userId: string, topic: string): Promise<Conversation[]> {
    return Array.from(conversationStore.values())
      .filter(
        conv =>
          conv.userId === userId && conv.topic.toLowerCase().includes(topic.toLowerCase())
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Get conversations by emotion
   */
  async getConversationsByEmotion(userId: string, emotion: string): Promise<Conversation[]> {
    return Array.from(conversationStore.values())
      .filter(conv => conv.userId === userId && conv.dominantEmotion.toLowerCase() === emotion.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Get conversations by region
   */
  async getConversationsByRegion(userId: string, region: string): Promise<Conversation[]> {
    return Array.from(conversationStore.values())
      .filter(conv => conv.userId === userId && conv.region.includes(region))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Get conversation statistics
   */
  async getConversationStats(userId: string): Promise<{
    totalConversations: number;
    topTopics: Array<{ topic: string; count: number }>;
    topEmotions: Array<{ emotion: string; count: number }>;
    averageImpactScore: number;
    languagesUsed: string[];
  }> {
    const userConversations = Array.from(conversationStore.values()).filter(
      conv => conv.userId === userId
    );

    const topicCounts: Record<string, number> = {};
    const emotionCounts: Record<string, number> = {};
    const languageSet = new Set<string>();
    let totalImpact = 0;

    userConversations.forEach(conv => {
      topicCounts[conv.topic] = (topicCounts[conv.topic] || 0) + 1;
      emotionCounts[conv.dominantEmotion] = (emotionCounts[conv.dominantEmotion] || 0) + 1;
      languageSet.add(conv.language);
      totalImpact += conv.impactScore;
    });

    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalConversations: userConversations.length,
      topTopics,
      topEmotions,
      averageImpactScore:
        userConversations.length > 0 ? totalImpact / userConversations.length : 0,
      languagesUsed: Array.from(languageSet),
    };
  },

  /**
   * Delete conversation
   */
  async deleteConversation(id: string): Promise<boolean> {
    return conversationStore.delete(id);
  },

  /**
   * Export conversations as JSON
   */
  async exportConversations(userId: string): Promise<string> {
    const convs = await conversationHistoryHelpers.getUserConversations(userId, 1000);
    return JSON.stringify(convs, null, 2);
  },

  /**
   * Clear user's conversations
   */
  async clearUserConversations(userId: string): Promise<number> {
    const before = conversationStore.size;
    const keysToDelete: string[] = [];

    conversationStore.forEach((conv, key) => {
      if (conv.userId === userId) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => conversationStore.delete(key));
    return before - conversationStore.size;
  },

  /**
   * Get conversations by date range
   */
  async getConversationsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Conversation[]> {
    return Array.from(conversationStore.values())
      .filter(
        conv =>
          conv.userId === userId &&
          conv.createdAt >= startDate &&
          conv.createdAt <= endDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
};
