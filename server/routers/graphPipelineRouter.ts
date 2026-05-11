/**
 * Graph Pipeline tRPC Router
 * 
 * Exposes the graph pipeline architecture through tRPC
 * Integrates Groq LLM for reasoning engine
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { graphPipeline, reasoningEngine, completePipeline, EventVectorSchema } from "./graphPipeline";

export const graphPipelineRouter = router({
  /**
   * Analyze input through graph pipeline
   * Returns EventVector with all engine results
   */
  analyzeWithGraph: publicProcedure
    .input(z.object({
      input: z.string().min(1).max(5000),
      includeAnalysis: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      try {
        // Run graph pipeline
        const eventVector = await graphPipeline(input.input);

        // If analysis requested, run reasoning engine
        let analysis: string | undefined;
        if (input.includeAnalysis) {
          analysis = await reasoningEngine(eventVector);
        }

        return {
          success: true,
          eventVector: {
            topic: eventVector.topic,
            topicConfidence: Math.round(eventVector.topicConfidence * 100),
            emotions: Object.entries(eventVector.emotions).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: Math.round(value * 100),
              }),
              {} as Record<string, number>
            ),
            dominantEmotion: eventVector.dominantEmotion,
            region: eventVector.region,
            regionConfidence: Math.round(eventVector.regionConfidence * 100),
            impactScore: Math.round(eventVector.impactScore * 100),
            severity: eventVector.severity,
            timestamp: eventVector.timestamp.toISOString(),
            sourceId: eventVector.sourceId,
          },
          analysis,
        };
      } catch (error) {
        console.error('Graph Pipeline Router Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Complete pipeline: Graph analysis + Groq reasoning
   * Returns both EventVector and AI-generated analysis
   */
  completeAnalysis: publicProcedure
    .input(z.object({
      input: z.string().min(1).max(5000),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await completePipeline(input.input);

        return {
          success: true,
          eventVector: {
            topic: result.eventVector.topic,
            topicConfidence: Math.round(result.eventVector.topicConfidence * 100),
            emotions: Object.entries(result.eventVector.emotions).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: Math.round(value * 100),
              }),
              {} as Record<string, number>
            ),
            dominantEmotion: result.eventVector.dominantEmotion,
            region: result.eventVector.region,
            regionConfidence: Math.round(result.eventVector.regionConfidence * 100),
            impactScore: Math.round(result.eventVector.impactScore * 100),
            severity: result.eventVector.severity,
            timestamp: result.eventVector.timestamp.toISOString(),
            sourceId: result.eventVector.sourceId,
          },
          analysis: result.analysis,
        };
      } catch (error) {
        console.error('Complete Analysis Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Batch analysis - process multiple inputs
   * Efficient for bulk processing
   */
  batchAnalyze: publicProcedure
    .input(z.object({
      inputs: z.array(z.string().min(1).max(5000)).min(1).max(10),
    }))
    .mutation(async ({ input }) => {
      try {
        const results = await Promise.all(
          input.inputs.map(async (text) => {
            const eventVector = await graphPipeline(text);
            return {
              input: text.substring(0, 100),
              topic: eventVector.topic,
              dominantEmotion: eventVector.dominantEmotion,
              impactScore: Math.round(eventVector.impactScore * 100),
              severity: eventVector.severity,
            };
          })
        );

        return {
          success: true,
          results,
          count: results.length,
        };
      } catch (error) {
        console.error('Batch Analysis Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Stream analysis using Groq streaming
   * For real-time response generation
   */
  streamAnalysis: publicProcedure
    .input(z.object({
      input: z.string().min(1).max(5000),
    }))
    .mutation(async ({ input }) => {
      try {
        const eventVector = await graphPipeline(input.input);

        // Return EventVector immediately
        // Streaming would be handled by WebSocket in production
        return {
          success: true,
          eventVector: {
            topic: eventVector.topic,
            topicConfidence: Math.round(eventVector.topicConfidence * 100),
            emotions: Object.entries(eventVector.emotions).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: Math.round(value * 100),
              }),
              {} as Record<string, number>
            ),
            dominantEmotion: eventVector.dominantEmotion,
            region: eventVector.region,
            regionConfidence: Math.round(eventVector.regionConfidence * 100),
            impactScore: Math.round(eventVector.impactScore * 100),
            severity: eventVector.severity,
          },
          streamReady: true,
        };
      } catch (error) {
        console.error('Stream Analysis Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Health check for graph pipeline
   */
  health: publicProcedure.query(async () => {
    return {
      status: 'healthy',
      pipeline: 'graph',
      engines: ['topic', 'emotion', 'region', 'impact'],
      fusionEngine: 'active',
      reasoningEngine: 'groq',
      timestamp: new Date().toISOString(),
    };
  }),
});
