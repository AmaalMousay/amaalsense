/**
 * Compression + Vector Pipeline
 * 
 * Chains: News → Compress → EventVector → Vector DB Storage
 * Enables real-time semantic indexing of incoming news
 */

import { compressNews, CompressedNews } from './newsCompressionLayer';
import { createEventVectorFromCompressed, EventVector, findSimilarEvents } from './enhancedEventVector';

export interface PipelineInput {
  newsText: string;
  sourceId: string;
  sourceName?: string;
  countryCode?: string;
}

export interface PipelineOutput {
  success: boolean;
  stages: {
    compression: {
      success: boolean;
      data?: CompressedNews;
      error?: string;
    };
    vectorization: {
      success: boolean;
      data?: EventVector;
      error?: string;
    };
    storage: {
      success: boolean;
      vectorId?: string;
      error?: string;
    };
    similaritySearch: {
      success: boolean;
      similarEvents?: Array<{ eventId: string; similarity: number }>;
      error?: string;
    };
  };
  totalDuration: number;
  eventVector?: EventVector;
}

// In-memory vector storage (replace with actual Vector DB in production)
const vectorDatabase: Map<string, EventVector> = new Map();
const vectorIndex: EventVector[] = [];

/**
 * Execute full pipeline: News → Compress → EventVector → Storage
 */
export async function executePipeline(input: PipelineInput): Promise<PipelineOutput> {
  const startTime = Date.now();
  const output: PipelineOutput = {
    success: false,
    stages: {
      compression: { success: false },
      vectorization: { success: false },
      storage: { success: false },
      similaritySearch: { success: false },
    },
    totalDuration: 0,
  };
  
  try {
    // Stage 1: Compression
    const compressionResult = compressNews(input.newsText);
    if (compressionResult.success) {
      output.stages.compression = {
        success: true,
        data: compressionResult.compressed,
      };
    } else {
      output.stages.compression = {
        success: false,
        error: compressionResult.error,
      };
      output.totalDuration = Date.now() - startTime;
      return output;
    }
    
    // Stage 2: Vectorization
    try {
      const eventVector = createEventVectorFromCompressed(
        compressionResult.compressed,
        input.sourceId,
        input.sourceName || 'news'
      );
      
      output.stages.vectorization = {
        success: true,
        data: eventVector,
      };
      output.eventVector = eventVector;
    } catch (error) {
      output.stages.vectorization = {
        success: false,
        error: error instanceof Error ? error.message : 'Vectorization failed',
      };
      output.totalDuration = Date.now() - startTime;
      return output;
    }
    
    // Stage 3: Storage
    try {
      const vectorId = output.eventVector!.id;
      vectorDatabase.set(vectorId, output.eventVector!);
      vectorIndex.push(output.eventVector!);
      
      output.stages.storage = {
        success: true,
        vectorId,
      };
    } catch (error) {
      output.stages.storage = {
        success: false,
        error: error instanceof Error ? error.message : 'Storage failed',
      };
      output.totalDuration = Date.now() - startTime;
      return output;
    }
    
    // Stage 4: Similarity Search
    try {
      const similarEvents = findSimilarEvents(
        output.eventVector!,
        vectorIndex,
        5, // Top 5 similar events
        0.6 // Similarity threshold
      );
      
      output.stages.similaritySearch = {
        success: true,
        similarEvents: similarEvents.map(e => ({
          eventId: e.event.id,
          similarity: Math.round(e.similarity * 100) / 100,
        })),
      };
    } catch (error) {
      output.stages.similaritySearch = {
        success: false,
        error: error instanceof Error ? error.message : 'Similarity search failed',
      };
    }
    
    output.success = true;
    output.totalDuration = Date.now() - startTime;
    return output;
  } catch (error) {
    output.totalDuration = Date.now() - startTime;
    return output;
  }
}

/**
 * Batch execute pipeline for multiple news articles
 */
export async function executePipelineBatch(
  inputs: PipelineInput[]
): Promise<PipelineOutput[]> {
  const results: PipelineOutput[] = [];
  
  for (const input of inputs) {
    const result = await executePipeline(input);
    results.push(result);
  }
  
  return results;
}

/**
 * Get vector from storage
 */
export function getVector(vectorId: string): EventVector | undefined {
  return vectorDatabase.get(vectorId);
}

/**
 * Search similar vectors
 */
export function searchSimilarVectors(
  queryVector: EventVector,
  topK: number = 5,
  threshold: number = 0.6
): Array<{ vector: EventVector; similarity: number }> {
  return findSimilarEvents(queryVector, vectorIndex, topK, threshold).map(e => ({
    vector: e.event,
    similarity: e.similarity,
  }));
}

/**
 * Get vector database statistics
 */
export function getVectorDatabaseStats(): {
  totalVectors: number;
  storageSize: number;
  topicDistribution: Record<string, number>;
  regionDistribution: Record<string, number>;
  averageIntensity: number;
  averagePolarity: number;
} {
  const vectors = Array.from(vectorDatabase.values());
  
  if (vectors.length === 0) {
    return {
      totalVectors: 0,
      storageSize: 0,
      topicDistribution: {},
      regionDistribution: {},
      averageIntensity: 0,
      averagePolarity: 0,
    };
  }
  
  // Topic distribution
  const topicDistribution: Record<string, number> = {};
  for (const v of vectors) {
    topicDistribution[v.topic] = (topicDistribution[v.topic] || 0) + 1;
  }
  
  // Region distribution
  const regionDistribution: Record<string, number> = {};
  for (const v of vectors) {
    regionDistribution[v.region] = (regionDistribution[v.region] || 0) + 1;
  }
  
  // Average metrics
  const avgIntensity = vectors.reduce((sum, v) => sum + v.intensity, 0) / vectors.length;
  const avgPolarity = vectors.reduce((sum, v) => sum + v.polarity, 0) / vectors.length;
  
  // Estimate storage size (rough estimate)
  const storageSize = vectors.reduce((sum, v) => {
    return sum + JSON.stringify(v).length;
  }, 0);
  
  return {
    totalVectors: vectors.length,
    storageSize,
    topicDistribution,
    regionDistribution,
    averageIntensity: Math.round(avgIntensity * 100) / 100,
    averagePolarity: Math.round(avgPolarity * 100) / 100,
  };
}

/**
 * Clear vector database
 */
export function clearVectorDatabase(): void {
  vectorDatabase.clear();
  vectorIndex.length = 0;
}

/**
 * Export vectors to JSON
 */
export function exportVectorsToJSON(): string {
  const vectors = Array.from(vectorDatabase.values());
  return JSON.stringify(vectors, null, 2);
}

/**
 * Get pipeline performance metrics
 */
export const pipelineMetrics = {
  totalExecutions: 0,
  successfulExecutions: 0,
  failedExecutions: 0,
  totalDuration: 0,
  compressionFailures: 0,
  vectorizationFailures: 0,
  storageFailures: 0,
  
  record(output: PipelineOutput) {
    this.totalExecutions++;
    if (output.success) {
      this.successfulExecutions++;
    } else {
      this.failedExecutions++;
    }
    this.totalDuration += output.totalDuration;
    
    if (!output.stages.compression.success) this.compressionFailures++;
    if (!output.stages.vectorization.success) this.vectorizationFailures++;
    if (!output.stages.storage.success) this.storageFailures++;
  },
  
  getMetrics() {
    return {
      totalExecutions: this.totalExecutions,
      successRate: this.totalExecutions > 0 
        ? ((this.successfulExecutions / this.totalExecutions) * 100).toFixed(2) + '%'
        : 'N/A',
      averageDuration: this.totalExecutions > 0
        ? (this.totalDuration / this.totalExecutions).toFixed(0) + 'ms'
        : 'N/A',
      failureBreakdown: {
        compression: this.compressionFailures,
        vectorization: this.vectorizationFailures,
        storage: this.storageFailures,
      },
    };
  },
  
  reset() {
    this.totalExecutions = 0;
    this.successfulExecutions = 0;
    this.failedExecutions = 0;
    this.totalDuration = 0;
    this.compressionFailures = 0;
    this.vectorizationFailures = 0;
    this.storageFailures = 0;
  },
};
