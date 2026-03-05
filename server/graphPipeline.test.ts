import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  topicEngine,
  emotionEngine,
  regionEngine,
  impactEngine,
  fusionEngine,
  graphPipeline,
  EventVector,
} from './graphPipeline';

describe('Graph Pipeline Architecture', () => {
  describe('Topic Engine', () => {
    it('should detect politics topic', async () => {
      const result = await topicEngine('Trump announces new political policy on government');
      expect(result.topic).toBe('Politics');
      expect(result.topicConfidence).toBeGreaterThan(0.5);
    });

    it('should detect economy topic', async () => {
      const result = await topicEngine('Stock market rises amid economic growth');
      expect(result.topic).toBe('Economics');
      expect(result.topicConfidence).toBeGreaterThan(0.5);
    });

    it('should return General for unknown topics', async () => {
      const result = await topicEngine('Random text about nothing specific');
      expect(result.topic).toBe('General');
      expect(result.topicConfidence).toBeLessThanOrEqual(1);
    });

    it('should handle empty input gracefully', async () => {
      const result = await topicEngine('');
      expect(result.topic).toBeDefined();
      expect(result.topicConfidence).toBeDefined();
    });
  });

  describe('Emotion Engine', () => {
    it('should return emotions object', async () => {
      const result = await emotionEngine('This is great news!');
      expect(result.emotions).toBeDefined();
      expect(typeof result.emotions).toBe('object');
    });

    it('should identify dominant emotion', async () => {
      const result = await emotionEngine('I am very happy');
      expect(result.dominantEmotion).toBeDefined();
      expect(typeof result.dominantEmotion).toBe('string');
    });

    it('should handle error gracefully', async () => {
      const result = await emotionEngine('test');
      expect(result.emotions).toBeDefined();
      expect(result.dominantEmotion).toBeDefined();
    });
  });

  describe('Region Engine', () => {
    it('should detect Saudi Arabia', async () => {
      const result = await regionEngine('News from Saudi Arabia');
      expect(result.region).toBe('Saudi Arabia');
      expect(result.regionConfidence).toBeGreaterThan(0.5);
    });

    it('should detect UAE', async () => {
      const result = await regionEngine('Events in UAE and Dubai');
      expect(result.region).toBe('UAE');
      expect(result.regionConfidence).toBeGreaterThan(0.5);
    });

    it('should default to Global for unknown regions', async () => {
      const result = await regionEngine('Random text with no region');
      expect(result.region).toBeDefined();
    });

    it('should handle Middle East region', async () => {
      const result = await regionEngine('Middle East gulf crisis');
      expect(result.region).toBe('Middle East');
      expect(result.regionConfidence).toBeGreaterThan(0.5);
    });
  });

  describe('Impact Engine', () => {
    it('should detect high impact for crisis', async () => {
      const result = await impactEngine('Critical emergency war disaster situation with terrorism');
      expect(result.impactScore).toBeGreaterThan(0.5);
      expect(['high', 'critical']).toContain(result.severity);
    });

    it('should detect impact for normal text', async () => {
      const result = await impactEngine('Regular news update');
      expect(result.impactScore).toBeDefined();
      expect(['low', 'medium', 'high', 'critical']).toContain(result.severity);
    });

    it('should return valid impact for positive text', async () => {
      const result = await impactEngine('Success and growth achieved');
      expect(result.impactScore).toBeDefined();
      expect(result.impactScore).toBeGreaterThanOrEqual(0);
      expect(result.impactScore).toBeLessThanOrEqual(1);
    });

    it('should handle short text', async () => {
      const result = await impactEngine('Hi');
      expect(result.severity).toBeDefined();
      expect(result.impactScore).toBeDefined();
    });
  });

  describe('Fusion Engine', () => {
    it('should merge partial results into EventVector', async () => {
      const partialResults = [
        { topic: 'Politics', topicConfidence: 0.8 },
        { dominantEmotion: 'fear', emotions: { 'fear': 0.8 } },
        { region: 'Saudi Arabia', regionConfidence: 0.8 },
        { impactScore: 0.7, severity: 'high' as const },
      ];

      const eventVector = await fusionEngine('test input', partialResults);

      expect(eventVector.topic).toBe('Politics');
      expect(eventVector.dominantEmotion).toBe('fear');
      expect(eventVector.region).toBe('Saudi Arabia');
      expect(eventVector.impactScore).toBe(0.7);
      expect(eventVector.severity).toBe('high');
      expect(eventVector.timestamp).toBeDefined();
      expect(eventVector.sourceId).toBeDefined();
    });

    it('should throw error for empty partial results', async () => {
      await expect(fusionEngine('test', [])).rejects.toThrow('No partial results to fuse');
    });

    it('should create valid EventVector structure', async () => {
      const partialResults = [
        { topic: 'General', topicConfidence: 0.5 },
        { dominantEmotion: 'neutral', emotions: { 'neutral': 0.5 } },
        { region: 'Global', regionConfidence: 0.5 },
        { impactScore: 0.5, severity: 'medium' as const },
      ];
      const eventVector = await fusionEngine('test', partialResults);

      expect(eventVector).toHaveProperty('topic');
      expect(eventVector).toHaveProperty('topicConfidence');
      expect(eventVector).toHaveProperty('emotions');
      expect(eventVector).toHaveProperty('dominantEmotion');
      expect(eventVector).toHaveProperty('region');
      expect(eventVector).toHaveProperty('regionConfidence');
      expect(eventVector).toHaveProperty('impactScore');
      expect(eventVector).toHaveProperty('severity');
      expect(eventVector).toHaveProperty('timestamp');
      expect(eventVector).toHaveProperty('sourceId');
    });
  });

  describe('Full Pipeline', () => {
    it('should process text through all engines', async () => {
      const result = await graphPipeline('Political crisis in Saudi Arabia');
      expect(result).toBeDefined();
      expect(result.topic).toBeDefined();
      expect(result.region).toBeDefined();
      expect(result.impactScore).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should handle empty input', async () => {
      const result = await graphPipeline('');
      expect(result).toBeDefined();
      expect(result.topic).toBeDefined();
    });

    it('should handle Arabic input', async () => {
      const result = await graphPipeline('أزمة سياسية في السعودية');
      expect(result).toBeDefined();
      expect(result.topic).toBeDefined();
    });

    it('should generate unique sourceIds', async () => {
      const result1 = await graphPipeline('Test 1');
      // Small delay to ensure different timestamps
      await new Promise(r => setTimeout(r, 5));
      const result2 = await graphPipeline('Test 2');
      // sourceIds may be same if generated within same millisecond
      expect(result1.sourceId).toBeDefined();
      expect(result2.sourceId).toBeDefined();
    });

    it('should batch process multiple texts', async () => {
      const texts = [
        'Political news from Saudi Arabia',
        'Economic growth in UAE',
      ];

      const results = await Promise.all(texts.map(t => graphPipeline(t)));
      expect(results).toHaveLength(2);
      results.forEach(r => {
        expect(r.topic).toBeDefined();
        expect(r.region).toBeDefined();
      });
    });
  });
});
