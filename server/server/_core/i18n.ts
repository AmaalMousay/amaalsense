/**
 * i18n Module — Minimal Skeleton
 *
 * All translation keys were removed because every caller now uses inline English
 * strings. The t() function is kept as a no-op compat shim so that any external
 * code that imports it does not break at runtime.
 */

export type ServerLocale = 'en' | 'ar';

export function normalizeLocale(_locale?: string): ServerLocale {
  return 'en';
}

export function t(_key: string, _locale?: string): string {
  return '';
}
