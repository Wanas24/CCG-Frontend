import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type {
  TCreateClientRequest,
  TCreateClientResponse,
} from "../../types/client";

type ApiError = { message: string };

export const useCreateClient = () =>
  useMutation<
    TCreateClientResponse,
    AxiosError<ApiError>,
    TCreateClientRequest
  >({
    mutationFn: clientService.create,
  });
