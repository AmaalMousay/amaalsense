// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { DCFTEngine, analyzeDCFT, analyzeTextDCFT, analyzeTextsDCFT } from './dcftEngine';

const engine = new DCFTEngine();

describe('DCFT Engine - Complete Test Suite', () => {
  describe('DCFTEngine Class', () => {
    it('should create an instance', () => {
      expect(engine).toBeDefined();
      expect(engine).toBeInstanceOf(DCFTEngine);
    });

    it('should analyze raw digital inputs', async () => {
      const result = await analyzeDCFT([
        { id: 'test-1', content: 'I am very happy today! Great news everywhere.', source: 'social', timestamp: new Date() },
        { id: 'test-2', content: 'The economy is growing and people are optimistic.', source: 'news', timestamp: new Date() }
      ]);
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
      expect(result.indices.gmi).toBeDefined();
      expect(result.indices.cfi).toBeDefined();
      expect(result.indices.hri).toBeDefined();
    });

    it('should analyze single text', async () => {
      const result = await analyzeTextDCFT('People are feeling hopeful about the future.');
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.cfi).toBeGreaterThanOrEqual(0);
      expect(result.indices.hri).toBeGreaterThanOrEqual(0);
    });

    it('should analyze multiple texts', async () => {
      const result = await analyzeTextsDCFT([
        'Great economic growth reported today.',
        'Communities are coming together to help.',
        'New technology breakthroughs announced.'
      ], 'news');
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
      expect(result.indices.gmi).toBeDefined();
    });
  });

  describe('GMI (Global Mood Index) Range', () => {
    it('should return GMI in valid range for positive text', async () => {
      const result = await analyzeTextDCFT('Joy, happiness, and celebration everywhere!');
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
    });

    it('should return GMI in valid range for negative text', async () => {
      const result = await analyzeTextDCFT('Fear, sadness, and despair across the nation.');
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
    });

    it('should return GMI in valid range for neutral text', async () => {
      const result = await analyzeTextDCFT('The weather report for today is partly cloudy.');
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
    });
  });

  describe('CFI (Collective Feeling Index) Range', () => {
    it('should return CFI in valid range', async () => {
      const result = await analyzeTextDCFT('Everyone agrees this is wonderful news.');
      expect(result.indices.cfi).toBeGreaterThanOrEqual(0);
      expect(result.indices.cfi).toBeLessThanOrEqual(100);
    });
  });

  describe('HRI (Human Resilience Index) Range', () => {
    it('should return HRI in valid range', async () => {
      const result = await analyzeTextDCFT('Despite challenges, people remain hopeful and determined.');
      expect(result.indices.hri).toBeGreaterThanOrEqual(0);
      expect(result.indices.hri).toBeLessThanOrEqual(100);
    });
  });

  describe('Performance Tests', () => {
    it('should analyze text in reasonable time', async () => {
      const startTime = performance.now();
      await analyzeTextDCFT('Test performance of the DCFT engine.');
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5 seconds max
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', async () => {
      const result = await analyzeTextDCFT('');
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
    });

    it('should handle very short text', async () => {
      const result = await analyzeTextDCFT('ok');
      expect(result).toBeDefined();
    });

    it('should handle Arabic text', async () => {
      const result = await analyzeTextDCFT('الناس سعداء اليوم والأمل يملأ القلوب');
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
    });

    it('should handle empty array of inputs', async () => {
      const result = await analyzeDCFT([]);
      expect(result).toBeDefined();
    });

    it('should be consistent with same input', async () => {
      const text = 'Consistent test input for DCFT analysis.';
      const result1 = await analyzeTextDCFT(text);
      const result2 = await analyzeTextDCFT(text);
      // Results should be similar (deterministic without LLM)
      expect(Math.abs(result1.indices.gmi - result2.indices.gmi)).toBeLessThan(20);
    });
  });

  describe('Result Structure', () => {
    it('should return complete result structure', async () => {
      const result = await analyzeTextDCFT('Testing the complete result structure.');
      expect(result).toHaveProperty('indices');
      expect(result.indices).toHaveProperty('gmi');
      expect(result.indices).toHaveProperty('cfi');
      expect(result.indices).toHaveProperty('hri');
      expect(result).toHaveProperty('emotions');
      expect(result).toHaveProperty('dominantEmotion');
      expect(result).toHaveProperty('confidence');
      expect(typeof result.indices.gmi).toBe('number');
      expect(typeof result.indices.cfi).toBe('number');
      expect(typeof result.indices.hri).toBe('number');
    });
  });
});
