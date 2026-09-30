import auth from "@/modules/authentication/locales/en";
import company from "@/modules/company/locales/en";
import ai from "@/modules/ai/locales/en";
import user from "@/modules/user/locales/en";
import notFound, { home } from "@/modules/standalone/locales/en";
import shared from "@/shared/locales/en";

const en = {
  ...shared,
  auth,
  company,
  ai,
  user,
  notFound,
  home,
} as const;

export default en;
