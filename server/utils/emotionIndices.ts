/**
 * Shared Index Calculations (GMI / CFI / HRI)
 *
 * Single source of truth for AmalSense's three core collective-emotion indices.
 * Every engine should import from here instead of reimplementing the formulas.
 */

export interface EmotionValues {
  joy?: number;
  fear?: number;
  anger?: number;
  sadness?: number;
  hope?: number;
  curiosity?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Global Mood Index (-100 to +100)
 * Positive means the collective mood is optimistic; negative means pessimistic.
 */
export function calculateGMI(emotions: EmotionValues): number {
  const j = emotions.joy ?? 0;
  const h = emotions.hope ?? 0;
  const c = emotions.curiosity ?? 0;
  const f = emotions.fear ?? 0;
  const a = emotions.anger ?? 0;
  const s = emotions.sadness ?? 0;

  const positive = j + h + c * 0.5;
  const negative = f + a + s;
  const total = positive + negative;
  if (total === 0) return 0;
  return Math.round(clamp(((positive - negative) / total) * 100, -100, 100));
}

/**
 * Collective Fear Index (0 to 100)
 * Higher values indicate elevated fear pressure in the collective mood.
 */
export function calculateCFI(emotions: EmotionValues): number {
  const j = emotions.joy ?? 0;
  const h = emotions.hope ?? 0;
  const c = emotions.curiosity ?? 0;
  const f = emotions.fear ?? 0;
  const a = emotions.anger ?? 0;
  const s = emotions.sadness ?? 0;

  const total = j + h + c + f + a + s;
  if (total === 0) return 50;
  const fearComponent = f * 1.5 + a * 0.6 + s * 0.35;
  return Math.round(clamp((fearComponent / total) * 100, 0, 100));
}

/**
 * Hope & Resilience Index (0 to 100)
 * Higher values indicate stronger collective hope and resilience.
 */
export function calculateHRI(emotions: EmotionValues): number {
  const j = emotions.joy ?? 0;
  const h = emotions.hope ?? 0;
  const c = emotions.curiosity ?? 0;
  const f = emotions.fear ?? 0;
  const a = emotions.anger ?? 0;
  const s = emotions.sadness ?? 0;

  const total = j + h + c + f + a + s;
  if (total === 0) return 50;
  const hopeComponent = h * 1.5 + j + c * 0.45;
  return Math.round(clamp((hopeComponent / total) * 100, 0, 100));
}

/**
 * Compute all three indices at once.
 */
export function computeIndices(emotions: EmotionValues): { gmi: number; cfi: number; hri: number } {
  return {
    gmi: calculateGMI(emotions),
    cfi: calculateCFI(emotions),
    hri: calculateHRI(emotions),
  };
}
