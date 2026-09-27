import { useCallback } from "react";
import { useThemeStore, type AppThemeMode } from "@/AntdTheme";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { queryClient } from "@/lib/queryClient";
import { userMeQueryKey } from "../api/hooks/useGetMe";
import { useUpdateTheme } from "../api/hooks/useUpdateTheme";

export const useThemePreference = () => {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: updateTheme } = useUpdateTheme();

  const changeTheme = useCallback(
    (next: AppThemeMode) => {
      if (next === mode) {
        return;
      }

      setMode(next);

      if (!isAuthenticated) {
        return;
      }

      updateTheme(
        { theme: next },
        {
          onSuccess: (response) => {
            if (!response.isSuccess) {
              return;
            }

            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setUser({
                ...currentUser,
                theme: next,
              });
            }

            void queryClient.invalidateQueries({ queryKey: userMeQueryKey });
          },
        },
      );
    },
    [isAuthenticated, mode, setMode, updateTheme],
  );

  const toggleTheme = useCallback(() => {
    changeTheme(mode === "light" ? "dark" : "light");
  }, [changeTheme, mode]);

  return {
    mode,
    changeTheme,
    toggleTheme,
  };
};
