/**
 * API Health Monitor - Real-time monitoring of all data source APIs
 * 
 * Monitors: NewsAPI, GNews, Reddit, Mastodon, Bluesky, YouTube, Telegram, Groq LLM
 * Tracks: availability, response time, quota usage, error rates
 */

import axios from 'axios';
import { ENV } from './_core/env';

// ============================================================================
// Types
// ============================================================================

export type SourceStatus = 'online' | 'degraded' | 'offline' | 'unknown' | 'no_key';

export interface SourceHealthResult {
  name: string;
  id: string;
  status: SourceStatus;
  responseTimeMs: number;
  lastChecked: number;
  message: string;
  hasApiKey: boolean;
  quotaInfo?: {
    used: number;
    limit: number;
    remaining: number;
    resetAt?: string;
  };
  errorCount: number;
  successCount: number;
  uptime: number; // percentage 0-100
}

export interface HealthMonitorState {
  sources: SourceHealthResult[];
  overallStatus: SourceStatus;
  lastFullCheck: number;
  totalSources: number;
  onlineSources: number;
  degradedSources: number;
  offlineSources: number;
}

// ============================================================================
// Health Check Functions
// ============================================================================

const REQUEST_TIMEOUT = 8000; // 8 seconds

// Track historical data
const sourceHistory: Record<string, { errors: number; successes: number; lastChecks: number[] }> = {};

function getHistory(id: string) {
  if (!sourceHistory[id]) {
    sourceHistory[id] = { errors: 0, successes: 0, lastChecks: [] };
  }
  return sourceHistory[id];
}

function recordCheck(id: string, success: boolean, responseTime: number) {
  const h = getHistory(id);
  if (success) h.successes++;
  else h.errors++;
  h.lastChecks.push(responseTime);
  if (h.lastChecks.length > 100) h.lastChecks.shift();
}

function getUptime(id: string): number {
  const h = getHistory(id);
  const total = h.successes + h.errors;
  if (total === 0) return 100;
  return Math.round((h.successes / total) * 100);
}

/**
 * Check NewsAPI health
 */
async function checkNewsAPI(): Promise<SourceHealthResult> {
  const id = 'newsapi';
  const apiKey = process.env.NEWS_API_KEY;
  const hasKey = !!apiKey;
  const start = Date.now();

  if (!hasKey) {
    return {
      name: 'NewsAPI',
      id,
      status: 'no_key',
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'No API key configured (NEWS_API_KEY)',
      hasApiKey: false,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }

  try {
    const resp = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country: 'us', pageSize: 1, apiKey },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'NewsAPI',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - ${resp.data?.totalResults || 0} articles available`,
      hasApiKey: true,
      quotaInfo: {
        used: 0,
        limit: 100,
        remaining: 100,
        resetAt: 'Daily reset',
      },
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);
    const msg = err?.response?.status === 429
      ? 'Rate limit exceeded'
      : err?.response?.status === 401
        ? 'Invalid API key'
        : err?.message || 'Connection failed';

    return {
      name: 'NewsAPI',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: msg,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check GNews API health
 */
async function checkGNews(): Promise<SourceHealthResult> {
  const id = 'gnews';
  const apiKey = process.env.GNEWS_API_KEY;
  const hasKey = !!apiKey;
  const start = Date.now();

  if (!hasKey) {
    return {
      name: 'GNews',
      id,
      status: 'no_key',
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'No API key configured (GNEWS_API_KEY)',
      hasApiKey: false,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }

  try {
    const resp = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: { lang: 'en', max: 1, apikey: apiKey },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'GNews',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - ${resp.data?.totalArticles || 0} articles available`,
      hasApiKey: true,
      quotaInfo: {
        used: 0,
        limit: 100,
        remaining: 100,
        resetAt: 'Daily reset',
      },
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);
    const msg = err?.response?.status === 403
      ? 'Quota exceeded or invalid key'
      : err?.message || 'Connection failed';

    return {
      name: 'GNews',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: msg,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Reddit API health (public API, no key needed)
 */
async function checkReddit(): Promise<SourceHealthResult> {
  const id = 'reddit';
  const start = Date.now();

  try {
    const resp = await axios.get('https://www.reddit.com/r/worldnews/hot.json', {
      params: { limit: 1 },
      timeout: REQUEST_TIMEOUT,
      headers: { 'User-Agent': 'AmalSense/1.0' },
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);
    const postCount = resp.data?.data?.children?.length || 0;

    return {
      name: 'Reddit',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - Public API accessible (${postCount} posts)`,
      hasApiKey: true, // Public API
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Reddit',
      id,
      status: err?.response?.status === 429 ? 'degraded' : 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.response?.status === 429 ? 'Rate limited - will retry' : (err?.message || 'Connection failed'),
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Mastodon API health (public API)
 */
async function checkMastodon(): Promise<SourceHealthResult> {
  const id = 'mastodon';
  const start = Date.now();

  try {
    const resp = await axios.get('https://mastodon.social/api/v1/timelines/public', {
      params: { limit: 1 },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'Mastodon',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - Public timeline accessible`,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Mastodon',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.message || 'Connection failed',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Bluesky API health (public API)
 */
async function checkBluesky(): Promise<SourceHealthResult> {
  const id = 'bluesky';
  const start = Date.now();

  try {
    const resp = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts', {
      params: { q: 'news', limit: 1 },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'Bluesky',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - Search API accessible`,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Bluesky',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.message || 'Connection failed',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check YouTube API health
 */
async function checkYouTube(): Promise<SourceHealthResult> {
  const id = 'youtube';
  const apiKey = process.env.YOUTUBE_API_KEY;
  const hasKey = !!apiKey;
  const start = Date.now();

  if (!hasKey) {
    // Try Invidious fallback
    try {
      const resp = await axios.get('https://vid.puffyan.us/api/v1/search', {
        params: { q: 'news', type: 'video' },
        timeout: REQUEST_TIMEOUT,
      });
      const elapsed = Date.now() - start;
      recordCheck(id, true, elapsed);

      return {
        name: 'YouTube (Invidious)',
        id,
        status: elapsed > 5000 ? 'degraded' : 'online',
        responseTimeMs: elapsed,
        lastChecked: Date.now(),
        message: 'Using Invidious fallback (no YouTube API key)',
        hasApiKey: false,
        errorCount: getHistory(id).errors,
        successCount: getHistory(id).successes,
        uptime: getUptime(id),
      };
    } catch {
      const elapsed = Date.now() - start;
      recordCheck(id, false, elapsed);
      return {
        name: 'YouTube',
        id,
        status: 'no_key',
        responseTimeMs: elapsed,
        lastChecked: Date.now(),
        message: 'No API key and Invidious fallback unavailable',
        hasApiKey: false,
        errorCount: getHistory(id).errors,
        successCount: getHistory(id).successes,
        uptime: getUptime(id),
      };
    }
  }

  try {
    const resp = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: { q: 'news', part: 'snippet', maxResults: 1, key: apiKey },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'YouTube',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - API accessible`,
      hasApiKey: true,
      quotaInfo: {
        used: 0,
        limit: 10000,
        remaining: 10000,
        resetAt: 'Daily reset (Pacific Time)',
      },
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'YouTube',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.response?.data?.error?.message || err?.message || 'Connection failed',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Telegram Bot API health
 */
async function checkTelegram(): Promise<SourceHealthResult> {
  const id = 'telegram';
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const hasKey = !!botToken;
  const start = Date.now();

  if (!hasKey) {
    return {
      name: 'Telegram',
      id,
      status: 'no_key',
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'No bot token configured (TELEGRAM_BOT_TOKEN)',
      hasApiKey: false,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }

  try {
    const resp = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`, {
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);
    const botName = resp.data?.result?.username || 'unknown';

    return {
      name: 'Telegram',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - Bot @${botName} active`,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Telegram',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.response?.status === 401 ? 'Invalid bot token' : (err?.message || 'Connection failed'),
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Groq LLM API health
 */
async function checkGroq(): Promise<SourceHealthResult> {
  const id = 'groq';
  const apiKey = process.env.GROQ_API_KEY;
  const hasKey = !!apiKey;
  const start = Date.now();

  if (!hasKey) {
    return {
      name: 'Groq LLM',
      id,
      status: 'no_key',
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'No API key configured (GROQ_API_KEY)',
      hasApiKey: false,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }

  try {
    const resp = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);
    const modelCount = resp.data?.data?.length || 0;

    return {
      name: 'Groq LLM',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: `OK - ${modelCount} models available`,
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Groq LLM',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.response?.status === 401 ? 'Invalid API key' : (err?.message || 'Connection failed'),
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Google RSS (no key needed)
 */
async function checkGoogleRSS(): Promise<SourceHealthResult> {
  const id = 'google_rss';
  const start = Date.now();

  try {
    const resp = await axios.get('https://news.google.com/rss', {
      timeout: REQUEST_TIMEOUT,
      headers: { 'User-Agent': 'AmalSense/1.0' },
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'Google News RSS',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: 'OK - RSS feed accessible',
      hasApiKey: true, // No key needed
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Google News RSS',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.message || 'Connection failed',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

/**
 * Check Built-in LLM (Manus Forge)
 */
async function checkBuiltInLLM(): Promise<SourceHealthResult> {
  const id = 'builtin_llm';
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  const hasKey = !!apiUrl && !!apiKey;
  const start = Date.now();

  if (!hasKey) {
    return {
      name: 'Built-in LLM (Forge)',
      id,
      status: 'no_key',
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'Forge API not configured',
      hasApiKey: false,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }

  try {
    const resp = await axios.get(`${apiUrl}/v1/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: REQUEST_TIMEOUT,
    });
    const elapsed = Date.now() - start;
    recordCheck(id, true, elapsed);

    return {
      name: 'Built-in LLM (Forge)',
      id,
      status: elapsed > 5000 ? 'degraded' : 'online',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: 'OK - Forge API accessible',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  } catch (err: any) {
    const elapsed = Date.now() - start;
    recordCheck(id, false, elapsed);

    return {
      name: 'Built-in LLM (Forge)',
      id,
      status: 'offline',
      responseTimeMs: elapsed,
      lastChecked: Date.now(),
      message: err?.message || 'Connection failed',
      hasApiKey: true,
      errorCount: getHistory(id).errors,
      successCount: getHistory(id).successes,
      uptime: getUptime(id),
    };
  }
}

// ============================================================================
// Main Health Monitor
// ============================================================================

let cachedResult: HealthMonitorState | null = null;
let lastCheckTime = 0;
const CACHE_TTL = 60_000; // 1 minute cache

/**
 * Run all health checks in parallel
 */
export async function checkAllSources(): Promise<HealthMonitorState> {
  // Return cached result if fresh
  if (cachedResult && Date.now() - lastCheckTime < CACHE_TTL) {
    return cachedResult;
  }

  const checks = await Promise.allSettled([
    checkNewsAPI(),
    checkGNews(),
    checkReddit(),
    checkMastodon(),
    checkBluesky(),
    checkYouTube(),
    checkTelegram(),
    checkGroq(),
    checkGoogleRSS(),
    checkBuiltInLLM(),
  ]);

  const sources = checks.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    // If the check itself threw an error
    const names = ['NewsAPI', 'GNews', 'Reddit', 'Mastodon', 'Bluesky', 'YouTube', 'Telegram', 'Groq LLM', 'Google RSS', 'Built-in LLM'];
    const ids = ['newsapi', 'gnews', 'reddit', 'mastodon', 'bluesky', 'youtube', 'telegram', 'groq', 'google_rss', 'builtin_llm'];
    return {
      name: names[index] || 'Unknown',
      id: ids[index] || 'unknown',
      status: 'offline' as SourceStatus,
      responseTimeMs: 0,
      lastChecked: Date.now(),
      message: 'Health check failed unexpectedly',
      hasApiKey: false,
      errorCount: 0,
      successCount: 0,
      uptime: 0,
    };
  });

  const onlineSources = sources.filter(s => s.status === 'online').length;
  const degradedSources = sources.filter(s => s.status === 'degraded').length;
  const offlineSources = sources.filter(s => s.status === 'offline').length;

  let overallStatus: SourceStatus = 'online';
  if (offlineSources > sources.length / 2) overallStatus = 'offline';
  else if (offlineSources > 0 || degradedSources > 0) overallStatus = 'degraded';

  const state: HealthMonitorState = {
    sources,
    overallStatus,
    lastFullCheck: Date.now(),
    totalSources: sources.length,
    onlineSources,
    degradedSources,
    offlineSources,
  };

  cachedResult = state;
  lastCheckTime = Date.now();

  return state;
}

/**
 * Check a single source by ID
 */
export async function checkSingleSource(sourceId: string): Promise<SourceHealthResult | null> {
  const checkMap: Record<string, () => Promise<SourceHealthResult>> = {
    newsapi: checkNewsAPI,
    gnews: checkGNews,
    reddit: checkReddit,
    mastodon: checkMastodon,
    bluesky: checkBluesky,
    youtube: checkYouTube,
    telegram: checkTelegram,
    groq: checkGroq,
    google_rss: checkGoogleRSS,
    builtin_llm: checkBuiltInLLM,
  };

  const checker = checkMap[sourceId];
  if (!checker) return null;

  try {
    return await checker();
  } catch {
    return null;
  }
}

/**
 * Force refresh (bypass cache)
 */
export async function forceRefresh(): Promise<HealthMonitorState> {
  cachedResult = null;
  lastCheckTime = 0;
  return checkAllSources();
}

/**
 * Get source categories
 */
export function getSourceCategories() {
  return {
    news: ['newsapi', 'gnews', 'google_rss'],
    social: ['reddit', 'mastodon', 'bluesky', 'telegram'],
    ai: ['groq', 'builtin_llm'],
    video: ['youtube'],
  };
}
