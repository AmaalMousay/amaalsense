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
import { alertsRouter } from "./alertsRouter";


const anyInput = z.any().optional();
const stubQuery = (value: any = null) => publicProcedure.input(anyInput).query(async (): Promise<any> => value);
const stubMutation = (value: any = { success: true }) => publicProcedure.input(anyInput).mutation(async ({ input }): Promise<any> => ({ ...value, input }));

const conversationsRouter = router({
  list: stubQuery([]),
  get: stubQuery(null),
  create: stubMutation({ success: true, conversationId: "local" }),
  addMessage: stubMutation({ success: true }),
  delete: stubMutation({ success: true }),
});

const exportRouter = router({
  generateCountryReport: stubQuery({ success: true, url: null, content: "" }),
  generateGlobalReport: stubQuery({ success: true, url: null, content: "" }),
});

const paymentsRouter = router({
  getAllPayments: stubQuery([]),
  getPendingPayments: stubQuery([]),
  submitPayment: stubMutation({ success: true }),
  confirmPayment: stubMutation({ success: true }),
  rejectPayment: stubMutation({ success: true }),
});

const registrationRouter = router({
  register: stubMutation({ success: true }),
  requestPasswordReset: stubMutation({ success: true }),
  resetPassword: stubMutation({ success: true }),
});

const subscriptionRouter = router({
  getUsage: stubQuery({ tier: "free", used: 0, limit: 10, remaining: 10 }),
  getUserApiKeys: stubQuery([]),
  generateApiKey: stubMutation({ success: true, key: null }),
  revokeApiKey: stubMutation({ success: true }),
  submitEnterpriseInquiry: stubMutation({ success: true }),
});

const supportRouter = router({ askQuestion: stubMutation({ success: true, answer: "" }) });
const telegramRouter = router({
  subscribe: stubMutation({ success: true }),
  sendTestNotification: stubMutation({ success: true }),
  sendDailySummary: stubMutation({ success: true }),
});
const topicsRouter = router({
  getFollowed: stubQuery([]),
  follow: stubMutation({ success: true }),
  unfollow: stubMutation({ success: true }),
  toggleActive: stubMutation({ success: true }),
});
const topicAlertsRouter = router({
  getAll: stubQuery([]),
  getUnreadCount: stubQuery(0),
  markRead: stubMutation({ success: true }),
  markAllRead: stubMutation({ success: true }),
});
const metaLearningRouter = router({ submitResponseFeedback: stubMutation({ success: true }) });
const aiRouter = router({ chat: stubMutation({ success: true, response: "" }) });


export const appRouter = router({
  system: systemRouter,
  alerts: alertsRouter,
  notifications: notificationRouter,
  newFeatures: newFeaturesRouter,
  search: searchRouter,
  engine: unifiedEngineRouter,
  historicalEvents: historicalEventsRouter,
  agent: agentRouter,
  realtimeData: realtimeDataRouter,
  pipeline: pipelineRouter,
  chatAnalysis: chatAnalysisRouter,
  graphPipeline: graphPipelineRouter,
  prediction: predictionRouter,
  unified: unifiedRouter,
  explainability: explainabilityRouter,
  conversations: conversationsRouter,
  export: exportRouter,
  payments: paymentsRouter,
  registration: registrationRouter,
  subscription: subscriptionRouter,
  support: supportRouter,
  telegram: telegramRouter,
  topics: topicsRouter,
  topicAlerts: topicAlertsRouter,
  metaLearning: metaLearningRouter,
  ai: aiRouter,
  
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

  //   
  quickAnalysis: router({
    analyze: publicProcedure
      .input(z.object({ headline: z.string() }))
      .mutation(async ({ input }) => {
        const { analyzeQuick } = await import('../engines/unifiedAnalyzer');
        const { LearningLayer } = await import('../engines/learningStore');

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
