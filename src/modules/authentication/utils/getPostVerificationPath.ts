import { COMPANY_ROUTES } from "@/modules/company/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useAuthStore } from "../store/authStore";

export const getPostVerificationPath = (): string => {
  const companyId = useAuthStore.getState().user?.companyId ?? null;
  return companyId === null ? COMPANY_ROUTES.onboarding : APP_ROUTES.home;
};
