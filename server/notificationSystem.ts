/**
 * NOTIFICATION SYSTEM - WEBSOCKET BASED
 * 
 * نظام التنبيهات الفوري عبر WebSocket
 * - يرسل تنبيهات فورية عند تغيير المؤشرات بشكل ملحوظ
 * - يدعم تنبيهات متعددة الأولويات
 * - يتتبع التغييرات الهامة في البيانات
 */

import { EventEmitter } from 'events';

export interface AlertThreshold {
  gmiChange: number; // % تغيير GMI
  cfiChange: number; // % تغيير CFI
  hriChange: number; // % تغيير HRI
  emotionShift: number; // % تغيير العاطفة
  eventImpact: number; // تأثير الحدث
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metric: string;
  previousValue: number;
  currentValue: number;
  changePercentage: number;
  timestamp: Date;
  country?: string;
  topic?: string;
  actionRequired?: boolean;
  relatedData?: Record<string, any>;
}

export interface AlertSubscriber {
  userId: string;
  country?: string;
  topic?: string;
  thresholds: AlertThreshold;
  active: boolean;
}

export class NotificationSystem extends EventEmitter {
  private subscribers: Map<string, AlertSubscriber> = new Map();
  private alertHistory: Map<string, Alert[]> = new Map();
  private readonly MAX_HISTORY = 100;

  // Default thresholds
  private defaultThresholds: AlertThreshold = {
    gmiChange: 5, // 5% change
    cfiChange: 5,
    hriChange: 5,
    emotionShift: 10,
    eventImpact: 70
  };

  constructor() {
    super();
    this.initializeSystem();
  }

  private initializeSystem() {
    console.log('[NotificationSystem] Initialized with WebSocket support');
  }

  /**
   * Subscribe user to alerts
   */
  public subscribe(
    userId: string,
    thresholds?: Partial<AlertThreshold>,
    country?: string,
    topic?: string
  ): void {
    const subscriber: AlertSubscriber = {
      userId,
      country,
      topic,
      thresholds: { ...this.defaultThresholds, ...thresholds },
      active: true
    };

    this.subscribers.set(userId, subscriber);
    console.log(`[NotificationSystem] User ${userId} subscribed to alerts`);
  }

  /**
   * Unsubscribe user from alerts
   */
  public unsubscribe(userId: string): void {
    this.subscribers.delete(userId);
    console.log(`[NotificationSystem] User ${userId} unsubscribed from alerts`);
  }

  /**
   * Check if GMI change exceeds threshold
   */
  public checkGMIChange(
    previousGMI: number,
    currentGMI: number,
    country?: string,
    topic?: string
  ): Alert | null {
    const changePercentage = ((currentGMI - previousGMI) / previousGMI) * 100;

    for (const [userId, subscriber] of this.subscribers) {
      if (!subscriber.active) continue;
      if (subscriber.country && subscriber.country !== country) continue;
      if (subscriber.topic && subscriber.topic !== topic) continue;

      if (Math.abs(changePercentage) >= subscriber.thresholds.gmiChange) {
        const alert = this.createAlert(
          changePercentage > 0 ? 'warning' : 'critical',
          'تغيير في مؤشر الحالة العام',
          `تغير مؤشر الحالة العام بنسبة ${changePercentage.toFixed(2)}%`,
          'GMI',
          previousGMI,
          currentGMI,
          changePercentage,
          country,
          topic
        );

        this.storeAlert(userId, alert);
        this.emit('alert', { userId, alert });
        return alert;
      }
    }

    return null;
  }

  /**
   * Check if CFI change exceeds threshold
   */
  public checkCFIChange(
    previousCFI: number,
    currentCFI: number,
    country?: string,
    topic?: string
  ): Alert | null {
    const changePercentage = ((currentCFI - previousCFI) / previousCFI) * 100;

    for (const [userId, subscriber] of this.subscribers) {
      if (!subscriber.active) continue;
      if (subscriber.country && subscriber.country !== country) continue;
      if (subscriber.topic && subscriber.topic !== topic) continue;

      if (Math.abs(changePercentage) >= subscriber.thresholds.cfiChange) {
        const alert = this.createAlert(
          changePercentage > 0 ? 'warning' : 'info',
          'تغيير في مؤشر الثقة الجماعية',
          `تغير مؤشر الثقة الجماعية بنسبة ${changePercentage.toFixed(2)}%`,
          'CFI',
          previousCFI,
          currentCFI,
          changePercentage,
          country,
          topic
        );

        this.storeAlert(userId, alert);
        this.emit('alert', { userId, alert });
        return alert;
      }
    }

    return null;
  }

  /**
   * Check if HRI change exceeds threshold
   */
  public checkHRIChange(
    previousHRI: number,
    currentHRI: number,
    country?: string,
    topic?: string
  ): Alert | null {
    const changePercentage = ((currentHRI - previousHRI) / previousHRI) * 100;

    for (const [userId, subscriber] of this.subscribers) {
      if (!subscriber.active) continue;
      if (subscriber.country && subscriber.country !== country) continue;
      if (subscriber.topic && subscriber.topic !== topic) continue;

      if (Math.abs(changePercentage) >= subscriber.thresholds.hriChange) {
        const alert = this.createAlert(
          changePercentage > 0 ? 'info' : 'warning',
          'تغيير في مؤشر الأمل والمرونة',
          `تغير مؤشر الأمل والمرونة بنسبة ${changePercentage.toFixed(2)}%`,
          'HRI',
          previousHRI,
          currentHRI,
          changePercentage,
          country,
          topic
        );

        this.storeAlert(userId, alert);
        this.emit('alert', { userId, alert });
        return alert;
      }
    }

    return null;
  }

  /**
   * Check if emotion shift exceeds threshold
   */
  public checkEmotionShift(
    previousEmotion: string,
    currentEmotion: string,
    emotionShiftPercentage: number,
    country?: string,
    topic?: string
  ): Alert | null {
    for (const [userId, subscriber] of this.subscribers) {
      if (!subscriber.active) continue;
      if (subscriber.country && subscriber.country !== country) continue;
      if (subscriber.topic && subscriber.topic !== topic) continue;

      if (emotionShiftPercentage >= subscriber.thresholds.emotionShift) {
        const alert = this.createAlert(
          'warning',
          'تحول عاطفي كبير',
          `تحول من ${previousEmotion} إلى ${currentEmotion} بنسبة ${emotionShiftPercentage.toFixed(2)}%`,
          'EMOTION',
          0,
          0,
          emotionShiftPercentage,
          country,
          topic
        );

        this.storeAlert(userId, alert);
        this.emit('alert', { userId, alert });
        return alert;
      }
    }

    return null;
  }

  /**
   * Check if event impact exceeds threshold
   */
  public checkEventImpact(
    eventTitle: string,
    impactScore: number,
    country?: string,
    topic?: string
  ): Alert | null {
    for (const [userId, subscriber] of this.subscribers) {
      if (!subscriber.active) continue;
      if (subscriber.country && subscriber.country !== country) continue;
      if (subscriber.topic && subscriber.topic !== topic) continue;

      if (impactScore >= subscriber.thresholds.eventImpact) {
        const alert = this.createAlert(
          'critical',
          'حدث ذو تأثير كبير',
          `حدث "${eventTitle}" بتأثير ${impactScore}`,
          'EVENT',
          0,
          impactScore,
          impactScore,
          country,
          topic,
          true
        );

        this.storeAlert(userId, alert);
        this.emit('alert', { userId, alert });
        return alert;
      }
    }

    return null;
  }

  /**
   * Create alert object
   */
  private createAlert(
    type: 'critical' | 'warning' | 'info',
    title: string,
    message: string,
    metric: string,
    previousValue: number,
    currentValue: number,
    changePercentage: number,
    country?: string,
    topic?: string,
    actionRequired: boolean = false
  ): Alert {
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      metric,
      previousValue,
      currentValue,
      changePercentage,
      timestamp: new Date(),
      country,
      topic,
      actionRequired
    };
  }

  /**
   * Store alert in history
   */
  private storeAlert(userId: string, alert: Alert): void {
    if (!this.alertHistory.has(userId)) {
      this.alertHistory.set(userId, []);
    }

    const history = this.alertHistory.get(userId)!;
    history.unshift(alert);

    // Keep only last MAX_HISTORY alerts
    if (history.length > this.MAX_HISTORY) {
      history.pop();
    }
  }

  /**
   * Get alert history for user
   */
  public getAlertHistory(userId: string, limit: number = 50): Alert[] {
    const history = this.alertHistory.get(userId) || [];
    return history.slice(0, limit);
  }

  /**
   * Get active subscribers count
   */
  public getActiveSubscribersCount(): number {
    let count = 0;
    for (const subscriber of this.subscribers.values()) {
      if (subscriber.active) count++;
    }
    return count;
  }

  /**
   * Get subscriber thresholds
   */
  public getSubscriberThresholds(userId: string): AlertThreshold | null {
    const subscriber = this.subscribers.get(userId);
    return subscriber ? subscriber.thresholds : null;
  }

  /**
   * Update subscriber thresholds
   */
  public updateSubscriberThresholds(
    userId: string,
    thresholds: Partial<AlertThreshold>
  ): boolean {
    const subscriber = this.subscribers.get(userId);
    if (!subscriber) return false;

    subscriber.thresholds = { ...subscriber.thresholds, ...thresholds };
    return true;
  }

  /**
   * Clear alert history for user
   */
  public clearAlertHistory(userId: string): void {
    this.alertHistory.delete(userId);
  }
}

// Export singleton instance
export const notificationSystem = new NotificationSystem();
