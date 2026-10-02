import { mapAuthPayloadToUser } from "../utils/mapAuthPayloadToUser";
import { applySessionAppearance } from "../utils/applySessionAppearance";
import { useAuthStore } from "../store/authStore";
import { connectHub } from "@/services/hub";
import type { TAuthPayload } from "../types";

export const establishSession = (data: TAuthPayload): void => {
  const user = mapAuthPayloadToUser(data);

  useAuthStore.getState().login({
    accessToken: data.token,
    user,
  });

  applySessionAppearance(user);
  connectHub();
};
