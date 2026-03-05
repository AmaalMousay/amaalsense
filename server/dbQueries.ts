// @ts-nocheck
/**
 * Real Database Queries for API Integration
 * These queries fetch actual data from the database instead of mock data
 */

import { eq, desc, asc, gte, lte, and, inArray, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  emotionIndices,
  countryEmotionIndices,
  countryEmotionAnalyses,
  emotionAnalyses,
  trendAlerts,
  customAlerts,
  analysisSessions,
  sourceAnalyses,
  dailyAggregates,
} from "../drizzle/schema";

/**
 * Get latest global emotion indices
 */
export async function getLatestGlobalEmotions() {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(emotionIndices)
    .orderBy((t) => desc(t.analyzedAt))
    .limit(1);

  return result[0] || null;
}

/**
 * Get emotion indices history for trend analysis
 */
export async function getEmotionHistory(daysBack: number = 7) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(emotionIndices)
    .where(gte(emotionIndices.analyzedAt, startDate))
    .orderBy((t) => asc(t.analyzedAt));
}

/**
 * Get all countries' latest emotion indices
 */
export async function getAllCountriesLatestEmotions() {
  const db = await getDb();
  if (!db) return [];

  // Get the latest timestamp
  const latestResult = await db
    .select({ maxDate: sql`MAX(${countryEmotionIndices.analyzedAt})` })
    .from(countryEmotionIndices);

  if (!latestResult[0]?.maxDate) return [];

  const maxDate = latestResult[0].maxDate as Date;

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(eq(countryEmotionIndices.analyzedAt, maxDate))
    .orderBy((t) => desc(t.gmi));
}

/**
 * Get emotion data for specific countries
 */
export async function getCountriesEmotionData(countryCodes: string[]) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(inArray(countryEmotionIndices.countryCode, countryCodes))
    .orderBy((t) => desc(t.analyzedAt))
    .limit(countryCodes.length);
}

/**
 * Get recent analyses for a country
 */
export async function getCountryRecentAnalyses(countryCode: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(countryEmotionAnalyses)
    .where(eq(countryEmotionAnalyses.countryCode, countryCode))
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Search analyses by keyword
 */
export async function searchAnalyses(keyword: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(emotionAnalyses)
    .where(sql`MATCH(${emotionAnalyses.headline}) AGAINST(${keyword} IN BOOLEAN MODE)`)
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get active trend alerts
 */
export async function getActiveTrendAlerts(severity?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(trendAlerts)
    .where(eq(trendAlerts.acknowledged, 0));

  if (severity) {
    query = query.where(eq(trendAlerts.severity, severity));
  }

  return await query.orderBy((t) => desc(t.createdAt)).limit(50);
}

/**
 * Get user's custom alerts
 */
export async function getUserAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(customAlerts)
    .where(eq(customAlerts.userId, userId))
    .orderBy((t) => desc(t.updatedAt));
}

/**
 * Get analysis sessions for a user
 */
export async function getUserAnalysisSessions(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(analysisSessions)
    .where(eq(analysisSessions.userId, userId))
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get sources for a specific analysis session
 */
export async function getSessionSources(sessionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sourceAnalyses)
    .where(eq(sourceAnalyses.sessionId, sessionId))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get daily aggregates for trend analysis
 */
export async function getDailyAggregates(
  countryCode?: string,
  daysBack: number = 30
) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  let query = db
    .select()
    .from(dailyAggregates)
    .where(gte(dailyAggregates.aggregateDate, startDate));

  if (countryCode) {
    query = query.where(eq(dailyAggregates.countryCode, countryCode));
  }

  return await query.orderBy((t) => asc(t.aggregateDate));
}

/**
 * Get country emotion history for temporal comparison
 */
export async function getCountryEmotionHistory(
  countryCode: string,
  daysBack: number = 30
) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(
      and(
        eq(countryEmotionIndices.countryCode, countryCode),
        gte(countryEmotionIndices.analyzedAt, startDate)
      )
    )
    .orderBy((t) => asc(t.analyzedAt));
}

/**
 * Compare emotions between multiple countries
 */
export async function compareCountriesEmotions(countryCodes: string[]) {
  const db = await getDb();
  if (!db) return [];

  // Get latest data for each country
  const results = await Promise.all(
    countryCodes.map(async (code) => {
      const data = await db
        .select()
        .from(countryEmotionIndices)
        .where(eq(countryEmotionIndices.countryCode, code))
        .orderBy((t) => desc(t.analyzedAt))
        .limit(1);
      return data[0] || null;
    })
  );

  return results.filter((r) => r !== null);
}

/**
 * Get regional distribution of emotions
 */
export async function getRegionalDistribution() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(countryEmotionIndices)
    .orderBy((t) => desc(t.gmi))
    .limit(50);
}

/**
 * Get emotion hotspots (countries with extreme values)
 */
export async function getEmotionHotspots() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(
      sql`ABS(${countryEmotionIndices.gmi}) > 50 OR ${countryEmotionIndices.cfi} > 70`
    )
    .orderBy((t) => desc(countryEmotionIndices.cfi));
}

/**
 * Get sentiment trend for a topic
 */
export async function getTopicSentimentTrend(topic: string, daysBack: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(analysisSessions)
    .where(
      and(
        sql`MATCH(${analysisSessions.query}) AGAINST(${topic} IN BOOLEAN MODE)`,
        gte(analysisSessions.createdAt, startDate)
      )
    )
    .orderBy((t) => asc(t.createdAt));
}

/**
 * Get most analyzed topics
 */
export async function getMostAnalyzedTopics(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      query: analysisSessions.query,
      count: sql`COUNT(*) as count`,
      avgGmi: sql`AVG(${analysisSessions.gmi}) as avgGmi`,
      avgCfi: sql`AVG(${analysisSessions.cfi}) as avgCfi`,
      avgHri: sql`AVG(${analysisSessions.hri}) as avgHri`,
    })
    .from(analysisSessions)
    .groupBy(analysisSessions.query)
    .orderBy(sql`count DESC`)
    .limit(limit);
}

/**
 * Get emotion distribution for a region
 */
export async function getRegionEmotionDistribution(countryCode: string) {
  const db = await getDb();
  if (!db) return null;

  const analyses = await db
    .select()
    .from(countryEmotionAnalyses)
    .where(eq(countryEmotionAnalyses.countryCode, countryCode))
    .limit(100);

  if (analyses.length === 0) return null;

  const distribution = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  analyses.forEach((a) => {
    distribution.joy += a.joy;
    distribution.fear += a.fear;
    distribution.anger += a.anger;
    distribution.sadness += a.sadness;
    distribution.hope += a.hope;
    distribution.curiosity += a.curiosity;
  });

  const count = analyses.length;
  return {
    joy: Math.round(distribution.joy / count),
    fear: Math.round(distribution.fear / count),
    anger: Math.round(distribution.anger / count),
    sadness: Math.round(distribution.sadness / count),
    hope: Math.round(distribution.hope / count),
    curiosity: Math.round(distribution.curiosity / count),
  };
}

/**
 * Get recent breaking news (high confidence, recent analyses)
 */
export async function getBreakingNews(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  return await db
    .select()
    .from(emotionAnalyses)
    .where(
      and(
        gte(emotionAnalyses.createdAt, oneHourAgo),
        gte(emotionAnalyses.confidence, 80)
      )
    )
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get prediction confidence scores
 */
export async function getPredictionConfidence(topic: string) {
  const db = await getDb();
  if (!db) return null;

  const sessions = await db
    .select()
    .from(analysisSessions)
    .where(sql`MATCH(${analysisSessions.query}) AGAINST(${topic} IN BOOLEAN MODE)`)
    .orderBy((t) => desc(t.createdAt))
    .limit(10);

  if (sessions.length === 0) return null;

  const avgConfidence =
    sessions.reduce((sum, s) => sum + s.confidence, 0) / sessions.length;

  return {
    topic,
    confidence: Math.round(avgConfidence),
    dataPoints: sessions.length,
    lastUpdated: sessions[0]?.createdAt,
  };
}
