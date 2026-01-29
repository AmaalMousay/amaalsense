import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Subscription tier: free, pro, enterprise, government */
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "enterprise", "government"]).default("free").notNull(),
  /** Subscription start date */
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  /** Subscription end date */
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  /** Organization name for enterprise/government users */
  organizationName: varchar("organizationName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Emotion Indices Table - stores the three main indices (GMI, CFI, HRI)
 * Each record represents a snapshot of collective emotions at a specific time
 */
export const emotionIndices = mysqlTable("emotion_indices", {
  id: int("id").autoincrement().primaryKey(),
  /** Global Mood Index: Overall collective mood (-100 to +100) */
  gmi: int("gmi").notNull().default(0),
  /** Collective Fear Index: Level of collective fear (0 to 100) */
  cfi: int("cfi").notNull().default(0),
  /** Hope Resilience Index: Level of hope and resilience (0 to 100) */
  hri: int("hri").notNull().default(0),
  /** Confidence score for the analysis */
  confidence: int("confidence").notNull().default(75),
  /** Timestamp of the analysis */
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmotionIndex = typeof emotionIndices.$inferSelect;
export type InsertEmotionIndex = typeof emotionIndices.$inferInsert;

/**
 * Emotion Analysis Records - stores individual headline analysis results
 */
export const emotionAnalyses = mysqlTable("emotion_analyses", {
  id: int("id").autoincrement().primaryKey(),
  /** The analyzed headline text */
  headline: text("headline").notNull(),
  /** Emotion vector: joy (0-100) */
  joy: int("joy").notNull().default(0),
  /** Emotion vector: fear (0-100) */
  fear: int("fear").notNull().default(0),
  /** Emotion vector: anger (0-100) */
  anger: int("anger").notNull().default(0),
  /** Emotion vector: sadness (0-100) */
  sadness: int("sadness").notNull().default(0),
  /** Emotion vector: hope (0-100) */
  hope: int("hope").notNull().default(0),
  /** Emotion vector: curiosity (0-100) */
  curiosity: int("curiosity").notNull().default(0),
  /** Dominant emotion detected */
  dominantEmotion: varchar("dominant_emotion", { length: 32 }).notNull(),
  /** Confidence score of the analysis */
  confidence: int("confidence").notNull().default(75),
  /** Analysis model used (transformer/vader) */
  model: varchar("model", { length: 32 }).default("transformer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmotionAnalysis = typeof emotionAnalyses.$inferSelect;
export type InsertEmotionAnalysis = typeof emotionAnalyses.$inferInsert;

/**
 * Country Emotion Indices Table - stores emotion indices for each country
 * Allows tracking emotional state by geographic region
 */
export const countryEmotionIndices = mysqlTable("country_emotion_indices", {
  id: int("id").autoincrement().primaryKey(),
  /** ISO 3166-1 alpha-2 country code (e.g., 'SA', 'US', 'GB') */
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  /** Country name */
  countryName: varchar("country_name", { length: 100 }).notNull(),
  /** Global Mood Index for the country (-100 to +100) */
  gmi: int("gmi").notNull().default(0),
  /** Collective Fear Index for the country (0 to 100) */
  cfi: int("cfi").notNull().default(0),
  /** Hope Resilience Index for the country (0 to 100) */
  hri: int("hri").notNull().default(0),
  /** Confidence score for the analysis */
  confidence: int("confidence").notNull().default(75),
  /** Timestamp of the analysis */
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CountryEmotionIndex = typeof countryEmotionIndices.$inferSelect;
export type InsertCountryEmotionIndex = typeof countryEmotionIndices.$inferInsert;

/**
 * Country Emotion Analyses - stores detailed emotion vectors for each country
 */
export const countryEmotionAnalyses = mysqlTable("country_emotion_analyses", {
  id: int("id").autoincrement().primaryKey(),
  /** ISO 3166-1 alpha-2 country code */
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  /** Country name */
  countryName: varchar("country_name", { length: 100 }).notNull(),
  /** The analyzed headline or news source */
  source: text("source").notNull(),
  /** Emotion vector: joy (0-100) */
  joy: int("joy").notNull().default(0),
  /** Emotion vector: fear (0-100) */
  fear: int("fear").notNull().default(0),
  /** Emotion vector: anger (0-100) */
  anger: int("anger").notNull().default(0),
  /** Emotion vector: sadness (0-100) */
  sadness: int("sadness").notNull().default(0),
  /** Emotion vector: hope (0-100) */
  hope: int("hope").notNull().default(0),
  /** Emotion vector: curiosity (0-100) */
  curiosity: int("curiosity").notNull().default(0),
  /** Dominant emotion detected */
  dominantEmotion: varchar("dominant_emotion", { length: 32 }).notNull(),
  /** Confidence score of the analysis */
  confidence: int("confidence").notNull().default(75),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CountryEmotionAnalysis = typeof countryEmotionAnalyses.$inferSelect;
export type InsertCountryEmotionAnalysis = typeof countryEmotionAnalyses.$inferInsert;

/**
 * Usage Tracking Table - tracks API calls and analyses per user
 */
export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID */
  userId: int("userId").notNull(),
  /** Type of usage: analysis, api_call, report, map_view */
  usageType: varchar("usageType", { length: 32 }).notNull(),
  /** Count of usage for this record */
  count: int("count").notNull().default(1),
  /** Date of usage (for daily tracking) */
  usageDate: timestamp("usageDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Enterprise Inquiries Table - stores contact requests from potential enterprise clients
 */
export const enterpriseInquiries = mysqlTable("enterprise_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  /** Contact name */
  contactName: varchar("contactName", { length: 255 }).notNull(),
  /** Contact email */
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  /** Organization name */
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  /** Organization type: government, ngo, media, enterprise, academic */
  organizationType: varchar("organizationType", { length: 64 }).notNull(),
  /** Country */
  country: varchar("country", { length: 100 }),
  /** Interested tier: pro, enterprise, government */
  interestedTier: varchar("interestedTier", { length: 32 }).notNull(),
  /** Message/requirements */
  message: text("message"),
  /** Status: new, contacted, demo_scheduled, negotiating, closed_won, closed_lost */
  status: varchar("status", { length: 32 }).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EnterpriseInquiry = typeof enterpriseInquiries.$inferSelect;
export type InsertEnterpriseInquiry = typeof enterpriseInquiries.$inferInsert;


/**
 * Historical Analysis Sessions - stores complete analysis sessions
 * Each session represents a full analysis run with all data sources
 */
export const analysisSessions = mysqlTable("analysis_sessions", {
  id: int("id").autoincrement().primaryKey(),
  /** User who initiated the analysis (null for system/scheduled) */
  userId: int("userId"),
  /** Session type: manual, scheduled, api */
  sessionType: varchar("sessionType", { length: 32 }).default("manual").notNull(),
  /** Query or topic analyzed */
  query: varchar("query", { length: 500 }),
  /** Country code if country-specific */
  countryCode: varchar("countryCode", { length: 2 }),
  /** Global Mood Index result */
  gmi: int("gmi").notNull().default(0),
  /** Collective Fear Index result */
  cfi: int("cfi").notNull().default(0),
  /** Hope Resilience Index result */
  hri: int("hri").notNull().default(0),
  /** Overall sentiment score (-1 to 1) stored as int (-100 to 100) */
  sentimentScore: int("sentimentScore").notNull().default(0),
  /** Dominant emotion */
  dominantEmotion: varchar("dominantEmotion", { length: 32 }),
  /** Number of sources analyzed */
  sourcesCount: int("sourcesCount").notNull().default(0),
  /** Sources breakdown JSON: {news: 10, reddit: 5, youtube: 3, ...} */
  sourcesBreakdown: text("sourcesBreakdown"),
  /** Average confidence */
  confidence: int("confidence").notNull().default(75),
  /** Analysis duration in milliseconds */
  durationMs: int("durationMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalysisSession = typeof analysisSessions.$inferSelect;
export type InsertAnalysisSession = typeof analysisSessions.$inferInsert;

/**
 * Source Analysis Records - stores individual source analyses within a session
 */
export const sourceAnalyses = mysqlTable("source_analyses", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to parent session */
  sessionId: int("sessionId").notNull(),
  /** Source platform: news, reddit, youtube, mastodon, bluesky, telegram */
  platform: varchar("platform", { length: 32 }).notNull(),
  /** Original content text */
  content: text("content").notNull(),
  /** Source URL */
  sourceUrl: varchar("sourceUrl", { length: 1000 }),
  /** Author/channel name */
  author: varchar("author", { length: 255 }),
  /** Sentiment score (-100 to 100) */
  sentimentScore: int("sentimentScore").notNull().default(0),
  /** Emotion: joy */
  joy: int("joy").notNull().default(0),
  /** Emotion: fear */
  fear: int("fear").notNull().default(0),
  /** Emotion: anger */
  anger: int("anger").notNull().default(0),
  /** Emotion: sadness */
  sadness: int("sadness").notNull().default(0),
  /** Emotion: hope */
  hope: int("hope").notNull().default(0),
  /** Emotion: curiosity */
  curiosity: int("curiosity").notNull().default(0),
  /** Dominant emotion */
  dominantEmotion: varchar("dominantEmotion", { length: 32 }),
  /** Confidence score */
  confidence: int("confidence").notNull().default(75),
  /** Original publish date */
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SourceAnalysis = typeof sourceAnalyses.$inferSelect;
export type InsertSourceAnalysis = typeof sourceAnalyses.$inferInsert;

/**
 * Daily Aggregates - pre-computed daily statistics for fast trend queries
 */
export const dailyAggregates = mysqlTable("daily_aggregates", {
  id: int("id").autoincrement().primaryKey(),
  /** Date of aggregation (YYYY-MM-DD stored as timestamp) */
  aggregateDate: timestamp("aggregateDate").notNull(),
  /** Country code (null for global) */
  countryCode: varchar("countryCode", { length: 2 }),
  /** Average GMI for the day */
  avgGmi: int("avgGmi").notNull().default(0),
  /** Average CFI for the day */
  avgCfi: int("avgCfi").notNull().default(0),
  /** Average HRI for the day */
  avgHri: int("avgHri").notNull().default(0),
  /** Average sentiment score */
  avgSentiment: int("avgSentiment").notNull().default(0),
  /** Most frequent dominant emotion */
  topEmotion: varchar("topEmotion", { length: 32 }),
  /** Total analyses count */
  analysesCount: int("analysesCount").notNull().default(0),
  /** Total sources processed */
  sourcesCount: int("sourcesCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyAggregate = typeof dailyAggregates.$inferSelect;
export type InsertDailyAggregate = typeof dailyAggregates.$inferInsert;

/**
 * Trend Alerts - stores detected significant changes in emotion trends
 */
export const trendAlerts = mysqlTable("trend_alerts", {
  id: int("id").autoincrement().primaryKey(),
  /** Alert type: spike, drop, anomaly, trend_change */
  alertType: varchar("alertType", { length: 32 }).notNull(),
  /** Affected metric: gmi, cfi, hri, sentiment */
  metric: varchar("metric", { length: 32 }).notNull(),
  /** Country code (null for global) */
  countryCode: varchar("countryCode", { length: 2 }),
  /** Previous value */
  previousValue: int("previousValue").notNull(),
  /** Current value */
  currentValue: int("currentValue").notNull(),
  /** Change percentage */
  changePercent: int("changePercent").notNull(),
  /** Alert severity: low, medium, high, critical */
  severity: varchar("severity", { length: 16 }).default("medium").notNull(),
  /** Alert message */
  message: text("message"),
  /** Whether alert has been acknowledged */
  acknowledged: int("acknowledged").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrendAlert = typeof trendAlerts.$inferSelect;
export type InsertTrendAlert = typeof trendAlerts.$inferInsert;
