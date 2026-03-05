import { z } from 'zod';

/**
 * Temporal Data Handler
 * Manages historical data and temporal comparisons
 * Fixes percentage change calculations
 */

interface TemporalDataPoint {
  timestamp: number; // Unix timestamp in milliseconds
  value: number;
  confidence: number;
}

interface TemporalComparison {
  current: TemporalDataPoint;
  previous: TemporalDataPoint;
  change: number; // percentage change
  changeDirection: 'up' | 'down' | 'stable';
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Mock historical data storage
const historicalData: Record<string, TemporalDataPoint[]> = {
  gmi: [
    { timestamp: Date.now() - 86400000, value: 45.2, confidence: 0.85 },
    { timestamp: Date.now() - 172800000, value: 42.8, confidence: 0.82 },
    { timestamp: Date.now() - 259200000, value: 40.5, confidence: 0.80 },
  ],
  cfi: [
    { timestamp: Date.now() - 86400000, value: 57.3, confidence: 0.88 },
    { timestamp: Date.now() - 172800000, value: 55.1, confidence: 0.85 },
    { timestamp: Date.now() - 259200000, value: 52.9, confidence: 0.83 },
  ],
  hri: [
    { timestamp: Date.now() - 86400000, value: 62.4, confidence: 0.87 },
    { timestamp: Date.now() - 172800000, value: 61.2, confidence: 0.84 },
    { timestamp: Date.now() - 259200000, value: 59.8, confidence: 0.81 },
  ],
};

/**
 * Get previous data point for comparison
 */
export const getPreviousDataPoint = (
  indexName: string,
  hoursBack: number = 24
): TemporalDataPoint | null => {
  const data = historicalData[indexName.toLowerCase()];
  if (!data || data.length === 0) return null;
  
  const targetTime = Date.now() - hoursBack * 3600000;
  
  // Find closest data point to target time
  let closest = data[0];
  let minDiff = Math.abs(data[0].timestamp - targetTime);
  
  for (const point of data) {
    const diff = Math.abs(point.timestamp - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }
  
  return closest;
};

/**
 * Calculate percentage change with proper rounding
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  
  const change = ((current - previous) / Math.abs(previous)) * 100;
  
  // Proper rounding to 2 decimal places
  return Math.round(change * 100) / 100;
};

/**
 * Compare current value with historical data
 */
export const compareWithHistory = (
  indexName: string,
  currentValue: number,
  hoursBack: number = 24
): TemporalComparison | null => {
  const previous = getPreviousDataPoint(indexName, hoursBack);
  if (!previous) return null;
  
  const current: TemporalDataPoint = {
    timestamp: Date.now(),
    value: currentValue,
    confidence: 0.90,
  };
  
  const change = calculatePercentageChange(current.value, previous.value);
  const changeDirection = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';
  
  // Determine trend from multiple data points
  const trend = determineTrend(indexName, currentValue);
  
  return {
    current,
    previous,
    change,
    changeDirection,
    trend,
  };
};

/**
 * Determine trend from historical data
 */
const determineTrend = (indexName: string, currentValue: number): 'increasing' | 'decreasing' | 'stable' => {
  const data = historicalData[indexName.toLowerCase()];
  if (!data || data.length < 2) return 'stable';
  
  // Sort by timestamp (newest first)
  const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
  
  // Compare last 3 data points
  let increasingCount = 0;
  let decreasingCount = 0;
  
  for (let i = 0; i < Math.min(2, sorted.length - 1); i++) {
    const diff = sorted[i].value - sorted[i + 1].value;
    if (diff > 0.1) increasingCount++;
    else if (diff < -0.1) decreasingCount++;
  }
  
  // Add current value comparison
  if (currentValue > sorted[0].value) increasingCount++;
  else if (currentValue < sorted[0].value) decreasingCount++;
  
  if (increasingCount > decreasingCount) return 'increasing';
  if (decreasingCount > increasingCount) return 'decreasing';
  return 'stable';
};

/**
 * Format temporal comparison for display
 */
export const formatTemporalComparison = (comparison: TemporalComparison): string => {
  const changeSign = comparison.change > 0 ? '+' : '';
  const changePercent = `${changeSign}${comparison.change.toFixed(2)}%`;
  
  return `
Current: ${comparison.current.value.toFixed(2)}
Previous (24h ago): ${comparison.previous.value.toFixed(2)}
Change: ${changePercent}
Direction: ${comparison.changeDirection.toUpperCase()}
Trend: ${comparison.trend.toUpperCase()}
  `.trim();
};

/**
 * Get multiple comparisons for dashboard
 */
export const getMultipleComparisons = (
  indices: string[],
  currentValues: Record<string, number>,
  hoursBack: number = 24
): Record<string, TemporalComparison | null> => {
  const comparisons: Record<string, TemporalComparison | null> = {};
  
  for (const index of indices) {
    const currentValue = currentValues[index];
    if (currentValue !== undefined) {
      comparisons[index] = compareWithHistory(index, currentValue, hoursBack);
    }
  }
  
  return comparisons;
};

/**
 * Fix confidence rounding
 */
export const fixConfidenceRounding = (confidence: number): number => {
  // Round to 2 decimal places
  return Number((Math.round(confidence * 10000) / 10000).toFixed(2));
};

/**
 * Validate temporal data
 */
export const validateTemporalData = (data: TemporalDataPoint): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.timestamp <= 0) {
    errors.push('Invalid timestamp');
  }
  
  if (data.value < 0 || data.value > 100) {
    errors.push('Value out of range (0-100)');
  }
  
  if (data.confidence < 0 || data.confidence > 1) {
    errors.push('Confidence out of range (0-1)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const temporalDataRouter = {
  getPreviousDataPoint,
  calculatePercentageChange,
  compareWithHistory,
  formatTemporalComparison,
  getMultipleComparisons,
  fixConfidenceRounding,
  validateTemporalData,
};
