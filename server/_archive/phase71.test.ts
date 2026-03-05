import { describe, it, expect } from 'vitest';
import { 
  getTopicMultiplier, 
  getCountryMultiplier, 
  getCulturalRegionMultiplier,
  applyContextualAdjustments 
} from './contextualAdjustments';

describe('Phase 71: Fix Data Duplication with Contextual Adjustments', () => {
  describe('Topic Multipliers', () => {
    it('should return different multipliers for different topics', () => {
      const politicsMult = getTopicMultiplier('politics');
      const economyMult = getTopicMultiplier('economy');
      const sportsMult = getTopicMultiplier('sports');
      
      // Each topic should have unique multipliers
      expect(politicsMult).not.toEqual(economyMult);
      expect(economyMult).not.toEqual(sportsMult);
      expect(politicsMult).not.toEqual(sportsMult);
    });

    it('should return lower GMI and higher CFI for conflict topics', () => {
      const conflictMult = getTopicMultiplier('conflict');
      
      expect(conflictMult.gmi).toBeLessThan(0.5);
      expect(conflictMult.cfi).toBeGreaterThan(1.5);
    });

    it('should return higher GMI and HRI for sports topics', () => {
      const sportsMult = getTopicMultiplier('sports');
      
      expect(sportsMult.gmi).toBeGreaterThan(1.0);
      expect(sportsMult.hri).toBeGreaterThan(1.0);
    });

    it('should handle keyword matching for topics', () => {
      const warMult = getTopicMultiplier('war');
      const conflictMult = getTopicMultiplier('conflict');
      
      // War should be more negative than conflict
      expect(warMult.gmi).toBeLessThan(conflictMult.gmi);
      expect(warMult.cfi).toBeGreaterThan(conflictMult.cfi);
    });
  });

  describe('Country Multipliers', () => {
    it('should return different multipliers for different countries', () => {
      const libyaMult = getCountryMultiplier('LY');
      const germanyMult = getCountryMultiplier('DE');
      const usaMult = getCountryMultiplier('US');
      
      // Each country should have unique multipliers
      expect(libyaMult).not.toEqual(germanyMult);
      expect(germanyMult).not.toEqual(usaMult);
      expect(libyaMult).not.toEqual(usaMult);
    });

    it('should return lower GMI and higher CFI for conflict-affected countries', () => {
      const libyaMult = getCountryMultiplier('LY');
      const syriaMult = getCountryMultiplier('SY');
      
      expect(libyaMult.gmi).toBeLessThan(0.6);
      expect(libyaMult.cfi).toBeGreaterThan(1.2);
      
      expect(syriaMult.gmi).toBeLessThan(0.5);
      expect(syriaMult.cfi).toBeGreaterThan(1.5);
    });

    it('should return higher GMI and HRI for stable countries', () => {
      const germanyMult = getCountryMultiplier('DE');
      const canadaMult = getCountryMultiplier('CA');
      
      expect(germanyMult.gmi).toBeGreaterThan(0.9);
      expect(germanyMult.hri).toBeGreaterThan(1.0);
      
      expect(canadaMult.gmi).toBeGreaterThan(0.8);
      expect(canadaMult.hri).toBeGreaterThan(1.0);
    });
  });

  describe('Contextual Adjustments', () => {
    it('should apply different adjustments for different topics', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      const politicsResult = applyContextualAdjustments(baseIndices, { topic: 'politics' });
      const sportsResult = applyContextualAdjustments(baseIndices, { topic: 'sports' });
      
      // Politics should have lower GMI and higher CFI
      expect(politicsResult.gmi).toBeLessThan(sportsResult.gmi);
      expect(politicsResult.cfi).toBeGreaterThan(sportsResult.cfi);
    });

    it('should apply different adjustments for different countries', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      const libyaResult = applyContextualAdjustments(baseIndices, { country: 'LY' });
      const germanyResult = applyContextualAdjustments(baseIndices, { country: 'DE' });
      
      // Libya should have lower GMI and higher CFI than Germany
      expect(libyaResult.gmi).toBeLessThan(germanyResult.gmi);
      expect(libyaResult.cfi).toBeGreaterThan(germanyResult.cfi);
    });

    it('should combine topic and country adjustments', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      // Same topic, different countries
      const politicsLibya = applyContextualAdjustments(baseIndices, { 
        topic: 'politics', 
        country: 'LY' 
      });
      const politicsGermany = applyContextualAdjustments(baseIndices, { 
        topic: 'politics', 
        country: 'DE' 
      });
      
      // Libya should have lower GMI than Germany
      expect(politicsLibya.gmi).toBeLessThan(politicsGermany.gmi);
    });

    it('should ensure indices stay within valid ranges', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      const result = applyContextualAdjustments(baseIndices, { 
        topic: 'war', 
        country: 'SY' 
      });
      
      // Check ranges
      expect(result.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.gmi).toBeLessThanOrEqual(100);
      
      expect(result.cfi).toBeGreaterThanOrEqual(0);
      expect(result.cfi).toBeLessThanOrEqual(100);
      
      expect(result.hri).toBeGreaterThanOrEqual(0);
      expect(result.hri).toBeLessThanOrEqual(100);
    });

    it('should prevent data duplication - different topics should give different results', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      const topic1 = applyContextualAdjustments(baseIndices, { topic: 'politics', country: 'LY' });
      const topic2 = applyContextualAdjustments(baseIndices, { topic: 'economy', country: 'LY' });
      
      // Should NOT be identical
      expect(topic1).not.toEqual(topic2);
      
      // At least one index should be different
      const different = topic1.gmi !== topic2.gmi || 
                       topic1.cfi !== topic2.cfi || 
                       topic1.hri !== topic2.hri;
      expect(different).toBe(true);
    });

    it('should prevent data duplication - different countries should give different results', () => {
      const baseIndices = { gmi: 50, cfi: 50, hri: 50 };
      
      const country1 = applyContextualAdjustments(baseIndices, { topic: 'politics', country: 'LY' });
      const country2 = applyContextualAdjustments(baseIndices, { topic: 'politics', country: 'DE' });
      
      // Should NOT be identical
      expect(country1).not.toEqual(country2);
      
      // At least one index should be different
      const different = country1.gmi !== country2.gmi || 
                       country1.cfi !== country2.cfi || 
                       country1.hri !== country2.hri;
      expect(different).toBe(true);
    });
  });

  describe('Cultural Region Multipliers', () => {
    it('should return different multipliers for different regions', () => {
      const middleEastMult = getCulturalRegionMultiplier('middle_east');
      const europeMult = getCulturalRegionMultiplier('europe');
      
      expect(middleEastMult).not.toEqual(europeMult);
    });

    it('should return lower GMI and higher CFI for conflict-prone regions', () => {
      const middleEastMult = getCulturalRegionMultiplier('middle_east');
      
      expect(middleEastMult.gmi).toBeLessThan(0.6);
      expect(middleEastMult.cfi).toBeGreaterThan(1.2);
    });
  });
});
