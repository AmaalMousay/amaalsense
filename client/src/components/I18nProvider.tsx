import { useState, useEffect, ReactNode } from "react";
import { I18nContext, Language, translations, rtlLanguages } from "@/i18n";

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

const validLanguages: Language[] = ["en", "ar", "fr", "de", "ru", "es", "zh"];

export function I18nProvider({ children, defaultLanguage = "en" }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage for saved preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("amalsense-language") as Language;
      if (saved && validLanguages.includes(saved)) {
        return saved;
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
  }, [language]);

  const isRTL = rtlLanguages.includes(language);
  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}
