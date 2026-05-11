/**
 * Twitter Service - Using Manus Data API
 * Provides real Twitter data without API keys
 */

import { callDataApi } from "./_core/dataApi";

export interface TwitterPost {
  id: string;
  text: string;
  author: string;
  authorDisplayName: string;
  platform: 'twitter';
  url: string;
  publishedAt: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    quotes: number;
  };
  metadata?: Record<string, unknown>;
  isReal: boolean;
}

export interface TwitterSearchParams {
  query: string;
  limit?: number;
  language?: string;
  country?: string;
}

/**
 * Search Twitter posts by keyword
 */
export async function searchTwitterPosts(params: TwitterSearchParams): Promise<TwitterPost[]> {
  try {
    console.log(`[Twitter] Searching for: "${params.query}"`);
    
    // Use Twitter search API through Manus Data API
    const result = await callDataApi("Twitter/search_tweets", {
      query: { 
        query: params.query,
        count: String(params.limit || 20)
      },
    }) as any;

    if (!result) {
      console.warn('[Twitter] No results returned');
      return [];
    }

    // Parse the response structure
    const tweets: TwitterPost[] = [];
    
    // Handle different response structures
    if (result.result?.timeline?.instructions) {
      const instructions = result.result.timeline.instructions;
      
      for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries') {
          const entries = instruction.entries || [];
          
          for (const entry of entries) {
            if (entry.entryId?.startsWith('tweet-')) {
              const content = entry.content;
              if (content?.itemContent?.tweet_results?.result) {
                const tweetData = content.itemContent.tweet_results.result;
                const tweet = parseTweetData(tweetData);
                if (tweet) {
                  tweets.push(tweet);
                }
              }
            }
          }
        }
      }
    }

    console.log(`[Twitter] Fetched ${tweets.length} real tweets`);
    return tweets.slice(0, params.limit || 20);
  } catch (error) {
    console.error('[Twitter] Search error:', error);
    return [];
  }
}

/**
 * Get tweets from a specific user
 */
export async function getUserTweets(username: string, limit: number = 20): Promise<TwitterPost[]> {
  try {
    console.log(`[Twitter] Fetching tweets from @${username}`);
    
    // First get user profile to get user ID
    const profileResult = await callDataApi("Twitter/get_user_profile_by_username", {
      query: { username },
    }) as any;

    if (!profileResult?.result?.data?.user?.result?.rest_id) {
      console.warn(`[Twitter] Could not find user: @${username}`);
      return [];
    }

    const userId = profileResult.result.data.user.result.rest_id;
    
    // Then get user tweets
    const tweetsResult = await callDataApi("Twitter/get_user_tweets", {
      query: { 
        user: userId,
        count: String(limit)
      },
    }) as any;

    if (!tweetsResult) {
      return [];
    }

    const tweets: TwitterPost[] = [];
    
    // Parse timeline structure
    if (tweetsResult.result?.timeline?.instructions) {
      const instructions = tweetsResult.result.timeline.instructions;
      
      for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries') {
          const entries = instruction.entries || [];
          
          for (const entry of entries) {
            if (entry.entryId?.startsWith('tweet-')) {
              const content = entry.content;
              if (content?.itemContent?.tweet_results?.result) {
                const tweetData = content.itemContent.tweet_results.result;
                const tweet = parseTweetData(tweetData);
                if (tweet) {
                  tweets.push(tweet);
                }
              }
            }
          }
        }
      }
    }

    console.log(`[Twitter] Fetched ${tweets.length} tweets from @${username}`);
    return tweets.slice(0, limit);
  } catch (error) {
    console.error('[Twitter] User tweets error:', error);
    return [];
  }
}

/**
 * Get Twitter user profile
 */
export async function getTwitterUserProfile(username: string): Promise<{
  id: string;
  username: string;
  displayName: string;
  description: string;
  followers: number;
  following: number;
  tweets: number;
  verified: boolean;
  profileImage: string;
  createdAt: Date;
} | null> {
  try {
    const result = await callDataApi("Twitter/get_user_profile_by_username", {
      query: { username },
    }) as any;

    if (!result?.result?.data?.user?.result) {
      return null;
    }

    const userData = result.result.data.user.result;
    const core = userData.core || {};
    const legacy = userData.legacy || {};
    const verification = userData.verification || {};
    const avatar = userData.avatar || {};

    return {
      id: userData.rest_id || '',
      username: core.screen_name || username,
      displayName: core.name || '',
      description: legacy.description || '',
      followers: legacy.followers_count || 0,
      following: legacy.friends_count || 0,
      tweets: legacy.statuses_count || 0,
      verified: verification.verified || userData.is_blue_verified || false,
      profileImage: avatar.image_url || legacy.profile_image_url_https || '',
      createdAt: new Date(core.created_at || Date.now()),
    };
  } catch (error) {
    console.error('[Twitter] Profile error:', error);
    return null;
  }
}

/**
 * Parse tweet data from API response
 */
function parseTweetData(tweetData: any): TwitterPost | null {
  try {
    const legacy = tweetData.legacy || {};
    const core = tweetData.core || {};
    const userResults = core.user_results?.result || {};
    const userLegacy = userResults.legacy || {};

    const tweetId = legacy.id_str || tweetData.rest_id || '';
    const username = userLegacy.screen_name || 'unknown';
    
    if (!tweetId || !legacy.full_text) {
      return null;
    }

    return {
      id: tweetId,
      text: legacy.full_text || '',
      author: username,
      authorDisplayName: userLegacy.name || username,
      platform: 'twitter',
      url: `https://twitter.com/${username}/status/${tweetId}`,
      publishedAt: new Date(legacy.created_at || Date.now()),
      engagement: {
        likes: legacy.favorite_count || 0,
        comments: legacy.reply_count || 0,
        shares: legacy.retweet_count || 0,
        quotes: legacy.quote_count || 0,
      },
      metadata: {
        isRetweet: !!legacy.retweeted_status_result,
        isReply: !!legacy.in_reply_to_status_id_str,
        hasMedia: (legacy.entities?.media?.length || 0) > 0,
        language: legacy.lang,
      },
      isReal: true,
    };
  } catch (error) {
    console.error('[Twitter] Parse error:', error);
    return null;
  }
}

/**
 * Check if Twitter API is available
 */
export async function isTwitterAvailable(): Promise<boolean> {
  try {
    // Try a simple search to check availability
    const result = await callDataApi("Twitter/get_user_profile_by_username", {
      query: { username: "twitter" },
    });
    return !!result;
  } catch {
    return false;
  }
}
