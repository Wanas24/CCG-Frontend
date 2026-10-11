import auth from "@/modules/authentication/locales/en";
import company from "@/modules/company/locales/en";
import ai from "@/modules/ai/locales/en";
import approval from "@/modules/approval/locales/en";
import lists from "@/modules/lists/locales/en";
import alerts from "@/modules/alerts/locales/en";
import user from "@/modules/user/locales/en";
import userControl from "@/modules/userControl/locales/en";
import notFound, { home, settings } from "@/modules/standalone/locales/en";
import shared from "@/shared/locales/en";

const en = {
  ...shared,
  auth,
  company,
  ai,
  approval,
  lists,
  alerts,
  user,
  userControl,
  notFound,
  home,
  settings,
} as const;

export default en;
