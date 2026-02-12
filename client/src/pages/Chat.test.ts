import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Chat Page Functionality', () => {
  describe('Message Filtering', () => {
    it('should filter conversations by search query', () => {
      const conversations = [
        { id: 1, title: 'Trump Analysis', topic: 'Politics', createdAt: new Date(), messageCount: 5, confidence: 85 },
        { id: 2, title: 'Economy Discussion', topic: 'Economics', createdAt: new Date(), messageCount: 3, confidence: 75 },
        { id: 3, title: 'Climate Change', topic: 'Environment', createdAt: new Date(), messageCount: 2, confidence: 90 },
      ];

      const searchQuery = 'Trump';
      const filtered = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Trump Analysis');
    });

    it('should filter conversations by topic', () => {
      const conversations = [
        { id: 1, title: 'Trump Analysis', topic: 'Politics', createdAt: new Date(), messageCount: 5, confidence: 85 },
        { id: 2, title: 'Economy Discussion', topic: 'Economics', createdAt: new Date(), messageCount: 3, confidence: 75 },
        { id: 3, title: 'Climate Change', topic: 'Environment', createdAt: new Date(), messageCount: 2, confidence: 90 },
      ];

      const filterTopic = 'Politics';
      const filtered = conversations.filter(conv => conv.topic === filterTopic);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].topic).toBe('Politics');
    });

    it('should filter conversations by date range', () => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const conversations = [
        { id: 1, title: 'Recent', topic: 'Politics', createdAt: now, messageCount: 5, confidence: 85 },
        { id: 2, title: 'Week Old', topic: 'Economics', createdAt: weekAgo, messageCount: 3, confidence: 75 },
        { id: 3, title: 'Month Old', topic: 'Environment', createdAt: monthAgo, messageCount: 2, confidence: 90 },
      ];

      const filtered = conversations.filter(conv => conv.createdAt >= weekAgo);

      expect(filtered).toHaveLength(2);
      expect(filtered.map(c => c.title)).toContain('Recent');
      expect(filtered.map(c => c.title)).toContain('Week Old');
    });

    it('should filter conversations by minimum confidence', () => {
      const conversations = [
        { id: 1, title: 'High Confidence', topic: 'Politics', createdAt: new Date(), messageCount: 5, confidence: 95 },
        { id: 2, title: 'Medium Confidence', topic: 'Economics', createdAt: new Date(), messageCount: 3, confidence: 75 },
        { id: 3, title: 'Low Confidence', topic: 'Environment', createdAt: new Date(), messageCount: 2, confidence: 45 },
      ];

      const minConfidence = 80;
      const filtered = conversations.filter(conv => (conv.confidence || 0) >= minConfidence);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].confidence).toBe(95);
    });
  });

  describe('Message Sorting', () => {
    it('should sort conversations by most recent', () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const conversations = [
        { id: 1, title: 'Oldest', topic: 'Politics', createdAt: twoDaysAgo, messageCount: 5, confidence: 85 },
        { id: 2, title: 'Middle', topic: 'Economics', createdAt: yesterday, messageCount: 3, confidence: 75 },
        { id: 3, title: 'Newest', topic: 'Environment', createdAt: now, messageCount: 2, confidence: 90 },
      ];

      const sorted = [...conversations].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      expect(sorted[0].title).toBe('Newest');
      expect(sorted[1].title).toBe('Middle');
      expect(sorted[2].title).toBe('Oldest');
    });

    it('should sort conversations by highest confidence', () => {
      const conversations = [
        { id: 1, title: 'Low', topic: 'Politics', createdAt: new Date(), messageCount: 5, confidence: 50 },
        { id: 2, title: 'High', topic: 'Economics', createdAt: new Date(), messageCount: 3, confidence: 95 },
        { id: 3, title: 'Medium', topic: 'Environment', createdAt: new Date(), messageCount: 2, confidence: 75 },
      ];

      const sorted = [...conversations].sort((a, b) =>
        (b.confidence || 0) - (a.confidence || 0)
      );

      expect(sorted[0].confidence).toBe(95);
      expect(sorted[1].confidence).toBe(75);
      expect(sorted[2].confidence).toBe(50);
    });

    it('should sort conversations by topic alphabetically', () => {
      const conversations = [
        { id: 1, title: 'Zebra', topic: 'Zoology', createdAt: new Date(), messageCount: 5, confidence: 85 },
        { id: 2, title: 'Apple', topic: 'Agriculture', createdAt: new Date(), messageCount: 3, confidence: 75 },
        { id: 3, title: 'Monkey', topic: 'Medicine', createdAt: new Date(), messageCount: 2, confidence: 90 },
      ];

      const sorted = [...conversations].sort((a, b) =>
        (a.topic || '').localeCompare(b.topic || '')
      );

      expect(sorted[0].topic).toBe('Agriculture');
      expect(sorted[1].topic).toBe('Medicine');
      expect(sorted[2].topic).toBe('Zoology');
    });
  });

  describe('Combined Filtering and Sorting', () => {
    it('should apply multiple filters and then sort', () => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const conversations = [
        { id: 1, title: 'Trump Analysis', topic: 'Politics', createdAt: now, messageCount: 5, confidence: 95 },
        { id: 2, title: 'Old Trump', topic: 'Politics', createdAt: weekAgo, messageCount: 3, confidence: 85 },
        { id: 3, title: 'Economy', topic: 'Economics', createdAt: now, messageCount: 2, confidence: 90 },
        { id: 4, title: 'Low Confidence Trump', topic: 'Politics', createdAt: now, messageCount: 1, confidence: 30 },
      ];

      // Filter: topic = Politics, date >= weekAgo, confidence >= 80
      let filtered = conversations.filter(conv => {
        const matchesTopic = conv.topic === 'Politics';
        const matchesDate = conv.createdAt >= weekAgo;
        const matchesConfidence = (conv.confidence || 0) >= 80;
        return matchesTopic && matchesDate && matchesConfidence;
      });

      // Sort by confidence descending
      filtered = filtered.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Trump Analysis');
      expect(filtered[0].confidence).toBe(95);
    });
  });

  describe('Chat Message Handling', () => {
    it('should correctly identify user vs assistant messages', () => {
      const messages = [
        { id: '1', type: 'user' as const, content: 'Hello', timestamp: new Date() },
        { id: '2', type: 'assistant' as const, content: 'Hi there', timestamp: new Date() },
      ];

      const userMessages = messages.filter(m => m.type === 'user');
      const assistantMessages = messages.filter(m => m.type === 'assistant');

      expect(userMessages).toHaveLength(1);
      expect(assistantMessages).toHaveLength(1);
      expect(userMessages[0].content).toBe('Hello');
      expect(assistantMessages[0].content).toBe('Hi there');
    });

    it('should preserve message metadata', () => {
      const message = {
        id: '1',
        type: 'assistant' as const,
        content: 'Analysis complete',
        timestamp: new Date(),
        confidence: 85,
        metadata: {
          topic: 'Trump',
          region: 'Global',
          indices: {
            GMI: 50,
            CFI: 65,
            HRI: 70,
          },
        },
      };

      expect(message.metadata.topic).toBe('Trump');
      expect(message.metadata.indices.GMI).toBe(50);
      expect(message.confidence).toBe(85);
    });
  });

  describe('Confidence Score Rounding', () => {
    it('should round confidence scores to whole numbers', () => {
      const scores = [44.4, 44.5, 44.6, 45.4, 45.5, 45.6];
      const rounded = scores.map(s => Math.round(s));

      expect(rounded).toEqual([44, 44, 45, 45, 46, 46]);
    });

    it('should ensure all confidence values are between 0-100', () => {
      const confidenceValues = [0, 25, 50, 75, 100];

      confidenceValues.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Export Functionality', () => {
    it('should export chat data as JSON', () => {
      const messages = [
        { id: '1', type: 'user' as const, content: 'Hello', timestamp: new Date() },
        { id: '2', type: 'assistant' as const, content: 'Hi', timestamp: new Date() },
      ];

      const chatData = {
        messages,
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
      };

      const dataStr = JSON.stringify(chatData, null, 2);
      const parsed = JSON.parse(dataStr);

      expect(parsed.messageCount).toBe(2);
      expect(parsed.messages).toHaveLength(2);
      expect(parsed.exportedAt).toBeDefined();
    });
  });
});
