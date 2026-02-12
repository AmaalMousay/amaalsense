/**
 * Real-Time Notification System with WebSocket
 * Sends push notifications for significant emotional shifts and alerts
 */

import { EventEmitter } from 'events';
import { invokeLLMWithSanitization } from './llmPipelineWithSanitization';

export interface NotificationTrigger {
  type: 'gmi_spike' | 'cfi_drop' | 'trend_change' | 'prediction_alert' | 'custom';
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'equals' | 'changed_by';
  metric: string;
  description: string;
}

export interface UserNotificationPreference {
  userId: string;
  enableNotifications: boolean;
  channels: ('email' | 'push' | 'sms' | 'in-app')[];
  triggers: NotificationTrigger[];
  quietHours?: {
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  language: 'en' | 'ar';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'alert' | 'update' | 'insight' | 'recommendation';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric?: string;
  value?: number;
  previousValue?: number;
  changePercentage?: number;
  actionUrl?: string;
  timestamp: number;
  read: boolean;
  channels: ('email' | 'push' | 'sms' | 'in-app')[];
}

export class RealtimeNotificationSystem extends EventEmitter {
  private notifications: Map<string, Notification[]> = new Map();
  private userPreferences: Map<string, UserNotificationPreference> = new Map();
  private activeConnections: Map<string, Set<any>> = new Map();
  private notificationQueue: Notification[] = [];
  private isProcessing = false;

  constructor() {
    super();
    this.initializeDefaultPreferences();
  }

  /**
   * Initialize default notification preferences for users
   */
  private initializeDefaultPreferences() {
    // Default preferences can be loaded from database
  }

  /**
   * Register user notification preferences
   */
  registerUserPreferences(preferences: UserNotificationPreference) {
    this.userPreferences.set(preferences.userId, preferences);
    this.emit('preferences:updated', preferences);
  }

  /**
   * Get user notification preferences
   */
  getUserPreferences(userId: string): UserNotificationPreference | undefined {
    return this.userPreferences.get(userId);
  }

  /**
   * Update user notification preferences
   */
  updateUserPreferences(userId: string, updates: Partial<UserNotificationPreference>) {
    const current = this.userPreferences.get(userId);
    if (current) {
      const updated = { ...current, ...updates };
      this.userPreferences.set(userId, updated);
      this.emit('preferences:updated', updated);
      return updated;
    }
    return null;
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  private shouldSendNotification(userId: string, notification: Notification): boolean {
    const preferences = this.userPreferences.get(userId);
    if (!preferences || !preferences.enableNotifications) {
      return false;
    }

    // Check quiet hours
    if (preferences.quietHours) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number);
      const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);

      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      const current = currentHour * 60 + currentMin;

      if (startTime <= endTime) {
        if (current >= startTime && current <= endTime) return false;
      } else {
        if (current >= startTime || current <= endTime) return false;
      }
    }

    // Check frequency
    if (preferences.frequency !== 'immediate') {
      const lastNotification = this.notifications.get(userId)?.[0];
      if (lastNotification) {
        const timeDiff = Date.now() - lastNotification.timestamp;
        const minInterval = this.getMinIntervalMs(preferences.frequency);
        if (timeDiff < minInterval) return false;
      }
    }

    return true;
  }

  /**
   * Get minimum interval in milliseconds based on frequency
   */
  private getMinIntervalMs(frequency: string): number {
    switch (frequency) {
      case 'hourly':
        return 60 * 60 * 1000;
      case 'daily':
        return 24 * 60 * 60 * 1000;
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000;
      case 'immediate':
      default:
        return 0;
    }
  }

  /**
   * Check metric against triggers and create notification
   */
  async checkMetricTriggers(
    userId: string,
    metric: string,
    value: number,
    previousValue?: number
  ): Promise<Notification | null> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) return null;

    const trigger = preferences.triggers.find(t => t.metric === metric);
    if (!trigger) return null;

    let shouldTrigger = false;
    let changePercentage = 0;

    if (previousValue !== undefined) {
      changePercentage = ((value - previousValue) / previousValue) * 100;
    }

    switch (trigger.condition) {
      case 'greater_than':
        shouldTrigger = value > trigger.threshold;
        break;
      case 'less_than':
        shouldTrigger = value < trigger.threshold;
        break;
      case 'equals':
        shouldTrigger = value === trigger.threshold;
        break;
      case 'changed_by':
        shouldTrigger = Math.abs(changePercentage) >= trigger.threshold;
        break;
    }

    if (!shouldTrigger) return null;

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (metric === 'gmi') {
      if (value > 80) severity = 'critical';
      else if (value > 70) severity = 'high';
      else if (value > 60) severity = 'medium';
    } else if (metric === 'cfi') {
      if (value < 20) severity = 'critical';
      else if (value < 30) severity = 'high';
      else if (value < 40) severity = 'medium';
    }

    // Generate AI-powered message
    const message = await this.generateNotificationMessage(metric, value, previousValue, preferences.language);

    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId,
      type: 'alert',
      title: `${metric.toUpperCase()} Alert: ${trigger.description}`,
      message,
      severity,
      metric,
      value,
      previousValue,
      changePercentage: previousValue ? changePercentage : undefined,
      timestamp: Date.now(),
      read: false,
      channels: preferences.channels
    };

    return notification;
  }

  /**
   * Generate AI-powered notification message
   */
  private async generateNotificationMessage(
    metric: string,
    value: number,
    previousValue: number | undefined,
    language: string
  ): Promise<string> {
    try {
      const prompt = language === 'ar'
        ? `أنشئ رسالة تنبيه قصيرة (جملة واحدة) عن ${metric} = ${value}${previousValue ? ` (كان ${previousValue})` : ''}. اجعلها مباشرة وملموسة.`
        : `Create a short alert message (one sentence) about ${metric} = ${value}${previousValue ? ` (was ${previousValue})` : ''}. Make it direct and actionable.`;

      const response = await invokeLLMWithSanitization({
        messages: [{ role: 'user', content: prompt }]
      });

      const message = typeof response === 'string' ? response : response?.content || `${metric} has changed to ${value}`;
      return message;
    } catch (error) {
      console.error('Error generating notification message:', error);
      return `${metric} alert: value is now ${value}`;
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(notification: Notification): Promise<boolean> {
    if (!this.shouldSendNotification(notification.userId, notification)) {
      return false;
    }

    // Store notification
    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.unshift(notification);
    this.notifications.set(notification.userId, userNotifications.slice(0, 100)); // Keep last 100

    // Send through configured channels
    for (const channel of notification.channels) {
      await this.sendThroughChannel(channel, notification);
    }

    // Emit event for WebSocket connections
    this.emit('notification:sent', notification);

    return true;
  }

  /**
   * Send notification through specific channel
   */
  private async sendThroughChannel(channel: string, notification: Notification): Promise<void> {
    switch (channel) {
      case 'in-app':
        this.broadcastToUser(notification.userId, notification);
        break;
      case 'email':
        // Email sending logic
        console.log(`[EMAIL] Sending to user ${notification.userId}:`, notification.title);
        break;
      case 'push':
        // Push notification logic
        console.log(`[PUSH] Sending to user ${notification.userId}:`, notification.title);
        break;
      case 'sms':
        // SMS sending logic
        console.log(`[SMS] Sending to user ${notification.userId}:`, notification.message);
        break;
    }
  }

  /**
   * Broadcast notification to user's WebSocket connections
   */
  private broadcastToUser(userId: string, notification: Notification): void {
    const connections = this.activeConnections.get(userId);
    if (connections) {
      connections.forEach(ws => {
        try {
          ws.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));
        } catch (error) {
          console.error('Error sending WebSocket notification:', error);
        }
      });
    }
  }

  /**
   * Register WebSocket connection for user
   */
  registerConnection(userId: string, connection: any): void {
    if (!this.activeConnections.has(userId)) {
      this.activeConnections.set(userId, new Set());
    }
    this.activeConnections.get(userId)!.add(connection);
  }

  /**
   * Unregister WebSocket connection
   */
  unregisterConnection(userId: string, connection: any): void {
    const connections = this.activeConnections.get(userId);
    if (connections) {
      connections.delete(connection);
      if (connections.size === 0) {
        this.activeConnections.delete(userId);
      }
    }
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: string, limit: number = 50): Notification[] {
    return (this.notifications.get(userId) || []).slice(0, limit);
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Clear user notifications
   */
  clearNotifications(userId: string): void {
    this.notifications.delete(userId);
  }

  /**
   * Get notification statistics
   */
  getStatistics(userId: string) {
    const userNotifications = this.notifications.get(userId) || [];
    const unread = userNotifications.filter(n => !n.read).length;
    const bySeverity = {
      critical: userNotifications.filter(n => n.severity === 'critical').length,
      high: userNotifications.filter(n => n.severity === 'high').length,
      medium: userNotifications.filter(n => n.severity === 'medium').length,
      low: userNotifications.filter(n => n.severity === 'low').length
    };

    return {
      total: userNotifications.length,
      unread,
      bySeverity,
      lastNotification: userNotifications[0]?.timestamp || null
    };
  }
}

// Export singleton instance
export const notificationSystem = new RealtimeNotificationSystem();
