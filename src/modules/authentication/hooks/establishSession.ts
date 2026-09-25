import { mapAuthPayloadToUser } from "../utils/mapAuthPayloadToUser";
import { useAuthStore } from "../store/authStore";
import type { TAuthPayload } from "../types";

export const establishSession = (data: TAuthPayload): void => {
  useAuthStore.getState().login({
    accessToken: data.token,
    user: mapAuthPayloadToUser(data),
  });
};
