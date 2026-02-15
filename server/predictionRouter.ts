/**
 * Prediction Router - tRPC Endpoints for Forecasting
 * 
 * يوفر endpoints للتنبؤ بالمؤشرات والعواطف والموضوعات
 */

import { z } from 'zod';
import { predictionEngine, type HistoricalDataPoint } from './predictionLayer';
import { publicProcedure, router } from './_core/trpc';

export const predictionRouter = router({
  /**
   * التنبؤ بـ GMI (Global Mood Index)
   */
  forecastGMI: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const forecast = predictionEngine.forecastGMI(input.days);
        
        return {
          success: true,
          data: forecast,
          message: `تم التنبؤ بـ GMI لـ ${input.days} أيام`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to forecast GMI',
          data: null,
        };
      }
    }),

  /**
   * التنبؤ بـ CFI (Collective Fear Index)
   */
  forecastCFI: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const forecast = predictionEngine.forecastCFI(input.days);
        
        return {
          success: true,
          data: forecast,
          message: `تم التنبؤ بـ CFI لـ ${input.days} أيام`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to forecast CFI',
          data: null,
        };
      }
    }),

  /**
   * التنبؤ بـ HRI (Hope & Resilience Index)
   */
  forecastHRI: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const forecast = predictionEngine.forecastHRI(input.days);
        
        return {
          success: true,
          data: forecast,
          message: `تم التنبؤ بـ HRI لـ ${input.days} أيام`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to forecast HRI',
          data: null,
        };
      }
    }),

  /**
   * تحليل السيناريوهات (متفائل، واقعي، متشائم)
   */
  analyzeScenarios: publicProcedure
    .input(z.object({
      metric: z.enum(['GMI', 'CFI', 'HRI']),
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const scenarios = predictionEngine.analyzeScenarios(
          input.metric as 'GMI' | 'CFI' | 'HRI',
          input.days
        );
        
        return {
          success: true,
          data: scenarios,
          message: `تم تحليل السيناريوهات لـ ${input.metric}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to analyze scenarios',
          data: null,
        };
      }
    }),

  /**
   * التنبؤ بالموضوعات الناشئة
   */
  forecastEmergingTopics: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const topics = predictionEngine.forecastEmergingTopics(input.days);
        
        return {
          success: true,
          data: {
            topics,
            total: topics.length,
            emerging: topics.filter(t => t.trend === 'emerging').length,
            declining: topics.filter(t => t.trend === 'declining').length,
          },
          message: `تم التنبؤ بـ ${topics.length} موضوع`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to forecast topics',
          data: null,
        };
      }
    }),

  /**
   * الحصول على البيانات التاريخية
   */
  getHistoricalData: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(90).default(30),
    }))
    .query(async ({ input }: any) => {
      try {
        const data = predictionEngine.getHistoricalData();
        const filtered = data.slice(-input.days);
        
        return {
          success: true,
          data: filtered,
          total: filtered.length,
          message: `تم استرجاع ${filtered.length} نقطة بيانات`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get historical data',
          data: null,
        };
      }
    }),

  /**
   * التنبؤ الشامل (جميع المؤشرات)
   */
  comprehensiveForecast: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
    }))
    .query(async (opts: any) => {
      const { input } = opts;
      try {
        const gmi = predictionEngine.forecastGMI(input.days);
        const cfi = predictionEngine.forecastCFI(input.days);
        const hri = predictionEngine.forecastHRI(input.days);
        const topics = predictionEngine.forecastEmergingTopics(input.days);
        
        return {
          success: true,
          data: {
            gmi,
            cfi,
            hri,
            topics,
            generatedAt: new Date(),
          },
          message: `تم إنشاء تنبؤ شامل لـ ${input.days} أيام`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create comprehensive forecast',
          data: null,
        };
      }
    }),

  /**
   * إضافة بيانات تاريخية جديدة
   */
  addHistoricalData: publicProcedure
    .input(z.object({
      data: z.array(z.object({
        date: z.date(),
        gmi: z.number().min(0).max(100),
        cfi: z.number().min(0).max(100),
        hri: z.number().min(0).max(100),
        emotions: z.object({
          joy: z.number().min(0).max(1),
          fear: z.number().min(0).max(1),
          anger: z.number().min(0).max(1),
          sadness: z.number().min(0).max(1),
          hope: z.number().min(0).max(1),
          curiosity: z.number().min(0).max(1),
        }),
        topic: z.string(),
        region: z.string(),
      })),
    }))
    .mutation(async (opts: any) => {
      const { input } = opts;
      try {
        const historicalData = input.data as HistoricalDataPoint[];
        predictionEngine.addHistoricalData(historicalData);
        
        return {
          success: true,
          message: `تم إضافة ${input.data.length} نقطة بيانات`,
          dataPoints: input.data.length,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add historical data',
        };
      }
    }),

  /**
   * مسح جميع البيانات
   */
  clearData: publicProcedure
    .mutation(async () => {
      try {
        predictionEngine.clearData();
        
        return {
          success: true,
          message: 'تم مسح جميع البيانات التاريخية',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to clear data',
        };
      }
    }),

  /**
   * الحصول على إحصائيات التنبؤ
   */
  getStatistics: publicProcedure
    .query(async () => {
      try {
        const data = predictionEngine.getHistoricalData();
        
        if (data.length === 0) {
          return {
            success: true,
            data: {
              totalDataPoints: 0,
              dateRange: null,
              averageGMI: 0,
              averageCFI: 0,
              averageHRI: 0,
            },
            message: 'لا توجد بيانات تاريخية',
          };
        }
        
        const gmiValues = data.map(d => d.gmi);
        const cfiValues = data.map(d => d.cfi);
        const hriValues = data.map(d => d.hri);
        
        const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        const min = (arr: number[]) => Math.min(...arr);
        const max = (arr: number[]) => Math.max(...arr);
        
        return {
          success: true,
          data: {
            totalDataPoints: data.length,
            dateRange: {
              from: data[0].date,
              to: data[data.length - 1].date,
            },
            gmi: {
              average: Math.round(average(gmiValues) * 100) / 100,
              min: min(gmiValues),
              max: max(gmiValues),
            },
            cfi: {
              average: Math.round(average(cfiValues) * 100) / 100,
              min: min(cfiValues),
              max: max(cfiValues),
            },
            hri: {
              average: Math.round(average(hriValues) * 100) / 100,
              min: min(hriValues),
              max: max(hriValues),
            },
          },
          message: 'تم حساب الإحصائيات بنجاح',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get statistics',
          data: null,
        };
      }
    }),
});

export type PredictionRouter = typeof predictionRouter;
