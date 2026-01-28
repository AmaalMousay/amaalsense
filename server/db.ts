import { eq, desc, asc, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emotionIndices, emotionAnalyses, InsertEmotionAnalysis, InsertEmotionIndex } from "../drizzle/schema";
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


