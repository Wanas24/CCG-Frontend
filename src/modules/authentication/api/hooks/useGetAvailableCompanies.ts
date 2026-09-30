import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../services/authentication.service";
import { availableCompaniesQueryKey } from "./availableCompaniesQueryKey";
import type { TGetAvailableCompaniesResponse } from "@/modules/company/types";

export const useGetAvailableCompanies = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<TGetAvailableCompaniesResponse>({
    queryKey: availableCompaniesQueryKey,
    queryFn: () => authService.getCompanies(),
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnMount: true,
  });
};
