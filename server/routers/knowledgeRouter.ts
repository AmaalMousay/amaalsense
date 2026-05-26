/**
 * Knowledge Router — Academic & Research Knowledge Layer
 *
 * Frontend can query:
 *   - Scientific research (PubMed, arXiv)
 *   - Books (Open Library)
 *   - Related to any topic, emotion, or event
 *
 * This turns AmalSense from "news analyzer" into "news + science analyzer"
 */

import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { searchAllKnowledge, searchArXiv, searchPubMed, searchBooks } from '../services/researchService';
import { triggerAutonomousResearch, researcherState } from '../knowledge/autonomousResearcher';

export const knowledgeRouter = router({
  /**
   * Search all knowledge sources for a topic
   */
  searchKnowledge: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      maxResults: z.number().min(1).max(50).default(15),
    }))
    .query(async ({ input }) => {
      const results = await searchAllKnowledge(input.query, input.maxResults);
      return {
        success: true,
        query: input.query,
        totalResults: results.length,
        results: results.map((r) => ({
          id: r.id,
          title: r.title,
          authors: r.authors.slice(0, 3),
          summary: r.summary.slice(0, 500),
          source: r.source,
          url: r.url,
          publishedDate: r.publishedDate,
          categories: r.categories,
        })),
        bySource: {
          arxiv: results.filter((r) => r.source === 'arXiv').length,
          pubmed: results.filter((r) => r.source === 'PubMed').length,
          books: results.filter((r) => r.source === 'OpenLibrary').length,
        },
      };
    }),

  /**
   * Search scientific papers only (arXiv + PubMed)
   */
  searchScientific: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      source: z.enum(['all', 'arxiv', 'pubmed']).default('all'),
      maxResults: z.number().min(1).max(30).default(10),
    }))
    .query(async ({ input }) => {
      let results;
      if (input.source === 'arxiv') {
        results = await searchArXiv(input.query, input.maxResults);
      } else if (input.source === 'pubmed') {
        results = await searchPubMed(input.query, input.maxResults);
      } else {
        const [arxiv, pubmed] = await Promise.all([
          searchArXiv(input.query, Math.ceil(input.maxResults / 2)),
          searchPubMed(input.query, Math.ceil(input.maxResults / 2)),
        ]);
        results = [...arxiv, ...pubmed];
      }
      return { success: true, query: input.query, results };
    }),

  /**
   * Trigger autonomous research (background knowledge gathering)
   */
  triggerResearch: publicProcedure.mutation(async () => {
    const result = await triggerAutonomousResearch();
    return { success: true, message: result, state: researcherState };
  }),

  /**
   * Get researcher status
   */
  getResearcherStatus: publicProcedure.query(() => ({
    state: researcherState,
  })),
});