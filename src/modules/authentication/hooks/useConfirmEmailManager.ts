import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useConfirmEmail } from "../api/hooks/useConfirmEmail";
import { useConfirmationStatus } from "../api/hooks/useConfirmationStatus";
import { useAuthStore } from "../store/authStore";
import type { TConfirmEmailParams } from "../types";
import { isAccountVerified } from "../types";

export const useConfirmEmailManager = ({
  userId,
  token,
}: TConfirmEmailParams) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setConfirmationStatus = useAuthStore(
    (state) => state.setConfirmationStatus,
  );
  const { mutate, isPending, isSuccess, data } = useConfirmEmail();
  const { mutateAsync: fetchConfirmationStatus } = useConfirmationStatus();

  useEffect(() => {
    mutate(
      { userId, token },
      {
        onSuccess: async (response) => {
          if (!response.isSuccess || !isAuthenticated) {
            return;
          }
          try {
            const statusResponse = await fetchConfirmationStatus();
            const status = statusResponse.data ?? null;
            setConfirmationStatus(status);

            if (isAccountVerified(status)) {
              navigate(APP_ROUTES.home, { replace: true });
            }
          } catch {
            // Status refresh failed — stay on confirm page
          }
        },
      },
    );
  }, [
    mutate,
    userId,
    token,
    isAuthenticated,
    setConfirmationStatus,
    navigate,
    fetchConfirmationStatus,
  ]);

  const continuePath = isAuthenticated
    ? AUTH_ROUTES.verifyAccount
    : AUTH_ROUTES.login;

  return {
    isPending,
    isSuccess,
    message: data?.message,
    continuePath,
  };
};
