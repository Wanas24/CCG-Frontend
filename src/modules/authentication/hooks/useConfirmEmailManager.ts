import { useCallback } from "react";
import { useNavigate } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useConfirmEmail } from "../api/hooks/useConfirmEmail";
import { fetchConfirmationStatus } from "../api/hooks/useConfirmationStatus";
import { useAuthStore } from "../store/authStore";
import type { TConfirmEmailParams } from "../types";
import { isAccountVerified } from "../types";
import { getPostVerificationPath } from "../utils/getPostVerificationPath";

export const useConfirmEmailManager = ({
  userId,
  token,
}: TConfirmEmailParams) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setConfirmationStatus = useAuthStore(
    (state) => state.setConfirmationStatus,
  );
  const { mutate, isPending, isSuccess, isError, data } = useConfirmEmail();

  const confirm = useCallback(() => {
    mutate(
      { userId, token },
      {
        onSuccess: async (response) => {
          if (!response.isSuccess || !useAuthStore.getState().isAuthenticated) {
            return;
          }
          try {
            const statusResponse = await fetchConfirmationStatus();
            const status = statusResponse.data ?? null;
            setConfirmationStatus(status);

            if (isAccountVerified(status)) {
              navigate(getPostVerificationPath(), { replace: true });
            }
          } catch {
            // Status refresh failed — stay on confirm page
          }
        },
      },
    );
  }, [mutate, userId, token, setConfirmationStatus, navigate]);

  const continuePath = isAuthenticated
    ? AUTH_ROUTES.verifyAccount
    : AUTH_ROUTES.login;

  const confirmed = isSuccess && Boolean(data?.isSuccess);

  return {
    confirm,
    isPending,
    isSuccess: confirmed,
    isError: isError || (isSuccess && !confirmed),
    message: data?.message,
    continuePath,
  };
};
