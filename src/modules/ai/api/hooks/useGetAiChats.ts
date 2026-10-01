import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { aiService } from "../services/ai.service";
import { aiChatsQueryKey } from "../queryKeys/aiQueryKeys";
import type { TGetAiChatsResponse } from "../../types";

export const useGetAiChats = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetAiChatsResponse>({
    queryKey: aiChatsQueryKey,
    queryFn: aiService.getAiChats,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
