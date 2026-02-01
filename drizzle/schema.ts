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


/**
 * Payment Records - stores payment submissions and confirmations
 */
export const paymentRecords = mysqlTable("payment_records", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID (null for guest payments) */
  userId: int("userId"),
  /** Subscriber email */
  email: varchar("email", { length: 320 }).notNull(),
  /** Subscriber name */
  name: varchar("name", { length: 255 }).notNull(),
  /** Selected plan: pro, enterprise, government */
  plan: varchar("plan", { length: 32 }).notNull(),
  /** Payment amount in USD */
  amount: int("amount").notNull(),
  /** Billing period: monthly, annual */
  billingPeriod: varchar("billingPeriod", { length: 16 }).default("monthly").notNull(),
  /** Payment method: paypal, bank_transfer, western_union, moneygram, crypto */
  paymentMethod: varchar("paymentMethod", { length: 32 }).notNull(),
  /** Transaction reference/ID provided by user */
  transactionRef: varchar("transactionRef", { length: 255 }),
  /** Additional payment details (JSON) */
  paymentDetails: text("paymentDetails"),
  /** Payment status: pending, confirmed, rejected, refunded */
  status: mysqlEnum("status", ["pending", "confirmed", "rejected", "refunded"]).default("pending").notNull(),
  /** Admin notes */
  adminNotes: text("adminNotes"),
  /** Confirmation date */
  confirmedAt: timestamp("confirmedAt"),
  /** Confirmed by (admin user ID) */
  confirmedBy: int("confirmedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = typeof paymentRecords.$inferInsert;


/**
 * Custom Alerts - user-defined alert conditions
 */
export const customAlerts = mysqlTable("custom_alerts", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID who created the alert */
  userId: int("userId").notNull(),
  /** Alert name */
  name: varchar("name", { length: 255 }).notNull(),
  /** Country code to monitor (null for global) */
  countryCode: varchar("countryCode", { length: 2 }),
  /** Country name for display */
  countryName: varchar("countryName", { length: 100 }),
  /** Metric to monitor: gmi, cfi, hri */
  metric: mysqlEnum("metric", ["gmi", "cfi", "hri"]).notNull(),
  /** Condition: above, below, change */
  condition: mysqlEnum("condition", ["above", "below", "change"]).notNull(),
  /** Threshold value */
  threshold: int("threshold").notNull(),
  /** Whether alert is active */
  isActive: int("isActive").default(1).notNull(),
  /** Notification method: email, telegram, both */
  notifyMethod: mysqlEnum("notifyMethod", ["email", "telegram", "both"]).default("email").notNull(),
  /** Last triggered timestamp */
  lastTriggered: timestamp("lastTriggered"),
  /** Number of times triggered */
  triggerCount: int("triggerCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomAlert = typeof customAlerts.$inferSelect;
export type InsertCustomAlert = typeof customAlerts.$inferInsert;


/**
 * User Registrations - stores users who registered via email/password
 */
export const userRegistrations = mysqlTable("user_registrations", {
  id: int("id").autoincrement().primaryKey(),
  /** User's full name */
  name: varchar("name", { length: 255 }).notNull(),
  /** User's email address (unique) */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Hashed password (bcrypt) */
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  /** Account type: individual or organization */
  accountType: mysqlEnum("accountType", ["individual", "organization"]).default("individual").notNull(),
  /** Organization name (for organization accounts) */
  organizationName: varchar("organizationName", { length: 255 }),
  /** Organization website */
  organizationWebsite: varchar("organizationWebsite", { length: 500 }),
  /** Company size */
  companySize: varchar("companySize", { length: 32 }),
  /** Job title */
  jobTitle: varchar("jobTitle", { length: 255 }),
  /** Email verification token */
  verificationToken: varchar("verificationToken", { length: 64 }),
  /** Token expiration date */
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  /** Whether email is verified */
  isVerified: int("isVerified").default(0).notNull(),
  /** Verification date */
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserRegistration = typeof userRegistrations.$inferSelect;
export type InsertUserRegistration = typeof userRegistrations.$inferInsert;

/**
 * Password Reset Tokens - stores password reset requests
 */
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  /** User's email address */
  email: varchar("email", { length: 320 }).notNull(),
  /** Reset token (unique) */
  token: varchar("token", { length: 64 }).notNull().unique(),
  /** Token expiration date */
  expiresAt: timestamp("expiresAt").notNull(),
  /** Whether token has been used */
  isUsed: int("isUsed").default(0).notNull(),
  /** IP address of requester */
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;


/**
 * Classified Analyses - stores analyses with content classification and sensitivity
 */
export const classifiedAnalyses = mysqlTable("classified_analyses", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID who performed the analysis */
  userId: int("userId"),
  /** The analyzed headline/text */
  headline: text("headline").notNull(),
  /** Content domain: politics, economy, mental_health, medical, education, society, entertainment, general */
  domain: mysqlEnum("domain", ["politics", "economy", "mental_health", "medical", "education", "society", "entertainment", "general"]).notNull(),
  /** Sensitivity level: low, medium, high, critical */
  sensitivity: mysqlEnum("sensitivity", ["low", "medium", "high", "critical"]).notNull(),
  /** Emotional risk score (0-100) */
  emotionalRiskScore: int("emotionalRiskScore").notNull().default(50),
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
  dominantEmotion: varchar("dominantEmotion", { length: 32 }).notNull(),
  /** Confidence score of the analysis */
  confidence: int("confidence").notNull().default(75),
  /** Analysis model used */
  model: varchar("model", { length: 32 }).default("hybrid"),
  /** DCFT weight percentage */
  dcftWeight: int("dcftWeight").default(70),
  /** AI weight percentage */
  aiWeight: int("aiWeight").default(30),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassifiedAnalysis = typeof classifiedAnalyses.$inferSelect;
export type InsertClassifiedAnalysis = typeof classifiedAnalyses.$inferInsert;

/**
 * Followed Topics - topics that users want to track for alerts
 */
export const followedTopics = mysqlTable("followed_topics", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID who is following */
  userId: int("userId").notNull(),
  /** Topic keyword or phrase */
  topic: varchar("topic", { length: 500 }).notNull(),
  /** Content domain filter (null for all domains) */
  domain: mysqlEnum("domain", ["politics", "economy", "mental_health", "medical", "education", "society", "entertainment", "general"]),
  /** Alert threshold for emotional risk (0-100, null for any change) */
  riskThreshold: int("riskThreshold"),
  /** Alert on risk increase, decrease, or both */
  alertDirection: mysqlEnum("alertDirection", ["increase", "decrease", "both"]).default("both").notNull(),
  /** Whether following is active */
  isActive: int("isActive").default(1).notNull(),
  /** Last known emotional risk score */
  lastRiskScore: int("lastRiskScore"),
  /** Last analysis timestamp */
  lastAnalyzedAt: timestamp("lastAnalyzedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FollowedTopic = typeof followedTopics.$inferSelect;
export type InsertFollowedTopic = typeof followedTopics.$inferInsert;

/**
 * Topic Alerts - notifications sent to users about followed topics
 */
export const topicAlerts = mysqlTable("topic_alerts", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID to notify */
  userId: int("userId").notNull(),
  /** Reference to followed topic */
  followedTopicId: int("followedTopicId").notNull(),
  /** Alert type: risk_increase, risk_decrease, threshold_exceeded, new_analysis */
  alertType: mysqlEnum("alertType", ["risk_increase", "risk_decrease", "threshold_exceeded", "new_analysis"]).notNull(),
  /** Topic text */
  topic: varchar("topic", { length: 500 }).notNull(),
  /** Previous risk score */
  previousRiskScore: int("previousRiskScore"),
  /** Current risk score */
  currentRiskScore: int("currentRiskScore").notNull(),
  /** Change amount */
  changeAmount: int("changeAmount"),
  /** Alert message */
  message: text("message"),
  /** Whether alert has been read */
  isRead: int("isRead").default(0).notNull(),
  /** Read timestamp */
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
export const learningPatterns = mysqlTable("learning_patterns", {
  id: int("id").autoincrement().primaryKey(),
  /** Original text that was analyzed */
  originalText: text("originalText").notNull(),
  /** Detected language */
  language: varchar("language", { length: 32 }).notNull(),
  /** Detected dialect (if applicable) */
  dialect: varchar("dialect", { length: 32 }),
  /** Detected event type: death, disaster, celebration, politics, economy, sports, entertainment */
  eventType: varchar("eventType", { length: 32 }).notNull(),
  /** Detected region: arab_maghreb, arab_gulf, arab_levant, western, asian, african, latin */
  region: varchar("region", { length: 32 }).notNull(),
  /** Context classification confidence (0-100) */
  contextConfidence: int("contextConfidence").notNull(),
  /** Final joy score after adjustment */
  finalJoy: int("finalJoy").notNull(),
  /** Final fear score after adjustment */
  finalFear: int("finalFear").notNull(),
  /** Final anger score after adjustment */
  finalAnger: int("finalAnger").notNull(),
  /** Final sadness score after adjustment */
  finalSadness: int("finalSadness").notNull(),
  /** Final hope score after adjustment */
  finalHope: int("finalHope").notNull(),
  /** Final curiosity score after adjustment */
  finalCuriosity: int("finalCuriosity").notNull(),
  /** User feedback: accurate, inaccurate, partially_accurate */
  userFeedback: mysqlEnum("userFeedback", ["accurate", "inaccurate", "partially_accurate"]),
  /** Feedback timestamp */
  feedbackAt: timestamp("feedbackAt"),
  /** Number of times this pattern was used for learning */
  usageCount: int("usageCount").default(0).notNull(),
  /** Whether this pattern is verified and trusted */
  isVerified: int("isVerified").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearningPattern = typeof learningPatterns.$inferSelect;
export type InsertLearningPattern = typeof learningPatterns.$inferInsert;

/**
 * Keyword Learning - stores learned keywords and their emotional associations
 */
export const keywordLearning = mysqlTable("keyword_learning", {
  id: int("id").autoincrement().primaryKey(),
  /** The keyword or phrase */
  keyword: varchar("keyword", { length: 255 }).notNull(),
  /** Language of the keyword */
  language: varchar("language", { length: 32 }).notNull(),
  /** Associated event type */
  eventType: varchar("eventType", { length: 32 }).notNull(),
  /** Emotional weight: -100 (very negative) to +100 (very positive) */
  emotionalWeight: int("emotionalWeight").notNull(),
  /** Primary emotion associated: joy, fear, anger, sadness, hope, curiosity */
  primaryEmotion: varchar("primaryEmotion", { length: 32 }).notNull(),
  /** Confidence in this association (0-100) */
  confidence: int("confidence").notNull().default(50),
  /** Number of times this keyword was encountered */
  occurrenceCount: int("occurrenceCount").default(1).notNull(),
  /** Source: manual, learned, imported */
  source: varchar("source", { length: 32 }).default("learned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
export const topicEmotionHistory = mysqlTable("topic_emotion_history", {
  id: int("id").autoincrement().primaryKey(),
  /** Topic or headline being tracked */
  topic: varchar("topic", { length: 500 }).notNull(),
  /** Normalized topic for grouping similar topics */
  normalizedTopic: varchar("normalizedTopic", { length: 500 }).notNull(),
  /** GMI at this point */
  gmi: int("gmi").notNull(),
  /** CFI at this point */
  cfi: int("cfi").notNull(),
  /** HRI at this point */
  hri: int("hri").notNull(),
  /** Joy score */
  joy: int("joy").notNull(),
  /** Fear score */
  fear: int("fear").notNull(),
  /** Anger score */
  anger: int("anger").notNull(),
  /** Sadness score */
  sadness: int("sadness").notNull(),
  /** Hope score */
  hope: int("hope").notNull(),
  /** Curiosity score */
  curiosity: int("curiosity").notNull(),
  /** Dominant emotion at this point */
  dominantEmotion: varchar("dominantEmotion", { length: 32 }).notNull(),
  /** Number of sources analyzed */
  sourcesCount: int("sourcesCount").default(0).notNull(),
  /** Analysis timestamp */
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TopicEmotionHistory = typeof topicEmotionHistory.$inferSelect;
export type InsertTopicEmotionHistory = typeof topicEmotionHistory.$inferInsert;

/**
 * Emotion Trends - aggregated emotion trends over time periods
 */
export const emotionTrends = mysqlTable("emotion_trends", {
  id: int("id").autoincrement().primaryKey(),
  /** Topic or 'global' for overall trends */
  topic: varchar("topic", { length: 500 }).default("global").notNull(),
  /** Time period: hourly, daily, weekly, monthly */
  period: mysqlEnum("period", ["hourly", "daily", "weekly", "monthly"]).notNull(),
  /** Period start timestamp */
  periodStart: timestamp("periodStart").notNull(),
  /** Period end timestamp */
  periodEnd: timestamp("periodEnd").notNull(),
  /** Average GMI for the period */
  avgGmi: int("avgGmi").notNull(),
  /** Average CFI for the period */
  avgCfi: int("avgCfi").notNull(),
  /** Average HRI for the period */
  avgHri: int("avgHri").notNull(),
  /** GMI change from previous period */
  gmiChange: int("gmiChange").default(0),
  /** CFI change from previous period */
  cfiChange: int("cfiChange").default(0),
  /** HRI change from previous period */
  hriChange: int("hriChange").default(0),
  /** Number of analyses in this period */
  analysisCount: int("analysisCount").default(0).notNull(),
  /** Most frequent dominant emotion */
  dominantEmotion: varchar("dominantEmotion", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
export const languageProfiles = mysqlTable("language_profiles", {
  id: int("id").autoincrement().primaryKey(),
  /** ISO 639-1 language code (e.g., 'ar', 'en', 'fr', 'es', 'zh', 'ja') */
  languageCode: varchar("languageCode", { length: 5 }).notNull().unique(),
  /** Language name in English */
  languageName: varchar("languageName", { length: 100 }).notNull(),
  /** Language name in native script */
  nativeName: varchar("nativeName", { length: 100 }),
  /** Text direction: ltr (left-to-right) or rtl (right-to-left) */
  textDirection: mysqlEnum("textDirection", ["ltr", "rtl"]).default("ltr").notNull(),
  /** Associated cultural region */
  culturalRegion: varchar("culturalRegion", { length: 32 }).notNull(),
  /** Emotional expression style: direct, indirect, reserved, expressive */
  expressionStyle: mysqlEnum("expressionStyle", ["direct", "indirect", "reserved", "expressive"]).default("direct").notNull(),
  /** Default sentiment adjustment factor (-50 to +50) */
  sentimentAdjustment: int("sentimentAdjustment").default(0).notNull(),
  /** Whether this language is fully supported */
  isFullySupported: int("isFullySupported").default(0).notNull(),
  /** Number of keywords in dictionary */
  keywordCount: int("keywordCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LanguageProfile = typeof languageProfiles.$inferSelect;
export type InsertLanguageProfile = typeof languageProfiles.$inferInsert;

/**
 * Multilingual Keywords - emotion keywords in multiple languages
 */
export const multilingualKeywords = mysqlTable("multilingual_keywords", {
  id: int("id").autoincrement().primaryKey(),
  /** ISO 639-1 language code */
  languageCode: varchar("languageCode", { length: 5 }).notNull(),
  /** The keyword in the target language */
  keyword: varchar("keyword", { length: 255 }).notNull(),
  /** English translation for reference */
  englishTranslation: varchar("englishTranslation", { length: 255 }),
  /** Category: death, disaster, celebration, politics, economy, etc. */
  category: varchar("category", { length: 32 }).notNull(),
  /** Primary emotion: joy, fear, anger, sadness, hope, curiosity */
  primaryEmotion: varchar("primaryEmotion", { length: 32 }).notNull(),
  /** Emotional intensity: low, medium, high, extreme */
  intensity: mysqlEnum("intensity", ["low", "medium", "high", "extreme"]).default("medium").notNull(),
  /** Emotional weight: -100 to +100 */
  emotionalWeight: int("emotionalWeight").notNull(),
  /** Usage context notes */
  contextNotes: text("contextNotes"),
  /** Source: manual, imported, learned */
  source: varchar("source", { length: 32 }).default("manual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MultilingualKeyword = typeof multilingualKeywords.$inferSelect;
export type InsertMultilingualKeyword = typeof multilingualKeywords.$inferInsert;


/**
 * AI Conversations - stores conversation history for Smart Analysis
 * Similar to ChatGPT conversation history
 */
export const aiConversations = mysqlTable("ai_conversations", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID (null for anonymous users) */
  userId: int("userId"),
  /** Conversation title (auto-generated from first topic) */
  title: varchar("title", { length: 255 }).notNull(),
  /** Original topic/query that started the conversation */
  topic: text("topic").notNull(),
  /** Country code if specified */
  countryCode: varchar("countryCode", { length: 5 }),
  /** Last GMI value */
  lastGmi: int("lastGmi"),
  /** Last CFI value */
  lastCfi: int("lastCfi"),
  /** Last HRI value */
  lastHri: int("lastHri"),
  /** Dominant emotion from last analysis */
  dominantEmotion: varchar("dominantEmotion", { length: 32 }),
  /** Number of messages in conversation */
  messageCount: int("messageCount").default(1).notNull(),
  /** Last activity timestamp */
  lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIConversation = typeof aiConversations.$inferInsert;

/**
 * AI Conversation Messages - stores individual messages in a conversation
 */
export const aiConversationMessages = mysqlTable("ai_conversation_messages", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to parent conversation */
  conversationId: int("conversationId").notNull(),
  /** Message role: user, assistant, system */
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  /** Message content */
  content: text("content").notNull(),
  /** Analysis data JSON (for assistant messages with analysis results) */
  analysisData: text("analysisData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIConversationMessage = typeof aiConversationMessages.$inferSelect;
export type InsertAIConversationMessage = typeof aiConversationMessages.$inferInsert;
