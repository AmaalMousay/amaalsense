/**
 * Multi-language Support System
 * Supports 12 languages with culturally-aware emotional interpretation
 */

export type SupportedLanguage = 
  | 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja' 
  | 'ko' | 'ru' | 'pt' | 'tr' | 'it';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  emotionalContext: Record<string, string>;
}

// Language configurations with cultural context
const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    emotionalContext: {
      hope: 'أمل',
      fear: 'خوف',
      joy: 'فرح',
      sadness: 'حزن',
      anger: 'غضب',
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
export function getLanguageConfig(code: SupportedLanguage): LanguageConfig | null {
  return LANGUAGE_CONFIGS[code] || null;
}

/**
 * Detect language from text
 */
export function detectLanguage(text: string): SupportedLanguage {
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
  targetLanguage: SupportedLanguage
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
  language: SupportedLanguage
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
export function getGreeting(language: SupportedLanguage): string {
  const greetings: Record<SupportedLanguage, string> = {
    ar: 'مرحباً بك في AmalSense',
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
export function getUIStrings(language: SupportedLanguage) {
  const strings: Record<SupportedLanguage, Record<string, string>> = {
    ar: {
      search: 'بحث',
      analyze: 'تحليل',
      feedback: 'تقييم',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
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
  language: SupportedLanguage
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
    interpretation += 'تحليل يأخذ في الاعتبار السياق الثقافي والاجتماعي.';
  } else if (language === 'en') {
    interpretation += 'Analysis considers cultural and social context.';
  }

  return interpretation;
}
