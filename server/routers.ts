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
});

export type AppRouter = typeof appRouter;
