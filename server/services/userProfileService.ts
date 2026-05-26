/**
 * User Profile Service
 * 
 *     
 * :      
 */

import { getDb } from '../_core/db';
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

//       
const TECHNICAL_TERMS = [
  'gmi', 'cfi', 'hri',
  `مؤشر`, `تحليل`, `سيناريو`,
  'sentiment', 'analysis', 'index',
  `توقع`, `محاكاة`, `نمط`,
  'trend', 'pattern', 'correlation',
  `ارتباط`, `تذبذب`, 'volatility'
];

/**
 *        
 */
export async function getOrCreateProfile(userId: number): Promise<UserProfileData> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[UserProfileService] Database not available');
      return getDefaultProfile(userId);
    }
    
    //    
    const existing = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    
    if (existing.length > 0) {
      return parseProfile(existing[0]);
    }
    
    //   
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
    //      
    return getDefaultProfile(userId);
  }
}

/**
 *      
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
    
    //    
    const technicalTermsInMessage = countTechnicalTerms(message);
    const newTechnicalTermsUsed = profile.technicalTermsUsed + technicalTermsInMessage;
    
    //   
    const updatedTopics = updatePreferredTopics(profile.preferredTopics, topic);
    
    //    
    const updatedCountries = countryCode 
      ? updateCountriesOfInterest(profile.countriesOfInterest, countryCode)
      : profile.countriesOfInterest;
    
    //   
    const newMessageCount = profile.messageCount + 1;
    const newConversationCount = profile.conversationCount; //      
    const newLevel = calculateUserLevel(
      newMessageCount,
      newTechnicalTermsUsed,
      updatedTopics.length
    );
    
    //   
    const newConfidence = Math.min(100, profile.profileConfidence + 2);
    
    //   
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
 *   
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
 *    
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
 *   
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
  //   
  let score = 0;
  
  //    
  if (messageCount >= 50) score += 3;
  else if (messageCount >= 20) score += 2;
  else if (messageCount >= 5) score += 1;
  
  //    
  if (technicalTermsUsed >= 20) score += 3;
  else if (technicalTermsUsed >= 10) score += 2;
  else if (technicalTermsUsed >= 3) score += 1;
  
  //    
  if (topicsCount >= 10) score += 2;
  else if (topicsCount >= 5) score += 1;
  
  //  
  if (score >= 6) return 'advanced';
  if (score >= 3) return 'intermediate';
  return 'beginner';
}

function updatePreferredTopics(currentTopics: string[], newTopic: string): string[] {
  //  
  const cleanTopic = newTopic.trim().toLowerCase();
  if (!cleanTopic || cleanTopic.length < 2) return currentTopics;
  
  //     ( )
  const filtered = currentTopics.filter(t => t.toLowerCase() !== cleanTopic);
  
  //     ( )
  filtered.unshift(newTopic.trim());
  
  //   20  
  return filtered.slice(0, 20);
}

function updateCountriesOfInterest(currentCountries: string[], newCountry: string): string[] {
  if (!newCountry || newCountry.length < 2) return currentCountries;
  
  //    
  const filtered = currentCountries.filter(c => c !== newCountry);
  
  //    
  filtered.unshift(newCountry);
  
  //   10 
  return filtered.slice(0, 10);
}

/**
 *     
 */
export function getProfileSummary(profile: UserProfileData): string {
  const levelLabels: Record<UserLevel, string> = {
    beginner: `مبتدئ`,
    intermediate: `متوسط`,
    advanced: `خبير`
  };
  
  return `: ${levelLabels[profile.userLevel]} | : ${profile.conversationCount} | : ${profile.messageCount}`;
}
