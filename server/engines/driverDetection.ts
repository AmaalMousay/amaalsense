/**
 * Engine 4: Driver Detection Engine
 * يكتشف:
 * - أهم الكلمات المؤثرة (Key Drivers)
 * - أهم الأسباب (Root Causes)
 * - السرديات الأساسية (Narratives)
 * - الأحداث المرتبطة (Related Events)
 * 
 * يجاوب على السؤال: لماذا الناس تشعر هكذا؟
 */

import { ContextResult, ContentDomain, EventType } from './contextClassification';
import { AffectiveVector, EmotionFusionResult } from './emotionFusion';

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
      { en: 'Perceived threat to safety or stability', ar: 'تهديد محسوس للأمان أو الاستقرار' },
      { en: 'Uncertainty about future outcomes', ar: 'عدم اليقين بشأن النتائج المستقبلية' },
      { en: 'Potential loss or negative consequences', ar: 'احتمال الخسارة أو العواقب السلبية' }
    ]
  },
  anger: {
    triggers: ['injustice', 'corruption', 'violation', 'attack', 'betrayal', 'failure', 'abuse', 'discrimination'],
    explanations: [
      { en: 'Perceived injustice or unfair treatment', ar: 'ظلم محسوس أو معاملة غير عادلة' },
      { en: 'Violation of rights or expectations', ar: 'انتهاك الحقوق أو التوقعات' },
      { en: 'Frustration with authorities or systems', ar: 'إحباط من السلطات أو الأنظمة' }
    ]
  },
  sadness: {
    triggers: ['loss', 'death', 'failure', 'tragedy', 'suffering', 'decline', 'end', 'farewell'],
    explanations: [
      { en: 'Loss of something or someone valued', ar: 'فقدان شيء أو شخص عزيز' },
      { en: 'Disappointment in outcomes', ar: 'خيبة أمل في النتائج' },
      { en: 'Empathy with others\' suffering', ar: 'التعاطف مع معاناة الآخرين' }
    ]
  },
  joy: {
    triggers: ['success', 'victory', 'achievement', 'celebration', 'progress', 'reunion', 'breakthrough'],
    explanations: [
      { en: 'Achievement of goals or desires', ar: 'تحقيق الأهداف أو الرغبات' },
      { en: 'Positive surprise or good news', ar: 'مفاجأة إيجابية أو أخبار سارة' },
      { en: 'Shared celebration or collective success', ar: 'احتفال مشترك أو نجاح جماعي' }
    ]
  },
  hope: {
    triggers: ['promise', 'opportunity', 'progress', 'solution', 'improvement', 'peace', 'recovery'],
    explanations: [
      { en: 'Signs of positive change', ar: 'علامات على تغيير إيجابي' },
      { en: 'New opportunities emerging', ar: 'ظهور فرص جديدة' },
      { en: 'Progress toward desired outcomes', ar: 'تقدم نحو النتائج المرجوة' }
    ]
  },
  curiosity: {
    triggers: ['discovery', 'mystery', 'question', 'innovation', 'reveal', 'investigation', 'research'],
    explanations: [
      { en: 'New information or discoveries', ar: 'معلومات أو اكتشافات جديدة' },
      { en: 'Unanswered questions or mysteries', ar: 'أسئلة أو ألغاز بدون إجابة' },
      { en: 'Desire to understand complex situations', ar: 'الرغبة في فهم المواقف المعقدة' }
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
      causeAr: `موقف ${translateDomain(context.domain)} عالي المخاطر يخلق استجابة عاطفية`,
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
    descriptionAr: `تعكس هذه القصة نمط ${translateNarrative(primaryNarrative)} في مجال ${translateDomain(context.domain)}`,
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
      { en: 'Ongoing crisis management efforts', ar: 'جهود إدارة الأزمة المستمرة' },
      { en: 'Previous similar incidents', ar: 'حوادث مماثلة سابقة' }
    ],
    death: [
      { en: 'Memorial and mourning period', ar: 'فترة التأبين والحداد' },
      { en: 'Investigation proceedings', ar: 'إجراءات التحقيق' }
    ],
    celebration: [
      { en: 'Achievement recognition events', ar: 'فعاليات تكريم الإنجاز' },
      { en: 'Public celebrations', ar: 'احتفالات عامة' }
    ],
    conflict: [
      { en: 'Ongoing negotiations', ar: 'مفاوضات جارية' },
      { en: 'Previous confrontations', ar: 'مواجهات سابقة' }
    ],
    announcement: [
      { en: 'Follow-up announcements expected', ar: 'إعلانات متابعة متوقعة' },
      { en: 'Implementation timeline', ar: 'الجدول الزمني للتنفيذ' }
    ],
    discovery: [
      { en: 'Research continuation', ar: 'استمرار البحث' },
      { en: 'Peer review process', ar: 'عملية مراجعة الأقران' }
    ],
    election: [
      { en: 'Campaign activities', ar: 'أنشطة الحملة' },
      { en: 'Voting procedures', ar: 'إجراءات التصويت' }
    ],
    disaster: [
      { en: 'Relief operations', ar: 'عمليات الإغاثة' },
      { en: 'Recovery efforts', ar: 'جهود التعافي' }
    ],
    achievement: [
      { en: 'Recognition ceremonies', ar: 'حفلات التكريم' },
      { en: 'Future goals', ar: 'الأهداف المستقبلية' }
    ],
    controversy: [
      { en: 'Public debate', ar: 'نقاش عام' },
      { en: 'Official responses', ar: 'ردود رسمية' }
    ],
    neutral: [
      { en: 'Ongoing developments', ar: 'تطورات جارية' }
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
  const causeAr = causes[0]?.causeAr || 'الوضع الحالي';
  
  return {
    en: `People feel ${dominantEmotion} because ${cause}. The key driver is "${primaryDriver}" in the context of ${context.domain} ${context.eventType}.`,
    ar: `يشعر الناس بـ${emotionNameAr} بسبب ${causeAr}. المحرك الرئيسي هو "${primaryDriverAr}" في سياق ${translateDomain(context.domain)} ${translateEventType(context.eventType)}.`
  };
}

// Helper translation functions
function translateTerm(term: string): string {
  const translations: Record<string, string> = {
    'government': 'الحكومة', 'policy': 'السياسة', 'election': 'الانتخابات',
    'price': 'السعر', 'market': 'السوق', 'inflation': 'التضخم',
    'disease': 'المرض', 'vaccine': 'اللقاح', 'hospital': 'المستشفى',
    'conflict': 'الصراع', 'military': 'العسكري', 'peace': 'السلام',
    'team': 'الفريق', 'victory': 'النصر', 'championship': 'البطولة',
    'climate': 'المناخ', 'pollution': 'التلوث', 'environment': 'البيئة'
  };
  return translations[term.toLowerCase()] || term;
}

function translateDomain(domain: ContentDomain): string {
  const translations: Record<ContentDomain, string> = {
    politics: 'السياسة', economy: 'الاقتصاد', health: 'الصحة',
    war: 'الحرب', sports: 'الرياضة', entertainment: 'الترفيه',
    technology: 'التكنولوجيا', environment: 'البيئة', society: 'المجتمع',
    education: 'التعليم', general: 'عام'
  };
  return translations[domain];
}

function translateEventType(eventType: EventType): string {
  const translations: Record<EventType, string> = {
    crisis: 'أزمة', death: 'وفاة', celebration: 'احتفال',
    conflict: 'صراع', announcement: 'إعلان', discovery: 'اكتشاف',
    election: 'انتخابات', disaster: 'كارثة', achievement: 'إنجاز',
    controversy: 'جدل', neutral: 'محايد'
  };
  return translations[eventType];
}

function translateEmotion(emotion: keyof AffectiveVector): string {
  const translations: Record<keyof AffectiveVector, string> = {
    joy: 'الفرح', fear: 'الخوف', anger: 'الغضب',
    sadness: 'الحزن', hope: 'الأمل', curiosity: 'الفضول'
  };
  return translations[emotion];
}

function translateNarrative(narrative: string): string {
  const translations: Record<string, string> = {
    'power struggle': 'صراع على السلطة',
    'economic crisis': 'أزمة اقتصادية',
    'health crisis': 'أزمة صحية',
    'escalating conflict': 'صراع متصاعد',
    'championship race': 'سباق البطولة',
    'tech disruption': 'اضطراب تقني',
    'climate crisis': 'أزمة مناخية',
    'social movement': 'حركة اجتماعية',
    'education reform': 'إصلاح التعليم',
    'developing story': 'قصة متطورة'
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
