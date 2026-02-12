/**
 * Historical Events Schema
 * 
 * Stores historical events with emotional and economic indicators
 * Forms the basis of the Historical Context Layer
 */

import { mysqlTable, varchar, text, int, decimal, datetime, json, enum as mysqlEnum, index } from 'drizzle-orm/mysql-core';

/**
 * Historical Events Table
 * Stores significant historical events with their emotional and economic context
 */
export const historicalEvents = mysqlTable(
  'historical_events',
  {
    id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
    
    // Event identification
    eventName: varchar('event_name', { length: 255 }).notNull(),
    eventDescription: text('event_description').notNull(),
    eventCategory: mysqlEnum('event_category', [
      'political',
      'economic',
      'social',
      'environmental',
      'technological',
      'health',
      'conflict',
      'cultural',
      'other'
    ]).notNull(),
    
    // Temporal information
    eventDate: datetime('event_date').notNull(),
    eventEndDate: datetime('event_end_date'),
    duration: int('duration'), // in days
    
    // Geographic information
    country: varchar('country', { length: 100 }).notNull(),
    region: varchar('region', { length: 100 }),
    affectedCountries: json('affected_countries'), // Array of country codes
    
    // Emotional indicators
    estimatedGMI: decimal('estimated_gmi', { precision: 5, scale: 2 }), // Global Mood Index
    estimatedCFI: decimal('estimated_cfi', { precision: 5, scale: 2 }), // Collective Fear Index
    estimatedHRI: decimal('estimated_hri', { precision: 5, scale: 2 }), // Hope Resilience Index
    emotionalVector: json('emotional_vector'), // { joy, fear, anger, sadness, hope, curiosity }
    
    // Economic indicators
    gdpImpact: decimal('gdp_impact', { precision: 10, scale: 2 }), // percentage change
    unemploymentChange: decimal('unemployment_change', { precision: 5, scale: 2 }), // percentage points
    inflationRate: decimal('inflation_rate', { precision: 5, scale: 2 }), // percentage
    stockMarketChange: decimal('stock_market_change', { precision: 5, scale: 2 }), // percentage
    economicSector: varchar('economic_sector', { length: 100 }), // e.g., "technology", "agriculture"
    
    // Consequences and outcomes
    shortTermOutcome: text('short_term_outcome'), // What happened in the next 3-6 months
    mediumTermOutcome: text('medium_term_outcome'), // What happened in 6-18 months
    longTermOutcome: text('long_term_outcome'), // What happened in 18+ months
    
    // Pattern information
    similarPastEvents: json('similar_past_events'), // Array of event IDs
    predictedFutureEvents: json('predicted_future_events'), // Array of likely follow-up events
    
    // Data quality
    dataReliability: int('data_reliability'), // 0-100 confidence score
    sources: json('sources'), // Array of source objects { name, url, credibility }
    
    // Metadata
    createdAt: datetime('created_at').defaultNow(),
    updatedAt: datetime('updated_at').defaultNow(),
  },
  (table) => ({
    countryIndex: index('idx_country').on(table.country),
    dateIndex: index('idx_event_date').on(table.eventDate),
    categoryIndex: index('idx_category').on(table.eventCategory),
    gmiIndex: index('idx_gmi').on(table.estimatedGMI),
  })
);

/**
 * Historical Patterns Table
 * Stores discovered patterns from historical events
 */
export const historicalPatterns = mysqlTable(
  'historical_patterns',
  {
    id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
    
    // Pattern identification
    patternName: varchar('pattern_name', { length: 255 }).notNull(),
    patternDescription: text('pattern_description').notNull(),
    patternType: mysqlEnum('pattern_type', [
      'cyclical',
      'causal',
      'correlative',
      'predictive',
      'anomalous'
    ]).notNull(),
    
    // Pattern characteristics
    frequency: int('frequency'), // How many times this pattern occurred
    averageInterval: int('average_interval'), // Average days between occurrences
    confidence: decimal('confidence', { precision: 5, scale: 2 }), // 0-100
    
    // Pattern triggers and outcomes
    triggerEvents: json('trigger_events'), // Array of event types that trigger this pattern
    typicalOutcomes: json('typical_outcomes'), // Array of likely outcomes
    averageOutcomeTime: int('average_outcome_time'), // days until outcome manifests
    
    // Emotional and economic signatures
    typicalGMIChange: decimal('typical_gmi_change', { precision: 5, scale: 2 }),
    typicalCFIChange: decimal('typical_cfi_change', { precision: 5, scale: 2 }),
    typicalHRIChange: decimal('typical_hri_change', { precision: 5, scale: 2 }),
    typicalGDPImpact: decimal('typical_gdp_impact', { precision: 10, scale: 2 }),
    
    // Geographic scope
    affectedRegions: json('affected_regions'), // Array of regions
    globalImpact: int('global_impact'), // 0-100 how global the impact is
    
    // Related events
    relatedEventIds: json('related_event_ids'), // Array of event IDs that form this pattern
    
    // Metadata
    discoveredAt: datetime('discovered_at').defaultNow(),
    lastUpdated: datetime('last_updated').defaultNow(),
  },
  (table) => ({
    typeIndex: index('idx_pattern_type').on(table.patternType),
    confidenceIndex: index('idx_confidence').on(table.confidence),
  })
);

/**
 * Historical Predictions Table
 * Stores predictions based on historical patterns
 */
export const historicalPredictions = mysqlTable(
  'historical_predictions',
  {
    id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
    
    // Prediction identification
    predictionName: varchar('prediction_name', { length: 255 }).notNull(),
    predictionDescription: text('prediction_description').notNull(),
    
    // Prediction basis
    basedOnPatternId: varchar('based_on_pattern_id', { length: 36 }).notNull(),
    triggeringEventId: varchar('triggering_event_id', { length: 36 }).notNull(),
    
    // Prediction details
    predictedEventType: varchar('predicted_event_type', { length: 100 }).notNull(),
    predictedCountry: varchar('predicted_country', { length: 100 }).notNull(),
    predictedDate: datetime('predicted_date').notNull(),
    timeToEvent: int('time_to_event'), // days from now
    
    // Prediction confidence
    confidence: decimal('confidence', { precision: 5, scale: 2 }), // 0-100
    historicalAccuracy: decimal('historical_accuracy', { precision: 5, scale: 2 }), // based on pattern accuracy
    
    // Expected outcomes
    expectedGMIChange: decimal('expected_gmi_change', { precision: 5, scale: 2 }),
    expectedCFIChange: decimal('expected_cfi_change', { precision: 5, scale: 2 }),
    expectedHRIChange: decimal('expected_hri_change', { precision: 5, scale: 2 }),
    expectedGDPImpact: decimal('expected_gdp_impact', { precision: 10, scale: 2 }),
    
    // Prediction status
    status: mysqlEnum('status', ['active', 'verified', 'failed', 'expired']).default('active'),
    verificationDate: datetime('verification_date'),
    actualOutcome: text('actual_outcome'),
    
    // Metadata
    createdAt: datetime('created_at').defaultNow(),
    expiresAt: datetime('expires_at'),
  },
  (table) => ({
    countryIndex: index('idx_pred_country').on(table.predictedCountry),
    dateIndex: index('idx_pred_date').on(table.predictedDate),
    statusIndex: index('idx_status').on(table.status),
  })
);

/**
 * Historical Context Cache Table
 * Caches computed historical context for performance
 */
export const historicalContextCache = mysqlTable(
  'historical_context_cache',
  {
    id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
    
    // Cache key
    cacheKey: varchar('cache_key', { length: 255 }).notNull().unique(),
    
    // Current event
    currentEventId: varchar('current_event_id', { length: 36 }).notNull(),
    
    // Similar historical events
    similarEventIds: json('similar_event_ids'), // Array of event IDs
    similarityScores: json('similarity_scores'), // Array of scores 0-100
    
    // Discovered patterns
    applicablePatternIds: json('applicable_pattern_ids'), // Array of pattern IDs
    patternConfidences: json('pattern_confidences'), // Array of confidence scores
    
    // Generated insights
    insights: json('insights'), // Array of insight strings
    predictions: json('predictions'), // Array of prediction objects
    
    // Cache metadata
    createdAt: datetime('created_at').defaultNow(),
    expiresAt: datetime('expires_at'),
    hitCount: int('hit_count').default(0),
  },
  (table) => ({
    keyIndex: index('idx_cache_key').on(table.cacheKey),
    expiryIndex: index('idx_expires_at').on(table.expiresAt),
  })
);

/**
 * Types for TypeScript
 */
export type HistoricalEvent = typeof historicalEvents.$inferSelect;
export type HistoricalEventInsert = typeof historicalEvents.$inferInsert;

export type HistoricalPattern = typeof historicalPatterns.$inferSelect;
export type HistoricalPatternInsert = typeof historicalPatterns.$inferInsert;

export type HistoricalPrediction = typeof historicalPredictions.$inferSelect;
export type HistoricalPredictionInsert = typeof historicalPredictions.$inferInsert;

export type HistoricalContextCache = typeof historicalContextCache.$inferSelect;
export type HistoricalContextCacheInsert = typeof historicalContextCache.$inferInsert;
