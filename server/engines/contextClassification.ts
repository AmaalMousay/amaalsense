/**
 * Engine 1: Context Classification
 * يفهم النص قبل التحليل ويحدد:
 * - domain: المجال (سياسة، اقتصاد، صحة، حرب، رياضة...)
 * - eventType: نوع الحدث (وفاة، أزمة، احتفال، صراع...)
 * - region: المنطقة الجغرافية
 * - sensitivity: مستوى الحساسية
 */

export type ContentDomain = 
  | 'politics' 
  | 'economy' 
  | 'health' 
  | 'war' 
  | 'sports' 
  | 'entertainment' 
  | 'technology' 
  | 'environment' 
  | 'society' 
  | 'education'
  | 'general';

export type EventType = 
  | 'crisis' 
  | 'death' 
  | 'celebration' 
  | 'conflict' 
  | 'announcement' 
  | 'discovery' 
  | 'election' 
  | 'disaster' 
  | 'achievement'
  | 'controversy'
  | 'neutral';

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ContextResult {
  domain: ContentDomain;
  eventType: EventType;
  region: string;
  sensitivity: SensitivityLevel;
  confidence: number;
  keywords: string[];
  language: 'ar' | 'en' | 'mixed';
}

// Domain keywords mapping
const DOMAIN_KEYWORDS: Record<ContentDomain, { en: string[], ar: string[] }> = {
  politics: {
    en: ['government', 'president', 'minister', 'parliament', 'election', 'vote', 'policy', 'law', 'congress', 'senate', 'democracy', 'political', 'party', 'opposition', 'coalition'],
    ar: ['حكومة', 'رئيس', 'وزير', 'برلمان', 'انتخابات', 'تصويت', 'سياسة', 'قانون', 'مجلس', 'ديمقراطية', 'سياسي', 'حزب', 'معارضة', 'ائتلاف']
  },
  economy: {
    en: ['market', 'stock', 'price', 'inflation', 'economy', 'trade', 'bank', 'currency', 'dollar', 'investment', 'gdp', 'recession', 'growth', 'oil', 'gold', 'bitcoin', 'crypto'],
    ar: ['سوق', 'أسهم', 'سعر', 'تضخم', 'اقتصاد', 'تجارة', 'بنك', 'عملة', 'دولار', 'استثمار', 'ركود', 'نمو', 'نفط', 'ذهب', 'بيتكوين', 'عملات']
  },
  health: {
    en: ['health', 'hospital', 'doctor', 'disease', 'virus', 'vaccine', 'medicine', 'patient', 'treatment', 'covid', 'pandemic', 'outbreak', 'medical', 'surgery', 'cancer'],
    ar: ['صحة', 'مستشفى', 'طبيب', 'مرض', 'فيروس', 'لقاح', 'دواء', 'مريض', 'علاج', 'كورونا', 'وباء', 'طبي', 'جراحة', 'سرطان']
  },
  war: {
    en: ['war', 'military', 'army', 'attack', 'bomb', 'missile', 'soldier', 'conflict', 'battle', 'invasion', 'defense', 'weapon', 'troops', 'casualties', 'ceasefire'],
    ar: ['حرب', 'عسكري', 'جيش', 'هجوم', 'قصف', 'صاروخ', 'جندي', 'صراع', 'معركة', 'غزو', 'دفاع', 'سلاح', 'قوات', 'ضحايا', 'وقف إطلاق النار']
  },
  sports: {
    en: ['football', 'soccer', 'match', 'game', 'team', 'player', 'championship', 'league', 'goal', 'win', 'score', 'tournament', 'olympic', 'world cup', 'final'],
    ar: ['كرة القدم', 'مباراة', 'فريق', 'لاعب', 'بطولة', 'دوري', 'هدف', 'فوز', 'نتيجة', 'كأس العالم', 'نهائي', 'أولمبياد']
  },
  entertainment: {
    en: ['movie', 'film', 'actor', 'singer', 'music', 'concert', 'celebrity', 'award', 'show', 'series', 'album', 'star', 'hollywood', 'netflix'],
    ar: ['فيلم', 'ممثل', 'مغني', 'موسيقى', 'حفل', 'مشهور', 'جائزة', 'مسلسل', 'ألبوم', 'نجم', 'هوليوود']
  },
  technology: {
    en: ['technology', 'ai', 'artificial intelligence', 'software', 'app', 'internet', 'computer', 'digital', 'innovation', 'startup', 'tech', 'robot', 'data', 'cyber'],
    ar: ['تكنولوجيا', 'ذكاء اصطناعي', 'برنامج', 'تطبيق', 'إنترنت', 'كمبيوتر', 'رقمي', 'ابتكار', 'تقنية', 'روبوت', 'بيانات', 'سايبر']
  },
  environment: {
    en: ['climate', 'environment', 'pollution', 'carbon', 'green', 'renewable', 'solar', 'earthquake', 'flood', 'hurricane', 'wildfire', 'drought', 'emission'],
    ar: ['مناخ', 'بيئة', 'تلوث', 'كربون', 'أخضر', 'متجددة', 'شمسي', 'زلزال', 'فيضان', 'إعصار', 'حريق', 'جفاف', 'انبعاثات']
  },
  society: {
    en: ['social', 'community', 'protest', 'rights', 'justice', 'equality', 'discrimination', 'immigration', 'refugee', 'poverty', 'education', 'culture'],
    ar: ['اجتماعي', 'مجتمع', 'احتجاج', 'حقوق', 'عدالة', 'مساواة', 'تمييز', 'هجرة', 'لاجئ', 'فقر', 'تعليم', 'ثقافة']
  },
  education: {
    en: ['school', 'university', 'student', 'teacher', 'education', 'exam', 'degree', 'scholarship', 'research', 'academic', 'learning', 'curriculum'],
    ar: ['مدرسة', 'جامعة', 'طالب', 'معلم', 'تعليم', 'امتحان', 'شهادة', 'منحة', 'بحث', 'أكاديمي', 'تعلم', 'منهج']
  },
  general: {
    en: [],
    ar: []
  }
};

// Event type keywords
const EVENT_KEYWORDS: Record<EventType, { en: string[], ar: string[] }> = {
  crisis: {
    en: ['crisis', 'emergency', 'urgent', 'critical', 'collapse', 'crash', 'panic', 'chaos', 'disaster'],
    ar: ['أزمة', 'طوارئ', 'عاجل', 'حرج', 'انهيار', 'ذعر', 'فوضى', 'كارثة']
  },
  death: {
    en: ['death', 'died', 'killed', 'murder', 'assassination', 'funeral', 'mourning', 'victim', 'casualty'],
    ar: ['وفاة', 'توفي', 'قتل', 'اغتيال', 'جنازة', 'حداد', 'ضحية', 'شهيد']
  },
  celebration: {
    en: ['celebration', 'victory', 'win', 'success', 'achievement', 'congratulations', 'happy', 'joy', 'festival'],
    ar: ['احتفال', 'انتصار', 'فوز', 'نجاح', 'إنجاز', 'تهنئة', 'سعادة', 'فرح', 'مهرجان']
  },
  conflict: {
    en: ['conflict', 'dispute', 'tension', 'clash', 'fight', 'battle', 'confrontation', 'opposition'],
    ar: ['صراع', 'نزاع', 'توتر', 'اشتباك', 'قتال', 'معركة', 'مواجهة', 'خلاف']
  },
  announcement: {
    en: ['announce', 'declare', 'reveal', 'launch', 'introduce', 'statement', 'decision', 'official'],
    ar: ['إعلان', 'تصريح', 'كشف', 'إطلاق', 'قرار', 'رسمي', 'بيان']
  },
  discovery: {
    en: ['discover', 'find', 'breakthrough', 'innovation', 'research', 'study', 'science', 'new'],
    ar: ['اكتشاف', 'اختراع', 'ابتكار', 'بحث', 'دراسة', 'علم', 'جديد']
  },
  election: {
    en: ['election', 'vote', 'ballot', 'candidate', 'campaign', 'poll', 'referendum'],
    ar: ['انتخابات', 'تصويت', 'اقتراع', 'مرشح', 'حملة', 'استفتاء']
  },
  disaster: {
    en: ['disaster', 'earthquake', 'flood', 'hurricane', 'tsunami', 'explosion', 'accident', 'tragedy'],
    ar: ['كارثة', 'زلزال', 'فيضان', 'إعصار', 'تسونامي', 'انفجار', 'حادث', 'مأساة']
  },
  achievement: {
    en: ['achievement', 'record', 'milestone', 'breakthrough', 'first', 'historic', 'award', 'prize'],
    ar: ['إنجاز', 'رقم قياسي', 'تاريخي', 'جائزة', 'أول', 'سابقة']
  },
  controversy: {
    en: ['controversy', 'scandal', 'accusation', 'allegation', 'criticism', 'backlash', 'outrage'],
    ar: ['جدل', 'فضيحة', 'اتهام', 'انتقاد', 'غضب', 'استنكار']
  },
  neutral: {
    en: [],
    ar: []
  }
};

// Sensitivity mapping by domain and event
const SENSITIVITY_MATRIX: Record<ContentDomain, Record<EventType, SensitivityLevel>> = {
  politics: { crisis: 'critical', death: 'critical', celebration: 'medium', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'high', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  economy: { crisis: 'critical', death: 'high', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  health: { crisis: 'critical', death: 'critical', celebration: 'medium', conflict: 'high', announcement: 'high', discovery: 'medium', election: 'low', disaster: 'critical', achievement: 'medium', controversy: 'high', neutral: 'medium' },
  war: { crisis: 'critical', death: 'critical', celebration: 'high', conflict: 'critical', announcement: 'high', discovery: 'medium', election: 'high', disaster: 'critical', achievement: 'medium', controversy: 'critical', neutral: 'high' },
  sports: { crisis: 'medium', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  entertainment: { crisis: 'medium', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  technology: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  environment: { crisis: 'critical', death: 'critical', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'medium', election: 'low', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  society: { crisis: 'high', death: 'critical', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  education: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  general: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'medium', neutral: 'low' }
};

// Country/Region detection
const REGION_KEYWORDS: Record<string, { en: string[], ar: string[] }> = {
  'Libya': { en: ['libya', 'tripoli', 'benghazi', 'libyan'], ar: ['ليبيا', 'طرابلس', 'بنغازي', 'ليبي'] },
  'Egypt': { en: ['egypt', 'cairo', 'egyptian'], ar: ['مصر', 'القاهرة', 'مصري'] },
  'Saudi Arabia': { en: ['saudi', 'riyadh', 'jeddah'], ar: ['السعودية', 'الرياض', 'جدة', 'سعودي'] },
  'UAE': { en: ['uae', 'dubai', 'abu dhabi', 'emirati'], ar: ['الإمارات', 'دبي', 'أبوظبي', 'إماراتي'] },
  'Kuwait': { en: ['kuwait', 'kuwaiti'], ar: ['الكويت', 'كويتي'] },
  'Qatar': { en: ['qatar', 'doha', 'qatari'], ar: ['قطر', 'الدوحة', 'قطري'] },
  'Iraq': { en: ['iraq', 'baghdad', 'iraqi'], ar: ['العراق', 'بغداد', 'عراقي'] },
  'Syria': { en: ['syria', 'damascus', 'syrian'], ar: ['سوريا', 'دمشق', 'سوري'] },
  'Palestine': { en: ['palestine', 'gaza', 'palestinian', 'west bank'], ar: ['فلسطين', 'غزة', 'فلسطيني', 'الضفة'] },
  'Jordan': { en: ['jordan', 'amman', 'jordanian'], ar: ['الأردن', 'عمان', 'أردني'] },
  'Lebanon': { en: ['lebanon', 'beirut', 'lebanese'], ar: ['لبنان', 'بيروت', 'لبناني'] },
  'Morocco': { en: ['morocco', 'rabat', 'moroccan'], ar: ['المغرب', 'الرباط', 'مغربي'] },
  'Algeria': { en: ['algeria', 'algiers', 'algerian'], ar: ['الجزائر', 'جزائري'] },
  'Tunisia': { en: ['tunisia', 'tunis', 'tunisian'], ar: ['تونس', 'تونسي'] },
  'Sudan': { en: ['sudan', 'khartoum', 'sudanese'], ar: ['السودان', 'الخرطوم', 'سوداني'] },
  'Yemen': { en: ['yemen', 'sanaa', 'yemeni'], ar: ['اليمن', 'صنعاء', 'يمني'] },
  'USA': { en: ['usa', 'america', 'american', 'washington', 'new york'], ar: ['أمريكا', 'أمريكي', 'واشنطن', 'نيويورك'] },
  'UK': { en: ['uk', 'britain', 'british', 'london', 'england'], ar: ['بريطانيا', 'بريطاني', 'لندن', 'إنجلترا'] },
  'Global': { en: ['world', 'global', 'international'], ar: ['عالمي', 'دولي', 'العالم'] }
};

/**
 * Detect language of text
 */
function detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
  const arabicPattern = /[\u0600-\u06FF]/;
  const englishPattern = /[a-zA-Z]/;
  
  const hasArabic = arabicPattern.test(text);
  const hasEnglish = englishPattern.test(text);
  
  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'ar';
  return 'en';
}

/**
 * Count keyword matches in text
 */
function countKeywordMatches(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
}

/**
 * Extract matched keywords from text
 */
function extractMatchedKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Classify content domain
 */
function classifyDomain(text: string, language: 'ar' | 'en' | 'mixed'): { domain: ContentDomain; confidence: number; keywords: string[] } {
  const scores: Record<ContentDomain, number> = {} as any;
  const matchedKeywords: string[] = [];
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const langKey = language === 'ar' ? 'ar' : 'en';
    const allKeywords = [...keywords.en, ...keywords.ar];
    const matches = countKeywordMatches(text, allKeywords);
    scores[domain as ContentDomain] = matches;
    matchedKeywords.push(...extractMatchedKeywords(text, allKeywords));
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topDomain = (Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'general') as ContentDomain;
  
  // Calculate confidence (0-100)
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? Math.min(100, Math.round((maxScore / totalMatches) * 100 + maxScore * 10)) : 50;
  
  return {
    domain: maxScore > 0 ? topDomain : 'general',
    confidence,
    keywords: Array.from(new Set(matchedKeywords))
  };
}

/**
 * Classify event type
 */
function classifyEventType(text: string): { eventType: EventType; confidence: number } {
  const scores: Record<EventType, number> = {} as any;
  
  for (const [eventType, keywords] of Object.entries(EVENT_KEYWORDS)) {
    const allKeywords = [...keywords.en, ...keywords.ar];
    scores[eventType as EventType] = countKeywordMatches(text, allKeywords);
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topEvent = (Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'neutral') as EventType;
  
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? Math.min(100, Math.round((maxScore / totalMatches) * 100 + maxScore * 15)) : 50;
  
  return {
    eventType: maxScore > 0 ? topEvent : 'neutral',
    confidence
  };
}

/**
 * Detect region from text
 */
function detectRegion(text: string, selectedCountry?: string): string {
  // If country is explicitly selected, use it
  if (selectedCountry && selectedCountry !== 'ALL') {
    return selectedCountry;
  }
  
  const scores: Record<string, number> = {};
  
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    const allKeywords = [...keywords.en, ...keywords.ar];
    scores[region] = countKeywordMatches(text, allKeywords);
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topRegion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'Global';
  
  return maxScore > 0 ? topRegion : 'Global';
}

/**
 * Main Context Classification Function
 */
export function classifyContext(text: string, selectedCountry?: string): ContextResult {
  const language = detectLanguage(text);
  const { domain, confidence: domainConfidence, keywords } = classifyDomain(text, language);
  const { eventType, confidence: eventConfidence } = classifyEventType(text);
  const region = detectRegion(text, selectedCountry);
  const sensitivity = SENSITIVITY_MATRIX[domain][eventType];
  
  // Overall confidence is weighted average
  const confidence = Math.round((domainConfidence * 0.6) + (eventConfidence * 0.4));
  
  return {
    domain,
    eventType,
    region,
    sensitivity,
    confidence,
    keywords,
    language
  };
}

export default { classifyContext };
