import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  checkForDuplicates,
  registerAnalysis,
  invalidateCache,
  getCacheStats,
  generateTopicSpecificVariations,
  registerTopicKeywords,
  getRegisteredTopics,
} from './deduplicationEngine';

describe('Phase 84: Deduplication Engine - Fix Bug #1', () => {
  beforeEach(() => {
    // Clear cache before each test
    invalidateCache();
  });

  describe('Duplicate Detection', () => {
    it('should detect identical analyses as duplicates', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      // Register first analysis
      registerAnalysis('رؤية 2030', 'SA', indices);
      
      // Check same analysis
      const result = checkForDuplicates('رؤية 2030', 'SA', indices);
      
      expect(result.isDuplicate).toBe(true);
      expect(result.similarity).toBeGreaterThan(0.85);
      expect(result.suggestedAction).toBe('use_cache');
    });

    it('should not detect different analyses as duplicates', () => {
      const indices1 = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      const indices2 = { gmi: -20, cfi: 30, hri: 80, aci: 60, sdi: 40 };
      
      // Register first analysis
      registerAnalysis('رؤية 2030', 'SA', indices1);
      
      // Check different analysis
      const result = checkForDuplicates('الأوضاع الاقتصادية', 'SA', indices2);
      
      expect(result.isDuplicate).toBe(false);
      expect(result.similarity).toBeLessThan(0.85);
      expect(result.suggestedAction).toBe('generate_new');
    });

    it('should detect similar analyses with high similarity score', () => {
      const indices1 = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      const indices2 = { gmi: 12, cfi: 61, hri: 69, aci: 41, sdi: 51 }; // Very similar
      
      registerAnalysis('رؤية 2030', 'SA', indices1);
      const result = checkForDuplicates('رؤية 2030', 'SA', indices2);
      
      expect(result.isDuplicate).toBe(true);
      expect(result.similarity).toBeGreaterThan(0.95);
    });

    it('should skip cache when expiry time is very short', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      registerAnalysis('رؤية 2030', 'SA', indices);
      
      // Check with 0ms expiry (immediate expiration)
      const result = checkForDuplicates('رؤية 2030', 'SA', indices, 0);
      
      expect(result.suggestedAction).toBe('use_cache');
    });
  });

  describe('Cache Management', () => {
    it('should register and retrieve analyses from cache', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      registerAnalysis('رؤية 2030', 'SA', indices);
      const stats = getCacheStats();
      
      expect(stats.totalEntries).toBe(1);
      expect(stats.entries[0].topic).toBe('رؤية 2030');
      expect(stats.entries[0].countryCode).toBe('SA');
    });

    it('should invalidate specific topic/country cache', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      registerAnalysis('رؤية 2030', 'SA', indices);
      registerAnalysis('الأوضاع الاقتصادية', 'SA', indices);
      
      const invalidated = invalidateCache('رؤية 2030', 'SA');
      const stats = getCacheStats();
      
      expect(invalidated).toBe(1);
      expect(stats.totalEntries).toBe(1);
    });

    it('should invalidate all entries for a topic', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      registerAnalysis('رؤية 2030', 'SA', indices);
      registerAnalysis('رؤية 2030', 'EG', indices);
      registerAnalysis('الأوضاع الاقتصادية', 'SA', indices);
      
      const invalidated = invalidateCache('رؤية 2030');
      const stats = getCacheStats();
      
      expect(invalidated).toBe(2);
      expect(stats.totalEntries).toBe(1);
    });

    it('should clear entire cache', () => {
      const indices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      registerAnalysis('رؤية 2030', 'SA', indices);
      registerAnalysis('الأوضاع الاقتصادية', 'EG', indices);
      
      const invalidated = invalidateCache();
      const stats = getCacheStats();
      
      expect(invalidated).toBe(2);
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('Topic-Specific Variations', () => {
    it('should generate different indices for different topics', () => {
      const baseIndices = { gmi: 0, cfi: 60, hri: 50, aci: 50, sdi: 50 };
      
      const vision2030 = generateTopicSpecificVariations('رؤية 2030', baseIndices);
      const economy = generateTopicSpecificVariations('الأوضاع الاقتصادية', baseIndices);
      const security = generateTopicSpecificVariations('الأمن والاستقرار', baseIndices);
      
      // Verify they're different
      expect(vision2030).not.toEqual(economy);
      expect(economy).not.toEqual(security);
      expect(vision2030).not.toEqual(security);
    });

    it('should apply economic topic multipliers correctly', () => {
      const baseIndices = { gmi: 0, cfi: 60, hri: 50, aci: 50, sdi: 50 };
      
      const result = generateTopicSpecificVariations('الأوضاع الاقتصادية', baseIndices);
      
      // Economic topics should increase GMI and decrease CFI
      expect(result.gmi).toBeGreaterThan(baseIndices.gmi);
      expect(result.cfi).toBeLessThan(baseIndices.cfi);
    });

    it('should apply security topic multipliers correctly', () => {
      const baseIndices = { gmi: 0, cfi: 60, hri: 50, aci: 50, sdi: 50 };
      
      const result = generateTopicSpecificVariations('الأمن والاستقرار', baseIndices);
      
      // Security topics should decrease CFI and increase HRI
      expect(result.cfi).toBeLessThan(70);
      expect(result.hri).toBeGreaterThan(baseIndices.hri);
    });

    it('should apply health topic multipliers correctly', () => {
      const baseIndices = { gmi: 0, cfi: 60, hri: 50, aci: 50, sdi: 50 };
      
      const result = generateTopicSpecificVariations('الصحة والوباء', baseIndices);
      
      // Health topics should increase CFI and decrease GMI
      expect(result.cfi).toBeGreaterThan(baseIndices.cfi);
      expect(result.gmi).toBeLessThan(baseIndices.gmi);
    });

    it('should keep indices within valid ranges', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50, aci: 50, sdi: 50 };
      
      const result = generateTopicSpecificVariations('رؤية 2030', baseIndices);
      
      expect(result.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.gmi).toBeLessThanOrEqual(100);
      expect(result.cfi).toBeGreaterThanOrEqual(0);
      expect(result.cfi).toBeLessThanOrEqual(100);
      expect(result.hri).toBeGreaterThanOrEqual(0);
      expect(result.hri).toBeLessThanOrEqual(100);
      expect(result.aci).toBeGreaterThanOrEqual(0);
      expect(result.aci).toBeLessThanOrEqual(100);
      expect(result.sdi).toBeGreaterThanOrEqual(0);
      expect(result.sdi).toBeLessThanOrEqual(100);
    });
  });

  describe('Topic Keywords Management', () => {
    it('should register and retrieve topic keywords', () => {
      const keywords = ['كلمة1', 'كلمة2', 'كلمة3'];
      registerTopicKeywords('موضوع جديد', keywords);
      
      const topics = getRegisteredTopics();
      expect(topics).toContain('موضوع جديد');
    });

    it('should include default topics', () => {
      const topics = getRegisteredTopics();
      
      expect(topics).toContain('رؤية 2030');
      expect(topics).toContain('الأوضاع الاقتصادية');
      expect(topics).toContain('الأمن والاستقرار');
    });
  });

  describe('Real-World Scenario', () => {
    it('should prevent duplicate analysis of same topic in same country', () => {
      const topic = 'رؤية 2030';
      const country = 'SA';
      const indices1 = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      
      // First analysis
      registerAnalysis(topic, country, indices1);
      
      // Second analysis with same indices
      const isDuplicate = checkForDuplicates(topic, country, indices1);
      
      expect(isDuplicate.isDuplicate).toBe(true);
      expect(isDuplicate.suggestedAction).toBe('use_cache');
    });

    it('should allow different analyses for different topics in same country', () => {
      const country = 'SA';
      const indices1 = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      const indices2 = { gmi: -20, cfi: 30, hri: 80, aci: 60, sdi: 40 };
      
      registerAnalysis('رؤية 2030', country, indices1);
      
      // Different topic should not be detected as duplicate
      const isDuplicate = checkForDuplicates('الأوضاع الاقتصادية', country, indices2);
      
      expect(isDuplicate.isDuplicate).toBe(false);
      expect(isDuplicate.suggestedAction).toBe('generate_new');
    });

    it('should allow same topic in different countries with different indices', () => {
      const topic = 'رؤية 2030';
      const indices1 = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };
      const indices2 = { gmi: -15, cfi: 45, hri: 65, aci: 55, sdi: 45 };
      
      registerAnalysis(topic, 'SA', indices1);
      
      // Same topic, different country with different indices
      const isDuplicate = checkForDuplicates(topic, 'EG', indices2);
      
      expect(isDuplicate.isDuplicate).toBe(false);
    });
  });
});
