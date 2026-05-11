/**
 * Historical Context Engine
 * 
 * Analyzes current events in light of historical context
 * Finds similar past events and discovers patterns
 */

export interface HistoricalEvent {
  id: string;
  eventName: string;
  eventDate: Date;
  country: string;
  estimatedGMI: number;
  estimatedCFI: number;
  estimatedHRI: number;
  emotionalVector: Record<string, number>;
  gdpImpact: number;
  shortTermOutcome: string;
  mediumTermOutcome: string;
  longTermOutcome: string;
}

export interface CurrentEvent {
  topic: string;
  country: string;
  gmi: number;
  cfi: number;
  hri: number;
  emotionalVector: Record<string, number>;
  description: string;
  timestamp: number;
}

export interface HistoricalComparison {
  historicalEventId: string;
  historicalEventName: string;
  historicalEventDate: Date;
  similarity: number; // 0-100
  gmiSimilarity: number;
  cfiSimilarity: number;
  hriSimilarity: number;
  emotionalVectorSimilarity: number;
  gdpImpactSimilarity: number;
  predictedOutcome: string;
  timeToOutcome: number; // days
}

export interface HistoricalInsight {
  insight: string;
  confidence: number; // 0-100
  historicalBasis: string;
  predictedOutcome: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Calculate similarity between two emotional vectors
 */
export function calculateEmotionalVectorSimilarity(
  vector1: Record<string, number>,
  vector2: Record<string, number>
): number {
  const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];
  let totalDifference = 0;

  for (const emotion of emotions) {
    const val1 = vector1[emotion] || 0;
    const val2 = vector2[emotion] || 0;
    totalDifference += Math.abs(val1 - val2);
  }

  const averageDifference = totalDifference / emotions.length;
  return Math.max(0, 100 - averageDifference);
}

/**
 * Calculate similarity between two events
 */
export function calculateEventSimilarity(
  currentEvent: CurrentEvent,
  historicalEvent: HistoricalEvent
): number {
  // Calculate individual similarities
  const gmiSimilarity = 100 - Math.abs(currentEvent.gmi - historicalEvent.estimatedGMI);
  const cfiSimilarity = 100 - Math.abs(currentEvent.cfi - historicalEvent.estimatedCFI);
  const hriSimilarity = 100 - Math.abs(currentEvent.hri - historicalEvent.estimatedHRI);
  const emotionalVectorSimilarity = calculateEmotionalVectorSimilarity(
    currentEvent.emotionalVector,
    historicalEvent.emotionalVector
  );

  // Country match bonus
  const countryMatch = currentEvent.country === historicalEvent.country ? 20 : 0;

  // Topic relevance (simplified)
  const topicMatch = 15; // Placeholder

  // Weighted average
  const similarity =
    (gmiSimilarity * 0.25 + cfiSimilarity * 0.25 + hriSimilarity * 0.2 + emotionalVectorSimilarity * 0.2 + countryMatch + topicMatch) /
    1.2;

  return Math.min(100, Math.max(0, similarity));
}

/**
 * Find similar historical events
 */
export function findSimilarHistoricalEvents(
  currentEvent: CurrentEvent,
  historicalEvents: HistoricalEvent[],
  threshold: number = 60
): HistoricalComparison[] {
  const comparisons: HistoricalComparison[] = [];

  for (const historicalEvent of historicalEvents) {
    const similarity = calculateEventSimilarity(currentEvent, historicalEvent);

    if (similarity >= threshold) {
      const gmiSimilarity = 100 - Math.abs(currentEvent.gmi - historicalEvent.estimatedGMI);
      const cfiSimilarity = 100 - Math.abs(currentEvent.cfi - historicalEvent.estimatedCFI);
      const hriSimilarity = 100 - Math.abs(currentEvent.hri - historicalEvent.estimatedHRI);
      const emotionalVectorSimilarity = calculateEmotionalVectorSimilarity(
        currentEvent.emotionalVector,
        historicalEvent.emotionalVector
      );
      const gdpImpactSimilarity = 100 - Math.abs(currentEvent.gmi - historicalEvent.gdpImpact) / 2;

      // Estimate time to outcome (average of historical outcomes)
      const timeToOutcome = 180; // Placeholder: 6 months

      comparisons.push({
        historicalEventId: historicalEvent.id,
        historicalEventName: historicalEvent.eventName,
        historicalEventDate: historicalEvent.eventDate,
        similarity,
        gmiSimilarity,
        cfiSimilarity,
        hriSimilarity,
        emotionalVectorSimilarity,
        gdpImpactSimilarity,
        predictedOutcome: historicalEvent.mediumTermOutcome,
        timeToOutcome,
      });
    }
  }

  // Sort by similarity
  return comparisons.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Generate historical insights
 */
export function generateHistoricalInsights(
  currentEvent: CurrentEvent,
  similarEvents: HistoricalComparison[]
): HistoricalInsight[] {
  const insights: HistoricalInsight[] = [];

  if (similarEvents.length === 0) {
    return insights;
  }

  // Insight 1: Most similar historical event
  const mostSimilar = similarEvents[0];
  const daysSince = Math.floor((Date.now() - mostSimilar.historicalEventDate.getTime()) / (1000 * 60 * 60 * 24));
  
  insights.push({
    insight: `This situation is ${mostSimilar.similarity.toFixed(0)}% similar to "${mostSimilar.historicalEventName}" which occurred ${daysSince} days ago in ${mostSimilar.historicalEventDate.getFullYear()}.`,
    confidence: mostSimilar.similarity,
    historicalBasis: mostSimilar.historicalEventName,
    predictedOutcome: mostSimilar.predictedOutcome,
    timeframe: `${mostSimilar.timeToOutcome} days`,
    riskLevel: mostSimilar.similarity > 85 ? 'high' : mostSimilar.similarity > 70 ? 'medium' : 'low',
  });

  // Insight 2: Pattern detection
  if (similarEvents.length >= 2) {
    const avgOutcome = similarEvents.slice(0, 3).reduce((sum, e) => sum + e.timeToOutcome, 0) / Math.min(3, similarEvents.length);
    
    insights.push({
      insight: `Based on ${similarEvents.length} similar historical events, the typical outcome manifests within ${Math.round(avgOutcome)} days.`,
      confidence: Math.min(100, 50 + similarEvents.length * 10),
      historicalBasis: `${similarEvents.length} similar events`,
      predictedOutcome: 'Pattern-based prediction',
      timeframe: `${Math.round(avgOutcome)} days`,
      riskLevel: 'medium',
    });
  }

  // Insight 3: Emotional trajectory
  const avgGMIChange = similarEvents.slice(0, 3).reduce((sum, e) => sum + (100 - e.gmiSimilarity), 0) / Math.min(3, similarEvents.length);
  
  insights.push({
    insight: `Historical precedent suggests the mood index may ${avgGMIChange > 0 ? 'decline' : 'improve'} by approximately ${Math.abs(avgGMIChange).toFixed(1)} points.`,
    confidence: 60,
    historicalBasis: 'Historical emotional trajectories',
    predictedOutcome: 'Emotional shift',
    timeframe: '30-90 days',
    riskLevel: avgGMIChange > 10 ? 'high' : 'medium',
  });

  return insights;
}

/**
 * Predict future outcomes based on historical patterns
 */
export function predictFutureOutcomes(
  similarEvents: HistoricalComparison[]
): {
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  confidence: number;
} {
  if (similarEvents.length === 0) {
    return {
      shortTerm: 'Insufficient historical data',
      mediumTerm: 'Insufficient historical data',
      longTerm: 'Insufficient historical data',
      confidence: 0,
    };
  }

  // Use the most similar event as basis
  const mostSimilar = similarEvents[0];
  const confidence = mostSimilar.similarity;

  return {
    shortTerm: mostSimilar.predictedOutcome || 'Continued tension',
    mediumTerm: 'Gradual stabilization expected',
    longTerm: 'Return to baseline conditions',
    confidence: Math.min(100, confidence),
  };
}

/**
 * Generate comprehensive historical analysis
 */
export function analyzeWithHistoricalContext(
  currentEvent: CurrentEvent,
  historicalEvents: HistoricalEvent[]
): {
  similarEvents: HistoricalComparison[];
  insights: HistoricalInsight[];
  predictions: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
    confidence: number;
  };
  confidence: number;
} {
  // Find similar events
  const similarEvents = findSimilarHistoricalEvents(currentEvent, historicalEvents, 50);

  // Generate insights
  const insights = generateHistoricalInsights(currentEvent, similarEvents);

  // Predict outcomes
  const predictions = predictFutureOutcomes(similarEvents);

  // Calculate overall confidence
  const confidence = similarEvents.length > 0 ? similarEvents[0].similarity : 0;

  return {
    similarEvents,
    insights,
    predictions,
    confidence,
  };
}

/**
 * Format historical analysis for display
 */
export function formatHistoricalAnalysis(analysis: ReturnType<typeof analyzeWithHistoricalContext>): string {
  let report = `# Historical Context Analysis\n\n`;

  report += `## Similar Historical Events\n`;
  if (analysis.similarEvents.length === 0) {
    report += `No similar historical events found.\n\n`;
  } else {
    for (const event of analysis.similarEvents.slice(0, 3)) {
      report += `### ${event.historicalEventName}\n`;
      report += `- **Date:** ${event.historicalEventDate.toLocaleDateString()}\n`;
      report += `- **Similarity:** ${event.similarity.toFixed(1)}%\n`;
      report += `- **Predicted Outcome:** ${event.predictedOutcome}\n`;
      report += `- **Time to Outcome:** ${event.timeToOutcome} days\n\n`;
    }
  }

  report += `## Historical Insights\n`;
  for (const insight of analysis.insights) {
    report += `- **${insight.insight}** (Confidence: ${insight.confidence.toFixed(0)}%)\n`;
  }
  report += '\n';

  report += `## Predicted Outcomes\n`;
  report += `- **Short Term:** ${analysis.predictions.shortTerm}\n`;
  report += `- **Medium Term:** ${analysis.predictions.mediumTerm}\n`;
  report += `- **Long Term:** ${analysis.predictions.longTerm}\n`;
  report += `- **Confidence:** ${analysis.predictions.confidence.toFixed(0)}%\n`;

  return report;
}

/**
 * Validate historical analysis
 */
export function validateHistoricalAnalysis(analysis: ReturnType<typeof analyzeWithHistoricalContext>): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!Array.isArray(analysis.similarEvents)) {
    issues.push('Similar events must be an array');
  }

  if (!Array.isArray(analysis.insights)) {
    issues.push('Insights must be an array');
  }

  if (!analysis.predictions) {
    issues.push('Predictions are required');
  }

  if (analysis.confidence < 0 || analysis.confidence > 100) {
    issues.push('Confidence must be between 0 and 100');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
