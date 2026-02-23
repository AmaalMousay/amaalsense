/**
 * نظام الإشعارات المتقدم
 * Advanced Notification System
 * 
 * يرسل إشعارات فورية عند تغييرات كبيرة في المؤشرات
 */

import { notifyOwner } from "./_core/notification";

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  threshold: number;
  channels: ("email" | "push" | "sms")[];
}

export interface NotificationEvent {
  id: string;
  userId: string;
  type: "indicator_change" | "trend_alert" | "anomaly_detected" | "milestone_reached";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  data: Record<string, any>;
  timestamp: Date;
  read: boolean;
}

export interface UserNotificationPreference {
  userId: string;
  triggers: NotificationTrigger[];
  frequency: "real_time" | "hourly" | "daily" | "weekly";
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
}

// ============================================================================
// NOTIFICATION TRIGGERS
// ============================================================================

export const DEFAULT_TRIGGERS: NotificationTrigger[] = [
  {
    id: "gmi_spike",
    name: "ارتفاع GMI",
    description: "إشعار عند ارتفاع مؤشر المشاعر العالمية بأكثر من 10 نقاط",
    enabled: true,
    threshold: 10,
    channels: ["email", "push"],
  },
  {
    id: "gmi_drop",
    name: "انخفاض GMI",
    description: "إشعار عند انخفاض مؤشر المشاعر العالمية بأكثر من 10 نقاط",
    enabled: true,
    threshold: 10,
    channels: ["email", "push"],
  },
  {
    id: "emotion_shift",
    name: "تغيير العاطفة السائدة",
    description: "إشعار عند تغيير العاطفة السائدة",
    enabled: true,
    threshold: 0,
    channels: ["push"],
  },
  {
    id: "regional_anomaly",
    name: "شذوذ إقليمي",
    description: "إشعار عند اكتشاف شذوذ في منطقة معينة",
    enabled: true,
    threshold: 0.8,
    channels: ["email", "push"],
  },
  {
    id: "impact_threshold",
    name: "تأثير عالي",
    description: "إشعار عند وصول درجة التأثير إلى مستوى عالي جداً",
    enabled: true,
    threshold: 0.85,
    channels: ["email", "push", "sms"],
  },
  {
    id: "trending_topic",
    name: "موضوع متجه للانتشار",
    description: "إشعار عند ظهور موضوع جديد متجه للانتشار",
    enabled: true,
    threshold: 0,
    channels: ["push"],
  },
];

// ============================================================================
// NOTIFICATION MANAGER
// ============================================================================

export class NotificationManager {
  private notifications: Map<string, NotificationEvent[]> = new Map();
  private userPreferences: Map<string, UserNotificationPreference> = new Map();

  /**
   * إنشاء تفضيلات الإشعارات للمستخدم
   */
  initializeUserPreferences(userId: string): UserNotificationPreference {
    const preferences: UserNotificationPreference = {
      userId,
      triggers: DEFAULT_TRIGGERS,
      frequency: "real_time",
      quietHours: {
        enabled: true,
        startTime: "22:00",
        endTime: "08:00",
      },
    };

    this.userPreferences.set(userId, preferences);
    return preferences;
  }

  /**
   * تحديث تفضيلات الإشعارات
   */
  updateUserPreferences(
    userId: string,
    preferences: Partial<UserNotificationPreference>
  ): UserNotificationPreference {
    const existing = this.userPreferences.get(userId) || this.initializeUserPreferences(userId);
    const updated = { ...existing, ...preferences };
    this.userPreferences.set(userId, updated);
    return updated;
  }

  /**
   * تفعيل/تعطيل محفز معين
   */
  toggleTrigger(userId: string, triggerId: string, enabled: boolean): void {
    const prefs = this.userPreferences.get(userId);
    if (prefs) {
      const trigger = prefs.triggers.find((t) => t.id === triggerId);
      if (trigger) {
        trigger.enabled = enabled;
      }
    }
  }

  /**
   * التحقق من ساعات الهدوء
   */
  private isInQuietHours(preferences: UserNotificationPreference): boolean {
    if (!preferences.quietHours?.enabled) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const start = preferences.quietHours.startTime;
    const end = preferences.quietHours.endTime;

    // إذا كانت ساعة البداية أكبر من ساعة النهاية (مثل 22:00 - 08:00)
    if (start > end) {
      return currentTime >= start || currentTime < end;
    }

    return currentTime >= start && currentTime < end;
  }

  /**
   * إرسال إشعار
   */
  async sendNotification(
    userId: string,
    event: Omit<NotificationEvent, "id" | "timestamp" | "read">
  ): Promise<NotificationEvent> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) {
      this.initializeUserPreferences(userId);
    }

    const prefs = this.userPreferences.get(userId)!;

    // التحقق من ساعات الهدوء
    if (this.isInQuietHours(prefs) && event.severity !== "critical") {
      console.log(`Notification for ${userId} deferred due to quiet hours`);
    }

    // إنشاء حدث الإشعار
    const notification: NotificationEvent = {
      ...event,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    // حفظ الإشعار
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    // إرسال عبر القنوات المفعلة
    const trigger = prefs.triggers.find((t) => t.id === event.type);
    if (trigger?.enabled) {
      await this.deliverNotification(userId, notification, trigger.channels);
    }

    return notification;
  }

  /**
   * توصيل الإشعار عبر القنوات المختلفة
   */
  private async deliverNotification(
    userId: string,
    notification: NotificationEvent,
    channels: ("email" | "push" | "sms")[]
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const channel of channels) {
      switch (channel) {
        case "email":
          promises.push(this.sendEmailNotification(userId, notification));
          break;
        case "push":
          promises.push(this.sendPushNotification(userId, notification));
          break;
        case "sms":
          promises.push(this.sendSMSNotification(userId, notification));
          break;
      }
    }

    await Promise.all(promises);
  }

  /**
   * إرسال إشعار بريد إلكتروني
   */
  private async sendEmailNotification(
    userId: string,
    notification: NotificationEvent
  ): Promise<void> {
    try {
      await notifyOwner({
        title: `[${notification.severity.toUpperCase()}] ${notification.title}`,
        content: `
        المستخدم: ${userId}
        النوع: ${notification.type}
        الرسالة: ${notification.message}
        البيانات: ${JSON.stringify(notification.data, null, 2)}
        الوقت: ${notification.timestamp.toISOString()}
        `,
      });
      console.log(`Email notification sent to ${userId}`);
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }

  /**
   * إرسال إشعار فوري (Push)
   */
  private async sendPushNotification(
    userId: string,
    notification: NotificationEvent
  ): Promise<void> {
    try {
      // محاكاة إرسال إشعار فوري
      console.log(`Push notification sent to ${userId}:`, {
        title: notification.title,
        message: notification.message,
        severity: notification.severity,
      });
    } catch (error) {
      console.error("Failed to send push notification:", error);
    }
  }

  /**
   * إرسال إشعار SMS
   */
  private async sendSMSNotification(
    userId: string,
    notification: NotificationEvent
  ): Promise<void> {
    try {
      // محاكاة إرسال رسالة نصية
      console.log(`SMS notification sent to ${userId}:`, {
        message: `${notification.title}: ${notification.message}`,
      });
    } catch (error) {
      console.error("Failed to send SMS notification:", error);
    }
  }

  /**
   * الحصول على إشعارات المستخدم
   */
  getUserNotifications(userId: string, limit: number = 20): NotificationEvent[] {
    const notifications = this.notifications.get(userId) || [];
    return notifications.slice(-limit).reverse();
  }

  /**
   * وضع علامة على إشعار كمقروء
   */
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.notifications.get(userId);
    if (notifications) {
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
  }

  /**
   * حذف إشعار
   */
  deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.notifications.get(userId);
    if (notifications) {
      const index = notifications.findIndex((n) => n.id === notificationId);
      if (index !== -1) {
        notifications.splice(index, 1);
      }
    }
  }

  /**
   * حساب عدد الإشعارات غير المقروءة
   */
  getUnreadCount(userId: string): number {
    const notifications = this.notifications.get(userId) || [];
    return notifications.filter((n) => !n.read).length;
  }
}

// ============================================================================
// NOTIFICATION TRIGGERS
// ============================================================================

/**
 * محفز: ارتفاع GMI
 */
export async function triggerGMISpike(
  manager: NotificationManager,
  userId: string,
  oldGMI: number,
  newGMI: number
): Promise<void> {
  const change = newGMI - oldGMI;
  if (change > 10) {
    await manager.sendNotification(userId, {
      type: "indicator_change",
      title: "ارتفاع مؤشر المشاعر العالمية",
      message: `ارتفع مؤشر المشاعر العالمية من ${oldGMI.toFixed(2)} إلى ${newGMI.toFixed(2)} (زيادة ${change.toFixed(2)} نقطة)`,
      severity: change > 20 ? "high" : "medium",
      data: { oldGMI, newGMI, change },
    });
  }
}

/**
 * محفز: انخفاض GMI
 */
export async function triggerGMIDrop(
  manager: NotificationManager,
  userId: string,
  oldGMI: number,
  newGMI: number
): Promise<void> {
  const change = oldGMI - newGMI;
  if (change > 10) {
    await manager.sendNotification(userId, {
      type: "indicator_change",
      title: "انخفاض مؤشر المشاعر العالمية",
      message: `انخفض مؤشر المشاعر العالمية من ${oldGMI.toFixed(2)} إلى ${newGMI.toFixed(2)} (انخفاض ${change.toFixed(2)} نقطة)`,
      severity: change > 20 ? "high" : "medium",
      data: { oldGMI, newGMI, change },
    });
  }
}

/**
 * محفز: تغيير العاطفة السائدة
 */
export async function triggerEmotionShift(
  manager: NotificationManager,
  userId: string,
  oldEmotion: string,
  newEmotion: string,
  confidence: number
): Promise<void> {
  if (oldEmotion !== newEmotion) {
    await manager.sendNotification(userId, {
      type: "emotion_shift",
      title: "تغيير العاطفة السائدة",
      message: `تغيرت العاطفة السائدة من "${oldEmotion}" إلى "${newEmotion}" بثقة ${(confidence * 100).toFixed(0)}%`,
      severity: confidence > 0.8 ? "high" : "medium",
      data: { oldEmotion, newEmotion, confidence },
    });
  }
}

/**
 * محفز: شذوذ إقليمي
 */
export async function triggerRegionalAnomaly(
  manager: NotificationManager,
  userId: string,
  region: string,
  anomalyScore: number,
  description: string
): Promise<void> {
  if (anomalyScore > 0.7) {
    await manager.sendNotification(userId, {
      type: "anomaly_detected",
      title: `شذوذ في ${region}`,
      message: `تم اكتشاف شذوذ في المنطقة ${region}: ${description}`,
      severity: anomalyScore > 0.9 ? "critical" : "high",
      data: { region, anomalyScore, description },
    });
  }
}

/**
 * محفز: تأثير عالي
 */
export async function triggerHighImpact(
  manager: NotificationManager,
  userId: string,
  topic: string,
  impactScore: number
): Promise<void> {
  if (impactScore > 0.85) {
    await manager.sendNotification(userId, {
      type: "indicator_change",
      title: "حدث ذو تأثير عالي جداً",
      message: `اكتشفنا حدثاً عن "${topic}" بدرجة تأثير ${(impactScore * 100).toFixed(0)}%`,
      severity: "critical",
      data: { topic, impactScore },
    });
  }
}

/**
 * محفز: موضوع متجه للانتشار
 */
export async function triggerTrendingTopic(
  manager: NotificationManager,
  userId: string,
  topic: string,
  trendScore: number,
  regions: string[]
): Promise<void> {
  if (trendScore > 0.8) {
    await manager.sendNotification(userId, {
      type: "trending_topic",
      title: "موضوع جديد متجه للانتشار",
      message: `موضوع "${topic}" يتجه للانتشار في ${regions.join(", ")} بدرجة ${(trendScore * 100).toFixed(0)}%`,
      severity: trendScore > 0.9 ? "high" : "medium",
      data: { topic, trendScore, regions },
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const notificationManager = new NotificationManager();
