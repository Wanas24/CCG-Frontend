import "./config";

export { default as i18n } from "./config";
export {
  SUPPORTED_LOCALES,
  LOCALE_DIRECTION,
  getStoredLocale,
  persistLocale,
  applyDocumentDirection,
  type AppLocale,
} from "./config";
export { useLocale } from "./useLocale";
export { default as AppLocaleSwitcher } from "../shared/components/AppLocaleSwitcher";
