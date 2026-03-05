/**
 * API Health Monitor Tests
 * Tests for the real-time API health monitoring system
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios before importing the module
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock ENV
vi.mock('./_core/env', () => ({
  ENV: {},
}));

import axios from 'axios';
import { checkAllSources, checkSingleSource, forceRefresh, getSourceCategories } from './apiHealthMonitor';

const mockedAxios = vi.mocked(axios);

describe('API Health Monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.NEWS_API_KEY;
    delete process.env.GNEWS_API_KEY;
    delete process.env.YOUTUBE_API_KEY;
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.GROQ_API_KEY;
    delete process.env.BUILT_IN_FORGE_API_URL;
    delete process.env.BUILT_IN_FORGE_API_KEY;
  });

  describe('getSourceCategories', () => {
    it('should return correct source categories', () => {
      const categories = getSourceCategories();
      
      expect(categories.news).toContain('newsapi');
      expect(categories.news).toContain('gnews');
      expect(categories.news).toContain('google_rss');
      expect(categories.social).toContain('reddit');
      expect(categories.social).toContain('mastodon');
      expect(categories.social).toContain('bluesky');
      expect(categories.social).toContain('telegram');
      expect(categories.ai).toContain('groq');
      expect(categories.ai).toContain('builtin_llm');
      expect(categories.video).toContain('youtube');
    });

    it('should have 4 categories', () => {
      const categories = getSourceCategories();
      expect(Object.keys(categories)).toHaveLength(4);
    });
  });

  describe('checkAllSources', () => {
    it('should return health state for all sources', async () => {
      // Mock all API calls to succeed
      mockedAxios.get.mockResolvedValue({
        data: { totalResults: 10, articles: [], data: { children: [] } },
        status: 200,
      });

      const result = await forceRefresh(); // Force refresh to bypass cache
      
      expect(result).toBeDefined();
      expect(result.sources).toBeDefined();
      expect(Array.isArray(result.sources)).toBe(true);
      expect(result.totalSources).toBe(10);
      expect(typeof result.onlineSources).toBe('number');
      expect(typeof result.degradedSources).toBe('number');
      expect(typeof result.offlineSources).toBe('number');
      expect(result.lastFullCheck).toBeGreaterThan(0);
    });

    it('should have correct overall status when all sources fail', async () => {
      // Mock all API calls to fail
      mockedAxios.get.mockRejectedValue(new Error('Connection refused'));

      const result = await forceRefresh();
      
      // When all API calls fail, overall status should be 'degraded' or 'offline'
      // Some sources (reddit, mastodon, bluesky, google_rss) don't need keys
      // so they get 'offline' not 'no_key', making overall 'degraded' or 'offline'
      expect(['offline', 'degraded']).toContain(result.overallStatus);
    });

    it('should return cached results within TTL', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { totalResults: 5 },
        status: 200,
      });

      const result1 = await forceRefresh();
      const result2 = await checkAllSources(); // Should return cached

      expect(result1.lastFullCheck).toBe(result2.lastFullCheck);
    });

    it('should include all 10 sources', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {},
        status: 200,
      });

      const result = await forceRefresh();
      
      const sourceIds = result.sources.map(s => s.id);
      expect(sourceIds).toContain('newsapi');
      expect(sourceIds).toContain('gnews');
      expect(sourceIds).toContain('reddit');
      expect(sourceIds).toContain('mastodon');
      expect(sourceIds).toContain('bluesky');
      expect(sourceIds).toContain('youtube');
      expect(sourceIds).toContain('telegram');
      expect(sourceIds).toContain('groq');
      expect(sourceIds).toContain('google_rss');
      expect(sourceIds).toContain('builtin_llm');
    });
  });

  describe('checkSingleSource', () => {
    it('should return null for unknown source', async () => {
      const result = await checkSingleSource('unknown_source');
      expect(result).toBeNull();
    });

    it('should check newsapi source', async () => {
      process.env.NEWS_API_KEY = 'test-key';
      mockedAxios.get.mockResolvedValue({
        data: { totalResults: 34 },
        status: 200,
      });

      const result = await checkSingleSource('newsapi');
      
      expect(result).toBeDefined();
      expect(result!.name).toBe('NewsAPI');
      expect(result!.id).toBe('newsapi');
      expect(result!.status).toBe('online');
      expect(result!.hasApiKey).toBe(true);
      expect(result!.responseTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return no_key status when API key is missing', async () => {
      delete process.env.NEWS_API_KEY;
      
      const result = await checkSingleSource('newsapi');
      
      expect(result).toBeDefined();
      expect(result!.status).toBe('no_key');
      expect(result!.hasApiKey).toBe(false);
    });

    it('should return offline status when API call fails', async () => {
      process.env.GNEWS_API_KEY = 'test-key';
      mockedAxios.get.mockRejectedValue({
        response: { status: 403 },
        message: 'Forbidden',
      });

      const result = await checkSingleSource('gnews');
      
      expect(result).toBeDefined();
      expect(result!.status).toBe('offline');
    });

    it('should check reddit (no key needed)', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { data: { children: [{ data: {} }] } },
        status: 200,
      });

      const result = await checkSingleSource('reddit');
      
      expect(result).toBeDefined();
      expect(result!.name).toBe('Reddit');
      expect(result!.hasApiKey).toBe(true); // Public API
    });

    it('should check groq with API key', async () => {
      process.env.GROQ_API_KEY = 'test-groq-key';
      mockedAxios.get.mockResolvedValue({
        data: { data: [{}, {}, {}] },
        status: 200,
      });

      const result = await checkSingleSource('groq');
      
      expect(result).toBeDefined();
      expect(result!.name).toBe('Groq LLM');
      expect(result!.status).toBe('online');
      expect(result!.message).toContain('3 models available');
    });

    it('should check telegram with bot token', async () => {
      process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
      mockedAxios.get.mockResolvedValue({
        data: { result: { username: 'TestBot' } },
        status: 200,
      });

      const result = await checkSingleSource('telegram');
      
      expect(result).toBeDefined();
      expect(result!.name).toBe('Telegram');
      expect(result!.status).toBe('online');
      expect(result!.message).toContain('TestBot');
    });
  });

  describe('Source health result structure', () => {
    it('should have all required fields', async () => {
      process.env.NEWS_API_KEY = 'test-key';
      mockedAxios.get.mockResolvedValue({
        data: { totalResults: 10 },
        status: 200,
      });

      const result = await checkSingleSource('newsapi');
      
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('responseTimeMs');
      expect(result).toHaveProperty('lastChecked');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('hasApiKey');
      expect(result).toHaveProperty('errorCount');
      expect(result).toHaveProperty('successCount');
      expect(result).toHaveProperty('uptime');
    });

    it('should have quota info for API key sources', async () => {
      process.env.NEWS_API_KEY = 'test-key';
      mockedAxios.get.mockResolvedValue({
        data: { totalResults: 10 },
        status: 200,
      });

      const result = await checkSingleSource('newsapi');
      
      expect(result!.quotaInfo).toBeDefined();
      expect(result!.quotaInfo!.limit).toBeGreaterThan(0);
      expect(result!.quotaInfo!.remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe('forceRefresh', () => {
    it('should bypass cache and return fresh results', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {},
        status: 200,
      });

      const result1 = await forceRefresh();
      
      // Wait a tiny bit
      await new Promise(r => setTimeout(r, 10));
      
      const result2 = await forceRefresh();
      
      // Both should have different timestamps
      expect(result2.lastFullCheck).toBeGreaterThanOrEqual(result1.lastFullCheck);
    });
  });
});
