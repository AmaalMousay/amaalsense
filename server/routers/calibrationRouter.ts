/**
 * Calibration Router
 *
 * Backend for the interactive survey system. When users chat with AmalSense,
 * the frontend can show 1-2 quick survey questions to calibrate the system's
 * emotion detection against real human sentiment.
 *
 * The frontend should call:
 *   1. generateSurvey    — when user is about to see questions
 *   2. submitResponse    — when user answers
 *   3. getCalibrationReport — (admin) view calibration results
 */

import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';

export const calibrationRouter = router({
  /**
   * Generate a short survey (1-2 questions) for the user
   */
  generateSurvey: publicProcedure
    .input(z.object({
      topic: z.string().optional(),
      domain: z.string().optional(),
      country: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { generateSmartSurvey } = await import('../cognitiveArchitecture/calibrationLayer');
      const survey = await generateSmartSurvey(
        input.topic || 'general',
        input.domain || 'general',
        input.country,
      );
      return { success: true, survey };
    }),

  /**
   * Submit a user's response to a survey question
   */
  submitResponse: publicProcedure
    .input(z.object({
      surveyId: z.string(),
      questionId: z.string(),
      answer: z.string(),
      userId: z.number().optional(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('../_core/db');
      const db = await getDb();
      if (!db) return { success: false, error: 'Database unavailable' };

      // Store survey response in a simple table or in-memory for now
      // In production, you'd want a dedicated survey_responses table
      console.log(`[Calibration] Survey ${input.surveyId}, Q${input.questionId}: ${input.answer}`);

      return { success: true };
    }),

  /**
   * Get the calibration report for a topic (compares AI vs user sentiment)
   */
  getCalibrationReport: publicProcedure
    .input(z.object({
      topic: z.string(),
      domain: z.string().optional(),
      country: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Get the current emotion indices from the network engine
      const { getGlobalMood } = await import('../engines/networkEngine');
      const mood = await getGlobalMood();

      const mediaPerception = {
        fear: mood.cfi,
        hope: mood.hri,
        anger: Math.max(0, 100 - mood.cfi),
        confusion: 20,
        acceptance: 20,
      };

      const { generateCalibrationReport } = await import('../cognitiveArchitecture/calibrationLayer');
      const report = await generateCalibrationReport(
        input.topic,
        mediaPerception,
        [] // surveyResponses — would need a DB table
      );

      return { success: true, report };
    }),
});
