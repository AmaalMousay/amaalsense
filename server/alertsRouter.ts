import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';

/**
 * Alerts & Notifications Router
 * Handles alert creation, management, and notifications
 */

export const alertsRouter = router({
  /**
   * Create alert threshold
   */
  createAlert: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.enum(['gmi', 'cfi', 'hri', 'confidence']),
      threshold: z.number(),
      operator: z.enum(['>', '<', '>=', '<=', '==']),
      enabled: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return {
          success: true,
          alert: {
            id: Math.random().toString(36).substr(2, 9),
            ...input,
            createdAt: new Date(),
          },
        };
      } catch (error) {
        console.error('Error creating alert:', error);
        throw new Error('Failed to create alert');
      }
    }),

  /**
   * Get user alerts
   */
  getUserAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return [
          {
            id: '1',
            name: 'High Fear Index',
            type: 'cfi',
            threshold: 70,
            operator: '>',
            enabled: true,
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Low Hope Index',
            type: 'gmi',
            threshold: 30,
            operator: '<',
            enabled: true,
            createdAt: new Date(),
          },
        ];
      } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
    }),

  /**
   * Delete alert
   */
  deleteAlert: protectedProcedure
    .input(z.object({
      alertId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return { success: true };
      } catch (error) {
        console.error('Error deleting alert:', error);
        throw new Error('Failed to delete alert');
      }
    }),

  /**
   * Get alert history
   */
  getAlertHistory: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return [
          {
            id: '1',
            alertId: '1',
            type: 'triggered',
            message: 'Fear Index exceeded 70',
            value: 75,
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: '2',
            alertId: '2',
            type: 'triggered',
            message: 'Hope Index fell below 30',
            value: 28,
            timestamp: new Date(Date.now() - 7200000),
          },
        ];
      } catch (error) {
        console.error('Error fetching alert history:', error);
        return [];
      }
    }),

  /**
   * Check if current indices trigger alerts
   */
  checkAlerts: publicProcedure
    .input(z.object({
      gmi: z.number(),
      cfi: z.number(),
      hri: z.number(),
      confidence: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const triggeredAlerts = [];

        // Check GMI
        if (input.gmi < 30) {
          triggeredAlerts.push({
            type: 'gmi',
            message: 'Low Hope Index detected',
            value: input.gmi,
            severity: 'critical',
          });
        }

        // Check CFI
        if (input.cfi > 70) {
          triggeredAlerts.push({
            type: 'cfi',
            message: 'High Fear Index detected',
            value: input.cfi,
            severity: 'critical',
          });
        }

        // Check HRI
        if (input.hri < 40) {
          triggeredAlerts.push({
            type: 'hri',
            message: 'Low Resilience Index detected',
            value: input.hri,
            severity: 'high',
          });
        }

        // Check Confidence
        if (input.confidence < 50) {
          triggeredAlerts.push({
            type: 'confidence',
            message: 'Low Analysis Confidence',
            value: input.confidence,
            severity: 'medium',
          });
        }

        return triggeredAlerts;
      } catch (error) {
        console.error('Error checking alerts:', error);
        return [];
      }
    }),

  /**
   * Get alert statistics
   */
  getAlertStats: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return {
          totalAlerts: 2,
          enabledAlerts: 2,
          triggeredToday: 3,
          triggeredThisWeek: 12,
          mostTriggeredType: 'cfi',
          averageResponseTime: '2.5 hours',
        };
      } catch (error) {
        console.error('Error fetching alert stats:', error);
        return null;
      }
    }),
});
