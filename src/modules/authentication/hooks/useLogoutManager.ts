import { useNavigate } from "react-router";
import { AUTH_ROUTES } from "../routes/paths";
import { useRevokeToken } from "../api/hooks/useRevokeToken";
import { useAuthStore } from "../store/authStore";
import { queryClient } from "@/lib/queryClient";
import { disconnectHub } from "@/services/hub";
import { useThemeStore } from "@/AntdTheme";

export const useLogoutManager = () => {
  const navigate = useNavigate();
  const storeLogout = useAuthStore((state) => state.logout);
  const { mutateAsync: revokeToken, isPending } = useRevokeToken();

  const logout = async () => {
    try {
      await revokeToken({ token: null });
    } catch {
      // Clear local session even if revoke fails
    } finally {
      disconnectHub();
      storeLogout();
      useThemeStore.getState().setMode("light");
      queryClient.clear();
      navigate(AUTH_ROUTES.login, { replace: true });
    }
  };

  return {
    logout,
    isPending,
  };
};
