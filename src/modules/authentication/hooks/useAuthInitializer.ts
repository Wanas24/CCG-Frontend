import { useEffect } from "react";
import { useRefreshToken } from "../api/hooks/useRefreshToken";
import { establishSession } from "./establishSession";
import { useAuthStore } from "../store/authStore";

let initPromise: Promise<void> | null = null;

export const useAuthInitializer = () => {
  const { mutateAsync } = useRefreshToken();
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (initPromise) {
      return;
    }

    initPromise = (async () => {
      try {
        const response = await mutateAsync();
        const { data } = response;

        if (response.isSuccess && data?.token && data.isAuthenticated) {
          establishSession(data);
        }
      } catch {
        // No valid refresh cookie — stay logged out
      } finally {
        setInitialized(true);
      }
    })();
  }, [mutateAsync, setInitialized]);
};
