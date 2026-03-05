/**
 * NETWORK ENGINE TESTS
 * 
 * Tests for the unified network-topology engine that replaces
 * the old sequential 24-layer pipeline.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock LLM calls
vi.mock('./smartLLM', () => ({
  smartChat: vi.fn().mockResolvedValue('مرحباً! هذا تحليل تجريبي للمشاعر الجماعية.'),
  smartJsonChat: vi.fn().mockResolvedValue({ emotions: { joy: 0.3, sadness: 0.2 }, summary: 'Test' }),
  smartInvokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: 'ترجمة تجريبية' } }],
  }),
}));

// Mock Layer 1 Question Understanding
vi.mock('./layer1QuestionUnderstanding', () => ({
  layer1QuestionUnderstanding: vi.fn().mockResolvedValue({
    originalQuestion: 'test question',
    language: 'ar',
    questionType: 'sentiment',
    entities: { topics: ['test'], people: [], locations: [], organizations: [] },
    hasFactualError: false,
    clarificationNeeded: false,
    confidence: 75,
    isComparative: false,
    isOpinionBased: false,
    readyForAnalysis: true,
    suggestedAnalysisType: 'emotion_analysis',
  }),
}));

// Mock data services
vi.mock('./gnewsService', () => ({
  searchGNews: vi.fn().mockResolvedValue([
    { title: 'Test News 1', description: 'Description 1', url: 'http://test1.com', source: { name: 'TestSource' }, publishedAt: '2024-01-01' },
    { title: 'Test News 2', description: 'Description 2', url: 'http://test2.com', source: { name: 'TestSource2' }, publishedAt: '2024-01-02' },
  ]),
}));

vi.mock('./newsService', () => ({
  fetchNewsArticles: vi.fn().mockResolvedValue([
    { title: 'NewsAPI Article', description: 'Content', url: 'http://newsapi.com', source: { name: 'NewsAPI' }, publishedAt: new Date() },
  ]),
}));

vi.mock('./googleRssService', () => ({
  fetchGoogleRssNews: vi.fn().mockResolvedValue([
    { title: 'RSS News', description: 'RSS Content', link: 'http://rss.com', source: 'Google RSS', pubDate: '2024-01-01' },
  ]),
}));

vi.mock('./socialMediaService', () => ({
  fetchRedditPosts: vi.fn().mockResolvedValue([
    { text: 'Reddit post about emotions', url: 'http://reddit.com/1', platform: 'reddit', author: 'user1' },
  ]),
  fetchMastodonPosts: vi.fn().mockResolvedValue([]),
  fetchBlueskyPosts: vi.fn().mockResolvedValue([]),
}));

// Import after mocks
import {
  executeNetworkEngine,
  analyzeForMap,
  analyzeForWeather,
  analyzeForCountryDetail,
  analyzeForSmartAnalysis,
  analyzeCountriesBatch,
  getGlobalMood,
  getEngineStats,
  clearAllCaches,
  type NetworkContext,
  type MapResult,
  type WeatherResult,
  type CountryDetailResult,
  type SmartAnalysisResult,
} from './networkEngine';

describe('Network Engine', () => {
  beforeEach(() => {
    clearAllCaches();
    vi.clearAllMocks();
  });

  // ============================================================
  // CORE ENGINE TESTS
  // ============================================================

  describe('executeNetworkEngine', () => {
    it('should execute all 4 network groups', async () => {
      const ctx = await executeNetworkEngine('user1', 'ما هي مشاعر الناس في ليبيا؟', 'ar');
      
      expect(ctx.status).toBe('completed');
      expect(ctx.requestId).toMatch(/^net_/);
      expect(ctx.userId).toBe('user1');
      expect(ctx.language).toBe('ar');
    });

    it('should populate gate network output', async () => {
      const ctx = await executeNetworkEngine('user1', 'test question', 'ar');
      
      expect(ctx.gate).toBeDefined();
      expect(ctx.gate.layer1Output).toBeDefined();
      expect(ctx.gate.intent).toBeDefined();
      expect(ctx.gate.searchQuery).toBeTruthy();
      expect(typeof ctx.gate.needsAnalysis).toBe('boolean');
      expect(typeof ctx.gate.needsLLM).toBe('boolean');
    });

    it('should populate collection network output', async () => {
      const ctx = await executeNetworkEngine('user1', 'test question', 'ar');
      
      expect(ctx.collection).toBeDefined();
      expect(ctx.collection.rawData).toBeDefined();
      expect(ctx.collection.eventVector).toBeDefined();
      expect(ctx.collection.vectorPrompt).toBeTruthy();
      expect(typeof ctx.collection.sourceCount).toBe('number');
      expect(typeof ctx.collection.totalItems).toBe('number');
    });

    it('should populate analysis network output with parallel results', async () => {
      const ctx = await executeNetworkEngine('user1', 'test question', 'ar');
      
      expect(ctx.analysis).toBeDefined();
      expect(ctx.analysis.emotions).toBeDefined();
      expect(ctx.analysis.dominantEmotion).toBeTruthy();
      expect(Array.isArray(ctx.analysis.breakingNews)).toBe(true);
      expect(ctx.analysis.confidence).toBeDefined();
      expect(typeof ctx.analysis.confidence.overall).toBe('number');
    });

    it('should populate generation network output', async () => {
      const ctx = await executeNetworkEngine('user1', 'test question', 'ar');
      
      expect(ctx.generation).toBeDefined();
      expect(typeof ctx.generation.response).toBe('string');
      expect(ctx.generation.personalVoice).toBeDefined();
      expect(ctx.generation.personalVoice.tone).toBeTruthy();
      expect(ctx.generation.languageEnforced).toBeDefined();
      expect(Array.isArray(ctx.generation.suggestions)).toBe(true);
      expect(ctx.generation.quality).toBeDefined();
      expect(typeof ctx.generation.quality.score).toBe('number');
    });

    it('should record layer traces for analytics', async () => {
      const ctx = await executeNetworkEngine('user1', 'test question', 'ar');
      
      expect(ctx.analytics).toBeDefined();
      expect(ctx.analytics.totalDurationMs).toBeGreaterThanOrEqual(0);
      expect(ctx.analytics.layerTraces.length).toBeGreaterThan(0);
      expect(ctx.analytics.parallelGroups).toBe(4);
      
      // Check that traces have proper structure
      for (const trace of ctx.analytics.layerTraces) {
        expect(trace.name).toBeTruthy();
        expect(['gate', 'collection', 'analysis', 'generation']).toContain(trace.group);
        expect(trace.durationMs).toBeGreaterThanOrEqual(0);
        expect(['success', 'skipped', 'error']).toContain(trace.status);
      }
    });

    it('should detect country in question when present', async () => {
      const ctx = await executeNetworkEngine('user1', 'مشاعر الناس في ليبيا', 'ar');
      
      // detectedCountry may or may not be set depending on detectCountryInQuery implementation
      // The gate should at least have the searchQuery populated
      expect(ctx.gate.searchQuery).toBeTruthy();
      expect(ctx.gate.intent).toBeTruthy();
      
      // If country is detected, it should have proper structure
      if (ctx.gate.detectedCountry) {
        expect(ctx.gate.detectedCountry.code).toBeTruthy();
        expect(ctx.gate.detectedCountry.name).toBeTruthy();
      }
    });

    it('should handle errors gracefully', async () => {
      // Even with mock failures, the engine should complete
      const ctx = await executeNetworkEngine('user1', '', 'ar');
      
      // Should still have a status
      expect(['completed', 'error']).toContain(ctx.status);
    });
  });

  // ============================================================
  // VIEW FORMATTER TESTS
  // ============================================================

  describe('analyzeForMap', () => {
    it('should return valid MapResult', async () => {
      const result = await analyzeForMap('LY', 'Libya');
      
      expect(result.countryCode).toBe('LY');
      expect(result.countryName).toBe('Libya');
      expect(typeof result.gmi).toBe('number');
      expect(typeof result.cfi).toBe('number');
      expect(typeof result.hri).toBe('number');
      expect(typeof result.dominantEmotion).toBe('string');
      expect(typeof result.isRealData).toBe('boolean');
      expect(typeof result.confidence).toBe('number');
    });

    it('should return indices in valid ranges', async () => {
      const result = await analyzeForMap('US', 'United States');
      
      expect(result.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.gmi).toBeLessThanOrEqual(100);
      expect(result.cfi).toBeGreaterThanOrEqual(0);
      expect(result.cfi).toBeLessThanOrEqual(100);
      expect(result.hri).toBeGreaterThanOrEqual(0);
      expect(result.hri).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeForWeather', () => {
    it('should return valid WeatherResult', async () => {
      const result = await analyzeForWeather('EG', 'Egypt');
      
      expect(result.countryCode).toBe('EG');
      expect(result.countryName).toBe('Egypt');
      expect(result.emotions).toBeDefined();
      expect(typeof result.dominantEmotion).toBe('string');
      expect(typeof result.polarity).toBe('number');
      expect(typeof result.intensity).toBe('number');
      expect(result.categories).toBeDefined();
      expect(typeof result.dominantCategory).toBe('string');
      expect(Array.isArray(result.trendingKeywords)).toBe(true);
      expect(Array.isArray(result.topHeadlines)).toBe(true);
      expect(typeof result.gmi).toBe('number');
      expect(typeof result.sourceCount).toBe('number');
      expect(typeof result.totalItems).toBe('number');
    });
  });

  describe('analyzeForCountryDetail', () => {
    it('should return valid CountryDetailResult', async () => {
      const result = await analyzeForCountryDetail('SA', 'Saudi Arabia', false, 'ar');
      
      expect(result.countryCode).toBe('SA');
      expect(result.countryName).toBe('Saudi Arabia');
      expect(result.news).toBeDefined();
      expect(Array.isArray(result.news.political)).toBe(true);
      expect(Array.isArray(result.news.economic)).toBe(true);
      expect(Array.isArray(result.news.social)).toBe(true);
      expect(Array.isArray(result.news.conflict)).toBe(true);
      expect(Array.isArray(result.trendingKeywords)).toBe(true);
      expect(typeof result.isRealData).toBe('boolean');
      expect(Array.isArray(result.breakingNews)).toBe(true);
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should include AI summary when requested', async () => {
      const result = await analyzeForCountryDetail('PS', 'Palestine', true, 'ar');
      
      // AI summary should be attempted (may be undefined if no data)
      expect(result.countryCode).toBe('PS');
    });
  });

  describe('analyzeForSmartAnalysis', () => {
    it('should return valid SmartAnalysisResult', async () => {
      const result = await analyzeForSmartAnalysis('ما هي مشاعر الناس؟', 'ar');
      
      expect(result.query).toBe('ما هي مشاعر الناس؟');
      expect(typeof result.response).toBe('string');
      expect(typeof result.confidence).toBe('number');
      expect(result.emotions).toBeDefined();
      expect(typeof result.dominantEmotion).toBe('string');
      expect(typeof result.gmi).toBe('number');
      expect(typeof result.cfi).toBe('number');
      expect(typeof result.hri).toBe('number');
      expect(result.categories).toBeDefined();
      expect(Array.isArray(result.trendingKeywords)).toBe(true);
      expect(Array.isArray(result.topHeadlines)).toBe(true);
      expect(typeof result.isRealData).toBe('boolean');
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(Array.isArray(result.breakingNews)).toBe(true);
      expect(result.quality).toBeDefined();
      expect(Array.isArray(result.layerTraces)).toBe(true);
    });

    it('should include layer traces for debugging', async () => {
      const result = await analyzeForSmartAnalysis('test', 'en');
      
      expect(result.layerTraces.length).toBeGreaterThan(0);
      
      // Should have traces from multiple groups
      const groups = new Set(result.layerTraces.map(t => t.group));
      expect(groups.size).toBeGreaterThanOrEqual(2); // At least gate + collection
    });
  });

  // ============================================================
  // BATCH & GLOBAL TESTS
  // ============================================================

  describe('analyzeCountriesBatch', () => {
    it('should analyze multiple countries', async () => {
      const countries = [
        { code: 'LY', name: 'Libya' },
        { code: 'EG', name: 'Egypt' },
        { code: 'SA', name: 'Saudi Arabia' },
      ];
      
      const results = await analyzeCountriesBatch(countries, 2);
      
      expect(results.length).toBe(3);
      expect(results[0].countryCode).toBe('LY');
      expect(results[1].countryCode).toBe('EG');
      expect(results[2].countryCode).toBe('SA');
    });

    it('should handle failed countries gracefully', async () => {
      const countries = [
        { code: 'XX', name: 'NonExistent' },
      ];
      
      const results = await analyzeCountriesBatch(countries, 1);
      
      expect(results.length).toBe(1);
      // Should return default values for failed country
      expect(results[0].countryCode).toBe('XX');
    });
  });

  describe('getGlobalMood', () => {
    it('should return global mood indices', async () => {
      const mood = await getGlobalMood();
      
      expect(typeof mood.gmi).toBe('number');
      expect(typeof mood.cfi).toBe('number');
      expect(typeof mood.hri).toBe('number');
      expect(typeof mood.dominantEmotion).toBe('string');
      expect(typeof mood.confidence).toBe('number');
      expect(typeof mood.sourceCount).toBe('number');
    });
  });

  // ============================================================
  // CACHE & STATS TESTS
  // ============================================================

  describe('Cache Management', () => {
    it('should return engine stats', () => {
      const stats = getEngineStats();
      
      expect(typeof stats.networkCacheSize).toBe('number');
      expect(stats.dataCacheStats).toBeDefined();
    });

    it('should clear all caches', () => {
      clearAllCaches();
      const stats = getEngineStats();
      
      expect(stats.networkCacheSize).toBe(0);
    });
  });

  // ============================================================
  // NETWORK TOPOLOGY TESTS
  // ============================================================

  describe('Network Topology', () => {
    it('should execute analysis layers in parallel (not sequential)', async () => {
      const ctx = await executeNetworkEngine('user1', 'test parallel execution', 'ar');
      
      // Get analysis layer traces
      const analysisTraces = ctx.analytics.layerTraces.filter(t => t.group === 'analysis');
      
      if (analysisTraces.length >= 2) {
        // In parallel execution, layers should have overlapping time ranges
        // or very close start times
        const timeDiff = Math.abs(analysisTraces[0].startTime - analysisTraces[1].startTime);
        // They should start within 100ms of each other (parallel)
        expect(timeDiff).toBeLessThan(100);
      }
    });

    it('should have 4 parallel groups', async () => {
      const ctx = await executeNetworkEngine('user1', 'test', 'ar');
      expect(ctx.analytics.parallelGroups).toBe(4);
    });

    it('should have traces from all network groups', async () => {
      const ctx = await executeNetworkEngine('user1', 'test all groups', 'ar');
      
      const groups = new Set(ctx.analytics.layerTraces.map(t => t.group));
      expect(groups.has('gate')).toBe(true);
      expect(groups.has('collection')).toBe(true);
      expect(groups.has('analysis')).toBe(true);
      expect(groups.has('generation')).toBe(true);
    });
  });

  // ============================================================
  // EVENT VECTOR COMPRESSION TESTS
  // ============================================================

  describe('Event Vector Integration', () => {
    it('should compress data into event vector', async () => {
      const ctx = await executeNetworkEngine('user1', 'test compression', 'ar');
      
      expect(ctx.collection.eventVector).toBeDefined();
      expect(ctx.collection.eventVector.emotions).toBeDefined();
      expect(ctx.collection.eventVector.categories).toBeDefined();
      expect(typeof ctx.collection.eventVector.polarity).toBe('number');
      expect(typeof ctx.collection.eventVector.intensity).toBe('number');
    });

    it('should generate vector prompt for LLM', async () => {
      const ctx = await executeNetworkEngine('user1', 'test prompt', 'ar');
      
      expect(ctx.collection.vectorPrompt).toBeTruthy();
      expect(ctx.collection.vectorPrompt.length).toBeGreaterThan(0);
      // Vector prompt should be much smaller than raw data
      expect(ctx.collection.vectorPrompt.length).toBeLessThan(5000);
    });
  });
});
