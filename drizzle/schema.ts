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