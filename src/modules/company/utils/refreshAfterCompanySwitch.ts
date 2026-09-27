import { queryClient } from "@/lib/queryClient";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import { userMeQueryKey } from "@/modules/user/api/hooks/useGetMe";
import { refreshPermissions } from "@/modules/user/api/hooks/permissionsQueryKey";
import { connectHub, disconnectHub } from "@/services/hub";
import {
  companyLogoQueryKey,
  currentCompanyQueryKey,
} from "../api/hooks/companyQueryKeys";

export const refreshAfterCompanySwitch = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: userMeQueryKey }),
    queryClient.invalidateQueries({ queryKey: availableCompaniesQueryKey }),
    queryClient.invalidateQueries({ queryKey: currentCompanyQueryKey }),
    queryClient.invalidateQueries({ queryKey: companyLogoQueryKey }),
    refreshPermissions(),
  ]);

  disconnectHub();
  connectHub();
};
