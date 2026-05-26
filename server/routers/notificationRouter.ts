/**
 * NOTIFICATION ROUTER - tRPC PROCEDURES
 * 
 *  tRPC  
 * -   
 * -    
 * -   
 */

import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { notificationSystem, AlertThreshold } from '../engines/notificationSystem';

export const notificationRouter = router({
  /**
   * Subscribe to alerts
   */
  subscribe: protectedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        frequency: z.enum(['daily', 'weekly', 'realtime']).optional(),
        types: z.array(z.enum(['report', 'alert', 'digest'])).optional(),
        country: z.string().optional(),
        topic: z.string().optional(),
        thresholds: z.object({
          gmiChange: z.number().min(0).max(100).optional(),
          cfiChange: z.number().min(0).max(100).optional(),
          hriChange: z.number().min(0).max(100).optional(),
          emotionShift: z.number().min(0).max(100).optional(),
          eventImpact: z.number().min(0).max(100).optional()
        }).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        notificationSystem.subscribe(
          String(ctx.user.id),
          input.thresholds,
          input.country,
          input.topic
        );

        return {
          success: true,
          // [cleaned Arabic string]
        };
      } catch (error) {
        console.error('[notificationRouter] Subscribe error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Unsubscribe from alerts
   */
  unsubscribe: protectedProcedure
    .input(z.object({ email: z.string().email().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        notificationSystem.unsubscribe(String(ctx.user.id));

        return {
          success: true,
          // [cleaned Arabic string]
        };
      } catch (error) {
        console.error('[notificationRouter] Unsubscribe error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Get alert history
   */
  getAlertHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50)
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const alerts = notificationSystem.getAlertHistory(String(ctx.user.id), input.limit);

        return {
          success: true,
          data: alerts,
          count: alerts.length
        };
      } catch (error) {
        console.error('[notificationRouter] Get alert history error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Get current thresholds
   */
  getThresholds: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const thresholds = notificationSystem.getSubscriberThresholds(String(ctx.user.id));

        return {
          success: true,
          data: thresholds || {
            gmiChange: 5,
            cfiChange: 5,
            hriChange: 5,
            emotionShift: 10,
            eventImpact: 70
          }
        };
      } catch (error) {
        console.error('[notificationRouter] Get thresholds error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Update thresholds
   */
  updateThresholds: protectedProcedure
    .input(
      z.object({
        gmiChange: z.number().min(0).max(100).optional(),
        cfiChange: z.number().min(0).max(100).optional(),
        hriChange: z.number().min(0).max(100).optional(),
        emotionShift: z.number().min(0).max(100).optional(),
        eventImpact: z.number().min(0).max(100).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const success = notificationSystem.updateSubscriberThresholds(String(ctx.user.id), input);

        if (!success) {
          throw new Error("translated");
        }

        return {
          success: true,
          // [cleaned Arabic string]
        };
      } catch (error) {
        console.error('[notificationRouter] Update thresholds error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Clear alert history
   */
  clearAlertHistory: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        notificationSystem.clearAlertHistory(String(ctx.user.id));

        return {
          success: true,
          message: "translated"
        };
      } catch (error) {
        console.error('[notificationRouter] Clear alert history error:', error);
        throw new Error("translated");
      }
    }),

  /**
   * Get active subscribers count (admin only)
   */
  getActiveSubscribersCount: publicProcedure
    .query(async () => {
      try {
        const count = notificationSystem.getActiveSubscribersCount();

        return {
          success: true,
          data: {
            activeSubscribers: count
          }
        };
      } catch (error) {
        console.error('[notificationRouter] Get active subscribers count error:', error);
        throw new Error("translated");
      }
    })
});
