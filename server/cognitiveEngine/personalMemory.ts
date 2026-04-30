/**
 * Layer 13: Personal Memory Layer
 * 
 * This layer manages user-specific preferences, interaction history,
 * and tracks their interests to personalize future responses.
 */

export interface UserPreferences {
  tone: 'formal' | 'casual' | 'analytical';
  detailLevel: 'brief' | 'detailed' | 'comprehensive';
  language: 'ar' | 'en';
  wantsScenarios: boolean;
  wantsData: boolean;
}

export interface UserProfile {
  userId: string;
  interests: string[];        // Extracted from repeated queries (e.g., 'الذهب', 'مصر')
  historyCount: number;
  preferences: UserPreferences;
  lastActive: number;
}

// In-memory store for demonstration. In production, this goes to DB.
const userProfiles = new Map<string, UserProfile>();

const DEFAULT_PREFERENCES: UserPreferences = {
  tone: 'analytical',
  detailLevel: 'detailed',
  language: 'ar',
  wantsScenarios: true,
  wantsData: true
};

/**
 * Retrieves a user's profile, creating a default one if it doesn't exist.
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  let profile = userProfiles.get(userId);
  
  if (!profile) {
    profile = {
      userId,
      interests: [],
      historyCount: 0,
      preferences: { ...DEFAULT_PREFERENCES },
      lastActive: Date.now()
    };
    userProfiles.set(userId, profile);
  }
  
  return profile;
}

/**
 * Updates a user's profile based on a new interaction.
 */
export async function updateUserMemory(
  userId: string,
  topic: string,
  questionType: string
): Promise<void> {
  const profile = await getUserProfile(userId);
  
  // Update basic stats
  profile.lastActive = Date.now();
  profile.historyCount += 1;
  
  // Track interests (only if it's a specific topic)
  if (topic && topic !== 'موضوع عام' && !profile.interests.includes(topic)) {
    profile.interests.push(topic);
    // Keep top 10 most recent/relevant interests
    if (profile.interests.length > 10) {
      profile.interests.shift();
    }
  }

  // Implicitly update preferences based on question types
  if (questionType === 'what_if') {
    profile.preferences.wantsScenarios = true;
  }
  if (questionType === 'why' || questionType === 'explain') {
    profile.preferences.detailLevel = 'comprehensive';
  }
  if (questionType === 'when' || questionType === 'will') {
    profile.preferences.wantsData = true;
  }

  userProfiles.set(userId, profile);
}

/**
 * Customizes an outgoing response based on user memory.
 */
export function personalizeResponseContext(profile: UserProfile): string {
  if (profile.historyCount < 3) {
    return ""; // Not enough data to personalize
  }

  const lang = profile.preferences.language;
  let contextStr = lang === 'ar' ? "ملاحظة لتخصيص الإجابة للمستخدم:\n" : "User Personalization Note:\n";
  
  if (profile.interests.length > 0) {
    contextStr += lang === 'ar' 
      ? `- هذا المستخدم مهتم بـ: ${profile.interests.join('، ')}\n`
      : `- This user is interested in: ${profile.interests.join(', ')}\n`;
  }
  
  contextStr += lang === 'ar'
    ? `- يفضل الردود بمستوى تفصيل: ${profile.preferences.detailLevel}\n`
    : `- Prefers detail level: ${profile.preferences.detailLevel}\n`;

  return contextStr;
}
