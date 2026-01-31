/**
 * Multilingual Sentiment Analyzer
 * 
 * Supports emotion analysis in multiple languages:
 * - Arabic (ar) - with dialects
 * - English (en)
 * - French (fr)
 * - Spanish (es)
 * - German (de)
 * - Chinese (zh)
 * - Japanese (ja)
 * - Portuguese (pt)
 * - Russian (ru)
 * - Hindi (hi)
 */

// Language profiles with cultural context
export interface LanguageProfile {
  code: string;
  name: string;
  nativeName: string;
  textDirection: "ltr" | "rtl";
  culturalRegion: string;
  expressionStyle: "direct" | "indirect" | "reserved" | "expressive";
  sentimentAdjustment: number; // -50 to +50
}

export const LANGUAGE_PROFILES: Record<string, LanguageProfile> = {
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    textDirection: "rtl",
    culturalRegion: "arab",
    expressionStyle: "expressive",
    sentimentAdjustment: 0,
  },
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    textDirection: "ltr",
    culturalRegion: "western",
    expressionStyle: "direct",
    sentimentAdjustment: 0,
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    textDirection: "ltr",
    culturalRegion: "western",
    expressionStyle: "expressive",
    sentimentAdjustment: 5, // French tends to be slightly more dramatic
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    textDirection: "ltr",
    culturalRegion: "latin",
    expressionStyle: "expressive",
    sentimentAdjustment: 10, // Spanish is more emotionally expressive
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    textDirection: "ltr",
    culturalRegion: "western",
    expressionStyle: "direct",
    sentimentAdjustment: -5, // German tends to be more reserved
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    textDirection: "ltr",
    culturalRegion: "asian",
    expressionStyle: "indirect",
    sentimentAdjustment: -10, // Chinese culture is more reserved in expression
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    textDirection: "ltr",
    culturalRegion: "asian",
    expressionStyle: "reserved",
    sentimentAdjustment: -15, // Japanese culture is very reserved
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    textDirection: "ltr",
    culturalRegion: "latin",
    expressionStyle: "expressive",
    sentimentAdjustment: 10,
  },
  ru: {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    textDirection: "ltr",
    culturalRegion: "eastern_european",
    expressionStyle: "direct",
    sentimentAdjustment: -5,
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    textDirection: "ltr",
    culturalRegion: "south_asian",
    expressionStyle: "expressive",
    sentimentAdjustment: 5,
  },
};

// Multilingual keyword dictionaries
export interface EmotionKeyword {
  word: string;
  emotion: "joy" | "fear" | "anger" | "sadness" | "hope" | "curiosity";
  weight: number; // -100 to +100
  category: string;
}

export const MULTILINGUAL_KEYWORDS: Record<string, EmotionKeyword[]> = {
  // Arabic keywords
  ar: [
    // Death/Sadness
    { word: "موت", emotion: "sadness", weight: -90, category: "death" },
    { word: "وفاة", emotion: "sadness", weight: -85, category: "death" },
    { word: "استشهاد", emotion: "sadness", weight: -80, category: "death" },
    { word: "رحيل", emotion: "sadness", weight: -75, category: "death" },
    { word: "فقدان", emotion: "sadness", weight: -70, category: "death" },
    { word: "مأساة", emotion: "sadness", weight: -85, category: "disaster" },
    { word: "كارثة", emotion: "fear", weight: -80, category: "disaster" },
    { word: "حزن", emotion: "sadness", weight: -60, category: "emotion" },
    { word: "بكاء", emotion: "sadness", weight: -55, category: "emotion" },
    
    // Joy/Celebration
    { word: "فرح", emotion: "joy", weight: 80, category: "celebration" },
    { word: "سعادة", emotion: "joy", weight: 75, category: "emotion" },
    { word: "فوز", emotion: "joy", weight: 85, category: "celebration" },
    { word: "احتفال", emotion: "joy", weight: 80, category: "celebration" },
    { word: "بطولة", emotion: "joy", weight: 75, category: "sports" },
    { word: "نجاح", emotion: "joy", weight: 70, category: "achievement" },
    { word: "تخرج", emotion: "joy", weight: 65, category: "achievement" },
    { word: "زواج", emotion: "joy", weight: 70, category: "celebration" },
    
    // Fear
    { word: "خوف", emotion: "fear", weight: -70, category: "emotion" },
    { word: "رعب", emotion: "fear", weight: -85, category: "emotion" },
    { word: "قلق", emotion: "fear", weight: -50, category: "emotion" },
    { word: "تهديد", emotion: "fear", weight: -75, category: "conflict" },
    { word: "حرب", emotion: "fear", weight: -80, category: "conflict" },
    
    // Anger
    { word: "غضب", emotion: "anger", weight: -70, category: "emotion" },
    { word: "احتجاج", emotion: "anger", weight: -50, category: "politics" },
    { word: "ظلم", emotion: "anger", weight: -75, category: "injustice" },
    { word: "فساد", emotion: "anger", weight: -70, category: "politics" },
    
    // Hope
    { word: "أمل", emotion: "hope", weight: 70, category: "emotion" },
    { word: "تفاؤل", emotion: "hope", weight: 65, category: "emotion" },
    { word: "مستقبل", emotion: "hope", weight: 50, category: "future" },
    { word: "تطور", emotion: "hope", weight: 55, category: "progress" },
  ],
  
  // English keywords
  en: [
    // Death/Sadness
    { word: "death", emotion: "sadness", weight: -90, category: "death" },
    { word: "died", emotion: "sadness", weight: -85, category: "death" },
    { word: "tragedy", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "disaster", emotion: "fear", weight: -80, category: "disaster" },
    { word: "grief", emotion: "sadness", weight: -75, category: "emotion" },
    { word: "mourning", emotion: "sadness", weight: -70, category: "death" },
    
    // Joy/Celebration
    { word: "victory", emotion: "joy", weight: 85, category: "celebration" },
    { word: "celebration", emotion: "joy", weight: 80, category: "celebration" },
    { word: "champion", emotion: "joy", weight: 85, category: "sports" },
    { word: "success", emotion: "joy", weight: 70, category: "achievement" },
    { word: "happy", emotion: "joy", weight: 65, category: "emotion" },
    { word: "joy", emotion: "joy", weight: 75, category: "emotion" },
    
    // Fear
    { word: "fear", emotion: "fear", weight: -70, category: "emotion" },
    { word: "terror", emotion: "fear", weight: -90, category: "conflict" },
    { word: "threat", emotion: "fear", weight: -75, category: "conflict" },
    { word: "war", emotion: "fear", weight: -80, category: "conflict" },
    { word: "crisis", emotion: "fear", weight: -65, category: "economy" },
    
    // Anger
    { word: "anger", emotion: "anger", weight: -70, category: "emotion" },
    { word: "protest", emotion: "anger", weight: -50, category: "politics" },
    { word: "outrage", emotion: "anger", weight: -75, category: "emotion" },
    { word: "corruption", emotion: "anger", weight: -70, category: "politics" },
    
    // Hope
    { word: "hope", emotion: "hope", weight: 70, category: "emotion" },
    { word: "optimism", emotion: "hope", weight: 65, category: "emotion" },
    { word: "progress", emotion: "hope", weight: 55, category: "progress" },
    { word: "breakthrough", emotion: "hope", weight: 75, category: "achievement" },
  ],
  
  // French keywords
  fr: [
    { word: "mort", emotion: "sadness", weight: -90, category: "death" },
    { word: "décès", emotion: "sadness", weight: -85, category: "death" },
    { word: "tragédie", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "victoire", emotion: "joy", weight: 85, category: "celebration" },
    { word: "célébration", emotion: "joy", weight: 80, category: "celebration" },
    { word: "joie", emotion: "joy", weight: 75, category: "emotion" },
    { word: "peur", emotion: "fear", weight: -70, category: "emotion" },
    { word: "guerre", emotion: "fear", weight: -80, category: "conflict" },
    { word: "colère", emotion: "anger", weight: -70, category: "emotion" },
    { word: "espoir", emotion: "hope", weight: 70, category: "emotion" },
  ],
  
  // Spanish keywords
  es: [
    { word: "muerte", emotion: "sadness", weight: -90, category: "death" },
    { word: "fallecimiento", emotion: "sadness", weight: -85, category: "death" },
    { word: "tragedia", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "victoria", emotion: "joy", weight: 85, category: "celebration" },
    { word: "celebración", emotion: "joy", weight: 80, category: "celebration" },
    { word: "alegría", emotion: "joy", weight: 75, category: "emotion" },
    { word: "miedo", emotion: "fear", weight: -70, category: "emotion" },
    { word: "guerra", emotion: "fear", weight: -80, category: "conflict" },
    { word: "ira", emotion: "anger", weight: -70, category: "emotion" },
    { word: "esperanza", emotion: "hope", weight: 70, category: "emotion" },
  ],
  
  // German keywords
  de: [
    { word: "tod", emotion: "sadness", weight: -90, category: "death" },
    { word: "tragödie", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "sieg", emotion: "joy", weight: 85, category: "celebration" },
    { word: "feier", emotion: "joy", weight: 80, category: "celebration" },
    { word: "freude", emotion: "joy", weight: 75, category: "emotion" },
    { word: "angst", emotion: "fear", weight: -70, category: "emotion" },
    { word: "krieg", emotion: "fear", weight: -80, category: "conflict" },
    { word: "wut", emotion: "anger", weight: -70, category: "emotion" },
    { word: "hoffnung", emotion: "hope", weight: 70, category: "emotion" },
  ],
  
  // Chinese keywords
  zh: [
    { word: "死亡", emotion: "sadness", weight: -90, category: "death" },
    { word: "悲剧", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "胜利", emotion: "joy", weight: 85, category: "celebration" },
    { word: "庆祝", emotion: "joy", weight: 80, category: "celebration" },
    { word: "快乐", emotion: "joy", weight: 75, category: "emotion" },
    { word: "恐惧", emotion: "fear", weight: -70, category: "emotion" },
    { word: "战争", emotion: "fear", weight: -80, category: "conflict" },
    { word: "愤怒", emotion: "anger", weight: -70, category: "emotion" },
    { word: "希望", emotion: "hope", weight: 70, category: "emotion" },
  ],
  
  // Japanese keywords
  ja: [
    { word: "死", emotion: "sadness", weight: -90, category: "death" },
    { word: "悲劇", emotion: "sadness", weight: -80, category: "disaster" },
    { word: "勝利", emotion: "joy", weight: 85, category: "celebration" },
    { word: "祝い", emotion: "joy", weight: 80, category: "celebration" },
    { word: "喜び", emotion: "joy", weight: 75, category: "emotion" },
    { word: "恐怖", emotion: "fear", weight: -70, category: "emotion" },
    { word: "戦争", emotion: "fear", weight: -80, category: "conflict" },
    { word: "怒り", emotion: "anger", weight: -70, category: "emotion" },
    { word: "希望", emotion: "hope", weight: 70, category: "emotion" },
  ],
};

/**
 * Detect language from text
 */
export function detectLanguage(text: string): { code: string; confidence: number } {
  const lowerText = text.toLowerCase();
  
  // Arabic detection (check for Arabic characters)
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(text)) {
    return { code: "ar", confidence: 95 };
  }
  
  // Chinese detection
  const chineseRegex = /[\u4e00-\u9fff]/;
  if (chineseRegex.test(text)) {
    return { code: "zh", confidence: 95 };
  }
  
  // Japanese detection (Hiragana, Katakana)
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (japaneseRegex.test(text)) {
    return { code: "ja", confidence: 95 };
  }
  
  // Hindi detection (Devanagari)
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    return { code: "hi", confidence: 95 };
  }
  
  // Russian detection (Cyrillic)
  const russianRegex = /[\u0400-\u04FF]/;
  if (russianRegex.test(text)) {
    return { code: "ru", confidence: 90 };
  }
  
  // For Latin-based languages, use keyword detection
  const languageScores: Record<string, number> = {
    en: 0,
    fr: 0,
    es: 0,
    de: 0,
    pt: 0,
  };
  
  // Common words for each language
  const commonWords: Record<string, string[]> = {
    en: ["the", "is", "are", "was", "were", "have", "has", "been", "will", "would", "could", "should"],
    fr: ["le", "la", "les", "est", "sont", "été", "avoir", "être", "dans", "pour", "avec"],
    es: ["el", "la", "los", "las", "es", "son", "fue", "fueron", "estar", "para", "con"],
    de: ["der", "die", "das", "ist", "sind", "war", "waren", "haben", "sein", "für", "mit"],
    pt: ["o", "a", "os", "as", "é", "são", "foi", "foram", "estar", "para", "com"],
  };
  
  for (const [lang, words] of Object.entries(commonWords)) {
    for (const word of words) {
      if (lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`)) {
        languageScores[lang] += 1;
      }
    }
  }
  
  // Find the language with highest score
  let maxScore = 0;
  let detectedLang = "en"; // Default to English
  
  for (const [lang, score] of Object.entries(languageScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }
  
  const confidence = maxScore > 0 ? Math.min(90, 50 + maxScore * 10) : 50;
  
  return { code: detectedLang, confidence };
}

/**
 * Analyze text using multilingual keywords
 */
export function analyzeMultilingual(
  text: string,
  languageCode: string
): {
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  matchedKeywords: string[];
  culturalAdjustment: number;
} {
  const lowerText = text.toLowerCase();
  const keywords = MULTILINGUAL_KEYWORDS[languageCode] || MULTILINGUAL_KEYWORDS["en"];
  const profile = LANGUAGE_PROFILES[languageCode] || LANGUAGE_PROFILES["en"];
  
  // Initialize emotion scores
  const emotions = {
    joy: 50,
    fear: 50,
    anger: 50,
    sadness: 50,
    hope: 50,
    curiosity: 50,
  };
  
  const matchedKeywords: string[] = [];
  let totalWeight = 0;
  let matchCount = 0;
  
  // Check for keywords
  for (const kw of keywords) {
    if (lowerText.includes(kw.word)) {
      matchedKeywords.push(kw.word);
      
      // Apply weight to the corresponding emotion
      const adjustment = kw.weight / 2; // Scale down the weight
      emotions[kw.emotion] = Math.max(0, Math.min(100, emotions[kw.emotion] + adjustment));
      
      totalWeight += Math.abs(kw.weight);
      matchCount++;
    }
  }
  
  // Apply cultural adjustment
  const culturalAdjustment = profile.sentimentAdjustment;
  
  // Adjust based on expression style
  if (profile.expressionStyle === "reserved") {
    // Reserved cultures: dampen extreme emotions
    for (const emotion of Object.keys(emotions) as Array<keyof typeof emotions>) {
      emotions[emotion] = 50 + (emotions[emotion] - 50) * 0.7;
    }
  } else if (profile.expressionStyle === "expressive") {
    // Expressive cultures: amplify emotions slightly
    for (const emotion of Object.keys(emotions) as Array<keyof typeof emotions>) {
      emotions[emotion] = 50 + (emotions[emotion] - 50) * 1.2;
    }
  }
  
  // Clamp values
  for (const emotion of Object.keys(emotions) as Array<keyof typeof emotions>) {
    emotions[emotion] = Math.max(0, Math.min(100, Math.round(emotions[emotion])));
  }
  
  return {
    emotions,
    matchedKeywords,
    culturalAdjustment,
  };
}

/**
 * Get language profile
 */
export function getLanguageProfile(code: string): LanguageProfile | null {
  return LANGUAGE_PROFILES[code] || null;
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): LanguageProfile[] {
  return Object.values(LANGUAGE_PROFILES);
}
