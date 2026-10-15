import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type { TDeleteClientFileResponse } from "../../types/clientFile";

type ApiError = { message: string };

export const useDeleteClientFile = () =>
  useMutation<TDeleteClientFileResponse, AxiosError<ApiError>, number>({
    mutationFn: clientService.deleteFile,
  });
