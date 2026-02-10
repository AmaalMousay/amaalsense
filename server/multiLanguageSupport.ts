/**
 * Multi-Language Support System
 * 
 * Handles Arabic and English language support with culturally-aware emotional interpretation
 */

export type Language = 'ar' | 'en';

export interface LanguageContext {
  language: Language;
  culturalRegion: string;
  emotionalBaseline: Record<string, number>;
  intensityMultiplier: number;
}

export interface MultilingualResponse {
  ar: string;
  en: string;
  language: Language;
  culturalContext: string;
}

/**
 * Emotional intensity multipliers by language and culture
 * 
 * Arabic (especially MENA region) tends to use more emotionally intense language
 * English tends to be more reserved and analytical
 */
const EMOTIONAL_INTENSITY: Record<Language, Record<string, number>> = {
  ar: {
    fear: 1.3,      // Arabic expresses fear more intensely
    hope: 1.2,      // Hope is expressed more optimistically
    anger: 1.25,    // Anger is expressed more passionately
    sadness: 1.2,   // Sadness is more dramatically expressed
    joy: 1.15,      // Joy is celebrated more openly
    curiosity: 1.0, // Curiosity is neutral
  },
  en: {
    fear: 0.9,      // English is more measured
    hope: 0.95,     // Hope is expressed more cautiously
    anger: 0.85,    // Anger is more controlled
    sadness: 0.9,   // Sadness is more subdued
    joy: 0.95,      // Joy is more restrained
    curiosity: 1.0, // Curiosity is neutral
  },
};

/**
 * Cultural context multipliers
 */
const CULTURAL_CONTEXT_MULTIPLIERS: Record<string, Record<string, number>> = {
  'MENA': {
    fear: 1.2,
    hope: 0.9,
    anger: 1.15,
    sadness: 1.1,
  },
  'Africa': {
    fear: 1.1,
    hope: 1.0,
    anger: 1.0,
    sadness: 1.0,
  },
  'Europe': {
    fear: 0.8,
    hope: 1.1,
    anger: 0.9,
    sadness: 0.85,
  },
  'Asia': {
    fear: 0.95,
    hope: 1.05,
    anger: 0.9,
    sadness: 0.95,
  },
  'Americas': {
    fear: 0.85,
    hope: 1.15,
    anger: 0.95,
    sadness: 0.9,
  },
};

/**
 * Emotional intensity descriptions in different languages
 */
const INTENSITY_DESCRIPTIONS: Record<Language, Record<string, string[]>> = {
  ar: {
    veryLow: ['ضعيف جداً', 'بالكاد ملحوظ', 'شبه معدوم'],
    low: ['ضعيف', 'محدود', 'طفيف'],
    moderate: ['متوسط', 'معتدل', 'متوازن'],
    high: ['عالي', 'قوي', 'ملحوظ'],
    veryHigh: ['عالي جداً', 'شديد', 'غالب'],
    extreme: ['متطرف', 'قاسي', 'حاد'],
  },
  en: {
    veryLow: ['very low', 'barely noticeable', 'minimal'],
    low: ['low', 'limited', 'slight'],
    moderate: ['moderate', 'balanced', 'average'],
    high: ['high', 'strong', 'notable'],
    veryHigh: ['very high', 'intense', 'dominant'],
    extreme: ['extreme', 'severe', 'acute'],
  },
};

/**
 * Trend descriptions in different languages
 */
const TREND_DESCRIPTIONS: Record<Language, Record<string, string>> = {
  ar: {
    increasing: 'في ارتفاع',
    decreasing: 'في انخفاض',
    stable: 'مستقر',
    improving: 'يتحسن',
    worsening: 'يتدهور',
    volatile: 'متقلب',
  },
  en: {
    increasing: 'increasing',
    decreasing: 'decreasing',
    stable: 'stable',
    improving: 'improving',
    worsening: 'worsening',
    volatile: 'volatile',
  },
};

/**
 * Get language context
 */
export function getLanguageContext(language: Language, culturalRegion: string = 'MENA'): LanguageContext {
  const emotionalBaseline = CULTURAL_CONTEXT_MULTIPLIERS[culturalRegion] || CULTURAL_CONTEXT_MULTIPLIERS['MENA'];
  const intensityMultiplier = EMOTIONAL_INTENSITY[language].fear; // Use fear as reference
  
  return {
    language,
    culturalRegion,
    emotionalBaseline,
    intensityMultiplier,
  };
}

/**
 * Adjust emotional values based on language and culture
 */
export function adjustEmotionalValues(
  emotions: Record<string, number>,
  language: Language,
  culturalRegion: string = 'MENA'
): Record<string, number> {
  const adjusted: Record<string, number> = {};
  const langMultipliers = EMOTIONAL_INTENSITY[language];
  const culturalMultipliers = CULTURAL_CONTEXT_MULTIPLIERS[culturalRegion] || CULTURAL_CONTEXT_MULTIPLIERS['MENA'];
  
  for (const [emotion, value] of Object.entries(emotions)) {
    const langFactor = langMultipliers[emotion] || 1.0;
    const culturalFactor = culturalMultipliers[emotion] || 1.0;
    adjusted[emotion] = value * langFactor * culturalFactor;
  }
  
  return adjusted;
}

/**
 * Get intensity description
 */
export function getIntensityDescription(value: number, language: Language = 'en'): string {
  const descriptions = INTENSITY_DESCRIPTIONS[language];
  
  if (value < 10) return descriptions.veryLow[0];
  if (value < 30) return descriptions.low[0];
  if (value < 50) return descriptions.moderate[0];
  if (value < 70) return descriptions.high[0];
  if (value < 90) return descriptions.veryHigh[0];
  return descriptions.extreme[0];
}

/**
 * Get trend description
 */
export function getTrendDescription(trend: string, language: Language = 'en'): string {
  return TREND_DESCRIPTIONS[language][trend] || trend;
}

/**
 * Translate emotional index names
 */
const INDEX_NAMES: Record<Language, Record<string, string>> = {
  ar: {
    gmi: 'مؤشر المزاج العام',
    cfi: 'مؤشر الخوف الجماعي',
    hri: 'مؤشر الأمل والمرونة',
    aci: 'مؤشر الغضب والأزمة',
    sdi: 'مؤشر الحزن واليأس',
  },
  en: {
    gmi: 'Global Mood Index',
    cfi: 'Collective Fear Index',
    hri: 'Hope & Resilience Index',
    aci: 'Anger & Crisis Index',
    sdi: 'Sadness & Despair Index',
  },
};

/**
 * Get index name in specified language
 */
export function getIndexName(index: string, language: Language = 'en'): string {
  return INDEX_NAMES[language][index] || index;
}

/**
 * Format emotional analysis for display in different languages
 */
export function formatEmotionalAnalysis(
  emotions: Record<string, number>,
  language: Language = 'en',
  culturalRegion: string = 'MENA'
): MultilingualResponse {
  const adjusted = adjustEmotionalValues(emotions, language, culturalRegion);
  
  const ar = `
## تحليل المشاعر

**السياق الثقافي:** ${culturalRegion}

${Object.entries(adjusted).map(([emotion, value]) => 
  `- **${emotion}:** ${getIntensityDescription(value, 'ar')} (${Math.round(value)}%)`
).join('\n')}

**الملاحظات:**
- تم تعديل القيم بناءً على السياق الثقافي والمنطقة الجغرافية
- اللغة العربية تميل إلى التعبير العاطفي الأكثر كثافة
- يتم احترام الفروقات الثقافية في التفسير العاطفي
  `;
  
  const en = `
## Emotional Analysis

**Cultural Context:** ${culturalRegion}

${Object.entries(adjusted).map(([emotion, value]) => 
  `- **${emotion}:** ${getIntensityDescription(value, 'en')} (${Math.round(value)}%)`
).join('\n')}

**Notes:**
- Values adjusted based on cultural context and geographic region
- Arabic language tends to express emotions more intensely
- Cultural differences in emotional interpretation are respected
  `;
  
  return {
    ar,
    en,
    language,
    culturalContext: culturalRegion,
  };
}

/**
 * Translate analysis results to different language
 */
export function translateAnalysisResults(
  results: Record<string, any>,
  targetLanguage: Language
): Record<string, any> {
  const translated: Record<string, any> = { ...results };
  
  // Translate index names
  if (translated.indices) {
    for (const [key] of Object.entries(translated.indices)) {
      translated[`${key}_name`] = getIndexName(key, targetLanguage);
    }
  }
  
  // Translate trend descriptions
  if (translated.trends) {
    for (const [key, trend] of Object.entries(translated.trends)) {
      if (typeof trend === 'object' && trend !== null && 'trend' in trend) {
        (trend as any).trend_description = getTrendDescription((trend as any).trend, targetLanguage);
      }
    }
  }
  
  return translated;
}

/**
 * Get culturally-aware emotional interpretation
 */
export function getCulturallyAwareInterpretation(
  gmi: number,
  cfi: number,
  hri: number,
  culturalRegion: string = 'MENA',
  language: Language = 'ar'
): string {
  const context = getLanguageContext(language, culturalRegion);
  
  let interpretation = '';
  
  if (language === 'ar') {
    if (gmi > 50) {
      interpretation += 'المزاج العام إيجابي وتفاؤلي. ';
    } else if (gmi < -50) {
      interpretation += 'المزاج العام سلبي وقاتم. ';
    } else {
      interpretation += 'المزاج العام متوازن ومحايد. ';
    }
    
    if (cfi > 70) {
      interpretation += 'مستويات الخوف عالية جداً وتثير القلق. ';
    } else if (cfi > 50) {
      interpretation += 'هناك مستويات معتدلة من الخوف والقلق. ';
    }
    
    if (hri > 70) {
      interpretation += 'الأمل والمرونة قويان والمجتمع متفائل. ';
    } else if (hri < 30) {
      interpretation += 'الأمل والمرونة ضعيفان والمجتمع متشائم. ';
    }
  } else {
    if (gmi > 50) {
      interpretation += 'Overall mood is positive and optimistic. ';
    } else if (gmi < -50) {
      interpretation += 'Overall mood is negative and pessimistic. ';
    } else {
      interpretation += 'Overall mood is balanced and neutral. ';
    }
    
    if (cfi > 70) {
      interpretation += 'Fear levels are very high and concerning. ';
    } else if (cfi > 50) {
      interpretation += 'There are moderate levels of fear and anxiety. ';
    }
    
    if (hri > 70) {
      interpretation += 'Hope and resilience are strong and the community is optimistic. ';
    } else if (hri < 30) {
      interpretation += 'Hope and resilience are weak and the community is pessimistic. ';
    }
  }
  
  return interpretation;
}
