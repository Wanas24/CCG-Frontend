import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type {
  TUpdateClientRequest,
  TUpdateClientResponse,
} from "../../types/client";

type ApiError = { message: string };

export const useUpdateClient = () =>
  useMutation<
    TUpdateClientResponse,
    AxiosError<ApiError>,
    TUpdateClientRequest
  >({
    mutationFn: clientService.update,
  });
