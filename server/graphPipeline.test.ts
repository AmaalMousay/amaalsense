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
      const result = await topicEngine('Trump announces new policy on trade');
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
      expect(result.topicConfidence).toBe(0.5);
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
      expect(result.regionConfidence).toBe(0.8);
    });

    it('should detect UAE', async () => {
      const result = await regionEngine('Events in UAE');
      expect(result.region).toBe('UAE');
      expect(result.regionConfidence).toBe(0.8);
    });

    it('should default to Global', async () => {
      const result = await regionEngine('Random text');
      expect(result.region).toBe('Global');
      expect(result.regionConfidence).toBe(0.5);
    });

    it('should handle Middle East region', async () => {
      const result = await regionEngine('Middle East crisis');
      expect(result.region).toBe('Middle East');
      expect(result.regionConfidence).toBe(0.8);
    });
  });

  describe('Impact Engine', () => {
    it('should detect high impact for crisis', async () => {
      const result = await impactEngine('Critical emergency situation');
      expect(result.impactScore).toBeGreaterThan(0.7);
      expect(result.severity).toBe('high');
    });

    it('should detect medium impact for normal text', async () => {
      const result = await impactEngine('Regular news update');
      expect(result.impactScore).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(result.severity);
    });

    it('should detect positive impact', async () => {
      const result = await impactEngine('Success and growth achieved');
      expect(result.impactScore).toBeGreaterThan(0.5);
      expect(result.severity).toBe('medium');
    });

    it('should detect low severity for short text', async () => {
      const result = await impactEngine('Hi');
      expect(result.severity).toBe('low');
      expect(result.impactScore).toBeLessThan(0.5);
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

    it('should provide defaults for missing fields', async () => {
      const eventVector = await fusionEngine('test', []);

      expect(eventVector.topic).toBe('General');
      expect(eventVector.topicConfidence).toBe(0.5);
      expect(eventVector.dominantEmotion).toBe('neutral');
      expect(eventVector.region).toBe('Global');
      expect(eventVector.impactScore).toBe(0.5);
      expect(eventVector.severity).toBe('medium');
    });

    it('should create valid EventVector structure', async () => {
      const eventVector = await fusionEngine('test', []);

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

  describe('Graph Pipeline Orchestration', () => {
    it('should run all engines in parallel', async () => {
      const startTime = Date.now();
      const eventVector = await graphPipeline('Trump announces new policy');
      const duration = Date.now() - startTime;

      // Should complete reasonably fast due to parallel execution
      expect(duration).toBeLessThan(5000);
      expect(eventVector).toBeDefined();
      expect(eventVector.topic).toBeDefined();
      expect(eventVector.emotions).toBeDefined();
      expect(eventVector.region).toBeDefined();
      expect(eventVector.impactScore).toBeDefined();
    });

    it('should return valid EventVector', async () => {
      const eventVector = await graphPipeline('Test input');

      expect(eventVector.topic).toBeDefined();
      expect(eventVector.topicConfidence).toBeGreaterThanOrEqual(0);
      expect(eventVector.topicConfidence).toBeLessThanOrEqual(1);
      expect(eventVector.dominantEmotion).toBeDefined();
      expect(eventVector.region).toBeDefined();
      expect(eventVector.impactScore).toBeGreaterThanOrEqual(0);
      expect(eventVector.impactScore).toBeLessThanOrEqual(1);
      expect(['low', 'medium', 'high']).toContain(eventVector.severity);
    });

    it('should handle long input', async () => {
      const longInput = 'Test '.repeat(500);
      const eventVector = await graphPipeline(longInput);

      expect(eventVector).toBeDefined();
      expect(eventVector.topic).toBeDefined();
    });

    it('should handle special characters', async () => {
      const specialInput = 'Trump @#$% news & updates!';
      const eventVector = await graphPipeline(specialInput);

      expect(eventVector).toBeDefined();
      expect(eventVector.topic).toBeDefined();
    });

    it('should handle Arabic text', async () => {
      const arabicInput = 'أخبار عن السياسة والاقتصاد';
      const eventVector = await graphPipeline(arabicInput);

      expect(eventVector).toBeDefined();
      expect(eventVector.topic).toBeDefined();
    });

    it('should return consistent structure', async () => {
      const inputs = [
        'Politics news',
        'Economy update',
        'Random text',
      ];

      const results = await Promise.all(
        inputs.map(input => graphPipeline(input))
      );

      results.forEach(eventVector => {
        expect(eventVector).toHaveProperty('topic');
        expect(eventVector).toHaveProperty('emotions');
        expect(eventVector).toHaveProperty('region');
        expect(eventVector).toHaveProperty('impactScore');
        expect(eventVector).toHaveProperty('severity');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle engine errors gracefully', async () => {
      const eventVector = await graphPipeline('test');
      expect(eventVector).toBeDefined();
      expect(eventVector.topic).toBeDefined();
    });

    it('should never return undefined EventVector', async () => {
      const eventVector = await graphPipeline('any input');
      expect(eventVector).not.toBeUndefined();
      expect(eventVector).not.toBeNull();
    });

    it('should have valid timestamps', async () => {
      const eventVector = await graphPipeline('test');
      expect(eventVector.timestamp).toBeInstanceOf(Date);
      expect(eventVector.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should generate unique sourceIds', async () => {
      const ev1 = await graphPipeline('test1');
      const ev2 = await graphPipeline('test2');
      expect(ev1.sourceId).not.toBe(ev2.sourceId);
    });
  });

  describe('Performance Characteristics', () => {
    it('should process multiple inputs efficiently', async () => {
      const inputs = Array(5).fill('Test input');
      const startTime = Date.now();

      await Promise.all(inputs.map(input => graphPipeline(input)));

      const duration = Date.now() - startTime;
      // Should complete in reasonable time
      expect(duration).toBeLessThan(10000);
    });

    it('should maintain consistent output quality', async () => {
      const results = await Promise.all(
        Array(3).fill('Test').map(input => graphPipeline(input))
      );

      results.forEach(result => {
        expect(result.topicConfidence).toBeGreaterThanOrEqual(0);
        expect(result.regionConfidence).toBeGreaterThanOrEqual(0);
        expect(result.impactScore).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should not modify input', async () => {
      const input = 'Original input text';
      const inputCopy = input;

      await graphPipeline(input);

      expect(input).toBe(inputCopy);
    });

    it('should preserve emotion values', async () => {
      const eventVector = await graphPipeline('test');

      Object.values(eventVector.emotions).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid confidence scores', async () => {
      const eventVector = await graphPipeline('test');

      expect(eventVector.topicConfidence).toBeGreaterThanOrEqual(0);
      expect(eventVector.topicConfidence).toBeLessThanOrEqual(1);
      expect(eventVector.regionConfidence).toBeGreaterThanOrEqual(0);
      expect(eventVector.regionConfidence).toBeLessThanOrEqual(1);
      expect(eventVector.impactScore).toBeGreaterThanOrEqual(0);
      expect(eventVector.impactScore).toBeLessThanOrEqual(1);
    });
  });
});
