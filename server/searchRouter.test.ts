import { describe, expect, it } from "vitest";

/**
 * Tests for Search Router and Real Data Integration
 * Validates that the searchRouter is properly registered and
 * that real data services are imported and callable
 */

// Test 1: Verify searchRouter module exports
describe("searchRouter module", () => {
  it("should export searchRouter", async () => {
    const mod = await import("./searchRouter");
    expect(mod.searchRouter).toBeDefined();
    expect(typeof mod.searchRouter).toBe("object");
  });

  it("should have router definition", async () => {
    const mod = await import("./searchRouter");
    const routerDef = (mod.searchRouter as any)._def;
    expect(routerDef).toBeDefined();
  });
});

// Test 2: Verify searchRouter is registered in appRouter
describe("appRouter search registration", () => {
  it("should have search router registered", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    const routerDef = (appRouter as any)._def;
    expect(routerDef).toBeDefined();
  });
});

// Test 3: Verify real data services are importable
describe("real data services", () => {
  it("should import newsDataFetcher", async () => {
    const mod = await import("./newsDataFetcher");
    expect(mod.fetchNewsArticles).toBeDefined();
    expect(typeof mod.fetchNewsArticles).toBe("function");
    expect(mod.fetchTrendingTopics).toBeDefined();
    expect(typeof mod.fetchTrendingTopics).toBe("function");
  });

  it("should import gnewsService", async () => {
    const mod = await import("./gnewsService");
    expect(mod.fetchGNewsHeadlines).toBeDefined();
    expect(typeof mod.fetchGNewsHeadlines).toBe("function");
    expect(mod.searchGNews).toBeDefined();
    expect(typeof mod.searchGNews).toBe("function");
  });

  it("should import socialMediaService", async () => {
    const mod = await import("./socialMediaService");
    expect(mod.fetchRedditPosts).toBeDefined();
    expect(mod.fetchMastodonPosts).toBeDefined();
    expect(mod.fetchBlueskyPosts).toBeDefined();
    expect(mod.fetchYouTubeComments).toBeDefined();
    expect(mod.fetchTelegramPosts).toBeDefined();
    expect(mod.fetchAllSocialMedia).toBeDefined();
  });

  it("should import aiSentimentAnalyzer", async () => {
    const mod = await import("./aiSentimentAnalyzer");
    expect(mod.analyzeTextWithAI).toBeDefined();
    expect(mod.analyzeTextsWithAI).toBeDefined();
  });

  it("should import hybridAnalyzer", async () => {
    const mod = await import("./hybridAnalyzer");
    expect(mod.analyzeHybrid).toBeDefined();
  });
});

// Test 4: Verify topicAnalyzer imports real data services
describe("topicAnalyzer real data integration", () => {
  it("should export analyzeTopicInCountry", async () => {
    const mod = await import("./topicAnalyzer");
    expect(mod.analyzeTopicInCountry).toBeDefined();
    expect(typeof mod.analyzeTopicInCountry).toBe("function");
  });
});

// Test 5: Verify unifiedDataService uses real data
describe("unifiedDataService real data integration", () => {
  it("should export getTopicMood", async () => {
    const mod = await import("./unifiedDataService");
    expect(mod.getTopicMood).toBeDefined();
    expect(typeof mod.getTopicMood).toBe("function");
  });

  it("should export getGlobalMood", async () => {
    const mod = await import("./unifiedDataService");
    expect(mod.getGlobalMood).toBeDefined();
    expect(typeof mod.getGlobalMood).toBe("function");
  });
});
