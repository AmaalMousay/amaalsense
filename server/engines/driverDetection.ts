import { t } from "../_core/i18n";
/**
 * Engine 4: Driver Detection Engine
 * :
 * -    (Key Drivers)
 * -   (Root Causes)
 * -   (Narratives)
 * -   (Related Events)
 * 
 *   :    
 */

import { ContextResult, ContentDomain, EventType } from './contextClassification';
import { AffectiveVector, EmotionFusionResult } from './emotionEngine';

export interface KeyDriver {
  term: string;
  termAr: string;
  impact: number;        // 0-100
  sentiment: 'positive' | 'negative' | 'neutral';
  category: 'person' | 'organization' | 'event' | 'topic' | 'location' | 'action';
}

export interface RootCause {
  cause: string;
  causeAr: string;
  confidence: number;    // 0-100
  emotionTriggered: keyof AffectiveVector;
  evidence: string[];
}

export interface Narrative {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  emotionalTone: 'hopeful' | 'fearful' | 'angry' | 'sad' | 'joyful' | 'curious' | 'mixed';
  strength: number;      // 0-100
}

export interface RelatedEvent {
  event: string;
  eventAr: string;
  relevance: number;     // 0-100
  timeframe: 'recent' | 'ongoing' | 'historical';
  emotionalImpact: 'amplifying' | 'dampening' | 'neutral';
}

export interface DriverDetectionResult {
  keyDrivers: KeyDriver[];
  rootCauses: RootCause[];
  narratives: Narrative[];
  relatedEvents: RelatedEvent[];
  whyStatement: {
    en: string;
    ar: string;
  };
  confidence: number;
}

// Domain-specific driver patterns
const DOMAIN_DRIVERS: Record<ContentDomain, { patterns: string[], narratives: string[] }> = {
  politics: {
    patterns: ['government', 'policy', 'election', 'leader', 'party', 'vote', 'law', 'reform', 'corruption', 'democracy'],
    narratives: ['power struggle', 'reform movement', 'political crisis', 'democratic transition', 'authoritarian control']
  },
  economy: {
    patterns: ['price', 'inflation', 'market', 'unemployment', 'growth', 'recession', 'trade', 'investment', 'currency', 'debt'],
    narratives: ['economic crisis', 'market volatility', 'growth opportunity', 'financial instability', 'recovery hopes']
  },
  health: {
    patterns: ['disease', 'vaccine', 'hospital', 'treatment', 'outbreak', 'pandemic', 'medicine', 'healthcare', 'doctor', 'patient'],
    narratives: ['health crisis', 'medical breakthrough', 'pandemic response', 'healthcare reform', 'public health concern']
  },
  war: {
    patterns: ['conflict', 'military', 'attack', 'ceasefire', 'casualties', 'peace', 'invasion', 'defense', 'weapons', 'troops'],
    narratives: ['escalating conflict', 'peace negotiations', 'humanitarian crisis', 'military operation', 'civilian impact']
  },
  sports: {
    patterns: ['team', 'player', 'match', 'championship', 'victory', 'defeat', 'record', 'tournament', 'coach', 'fans'],
    narratives: ['championship race', 'underdog story', 'rivalry clash', 'historic achievement', 'team crisis']
  },
  entertainment: {
    patterns: ['movie', 'celebrity', 'music', 'award', 'show', 'star', 'album', 'concert', 'film', 'series'],
    narratives: ['celebrity drama', 'artistic achievement', 'cultural phenomenon', 'industry controversy', 'fan reaction']
  },
  technology: {
    patterns: ['innovation', 'ai', 'startup', 'digital', 'software', 'data', 'cyber', 'tech', 'app', 'platform'],
    narratives: ['tech disruption', 'privacy concerns', 'innovation breakthrough', 'digital transformation', 'cybersecurity threat']
  },
  environment: {
    patterns: ['climate', 'pollution', 'carbon', 'renewable', 'disaster', 'ecosystem', 'conservation', 'emission', 'green', 'sustainability'],
    narratives: ['climate crisis', 'environmental disaster', 'green transition', 'conservation effort', 'sustainability challenge']
  },
  society: {
    patterns: ['community', 'rights', 'justice', 'equality', 'protest', 'culture', 'education', 'poverty', 'immigration', 'discrimination'],
    narratives: ['social movement', 'justice reform', 'cultural shift', 'community response', 'inequality debate']
  },
  education: {
    patterns: ['school', 'university', 'student', 'teacher', 'curriculum', 'exam', 'research', 'learning', 'academic', 'degree'],
    narratives: ['education reform', 'academic achievement', 'learning crisis', 'research breakthrough', 'student movement']
  },
  general: {
    patterns: [],
    narratives: ['developing story', 'public interest', 'emerging trend']
  }
};

// Emotion-cause mapping
const EMOTION_CAUSES: Record<keyof AffectiveVector, { triggers: string[], explanations: { en: string, ar: string }[] }> = {
  fear: {
    triggers: ['threat', 'danger', 'risk', 'crisis', 'warning', 'attack', 'disease', 'collapse', 'uncertainty'],
    explanations: [
      { en: 'Perceived threat to safety or stability', ar: t('auto.engines_driverDetection.96.a70db9dd', 'ar') },
      { en: 'Uncertainty about future outcomes', ar: t('auto.engines_driverDetection.95.721c165c', 'ar') },
      { en: 'Potential loss or negative consequences', ar: t('auto.engines_driverDetection.94.8ecae6c8', 'ar') }
    ]
  },
  anger: {
    triggers: ['injustice', 'corruption', 'violation', 'attack', 'betrayal', 'failure', 'abuse', 'discrimination'],
    explanations: [
      { en: 'Perceived injustice or unfair treatment', ar: t('auto.engines_driverDetection.93.67200347', 'ar') },
      { en: 'Violation of rights or expectations', ar: t('auto.engines_driverDetection.92.7ab5dd9b', 'ar') },
      { en: 'Frustration with authorities or systems', ar: t('auto.engines_driverDetection.91.7b8570f0', 'ar') }
    ]
  },
  sadness: {
    triggers: ['loss', 'death', 'failure', 'tragedy', 'suffering', 'decline', 'end', 'farewell'],
    explanations: [
      { en: 'Loss of something or someone valued', ar: t('auto.engines_driverDetection.90.2ffe2926', 'ar') },
      { en: 'Disappointment in outcomes', ar: t('auto.engines_driverDetection.89.829f47ab', 'ar') },
      { en: 'Empathy with others\' suffering', ar: t('auto.engines_driverDetection.88.3fa8830e', 'ar') }
    ]
  },
  joy: {
    triggers: ['success', 'victory', 'achievement', 'celebration', 'progress', 'reunion', 'breakthrough'],
    explanations: [
      { en: 'Achievement of goals or desires', ar: t('auto.engines_driverDetection.87.b363c355', 'ar') },
      { en: 'Positive surprise or good news', ar: t('auto.engines_driverDetection.86.15c809e0', 'ar') },
      { en: 'Shared celebration or collective success', ar: t('auto.engines_driverDetection.85.93619669', 'ar') }
    ]
  },
  hope: {
    triggers: ['promise', 'opportunity', 'progress', 'solution', 'improvement', 'peace', 'recovery'],
    explanations: [
      { en: 'Signs of positive change', ar: t('auto.engines_driverDetection.84.a5dc4e49', 'ar') },
      { en: 'New opportunities emerging', ar: t('auto.engines_driverDetection.83.6f960e88', 'ar') },
      { en: 'Progress toward desired outcomes', ar: t('auto.engines_driverDetection.82.70b2704a', 'ar') }
    ]
  },
  curiosity: {
    triggers: ['discovery', 'mystery', 'question', 'innovation', 'reveal', 'investigation', 'research'],
    explanations: [
      { en: 'New information or discoveries', ar: t('auto.engines_driverDetection.81.d8729bea', 'ar') },
      { en: 'Unanswered questions or mysteries', ar: t('auto.engines_driverDetection.80.45eca1dc', 'ar') },
      { en: 'Desire to understand complex situations', ar: t('auto.engines_driverDetection.79.db66330e', 'ar') }
    ]
  }
};

/**
 * Extract key drivers from text
 */
function extractKeyDrivers(text: string, context: ContextResult, emotions: EmotionFusionResult): KeyDriver[] {
  const drivers: KeyDriver[] = [];
  const lowerText = text.toLowerCase();
  const domainPatterns = DOMAIN_DRIVERS[context.domain]?.patterns || [];
  
  // Find matching patterns
  for (const pattern of domainPatterns) {
    if (lowerText.includes(pattern)) {
      // Determine sentiment based on surrounding context
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (emotions.valence > 20) sentiment = 'positive';
      else if (emotions.valence < -20) sentiment = 'negative';
      
      drivers.push({
        term: pattern,
        termAr: translateTerm(pattern),
        impact: Math.min(100, 50 + Math.random() * 30),
        sentiment,
        category: categorizeDriver(pattern)
      });
    }
  }
  
  // Add keywords from context
  for (const keyword of context.keywords.slice(0, 5)) {
    if (!drivers.find(d => d.term === keyword)) {
      drivers.push({
        term: keyword,
        termAr: translateTerm(keyword),
        impact: Math.min(100, 40 + Math.random() * 25),
        sentiment: 'neutral',
        category: 'topic'
      });
    }
  }
  
  return drivers.sort((a, b) => b.impact - a.impact).slice(0, 6);
}

/**
 * Identify root causes
 */
function identifyRootCauses(text: string, context: ContextResult, emotions: EmotionFusionResult): RootCause[] {
  const causes: RootCause[] = [];
  const lowerText = text.toLowerCase();
  
  // Find causes based on dominant emotion
  const dominantEmotion = emotions.dominantEmotion;
  const emotionConfig = EMOTION_CAUSES[dominantEmotion];
  
  // Check for trigger words
  const foundTriggers = emotionConfig.triggers.filter(t => lowerText.includes(t));
  
  if (foundTriggers.length > 0) {
    // Select appropriate explanation
    const explanation = emotionConfig.explanations[Math.floor(Math.random() * emotionConfig.explanations.length)];
    
    causes.push({
      cause: explanation.en,
      causeAr: explanation.ar,
      confidence: Math.min(100, 60 + foundTriggers.length * 10),
      emotionTriggered: dominantEmotion,
      evidence: foundTriggers
    });
  }
  
  // Add context-based causes
  if (context.sensitivity === 'critical' || context.sensitivity === 'high') {
    causes.push({
      cause: `High-stakes ${context.domain} situation creating emotional response`,
      causeAr: ` ${translateDomain(context.domain)}     `,
      confidence: 70,
      emotionTriggered: emotions.vector.fear > emotions.vector.anger ? 'fear' : 'anger',
      evidence: [context.domain, context.eventType]
    });
  }
  
  return causes.slice(0, 3);
}

/**
 * Generate narratives
 */
function generateNarratives(context: ContextResult, emotions: EmotionFusionResult): Narrative[] {
  const narratives: Narrative[] = [];
  const domainNarratives = DOMAIN_DRIVERS[context.domain]?.narratives || DOMAIN_DRIVERS.general.narratives;
  
  // Select relevant narrative based on emotional state
  let emotionalTone: Narrative['emotionalTone'];
  if (emotions.vector.fear > 50) emotionalTone = 'fearful';
  else if (emotions.vector.anger > 50) emotionalTone = 'angry';
  else if (emotions.vector.joy > 50) emotionalTone = 'joyful';
  else if (emotions.vector.hope > 50) emotionalTone = 'hopeful';
  else if (emotions.vector.sadness > 50) emotionalTone = 'sad';
  else if (emotions.vector.curiosity > 50) emotionalTone = 'curious';
  else emotionalTone = 'mixed';
  
  // Add primary narrative
  const primaryNarrative = domainNarratives[0] || 'developing story';
  narratives.push({
    title: primaryNarrative.charAt(0).toUpperCase() + primaryNarrative.slice(1),
    titleAr: translateNarrative(primaryNarrative),
    description: `This story reflects a ${primaryNarrative} pattern in the ${context.domain} domain`,
    descriptionAr: `    ${translateNarrative(primaryNarrative)}   ${translateDomain(context.domain)}`,
    emotionalTone,
    strength: Math.min(100, emotions.emotionalIntensity + 20)
  });
  
  return narratives;
}

/**
 * Identify related events
 */
function identifyRelatedEvents(context: ContextResult): RelatedEvent[] {
  const events: RelatedEvent[] = [];
  
  // Generate contextual related events
  const eventTemplates: Record<EventType, { en: string, ar: string }[]> = {
    crisis: [
      { en: 'Ongoing crisis management efforts', ar: t('auto.engines_driverDetection.78.18f6187b', 'ar') },
      { en: 'Previous similar incidents', ar: t('auto.engines_driverDetection.77.5c054800', 'ar') }
    ],
    death: [
      { en: 'Memorial and mourning period', ar: t('auto.engines_driverDetection.76.306eb1f0', 'ar') },
      { en: 'Investigation proceedings', ar: t('auto.engines_driverDetection.75.b8c7f83c', 'ar') }
    ],
    celebration: [
      { en: 'Achievement recognition events', ar: t('auto.engines_driverDetection.74.1be2351d', 'ar') },
      { en: 'Public celebrations', ar: t('auto.engines_driverDetection.73.5d7a578e', 'ar') }
    ],
    conflict: [
      { en: 'Ongoing negotiations', ar: t('auto.engines_driverDetection.72.c0f800b7', 'ar') },
      { en: 'Previous confrontations', ar: t('auto.engines_driverDetection.71.38231035', 'ar') }
    ],
    announcement: [
      { en: 'Follow-up announcements expected', ar: t('auto.engines_driverDetection.70.53fb775e', 'ar') },
      { en: 'Implementation timeline', ar: t('auto.engines_driverDetection.69.e7ab0594', 'ar') }
    ],
    discovery: [
      { en: 'Research continuation', ar: t('auto.engines_driverDetection.68.73658454', 'ar') },
      { en: 'Peer review process', ar: t('auto.engines_driverDetection.67.b58bb1f6', 'ar') }
    ],
    election: [
      { en: 'Campaign activities', ar: t('auto.engines_driverDetection.66.3074ddde', 'ar') },
      { en: 'Voting procedures', ar: t('auto.engines_driverDetection.65.66196606', 'ar') }
    ],
    disaster: [
      { en: 'Relief operations', ar: t('auto.engines_driverDetection.64.fb9f03fd', 'ar') },
      { en: 'Recovery efforts', ar: t('auto.engines_driverDetection.63.6048d02c', 'ar') }
    ],
    achievement: [
      { en: 'Recognition ceremonies', ar: t('auto.engines_driverDetection.62.e6101a51', 'ar') },
      { en: 'Future goals', ar: t('auto.engines_driverDetection.61.65b21669', 'ar') }
    ],
    controversy: [
      { en: 'Public debate', ar: t('auto.engines_driverDetection.60.50471fcc', 'ar') },
      { en: 'Official responses', ar: t('auto.engines_driverDetection.59.a30ce51b', 'ar') }
    ],
    neutral: [
      { en: 'Ongoing developments', ar: t('auto.engines_driverDetection.58.3564a8f0', 'ar') }
    ]
  };
  
  const templates = eventTemplates[context.eventType] || eventTemplates.neutral;
  
  for (const template of templates) {
    events.push({
      event: template.en,
      eventAr: template.ar,
      relevance: Math.round(70 + Math.random() * 20),
      timeframe: 'ongoing',
      emotionalImpact: 'neutral'
    });
  }
  
  return events.slice(0, 3);
}

/**
 * Generate "why" statement
 */
function generateWhyStatement(
  context: ContextResult, 
  emotions: EmotionFusionResult, 
  drivers: KeyDriver[], 
  causes: RootCause[]
): { en: string; ar: string } {
  const dominantEmotion = emotions.dominantEmotion;
  const emotionNameEn = dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1);
  const emotionNameAr = translateEmotion(dominantEmotion);
  
  const primaryDriver = drivers[0]?.term || context.domain;
  const primaryDriverAr = drivers[0]?.termAr || translateDomain(context.domain);
  
  const cause = causes[0]?.cause || 'the current situation';
  const causeAr = causes[0]?.causeAr || t('auto.engines_driverDetection.57.d977a7bb', 'ar');
  
  return {
    en: `People feel ${dominantEmotion} because ${cause}. The key driver is "${primaryDriver}" in the context of ${context.domain} ${context.eventType}.`,
    ar: `  ${emotionNameAr}  ${causeAr}.    "${primaryDriverAr}"   ${translateDomain(context.domain)} ${translateEventType(context.eventType)}.`
  };
}

// Helper translation functions
function translateTerm(term: string): string {
  const translations: Record<string, string> = {
    'government': t('auto.engines_driverDetection.56.efc24526', 'ar'), 'policy': t('auto.engines_driverDetection.55.d2c95863', 'ar'), 'election': t('auto.engines_driverDetection.54.a1f32d42', 'ar'),
    'price': t('auto.engines_driverDetection.53.b6aa0c7d', 'ar'), 'market': t('auto.engines_driverDetection.52.d8b2c7d3', 'ar'), 'inflation': t('auto.engines_driverDetection.51.bffc644c', 'ar'),
    'disease': t('auto.engines_driverDetection.50.06f868fe', 'ar'), 'vaccine': t('auto.engines_driverDetection.49.ddcea020', 'ar'), 'hospital': t('auto.engines_driverDetection.48.350dafa8', 'ar'),
    'conflict': t('auto.engines_driverDetection.47.a5d01066', 'ar'), 'military': t('auto.engines_driverDetection.46.7ba96ead', 'ar'), 'peace': t('auto.engines_driverDetection.45.7cb56720', 'ar'),
    'team': t('auto.engines_driverDetection.44.c3a143b7', 'ar'), 'victory': t('auto.engines_driverDetection.43.0171c0ec', 'ar'), 'championship': t('auto.engines_driverDetection.42.5d6b4c86', 'ar'),
    'climate': t('auto.engines_driverDetection.41.cb7053a6', 'ar'), 'pollution': t('auto.engines_driverDetection.40.c20f60ee', 'ar'), 'environment': t('auto.engines_driverDetection.39.c7fca11d', 'ar')
  };
  return translations[term.toLowerCase()] || term;
}

function translateDomain(domain: ContentDomain): string {
  const translations: Record<ContentDomain, string> = {
    politics: t('auto.engines_driverDetection.38.d2c95863', 'ar'), economy: t('auto.engines_driverDetection.37.a43da44f', 'ar'), health: t('auto.engines_driverDetection.36.005e9108', 'ar'),
    war: t('auto.engines_driverDetection.35.63068650', 'ar'), sports: t('auto.engines_driverDetection.34.0132e618', 'ar'), entertainment: t('auto.engines_driverDetection.33.bec8bc5b', 'ar'),
    technology: t('auto.engines_driverDetection.32.0abcff3b', 'ar'), environment: t('auto.engines_driverDetection.31.c7fca11d', 'ar'), society: t('auto.engines_driverDetection.30.a38221d3', 'ar'),
    education: t('auto.engines_driverDetection.29.f18ce12b', 'ar'), general: t('auto.engines_driverDetection.28.17859487', 'ar')
  };
  return translations[domain];
}

function translateEventType(eventType: EventType): string {
  const translations: Record<EventType, string> = {
    crisis: t('auto.engines_driverDetection.27.38a8a76e', 'ar'), death: t('auto.engines_driverDetection.26.158c325c', 'ar'), celebration: t('auto.engines_driverDetection.25.3460cbc6', 'ar'),
    conflict: t('auto.engines_driverDetection.24.393955e1', 'ar'), announcement: t('auto.engines_driverDetection.23.81581363', 'ar'), discovery: t('auto.engines_driverDetection.22.7811e2fe', 'ar'),
    election: t('auto.engines_driverDetection.21.d9b242e6', 'ar'), disaster: t('auto.engines_driverDetection.20.676d2f53', 'ar'), achievement: t('auto.engines_driverDetection.19.c24d8d6c', 'ar'),
    controversy: t('auto.engines_driverDetection.18.ab2e01fd', 'ar'), neutral: t('auto.engines_driverDetection.17.7e22af2d', 'ar')
  };
  return translations[eventType];
}

function translateEmotion(emotion: keyof AffectiveVector): string {
  const translations: Record<keyof AffectiveVector, string> = {
    joy: t('auto.engines_driverDetection.16.81fd7301', 'ar'), fear: t('auto.engines_driverDetection.15.b4cbc50d', 'ar'), anger: t('auto.engines_driverDetection.14.0a67288b', 'ar'),
    sadness: t('auto.engines_driverDetection.13.2c024033', 'ar'), hope: t('auto.engines_driverDetection.12.05554470', 'ar'), curiosity: t('auto.engines_driverDetection.11.f1f8172b', 'ar')
  };
  return translations[emotion];
}

function translateNarrative(narrative: string): string {
  const translations: Record<string, string> = {
    'power struggle': t('auto.engines_driverDetection.10.c2f30b66', 'ar'),
    'economic crisis': t('auto.engines_driverDetection.9.842a2582', 'ar'),
    'health crisis': t('auto.engines_driverDetection.8.ef7f3f70', 'ar'),
    'escalating conflict': t('auto.engines_driverDetection.7.cc18498a', 'ar'),
    'championship race': t('auto.engines_driverDetection.6.c453f4aa', 'ar'),
    'tech disruption': t('auto.engines_driverDetection.5.eb0ccba9', 'ar'),
    'climate crisis': t('auto.engines_driverDetection.4.248275b6', 'ar'),
    'social movement': t('auto.engines_driverDetection.3.0b9a518a', 'ar'),
    'education reform': t('auto.engines_driverDetection.2.d2760259', 'ar'),
    'developing story': t('auto.engines_driverDetection.1.5d548405', 'ar')
  };
  return translations[narrative.toLowerCase()] || narrative;
}

function categorizeDriver(term: string): KeyDriver['category'] {
  const categories: Record<string, KeyDriver['category']> = {
    'government': 'organization', 'policy': 'topic', 'election': 'event',
    'market': 'topic', 'conflict': 'event', 'team': 'organization'
  };
  return categories[term.toLowerCase()] || 'topic';
}

/**
 * Main Driver Detection Function
 */
export function detectDrivers(
  text: string, 
  context: ContextResult, 
  emotions: EmotionFusionResult
): DriverDetectionResult {
  const keyDrivers = extractKeyDrivers(text, context, emotions);
  const rootCauses = identifyRootCauses(text, context, emotions);
  const narratives = generateNarratives(context, emotions);
  const relatedEvents = identifyRelatedEvents(context);
  const whyStatement = generateWhyStatement(context, emotions, keyDrivers, rootCauses);
  
  // Calculate overall confidence
  const confidence = Math.round(
    (context.confidence * 0.3) + 
    (emotions.confidence * 0.3) + 
    (keyDrivers.length > 0 ? 40 : 20)
  );
  
  return {
    keyDrivers,
    rootCauses,
    narratives,
    relatedEvents,
    whyStatement,
    confidence
  };
}

export default { detectDrivers };
