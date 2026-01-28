import { describe, it, expect } from 'vitest';
import { analyzeHeadline, calculateIndices, generateMockHistoricalData } from './emotionAnalyzer';

describe('Emotion Analyzer', () => {
  describe('analyzeHeadline', () => {
    it('should analyze a positive headline', () => {
      const result = analyzeHeadline('Scientists discover breakthrough in renewable energy technology');
      
      expect(result).toHaveProperty('headline');
      expect(result).toHaveProperty('emotions');
      expect(result).toHaveProperty('dominantEmotion');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('model');
      
      expect(result.emotions).toHaveProperty('joy');
      expect(result.emotions).toHaveProperty('fear');
      expect(result.emotions).toHaveProperty('anger');
      expect(result.emotions).toHaveProperty('sadness');
      expect(result.emotions).toHaveProperty('hope');
      expect(result.emotions).toHaveProperty('curiosity');
    });

    it('should return emotion scores between 0 and 100', () => {
      const result = analyzeHeadline('Breaking news: market crash concerns investors');
      
      Object.values(result.emotions).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('should identify a dominant emotion', () => {
      const result = analyzeHeadline('Tragedy strikes as disaster unfolds');
      
      expect(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']).toContain(
        result.dominantEmotion
      );
    });

    it('should have confidence score between 0 and 100', () => {
      const result = analyzeHeadline('Test headline');
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should detect fear in negative headlines', () => {
      const result = analyzeHeadline('Global crisis warning issued by experts');
      
      expect(result.emotions.fear).toBeGreaterThan(0);
    });

    it('should detect hope in positive headlines', () => {
      const result = analyzeHeadline('Recovery and renewal bring new opportunities');
      
      expect(result.emotions.hope).toBeGreaterThan(0);
    });
  });

  describe('calculateIndices', () => {
    it('should calculate indices from emotion analyses', () => {
      const analyses = [
        analyzeHeadline('Positive news about growth'),
        analyzeHeadline('Concerns about market decline'),
      ];

      const indices = calculateIndices(analyses);

      expect(indices).toHaveProperty('gmi');
      expect(indices).toHaveProperty('cfi');
      expect(indices).toHaveProperty('hri');
      expect(indices).toHaveProperty('confidence');
    });

    it('should return GMI between -100 and 100', () => {
      const analyses = [analyzeHeadline('Test headline')];
      const indices = calculateIndices(analyses);

      expect(indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(indices.gmi).toBeLessThanOrEqual(100);
    });

    it('should return CFI between 0 and 100', () => {
      const analyses = [analyzeHeadline('Test headline')];
      const indices = calculateIndices(analyses);

      expect(indices.cfi).toBeGreaterThanOrEqual(0);
      expect(indices.cfi).toBeLessThanOrEqual(100);
    });

    it('should return HRI between 0 and 100', () => {
      const analyses = [analyzeHeadline('Test headline')];
      const indices = calculateIndices(analyses);

      expect(indices.hri).toBeGreaterThanOrEqual(0);
      expect(indices.hri).toBeLessThanOrEqual(100);
    });

    it('should handle empty analyses array', () => {
      const indices = calculateIndices([]);

      expect(indices.gmi).toBe(0);
      expect(indices.cfi).toBe(50);
      expect(indices.hri).toBe(50);
      expect(indices.confidence).toBe(0);
    });

    it('should calculate higher GMI for positive headlines', () => {
      const positiveAnalyses = [
        analyzeHeadline('Breakthrough success achieved'),
        analyzeHeadline('Victory and prosperity'),
      ];

      const negativeAnalyses = [
        analyzeHeadline('Crisis and disaster'),
        analyzeHeadline('Tragedy unfolds'),
      ];

      const positiveIndices = calculateIndices(positiveAnalyses);
      const negativeIndices = calculateIndices(negativeAnalyses);

      expect(positiveIndices.gmi).toBeGreaterThan(negativeIndices.gmi);
    });
  });

  describe('generateMockHistoricalData', () => {
    it('should generate historical data for specified hours', () => {
      const data = generateMockHistoricalData(24);

      expect(data.length).toBe(25); // 0 to 24 inclusive
    });

    it('should generate data with valid indices', () => {
      const data = generateMockHistoricalData(6);

      data.forEach((item) => {
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('gmi');
        expect(item).toHaveProperty('cfi');
        expect(item).toHaveProperty('hri');

        expect(item.gmi).toBeGreaterThanOrEqual(-100);
        expect(item.gmi).toBeLessThanOrEqual(100);
        expect(item.cfi).toBeGreaterThanOrEqual(0);
        expect(item.cfi).toBeLessThanOrEqual(100);
        expect(item.hri).toBeGreaterThanOrEqual(0);
        expect(item.hri).toBeLessThanOrEqual(100);
      });
    });

    it('should generate timestamps in ascending order', () => {
      const data = generateMockHistoricalData(12);

      for (let i = 1; i < data.length; i++) {
        expect(data[i].timestamp.getTime()).toBeGreaterThanOrEqual(data[i - 1].timestamp.getTime());
      }
    });
  });
});
