/**
 * Prediction Engine
 *
 * Probabilistic forecasting for AmalSense emotional field indicators. This layer
 * does not make financial recommendations. It estimates likely emotional-field
 * movement from historical GMI/CFI/HRI sequences and reports confidence,
 * uncertainty, risk and potential tipping points.
 */

import { composeNaturalAnswer } from './responseBuilder';

export interface EmotionalDataPoint {
  timestamp: number;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion?: string;
  emotions?: Record<string, number>;
  sourceCount?: number;
  confidence?: number;
  countryCode?: string;
}

export interface TrendAnalysis {
  direction: 'rising' | 'falling' | 'stable' | 'volatile';
  strength: number;
  shortTermSlope: number;
  longTermSlope: number;
  momentum: number;
  acceleration: number;
  divergence: number;
}

export interface TippingPoint {
  type: 'crisis_onset' | 'recovery_start' | 'escalation' | 'stabilization' | 'emotional_shift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeframe: string;
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
  overall: number;
  components: {
    emotionalInstability: number;
    fearEscalation: number;
    hopeDegradation: number;
    moodDeterioration: number;
    volatility: number;
    trendDivergence: number;
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
  confidence: number;
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / (values.length - 1));
}

function slope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = mean(values);
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < n; index++) {
    numerator += (index - xMean) * (values[index] - yMean);
    denominator += Math.pow(index - xMean, 2);
  }
  return denominator === 0 ? 0 : numerator / denominator;
}

function rateOfChange(values: number[], period: number = 1): number {
  if (values.length <= period) return 0;
  const current = values[values.length - 1];
  const previous = values[values.length - 1 - period];
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function analyzeTrend(values: number[]): TrendAnalysis {
  if (values.length < 3) {
    return { direction: 'stable', strength: 0, shortTermSlope: 0, longTermSlope: 0, momentum: 0, acceleration: 0, divergence: 0 };
  }

  const shortWindow = values.slice(-Math.min(6, values.length));
  const longWindow = values;
  const shortTermSlope = slope(shortWindow);
  const longTermSlope = slope(longWindow);
  const momentum = rateOfChange(values, Math.min(3, values.length - 1));
  const previousMomentum = values.length > 4 ? rateOfChange(values.slice(0, -1), Math.min(3, values.length - 2)) : 0;
  const acceleration = momentum - previousMomentum;
  const volatility = standardDeviation(values.slice(-Math.min(10, values.length)));
  const divergence = shortTermSlope - longTermSlope;

  let direction: TrendAnalysis['direction'] = 'stable';
  if (volatility > 15) direction = 'volatile';
  else if (shortTermSlope > 0.5) direction = 'rising';
  else if (shortTermSlope < -0.5) direction = 'falling';

  const strength = clamp(Math.abs(shortTermSlope) * 12 + Math.abs(momentum) * 1.5 + Math.abs(divergence) * 4, 0, 100);
  return {
    direction,
    strength: Math.round(strength),
    shortTermSlope: Number(shortTermSlope.toFixed(3)),
    longTermSlope: Number(longTermSlope.toFixed(3)),
    momentum: Number(momentum.toFixed(2)),
    acceleration: Number(acceleration.toFixed(2)),
    divergence: Number(divergence.toFixed(2)),
  };
}

export function detectTippingPoints(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis }
): TippingPoint[] {
  if (data.length < 3) return [];
  const latest = data[data.length - 1];
  const points: TippingPoint[] = [];
  const volatility = Math.max(
    standardDeviation(data.map(point => point.gmi).slice(-10)),
    standardDeviation(data.map(point => point.cfi).slice(-10)),
    standardDeviation(data.map(point => point.hri).slice(-10))
  );

  if (latest.cfi > 65 && trends.cfi.direction === 'rising' && trends.gmi.direction === 'falling') {
    const probability = clamp((latest.cfi / 100) * 0.55 + Math.abs(trends.gmi.momentum) / 100 + volatility / 100, 0, 0.95);
    points.push({
      type: 'crisis_onset',
      severity: probability > 0.75 ? 'critical' : probability > 0.55 ? 'high' : 'medium',
      probability,
      timeframe: probability > 0.7 ? '6-24 hours' : '24-48 hours',
      description: `Crisis risk is rising: CFI=${latest.cfi}, GMI=${latest.gmi}, volatility=${volatility.toFixed(1)}.`,
      descriptionAr: `Crisis risk is rising: CFI=${latest.cfi}, GMI=${latest.gmi}, volatility=${volatility.toFixed(1)}.`,
      indicators: ['rising fear', 'declining mood', 'elevated volatility'],
      triggerConditions: { cfiThreshold: 65, volatilityThreshold: 15 },
    });
  }

  if (latest.hri > 60 && trends.hri.direction === 'rising' && trends.cfi.direction !== 'rising') {
    const probability = clamp((latest.hri / 100) * 0.5 + Math.max(0, trends.hri.momentum) / 100, 0, 0.9);
    points.push({
      type: 'recovery_start',
      severity: probability > 0.65 ? 'medium' : 'low',
      probability,
      timeframe: '24-72 hours',
      description: `Recovery signals are improving: HRI=${latest.hri}, CFI=${latest.cfi}.`,
      descriptionAr: `Recovery signals are improving: HRI=${latest.hri}, CFI=${latest.cfi}.`,
      indicators: ['rising resilience', 'contained fear'],
      triggerConditions: { hriThreshold: 60 },
    });
  }

  if (volatility > 25) {
    points.push({
      type: 'emotional_shift',
      severity: volatility > 40 ? 'high' : 'medium',
      probability: clamp(volatility / 60, 0.2, 0.85),
      timeframe: '6-48 hours',
      description: `High emotional volatility suggests possible rapid field shifts.`,
      descriptionAr: `High emotional volatility suggests possible rapid field shifts.`,
      indicators: ['high volatility'],
      triggerConditions: { volatilityThreshold: 25 },
    });
  }

  return points;
}

export function calculateRiskScore(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis }
): RiskScore {
  const latest = data[data.length - 1] || { gmi: 0, cfi: 50, hri: 50 };
  const volatility = Math.max(
    standardDeviation(data.map(point => point.gmi).slice(-10)),
    standardDeviation(data.map(point => point.cfi).slice(-10)),
    standardDeviation(data.map(point => point.hri).slice(-10))
  );

  const components = {
    emotionalInstability: clamp(volatility * 3, 0, 100),
    fearEscalation: clamp(latest.cfi + Math.max(0, trends.cfi.momentum), 0, 100),
    hopeDegradation: clamp(100 - latest.hri + Math.max(0, -trends.hri.momentum), 0, 100),
    moodDeterioration: clamp(50 - latest.gmi + Math.max(0, -trends.gmi.momentum), 0, 100),
    volatility: clamp(volatility * 3, 0, 100),
    trendDivergence: clamp(Math.abs(trends.cfi.divergence - trends.hri.divergence) * 10, 0, 100),
  };

  const overall = Math.round(
    components.emotionalInstability * 0.18 +
    components.fearEscalation * 0.28 +
    components.hopeDegradation * 0.18 +
    components.moodDeterioration * 0.18 +
    components.volatility * 0.12 +
    components.trendDivergence * 0.06
  );

  const level: RiskScore['level'] = overall >= 80 ? 'critical' : overall >= 60 ? 'high' : overall >= 40 ? 'elevated' : overall >= 20 ? 'moderate' : 'low';
  const factors: string[] = [];
  if (latest.cfi > 65) factors.push('collective fear is elevated');
  if (latest.hri < 40) factors.push('resilience is weak');
  if (latest.gmi < -25) factors.push('mood is negative');
  if (volatility > 20) factors.push('emotional volatility is high');
  if (factors.length === 0) factors.push('no major risk factor is dominant');

  return { overall, components: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, Math.round(value)])) as RiskScore['components'], level, factors, factorsAr: factors };
}

function determineDominantEmotion(gmi: number, cfi: number, hri: number): string {
  if (cfi > 65) return 'fear';
  if (hri > 60) return 'hope';
  if (gmi > 35) return 'joy';
  if (gmi < -35) return 'sadness';
  return 'neutral';
}

function scenarioFor(gmi: number, cfi: number, hri: number, trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis }) {
  if (cfi > 70) return { name: 'High Fear Pressure', description: 'Fear pressure dominates the emotional field.' };
  if (hri > 65 && cfi < 50) return { name: 'Recovery Bias', description: 'Resilience is stronger than fear pressure.' };
  if (trends.gmi.direction === 'volatile' || trends.cfi.direction === 'volatile') return { name: 'Volatile Field', description: 'The emotional field may change quickly.' };
  if (gmi > 25) return { name: 'Positive Stabilization', description: 'Mood is stabilizing with a positive bias.' };
  if (gmi < -25) return { name: 'Negative Pressure', description: 'Mood is under negative pressure.' };
  return { name: 'Gradual Transition', description: 'The field is expected to move gradually.' };
}

export function generatePredictions(
  data: EmotionalDataPoint[],
  trends: { gmi: TrendAnalysis; cfi: TrendAnalysis; hri: TrendAnalysis },
  riskScore: RiskScore
): Prediction[] {
  const latest = data[data.length - 1] || { gmi: 0, cfi: 50, hri: 50 };
  const timeframes: Array<{ key: Prediction['timeframe']; factor: number }> = [
    { key: '6h', factor: 0.25 },
    { key: '24h', factor: 1 },
    { key: '48h', factor: 2 },
    { key: '7d', factor: 7 },
  ];

  return timeframes.map(({ key, factor }) => {
    const predictedGMI = Math.round(clamp(latest.gmi + trends.gmi.shortTermSlope * factor, -100, 100));
    const predictedCFI = Math.round(clamp(latest.cfi + trends.cfi.shortTermSlope * factor, 0, 100));
    const predictedHRI = Math.round(clamp(latest.hri + trends.hri.shortTermSlope * factor, 0, 100));
    const scenario = scenarioFor(predictedGMI, predictedCFI, predictedHRI, trends);
    const confidence = clamp((Number(latest.confidence ?? 70) / 100) * (1 - Math.min(0.4, factor / 20)) * (1 - riskScore.components.volatility / 300), 0.15, 0.95);
    return {
      timeframe: key,
      predictedGMI,
      predictedCFI,
      predictedHRI,
      predictedDominantEmotion: determineDominantEmotion(predictedGMI, predictedCFI, predictedHRI),
      confidence: Number(confidence.toFixed(2)),
      scenarioName: scenario.name,
      scenarioNameAr: scenario.name,
      description: scenario.description,
      descriptionAr: scenario.description,
      riskScore,
    };
  });
}

export async function generateAIInterpretation(
  report: Omit<PredictionReport, 'aiInterpretation' | 'aiInterpretationAr'>,
  language: 'ar' | 'en' = 'en'
): Promise<{ interpretation: string; interpretationAr: string }> {
  const interpretation = await composeNaturalAnswer({
    question: `Interpret the emotional forecast for ${report.countryName}.`,
    language,
    route: 'prediction',
    intent: 'prediction',
    indices: report.currentState,
    eventVector: { trends: report.trends, tippingPoints: report.tippingPoints, predictions: report.predictions, risk: report.overallRisk },
    confidence: report.currentState.dataPoints > 10 ? 80 : 55,
    limitations: report.currentState.dataPoints < 3 ? ['Insufficient historical data.'] : [],
  });
  return { interpretation, interpretationAr: interpretation };
}

export async function generatePredictionReport(
  countryCode: string,
  countryName: string,
  data: EmotionalDataPoint[],
  includeAI: boolean = true
): Promise<PredictionReport> {
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const gmiValues = sorted.map(point => point.gmi);
  const cfiValues = sorted.map(point => point.cfi);
  const hriValues = sorted.map(point => point.hri);
  const trends = { gmi: analyzeTrend(gmiValues), cfi: analyzeTrend(cfiValues), hri: analyzeTrend(hriValues) };
  const tippingPoints = detectTippingPoints(sorted, trends);
  const overallRisk = calculateRiskScore(sorted, trends);
  const predictions = generatePredictions(sorted, trends, overallRisk);
  const latest = sorted[sorted.length - 1] || { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral' };

  const report: PredictionReport = {
    countryCode,
    countryName,
    generatedAt: new Date(),
    currentState: {
      gmi: latest.gmi,
      cfi: latest.cfi,
      hri: latest.hri,
      dominantEmotion: latest.dominantEmotion || determineDominantEmotion(latest.gmi, latest.cfi, latest.hri),
      dataPoints: sorted.length,
    },
    trends,
    tippingPoints,
    predictions,
    overallRisk,
    historicalAccuracy: 0.65,
  };

  if (includeAI) {
    const ai = await generateAIInterpretation(report);
    report.aiInterpretation = ai.interpretation;
    report.aiInterpretationAr = ai.interpretationAr;
  }
  return report;
}

export async function generateGlobalPredictionReport(
  countriesData: Map<string, { name: string; data: EmotionalDataPoint[] }>,
  includeAI: boolean = false
): Promise<{ countries: PredictionReport[]; globalRisk: RiskScore; highRiskCountries: string[]; tippingPointAlerts: Array<{ country: string; tippingPoint: TippingPoint }> }> {
  const countries: PredictionReport[] = [];
  const tippingPointAlerts: Array<{ country: string; tippingPoint: TippingPoint }> = [];
  for (const [code, item] of countriesData.entries()) {
    if (item.data.length < 3) continue;
    const report = await generatePredictionReport(code, item.name, item.data, includeAI);
    countries.push(report);
    for (const tippingPoint of report.tippingPoints) {
      if (tippingPoint.severity === 'high' || tippingPoint.severity === 'critical') tippingPointAlerts.push({ country: item.name, tippingPoint });
    }
  }

  const riskValues = countries.map(country => country.overallRisk.overall);
  const overall = Math.round(mean(riskValues));
  const globalRisk: RiskScore = {
    overall,
    components: {
      emotionalInstability: Math.round(mean(countries.map(country => country.overallRisk.components.emotionalInstability))),
      fearEscalation: Math.round(mean(countries.map(country => country.overallRisk.components.fearEscalation))),
      hopeDegradation: Math.round(mean(countries.map(country => country.overallRisk.components.hopeDegradation))),
      moodDeterioration: Math.round(mean(countries.map(country => country.overallRisk.components.moodDeterioration))),
      volatility: Math.round(mean(countries.map(country => country.overallRisk.components.volatility))),
      trendDivergence: Math.round(mean(countries.map(country => country.overallRisk.components.trendDivergence))),
    },
    level: overall >= 80 ? 'critical' : overall >= 60 ? 'high' : overall >= 40 ? 'elevated' : overall >= 20 ? 'moderate' : 'low',
    factors: countries.filter(country => country.overallRisk.overall >= 60).map(country => country.countryName),
    factorsAr: countries.filter(country => country.overallRisk.overall >= 60).map(country => country.countryName),
  };

  return { countries, globalRisk, highRiskCountries: globalRisk.factors, tippingPointAlerts };
}
