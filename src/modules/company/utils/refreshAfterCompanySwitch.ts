import { queryClient } from "@/lib/queryClient";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { clearAiQueries } from "@/modules/ai/api/queryKeys/aiQueryKeys";
import { clearAlertQueries } from "@/modules/alerts/api/queryKeys/alertQueryKeys";
import { clearItemCategoryQueries } from "@/modules/lists/itemCatalog/api/queryKeys/itemCategoryQueryKeys";
import { clearMeasurementQueries } from "@/modules/lists/units/api/queryKeys/measurementQueryKeys";
import { userMeQueryKey } from "@/modules/user/api/hooks/useGetMe";
import { userNotificationsQueryRootKey } from "@/modules/user/api/hooks/notificationsQueryKey";
import { refreshPermissions } from "@/modules/user/api/hooks/permissionsQueryKey";
import { connectHub, disconnectHub } from "@/services/hub";
import {
  companyLogoQueryKey,
  currentCompanyQueryKey,
} from "../api/hooks/companyQueryKeys";

const clearListsQueries = async () => {
  await Promise.all([clearMeasurementQueries(), clearItemCategoryQueries()]);
};

export const refreshAfterCompanySwitch = async () => {
  const companyId = useAuthStore.getState().user?.companyId ?? null;

  if (companyId === null) {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: currentCompanyQueryKey }),
      queryClient.cancelQueries({ queryKey: companyLogoQueryKey }),
    ]);
    queryClient.removeQueries({ queryKey: currentCompanyQueryKey });
    queryClient.removeQueries({ queryKey: companyLogoQueryKey });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userMeQueryKey }),
      queryClient.invalidateQueries({ queryKey: availableCompaniesQueryKey }),
      queryClient.invalidateQueries({ queryKey: userNotificationsQueryRootKey }),
      refreshPermissions(),
      clearAiQueries(),
      clearListsQueries(),
      clearAlertQueries(),
    ]);
  } else {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userMeQueryKey }),
      queryClient.invalidateQueries({ queryKey: availableCompaniesQueryKey }),
      queryClient.invalidateQueries({ queryKey: currentCompanyQueryKey }),
      queryClient.invalidateQueries({ queryKey: companyLogoQueryKey }),
      queryClient.invalidateQueries({ queryKey: userNotificationsQueryRootKey }),
      refreshPermissions(),
      clearAiQueries(),
      clearListsQueries(),
      clearAlertQueries(),
    ]);
  }

  disconnectHub();
  connectHub();
};
