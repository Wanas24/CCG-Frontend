import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { measurementsQueryKey } from "../queryKeys/measurementQueryKeys";
import { measurementService } from "../services/measurement.service";
import type {
  TGetMeasurementsParams,
  TGetMeasurementsResponse,
} from "../../types/measurement";

export const useGetMeasurements = (
  params: TGetMeasurementsParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetMeasurementsResponse>({
    queryKey: measurementsQueryKey(params),
    queryFn: () => measurementService.list(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
