import { describe, it, expect } from 'vitest';
import {
  generateCountryHistoricalData,
  generateMultipleCountriesHistoricalData,
  getTimeRangeLabel,
  getIntervalMinutes,
  calculateEmotionTrend,
  getTrendEmoji,
  formatTimestamp,
} from './countryTimeSeriesGenerator';

describe('Country Time Series Generator', () => {
  describe('generateCountryHistoricalData', () => {
    it('should generate historical data for a country', () => {
      const data = generateCountryHistoricalData('SA', 'Saudi Arabia', 24);

      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('countryCode', 'SA');
      expect(data[0]).toHaveProperty('countryName', 'Saudi Arabia');
      expect(data[0]).toHaveProperty('timestamp');
      expect(data[0]).toHaveProperty('gmi');
      expect(data[0]).toHaveProperty('cfi');
      expect(data[0]).toHaveProperty('hri');
      expect(data[0]).toHaveProperty('confidence');
    });

    it('should generate data with correct time intervals', () => {
      const data = generateCountryHistoricalData('US', 'United States', 24, 60);

      // For 24 hours with 60-minute intervals, should have ~25 data points
      expect(data.length).toBeGreaterThanOrEqual(24);
      expect(data.length).toBeLessThanOrEqual(26);
    });

    it('should generate data within valid ranges', () => {
      const data = generateCountryHistoricalData('GB', 'United Kingdom', 6);

      data.forEach((point) => {
        expect(point.gmi).toBeGreaterThanOrEqual(-100);
        expect(point.gmi).toBeLessThanOrEqual(100);
        expect(point.cfi).toBeGreaterThanOrEqual(0);
        expect(point.cfi).toBeLessThanOrEqual(100);
        expect(point.hri).toBeGreaterThanOrEqual(0);
        expect(point.hri).toBeLessThanOrEqual(100);
        expect(point.confidence).toBeGreaterThanOrEqual(0);
        expect(point.confidence).toBeLessThanOrEqual(100);
      });
    });

    it('should generate timestamps in ascending order', () => {
      const data = generateCountryHistoricalData('JP', 'Japan', 12);

      for (let i = 1; i < data.length; i++) {
        expect(data[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          data[i - 1].timestamp.getTime()
        );
      }
    });

    it('should generate realistic trends', () => {
      const data = generateCountryHistoricalData('FR', 'France', 24);

      // Check that there are some variations (not all same values)
      const gmiValues = data.map((d) => d.gmi);
      const uniqueGMI = new Set(gmiValues);
      expect(uniqueGMI.size).toBeGreaterThan(1);
    });
  });

  describe('generateMultipleCountriesHistoricalData', () => {
    it('should generate data for multiple countries', () => {
      const countries = [
        { code: 'SA', name: 'Saudi Arabia' },
        { code: 'US', name: 'United States' },
      ];
      const data = generateMultipleCountriesHistoricalData(countries, 6);

      expect(data.length).toBeGreaterThan(0);
      const countryCodes = new Set(data.map((d) => d.countryCode));
      expect(countryCodes.has('SA')).toBe(true);
      expect(countryCodes.has('US')).toBe(true);
    });

    it('should generate correct number of records per country', () => {
      const countries = [
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
      ];
      const data = generateMultipleCountriesHistoricalData(countries, 6, 60);

      const saData = data.filter((d) => d.countryCode === 'DE');
      const usData = data.filter((d) => d.countryCode === 'FR');

      expect(saData.length).toBeGreaterThan(0);
      expect(usData.length).toBeGreaterThan(0);
    });
  });

  describe('getTimeRangeLabel', () => {
    it('should return correct labels for time ranges', () => {
      expect(getTimeRangeLabel(1)).toBe('Last Hour');
      expect(getTimeRangeLabel(6)).toBe('Last 6 Hours');
      expect(getTimeRangeLabel(24)).toBe('Last 24 Hours');
      expect(getTimeRangeLabel(168)).toBe('Last Week');
      expect(getTimeRangeLabel(720)).toBe('Last Month');
      expect(getTimeRangeLabel(48)).toBe('Last 48 Hours');
    });
  });

  describe('getIntervalMinutes', () => {
    it('should return correct intervals for time ranges', () => {
      expect(getIntervalMinutes(1)).toBe(15);
      expect(getIntervalMinutes(6)).toBe(15);
      expect(getIntervalMinutes(24)).toBe(60);
      expect(getIntervalMinutes(168)).toBe(240);
      expect(getIntervalMinutes(720)).toBe(1440);
    });
  });

  describe('calculateEmotionTrend', () => {
    it('should calculate trend correctly', () => {
      const data = [
        { countryCode: 'SA', countryName: 'SA', timestamp: new Date(), gmi: 10, cfi: 50, hri: 60, confidence: 75 },
        { countryCode: 'SA', countryName: 'SA', timestamp: new Date(), gmi: 20, cfi: 40, hri: 70, confidence: 75 },
      ];

      const trend = calculateEmotionTrend(data);

      expect(trend.gmiTrend).toBe(10);
      expect(trend.cfiTrend).toBe(-10);
      expect(trend.hriTrend).toBe(10);
    });

    it('should return zero trend for single data point', () => {
      const data = [
        { countryCode: 'SA', countryName: 'SA', timestamp: new Date(), gmi: 10, cfi: 50, hri: 60, confidence: 75 },
      ];

      const trend = calculateEmotionTrend(data);

      expect(trend.gmiTrend).toBe(0);
      expect(trend.cfiTrend).toBe(0);
      expect(trend.hriTrend).toBe(0);
    });

    it('should return zero trend for empty data', () => {
      const trend = calculateEmotionTrend([]);

      expect(trend.gmiTrend).toBe(0);
      expect(trend.cfiTrend).toBe(0);
      expect(trend.hriTrend).toBe(0);
    });
  });

  describe('getTrendEmoji', () => {
    it('should return correct emoji for trend', () => {
      expect(getTrendEmoji(10)).toBe('📈');
      expect(getTrendEmoji(-10)).toBe('📉');
      expect(getTrendEmoji(2)).toBe('➡️');
      expect(getTrendEmoji(-2)).toBe('➡️');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const date = new Date('2026-01-29T12:30:00');

      const shortFormat = formatTimestamp(date, 'short');
      expect(shortFormat).toContain(':');

      const longFormat = formatTimestamp(date, 'long');
      expect(longFormat).toContain(':');
    });
  });
});
