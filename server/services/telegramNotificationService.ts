/**
 * Telegram Notification Service for Amaalsense
 * Sends automatic alerts when mood changes significantly
 */

import { ENV } from './_core/env';

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

interface MoodAlert {
  type: 'mood_change' | 'fear_spike' | 'hope_surge' | 'daily_summary';
  country?: string;
  countryName?: string;
  topic?: string;
  currentValue: number;
  previousValue?: number;
  change?: number;
  threshold?: number;
  timestamp: Date;
}

interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
}

/**
 * Send a message via Telegram Bot
 */
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  const botToken = ENV.telegramBotToken;
  
  if (!botToken) {
    console.log('[Telegram] Bot token not configured');
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: message.chatId,
        text: message.text,
        parse_mode: message.parseMode || 'HTML',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();
    
    if (!result.ok) {
      console.error('[Telegram] Failed to send message:', result.description);
      return false;
    }

    console.log('[Telegram] Message sent successfully');
    return true;
  } catch (error) {
    console.error('[Telegram] Error sending message:', error);
    return false;
  }
}

/**
 * Format mood alert as Telegram message
 */
export function formatMoodAlert(alert: MoodAlert): string {
  const emoji = getAlertEmoji(alert.type, alert.change || 0);
  const timestamp = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(alert.timestamp);

  let message = '';

  switch (alert.type) {
    case 'mood_change':
      message = `
${emoji} <b>Mood Change Alert</b>

${alert.countryName ? `🌍 <b>Country:</b> ${alert.countryName}` : '🌐 <b>Global</b>'}
${alert.topic ? `📌 <b>Topic:</b> ${alert.topic}` : ''}

📊 <b>Current GMI:</b> ${alert.currentValue.toFixed(1)}
${alert.previousValue ? `📈 <b>Previous:</b> ${alert.previousValue.toFixed(1)}` : ''}
${alert.change ? `${alert.change >= 0 ? '⬆️' : '⬇️'} <b>Change:</b> ${alert.change >= 0 ? '+' : ''}${alert.change.toFixed(1)}%` : ''}

🕐 ${timestamp}
      `;
      break;

    case 'fear_spike':
      message = `
🚨 <b>Fear Spike Detected!</b>

${alert.countryName ? `🌍 <b>Country:</b> ${alert.countryName}` : '🌐 <b>Global</b>'}
${alert.topic ? `📌 <b>Topic:</b> ${alert.topic}` : ''}

😰 <b>Current CFI:</b> ${alert.currentValue.toFixed(1)}
⚠️ <b>Threshold:</b> ${alert.threshold || 70}
${alert.change ? `📈 <b>Increase:</b> +${alert.change.toFixed(1)}%` : ''}

<i>High collective fear detected. Monitor situation closely.</i>

🕐 ${timestamp}
      `;
      break;

    case 'hope_surge':
      message = `
🌟 <b>Hope Surge Detected!</b>

${alert.countryName ? `🌍 <b>Country:</b> ${alert.countryName}` : '🌐 <b>Global</b>'}
${alert.topic ? `📌 <b>Topic:</b> ${alert.topic}` : ''}

💚 <b>Current HRI:</b> ${alert.currentValue.toFixed(1)}
${alert.change ? `📈 <b>Increase:</b> +${alert.change.toFixed(1)}%` : ''}

<i>Positive collective emotion wave detected!</i>

🕐 ${timestamp}
      `;
      break;

    case 'daily_summary':
      message = `
📊 <b>Daily Mood Summary</b>

${alert.countryName ? `🌍 <b>Country:</b> ${alert.countryName}` : '🌐 <b>Global Overview</b>'}

📈 <b>Today's Indicators:</b>
• GMI: ${alert.currentValue.toFixed(1)}
${alert.change ? `• Change: ${alert.change >= 0 ? '+' : ''}${alert.change.toFixed(1)}%` : ''}

🕐 ${timestamp}

<i>Powered by Amaalsense - DCFT Analysis</i>
      `;
      break;
  }

  return message.trim();
}

/**
 * Get appropriate emoji based on alert type and change
 */
function getAlertEmoji(type: string, change: number): string {
  if (type === 'fear_spike') return '🚨';
  if (type === 'hope_surge') return '🌟';
  if (type === 'daily_summary') return '📊';
  
  if (change >= 10) return '📈';
  if (change <= -10) return '📉';
  if (change >= 5) return '⬆️';
  if (change <= -5) return '⬇️';
  return '📊';
}

/**
 * Check if mood change exceeds threshold and send alert
 */
export async function checkAndSendMoodAlert(
  chatId: string,
  currentMood: { gmi: number; cfi: number; hri: number },
  previousMood?: { gmi: number; cfi: number; hri: number },
  options: {
    country?: string;
    countryName?: string;
    topic?: string;
    gmiThreshold?: number;
    cfiThreshold?: number;
    hriThreshold?: number;
  } = {}
): Promise<{ sent: boolean; alertType?: string }> {
  const gmiThreshold = options.gmiThreshold || 10; // 10% change
  const cfiThreshold = options.cfiThreshold || 70; // CFI above 70 is concerning
  const hriThreshold = options.hriThreshold || 15; // 15% increase in hope

  // Check for fear spike
  if (currentMood.cfi >= cfiThreshold) {
    const alert: MoodAlert = {
      type: 'fear_spike',
      country: options.country,
      countryName: options.countryName,
      topic: options.topic,
      currentValue: currentMood.cfi,
      previousValue: previousMood?.cfi,
      change: previousMood ? currentMood.cfi - previousMood.cfi : undefined,
      threshold: cfiThreshold,
      timestamp: new Date()
    };

    const message = formatMoodAlert(alert);
    const sent = await sendTelegramMessage({ chatId, text: message });
    return { sent, alertType: 'fear_spike' };
  }

  // Check for significant mood change
  if (previousMood) {
    const gmiChange = currentMood.gmi - previousMood.gmi;
    
    if (Math.abs(gmiChange) >= gmiThreshold) {
      const alert: MoodAlert = {
        type: 'mood_change',
        country: options.country,
        countryName: options.countryName,
        topic: options.topic,
        currentValue: currentMood.gmi,
        previousValue: previousMood.gmi,
        change: gmiChange,
        timestamp: new Date()
      };

      const message = formatMoodAlert(alert);
      const sent = await sendTelegramMessage({ chatId, text: message });
      return { sent, alertType: 'mood_change' };
    }

    // Check for hope surge
    const hriChange = currentMood.hri - previousMood.hri;
    if (hriChange >= hriThreshold) {
      const alert: MoodAlert = {
        type: 'hope_surge',
        country: options.country,
        countryName: options.countryName,
        topic: options.topic,
        currentValue: currentMood.hri,
        previousValue: previousMood.hri,
        change: hriChange,
        timestamp: new Date()
      };

      const message = formatMoodAlert(alert);
      const sent = await sendTelegramMessage({ chatId, text: message });
      return { sent, alertType: 'hope_surge' };
    }
  }

  return { sent: false };
}

/**
 * Send daily summary
 */
export async function sendDailySummary(
  chatId: string,
  mood: { gmi: number; cfi: number; hri: number },
  options: {
    country?: string;
    countryName?: string;
    previousDayGmi?: number;
  } = {}
): Promise<boolean> {
  const alert: MoodAlert = {
    type: 'daily_summary',
    country: options.country,
    countryName: options.countryName,
    currentValue: mood.gmi,
    change: options.previousDayGmi ? mood.gmi - options.previousDayGmi : undefined,
    timestamp: new Date()
  };

  const message = formatMoodAlert(alert);
  return sendTelegramMessage({ chatId, text: message });
}

/**
 * Get bot info to verify token
 */
export async function getBotInfo(): Promise<{ ok: boolean; username?: string; error?: string }> {
  const botToken = ENV.telegramBotToken;
  
  if (!botToken) {
    return { ok: false, error: 'Bot token not configured' };
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${botToken}/getMe`);
    const result = await response.json();
    
    if (result.ok) {
      return { ok: true, username: result.result.username };
    }
    
    return { ok: false, error: result.description };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

/**
 * Subscribe user to notifications (store chat ID)
 */
export async function subscribeToNotifications(
  chatId: string,
  options: {
    country?: string;
    topics?: string[];
    alertTypes?: ('mood_change' | 'fear_spike' | 'hope_surge' | 'daily_summary')[];
  } = {}
): Promise<boolean> {
  // Send welcome message
  const welcomeMessage = `
🧠 <b>Welcome to Amaalsense Notifications!</b>

You are now subscribed to receive:
${options.alertTypes?.includes('mood_change') !== false ? '✅ Mood change alerts' : ''}
${options.alertTypes?.includes('fear_spike') !== false ? '✅ Fear spike warnings' : ''}
${options.alertTypes?.includes('hope_surge') !== false ? '✅ Hope surge notifications' : ''}
${options.alertTypes?.includes('daily_summary') !== false ? '✅ Daily summaries' : ''}

${options.country ? `🌍 Monitoring: ${options.country}` : '🌐 Monitoring: Global'}
${options.topics?.length ? `📌 Topics: ${options.topics.join(', ')}` : ''}

<i>You will receive alerts when significant mood changes are detected.</i>

To unsubscribe, send /stop
  `.trim();

  return sendTelegramMessage({ chatId, text: welcomeMessage });
}
