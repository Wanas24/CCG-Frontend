import { queryClient } from "@/lib/queryClient";
import type { TGetMeasurementsParams } from "../../types/measurement";

export const measurementQueryRootKey = ["measurement"] as const;

export const measurementsQueryKey = (params: TGetMeasurementsParams = {}) =>
  ["measurement", "list", params] as const;

export const clearMeasurementQueries = async () => {
  await queryClient.cancelQueries({ queryKey: measurementQueryRootKey });
  queryClient.removeQueries({ queryKey: measurementQueryRootKey });
};

export const invalidateMeasurementQueries = async () => {
  await queryClient.invalidateQueries({ queryKey: measurementQueryRootKey });
};
