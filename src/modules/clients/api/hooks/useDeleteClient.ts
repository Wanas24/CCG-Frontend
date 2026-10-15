import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type { TDeleteClientResponse } from "../../types/client";

type ApiError = { message: string };

export const useDeleteClient = () =>
  useMutation<TDeleteClientResponse, AxiosError<ApiError>, number>({
    mutationFn: clientService.delete,
  });
