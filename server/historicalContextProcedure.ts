/**
 * Historical Context tRPC Procedure
 * 
 * Exposes historical analysis capabilities via tRPC
 */

import { z } from 'zod';
import { analyzeWithHistoricalContext, formatHistoricalAnalysis } from './historicalContextEngine';
import { discoverAllPatterns, generatePatternSummary } from './patternDiscoverySystem';
import { getSampleHistoricalEvents, getEventsByCountry, getEventsByCategory } from './historicalEventsData';

/**
 * Input validation schema
 */
export const HistoricalAnalysisInputSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  country: z.string().min(1, 'Country is required'),
  gmi: z.number().min(0).max(100, 'GMI must be 0-100'),
  cfi: z.number().min(0).max(100, 'CFI must be 0-100'),
  hri: z.number().min(0).max(100, 'HRI must be 0-100'),
  emotionalVector: z.record(z.string(), z.number()).optional(),
  description: z.string().optional(),
});

export type HistoricalAnalysisInput = z.infer<typeof HistoricalAnalysisInputSchema>;

/**
 * Create historical analysis procedure
 */
export function createHistoricalAnalysisProcedure() {
  return {
    /**
     * Analyze current event with historical context
     */
    analyzeWithHistory: async (input: HistoricalAnalysisInput) => {
      // Validate input
      const validated = HistoricalAnalysisInputSchema.parse(input);

      // Get historical events for the country
      const historicalEvents = getEventsByCountry(validated.country).map(e => ({
        id: e.eventName,
        eventName: e.eventName,
        eventDate: new Date(e.eventDate),
        country: e.country,
        estimatedGMI: e.estimatedGMI,
        estimatedCFI: e.estimatedCFI,
        estimatedHRI: e.estimatedHRI,
        emotionalVector: e.emotionalVector,
        gdpImpact: e.gdpImpact,
        shortTermOutcome: e.shortTermOutcome,
        mediumTermOutcome: e.mediumTermOutcome,
        longTermOutcome: e.longTermOutcome,
      }));

      // Create current event object
      const currentEvent = {
        topic: validated.topic,
        country: validated.country,
        gmi: validated.gmi,
        cfi: validated.cfi,
        hri: validated.hri,
        emotionalVector: (validated.emotionalVector as Record<string, number>) || {
          joy: validated.gmi * 0.5,
          fear: validated.cfi * 0.5,
          anger: validated.cfi * 0.3,
          sadness: (100 - validated.hri) * 0.3,
          hope: validated.hri * 0.5,
          curiosity: 50,
        },
        description: validated.description || '',
        timestamp: Date.now(),
      };

      // Analyze with historical context
      const analysis = analyzeWithHistoricalContext(currentEvent, historicalEvents);

      return {
        success: true,
        analysis: {
          similarEvents: analysis.similarEvents.slice(0, 5).map(e => ({
            eventName: e.historicalEventName,
            eventDate: e.historicalEventDate.toISOString(),
            similarity: Math.round(e.similarity),
            predictedOutcome: e.predictedOutcome,
            timeToOutcome: e.timeToOutcome,
          })),
          insights: analysis.insights.map(i => ({
            text: i.insight,
            confidence: Math.round(i.confidence),
            riskLevel: i.riskLevel,
          })),
          predictions: {
            shortTerm: analysis.predictions.shortTerm,
            mediumTerm: analysis.predictions.mediumTerm,
            longTerm: analysis.predictions.longTerm,
            confidence: Math.round(analysis.predictions.confidence),
          },
          overallConfidence: Math.round(analysis.confidence),
        },
      };
    },

    /**
     * Discover patterns in historical events
     */
    discoverPatterns: async (input: { country: string; category?: string }) => {
      // Get historical events
      let events = getEventsByCountry(input.country);
      if (input.category) {
        events = events.filter(e => e.eventCategory === input.category);
      }

      // Convert to proper format
      const formattedEvents = events.map(e => ({
        id: e.eventName,
        eventName: e.eventName,
        eventDate: new Date(e.eventDate),
        country: e.country,
        eventCategory: e.eventCategory,
        estimatedGMI: e.estimatedGMI,
        estimatedCFI: e.estimatedCFI,
        estimatedHRI: e.estimatedHRI,
        gdpImpact: e.gdpImpact,
        shortTermOutcome: e.shortTermOutcome,
        mediumTermOutcome: e.mediumTermOutcome,
        longTermOutcome: e.longTermOutcome,
      }));

      // Discover patterns
      const patterns = discoverAllPatterns(formattedEvents);

      return {
        success: true,
        patterns: patterns.slice(0, 10).map(p => ({
          patternName: p.patternName,
          patternType: p.patternType,
          frequency: p.frequency,
          confidence: Math.round(p.confidence),
          averageInterval: p.averageInterval,
          typicalOutcomes: p.typicalOutcomes.slice(0, 2),
          affectedRegions: p.affectedRegions,
        })),
        summary: generatePatternSummary(patterns),
      };
    },

    /**
     * Get historical events for a country
     */
    getHistoricalEvents: async (input: { country: string; limit?: number }) => {
      const events = getEventsByCountry(input.country);
      const limit = input.limit || 10;

      return {
        success: true,
        events: events.slice(0, limit).map(e => ({
          eventName: e.eventName,
          eventDate: e.eventDate,
          eventCategory: e.eventCategory,
          description: e.eventDescription,
          gmi: e.estimatedGMI,
          cfi: e.estimatedCFI,
          hri: e.estimatedHRI,
          gdpImpact: e.gdpImpact,
          outcome: e.mediumTermOutcome,
        })),
        total: events.length,
      };
    },

    /**
     * Compare two time periods
     */
    compareTimePeriods: async (input: {
      country: string;
      startDate1: string;
      endDate1: string;
      startDate2: string;
      endDate2: string;
    }) => {
      const allEvents = getSampleHistoricalEvents();

      const period1Events = allEvents.filter(
        e => e.country === input.country && e.eventDate >= input.startDate1 && e.eventDate <= input.endDate1
      );

      const period2Events = allEvents.filter(
        e => e.country === input.country && e.eventDate >= input.startDate2 && e.eventDate <= input.endDate2
      );

      const avgGMI1 = period1Events.reduce((sum, e) => sum + e.estimatedGMI, 0) / (period1Events.length || 1);
      const avgCFI1 = period1Events.reduce((sum, e) => sum + e.estimatedCFI, 0) / (period1Events.length || 1);
      const avgHRI1 = period1Events.reduce((sum, e) => sum + e.estimatedHRI, 0) / (period1Events.length || 1);

      const avgGMI2 = period2Events.reduce((sum, e) => sum + e.estimatedGMI, 0) / (period2Events.length || 1);
      const avgCFI2 = period2Events.reduce((sum, e) => sum + e.estimatedCFI, 0) / (period2Events.length || 1);
      const avgHRI2 = period2Events.reduce((sum, e) => sum + e.estimatedHRI, 0) / (period2Events.length || 1);

      return {
        success: true,
        period1: {
          dateRange: `${input.startDate1} to ${input.endDate1}`,
          eventCount: period1Events.length,
          averageGMI: Math.round(avgGMI1),
          averageCFI: Math.round(avgCFI1),
          averageHRI: Math.round(avgHRI1),
        },
        period2: {
          dateRange: `${input.startDate2} to ${input.endDate2}`,
          eventCount: period2Events.length,
          averageGMI: Math.round(avgGMI2),
          averageCFI: Math.round(avgCFI2),
          averageHRI: Math.round(avgHRI2),
        },
        changes: {
          gmiChange: Math.round(avgGMI2 - avgGMI1),
          cfiChange: Math.round(avgCFI2 - avgCFI1),
          hriChange: Math.round(avgHRI2 - avgHRI1),
          trend: avgGMI2 > avgGMI1 ? 'improving' : avgGMI2 < avgGMI1 ? 'declining' : 'stable',
        },
      };
    },
  };
}

/**
 * Export types
 */
export type HistoricalContextProcedures = ReturnType<typeof createHistoricalAnalysisProcedure>;
