import { describe, it, expect } from 'vitest';
import { calculateDCFTIndices, DCFTInput } from './dcftCalculationEngine';
import { analyzeTemporalTrends, TemporalDataPoint } from './temporalAnalysisEngine';
import { generateSourceAttribution, createSourceInfo } from './sourceAttributionSystem';
import { getCulturallyAwareInterpretation, getLanguageContext } from './multiLanguageSupport';

describe('Integration: All 4 Systems', () => {
  describe('DCFT + Temporal + Source + Language', () => {
    it('should calculate DCFT indices from emotion vectors', () => {
      const input: DCFTInput = {
        emotionVectors: [
          { joy: 0.6, fear: 0.3, anger: 0.2, sadness: 0.1, hope: 0.7, curiosity: 0.5, trust: 0.6, surprise: 0.3 },
          { joy: 0.5, fear: 0.4, anger: 0.3, sadness: 0.2, hope: 0.6, curiosity: 0.4, trust: 0.5, surprise: 0.2 },
        ],
        timestamps: [new Date(), new Date()],
        credibilityScores: [0.9, 0.8],
        culturalContext: 'MENA',
        topic: 'test',
        region: 'LY',
      };

      const result = calculateDCFTIndices(input);

      expect(result.gmi).toBeDefined();
      expect(result.cfi).toBeDefined();
      expect(result.hri).toBeDefined();
      expect(result.aci).toBeDefined();
      expect(result.sdi).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should analyze temporal trends', () => {
      const dataPoints: TemporalDataPoint[] = [
        {
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          gmi: 30,
          cfi: 60,
          hri: 40,
          aci: 50,
          sdi: 45,
          confidence: 0.8,
          dataCount: 10,
        },
        {
          timestamp: new Date(),
          gmi: 50,
          cfi: 40,
          hri: 60,
          aci: 30,
          sdi: 25,
          confidence: 0.85,
          dataCount: 15,
        },
      ];

      const result = analyzeTemporalTrends(dataPoints);

      expect(result.trends.gmi.trend).toBe('increasing');
      expect(result.trends.cfi.trend).toBe('decreasing');
      expect(result.trends.hri.trend).toBe('increasing');
      expect(result.patterns.length).toBeGreaterThan(0);
      expect(result.insights.length).toBeGreaterThan(0);
    });

    it('should generate source attribution', () => {
      const sources = [
        createSourceInfo('Reuters', 'https://reuters.com', 0.95, 5),
        createSourceInfo('BBC', 'https://bbc.com', 0.9, 3),
        createSourceInfo('Twitter', 'https://twitter.com', 0.4, 10),
      ];

      const attribution = generateSourceAttribution(
        sources,
        [],
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
      );

      expect(attribution.sources.length).toBe(3);
      expect(attribution.totalArticles).toBe(18);
      expect(attribution.averageCredibility).toBeGreaterThan(0);
      expect(attribution.disclaimer).toContain('credibility');
    });

    it('should provide culturally-aware interpretation', () => {
      const arInterpretation = getCulturallyAwareInterpretation(50, 60, 40, 'MENA', 'ar');
      const enInterpretation = getCulturallyAwareInterpretation(50, 60, 40, 'MENA', 'en');

      expect(arInterpretation.length).toBeGreaterThan(0);
      expect(enInterpretation.length).toBeGreaterThan(0);
      expect(arInterpretation).toMatch(/المزاج|الخوف|الأمل/);
      expect(enInterpretation).toMatch(/mood|fear|hope/);
    });

    it('should get language context', () => {
      const arContext = getLanguageContext('ar', 'MENA');
      const enContext = getLanguageContext('en', 'Europe');

      expect(arContext.language).toBe('ar');
      expect(arContext.culturalRegion).toBe('MENA');
      expect(enContext.language).toBe('en');
      expect(enContext.culturalRegion).toBe('Europe');
    });

    it('should handle all systems together', () => {
      // Simulate a complete analysis flow
      const dcftInput: DCFTInput = {
        emotionVectors: [
          { joy: 0.6, fear: 0.3, anger: 0.2, sadness: 0.1, hope: 0.7, curiosity: 0.5, trust: 0.6, surprise: 0.3 },
        ],
        timestamps: [new Date()],
        credibilityScores: [0.85],
        culturalContext: 'MENA',
        topic: 'Libya Politics',
        region: 'LY',
      };

      const dcftResult = calculateDCFTIndices(dcftInput);
      const temporalData: TemporalDataPoint[] = [{
        timestamp: new Date(),
        gmi: dcftResult.gmi,
        cfi: dcftResult.cfi,
        hri: dcftResult.hri,
        aci: dcftResult.aci,
        sdi: dcftResult.sdi,
        confidence: dcftResult.confidence,
        dataCount: 1,
      }];

      const temporalResult = analyzeTemporalTrends(temporalData);
      const sources = [createSourceInfo('Al Jazeera', 'https://aljazeera.com', 0.85, 5)];
      const attribution = generateSourceAttribution(sources, [], new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
      const interpretation = getCulturallyAwareInterpretation(dcftResult.gmi, dcftResult.cfi, dcftResult.hri, 'MENA', 'ar');

      // Verify all systems produced output
      expect(dcftResult).toBeDefined();
      expect(temporalResult).toBeDefined();
      expect(attribution).toBeDefined();
      expect(interpretation).toBeDefined();
      expect(interpretation.length).toBeGreaterThan(0);
    });
  });
});
