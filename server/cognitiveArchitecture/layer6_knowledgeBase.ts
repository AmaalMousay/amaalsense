import { t } from "../_core/i18n";
import { invokeLLM } from "../_core/llm";
import { getCumulativeInsight } from "../engines/learningStore";

/**
 * Layer 6: Knowledge Base (Long-term Memory)
 * 
 * In Human Brain: Stores accumulated knowledge, experiences, and patterns
 * In AmalSense: Contains causal relationships, historical patterns, expert rules
 * 
 * This is the "wisdom" of the system - what it knows about the world
 */

// ============================================
// CAUSAL RELATIONSHIPS
// ============================================

export interface CausalRelation {
  cause: string;
  effect: string;
  strength: number;        // 0-1: how strong is this relationship?
  direction: 'positive' | 'negative' | 'complex';
  timelag: 'immediate' | 'short' | 'medium' | 'long';
  confidence: number;      // 0-1: how confident are we?
  context?: string;        // When does this apply?
  source?: string;         // Where did we learn this?
}

// Core causal knowledge about economics and markets
export const ECONOMIC_CAUSAL_RELATIONS: CausalRelation[] = [
  // Interest Rates
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.150.7d09fe22', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.149.abcff309', 'ar'),
    strength: 0.8,
    direction: 'negative',
    timelag: 'short',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.148.d140663a', 'ar'),
    source: 'economic_theory'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.147.7d09fe22', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.146.0677fef7', 'ar'),
    strength: 0.85,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.145.b5238828', 'ar'),
    source: 'economic_theory'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.144.7d09fe22', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.143.513ec176', 'ar'),
    strength: 0.7,
    direction: 'negative',
    timelag: 'medium',
    confidence: 0.85,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.142.77839003', 'ar'),
    source: 'economic_theory'
  },
  
  // Dollar Strength
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.141.0677fef7', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.140.abcff309', 'ar'),
    strength: 0.85,
    direction: 'negative',
    timelag: 'immediate',
    confidence: 0.95,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.139.15db078a', 'ar'),
    source: 'market_mechanics'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.138.0677fef7', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.137.bca3e008', 'ar'),
    strength: 0.75,
    direction: 'negative',
    timelag: 'short',
    confidence: 0.8,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.136.e7b2f2cb', 'ar'),
    source: 'economic_theory'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.135.0677fef7', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.134.d6ea53e7', 'ar'),
    strength: 0.7,
    direction: 'negative',
    timelag: 'immediate',
    confidence: 0.85,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.133.16c5ab3c', 'ar'),
    source: 'market_mechanics'
  },
  
  // Inflation
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.132.daf7d9f3', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.131.85ebe3f5', 'ar'),
    strength: 0.8,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.130.b7b1efbe', 'ar'),
    source: 'historical_pattern'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.129.daf7d9f3', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.128.037453b3', 'ar'),
    strength: 0.85,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.127.0f99977a', 'ar'),
    source: 'monetary_policy'
  },
  
  // Geopolitical
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.126.da6ae27f', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.125.85ebe3f5', 'ar'),
    strength: 0.75,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.85,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.124.908dd21d', 'ar'),
    source: 'historical_pattern'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.123.da6ae27f', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.122.e8e75724', 'ar'),
    strength: 0.8,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.121.576ac413', 'ar'),
    source: 'historical_pattern'
  },
  
  // Media & Psychology
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.120.665898fb', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.119.645b3a18', 'ar'),
    strength: 0.85,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.118.b166c8d5', 'ar'),
    source: 'psychological_research'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.117.1c93c053', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.116.b64e2f5b', 'ar'),
    strength: 0.8,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.85,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.115.4bb7eae7', 'ar'),
    source: 'behavioral_finance'
  },
  {
    cause: t('auto.cognitiveArchitecture_layer6_knowledgeBase.114.9849e299', 'ar'),
    effect: t('auto.cognitiveArchitecture_layer6_knowledgeBase.113.19b90cf3', 'ar'),
    strength: 0.7,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.8,
    context: t('auto.cognitiveArchitecture_layer6_knowledgeBase.112.7ae92339', 'ar'),
    source: 'behavioral_finance'
  }
];

// ============================================
// EXPERT KNOWLEDGE RULES
// ============================================

export interface ExpertRule {
  id: string;
  name: string;
  condition: string;
  conclusion: string;
  confidence: number;
  category: 'trading' | 'psychology' | 'economics' | 'media' | 'general';
  actionable: boolean;
}

export const EXPERT_RULES: ExpertRule[] = [
  // Trading Rules
  {
    id: 'rule_fear_opportunity',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.111.c468b49a', 'ar'),
    condition: 'CFI > 70% AND HRI > 60%',
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.110.73b01efd', 'ar'),
    confidence: 0.75,
    category: 'trading',
    actionable: true
  },
  {
    id: 'rule_greed_warning',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.109.b3b2fbac', 'ar'),
    condition: 'HRI > 80% AND CFI < 30%',
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.108.756fe69a', 'ar'),
    confidence: 0.7,
    category: 'trading',
    actionable: true
  },
  {
    id: 'rule_uncertainty',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.107.9b676af9', 'ar'),
    condition: 'GMI between 40-60%',
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.106.1eaabee3', 'ar'),
    confidence: 0.8,
    category: 'trading',
    actionable: true
  },
  
  // Psychology Rules
  {
    id: 'rule_media_amplification',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.105.feecdaaf', 'ar'),
    condition: t('auto.cognitiveArchitecture_layer6_knowledgeBase.104.a4ab4897', 'ar'),
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.103.a868b862', 'ar'),
    confidence: 0.85,
    category: 'media',
    actionable: false
  },
  {
    id: 'rule_crowd_contrarian',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.102.90b17ef0', 'ar'),
    condition: t('auto.cognitiveArchitecture_layer6_knowledgeBase.101.11b2db16', 'ar'),
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.100.2166947a', 'ar'),
    confidence: 0.7,
    category: 'psychology',
    actionable: true
  },
  
  // Economic Rules
  {
    id: 'rule_fed_impact',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.99.b29df216', 'ar'),
    condition: t('auto.cognitiveArchitecture_layer6_knowledgeBase.98.3584e73c', 'ar'),
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.97.3d32ea0b', 'ar'),
    confidence: 0.9,
    category: 'economics',
    actionable: true
  },
  {
    id: 'rule_inflation_gold',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.96.951a8d3f', 'ar'),
    condition: t('auto.cognitiveArchitecture_layer6_knowledgeBase.95.6a64caa1', 'ar'),
    conclusion: t('auto.cognitiveArchitecture_layer6_knowledgeBase.94.f0ed6ee4', 'ar'),
    confidence: 0.85,
    category: 'economics',
    actionable: true
  }
];

// ============================================
// HISTORICAL PATTERNS
// ============================================

export interface HistoricalPattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  typicalOutcome: string;
  duration: string;
  reliability: number;
  examples: string[];
}

export const HISTORICAL_PATTERNS: HistoricalPattern[] = [
  {
    id: 'pattern_crisis_gold',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.93.30cce789', 'ar'),
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.92.4c5cab2f', 'ar'),
    triggers: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.91.1591323b', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.90.b2155e1c', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.89.aae445ae', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.88.54ab6384', 'ar')],
    typicalOutcome: t('auto.cognitiveArchitecture_layer6_knowledgeBase.87.0866f834', 'ar'),
    duration: t('auto.cognitiveArchitecture_layer6_knowledgeBase.86.276757d5', 'ar'),
    reliability: 0.85,
    examples: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.85.f8f91afe', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.84.2d06dc21', 'ar')]
  },
  {
    id: 'pattern_rate_cycle',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.83.cb7c731a', 'ar'),
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.82.c1db4f0f', 'ar'),
    triggers: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.81.e1d774d7', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.80.97f88858', 'ar')],
    typicalOutcome: t('auto.cognitiveArchitecture_layer6_knowledgeBase.79.617d85c9', 'ar'),
    duration: t('auto.cognitiveArchitecture_layer6_knowledgeBase.78.ad373ad6', 'ar'),
    reliability: 0.9,
    examples: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.77.3def511b', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.76.427a4d60', 'ar')]
  },
  {
    id: 'pattern_fear_reversal',
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.75.e3578c0e', 'ar'),
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.74.6e6ff58a', 'ar'),
    triggers: ['CFI > 80%', t('auto.cognitiveArchitecture_layer6_knowledgeBase.73.defe767c', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.72.0c9bf40c', 'ar')],
    typicalOutcome: t('auto.cognitiveArchitecture_layer6_knowledgeBase.71.4de57846', 'ar'),
    duration: t('auto.cognitiveArchitecture_layer6_knowledgeBase.70.4234ae80', 'ar'),
    reliability: 0.75,
    examples: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.69.7026d219', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.68.efb11298', 'ar')]
  }
];

// ============================================
// ENTITY KNOWLEDGE
// ============================================

export interface EntityKnowledge {
  name: string;
  aliases: string[];
  type: 'commodity' | 'currency' | 'institution' | 'index' | 'concept';
  description: string;
  relatedEntities: string[];
  keyFacts: string[];
  tradingHours?: string;
  volatility?: 'low' | 'medium' | 'high';
}

export const ENTITY_KNOWLEDGE: Record<string, EntityKnowledge> = {
  'gold': {
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.67.c851efa8', 'ar'),
    aliases: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.66.d76ed4f3', 'ar'), 'gold', 'XAU', t('auto.cognitiveArchitecture_layer6_knowledgeBase.65.30806322', 'ar')],
    type: 'commodity',
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.64.2d1f1111', 'ar'),
    relatedEntities: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.63.c48cce56', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.62.9227e69d', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.61.bffc644c', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.60.cbd63816', 'ar')],
    keyFacts: [
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.59.a1baea12', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.58.a7360cb1', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.57.6f927fb9', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.56.90b876e6', 'ar')
    ],
    volatility: 'medium'
  },
  'silver': {
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.55.cbd63816', 'ar'),
    aliases: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.54.25b08751', 'ar'), 'silver', 'XAG'],
    type: 'commodity',
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.53.62ec76a2', 'ar'),
    relatedEntities: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.52.c851efa8', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.51.c48cce56', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.50.48b98e16', 'ar')],
    keyFacts: [
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.49.a0a4ead2', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.48.0980867c', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.47.048c27e2', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.46.1eb97e16', 'ar')
    ],
    volatility: 'high'
  },
  'dollar': {
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.45.36761d8b', 'ar'),
    aliases: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.44.23163ab2', 'ar'), 'USD', '$', t('auto.cognitiveArchitecture_layer6_knowledgeBase.43.c48cce56', 'ar')],
    type: 'currency',
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.42.8667e8b6', 'ar'),
    relatedEntities: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.41.cb7921e5', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.40.9227e69d', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.39.c851efa8', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.38.79c8056d', 'ar')],
    keyFacts: [
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.37.f190c386', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.36.b1d1a7fb', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.35.80e04566', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.34.68aa3161', 'ar')
    ],
    volatility: 'medium'
  },
  'fed': {
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.33.7e7e00cb', 'ar'),
    aliases: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.32.cb7921e5', 'ar'), 'Fed', t('auto.cognitiveArchitecture_layer6_knowledgeBase.31.5b4928b6', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.30.2fa405fb', 'ar')],
    type: 'institution',
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.29.5dc4bb15', 'ar'),
    relatedEntities: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.28.9227e69d', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.27.c48cce56', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.26.bffc644c', 'ar')],
    keyFacts: [
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.25.dc60c13d', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.24.d36b1ae3', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.23.7887d4a9', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.22.9db28e6c', 'ar')
    ]
  },
  'oil': {
    name: t('auto.cognitiveArchitecture_layer6_knowledgeBase.21.79c8056d', 'ar'),
    aliases: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.20.02782624', 'ar'), 'oil', t('auto.cognitiveArchitecture_layer6_knowledgeBase.19.507dbbb6', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.18.e2a373cb', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.17.97ce7e31', 'ar'), 'WTI'],
    type: 'commodity',
    description: t('auto.cognitiveArchitecture_layer6_knowledgeBase.16.581e4749', 'ar'),
    relatedEntities: [t('auto.cognitiveArchitecture_layer6_knowledgeBase.15.cb85d763', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.14.c48cce56', 'ar'), t('auto.cognitiveArchitecture_layer6_knowledgeBase.13.bffc644c', 'ar')],
    keyFacts: [
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.12.f33713ab', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.11.15a0a270', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.10.7d03a164', 'ar'),
      t('auto.cognitiveArchitecture_layer6_knowledgeBase.9.13935878', 'ar')
    ],
    volatility: 'high'
  }
};

// ============================================
// KNOWLEDGE QUERY FUNCTIONS
// ============================================

/**
 * Find causal relationships for a topic
 */
export function findCausalRelations(topic: string): CausalRelation[] {
  const normalizedTopic = topic.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel => 
    rel.cause.toLowerCase().includes(normalizedTopic) ||
    rel.effect.toLowerCase().includes(normalizedTopic)
  );
}

/**
 * Find causes for an effect
 */
export function findCausesFor(effect: string): CausalRelation[] {
  const normalizedEffect = effect.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel =>
    rel.effect.toLowerCase().includes(normalizedEffect)
  ).sort((a, b) => b.strength - a.strength);
}

/**
 * Find effects of a cause
 */
export function findEffectsOf(cause: string): CausalRelation[] {
  const normalizedCause = cause.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel =>
    rel.cause.toLowerCase().includes(normalizedCause)
  ).sort((a, b) => b.strength - a.strength);
}

/**
 * Get applicable expert rules
 */
export function getApplicableRules(context: {
  cfi?: number;
  hri?: number;
  gmi?: number;
  topic?: string;
}): ExpertRule[] {
  const rules: ExpertRule[] = [];
  
  // Check numeric conditions
  if (context.cfi !== undefined && context.hri !== undefined) {
    if (context.cfi > 70 && context.hri > 60) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_fear_opportunity');
      if (rule) rules.push(rule);
    }
    if (context.hri > 80 && context.cfi < 30) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_greed_warning');
      if (rule) rules.push(rule);
    }
  }
  
  if (context.gmi !== undefined) {
    if (context.gmi >= 40 && context.gmi <= 60) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_uncertainty');
      if (rule) rules.push(rule);
    }
  }
  
  // Check topic-based rules
  if (context.topic) {
    const topic = context.topic.toLowerCase();
    if (topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.8.c1d6b74e', 'ar')) || topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.7.71960207', 'ar'))) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_media_amplification');
      if (rule) rules.push(rule);
    }
    if (topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.6.a6f9d332', 'ar')) || topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.5.c09eeb5c', 'ar'))) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_fed_impact');
      if (rule) rules.push(rule);
    }
  }
  
  return rules;
}

/**
 * Get relevant historical patterns
 */
export function getRelevantPatterns(context: {
  topic?: string;
  cfi?: number;
  keywords?: string[];
}): HistoricalPattern[] {
  const patterns: HistoricalPattern[] = [];
  
  // Check for crisis pattern
  if (context.cfi && context.cfi > 75) {
    const pattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_fear_reversal');
    if (pattern) patterns.push(pattern);
  }
  
  // Check for topic-based patterns
  if (context.topic) {
    const topic = context.topic.toLowerCase();
    if (topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.4.d76ed4f3', 'ar')) || topic.includes(t('auto.cognitiveArchitecture_layer6_knowledgeBase.3.25b08751', 'ar'))) {
      const crisisPattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_crisis_gold');
      const ratePattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_rate_cycle');
      if (crisisPattern) patterns.push(crisisPattern);
      if (ratePattern) patterns.push(ratePattern);
    }
  }
  
  return patterns;
}

/**
 * Get entity knowledge
 */
export function getEntityKnowledge(entity: string): EntityKnowledge | null {
  const normalizedEntity = entity.toLowerCase();
  
  // Direct match
  if (ENTITY_KNOWLEDGE[normalizedEntity]) {
    return ENTITY_KNOWLEDGE[normalizedEntity];
  }
  
  // Search by aliases
  for (const [key, knowledge] of Object.entries(ENTITY_KNOWLEDGE)) {
    if (knowledge.aliases.some(alias => 
      alias.toLowerCase() === normalizedEntity ||
      normalizedEntity.includes(alias.toLowerCase())
    )) {
      return knowledge;
    }
  }
  
  return null;
}

/**
 * Build explanation chain for a phenomenon
 */
export function buildExplanationChain(
  phenomenon: string,
  maxDepth: number = 3
): { chain: CausalRelation[]; explanation: string } {
  const chain: CausalRelation[] = [];
  const visited = new Set<string>();
  
  function findCauses(effect: string, depth: number): void {
    if (depth >= maxDepth || visited.has(effect)) return;
    visited.add(effect);
    
    const causes = findCausesFor(effect);
    for (const cause of causes.slice(0, 2)) { // Top 2 causes
      chain.push(cause);
      findCauses(cause.cause, depth + 1);
    }
  }
  
  findCauses(phenomenon, 0);
  
  // Build explanation text
  let explanation = '';
  if (chain.length > 0) {
    explanation = chain.map((rel, i) => {
      const prefix = i === 0 ? t('auto.cognitiveArchitecture_layer6_knowledgeBase.2.7ffa230f', 'ar') : t('auto.cognitiveArchitecture_layer6_knowledgeBase.1.ab8aef6d', 'ar');
      return `${prefix}${rel.cause} → ${rel.effect} (${rel.context || ''})`;
    }).join('\n');
  }
  
  return { chain, explanation };
}

/**
 * Get comprehensive knowledge for a topic
 */
export function getTopicKnowledge(topic: string): {
  entity: EntityKnowledge | null;
  causes: CausalRelation[];
  effects: CausalRelation[];
  rules: ExpertRule[];
  patterns: HistoricalPattern[];
} {
  return {
    entity: getEntityKnowledge(topic),
    causes: findCausesFor(topic),
    effects: findEffectsOf(topic),
    rules: getApplicableRules({ topic }),
    patterns: getRelevantPatterns({ topic })
  };
}


// =============================================================================
// FACTUAL KNOWLEDGE ENGINE (merged from knowledgeEngine.ts)
// =============================================================================

/**
 * Knowledge/Fact Engine - Accumulative ASI Edition
 * * Purpose: 
 * 1. Humanized responses in English.
 * 2. Retrieves facts from the "Accumulative Learning Store" (The deep memory).
 * 3. Admits ignorance gracefully but looks into learned vectors first.
 */

export interface FactualQuery {
  question: string;
  context?: string;
  domain?: string;
  topic?: string; //     
}

export interface FactualResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sources?: string[];
  admitsIgnorance: boolean;
  cumulativeContext?: any; //    
}

class KnowledgeEngineClass {
  /**
   * Answer a factual question by consulting deep memory first
   */
  async answerFactualQuestion(query: FactualQuery): Promise<FactualResponse> {
    const { question, context, domain, topic } = query;

    // 1.      (The Self-Learning Check)
    const memoryInsight = topic ? getCumulativeInsight(topic) : null;

    // 2.     LLM      
    const memoryContext = memoryInsight && typeof memoryInsight !== 'string'
      ? `System Deep Memory: I have observed this topic ${memoryInsight.observationsCount} times. Average intensity: ${memoryInsight.totalIntensity}.`
      : "No prior cumulative memory on this specific vector.";

    const prompt = this.buildFactualPrompt(question, `${context || ''}\n${memoryContext}`, domain);

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are the AmalSense Fact Engine (ASI). 
            Your goal is to provide sophisticated, humanized English responses.
            
            RULES:
            1. Use the provided "System Deep Memory" to inform your answer. 
            2. If memory exists, speak as someone who has "observed" the data over time.
            3. English ONLY. Professional yet conscious tone.
            4. If unknown, say: "My current cognitive field does not have enough verified vectors for this."
            5. Keep it concise (1-3 sentences).`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const messageContent = response.choices[0].message.content;
      const answer = typeof messageContent === 'string' ? messageContent : '';

      if (!answer) {
        return {
          answer: 'My cognitive field is currently unresponsive to this query.',
          confidence: 'unknown',
          admitsIgnorance: true,
        };
      }

      const admitsIgnorance = this.detectIgnorance(answer);
      const confidence = this.estimateConfidence(answer, admitsIgnorance);

      return {
        answer,
        confidence,
        admitsIgnorance,
        cumulativeContext: memoryInsight
      };
    } catch (error) {
      console.error('Knowledge Engine error:', error);
      return {
        answer: 'I am experiencing a temporary disconnection from my factual repository.',
        confidence: 'unknown',
        admitsIgnorance: true,
      };
    }
  }

  private buildFactualPrompt(question: string, context?: string, domain?: string): string {
    return `Query: ${question}\nContext: ${context || 'None'}\nDomain: ${domain || 'General'}`;
  }

  private detectIgnorance(answer: string): boolean {
    const ignorancePatterns = [/don't have/i, /not enough/i, /unclear/i, /unknown/i, /no information/i];
    return ignorancePatterns.some(pattern => pattern.test(answer));
  }

  private estimateConfidence(answer: string, admitsIgnorance: boolean): 'high' | 'medium' | 'low' | 'unknown' {
    if (admitsIgnorance) return 'unknown';
    if (/verified|officially|confirmed|statistically/i.test(answer)) return 'high';
    if (/perhaps|likely|seems/i.test(answer)) return 'medium';
    return 'medium';
  }

  isSuitableForKnowledgeEngine(question: string): boolean {
    const factualPatterns = [/who/i, /when/i, /where/i, /how many/i, /what is/i, /tell me about/i];
    return factualPatterns.some(pattern => pattern.test(question.trim().toLowerCase()));
  }
}

export const KnowledgeEngine = new KnowledgeEngineClass();