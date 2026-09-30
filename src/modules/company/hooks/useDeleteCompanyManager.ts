import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { hint } from "@/lib/feedback/hint";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { userMeQueryKey } from "@/modules/user/api/hooks/useGetMe";
import { refreshPermissions } from "@/modules/user/api/hooks/permissionsQueryKey";
import { userService } from "@/modules/user/api/services/user.service";
import { mapUserInfoToSessionUser } from "@/modules/user/utils/mapUserInfoToSessionUser";
import { connectHub, disconnectHub } from "@/services/hub";
import { useDeleteCompany } from "../api/hooks/useDeleteCompany";
import {
  companyLogoQueryKey,
  currentCompanyQueryKey,
} from "../api/hooks/companyQueryKeys";

const reconcileSessionAfterDelete = async (deletedCompanyId: number) => {
  const currentUser = useAuthStore.getState().user;
  let nextCompanyId: number | null = null;

  try {
    const me = await userService.getMe();

    if (me.isSuccess && me.data && currentUser) {
      const profileCompanyId = me.data.companyId;

      if (
        profileCompanyId !== null &&
        profileCompanyId !== deletedCompanyId
      ) {
        nextCompanyId = profileCompanyId;
      }

      useAuthStore.getState().setUser(
        mapUserInfoToSessionUser(
          { ...me.data, companyId: nextCompanyId },
          currentUser,
        ),
      );
    } else if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        companyId: null,
      });
    }
  } catch {
    if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        companyId: null,
      });
    }
  }

  queryClient.removeQueries({ queryKey: currentCompanyQueryKey });
  queryClient.removeQueries({ queryKey: companyLogoQueryKey });

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: availableCompaniesQueryKey }),
    queryClient.invalidateQueries({ queryKey: userMeQueryKey }),
    refreshPermissions(),
  ]);

  disconnectHub();
  connectHub();
};

export const useDeleteCompanyManager = () => {
  const { t } = useTranslation();
  const { mutateAsync: deleteCompanyMutate, isPending } = useDeleteCompany();
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  const deleteCompany = async () => {
    if (companyId === null) {
      hint("auth.noCompany");
      return false;
    }

    try {
      const response = await deleteCompanyMutate();

      if (!response.isSuccess) {
        return false;
      }

      toast.success(response.message || t("company.delete.success"));
      await reconcileSessionAfterDelete(companyId);
      return true;
    } catch {
      return false;
    }
  };

  return {
    deleteCompany,
    isPending,
  };
};
