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
import {
  dcftEngine,
  type GlobalIndices,
} from './dcft';
import {
  calculateDigitalConsciousnessField,
  calculateResonanceIndex,
  identifyCollectivePhase,
  calculateDCFTIndices,
  getEmotionalColor,
  detectEmotionalWaves,
  generateEmotionalForecast,
  checkAlertConditions,
} from './dcftEngine';

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
      conversationId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await analyzeForSmartAnalysis(input.query, input.language, input.conversationId);
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

  // ============================================================
  // DCFT ENDPOINTS (now part of the unified engine)
  // ============================================================

  /**
   * DCFT: Calculate Digital Consciousness Field amplitude D(t)
   * Migrated from dcft.calculateDCF - now uses unified data pipeline
   */
  calculateDCF: publicProcedure
    .input(z.object({ countryCode: z.string().length(2).optional() }))
    .query(async ({ input }) => {
      // If country specified, use unified engine to get real data
      if (input.countryCode) {
        const countryName = ALL_COUNTRIES.find(c => c.code === input.countryCode)?.name || input.countryCode;
        const ctx = await executeNetworkEngine('system', `${countryName} news emotions`, 'en');
        const dcftResult = ctx.dcft.result;
        if (dcftResult) {
          return {
            dcfAmplitude: dcftResult.dcfAmplitude,
            resonance: dcftResult.resonanceIndices,
            phase: dcftResult.emotionalPhase,
            indices: ctx.dcft.indices,
            color: dcftResult.colorCode || '#4169E1',
            waves: detectEmotionalWaves([]),
            eventCount: ctx.collection.eventVector.totalItems,
            calculatedAt: new Date(),
          };
        }
      }
      
      // Fallback: use batch data from priority countries
      const { generateAllCountriesEmotionData } = await import('./countryEmotionAnalyzer');
      const countriesData = generateAllCountriesEmotionData(0, 50, 50);
      const filteredData = input.countryCode
        ? countriesData.filter(c => c.countryCode === input.countryCode)
        : countriesData;
      const events = filteredData.map((country, i) => ({
        id: `event-${country.countryCode}-${i}`,
        timestamp: Date.now() - Math.random() * 3600000,
        affectiveVector: {
          joy: (country.gmi + 100) / 200 - 0.5,
          fear: country.cfi / 100 - 0.5,
          anger: Math.random() * 0.4 - 0.2,
          sadness: (100 - country.hri) / 200,
          hope: country.hri / 100 - 0.5,
          curiosity: Math.random() * 0.6 - 0.3,
        },
        influence: 0.5 + Math.random() * 0.5,
        source: 'country_aggregation',
        country: country.countryCode,
      }));
      return {
        dcfAmplitude: calculateDigitalConsciousnessField(events),
        resonance: calculateResonanceIndex(events),
        phase: identifyCollectivePhase(events),
        indices: calculateDCFTIndices(events),
        color: getEmotionalColor(calculateResonanceIndex(events)),
        waves: detectEmotionalWaves(events),
        eventCount: events.length,
        calculatedAt: new Date(),
      };
    }),

  /**
   * DCFT: Generate emotional forecast (Emotional Weather System)
   * Migrated from dcft.getEmotionalForecast
   */
  getEmotionalForecast: publicProcedure
    .input(z.object({ hoursAhead: z.number().min(1).max(168).default(24) }))
    .query(async ({ input }) => {
      const { getEmotionIndicesHistory } = await import('./db');
      const history = await getEmotionIndicesHistory(72);
      const historicalData = history.map(h => ({
        timestamp: h.createdAt.getTime(),
        indices: { GMI: h.gmi, CFI: h.cfi, HRI: h.hri },
      }));
      const forecast = generateEmotionalForecast(historicalData, input.hoursAhead);
      return { ...forecast, generatedAt: new Date(), dataPoints: historicalData.length };
    }),

  /**
   * DCFT: Check alert conditions (Early Warning System)
   * Migrated from dcft.checkAlerts
   */
  checkAlerts: publicProcedure.query(async () => {
    const { getLatestEmotionIndices, getEmotionIndicesHistory } = await import('./db');
    const current = await getLatestEmotionIndices();
    const history = await getEmotionIndicesHistory(2);
    const currentIndices = current
      ? { GMI: current.gmi, CFI: current.cfi, HRI: current.hri }
      : { GMI: 0, CFI: 50, HRI: 50 };
    const previousIndices = history.length > 1
      ? { GMI: history[1].gmi, CFI: history[1].cfi, HRI: history[1].hri }
      : null;
    const alertStatus = checkAlertConditions(currentIndices, previousIndices);
    return { ...alertStatus, currentIndices, previousIndices, checkedAt: new Date() };
  }),

  /**
   * DCFT: Get theory information (static data)
   * Migrated from dcft.getTheoryInfo
   */
  getTheoryInfo: publicProcedure.query(() => {
    return {
      name: 'Digital Consciousness Field Theory (DCFT)',
      author: 'Amaal Radwan',
      year: 2025,
      paper: 'The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind',
      pillars: ['Collective Psychology', 'Neural Synchronization', 'Information Energetics'],
      formulas: {
        dcf: {
          name: 'Digital Consciousness Field',
          formula: 'D(t) = \u03a3 [Ei \u00d7 Wi \u00d7 \u0394Ti]',
          description: 'Measures the instantaneous consciousness amplitude of the digital collective',
          variables: [
            { symbol: 'Ei', meaning: 'Emotional intensity of each digital event' },
            { symbol: 'Wi', meaning: 'Weighting based on global influence or reach' },
            { symbol: '\u0394Ti', meaning: 'Temporal persistence of that emotion across users' },
          ],
        },
        ri: {
          name: 'Resonance Index',
          formula: 'RI(e,t) = \u03a3 (AVi \u00d7 Wi \u00d7 e^(-\u03bb\u0394t))',
          description: 'Computes resonance for each emotion with exponential decay',
          variables: [
            { symbol: 'AVi', meaning: 'Affective vector value for the emotion' },
            { symbol: 'Wi', meaning: 'Influence weighting' },
            { symbol: '\u03bb\u0394t', meaning: 'Decay rate controlling emotional persistence' },
          ],
        },
      },
      indices: [
        { code: 'GMI', name: 'Global Mood Index', range: '-100 to +100', description: 'General optimism or pessimism across the planet' },
        { code: 'CFI', name: 'Collective Fear Index', range: '0 to 100', description: 'Probability of market downturn or crisis' },
        { code: 'HRI', name: 'Hope Resonance Index', range: '0 to 100', description: 'Potential for innovation, recovery, and consumer confidence' },
      ],
      affectiveVector: ['Joy', 'Fear', 'Anger', 'Sadness', 'Hope', 'Curiosity'],
      layers: [
        { name: 'Perception Layer', role: 'Input', description: 'Gathers emotional data from open digital channels' },
        { name: 'Cognitive Layer', role: 'Processing', description: 'Aggregates vectors and applies DCF mathematical model' },
        { name: 'Awareness Layer', role: 'Output', description: 'Transforms currents into visual and numerical representations' },
      ],
      colorSystem: [
        { color: 'Blue', meaning: 'Calm / Reflection', hex: '#4169E1' },
        { color: 'Red', meaning: 'Anger / Activism', hex: '#DC143C' },
        { color: 'Yellow', meaning: 'Optimism / Creativity', hex: '#FFD700' },
        { color: 'Green', meaning: 'Balance / Collective Harmony', hex: '#228B22' },
      ],
    };
  }),

  /**
   * DCFT: Analyze text using DCFT engine directly
   * Migrated from dcft analysis endpoints
   */
  analyzeDCFT: publicProcedure
    .input(z.object({
      text: z.string().min(1).max(5000),
      source: z.string().default('user_input'),
    }))
    .mutation(async ({ input }) => {
      const result = await dcftEngine.analyzeText(input.text, input.source);
      return result;
    }),

  /**
   * DCFT COUNTRY COMPARISON: Compare DCFT indices between two countries
   * Used by: CompareCountries page for side-by-side DCFT analysis
   */
  compareDCFT: publicProcedure
    .input(z.object({
      country1Code: z.string().length(2),
      country1Name: z.string().min(1),
      country2Code: z.string().length(2),
      country2Name: z.string().min(1),
      language: z.string().default('ar'),
    }))
    .mutation(async ({ input }) => {
      // Run both country analyses in parallel through the unified engine
      const [result1, result2] = await Promise.all([
        analyzeForCountryDetail(input.country1Code, input.country1Name, false, input.language),
        analyzeForCountryDetail(input.country2Code, input.country2Name, false, input.language),
      ]);
      return {
        country1: {
          code: result1.countryCode,
          name: result1.countryName,
          gmi: result1.gmi,
          cfi: result1.cfi,
          hri: result1.hri,
          emotions: result1.emotions,
          dominantEmotion: result1.dominantEmotion,
          confidence: result1.confidence,
          sourceCount: result1.sourceCount,
          totalItems: result1.totalItems,
          isRealData: result1.isRealData,
          trendingKeywords: result1.trendingKeywords,
          breakingNews: result1.breakingNews,
        },
        country2: {
          code: result2.countryCode,
          name: result2.countryName,
          gmi: result2.gmi,
          cfi: result2.cfi,
          hri: result2.hri,
          emotions: result2.emotions,
          dominantEmotion: result2.dominantEmotion,
          confidence: result2.confidence,
          sourceCount: result2.sourceCount,
          totalItems: result2.totalItems,
          isRealData: result2.isRealData,
          trendingKeywords: result2.trendingKeywords,
          breakingNews: result2.breakingNews,
        },
      };
    }),

  // ============================================================
  // ENGINE DASHBOARD
  // ============================================================

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

  // ============================================================
  // HISTORICAL INDICES (replaces emotion.getHistoricalIndices)
  // ============================================================
  getHistoricalIndices: publicProcedure
    .input(z.object({ hoursBack: z.number().min(1).max(720).default(24) }))
    .query(async ({ input }) => {
      const { getEmotionIndicesHistory } = await import('./db');
      return await getEmotionIndicesHistory(input.hoursBack);
    }),

  // ============================================================
  // LATEST INDICES (replaces emotion.getLatestIndices)
  // ============================================================
  getLatestIndices: publicProcedure.query(async () => {
    const { getLatestEmotionIndices, createEmotionIndex } = await import('./db');
    let indices = await getLatestEmotionIndices();
    if (!indices) {
      try {
        const mood = await getGlobalMood();
        await createEmotionIndex({
          gmi: mood.gmi, cfi: mood.cfi, hri: mood.hri,
          confidence: Math.round(mood.confidence),
        });
        indices = await getLatestEmotionIndices();
      } catch (e) {
        console.error('[Engine] Failed to generate indices:', e);
      }
    }
    return indices || { gmi: 0, cfi: 50, hri: 50, confidence: 0, analyzedAt: new Date() };
  }),

  // ============================================================
  // SOURCE HEALTH (replaces dashboard.getSourceHealth)
  // ============================================================
  getSourceHealth: publicProcedure.query(async () => {
    try {
      const { checkAllSources } = await import('./apiHealthMonitor');
      return await checkAllSources();
    } catch {
      return { sources: [], lastChecked: new Date().toISOString() };
    }
  }),

  refreshSourceHealth: publicProcedure.mutation(async () => {
    try {
      const { forceRefresh } = await import('./apiHealthMonitor');
      return await forceRefresh();
    } catch {
      return { sources: [], lastChecked: new Date().toISOString() };
    }
  }),

  // ============================================================
  // SYSTEM HEALTH (replaces dashboard.getHealth/getSummary/getMetrics/getAlerts/getCacheStats)
  // ============================================================
  getSystemHealth: publicProcedure.query(async () => {
    try {
      const { healthDashboard } = await import('./healthDashboard');
      const stats = getEngineStats();
      return {
        health: healthDashboard.getHealthReport(),
        summary: healthDashboard.getSummary(),
        metrics: healthDashboard.getMetrics?.() || {},
        engine: {
          cacheSize: stats.networkCacheSize,
          dataCacheStats: stats.dataCacheStats,
          learning: stats.learning,
        },
      };
    } catch {
      return { health: {}, summary: {}, metrics: {}, engine: {} };
    }
  }),

  // ============================================================
  // LIVE ANALYSIS (replaces realtime.*)
  // ============================================================
  getLiveAnalysis: publicProcedure
    .input(z.object({
      countryCode: z.string().optional(),
      topic: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        if (input.countryCode) {
          const result = await analyzeForMap(input.countryCode, input.countryCode);
          return {
            success: true,
            indices: { gmi: result.gmi, cfi: result.cfi, hri: result.hri },
            dominantEmotion: result.dominantEmotion,
            isRealData: result.isRealData,
            confidence: result.confidence,
          };
        } else {
          const mood = await getGlobalMood();
          return {
            success: true,
            indices: { gmi: mood.gmi, cfi: mood.cfi, hri: mood.hri },
            dominantEmotion: mood.dominantEmotion,
            isRealData: mood.sourceCount > 0,
            confidence: mood.confidence,
          };
        }
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }),

  // ============================================================
  // TOPIC ANALYSIS (replaces topic.analyzeTopicInCountry + analysisData.*)
  // ============================================================
  analyzeTopicInCountry: publicProcedure
    .input(z.object({
      topic: z.string().min(1),
      countryCode: z.string().optional(),
      countryName: z.string().optional(),
      language: z.string().default('ar'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await analyzeForSmartAnalysis(
          `${input.topic} ${input.countryName || ''}`.trim(),
          input.language,
        );
        return { success: true, ...result };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }),

  // ============================================================
  // GEOGRAPHIC DATA (replaces maps.*)
  // ============================================================
  getGeographicData: publicProcedure
    .input(z.object({ metric: z.string().default('gmi') }))
    .query(async () => {
      try {
        const countries = await analyzeCountriesBatch(PRIORITY_COUNTRIES, 4);
        return {
          success: true,
          countries: countries.map(c => ({
            countryCode: c.countryCode,
            countryName: c.countryName,
            gmi: c.gmi, cfi: c.cfi, hri: c.hri,
            dominantEmotion: c.dominantEmotion,
            confidence: c.confidence,
            isRealData: c.isRealData,
          })),
        };
      } catch (e) {
        return { success: false, countries: [] };
      }
    }),

  getRegionalTrends: publicProcedure
    .input(z.object({ region: z.string().default('global') }))
    .query(async () => {
      try {
        const countries = await analyzeCountriesBatch(PRIORITY_COUNTRIES, 4);
        const avgGmi = countries.reduce((s, c) => s + c.gmi, 0) / (countries.length || 1);
        const avgCfi = countries.reduce((s, c) => s + c.cfi, 0) / (countries.length || 1);
        const avgHri = countries.reduce((s, c) => s + c.hri, 0) / (countries.length || 1);
        return {
          success: true,
          averages: { gmi: avgGmi, cfi: avgCfi, hri: avgHri },
          countries: countries.length,
          hotspots: countries.filter(c => c.cfi > 70).map(c => ({ code: c.countryCode, name: c.countryName, cfi: c.cfi })),
        };
      } catch (e) {
        return { success: false, averages: { gmi: 0, cfi: 50, hri: 50 }, countries: 0, hotspots: [] };
      }
    }),

  getHotspots: publicProcedure.query(async () => {
    try {
      const countries = await analyzeCountriesBatch(PRIORITY_COUNTRIES, 4);
      return countries
        .filter(c => c.cfi > 60 || c.gmi < -20)
        .sort((a, b) => b.cfi - a.cfi)
        .slice(0, 10)
        .map(c => ({
          countryCode: c.countryCode, countryName: c.countryName,
          gmi: c.gmi, cfi: c.cfi, hri: c.hri,
          dominantEmotion: c.dominantEmotion, risk: c.cfi > 70 ? 'high' : 'medium',
        }));
    } catch {
      return [];
    }
  }),

  // ============================================================
  // METACOGNITION (replaces metacognition.*)
  // ============================================================
  getMetacognition: publicProcedure.query(() => {
    const stats = getEngineStats();
    const learningState = getLearningState();
    return {
      systemHealth: {
        status: 'operational',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cacheSize: stats.networkCacheSize,
      },
      recentErrors: [] as string[],
      recommendations: [
        learningState.totalAnalyses < 10 ? 'Run more analyses to improve learning' : null,
        learningState.accuracyRate < 70 ? 'Consider reviewing feedback for accuracy improvement' : null,
        stats.networkCacheSize > 100 ? 'Consider clearing caches to free memory' : null,
      ].filter(Boolean),
    };
  }),

  // ============================================================
  // CLASSIFICATION / REPORTS (replaces classification.*)
  // ============================================================
  getReportsData: publicProcedure.query(async () => {
    const recentAnalyses = getRecentAnalyses(100);
    const domainStats: Record<string, number> = {};
    const emotionStats: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};

    recentAnalyses.forEach(a => {
      const domain = a.question.topic || 'general';
      domainStats[domain] = (domainStats[domain] || 0) + 1;
      const emotion = a.result.dominantEmotion || 'neutral';
      emotionStats[emotion] = (emotionStats[emotion] || 0) + 1;
      const day = new Date(a.timestamp).toISOString().split('T')[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    return {
      totalAnalyses: recentAnalyses.length,
      domainStats: Object.entries(domainStats).map(([domain, count]) => ({ domain, count })),
      emotionStats: Object.entries(emotionStats).map(([emotion, count]) => ({ emotion, count })),
      dailyCounts: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
      recentAnalyses: recentAnalyses.slice(0, 20).map(a => ({
        id: a.id, timestamp: a.timestamp,
        topic: a.question.topic, country: a.question.countryName || 'Global',
        dominantEmotion: a.result.dominantEmotion, gmi: a.result.gmi,
        confidence: a.result.confidence,
      })),
    };
  }),

  // ===== SYSTEM HEALTH ENDPOINTS (from dashboardRouter) =====
  getHealth: publicProcedure.query(async () => {
    const { healthDashboard } = await import('./healthDashboard');
    return healthDashboard.getHealthReport();
  }),
  getHealthSummary: publicProcedure.query(async () => {
    const { healthDashboard } = await import('./healthDashboard');
    const report = healthDashboard.getHealthReport();
    return { status: report.overallStatus, uptime: report.uptime, lastFullCheck: new Date(report.timestamp).toISOString() };
  }),
  getMetrics: publicProcedure.query(async () => {
    const { healthDashboard } = await import('./healthDashboard');
    return healthDashboard.getMetrics();
  }),
  getAlerts: publicProcedure.query(async () => {
    const { healthDashboard } = await import('./healthDashboard');
    return healthDashboard.getAlerts();
  }),
  getCacheStats: publicProcedure.query(async () => {
    const { analysisCache, predictionCache, userCache, generalCache } = await import('./simpleCache');
    return {
      analysis: analysisCache.getStats(),
      prediction: predictionCache.getStats(),
      user: userCache.getStats(),
      general: generalCache.getStats(),
    };
  }),
  getFeedbackStats: publicProcedure.query(async () => {
    const { feedbackManager } = await import('./feedbackLoop');
    return feedbackManager.getStats();
  }),
  getAlertHistory: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      return { data: [] as any[] };
    }),

  // ===== METACOGNITION ENDPOINTS =====
  getRecentErrors: publicProcedure.query(async () => {
    try {
      const { initMetacognition, generateHealthReport } = await import('./cognitiveArchitecture/metacognition');
      const state = initMetacognition();
      const health = generateHealthReport(state);
      return (health.errors || []).map((e: any) => ({ type: e.errorType, message: e.description, timestamp: e.timestamp, severity: e.severity }));
    } catch { return []; }
  }),
  getRecommendations: publicProcedure.query(async () => {
    try {
      const { initMetacognition, generateHealthReport } = await import('./cognitiveArchitecture/metacognition');
      const state = initMetacognition();
      const health = generateHealthReport(state);
      return (health.recommendations || []).map((rec: string, i: number) => ({ title: `توصية ${i + 1}`, description: rec, priority: 'medium', action: rec }));
    } catch { return []; }
  }),


  // ===== CLASSIFICATION/REPORTS ENDPOINTS =====
  getDomainStats: publicProcedure.query(async () => {
    const { getDomainDistribution } = await import('./db');
    return await getDomainDistribution();
  }),
  getSensitivityStats: publicProcedure.query(async () => {
    const { getSensitivityDistribution } = await import('./db');
    return await getSensitivityDistribution();
  }),
  getAnalysesOverTime: publicProcedure
    .input(z.object({ days: z.number().min(1).max(90).default(30) }))
    .query(async ({ input }) => {
      const { getAnalysesOverTime } = await import('./db');
      return await getAnalysesOverTime(input.days);
    }),
  getAllAnalyses: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(1000).default(500) }))
    .query(async ({ input }) => {
      const { getAllClassifiedAnalyses } = await import('./db');
      return await getAllClassifiedAnalyses(input.limit);
    }),

  // ===== MAP DATA ENDPOINTS (from mapDataRouter) =====
  getRegionalHeatMapData: publicProcedure
    .input(z.object({ country: z.string().min(1), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const regions = ['Capital', 'North', 'South', 'East', 'West', 'Central'].map(name => ({
        name, gmi: Math.round(30 + Math.random() * 40), cfi: Math.round(30 + Math.random() * 40),
        hri: Math.round(30 + Math.random() * 40), dominantEmotion: ['hope', 'fear', 'anger', 'joy', 'sadness'][Math.floor(Math.random() * 5)],
        population: Math.round(500000 + Math.random() * 5000000), confidence: Math.round(40 + Math.random() * 40),
      }));
      return { data: regions.slice(0, input.limit) };
    }),
  getWorldMapData: publicProcedure
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const countries = ALL_COUNTRIES.map(c => ({
        countryCode: c.code, countryName: c.name,
        gmi: Math.round(30 + Math.random() * 40), cfi: Math.round(30 + Math.random() * 40),
        hri: Math.round(30 + Math.random() * 40), dominantEmotion: ['hope', 'fear', 'anger', 'joy', 'sadness'][Math.floor(Math.random() * 5)],
        confidence: Math.round(40 + Math.random() * 40),
      }));
      return { data: countries.slice(0, input?.limit || 50) };
    }),
});
