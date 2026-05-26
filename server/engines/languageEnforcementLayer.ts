/**
 * Language Enforcement Layer (Layer 15)
 *
 * Forces response language to match the detected user language.
 */

import { smartChat } from '../_core/llm';

export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';

export interface LanguageEnforcementResult {
  originalLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  originalResponse: string;
  enforcedResponse: string;
  translationNeeded: boolean;
  confidence: number;
  processingTimeMs: number;
}

/**
 * */
export function quickDetectLanguage(text: string): SupportedLanguage {
  //   
  const arabicRegex = /[\u0600-\u06FF]/g;
  const arabicCount = (text.match(arabicRegex) || []).length;
  const arabicRatio = arabicCount / text.length;

  if (arabicRatio > 0.3) {
    return 'ar';
  }

  // : 
  return 'en';
}

/**
 *  */
export async function translateResponse(
  response: string,
  targetLanguage: SupportedLanguage
): Promise<string> {
  try {
    const languageNames: Record<SupportedLanguage, string> = {
      ar: 'Arabic',
      en: 'English',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
      zh: 'Chinese',
      ja: 'Japanese',
    };

    const translatedText = await smartChat(
      `You are a professional translator. Translate the following text to ${languageNames[targetLanguage]}. Maintain the exact meaning and tone. Respond with ONLY the translated text.`,
      response,
      'translation'
    );

    return translatedText || response;
  } catch (error) {
    console.error('[LanguageEnforcement] Translation error:', error);
    return response;
  }
}

/**
 * */
export async function enforceLanguage(
  question: string,
  response: string
): Promise<LanguageEnforcementResult> {
  const startTime = Date.now();

  try {
    //   
    const questionLanguage = quickDetectLanguage(question);
    console.log('[LanguageEnforcement] Question language:', questionLanguage);

    //    const responseLanguage = quickDetectLanguage(response);
    console.log('[LanguageEnforcement] Response language:', responseLanguage);

    //      let enforcedResponse = response;
    let translationNeeded = false;

    if (questionLanguage !== responseLanguage) {
      console.log('[LanguageEnforcement] Translation needed:', {
        from: responseLanguage,
        to: questionLanguage,
      });

      translationNeeded = true;
      enforcedResponse = await translateResponse(response, questionLanguage);
    }

    const processingTime = Date.now() - startTime;

    return {
      originalLanguage: responseLanguage,
      targetLanguage: questionLanguage,
      originalResponse: response,
      enforcedResponse,
      translationNeeded,
      confidence: 95,
      processingTimeMs: processingTime,
    };
  } catch (error) {
    console.error('[LanguageEnforcement] Error enforcing language:', error);

    return {
      originalLanguage: 'en',
      targetLanguage: 'ar',
      originalResponse: response,
      enforcedResponse: response,
      translationNeeded: false,
      confidence: 0,
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 *   
 */
export async function processResponseWithLanguageEnforcement(
  question: string,
  response: string,
  debugMode: boolean = false
): Promise<{
  finalResponse: string;
  language: SupportedLanguage;
  wasTranslated: boolean;
}> {
  const result = await enforceLanguage(question, response);

  if (debugMode) {
    console.log('[LanguageEnforcement] Result:', {
      questionLanguage: result.targetLanguage,
      responseLanguage: result.originalLanguage,
      wasTranslated: result.translationNeeded,
      processingTime: result.processingTimeMs,
    });
  }

  return {
    finalResponse: result.enforcedResponse,
    language: result.targetLanguage,
    wasTranslated: result.translationNeeded,
  };
}


// =============================================================================
// LANGUAGE-AWARE PROMPT HELPERS (merged from languageAwareHandler.ts)
// =============================================================================

import { z } from 'zod';

/**
 * Language Detection and Response Handler
 * Ensures responses are in the same language as the input
 */

export const detectLanguageHeuristic = (text: string): string => {
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  
  // French detection (common French words and accents)
  if (/\b(le|la|les|de|du|et|est|que|pour|avec|par)\b/i.test(text) ||
      /[àâäéèêëïîôöùûüœæç]/i.test(text)) return 'fr';
  
  // Spanish detection
  if (/\b(el|la|los|las|de|y|es|que|para|con|por)\b/i.test(text) ||
      /[áéíóúñüü¿¡]/i.test(text)) return 'es';
  
  // German detection
  if (/\b(der|die|das|und|ist|ein|eine|zu|von|mit)\b/i.test(text) ||
      /[äöüß]/i.test(text)) return 'de';
  
  // Chinese detection
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  
  // Japanese detection
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  
  // Default to English
  return 'en';
};

export const getLanguageSystemPrompt = (language: string): string => {
  const prompts: Record<string, string> = {
    ar: `أنت محلل عاطفي متخصص. تحليلك يجب أن يكون باللغة العربية فقط. \n    أرجع النتيجة بصيغة JSON. تأكد أن جميع الحقول والشروحات بالعربية.`,
    fr: `Vous êtes un analyste émotionnel spécialisé. Votre analyse doit être entièrement en français.
    Répondez en format JSON. Assurez-vous que tous les champs et explications sont en français.`,
    es: `Eres un analista emocional especializado. Tu análisis debe ser completamente en español.
    Responde en formato JSON. Asegúrate de que todos los campos y explicaciones estén en español.`,
    de: `Du bist ein spezialisierter Emotionsanalyst. Deine Analyse muss vollständig auf Deutsch sein.
    Antworte im JSON-Format. Stelle sicher, dass alle Felder und Erklärungen auf Deutsch sind.`,
    zh: `你是一位专业的情感分析师。你的分析必须完全用中文进行。
    以JSON格式回复。确保所有字段和解释都是中文。`,
    ja: `あなたは専門的な感情分析者です。あなたの分析は完全に日本語である必要があります。
    JSON形式で応答してください。すべてのフィールドと説明が日本語であることを確認してください。`,
    en: `You are a specialized emotional analyst. Your analysis must be entirely in English.
    Respond in JSON format. Ensure all fields and explanations are in English.`,
  };
  
  return prompts[language] || prompts['en'];
};

export const getLanguageSpecificPrompt = (language: string, basePrompt: string): string => {
  const languageInstructions: Record<string, string> = {
    ar: `\n\nملاحظة مهمة: أجب باللغة العربية فقط. جميع الشروحات والتحليلات يجب أن تكون بالعربية.`,
    fr: `\n\nRemarque importante: Répondez uniquement en français. Toutes les explications et analyses doivent être en français.`,
    es: `\n\nNota importante: Responde solo en español. Todas las explicaciones y análisis deben estar en español.`,
    de: `\n\nWichtiger Hinweis: Antworten Sie nur auf Deutsch. Alle Erklärungen und Analysen müssen auf Deutsch sein.`,
    zh: `\n\n重要提示：仅用中文回复。所有解释和分析必须用中文进行。`,
    ja: `\n\n重要な注意：日本語でのみ回答してください。すべての説明と分析は日本語である必要があります。`,
    en: `\n\nImportant note: Respond only in English. All explanations and analyses must be in English.`,
  };
  
  return basePrompt + (languageInstructions[language] || languageInstructions['en']);
};

export const validateLanguageResponse = (response: string, expectedLanguage: string): boolean => {
  // Simple validation - check if response contains expected language patterns
  const languagePatterns: Record<string, RegExp> = {
    ar: /[\u0600-\u06FF]/,
    fr: /\b(le|la|les|de|du|et|est|que|pour|avec|par)\b/i,
    es: /\b(el|la|los|las|de|y|es|que|para|con|por)\b/i,
    de: /\b(der|die|das|und|ist|ein|eine|zu|von|mit)\b/i,
    zh: /[\u4E00-\u9FFF]/,
    ja: /[\u3040-\u309F\u30A0-\u30FF]/,
    en: /[a-zA-Z]{3,}/,
  };
  
  const pattern = languagePatterns[expectedLanguage];
  return pattern ? pattern.test(response) : true;
};

export const languageAwareRouter = {
  detectLanguageHeuristic,
  getLanguageSystemPrompt,
  getLanguageSpecificPrompt,
  validateLanguageResponse,
};


// =============================================================================
// MULTI-LANGUAGE UI/CULTURAL HELPERS (merged from multiLanguageSupport.ts)
// =============================================================================

/**
 * Multi-language Support System
 * Supports 12 languages with culturally-aware emotional interpretation
 */

export type UILanguage = 
  | 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja' 
  | 'ko' | 'ru' | 'pt' | 'tr' | 'it';

export interface LanguageConfig {
  code: UILanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  emotionalContext: Record<string, string>;
}

// Language configurations with cultural context
const LANGUAGE_CONFIGS: Record<UILanguage, LanguageConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: `العربية`,
    direction: 'rtl',
    emotionalContext: {
      hope: `أمل`,
      fear: `خوف`,
      joy: `فرح`,
      sadness: `حزن`,
      anger: `غضب`,
    },
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    emotionalContext: {
      hope: 'hope',
      fear: 'fear',
      joy: 'joy',
      sadness: 'sadness',
      anger: 'anger',
    },
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    emotionalContext: {
      hope: 'espoir',
      fear: 'peur',
      joy: 'joie',
      sadness: 'tristesse',
      anger: 'colère',
    },
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    emotionalContext: {
      hope: 'esperanza',
      fear: 'miedo',
      joy: 'alegría',
      sadness: 'tristeza',
      anger: 'ira',
    },
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    emotionalContext: {
      hope: 'Hoffnung',
      fear: 'Angst',
      joy: 'Freude',
      sadness: 'Traurigkeit',
      anger: 'Wut',
    },
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    emotionalContext: {
      hope: '希望',
      fear: '恐惧',
      joy: '喜悦',
      sadness: '悲伤',
      anger: '愤怒',
    },
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    emotionalContext: {
      hope: '希望',
      fear: '恐怖',
      joy: '喜び',
      sadness: '悲しみ',
      anger: '怒り',
    },
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    emotionalContext: {
      hope: '희망',
      fear: '두려움',
      joy: '기쁨',
      sadness: '슬픔',
      anger: '분노',
    },
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    emotionalContext: {
      hope: 'надежда',
      fear: 'страх',
      joy: 'радость',
      sadness: 'грусть',
      anger: 'гнев',
    },
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    emotionalContext: {
      hope: 'esperança',
      fear: 'medo',
      joy: 'alegria',
      sadness: 'tristeza',
      anger: 'ira',
    },
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
    emotionalContext: {
      hope: 'umut',
      fear: 'korku',
      joy: 'sevinç',
      sadness: 'üzüntü',
      anger: 'öfke',
    },
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    emotionalContext: {
      hope: 'speranza',
      fear: 'paura',
      joy: 'gioia',
      sadness: 'tristezza',
      anger: 'rabbia',
    },
  },
};

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGE_CONFIGS);
}

/**
 * Get language config by code
 */
export function getLanguageConfig(code: UILanguage): LanguageConfig | null {
  return LANGUAGE_CONFIGS[code] || null;
}

/**
 * Detect language from text
 */
export function detectUILanguage(text: string): UILanguage {
  // Simple language detection based on character ranges
  const arabicRegex = /[\u0600-\u06FF]/;
  const chineseRegex = /[\u4E00-\u9FFF]/;
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
  const koreanRegex = /[\uAC00-\uD7AF]/;
  const cyrillicRegex = /[\u0400-\u04FF]/;

  if (arabicRegex.test(text)) return 'ar';
  if (chineseRegex.test(text)) return 'zh';
  if (japaneseRegex.test(text)) return 'ja';
  if (koreanRegex.test(text)) return 'ko';
  if (cyrillicRegex.test(text)) return 'ru';

  // Default to English
  return 'en';
}

/**
 * Translate emotional context to target language
 */
export function translateEmotionalContext(
  emotion: string,
  targetLanguage: UILanguage
): string {
  const config = LANGUAGE_CONFIGS[targetLanguage];
  if (!config) return emotion;

  return config.emotionalContext[emotion] || emotion;
}

/**
 * Format text based on language direction
 */
export function formatTextByLanguage(
  text: string,
  language: UILanguage
): { text: string; direction: 'ltr' | 'rtl' } {
  const config = LANGUAGE_CONFIGS[language];
  
  return {
    text,
    direction: config?.direction || 'ltr',
  };
}

/**
 * Get language-specific greeting
 */
export function getGreeting(language: UILanguage): string {
  const greetings: Record<UILanguage, string> = {
    ar: `مرحباً بك في AmalSense`,
    en: 'Welcome to AmalSense',
    fr: 'Bienvenue sur AmalSense',
    es: 'Bienvenido a AmalSense',
    de: 'Willkommen bei AmalSense',
    zh: '欢迎来到 AmalSense',
    ja: 'AmalSenseへようこそ',
    ko: 'AmalSense에 오신 것을 환영합니다',
    ru: 'Добро пожаловать в AmalSense',
    pt: 'Bem-vindo ao AmalSense',
    tr: 'AmalSense\'e Hoş Geldiniz',
    it: 'Benvenuto in AmalSense',
  };

  return greetings[language] || greetings.en;
}

/**
 * Get language-specific UI strings
 */
export function getUIStrings(language: UILanguage) {
  const strings: Record<UILanguage, Record<string, string>> = {
    ar: {
      search: `بحث`,
      analyze: `تحليل`,
      feedback: `تقييم`,
      settings: `الإعدادات`,
      logout: `تسجيل الخروج`,
    },
    en: {
      search: 'Search',
      analyze: 'Analyze',
      feedback: 'Feedback',
      settings: 'Settings',
      logout: 'Logout',
    },
    fr: {
      search: 'Rechercher',
      analyze: 'Analyser',
      feedback: 'Retour',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
    es: {
      search: 'Buscar',
      analyze: 'Analizar',
      feedback: 'Comentarios',
      settings: 'Configuración',
      logout: 'Cerrar sesión',
    },
    de: {
      search: 'Suchen',
      analyze: 'Analysieren',
      feedback: 'Feedback',
      settings: 'Einstellungen',
      logout: 'Abmelden',
    },
    zh: {
      search: '搜索',
      analyze: '分析',
      feedback: '反馈',
      settings: '设置',
      logout: '登出',
    },
    ja: {
      search: '検索',
      analyze: '分析',
      feedback: 'フィードバック',
      settings: '設定',
      logout: 'ログアウト',
    },
    ko: {
      search: '검색',
      analyze: '분석',
      feedback: '피드백',
      settings: '설정',
      logout: '로그아웃',
    },
    ru: {
      search: 'Поиск',
      analyze: 'Анализ',
      feedback: 'Обратная связь',
      settings: 'Настройки',
      logout: 'Выход',
    },
    pt: {
      search: 'Pesquisar',
      analyze: 'Analisar',
      feedback: 'Feedback',
      settings: 'Configurações',
      logout: 'Sair',
    },
    tr: {
      search: 'Ara',
      analyze: 'Analiz Et',
      feedback: 'Geri Bildirim',
      settings: 'Ayarlar',
      logout: 'Çıkış Yap',
    },
    it: {
      search: 'Cerca',
      analyze: 'Analizza',
      feedback: 'Feedback',
      settings: 'Impostazioni',
      logout: 'Esci',
    },
  };

  return strings[language] || strings.en;
}

/**
 * Initialize multi-language support
 */
export function initializeMultiLanguageSupport() {
  console.log('✅ Multi-language support initialized');
  console.log(`📚 Supported languages: ${getSupportedLanguages().length}`);
  getSupportedLanguages().forEach(lang => {
    console.log(`   - ${lang.nativeName} (${lang.code})`);
  });
}

/**
 * Get culturally-aware emotional interpretation
 */
export function getCulturallyAwareInterpretation(
  emotionalMetrics: any,
  contextualFactors: any,
  historicalIndicators: any,
  country: string,
  language: UILanguage
): string {
  // This function provides culturally-aware interpretation of emotions
  // based on the country and language context
  
  const config = LANGUAGE_CONFIGS[language];
  if (!config) return 'Unable to provide interpretation';

  // Build interpretation based on metrics and cultural context
  let interpretation = `Emotional Analysis for ${country} (${config.nativeName}): `;
  
  if (emotionalMetrics?.intensity > 7) {
    interpretation += `High emotional intensity detected. `;
  } else if (emotionalMetrics?.intensity > 4) {
    interpretation += `Moderate emotional intensity. `;
  } else {
    interpretation += `Low emotional intensity. `;
  }

  // Add culturally-aware context
  if (language === 'ar') {
    interpretation += `تحليل يأخذ في الاعتبار السياق الثقافي والاجتماعي.`;
  } else if (language === 'en') {
    interpretation += 'Analysis considers cultural and social context.';
  }

  return interpretation;
}
