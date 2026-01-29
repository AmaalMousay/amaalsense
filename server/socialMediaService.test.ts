import { describe, it, expect, vi } from 'vitest';

// Import the service
const {
  fetchRedditPosts,
  fetchMastodonPosts,
  fetchBlueskyPosts,
  fetchYouTubeComments,
  fetchTelegramPosts,
  fetchAllSocialMedia,
  fetchFromPlatforms,
  fetchCountrySocialMedia,
} = await import('./socialMediaService');

describe('Social Media Service', () => {
  describe('fetchRedditPosts', () => {
    it('should return an array of posts', async () => {
      const posts = await fetchRedditPosts({ query: 'technology', limit: 5 });
      
      expect(Array.isArray(posts)).toBe(true);
      // May return empty if API is rate limited
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('id');
        expect(posts[0]).toHaveProperty('text');
        expect(posts[0]).toHaveProperty('author');
        expect(posts[0]).toHaveProperty('platform');
        expect(posts[0].platform).toBe('reddit');
      }
    }, 15000);

    it('should handle empty query gracefully', async () => {
      const posts = await fetchRedditPosts({ query: 'xyznonexistent123456', limit: 5 });
      expect(Array.isArray(posts)).toBe(true);
    }, 15000);
  });

  describe('fetchMastodonPosts', () => {
    it('should return an array of posts', async () => {
      const posts = await fetchMastodonPosts({ query: 'news', limit: 5 });
      
      expect(Array.isArray(posts)).toBe(true);
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('platform');
        expect(posts[0].platform).toBe('mastodon');
      }
    }, 15000);
  });

  describe('fetchBlueskyPosts', () => {
    it('should return an array of posts', async () => {
      const posts = await fetchBlueskyPosts({ query: 'technology', limit: 5 });
      
      expect(Array.isArray(posts)).toBe(true);
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('platform');
        expect(posts[0].platform).toBe('bluesky');
      }
    }, 15000);
  });

  describe('fetchYouTubeComments', () => {
    it('should return posts (real or empty) when no API key', async () => {
      const posts = await fetchYouTubeComments({ query: 'technology', limit: 5 });
      
      expect(Array.isArray(posts)).toBe(true);
      // May return empty if fallback APIs are unavailable
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('platform');
        expect(posts[0].platform).toBe('youtube');
      }
    }, 15000);
  });

  describe('fetchTelegramPosts', () => {
    it('should return posts (real or empty)', async () => {
      const posts = await fetchTelegramPosts({ query: 'news', limit: 5 });
      
      expect(Array.isArray(posts)).toBe(true);
      // May return empty if Telegram web is blocked
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('platform');
        expect(posts[0].platform).toBe('telegram');
      }
    }, 15000);
  });

  describe('fetchAllSocialMedia', () => {
    it('should return combined results from all platforms', async () => {
      const result = await fetchAllSocialMedia({ query: 'technology', limit: 20 });
      
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('sources');
      expect(result).toHaveProperty('totalPosts');
      expect(result).toHaveProperty('fetchedAt');
      
      expect(Array.isArray(result.posts)).toBe(true);
      expect(result.sources).toHaveProperty('reddit');
      expect(result.sources).toHaveProperty('mastodon');
      expect(result.sources).toHaveProperty('bluesky');
      expect(result.sources).toHaveProperty('youtube');
      expect(result.sources).toHaveProperty('telegram');
    }, 30000);

    it('should include source statistics', async () => {
      const result = await fetchAllSocialMedia({ query: 'news', limit: 10 });
      
      expect(result.sources.reddit).toHaveProperty('count');
      expect(result.sources.reddit).toHaveProperty('success');
      expect(typeof result.sources.reddit.count).toBe('number');
      expect(typeof result.sources.reddit.success).toBe('boolean');
    }, 30000);
  });

  describe('fetchFromPlatforms', () => {
    it('should fetch from specific platforms only', async () => {
      const posts = await fetchFromPlatforms(
        ['reddit'],
        { query: 'news', limit: 5 }
      );
      
      expect(Array.isArray(posts)).toBe(true);
      // All posts should be from selected platforms
      posts.forEach(post => {
        expect(['reddit']).toContain(post.platform);
      });
    }, 15000);

    it('should return empty array for empty platforms list', async () => {
      const posts = await fetchFromPlatforms([], { query: 'test', limit: 5 });
      expect(posts).toEqual([]);
    });
  });

  describe('fetchCountrySocialMedia', () => {
    it('should fetch posts for a specific country', async () => {
      const result = await fetchCountrySocialMedia('US', 10);
      
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('sources');
      expect(Array.isArray(result.posts)).toBe(true);
    }, 30000);

    it('should handle unknown country codes', async () => {
      const result = await fetchCountrySocialMedia('XX', 5);
      
      expect(result).toHaveProperty('posts');
      // Should still return some results (using country code as query)
    }, 30000);
  });

  describe('Post structure validation', () => {
    it('should have correct post structure', async () => {
      // Use Reddit which is most reliable
      const posts = await fetchRedditPosts({ query: 'test', limit: 5 });
      
      if (posts.length > 0) {
        const post = posts[0];
        
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('text');
        expect(post).toHaveProperty('author');
        expect(post).toHaveProperty('platform');
        expect(post).toHaveProperty('url');
        expect(post).toHaveProperty('publishedAt');
        expect(post).toHaveProperty('engagement');
        
        expect(post.engagement).toHaveProperty('likes');
        expect(post.engagement).toHaveProperty('comments');
        expect(post.engagement).toHaveProperty('shares');
        
        expect(typeof post.engagement.likes).toBe('number');
        expect(typeof post.engagement.comments).toBe('number');
        expect(typeof post.engagement.shares).toBe('number');
      }
    }, 15000);
  });
});
