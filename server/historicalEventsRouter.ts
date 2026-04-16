/**
 * Historical Events Router
 * 
 * Provides API endpoints for accessing 231 historical events
 * with search, filter, and detailed impacts data
 */
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { historicalEvents } from "./historicalEventsData";

// Type for a single event from the array
type HistoricalEvent = (typeof historicalEvents)[number];

// Get unique categories and countries from the data
function getUniqueCategories(): string[] {
  const cats = new Set<string>();
  for (const e of historicalEvents) {
    if (e && e.eventCategory) cats.add(e.eventCategory);
  }
  return Array.from(cats).sort();
}

function getUniqueCountries(): string[] {
  const countries = new Set<string>();
  for (const e of historicalEvents) {
    if (e && e.country) countries.add(e.country);
  }
  return Array.from(countries).sort();
}

// Safe accessor helpers
function safeGMI(e: HistoricalEvent): number {
  return e?.estimatedGMI ?? 0;
}
function safeCFI(e: HistoricalEvent): number {
  return e?.estimatedCFI ?? 0;
}
function safeHRI(e: HistoricalEvent): number {
  return e?.estimatedHRI ?? 0;
}
function safeName(e: HistoricalEvent): string {
  return e?.eventName ?? '';
}
function safeDate(e: HistoricalEvent): string {
  return e?.eventDate ?? '1900-01-01';
}
function safeCategory(e: HistoricalEvent): string {
  return e?.eventCategory ?? '';
}
function safeCountry(e: HistoricalEvent): string {
  return e?.country ?? '';
}
function safeDescription(e: HistoricalEvent): string {
  return e?.eventDescription ?? '';
}

export const historicalEventsRouter = router({
  /**
   * Get all historical events with optional pagination
   */
  getAll: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      sortBy: z.enum(['date', 'gmi', 'cfi', 'hri', 'name']).default('date'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }).optional())
    .query(({ input }) => {
      const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = input || {};
      
      const validEvents = historicalEvents.filter((e): e is NonNullable<typeof e> => e != null);
      const sorted = [...validEvents];
      
      sorted.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'date':
            comparison = new Date(safeDate(a)).getTime() - new Date(safeDate(b)).getTime();
            break;
          case 'gmi':
            comparison = safeGMI(a) - safeGMI(b);
            break;
          case 'cfi':
            comparison = safeCFI(a) - safeCFI(b);
            break;
          case 'hri':
            comparison = safeHRI(a) - safeHRI(b);
            break;
          case 'name':
            comparison = safeName(a).localeCompare(safeName(b));
            break;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      const total = sorted.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const events = sorted.slice(start, end);
      
      return {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: end < total,
        },
      };
    }),

  /**
   * Get a single event by name
   */
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      const event = historicalEvents.find(
        e => e != null && safeName(e).toLowerCase() === input.name.toLowerCase()
      );
      if (!event) {
        return { event: null as HistoricalEvent | null, found: false };
      }
      return { event, found: true };
    }),

  /**
   * Search events by keyword
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      category: z.string().optional(),
      country: z.string().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      gmiMin: z.number().optional(),
      gmiMax: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(({ input }) => {
      const queryLower = input.query.toLowerCase();
      
      const filtered = historicalEvents.filter(e => {
        if (!e) return false;
        
        const matchesQuery = 
          safeName(e).toLowerCase().includes(queryLower) ||
          safeDescription(e).toLowerCase().includes(queryLower) ||
          safeCountry(e).toLowerCase().includes(queryLower) ||
          (e.impacts?.political?.toLowerCase().includes(queryLower)) ||
          (e.impacts?.economic?.toLowerCase().includes(queryLower)) ||
          (e.impacts?.social?.toLowerCase().includes(queryLower));
        
        if (!matchesQuery) return false;
        
        if (input.category && safeCategory(e) !== input.category) return false;
        if (input.country && safeCountry(e) !== input.country) return false;
        if (input.dateFrom && new Date(safeDate(e)) < new Date(input.dateFrom)) return false;
        if (input.dateTo && new Date(safeDate(e)) > new Date(input.dateTo)) return false;
        if (input.gmiMin !== undefined && safeGMI(e) < input.gmiMin) return false;
        if (input.gmiMax !== undefined && safeGMI(e) > input.gmiMax) return false;
        
        return true;
      });
      
      // Sort by relevance
      const sortedFiltered = [...filtered].sort((a, b) => {
        if (!a || !b) return 0;
        const aExact = safeName(a).toLowerCase().includes(queryLower) ? 1 : 0;
        const bExact = safeName(b).toLowerCase().includes(queryLower) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return new Date(safeDate(b)).getTime() - new Date(safeDate(a)).getTime();
      });
      
      return {
        results: sortedFiltered.slice(0, input.limit),
        total: sortedFiltered.length,
      };
    }),

  /**
   * Get events by category
   */
  getByCategory: publicProcedure
    .input(z.object({
      category: z.string(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(({ input }) => {
      const events = historicalEvents
        .filter(e => e != null && safeCategory(e) === input.category)
        .sort((a, b) => new Date(safeDate(b!)).getTime() - new Date(safeDate(a!)).getTime())
        .slice(0, input.limit);
      
      return { events, total: events.length };
    }),

  /**
   * Get events by country
   */
  getByCountry: publicProcedure
    .input(z.object({
      country: z.string(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(({ input }) => {
      const countryLower = input.country.toLowerCase();
      const events = historicalEvents
        .filter(e => e != null && safeCountry(e).toLowerCase().includes(countryLower))
        .sort((a, b) => new Date(safeDate(b!)).getTime() - new Date(safeDate(a!)).getTime())
        .slice(0, input.limit);
      
      return { events, total: events.length };
    }),

  /**
   * Get events by date range
   */
  getByDateRange: publicProcedure
    .input(z.object({
      from: z.string(),
      to: z.string(),
      category: z.string().optional(),
    }))
    .query(({ input }) => {
      const fromDate = new Date(input.from);
      const toDate = new Date(input.to);
      
      const events = historicalEvents
        .filter(e => {
          if (!e) return false;
          const eventDate = new Date(safeDate(e));
          const inRange = eventDate >= fromDate && eventDate <= toDate;
          if (!inRange) return false;
          if (input.category && safeCategory(e) !== input.category) return false;
          return true;
        })
        .sort((a, b) => new Date(safeDate(a!)).getTime() - new Date(safeDate(b!)).getTime());
      
      return { events, total: events.length };
    }),

  /**
   * Get available filters (categories and countries)
   */
  getFilters: publicProcedure.query(() => {
    const dates = historicalEvents
      .filter(e => e != null)
      .map(e => safeDate(e!))
      .sort();
    
    return {
      categories: getUniqueCategories(),
      countries: getUniqueCountries(),
      totalEvents: historicalEvents.length,
      dateRange: {
        earliest: dates[0] || '1900-01-01',
        latest: dates[dates.length - 1] || '2024-12-31',
      },
    };
  }),

  /**
   * Get statistics about the historical events
   */
  getStats: publicProcedure.query(() => {
    const validEvents = historicalEvents.filter((e): e is NonNullable<typeof e> => e != null);
    const total = validEvents.length;
    
    // Category distribution
    const categoryDist: Record<string, number> = {};
    validEvents.forEach(e => {
      const cat = safeCategory(e);
      categoryDist[cat] = (categoryDist[cat] || 0) + 1;
    });
    
    // Country distribution
    const countryDist: Record<string, number> = {};
    validEvents.forEach(e => {
      const country = safeCountry(e);
      countryDist[country] = (countryDist[country] || 0) + 1;
    });
    
    // Decade distribution
    const decadeDist: Record<string, number> = {};
    validEvents.forEach(e => {
      const year = new Date(safeDate(e)).getFullYear();
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeDist[decade] = (decadeDist[decade] || 0) + 1;
    });
    
    // Average indices
    const avgGMI = total > 0 ? Math.round(validEvents.reduce((s, e) => s + safeGMI(e), 0) / total) : 0;
    const avgCFI = total > 0 ? Math.round(validEvents.reduce((s, e) => s + safeCFI(e), 0) / total) : 0;
    const avgHRI = total > 0 ? Math.round(validEvents.reduce((s, e) => s + safeHRI(e), 0) / total) : 0;
    
    // Most impactful events (highest CFI)
    const mostImpactful = [...validEvents]
      .sort((a, b) => safeCFI(b) - safeCFI(a))
      .slice(0, 10)
      .map(e => ({ name: safeName(e), date: safeDate(e), cfi: safeCFI(e), country: safeCountry(e) }));
    
    // Most hopeful events (highest HRI)
    const mostHopeful = [...validEvents]
      .sort((a, b) => safeHRI(b) - safeHRI(a))
      .slice(0, 10)
      .map(e => ({ name: safeName(e), date: safeDate(e), hri: safeHRI(e), country: safeCountry(e) }));
    
    return {
      total,
      categoryDistribution: categoryDist,
      countryDistribution: countryDist,
      decadeDistribution: decadeDist,
      averageIndices: { gmi: avgGMI, cfi: avgCFI, hri: avgHRI },
      mostImpactful,
      mostHopeful,
    };
  }),

  /**
   * Find similar events based on indices
   */
  findSimilar: publicProcedure
    .input(z.object({
      eventName: z.string(),
      limit: z.number().min(1).max(20).default(5),
    }))
    .query(({ input }) => {
      const targetEvent = historicalEvents.find(
        e => e != null && safeName(e).toLowerCase() === input.eventName.toLowerCase()
      );
      
      if (!targetEvent) {
        return { similar: [] as Array<{ event: HistoricalEvent; similarity: number }>, found: false, targetEvent: null as HistoricalEvent | null };
      }
      
      const validEvents = historicalEvents.filter((e): e is NonNullable<typeof e> => e != null);
      
      const similarities = validEvents
        .filter(e => safeName(e) !== safeName(targetEvent))
        .map(e => {
          const gmiDiff = Math.abs(safeGMI(e) - safeGMI(targetEvent));
          const cfiDiff = Math.abs(safeCFI(e) - safeCFI(targetEvent));
          const hriDiff = Math.abs(safeHRI(e) - safeHRI(targetEvent));
          
          // Emotional vector similarity
          const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'] as const;
          let emotionDiff = 0;
          for (const em of emotions) {
            const eVal = e.emotionalVector?.[em] ?? 0;
            const tVal = targetEvent.emotionalVector?.[em] ?? 0;
            emotionDiff += Math.abs(eVal - tVal);
          }
          
          const similarity = Math.max(0, 100 - (gmiDiff + cfiDiff + hriDiff + emotionDiff / 6) / 4);
          
          return {
            event: e,
            similarity: Math.round(similarity),
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, input.limit);
      
      return { similar: similarities, found: true, targetEvent };
    }),

  /**
   * Get timeline data for visualization
   */
  getTimeline: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      country: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      let events = historicalEvents.filter((e): e is NonNullable<typeof e> => e != null);
      
      if (input?.category) {
        events = events.filter(e => safeCategory(e) === input.category);
      }
      if (input?.country) {
        events = events.filter(e => safeCountry(e).toLowerCase().includes(input.country!.toLowerCase()));
      }
      
      // Sort by date
      events.sort((a, b) => new Date(safeDate(a)).getTime() - new Date(safeDate(b)).getTime());
      
      return {
        timeline: events.map(e => ({
          name: safeName(e),
          date: safeDate(e),
          category: safeCategory(e),
          country: safeCountry(e),
          gmi: safeGMI(e),
          cfi: safeCFI(e),
          hri: safeHRI(e),
          impacts: e.impacts,
        })),
        total: events.length,
      };
    }),
});
