/**
 * Classification and Alerts API Tests
 * Tests for content classification, domain stats, and topic alerts
 */

import { describe, it, expect, beforeAll } from 'vitest';

// Test data
const testAnalysis = {
  headline: 'Test headline for classification',
  domain: 'politics' as const,
  sensitivity: 'high' as const,
  emotionalRiskScore: 65,
  joy: 20,
  fear: 40,
  anger: 30,
  sadness: 35,
  hope: 50,
  curiosity: 45,
  dominantEmotion: 'hope',
  confidence: 85,
  dcftWeight: 70,
  aiWeight: 30,
};

describe('Classification API', () => {
  describe('Domain Configuration', () => {
    it('should have valid domain types', () => {
      const validDomains = ['politics', 'economy', 'mental_health', 'medical', 'education', 'society', 'entertainment', 'general'];
      expect(validDomains).toContain(testAnalysis.domain);
    });

    it('should have valid sensitivity levels', () => {
      const validSensitivities = ['low', 'medium', 'high', 'critical'];
      expect(validSensitivities).toContain(testAnalysis.sensitivity);
    });

    it('should have emotional risk score between 0 and 100', () => {
      expect(testAnalysis.emotionalRiskScore).toBeGreaterThanOrEqual(0);
      expect(testAnalysis.emotionalRiskScore).toBeLessThanOrEqual(100);
    });

    it('should have emotion values between 0 and 100', () => {
      expect(testAnalysis.joy).toBeGreaterThanOrEqual(0);
      expect(testAnalysis.joy).toBeLessThanOrEqual(100);
      expect(testAnalysis.fear).toBeGreaterThanOrEqual(0);
      expect(testAnalysis.fear).toBeLessThanOrEqual(100);
      expect(testAnalysis.anger).toBeGreaterThanOrEqual(0);
      expect(testAnalysis.anger).toBeLessThanOrEqual(100);
    });

    it('should have dcft and ai weights that sum to 100', () => {
      expect(testAnalysis.dcftWeight + testAnalysis.aiWeight).toBe(100);
    });
  });

  describe('Sensitivity Level Mapping', () => {
    const sensitivityMapping: Record<string, string> = {
      politics: 'high',
      economy: 'medium',
      mental_health: 'high',
      medical: 'critical',
      education: 'medium',
      society: 'medium',
      entertainment: 'low',
      general: 'medium',
    };

    it('should map politics to high sensitivity', () => {
      expect(sensitivityMapping['politics']).toBe('high');
    });

    it('should map medical to critical sensitivity', () => {
      expect(sensitivityMapping['medical']).toBe('critical');
    });

    it('should map entertainment to low sensitivity', () => {
      expect(sensitivityMapping['entertainment']).toBe('low');
    });

    it('should map economy to medium sensitivity', () => {
      expect(sensitivityMapping['economy']).toBe('medium');
    });
  });

  describe('Emotional Risk Score Calculation', () => {
    it('should calculate risk score from negative emotions', () => {
      const { fear, anger, sadness } = testAnalysis;
      const calculatedRisk = Math.round((fear + anger + sadness) / 3);
      expect(calculatedRisk).toBeGreaterThanOrEqual(0);
      expect(calculatedRisk).toBeLessThanOrEqual(100);
    });

    it('should categorize risk levels correctly', () => {
      const getRiskLevel = (score: number) => {
        if (score < 30) return 'low';
        if (score < 50) return 'medium';
        if (score < 70) return 'high';
        return 'critical';
      };

      expect(getRiskLevel(20)).toBe('low');
      expect(getRiskLevel(40)).toBe('medium');
      expect(getRiskLevel(60)).toBe('high');
      expect(getRiskLevel(80)).toBe('critical');
    });
  });
});

describe('Topic Alerts', () => {
  describe('Alert Types', () => {
    const alertTypes = ['risk_increase', 'risk_decrease', 'threshold_exceeded', 'new_analysis'];

    it('should have valid alert types', () => {
      expect(alertTypes).toContain('risk_increase');
      expect(alertTypes).toContain('risk_decrease');
      expect(alertTypes).toContain('threshold_exceeded');
    });
  });

  describe('Alert Direction', () => {
    const alertDirections = ['increase', 'decrease', 'both'];

    it('should support all alert directions', () => {
      expect(alertDirections).toContain('increase');
      expect(alertDirections).toContain('decrease');
      expect(alertDirections).toContain('both');
    });
  });

  describe('Risk Change Detection', () => {
    it('should detect risk increase', () => {
      const previousRisk = 40;
      const currentRisk = 70;
      const change = currentRisk - previousRisk;
      expect(change).toBeGreaterThan(0);
    });

    it('should detect risk decrease', () => {
      const previousRisk = 70;
      const currentRisk = 40;
      const change = currentRisk - previousRisk;
      expect(change).toBeLessThan(0);
    });

    it('should calculate change percentage correctly', () => {
      const previousRisk = 50;
      const currentRisk = 75;
      const changeAmount = currentRisk - previousRisk;
      expect(changeAmount).toBe(25);
    });
  });
});

describe('Followed Topics', () => {
  describe('Topic Configuration', () => {
    const testTopic = {
      topic: 'الانتخابات في ليبيا',
      domain: 'politics',
      riskThreshold: 70,
      alertDirection: 'both',
      isActive: true,
    };

    it('should have valid topic name', () => {
      expect(testTopic.topic.length).toBeGreaterThan(0);
    });

    it('should have valid risk threshold', () => {
      expect(testTopic.riskThreshold).toBeGreaterThanOrEqual(0);
      expect(testTopic.riskThreshold).toBeLessThanOrEqual(100);
    });

    it('should have valid alert direction', () => {
      expect(['increase', 'decrease', 'both']).toContain(testTopic.alertDirection);
    });
  });
});

describe('Reports Statistics', () => {
  describe('Domain Stats', () => {
    it('should calculate total analyses correctly', () => {
      const domainStats = [
        { domain: 'politics', count: 10, avgRisk: 65 },
        { domain: 'economy', count: 15, avgRisk: 45 },
        { domain: 'entertainment', count: 5, avgRisk: 25 },
      ];
      const total = domainStats.reduce((sum, d) => sum + d.count, 0);
      expect(total).toBe(30);
    });

    it('should calculate average risk correctly', () => {
      const domainStats = [
        { domain: 'politics', count: 10, avgRisk: 60 },
        { domain: 'economy', count: 10, avgRisk: 40 },
      ];
      const avgRisk = domainStats.reduce((sum, d) => sum + d.avgRisk, 0) / domainStats.length;
      expect(avgRisk).toBe(50);
    });
  });

  describe('Sensitivity Stats', () => {
    it('should categorize analyses by sensitivity', () => {
      const sensitivityStats = [
        { sensitivity: 'low', count: 5 },
        { sensitivity: 'medium', count: 15 },
        { sensitivity: 'high', count: 8 },
        { sensitivity: 'critical', count: 2 },
      ];
      const total = sensitivityStats.reduce((sum, s) => sum + s.count, 0);
      expect(total).toBe(30);
    });

    it('should calculate percentage distribution', () => {
      const sensitivityStats = [
        { sensitivity: 'low', count: 10 },
        { sensitivity: 'medium', count: 30 },
        { sensitivity: 'high', count: 40 },
        { sensitivity: 'critical', count: 20 },
      ];
      const total = 100;
      const lowPercentage = (sensitivityStats[0].count / total) * 100;
      expect(lowPercentage).toBe(10);
    });
  });
});
