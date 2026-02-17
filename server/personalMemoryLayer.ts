/**
 * Personal Memory Layer (Layer 12)
 * 
 * تذكر المستخدم وتاريخ محادثاته
 * تخصيص الردود بناءً على السياق الشخصي
 */

import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

// Note: userConversations table will be created when DB schema is extended

/**
 * سجل المحادثة
 */
export interface ConversationRecord {
  id: string;
  userId: string;
  question: string;
  questionType: string;
  detectedTopics: string[];
  detectedCountries: string[];
  response: string;
  emotions: {
    joy: number;
    hope: number;
    sadness: number;
    anger: number;
    fear: number;
    curiosity: number;
  };
  timestamp: Date;
  language: 'ar' | 'en';
}

/**
 * ملف المستخدم الشخصي
 */
export interface UserProfile {
  userId: string;
  name: string;
  preferredLanguage: 'ar' | 'en';
  dialect?: string;
  interests: string[]; // المواضيع التي يهتم بها
  countries: string[]; // الدول التي يهتم بها
  conversationCount: number;
  lastInteraction: Date;
  averageEmotions: {
    joy: number;
    hope: number;
    sadness: number;
    anger: number;
    fear: number;
    curiosity: number;
  };
}

/**
 * حفظ محادثة جديدة
 */
export async function saveConversation(
  userId: string,
  conversation: Omit<ConversationRecord, 'id' | 'userId'>
): Promise<ConversationRecord> {
  try {
    const record: ConversationRecord = {
      id: `conv-${userId}-${Date.now()}`,
      userId,
      ...conversation,
    };

    // حفظ في قاعدة البيانات (إذا كانت موجودة)
    // await db.insert(userConversations).values(record);

    console.log('[PersonalMemory] Conversation saved:', {
      userId,
      questionType: conversation.questionType,
      topics: conversation.detectedTopics,
    });

    return record;
  } catch (error) {
    console.error('[PersonalMemory] Error saving conversation:', error);
    throw error;
  }
}

/**
 * استرجاع آخر محادثات المستخدم
 */
export async function getUserConversationHistory(
  userId: string,
  limit: number = 5
): Promise<ConversationRecord[]> {
  try {
    // هنا يمكن جلب من قاعدة البيانات
    // const conversations = await db
    //   .select()
    //   .from(userConversations)
    //   .where(eq(userConversations.userId, userId))
    //   .orderBy(desc(userConversations.timestamp))
    //   .limit(limit);

    console.log('[PersonalMemory] Retrieved conversation history for user:', userId);

    // للآن، نرجع مصفوفة فارغة (سيتم ربطها بقاعدة البيانات لاحقاً)
    return [];
  } catch (error) {
    console.error('[PersonalMemory] Error retrieving conversation history:', error);
    return [];
  }
}

/**
 * بناء ملف المستخدم من السجلات
 */
export async function buildUserProfile(userId: string): Promise<UserProfile> {
  try {
    const conversations = await getUserConversationHistory(userId, 100);

    // استخراج المواضيع والدول المتكررة
    const topicsMap = new Map<string, number>();
    const countriesMap = new Map<string, number>();
    let totalEmotions = {
      joy: 0,
      hope: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      curiosity: 0,
    };

    for (const conv of conversations) {
      // عد المواضيع
      for (const topic of conv.detectedTopics) {
        topicsMap.set(topic, (topicsMap.get(topic) || 0) + 1);
      }

      // عد الدول
      for (const country of conv.detectedCountries) {
        countriesMap.set(country, (countriesMap.get(country) || 0) + 1);
      }

      // جمع العواطف
      totalEmotions.joy += conv.emotions.joy;
      totalEmotions.hope += conv.emotions.hope;
      totalEmotions.sadness += conv.emotions.sadness;
      totalEmotions.anger += conv.emotions.anger;
      totalEmotions.fear += conv.emotions.fear;
      totalEmotions.curiosity += conv.emotions.curiosity;
    }

    // حساب المتوسط
    const count = Math.max(conversations.length, 1);
    const averageEmotions = {
      joy: totalEmotions.joy / count,
      hope: totalEmotions.hope / count,
      sadness: totalEmotions.sadness / count,
      anger: totalEmotions.anger / count,
      fear: totalEmotions.fear / count,
      curiosity: totalEmotions.curiosity / count,
    };

    // الحصول على أكثر المواضيع والدول
    const interests = Array.from(topicsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    const countries = Array.from(countriesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country]) => country);

    const profile: UserProfile = {
      userId,
      name: userId, // سيتم تحديثه من قاعدة البيانات
      preferredLanguage: conversations.length > 0 ? conversations[0].language : 'ar',
      interests,
      countries,
      conversationCount: conversations.length,
      lastInteraction: conversations.length > 0 ? conversations[0].timestamp : new Date(),
      averageEmotions,
    };

    console.log('[PersonalMemory] User profile built:', {
      userId,
      interests: profile.interests,
      countries: profile.countries,
      conversationCount: profile.conversationCount,
    });

    return profile;
  } catch (error) {
    console.error('[PersonalMemory] Error building user profile:', error);
    
    // إرجاع ملف افتراضي
    return {
      userId,
      name: userId,
      preferredLanguage: 'ar',
      interests: [],
      countries: [],
      conversationCount: 0,
      lastInteraction: new Date(),
      averageEmotions: {
        joy: 0.2,
        hope: 0.2,
        sadness: 0.2,
        anger: 0.2,
        fear: 0.2,
        curiosity: 0.2,
      },
    };
  }
}

/**
 * تحسين السؤال بناءً على الذاكرة الشخصية
 */
export async function enhanceQuestionWithMemory(
  userId: string,
  question: string,
  detectedTopics: string[],
  detectedCountries: string[]
): Promise<{
  contextualTopics: string[];
  contextualCountries: string[];
  userInterests: string[];
  suggestedFocus: string;
  isFollowUp: boolean;
}> {
  try {
    const profile = await buildUserProfile(userId);
    const history = await getUserConversationHistory(userId, 3);

    // تحديد إذا كان السؤال متابعة لسؤال سابق
    const isFollowUp = history.length > 0 && 
      (history[0].detectedTopics.some(t => detectedTopics.includes(t)) ||
       history[0].detectedCountries.some(c => detectedCountries.includes(c)));

    // دمج المواضيع المكتشفة مع اهتمامات المستخدم
    const contextualTopics = Array.from(new Set([
      ...detectedTopics,
      ...profile.interests.filter(i => detectedTopics.length === 0),
    ]));

    const contextualCountries = Array.from(new Set([
      ...detectedCountries,
      ...profile.countries.filter(c => detectedCountries.length === 0),
    ]));

    // اقتراح التركيز بناءً على اهتمامات المستخدم
    const suggestedFocus = profile.interests[0] || detectedTopics[0] || 'General';

    console.log('[PersonalMemory] Question enhanced with memory:', {
      userId,
      isFollowUp,
      contextualTopics,
      contextualCountries,
      suggestedFocus,
    });

    return {
      contextualTopics,
      contextualCountries,
      userInterests: profile.interests,
      suggestedFocus,
      isFollowUp,
    };
  } catch (error) {
    console.error('[PersonalMemory] Error enhancing question:', error);
    
    return {
      contextualTopics: detectedTopics,
      contextualCountries: detectedCountries,
      userInterests: [],
      suggestedFocus: detectedTopics[0] || 'General',
      isFollowUp: false,
    };
  }
}

/**
 * تتبع تطور اهتمامات المستخدم
 */
export async function trackUserInterests(
  userId: string,
  topics: string[],
  countries: string[]
): Promise<void> {
  try {
    const profile = await buildUserProfile(userId);

    // تحديث الاهتمامات
    const updatedInterests = Array.from(new Set([...profile.interests, ...topics]));
    const updatedCountries = Array.from(new Set([...profile.countries, ...countries]));

    console.log('[PersonalMemory] User interests tracked:', {
      userId,
      newInterests: updatedInterests,
      newCountries: updatedCountries,
    });

    // هنا يمكن حفظ في قاعدة البيانات
    // await db.update(users)
    //   .set({ interests: updatedInterests, countries: updatedCountries })
    //   .where(eq(users.id, userId));
  } catch (error) {
    console.error('[PersonalMemory] Error tracking interests:', error);
  }
}

/**
 * الحصول على السياق الشامل للمستخدم
 */
export async function getUserContext(userId: string): Promise<{
  profile: UserProfile;
  recentConversations: ConversationRecord[];
  emotionalTrend: 'positive' | 'neutral' | 'negative';
  engagementLevel: 'low' | 'medium' | 'high';
}> {
  try {
    const profile = await buildUserProfile(userId);
    const recentConversations = await getUserConversationHistory(userId, 5);

    // تحديد الاتجاه العاطفي
    const avgHope = profile.averageEmotions.hope;
    const avgSadness = profile.averageEmotions.sadness;
    const avgAnger = profile.averageEmotions.anger;
    
    let emotionalTrend: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (avgHope > 0.4) {
      emotionalTrend = 'positive';
    } else if (avgSadness > 0.4 || avgAnger > 0.4) {
      emotionalTrend = 'negative';
    }

    // تحديد مستوى الانخراط
    let engagementLevel: 'low' | 'medium' | 'high' = 'low';
    if (profile.conversationCount > 20) {
      engagementLevel = 'high';
    } else if (profile.conversationCount > 5) {
      engagementLevel = 'medium';
    }

    console.log('[PersonalMemory] User context retrieved:', {
      userId,
      emotionalTrend,
      engagementLevel,
      conversationCount: profile.conversationCount,
    });

    return {
      profile,
      recentConversations,
      emotionalTrend,
      engagementLevel,
    };
  } catch (error) {
    console.error('[PersonalMemory] Error getting user context:', error);
    
    return {
      profile: await buildUserProfile(userId),
      recentConversations: [],
      emotionalTrend: 'neutral',
      engagementLevel: 'low',
    };
  }
}
