import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { measurementService } from "../services/measurement.service";
import type {
  TCreateMeasurementResponse,
  TMeasurementCreateRequest,
} from "../../types/measurement";

type ApiError = { message: string };

export const useCreateMeasurement = () =>
  useMutation<
    TCreateMeasurementResponse,
    AxiosError<ApiError>,
    TMeasurementCreateRequest
  >({
    mutationFn: measurementService.create,
  });
