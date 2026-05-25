/**
 * Real-Time Data Router
 *        (tRPC)
 */

import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
//     Pipeline 
import { fetchRealTimeData, fetchGDELTEvents, fetchWorldBankIndicators } from '../engines/realtimeDataPipeline';

export const realtimeDataRouter = router({

  /**
   * 1.    ()
   */
  triggerRefresh: publicProcedure
    .input(z.object({ topic: z.string().optional() }))
    .mutation(async ({ input }) => {
      console.log(`[RealtimeRouter] Manual refresh triggered for: ${input.topic || 'All'}`);
      const results = await fetchRealTimeData();
      return {
        success: true,
        eventCount: results.length,
        timestamp: new Date()
      };
    }),

  /**
   * 2.   GDELT 
   */
  fetchGDELTEvents: publicProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async () => {
      const events = await fetchGDELTEvents();
      return {
        success: true,
        count: events.length,
        data: events,
        source: 'GDELT',
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * 3.     
   */
  fetchWorldBankIndicators: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional().default('LY'),
    }).optional())
    .query(async ({ input }) => {
      const indicators = await fetchWorldBankIndicators(input?.countryCode);
      return {
        success: true,
        count: indicators.length,
        data: indicators,
        source: 'World Bank',
        country: input?.countryCode,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * 4.   (Pipeline Status)
   */
  getPipelineStatus: publicProcedure.query(() => {
    return {
      success: true,
      status: 'active',
      lastRefresh: new Date().toISOString(),
      sources: [
        { name: 'GDELT', status: 'active', updateFrequency: 'Real-time' },
        { name: 'World Bank', status: 'active', updateFrequency: 'Daily/Annual' }
      ]
    };
  }),

  /**
   * 5.    GDELT ()
   */
  getGDELTEventCodes: publicProcedure.query(() => {
    return {
      success: true,
      data: [
        { code: '01', category: 'Statement', topic: 'politics' },
        { code: '13', category: 'Threaten', topic: 'conflict' },
        { code: '06', category: 'Cooperation', topic: 'economy' }
      ]
    };
  })
});

export type RealtimeDataRouter = typeof realtimeDataRouter;