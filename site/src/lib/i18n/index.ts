import en from './en.json';
import am from './am.json';

export type Language = 'en' | 'am';

export const translations = {
  en,
  am,
} as const;

export type TranslationKeys = typeof en;

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function t(key: string, lang: Language = 'en'): string {
  return getTranslation(lang, key);
}
