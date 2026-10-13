import auth from "@/modules/authentication/locales/ar";
import company from "@/modules/company/locales/ar";
import ai from "@/modules/ai/locales/ar";
import approval from "@/modules/approval/locales/ar";
import lists from "@/modules/lists/locales/ar";
import alerts from "@/modules/alerts/locales/ar";
import user from "@/modules/user/locales/ar";
import userControl from "@/modules/userControl/locales/ar";
import notFound, { home, settings } from "@/modules/standalone/locales/ar";
import shared from "@/shared/locales/ar";

const ar = {
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

export default ar;
