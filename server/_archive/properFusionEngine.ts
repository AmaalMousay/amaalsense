import { z } from 'zod';

/**
 * Proper Fusion Engine
 * Correctly merges all partial results into single EventVector
 * This is what should replace the current weak implementation
 */

export const PartialEventVectorSchema = z.object({
  topic: z.string().optional(),
  topicConfidence: z.number().optional(),
  emotions: z.record(z.string(), z.number()).optional(),
  dominantEmotion: z.string().optional(),
  region: z.string().optional(),
  regionConfidence: z.number().optional(),
  impactScore: z.number().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export type PartialEventVector = z.infer<typeof PartialEventVectorSchema>;

export const EventVectorSchema = z.object({
  topic: z.string(),
  topicConfidence: z.number(),
  emotions: z.record(z.string(), z.number()),
  dominantEmotion: z.string(),
  region: z.string(),
  regionConfidence: z.number(),
  impactScore: z.number(),
  severity: z.enum(['low', 'medium', 'high']),
  timestamp: z.date(),
  sourceId: z.string(),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

/**
 * Proper Fusion Engine Implementation
 * Merges emotions, topics, regions, and impact scores correctly
 */
export async function properFusionEngine(
  input: string,
  partialResults: PartialEventVector[]
): Promise<EventVector> {
  if (partialResults.length === 0) {
    throw new Error('No partial results to fuse');
  }
  
  // 1. MERGE EMOTIONS WITH AVERAGING
  const emotionMap: Record<string, number[]> = {};
  
  for (const partial of partialResults) {
    if (partial.emotions) {
      for (const [emotion, value] of Object.entries(partial.emotions)) {
        if (!emotionMap[emotion]) {
          emotionMap[emotion] = [];
        }
        emotionMap[emotion].push(value);
      }
    }
  }
  
  // Calculate average emotions
  const mergedEmotions: Record<string, number> = {};
  for (const [emotion, values] of Object.entries(emotionMap)) {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    // Proper rounding to 2 decimal places
    mergedEmotions[emotion] = Math.round(average * 100) / 100;
  }
  
  // 2. SELECT DOMINANT EMOTION
  let dominantEmotion = 'neutral';
  let maxValue = 0;
  for (const [emotion, value] of Object.entries(mergedEmotions)) {
    if (value > maxValue) {
      maxValue = value;
      dominantEmotion = emotion;
    }
  }
  
  // 3. SELECT STRONGEST TOPIC
  let topic = 'General';
  let topicConfidence = 0.5;
  for (const partial of partialResults) {
    if (partial.topic && (partial.topicConfidence || 0) > topicConfidence) {
      topic = partial.topic;
      topicConfidence = partial.topicConfidence || 0.5;
    }
  }
  
  // 4. MERGE REGIONS (collect all unique regions)
  const regions = new Set<string>();
  let regionConfidence = 0;
  for (const partial of partialResults) {
    if (partial.region) {
      regions.add(partial.region);
    }
    if (partial.regionConfidence) {
      regionConfidence = Math.max(regionConfidence, partial.regionConfidence);
    }
  }
  const mergedRegion = Array.from(regions).join(', ') || 'Global';
  
  // 5. CALCULATE IMPACT SCORE (average of all impact scores)
  let impactScore = 0;
  let impactCount = 0;
  for (const partial of partialResults) {
    if (partial.impactScore !== undefined) {
      impactScore += partial.impactScore;
      impactCount++;
    }
  }
  impactScore = impactCount > 0 ? impactScore / impactCount : 0.5;
  impactScore = Math.round(impactScore * 100) / 100;
  
  // 6. DETERMINE SEVERITY BASED ON IMPACT SCORE
  let severity: 'low' | 'medium' | 'high' = 'medium';
  if (impactScore < 0.33) {
    severity = 'low';
  } else if (impactScore > 0.66) {
    severity = 'high';
  }
  
  // 7. CREATE UNIFIED EVENTVECTOR
  const eventVector: EventVector = {
    topic,
    topicConfidence,
    emotions: mergedEmotions,
    dominantEmotion,
    region: mergedRegion,
    regionConfidence,
    impactScore,
    severity,
    timestamp: new Date(),
    sourceId: `event-${Date.now()}`,
  };
  
  return eventVector;
}

/**
 * Validate EventVector
 */
export function validateEventVector(vector: EventVector): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate emotions are 0-1
  for (const [emotion, value] of Object.entries(vector.emotions)) {
    if (value < 0 || value > 1) {
      errors.push(`Emotion ${emotion} out of range: ${value}`);
    }
  }
  
  // Validate confidence values
  if (vector.topicConfidence < 0 || vector.topicConfidence > 1) {
    errors.push(`Topic confidence out of range: ${vector.topicConfidence}`);
  }
  
  if (vector.regionConfidence < 0 || vector.regionConfidence > 1) {
    errors.push(`Region confidence out of range: ${vector.regionConfidence}`);
  }
  
  if (vector.impactScore < 0 || vector.impactScore > 1) {
    errors.push(`Impact score out of range: ${vector.impactScore}`);
  }
  
  // Validate required fields
  if (!vector.topic) errors.push('Topic is required');
  if (!vector.dominantEmotion) errors.push('Dominant emotion is required');
  if (!vector.region) errors.push('Region is required');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert EventVector to compact JSON for Groq
 * This is what should be sent to LLM, not raw data
 */
export function eventVectorToJson(vector: EventVector): string {
  return JSON.stringify({
    topic: vector.topic,
    topicConfidence: vector.topicConfidence,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    region: vector.region,
    regionConfidence: vector.regionConfidence,
    impactScore: vector.impactScore,
    severity: vector.severity,
  });
}

/**
 * Estimate tokens for EventVector
 * Should be ~500 tokens, not 51406
 */
export function estimateEventVectorTokens(vector: EventVector): number {
  const json = eventVectorToJson(vector);
  // 1 token ≈ 4 characters
  return Math.ceil(json.length / 4);
}
