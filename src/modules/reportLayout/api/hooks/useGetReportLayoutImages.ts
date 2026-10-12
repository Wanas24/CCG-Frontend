import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { reportLayoutImagesQueryKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useGetReportLayoutImages = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: reportLayoutImagesQueryKey,
    queryFn: () => reportLayoutService.listImages(),
    enabled: isAuthenticated && enabled,
  });
};
