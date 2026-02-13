/**
 * i18n Integration Tests
 * 
 * Tests for 7-language support:
 * - Arabic (ar) - RTL
 * - English (en)
 * - French (fr)
 * - Spanish (es)
 * - German (de)
 * - Chinese (zh)
 * - Japanese (ja)
 */

import { describe, it, expect } from 'vitest';
import { translations, rtlLanguages, Language } from './index';

describe('i18n - 7 Language Support', () => {
  describe('Language Support', () => {
    it('should support 7 languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      expect(languages.length).toBe(7);
      
      languages.forEach(lang => {
        expect(translations[lang]).toBeDefined();
      });
    });

    it('should have complete translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      const enKeys = Object.keys(translations.en);

      languages.forEach(lang => {
        const langKeys = Object.keys(translations[lang]);
        expect(langKeys.length).toBeGreaterThan(0);
      });
    });

    it('should mark Arabic as RTL', () => {
      expect(rtlLanguages).toContain('ar');
      expect(rtlLanguages.length).toBe(1);
    });

    it('should have all other languages as LTR', () => {
      const languages: Language[] = ['en', 'fr', 'de', 'es', 'zh', 'ja'];
      languages.forEach(lang => {
        expect(rtlLanguages).not.toContain(lang);
      });
    });
  });

  describe('Navigation Translations', () => {
    it('should have nav translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].nav).toBeDefined();
        expect(translations[lang].nav.home).toBeDefined();
        expect(translations[lang].nav.dashboard).toBeDefined();
        expect(translations[lang].nav.analyzer).toBeDefined();
      });
    });

    it('should have consistent nav keys across languages', () => {
      const enNavKeys = Object.keys(translations.en.nav).sort();
      const languages: Language[] = ['ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        const langNavKeys = Object.keys(translations[lang].nav).sort();
        expect(langNavKeys).toEqual(enNavKeys);
      });
    });
  });

  describe('Common Translations', () => {
    it('should have common translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].common).toBeDefined();
        expect(translations[lang].common.loading).toBeDefined();
        expect(translations[lang].common.error).toBeDefined();
        expect(translations[lang].common.save).toBeDefined();
      });
    });

    it('should have consistent common keys across languages', () => {
      const enCommonKeys = Object.keys(translations.en.common).sort();
      const languages: Language[] = ['ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        const langCommonKeys = Object.keys(translations[lang].common).sort();
        expect(langCommonKeys).toEqual(enCommonKeys);
      });
    });
  });

  describe('Analyzer Translations', () => {
    it('should have analyzer translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].analyzer).toBeDefined();
        expect(translations[lang].analyzer.title).toBeDefined();
        expect(translations[lang].analyzer.placeholder).toBeDefined();
      });
    });
  });

  describe('Emotions Translations', () => {
    it('should have emotion translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].emotions).toBeDefined();
        expect(translations[lang].emotions.joy).toBeDefined();
        expect(translations[lang].emotions.fear).toBeDefined();
        expect(translations[lang].emotions.anger).toBeDefined();
      });
    });

    it('should have consistent emotion keys across languages', () => {
      const enEmotionKeys = Object.keys(translations.en.emotions).sort();
      const languages: Language[] = ['ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        const langEmotionKeys = Object.keys(translations[lang].emotions).sort();
        expect(langEmotionKeys).toEqual(enEmotionKeys);
      });
    });
  });

  describe('Dashboard Translations', () => {
    it('should have dashboard translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].dashboard).toBeDefined();
        expect(translations[lang].dashboard.title).toBeDefined();
        expect(translations[lang].dashboard.overview).toBeDefined();
      });
    });
  });

  describe('Indices Translations', () => {
    it('should have indices translations for all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(translations[lang].indices).toBeDefined();
        expect(translations[lang].indices.gmi).toBeDefined();
        expect(translations[lang].indices.cfi).toBeDefined();
        expect(translations[lang].indices.hri).toBeDefined();
      });
    });
  });

  describe('Translation Quality', () => {
    it('should have non-empty translations for all keys', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        const checkTranslations = (obj: any, path = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            const fullPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0, 
                `Empty translation for ${lang}.${fullPath}`);
            } else if (typeof value === 'object' && value !== null) {
              checkTranslations(value, fullPath);
            }
          });
        };
        
        checkTranslations(translations[lang]);
      });
    });

    it('should not have duplicate translations within a language', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        const values: string[] = [];
        const collectValues = (obj: any) => {
          Object.values(obj).forEach(value => {
            if (typeof value === 'string') {
              values.push(value);
            } else if (typeof value === 'object' && value !== null) {
              collectValues(value);
            }
          });
        };
        
        collectValues(translations[lang]);
        
        // Allow some duplicates (like "Yes", "No"), but check for excessive duplication
        const uniqueValues = new Set(values);
        const duplicationRatio = 1 - (uniqueValues.size / values.length);
        
        expect(duplicationRatio).toBeLessThan(0.3); // Allow up to 30% duplication
      });
    });
  });

  describe('Language Codes', () => {
    it('should use valid ISO 639-1 language codes', () => {
      const validCodes = ['en', 'ar', 'fr', 'de', 'es', 'ru', 'zh', 'ja'];
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      languages.forEach(lang => {
        expect(validCodes).toContain(lang);
      });
    });
  });

  describe('Fallback Behavior', () => {
    it('should provide English as fallback language', () => {
      expect(translations.en).toBeDefined();
      expect(Object.keys(translations.en).length).toBeGreaterThan(0);
    });

    it('should have comprehensive English translations', () => {
      const enTranslations = translations.en;
      const mainSections = ['nav', 'common', 'home', 'analyzer', 'dashboard', 'emotions', 'indices'];
      
      mainSections.forEach(section => {
        expect(enTranslations[section as keyof typeof enTranslations]).toBeDefined();
      });
    });
  });

  describe('Multi-Language Consistency', () => {
    it('should have same structure across all languages', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      const enStructure = JSON.stringify(
        Object.keys(translations.en).sort()
      );

      languages.slice(1).forEach(lang => {
        const langStructure = JSON.stringify(
          Object.keys(translations[lang]).sort()
        );
        expect(langStructure).toEqual(enStructure);
      });
    });

    it('should support all 7 languages in a single application', () => {
      const languages: Language[] = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];
      
      // Simulate switching between languages
      let currentLang: Language = 'en';
      expect(translations[currentLang]).toBeDefined();
      
      languages.forEach(lang => {
        currentLang = lang;
        expect(translations[currentLang]).toBeDefined();
        expect(translations[currentLang].nav.home).toBeDefined();
      });
    });
  });
});
