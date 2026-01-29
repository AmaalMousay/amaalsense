import { createContext, useContext } from "react";
import { en, TranslationKeys } from "./en";
import { ar } from "./ar";

export type Language = "en" | "ar";

export const translations: Record<Language, TranslationKeys> = {
  en,
  ar,
};

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

export { en, ar };
export type { TranslationKeys };
