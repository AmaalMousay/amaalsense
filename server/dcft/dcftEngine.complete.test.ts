import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { calculateGMI, calculateCFI, calculateHRI } from './dcftEngine';

describe('DCFT Engine - Complete Test Suite', () => {
  describe('GMI (Global Mood Index) Calculation', () => {
    it('should calculate GMI for positive emotions', () => {
      const emotions = [
        { type: 'joy', intensity: 0.9 },
        { type: 'hope', intensity: 0.8 },
        { type: 'enthusiasm', intensity: 0.85 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBeGreaterThan(0.7);
      expect(gmi).toBeLessThanOrEqual(1);
    });

    it('should calculate GMI for negative emotions', () => {
      const emotions = [
        { type: 'fear', intensity: 0.9 },
        { type: 'sadness', intensity: 0.85 },
        { type: 'anger', intensity: 0.8 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBeLessThan(0.4);
      expect(gmi).toBeGreaterThanOrEqual(0);
    });

    it('should calculate GMI for mixed emotions', () => {
      const emotions = [
        { type: 'joy', intensity: 0.6 },
        { type: 'fear', intensity: 0.4 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBeGreaterThan(0.3);
      expect(gmi).toBeLessThan(0.7);
    });

    it('should handle empty emotion list', () => {
      const emotions: any[] = [];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBe(0.5); // neutral
    });

    it('should normalize GMI to 0-1 range', () => {
      const emotions = [
        { type: 'joy', intensity: 1 },
        { type: 'joy', intensity: 1 },
        { type: 'joy', intensity: 1 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBeLessThanOrEqual(1);
      expect(gmi).toBeGreaterThanOrEqual(0);
    });
  });

  describe('CFI (Collective Feeling Index) Calculation', () => {
    it('should calculate high CFI for coherent emotions', () => {
      const emotions = [
        { type: 'joy', intensity: 0.9 },
        { type: 'joy', intensity: 0.88 },
        { type: 'joy', intensity: 0.92 }
      ];
      const cfi = calculateCFI(emotions);
      expect(cfi).toBeGreaterThan(0.8);
    });

    it('should calculate low CFI for diverse emotions', () => {
      const emotions = [
        { type: 'joy', intensity: 0.9 },
        { type: 'fear', intensity: 0.1 },
        { type: 'sadness', intensity: 0.2 },
        { type: 'anger', intensity: 0.85 }
      ];
      const cfi = calculateCFI(emotions);
      expect(cfi).toBeLessThan(0.5);
    });

    it('should detect polarization', () => {
      const emotions = [
        { type: 'joy', intensity: 0.95 },
        { type: 'fear', intensity: 0.95 }
      ];
      const cfi = calculateCFI(emotions);
      expect(cfi).toBeLessThan(0.3);
    });
  });

  describe('HRI (Human Resilience Index) Calculation', () => {
    it('should calculate high HRI for resilient societies', () => {
      const emotionHistory = [
        [
          { type: 'fear', intensity: 0.8 },
          { type: 'sadness', intensity: 0.7 }
        ],
        [
          { type: 'hope', intensity: 0.6 },
          { type: 'determination', intensity: 0.7 }
        ],
        [
          { type: 'joy', intensity: 0.5 },
          { type: 'confidence', intensity: 0.6 }
        ]
      ];
      const hri = calculateHRI(emotionHistory);
      expect(hri).toBeGreaterThan(0.6);
    });

    it('should calculate low HRI for fragile societies', () => {
      const emotionHistory = [
        [
          { type: 'fear', intensity: 0.9 },
          { type: 'despair', intensity: 0.85 }
        ],
        [
          { type: 'fear', intensity: 0.92 },
          { type: 'despair', intensity: 0.88 }
        ],
        [
          { type: 'fear', intensity: 0.95 },
          { type: 'despair', intensity: 0.9 }
        ]
      ];
      const hri = calculateHRI(emotionHistory);
      expect(hri).toBeLessThan(0.3);
    });

    it('should measure recovery capacity', () => {
      const emotionHistory = [
        [{ type: 'fear', intensity: 0.9 }],
        [{ type: 'hope', intensity: 0.7 }],
        [{ type: 'joy', intensity: 0.6 }]
      ];
      const hri = calculateHRI(emotionHistory);
      expect(hri).toBeGreaterThan(0.5);
    });
  });

  describe('Performance Tests', () => {
    it('should process emotions in less than 100ms', () => {
      const emotions = Array.from({ length: 1000 }, (_, i) => ({
        type: ['joy', 'fear', 'sadness', 'anger'][i % 4],
        intensity: Math.random()
      }));

      const startTime = performance.now();
      calculateGMI(emotions);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(100);
    });

    it('should handle large emotion histories', () => {
      const emotionHistory = Array.from({ length: 365 }, () =>
        Array.from({ length: 100 }, () => ({
          type: ['joy', 'fear', 'sadness', 'anger'][Math.floor(Math.random() * 4)],
          intensity: Math.random()
        }))
      );

      const startTime = performance.now();
      calculateHRI(emotionHistory);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(500);
    });

    it('should maintain consistent performance with repeated calls', () => {
      const emotions = Array.from({ length: 100 }, () => ({
        type: 'joy',
        intensity: Math.random()
      }));

      const durations: number[] = [];
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        calculateGMI(emotions);
        durations.push(performance.now() - startTime);
      }

      const avgDuration = durations.reduce((a, b) => a + b) / durations.length;
      const maxDuration = Math.max(...durations);

      expect(avgDuration).toBeLessThan(50);
      expect(maxDuration).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single emotion', () => {
      const emotions = [{ type: 'joy', intensity: 0.8 }];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBe(0.8);
    });

    it('should handle zero intensity emotions', () => {
      const emotions = [
        { type: 'joy', intensity: 0 },
        { type: 'fear', intensity: 0 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBe(0.5);
    });

    it('should handle extreme values', () => {
      const emotions = [
        { type: 'joy', intensity: 1.0 },
        { type: 'fear', intensity: 0.0 }
      ];
      const gmi = calculateGMI(emotions);
      expect(gmi).toBe(0.5);
    });

    it('should be consistent with same input', () => {
      const emotions = [
        { type: 'joy', intensity: 0.7 },
        { type: 'sadness', intensity: 0.3 }
      ];
      const gmi1 = calculateGMI(emotions);
      const gmi2 = calculateGMI(emotions);
      expect(gmi1).toBe(gmi2);
    });
  });

  describe('Data Validation', () => {
    it('should validate emotion types', () => {
      const emotions = [
        { type: 'joy', intensity: 0.8 },
        { type: 'invalid_emotion', intensity: 0.5 }
      ];
      expect(() => calculateGMI(emotions)).not.toThrow();
    });

    it('should validate intensity ranges', () => {
      const emotions = [
        { type: 'joy', intensity: 0.8 },
        { type: 'fear', intensity: 1.5 } // invalid
      ];
      expect(() => calculateGMI(emotions)).not.toThrow();
    });

    it('should handle null values gracefully', () => {
      const emotions: any = [
        { type: 'joy', intensity: 0.8 },
        null
      ];
      expect(() => calculateGMI(emotions.filter(Boolean))).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should calculate all metrics together', () => {
      const emotions = [
        { type: 'joy', intensity: 0.7 },
        { type: 'hope', intensity: 0.6 },
        { type: 'fear', intensity: 0.3 }
      ];

      const gmi = calculateGMI(emotions);
      const cfi = calculateCFI(emotions);

      expect(gmi).toBeGreaterThan(0.4);
      expect(cfi).toBeGreaterThan(0.3);
      expect(gmi + cfi).toBeGreaterThan(0.7);
    });

    it('should maintain metric relationships', () => {
      const positiveEmotions = [
        { type: 'joy', intensity: 0.9 },
        { type: 'hope', intensity: 0.85 }
      ];

      const negativeEmotions = [
        { type: 'fear', intensity: 0.9 },
        { type: 'sadness', intensity: 0.85 }
      ];

      const gmiPositive = calculateGMI(positiveEmotions);
      const gmiNegative = calculateGMI(negativeEmotions);

      expect(gmiPositive).toBeGreaterThan(gmiNegative);
    });
  });
});
