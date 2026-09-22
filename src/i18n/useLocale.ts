import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import enUS from "antd/locale/en_US";
import arEG from "antd/locale/ar_EG";
import type { Locale as AntdLocale } from "antd/es/locale";
import {
  LOCALE_DIRECTION,
  type AppLocale,
} from "./config";

export type { AppLocale };

const antdLocales: Record<AppLocale, AntdLocale> = {
  en: enUS,
  ar: arEG,
};

export const useLocale = () => {
  const { i18n, t } = useTranslation();
  const locale: AppLocale = i18n.language?.startsWith("ar") ? "ar" : "en";
  const direction = LOCALE_DIRECTION[locale];

  const setLocale = useCallback(
    (next: AppLocale) => {
      void i18n.changeLanguage(next);
    },
    [i18n],
  );

  const antdLocale = useMemo(() => antdLocales[locale], [locale]);

  return {
    locale,
    direction,
    isRtl: direction === "rtl",
    antdLocale,
    setLocale,
    t,
  };
};
