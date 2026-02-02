/**
 * Scenario Engine Tests
 * اختبارات محرك محاكاة السيناريوهات
 */

import { describe, it, expect } from 'vitest';
import { 
  simulateScenario, 
  detectEventFromText, 
  detectTimeframeFromText,
  generateScenarioResponse 
} from './scenarioEngine';

describe('Scenario Engine', () => {
  describe('detectEventFromText', () => {
    it('should detect dollar rise event', () => {
      expect(detectEventFromText('لو استمر ارتفاع سعر الدولار')).toBe('dollar_rise');
      expect(detectEventFromText('إذا ارتفع الدولار')).toBe('dollar_rise');
    });

    it('should detect dollar fall event', () => {
      expect(detectEventFromText('لو انخفض سعر الدولار')).toBe('dollar_fall');
    });

    it('should detect positive news event', () => {
      expect(detectEventFromText('لو ظهرت أخبار إيجابية')).toBe('positive_news');
    });

    it('should detect negative news event', () => {
      expect(detectEventFromText('لو ظهرت أخبار سلبية')).toBe('negative_news');
    });

    it('should detect political crisis event', () => {
      expect(detectEventFromText('لو حدثت أزمة سياسية')).toBe('political_crisis');
    });

    it('should return custom for unknown events', () => {
      expect(detectEventFromText('سؤال عام')).toBe('custom');
    });
  });

  describe('detectTimeframeFromText', () => {
    it('should detect 24h timeframe', () => {
      expect(detectTimeframeFromText('خلال 24 ساعة')).toBe('24h');
      expect(detectTimeframeFromText('غداً')).toBe('24h');
    });

    it('should detect 48h timeframe', () => {
      expect(detectTimeframeFromText('خلال 48 ساعة')).toBe('48h');
      expect(detectTimeframeFromText('خلال يومين')).toBe('48h');
    });

    it('should detect 1week timeframe', () => {
      expect(detectTimeframeFromText('خلال الأسبوع القادم')).toBe('1week');
      expect(detectTimeframeFromText('next week')).toBe('1week');
    });

    it('should detect 1month timeframe', () => {
      expect(detectTimeframeFromText('خلال الشهر القادم')).toBe('1month');
    });

    it('should default to 1week for unspecified timeframe', () => {
      expect(detectTimeframeFromText('لو حدث شيء')).toBe('1week');
    });
  });

  describe('simulateScenario', () => {
    it('should simulate dollar rise scenario correctly', () => {
      const result = simulateScenario({
        currentGMI: 20,
        currentCFI: 45,
        currentHRI: 55,
        event: 'dollar_rise',
        timeframe: '1week'
      });

      // Dollar rise should decrease GMI, increase CFI, decrease HRI
      expect(result.predictedGMI).toBeLessThan(20);
      expect(result.predictedCFI).toBeGreaterThan(45);
      expect(result.predictedHRI).toBeLessThan(55);
      expect(result.trend).toBe('declining');
    });

    it('should simulate positive news scenario correctly', () => {
      const result = simulateScenario({
        currentGMI: 0,
        currentCFI: 60,
        currentHRI: 40,
        event: 'positive_news',
        timeframe: '1week'
      });

      // Positive news should increase GMI, decrease CFI, increase HRI
      expect(result.predictedGMI).toBeGreaterThan(0);
      expect(result.predictedCFI).toBeLessThan(60);
      expect(result.predictedHRI).toBeGreaterThan(40);
      expect(result.trend).toBe('improving');
    });

    it('should apply timeframe multiplier for 24h', () => {
      const result24h = simulateScenario({
        currentGMI: 20,
        currentCFI: 45,
        currentHRI: 55,
        event: 'dollar_rise',
        timeframe: '24h'
      });

      const result1week = simulateScenario({
        currentGMI: 20,
        currentCFI: 45,
        currentHRI: 55,
        event: 'dollar_rise',
        timeframe: '1week'
      });

      // 24h changes should be smaller than 1week
      expect(Math.abs(result24h.gmiChange)).toBeLessThan(Math.abs(result1week.gmiChange));
    });

    it('should respect index bounds (-100 to 100 for GMI, 0 to 100 for CFI/HRI)', () => {
      const result = simulateScenario({
        currentGMI: 90,
        currentCFI: 10,
        currentHRI: 90,
        event: 'peace_agreement', // Strong positive event
        timeframe: '1month'
      });

      expect(result.predictedGMI).toBeLessThanOrEqual(100);
      expect(result.predictedCFI).toBeGreaterThanOrEqual(0);
      expect(result.predictedHRI).toBeLessThanOrEqual(100);
    });

    it('should include risks and opportunities', () => {
      const result = simulateScenario({
        currentGMI: -30,
        currentCFI: 75,
        currentHRI: 25,
        event: 'negative_news',
        timeframe: '1week'
      });

      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.explanation).toBeTruthy();
      expect(result.recommendation).toBeTruthy();
    });
  });

  describe('generateScenarioResponse', () => {
    it('should generate Arabic response for Arabic question', () => {
      const response = generateScenarioResponse(
        'لو استمر ارتفاع سعر الدولار في ليبيا، كيف سيتغير المزاج الجماعي خلال الأسبوع القادم؟',
        { gmi: 15, cfi: 50, hri: 55 },
        'الدولار في ليبيا'
      );

      expect(response).toContain('محاكاة السيناريو');
      expect(response).toContain('المزاج العام'); // GMI
      expect(response).toContain('التوصية');
      expect(response).toContain('هل تريد استكشاف سيناريو آخر');
    });

    it('should include predicted values in response', () => {
      const response = generateScenarioResponse(
        'ماذا لو ظهرت أخبار إيجابية؟',
        { gmi: 0, cfi: 60, hri: 40 }
      );

      // Should contain numbers showing the change
      expect(response).toMatch(/GMI|المزاج العام/);
      expect(response).toMatch(/CFI|الخوف/);
      expect(response).toMatch(/HRI|الأمل/);
    });
  });
});
