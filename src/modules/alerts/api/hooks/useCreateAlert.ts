import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { alertService } from "../services/alert.service";
import type { TCreateAlertRequest, TCreateAlertResponse } from "../../types";

type ApiError = { message: string };

export const useCreateAlert = () =>
  useMutation<TCreateAlertResponse, AxiosError<ApiError>, TCreateAlertRequest>({
    mutationFn: alertService.create,
  });
