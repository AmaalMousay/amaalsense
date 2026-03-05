/**
 * Tests for Unified Analysis Engine + Event Vector Engine
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEventVector, eventVectorToPrompt, vectorToMapIndices, estimateTokens } from './eventVectorEngine';
import type { CollectedData, RawDataItem } from './unifiedDataCollector';

// ============================================================
// TEST DATA
// ============================================================

function createMockItem(overrides: Partial<RawDataItem> = {}): RawDataItem {
  return {
    id: `test_${Date.now()}_${Math.random()}`,
    title: 'Test news headline about economy',
    description: 'A detailed description about the economic situation',
    source: 'Test Source',
    sourceType: 'news',
    platform: 'google_rss',
    url: 'https://example.com/news',
    publishedAt: new Date().toISOString(),
    language: 'en',
    ...overrides,
  };
}

function createMockCollectedData(items?: RawDataItem[]): CollectedData {
  const defaultItems = items || [
    createMockItem({ title: 'War breaks out in region causing fear', platform: 'google_rss' }),
    createMockItem({ title: 'Economy shows growth and recovery', platform: 'newsapi' }),
    createMockItem({ title: 'Election results bring hope for change', platform: 'gnews' }),
    createMockItem({ title: 'Technology innovation drives progress', platform: 'reddit', sourceType: 'social' }),
    createMockItem({ title: 'Climate crisis threatens coastal cities', platform: 'mastodon', sourceType: 'social' }),
  ];
  
  return {
    items: defaultItems,
    sources: [...new Set(defaultItems.map(i => i.platform))],
    sourceCount: new Set(defaultItems.map(i => i.platform)).size,
    fetchedAt: Date.now(),
    query: 'test query',
    queryType: 'topic',
  };
}

// ============================================================
// EVENT VECTOR ENGINE TESTS
// ============================================================

describe('EventVectorEngine', () => {
  describe('createEventVector', () => {
    it('should create a valid EventVector from CollectedData', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      expect(vector).toBeDefined();
      expect(vector.query).toBe('test query');
      expect(vector.queryType).toBe('topic');
      expect(vector.totalItems).toBe(5);
      expect(vector.timestamp).toBeGreaterThan(0);
    });

    it('should calculate emotion scores between 0 and 1', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      for (const [emotion, score] of Object.entries(vector.emotions)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });

    it('should identify dominant emotion', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      expect(vector.dominantEmotion).toBeDefined();
      expect(typeof vector.dominantEmotion).toBe('string');
      expect(vector.dominantEmotion.length).toBeGreaterThan(0);
    });

    it('should calculate polarity between -1 and 1', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      expect(vector.polarity).toBeGreaterThanOrEqual(-1);
      expect(vector.polarity).toBeLessThanOrEqual(1);
    });

    it('should calculate intensity between 0 and 1', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      expect(vector.intensity).toBeGreaterThanOrEqual(0);
      expect(vector.intensity).toBeLessThanOrEqual(1);
    });

    it('should categorize items correctly', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      // Categories should be normalized (0-1)
      for (const [category, score] of Object.entries(vector.categories)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });

    it('should extract trending keywords', () => {
      const items = [
        createMockItem({ title: 'Economy growth in China today' }),
        createMockItem({ title: 'China economy shows strong growth' }),
        createMockItem({ title: 'Growth expected in Asian markets' }),
      ];
      const data = createMockCollectedData(items);
      const vector = createEventVector(data);
      
      expect(vector.trendingKeywords).toBeDefined();
      expect(Array.isArray(vector.trendingKeywords)).toBe(true);
    });

    it('should limit top headlines to 8', () => {
      const items = Array.from({ length: 15 }, (_, i) =>
        createMockItem({ title: `News headline number ${i + 1}` })
      );
      const data = createMockCollectedData(items);
      const vector = createEventVector(data);
      
      expect(vector.topHeadlines.length).toBeLessThanOrEqual(8);
    });

    it('should track source breakdown', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      
      expect(vector.sourceBreakdown).toBeDefined();
      expect(Object.keys(vector.sourceBreakdown).length).toBeGreaterThan(0);
    });

    it('should handle empty data gracefully', () => {
      const data = createMockCollectedData([]);
      const vector = createEventVector(data);
      
      expect(vector.totalItems).toBe(0);
      expect(vector.topHeadlines).toHaveLength(0);
      expect(vector.trendingKeywords).toHaveLength(0);
    });

    it('should detect conflict category for war-related news', () => {
      const items = [
        createMockItem({ title: 'Military attack on civilian areas' }),
        createMockItem({ title: 'War continues with missile strikes' }),
        createMockItem({ title: 'Ceasefire negotiations fail again' }),
      ];
      const data = createMockCollectedData(items);
      const vector = createEventVector(data);
      
      expect(vector.categories.conflict).toBeGreaterThan(0);
    });

    it('should detect economic category for financial news', () => {
      const items = [
        createMockItem({ title: 'Stock market reaches new high' }),
        createMockItem({ title: 'Inflation rates drop significantly' }),
        createMockItem({ title: 'GDP growth exceeds expectations' }),
      ];
      const data = createMockCollectedData(items);
      const vector = createEventVector(data);
      
      expect(vector.categories.economic).toBeGreaterThan(0);
    });
  });

  describe('eventVectorToPrompt', () => {
    it('should generate Arabic prompt', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const prompt = eventVectorToPrompt(vector, 'ar');
      
      expect(prompt).toContain('بيانات تحليل المشاعر المضغوطة');
      expect(prompt).toContain('test query');
    });

    it('should generate English prompt', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const prompt = eventVectorToPrompt(vector, 'en');
      
      expect(prompt).toContain('Compressed Sentiment Analysis Data');
      expect(prompt).toContain('test query');
    });

    it('should be significantly shorter than raw data', () => {
      const items = Array.from({ length: 20 }, (_, i) =>
        createMockItem({
          title: `Detailed news headline about important topic number ${i + 1}`,
          description: `This is a very long description that would normally take many tokens to process. It contains detailed information about the topic and various perspectives from different sources. The analysis would be comprehensive and thorough.`,
        })
      );
      const data = createMockCollectedData(items);
      const vector = createEventVector(data);
      const prompt = eventVectorToPrompt(vector);
      
      // Raw data would be ~4000+ chars, prompt should be <2000
      const rawDataSize = items.reduce((sum, item) => sum + item.title.length + item.description.length, 0);
      expect(prompt.length).toBeLessThan(rawDataSize);
    });
  });

  describe('vectorToMapIndices', () => {
    it('should return GMI between -100 and 100', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const indices = vectorToMapIndices(vector);
      
      expect(indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(indices.gmi).toBeLessThanOrEqual(100);
    });

    it('should return CFI between 0 and 100', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const indices = vectorToMapIndices(vector);
      
      expect(indices.cfi).toBeGreaterThanOrEqual(0);
      expect(indices.cfi).toBeLessThanOrEqual(100);
    });

    it('should return HRI between 0 and 100', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const indices = vectorToMapIndices(vector);
      
      expect(indices.hri).toBeGreaterThanOrEqual(0);
      expect(indices.hri).toBeLessThanOrEqual(100);
    });

    it('should mark as real data when items exist', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const indices = vectorToMapIndices(vector);
      
      expect(indices.isRealData).toBe(true);
    });

    it('should mark as not real data when no items', () => {
      const data = createMockCollectedData([]);
      const vector = createEventVector(data);
      const indices = vectorToMapIndices(vector);
      
      expect(indices.isRealData).toBe(false);
    });
  });

  describe('estimateTokens', () => {
    it('should estimate tokens for a vector', () => {
      const data = createMockCollectedData();
      const vector = createEventVector(data);
      const tokens = estimateTokens(vector);
      
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(2000); // Should be well under LLM limits
    });
  });
});

// ============================================================
// UNIFIED DATA COLLECTOR TESTS
// ============================================================

describe('UnifiedDataCollector', () => {
  describe('Cache Management', () => {
    it('should export getCacheStats function', async () => {
      const { getCacheStats } = await import('./unifiedDataCollector');
      const stats = getCacheStats();
      
      expect(stats).toBeDefined();
      expect(typeof stats.entries).toBe('number');
      expect(typeof stats.oldestAge).toBe('number');
    });

    it('should export clearCache function', async () => {
      const { clearCache, getCacheStats } = await import('./unifiedDataCollector');
      clearCache();
      const stats = getCacheStats();
      
      expect(stats.entries).toBe(0);
    });
  });

  describe('RawDataItem type', () => {
    it('should have correct structure', () => {
      const item: RawDataItem = {
        id: 'test_1',
        title: 'Test',
        description: 'Test desc',
        source: 'Test Source',
        sourceType: 'news',
        platform: 'google_rss',
        url: 'https://example.com',
        publishedAt: new Date().toISOString(),
        language: 'en',
      };
      
      expect(item.id).toBeDefined();
      expect(item.sourceType).toBe('news');
      expect(item.platform).toBe('google_rss');
    });
  });
});

// ============================================================
// UNIFIED ANALYSIS ENGINE TESTS (unit tests, no API calls)
// ============================================================

describe('UnifiedAnalysisEngine', () => {
  it('should export analyzeForMap function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.analyzeForMap).toBe('function');
  });

  it('should export analyzeForWeather function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.analyzeForWeather).toBe('function');
  });

  it('should export analyzeForCountryDetail function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.analyzeForCountryDetail).toBe('function');
  });

  it('should export analyzeForSmartAnalysis function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.analyzeForSmartAnalysis).toBe('function');
  });

  it('should export getGlobalMood function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.getGlobalMood).toBe('function');
  });

  it('should export analyzeCountriesBatch function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.analyzeCountriesBatch).toBe('function');
  });

  it('should export getEngineStats function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    const stats = engine.getEngineStats();
    expect(stats).toBeDefined();
    expect(typeof stats.analysisCacheSize).toBe('number');
  });

  it('should export clearAllCaches function', async () => {
    const engine = await import('./unifiedAnalysisEngine');
    expect(typeof engine.clearAllCaches).toBe('function');
    engine.clearAllCaches(); // Should not throw
  });
});
