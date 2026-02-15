/**
 * Dashboard Router - tRPC endpoints for health monitoring
 */

import { publicProcedure, router } from './_core/trpc';
import { healthDashboard } from './healthDashboard';
import { feedbackManager } from './feedbackLoop';
import { analysisCache, predictionCache, userCache, generalCache } from './simpleCache';

export const dashboardRouter = router({
  /**
   * Get complete health report
   */
  getHealth: publicProcedure.query(() => {
    return healthDashboard.getHealthReport();
  }),

  /**
   * Get health summary
   */
  getHealthSummary: publicProcedure.query(() => {
    return healthDashboard.getSummary();
  }),

  /**
   * Get health metrics
   */
  getMetrics: publicProcedure.query(() => {
    return healthDashboard.getMetrics();
  }),

  /**
   * Get alerts
   */
  getAlerts: publicProcedure.query(() => {
    return healthDashboard.getAlerts();
  }),

  /**
   * Get cache statistics
   */
  getCacheStats: publicProcedure.query(() => {
    return {
      analysis: analysisCache.getStats(),
      prediction: predictionCache.getStats(),
      user: userCache.getStats(),
      general: generalCache.getStats(),
    };
  }),

  /**
   * Get feedback statistics
   */
  getFeedbackStats: publicProcedure.query(() => {
    return feedbackManager.getStats();
  }),

  /**
   * Get improvement areas
   */
  getImprovementAreas: publicProcedure.query(() => {
    return feedbackManager.getImprovementAreas();
  }),

  /**
   * Get common errors
   */
  getCommonErrors: publicProcedure.query(() => {
    return feedbackManager.getCommonErrors(10);
  }),

  /**
   * Get system overview
   */
  getSystemOverview: publicProcedure.query(() => {
    const health = healthDashboard.getHealthReport();
    const feedbackStats = feedbackManager.getStats();
    const cacheStats = {
      analysis: analysisCache.getStats(),
      prediction: predictionCache.getStats(),
      user: userCache.getStats(),
      general: generalCache.getStats(),
    };

    return {
      health,
      feedback: feedbackStats,
      cache: cacheStats,
      timestamp: Date.now(),
    };
  }),

  /**
   * Get performance trends
   */
  getPerformanceTrends: publicProcedure.query(() => {
    const health = healthDashboard.getHealthReport();
    
    return {
      responseTime: {
        current: health.performance.avgResponseTime,
        unit: 'ms',
        trend: 'stable',
      },
      errorRate: {
        current: health.performance.errorRate,
        unit: '%',
        trend: 'stable',
      },
      requestsPerSecond: {
        current: health.performance.requestsPerSecond,
        unit: 'req/s',
        trend: 'stable',
      },
      cacheHitRate: {
        current:
          (health.cache.analysisHitRate +
            health.cache.predictionHitRate +
            health.cache.userHitRate +
            health.cache.generalHitRate) /
          4,
        unit: '%',
        trend: 'improving',
      },
    };
  }),

  /**
   * Get API status
   */
  getApiStatus: publicProcedure.query(() => {
    const health = healthDashboard.getHealthReport();
    
    return {
      groq: {
        status: health.apis.groqStatus,
        lastChecked: health.timestamp,
      },
      newsApi: {
        status: health.apis.newsApiStatus,
        lastChecked: health.timestamp,
      },
      weatherApi: {
        status: health.apis.weatherApiStatus,
        lastChecked: health.timestamp,
      },
    };
  }),

  /**
   * Get database status
   */
  getDatabaseStatus: publicProcedure.query(() => {
    const health = healthDashboard.getHealthReport();
    
    return {
      connectionPoolSize: health.database.connectionPoolSize,
      activeConnections: health.database.activeConnections,
      queryLatency: health.database.queryLatency,
      status: health.database.activeConnections > 0 ? 'connected' : 'idle',
    };
  }),

  /**
   * Get system resources
   */
  getSystemResources: publicProcedure.query(() => {
    const health = healthDashboard.getHealthReport();
    
    return {
      cpu: {
        usage: health.system.cpuUsage,
        unit: '%',
        status: health.system.cpuUsage > 80 ? 'warning' : 'normal',
      },
      memory: {
        usage: health.system.memoryUsage,
        unit: '%',
        status: health.system.memoryUsage > 80 ? 'warning' : 'normal',
      },
      disk: {
        usage: health.system.diskUsage,
        unit: '%',
        status: health.system.diskUsage > 80 ? 'warning' : 'normal',
      },
    };
  }),

  /**
   * Get user analytics
   */
  getUserAnalytics: publicProcedure.query(() => {
    const feedbackStats = feedbackManager.getStats();
    
    return {
      totalFeedback: feedbackStats.totalFeedback,
      averageRating: feedbackStats.averageRating,
      accuracyRate: feedbackStats.accuracyRate,
      topTopics: Object.entries(feedbackStats.byTopic)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([topic, stats]) => ({
          topic,
          count: stats.count,
          accuracy: stats.avgRating,
        })),
    };
  }),

  /**
   * Clear alerts
   */
  clearAlerts: publicProcedure.mutation(() => {
    healthDashboard.clearAlerts();
    return { success: true };
  }),

  /**
   * Reset metrics
   */
  resetMetrics: publicProcedure.mutation(() => {
    healthDashboard.reset();
    return { success: true };
  }),
});

export type DashboardRouter = typeof dashboardRouter;
