/**
 * Response Builder Tests
 * اختبارات بناء الردود بالهيكل الثابت
 */

import { describe, it, expect } from 'vitest';
import { 
  generateExecutiveSummary,
  determineDecisionSignal,
  extractCausalFactors,
  generateTimeforecast,
  generatePsychologicalInsight,
  generateClosingQuestion,
  buildStructuredResponse
} from './responseBuilder';

describe('Response Builder', () => {
  const baseData = {
    topic: 'الاقتصاد الليبي',
    gmi: 0,
    cfi: 67,
    hri: 67,
    dominantEmotion: 'curiosity',
    confidence: 70,
    detectedCountry: 'Libya'
  };

  describe('generateExecutiveSummary', () => {
    it('should generate summary for high fear high hope', () => {
      const summary = generateExecutiveSummary(baseData);
      
      expect(summary).toContain('الاقتصاد الليبي');
      expect(summary).toContain('توتر حذر');
    });

    it('should generate crisis summary for high fear low hope', () => {
      const summary = generateExecutiveSummary({
        ...baseData,
        cfi: 75,
        hri: 25
      });
      
      expect(summary).toContain('أزمة نفسية');
    });

    it('should generate positive summary for good conditions', () => {
      const summary = generateExecutiveSummary({
        ...baseData,
        gmi: 40,
        cfi: 30,
        hri: 70
      });
      
      expect(summary).toContain('تفاؤل');
    });
  });

  describe('determineDecisionSignal', () => {
    it('should return watch signal for balanced tension', () => {
      const signal = determineDecisionSignal(baseData);
      
      expect(signal.type).toBe('watch');
      expect(signal.icon).toBe('👁️');
      expect(signal.text).toContain('مراقبة');
    });

    it('should return high risk for very high fear', () => {
      const signal = determineDecisionSignal({
        ...baseData,
        cfi: 80
      });
      
      expect(signal.type).toBe('high_risk');
      expect(signal.icon).toBe('🚨');
    });

    it('should return opportunity for positive conditions', () => {
      const signal = determineDecisionSignal({
        ...baseData,
        gmi: 40,
        cfi: 30
      });
      
      expect(signal.type).toBe('opportunity');
      expect(signal.icon).toBe('✅');
    });
  });

  describe('extractCausalFactors', () => {
    it('should extract economic factors for high fear', () => {
      const factors = extractCausalFactors({
        ...baseData,
        newsHeadlines: ['ارتفاع سعر الدولار في السوق السوداء']
      });
      
      expect(factors.economic.length).toBeGreaterThan(0);
    });

    it('should extract media factors when news present', () => {
      const factors = extractCausalFactors({
        ...baseData,
        newsHeadlines: ['أخبار عاجلة عن الأزمة']
      });
      
      expect(factors.media.length).toBeGreaterThan(0);
    });

    it('should provide default factors when no data', () => {
      const factors = extractCausalFactors({
        ...baseData,
        newsHeadlines: []
      });
      
      // Should have at least some factors
      const totalFactors = factors.economic.length + factors.media.length + 
                          factors.political.length + factors.social.length;
      expect(totalFactors).toBeGreaterThan(0);
    });
  });

  describe('generateTimeforecast', () => {
    it('should predict rapid change for extreme conditions', () => {
      const forecast = generateTimeforecast({
        ...baseData,
        cfi: 80
      });
      
      expect(forecast).toContain('24-48 ساعة');
    });

    it('should predict week for balanced tension', () => {
      const forecast = generateTimeforecast(baseData);
      
      expect(forecast).toContain('الأسبوع');
    });
  });

  describe('generatePsychologicalInsight', () => {
    it('should generate insight for high fear high hope', () => {
      const insight = generatePsychologicalInsight(baseData);
      
      expect(insight.length).toBeGreaterThan(10);
      expect(insight).toContain('ترقّب');
    });

    it('should include emotion-based insight', () => {
      const insight = generatePsychologicalInsight({
        ...baseData,
        dominantEmotion: 'fear'
      });
      
      expect(insight.length).toBeGreaterThan(10);
    });
  });

  describe('generateClosingQuestion', () => {
    it('should generate relevant question', () => {
      const question = generateClosingQuestion(baseData);
      
      expect(question).toContain('هل');
    });

    it('should ask about fear reduction for high fear', () => {
      const question = generateClosingQuestion({
        ...baseData,
        cfi: 70
      });
      
      expect(question).toContain('الخوف');
    });

    it('should ask about hope for high hope', () => {
      const question = generateClosingQuestion({
        ...baseData,
        hri: 70,
        cfi: 40
      });
      
      expect(question).toContain('الأمل');
    });
  });

  describe('buildStructuredResponse', () => {
    it('should build complete structured response', () => {
      const response = buildStructuredResponse(baseData);
      
      // Check all required fields exist
      expect(response.executiveSummary).toBeTruthy();
      expect(response.decisionSignal).toBeTruthy();
      expect(response.decisionSignalIcon).toBeTruthy();
      expect(response.causalFactors).toBeTruthy();
      expect(response.timeforecast).toBeTruthy();
      expect(response.psychologicalInsight).toBeTruthy();
      expect(response.closingQuestion).toBeTruthy();
      expect(response.fullResponse).toBeTruthy();
    });

    it('should have correct structure in fullResponse', () => {
      const response = buildStructuredResponse(baseData);
      
      // Check structure elements
      expect(response.fullResponse).toContain('**الخلاصة:**');
      expect(response.fullResponse).toContain('**إشارة القرار:**');
      expect(response.fullResponse).toContain('**لماذا هذا المزاج؟**');
      expect(response.fullResponse).toContain('**التوقع الزمني:**');
      expect(response.fullResponse).toContain('**القراءة النفسية:**');
      expect(response.fullResponse).toContain('هل');
    });

    it('should start with summary (not robotic intro)', () => {
      const response = buildStructuredResponse(baseData);
      
      // Should NOT start with robotic phrases
      expect(response.fullResponse).not.toMatch(/^بناءً على/);
      expect(response.fullResponse).not.toMatch(/^بصفتي/);
      expect(response.fullResponse).not.toMatch(/^As AmalSense/);
      
      // Should start with الخلاصة
      expect(response.fullResponse.startsWith('**الخلاصة:**')).toBe(true);
    });

    it('should include causal factors in Why section', () => {
      const response = buildStructuredResponse({
        ...baseData,
        newsHeadlines: ['ارتفاع سعر الدولار']
      });
      
      // Should have causal factors
      expect(response.fullResponse).toContain('عوامل');
    });
  });
});
