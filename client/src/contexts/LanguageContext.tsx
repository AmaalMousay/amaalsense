/**
 * Language Context
 * 
 * Provides language selection and translation functionality
 * across the entire application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n';
import { DEFAULT_LANGUAGE, LANGUAGES, t, isRTL } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  availableLanguages: Record<Language, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = isRTL(savedLanguage) ? 'rtl' : 'ltr';
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: (key: string) => t(key, language),
    isRTL: isRTL(language),
    availableLanguages: LANGUAGES,
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
