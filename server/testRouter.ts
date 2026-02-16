/**
 * Test Router - Simple endpoint to verify API is working
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const testRouter = router({
  /**
   * Simple echo test
   */
  echo: publicProcedure
    .input(z.object({
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      console.log('[TestRouter] Echo received:', input.message);
      return {
        success: true,
        message: input.message,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Simple analysis test
   */
  simpleAnalyze: publicProcedure
    .input(z.object({
      question: z.string(),
    }).optional())
    .query(async ({ input }) => {
      console.log('[TestRouter] Simple analyze received:', input?.question || 'no question');
      
      try {
        // Just return a simple response
        return {
          success: true,
          answer: `تم استقبال سؤالك: ${input?.question || 'بدون سؤال'}`,
          details: {
            detectedTopic: (input?.question || 'unknown').substring(0, 20),
            confidence: 0.8,
            indices: {
              gmi: 50,
              cfi: 60,
              hri: 70,
            },
            emotions: {
              joy: 0.3,
              sadness: 0.2,
              anger: 0.1,
            },
          },
          performance: {
            totalProcessingTime: 100,
          },
        };
      } catch (error) {
        console.error('[TestRouter] Error:', error);
        return {
          success: false,
          error: 'Test analysis failed',
        };
      }
    }),
});
