/**
 * AmaálSense Emotion Color System
 * 
 * This file defines the unified color palette for emotions across the platform.
 * Each color has a specific psychological meaning and should be used consistently.
 * 
 * Color Meanings:
 * - Red (#E63946): Anger / Tension / Crisis / Conflict
 * - Orange (#F4A261): Fear / Anxiety
 * - Yellow (#E9C46A): Curiosity / Uncertainty / Anticipation
 * - Green (#2A9D8F): Hope / Balance / Resilience / Recovery
 * - Blue (#457B9D): Calm / Stability / Neutrality
 * - Purple (#8D5CF6): Sadness / Grief / Loss
 * - Gray (#6C757D): Neutral / No strong emotion
 */

// Primary Emotion Colors (HEX)
export const EMOTION_COLORS = {
  anger: '#E63946',      // Red - Anger / Tension / Crisis
  fear: '#F4A261',       // Orange - Fear / Anxiety
  curiosity: '#E9C46A',  // Yellow - Curiosity / Uncertainty
  hope: '#2A9D8F',       // Green - Hope / Balance / Resilience
  calm: '#457B9D',       // Blue - Calm / Stability
  sadness: '#8D5CF6',    // Purple - Sadness / Grief
  neutral: '#6C757D',    // Gray - Neutral
} as const;

// Light variants (for backgrounds, highlights)
export const EMOTION_COLORS_LIGHT = {
  anger: '#F08A92',
  fear: '#F8C9A0',
  curiosity: '#F5DDA0',
  hope: '#5CC4B5',
  calm: '#7AA3BD',
  sadness: '#B08DF8',
  neutral: '#9CA3AF',
} as const;

// Dark variants (for emphasis, borders)
export const EMOTION_COLORS_DARK = {
  anger: '#B82D38',
  fear: '#D88A4A',
  curiosity: '#C9A54A',
  hope: '#1F7A6F',
  calm: '#345A73',
  sadness: '#6B3DD4',
  neutral: '#4B5563',
} as const;

// GMI (Global Mood Index) Colors
// Gradient: Red (negative) → Yellow (neutral) → Green (positive)
export const GMI_COLORS = {
  negative: EMOTION_COLORS.anger,    // Red - Very negative mood
  neutral: EMOTION_COLORS.curiosity, // Yellow - Neutral mood
  positive: EMOTION_COLORS.hope,     // Green - Positive mood
} as const;

// CFI (Collective Fear Index) Colors
// Gradient: Blue (low) → Orange (medium) → Red (high)
export const CFI_COLORS = {
  low: EMOTION_COLORS_LIGHT.calm,    // Light Blue - Low fear
  medium: EMOTION_COLORS.fear,       // Orange - Medium fear
  high: EMOTION_COLORS_DARK.anger,   // Dark Red - High fear
} as const;

// HRI (Hope & Resilience Index) Colors
// Gradient: Gray (low) → Light Green (medium) → Dark Green (high)
export const HRI_COLORS = {
  low: EMOTION_COLORS.neutral,       // Gray - Low hope
  medium: EMOTION_COLORS_LIGHT.hope, // Light Green - Medium hope
  high: EMOTION_COLORS_DARK.hope,    // Dark Green - High hope
} as const;

// Emotion to Color mapping for analysis results
export const EMOTION_MAP: Record<string, string> = {
  // Anger family
  anger: EMOTION_COLORS.anger,
  rage: EMOTION_COLORS.anger,
  frustration: EMOTION_COLORS.anger,
  irritation: EMOTION_COLORS.anger,
  tension: EMOTION_COLORS.anger,
  crisis: EMOTION_COLORS.anger,
  conflict: EMOTION_COLORS.anger,
  
  // Fear family
  fear: EMOTION_COLORS.fear,
  anxiety: EMOTION_COLORS.fear,
  worry: EMOTION_COLORS.fear,
  panic: EMOTION_COLORS.fear,
  terror: EMOTION_COLORS.fear,
  
  // Curiosity family
  curiosity: EMOTION_COLORS.curiosity,
  anticipation: EMOTION_COLORS.curiosity,
  uncertainty: EMOTION_COLORS.curiosity,
  interest: EMOTION_COLORS.curiosity,
  surprise: EMOTION_COLORS.curiosity,
  
  // Hope family
  hope: EMOTION_COLORS.hope,
  joy: EMOTION_COLORS.hope,
  happiness: EMOTION_COLORS.hope,
  optimism: EMOTION_COLORS.hope,
  resilience: EMOTION_COLORS.hope,
  balance: EMOTION_COLORS.hope,
  recovery: EMOTION_COLORS.hope,
  
  // Calm family
  calm: EMOTION_COLORS.calm,
  peace: EMOTION_COLORS.calm,
  serenity: EMOTION_COLORS.calm,
  stability: EMOTION_COLORS.calm,
  neutral: EMOTION_COLORS.calm,
  
  // Sadness family
  sadness: EMOTION_COLORS.sadness,
  grief: EMOTION_COLORS.sadness,
  sorrow: EMOTION_COLORS.sadness,
  melancholy: EMOTION_COLORS.sadness,
  depression: EMOTION_COLORS.sadness,
  loss: EMOTION_COLORS.sadness,
};

// Get color for a specific emotion
export function getEmotionColor(emotion: string): string {
  const normalized = emotion.toLowerCase().trim();
  return EMOTION_MAP[normalized] || EMOTION_COLORS.neutral;
}

// Get GMI color based on value (0-100)
export function getGMIColor(value: number): string {
  if (value < 35) return GMI_COLORS.negative;
  if (value < 65) return GMI_COLORS.neutral;
  return GMI_COLORS.positive;
}

// Get CFI color based on value (0-100)
export function getCFIColor(value: number): string {
  if (value < 35) return CFI_COLORS.low;
  if (value < 65) return CFI_COLORS.medium;
  return CFI_COLORS.high;
}

// Get HRI color based on value (0-100)
export function getHRIColor(value: number): string {
  if (value < 35) return HRI_COLORS.low;
  if (value < 65) return HRI_COLORS.medium;
  return HRI_COLORS.high;
}

// Color with opacity helper
export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Chart color palette (for consistent chart colors)
export const CHART_COLORS = [
  EMOTION_COLORS.anger,
  EMOTION_COLORS.fear,
  EMOTION_COLORS.curiosity,
  EMOTION_COLORS.hope,
  EMOTION_COLORS.calm,
  EMOTION_COLORS.sadness,
];

// Export default for convenience
export default {
  EMOTION_COLORS,
  EMOTION_COLORS_LIGHT,
  EMOTION_COLORS_DARK,
  GMI_COLORS,
  CFI_COLORS,
  HRI_COLORS,
  EMOTION_MAP,
  getEmotionColor,
  getGMIColor,
  getCFIColor,
  getHRIColor,
  withOpacity,
  CHART_COLORS,
};
