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
