import { EventVector } from './graphPipeline';

/**
 * Data to Vector Converter
 * Converts EventVector to numerical vectors for Groq to understand
 * Preserves ALL data while converting to machine-readable format
 */

/**
 * Emotion vector: converts emotion names to numerical indices
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
 * Region to vector index
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
 * Severity to numerical value
 */
const severityToValue: Record<string, number> = {
  low: 0.33,
  medium: 0.66,
  high: 1.0,
};

/**
 * Convert EventVector to numerical vector
 * Format: [topic_hash, topic_confidence, emotion_vector[10], dominant_emotion_idx, 
 *          region_indices[8], region_confidence, impact_score, severity_value, timestamp_normalized]
 */
export function eventVectorToNumericalVector(vector: EventVector): number[] {
  const numericalVector: number[] = [];

  // 1. Topic as hash (simple hash of first 3 chars)
  const topicHash = vector.topic
    .substring(0, 3)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) / 100;
  numericalVector.push(topicHash);

  // 2. Topic confidence (0-1)
  numericalVector.push(vector.topicConfidence);

  // 3. Emotion vector (10 dimensions for all emotions)
  const emotionVector = new Array(10).fill(0);
  for (const [emotion, value] of Object.entries(vector.emotions)) {
    const idx = emotionToIndex[emotion] ?? 4; // Default to neutral
    if (idx < 10) {
      emotionVector[idx] = value;
    }
  }
  numericalVector.push(...emotionVector);

  // 4. Dominant emotion index
  const dominantIdx = emotionToIndex[vector.dominantEmotion] ?? 4;
  numericalVector.push(dominantIdx);

  // 5. Region as multi-hot encoding (8 dimensions)
  const regionVector = new Array(8).fill(0);
  const regions = vector.region.split(',').map(r => r.trim());
  for (const region of regions) {
    const idx = regionToIndex[region] ?? 7; // Default to Global
    if (idx < 8) {
      regionVector[idx] = 1;
    }
  }
  numericalVector.push(...regionVector);

  // 6. Region confidence (0-1)
  numericalVector.push(vector.regionConfidence);

  // 7. Impact score (0-1)
  numericalVector.push(vector.impactScore);

  // 8. Severity as numerical value
  const severityValue = severityToValue[vector.severity] ?? 0.66;
  numericalVector.push(severityValue);

  // 9. Timestamp normalized (0-1, relative to current day)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeInDay = (vector.timestamp.getTime() - startOfDay.getTime()) / (24 * 60 * 60 * 1000);
  numericalVector.push(Math.max(0, Math.min(1, timeInDay)));

  return numericalVector;
}

/**
 * Create vector explanation for Groq
 * Helps Groq understand what each position in the vector means
 */
export function createVectorExplanation(): string {
  return `
Vector Format (Total: 30 dimensions):
- [0]: Topic hash (normalized 0-1)
- [1]: Topic confidence (0-1)
- [2-11]: Emotion vector (10 emotions: joy, hope, curiosity, calm, neutral, sadness, fear, anger, disgust, reserved)
- [12]: Dominant emotion index (0-8)
- [13-20]: Region multi-hot encoding (8 regions: N.Africa, M.East, Sub-Saharan, Europe, Asia, Americas, Oceania, Global)
- [21]: Region confidence (0-1)
- [22]: Impact score (0-1)
- [23]: Severity value (0.33=low, 0.66=medium, 1.0=high)
- [24]: Timestamp normalized (0-1, position in current day)

Interpretation Guide:
- Emotions: Higher values = stronger emotion presence
- Regions: 1 = affected, 0 = not affected
- Impact: 0-0.33 = low, 0.33-0.66 = medium, 0.66-1.0 = high
- Confidence: Higher = more certain analysis
`;
}

/**
 * Format vector for Groq with explanation
 */
export function formatVectorForGroq(vector: EventVector): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  return `
EMOTIONAL CLIMATE VECTOR ANALYSIS
==================================

Vector Data (30-dimensional representation):
[${vectorString}]

${createVectorExplanation()}

Original Data Preserved:
- Topic: ${vector.topic}
- Emotions: ${Object.entries(vector.emotions)
    .map(([e, v]) => `${e}=${(v * 100).toFixed(0)}%`)
    .join(', ')}
- Dominant: ${vector.dominantEmotion}
- Region: ${vector.region}
- Impact: ${(vector.impactScore * 100).toFixed(0)}%
- Severity: ${vector.severity}

Task: Analyze this emotional climate vector and provide:
1. Interpretation of the emotional state
2. Key insights from the vector values
3. Potential implications
4. Recommendations
`;
}

/**
 * Create language-specific vector prompt
 */
export function createVectorPromptInLanguage(
  vector: EventVector,
  language: string = 'en'
): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  const prompts: Record<string, string> = {
    en: `Analyze this 30-dimensional emotional climate vector:
[${vectorString}]

Emotions (indices 2-11): joy, hope, curiosity, calm, neutral, sadness, fear, anger, disgust
Dominant emotion (index 12): ${emotionToEmotion(numericalVector[12])}
Regions (indices 13-20): North Africa, Middle East, Sub-Saharan, Europe, Asia, Americas, Oceania, Global
Impact score (index 22): ${(numericalVector[22] * 100).toFixed(0)}%
Severity (index 23): ${valueToSeverity(numericalVector[23])}

Provide insights on:
1. Emotional state interpretation
2. Regional implications
3. Severity assessment
4. Recommendations`,

    ar: `حلل هذا المتجه الثلاثي الأبعاد للمناخ العاطفي:
[${vectorString}]

العواطف (الفهارس 2-11): الفرح، الأمل، الفضول، الهدوء، محايد، الحزن، الخوف، الغضب، الاشمئزاز
العاطفة السائدة (الفهرس 12): ${emotionToEmotion(numericalVector[12])}
المناطق (الفهارس 13-20): شمال أفريقيا، الشرق الأوسط، أفريقيا جنوب الصحراء، أوروبا، آسيا، الأمريكتان، أوقيانوسيا، عالمي
درجة التأثير (الفهرس 22): ${(numericalVector[22] * 100).toFixed(0)}%
الخطورة (الفهرس 23): ${valueToSeverity(numericalVector[23])}

قدم رؤى حول:
1. تفسير الحالة العاطفية
2. الآثار الإقليمية
3. تقييم الخطورة
4. التوصيات`,

    fr: `Analysez ce vecteur climatique émotionnel 30-dimensionnel:
[${vectorString}]

Émotions (indices 2-11): joie, espoir, curiosité, calme, neutre, tristesse, peur, colère, dégoût
Émotion dominante (indice 12): ${emotionToEmotion(numericalVector[12])}
Régions (indices 13-20): Afrique du Nord, Moyen-Orient, Afrique subsaharienne, Europe, Asie, Amériques, Océanie, Mondial
Score d'impact (indice 22): ${(numericalVector[22] * 100).toFixed(0)}%
Gravité (indice 23): ${valueToSeverity(numericalVector[23])}

Fournissez des perspectives sur:
1. Interprétation de l'état émotionnel
2. Implications régionales
3. Évaluation de la gravité
4. Recommandations`,
  };

  return prompts[language] || prompts.en;
}

/**
 * Helper: Convert emotion index to name
 */
function emotionToEmotion(index: number): string {
  return indexToEmotion[Math.round(index)] || 'neutral';
}

/**
 * Helper: Convert severity value to name
 */
function valueToSeverity(value: number): string {
  if (value < 0.5) return 'low';
  if (value < 0.8) return 'medium';
  return 'high';
}

/**
 * Verify vector integrity
 */
export function verifyVectorIntegrity(vector: number[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (vector.length !== 25) {
    errors.push(`Vector length should be 25, got ${vector.length}`);
  }

  // Check ranges
  for (let i = 0; i < vector.length; i++) {
    if (vector[i] < 0 || vector[i] > 1) {
      errors.push(`Vector[${i}] = ${vector[i]} is out of range [0, 1]`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
