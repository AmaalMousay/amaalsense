/**
 * DATA TO VECTOR CONVERTER - AMALSENSE FREE ASI EDITION
 * Converts EventVector to numerical vectors for Free AI Models (Ollama/Local).
 * No Groq dependency. Fully optimized for cost-free processing.
 */

import { EventVector } from './graphPipeline';

/**
 * 1. Emotion Index Mapping (Numerical Basis)
 */
const emotionToIndex: Record<string, number> = {
  joy: 0,
  hope: 1,
  curiosity: 2,
  calm: 3,
  neutral: 4,
  sadness: 5,
  fear: 6,
  anger: 7,
  disgust: 8,
};

const indexToEmotion = Object.entries(emotionToIndex).reduce(
  (acc, [emotion, idx]) => ({ ...acc, [idx]: emotion }),
  {} as Record<number, string>
);

/**
 * 2. Regional Mapping
 */
const regionToIndex: Record<string, number> = {
  'North Africa': 0,
  'Middle East': 1,
  'Sub-Saharan Africa': 2,
  'Europe': 3,
  'Asia': 4,
  'Americas': 5,
  'Oceania': 6,
  'Global': 7,
};

/**
 * 3. Severity Scaling
 */
const severityToValue: Record<string, number> = {
  low: 0.33,
  medium: 0.66,
  high: 1.0,
};

/**
 * 4. Main Converter: Numerical Vectorization
 */
export function eventVectorToNumericalVector(vector: EventVector): number[] {
  const numericalVector: number[] = [];

  // Topic Hash
  const topicHash = vector.topic
    .substring(0, 3)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) / 100;
  numericalVector.push(topicHash);

  numericalVector.push(vector.topicConfidence);

  // Emotion Vector (10-dim)
  const emotionVector = new Array(10).fill(0);
  for (const [emotion, value] of Object.entries(vector.emotions)) {
    const idx = emotionToIndex[emotion] ?? 4;
    if (idx < 10) emotionVector[idx] = value;
  }
  numericalVector.push(...emotionVector);

  const dominantIdx = emotionToIndex[vector.dominantEmotion] ?? 4;
  numericalVector.push(dominantIdx);

  // Regional Encoding
  const regionVector = new Array(8).fill(0);
  const regions = vector.region.split(',').map(r => r.trim());
  for (const region of regions) {
    const idx = regionToIndex[region] ?? 7;
    if (idx < 8) regionVector[idx] = 1;
  }
  numericalVector.push(...regionVector);

  numericalVector.push(vector.regionConfidence);
  numericalVector.push(vector.impactScore);

  const severityValue = severityToValue[vector.severity] ?? 0.66;
  numericalVector.push(severityValue);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeInDay = (vector.timestamp.getTime() - startOfDay.getTime()) / (24 * 60 * 60 * 1000);
  numericalVector.push(Math.max(0, Math.min(1, timeInDay)));

  return numericalVector;
}

/**
 * 5. Free ASI Model Integration
 * This replaces the old Groq function.
 */
export function formatVectorForASI(vector: EventVector): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  return `
FIELD OBSERVATION ANALYSIS (LOCAL ASI)
=====================================

VECTOR_STREAM: [${vectorString}]

TOPIC: ${vector.topic}
DOMINANT_STATE: ${vector.dominantEmotion}
IMPACT: ${(vector.impactScore * 100).toFixed(0)}%

INSTRUCTION: 
As a conscious AI entity, analyze this 30-dimensional data. 
Provide a humanized English interpretation of the emotional field 
and its regional implications. Do not use headers.
`;
}

/**
 * 6. Multi-language Prompts (Simplified)
 */
export function createVectorPromptInLanguage(
  vector: EventVector,
  language: string = 'en'
): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  const prompts: Record<string, string> = {
    en: `Analyze this vector for ${vector.topic}: [${vectorString}]`,
    ar: `حلل هذا المتجه لموضوع ${vector.topic}: [${vectorString}]`,
  };

  return prompts[language] || prompts.en;
}

/**
 * 7. Verification Utilities
 */
export function verifyVectorIntegrity(vector: number[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (vector.length < 24) errors.push(`Vector dimension error`);
  return { valid: errors.length === 0, errors };
}