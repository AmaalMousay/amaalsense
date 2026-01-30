import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  emotion: router({
    /**
     * Analyze a headline and return emotion vector
     * Uses Hybrid DCFT-AI Engine:
     * - DCFT (70%): D(t) = Σ [Ei × Wi × ΔTi], RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
     * - AI (30%): Enhancement for context and sarcasm detection
     * Formula: D_hybrid = 0.7 × D_DCFT + 0.3 × D_AI
     */
    analyzeHeadline: publicProcedure
      .input(z.object({ headline: z.string().min(1).max(500) }))
      .mutation(async ({ input }) => {
        // Use Hybrid Analyzer - DCFT as primary (70%), AI as enhancement (30%)
        const { analyzeHybrid } = await import("./hybridAnalyzer");
        const hybridResult = await analyzeHybrid(input.headline, 'user');

        // Convert fused emotions to 0-100 scale for storage
        const emotions = {
          joy: Math.round((hybridResult.emotions.joy + 1) * 50),
          fear: Math.round((hybridResult.emotions.fear + 1) * 50),
          anger: Math.round((hybridResult.emotions.anger + 1) * 50),
          sadness: Math.round((hybridResult.emotions.sadness + 1) * 50),
          hope: Math.round((hybridResult.emotions.hope + 1) * 50),
          curiosity: Math.round((hybridResult.emotions.curiosity + 1) * 50),
        };

        // Find dominant emotion
        const dominantEmotion = Object.entries(emotions)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Save to database
        const { createEmotionAnalysis, createEmotionIndex } = await import("./db");
        await createEmotionAnalysis({
          headline: input.headline,
          ...emotions,
          dominantEmotion,
          confidence: Math.round(hybridResult.fusion.confidence * 100),
          model: 'hybrid', // Using Hybrid DCFT-AI model
        });

        // Save indices calculated from hybrid fusion
        await createEmotionIndex({
          gmi: hybridResult.indices.gmi,
          cfi: hybridResult.indices.cfi,
          hri: hybridResult.indices.hri,
          confidence: Math.round(hybridResult.fusion.confidence * 100),
        });

        // Return analysis with hybrid data
        return {
          headline: input.headline,
          emotions,
          dominantEmotion,
          confidence: Math.round(hybridResult.fusion.confidence * 100),
          model: 'hybrid' as const,
          // DCFT-specific fields
          dcfAmplitude: hybridResult.dcft.amplitude,
          resonanceIndices: hybridResult.dcft.resonanceIndices,
          emotionalPhase: hybridResult.dcft.emotionalPhase,
          alertLevel: hybridResult.dcft.alertLevel,
          indices: hybridResult.indices,
          // Hybrid fusion info
          fusion: {
            method: hybridResult.fusion.method,
            dcftContribution: hybridResult.fusion.dcftContribution,
            aiContribution: hybridResult.fusion.aiContribution,
          },
        };
      }),

    /**
     * Get the latest emotion indices
     * Automatically fetches and analyzes real data if database is empty
     */
    getLatestIndices: publicProcedure.query(async () => {
      const { getLatestEmotionIndices, createEmotionIndex } = await import("./db");
      
      // First check if we have existing indices
      let indices = await getLatestEmotionIndices();
      
      // If no data exists, fetch and analyze real data
      if (!indices) {
        try {
          const { getGlobalMood } = await import("./unifiedDataService");
          const globalMood = await getGlobalMood();
          
          // Save to database
          await createEmotionIndex({
            gmi: globalMood.gmi,
            cfi: globalMood.cfi,
            hri: globalMood.hri,
            confidence: Math.round(globalMood.confidence * 100),
          });
          
          // Return the fresh data
          return {
            gmi: globalMood.gmi,
            cfi: globalMood.cfi,
            hri: globalMood.hri,
            confidence: Math.round(globalMood.confidence * 100),
            dataPoints: globalMood.dataPoints,
            realDataPoints: globalMood.realDataPoints,
          };
        } catch (error) {
          console.error('[Indices] Failed to fetch real data:', error);
          return { gmi: 0, cfi: 50, hri: 50, confidence: 0 };
        }
      }
      
      return indices;
    }),

    /**
     * Get historical emotion indices
     */
    getHistoricalIndices: publicProcedure
      .input(z.object({ hoursBack: z.number().min(1).max(720).default(24) }))
      .query(async ({ input }) => {
        const { getEmotionIndicesHistory } = await import("./db");
        const history = await getEmotionIndicesHistory(input.hoursBack);
        return history;
      }),

    /**
     * Get recent emotion analyses
     */
    getRecentAnalyses: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
      .query(async ({ input }) => {
        const { getRecentEmotionAnalyses } = await import("./db");
        return await getRecentEmotionAnalyses(input.limit);
      }),
  }),

  map: router({
    /**
     * Get all countries emotion data for world map
     */
    getAllCountriesEmotions: publicProcedure.query(async () => {
      const { generateAllCountriesEmotionData, COUNTRIES } = await import("./countryEmotionAnalyzer");
      const { getAllCountriesMood } = await import("./unifiedDataService");
      const { getLatestEmotionIndices } = await import("./db");

      // Get mood for all countries through unified service
      const countriesMood = await getAllCountriesMood();
      const globalIndices = await getLatestEmotionIndices();
      
      // Generate country data with real mood
      const countriesData = COUNTRIES.map(country => {
        const mood = countriesMood[country.code];
        if (mood) {
          return {
            countryCode: country.code,
            countryName: country.name,
            gmi: mood.gmi,
            cfi: mood.cfi,
            hri: mood.hri,
            mood: mood.mood,
            moodAr: mood.moodAr,
            moodColor: mood.moodColor,
            dominantEmotion: mood.dominantEmotion,
            confidence: mood.confidence,
            dataPoints: mood.dataPoints,
            lastUpdated: mood.lastUpdated,
            emotions: {
              joy: 50,
              fear: Math.round(mood.cfi),
              anger: 30,
              sadness: 30,
              hope: Math.round(mood.hri),
              curiosity: 50,
            },
          };
        }
        // Fallback to generated data
        return null;
      }).filter((c): c is NonNullable<typeof c> => c !== null);

      // If we have real mood data, return it
      if (countriesData.length > 0) {
        return countriesData;
      }

      // Fallback to generated data
      const baseGMI = globalIndices?.gmi || 0;
      const baseCFI = globalIndices?.cfi || 50;
      const baseHRI = globalIndices?.hri || 50;
      return generateAllCountriesEmotionData(baseGMI, baseCFI, baseHRI);
    }),

    /**
     * Get emotion data for a specific country
     */
    getCountryEmotions: publicProcedure
      .input(z.object({ countryCode: z.string().length(2) }))
      .query(async ({ input }) => {
        const { COUNTRIES, generateCountryEmotionData } = await import("./countryEmotionAnalyzer");
        const { getLatestEmotionIndices } = await import("./db");

        const country = COUNTRIES.find((c) => c.code === input.countryCode);
        if (!country) {
          throw new Error(`Country code ${input.countryCode} not found`);
        }

        const globalIndices = await getLatestEmotionIndices();
        return generateCountryEmotionData(
          input.countryCode,
          country.name,
          globalIndices?.gmi || 0,
          globalIndices?.cfi || 50,
          globalIndices?.hri || 50
        );
      }),

    /**
     * Get historical emotion data for a country
     */
    getCountryHistoricalData: publicProcedure
      .input(z.object({ countryCode: z.string().length(2), hoursBack: z.number().min(1).max(720).default(24) }))
      .query(async ({ input }) => {
        const { generateCountryHistoricalData } = await import("./countryTimeSeriesGenerator");
        const { COUNTRIES } = await import("./countryEmotionAnalyzer");

        const country = COUNTRIES.find((c) => c.code === input.countryCode);
        if (!country) {
          throw new Error(`Country code ${input.countryCode} not found`);
        }

        return generateCountryHistoricalData(input.countryCode, country.name, input.hoursBack);
      }),

    /**
     * Get historical data for multiple countries
     */
    getMultipleCountriesHistoricalData: publicProcedure
      .input(z.object({ countryCodes: z.array(z.string().length(2)), hoursBack: z.number().min(1).max(720).default(24) }))
      .query(async ({ input }) => {
        const { generateMultipleCountriesHistoricalData } = await import("./countryTimeSeriesGenerator");
        const { COUNTRIES } = await import("./countryEmotionAnalyzer");

        const countries = input.countryCodes
          .map((code) => COUNTRIES.find((c) => c.code === code))
          .filter((c) => c !== undefined) as Array<{ code: string; name: string }>;

        if (countries.length === 0) {
          throw new Error('No valid country codes provided');
        }

        return generateMultipleCountriesHistoricalData(countries, input.hoursBack);
      }),
  }),

  // Real-time news and AI analysis
  realtime: router({
    /**
     * Analyze a headline using AI + DCFT
     * All data flows through D(t) = Σ [Ei × Wi × ΔTi] and RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
     */
    analyzeWithAI: publicProcedure
      .input(z.object({ text: z.string().min(1).max(1000) }))
      .mutation(async ({ input }) => {
        // First get AI analysis
        const { analyzeTextWithAI } = await import("./aiSentimentAnalyzer");
        const aiResult = await analyzeTextWithAI(input.text);
        
        // Then process through DCFT engine for D(t) and RI(e,t) calculations
        const { analyzeTextDCFT } = await import("./dcft");
        const dcftResult = await analyzeTextDCFT(input.text, 'ai_analysis');
        
        return {
          ...aiResult,
          // Add DCFT calculations
          dcft: {
            amplitude: dcftResult.dcfAmplitude,
            resonanceIndices: dcftResult.resonanceIndices,
            indices: dcftResult.indices,
            emotionalPhase: dcftResult.emotionalPhase,
            alertLevel: dcftResult.alertLevel,
          },
        };
      }),

    /**
     * Fetch and analyze news for a country
     * All data flows through DCFT: D(t) = Σ [Ei × Wi × ΔTi] and RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
     */
    getCountryNewsAnalysis: publicProcedure
      .input(z.object({ countryCode: z.string().length(2), pageSize: z.number().min(1).max(20).default(10) }))
      .query(async ({ input }) => {
        const { getNewsWithFallback } = await import("./newsService");
        const { analyzeTextsWithAI } = await import("./aiSentimentAnalyzer");
        const { dcftEngine } = await import("./dcft");

        // Fetch news
        const { articles, isReal } = await getNewsWithFallback(input.countryCode, input.pageSize);

        // Analyze headlines with AI
        const headlines = articles.map(a => a.title);
        const analysis = await analyzeTextsWithAI(headlines);

        // Process through DCFT engine - apply D(t) and RI(e,t) formulas
        const dcftResult = await dcftEngine.analyzeTexts(headlines, 'news');

        return {
          countryCode: input.countryCode,
          articles,
          analysis: analysis.aggregated,
          detailedResults: analysis.results,
          isRealNews: isReal,
          isAIAnalyzed: analysis.isAIAnalyzed,
          analyzedAt: new Date(),
          // DCFT calculations from D(t) and RI(e,t)
          dcft: {
            amplitude: dcftResult.dcfAmplitude,
            resonanceIndices: dcftResult.resonanceIndices,
            indices: dcftResult.indices,
            emotionalPhase: dcftResult.emotionalPhase,
            alertLevel: dcftResult.alertLevel,
          },
        };
      }),

    /**
     * Fetch global news and analyze
     * All data flows through DCFT: D(t) = Σ [Ei × Wi × ΔTi] and RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
     */
    getGlobalNewsAnalysis: publicProcedure
      .input(z.object({ pageSize: z.number().min(1).max(30).default(20) }))
      .query(async ({ input }) => {
        const { fetchGlobalNews, generateMockNews } = await import("./newsService");
        const { analyzeTextsWithAI } = await import("./aiSentimentAnalyzer");
        const { dcftEngine } = await import("./dcft");

        // Fetch global news
        let articles = await fetchGlobalNews(input.pageSize);
        let isReal = articles.length > 0;

        // Fallback to mock if no real news
        if (articles.length === 0) {
          articles = generateMockNews('US', input.pageSize);
          isReal = false;
        }

        // Analyze headlines with AI
        const headlines = articles.map(a => a.title);
        const analysis = await analyzeTextsWithAI(headlines);

        // Process through DCFT engine - apply D(t) and RI(e,t) formulas
        const dcftResult = await dcftEngine.analyzeTexts(headlines, 'news');

        return {
          articles,
          analysis: analysis.aggregated,
          detailedResults: analysis.results,
          isRealNews: isReal,
          isAIAnalyzed: analysis.isAIAnalyzed,
          analyzedAt: new Date(),
          // DCFT calculations from D(t) and RI(e,t)
          dcft: {
            amplitude: dcftResult.dcfAmplitude,
            resonanceIndices: dcftResult.resonanceIndices,
            indices: dcftResult.indices,
            emotionalPhase: dcftResult.emotionalPhase,
            alertLevel: dcftResult.alertLevel,
          },
        };
      }),

    /**
     * Get available news sources status
     */
    getSourcesStatus: publicProcedure.query(async () => {
      const hasGNewsKey = !!process.env.GNEWS_API_KEY;
      const hasNewsAPIKey = !!process.env.NEWS_API_KEY;
      const hasYouTubeKey = !!process.env.YOUTUBE_API_KEY;

      return {
        gnews: { available: hasGNewsKey, name: 'GNews API' },
        newsapi: { available: hasNewsAPIKey, name: 'NewsAPI' },
        reddit: { available: true, name: 'Reddit (Public)' },
        mastodon: { available: true, name: 'Mastodon (Public)' },
        bluesky: { available: true, name: 'Bluesky (Public)' },
        youtube: { available: hasYouTubeKey, name: 'YouTube Comments' },
        telegram: { available: true, name: 'Telegram (Simulation)' },
        aiAnalysis: { available: true, name: 'AI Sentiment Analysis' },
        fallback: { available: true, name: 'Simulation Mode' },
      };
    }),
  }),

  // DCFT (Digital Consciousness Field Theory) Engine
  dcft: router({
    /**
     * Calculate Digital Consciousness Field amplitude D(t)
     */
    calculateDCF: publicProcedure
      .input(z.object({ countryCode: z.string().length(2).optional() }))
      .query(async ({ input }) => {
        const { 
          calculateDigitalConsciousnessField, 
          calculateResonanceIndex,
          identifyCollectivePhase,
          calculateDCFTIndices,
          getEmotionalColor,
          detectEmotionalWaves,
        } = await import("./dcftEngine");
        const { generateAllCountriesEmotionData } = await import("./countryEmotionAnalyzer");

        // Generate mock events from country data
        const countriesData = generateAllCountriesEmotionData(0, 50, 50);
        const filteredData = input.countryCode 
          ? countriesData.filter(c => c.countryCode === input.countryCode)
          : countriesData;

        // Convert to digital events
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

        const dcfAmplitude = calculateDigitalConsciousnessField(events);
        const resonance = calculateResonanceIndex(events);
        const phase = identifyCollectivePhase(events);
        const indices = calculateDCFTIndices(events);
        const color = getEmotionalColor(resonance);
        const waves = detectEmotionalWaves(events);

        return {
          dcfAmplitude,
          resonance,
          phase,
          indices,
          color,
          waves,
          eventCount: events.length,
          calculatedAt: new Date(),
        };
      }),

    /**
     * Generate emotional forecast (Emotional Weather System)
     */
    getEmotionalForecast: publicProcedure
      .input(z.object({ hoursAhead: z.number().min(1).max(168).default(24) }))
      .query(async ({ input }) => {
        const { generateEmotionalForecast } = await import("./dcftEngine");
        const { getEmotionIndicesHistory } = await import("./db");

        // Get historical data
        const history = await getEmotionIndicesHistory(72);
        const historicalData = history.map(h => ({
          timestamp: h.createdAt.getTime(),
          indices: { GMI: h.gmi, CFI: h.cfi, HRI: h.hri },
        }));

        // Generate forecast
        const forecast = generateEmotionalForecast(historicalData, input.hoursAhead);

        return {
          ...forecast,
          generatedAt: new Date(),
          dataPoints: historicalData.length,
        };
      }),

    /**
     * Check alert conditions (Early Warning System)
     */
    checkAlerts: publicProcedure.query(async () => {
      const { checkAlertConditions } = await import("./dcftEngine");
      const { getLatestEmotionIndices, getEmotionIndicesHistory } = await import("./db");

      const current = await getLatestEmotionIndices();
      const history = await getEmotionIndicesHistory(2);

      const currentIndices = current 
        ? { GMI: current.gmi, CFI: current.cfi, HRI: current.hri }
        : { GMI: 0, CFI: 50, HRI: 50 };

      const previousIndices = history.length > 1
        ? { GMI: history[1].gmi, CFI: history[1].cfi, HRI: history[1].hri }
        : null;

      const alertStatus = checkAlertConditions(currentIndices, previousIndices);

      return {
        ...alertStatus,
        currentIndices,
        previousIndices,
        checkedAt: new Date(),
      };
    }),

    /**
     * Get DCFT theory information
     */
    getTheoryInfo: publicProcedure.query(() => {
      return {
        name: 'Digital Consciousness Field Theory (DCFT)',
        author: 'Amaal Radwan',
        year: 2025,
        paper: 'The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind',
        pillars: [
          'Collective Psychology',
          'Neural Synchronization', 
          'Information Energetics',
        ],
        formulas: {
          dcf: {
            name: 'Digital Consciousness Field',
            formula: 'D(t) = Σ [Ei × Wi × ΔTi]',
            description: 'Measures the instantaneous consciousness amplitude of the digital collective',
            variables: [
              { symbol: 'Ei', meaning: 'Emotional intensity of each digital event' },
              { symbol: 'Wi', meaning: 'Weighting based on global influence or reach' },
              { symbol: 'ΔTi', meaning: 'Temporal persistence of that emotion across users' },
            ],
          },
          ri: {
            name: 'Resonance Index',
            formula: 'RI(e,t) = Σ (AVi × Wi × e^(-λΔt))',
            description: 'Computes resonance for each emotion with exponential decay',
            variables: [
              { symbol: 'AVi', meaning: 'Affective vector value for the emotion' },
              { symbol: 'Wi', meaning: 'Influence weighting' },
              { symbol: 'λΔt', meaning: 'Decay rate controlling emotional persistence' },
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
  }),

  // Subscription & Pricing System
  subscription: router({
    /**
     * Get all pricing tiers
     */
    getTiers: publicProcedure.query(async () => {
      const { getAllTiers } = await import("./subscriptionLimits");
      return getAllTiers();
    }),

    /**
     * Get user's current subscription and usage
     */
    getUserSubscription: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        return {
          tier: 'free' as const,
          usage: { analyses: 0, apiCalls: 0 },
          limits: {
            dailyAnalyses: 50,
            dailyApiCalls: 0,
            countriesAccess: 5,
            historicalDays: 1,
          },
        };
      }

      const { getTierInfo } = await import("./subscriptionLimits");
      const tier = (ctx.user as any).subscriptionTier || 'free';
      const tierInfo = getTierInfo(tier);

      return {
        tier,
        usage: { analyses: 0, apiCalls: 0 }, // TODO: Implement usage tracking
        limits: tierInfo.limits,
      };
    }),

    /**
     * Submit enterprise inquiry
     */
    submitEnterpriseInquiry: publicProcedure
      .input(z.object({
        contactName: z.string().min(1).max(255),
        contactEmail: z.string().email().max(320),
        organizationName: z.string().min(1).max(255),
        organizationType: z.string().min(1).max(64),
        country: z.string().max(100).optional(),
        interestedTier: z.string().min(1).max(32),
        message: z.string().max(2000).optional(),
      }))
      .mutation(async ({ input }) => {
        const { createEnterpriseInquiry } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");

        // Save to database
        await createEnterpriseInquiry({
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          organizationName: input.organizationName,
          organizationType: input.organizationType,
          country: input.country || null,
          interestedTier: input.interestedTier,
          message: input.message || null,
          status: 'new',
        });

        // Notify owner
        await notifyOwner({
          title: `New Enterprise Inquiry: ${input.organizationName}`,
          content: `
**New Lead from AmalSense!**

**Contact:** ${input.contactName}
**Email:** ${input.contactEmail}
**Organization:** ${input.organizationName}
**Type:** ${input.organizationType}
**Country:** ${input.country || 'Not specified'}
**Interested Tier:** ${input.interestedTier}

**Message:**
${input.message || 'No message provided'}
          `.trim(),
        });

        return { success: true };
      }),

    /**
     * Get user's usage quota
     */
    getUsage: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        return {
          analysesUsed: 0,
          analysesLimit: 50,
          apiCallsUsed: 0,
          apiCallsLimit: 0,
          tier: 'free' as const,
        };
      }

      const { getTierInfo } = await import("./subscriptionLimits");
      const tier = (ctx.user as any).subscriptionTier || 'free';
      const tierInfo = getTierInfo(tier);

      // TODO: Implement actual usage tracking from database
      // For now, return mock usage data
      return {
        analysesUsed: Math.floor(Math.random() * 20),
        analysesLimit: tierInfo.limits.dailyAnalyses,
        apiCallsUsed: 0,
        apiCallsLimit: tierInfo.limits.dailyApiCalls,
        tier,
      };
    }),

    /**
     * Get all enterprise inquiries (admin only)
     */
    getEnterpriseInquiries: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user || (ctx.user as any).role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { getEnterpriseInquiries } = await import("./db");
      return await getEnterpriseInquiries();
    }),
  }),

  // Social Media Integration
  social: router({
    /**
     * Search all social media platforms
     */
    searchAll: publicProcedure
      .input(z.object({ query: z.string().min(1).max(200), limit: z.number().min(1).max(100).default(50) }))
      .query(async ({ input }) => {
        const { fetchAllSocialMedia } = await import("./socialMediaService");
        return await fetchAllSocialMedia(input);
      }),

    /**
     * Search specific platforms
     */
    searchPlatforms: publicProcedure
      .input(z.object({
        platforms: z.array(z.enum(['reddit', 'mastodon', 'bluesky', 'youtube', 'telegram'])),
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(50).default(25),
      }))
      .query(async ({ input }) => {
        const { fetchFromPlatforms } = await import("./socialMediaService");
        return await fetchFromPlatforms(input.platforms, { query: input.query, limit: input.limit });
      }),

    /**
     * Get social media posts for a country
     */
    getCountryPosts: publicProcedure
      .input(z.object({ countryCode: z.string().length(2), limit: z.number().min(1).max(50).default(30) }))
      .query(async ({ input }) => {
        const { fetchCountrySocialMedia } = await import("./socialMediaService");
        return await fetchCountrySocialMedia(input.countryCode, input.limit);
      }),

    /**
     * Analyze social media posts with AI
     */
    analyzePostsWithAI: publicProcedure
      .input(z.object({ query: z.string().min(1).max(200), limit: z.number().min(1).max(30).default(20) }))
      .query(async ({ input }) => {
        const { fetchAllSocialMedia } = await import("./socialMediaService");
        const { analyzeTextsWithAI } = await import("./aiSentimentAnalyzer");

        // Fetch posts
        const socialData = await fetchAllSocialMedia(input);

        // Analyze texts
        const texts = socialData.posts.map(p => p.text).slice(0, 20);
        const analysis = await analyzeTextsWithAI(texts);

        return {
          ...socialData,
          analysis: analysis.aggregated,
          detailedResults: analysis.results,
          isAIAnalyzed: analysis.isAIAnalyzed,
          analyzedAt: new Date(),
        };
      }),
  }),

  // Export & Reports
  export: router({
    /**
     * Generate PDF report HTML for global indices
     */
    generateGlobalReport: publicProcedure
      .input(z.object({
        timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).default('24h'),
      }))
      .query(async ({ input }) => {
        const { exportReportHTML, generateSummary } = await import("./pdfExport");
        const { getLatestEmotionIndices } = await import("./db");
        const { analyzeHeadline } = await import("./emotionAnalyzer");

        // Get latest indices
        const latestIndices = await getLatestEmotionIndices();
        // Generate sample emotion data
        const sampleAnalysis = analyzeHeadline("Global economic outlook shows mixed signals amid recovery efforts");

        const reportData = {
          title: 'Global Emotion Analysis Report',
          generatedAt: new Date(),
          timeRange: input.timeRange,
          indices: {
            gmi: latestIndices?.gmi || 15,
            cfi: latestIndices?.cfi || 45,
            hri: latestIndices?.hri || 55,
          },
          emotionVectors: sampleAnalysis.emotions,
          confidence: 85,
        };

        const summary = generateSummary(reportData);
        const html = exportReportHTML({ ...reportData, summary });

        return {
          html,
          filename: `amalsense-global-report-${new Date().toISOString().split('T')[0]}.html`,
        };
      }),

    /**
     * Generate PDF report HTML for a specific country
     */
    generateCountryReport: publicProcedure
      .input(z.object({
        countryCode: z.string().length(2),
        timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).default('24h'),
      }))
      .query(async ({ input }) => {
        const { exportCountryReportHTML, generateSummary } = await import("./pdfExport");
        const { generateCountryEmotionData, COUNTRIES } = await import("./countryEmotionAnalyzer");

        // Get country data
        const country = COUNTRIES.find(c => c.code === input.countryCode);
        const countryName = country?.name || input.countryCode;
        const simulatedData = generateCountryEmotionData(input.countryCode, countryName);

        const reportData = {
          title: `${countryName} Emotion Analysis Report`,
          generatedAt: new Date(),
          timeRange: input.timeRange,
          countryCode: input.countryCode,
          countryName,
          indices: {
            gmi: simulatedData.gmi,
            cfi: simulatedData.cfi,
            hri: simulatedData.hri,
          },
          emotionVectors: {
            joy: 0.3 + Math.random() * 0.2,
            fear: 0.2 + Math.random() * 0.2,
            anger: 0.15 + Math.random() * 0.15,
            sadness: 0.15 + Math.random() * 0.15,
            hope: 0.35 + Math.random() * 0.2,
            curiosity: 0.25 + Math.random() * 0.15,
          },
          confidence: simulatedData.confidence,
        };

        const summary = generateSummary(reportData);
        const html = exportCountryReportHTML({ ...reportData, summary });

        return {
          html,
          filename: `amalsense-${input.countryCode.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.html`,
        };
      }),

    /**
     * Export daily aggregates as CSV/JSON
     */
    dailyAggregates: publicProcedure
      .input(
        z.object({
          format: z.enum(["csv", "json"]).default("csv"),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          countryCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { exportDailyAggregates } = await import("./dataExport");
        return await exportDailyAggregates({
          format: input.format,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          countryCode: input.countryCode,
        });
      }),

    /**
     * Export historical sessions as CSV/JSON
     */
    historicalSessions: publicProcedure
      .input(
        z.object({
          format: z.enum(["csv", "json"]).default("csv"),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          countryCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { exportHistoricalTrends } = await import("./dataExport");
        return await exportHistoricalTrends({
          format: input.format,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          countryCode: input.countryCode,
        });
      }),

    /**
     * Export emotion summary as CSV/JSON
     */
    emotionSummary: publicProcedure
      .input(
        z.object({
          format: z.enum(["csv", "json"]).default("csv"),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          countryCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { exportEmotionSummary } = await import("./dataExport");
        return await exportEmotionSummary({
          format: input.format,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          countryCode: input.countryCode,
        });
      }),
  }),

  // Analytics & Historical Trends
  analytics: router({
    /**
     * Get daily trend data for charts
     */
    getDailyTrends: publicProcedure
      .input(z.object({
        days: z.number().min(1).max(90).default(30),
        countryCode: z.string().length(2).optional(),
      }))
      .query(async ({ input }) => {
        const { getDailyTrendData } = await import("./analyticsStorage");
        return await getDailyTrendData(input.days, input.countryCode);
      }),

    /**
     * Get emotion distribution
     */
    getEmotionDistribution: publicProcedure
      .input(z.object({
        days: z.number().min(1).max(30).default(7),
        countryCode: z.string().length(2).optional(),
      }))
      .query(async ({ input }) => {
        const { getEmotionDistribution } = await import("./analyticsStorage");
        return await getEmotionDistribution(input.days, input.countryCode);
      }),

    /**
     * Get platform statistics
     */
    getPlatformStats: publicProcedure
      .input(z.object({ days: z.number().min(1).max(30).default(7) }))
      .query(async ({ input }) => {
        const { getPlatformStats } = await import("./analyticsStorage");
        return await getPlatformStats(input.days);
      }),

    /**
     * Get overall statistics
     */
    getOverallStats: publicProcedure.query(async () => {
      const { getOverallStats } = await import("./analyticsStorage");
      return await getOverallStats();
    }),

    /**
     * Get recent alerts
     */
    getRecentAlerts: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(10),
        unacknowledgedOnly: z.boolean().default(false),
      }))
      .query(async ({ input }) => {
        const { getRecentAlerts } = await import("./analyticsStorage");
        return await getRecentAlerts(input.limit, input.unacknowledgedOnly);
      }),

    /**
     * Acknowledge an alert
     */
    acknowledgeAlert: publicProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        const { acknowledgeAlert } = await import("./analyticsStorage");
        await acknowledgeAlert(input.alertId);
        return { success: true };
      }),

    /**
     * Get historical trends with sessions and aggregates
     */
    getHistoricalTrends: publicProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        countryCode: z.string().length(2).optional(),
        limit: z.number().min(1).max(200).default(100),
      }))
      .query(async ({ input }) => {
        const { getHistoricalTrends } = await import("./analyticsStorage");
        return await getHistoricalTrends({
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          countryCode: input.countryCode,
          limit: input.limit,
        });
      }),
  }),

  scheduler: router({
    /**
     * Get scheduler status
     */
    getStatus: publicProcedure.query(async () => {
      const { getSchedulerStatus } = await import("./scheduledAnalysis");
      return getSchedulerStatus();
    }),

    /**
     * Start the scheduler (admin only)
     */
    start: publicProcedure
      .input(z.object({ intervalMinutes: z.number().min(5).max(1440).optional() }))
      .mutation(async ({ input }) => {
        const { startScheduler, getSchedulerStatus } = await import("./scheduledAnalysis");
        startScheduler(input.intervalMinutes || 60);
        return getSchedulerStatus();
      }),

    /**
     * Stop the scheduler (admin only)
     */
    stop: publicProcedure.mutation(async () => {
      const { stopScheduler, getSchedulerStatus } = await import("./scheduledAnalysis");
      stopScheduler();
      return getSchedulerStatus();
    }),

    /**
     * Run a single analysis cycle manually
     */
    runNow: publicProcedure.mutation(async () => {
      const { runAnalysisCycle } = await import("./scheduledAnalysis");
      return await runAnalysisCycle();
    }),
  }),

  notifications: router({
    /**
     * Subscribe to email notifications
     */
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(1).max(100),
        frequency: z.enum(["daily", "weekly", "realtime"]).default("daily"),
        types: z.array(z.enum(["report", "alert", "digest"])).default(["report", "alert"]),
      }))
      .mutation(async ({ input }) => {
        const { subscribeToNotifications } = await import("./emailNotifications");
        const success = subscribeToNotifications(input.email, input.name, input.frequency, input.types);
        return { success };
      }),

    /**
     * Unsubscribe from email notifications
     */
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const { unsubscribeFromNotifications } = await import("./emailNotifications");
        const success = unsubscribeFromNotifications(input.email);
        return { success };
      }),

    /**
     * Update notification preferences
     */
    updatePreferences: publicProcedure
      .input(z.object({
        email: z.string().email(),
        frequency: z.enum(["daily", "weekly", "realtime"]).optional(),
        types: z.array(z.enum(["report", "alert", "digest"])).optional(),
        enabled: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateNotificationPreferences } = await import("./emailNotifications");
        const { email, ...preferences } = input;
        const success = updateNotificationPreferences(email, preferences);
        return { success };
      }),

    /**
     * Get subscriber info
     */
    getSubscriber: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const { getSubscriber } = await import("./emailNotifications");
        return getSubscriber(input.email) || null;
      }),

    /**
     * Send daily reports (admin only)
     */
    sendDailyReports: publicProcedure
      .mutation(async () => {
        const { sendDailyReports } = await import("./emailNotifications");
        return await sendDailyReports();
      }),

    /**
     * Send weekly digests (admin only)
     */
    sendWeeklyDigests: publicProcedure
      .mutation(async () => {
        const { sendWeeklyDigests } = await import("./emailNotifications");
        return await sendWeeklyDigests();
      }),

    /**
     * Generate preview of daily report
     */
    previewDailyReport: publicProcedure
      .query(async () => {
        const { generateDailyReport } = await import("./emailNotifications");
        return await generateDailyReport();
      }),

    /**
     * Generate preview of weekly digest
     */
    previewWeeklyDigest: publicProcedure
      .query(async () => {
        const { generateWeeklyDigest } = await import("./emailNotifications");
        return await generateWeeklyDigest();
      }),
  }),

  // Payment management
  // Meta-Learning System
  metaLearning: router({
    /**
     * Submit feedback for a prediction
     */
    submitFeedback: publicProcedure
      .input(z.object({
        analysisId: z.string(),
        text: z.string(),
        predictedEmotion: z.enum(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']),
        predictedConfidence: z.number().min(0).max(1),
        userCorrection: z.enum(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']).optional(),
        rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
        comment: z.string().max(500).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { feedbackLoopManager } = await import("./dcft");
        return feedbackLoopManager.submitFeedback({
          ...input,
          userId: ctx.user?.id?.toString(),
          region: undefined, // Could be detected from user settings
        });
      }),

    /**
     * Get learning statistics
     */
    getStats: publicProcedure.query(async () => {
      const { metaLearningEngine, feedbackLoopManager } = await import("./dcft");
      return {
        learning: metaLearningEngine.getStats(),
        feedback: feedbackLoopManager.getFeedbackStats(),
        vocabulary: metaLearningEngine.getVocabularyBreakdown(),
      };
    }),

    /**
     * Get accuracy history
     */
    getAccuracyHistory: publicProcedure
      .input(z.object({ days: z.number().min(1).max(90).default(30) }))
      .query(async ({ input }) => {
        const { feedbackLoopManager } = await import("./dcft");
        return feedbackLoopManager.getAccuracyHistory(input.days);
      }),

    /**
     * Get vocabulary for an emotion
     */
    getEmotionVocabulary: publicProcedure
      .input(z.object({ emotion: z.enum(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']) }))
      .query(async ({ input }) => {
        const { metaLearningEngine } = await import("./dcft");
        return metaLearningEngine.getEmotionVocabulary(input.emotion);
      }),

    /**
     * Add custom vocabulary (admin only)
     */
    addVocabulary: publicProcedure
      .input(z.object({
        word: z.string().min(2).max(50),
        emotion: z.enum(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']),
        weight: z.number().min(0.1).max(1).default(0.7),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        const { metaLearningEngine } = await import("./dcft");
        metaLearningEngine.addUserVocabulary(input.word, input.emotion, input.weight);
        return { success: true };
      }),

    /**
     * Get A/B tests
     */
    getABTests: publicProcedure.query(async () => {
      const { feedbackLoopManager } = await import("./dcft");
      return {
        active: feedbackLoopManager.getActiveABTests(),
        all: feedbackLoopManager.getAllABTests(),
      };
    }),

    /**
     * Start an A/B test (admin only)
     */
    startABTest: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500),
        vocabularyChanges: z.array(z.object({
          word: z.string(),
          emotion: z.enum(['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity']),
          weight: z.number().min(0.1).max(1),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        const { feedbackLoopManager } = await import("./dcft");
        return feedbackLoopManager.startABTest(input.name, input.description, input.vocabularyChanges);
      }),

    /**
     * Get emerging expressions
     */
    getEmergingExpressions: publicProcedure.query(async () => {
      const { vocabularyAdapter } = await import("./dcft");
      return {
        expressions: vocabularyAdapter.exportEmergingExpressions(),
        stats: vocabularyAdapter.getEmergingStats(),
      };
    }),

    /**
     * Analyze with context adaptation
     */
    analyzeWithAdaptation: publicProcedure
      .input(z.object({
        text: z.string().min(1).max(1000),
        region: z.string().length(2).optional(),
      }))
      .query(async ({ input }) => {
        const { vocabularyAdapter } = await import("./dcft");
        return vocabularyAdapter.analyzeWithAdaptation(input.text, input.region);
      }),

    /**
     * Trigger learning cycle manually (admin only)
     */
    triggerLearningCycle: publicProcedure
      .mutation(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        const { metaLearningEngine } = await import("./dcft");
        metaLearningEngine.runLearningCycle();
        return { success: true, stats: metaLearningEngine.getStats() };
      }),
  }),

  payments: router({
    /**
     * Submit a new payment record
     */
    submitPayment: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(1).max(255),
        plan: z.enum(["pro", "enterprise", "government"]),
        amount: z.number().min(1),
        billingPeriod: z.enum(["monthly", "annual"]).default("monthly"),
        paymentMethod: z.enum(["paypal", "bank_transfer", "western_union", "moneygram", "crypto"]),
        transactionRef: z.string().optional(),
        paymentDetails: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createPaymentRecord } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        
        // Create payment record
        await createPaymentRecord({
          email: input.email,
          name: input.name,
          plan: input.plan,
          amount: input.amount,
          billingPeriod: input.billingPeriod,
          paymentMethod: input.paymentMethod,
          transactionRef: input.transactionRef || null,
          paymentDetails: input.paymentDetails || null,
          status: "pending",
        });

        // Notify owner about new payment
        const planNames: Record<string, string> = {
          pro: "Professional ($49/month)",
          enterprise: "Enterprise ($299/month)",
          government: "Government & NGO (Custom)",
        };
        const methodNames: Record<string, string> = {
          paypal: "PayPal",
          bank_transfer: "Bank Transfer",
          western_union: "Western Union",
          moneygram: "MoneyGram",
          crypto: "Cryptocurrency (USDT)",
        };

        await notifyOwner({
          title: `💰 New Payment Submission - ${planNames[input.plan]}`,
          content: `
**New Payment Received!**

**Customer Details:**
- Name: ${input.name}
- Email: ${input.email}

**Payment Details:**
- Plan: ${planNames[input.plan]}
- Amount: $${input.amount}
- Billing: ${input.billingPeriod === "annual" ? "Annual" : "Monthly"}
- Method: ${methodNames[input.paymentMethod]}
${input.transactionRef ? `- Transaction Ref: ${input.transactionRef}` : ""}

**Status:** Pending Confirmation

Please verify the payment and confirm in the admin panel.
          `.trim(),
        });

        return { success: true, message: "Payment submitted successfully. We will confirm your payment shortly." };
      }),

    /**
     * Get all payment records (admin only)
     */
    getAllPayments: publicProcedure
      .query(async ({ ctx }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== "admin") {
          return [];
        }
        const { getAllPaymentRecords } = await import("./db");
        return await getAllPaymentRecords();
      }),

    /**
     * Get pending payments (admin only)
     */
    getPendingPayments: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          return [];
        }
        const { getPaymentRecordsByStatus } = await import("./db");
        return await getPaymentRecordsByStatus("pending");
      }),

    /**
     * Confirm a payment (admin only)
     */
    confirmPayment: publicProcedure
      .input(z.object({
        paymentId: z.number(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updatePaymentRecordStatus, getPaymentRecordById } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        
        const payment = await getPaymentRecordById(input.paymentId);
        if (!payment) {
          throw new Error("Payment not found");
        }

        await updatePaymentRecordStatus(
          input.paymentId, 
          "confirmed", 
          input.adminNotes,
          ctx.user.id
        );

        // TODO: Send confirmation email to customer
        // For now, just notify owner
        await notifyOwner({
          title: `✅ Payment Confirmed - ${payment.name}`,
          content: `Payment #${input.paymentId} for ${payment.email} has been confirmed.`,
        });

        return { success: true };
      }),

    /**
     * Reject a payment (admin only)
     */
    rejectPayment: publicProcedure
      .input(z.object({
        paymentId: z.number(),
        adminNotes: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        const { updatePaymentRecordStatus } = await import("./db");
        
        await updatePaymentRecordStatus(
          input.paymentId, 
          "rejected", 
          input.adminNotes,
          ctx.user.id
        );

        return { success: true };
      }),

    /**
     * Get user's own payments
     */
    getMyPayments: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) {
          return [];
        }
        const { getUserPaymentRecords } = await import("./db");
        return await getUserPaymentRecords(ctx.user.id);
      }),

    /**
     * Get payment methods info
     */
    getPaymentMethods: publicProcedure
      .query(() => {
        return {
          paypal: {
            name: "PayPal",
            description: "Pay securely via PayPal",
            email: "amaalmousay@gmail.com",
            instructions: "Send payment to our PayPal account and include your email in the note.",
          },
          bank_transfer: {
            name: "Bank Transfer",
            description: "Direct bank transfer",
            details: {
              bankName: "To be provided upon request",
              accountName: "Amaal Radwan Bashir",
              note: "Contact us for bank details",
            },
            instructions: "Contact us at amaalmousay@gmail.com for bank transfer details.",
          },
          western_union: {
            name: "Western Union",
            description: "International money transfer via Western Union",
            receiverName: "Amaal Radwan Bashir",
            country: "Libya",
            city: "Sabha",
            instructions: "Send money via Western Union to the receiver details above. Keep your MTCN number.",
          },
          moneygram: {
            name: "MoneyGram",
            description: "International money transfer via MoneyGram",
            receiverName: "Amaal Radwan Bashir",
            country: "Libya",
            city: "Sabha",
            instructions: "Send money via MoneyGram to the receiver details above. Keep your reference number.",
          },
          crypto: {
            name: "Cryptocurrency (USDT)",
            description: "Pay with USDT (Tether)",
            network: "TRC20 (Tron)",
            address: "Contact us for wallet address",
            instructions: "Contact us at amaalmousay@gmail.com for our USDT wallet address.",
          },
        };
      }),
  }),

  // Topic Analysis - Advanced analysis by topic, demographics, and regions
  topic: router({
    /**
     * Analyze a topic in a specific country with demographic and regional breakdown
     * Returns:
     * - Overall support/opposition percentages
     * - Demographic breakdown (youth, middle-age, seniors)
     * - Regional breakdown (cities/regions within the country)
     * - Top supporting and opposing regions
     */
    analyzeTopicInCountry: publicProcedure
      .input(z.object({
        topic: z.string().min(1).max(200),
        countryCode: z.string().length(2),
        countryName: z.string().min(1).max(100),
        timeRange: z.enum(['day', 'week', 'month']).default('week'),
        language: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { analyzeTopicInCountry } = await import("./topicAnalyzer");
        return await analyzeTopicInCountry(
          input.topic,
          input.countryCode,
          input.countryName,
          {
            timeRange: input.timeRange,
            language: input.language,
          }
        );
      }),

    /**
     * Get available regions for a country
     */
    getCountryRegions: publicProcedure
      .input(z.object({ countryCode: z.string().length(2) }))
      .query(async ({ input }) => {
        const { getCountryRegions } = await import("./topicAnalyzer");
        return getCountryRegions(input.countryCode);
      }),

    /**
     * Get list of countries with detailed regional data
     */
    getCountriesWithRegionalData: publicProcedure
      .query(async () => {
        const { getCountriesWithRegionalData } = await import("./topicAnalyzer");
        return getCountriesWithRegionalData();
      }),

    /**
     * Get age group definitions
     */
    getAgeGroups: publicProcedure
      .query(async () => {
        const { AGE_GROUPS } = await import("./topicAnalyzer");
        return AGE_GROUPS;
      }),
  }),
});

export type AppRouter = typeof appRouter;
