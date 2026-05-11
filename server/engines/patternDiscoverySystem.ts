/**
 * Pattern Discovery System
 * 
 * Discovers recurring patterns in historical events
 * Identifies causal relationships and cyclical trends
 */

export interface HistoricalEvent {
  id: string;
  eventName: string;
  eventDate: Date;
  country: string;
  eventCategory: string;
  estimatedGMI: number;
  estimatedCFI: number;
  estimatedHRI: number;
  gdpImpact: number;
  shortTermOutcome: string;
  mediumTermOutcome: string;
  longTermOutcome: string;
}

export interface DiscoveredPattern {
  patternId: string;
  patternName: string;
  patternType: 'cyclical' | 'causal' | 'correlative' | 'predictive' | 'anomalous';
  frequency: number; // How many times occurred
  averageInterval: number; // Days between occurrences
  confidence: number; // 0-100
  triggerEvents: string[]; // Event types that trigger this
  typicalOutcomes: string[];
  averageOutcomeTime: number; // Days until outcome
  typicalGMIChange: number;
  typicalCFIChange: number;
  typicalHRIChange: number;
  typicalGDPImpact: number;
  affectedRegions: string[];
  relatedEventIds: string[];
}

/**
 * Identify cyclical patterns
 */
export function identifyCyclicalPatterns(events: HistoricalEvent[]): DiscoveredPattern[] {
  const patterns: DiscoveredPattern[] = [];
  const eventsByCategory: Record<string, HistoricalEvent[]> = {};

  // Group events by category
  for (const event of events) {
    if (!eventsByCategory[event.eventCategory]) {
      eventsByCategory[event.eventCategory] = [];
    }
    eventsByCategory[event.eventCategory].push(event);
  }

  // Analyze each category for cycles
  for (const [category, categoryEvents] of Object.entries(eventsByCategory)) {
    if (categoryEvents.length < 3) continue;

    // Sort by date
    const sorted = [...categoryEvents].sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    // Calculate intervals between events
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const interval = Math.floor((sorted[i].eventDate.getTime() - sorted[i - 1].eventDate.getTime()) / (1000 * 60 * 60 * 24));
      intervals.push(interval);
    }

    // Check if intervals are regular (cyclical)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgInterval;

    // If CV < 0.3, it's cyclical
    if (coefficientOfVariation < 0.3 && sorted.length >= 3) {
      const avgGMIChange = sorted.reduce((sum, e) => sum + (e.estimatedGMI - 50), 0) / sorted.length;
      const avgCFIChange = sorted.reduce((sum, e) => sum + (e.estimatedCFI - 50), 0) / sorted.length;
      const avgHRIChange = sorted.reduce((sum, e) => sum + (e.estimatedHRI - 50), 0) / sorted.length;
      const avgGDPImpact = sorted.reduce((sum, e) => sum + e.gdpImpact, 0) / sorted.length;

      patterns.push({
        patternId: `pattern_cyclical_${category}_${Date.now()}`,
        patternName: `${category} Cycle`,
        patternType: 'cyclical',
        frequency: sorted.length,
        averageInterval: Math.round(avgInterval),
        confidence: Math.min(100, (1 - coefficientOfVariation) * 100),
        triggerEvents: [category],
        typicalOutcomes: sorted.map(e => e.mediumTermOutcome).filter(Boolean),
        averageOutcomeTime: 180,
        typicalGMIChange: avgGMIChange,
        typicalCFIChange: avgCFIChange,
        typicalHRIChange: avgHRIChange,
        typicalGDPImpact: avgGDPImpact,
        affectedRegions: Array.from(new Set(sorted.map(e => e.country))),
        relatedEventIds: sorted.map(e => e.id),
      });
    }
  }

  return patterns;
}

/**
 * Identify causal patterns
 */
export function identifyCausalPatterns(events: HistoricalEvent[]): DiscoveredPattern[] {
  const patterns: DiscoveredPattern[] = [];
  const sorted = [...events].sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

  // Look for events that frequently precede others
  for (let i = 0; i < sorted.length - 1; i++) {
    const triggerEvent = sorted[i];
    const followingEvents: HistoricalEvent[] = [];

    // Find events that follow within 30-365 days
    for (let j = i + 1; j < sorted.length; j++) {
      const daysDiff = Math.floor((sorted[j].eventDate.getTime() - triggerEvent.eventDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 30 && daysDiff < 365) {
        followingEvents.push(sorted[j]);
      }
    }

    // If same outcome occurs multiple times, it's causal
    if (followingEvents.length >= 2) {
      const outcomeFrequency: Record<string, number> = {};
      for (const event of followingEvents) {
        const outcome = event.mediumTermOutcome || 'unknown';
        outcomeFrequency[outcome] = (outcomeFrequency[outcome] || 0) + 1;
      }

      const mostCommonOutcome = Object.entries(outcomeFrequency).sort((a, b) => b[1] - a[1])[0];

      if (mostCommonOutcome && mostCommonOutcome[1] >= 2) {
        const avgDaysTillOutcome = followingEvents.reduce((sum, e) => {
          return sum + Math.floor((e.eventDate.getTime() - triggerEvent.eventDate.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / followingEvents.length;

        patterns.push({
          patternId: `pattern_causal_${triggerEvent.eventCategory}_${Date.now()}`,
          patternName: `${triggerEvent.eventCategory} → Outcome Pattern`,
          patternType: 'causal',
          frequency: followingEvents.length,
          averageInterval: Math.round(avgDaysTillOutcome),
          confidence: Math.min(100, (mostCommonOutcome[1] / followingEvents.length) * 100),
          triggerEvents: [triggerEvent.eventCategory],
          typicalOutcomes: [mostCommonOutcome[0]],
          averageOutcomeTime: Math.round(avgDaysTillOutcome),
          typicalGMIChange: 0,
          typicalCFIChange: 0,
          typicalHRIChange: 0,
          typicalGDPImpact: 0,
          affectedRegions: Array.from(new Set(followingEvents.map(e => e.country))),
          relatedEventIds: [triggerEvent.id, ...followingEvents.map(e => e.id)],
        });
      }
    }
  }

  return patterns;
}

/**
 * Identify correlative patterns
 */
export function identifyCorrelativePatterns(events: HistoricalEvent[]): DiscoveredPattern[] {
  const patterns: DiscoveredPattern[] = [];

  // Look for events that happen simultaneously across regions
  const eventsByDate: Record<string, HistoricalEvent[]> = {};

  for (const event of events) {
    const dateKey = event.eventDate.toISOString().split('T')[0];
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  }

  // Find dates with multiple events
  for (const [date, dateEvents] of Object.entries(eventsByDate)) {
    if (dateEvents.length >= 2) {
      const categories = Array.from(new Set(dateEvents.map(e => e.eventCategory)));
      const countries = Array.from(new Set(dateEvents.map(e => e.country)));

      const avgGMI = dateEvents.reduce((sum, e) => sum + e.estimatedGMI, 0) / dateEvents.length;
      const avgCFI = dateEvents.reduce((sum, e) => sum + e.estimatedCFI, 0) / dateEvents.length;
      const avgHRI = dateEvents.reduce((sum, e) => sum + e.estimatedHRI, 0) / dateEvents.length;

      patterns.push({
        patternId: `pattern_correlative_${date}_${Date.now()}`,
        patternName: `Simultaneous Events on ${date}`,
        patternType: 'correlative',
        frequency: dateEvents.length,
        averageInterval: 0,
        confidence: 75,
        triggerEvents: categories,
        typicalOutcomes: dateEvents.map(e => e.shortTermOutcome).filter(Boolean),
        averageOutcomeTime: 90,
        typicalGMIChange: avgGMI - 50,
        typicalCFIChange: avgCFI - 50,
        typicalHRIChange: avgHRI - 50,
        typicalGDPImpact: 0,
        affectedRegions: Array.from(countries),
        relatedEventIds: Array.from(dateEvents.map(e => e.id)),
      });
    }
  }

  return patterns;
}

/**
 * Discover all patterns
 */
export function discoverAllPatterns(events: HistoricalEvent[]): DiscoveredPattern[] {
  const allPatterns: DiscoveredPattern[] = [];

  // Discover different pattern types
  allPatterns.push(...identifyCyclicalPatterns(events));
  allPatterns.push(...identifyCausalPatterns(events));
  allPatterns.push(...identifyCorrelativePatterns(events));

  // Sort by confidence
  return allPatterns.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate pattern summary
 */
export function generatePatternSummary(patterns: DiscoveredPattern[]): string {
  let summary = `# Pattern Discovery Summary\n\n`;

  summary += `## Total Patterns Discovered: ${patterns.length}\n\n`;

  const byType = patterns.reduce((acc, p) => {
    if (!acc[p.patternType]) acc[p.patternType] = [];
    acc[p.patternType].push(p);
    return acc;
  }, {} as Record<string, DiscoveredPattern[]>);

  for (const [type, typePatterns] of Object.entries(byType)) {
    summary += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Patterns (${typePatterns.length})\n`;

    for (const pattern of typePatterns.slice(0, 3)) {
      summary += `- **${pattern.patternName}** (Confidence: ${pattern.confidence.toFixed(0)}%)\n`;
      summary += `  - Frequency: ${pattern.frequency} times\n`;
      if (pattern.averageInterval > 0) {
        summary += `  - Average Interval: ${pattern.averageInterval} days\n`;
      }
      summary += `  - Affected Regions: ${pattern.affectedRegions.join(', ')}\n`;
    }
    summary += '\n';
  }

  return summary;
}

/**
 * Validate pattern discovery
 */
export function validatePatternDiscovery(patterns: DiscoveredPattern[]): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const pattern of patterns) {
    if (!pattern.patternId) {
      issues.push('Pattern ID is required');
    }

    if (pattern.confidence < 0 || pattern.confidence > 100) {
      issues.push(`Pattern ${pattern.patternId}: Confidence must be 0-100`);
    }

    if (pattern.frequency < 1) {
      issues.push(`Pattern ${pattern.patternId}: Frequency must be at least 1`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
