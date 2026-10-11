import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { measurementService } from "../services/measurement.service";
import type {
  TMeasurementUpdateRequest,
  TUpdateMeasurementResponse,
} from "../../types/measurement";

type ApiError = { message: string };

export const useUpdateMeasurement = () =>
  useMutation<
    TUpdateMeasurementResponse,
    AxiosError<ApiError>,
    TMeasurementUpdateRequest
  >({
    mutationFn: measurementService.update,
  });
