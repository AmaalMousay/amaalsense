import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("user").notNull(),
  /** Subscription tier: free, pro, enterprise, government */
  subscriptionTier: text("subscriptionTier").default("free").notNull(),
  /** Subscription start date */
  subscriptionStartDate: integer("subscriptionStartDate", { mode: "timestamp" }),
  /** Subscription end date */
  subscriptionEndDate: integer("subscriptionEndDate", { mode: "timestamp" }),
  /** Organization name for enterprise/government users */
  organizationName: text("organizationName"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Emotion Indices Table - stores the three main indices (GMI, CFI, HRI)
 * Each record represents a snapshot of collective emotions at a specific time
 */
export const emotionIndices = sqliteTable("emotion_indices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Global Mood Index: Overall collective mood (-100 to +100) */
  gmi: integer("gmi").notNull().default(0),
  /** Collective Fear Index: Level of collective fear (0 to 100) */
  cfi: integer("cfi").notNull().default(0),
  /** Hope Resilience Index: Level of hope and resilience (0 to 100) */
  hri: integer("hri").notNull().default(0),
  /** Confidence score for the analysis */
  confidence: integer("confidence").notNull().default(75),
  /** Timestamp of the analysis */
  analyzedAt: integer("analyzedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type EmotionIndex = typeof emotionIndices.$inferSelect;
export type InsertEmotionIndex = typeof emotionIndices.$inferInsert;

/**
 * Emotion Analysis Records - stores individual headline analysis results
 */
export const emotionAnalyses = sqliteTable("emotion_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** The analyzed headline text */
  headline: text("headline").notNull(),
  /** Emotion vector: joy (0-100) */
  joy: integer("joy").notNull().default(0),
  /** Emotion vector: fear (0-100) */
  fear: integer("fear").notNull().default(0),
  /** Emotion vector: anger (0-100) */
  anger: integer("anger").notNull().default(0),
  /** Emotion vector: sadness (0-100) */
  sadness: integer("sadness").notNull().default(0),
  /** Emotion vector: hope (0-100) */
  hope: integer("hope").notNull().default(0),
  /** Emotion vector: curiosity (0-100) */
  curiosity: integer("curiosity").notNull().default(0),
  /** Dominant emotion detected */
  dominantEmotion: text("dominant_emotion").notNull(),
  /** Confidence score of the analysis */
  confidence: integer("confidence").notNull().default(75),
  /** Analysis model used (transformer/vader) */
  model: text("model").default("transformer"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type EmotionAnalysis = typeof emotionAnalyses.$inferSelect;
export type InsertEmotionAnalysis = typeof emotionAnalyses.$inferInsert;

/**
 * Country Emotion Indices Table - stores emotion indices for each country
 * Allows tracking emotional state by geographic region
 */
export const countryEmotionIndices = sqliteTable("country_emotion_indices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** ISO 3166-1 alpha-2 country code (e.g., 'SA', 'US', 'GB') */
  countryCode: text("country_code").notNull(),
  /** Country name */
  countryName: text("country_name").notNull(),
  /** Global Mood Index for the country (-100 to +100) */
  gmi: integer("gmi").notNull().default(0),
  /** Collective Fear Index for the country (0 to 100) */
  cfi: integer("cfi").notNull().default(0),
  /** Hope Resilience Index for the country (0 to 100) */
  hri: integer("hri").notNull().default(0),
  /** Confidence score for the analysis */
  confidence: integer("confidence").notNull().default(75),
  /** Timestamp of the analysis */
  analyzedAt: integer("analyzedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type CountryEmotionIndex = typeof countryEmotionIndices.$inferSelect;
export type InsertCountryEmotionIndex = typeof countryEmotionIndices.$inferInsert;

/**
 * Country Emotion Analyses - stores detailed emotion vectors for each country
 */
export const countryEmotionAnalyses = sqliteTable("country_emotion_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** ISO 3166-1 alpha-2 country code */
  countryCode: text("country_code").notNull(),
  /** Country name */
  countryName: text("country_name").notNull(),
  /** The analyzed headline or news source */
  source: text("source").notNull(),
  /** Emotion vector: joy (0-100) */
  joy: integer("joy").notNull().default(0),
  /** Emotion vector: fear (0-100) */
  fear: integer("fear").notNull().default(0),
  /** Emotion vector: anger (0-100) */
  anger: integer("anger").notNull().default(0),
  /** Emotion vector: sadness (0-100) */
  sadness: integer("sadness").notNull().default(0),
  /** Emotion vector: hope (0-100) */
  hope: integer("hope").notNull().default(0),
  /** Emotion vector: curiosity (0-100) */
  curiosity: integer("curiosity").notNull().default(0),
  /** Dominant emotion detected */
  dominantEmotion: text("dominant_emotion").notNull(),
  /** Confidence score of the analysis */
  confidence: integer("confidence").notNull().default(75),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type CountryEmotionAnalysis = typeof countryEmotionAnalyses.$inferSelect;
export type InsertCountryEmotionAnalysis = typeof countryEmotionAnalyses.$inferInsert;

/**
 * Usage Tracking Table - tracks API calls and analyses per user
 */
export const usageTracking = sqliteTable("usage_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID */
  userId: integer("userId").notNull(),
  /** Type of usage: analysis, api_call, report, map_view */
  usageType: text("usageType").notNull(),
  /** Count of usage for this record */
  count: integer("count").notNull().default(1),
  /** Date of usage (for daily tracking) */
  usageDate: integer("usageDate", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Enterprise Inquiries Table - stores contact requests from potential enterprise clients
 */
export const enterpriseInquiries = sqliteTable("enterprise_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Contact name */
  contactName: text("contactName").notNull(),
  /** Contact email */
  contactEmail: text("contactEmail").notNull(),
  /** Organization name */
  organizationName: text("organizationName").notNull(),
  /** Organization type: government, ngo, media, enterprise, academic */
  organizationType: text("organizationType").notNull(),
  /** Country */
  country: text("country"),
  /** Interested tier: pro, enterprise, government */
  interestedTier: text("interestedTier").notNull(),
  /** Message/requirements */
  message: text("message"),
  /** Status: new, contacted, demo_scheduled, negotiating, closed_won, closed_lost */
  status: text("status").default("new").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type EnterpriseInquiry = typeof enterpriseInquiries.$inferSelect;
export type InsertEnterpriseInquiry = typeof enterpriseInquiries.$inferInsert;


/**
 * Historical Analysis Sessions - stores complete analysis sessions
 * Each session represents a full analysis run with all data sources
 */
export const analysisSessions = sqliteTable("analysis_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User who initiated the analysis (null for system/scheduled) */
  userId: integer("userId"),
  /** Session type: manual, scheduled, api */
  sessionType: text("sessionType").default("manual").notNull(),
  /** Query or topic analyzed */
  query: text("query"),
  /** Country code if country-specific */
  countryCode: text("countryCode"),
  /** Global Mood Index result */
  gmi: integer("gmi").notNull().default(0),
  /** Collective Fear Index result */
  cfi: integer("cfi").notNull().default(0),
  /** Hope Resilience Index result */
  hri: integer("hri").notNull().default(0),
  /** Overall sentiment score (-1 to 1) stored as integer (-100 to 100) */
  sentimentScore: integer("sentimentScore").notNull().default(0),
  /** Dominant emotion */
  dominantEmotion: text("dominantEmotion"),
  /** Number of sources analyzed */
  sourcesCount: integer("sourcesCount").notNull().default(0),
  /** Sources breakdown JSON: {news: 10, reddit: 5, youtube: 3, ...} */
  sourcesBreakdown: text("sourcesBreakdown"),
  /** Average confidence */
  confidence: integer("confidence").notNull().default(75),
  /** Analysis duration in milliseconds */
  durationMs: integer("durationMs"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type AnalysisSession = typeof analysisSessions.$inferSelect;
export type InsertAnalysisSession = typeof analysisSessions.$inferInsert;

/**
 * Source Analysis Records - stores individual source analyses within a session
 */
export const sourceAnalyses = sqliteTable("source_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to parent session */
  sessionId: integer("sessionId").notNull(),
  /** Source platform: news, reddit, youtube, mastodon, bluesky, telegram */
  platform: text("platform").notNull(),
  /** Original content text */
  content: text("content").notNull(),
  /** Source URL */
  sourceUrl: text("sourceUrl"),
  /** Author/channel name */
  author: text("author"),
  /** Sentiment score (-100 to 100) */
  sentimentScore: integer("sentimentScore").notNull().default(0),
  /** Emotion: joy */
  joy: integer("joy").notNull().default(0),
  /** Emotion: fear */
  fear: integer("fear").notNull().default(0),
  /** Emotion: anger */
  anger: integer("anger").notNull().default(0),
  /** Emotion: sadness */
  sadness: integer("sadness").notNull().default(0),
  /** Emotion: hope */
  hope: integer("hope").notNull().default(0),
  /** Emotion: curiosity */
  curiosity: integer("curiosity").notNull().default(0),
  /** Dominant emotion */
  dominantEmotion: text("dominantEmotion"),
  /** Confidence score */
  confidence: integer("confidence").notNull().default(75),
  /** Original publish date */
  publishedAt: integer("publishedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type SourceAnalysis = typeof sourceAnalyses.$inferSelect;
export type InsertSourceAnalysis = typeof sourceAnalyses.$inferInsert;

/**
 * Daily Aggregates - pre-computed daily statistics for fast trend queries
 */
export const dailyAggregates = sqliteTable("daily_aggregates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Date of aggregation (YYYY-MM-DD stored as timestamp) */
  aggregateDate: integer("aggregateDate", { mode: "timestamp" }).notNull(),
  /** Country code (null for global) */
  countryCode: text("countryCode"),
  /** Average GMI for the day */
  avgGmi: integer("avgGmi").notNull().default(0),
  /** Average CFI for the day */
  avgCfi: integer("avgCfi").notNull().default(0),
  /** Average HRI for the day */
  avgHri: integer("avgHri").notNull().default(0),
  /** Average sentiment score */
  avgSentiment: integer("avgSentiment").notNull().default(0),
  /** Most frequent dominant emotion */
  topEmotion: text("topEmotion"),
  /** Total analyses count */
  analysesCount: integer("analysesCount").notNull().default(0),
  /** Total sources processed */
  sourcesCount: integer("sourcesCount").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type DailyAggregate = typeof dailyAggregates.$inferSelect;
export type InsertDailyAggregate = typeof dailyAggregates.$inferInsert;

/**
 * Trend Alerts - stores detected significant changes in emotion trends
 */
export const trendAlerts = sqliteTable("trend_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Alert type: spike, drop, anomaly, trend_change */
  alertType: text("alertType").notNull(),
  /** Affected metric: gmi, cfi, hri, sentiment */
  metric: text("metric").notNull(),
  /** Country code (null for global) */
  countryCode: text("countryCode"),
  /** Previous value */
  previousValue: integer("previousValue").notNull(),
  /** Current value */
  currentValue: integer("currentValue").notNull(),
  /** Change percentage */
  changePercent: integer("changePercent").notNull(),
  /** Alert severity: low, medium, high, critical */
  severity: text("severity").default("medium").notNull(),
  /** Alert message */
  message: text("message"),
  /** Whether alert has been acknowledged */
  acknowledged: integer("acknowledged", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TrendAlert = typeof trendAlerts.$inferSelect;
export type InsertTrendAlert = typeof trendAlerts.$inferInsert;


/**
 * Payment Records - stores payment submissions and confirmations
 */
export const paymentRecords = sqliteTable("payment_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID (null for guest payments) */
  userId: integer("userId"),
  /** Subscriber email */
  email: text("email").notNull(),
  /** Subscriber name */
  name: text("name").notNull(),
  /** Selected plan: pro, enterprise, government */
  plan: text("plan").notNull(),
  /** Payment amount in USD */
  amount: integer("amount").notNull(),
  /** Billing period: monthly, annual */
  billingPeriod: text("billingPeriod").default("monthly").notNull(),
  /** Payment method: paypal, bank_transfer, western_union, moneygram, crypto */
  paymentMethod: text("paymentMethod").notNull(),
  /** Transaction reference/ID provided by user */
  transactionRef: text("transactionRef"),
  /** Additional payment details (JSON) */
  paymentDetails: text("paymentDetails"),
  /** Payment status: pending, confirmed, rejected, refunded */
  status: text("status").default("pending").notNull(),
  /** Admin notes */
  adminNotes: text("adminNotes"),
  /** Confirmation date */
  confirmedAt: integer("confirmedAt", { mode: "timestamp" }),
  /** Confirmed by (admin user ID) */
  confirmedBy: integer("confirmedBy"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = typeof paymentRecords.$inferInsert;


/**
 * Custom Alerts - user-defined alert conditions
 */
export const customAlerts = sqliteTable("custom_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID who created the alert */
  userId: integer("userId").notNull(),
  /** Alert name */
  name: text("name").notNull(),
  /** Country code to monitor (null for global) */
  countryCode: text("countryCode"),
  /** Country name for display */
  countryName: text("countryName"),
  /** Metric to monitor: gmi, cfi, hri */
  metric: text("metric").notNull(),
  /** Condition: above, below, change */
  condition: text("condition").notNull(),
  /** Threshold value */
  threshold: integer("threshold").notNull(),
  /** Whether alert is active */
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  /** Notification method: email, telegram, both */
  notifyMethod: text("notifyMethod").default("email").notNull(),
  /** Last triggered timestamp */
  lastTriggered: integer("lastTriggered", { mode: "timestamp" }),
  /** Number of times triggered */
  triggerCount: integer("triggerCount").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type CustomAlert = typeof customAlerts.$inferSelect;
export type InsertCustomAlert = typeof customAlerts.$inferInsert;


/**
 * User Registrations - stores users who registered via email/password
 */
export const userRegistrations = sqliteTable("user_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User's full name */
  name: text("name").notNull(),
  /** User's email address (unique) */
  email: text("email").notNull().unique(),
  /** Hashed password (bcrypt) */
  passwordHash: text("passwordHash").notNull(),
  /** Account type: individual or organization */
  accountType: text("accountType").default("individual").notNull(),
  /** Organization name (for organization accounts) */
  organizationName: text("organizationName"),
  /** Organization website */
  organizationWebsite: text("organizationWebsite"),
  /** Company size */
  companySize: text("companySize"),
  /** Job title */
  jobTitle: text("jobTitle"),
  /** Email verification token */
  verificationToken: text("verificationToken"),
  /** Token expiration date */
  tokenExpiresAt: integer("tokenExpiresAt", { mode: "timestamp" }),
  /** Whether email is verified */
  isVerified: integer("isVerified", { mode: "boolean" }).default(false).notNull(),
  /** Verification date */
  verifiedAt: integer("verifiedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type UserRegistration = typeof userRegistrations.$inferSelect;
export type InsertUserRegistration = typeof userRegistrations.$inferInsert;

/**
 * Password Reset Tokens - stores password reset requests
 */
export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User's email address */
  email: text("email").notNull(),
  /** Reset token (unique) */
  token: text("token").notNull().unique(),
  /** Token expiration date */
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  /** Whether token has been used */
  isUsed: integer("isUsed", { mode: "boolean" }).default(false).notNull(),
  /** IP address of requester */
  ipAddress: text("ipAddress"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;


/**
 * Classified Analyses - stores analyses with content classification and sensitivity
 */
export const classifiedAnalyses = sqliteTable("classified_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID who performed the analysis */
  userId: integer("userId"),
  /** The analyzed headline/text */
  headline: text("headline").notNull(),
  /** Content domain: politics, economy, mental_health, medical, education, society, entertainment, general */
  domain: text("domain").notNull(),
  /** Sensitivity level: low, medium, high, critical */
  sensitivity: text("sensitivity").notNull(),
  /** Emotional risk score (0-100) */
  emotionalRiskScore: integer("emotionalRiskScore").notNull().default(50),
  /** Emotion vector: joy (0-100) */
  joy: integer("joy").notNull().default(0),
  /** Emotion vector: fear (0-100) */
  fear: integer("fear").notNull().default(0),
  /** Emotion vector: anger (0-100) */
  anger: integer("anger").notNull().default(0),
  /** Emotion vector: sadness (0-100) */
  sadness: integer("sadness").notNull().default(0),
  /** Emotion vector: hope (0-100) */
  hope: integer("hope").notNull().default(0),
  /** Emotion vector: curiosity (0-100) */
  curiosity: integer("curiosity").notNull().default(0),
  /** Dominant emotion detected */
  dominantEmotion: text("dominantEmotion").notNull(),
  /** Confidence score of the analysis */
  confidence: integer("confidence").notNull().default(75),
  /** Analysis model used */
  model: text("model").default("hybrid"),
  /** DCFT weight percentage */
  dcftWeight: integer("dcftWeight").default(70),
  /** AI weight percentage */
  aiWeight: integer("aiWeight").default(30),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type ClassifiedAnalysis = typeof classifiedAnalyses.$inferSelect;
export type InsertClassifiedAnalysis = typeof classifiedAnalyses.$inferInsert;

/**
 * Followed Topics - topics that users want to track for alerts
 */
export const followedTopics = sqliteTable("followed_topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID who is following */
  userId: integer("userId").notNull(),
  /** Topic keyword or phrase */
  topic: text("topic").notNull(),
  /** Content domain filter (null for all domains) */
  domain: text("domain"),
  /** Alert threshold for emotional risk (0-100, null for any change) */
  riskThreshold: integer("riskThreshold"),
  /** Alert on risk increase, decrease, or both */
  alertDirection: text("alertDirection").default("both").notNull(),
  /** Whether following is active */
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  /** Last known emotional risk score */
  lastRiskScore: integer("lastRiskScore"),
  /** Last analysis timestamp */
  lastAnalyzedAt: integer("lastAnalyzedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type FollowedTopic = typeof followedTopics.$inferSelect;
export type InsertFollowedTopic = typeof followedTopics.$inferInsert;

/**
 * Topic Alerts - notifications sent to users about followed topics
 */
export const topicAlerts = sqliteTable("topic_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID to notify */
  userId: integer("userId").notNull(),
  /** Reference to followed topic */
  followedTopicId: integer("followedTopicId").notNull(),
  /** Alert type: risk_increase, risk_decrease, threshold_exceeded, new_analysis */
  alertType: text("alertType").notNull(),
  /** Topic text */
  topic: text("topic").notNull(),
  /** Previous risk score */
  previousRiskScore: integer("previousRiskScore"),
  /** Current risk score */
  currentRiskScore: integer("currentRiskScore").notNull(),
  /** Change amount */
  changeAmount: integer("changeAmount"),
  /** Alert message */
  message: text("message"),
  /** Whether alert has been read */
  isRead: integer("isRead", { mode: "boolean" }).default(false).notNull(),
  /** Read timestamp */
  readAt: integer("readAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TopicAlert = typeof topicAlerts.$inferSelect;
export type InsertTopicAlert = typeof topicAlerts.$inferInsert;


/**
 * ============================================
 * ACTIVE LEARNING SYSTEM TABLES
 * ============================================
 */

/**
 * Learning Patterns - stores successful analysis patterns for active learning
 * The system learns from these patterns to improve future analyses
 */
export const learningPatterns = sqliteTable("learning_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Original text that was analyzed */
  originalText: text("originalText").notNull(),
  /** Detected language */
  language: text("language").notNull(),
  /** Detected dialect (if applicable) */
  dialect: text("dialect"),
  /** Detected event type: death, disaster, celebration, politics, economy, sports, entertainment */
  eventType: text("eventType").notNull(),
  /** Detected region: arab_maghreb, arab_gulf, arab_levant, western, asian, african, latin */
  region: text("region").notNull(),
  /** Context classification confidence (0-100) */
  contextConfidence: integer("contextConfidence").notNull(),
  /** Final joy score after adjustment */
  finalJoy: integer("finalJoy").notNull(),
  /** Final fear score after adjustment */
  finalFear: integer("finalFear").notNull(),
  /** Final anger score after adjustment */
  finalAnger: integer("finalAnger").notNull(),
  /** Final sadness score after adjustment */
  finalSadness: integer("finalSadness").notNull(),
  /** Final hope score after adjustment */
  finalHope: integer("finalHope").notNull(),
  /** Final curiosity score after adjustment */
  finalCuriosity: integer("finalCuriosity").notNull(),
  /** User feedback: accurate, inaccurate, partially_accurate */
  userFeedback: text("userFeedback"),
  /** Feedback timestamp */
  feedbackAt: integer("feedbackAt", { mode: "timestamp" }),
  /** Number of times this pattern was used for learning */
  usageCount: integer("usageCount").default(0).notNull(),
  /** Whether this pattern is verified and trusted */
  isVerified: integer("isVerified", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type LearningPattern = typeof learningPatterns.$inferSelect;
export type InsertLearningPattern = typeof learningPatterns.$inferInsert;

/**
 * Keyword Learning - stores learned keywords and their emotional associations
 */
export const keywordLearning = sqliteTable("keyword_learning", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** The keyword or phrase */
  keyword: text("keyword").notNull(),
  /** Language of the keyword */
  language: text("language").notNull(),
  /** Associated event type */
  eventType: text("eventType").notNull(),
  /** Emotional weight: -100 (very negative) to +100 (very positive) */
  emotionalWeight: integer("emotionalWeight").notNull(),
  /** Primary emotion associated: joy, fear, anger, sadness, hope, curiosity */
  primaryEmotion: text("primaryEmotion").notNull(),
  /** Confidence in this association (0-100) */
  confidence: integer("confidence").notNull().default(50),
  /** Number of times this keyword was encountered */
  occurrenceCount: integer("occurrenceCount").default(1).notNull(),
  /** Source: manual, learned, imported */
  source: text("source").default("learned").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type KeywordLearning = typeof keywordLearning.$inferSelect;
export type InsertKeywordLearning = typeof keywordLearning.$inferInsert;

/**
 * ============================================
 * TEMPORAL ANALYSIS TABLES
 * ============================================
 */

/**
 * Topic Emotion History - tracks emotion changes for topics over time
 */
export const topicEmotionHistory = sqliteTable("topic_emotion_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Topic or headline being tracked */
  topic: text("topic").notNull(),
  /** Normalized topic for grouping similar topics */
  normalizedTopic: text("normalizedTopic").notNull(),
  /** GMI at this point */
  gmi: integer("gmi").notNull(),
  /** CFI at this point */
  cfi: integer("cfi").notNull(),
  /** HRI at this point */
  hri: integer("hri").notNull(),
  /** Joy score */
  joy: integer("joy").notNull(),
  /** Fear score */
  fear: integer("fear").notNull(),
  /** Anger score */
  anger: integer("anger").notNull(),
  /** Sadness score */
  sadness: integer("sadness").notNull(),
  /** Hope score */
  hope: integer("hope").notNull(),
  /** Curiosity score */
  curiosity: integer("curiosity").notNull(),
  /** Dominant emotion at this point */
  dominantEmotion: text("dominantEmotion").notNull(),
  /** Number of sources analyzed */
  sourcesCount: integer("sourcesCount").default(0).notNull(),
  /** Analysis timestamp */
  analyzedAt: integer("analyzedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TopicEmotionHistory = typeof topicEmotionHistory.$inferSelect;
export type InsertTopicEmotionHistory = typeof topicEmotionHistory.$inferInsert;

/**
 * Emotion Trends - aggregated emotion trends over time periods
 */
export const emotionTrends = sqliteTable("emotion_trends", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Topic or 'global' for overall trends */
  topic: text("topic").default("global").notNull(),
  /** Time period: hourly, daily, weekly, monthly */
  period: text("period").notNull(),
  /** Period start timestamp */
  periodStart: integer("periodStart", { mode: "timestamp" }).notNull(),
  /** Period end timestamp */
  periodEnd: integer("periodEnd", { mode: "timestamp" }).notNull(),
  /** Average GMI for the period */
  avgGmi: integer("avgGmi").notNull(),
  /** Average CFI for the period */
  avgCfi: integer("avgCfi").notNull(),
  /** Average HRI for the period */
  avgHri: integer("avgHri").notNull(),
  /** GMI change from previous period */
  gmiChange: integer("gmiChange").default(0),
  /** CFI change from previous period */
  cfiChange: integer("cfiChange").default(0),
  /** HRI change from previous period */
  hriChange: integer("hriChange").default(0),
  /** Number of analyses in this period */
  analysisCount: integer("analysisCount").default(0).notNull(),
  /** Most frequent dominant emotion */
  dominantEmotion: text("dominantEmotion"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type EmotionTrend = typeof emotionTrends.$inferSelect;
export type InsertEmotionTrend = typeof emotionTrends.$inferInsert;

/**
 * ============================================
 * MULTILINGUAL SUPPORT TABLES
 * ============================================
 */

/**
 * Language Profiles - stores language-specific analysis configurations
 */
export const languageProfiles = sqliteTable("language_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** ISO 639-1 language code (e.g., 'ar', 'en', 'fr', 'es', 'zh', 'ja') */
  languageCode: text("languageCode").notNull().unique(),
  /** Language name in English */
  languageName: text("languageName").notNull(),
  /** Language name in native script */
  nativeName: text("nativeName"),
  /** Text direction: ltr (left-to-right) or rtl (right-to-left) */
  textDirection: text("textDirection").default("ltr").notNull(),
  /** Associated cultural region */
  culturalRegion: text("culturalRegion").notNull(),
  /** Emotional expression style: direct, indirect, reserved, expressive */
  expressionStyle: text("expressionStyle").default("direct").notNull(),
  /** Default sentiment adjustment factor (-50 to +50) */
  sentimentAdjustment: integer("sentimentAdjustment").default(0).notNull(),
  /** Whether this language is fully supported */
  isFullySupported: integer("isFullySupported", { mode: "boolean" }).default(false).notNull(),
  /** Number of keywords in dictionary */
  keywordCount: integer("keywordCount").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type LanguageProfile = typeof languageProfiles.$inferSelect;
export type InsertLanguageProfile = typeof languageProfiles.$inferInsert;

/**
 * Multilingual Keywords - emotion keywords in multiple languages
 */
export const multilingualKeywords = sqliteTable("multilingual_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** ISO 639-1 language code */
  languageCode: text("languageCode").notNull(),
  /** The keyword in the target language */
  keyword: text("keyword").notNull(),
  /** English translation for reference */
  englishTranslation: text("englishTranslation"),
  /** Category: death, disaster, celebration, politics, economy, etc. */
  category: text("category").notNull(),
  /** Primary emotion: joy, fear, anger, sadness, hope, curiosity */
  primaryEmotion: text("primaryEmotion").notNull(),
  /** Emotional intensity: low, medium, high, extreme */
  intensity: text("intensity").default("medium").notNull(),
  /** Emotional weight: -100 to +100 */
  emotionalWeight: integer("emotionalWeight").notNull(),
  /** Usage context notes */
  contextNotes: text("contextNotes"),
  /** Source: manual, imported, learned */
  source: text("source").default("manual").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type MultilingualKeyword = typeof multilingualKeywords.$inferSelect;
export type InsertMultilingualKeyword = typeof multilingualKeywords.$inferInsert;


/**
 * AI Conversations - stores conversation history for Smart Analysis
 * Similar to ChatGPT conversation history
 */
export const aiConversations = sqliteTable("ai_conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID (null for anonymous users) */
  userId: integer("userId"),
  /** Conversation title (auto-generated from first topic) */
  title: text("title").notNull(),
  /** Original topic/query that started the conversation */
  topic: text("topic").notNull(),
  /** Country code if specified */
  countryCode: text("countryCode"),
  /** Last GMI value */
  lastGmi: integer("lastGmi"),
  /** Last CFI value */
  lastCfi: integer("lastCfi"),
  /** Last HRI value */
  lastHri: integer("lastHri"),
  /** Dominant emotion from last analysis */
  dominantEmotion: text("dominantEmotion"),
  /** Number of messages in conversation */
  messageCount: integer("messageCount").default(1).notNull(),
  /** Last activity timestamp */
  lastActivityAt: integer("lastActivityAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIConversation = typeof aiConversations.$inferInsert;

/**
 * AI Conversation Messages - stores individual messages in a conversation
 */
export const aiConversationMessages = sqliteTable("ai_conversation_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to parent conversation */
  conversationId: integer("conversationId").notNull(),
  /** Message role: user, assistant, system */
  role: text("role").notNull(),
  /** Message content */
  content: text("content").notNull(),
  /** Analysis data JSON (for assistant messages with analysis results) */
  analysisData: text("analysisData"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type AIConversationMessage = typeof aiConversationMessages.$inferSelect;
export type InsertAIConversationMessage = typeof aiConversationMessages.$inferInsert;


/**
 * User Profiles - stores persistent user context for personalized responses
 * Tracks user level, preferred topics, and interaction patterns
 */
export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to user */
  userId: integer("userId").notNull().unique(),
  /** User expertise level: beginner, intermediate, advanced */
  userLevel: text("userLevel").default("beginner").notNull(),
  /** Total conversation count */
  conversationCount: integer("conversationCount").default(0).notNull(),
  /** Total message count */
  messageCount: integer("messageCount").default(0).notNull(),
  /** Preferred topics JSON array */
  preferredTopics: text("preferredTopics"),
  /** Technical terms used count (for level detection) */
  technicalTermsUsed: integer("technicalTermsUsed").default(0).notNull(),
  /** Preferred response length: short, medium, detailed */
  preferredResponseLength: text("preferredResponseLength").default("medium"),
  /** Preferred language: ar, en */
  preferredLanguage: text("preferredLanguage").default("ar"),
  /** Last detected emotional state */
  lastEmotionalState: text("lastEmotionalState"),
  /** Countries of interest JSON array */
  countriesOfInterest: text("countriesOfInterest"),
  /** Last active topic */
  lastActiveTopic: text("lastActiveTopic"),
  /** Profile confidence score (how confident we are in the profile) */
  profileConfidence: integer("profileConfidence").default(50).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;


// ============================================================================
// SELF-IMPROVING COGNITIVE SYSTEM TABLES
// ============================================================================

/**
 * Feedback Loop Table - stores user feedback on responses
 * This is the "memory" that allows the system to learn from user reactions
 */
export const responseFeedback = sqliteTable("response_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User who provided feedback (null for anonymous) */
  userId: integer("userId"),
  /** The original question asked */
  question: text("question").notNull(),
  /** The response given by AmalSense */
  response: text("response").notNull(),
  /** User rating: 1-5 stars */
  rating: integer("rating").notNull(),
  /** Was the response helpful? */
  wasHelpful: text("wasHelpful"),
  /** Was the analysis accurate? */
  wasAccurate: text("wasAccurate"),
  /** Did the user understand the response? */
  wasUnderstandable: text("wasUnderstandable"),
  /** User's comment/feedback */
  comment: text("comment"),
  /** Topic/domain of the question */
  topic: text("topic"),
  /** Cognitive pattern used */
  cognitivePattern: text("cognitivePattern"),
  /** Dominant emotion in response */
  dominantEmotion: text("dominantEmotion"),
  /** Response confidence score */
  responseConfidence: integer("responseConfidence"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type ResponseFeedback = typeof responseFeedback.$inferSelect;
export type InsertResponseFeedback = typeof responseFeedback.$inferInsert;

/**
 * Self-Evaluation Table - stores the system's self-assessment of each response
 * The system evaluates its own thinking quality after each response
 */
export const selfEvaluations = sqliteTable("self_evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to the response (question hash or session ID) */
  questionHash: text("questionHash").notNull(),
  /** The question asked */
  question: text("question").notNull(),
  /** Was confidence high enough? (0-100) */
  confidenceScore: integer("confidenceScore").notNull(),
  /** Was data sufficient? (0-100) */
  dataSufficiencyScore: integer("dataSufficiencyScore").notNull(),
  /** Were causes from real data? (0-100) */
  causesFromDataScore: integer("causesFromDataScore").notNull(),
  /** Was it analysis vs narration? (0-100, higher = more analysis) */
  analysisVsNarrationScore: integer("analysisVsNarrationScore").notNull(),
  /** Overall self-evaluation score (0-100) */
  overallScore: integer("overallScore").notNull(),
  /** Self-identified weaknesses */
  identifiedWeaknesses: text("identifiedWeaknesses"),
  /** Self-identified strengths */
  identifiedStrengths: text("identifiedStrengths"),
  /** Suggestions for improvement */
  improvementSuggestions: text("improvementSuggestions"),
  /** Number of news sources used */
  newsSourcesCount: integer("newsSourcesCount").default(0),
  /** Number of relevant headlines found */
  relevantHeadlinesCount: integer("relevantHeadlinesCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type SelfEvaluation = typeof selfEvaluations.$inferSelect;
export type InsertSelfEvaluation = typeof selfEvaluations.$inferInsert;

/**
 * Cognitive Learning Insights - stores patterns learned from feedback and self-evaluation
 * This is where the system stores its "lessons learned" for cognitive improvement
 */
export const cognitiveLearningInsights = sqliteTable("cognitive_learning_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Pattern type: weakness, strength, rule_adjustment */
  patternType: text("patternType").notNull(),
  /** Topic/domain this pattern applies to */
  topic: text("topic"),
  /** Question type this pattern applies to */
  questionType: text("questionType"),
  /** Description of the pattern */
  description: text("description").notNull(),
  /** Evidence count (how many cases support this pattern) */
  evidenceCount: integer("evidenceCount").default(1).notNull(),
  /** Confidence in this pattern (0-100) */
  patternConfidence: integer("patternConfidence").default(50).notNull(),
  /** Suggested action/adjustment */
  suggestedAction: text("suggestedAction"),
  /** Is this pattern active/applied? */
  isActive: text("isActive").default("no").notNull(),
  /** When was this pattern last validated */
  lastValidated: integer("lastValidated", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type CognitiveLearningInsight = typeof cognitiveLearningInsights.$inferSelect;
export type InsertCognitiveLearningInsight = typeof cognitiveLearningInsights.$inferInsert;

/**
 * Weekly Self-Reports Table - stores the system's weekly introspection reports
 * Machine Introspection: The system reflects on its performance
 */
export const weeklySelfReports = sqliteTable("weekly_self_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Report period start date */
  periodStart: integer("periodStart", { mode: "timestamp" }).notNull(),
  /** Report period end date */
  periodEnd: integer("periodEnd", { mode: "timestamp" }).notNull(),
  /** Total responses in this period */
  totalResponses: integer("totalResponses").default(0).notNull(),
  /** Average user rating */
  averageRating: integer("averageRating"),
  /** Average self-evaluation score */
  averageSelfScore: integer("averageSelfScore"),
  /** Top 10 failure cases (JSON) */
  topFailures: text("topFailures"),
  /** Top 10 success cases (JSON) */
  topSuccesses: text("topSuccesses"),
  /** Most confusing question types (JSON) */
  confusingQuestionTypes: text("confusingQuestionTypes"),
  /** Topics where data was insufficient (JSON) */
  dataGapTopics: text("dataGapTopics"),
  /** Topics with weak interpretation (JSON) */
  weakInterpretationTopics: text("weakInterpretationTopics"),
  /** Key insights from this period */
  keyInsights: text("keyInsights"),
  /** Recommended rule adjustments */
  recommendedAdjustments: text("recommendedAdjustments"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type WeeklySelfReport = typeof weeklySelfReports.$inferSelect;
export type InsertWeeklySelfReport = typeof weeklySelfReports.$inferInsert;

/**
 * Reasoning Rules Table - stores adjustable reasoning rules
 * These rules can be modified based on learning patterns
 */
export const reasoningRules = sqliteTable("reasoning_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Rule name/identifier */
  ruleName: text("ruleName").notNull().unique(),
  /** Rule category: decision, interpretation, response, query */
  category: text("category").notNull(),
  /** Rule description */
  description: text("description").notNull(),
  /** Rule weight/priority (0-100) */
  weight: integer("weight").default(50).notNull(),
  /** Rule parameters (JSON) */
  parameters: text("parameters"),
  /** Is this rule active? */
  isActive: text("isActive").default("yes").notNull(),
  /** Times this rule was applied */
  timesApplied: integer("timesApplied").default(0).notNull(),
  /** Success rate when applied (0-100) */
  successRate: integer("successRate").default(50),
  /** Last modified by (system/admin) */
  lastModifiedBy: text("lastModifiedBy").default("system"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type ReasoningRule = typeof reasoningRules.$inferSelect;
export type InsertReasoningRule = typeof reasoningRules.$inferInsert;


/**
 * Conversations Table - stores conversation sessions for users
 * Each conversation represents a multi-turn analysis session
 */
export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** User ID who owns this conversation */
  userId: integer("userId").notNull(),
  /** Conversation title (auto-generated from first question) */
  title: text("title").notNull(),
  /** Country code if country-specific */
  countryCode: text("countryCode"),
  /** Country name */
  countryName: text("countryName"),
  /** Number of turns in this conversation */
  turnCount: integer("turnCount").notNull().default(1),
  /** Last message timestamp */
  lastMessageAt: integer("lastMessageAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  /** Archived status */
  isArchived: integer("isArchived", { mode: "boolean" }).default(false).notNull(),
  /** Pinned status */
  isPinned: integer("isPinned", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages Table - stores individual messages within a conversation
 * Each message represents a question and its analysis result
 */
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to parent conversation */
  conversationId: integer("conversationId").notNull(),
  /** User ID */
  userId: integer("userId").notNull(),
  /** Question/query text */
  question: text("question").notNull(),
  /** Question type: what, why, how, risks, recommendation, whatif, comparison, followup, clarification */
  questionType: text("questionType").notNull(),
  /** Intelligent response from UnifiedPipeline */
  intelligentResponse: text("intelligentResponse"),
  /** Global Mood Index result */
  gmi: integer("gmi").notNull().default(0),
  /** Collective Fear Index result */
  cfi: integer("cfi").notNull().default(0),
  /** Hope Resilience Index result */
  hri: integer("hri").notNull().default(0),
  /** Antagonism & Conflict Index */
  aci: integer("aci").notNull().default(0),
  /** Stability & Dynamics Index */
  sdi: integer("sdi").notNull().default(0),
  /** Confidence score */
  confidence: integer("confidence").notNull().default(75),
  /** DCFT breakdown JSON */
  dcftBreakdown: text("dcftBreakdown"),
  /** Temporal analysis JSON */
  temporalAnalysis: text("temporalAnalysis"),
  /** Source attribution JSON */
  sourceAttribution: text("sourceAttribution"),
  /** Dominant emotion */
  dominantEmotion: text("dominantEmotion"),
  /** Number of sources analyzed */
  sourcesCount: integer("sourcesCount").notNull().default(0),
  /** Analysis duration in milliseconds */
  durationMs: integer("durationMs"),
  /** User feedback: helpful, not_helpful, neutral */
  userFeedback: text("userFeedback"),
  /** User feedback comment */
  feedbackComment: text("feedbackComment"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;


/**
 * User Conversations Table - stores user questions and responses (Layer 12)
 * Enables personal memory and conversation history
 */
export const userConversations = sqliteTable("user_conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Reference to user */
  userId: integer("userId").notNull().references(() => users.id),
  /** User's question */
  question: text("question").notNull(),
  /** Question type: factual, emotional, predictive, etc. */
  questionType: text("questionType").notNull(),
  /** Detected topics */
  detectedTopics: text("detectedTopics"), // JSON array
  /** Detected countries */
  detectedCountries: text("detectedCountries"), // JSON array
  /** AI response */
  response: text("response").notNull(),
  /** Emotion analysis */
  emotionJoy: integer("emotionJoy").default(0),
  emotionHope: integer("emotionHope").default(0),
  emotionSadness: integer("emotionSadness").default(0),
  emotionAnger: integer("emotionAnger").default(0),
  emotionFear: integer("emotionFear").default(0),
  emotionCuriosity: integer("emotionCuriosity").default(0),
  /** Language of the question */
  language: text("language").default("ar").notNull(),
  /** Confidence score */
  confidence: integer("confidence").default(75),
  /** Processing time in ms */
  processingTimeMs: integer("processingTimeMs"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type UserConversation = typeof userConversations.$inferSelect;
export type InsertUserConversation = typeof userConversations.$inferInsert;

/**
 * Predictions Table - stores generated predictions for countries
 */
export const predictions = sqliteTable("predictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  timeframe: text("timeframe").notNull(),
  predictedGmi: real("predicted_gmi").notNull(),
  predictedCfi: real("predicted_cfi").notNull(),
  predictedHri: real("predicted_hri").notNull(),
  predictedEmotion: text("predicted_emotion").notNull(),
  confidence: real("confidence").notNull(),
  scenarioName: text("scenario_name").notNull(),
  riskScore: integer("risk_score").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("low"),
  predictionData: text("prediction_data"),
  aiInterpretation: text("ai_interpretation"),
  aiInterpretationAr: text("ai_interpretation_ar"),
  verified: integer("verified", { mode: "boolean" }).default(false),
  actualGmi: real("actual_gmi"),
  actualCfi: real("actual_cfi"),
  actualHri: real("actual_hri"),
  accuracyScore: real("accuracy_score"),
  predictedFor: integer("predicted_for", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});
export type PredictionRecord = typeof predictions.$inferSelect;
export type InsertPredictionRecord = typeof predictions.$inferInsert;

/**
 * Prediction Snapshots - periodic snapshots of emotional state for trend analysis
 */
export const predictionSnapshots = sqliteTable("prediction_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code"),
  topic: text("topic"),
  gmi: real("gmi").notNull(),
  cfi: real("cfi").notNull(),
  hri: real("hri").notNull(),
  dominantEmotion: text("dominant_emotion"),
  emotionSpectrum: text("emotion_spectrum"),
  sourceCount: integer("source_count").default(0),
  confidence: real("confidence").default(0.75),
  riskScore: integer("risk_score").default(0),
  trendDirection: text("trend_direction"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

/**
 * Case Studies Table - stores notable predictive successes
 */
export const caseStudies = sqliteTable("case_studies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  topic: text("topic"),
  eventDate: integer("eventDate", { mode: "timestamp" }),
  predictionAccuracy: integer("predictionAccuracy"),
  impactLevel: text("impactLevel"),
  dataSnapshot: text("dataSnapshot"), // JSON of indices at that time
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type PredictionSnapshot = typeof predictionSnapshots.$inferSelect;
export type InsertPredictionSnapshot = typeof predictionSnapshots.$inferInsert;

/**
 * API Keys Table - stores encrypted/hashed API keys for external access
 */
export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  keyHash: text("keyHash").notNull().unique(),
  partialKey: text("partialKey").notNull(),
  tier: text("tier").notNull(),
  usage: integer("usage").default(0).notNull(),
  limit: integer("limit").default(1000).notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastUsedAt: integer("lastUsedAt", { mode: "timestamp" }),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

