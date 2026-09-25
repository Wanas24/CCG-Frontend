import { authService } from "../api/services/authentication.service";
import { mapAuthPayloadToUser } from "../utils/mapAuthPayloadToUser";
import { useAuthStore } from "../store/authStore";
import type { TAuthPayload, TConfirmationStatus } from "../types";
import { isAccountVerified } from "../types";

const unverifiedStatus: TConfirmationStatus = {
  emailConfirmed: false,
  phoneNumberConfirmed: false,
};

export const establishSession = async (data: TAuthPayload) => {
  const store = useAuthStore.getState();

  store.login({
    accessToken: data.token,
    user: mapAuthPayloadToUser(data),
  });

  try {
    const statusResponse = await authService.getConfirmationStatus();
    const confirmationStatus = statusResponse.data ?? unverifiedStatus;

    store.setConfirmationStatus(confirmationStatus);

    return {
      isVerified: isAccountVerified(confirmationStatus),
      confirmationStatus,
    };
  } catch {
    store.setConfirmationStatus(unverifiedStatus);

    return {
      isVerified: false,
      confirmationStatus: unverifiedStatus,
    };
  }
};
