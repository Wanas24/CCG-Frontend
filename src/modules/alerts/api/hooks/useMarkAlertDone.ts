import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { alertService } from "../services/alert.service";
import type { TAlertActionResponse } from "../../types";

type ApiError = { message: string };

export const useMarkAlertDone = () =>
  useMutation<TAlertActionResponse, AxiosError<ApiError>, number>({
    mutationFn: alertService.done,
  });
