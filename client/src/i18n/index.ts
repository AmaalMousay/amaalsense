import { createContext, useContext } from "react";
import { en, TranslationKeys } from "./en";
import { ar } from "./ar";
import { fr } from "./fr";
import { de } from "./de";
import { ru } from "./ru";
import { es } from "./es";
import { zh } from "./zh";

export type Language = "en" | "ar" | "fr" | "de" | "ru" | "es" | "zh";

export const translations: Record<Language, TranslationKeys> = {
  en,
  ar,
  fr,
  de,
  ru,
  es,
  zh,
};

// Languages that use RTL direction
export const rtlLanguages: Language[] = ["ar"];

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
  isRTL: false,
});

export const useI18n = () => useContext(I18nContext);

export { en, ar, fr, de, ru, es, zh };
export type { TranslationKeys };
