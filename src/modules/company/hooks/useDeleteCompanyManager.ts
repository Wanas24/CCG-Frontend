import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { hint } from "@/lib/feedback/hint";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { authService } from "@/modules/authentication/api/services/authentication.service";
import { establishSession } from "@/modules/authentication/hooks/establishSession";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type {
  TAuthPayload,
  TLoginResponse,
  TSimpleResult,
} from "@/modules/authentication/types";
import { useDeleteCompany } from "../api/hooks/useDeleteCompany";
import { refreshAfterCompanySwitch } from "../utils/refreshAfterCompanySwitch";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

type DeleteCompanyResult =
  | { ok: true }
  | { ok: false; reason: "password"; response: TSimpleResult }
  | { ok: false; reason: "delete" | "session" | "reauth" };

const getAuthPayload = (
  response: TLoginResponse,
): TAuthPayload | null => {
  if (
    !response.isSuccess ||
    !response.data?.token ||
    !response.data.isAuthenticated
  ) {
    return null;
  }

  return response.data;
};

const forceLogoutToLogin = (
  navigate: ReturnType<typeof useNavigate>,
) => {
  useAuthStore.getState().logout();
  queryClient.clear();
  navigate(AUTH_ROUTES.login, { replace: true });
};

export const useDeleteCompanyManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: deleteCompanyMutate } = useDeleteCompany();
  const [isPending, setIsPending] = useState(false);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const email = useAuthStore((state) => state.user?.email ?? null);

  const deleteCompany = async (
    password: string,
  ): Promise<DeleteCompanyResult> => {
    if (companyId === null) {
      hint("auth.noCompany");
      return { ok: false, reason: "session" };
    }

    if (!email) {
      return { ok: false, reason: "session" };
    }

    if (isPending) {
      return { ok: false, reason: "session" };
    }

    setIsPending(true);

    try {
      const verifyResponse = await authService.login({
        email,
        password,
        rememberMe: false,
      });

      if (!getAuthPayload(verifyResponse)) {
        return { ok: false, reason: "password", response: verifyResponse };
      }

      const deleteResponse = await deleteCompanyMutate();

      if (!deleteResponse.isSuccess) {
        return { ok: false, reason: "delete" };
      }

      const reauthResponse = await authService.login({
        email,
        password,
        rememberMe: false,
      });
      const authPayload = getAuthPayload(reauthResponse);

      if (!authPayload) {
        forceLogoutToLogin(navigate);
        return { ok: false, reason: "reauth" };
      }

      establishSession(authPayload);
      await refreshAfterCompanySwitch();
      navigate(APP_ROUTES.home);
      toast.success(deleteResponse.message || t("company.delete.success"));
      return { ok: true };
    } catch {
      return { ok: false, reason: "session" };
    } finally {
      setIsPending(false);
    }
  };

  return {
    deleteCompany,
    isPending,
  };
};
