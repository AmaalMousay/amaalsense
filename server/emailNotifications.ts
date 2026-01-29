import { notifyOwner } from "./_core/notification";
import { getDailyTrendData } from "./analyticsStorage";

// Email notification types
export type NotificationFrequency = "daily" | "weekly" | "realtime";
export type NotificationType = "report" | "alert" | "digest";

interface EmailSubscriber {
  email: string;
  name: string;
  frequency: NotificationFrequency;
  types: NotificationType[];
  enabled: boolean;
}

// In-memory subscriber store (in production, use database)
const subscribers: Map<string, EmailSubscriber> = new Map();

/**
 * Subscribe to email notifications
 */
export function subscribeToNotifications(
  email: string,
  name: string,
  frequency: NotificationFrequency = "daily",
  types: NotificationType[] = ["report", "alert"]
): boolean {
  subscribers.set(email, {
    email,
    name,
    frequency,
    types,
    enabled: true,
  });
  return true;
}

/**
 * Unsubscribe from email notifications
 */
export function unsubscribeFromNotifications(email: string): boolean {
  return subscribers.delete(email);
}

/**
 * Update notification preferences
 */
export function updateNotificationPreferences(
  email: string,
  preferences: Partial<EmailSubscriber>
): boolean {
  const subscriber = subscribers.get(email);
  if (!subscriber) return false;
  
  subscribers.set(email, { ...subscriber, ...preferences });
  return true;
}

/**
 * Get subscriber info
 */
export function getSubscriber(email: string): EmailSubscriber | undefined {
  return subscribers.get(email);
}

/**
 * Get all subscribers by frequency
 */
export function getSubscribersByFrequency(frequency: NotificationFrequency): EmailSubscriber[] {
  return Array.from(subscribers.values()).filter(
    (s) => s.enabled && s.frequency === frequency
  );
}

/**
 * Generate daily report content
 */
export async function generateDailyReport(): Promise<string> {
  const trends = await getDailyTrendData(7);
  // Sessions data would be fetched from database
  
  const latestTrend = trends[0];
  const avgGMI = trends.reduce((sum, t) => sum + (t.gmi || 0), 0) / trends.length;
  const avgCFI = trends.reduce((sum, t) => sum + (t.cfi || 0), 0) / trends.length;
  const avgHRI = trends.reduce((sum, t) => sum + (t.hri || 0), 0) / trends.length;

  return `
📊 AmalSense Daily Report
========================

📅 Date: ${new Date().toLocaleDateString()}

🌡️ Current Indices:
- GMI (General Mood Index): ${latestTrend?.gmi?.toFixed(1) || 'N/A'}
- CFI (Collective Fear Index): ${latestTrend?.cfi?.toFixed(1) || 'N/A'}
- HRI (Hope & Resilience Index): ${latestTrend?.hri?.toFixed(1) || 'N/A'}

📈 7-Day Averages:
- GMI: ${avgGMI.toFixed(1)}
- CFI: ${avgCFI.toFixed(1)}
- HRI: ${avgHRI.toFixed(1)}

📝 Recent Analyses: View dashboard for details

🔗 View full dashboard: https://amalsense.manus.space/dashboard

---
AmalSense Engine - Digital Collective Emotion Analyzer
By Amaal Radwan Bashir
  `.trim();
}

/**
 * Generate weekly digest content
 */
export async function generateWeeklyDigest(): Promise<string> {
  const trends = await getDailyTrendData(30);
  
  const thisWeek = trends.slice(0, 7);
  const lastWeek = trends.slice(7, 14);
  
  const thisWeekAvgGMI = thisWeek.reduce((sum, t) => sum + (t.gmi || 0), 0) / thisWeek.length;
  const lastWeekAvgGMI = lastWeek.reduce((sum, t) => sum + (t.gmi || 0), 0) / lastWeek.length;
  const gmiChange = thisWeekAvgGMI - lastWeekAvgGMI;
  
  const thisWeekAvgCFI = thisWeek.reduce((sum, t) => sum + (t.cfi || 0), 0) / thisWeek.length;
  const lastWeekAvgCFI = lastWeek.reduce((sum, t) => sum + (t.cfi || 0), 0) / lastWeek.length;
  const cfiChange = thisWeekAvgCFI - lastWeekAvgCFI;
  
  const thisWeekAvgHRI = thisWeek.reduce((sum, t) => sum + (t.hri || 0), 0) / thisWeek.length;
  const lastWeekAvgHRI = lastWeek.reduce((sum, t) => sum + (t.hri || 0), 0) / lastWeek.length;
  const hriChange = thisWeekAvgHRI - lastWeekAvgHRI;

  return `
📊 AmalSense Weekly Digest
==========================

📅 Week of ${new Date().toLocaleDateString()}

📈 Weekly Trends:

GMI (General Mood Index):
  This Week: ${thisWeekAvgGMI.toFixed(1)}
  Last Week: ${lastWeekAvgGMI.toFixed(1)}
  Change: ${gmiChange >= 0 ? '↑' : '↓'} ${Math.abs(gmiChange).toFixed(1)}

CFI (Collective Fear Index):
  This Week: ${thisWeekAvgCFI.toFixed(1)}
  Last Week: ${lastWeekAvgCFI.toFixed(1)}
  Change: ${cfiChange >= 0 ? '↑' : '↓'} ${Math.abs(cfiChange).toFixed(1)}

HRI (Hope & Resilience Index):
  This Week: ${thisWeekAvgHRI.toFixed(1)}
  Last Week: ${lastWeekAvgHRI.toFixed(1)}
  Change: ${hriChange >= 0 ? '↑' : '↓'} ${Math.abs(hriChange).toFixed(1)}

🔍 Key Insights:
${gmiChange > 5 ? '• Significant improvement in general mood' : gmiChange < -5 ? '• Notable decline in general mood' : '• General mood remained stable'}
${cfiChange > 5 ? '• Fear levels have increased' : cfiChange < -5 ? '• Fear levels have decreased' : '• Fear levels remained stable'}
${hriChange > 5 ? '• Hope and resilience on the rise' : hriChange < -5 ? '• Hope and resilience declining' : '• Hope and resilience remained stable'}

🔗 View full trends: https://amalsense.manus.space/trends

---
AmalSense Engine - Digital Collective Emotion Analyzer
By Amaal Radwan Bashir
  `.trim();
}

/**
 * Generate alert notification content
 */
export function generateAlertNotification(
  alertType: string,
  indexName: string,
  currentValue: number,
  threshold: number,
  message: string
): string {
  return `
⚠️ AmalSense Alert
==================

🚨 Alert Type: ${alertType}
📊 Index: ${indexName}
📈 Current Value: ${currentValue.toFixed(1)}
🎯 Threshold: ${threshold.toFixed(1)}

📝 Message:
${message}

🔗 View dashboard: https://amalsense.manus.space/dashboard

---
AmalSense Engine - Digital Collective Emotion Analyzer
  `.trim();
}

/**
 * Send daily reports to all daily subscribers
 */
export async function sendDailyReports(): Promise<{ sent: number; failed: number }> {
  const dailySubscribers = getSubscribersByFrequency("daily");
  const report = await generateDailyReport();
  
  let sent = 0;
  let failed = 0;
  
  for (const subscriber of dailySubscribers) {
    if (subscriber.types.includes("report")) {
      try {
        // Use owner notification as the email sending mechanism
        await notifyOwner({
          title: `Daily Report for ${subscriber.name}`,
          content: report,
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send daily report to ${subscriber.email}:`, error);
        failed++;
      }
    }
  }
  
  return { sent, failed };
}

/**
 * Send weekly digests to all weekly subscribers
 */
export async function sendWeeklyDigests(): Promise<{ sent: number; failed: number }> {
  const weeklySubscribers = getSubscribersByFrequency("weekly");
  const digest = await generateWeeklyDigest();
  
  let sent = 0;
  let failed = 0;
  
  for (const subscriber of weeklySubscribers) {
    if (subscriber.types.includes("digest") || subscriber.types.includes("report")) {
      try {
        await notifyOwner({
          title: `Weekly Digest for ${subscriber.name}`,
          content: digest,
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send weekly digest to ${subscriber.email}:`, error);
        failed++;
      }
    }
  }
  
  return { sent, failed };
}

/**
 * Send alert to realtime subscribers
 */
export async function sendAlert(
  alertType: string,
  indexName: string,
  currentValue: number,
  threshold: number,
  message: string
): Promise<{ sent: number; failed: number }> {
  const realtimeSubscribers = getSubscribersByFrequency("realtime");
  const alertContent = generateAlertNotification(alertType, indexName, currentValue, threshold, message);
  
  let sent = 0;
  let failed = 0;
  
  for (const subscriber of realtimeSubscribers) {
    if (subscriber.types.includes("alert")) {
      try {
        await notifyOwner({
          title: `⚠️ Alert: ${indexName} ${alertType}`,
          content: alertContent,
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send alert to ${subscriber.email}:`, error);
        failed++;
      }
    }
  }
  
  return { sent, failed };
}
