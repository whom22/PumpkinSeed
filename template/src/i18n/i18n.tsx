import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * PumpkinSeed i18n — 60 lines instead of a dependency.
 * Dictionaries are plain objects; the provider auto-detects the browser
 * language and remembers the user's choice.
 */

export type Lang = 'en' | 'zh';
export type Dict = Record<string, string>;

const STORAGE_KEY = 'ps:lang';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLang(): Lang {
  let saved: string | null = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* Language remains usable without storage. */ }
  if (saved === 'en' || saved === 'zh') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export interface I18nProviderProps {
  dicts: Record<Lang, Dict>;
  children: ReactNode;
}

export function I18nProvider({ dicts, children }: I18nProviderProps) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((next: Lang) => {
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* In-memory language still changes. */ }
    setLangState(next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = dicts[lang]?.[key] ?? dicts.en?.[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replaceAll(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [dicts, lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
