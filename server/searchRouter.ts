/**
 * Search Router - Unified Search Across All Real Data Sources
 * Integrates: NewsAPI, GNews, Reddit, Mastodon, Bluesky, YouTube, Telegram
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { fetchNewsArticles, fetchTrendingTopics } from "./newsDataFetcher";
import { fetchGNewsHeadlines, searchGNews } from "./gnewsService";
import {
  fetchAllSocialMedia,
  fetchFromPlatforms,
} from "./socialMediaService";
import { analyzeTextsWithAI } from "./aiSentimentAnalyzer";
import { analyzeHybrid } from "./hybridAnalyzer";

export const searchRouter = router({
  /**
   * Unified search across all sources (News + Social Media) with emotion analysis
   */
  searchTopics: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        region: z.string().default("global"),
        timeRange: z.enum(["1h", "6h", "24h", "7d", "30d"]).default("24h"),
        emotionType: z.string().default("all"),
        source: z.string().default("all"),
        sortBy: z.enum(["relevance", "recent", "trending"]).default("relevance"),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log(`[Search] Starting unified search for: "${input.query}"`);

        // Parallel fetch from all sources
        const [newsResults, gNewsResults, socialResults] = await Promise.all([
          fetchNewsArticles({
            query: input.query,
            country: input.region !== "global" ? input.region : undefined,
            language: "ar",
            limit: Math.ceil(input.limit / 3),
          }).catch((e) => { console.error("[Search] NewsAPI error:", e); return []; }),

          input.query
            ? searchGNews({
                query: input.query,
                country: input.region !== "global" ? input.region : undefined,
                language: "ar",
                max: Math.ceil(input.limit / 3),
              }).catch((e) => { console.error("[Search] GNews error:", e); return []; })
            : fetchGNewsHeadlines({
                country: input.region !== "global" ? input.region : undefined,
                language: "ar",
                max: Math.ceil(input.limit / 3),
              }).catch((e) => { console.error("[Search] GNews headlines error:", e); return []; }),

          fetchAllSocialMedia({
            query: input.query,
            limit: Math.ceil(input.limit / 3),
            language: "ar",
            country: input.region !== "global" ? input.region : undefined,
          }).catch((e) => {
            console.error("[Search] Social media error:", e);
            return {
              posts: [] as any[],
              sources: {
                reddit: { count: 0, success: false, isReal: false },
                mastodon: { count: 0, success: false, isReal: false },
                bluesky: { count: 0, success: false, isReal: false },
                youtube: { count: 0, success: false, isReal: false },
                telegram: { count: 0, success: false, isReal: false },
                twitter: { count: 0, success: false, isReal: false },
              },
              totalPosts: 0,
              realPosts: 0,
              fetchedAt: new Date(),
            };
          }),
        ]);

        console.log(
          `[Search] Fetched ${newsResults.length} news + ${gNewsResults.length} gnews + ${socialResults.posts.length} social posts`
        );

        // Combine all results into unified format
        const allResults: any[] = [
          ...newsResults.map((article: any, i: number) => ({
            id: `news-${i}`,
            title: article.title,
            description: article.description || "",
            content: article.content || "",
            source: article.source,
            platform: "news",
            url: article.url,
            publishedAt: new Date(article.publishedAt),
            isReal: true,
          })),
          ...gNewsResults.map((article: any, i: number) => ({
            id: `gnews-${i}`,
            title: article.title,
            description: article.description || "",
            content: article.content || "",
            source: article.source,
            platform: "gnews",
            url: article.url,
            publishedAt: new Date(article.publishedAt),
            isReal: true,
          })),
          ...socialResults.posts.map((post: any, i: number) => ({
            id: `social-${i}`,
            title: post.text?.slice(0, 100) || "",
            description: post.text || "",
            content: post.text || "",
            source: post.author || post.platform,
            platform: post.platform,
            url: post.url,
            publishedAt: new Date(post.publishedAt),
            engagement: post.engagement,
            isReal: post.isReal !== false,
          })),
        ];

        // Analyze emotions using AI
        const textsToAnalyze = allResults
          .map((r) => r.title || r.description)
          .filter(Boolean)
          .slice(0, 30);

        const aiAnalysis = await analyzeTextsWithAI(textsToAnalyze).catch(() => ({
          results: [],
          aggregated: { gmi: 50, cfi: 50, hri: 50, dominantEmotion: "neutral", confidence: 0.5 },
        }));

        // Attach emotion to each result
        const resultsWithEmotion = allResults.map((result, index) => {
          const aiResult = (aiAnalysis.results || [])[index];
          return {
            ...result,
            emotion: {
              dominant: aiResult?.dominantEmotion || "neutral",
              confidence: aiResult?.confidence || 0.5,
              sentiment: aiResult?.sentiment || "neutral",
              gmi: aiResult?.gmi || 50,
              cfi: aiResult?.cfi || 50,
              hri: aiResult?.hri || 50,
            },
          };
        });

        // Sort results
        let sortedResults = resultsWithEmotion;
        if (input.sortBy === "recent") {
          sortedResults = sortedResults.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        } else if (input.sortBy === "trending") {
          sortedResults = sortedResults.sort(
            (a, b) =>
              ((b.engagement?.likes || 0) + (b.engagement?.comments || 0)) -
              ((a.engagement?.likes || 0) + (a.engagement?.comments || 0))
          );
        }

        const finalResults = sortedResults.slice(0, input.limit);

        // Count by platform
        const platformCounts = finalResults.reduce(
          (acc, result) => {
            const existing = acc.find((p: any) => p.platform === result.platform);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: result.platform.toUpperCase(), count: 1, platform: result.platform });
            }
            return acc;
          },
          [] as { name: string; count: number; platform: string }[]
        );

        // Get trending topics
        const trends = await fetchTrendingTopics(
          input.region !== "global" ? input.region : "us"
        ).catch(() => []);

        const agg = aiAnalysis.aggregated as any;

        return {
          query: input.query,
          totalResults: finalResults.length,
          results: finalResults,
          aggregatedEmotion: {
            dominant: agg?.dominantEmotion || "neutral",
            intensity: Math.round(((agg?.gmi || 50) + (agg?.cfi || 50) + (agg?.hri || 50)) / 3),
            distribution: {
              gmi: agg?.gmi || 50,
              cfi: agg?.cfi || 50,
              hri: agg?.hri || 50,
            },
          },
          sources: platformCounts,
          socialMediaSources: socialResults.sources,
          trends: trends.slice(0, 5),
          confidence: (agg?.confidence || 0.5) * 100,
          analyzedAt: new Date(),
        };
      } catch (error) {
        console.error("[Search] Error:", error);
        throw error;
      }
    }),

  /**
   * Search suggestions based on trending topics
   */
  getSuggestions: publicProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ input }) => {
      try {
        const trends = await fetchTrendingTopics("us").catch(() => []);
        return {
          suggestions: trends
            .filter((t) => t.toLowerCase().includes(input.query.toLowerCase()))
            .slice(0, 5),
          query: input.query,
        };
      } catch {
        return { suggestions: [], query: input.query };
      }
    }),

  /**
   * Search specific platforms only
   */
  searchPlatforms: publicProcedure
    .input(
      z.object({
        platforms: z.array(z.enum(["reddit", "mastodon", "bluesky", "youtube"])),
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(50).default(25),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const platformResults = await fetchFromPlatforms(input.platforms, {
          query: input.query,
          limit: input.limit,
        }).catch(() => []);

        const texts = platformResults.map((p: any) => p.text).filter(Boolean).slice(0, 20);
        const analysis = await analyzeTextsWithAI(texts).catch(() => ({ results: [], aggregated: {} }));

        return {
          query: input.query,
          platforms: input.platforms,
          results: platformResults,
          analysis: analysis.results || [],
          totalResults: platformResults.length,
        };
      } catch (error) {
        console.error("[Search] Platform search error:", error);
        throw error;
      }
    }),

  /**
   * Search news only
   */
  searchNews: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        region: z.string().default("global"),
        limit: z.number().min(1).max(50).default(25),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [newsResults, gNewsResults] = await Promise.all([
          fetchNewsArticles({
            query: input.query,
            country: input.region !== "global" ? input.region : undefined,
            language: "ar",
            limit: Math.ceil(input.limit / 2),
          }).catch(() => []),
          searchGNews({
            query: input.query,
            country: input.region !== "global" ? input.region : undefined,
            language: "ar",
            max: Math.ceil(input.limit / 2),
          }).catch(() => []),
        ]);

        const allResults = [...newsResults, ...gNewsResults];
        const texts = allResults.map((a: any) => a.title).filter(Boolean).slice(0, 20);
        const analysis = await analyzeTextsWithAI(texts).catch(() => ({ results: [], aggregated: {} }));

        return {
          query: input.query,
          results: allResults.slice(0, input.limit),
          analysis: analysis.results || [],
          totalResults: allResults.length,
        };
      } catch (error) {
        console.error("[Search] News search error:", error);
        throw error;
      }
    }),

  /**
   * Get trending topics by region
   */
  getTrends: publicProcedure
    .input(z.object({ region: z.string().default("us") }))
    .query(async ({ input }) => {
      try {
        const trends = await fetchTrendingTopics(input.region).catch(() => []);
        return { region: input.region, trends: trends.slice(0, 10), count: trends.length };
      } catch {
        return { region: input.region, trends: [], count: 0 };
      }
    }),
});
