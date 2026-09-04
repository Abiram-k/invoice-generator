import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { ml } from "./locales/ml";

export const languages = ["en", "ml"] as const;
export type Language = (typeof languages)[number];

const STORAGE_KEY = "invoice-language";

// Reads the saved language, falling back to English for anything unexpected.
export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return languages.includes(stored as Language) ? (stored as Language) : "en";
  } catch {
    return "en";
  }
};

export const storeLanguage = (language: Language) => {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage failures, the language still applies for this session.
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ml: { translation: ml },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
