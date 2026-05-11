/**
 * API Key Management Service (Production Grade)
 * Handles generation, validation, and usage tracking using Database + Hashing.
 */
import { nanoid } from 'nanoid';
import { hash, compare } from 'bcryptjs';
import { getDb } from './db';
import { apiKeys } from '../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';
import { SubscriptionTier } from '../engines/subscriptionLimits';

export interface ApiKeyData {
  id: string;
  userId: number;
  partialKey: string;
  tier: SubscriptionTier;
  usage: number;
  limit: number;
  createdAt: Date;
  active: boolean;
}

/**
 * Generates a new API key for a user and stores it securely
 */
export async function generateApiKey(userId: number, tier: SubscriptionTier): Promise<ApiKeyData & { key: string }> {
  // Only Professional, Enterprise and Government tiers can generate API keys
  if (tier === 'free') {
    throw new Error('API Access requires a Professional or Enterprise subscription');
  }

  // Generate a secure random key
  const rawKey = `amal_${nanoid(32)}`;
  const keyId = nanoid(10);
  
  // Hash the key for secure storage
  const keyHash = await hash(rawKey, 10);
  
  // Set limits based on tier
  const limit = tier === 'enterprise' ? 10000 : tier === 'government' ? 50000 : 1000;
  
  const partialKey = `${rawKey.substring(0, 8)}...${rawKey.substring(rawKey.length - 4)}`;

  // Store in database
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(apiKeys).values({
    id: keyId,
    userId,
    keyHash,
    partialKey,
    tier: tier as any,
    usage: 0,
    limit,
    isActive: true,
  });
  
  return {
    id: keyId,
    userId,
    key: rawKey,
    partialKey,
    tier,
    usage: 0,
    limit,
    createdAt: new Date(),
    active: true
  };
}

/**
 * Validates an API key and checks rate limits
 */
export async function validateApiKey(key: string): Promise<boolean> {
  // This is slightly complex because we store hashes. 
  // For high-performance, we would usually use a cache or a prefix-lookup.
  // Here we do a lookup by partial key or just scan (optimized for small scale).
  
  // In a real high-scale system, we'd store a 'key_id' in the header or use Redis.
  const db = await getDb();
  if (!db) return false;
  
  const allKeys = await db.select().from(apiKeys).where(eq(apiKeys.isActive, true));
  
  for (const keyRecord of allKeys) {
    const isValid = await compare(key, keyRecord.keyHash);
    if (isValid) {
      if (keyRecord.limit !== -1 && keyRecord.usage >= keyRecord.limit) {
        return false; // Rate limit exceeded
      }
      
      // Update last used
      await db.update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, keyRecord.id));
        
      return true;
    }
  }
  
  return false;
}

/**
 * Increments usage for an API key
 */
export async function incrementApiUsage(keyId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(apiKeys)
    .set({ usage: sql`${apiKeys.usage} + 1` })
    .where(eq(apiKeys.id, keyId));
}

/**
 * Retrieves all API keys for a specific user
 */
export async function getUserApiKeys(userId: number): Promise<ApiKeyData[]> {
  const db = await getDb();
  if (!db) return [];
  
  const records = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
  
  return records.map(r => ({
    id: r.id,
    userId: r.userId,
    partialKey: r.partialKey,
    tier: r.tier as SubscriptionTier,
    usage: r.usage,
    limit: r.limit,
    createdAt: r.createdAt,
    active: r.isActive
  })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Revokes an API key
 */
export async function revokeApiKey(userId: number, keyId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.update(apiKeys)
    .set({ isActive: false })
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.id, keyId)));
    
  return true; // Drizzle return type varies by driver, usually we check affected rows
}
