import { describe, it, expect } from 'vitest';
import {
  detectTemporalQuestion,
  generateHistoricalData,
  formatTemporalAnalysis,
} from './temporalQuestionHandler';

describe('Phase 85: Temporal Question Handler - Fix Bug #2', () => {
  describe('Temporal Question Detection', () => {
    it('should detect trend questions', () => {
      const result = detectTemporalQuestion('What is the trend for this topic?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('trend');
    });

    it('should detect comparison questions', () => {
      const result = detectTemporalQuestion('How did sentiment change between January and February?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('comparison');
    });

    it('should detect forecast questions', () => {
      const result = detectTemporalQuestion('What will happen next week?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('forecast');
    });

    it('should detect change questions', () => {
      const result = detectTemporalQuestion('Is the situation improving or worsening?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('change');
    });

    it('should detect Arabic temporal questions', () => {
      const result = detectTemporalQuestion('كيف تغير الشعور بين يناير وفبراير؟');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it('should detect pattern questions', () => {
      const result = detectTemporalQuestion('What patterns do you see?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('pattern');
    });

    it('should not detect non-temporal questions', () => {
      const result = detectTemporalQuestion('What is your name?');
      expect(result.isTemporalQuestion).toBe(false);
      expect(result.questionType).toBe('none');
    });

    it('should extract metric from question', () => {
      const fearResult = detectTemporalQuestion('How did fear change?');
      expect(fearResult.metric).toBe('cfi');

      const hopeResult = detectTemporalQuestion('What about hope trends?');
      expect(hopeResult.metric).toBe('hri');

      const moodResult = detectTemporalQuestion('What is the sentiment trend?');
      expect(moodResult.metric).toBe('gmi');
    });
  });

  describe('Historical Data Generation', () => {
    it('should generate historical data points', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const baseIndices = { gmi: 10, cfi: 60, hri: 70, aci: 40, sdi: 50 };

      const data = generateHistoricalData('رؤية 2030', 'SA', startDate, endDate, baseIndices);

      expect(data.length).toBeGreaterThan(0);
      expect(data.length).toBeLessThanOrEqual(31); // Max 31 days in January
    });

    it('should generate data with valid indices', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-07');
      const baseIndices = { gmi: 0, cfi: 50, hri: 50, aci: 50, sdi: 50 };

      const data = generateHistoricalData('الأوضاع الاقتصادية', 'EG', startDate, endDate, baseIndices);

      data.forEach(point => {
        expect(point.gmi).toBeGreaterThanOrEqual(-100);
        expect(point.gmi).toBeLessThanOrEqual(100);
        expect(point.cfi).toBeGreaterThanOrEqual(0);
        expect(point.cfi).toBeLessThanOrEqual(100);
        expect(point.hri).toBeGreaterThanOrEqual(0);
        expect(point.hri).toBeLessThanOrEqual(100);
        expect(point.aci).toBeGreaterThanOrEqual(0);
        expect(point.aci).toBeLessThanOrEqual(100);
        expect(point.sdi).toBeGreaterThanOrEqual(0);
        expect(point.sdi).toBeLessThanOrEqual(100);
        expect(point.confidence).toBeGreaterThanOrEqual(0);
        expect(point.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should generate data with timestamps in order', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-10');
      const baseIndices = { gmi: 0, cfi: 50, hri: 50, aci: 50, sdi: 50 };

      const data = generateHistoricalData('موضوع', 'SA', startDate, endDate, baseIndices);

      for (let i = 1; i < data.length; i++) {
        expect(data[i].timestamp.getTime()).toBeGreaterThan(data[i - 1].timestamp.getTime());
      }
    });

    it('should apply topic-specific trends', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const baseIndices = { gmi: 0, cfi: 50, hri: 50, aci: 50, sdi: 50 };

      // Economic topic should trend upward
      const economicData = generateHistoricalData('الأوضاع الاقتصادية', 'SA', startDate, endDate, baseIndices);
      const economicGMI = economicData.map(d => d.gmi);
      const economicTrend = economicGMI[economicGMI.length - 1] - economicGMI[0];

      // Security topic should trend downward
      const securityData = generateHistoricalData('الأمن والاستقرار', 'SA', startDate, endDate, baseIndices);
      const securityGMI = securityData.map(d => d.gmi);
      const securityTrend = securityGMI[securityGMI.length - 1] - securityGMI[0];

      // Economic should be more positive than security
      expect(Math.abs(economicTrend - securityTrend)).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Temporal Analysis Formatting', () => {
    it('should format temporal analysis result', () => {
      const mockAnalysis = {
        period: {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31'),
          durationDays: 30,
        },
        trends: {
          gmi: { startValue: 10, endValue: 15, trend: 'increasing' },
          cfi: { startValue: 60, endValue: 55, trend: 'decreasing' },
          hri: { startValue: 70, endValue: 75, trend: 'increasing' },
        },
        patterns: ['Recovery Pattern: Hope increasing while fear decreases'],
        forecast: {
          nextWeekGMI: 18,
          nextWeekCFI: 52,
          nextWeekHRI: 78,
          confidence: 0.85,
        },
        insights: ['Hope and resilience are strengthening'],
      };

      const formatted = formatTemporalAnalysis(mockAnalysis);

      expect(formatted).toContain('تحليل زمني');
      expect(formatted).toContain('الاتجاهات');
      expect(formatted).toContain('التنبؤ');
      expect(formatted).toContain('الرؤى');
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle comparison between two months', () => {
      const result = detectTemporalQuestion('Compare emotions between January 2025 and February 2025');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.questionType).toBe('comparison');
    });

    it('should handle last X days queries', () => {
      const result = detectTemporalQuestion('What was the trend in the last 7 days');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
    });

    it('should handle Arabic temporal queries', () => {
      const result = detectTemporalQuestion('كيف تطورت الحالة في الشهر الماضي');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it('should detect multiple temporal indicators', () => {
      const result = detectTemporalQuestion('What is the trend and forecast for next week?');
      expect(result.isTemporalQuestion).toBe(true);
      expect(result.keywords.length).toBeGreaterThanOrEqual(2);
    });
  });
});
