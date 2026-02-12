/**
 * Pipeline Router
 * 
 * tRPC procedures for Compression + Vector Pipeline
 */

import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  executePipeline,
  executePipelineBatch,
  getVector,
  searchSimilarVectors,
  getVectorDatabaseStats,
  clearVectorDatabase,
  exportVectorsToJSON,
  pipelineMetrics,
} from './compressionVectorPipeline';

export const pipelineRouter = router({
  /**
   * Execute full pipeline for single news article
   */
  processNews: publicProcedure
    .input(z.object({
      newsText: z.string().min(10),
      sourceId: z.string(),
      sourceName: z.string().optional().default('news'),
      countryCode: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await executePipeline(input);
      pipelineMetrics.record(result);
      
      return {
        success: result.success,
        eventVector: result.eventVector,
        stages: result.stages,
        duration: result.totalDuration,
        similarEvents: result.stages.similaritySearch.similarEvents || [],
      };
    }),

  /**
   * Batch process multiple news articles
   */
  processBatch: publicProcedure
    .input(z.object({
      articles: z.array(z.object({
        newsText: z.string().min(10),
        sourceId: z.string(),
        sourceName: z.string().optional().default('news'),
        countryCode: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const results = await executePipelineBatch(input.articles);
      
      for (const result of results) {
        pipelineMetrics.record(result);
      }
      
      return {
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results.map(r => ({
          success: r.success,
          eventVector: r.eventVector,
          duration: r.totalDuration,
        })),
      };
    }),

  /**
   * Get vector by ID
   */
  getVector: publicProcedure
    .input(z.object({
      vectorId: z.string(),
    }))
    .query(({ input }) => {
      const vector = getVector(input.vectorId);
      
      if (!vector) {
        return {
          success: false,
          error: 'Vector not found',
        };
      }
      
      return {
        success: true,
        vector,
      };
    }),

  /**
   * Search similar vectors
   */
  searchSimilar: publicProcedure
    .input(z.object({
      vectorId: z.string(),
      topK: z.number().int().min(1).max(20).optional().default(5),
      threshold: z.number().min(0).max(1).optional().default(0.6),
    }))
    .query(({ input }) => {
      const queryVector = getVector(input.vectorId);
      
      if (!queryVector) {
        return {
          success: false,
          error: 'Query vector not found',
          results: [],
        };
      }
      
      const results = searchSimilarVectors(queryVector, input.topK, input.threshold);
      
      return {
        success: true,
        queryVector: {
          id: queryVector.id,
          topic: queryVector.topic,
          mainIdea: queryVector.mainIdea,
        },
        results: results.map(r => ({
          id: r.vector.id,
          topic: r.vector.topic,
          mainIdea: r.vector.mainIdea,
          similarity: Math.round(r.similarity * 100) / 100,
          createdAt: r.vector.createdAt,
        })),
      };
    }),

  /**
   * Get vector database statistics
   */
  getStats: publicProcedure
    .query(() => {
      const dbStats = getVectorDatabaseStats();
      const pipelineStats = pipelineMetrics.getMetrics();
      
      return {
        database: {
          totalVectors: dbStats.totalVectors,
          storageSizeBytes: dbStats.storageSize,
          storageSizeMB: (dbStats.storageSize / 1024 / 1024).toFixed(2),
          topicDistribution: dbStats.topicDistribution,
          regionDistribution: dbStats.regionDistribution,
          averageIntensity: dbStats.averageIntensity,
          averagePolarity: dbStats.averagePolarity,
        },
        pipeline: pipelineStats,
      };
    }),

  /**
   * Export vectors to JSON
   */
  exportVectors: publicProcedure
    .query(() => {
      try {
        const json = exportVectorsToJSON();
        return {
          success: true,
          data: json,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Export failed',
        };
      }
    }),

  /**
   * Clear vector database (admin only)
   */
  clearDatabase: publicProcedure
    .mutation(() => {
      try {
        clearVectorDatabase();
        pipelineMetrics.reset();
        
        return {
          success: true,
          message: 'Vector database cleared',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Clear failed',
        };
      }
    }),

  /**
   * Get pipeline health status
   */
  getHealth: publicProcedure
    .query(() => {
      const stats = pipelineMetrics.getMetrics();
      const dbStats = getVectorDatabaseStats();
      
      return {
        status: 'healthy',
        pipeline: {
          totalExecutions: stats.totalExecutions,
          successRate: stats.successRate,
          averageDuration: stats.averageDuration,
        },
        database: {
          totalVectors: dbStats.totalVectors,
          storageSizeMB: (dbStats.storageSize / 1024 / 1024).toFixed(2),
        },
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get pipeline configuration
   */
  getConfig: publicProcedure
    .query(() => {
      return {
        compression: {
          enabled: true,
          compressionRatio: '~80%',
          features: ['mainIdea', 'cause', 'emotion', 'topic', 'region', 'intensity', 'confidence'],
        },
        vectorization: {
          enabled: true,
          dimensions: 8,
          components: ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity', 'intensity', 'polarity'],
        },
        similarity: {
          enabled: true,
          algorithm: 'cosine_similarity',
          threshold: 0.6,
          topK: 5,
        },
        storage: {
          type: 'in-memory',
          persistent: false,
          note: 'Replace with Vector DB (Pinecone, Weaviate, Milvus) for production',
        },
      };
    }),
});

export type PipelineRouter = typeof pipelineRouter;
