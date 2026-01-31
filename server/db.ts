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
