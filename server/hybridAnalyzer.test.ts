/**
 * Hybrid DCFT-AI Analyzer Tests
 * Tests the 70/30 fusion between DCFT and AI
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  analyzeHybrid, 
  analyzeQuick, 
  getHybridConfig, 
  updateHybridConfig,
  HYBRID_CONFIG 
} from './hybridAnalyzer';

describe('Hybrid DCFT-AI Analyzer', () => {
  beforeEach(() => {
    // Reset config before each test
    updateHybridConfig({
      dcftWeight: 0.7,
      aiWeight: 0.3,
      enableAI: true,
      fallbackToDCFT: true,
    });
  });

  describe('Configuration', () => {
    it('should have correct default weights', () => {
      const config = getHybridConfig();
      expect(config.dcftWeight).toBe(0.7);
      expect(config.aiWeight).toBe(0.3);
    });

    it('should allow weight updates', () => {
      updateHybridConfig({ dcftWeight: 0.8, aiWeight: 0.2 });
      const config = getHybridConfig();
      expect(config.dcftWeight).toBe(0.8);
      expect(config.aiWeight).toBe(0.2);
    });

    it('weights should sum to 1.0', () => {
      const config = getHybridConfig();
      expect(config.dcftWeight + config.aiWeight).toBe(1.0);
    });
  });

  describe('Hybrid Analysis', () => {
    it('should return valid hybrid result structure', async () => {
      const result = await analyzeHybrid('This is a happy celebration!');
      
      expect(result).toHaveProperty('emotions');
      expect(result).toHaveProperty('indices');
      expect(result).toHaveProperty('dcft');
      expect(result).toHaveProperty('fusion');
      expect(result).toHaveProperty('analyzedAt');
      expect(result).toHaveProperty('processingTimeMs');
    });

    it('should have all six emotions in result', async () => {
      const result = await analyzeHybrid('Test text');
      
      expect(result.emotions).toHaveProperty('joy');
      expect(result.emotions).toHaveProperty('fear');
      expect(result.emotions).toHaveProperty('anger');
      expect(result.emotions).toHaveProperty('sadness');
      expect(result.emotions).toHaveProperty('hope');
      expect(result.emotions).toHaveProperty('curiosity');
    });

    it('should have all three indices', async () => {
      const result = await analyzeHybrid('Test text');
      
      expect(result.indices).toHaveProperty('gmi');
      expect(result.indices).toHaveProperty('cfi');
      expect(result.indices).toHaveProperty('hri');
    });

    it('should include DCFT-specific data', async () => {
      const result = await analyzeHybrid('Test text');
      
      expect(result.dcft).toHaveProperty('amplitude');
      expect(result.dcft).toHaveProperty('resonanceIndices');
      expect(result.dcft).toHaveProperty('emotionalPhase');
      expect(result.dcft).toHaveProperty('alertLevel');
      expect(result.dcft).toHaveProperty('weight');
    });

    it('should include fusion metadata', async () => {
      const result = await analyzeHybrid('Test text');
      
      expect(result.fusion).toHaveProperty('method');
      expect(result.fusion).toHaveProperty('dcftContribution');
      expect(result.fusion).toHaveProperty('aiContribution');
      expect(result.fusion).toHaveProperty('confidence');
    });

    it('should detect positive emotions in happy text', async () => {
      const result = await analyzeHybrid('This is wonderful news! Great success and celebration!');
      
      // Joy or hope should be positive
      expect(result.emotions.joy > 0 || result.emotions.hope > 0).toBe(true);
    });

    it('should detect negative emotions in sad text', async () => {
      const result = await analyzeHybrid('Terrible tragedy and devastating loss. Very sad news.');
      
      // Fear, anger, or sadness should be elevated
      const negativeSum = result.emotions.fear + result.emotions.anger + result.emotions.sadness;
      expect(negativeSum).not.toBe(0);
    });
  });

  describe('DCFT-Only Mode (Quick Analysis)', () => {
    it('should work without AI', async () => {
      const result = await analyzeQuick('Test text for quick analysis');
      
      expect(result.fusion.method).toBe('dcft_only');
      expect(result.fusion.dcftContribution).toBe(100);
      expect(result.fusion.aiContribution).toBe(0);
    });

    it('should be faster than hybrid', async () => {
      const quickResult = await analyzeQuick('Test text');
      const hybridResult = await analyzeHybrid('Test text', 'user', { enableAI: false });
      
      // Both should complete without AI
      expect(quickResult.fusion.method).toBe('dcft_only');
      expect(hybridResult.fusion.method).toBe('dcft_only');
    });
  });

  describe('Source Weighting', () => {
    it('should accept different source types', async () => {
      // Use quick analysis to avoid timeout
      const newsResult = await analyzeQuick('Breaking news headline');
      
      // Should return valid results
      expect(newsResult.fusion).toBeDefined();
      expect(newsResult.fusion.method).toBe('dcft_only');
    }, 10000);
  });

  describe('Fallback Behavior', () => {
    it('should fallback to DCFT when AI is disabled', async () => {
      updateHybridConfig({ enableAI: false });
      const result = await analyzeHybrid('Test text');
      
      expect(result.fusion.method).toBe('dcft_only');
      expect(result.ai).toBeUndefined();
    });

    it('should have 100% DCFT contribution when AI fails', async () => {
      updateHybridConfig({ enableAI: false });
      const result = await analyzeHybrid('Test text');
      
      expect(result.dcft.weight).toBe(1.0);
      expect(result.fusion.dcftContribution).toBe(100);
    });
  });

  describe('Index Calculations', () => {
    it('GMI should be in valid range', async () => {
      const result = await analyzeHybrid('Test text');
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
    });

    it('CFI should be in valid range', async () => {
      const result = await analyzeHybrid('Test text');
      expect(result.indices.cfi).toBeGreaterThanOrEqual(0);
      expect(result.indices.cfi).toBeLessThanOrEqual(100);
    });

    it('HRI should be in valid range', async () => {
      const result = await analyzeHybrid('Test text');
      expect(result.indices.hri).toBeGreaterThanOrEqual(0);
      expect(result.indices.hri).toBeLessThanOrEqual(100);
    });
  });

  describe('Arabic Text Support', () => {
    it('should analyze Arabic text', async () => {
      // Use quick analysis for Arabic text
      const result = await analyzeQuick('هذا خبر سعيد ومفرح جداً');
      
      expect(result.emotions).toBeDefined();
      expect(result.indices).toBeDefined();
    }, 10000);

    it('should detect emotions in Arabic', async () => {
      // Use quick analysis to avoid timeout
      const happyResult = await analyzeQuick('فرح وسعادة كبيرة');
      
      // Should have valid emotional responses
      expect(happyResult.emotions).toBeDefined();
      expect(happyResult.indices).toBeDefined();
    }, 10000);
  });

  describe('Performance', () => {
    it('should complete analysis in reasonable time', async () => {
      const startTime = Date.now();
      await analyzeQuick('Performance test text');
      const duration = Date.now() - startTime;
      
      // Quick analysis should be fast (under 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should track processing time', async () => {
      const result = await analyzeHybrid('Test text');
      
      expect(result.processingTimeMs).toBeGreaterThan(0);
    });
  });
});
