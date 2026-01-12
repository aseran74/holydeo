import React, { createContext, useContext, useState, useEffect } from 'react';
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

type Language = 'es' | 'en';

type TranslationObject = typeof esTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, TranslationObject> = {
  es: esTranslations,
  en: enTranslations,
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Similar al ThemeContext, cargamos el idioma guardado del localStorage
  const [language, setLanguageState] = useState<Language>('es');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const initialLanguage = savedLanguage || 'es';
    setLanguageState(initialLanguage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (isRecord(value) && k in value) {
        value = value[k];
      } else {
        return key; // Si no se encuentra la clave, devolverla tal cual
      }
    }
    
    if (typeof value !== 'string') return key;
    if (!params) return value;

    // Interpolación simple: reemplaza "{var}" por el valor recibido
    let interpolated = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const escaped = paramKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      interpolated = interpolated.replace(new RegExp(`\\{${escaped}\\}`, 'g'), String(paramValue));
    }
    return interpolated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};