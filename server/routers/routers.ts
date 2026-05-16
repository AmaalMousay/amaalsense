import { z } from "zod";
import { systemRouter } from '../_core/systemRouter';
import { publicProcedure, router } from '../_core/trpc';
import { newFeaturesRouter } from "./newFeaturesRouter";
import { realtimeDataRouter } from "./realtimeDataRouter";
import { pipelineRouter } from "./pipelineRouter";
import { chatAnalysisRouter } from "./chatAnalysisRouter";
import { graphPipelineRouter } from "./graphPipelineRouter";
import { unifiedRouter } from "./unifiedRouters";
import { explainabilityRouter } from "./explainabilityRouter";
import { notificationRouter } from "./notificationRouter";
import { searchRouter } from "./searchRouter";
import { unifiedEngineRouter } from "./unifiedEngineRouter";
import { historicalEventsRouter } from "./historicalEventsRouter";
import { agentRouter } from "./agentRouter";
import { predictionRouter } from "./predictionRouter";
import { metacognitionRouter } from "./metacognitionRouter";
import { alertsRouter } from "./alertsRouter";
import { registrationRouter } from "./registrationRouter";
import { telegramRouter } from "./telegramRouter";
import { topicAlertsRouter } from "./topicAlertsRouter";
import { topicsRouter } from "./topicsRouter";
import { supportRouter } from "./supportRouter";
import { subscriptionRouter } from "./subscriptionRouter";
import { conversationsRouter } from "./conversationsRouter";
import { paymentsRouter } from "./paymentsRouter";

export const appRouter = router({
  system: systemRouter,
  alerts: alertsRouter,
  registration: registrationRouter,
  telegram: telegramRouter,
  topicAlerts: topicAlertsRouter,
  topics: topicsRouter,
  support: supportRouter,
  subscription: subscriptionRouter,
  conversations: conversationsRouter,
  payments: paymentsRouter,
  notifications: notificationRouter,
  newFeatures: newFeaturesRouter,
  search: searchRouter,
  engine: unifiedEngineRouter,
  historicalEvents: historicalEventsRouter,
  agent: agentRouter,
  metacognition: metacognitionRouter,
  realtimeData: realtimeDataRouter,
  pipeline: pipelineRouter,
  chatAnalysis: chatAnalysisRouter,
  graphPipeline: graphPipelineRouter,
  prediction: predictionRouter,
  unified: unifiedRouter,
  explainability: explainabilityRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const { COOKIE_NAME } = require("@shared/const");
      const { getSessionCookieOptions } = require('../_core/cookies');
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  userStatistics: router({
    getStats: publicProcedure.query(async ({ ctx }) => {
      const { getDb } = await import('../_core/db');
      const db = await getDb();
      if (!db || !ctx.user) return null;
      const { userProfiles } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      
      return profile ? { 
        ...profile, 
        recentAlerts: [], 
        recentAnalyses: [], 
        countriesAnalyzed: 0, 
        reputation: 100, 
        followedTopics: 0, 
        activeAlerts: 0, 
        totalAnalyses: 0, 
        averageConfidence: 0,
        lastActive: new Date()
      } : {
        conversationCount: 0,
        messageCount: 0,
        userLevel: 'beginner',
        profileConfidence: 0,
        recentAlerts: [],
        recentAnalyses: [],
        countriesAnalyzed: 0,
        reputation: 100,
        followedTopics: 0,
        activeAlerts: 0,
        totalAnalyses: 0,
        averageConfidence: 0,
        lastActive: new Date(),
        createdAt: new Date(),
      };
    }),
  }),

  // التحليل السريع للهيدلاينز
  quickAnalysis: router({
    analyze: publicProcedure
      .input(z.object({ headline: z.string() }))
      .mutation(async ({ input }) => {
        const { analyzeQuick } = await import('../engines/unifiedAnalyzer');
        const { LearningLayer } = await import('../engines/learningLayer');

        const result = await analyzeQuick(input.headline);
        
        await LearningLayer.recordInteraction({
          question: input.headline,
          detectedIntent: 'general_inquiry',
          wasHelpful: null,
          topic: 'quick_analysis',
          responseQuality: 5,
        });

        return result;
      }),
  }),

  health: publicProcedure.query(() => ({ ok: true })),
});

export type AppRouter = typeof appRouter;
