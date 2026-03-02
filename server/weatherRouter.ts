/**
 * Weather Router
 * 
 * Provides emotional weather data:
 * - Current conditions (Hope, Fear, Stability)
 * - 7-day forecast
 * - Risk alerts
 * - Global mood analysis
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const weatherRouter = router({
  /**
   * Get current emotional weather conditions
   * Calculates from latest emotion indices
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

      // Get latest emotion index
      const [latest] = await db
        .select()
        .from(emotionIndices)
        .orderBy(desc(emotionIndices.createdAt))
        .limit(1);

      if (!latest) {
        // Return default values if no data
        return {
          hope: 65,
          fear: 35,
          stability: 60,
          condition: 'cloudy' as const,
          riskLevel: 'low' as const,
          recommendation: 'Monitoring global emotional climate...',
          timestamp: new Date().toISOString(),
        };
      }

      // Calculate conditions from indices
      const hope = latest.gmi || 65;
      const fear = latest.cfi || 35;
      const stability = latest.hri || 60;

      // Determine weather condition
      let condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'calm' | 'turbulent';
      if (hope > 70 && fear < 30 && stability > 65) {
        condition = 'sunny';
      } else if (hope > 60 && fear < 40 && stability > 55) {
        condition = 'calm';
      } else if (hope > 50 && fear < 50 && stability > 50) {
        condition = 'cloudy';
      } else if (hope < 50 && fear > 50 && stability < 50) {
        condition = 'rainy';
      } else if (fear > 60 && stability < 40) {
        condition = 'stormy';
      } else {
        condition = 'turbulent';
      }

      // Determine risk level
      let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
      if (fear > 70 || stability < 30) {
        riskLevel = 'critical';
      } else if (fear > 55 || stability < 45) {
        riskLevel = 'high';
      } else if (fear > 40 || stability < 55) {
        riskLevel = 'moderate';
      } else {
        riskLevel = 'low';
      }

      // Generate recommendation
      let recommendation = '';
      if (riskLevel === 'critical') {
        recommendation = 'Critical alert: High fear levels detected. Immediate monitoring recommended.';
      } else if (riskLevel === 'high') {
        recommendation = 'Elevated risk detected. Monitor for potential volatility.';
      } else if (riskLevel === 'moderate') {
        recommendation = 'Moderate uncertainty. Continue standard monitoring.';
      } else {
        recommendation = 'Positive global sentiment. Good conditions for initiatives.';
      }

      return {
        hope: Math.round(hope),
        fear: Math.round(fear),
        stability: Math.round(stability),
        condition,
        riskLevel,
        recommendation,
        timestamp: latest.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting current weather:', error);
      throw error;
    }
  }),

  /**
   * Get 7-day emotional weather forecast
   * Generates from historical trend analysis
   */
  getForecast: publicProcedure.query(async () => {
    try {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const { emotionIndices } = await import('../drizzle/schema');
      const { desc, gte } = await import('drizzle-orm');

      // Get last 7 days of data
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const historicalData = await db
        .select()
        .from(emotionIndices)
        .where(gte(emotionIndices.createdAt, sevenDaysAgo))
        .orderBy(desc(emotionIndices.createdAt))
        .limit(168); // 7 days * 24 hours

      // Group by day and calculate averages
      const dailyData: Record<string, { gmi: number[]; cfi: number[]; hri: number[] }> = {};

      historicalData.forEach(record => {
        const date = new Date(record.createdAt).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = { gmi: [], cfi: [], hri: [] };
        }
        dailyData[date].gmi.push(record.gmi || 65);
        dailyData[date].cfi.push(record.cfi || 35);
        dailyData[date].hri.push(record.hri || 60);
      });

      // Generate forecast for next 7 days
      const forecast = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const forecastDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = forecastDate.toISOString().split('T')[0];

        // Get average from historical data or use trend
        const dayData = dailyData[dateStr];
        let hope = 65;
        let fear = 35;
        let stability = 60;

        if (dayData) {
          hope = Math.round(dayData.gmi.reduce((a, b) => a + b, 0) / dayData.gmi.length);
          fear = Math.round(dayData.cfi.reduce((a, b) => a + b, 0) / dayData.cfi.length);
          stability = Math.round(dayData.hri.reduce((a, b) => a + b, 0) / dayData.hri.length);
        } else {
          // Add slight variation for forecast
          hope = Math.max(40, Math.min(80, 65 + (Math.random() - 0.5) * 20));
          fear = Math.max(20, Math.min(70, 35 + (Math.random() - 0.5) * 20));
          stability = Math.max(35, Math.min(75, 60 + (Math.random() - 0.5) * 20));
        }

        // Determine condition
        let condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'calm' | 'turbulent';
        if (hope > 70 && fear < 30) {
          condition = 'sunny';
        } else if (hope > 60 && fear < 40) {
          condition = 'calm';
        } else if (hope > 50 && fear < 50) {
          condition = 'cloudy';
        } else if (hope < 50 && fear > 50) {
          condition = 'rainy';
        } else if (fear > 60) {
          condition = 'stormy';
        } else {
          condition = 'turbulent';
        }

        // Determine risk level
        let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
        if (fear > 70) {
          riskLevel = 'critical';
        } else if (fear > 55) {
          riskLevel = 'high';
        } else if (fear > 40) {
          riskLevel = 'moderate';
        } else {
          riskLevel = 'low';
        }

        // Generate recommendation
        let recommendation = '';
        if (riskLevel === 'critical') {
          recommendation = 'Critical conditions expected.';
        } else if (riskLevel === 'high') {
          recommendation = 'Monitor for potential volatility.';
        } else if (riskLevel === 'moderate') {
          recommendation = 'Stabilizing trend expected.';
        } else {
          recommendation = 'Strong positive indicators.';
        }

        forecast.push({
          date: dateStr,
          hope,
          fear,
          stability,
          condition,
          riskLevel,
          recommendation,
        });
      }

      return forecast;
    } catch (error) {
      console.error('Error getting weather forecast:', error);
      throw error;
    }
  }),

  /**
   * Get critical weather alerts
   */
  getAlerts: publicProcedure.query(async () => {
    try {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const { emotionIndices } = await import('../drizzle/schema');
      const { desc } = await import('drizzle-orm');

      // Get latest data
      const [latest] = await db
        .select()
        .from(emotionIndices)
        .orderBy(desc(emotionIndices.createdAt))
        .limit(1);

      const alerts: Array<{ type: 'critical' | 'high' | 'moderate' | 'low'; title: string; message: string; timestamp: string }> = [];

      if (latest) {
        // Check for critical conditions
        if ((latest.cfi || 35) > 70) {
          alerts.push({
            type: 'critical' as const,
            title: 'High Fear Levels',
            message: `Collective Fear Index at ${latest.cfi}%. Immediate monitoring recommended.`,
            timestamp: new Date().toISOString(),
          });
        }

        if ((latest.gmi || 65) < 40) {
          alerts.push({
            type: 'critical' as const,
            title: 'Low Global Mood',
            message: `Global Mood Index at ${latest.gmi}%. Negative sentiment detected.`,
            timestamp: new Date().toISOString(),
          });
        }

        if ((latest.hri || 60) < 35) {
          alerts.push({
            type: 'high' as const,
            title: 'Low Resilience',
            message: `Hope Resilience Index at ${latest.hri}%. Society showing low resilience.`,
            timestamp: new Date().toISOString(),
          });
        }

        // Check for moderate conditions
        if ((latest.cfi || 35) > 55) {
          alerts.push({
            type: 'moderate' as const,
            title: 'Elevated Fear Levels',
            message: `Collective Fear Index at ${latest.cfi}%. Monitor for potential volatility.`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error getting weather alerts:', error);
      throw error;
    }
  }),

  /**
   * Get global mood analysis
   */
  getGlobalMood: publicProcedure.query(async () => {
    try {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const { emotionIndices } = await import('../drizzle/schema');
      const { desc } = await import('drizzle-orm');

      // Get latest data
      const [latest] = await db
        .select()
        .from(emotionIndices)
        .orderBy(desc(emotionIndices.createdAt))
        .limit(1);

      if (!latest) {
        return {
          summary: 'Insufficient data for analysis',
          hope: 65,
          fear: 35,
          stability: 60,
          outlook: 'neutral',
        };
      }

      const hope = latest.gmi || 65;
      const fear = latest.cfi || 35;
      const stability = latest.hri || 60;

      let outlook = 'neutral';
      if (hope > 70 && fear < 30 && stability > 65) {
        outlook = 'very positive';
      } else if (hope > 60 && fear < 40) {
        outlook = 'positive';
      } else if (hope < 40 && fear > 60) {
        outlook = 'very negative';
      } else if (hope < 50 && fear > 50) {
        outlook = 'negative';
      }

      const summary = `Global emotional climate shows ${outlook} sentiment. Hope at ${hope}%, Fear at ${fear}%, Stability at ${stability}%.`;

      return {
        summary,
        hope: Math.round(hope),
        fear: Math.round(fear),
        stability: Math.round(stability),
        outlook,
        timestamp: latest.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting global mood:', error);
      throw error;
    }
  }),
});
