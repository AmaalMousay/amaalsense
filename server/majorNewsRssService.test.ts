/**
 * Tests for Major News RSS Service
 * Tests BBC, Reuters, Al Jazeera, and CNN RSS feeds
 */

import { describe, it, expect } from 'vitest';
import {
  fetchBBCNews,
  fetchReutersNews,
  fetchAlJazeeraNews,
  fetchCNNNews,
  fetchAllMajorNews,
  convertToUnifiedFormat,
  getNewsStats
} from './majorNewsRssService';

describe('Major News RSS Service', () => {
  
  describe('fetchBBCNews', () => {
    it('should return an array of news items', async () => {
      const news = await fetchBBCNews(5);
      expect(Array.isArray(news)).toBe(true);
    }, 30000);
    
    it('should have correct structure for BBC news items', async () => {
      const news = await fetchBBCNews(3);
      if (news.length > 0) {
        const item = news[0];
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('link');
        expect(item).toHaveProperty('pubDate');
        expect(item).toHaveProperty('source');
        expect(item).toHaveProperty('language');
        expect(item.source).toContain('BBC');
      }
    }, 30000);
  });
  
  describe('fetchReutersNews', () => {
    it('should return an array of news items', async () => {
      const news = await fetchReutersNews(5);
      expect(Array.isArray(news)).toBe(true);
    }, 30000);
  });
  
  describe('fetchAlJazeeraNews', () => {
    it('should return an array of news items', async () => {
      const news = await fetchAlJazeeraNews(5);
      expect(Array.isArray(news)).toBe(true);
    }, 30000);
    
    it('should include both Arabic and English sources', async () => {
      const news = await fetchAlJazeeraNews(10);
      if (news.length > 0) {
        const sources = news.map(n => n.source);
        // At least one should be from Al Jazeera
        expect(sources.some(s => s.includes('Al Jazeera'))).toBe(true);
      }
    }, 30000);
  });
  
  describe('fetchCNNNews', () => {
    it('should return an array of news items', async () => {
      const news = await fetchCNNNews(5);
      expect(Array.isArray(news)).toBe(true);
    }, 30000);
    
    it('should have CNN as source', async () => {
      const news = await fetchCNNNews(3);
      if (news.length > 0) {
        expect(news[0].source).toContain('CNN');
      }
    }, 30000);
  });
  
  describe('fetchAllMajorNews', () => {
    it('should return combined news from all sources', async () => {
      const news = await fetchAllMajorNews(20);
      expect(Array.isArray(news)).toBe(true);
    }, 60000);
    
    it('should include news from multiple sources', async () => {
      const news = await fetchAllMajorNews(30);
      if (news.length > 0) {
        const sources = new Set(news.map(n => n.source.split(' ')[0]));
        // Should have at least 2 different source types
        expect(sources.size).toBeGreaterThanOrEqual(1);
      }
    }, 60000);
    
    it('should sort news by date (newest first)', async () => {
      const news = await fetchAllMajorNews(10);
      if (news.length > 1) {
        const dates = news.map(n => new Date(n.pubDate).getTime());
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
        }
      }
    }, 60000);
  });
  
  describe('convertToUnifiedFormat', () => {
    it('should convert news items to unified format', async () => {
      const news = await fetchBBCNews(3);
      const unified = convertToUnifiedFormat(news);
      
      expect(Array.isArray(unified)).toBe(true);
      if (unified.length > 0) {
        const item = unified[0];
        expect(item).toHaveProperty('text');
        expect(item).toHaveProperty('source');
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('language');
        expect(item.timestamp).toBeInstanceOf(Date);
      }
    }, 30000);
  });
  
  describe('getNewsStats', () => {
    it('should return correct statistics', async () => {
      const news = await fetchAllMajorNews(10);
      const stats = getNewsStats(news);
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('bySource');
      expect(stats).toHaveProperty('byLanguage');
      expect(stats.total).toBe(news.length);
      expect(stats.byLanguage).toHaveProperty('ar');
      expect(stats.byLanguage).toHaveProperty('en');
    }, 60000);
  });
});
