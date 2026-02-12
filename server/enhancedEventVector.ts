/**
 * Enhanced EventVector with Vector DB Integration
 * 
 * Transforms compressed news into semantic vectors for similarity matching
 * Enables mathematical comparison and pattern discovery
 */

import { CompressedNews } from './newsCompressionLayer';

export interface EventVector {
  id: string;
  createdAt: number;
  sourceId: string;
  sourceType: 'news' | 'social' | 'analysis';
  sourceName: string;
  
  // Temporal
  eventTimestamp: number;
  timeWeight: number;
  
  // Geographic
  region: string;
  country: string;
  
  // Semantic
  topic: string;
  subtopic: string;
  mainIdea: string;
  
  // Emotional Vector (6 dimensions)
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  
  // Event Properties
  intensity: number;
  polarity: number;
  uncertainty: number;
  
  // Weights
  sourceWeight: number;
  relevanceWeight: number;
  
  // Vector Representation (computed)
  vector: number[];
  vectorDimensions: number;
  
  // Metadata
  summary: string;
  cause: string;
  confidence: number;
}

/**
 * Create EventVector from compressed news
 */
export function createEventVectorFromCompressed(
  compressed: CompressedNews,
  sourceId: string,
  sourceName: string = 'news'
): EventVector {
  // Create emotional vector (6 dimensions)
  const emotions: { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number } = {
    joy: 0.1,
    fear: 0.7,
    anger: 0.5,
    sadness: 0.4,
    hope: 0.3,
    curiosity: 0.6,
  };
  
  // Adjust based on detected emotion
  if (compressed.emotion in emotions) {
    emotions[compressed.emotion as keyof typeof emotions] = Math.min(
      1,
      emotions[compressed.emotion as keyof typeof emotions] + 0.3
    );
  }
  
  // Calculate polarity: positive emotions increase polarity, negative decrease
  const positiveEmotions = emotions.joy + emotions.hope;
  const negativeEmotions = emotions.fear + emotions.anger + emotions.sadness;
  const polarity = (positiveEmotions - negativeEmotions) / (positiveEmotions + negativeEmotions + 0.001);
  
  // Create vector representation (6D emotional vector + intensity + polarity)
  const vector = [
    emotions.joy,
    emotions.fear,
    emotions.anger,
    emotions.sadness,
    emotions.hope,
    emotions.curiosity,
    compressed.intensity,
    Math.max(0, polarity),
  ];
  
  return {
    id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    sourceId,
    sourceType: 'news',
    sourceName,
    eventTimestamp: Date.now(),
    timeWeight: 1.0,
    region: compressed.region,
    country: 'XX',
    topic: compressed.topic,
    subtopic: compressed.emotion,
    mainIdea: compressed.mainIdea,
    emotions,
    intensity: compressed.intensity,
    polarity,
    uncertainty: 1 - compressed.confidence,
    sourceWeight: 0.7,
    relevanceWeight: 1.0,
    vector,
    vectorDimensions: vector.length,
    summary: compressed.mainIdea,
    cause: compressed.cause,
    confidence: compressed.confidence,
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  
  return dotProduct / (norm1 * norm2);
}

/**
 * Calculate Euclidean distance between two vectors
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }
  
  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

/**
 * Find similar events in vector space
 */
export function findSimilarEvents(
  queryVector: EventVector,
  eventVectors: EventVector[],
  topK: number = 5,
  similarityThreshold: number = 0.6
): Array<{ event: EventVector; similarity: number; distance: number }> {
  const results = eventVectors
    .filter(ev => ev.id !== queryVector.id) // Exclude self
    .map(ev => ({
      event: ev,
      similarity: cosineSimilarity(queryVector.vector, ev.vector),
      distance: euclideanDistance(queryVector.vector, ev.vector),
    }))
    .filter(r => r.similarity >= similarityThreshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  return results;
}

/**
 * Aggregate multiple event vectors
 */
export function aggregateEventVectors(vectors: EventVector[]): EventVector {
  if (vectors.length === 0) {
    throw new Error('Cannot aggregate empty vector list');
  }
  
  const avgVector = new Array(vectors[0].vector.length).fill(0);
  
  // Calculate average vector
  for (const ev of vectors) {
    for (let i = 0; i < ev.vector.length; i++) {
      avgVector[i] += ev.vector[i];
    }
  }
  
  for (let i = 0; i < avgVector.length; i++) {
    avgVector[i] /= vectors.length;
  }
  
  // Calculate average emotions
  const avgEmotions: Record<string, number> = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };
  
  for (const ev of vectors) {
    for (const [emotion, value] of Object.entries(ev.emotions)) {
      avgEmotions[emotion] += value;
    }
  }
  
  for (const emotion in avgEmotions) {
    avgEmotions[emotion] /= vectors.length;
  }
  
  // Create aggregated vector
  return {
    id: `agg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    sourceId: 'aggregated',
    sourceType: 'analysis',
    sourceName: 'EventVector Aggregation',
    eventTimestamp: Math.round(
      vectors.reduce((sum, v) => sum + v.eventTimestamp, 0) / vectors.length
    ),
    timeWeight: 1.0,
    region: vectors[0].region,
    country: vectors[0].country,
    topic: vectors[0].topic,
    subtopic: 'aggregated',
    mainIdea: `Aggregated analysis of ${vectors.length} events`,
    emotions: avgEmotions as { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number; },
    intensity: vectors.reduce((sum, v) => sum + v.intensity, 0) / vectors.length,
    polarity: vectors.reduce((sum, v) => sum + v.polarity, 0) / vectors.length,
    uncertainty: vectors.reduce((sum, v) => sum + v.uncertainty, 0) / vectors.length,
    sourceWeight: 1.0,
    relevanceWeight: 1.0,
    vector: avgVector,
    vectorDimensions: avgVector.length,
    summary: `Aggregated from ${vectors.length} events`,
    cause: 'Multiple factors',
    confidence: vectors.reduce((sum, v) => sum + v.confidence, 0) / vectors.length,
  };
}

/**
 * Detect trends in event vectors over time
 */
export function detectTrends(
  vectors: EventVector[],
  timeWindow: number = 86400000 // 24 hours in ms
): Array<{
  period: number;
  avgIntensity: number;
  avgPolarity: number;
  emotionalShift: number;
  eventCount: number;
}> {
  if (vectors.length === 0) return [];
  
  const now = Date.now();
  const periods = Math.ceil((now - vectors[0].eventTimestamp) / timeWindow);
  
  const trends = [];
  
  for (let p = 0; p < periods; p++) {
    const periodStart = now - (p + 1) * timeWindow;
    const periodEnd = now - p * timeWindow;
    
    const periodVectors = vectors.filter(
      v => v.eventTimestamp >= periodStart && v.eventTimestamp < periodEnd
    );
    
    if (periodVectors.length === 0) continue;
    
    const avgIntensity = periodVectors.reduce((sum, v) => sum + v.intensity, 0) / periodVectors.length;
    const avgPolarity = periodVectors.reduce((sum, v) => sum + v.polarity, 0) / periodVectors.length;
    
    // Calculate emotional shift (change in dominant emotion)
    const emotionalShift = periodVectors.length > 1
      ? euclideanDistance(periodVectors[0].vector, periodVectors[periodVectors.length - 1].vector)
      : 0;
    
    trends.push({
      period: p,
      avgIntensity,
      avgPolarity,
      emotionalShift,
      eventCount: periodVectors.length,
    });
  }
  
  return trends.reverse();
}

/**
 * Get vector statistics
 */
export function getVectorStats(vectors: EventVector[]): {
  totalVectors: number;
  avgIntensity: number;
  avgPolarity: number;
  dominantEmotion: string;
  vectorDensity: number;
} {
  if (vectors.length === 0) {
    return {
      totalVectors: 0,
      avgIntensity: 0,
      avgPolarity: 0,
      dominantEmotion: 'neutral',
      vectorDensity: 0,
    };
  }
  
  const avgIntensity = vectors.reduce((sum, v) => sum + v.intensity, 0) / vectors.length;
  const avgPolarity = vectors.reduce((sum, v) => sum + v.polarity, 0) / vectors.length;
  
  // Find dominant emotion
  const emotionScores: Record<string, number> = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };
  
  for (const v of vectors) {
    for (const [emotion, value] of Object.entries(v.emotions)) {
      emotionScores[emotion] = (emotionScores[emotion] || 0) + value;
    }
  }
  
  const dominantEmotion = Object.entries(emotionScores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] || 'neutral';
  
  // Calculate vector density (average pairwise similarity)
  let totalSimilarity = 0;
  let pairCount = 0;
  
  for (let i = 0; i < Math.min(vectors.length, 10); i++) {
    for (let j = i + 1; j < Math.min(vectors.length, 10); j++) {
      totalSimilarity += cosineSimilarity(vectors[i].vector, vectors[j].vector);
      pairCount++;
    }
  }
  
  const vectorDensity = pairCount > 0 ? totalSimilarity / pairCount : 0;
  
  return {
    totalVectors: vectors.length,
    avgIntensity,
    avgPolarity,
    dominantEmotion,
    vectorDensity,
  };
}
