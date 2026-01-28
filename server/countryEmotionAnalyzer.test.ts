import { describe, it, expect } from 'vitest';
import {
  generateCountryEmotionData,
  generateAllCountriesEmotionData,
  getEmotionColor,
  getEmotionIntensity,
  getEmotionDescription,
  COUNTRIES,
} from './countryEmotionAnalyzer';

describe('Country Emotion Analyzer', () => {
  describe('generateCountryEmotionData', () => {
    it('should generate emotion data for a country', () => {
      const result = generateCountryEmotionData('SA', 'Saudi Arabia');

      expect(result).toHaveProperty('countryCode', 'SA');
      expect(result).toHaveProperty('countryName', 'Saudi Arabia');
      expect(result).toHaveProperty('gmi');
      expect(result).toHaveProperty('cfi');
      expect(result).toHaveProperty('hri');
      expect(result).toHaveProperty('confidence');
    });

    it('should return indices within valid ranges', () => {
      const result = generateCountryEmotionData('US', 'United States');

      expect(result.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.gmi).toBeLessThanOrEqual(100);
      expect(result.cfi).toBeGreaterThanOrEqual(0);
      expect(result.cfi).toBeLessThanOrEqual(100);
      expect(result.hri).toBeGreaterThanOrEqual(0);
      expect(result.hri).toBeLessThanOrEqual(100);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should apply country-specific variations', () => {
      const globalGMI = 0;
      const globalCFI = 50;
      const globalHRI = 50;

      const saData = generateCountryEmotionData('SA', 'Saudi Arabia', globalGMI, globalCFI, globalHRI);
      const ruData = generateCountryEmotionData('RU', 'Russia', globalGMI, globalCFI, globalHRI);

      // SA should generally be more positive than Russia
      expect(saData.gmi).toBeGreaterThan(ruData.gmi - 20);
    });

    it('should use global indices as base', () => {
      const result1 = generateCountryEmotionData('GB', 'United Kingdom', 10, 40, 60);
      const result2 = generateCountryEmotionData('GB', 'United Kingdom', -10, 60, 40);

      // Results should be influenced by global indices
      expect(result1.gmi).toBeGreaterThan(result2.gmi - 30);
    });
  });

  describe('generateAllCountriesEmotionData', () => {
    it('should generate data for all countries', () => {
      const results = generateAllCountriesEmotionData();

      expect(results.length).toBe(COUNTRIES.length);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return valid data for each country', () => {
      const results = generateAllCountriesEmotionData();

      results.forEach((country) => {
        expect(country.countryCode).toBeDefined();
        expect(country.countryName).toBeDefined();
        expect(country.gmi).toBeGreaterThanOrEqual(-100);
        expect(country.gmi).toBeLessThanOrEqual(100);
        expect(country.cfi).toBeGreaterThanOrEqual(0);
        expect(country.cfi).toBeLessThanOrEqual(100);
        expect(country.hri).toBeGreaterThanOrEqual(0);
        expect(country.hri).toBeLessThanOrEqual(100);
      });
    });

    it('should have unique country codes', () => {
      const results = generateAllCountriesEmotionData();
      const codes = results.map((c) => c.countryCode);
      const uniqueCodes = new Set(codes);

      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('getEmotionColor', () => {
    it('should return red tones for high fear', () => {
      const color = getEmotionColor(0, 80, 50);
      expect(color).toContain('rgb');
      expect(color).toContain('50, 50');
    });

    it('should return green tones for high hope', () => {
      const color = getEmotionColor(0, 20, 80);
      expect(color).toContain('rgb');
      expect(color).toContain('100');
    });

    it('should return blue-green for positive GMI', () => {
      const color = getEmotionColor(50, 30, 40);
      expect(color).toContain('rgb');
    });

    it('should return orange-red for negative GMI', () => {
      const color = getEmotionColor(-50, 30, 40);
      expect(color).toContain('rgb');
    });

    it('should return neutral color for balanced emotions', () => {
      const color = getEmotionColor(0, 50, 50);
      expect(color).toContain('rgb');
      expect(color).toContain('200');
    });
  });

  describe('getEmotionIntensity', () => {
    it('should return intensity between 0.3 and 1.0', () => {
      const intensity1 = getEmotionIntensity(0, 0, 0);
      const intensity2 = getEmotionIntensity(100, 100, 100);
      const intensity3 = getEmotionIntensity(50, 50, 50);

      expect(intensity1).toBeGreaterThanOrEqual(0.3);
      expect(intensity1).toBeLessThanOrEqual(1.0);
      expect(intensity2).toBeGreaterThanOrEqual(0.3);
      expect(intensity2).toBeLessThanOrEqual(1.0);
      expect(intensity3).toBeGreaterThanOrEqual(0.3);
      expect(intensity3).toBeLessThanOrEqual(1.0);
    });

    it('should return higher intensity for extreme emotions', () => {
      const lowIntensity = getEmotionIntensity(0, 0, 0);
      const highIntensity = getEmotionIntensity(100, 100, 100);

      expect(highIntensity).toBeGreaterThan(lowIntensity);
    });
  });

  describe('getEmotionDescription', () => {
    it('should describe optimistic sentiment', () => {
      const description = getEmotionDescription(50, 30, 70);
      expect(description).toContain('optimistic');
    });

    it('should describe pessimistic sentiment', () => {
      const description = getEmotionDescription(-50, 70, 30);
      expect(description).toContain('pessimistic');
    });

    it('should describe fearful state', () => {
      const description = getEmotionDescription(0, 70, 50);
      expect(description).toContain('fearful');
    });

    it('should describe hopeful state', () => {
      const description = getEmotionDescription(0, 30, 70);
      expect(description).toContain('hopeful');
    });

    it('should describe discouraged state', () => {
      const description = getEmotionDescription(0, 50, 20);
      expect(description).toContain('discouraged');
    });
  });

  describe('COUNTRIES list', () => {
    it('should contain valid country data', () => {
      expect(COUNTRIES.length).toBeGreaterThan(0);

      COUNTRIES.forEach((country) => {
        expect(country.code).toBeDefined();
        expect(country.code.length).toBe(2);
        expect(country.name).toBeDefined();
        expect(country.name.length).toBeGreaterThan(0);
      });
    });

    it('should have unique country codes', () => {
      const codes = COUNTRIES.map((c) => c.code);
      const uniqueCodes = new Set(codes);

      expect(uniqueCodes.size).toBe(codes.length);
    });
  });
});
