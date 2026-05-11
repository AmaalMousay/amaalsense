// @ts-nocheck
/**
 * Analytics Storage Service
 * Handles saving and retrieving analysis data for historical trends
 */

import { getDb } from "./db";
import {
  analysisSessions,
  sourceAnalyses,
  dailyAggregates,
  trendAlerts,
  InsertSourceAnalysis,
} from "../drizzle/schema";
import { eq, desc, gte, lte, and, sql } from "drizzle-orm";

// ============================================
// ANALYSIS SESSION MANAGEMENT
// ============================================

export interface AnalysisResult {
  gmi: number;
  cfi: number;
  hri: number;
  sentimentScore: number;
  dominantEmotion: string;
  confidence: number;
  sources: SourceResult[];
}

export interface SourceResult {
  platform: string;
  content: string;
  sourceUrl?: string;
  author?: string;
  sentimentScore: number;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  confidence: number;
  publishedAt?: Date;
}

/**
 * Save a complete analysis session with all source data
 */
export async function saveAnalysisSession(
  result: AnalysisResult,
  options: {
    userId?: number;
    sessionType?: "manual" | "scheduled" | "api";
    query?: string;
    countryCode?: string;
    durationMs?: number;
  } = {}
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Calculate sources breakdown
  const sourcesBreakdown: Record<string, number> = {};
  result.sources.forEach((source) => {
    sourcesBreakdown[source.platform] = (sourcesBreakdown[source.platform] || 0) + 1;
  });

  // Insert session
  const [session] = await db.insert(analysisSessions).values({
    userId: options.userId || null,
    sessionType: options.sessionType || "manual",
    query: options.query || null,
    countryCode: options.countryCode || null,
    gmi: result.gmi,
    cfi: result.cfi,
    hri: result.hri,
    sentimentScore: Math.round(result.sentimentScore * 100),
    dominantEmotion: result.dominantEmotion,
    sourcesCount: result.sources.length,
    sourcesBreakdown: JSON.stringify(sourcesBreakdown),
    confidence: result.confidence,
    durationMs: options.durationMs || null,
  });

  const sessionId = session.insertId;

  // Insert source analyses
  if (result.sources.length > 0) {
    const sourceRecords: InsertSourceAnalysis[] = result.sources.map((source) => ({
      sessionId: Number(sessionId),
      platform: source.platform,
      content: source.content.slice(0, 5000),
      sourceUrl: source.sourceUrl || null,
      author: source.author || null,
      sentimentScore: Math.round(source.sentimentScore * 100),
      joy: source.emotions.joy,
      fear: source.emotions.fear,
      anger: source.emotions.anger,
      sadness: source.emotions.sadness,
      hope: source.emotions.hope,
      curiosity: source.emotions.curiosity,
      dominantEmotion: source.dominantEmotion,
      confidence: source.confidence,
      publishedAt: source.publishedAt || null,
    }));

    await db.insert(sourceAnalyses).values(sourceRecords);
  }

  // Check for trend alerts
  await checkAndCreateAlerts(db, result, options.countryCode);

  return Number(sessionId);
}

// ============================================
// TREND QUERIES
// ============================================

/**
 * Get historical trend data for a time range
 */
export async function getHistoricalTrends(
  options: {
    startDate?: Date;
    endDate?: Date;
    countryCode?: string;
    limit?: number;
  } = {}
): Promise<{
  sessions: typeof analysisSessions.$inferSelect[];
  aggregates: typeof dailyAggregates.$inferSelect[];
}> {
  const db = await getDb();
  if (!db) return { sessions: [], aggregates: [] };

  const { startDate, endDate, countryCode, limit = 100 } = options;

  const conditions = [];
  if (startDate) conditions.push(gte(analysisSessions.createdAt, startDate));
  if (endDate) conditions.push(lte(analysisSessions.createdAt, endDate));
  if (countryCode) conditions.push(eq(analysisSessions.countryCode, countryCode));

  const sessions = await db
    .select()
    .from(analysisSessions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(analysisSessions.createdAt))
    .limit(limit);

  const aggregateConditions = [];
  if (startDate) aggregateConditions.push(gte(dailyAggregates.aggregateDate, startDate));
  if (endDate) aggregateConditions.push(lte(dailyAggregates.aggregateDate, endDate));
  if (countryCode) aggregateConditions.push(eq(dailyAggregates.countryCode, countryCode));

  const aggregates = await db
    .select()
    .from(dailyAggregates)
    .where(aggregateConditions.length > 0 ? and(...aggregateConditions) : undefined)
    .orderBy(desc(dailyAggregates.aggregateDate))
    .limit(limit);

  return { sessions, aggregates };
}

/**
 * Get trend data grouped by day for charts
 */
export async function getDailyTrendData(
  days: number = 30,
  countryCode?: string
): Promise<{ date: string; gmi: number; cfi: number; hri: number; sentiment: number; count: number }[]> {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const conditions = [gte(analysisSessions.createdAt, startDate)];
  if (countryCode) conditions.push(eq(analysisSessions.countryCode, countryCode));

  const results = await db
    .select({
      date: sql<string>`DATE(${analysisSessions.createdAt})`,
      gmi: sql<number>`AVG(${analysisSessions.gmi})`,
      cfi: sql<number>`AVG(${analysisSessions.cfi})`,
      hri: sql<number>`AVG(${analysisSessions.hri})`,
      sentiment: sql<number>`AVG(${analysisSessions.sentimentScore})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(analysisSessions)
    .where(and(...conditions))
    .groupBy(sql`DATE(${analysisSessions.createdAt})`)
    .orderBy(sql`DATE(${analysisSessions.createdAt})`);

  return results.map((r) => ({
    date: String(r.date),
    gmi: Math.round(Number(r.gmi) || 0),
    cfi: Math.round(Number(r.cfi) || 0),
    hri: Math.round(Number(r.hri) || 0),
    sentiment: Math.round(Number(r.sentiment) || 0),
    count: Number(r.count) || 0,
  }));
}

/**
 * Get emotion distribution over time
 */
export async function getEmotionDistribution(
  days: number = 7,
  countryCode?: string
): Promise<Record<string, number>> {
  const db = await getDb();
  if (!db) return {};

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const conditions = [gte(analysisSessions.createdAt, startDate)];
  if (countryCode) conditions.push(eq(analysisSessions.countryCode, countryCode));

  const results = await db
    .select({
      emotion: analysisSessions.dominantEmotion,
      count: sql<number>`COUNT(*)`,
    })
    .from(analysisSessions)
    .where(and(...conditions))
    .groupBy(analysisSessions.dominantEmotion);

  const distribution: Record<string, number> = {};
  results.forEach((r) => {
    if (r.emotion) distribution[r.emotion] = Number(r.count);
  });

  return distribution;
}

/**
 * Get platform source statistics
 */
export async function getPlatformStats(
  days: number = 7
): Promise<Record<string, { count: number; avgSentiment: number }>> {
  const db = await getDb();
  if (!db) return {};

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const results = await db
    .select({
      platform: sourceAnalyses.platform,
      count: sql<number>`COUNT(*)`,
      avgSentiment: sql<number>`AVG(${sourceAnalyses.sentimentScore})`,
    })
    .from(sourceAnalyses)
    .where(gte(sourceAnalyses.createdAt, startDate))
    .groupBy(sourceAnalyses.platform);

  const stats: Record<string, { count: number; avgSentiment: number }> = {};
  results.forEach((r) => {
    stats[r.platform] = {
      count: Number(r.count),
      avgSentiment: Math.round(Number(r.avgSentiment) || 0),
    };
  });

  return stats;
}

// ============================================
// DAILY AGGREGATION
// ============================================

/**
 * Compute and store daily aggregate for a specific date
 */
export async function computeDailyAggregate(date: Date, countryCode?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const conditions = [
    gte(analysisSessions.createdAt, startOfDay),
    lte(analysisSessions.createdAt, endOfDay),
  ];
  if (countryCode) conditions.push(eq(analysisSessions.countryCode, countryCode));

  const [stats] = await db
    .select({
      avgGmi: sql<number>`AVG(${analysisSessions.gmi})`,
      avgCfi: sql<number>`AVG(${analysisSessions.cfi})`,
      avgHri: sql<number>`AVG(${analysisSessions.hri})`,
      avgSentiment: sql<number>`AVG(${analysisSessions.sentimentScore})`,
      analysesCount: sql<number>`COUNT(*)`,
      sourcesCount: sql<number>`SUM(${analysisSessions.sourcesCount})`,
    })
    .from(analysisSessions)
    .where(and(...conditions));

  const [topEmotionResult] = await db
    .select({
      emotion: analysisSessions.dominantEmotion,
      count: sql<number>`COUNT(*)`,
    })
    .from(analysisSessions)
    .where(and(...conditions))
    .groupBy(analysisSessions.dominantEmotion)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(1);

  await db.insert(dailyAggregates).values({
    aggregateDate: startOfDay,
    countryCode: countryCode || null,
    avgGmi: Math.round(Number(stats.avgGmi) || 0),
    avgCfi: Math.round(Number(stats.avgCfi) || 0),
    avgHri: Math.round(Number(stats.avgHri) || 0),
    avgSentiment: Math.round(Number(stats.avgSentiment) || 0),
    topEmotion: topEmotionResult?.emotion || null,
    analysesCount: Number(stats.analysesCount) || 0,
    sourcesCount: Number(stats.sourcesCount) || 0,
  });
}

// ============================================
// TREND ALERTS
// ============================================

/**
 * Check for significant changes and create alerts
 */
async function checkAndCreateAlerts(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  result: AnalysisResult,
  countryCode?: string
): Promise<void> {
  const conditions = countryCode ? [eq(analysisSessions.countryCode, countryCode)] : [];

  const [previousSession] = await db
    .select()
    .from(analysisSessions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(analysisSessions.createdAt))
    .limit(1);

  if (!previousSession) return;

  const metrics = [
    { name: "gmi", prev: previousSession.gmi, curr: result.gmi },
    { name: "cfi", prev: previousSession.cfi, curr: result.cfi },
    { name: "hri", prev: previousSession.hri, curr: result.hri },
  ];

  for (const metric of metrics) {
    if (metric.prev === 0) continue;
    const changePercent = Math.round(((metric.curr - metric.prev) / Math.abs(metric.prev)) * 100);

    if (Math.abs(changePercent) >= 20) {
      const alertType = changePercent > 0 ? "spike" : "drop";
      const severity = Math.abs(changePercent) >= 50 ? "high" : Math.abs(changePercent) >= 30 ? "medium" : "low";

      await db.insert(trendAlerts).values({
        alertType,
        metric: metric.name,
        countryCode: countryCode || null,
        previousValue: metric.prev,
        currentValue: metric.curr,
        changePercent,
        severity,
        message: `${metric.name.toUpperCase()} ${alertType}: ${changePercent > 0 ? "+" : ""}${changePercent}% change detected`,
        acknowledged: 0,
      });
    }
  }
}

/**
 * Get recent alerts
 */
export async function getRecentAlerts(
  limit: number = 10,
  unacknowledgedOnly: boolean = false
): Promise<typeof trendAlerts.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = unacknowledgedOnly ? [eq(trendAlerts.acknowledged, 0)] : [];

  return db
    .select()
    .from(trendAlerts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(trendAlerts.createdAt))
    .limit(limit);
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(trendAlerts).set({ acknowledged: 1 }).where(eq(trendAlerts.id, alertId));
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get overall statistics
 */
export async function getOverallStats(): Promise<{
  totalSessions: number;
  totalSources: number;
  avgGmi: number;
  avgCfi: number;
  avgHri: number;
  topEmotion: string;
  activeAlerts: number;
}> {
  const db = await getDb();
  if (!db) {
    return { totalSessions: 0, totalSources: 0, avgGmi: 0, avgCfi: 0, avgHri: 0, topEmotion: "neutral", activeAlerts: 0 };
  }

  const [sessionStats] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      avgGmi: sql<number>`AVG(${analysisSessions.gmi})`,
      avgCfi: sql<number>`AVG(${analysisSessions.cfi})`,
      avgHri: sql<number>`AVG(${analysisSessions.hri})`,
      totalSources: sql<number>`SUM(${analysisSessions.sourcesCount})`,
    })
    .from(analysisSessions);

  const [topEmotionResult] = await db
    .select({
      emotion: analysisSessions.dominantEmotion,
      count: sql<number>`COUNT(*)`,
    })
    .from(analysisSessions)
    .groupBy(analysisSessions.dominantEmotion)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(1);

  const [alertCount] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(trendAlerts)
    .where(eq(trendAlerts.acknowledged, 0));

  return {
    totalSessions: Number(sessionStats.total) || 0,
    totalSources: Number(sessionStats.totalSources) || 0,
    avgGmi: Math.round(Number(sessionStats.avgGmi) || 0),
    avgCfi: Math.round(Number(sessionStats.avgCfi) || 0),
    avgHri: Math.round(Number(sessionStats.avgHri) || 0),
    topEmotion: topEmotionResult?.emotion || "neutral",
    activeAlerts: Number(alertCount.count) || 0,
  };
}
