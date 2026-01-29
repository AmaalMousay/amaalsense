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
     */
    analyzeHeadline: publicProcedure
      .input(z.object({ headline: z.string().min(1).max(500) }))
      .mutation(async ({ input }) => {
        const { analyzeHeadline, calculateIndices } = await import("./emotionAnalyzer");
        const analysis = analyzeHeadline(input.headline);

        // Save to database
        const { createEmotionAnalysis, createEmotionIndex } = await import("./db");
        await createEmotionAnalysis({
          headline: analysis.headline,
          joy: analysis.emotions.joy,
          fear: analysis.emotions.fear,
          anger: analysis.emotions.anger,
          sadness: analysis.emotions.sadness,
          hope: analysis.emotions.hope,
          curiosity: analysis.emotions.curiosity,
          dominantEmotion: analysis.dominantEmotion,
          confidence: analysis.confidence,
          model: analysis.model,
        });

        // Calculate and save indices
        const indices = calculateIndices([analysis]);
        await createEmotionIndex({
          gmi: indices.gmi,
          cfi: indices.cfi,
          hri: indices.hri,
          confidence: indices.confidence,
        });

        return analysis;
      }),

    /**
     * Get the latest emotion indices
     */
    getLatestIndices: publicProcedure.query(async () => {
      const { getLatestEmotionIndices } = await import("./db");
      const indices = await getLatestEmotionIndices();
      return indices || { gmi: 0, cfi: 50, hri: 50, confidence: 0 };
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
      const { generateAllCountriesEmotionData } = await import("./countryEmotionAnalyzer");
      const { getLatestEmotionIndices } = await import("./db");

      const globalIndices = await getLatestEmotionIndices();
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
     * Analyze a headline using AI
     */
    analyzeWithAI: publicProcedure
      .input(z.object({ text: z.string().min(1).max(1000) }))
      .mutation(async ({ input }) => {
        const { analyzeTextWithAI } = await import("./aiSentimentAnalyzer");
        return await analyzeTextWithAI(input.text);
      }),

    /**
     * Fetch and analyze news for a country
     */
    getCountryNewsAnalysis: publicProcedure
      .input(z.object({ countryCode: z.string().length(2), pageSize: z.number().min(1).max(20).default(10) }))
      .query(async ({ input }) => {
        const { getNewsWithFallback } = await import("./newsService");
        const { analyzeTextsWithAI } = await import("./aiSentimentAnalyzer");

        // Fetch news
        const { articles, isReal } = await getNewsWithFallback(input.countryCode, input.pageSize);

        // Analyze headlines
        const headlines = articles.map(a => a.title);
        const analysis = await analyzeTextsWithAI(headlines);

        return {
          countryCode: input.countryCode,
          articles,
          analysis: analysis.aggregated,
          detailedResults: analysis.results,
          isRealNews: isReal,
          isAIAnalyzed: analysis.isAIAnalyzed,
          analyzedAt: new Date(),
        };
      }),

    /**
     * Fetch global news and analyze
     */
    getGlobalNewsAnalysis: publicProcedure
      .input(z.object({ pageSize: z.number().min(1).max(30).default(20) }))
      .query(async ({ input }) => {
        const { fetchGlobalNews, generateMockNews } = await import("./newsService");
        const { analyzeTextsWithAI } = await import("./aiSentimentAnalyzer");

        // Fetch global news
        let articles = await fetchGlobalNews(input.pageSize);
        let isReal = articles.length > 0;

        // Fallback to mock if no real news
        if (articles.length === 0) {
          articles = generateMockNews('US', input.pageSize);
          isReal = false;
        }

        // Analyze headlines
        const headlines = articles.map(a => a.title);
        const analysis = await analyzeTextsWithAI(headlines);

        return {
          articles,
          analysis: analysis.aggregated,
          detailedResults: analysis.results,
          isRealNews: isReal,
          isAIAnalyzed: analysis.isAIAnalyzed,
          analyzedAt: new Date(),
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
});

export type AppRouter = typeof appRouter;
