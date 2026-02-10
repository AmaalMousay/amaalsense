/**
 * Temporal Analysis Engine - Layer 7 (Pattern Recognition)
 * 
 * Enables analysis of emotional trends over time
 * Answers questions like:
 * - "How did sentiment change between January and February?"
 * - "What's the trend for this topic?"
 * - "Is the situation improving or worsening?"
 */

export interface TemporalDataPoint {
  timestamp: Date;
  gmi: number;
  cfi: number;
  hri: number;
  aci: number;
  sdi: number;
  confidence: number;
  dataCount: number;
}

export interface TemporalTrend {
  metric: 'gmi' | 'cfi' | 'hri' | 'aci' | 'sdi';
  startValue: number;
  endValue: number;
  change: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
  avgValue: number;
  minValue: number;
  maxValue: number;
}

export interface TemporalAnalysisResult {
  period: {
    start: Date;
    end: Date;
    durationDays: number;
  };
  trends: {
    gmi: TemporalTrend;
    cfi: TemporalTrend;
    hri: TemporalTrend;
    aci: TemporalTrend;
    sdi: TemporalTrend;
  };
  patterns: string[];
  forecast: {
    nextWeekGMI: number;
    nextWeekCFI: number;
    nextWeekHRI: number;
    confidence: number;
  };
  insights: string[];
}

/**
 * Calculate trend for a metric over time
 */
function calculateTrend(dataPoints: TemporalDataPoint[], metric: 'gmi' | 'cfi' | 'hri' | 'aci' | 'sdi'): TemporalTrend {
  if (dataPoints.length === 0) {
    return {
      metric,
      startValue: 0,
      endValue: 0,
      change: 0,
      changePercent: 0,
      trend: 'stable',
      volatility: 0,
      avgValue: 0,
      minValue: 0,
      maxValue: 0,
    };
  }

  const values = dataPoints.map(dp => dp[metric]);
  const startValue = values[0];
  const endValue = values[values.length - 1];
  const change = endValue - startValue;
  const changePercent = startValue !== 0 ? (change / Math.abs(startValue)) * 100 : 0;

  // Calculate trend direction
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(changePercent) < 5) {
    trend = 'stable';
  } else if (change > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  // Calculate volatility (standard deviation)
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const volatility = Math.sqrt(variance);

  // Calculate min/max/avg
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const avgValue = mean;

  return {
    metric,
    startValue: Math.round(startValue),
    endValue: Math.round(endValue),
    change: Math.round(change),
    changePercent: Math.round(changePercent * 100) / 100,
    trend,
    volatility: Math.round(volatility * 100) / 100,
    avgValue: Math.round(avgValue),
    minValue: Math.round(minValue),
    maxValue: Math.round(maxValue),
  };
}

/**
 * Detect patterns in temporal data
 */
function detectPatterns(trends: Record<string, TemporalTrend>): string[] {
  const patterns: string[] = [];

  // Crisis pattern: High fear + High anger + Low hope
  if (trends.cfi.avgValue > 70 && trends.aci.avgValue > 60 && trends.hri.avgValue < 40) {
    patterns.push('Crisis Pattern: High fear and anger with low hope');
  }

  // Recovery pattern: Increasing hope + Decreasing fear
  if (trends.hri.trend === 'increasing' && trends.cfi.trend === 'decreasing') {
    patterns.push('Recovery Pattern: Hope increasing while fear decreases');
  }

  // Volatility pattern: High emotional swings
  if (trends.gmi.volatility > 20 || trends.cfi.volatility > 20) {
    patterns.push('High Volatility: Emotional state is unstable and rapidly changing');
  }

  // Polarization pattern: Extreme values
  if (Math.abs(trends.gmi.avgValue) > 60) {
    patterns.push('Polarization: Strong emotional consensus (either very positive or very negative)');
  }

  // Fatigue pattern: Declining engagement with stable negative sentiment
  if (trends.gmi.trend === 'decreasing' && trends.cfi.trend === 'stable' && trends.cfi.avgValue > 50) {
    patterns.push('Fatigue Pattern: Persistent negative sentiment with declining engagement');
  }

  // Momentum pattern: Consistent direction
  const allIncreasing = Object.values(trends).filter(t => t.trend === 'increasing').length >= 3;
  const allDecreasing = Object.values(trends).filter(t => t.trend === 'decreasing').length >= 3;
  
  if (allIncreasing) {
    patterns.push('Positive Momentum: Multiple indicators trending upward');
  } else if (allDecreasing) {
    patterns.push('Negative Momentum: Multiple indicators trending downward');
  }

  return patterns;
}

/**
 * Simple linear regression forecast
 */
function forecastMetric(dataPoints: TemporalDataPoint[], metric: 'gmi' | 'cfi' | 'hri' | 'aci' | 'sdi', daysAhead: number = 7): number {
  if (dataPoints.length < 2) {
    return dataPoints[0]?.[metric] || 50;
  }

  // Use last 7 data points for forecast
  const recentPoints = dataPoints.slice(-7);
  const n = recentPoints.length;
  
  // Calculate linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = recentPoints[i][metric];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Forecast
  const forecast = intercept + slope * (n + daysAhead);
  
  // Clamp to valid ranges
  if (metric === 'gmi') {
    return Math.max(-100, Math.min(100, Math.round(forecast)));
  } else {
    return Math.max(0, Math.min(100, Math.round(forecast)));
  }
}

/**
 * Generate insights from temporal analysis
 */
function generateInsights(result: TemporalAnalysisResult): string[] {
  const insights: string[] = [];

  // Insight 1: Overall sentiment change
  const gmiChange = result.trends.gmi.change;
  if (gmiChange > 20) {
    insights.push(`Overall mood improved significantly by ${gmiChange} points over the period`);
  } else if (gmiChange < -20) {
    insights.push(`Overall mood deteriorated significantly by ${Math.abs(gmiChange)} points over the period`);
  } else if (Math.abs(gmiChange) > 5) {
    insights.push(`Overall mood shifted slightly by ${gmiChange} points`);
  }

  // Insight 2: Fear trends
  if (result.trends.cfi.trend === 'increasing' && result.trends.cfi.endValue > 60) {
    insights.push('Fear levels are rising and currently at concerning levels');
  } else if (result.trends.cfi.trend === 'decreasing') {
    insights.push('Fear levels are declining, suggesting improving confidence');
  }

  // Insight 3: Hope trends
  if (result.trends.hri.trend === 'increasing') {
    insights.push('Hope and resilience are strengthening');
  } else if (result.trends.hri.trend === 'decreasing' && result.trends.hri.endValue < 40) {
    insights.push('Hope levels are declining to critical levels');
  }

  // Insight 4: Stability
  if (result.trends.gmi.volatility < 10) {
    insights.push('Emotional state is stable and predictable');
  } else if (result.trends.gmi.volatility > 25) {
    insights.push('Emotional state is highly volatile and unpredictable');
  }

  // Insight 5: Forecast
  if (result.forecast.confidence > 0.7) {
    if (result.forecast.nextWeekGMI > result.trends.gmi.endValue) {
      insights.push(`Forecast: Mood expected to improve next week (predicted: ${result.forecast.nextWeekGMI})`);
    } else if (result.forecast.nextWeekGMI < result.trends.gmi.endValue) {
      insights.push(`Forecast: Mood expected to decline next week (predicted: ${result.forecast.nextWeekGMI})`);
    }
  }

  return insights;
}

/**
 * Analyze temporal trends
 */
export function analyzeTemporalTrends(dataPoints: TemporalDataPoint[]): TemporalAnalysisResult {
  if (dataPoints.length === 0) {
    return {
      period: {
        start: new Date(),
        end: new Date(),
        durationDays: 0,
      },
      trends: {
        gmi: { metric: 'gmi', startValue: 0, endValue: 0, change: 0, changePercent: 0, trend: 'stable', volatility: 0, avgValue: 0, minValue: 0, maxValue: 0 },
        cfi: { metric: 'cfi', startValue: 0, endValue: 0, change: 0, changePercent: 0, trend: 'stable', volatility: 0, avgValue: 0, minValue: 0, maxValue: 0 },
        hri: { metric: 'hri', startValue: 0, endValue: 0, change: 0, changePercent: 0, trend: 'stable', volatility: 0, avgValue: 0, minValue: 0, maxValue: 0 },
        aci: { metric: 'aci', startValue: 0, endValue: 0, change: 0, changePercent: 0, trend: 'stable', volatility: 0, avgValue: 0, minValue: 0, maxValue: 0 },
        sdi: { metric: 'sdi', startValue: 0, endValue: 0, change: 0, changePercent: 0, trend: 'stable', volatility: 0, avgValue: 0, minValue: 0, maxValue: 0 },
      },
      patterns: [],
      forecast: {
        nextWeekGMI: 0,
        nextWeekCFI: 50,
        nextWeekHRI: 50,
        confidence: 0,
      },
      insights: [],
    };
  }

  // Sort by timestamp
  const sorted = [...dataPoints].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Calculate trends
  const trends = {
    gmi: calculateTrend(sorted, 'gmi'),
    cfi: calculateTrend(sorted, 'cfi'),
    hri: calculateTrend(sorted, 'hri'),
    aci: calculateTrend(sorted, 'aci'),
    sdi: calculateTrend(sorted, 'sdi'),
  };

  // Detect patterns
  const patterns = detectPatterns(trends);

  // Calculate forecast
  const forecastGMI = forecastMetric(sorted, 'gmi', 7);
  const forecastCFI = forecastMetric(sorted, 'cfi', 7);
  const forecastHRI = forecastMetric(sorted, 'hri', 7);
  
  // Forecast confidence based on data quantity and recency
  const avgConfidence = sorted.reduce((sum, dp) => sum + dp.confidence, 0) / sorted.length;
  const forecastConfidence = Math.min(1, (sorted.length / 14) * avgConfidence);

  // Calculate period
  const startDate = sorted[0].timestamp;
  const endDate = sorted[sorted.length - 1].timestamp;
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const result: TemporalAnalysisResult = {
    period: {
      start: startDate,
      end: endDate,
      durationDays,
    },
    trends,
    patterns,
    forecast: {
      nextWeekGMI: forecastGMI,
      nextWeekCFI: forecastCFI,
      nextWeekHRI: forecastHRI,
      confidence: Math.round(forecastConfidence * 100) / 100,
    },
    insights: [],
  };

  // Generate insights
  result.insights = generateInsights(result);

  return result;
}

/**
 * Compare two time periods
 */
export function comparePeriods(
  period1: TemporalDataPoint[],
  period2: TemporalDataPoint[]
): { comparison: Record<string, { period1: number; period2: number; change: number; changePercent: number }> } {
  const trend1 = calculateTrend(period1, 'gmi');
  const trend2 = calculateTrend(period2, 'gmi');

  return {
    comparison: {
      gmi: {
        period1: trend1.avgValue,
        period2: trend2.avgValue,
        change: trend2.avgValue - trend1.avgValue,
        changePercent: ((trend2.avgValue - trend1.avgValue) / Math.abs(trend1.avgValue || 1)) * 100,
      },
    },
  };
}
