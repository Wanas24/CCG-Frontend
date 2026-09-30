import auth from "@/modules/authentication/locales/ar";
import company from "@/modules/company/locales/ar";
import ai from "@/modules/ai/locales/ar";
import user from "@/modules/user/locales/ar";
import notFound, { home } from "@/modules/standalone/locales/ar";
import shared from "@/shared/locales/ar";

const ar = {
  ...shared,
  auth,
  company,
  ai,
  user,
  notFound,
  home,
} as const;

export default ar;
