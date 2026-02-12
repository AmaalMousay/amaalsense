/**
 * Real-Time Data Router
 * 
 * tRPC procedures for managing real-time data from GDELT and World Bank APIs
 */

import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import { 
  fetchGDELTEvents, 
  fetchWorldBankIndicators, 
  fetchRealTimeData,
  triggerDataRefresh,
} from './realtimeDataPipeline';

export const realtimeDataRouter = router({
  /**
   * Fetch GDELT events for a date range
   */
  fetchGDELTEvents: publicProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{8}$/).optional().default('20240101'),
      endDate: z.string().regex(/^\d{8}$/).optional().default('20240131'),
    }).optional())
    .query(async ({ input }) => {
      const events = await fetchGDELTEvents(input?.startDate, input?.endDate);
      
      return {
        success: true,
        count: events.length,
        data: events,
        source: 'GDELT',
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Fetch World Bank economic indicators
   */
  fetchWorldBankIndicators: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional().default('LY'),
      indicators: z.array(z.string()).optional().default(['NY.GDP.MKTP.CD', 'FP.CPI.TOTL.ZG']),
    }).optional())
    .query(async ({ input }) => {
      const indicators = await fetchWorldBankIndicators(input?.countryCode, input?.indicators);
      
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
   * Fetch combined real-time data from all sources
   */
  fetchRealTimeData: publicProcedure
    .query(async () => {
      const eventVectors = await fetchRealTimeData();
      
      return {
        success: true,
        count: eventVectors.length,
        data: eventVectors,
        sources: ['GDELT', 'World Bank'],
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Trigger manual data refresh
   */
  triggerRefresh: publicProcedure
    .mutation(async () => {
      const result = await triggerDataRefresh();
      
      return {
        success: result.success,
        gdeltCount: result.gdeltCount,
        bankCount: result.bankCount,
        totalCount: result.totalCount,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get data pipeline status
   */
  getPipelineStatus: publicProcedure
    .query(() => {
      return {
        success: true,
        status: 'active',
        lastRefresh: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        nextRefresh: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        refreshInterval: '6 hours',
        sources: [
          {
            name: 'GDELT',
            status: 'active',
            description: 'Global Database of Events, Language, and Tone',
            url: 'https://www.gdeltproject.org',
            updateFrequency: 'Real-time (15-minute delay)',
          },
          {
            name: 'World Bank',
            status: 'active',
            description: 'World Bank Open Data API',
            url: 'https://data.worldbank.org',
            updateFrequency: 'Annual',
          },
        ],
      };
    }),

  /**
   * Get available World Bank indicators
   */
  getAvailableIndicators: publicProcedure
    .query(() => {
      const indicators = [
        {
          id: 'NY.GDP.MKTP.CD',
          name: 'GDP (current US$)',
          category: 'Economy',
          frequency: 'Annual',
        },
        {
          id: 'FP.CPI.TOTL.ZG',
          name: 'Inflation, consumer prices (annual %)',
          category: 'Economy',
          frequency: 'Annual',
        },
        {
          id: 'SP.URB.TOTL.IN.ZS',
          name: 'Urban population (% of total)',
          category: 'Society',
          frequency: 'Annual',
        },
        {
          id: 'NY.GDP.PCAP.CD',
          name: 'GDP per capita (current US$)',
          category: 'Economy',
          frequency: 'Annual',
        },
        {
          id: 'SP.POP.TOTL',
          name: 'Population, total',
          category: 'Society',
          frequency: 'Annual',
        },
        {
          id: 'NY.GNP.MKTP.CD',
          name: 'GNI (current US$)',
          category: 'Economy',
          frequency: 'Annual',
        },
        {
          id: 'SE.ADT.LITR.ZS',
          name: 'Literacy rate, adult total (% of population)',
          category: 'Society',
          frequency: 'Annual',
        },
        {
          id: 'SP.DYN.LE00.IN',
          name: 'Life expectancy at birth, total (years)',
          category: 'Health',
          frequency: 'Annual',
        },
      ];
      
      return {
        success: true,
        count: indicators.length,
        data: indicators,
      };
    }),

  /**
   * Get GDELT event codes mapping
   */
  getGDELTEventCodes: publicProcedure
    .query(() => {
      const eventCodes = [
        { code: '01', category: 'Make statement', topic: 'politics' },
        { code: '02', category: 'Appeal', topic: 'politics' },
        { code: '03', category: 'Request', topic: 'politics' },
        { code: '04', category: 'Consult', topic: 'politics' },
        { code: '05', category: 'Engage in diplomatic cooperation', topic: 'politics' },
        { code: '06', category: 'Engage in material cooperation', topic: 'politics' },
        { code: '07', category: 'Provide aid', topic: 'society' },
        { code: '08', category: 'Yield', topic: 'politics' },
        { code: '09', category: 'Investigate', topic: 'politics' },
        { code: '10', category: 'Demand', topic: 'politics' },
        { code: '11', category: 'Disapprove', topic: 'politics' },
        { code: '12', category: 'Reject', topic: 'politics' },
        { code: '13', category: 'Threaten', topic: 'conflict' },
        { code: '14', category: 'Protest', topic: 'society' },
        { code: '15', category: 'Sanction', topic: 'politics' },
        { code: '16', category: 'Coerce', topic: 'conflict' },
        { code: '17', category: 'Assault', topic: 'conflict' },
        { code: '18', category: 'Fight', topic: 'conflict' },
        { code: '19', category: 'Use unconventional mass violence', topic: 'conflict' },
        { code: '20', category: 'Employ unconventional mass violence', topic: 'conflict' },
      ];
      
      return {
        success: true,
        count: eventCodes.length,
        data: eventCodes,
      };
    }),
});

export type RealtimeDataRouter = typeof realtimeDataRouter;
