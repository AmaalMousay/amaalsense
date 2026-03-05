// @ts-nocheck
/**
 * Indices Router
 * 
 * Provides live collective emotion indices:
 * - Global Mood Index (GMI)
 * - Collective Fear Index (CFI)
 * - Hope Resilience Index (HRI)
 * - Stability Index
 * - Confidence Score
 * - Historical trends
 * - Regional comparisons
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const indicesRouter = router({
  /**
   * Get current indices values
   */
  getCurrent: publicProcedure.query(async () => {
    try {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const { emotionIndices } = await import('../drizzle/schema');
      const { desc } = await import('drizzle-orm');

      // Get latest indices
      const [latest] = await db
        .select()
        .from(emotionIndices)
        .orderBy(desc(emotionIndices.createdAt))
        .limit(1);

      if (!latest) {
        return {
          gmi: 68,
          cfi: 32,
          hri: 72,
          stability: 65,
          confidence: 87,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        gmi: Math.round(latest.gmi || 68),
        cfi: Math.round(latest.cfi || 32),
        hri: Math.round(latest.hri || 72),
        stability: Math.round((latest.confidence || 65) * 0.95),
        confidence: Math.round(latest.confidence || 87),
        timestamp: latest.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting current indices:', error);
      throw error;
    }
  }),

  /**
   * Get historical indices data for trend analysis
   */
  getHistorical: publicProcedure
    .input(z.object({ hours: z.number().default(24) }))
    .query(async ({ input }) => {
      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const { emotionIndices } = await import('../drizzle/schema');
        const { desc, gte } = await import('drizzle-orm');

        // Get data from specified hours ago
        const startTime = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const data = await db
          .select()
          .from(emotionIndices)
          .where(gte(emotionIndices.createdAt, startTime))
          .orderBy(desc(emotionIndices.createdAt))
          .limit(input.hours * 2); // Assuming ~2 records per hour

        // Format for chart display
        const formatted = data
          .reverse()
          .map((record, index) => ({
            time: new Date(record.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            gmi: Math.round(record.gmi || 68),
            cfi: Math.round(record.cfi || 32),
            hri: Math.round(record.hri || 72),
            stability: Math.round((record.confidence || 65) * 0.95),
            confidence: Math.round(record.confidence || 87),
          }));

        return formatted;
      } catch (error) {
        console.error('Error getting historical indices:', error);
        throw error;
      }
    }),

  /**
   * Get indices comparison across regions
   */
  getComparison: publicProcedure
    .input(z.object({ regions: z.array(z.string()).default(['global']) }))
    .query(async ({ input }) => {
      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const { countryEmotionIndices } = await import('../drizzle/schema');
        const { desc, inArray } = await import('drizzle-orm');

        // Get latest data for each region
        const comparisons = [];

        for (const region of input.regions) {
          const [data] = await db
            .select()
            .from(countryEmotionIndices)
            .where(inArray(countryEmotionIndices.countryCode, [region]))
            .orderBy(desc(countryEmotionIndices.createdAt))
            .limit(1);

          if (data) {
            comparisons.push({
              region,
              gmi: Math.round(data.gmi || 68),
              cfi: Math.round(data.cfi || 32),
              hri: Math.round(data.hri || 72),
              timestamp: data.createdAt.toISOString(),
            });
          }
        }

        return comparisons;
      } catch (error) {
        console.error('Error getting indices comparison:', error);
        throw error;
      }
    }),

  /**
   * Get indices trend (increasing/decreasing)
   */
  getTrend: publicProcedure
    .input(z.object({ timeframe: z.enum(['1h', '6h', '24h', '7d']).default('24h') }))
    .query(async ({ input }) => {
      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const { emotionIndices } = await import('../drizzle/schema');
        const { desc, gte } = await import('drizzle-orm');

        // Calculate timeframe in hours
        const hoursMap = { '1h': 1, '6h': 6, '24h': 24, '7d': 168 };
        const hours = hoursMap[input.timeframe];

        const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        const data = await db
          .select()
          .from(emotionIndices)
          .where(gte(emotionIndices.createdAt, startTime))
          .orderBy(desc(emotionIndices.createdAt))
          .limit(100);

        if (data.length < 2) {
          return {
            gmiTrend: 'stable',
            cfiTrend: 'stable',
            hriTrend: 'stable',
            gmiChange: 0,
            cfiChange: 0,
            hriChange: 0,
          };
        }

        const latest = data[0];
        const oldest = data[data.length - 1];

        const gmiChange = (latest.gmi || 68) - (oldest.gmi || 68);
        const cfiChange = (latest.cfi || 32) - (oldest.cfi || 32);
        const hriChange = (latest.hri || 72) - (oldest.hri || 72);

        return {
          gmiTrend: gmiChange > 2 ? 'up' : gmiChange < -2 ? 'down' : 'stable',
          cfiTrend: cfiChange > 2 ? 'up' : cfiChange < -2 ? 'down' : 'stable',
          hriTrend: hriChange > 2 ? 'up' : hriChange < -2 ? 'down' : 'stable',
          gmiChange: Math.round(gmiChange * 10) / 10,
          cfiChange: Math.round(cfiChange * 10) / 10,
          hriChange: Math.round(hriChange * 10) / 10,
          timeframe: input.timeframe,
        };
      } catch (error) {
        console.error('Error getting indices trend:', error);
        throw error;
      }
    }),

  /**
   * Get indices statistics
   */
  getStats: publicProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ input }) => {
      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        const { emotionIndices } = await import('../drizzle/schema');
        const { gte } = await import('drizzle-orm');

        // Get data from specified days
        const startTime = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
        const data = await db
          .select()
          .from(emotionIndices)
          .where(gte(emotionIndices.createdAt, startTime))
          .limit(1000);

        if (data.length === 0) {
          return {
            gmiAvg: 68,
            gmiMin: 60,
            gmiMax: 75,
            cfiAvg: 32,
            cfiMin: 25,
            cfiMax: 45,
            hriAvg: 72,
            hriMin: 65,
            hriMax: 80,
            dataPoints: 0,
          };
        }

        // Calculate statistics
        const gmis = data.map(d => d.gmi || 68);
        const cfis = data.map(d => d.cfi || 32);
        const hris = data.map(d => d.hri || 72);

        const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
        const min = (arr: number[]) => Math.round(Math.min(...arr));
        const max = (arr: number[]) => Math.round(Math.max(...arr));

        return {
          gmiAvg: avg(gmis),
          gmiMin: min(gmis),
          gmiMax: max(gmis),
          cfiAvg: avg(cfis),
          cfiMin: min(cfis),
          cfiMax: max(cfis),
          hriAvg: avg(hris),
          hriMin: min(hris),
          hriMax: max(hris),
          dataPoints: data.length,
        };
      } catch (error) {
        console.error('Error getting indices stats:', error);
        throw error;
      }
    }),
});
