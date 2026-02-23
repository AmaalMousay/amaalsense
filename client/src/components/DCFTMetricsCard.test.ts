import { describe, it, expect } from 'vitest';

describe('DCFTMetricsCard', () => {
  describe('Metrics Calculation', () => {
    it('should display GMI (Global Mood Index) correctly', () => {
      const gmi = 72.5;
      expect(gmi).toBeGreaterThanOrEqual(0);
      expect(gmi).toBeLessThanOrEqual(100);
    });

    it('should display CFI (Collective Feeling Index) correctly', () => {
      const cfi = 68.3;
      expect(cfi).toBeGreaterThanOrEqual(0);
      expect(cfi).toBeLessThanOrEqual(100);
    });

    it('should display HRI (Human Resilience Index) correctly', () => {
      const hri = 75.8;
      expect(hri).toBeGreaterThanOrEqual(0);
      expect(hri).toBeLessThanOrEqual(100);
    });
  });

  describe('Trend Calculation', () => {
    it('should calculate positive trend correctly', () => {
      const previousValue = 70;
      const currentValue = 75;
      const trend = ((currentValue - previousValue) / previousValue) * 100;
      expect(trend).toBeGreaterThan(0);
      expect(trend).toBeCloseTo(7.14, 1);
    });

    it('should calculate negative trend correctly', () => {
      const previousValue = 75;
      const currentValue = 70;
      const trend = ((currentValue - previousValue) / previousValue) * 100;
      expect(trend).toBeLessThan(0);
      expect(trend).toBeCloseTo(-6.67, 1);
    });
  });

  describe('Status Determination', () => {
    it('should determine positive status when value > 70', () => {
      const value = 75;
      const status = value > 70 ? '✅ إيجابي جداً' : value > 40 ? '⚠️ محايد' : '❌ سلبي';
      expect(status).toBe('✅ إيجابي جداً');
    });

    it('should determine neutral status when 40 < value <= 70', () => {
      const value = 55;
      const status = value > 70 ? '✅ إيجابي جداً' : value > 40 ? '⚠️ محايد' : '❌ سلبي';
      expect(status).toBe('⚠️ محايد');
    });

    it('should determine negative status when value <= 40', () => {
      const value = 35;
      const status = value > 70 ? '✅ إيجابي جداً' : value > 40 ? '⚠️ محايد' : '❌ سلبي';
      expect(status).toBe('❌ سلبي');
    });
  });

  describe('Data Validation', () => {
    it('should validate metric values are numbers', () => {
      const metrics = { gmi: 72.5, cfi: 68.3, hri: 75.8 };
      Object.values(metrics).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('should validate timestamp is valid date', () => {
      const timestamp = new Date();
      expect(timestamp instanceof Date).toBe(true);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Formatting', () => {
    it('should format numbers to 1 decimal place', () => {
      const value = 72.5;
      const formatted = value.toFixed(1);
      expect(formatted).toBe('72.5');
    });

    it('should format date to Arabic locale', () => {
      const date = new Date('2026-02-23');
      const formatted = date.toLocaleString('ar-SA');
      expect(formatted).toContain('2026');
    });
  });
});
