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
