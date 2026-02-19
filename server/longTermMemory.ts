import { db } from './db';
import { userProfiles, conversationHistory } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Long-term Memory System
 * Stores user preferences, emotional trends, and conversation history
 */

export interface UserMemory {
  userId: number;
  interests: string[];
  preferredLanguage: string;
  emotionalTrends: Array<{
    date: Date;
    emotion: string;
    intensity: number;
    topic: string;
  }>;
  conversationHistory: Array<{
    date: Date;
    topic: string;
    sentiment: number;
    keyPoints: string[];
  }>;
  personalityProfile: {
    formality: number;
    empathy: number;
    humor: number;
    verbosity: number;
  };
}

/**
 * Store user preferences
 */
export async function storeUserPreferences(
  userId: number,
  preferences: {
    interests: string[];
    preferredLanguage: string;
    timezone: string;
  }
): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userProfiles)
        .set({
          interests: JSON.stringify(preferences.interests),
          preferredLanguage: preferences.preferredLanguage,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
    } else {
      await db.insert(userProfiles).values({
        userId,
        interests: JSON.stringify(preferences.interests),
        preferredLanguage: preferences.preferredLanguage,
        timezone: preferences.timezone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Failed to store user preferences:', error);
    throw error;
  }
}

/**
 * Track emotional trends over time
 */
export async function trackEmotionalTrend(
  userId: number,
  emotion: string,
  intensity: number,
  topic: string
): Promise<void> {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length > 0) {
      const emotionalTrends = JSON.parse(profile[0].emotionalTrends || '[]');
      emotionalTrends.push({
        date: new Date(),
        emotion,
        intensity,
        topic,
      });

      // Keep only last 100 entries
      if (emotionalTrends.length > 100) {
        emotionalTrends.shift();
      }

      await db
        .update(userProfiles)
        .set({
          emotionalTrends: JSON.stringify(emotionalTrends),
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
    }
  } catch (error) {
    console.error('Failed to track emotional trend:', error);
  }
}

/**
 * Store conversation in history
 */
export async function storeConversation(
  userId: number,
  topic: string,
  sentiment: number,
  keyPoints: string[]
): Promise<void> {
  try {
    await db.insert(conversationHistory).values({
      userId,
      topic,
      sentiment,
      keyPoints: JSON.stringify(keyPoints),
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to store conversation:', error);
  }
}

/**
 * Get user memory for personalization
 */
export async function getUserMemory(userId: number): Promise<UserMemory | null> {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return null;

    const p = profile[0];
    const history = await db
      .select()
      .from(conversationHistory)
      .where(eq(conversationHistory.userId, userId));

    return {
      userId,
      interests: JSON.parse(p.interests || '[]'),
      preferredLanguage: p.preferredLanguage || 'en',
      emotionalTrends: JSON.parse(p.emotionalTrends || '[]'),
      conversationHistory: history.map(h => ({
        date: h.createdAt,
        topic: h.topic,
        sentiment: h.sentiment,
        keyPoints: JSON.parse(h.keyPoints || '[]'),
      })),
      personalityProfile: {
        formality: p.formalityScore || 50,
        empathy: p.empathyScore || 50,
        humor: p.humorScore || 50,
        verbosity: p.verbosityScore || 50,
      },
    };
  } catch (error) {
    console.error('Failed to get user memory:', error);
    return null;
  }
}

/**
 * Get emotional trend analysis
 */
export async function getEmotionalTrendAnalysis(userId: number): Promise<any> {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return null;

    const trends = JSON.parse(profile[0].emotionalTrends || '[]');

    // Calculate statistics
    const emotionCounts: Record<string, number> = {};
    const intensities: number[] = [];

    trends.forEach((trend: any) => {
      emotionCounts[trend.emotion] = (emotionCounts[trend.emotion] || 0) + 1;
      intensities.push(trend.intensity);
    });

    const avgIntensity = intensities.length > 0 
      ? intensities.reduce((a, b) => a + b, 0) / intensities.length 
      : 0;

    const dominantEmotion = Object.entries(emotionCounts).sort(
      (a: any, b: any) => b[1] - a[1]
    )[0]?.[0] || 'neutral';

    return {
      dominantEmotion,
      averageIntensity: Math.round(avgIntensity * 100) / 100,
      emotionDistribution: emotionCounts,
      totalTrends: trends.length,
      lastUpdated: trends[trends.length - 1]?.date || null,
    };
  } catch (error) {
    console.error('Failed to analyze emotional trends:', error);
    return null;
  }
}

/**
 * Update personality profile based on interactions
 */
export async function updatePersonalityProfile(
  userId: number,
  updates: {
    formalityScore?: number;
    empathyScore?: number;
    humorScore?: number;
    verbosityScore?: number;
  }
): Promise<void> {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length > 0) {
      await db
        .update(userProfiles)
        .set({
          formalityScore: updates.formalityScore || profile[0].formalityScore,
          empathyScore: updates.empathyScore || profile[0].empathyScore,
          humorScore: updates.humorScore || profile[0].humorScore,
          verbosityScore: updates.verbosityScore || profile[0].verbosityScore,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
    }
  } catch (error) {
    console.error('Failed to update personality profile:', error);
  }
}

/**
 * Initialize long-term memory system
 */
export function initializeLongTermMemory() {
  console.log('✅ Long-term Memory system initialized');
  console.log('- User preferences storage enabled');
  console.log('- Emotional trend tracking active');
  console.log('- Conversation history recording enabled');
  console.log('- Personality profile learning active');
}
