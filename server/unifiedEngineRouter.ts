/**
 * UNIFIED ENGINE ROUTER
 * 
 * tRPC router that exposes the Network Engine to the frontend.
 * All pages call these procedures instead of separate endpoints.
 * 
 * Now powered by the NETWORK ENGINE (network topology, parallel execution).
 */

import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';
import {
  analyzeForMap,
  analyzeForWeather,
  analyzeForCountryDetail,
  analyzeForSmartAnalysis,
  analyzeCountriesBatch,
  getGlobalMood,
  getEngineStats,
  clearAllCaches,
  executeNetworkEngine,
  runEngineLearningCycle,
  evaluateEnginePrediction,
} from './networkEngine';
import { getRecentAnalyses, submitAccuracyFeedback, getLearningState, getAdjustmentHistory } from './engines/learningStore';

// Country metadata for batch operations
const PRIORITY_COUNTRIES = [
  { code: 'LY', name: 'Libya' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'PS', name: 'Palestine' },
  { code: 'SY', name: 'Syria' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'SD', name: 'Sudan' },
  { code: 'YE', name: 'Yemen' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
];

// All countries (including non-priority with default data)
const ALL_COUNTRIES = [
  ...PRIORITY_COUNTRIES,
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
];

export const unifiedEngineRouter = router({
  /**
   * GET MAP DATA: All countries with indices for map coloring
   * Used by: Map page, EmotionalWeather page
   */
  getMapData: publicProcedure.query(async () => {
    // Analyze priority countries with real data
    const priorityResults = await analyzeCountriesBatch(PRIORITY_COUNTRIES, 4);
    
    // Build map of results
    const resultMap = new Map(priorityResults.map(r => [r.countryCode, r]));
    
    // Return all countries (priority with real data, others with defaults)
    return ALL_COUNTRIES.map(country => {
      const result = resultMap.get(country.code);
      if (result) return result;
      
      return {
        countryCode: country.code,
        countryName: country.name,
        gmi: 0,
        cfi: 50,
        hri: 50,
        dominantEmotion: 'neutral',
        isRealData: false,
        confidence: 0,
      };
    });
  }),

  /**
   * GET WEATHER DATA: Detailed emotion breakdown for a country
   * Used by: EmotionalWeather page, Weather page
   */
  getWeatherData: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2),
      countryName: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return await analyzeForWeather(input.countryCode, input.countryName);
    }),

  /**
   * GET COUNTRY DETAIL: Full analysis with categorized news
   * Used by: CountryResults page
   */
  getCountryDetail: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2),
      countryName: z.string().min(1),
      includeAISummary: z.boolean().default(false),
      language: z.string().default('ar'),
    }))
    .query(async ({ input }) => {
      return await analyzeForCountryDetail(
        input.countryCode,
        input.countryName,
        input.includeAISummary,
        input.language
      );
    }),

  /**
   * SMART ANALYSIS: AI-powered Q&A with emotion context
   * Used by: SmartAnalysis page
   */
  smartAnalyze: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      language: z.string().default('ar'),
    }))
    .mutation(async ({ input }) => {
      return await analyzeForSmartAnalysis(input.query, input.language);
    }),

  /**
   * FULL NETWORK EXECUTION: Run the complete network engine
   * Used by: Advanced analysis, debugging, pipeline view
   */
  executeFullNetwork: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(500),
      language: z.string().default('ar'),
    }))
    .mutation(async ({ input }) => {
      const ctx = await executeNetworkEngine('system', input.question, input.language);
      return {
        response: ctx.generation.languageEnforced.finalResponse || ctx.generation.response,
        emotions: ctx.collection.eventVector.emotions,
        dominantEmotion: ctx.collection.eventVector.dominantEmotion,
        confidence: ctx.analysis.confidence.overall,
        suggestions: ctx.generation.suggestions,
        breakingNews: ctx.analysis.breakingNews,
        quality: ctx.generation.quality,
        analytics: {
          totalDurationMs: ctx.analytics.totalDurationMs,
          layerTraces: ctx.analytics.layerTraces,
          parallelGroups: ctx.analytics.parallelGroups,
          errors: ctx.analytics.errors,
        },
        gate: {
          intent: ctx.gate.intent,
          needsAnalysis: ctx.gate.needsAnalysis,
          needsLLM: ctx.gate.needsLLM,
          detectedCountry: ctx.gate.detectedCountry,
        },
      };
    }),

  /**
   * GLOBAL MOOD: Current global emotion indices
   * Used by: Dashboard, Home page
   */
  getGlobalMood: publicProcedure.query(async () => {
    return await getGlobalMood();
  }),

  /**
   * ENGINE STATS: Cache and performance metrics
   * Used by: Admin/debug
   */
  getStats: publicProcedure.query(() => {
    return getEngineStats();
  }),

  /**
   * CLEAR CACHES: Force refresh all data
   */
  clearCaches: publicProcedure.mutation(() => {
    clearAllCaches();
    return { success: true, message: 'All caches cleared' };
  }),

  // ============================================================
  // LEARNING & DASHBOARD ENDPOINTS
  // ============================================================

  /**
   * LEARNING STATE: Get current learning metrics
   */
  getLearningState: publicProcedure.query(() => {
    return getLearningState();
  }),

  /**
   * RECENT ANALYSES: Get recent analysis records for the dashboard
   */
  getRecentAnalyses: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ input }) => {
      const analyses = getRecentAnalyses(input.limit);
      return analyses.map(a => ({
        id: a.id,
        timestamp: a.timestamp,
        topic: a.question.topic,
        country: a.question.countryName || 'Global',
        dominantEmotion: a.result.dominantEmotion,
        gmi: a.result.gmi,
        confidence: a.result.confidence,
        sourceCount: a.context.sourceCount,
        verified: a.learningMeta.wasCorrect,
      }));
    }),

  /**
   * RUN LEARNING CYCLE: Trigger a learning cycle to improve the engine
   */
  runLearningCycle: publicProcedure.mutation(() => {
    return runEngineLearningCycle();
  }),

  /**
   * SUBMIT FEEDBACK: Mark an analysis as correct or incorrect
   */
  submitFeedback: publicProcedure
    .input(z.object({
      analysisId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(({ input }) => {
      submitAccuracyFeedback(input.analysisId, input.rating, input.comment || '');
      return { success: true };
    }),

  /**
   * ADJUSTMENT HISTORY: Get learning adjustments history
   */
  getAdjustmentHistory: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(({ input }) => {
      return getAdjustmentHistory(input.limit);
    }),

  /**
   * ENGINE DASHBOARD: Complete dashboard data in one call
   */
  getDashboardData: publicProcedure.query(async () => {
    const stats = getEngineStats();
    const learningState = getLearningState();
    const recentAnalyses = getRecentAnalyses(10);
    const adjustments = getAdjustmentHistory(10);
    
    return {
      engine: {
        cacheSize: stats.networkCacheSize,
        dataCacheStats: stats.dataCacheStats,
      },
      learning: {
        totalAnalyses: learningState.totalAnalyses,
        verifiedAnalyses: learningState.verifiedAnalyses,
        accuracyRate: learningState.accuracyRate,
        totalFeedback: learningState.totalFeedback,
        totalAdjustments: learningState.adjustmentsMade,
        summary: stats.learning,
      },
      recentAnalyses: recentAnalyses.map(a => ({
        id: a.id,
        timestamp: a.timestamp,
        topic: a.question.topic,
        country: a.question.countryName || 'Global',
        dominantEmotion: a.result.dominantEmotion,
        gmi: a.result.gmi,
        confidence: a.result.confidence,
        verified: a.learningMeta.wasCorrect,
      })),
      adjustments: adjustments.map(a => ({
        id: a.id,
        timestamp: a.timestamp,
        engine: a.targetEngine,
        parameter: a.targetParameter,
        oldValue: a.previousValue,
        newValue: a.newValue,
        reason: a.reason,
      })),
    };
  }),
});
