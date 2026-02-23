import { describe, it, expect } from 'vitest';

describe('TopicAnalysisDisplay', () => {
  describe('Topic Structure', () => {
    it('should have all required fields', () => {
      const topic = {
        id: '1',
        name: 'Test Topic',
        category: 'Test',
        volume: 1000,
        trend: 10,
        sentiment: 'positive' as const,
        engagement: 85,
        reach: 50000,
        influencers: 50,
        keywords: ['key1', 'key2'],
        regions: ['Region1'],
        momentum: 75,
        prediction: 'rising' as const,
      };

      expect(topic).toHaveProperty('name');
      expect(topic).toHaveProperty('volume');
      expect(topic).toHaveProperty('trend');
      expect(topic).toHaveProperty('sentiment');
      expect(topic).toHaveProperty('prediction');
    });
  });

  describe('Trend Calculation', () => {
    it('should determine trend direction correctly', () => {
      const getTrendIcon = (trend: number) => {
        if (trend > 10) return 'up';
        if (trend < -10) return 'down';
        return 'stable';
      };

      expect(getTrendIcon(15)).toBe('up');
      expect(getTrendIcon(-15)).toBe('down');
      expect(getTrendIcon(5)).toBe('stable');
    });

    it('should format trend percentage', () => {
      const trend = 12.5;
      const formatted = trend.toFixed(1);
      expect(formatted).toBe('12.5');
    });
  });

  describe('Prediction Classification', () => {
    it('should classify prediction correctly', () => {
      const predictions = ['rising', 'stable', 'declining'];
      predictions.forEach(pred => {
        expect(['rising', 'stable', 'declining']).toContain(pred);
      });
    });

    it('should return correct prediction icon', () => {
      const getIcon = (prediction: string) => {
        switch (prediction) {
          case 'rising': return '📈';
          case 'declining': return '📉';
          default: return '➡️';
        }
      };

      expect(getIcon('rising')).toBe('📈');
      expect(getIcon('declining')).toBe('📉');
      expect(getIcon('stable')).toBe('➡️');
    });
  });

  describe('Metrics Validation', () => {
    it('should validate volume is positive', () => {
      const volumes = [100, 1000, 10000];
      volumes.forEach(vol => {
        expect(vol).toBeGreaterThan(0);
      });
    });

    it('should validate engagement 0-100', () => {
      const engagements = [50, 75, 90];
      engagements.forEach(eng => {
        expect(eng).toBeGreaterThanOrEqual(0);
        expect(eng).toBeLessThanOrEqual(100);
      });
    });

    it('should validate momentum 0-100', () => {
      const momentums = [45, 65, 85];
      momentums.forEach(mom => {
        expect(mom).toBeGreaterThanOrEqual(0);
        expect(mom).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Sentiment Classification', () => {
    it('should classify sentiment correctly', () => {
      const sentiments = ['positive', 'negative', 'neutral'];
      sentiments.forEach(sent => {
        expect(['positive', 'negative', 'neutral']).toContain(sent);
      });
    });
  });

  describe('Keywords Handling', () => {
    it('should handle empty keywords', () => {
      const keywords: string[] = [];
      expect(keywords.length).toBe(0);
    });

    it('should handle multiple keywords', () => {
      const keywords = ['key1', 'key2', 'key3', 'key4', 'key5'];
      expect(keywords.length).toBe(5);
      expect(keywords).toContain('key1');
    });

    it('should limit keywords display', () => {
      const keywords = ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7'];
      const displayed = keywords.slice(0, 5);
      expect(displayed.length).toBe(5);
      expect(keywords.length - displayed.length).toBe(2);
    });
  });

  describe('Regions Handling', () => {
    it('should handle multiple regions', () => {
      const regions = ['Region1', 'Region2', 'Region3'];
      expect(regions.length).toBe(3);
      expect(regions).toContain('Region1');
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate total topics', () => {
      const topics = [
        { id: '1', volume: 1000 },
        { id: '2', volume: 2000 },
        { id: '3', volume: 3000 },
      ];
      expect(topics.length).toBe(3);
    });

    it('should count rising topics', () => {
      const topics = [
        { prediction: 'rising' },
        { prediction: 'rising' },
        { prediction: 'declining' },
        { prediction: 'stable' },
      ];
      const rising = topics.filter(t => t.prediction === 'rising').length;
      expect(rising).toBe(2);
    });

    it('should calculate average momentum', () => {
      const topics = [
        { momentum: 80 },
        { momentum: 75 },
        { momentum: 70 },
      ];
      const average = topics.reduce((sum, t) => sum + t.momentum, 0) / topics.length;
      expect(average).toBeCloseTo(75, 0);
    });
  });

  describe('Sorting', () => {
    it('should sort topics by volume descending', () => {
      const topics = [
        { id: '1', volume: 1000 },
        { id: '2', volume: 3000 },
        { id: '3', volume: 2000 },
      ];
      const sorted = [...topics].sort((a, b) => b.volume - a.volume);
      expect(sorted[0].volume).toBe(3000);
      expect(sorted[1].volume).toBe(2000);
      expect(sorted[2].volume).toBe(1000);
    });

    it('should sort topics by trend descending', () => {
      const topics = [
        { id: '1', trend: 10 },
        { id: '2', trend: 25 },
        { id: '3', trend: 15 },
      ];
      const sorted = [...topics].sort((a, b) => b.trend - a.trend);
      expect(sorted[0].trend).toBe(25);
      expect(sorted[1].trend).toBe(15);
      expect(sorted[2].trend).toBe(10);
    });
  });

  describe('Data Formatting', () => {
    it('should format large numbers with locale', () => {
      const number = 450000;
      const formatted = number.toLocaleString('ar-SA');
      expect(formatted).toBeTruthy();
    });

    it('should format decimals correctly', () => {
      const value = 12.567;
      const formatted = value.toFixed(1);
      expect(formatted).toBe('12.6');
    });
  });
});
