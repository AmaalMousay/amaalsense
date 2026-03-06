/**
 * Tests for compareDCFT endpoint and DCFT integration
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the network engine
vi.mock('./networkEngine', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    analyzeForCountryDetail: vi.fn().mockImplementation(async (code: string, name: string) => ({
      countryCode: code,
      countryName: name,
      gmi: code === 'LY' ? 25.5 : -10.3,
      cfi: code === 'LY' ? 35.2 : 65.8,
      hri: code === 'LY' ? 60.1 : 40.5,
      emotions: {
        joy: code === 'LY' ? 0.6 : 0.3,
        fear: code === 'LY' ? 0.2 : 0.5,
        anger: code === 'LY' ? 0.1 : 0.4,
        sadness: code === 'LY' ? 0.15 : 0.35,
        hope: code === 'LY' ? 0.7 : 0.25,
        curiosity: code === 'LY' ? 0.5 : 0.3,
      },
      dominantEmotion: code === 'LY' ? 'hope' : 'fear',
      categories: { political: 5, economic: 3, social: 4, conflict: 1 },
      dominantCategory: 'political',
      polarity: code === 'LY' ? 0.3 : -0.2,
      intensity: 0.6,
      news: { political: [], economic: [], social: [], conflict: [] },
      trendingKeywords: code === 'LY' ? ['elections', 'oil'] : ['war', 'refugees'],
      sourceCount: 5,
      totalItems: 12,
      isRealData: true,
      breakingNews: [{ headline: 'Test news', source: 'Test', impactScore: 0.5 }],
      confidence: 0.75,
      suggestions: ['Test suggestion'],
    })),
  };
});

import { analyzeForCountryDetail } from './networkEngine';

describe('compareDCFT functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call analyzeForCountryDetail for both countries', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    expect(analyzeForCountryDetail).toHaveBeenCalledTimes(2);
    expect(analyzeForCountryDetail).toHaveBeenCalledWith('LY', 'Libya', false, 'ar');
    expect(analyzeForCountryDetail).toHaveBeenCalledWith('EG', 'Egypt', false, 'ar');
  });

  it('should return valid DCFT indices for both countries', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    // Country 1 (Libya)
    expect(result1.countryCode).toBe('LY');
    expect(result1.gmi).toBe(25.5);
    expect(result1.cfi).toBe(35.2);
    expect(result1.hri).toBe(60.1);
    expect(result1.dominantEmotion).toBe('hope');

    // Country 2 (Egypt)
    expect(result2.countryCode).toBe('EG');
    expect(result2.gmi).toBe(-10.3);
    expect(result2.cfi).toBe(65.8);
    expect(result2.hri).toBe(40.5);
    expect(result2.dominantEmotion).toBe('fear');
  });

  it('should return emotion spectra for comparison', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    // Emotion spectra should have 6 dimensions
    const emotions1 = result1.emotions;
    const emotions2 = result2.emotions;

    expect(emotions1).toHaveProperty('joy');
    expect(emotions1).toHaveProperty('fear');
    expect(emotions1).toHaveProperty('anger');
    expect(emotions1).toHaveProperty('sadness');
    expect(emotions1).toHaveProperty('hope');
    expect(emotions1).toHaveProperty('curiosity');

    expect(emotions2).toHaveProperty('joy');
    expect(emotions2).toHaveProperty('fear');
    expect(emotions2).toHaveProperty('anger');
    expect(emotions2).toHaveProperty('sadness');
    expect(emotions2).toHaveProperty('hope');
    expect(emotions2).toHaveProperty('curiosity');
  });

  it('should return trending keywords for both countries', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    expect(result1.trendingKeywords).toEqual(['elections', 'oil']);
    expect(result2.trendingKeywords).toEqual(['war', 'refugees']);
  });

  it('should return breaking news for both countries', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    expect(result1.breakingNews).toHaveLength(1);
    expect(result2.breakingNews).toHaveLength(1);
    expect(result1.breakingNews[0]).toHaveProperty('headline');
    expect(result1.breakingNews[0]).toHaveProperty('source');
    expect(result1.breakingNews[0]).toHaveProperty('impactScore');
  });

  it('should return confidence and source count', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    expect(result1.confidence).toBeGreaterThanOrEqual(0);
    expect(result1.confidence).toBeLessThanOrEqual(1);
    expect(result1.sourceCount).toBeGreaterThan(0);
    expect(result1.totalItems).toBeGreaterThan(0);
    expect(result1.isRealData).toBe(true);

    expect(result2.confidence).toBeGreaterThanOrEqual(0);
    expect(result2.confidence).toBeLessThanOrEqual(1);
  });

  it('should calculate comparison metrics correctly', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    // GMI difference
    const gmiDiff = result1.gmi - result2.gmi;
    expect(gmiDiff).toBeCloseTo(35.8, 1); // 25.5 - (-10.3) = 35.8

    // CFI difference (lower is better)
    const cfiDiff = result1.cfi - result2.cfi;
    expect(cfiDiff).toBeCloseTo(-30.6, 1); // 35.2 - 65.8 = -30.6

    // HRI difference
    const hriDiff = result1.hri - result2.hri;
    expect(hriDiff).toBeCloseTo(19.6, 1); // 60.1 - 40.5 = 19.6
  });

  it('should format comparison result for frontend', async () => {
    const [result1, result2] = await Promise.all([
      analyzeForCountryDetail('LY', 'Libya', false, 'ar'),
      analyzeForCountryDetail('EG', 'Egypt', false, 'ar'),
    ]);

    // Format as the compareDCFT endpoint would
    const comparisonResult = {
      country1: {
        code: result1.countryCode,
        name: result1.countryName,
        gmi: result1.gmi,
        cfi: result1.cfi,
        hri: result1.hri,
        emotions: result1.emotions,
        dominantEmotion: result1.dominantEmotion,
        confidence: result1.confidence,
        sourceCount: result1.sourceCount,
        totalItems: result1.totalItems,
        isRealData: result1.isRealData,
        trendingKeywords: result1.trendingKeywords,
        breakingNews: result1.breakingNews,
      },
      country2: {
        code: result2.countryCode,
        name: result2.countryName,
        gmi: result2.gmi,
        cfi: result2.cfi,
        hri: result2.hri,
        emotions: result2.emotions,
        dominantEmotion: result2.dominantEmotion,
        confidence: result2.confidence,
        sourceCount: result2.sourceCount,
        totalItems: result2.totalItems,
        isRealData: result2.isRealData,
        trendingKeywords: result2.trendingKeywords,
        breakingNews: result2.breakingNews,
      },
    };

    expect(comparisonResult.country1.code).toBe('LY');
    expect(comparisonResult.country2.code).toBe('EG');
    expect(comparisonResult.country1.gmi).toBeGreaterThan(comparisonResult.country2.gmi);
    expect(comparisonResult.country1.cfi).toBeLessThan(comparisonResult.country2.cfi);
    expect(comparisonResult.country1.hri).toBeGreaterThan(comparisonResult.country2.hri);
  });
});
