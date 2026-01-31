/**
 * Temporal Emotion Analyzer
 * 
 * Tracks and analyzes how emotions change over time for topics.
 * Provides:
 * 1. Historical emotion tracking
 * 2. Trend analysis (hourly, daily, weekly, monthly)
 * 3. Emotion change detection
 * 4. Predictive insights
 */

import { getDb } from "./db";
import { topicEmotionHistory, emotionTrends } from "../drizzle/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

// Types
export interface EmotionSnapshot {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
  dominantEmotion: string;
  sourcesCount: number;
  analyzedAt: Date;
}

export interface TrendData {
  period: "hourly" | "daily" | "weekly" | "monthly";
  periodStart: Date;
  periodEnd: Date;
  avgGmi: number;
  avgCfi: number;
  avgHri: number;
  gmiChange: number;
  cfiChange: number;
  hriChange: number;
  analysisCount: number;
  dominantEmotion: string;
}

export interface TemporalAnalysis {
  topic: string;
  currentSnapshot: EmotionSnapshot | null;
  previousSnapshot: EmotionSnapshot | null;
  change: {
    gmiChange: number;
    cfiChange: number;
    hriChange: number;
    emotionShift: string | null;
  };
  trend: "improving" | "declining" | "stable" | "volatile";
  trendStrength: number; // 0-100
  historicalData: EmotionSnapshot[];
}

/**
 * Normalize topic for consistent grouping
 */
function normalizeTopic(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF]/g, "") // Keep alphanumeric and Arabic
    .replace(/\s+/g, " ")
    .substring(0, 200);
}

/**
 * Determine dominant emotion from scores
 */
function getDominantEmotion(emotions: {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
}): string {
  const entries = Object.entries(emotions);
  let max = { name: "neutral", value: 0 };
  
  for (const [name, value] of entries) {
    if (value > max.value) {
      max = { name, value };
    }
  }
  
  return max.name;
}

/**
 * Store an emotion snapshot for a topic
 */
export async function storeEmotionSnapshot(snapshot: EmotionSnapshot): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[TemporalAnalyzer] Database not available");
    return;
  }
  
  try {
    const normalizedTopic = normalizeTopic(snapshot.topic);
    
    await db.insert(topicEmotionHistory).values({
      topic: snapshot.topic,
      normalizedTopic,
      gmi: snapshot.gmi,
      cfi: snapshot.cfi,
      hri: snapshot.hri,
      joy: snapshot.joy,
      fear: snapshot.fear,
      anger: snapshot.anger,
      sadness: snapshot.sadness,
      hope: snapshot.hope,
      curiosity: snapshot.curiosity,
      dominantEmotion: snapshot.dominantEmotion,
      sourcesCount: snapshot.sourcesCount,
      analyzedAt: snapshot.analyzedAt,
    });
    
    console.log(`[TemporalAnalyzer] Stored snapshot for: ${snapshot.topic}`);
  } catch (error) {
    console.error("[TemporalAnalyzer] Error storing snapshot:", error);
  }
}

/**
 * Get historical data for a topic
 */
export async function getTopicHistory(
  topic: string,
  limit: number = 50
): Promise<EmotionSnapshot[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  try {
    const normalizedTopic = normalizeTopic(topic);
    
    const history = await db.select()
      .from(topicEmotionHistory)
      .where(eq(topicEmotionHistory.normalizedTopic, normalizedTopic))
      .orderBy(desc(topicEmotionHistory.analyzedAt))
      .limit(limit);
    
    return history.map(h => ({
      topic: h.topic,
      gmi: h.gmi,
      cfi: h.cfi,
      hri: h.hri,
      joy: h.joy,
      fear: h.fear,
      anger: h.anger,
      sadness: h.sadness,
      hope: h.hope,
      curiosity: h.curiosity,
      dominantEmotion: h.dominantEmotion,
      sourcesCount: h.sourcesCount,
      analyzedAt: h.analyzedAt || new Date(),
    }));
  } catch (error) {
    console.error("[TemporalAnalyzer] Error getting history:", error);
    return [];
  }
}

/**
 * Analyze temporal changes for a topic
 */
export async function analyzeTemporalChanges(
  topic: string,
  currentData: {
    gmi: number;
    cfi: number;
    hri: number;
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
    sourcesCount: number;
  }
): Promise<TemporalAnalysis> {
  const history = await getTopicHistory(topic, 20);
  
  const currentSnapshot: EmotionSnapshot = {
    topic,
    ...currentData,
    dominantEmotion: getDominantEmotion({
      joy: currentData.joy,
      fear: currentData.fear,
      anger: currentData.anger,
      sadness: currentData.sadness,
      hope: currentData.hope,
      curiosity: currentData.curiosity,
    }),
    analyzedAt: new Date(),
  };
  
  // Store current snapshot
  await storeEmotionSnapshot(currentSnapshot);
  
  // Get previous snapshot (if exists)
  const previousSnapshot = history.length > 0 ? history[0] : null;
  
  // Calculate changes
  const change = {
    gmiChange: previousSnapshot ? currentData.gmi - previousSnapshot.gmi : 0,
    cfiChange: previousSnapshot ? currentData.cfi - previousSnapshot.cfi : 0,
    hriChange: previousSnapshot ? currentData.hri - previousSnapshot.hri : 0,
    emotionShift: previousSnapshot && previousSnapshot.dominantEmotion !== currentSnapshot.dominantEmotion
      ? `${previousSnapshot.dominantEmotion} → ${currentSnapshot.dominantEmotion}`
      : null,
  };
  
  // Determine trend
  let trend: "improving" | "declining" | "stable" | "volatile" = "stable";
  let trendStrength = 50;
  
  if (history.length >= 3) {
    // Calculate trend from recent history
    const recentGmiValues = history.slice(0, 5).map(h => h.gmi);
    const avgChange = recentGmiValues.reduce((sum, val, i, arr) => {
      if (i === 0) return sum;
      return sum + (val - arr[i - 1]);
    }, 0) / (recentGmiValues.length - 1);
    
    // Calculate volatility
    const variance = recentGmiValues.reduce((sum, val) => {
      const mean = recentGmiValues.reduce((s, v) => s + v, 0) / recentGmiValues.length;
      return sum + Math.pow(val - mean, 2);
    }, 0) / recentGmiValues.length;
    const volatility = Math.sqrt(variance);
    
    if (volatility > 20) {
      trend = "volatile";
      trendStrength = Math.min(100, Math.round(volatility * 2));
    } else if (avgChange > 5) {
      trend = "improving";
      trendStrength = Math.min(100, Math.round(avgChange * 5));
    } else if (avgChange < -5) {
      trend = "declining";
      trendStrength = Math.min(100, Math.round(Math.abs(avgChange) * 5));
    } else {
      trend = "stable";
      trendStrength = 100 - Math.round(volatility * 3);
    }
  }
  
  return {
    topic,
    currentSnapshot,
    previousSnapshot,
    change,
    trend,
    trendStrength,
    historicalData: history,
  };
}

/**
 * Store aggregated trend data
 */
export async function storeTrendData(
  topic: string,
  period: "hourly" | "daily" | "weekly" | "monthly",
  data: Omit<TrendData, "period" | "periodStart" | "periodEnd">
): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }
  
  try {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;
    
    switch (period) {
      case "hourly":
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
        periodEnd = new Date(periodStart.getTime() + 60 * 60 * 1000);
        break;
      case "daily":
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0);
        periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
        break;
    }
    
    await db.insert(emotionTrends).values({
      topic: topic || "global",
      period,
      periodStart,
      periodEnd,
      avgGmi: data.avgGmi,
      avgCfi: data.avgCfi,
      avgHri: data.avgHri,
      gmiChange: data.gmiChange,
      cfiChange: data.cfiChange,
      hriChange: data.hriChange,
      analysisCount: data.analysisCount,
      dominantEmotion: data.dominantEmotion,
    });
    
    console.log(`[TemporalAnalyzer] Stored ${period} trend for: ${topic || "global"}`);
  } catch (error) {
    console.error("[TemporalAnalyzer] Error storing trend:", error);
  }
}

/**
 * Get trend data for a topic
 */
export async function getTrendData(
  topic: string,
  period: "hourly" | "daily" | "weekly" | "monthly",
  limit: number = 10
): Promise<TrendData[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  try {
    const trends = await db.select()
      .from(emotionTrends)
      .where(and(
        eq(emotionTrends.topic, topic || "global"),
        eq(emotionTrends.period, period)
      ))
      .orderBy(desc(emotionTrends.periodStart))
      .limit(limit);
    
    return trends.map(t => ({
      period: t.period,
      periodStart: t.periodStart,
      periodEnd: t.periodEnd,
      avgGmi: t.avgGmi,
      avgCfi: t.avgCfi,
      avgHri: t.avgHri,
      gmiChange: t.gmiChange || 0,
      cfiChange: t.cfiChange || 0,
      hriChange: t.hriChange || 0,
      analysisCount: t.analysisCount,
      dominantEmotion: t.dominantEmotion || "neutral",
    }));
  } catch (error) {
    console.error("[TemporalAnalyzer] Error getting trends:", error);
    return [];
  }
}

/**
 * Generate temporal insights for a topic
 */
export function generateTemporalInsights(analysis: TemporalAnalysis): string[] {
  const insights: string[] = [];
  
  // Trend insight
  switch (analysis.trend) {
    case "improving":
      insights.push(`المشاعر تتحسن بقوة ${analysis.trendStrength}%`);
      break;
    case "declining":
      insights.push(`المشاعر في انخفاض بقوة ${analysis.trendStrength}%`);
      break;
    case "volatile":
      insights.push(`المشاعر متقلبة - تغيرات سريعة ملحوظة`);
      break;
    case "stable":
      insights.push(`المشاعر مستقرة نسبياً`);
      break;
  }
  
  // Change insights
  if (analysis.change.gmiChange > 10) {
    insights.push(`تحسن كبير في مؤشر المزاج العام (+${analysis.change.gmiChange})`);
  } else if (analysis.change.gmiChange < -10) {
    insights.push(`انخفاض ملحوظ في مؤشر المزاج العام (${analysis.change.gmiChange})`);
  }
  
  if (analysis.change.cfiChange > 15) {
    insights.push(`ارتفاع في مستوى الخوف الجماعي (+${analysis.change.cfiChange})`);
  } else if (analysis.change.cfiChange < -15) {
    insights.push(`انخفاض في مستوى الخوف الجماعي (${analysis.change.cfiChange})`);
  }
  
  if (analysis.change.hriChange > 10) {
    insights.push(`زيادة في الأمل والمرونة (+${analysis.change.hriChange})`);
  } else if (analysis.change.hriChange < -10) {
    insights.push(`انخفاض في الأمل والمرونة (${analysis.change.hriChange})`);
  }
  
  // Emotion shift insight
  if (analysis.change.emotionShift) {
    insights.push(`تحول في الشعور السائد: ${analysis.change.emotionShift}`);
  }
  
  // Historical context
  if (analysis.historicalData.length > 5) {
    insights.push(`تم تحليل هذا الموضوع ${analysis.historicalData.length} مرة سابقاً`);
  }
  
  return insights;
}

/**
 * Compare current analysis with historical average
 */
export function compareWithHistoricalAverage(
  current: EmotionSnapshot,
  history: EmotionSnapshot[]
): {
  gmiVsAvg: number;
  cfiVsAvg: number;
  hriVsAvg: number;
  isAboveAverage: boolean;
} {
  if (history.length === 0) {
    return {
      gmiVsAvg: 0,
      cfiVsAvg: 0,
      hriVsAvg: 0,
      isAboveAverage: true,
    };
  }
  
  const avgGmi = history.reduce((sum, h) => sum + h.gmi, 0) / history.length;
  const avgCfi = history.reduce((sum, h) => sum + h.cfi, 0) / history.length;
  const avgHri = history.reduce((sum, h) => sum + h.hri, 0) / history.length;
  
  return {
    gmiVsAvg: Math.round(current.gmi - avgGmi),
    cfiVsAvg: Math.round(current.cfi - avgCfi),
    hriVsAvg: Math.round(current.hri - avgHri),
    isAboveAverage: current.gmi > avgGmi,
  };
}
