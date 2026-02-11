import { describe, it, expect } from 'vitest';
import {
  calculateDataQuality,
  calculateSourceReliability,
  calculateConsistency,
  createEngineScore,
  calculateTemporalDecay,
  calibrateConfidence,
  validateConfidenceScore,
  formatConfidenceScore,
  generateConfidenceReport,
  compareConfidenceScores,
} from './confidenceCalibrationEngine';

describe('Phase 87: Confidence Calibration Engine - Fix Bug #4', () => {
  describe('Data Quality Calculation', () => {
    it('should calculate high data quality', () => {
      const quality = calculateDataQuality(
        100, // sampleSize
        5, // sourceCount
        1000 * 60 * 30 // 30 minutes old
      );
      expect(quality).toBeGreaterThanOrEqual(80);
    });

    it('should calculate medium data quality', () => {
      const quality = calculateDataQuality(50, 2, 1000 * 60 * 60 * 12);
      expect(quality).toBeGreaterThanOrEqual(40);
      expect(quality).toBeLessThanOrEqual(100);
    });

    it('should calculate low data quality', () => {
      const quality = calculateDataQuality(5, 1, 1000 * 60 * 60 * 24 * 10);
      expect(quality).toBeLessThan(70);
    });

    it('should clamp quality to 0-100', () => {
      const quality = calculateDataQuality(1000, 100, 0);
      expect(quality).toBeLessThanOrEqual(100);
      expect(quality).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Source Reliability Calculation', () => {
    it('should calculate high reliability for news sources', () => {
      const reliability = calculateSourceReliability(['news_api', 'gnews']);
      expect(reliability).toBeGreaterThan(80);
    });

    it('should calculate lower reliability for social media', () => {
      const reliability = calculateSourceReliability(['twitter', 'reddit']);
      expect(reliability).toBeLessThan(70);
    });

    it('should handle mixed sources', () => {
      const reliability = calculateSourceReliability(['news_api', 'reddit', 'youtube']);
      expect(reliability).toBeGreaterThan(50);
      expect(reliability).toBeLessThan(90);
    });

    it('should return default for empty sources', () => {
      const reliability = calculateSourceReliability([]);
      expect(reliability).toBe(30);
    });

    it('should handle unknown sources', () => {
      const reliability = calculateSourceReliability(['unknown_source']);
      expect(reliability).toBe(50);
    });
  });

  describe('Consistency Calculation', () => {
    it('should return high consistency for similar scores', () => {
      const consistency = calculateConsistency([80, 81, 79, 82, 80]);
      expect(consistency).toBeGreaterThan(85);
    });

    it('should return low consistency for diverse scores', () => {
      const consistency = calculateConsistency([20, 50, 80, 95, 10]);
      expect(consistency).toBeLessThan(50);
    });

    it('should return 100 for single score', () => {
      const consistency = calculateConsistency([75]);
      expect(consistency).toBe(100);
    });

    it('should return 100 for two identical scores', () => {
      const consistency = calculateConsistency([75, 75]);
      expect(consistency).toBe(100);
    });
  });

  describe('Engine Score Creation', () => {
    it('should create valid engine score', () => {
      const score = createEngineScore('vader', 75, 85, 90, 80, 88, 0.25);
      expect(score.engineName).toBe('vader');
      expect(score.score).toBe(75);
      expect(score.weight).toBe(0.25);
      expect(score.factors.dataQuality).toBe(85);
    });

    it('should clamp values to valid ranges', () => {
      const score = createEngineScore('test', 150, 200, -50, 300, 50, 2.0);
      expect(score.score).toBeLessThanOrEqual(100);
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.weight).toBeLessThanOrEqual(1);
      expect(score.weight).toBeGreaterThanOrEqual(0);
    });

    it('should set timestamp', () => {
      const beforeTime = Date.now();
      const score = createEngineScore('test', 75, 85, 90, 80, 88, 0.25);
      const afterTime = Date.now();

      expect(score.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(score.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('Temporal Decay Calculation', () => {
    it('should return 1.0 for fresh analysis', () => {
      const decay = calculateTemporalDecay(0);
      expect(decay).toBe(1.0);
    });

    it('should return 0.5 at half-life', () => {
      const halfLife = 7 * 24 * 60 * 60 * 1000; // 7 days
      const decay = calculateTemporalDecay(halfLife, halfLife);
      expect(decay).toBeCloseTo(0.5, 1);
    });

    it('should decrease over time', () => {
      const decay1Day = calculateTemporalDecay(1 * 24 * 60 * 60 * 1000);
      const decay7Days = calculateTemporalDecay(7 * 24 * 60 * 60 * 1000);
      expect(decay1Day).toBeGreaterThan(decay7Days);
    });

    it('should clamp to 0-1', () => {
      const decay = calculateTemporalDecay(1000 * 24 * 60 * 60 * 1000); // Very old
      expect(decay).toBeGreaterThanOrEqual(0);
      expect(decay).toBeLessThanOrEqual(1);
    });
  });

  describe('Confidence Calibration', () => {
    it('should calibrate confidence from multiple engines', () => {
      const engines = [
        createEngineScore('vader', 75, 85, 90, 80, 88, 0.25),
        createEngineScore('llm', 80, 90, 95, 85, 92, 0.30),
        createEngineScore('temporal', 70, 80, 85, 75, 85, 0.20),
      ];

      const calibration = calibrateConfidence(engines);
      expect(calibration.overallConfidence).toBeGreaterThan(0);
      expect(calibration.overallConfidence).toBeLessThanOrEqual(100);
      expect(calibration.engineScores.length).toBe(3);
    });

    it('should apply temporal decay', () => {
      const engines = [createEngineScore('test', 80, 85, 90, 80, 88, 1.0)];

      const calibrationFresh = calibrateConfidence(engines, 0);
      const calibrationOld = calibrateConfidence(engines, 7 * 24 * 60 * 60 * 1000);

      expect(calibrationFresh.overallConfidence).toBeGreaterThan(calibrationOld.overallConfidence);
    });

    it('should return 0 for empty engines', () => {
      const calibration = calibrateConfidence([]);
      expect(calibration.overallConfidence).toBe(0);
    });

    it('should assess quality correctly', () => {
      const highEngines = [
        createEngineScore('test', 95, 95, 95, 95, 95, 1.0),
      ];
      const highCalibration = calibrateConfidence(highEngines);
      expect(highCalibration.qualityAssessment).toBe('high');

      const lowEngines = [
        createEngineScore('test', 30, 30, 30, 30, 30, 1.0),
      ];
      const lowCalibration = calibrateConfidence(lowEngines);
      expect(lowCalibration.qualityAssessment).toBe('low');
    });

    it('should round to correct precision', () => {
      const engines = [
        createEngineScore('test', 44.99999999, 85, 90, 80, 88, 1.0),
      ];

      const calibration = calibrateConfidence(engines);
      const decimalPlaces = (calibration.overallConfidence.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('Confidence Validation', () => {
    it('should validate correct score', () => {
      const validation = validateConfidenceScore(75.50);
      expect(validation.isValid).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    it('should detect precision issues', () => {
      const validation = validateConfidenceScore(44.99999999);
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('decimal'))).toBe(true);
    });

    it('should detect out of range values', () => {
      const validation = validateConfidenceScore(150);
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('range'))).toBe(true);
    });

    it('should detect NaN', () => {
      const validation = validateConfidenceScore(NaN);
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('Invalid'))).toBe(true);
    });

    it('should detect Infinity', () => {
      const validation = validateConfidenceScore(Infinity);
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('Invalid'))).toBe(true);
    });
  });

  describe('Confidence Formatting', () => {
    it('should format high confidence', () => {
      const engines = [createEngineScore('test', 85, 85, 85, 85, 85, 1.0)];
      const calibration = calibrateConfidence(engines);
      const formatted = formatConfidenceScore(calibration);

      expect(formatted).toContain('⚠️');
      expect(formatted).toContain('medium');
    });

    it('should format medium confidence', () => {
      const engines = [createEngineScore('test', 65, 65, 65, 65, 65, 1.0)];
      const calibration = calibrateConfidence(engines);
      const formatted = formatConfidenceScore(calibration);

      expect(formatted).toContain('❌');
      expect(formatted).toContain('low');
    });

    it('should format low confidence', () => {
      const engines = [createEngineScore('test', 35, 35, 35, 35, 35, 1.0)];
      const calibration = calibrateConfidence(engines);
      const formatted = formatConfidenceScore(calibration);

      expect(formatted).toContain('❌');
      expect(formatted).toContain('low');
    });
  });

  describe('Confidence Report Generation', () => {
    it('should generate comprehensive report', () => {
      const engines = [
        createEngineScore('vader', 75, 85, 90, 80, 88, 0.25),
        createEngineScore('llm', 80, 90, 95, 85, 92, 0.30),
      ];
      const calibration = calibrateConfidence(engines);
      const report = generateConfidenceReport(calibration);

      expect(report).toContain('Confidence Calibration Report');
      expect(report).toContain('vader');
      expect(report).toContain('llm');
      expect(report).toContain('Overall Confidence');
      expect(report).toContain('Quality Assessment');
    });

    it('should include all calibration factors', () => {
      const engines = [createEngineScore('test', 75, 85, 90, 80, 88, 1.0)];
      const calibration = calibrateConfidence(engines);
      const report = generateConfidenceReport(calibration);

      expect(report).toContain('Data Quality Multiplier');
      expect(report).toContain('Source Weighting Factor');
      expect(report).toContain('Temporal Decay');
      expect(report).toContain('Consistency Bonus');
    });
  });

  describe('Confidence Comparison', () => {
    it('should detect improvement', () => {
      const engines1 = [createEngineScore('test', 60, 60, 60, 60, 60, 1.0)];
      const engines2 = [createEngineScore('test', 80, 80, 80, 80, 80, 1.0)];

      const calibration1 = calibrateConfidence(engines1);
      const calibration2 = calibrateConfidence(engines2);

      const comparison = compareConfidenceScores(calibration1, calibration2);
      expect(comparison.improvement).toBe('improved');
      expect(comparison.difference).toBeGreaterThan(0);
    });

    it('should detect degradation', () => {
      const engines1 = [createEngineScore('test', 80, 80, 80, 80, 80, 1.0)];
      const engines2 = [createEngineScore('test', 60, 60, 60, 60, 60, 1.0)];

      const calibration1 = calibrateConfidence(engines1);
      const calibration2 = calibrateConfidence(engines2);

      const comparison = compareConfidenceScores(calibration1, calibration2);
      expect(comparison.improvement).toBe('degraded');
      expect(comparison.difference).toBeLessThan(0);
    });

    it('should detect unchanged', () => {
      const engines = [createEngineScore('test', 75, 75, 75, 75, 75, 1.0)];

      const calibration1 = calibrateConfidence(engines);
      const calibration2 = calibrateConfidence(engines);

      const comparison = compareConfidenceScores(calibration1, calibration2);
      expect(comparison.improvement).toBe('unchanged');
      expect(comparison.difference).toBe(0);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle precision issue: 44.99999999', () => {
      const engines = [
        createEngineScore('vader', 44.99999999, 85, 90, 80, 88, 0.25),
        createEngineScore('llm', 45.00000001, 90, 95, 85, 92, 0.30),
      ];

      const calibration = calibrateConfidence(engines);
      const validation = validateConfidenceScore(calibration.overallConfidence);

      expect(validation.isValid).toBe(true);
      expect(calibration.overallConfidence).toBeCloseTo(45, 0);
    });

    it('should handle multiple engines with different qualities', () => {
      const engines = [
        createEngineScore('vader', 75, 85, 90, 80, 88, 0.25),
        createEngineScore('llm', 80, 90, 95, 85, 92, 0.30),
        createEngineScore('temporal', 70, 80, 85, 75, 85, 0.20),
        createEngineScore('source', 65, 75, 80, 70, 80, 0.15),
        createEngineScore('consistency', 72, 82, 87, 78, 86, 0.10),
      ];

      const calibration = calibrateConfidence(engines);
      expect(calibration.overallConfidence).toBeGreaterThan(0);
      expect(calibration.overallConfidence).toBeLessThanOrEqual(100);
      expect(calibration.engineScores.length).toBe(5);
    });

    it('should handle temporal analysis with decay', () => {
      const engines = [
        createEngineScore('temporal', 80, 85, 90, 80, 88, 1.0),
      ];

      // Fresh analysis
      const calibrationFresh = calibrateConfidence(engines, 1000); // 1 second old
      // Old analysis
      const calibrationOld = calibrateConfidence(engines, 30 * 24 * 60 * 60 * 1000); // 30 days old

      expect(calibrationFresh.overallConfidence).toBeGreaterThan(calibrationOld.overallConfidence);
      expect(calibrationFresh.calibrationFactors.temporalDecay).toBeCloseTo(1.0, 1);
      expect(calibrationOld.calibrationFactors.temporalDecay).toBeLessThan(0.5);
    });
  });
});
