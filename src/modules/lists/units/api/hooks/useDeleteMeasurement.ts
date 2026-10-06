import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { measurementService } from "../services/measurement.service";
import type { TDeleteMeasurementResponse } from "../../types/measurement";

type ApiError = { message: string };

export const useDeleteMeasurement = () =>
  useMutation<TDeleteMeasurementResponse, AxiosError<ApiError>, number>({
    mutationFn: measurementService.delete,
  });
