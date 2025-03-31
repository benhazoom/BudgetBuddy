"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, LanguageConfig } from "../lib/types";
import { LANGUAGES, getTranslation } from "../lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("he");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && savedLanguage in LANGUAGES) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.lang = newLanguage;
  };

  const translate = (key: string): string => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange, translate }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
