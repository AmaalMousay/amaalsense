import { useState, useEffect, ReactNode } from "react";
import { I18nContext, Language, translations, rtlLanguages } from "@/i18n";

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

const validLanguages: Language[] = ["en", "ar", "fr", "de", "ru", "es", "zh"];

// Map browser language codes to our supported languages
const browserLanguageMap: Record<string, Language> = {
  "en": "en",
  "en-US": "en",
  "en-GB": "en",
  "ar": "ar",
  "ar-SA": "ar",
  "ar-EG": "ar",
  "ar-LY": "ar",
  "ar-TN": "ar",
  "fr": "fr",
  "fr-FR": "fr",
  "fr-CA": "fr",
  "de": "de",
  "de-DE": "de",
  "de-AT": "de",
  "ru": "ru",
  "ru-RU": "ru",
  "es": "es",
  "es-ES": "es",
  "es-MX": "es",
  "zh": "zh",
  "zh-CN": "zh",
  "zh-TW": "zh",
};

function detectBrowserLanguage(): Language | null {
  if (typeof window === "undefined" || !navigator) return null;
  
  // Get browser languages in order of preference
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const browserLang of browserLanguages) {
    // Try exact match first
    if (browserLanguageMap[browserLang]) {
      return browserLanguageMap[browserLang];
    }
    
    // Try base language (e.g., "en" from "en-US")
    const baseLang = browserLang.split("-")[0];
    if (browserLanguageMap[baseLang]) {
      return browserLanguageMap[baseLang];
    }
  }
  
  return null;
}

export function I18nProvider({ children, defaultLanguage = "en" }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      // 1. First check localStorage for saved preference
      const saved = localStorage.getItem("amalsense-language") as Language;
      if (saved && validLanguages.includes(saved)) {
        return saved;
      }
      
      // 2. If no saved preference, detect browser language
      const detectedLang = detectBrowserLanguage();
      if (detectedLang) {
        return detectedLang;
      }
    }
    return defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("amalsense-language", lang);
    
    const isRTL = rtlLanguages.includes(lang);
    
    // Update document direction
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    
    // Add/remove RTL class
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
    
    // Add language-specific class for font handling
    validLanguages.forEach(l => {
      document.documentElement.classList.remove(`lang-${l}`);
    });
    document.documentElement.classList.add(`lang-${lang}`);
  };

  useEffect(() => {
    const isRTL = rtlLanguages.includes(language);
    
    // Set initial direction
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
    
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
    
    // Add language-specific class
    validLanguages.forEach(l => {
      document.documentElement.classList.remove(`lang-${l}`);
    });
    document.documentElement.classList.add(`lang-${language}`);
    
    // Save detected language to localStorage on first load
    if (!localStorage.getItem("amalsense-language")) {
      localStorage.setItem("amalsense-language", language);
    }
  }, [language]);

  const isRTL = rtlLanguages.includes(language);
  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}
