/**
 * Search Router — Unified Search via Data Collector
 *
 * All data fetching now delegates to unifiedDataCollector.ts instead of
 * calling gnewsService / newsService directly. This ensures every source
 * (GDELT, NewsAPI, Major RSS, Google RSS, Reddit) is available in searches.
 */

import { publicProcedure, router } from '../_core/trpc';
import { z } from "zod";
import { collectTopicData } from '../services/unifiedDataCollector';
import { analyzeTextsWithAI } from '../engines/emotionEngine';

export const searchRouter = router({
  /**
   * Unified search across all sources with emotion analysis
   */
  searchTopics: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        region: z.string().default("global"),
        sortBy: z.enum(["relevance", "recent", "trending"]).default("relevance"),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log(`[Search] Starting unified search for: "${input.query}"`);

        // Use the unified data collector (6 parallel sources)
        const collected = await collectTopicData(input.query);

        const allResults = collected.items.slice(0, input.limit).map((item, i) => ({
          id: `result-${i}`,
          title: item.title,
          description: item.description.slice(0, 500),
          source: item.source,
          platform: item.platform,
          url: item.url,
          publishedAt: new Date(item.publishedAt),
          isReal: item.trustScore > 50,
        }));

        // Sort
        if (input.sortBy === "recent") {
          allResults.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        }

        // Emotion analysis on top headlines
        const texts = allResults.map((r) => r.title).filter(Boolean).slice(0, 30);
        const aiAnalysis = await analyzeTextsWithAI(texts).catch(() => ({
          results: [], aggregated: { gmi: 50, cfi: 50, hri: 50, dominantEmotion: "neutral", confidence: 0.5 },
        }));

        const agg = aiAnalysis.aggregated as any;

        return {
          query: input.query,
          totalResults: allResults.length,
          results: allResults,
          sources: collected.sources.map((s) => ({ name: s, count: collected.items.filter((i) => i.platform === s).length, platform: s })),
          aggregatedEmotion: {
            dominant: agg?.dominantEmotion || "neutral",
            intensity: Math.round(((agg?.gmi || 50) + (agg?.cfi || 50) + (agg?.hri || 50)) / 3),
            distribution: { gmi: agg?.gmi || 50, cfi: agg?.cfi || 50, hri: agg?.hri || 50 },
          },
          confidence: (agg?.confidence || 0.5) * 100,
          analyzedAt: new Date(),
        };
      } catch (error) {
        console.error("[Search] Error:", error);
        throw error;
      }
    }),
});
