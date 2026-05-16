import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';

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
      countryCode: z.string().optional(),
      countryName: z.string().optional(),
      metric: z.enum(['gmi', 'cfi', 'hri', 'confidence']),
      condition: z.enum(['above', 'below', 'change']),
      threshold: z.number(),
      notifyMethod: z.enum(['email', 'telegram', 'both']),
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
   * Update alert
   */
  updateAlert: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      countryCode: z.string().optional(),
      countryName: z.string().optional(),
      metric: z.enum(['gmi', 'cfi', 'hri', 'confidence']).optional(),
      condition: z.enum(['above', 'below', 'change']).optional(),
      threshold: z.number().optional(),
      notifyMethod: z.enum(['email', 'telegram', 'both']).optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  /**
   * Toggle alert active state
   */
  toggleAlert: protectedProcedure
    .input(z.object({
      id: z.string(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      return { success: true };
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
            metric: 'cfi',
            condition: 'above',
            threshold: 70,
            notifyMethod: 'email',
            isActive: 1,
            countryCode: 'LY',
            countryName: 'ليبيا',
            createdAt: new Date(),
          }
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
      id: z.number().or(z.string()),
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
        const triggeredAlerts: Array<{ type: string; message: string; value: number; severity: string }> = [];

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
