/**
 * NOTIFICATION ROUTER - tRPC PROCEDURES
 * 
 * إجراءات tRPC لنظام التنبيهات
 * - الاشتراك في التنبيهات
 * - الحصول على سجل التنبيهات
 * - تحديث إعدادات التنبيهات
 */

import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import { notificationSystem, AlertThreshold } from './notificationSystem';

export const notificationRouter = router({
  /**
   * Subscribe to alerts
   */
  subscribe: protectedProcedure
    .input(
      z.object({
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
          ctx.user.id,
          input.thresholds,
          input.country,
          input.topic
        );

        return {
          success: true,
          message: 'تم الاشتراك في التنبيهات بنجاح'
        };
      } catch (error) {
        console.error('[notificationRouter] Subscribe error:', error);
        throw new Error('فشل الاشتراك في التنبيهات');
      }
    }),

  /**
   * Unsubscribe from alerts
   */
  unsubscribe: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        notificationSystem.unsubscribe(ctx.user.id);

        return {
          success: true,
          message: 'تم إلغاء الاشتراك من التنبيهات بنجاح'
        };
      } catch (error) {
        console.error('[notificationRouter] Unsubscribe error:', error);
        throw new Error('فشل إلغاء الاشتراك من التنبيهات');
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
        const alerts = notificationSystem.getAlertHistory(ctx.user.id, input.limit);

        return {
          success: true,
          data: alerts,
          count: alerts.length
        };
      } catch (error) {
        console.error('[notificationRouter] Get alert history error:', error);
        throw new Error('فشل الحصول على سجل التنبيهات');
      }
    }),

  /**
   * Get current thresholds
   */
  getThresholds: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const thresholds = notificationSystem.getSubscriberThresholds(ctx.user.id);

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
        throw new Error('فشل الحصول على إعدادات التنبيهات');
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
        const success = notificationSystem.updateSubscriberThresholds(ctx.user.id, input);

        if (!success) {
          throw new Error('المستخدم غير مشترك في التنبيهات');
        }

        return {
          success: true,
          message: 'تم تحديث إعدادات التنبيهات بنجاح'
        };
      } catch (error) {
        console.error('[notificationRouter] Update thresholds error:', error);
        throw new Error('فشل تحديث إعدادات التنبيهات');
      }
    }),

  /**
   * Clear alert history
   */
  clearAlertHistory: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        notificationSystem.clearAlertHistory(ctx.user.id);

        return {
          success: true,
          message: 'تم مسح سجل التنبيهات بنجاح'
        };
      } catch (error) {
        console.error('[notificationRouter] Clear alert history error:', error);
        throw new Error('فشل مسح سجل التنبيهات');
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
        throw new Error('فشل الحصول على عدد المشتركين النشطين');
      }
    })
});
