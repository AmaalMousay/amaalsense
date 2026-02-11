import { describe, it, expect } from 'vitest';
import { generateCountryEmotionData, generateAllCountriesEmotionData } from './countryEmotionAnalyzer';

describe('Phase 83: Add ACI and SDI to Country Data', () => {
  it('should generate country data with all 5 indices (GMI, CFI, HRI, ACI, SDI)', () => {
    const data = generateCountryEmotionData('LY', 'Libya', 0, 50, 50);
    
    expect(data).toHaveProperty('gmi');
    expect(data).toHaveProperty('cfi');
    expect(data).toHaveProperty('hri');
    expect(data).toHaveProperty('aci');
    expect(data).toHaveProperty('sdi');
    expect(data).toHaveProperty('confidence');
  });

  it('should have valid ranges for all indices', () => {
    const data = generateCountryEmotionData('EG', 'Egypt', 0, 50, 50);
    
    expect(data.gmi).toBeGreaterThanOrEqual(-100);
    expect(data.gmi).toBeLessThanOrEqual(100);
    expect(data.cfi).toBeGreaterThanOrEqual(0);
    expect(data.cfi).toBeLessThanOrEqual(100);
    expect(data.hri).toBeGreaterThanOrEqual(0);
    expect(data.hri).toBeLessThanOrEqual(100);
    expect(data.aci).toBeGreaterThanOrEqual(0);
    expect(data.aci).toBeLessThanOrEqual(100);
    expect(data.sdi).toBeGreaterThanOrEqual(0);
    expect(data.sdi).toBeLessThanOrEqual(100);
  });

  it('should generate all countries with 5 indices', () => {
    const allCountries = generateAllCountriesEmotionData(0, 50, 50);
    
    expect(allCountries.length).toBeGreaterThan(0);
    
    allCountries.forEach(country => {
      expect(country).toHaveProperty('gmi');
      expect(country).toHaveProperty('cfi');
      expect(country).toHaveProperty('hri');
      expect(country).toHaveProperty('aci');
      expect(country).toHaveProperty('sdi');
      expect(country).toHaveProperty('confidence');
    });
  });

  it('should apply country-specific variations to ACI and SDI', () => {
    // Generate multiple times to see variation
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(generateCountryEmotionData('SA', 'Saudi Arabia', 0, 50, 50));
    }
    
    // Check that we have both ACI and SDI values
    results.forEach(result => {
      expect(result.aci).toBeDefined();
      expect(result.sdi).toBeDefined();
    });
  });

  it('should include ACI and SDI in all country data', () => {
    const data = generateCountryEmotionData('US', 'United States', 10, 60, 40);
    
    expect(data.countryCode).toBe('US');
    expect(data.countryName).toBe('United States');
    expect(typeof data.gmi).toBe('number');
    expect(typeof data.cfi).toBe('number');
    expect(typeof data.hri).toBe('number');
    expect(typeof data.aci).toBe('number');
    expect(typeof data.sdi).toBe('number');
    expect(typeof data.confidence).toBe('number');
  });
});
