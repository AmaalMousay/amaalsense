/**
 * User Profile Service
 * 
 * يدير بروفايلات المستخدمين لتخصيص الردود
 * يحفظ: مستوى المستخدم، المواضيع المفضلة، أنماط التفاعل
 */

import { getDb } from './db';
import { userProfiles, type UserProfile, type InsertUserProfile } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';
export type ResponseLength = 'short' | 'medium' | 'detailed';

export interface UserProfileData {
  userId: number;
  userLevel: UserLevel;
  conversationCount: number;
  messageCount: number;
  preferredTopics: string[];
  technicalTermsUsed: number;
  preferredResponseLength: ResponseLength;
  preferredLanguage: string;
  lastEmotionalState: string | null;
  countriesOfInterest: string[];
  lastActiveTopic: string | null;
  profileConfidence: number;
}

// الكلمات التقنية التي تدل على مستخدم متقدم
const TECHNICAL_TERMS = [
  'gmi', 'cfi', 'hri',
  'مؤشر', 'تحليل', 'سيناريو',
  'sentiment', 'analysis', 'index',
  'توقع', 'محاكاة', 'نمط',
  'trend', 'pattern', 'correlation',
  'ارتباط', 'تذبذب', 'volatility'
];

/**
 * الحصول على بروفايل المستخدم أو إنشاء واحد جديد
 */
export async function getOrCreateProfile(userId: number): Promise<UserProfileData> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[UserProfileService] Database not available');
      return getDefaultProfile(userId);
    }
    
    // البحث عن البروفايل الموجود
    const existing = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    
    if (existing.length > 0) {
      return parseProfile(existing[0]);
    }
    
    // إنشاء بروفايل جديد
    const newProfile: InsertUserProfile = {
      userId,
      userLevel: 'beginner',
      conversationCount: 0,
      messageCount: 0,
      preferredTopics: JSON.stringify([]),
      technicalTermsUsed: 0,
      preferredResponseLength: 'medium',
      preferredLanguage: 'ar',
      lastEmotionalState: null,
      countriesOfInterest: JSON.stringify([]),
      lastActiveTopic: null,
      profileConfidence: 50
    };
    
    await db.insert(userProfiles).values(newProfile);
    
    return {
      userId,
      userLevel: 'beginner',
      conversationCount: 0,
      messageCount: 0,
      preferredTopics: [],
      technicalTermsUsed: 0,
      preferredResponseLength: 'medium',
      preferredLanguage: 'ar',
      lastEmotionalState: null,
      countriesOfInterest: [],
      lastActiveTopic: null,
      profileConfidence: 50
    };
  } catch (error) {
    console.error('[UserProfileService] Error getting/creating profile:', error);
    // إرجاع بروفايل افتراضي في حالة الخطأ
    return getDefaultProfile(userId);
  }
}

/**
 * تحديث البروفايل بناءً على تفاعل المستخدم
 */
export async function updateProfileFromInteraction(
  userId: number,
  message: string,
  topic: string,
  emotionalState?: string,
  countryCode?: string
): Promise<UserProfileData> {
  try {
    const profile = await getOrCreateProfile(userId);
    
    // حساب الكلمات التقنية المستخدمة
    const technicalTermsInMessage = countTechnicalTerms(message);
    const newTechnicalTermsUsed = profile.technicalTermsUsed + technicalTermsInMessage;
    
    // تحديث المواضيع المفضلة
    const updatedTopics = updatePreferredTopics(profile.preferredTopics, topic);
    
    // تحديث الدول المهتم بها
    const updatedCountries = countryCode 
      ? updateCountriesOfInterest(profile.countriesOfInterest, countryCode)
      : profile.countriesOfInterest;
    
    // حساب المستوى الجديد
    const newMessageCount = profile.messageCount + 1;
    const newConversationCount = profile.conversationCount; // يتم تحديثه عند بدء محادثة جديدة
    const newLevel = calculateUserLevel(
      newMessageCount,
      newTechnicalTermsUsed,
      updatedTopics.length
    );
    
    // حساب ثقة البروفايل
    const newConfidence = Math.min(100, profile.profileConfidence + 2);
    
    // تحديث قاعدة البيانات
    const db = await getDb();
    if (db) {
      await db
        .update(userProfiles)
        .set({
          userLevel: newLevel,
          messageCount: newMessageCount,
          technicalTermsUsed: newTechnicalTermsUsed,
          preferredTopics: JSON.stringify(updatedTopics),
          countriesOfInterest: JSON.stringify(updatedCountries),
          lastActiveTopic: topic,
          lastEmotionalState: emotionalState || profile.lastEmotionalState,
          profileConfidence: newConfidence
        })
        .where(eq(userProfiles.userId, userId));
    }
    
    console.log('[UserProfileService] Profile updated:', {
      userId,
      newLevel,
      messageCount: newMessageCount,
      technicalTermsUsed: newTechnicalTermsUsed,
      topicsCount: updatedTopics.length
    });
    
    return {
      ...profile,
      userLevel: newLevel,
      messageCount: newMessageCount,
      technicalTermsUsed: newTechnicalTermsUsed,
      preferredTopics: updatedTopics,
      countriesOfInterest: updatedCountries,
      lastActiveTopic: topic,
      lastEmotionalState: emotionalState || profile.lastEmotionalState,
      profileConfidence: newConfidence
    };
  } catch (error) {
    console.error('[UserProfileService] Error updating profile:', error);
    return getDefaultProfile(userId);
  }
}

/**
 * زيادة عدد المحادثات
 */
export async function incrementConversationCount(userId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    const profile = await getOrCreateProfile(userId);
    await db
      .update(userProfiles)
      .set({
        conversationCount: profile.conversationCount + 1
      })
      .where(eq(userProfiles.userId, userId));
  } catch (error) {
    console.error('[UserProfileService] Error incrementing conversation count:', error);
  }
}

/**
 * تحديث طول الرد المفضل
 */
export async function updatePreferredResponseLength(
  userId: number,
  length: ResponseLength
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db
      .update(userProfiles)
      .set({ preferredResponseLength: length })
      .where(eq(userProfiles.userId, userId));
  } catch (error) {
    console.error('[UserProfileService] Error updating response length:', error);
  }
}

/**
 * تحديث اللغة المفضلة
 */
export async function updatePreferredLanguage(
  userId: number,
  language: string
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db
      .update(userProfiles)
      .set({ preferredLanguage: language })
      .where(eq(userProfiles.userId, userId));
  } catch (error) {
    console.error('[UserProfileService] Error updating language:', error);
  }
}

// ============ Helper Functions ============

function parseProfile(dbProfile: UserProfile): UserProfileData {
  return {
    userId: dbProfile.userId,
    userLevel: dbProfile.userLevel as UserLevel,
    conversationCount: dbProfile.conversationCount,
    messageCount: dbProfile.messageCount,
    preferredTopics: safeParseJSON(dbProfile.preferredTopics, []),
    technicalTermsUsed: dbProfile.technicalTermsUsed,
    preferredResponseLength: (dbProfile.preferredResponseLength || 'medium') as ResponseLength,
    preferredLanguage: dbProfile.preferredLanguage || 'ar',
    lastEmotionalState: dbProfile.lastEmotionalState,
    countriesOfInterest: safeParseJSON(dbProfile.countriesOfInterest, []),
    lastActiveTopic: dbProfile.lastActiveTopic,
    profileConfidence: dbProfile.profileConfidence
  };
}

function getDefaultProfile(userId: number): UserProfileData {
  return {
    userId,
    userLevel: 'beginner',
    conversationCount: 0,
    messageCount: 0,
    preferredTopics: [],
    technicalTermsUsed: 0,
    preferredResponseLength: 'medium',
    preferredLanguage: 'ar',
    lastEmotionalState: null,
    countriesOfInterest: [],
    lastActiveTopic: null,
    profileConfidence: 50
  };
}

function safeParseJSON<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

function countTechnicalTerms(text: string): number {
  const lowerText = text.toLowerCase();
  let count = 0;
  for (const term of TECHNICAL_TERMS) {
    if (lowerText.includes(term.toLowerCase())) {
      count++;
    }
  }
  return count;
}

function calculateUserLevel(
  messageCount: number,
  technicalTermsUsed: number,
  topicsCount: number
): UserLevel {
  // حساب نقاط الخبرة
  let score = 0;
  
  // نقاط من عدد الرسائل
  if (messageCount >= 50) score += 3;
  else if (messageCount >= 20) score += 2;
  else if (messageCount >= 5) score += 1;
  
  // نقاط من الكلمات التقنية
  if (technicalTermsUsed >= 20) score += 3;
  else if (technicalTermsUsed >= 10) score += 2;
  else if (technicalTermsUsed >= 3) score += 1;
  
  // نقاط من تنوع المواضيع
  if (topicsCount >= 10) score += 2;
  else if (topicsCount >= 5) score += 1;
  
  // تحديد المستوى
  if (score >= 6) return 'advanced';
  if (score >= 3) return 'intermediate';
  return 'beginner';
}

function updatePreferredTopics(currentTopics: string[], newTopic: string): string[] {
  // تنظيف الموضوع
  const cleanTopic = newTopic.trim().toLowerCase();
  if (!cleanTopic || cleanTopic.length < 2) return currentTopics;
  
  // إزالة الموضوع إذا موجود (لإعادة ترتيبه)
  const filtered = currentTopics.filter(t => t.toLowerCase() !== cleanTopic);
  
  // إضافة الموضوع في البداية (الأحدث أولاً)
  filtered.unshift(newTopic.trim());
  
  // الاحتفاظ بأحدث 20 موضوع فقط
  return filtered.slice(0, 20);
}

function updateCountriesOfInterest(currentCountries: string[], newCountry: string): string[] {
  if (!newCountry || newCountry.length < 2) return currentCountries;
  
  // إزالة الدولة إذا موجودة
  const filtered = currentCountries.filter(c => c !== newCountry);
  
  // إضافة الدولة في البداية
  filtered.unshift(newCountry);
  
  // الاحتفاظ بأحدث 10 دول
  return filtered.slice(0, 10);
}

/**
 * الحصول على ملخص البروفايل للعرض
 */
export function getProfileSummary(profile: UserProfileData): string {
  const levelLabels: Record<UserLevel, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'خبير'
  };
  
  return `المستوى: ${levelLabels[profile.userLevel]} | المحادثات: ${profile.conversationCount} | الرسائل: ${profile.messageCount}`;
}
