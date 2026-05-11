/**
 * Advanced Prediction Router - tRPC Endpoints
 * 
 * نظام تنبؤ متقدم يوفر:
 * - تقارير تنبؤ شاملة لكل دولة
 * - تحليل اتجاهات متعدد الأبعاد
 * - كشف نقاط التحول
 * - مؤشرات مخاطر
 * - تنبؤات بالذكاء الاصطناعي
 * - حلقة تعلم (Feedback Loop)
 */
import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import {
  generatePredictionReport,
  generateGlobalPredictionReport,
  analyzeTrend,
  detectTippingPoints,
  calculateRiskScore,
  type EmotionalDataPoint,
} from './predictionEngine';
import {
  getCountryHistoricalIndices,
  getAllCountriesHistoricalIndices,
  getEmotionIndicesHistory,
  getDb,
} from './db';
import { predictions } from '../drizzle/schema';
import { desc, eq } from 'drizzle-orm';

/**
 * Convert DB country indices to EmotionalDataPoint format
 */
function toDataPoints(records: Array<{
  gmi: number; cfi: number; hri: number;
  analyzedAt: Date; confidence?: number | null;
  countryCode?: string;
}>): EmotionalDataPoint[] {
  return records.map(r => ({
    timestamp: r.analyzedAt.getTime(),
    gmi: r.gmi,
    cfi: r.cfi,
    hri: r.hri,
    confidence: r.confidence ?? 75,
    countryCode: r.countryCode,
  }));
}

export const predictionRouter = router({
  /**
   * Get full prediction report for a specific country
   * تقرير تنبؤ شامل لدولة محددة
   */
  getCountryPrediction: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2),
      countryName: z.string().optional(),
      hoursBack: z.number().min(6).max(720).default(72),
      includeAI: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      const history = await getCountryHistoricalIndices(input.countryCode, input.hoursBack);
      
      if (history.length < 3) {
        // Try to get global data as fallback
        const globalHistory = await getEmotionIndicesHistory(input.hoursBack);
        const data = toDataPoints(globalHistory.length >= 3 ? globalHistory : []);
        
        if (data.length < 3) {
          return {
            success: false,
            message: 'بيانات غير كافية للتنبؤ. يرجى تحليل المزيد من البيانات أولاً.',
            messageEn: 'Insufficient data for prediction. Please analyze more data first.',
            data: null,
          };
        }
        
        const report = await generatePredictionReport(
          input.countryCode,
          input.countryName || input.countryCode,
          data,
          input.includeAI
        );
        
        return { success: true, data: report, dataSource: 'global_fallback' };
      }
      
      const data = toDataPoints(history);
      const report = await generatePredictionReport(
        input.countryCode,
        input.countryName || (history[0] as any)?.countryName || input.countryCode,
        data,
        input.includeAI
      );
      
      // Save prediction to database
      try {
        const db = await getDb();
        if (db && report.predictions.length > 0) {
          const pred24h = report.predictions.find(p => p.timeframe === '24h');
          if (pred24h) {
            await db.insert(predictions).values({
              countryCode: input.countryCode,
              countryName: report.countryName,
              timeframe: '24h',
              predictedGmi: pred24h.predictedGMI,
              predictedCfi: pred24h.predictedCFI,
              predictedHri: pred24h.predictedHRI,
              predictedEmotion: pred24h.predictedDominantEmotion,
              confidence: pred24h.confidence,
              scenarioName: pred24h.scenarioName,
              riskScore: report.overallRisk.overall,
              riskLevel: report.overallRisk.level,
              predictionData: JSON.stringify(report),
              aiInterpretation: report.aiInterpretation,
              aiInterpretationAr: report.aiInterpretationAr,
              predictedFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
          }
        }
      } catch (e) {
        console.error('[Prediction] Failed to save prediction:', e);
      }
      
      return { success: true, data: report, dataSource: 'country_specific' };
    }),

  /**
   * Get global prediction overview (all countries with data)
   * نظرة عامة على التنبؤات العالمية
   */
  getGlobalPrediction: publicProcedure
    .input(z.object({
      hoursBack: z.number().min(6).max(720).default(72),
    }))
    .query(async ({ input }) => {
      const allHistory = await getAllCountriesHistoricalIndices(input.hoursBack);
      
      // Group by country
      const countriesMap = new Map<string, { name: string; data: EmotionalDataPoint[] }>();
      
      for (const record of allHistory) {
        const code = record.countryCode;
        if (!countriesMap.has(code)) {
          countriesMap.set(code, { name: record.countryName, data: [] });
        }
        countriesMap.get(code)!.data.push({
          timestamp: record.analyzedAt.getTime(),
          gmi: record.gmi,
          cfi: record.cfi,
          hri: record.hri,
          confidence: record.confidence ?? 75,
          countryCode: code,
        });
      }
      
      if (countriesMap.size === 0) {
        // Fallback to global indices
        const globalHistory = await getEmotionIndicesHistory(input.hoursBack);
        if (globalHistory.length >= 3) {
          countriesMap.set('GL', {
            name: 'Global',
            data: toDataPoints(globalHistory),
          });
        }
      }
      
      const report = await generateGlobalPredictionReport(countriesMap, false);
      
      return {
        success: true,
        data: report,
        countriesAnalyzed: countriesMap.size,
      };
    }),

  /**
   * Get trend analysis for a specific index
   * تحليل اتجاه لمؤشر محدد
   */
  getTrends: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional(),
      hoursBack: z.number().min(6).max(720).default(48),
    }))
    .query(async ({ input }) => {
      let data: EmotionalDataPoint[];
      
      if (input.countryCode) {
        const history = await getCountryHistoricalIndices(input.countryCode, input.hoursBack);
        data = toDataPoints(history);
      } else {
        const history = await getEmotionIndicesHistory(input.hoursBack);
        data = toDataPoints(history);
      }
      
      if (data.length < 3) {
        return {
          success: false,
          message: 'بيانات غير كافية لتحليل الاتجاهات',
          data: null,
        };
      }
      
      const gmiValues = data.map(d => d.gmi);
      const cfiValues = data.map(d => d.cfi);
      const hriValues = data.map(d => d.hri);
      
      return {
        success: true,
        data: {
          gmi: analyzeTrend(gmiValues),
          cfi: analyzeTrend(cfiValues),
          hri: analyzeTrend(hriValues),
          dataPoints: data.length,
          timeRange: {
            from: new Date(data[0].timestamp),
            to: new Date(data[data.length - 1].timestamp),
          },
        },
      };
    }),

  /**
   * Get tipping point alerts
   * تنبيهات نقاط التحول
   */
  getTippingPoints: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional(),
      hoursBack: z.number().min(6).max(720).default(48),
    }))
    .query(async ({ input }) => {
      let data: EmotionalDataPoint[];
      
      if (input.countryCode) {
        const history = await getCountryHistoricalIndices(input.countryCode, input.hoursBack);
        data = toDataPoints(history);
      } else {
        const history = await getEmotionIndicesHistory(input.hoursBack);
        data = toDataPoints(history);
      }
      
      if (data.length < 3) {
        return {
          success: true,
          data: [],
          message: 'بيانات غير كافية لكشف نقاط التحول',
        };
      }
      
      const gmiValues = data.map(d => d.gmi);
      const cfiValues = data.map(d => d.cfi);
      const hriValues = data.map(d => d.hri);
      
      const trends = {
        gmi: analyzeTrend(gmiValues),
        cfi: analyzeTrend(cfiValues),
        hri: analyzeTrend(hriValues),
      };
      
      const tippingPoints = detectTippingPoints(data, trends);
      
      return {
        success: true,
        data: tippingPoints,
        dataPoints: data.length,
      };
    }),

  /**
   * Get risk score for a country or globally
   * مؤشر المخاطر
   */
  getRiskScore: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional(),
      hoursBack: z.number().min(6).max(720).default(48),
    }))
    .query(async ({ input }) => {
      let data: EmotionalDataPoint[];
      
      if (input.countryCode) {
        const history = await getCountryHistoricalIndices(input.countryCode, input.hoursBack);
        data = toDataPoints(history);
      } else {
        const history = await getEmotionIndicesHistory(input.hoursBack);
        data = toDataPoints(history);
      }
      
      if (data.length < 2) {
        return {
          success: true,
          data: {
            overall: 0,
            components: {
              emotionalInstability: 0,
              fearEscalation: 0,
              hopeDegradation: 0,
              moodDeterioration: 0,
              volatility: 0,
              trendDivergence: 0,
            },
            level: 'low' as const,
            factors: ['بيانات غير كافية'],
            factorsAr: ['بيانات غير كافية'],
          },
        };
      }
      
      const gmiValues = data.map(d => d.gmi);
      const cfiValues = data.map(d => d.cfi);
      const hriValues = data.map(d => d.hri);
      
      const trends = {
        gmi: analyzeTrend(gmiValues),
        cfi: analyzeTrend(cfiValues),
        hri: analyzeTrend(hriValues),
      };
      
      const riskScore = calculateRiskScore(data, trends);
      
      return { success: true, data: riskScore };
    }),

  /**
   * Get prediction history from database
   * سجل التنبؤات السابقة
   */
  getPredictionHistory: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2).optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, data: [], message: 'Database unavailable' };
      
      try {
        const conditions = input.countryCode
          ? eq(predictions.countryCode, input.countryCode)
          : undefined;
        
        const results = await db
          .select({
            id: predictions.id,
            countryCode: predictions.countryCode,
            countryName: predictions.countryName,
            timeframe: predictions.timeframe,
            predictedGmi: predictions.predictedGmi,
            predictedCfi: predictions.predictedCfi,
            predictedHri: predictions.predictedHri,
            predictedEmotion: predictions.predictedEmotion,
            confidence: predictions.confidence,
            scenarioName: predictions.scenarioName,
            riskScore: predictions.riskScore,
            riskLevel: predictions.riskLevel,
            verified: predictions.verified,
            actualGmi: predictions.actualGmi,
            actualCfi: predictions.actualCfi,
            actualHri: predictions.actualHri,
            accuracyScore: predictions.accuracyScore,
            predictedFor: predictions.predictedFor,
            createdAt: predictions.createdAt,
          })
          .from(predictions)
          .where(conditions)
          .orderBy(desc(predictions.createdAt))
          .limit(input.limit);
        
        return { success: true, data: results };
      } catch (e) {
        console.error('[Prediction] Failed to get history:', e);
        return { success: false, data: [], message: 'Failed to fetch prediction history' };
      }
    }),

  /**
   * Verify a prediction against actual data (feedback loop)
   * التحقق من تنبؤ مقابل البيانات الفعلية
   */
  verifyPrediction: protectedProcedure
    .input(z.object({
      predictionId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: 'Database unavailable' };
      
      try {
        const [pred] = await db
          .select()
          .from(predictions)
          .where(eq(predictions.id, input.predictionId))
          .limit(1);
        
        if (!pred) return { success: false, message: 'Prediction not found' };
        
        const actualHistory = await getCountryHistoricalIndices(pred.countryCode, 24);
        
        if (actualHistory.length === 0) {
          return { success: false, message: 'No actual data available yet for verification' };
        }
        
        const predTime = pred.predictedFor.getTime();
        let closest = actualHistory[0];
        let minDiff = Math.abs(closest.analyzedAt.getTime() - predTime);
        
        for (const h of actualHistory) {
          const diff = Math.abs(h.analyzedAt.getTime() - predTime);
          if (diff < minDiff) {
            minDiff = diff;
            closest = h;
          }
        }
        
        const gmiError = Math.abs(pred.predictedGmi - closest.gmi);
        const cfiError = Math.abs(pred.predictedCfi - closest.cfi);
        const hriError = Math.abs(pred.predictedHri - closest.hri);
        
        const avgError = (gmiError / 200 + cfiError / 100 + hriError / 100) / 3 * 100;
        const accuracyScore = Math.max(0, Math.min(100, 100 - avgError));
        
        await db.update(predictions)
          .set({
            verified: true,
            actualGmi: closest.gmi,
            actualCfi: closest.cfi,
            actualHri: closest.hri,
            accuracyScore,
          })
          .where(eq(predictions.id, input.predictionId));
        
        return {
          success: true,
          data: {
            predicted: { gmi: pred.predictedGmi, cfi: pred.predictedCfi, hri: pred.predictedHri },
            actual: { gmi: closest.gmi, cfi: closest.cfi, hri: closest.hri },
            accuracyScore,
            feedback: accuracyScore >= 70 
              ? 'تنبؤ دقيق! النموذج يتحسن.' 
              : accuracyScore >= 40 
                ? 'تنبؤ متوسط الدقة. يحتاج تحسين.'
                : 'تنبؤ غير دقيق. النظام يتعلم من هذا الخطأ.',
          },
        };
      } catch (e) {
        console.error('[Prediction] Verification failed:', e);
        return { success: false, message: 'Verification failed' };
      }
    }),

  /**
   * Get prediction accuracy statistics
   * إحصائيات دقة التنبؤ
   */
  getAccuracyStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { success: false, data: null };
    
    try {
      const verified = await db
        .select()
        .from(predictions)
        .where(eq(predictions.verified, true))
        .orderBy(desc(predictions.createdAt))
        .limit(100);
      
      if (verified.length === 0) {
        return {
          success: true,
          data: {
            totalPredictions: 0,
            verifiedPredictions: 0,
            averageAccuracy: 0,
            accuracyTrend: 'insufficient_data',
          },
        };
      }
      
      const scores = verified.map(v => v.accuracyScore ?? 0);
      const avgAccuracy = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      const recent = scores.slice(0, Math.min(10, scores.length));
      const older = scores.slice(Math.min(10, scores.length));
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
      
      const totalPreds = await db.select().from(predictions).limit(1000);
      
      return {
        success: true,
        data: {
          totalPredictions: totalPreds.length,
          verifiedPredictions: verified.length,
          averageAccuracy: Math.round(avgAccuracy * 10) / 10,
          accuracyTrend: recentAvg > olderAvg + 5 ? 'improving' : recentAvg < olderAvg - 5 ? 'declining' : 'stable',
          recentAccuracy: Math.round(recentAvg * 10) / 10,
        },
      };
    } catch (e) {
      console.error('[Prediction] Failed to get accuracy stats:', e);
      return { success: false, data: null };
    }
  }),
});

export type PredictionRouter = typeof predictionRouter;
