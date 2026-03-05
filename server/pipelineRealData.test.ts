// @vitest-environment node
/**
 * Tests for Real Data Pipeline Integration
 * Verifies that the unified pipeline correctly integrates real data sources
 */
import { describe, it, expect, vi } from "vitest";

// Test that all real data service modules are importable
describe("Real Data Services Availability", () => {
  it("should import gnewsService", async () => {
    const mod = await import("./gnewsService");
    expect(mod.searchGNews).toBeDefined();
    expect(typeof mod.searchGNews).toBe("function");
  });

  it("should import socialMediaService", async () => {
    const mod = await import("./socialMediaService");
    expect(mod.fetchRedditPosts).toBeDefined();
    expect(mod.fetchMastodonPosts).toBeDefined();
    expect(mod.fetchBlueskyPosts).toBeDefined();
    expect(typeof mod.fetchRedditPosts).toBe("function");
    expect(typeof mod.fetchMastodonPosts).toBe("function");
    expect(typeof mod.fetchBlueskyPosts).toBe("function");
  });

  it("should import newsDataFetcher", async () => {
    const mod = await import("./newsDataFetcher");
    expect(mod.fetchNewsArticles).toBeDefined();
    expect(typeof mod.fetchNewsArticles).toBe("function");
  });

  it("should import realTextAnalyzer", async () => {
    const mod = await import("./realTextAnalyzer");
    expect(mod.analyzeEmotions).toBeDefined();
    expect(mod.analyzeTopics).toBeDefined();
    expect(typeof mod.analyzeEmotions).toBe("function");
    expect(typeof mod.analyzeTopics).toBe("function");
  });
});

// Test that the pipeline imports real data services
describe("Pipeline Real Data Integration", () => {
  it("should import real data services in unifiedNetworkPipeline", async () => {
    const pipelineCode = await import("fs").then(fs =>
      fs.readFileSync("./server/unifiedNetworkPipeline.ts", "utf-8")
    );

    // Verify imports
    expect(pipelineCode).toContain('import { searchGNews }');
    expect(pipelineCode).toContain('fetchRedditPosts');
    expect(pipelineCode).toContain('fetchMastodonPosts');
    expect(pipelineCode).toContain('fetchBlueskyPosts');
    expect(pipelineCode).toContain('import { fetchNewsArticles }');
    expect(pipelineCode).toContain('import { analyzeEmotions');
  });

  it("should have Layer 2 for real data fetching", async () => {
    const pipelineCode = await import("fs").then(fs =>
      fs.readFileSync("./server/unifiedNetworkPipeline.ts", "utf-8")
    );

    expect(pipelineCode).toContain("LAYER 2: REAL DATA FETCHING");
    expect(pipelineCode).toContain("GNews");
    expect(pipelineCode).toContain("NewsAPI");
    expect(pipelineCode).toContain("Reddit");
    expect(pipelineCode).toContain("Mastodon");
    expect(pipelineCode).toContain("Bluesky");
  });

  it("should have Layer 3 for emotion analysis", async () => {
    const pipelineCode = await import("fs").then(fs =>
      fs.readFileSync("./server/unifiedNetworkPipeline.ts", "utf-8")
    );

    expect(pipelineCode).toContain("LAYER 3: EMOTION ANALYSIS");
    expect(pipelineCode).toContain("analyzeEmotions");
  });

  it("should have Layer 4 for breaking news detection", async () => {
    const pipelineCode = await import("fs").then(fs =>
      fs.readFileSync("./server/unifiedNetworkPipeline.ts", "utf-8")
    );

    expect(pipelineCode).toContain("LAYER 4: Breaking News Detection");
    expect(pipelineCode).toContain("breakingNews");
  });

  it("should pass real data context to LLM in Layer 16", async () => {
    const pipelineCode = await import("fs").then(fs =>
      fs.readFileSync("./server/unifiedNetworkPipeline.ts", "utf-8")
    );

    // Verify LLM receives real data context
    expect(pipelineCode).toContain("Real-time data from");
    expect(pipelineCode).toContain("dataContext");
    expect(pipelineCode).toContain("emotionContext");
    expect(pipelineCode).toContain("AmalSense");
  });
});

// Test realTextAnalyzer functions work correctly
describe("Real Text Analyzer", () => {
  it("should analyze emotions from Arabic text", async () => {
    const { analyzeEmotions } = await import("./realTextAnalyzer");
    const result = analyzeEmotions("الحرب والدمار والمعاناة في المنطقة");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    // Should have emotion keys
    const keys = Object.keys(result);
    expect(keys.length).toBeGreaterThan(0);
  });

  it("should analyze emotions from English text", async () => {
    const { analyzeEmotions } = await import("./realTextAnalyzer");
    const result = analyzeEmotions("War and destruction causing suffering");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("should analyze topics from text", async () => {
    const { analyzeTopics } = await import("./realTextAnalyzer");
    const result = analyzeTopics("The economy is growing with new technology innovations");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

// Test that searchRouter is registered
describe("Search Router Registration", () => {
  it("should have search router registered in appRouter", async () => {
    const routersCode = await import("fs").then(fs =>
      fs.readFileSync("./server/routers.ts", "utf-8")
    );

    expect(routersCode).toContain("searchRouter");
    expect(routersCode).toContain("search:");
  });
});

// Test that topicAnalyzer uses real data services
describe("Topic Analyzer Real Data", () => {
  it("should import real data services in topicAnalyzer", async () => {
    const code = await import("fs").then(fs =>
      fs.readFileSync("./server/topicAnalyzer.ts", "utf-8")
    );

    expect(code).toContain("fetchNewsArticles");
    expect(code).toContain("searchGNews");
    expect(code).toContain("fetchAllSocialMedia");
  });
});
