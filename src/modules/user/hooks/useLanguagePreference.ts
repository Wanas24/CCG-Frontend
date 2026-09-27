import { useCallback } from "react";
import { type AppLocale, useLocale } from "@/i18n/useLocale";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { queryClient } from "@/lib/queryClient";
import { userMeQueryKey } from "../api/hooks/useGetMe";
import { useUpdateLanguage } from "../api/hooks/useUpdateLanguage";

export const useLanguagePreference = () => {
  const { locale, setLocale } = useLocale();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: updateLanguage } = useUpdateLanguage();

  const changeLanguage = useCallback(
    (next: AppLocale) => {
      if (next === locale) {
        return;
      }

      setLocale(next);

      if (!isAuthenticated) {
        return;
      }

      updateLanguage(
        { language: next },
        {
          onSuccess: (response) => {
            if (!response.isSuccess) {
              return;
            }

            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setUser({
                ...currentUser,
                language: next,
              });
            }

            void queryClient.invalidateQueries({ queryKey: userMeQueryKey });
          },
        },
      );
    },
    [isAuthenticated, locale, setLocale, updateLanguage],
  );

  return {
    locale,
    changeLanguage,
  };
};
