import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { aiSubscriptionService } from "../services/aiSubscription.service";
import { aiSubscriptionsQueryKey } from "../queryKeys/aiQueryKeys";
import type {
  TGetAiSubscriptionsParams,
  TGetAiSubscriptionsResponse,
} from "../../types";

export const useGetAiSubscriptions = (
  params: TGetAiSubscriptionsParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetAiSubscriptionsResponse>({
    queryKey: aiSubscriptionsQueryKey(params),
    queryFn: () => aiSubscriptionService.getAiSubscriptions(params),
    enabled: enabled && isAuthenticated && companyId !== null,
    placeholderData: keepPreviousData,
  });
};
