/**
 * Context Classifier - Meta-Learning Layer for Global Context Understanding
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module implements a meta-learning approach that:
 * 1. Classifies the context BEFORE emotional analysis
 * 2. Understands cultural and geographical nuances
 * 3. Adjusts emotional weights based on context
 * 
 * Architecture:
 * Text → Context Classification → Cultural Adjustment → Emotional Analysis
 */

/**
 * Event types that affect emotional interpretation
 */
export type EventType = 
  | 'death'           // وفاة، موت
  | 'disaster'        // كارثة، حادث
  | 'celebration'     // احتفال، فرح
  | 'political'       // سياسي
  | 'economic'        // اقتصادي
  | 'sports'          // رياضي
  | 'entertainment'   // ترفيه
  | 'health'          // صحة
  | 'conflict'        // صراع، حرب
  | 'achievement'     // إنجاز
  | 'crime'           // جريمة
  | 'social'          // اجتماعي
  | 'religious'       // ديني
  | 'environmental'   // بيئي
  | 'technology'      // تكنولوجيا
  | 'neutral';        // محايد

/**
 * Cultural regions with distinct emotional expression patterns
 */
export type CulturalRegion = 
  | 'arab_gulf'       // الخليج العربي
  | 'arab_levant'     // الشام
  | 'arab_maghreb'    // المغرب العربي (ليبيا، تونس، الجزائر، المغرب)
  | 'arab_egypt'      // مصر
  | 'western_europe'  // أوروبا الغربية
  | 'eastern_europe'  // أوروبا الشرقية
  | 'north_america'   // أمريكا الشمالية
  | 'latin_america'   // أمريكا اللاتينية
  | 'east_asia'       // شرق آسيا
  | 'south_asia'      // جنوب آسيا
  | 'southeast_asia'  // جنوب شرق آسيا
  | 'africa'          // أفريقيا
  | 'global';         // عالمي

/**
 * Sensitivity levels for content
 */
export type SensitivityLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Context classification result
 */
export interface ContextClassification {
  // Primary event type
  eventType: EventType;
  eventTypeConfidence: number;
  
  // Cultural context
  culturalRegion: CulturalRegion;
  detectedLanguage: string;
  dialect?: string;
  
  // Sensitivity assessment
  sensitivityLevel: SensitivityLevel;
  
  // Emotional adjustment weights
  emotionalAdjustments: {
    joy: number;      // Multiplier for joy (-1 to suppress, 0 neutral, +1 enhance)
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  
  // Keywords detected
  detectedKeywords: string[];
  
  // Metadata
  confidence: number;
  processingTimeMs: number;
}

/**
 * Cultural keyword databases for context detection
 */
const CULTURAL_KEYWORDS = {
  // Arabic death/mourning keywords
  death_arabic: [
    'موت', 'وفاة', 'توفي', 'توفى', 'رحيل', 'فقدان', 'استشهد', 'شهيد', 'شهداء',
    'مقتل', 'قتل', 'قتيل', 'قتلى', 'ضحية', 'ضحايا', 'جنازة', 'دفن', 'اغتيال',
    'رحمه الله', 'رحمها الله', 'انتقل إلى رحمة الله', 'فارق الحياة', 'لفظ أنفاسه',
    'عزاء', 'تعزية', 'مأتم', 'حداد', 'فقيد', 'مرحوم', 'متوفي', 'متوفى'
  ],
  
  // English death keywords
  death_english: [
    'death', 'died', 'dead', 'killed', 'murder', 'murdered', 'funeral', 'burial',
    'assassination', 'assassinated', 'martyred', 'martyr', 'passed away', 'deceased',
    'victim', 'victims', 'fatality', 'fatalities', 'mourning', 'condolences',
    'rest in peace', 'rip', 'tragic loss', 'untimely death'
  ],
  
  // Disaster keywords (Arabic)
  disaster_arabic: [
    'كارثة', 'زلزال', 'فيضان', 'إعصار', 'حريق', 'انفجار', 'حادث', 'تحطم',
    'غرق', 'انهيار', 'طوارئ', 'إجلاء', 'دمار', 'خراب', 'مأساة', 'نكبة'
  ],
  
  // Disaster keywords (English)
  disaster_english: [
    'disaster', 'earthquake', 'flood', 'hurricane', 'fire', 'explosion', 'crash',
    'collapse', 'emergency', 'evacuation', 'destruction', 'tragedy', 'catastrophe',
    'tsunami', 'tornado', 'wildfire', 'devastation'
  ],
  
  // Celebration keywords (Arabic)
  celebration_arabic: [
    'احتفال', 'فرح', 'عيد', 'زفاف', 'عرس', 'فوز', 'نجاح', 'تخرج', 'إنجاز',
    'بطولة', 'تتويج', 'مبروك', 'تهنئة', 'سعادة', 'فرحة', 'بهجة', 'مناسبة سعيدة'
  ],
  
  // Celebration keywords (English)
  celebration_english: [
    'celebration', 'wedding', 'victory', 'success', 'graduation', 'achievement',
    'championship', 'congratulations', 'joy', 'happiness', 'festival', 'party',
    'triumph', 'milestone', 'breakthrough'
  ],
  
  // Conflict keywords (Arabic)
  conflict_arabic: [
    'حرب', 'صراع', 'قتال', 'هجوم', 'غارة', 'قصف', 'اشتباك', 'معركة',
    'عدوان', 'احتلال', 'مقاومة', 'إرهاب', 'تفجير', 'عنف', 'اعتداء'
  ],
  
  // Conflict keywords (English)
  conflict_english: [
    'war', 'conflict', 'battle', 'attack', 'bombing', 'strike', 'clash',
    'invasion', 'occupation', 'terrorism', 'violence', 'assault', 'military'
  ],
  
  // Political keywords (Arabic)
  political_arabic: [
    'انتخابات', 'رئيس', 'حكومة', 'برلمان', 'وزير', 'سياسة', 'حزب',
    'تصويت', 'قانون', 'دستور', 'معارضة', 'سلطة', 'دولة', 'قرار'
  ],
  
  // Political keywords (English)
  political_english: [
    'election', 'president', 'government', 'parliament', 'minister', 'politics',
    'party', 'vote', 'law', 'constitution', 'opposition', 'policy', 'legislation'
  ],
  
  // Economic keywords (Arabic)
  economic_arabic: [
    'اقتصاد', 'سوق', 'أسهم', 'بورصة', 'تضخم', 'ركود', 'نمو', 'استثمار',
    'بنك', 'عملة', 'دولار', 'نفط', 'أسعار', 'تجارة', 'صادرات', 'واردات'
  ],
  
  // Economic keywords (English)
  economic_english: [
    'economy', 'market', 'stocks', 'inflation', 'recession', 'growth', 'investment',
    'bank', 'currency', 'dollar', 'oil', 'prices', 'trade', 'exports', 'imports'
  ],
  
  // Sports keywords (Arabic)
  sports_arabic: [
    'مباراة', 'فريق', 'لاعب', 'هدف', 'بطولة', 'كأس', 'دوري', 'منتخب',
    'فوز', 'خسارة', 'تعادل', 'ملعب', 'مدرب', 'تأهل', 'نهائي'
  ],
  
  // Sports keywords (English)
  sports_english: [
    'match', 'team', 'player', 'goal', 'championship', 'cup', 'league',
    'win', 'loss', 'draw', 'stadium', 'coach', 'final', 'tournament'
  ],
  
  // Health keywords (Arabic)
  health_arabic: [
    'مرض', 'وباء', 'فيروس', 'علاج', 'مستشفى', 'طبيب', 'دواء', 'لقاح',
    'صحة', 'إصابة', 'شفاء', 'عملية', 'جراحة', 'سرطان', 'قلب'
  ],
  
  // Health keywords (English)
  health_english: [
    'disease', 'pandemic', 'virus', 'treatment', 'hospital', 'doctor', 'medicine',
    'vaccine', 'health', 'infection', 'recovery', 'surgery', 'cancer', 'heart'
  ],
  
  // Achievement keywords (Arabic)
  achievement_arabic: [
    'إنجاز', 'نجاح', 'تفوق', 'اكتشاف', 'اختراع', 'جائزة', 'تكريم',
    'رقم قياسي', 'أول', 'تاريخي', 'ريادة', 'ابتكار', 'تميز'
  ],
  
  // Achievement keywords (English)
  achievement_english: [
    'achievement', 'success', 'discovery', 'invention', 'award', 'prize',
    'record', 'first', 'historic', 'breakthrough', 'innovation', 'excellence'
  ],
  
  // Crime keywords (Arabic)
  crime_arabic: [
    'جريمة', 'سرقة', 'اعتقال', 'محاكمة', 'سجن', 'إعدام', 'تهريب',
    'مخدرات', 'فساد', 'رشوة', 'احتيال', 'خطف', 'اغتصاب'
  ],
  
  // Crime keywords (English)
  crime_english: [
    'crime', 'theft', 'arrest', 'trial', 'prison', 'execution', 'smuggling',
    'drugs', 'corruption', 'bribery', 'fraud', 'kidnapping', 'robbery'
  ],
  
  // Religious keywords (Arabic)
  religious_arabic: [
    'رمضان', 'عيد الفطر', 'عيد الأضحى', 'حج', 'عمرة', 'مسجد', 'كنيسة',
    'صلاة', 'صيام', 'زكاة', 'إمام', 'شيخ', 'فتوى', 'دين', 'إسلام', 'مسيحية'
  ],
  
  // Religious keywords (English)
  religious_english: [
    'ramadan', 'eid', 'hajj', 'mosque', 'church', 'prayer', 'fasting',
    'religion', 'faith', 'christmas', 'easter', 'temple', 'synagogue'
  ]
};

/**
 * Language detection patterns
 */
const LANGUAGE_PATTERNS = {
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
  chinese: /[\u4E00-\u9FFF]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
  korean: /[\uAC00-\uD7AF]/,
  cyrillic: /[\u0400-\u04FF]/,
  hebrew: /[\u0590-\u05FF]/,
  thai: /[\u0E00-\u0E7F]/,
  hindi: /[\u0900-\u097F]/,
};

/**
 * Arabic dialect detection patterns
 */
const ARABIC_DIALECT_PATTERNS = {
  libyan: ['هيك', 'توا', 'برشا', 'ياسر', 'هكي', 'كيفاش', 'وين', 'شن', 'هاي'],
  egyptian: ['ازيك', 'عامل ايه', 'كده', 'دلوقتي', 'ليه', 'ازاي', 'فين'],
  gulf: ['شلونك', 'وش', 'زين', 'حيل', 'مرة', 'وايد', 'هالحين'],
  levantine: ['كيفك', 'شو', 'هيك', 'هلق', 'منيح', 'كتير', 'وين'],
  maghrebi: ['واش', 'كيفاش', 'بزاف', 'ديالي', 'راه', 'غادي']
};

/**
 * Detect the primary language of the text
 */
function detectLanguage(text: string): string {
  // Check for Arabic first (most common for this platform)
  if (LANGUAGE_PATTERNS.arabic.test(text)) {
    return 'arabic';
  }
  
  // Check other languages
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  
  // Default to English
  return 'english';
}

/**
 * Detect Arabic dialect if applicable
 */
function detectArabicDialect(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  
  for (const [dialect, patterns] of Object.entries(ARABIC_DIALECT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        return dialect;
      }
    }
  }
  
  return 'standard'; // فصحى
}

/**
 * Detect cultural region based on text content and language
 */
function detectCulturalRegion(text: string, language: string): CulturalRegion {
  const lowerText = text.toLowerCase();
  
  // Arabic regions
  if (language === 'arabic') {
    const dialect = detectArabicDialect(text);
    
    // Check for specific country mentions
    if (lowerText.includes('ليبيا') || lowerText.includes('طرابلس') || lowerText.includes('بنغازي') || dialect === 'libyan') {
      return 'arab_maghreb';
    }
    if (lowerText.includes('مصر') || lowerText.includes('القاهرة') || dialect === 'egyptian') {
      return 'arab_egypt';
    }
    if (lowerText.includes('السعودية') || lowerText.includes('الإمارات') || lowerText.includes('الكويت') || 
        lowerText.includes('قطر') || lowerText.includes('البحرين') || lowerText.includes('عمان') || dialect === 'gulf') {
      return 'arab_gulf';
    }
    if (lowerText.includes('سوريا') || lowerText.includes('لبنان') || lowerText.includes('الأردن') || 
        lowerText.includes('فلسطين') || dialect === 'levantine') {
      return 'arab_levant';
    }
    if (lowerText.includes('تونس') || lowerText.includes('الجزائر') || lowerText.includes('المغرب') || dialect === 'maghrebi') {
      return 'arab_maghreb';
    }
    
    return 'arab_gulf'; // Default for Arabic
  }
  
  // Other regions based on keywords
  if (lowerText.includes('china') || lowerText.includes('japan') || lowerText.includes('korea') ||
      lowerText.includes('الصين') || lowerText.includes('اليابان') || lowerText.includes('كوريا')) {
    return 'east_asia';
  }
  
  if (lowerText.includes('india') || lowerText.includes('pakistan') || lowerText.includes('bangladesh') ||
      lowerText.includes('الهند') || lowerText.includes('باكستان')) {
    return 'south_asia';
  }
  
  if (lowerText.includes('usa') || lowerText.includes('america') || lowerText.includes('canada') ||
      lowerText.includes('أمريكا') || lowerText.includes('كندا')) {
    return 'north_america';
  }
  
  if (lowerText.includes('brazil') || lowerText.includes('mexico') || lowerText.includes('argentina') ||
      lowerText.includes('البرازيل') || lowerText.includes('المكسيك')) {
    return 'latin_america';
  }
  
  if (lowerText.includes('uk') || lowerText.includes('britain') || lowerText.includes('france') || 
      lowerText.includes('germany') || lowerText.includes('بريطانيا') || lowerText.includes('فرنسا') || 
      lowerText.includes('ألمانيا')) {
    return 'western_europe';
  }
  
  if (lowerText.includes('russia') || lowerText.includes('ukraine') || lowerText.includes('poland') ||
      lowerText.includes('روسيا') || lowerText.includes('أوكرانيا')) {
    return 'eastern_europe';
  }
  
  return 'global';
}

/**
 * Classify the event type based on keywords
 */
function classifyEventType(text: string): { type: EventType; confidence: number; keywords: string[] } {
  const lowerText = text.toLowerCase();
  const detectedKeywords: string[] = [];
  
  // Check each category and count matches
  const scores: Record<EventType, number> = {
    death: 0,
    disaster: 0,
    celebration: 0,
    political: 0,
    economic: 0,
    sports: 0,
    entertainment: 0,
    health: 0,
    conflict: 0,
    achievement: 0,
    crime: 0,
    social: 0,
    religious: 0,
    environmental: 0,
    technology: 0,
    neutral: 0
  };
  
  // Death detection (highest priority for accuracy)
  for (const keyword of CULTURAL_KEYWORDS.death_arabic) {
    if (text.includes(keyword)) {
      scores.death += 3; // Higher weight for Arabic death keywords
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.death_english) {
    if (lowerText.includes(keyword)) {
      scores.death += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Disaster detection
  for (const keyword of CULTURAL_KEYWORDS.disaster_arabic) {
    if (text.includes(keyword)) {
      scores.disaster += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.disaster_english) {
    if (lowerText.includes(keyword)) {
      scores.disaster += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Conflict detection
  for (const keyword of CULTURAL_KEYWORDS.conflict_arabic) {
    if (text.includes(keyword)) {
      scores.conflict += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.conflict_english) {
    if (lowerText.includes(keyword)) {
      scores.conflict += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Crime detection
  for (const keyword of CULTURAL_KEYWORDS.crime_arabic) {
    if (text.includes(keyword)) {
      scores.crime += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.crime_english) {
    if (lowerText.includes(keyword)) {
      scores.crime += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Celebration detection
  for (const keyword of CULTURAL_KEYWORDS.celebration_arabic) {
    if (text.includes(keyword)) {
      scores.celebration += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.celebration_english) {
    if (lowerText.includes(keyword)) {
      scores.celebration += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Achievement detection
  for (const keyword of CULTURAL_KEYWORDS.achievement_arabic) {
    if (text.includes(keyword)) {
      scores.achievement += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.achievement_english) {
    if (lowerText.includes(keyword)) {
      scores.achievement += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Political detection
  for (const keyword of CULTURAL_KEYWORDS.political_arabic) {
    if (text.includes(keyword)) {
      scores.political += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.political_english) {
    if (lowerText.includes(keyword)) {
      scores.political += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Economic detection
  for (const keyword of CULTURAL_KEYWORDS.economic_arabic) {
    if (text.includes(keyword)) {
      scores.economic += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.economic_english) {
    if (lowerText.includes(keyword)) {
      scores.economic += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Sports detection
  for (const keyword of CULTURAL_KEYWORDS.sports_arabic) {
    if (text.includes(keyword)) {
      scores.sports += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.sports_english) {
    if (lowerText.includes(keyword)) {
      scores.sports += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Health detection
  for (const keyword of CULTURAL_KEYWORDS.health_arabic) {
    if (text.includes(keyword)) {
      scores.health += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.health_english) {
    if (lowerText.includes(keyword)) {
      scores.health += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Religious detection
  for (const keyword of CULTURAL_KEYWORDS.religious_arabic) {
    if (text.includes(keyword)) {
      scores.religious += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.religious_english) {
    if (lowerText.includes(keyword)) {
      scores.religious += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Find the highest scoring event type
  let maxScore = 0;
  let eventType: EventType = 'neutral';
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      eventType = type as EventType;
    }
  }
  
  // Calculate confidence based on score
  const totalKeywords = detectedKeywords.length;
  const confidence = totalKeywords > 0 ? Math.min(0.95, 0.5 + (maxScore * 0.1)) : 0.3;
  
  return {
    type: eventType,
    confidence,
    keywords: Array.from(new Set(detectedKeywords)) // Remove duplicates
  };
}

/**
 * Get emotional adjustments based on event type and cultural region
 */
function getEmotionalAdjustments(
  eventType: EventType, 
  culturalRegion: CulturalRegion
): ContextClassification['emotionalAdjustments'] {
  // Default neutral adjustments
  const adjustments = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0
  };
  
  // Event-based adjustments
  switch (eventType) {
    case 'death':
      adjustments.joy = -0.9;      // Strongly suppress joy
      adjustments.sadness = 0.8;   // Enhance sadness
      adjustments.hope = -0.5;     // Reduce hope
      adjustments.fear = 0.2;      // Slight fear increase
      break;
      
    case 'disaster':
      adjustments.joy = -0.8;
      adjustments.fear = 0.7;
      adjustments.sadness = 0.6;
      adjustments.hope = -0.3;
      adjustments.anger = 0.3;
      break;
      
    case 'conflict':
      adjustments.joy = -0.7;
      adjustments.fear = 0.6;
      adjustments.anger = 0.5;
      adjustments.sadness = 0.4;
      adjustments.hope = -0.4;
      break;
      
    case 'crime':
      adjustments.joy = -0.6;
      adjustments.fear = 0.5;
      adjustments.anger = 0.6;
      adjustments.sadness = 0.3;
      break;
      
    case 'celebration':
      adjustments.joy = 0.8;
      adjustments.hope = 0.6;
      adjustments.sadness = -0.5;
      adjustments.fear = -0.3;
      break;
      
    case 'achievement':
      adjustments.joy = 0.7;
      adjustments.hope = 0.7;
      adjustments.curiosity = 0.4;
      adjustments.sadness = -0.4;
      break;
      
    case 'sports':
      adjustments.curiosity = 0.5;
      // Sports can be positive or negative, keep neutral
      break;
      
    case 'political':
      adjustments.curiosity = 0.4;
      adjustments.fear = 0.2;
      adjustments.anger = 0.2;
      break;
      
    case 'economic':
      adjustments.curiosity = 0.3;
      adjustments.fear = 0.2;
      break;
      
    case 'health':
      adjustments.fear = 0.3;
      adjustments.hope = 0.2;
      adjustments.curiosity = 0.3;
      break;
      
    case 'religious':
      // Religious events vary greatly, keep mostly neutral
      adjustments.hope = 0.3;
      break;
  }
  
  // Cultural adjustments (subtle modifications based on region)
  // Arab cultures tend to express emotions more openly
  if (culturalRegion.startsWith('arab_')) {
    // Amplify emotional expression slightly
    Object.keys(adjustments).forEach(key => {
      const k = key as keyof typeof adjustments;
      adjustments[k] *= 1.1;
    });
  }
  
  // East Asian cultures may express emotions more subtly
  if (culturalRegion === 'east_asia') {
    Object.keys(adjustments).forEach(key => {
      const k = key as keyof typeof adjustments;
      adjustments[k] *= 0.9;
    });
  }
  
  // Clamp all values to -1 to 1 range
  Object.keys(adjustments).forEach(key => {
    const k = key as keyof typeof adjustments;
    adjustments[k] = Math.max(-1, Math.min(1, adjustments[k]));
  });
  
  return adjustments;
}

/**
 * Determine sensitivity level based on event type
 */
function determineSensitivity(eventType: EventType): SensitivityLevel {
  switch (eventType) {
    case 'death':
    case 'disaster':
    case 'conflict':
      return 'critical';
      
    case 'crime':
    case 'health':
    case 'political':
      return 'high';
      
    case 'economic':
    case 'social':
    case 'religious':
      return 'medium';
      
    default:
      return 'low';
  }
}

/**
 * Main context classification function
 * This is the Meta-Learning layer that understands context before emotional analysis
 */
export async function classifyContext(text: string): Promise<ContextClassification> {
  const startTime = Date.now();
  
  // Step 1: Detect language
  const detectedLanguage = detectLanguage(text);
  
  // Step 2: Detect dialect (for Arabic)
  const dialect = detectedLanguage === 'arabic' ? detectArabicDialect(text) : undefined;
  
  // Step 3: Detect cultural region
  const culturalRegion = detectCulturalRegion(text, detectedLanguage);
  
  // Step 4: Classify event type
  const { type: eventType, confidence: eventTypeConfidence, keywords } = classifyEventType(text);
  
  // Step 5: Get emotional adjustments
  const emotionalAdjustments = getEmotionalAdjustments(eventType, culturalRegion);
  
  // Step 6: Determine sensitivity
  const sensitivityLevel = determineSensitivity(eventType);
  
  const processingTimeMs = Date.now() - startTime;
  
  console.log(`[ContextClassifier] Classified: ${eventType} (${(eventTypeConfidence * 100).toFixed(1)}%) | Region: ${culturalRegion} | Language: ${detectedLanguage}${dialect ? ` (${dialect})` : ''}`);
  
  return {
    eventType,
    eventTypeConfidence,
    culturalRegion,
    detectedLanguage,
    dialect,
    sensitivityLevel,
    emotionalAdjustments,
    detectedKeywords: keywords,
    confidence: eventTypeConfidence,
    processingTimeMs
  };
}

/**
 * Apply context adjustments to emotion values
 * This modifies the raw emotions based on context understanding
 */
export function applyContextAdjustments(
  emotions: { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number },
  context: ContextClassification
): typeof emotions {
  const adjusted = { ...emotions };
  const adj = context.emotionalAdjustments;
  
  // Apply adjustments with a blend factor based on confidence
  const blendFactor = context.confidence;
  
  // For suppression (negative adjustment), we reduce the value
  // For enhancement (positive adjustment), we increase the value
  adjusted.joy = emotions.joy * (1 + adj.joy * blendFactor);
  adjusted.fear = emotions.fear * (1 + adj.fear * blendFactor);
  adjusted.anger = emotions.anger * (1 + adj.anger * blendFactor);
  adjusted.sadness = emotions.sadness * (1 + adj.sadness * blendFactor);
  adjusted.hope = emotions.hope * (1 + adj.hope * blendFactor);
  adjusted.curiosity = emotions.curiosity * (1 + adj.curiosity * blendFactor);
  
  // For critical events like death, apply hard limits
  if (context.eventType === 'death' && context.confidence > 0.6) {
    adjusted.joy = Math.min(adjusted.joy, 15);
    adjusted.hope = Math.min(adjusted.hope, 30);
    adjusted.sadness = Math.max(adjusted.sadness, 70);
  }
  
  if (context.eventType === 'disaster' && context.confidence > 0.6) {
    adjusted.joy = Math.min(adjusted.joy, 20);
    adjusted.fear = Math.max(adjusted.fear, 60);
    adjusted.sadness = Math.max(adjusted.sadness, 50);
  }
  
  if (context.eventType === 'celebration' && context.confidence > 0.6) {
    adjusted.joy = Math.max(adjusted.joy, 60);
    adjusted.hope = Math.max(adjusted.hope, 50);
    adjusted.sadness = Math.min(adjusted.sadness, 30);
  }
  
  // Clamp all values to 0-100 range
  Object.keys(adjusted).forEach(key => {
    const k = key as keyof typeof adjusted;
    adjusted[k] = Math.max(0, Math.min(100, adjusted[k]));
  });
  
  return adjusted;
}

export default {
  classifyContext,
  applyContextAdjustments,
  CULTURAL_KEYWORDS
};
