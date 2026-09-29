import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { aiService } from "../services/ai.service";
import { aiMessagesQueryKey } from "../queryKeys/aiQueryKeys";

const DEFAULT_PAGE_SIZE = 10;

type Options = {
  pageSize?: number;
  enabled?: boolean;
};

export const useGetAiMessages = (chatId: string | null, options: Options = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: [...aiMessagesQueryKey(chatId ?? ""), pageSize] as const,
    queryFn: ({ pageParam }) =>
      aiService.getAiMessages(chatId as string, {
        page: pageParam,
        pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isSuccess || !lastPage.data) {
        return undefined;
      }

      const { page, totalPages } = lastPage.data;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
    enabled:
      (options.enabled ?? true) &&
      isAuthenticated &&
      companyId !== null &&
      Boolean(chatId),
  });
};
