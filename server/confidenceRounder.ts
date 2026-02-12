/**
 * Confidence Score Rounding Utility
 * Ensures all confidence scores are rounded to nearest integer (0-100)
 */

export interface ConfidenceScore {
  value: number;
  rounded: number;
  original: number;
}

/**
 * Round confidence score to nearest integer
 * @param value - Raw confidence value (0-100 or 0-1)
 * @returns Rounded value (0-100)
 */
export function roundConfidence(value: number): number {
  // Normalize if value is 0-1
  const normalized = value > 1 ? value : value * 100;
  
  // Round to nearest integer
  const rounded = Math.round(normalized);
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, rounded));
}

/**
 * Round all confidence metrics in an object
 */
export function roundAllConfidenceMetrics(metrics: Record<string, any>): Record<string, any> {
  const rounded: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metrics)) {
    if (typeof value === 'number' && key.toLowerCase().includes('confidence') || 
        key.toLowerCase().includes('cfi') ||
        key.toLowerCase().includes('gmi') ||
        key.toLowerCase().includes('hri')) {
      rounded[key] = roundConfidence(value);
    } else if (typeof value === 'object' && value !== null) {
      rounded[key] = roundAllConfidenceMetrics(value);
    } else {
      rounded[key] = value;
    }
  }
  
  return rounded;
}

/**
 * Format confidence score for display
 * @param value - Confidence value
 * @param suffix - Optional suffix (default: '%')
 * @returns Formatted string
 */
export function formatConfidence(value: number, suffix: string = '%'): string {
  const rounded = roundConfidence(value);
  return `${rounded}${suffix}`;
}

/**
 * Get confidence level description
 */
export function getConfidenceLevel(value: number): string {
  const rounded = roundConfidence(value);
  
  if (rounded >= 90) return 'Very High';
  if (rounded >= 75) return 'High';
  if (rounded >= 60) return 'Moderate';
  if (rounded >= 40) return 'Low';
  return 'Very Low';
}

/**
 * Validate confidence score
 */
export function isValidConfidence(value: any): boolean {
  if (typeof value !== 'number') return false;
  if (isNaN(value) || !isFinite(value)) return false;
  
  // Accept both 0-1 and 0-100 ranges
  return (value >= 0 && value <= 1) || (value >= 0 && value <= 100);
}

/**
 * Batch round confidence scores
 */
export function roundConfidenceBatch(values: number[]): number[] {
  return values.map(v => roundConfidence(v));
}

/**
 * Calculate average confidence and round
 */
export function averageConfidence(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const average = sum / values.length;
  return roundConfidence(average);
}
