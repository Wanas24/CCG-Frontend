import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { aiSubscriptionService } from "../services/aiSubscription.service";
import { aiSubscriptionQueryKey } from "../queryKeys/aiQueryKeys";
import type { TGetAiSubscriptionResponse } from "../../types";

export const useGetAiSubscription = (userId: string | null, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetAiSubscriptionResponse>({
    queryKey: aiSubscriptionQueryKey(userId ?? ""),
    queryFn: () => aiSubscriptionService.getAiSubscription(userId as string),
    enabled:
      enabled && isAuthenticated && companyId !== null && Boolean(userId),
  });
};
