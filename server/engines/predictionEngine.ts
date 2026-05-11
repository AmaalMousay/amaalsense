/**
 * Advanced Prediction Engine (محرك التنبؤ المتقدم)
 * 
 * نظام تنبؤ متعدد الطبقات يعتمد على:
 * 1. Exponential Moving Average (EMA) - للاتجاهات قصيرة وطويلة المدى
 * 2. Volatility Analysis - لقياس عدم الاستقرار
 * 3. Tipping Point Detection - لاكتشاف نقاط التحول
 * 4. Multi-factor Risk Scoring - لتقييم المخاطر
 * 5. Pattern Matching - لمطابقة الأنماط التاريخية
 * 6. LLM-Enhanced Interpretation - لتفسير ذكي بالعربية والإنجليزية
 */

import { invokeLLM } from './_core/llm';

// ============================================
// TYPES
// ============================================

export interface EmotionalDataPoint {
  timestamp: number; // Unix ms
  gmi: number;       // -100 to 100
  cfi: number;       // 0 to 100
  hri: number;       // 0 to 100
  dominantEmotion?: string;
  emotions?: Record<string, number>;
  sourceCount?: number;
  confidence?: number;
  countryCode?: string;
}

export interface TrendAnalysis {
  direction: 'rising' | 'falling' | 'stable' | 'volatile';
  strength: number;        // 0-100
  shortTermSlope: number;  // EMA-based
  longTermSlope: number;   // EMA-based
  momentum: number;        // Rate of change
  acceleration: number;    // Change in rate of change
  divergence: number;      // Short vs long term divergence (MACD-like)
}

export interface TippingPoint {
  type: 'crisis_onset' | 'recovery_start' | 'escalation' | 'stabilization' | 'emotional_shift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;     // 0-1
  timeframe: string;       // e.g., "24-48 hours"
  description: string;
  descriptionAr: string;
  indicators: string[];
  triggerConditions: {
    gmiThreshold?: number;
    cfiThreshold?: number;
    hriThreshold?: number;
    volatilityThreshold?: number;
  };
}

export interface RiskScore {
  overall: number;          // 0-100
  components: {
    emotionalInstability: number;  // 0-100
    fearEscalation: number;        // 0-100
    hopeDegradation: number;       // 0-100
    moodDeterioration: number;     // 0-100
    volatility: number;            // 0-100
    trendDivergence: number;       // 0-100
  };
  level: 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
  factors: string[];
  factorsAr: string[];
}

export interface Prediction {
  timeframe: '6h' | '24h' | '48h' | '7d';
  predictedGMI: number;
  predictedCFI: number;
  predictedHRI: number;
  predictedDominantEmotion: string;
  confidence: number;       // 0-1
  scenarioName: string;
  scenarioNameAr: string;
  description: string;
  descriptionAr: string;
  riskScore: RiskScore;
}

export interface PredictionReport {
  countryCode: string;
  countryName: string;
  generatedAt: Date;
  currentState: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    dataPoints: number;
  };
  trends: {
    gmi: TrendAnalysis;
    cfi: TrendAnalysis;
    hri: TrendAnalysis;
  };
  tippingPoints: TippingPoint[];
  predictions: Prediction[];
  overallRisk: RiskScore;
  aiInterpretation?: string;
  aiInterpretationAr?: string;
  historicalAccuracy: number;
}

// ============================================
// CORE MATH FUNCTIONS
// ============================================

/**
 * Exponential Moving Average (EMA)
 * أكثر حساسية للتغيرات الأخيرة من المتوسط البسيط
 */
function calculateEMA(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  if (values.length === 1) return [values[0]];
  
  const multiplier = 2 / (period + 1);
  const ema: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    ema.push((values[i] - ema[i - 1]) * multiplier + ema[i - 1]);
  }
  
  return ema;
}

/**
 * Standard Deviation (الانحراف المعياري)
 */
function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
}

/**
 * Bollinger Bands - لقياس التقلب
 */
function bollingerBands(values: number[], period: number = 20, multiplier: number = 2) {
  const sma = values.slice(-period).reduce((a, b) => a + b, 0) / Math.min(period, values.length);
  const std = standardDeviation(values.slice(-period));
  return {
    upper: sma + multiplier * std,
    middle: sma,
    lower: sma - multiplier * std,
    bandwidth: std * 2 * multiplier,
  };
}

/**
 * Rate of Change (ROC) - معدل التغير
 */
function rateOfChange(values: number[], period: number = 1): number {
  if (values.length < period + 1) return 0;
  const current = values[values.length - 1];
  const previous = values[values.length - 1 - period];
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Weighted Linear Regression - انحدار خطي مرجح
 * يعطي وزن أكبر للبيانات الأحدث
 */
function weightedLinearRegression(values: number[]): { slope: number; intercept: number; r2: number } {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] || 0, r2: 0 };
  
  let sumW = 0, sumWX = 0, sumWY = 0, sumWXY = 0, sumWX2 = 0;
  
  for (let i = 0; i < n; i++) {
    const w = (i + 1) / n; // More recent = higher weight
    sumW += w;
    sumWX += w * i;
    sumWY += w * values[i];
    sumWXY += w * i * values[i];
    sumWX2 += w * i * i;
  }
  
  const denominator = sumW * sumWX2 - sumWX * sumWX;
  if (Math.abs(denominator) < 1e-10) return { slope: 0, intercept: values[n - 1], r2: 0 };
  
  const slope = (sumW * sumWXY - sumWX * sumWY) / denominator;
  const intercept = (sumWY - slope * sumWX) / sumW;
  
  // Calculate R² (coefficient of determination)
  const meanY = sumWY / sumW;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const w = (i + 1) / n;
    const predicted = slope * i + intercept;
    ssRes += w * Math.pow(values[i] - predicted, 2);
    ssTot += w * Math.pow(values[i] - meanY, 2);
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  
  return { slope, intercept, r2: Math.max(0, r2) };
}

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Analyze trend for a single index
 */
export function analyzeTrend(values: number[]): TrendAnalysis {
  if (values.length < 3) {
    return {
      direction: 'stable',
      strength: 0,
      shortTermSlope: 0,
      longTermSlope: 0,
      momentum: 0,
      acceleration: 0,
      divergence: 0,
    };
  }
  
  // Short-term EMA (last 6 points)
  const shortEMA = calculateEMA(values, Math.min(6, values.length));
  // Long-term EMA (last 20 points)
  const longEMA = calculateEMA(values, Math.min(20, values.length));
  
  // Short-term slope (last 6 points)
  const shortRegression = weightedLinearRegression(values.slice(-Math.min(6, values.length)));
  // Long-term slope (all points)
  const longRegression = weightedLinearRegression(values);
  
  // Momentum (rate of change over last 3 points)
  const momentum = rateOfChange(values, Math.min(3, values.length - 1));
  
  // Acceleration (change in momentum)
  const recentMomentum = values.length >= 4 
    ? rateOfChange(values.slice(0, -1), Math.min(3, values.length - 2))
    : 0;
  const acceleration = momentum - recentMomentum;
  
  // MACD-like divergence
  const shortEMALast = shortEMA[shortEMA.length - 1];
  const longEMALast = longEMA[longEMA.length - 1];
  const divergence = shortEMALast - longEMALast;
  
  // Determine direction
  const volatility = standardDeviation(values.slice(-Math.min(10, values.length)));
  let direction: TrendAnalysis['direction'];
  
  if (volatility > 15) {
    direction = 'volatile';
  } else if (Math.abs(shortRegression.slope) < 0.5) {
    direction = 'stable';
  } else if (shortRegression.slope > 0) {
    direction = 'rising';
  } else {
    direction = 'falling';
  }
  
  // Strength (0-100)
  const strength = Math.min(100, Math.abs(shortRegression.slope) * 10 + Math.abs(momentum) * 2);
  
  return {
    direction,
    strength: Math.round(strength),
    shortTermSlope: Number(shortRegression.slope.toFixed(3)),
    longTermSlope: Number(longRegression.slope.toFixed(3)),
    momentum: Number(momentum.toFixed(2)),
    acceleration: Number(acceleration.toFixed(2)),
    divergence: Number(divergence.toFixed(2)),
  };
}

// ============================================
// TIPPING POINT DETECTION
// ============================================

/**
 * Detect potential tipping points based on multiple indicators
 */
export function detectTippingPoints(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis }
): TippingPoint[] {
  const tippingPoints: TippingPoint[] = [];
  
  if (data.length < 3) return tippingPoints;
  
  const latest = data[data.length - 1];
  const gmiValues = data.map(d => d.gmi);
  const cfiValues = data.map(d => d.cfi);
  const hriValues = data.map(d => d.hri);
  
  const gmiVolatility = standardDeviation(gmiValues.slice(-10));
  const cfiVolatility = standardDeviation(cfiValues.slice(-10));
  const hriVolatility = standardDeviation(hriValues.slice(-10));
  
  const gmiBands = bollingerBands(gmiValues);
  const cfiBands = bollingerBands(cfiValues);
  const hriBands = bollingerBands(hriValues);
  
  // 1. Crisis Onset Detection (بداية أزمة)
  // High CFI + falling GMI + falling HRI + high volatility
  if (latest.cfi > 65 && trends.cfi.direction === 'rising' && trends.gmi.direction === 'falling') {
    const probability = Math.min(0.95, 
      (latest.cfi / 100) * 0.4 + 
      (Math.abs(trends.gmi.momentum) / 50) * 0.3 + 
      (cfiVolatility / 30) * 0.3
    );
    
    tippingPoints.push({
      type: 'crisis_onset',
      severity: probability > 0.7 ? 'critical' : probability > 0.5 ? 'high' : 'medium',
      probability,
      timeframe: probability > 0.7 ? '6-24 hours' : '24-48 hours',
      description: `Crisis indicators detected: Fear rising (CFI: ${latest.cfi}), mood declining (GMI: ${latest.gmi}). Collective anxiety is escalating with ${trends.cfi.strength}% trend strength.`,
      descriptionAr: `مؤشرات أزمة: الخوف يرتفع (CFI: ${latest.cfi})، المزاج يتراجع (GMI: ${latest.gmi}). القلق الجماعي يتصاعد بقوة اتجاه ${trends.cfi.strength}%.`,
      indicators: [
        `CFI at ${latest.cfi} (above 65 threshold)`,
        `GMI trend: ${trends.gmi.direction} (slope: ${trends.gmi.shortTermSlope})`,
        `CFI acceleration: ${trends.cfi.acceleration}`,
      ],
      triggerConditions: {
        cfiThreshold: 65,
        gmiThreshold: -20,
        volatilityThreshold: 15,
      },
    });
  }
  
  // 2. Recovery Start Detection (بداية تعافي)
  // Rising HRI + falling CFI + improving GMI
  if (trends.hri.direction === 'rising' && trends.cfi.direction === 'falling' && latest.hri > 50) {
    const probability = Math.min(0.9,
      (latest.hri / 100) * 0.4 +
      (Math.abs(trends.cfi.momentum) / 50) * 0.3 +
      (trends.hri.strength / 100) * 0.3
    );
    
    if (probability > 0.3) {
      tippingPoints.push({
        type: 'recovery_start',
        severity: 'low',
        probability,
        timeframe: '24-72 hours',
        description: `Recovery signals detected: Hope rising (HRI: ${latest.hri}), fear declining. Collective resilience is strengthening.`,
        descriptionAr: `إشارات تعافي: الأمل يرتفع (HRI: ${latest.hri})، الخوف يتراجع. المرونة الجماعية تتعزز.`,
        indicators: [
          `HRI rising to ${latest.hri}`,
          `CFI declining (slope: ${trends.cfi.shortTermSlope})`,
          `Hope momentum: +${trends.hri.momentum}`,
        ],
        triggerConditions: {
          hriThreshold: 50,
          cfiThreshold: 40,
        },
      });
    }
  }
  
  // 3. Escalation Detection (تصعيد)
  // Rapid CFI increase + GMI dropping fast + high volatility
  if (trends.cfi.acceleration > 2 && trends.gmi.acceleration < -2) {
    const probability = Math.min(0.9,
      (Math.abs(trends.cfi.acceleration) / 10) * 0.4 +
      (Math.abs(trends.gmi.acceleration) / 10) * 0.3 +
      (gmiVolatility / 30) * 0.3
    );
    
    tippingPoints.push({
      type: 'escalation',
      severity: probability > 0.6 ? 'high' : 'medium',
      probability,
      timeframe: '6-24 hours',
      description: `Rapid escalation detected: Fear accelerating (+${trends.cfi.acceleration.toFixed(1)}/period), mood deteriorating. Situation may intensify quickly.`,
      descriptionAr: `تصعيد سريع: الخوف يتسارع (+${trends.cfi.acceleration.toFixed(1)}/فترة)، المزاج يتدهور. الوضع قد يتفاقم بسرعة.`,
      indicators: [
        `CFI acceleration: +${trends.cfi.acceleration.toFixed(1)}`,
        `GMI acceleration: ${trends.gmi.acceleration.toFixed(1)}`,
        `Volatility: ${gmiVolatility.toFixed(1)}`,
      ],
      triggerConditions: {
        volatilityThreshold: 20,
      },
    });
  }
  
  // 4. Stabilization Detection (استقرار)
  // Low volatility + stable trends + moderate values
  if (gmiVolatility < 8 && cfiVolatility < 8 && hriVolatility < 8 &&
      trends.gmi.direction === 'stable' && trends.cfi.direction === 'stable') {
    tippingPoints.push({
      type: 'stabilization',
      severity: 'low',
      probability: 0.7,
      timeframe: '48-72 hours',
      description: `Emotional stabilization detected: Low volatility across all indices. The collective emotional state is settling into a stable pattern.`,
      descriptionAr: `استقرار عاطفي: تقلب منخفض في جميع المؤشرات. الحالة العاطفية الجماعية تستقر في نمط ثابت.`,
      indicators: [
        `GMI volatility: ${gmiVolatility.toFixed(1)} (low)`,
        `CFI volatility: ${cfiVolatility.toFixed(1)} (low)`,
        `All trends stable`,
      ],
      triggerConditions: {
        volatilityThreshold: 8,
      },
    });
  }
  
  // 5. Emotional Shift Detection (تحول عاطفي)
  // Bollinger band breakout - value outside bands
  if (latest.gmi > gmiBands.upper || latest.gmi < gmiBands.lower) {
    const isPositive = latest.gmi > gmiBands.upper;
    tippingPoints.push({
      type: 'emotional_shift',
      severity: 'medium',
      probability: 0.6,
      timeframe: '12-36 hours',
      description: `Emotional shift detected: GMI (${latest.gmi}) broke ${isPositive ? 'above' : 'below'} the expected range (${gmiBands.lower.toFixed(0)} to ${gmiBands.upper.toFixed(0)}). A significant mood change is underway.`,
      descriptionAr: `تحول عاطفي: GMI (${latest.gmi}) تجاوز النطاق المتوقع (${gmiBands.lower.toFixed(0)} إلى ${gmiBands.upper.toFixed(0)}). تغير مزاجي كبير جارٍ.`,
      indicators: [
        `GMI: ${latest.gmi} (${isPositive ? 'above upper' : 'below lower'} band)`,
        `Bollinger bandwidth: ${gmiBands.bandwidth.toFixed(1)}`,
        `Short-term momentum: ${trends.gmi.momentum}`,
      ],
      triggerConditions: {
        gmiThreshold: isPositive ? gmiBands.upper : gmiBands.lower,
      },
    });
  }
  
  // Sort by probability descending
  return tippingPoints.sort((a, b) => b.probability - a.probability);
}

// ============================================
// RISK SCORING
// ============================================

/**
 * Calculate comprehensive risk score
 */
export function calculateRiskScore(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis }
): RiskScore {
  if (data.length === 0) {
    return {
      overall: 0,
      components: {
        emotionalInstability: 0,
        fearEscalation: 0,
        hopeDegradation: 0,
        moodDeterioration: 0,
        volatility: 0,
        trendDivergence: 0,
      },
      level: 'low',
      factors: ['Insufficient data'],
      factorsAr: ['بيانات غير كافية'],
    };
  }
  
  const latest = data[data.length - 1];
  const gmiValues = data.map(d => d.gmi);
  const cfiValues = data.map(d => d.cfi);
  const hriValues = data.map(d => d.hri);
  
  // 1. Emotional Instability (عدم الاستقرار العاطفي)
  const gmiVol = standardDeviation(gmiValues.slice(-10));
  const cfiVol = standardDeviation(cfiValues.slice(-10));
  const hriVol = standardDeviation(hriValues.slice(-10));
  const emotionalInstability = Math.min(100, (gmiVol + cfiVol + hriVol) * 2);
  
  // 2. Fear Escalation (تصاعد الخوف)
  const fearEscalation = Math.min(100,
    (latest.cfi / 100) * 50 + 
    (trends.cfi.direction === 'rising' ? trends.cfi.strength * 0.5 : 0)
  );
  
  // 3. Hope Degradation (تدهور الأمل)
  const hopeDegradation = Math.min(100,
    ((100 - latest.hri) / 100) * 50 +
    (trends.hri.direction === 'falling' ? trends.hri.strength * 0.5 : 0)
  );
  
  // 4. Mood Deterioration (تدهور المزاج)
  const moodDeterioration = Math.min(100,
    ((100 - (latest.gmi + 100) / 2) / 100) * 50 +
    (trends.gmi.direction === 'falling' ? trends.gmi.strength * 0.5 : 0)
  );
  
  // 5. Volatility (التقلب)
  const volatility = Math.min(100, emotionalInstability * 1.2);
  
  // 6. Trend Divergence (تباعد الاتجاهات)
  // When short-term and long-term trends diverge significantly
  const gmiDiv = Math.abs(trends.gmi.divergence);
  const cfiDiv = Math.abs(trends.cfi.divergence);
  const hriDiv = Math.abs(trends.hri.divergence);
  const trendDivergence = Math.min(100, (gmiDiv + cfiDiv + hriDiv) * 3);
  
  // Overall risk score (weighted average)
  const overall = Math.round(
    emotionalInstability * 0.15 +
    fearEscalation * 0.25 +
    hopeDegradation * 0.20 +
    moodDeterioration * 0.20 +
    volatility * 0.10 +
    trendDivergence * 0.10
  );
  
  // Determine level
  let level: RiskScore['level'];
  if (overall >= 80) level = 'critical';
  else if (overall >= 60) level = 'high';
  else if (overall >= 40) level = 'elevated';
  else if (overall >= 20) level = 'moderate';
  else level = 'low';
  
  // Generate factors
  const factors: string[] = [];
  const factorsAr: string[] = [];
  
  if (fearEscalation > 60) {
    factors.push(`High fear escalation (${Math.round(fearEscalation)}%)`);
    factorsAr.push(`تصاعد خوف مرتفع (${Math.round(fearEscalation)}%)`);
  }
  if (hopeDegradation > 60) {
    factors.push(`Hope degradation detected (${Math.round(hopeDegradation)}%)`);
    factorsAr.push(`تدهور أمل (${Math.round(hopeDegradation)}%)`);
  }
  if (moodDeterioration > 60) {
    factors.push(`Mood deteriorating (${Math.round(moodDeterioration)}%)`);
    factorsAr.push(`تدهور مزاج (${Math.round(moodDeterioration)}%)`);
  }
  if (volatility > 50) {
    factors.push(`High emotional volatility (${Math.round(volatility)}%)`);
    factorsAr.push(`تقلب عاطفي مرتفع (${Math.round(volatility)}%)`);
  }
  if (trendDivergence > 40) {
    factors.push(`Trend divergence detected (${Math.round(trendDivergence)}%)`);
    factorsAr.push(`تباعد اتجاهات (${Math.round(trendDivergence)}%)`);
  }
  
  if (factors.length === 0) {
    factors.push('No significant risk factors detected');
    factorsAr.push('لا توجد عوامل خطر كبيرة');
  }
  
  return {
    overall,
    components: {
      emotionalInstability: Math.round(emotionalInstability),
      fearEscalation: Math.round(fearEscalation),
      hopeDegradation: Math.round(hopeDegradation),
      moodDeterioration: Math.round(moodDeterioration),
      volatility: Math.round(volatility),
      trendDivergence: Math.round(trendDivergence),
    },
    level,
    factors,
    factorsAr,
  };
}

// ============================================
// PREDICTION GENERATION
// ============================================

/**
 * Generate predictions for multiple timeframes
 */
export function generatePredictions(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis },
  riskScore: RiskScore
): Prediction[] {
  if (data.length < 3) return [];
  
  const latest = data[data.length - 1];
  const gmiValues = data.map(d => d.gmi);
  const cfiValues = data.map(d => d.cfi);
  const hriValues = data.map(d => d.hri);
  
  const timeframes: Array<{ key: '6h' | '24h' | '48h' | '7d'; hours: number; label: string; labelAr: string }> = [
    { key: '6h', hours: 6, label: 'Next 6 Hours', labelAr: 'الـ 6 ساعات القادمة' },
    { key: '24h', hours: 24, label: 'Next 24 Hours', labelAr: 'الـ 24 ساعة القادمة' },
    { key: '48h', hours: 48, label: 'Next 48 Hours', labelAr: 'الـ 48 ساعة القادمة' },
    { key: '7d', hours: 168, label: 'Next 7 Days', labelAr: 'الأسبوع القادم' },
  ];
  
  return timeframes.map(tf => {
    // Use weighted regression for prediction
    const gmiReg = weightedLinearRegression(gmiValues);
    const cfiReg = weightedLinearRegression(cfiValues);
    const hriReg = weightedLinearRegression(hriValues);
    
    // Project with decay factor (predictions become less reliable over time)
    const decayFactor = Math.exp(-tf.hours / 200); // Exponential decay
    const projectionSteps = tf.hours; // Assume 1 data point per hour
    
    let predictedGMI = latest.gmi + gmiReg.slope * projectionSteps * decayFactor;
    let predictedCFI = latest.cfi + cfiReg.slope * projectionSteps * decayFactor;
    let predictedHRI = latest.hri + hriReg.slope * projectionSteps * decayFactor;
    
    // Apply mean reversion (values tend to return to average over time)
    const meanGMI = gmiValues.reduce((a, b) => a + b, 0) / gmiValues.length;
    const meanCFI = cfiValues.reduce((a, b) => a + b, 0) / cfiValues.length;
    const meanHRI = hriValues.reduce((a, b) => a + b, 0) / hriValues.length;
    
    const reversionStrength = 1 - decayFactor; // Stronger reversion for longer timeframes
    predictedGMI = predictedGMI * (1 - reversionStrength * 0.3) + meanGMI * reversionStrength * 0.3;
    predictedCFI = predictedCFI * (1 - reversionStrength * 0.3) + meanCFI * reversionStrength * 0.3;
    predictedHRI = predictedHRI * (1 - reversionStrength * 0.3) + meanHRI * reversionStrength * 0.3;
    
    // Clamp values
    predictedGMI = Math.max(-100, Math.min(100, predictedGMI));
    predictedCFI = Math.max(0, Math.min(100, predictedCFI));
    predictedHRI = Math.max(0, Math.min(100, predictedHRI));
    
    // Determine predicted dominant emotion
    const predictedDominantEmotion = determineDominantEmotion(predictedGMI, predictedCFI, predictedHRI);
    
    // Confidence decreases with time and increases with data quality
    const dataQuality = Math.min(1, data.length / 20);
    const r2Avg = (gmiReg.r2 + cfiReg.r2 + hriReg.r2) / 3;
    const confidence = Math.max(0.1, Math.min(0.95,
      dataQuality * 0.3 +
      r2Avg * 0.3 +
      decayFactor * 0.4
    ));
    
    // Determine scenario
    const { scenarioName, scenarioNameAr, description, descriptionAr } = 
      determineScenario(predictedGMI, predictedCFI, predictedHRI, trends, tf.label, tf.labelAr);
    
    // Calculate risk for this prediction
    const futureRisk = calculateRiskScore(
      [...data, { timestamp: Date.now() + tf.hours * 3600000, gmi: predictedGMI, cfi: predictedCFI, hri: predictedHRI }],
      trends
    );
    
    return {
      timeframe: tf.key,
      predictedGMI: Number(predictedGMI.toFixed(1)),
      predictedCFI: Number(predictedCFI.toFixed(1)),
      predictedHRI: Number(predictedHRI.toFixed(1)),
      predictedDominantEmotion,
      confidence: Number(confidence.toFixed(3)),
      scenarioName,
      scenarioNameAr,
      description,
      descriptionAr,
      riskScore: futureRisk,
    };
  });
}

/**
 * Determine dominant emotion from indices
 */
function determineDominantEmotion(gmi: number, cfi: number, hri: number): string {
  if (cfi > 70) return 'fear';
  if (gmi < -40) return 'anger';
  if (gmi < -20 && hri < 30) return 'sadness';
  if (hri > 70 && gmi > 20) return 'hope';
  if (gmi > 40) return 'joy';
  if (hri > 50 && cfi < 30) return 'curiosity';
  return 'neutral';
}

/**
 * Determine prediction scenario
 */
function determineScenario(
  gmi: number, cfi: number, hri: number,
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis },
  timeLabel: string, timeLabelAr: string
): { scenarioName: string; scenarioNameAr: string; description: string; descriptionAr: string } {
  if (cfi > 70 && gmi < -20) {
    return {
      scenarioName: 'Crisis Deepening',
      scenarioNameAr: 'تعمق الأزمة',
      description: `${timeLabel}: High fear (CFI: ${cfi.toFixed(0)}) combined with negative mood (GMI: ${gmi.toFixed(0)}) suggests the crisis may deepen. Collective anxiety is expected to remain elevated.`,
      descriptionAr: `${timeLabelAr}: خوف مرتفع (CFI: ${cfi.toFixed(0)}) مع مزاج سلبي (GMI: ${gmi.toFixed(0)}) يشير إلى تعمق الأزمة. القلق الجماعي متوقع أن يبقى مرتفعاً.`,
    };
  }
  
  if (hri > 60 && trends.hri.direction === 'rising') {
    return {
      scenarioName: 'Hope Surge',
      scenarioNameAr: 'موجة أمل',
      description: `${timeLabel}: Rising hope (HRI: ${hri.toFixed(0)}) with positive momentum suggests growing optimism. Collective resilience is strengthening.`,
      descriptionAr: `${timeLabelAr}: أمل متصاعد (HRI: ${hri.toFixed(0)}) مع زخم إيجابي يشير إلى تفاؤل متزايد. المرونة الجماعية تتعزز.`,
    };
  }
  
  if (gmi > 30 && cfi < 30) {
    return {
      scenarioName: 'Positive Stability',
      scenarioNameAr: 'استقرار إيجابي',
      description: `${timeLabel}: Positive mood (GMI: ${gmi.toFixed(0)}) with low fear (CFI: ${cfi.toFixed(0)}) indicates a stable and optimistic emotional climate.`,
      descriptionAr: `${timeLabelAr}: مزاج إيجابي (GMI: ${gmi.toFixed(0)}) مع خوف منخفض (CFI: ${cfi.toFixed(0)}) يشير إلى مناخ عاطفي مستقر ومتفائل.`,
    };
  }
  
  if (trends.gmi.direction === 'volatile' || trends.cfi.direction === 'volatile') {
    return {
      scenarioName: 'Emotional Turbulence',
      scenarioNameAr: 'اضطراب عاطفي',
      description: `${timeLabel}: High volatility in emotional indices suggests unpredictable shifts. The collective mood may swing rapidly.`,
      descriptionAr: `${timeLabelAr}: تقلب عالٍ في المؤشرات العاطفية يشير إلى تحولات غير متوقعة. المزاج الجماعي قد يتأرجح بسرعة.`,
    };
  }
  
  return {
    scenarioName: 'Gradual Transition',
    scenarioNameAr: 'انتقال تدريجي',
    description: `${timeLabel}: The emotional climate is expected to transition gradually. GMI: ${gmi.toFixed(0)}, CFI: ${cfi.toFixed(0)}, HRI: ${hri.toFixed(0)}.`,
    descriptionAr: `${timeLabelAr}: المناخ العاطفي متوقع أن ينتقل تدريجياً. GMI: ${gmi.toFixed(0)}, CFI: ${cfi.toFixed(0)}, HRI: ${hri.toFixed(0)}.`,
  };
}

// ============================================
// LLM-ENHANCED INTERPRETATION
// ============================================

/**
 * Generate AI-powered interpretation of the prediction report
 */
export async function generateAIInterpretation(
  report: Omit<PredictionReport, 'aiInterpretation' | 'aiInterpretationAr'>,
  language: 'ar' | 'en' = 'ar'
): Promise<{ interpretation: string; interpretationAr: string }> {
  try {
    const prompt = `You are an expert analyst for the AmalSense Emotional Intelligence Platform. 
Analyze this prediction report and provide a concise, actionable interpretation.

Current State:
- Country: ${report.countryName} (${report.countryCode})
- GMI (Global Mood Index): ${report.currentState.gmi} (-100 to +100)
- CFI (Collective Fear Index): ${report.currentState.cfi} (0 to 100)
- HRI (Hope Resilience Index): ${report.currentState.hri} (0 to 100)
- Dominant Emotion: ${report.currentState.dominantEmotion}
- Data Points: ${report.currentState.dataPoints}

Trends:
- GMI: ${report.trends.gmi.direction} (strength: ${report.trends.gmi.strength}%, momentum: ${report.trends.gmi.momentum})
- CFI: ${report.trends.cfi.direction} (strength: ${report.trends.cfi.strength}%, momentum: ${report.trends.cfi.momentum})
- HRI: ${report.trends.hri.direction} (strength: ${report.trends.hri.strength}%, momentum: ${report.trends.hri.momentum})

Risk Level: ${report.overallRisk.level} (${report.overallRisk.overall}/100)
Risk Factors: ${report.overallRisk.factors.join(', ')}

Tipping Points: ${report.tippingPoints.map(tp => `${tp.type} (${tp.severity}, probability: ${(tp.probability * 100).toFixed(0)}%)`).join('; ') || 'None detected'}

Predictions (24h): GMI → ${report.predictions.find(p => p.timeframe === '24h')?.predictedGMI ?? 'N/A'}, CFI → ${report.predictions.find(p => p.timeframe === '24h')?.predictedCFI ?? 'N/A'}, HRI → ${report.predictions.find(p => p.timeframe === '24h')?.predictedHRI ?? 'N/A'}

Provide TWO interpretations:
1. English interpretation (2-3 paragraphs, professional tone)
2. Arabic interpretation (2-3 paragraphs, professional tone)

Format as JSON: {"en": "...", "ar": "..."}`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are an expert emotional intelligence analyst. Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'interpretation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              en: { type: 'string', description: 'English interpretation' },
              ar: { type: 'string', description: 'Arabic interpretation' },
            },
            required: ['en', 'ar'],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (content && typeof content === 'string') {
      const parsed = JSON.parse(content);
      return {
        interpretation: parsed.en,
        interpretationAr: parsed.ar,
      };
    }
  } catch (error) {
    console.error('[PredictionEngine] AI interpretation error:', error);
  }
  
  return {
    interpretation: `The emotional climate for ${report.countryName} shows a ${report.overallRisk.level} risk level. ${report.overallRisk.factors.join('. ')}.`,
    interpretationAr: `المناخ العاطفي لـ ${report.countryName} يُظهر مستوى خطر ${report.overallRisk.level === 'critical' ? 'حرج' : report.overallRisk.level === 'high' ? 'مرتفع' : report.overallRisk.level === 'elevated' ? 'مرتفع نسبياً' : report.overallRisk.level === 'moderate' ? 'معتدل' : 'منخفض'}. ${report.overallRisk.factorsAr.join('. ')}.`,
  };
}

// ============================================
// MAIN PREDICTION REPORT GENERATOR
// ============================================

/**
 * Generate a complete prediction report for a country
 */
export async function generatePredictionReport(
  countryCode: string,
  countryName: string,
  data: EmotionalDataPoint[],
  includeAI: boolean = true
): Promise<PredictionReport> {
  // Extract values
  const gmiValues = data.map(d => d.gmi);
  const cfiValues = data.map(d => d.cfi);
  const hriValues = data.map(d => d.hri);
  
  // Analyze trends
  const trends = {
    gmi: analyzeTrend(gmiValues),
    cfi: analyzeTrend(cfiValues),
    hri: analyzeTrend(hriValues),
  };
  
  // Detect tipping points
  const tippingPoints = detectTippingPoints(data, trends);
  
  // Calculate risk
  const overallRisk = calculateRiskScore(data, trends);
  
  // Generate predictions
  const predictions = generatePredictions(data, trends, overallRisk);
  
  // Current state
  const latest = data.length > 0 ? data[data.length - 1] : { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral' };
  
  const report: PredictionReport = {
    countryCode,
    countryName,
    generatedAt: new Date(),
    currentState: {
      gmi: latest.gmi,
      cfi: latest.cfi,
      hri: latest.hri,
      dominantEmotion: latest.dominantEmotion || determineDominantEmotion(latest.gmi, latest.cfi, latest.hri),
      dataPoints: data.length,
    },
    trends,
    tippingPoints,
    predictions,
    overallRisk,
    historicalAccuracy: 0.65, // Will improve with feedback loop
  };
  
  // Add AI interpretation if requested
  if (includeAI) {
    const { interpretation, interpretationAr } = await generateAIInterpretation(report);
    report.aiInterpretation = interpretation;
    report.aiInterpretationAr = interpretationAr;
  }
  
  return report;
}

/**
 * Generate global prediction report (all countries)
 */
export async function generateGlobalPredictionReport(
  countriesData: Map<string, { name: string; data: EmotionalDataPoint[] }>,
  includeAI: boolean = false
): Promise<{
  countries: PredictionReport[];
  globalRisk: RiskScore;
  highRiskCountries: string[];
  tippingPointAlerts: Array<{ country: string; tippingPoint: TippingPoint }>;
}> {
  const reports: PredictionReport[] = [];
  const allTippingAlerts: Array<{ country: string; tippingPoint: TippingPoint }> = [];
  
  for (const [code, { name, data }] of countriesData) {
    if (data.length >= 3) {
      const report = await generatePredictionReport(code, name, data, includeAI);
      reports.push(report);
      
      // Collect tipping point alerts
      for (const tp of report.tippingPoints) {
        if (tp.severity === 'high' || tp.severity === 'critical') {
          allTippingAlerts.push({ country: name, tippingPoint: tp });
        }
      }
    }
  }
  
  // Calculate global risk (average of all countries)
  const allRisks = reports.map(r => r.overallRisk.overall);
  const globalRiskScore = allRisks.length > 0 
    ? Math.round(allRisks.reduce((a, b) => a + b, 0) / allRisks.length)
    : 0;
  
  let globalLevel: RiskScore['level'];
  if (globalRiskScore >= 80) globalLevel = 'critical';
  else if (globalRiskScore >= 60) globalLevel = 'high';
  else if (globalRiskScore >= 40) globalLevel = 'elevated';
  else if (globalRiskScore >= 20) globalLevel = 'moderate';
  else globalLevel = 'low';
  
  const highRiskCountries = reports
    .filter(r => r.overallRisk.overall >= 60)
    .map(r => r.countryName);
  
  return {
    countries: reports,
    globalRisk: {
      overall: globalRiskScore,
      components: {
        emotionalInstability: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.emotionalInstability, 0) / Math.max(1, reports.length)),
        fearEscalation: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.fearEscalation, 0) / Math.max(1, reports.length)),
        hopeDegradation: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.hopeDegradation, 0) / Math.max(1, reports.length)),
        moodDeterioration: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.moodDeterioration, 0) / Math.max(1, reports.length)),
        volatility: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.volatility, 0) / Math.max(1, reports.length)),
        trendDivergence: Math.round(reports.reduce((a, r) => a + r.overallRisk.components.trendDivergence, 0) / Math.max(1, reports.length)),
      },
      level: globalLevel,
      factors: highRiskCountries.length > 0 
        ? [`${highRiskCountries.length} high-risk countries: ${highRiskCountries.join(', ')}`]
        : ['No high-risk countries detected'],
      factorsAr: highRiskCountries.length > 0 
        ? [`${highRiskCountries.length} دول عالية الخطورة: ${highRiskCountries.join('، ')}`]
        : ['لا توجد دول عالية الخطورة'],
    },
    highRiskCountries,
    tippingPointAlerts: allTippingAlerts,
  };
}
