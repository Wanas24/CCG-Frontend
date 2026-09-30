import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import ar from "./ar";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_DIRECTION: Record<AppLocale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

const STORAGE_KEY = "ccg-locale";

export const getStoredLocale = (): AppLocale => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "ar") {
    return stored;
  }
  return "en";
};

export const persistLocale = (locale: AppLocale) => {
  localStorage.setItem(STORAGE_KEY, locale);
};

export const applyDocumentDirection = (locale: AppLocale) => {
  const direction = LOCALE_DIRECTION[locale];
  document.documentElement.lang = locale;
  document.documentElement.dir = direction;
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getStoredLocale(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

applyDocumentDirection(getStoredLocale());

i18n.on("languageChanged", (lng) => {
  const locale = (lng === "ar" ? "ar" : "en") as AppLocale;
  persistLocale(locale);
  applyDocumentDirection(locale);
});

export default i18n;
