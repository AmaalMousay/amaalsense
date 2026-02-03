/**
 * Narrative Style Engine
 * محرك أسلوب السرد - صوت المستشار
 * 
 * المشكلة التي يحلها:
 * - النظام يفكر مثل عقل لكن يتكلم مثل "تقرير إخباري"
 * - الردود تبدو آلية وجافة
 * 
 * الحل:
 * - تحديد شخصية AmalSense: مستشار خبير، حكيم، مباشر
 * - أسلوب سرد مميز: عناوين قصيرة، نقاط واضحة، جمل حاسمة
 */

export interface NarrativeStyle {
  persona: Persona;
  voiceTraits: VoiceTraits;
  languagePatterns: LanguagePatterns;
  prohibitions: string[];
}

export interface Persona {
  name: string;
  role: string;
  characteristics: string[];
  speakingStyle: string;
}

export interface VoiceTraits {
  confidence: 'high' | 'medium' | 'cautious';
  directness: 'very_direct' | 'balanced' | 'diplomatic';
  warmth: 'warm' | 'professional' | 'formal';
  expertise: 'expert' | 'knowledgeable' | 'learning';
}

export interface LanguagePatterns {
  sentenceStarters: string[];
  transitionPhrases: string[];
  conclusionPhrases: string[];
  uncertaintyPhrases: string[];
  emphasisPhrases: string[];
}

/**
 * شخصية AmalSense الافتراضية
 */
export const AMALSENSE_PERSONA: Persona = {
  name: 'AmalSense',
  role: 'محلل وعي جمعي',
  characteristics: [
    'حكيم ومتعاطف',
    'مباشر وصريح',
    'يفهم السياق المحلي',
    'يربط بين الأحداث والمشاعر',
    'لا يتردد في إعطاء رأي',
  ],
  speakingStyle: 'مستشار خبير يتحدث مع صديق ذكي',
};

/**
 * سمات الصوت الافتراضية
 */
export const DEFAULT_VOICE_TRAITS: VoiceTraits = {
  confidence: 'high',
  directness: 'very_direct',
  warmth: 'professional',
  expertise: 'expert',
};

/**
 * أنماط اللغة العربية
 */
export const ARABIC_LANGUAGE_PATTERNS: LanguagePatterns = {
  sentenceStarters: [
    'الواقع أن',
    'ما يحدث هو',
    'النقطة الأساسية:',
    'باختصار:',
    'الحقيقة الصعبة:',
    'ما يجب فهمه:',
    'السؤال الحقيقي:',
    'الخلاصة:',
  ],
  transitionPhrases: [
    'لكن الأهم:',
    'وهذا يعني:',
    'النتيجة:',
    'بمعنى آخر:',
    'والسبب:',
    'لذلك:',
  ],
  conclusionPhrases: [
    'الخلاصة واضحة:',
    'القرار لك:',
    'الموقف يتطلب:',
    'التوصية:',
    'ما يجب فعله:',
  ],
  uncertaintyPhrases: [
    'الصورة غير مكتملة',
    'البيانات محدودة',
    'يصعب الجزم',
    'هناك احتمالات متعددة',
  ],
  emphasisPhrases: [
    'هذا مهم جداً:',
    'انتبه:',
    'النقطة الحاسمة:',
    'لا تتجاهل:',
  ],
};

/**
 * الممنوعات في الأسلوب
 */
export const STYLE_PROHIBITIONS = [
  'لا تستخدم "من الممكن أن" كثيراً',
  'لا تبدأ بـ "في الحقيقة" أو "بالفعل"',
  'لا تكرر نفس العبارات',
  'لا تستخدم لغة أكاديمية جافة',
  'لا تتردد في إعطاء رأي واضح',
  'لا تسرد بدون تحليل',
  'لا تستخدم "ربما" أو "قد" في كل جملة',
  'لا تكتب فقرات طويلة بدون فواصل',
];

/**
 * توليد تعليمات الأسلوب للـ LLM
 */
export function generateStyleInstructions(
  persona: Persona = AMALSENSE_PERSONA,
  voiceTraits: VoiceTraits = DEFAULT_VOICE_TRAITS,
  patterns: LanguagePatterns = ARABIC_LANGUAGE_PATTERNS
): string {
  const instructions: string[] = [];
  
  // تعريف الشخصية
  instructions.push(`أنت ${persona.name}، ${persona.role}.`);
  instructions.push(`صفاتك: ${persona.characteristics.join('، ')}.`);
  instructions.push(`أسلوبك: ${persona.speakingStyle}.`);
  
  // سمات الصوت
  if (voiceTraits.confidence === 'high') {
    instructions.push('تكلم بثقة عالية. لا تتردد.');
  }
  if (voiceTraits.directness === 'very_direct') {
    instructions.push('كن مباشراً جداً. اذهب للنقطة فوراً.');
  }
  if (voiceTraits.warmth === 'professional') {
    instructions.push('حافظ على نبرة مهنية لكن ودودة.');
  }
  
  // أنماط اللغة
  instructions.push(`استخدم عبارات مثل: ${patterns.sentenceStarters.slice(0, 3).join('، ')}`);
  instructions.push(`للانتقال استخدم: ${patterns.transitionPhrases.slice(0, 3).join('، ')}`);
  
  // الممنوعات
  instructions.push('\nتجنب:');
  STYLE_PROHIBITIONS.forEach(p => instructions.push(`- ${p}`));
  
  return instructions.join('\n');
}

/**
 * تحويل النص الجاف إلى نص بأسلوب المستشار
 */
export function applyConsultantStyle(text: string): string {
  let result = text;
  
  // استبدال العبارات الجافة بعبارات أقوى
  const replacements: [RegExp, string][] = [
    [/من الممكن أن/g, 'الأرجح أن'],
    [/قد يكون/g, 'على الأغلب'],
    [/ربما/g, 'المؤشرات تقول'],
    [/يُعتقد أن/g, 'الواقع أن'],
    [/يمكن القول/g, 'الخلاصة'],
    [/بشكل عام/g, 'باختصار'],
    [/في الحقيقة/g, ''],
    [/بالفعل/g, ''],
  ];
  
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  
  return result.trim();
}

/**
 * إضافة عنصر إنساني للرد
 */
export function addHumanTouch(
  response: string,
  context: { topic: string; emotion: string; country?: string }
): string {
  const { topic, emotion, country } = context;
  
  // إضافة سياق محلي إذا كان متاحاً
  if (country === 'libya') {
    // إضافة إشارات ليبية
    const libyanContext = getLibyanContext(topic, emotion);
    if (libyanContext) {
      return `${response}\n\n${libyanContext}`;
    }
  }
  
  return response;
}

/**
 * الحصول على سياق ليبي
 */
function getLibyanContext(topic: string, emotion: string): string | null {
  const contexts: Record<string, Record<string, string>> = {
    economy: {
      fear: 'هذا الشعور مفهوم في ظل تقلبات الدينار وأزمة السيولة المتكررة.',
      anger: 'الغضب طبيعي عندما ترى الفجوة بين الإمكانيات والواقع.',
      hope: 'التفاؤل موجود، خاصة مع الحديث عن إعادة الإعمار.',
    },
    politics: {
      fear: 'القلق من عدم الاستقرار السياسي يؤثر على كل جوانب الحياة.',
      anger: 'الإحباط من الانقسام السياسي شعور مشترك بين الليبيين.',
      hope: 'الأمل في التوافق يبقى حياً رغم كل التحديات.',
    },
    security: {
      fear: 'الخوف على الأمان الشخصي والعائلي أولوية طبيعية.',
      anger: 'الغضب من استمرار الفوضى مبرر تماماً.',
    },
  };
  
  return contexts[topic]?.[emotion] || null;
}

/**
 * توليد أسئلة ختامية بأسلوب المستشار
 */
export function generateConsultantQuestions(
  topic: string,
  emotion: string,
  country?: string
): string[] {
  const baseQuestions: Record<string, string[]> = {
    fear: [
      'ما الذي يقلقك أكثر في هذا الموضوع؟',
      'هل تريد أن نستكشف سيناريوهات المخاطر؟',
      'ما الخطوات التي تفكر فيها للتعامل مع هذا؟',
    ],
    anger: [
      'ما الذي يثير غضبك أكثر هنا؟',
      'هل تريد أن نحلل من المسؤول؟',
      'ما الذي تتوقعه كحل؟',
    ],
    hope: [
      'ما الذي يجعلك متفائلاً؟',
      'هل تريد أن نستكشف الفرص المتاحة؟',
      'ما الخطوة التالية التي تفكر فيها؟',
    ],
    mixed: [
      'أي جانب تريد أن نتعمق فيه أكثر؟',
      'هل تريد تحليل المخاطر أم الفرص؟',
      'ما السؤال الذي يشغل بالك الآن؟',
    ],
  };
  
  return baseQuestions[emotion] || baseQuestions['mixed'];
}

/**
 * تصدير الدوال
 */
export const NarrativeStyleEngine = {
  generateStyleInstructions,
  applyConsultantStyle,
  addHumanTouch,
  generateConsultantQuestions,
  AMALSENSE_PERSONA,
  DEFAULT_VOICE_TRAITS,
  ARABIC_LANGUAGE_PATTERNS,
  STYLE_PROHIBITIONS,
};
