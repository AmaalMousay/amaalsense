import { eq, desc, asc, gte, and, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emotionIndices, emotionAnalyses, InsertEmotionAnalysis, InsertEmotionIndex, countryEmotionIndices, countryEmotionAnalyses, InsertCountryEmotionIndex, InsertCountryEmotionAnalysis, enterpriseInquiries, InsertEnterpriseInquiry, usageTracking, InsertUsageTracking, customAlerts, InsertCustomAlert, CustomAlert } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get the latest emotion indices
 */
export async function getLatestEmotionIndices() {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(emotionIndices)
    .orderBy((t) => desc(t.analyzedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get emotion indices history for a given time range
 */
export async function getEmotionIndicesHistory(hoursBack: number = 24) {
  const db = await getDb();
  if (!db) return [];

  const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  return await db
    .select()
    .from(emotionIndices)
    .where(gte(emotionIndices.analyzedAt, cutoffTime))
    .orderBy((t) => asc(t.analyzedAt));
}

/**
 * Create a new emotion analysis record
 */
export async function createEmotionAnalysis(analysis: InsertEmotionAnalysis) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(emotionAnalyses).values(analysis);
  return result;
}

/**
 * Create a new emotion index snapshot
 */
export async function createEmotionIndex(index: InsertEmotionIndex) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(emotionIndices).values(index);
  return result;
}

/**
 * Get recent emotion analyses
 */
export async function getRecentEmotionAnalyses(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(emotionAnalyses)
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get all country emotion indices
 */
export async function getAllCountryEmotionIndices() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(countryEmotionIndices)
    .orderBy((t) => desc(t.analyzedAt));
}

/**
 * Get latest emotion index for a specific country
 */
export async function getCountryEmotionIndex(countryCode: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(countryEmotionIndices)
    .where(eq(countryEmotionIndices.countryCode, countryCode))
    .orderBy((t) => desc(t.analyzedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create or update country emotion index
 */
export async function upsertCountryEmotionIndex(data: InsertCountryEmotionIndex) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(countryEmotionIndices).values(data).onDuplicateKeyUpdate({
    set: {
      gmi: data.gmi,
      cfi: data.cfi,
      hri: data.hri,
      confidence: data.confidence,
      analyzedAt: new Date(),
    },
  });
}

/**
 * Create country emotion analysis record
 */
export async function createCountryEmotionAnalysis(data: InsertCountryEmotionAnalysis) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(countryEmotionAnalyses).values(data);
}

/**
 * Get recent analyses for a specific country
 */
export async function getCountryRecentAnalyses(countryCode: string, limit: number = 10) {
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
 * Get historical emotion indices for a country within a time range
 */
export async function getCountryHistoricalIndices(
  countryCode: string,
  hoursBack: number = 24
) {
  const db = await getDb();
  if (!db) return [];

  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(
      and(
        eq(countryEmotionIndices.countryCode, countryCode),
        gte(countryEmotionIndices.analyzedAt, startTime)
      )
    )
    .orderBy((t) => asc(t.analyzedAt));
}

/**
 * Get historical emotion indices for all countries within a time range
 */
export async function getAllCountriesHistoricalIndices(hoursBack: number = 24) {
  const db = await getDb();
  if (!db) return [];

  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(gte(countryEmotionIndices.analyzedAt, startTime))
    .orderBy((t) => asc(t.analyzedAt));
}

/**
 * Get historical emotion indices for multiple countries
 */
export async function getMultipleCountriesHistoricalIndices(
  countryCodes: string[],
  hoursBack: number = 24
) {
  const db = await getDb();
  if (!db) return [];

  const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  return await db
    .select()
    .from(countryEmotionIndices)
    .where(
      and(
        inArray(countryEmotionIndices.countryCode, countryCodes),
        gte(countryEmotionIndices.analyzedAt, startTime)
      )
    )
    .orderBy((t) => asc(t.analyzedAt));
}


/**
 * Create an enterprise inquiry
 */
export async function createEnterpriseInquiry(data: InsertEnterpriseInquiry) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(enterpriseInquiries).values(data);
}

/**
 * Get all enterprise inquiries (for admin)
 */
export async function getEnterpriseInquiries() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(enterpriseInquiries)
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Update enterprise inquiry status
 */
export async function updateEnterpriseInquiryStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(enterpriseInquiries)
    .set({ status })
    .where(eq(enterpriseInquiries.id, id));
}

/**
 * Track user usage
 */
export async function trackUsage(data: InsertUsageTracking) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(usageTracking).values(data);
}

/**
 * Get user's daily usage count
 */
export async function getUserDailyUsage(userId: number, usageType: string) {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.usageType, usageType),
        gte(usageTracking.usageDate, today)
      )
    );

  return result.reduce((sum, r) => sum + r.count, 0);
}


// Import payment records
import { paymentRecords, InsertPaymentRecord, PaymentRecord } from "../drizzle/schema";

/**
 * Create a new payment record
 */
export async function createPaymentRecord(data: InsertPaymentRecord) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(paymentRecords).values(data);
  return result;
}

/**
 * Get all payment records (for admin)
 */
export async function getAllPaymentRecords() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(paymentRecords)
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get payment records by status
 */
export async function getPaymentRecordsByStatus(status: "pending" | "confirmed" | "rejected" | "refunded") {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(paymentRecords)
    .where(eq(paymentRecords.status, status))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get payment record by ID
 */
export async function getPaymentRecordById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(paymentRecords)
    .where(eq(paymentRecords.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update payment record status
 */
export async function updatePaymentRecordStatus(
  id: number, 
  status: "pending" | "confirmed" | "rejected" | "refunded",
  adminNotes?: string,
  confirmedBy?: number
) {
  const db = await getDb();
  if (!db) return null;

  const updateData: Partial<PaymentRecord> = { 
    status,
    adminNotes: adminNotes || null,
  };

  if (status === "confirmed") {
    updateData.confirmedAt = new Date();
    if (confirmedBy) {
      updateData.confirmedBy = confirmedBy;
    }
  }

  return await db
    .update(paymentRecords)
    .set(updateData)
    .where(eq(paymentRecords.id, id));
}

/**
 * Get user's payment records
 */
export async function getUserPaymentRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(paymentRecords)
    .where(eq(paymentRecords.userId, userId))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get payment records by email
 */
export async function getPaymentRecordsByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(paymentRecords)
    .where(eq(paymentRecords.email, email))
    .orderBy((t) => desc(t.createdAt));
}


// ============================================
// Custom Alerts Functions
// ============================================

/**
 * Get user's custom alerts
 */
export async function getUserCustomAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(customAlerts)
    .where(eq(customAlerts.userId, userId))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Create a new custom alert
 */
export async function createCustomAlert(data: InsertCustomAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(customAlerts).values(data);
  return { id: result[0].insertId, ...data };
}

/**
 * Update a custom alert
 */
export async function updateCustomAlert(
  id: number, 
  userId: number, 
  data: Partial<InsertCustomAlert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(customAlerts)
    .set(data)
    .where(and(eq(customAlerts.id, id), eq(customAlerts.userId, userId)));

  return { success: true };
}

/**
 * Delete a custom alert
 */
export async function deleteCustomAlert(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(customAlerts)
    .where(and(eq(customAlerts.id, id), eq(customAlerts.userId, userId)));

  return { success: true };
}

/**
 * Toggle custom alert active status
 */
export async function toggleCustomAlert(id: number, userId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(customAlerts)
    .set({ isActive: isActive ? 1 : 0 })
    .where(and(eq(customAlerts.id, id), eq(customAlerts.userId, userId)));

  return { success: true };
}

/**
 * Get all active alerts for checking
 */
export async function getActiveCustomAlerts() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(customAlerts)
    .where(eq(customAlerts.isActive, 1));
}

/**
 * Update alert trigger info
 */
export async function updateAlertTrigger(id: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(customAlerts)
    .set({ 
      lastTriggered: new Date(),
      triggerCount: sql`${customAlerts.triggerCount} + 1`
    })
    .where(eq(customAlerts.id, id));
}


// ============================================
// User Registration Functions
// ============================================

import { userRegistrations, passwordResetTokens, InsertUserRegistration, InsertPasswordResetToken } from "../drizzle/schema";

/**
 * Create a new user registration
 */
export async function createUserRegistration(data: InsertUserRegistration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(userRegistrations).values(data);
  return { id: result[0].insertId, ...data };
}

/**
 * Get user registration by email
 */
export async function getUserRegistrationByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userRegistrations)
    .where(eq(userRegistrations.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Verify user email
 */
export async function verifyUserEmail(email: string, token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select()
    .from(userRegistrations)
    .where(and(
      eq(userRegistrations.email, email),
      eq(userRegistrations.verificationToken, token)
    ))
    .limit(1);

  if (user.length === 0) return null;

  // Check if token is expired
  if (user[0].tokenExpiresAt && new Date() > user[0].tokenExpiresAt) {
    return null;
  }

  await db
    .update(userRegistrations)
    .set({ 
      isVerified: 1, 
      verifiedAt: new Date(),
      verificationToken: null,
      tokenExpiresAt: null
    })
    .where(eq(userRegistrations.email, email));

  return user[0];
}

/**
 * Update user password
 */
export async function updateUserPassword(email: string, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userRegistrations)
    .set({ passwordHash })
    .where(eq(userRegistrations.email, email));

  return { success: true };
}

// ============================================
// Password Reset Functions
// ============================================

/**
 * Create a password reset token
 */
export async function createPasswordResetToken(data: InsertPasswordResetToken) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Invalidate any existing tokens for this email
  await db
    .update(passwordResetTokens)
    .set({ isUsed: 1 })
    .where(eq(passwordResetTokens.email, data.email));

  const result = await db.insert(passwordResetTokens).values(data);
  return { id: result[0].insertId, ...data };
}

/**
 * Get password reset token
 */
export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.token, token),
      eq(passwordResetTokens.isUsed, 0)
    ))
    .limit(1);

  if (result.length === 0) return null;

  // Check if token is expired
  if (new Date() > result[0].expiresAt) {
    return null;
  }

  return result[0];
}

/**
 * Mark password reset token as used
 */
export async function markPasswordResetTokenUsed(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(passwordResetTokens)
    .set({ isUsed: 1 })
    .where(eq(passwordResetTokens.token, token));

  return { success: true };
}


// ============================================
// Classified Analyses Functions
// ============================================

import { classifiedAnalyses, InsertClassifiedAnalysis, followedTopics, InsertFollowedTopic, topicAlerts, InsertTopicAlert } from "../drizzle/schema";

/**
 * Create a classified analysis record
 */
export async function createClassifiedAnalysis(data: InsertClassifiedAnalysis) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(classifiedAnalyses).values(data);
  return result;
}

/**
 * Get user's classified analyses
 */
export async function getUserClassifiedAnalyses(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classifiedAnalyses)
    .where(eq(classifiedAnalyses.userId, userId))
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get all classified analyses (for reports)
 */
export async function getAllClassifiedAnalyses(limit: number = 1000) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classifiedAnalyses)
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get classified analyses by domain
 */
export async function getClassifiedAnalysesByDomain(domain: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classifiedAnalyses)
    .where(eq(classifiedAnalyses.domain, domain as any))
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get classification statistics
 */
export async function getClassificationStats() {
  const db = await getDb();
  if (!db) return null;

  const stats = await db
    .select({
      domain: classifiedAnalyses.domain,
      sensitivity: classifiedAnalyses.sensitivity,
      count: sql<number>`COUNT(*)`,
      avgRisk: sql<number>`AVG(${classifiedAnalyses.emotionalRiskScore})`,
    })
    .from(classifiedAnalyses)
    .groupBy(classifiedAnalyses.domain, classifiedAnalyses.sensitivity);

  return stats;
}

/**
 * Get domain distribution
 */
export async function getDomainDistribution() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      domain: classifiedAnalyses.domain,
      count: sql<number>`COUNT(*)`,
      avgRisk: sql<number>`AVG(${classifiedAnalyses.emotionalRiskScore})`,
    })
    .from(classifiedAnalyses)
    .groupBy(classifiedAnalyses.domain);
}

/**
 * Get sensitivity distribution
 */
export async function getSensitivityDistribution() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      sensitivity: classifiedAnalyses.sensitivity,
      count: sql<number>`COUNT(*)`,
    })
    .from(classifiedAnalyses)
    .groupBy(classifiedAnalyses.sensitivity);
}

/**
 * Get analyses over time (for trend chart)
 */
export async function getAnalysesOverTime(days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return await db
    .select({
      date: sql<string>`DATE(${classifiedAnalyses.createdAt})`,
      domain: classifiedAnalyses.domain,
      count: sql<number>`COUNT(*)`,
      avgRisk: sql<number>`AVG(${classifiedAnalyses.emotionalRiskScore})`,
    })
    .from(classifiedAnalyses)
    .where(gte(classifiedAnalyses.createdAt, startDate))
    .groupBy(sql`DATE(${classifiedAnalyses.createdAt})`, classifiedAnalyses.domain)
    .orderBy(sql`DATE(${classifiedAnalyses.createdAt})`);
}

// ============================================
// Followed Topics Functions
// ============================================

/**
 * Create a followed topic
 */
export async function createFollowedTopic(data: InsertFollowedTopic) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(followedTopics).values(data);
  return result;
}

/**
 * Get user's followed topics
 */
export async function getUserFollowedTopics(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(followedTopics)
    .where(eq(followedTopics.userId, userId))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get active followed topics for a user
 */
export async function getActiveFollowedTopics(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(followedTopics)
    .where(and(
      eq(followedTopics.userId, userId),
      eq(followedTopics.isActive, 1)
    ))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Update followed topic
 */
export async function updateFollowedTopic(id: number, data: Partial<InsertFollowedTopic>) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(followedTopics)
    .set(data)
    .where(eq(followedTopics.id, id));
}

/**
 * Delete followed topic
 */
export async function deleteFollowedTopic(id: number) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .delete(followedTopics)
    .where(eq(followedTopics.id, id));
}

/**
 * Toggle followed topic active status
 */
export async function toggleFollowedTopicActive(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(followedTopics)
    .set({ isActive: isActive ? 1 : 0 })
    .where(eq(followedTopics.id, id));
}

// ============================================
// Topic Alerts Functions
// ============================================

/**
 * Create a topic alert
 */
export async function createTopicAlert(data: InsertTopicAlert) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(topicAlerts).values(data);
  return result;
}

/**
 * Get user's topic alerts
 */
export async function getUserTopicAlerts(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(topicAlerts)
    .where(eq(topicAlerts.userId, userId))
    .orderBy((t) => desc(t.createdAt))
    .limit(limit);
}

/**
 * Get user's unread topic alerts
 */
export async function getUnreadTopicAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(topicAlerts)
    .where(and(
      eq(topicAlerts.userId, userId),
      eq(topicAlerts.isRead, 0)
    ))
    .orderBy((t) => desc(t.createdAt));
}

/**
 * Get unread alerts count
 */
export async function getUnreadAlertsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(topicAlerts)
    .where(and(
      eq(topicAlerts.userId, userId),
      eq(topicAlerts.isRead, 0)
    ));

  return result[0]?.count || 0;
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(id: number) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(topicAlerts)
    .set({ isRead: 1, readAt: new Date() })
    .where(eq(topicAlerts.id, id));
}

/**
 * Mark all alerts as read for a user
 */
export async function markAllAlertsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(topicAlerts)
    .set({ isRead: 1, readAt: new Date() })
    .where(and(
      eq(topicAlerts.userId, userId),
      eq(topicAlerts.isRead, 0)
    ));
}

/**
 * Delete old alerts (cleanup)
 */
export async function deleteOldAlerts(daysOld: number = 30) {
  const db = await getDb();
  if (!db) return null;

  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

  return await db
    .delete(topicAlerts)
    .where(and(
      eq(topicAlerts.isRead, 1),
      sql`${topicAlerts.createdAt} < ${cutoffDate}`
    ));
}
