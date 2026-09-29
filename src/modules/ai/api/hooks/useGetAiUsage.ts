import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { aiService } from "../services/ai.service";
import { aiUsageQueryKey } from "../queryKeys/aiQueryKeys";
import type { TGetAiUsageResponse } from "../../types";

export const useGetAiUsage = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetAiUsageResponse>({
    queryKey: aiUsageQueryKey,
    queryFn: aiService.getAiUsage,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
