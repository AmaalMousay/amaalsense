/**
 * tRPC Router for New Features
 * 
 * Integrates EventVector, Daily Weather, Universal Q&A, and Quick Explanations
 * into tRPC procedures for frontend consumption
 */

import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import { 
  EventVectorSchema, 
  createEventVector, 
  calculateAggregatedMetrics,
  validateEventVector,
} from './eventVectorModel';
import { 
  generateEmotionalWeatherReport, 
  formatWeatherReport,
} from './dailyEmotionalWeather';
import { 
  answerUniversalQuestion, 
  getAllUniversalQuestions,
  formatUniversalAnswer,
} from './universalQuestionAnswering';
import { 
  generateQuickExplanation, 
  formatQuickExplanation,
} from './quickExplanationSystem';

/**
 * Sample EventVectors for demonstration
 * In production, these would come from real news sources via GDELT API
 */
const SAMPLE_EVENT_VECTORS = [
  {
    topic: 'economy' as const,
    subTopic: 'inflation',
    region: 'mena' as const,
    country: 'LY',
    emotions: {
      joy: 0.2,
      fear: 0.7,
      anger: 0.4,
      sadness: 0.5,
      hope: 0.3,
      curiosity: 0.6,
    },
    intensity: 0.8,
    polarity: -0.5,
    uncertainty: 0.4,
    sourceType: 'news' as const,
    sourceName: 'Reuters',
    summary: 'Libyan dinar experiences significant devaluation amid economic crisis',
  },
  {
    topic: 'politics' as const,
    subTopic: 'elections',
    region: 'mena' as const,
    country: 'EG',
    emotions: {
      joy: 0.4,
      fear: 0.5,
      anger: 0.3,
      sadness: 0.2,
      hope: 0.6,
      curiosity: 0.7,
    },
    intensity: 0.7,
    polarity: 0.2,
    uncertainty: 0.5,
    sourceType: 'news' as const,
    sourceName: 'Al Jazeera',
    summary: 'Regional elections show increased civic participation and optimism',
  },
  {
    topic: 'conflict' as const,
    subTopic: 'regional',
    region: 'mena' as const,
    country: 'SY',
    emotions: {
      joy: 0.1,
      fear: 0.9,
      anger: 0.8,
      sadness: 0.7,
      hope: 0.2,
      curiosity: 0.4,
    },
    intensity: 0.95,
    polarity: -0.9,
    uncertainty: 0.3,
    sourceType: 'news' as const,
    sourceName: 'BBC',
    summary: 'Ongoing regional conflict creates humanitarian crisis',
  },
  {
    topic: 'society' as const,
    subTopic: 'migration',
    region: 'europe' as const,
    emotions: {
      joy: 0.3,
      fear: 0.6,
      anger: 0.4,
      sadness: 0.5,
      hope: 0.4,
      curiosity: 0.5,
    },
    intensity: 0.6,
    polarity: -0.2,
    uncertainty: 0.6,
    sourceType: 'news' as const,
    sourceName: 'DW',
    summary: 'European nations debate immigration policies and integration',
  },
  {
    topic: 'health' as const,
    subTopic: 'pandemic',
    region: 'global' as const,
    emotions: {
      joy: 0.5,
      fear: 0.3,
      anger: 0.2,
      sadness: 0.2,
      hope: 0.7,
      curiosity: 0.6,
    },
    intensity: 0.5,
    polarity: 0.3,
    uncertainty: 0.4,
    sourceType: 'news' as const,
    sourceName: 'WHO',
    summary: 'Global health improvements show recovery from pandemic',
  },
];

/**
 * Create sample EventVectors
 */
function getSampleEventVectors() {
  return SAMPLE_EVENT_VECTORS.map(data => createEventVector(data));
}

/**
 * New Features Router
 */
export const newFeaturesRouter = router({
  /**
   * Get Daily Emotional Weather Report
   */
  getDailyWeather: publicProcedure
    .input(z.object({
      region: z.enum(['global', 'europe', 'mena', 'asia', 'americas', 'africa', 'oceania']).optional(),
    }).optional())
    .query(({ input }) => {
      const eventVectors = getSampleEventVectors();
      
      // Filter by region if provided
      const filtered = input?.region 
        ? eventVectors.filter(ev => ev.region === input.region || ev.region === 'global')
        : eventVectors;
      
      const report = generateEmotionalWeatherReport(filtered);
      
      return {
        success: true,
        data: report,
        formatted: formatWeatherReport(report),
      };
    }),

  /**
   * Answer Universal Question
   */
  answerQuestion: publicProcedure
    .input(z.object({
      question: z.enum([
        'is_world_dangerous',
        'are_we_divided',
        'is_there_hope',
        'is_economy_stable',
        'are_conflicts_increasing',
        'is_climate_crisis_worsening',
      ]),
    }))
    .query(({ input }) => {
      const eventVectors = getSampleEventVectors();
      const answer = answerUniversalQuestion(input.question, eventVectors);
      
      return {
        success: true,
        data: answer,
        formatted: formatUniversalAnswer(answer),
      };
    }),

  /**
   * Get all available universal questions
   */
  getAvailableQuestions: publicProcedure
    .query(() => {
      const questions = getAllUniversalQuestions();
      
      return {
        success: true,
        data: questions,
        count: questions.length,
      };
    }),

  /**
   * Get Quick Explanation (What's happening now?)
   */
  getQuickExplanation: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(10).optional().default(5),
    }).optional())
    .query(({ input }) => {
      const eventVectors = getSampleEventVectors();
      const explanation = generateQuickExplanation(eventVectors);
      
      return {
        success: true,
        data: explanation,
        formatted: formatQuickExplanation(explanation),
      };
    }),

  /**
   * Get aggregated metrics from EventVectors
   */
  getAggregatedMetrics: publicProcedure
    .input(z.object({
      region: z.enum(['global', 'europe', 'mena', 'asia', 'americas', 'africa', 'oceania']).optional(),
    }).optional())
    .query(({ input }) => {
      const eventVectors = getSampleEventVectors();
      
      // Filter by region if provided
      const filtered = input?.region 
        ? eventVectors.filter(ev => ev.region === input.region || ev.region === 'global')
        : eventVectors;
      
      const metrics = calculateAggregatedMetrics(filtered);
      
      return {
        success: true,
        data: metrics,
        eventCount: filtered.length,
      };
    }),

  /**
   * Create new EventVector (for testing)
   */
  createEventVector: publicProcedure
    .input(z.object({
      topic: z.enum(['economy', 'politics', 'conflict', 'society', 'health', 'environment', 'technology', 'culture', 'other']),
      subTopic: z.string().optional(),
      region: z.enum(['global', 'europe', 'mena', 'asia', 'americas', 'africa', 'oceania']),
      country: z.string().optional(),
      emotions: z.object({
        joy: z.number().min(0).max(1),
        fear: z.number().min(0).max(1),
        anger: z.number().min(0).max(1),
        sadness: z.number().min(0).max(1),
        hope: z.number().min(0).max(1),
        curiosity: z.number().min(0).max(1),
      }),
      intensity: z.number().min(0).max(1),
      polarity: z.number().min(-1).max(1),
      uncertainty: z.number().min(0).max(1),
      sourceType: z.enum(['news', 'social', 'analysis']),
      sourceName: z.string(),
      summary: z.string(),
    }))
    .mutation(({ input }) => {
      const eventVector = createEventVector(input);
      const validation = validateEventVector(eventVector);
      
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }
      
      return {
        success: true,
        data: eventVector,
        message: 'EventVector created successfully',
      };
    }),

  /**
   * Validate EventVector
   */
  validateEventVector: publicProcedure
    .input(z.any())
    .mutation(({ input }) => {
      const validation = validateEventVector(input);
      
      return {
        success: validation.valid,
        errors: validation.errors,
        data: validation.valid ? input : null,
      };
    }),

  /**
   * Get sample EventVectors (for testing)
   */
  getSampleEventVectors: publicProcedure
    .query(() => {
      const eventVectors = getSampleEventVectors();
      
      return {
        success: true,
        data: eventVectors,
        count: eventVectors.length,
      };
    }),
});

export type NewFeaturesRouter = typeof newFeaturesRouter;
