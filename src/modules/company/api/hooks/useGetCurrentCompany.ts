import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { companyService } from "../services/company.service";
import { currentCompanyQueryKey } from "./companyQueryKeys";
import type { TGetCurrentCompanyResponse } from "../../types";

export const useGetCurrentCompany = (enabled = true) => {
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetCurrentCompanyResponse>({
    queryKey: currentCompanyQueryKey,
    queryFn: companyService.getCurrent,
    enabled: enabled && companyId !== null,
    staleTime: 0,
    refetchOnMount: true,
  });
};
