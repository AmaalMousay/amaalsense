import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const createdAt = () => integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date());
const updatedAt = () => integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date());

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("open_id").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("login_method"),
  role: text("role").notNull().default("user"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  lastSignedIn: integer("last_signed_in", { mode: "timestamp" }),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  keyHash: text("key_hash").notNull(),
  partialKey: text("partial_key").notNull(),
  tier: text("tier").notNull().default("professional"),
  usage: integer("usage").notNull().default(0),
  limit: integer("limit").notNull().default(1000),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
});

export const emotionIndices = sqliteTable("emotion_indices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gmi: real("gmi").notNull().default(0),
  cfi: real("cfi").notNull().default(0),
  hri: real("hri").notNull().default(0),
  confidence: real("confidence").default(0),
  dominantEmotion: text("dominant_emotion"),
  analyzedAt: integer("analyzed_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: createdAt(),
});
export type InsertEmotionIndex = typeof emotionIndices.$inferInsert;

export const emotionAnalyses = sqliteTable("emotion_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  headline: text("headline").notNull(),
  content: text("content"),
  source: text("source"),
  url: text("url"),
  language: text("language"),
  sentimentScore: real("sentiment_score"),
  dominantEmotion: text("dominant_emotion"),
  confidence: real("confidence").default(0),
  rawData: text("raw_data"),
  createdAt: createdAt(),
});
export type InsertEmotionAnalysis = typeof emotionAnalyses.$inferInsert;

export const countryEmotionIndices = sqliteTable("country_emotion_indices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull().default("Unknown"),
  gmi: real("gmi").notNull().default(0),
  cfi: real("cfi").notNull().default(0),
  hri: real("hri").notNull().default(0),
  confidence: real("confidence").default(0),
  dominantEmotion: text("dominant_emotion"),
  analyzedAt: integer("analyzed_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: createdAt(),
}, (table) => [
  index("idx_country_emotion_country_code").on(table.countryCode),
]);
export type InsertCountryEmotionIndex = typeof countryEmotionIndices.$inferInsert;

export const countryEmotionAnalyses = sqliteTable("country_emotion_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name"),
  headline: text("headline"),
  content: text("content"),
  source: text("source"),
  url: text("url"),
  sentimentScore: real("sentiment_score"),
  dominantEmotion: text("dominant_emotion"),
  confidence: real("confidence"),
  rawData: text("raw_data"),
  createdAt: createdAt(),
});
export type InsertCountryEmotionAnalysis = typeof countryEmotionAnalyses.$inferInsert;

export const enterpriseInquiries = sqliteTable("enterprise_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email"),
  company: text("company"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type InsertEnterpriseInquiry = typeof enterpriseInquiries.$inferInsert;

export const usageTracking = sqliteTable("usage_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  usageType: text("usage_type").notNull(),
  count: integer("count").notNull().default(1),
  usageDate: integer("usage_date", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  metadata: text("metadata"),
  createdAt: createdAt(),
});
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

export const paymentRecords = sqliteTable("payment_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  email: text("email").notNull(),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: integer("amount"),
  currency: text("currency").default("usd"),
  status: text("status").notNull().default("pending"),
  plan: text("plan"),
  adminNotes: text("admin_notes"),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
  confirmedBy: integer("confirmed_by"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = typeof paymentRecords.$inferInsert;

export const customAlerts = sqliteTable("custom_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  metric: text("metric").notNull(),
  condition: text("condition").notNull(),
  threshold: real("threshold").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  notificationChannels: text("notification_channels"),
  lastTriggered: integer("last_triggered", { mode: "timestamp" }),
  triggerCount: integer("trigger_count").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type CustomAlert = typeof customAlerts.$inferSelect;
export type InsertCustomAlert = typeof customAlerts.$inferInsert;

export const userRegistrations = sqliteTable("user_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  verificationToken: text("verification_token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type InsertUserRegistration = typeof userRegistrations.$inferInsert;

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  isUsed: integer("is_used", { mode: "boolean" }).notNull().default(false),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdAt: createdAt(),
});
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

export const classifiedAnalyses = sqliteTable("classified_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  headline: text("headline").notNull(),
  content: text("content"),
  domain: text("domain").notNull(),
  sensitivity: text("sensitivity").notNull().default("medium"),
  dominantEmotion: text("dominant_emotion"),
  confidence: real("confidence"),
  emotionalRiskScore: real("emotional_risk_score"),
  classificationData: text("classification_data"),
  sourceUrl: text("source_url"),
  createdAt: createdAt(),
});
export type InsertClassifiedAnalysis = typeof classifiedAnalyses.$inferInsert;

export const followedTopics = sqliteTable("followed_topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  topic: text("topic").notNull(),
  keywords: text("keywords"),
  domains: text("domains"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type InsertFollowedTopic = typeof followedTopics.$inferInsert;

export const topicAlerts = sqliteTable("topic_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  topicId: integer("topic_id"),
  title: text("title").notNull(),
  message: text("message"),
  severity: text("severity").default("medium"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  readAt: integer("read_at", { mode: "timestamp" }),
  metadata: text("metadata"),
  createdAt: createdAt(),
});
export type InsertTopicAlert = typeof topicAlerts.$inferInsert;

export const responseFeedback = sqliteTable("response_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  question: text("question"),
  response: text("response"),
  rating: integer("rating"),
  wasHelpful: text("was_helpful"),
  wasAccurate: text("was_accurate"),
  wasUnderstandable: text("was_understandable"),
  comment: text("comment"),
  topic: text("topic"),
  cognitivePattern: text("cognitive_pattern"),
  dominantEmotion: text("dominant_emotion"),
  responseConfidence: real("response_confidence"),
  createdAt: createdAt(),
});
export type InsertResponseFeedback = typeof responseFeedback.$inferInsert;

export const caseStudies = sqliteTable("case_studies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code"),
  title: text("title").notNull(),
  description: text("description"),
  data: text("data"),
  topic: text("topic"),
  eventDate: integer("event_date", { mode: "timestamp" }),
  predictionAccuracy: real("prediction_accuracy"),
  impactLevel: text("impact_level"),
  dataSnapshot: text("data_snapshot"),
  createdAt: createdAt(),
});

export const cognitiveLearningInsights = sqliteTable("cognitive_learning_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patternType: text("pattern_type"),
  topic: text("topic"),
  questionType: text("question_type"),
  description: text("description"),
  evidenceCount: integer("evidence_count").default(0),
  patternConfidence: real("pattern_confidence").default(0),
  suggestedAction: text("suggested_action"),
  isActive: text("is_active").notNull().default("no"),
  lastValidated: integer("last_validated", { mode: "timestamp" }),
  createdAt: createdAt(),
});

export const reasoningRules = sqliteTable("reasoning_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleName: text("rule_name").notNull(),
  category: text("category"),
  description: text("description"),
  weight: real("weight").notNull().default(1),
  timesApplied: integer("times_applied").notNull().default(0),
  successRate: real("success_rate").notNull().default(0),
  parameters: text("parameters"),
  isActive: text("is_active").notNull().default("yes"),
  createdAt: createdAt(),
});

export const weeklySelfReports = sqliteTable("weekly_self_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  periodStart: integer("period_start", { mode: "timestamp" }),
  periodEnd: integer("period_end", { mode: "timestamp" }),
  totalResponses: integer("total_responses").default(0),
  averageRating: integer("average_rating").default(0),
  averageSelfScore: integer("average_self_score").default(0),
  topFailures: text("top_failures"),
  topSuccesses: text("top_successes"),
  confusingQuestionTypes: text("confusing_question_types"),
  dataGapTopics: text("data_gap_topics"),
  weakInterpretationTopics: text("weak_interpretation_topics"),
  keyInsights: text("key_insights"),
  recommendedAdjustments: text("recommended_adjustments"),
  createdAt: createdAt(),
});

export const selfEvaluations = sqliteTable("self_evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionHash: text("question_hash"),
  question: text("question"),
  confidenceScore: integer("confidence_score").default(0),
  dataSufficiencyScore: integer("data_sufficiency_score").default(0),
  causesFromDataScore: integer("causes_from_data_score").default(0),
  analysisVsNarrationScore: integer("analysis_vs_narration_score").default(0),
  overallScore: integer("overall_score").default(0),
  identifiedWeaknesses: text("identified_weaknesses"),
  identifiedStrengths: text("identified_strengths"),
  improvementSuggestions: text("improvement_suggestions"),
  newsSourcesCount: integer("news_sources_count").default(0),
  relevantHeadlinesCount: integer("relevant_headlines_count").default(0),
  createdAt: createdAt(),
});

export const learningPatterns = sqliteTable("learning_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  originalText: text("original_text"),
  language: text("language").notNull(),
  dialect: text("dialect"),
  eventType: text("event_type").notNull(),
  region: text("region"),
  contextConfidence: real("context_confidence").notNull().default(0),
  finalJoy: real("final_joy").notNull().default(0),
  finalFear: real("final_fear").notNull().default(0),
  finalAnger: real("final_anger").notNull().default(0),
  finalSadness: real("final_sadness").notNull().default(0),
  finalHope: real("final_hope").notNull().default(0),
  finalCuriosity: real("final_curiosity").notNull().default(0),
  usageCount: integer("usage_count").notNull().default(0),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  userFeedback: text("user_feedback"),
  feedbackAt: integer("feedback_at", { mode: "timestamp" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const keywordLearning = sqliteTable("keyword_learning", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull(),
  language: text("language").notNull(),
  eventType: text("event_type").notNull(),
  emotionalWeight: real("emotional_weight").notNull().default(0),
  primaryEmotion: text("primary_emotion").notNull().default("neutral"),
  confidence: real("confidence").notNull().default(50),
  source: text("source"),
  occurrenceCount: integer("occurrence_count").notNull().default(1),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("idx_keyword_language_unique").on(table.keyword, table.language),
]);

export const predictions = sqliteTable("predictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name"),
  timeframe: text("timeframe").notNull(),
  predictedGmi: real("predicted_gmi").notNull(),
  predictedCfi: real("predicted_cfi").notNull(),
  predictedHri: real("predicted_hri").notNull(),
  predictedEmotion: text("predicted_emotion"),
  confidence: real("confidence").default(0),
  scenarioName: text("scenario_name"),
  riskScore: real("risk_score"),
  riskLevel: text("risk_level"),
  predictionData: text("prediction_data"),
  aiInterpretation: text("ai_interpretation"),
  aiInterpretationAr: text("ai_interpretation_ar"),
  predictedFor: integer("predicted_for", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  actualGmi: real("actual_gmi"),
  actualCfi: real("actual_cfi"),
  actualHri: real("actual_hri"),
  accuracyScore: real("accuracy_score"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const predictionSnapshots = sqliteTable("prediction_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  countryCode: text("country_code").notNull(),
  gmi: real("gmi").notNull(),
  cfi: real("cfi").notNull(),
  hri: real("hri").notNull(),
  riskScore: real("risk_score"),
  trendDirection: text("trend_direction"),
  createdAt: createdAt(),
});

export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  userLevel: text("user_level").notNull().default("beginner"),
  conversationCount: integer("conversation_count").notNull().default(0),
  messageCount: integer("message_count").notNull().default(0),
  preferredTopics: text("preferred_topics").notNull().default("[]"),
  technicalTermsUsed: integer("technical_terms_used").notNull().default(0),
  preferredResponseLength: text("preferred_response_length").notNull().default("medium"),
  preferredLanguage: text("preferred_language").notNull().default("ar"),
  lastEmotionalState: text("last_emotional_state"),
  countriesOfInterest: text("countries_of_interest").notNull().default("[]"),
  lastActiveTopic: text("last_active_topic"),
  profileConfidence: integer("profile_confidence").notNull().default(50),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export const analysisSessions = sqliteTable("analysis_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  sessionType: text("session_type").notNull().default("manual"),
  query: text("query"),
  countryCode: text("country_code"),
  gmi: real("gmi").notNull().default(0),
  cfi: real("cfi").notNull().default(0),
  hri: real("hri").notNull().default(0),
  sentimentScore: real("sentiment_score").notNull().default(0),
  dominantEmotion: text("dominant_emotion"),
  sourcesCount: integer("sources_count").default(0),
  sourcesBreakdown: text("sources_breakdown"),
  confidence: real("confidence").notNull().default(0),
  durationMs: integer("duration_ms"),
  createdAt: createdAt(),
});

export const sourceAnalyses = sqliteTable("source_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").notNull(),
  platform: text("platform").notNull(),
  content: text("content"),
  sourceUrl: text("source_url"),
  author: text("author"),
  sentimentScore: real("sentiment_score").default(0),
  joy: real("joy").default(0),
  fear: real("fear").default(0),
  anger: real("anger").default(0),
  sadness: real("sadness").default(0),
  hope: real("hope").default(0),
  curiosity: real("curiosity").default(0),
  dominantEmotion: text("dominant_emotion"),
  confidence: real("confidence"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: createdAt(),
});
export type InsertSourceAnalysis = typeof sourceAnalyses.$inferInsert;

export const dailyAggregates = sqliteTable("daily_aggregates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  aggregateDate: integer("aggregate_date", { mode: "timestamp" }).notNull(),
  countryCode: text("country_code"),
  avgGmi: real("avg_gmi").default(0),
  avgCfi: real("avg_cfi").default(0),
  avgHri: real("avg_hri").default(0),
  avgSentiment: real("avg_sentiment").default(0),
  topEmotion: text("top_emotion"),
  analysesCount: integer("analyses_count").default(0),
  sourcesCount: integer("sources_count").default(0),
  createdAt: createdAt(),
});

export const trendAlerts = sqliteTable("trend_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  alertType: text("alert_type"),
  metric: text("metric"),
  countryCode: text("country_code"),
  previousValue: real("previous_value"),
  currentValue: real("current_value"),
  changePercent: real("change_percent"),
  severity: text("severity").notNull().default("low"),
  message: text("message"),
  acknowledged: integer("acknowledged").notNull().default(0),
  createdAt: createdAt(),
});
